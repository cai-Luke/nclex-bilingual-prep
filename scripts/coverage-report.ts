import { readFile, readdir } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBankText } from "../src/bankImport";
import {
  categories,
  difficulties,
  itemTypes,
  NCLEX_CATEGORY_WEIGHTS,
  rhythmClasses,
  standaloneItemTypes,
  validateBankObject,
} from "../src/schema";
import { listVisualKinds } from "../src/visuals/registry";
import type { Category, Question, QuestionVisual, RhythmStripVisual } from "../src/types";

export type TopicBucket = {
  label: string;
  count: number;
  categories: string[];
  itemTypes: string[];
  itemTypeCounts: [string, number][];
};

export type BackfillTopic = {
  label: string;
  categories: string[];
  mcCount: number;
  missingTypes: string[];
};

export type BackfillCategory = {
  category: string;
  overTarget: number;
  lowTypes: [string, number][];
};

export type CoverageData = {
  totalQuestions: number;
  sessionSize: number;
  totalEligible: number;
  insufficientForFullSession: boolean;
  byCategory: [string, number][];
  byItemType: [string, number][];
  byDifficulty: [string, number][];
  byVisualKind: [string, number][];
  totalVisuals: number;
  byRhythmClass: [string, number][];
  topics: TopicBucket[];
  categoryTargets: [string, number][];
  eligibleByCategory: [string, number][];
  eligibleCategoryTargets: [string, number][];
  eligibilityShortfalls: [string, number][];
  categoryItemTypeCounts: [string, [string, number][]][];
  itemTypeAverage: number;
  underCategories: [string, number][];
  overCategories: [string, number][];
  underItemTypes: [string, number][];
  lowTopics: TopicBucket[];
  overTopics: TopicBucket[];
  backfillTopics: BackfillTopic[];
  backfillCategories: BackfillCategory[];
  prioritizeTopics: string[];
  avoidTopics: string[];
};

export const SESSION_SIZE = 50; // default weighted-session size; matches the app's default 50-Q session.
export const MC_HEAVY_FLOOR = 3;
// Topic MC count at/above which an NGN-light topic is a backfill target.
export const BACKFILL_TYPE_FLOOR = 2;
// Category-level advisory cutoff: counts below this are low/absent.
export const BACKFILL_TYPES = (standaloneItemTypes as readonly string[]).filter(
  (type) => type !== "multiple_choice" && type !== "case_study",
);

const increment = <K extends string>(counts: Map<K, number>, key: K) => {
  counts.set(key, (counts.get(key) ?? 0) + 1);
};

export const normalizeTopic = (topic: string) =>
  topic
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const sortedCounts = <K extends string>(keys: readonly K[], counts: Map<K, number>): [string, number][] =>
  keys.map((key) => [key, counts.get(key) ?? 0] as [string, number]).sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));

const orderedCounts = <K extends string>(keys: readonly K[], counts: Map<K, number>): [string, number][] =>
  keys.map((key) => [key, counts.get(key) ?? 0] as [string, number]);

const formatCountRows = (rows: readonly (readonly [string, number])[]) =>
  rows.map(([label, count]) => `- ${label}: ${count}`).join("\n");

const formatCategoryRows = (
  rows: readonly (readonly [string, number])[],
  targets: readonly (readonly [string, number])[],
) => {
  const targetsByCategory = new Map(targets);
  return rows
    .map(([label, count]) => {
      const target = targetsByCategory.get(label) ?? 0;
      const gap = count - target;
      return `- ${label}: ${count} (target ${target.toFixed(0)}, gap ${gap >= 0 ? "+" : ""}${gap.toFixed(0)})`;
    })
    .join("\n");
};

const formatEligibleRows = (coverage: CoverageData) => {
  const targetsByCategory = new Map(coverage.eligibleCategoryTargets);
  const rows = coverage.eligibleByCategory
    .map(([category, count]) => {
      const target = targetsByCategory.get(category) ?? 0;
      const gap = count - target;
      return `- ${category}: eligible ${count} (requested target ${target.toFixed(1)}, gap ${gap >= 0 ? "+" : ""}${gap.toFixed(1)})`;
    })
    .join("\n");
  const shortfalls =
    coverage.eligibilityShortfalls.length > 0
      ? coverage.eligibilityShortfalls
          .map(([category, gap]) => {
            const count = coverage.eligibleByCategory.find(([label]) => label === category)?.[1] ?? 0;
            const target = targetsByCategory.get(category) ?? 0;
            return `- ${category}: eligible ${count} vs target ${target.toFixed(1)} (short ${gap.toFixed(1)})`;
          })
          .join("\n")
      : "- none";
  const note = coverage.insufficientForFullSession
    ? `NOTE: fewer than ${coverage.sessionSize} eligible items bank-wide - a full weighted session cannot be drawn yet.\n`
    : "";
  return [
    `Total eligible (non-case_study): ${coverage.totalEligible}`,
    `${note}${rows}`,
    "Shortfalls (under requested target - these under-deliver and donate seats to other categories):",
    shortfalls,
    `Targets are the requested ${coverage.sessionSize}-Q adequacy yardstick (weight x ${coverage.sessionSize}); the sampler's realized allocation caps at eligible.length per category.`,
  ].join("\n");
};

