import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateBankObject } from "../../src/schema";
import type { BankEnvelope, Question, QuestionVisual } from "../../src/types";
import { validateLabTrend } from "../../src/visuals/kinds/lab_trend";
import type { LabTrendSpec } from "../../src/visuals/kinds/lab_trend/types";
import {
  assertSingleRowLabPanelsManifestBytes,
  buildSingleRowLabPanelsSurvey,
  collectP4CandidatesFromBank,
  discoverP4SurveyBankPaths,
  OUTPUT_PATH,
  serializeSingleRowLabPanelsSurvey,
} from "../single-row-lab-panels-survey";

const pair = (en: string) => ({ en, zh: `测试：${en}` });
const oneSeries = (): LabTrendSpec => ({
  kind: "lab_trend",
  time: { unit: "hr", values: [0, 6, 12] },
  series: [{ analyte: "sodium", values: [140, 137, 134] }],
});
const twoSeries = (): LabTrendSpec => ({
  ...oneSeries(),
  series: [
    { analyte: "sodium", values: [140, 137, 134] },
    { analyte: "potassium", values: [4.2, 4.0, 3.8] },
  ],
});

const baseQuestion = (id: string, visual?: QuestionVisual): Question => ({
  id,
  itemType: "multiple_choice",
  category: "Reduction of Risk Potential",
  topic: "Laboratory Interpretation",
  difficulty: "medium",
  stem: pair("Which finding needs follow-up?"),
  rationale: {
    correct: pair("The sodium trend is falling."),
    byChoice: [
      { refId: "A", ...pair("This is the keyed response.") },
      { refId: "B", ...pair("This is a distractor.") },
      { refId: "C", ...pair("This is a distractor.") },
    ],
  },
  testTakingStrategy: pair("Review the serial values."),
  glossary: [],
  options: [
    { id: "A", ...pair("Notify the provider") },
    { id: "B", ...pair("Document only") },
    { id: "C", ...pair("Reassess tomorrow") },
  ],
  correct: ["A"],
  ...(visual ? { visual } : {}),
  meta: visual ? {
    visual_justification: "The serial values are needed to identify the direction.",
    expected_trend: [{ series: "sodium", direction: "down", window: [0, 12] }],
  } : undefined,
} as unknown as Question);

const top = baseQuestion("p4_top", oneSeries());
top.rationale.visuals = [oneSeries()];
const dual = baseQuestion("p4_dual", twoSeries());

const embedded = baseQuestion("p4_embedded", oneSeries());
embedded.rationale.visuals = [oneSeries()];
const control = baseQuestion("p4_control");

const caseQuestion = {
  id: "p4_case",
  itemType: "case_study",
  category: "Reduction of Risk Potential",
  topic: "Laboratory Interpretation",
  difficulty: "medium",
  stem: pair("Review the case and answer the questions."),
  rationale: { correct: pair("The case requires serial data review.") },
  testTakingStrategy: pair("Use the available exhibits."),
  glossary: [],
  caseStudy: {
    title: pair("P4 traversal fixture"),
    exhibits: [{
      id: "baseline",
      type: "laboratory_results",
      title: pair("Baseline laboratory results"),
      content: pair("The client has serial laboratory testing."),
      visual: oneSeries(),
      structuredMeasurements: {
        panels: [
          {
            kind: "labs",
            columns: [{ id: "now", label: pair("Now") }],
            rows: [{ key: "sodium", label: pair("Sodium"), values: [{ columnId: "now", value: "134", unit: "mEq/L" }] }],
          },
          {
            kind: "vitals",
            columns: [{ id: "now", label: pair("Now") }],
            rows: [{ key: "hr", label: pair("Heart rate"), values: [{ columnId: "now", value: "92", unit: "bpm" }] }],
          },
          {
            kind: "labs",
            columns: [{ id: "now", label: pair("Now") }],
            rows: [
              { key: "sodium", label: pair("Sodium"), values: [{ columnId: "now", value: "134", unit: "mEq/L" }] },
              { key: "potassium", label: pair("Potassium"), values: [{ columnId: "now", value: "3.8", unit: "mEq/L" }] },
            ],
          },
          {
            kind: "labs",
            columns: [{ id: "now", label: pair("Now") }],
            rows: [{ key: "creatinine", label: pair("Creatinine"), values: [{ columnId: "now", value: "1.2", unit: "mg/dL" }] }],
          },
        ],
      },
    }],
    stages: [{
      id: "stage_1",
      title: pair("Stage 1"),
      narrative: pair("Repeat laboratory testing is available."),
      exhibits: [{
        id: "repeat",
        type: "laboratory_results",
        title: pair("Repeat results"),
        content: pair("The repeat result is available."),
        visual: oneSeries(),
        structuredMeasurements: {
          population: "peds_child",
          panels: [{
            kind: "labs",
            columns: [{ id: "repeat", label: pair("Repeat") }],
            rows: [{ key: "glucose", label: pair("Glucose"), values: [{ columnId: "repeat", value: "104", unit: "mg/dL" }] }],
          }],
        },
      }],
    }],
    questions: [embedded, control],
  },
} as unknown as Question;

