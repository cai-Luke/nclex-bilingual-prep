import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname);
const WORK_ORDER_SHA256 = "91e7434905f52ef90f7288def1aa6d17118c3708b7e99d76f0384bfeeafad390";
const sha256 = (value: string | Buffer): string => createHash("sha256").update(value).digest("hex");
function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

type CandidateRow = {
  queueIndex: number;
  packetId: string;
  bankPath: string;
  parentCaseId: string;
  partId: string;
  verdict: string;
  testedDecision: string;
  requiredStageIds: string[];
  unsafeStageIds: string[];
  partEvidenceIds: string[];
  stageEvidenceIds: string[];
  bilingualRelation: string;
  reason: string;
};

type PopulationRow = {
  queueIndex: number;
  packetId: string;
  bankPath: string;
  parentCaseId: string;
  partId: string;
  itemType: string;
  partOrdinal: number;
  declaredStageIds: string[];
};

type PacketMeta = { packetId: string; path: string; sha256: string; targetCount: number; queueIndices: number[] };

function parseJsonl<T>(text: string): T[] {
  return text.split(/\r?\n/u).filter((line) => line.length > 0).map((line) => JSON.parse(line) as T);
}

function counts(values: string[]): Record<string, number> {
  const result = new Map<string, number>();
  for (const value of values) result.set(value, (result.get(value) ?? 0) + 1);
  return Object.fromEntries([...result.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

function table(values: Record<string, number>, label: string, metric = "Rows"): string {
  const rows = Object.entries(values).map(([key, value]) => `| ${key} | ${value} |`).join("\n");
  return `| ${label} | ${metric} |\n|---|---:|\n${rows}`;
}

async function main(): Promise<void> {
  const manifestText = await readFile(resolve(ROOT, "packet-manifest.json"), "utf8");
  const manifest = JSON.parse(manifestText) as {
    bankSnapshotSha256: string;
    targetCount: number;
    parentCaseCount: number;
    packetCount: number;
    bankFiles: Array<{ bankPath: string; sha256: string }>;
    packets: PacketMeta[];
  };
  assert(manifest.packetCount === 75 && manifest.packets.length === 75, "packet count mismatch");
  assert(manifest.targetCount === 451, "target count mismatch");
  const populationText = await readFile(resolve(ROOT, "population.jsonl"), "utf8");
  const population = parseJsonl<PopulationRow>(populationText);
  assert(population.length === manifest.targetCount, "population row count mismatch");
  const contextsText = await readFile(resolve(ROOT, "semantic-contexts.jsonl"), "utf8");
  const contexts = parseJsonl<Record<string, unknown>>(contextsText);
  assert(contexts.length === manifest.packetCount, "semantic context count mismatch");

  const packetOutputs: Buffer[] = [];
  const candidateRows: CandidateRow[] = [];
  const outputFreeze: Array<{ packetId: string; path: string; sha256: string; rowCount: number; queueIndexStart: number; queueIndexEnd: number }> = [];
  for (const [packetIndex, packet] of manifest.packets.entries()) {
    const packetBytes = await readFile(resolve(ROOT, packet.path));
    assert(sha256(packetBytes) === packet.sha256, `${packet.packetId}: source packet hash drift`);
    const outputPath = `candidate/${packet.packetId}.jsonl`;
    const outputBytes = await readFile(resolve(ROOT, outputPath));
    assert(outputBytes.length > 0 && outputBytes.at(-1) === 0x0a, `${packet.packetId}: output must end with LF`);
    const rows = parseJsonl<CandidateRow>(outputBytes.toString("utf8"));
    assert(rows.length === packet.targetCount, `${packet.packetId}: output row count mismatch`);
    assert(rows.every((row) => row.packetId === packet.packetId), `${packet.packetId}: packet identity mismatch`);
    assert(JSON.stringify(rows.map(({ queueIndex }) => queueIndex)) === JSON.stringify(packet.queueIndices), `${packet.packetId}: queue order mismatch`);
    const receipt = contexts[packetIndex] as { packetId?: string; packetSha256?: string; outputSha256?: string; validation?: string };
    assert(receipt.packetId === packet.packetId && receipt.packetSha256 === packet.sha256, `${packet.packetId}: receipt identity mismatch`);
    assert(receipt.outputSha256 === sha256(outputBytes) && receipt.validation === "PASS", `${packet.packetId}: receipt/output mismatch`);
    packetOutputs.push(outputBytes);
    candidateRows.push(...rows);
    outputFreeze.push({ packetId: packet.packetId, path: outputPath, sha256: sha256(outputBytes), rowCount: rows.length, queueIndexStart: rows[0].queueIndex, queueIndexEnd: rows.at(-1)!.queueIndex });
  }

  assert(candidateRows.length === manifest.targetCount, "aggregate row count mismatch");
  for (const [index, row] of candidateRows.entries()) {
    const expected = population[index];
    assert(row.queueIndex === index + 1, `queue index mismatch at ${index + 1}`);
    assert(row.packetId === expected.packetId && row.bankPath === expected.bankPath && row.parentCaseId === expected.parentCaseId && row.partId === expected.partId, `identity mismatch at queue ${index + 1}`);
  }

  const aggregate = Buffer.concat(packetOutputs);
  const aggregatePath = resolve(ROOT, "candidate-adjudication.jsonl");
  await writeFile(aggregatePath, aggregate);
  assert((await readFile(aggregatePath)).equals(aggregate), "aggregate is not exact packet concatenation");

  const byVerdict = counts(candidateRows.map(({ verdict }) => verdict));
  const byBilingual = counts(candidateRows.map(({ bilingualRelation }) => bilingualRelation));
  const byBank = counts(candidateRows.map(({ bankPath }) => bankPath));
  const byItemType = counts(population.map(({ itemType }) => itemType));
  const byPartOrdinal = counts(population.map(({ partOrdinal }) => String(partOrdinal)));
  const byStageCount = counts(population.map(({ declaredStageIds }) => String(declaredStageIds.length)));
  const distinctCasesByVerdict = Object.fromEntries(Object.keys(byVerdict).sort().map((verdict) => [verdict, new Set(candidateRows.filter((row) => row.verdict === verdict).map((row) => `${row.bankPath}|${row.parentCaseId}`)).size]));
  const report = [
    "# Campaign 16 Phase E R1 — Candidate Semantic Census",
    "",
    "Status: **PRODUCER CANDIDATE — NOT ACCEPTED DISPOSITION**",
    "",
    "This Stage 1 artifact records Codex/GPT candidate classifications only. It is not Phase E closeout, does not authorize repair, and has not been independently checked. Stage 2, Stage 3, Phase F, and the checker root remain closed.",
    "",
    "## Scope and isolation",
    "",
    `- Frozen live population: **${manifest.targetCount}** targets across **${manifest.parentCaseCount}** parent cases and **${manifest.packetCount}** packets.`,
    `- Candidate coverage: **${candidateRows.length}/${manifest.targetCount}**, exact queue order and identity.`,
    `- Semantic contexts: **${contexts.length}/${manifest.packetCount}**; one fresh context per packet, with packet/output hashes frozen in \`semantic-contexts.jsonl\`.`,
    "- Each context received one packet and the closed semantic contract only; no running totals, historical semantic outputs, checker output, or repair proposals were supplied.",
    "- Every packet output passed the Phase-E-local candidate validator before acceptance. Aggregate rows are an exact byte concatenation of accepted packet outputs; no semantic row was rewritten by orchestration.",
    "",
    "## Candidate counts",
    "",
    table(byVerdict, "Primary verdict"),
    "",
    table(distinctCasesByVerdict, "Primary verdict", "Distinct parent cases"),
    "",
    table(byBilingual, "Bilingual relation"),
    "",
    table(byBank, "Bank"),
    "",
    table(byItemType, "Item type"),
    "",
    table(byPartOrdinal, "Part ordinal"),
    "",
    table(byStageCount, "Declared stage count"),
    "",
    "## Evidence summary",
    "",
    `- Candidate LEAK rows cite ${candidateRows.filter(({ verdict }) => verdict === "LEAK").reduce((sum, row) => sum + row.unsafeStageIds.length, 0)} unsafe-stage references.`,
    `- All ${candidateRows.length} rows carry part evidence and stage evidence validated against their frozen packet catalogs.`,
    "- `REVIEW` remains a bounded candidate disposition where authored progression cannot safely be recovered; it is not forced into leak/no-leak.",
    "- Counts are descriptive Stage 1 output only. They were not exposed to packet-scoped semantic contexts and are not accepted Phase E dispositions.",
    "",
  ].join("\n");
  await writeFile(resolve(ROOT, "candidate-report.md"), report);

  const freeze = {
    freezeVersion: "1.0",
    status: "PRODUCER_CANDIDATE_NOT_ACCEPTED",
    workOrderSha256: WORK_ORDER_SHA256,
    bankSnapshotSha256: manifest.bankSnapshotSha256,
    bankFiles: manifest.bankFiles,
    population: { path: "population.jsonl", sha256: sha256(populationText), rowCount: population.length },
    populationSummary: { path: "population-summary.json", sha256: sha256(await readFile(resolve(ROOT, "population-summary.json"))) },
    packetManifest: { path: "packet-manifest.json", sha256: sha256(manifestText), packetCount: manifest.packetCount },
    semanticContexts: { path: "semantic-contexts.jsonl", sha256: sha256(contextsText), rowCount: contexts.length },
    packetOutputs: outputFreeze,
    candidateAdjudication: { path: "candidate-adjudication.jsonl", sha256: sha256(aggregate), rowCount: candidateRows.length, exactPacketConcatenation: true },
    candidateReport: { path: "candidate-report.md", sha256: sha256(report) },
    counts: { byVerdict, byBilingualRelation: byBilingual, byBank, byItemType, byPartOrdinal, byDeclaredStageCount: byStageCount },
    boundary: { checkerRootCreated: false, stage2Performed: false, stage3Performed: false, phaseFStarted: false, repairAuthority: false },
  };
  await writeFile(resolve(ROOT, "candidate-freeze.json"), `${JSON.stringify(freeze, null, 2)}\n`);
  console.log(`candidate freeze ready: packets=${manifest.packetCount} rows=${candidateRows.length} aggregateSha256=${sha256(aggregate)}`);
}

await main();