const formatBackfillRows = (coverage: CoverageData) => {
  const shortfallCategories = new Set(coverage.eligibilityShortfalls.map(([category]) => category));
  const categoryRows =
    coverage.backfillCategories.length > 0
      ? coverage.backfillCategories
          .map((entry) => {
            const alsoShort = shortfallCategories.has(entry.category) ? "; also eligible-short" : "";
            const lowTypes = entry.lowTypes.map(([type, count]) => `${type} (${count})`).join(", ");
            return `- ${entry.category} (over target by ${entry.overTarget.toFixed(1)}${alsoShort}): low/absent: ${lowTypes}`;
          })
          .join("\n")
      : "- none";
  const topicRows =
    coverage.backfillTopics.length > 0
      ? coverage.backfillTopics
          .map(
            (entry) =>
              `- ${entry.label} [${entry.categories.join(", ")}]: MC x${entry.mcCount}, missing: ${entry.missingTypes.join(", ")}`,
          )
          .join("\n")
      : "- none";
  return [
    "Over-served categories missing newer item types (raw count basis):",
    categoryRows,
    "",
    "MC-heavy topics missing newer item types (carved out of AVOID):",
    topicRows,
  ].join("\n");
};

export const collectVisuals = (question: Question): QuestionVisual[] => {
  const visuals: QuestionVisual[] = [];
  if (question.visual) visuals.push(question.visual);
  if (question.itemType === "case_study") {
    question.caseStudy.exhibits.forEach((exhibit) => {
      if (exhibit.visual) visuals.push(exhibit.visual);
    });
    question.caseStudy.stages?.forEach((stage) => {
      stage.exhibits.forEach((exhibit) => {
        if (exhibit.visual) visuals.push(exhibit.visual);
      });
    });
    question.caseStudy.questions.forEach((caseQuestion) => {
      if (caseQuestion.visual) visuals.push(caseQuestion.visual);
    });
  }
  return visuals;
};

const itemTypeCount = (rows: readonly (readonly [string, number])[], itemType: string) =>
  rows.find(([type]) => type === itemType)?.[1] ?? 0;

export const isBackfillTopic = (bucket: TopicBucket) =>
  itemTypeCount(bucket.itemTypeCounts, "multiple_choice") >= MC_HEAVY_FLOOR &&
  BACKFILL_TYPES.some((type) => itemTypeCount(bucket.itemTypeCounts, type) === 0);

export const parseSessionSize = (argv: string[]): number => {
  const raw = argv.find((arg) => arg.startsWith("--session-size="))?.split("=", 2)[1];
  const parsed = raw === undefined ? Number.NaN : Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : SESSION_SIZE;
};

