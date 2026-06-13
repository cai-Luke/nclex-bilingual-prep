import assert from "node:assert/strict";
import { computeCoverage } from "../coverage-report";
import { NCLEX_CATEGORY_WEIGHTS } from "../../src/schema";
import type { Category, MultipleChoiceQuestion } from "../../src/types";

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

const makeQuestion = (category: Category, index: number): MultipleChoiceQuestion => ({
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
  Array.from({ length: count }, (_, index) => makeQuestion(category as Category, index)),
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

const savedWeight = NCLEX_CATEGORY_WEIGHTS["Management of Care"];
delete (NCLEX_CATEGORY_WEIGHTS as Partial<Record<Category, number>>)["Management of Care"];
assert.throws(
  () => computeCoverage(questions),
  /Missing NCLEX category weight for "Management of Care"/,
  "missing weights must fail loudly",
);
NCLEX_CATEGORY_WEIGHTS["Management of Care"] = savedWeight;

console.log("coverage report tests passed");
