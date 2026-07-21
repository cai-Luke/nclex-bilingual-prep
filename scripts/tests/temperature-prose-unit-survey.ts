import assert from "node:assert/strict";
import type { BankEnvelope, Question } from "../../src/types";
import {
  collectLearnerFacingTemperatureFields,
  detectTemperatureExpressions,
  scalarFormatterCanary,
  scanBundledTemperatureProse,
  serializeArtifacts,
} from "../audit/temperature-prose-unit-survey";

const one = (text: string) => {
  const rows = detectTemperatureExpressions(text);
  assert.equal(rows.length, 1, `expected one temperature in: ${text}; got ${JSON.stringify(rows)}`);
  return rows[0];
};

const cScalar = one("Temperature 38.3 °C.");
assert.equal(cScalar.proposedExpression, "100.9 °F (38.3 °C)");
assert.equal(cScalar.disposition, "SAFE_ADD_FAHRENHEIT_AND_REORDER");
assert.equal(scalarFormatterCanary("38.3", "°C"), "100.9 °F (38.3 °C)");

const fScalar = one("Temperature 102.4 °F.");
assert.equal(fScalar.proposedExpression, "102.4 °F (39.1 °C)");
assert.equal(fScalar.disposition, "SAFE_ADD_CELSIUS");
assert.equal(scalarFormatterCanary("102.4", "°F"), "102.4 °F (39.1 °C)");

assert.equal(one("Temperature 40°C.").proposedExpression, "104 °F (40 °C)");

const cFirst = one("Axillary temperature 36°C (96.8°F).");
assert.equal(cFirst.presentationClass, "DUAL_C_FIRST");
assert.equal(cFirst.disposition, "SAFE_REORDER_EXISTING_DUAL");
assert.equal(cFirst.proposedExpression, "96.8 °F (36 °C)");

const fFirst = one("Temperature 99.1°F (37.3°C).");
assert.equal(fFirst.presentationClass, "DUAL_F_FIRST");
assert.equal(fFirst.disposition, "SAFE_NORMALIZE_DUAL_TOKENS");
assert.equal(fFirst.proposedExpression, "99.1 °F (37.3 °C)");
assert.equal(one("Temperature 99.1 °F (37.3 °C).").disposition, "ALREADY_CANONICAL");

const mismatch = one("Temperature 100.0 °F (20.0 °C).");
assert.equal(mismatch.presentationClass, "MALFORMED_OR_MISMATCHED_DUAL");
assert.equal(mismatch.disposition, "REVIEW_DUAL_VALUE_MISMATCH");
assert.ok(Math.abs(mismatch.arithmeticResiduals![0]) > mismatch.reconciliationTolerances![0]);

const comparator = one("Temperature above 38 °C.");
assert.equal(comparator.numericShape, "COMPARATOR");
assert.equal(comparator.proposedExpression, "above 100.4 °F (38 °C)");

const range = one("Temperature 38.0–38.5 °C.");
assert.equal(range.numericShape, "RANGE");
assert.equal(range.proposedExpression, "100.4–101.3 °F (38.0–38.5 °C)");

const cDelta = one("The temperature increased by 1 °C.");
assert.equal(cDelta.quantityKind, "TEMPERATURE_DELTA");
assert.equal(cDelta.disposition, "REVIEW_TEMPERATURE_DELTA");
assert.equal(cDelta.exactConvertedValues![0], 1.8);
assert.equal(cDelta.proposedExpression, null);

const fDelta = one("A 2 °F decrease occurred.");
assert.equal(fDelta.quantityKind, "TEMPERATURE_DELTA");
assert.ok(Math.abs(fDelta.exactConvertedValues![0] - (10 / 9)) < 1e-12);

const missing = one("The client's temperature is 38.3 after the intervention.");
assert.equal(missing.presentationClass, "UNIT_MISSING");
assert.equal(missing.disposition, "PRESERVE_UNIT_MISSING");

for (const falsePositive of ["vitamin C", "hepatitis C", "C-section", "option C", "option 1c", "选项2c", "grade C", "stage C", "room 40 C"]) {
  assert.equal(detectTemperatureExpressions(falsePositive).length, 0, `false positive: ${falsePositive}`);
}

assert.equal(one("Temperature 39℃.").sourceUnit, "°C");
assert.equal(one("Temperature 102℉.").sourceUnit, "°F");
assert.equal(one("体温 39摄氏度。").sourceUnit, "°C");
assert.equal(one("体温 102华氏度。").sourceUnit, "°F");

const multiple = detectTemperatureExpressions("Temperature was 38 °C at 0800 and 39 °C at 1200.");
assert.equal(multiple.length, 2);
assert.deepEqual(multiple.map((row) => row.start), [...multiple.map((row) => row.start)].sort((a, b) => a - b));

const common = {
  category: "Physiological Adaptation",
  topic: "fixture",
  difficulty: "medium",
  ngnSkill: "recognize_cues",
  testTakingStrategy: { en: "Strategy 40°C", zh: "策略 40°C" },
  glossary: [{ termEn: "Temperature 40°C", termZh: "体温 40°C", defZh: "体温为 40°C" }],
} as const;

