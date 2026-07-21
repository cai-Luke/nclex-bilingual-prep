import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

type Mutation = {
  bankPath: string;
  jsonPath: string;
  completeOriginalFieldText: string;
  completeOriginalFieldSha256: string;
  completeResultingFieldText: string;
  completeResultingFieldSha256: string;
  consumedOccurrenceIds: string[];
};

type Receipt = {
  status: string;
  summary: {
    banksChanged: number;
    fieldsChanged: number;
    safeOccurrencesApplied: number;
    adjudicatedResidualOccurrencesApplied: number;
    totalAuthorizedOccurrencesApplied: number;
    postscanActionableSafeRows: number;
    postscanUnadjudicatedResidualRows: number;
    knownCounterpartMissingParityDebt: number;
  };
  bankHashes: Array<{ bankPath: string; beforeSha256: string; afterSha256: string }>;
  fieldMutations: Mutation[];
  knownPreExistingCounterpartMissingTemperatureDebt: unknown[];
};

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const receiptPath = resolve(
  repoRoot,
  "audit/temperature-prose-unit-survey-2026-07-21/migration-receipt.json",
);
const receipt = JSON.parse(readFileSync(receiptPath, "utf8")) as Receipt;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function renderPath(parts: Array<string | number>): string {
  return parts
    .map((part, index) => (typeof part === "number" ? `[${part}]` : index === 0 ? part : `.${part}`))
    .join("");
}

function collectDiffs(
  before: JsonValue,
  after: JsonValue,
  parts: Array<string | number> = [],
  output: Array<{ jsonPath: string; before: JsonValue; after: JsonValue }> = [],
): Array<{ jsonPath: string; before: JsonValue; after: JsonValue }> {
  if (Object.is(before, after)) return output;
  if (Array.isArray(before) && Array.isArray(after)) {
    assert(before.length === after.length, `${renderPath(parts)}: array length changed`);
    before.forEach((value, index) => collectDiffs(value, after[index], [...parts, index], output));
    return output;
  }
  if (
    before !== null &&
    after !== null &&
    typeof before === "object" &&
    typeof after === "object" &&
    !Array.isArray(before) &&
    !Array.isArray(after)
  ) {
    const beforeKeys = Object.keys(before).sort();
    const afterKeys = Object.keys(after).sort();
    assert(JSON.stringify(beforeKeys) === JSON.stringify(afterKeys), `${renderPath(parts)}: object keys changed`);
    for (const key of beforeKeys) {
      collectDiffs(before[key], after[key], [...parts, key], output);
    }
    return output;
  }
  output.push({ jsonPath: renderPath(parts), before, after });
  return output;
}

assert(receipt.status === "APPLIED_AND_POSTSCAN_VERIFIED", "Receipt is not verified");
assert(receipt.summary.banksChanged === 5, "Expected five changed banks");
assert(receipt.summary.fieldsChanged === 439, "Expected 439 changed fields");
assert(receipt.summary.safeOccurrencesApplied === 468, "Expected 468 safe occurrences");
assert(receipt.summary.adjudicatedResidualOccurrencesApplied === 15, "Expected 15 adjudicated residuals");
assert(receipt.summary.totalAuthorizedOccurrencesApplied === 483, "Expected 483 authorized occurrences");
assert(receipt.summary.postscanActionableSafeRows === 0, "Actionable safe rows remain");
assert(receipt.summary.postscanUnadjudicatedResidualRows === 0, "Unadjudicated residuals remain");
assert(receipt.summary.knownCounterpartMissingParityDebt === 16, "Parity-debt count drifted");
assert(receipt.knownPreExistingCounterpartMissingTemperatureDebt.length === 16, "Parity-debt receipt rows drifted");

const mutationKeys = new Set<string>();
const occurrenceIds = new Set<string>();
for (const mutation of receipt.fieldMutations) {
  const key = `${mutation.bankPath}\u0000${mutation.jsonPath}`;
  assert(!mutationKeys.has(key), `Duplicate mutation ${key}`);
  mutationKeys.add(key);
  assert(sha256(mutation.completeOriginalFieldText) === mutation.completeOriginalFieldSha256, `${key}: original hash mismatch`);
  assert(sha256(mutation.completeResultingFieldText) === mutation.completeResultingFieldSha256, `${key}: result hash mismatch`);
  assert(mutation.completeOriginalFieldText !== mutation.completeResultingFieldText, `${key}: no-op mutation`);
  for (const occurrenceId of mutation.consumedOccurrenceIds) {
    assert(!occurrenceIds.has(occurrenceId), `Occurrence reused: ${occurrenceId}`);
    occurrenceIds.add(occurrenceId);
  }
}
assert(mutationKeys.size === 439, `Mutation key count ${mutationKeys.size}`);
assert(occurrenceIds.size === 483, `Occurrence count ${occurrenceIds.size}`);

const changedBanks = execFileSync("git", ["diff", "--name-only", "HEAD", "--", "banks/*.json"], {
  cwd: repoRoot,
  encoding: "utf8",
})
  .trim()
  .split("\n")
  .filter(Boolean)
  .sort();
const receiptBanks = receipt.bankHashes.map((row) => row.bankPath).sort();
assert(JSON.stringify(changedBanks) === JSON.stringify(receiptBanks), "Changed-bank set differs from receipt");

let diffCount = 0;
for (const bankHash of receipt.bankHashes) {
  const beforeText = execFileSync("git", ["show", `HEAD:${bankHash.bankPath}`], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const afterText = readFileSync(resolve(repoRoot, bankHash.bankPath), "utf8");
  assert(sha256(beforeText) === bankHash.beforeSha256, `${bankHash.bankPath}: before bank hash mismatch`);
  assert(sha256(afterText) === bankHash.afterSha256, `${bankHash.bankPath}: after bank hash mismatch`);

  const diffs = collectDiffs(JSON.parse(beforeText) as JsonValue, JSON.parse(afterText) as JsonValue);
  for (const diff of diffs) {
    const key = `${bankHash.bankPath}\u0000${diff.jsonPath}`;
    const mutation = receipt.fieldMutations.find(
      (candidate) => candidate.bankPath === bankHash.bankPath && candidate.jsonPath === diff.jsonPath,
    );
    assert(mutation !== undefined, `Unauthorized diff ${key}`);
    assert(typeof diff.before === "string" && typeof diff.after === "string", `${key}: non-string mutation`);
    assert(diff.before === mutation.completeOriginalFieldText, `${key}: old value mismatch`);
    assert(diff.after === mutation.completeResultingFieldText, `${key}: new value mismatch`);
  }
  diffCount += diffs.length;
}

assert(diffCount === 439, `Parsed-object diff count ${diffCount}`);
console.log(
  `temperature prose migration checker passed: banks=${receiptBanks.length} fields=${diffCount} occurrences=${occurrenceIds.size} parityDebt=16`,
);
