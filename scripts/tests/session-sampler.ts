import { readFile } from "node:fs/promises";
import {
  DEFAULT_FLOOR_KIND_PRIORITY,
  NCLEX_CATEGORY_WEIGHTS,
  buildTargetedReviewPool,
  buildWeightedSession,
  scoreTargetedReviewCandidate,
  seedFromString,
  type TargetedReviewSignals,
} from "../../src/sessionSampler";
import { buildSessionState } from "../../src/sessionState";
import type { Category, NgnSkill, QuestionFlag, QuestionProgress, QuestionRecord } from "../../src/types";
import { mulberry32 } from "../../src/visuals/primitives/prng";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

const categories = Object.keys(NCLEX_CATEGORY_WEIGHTS) as Category[];

const makeRecord = (
  id: string,
  category: Category,
  topic: string,
  visualKind?: string,
  itemType: "multiple_choice" | "select_all" | "case_study" = "multiple_choice",
  ngnSkill?: NgnSkill,
): QuestionRecord => ({
  sourceKind: "bundled",
  sourceLabel: "test",
  question: {
    id,
    itemType,
    category,
    topic,
    difficulty: "medium",
    stem: { en: id, zh: id },
    rationale: { correct: { en: "rationale", zh: "rationale" } },
    testTakingStrategy: { en: "strategy", zh: "strategy" },
    glossary: [],
    ...(ngnSkill ? { ngnSkill } : {}),
    ...(visualKind ? { visual: { kind: visualKind } } : {}),
    ...(itemType === "case_study"
      ? {
          caseStudy: {
            title: { en: id, zh: id },
            exhibits: [],
            questions: [],
          },
        }
      : {
          options: [
            { id: "a", en: "A", zh: "A" },
            { id: "b", en: "B", zh: "B" },
          ],
          correct: ["a"],
        }),
  } as QuestionRecord["question"],
});

const largePool = categories.flatMap((category) =>
  Array.from({ length: 100 }, (_, index) =>
    makeRecord(`${category}-${index}`, category, `${category}-topic-${index % 12}`),
  ),
);

const seenProgress = (records: QuestionRecord[]): Record<string, QuestionProgress> =>
  Object.fromEntries(
    records.map((record) => [
      record.question.id,
      {
        questionId: record.question.id,
        seen: 1,
        correct: 1,
        incorrect: 0,
        correctStreak: 1,
        missed: false,
      },
    ]),
  );

const progressFor = (
  questionId: string,
  overrides: Partial<QuestionProgress> = {},
): QuestionProgress => ({
  questionId,
  seen: 1,
  correct: 1,
  incorrect: 0,
  correctStreak: 1,
  missed: false,
  ...overrides,
});

const countByVisualKind = (records: QuestionRecord[], kind: string): number =>
  records.filter((record) => record.question.visual?.kind === kind).length;

const expectedCounts = new Map<Category, number>();
for (const category of categories) {
  expectedCounts.set(category, Math.floor(NCLEX_CATEGORY_WEIGHTS[category] * 50));
}

for (let seed = 1; seed <= 30; seed += 1) {
  const selected = buildWeightedSession(largePool, 50, {}, mulberry32(seed));
  assert(selected.length === 50, `seed ${seed}: weighted draw must contain 50 records`);
  for (const category of categories) {
    const actual = selected.filter((record) => record.question.category === category).length;
    assert(
      Math.abs(actual - (expectedCounts.get(category) ?? 0)) <= 1,
      `seed ${seed}: ${category} count ${actual} is outside largest-remainder tolerance`,
    );
  }
}

const meanCounts = new Map<Category, number>(categories.map((category) => [category, 0]));
for (let seed = 1; seed <= 400; seed += 1) {
  const selected = buildWeightedSession(largePool, 50, {}, mulberry32(seed));
  for (const category of categories) {
    meanCounts.set(
      category,
      (meanCounts.get(category) ?? 0) + selected.filter((record) => record.question.category === category).length,
    );
  }
}
for (const category of categories) {
  const mean = (meanCounts.get(category) ?? 0) / 400;
  const target = NCLEX_CATEGORY_WEIGHTS[category] * 50;
  assert(Math.abs(mean - target) < 0.1, `${category} mean ${mean} must track target ${target}`);
}

