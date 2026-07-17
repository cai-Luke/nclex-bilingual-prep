import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import type { Question, QuestionVisual } from "../../src/types";
import { selfCheckMar } from "../../src/visuals/kinds/mar";
import {
  buildPromotedVisualInventory,
  buildPromotedVisualRecords,
  type PromotedVisualRecord,
} from "../promoted-visual-parity";
import {
  buildPromotedVisualParitySurvey,
  extractRecognizedProof,
  OUTPUT_PATH,
  serializePromotedVisualParitySurvey,
} from "../promoted-visual-parity-survey";

const pair = (text: string) => ({ en: text, zh: `测试：${text}` });
const visual = (): QuestionVisual => ({
  kind: "rhythm_strip",
  rhythm: "sinus",
  rateBpm: 72,
  durationSec: 6,
  seed: 20260716,
});

const optionQuestion = (id: string, withVisuals: boolean = false): Question => ({
  id,
  itemType: "multiple_choice",
  category: "Physiological Adaptation",
  topic: "Cardiac Rhythm Interpretation",
  difficulty: "medium",
  stem: pair("Which finding is present?"),
  rationale: {
    correct: pair("The finding is visible."),
    byChoice: [
      { refId: "A", ...pair("Correct finding.") },
      { refId: "B", ...pair("Incorrect finding.") },
      { refId: "C", ...pair("Another incorrect finding.") },
    ],
    ...(withVisuals ? { visuals: [visual()] } : {}),
  },
  testTakingStrategy: pair("Inspect the tracing."),
  glossary: [],
  options: [
    { id: "A", ...pair("Finding A") },
    { id: "B", ...pair("Finding B") },
    { id: "C", ...pair("Finding C") },
  ],
  correct: ["A"],
  ...(withVisuals ? { visual: visual() } : {}),
});

const top = optionQuestion("survey_top", true);
const embedded = optionQuestion("survey_leaf", true);
const caseQuestion = {
  id: "survey_case",
  itemType: "case_study",
  category: "Physiological Adaptation",
  topic: "Cardiac Rhythm Interpretation",
  difficulty: "medium",
  stem: pair("Review the case."),
  rationale: { correct: pair("Use the case evidence.") },
  testTakingStrategy: pair("Review each exhibit."),
  glossary: [],
  caseStudy: {
    title: pair("Synthetic parity case"),
    exhibits: [{
      id: "baseline",
      title: pair("Baseline"),
      content: pair("Baseline content"),
      visual: visual(),
    }],
    stages: [{
      id: "stage_1",
      title: pair("Stage 1"),
      exhibits: [{
        id: "update",
        title: pair("Update"),
        content: pair("Update content"),
        visual: visual(),
      }],
    }],
    questions: [embedded, optionQuestion("survey_control")],
  },
} as unknown as Question;

const fixtureBank = {
  meta: { schemaVersion: "2.0", count: 2 },
  questions: [top, caseQuestion],
};
const fixtureRecords = buildPromotedVisualRecords([{ bank: "fixture.json", raw: fixtureBank }]);
assert.deepEqual(
  fixtureRecords.map((record) => record.parityId),
  [
    "survey_case#ex0",
    "survey_case#st0ex0",
    "survey_leaf",
    "survey_leaf#rat0",
    "survey_top",
    "survey_top#rat0",
  ],
);
assert.deepEqual(
  Object.fromEntries(fixtureRecords.map((record) => [record.parityId, record.carrierRoute])),
  {
    "survey_case#ex0": "parent-case-container",
    "survey_case#st0ex0": "parent-case-container",
    survey_leaf: "embedded-leaf",
    "survey_leaf#rat0": "embedded-leaf",
    survey_top: "top-level-question",
    "survey_top#rat0": "top-level-question",
  },
);
assert.equal(fixtureRecords.find((record) => record.parityId === "survey_leaf")?.carrierQuestionId, "survey_leaf");
assert.equal(fixtureRecords.find((record) => record.parityId === "survey_case#ex0")?.carrierQuestionId, "survey_case");

const inventoryWithZeroVisualBank = buildPromotedVisualInventory([
  { bank: "visuals.json", raw: fixtureBank },
  {
    bank: "zero-visuals.json",
    raw: {
      meta: { schemaVersion: "2.0", count: 1 },
      questions: [optionQuestion("zero_visual_question")],
    },
  },
]);
assert.deepEqual(inventoryWithZeroVisualBank.scannedBanks, ["visuals.json", "zero-visuals.json"]);
assert.equal(new Set(inventoryWithZeroVisualBank.records.map((record) => record.bank)).size, 1);

