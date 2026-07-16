import { execSync } from "node:child_process";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  collectQuestionPopulation,
  collectScoredLeaves,
  collectVisualArtifacts,
} from "../lib/question-population";
import { parseBankText } from "../src/bankImport";
import { categories, standaloneItemTypes, validateBankObject } from "../src/schema";
import { listVisualKinds } from "../src/visuals/registry";
import type { Question, RhythmStripVisual, StandaloneQuestion } from "../src/types";
import { computeCoverage, SESSION_SIZE, type CoverageData } from "./coverage-report";

type PerFileEntry = {
  file: string;
  schemaVersion: string | null;
  metaCount: number | null;
  questionsLength: number;
  mismatch: boolean;
};

type TopicConcentration = Record<string, { topTopics: Array<{ topic: string; count: number }> }>;

type PlanningTargets = {
  categoryTargets: [string, number][];
  itemTypeAverage: number;
  underCategories: [string, number][];
  overCategories: [string, number][];
  underItemTypes: [string, number][];
};

export type CensusData = {
  generatedAt: string;
  inputGitSha: string;
  sessionUnits: {
    populationBasis: "top_level_session_units";
    total: number;
    standalone: number;
    caseContainers: number;
    embeddedParts: number;
    inventoryRecords: number;
    perFile: PerFileEntry[];
    byItemType: Record<string, number>;
    byCategory: Record<string, number>;
    withinCategory: TopicConcentration;
    byDifficulty: Record<string, number>;
    deliveryCapacity: {
      requestedSessionSize: number;
      standaloneDrawEligible: number;
      insufficientForFullSession: boolean;
      byCategory: [string, number][];
      requestedCategoryTargets: [string, number][];
      shortfalls: [string, number][];
    };
    bySchemaVersion: Record<string, { questions: number; files: string[] }>;
    bySourceFile: Record<string, number>;
    caseStudies: Array<{ id: string; topic: string; parts: number; bank: string }>;
  };
  scoredLeaves: {
    populationBasis: "standalone_top_level_plus_embedded_leaves";
    total: number;
    standalone: number;
    embedded: number;
    byItemType: Record<string, number>;
    byCategory: Record<string, number>;
    withinCategory: TopicConcentration;
    byDifficulty: Record<string, number>;
    targets: PlanningTargets;
    prioritizeTopics: string[];
    avoidTopics: string[];
  };
  visualArtifacts: {
    populationBasis: "recursive_visual_artifacts";
    total: number;
    byKind: Record<string, number>;
    rhythmSubtypes: Record<string, number>;
    idsByKind: Record<string, string[]>;
  };
  idUniqueness: { duplicates: Array<{ id: string; files: string[] }> };
  docsDrift: { ok: boolean; findings: string[] };
};

export type CensusPopulationAnalysis = {
  sessionUnits: {
    total: number;
    standalone: number;
    caseContainers: number;
    embeddedParts: number;
    inventoryRecords: number;
    coverage: CoverageData;
  };
  scoredLeaves: {
    total: number;
    standalone: number;
    embedded: number;
    questions: StandaloneQuestion[];
    coverage: CoverageData;
  };
};

export const getBankFiles = async () => {
  const bankFiles = await readdir("banks").then((files) =>
    files
      .filter((file) => file.endsWith(".json"))
      .sort()
      .map((file) => join("banks", file)),
  );
  return bankFiles.map((file) => resolve(file));
};

export const loadBank = async (file: string) => {
  const text = await readFile(file, "utf8");
  const raw = parseBankText(text);
  const result = validateBankObject(raw);
  if (!result.ok) {
    throw new Error(`${basename(file)} failed validation:\n${result.reasons.map((reason) => `- ${reason}`).join("\n")}`);
  }
  return result.value;
};

const getGitSha = (): string => {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
};

const sumCounts = (rows: readonly (readonly [string, number])[]) =>
  rows.reduce((sum, [, count]) => sum + count, 0);

