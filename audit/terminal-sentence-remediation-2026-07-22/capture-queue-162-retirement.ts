import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { RETIRE_IDS } from "../../scripts/patches/2026-07-22-terminal-sentence-retirement-manifest";

const auditDir = dirname(fileURLToPath(import.meta.url));
const repo = resolve(auditDir, "../..");
const bankPath = join(repo, "banks/claude-canonical.json");
const archiveDir = join(repo, "Archive/terminal-sentence-remediation-2026-07-22");
const bankBytes = readFileSync(bankPath);
const bank = JSON.parse(bankBytes.toString("utf8"));
const payloadHash = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value, null, 2)).digest("hex");
const bankHash = createHash("sha256").update(bankBytes).digest("hex");
const questions = new Map(bank.questions.map((question: any) => [question.id, question]));

if (RETIRE_IDS.some((id) => !questions.has(id))) {
  throw new Error("Queue 162 is absent from the pre-removal bank");
}

const receipt = {
  capturedAt: "2026-07-22",
  bankPath: "banks/claude-canonical.json",
  bankSha256: bankHash,
  metaCount: bank.meta.count,
  questionCount: bank.questions.length,
  questions: bank.questions.map((question: any, index: number) => ({
    index,
    id: question.id,
    payloadSha256: payloadHash(question),
  })),
};

const retiredItems = RETIRE_IDS.map((id) => {
  const question = questions.get(id);
  return {
    id,
    kind: "RETIRE",
    reason: "The pre-authoring source test found no single explicit policy supporting the complete, genuinely unique six-row matrix without inventing a common U.S. scope.",
    payloadSha256: payloadHash(question),
    question,
  };
});

mkdirSync(archiveDir, { recursive: true });
writeFileSync(
  join(auditDir, "queue-162-pre-removal-question-hashes.json"),
  `${JSON.stringify(receipt, null, 2)}\n`,
);
writeFileSync(
  join(archiveDir, "queue-162-retired-item.json"),
  `${JSON.stringify({
    archivedAt: "2026-07-22",
    sourceBank: "banks/claude-canonical.json",
    sourceBankSha256: bankHash,
    sourceTest: "audit/terminal-sentence-remediation-2026-07-22/queue-162-source-test.md",
    status: "owner-authorized retirement",
    count: retiredItems.length,
    items: retiredItems,
  }, null, 2)}\n`,
);

console.log(JSON.stringify({
  bankHash,
  questionCount: bank.questions.length,
  retiredIds: RETIRE_IDS,
  archivePath: "Archive/terminal-sentence-remediation-2026-07-22/queue-162-retired-item.json",
}, null, 2));
