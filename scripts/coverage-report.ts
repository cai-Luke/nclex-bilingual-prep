import { readFile, readdir } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { parseBankText } from "../src/bankImport";
import { categories, difficulties, itemTypes, rhythmClasses, validateBankObject } from "../src/schema";
import type { Question, RhythmStripVisual } from "../src/types";

type TopicBucket = {
  label: string;
  count: number;
  categories: Set<string>;
  itemTypes: Set<string>;
};

const increment = <K extends string>(counts: Map<K, number>, key: K) => {
  counts.set(key, (counts.get(key) ?? 0) + 1);
};

const normalizeTopic = (topic: string) =>
  topic
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const sortedCounts = <K extends string>(keys: readonly K[], counts: Map<K, number>) =>
  keys.map((key) => [key, counts.get(key) ?? 0] as const).sort((left, right) => left[1] - right[1] || left[0].localeCompare(right[0]));

const formatCountRows = (rows: readonly (readonly [string, number])[]) =>
  rows.map(([label, count]) => `- ${label}: ${count}`).join("\n");

const getBankFiles = async () => {
  const bankFiles = await readdir("banks").then((files) =>
    files.filter((file) => file.endsWith(".json")).map((file) => join("banks", file)),
  );
  const extraFiles = process.argv.slice(2);
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

const files = await getBankFiles();
const questions: Question[] = [];

for (const file of files) {
  questions.push(...(await readQuestions(file)));
}

const categoryCounts = new Map<Question["category"], number>();
const itemTypeCounts = new Map<Question["itemType"], number>();
const difficultyCounts = new Map<Question["difficulty"], number>();
const topics = new Map<string, TopicBucket>();
const visualCounts = new Map<string, number>();
const rhythmVisualCounts = new Map<RhythmStripVisual["rhythm"], number>();

const collectRhythmVisuals = (question: Question) => {
  const visuals: RhythmStripVisual[] = [];
  if (question.visual?.kind === "rhythm_strip") visuals.push(question.visual);
  if (question.itemType === "case_study") {
    question.caseStudy.exhibits.forEach((exhibit) => {
      if (exhibit.visual?.kind === "rhythm_strip") visuals.push(exhibit.visual);
    });
    question.caseStudy.stages?.forEach((stage) => {
      stage.exhibits.forEach((exhibit) => {
        if (exhibit.visual?.kind === "rhythm_strip") visuals.push(exhibit.visual);
      });
    });
    question.caseStudy.questions.forEach((caseQuestion) => {
      if (caseQuestion.visual?.kind === "rhythm_strip") visuals.push(caseQuestion.visual);
    });
  }
  return visuals;
};

for (const question of questions) {
  increment(categoryCounts, question.category);
  increment(itemTypeCounts, question.itemType);
  increment(difficultyCounts, question.difficulty);
  collectRhythmVisuals(question).forEach((visual) => {
    increment(visualCounts, visual.kind);
    increment(rhythmVisualCounts, visual.rhythm);
  });

  const normalized = normalizeTopic(question.topic);
  const bucket = topics.get(normalized) ?? {
    label: question.topic,
    count: 0,
    categories: new Set<string>(),
    itemTypes: new Set<string>(),
  };
  bucket.count += 1;
  bucket.categories.add(question.category);
  bucket.itemTypes.add(question.itemType);
  topics.set(normalized, bucket);
}

const topicRows = Array.from(topics.values()).sort((left, right) => left.count - right.count || left.label.localeCompare(right.label));
const overCoveredTopics = [...topicRows].reverse().filter((topic) => topic.count > 1).slice(0, 8);
const categoryAverage = questions.length / categories.length;
const itemTypeAverage = questions.length / itemTypes.length;
const underCoveredCategories = sortedCounts(categories, categoryCounts).filter(([, count]) => count < categoryAverage);
const underCoveredItemTypes = sortedCounts(itemTypes, itemTypeCounts).filter(([, count]) => count < itemTypeAverage);
const lowTopics = topicRows.slice(0, 12);

console.log(`# NCLEX Bank Coverage Report`);
console.log("");
console.log(`Files scanned: ${files.map((file) => basename(file)).join(", ")}`);
console.log(`Total questions: ${questions.length}`);
console.log(`Unique normalized topics: ${topics.size}`);
console.log("");
console.log("## Category Counts");
console.log(formatCountRows(sortedCounts(categories, categoryCounts)));
console.log("");
console.log("## Item Type Counts");
console.log(formatCountRows(sortedCounts(itemTypes, itemTypeCounts)));
console.log("");
console.log("## Difficulty Counts");
console.log(formatCountRows(sortedCounts(difficulties, difficultyCounts)));
console.log("");
console.log("## Visual Counts");
const totalVisuals = Array.from(visualCounts.values()).reduce((sum, count) => sum + count, 0);
console.log(`Total visuals: ${totalVisuals}`);
console.log(formatCountRows([["rhythm_strip", visualCounts.get("rhythm_strip") ?? 0]]));
console.log("");
console.log("## Rhythm Strip Counts");
console.log(formatCountRows(sortedCounts(rhythmClasses, rhythmVisualCounts)));
console.log("");
console.log("## Lowest-Covered Topics");
console.log(
  lowTopics
    .map(
      (topic) =>
        `- ${topic.label}: ${topic.count} (${Array.from(topic.categories).join(", ")}; ${Array.from(topic.itemTypes).join(", ")})`,
    )
    .join("\n"),
);
console.log("");
console.log("## Prompt Parameters");
console.log("PRIORITIZE_TOPICS:");
console.log(
  [
    ...underCoveredCategories.map(([category, count]) => `${category} (${count} vs target ${categoryAverage.toFixed(1)})`),
    ...underCoveredItemTypes.map(([itemType, count]) => `${itemType} (${count} vs target ${itemTypeAverage.toFixed(1)})`),
    ...lowTopics.map((topic) => topic.label),
  ]
    .slice(0, 24)
    .map((item) => `- ${item}`)
    .join("\n"),
);
console.log("");
console.log("AVOID_TOPICS:");
console.log(overCoveredTopics.length > 0 ? overCoveredTopics.map((topic) => `- ${topic.label} (${topic.count})`).join("\n") : "- none");