export const assertCensusPopulationReconciliation = (analysis: CensusPopulationAnalysis): void => {
  const session = analysis.sessionUnits;
  const leaves = analysis.scoredLeaves;
  const sessionTotals = [
    session.coverage.totalQuestions,
    sumCounts(session.coverage.byCategory),
    sumCounts(session.coverage.byItemType),
    sumCounts(session.coverage.byDifficulty),
  ];
  if (
    session.standalone + session.caseContainers !== session.total ||
    sessionTotals.some((count) => count !== session.total)
  ) {
    throw new Error(`Session-unit reconciliation failed: totals=${sessionTotals.join(",")}, declared=${session.total}.`);
  }
  const scoredTotals = [
    leaves.coverage.totalQuestions,
    sumCounts(leaves.coverage.byCategory),
    sumCounts(leaves.coverage.byItemType),
    sumCounts(leaves.coverage.byDifficulty),
  ];
  if (
    leaves.standalone + leaves.embedded !== leaves.total ||
    leaves.questions.length !== leaves.total ||
    scoredTotals.some((count) => count !== leaves.total)
  ) {
    throw new Error(`Scored-leaf reconciliation failed: totals=${scoredTotals.join(",")}, declared=${leaves.total}.`);
  }
  if (
    leaves.coverage.byItemType.some(([itemType]) => itemType === "case_study") ||
    leaves.coverage.underItemTypes.some(([itemType]) => itemType === "case_study")
  ) {
    throw new Error("Scored-leaf reconciliation failed: case_study entered a scored item-type distribution.");
  }
  if (session.coverage.totalEligible !== session.standalone) {
    throw new Error(
      `Session-unit delivery-capacity reconciliation failed: eligible=${session.coverage.totalEligible}, standalone=${session.standalone}.`,
    );
  }
};

const assertSameIds = (expected: readonly StandaloneQuestion[], actual: readonly StandaloneQuestion[]) => {
  const expectedIds = expected.map(({ id }) => id);
  const actualIds = actual.map(({ id }) => id);
  if (expectedIds.length !== actualIds.length || expectedIds.some((id, index) => id !== actualIds[index])) {
    throw new Error(
      `Scored-leaf population drift: shared traversal produced [${expectedIds.join(", ")}], supplied population was [${actualIds.join(", ")}].`,
    );
  }
};

/**
 * Builds and reconciles the two question populations. The optional second
 * argument exists only to make denominator drift fail deterministically in
 * focused regressions and future call sites.
 */
export const analyzeCensusPopulations = (
  sessionQuestions: readonly Question[],
  suppliedScoredLeaves?: readonly StandaloneQuestion[],
): CensusPopulationAnalysis => {
  const expectedScoredLeaves = collectScoredLeaves(sessionQuestions);
  const scoredLeafQuestions = [...(suppliedScoredLeaves ?? expectedScoredLeaves)];
  assertSameIds(expectedScoredLeaves, scoredLeafQuestions);

  const caseContainers = sessionQuestions.filter((question) => question.itemType === "case_study").length;
  const standalone = sessionQuestions.length - caseContainers;
  const embeddedParts = sessionQuestions.reduce(
    (sum, question) => sum + (question.itemType === "case_study" ? question.caseStudy.questions.length : 0),
    0,
  );
  const scoredTotal = standalone + embeddedParts;
  const sessionCoverage = computeCoverage([...sessionQuestions]);
  const scoredCoverage = computeCoverage(scoredLeafQuestions, undefined, {
    itemTypePopulation: standaloneItemTypes,
  });

  const sessionReconciliations = [
    sessionCoverage.totalQuestions,
    sumCounts(sessionCoverage.byCategory),
    sumCounts(sessionCoverage.byItemType),
    sumCounts(sessionCoverage.byDifficulty),
  ];
  if (sessionReconciliations.some((count) => count !== sessionQuestions.length)) {
    throw new Error(
      `Session-unit reconciliation failed: totals=${sessionReconciliations.join(",")}, expected=${sessionQuestions.length}.`,
    );
  }

  const scoredReconciliations = [
    scoredCoverage.totalQuestions,
    sumCounts(scoredCoverage.byCategory),
    sumCounts(scoredCoverage.byItemType),
    sumCounts(scoredCoverage.byDifficulty),
  ];
  if (scoredTotal !== scoredLeafQuestions.length || scoredReconciliations.some((count) => count !== scoredTotal)) {
    throw new Error(
      `Scored-leaf reconciliation failed: totals=${scoredReconciliations.join(",")}, structural=${scoredTotal}.`,
    );
  }
  if (
    scoredCoverage.byItemType.some(([itemType]) => itemType === "case_study") ||
    scoredCoverage.underItemTypes.some(([itemType]) => itemType === "case_study")
  ) {
    throw new Error("Scored-leaf reconciliation failed: case_study entered a scored item-type distribution.");
  }
  if (sessionCoverage.totalEligible !== standalone) {
    throw new Error(
      `Session-unit delivery-capacity reconciliation failed: eligible=${sessionCoverage.totalEligible}, standalone=${standalone}.`,
    );
  }

  const analysis: CensusPopulationAnalysis = {
    sessionUnits: {
      total: sessionQuestions.length,
      standalone,
      caseContainers,
      embeddedParts,
      inventoryRecords: sessionQuestions.length + embeddedParts,
      coverage: sessionCoverage,
    },
    scoredLeaves: {
      total: scoredTotal,
      standalone,
      embedded: embeddedParts,
      questions: scoredLeafQuestions,
      coverage: scoredCoverage,
    },
  };
  assertCensusPopulationReconciliation(analysis);
  return analysis;
};

