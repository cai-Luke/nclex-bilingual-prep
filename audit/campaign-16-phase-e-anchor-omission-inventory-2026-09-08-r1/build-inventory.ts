/**
 * Campaign 16 Phase E — frozen pre-repair anchor-omission inventory builder.
 *
 * Deterministic and pure. Reads ONLY the frozen governing Phase E Stage-0
 * population artifact and writes `frozen-inventory.jsonl` beside this file.
 * It never reads or writes a bank, and it makes no semantic judgement.
 *
 * Reproducibility contract: running this twice from the same input must
 * produce byte-identical output whose SHA-256 equals `inventorySha256` in
 * `inventory-summary.json`.
 *
 *   npx tsx audit/campaign-16-phase-e-anchor-omission-inventory-2026-09-08-r1/build-inventory.ts
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..");
const SOURCE = join(
  REPO,
  "audit",
  "campaign-16-phase-e-stage-reference-census-2026-08-29-r1",
  "population.jsonl",
);
const OUT = join(HERE, "frozen-inventory.jsonl");

type AnchorFieldState = { status: "absent" } | { status: "unresolved"; value: string };

type PopulationRow = {
  queueIndex: number;
  packetId: string;
  bankPath: string;
  bankSha256: string;
  parentCaseId: string;
  partId: string;
  casePath: string;
  partPath: string;
  partOrdinal: number;
  casePartCount: number;
  itemType: string;
  anchorState: { answerableAfterStageId: AnchorFieldState; stageId: AnchorFieldState };
  declaredStageIds: string[];
  rendererVisibleStageIds: string[];
};

const sha16 = (value: string): string =>
  createHash("sha256").update(value, "utf8").digest("hex").slice(0, 16);

export function buildInventory(rows: PopulationRow[]): string[] {
  const ordered = [...rows].sort((a, b) => a.queueIndex - b.queueIndex);

  const keyOf = (row: PopulationRow) => `${row.bankPath}\u0000${row.parentCaseId}`;

  const affectedPerParent = new Map<string, number>();
  const partsPerParent = new Map<string, number>();
  const firstQueueIndex = new Map<string, number>();
  for (const row of ordered) {
    const key = keyOf(row);
    affectedPerParent.set(key, (affectedPerParent.get(key) ?? 0) + 1);
    partsPerParent.set(key, row.casePartCount);
    if (!firstQueueIndex.has(key)) firstQueueIndex.set(key, row.queueIndex);
  }

  // Packet assignment: parents in order of first appearance in the frozen queue.
  // A packet never spans two banks and never splits a parent case; ordinary
  // packets carry at most 20 rows, and a single parent larger than that would
  // become its own oversized packet rather than being cut.
  const parentKeys = [...firstQueueIndex.keys()].sort(
    (a, b) => firstQueueIndex.get(a)! - firstQueueIndex.get(b)!,
  );
  const packetOf = new Map<string, number>();
  let packetId = 1;
  let inPacket = 0;
  let previousBank = parentKeys.length > 0 ? parentKeys[0].split("\u0000")[0] : "";
  for (const parentKey of parentKeys) {
    const bank = parentKey.split("\u0000")[0];
    const size = affectedPerParent.get(parentKey)!;
    if (inPacket > 0 && (inPacket + size > 20 || bank !== previousBank)) {
      packetId += 1;
      inPacket = 0;
    }
    previousBank = bank;
    packetOf.set(parentKey, packetId);
    inPacket += size;
  }

  return ordered.map((row) => {
    const key = keyOf(row);
    return JSON.stringify({
      rowKey: sha16(
        `phase-e-anchor-omission-row|${row.bankPath}|${row.parentCaseId}|${row.partId}`,
      ),
      caseKey: sha16(`phase-e-anchor-omission-case|${row.bankPath}|${row.parentCaseId}`),
      stage0QueueIndex: row.queueIndex,
      repairPacketId: `repair-${String(packetOf.get(key)).padStart(3, "0")}`,
      bankPath: row.bankPath,
      parentCaseId: row.parentCaseId,
      partId: row.partId,
      casePath: row.casePath,
      partPath: row.partPath,
      partOrdinal: row.partOrdinal,
      casePartCount: row.casePartCount,
      parentAffectedRowCount: affectedPerParent.get(key),
      parentFullyAffected: affectedPerParent.get(key) === partsPerParent.get(key),
      itemType: row.itemType,
      declaredStageIds: row.declaredStageIds,
      affectedCondition: "BOTH_ANCHORS_ABSENT",
    });
  });
}

function main(): void {
  const raw = readFileSync(SOURCE, "utf8");
  const rows: PopulationRow[] = raw
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as PopulationRow);

  if (rows.length !== 451) {
    console.error(`Source population is ${rows.length} rows; expected the frozen 451.`);
    process.exit(1);
  }

  const offenders = rows.filter(
    (row) =>
      row.anchorState.answerableAfterStageId.status !== "absent" ||
      row.anchorState.stageId.status !== "absent",
  );
  if (offenders.length > 0) {
    console.error(
      `Source population contains ${offenders.length} row(s) that are not pure omission cases. ` +
        "The inventory's affectedCondition would be wrong; refusing to write.",
    );
    process.exit(1);
  }

  const body = buildInventory(rows).join("\n") + "\n";
  writeFileSync(OUT, body, "utf8");

  const digest = createHash("sha256").update(body, "utf8").digest("hex");
  console.log(`rows:   ${rows.length}`);
  console.log(`bytes:  ${Buffer.byteLength(body, "utf8")}`);
  console.log(`sha256: ${digest}`);
}

if (process.argv[1] && process.argv[1].endsWith("build-inventory.ts")) main();
