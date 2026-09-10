import assert from "node:assert/strict";
import { derivePopulation } from "../standalone-bowtie-answerability-census-2026-08-23/run.ts";
import {
  canonicalSelection,
  opaqueMap,
  stage1Packet,
  stage2Packet,
  validatePhaseF,
} from "./run.ts";

const bowtie = (id: string) => ({
  id,
  itemType: "bowtie",
  stem: { en: "Stem", zh: "题干" },
  bowtie: {
    condition: { tokens: ["c1", "c2", "c3"].map((token) => ({ id: token, en: token, zh: token })), correct: "c1" },
    actions: { tokens: ["a1", "a2", "a3", "a4"].map((token) => ({ id: token, en: token, zh: token })), correct: ["a1", "a2"] },
    parameters: { tokens: ["p1", "p2", "p3", "p4"].map((token) => ({ id: token, en: token, zh: token })), correct: ["p1", "p2"] },
  },
});
const bank = (questions: any[]) => new Map([["banks/test.json", { meta: { schemaVersion: "2.0" }, questions }]]) as any;

assert.equal(derivePopulation(bank([bowtie("exact_bowtie"), { id: "exact", itemType: "case_study" }])).paired[0].pairingRule, "EXACT");
assert.equal(derivePopulation(bank([bowtie("ordinal_bowtie"), { id: "ordinal_01", itemType: "case_study" }])).paired[0].pairingRule, "ORDINAL_SUFFIX");
assert.throws(() => derivePopulation(bank([bowtie("ambiguous_bowtie"), { id: "ambiguous_01", itemType: "case_study" }, { id: "ambiguous_02", itemType: "case_study" }])), /Ambiguous case pairing/);

const question = bowtie("unpaired_bowtie");
const map = opaqueMap(question);
assert.deepEqual(map.condition, { c1: "C1", c2: "C2", c3: "C3" });
assert.deepEqual(canonicalSelection(question, map), { conditionLabel: "C1", actionLabels: ["A1", "A2"], parameterLabels: ["P1", "P2"] });
assert.deepEqual(Object.keys(stage1Packet(question)).sort(), ["instruction", "stem"]);
assert.deepEqual(Object.keys(stage2Packet(question)).sort(), ["instruction", "stem", "tokens"]);

const phaseFFixture = (primaryVerdict: string) => ({
  primaryVerdict,
  secondaryFlags: [],
  missingFactProvenance: [],
  advisoryPriority: null,
  defectSummary: "fixture",
  bilingualCollateral: [],
  clinicalCollateral: [],
  scopeCollateral: [],
  reasoning: "fixture",
});
for (const verdict of ["FAIL_HIDDEN_CASE_DEPENDENCY", "FAIL_UNSUPPORTED_TOKEN_PREMISE", "FAIL_UNDERDETERMINED", "FAIL_CANONICAL_KEY_OR_LOGIC", "HOLD_REVIEWER_DISAGREEMENT", "PASS_STANDALONE"]) validatePhaseF(phaseFFixture(verdict), true);
assert.throws(() => validatePhaseF(phaseFFixture("FAIL_HIDDEN_CASE_DEPENDENCY")), /unreachable hidden-case/);

console.log("PASS: EXACT/ORDINAL discovery, ambiguous fail-loud, deterministic token maps/projections, nullable harness dependencies, and full fixed-verdict schema coverage.");