const floorPool = [...largePool];
for (const [kind, category] of [
  ["rhythm_strip", "Physiological Adaptation"],
  ["lab_trend", "Reduction of Risk Potential"],
  ["vitals_trend", "Management of Care"],
] as const) {
  for (let index = 0; index < 10; index += 1) {
    floorPool.push(makeRecord(`${kind}-${index}`, category, `${kind}-topic`, kind));
  }
}
floorPool.push(makeRecord("excluded-case", "Physiological Adaptation", "case", "rhythm_strip", "case_study"));

const floored = buildWeightedSession(floorPool, 50, {}, mulberry32(42));
assert(floored.length === 50, "floor reservations must remain within the 50-question target");
for (const kind of ["rhythm_strip", "lab_trend", "vitals_trend"]) {
  assert(floored.some((record) => record.question.visual?.kind === kind), `${kind} floor must reserve one item`);
}
assert(!floored.some((record) => record.question.itemType === "case_study"), "case studies must be excluded");

assert(
  JSON.stringify(DEFAULT_FLOOR_KIND_PRIORITY) === JSON.stringify(["rhythm_strip", "lab_trend", "vitals_trend"]),
  "default visual floor priority must stay explicit and ordered",
);

const allowlistVisuals = [
  ...Array.from({ length: 12 }, (_, index) =>
    makeRecord(`allow-rhythm-${index}`, "Physiological Adaptation", "allow-rhythm", "rhythm_strip")),
  ...Array.from({ length: 11 }, (_, index) =>
    makeRecord(`allow-lab-${index}`, "Reduction of Risk Potential", "allow-lab", "lab_trend")),
  ...Array.from({ length: 10 }, (_, index) =>
    makeRecord(`allow-vitals-${index}`, "Management of Care", "allow-vitals", "vitals_trend")),
  ...Array.from({ length: 13 }, (_, index) =>
    makeRecord(`allow-medlabel-${index}`, "Pharmacological and Parenteral Therapies", "allow-medlabel", "medication_label")),
];
const allowlistProgress = seenProgress(
  allowlistVisuals.filter((record) => record.question.visual?.kind === "medication_label"),
);
for (let seed = 1; seed <= 5; seed += 1) {
  const selected = buildWeightedSession([...largePool, ...allowlistVisuals], 50, allowlistProgress, mulberry32(seed));
  for (const kind of DEFAULT_FLOOR_KIND_PRIORITY) {
    assert(countByVisualKind(selected, kind) >= 1, `seed ${seed}: ${kind} must be floor-reserved`);
  }
  assert(
    countByVisualKind(selected, "medication_label") === 0,
    `seed ${seed}: high-count non-allowlisted medication_label must not be floor-reserved`,
  );
}

const thinVitalsVisuals = [
  ...allowlistVisuals.filter((record) => record.question.visual?.kind !== "vitals_trend"),
  ...Array.from({ length: 6 }, (_, index) =>
    makeRecord(`thin-vitals-${index}`, "Management of Care", "thin-vitals", "vitals_trend")),
];
const thinVitalsProgress = seenProgress(
  thinVitalsVisuals.filter((record) =>
    record.question.visual?.kind === "vitals_trend" || record.question.visual?.kind === "medication_label"),
);
const thinVitalsDraw = buildWeightedSession([...largePool, ...thinVitalsVisuals], 50, thinVitalsProgress, mulberry32(7));
assert(countByVisualKind(thinVitalsDraw, "rhythm_strip") >= 1, "viability gate must still floor rhythm_strip");
assert(countByVisualKind(thinVitalsDraw, "lab_trend") >= 1, "viability gate must still floor lab_trend");
assert(countByVisualKind(thinVitalsDraw, "vitals_trend") === 0, "below-threshold vitals_trend must not be floor-reserved");

const allVisualsSeen = seenProgress(allowlistVisuals);
const noFloorDraw = buildWeightedSession([...largePool, ...allowlistVisuals], 50, allVisualsSeen, mulberry32(8), {
  floorKindPriority: [],
});
assert(noFloorDraw.every((record) => record.question.visual === undefined), "empty floorKindPriority must disable floors");

const duplicatePriorityVisuals = [
  makeRecord("dedupe-rhythm-unseen", "Physiological Adaptation", "dedupe-rhythm", "rhythm_strip"),
  makeRecord("dedupe-rhythm-seen", "Physiological Adaptation", "dedupe-rhythm", "rhythm_strip"),
];
const dedupeDraw = buildWeightedSession(
  [...largePool, ...duplicatePriorityVisuals],
  50,
  seenProgress([duplicatePriorityVisuals[1]]),
  mulberry32(9),
  { floorThreshold: 1, floorKindPriority: ["rhythm_strip", "rhythm_strip"] },
);
assert(countByVisualKind(dedupeDraw, "rhythm_strip") === 1, "duplicate floorKindPriority entries must reserve at most once");