const fixtureBank: BankEnvelope = {
  meta: { schemaVersion: "2.0", count: 3 },
  questions: [top, dual, caseQuestion],
};

const validation = validateBankObject(fixtureBank);
assert.equal(validation.ok, true, validation.ok ? undefined : JSON.stringify(validation.reasons));
assert.equal(validateLabTrend(oneSeries()).length, 0, "one series remains valid under the current contract");
assert.equal(validateLabTrend(twoSeries()).length, 0, "two series remains valid under the current contract");

const collected = collectP4CandidatesFromBank({ path: "banks/p4-fixture.json", lane: "canonical", envelope: fixtureBank });
const lab = collected.records.filter(({ surface }) => surface === "lab_trend");
const structured = collected.records.filter(({ surface }) => surface === "structured_labs_panel");
assert.equal(lab.length, 6, "all six full-schema visual locations must be traversed");
assert.deepEqual(
  lab.map(({ normalizedLocationLabel }) => normalizedLocationLabel).sort(),
  [
    "case exhibit visual",
    "embedded rationale visual",
    "embedded-question visual",
    "staged case exhibit visual",
    "top-level question visual",
    "top-level rationale visual",
  ].sort(),
);
assert(lab.every(({ numSeries }) => numSeries === 1));
assert(lab.every(({ numTimepoints }) => numTimepoints === 3), "timepoint count must not be confused with series count");
assert.equal(collected.observations.labTrendVisuals, 7);
assert.equal(collected.observations.oneSeriesLabTrendCandidates, 6);
assert.equal(collected.observations.twoSeriesLabTrendNonCandidates, 1, "two-series lab_trend is not a candidate");
assert.equal(lab.filter(({ currentApplicableSelfCheck }) => currentApplicableSelfCheck.status === "PASS").length, 2);
assert.equal(
  lab.filter(({ currentApplicableSelfCheck }) => currentApplicableSelfCheck.status === "NOT_APPLICABLE_BY_CURRENT_CONTRACT").length,
  4,
  "rationale and exhibit visuals must not be mislabeled as self-check passes",
);

