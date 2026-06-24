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
import { join } from "node:path";
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

export async function runAuditPositions(): Promise<AuditResult> {
  const files = (await readdir(PROMOTED_DIR)).filter((f) => f.endsWith(".json")).sort();

  // positions[numOptions] = array of 0-based correct-answer position indices
  const positionsByOptionCount = new Map<number, number[]>();

  for (const filename of files) {
    try {
      const text = await readFile(join(PROMOTED_DIR, filename), "utf8");
      const raw = parseBankText(text);
      const result = validateBankObject(raw, { rejectUnknownKeys: true });
      if (!result.ok) continue;

      for (const q of result.value.questions) {
        if (q.itemType !== "multiple_choice") continue;
        const mc = q as MultipleChoiceQuestion;
        const correctId = mc.correct[0];
        const pos = mc.options.findIndex((opt) => opt.id === correctId);
        if (pos === -1) continue;

        const n = mc.options.length;
        if (!positionsByOptionCount.has(n)) positionsByOptionCount.set(n, []);
        positionsByOptionCount.get(n)!.push(pos);
      }
    } catch {
      // skip; Tier 0 owns structural failures
    }
  }

  if (positionsByOptionCount.size === 0) {
    return {
      name: "audit:positions",
      status: "INSUFFICIENT",
      failures: [],
      detail: "No multiple_choice items found in the promoted bank.",
    };
  }

  const groups: GroupResult[] = [];
  for (const [numOptions, positions] of [...positionsByOptionCount.entries()].sort()) {
    groups.push(analyzeGroup(numOptions, positions));
  }

  const overallFail = groups.some((g) => g.status === "FAIL");
  const overallInsufficient = !overallFail && groups.every((g) => g.status === "INSUFFICIENT");
  const status: CheckStatus = overallFail ? "FAIL" : overallInsufficient ? "INSUFFICIENT" : "PASS";

  const lines: string[] = [];
  for (const g of groups) {
    const histogram = g.counts.map((c, i) => `slot${i}=${c}`).join(", ");
    lines.push(`  ${g.numOptions}-option MC (n=${g.total}): [${histogram}] ${g.note} → ${g.status}`);
  }

  const detail = [`Distribution check (${groups.map((g) => `${g.numOptions}-opt`).join(", ")}):`, ...lines].join("\n");

  return { name: "audit:positions", status, failures: [], detail };
}

// Standalone entry point
if (process.argv[1]?.includes("audit-positions")) {
  const result = await runAuditPositions();
  console.log(`[${result.status}] ${result.name}`);
  console.log(result.detail);
  if (result.status === "FAIL") process.exit(1);
}