export const computeCoverage = (questions: Question[], sessionSize = SESSION_SIZE): CoverageData => {
  const categoryCounts = new Map<Question["category"], number>();
  const eligibleCategoryCounts = new Map<Question["category"], number>();
  const itemTypeCounts = new Map<Question["itemType"], number>();
  const difficultyCounts = new Map<Question["difficulty"], number>();
  const categoryItemTypeMaps = new Map<string, Map<string, number>>();
  const topicsMap = new Map<
    string,
    { label: string; count: number; categories: Set<string>; itemTypes: Set<string>; itemTypeCounts: Map<string, number> }
  >();
  const visualCounts = new Map<string, number>();
  const rhythmVisualCounts = new Map<RhythmStripVisual["rhythm"], number>();
  let totalEligible = 0;

  for (const question of questions) {
    increment(categoryCounts, question.category);
    increment(itemTypeCounts, question.itemType);
    increment(difficultyCounts, question.difficulty);
    const categoryItemTypeCounts = categoryItemTypeMaps.get(question.category) ?? new Map<string, number>();
    increment(categoryItemTypeCounts, question.itemType);
    categoryItemTypeMaps.set(question.category, categoryItemTypeCounts);
    if (question.itemType !== "case_study") {
      increment(eligibleCategoryCounts, question.category);
      totalEligible += 1;
    }
    collectVisuals(question).forEach((visual) => {
      increment(visualCounts, visual.kind);
      if (visual.kind === "rhythm_strip") {
        increment(rhythmVisualCounts, (visual as RhythmStripVisual).rhythm);
      }
    });

    const normalized = normalizeTopic(question.topic);
    const bucket = topicsMap.get(normalized) ?? {
      label: question.topic,
      count: 0,
      categories: new Set<string>(),
      itemTypes: new Set<string>(),
      itemTypeCounts: new Map<string, number>(),
    };
    bucket.count += 1;
    bucket.categories.add(question.category);
    bucket.itemTypes.add(question.itemType);
    increment(bucket.itemTypeCounts, question.itemType);
    topicsMap.set(normalized, bucket);
  }

  const topicRows: TopicBucket[] = Array.from(topicsMap.values())
    .sort((a, b) => a.count - b.count || a.label.localeCompare(b.label))
    .map((b) => ({
      label: b.label,
      count: b.count,
      categories: [...b.categories].sort(),
      itemTypes: [...b.itemTypes].sort(),
      itemTypeCounts: orderedCounts(itemTypes, b.itemTypeCounts),
    }));

  const overTopics = [...topicRows].reverse().filter((t) => t.count > 1).slice(0, 8);
  const itemTypeAverage = questions.length / itemTypes.length;
  const sortedCategoryRows = sortedCounts(categories, categoryCounts);
  const sortedItemTypeRows = sortedCounts(itemTypes, itemTypeCounts);
  const eligibleByCategory = orderedCounts(categories, eligibleCategoryCounts);
  const eligibleCategoryTargets: [string, number][] = categories.map((category) => [
    category,
    NCLEX_CATEGORY_WEIGHTS[category] * sessionSize,
  ]);
  const eligibleTargetsByCategory = new Map(eligibleCategoryTargets);
  const eligibilityShortfalls = eligibleByCategory
    .map(([category, count]) => [category, count - (eligibleTargetsByCategory.get(category) ?? 0)] as [string, number])
    .filter(([, gap]) => gap < 0)
    .sort((left, right) => left[1] - right[1] || left[0].localeCompare(right[0]));
  const categoryItemTypeCounts: [string, [string, number][]][] = categories.map((category) => [
    category,
    orderedCounts(itemTypes, categoryItemTypeMaps.get(category) ?? new Map<string, number>()),
  ]);

  // Category targets follow the same 2026 NCLEX-RN test-plan weights as the
  // study sampler. Only counts outside NCSBN's +/-3 percentage-point band flag.
  const tolerancePercentagePoints = 0.03;
  const band = tolerancePercentagePoints * questions.length;
  const categoryTarget = (category: string) => {
    const weight = NCLEX_CATEGORY_WEIGHTS[category as Category];
    if (weight === undefined) {
      throw new Error(`Missing NCLEX category weight for "${category}"`);
    }
    return weight * questions.length;
  };
  const categoryGap = (category: string, count: number) => count - categoryTarget(category);
  const categoryTargets: [string, number][] = categories.map((category) => [
    category,
    categoryTarget(category),
  ]);
  const underCategories = sortedCategoryRows
    .filter(([category, count]) => count < categoryTarget(category) - band)
    .sort((left, right) => categoryGap(left[0], left[1]) - categoryGap(right[0], right[1]));
  const overCategories = sortedCategoryRows
    .filter(([category, count]) => count > categoryTarget(category) + band)
    .sort((left, right) => categoryGap(right[0], right[1]) - categoryGap(left[0], left[1]));
  const underItemTypes = sortedItemTypeRows.filter(([, c]) => c < itemTypeAverage);
  const lowTopics = topicRows.slice(0, 12);
  const backfillTopics: BackfillTopic[] = topicRows
    .filter(isBackfillTopic)
    .map((topic) => ({
      label: topic.label,
      categories: topic.categories,
      mcCount: itemTypeCount(topic.itemTypeCounts, "multiple_choice"),
      missingTypes: BACKFILL_TYPES.filter((type) => itemTypeCount(topic.itemTypeCounts, type) === 0),
    }))
    .sort((left, right) => right.mcCount - left.mcCount || left.label.localeCompare(right.label));
  const categoryItemTypesByCategory = new Map(categoryItemTypeCounts);
  const backfillCategories: BackfillCategory[] = overCategories
    .map(([category, count]) => {
      const rows = categoryItemTypesByCategory.get(category) ?? [];
      return {
        category,
        overTarget: categoryGap(category, count),
        lowTypes: BACKFILL_TYPES.map((type) => [type, itemTypeCount(rows, type)] as [string, number]).filter(
          ([, countForType]) => countForType < BACKFILL_TYPE_FLOOR,
        ),
      };
    })
    .filter((entry) => entry.lowTypes.length > 0);

  const totalVisuals = Array.from(visualCounts.values()).reduce((sum, n) => sum + n, 0);

  const byVisualKind: [string, number][] = [...listVisualKinds()]
    .sort()
    .map((kind) => [kind, visualCounts.get(kind) ?? 0]);

  const prioritizeTopics = [
    ...backfillTopics.map((topic) => `${topic.label} — add: ${topic.missingTypes.join(", ")}`),
    ...underCategories.map(([cat, cnt]) => `${cat} (${cnt} vs target ${categoryTarget(cat).toFixed(0)})`),
    ...underItemTypes.map(([it, cnt]) => `${it} (${cnt} vs target ${itemTypeAverage.toFixed(1)})`),
    ...lowTopics.map((t) => t.label),
  ].slice(0, 32);

  const avoidTopics = overTopics.filter((topic) => !isBackfillTopic(topic)).map((t) => `${t.label} (${t.count})`);

  return {
    totalQuestions: questions.length,
    sessionSize,
    totalEligible,
    insufficientForFullSession: totalEligible < sessionSize,
    byCategory: sortedCategoryRows,
    byItemType: sortedItemTypeRows,
    byDifficulty: sortedCounts(difficulties, difficultyCounts),
    byVisualKind,
    totalVisuals,
    byRhythmClass: sortedCounts(rhythmClasses, rhythmVisualCounts),
    topics: topicRows,
    categoryTargets,
    eligibleByCategory,
    eligibleCategoryTargets,
    eligibilityShortfalls,
    categoryItemTypeCounts,
    itemTypeAverage,
    underCategories,
    overCategories,
    underItemTypes,
    lowTopics,
    overTopics,
    backfillTopics,
    backfillCategories,
    prioritizeTopics,
    avoidTopics,
  };
};

