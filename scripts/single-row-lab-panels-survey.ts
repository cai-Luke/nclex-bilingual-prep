import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { collectVisualRefs, validateBankObject, type VisualRef } from "../src/schema";
import type {
  BankEnvelope,
  CaseStudyExhibit,
  CaseStudyQuestion,
  Question,
  SchemaVersion,
  StandaloneQuestion,
  StructuredMeasurementPanel,
  TextPair,
} from "../src/types";
import { ANALYTE_DEFS } from "../src/visuals/kinds/lab_trend/defs";
import { selfCheckLabTrend, validateLabTrend } from "../src/visuals/kinds/lab_trend";
import type { LabTrendSpec } from "../src/visuals/kinds/lab_trend/types";

const SURVEY_DATE = "2026-07-18";
const BANK_DIR = "banks";
const RAW_DIR = "banks/banks-raw";
const PROMOTED_DIR = "banks/_promoted";
export const OUTPUT_PATH = "audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json";

const byteCompare = (left: string, right: string): number =>
  Buffer.compare(Buffer.from(left), Buffer.from(right));

type Lane = "canonical" | "raw" | "promoted";
type Surface = "lab_trend" | "structured_labs_panel";
type SelfCheckStatus = "PASS" | "FAIL" | "NOT_APPLICABLE_BY_CURRENT_CONTRACT";

type LoadedBank = {
  path: string;
  lane: Lane;
  envelope: BankEnvelope;
};

type ObservationCounts = {
  labTrendVisuals: number;
  oneSeriesLabTrendCandidates: number;
  twoSeriesLabTrendNonCandidates: number;
  structuredLabsPanels: number;
  oneRowStructuredLabsCandidates: number;
  multiRowStructuredLabsNonCandidates: number;
};

type CandidateReference = {
  bankPath: string;
  questionId: string;
  embeddedLeafId: string | null;
  exactObjectPath: string;
  normalizedLocationLabel: string;
};

type DecisionEvidence = {
  questionId: string;
  itemType: StandaloneQuestion["itemType"];
  stageId: string | null;
  answerableAfterStageId: string | null;
  stem: TextPair;
  taskMaterial: unknown;
  answerKey: unknown;
  rationale: StandaloneQuestion["rationale"];
};

export type P4CandidateRecord = CandidateReference & {
  lane: Lane;
  declaredSchemaVersion: SchemaVersion | null;
  surface: Surface;
  itemType: Question["itemType"];
  category: Question["category"];
  topic: string;
  difficulty: Question["difficulty"];
  analyteOrRowKey: string;
  displayedLabel: { en: string; zh: string | null };
  unit: string;
  populationDeclared: string;
  populationEffective: string;
  numSeries: number | null;
  numTimepoints: number | null;
  numColumns: number | null;
  numValues: number | null;
  keyedVisualMetadata: {
    expectedTrendPath: string | null;
    expectedFlagsPath: string | null;
    visualJustificationPath: string | null;
  };
  currentValidation: {
    status: "PASS" | "FAIL";
    proofSurface: "VISUAL_MODULE_AND_BANK_SCHEMA" | "BANK_SCHEMA";
    errors: string[];
  };
  currentApplicableSelfCheck: {
    status: SelfCheckStatus;
    contract: string;
    errors: string[];
  };
  policyImpact: Record<string, string>;
  semanticReview: {
    status: "PENDING_INDEPENDENT_REVIEW";
    loadBearing: null;
    exactProseDuplication: null;
    partialDuplication: null;
    secondRowMerit: null;
    surfaceFit: null;
    namedS4ContextClass: null;
  };
  reviewPacket: {
    testedDecisionEvidence: DecisionEvidence[];
    presentationValues: unknown;
    caseContext: unknown;
    rationalePassages: Array<{ questionId: string; rationale: StandaloneQuestion["rationale"] }>;
    declaredVisualJustification: unknown;
    keyedVisualMetadata: unknown;
    usefulContextDimensions: unknown;
  };
};

const emptyObservationCounts = (): ObservationCounts => ({
  labTrendVisuals: 0,
  oneSeriesLabTrendCandidates: 0,
  twoSeriesLabTrendNonCandidates: 0,
  structuredLabsPanels: 0,
  oneRowStructuredLabsCandidates: 0,
  multiRowStructuredLabsNonCandidates: 0,
});