assert.equal(structured.length, 3, "separate one-row labs panels in one exhibit count separately, including staged panels");
assert.equal(collected.observations.structuredLabsPanels, 4);
assert.equal(collected.observations.oneRowStructuredLabsCandidates, 3);
assert.equal(collected.observations.multiRowStructuredLabsNonCandidates, 1, "two-row labs panel is excluded");
assert(structured.every(({ analyteOrRowKey }) => ["sodium", "creatinine", "glucose"].includes(analyteOrRowKey)));
assert(structured.every(({ currentApplicableSelfCheck }) => currentApplicableSelfCheck.status === "NOT_APPLICABLE_BY_CURRENT_CONTRACT"));
assert(!structured.some(({ analyteOrRowKey }) => analyteOrRowKey === "hr"), "one-row vitals panel is excluded");
const unspecifiedStructured = structured.filter(({ analyteOrRowKey }) => analyteOrRowKey !== "glucose");
assert.equal(unspecifiedStructured.length, 2);
assert(unspecifiedStructured.every(({ populationDeclared, populationEffective }) =>
  populationDeclared === "unspecified" && populationEffective === "unspecified"
), "absent structured population must remain unspecified for both declared and effective fields");
const explicitStructured = structured.find(({ analyteOrRowKey }) => analyteOrRowKey === "glucose");
assert(explicitStructured);
assert.equal(explicitStructured.populationDeclared, "peds_child");
assert.equal(explicitStructured.populationEffective, "peds_child", "an explicit structured population must be preserved");
assert(collected.records.every(({ semanticReview }) =>
  semanticReview.status === "PENDING_INDEPENDENT_REVIEW" &&
  semanticReview.loadBearing === null &&
  semanticReview.exactProseDuplication === null &&
  semanticReview.secondRowMerit === null
));

const laneRoot = await mkdtemp(join(tmpdir(), "p4-lanes-"));
try {
  const canonicalDir = join(laneRoot, "banks");
  await mkdir(canonicalDir);
  const paths = await discoverP4SurveyBankPaths({
    bankDir: canonicalDir,
    rawDir: join(laneRoot, "missing-raw"),
    promotedDir: join(laneRoot, "missing-promoted"),
  });
  assert.deepEqual(paths, { canonical: [], raw: [], promoted: [] }, "absent optional staging directories produce zero paths");
} finally {
  await rm(laneRoot, { recursive: true, force: true });
}

const survey = await buildSingleRowLabPanelsSurvey();
const generated = serializeSingleRowLabPanelsSurvey(survey);
const committed = await readFile(OUTPUT_PATH, "utf8");
assertSingleRowLabPanelsManifestBytes(generated, committed);

