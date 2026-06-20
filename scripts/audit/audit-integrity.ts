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
import { fileURLToPath } from "node:url";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import { shuffle } from "../../lib/shuffle";
import { stripCompileManifests } from "../../lib/case-completeness";
import { normalizeBankPresentations } from "../../lib/presentation-normalization";
import { DRAFT_DIR, STAGING_DIR } from "../../lib/pipeline-paths";
import type { AuditResult } from "./types";
import type { Question } from "../../src/types";

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

export type IntegrityFailure = { id: string; reason: string };

export type IntegrityOutcome =
  | { kind: "checked"; failures: IntegrityFailure[] }
  | { kind: "missingPromoted" }
  | { kind: "draftInvalid"; reasons: string[] }
  | { kind: "promotedInvalid"; reasons: string[] };

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

const parseAndStrip = (text: string) => stripCompileManifests(parseBankText(text));

/** Pure: parse -> strip -> validate -> compare. No disk I/O. */
export function integrityForFile(
  draftText: string,
  promotedText: string | null,
): IntegrityOutcome {
  if (promotedText === null) return { kind: "missingPromoted" };

  let draftRaw: unknown;
  try {
    draftRaw = parseAndStrip(draftText);
  } catch (error) {
    return { kind: "draftInvalid", reasons: [error instanceof Error ? error.message : String(error)] };
  }

  const draftResult = validateBankObject(draftRaw);
  if (!draftResult.ok) return { kind: "draftInvalid", reasons: draftResult.reasons };

  let promotedRaw: unknown;
  try {
    promotedRaw = parseAndStrip(promotedText);
  } catch (error) {
    return { kind: "promotedInvalid", reasons: [error instanceof Error ? error.message : String(error)] };
  }

  const promotedResult = validateBankObject(promotedRaw);
  if (!promotedResult.ok) return { kind: "promotedInvalid", reasons: promotedResult.reasons };

  const promotedById = new Map(promotedResult.value.questions.map((q) => [q.id, q]));
  const failures: IntegrityFailure[] = [];

  for (const draftQ of draftResult.value.questions) {
    const promotedQ = promotedById.get(draftQ.id);
    if (!promotedQ) {
      failures.push({ id: draftQ.id, reason: "present in draft but missing from promoted bank" });
      continue;
    }
    failures.push(...checkQuestion(draftQ, promotedQ));
  }

  const draftById = new Map(draftResult.value.questions.map((q) => [q.id, q]));
  for (const promotedQ of promotedResult.value.questions) {
    if (!draftById.has(promotedQ.id)) {
      failures.push({ id: promotedQ.id, reason: "present in promoted bank but missing from draft — manual addition?" });
    }
  }

  return { kind: "checked", failures };
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
  let missingPromoted = 0;
  const draftValidationFailed: string[] = [];
  const promotedValidationFailed: string[] = [];

  for (const filename of draftFiles) {
    const promotedPath = join(STAGING_DIR, filename);

    let promotedText: string | null;
    try {
      promotedText = await readFile(promotedPath, "utf8");
    } catch {
      promotedText = null;
    }

    const draftText = await readFile(join(DRAFT_DIR, filename), "utf8");
    const outcome = integrityForFile(draftText, promotedText);

    if (outcome.kind === "missingPromoted") {
      missingPromoted++;
      lines.push(`${filename}: no promoted file found — run 'npm run promote'`);
    } else if (outcome.kind === "draftInvalid") {
      draftValidationFailed.push(filename);
      lines.push(`${filename}: draft failed validation mid-integrity (should not happen post-strip): ${outcome.reasons.join("; ")}`);
    } else if (outcome.kind === "promotedInvalid") {
      promotedValidationFailed.push(filename);
      lines.push(`${filename}: promoted failed validation mid-integrity: ${outcome.reasons.join("; ")}`);
    } else {
      checked++;
      for (const f of outcome.failures) {
        failures.push(f.id);
        lines.push(`${f.id}: ${f.reason}`);
      }
    }
  }

  const uniqueFailures = [
    ...new Set([...draftValidationFailed, ...promotedValidationFailed, ...failures]),
  ];
  const status = uniqueFailures.length > 0 ? "FAIL" : "PASS";

  const summary =
    status === "PASS"
      ? `Integrity verified for ${checked} draft file(s). ${missingPromoted} not yet promoted.`
      : [
          `${uniqueFailures.length} item/file(s) failed integrity check (checked ${checked} file(s), ${missingPromoted} not yet promoted).`,
          ...lines,
        ].join("\n");

  return { name: "audit:integrity", status, failures: uniqueFailures, detail: summary };
}

// Standalone entry point
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = await runAuditIntegrity();
  console.log(`[${result.status}] ${result.name}`);
  console.log(result.detail);
  if (result.status === "FAIL") process.exit(1);
}