const addObservationCounts = (left: ObservationCounts, right: ObservationCounts): ObservationCounts => ({
  labTrendVisuals: left.labTrendVisuals + right.labTrendVisuals,
  oneSeriesLabTrendCandidates: left.oneSeriesLabTrendCandidates + right.oneSeriesLabTrendCandidates,
  twoSeriesLabTrendNonCandidates: left.twoSeriesLabTrendNonCandidates + right.twoSeriesLabTrendNonCandidates,
  structuredLabsPanels: left.structuredLabsPanels + right.structuredLabsPanels,
  oneRowStructuredLabsCandidates: left.oneRowStructuredLabsCandidates + right.oneRowStructuredLabsCandidates,
  multiRowStructuredLabsNonCandidates: left.multiRowStructuredLabsNonCandidates + right.multiRowStructuredLabsNonCandidates,
});

const countBy = <T>(values: readonly T[], valueFor: (value: T) => string): Record<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = valueFor(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort(([left], [right]) => byteCompare(left, right)));
};

const answerKeyFor = (question: StandaloneQuestion): unknown => {
  switch (question.itemType) {
    case "multiple_choice":
    case "select_all":
    case "ordered_response":
      return { options: question.options, correct: question.correct };
    case "fill_in_blank":
      return { blanks: question.blanks };
    case "matrix":
      return { matrix: question.matrix, correct: question.correct };
    case "dropdown_cloze":
      return { clozeStem: question.clozeStem, dropdowns: question.dropdowns };
    case "highlight":
      return { highlight: question.highlight };
    case "bowtie":
      return { bowtie: question.bowtie };
  }
};

const taskMaterialFor = (question: StandaloneQuestion): unknown => {
  switch (question.itemType) {
    case "multiple_choice":
    case "select_all":
    case "ordered_response": return { options: question.options };
    case "fill_in_blank": return { prompts: question.blanks.map(({ id, prompt }) => ({ id, prompt })) };
    case "matrix": return { matrix: question.matrix };
    case "dropdown_cloze": return { clozeStem: question.clozeStem, dropdowns: question.dropdowns.map(({ id, options }) => ({ id, options })) };
    case "highlight": return { segments: question.highlight.segments };
    case "bowtie": return { zones: question.bowtie };
  }
};

const decisionEvidenceFor = (question: StandaloneQuestion): DecisionEvidence => {
  const staged = question as StandaloneQuestion & { stageId?: string; answerableAfterStageId?: string };
  return {
    questionId: question.id,
    itemType: question.itemType,
    stageId: staged.stageId ?? null,
    answerableAfterStageId: staged.answerableAfterStageId ?? null,
    stem: question.stem,
    taskMaterial: taskMaterialFor(question),
    answerKey: answerKeyFor(question),
    rationale: question.rationale,
  };
};

const questionMeta = (question: Question): Record<string, unknown> => {
  const value = (question as unknown as Record<string, unknown>).meta;
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
};

const keyedMetadata = (question: Question, questionPath: string) => {
  const meta = questionMeta(question);
  return {
    expectedTrendPath: Array.isArray(meta.expected_trend) ? `${questionPath}.meta.expected_trend` : null,
    expectedFlagsPath: Array.isArray(meta.expected_flags) ? `${questionPath}.meta.expected_flags` : null,
    visualJustificationPath: typeof meta.visual_justification === "string" ? `${questionPath}.meta.visual_justification` : null,
    values: {
      expected_trend: Array.isArray(meta.expected_trend) ? meta.expected_trend : null,
      expected_flags: Array.isArray(meta.expected_flags) ? meta.expected_flags : null,
    },
    visualJustification: typeof meta.visual_justification === "string" ? meta.visual_justification : null,
  };
};

const visualContextFor = (questionPath: string, question: Question, ref: VisualRef) => {
  switch (ref.location) {
    case "question":
      return { objectPath: `${questionPath}.visual`, label: "top-level question visual", carrier: question, carrierPath: questionPath, exhibit: null, stage: null };
    case "questionRationale":
      return { objectPath: `${questionPath}.rationale.visuals[${ref.locationIndex}]`, label: "top-level rationale visual", carrier: question, carrierPath: questionPath, exhibit: null, stage: null };
    case "caseExhibit": {
      if (question.itemType !== "case_study") throw new Error(`${question.id}: case exhibit visual on non-case question`);
      const exhibit = question.caseStudy.exhibits[ref.locationIndex ?? -1];
      if (!exhibit) throw new Error(`${question.id}: missing case exhibit ${ref.locationIndex}`);
      return { objectPath: `${questionPath}.caseStudy.exhibits[${ref.locationIndex}].visual`, label: "case exhibit visual", carrier: question, carrierPath: questionPath, exhibit, stage: null };
    }
    case "caseStageExhibit": {
      if (question.itemType !== "case_study") throw new Error(`${question.id}: staged exhibit visual on non-case question`);
      const stage = question.caseStudy.stages?.[ref.stageIndex ?? -1];
      const exhibit = stage?.exhibits[ref.locationIndex ?? -1];
      if (!stage || !exhibit) throw new Error(`${question.id}: missing staged exhibit ${ref.stageIndex}/${ref.locationIndex}`);
      return { objectPath: `${questionPath}.caseStudy.stages[${ref.stageIndex}].exhibits[${ref.locationIndex}].visual`, label: "staged case exhibit visual", carrier: question, carrierPath: questionPath, exhibit, stage };
    }
    case "caseQuestion":
    case "caseQuestionRationale": {
      if (question.itemType !== "case_study") throw new Error(`${question.id}: embedded visual on non-case question`);
      const embeddedIndex = question.caseStudy.questions.findIndex(({ id }) => id === ref.ownerId);
      const carrier = question.caseStudy.questions[embeddedIndex];
      if (!carrier) throw new Error(`${question.id}: cannot resolve embedded owner ${ref.ownerId}`);
      const carrierPath = `${questionPath}.caseStudy.questions[${embeddedIndex}]`;
      return {
        objectPath: ref.location === "caseQuestion" ? `${carrierPath}.visual` : `${carrierPath}.rationale.visuals[${ref.locationIndex}]`,
        label: ref.location === "caseQuestion" ? "embedded-question visual" : "embedded rationale visual",
        carrier,
        carrierPath,
        exhibit: null,
        stage: null,
      };
    }
  }
};

