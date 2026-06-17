import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  CANONICAL_TOPICS,
  SHARED_TOPIC_CATEGORY,
  STRICT_TOPIC_CATEGORY,
  TOPIC_CATEGORY_ORDER,
  normalizeTopicKey,
} from "../src/topics";
import type { Category, Question } from "../src/types";

type ManifestEntry = {
  id: string;
  category: string;
  oldTopic: string;
  proposedTopic: string;
  reason?: string;
};

type IndexedRecord = {
  id: string;
  bankFile: string;
  path: string;
  currentTopic: string;
  trustedCategory: string;
  question: Question;
};

type PlanClass =
  | "WRITE"
  | "SKIP-DONE"
  | "ABORT-GUARD1"
  | "ABORT-DRIFT"
  | "ABORT-LICENSE"
  | "ABORT-CAT-UNTRUSTED"
  | "ABORT-MISSING";

type PlanRow = {
  id: string;
  bankFile: string;
  path: string;
  currentTopic: string;
  oldTopic: string;
  proposedTopic: string;
  category: string;
  class: PlanClass;
  reason: string;
};

type BankState = {
  path: string;
  textBefore: string;
  data: { questions?: Question[] };
};

const DEFAULT_MANIFEST = "audit/proposal_manifest_gemini.json";
const ROUNDTRIP_REASON = "gemini-52 approved semantic topic execution manifest";
const ABORT_CLASSES = new Set<PlanClass>([
  "ABORT-GUARD1",
  "ABORT-DRIFT",
  "ABORT-LICENSE",
  "ABORT-CAT-UNTRUSTED",
  "ABORT-MISSING",
]);

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseArgs = () => {
  const args = new Map<string, string | boolean>();
  for (let index = 2; index < process.argv.length; index += 1) {
    const token = process.argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = process.argv[index + 1];
    if (!next || next.startsWith("--")) {
      args.set(key, true);
    } else {
      args.set(key, next);
      index += 1;
    }
  }
  return args;
};

const stringArg = (args: Map<string, string | boolean>, key: string, fallback: string): string => {
  const value = args.get(key);
  return typeof value === "string" ? value : fallback;
};

const runDate = (args: Map<string, string | boolean>, now = new Date()): string => {
  const supplied = args.get("date");
  if (typeof supplied === "string") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(supplied)) throw new Error("--date must be YYYY-MM-DD.");
    return supplied;
  }
  return now.toISOString().slice(0, 10);
};

const readJson = async (path: string): Promise<unknown> => JSON.parse(await readFile(path, "utf8"));

const manifestEntries = (raw: unknown): ManifestEntry[] => {
  const values = Array.isArray(raw) ? raw : isObject(raw) ? Object.values(raw) : [];
  const entries = values.map((entry, index) => {
    if (!isObject(entry)) throw new Error(`Manifest entry ${index + 1} must be an object.`);
    const { id, category, oldTopic, proposedTopic, reason } = entry;
    if (typeof id !== "string" || id.trim() === "") throw new Error(`Manifest entry ${index + 1} requires id.`);
    if (typeof category !== "string") throw new Error(`Manifest entry ${index + 1} requires category.`);
    if (typeof oldTopic !== "string") throw new Error(`Manifest entry ${index + 1} requires oldTopic.`);
    if (typeof proposedTopic !== "string") throw new Error(`Manifest entry ${index + 1} requires proposedTopic.`);
    return { id, category, oldTopic, proposedTopic, reason: typeof reason === "string" ? reason : undefined };
  });
  const seen = new Set<string>();
  for (const entry of entries) {
    if (seen.has(entry.id)) throw new Error(`Duplicate manifest id: ${entry.id}`);
    seen.add(entry.id);
  }
  return entries;
};

const getBankFiles = async (banksDir: string): Promise<string[]> =>
  (await readdir(banksDir)).filter((file) => file.endsWith("-canonical.json")).sort();

const collectBankState = async (banksDir: string): Promise<Map<string, BankState>> => {
  const states = new Map<string, BankState>();
  for (const file of await getBankFiles(banksDir)) {
    const path = join(banksDir, file);
    const textBefore = await readFile(path, "utf8");
    states.set(file, { path, textBefore, data: JSON.parse(textBefore) });
  }
  return states;
};

