import assert from "node:assert/strict";
import { shuffle } from "../../lib/shuffle";
import type { DropdownClozeQuestion } from "../../src/types";

const validDropdownCloze: DropdownClozeQuestion = {
  id: "dc_pn_access_01",
  itemType: "dropdown_cloze",
  category: "Physiological Adaptation",
  topic: "parenteral nutrition",
  difficulty: "medium",
  stem: {
    en: "Complete the statement.",
    zh: "完成陈述。",
  },
  clozeStem: {
    en: "A PN solution with an osmolarity of 820 mOsm/L may be infused via [[1]] access.",
    zh: "渗透压为 820 mOsm/L 的肠外营养液可经 [[1]] 通路输注。",
  },
  dropdowns: [
    {
      id: "1",
      options: [
        { id: "o1", en: "peripheral", zh: "外周" },
        { id: "o2", en: "central", zh: "中心" },
        { id: "o3", en: "intraosseous", zh: "骨内" },
      ],
      correct: "o1",
    },
    {
      id: "2",
      options: [
        { id: "o1", en: "the pharmacist", zh: "药师" },
        { id: "o2", en: "the nurse", zh: "护士" },
        { id: "o3", en: "the dietitian", zh: "营养师" },
      ],
      correct: "o2",
    },
  ],
  rationale: { correct: { en: "820 mOsm/L is below the peripheral threshold.", zh: "820 mOsm/L 低于外周输注阈值。" } },
  testTakingStrategy: { en: "Compare against the peripheral osmolarity ceiling.", zh: "对照外周输注渗透压上限比较。" },
  glossary: [],
};

const shuffled = shuffle(validDropdownCloze);
const shuffledAgain = shuffle(validDropdownCloze);
assert.equal(shuffled.itemType, "dropdown_cloze");
assert.deepEqual(shuffled, shuffledAgain, "dropdown_cloze shuffle must be deterministic for a fixed id");

if (shuffled.itemType === "dropdown_cloze") {
  assert.equal(shuffled.dropdowns.length, validDropdownCloze.dropdowns.length);
  shuffled.dropdowns.forEach((dropdown, index) => {
    const original = validDropdownCloze.dropdowns[index];
    assert.equal(dropdown.id, original.id);
    assert.equal(dropdown.correct, original.correct, "correct id must be unchanged by shuffle");
    assert.deepEqual(
      [...dropdown.options].map((option) => option.id).sort(),
      [...original.options].map((option) => option.id).sort(),
      "option id set must be unchanged by shuffle",
    );
    for (const option of dropdown.options) {
      const originalOption = original.options.find((candidate) => candidate.id === option.id);
      assert.deepEqual(option, originalOption, "option content must travel with its id");
    }
  });
}

// Across a spread of distinct item/blank ids, the shuffle must not always leave the
// correct option first — this is the exact defect class the promotion gate's
// dropdown_cloze `correct_index_nN` bias check (fix_class SHUFFLE_AT_PROMOTION) exists
// to repair; if this regresses, shuffle() is silently returning dropdown_cloze unchanged.
const positions = Array.from({ length: 30 }, (_, index) => {
  const q: DropdownClozeQuestion = {
    ...validDropdownCloze,
    id: `dc_sample_${index}`,
    dropdowns: [{ ...validDropdownCloze.dropdowns[0], id: "1" }],
  };
  const result = shuffle(q);
  assert.equal(result.itemType, "dropdown_cloze");
  if (result.itemType !== "dropdown_cloze") throw new Error("unreachable");
  return result.dropdowns[0].options.findIndex((option) => option.id === result.dropdowns[0].correct);
});
assert(positions.some((position) => position !== 0), "shuffle must move the correct option out of position 0 at least once across 30 distinct seeds");

console.log("shuffle tests passed");
