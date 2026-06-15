import assert from "node:assert/strict";
import { validateBankObject } from "../../src/schema";
import { toExportEnvelope } from "../../src/bankImport";
import type { Question } from "../../src/types";

const validEmptyBank = {
  meta: {
    schemaVersion: "1.0",
    count: 0,
  },
  questions: [],
};

assert.equal(validateBankObject(validEmptyBank).ok, true);
assert.equal(validateBankObject([]).ok, true);

const staleCount = validateBankObject({
  ...validEmptyBank,
  meta: {
    ...validEmptyBank.meta,
    count: 1,
  },
});
assert.equal(staleCount.ok, false);
if (!staleCount.ok) {
  assert(staleCount.reasons.includes("meta.count 1 does not match questions.length 0"));
}

const invalidCount = validateBankObject({
  ...validEmptyBank,
  meta: {
    ...validEmptyBank.meta,
    count: 0.5,
  },
});
assert.equal(invalidCount.ok, false);
if (!invalidCount.ok) {
  assert(invalidCount.reasons.includes("meta.count must be a non-negative integer"));
}

const pair = (text: string) => ({ en: text, zh: "测试文本" });

const rationaleVisual = {
  kind: "capnography",
  pattern: "normal",
  etco2: 38,
  respiratoryRate: 16,
  durationSec: 12,
  caption: { en: "Normal capnography waveform", zh: "正常二氧化碳波形" },
};

const optionRationales = [
  { refId: "A", en: "A rationale.", zh: "A 解析。" },
  { refId: "B", en: "B rationale.", zh: "B 解析。" },
  { refId: "C", en: "C rationale.", zh: "C 解析。" },
];

const baseOptionQuestion = {
  id: "rationale_visual_mc",
  itemType: "multiple_choice",
  category: "Physiological Adaptation",
  topic: "capnography teaching",
  difficulty: "easy",
  stem: pair("Which waveform is expected?"),
  rationale: {
    correct: pair("The waveform teaches the normal square shape after answer reveal."),
    byChoice: optionRationales,
  },
  testTakingStrategy: pair("Match the waveform to the respiratory pattern."),
  glossary: [],
  options: [
    { id: "A", en: "Normal ventilation", zh: "正常通气" },
    { id: "B", en: "Bronchospasm", zh: "支气管痉挛" },
    { id: "C", en: "Disconnected circuit", zh: "回路断开" },
  ],
  correct: ["A"],
};

const withRationaleVisuals = (visuals: unknown[]) => ({
  ...baseOptionQuestion,
  rationale: {
    ...baseOptionQuestion.rationale,
    visuals,
  },
});

assert.equal(validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [withRationaleVisuals([rationaleVisual])],
}).ok, true);

assert.equal(validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [withRationaleVisuals(Array.from({ length: 6 }, () => rationaleVisual))],
}).ok, true);

const nonArrayRationaleVisuals = validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [{
    ...baseOptionQuestion,
    rationale: {
      ...baseOptionQuestion.rationale,
      visuals: rationaleVisual,
    },
  }],
});
assert.equal(nonArrayRationaleVisuals.ok, false);
if (!nonArrayRationaleVisuals.ok) {
  assert(nonArrayRationaleVisuals.reasons.includes("questions[0]: rationale.visuals must be an array when present"));
}

assert.equal(validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [{
    ...withRationaleVisuals([rationaleVisual]),
    id: "rationale_visual_ordered_response",
    itemType: "ordered_response",
    correct: ["A", "B", "C"],
  }],
}).ok, true);

const emptyRationaleVisuals = validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [withRationaleVisuals([])],
});
assert.equal(emptyRationaleVisuals.ok, false);
if (!emptyRationaleVisuals.ok) {
  assert(emptyRationaleVisuals.reasons.includes("questions[0]: rationale.visuals must not be empty (omit the field for no visuals)"));
}

const tooManyRationaleVisuals = validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [withRationaleVisuals(Array.from({ length: 7 }, () => rationaleVisual))],
});
assert.equal(tooManyRationaleVisuals.ok, false);
if (!tooManyRationaleVisuals.ok) {
  assert(tooManyRationaleVisuals.reasons.includes("questions[0]: rationale.visuals must contain at most 6 entries"));
}

const badKindRationaleVisual = validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [withRationaleVisuals([{ kind: "not_a_visual" }])],
});
assert.equal(badKindRationaleVisual.ok, false);
if (!badKindRationaleVisual.ok) {
  assert(badKindRationaleVisual.reasons.includes("questions[0]: rationale.visuals[0].kind is invalid"));
}

const floor14 = validateBankObject({
  meta: { schemaVersion: "1.4", count: 1 },
  questions: [withRationaleVisuals([rationaleVisual])],
});
assert.equal(floor14.ok, false);
if (!floor14.ok) {
  assert(floor14.reasons.includes("questions[0]: rationale.visuals requires meta.schemaVersion 1.5"));
}

assert.equal(validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [withRationaleVisuals([rationaleVisual])],
}).ok, true);

assert.equal(validateBankObject([withRationaleVisuals([rationaleVisual])]).ok, true);

const embeddedCaseStudy = {
  id: "rationale_visual_case",
  itemType: "case_study",
  category: "Physiological Adaptation",
  topic: "case rationale visuals",
  difficulty: "medium",
  stem: pair("Review the case."),
  rationale: { correct: pair("Case rationale.") },
  testTakingStrategy: pair("Use the exhibit and each part."),
  glossary: [],
  caseStudy: {
    title: pair("Respiratory case"),
    exhibits: [{ id: "nurses_note", title: pair("Nurses note"), content: pair("Client is being monitored.") }],
    questions: [
      withRationaleVisuals([rationaleVisual]),
      {
        ...baseOptionQuestion,
        id: "rationale_visual_case_part_2",
      },
    ],
  },
};

const embeddedFloor14 = validateBankObject({
  meta: { schemaVersion: "1.4", count: 1 },
  questions: [embeddedCaseStudy],
});
assert.equal(embeddedFloor14.ok, false);
if (!embeddedFloor14.ok) {
  assert(embeddedFloor14.reasons.includes("questions[0]: rationale.visuals requires meta.schemaVersion 1.5"));
}

assert.equal(validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [embeddedCaseStudy],
}).ok, true);

const exportEnvelope = toExportEnvelope([withRationaleVisuals([rationaleVisual]) as unknown as Question]);
assert.equal(exportEnvelope.meta?.schemaVersion, "1.5");

console.log("bank schema tests passed");
