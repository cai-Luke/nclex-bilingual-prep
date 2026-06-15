import assert from "node:assert/strict";
import { toExportEnvelope } from "../../src/bankImport";
import {
  getAnswerCompleteness,
  getCorrectAnswer,
  getInitialAnswer,
  gradeQuestion,
  scoreQuestion,
} from "../../src/grading";
import { validateBankObject, validateQuestion } from "../../src/schema";
import type { BowtieQuestion, MultipleChoiceQuestion, Question } from "../../src/types";
import { shuffle } from "../../lib/shuffle";

const validBowtie: BowtieQuestion = {
  id: "bt_dka_01",
  itemType: "bowtie",
  category: "Physiological Adaptation",
  topic: "diabetic ketoacidosis",
  difficulty: "hard",
  ngnSkill: "take_action",
  stem: {
    en: "Complete the bowtie diagram.",
    zh: "完成蝴蝶结图。",
  },
  bowtie: {
    condition: {
      prompt: { en: "Most likely condition", zh: "最可能的病情" },
      tokens: [
        { id: "c1", en: "Diabetic ketoacidosis", zh: "糖尿病酮症酸中毒" },
        { id: "c2", en: "Hyperosmolar state", zh: "高渗状态" },
        { id: "c3", en: "Lactic acidosis", zh: "乳酸性酸中毒" },
      ],
      correct: "c1",
    },
    actions: {
      prompt: { en: "Actions to take", zh: "应采取的措施" },
      tokens: [
        { id: "a1", en: "Begin isotonic fluids", zh: "开始等渗液体治疗" },
        { id: "a2", en: "Start prescribed insulin", zh: "开始医嘱胰岛素治疗" },
        { id: "a3", en: "Give bicarbonate routinely", zh: "常规给予碳酸氢盐" },
        { id: "a4", en: "Give a rapid potassium bolus", zh: "快速静脉推注钾" },
      ],
      correct: ["a1", "a2"],
    },
    parameters: {
      prompt: { en: "Parameters to monitor", zh: "应监测的指标" },
      tokens: [
        { id: "p1", en: "Serum potassium", zh: "血清钾" },
        { id: "p2", en: "Anion gap", zh: "阴离子间隙" },
        { id: "p3", en: "Serum lipase", zh: "血清脂肪酶" },
        { id: "p4", en: "INR", zh: "国际标准化比值" },
      ],
      correct: ["p1", "p2"],
    },
  },
  rationale: {
    correct: { en: "The keyed placements address DKA.", zh: "正确放置针对糖尿病酮症酸中毒。" },
    byChoice: [
      { refId: "c1", en: "Correct condition.", zh: "正确病情。" },
      { refId: "c2", en: "Competing condition.", zh: "竞争性病情。" },
      { refId: "c3", en: "Competing condition.", zh: "竞争性病情。" },
      { refId: "a1", en: "Correct action.", zh: "正确措施。" },
      { refId: "a2", en: "Correct action.", zh: "正确措施。" },
      { refId: "a3", en: "Unsafe routine action.", zh: "不安全的常规措施。" },
      { refId: "a4", en: "Unsafe action.", zh: "不安全措施。" },
      { refId: "p1", en: "Correct parameter.", zh: "正确指标。" },
      { refId: "p2", en: "Correct parameter.", zh: "正确指标。" },
      { refId: "p3", en: "Not a primary parameter.", zh: "不是主要指标。" },
      { refId: "p4", en: "Not a primary parameter.", zh: "不是主要指标。" },
    ],
  },
  testTakingStrategy: {
    en: "Link the condition to immediate treatment and response markers.",
    zh: "将病情与即时治疗及疗效指标联系起来。",
  },
  glossary: [],
};

const reasonsFor = (question: unknown) => {
  const result = validateQuestion(question);
  return result.ok ? [] : result.reasons;
};
const clone = <T>(value: T): T => structuredClone(value);

assert.equal(validateQuestion(validBowtie).ok, true, "valid bowtie must pass");
assert(reasonsFor({ ...validBowtie, bowtie: undefined }).includes("bowtie requires bowtie"));

const wrongCount = clone(validBowtie);
wrongCount.bowtie.actions.correct = ["a1"];
assert(reasonsFor(wrongCount).includes("bowtie.actions.correct must contain exactly 2 ids"));

const unknownCorrect = clone(validBowtie);
unknownCorrect.bowtie.parameters.correct = ["p1", "missing"];
assert(reasonsFor(unknownCorrect).includes("bowtie.parameters.correct id missing is not in that zone's tokens"));

const duplicateId = clone(validBowtie);
duplicateId.bowtie.parameters.tokens[0].id = "a1";
assert(reasonsFor(duplicateId).includes("duplicate bowtie token id a1"));

const noDistractor = clone(validBowtie);
noDistractor.bowtie.condition.tokens = [noDistractor.bowtie.condition.tokens[0]];
assert(reasonsFor(noDistractor).includes("bowtie.condition must include at least one distractor"));

