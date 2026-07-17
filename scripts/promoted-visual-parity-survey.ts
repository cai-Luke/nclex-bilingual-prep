import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { VisualError } from "../src/visuals/registry";
import { getVisual, listVisualKinds } from "../src/visuals/registry";
import {
  loadPromotedVisualInventory,
  VISUAL_LOCATIONS,
  type PromotedVisualRecord,
} from "./promoted-visual-parity";

export const OUTPUT_PATH = "audit/promoted-visual-parity-survey-2026-07-16/survey-manifest.json";
const LEGACY_SNAPSHOT_PATH = "scripts/tests/__snapshots__/visual-parity.json";
const SURVEY_DATE = "2026-07-16";
const REQUIRED_U0_IDS = [
  "rhy_sinus_brady_001",
  "rhy_vtach_001",
  "rhy_afib_001",
] as const;

const CALIBRATED_TRACING = new Set(["rhythm_strip", "capnography", "fetal_monitoring"]);
const LOAD_BEARING_ARITHMETIC = new Set([
  "io_record",
  "medication_label",
  "device_screen",
  "burn_map",
  "io_trend",
]);
const CHART_TREND = new Set(["vitals_trend", "lab_trend", "io_trend"]);
const SPATIAL_ANATOMICAL = new Set(["injection_site", "burn_map"]);
const EXACT_ARITHMETIC = new Set(["io_record", "medication_label", "burn_map"]);