const caseContextFor = (
  question: Question,
  exhibit: CaseStudyExhibit | null,
  stage: NonNullable<CaseStudyQuestion["caseStudy"]["stages"]>[number] | null,
): unknown => {
  if (question.itemType !== "case_study") return null;
  return {
    caseTitle: question.caseStudy.title,
    caseSummary: question.caseStudy.summary ?? null,
    stage: stage ? {
      id: stage.id,
      title: stage.title,
      trigger: stage.trigger ?? null,
      narrative: stage.narrative ?? null,
      timeOffset: stage.timeOffset ?? null,
    } : null,
    exhibit: exhibit ? {
      id: exhibit.id,
      type: exhibit.type ?? null,
      title: exhibit.title,
      content: exhibit.content,
    } : null,
  };
};

const reviewDecisionsFor = (question: Question, carrier: Question): DecisionEvidence[] => {
  if (carrier.itemType !== "case_study") return [decisionEvidenceFor(carrier)];
  if (question.itemType !== "case_study") throw new Error(`${question.id}: case carrier mismatch`);
  return question.caseStudy.questions.map(decisionEvidenceFor);
};

const semanticReviewTemplate = () => ({
  status: "PENDING_INDEPENDENT_REVIEW" as const,
  loadBearing: null,
  exactProseDuplication: null,
  partialDuplication: null,
  secondRowMerit: null,
  surfaceFit: null,
  namedS4ContextClass: null,
});

