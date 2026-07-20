/**
 * Advisory — case-study stage reference integrity and anchor-omission leakage.
 *
 * The live renderer (`src/examLayout.ts` `getVisibleCaseStages`) is cumulative and
 * fail-open: for a staged case, if a part's `answerableAfterStageId` resolves, it
 * reveals stages 0..that index; else if `stageId` resolves, same; else it reveals
 * ALL stages. This audit flags two distinct problems:
 *
 *   - `unresolved`: a `stageId` or `answerableAfterStageId` value is present but
 *     does not match any declared `caseStudy.stages[].id` (a likely typo).
 *   - `revealsAllStages`: neither anchor resolves (present-but-unresolved, or
 *     entirely absent) on a part whose case declares stages, so the renderer
 *     falls through to its fail-open branch and exposes the entire unfolding
 *     case at that part. This is the anchor-omission leak.
 *   - `missingRequiredAnchor` (only under `--strict`): `answerableAfterStageId`
 *     is absent even though the legacy `stageId` resolves. Not a leak — the
 *     renderer still gates correctly — but non-conformant with the producer
 *     contract's requirement that every staged part carry the primary anchor.
 *
 * Can be run standalone:  tsx scripts/audit/audit-stage-refs.ts [--strict] [--file <path> ...]
 */

import { readFile, readdir } from "node:fs/promises";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import type { AuditResult, CheckStatus } from "./types";
import type { BankEnvelope, CaseStudyQuestion, CaseSubQuestion } from "../../src/types";

const PROMOTED_DIR = "banks";

export type AnchorFieldState = { status: "absent" } | { status: "unresolved"; value: string };

export type StageReferenceFinding =
  | {
      kind: "unresolved";
      file: string;
      parentId: string;
      partId: string;
      field: "stageId" | "answerableAfterStageId";
      value: string;
      validStageIds: string[];
    }
  | {
      kind: "revealsAllStages";
      file: string;
      parentId: string;
      partId: string;
      anchorState: {
        answerableAfterStageId: AnchorFieldState;
        stageId: AnchorFieldState;
      };
      validStageIds: string[];
    }
  | {
      kind: "missingRequiredAnchor";
      file: string;
      parentId: string;
      partId: string;
      resolvedStageId: string;
      validStageIds: string[];
    };

export type FindStageReferenceFindingsOptions = {
  strict?: boolean;
};

function collectPartFindings(
  file: string,
  parentId: string,
  part: CaseSubQuestion,
  validStageIds: string[],
  validStageIdSet: Set<string>,
  strict: boolean,
): StageReferenceFinding[] {
  const findings: StageReferenceFinding[] = [];

  const aDefined = part.answerableAfterStageId !== undefined;
  const aResolves = aDefined && validStageIdSet.has(part.answerableAfterStageId!);
  const sDefined = part.stageId !== undefined;
  const sResolves = sDefined && validStageIdSet.has(part.stageId!);

  if (aDefined && !aResolves) {
    findings.push({
      kind: "unresolved",
      file,
      parentId,
      partId: part.id,
      field: "answerableAfterStageId",
      value: part.answerableAfterStageId!,
      validStageIds,
    });
  }
  if (sDefined && !sResolves) {
    findings.push({
      kind: "unresolved",
      file,
      parentId,
      partId: part.id,
      field: "stageId",
      value: part.stageId!,
      validStageIds,
    });
  }

  // The leak (and the strict conformance check) only apply to staged cases.
  // An unstaged case has nothing for the renderer to hide.
  if (validStageIds.length === 0) return findings;

  if (!aResolves && !sResolves) {
    findings.push({
      kind: "revealsAllStages",
      file,
      parentId,
      partId: part.id,
      anchorState: {
        answerableAfterStageId: aDefined
          ? { status: "unresolved", value: part.answerableAfterStageId! }
          : { status: "absent" },
        stageId: sDefined ? { status: "unresolved", value: part.stageId! } : { status: "absent" },
      },
      validStageIds,
    });
  } else if (strict && !aDefined && sResolves) {
    findings.push({
      kind: "missingRequiredAnchor",
      file,
      parentId,
      partId: part.id,
      resolvedStageId: part.stageId!,
      validStageIds,
    });
  }

  return findings;
}

