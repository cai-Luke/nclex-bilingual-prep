import assert from "node:assert/strict";
import type { Question } from "../../src/types";
import {
  AUTHORIAL_CONSTRAINT_PROVENANCE,
  isBlockingCandidate,
  scanBundledAuthorialConstraints,
  scanQuestionForAuthorialConstraints,
  sortAuthorialConstraintCandidates,
} from "../../lib/authorial-constraint-leakage";
import { serializeSurvey } from "../authorial-constraint-leakage-survey";

const baseQuestion = (overrides: Record<string, unknown> = {}): Question => ({
  id: "test_item",
  itemType: "multiple_choice",
  category: "Management of Care",
  topic: "Test",
  difficulty: "medium",
  stem: { en: "Select the 2 priority actions.", zh: "选择 2 项优先措施。" },
  options: [{ id: "A", en: "Assess the client.", zh: "评估患者。" }, { id: "B", en: "Notify the provider.", zh: "通知医务人员。" }],
  correct: ["A"],
  rationale: { correct: { en: "Assess first.", zh: "先评估。" }, byChoice: [{ refId: "A", en: "Assessment is appropriate.", zh: "评估是适当的。" }, { refId: "B", en: "Notification follows assessment.", zh: "评估后再通知。" }] },
  testTakingStrategy: { en: "Use the clinical facts.", zh: "使用临床事实。" },
  glossary: [],
  ...overrides,
} as Question);

const scan = (question: Question) => scanQuestionForAuthorialConstraints(question, "banks/test.json");
const forcing = scan(baseQuestion({ stem: { en: "Complete the bowtie. Do not independently prescribe an insulin dose.", zh: "完成蝴蝶结题。不要自行开立胰岛素剂量。" } }));
assert.ok(forcing.some((row) => row.signatureId === "imperative-do-not-independently-provider-verb" && row.matchedVerb === "prescribe"));
assert.ok(forcing.some((row) => row.signatureId === "zh-do-not-self-prescribe-insulin-dose"));
assert.ok(forcing.every((row) => row.pairedPath !== null));
const pairedStrategy = scan(baseQuestion({ testTakingStrategy: { en: "Choose actions without independently changing a prescription.", zh: "选择合适、但不由患者或护士自行更改处方的措施。" } }));
assert.ok(pairedStrategy.some((row) => row.signatureId === "without-independently-provider-verb" && row.matchedVerb === "change"));
assert.ok(pairedStrategy.some((row) => row.signatureId === "zh-without-self-changing-prescription-measures"));
assert.ok(pairedStrategy.every((row) => row.blockingEligible));

for (const verb of ["prescribe", "diagnose", "change", "adjust", "titrate", "order", "insert", "perform"]) {
  const rows = scan(baseQuestion({ stem: { en: `Do not independently ${verb} treatment.`, zh: "普通题干。" } }));
  assert.ok(rows.some((row) => row.matchedVerb === verb), `${verb} variant must be detected`);
}
for (const [gerund, verb] of [["prescribing", "prescribe"], ["diagnosing", "diagnose"], ["ordering", "order"], ["changing", "change"], ["adjusting", "adjust"], ["titrating", "titrate"], ["inserting", "insert"], ["performing", "perform"]]) {
  const rows = scan(baseQuestion({ stem: { en: `Proceed without independently ${gerund} treatment.`, zh: "普通题干。" } }));
  assert.ok(rows.some((row) => row.signatureId === "without-independently-provider-verb" && row.matchedVerb === verb), `${gerund} variant must be detected`);
}

