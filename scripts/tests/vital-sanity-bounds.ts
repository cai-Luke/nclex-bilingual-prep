import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { MEASUREMENT_ALLOWLIST } from "../../src/measurementAllowlist";
import { toCanonicalMeasurementValue } from "../../src/measurementUnitPolicy";
import type { VitalKey } from "../../src/visuals/kinds/vitals_trend/types";
import {
  assertVitalSanityManifestMatches,
  buildVitalSanityBoundsSurvey,
  calculateCandidateIntervalImpact,
  discoverVitalSurveyBankPaths,
  isRecordOutOfRange,
  OUTPUT_PATH,
  serializeVitalSanityBoundsSurvey,
  VITAL_BOUNDARY_EPSILON,
  VITAL_KEYS,
  type VitalSurveyRecord,
} from "../vital-sanity-bounds-survey";

const syntheticRecord = (
  vital: VitalKey,
  canonicalValue: number,
  overrides: Partial<VitalSurveyRecord> = {},
): VitalSurveyRecord => ({
  bank: "synthetic.json",
  bankPath: "synthetic.json",
  questionId: "synthetic",
  surface: "structured_measurements",
  location: "caseExhibitStructuredMeasurements",
  recordPath: `synthetic.${vital}.${canonicalValue}`,
  vital,
  rawValue: String(canonicalValue),
  sourceUnit: MEASUREMENT_ALLOWLIST[vital].canonicalUnit,
  normalizedSourceUnit: MEASUREMENT_ALLOWLIST[vital].canonicalUnit.toLowerCase(),
  normalizedUnitAccepted: true,
  conversionMode: "identity",
  canonicalUnit: MEASUREMENT_ALLOWLIST[vital].canonicalUnit,
  canonicalValue,
  canonicalThreshold: null,
  bound: null,
  populationDeclared: "adult",
  populationEffective: "adult",
  governingContract: { kind: "structuredMeasurementGate4", currentClassification: "IN_BAND" },
  ...overrides,
});

// Synthetic boundary probes pin inclusive current behavior for all seven vitals.
for (const vital of VITAL_KEYS) {
  const { min, max } = MEASUREMENT_ALLOWLIST[vital].sanity;
  const epsilon = VITAL_BOUNDARY_EPSILON[vital];
  assert.equal(isRecordOutOfRange(syntheticRecord(vital, min - epsilon), { min, max }), true, `${vital} min-epsilon`);
  assert.equal(isRecordOutOfRange(syntheticRecord(vital, min), { min, max }), false, `${vital} min`);
  assert.equal(isRecordOutOfRange(syntheticRecord(vital, min + epsilon), { min, max }), false, `${vital} min+epsilon`);
  assert.equal(isRecordOutOfRange(syntheticRecord(vital, max - epsilon), { min, max }), false, `${vital} max-epsilon`);
  assert.equal(isRecordOutOfRange(syntheticRecord(vital, max), { min, max }), false, `${vital} max`);
  assert.equal(isRecordOutOfRange(syntheticRecord(vital, max + epsilon), { min, max }), true, `${vital} max+epsilon`);
}

// Temperature additionally probes the affine source-unit path and the original mis-stage defect class.
assert.equal(toCanonicalMeasurementValue("temp", "86", "°F"), 30);
assert.ok(
  Math.abs((toCanonicalMeasurementValue("temp", "115.7", "°F") as number) - 46.5) < 1e-9,
  "115.7 F must convert to the 46.5 C canonical ceiling within floating-point precision",
);
assert.equal(toCanonicalMeasurementValue("temp", "86", "°C"), 86);
assert.equal(
  isRecordOutOfRange(syntheticRecord("temp", toCanonicalMeasurementValue("temp", "86", "°F") as number), MEASUREMENT_ALLOWLIST.temp.sanity),
  false,
  "86 F must remain inside the current canonical tripwire",
);
assert.equal(
  isRecordOutOfRange(syntheticRecord("temp", toCanonicalMeasurementValue("temp", "86", "°C") as number), MEASUREMENT_ALLOWLIST.temp.sanity),
  true,
  "86 C must exercise the Fahrenheit-mis-staged-as-Celsius warning path",
);

// Typed bounds use the same one-sided semantics as GATE 4, but never become exact live values.
const lowerBound = syntheticRecord("rr", 2, { bound: ">", canonicalValue: null, canonicalThreshold: 2 });
const tooLowLowerBound = syntheticRecord("rr", 1, { bound: ">", canonicalValue: null, canonicalThreshold: 1 });
const upperBound = syntheticRecord("spo2", 100, { bound: "<", canonicalValue: null, canonicalThreshold: 100 });
const tooHighUpperBound = syntheticRecord("spo2", 101, { bound: "<", canonicalValue: null, canonicalThreshold: 101 });
assert.equal(isRecordOutOfRange(lowerBound, MEASUREMENT_ALLOWLIST.rr.sanity), false);
assert.equal(isRecordOutOfRange(tooLowLowerBound, MEASUREMENT_ALLOWLIST.rr.sanity), true);
assert.equal(isRecordOutOfRange(upperBound, MEASUREMENT_ALLOWLIST.spo2.sanity), false);
assert.equal(isRecordOutOfRange(tooHighUpperBound, MEASUREMENT_ALLOWLIST.spo2.sanity), true);