function collectCaseStudyStageReferenceFindings(
  question: CaseStudyQuestion,
  file: string,
  strict: boolean,
): StageReferenceFinding[] {
  const validStageIds = (question.caseStudy.stages ?? []).map((stage) => stage.id);
  const validStageIdSet = new Set(validStageIds);
  const findings: StageReferenceFinding[] = [];

  for (const part of question.caseStudy.questions) {
    findings.push(
      ...collectPartFindings(file, question.id, part, validStageIds, validStageIdSet, strict),
    );
  }

  return findings;
}

const kindOrder: Record<StageReferenceFinding["kind"], number> = {
  unresolved: 0,
  revealsAllStages: 1,
  missingRequiredAnchor: 2,
};

export function findStageReferenceFindings(
  banks: Array<{ bank: BankEnvelope; file: string }>,
  options: FindStageReferenceFindingsOptions = {},
): StageReferenceFinding[] {
  const strict = options.strict ?? false;
  return banks
    .flatMap(({ bank, file }) =>
      bank.questions.flatMap((question) =>
        question.itemType === "case_study"
          ? collectCaseStudyStageReferenceFindings(question, file, strict)
          : [],
      ),
    )
    .sort(
      (left, right) =>
        left.file.localeCompare(right.file) ||
        left.parentId.localeCompare(right.parentId) ||
        left.partId.localeCompare(right.partId) ||
        (kindOrder[left.kind] - kindOrder[right.kind]) ||
        (left.kind === "unresolved" && right.kind === "unresolved"
          ? left.field.localeCompare(right.field)
          : 0),
    );
}

function describeAnchorField(state: AnchorFieldState): string {
  return state.status === "absent" ? "(no anchor)" : `unresolved="${state.value}"`;
}

function renderFinding(finding: StageReferenceFinding): string {
  const valid = finding.validStageIds.length > 0 ? finding.validStageIds.join(",") : "(none declared)";
  const header = `${finding.file}: ${finding.parentId} > ${finding.partId} [${finding.kind}]`;

  if (finding.kind === "unresolved") {
    return [
      header,
      `  ${finding.field}="${finding.value}" does not match any declared stage id.`,
      `  valid stage ids: ${valid}`,
    ].join("\n");
  }

  if (finding.kind === "revealsAllStages") {
    return [
      header,
      "  neither anchor resolves; the renderer's fail-open branch reveals ALL stages at this part.",
      `  answerableAfterStageId: ${describeAnchorField(finding.anchorState.answerableAfterStageId)}`,
      `  stageId: ${describeAnchorField(finding.anchorState.stageId)}`,
      `  valid stage ids: ${valid}`,
    ].join("\n");
  }

  return [
    header,
    `  answerableAfterStageId is absent (required by the producer contract); this part currently ` +
      `resolves only via legacy stageId="${finding.resolvedStageId}".`,
    `  valid stage ids: ${valid}`,
  ].join("\n");
}

function buildResult(
  findings: StageReferenceFinding[],
  fileCount: number,
  strict: boolean,
): AuditResult {
  if (findings.length === 0) {
    return {
      name: "audit:stage-refs",
      status: "PASS",
      failures: [],
      detail: `All embedded case-study stage references resolve across ${fileCount} bank file(s).`,
    };
  }

  const counts = {
    unresolved: findings.filter((f) => f.kind === "unresolved").length,
    revealsAllStages: findings.filter((f) => f.kind === "revealsAllStages").length,
    missingRequiredAnchor: findings.filter((f) => f.kind === "missingRequiredAnchor").length,
  };

  const status: CheckStatus = strict && counts.revealsAllStages > 0 ? "FAIL" : "WARN";
  const failures = [...new Set(findings.map((finding) => finding.parentId))];

  const detail = [
    `${findings.length} finding(s) across ${fileCount} bank file(s): ${counts.unresolved} unresolved, ` +
      `${counts.revealsAllStages} revealsAllStages (leak), ${counts.missingRequiredAnchor} missingRequiredAnchor.`,
    ...findings.map(renderFinding),
  ].join("\n");

  return { name: "audit:stage-refs", status, failures, detail };
}

