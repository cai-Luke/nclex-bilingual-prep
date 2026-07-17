// Historical U0 validation-reason parity. The three SVG hashes migrated
// losslessly to the promoted rhythm-strip baseline on 2026-07-17.
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { validateBankObject } from "../../src/schema";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};
const snapshotPath = fileURLToPath(new URL("./__snapshots__/visual-parity.json", import.meta.url));
const snapshot = JSON.parse(await readFile(snapshotPath, "utf8")) as {
  validationReasons: { name: string; itemType: string; visual: unknown; reasons: string[] }[];
};

// --- Validation reason-parity ------------------------------------------------
const mkBank = (visual: unknown, itemType: string) => ({
  meta: { schemaVersion: "1.2" },
  questions: [
    {
      id: "x",
      itemType,
      category: "Physiological Adaptation",
      topic: "t",
      difficulty: "medium",
      stem: { en: "e", zh: "z" },
      rationale: { correct: { en: "e", zh: "z" }, byChoice: [{ refId: "A", en: "e", zh: "z" }, { refId: "B", en: "e", zh: "z" }] },
      testTakingStrategy: { en: "e", zh: "z" },
      glossary: [],
      options: [{ id: "A", en: "a", zh: "a" }, { id: "B", en: "b", zh: "b" }],
      correct: ["A"],
      ...(itemType === "fill_in_blank"
        ? { blanks: [{ id: "b1", prompt: { en: "p", zh: "p" }, acceptable: ["x"] }] }
        : {}),
      visual,
    },
  ],
});

for (const c of snapshot.validationReasons) {
  const result = validateBankObject(mkBank(c.visual, c.itemType));
  const actual = result.ok ? [] : result.reasons;
  const same = actual.length === c.reasons.length && actual.every((r, i) => r === c.reasons[i]);
  assert(same, `validation reason drift for ${c.name}:\n  expected ${JSON.stringify(c.reasons)}\n  got      ${JSON.stringify(actual)}`);
}

console.log(`visual-parity tests passed (${snapshot.validationReasons.length} reason cases)`);
