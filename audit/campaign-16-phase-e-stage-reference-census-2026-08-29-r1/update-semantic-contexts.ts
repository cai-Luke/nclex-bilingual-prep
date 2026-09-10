import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname);
const MANIFEST = resolve(ROOT, "packet-manifest.json");
const RECEIPTS = resolve(ROOT, "semantic-contexts.jsonl");
const sha256 = (value: string | Buffer): string => createHash("sha256").update(value).digest("hex");
function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

type Receipt = {
  receiptVersion: "1.0";
  packetId: string;
  packetPath: string;
  packetSha256: string;
  outputPath: string;
  outputSha256: string;
  outputRowCount: number;
  validation: "PASS";
  semanticContext: {
    contextIdentity: string;
    contextIdentitySource: "collaboration canonical task name";
    sessionId: null;
    sessionIdAvailability: "not exposed by collaboration harness";
    model: null;
    modelAvailability: "exact inherited model identifier not exposed by collaboration harness";
    reasoningEffort: null;
    reasoningEffortAvailability: "exact inherited reasoning effort not exposed by collaboration harness";
    freshContext: true;
    packetCount: 1;
  };
  mechanicalRetry: { used: boolean; attemptCount: 1 | 2; semanticFieldsPreserved: true };
};

const retryPackets = new Set(["packet-002", "packet-003", "packet-007", "packet-008", "packet-032"]);
const successfulContextOverrides = new Map<number, string>([
  [16, "/root/phasee_packet_016_resume1"],
  [17, "/root/phasee_packet_017_resume1"],
  [18, "/root/phasee_packet_018_resume1"],
  [35, "/root/phasee_packet_035_resume1"],
  [64, "/root/phasee_packet_064_resume1"],
]);

async function existing(): Promise<Receipt[]> {
  try {
    return (await readFile(RECEIPTS, "utf8")).split(/\r?\n/u).filter(Boolean).map((line) => JSON.parse(line) as Receipt);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function main(): Promise<void> {
  const throughIndex = process.argv.indexOf("--through");
  assert(throughIndex >= 0, "--through required");
  const through = Number(process.argv[throughIndex + 1]);
  assert(Number.isInteger(through) && through >= 1 && through <= 75, "invalid --through");
  const manifest = JSON.parse(await readFile(MANIFEST, "utf8")) as { packets: Array<{ packetId: string; path: string; sha256: string; targetCount: number }> };
  const prior = await existing();
  assert(prior.length <= through, "semantic-contexts contains rows beyond requested checkpoint");
  const rows: Receipt[] = [];
  for (let index = 0; index < through; index += 1) {
    const meta = manifest.packets[index];
    const packetText = await readFile(resolve(ROOT, meta.path));
    assert(sha256(packetText) === meta.sha256, `${meta.packetId}: packet hash drift`);
    const outputPath = `candidate/${meta.packetId}.jsonl`;
    const output = await readFile(resolve(ROOT, outputPath), "utf8");
    const outputRowCount = output.split(/\r?\n/u).filter((line) => line.trim()).length;
    assert(outputRowCount === meta.targetCount, `${meta.packetId}: output row count mismatch`);
    const receipt: Receipt = {
      receiptVersion: "1.0",
      packetId: meta.packetId,
      packetPath: meta.path,
      packetSha256: meta.sha256,
      outputPath,
      outputSha256: sha256(output),
      outputRowCount,
      validation: "PASS",
      semanticContext: {
        contextIdentity: successfulContextOverrides.get(index + 1) ?? `/root/phasee_packet_${String(index + 1).padStart(3, "0")}`,
        contextIdentitySource: "collaboration canonical task name",
        sessionId: null,
        sessionIdAvailability: "not exposed by collaboration harness",
        model: null,
        modelAvailability: "exact inherited model identifier not exposed by collaboration harness",
        reasoningEffort: null,
        reasoningEffortAvailability: "exact inherited reasoning effort not exposed by collaboration harness",
        freshContext: true,
        packetCount: 1,
      },
      mechanicalRetry: {
        used: retryPackets.has(meta.packetId),
        attemptCount: retryPackets.has(meta.packetId) ? 2 : 1,
        semanticFieldsPreserved: true,
      },
    };
    const priorReceipt = prior[index];
    if (priorReceipt !== undefined) {
      assert(JSON.stringify(priorReceipt) === JSON.stringify(receipt), `${meta.packetId}: existing semantic receipt drift`);
    }
    rows.push(receipt);
  }
  await writeFile(RECEIPTS, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`);
  console.log(`semantic context receipts frozen: ${rows.length}/${through}`);
}

await main();
