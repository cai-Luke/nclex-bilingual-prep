import assert from "node:assert/strict";
import {
  BACKFILL_TYPES,
  computeCoverage,
  parseSessionSize,
  SESSION_SIZE,
} from "../coverage-report";
import { itemTypes, NCLEX_CATEGORY_WEIGHTS } from "../../src/schema";
import type { Category, ItemType, MultipleChoiceQuestion, Question, StandaloneItemType } from "../../src/types";

const counts: Record<Category, number> = {
  "Management of Care": 140,
  "Safety and Infection Control": 139,
  "Health Promotion and Maintenance": 138,
  "Psychosocial Integrity": 137,
  "Basic Care and Comfort": 145,
  "Pharmacological and Parenteral Therapies": 153,
  "Reduction of Risk Potential": 147,
  "Physiological Adaptation": 220,
};

const makeQuestion = (category: Category, index: number, overrides: Partial<Question> = {}): Question => {
  const itemType = (overrides.itemType ?? "multiple_choice") as ItemType;
  const base = {
    id: `${category}-${itemType}-${index}`,
    itemType,
    category,
    topic: `${category} fixture`,
    difficulty: "medium",
    stem: { en: "Stem", zh: "题干" },
    rationale: { correct: { en: "Rationale", zh: "解析" } },
    testTakingStrategy: { en: "Strategy", zh: "策略" },
    glossary: [],
    ...overrides,
  };
  if (itemType === "case_study") {
    return {
      ...base,
      itemType,
      caseStudy: {
        title: { en: "Case", zh: "案例" },
        exhibits: [],
        questions: [],
      },
    } as Question;
  }
  if (itemType === "select_all" || itemType === "ordered_response" || itemType === "multiple_choice") {
    return {
      ...base,
      itemType,
      options: [
        { id: "a", en: "A", zh: "A" },
        { id: "b", en: "B", zh: "B" },
      ],
      correct: ["a"],
    } as Question;
  }
  if (itemType === "fill_in_blank") {
    return {
      ...base,
      itemType,
      blanks: [{ id: "dose", prompt: { en: "Dose", zh: "剂量" }, acceptable: ["1"] }],
    } as Question;
  }
  if (itemType === "matrix") {
    return {
      ...base,
      itemType,
      matrix: {
        rows: [{ id: "row", en: "Row", zh: "行" }],
        columns: [{ id: "col", en: "Column", zh: "列" }],
        selectionMode: "single_per_row",
      },
      correct: [{ rowId: "row", columnIds: ["col"] }],
    } as Question;
  }
  if (itemType === "dropdown_cloze") {
    return {
      ...base,
      itemType,
      clozeStem: { en: "Choose {{drop}}", zh: "选择 {{drop}}" },
      dropdowns: [{ id: "drop", options: [{ id: "a", en: "A", zh: "A" }], correct: "a" }],
    } as Question;
  }
  if (itemType === "highlight") {
    return {
      ...base,
      itemType,
      highlight: { segments: [{ id: "s1", en: "Finding", zh: "发现" }], correct: ["s1"] },
    } as Question;
  }
  return {
    ...base,
    itemType: "bowtie",
    bowtie: {
      condition: { tokens: [{ id: "c", en: "Condition", zh: "状况" }], correct: "c" },
      actions: {
        tokens: [
          { id: "a1", en: "Action 1", zh: "措施1" },
          { id: "a2", en: "Action 2", zh: "措施2" },
        ],
        correct: ["a1", "a2"],
      },
      parameters: {
        tokens: [
          { id: "p1", en: "Parameter 1", zh: "参数1" },
          { id: "p2", en: "Parameter 2", zh: "参数2" },
        ],
        correct: ["p1", "p2"],
      },
    },
  } as Question;
};

const makeMultipleChoice = (category: Category, index: number): MultipleChoiceQuestion => ({
  id: `${category}-${index}`,
  itemType: "multiple_choice",
  category,
  topic: `${category} fixture`,
  difficulty: "medium",
  stem: { en: "Stem", zh: "题干" },
  options: [
    { id: "a", en: "A", zh: "A" },
    { id: "b", en: "B", zh: "B" },
  ],
  correct: ["a"],
  rationale: { correct: { en: "Rationale", zh: "解析" } },
  testTakingStrategy: { en: "Strategy", zh: "策略" },
  glossary: [],
});

const questions = Object.entries(counts).flatMap(([category, count]) =>
  Array.from({ length: count }, (_, index) => makeMultipleChoice(category as Category, index)),
);
const coverage = computeCoverage(questions);

assert.deepEqual(
  coverage.underCategories.map(([category]) => category),
  ["Management of Care", "Pharmacological and Parenteral Therapies"],
  "weighted deficits must rank by target gap, not lowest raw count",
);
assert.deepEqual(
  coverage.overCategories.map(([category]) => category),
  ["Physiological Adaptation"],
  "only categories outside the +3 percentage-point band should be over-served",
);
assert.equal(
  coverage.underCategories.some(([category]) => category === "Psychosocial Integrity"),
  false,
  "a low raw count can still be above its weighted target",
);
assert.equal(
  coverage.byItemType.every(([, count], index, rows) => index === 0 || rows[index - 1][1] <= count),
  true,
  "byItemType rows must stay count-ascending",
);

const savedWeight = NCLEX_CATEGORY_WEIGHTS["Management of Care"];
try {
  delete (NCLEX_CATEGORY_WEIGHTS as Partial<Record<Category, number>>)["Management of Care"];
  assert.throws(
    () => computeCoverage(questions),
    /Missing NCLEX category weight for "Management of Care"/,
    "missing weights must fail loudly",
  );
} finally {
  NCLEX_CATEGORY_WEIGHTS["Management of Care"] = savedWeight;
}

