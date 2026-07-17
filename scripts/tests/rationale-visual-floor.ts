import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { toExportEnvelope } from "../../src/bankImport";
import { collectVisualRefs, validateBankObject } from "../../src/schema";
import type { Question, QuestionVisual } from "../../src/types";
import {
  buildRationaleVisualFloorSurvey,
  listRawStagingJsonFiles,
  OUTPUT_PATH,
  serializeRationaleVisualFloorSurvey,
  surveyHasZeroImpact,
} from "../rationale-visual-floor-survey";

const pair = (text: string) => ({ en: text, zh: `测试：${text}` });

const pacerVisual = {
  kind: "rhythm_strip",
  rhythm: "asystole",
  rateBpm: 0,
  durationSec: 6,
  seed: 91,
  pacer: {
    mode: "ventricular",
    setRateBpm: 60,
    spikeTimesSec: [1, 2, 3],
    capturedSpikeTimesSec: [1, 3],
    finding: "failure_to_capture",
  },
} satisfies QuestionVisual;

const nonPacerVisual = {
  kind: "rhythm_strip",
  rhythm: "sinus",
  rateBpm: 72,
  durationSec: 6,
  seed: 92,
} satisfies QuestionVisual;

const cloneNonPacerVisual = (): QuestionVisual => structuredClone(nonPacerVisual);

const baseQuestion = {
  id: "p0_standalone",
  itemType: "multiple_choice",
  category: "Physiological Adaptation",
  topic: "Cardiac Rhythm Interpretation",
  difficulty: "medium",
  stem: pair("Which finding is present?"),
  rationale: {
    correct: pair("The explanation identifies the finding."),
    byChoice: [
      { refId: "A", ...pair("A rationale.") },
      { refId: "B", ...pair("B rationale.") },
      { refId: "C", ...pair("C rationale.") },
    ],
  },
  testTakingStrategy: pair("Inspect the rhythm strip."),
  glossary: [],
  options: [
    { id: "A", ...pair("Finding A") },
    { id: "B", ...pair("Finding B") },
    { id: "C", ...pair("Finding C") },
  ],
  correct: ["A"],
} satisfies Question;

const withRationaleVisual = (visual: QuestionVisual, id: string = baseQuestion.id): Question => ({
  ...baseQuestion,
  id,
  rationale: { ...baseQuestion.rationale, visuals: [visual] },
});

const bank = (schemaVersion: "1.5" | "1.6" | "1.7", question: Question) => ({
  meta: { schemaVersion, count: 1 },
  questions: [question],
});

// Synthetic proof: these fixtures prove traversal behavior, not live corpus coverage.
const topLevelRationalePacer = withRationaleVisual(pacerVisual);
const staleTopLevel = validateBankObject(bank("1.6", topLevelRationalePacer));
assert.equal(staleTopLevel.ok, false);
if (!staleTopLevel.ok) {
  assert(staleTopLevel.reasons.includes("questions[0]: pacer rhythm_strip requires meta.schemaVersion 1.7"));
}
assert.equal(validateBankObject(bank("1.7", topLevelRationalePacer)).ok, true);

const embeddedRationalePacer = withRationaleVisual(pacerVisual, "p0_embedded_leaf");
const embeddedCase = {
  id: "p0_case",
  itemType: "case_study",
  category: "Physiological Adaptation",
  topic: "Cardiac Rhythm Interpretation",
  difficulty: "medium",
  stem: pair("Review the case."),
  rationale: { correct: pair("The embedded question tests the finding.") },
  testTakingStrategy: pair("Use the available case data."),
  glossary: [],
  caseStudy: {
    title: pair("Rhythm case"),
    exhibits: [{ id: "case_note", title: pair("Case note"), content: pair("The client is monitored.") }],
    questions: [
      embeddedRationalePacer,
      { ...baseQuestion, id: "p0_embedded_control_leaf" } as unknown as Question,
    ],
  },
} as unknown as Question;

const staleEmbedded = validateBankObject(bank("1.6", embeddedCase));
assert.equal(staleEmbedded.ok, false);
if (!staleEmbedded.ok) {
  assert(
    staleEmbedded.reasons.includes("questions[0]: pacer rhythm_strip requires meta.schemaVersion 1.7"),
    JSON.stringify(staleEmbedded.reasons),
  );
}
assert.equal(validateBankObject(bank("1.7", embeddedCase)).ok, true);

const nonPacerRationale = withRationaleVisual(nonPacerVisual, "p0_non_pacer_rationale");
const nonPacerResult = validateBankObject(bank("1.5", nonPacerRationale));
assert.equal(nonPacerResult.ok, true, nonPacerResult.ok ? undefined : JSON.stringify(nonPacerResult.reasons));