const smallDraw = buildWeightedSession(floorPool, 10, {}, mulberry32(42));
assert(
  smallDraw.every((record) => record.question.visual === undefined),
  "visual floors must be disabled below floorMinCount",
);

const depletedFloorPool = floorPool.filter((record) => record.question.visual?.kind !== "lab_trend");
const depleted = buildWeightedSession(depletedFloorPool, 50, {}, mulberry32(42));
assert(depleted.length === 50, "a missing floor kind must silently drop without shortening the draw");

const thinPool = categories.flatMap((category, categoryIndex) =>
  Array.from({ length: categoryIndex === 0 ? 1 : 20 }, (_, index) =>
    makeRecord(`thin-${categoryIndex}-${index}`, category, `${category}-topic-${index}`),
  ),
);
assert(
  buildWeightedSession(thinPool, 50, {}, mulberry32(9)).length === 50,
  "under-stocked category seats must redistribute",
);

const diversityCategory: Category = "Management of Care";
const diversityPool = [
  ...Array.from({ length: 90 }, (_, index) =>
    makeRecord(`glut-${index}`, diversityCategory, "glut-topic", "rhythm_strip"),
  ),
  ...Array.from({ length: 10 }, (_, index) =>
    makeRecord(`diverse-${index}`, diversityCategory, `distinct-${index}`),
  ),
];
const diverseDraw = buildWeightedSession(diversityPool, 20, {}, mulberry32(17), {
  floorMinCount: 100,
});
const distinctTopics = new Set(diverseDraw.map((record) => record.question.topic));
assert(distinctTopics.size >= 5, `diversity penalty should spread topics, got ${distinctTopics.size}`);

const deterministicA = buildWeightedSession(floorPool, 50, {}, mulberry32(123));
const deterministicB = buildWeightedSession(floorPool, 50, {}, mulberry32(123));
assert(
  deterministicA.map((record) => record.question.id).join(",") ===
    deterministicB.map((record) => record.question.id).join(","),
  "same pool and seed must produce the same ordered draw",
);

const signalCategory: Category = "Management of Care";
const otherCategory: Category = "Psychosocial Integrity";
const thirdCategory: Category = "Reduction of Risk Potential";
const targetedSignals: TargetedReviewSignals = {
  missedTopics: new Set(["missed-topic"]),
  missedCategories: new Set([signalCategory]),
  missedItemTypes: new Set(["multiple_choice"]),
  missedNgnSkills: new Set(["take_action"]),
};
const scoreFixtures: Array<{
  label: string;
  record: QuestionRecord;
  progress?: QuestionProgress;
  flag?: QuestionFlag;
  expected: number;
}> = [
  {
    label: "topic",
    record: makeRecord("score-topic", otherCategory, "missed-topic", undefined, "select_all"),
    expected: 6,
  },
  {
    label: "category",
    record: makeRecord("score-category", signalCategory, "other-topic", undefined, "select_all"),
    expected: 4,
  },
  {
    label: "item type",
    record: makeRecord("score-type", otherCategory, "other-topic", undefined, "multiple_choice"),
    expected: 3,
  },
  {
    label: "ngn",
    record: makeRecord("score-ngn", otherCategory, "other-topic", undefined, "select_all", "take_action"),
    expected: 3,
  },
  {
    label: "flag",
    record: makeRecord("score-flag", otherCategory, "other-topic", undefined, "select_all"),
    flag: { questionId: "score-flag", flagged: true, updatedAt: "2026-06-30T00:00:00.000Z" },
    expected: 5,
  },
  {
    label: "prior incorrect",
    record: makeRecord("score-incorrect", otherCategory, "other-topic", undefined, "select_all"),
    progress: progressFor("score-incorrect", { incorrect: 1 }),
    expected: 4,
  },
  {
    label: "unseen",
    record: makeRecord("score-unseen", otherCategory, "other-topic", undefined, "select_all"),
    progress: progressFor("score-unseen", { seen: 0, correct: 0, correctStreak: 0 }),
    expected: 2,
  },
  {
    label: "mastered",
    record: makeRecord("score-mastered", otherCategory, "other-topic", undefined, "select_all"),
    progress: progressFor("score-mastered", { correctStreak: 2 }),
    expected: -3,
  },
];
for (const fixture of scoreFixtures) {
  const actual = scoreTargetedReviewCandidate(
    fixture.record,
    targetedSignals,
    { [fixture.record.question.id]: fixture.progress ?? progressFor(fixture.record.question.id) },
    fixture.flag ? { [fixture.record.question.id]: fixture.flag } : {},
  );
  assert(actual === fixture.expected, `${fixture.label} scoring term expected ${fixture.expected}, got ${actual}`);
}
const additiveRecord = makeRecord("score-additive", signalCategory, "missed-topic", undefined, "multiple_choice", "take_action");
const additiveScore = scoreTargetedReviewCandidate(
  additiveRecord,
  targetedSignals,
  { [additiveRecord.question.id]: progressFor(additiveRecord.question.id, { seen: 0, correct: 0, incorrect: 1, correctStreak: 2 }) },
  { [additiveRecord.question.id]: { questionId: additiveRecord.question.id, flagged: true, updatedAt: "2026-06-30T00:00:00.000Z" } },
);
assert(additiveScore === 24, `targeted scoring must be additive, got ${additiveScore}`);

