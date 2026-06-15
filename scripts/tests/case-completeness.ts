import assert from "node:assert/strict";
import {
  checkCaseCompileManifests,
  stripCompileManifests,
  type CompileManifest,
} from "../../lib/case-completeness";
import { validateBankObject } from "../../src/schema";
import type { BowtieQuestion, CaseStudyQuestion } from "../../src/types";

const common = {
  category: "Management of Care" as const,
  topic: "fixture case",
  difficulty: "hard" as const,
  stem: { en: "Fixture", zh: "测试题" },
  rationale: { correct: { en: "Fixture rationale", zh: "测试解析" } },
  testTakingStrategy: { en: "Fixture strategy", zh: "测试策略" },
  glossary: [],
};

const part = (id: string) => ({
  ...common,
  id,
  itemType: "fill_in_blank" as const,
  blanks: [{ id: "b1", prompt: { en: "Value", zh: "数值" }, acceptable: ["1"] }],
});

const caseQuestion: CaseStudyQuestion & { _compileManifest: CompileManifest } = {
  ...common,
  id: "case_fixture_01",
  itemType: "case_study",
  caseStudy: {
    title: { en: "Case", zh: "病例" },
    exhibits: [{ id: "ex1", title: { en: "Note", zh: "记录" }, content: { en: "Data", zh: "数据" } }],
    questions: Array.from({ length: 5 }, (_, index) => part(`case_fixture_01_q${index + 1}`)),
  },
  _compileManifest: {
    skeletonDpCount: 6,
    skeletonHasBowtie: true,
    emittedItemCount: 5,
    emittedBowtie: false,
    omittedDps: [{ dp: 4, reason: "underspecified: no unambiguous keyed action" }],
    bowtieOmissionReason: "Malformed source zone: parameters did not contain two confirming markers.",
  },
};

const validRaw = {
  meta: { schemaVersion: "1.4", count: 1 },
  questions: [caseQuestion],
};
assert.deepEqual(checkCaseCompileManifests(validRaw), []);
assert.equal(validateBankObject(validRaw).ok, false, "canonical validation must reject a leaked manifest");
assert.equal(validateBankObject(stripCompileManifests(validRaw)).ok, true);

const unexplained = structuredClone(validRaw);
delete unexplained.questions[0]._compileManifest.bowtieOmissionReason;
assert(
  checkCaseCompileManifests(unexplained)[0].reasons.includes(
    "bowtieOmissionReason is required when an authored bowtie is omitted",
  ),
);

const wrongCount = structuredClone(validRaw);
wrongCount.questions[0]._compileManifest.emittedItemCount = 6;
assert(
  checkCaseCompileManifests(wrongCount)[0].reasons.includes(
    "emittedItemCount 6 does not match caseStudy.questions.length 5",
  ),
);

const missingAccounting = structuredClone(validRaw);
missingAccounting.questions[0]._compileManifest.omittedDps = [];
assert(
  checkCaseCompileManifests(missingAccounting)[0].reasons.some((reason) =>
    reason.includes("must equal skeletonDpCount"),
  ),
);

const bowtie: BowtieQuestion = {
  ...common,
  id: "case_fixture_01_bowtie",
  itemType: "bowtie",
  bowtie: {
    condition: {
      tokens: [
        { id: "c1", en: "Condition", zh: "病情" },
        { id: "c2", en: "Alternative", zh: "其他病情" },
      ],
      correct: "c1",
    },
    actions: {
      tokens: [
        { id: "a1", en: "Action 1", zh: "措施一" },
        { id: "a2", en: "Action 2", zh: "措施二" },
        { id: "a3", en: "Wrong action", zh: "错误措施" },
      ],
      correct: ["a1", "a2"],
    },
    parameters: {
      tokens: [
        { id: "p1", en: "Parameter 1", zh: "指标一" },
        { id: "p2", en: "Parameter 2", zh: "指标二" },
        { id: "p3", en: "Wrong parameter", zh: "错误指标" },
      ],
      correct: ["p1", "p2"],
    },
  },
};
const withBowtie = structuredClone(validRaw);
withBowtie.meta.count = 2;
withBowtie.questions[0]._compileManifest.emittedBowtie = true;
withBowtie.questions[0]._compileManifest.bowtieOmissionReason = undefined;
withBowtie.questions.push(bowtie as never);
assert.deepEqual(checkCaseCompileManifests(withBowtie), []);

console.log("case completeness tests passed");
