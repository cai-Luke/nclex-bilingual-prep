import assert from "node:assert/strict";
import {
  STANDALONE_SPLIT_VISUAL_KINDS,
  getVisibleCaseStages,
  usesStandaloneVisualSplit,
} from "../../src/examLayout";
import type { CaseStudyQuestion, CaseStudyStage, CaseSubQuestion, Question } from "../../src/types";

const stages = ["s1", "s2", "s3"].map(
  (id) => ({ id, title: { en: id, zh: id }, exhibits: [] }) as CaseStudyStage,
);
const caseOf = (stageList: CaseStudyStage[]): CaseStudyQuestion =>
  ({ caseStudy: { stages: stageList, questions: [] } }) as unknown as CaseStudyQuestion;
const part = (fields: Partial<CaseSubQuestion>): CaseSubQuestion => fields as unknown as CaseSubQuestion;

const ids = (result: CaseStudyStage[]) => result.map((stage) => stage.id);

assert.deepEqual(ids(getVisibleCaseStages(caseOf([]), part({ stageId: "s1" }))), [], "no stages -> []");
assert.deepEqual(ids(getVisibleCaseStages(caseOf(stages), undefined)), [], "no active part -> []");

assert.deepEqual(
  ids(getVisibleCaseStages(caseOf(stages), part({ stageId: "s2" }))),
  ["s1", "s2"],
  "stageId cumulative",
);

assert.deepEqual(
  ids(getVisibleCaseStages(caseOf(stages), part({ answerableAfterStageId: "s2" }))),
  ["s1", "s2"],
  "answerableAfterStageId cumulative",
);

assert.deepEqual(
  ids(getVisibleCaseStages(caseOf(stages), part({ stageId: "nope" }))),
  ["s1", "s2", "s3"],
  "unresolved stageId -> all stages",
);
assert.deepEqual(
  ids(getVisibleCaseStages(caseOf(stages), part({ answerableAfterStageId: "nope" }))),
  ["s1", "s2", "s3"],
  "unresolved answerableAfterStageId -> all stages",
);

assert.deepEqual(
  ids(getVisibleCaseStages(caseOf(stages), part({ answerableAfterStageId: "s1", stageId: "s3" }))),
  ["s1"],
  "answerableAfterStageId wins over stageId",
);

const mc = (kind?: string): Question =>
  ({ itemType: "multiple_choice", ...(kind ? { visual: { kind } } : {}) }) as unknown as Question;
assert.equal(usesStandaloneVisualSplit(mc("lab_trend")), true, "lab_trend splits");
assert.equal(usesStandaloneVisualSplit(mc("vitals_trend")), true, "vitals_trend splits");
assert.equal(usesStandaloneVisualSplit(mc("burn_map")), true, "burn_map splits");
assert.equal(usesStandaloneVisualSplit(mc("rhythm_strip")), false, "rhythm_strip excluded");
assert.equal(usesStandaloneVisualSplit(mc("capnography")), false, "capnography excluded");
assert.equal(usesStandaloneVisualSplit(mc("fetal_monitoring")), false, "fetal_monitoring excluded");
assert.equal(usesStandaloneVisualSplit(mc("mar")), false, "mar excluded");
assert.equal(usesStandaloneVisualSplit(mc("io_record")), true, "io_record splits");
assert.equal(usesStandaloneVisualSplit(mc()), false, "no visual -> no split");
assert.equal(
  usesStandaloneVisualSplit({ itemType: "case_study", visual: { kind: "lab_trend" } } as unknown as Question),
  false,
  "case_study never standalone-splits",
);

assert.equal(STANDALONE_SPLIT_VISUAL_KINDS.size, 7, "exactly seven standalone split kinds");

console.log("exam layout tests passed");
