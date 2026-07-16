/**
 * Tier 2 advisory — canonical topic vocabulary and category licensing.
 *
 * This is deliberately report-only. It verifies exact vocabulary membership
 * and the declared category license for canonical topics; it cannot determine
 * whether an item's clinical construct belongs in one of several categories
 * licensed for a SHARED topic.
 */

import { execSync } from "node:child_process";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CANONICAL_DIR } from "../../lib/pipeline-paths";
import {
  collectQuestionPopulation,
  type QuestionPopulationKind,
} from "../../lib/question-population";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import { isCanonicalTopic, topicCategories } from "../../src/topics";
import type { BankEnvelope, Category } from "../../src/types";
import type { AuditResult } from "./types";

export type TopicLicenseIssue = "noncanonical_topic" | "license_mismatch";

export type TopicLicenseFinding = {
  id: string;
  file: string;
  path: string;
  kind: QuestionPopulationKind;
  parentId: string | null;
  category: Category;
  topic: string;
  issue: TopicLicenseIssue;
  licensedCategories: readonly Category[];
};

export type TopicLicenseMetrics = {
  topLevelRecords: number;
  caseContainers: number;
  standaloneTopLevel: number;
  embeddedParts: number;
  scoredLeaves: number;
  topLevelFindings: number;
  caseContainerFindings: number;
  standaloneTopLevelFindings: number;
  embeddedPartFindings: number;
  scoredLeafFindings: number;
};

export type TopicLicenseAnalysis = {
  metrics: TopicLicenseMetrics;
  findings: TopicLicenseFinding[];
};

export const analyzeTopicLicenses = (
  banks: Array<{ bank: BankEnvelope; file: string }>,
): TopicLicenseAnalysis => {
  const findings: TopicLicenseFinding[] = [];
  let caseContainers = 0;
  let standaloneTopLevel = 0;
  let embeddedParts = 0;

  for (const { bank, file } of banks) {
    for (const record of collectQuestionPopulation(bank)) {
      if (record.kind === "top_level_case_container") caseContainers += 1;
      else if (record.kind === "top_level_scored_leaf") standaloneTopLevel += 1;
      else embeddedParts += 1;

      const question = record.question;
      const licensedCategories = topicCategories(question.topic);
      const issue = !isCanonicalTopic(question.topic)
        ? "noncanonical_topic"
        : licensedCategories.includes(question.category)
          ? null
          : "license_mismatch";
      if (!issue) continue;

      findings.push({
        id: question.id,
        file,
        path: record.path,
        kind: record.kind,
        parentId: record.parentId,
        category: question.category,
        topic: question.topic,
        issue,
        licensedCategories,
      });
    }
  }

  findings.sort((left, right) =>
    left.file.localeCompare(right.file) ||
    left.path.localeCompare(right.path) ||
    left.id.localeCompare(right.id),
  );

  const isTopLevel = (kind: QuestionPopulationKind) => kind !== "embedded_scored_leaf";
  const isScoredLeaf = (kind: QuestionPopulationKind) => kind !== "top_level_case_container";
  return {
    metrics: {
      topLevelRecords: caseContainers + standaloneTopLevel,
      caseContainers,
      standaloneTopLevel,
      embeddedParts,
      scoredLeaves: standaloneTopLevel + embeddedParts,
      topLevelFindings: findings.filter((finding) => isTopLevel(finding.kind)).length,
      caseContainerFindings: findings.filter((finding) => finding.kind === "top_level_case_container").length,
      standaloneTopLevelFindings: findings.filter((finding) => finding.kind === "top_level_scored_leaf").length,
      embeddedPartFindings: findings.filter((finding) => finding.kind === "embedded_scored_leaf").length,
      scoredLeafFindings: findings.filter((finding) => isScoredLeaf(finding.kind)).length,
    },
    findings,
  };
};

