import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";

const REPO = resolve(import.meta.dirname, "../..");
const ROOT = resolve(import.meta.dirname);
const ROOT_REL = relative(REPO, ROOT);
const CHECKER = resolve(REPO, "audit/campaign-16-phase-e-stage-reference-check-2026-08-29-r1");
const WORK_ORDER = resolve(REPO, "scratch/CAMPAIGN-16-PHASE-E-STAGE-REFERENCE-SEMANTIC-CENSUS-WORK-ORDER-2026-08-29.md");
const WORK_ORDER_SHA256 = "91e7434905f52ef90f7288def1aa6d17118c3708b7e99d76f0384bfeeafad390";
const POPULATION_SHA256 = "41412491aa1eb186352328bd8ae068180eb82d6ef852a21ce6327886e6adce85";
const POPULATION_SUMMARY_SHA256 = "5046a6c619bba62646765c6cf7f7ea35d33ad3e58cc799307a9e64eaf0ac6351";
const PACKET_MANIFEST_SHA256 = "82040a7145f768e1f24a9f69839f41c927e1886e811848776362a3c210662598";
const sha256 = (value: string | Buffer): string => createHash("sha256").update(value).digest("hex");
function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function git(args: string[]): string { return execFileSync("git", args, { cwd: REPO, encoding: "utf8" }).trimEnd(); }
async function fileHash(path: string): Promise<string | null> {
  try { const info = await stat(resolve(REPO, path)); return info.isFile() ? sha256(await readFile(resolve(REPO, path))) : null; } catch { return null; }
}

async function main(): Promise<void> {
  const throughIndex = process.argv.indexOf("--through");
  assert(throughIndex >= 0, "--through required");
  const through = Number(process.argv[throughIndex + 1]);
  assert(Number.isInteger(through) && through >= 0 && through <= 75, "invalid --through");
  assert(sha256(await readFile(WORK_ORDER)) === WORK_ORDER_SHA256, "work-order hash changed");
  const opening = JSON.parse(await readFile(resolve(ROOT, "opening-state.json"), "utf8")) as {
    openingStatusPorcelainV1: Array<{ status: string; path: string }>;
    openingDirtyPaths: Array<{ status: string; path: string; worktreeSha256: string | null; indexBlob: string | null }>;
    bundledBanks: Array<{ bankPath: string; sha256: string }>;
  };
  assert(sha256(await readFile(resolve(ROOT, "population.jsonl"))) === POPULATION_SHA256, "population hash changed");
  assert(sha256(await readFile(resolve(ROOT, "population-summary.json"))) === POPULATION_SUMMARY_SHA256, "population-summary hash changed");
  assert(sha256(await readFile(resolve(ROOT, "packet-manifest.json"))) === PACKET_MANIFEST_SHA256, "packet-manifest hash changed");
  const manifest = JSON.parse(await readFile(resolve(ROOT, "packet-manifest.json"), "utf8")) as { packets: Array<{ packetId: string; path: string; sha256: string }> };
  for (const packet of manifest.packets) assert(sha256(await readFile(resolve(ROOT, packet.path))) === packet.sha256, `${packet.packetId}: packet hash changed`);
  for (const bank of opening.bundledBanks) assert(await fileHash(bank.bankPath) === bank.sha256, `${bank.bankPath}: bank hash changed`);
  const currentStatus = execFileSync("git", ["-c", "core.quotepath=false", "status", "--porcelain=v1", "--untracked-files=all"], { cwd: REPO, encoding: "utf8" })
    .split(/\r?\n/u).filter(Boolean).map((line) => ({ status: line.slice(0, 2), path: line.slice(3) }))
    .filter(({ path }) => !path.startsWith(`${ROOT_REL}/`));
  assert(JSON.stringify(currentStatus) === JSON.stringify(opening.openingStatusPorcelainV1), "unexpected path/status drift outside producer root");
  for (const entry of opening.openingDirtyPaths) {
    assert(await fileHash(entry.path) === entry.worktreeSha256, `${entry.path}: opening worktree bytes changed`);
    if (entry.status !== "??") {
      const line = git(["ls-files", "-s", "--", entry.path]).split(/\r?\n/u)[0] ?? "";
      const blob = line === "" ? null : line.split(/\s+/u)[1] ?? null;
      assert(blob === entry.indexBlob, `${entry.path}: opening index blob changed`);
    }
  }
  try { await stat(CHECKER); throw new Error("checker root exists"); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
  const candidateNames = (await readdir(resolve(ROOT, "candidate"))).filter((name) => name.endsWith(".jsonl")).sort();
  const expectedNames = Array.from({ length: through }, (_, index) => `packet-${String(index + 1).padStart(3, "0")}.jsonl`);
  assert(JSON.stringify(candidateNames) === JSON.stringify(expectedNames), "candidate output set differs from checkpoint");
  const receiptLines = (await readFile(resolve(ROOT, "semantic-contexts.jsonl"), "utf8")).split(/\r?\n/u).filter(Boolean);
  assert(receiptLines.length === through, "semantic-context receipt count mismatch");
  for (const [index, line] of receiptLines.entries()) {
    const receipt = JSON.parse(line) as { packetId: string; packetSha256: string; outputPath: string; outputSha256: string; semanticContext: { freshContext: boolean; packetCount: number } };
    const packet = manifest.packets[index];
    assert(receipt.packetId === packet.packetId && receipt.packetSha256 === packet.sha256, `${packet.packetId}: receipt packet mismatch`);
    assert(sha256(await readFile(resolve(ROOT, receipt.outputPath))) === receipt.outputSha256, `${packet.packetId}: accepted output bytes changed`);
    assert(receipt.semanticContext.freshContext && receipt.semanticContext.packetCount === 1, `${packet.packetId}: context isolation receipt invalid`);
  }
  const result = {
    resumabilityVersion: "1.0",
    status: "PASS",
    completedPackets: through,
    nextPacket: through < 75 ? `packet-${String(through + 1).padStart(3, "0")}` : null,
    workOrderSha256: WORK_ORDER_SHA256,
    bankHashes: `PASS ${opening.bundledBanks.length}/${opening.bundledBanks.length}`,
    packetHashes: `PASS ${manifest.packets.length}/${manifest.packets.length}`,
    acceptedOutputHashes: `PASS ${through}/${through}`,
    openingWorktreeAndIndexPreservation: `PASS ${opening.openingDirtyPaths.length}/${opening.openingDirtyPaths.length}`,
    unexpectedPathsOutsideProducerRoot: 0,
    checkerRootAbsent: true,
    continuationContract: "next packet uses a fresh context with no running verdict totals",
  };
  const checkpoint = `resumability-checkpoint-${String(through).padStart(3, "0")}.json`;
  await writeFile(resolve(ROOT, checkpoint), `${JSON.stringify(result, null, 2)}\n`);
  console.log(`PHASE_E_RESUMABILITY_PASS completed=${through} next=${result.nextPacket ?? "none"}`);
}

await main();
