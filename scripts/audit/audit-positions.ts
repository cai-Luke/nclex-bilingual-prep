/**
 * Tier 1 — distribution regression sanity check.
 *
 * Builds a histogram of the correct-answer position (0-based array index) for
 * every multiple_choice item in the promoted bank. Runs a chi-square test
 * against a uniform distribution, grouped by option count.
 *
 * FAIL   — p < 0.01 AND max deviation from expected > 8 percentage points.
 * INSUFFICIENT — any expected cell count < 5 (too few items to be meaningful).
 *
 * This is a cheap regression guard, not a proof of randomness. It catches a
 * broken seed or a non-code edit that knocked all correct answers to one slot.
 *
 * Can be run standalone:  tsx scripts/audit/audit-positions.ts
 */

import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { dedupeSelectedFilePaths } from "../../lib/selected-file-paths";
import { collectScoredLeaves } from "../../lib/question-population";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import type { AuditResult, CheckStatus } from "./types";
import type { MultipleChoiceQuestion } from "../../src/types";

const PROMOTED_DIR = "banks";

// Chi-square critical values at p = 0.01 (one-tailed, upper)
// Key = degrees of freedom = (numOptions - 1)
const CHI_SQ_CRITICAL_P01: Record<number, number> = {
  2: 9.210,
  3: 11.345,
  4: 13.277,
};

const MAX_DEVIATION_PP = 0.08; // 8 percentage points

function chiSquare(observed: number[], expected: number): number {
  return observed.reduce((sum, o) => sum + (o - expected) ** 2 / expected, 0);
}

type GroupResult = {
  numOptions: number;
  counts: number[];     // count per position index
  total: number;
  chiSq: number;
  maxDeviation: number; // as a fraction (0.08 = 8pp)
  status: CheckStatus;
  note: string;
};

function analyzeGroup(numOptions: number, positions: number[]): GroupResult {
  const counts = Array<number>(numOptions).fill(0);
  for (const pos of positions) counts[pos] = (counts[pos] ?? 0) + 1;

  const total = positions.length;
  const expected = total / numOptions;

  if (expected < 5) {
    return {
      numOptions,
      counts,
      total,
      chiSq: 0,
      maxDeviation: 0,
      status: "INSUFFICIENT",
      note: `Expected count per slot (${expected.toFixed(1)}) < 5; chi-square not meaningful with ${total} items.`,
    };
  }

  const chiSq = chiSquare(counts, expected);
  const maxDeviation = Math.max(...counts.map((c) => Math.abs(c / total - 1 / numOptions)));
  const critical = CHI_SQ_CRITICAL_P01[numOptions - 1];

  const fail = critical !== undefined && chiSq > critical && maxDeviation > MAX_DEVIATION_PP;
  const status: CheckStatus = fail ? "FAIL" : "PASS";
  const pStr = critical !== undefined ? `(critical=${critical} at p=0.01)` : "(no table entry)";
  const note = `χ²=${chiSq.toFixed(3)} ${pStr}, max deviation=${(maxDeviation * 100).toFixed(1)}pp`;

  return { numOptions, counts, total, chiSq, maxDeviation, status, note };
}

export type RunAuditPositionsOptions = {
  /** Audit exactly these file paths instead of sweeping the default directory.
   *  Fails loud: a missing, unreadable, unparseable, or schema-invalid selected
   *  file is never silently skipped. */
  files?: string[];
  /** Include embedded case-study multiple-choice leaves. Explicit raw-gate use only;
   *  the established canonical sweep remains top-level-only. */
  includeEmbeddedScoredLeaves?: boolean;
};

function buildResult(
  positionsByOptionCount: Map<number, number[]>,
  explicit: boolean,
): AuditResult {
  if (positionsByOptionCount.size === 0) {
    return {
      name: "audit:positions",
      status: "INSUFFICIENT",
      failures: [],
      detail: explicit
        ? "No multiple_choice items found in the explicitly selected files."
        : "No multiple_choice items found in the promoted bank.",
    };
  }

  const groups: GroupResult[] = [];
  for (const [numOptions, positions] of [...positionsByOptionCount.entries()].sort()) {
    groups.push(analyzeGroup(numOptions, positions));
  }

  const overallFail = groups.some((group) => group.status === "FAIL");
  const overallInsufficient = !overallFail && groups.every((group) => group.status === "INSUFFICIENT");
  const status: CheckStatus = overallFail ? "FAIL" : overallInsufficient ? "INSUFFICIENT" : "PASS";

  const lines: string[] = [];
  for (const group of groups) {
    const histogram = group.counts.map((count, index) => `slot${index}=${count}`).join(", ");
    lines.push(`  ${group.numOptions}-option MC (n=${group.total}): [${histogram}] ${group.note} → ${group.status}`);
  }

  const detail = [`Distribution check (${groups.map((group) => `${group.numOptions}-opt`).join(", ")}):`, ...lines].join("\n");
  return { name: "audit:positions", status, failures: [], detail };
}

