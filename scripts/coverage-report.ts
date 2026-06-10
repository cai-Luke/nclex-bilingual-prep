import { readFile, readdir } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBankText } from "../src/bankImport";
import { categories, difficulties, itemTypes, rhythmClasses, validateBankObject } from "../src/schema";
import { listVisualKinds } from "../src/visuals/registry";
import type { Question, QuestionVisual, RhythmStripVisual } from "../src/types";

export type TopicBucket = {
  label: string;
  count: number;
  categories: string[];
  itemTypes: string[];
};

export type CoverageData = {
  totalQuestions: number;
  byCategory: [string, number][];
  byItemType: [string, number][];
  byDifficulty: [string, number][];
  byVisualKind: [string, number][];
  totalVisuals: number;
  byRhythmClass: [string, number][];
  topics: TopicBucket[];
  categoryAverage: number;
  itemTypeAverage: number;
  underCategories: [string, number][];
  overCategories: [string, number][];
  underItemTypes: [string, number][];
  lowTopics: TopicBucket[];
  overTopics: TopicBucket[];
  prioritizeTopics: string[];
  avoidTopics: string[];
};

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

const formatCountRows = (rows: readonly (readonly [string, number])[]) =>
  rows.map(([label, count]) => `- ${label}: ${count}`).join("\n");

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

export const computeCoverage = (questions: Question[]): CoverageData => {
  const categoryCounts = new Map<Question["category"], number>();
  const itemTypeCounts = new Map<Question["itemType"], number>();
  const difficultyCounts = new Map<Question["difficulty"], number>();
  const topicsMap = new Map<string, { label: string; count: number; categories: Set<string>; itemTypes: Set<string> }>();
  const visualCounts = new Map<string, number>();
  const rhythmVisualCounts = new Map<RhythmStripVisual["rhythm"], number>();

  for (const question of questions) {
    increment(categoryCounts, question.category);
    increment(itemTypeCounts, question.itemType);
    increment(difficultyCounts, question.difficulty);
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
    };
    bucket.count += 1;
    bucket.categories.add(question.category);
    bucket.itemTypes.add(question.itemType);
    topicsMap.set(normalized, bucket);
  }

  const topicRows: TopicBucket[] = Array.from(topicsMap.values())
    .sort((a, b) => a.count - b.count || a.label.localeCompare(b.label))
    .map((b) => ({ label: b.label, count: b.count, categories: [...b.categories].sort(), itemTypes: [...b.itemTypes].sort() }));

  const overTopics = [...topicRows].reverse().filter((t) => t.count > 1).slice(0, 8);
  const categoryAverage = questions.length / categories.length;
  const itemTypeAverage = questions.length / itemTypes.length;
  const sortedCategoryRows = sortedCounts(categories, categoryCounts);
  const sortedItemTypeRows = sortedCounts(itemTypes, itemTypeCounts);
  const underCategories = sortedCategoryRows.filter(([, c]) => c < categoryAverage);
  const overCategories = sortedCategoryRows.filter(([, c]) => c > categoryAverage).reverse();
  const underItemTypes = sortedItemTypeRows.filter(([, c]) => c < itemTypeAverage);
  const lowTopics = topicRows.slice(0, 12);

  const totalVisuals = Array.from(visualCounts.values()).reduce((sum, n) => sum + n, 0);

  const byVisualKind: [string, number][] = [...listVisualKinds()]
    .sort()
    .map((kind) => [kind, visualCounts.get(kind) ?? 0]);

  const prioritizeTopics = [
    ...underCategories.map(([cat, cnt]) => `${cat} (${cnt} vs target ${categoryAverage.toFixed(1)})`),
    ...underItemTypes.map(([it, cnt]) => `${it} (${cnt} vs target ${itemTypeAverage.toFixed(1)})`),
    ...lowTopics.map((t) => t.label),
  ].slice(0, 24);

  const avoidTopics = overTopics.map((t) => `${t.label} (${t.count})`);

  return {
    totalQuestions: questions.length,
    byCategory: sortedCategoryRows,
    byItemType: sortedItemTypeRows,
    byDifficulty: sortedCounts(difficulties, difficultyCounts),
    byVisualKind,
    totalVisuals,
    byRhythmClass: sortedCounts(rhythmClasses, rhythmVisualCounts),
    topics: topicRows,
    categoryAverage,
    itemTypeAverage,
    underCategories,
    overCategories,
    underItemTypes,
    lowTopics,
    overTopics,
    prioritizeTopics,
    avoidTopics,
  };
};

// --- File loading (CLI only) ---

const getBankFiles = async () => {
  const bankFiles = await readdir("banks").then((files) =>
    files
      .filter((file) => file.endsWith(".json"))
      .sort()
      .map((file) => join("banks", file)),
  );
  const extraFiles = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
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
  const files = await getBankFiles();
  const questions: Question[] = [];
  for (const file of files) {
    questions.push(...(await readQuestions(file)));
  }

  const coverage = computeCoverage(questions);

  console.log(`# NCLEX Bank Coverage Report`);
  console.log("");
  console.log(`Files scanned: ${files.map((file) => basename(file)).join(", ")}`);
  console.log(`Total questions: ${coverage.totalQuestions}`);
  console.log(`Unique normalized topics: ${coverage.topics.length}`);
  console.log("");
  console.log("## Category Counts");
  console.log(formatCountRows(coverage.byCategory));
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
