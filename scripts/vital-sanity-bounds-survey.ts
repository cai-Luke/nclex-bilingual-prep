import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MEASUREMENT_ALLOWLIST } from "../src/measurementAllowlist";
import {
  normalizeUnit,
  toCanonicalMeasurementValue,
} from "../src/measurementUnitPolicy";
import { collectAllVisuals, collectVisualRefs, validateBankObject, type VisualRef } from "../src/schema";
import type {
  BankEnvelope,
  Question,
  StructuredMeasurements,
} from "../src/types";
import { VITAL_DEFS } from "../src/visuals/kinds/vitals_trend/defs";
import {
  selfCheckVitalsTrend,
  validateVitalsTrend,
} from "../src/visuals/kinds/vitals_trend";
import type { VitalKey, VitalsTrendSpec } from "../src/visuals/kinds/vitals_trend/types";

const SURVEY_DATE = "2026-08-19";
const BANK_DIR = "banks";
export const OUTPUT_PATH = "audit/vital-sanity-bounds-survey-2026-08-19-post-r5/survey-manifest.json";

const byteCompare = (left: string, right: string): number =>
  Buffer.compare(Buffer.from(left), Buffer.from(right));

export const VITAL_KEYS = Object.freeze(Object.keys(VITAL_DEFS).sort(byteCompare) as VitalKey[]);

/** Synthetic test resolution only. These values do not author or change a clinical bound. */
export const VITAL_BOUNDARY_EPSILON: Readonly<Record<VitalKey, number>> = Object.freeze({
  hr: 1,
  sbp: 1,
  dbp: 1,
  map: 1,
  rr: 1,
  spo2: 1,
  temp: 0.1,
});

type SurveySurface = "vitals_trend" | "structured_measurements";
type SurveyLocation = VisualRef["location"] | "caseExhibitStructuredMeasurements" | "caseStageExhibitStructuredMeasurements";
type SurveyPopulation = "adult" | "peds_child" | "peds_infant" | "unspecified";
type ConversionMode = "identity" | "linear" | "affine";
type Bound = ">" | "<";
type Gate4Classification = "IN_BAND" | "WARN_OUT_OF_BAND" | "UNRECOGNIZED_UNIT" | "UNCONVERTIBLE";
type GoverningContract =
  | {
      kind: "structuredMeasurementGate4";
      currentClassification: Gate4Classification;
    }
  | {
      kind: "vitalsTrendRendererEnvelope";
      rendererValidation: "VALIDATED";
      sanityIntervalComparison: "NOT_EXECUTED";
    };

export type CandidateInterval = Readonly<{ min: number; max: number }>;
export type CandidateIntervals = Readonly<Partial<Record<VitalKey, CandidateInterval>>>;

export const R5_CANDIDATE_INTERVALS: CandidateIntervals = Object.freeze({
  sbp: Object.freeze({ min: 40, max: 400 }),
  rr: Object.freeze({ min: 2, max: 150 }),
  spo2: Object.freeze({ min: 0, max: 100 }),
});

export type VitalSurveyRecord = {
  bank: string;
  bankPath: string;
  questionId: string;
  surface: SurveySurface;
  location: SurveyLocation;
  recordPath: string;
  vital: VitalKey;
  rawValue: number | string;
  sourceUnit: string;
  normalizedSourceUnit: string;
  normalizedUnitAccepted: boolean;
  conversionMode: ConversionMode;
  canonicalUnit: string;
  canonicalValue: number | null;
  canonicalThreshold: number | null;
  bound: Bound | null;
  populationDeclared: SurveyPopulation;
  populationEffective: SurveyPopulation;
  governingContract: GoverningContract;
};

type LoadedBank = {
  path: string;
  lane: "canonical" | "raw" | "promoted";
  envelope: BankEnvelope;
};

const sortedObject = <T>(entries: Iterable<readonly [string, T]>): Record<string, T> =>
  Object.fromEntries([...entries].sort(([left], [right]) => byteCompare(left, right)));

