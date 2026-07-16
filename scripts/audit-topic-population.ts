import { execSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { collectQuestionPopulation, type QuestionPopulationKind } from "../lib/question-population";
import { getBankFiles, loadBank } from "./census";

type LocatedRecord = {
  id: string;
  file: string;
  path: string;
  kind: QuestionPopulationKind;
  parentId: string | null;
  category: string;
  topic: string;
  itemType: string;
};

export type SemanticResidualRow = {
  id: string;
  disposition: "include" | "exclude";
  reason: string;
};

export type SemanticResidualReview = {
  topic: string;
  reviewedAt: string;
  reviewer: string;
  method: "human_semantic_review";
  records: SemanticResidualRow[];
};

const argValue = (argv: string[], name: string): string | undefined => {
  const inline = argv.find((arg) => arg.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : undefined;
};

const gitSha = (): string => {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
};

const validateReview = (raw: unknown, topic: string): SemanticResidualReview => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Semantic residual review must be an object.");
  const review = raw as Partial<SemanticResidualReview>;
  if (review.topic !== topic) throw new Error(`Semantic residual review topic must be exactly "${topic}".`);
  if (review.method !== "human_semantic_review") throw new Error("Semantic residual review method must be human_semantic_review.");
  if (typeof review.reviewedAt !== "string" || !review.reviewedAt) throw new Error("Semantic residual review requires reviewedAt.");
  if (typeof review.reviewer !== "string" || !review.reviewer) throw new Error("Semantic residual review requires reviewer.");
  if (!Array.isArray(review.records)) throw new Error("Semantic residual review requires records[].");
  const seen = new Set<string>();
  for (const [index, row] of review.records.entries()) {
    if (!row || typeof row !== "object") throw new Error(`Semantic residual row ${index + 1} must be an object.`);
    if (typeof row.id !== "string" || !row.id) throw new Error(`Semantic residual row ${index + 1} requires id.`);
    if (seen.has(row.id)) throw new Error(`Duplicate semantic residual id: ${row.id}`);
    seen.add(row.id);
    if (row.disposition !== "include" && row.disposition !== "exclude") {
      throw new Error(`Semantic residual row ${row.id} requires include or exclude disposition.`);
    }
    if (typeof row.reason !== "string" || !row.reason.trim()) throw new Error(`Semantic residual row ${row.id} requires reason.`);
  }
  return review as SemanticResidualReview;
};

export const buildTopicPopulation = (
  records: LocatedRecord[],
  topic: string,
  review: SemanticResidualReview,
) => {
  const byId = new Map<string, LocatedRecord[]>();
  for (const record of records) byId.set(record.id, [...(byId.get(record.id) ?? []), record]);

  const exact = records.filter((record) => record.topic === topic);
  const exactIds = new Set(exact.map((record) => record.id));
  const semantic = review.records.map((row) => {
    const matches = byId.get(row.id) ?? [];
    if (matches.length !== 1) {
      throw new Error(`Semantic residual id ${row.id} resolves to ${matches.length} canonical records; expected exactly 1.`);
    }
    if (exactIds.has(row.id)) {
      throw new Error(`Semantic residual id ${row.id} already has exact topic "${topic}"; residual review must cover off-topic candidates only.`);
    }
    return { ...row, record: matches[0] };
  });
  const includedResiduals = semantic.filter((row) => row.disposition === "include");

  return {
    exact,
    semantic,
    includedResiduals,
    populationCount: exact.length + includedResiduals.length,
  };
};

const escapeCell = (value: string | null): string => (value ?? "—").replace(/\|/g, "\\|").replace(/\n/g, "<br>");

const renderReport = (
  topic: string,
  reviewPath: string,
  result: ReturnType<typeof buildTopicPopulation>,
): string => {
  const lines = [
    "# Exact-Topic Population Audit",
    "",
    `Topic: \`${topic}\``,
    `Git SHA: \`${gitSha()}\``,
    `Semantic residual review: \`${reviewPath}\``,
    "",
    "## Population Contract",
    "",
    "Stage 1 recursively enumerates top-level questions, case-study containers, and embedded case-study leaves, then selects exact topic equality. Stage 2 consumes an explicit human semantic-residual review of off-topic clinical candidates. No keyword detector infers clinical membership.",
    "",
    `- Exact-topic records: ${result.exact.length}`,
    `- Semantic residuals reviewed: ${result.semantic.length}`,
    `- Semantic residuals included: ${result.includedResiduals.length}`,
    `- Final population: ${result.populationCount}`,
    "",
    "## Exact-Topic Records",
    "",
    "| ID | File | Path | Population kind | Parent | Category | Item type |",
    "|---|---|---|---|---|---|---|",
  ];
  for (const record of result.exact) {
    lines.push(`| \`${record.id}\` | ${record.file} | \`${record.path}\` | ${record.kind} | ${escapeCell(record.parentId)} | ${record.category} | ${record.itemType} |`);
  }
  lines.push("", "## Semantic Residual Review", "");
  if (result.semantic.length === 0) {
    lines.push("No off-topic candidates were supplied for semantic review.");
  } else {
    lines.push("| ID | Current topic | Disposition | Reason |", "|---|---|---|---|");
    for (const row of result.semantic) {
      lines.push(`| \`${row.id}\` | ${escapeCell(row.record.topic)} | ${row.disposition} | ${escapeCell(row.reason)} |`);
    }
  }
  lines.push("");
  return lines.join("\n");
};

const runCli = async (): Promise<void> => {
  const argv = process.argv.slice(2);
  const topic = argValue(argv, "--topic");
  const reviewPath = argValue(argv, "--semantic-residual");
  const outputPath = argValue(argv, "--output");
  if (!topic || !reviewPath || !outputPath) {
    throw new Error("Usage: audit-topic-population --topic <exact topic> --semantic-residual <review.json> --output <report.md>");
  }

  const records: LocatedRecord[] = [];
  for (const file of await getBankFiles()) {
    const bank = await loadBank(file);
    for (const row of collectQuestionPopulation(bank)) {
      records.push({
        id: row.question.id,
        file: basename(file),
        path: row.path,
        kind: row.kind,
        parentId: row.parentId,
        category: row.question.category,
        topic: row.question.topic,
        itemType: row.question.itemType,
      });
    }
  }

  const review = validateReview(JSON.parse(await readFile(reviewPath, "utf8")), topic);
  const result = buildTopicPopulation(records, topic, review);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderReport(topic, reviewPath, result), "utf8");
  console.log(`Topic population report written: ${outputPath}`);
  console.log(`  ${result.exact.length} exact + ${result.includedResiduals.length} included semantic residuals = ${result.populationCount}`);
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await runCli();