const topicConcentration = (questions: readonly Question[]): TopicConcentration => {
  const result: TopicConcentration = {};
  for (const category of categories) {
    const counts = new Map<string, number>();
    for (const question of questions.filter((candidate) => candidate.category === category)) {
      counts.set(question.topic, (counts.get(question.topic) ?? 0) + 1);
    }
    result[category] = {
      topTopics: [...counts.entries()]
        .sort(([leftTopic, leftCount], [rightTopic, rightCount]) =>
          rightCount - leftCount || leftTopic.localeCompare(rightTopic))
        .slice(0, 10)
        .map(([topic, count]) => ({ topic, count })),
    };
  }
  return result;
};

const checkDocsDrift = async (loadedFileBasenames: string[]): Promise<{ ok: boolean; findings: string[] }> => {
  const findings: string[] = [];
  const loadedFiles = new Set(loadedFileBasenames);
  const checkDoc = async (docPath: string) => {
    let text: string;
    try {
      text = await readFile(docPath, "utf8");
    } catch {
      return;
    }
    for (const name of new Set(text.match(/\b[\w-]+-canonical\.json\b/g) ?? [])) {
      if (!loadedFiles.has(name)) findings.push(`${basename(docPath)} references "${name}" but it is not in banks/`);
    }
  };
  await Promise.all([checkDoc("PROJECT-HISTORY.md"), checkDoc("BANK-REVIEW-LEDGER.md")]);
  return { ok: findings.length === 0, findings };
};