const missedStandalone = makeRecord("missed-standalone", signalCategory, "direct-retry-topic");
const directRetryPool = buildTargetedReviewPool(
  [missedStandalone],
  { questions: [missedStandalone.question], results: { [missedStandalone.question.id]: false } },
  { [missedStandalone.question.id]: progressFor(missedStandalone.question.id, { incorrect: 1, correct: 0, missed: true }) },
  {},
  1,
  mulberry32(1),
);
assert(directRetryPool.map((record) => record.question.id).includes("missed-standalone"), "a just-missed question must remain eligible for direct retry");

const missedCase = makeRecord("missed-case", signalCategory, "case-topic", undefined, "case_study", "analyze_cues");
const matchingCaseCandidate = makeRecord("case-candidate", signalCategory, "case-topic", undefined, "case_study");
const matchingStandalone = makeRecord("standalone-from-case-signal", signalCategory, "case-topic");
const caseSignalPool = buildTargetedReviewPool(
  [missedCase, matchingCaseCandidate, matchingStandalone],
  { questions: [missedCase.question], results: { [missedCase.question.id]: false } },
  {},
  {},
  5,
  mulberry32(2),
);
assert(caseSignalPool.length === 1, "case-study misses should still produce standalone remediation candidates");
assert(caseSignalPool[0]?.question.id === "standalone-from-case-signal", "standalone candidate from case-study signal must be selected");
assert(caseSignalPool.every((record) => record.question.itemType !== "case_study"), "case studies must be excluded from targeted review output");

const perfectPool = buildTargetedReviewPool(
  [matchingStandalone],
  { questions: [matchingStandalone.question], results: { [matchingStandalone.question.id]: true } },
  {},
  {},
  5,
  mulberry32(3),
);
assert(perfectPool.length === 0, "a session with no misses must not create a targeted review pool");

const tinyPool = [makeRecord("tiny-a", signalCategory, "tiny-topic"), makeRecord("tiny-b", otherCategory, "other-tiny")];
const tinyTargeted = buildTargetedReviewPool(
  tinyPool,
  { questions: [tinyPool[0].question], results: { [tinyPool[0].question.id]: false } },
  {},
  {},
  10,
  mulberry32(4),
);
assert(tinyTargeted.length === 2, "thin targeted banks must return fewer than count rather than padding");
assert(new Set(tinyTargeted.map((record) => record.question.id)).size === tinyTargeted.length, "targeted review must never duplicate question IDs");

const fallbackRecords = [
  makeRecord("fallback-strong", signalCategory, "fallback-miss"),
  makeRecord("fallback-tier1", otherCategory, "fallback-tier1"),
  makeRecord("fallback-settled", thirdCategory, "fallback-settled"),
];
const fallbackDraw = buildTargetedReviewPool(
  fallbackRecords,
  { questions: [fallbackRecords[0].question], results: { [fallbackRecords[0].question.id]: false } },
  {
    "fallback-strong": progressFor("fallback-strong"),
    "fallback-tier1": progressFor("fallback-tier1", { missed: true }),
    "fallback-settled": progressFor("fallback-settled"),
  },
  {},
  2,
  mulberry32(5),
);
const fallbackIds = new Set(fallbackDraw.map((record) => record.question.id));
assert(fallbackIds.has("fallback-strong"), "fallback draw must include the strong signal candidate");
assert(fallbackIds.has("fallback-tier1"), "Stage 2 must prefer seen missed/due candidates before settled candidates");
assert(!fallbackIds.has("fallback-settled"), "Stage 2 must not draw settled candidates before tier 1 is exhausted");

