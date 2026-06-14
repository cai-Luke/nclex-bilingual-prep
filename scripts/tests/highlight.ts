import assert from "node:assert/strict";
import { toExportEnvelope } from "../../src/bankImport";
import { validateBankObject, validateQuestion } from "../../src/schema";
import type { HighlightQuestion, MultipleChoiceQuestion, Question } from "../../src/types";

const common = {
  category: "Reduction of Risk Potential" as const,
  topic: "acute kidney injury",
  difficulty: "medium" as const,
  ngnSkill: "analyze_cues" as const,
  stem: {
    en: "Highlight the findings that require immediate follow-up.",
    zh: "标出需要立即跟进的发现。",
  },
  rationale: {
    correct: { en: "Oliguria and hyperkalemia require follow-up.", zh: "少尿和高钾血症需要跟进。" },
    byChoice: [
      { refId: "s2", en: "This pressure is not the priority cue.", zh: "该血压不是优先线索。" },
      { refId: "s3", en: "Oliguria is concerning.", zh: "少尿令人担忧。" },
      { refId: "s4", en: "Hyperkalemia requires action.", zh: "高钾血症需要处理。" },
    ],
  },
  testTakingStrategy: { en: "Focus on threats to perfusion and rhythm.", zh: "关注灌注和心律威胁。" },
  glossary: [],
};

const validHighlight: HighlightQuestion = {
  ...common,
  id: "hl_aki_01",
  itemType: "highlight",
  highlight: {
    segments: [
      { id: "s1", en: "0800 nursing note:", zh: "0800 护理记录：" },
      { id: "s2", en: "Blood pressure 138/82.", zh: "血压 138/82。", selectable: true },
      { id: "s3", en: "Urine output 12 mL over 4 hours.", zh: "4 小时尿量 12 毫升。", selectable: true },
      { id: "s4", en: "Potassium 6.4 mEq/L.", zh: "血钾 6.4 mEq/L。", selectable: true },
    ],
    correct: ["s3", "s4"],
  },
};

const multipleChoice: MultipleChoiceQuestion = {
  ...common,
  id: "case_control",
  itemType: "multiple_choice",
  options: [
    { id: "a", en: "A", zh: "甲" },
    { id: "b", en: "B", zh: "乙" },
    { id: "c", en: "C", zh: "丙" },
  ],
  correct: ["a"],
  rationale: {
    ...common.rationale,
    byChoice: [
      { refId: "a", en: "Correct.", zh: "正确。" },
      { refId: "b", en: "Incorrect.", zh: "错误。" },
      { refId: "c", en: "Incorrect.", zh: "错误。" },
    ],
  },
};

const reasonsFor = (question: unknown) => {
  const result = validateQuestion(question);
  return result.ok ? [] : result.reasons;
};

assert.equal(validateQuestion(validHighlight).ok, true, "valid highlight must pass");
assert(reasonsFor({ ...validHighlight, highlight: undefined }).includes("highlight requires highlight"));
assert(reasonsFor({ ...validHighlight, highlight: { segments: [], correct: ["s3"] } }).includes("highlight requires segments"));
assert(
  reasonsFor({
    ...validHighlight,
    highlight: {
      ...validHighlight.highlight,
      segments: validHighlight.highlight.segments.map((segment) => ({ ...segment, selectable: false })),
    },
  }).includes("highlight requires at least one selectable segment"),
);
assert(
  reasonsFor({
    ...validHighlight,
    highlight: { ...validHighlight.highlight, correct: ["s1"] },
  }).includes("highlight correct id s1 is not a selectable segment"),
);
assert(
  reasonsFor({
    ...validHighlight,
    highlight: {
      ...validHighlight.highlight,
      segments: [...validHighlight.highlight.segments, { ...validHighlight.highlight.segments[0] }],
    },
  }).includes("duplicate highlight segment id s1"),
);
assert(
  reasonsFor({
    ...validHighlight,
    highlight: {
      ...validHighlight.highlight,
      segments: validHighlight.highlight.segments.map((segment) =>
        segment.id === "s4" ? { ...segment, zh: "" } : segment,
      ),
    },
  }).includes("highlight.segments[3] requires id, en, and zh"),
);
assert(
  reasonsFor({
    ...validHighlight,
    highlight: { ...validHighlight.highlight, correct: ["s2", "s3", "s4"] },
  }).includes("highlight must include at least one selectable distractor"),
);
assert(
  reasonsFor({
    ...validHighlight,
    rationale: {
      ...validHighlight.rationale,
      byChoice: [{ refId: "s1", en: "Static.", zh: "静态。" }],
    },
  }).includes("rationale.byChoice refId s1 is not a selectable highlight segment"),
);
assert(
  reasonsFor({
    ...validHighlight,
    rationale: {
      ...validHighlight.rationale,
      byChoice: [
        { refId: "s2", en: "One.", zh: "一。" },
        { refId: "s2", en: "Two.", zh: "二。" },
      ],
    },
  }).includes("rationale.byChoice contains duplicate refId s2"),
);

const bank = (schemaVersion: "1.2" | "1.3", questions: Question[]) => ({
  meta: { schemaVersion, count: questions.length },
  questions,
});

assert.equal(validateBankObject(bank("1.3", [validHighlight])).ok, true, "highlight requires and accepts schema 1.3");
const topLevelFloor = validateBankObject(bank("1.2", [validHighlight]));
assert.equal(topLevelFloor.ok, false);
if (!topLevelFloor.ok) {
  assert(topLevelFloor.reasons.includes("questions[0]: highlight requires meta.schemaVersion 1.3"));
}

const caseStudy: Question = {
  ...common,
  id: "case_with_highlight",
  itemType: "case_study",
  caseStudy: {
    title: { en: "AKI case", zh: "急性肾损伤病例" },
    exhibits: [
      {
        id: "ex1",
        title: { en: "Nursing note", zh: "护理记录" },
        content: { en: "Review the note.", zh: "查看记录。" },
      },
    ],
    questions: [{ ...validHighlight, id: "case_highlight_part" }, multipleChoice],
  },
};
assert.equal(validateBankObject(bank("1.3", [caseStudy])).ok, true, "embedded highlight must pass in schema 1.3");
const embeddedFloor = validateBankObject(bank("1.2", [caseStudy]));
assert.equal(embeddedFloor.ok, false);
if (!embeddedFloor.ok) {
  assert(embeddedFloor.reasons.includes("questions[0]: highlight requires meta.schemaVersion 1.3"));
}

assert.equal(toExportEnvelope([validHighlight]).meta?.schemaVersion, "1.3");
assert.equal(toExportEnvelope([caseStudy]).meta?.schemaVersion, "1.3");

console.log("highlight tests passed");