// Generator-level drift proof: mutate real temporary bank files, rebuild every
// record/summary/policy layer, then compare against the generated fixture baseline.
const driftRoot = await mkdtemp(join(tmpdir(), "p4-candidate-drift-"));
try {
  const bankDir = join(driftRoot, "banks");
  const rawDir = join(driftRoot, "banks-raw");
  const promotedDir = join(driftRoot, "missing-promoted");
  await mkdir(bankDir);
  const bankPath = join(bankDir, "fixture.json");
  const seedCandidate = baseQuestion("p4_seed_candidate", oneSeries());
  const seedNonCandidate = baseQuestion("p4_seed_two_series", twoSeries());
  const envelopeFor = (questions: Question[]): BankEnvelope => ({
    meta: { schemaVersion: "2.0", count: questions.length },
    questions,
  });
  const writeEnvelope = async (questions: Question[]) =>
    writeFile(bankPath, `${JSON.stringify(envelopeFor(questions), null, 2)}\n`, "utf8");

  await writeEnvelope([seedCandidate, seedNonCandidate]);
  const fixtureBaseline = await buildSingleRowLabPanelsSurvey({ bankDir, rawDir, promotedDir });
  const fixtureBaselineBytes = serializeSingleRowLabPanelsSurvey(fixtureBaseline);
  assert.equal(fixtureBaseline.summary.candidateCount, 1);
  assert.equal(fixtureBaseline.summary.observations.oneSeriesLabTrendCandidates, 1);
  assert.equal(fixtureBaseline.summary.observations.twoSeriesLabTrendNonCandidates, 1);
  assert.equal(fixtureBaseline.policyResults.L2.affectedCandidateCount, 1);
  assert.equal(fixtureBaseline.population.canonical.discoveredFileCount, 1);
  assert.deepEqual(fixtureBaseline.population.canonical.discoveredBankPaths, [bankPath]);

  const addedQuestion = baseQuestion("p4_seed_added_candidate", oneSeries());
  await writeEnvelope([seedCandidate, seedNonCandidate, addedQuestion]);
  const fixtureAdded = await buildSingleRowLabPanelsSurvey({ bankDir, rawDir, promotedDir });
  assert.equal(fixtureAdded.summary.candidateCount, 2);
  assert.equal(fixtureAdded.summary.observations.oneSeriesLabTrendCandidates, 2);
  assert.equal(fixtureAdded.policyResults.L2.affectedCandidateCount, 2);
  assert(fixtureAdded.records.some(({ questionId }) => questionId === "p4_seed_added_candidate"));
  assert.throws(
    () => assertSingleRowLabPanelsManifestBytes(serializeSingleRowLabPanelsSurvey(fixtureAdded), fixtureBaselineBytes),
    /survey drift/,
    "a candidate added to a bank file must cause generated manifest drift",
  );

  await writeEnvelope([seedNonCandidate]);
  const fixtureRemoved = await buildSingleRowLabPanelsSurvey({ bankDir, rawDir, promotedDir });
  assert.equal(fixtureRemoved.summary.candidateCount, 0);
  assert.equal(fixtureRemoved.summary.observations.oneSeriesLabTrendCandidates, 0);
  assert.equal(fixtureRemoved.summary.observations.twoSeriesLabTrendNonCandidates, 1);
  assert.equal(fixtureRemoved.policyResults.L2.affectedCandidateCount, 0);
  assert.throws(
    () => assertSingleRowLabPanelsManifestBytes(serializeSingleRowLabPanelsSurvey(fixtureRemoved), fixtureBaselineBytes),
    /survey drift/,
    "a candidate removed from a bank file must cause generated manifest drift",
  );

  await mkdir(rawDir);
  const bareArrayPath = join(rawDir, "undeclared.json");
  await writeFile(bareArrayPath, `${JSON.stringify([baseQuestion("p4_undeclared", oneSeries())], null, 2)}\n`, "utf8");
  const withUndeclaredRaw = await buildSingleRowLabPanelsSurvey({ bankDir, rawDir, promotedDir });
  const undeclared = withUndeclaredRaw.records.find(({ questionId }) => questionId === "p4_undeclared");
  assert(undeclared);
  assert.equal(undeclared.declaredSchemaVersion, null, "a bare-array bank must report its schema declaration as absent");
  assert.equal(withUndeclaredRaw.population.raw.discoveredFileCount, 1);
  assert.deepEqual(withUndeclaredRaw.population.raw.discoveredBankPaths, [bareArrayPath]);
} finally {
  await rm(driftRoot, { recursive: true, force: true });
}

assert.equal(survey.policyResults.L1.status, "CALCULATED_MECHANICALLY");
assert.equal(survey.policyResults.L2.status, "CALCULATED_MECHANICALLY");
assert.equal(survey.policyResults.L3.status, "PENDING_INDEPENDENT_REVIEW");
assert.equal(survey.policyResults.S1.status, "CALCULATED_MECHANICALLY");
assert.equal(survey.policyResults.S2.status, "CALCULATED_MECHANICALLY");
assert.equal(survey.policyResults.S3.status, "PENDING_INDEPENDENT_REVIEW");
assert.equal(survey.policyResults.S4.status, "PENDING_INDEPENDENT_REVIEW");
assert.equal(survey.policyResults.S4.namedPanelOrContextClass, null);
for (const policy of Object.values(survey.policyResults)) {
  assert("consequences" in policy, "every policy must report subsystem-specific consequences");
  assert.deepEqual(
    Object.keys(policy.consequences).sort(),
    ["bankMigration", "exportEnvelope", "promotedVisualParity", "renderer", "schemaValidation"].sort(),
  );
}

console.log("single-row lab panels P4 tests passed (surface contracts + traversal + byte drift)");