assert.equal(toExportEnvelope([topLevelRationalePacer]).meta?.schemaVersion, "1.7");
assert.equal(toExportEnvelope([embeddedCase]).meta?.schemaVersion, "1.7");

const everyLocation = {
  ...embeddedCase,
  id: "p0_every_location",
  visual: cloneNonPacerVisual(),
  rationale: { ...embeddedCase.rationale, visuals: [cloneNonPacerVisual()] },
  meta: {
    visual_justification: "The strip must show which pacing spikes capture.",
    expected: { pacerFinding: "failure_to_capture" },
  },
  caseStudy: {
    title: pair("Every location"),
    exhibits: [{ id: "baseline", title: pair("Baseline"), content: pair("Baseline content"), visual: cloneNonPacerVisual() }],
    stages: [{
      id: "stage_1",
      title: pair("Stage 1"),
      exhibits: [{ id: "stage_note", title: pair("Stage note"), content: pair("Stage content"), visual: cloneNonPacerVisual() }],
    }],
    questions: [
      {
        ...baseQuestion,
        id: "p0_every_location_leaf",
        visual: cloneNonPacerVisual(),
        rationale: { ...baseQuestion.rationale, visuals: [cloneNonPacerVisual()] },
        meta: {
          visual_justification: "The strip must show which pacing spikes capture.",
          expected: { pacerFinding: "failure_to_capture" },
        },
      },
      { ...baseQuestion, id: "p0_every_location_control_leaf" },
    ],
  },
} as unknown as Question;

const everyLocationRefs = collectVisualRefs(everyLocation);
assert.equal(everyLocationRefs.length, 6);
assert.deepEqual(
  everyLocationRefs.map(({ location }) => location),
  [
    "question",
    "questionRationale",
    "caseExhibit",
    "caseStageExhibit",
    "caseQuestion",
    "caseQuestionRationale",
  ],
);
assert.equal(everyLocationRefs[1]?.locationIndex, 0);
assert.equal(everyLocationRefs[2]?.locationIndex, 0);
assert.equal(everyLocationRefs[3]?.stageIndex, 0);
assert.equal(everyLocationRefs[3]?.locationIndex, 0);
assert.equal(everyLocationRefs[4]?.ownerId, "p0_every_location_leaf");
assert.equal(everyLocationRefs[5]?.ownerId, "p0_every_location_leaf");
assert.equal(everyLocationRefs[5]?.locationIndex, 0);

const cleanEmbeddedCase = (): Question => {
  const candidate = structuredClone(embeddedCase);
  assert.equal(candidate.itemType, "case_study");
  if (candidate.itemType !== "case_study") throw new Error("expected case-study fixture");
  candidate.caseStudy.questions = [
    { ...baseQuestion, id: "p0_floor_case_leaf" },
    { ...baseQuestion, id: "p0_floor_case_control_leaf" },
  ];
  return candidate;
};

const withStimulusPacer = (question: Question): Question => ({
  ...question,
  visual: structuredClone(pacerVisual),
  meta: {
    visual_justification: "The strip must show which pacing spikes capture.",
    expected: { pacerFinding: "failure_to_capture" },
  },
} as unknown as Question);

const floorCandidateFor = (location: typeof everyLocationRefs[number]["location"]): Question => {
  if (location === "question") return withStimulusPacer({ ...baseQuestion, id: "p0_floor_question" });
  if (location === "questionRationale") return structuredClone(topLevelRationalePacer);

  const candidate = cleanEmbeddedCase();
  if (candidate.itemType !== "case_study") throw new Error("expected case-study fixture");
  switch (location) {
    case "caseExhibit":
      candidate.caseStudy.exhibits[0]!.visual = structuredClone(pacerVisual);
      break;
    case "caseStageExhibit":
      candidate.caseStudy.stages = [{
        id: "p0_floor_stage",
        title: pair("Stage"),
        exhibits: [{
          id: "p0_floor_stage_exhibit",
          title: pair("Stage exhibit"),
          content: pair("Stage content"),
          visual: structuredClone(pacerVisual),
        }],
      }];
      break;
    case "caseQuestion":
      candidate.caseStudy.questions[0] = withStimulusPacer(
        candidate.caseStudy.questions[0]!,
      ) as typeof candidate.caseStudy.questions[number];
      break;
    case "caseQuestionRationale":
      candidate.caseStudy.questions[0] = withRationaleVisual(
        structuredClone(pacerVisual),
        candidate.caseStudy.questions[0]!.id,
      ) as typeof candidate.caseStudy.questions[number];
      break;
  }
  return candidate;
};

