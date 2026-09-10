import assert from "node:assert/strict";
import { derivePopulation } from "../standalone-bowtie-answerability-census-2026-08-23/run.ts";
import {
  canonicalLabels,
  makeStage1Packet,
  makeStage2Packet,
  tokenMap,
  validatePhaseF,
} from "./run.ts";

const question = (id: string) => ({
  id,
  itemType: "bowtie",
  stem: { en: "Exact learner stem", zh: "学习者题干" },
  bowtie: {
    condition: { tokens: [1, 2, 3].map((n) => ({ id: `cond_${n}`, en: `Condition ${n}`, zh: `病情 ${n}` })), correct: "cond_1" },
    actions: { tokens: [1, 2, 3, 4].map((n) => ({ id: `act_${n}`, en: `Action ${n}`, zh: `措施 ${n}` })), correct: ["act_1", "act_2"] },
    parameters: { tokens: [1, 2, 3, 4].map((n) => ({ id: `param_${n}`, en: `Parameter ${n}`, zh: `指标 ${n}` })), correct: ["param_1", "param_2"] },
  },
});
const banks = (questions: any[]) => new Map([["banks/fixture.json", { meta: { schemaVersion: "2.0" }, questions }]]) as any;

assert.equal(derivePopulation(banks([question("exact_bowtie"), { id: "exact", itemType: "case_study" }])).paired[0].pairingRule, "EXACT");
assert.equal(derivePopulation(banks([question("ordinal_bowtie"), { id: "ordinal_01", itemType: "case_study" }])).paired[0].pairingRule, "ORDINAL_SUFFIX");
assert.throws(() => derivePopulation(banks([question("ambiguous_bowtie"), { id: "ambiguous_01", itemType: "case_study" }, { id: "ambiguous_02", itemType: "case_study" }])), /Ambiguous case pairing/);

const fixture = question("unpaired_bowtie");
const map = tokenMap(fixture);
assert.deepEqual(map.condition, { cond_1: "C1", cond_2: "C2", cond_3: "C3" });
assert.deepEqual(canonicalLabels(fixture, map), { conditionLabel: "C1", actionLabels: ["A1", "A2"], parameterLabels: ["P1", "P2"] });
assert.deepEqual(Object.keys(makeStage1Packet(fixture)).sort(), ["instruction", "stem"]);
assert.deepEqual(Object.keys(makeStage2Packet(fixture)).sort(), ["instruction", "stem", "tokens"]);

const phaseF = (primaryVerdict: string, secondaryFlags: string[] = []) => ({
  primaryVerdict,
  secondaryFlags,
  missingFactProvenance: [],
  advisoryPriority: null,
  defectSummary: "schema fixture",
  bilingualCollateral: [],
  clinicalCollateral: [],
  scopeCollateral: [],
  reasoning: "schema fixture",
});
for (const verdict of ["FAIL_HIDDEN_CASE_DEPENDENCY", "FAIL_UNSUPPORTED_TOKEN_PREMISE", "FAIL_UNDERDETERMINED", "FAIL_CANONICAL_KEY_OR_LOGIC", "HOLD_REVIEWER_DISAGREEMENT", "PASS_STANDALONE"]) validatePhaseF(phaseF(verdict), true);
validatePhaseF(phaseF("PASS_STANDALONE", ["DISTRACTOR_PATIENT_FACT_INVENTION"]), true);
assert.throws(() => validatePhaseF(phaseF("FAIL_HIDDEN_CASE_DEPENDENCY")), /unreachable hidden-case/);

console.log("PASS: exact/ordinal discovery, ambiguous fail-loud, deterministic opaque mapping/projections, and all fixed verdict-schema states.");
