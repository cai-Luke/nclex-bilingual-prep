import {
  DEFAULT_FLOOR_KIND_PRIORITY,
  NCLEX_CATEGORY_WEIGHTS,
  buildWeightedSession,
  reviewReservation, buildUnweightedSession, selectExplicitPopulation,
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
        needsReview: false,
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
  needsReview: false,
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


// Replacement contract: bounded, global reservation precedes unseen tiers.
const backlog=largePool.slice(0,30);
const needs=Object.fromEntries(backlog.map((r,i)=>[r.question.id,progressFor(r.question.id,{needsReview:true,correct:0,incorrect:1,lastSeenAt:i<2?undefined:new Date(2020,0,i).toISOString()})]));
for(const [n,r] of [[2,0],[4,0],[5,1],[10,2],[25,5],[50,10]]) {
  assert(reviewReservation(n,30)===r,`N=${n}: exact reservation`);
  const selected=buildWeightedSession(largePool,n,needs,mulberry32(4));
  assert(selected.filter(q=>needs[q.question.id]?.needsReview).length===r,`N=${n}: reserve before unseen`);
  assert(selected.length===n&&new Set(selected.map(r=>r.question.id)).size===n,'unique full set');
  const unweighted=buildUnweightedSession(largePool,n,needs,mulberry32(4));
  assert(unweighted.filter(r=>needs[r.question.id]?.needsReview).length===r,'unweighted reservation');
}
for(const size of [0,1,3,9,30]) {
  const subset=Object.fromEntries(Object.entries(needs).slice(0,size));
  const selected=buildWeightedSession(largePool,50,subset,mulberry32(5));
  assert(selected.filter(r=>subset[r.question.id]?.needsReview).length===Math.min(size,10),'small review pool cap');
}
const concentrated=buildWeightedSession(largePool,50,needs,mulberry32(10));
assert(concentrated.filter(r=>r.question.category===categories[0]).length>=10,'concentrated backlog borrows category capacity');
assert(concentrated.some(r=>r.question.id===backlog[0].question.id),'missing timestamps sort first');
const off=buildWeightedSession(backlog,50,needs,mulberry32(5),{revisitMissed:false});
assert(off.length===0,'toggle off excludes review, even when it shortens set');
assert(buildUnweightedSession(backlog,50,needs,mulberry32(5),false).length===0,'toggle off unweighted');
const backfill=buildWeightedSession(backlog,25,needs,mulberry32(6));
assert(backfill.length===25,'ordinary tier-1 backfill may exceed reservation after unseen exhaustion');
const visualReview=floorPool.find(r=>r.question.visual?.kind==='rhythm_strip')!;
const reviewVisualProgress={...seenProgress(floorPool.filter(r=>r.question.visual?.kind==='rhythm_strip')),[visualReview.question.id]:progressFor(visualReview.question.id,{needsReview:true,lastSeenAt:undefined})};
const reservedFloor=buildWeightedSession(floorPool,50,reviewVisualProgress,mulberry32(42));
assert(reservedFloor.filter(r=>r.question.visual?.kind==='rhythm_strip').length===1,'reserved visual satisfies floor without a second draw');
for(const kind of DEFAULT_FLOOR_KIND_PRIORITY)assert(countByVisualKind(reservedFloor,kind)>=1,'other visual floors survive');
const smallFloor=buildWeightedSession(floorPool,4,reviewVisualProgress,mulberry32(42),{floorMinCount:1});
// Minimum tier for a floor remains unseen before settled; no extra review preference.
const floorTierPool=[makeRecord('unseen-floor',categories[0],'floor','rhythm_strip'),makeRecord('review-floor',categories[0],'floor','rhythm_strip')];
const floorTier=buildWeightedSession(floorTierPool,1,{'review-floor':progressFor('review-floor',{needsReview:true})},mulberry32(5),{floorMinCount:1,floorThreshold:1});
assert(floorTier[0].question.id==='unseen-floor','floor still prefers minimum progress tier');
const wholeCase=makeRecord('whole-case',categories[0],'case',undefined,'case_study');
const explicitNeeds={...needs,'whole-case':progressFor('whole-case',{needsReview:true})};
const population=[...largePool,wholeCase];
const explicit=selectExplicitPopulation(population,'needsReview',100,explicitNeeds,{});
assert(explicit.length===31&&explicit.some(r=>r.question.id==='whole-case'),'explicit Needs review includes whole cases and never backfills');
const flags={'whole-case':{questionId:'whole-case',flagged:true,updatedAt:'2026-09-12'},[largePool[799].question.id]:{questionId:largePool[799].question.id,flagged:false,note:'note only',updatedAt:'2026-09-12'}};
assert(selectExplicitPopulation(population,'saved',100,{},flags).length===1,'Saved only includes saved boolean, not notes or backfill');
const state=buildSessionState({id:'test',mode:'study',questions:[largePool[0].question],poolIds:[largePool[0].question.id],languageMode:'on-tap',title:'test',startedAt:'2026-09-12',launchIntent:'ordinary',returnView:'home',requestedCount:10});
assert(state.launchIntent==='ordinary'&&state.requestedCount===10&&Boolean(state.fingerprints[largePool[0].question.id]),'construction captures intent and compatibility');
console.log('session sampler: weighting, floors, diversity, reservation, borrowing, explicit populations passed');

// R1.1: reservation uses the deliverable target, while ordinary backfill is uncapped.
const underCapacityPool = Array.from({ length: 12 }, (_, index) =>
  makeRecord(`under-capacity-${index}`, categories[0], `under-capacity-topic-${index}`),
);
const underCapacityProgress = Object.fromEntries(
  underCapacityPool.slice(0, 10).map((record, index) => [
    record.question.id,
    progressFor(record.question.id, {
      needsReview: true,
      correct: 0,
      incorrect: 1,
      lastSeenAt: new Date(Date.UTC(2020, 0, index + 1)).toISOString(),
    }),
  ]),
);
const underCapacityRequested = 50;
const underCapacityTarget = 12;
const underCapacityReviewPool = 10;
const underCapacityReserved = reviewReservation(underCapacityTarget, underCapacityReviewPool);
assert(underCapacityReserved === 2, "requested 50 / effective 12 / review pool 10 reserves exactly 2");
assert(reviewReservation(4, 4) === 0, "an effective target below 5 reserves no review seats");

for (const weighted of [true, false]) {
  const label = weighted ? "weighted" : "unweighted";
  // Duplicate rows and a weighted-only excluded case cannot inflate the effective pool.
  const input = [
    ...underCapacityPool,
    ...underCapacityPool,
    ...(weighted ? [wholeCase] : []),
  ];
  for (let seed = 1; seed <= 5; seed += 1) {
    const draw = (count: number, revisitMissed = true) => weighted
      ? buildWeightedSession(input, count, underCapacityProgress, mulberry32(seed), { revisitMissed })
      : buildUnweightedSession(input, count, underCapacityProgress, mulberry32(seed), revisitMissed);
    const delivered = draw(underCapacityRequested);
    const deliveredReviewCount = delivered.filter(
      (record) => underCapacityProgress[record.question.id]?.needsReview,
    ).length;
    assert(delivered.length === underCapacityTarget, `${label}: deliver all 12 eligible questions`);
    assert(new Set(delivered.map((record) => record.question.id)).size === underCapacityTarget,
      `${label}: deduplicate before calculating the effective target`);
    assert(deliveredReviewCount === 10 && deliveredReviewCount - underCapacityReserved === 8,
      `${label}: 2 reserved plus 8 ordinary backfill must deliver all 10 review questions; R is not a cap`);
    // Comparing identical effective targets observes reservation accounting through the
    // seeded selection/shuffle path; checking only final membership would miss the bug.
    assert(
      delivered.map((record) => record.question.id).join(",") ===
        draw(underCapacityTarget).map((record) => record.question.id).join(","),
      `${label}, seed ${seed}: request 50 must use the same reservation as effective target 12`,
    );
    assert(draw(50, false).length === 2,
      `${label}: toggle-off exclusion reduces the effective target to the 2 unseen questions`);
  }
  console.log(`${label} under capacity: requested 50, effective 12, reserved 2, backfill 8, total review 10; 5 seeds passed`);
}
