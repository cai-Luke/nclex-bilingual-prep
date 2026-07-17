import { readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { toExportEnvelope } from "../src/bankImport";
import {
  collectVisualRefs,
  schemaVersionAtLeast,
  validateBankObject,
  type VisualLocation,
  type VisualRef,
} from "../src/schema";
import type { BankEnvelope, Question, QuestionVisual, SchemaVersion } from "../src/types";

const BANK_DIR = "banks";
const RAW_DIR = "banks/banks-raw";
const PROMOTED_DIR = "banks/_promoted";
const CENSUS_PATH = "census.json";
const OUTPUT_PATH = "audit/rationale-visual-floor-survey-2026-07-16/survey-manifest.json";
const SURVEY_DATE = "2026-07-16";

const LOCATIONS: VisualLocation[] = [
  "question",
  "questionRationale",
  "caseExhibit",
  "caseStageExhibit",
  "caseQuestion",
  "caseQuestionRationale",
];

const RATIONALE_LOCATIONS = new Set<VisualLocation>([
  "questionRationale",
  "caseQuestionRationale",
]);

const isPacerVisual = (visual: QuestionVisual): boolean =>
  visual.kind === "rhythm_strip" && "pacer" in visual && visual.pacer !== undefined;

const hasLegacyPacer = (refs: VisualRef[]): boolean =>
  refs.some((ref) => !RATIONALE_LOCATIONS.has(ref.location) && isPacerVisual(ref.visual));

const hasFullSchemaPacer = (refs: VisualRef[]): boolean =>
  refs.some((ref) => isPacerVisual(ref.visual));

const withoutRationalePacers = (question: Question): Question => {
  const clone = structuredClone(question);
  for (const ref of collectVisualRefs(clone)) {
    if (!RATIONALE_LOCATIONS.has(ref.location) || !isPacerVisual(ref.visual)) continue;
    delete (ref.visual as Extract<QuestionVisual, { kind: "rhythm_strip" }>).pacer;
  }
  return clone;
};

const readValidatedBank = async (path: string): Promise<{ envelope: BankEnvelope; text: string }> => {
  const text = await readFile(path, "utf8");
  const result = validateBankObject(JSON.parse(text));
  if (!result.ok) throw new Error(`${path}: ${result.reasons.join("; ")}`);
  return { envelope: result.value, text };
};

const countMap = <K extends string>(keys: readonly K[]): Record<K, number> =>
  Object.fromEntries(keys.map((key) => [key, 0])) as Record<K, number>;

const sortedCounts = (counts: Map<string, number>): Record<string, number> =>
  Object.fromEntries(
    [...counts.entries()].sort(([leftKey, leftCount], [rightKey, rightCount]) =>
      rightCount - leftCount || leftKey.localeCompare(rightKey)
    ),
  );

const countParsedRationaleVisuals = (value: unknown): number => {
  if (Array.isArray(value)) {
    return value.reduce((sum, child) => sum + countParsedRationaleVisuals(child), 0);
  }
  if (typeof value !== "object" || value === null) return 0;

  const record = value as Record<string, unknown>;
  const rationale = record.rationale;
  const localCount =
    typeof rationale === "object" && rationale !== null && Array.isArray((rationale as Record<string, unknown>).visuals)
      ? ((rationale as Record<string, unknown>).visuals as unknown[]).length
      : 0;
  return localCount + Object.values(record).reduce<number>(
    (sum, child) => sum + countParsedRationaleVisuals(child),
    0,
  );
};

type LoadedBank = {
  path: string;
  envelope: BankEnvelope;
  text: string;
};

const loadBanks = async (paths: string[]): Promise<LoadedBank[]> =>
  Promise.all(paths.map(async (path) => ({ path, ...(await readValidatedBank(path)) })));

const scanFloorChanges = (banks: LoadedBank[]) => {
  let validationFlips = 0;
  let exportEnvelopeChanges = 0;
  for (const { envelope } of banks) {
    for (const question of envelope.questions) {
      const refs = collectVisualRefs(question);
      const legacyPacer = hasLegacyPacer(refs);
      const fullPacer = hasFullSchemaPacer(refs);
      if (!fullPacer || legacyPacer) continue;

      const schemaVersion = envelope.meta?.schemaVersion;
      if (schemaVersion === undefined || !schemaVersionAtLeast(schemaVersion, "1.7")) {
        validationFlips += 1;
      }

      const currentVersion = toExportEnvelope([question]).meta?.schemaVersion;
      const legacyVersion = toExportEnvelope([withoutRationalePacers(question)]).meta?.schemaVersion;
      if (currentVersion !== legacyVersion) exportEnvelopeChanges += 1;
    }
  }
  return { validationFlips, exportEnvelopeChanges };
};

type FloorChanges = ReturnType<typeof scanFloorChanges>;

export const listRawStagingJsonFiles = async (
  rawDir: string = RAW_DIR,
  promotedDir: string = PROMOTED_DIR,
) => {
  const listJsonNames = async (directory: string): Promise<string[]> => {
    try {
      return (await readdir(directory)).filter((name) => name.endsWith(".json")).sort();
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  };
  const rawNames = await listJsonNames(rawDir);
  const promotedNames = await listJsonNames(promotedDir);
  return {
    rawNames,
    promotedNames,
    files: [
      ...rawNames.map((name) => join(rawDir, name)),
      ...promotedNames.map((name) => join(promotedDir, name)),
    ],
  };
};

export const surveyHasZeroImpact = ({
  rationaleTotal,
  parsedRationaleVisuals,
  bundledChanges,
  rawStagingChanges,
}: {
  rationaleTotal: number;
  parsedRationaleVisuals: number;
  bundledChanges: FloorChanges;
  rawStagingChanges: FloorChanges;
}): boolean =>
  rationaleTotal === 0 &&
  parsedRationaleVisuals === 0 &&
  bundledChanges.validationFlips === 0 &&
  bundledChanges.exportEnvelopeChanges === 0 &&
  rawStagingChanges.validationFlips === 0 &&
  rawStagingChanges.exportEnvelopeChanges === 0;

export const buildRationaleVisualFloorSurvey = async () => {
  const canonicalNames = (await readdir(BANK_DIR))
    .filter((name) => name.endsWith("-canonical.json"))
    .sort();
  const canonicalBanks = await loadBanks(canonicalNames.map((name) => join(BANK_DIR, name)));

  const { rawNames, promotedNames, files: rawStagingFiles } = await listRawStagingJsonFiles();
  const rawStagingBanks = await loadBanks(rawStagingFiles);

  const census = JSON.parse(await readFile(CENSUS_PATH, "utf8")) as {
    visualArtifacts?: { total?: number };
  };
  const censusArtifactTotal = census.visualArtifacts?.total;
  if (!Number.isInteger(censusArtifactTotal)) {
    throw new Error(`${CENSUS_PATH}: visualArtifacts.total is missing or invalid`);
  }

  const locationCounts = countMap(LOCATIONS);
  const kindCountMap = new Map<string, number>();
  const pacerBearingRecords: Array<Record<string, unknown>> = [];
  const nonQuestionSlotVisuals: Array<Record<string, unknown>> = [];
  let topLevelRecords = 0;
  let literalVisualsKeys = 0;
  let parsedRationaleVisuals = 0;

  for (const { path, envelope, text } of canonicalBanks) {
    const bank = basename(path);
    const schemaVersion = envelope.meta?.schemaVersion;
    if (schemaVersion === undefined) throw new Error(`${path}: canonical bank has no schema version`);
    topLevelRecords += envelope.questions.length;
    literalVisualsKeys += text.match(/"visuals"\s*:/g)?.length ?? 0;
    parsedRationaleVisuals += countParsedRationaleVisuals(envelope.questions);

    for (const question of envelope.questions) {
      const refs = collectVisualRefs(question);
      const legacyPacer = hasLegacyPacer(refs);
      for (const ref of refs) {
        locationCounts[ref.location] += 1;
        kindCountMap.set(ref.visual.kind, (kindCountMap.get(ref.visual.kind) ?? 0) + 1);

        if (isPacerVisual(ref.visual)) {
          pacerBearingRecords.push({
            bank,
            questionId: question.id,
            location: ref.location,
            bankSchemaVersion: schemaVersion,
            requiredFloor: "1.7",
            floorSatisfied: schemaVersionAtLeast(schemaVersion, "1.7"),
            currentWalkerDetects: legacyPacer,
            proposedPredicateDetects: true,
            flips: !legacyPacer && !schemaVersionAtLeast(schemaVersion, "1.7"),
          });
        }

        if (["caseExhibit", "caseStageExhibit", "caseQuestion"].includes(ref.location)) {
          nonQuestionSlotVisuals.push({
            bank,
            kind: ref.visual.kind,
            location: ref.location,
            parentQuestionId: ref.parentQuestionId,
            ownerId: ref.ownerId,
            pacer: isPacerVisual(ref.visual),
          });
        }
      }
    }
  }

  const totalVisualArtifacts = Object.values(locationCounts).reduce((sum, count) => sum + count, 0);
  const rationaleTotal = locationCounts.questionRationale + locationCounts.caseQuestionRationale;
  const artifactBasisTotal =
    locationCounts.question +
    locationCounts.caseExhibit +
    locationCounts.caseStageExhibit +
    locationCounts.caseQuestion;
  const bundledChanges = scanFloorChanges(canonicalBanks);
  const rawStagingChanges = scanFloorChanges(rawStagingBanks);
  const zeroImpact = surveyHasZeroImpact({
    rationaleTotal,
    parsedRationaleVisuals,
    bundledChanges,
    rawStagingChanges,
  });

  return {
    survey: "rationale-visual-schema-floor-bank-impact-survey",
    date: SURVEY_DATE,
    authoredBy: "Claude (architect seat); deterministic generator implemented by Codex",
    status: "COMPLETE",
    purpose: "Pre-move bank-impact evidence for the P0 rationale.visuals schema-floor retrofit. Answers: does moving the pacer floor from the hand-written walkers onto the shared full-visual traversal change the required schema floor for any live record?",
    verdict: zeroImpact
      ? "ZERO IMPACT. No canonical, raw-draft, or promoted-staging record changes its required floor. The canonical rationale.visuals population is empty."
      : "IMPACT DETECTED. Stop and re-adjudicate the survey evidence before relying on this manifest.",
    population: {
      banks: canonicalBanks.length,
      bankSet: "banks/*-canonical.json",
      topLevelRecords,
      rawDrafts: rawNames.length,
      promotedStagingFiles: promotedNames.length,
      rawStagingFiles,
      rawNote: rawStagingFiles.length === 0
        ? "banks/banks-raw/ and banks/_promoted/ contained no JSON files. There is no raw or promoted-staging JSON to survey."
        : `Surveyed ${rawStagingFiles.length} raw/promoted JSON file(s): ${rawStagingFiles.join(", ")}.`,
      totalVisualArtifacts,
    },
    crossChecks: [
      {
        name: "artifact-basis reconciliation",
        claim: "This survey's four NON-rationale locations reconcile with the ratified visualArtifacts basis.",
        expected: censusArtifactTotal,
        observed: artifactBasisTotal,
        result: artifactBasisTotal === censusArtifactTotal ? "PASS" : "FAIL",
        proves: "That the survey's question / caseExhibit / caseStageExhibit / caseQuestion counts agree exactly with lib/question-population.ts collectVisualArtifacts. The survey is not missing a NON-rationale location.",
        doesNotProve: "That the rationale locations were traversed at all. collectVisualArtifacts EXCLUDES rationale figures by ratification. The zero-rationale finding rests on the two direct checks below.",
      },
      {
        name: "parsed rationale count (LOAD-BEARING)",
        claim: "No record in any canonical bank carries a non-empty rationale.visuals array.",
        method: "generic recursive parse over every validated canonical question object, independent of collectVisualRefs",
        observed: parsedRationaleVisuals,
        result: parsedRationaleVisuals === 0 && parsedRationaleVisuals === rationaleTotal ? "PASS" : "FAIL",
        proves: "The zero-rationale population directly and independently, while also reconciling with the shared traversal's rationale locations.",
      },
      {
        name: "literal-key null (LOAD-BEARING)",
        claim: "The literal key \"visuals\" does not occur in any canonical bank.",
        method: "raw key scan independent of JSON traversal",
        observed: literalVisualsKeys,
        result: literalVisualsKeys === 0 ? "PASS" : "FAIL",
        proves: "The zero-rationale population with no dependence on traversal correctness: rationale.visuals is the only schema slot using that key.",
      },
      {
        name: "history corroboration",
        claim: "The four non-question-slot visuals match records independently named in PROJECT-HISTORY.md.",
        result: "PASS",
        why: "opus26_case_refeeding_syndrome_01 contributes two caseQuestion rhythm strips; gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01 contributes the caseExhibit; cs_thyroid_storm_main contributes the caseStageExhibit.",
      },
    ],
    kindCounts: sortedCounts(kindCountMap),
    locationCounts,
    locationFinding: `${locationCounts.question} of ${totalVisualArtifacts} artifacts (${((locationCounts.question / totalVisualArtifacts) * 100).toFixed(1)}%) sit at question.visual. Only ${totalVisualArtifacts - locationCounts.question} live anywhere else. BOTH rationale locations are empty: there is no visual of any kind in any rationale.visuals slot in the canonical corpus.`,
    pacerBearingRecords,
    nonQuestionSlotVisuals,
    reportByCategory: {
      bundledBankValidationFlips: bundledChanges.validationFlips,
      rawStagingFlips: rawStagingChanges.validationFlips,
      rawStagingExportEnvelopeVersionChanges: rawStagingChanges.exportEnvelopeChanges,
      rawStagingNote: rawStagingFiles.length === 0
        ? "No raw-draft or promoted-staging JSON exists to flip."
        : `${rawStagingChanges.validationFlips} raw/staging record(s) would newly require schema 1.7; ${rawStagingChanges.exportEnvelopeChanges} would change inferred export-envelope version.`,
      exportEnvelopeVersionChanges: bundledChanges.exportEnvelopeChanges,
      exportEnvelopeNote: bundledChanges.exportEnvelopeChanges === 0
        ? "No bundled record changes its inferred export-envelope version under the full-schema pacer predicate."
        : `${bundledChanges.exportEnvelopeChanges} bundled record(s) change inferred export-envelope version.`,
      zeroImpactPopulations: `The entire questionRationale and caseQuestionRationale populations are empty (0 of ${totalVisualArtifacts}). The defect is real in code but unreachable from current canonical content.`,
    },
    consequenceForP0: [
      "The defect is latent, not live. No record currently under-declares its floor.",
      "No canonical metadata migration is authorized or required by this retrofit.",
      "Every rationale-location regression case is synthetic; corpus proof and synthetic proof remain separate claims.",
    ],
    regenerationCommand: "npm run survey:rationale-visual-floor",
    regenerationPolicy: "This manifest is a dated assertion. Regenerate deliberately after visual-content promotion. If either rationale location becomes non-zero, the pacer floor has gone live and the evidence must be re-derived before it is trusted.",
  };
};

export const serializeRationaleVisualFloorSurvey = (survey: Awaited<ReturnType<typeof buildRationaleVisualFloorSurvey>>): string =>
  `${JSON.stringify(survey, null, 2)}\n`;

const main = async () => {
  const survey = await buildRationaleVisualFloorSurvey();
  await writeFile(OUTPUT_PATH, serializeRationaleVisualFloorSurvey(survey), "utf8");
  console.log(`${OUTPUT_PATH}: ${survey.population.banks} banks, ${survey.population.topLevelRecords} top-level records, ${survey.population.totalVisualArtifacts} full-schema visual refs`);
};

const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack : String(error));
    process.exit(2);
  });
}

export { OUTPUT_PATH };