const indexQuestions = (banks: Map<string, BankState>): Map<string, IndexedRecord> => {
  const index = new Map<string, IndexedRecord>();
  const visit = (question: Question, bankFile: string, path: string) => {
    if (index.has(question.id)) throw new Error(`Duplicate question id in canonical banks: ${question.id}`);
    index.set(question.id, {
      id: question.id,
      bankFile,
      path,
      currentTopic: question.topic,
      trustedCategory: question.category,
      question,
    });
    if (question.itemType === "case_study") {
      question.caseStudy.questions.forEach((child, childIndex) =>
        visit(child, bankFile, `${path}.caseStudy.questions.${childIndex}`),
      );
    }
  };

  for (const [bankFile, state] of banks) {
    for (const [indexInBank, question] of (state.data.questions ?? []).entries()) {
      visit(question, bankFile, `questions.${indexInBank}`);
    }
  }
  return index;
};

const isCategory = (value: string): value is Category =>
  TOPIC_CATEGORY_ORDER.includes(value as Category);

const licensed = (topic: string, category: string): boolean => {
  if (!isCategory(category)) return false;
  return (
    STRICT_TOPIC_CATEGORY[category].includes(topic) ||
    (SHARED_TOPIC_CATEGORY[topic] ?? []).includes(category)
  );
};

const normalizedEqual = (left: string, right: string): boolean =>
  normalizeTopicKey(left) === normalizeTopicKey(right);

const canonicalCurrentTopic = (topic: string): boolean =>
  [...CANONICAL_TOPICS].some((candidate) => normalizedEqual(candidate, topic));

const buildPlan = (entries: ManifestEntry[], index: Map<string, IndexedRecord>): PlanRow[] => {
  return entries.map((entry) => {
    const current = index.get(entry.id);
    const base = {
      id: entry.id,
      bankFile: current?.bankFile ?? "(missing)",
      path: current?.path ?? "(missing)",
      currentTopic: current?.currentTopic ?? "(missing)",
      oldTopic: entry.oldTopic,
      proposedTopic: entry.proposedTopic,
      category: current?.trustedCategory ?? entry.category,
    };

    if (!current) return { ...base, class: "ABORT-MISSING", reason: "id not found in canonical banks" };
    if (!isCategory(current.trustedCategory)) {
      return { ...base, class: "ABORT-CAT-UNTRUSTED", reason: "current category is missing or noncanonical" };
    }
    if (!CANONICAL_TOPICS.has(entry.proposedTopic) || !licensed(entry.proposedTopic, current.trustedCategory)) {
      return { ...base, class: "ABORT-LICENSE", reason: "proposed topic is not canonical or is not licensed for current category" };
    }
    if (normalizedEqual(current.currentTopic, entry.proposedTopic)) {
      return { ...base, class: "SKIP-DONE", reason: "current topic already equals proposed topic" };
    }
    if (canonicalCurrentTopic(current.currentTopic)) {
      return { ...base, class: "ABORT-GUARD1", reason: "current topic is already canonical and differs from proposed topic" };
    }
    if (!normalizedEqual(current.currentTopic, entry.oldTopic)) {
      return { ...base, class: "ABORT-DRIFT", reason: "current noncanonical topic differs from manifest oldTopic" };
    }
    return { ...base, class: "WRITE", reason: "current topic matches oldTopic and proposed topic is licensed" };
  });
};

const countByClass = (plan: PlanRow[]): Map<PlanClass, number> => {
  const counts = new Map<PlanClass, number>();
  for (const row of plan) counts.set(row.class, (counts.get(row.class) ?? 0) + 1);
  return counts;
};

const markdownTable = (plan: PlanRow[]): string[] => {
  const rows = ["| ID | Bank | Category | Current topic | Old topic | Proposed topic | Class | Reason |", "|---|---|---|---|---|---|---|---|"];
  for (const row of [...plan].sort((left, right) => left.class.localeCompare(right.class) || left.id.localeCompare(right.id))) {
    rows.push(
      `| \`${row.id}\` | ${row.bankFile} | ${row.category} | ${row.currentTopic} | ${row.oldTopic} | ${row.proposedTopic} | ${row.class} | ${row.reason} |`,
    );
  }
  return rows;
};