export const computeCensus = async (): Promise<CensusData> => {
  const files = await getBankFiles();
  const banks: Array<{ file: string; envelope: Awaited<ReturnType<typeof loadBank>> }> = [];
  for (const file of files) banks.push({ file, envelope: await loadBank(file) });

  const perFile: PerFileEntry[] = banks.map(({ file, envelope }) => {
    const schemaVersion = envelope.meta?.schemaVersion ?? null;
    const metaCount = envelope.meta?.count ?? null;
    const questionsLength = envelope.questions.length;
    return {
      file: basename(file),
      schemaVersion,
      metaCount,
      questionsLength,
      mismatch: metaCount !== null && metaCount !== questionsLength,
    };
  });
  const allQuestions: Question[] = banks.flatMap(({ envelope }) => envelope.questions);
  const populations = analyzeCensusPopulations(allQuestions);
  const sessionCoverage = populations.sessionUnits.coverage;
  const scoredCoverage = populations.scoredLeaves.coverage;

  const bySchemaVersion: Record<string, { questions: number; files: string[] }> = {};
  for (const entry of perFile) {
    const version = entry.schemaVersion ?? "unknown";
    if (!bySchemaVersion[version]) bySchemaVersion[version] = { questions: 0, files: [] };
    bySchemaVersion[version].questions += entry.questionsLength;
    bySchemaVersion[version].files.push(entry.file);
  }
  const bySourceFile = Object.fromEntries(perFile.map(({ file, questionsLength }) => [file, questionsLength]));

  const artifacts = collectVisualArtifacts(allQuestions);
  const visualKindCounts = new Map<string, number>();
  const visualIdsByKind = new Map<string, string[]>();
  const rhythmSubtypeCounts = new Map<string, number>();
  for (const { visual, ownerId } of artifacts) {
    visualKindCounts.set(visual.kind, (visualKindCounts.get(visual.kind) ?? 0) + 1);
    visualIdsByKind.set(visual.kind, [...(visualIdsByKind.get(visual.kind) ?? []), ownerId]);
    if (visual.kind === "rhythm_strip") {
      const rhythm = (visual as RhythmStripVisual).rhythm;
      rhythmSubtypeCounts.set(rhythm, (rhythmSubtypeCounts.get(rhythm) ?? 0) + 1);
    }
  }
  const allKinds = [...listVisualKinds()].sort();
  const byKind = Object.fromEntries(allKinds.map((kind) => [kind, visualKindCounts.get(kind) ?? 0]));
  const idsByKind = Object.fromEntries(
    allKinds.map((kind) => [kind, [...new Set(visualIdsByKind.get(kind) ?? [])].sort()]),
  );
  const rhythmSubtypes = Object.fromEntries(
    [...rhythmSubtypeCounts.entries()].sort(([left], [right]) => left.localeCompare(right)),
  );
  const artifactTotalFromKinds = Object.values(byKind).reduce((sum, count) => sum + count, 0);
  if (artifactTotalFromKinds !== artifacts.length || sessionCoverage.totalVisuals !== artifacts.length) {
    throw new Error(
      `Visual-artifact reconciliation failed: traversal=${artifacts.length}, kinds=${artifactTotalFromKinds}, coverage=${sessionCoverage.totalVisuals}.`,
    );
  }

  const caseStudies: CensusData["sessionUnits"]["caseStudies"] = [];
  for (const { file, envelope } of banks) {
    for (const question of envelope.questions) {
      if (question.itemType === "case_study") {
        caseStudies.push({
          id: question.id,
          topic: question.topic,
          parts: question.caseStudy.questions.length,
          bank: basename(file),
        });
      }
    }
  }

  const idToFiles = new Map<string, string[]>();
  for (const { file, envelope } of banks) {
    for (const { question } of collectQuestionPopulation(envelope)) {
      idToFiles.set(question.id, [...(idToFiles.get(question.id) ?? []), basename(file)]);
    }
  }
  const duplicates = [...idToFiles.entries()]
    .filter(([, recordFiles]) => recordFiles.length > 1)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([id, recordFiles]) => ({ id, files: recordFiles }));

  return {
    generatedAt: new Date().toISOString(),
    inputGitSha: getGitSha(),
    sessionUnits: {
      populationBasis: "top_level_session_units",
      total: populations.sessionUnits.total,
      standalone: populations.sessionUnits.standalone,
      caseContainers: populations.sessionUnits.caseContainers,
      embeddedParts: populations.sessionUnits.embeddedParts,
      inventoryRecords: populations.sessionUnits.inventoryRecords,
      perFile,
      byItemType: Object.fromEntries(sessionCoverage.byItemType),
      byCategory: Object.fromEntries(sessionCoverage.byCategory),
      withinCategory: topicConcentration(allQuestions),
      byDifficulty: Object.fromEntries(sessionCoverage.byDifficulty),
      deliveryCapacity: {
        requestedSessionSize: sessionCoverage.sessionSize,
        standaloneDrawEligible: sessionCoverage.totalEligible,
        insufficientForFullSession: sessionCoverage.insufficientForFullSession,
        byCategory: sessionCoverage.eligibleByCategory,
        requestedCategoryTargets: sessionCoverage.eligibleCategoryTargets,
        shortfalls: sessionCoverage.eligibilityShortfalls,
      },
      bySchemaVersion,
      bySourceFile,
      caseStudies,
    },
    scoredLeaves: {
      populationBasis: "standalone_top_level_plus_embedded_leaves",
      total: populations.scoredLeaves.total,
      standalone: populations.scoredLeaves.standalone,
      embedded: populations.scoredLeaves.embedded,
      byItemType: Object.fromEntries(scoredCoverage.byItemType),
      byCategory: Object.fromEntries(scoredCoverage.byCategory),
      withinCategory: topicConcentration(populations.scoredLeaves.questions),
      byDifficulty: Object.fromEntries(scoredCoverage.byDifficulty),
      targets: {
        categoryTargets: scoredCoverage.categoryTargets,
        itemTypeAverage: scoredCoverage.itemTypeAverage,
        underCategories: scoredCoverage.underCategories,
        overCategories: scoredCoverage.overCategories,
        underItemTypes: scoredCoverage.underItemTypes,
      },
      prioritizeTopics: scoredCoverage.prioritizeTopics,
      avoidTopics: scoredCoverage.avoidTopics,
    },
    visualArtifacts: {
      populationBasis: "recursive_visual_artifacts",
      total: artifacts.length,
      byKind,
      rhythmSubtypes,
      idsByKind,
    },
    idUniqueness: { duplicates },
    docsDrift: await checkDocsDrift(perFile.map(({ file }) => file)),
  };
};

