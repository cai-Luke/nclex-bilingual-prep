// Parity guarantee for U0: the registry path must reproduce the pre-refactor
// rhythm-strip behavior byte-for-byte (SVG sha256) and reason-for-reason
// (validation strings). Baseline lives in __snapshots__/visual-parity.json.
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { collectVisualRefs, validateBankObject, type VisualRef } from "../../src/schema";
import { getVisual } from "../../src/visuals/registry";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};
const sha = (s: string) => createHash("sha256").update(s).digest("hex");

const snapshotPath = fileURLToPath(new URL("./__snapshots__/visual-parity.json", import.meta.url));
const snapshot = JSON.parse(await readFile(snapshotPath, "utf8")) as {
  svgHashes: { id: string; rhythm: string; svgHash: string }[];
  validationReasons: { name: string; itemType: string; visual: unknown; reasons: string[] }[];
};

// --- SVG byte-parity: render the live items through the registry --------------
const parityId = (ref: VisualRef): string => {
  switch (ref.location) {
    case "question": return ref.parentQuestionId;
    case "questionRationale": return `${ref.parentQuestionId}#rat${ref.locationIndex}`;
    case "caseExhibit": return `${ref.parentQuestionId}#ex${ref.locationIndex}`;
    case "caseStageExhibit": return `${ref.parentQuestionId}#st${ref.stageIndex}ex${ref.locationIndex}`;
    case "caseQuestion": return ref.ownerId;
    case "caseQuestionRationale": return `${ref.ownerId}#rat${ref.locationIndex}`;
  }
};

const byId = new Map<string, any>();
const bankFiles = (await readdir("banks")).filter((f) => f.endsWith(".json"));
for (const file of bankFiles) {
  const raw = JSON.parse(await readFile(join("banks", file), "utf8"));
  const result = validateBankObject(raw);
  if (!result.ok) continue;
  for (const q of result.value.questions) {
    for (const ref of collectVisualRefs(q)) byId.set(parityId(ref), ref.visual);
  }
}

for (const expected of snapshot.svgHashes) {
  const visual = byId.get(expected.id);
  assert(visual, `parity item ${expected.id} not found in any bank`);
  const mod = getVisual(visual.kind);
  assert(mod, `no registered module for kind ${visual.kind}`);
  const actual = sha(mod!.renderSvg(visual));
  assert(
    actual === expected.svgHash,
    `SVG hash drift for ${expected.id}: expected ${expected.svgHash}, got ${actual}`,
  );
}

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

console.log(`visual-parity tests passed (${snapshot.svgHashes.length} SVG hashes, ${snapshot.validationReasons.length} reason cases)`);