const targetedDiversityPool = [
  makeRecord("target-glut-0", signalCategory, "target-glut", "rhythm_strip"),
  makeRecord("target-glut-1", signalCategory, "target-glut", "rhythm_strip"),
  makeRecord("target-glut-2", signalCategory, "target-glut", "rhythm_strip"),
  makeRecord("target-diverse", signalCategory, "target-diverse"),
];
const diversityRngValues = [0, 0, 0.5, 0, 0];
const targetedDiverseDraw = buildTargetedReviewPool(
  targetedDiversityPool,
  { questions: [targetedDiversityPool[0].question], results: { [targetedDiversityPool[0].question.id]: false } },
  Object.fromEntries(targetedDiversityPool.map((record) => [record.question.id, progressFor(record.question.id)])),
  {},
  3,
  () => diversityRngValues.shift() ?? 0,
);
assert(
  targetedDiverseDraw.some((record) => record.question.id === "target-diverse"),
  "targeted review diversity dampening should make repeated topic/kind candidates progressively less dominant",
);

const deterministicTargetedA = buildTargetedReviewPool(
  [...targetedDiversityPool, ...fallbackRecords],
  { questions: [targetedDiversityPool[0].question], results: { [targetedDiversityPool[0].question.id]: false } },
  {},
  {},
  4,
  mulberry32(seedFromString("session-fixed")),
);
const deterministicTargetedB = buildTargetedReviewPool(
  [...targetedDiversityPool, ...fallbackRecords],
  { questions: [targetedDiversityPool[0].question], results: { [targetedDiversityPool[0].question.id]: false } },
  {},
  {},
  4,
  mulberry32(seedFromString("session-fixed")),
);
assert(
  deterministicTargetedA.map((record) => record.question.id).join(",") ===
    deterministicTargetedB.map((record) => record.question.id).join(","),
  "same targeted review input and seed must produce the same ordered pool",
);

const sessionStatePlain = buildSessionState({
  id: "session-plain",
  mode: "study",
  questions: [missedStandalone.question],
  poolIds: [missedStandalone.question.id],
  languageMode: "on-tap",
  title: "Plain",
  startedAt: "2026-06-30T12:00:00.000Z",
});
assert(
  JSON.stringify(sessionStatePlain) === JSON.stringify({
    id: "session-plain",
    mode: "study",
    questions: [missedStandalone.question],
    poolIds: [missedStandalone.question.id],
    index: 0,
    answers: {},
    results: {},
    scores: {},
    skippedQuestionIds: [],
    phase: "questions",
    languageMode: "on-tap",
    title: "Plain",
    startedAt: "2026-06-30T12:00:00.000Z",
  }),
  "buildSessionState must preserve the plain session object shape",
);
const adaptiveSnapshot = {
  targetCount: 75,
  currentDifficulty: "medium" as const,
  rollingResults: [],
  difficultyHistory: [{ questionId: missedStandalone.question.id, difficulty: missedStandalone.question.difficulty }],
};
const sessionStateAdaptive = buildSessionState({
  id: "session-adaptive",
  mode: "adaptive",
  questions: [missedStandalone.question],
  poolIds: [missedStandalone.question.id, matchingStandalone.question.id],
  languageMode: "off",
  title: "Adaptive",
  startedAt: "2026-06-30T13:00:00.000Z",
  adaptive: adaptiveSnapshot,
});
assert(sessionStateAdaptive.adaptive === adaptiveSnapshot, "buildSessionState must preserve adaptive session metadata");
assert(sessionStateAdaptive.mode === "adaptive" && sessionStateAdaptive.languageMode === "off", "buildSessionState must preserve adaptive branch shape");

const appSource = await readFile("src/App.tsx", "utf8");
assert(
  appSource.match(/weighting:\s*"nclex"/g)?.length === 1,
  'weighting: "nclex" must appear at exactly one integration call site',
);
assert(!appSource.includes("buildRelatedPracticePool"), "old related practice helper must be removed after targeted review wiring");

console.log("session sampler tests passed");
