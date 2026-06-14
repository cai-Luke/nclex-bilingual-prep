import assert from "node:assert/strict";
import {
  getCorrectAnswer,
  gradeQuestion,
  isFullyCorrect,
  plusMinus,
  scoreQuestion,
  type AnswerState,
} from "../../src/grading";
import type { Question } from "../../src/types";

const common = {
  category: "Management of Care" as const,
  topic: "grading fixture",
  difficulty: "medium" as const,
  stem: { en: "Fixture", zh: "测试题" },
  rationale: { correct: { en: "Fixture rationale", zh: "测试解析" } },
  testTakingStrategy: { en: "Fixture strategy", zh: "测试策略" },
  glossary: [],
};

const questions: Record<string, Question> = {
  multipleChoice: {
    ...common,
    id: "grading_mc",
    itemType: "multiple_choice",
    options: [
      { id: "a", en: "A", zh: "甲" },
      { id: "b", en: "B", zh: "乙" },
    ],
    correct: ["b"],
  },
  selectAll: {
    ...common,
    id: "grading_sata",
    itemType: "select_all",
    options: ["a", "b", "c", "d", "e"].map((id) => ({ id, en: id, zh: id })),
    correct: ["a", "b", "c"],
  },
  orderedResponse: {
    ...common,
    id: "grading_ordered",
    itemType: "ordered_response",
    options: ["a", "b", "c"].map((id) => ({ id, en: id, zh: id })),
    correct: ["c", "a", "b"],
  },
  fillInBlank: {
    ...common,
    id: "grading_blank",
    itemType: "fill_in_blank",
    blanks: [
      { id: "text", prompt: { en: "Text", zh: "文字" }, acceptable: ["Ready"] },
      { id: "numeric", prompt: { en: "Number", zh: "数字" }, numeric: { value: 12, tolerance: 0.5 } },
    ],
  },
  matrixSingle: {
    ...common,
    id: "grading_matrix_single",
    itemType: "matrix",
    matrix: {
      rows: [
        { id: "r1", en: "Row 1", zh: "第一行" },
        { id: "r2", en: "Row 2", zh: "第二行" },
      ],
      columns: [
        { id: "c1", en: "Column 1", zh: "第一列" },
        { id: "c2", en: "Column 2", zh: "第二列" },
      ],
      selectionMode: "single_per_row",
    },
    correct: [
      { rowId: "r1", columnIds: ["c1"] },
      { rowId: "r2", columnIds: ["c2"] },
    ],
  },
  matrixMultiple: {
    ...common,
    id: "grading_matrix_multiple",
    itemType: "matrix",
    matrix: {
      rows: [
        { id: "r1", en: "Row 1", zh: "第一行" },
        { id: "r2", en: "Row 2", zh: "第二行" },
      ],
      columns: ["c1", "c2", "c3"].map((id) => ({ id, en: id, zh: id })),
      selectionMode: "multiple_per_row",
    },
    correct: [
      { rowId: "r1", columnIds: ["c1", "c2"] },
      { rowId: "r2", columnIds: ["c3"] },
    ],
  },
  dropdown: {
    ...common,
    id: "grading_dropdown",
    itemType: "dropdown_cloze",
    clozeStem: { en: "{{d1}} then {{d2}}", zh: "{{d1}} 然后 {{d2}}" },
    dropdowns: [
      {
        id: "d1",
        options: [
          { id: "a", en: "A", zh: "甲" },
          { id: "b", en: "B", zh: "乙" },
        ],
        correct: "a",
      },
      {
        id: "d2",
        options: [
          { id: "a", en: "A", zh: "甲" },
          { id: "b", en: "B", zh: "乙" },
        ],
        correct: "b",
      },
    ],
  },
  highlight: {
    ...common,
    id: "grading_highlight",
    itemType: "highlight",
    highlight: {
      segments: [
        { id: "s1", en: "Static", zh: "静态" },
        { id: "s2", en: "Correct one", zh: "正确一", selectable: true },
        { id: "s3", en: "Correct two", zh: "正确二", selectable: true },
        { id: "s4", en: "Distractor", zh: "干扰项", selectable: true },
      ],
      correct: ["s2", "s3"],
    },
  },
  caseStudy: {
    ...common,
    id: "grading_case",
    itemType: "case_study",
    caseStudy: {
      title: { en: "Case", zh: "病例" },
      exhibits: [],
      questions: [],
    },
  },
};

