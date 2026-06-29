import assert from "node:assert/strict";
import { findStageReferenceFindings } from "../audit/audit-stage-refs";
import type {
  BankEnvelope,
  CaseStudyQuestion,
  Question,
  SchemaVersion,
  StandaloneQuestion,
  TextPair,
} from "../../src/types";

const text: TextPair = { en: "Fixture.", zh: "\u6d4b\u8bd5\u3002" };

const question = (
  id: string,
  refs: Partial<{ stageId: string; answerableAfterStageId: string }> = {},
): StandaloneQuestion => ({
  id,
  itemType: "fill_in_blank",
  category: "Management of Care",
  topic: "fixture",
  difficulty: "medium",
  stem: text,
  blanks: [{ id: "b1", prompt: text, acceptable: ["1"] }],
  rationale: { correct: text },
  testTakingStrategy: text,
  glossary: [],
  ...refs,
});

const defaultStages: CaseStudyQuestion["caseStudy"]["stages"] = [
      { id: "stage_1", title: text, exhibits: [{ id: "stage_ex1", title: text, content: text }] },
      { id: "stage_2", title: text, exhibits: [{ id: "stage_ex2", title: text, content: text }] },
];

const caseStudy = (
  id: string,
  parts: StandaloneQuestion[],
  stages: CaseStudyQuestion["caseStudy"]["stages"] | null = defaultStages,
): CaseStudyQuestion => ({
  id,
  itemType: "case_study",
  category: "Management of Care",
  topic: "fixture",
  difficulty: "medium",
  stem: text,
  rationale: { correct: text },
  testTakingStrategy: text,
  glossary: [],
  caseStudy: {
    title: text,
    exhibits: [{ id: "ex1", title: text, content: text }],
    stages: stages ?? undefined,
    questions: parts,
  },
});

const bank = (questions: Question[], schemaVersion: SchemaVersion = "1.6"): BankEnvelope => ({
  meta: { schemaVersion, exam: "NCLEX-RN", topic: "fixture", count: questions.length },
  questions,
});

let findings = findStageReferenceFindings([
  {
    file: "valid.json",
    bank: bank([
      caseStudy("case_valid", [
        question("valid_stage", { stageId: "stage_1" }),
        question("valid_after", { answerableAfterStageId: "stage_2" }),
      ]),
    ]),
  },
]);
assert.deepEqual(findings, []);

findings = findStageReferenceFindings([
  {
    file: "invalid.json",
    bank: bank([
      caseStudy("case_invalid", [
        question("bad_stage", { stageId: "missing_stage" }),
        question("bad_after", { answerableAfterStageId: "later_missing_stage" }),
      ]),
    ]),
  },
]);
assert.equal(findings.length, 2);
assert.equal(findings[0].parentId, "case_invalid");
assert.equal(findings[0].partId, "bad_after");
assert.equal(findings[0].field, "answerableAfterStageId");
assert.equal(findings[0].value, "later_missing_stage");
assert.deepEqual(findings[0].validStageIds, ["stage_1", "stage_2"]);
assert.equal(findings[1].partId, "bad_stage");
assert.equal(findings[1].field, "stageId");

findings = findStageReferenceFindings([
  {
    file: "nostages.json",
    bank: bank([
      caseStudy("case_no_stages", [
        question("bad_without_stages", { stageId: "stage_1" }),
        question("no_ref_without_stages"),
      ], null),
    ]),
  },
]);
assert.equal(findings.length, 1);
assert.equal(findings[0].parentId, "case_no_stages");
assert.equal(findings[0].partId, "bad_without_stages");
assert.deepEqual(findings[0].validStageIds, []);

console.log("audit-stage-refs tests passed");