const labCandidate = ({
  bank,
  question,
  questionIndex,
  ref,
}: {
  bank: LoadedBank;
  question: Question;
  questionIndex: number;
  ref: VisualRef;
}): P4CandidateRecord => {
  const questionPath = `questions[${questionIndex}]`;
  const context = visualContextFor(questionPath, question, ref);
  const visual = ref.visual as LabTrendSpec;
  const series = visual.series[0];
  if (!series) throw new Error(`${bank.path}::${context.objectPath}: missing candidate series`);
  const metadata = keyedMetadata(context.carrier, context.carrierPath);
  const validationErrors = validateLabTrend(visual).map(({ path, code, message }) => `${path}:${code}:${message}`);
  const selfCheckApplies = ref.location === "question" || ref.location === "caseQuestion";
  const selfCheckErrors = selfCheckApplies
    ? selfCheckLabTrend(visual, context.carrier).map(({ path, code, message }) => `${path}:${code}:${message}`)
    : [];
  const decisions = reviewDecisionsFor(question, context.carrier);
  const populationDeclared = visual.population ?? "unspecified";
  return {
    lane: bank.lane,
    bankPath: bank.path,
    questionId: question.id,
    embeddedLeafId: ref.ownerId === question.id ? null : ref.ownerId,
    exactObjectPath: context.objectPath,
    normalizedLocationLabel: context.label,
    declaredSchemaVersion: bank.envelope.meta?.schemaVersion ?? null,
    surface: "lab_trend",
    itemType: context.carrier.itemType,
    category: context.carrier.category,
    topic: context.carrier.topic,
    difficulty: context.carrier.difficulty,
    analyteOrRowKey: series.analyte,
    displayedLabel: { en: ANALYTE_DEFS[series.analyte].label, zh: null },
    unit: series.unit ?? ANALYTE_DEFS[series.analyte].canonicalUnit,
    populationDeclared,
    populationEffective: visual.population ?? "adult",
    numSeries: visual.series.length,
    numTimepoints: visual.time.values.length,
    numColumns: null,
    numValues: null,
    keyedVisualMetadata: {
      expectedTrendPath: metadata.expectedTrendPath,
      expectedFlagsPath: metadata.expectedFlagsPath,
      visualJustificationPath: metadata.visualJustificationPath,
    },
    currentValidation: {
      status: validationErrors.length === 0 ? "PASS" : "FAIL",
      proofSurface: "VISUAL_MODULE_AND_BANK_SCHEMA",
      errors: validationErrors,
    },
    currentApplicableSelfCheck: {
      status: selfCheckApplies ? (selfCheckErrors.length === 0 ? "PASS" : "FAIL") : "NOT_APPLICABLE_BY_CURRENT_CONTRACT",
      contract: selfCheckApplies
        ? "Answer-coupled lab_trend selfCheck applies to question.visual and embedded-question visual."
        : "Rationale and case-exhibit visuals receive structural validation but no answer-coupled selfCheck under the current validator contract.",
      errors: selfCheckErrors,
    },
    policyImpact: {
      L1: "PASSES_CURRENT_ONE_OR_TWO_SERIES_CONTRACT",
      L2: "NEWLY_FAILS_UNIVERSAL_TWO_SERIES_FLOOR",
      L3: "PENDING_INDEPENDENT_LOAD_BEARING_AND_EXACT_DUPLICATION_CLASSIFICATION",
    },
    semanticReview: semanticReviewTemplate(),
    reviewPacket: {
      testedDecisionEvidence: decisions,
      presentationValues: { time: visual.time, series: visual.series, caption: visual.caption ?? null },
      caseContext: caseContextFor(question, context.exhibit, context.stage),
      rationalePassages: decisions.map(({ questionId, rationale }) => ({ questionId, rationale })),
      declaredVisualJustification: metadata.visualJustification,
      keyedVisualMetadata: metadata.values,
      usefulContextDimensions: {
        location: context.label,
        analyte: series.analyte,
        timeUnit: visual.time.unit,
        timepointCount: visual.time.values.length,
        caseStageId: context.stage?.id ?? null,
        exhibitType: context.exhibit?.type ?? null,
        exhibitTitle: context.exhibit?.title ?? null,
      },
    },
  };
};

const structuredCandidate = ({
  bank,
  question,
  questionIndex,
  panel,
  panelPath,
  locationLabel,
  measurementsPopulation,
  exhibit,
  stage,
}: {
  bank: LoadedBank;
  question: CaseStudyQuestion;
  questionIndex: number;
  panel: StructuredMeasurementPanel;
  panelPath: string;
  locationLabel: string;
  measurementsPopulation: string | undefined;
  exhibit: CaseStudyExhibit;
  stage: NonNullable<CaseStudyQuestion["caseStudy"]["stages"]>[number] | null;
}): P4CandidateRecord => {
  const row = panel.rows[0];
  if (!row) throw new Error(`${bank.path}::${panelPath}: missing candidate row`);
  const decisions = question.caseStudy.questions.map(decisionEvidenceFor);
  const units = [...new Set(row.values.map(({ unit }) => unit))].sort(byteCompare);
  return {
    lane: bank.lane,
    bankPath: bank.path,
    questionId: question.id,
    embeddedLeafId: null,
    exactObjectPath: panelPath,
    normalizedLocationLabel: locationLabel,
    declaredSchemaVersion: bank.envelope.meta?.schemaVersion ?? null,
    surface: "structured_labs_panel",
    itemType: question.itemType,
    category: question.category,
    topic: question.topic,
    difficulty: question.difficulty,
    analyteOrRowKey: row.key,
    displayedLabel: row.label,
    unit: units.join(" | "),
    populationDeclared: measurementsPopulation ?? "unspecified",
    populationEffective: measurementsPopulation ?? "unspecified",
    numSeries: null,
    numTimepoints: null,
    numColumns: panel.columns.length,
    numValues: row.values.length,
    keyedVisualMetadata: {
      expectedTrendPath: null,
      expectedFlagsPath: null,
      visualJustificationPath: null,
    },
    currentValidation: {
      status: "PASS",
      proofSurface: "BANK_SCHEMA",
      errors: [],
    },
    currentApplicableSelfCheck: {
      status: "NOT_APPLICABLE_BY_CURRENT_CONTRACT",
      contract: "Structured panels have no renderer selfCheck; their current proof surface is bank/schema validation and separately named gates.",
      errors: [],
    },
    policyImpact: {
      S1: "PASSES_CURRENT_NONEMPTY_ROWS_CONTRACT",
      S2: "NEWLY_FAILS_UNIVERSAL_TWO_ROW_FLOOR",
      S3: "PENDING_INDEPENDENT_LOAD_BEARING_AND_EXACT_DUPLICATION_CLASSIFICATION",
      S4: "PENDING_ARCHITECT_NAMED_CONTEXT_CLASS_AFTER_EVIDENCE_REVIEW",
    },
    semanticReview: semanticReviewTemplate(),
    reviewPacket: {
      testedDecisionEvidence: decisions,
      presentationValues: panel,
      caseContext: caseContextFor(question, exhibit, stage),
      rationalePassages: decisions.map(({ questionId, rationale }) => ({ questionId, rationale })),
      declaredVisualJustification: null,
      keyedVisualMetadata: null,
      usefulContextDimensions: {
        location: locationLabel,
        panelColumns: panel.columns,
        caseStageId: stage?.id ?? null,
        caseStageTitle: stage?.title ?? null,
        exhibitType: exhibit.type ?? null,
        exhibitTitle: exhibit.title,
        analyte: row.key,
        surroundingProse: exhibit.content,
      },
    },
  };
};