function collectPositions(
  questions: readonly MultipleChoiceQuestion[],
  positionsByOptionCount: Map<number, number[]>,
): void {
  for (const question of questions) {
    const correctId = question.correct[0];
    const position = question.options.findIndex((option) => option.id === correctId);
    if (position === -1) continue;
    const optionCount = question.options.length;
    if (!positionsByOptionCount.has(optionCount)) positionsByOptionCount.set(optionCount, []);
    positionsByOptionCount.get(optionCount)!.push(position);
  }
}

async function runDefaultSweep(): Promise<AuditResult> {
  const files = (await readdir(PROMOTED_DIR)).filter((f) => f.endsWith(".json")).sort();

  // positions[numOptions] = array of 0-based correct-answer position indices
  const positionsByOptionCount = new Map<number, number[]>();

  for (const filename of files) {
    try {
      const text = await readFile(join(PROMOTED_DIR, filename), "utf8");
      const raw = parseBankText(text);
      const result = validateBankObject(raw, { rejectUnknownKeys: true });
      if (!result.ok) continue;

      collectPositions(
        result.value.questions.filter(
          (question): question is MultipleChoiceQuestion => question.itemType === "multiple_choice",
        ),
        positionsByOptionCount,
      );
    } catch {
      // skip; Tier 0 owns structural failures
    }
  }

  return buildResult(positionsByOptionCount, false);
}

async function runSelectedFiles(
  files: string[],
  includeEmbeddedScoredLeaves: boolean,
): Promise<AuditResult> {
  const selected = dedupeSelectedFilePaths(files);
  const positionsByOptionCount = new Map<number, number[]>();
  const loadFailures: string[] = [];

  for (const { resolvedPath, displayPath } of selected) {
    try {
      const raw = parseBankText(await readFile(resolvedPath, "utf8"));
      const result = validateBankObject(raw, { rejectUnknownKeys: true });
      if (!result.ok) {
        loadFailures.push(`${displayPath}: schema validation failed — ${result.reasons.join("; ")}`);
        continue;
      }
      const population = includeEmbeddedScoredLeaves
        ? collectScoredLeaves(result.value.questions)
        : result.value.questions;
      collectPositions(
        population.filter(
          (question): question is MultipleChoiceQuestion => question.itemType === "multiple_choice",
        ),
        positionsByOptionCount,
      );
    } catch (error) {
      loadFailures.push(`${displayPath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (loadFailures.length > 0) {
    return {
      name: "audit:positions",
      status: "FAIL",
      failures: [],
      detail: [
        `${loadFailures.length} explicitly selected file(s) could not be loaded or failed schema validation.`,
        ...loadFailures,
      ].join("\n"),
    };
  }
  return buildResult(positionsByOptionCount, true);
}

export async function runAuditPositions(options: RunAuditPositionsOptions = {}): Promise<AuditResult> {
  if (options.files === undefined) return runDefaultSweep();
  if (options.files.length === 0) {
    return {
      name: "audit:positions",
      status: "FAIL",
      failures: [],
      detail: "Explicit file selection is empty.",
    };
  }
  return runSelectedFiles(options.files, options.includeEmbeddedScoredLeaves ?? false);
}

function parseCliArgs(argv: string[]): RunAuditPositionsOptions {
  const files: string[] = [];
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] !== "--file") throw new Error(`Unknown argument: ${argv[index]}`);
    const value = argv[index + 1];
    if (value === undefined) throw new Error("--file requires a path argument");
    if (value.trim() === "") throw new Error("--file requires a non-empty path argument");
    files.push(value);
    index += 1;
  }
  return { files: files.length > 0 ? files : undefined };
}

async function runCli(): Promise<void> {
  let options: RunAuditPositionsOptions;
  try {
    options = parseCliArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    return;
  }
  const result = await runAuditPositions(options);
  console.log(`[${result.status}] ${result.name}`);
  console.log(result.detail);
  if (result.status === "FAIL") process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await runCli();