const loadCanonicalBanks = async (): Promise<{
  files: string[];
  banks: Array<{ bank: BankEnvelope; file: string }>;
  error?: string;
}> => {
  let files: string[];
  try {
    files = (await readdir(CANONICAL_DIR)).filter((file) => file.endsWith(".json")).sort();
  } catch {
    return { files: [], banks: [], error: `Canonical directory ${CANONICAL_DIR} not found or not readable.` };
  }

  const banks: Array<{ bank: BankEnvelope; file: string }> = [];
  for (const filename of files) {
    try {
      const text = await readFile(join(CANONICAL_DIR, filename), "utf8");
      const result = validateBankObject(parseBankText(text), { rejectUnknownKeys: true });
      if (!result.ok) {
        return {
          files,
          banks: [],
          error: `${filename}: structural validation failed before topic-license audit:\n${result.reasons.join("\n")}`,
        };
      }
      banks.push({ bank: result.value, file: basename(filename) });
    } catch (error) {
      return {
        files,
        banks: [],
        error: `${filename}: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
  return { files, banks };
};

const limitation = "Vocabulary membership only: this gate cannot enforce the clinical boundary among categories licensed for a SHARED topic; that remains semantic-review work.";

export async function runAuditTopicLicense(): Promise<AuditResult> {
  const loaded = await loadCanonicalBanks();
  if (loaded.error) {
    return { name: "audit:topic-license", status: "INSUFFICIENT", failures: [], detail: loaded.error };
  }
  const analysis = analyzeTopicLicenses(loaded.banks);
  const { metrics, findings } = analysis;
  const summary = `Inspected ${metrics.topLevelRecords} top-level records (${metrics.caseContainers} case containers + ${metrics.standaloneTopLevel} standalone) and ${metrics.embeddedParts} embedded parts; scored leaves: ${metrics.scoredLeaves}.`;
  if (findings.length === 0) {
    return {
      name: "audit:topic-license",
      status: "PASS",
      failures: [],
      detail: `${summary} No vocabulary or category-license findings. ${limitation}`,
    };
  }
  return {
    name: "audit:topic-license",
    status: "WARN",
    failures: [],
    detail: `${summary} Findings: ${metrics.topLevelFindings} top-level (${metrics.caseContainerFindings} case containers + ${metrics.standaloneTopLevelFindings} standalone) and ${metrics.scoredLeafFindings} scored leaves (${metrics.standaloneTopLevelFindings} standalone + ${metrics.embeddedPartFindings} embedded). Generate the row-level report with npm run audit:topic-license -- --output=audit/topic-license.current-head.report.md. ${limitation}`,
  };
}

const escapeCell = (value: string | null): string => (value ?? "—").replace(/\|/g, "\\|").replace(/\n/g, "<br>");

const getGitSha = (): string => {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
};

export const renderTopicLicenseReport = (
  analysis: TopicLicenseAnalysis,
  options: { inputGitSha?: string } = {},
): string => {
  const { metrics, findings } = analysis;
  const lines = [
    "# Topic-License Hygiene Report",
    "",
    "Status: report-only advisory generated from the current canonical banks.",
    `Input Git SHA: ${options.inputGitSha ?? "not-recorded"}`,
    "",
    "This gate validates exact canonical topic vocabulary membership and declared topic/category licenses. It cannot enforce the clinical boundary among categories licensed for a SHARED topic; that remains semantic-review work.",
    "",
    "## Population",
    "",
    `- Top-level records: ${metrics.topLevelRecords}`,
    `- Case-study containers: ${metrics.caseContainers}`,
    `- Standalone top-level scored leaves: ${metrics.standaloneTopLevel}`,
    `- Embedded scored leaves: ${metrics.embeddedParts}`,
    `- Scored leaves: ${metrics.scoredLeaves}`,
    "",
    "Case-study containers are inspected as records but are not counted as scored leaves.",
    "",
    "## Findings",
    "",
    `- Top-level findings: ${metrics.topLevelFindings} (${metrics.caseContainerFindings} case containers + ${metrics.standaloneTopLevelFindings} standalone)`,
    `- Scored-leaf findings: ${metrics.scoredLeafFindings} (${metrics.standaloneTopLevelFindings} standalone + ${metrics.embeddedPartFindings} embedded)`,
    `- Unique record findings: ${findings.length}`,
    "",
    "The two finding lanes overlap at standalone top-level scored leaves; they are not summed. Case containers appear only in the top-level lane, never in the scored-leaf lane.",
    "",
  ];
  if (findings.length === 0) {
    lines.push("No noncanonical topics or canonical topic/category license mismatches found.", "");
    return lines.join("\n");
  }
  lines.push(
    "| ID | File | Path | Record kind | Parent | Category | Topic | Issue | Licensed categories |",
    "|---|---|---|---|---|---|---|---|---|",
  );
  for (const finding of findings) {
    lines.push(`| \`${finding.id}\` | ${finding.file} | \`${finding.path}\` | ${finding.kind} | ${escapeCell(finding.parentId)} | ${escapeCell(finding.category)} | ${escapeCell(finding.topic)} | ${finding.issue} | ${finding.licensedCategories.length > 0 ? finding.licensedCategories.join("; ") : "—"} |`);
  }
  lines.push("");
  return lines.join("\n");
};

const runCli = async (): Promise<void> => {
  const loaded = await loadCanonicalBanks();
  if (loaded.error) throw new Error(loaded.error);
  const analysis = analyzeTopicLicenses(loaded.banks);
  const outputArg = process.argv.slice(2).find((arg) => arg.startsWith("--output="));
  if (outputArg) {
    const outputPath = outputArg.slice("--output=".length);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, renderTopicLicenseReport(analysis, { inputGitSha: getGitSha() }), "utf8");
    console.log(`Topic-license report written: ${outputPath}`);
  }
  const result = await runAuditTopicLicense();
  console.log(`[${result.status}] ${result.name}`);
  console.log(result.detail);
  if (result.failures.length > 0) console.log(`Related IDs: ${result.failures.join(", ")}`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) await runCli();
