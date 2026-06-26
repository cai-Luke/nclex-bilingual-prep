import { readFile } from "node:fs/promises";
import { DEFAULT_FLOOR_KIND_PRIORITY, NCLEX_CATEGORY_WEIGHTS, buildWeightedSession } from "../../src/sessionSampler";
import type { Category, QuestionProgress, QuestionRecord } from "../../src/types";
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
  itemType: "multiple_choice" | "case_study" = "multiple_choice",
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

const appSource = await readFile("src/App.tsx", "utf8");
assert(
  appSource.match(/weighting:\s*"nclex"/g)?.length === 1,
  'weighting: "nclex" must appear at exactly one integration call site',
);

console.log("session sampler tests passed");
