import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { copyFile, mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
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
  R5_CANDIDATE_INTERVALS,
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

assert.deepEqual(R5_CANDIDATE_INTERVALS, {
  sbp: { min: 40, max: 400 },
  rr: { min: 2, max: 150 },
  spo2: { min: 0, max: 100 },
});
assert.deepEqual(MEASUREMENT_ALLOWLIST.sbp.sanity, R5_CANDIDATE_INTERVALS.sbp);
assert.deepEqual(MEASUREMENT_ALLOWLIST.rr.sanity, R5_CANDIDATE_INTERVALS.rr);
assert.deepEqual(MEASUREMENT_ALLOWLIST.spo2.sanity, R5_CANDIDATE_INTERVALS.spo2);

const preImplementationManifest = await readFile(
  "audit/vital-sanity-bounds-survey-2026-08-19/survey-manifest.json",
);
assert.equal(
  createHash("sha256").update(preImplementationManifest).digest("hex"),
  "55f25e0ba4954b5ed9d080f880cfbf467b70d8ab4584e9a1c25c37108227ed2c",
  "accepted August 19 pre-implementation evidence must remain byte-identical",
);

// The committed/default population is canonical-only even when ignored staging exists nearby.
// Explicit staging paths retain a bounded opt-in inspection mode.
const fixtureRoot = await mkdtemp(join(tmpdir(), "vital-sanity-bounds-"));
try {
  const bankDir = join(fixtureRoot, "banks");
  await mkdir(bankDir);
  const canonicalPath = join(bankDir, "fixture-canonical.json");
  await copyFile("banks/vitals-canonical.json", canonicalPath);
  const beforeAmbientStaging = await buildVitalSanityBoundsSurvey({ bankDir });

  const rawDir = join(bankDir, "banks-raw");
  const promotedDir = join(bankDir, "_promoted");
  await mkdir(rawDir);
  await mkdir(promotedDir);
  const rawPath = join(rawDir, "fixture-raw.json");
  const promotedPath = join(promotedDir, "fixture-promoted.json");
  await copyFile("banks/vitals-canonical.json", rawPath);
  await copyFile("banks/vitals-canonical.json", promotedPath);

  assert.deepEqual(await discoverVitalSurveyBankPaths({ bankDir }), {
    canonical: [canonicalPath],
    raw: [],
    promoted: [],
  });
  const afterAmbientStaging = await buildVitalSanityBoundsSurvey({ bankDir });
  assert.equal(
    serializeVitalSanityBoundsSurvey(afterAmbientStaging),
    serializeVitalSanityBoundsSurvey(beforeAmbientStaging),
    "ambient raw/promoted staging must not perturb the default survey",
  );

  assert.deepEqual(await discoverVitalSurveyBankPaths({ bankDir, rawDir, promotedDir }), {
    canonical: [canonicalPath],
    raw: [rawPath],
    promoted: [promotedPath],
  });
  const withExplicitStaging = await buildVitalSanityBoundsSurvey({ bankDir, rawDir, promotedDir });
  assert.equal(withExplicitStaging.population.rawDraftCount, 1);
  assert.equal(withExplicitStaging.population.promotedStagingCount, 1);
  assert.equal(
    withExplicitStaging.population.totalRecords,
    beforeAmbientStaging.population.totalRecords * 3,
  );
  assert.deepEqual(withExplicitStaging.population.provenance, {
    committedDefaultPopulation: "TRACKED_TOP_LEVEL_CANONICAL_BANKS_ONLY",
    rawDrafts: "EXPLICITLY_INCLUDED",
    promotedStaging: "EXPLICITLY_INCLUDED",
    stagingCountInterpretation: "rawDraftCount and promotedStagingCount report files included in this survey, not whether ignored staging files exist in the ambient checkout.",
  });
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
assert.deepEqual(survey.population.provenance, {
  committedDefaultPopulation: "TRACKED_TOP_LEVEL_CANONICAL_BANKS_ONLY",
  rawDrafts: "EXCLUDED",
  promotedStaging: "EXCLUDED",
  stagingCountInterpretation: "rawDraftCount and promotedStagingCount report files included in this survey, not whether ignored staging files exist in the ambient checkout.",
});
assert.equal(survey.population.canonicalBankCount, 13);
assert.deepEqual(survey.population.rawDraftFiles, []);
assert.equal(survey.population.rawDraftCount, 0);
assert.deepEqual(survey.population.promotedStagingFiles, []);
assert.equal(survey.population.promotedStagingCount, 0);
assert.equal(survey.population.totalRecords, 1317);
assert.equal(survey.status, "POST_IMPLEMENTATION_CONFORMANCE_EVIDENCE");
assert.equal(survey.survey, "vital-sanity-bounds-r5-post-implementation-conformance");
assert.equal(survey.conceptsByVital.length, 7);
assert.deepEqual(survey.conceptsByVital.map(({ vital }) => vital), VITAL_KEYS);
const conceptsByVital = new Map(survey.conceptsByVital.map((concept) => [concept.vital, concept]));
assert.deepEqual(conceptsByVital.get("sbp")?.liveRange, { min: 78, max: 210, unit: "mmHg" });
assert.deepEqual(conceptsByVital.get("rr")?.liveRange, { min: 6, max: 34, unit: "/min" });
assert.deepEqual(conceptsByVital.get("spo2")?.liveRange, { min: 84, max: 99, unit: "%" });
assert.equal(conceptsByVital.get("sbp")?.sanity.maxAuthorship.status, "independently_authored");
assert.equal(conceptsByVital.get("rr")?.sanity.maxAuthorship.status, "independently_authored");
assert.equal(conceptsByVital.get("spo2")?.sanity.minAuthorship.status, "independently_authored");
assert.equal(conceptsByVital.get("temp")?.sanity.maxAuthorship.status, "independently_authored");
assert.equal(conceptsByVital.get("dbp")?.sanity.maxAuthorship.status, "inherited");
assert.equal(conceptsByVital.get("map")?.sanity.maxAuthorship.status, "inherited");
assert.equal(conceptsByVital.get("temp")?.sanity.minAuthorship.status, "inherited");
assert.equal(conceptsByVital.get("spo2")?.mechanismCostByCandidateSide.min.mechanism, "available");
assert.equal(survey.ratification.bounds.startsWith("R5 ratifies"), true);
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
assert.deepEqual(survey.candidateIntervalImpact, [
  {
    vital: "rr",
    current: { min: 2, max: 150 },
    candidate: { min: 2, max: 150 },
    comparable: 125,
    newlyWarned: 0,
    newlyAdmitted: 0,
    unchangedInBand: 125,
    unchangedWarn: 0,
    excludedUnconvertible: 0,
    excludedRendererEnvelopeRecords: 76,
  },
  {
    vital: "sbp",
    current: { min: 40, max: 400 },
    candidate: { min: 40, max: 400 },
    comparable: 138,
    newlyWarned: 0,
    newlyAdmitted: 0,
    unchangedInBand: 138,
    unchangedWarn: 0,
    excludedUnconvertible: 0,
    excludedRendererEnvelopeRecords: 77,
  },
  {
    vital: "spo2",
    current: { min: 0, max: 100 },
    candidate: { min: 0, max: 100 },
    comparable: 127,
    newlyWarned: 0,
    newlyAdmitted: 0,
    unchangedInBand: 127,
    unchangedWarn: 0,
    excludedUnconvertible: 0,
    excludedRendererEnvelopeRecords: 56,
  },
]);
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

// Explicit input remains available for a bounded, non-default candidate survey.
const candidateSurvey = await buildVitalSanityBoundsSurvey({ candidates: { spo2: { min: 51, max: 100 } } });
assert.equal(candidateSurvey.candidateIntervalImpact.length, 1);
assert.deepEqual(candidateSurvey.candidateIntervalImpact[0]?.candidate, { min: 51, max: 100 });

console.log("vital-sanity-bounds tests passed (boundary probes + candidate intervals + dated manifest drift)");