async function loadBank(
  filePath: string,
  label: string,
): Promise<{ ok: true; bank: BankEnvelope } | { ok: false; reason: string }> {
  try {
    const text = await readFile(filePath, "utf8");
    const raw = parseBankText(text);
    const result = validateBankObject(raw, { rejectUnknownKeys: true });
    if (!result.ok) {
      return { ok: false, reason: `${label}: schema validation failed — ${result.reasons.join("; ")}` };
    }
    return { ok: true, bank: result.value };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: `${label}: ${message}` };
  }
}

async function runCanonicalSweep(strict: boolean): Promise<AuditResult> {
  let filenames: string[];
  try {
    filenames = (await readdir(PROMOTED_DIR)).filter((file) => file.endsWith(".json")).sort();
  } catch {
    return {
      name: "audit:stage-refs",
      status: "INSUFFICIENT",
      failures: [],
      detail: `Bank directory ${PROMOTED_DIR} not found or not readable.`,
    };
  }

  const banks: Array<{ bank: BankEnvelope; file: string }> = [];
  for (const filename of filenames) {
    const loaded = await loadBank(join(PROMOTED_DIR, filename), filename);
    // Tier 0 owns structural/parse failures for the canonical sweep: skip silently.
    if (loaded.ok) banks.push({ bank: loaded.bank, file: basename(filename) });
  }

  const findings = findStageReferenceFindings(banks, { strict });
  return buildResult(findings, filenames.length, strict);
}

async function runExplicitFiles(files: string[], strict: boolean): Promise<AuditResult> {
  const banks: Array<{ bank: BankEnvelope; file: string }> = [];
  const loadFailures: string[] = [];

  for (const filePath of files) {
    const label = basename(filePath);
    const loaded = await loadBank(filePath, filePath);
    if (loaded.ok) {
      banks.push({ bank: loaded.bank, file: label });
    } else {
      loadFailures.push(loaded.reason);
    }
  }

  if (loadFailures.length > 0) {
    return {
      name: "audit:stage-refs",
      status: "FAIL",
      failures: files.map((file) => basename(file)),
      detail: [
        `${loadFailures.length} of ${files.length} requested file(s) could not be loaded or failed schema validation.`,
        ...loadFailures,
      ].join("\n"),
    };
  }

  const findings = findStageReferenceFindings(banks, { strict });
  return buildResult(findings, files.length, strict);
}

export type RunAuditStageRefsOptions = {
  /** Audit exactly these file paths instead of sweeping banks/. Fails loud: a missing,
   * unreadable, unparseable, or schema-invalid selected file is never silently skipped. */
  files?: string[];
  /** Promote answerableAfterStageId-omission on a stageId-resolving part to a finding,
   * and promote any revealsAllStages finding to a FAIL status. */
  strict?: boolean;
};

/**
 * Pure and options-driven: does not read `process.argv` and does not mutate
 * `process.exitCode`. `scripts/audit.ts` calls this with no arguments, so that
 * path can only ever return PASS/WARN/INSUFFICIENT — never FAIL.
 */
export async function runAuditStageRefs(options: RunAuditStageRefsOptions = {}): Promise<AuditResult> {
  const strict = options.strict ?? false;
  if (options.files !== undefined) return runExplicitFiles(options.files, strict);
  return runCanonicalSweep(strict);
}

// ---------------------------------------------------------------------------
// Standalone CLI wrapper — argv parsing and process.exit live only here.
// ---------------------------------------------------------------------------

function parseCliArgs(argv: string[]): { files?: string[]; strict: boolean } {
  const files: string[] = [];
  let strict = false;
  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];
    if (arg === "--file") {
      const value = argv[i + 1];
      if (value === undefined) throw new Error("--file requires a path argument");
      if (value.trim() === "") throw new Error("--file requires a non-empty path argument");
      files.push(value);
      i += 2;
      continue;
    }
    if (arg === "--strict") {
      strict = true;
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  return { files: files.length > 0 ? files : undefined, strict };
}

async function runCli(): Promise<void> {
  let parsed: { files?: string[]; strict: boolean };
  try {
    parsed = parseCliArgs(process.argv.slice(2));
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
    return;
  }

  const result = await runAuditStageRefs(parsed);
  console.log(`[${result.status}] ${result.name}`);
  console.log(result.detail);
  if (result.failures.length > 0) console.log(`Related IDs: ${result.failures.join(", ")}`);

  if (result.status === "FAIL") process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await runCli();
