import * as assert from "node:assert/strict";
import { findExplicitMatches, scanBanks } from "../audit/wbc-platelet-prose-unit-remediation";

const explicit = (text: string) => findExplicitMatches(text).filter((row) =>
  row.disposition === "NORMALIZE_EXPLICIT" || row.disposition === "NORMALIZE_TOKEN_ONLY");

{
  const rows = explicit("The WBC count is 2,800/mm³ (2.8 ×10⁹/L).");
  assert.equal(rows.length, 1);
  assert.equal(rows[0].matched, "2,800/mm³ (2.8 ×10⁹/L)");
  assert.equal(rows[0].canonical, "2.8 ×10³/µL");
}

{
  const rows = explicit("WBC 6.8 x 10^3/uL");
  assert.equal(rows.length, 1);
  assert.equal(rows[0].canonical, "6.8 ×10³/µL");
}

{
  const rows = explicit("WBC 0.6 × 10³/µL");
  assert.equal(rows.length, 1);
  assert.equal(rows[0].disposition, "NORMALIZE_TOKEN_ONLY");
  assert.equal(rows[0].canonical, "0.6 ×10³/µL");
}

{
  const rows = explicit("The platelet count is 160,000/µL (reference range: 150,000-400,000/µL).");
  assert.deepEqual(rows.map((row) => row.canonical), ["160 ×10³/µL", "150-400 ×10³/µL"]);
}

{
  const rows = explicit("WBC 21,400/µL now; WBC was 8,200/µL two days ago.");
  assert.deepEqual(rows.map((row) => row.canonical), ["21.4 ×10³/µL", "8.2 ×10³/µL"]);
}

const result = scanBanks();
const rows = result.occurrences;

const agvhdSummary = rows.filter((row) => row.topLevelQuestionId === "opus_agvd_case_agvhd_01" &&
  row.jsonPath.includes("caseStudy.summary"));
assert.ok(agvhdSummary.some((row) => row.language === "en" && row.matchedExpression === "10 ×10³/µL" &&
  row.disposition === "ALREADY_CANONICAL"), "EN platelet transfusion threshold residual must remain canonical");
assert.ok(agvhdSummary.some((row) => row.language === "zh" && row.matchedExpression === "10 ×10³/µL" &&
  row.disposition === "ALREADY_CANONICAL"), "ZH platelet transfusion threshold residual must remain canonical");
assert.equal(agvhdSummary.some((row) => row.verbatimText.includes("ten thousand per microliter") ||
  row.verbatimText.includes("1万/微升")), false, "Natural-language residual forms must not recur");

const thyroid = rows.filter((row) => row.embeddedQuestionId === "cs_thyroid_storm_q4");
assert.ok(thyroid.some((row) => row.jsonPath.includes("options[2]") && row.language === "en"));
assert.ok(thyroid.some((row) => row.jsonPath.includes("rationale.correct") && row.language === "en"));

const requiredRationalePaths = [
  "banks/claude-canonical.json|questions[60].caseStudy.questions[0].rationale.correct.en",
  "banks/claude-canonical.json|questions[60].caseStudy.questions[0].rationale.correct.zh",
  "banks/gemini-canonical.json|questions[203].rationale.correct.en",
  "banks/gemini-canonical.json|questions[203].rationale.correct.zh",
  "banks/gemini-canonical.json|questions[286].rationale.correct.zh",
  "banks/gemini-canonical.json|questions[546].rationale.correct.en",
  "banks/gemini-canonical.json|questions[546].rationale.correct.zh",
  "banks/gemini-canonical.json|questions[613].rationale.correct.en",
  "banks/gemini-canonical.json|questions[613].rationale.correct.zh",
  "banks/gemini-canonical.json|questions[784].rationale.correct.en",
  "banks/gemini-canonical.json|questions[784].rationale.correct.zh",
  "banks/gemini-canonical.json|questions[834].rationale.correct.en",
  "banks/gemini-canonical.json|questions[834].rationale.correct.zh",
  "banks/gpt-canonical.json|questions[705].rationale.correct.en",
  "banks/gpt-canonical.json|questions[705].rationale.correct.zh",
  "banks/hard-cases-canonical.json|questions[33].caseStudy.questions[3].rationale.correct.en",
  "banks/hard-cases-canonical.json|questions[33].caseStudy.questions[3].rationale.correct.zh",
];
const present = new Set(rows.map((row) => `${row.bankPath}|${row.jsonPath}`));
for (const key of requiredRationalePaths) assert.ok(present.has(key), `missing rationale.correct path ${key}`);

for (const id of ["gen_rrp_batch2_05", "gen_rrp_batch2_09"]) {
  const dual = rows.filter((row) => row.topLevelQuestionId === id && row.matchedExpression.includes("× 10⁹/L"));
  const canonical = rows.filter((row) => row.topLevelQuestionId === id && row.disposition === "ALREADY_CANONICAL");
  assert.ok(dual.length === 2 || canonical.length >= 2,
    `${id} must expose complete pre-normalization SI boundaries or canonical post-normalization rows in EN and ZH`);
}

const nonBlood = rows.filter((row) => row.disposition === "EXCLUDE_NON_BLOOD");
assert.ok(nonBlood.some((row) => row.matchedExpression.includes("3 cells/uL")));
assert.ok(nonBlood.some((row) => row.matchedExpression.includes("620 cells/µL")));

const nonCount = rows.filter((row) => row.disposition === "EXCLUDE_NON_COUNT");
assert.ok(nonCount.some((row) => row.topLevelQuestionId === "gpt_format10b_corrected_count_increment"));

assert.equal(rows.some((row) => row.parityClass === "POSSIBLE_MISMATCH" &&
  (row.disposition === "NORMALIZE_EXPLICIT" || row.disposition === "NORMALIZE_TOKEN_ONLY")), false,
"No authorized explicit mutation may carry a bilingual numeric mismatch");
assert.equal(rows.some((row) => row.disposition === "BLOCKED_CONTEXT" || row.disposition === "NORMALIZE_EXPLICIT" ||
  row.disposition === "NORMALIZE_TOKEN_ONLY"), false, "Post-remediation inventory must have no blocked or normalizable rows");

const sorted = [...rows].sort((a, b) =>
  a.bankPath.localeCompare(b.bankPath) || a.topLevelQuestionId.localeCompare(b.topLevelQuestionId) ||
  (a.embeddedQuestionId ?? "").localeCompare(b.embeddedQuestionId ?? "") || a.jsonPath.localeCompare(b.jsonPath) ||
  a.occurrenceIndex - b.occurrenceIndex);
assert.deepEqual(rows.map((row) => row.occurrenceId), sorted.map((row) => row.occurrenceId));

console.log(`WBC_PLATELET_REMEDIATION_TEST_PASS occurrences=${rows.length} rationaleCorrect=${rows.filter((row) => row.jsonPath.includes("rationale.correct")).length}`);
