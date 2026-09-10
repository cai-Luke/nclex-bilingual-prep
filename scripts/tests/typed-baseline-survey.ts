import assert from "node:assert/strict";
import { collectP4CandidatesFromBank } from "../single-row-lab-panels-survey";
import { validateBankObject } from "../../src/schema";
import { typedBaselineBank } from "./typed-baseline-fixture";
import type { CaseStudyQuestion } from "../../src/types";

const bank = typedBaselineBank();
const question = bank.questions[0] as CaseStudyQuestion;
const embedded = question.caseStudy.questions[0];
// Reuse the existing single-row survey fixture's one-series payload.
embedded.rationale.visuals = [{
  kind: "lab_trend",
  time: { unit: "hr", values: [0, 6, 12] },
  series: [{ analyte: "sodium", values: [140, 137, 134] }],
}];
const validation = validateBankObject(bank);
assert(validation.ok, JSON.stringify(validation));
const survey = collectP4CandidatesFromBank({ path: "banks/synthetic.json", lane: "canonical", envelope: bank });
const evidence = survey.records.flatMap(record => record.reviewPacket.testedDecisionEvidence)
  .filter(item => item.questionId === embedded.id);
assert(evidence.length > 0, "must exercise embedded survey evidence collection");
for (const item of evidence) {
  assert.deepEqual(item.answerableAfterStageId, { kind: "baseline" });
  assert.deepEqual(JSON.parse(JSON.stringify(item)).answerableAfterStageId, { kind: "baseline" });
}
console.log("typed-baseline survey-object proof passed: embedded evidence preserves exact object");
