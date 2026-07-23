import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type Json = Record<string, any>;
const outputDir = dirname(fileURLToPath(import.meta.url));
const repo = resolve(outputDir, "../../..");
const readJson = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const readJsonl = (path: string): Json[] => readFileSync(path, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const sha = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const payloadSha = (value: unknown) => sha(JSON.stringify(value, null, 2));
const git = (...args: string[]) => execFileSync("git", args, { cwd: repo, encoding: "utf8" }).trimEnd();

const queuePath = join(repo, "audit/terminal-sentence-semantic-census-2026-07-21/queue.jsonl");
const queue = readJsonl(queuePath);
const queueByIndex = new Map(queue.map((row) => [row.queueIndex, row]));
const blockedDir = join(repo, "audit/terminal-sentence-independent-checker-2026-07-22/gpt-5-6-sol");
const frozenPopulation = readJsonl(join(blockedDir, "checker-population.jsonl"));
const frozenSample = readJsonl(join(blockedDir, "sample-manifest.jsonl"));
const blockedHashes = Object.fromEntries(readdirSync(blockedDir).sort().map((name) => [name, sha(readFileSync(join(blockedDir, name)))]));

const manifestPath = join(repo, "Archive/gpt-july16-construct-dispositions-2026-07-21/manifest.json");
const manifest = readJson(manifestPath);
const retiredArchivePath = join(repo, "Archive/gpt-july16-construct-dispositions-2026-07-21/retired-items.json");
const quarantinePath = join(repo, "Archive/gpt-july16-construct-dispositions-2026-07-21/quarantined-fix-items.json");
const retiredArchive = readJson(retiredArchivePath);
const quarantineArchive = readJson(quarantinePath);
const removalEntries = [
  ...manifest.retiredPayloads.map((entry: Json) => ({ ...entry, ownerDisposition: "RETIRE", evidencePath: "Archive/gpt-july16-construct-dispositions-2026-07-21/retired-items.json" })),
  ...manifest.quarantinedPayloads.map((entry: Json) => ({ ...entry, ownerDisposition: "FIX_QUARANTINE", evidencePath: "Archive/gpt-july16-construct-dispositions-2026-07-21/quarantined-fix-items.json" })),
];
const removalIds = removalEntries.map((entry) => entry.id);
const removalSet = new Set(removalIds);

const preReceiptPath = join(repo, "audit/july16-coverage-construct-audit-2026-07-21/pre-removal-question-hashes.json");
const preReceipt = readJson(preReceiptPath);
const verificationPath = join(repo, "audit/july16-coverage-construct-audit-2026-07-21/post-removal-verification.json");
const ownerVerification = readJson(verificationPath);
const liveGptPath = join(repo, "banks/gpt-canonical.json");
const liveGptBytes = readFileSync(liveGptPath);
const liveGpt = JSON.parse(liveGptBytes.toString("utf8"));
const liveById = new Map(liveGpt.questions.map((question: Json, index: number) => [question.id, { question, index, payloadSha256: payloadSha(question) }]));
const retainedReceipt = preReceipt.questions.filter((entry: Json) => !removalSet.has(entry.id));
const missingRetained = retainedReceipt.filter((entry: Json) => !liveById.has(entry.id)).map((entry: Json) => entry.id);
const changedRetained = retainedReceipt.filter((entry: Json) => liveById.get(entry.id)?.payloadSha256 !== entry.payloadSha256).map((entry: Json) => entry.id);
const retainedOrderExpected = retainedReceipt.map((entry: Json) => entry.id);
const retainedOrderLive = liveGpt.questions.map((question: Json) => question.id);
const retainedOrderMatches = JSON.stringify(retainedOrderExpected) === JSON.stringify(retainedOrderLive);
const extraLiveIds = retainedOrderLive.filter((id: string) => !retainedReceipt.some((entry: Json) => entry.id === id));
const presentRemoved = removalIds.filter((id) => liveById.has(id));
const archivedPayloads = [...(retiredArchive.items ?? []), ...(quarantineArchive.items ?? [])];
const archivedById = new Map(archivedPayloads.map((entry: Json) => [entry.id, entry]));
const archivePayloadMismatches = removalEntries.filter((entry) => {
  const archived = archivedById.get(entry.id);
  return !archived || payloadSha(archived.question) !== entry.payloadSha256;
}).map((entry) => entry.id);

const bankPaths = [...new Set(queue.map((row) => row.bankPath))].sort();
const bankHashes = bankPaths.map((bankPath) => {
  const queueHashes = [...new Set(queue.filter((row) => row.bankPath === bankPath).map((row) => row.bankSha256))];
  const liveSha256 = sha(readFileSync(join(repo, bankPath)));
  const authorizedGpt = bankPath === "banks/gpt-canonical.json" && queueHashes[0] === ownerVerification.beforeBankSha256 && liveSha256 === ownerVerification.afterBankSha256;
  return { bankPath, queueHashes, liveSha256, matchesQueueSnapshot: queueHashes.length === 1 && queueHashes[0] === liveSha256, authorizedGptPostSnapshotRemoval: authorizedGpt };
});

const tombstoneIndices = new Set([2052, 2073, 2096, 2109, 2127]);
const population = frozenPopulation.map((row) => {
  if (!tombstoneIndices.has(row.queueIndex)) return { ...row, populationStatus: "LIVE_SEMANTIC_REVIEW" };
  const entry = removalEntries.find((candidate) => candidate.id === row.topLevelQuestionId);
  if (!entry) throw new Error(`Missing owner removal entry for tombstone ${row.queueIndex}`);
  return {
    ...row,
    selectionReasons: [...new Set([...row.selectionReasons, "AUTHORIZED_POST_SNAPSHOT_REMOVAL"])].sort(),
    populationStatus: "AUTHORIZED_POST_SNAPSHOT_REMOVAL",
    ownerDisposition: entry.ownerDisposition,
    archiveOrQuarantinePath: entry.evidencePath,
    archivedPayloadSha256: entry.payloadSha256,
  };
});
const sample = frozenSample.map((row) => {
  if (!tombstoneIndices.has(row.queueIndex)) return { ...row, populationStatus: "LIVE_SEMANTIC_REVIEW" };
  const entry = removalEntries.find((candidate) => candidate.id === row.topLevelQuestionId)!;
  return {
    ...row,
    selectionReasons: [...new Set([...row.selectionReasons, "AUTHORIZED_POST_SNAPSHOT_REMOVAL"])].sort(),
    populationStatus: "AUTHORIZED_POST_SNAPSHOT_REMOVAL",
    ownerDisposition: entry.ownerDisposition,
    archiveOrQuarantinePath: entry.evidencePath,
    archivedPayloadSha256: entry.payloadSha256,
  };
});

const liveBanks = new Map<string, Json>();
const liveIdentityChecks = population.filter((row) => row.populationStatus === "LIVE_SEMANTIC_REVIEW").map((row) => {
  const q = queueByIndex.get(row.queueIndex)!;
  let bank = liveBanks.get(q.bankPath);
  if (!bank) { bank = readJson(join(repo, q.bankPath)); liveBanks.set(q.bankPath, bank!); }
  const top = bank!.questions.find((question: Json) => question.id === q.topLevelQuestionId);
  const item = q.embeddedQuestionId ? top?.itemType === "case_study" ? top.caseStudy.questions.find((question: Json) => question.id === q.embeddedQuestionId) : undefined : top;
  return { queueIndex: q.queueIndex, present: Boolean(item), stemMatches: item ? item.stem.en === q.fullStemEn && item.stem.zh === q.fullStemZh : false };
});
const missingLivePopulation = liveIdentityChecks.filter((row) => !row.present);
const changedLivePopulation = liveIdentityChecks.filter((row) => row.present && !row.stemMatches);

const batchDir = join(repo, "audit/terminal-sentence-sonnet-review-2026-07-21/batches");
const batchFiles = readdirSync(batchDir).filter((name) => /^batch-\d{3}\.jsonl$/.test(name)).sort();
const sonnet = batchFiles.flatMap((name) => readJsonl(join(batchDir, name)));
const terminalMismatches = sonnet.flatMap((row) => {
  const q = queueByIndex.get(row.queueIndex);
  if (!q) return [{ queueIndex: row.queueIndex, fields: ["EXTRA_IDENTITY"] }];
  const fields = ["bankPath", "topLevelQuestionId", "embeddedQuestionId", "recordKind", "itemType", "terminalSentenceEn", "terminalSentenceZh"].filter((field) => row[field] !== q[field]);
  return fields.length ? [{ queueIndex: row.queueIndex, fields }] : [];
});
const evidenceStringIndices = sonnet.filter((row) => typeof row.quotedEvidence === "string").map((row) => row.queueIndex);
const deliveryText = readFileSync(join(repo, "audit/terminal-sentence-sonnet-review-2026-07-21/delivery.md"), "utf8");

const proofGreen =
  sha(liveGptBytes) === "2a3bb79809e1407e8c915965e6212898c58dc721ceb54de701e5e2b374e0e389" &&
  preReceipt.bankSha256 === "61664a6bef854ec8d7a3a0113779a4773135724aabfdec65b970b7ac6464c5d2" &&
  removalIds.length === 50 && new Set(removalIds).size === 50 &&
  missingRetained.length === 0 && changedRetained.length === 0 && presentRemoved.length === 0 && extraLiveIds.length === 0 && retainedOrderMatches &&
  archivePayloadMismatches.length === 0 &&
  bankHashes.every((entry) => entry.matchesQueueSnapshot || entry.authorizedGptPostSnapshotRemoval) &&
  missingLivePopulation.length === 0 && changedLivePopulation.length === 0;

const reconciliation = {
  mechanicalStatus: proofGreen ? "NONCONFORMANT_BUT_ANALYZABLE" : "BLOCKED_INCOMPLETE_OR_IDENTITY_MISMATCH",
  branch: git("branch", "--show-current"), head: git("rev-parse", "HEAD"),
  startingChangedPaths: git("status", "--short").split("\n").filter(Boolean),
  queueCount: queue.length, sonnetBatchCount: batchFiles.length, sonnetDeliveredCount: sonnet.length,
  sonnetTerminalIdentityMismatches: terminalMismatches,
  quotedEvidenceShape: { arrayCount: sonnet.length - evidenceStringIndices.length, stringCount: evidenceStringIndices.length, stringIndices: evidenceStringIndices },
  deliveryMethodInconsistency: {
    noSemanticGeneratorClaimPresent: deliveryText.includes("Semantic generator/classifier script:** none"),
    perBatchPythonBuilderDisclosurePresent: deliveryText.includes("per-batch Python script"),
    finding: "The delivery denies a semantic generator/classifier while disclosing per-batch Python builders that assembled semantic dispositions into JSONL; this remains nonconformant evidence and is not normalized.",
  },
  blockedRunPreservationBaseline: blockedHashes,
  authorizedPostSnapshotRemoval: {
    status: proofGreen ? "PROVEN" : "FAILED",
    preRemovalBankSha256: preReceipt.bankSha256,
    liveBankSha256: sha(liveGptBytes),
    expectedLiveBankSha256: ownerVerification.afterBankSha256,
    removalCount: removalIds.length,
    retiredCount: manifest.retiredCount,
    quarantinedFixCount: manifest.quarantinedFixCount,
    exactRemovalIds: removalEntries,
    missingRetained, changedRetained, presentRemoved, extraLiveIds, retainedOrderMatches, archivePayloadMismatches,
    retainedPayloadCount: retainedReceipt.length,
    evidencePaths: [
      "audit/july16-coverage-construct-audit-2026-07-21/bank-implementation-closeout.md",
      "audit/july16-coverage-construct-audit-2026-07-21/post-removal-verification.json",
      "audit/july16-coverage-construct-audit-2026-07-21/pre-removal-question-hashes.json",
      "scripts/patches/2026-07-21-gpt-july16-construct-disposition-manifest.ts",
      "Archive/gpt-july16-construct-dispositions-2026-07-21/manifest.json",
    ],
  },
  bankHashes,
  frozenCheckerPopulationCount: population.length,
  liveSemanticPopulationCount: population.filter((row) => row.populationStatus === "LIVE_SEMANTIC_REVIEW").length,
  tombstoneCount: population.filter((row) => row.populationStatus === "AUTHORIZED_POST_SNAPSHOT_REMOVAL").length,
  frozenSampleCount: sample.length,
  liveSampleDenominator: sample.filter((row) => row.populationStatus === "LIVE_SEMANTIC_REVIEW").length,
  sampleTombstoneCount: sample.filter((row) => row.populationStatus === "AUTHORIZED_POST_SNAPSHOT_REMOVAL").length,
  livePopulationIdentity: { missing: missingLivePopulation, changedStems: changedLivePopulation },
};

writeFileSync(join(outputDir, "mechanical-reconciliation.json"), JSON.stringify(reconciliation, null, 2) + "\n");
writeFileSync(join(outputDir, "checker-population.jsonl"), population.map(JSON.stringify).join("\n") + "\n");
writeFileSync(join(outputDir, "sample-manifest.jsonl"), sample.map(JSON.stringify).join("\n") + "\n");
console.log(JSON.stringify({ mechanicalStatus: reconciliation.mechanicalStatus, frozenPopulation: population.length, livePopulation: reconciliation.liveSemanticPopulationCount, tombstones: reconciliation.tombstoneCount, frozenSample: sample.length, liveSample: reconciliation.liveSampleDenominator }, null, 2));