// --- File loading (CLI only) ---

const getBankFiles = async (argv = process.argv.slice(2)) => {
  const bankFiles = await readdir("banks").then((files) =>
    files
      .filter((file) => file.endsWith(".json"))
      .sort()
      .map((file) => join("banks", file)),
  );
  const extraFiles = argv.filter((arg) => !arg.startsWith("--"));
  return Array.from(new Set([...bankFiles, ...extraFiles])).map((file) => resolve(file));
};

const readQuestions = async (file: string) => {
  const text = await readFile(file, "utf8");
  const raw = parseBankText(text);
  const result = validateBankObject(raw);
  if (!result.ok) {
    throw new Error(`${basename(file)} failed validation:\n${result.reasons.map((reason) => `- ${reason}`).join("\n")}`);
  }
  return result.value.questions;
};

// --- CLI entry point (only runs when executed directly, not when imported) ---

const runCli = async () => {
  const argv = process.argv.slice(2);
  const files = await getBankFiles(argv);
  const questions: Question[] = [];
  for (const file of files) {
    questions.push(...(await readQuestions(file)));
  }

  const coverage = computeCoverage(questions, parseSessionSize(argv));

  console.log(`# NCLEX Bank Coverage Report`);
  console.log("");
  console.log(`Files scanned: ${files.map((file) => basename(file)).join(", ")}`);
  console.log(`Total questions: ${coverage.totalQuestions}`);
  console.log(`Unique normalized topics: ${coverage.topics.length}`);
  console.log("");
  console.log("## Category Counts");
  console.log(formatCategoryRows(coverage.byCategory, coverage.categoryTargets));
  console.log("");
  console.log(`## Draw-Eligible Capacity per Category (requested session size ${coverage.sessionSize})`);
  console.log(formatEligibleRows(coverage));
  console.log("");
  console.log("## Item Type Counts");
  console.log(formatCountRows(coverage.byItemType));
  console.log("");
  console.log("## Difficulty Counts");
  console.log(formatCountRows(coverage.byDifficulty));
  console.log("");
  console.log("## Visual Counts");
  console.log(`Total visuals: ${coverage.totalVisuals}`);
  console.log(formatCountRows(coverage.byVisualKind));
  console.log("");
  console.log("## Rhythm Strip Counts");
  console.log(formatCountRows(coverage.byRhythmClass));
  console.log("");
  console.log("## Lowest-Covered Topics");
  console.log(
    coverage.lowTopics
      .map((topic) => `- ${topic.label}: ${topic.count} (${topic.categories.join(", ")}; ${topic.itemTypes.join(", ")})`)
      .join("\n"),
  );
  console.log("");
  console.log("## Format Backfill Opportunities");
  console.log(formatBackfillRows(coverage));
  console.log("");
  console.log("## Prompt Parameters");
  console.log("PRIORITIZE_TOPICS:");
  console.log(coverage.prioritizeTopics.map((item) => `- ${item}`).join("\n"));
  console.log("");
  console.log("AVOID_TOPICS:");
  console.log(coverage.avoidTopics.length > 0 ? coverage.avoidTopics.map((item) => `- ${item}`).join("\n") : "- none");
};

if (fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await runCli();
}
