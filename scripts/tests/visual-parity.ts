// Parity guarantee for U0: the registry path must reproduce the pre-refactor
// rhythm-strip behavior byte-for-byte (SVG sha256) and reason-for-reason
// (validation strings). Baseline lives in __snapshots__/visual-parity.json.
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { validateBankObject } from "../../src/schema";
import { getVisual } from "../../src/visuals/registry";
import type { Question } from "../../src/types";

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
const collectVisuals = (q: Question): { id: string; visual: any }[] => {
  const out: { id: string; visual: any }[] = [];
  if (q.visual) out.push({ id: q.id, visual: q.visual });
  if (q.itemType === "case_study") {
    q.caseStudy.exhibits.forEach((e, i) => e.visual && out.push({ id: `${q.id}#ex${i}`, visual: e.visual }));
    q.caseStudy.stages?.forEach((s, si) =>
      s.exhibits.forEach((e, ei) => e.visual && out.push({ id: `${q.id}#st${si}ex${ei}`, visual: e.visual })),
    );
    q.caseStudy.questions.forEach((cq) => cq.visual && out.push({ id: cq.id, visual: cq.visual }));
  }
  return out;
};

const byId = new Map<string, any>();
const bankFiles = (await readdir("banks")).filter((f) => f.endsWith(".json"));
for (const file of bankFiles) {
  const raw = JSON.parse(await readFile(join("banks", file), "utf8"));
  const result = validateBankObject(raw);
  if (!result.ok) continue;
  for (const q of result.value.questions) {
    for (const { id, visual } of collectVisuals(q)) byId.set(id, visual);
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
