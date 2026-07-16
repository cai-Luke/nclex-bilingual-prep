import assert from "node:assert/strict";
import { buildTopicPopulation, type SemanticResidualReview } from "../audit-topic-population";

const records = [
  {
    id: "case",
    file: "fixture.json",
    path: "questions.0",
    kind: "top_level_case_container" as const,
    parentId: null,
    category: "Physiological Adaptation",
    topic: "Parent topic",
    itemType: "case_study",
  },
  {
    id: "leaf",
    file: "fixture.json",
    path: "questions.0.caseStudy.questions.0",
    kind: "embedded_scored_leaf" as const,
    parentId: "case",
    category: "Physiological Adaptation",
    topic: "Target topic",
    itemType: "multiple_choice",
  },
  {
    id: "semantic",
    file: "fixture.json",
    path: "questions.1",
    kind: "top_level_scored_leaf" as const,
    parentId: null,
    category: "Physiological Adaptation",
    topic: "Drifted topic",
    itemType: "multiple_choice",
  },
];

const review: SemanticResidualReview = {
  topic: "Target topic",
  reviewedAt: "2026-07-16",
  reviewer: "fixture",
  method: "human_semantic_review",
  records: [{ id: "semantic", disposition: "include", reason: "Reviewed clinical match." }],
};

const result = buildTopicPopulation(records, "Target topic", review);
assert.deepEqual(result.exact.map((row) => row.id), ["leaf"], "recursive population must include embedded exact-topic leaves");
assert.equal(result.populationCount, 2, "included semantic residuals must augment the exact-topic population explicitly");
assert.throws(
  () => buildTopicPopulation(records, "Target topic", { ...review, records: [{ id: "leaf", disposition: "exclude", reason: "bad" }] }),
  /already has exact topic/,
  "semantic residual review must not duplicate exact-topic records",
);

console.log("topic population audit tests passed");