const caseStudy = questions.caseStudy;
if (caseStudy.itemType !== "case_study") throw new Error("case fixture type mismatch");
const selectAll = questions.selectAll;
const dropdown = questions.dropdown;
if (selectAll.itemType === "case_study" || dropdown.itemType === "case_study") {
  throw new Error("standalone fixture type mismatch");
}
caseStudy.caseStudy.questions = [selectAll, dropdown];

const partials: Array<[Question, AnswerState, { earned: number; possible: number }]> = [
  [questions.multipleChoice, { optionIds: ["a"] }, { earned: 0, possible: 1 }],
  [questions.selectAll, { optionIds: ["a", "b"] }, { earned: 2, possible: 3 }],
  [questions.orderedResponse, { optionIds: ["a", "b", "c"] }, { earned: 0, possible: 1 }],
  [questions.fillInBlank, { blanks: { text: " ready ", numeric: "20" } }, { earned: 1, possible: 2 }],
  [questions.matrixSingle, { matrix: { r1: ["c1"], r2: ["c1"] } }, { earned: 1, possible: 2 }],
  [
    questions.matrixMultiple,
    { matrix: { r1: ["c1", "c3"], r2: ["c3"] } },
    { earned: 1, possible: 3 },
  ],
  [questions.dropdown, { dropdowns: { d1: "a", d2: "a" } }, { earned: 1, possible: 2 }],
  [questions.highlight, { segments: ["s2"] }, { earned: 1, possible: 2 }],
  [
    questions.caseStudy,
    {
      caseStudy: {
        grading_sata: { optionIds: ["a", "b"] },
        grading_dropdown: { dropdowns: { d1: "a", d2: "a" } },
      },
    },
    { earned: 3, possible: 5 },
  ],
];

for (const [question, answer, expected] of partials) {
  const score = scoreQuestion(question, answer);
  assert.deepEqual(score, expected, `${question.itemType} must award the expected partial score`);
  assert.equal(gradeQuestion(question, answer), false, `${question.itemType} partial credit must not count as mastered`);
  assert.equal(isFullyCorrect(score), false);
}

for (const question of Object.values(questions)) {
  const score = scoreQuestion(question, getCorrectAnswer(question));
  assert.equal(score.earned, score.possible, `${question.itemType} correct answer must earn full points`);
  assert.equal(gradeQuestion(question, getCorrectAnswer(question)), true, `${question.itemType} full score must remain correct`);
}

assert.equal(plusMinus(["a", "d", "e"], ["a", "b", "c"]), 0, "over-selection must floor at zero");
assert.equal(plusMinus(["a", "b"], ["a", "b", "c"]), 2, "unselected distractors must not add points");
assert.equal(
  gradeQuestion(questions.selectAll, { optionIds: ["a", "b", "c", "c"] }),
  false,
  "duplicate persisted selections must preserve the old non-mastered verdict",
);
assert.equal(
  gradeQuestion(questions.matrixMultiple, { matrix: { r1: ["c1", "c2", "c2"], r2: ["c3"] } }),
  false,
  "duplicate persisted matrix cells must preserve the old non-mastered verdict",
);
assert.deepEqual(
  scoreQuestion(questions.highlight, { segments: ["s2", "s4"] }),
  { earned: 0, possible: 2 },
  "highlight over-selection must use the shared plus/minus floor",
);

console.log("grading tests passed");
