import assert from "node:assert/strict";
import { integrityForFile } from "../audit/audit-integrity";
import { stripCompileManifests, type CompileManifest } from "../../lib/case-completeness";
import { normalizeBankPresentations, serializeBank } from "../../lib/presentation-normalization";
import { shuffle } from "../../lib/shuffle";
import type {
  BankEnvelope,
  CaseStudyQuestion,
  DropdownClozeQuestion,
  MatrixQuestion,
  OrderedResponseQuestion,
} from "../../src/types";

const common = {
  category: "Management of Care" as const,
  topic: "fixture integrity case",
  difficulty: "hard" as const,
  rationale: { correct: { en: "Fixture rationale.", zh: "测试解析。" } },
  testTakingStrategy: { en: "Fixture strategy.", zh: "测试策略。" },
  glossary: [],
};

const byChoice = (ids: string[]) =>
  ids.map((id) => ({
    refId: id,
    en: `Fixture rationale for ${id}.`,
    zh: `${id} 的测试解析。`,
  }));

const caseQuestion: CaseStudyQuestion & { _compileManifest: CompileManifest } = {
  ...common,
  id: "audit_integrity_case_01",
  itemType: "case_study",
  stem: { en: "Review the case.", zh: "请查看病例。" },
  caseStudy: {
    title: { en: "Fixture Case", zh: "测试病例" },
    exhibits: [{ id: "note", title: { en: "Nurse note", zh: "护理记录" }, content: { en: "Data.", zh: "资料。" } }],
    questions: [
      {
        ...common,
        id: "audit_integrity_case_01_q1",
        itemType: "multiple_choice",
        stem: { en: "Which action is safest?", zh: "哪项措施最安全？" },
        options: [
          { id: "a", en: "Escalate the assignment concern.", zh: "升级报告排班问题。" },
          { id: "b", en: "Accept the full assignment silently.", zh: "默默接受全部排班。" },
          { id: "c", en: "Delay assessment until the end of the shift.", zh: "将评估推迟到班次结束。" },
        ],
        correct: ["a"],
        rationale: { ...common.rationale, byChoice: byChoice(["a", "b", "c"]) },
      },
      {
        ...common,
        id: "audit_integrity_case_01_q2",
        itemType: "select_all",
        stem: { en: "Which cues show risk?", zh: "哪些线索显示风险？" },
        options: [
          { id: "a", en: "Assignment exceeds validated competency.", zh: "排班超出已验证胜任力。" },
          { id: "b", en: "Client is stable and ready for discharge.", zh: "患者稳定并准备出院。" },
          { id: "c", en: "Charge nurse support may be delayed.", zh: "主管护士支援可能延迟。" },
          { id: "d", en: "The shift is twelve hours long.", zh: "班次为十二小时。" },
          { id: "e", en: "The unit has written escalation protocols.", zh: "该病房有书面升级处理方案。" },
        ],
        correct: ["a", "c"],
        rationale: { ...common.rationale, byChoice: byChoice(["a", "b", "c", "d", "e"]) },
      },
      {
        ...common,
        id: "audit_integrity_case_01_q3",
        itemType: "ordered_response",
        stem: { en: "Place the actions in order.", zh: "将措施按顺序排列。" },
        options: [
          { id: "step_d", en: "Evaluate the response.", zh: "评估反应。" },
          { id: "step_b", en: "Gather focused data.", zh: "收集重点资料。" },
          { id: "step_a", en: "Recognize the concern.", zh: "识别问题。" },
          { id: "step_c", en: "Implement the safest action.", zh: "实施最安全措施。" },
        ],
        correct: ["step_a", "step_b", "step_c", "step_d"],
        rationale: {
          ...common.rationale,
          byChoice: byChoice(["step_a", "step_b", "step_c", "step_d"]),
        },
      },
      {
        ...common,
        id: "audit_integrity_case_01_q4",
        itemType: "dropdown_cloze",
        stem: { en: "Complete the statement.", zh: "完成陈述。" },
        clozeStem: {
          en: "The nurse should {{action}} first.",
          zh: "护士应先{{action}}。",
        },
        dropdowns: [
          {
            id: "action",
            options: [
              { id: "opt_c", en: "delay escalation", zh: "延迟升级处理" },
              { id: "opt_a", en: "assess competency", zh: "评估胜任力" },
              { id: "opt_b", en: "ignore the concern", zh: "忽略问题" },
            ],
            correct: "opt_a",
          },
        ],
        rationale: { ...common.rationale, byChoice: [{ refId: "action", en: "Fixture dropdown rationale.", zh: "测试下拉解析。" }] },
      },
      {
        ...common,
        id: "audit_integrity_case_01_q5",
        itemType: "matrix",
        stem: { en: "Classify each cue.", zh: "对每个线索分类。" },
        matrix: {
          rows: [
            { id: "row_a", en: "New assignment outside competency", zh: "新排班超出胜任力" },
            { id: "row_b", en: "Written escalation chain available", zh: "有书面升级链" },
          ],
          columns: [
            { id: "col_unsafe", en: "Unsafe cue", zh: "不安全线索" },
            { id: "col_safe", en: "Supportive cue", zh: "支持性线索" },
          ],
          selectionMode: "single_per_row",
        },
        correct: [
          { rowId: "row_a", columnIds: ["col_unsafe"] },
          { rowId: "row_b", columnIds: ["col_safe"] },
        ],
        rationale: { ...common.rationale, byChoice: byChoice(["row_a", "row_b"]) },
      },
    ],
  },
  _compileManifest: {
    skeletonDpCount: 6,
    skeletonHasBowtie: false,
    emittedItemCount: 5,
    emittedBowtie: false,
    omittedDps: [
      { dp: 6, reason: "fixture omission" },
    ],
  },
};