export const collectP4CandidatesFromBank = (bank: LoadedBank): { records: P4CandidateRecord[]; observations: ObservationCounts } => {
  const records: P4CandidateRecord[] = [];
  const observations = emptyObservationCounts();
  bank.envelope.questions.forEach((question, questionIndex) => {
    for (const ref of collectVisualRefs(question)) {
      if (ref.visual.kind !== "lab_trend") continue;
      observations.labTrendVisuals += 1;
      const visual = ref.visual as LabTrendSpec;
      if (visual.series.length === 1) {
        observations.oneSeriesLabTrendCandidates += 1;
        records.push(labCandidate({ bank, question, questionIndex, ref }));
      } else if (visual.series.length === 2) {
        observations.twoSeriesLabTrendNonCandidates += 1;
      }
    }
    if (question.itemType !== "case_study") return;
    const collectExhibit = (
      exhibit: CaseStudyExhibit,
      basePath: string,
      locationLabel: string,
      stage: NonNullable<CaseStudyQuestion["caseStudy"]["stages"]>[number] | null,
    ) => {
      const measurements = exhibit.structuredMeasurements;
      if (!measurements) return;
      measurements.panels.forEach((panel, panelIndex) => {
        if (panel.kind !== "labs") return;
        observations.structuredLabsPanels += 1;
        if (panel.rows.length === 1) {
          observations.oneRowStructuredLabsCandidates += 1;
          records.push(structuredCandidate({
            bank,
            question,
            questionIndex,
            panel,
            panelPath: `${basePath}.structuredMeasurements.panels[${panelIndex}]`,
            locationLabel,
            measurementsPopulation: measurements.population,
            exhibit,
            stage,
          }));
        } else {
          observations.multiRowStructuredLabsNonCandidates += 1;
        }
      });
    };
    question.caseStudy.exhibits.forEach((exhibit, exhibitIndex) => collectExhibit(
      exhibit,
      `questions[${questionIndex}].caseStudy.exhibits[${exhibitIndex}]`,
      "case exhibit structured measurements",
      null,
    ));
    question.caseStudy.stages?.forEach((stage, stageIndex) => stage.exhibits.forEach((exhibit, exhibitIndex) => collectExhibit(
      exhibit,
      `questions[${questionIndex}].caseStudy.stages[${stageIndex}].exhibits[${exhibitIndex}]`,
      "staged case exhibit structured measurements",
      stage,
    )));
  });
  return { records, observations };
};