const pushCountMap = (lines: string[], values: Record<string, number>) => {
  for (const [label, count] of Object.entries(values)) lines.push(`- ${label}: ${count}`);
};

const pushTopicConcentration = (lines: string[], values: TopicConcentration) => {
  for (const [category, detail] of Object.entries(values)) {
    const topics = detail.topTopics.map(({ topic, count }) => `${topic} (${count})`).join(", ") || "none";
    lines.push(`- ${category}: ${topics}`);
  }
};

export const renderCensus = (census: CensusData): string => {
  const lines: string[] = [
    "<!-- GENERATED by `npm run census`. Do not hand-edit. -->",
    "",
    "# NCLEX Bank Census",
    "",
    `Generated: ${census.generatedAt}`,
    `Input Git SHA: ${census.inputGitSha}`,
    "",
    "## Session-Unit Inventory and Delivery Capacity",
    "",
    "Population basis: top-level delivery units. Category, topic, item-type, and difficulty distributions in this section are inventory comparisons, not content-planning targets.",
    "",
    `- Total session units: ${census.sessionUnits.total}`,
    `- Standalone top-level supply: ${census.sessionUnits.standalone}`,
    `- Case-container supply: ${census.sessionUnits.caseContainers}`,
    `- Embedded-part inventory (not session units): ${census.sessionUnits.embeddedParts}`,
    `- Question-shaped inventory records: ${census.sessionUnits.inventoryRecords}`,
    "",
    "### Per-File Session-Unit Inventory",
    "",
    "| File | Schema | meta.count | Session Units | Mismatch |",
    "|------|--------|-----------|---------------|----------|",
  ];
  for (const entry of census.sessionUnits.perFile) {
    lines.push(`| ${entry.file} | ${entry.schemaVersion ?? "—"} | ${entry.metaCount ?? "—"} | ${entry.questionsLength} | ${entry.mismatch ? "YES" : "—"} |`);
  }
  lines.push("", "### Session-Unit Category Inventory", "");
  pushCountMap(lines, census.sessionUnits.byCategory);
  lines.push("", "### Session-Unit Topic Concentration", "");
  pushTopicConcentration(lines, census.sessionUnits.withinCategory);
  lines.push("", "### Session-Unit Item-Type Inventory", "");
  pushCountMap(lines, census.sessionUnits.byItemType);
  lines.push("", "`case_study` is a delivery container here, not a scored item type.", "", "### Session-Unit Difficulty Inventory", "");
  pushCountMap(lines, census.sessionUnits.byDifficulty);

  const capacity = census.sessionUnits.deliveryCapacity;
  lines.push(
    "",
    `### Standalone Draw Capacity (requested session size ${capacity.requestedSessionSize})`,
    "",
    `- Total standalone draw-eligible supply: ${capacity.standaloneDrawEligible}`,
    `- Full requested session constructible: ${capacity.insufficientForFullSession ? "no" : "yes"}`,
    "",
    "| Category | Standalone Supply | Requested Seats | Gap |",
    "|----------|------------------:|----------------:|----:|",
  );
  const capacityTargets = new Map(capacity.requestedCategoryTargets);
  for (const [category, count] of capacity.byCategory) {
    const target = capacityTargets.get(category) ?? 0;
    lines.push(`| ${category} | ${count} | ${target.toFixed(1)} | ${(count - target).toFixed(1)} |`);
  }
  lines.push("", "Operational shortfalls:");
  if (capacity.shortfalls.length === 0) lines.push("- none");
  for (const [category, gap] of capacity.shortfalls) lines.push(`- ${category}: short ${Math.abs(gap).toFixed(1)}`);

  lines.push("", "### Session-Unit Schema and Source Inventory", "");
  for (const [version, data] of Object.entries(census.sessionUnits.bySchemaVersion)) {
    lines.push(`- Schema v${version}: ${data.questions} session units (${data.files.join(", ")})`);
  }
  for (const [file, count] of Object.entries(census.sessionUnits.bySourceFile)) lines.push(`- ${file}: ${count}`);

  lines.push("", "### Case-Container Inventory", "");
  if (census.sessionUnits.caseStudies.length === 0) {
    lines.push("None.");
  } else {
    lines.push("| ID | Parent Topic | Embedded Parts | Bank |", "|----|--------------|---------------:|------|");
    for (const caseStudy of census.sessionUnits.caseStudies) {
      lines.push(`| ${caseStudy.id} | ${caseStudy.topic} | ${caseStudy.parts} | ${caseStudy.bank} |`);
    }
  }

  lines.push(
    "",
    "## Canonical Content-Planning Coverage — Scored Leaves",
    "",
    "Population basis: standalone top-level questions plus embedded case-study questions, excluding case containers. Each leaf contributes its own category, topic, item type, and difficulty. This is the authoritative planning lane.",
    "",
    `- Total scored leaves: ${census.scoredLeaves.total}`,
    `- Standalone scored leaves: ${census.scoredLeaves.standalone}`,
    `- Embedded scored leaves: ${census.scoredLeaves.embedded}`,
    "",
    "### Scored-Leaf Category Distribution",
    "",
  );
  pushCountMap(lines, census.scoredLeaves.byCategory);
  lines.push("", "### Scored-Leaf Topic Concentration", "");
  pushTopicConcentration(lines, census.scoredLeaves.withinCategory);
  lines.push("", "### Scored-Leaf Item-Type Distribution", "");
  pushCountMap(lines, census.scoredLeaves.byItemType);
  lines.push("", "### Scored-Leaf Difficulty Distribution", "");
  pushCountMap(lines, census.scoredLeaves.byDifficulty);

  const targets = census.scoredLeaves.targets;
  lines.push("", "### Targets", "", "Category targets (scored-leaf denominator):");
  for (const [category, target] of targets.categoryTargets) lines.push(`- ${category}: ${target.toFixed(1)}`);
  lines.push("", `Equal-average scored item-type target: ${targets.itemTypeAverage.toFixed(1)}`, "", "Under-served categories:");
  if (targets.underCategories.length === 0) lines.push("- none");
  for (const [category, count] of targets.underCategories) lines.push(`- ${category}: ${count}`);
  lines.push("", "Over-served categories:");
  if (targets.overCategories.length === 0) lines.push("- none");
  for (const [category, count] of targets.overCategories) lines.push(`- ${category}: ${count}`);
  lines.push("", "Under-served scored item types:");
  if (targets.underItemTypes.length === 0) lines.push("- none");
  for (const [itemType, count] of targets.underItemTypes) lines.push(`- ${itemType}: ${count}`);

  lines.push("", "### Prompt Parameters", "", "PRIORITIZE_TOPICS:");
  if (census.scoredLeaves.prioritizeTopics.length === 0) lines.push("- none");
  for (const item of census.scoredLeaves.prioritizeTopics) lines.push(`- ${item}`);
  lines.push("", "AVOID_TOPICS:");
  if (census.scoredLeaves.avoidTopics.length === 0) lines.push("- none");
  for (const item of census.scoredLeaves.avoidTopics) lines.push(`- ${item}`);

  lines.push(
    "",
    "## Recursive Visual Artifact Inventory",
    "",
    "Population basis: independent recursive traversal of question-level visuals, case exhibits, staged case exhibits, and embedded-leaf visuals. This section uses neither the session-unit nor scored-leaf denominator.",
    "",
    `Total visual artifacts: ${census.visualArtifacts.total}`,
    "",
    "### Visual Artifacts by Kind",
    "",
  );
  for (const [kind, count] of Object.entries(census.visualArtifacts.byKind)) {
    const ids = census.visualArtifacts.idsByKind[kind] ?? [];
    const owners = ids.length > 0 ? ` (${ids.slice(0, 5).join(", ")}${ids.length > 5 ? `, …+${ids.length - 5}` : ""})` : "";
    lines.push(`- ${kind}: ${count}${owners}`);
  }
  lines.push("", "### Rhythm Subtype Artifacts", "");
  if (Object.keys(census.visualArtifacts.rhythmSubtypes).length === 0) lines.push("- none");
  for (const [rhythm, count] of Object.entries(census.visualArtifacts.rhythmSubtypes)) lines.push(`- ${rhythm}: ${count}`);

  lines.push("", "## Integrity and Documentation Checks", "", "### ID Uniqueness", "");
  if (census.idUniqueness.duplicates.length === 0) lines.push("No duplicates detected.");
  for (const duplicate of census.idUniqueness.duplicates) lines.push(`- \`${duplicate.id}\`: ${duplicate.files.join(", ")}`);
  lines.push("", "### Docs Drift", "");
  if (census.docsDrift.ok) lines.push("All canonical-bank references in checked project docs match the bank directory.");
  for (const finding of census.docsDrift.findings) lines.push(`- ${finding}`);
  lines.push("");

  return lines.join("\n");
};