const withUnrelatedQuestion = structuredClone(fixtureBank);
withUnrelatedQuestion.questions.push(optionQuestion("unrelated_no_visual"));
withUnrelatedQuestion.meta.count += 1;
assert.deepEqual(
  buildPromotedVisualRecords([{ bank: "fixture.json", raw: withUnrelatedQuestion }]).map((record) => record.parityId),
  fixtureRecords.map((record) => record.parityId),
  "an unrelated non-visual addition must not perturb parity identities",
);

assert.throws(
  () => buildPromotedVisualRecords([{
    bank: "invalid.json",
    raw: { meta: { schemaVersion: "2.0", count: 1 }, questions: [] },
  }]),
  /invalid\.json failed validation/,
);
assert.throws(
  () => buildPromotedVisualRecords([
    { bank: "first.json", raw: { meta: { schemaVersion: "2.0", count: 1 }, questions: [top] } },
    { bank: "second.json", raw: { meta: { schemaVersion: "2.0", count: 1 }, questions: [top] } },
  ]),
  /duplicate parityId survey_top in first\.json .* and second\.json/,
);

const proofRecord = (
  visualValue: Record<string, unknown>,
  meta?: Record<string, unknown>,
): PromotedVisualRecord => ({
  parityId: "proof",
  bank: "proof.json",
  ref: {
    visual: visualValue as QuestionVisual,
    location: "question",
    parentQuestionId: "proof",
    ownerId: "proof",
  },
  carrierQuestion: {
    ...optionQuestion("proof"),
    ...(meta === undefined ? {} : { meta }),
  } as unknown as Question,
  carrierQuestionId: "proof",
  carrierRoute: "top-level-question",
});

const keyedSettingsProof = extractRecognizedProof(proofRecord(
  { kind: "device_screen", settings: [{ key: "basal_rate", value: 1 }] },
  { keyed_settings: [{ key: "basal_rate" }] },
));
assert.deepEqual(keyedSettingsProof.recognizedProofSurfaces, ["keyed_settings"]);
assert.equal(keyedSettingsProof.declaredKeyedPresent, false);

const arithmeticDeviceProof = extractRecognizedProof(proofRecord(
  { kind: "device_screen", settings: [{ key: "rate_ml_hr", value: 100 }] },
  { derived_values_keyed: { infusion_volume_ml: 100 } },
));
assert.deepEqual(arithmeticDeviceProof.recognizedProofSurfaces, ["derived_values_keyed"]);
assert.equal(arithmeticDeviceProof.declaredKeyedPresent, true);

const noDeviceProof = extractRecognizedProof(proofRecord(
  { kind: "device_screen", settings: [{ key: "basal_rate", value: 1 }] },
  {},
));
assert.deepEqual(noDeviceProof.recognizedProofSurfaces, []);

const patternOnlyIoTrend = extractRecognizedProof(proofRecord(
  {
    kind: "io_trend",
    time: { values: [1, 2, 3] },
    intervals: [
      { intakeMl: 1, outputMl: 2 },
      { intakeMl: 2, outputMl: 2 },
      { intakeMl: 3, outputMl: 2 },
    ],
  },
  { expected_trend: [{ series: "intake", direction: "up", window: [1, 3] }] },
));
assert.deepEqual(patternOnlyIoTrend.recognizedProofSurfaces, ["expected_trend"]);
assert.equal(patternOnlyIoTrend.declaredKeyedPresent, false);

const marVisual = {
  kind: "mar",
  timeGrid: ["0900"],
  medications: [{
    name: "Medication A",
    dose: "1 tablet",
    route: "PO",
    frequency: "daily",
    administrations: [{ time: "0900", status: "given" }],
  }],
};
const marRelationshipProof = extractRecognizedProof(proofRecord(
  marVisual,
  { keyed_relationship: "Medication A was administered at 0900." },
));
assert.deepEqual(marRelationshipProof.recognizedProofSurfaces, ["keyed_relationship"]);

const marCellProof = extractRecognizedProof(proofRecord(
  marVisual,
  { keyed_cells: [{ medication: "Medication A", time: "0900" }] },
));
assert.deepEqual(marCellProof.recognizedProofSurfaces, ["keyed_cells"]);
assert.deepEqual(marCellProof.recognizedKeyedCells, [{ medication: "Medication A", time: "0900" }]);

