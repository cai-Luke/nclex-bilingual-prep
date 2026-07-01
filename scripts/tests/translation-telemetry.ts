import assert from "node:assert/strict";
import { summarizeTranslationRevealEvents } from "../../src/translationTelemetry";
import type { Category, RevealBlock, TranslationRevealEvent } from "../../src/types";

const eventOf = (
  id: string,
  fields: Partial<TranslationRevealEvent> & {
    block: RevealBlock;
    category: Category;
    topic: string;
  },
): TranslationRevealEvent => {
  const { block, category, topic, ...overrides } = fields;
  return {
    id,
    sessionId: "session-a",
    questionId: `question-${id}`,
    block,
    itemType: "multiple_choice",
    category,
    topic,
    revealedAt: "2026-07-01T00:00:00.000Z",
    elapsedMsOnQuestion: 1000,
    answeredBeforeReveal: false,
    submittedBeforeReveal: false,
    revealCountForQuestion: 1,
    ...overrides,
  };
};

const empty = summarizeTranslationRevealEvents([]);
assert.deepEqual(
  empty,
  {
    totalCount: 0,
    sessionCount: 0,
    earliest: undefined,
    latest: undefined,
    byBlock: [],
    byCategory: [],
    byTopic: [],
  },
  "empty input should produce empty deterministic groups",
);

const manyTopics = Array.from({ length: 16 }, (_, index) =>
  eventOf(`topic-${index}`, {
    block: "stem",
    category: "Management of Care",
    topic: `Z Topic ${String(index).padStart(2, "0")}`,
    revealedAt: `2026-07-01T00:00:${String(index).padStart(2, "0")}.000Z`,
  }),
);

const summary = summarizeTranslationRevealEvents([
  eventOf("1", {
    block: "choices",
    category: "Physiological Adaptation",
    topic: "Respiratory failure",
    elapsedMsOnQuestion: 2000,
    submittedBeforeReveal: false,
    sessionId: "session-b",
    revealedAt: "2026-07-01T00:00:03.000Z",
  }),
  eventOf("2", {
    block: "stem",
    category: "Management of Care",
    topic: "Delegation",
    elapsedMsOnQuestion: 4000,
    submittedBeforeReveal: true,
    sessionId: "session-a",
    revealedAt: "2026-07-01T00:00:01.000Z",
  }),
  eventOf("3", {
    block: "choices",
    category: "Physiological Adaptation",
    topic: "Respiratory failure",
    elapsedMsOnQuestion: Number.NaN,
    submittedBeforeReveal: false,
    sessionId: "session-b",
    revealedAt: "2026-07-01T00:00:02.000Z",
  }),
  eventOf("4", {
    block: "case_stage",
    category: "Basic Care and Comfort",
    topic: "  ",
    elapsedMsOnQuestion: Number.POSITIVE_INFINITY,
    submittedBeforeReveal: true,
    sessionId: "session-c",
    revealedAt: "2026-07-01T00:00:04.000Z",
  }),
  ...manyTopics,
]);

assert.equal(summary.totalCount, 20, "total count should include every event");
assert.equal(summary.sessionCount, 3, "session count should count distinct sessions");
assert.equal(summary.earliest, "2026-07-01T00:00:00.000Z", "earliest should not depend on input order");
assert.equal(summary.latest, "2026-07-01T00:00:15.000Z", "latest should not depend on input order");

assert.deepEqual(
  summary.byBlock.map((row) => `${row.block}:${row.count}`),
  ["stem:17", "choices:2", "case_stage:1"],
  "blocks should sort count descending then label ascending",
);

const physiological = summary.byCategory.find((row) => row.category === "Physiological Adaptation");
assert.ok(physiological, "Physiological Adaptation category should be present");
assert.equal(physiological.avgElapsedMs, 2000, "average elapsed should ignore non-finite values");
assert.equal(physiological.beforeSubmitShare, 1, "before-submit share should use submittedBeforeReveal");

const basicCare = summary.byCategory.find((row) => row.category === "Basic Care and Comfort");
assert.ok(basicCare, "Basic Care and Comfort category should be present");
assert.equal(basicCare.avgElapsedMs, undefined, "all-non-finite elapsed groups should render as unavailable");
assert.equal(basicCare.beforeSubmitShare, 0, "after-submit-only groups should have a zero before-submit share");

assert.equal(summary.byTopic.length, 15, "topic output should be capped to the top 15 rows");
assert.equal(summary.byTopic[0]?.topic, "Respiratory failure", "highest-count topic should sort first");
assert.ok(
  summary.byTopic.some((row) => row.topic === "Unknown topic"),
  "blank topics should use the defensive fallback label",
);

const tieSummary = summarizeTranslationRevealEvents([
  eventOf("tie-1", { block: "stem", category: "Management of Care", topic: "Beta" }),
  eventOf("tie-2", { block: "choices", category: "Basic Care and Comfort", topic: "Alpha" }),
]);
assert.deepEqual(
  tieSummary.byTopic.map((row) => row.topic),
  ["Alpha", "Beta"],
  "equal-count topics should sort label ascending",
);

console.log("translation telemetry tests passed");