const stripVolatile = ({ generatedAt: _generatedAt, inputGitSha: _inputGitSha, ...stable }: CensusData) => stable;

const checkDrift = async (): Promise<void> => {
  let committed: CensusData;
  try {
    committed = JSON.parse(await readFile("census.json", "utf8")) as CensusData;
  } catch {
    console.error("census.json not found — run `npm run census` to generate it first.");
    process.exit(1);
  }
  const fresh = await computeCensus();
  const committedText = JSON.stringify(stripVolatile(committed), null, 2);
  const freshText = JSON.stringify(stripVolatile(fresh), null, 2);
  if (committedText === freshText) {
    console.log("census.json is up to date.");
    return;
  }
  console.error("census.json is stale. Run `npm run census` to regenerate.");
  const committedLines = committedText.split("\n");
  const freshLines = freshText.split("\n");
  let shown = 0;
  let total = 0;
  for (let index = 0; index < Math.max(committedLines.length, freshLines.length); index += 1) {
    if ((committedLines[index] ?? "") === (freshLines[index] ?? "")) continue;
    total += 1;
    if (shown < 20) {
      console.error(`  line ${index + 1} - ${committedLines[index] ?? ""}`);
      console.error(`  line ${index + 1} + ${freshLines[index] ?? ""}`);
      shown += 1;
    }
  }
  if (total > shown) console.error(`  … and ${total - shown} more differences`);
  process.exit(1);
};

const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  if (process.argv.includes("--check")) {
    await checkDrift();
  } else {
    const census = await computeCensus();
    await writeFile("census.json", `${JSON.stringify(census, null, 2)}\n`, "utf8");
    await writeFile("BANK-CENSUS.md", renderCensus(census), "utf8");
    console.log("Census written to census.json and BANK-CENSUS.md");
    console.log(
      `  ${census.sessionUnits.total} session units, ${census.scoredLeaves.total} scored leaves, ${census.visualArtifacts.total} visual artifacts`,
    );
    if (census.idUniqueness.duplicates.length > 0) {
      console.warn(`  ${census.idUniqueness.duplicates.length} ID collision(s) detected`);
    }
  }
}