const duplicateText = clone(validBowtie);
duplicateText.bowtie.actions.tokens[1].en = duplicateText.bowtie.actions.tokens[0].en;
assert(reasonsFor(duplicateText).includes("bowtie.actions has duplicate en token text Begin isotonic fluids"));

const emptyZh = clone(validBowtie);
emptyZh.bowtie.parameters.tokens[3].zh = "";
assert(reasonsFor(emptyZh).includes("bowtie.parameters.tokens[3] requires id, en, and zh"));

const badRationale = clone(validBowtie);
badRationale.rationale.byChoice = [{ refId: "missing", en: "Missing.", zh: "缺失。" }];
assert(reasonsFor(badRationale).includes("rationale.byChoice refId missing is not a bowtie token"));

const duplicateRationale = clone(validBowtie);
duplicateRationale.rationale.byChoice = [
  { refId: "c1", en: "One.", zh: "一。" },
  { refId: "c1", en: "Two.", zh: "二。" },
];
assert(reasonsFor(duplicateRationale).includes("rationale.byChoice contains duplicate refId c1"));

const bank = (schemaVersion: "1.3" | "1.4", questions: Question[]) => ({
  meta: { schemaVersion, count: questions.length },
  questions,
});
assert.equal(validateBankObject(bank("1.4", [validBowtie])).ok, true);
const floor = validateBankObject(bank("1.3", [validBowtie]));
assert.equal(floor.ok, false);
if (!floor.ok) {
  assert(floor.reasons.includes("questions[0]: bowtie requires meta.schemaVersion 1.4"));
}
assert.equal(toExportEnvelope([validBowtie]).meta?.schemaVersion, "1.4");

const controlQuestion: MultipleChoiceQuestion = {
  ...validBowtie,
  id: "case_control",
  itemType: "multiple_choice",
  options: [
    { id: "x", en: "X", zh: "甲" },
    { id: "y", en: "Y", zh: "乙" },
    { id: "z", en: "Z", zh: "丙" },
  ],
  correct: ["x"],
  rationale: {
    correct: { en: "X is correct.", zh: "甲正确。" },
    byChoice: [
      { refId: "x", en: "Correct.", zh: "正确。" },
      { refId: "y", en: "Incorrect.", zh: "错误。" },
      { refId: "z", en: "Incorrect.", zh: "错误。" },
    ],
  },
};
const embeddedBowtie = {
  ...validBowtie,
  id: "case_parent",
  itemType: "case_study",
  caseStudy: {
    title: { en: "Case", zh: "病例" },
    exhibits: [
      {
        id: "ex1",
        title: { en: "Note", zh: "记录" },
        content: { en: "Findings", zh: "发现" },
      },
    ],
    questions: [{ ...validBowtie, id: "embedded_bowtie" }, controlQuestion],
  },
};
assert(
  reasonsFor(embeddedBowtie).includes(
    "caseStudy.questions[0]: bowtie may not be embedded in a case study (standalone item type)",
  ),
);

assert.deepEqual(scoreQuestion(validBowtie, getCorrectAnswer(validBowtie)), { earned: 5, possible: 5 });
assert.equal(gradeQuestion(validBowtie, getCorrectAnswer(validBowtie)), true);
assert.deepEqual(
  scoreQuestion(validBowtie, {
    bowtie: {
      condition: ["c1"],
      actions: ["a1", "a3"],
      parameters: ["p1", "p4"],
    },
  }),
  { earned: 3, possible: 5 },
);
assert.deepEqual(
  scoreQuestion(validBowtie, {
    bowtie: {
      condition: ["c2"],
      actions: ["a1", "a1"],
      parameters: ["c1", "garbage"],
    },
  }),
  { earned: 1, possible: 5 },
  "duplicates, cross-zone ids, and garbage must not earn extra credit",
);
assert.deepEqual(getInitialAnswer(validBowtie), {
  bowtie: { condition: [], actions: [], parameters: [] },
});
assert.equal(
  getAnswerCompleteness(validBowtie, {
    bowtie: {
      condition: ["c1"],
      actions: ["a1", "a1"],
      parameters: ["p1", "garbage"],
    },
  }),
  false,
);
assert.equal(getAnswerCompleteness(validBowtie, getCorrectAnswer(validBowtie)), true);

const shuffled = shuffle(validBowtie);
const shuffledAgain = shuffle(validBowtie);
assert.equal(shuffled.itemType, "bowtie");
assert.deepEqual(shuffled, shuffledAgain, "bowtie shuffle must be deterministic for a fixed id");
if (shuffled.itemType === "bowtie") {
  assert.equal(shuffled.bowtie.condition.correct, validBowtie.bowtie.condition.correct);
  assert.deepEqual(shuffled.bowtie.actions.correct, validBowtie.bowtie.actions.correct);
  assert.deepEqual(shuffled.bowtie.parameters.correct, validBowtie.bowtie.parameters.correct);
  for (const zoneName of ["condition", "actions", "parameters"] as const) {
    assert.deepEqual(
      shuffled.bowtie[zoneName].tokens.map((token) => token.id).sort(),
      validBowtie.bowtie[zoneName].tokens.map((token) => token.id).sort(),
    );
  }
}

console.log("bowtie tests passed");