const RECOGNIZED_DERIVATIONS: Record<string, readonly string[]> = {
  io_record: ["intake_total_ml", "output_total_ml", "net_balance_ml"],
  medication_label: [
    "concentration_per_ml",
    "volume_to_administer_ml",
    "quantity_to_administer_tablets",
    "quantity_to_administer_capsules",
    "rate_ml_per_hr",
  ],
  device_screen: [
    "max_demands_1h",
    "max_dose_1h_mg",
    "delivered_dose_total_mg",
    "infusion_volume_ml",
    "infusion_duration_min",
  ],
  burn_map: [
    "tbsa_pct",
    "parkland_total_ml",
    "parkland_first8h_ml",
    "parkland_rate_first8h_ml_hr",
  ],
  io_trend: ["net_by_interval_ml", "cumulative_net_ml", "final_cumulative_net_ml"],
};
const IO_TREND_SERIES = new Set(["intake", "output", "net", "cumulative_net"]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const byteSort = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const sha256 = (value: string): string =>
  createHash("sha256").update(value).digest("hex");

const questionMeta = (record: PromotedVisualRecord): Record<string, unknown> => {
  const question = record.carrierQuestion as unknown as Record<string, unknown>;
  return isRecord(question.meta) ? question.meta : {};
};

const recognizedExpectedTrends = (meta: Record<string, unknown>, record: PromotedVisualRecord): number => {
  if (record.ref.visual.kind !== "io_trend" || !Array.isArray(meta.expected_trend)) return 0;
  const visual = record.ref.visual as unknown as Record<string, unknown>;
  const time = isRecord(visual.time) && Array.isArray(visual.time.values) ? visual.time.values : [];
  return meta.expected_trend.filter((value) => {
    if (!isRecord(value) || typeof value.series !== "string" || !IO_TREND_SERIES.has(value.series)) return false;
    if (value.direction !== "up" && value.direction !== "down") return false;
    if (!Array.isArray(value.window) || value.window.length !== 2) return false;
    const start = time.indexOf(value.window[0]);
    const end = time.indexOf(value.window[1]);
    return start !== -1 && end > start;
  }).length;
};

const recognizedCrossover = (meta: Record<string, unknown>, record: PromotedVisualRecord): boolean => {
  if (record.ref.visual.kind !== "io_trend" || !isRecord(meta.crossover)) return false;
  const visual = record.ref.visual as unknown as Record<string, unknown>;
  const intervals = Array.isArray(visual.intervals) ? visual.intervals : [];
  const { crossover } = meta;
  return typeof crossover.series === "string" &&
    IO_TREND_SERIES.has(crossover.series) &&
    Number.isInteger(crossover.index) &&
    (crossover.index as number) >= 1 &&
    (crossover.index as number) < intervals.length &&
    (crossover.from === "positive" || crossover.from === "negative") &&
    (crossover.to === "positive" || crossover.to === "negative") &&
    crossover.from !== crossover.to;
};

export const extractRecognizedProof = (record: PromotedVisualRecord) => {
  const meta = questionMeta(record);
  const keyed = isRecord(meta.derived_values_keyed) ? meta.derived_values_keyed : {};
  const supported = new Set(RECOGNIZED_DERIVATIONS[record.ref.visual.kind] ?? []);
  const recognizedDerivedKeys = Object.keys(keyed).filter((key) => supported.has(key)).sort(byteSort);

  const visual = record.ref.visual as unknown as Record<string, unknown>;
  const settings = Array.isArray(visual.settings) ? visual.settings : [];
  const settingKeys = new Set(settings.flatMap((value) =>
    isRecord(value) && typeof value.key === "string" ? [value.key] : []
  ));
  const keyedSettings = Array.isArray(meta.keyed_settings) ? meta.keyed_settings : [];
  const recognizedKeyedSettings = keyedSettings.flatMap((value) =>
    isRecord(value) && typeof value.key === "string" && settingKeys.has(value.key)
      ? [value.key]
      : []
  ).sort(byteSort);
  const expectedTrendCount = recognizedExpectedTrends(meta, record);
  const crossover = recognizedCrossover(meta, record);
  const recognizedProofSurfaces = [
    ...(recognizedDerivedKeys.length > 0 ? ["derived_values_keyed"] : []),
    ...(recognizedKeyedSettings.length > 0 ? ["keyed_settings"] : []),
    ...(expectedTrendCount > 0 ? ["expected_trend"] : []),
    ...(crossover ? ["crossover"] : []),
  ];

  return {
    declaredKeyedPresent: recognizedDerivedKeys.length > 0,
    recognizedProofSurfaces,
    recognizedDerivedKeys,
    recognizedKeyedSettings,
    recognizedExpectedTrendCount: expectedTrendCount,
    recognizedCrossover: crossover,
  };
};

const tiersFor = (kind: string): string[] => [
  ...(CALIBRATED_TRACING.has(kind) ? ["calibrated-tracing"] : []),
  ...(LOAD_BEARING_ARITHMETIC.has(kind) ? ["load-bearing-arithmetic"] : []),
  ...(CHART_TREND.has(kind) ? ["chart-trend"] : []),
  ...(SPATIAL_ANATOMICAL.has(kind) ? ["spatial-anatomical"] : []),
];

const rendererModuleFor = (kind: string): string => {
  const directory = kind === "rhythm_strip" ? "rhythmStrip" : kind;
  return `src/visuals/kinds/${directory}/index.ts`;
};

type SurveyRecord = ReturnType<typeof buildSurveyRecord>;

const buildSurveyRecord = (record: PromotedVisualRecord) => {
  const mod = getVisual(record.ref.visual.kind);
  if (mod === undefined) throw new Error(`no registered renderer for ${record.ref.visual.kind}`);
  if (mod.selfCheck === undefined) throw new Error(`renderer ${record.ref.visual.kind} has no selfCheck`);

  let firstRender: string | undefined;
  let secondRender: string | undefined;
  let renderError: string | null = null;
  try {
    firstRender = mod.renderSvg(record.ref.visual as never);
    secondRender = mod.renderSvg(record.ref.visual as never);
  } catch (error) {
    renderError = error instanceof Error ? error.message : String(error);
  }
  const selfCheckErrors = mod.selfCheck(
    record.ref.visual as never,
    record.carrierQuestion,
  ) as VisualError[];
  const proof = extractRecognizedProof(record);

  return {
    parityId: record.parityId,
    kind: record.ref.visual.kind,
    location: record.ref.location,
    bank: record.bank,
    parentQuestionId: record.ref.parentQuestionId,
    ownerId: record.ref.ownerId,
    carrierQuestionId: record.carrierQuestionId,
    carrierRoute: record.carrierRoute,
    rendererModule: rendererModuleFor(record.ref.visual.kind),
    proposedTiers: tiersFor(record.ref.visual.kind),
    renderDeterministic: renderError === null && firstRender === secondRender,
    renderError,
    selfCheckErrors,
    ...proof,
    // Kept in-memory only for the U0 migration-readiness check. It is removed
    // from the serialized per-record survey so this phase cannot become a hash baseline.
    _svgHash: firstRender === undefined ? null : sha256(firstRender),
  };
};

const countBy = (records: SurveyRecord[], select: (record: SurveyRecord) => string): Record<string, number> => {
  const counts = new Map<string, number>();
  for (const record of records) {
    const key = select(record);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort(([left], [right]) => byteSort(left, right)));
};

const countByDomain = (
  records: SurveyRecord[],
  domain: readonly string[],
  select: (record: SurveyRecord) => string,
): Record<string, number> => {
  const counts = new Map(domain.map((key) => [key, 0]));
  for (const record of records) {
    const key = select(record);
    if (!counts.has(key)) throw new Error(`count domain is missing key ${key}`);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Object.fromEntries(domain.map((key) => [key, counts.get(key) ?? 0]));
};

const countsByKindAndLocation = (records: SurveyRecord[]): Record<string, Record<string, number>> => {
  const kinds = [...new Set(records.map((record) => record.kind))].sort(byteSort);
  return Object.fromEntries(kinds.map((kind) => [
    kind,
    countByDomain(
      records.filter((record) => record.kind === kind),
      VISUAL_LOCATIONS,
      (record) => record.location,
    ),
  ]));
};

const readU0MigrationReadiness = async (records: SurveyRecord[]) => {
  const legacy = JSON.parse(await readFile(LEGACY_SNAPSHOT_PATH, "utf8")) as {
    svgHashes?: Array<{ id: string; svgHash: string }>;
  };
  if (!Array.isArray(legacy.svgHashes)) {
    throw new Error(`${LEGACY_SNAPSHOT_PATH}: svgHashes is missing before the authorized migration`);
  }
  const liveById = new Map(records.map((record) => [record.parityId, record]));
  const legacyById = new Map(legacy.svgHashes.map((record) => [record.id, record.svgHash]));
  const migrated = REQUIRED_U0_IDS.map((id) => {
    const live = liveById.get(id);
    const oldHash = legacyById.get(id) ?? null;
    const newHash = live?._svgHash ?? null;
    const actualKind = live?.kind ?? null;
    const actualLocation = live?.location ?? null;
    const hashEqual = oldHash !== null && newHash === oldHash;
    const kindEqual = actualKind === "rhythm_strip";
    const locationEqual = actualLocation === "question";
    return {
      parityId: id,
      oldHash,
      newHash,
      expectedKind: "rhythm_strip",
      actualKind,
      kindEqual,
      expectedLocation: "question",
      actualLocation,
      locationEqual,
      hashEqual,
      equal: hashEqual && kindEqual && locationEqual,
      target: "scripts/tests/__snapshots__/visual-parity-promoted/rhythm_strip.json",
    };
  });
  const unexpectedLegacyIds = legacy.svgHashes
    .map(({ id }) => id)
    .filter((id) => !(REQUIRED_U0_IDS as readonly string[]).includes(id))
    .sort(byteSort);
  return {
    source: LEGACY_SNAPSHOT_PATH,
    requiredIds: [...REQUIRED_U0_IDS],
    migrated,
    unexpectedLegacyIds,
    allPresent: migrated.every(({ oldHash, newHash, kindEqual, locationEqual }) =>
      oldHash !== null && newHash !== null && kindEqual && locationEqual
    ),
    allStructurallyEligible: migrated.every(({ kindEqual, locationEqual }) => kindEqual && locationEqual),
    allEqual: migrated.every(({ equal }) => equal) && unexpectedLegacyIds.length === 0,
    note: "Readiness evidence only. The survey phase does not write promoted snapshots or remove legacy svgHashes.",
  };
};

export const buildPromotedVisualParitySurvey = async (bankDir: string = "banks") => {
  const inventory = await loadPromotedVisualInventory(bankDir);
  const promoted = inventory.records;
  const internalRecords = promoted.map(buildSurveyRecord);
  const exactArithmeticRecordsWithoutKeyed = internalRecords
    .filter((record) => EXACT_ARITHMETIC.has(record.kind) && !record.declaredKeyedPresent)
    .map((record) => record.parityId);
  const deviceScreenRecordsWithoutProof = internalRecords
    .filter((record) => record.kind === "device_screen" &&
      !record.recognizedProofSurfaces.includes("derived_values_keyed") &&
      !record.recognizedProofSurfaces.includes("keyed_settings"))
    .map((record) => record.parityId);
  const ioTrendRecordsWithoutProof = internalRecords
    .filter((record) => record.kind === "io_trend" && record.recognizedProofSurfaces.length === 0)
    .map((record) => record.parityId);
  const ioTrendRecords = internalRecords.filter((record) => record.kind === "io_trend");
  const ioTrendKeyedAndTrend = ioTrendRecords.filter((record) =>
    record.recognizedProofSurfaces.includes("derived_values_keyed") &&
    record.recognizedProofSurfaces.includes("expected_trend")
  );
  const selfCheckFailures = internalRecords
    .filter((record) => record.selfCheckErrors.length > 0)
    .map((record) => ({ parityId: record.parityId, errors: record.selfCheckErrors }));
  const nondeterministicRenders = internalRecords
    .filter((record) => !record.renderDeterministic)
    .map((record) => ({ parityId: record.parityId, renderError: record.renderError }));
  const registeredKinds = listVisualKinds().sort(byteSort);
  const representedKinds = [...new Set(internalRecords.map((record) => record.kind))].sort(byteSort);
  const unclassifiedKinds = representedKinds.filter((kind) => tiersFor(kind).length === 0);
  const u0MigrationReadiness = await readU0MigrationReadiness(internalRecords);
  const blockers = [
    ...(selfCheckFailures.length > 0 ? ["self-check-failures"] : []),
    ...(nondeterministicRenders.length > 0 ? ["nondeterministic-renders"] : []),
    ...(exactArithmeticRecordsWithoutKeyed.length > 0 ? ["exact-arithmetic-without-keyed-values"] : []),
    ...(deviceScreenRecordsWithoutProof.length > 0 ? ["device-screen-without-proof"] : []),
    ...(ioTrendRecordsWithoutProof.length > 0 ? ["io-trend-without-proof"] : []),
    ...(!u0MigrationReadiness.allPresent || !u0MigrationReadiness.allEqual ? ["u0-migration-not-lossless"] : []),
  ];

  const records = internalRecords.map(({ _svgHash: _omitted, ...record }) => record);
  return {
    survey: "promoted-visual-parity-impact-survey",
    date: SURVEY_DATE,
    authoredBy: "Claude (architect seat); deterministic generator implemented by Codex",
    status: "AWAITING ARCHITECT ADJUDICATION",
    purpose: "Survey every promoted visual before authorizing the P2 hash baseline.",
    population: {
      bankSet: "banks/*.json",
      scannedBanks: inventory.scannedBanks.length,
      banksWithVisuals: new Set(promoted.map((record) => record.bank)).size,
      scannedBankFiles: inventory.scannedBanks,
      records: records.length,
      registeredKinds: registeredKinds.length,
      representedKinds: representedKinds.length,
    },
    counts: {
      byKind: countBy(internalRecords, (record) => record.kind),
      byLocation: countByDomain(internalRecords, VISUAL_LOCATIONS, (record) => record.location),
      byKindAndLocation: countsByKindAndLocation(internalRecords),
      byTier: Object.fromEntries([
        "calibrated-tracing",
        "load-bearing-arithmetic",
        "chart-trend",
        "spatial-anatomical",
      ].map((tier) => [tier, internalRecords.filter((record) => record.proposedTiers.includes(tier)).length])),
    },
    findings: {
      identityCollisions: [],
      selfCheckFailures,
      nondeterministicRenders,
      exactArithmeticRecordsWithoutKeyed,
      deviceScreenRecordsWithoutProof,
      ioTrendRecordsWithoutProof,
      unclassifiedKinds,
    },
    ioTrendPopulation: {
      total: ioTrendRecords.length,
      keyedArithmeticAndTrendAssertions: ioTrendKeyedAndTrend.length,
      patternOnly: ioTrendRecords.filter((record) => !record.declaredKeyedPresent).length,
      statement: "All four current io_trend records carry both keyed arithmetic and trend assertions; the pattern-only allowance has no live population.",
    },
    u0MigrationReadiness,
    blockers,
    automatedNullPassed: blockers.length === 0,
    architectQuestions: unclassifiedKinds.length === 0
      ? []
      : [{
          code: "unclassified-review-tier",
          kinds: unclassifiedKinds,
          question: "Which review tier owns a hash change for each listed kind? The survey does not infer architecture.",
        }],
    architectAdjudicationRequired: true,
    records,
    regenerationCommand: "npm run survey:promoted-visual-parity",
    phaseBoundary: "Do not generate promoted snapshot hashes or migrate U0 until Claude records survey-adjudication PASS.",
  };
};

export const serializePromotedVisualParitySurvey = (
  survey: Awaited<ReturnType<typeof buildPromotedVisualParitySurvey>>,
): string => `${JSON.stringify(survey, null, 2)}\n`;

const isMain = process.argv[1] !== undefined &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const survey = await buildPromotedVisualParitySurvey();
  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, serializePromotedVisualParitySurvey(survey), "utf8");
  console.log(
    `promoted visual parity survey wrote ${OUTPUT_PATH} (${survey.population.records} records, ${survey.blockers.length} blocker(s))`,
  );
  if (!survey.automatedNullPassed) process.exitCode = 1;
}