const malformedMarMeta = {
  visual_justification: "The MAR is necessary to answer the item.",
  keyed_cells: [null],
};
const malformedMarProof = extractRecognizedProof(proofRecord(marVisual, malformedMarMeta));
assert.deepEqual(malformedMarProof.recognizedProofSurfaces, []);
assert.deepEqual(malformedMarProof.recognizedKeyedCells, []);
assert.deepEqual(
  selfCheckMar(marVisual as never, { meta: malformedMarMeta }),
  [],
  "keyed_cells:[null] must expose the selfCheck escape hatch without satisfying survey proof",
);

const noMetaMarProof = extractRecognizedProof(proofRecord(marVisual));
assert.deepEqual(noMetaMarProof.recognizedProofSurfaces, []);
assert.deepEqual(
  selfCheckMar(marVisual as never, optionQuestion("mar_without_meta")),
  [],
  "missing meta must expose the selfCheck escape hatch without satisfying survey proof",
);

const survey = await buildPromotedVisualParitySurvey();
const committed = await readFile(OUTPUT_PATH, "utf8");
assert.equal(
  serializePromotedVisualParitySurvey(survey),
  committed,
  "survey drift: run npm run survey:promoted-visual-parity",
);
assert.equal(survey.population.scannedBanks, 13);
assert.equal(survey.population.banksWithVisuals, 13);
assert.equal(survey.population.scannedBankFiles.length, 13);
assert.deepEqual(survey.population.scannedBankFiles, [...survey.population.scannedBankFiles].sort());
assert.equal(survey.population.records, 199);
assert.equal(survey.population.registeredKinds, 12);
assert.equal(survey.findings.identityCollisions.length, 0);
assert.equal(survey.findings.selfCheckFailures.length, 0);
assert.equal(survey.findings.nondeterministicRenders.length, 0);
assert.equal(survey.findings.exactArithmeticRecordsWithoutKeyed.length, 0);
assert.equal(survey.findings.deviceScreenRecordsWithoutProof.length, 0);
assert.equal(survey.findings.ioTrendRecordsWithoutProof.length, 0);
assert.equal(survey.findings.marRecordsWithoutProof.length, 0);
assert.deepEqual(survey.findings.unclassifiedKinds, []);
assert.deepEqual(survey.counts.byLocation, {
  question: 195,
  questionRationale: 0,
  caseExhibit: 1,
  caseStageExhibit: 1,
  caseQuestion: 2,
  caseQuestionRationale: 0,
});
assert.equal(survey.counts.byKindAndLocation.rhythm_strip?.questionRationale, 0);
assert.equal(survey.counts.byKindAndLocation.rhythm_strip?.caseQuestionRationale, 0);
assert.equal(survey.ioTrendPopulation.total, 4);
assert.equal(survey.ioTrendPopulation.keyedArithmeticAndTrendAssertions, 4);
assert.equal(survey.ioTrendPopulation.patternOnly, 0);
assert.equal(survey.counts.byTier["structured-document"], 11);
assert.equal(survey.marPopulation.total, 11);
assert.equal(survey.marPopulation.withKeyedRelationship, 7);
assert.equal(survey.marPopulation.withResolvingKeyedCells, 7);
assert.equal(survey.marPopulation.withBoth, 3);
assert.equal(survey.marPopulation.withRecognizedProof, 11);
assert.equal(survey.marPopulation.withoutRecognizedProof, 0);
assert.equal(survey.u0MigrationReadiness.migrated.length, 3);
assert.equal(survey.u0MigrationReadiness.allPresent, true);
assert.equal(survey.u0MigrationReadiness.allStructurallyEligible, true);
assert.equal(survey.u0MigrationReadiness.allEqual, true);
assert(survey.u0MigrationReadiness.migrated.every((record) =>
  record.actualKind === "rhythm_strip" &&
  record.kindEqual &&
  record.actualLocation === "question" &&
  record.locationEqual &&
  record.hashEqual &&
  record.equal
));
assert.equal(survey.blockers.length, 0);
assert.equal(survey.automatedNullPassed, true);
assert.deepEqual(survey.architectQuestions, []);
assert(survey.records.every((record) => !("svgHash" in record) && !("_svgHash" in record)));

console.log("promoted visual parity survey tests passed (defect fixes, six-location routing, proof surfaces, corpus null)");