// The floor and export inference agree for every supported location, not just
// the two newly covered rationale slots.
for (const location of everyLocationRefs.map(({ location }) => location)) {
  const candidate = floorCandidateFor(location);

  const stale = validateBankObject(bank("1.6", candidate));
  assert.equal(stale.ok, false, `${location} pacer should require schema 1.7`);
  if (!stale.ok) {
    assert(
      stale.reasons.includes("questions[0]: pacer rhythm_strip requires meta.schemaVersion 1.7"),
      `${location}: ${JSON.stringify(stale.reasons)}`,
    );
  }
  const current = validateBankObject(bank("1.7", candidate));
  assert.equal(current.ok, true, current.ok ? undefined : `${location}: ${JSON.stringify(current.reasons)}`);
  assert.equal(toExportEnvelope([candidate]).meta?.schemaVersion, "1.7", `${location} export floor`);
}

// Corpus proof: the generated dated assertion must match the committed artifact.
const survey = await buildRationaleVisualFloorSurvey();
const committedSurvey = await readFile(OUTPUT_PATH, "utf8");
assert.equal(
  serializeRationaleVisualFloorSurvey(survey),
  committedSurvey,
  `survey drift: run npm run survey:rationale-visual-floor`,
);
assert.equal(survey.locationCounts.questionRationale, 0);
assert.equal(survey.locationCounts.caseQuestionRationale, 0);
assert.equal(survey.pacerBearingRecords.length, 3);
assert(survey.pacerBearingRecords.every((record) => record.location === "question"));
assert(survey.pacerBearingRecords.every((record) => record.floorSatisfied === true));
assert(survey.crossChecks.every((check) => check.result === "PASS"));
assert.equal(survey.population.rawDrafts, 0);
assert.equal(survey.population.promotedStagingFiles, 0);
assert.deepEqual(survey.population.rawStagingFiles, []);

const laneFixtureRoot = await mkdtemp(join(tmpdir(), "rationale-visual-floor-lanes-"));
try {
  assert.deepEqual(
    await listRawStagingJsonFiles(
      join(laneFixtureRoot, "missing-raw"),
      join(laneFixtureRoot, "missing-promoted"),
    ),
    { rawNames: [], promotedNames: [], files: [] },
    "absent optional staging lanes must behave as an empty population in clean Git checkouts",
  );
  const rawDir = join(laneFixtureRoot, "banks-raw");
  const promotedDir = join(laneFixtureRoot, "_promoted");
  await Promise.all([
    mkdir(rawDir),
    mkdir(promotedDir),
  ]);
  await Promise.all([
    writeFile(join(rawDir, "raw.json"), "{}\n", "utf8"),
    writeFile(join(rawDir, "ignored.txt"), "not JSON\n", "utf8"),
    writeFile(join(promotedDir, "promoted.json"), "{}\n", "utf8"),
  ]);
  const lanes = await listRawStagingJsonFiles(rawDir, promotedDir);
  assert.deepEqual(lanes.rawNames, ["raw.json"]);
  assert.deepEqual(lanes.promotedNames, ["promoted.json"]);
  assert.deepEqual(lanes.files, [
    join(rawDir, "raw.json"),
    join(promotedDir, "promoted.json"),
  ]);
} finally {
  await rm(laneFixtureRoot, { recursive: true, force: true });
}

const noFloorChanges = { validationFlips: 0, exportEnvelopeChanges: 0 };
assert.equal(surveyHasZeroImpact({
  rationaleTotal: 0,
  parsedRationaleVisuals: 0,
  bundledChanges: noFloorChanges,
  rawStagingChanges: noFloorChanges,
}), true);
assert.equal(surveyHasZeroImpact({
  rationaleTotal: 0,
  parsedRationaleVisuals: 0,
  bundledChanges: noFloorChanges,
  rawStagingChanges: { validationFlips: 1, exportEnvelopeChanges: 0 },
}), false, "a raw/staging validation flip must veto ZERO IMPACT");
assert.equal(surveyHasZeroImpact({
  rationaleTotal: 0,
  parsedRationaleVisuals: 0,
  bundledChanges: noFloorChanges,
  rawStagingChanges: { validationFlips: 0, exportEnvelopeChanges: 1 },
}), false, "a raw/staging export-envelope change must veto ZERO IMPACT");

console.log("rationale-visual-floor tests passed (synthetic traversal + dated corpus manifest)");
