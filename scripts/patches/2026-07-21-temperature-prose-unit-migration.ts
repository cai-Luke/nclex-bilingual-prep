import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateBankObject } from "../../src/schema";
import { scanBundledTemperatureProse } from "../audit/temperature-prose-unit-survey";

type SurveyRow = {
  occurrenceId: string;
  bankPath: string;
  topLevelQuestionId: string;
  embeddedQuestionId: string | null;
  jsonPath: string;
  occurrenceIndex: number;
  startOffset: number;
  endOffset: number;
  matchedExpression: string;
  verbatimText: string;
  proposedExpression: string | null;
  disposition: string;
  parityClass: string;
};

type ReplacementOperation = {
  occurrenceId: string;
  occurrenceIndex: number;
  surveyMatchedExpression: string;
  exactResultingExpression: string;
};

type AdjudicationTarget = {
  bankPath: string;
  topLevelQuestionId: string;
  embeddedQuestionId: string | null;
  jsonPath: string;
  surveyOccurrenceIds: string[];
  applicationMode: "EXACT_EXPRESSION_REPLACEMENT" | "COMPLETE_FIELD_REWRITE";
  replacementOperations: ReplacementOperation[];
  completeOriginalFieldText: string;
  completeOriginalFieldSha256: string;
  completeResultingFieldText: string;
  completeResultingFieldSha256: string;
};

type AdjudicationDecision = {
  adjudicationId: string;
  status: string;
  inputResidualOccurrenceIds: string[];
  targets: AdjudicationTarget[];
};

type Operation = {
  authority: "SAFE_SUBSET" | "RESIDUAL_ADJUDICATION";
  occurrenceId: string;
  occurrenceIndex: number;
  startOffset: number;
  endOffset: number;
  before: string;
  after: string;
  adjudicationId: string | null;
};

type FieldPlan = {
  bankPath: string;
  topLevelQuestionId: string;
  embeddedQuestionId: string | null;
  jsonPath: string;
  original: string;
  result: string;
  operations: Operation[];
  completeRewriteAdjudicationId: string | null;
  consumedOccurrenceIds: string[];
};

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const auditDir = resolve(repoRoot, "audit/temperature-prose-unit-survey-2026-07-21");
const safePath = resolve(auditDir, "safe-mechanical-subset.jsonl");
const residualPath = resolve(auditDir, "review-residuals.jsonl");
const adjudicationPath = resolve(auditDir, "residual-adjudication.jsonl");
const manifestPath = resolve(auditDir, "manifest.jsonl");
const receiptPath = resolve(auditDir, "migration-receipt.json");
const write = process.argv.includes("--write");