// The reusable candidate-interval input reports both newly warned and newly admitted records.
const candidateImpact = calculateCandidateIntervalImpact([
  syntheticRecord("hr", 50),
  syntheticRecord("hr", 100),
  syntheticRecord("hr", 400),
], { hr: { min: 60, max: 500 } });
assert.deepEqual(candidateImpact, [{
  vital: "hr",
  current: { min: 10, max: 300 },
  candidate: { min: 60, max: 500 },
  comparable: 3,
  newlyWarned: 1,
  newlyAdmitted: 1,
  unchangedInBand: 1,
  unchangedWarn: 0,
  excludedUnconvertible: 0,
  excludedRendererEnvelopeRecords: 0,
}]);
assert.throws(
  () => calculateCandidateIntervalImpact([], { hr: { min: 100, max: 50 } }),
  /finite min <= max/,
);
assert.throws(
  () => calculateCandidateIntervalImpact([], { invented_vital: { min: 1, max: 2 } } as never),
  /not a vital key/,
);

// Optional raw/promoted staging lanes follow P0: absence means an empty population only for those lanes.
const fixtureRoot = await mkdtemp(join(tmpdir(), "vital-sanity-bounds-"));
try {
  const bankDir = join(fixtureRoot, "banks");
  await mkdir(bankDir);
  assert.deepEqual(await discoverVitalSurveyBankPaths({
    bankDir,
    rawDir: join(fixtureRoot, "missing-raw"),
    promotedDir: join(fixtureRoot, "missing-promoted"),
  }), { canonical: [], raw: [], promoted: [] });
} finally {
  await rm(fixtureRoot, { recursive: true, force: true });
}

// Corpus proof and manifest-drift gate.
const survey = await buildVitalSanityBoundsSurvey();
const serialized = serializeVitalSanityBoundsSurvey(survey);
const committed = await readFile(OUTPUT_PATH, "utf8");
assert.doesNotThrow(() => assertVitalSanityManifestMatches(serialized, committed));
assert.throws(
  () => assertVitalSanityManifestMatches(`${serialized}seeded drift\n`, committed),
  /manifest drift/,
  "seeded manifest drift must fail",
);

assert.deepEqual(survey.population.canonicalBankFiles, [...survey.population.canonicalBankFiles].sort());
assert.equal(survey.population.canonicalBankCount, survey.population.canonicalBankFiles.length);
assert.equal(survey.conceptsByVital.length, 7);
assert.deepEqual(survey.conceptsByVital.map(({ vital }) => vital), VITAL_KEYS);
assert.equal(survey.ratification.bounds.startsWith("NONE"), true);
const priorSweep = survey.priorFindings.sweep20260711;
assert.equal(priorSweep.located, true);
assert.equal(priorSweep.reconciliation, "EXTENDS");
assert.equal(
  priorSweep.sources.includes(
    "DECISIONS.md at commit a67476cee75e365dd72c22a589d8e76c6e3ddc6d (2026-07-11 historical survey and pre-move sweep record)",
  ),
  true,
);
assert.equal(priorSweep.sources.some((source) => source.includes("Archive/DECISIONS-ARCHIVE-2026-07-14.md")), false);
assert.equal(priorSweep.adds[0], "all seven vital keys, deterministically enumerated");
assert.equal(priorSweep.adds.some((addition) => addition.includes("temperature-only flip probes")), false);
assert.match(priorSweep.priorResult, /not directly comparable to this survey's pooled per-vital liveRange/);
assert.equal(survey.findings.structuredMeasurementGate4.recordCount, 766);
assert.equal(survey.findings.structuredMeasurementGate4.warningRecords.length, 0);
assert.equal(survey.findings.structuredMeasurementGate4.unrecognizedUnitRecords.length, 0);
assert.equal(survey.findings.structuredMeasurementGate4.unconvertibleValueRecords.length, 0);
assert.equal(survey.findings.rendererEnvelopeValidation.recordCount, 551);
assert.equal(survey.findings.rendererEnvelopeValidation.validationFailures.length, 0);
assert.equal(survey.findings.rendererEnvelopeValidation.mapBoundsViolations.length, 0);
assert.equal(survey.findings.rendererEnvelopeValidation.mapSelfCheckViolations.length, 0);
assert.equal(survey.records.every((record) => record.populationDeclared !== undefined), true);
assert.equal(survey.records.every((record) => record.populationEffective !== undefined), true);
assert.equal(
  survey.records.filter((record) => record.surface === "structured_measurements").every(
    (record) => record.governingContract.kind === "structuredMeasurementGate4",
  ),
  true,
);
assert.equal(
  survey.records.filter((record) => record.surface === "vitals_trend").every(
    (record) => record.governingContract.kind === "vitalsTrendRendererEnvelope",
  ),
  true,
);

// Exercise the build parameter on the live corpus without changing the committed P3 manifest.
const candidateSurvey = await buildVitalSanityBoundsSurvey({ candidates: { spo2: { min: 51, max: 100 } } });
assert.equal(candidateSurvey.candidateIntervalImpact.length, 1);
assert.deepEqual(candidateSurvey.candidateIntervalImpact[0]?.candidate, { min: 51, max: 100 });

console.log("vital-sanity-bounds tests passed (boundary probes + candidate intervals + dated manifest drift)");
