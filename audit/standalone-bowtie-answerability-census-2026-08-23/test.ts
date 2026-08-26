import { strict as assert } from "node:assert";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { derivePopulation, generateArtifacts, stableJson, sha256 } from "./run.ts";

const zone = (prefix: string, count: number, correct: string | string[]) => ({
  tokens: Array.from({ length: count }, (_, index) => ({ id: `${prefix}${index + 1}`, en: `${prefix} en ${index + 1}`, zh: `${prefix} zh ${index + 1}` })),
  correct,
});
const bowtie = (id: string) => ({ id, itemType: "bowtie", stem: { en: "Stem", zh: "题干" }, bowtie: { condition: zone("c", 3, "c1"), actions: zone("a", 4, ["a1", "a2"]), parameters: zone("p", 4, ["p1", "p2"]) } });
const caseStudy = (id: string) => ({ id, itemType: "case_study" });
const bank = (questions: any[]) => new Map([["banks/fixture.json", { meta: { schemaVersion: "2.0" }, questions }]]);

const exact = derivePopulation(bank([caseStudy("alpha"), bowtie("alpha_bowtie")]));
assert.equal(exact.paired.length, 1);
assert.equal(exact.paired[0].pairingRule, "EXACT");

const ordinal = derivePopulation(bank([caseStudy("beta_01"), bowtie("beta_bowtie")]));
assert.equal(ordinal.paired.length, 1);
assert.equal(ordinal.paired[0].pairingRule, "ORDINAL_SUFFIX");

assert.throws(() => derivePopulation(bank([caseStudy("gamma_01"), caseStudy("gamma_02"), bowtie("gamma_bowtie")])), /Ambiguous case pairing/);
assert.throws(() => derivePopulation(bank([{ id: "delta", itemType: "multiple_choice" }, bowtie("delta_bowtie")])), /non-case/);
assert.throws(() => derivePopulation(bank([caseStudy("epsilon"), caseStudy("epsilon")])), /Duplicate top-level IDs/);

const canonicalA = stableJson({ z: 1, a: { y: 2, x: 3 } });
const canonicalB = stableJson({ a: { x: 3, y: 2 }, z: 1 });
assert.equal(canonicalA, canonicalB);
assert.equal(sha256(canonicalA), sha256(canonicalB));

const first = mkdtempSync(join(tmpdir(), "bowtie-audit-test-a-"));
const second = mkdtempSync(join(tmpdir(), "bowtie-audit-test-b-"));
try {
  const firstFiles = generateArtifacts(first);
  const secondFiles = generateArtifacts(second);
  assert.deepEqual(firstFiles, secondFiles);
  for (const path of firstFiles) assert.equal(readFileSync(join(first, path), "utf8"), readFileSync(join(second, path), "utf8"), path);
} finally {
  rmSync(first, { recursive: true, force: true });
  rmSync(second, { recursive: true, force: true });
}

console.log("PASS: population EXACT/ORDINAL_SUFFIX, ambiguity, non-case, duplicate-ID, canonical serialization, and deterministic generation tests.");
