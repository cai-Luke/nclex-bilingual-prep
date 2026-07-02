import assert from "node:assert/strict";
import {
  normalizeTranslationFrictionAttempts,
  summarizeTranslationFriction,
  summarizeTranslationRevealEvents,
} from "../../src/translationTelemetry";
import type {
  AnswerEvent,
  CaseAnswerPartEvent,
  Category,
  Question,
  RevealBlock,
  TranslationRevealEvent,
} from "../../src/types";

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

const questionOf = (id: string, topic = `Topic ${id}`): Extract<Question, { itemType: "multiple_choice" }> => ({
  id,
  itemType: "multiple_choice",
  category: "Physiological Adaptation",
  topic,
  difficulty: "medium",
  stem: { en: `Stem for ${id}`, zh: `题干 ${id}` },
  options: [
    { id: "A", en: "A", zh: "甲" },
    { id: "B", en: "B", zh: "乙" },
  ],
  correct: ["A"],
  rationale: { correct: { en: "Because A.", zh: "因为甲。" } },
  testTakingStrategy: { en: "Read the cue.", zh: "阅读线索。" },
  glossary: [],
});

const answerEventOf = (id: string, questionId: string, fields: Partial<AnswerEvent> = {}): AnswerEvent => ({
  id,
  questionId,
  wasCorrect: true,
  answeredAt: "2026-07-02T00:00:00.000Z",
  sessionId: "session-a",
  sessionMode: "study",
  languageModeAtAnswer: "on-tap",
  ...fields,
});

const casePartEventOf = (
  id: string,
  partId: string,
  fields: Partial<CaseAnswerPartEvent> = {},
): CaseAnswerPartEvent => ({
  id,
  questionId: "case-1",
  partId,
  wasCorrect: false,
  answeredAt: "2026-07-02T00:04:00.000Z",
  sessionId: "session-e",
  sessionMode: "study",
  languageModeAtAnswer: "on-tap",
  ...fields,
});

const caseQuestion: Question = {
  id: "case-1",
  itemType: "case_study",
  category: "Management of Care",
  topic: "Case parent topic",
  difficulty: "hard",
  stem: { en: "Case parent stem", zh: "案例题干" },
  rationale: { correct: { en: "Case rationale.", zh: "案例解析。" } },
  testTakingStrategy: { en: "Use the chart.", zh: "使用病历。" },
  glossary: [],
  caseStudy: {
    title: { en: "Case 1", zh: "案例 1" },
    exhibits: [],
    questions: [
      {
        ...questionOf("part-1", "Case part topic"),
        id: "part-1",
        category: "Management of Care",
      },
    ],
  },
};

const frictionQuestions = [
  questionOf("q-correct-no", "No reveal topic"),
  questionOf("q-missed-no", "Missed no reveal topic"),
  questionOf("q-correct-reveal", "Reveal topic"),
  questionOf("q-missed-reveal", "Reveal topic"),
  questionOf("q-test", "Ineligible topic"),
  caseQuestion,
];

const normalized = normalizeTranslationFrictionAttempts({
  answerEvents: [
    answerEventOf("legacy-1", "q-correct-no", { sessionId: undefined }),
    answerEventOf("case-parent-1", "case-1"),
    answerEventOf("standalone-1", "q-correct-no"),
  ],
  caseAnswerPartEvents: [casePartEventOf("case-part-1", "part-1")],
  questions: frictionQuestions,
});
assert.equal(normalized.attempts.length, 2, "normalization should keep standalone and case-part attempts");
assert.equal(normalized.diagnostics.legacyUnjoinableAttemptCount, 1, "legacy answer rows should be counted");
assert.equal(
  normalized.diagnostics.excludedCaseTopLevelAnswerEventCount,
  1,
  "top-level case-study answer rows should be excluded from standalone attempts",
);

const frictionEvents = [
  eventOf("correct-reveal-glossary", {
    questionId: "q-correct-reveal",
    block: "glossary",
    category: "Physiological Adaptation",
    topic: "Reveal topic",
    sessionId: "session-b",
    revealedAt: "2026-07-02T00:01:30.000Z",
    answeredBeforeReveal: true,
    submittedBeforeReveal: false,
    elapsedMsOnQuestion: 9000,
  }),
  eventOf("correct-reveal-stem", {
    questionId: "q-correct-reveal",
    block: "stem",
    category: "Physiological Adaptation",
    topic: "Reveal topic",
    sessionId: "session-b",
    revealedAt: "2026-07-02T00:01:30.000Z",
    answeredBeforeReveal: true,
    submittedBeforeReveal: false,
    elapsedMsOnQuestion: 8000,
  }),
  eventOf("correct-reveal-post-submit", {
    questionId: "q-correct-reveal",
    block: "rationale",
    category: "Physiological Adaptation",
    topic: "Reveal topic",
    sessionId: "session-b",
    revealedAt: "2026-07-02T00:02:00.000Z",
    answeredBeforeReveal: true,
    submittedBeforeReveal: true,
  }),
  eventOf("missed-reveal", {
    questionId: "q-missed-reveal",
    block: "choices",
    category: "Physiological Adaptation",
    topic: "Reveal topic",
    sessionId: "session-c",
    revealedAt: "2026-07-02T00:02:30.000Z",
    answeredBeforeReveal: true,
    submittedBeforeReveal: false,
  }),
  eventOf("case-reveal", {
    questionId: "case-1",
    partId: "part-1",
    block: "stem",
    category: "Management of Care",
    topic: "Case part topic",
    sessionId: "session-e",
    revealedAt: "2026-07-02T00:04:30.000Z",
    submittedBeforeReveal: false,
  }),
  eventOf("unjoined", {
    questionId: "q-unanswered",
    block: "stem",
    category: "Basic Care and Comfort",
    topic: "Unanswered",
    sessionId: "session-z",
    revealedAt: "2026-07-02T00:05:00.000Z",
  }),
];