const stemBlock = forcing.find((row) => row.signatureId === "imperative-do-not-independently-provider-verb")!;
assert.equal(isBlockingCandidate(stemBlock), true);
for (const [pathName, overrides] of [
  ["rationale", { rationale: { correct: { en: "The nurse cannot independently prescribe insulin.", zh: "护士不能自行开立胰岛素。" } } }],
  ["option", { options: [{ id: "A", en: "Independently change the insulin dose.", zh: "自行改变胰岛素剂量。" }, { id: "B", en: "Assess.", zh: "评估。" }] }],
  ["client teaching", { options: [{ id: "A", en: "Do not change insulin without the prescribed plan.", zh: "不要在处方计划之外改变胰岛素。" }, { id: "B", en: "Assess.", zh: "评估。" }] }],
] as const) {
  assert.equal(scan(baseQuestion(overrides)).some((row) => row.blockingEligible), false, `${pathName} wording must not mechanically fail`);
}

const scopeCandidate = scan(baseQuestion({ stem: { en: "Select only actions within nursing scope.", zh: "选择护理职责范围内的措施。" } }));
assert.ok(scopeCandidate.some((row) => row.signatureId === "select-only-within-nursing-scope"));
assert.equal(scopeCandidate.some((row) => row.blockingEligible), false);
assert.equal(scan(baseQuestion({ stem: { en: "Which action is outside nursing scope?", zh: "哪项措施超出护理职责范围？" } })).length, 0);
assert.equal(scan(baseQuestion()).length, 0, "ordinary response instruction must not enter candidate set");
assert.equal(scan(baseQuestion({ meta: { source: "Do not independently prescribe treatment." } })).length, 0, "meta.source must be excluded");

const caseQuestion = {
  ...baseQuestion({ id: "case_parent" }),
  itemType: "case_study",
  caseStudy: {
    title: { en: "Case", zh: "病例" },
    exhibits: [{ id: "ex1", title: { en: "Record", zh: "记录" }, content: { en: "Do not claim validation.", zh: "普通记录。" } }],
    stages: [{ id: "s1", narrative: { en: "Do not invent schema fields.", zh: "普通叙述。" }, exhibits: [] }],
    questions: [baseQuestion({ id: "nested", testTakingStrategy: { en: "Do not independently diagnose the condition.", zh: "普通策略。" } })],
  },
} as unknown as Question;
const caseRows = scan(caseQuestion);
assert.ok(caseRows.some((row) => row.jsonPath === "caseStudy.exhibits[0].content.en"));
assert.ok(caseRows.some((row) => row.jsonPath === "caseStudy.stages[0].narrative.en"));
assert.ok(caseRows.some((row) => row.embeddedQuestionId === "nested" && row.surfaceClass === "TEST_TAKING_STRATEGY" && row.blockingEligible));

const unattributed = scan(baseQuestion({ stem: { en: "Assume no standing order.", zh: "普通题干。" } }));
assert.ok(unattributed.some((row) => row.promptSourcePath === null && row.notes.includes("UNATTRIBUTED")));
const attributed = forcing.find((row) => row.signatureId === "imperative-do-not-independently-provider-verb")!;
assert.equal(attributed.promptSourcePath, "GeminiPrompt.md");
assert.ok(AUTHORIAL_CONSTRAINT_PROVENANCE.some((row) => row.signatureId === attributed.signatureId && row.sourceClause?.startsWith("Do not imply")));

const duplicateEvidence = scan(baseQuestion({ stem: { en: "Do not independently prescribe or diagnose. Do not independently prescribe a dose.", zh: "普通题干。" } }));
assert.equal(duplicateEvidence.filter((row) => row.signatureId === "imperative-do-not-independently-provider-verb").length, 2);

const unsorted = [forcing.at(-1)!, forcing[0]];
assert.equal(serializeSurvey(sortAuthorialConstraintCandidates(unsorted)), serializeSurvey(sortAuthorialConstraintCandidates(unsorted)), "serialization must be byte-identical");

const live = await scanBundledAuthorialConstraints();
const liveBlocking = live.candidates.filter((row) => row.blockingEligible);
assert.equal(liveBlocking.length, 0, `post-remediation live banks must have zero blocking hits; found ${liveBlocking.length}`);

console.log("authorial-constraint-leakage: all focused assertions passed");