const eligibleMaskingQuestions = [
  makeQuestion("Management of Care", 1, { itemType: "multiple_choice", topic: "Eligible masking" }),
  ...Array.from({ length: 5 }, (_, index) =>
    makeQuestion("Management of Care", index + 2, { itemType: "case_study", topic: "Eligible masking" }),
  ),
  ...Array.from({ length: 2 }, (_, index) =>
    makeQuestion("Physiological Adaptation", index + 1, { itemType: "multiple_choice", topic: "Adequate eligible" }),
  ),
];
const eligibleCoverage = computeCoverage(eligibleMaskingQuestions, 10);
assert.equal(eligibleCoverage.totalEligible, 3, "only non-case-study top-level items should be eligible");
assert.equal(eligibleCoverage.insufficientForFullSession, true, "thin banks should flag global session insufficiency");
assert.ok(
  Math.abs((eligibleCoverage.eligibleCategoryTargets.find(([category]) => category === "Management of Care")?.[1] ?? 0) - 1.8) <
    1e-9,
  "eligible targets should use the full requested session size, not total eligible",
);
assert.equal(
  eligibleCoverage.eligibilityShortfalls.some(([category]) => category === "Management of Care"),
  true,
  "raw coverage from case studies must not mask eligible shortfall",
);
assert.equal(
  eligibleCoverage.eligibilityShortfalls.some(([category]) => category === "Physiological Adaptation"),
  false,
  "a category with enough eligible items should not be marked short",
);

const backfillFixture = [
  ...Array.from({ length: 4 }, (_, index) =>
    makeQuestion("Physiological Adaptation", index, { itemType: "multiple_choice", topic: "Shock Resuscitation" }),
  ),
  ...Array.from({ length: 3 }, (_, index) =>
    makeQuestion("Physiological Adaptation", index + 10, {
      itemType: "multiple_choice",
      topic: "Full Format Topic",
    }),
  ),
  ...BACKFILL_TYPES.map((type, index) =>
    makeQuestion("Physiological Adaptation", index + 20, {
      itemType: type as StandaloneItemType,
      topic: "Full Format Topic",
    }),
  ),
];
const backfillCoverage = computeCoverage(backfillFixture);
const shockBackfill = backfillCoverage.backfillTopics.find((topic) => topic.label === "Shock Resuscitation");
assert.ok(shockBackfill, "MC-heavy NGN-light topics should become backfill opportunities");
assert.equal(
  shockBackfill?.missingTypes.includes("matrix") && shockBackfill.missingTypes.includes("highlight"),
  true,
  "backfill topics should name strictly missing newer item types",
);
assert.equal(
  backfillCoverage.prioritizeTopics.some((topic) => topic.startsWith("Shock Resuscitation — add:")),
  true,
  "backfill entries should be injected into prioritize topics",
);
assert.equal(
  backfillCoverage.avoidTopics.some((topic) => topic.startsWith("Shock Resuscitation")),
  false,
  "MC-heavy NGN-light topics should be carved out of avoid topics",
);
assert.equal(
  backfillCoverage.avoidTopics.some((topic) => topic.startsWith("Full Format Topic")),
  true,
  "over-served topics with full backfill coverage should remain in avoid topics",
);
assert.equal(
  backfillCoverage.backfillTopics.some((topic) => topic.label === "Full Format Topic"),
  false,
  "full-format topics should not be backfill opportunities",
);

assert.equal(BACKFILL_TYPES.includes("highlight"), true, "derived backfill types should include highlight");
assert.equal(BACKFILL_TYPES.includes("bowtie"), true, "derived backfill types should include bowtie");
assert.equal(BACKFILL_TYPES.includes("multiple_choice"), false, "backfill types should exclude baseline MC");
assert.equal(BACKFILL_TYPES.includes("case_study"), false, "backfill types should exclude case studies");

assert.deepEqual(
  computeCoverage(backfillFixture),
  computeCoverage(backfillFixture),
  "coverage computation should be deterministic for identical input",
);

assert.equal(parseSessionSize(["--session-size=20"]), 20, "positive session size should parse");
assert.equal(parseSessionSize([]), SESSION_SIZE, "absent session size should fall back");
assert.equal(parseSessionSize(["--session-size=abc"]), SESSION_SIZE, "non-numeric session size should fall back");
assert.equal(parseSessionSize(["--session-size=0"]), SESSION_SIZE, "zero session size should fall back");
assert.equal(parseSessionSize(["--session-size=-5"]), SESSION_SIZE, "negative session size should fall back");

const mergedTopicCoverage = computeCoverage([
  makeQuestion("Management of Care", 1, { itemType: "multiple_choice", topic: "Shared Topic!" }),
  makeQuestion("Physiological Adaptation", 2, { itemType: "multiple_choice", topic: "shared topic" }),
  makeQuestion("Physiological Adaptation", 3, { itemType: "multiple_choice", topic: "Shared   Topic" }),
]);
assert.deepEqual(
  mergedTopicCoverage.backfillTopics.find((topic) => topic.label === "Shared Topic!")?.categories,
  ["Management of Care", "Physiological Adaptation"],
  "merged normalized topics should carry the full sorted category set",
);

assert.deepEqual(
  backfillCoverage.topics.find((topic) => topic.label === "Shock Resuscitation")?.itemTypeCounts.map(([type]) => type),
  itemTypes,
  "topic item-type counts should stay in schema order",
);
assert.deepEqual(
  backfillCoverage.backfillCategories[0]?.lowTypes.map(([type]) => type),
  BACKFILL_TYPES,
  "category low item types should stay in schema order",
);

console.log("coverage report tests passed");