const countBy = (records: readonly VitalSurveyRecord[], valueFor: (record: VitalSurveyRecord) => string): Record<string, number> => {
  const counts = new Map<string, number>();
  for (const record of records) {
    const value = valueFor(record);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return sortedObject(counts.entries());
};

const isVitalKey = (value: string): value is VitalKey => VITAL_KEYS.includes(value as VitalKey);

const conversionModeFor = (vital: VitalKey, sourceUnit: string): ConversionMode => {
  const normalized = normalizeUnit(sourceUnit);
  if (vital === "temp" && (normalized === "f" || normalized === "°f")) return "affine";
  if (normalized === normalizeUnit(MEASUREMENT_ALLOWLIST[vital].canonicalUnit)) return "identity";
  if (vital === "temp" && normalized === "c") return "identity";
  return "linear";
};

const canonicalNumberFor = (record: VitalSurveyRecord): number | null =>
  record.bound === null ? record.canonicalValue : record.canonicalThreshold;

export const isRecordOutOfRange = (
  record: Pick<VitalSurveyRecord, "bound" | "canonicalValue" | "canonicalThreshold">,
  interval: CandidateInterval,
): boolean | null => {
  const value = record.bound === null ? record.canonicalValue : record.canonicalThreshold;
  if (value === null) return null;
  if (record.bound === ">") return value < interval.min;
  if (record.bound === "<") return value > interval.max;
  return value < interval.min || value > interval.max;
};

const classifyGate4 = (
  accepted: boolean,
  converted: number | null,
  bound: Bound | null,
  interval: CandidateInterval,
): Gate4Classification => {
  if (!accepted) return "UNRECOGNIZED_UNIT";
  if (converted === null) return "UNCONVERTIBLE";
  const outOfRange = isRecordOutOfRange({
    bound,
    canonicalValue: bound === null ? converted : null,
    canonicalThreshold: bound === null ? null : converted,
  }, interval);
  return outOfRange ? "WARN_OUT_OF_BAND" : "IN_BAND";
};

const makeRecord = ({
  bankPath,
  questionId,
  surface,
  location,
  recordPath,
  vital,
  rawValue,
  sourceUnit,
  bound,
  populationDeclared,
  populationEffective,
}: {
  bankPath: string;
  questionId: string;
  surface: SurveySurface;
  location: SurveyLocation;
  recordPath: string;
  vital: VitalKey;
  rawValue: number | string;
  sourceUnit: string;
  bound: Bound | null;
  populationDeclared: SurveyPopulation;
  populationEffective: SurveyPopulation;
}): VitalSurveyRecord => {
  const def = MEASUREMENT_ALLOWLIST[vital];
  const normalizedSourceUnit = normalizeUnit(sourceUnit);
  const acceptedUnits = new Set(def.acceptedSourceUnits.map(normalizeUnit));
  const normalizedUnitAccepted = acceptedUnits.has(normalizedSourceUnit);
  const rawText = String(rawValue);
  const converted = normalizedUnitAccepted
    ? toCanonicalMeasurementValue(vital, rawText, sourceUnit)
    : null;
  return {
    bank: basename(bankPath),
    bankPath,
    questionId,
    surface,
    location,
    recordPath,
    vital,
    rawValue,
    sourceUnit,
    normalizedSourceUnit,
    normalizedUnitAccepted,
    conversionMode: conversionModeFor(vital, sourceUnit),
    canonicalUnit: def.canonicalUnit,
    canonicalValue: bound === null ? converted : null,
    canonicalThreshold: bound === null ? null : converted,
    bound,
    populationDeclared,
    populationEffective,
    governingContract: surface === "structured_measurements"
      ? {
          kind: "structuredMeasurementGate4",
          currentClassification: classifyGate4(normalizedUnitAccepted, converted, bound, def.sanity),
        }
      : {
          kind: "vitalsTrendRendererEnvelope",
          rendererValidation: "VALIDATED",
          sanityIntervalComparison: "NOT_EXECUTED",
        },
  };
};

const visualPathFor = (questionPath: string, question: Question, ref: VisualRef): string => {
  switch (ref.location) {
    case "question": return `${questionPath}.visual`;
    case "questionRationale": return `${questionPath}.rationale.visuals[${ref.locationIndex}]`;
    case "caseExhibit": return `${questionPath}.caseStudy.exhibits[${ref.locationIndex}].visual`;
    case "caseStageExhibit": return `${questionPath}.caseStudy.stages[${ref.stageIndex}].exhibits[${ref.locationIndex}].visual`;
    case "caseQuestion":
    case "caseQuestionRationale": {
      if (question.itemType !== "case_study") throw new Error(`${question.id}: embedded visual on non-case question`);
      const embeddedIndex = question.caseStudy.questions.findIndex((embedded) => embedded.id === ref.ownerId);
      if (embeddedIndex < 0) throw new Error(`${question.id}: cannot resolve embedded visual owner ${ref.ownerId}`);
      const base = `${questionPath}.caseStudy.questions[${embeddedIndex}]`;
      return ref.location === "caseQuestion"
        ? `${base}.visual`
        : `${base}.rationale.visuals[${ref.locationIndex}]`;
    }
  }
};

const collectVitalsTrendRecords = (
  bankPath: string,
  question: Question,
  questionIndex: number,
): {
  records: VitalSurveyRecord[];
  mapBoundsViolations: string[];
  mapSelfCheckViolations: string[];
} => {
  const records: VitalSurveyRecord[] = [];
  const mapBoundsViolations: string[] = [];
  const mapSelfCheckViolations: string[] = [];
  const questionPath = `questions[${questionIndex}]`;
  const refs = collectVisualRefs(question);
  const projected = collectAllVisuals(question);
  if (refs.length !== projected.length || refs.some((ref, index) => ref.visual !== projected[index])) {
    throw new Error(`${bankPath}::${question.id}: collectAllVisuals projection drift`);
  }

  for (const ref of refs) {
    if (ref.visual.kind !== "vitals_trend") continue;
    const visual = ref.visual as VitalsTrendSpec;
    const basePath = visualPathFor(questionPath, question, ref);
    const declared = visual.population ?? "unspecified";
    const effective = visual.population ?? "adult";
    const validationErrors = validateVitalsTrend(visual);
    const selfCheckErrors = selfCheckVitalsTrend(visual, question);
    for (const error of validationErrors.filter(({ code }) => code === "map_bounds_violation")) {
      mapBoundsViolations.push(`${bankPath}::${basePath}.${error.path}`);
    }
    for (const error of selfCheckErrors.filter(({ code }) => code === "self_check_map_failed")) {
      mapSelfCheckViolations.push(`${bankPath}::${basePath}.${error.path}`);
    }

    visual.series.forEach((series, seriesIndex) => {
      const sourceUnit = series.vital === "temp" ? (visual.tempUnit ?? "C") : VITAL_DEFS[series.vital].unit;
      series.values.forEach((value, valueIndex) => {
        records.push(makeRecord({
          bankPath,
          questionId: question.id,
          surface: "vitals_trend",
          location: ref.location,
          recordPath: `${basePath}.series[${seriesIndex}].values[${valueIndex}]`,
          vital: series.vital,
          rawValue: value,
          sourceUnit,
          bound: null,
          populationDeclared: declared,
          populationEffective: effective,
        }));
      });
    });
  }

  return { records, mapBoundsViolations, mapSelfCheckViolations };
};

const collectStructuredMeasurementWrapper = (
  bankPath: string,
  questionId: string,
  measurements: StructuredMeasurements,
  location: Extract<SurveyLocation, "caseExhibitStructuredMeasurements" | "caseStageExhibitStructuredMeasurements">,
  basePath: string,
): VitalSurveyRecord[] => {
  const records: VitalSurveyRecord[] = [];
  const population = measurements.population ?? "unspecified";
  measurements.panels.forEach((panel, panelIndex) => {
    if (panel.kind !== "vitals") return;
    panel.rows.forEach((row, rowIndex) => {
      const vital = row.key;
      if (!isVitalKey(vital)) return;
      row.values.forEach((entry, valueIndex) => {
        records.push(makeRecord({
          bankPath,
          questionId,
          surface: "structured_measurements",
          location,
          recordPath: `${basePath}.panels[${panelIndex}].rows[${rowIndex}].values[${valueIndex}]`,
          vital,
          rawValue: entry.value,
          sourceUnit: entry.unit,
          bound: entry.bound ?? null,
          populationDeclared: population,
          populationEffective: population,
        }));
      });
    });
  });
  return records;
};

const collectStructuredMeasurementRecords = (
  bankPath: string,
  question: Question,
  questionIndex: number,
): VitalSurveyRecord[] => {
  if (question.itemType !== "case_study") return [];
  const records: VitalSurveyRecord[] = [];
  const questionPath = `questions[${questionIndex}].caseStudy`;
  question.caseStudy.exhibits.forEach((exhibit, exhibitIndex) => {
    if (!exhibit.structuredMeasurements) return;
    records.push(...collectStructuredMeasurementWrapper(
      bankPath,
      question.id,
      exhibit.structuredMeasurements,
      "caseExhibitStructuredMeasurements",
      `${questionPath}.exhibits[${exhibitIndex}].structuredMeasurements`,
    ));
  });
  question.caseStudy.stages?.forEach((stage, stageIndex) => {
    stage.exhibits.forEach((exhibit, exhibitIndex) => {
      if (!exhibit.structuredMeasurements) return;
      records.push(...collectStructuredMeasurementWrapper(
        bankPath,
        question.id,
        exhibit.structuredMeasurements,
        "caseStageExhibitStructuredMeasurements",
        `${questionPath}.stages[${stageIndex}].exhibits[${exhibitIndex}].structuredMeasurements`,
      ));
    });
  });
  return records;
};

const readValidatedBank = async (path: string, lane: LoadedBank["lane"]): Promise<LoadedBank> => {
  const raw = JSON.parse(await readFile(path, "utf8")) as unknown;
  const result = validateBankObject(raw);
  if (!result.ok) throw new Error(`${path}: ${result.reasons.join("; ")}`);
  return { path, lane, envelope: result.value };
};

const listJsonNames = async (directory: string, optional: boolean): Promise<string[]> => {
  try {
    return (await readdir(directory)).filter((name) => name.endsWith(".json")).sort(byteCompare);
  } catch (error) {
    if (optional && (error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
};

export const discoverVitalSurveyBankPaths = async ({
  bankDir = BANK_DIR,
  rawDir,
  promotedDir,
}: {
  bankDir?: string;
  rawDir?: string;
  promotedDir?: string;
} = {}) => {
  const [canonicalNames, rawNames, promotedNames] = await Promise.all([
    listJsonNames(bankDir, false),
    rawDir === undefined ? Promise.resolve([]) : listJsonNames(rawDir, true),
    promotedDir === undefined ? Promise.resolve([]) : listJsonNames(promotedDir, true),
  ]);
  return {
    canonical: canonicalNames.map((name) => join(bankDir, name)),
    raw: rawDir === undefined ? [] : rawNames.map((name) => join(rawDir, name)),
    promoted: promotedDir === undefined ? [] : promotedNames.map((name) => join(promotedDir, name)),
  };
};

const recordSortKey = (record: VitalSurveyRecord): string =>
  [record.vital, record.bankPath, record.recordPath, record.surface, String(record.rawValue)].join("\u0000");

const recordReference = (record: VitalSurveyRecord) => ({
  bankPath: record.bankPath,
  questionId: record.questionId,
  recordPath: record.recordPath,
  surface: record.surface,
  populationDeclared: record.populationDeclared,
  populationEffective: record.populationEffective,
  sourceUnit: record.sourceUnit,
  rawValue: record.rawValue,
  canonicalValue: record.canonicalValue,
});

const boundaryRecords = (records: readonly VitalSurveyRecord[], boundary: number) => {
  const numeric = records.filter((record) => record.bound === null && record.canonicalValue !== null);
  const rank = (left: VitalSurveyRecord, right: VitalSurveyRecord) => {
    const leftValue = left.canonicalValue as number;
    const rightValue = right.canonicalValue as number;
    return Math.abs(leftValue - boundary) - Math.abs(rightValue - boundary)
      || byteCompare(left.bankPath, right.bankPath)
      || byteCompare(left.recordPath, right.recordPath)
      || leftValue - rightValue;
  };
  return {
    exact: numeric.filter((record) => record.canonicalValue === boundary).sort(rank).map(recordReference),
    below: numeric.filter((record) => (record.canonicalValue as number) < boundary).sort(rank).slice(0, 5).map(recordReference),
    above: numeric.filter((record) => (record.canonicalValue as number) > boundary).sort(rank).slice(0, 5).map(recordReference),
  };
};

const mechanismCostFor = (vital: VitalKey) => ({
  min: {
    mechanism: "available",
    consequence: vital === "spo2"
      ? "The independently authored SpO2 floor uses VITAL_SANITY_MIN_OVERRIDES."
      : "The VITAL_SANITY_MIN_OVERRIDES mechanism can carry a later separately ratified floor; doing so remains a data-contract change.",
  },
  max: {
    mechanism: "available",
    consequence: vital === "temp" || vital === "sbp" || vital === "rr"
      ? `The independently authored ${vital} ceiling uses VITAL_SANITY_MAX_OVERRIDES.`
      : "The VITAL_SANITY_MAX_OVERRIDES mechanism can carry a later separately ratified ceiling; doing so remains a data-contract change.",
  },
});

const contractForVital = (vital: VitalKey, records: readonly VitalSurveyRecord[]) => {
  const def = VITAL_DEFS[vital];
  const allow = MEASUREMENT_ALLOWLIST[vital];
  const vitalRecords = records.filter((record) => record.vital === vital);
  const exactNumeric = vitalRecords.filter((record) => record.bound === null && record.canonicalValue !== null);
  const numericValues = exactNumeric.map((record) => record.canonicalValue as number);
  const normal = def.normal("C");
  const tempNormalF = vital === "temp" ? def.normal("F") : null;
  const minAuthorship = vital === "spo2"
    ? {
        status: "independently_authored",
        citation: "DECISIONS.md R5 — Vital sanity ratifications for SBP, RR, and SpO2; VITAL_SANITY_MIN_OVERRIDES.spo2",
      }
    : {
        status: "inherited",
        citation: `src/measurementAllowlist.ts vitalEntries <- VITAL_DEFS.${vital}.range.min`,
      };
  const maxAuthorship = vital === "temp"
    ? {
        status: "independently_authored",
        citation: "DECISIONS.md R3 — Temperature sanity ceiling 46.5 °C; r9-temperature-sanity-decoupling-codex-spec.md; VITAL_SANITY_MAX_OVERRIDES.temp",
      }
    : vital === "sbp" || vital === "rr"
      ? {
          status: "independently_authored",
          citation: `DECISIONS.md R5 — Vital sanity ratifications for SBP, RR, and SpO2; VITAL_SANITY_MAX_OVERRIDES.${vital}`,
        }
    : {
        status: "inherited",
        citation: `src/measurementAllowlist.ts vitalEntries <- VITAL_DEFS.${vital}.range.max`,
      };
  return {
    vital,
    canonicalUnit: allow.canonicalUnit,
    rendererRegistryRange: { ...def.range, unit: def.unit },
    effectiveRendererAuthoringEnvelopes: vital === "temp"
      ? [
          { min: 30, max: 43, unit: "°C", sourceUnitToken: "C" },
          { min: 86, max: 109, unit: "°F", sourceUnitToken: "F" },
        ]
      : [{ ...def.range, unit: def.unit, sourceUnitToken: def.unit }],
    sanity: {
      ...allow.sanity,
      unit: allow.canonicalUnit,
      minAuthorship,
      maxAuthorship,
    },
    adultNormalBand: {
      governing: false,
      primary: { min: normal.low, max: normal.high, unit: def.unit },
      ...(tempNormalF ? { alternate: { min: tempNormalF.low, max: tempNormalF.high, unit: "°F" } } : {}),
    },
    acceptedSourceUnits: allow.acceptedSourceUnits.map((unit) => ({
      unit,
      normalized: normalizeUnit(unit),
      conversionMode: conversionModeFor(vital, unit),
    })),
    boundaryProbeEpsilon: { value: VITAL_BOUNDARY_EPSILON[vital], unit: allow.canonicalUnit, syntheticOnly: true },
    mechanismCostByCandidateSide: mechanismCostFor(vital),
    counts: {
      total: vitalRecords.length,
      exactNumeric: exactNumeric.length,
      typedBound: vitalRecords.filter((record) => record.bound !== null).length,
      bySurface: countBy(vitalRecords, (record) => record.surface),
      byPopulationDeclared: countBy(vitalRecords, (record) => record.populationDeclared),
      byPopulationEffective: countBy(vitalRecords, (record) => record.populationEffective),
      byBank: countBy(vitalRecords, (record) => record.bankPath),
      byLocation: countBy(vitalRecords, (record) => record.location),
    },
    liveRange: numericValues.length === 0
      ? null
      : { min: Math.min(...numericValues), max: Math.max(...numericValues), unit: allow.canonicalUnit },
    recordsNearCurrentBoundary: {
      min: boundaryRecords(vitalRecords, allow.sanity.min),
      max: boundaryRecords(vitalRecords, allow.sanity.max),
    },
    gate4Policy: {
      normalLevel: "WARN",
      strictLevel: "FAIL",
      canonicalConversionFirst: true,
      inclusiveBounds: true,
      typedBoundsUseOneSidedComparison: true,
    },
  };
};

export const calculateCandidateIntervalImpact = (
  records: readonly VitalSurveyRecord[],
  candidates: CandidateIntervals,
) => {
  for (const key of Object.keys(candidates)) {
    if (!isVitalKey(key)) throw new Error(`${key}: candidate interval key is not a vital key`);
  }
  return VITAL_KEYS.filter((vital) => candidates[vital] !== undefined).map((vital) => {
  const candidate = candidates[vital] as CandidateInterval;
  if (!Number.isFinite(candidate.min) || !Number.isFinite(candidate.max) || candidate.min > candidate.max) {
    throw new Error(`${vital}: candidate interval must contain finite min <= max`);
  }
  const current = MEASUREMENT_ALLOWLIST[vital].sanity;
  const vitalRecords = records.filter((record) =>
    record.vital === vital && record.governingContract.kind === "structuredMeasurementGate4"
  );
  let comparable = 0;
  let newlyWarned = 0;
  let newlyAdmitted = 0;
  let unchangedInBand = 0;
  let unchangedWarn = 0;
  let excludedUnconvertible = 0;
  for (const record of vitalRecords) {
    const currentOut = isRecordOutOfRange(record, current);
    const candidateOut = isRecordOutOfRange(record, candidate);
    if (currentOut === null || candidateOut === null || !record.normalizedUnitAccepted) {
      excludedUnconvertible += 1;
      continue;
    }
    comparable += 1;
    if (!currentOut && candidateOut) newlyWarned += 1;
    else if (currentOut && !candidateOut) newlyAdmitted += 1;
    else if (currentOut) unchangedWarn += 1;
    else unchangedInBand += 1;
  }
    return {
    vital,
    current: { ...current },
    candidate: { ...candidate },
    comparable,
    newlyWarned,
    newlyAdmitted,
    unchangedInBand,
    unchangedWarn,
    excludedUnconvertible,
    excludedRendererEnvelopeRecords: records.filter((record) =>
      record.vital === vital && record.governingContract.kind === "vitalsTrendRendererEnvelope"
    ).length,
    };
  });
};

export const buildVitalSanityBoundsSurvey = async ({
  bankDir = BANK_DIR,
  rawDir,
  promotedDir,
  candidates = R5_CANDIDATE_INTERVALS,
}: {
  bankDir?: string;
  rawDir?: string;
  promotedDir?: string;
  candidates?: CandidateIntervals;
} = {}) => {
  const paths = await discoverVitalSurveyBankPaths({ bankDir, rawDir, promotedDir });
  const banks = await Promise.all([
    ...paths.canonical.map((path) => readValidatedBank(path, "canonical")),
    ...paths.raw.map((path) => readValidatedBank(path, "raw")),
    ...paths.promoted.map((path) => readValidatedBank(path, "promoted")),
  ]);
  const records: VitalSurveyRecord[] = [];
  const mapBoundsViolations: string[] = [];
  const mapSelfCheckViolations: string[] = [];
  for (const bank of banks) {
    bank.envelope.questions.forEach((question, questionIndex) => {
      const visual = collectVitalsTrendRecords(bank.path, question, questionIndex);
      records.push(...visual.records, ...collectStructuredMeasurementRecords(bank.path, question, questionIndex));
      mapBoundsViolations.push(...visual.mapBoundsViolations);
      mapSelfCheckViolations.push(...visual.mapSelfCheckViolations);
    });
  }
  records.sort((left, right) => byteCompare(recordSortKey(left), recordSortKey(right)));

  const typedBoundRecords = records.filter((record) => record.bound !== null);
  const structuredMeasurementRecords = records.filter((record) => record.governingContract.kind === "structuredMeasurementGate4");
  const vitalsTrendRecords = records.filter((record) => record.governingContract.kind === "vitalsTrendRendererEnvelope");
  const structuredUnrecognizedUnits = structuredMeasurementRecords.filter((record) => !record.normalizedUnitAccepted);
  const structuredUnconvertibleValues = structuredMeasurementRecords.filter((record) =>
    record.normalizedUnitAccepted && canonicalNumberFor(record) === null
  );
  const structuredGate4Warnings = records.filter((record) =>
    record.governingContract.kind === "structuredMeasurementGate4" &&
    record.governingContract.currentClassification === "WARN_OUT_OF_BAND"
  );
  return {
    survey: "vital-sanity-bounds-r5-post-implementation-conformance",
    date: SURVEY_DATE,
    status: "POST_IMPLEMENTATION_CONFORMANCE_EVIDENCE",
    ratification: {
      surveyImplementation: "R5 executes through per-side canonical-unit sanity overrides while renderer envelopes remain unchanged.",
      bounds: "R5 ratifies and production implements SBP max 400 mmHg, RR max 150/min, and spo2 min 0%; this manifest compares the live production intervals with those ratified reference intervals.",
    },
    standingProhibition: "Do not derive a global typo/unit-error tripwire from an adult normal range, and do not create pediatric normal ranges as a P3 ride-along.",
    statedLimitation: "This deterministic inventory covers machine-readable vitals_trend values and structured-measurement vitals-panel values only. It does not parse free prose, answer choices, stems, rationales, or narrative text, and makes no completeness claim about values outside those governed surfaces.",
    priorFindings: {
      withdrawnClaim: {
        source: "DECISIONS.md retired register — Withdrawn claim that vital sanity bounds pass every real value",
        finding: "The claim that vitals sanity passes every real transcribed value is withdrawn; documented SBP to approximately 370, RR at 80 with no margin, and displayable SpO2 below 50 contradict it.",
      },
      sweep20260711: {
        located: true,
        sources: [
          "DECISIONS.md at commit a67476cee75e365dd72c22a589d8e76c6e3ddc6d (2026-07-11 historical survey and pre-move sweep record)",
          "DECISIONS.md R3 — Temperature sanity ceiling 46.5 °C (current constitutional summary)",
          "r9-temperature-sanity-decoupling-codex-spec.md §6.1 (separate 2026-07-15 independent re-derivation)",
        ],
        priorResult: "Git history at a67476cee75e365dd72c22a589d8e76c6e3ddc6d records the 2026-07-11 report-only survey and pre-move sweep: zero flips under the 30-43 C validator and exploratory 10-50 C probes, promoted canonical temperature 36.7-40.11 C, and refreshed extraction artifacts 35.8-40.11 C. The July 11 spans cover the promoted canonical corpus and refreshed extraction artifacts and are not directly comparable to this survey's pooled per-vital liveRange, which spans both governed surfaces. Current DECISIONS.md R3 — Temperature sanity ceiling 46.5 °C preserves the compact zero-flip summary. Separately, the 2026-07-15 r9 §6.1 survey found 104 temperature values spanning 35.8-40.111111111111114 C and zero flips at the ratified T = 46.5 C.",
        reconciliation: "EXTENDS",
        adds: [
          "all seven vital keys, deterministically enumerated",
          "both machine-readable surfaces and all six full-schema visual locations",
          "declared versus effective population",
          "accepted-unit and conversion-policy evidence",
          "per-side authorship and override-mechanism cost",
          "deterministic boundary-neighbor records and reusable candidate-interval flip counts",
        ],
      },
    },
    population: {
      provenance: {
        committedDefaultPopulation: "TRACKED_TOP_LEVEL_CANONICAL_BANKS_ONLY",
        rawDrafts: rawDir === undefined ? "EXCLUDED" : "EXPLICITLY_INCLUDED",
        promotedStaging: promotedDir === undefined ? "EXCLUDED" : "EXPLICITLY_INCLUDED",
        stagingCountInterpretation: "rawDraftCount and promotedStagingCount report files included in this survey, not whether ignored staging files exist in the ambient checkout.",
      },
      canonicalBankFiles: paths.canonical,
      canonicalBankCount: paths.canonical.length,
      rawDraftFiles: paths.raw,
      rawDraftCount: paths.raw.length,
      promotedStagingFiles: paths.promoted,
      promotedStagingCount: paths.promoted.length,
      missingExplicitStagingDirectoriesAreEmptyPopulation: true,
      totalRecords: records.length,
    },
    counts: {
      byVital: countBy(records, (record) => record.vital),
      bySurface: countBy(records, (record) => record.surface),
      byPopulationDeclared: countBy(records, (record) => record.populationDeclared),
      byPopulationEffective: countBy(records, (record) => record.populationEffective),
      byBank: countBy(records, (record) => record.bankPath),
      byLocation: countBy(records, (record) => record.location),
    },
    conceptsByVital: VITAL_KEYS.map((vital) => contractForVital(vital, records)),
    findings: {
      structuredMeasurementGate4: {
        recordCount: structuredMeasurementRecords.length,
        warningRecords: structuredGate4Warnings,
        unrecognizedUnitRecords: structuredUnrecognizedUnits,
        unconvertibleValueRecords: structuredUnconvertibleValues,
        typedBoundRecords: typedBoundRecords.filter((record) => record.governingContract.kind === "structuredMeasurementGate4"),
      },
      rendererEnvelopeValidation: {
        recordCount: vitalsTrendRecords.length,
        validationFailures: [],
        mapBoundsViolations: mapBoundsViolations.sort(byteCompare),
        mapSelfCheckViolations: mapSelfCheckViolations.sort(byteCompare),
        interpretation: "Structural validation surface only. For the six aliased vitals, this null is guaranteed by validateVitalsTrend and is not evidence about GATE 4 sanity suitability. Temperature documents a decoupled renderer envelope but still does not execute GATE 4 on this surface.",
      },
    },
    candidateIntervalImpact: calculateCandidateIntervalImpact(records, candidates),
    records,
    regenerationCommand: "npm run survey:vital-sanity-bounds",
    driftCommand: "npm run test:vital-sanity-bounds",
  };
};

export type VitalSanityBoundsSurvey = Awaited<ReturnType<typeof buildVitalSanityBoundsSurvey>>;

export const serializeVitalSanityBoundsSurvey = (survey: VitalSanityBoundsSurvey): string =>
  `${JSON.stringify(survey, null, 2)}\n`;

export const assertVitalSanityManifestMatches = (generated: string, committed: string): void => {
  if (generated !== committed) {
    throw new Error("vital-sanity-bounds manifest drift: run npm run survey:vital-sanity-bounds");
  }
};

const parseCandidateArgs = async (args: string[]): Promise<CandidateIntervals> => {
  if (args.length === 0) return R5_CANDIDATE_INTERVALS;
  if (args.length !== 2 || args[0] !== "--candidates") {
    throw new Error("usage: npm run survey:vital-sanity-bounds -- [--candidates path/to/candidates.json]");
  }
  return JSON.parse(await readFile(args[1] as string, "utf8")) as CandidateIntervals;
};

const main = async () => {
  const candidates = await parseCandidateArgs(process.argv.slice(2));
  const survey = await buildVitalSanityBoundsSurvey({ candidates });
  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, serializeVitalSanityBoundsSurvey(survey), "utf8");
  console.log(`${OUTPUT_PATH}: ${survey.population.canonicalBankCount} canonical banks, ${survey.population.totalRecords} vital records; ${survey.findings.structuredMeasurementGate4.recordCount} structured GATE 4 records / ${survey.findings.structuredMeasurementGate4.warningRecords.length} warnings; ${survey.findings.rendererEnvelopeValidation.recordCount} renderer-envelope records`);
};

const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack : String(error));
    process.exit(2);
  });
}
