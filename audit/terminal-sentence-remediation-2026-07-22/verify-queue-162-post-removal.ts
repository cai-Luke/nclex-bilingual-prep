import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { REMOVAL_IDS } from "../../scripts/patches/2026-07-22-terminal-sentence-retirement-manifest";

const auditDir = dirname(fileURLToPath(import.meta.url));
const repo = resolve(auditDir, "../..");
const bankPath = join(repo, "banks/claude-canonical.json");
const bankBytes = readFileSync(bankPath);
const bank = JSON.parse(bankBytes.toString("utf8"));
const pre = JSON.parse(readFileSync(
  join(auditDir, "queue-162-pre-removal-question-hashes.json"),
  "utf8",
));
const hash = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value, null, 2)).digest("hex");
const removal = new Set<string>(REMOVAL_IDS);
const current = new Map(bank.questions.map((question: any, index: number) => [
  question.id,
  { index, payloadSha256: hash(question) },
]));
const missingRetained = pre.questions.filter(
  (entry: any) => !removal.has(entry.id) && !current.has(entry.id),
);
const changedRetained = pre.questions.filter(
  (entry: any) =>
    !removal.has(entry.id)
    && current.get(entry.id)?.payloadSha256 !== entry.payloadSha256,
);
const presentRemoved = REMOVAL_IDS.filter((id) => current.has(id));
const retainedOrder = pre.questions
  .filter((entry: any) => !removal.has(entry.id))
  .map((entry: any) => entry.id);
const currentOrder = bank.questions.map((question: any) => question.id);
const retainedOrderMatches =
  JSON.stringify(retainedOrder) === JSON.stringify(currentOrder);
const expectedCount = pre.questionCount - REMOVAL_IDS.length;

const result = {
  verifiedAt: "2026-07-22",
  beforeBankSha256: pre.bankSha256,
  afterBankSha256: createHash("sha256").update(bankBytes).digest("hex"),
  beforeCount: pre.questionCount,
  afterCount: bank.questions.length,
  metaCount: bank.meta.count,
  intendedRemovedIds: REMOVAL_IDS,
  missingRetained: missingRetained.map((entry: any) => entry.id),
  changedRetained: changedRetained.map((entry: any) => entry.id),
  presentRemoved,
  retainedOrderMatches,
  status: "PASS",
};

if (
  bank.questions.length !== expectedCount
  || bank.meta.count !== expectedCount
  || missingRetained.length
  || changedRetained.length
  || presentRemoved.length
  || !retainedOrderMatches
) {
  throw new Error(JSON.stringify({ ...result, status: "FAIL" }, null, 2));
}

writeFileSync(
  join(auditDir, "queue-162-post-removal-verification.json"),
  `${JSON.stringify(result, null, 2)}\n`,
);
console.log(JSON.stringify(result, null, 2));