const rawBank: BankEnvelope & { questions: [typeof caseQuestion] } = {
  meta: { schemaVersion: "1.1", exam: "NCLEX-RN", topic: "fixture integrity case", count: 1 },
  questions: [caseQuestion],
};

function promotedTextFor(bank: BankEnvelope): string {
  const stripped = stripCompileManifests(bank) as BankEnvelope;
  return serializeBank(
    normalizeBankPresentations({
      ...stripped,
      questions: stripped.questions.map(shuffle),
    }).bank,
  );
}

const draftText = serializeBank(rawBank);
const promotedText = promotedTextFor(rawBank);
const promotedBank = JSON.parse(promotedText) as BankEnvelope;
const promotedCase = promotedBank.questions[0] as CaseStudyQuestion;
const promotedOrdered = promotedCase.caseStudy.questions[2] as OrderedResponseQuestion;
const promotedDropdown = promotedCase.caseStudy.questions[3] as DropdownClozeQuestion;
const promotedMatrix = promotedCase.caseStudy.questions[4] as MatrixQuestion;
const originalOrdered = caseQuestion.caseStudy.questions[2] as OrderedResponseQuestion;
const originalDropdown = caseQuestion.caseStudy.questions[3] as DropdownClozeQuestion;
const originalMatrix = caseQuestion.caseStudy.questions[4] as MatrixQuestion;
assert.notDeepEqual(
  promotedOrdered.options.map((option) => option.id),
  originalOrdered.options.map((option) => option.id),
);
assert.notDeepEqual(
  promotedDropdown.dropdowns[0].options.map((option) => option.id),
  originalDropdown.dropdowns[0].options.map((option) => option.id),
);
assert.notDeepEqual(
  promotedMatrix.matrix.columns.map((column) => column.id),
  originalMatrix.matrix.columns.map((column) => column.id),
);
assert.deepEqual(promotedOrdered.correct, originalOrdered.correct);
assert.equal(promotedDropdown.dropdowns[0].correct, "opt_a");
assert.deepEqual(promotedMatrix.correct, originalMatrix.correct);
assert.deepEqual(
  promotedMatrix.rationale.byChoice?.map((choice) => choice.refId),
  ["row_a", "row_b"],
);

const checked = integrityForFile(draftText, promotedText);
assert.equal(checked.kind, "checked");
assert.deepEqual(checked.failures, []);

const tampered = JSON.parse(promotedText) as BankEnvelope;
const tamperedCase = tampered.questions[0];
assert.equal(tamperedCase.itemType, "case_study");
tamperedCase.caseStudy.questions[0].stem.en = "Tampered promoted stem.";
const tamperedResult = integrityForFile(draftText, serializeBank(tampered));
assert.equal(tamperedResult.kind, "checked");
assert(tamperedResult.failures.some((failure) => failure.id === "audit_integrity_case_01_q1"));

assert.deepEqual(integrityForFile(draftText, null), { kind: "missingPromoted" });

const brokenDraft = structuredClone(rawBank) as BankEnvelope & { questions: Array<CaseStudyQuestion & { _compileManifest?: CompileManifest }> };
delete (brokenDraft.questions[0].stem as { zh?: string }).zh;
const brokenResult = integrityForFile(serializeBank(brokenDraft), promotedText);
assert.equal(brokenResult.kind, "draftInvalid");
assert(brokenResult.reasons.length > 0);

console.log("audit-integrity tests passed");