const listJsonNames = async (directory: string, optional: boolean): Promise<string[]> => {
  try {
    return (await readdir(directory)).filter((name) => name.endsWith(".json")).sort(byteCompare);
  } catch (error) {
    if (optional && (error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
};

export const discoverP4SurveyBankPaths = async ({
  bankDir = BANK_DIR,
  rawDir = RAW_DIR,
  promotedDir = PROMOTED_DIR,
}: {
  bankDir?: string;
  rawDir?: string;
  promotedDir?: string;
} = {}) => {
  const [canonical, raw, promoted] = await Promise.all([
    listJsonNames(bankDir, false),
    listJsonNames(rawDir, true),
    listJsonNames(promotedDir, true),
  ]);
  return {
    canonical: canonical.map((name) => join(bankDir, name)),
    raw: raw.map((name) => join(rawDir, name)),
    promoted: promoted.map((name) => join(promotedDir, name)),
  };
};

const loadValidatedBank = async (path: string, lane: Lane): Promise<LoadedBank> => {
  const parsed = JSON.parse(await readFile(path, "utf8")) as unknown;
  const result = validateBankObject(parsed);
  if (!result.ok) throw new Error(`${path}: ${result.reasons.join("; ")}`);
  return { path, lane, envelope: result.value };
};

const candidateReference = (record: P4CandidateRecord): CandidateReference => ({
  bankPath: record.bankPath,
  questionId: record.questionId,
  embeddedLeafId: record.embeddedLeafId,
  exactObjectPath: record.exactObjectPath,
  normalizedLocationLabel: record.normalizedLocationLabel,
});

type PolicyConsequences = {
  schemaValidation: string;
  renderer: string;
  exportEnvelope: string;
  promotedVisualParity: string;
  bankMigration: string;
};

const exactPolicy = (
  records: readonly P4CandidateRecord[],
  label: string,
  newlyFails: boolean,
  consequences: PolicyConsequences,
) => ({
  status: "CALCULATED_MECHANICALLY",
  rule: label,
  candidateCountEvaluated: records.length,
  affectedCandidateCount: newlyFails ? records.length : 0,
  newlyFailingRecords: newlyFails ? records.map(candidateReference) : [],
  affectedBanks: newlyFails ? [...new Set(records.map(({ bankPath }) => bankPath))].sort(byteCompare) : [],
  affectedLocations: newlyFails ? countBy(records, ({ normalizedLocationLabel }) => normalizedLocationLabel) : {},
  metadataOnlyRepairPossible: newlyFails ? "NO" : "NOT_NEEDED",
  clinicallyUnnecessaryDataRequired: newlyFails ? "PENDING_INDEPENDENT_ADDITIONAL_DATA_MERIT_REVIEW" : "NO",
  surfaceRemovalPreservesAnswerability: newlyFails ? "PENDING_INDEPENDENT_LOAD_BEARING_REVIEW" : "NOT_APPLICABLE",
  consequences,
});

const pendingPolicy = <T extends Record<string, unknown>>(records: readonly P4CandidateRecord[], label: string, additional: T) => ({
  status: "PENDING_INDEPENDENT_REVIEW",
  ruleTemplate: label,
  candidatePopulation: records.length,
  exactAffectedCandidateCount: null,
  newlyFailingRecords: null,
  affectedBanks: null,
  affectedLocations: null,
  metadataOnlyRepairPossible: null,
  clinicallyUnnecessaryDataRequired: null,
  surfaceRemovalPreservesAnswerability: null,
  ...additional,
});

const laneSummary = (
  records: readonly P4CandidateRecord[],
  observations: ObservationCounts,
  lane: Lane,
  discoveredBankPaths: readonly string[],
) => {
  const laneRecords = records.filter((record) => record.lane === lane);
  return {
    discoveredFileCount: discoveredBankPaths.length,
    discoveredBankPaths,
    candidateCount: laneRecords.length,
    candidateBankPaths: [...new Set(laneRecords.map(({ bankPath }) => bankPath))].sort(byteCompare),
    candidatesBySurface: countBy(laneRecords, ({ surface }) => surface),
    observations,
  };
};

export const buildSingleRowLabPanelsSurvey = async ({
  bankDir = BANK_DIR,
  rawDir = RAW_DIR,
  promotedDir = PROMOTED_DIR,
}: {
  bankDir?: string;
  rawDir?: string;
  promotedDir?: string;
} = {}) => {
  const paths = await discoverP4SurveyBankPaths({ bankDir, rawDir, promotedDir });
  const banks = (await Promise.all((Object.entries(paths) as Array<[Lane, string[]]>).flatMap(([lane, lanePaths]) =>
    lanePaths.map((path) => loadValidatedBank(path, lane))
  ))).sort((left, right) => byteCompare(left.path, right.path));

  const laneObservations: Record<Lane, ObservationCounts> = {
    canonical: emptyObservationCounts(),
    raw: emptyObservationCounts(),
    promoted: emptyObservationCounts(),
  };
  const records: P4CandidateRecord[] = [];
  for (const bank of banks) {
    const collected = collectP4CandidatesFromBank(bank);
    records.push(...collected.records);
    laneObservations[bank.lane] = addObservationCounts(laneObservations[bank.lane], collected.observations);
  }
  records.sort((left, right) => byteCompare(
    [left.lane, left.bankPath, left.exactObjectPath, left.surface].join("\0"),
    [right.lane, right.bankPath, right.exactObjectPath, right.surface].join("\0"),
  ));

  const lab = records.filter(({ surface }) => surface === "lab_trend");
  const structured = records.filter(({ surface }) => surface === "structured_labs_panel");
  const totalObservations = Object.values(laneObservations).reduce(addObservationCounts, emptyObservationCounts());
  const structuredContextInventory = {
    normalizedLocations: [...new Set(structured.map(({ normalizedLocationLabel }) => normalizedLocationLabel))].sort(byteCompare),
    panelColumnCounts: countBy(structured, ({ numColumns }) => String(numColumns)),
    caseStageIds: countBy(structured, (record) => String((record.reviewPacket.usefulContextDimensions as { caseStageId: string | null }).caseStageId)),
    exhibitTypes: countBy(structured, (record) => String((record.reviewPacket.usefulContextDimensions as { exhibitType: string | null }).exhibitType)),
    analytes: countBy(structured, ({ analyteOrRowKey }) => analyteOrRowKey),
  };

  return {
    survey: "single-row-lab-presentation-p4",
    surveyDate: SURVEY_DATE,
    status: "MECHANICAL_COMPLETE_SEMANTIC_ADJUDICATION_PENDING",
    authority: {
      mode: "REPORT_ONLY",
      forbiddenChanges: ["schema floors", "renderer behavior", "bank content", "reference-band policy", "runtime behavior"],
      seatSplit: "The generator owns mechanical facts only. A producer-independent checker owns load-bearing, duplication, second-row-merit, and surface-fit classifications. The architecture seat may name an S4 context class only after reviewing the evidence.",
    },
    contractEvidence: {
      labTrend: {
        candidateDefinition: "lab_trend visual with exactly one series entry",
        currentContract: "one or two series; at least three timepoints",
        selfCheckApplicability: "Answer-coupled selfCheck applies only to top-level or embedded question.visual. Rationale visuals and case exhibits receive structural validation without that answer-coupled selfCheck.",
      },
      structuredLabsPanel: {
        candidateDefinition: "individual structuredMeasurements.panels[] entry with kind=labs and rows.length=1",
        currentContract: "nonempty rows; no two-row minimum",
        selfCheckApplicability: "NOT_APPLICABLE_BY_CURRENT_CONTRACT; structured panels have no renderer selfCheck.",
      },
    },
    population: {
      canonical: laneSummary(records, laneObservations.canonical, "canonical", paths.canonical),
      raw: laneSummary(records, laneObservations.raw, "raw", paths.raw),
      promoted: laneSummary(records, laneObservations.promoted, "promoted", paths.promoted),
      absentOptionalDirectoryRule: "An absent raw or promoted directory is an empty population. Other filesystem and validation failures fail the survey.",
      note: "An absent optional lane serializes like a present lane containing no JSON files. Every discovered JSON path is recorded; noncandidate P4 surfaces remain visible in observation counts.",
    },
    summary: {
      candidateCount: records.length,
      candidatesBySurface: countBy(records, ({ surface }) => surface),
      candidatesByLane: countBy(records, ({ lane }) => lane),
      candidatesByLocation: countBy(records, ({ normalizedLocationLabel }) => normalizedLocationLabel),
      observations: totalObservations,
      currentValidationFailures: records.filter(({ currentValidation }) => currentValidation.status === "FAIL").length,
      applicableSelfCheckFailures: records.filter(({ currentApplicableSelfCheck }) => currentApplicableSelfCheck.status === "FAIL").length,
      selfCheckNotApplicableByCurrentContract: records.filter(({ currentApplicableSelfCheck }) => currentApplicableSelfCheck.status === "NOT_APPLICABLE_BY_CURRENT_CONTRACT").length,
      semanticClassificationsComplete: 0,
    },
    policyResults: {
      L1: exactPolicy(lab, "Preserve one-or-two-series lab_trend contract.", false, {
        schemaValidation: "NONE; the current one-or-two-series validation contract remains unchanged.",
        renderer: "NONE.",
        exportEnvelope: "NONE.",
        promotedVisualParity: "NONE.",
        bankMigration: "NONE.",
      }),
      L2: exactPolicy(lab, "Require two series universally for lab_trend.", true, {
        schemaValidation: "Would change lab_trend validation policy from one-or-two series to exactly two. A new schema-version floor is a separate architecture choice, not an automatic consequence.",
        renderer: "No renderer change is inherently required; the current lab_trend renderer already supports two series.",
        exportEnvelope: "No automatic consequence. Export-envelope behavior changes only if the architecture introduces a new feature floor.",
        promotedVisualParity: "Policy alone does not change snapshot hashes. Current promoted-bank loading would fail until affected payloads are migrated or excepted; hashes change only if a visual payload or renderer changes.",
        bankMigration: "All newly failing records require a meaningful second series, removal/replacement of the visual surface, or an exception policy; metadata alone cannot comply.",
      }),
      L3: pendingPolicy(lab, "Permit one series only when independently classified as load-bearing and not exactly duplicated by prose.", {
        calculationAfterReview: "newly fails when loadBearing != true OR exactProseDuplication == true",
        consequences: {
          schemaValidation: "Would add a conditional validation policy after independent classifications are represented by an architecture-approved mechanism; exact scope is pending review.",
          renderer: "No renderer change is inherently required.",
          exportEnvelope: "No automatic consequence; it depends on whether the approved mechanism introduces a new feature floor.",
          promotedVisualParity: "Policy alone does not change hashes. Any later payload repair is handled by the existing record-local parity process.",
          bankMigration: "Exact records and repair types remain pending independent load-bearing and duplication classifications.",
        } satisfies PolicyConsequences,
      }),
      S1: exactPolicy(structured, "Preserve nonempty-row structured labs panel contract.", false, {
        schemaValidation: "NONE; the current nonempty-rows contract remains unchanged.",
        renderer: "NONE.",
        exportEnvelope: "NONE.",
        promotedVisualParity: "NONE; structuredMeasurements panels are not registered QuestionVisual artifacts in the promoted-visual baseline.",
        bankMigration: "NONE.",
      }),
      S2: exactPolicy(structured, "Require two rows for every structured labs panel.", true, {
        schemaValidation: "Would change structured labs panel validation policy from nonempty rows to at least two rows. A new schema-version floor is a separate architecture choice, not an automatic consequence.",
        renderer: "No renderer change is inherently required; the current structured-measurements renderer already supports multiple rows.",
        exportEnvelope: "No automatic consequence. Export-envelope behavior changes only if the architecture introduces a new feature floor.",
        promotedVisualParity: "NONE under the current baseline; structuredMeasurements panels are not registered QuestionVisual artifacts. Structured renderer/schema regressions remain applicable.",
        bankMigration: "All newly failing panels require a clinically meaningful second row, removal/replacement of the structured surface, or an exception policy; metadata alone cannot comply.",
      }),
      S3: pendingPolicy(structured, "Permit one row only when independently classified as load-bearing and not exactly duplicated by prose.", {
        calculationAfterReview: "newly fails when loadBearing != true OR exactProseDuplication == true",
        consequences: {
          schemaValidation: "Would add a conditional structured-panel validation policy after independent classifications are represented by an architecture-approved mechanism; exact scope is pending review.",
          renderer: "No renderer change is inherently required.",
          exportEnvelope: "No automatic consequence; it depends on whether the approved mechanism introduces a new feature floor.",
          promotedVisualParity: "NONE under the current registered-QuestionVisual baseline. Any later structured payload repair remains subject to structured renderer/schema tests.",
          bankMigration: "Exact panels and repair types remain pending independent load-bearing and duplication classifications.",
        } satisfies PolicyConsequences,
      }),
      S4: pendingPolicy(structured, "Apply a two-row floor only to an architecture-named panel/context class derived from this evidence.", {
        namedPanelOrContextClass: null,
        contextInventory: structuredContextInventory,
        calculationAfterArchitectureRuling: "deterministically match the named class, then list matching one-row panels as newly failing",
        consequences: {
          schemaValidation: "Pending the architecture-seat class definition. Only matching panels would enter a changed validation policy.",
          renderer: "No renderer change is inherently required.",
          exportEnvelope: "No automatic consequence; it depends on whether the approved class mechanism introduces a new feature floor.",
          promotedVisualParity: "NONE under the current registered-QuestionVisual baseline. Any later matching-panel repair remains subject to structured renderer/schema tests.",
          bankMigration: "Pending both the named class and deterministic matching pass; nonmatching one-row panels would require no migration.",
        } satisfies PolicyConsequences,
      }),
    },
    semanticReviewTemplate: {
      requiredFields: ["loadBearing", "exactProseDuplication", "partialDuplication", "secondRowMerit", "surfaceFit"],
      S4Restriction: "The checker may classify the supplied context facts but must not invent the named S4 panel/context class. That is an architecture-seat decision after candidate review.",
      allowedSurfaceFitValues: ["one_analyte_trend", "one_row_structured_panel", "ordinary_prose", "other_existing_surface"],
    },
    records,
    regenerationCommand: "npm run survey:single-row-lab-panels",
    driftCommand: "npm run test:single-row-lab-panels",
  };
};

export const serializeSingleRowLabPanelsSurvey = (survey: Awaited<ReturnType<typeof buildSingleRowLabPanelsSurvey>>): string =>
  `${JSON.stringify(survey, null, 2)}\n`;

export const assertSingleRowLabPanelsManifestBytes = (actual: string, expected: string): void => {
  if (actual !== expected) {
    throw new Error("single-row lab panels survey drift: run npm run survey:single-row-lab-panels and review the candidate delta");
  }
};

const main = async () => {
  const survey = await buildSingleRowLabPanelsSurvey();
  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, serializeSingleRowLabPanelsSurvey(survey), "utf8");
  console.log(`${OUTPUT_PATH}: ${survey.summary.candidateCount} candidates (${survey.summary.candidatesBySurface.lab_trend ?? 0} lab_trend; ${survey.summary.candidatesBySurface.structured_labs_panel ?? 0} structured panels)`);
};

const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