const embedded = {
  ...common,
  id: "fixture_leaf",
  itemType: "multiple_choice",
  stem: { en: "Stem 40°C", zh: "题干 40°C" },
  options: [
    { id: "a", en: "Option 40°C", zh: "选项 40°C" },
    { id: "b", en: "Other", zh: "其他" },
  ],
  correct: ["a"],
  rationale: {
    correct: { en: "Rationale 40°C", zh: "解析 40°C" },
    byChoice: [{ refId: "a", en: "Choice 40°C", zh: "选择解析 40°C" }],
    visuals: [{ kind: "vitals_trend", tempUnit: "C", timepointsHr: [0], series: [{ vital: "temp", values: [40] }] }],
  },
} as unknown as Question;

const caseQuestion = {
  ...common,
  id: "fixture_case",
  itemType: "case_study",
  stem: { en: "Case stem 40°C", zh: "病例题干 40°C" },
  rationale: { correct: { en: "Case rationale 40°C", zh: "病例解析 40°C" } },
  meta: { source: "Internal 40°C" },
  caseStudy: {
    title: { en: "Case title 40°C", zh: "病例标题 40°C" },
    summary: { en: "Summary 40°C", zh: "摘要 40°C" },
    exhibits: [{
      id: "ex1",
      title: { en: "Exhibit 40°C", zh: "资料 40°C" },
      content: { en: "Visible 40°C", zh: "可见 40°C" },
      structuredMeasurements: { panels: [{ kind: "vitals", columns: [{ id: "now" }], rows: [{ key: "temp", label: { en: "Temperature", zh: "体温" }, values: [{ columnId: "now", value: "40", unit: "°C" }] }] }] },
      visual: { kind: "vitals_trend", tempUnit: "C", timepointsHr: [0], series: [{ vital: "temp", values: [40] }] },
    }],
    stages: [{
      id: "s1",
      title: { en: "Stage 40°C", zh: "阶段 40°C" },
      trigger: { en: "Trigger 40°C", zh: "触发 40°C" },
      narrative: { en: "Narrative 40°C", zh: "叙述 40°C" },
      timeOffset: "At temperature 40°C",
      exhibits: [{ id: "sx", title: { en: "Staged 40°C", zh: "阶段资料 40°C" }, content: { en: "Staged content 40°C", zh: "阶段内容 40°C" } }],
    }],
    questions: [embedded],
  },
} as unknown as Question;

const fixtureBank = { meta: { schemaVersion: "2.0" }, questions: [caseQuestion] } as BankEnvelope;
const fields = collectLearnerFacingTemperatureFields("banks/fixture.json", fixtureBank);
assert.ok(fields.some((field) => field.jsonPath.endsWith("rationale.correct.en")));
assert.ok(fields.some((field) => field.jsonPath.includes("rationale.byChoice[0].en")));
assert.ok(fields.some((field) => field.jsonPath.includes("testTakingStrategy.en")));
assert.ok(fields.some((field) => field.jsonPath.includes("options[0].en")));
assert.ok(fields.some((field) => field.jsonPath.includes("caseStudy.exhibits[0].content.en") && field.coexistsWithTypedTemperature));
assert.ok(fields.some((field) => field.jsonPath.includes("caseStudy.stages[0].exhibits[0].content.en")));
assert.ok(fields.some((field) => field.jsonPath.includes("caseStudy.questions[0].stem.en")));
assert.ok(fields.some((field) => field.jsonPath.endsWith("timeOffset")));
assert.ok(!fields.some((field) => field.jsonPath.includes("meta.source")));
assert.ok(!fields.some((field) => field.jsonPath.includes("structuredMeasurements")));
assert.ok(!fields.some((field) => field.jsonPath.includes("visual")));

const fixtureOccurrences = fields.flatMap((field) => detectTemperatureExpressions(field.text));
assert.ok(fixtureOccurrences.length > 20, "all declared learner surfaces should be traversed");

const live = scanBundledTemperatureProse();
const orientation = live.rows.filter((row) => row.topLevelQuestionId === "gpt_format8c_ici_colitis_escalation");
assert.ok(orientation.some((row) => row.matchedExpression.includes("100.9 °F") && row.disposition === "ALREADY_CANONICAL"));
assert.ok(live.rows.some((row) => row.matchedExpression.includes("99.1°F (37.3°C)") &&
  row.disposition === "SAFE_NORMALIZE_DUAL_TOKENS" && row.coexistsWithTypedTemperature));
assert.ok(live.rows.some((row) => row.bankPath === "banks/claude-canonical.json" && row.matchedExpression.includes("40°C")));
assert.ok(live.rows.some((row) => row.bankPath === "banks/claude-canonical.json" && row.matchedExpression.includes("36°C (96.8°F)")));
assert.ok(live.rows.some((row) => row.bankPath === "banks/claude-canonical.json" && row.matchedExpression.includes("38.1 °C (100.6 °F)")));

const sorted = [...live.rows].sort((a, b) =>
  a.bankPath.localeCompare(b.bankPath) || a.topLevelQuestionId.localeCompare(b.topLevelQuestionId) ||
  (a.embeddedQuestionId ?? "").localeCompare(b.embeddedQuestionId ?? "") || a.jsonPath.localeCompare(b.jsonPath) ||
  a.occurrenceIndex - b.occurrenceIndex);
assert.deepEqual(live.rows, sorted, "output ordering must follow the declared deterministic key");
assert.deepEqual(serializeArtifacts(live), serializeArtifacts(live), "same snapshot serialization must be byte-identical");

console.log(`TEMPERATURE_PROSE_UNIT_SURVEY_TEST_PASS occurrences=${live.rows.length}`);