const frictionSummary = summarizeTranslationFriction({
  attempts: [
    {
      questionId: "q-correct-no",
      itemType: "standalone",
      wasCorrect: true,
      sessionId: "session-a",
      sessionMode: "study",
      languageModeAtAnswer: "on-tap",
      answeredAt: "2026-07-02T00:00:00.000Z",
    },
    {
      questionId: "q-missed-no",
      itemType: "standalone",
      wasCorrect: false,
      sessionId: "session-a",
      sessionMode: "study",
      languageModeAtAnswer: "on-tap",
      answeredAt: "2026-07-02T00:00:30.000Z",
    },
    {
      questionId: "q-correct-reveal",
      itemType: "standalone",
      wasCorrect: true,
      sessionId: "session-b",
      sessionMode: "study",
      languageModeAtAnswer: "on-tap",
      answeredAt: "2026-07-02T00:01:00.000Z",
    },
    {
      questionId: "q-missed-reveal",
      itemType: "standalone",
      wasCorrect: false,
      sessionId: "session-c",
      sessionMode: "study",
      languageModeAtAnswer: "on-tap",
      answeredAt: "2026-07-02T00:02:00.000Z",
    },
    {
      questionId: "q-test",
      itemType: "standalone",
      wasCorrect: false,
      sessionId: "session-d",
      sessionMode: "test",
      languageModeAtAnswer: "on-tap",
      answeredAt: "2026-07-02T00:03:00.000Z",
    },
    {
      questionId: "case-1",
      partId: "part-1",
      itemType: "case_part",
      wasCorrect: false,
      sessionId: "session-e",
      sessionMode: "study",
      languageModeAtAnswer: "on-tap",
      answeredAt: "2026-07-02T00:04:00.000Z",
    },
  ],
  events: frictionEvents,
  questions: frictionQuestions,
  normalizationDiagnostics: normalized.diagnostics,
  minAuditAttempts: 1,
  topAuditCandidates: 10,
  sessionBucketSize: 2,
});

assert.deepEqual(
  frictionSummary.enrichedRows.map((row) => row.bucket).sort(),
  ["correct_after_reveal", "correct_no_reveal", "missed_after_reveal", "missed_after_reveal", "missed_no_reveal"].sort(),
  "eligible attempts should produce exactly one row across all four observational buckets",
);

const correctRevealRow = frictionSummary.enrichedRows.find((row) => row.questionId === "q-correct-reveal");
assert.ok(correctRevealRow, "joined correct-reveal row should be present");
assert.equal(
  correctRevealRow.revealBeforeSubmitCount,
  2,
  "pre-submit status should use submittedBeforeReveal and ignore answeredBeforeReveal",
);
assert.deepEqual(
  correctRevealRow.revealedBlocks,
  ["stem", "glossary", "rationale"],
  "revealed blocks should be deterministically ordered by first occurrence with stable tie fallback",
);

const caseCandidate = frictionSummary.auditCandidates.find((row) => row.questionId === "case-1");
assert.ok(caseCandidate, "case-study candidates should rank at part level");
assert.equal(caseCandidate.partId, "part-1", "case-study audit candidate should retain partId");
assert.equal(caseCandidate.itemType, "case_part", "case-study audit candidate should use case_part item type");
assert.equal(caseCandidate.stem_excerpt, "Stem for part-1", "stem excerpt should resolve from current bank content");

assert.equal(frictionSummary.diagnostics.revealEventCount, 6, "diagnostics should include raw reveal count");
assert.equal(frictionSummary.diagnostics.joinedEventCount, 5, "diagnostics should count joined reveal events");
assert.equal(frictionSummary.diagnostics.unjoinedRevealEventCount, 1, "diagnostics should count unjoined reveal events");
assert.equal(frictionSummary.diagnostics.ineligibleAttemptCount, 1, "test/adaptive or non-on-tap attempts should be ineligible");
assert.deepEqual(
  frictionSummary.diagnostics.attemptSourceBreakdown,
  { standalone: 5, casePart: 1 },
  "diagnostics should include source breakdown across normalized attempt sources",
);
assert.equal(
  frictionSummary.diagnostics.excludedCaseTopLevelAnswerEventCount,
  1,
  "normalization exclusion count should be reflected in diagnostics",
);

assert.ok(
  frictionSummary.fadeTrend.some(
    (row) => row.topic === "Case part topic" && row.sessionBucketStart === 1 && row.attemptCount === 0 && row.lowSample,
  ),
  "fade trend should keep zero-eligible sparse buckets instead of hiding them",
);
assert.ok(
  frictionSummary.fadeTrend.every((row) => row.attemptCount !== 0 || row.revealBeforeSubmitRate === null),
  "zero-denominator fade rows should use a null rate",
);

console.log("translation telemetry tests passed");
