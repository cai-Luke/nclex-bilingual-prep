import assert from "node:assert/strict";
import {
  assertNormalizationInvariants,
  normalizeBankPresentations,
  serializeBank,
} from "../../lib/presentation-normalization";
import type {
  BankEnvelope,
  CaseStudyQuestion,
  DropdownClozeQuestion,
  FillInBlankQuestion,
  MatrixQuestion,
  MultipleChoiceQuestion,
  Option,
  OrderedResponseQuestion,
  SelectAllQuestion,
} from "../../src/types";

const pair = (text: string) => ({ en: text, zh: text });
const options = (prefix: string, count = 4): Option[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${prefix}${String.fromCharCode(65 + index)}`,
    ...pair(`${prefix}${index}`),
  })).reverse();
const common = (id: string) => ({
  id,
  category: "Management of Care" as const,
  topic: "Fixture",
  difficulty: "medium" as const,
  stem: pair("Stem"),
  testTakingStrategy: pair("Strategy"),
  glossary: [],
});
const optionRationale = (itemOptions: Option[]) => ({
  correct: pair("Correct rationale"),
  byChoice: itemOptions.map((option) => ({ refId: option.id, ...pair(`Rationale ${option.id}`) })),
});

function multipleChoice(id: string): MultipleChoiceQuestion {
  const itemOptions = options(`${id}-`);
  return {
    ...common(id),
    itemType: "multiple_choice",
    options: itemOptions,
    correct: [itemOptions[1].id],
    rationale: optionRationale(itemOptions),
  };
}

function selectAll(id: string): SelectAllQuestion {
  const itemOptions = options(`${id}-`, 5);
  return {
    ...common(id),
    itemType: "select_all",
    options: itemOptions,
    correct: [itemOptions[0].id, itemOptions[2].id],
    rationale: optionRationale(itemOptions),
  };
}

function ordered(id: string): OrderedResponseQuestion {
  const itemOptions = options(`${id}-`);
  return {
    ...common(id),
    itemType: "ordered_response",
    options: itemOptions,
    correct: [itemOptions[2].id, itemOptions[0].id, itemOptions[3].id, itemOptions[1].id],
    rationale: optionRationale(itemOptions),
  };
}

function dropdown(id: string): DropdownClozeQuestion {
  const itemOptions = options(`${id}-`);
  return {
    ...common(id),
    itemType: "dropdown_cloze",
    clozeStem: pair("Choose {{dd}}."),
    dropdowns: [{ id: "dd", options: itemOptions, correct: itemOptions[2].id }],
    rationale: {
      correct: pair("Correct rationale"),
      byChoice: [{ refId: "dd", ...pair("Dropdown rationale") }],
    },
  };
}

function matrix(id: string): MatrixQuestion {
  const rows = options(`${id}-r`, 3);
  const columns = options(`${id}-c`, 2);
  return {
    ...common(id),
    itemType: "matrix",
    matrix: { rows, columns, selectionMode: "single_per_row" },
    correct: rows.map((row, index) => ({
      rowId: row.id,
      columnIds: [columns[index % columns.length].id],
    })),
    rationale: {
      correct: pair("Correct rationale"),
      byChoice: rows.map((row) => ({ refId: row.id, ...pair(`Rationale ${row.id}`) })),
    },
  };
}

function fill(id: string): FillInBlankQuestion {
  return {
    ...common(id),
    itemType: "fill_in_blank",
    blanks: [{ id: "blank", prompt: pair("Value"), acceptable: ["1"] }],
    rationale: { correct: pair("Correct rationale") },
  };
}

const nestedDropdown = dropdown("nested-dropdown");
const nestedMatrix = matrix("nested-matrix");
const caseStudy: CaseStudyQuestion = {
  ...common("case-parent"),
  itemType: "case_study",
  rationale: { correct: pair("Case rationale") },
  caseStudy: {
    title: pair("Case"),
    exhibits: [{ id: "exhibit", title: pair("Exhibit"), content: pair("Content") }],
    questions: [nestedDropdown, nestedMatrix],
  },
};

const bank: BankEnvelope = {
  meta: { schemaVersion: "1.1", count: 7 },
  questions: [
    multipleChoice("mc"),
    selectAll("sata"),
    ordered("ordered"),
    dropdown("dropdown"),
    matrix("matrix"),
    fill("fill"),
    caseStudy,
  ],
};

const first = normalizeBankPresentations(bank);
const second = normalizeBankPresentations(first.bank);
assert(first.changes.length > 0);
assert.equal(second.changes.length, 0);
assert.equal(serializeBank(first.bank), serializeBank(second.bank));
assert.equal(serializeBank(normalizeBankPresentations(bank).bank), serializeBank(first.bank));
assert.equal(first.skippedUnsafe, 0);

const firstQuestions = first.bank.questions;
const normalizedMc = firstQuestions[0] as MultipleChoiceQuestion;
const originalMc = bank.questions[0] as MultipleChoiceQuestion;
assert.deepEqual(normalizedMc.correct, originalMc.correct);
assert.deepEqual(normalizedMc.rationale.byChoice, originalMc.rationale.byChoice);
assert.deepEqual(
  [...normalizedMc.options.map((option) => option.id)].sort(),
  [...originalMc.options.map((option) => option.id)].sort(),
);

const normalizedSata = firstQuestions[1] as SelectAllQuestion;
const originalSata = bank.questions[1] as SelectAllQuestion;
assert.deepEqual(normalizedSata.correct, originalSata.correct);
assert.deepEqual(normalizedSata.rationale.byChoice, originalSata.rationale.byChoice);

const normalizedOrdered = firstQuestions[2] as OrderedResponseQuestion;
assert.deepEqual(normalizedOrdered.correct, (bank.questions[2] as OrderedResponseQuestion).correct);

const normalizedDropdown = firstQuestions[3] as DropdownClozeQuestion;
assert.equal(normalizedDropdown.dropdowns[0].correct, (bank.questions[3] as DropdownClozeQuestion).dropdowns[0].correct);

const normalizedMatrix = firstQuestions[4] as MatrixQuestion;
const originalMatrix = bank.questions[4] as MatrixQuestion;
assert.deepEqual(normalizedMatrix.matrix.rows, originalMatrix.matrix.rows);
assert.deepEqual(normalizedMatrix.correct, originalMatrix.correct);
assert.deepEqual(
  [...normalizedMatrix.matrix.columns.map((column) => column.id)].sort(),
  [...originalMatrix.matrix.columns.map((column) => column.id)].sort(),
);

const normalizedFill = firstQuestions[5] as FillInBlankQuestion;
assert.equal(normalizedFill, bank.questions[5]);

const normalizedCase = firstQuestions[6] as CaseStudyQuestion;
assert.notEqual(normalizedCase.caseStudy.questions[0], nestedDropdown);
assert.notEqual(normalizedCase.caseStudy.questions[1], nestedMatrix);

const broken = structuredClone(first.bank);
const brokenOrdered = broken.questions[2] as OrderedResponseQuestion;
brokenOrdered.correct[0] = "missing-option";
assert.throws(
  () => assertNormalizationInvariants(bank, broken),
  /Normalized bank failed validation/,
);

const brokenRationale = structuredClone(first.bank);
const brokenRationaleMc = brokenRationale.questions[0] as MultipleChoiceQuestion;
brokenRationaleMc.rationale.byChoice![0].refId = "missing-option";
assert.throws(
  () => assertNormalizationInvariants(bank, brokenRationale),
  /Normalized bank failed validation/,
);

const textChanged = structuredClone(first.bank);
textChanged.questions[0].stem.en = "Changed";
assert.throws(
  () => assertNormalizationInvariants(bank, textChanged),
  /outside permitted presentation-array order/,
);

console.log("presentation normalization tests passed");