function lines<T>(path: string): T[] {
  return readFileSync(path, "utf8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as T);
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function fileSha256(path: string): string {
  return sha256(readFileSync(path, "utf8"));
}

function pathParts(jsonPath: string): Array<string | number> {
  const parts: Array<string | number> = [];
  for (const match of jsonPath.matchAll(/([A-Za-z_][A-Za-z0-9_]*)|\[(\d+)\]/g)) {
    parts.push(match[1] ?? Number(match[2]));
  }
  return parts;
}

function getAtPath(root: unknown, jsonPath: string): unknown {
  let current = root;
  for (const part of pathParts(jsonPath)) {
    if (current === null || typeof current !== "object") {
      throw new Error(`Cannot traverse ${jsonPath} at ${String(part)}`);
    }
    current = (current as Record<string | number, unknown>)[part];
  }
  return current;
}

function setAtPath(root: unknown, jsonPath: string, value: string): void {
  const parts = pathParts(jsonPath);
  let current = root;
  for (const part of parts.slice(0, -1)) {
    if (current === null || typeof current !== "object") {
      throw new Error(`Cannot traverse ${jsonPath} at ${String(part)}`);
    }
    current = (current as Record<string | number, unknown>)[part];
  }
  if (current === null || typeof current !== "object") throw new Error(`Cannot set ${jsonPath}`);
  (current as Record<string | number, unknown>)[parts.at(-1)!] = value;
}

function fieldKey(bankPath: string, jsonPath: string): string {
  return `${bankPath}\u0000${jsonPath}`;
}

function applyOperations(original: string, operations: Operation[], label: string): string {
  const sorted = [...operations].sort((a, b) => b.startOffset - a.startOffset || b.endOffset - a.endOffset);
  for (let index = 1; index < sorted.length; index += 1) {
    if (sorted[index - 1].startOffset < sorted[index].endOffset) {
      throw new Error(`${label}: overlapping operations ${sorted[index - 1].occurrenceId}/${sorted[index].occurrenceId}`);
    }
  }
  let result = original;
  for (const operation of sorted) {
    if (original.slice(operation.startOffset, operation.endOffset) !== operation.before) {
      throw new Error(`${label}: offset/preimage mismatch for ${operation.occurrenceId}`);
    }
    result = `${result.slice(0, operation.startOffset)}${operation.after}${result.slice(operation.endOffset)}`;
  }
  return result;
}

const safeRows = lines<SurveyRow>(safePath);
const residualRows = lines<SurveyRow>(residualPath);
const manifestRows = lines<SurveyRow>(manifestPath);
const decisions = lines<AdjudicationDecision>(adjudicationPath);

if (safeRows.length !== 468) throw new Error(`Expected 468 safe rows; found ${safeRows.length}`);
if (residualRows.length !== 15) throw new Error(`Expected 15 residual rows; found ${residualRows.length}`);
if (decisions.length !== 5) throw new Error(`Expected 5 adjudications; found ${decisions.length}`);

const surveyById = new Map([...safeRows, ...residualRows].map((row) => [row.occurrenceId, row]));
if (surveyById.size !== safeRows.length + residualRows.length) throw new Error("Duplicate survey occurrence ID");

const plans = new Map<string, FieldPlan>();
function ensurePlan(row: SurveyRow): FieldPlan {
  const key = fieldKey(row.bankPath, row.jsonPath);
  const existing = plans.get(key);
  if (existing) {
    if (
      existing.original !== row.verbatimText ||
      existing.topLevelQuestionId !== row.topLevelQuestionId ||
      existing.embeddedQuestionId !== row.embeddedQuestionId
    ) {
      throw new Error(`${row.occurrenceId}: field ownership/preimage mismatch`);
    }
    return existing;
  }
  const created: FieldPlan = {
    bankPath: row.bankPath,
    topLevelQuestionId: row.topLevelQuestionId,
    embeddedQuestionId: row.embeddedQuestionId,
    jsonPath: row.jsonPath,
    original: row.verbatimText,
    result: row.verbatimText,
    operations: [],
    completeRewriteAdjudicationId: null,
    consumedOccurrenceIds: [],
  };
  plans.set(key, created);
  return created;
}

for (const row of safeRows) {
  if (row.proposedExpression === null) throw new Error(`${row.occurrenceId}: safe row lacks proposal`);
  const plan = ensurePlan(row);
  plan.operations.push({
    authority: "SAFE_SUBSET",
    occurrenceId: row.occurrenceId,
    occurrenceIndex: row.occurrenceIndex,
    startOffset: row.startOffset,
    endOffset: row.endOffset,
    before: row.matchedExpression,
    after: row.proposedExpression,
    adjudicationId: null,
  });
  plan.consumedOccurrenceIds.push(row.occurrenceId);
}

const adjudicated = new Set<string>();
for (const decision of decisions) {
  if (decision.status !== "APPROVED_FOR_CLOSED_MIGRATION") {
    throw new Error(`${decision.adjudicationId}: not approved`);
  }
  for (const target of decision.targets) {
    if (sha256(target.completeOriginalFieldText) !== target.completeOriginalFieldSha256) {
      throw new Error(`${decision.adjudicationId}: original field hash mismatch`);
    }
    if (sha256(target.completeResultingFieldText) !== target.completeResultingFieldSha256) {
      throw new Error(`${decision.adjudicationId}: resulting field hash mismatch`);
    }
    const targetRows = target.surveyOccurrenceIds.map((id) => {
      const row = surveyById.get(id);
      if (!row || !residualRows.includes(row)) throw new Error(`${decision.adjudicationId}: unknown residual ${id}`);
      if (adjudicated.has(id)) throw new Error(`${decision.adjudicationId}: residual ${id} reused`);
      adjudicated.add(id);
      if (
        row.bankPath !== target.bankPath ||
        row.jsonPath !== target.jsonPath ||
        row.topLevelQuestionId !== target.topLevelQuestionId ||
        row.embeddedQuestionId !== target.embeddedQuestionId ||
        row.verbatimText !== target.completeOriginalFieldText
      ) {
        throw new Error(`${decision.adjudicationId}: target identity/preimage drift for ${id}`);
      }
      return row;
    });
    const plan = ensurePlan(targetRows[0]);
    if (target.applicationMode === "COMPLETE_FIELD_REWRITE") {
      if (plan.operations.length > 0 || plan.completeRewriteAdjudicationId !== null) {
        throw new Error(`${decision.adjudicationId}: complete rewrite conflicts with other operations`);
      }
      plan.completeRewriteAdjudicationId = decision.adjudicationId;
      plan.result = target.completeResultingFieldText;
      plan.consumedOccurrenceIds.push(...target.surveyOccurrenceIds);
      continue;
    }

    const residualOnlyOperations: Operation[] = [];
    for (const replacement of target.replacementOperations) {
      const row = surveyById.get(replacement.occurrenceId);
      if (!row || !target.surveyOccurrenceIds.includes(row.occurrenceId)) {
        throw new Error(`${decision.adjudicationId}: replacement is outside target residuals`);
      }
      if (
        row.occurrenceIndex !== replacement.occurrenceIndex ||
        row.matchedExpression !== replacement.surveyMatchedExpression
      ) {
        throw new Error(`${decision.adjudicationId}: occurrence index/expression drift`);
      }
      const operation: Operation = {
        authority: "RESIDUAL_ADJUDICATION",
        occurrenceId: row.occurrenceId,
        occurrenceIndex: row.occurrenceIndex,
        startOffset: row.startOffset,
        endOffset: row.endOffset,
        before: row.matchedExpression,
        after: replacement.exactResultingExpression,
        adjudicationId: decision.adjudicationId,
      };
      residualOnlyOperations.push(operation);
      plan.operations.push(operation);
      plan.consumedOccurrenceIds.push(row.occurrenceId);
    }
    const adjudicatedOnlyResult = applyOperations(
      target.completeOriginalFieldText,
      residualOnlyOperations,
      decision.adjudicationId,
    );
    if (adjudicatedOnlyResult !== target.completeResultingFieldText) {
      throw new Error(`${decision.adjudicationId}: resulting field does not match adjudication manifest`);
    }
  }
}

if (adjudicated.size !== residualRows.length) {
  throw new Error(`Adjudicated ${adjudicated.size}/${residualRows.length} residuals`);
}

for (const plan of plans.values()) {
  if (plan.completeRewriteAdjudicationId === null) {
    plan.result = applyOperations(plan.original, plan.operations, `${plan.bankPath}:${plan.jsonPath}`);
  }
  if (plan.original === plan.result) throw new Error(`${plan.bankPath}:${plan.jsonPath}: no-op plan`);
}

const bankPaths = [...new Set([...plans.values()].map((plan) => plan.bankPath))].sort();
const banks = new Map<string, unknown>();
for (const bankPath of bankPaths) {
  const absolute = resolve(repoRoot, bankPath);
  const raw = JSON.parse(readFileSync(absolute, "utf8"));
  const validation = validateBankObject(raw, { rejectUnknownKeys: true, requireMeta: true });
  if (!validation.ok) throw new Error(`${bankPath}: pre-migration validation failed:\n${validation.reasons.join("\n")}`);
  banks.set(bankPath, raw);
}

let originalFields = 0;
let appliedFields = 0;
for (const plan of plans.values()) {
  const current = getAtPath(banks.get(plan.bankPath), plan.jsonPath);
  if (current === plan.original) originalFields += 1;
  else if (current === plan.result) appliedFields += 1;
  else throw new Error(`${plan.bankPath}:${plan.jsonPath}: field matches neither authorized preimage nor result`);
}
if (originalFields > 0 && appliedFields > 0) {
  throw new Error(`Partial migration state rejected: original=${originalFields}, applied=${appliedFields}`);
}

function verifyPostMigration(): ReturnType<typeof scanBundledTemperatureProse> {
  const result = scanBundledTemperatureProse();
  const actionableSafe = result.rows.filter(
    (row) => row.disposition.startsWith("SAFE_") && row.proposedExpression !== row.matchedExpression,
  );
  const residuals = result.rows.filter(
    (row) => row.disposition !== "ALREADY_CANONICAL" && !row.disposition.startsWith("SAFE_"),
  );
  const expectedDeltaPaths = new Set([
    "questions[782].rationale.byChoice[0].en",
    "questions[782].rationale.byChoice[0].zh",
  ]);
  const parityDebt = result.rows.filter((row) => row.parityClass === "COUNTERPART_MISSING_TEMPERATURE");
  if (result.rows.length !== 486) throw new Error(`Post-scan occurrence drift: ${result.rows.length}`);
  if (actionableSafe.length !== 0) throw new Error(`Post-scan actionable safe rows remain: ${actionableSafe.length}`);
  if (
    residuals.length !== 4 ||
    residuals.some((row) => !expectedDeltaPaths.has(row.jsonPath))
  ) {
    throw new Error(`Post-scan residual mismatch: ${residuals.length}`);
  }
  if (parityDebt.length !== 16) throw new Error(`Post-scan parity debt drift: ${parityDebt.length}`);
  return result;
}

const alreadyApplied = appliedFields === plans.size;
if (alreadyApplied && !write) {
  const result = verifyPostMigration();
  console.log(
    `Temperature prose migration already applied: fields=${plans.size} occurrences=${safeRows.length + residualRows.length} canonical=${result.rows.filter((row) => row.disposition === "ALREADY_CANONICAL").length}`,
  );
  process.exit(0);
}

if (!alreadyApplied) {
  for (const plan of plans.values()) setAtPath(banks.get(plan.bankPath), plan.jsonPath, plan.result);
}
for (const [bankPath, bank] of banks) {
  const validation = validateBankObject(bank, { rejectUnknownKeys: true, requireMeta: true });
  if (!validation.ok) throw new Error(`${bankPath}: planned bank invalid:\n${validation.reasons.join("\n")}`);
}

if (!write) {
  console.log(
    `Would apply temperature prose migration: fields=${plans.size} occurrences=${safeRows.length + residualRows.length} banks=${bankPaths.length}`,
  );
  process.exit(0);
}

if (!alreadyApplied) {
  for (const [bankPath, bank] of banks) {
    writeFileSync(resolve(repoRoot, bankPath), `${JSON.stringify(bank, null, 2)}\n`);
  }
}

const post = verifyPostMigration();
const parityDebt = post.rows
  .filter((row) => row.parityClass === "COUNTERPART_MISSING_TEMPERATURE")
  .map((row) => ({
    occurrenceId: row.occurrenceId,
    bankPath: row.bankPath,
    topLevelQuestionId: row.topLevelQuestionId,
    embeddedQuestionId: row.embeddedQuestionId,
    jsonPath: row.jsonPath,
    counterpartJsonPath: row.counterpartJsonPath,
    matchedExpression: row.matchedExpression,
    note: "Known pre-existing parity debt; no counterpart clinical fact was added or removed.",
  }));

const receipt = {
  migrationId: "temperature-prose-unit-migration-2026-07-21",
  status: "APPLIED_AND_POSTSCAN_VERIFIED",
  patchReason: "Normalize existing learner-facing temperature prose to Fahrenheit first with Celsius parenthetical, without changing typed renderer contracts or adding counterpart clinical facts.",
  authorizedInputs: {
    safeMechanicalSubset: {
      path: "audit/temperature-prose-unit-survey-2026-07-21/safe-mechanical-subset.jsonl",
      sha256: fileSha256(safePath),
      occurrences: safeRows.length,
    },
    residualAdjudication: {
      path: "audit/temperature-prose-unit-survey-2026-07-21/residual-adjudication.jsonl",
      sha256: fileSha256(adjudicationPath),
      decisions: decisions.length,
      occurrences: residualRows.length,
    },
  },
  summary: {
    banksChanged: bankPaths.length,
    fieldsChanged: plans.size,
    safeOccurrencesApplied: safeRows.length,
    adjudicatedResidualOccurrencesApplied: residualRows.length,
    totalAuthorizedOccurrencesApplied: safeRows.length + residualRows.length,
    postscanOccurrences: post.rows.length,
    postscanAlreadyCanonical: post.rows.filter((row) => row.disposition === "ALREADY_CANONICAL").length,
    postscanSafeRows: post.rows.filter((row) => row.disposition.startsWith("SAFE_")).length,
    postscanActionableSafeRows: post.rows.filter(
      (row) => row.disposition.startsWith("SAFE_") && row.proposedExpression !== row.matchedExpression,
    ).length,
    postscanResidualRows: post.rows.filter(
      (row) => row.disposition !== "ALREADY_CANONICAL" && !row.disposition.startsWith("SAFE_"),
    ).length,
    postscanUnadjudicatedResidualRows: post.rows.filter(
      (row) =>
        row.disposition !== "ALREADY_CANONICAL" &&
        !row.disposition.startsWith("SAFE_") &&
        !new Set([
          "questions[782].rationale.byChoice[0].en",
          "questions[782].rationale.byChoice[0].zh",
        ]).has(row.jsonPath),
    ).length,
    knownCounterpartMissingParityDebt: parityDebt.length,
  },
  postscanInterpretation:
    "The scanner's two raw SAFE rows have proposedExpression exactly equal to matchedExpression and therefore require no write. Its four raw review rows are the two bilingual, source-adjudicated delta pairs; six original single-unit delta tokens collapsed into four paired expressions. There are zero actionable safe rows and zero unadjudicated residual rows.",
  bankHashes: bankPaths.map((bankPath) => {
    const baseline = structuredClone(banks.get(bankPath));
    for (const plan of plans.values()) {
      if (plan.bankPath === bankPath) setAtPath(baseline, plan.jsonPath, plan.original);
    }
    return {
      bankPath,
      beforeSha256: sha256(`${JSON.stringify(baseline, null, 2)}\n`),
      afterSha256: fileSha256(resolve(repoRoot, bankPath)),
    };
  }),
  fieldMutations: [...plans.values()]
    .sort((a, b) => a.bankPath.localeCompare(b.bankPath) || a.jsonPath.localeCompare(b.jsonPath))
    .map((plan) => ({
      bankPath: plan.bankPath,
      topLevelQuestionId: plan.topLevelQuestionId,
      embeddedQuestionId: plan.embeddedQuestionId,
      jsonPath: plan.jsonPath,
      completeOriginalFieldText: plan.original,
      completeOriginalFieldSha256: sha256(plan.original),
      completeResultingFieldText: plan.result,
      completeResultingFieldSha256: sha256(plan.result),
      consumedOccurrenceIds: [...plan.consumedOccurrenceIds].sort(),
      operations: [...plan.operations].sort((a, b) => a.startOffset - b.startOffset),
      completeRewriteAdjudicationId: plan.completeRewriteAdjudicationId,
    })),
  knownPreExistingCounterpartMissingTemperatureDebt: parityDebt,
};
writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);

console.log(
  `Applied temperature prose migration: fields=${plans.size} occurrences=${safeRows.length + residualRows.length} banks=${bankPaths.length} canonical=${receipt.summary.postscanAlreadyCanonical} residuals=${receipt.summary.postscanResidualRows}`,
);