const writePlan = async (path: string, generatedAt: string, manifestPath: string, plan: PlanRow[]) => {
  const counts = countByClass(plan);
  const lines = [
    "# Gemini-52 Approved Topic Write Plan",
    "",
    `Generated: ${generatedAt}`,
    `Manifest: ${manifestPath}`,
    "Mode: dry run / plan",
    "Canonical bank writes: none",
    "",
    "## Counts",
    "",
    ...[...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([key, count]) => `- ${key}: ${count}`),
    "",
    "## Per-ID Plan",
    "",
    ...markdownTable(plan),
    "",
  ];
  await mkdir("audit", { recursive: true });
  await writeFile(path, lines.join("\n"));
};

const topicCounts = (banks: Map<string, BankState>): Map<string, number> => {
  const counts = new Map<string, number>();
  const visit = (question: Question) => {
    counts.set(question.topic, (counts.get(question.topic) ?? 0) + 1);
    if (question.itemType === "case_study") question.caseStudy.questions.forEach(visit);
  };
  for (const state of banks.values()) {
    for (const question of state.data.questions ?? []) visit(question);
  }
  return counts;
};

const changedPaths = (before: unknown, after: unknown, path = ""): string[] => {
  if (Object.is(before, after)) return [];
  if (!isObject(before) && !Array.isArray(before)) return [path];
  if (!isObject(after) && !Array.isArray(after)) return [path];
  const beforeRecord = before as Record<string, unknown>;
  const afterRecord = after as Record<string, unknown>;
  const keys = new Set([...Object.keys(beforeRecord), ...Object.keys(afterRecord)]);
  return [...keys].flatMap((key) => changedPaths(beforeRecord[key], afterRecord[key], path ? `${path}.${key}` : key));
};

const questionTopicPath = (row: PlanRow): string => `${row.path}.topic`;

const writeReport = async (path: string, lines: string[]) => {
  await mkdir("audit", { recursive: true });
  await writeFile(path, `${lines.join("\n")}\n`);
};

