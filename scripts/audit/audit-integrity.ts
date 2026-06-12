/**
 * Tier 1 — shuffle-integrity equality check.
 *
 * For every JSON file that exists in both banks/banks-raw/ (draft) and banks/
 * (promoted, same filename), this check recomputes the promotion shuffle plus
 * canonical presentation normalization and asserts deep equality with the
 * committed promoted version.
 *
 * Catches:
 *   - Manual post-promotion edits to the promoted bank
 *   - Bypasses of the promoter (hand-editing the options order)
 *   - Any nondeterminism in the shuffle function
 *
 * Files in banks/ with no corresponding banks-raw/ file are skipped (they
 * pre-date this workflow and cannot be verified here).
 *
 * Can be run standalone:  tsx scripts/audit/audit-integrity.ts
 */

import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import { shuffle } from "../../lib/shuffle";
import { normalizeBankPresentations } from "../../lib/presentation-normalization";
import type { AuditResult } from "./types";
import type { Question } from "../../src/types";

const DRAFT_DIR = "banks/banks-raw";
const PROMOTED_DIR = "banks";

/** Deep equality via JSON serialization — sufficient for plain data objects. */
function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Collect all leaf question IDs from a question (recurses into case studies). */
function questionIds(q: Question): string[] {
  if (q.itemType === "case_study") {
    return [q.id, ...q.caseStudy.questions.flatMap(questionIds)];
  }
  return [q.id];
}

type IntegrityFailure = { id: string; reason: string };

function expectedQuestion(draft: Question): Question {
  return normalizeBankPresentations({ questions: [shuffle(draft)] }).bank.questions[0];
}

function checkQuestion(draft: Question, promoted: Question): IntegrityFailure[] {
  const expected = expectedQuestion(draft);
  if (deepEqual(expected, promoted)) return [];

  // Recurse into case studies for finer-grained failure reporting
  if (draft.itemType === "case_study" && promoted.itemType === "case_study") {
    const nestedFailures: IntegrityFailure[] = [];
    const promotedById = new Map(promoted.caseStudy.questions.map((q) => [q.id, q]));

    for (const draftNested of draft.caseStudy.questions) {
      const promotedNested = promotedById.get(draftNested.id);
      if (!promotedNested) {
        nestedFailures.push({ id: draftNested.id, reason: "missing from promoted case study" });
        continue;
      }
      nestedFailures.push(...checkQuestion(draftNested, promotedNested));
    }

    // If nested check is clean but parent still differs, report at the parent level
    if (nestedFailures.length === 0) {
      return [{ id: draft.id, reason: "case study differs from expected normalized promotion output (non-option fields)" }];
    }
    return nestedFailures;
  }

  // For option-type items, report what specifically differs
  if ("options" in draft && "options" in promoted) {
    const expectedShuffle = expected as typeof draft & { options: Array<{ id: string }> };
    const promotedWithOptions = promoted as typeof promoted & { options: Array<{ id: string }> };
    if (JSON.stringify(expectedShuffle.options.map((o) => o.id)) !== JSON.stringify(promotedWithOptions.options.map((o) => o.id))) {
      const expOrder = (expectedShuffle.options as Array<{ id: string }>).map((o) => o.id).join("");
      const gotOrder = (promotedWithOptions.options as Array<{ id: string }>).map((o) => o.id).join("");
      return [{ id: draft.id, reason: `options order mismatch: expected [${expOrder}] got [${gotOrder}]` }];
    }
    return [{ id: draft.id, reason: "differs from expected normalized promotion output (non-option fields changed post-promotion)" }];
  }

  return [{ id: draft.id, reason: "differs from expected normalized promotion output" }];
}

export async function runAuditIntegrity(): Promise<AuditResult> {
  let draftFiles: string[];
  try {
    draftFiles = (await readdir(DRAFT_DIR)).filter((f) => f.endsWith(".json")).sort();
  } catch {
    return {
      name: "audit:integrity",
      status: "INSUFFICIENT",
      failures: [],
      detail: `Draft directory ${DRAFT_DIR} not found or not readable. Run 'npm run promote' to establish the pipeline.`,
    };
  }

  if (draftFiles.length === 0) {
    return {
      name: "audit:integrity",
      status: "INSUFFICIENT",
      failures: [],
      detail: `No draft files found in ${DRAFT_DIR}. Nothing to verify.`,
    };
  }

  const failures: string[] = [];
  const lines: string[] = [];
  let checked = 0;
  let skipped = 0;

  for (const filename of draftFiles) {
    const promotedPath = join(PROMOTED_DIR, filename);

    // Check whether the promoted file exists
    let promotedText: string;
    try {
      promotedText = await readFile(promotedPath, "utf8");
    } catch {
      skipped++;
      lines.push(`${filename}: no promoted file found — run 'npm run promote'`);
      continue;
    }

    const draftText = await readFile(join(DRAFT_DIR, filename), "utf8");

    const draftResult = validateBankObject(parseBankText(draftText));
    const promotedResult = validateBankObject(parseBankText(promotedText));

    if (!draftResult.ok || !promotedResult.ok) {
      // Structural failures are Tier 0's domain; skip here
      skipped++;
      continue;
    }

    const draftById = new Map(draftResult.value.questions.map((q) => [q.id, q]));
    const promotedById = new Map(promotedResult.value.questions.map((q) => [q.id, q]));

    // Every question in the draft must appear (shuffled) in the promoted bank
    for (const draftQ of draftResult.value.questions) {
      const promotedQ = promotedById.get(draftQ.id);
      if (!promotedQ) {
        failures.push(draftQ.id);
        lines.push(`${draftQ.id}: present in draft but missing from promoted bank`);
        continue;
      }

      const itemFailures = checkQuestion(draftQ, promotedQ);
      for (const f of itemFailures) {
        failures.push(f.id);
        lines.push(`${f.id}: ${f.reason}`);
      }
    }

    // Items in promoted that have no draft counterpart are suspicious
    for (const promotedQ of promotedResult.value.questions) {
      if (!draftById.has(promotedQ.id)) {
        failures.push(promotedQ.id);
        lines.push(`${promotedQ.id}: present in promoted bank but missing from draft — manual addition?`);
      }
    }

    checked++;
  }

  const uniqueFailures = [...new Set(failures)];
  const status = uniqueFailures.length > 0 ? "FAIL" : "PASS";

  const summary =
    status === "PASS"
      ? `Integrity verified for ${checked} draft file(s)${skipped > 0 ? ` (${skipped} skipped — not yet promoted)` : ""}.`
      : [
          `${uniqueFailures.length} item(s) failed integrity check (checked ${checked} file(s), skipped ${skipped}).`,
          ...lines,
        ].join("\n");

  return { name: "audit:integrity", status, failures: uniqueFailures, detail: summary };
}

// Standalone entry point
if (process.argv[1]?.includes("audit-integrity")) {
  const result = await runAuditIntegrity();
  console.log(`[${result.status}] ${result.name}`);
  console.log(result.detail);
  if (result.status === "FAIL") process.exit(1);
}
