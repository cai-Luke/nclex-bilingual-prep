import assert from "node:assert/strict";
import type { Question } from "../../src/types";
import {
  PRODUCER_VOCABULARY_LEXICON,
  scanBundledBanks,
  scanQuestionForProducerVocabulary,
} from "../../lib/producer-vocabulary-leakage";
import { PRODUCER_VOCABULARY_LEXICON as AUDIT_LEXICON } from "../audit/audit-producer-vocabulary";
import { PRODUCER_VOCABULARY_LEXICON as MANIFEST_LEXICON } from "../producer-vocabulary-leakage-manifest";

const baseQuestion = (overrides: Record<string, unknown> = {}): Question => ({
  id: "test_item",
  itemType: "multiple_choice",
  category: "Management of Care",
  topic: "Test",
  difficulty: "medium",
  stem: { en: "Ordinary clinical wording.", zh: "普通临床表述。" },
  options: [
    { id: "A", en: "A", zh: "甲" },
    { id: "B", en: "B", zh: "乙" },
  ],
  correct: ["A"],
  rationale: {
    correct: { en: "Clinical explanation.", zh: "临床解释。" },
    byChoice: [
      { refId: "A", en: "Reason A.", zh: "甲理由。" },
      { refId: "B", en: "Reason B.", zh: "乙理由。" },
    ],
  },
  testTakingStrategy: { en: "Use the facts in the stem.", zh: "使用题干中的信息。" },
  glossary: [],
  ...overrides,
} as Question);

const scan = (question: Question) => scanQuestionForProducerVocabulary(question, "test.json");
const high = (question: Question) => scan(question).filter((entry) => entry.confidence === "HIGH");
const annex = (question: Question) => scan(question).filter((entry) => entry.confidence === "ANNEX");

for (const phrase of ["closed-world", "closed world", "source-pinned", "source pinned", "source-supported", "source supported"]) {
  assert.ok(high(baseQuestion({ stem: { en: `Use this ${phrase} rule.`, zh: "普通表述。" } })).length > 0, `${phrase} must fail`);
}

for (const phrase of ["cross the lane", "crosses this lane", "crossed a lane", "crossing that lane"]) {
  assert.ok(high(baseQuestion({ stem: { en: `The finding ${phrase}.`, zh: "普通表述。" } })).some((entry) => entry.patternId === "cross-lane"));
}

for (const phrase of ["evaluation/escalation lane", "escalation lane", "resolution lane", "acidosis-resolution lane", "teaching lane"]) {
  assert.ok(high(baseQuestion({ stem: { en: `Apply the ${phrase}.`, zh: "普通表述。" } })).length > 0, `${phrase} must fail`);
}

assert.ok(high(baseQuestion({ stem: { en: "Ordinary wording.", zh: "使用来源限定标准。" } })).some((entry) => entry.language === "zh"));

for (const phrase of ["closed scenario", "closed information pathway", "closed information channel"]) {
  assert.ok(high(baseQuestion({ stem: { en: `In this ${phrase}, the finding applies.`, zh: "普通表述。" } })).length > 0, `${phrase} must fail`);
}
for (const phrase of ["来源支持", "封闭式升级规则", "封闭式顺序", "封闭式流程", "封闭式方案", "封闭式停用方案", "封闭规则", "封闭流程", "封闭的信息通道", "封闭情境"]) {
  assert.ok(high(baseQuestion({ stem: { en: "Ordinary wording.", zh: `本题采用${phrase}。` } })).length > 0, `${phrase} must fail`);
}
assert.equal(high(baseQuestion({ stem: { en: "Ordinary wording.", zh: "这是一个封闭式提问。" } })).length, 0, "legitimate clinical closed-ended question phrasing must not fail");
assert.equal(high(baseQuestion({ stem: { en: "Ordinary wording.", zh: "保持系统封闭清洁。" } })).length, 0, "legitimate closed-system clinical phrasing must not fail");

const sourceOnly = baseQuestion({ meta: { source: "closed-world source-pinned rationale" } });
assert.equal(high(sourceOnly).length, 0, "meta.source must be excluded");

const ordinaryLane = baseQuestion({ stem: { en: "The ambulance remains in the marked lane.", zh: "救护车保持在标记车道内。" } });
assert.equal(high(ordinaryLane).length, 0);
assert.equal(annex(ordinaryLane).length, 1);

const caseQuestion = {
  ...baseQuestion({ id: "case_parent" }),
  itemType: "case_study",
  caseStudy: {
    title: { en: "Case", zh: "病例" },
    exhibits: [{ id: "ex1", title: { en: "Record", zh: "记录" }, content: { en: "A closed-world note.", zh: "普通记录。" } }],
    questions: [
      baseQuestion({ id: "nested_one", rationale: { correct: { en: "A source-supported reason.", zh: "临床理由。" } } }),
      baseQuestion({ id: "nested_two", testTakingStrategy: { en: "Follow the closed-world pathway.", zh: "遵循题干路径。" } }),
    ],
  },
} as unknown as Question;
const caseHits = high(caseQuestion);
assert.ok(caseHits.some((entry) => entry.path === "caseStudy.exhibits[0].content.en"));
assert.ok(caseHits.some((entry) => entry.embeddedQuestionId === "nested_one" && entry.path.endsWith("rationale.correct.en")));
assert.ok(caseHits.some((entry) => entry.embeddedQuestionId === "nested_two" && entry.path.endsWith("testTakingStrategy.en")));

const surfaces = baseQuestion({
  rationale: {
    correct: { en: "A closed-world rule.", zh: "普通规则。" },
    byChoice: [
      { refId: "A", en: "A source-pinned reason.", zh: "甲理由。" },
      { refId: "B", en: "A source-supported reason.", zh: "乙理由。" },
    ],
  },
  testTakingStrategy: { en: "Use closed-world thresholds.", zh: "使用题干阈值。" },
});
const surfaceHits = high(surfaces);
assert.ok(surfaceHits.some((entry) => entry.path === "rationale.correct.en"));
assert.ok(surfaceHits.some((entry) => entry.path === "rationale.byChoice[0].en"));
assert.ok(surfaceHits.some((entry) => entry.path === "testTakingStrategy.en"));

const duplicates = high(baseQuestion({ rationale: { correct: { en: "closed-world and source-pinned", zh: "普通解释。" } } }));
assert.equal(new Set(duplicates.map((entry) => entry.topLevelId)).size, 1);
assert.equal(duplicates.length, 2);

assert.equal(AUDIT_LEXICON, PRODUCER_VOCABULARY_LEXICON);
assert.equal(MANIFEST_LEXICON, PRODUCER_VOCABULARY_LEXICON);

const live = await scanBundledBanks();
const liveHigh = live.occurrences.filter((entry) => entry.confidence === "HIGH");
assert.equal(liveHigh.length, 0, `post-remediation live banks must have zero HIGH hits; found ${liveHigh.length}`);

console.log("producer-vocabulary-leakage: all focused assertions passed");