const run = async () => {
  const args = parseArgs();
  const date = runDate(args);
  const manifestPath = stringArg(args, "manifest", DEFAULT_MANIFEST);
  const banksDir = stringArg(args, "banks-dir", "banks");
  const allowCanonical = args.has("allow-canonical");
  const reason = stringArg(args, "reason", "");
  const generatedAt = new Date().toISOString();
  const planPath = stringArg(args, "plan-out", `audit/gemini-52-write-plan-${date}.md`);
  const reportPath = stringArg(args, "report-out", `audit/gemini-52-write-${date}.report.md`);

  if (allowCanonical && !reason.trim()) throw new Error('--allow-canonical requires --reason "..."');

  const entries = manifestEntries(await readJson(manifestPath));
  const beforeBanks = await collectBankState(banksDir);
  const index = indexQuestions(beforeBanks);
  const plan = buildPlan(entries, index);
  await writePlan(planPath, generatedAt, manifestPath, plan);

  const aborts = plan.filter((row) => ABORT_CLASSES.has(row.class));
  const writes = plan.filter((row) => row.class === "WRITE");
  const skipDone = plan.filter((row) => row.class === "SKIP-DONE");

  if (!allowCanonical) {
    console.log(`Wrote ${planPath}. WRITE=${writes.length}, SKIP-DONE=${skipDone.length}, ABORT=${aborts.length}.`);
    return;
  }
  if (aborts.length > 0) {
    throw new Error(`Fail-closed: ${aborts.length} abort row(s) present. Plan written to ${planPath}; no canonical banks were modified.`);
  }

  const beforeTopicCounts = topicCounts(beforeBanks);
  const rowsById = new Map(writes.map((row) => [row.id, row]));
  for (const row of writes) {
    const record = index.get(row.id);
    if (!record) throw new Error(`Internal missing record during write: ${row.id}`);
    record.question.topic = row.proposedTopic;
  }

  const changedBankFiles = new Set(writes.map((row) => row.bankFile));
  const exactDiffProblems: string[] = [];
  for (const bankFile of changedBankFiles) {
    const before = JSON.parse(beforeBanks.get(bankFile)!.textBefore);
    const after = beforeBanks.get(bankFile)!.data;
    const changed = changedPaths(before, after).sort();
    const expected = writes.filter((row) => row.bankFile === bankFile).map(questionTopicPath).sort();
    if (changed.join("\n") !== expected.join("\n")) {
      exactDiffProblems.push(`${bankFile}: expected ${expected.join(", ")} but changed ${changed.join(", ")}`);
    }
  }
  if (exactDiffProblems.length > 0) {
    throw new Error(`Exact diff verification failed before write:\n${exactDiffProblems.join("\n")}`);
  }

  for (const bankFile of changedBankFiles) {
    const state = beforeBanks.get(bankFile)!;
    await writeFile(state.path, `${JSON.stringify(state.data, null, 2)}\n`);
  }

  const afterBanks = await collectBankState(banksDir);
  const afterIndex = indexQuestions(afterBanks);
  const v1Problems: string[] = [];
  for (const row of writes) {
    const after = afterIndex.get(row.id);
    if (!after || !normalizedEqual(after.currentTopic, row.proposedTopic)) {
      v1Problems.push(`${row.id} did not read back as ${row.proposedTopic}`);
    }
  }
  for (const row of skipDone) {
    const after = afterIndex.get(row.id);
    if (!after || !normalizedEqual(after.currentTopic, row.proposedTopic)) {
      v1Problems.push(`${row.id} SKIP-DONE changed unexpectedly`);
    }
  }

  const affectedFiles = [...changedBankFiles].sort().map((file) => join(banksDir, file));
  const validateOutput = affectedFiles.length > 0
    ? execFileSync("npm", ["run", "validate-bank", "--", ...affectedFiles], { encoding: "utf8" })
    : "No affected bank files.";

  const afterTopicCounts = topicCounts(afterBanks);
  const oldTopicsRemoved = [...new Set(writes.map((row) => row.oldTopic))]
    .filter((topic) => (beforeTopicCounts.get(topic) ?? 0) > (afterTopicCounts.get(topic) ?? 0));
  const stillOld = writes.filter((row) => normalizedEqual(afterIndex.get(row.id)?.currentTopic ?? "", row.oldTopic));

  const secondPlan = buildPlan(entries, afterIndex);
  const secondWrites = secondPlan.filter((row) => row.class === "WRITE");

  const reportLines = [
    "# Gemini-52 Approved Topic Write Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Manifest: ${manifestPath}`,
    `Reason: ${reason || ROUNDTRIP_REASON}`,
    "Canonical bank writes: yes",
    "",
    "## Counts",
    "",
    `- Applied WRITE rows: ${writes.length}`,
    `- SKIP-DONE rows: ${skipDone.length}`,
    `- Abort rows: ${aborts.length}`,
    `- Affected bank files: ${affectedFiles.length}`,
    "",
    "## Verification",
    "",
    `- V1 re-reconcile: ${v1Problems.length === 0 ? "PASS" : `FAIL (${v1Problems.length})`}`,
    "- V2 exact diff: PASS",
    "- V3 validate-bank: PASS",
    `- V4 old topics removed from written IDs: ${stillOld.length === 0 ? "PASS" : `FAIL (${stillOld.length})`}`,
    `- V5 idempotency second dry-run WRITE count: ${secondWrites.length}`,
    "",
    "## Applied IDs",
    "",
    ...writes.map((row) => `- \`${row.id}\`: ${row.oldTopic} -> ${row.proposedTopic}`),
    "",
    "## Vocabulary Delta",
    "",
    `- Unique topic count before: ${beforeTopicCounts.size}`,
    `- Unique topic count after: ${afterTopicCounts.size}`,
    "- Noncanonical old topics with reduced counts:",
    ...oldTopicsRemoved.map((topic) => `  - ${topic}: ${(beforeTopicCounts.get(topic) ?? 0)} -> ${(afterTopicCounts.get(topic) ?? 0)}`),
    "",
    "## validate-bank Output",
    "",
    "```text",
    validateOutput.trim(),
    "```",
    "",
  ];
  if (v1Problems.length > 0 || stillOld.length > 0 || secondWrites.length > 0) {
    reportLines.push("## Verification Problems", "", ...v1Problems, ...stillOld.map((row) => `${row.id} still carries oldTopic`), ...secondWrites.map((row) => `${row.id} still WRITE on second dry-run`), "");
  }
  await writeReport(reportPath, reportLines);
  console.log(`Wrote ${reportPath}. Applied ${writes.length}; SKIP-DONE=${skipDone.length}; second WRITE=${secondWrites.length}.`);
};

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
