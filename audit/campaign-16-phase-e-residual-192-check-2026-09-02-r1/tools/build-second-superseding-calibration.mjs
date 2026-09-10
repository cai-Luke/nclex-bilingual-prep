import fs from "node:fs";
import path from "node:path";
import { ROOT, REPO, PROD, WORK_ORDER_SHA, SEED, MAX_BYTES, identity, shaBytes, compact, collectSourceCases, buildPacket, tokenFor } from "./build-calibration.mjs";

const packetId = "cal-a-superseding-2", supersedesPacketId = "cal-a-superseding-1";
const packetPath = path.join(ROOT, "packets", `${packetId}.json`);
if (fs.existsSync(packetPath)) throw new Error(`immutable superseding packet already exists: ${packetPath}`);
const text = (p) => fs.readFileSync(path.join(REPO, p), "utf8"), json = (p) => JSON.parse(text(p));
const jsonl = (p) => text(p).split(/\r?\n/u).filter(Boolean).map(JSON.parse), pretty = (v) => `${JSON.stringify(v, null, 2)}\n`, assert = (c, m) => { if (!c) throw new Error(m); };
const residual = jsonl(path.relative(REPO, path.join(ROOT, "residual-population.jsonl"))), population = jsonl(`${PROD}/population.jsonl`), populationByIdentity = new Map(population.map((r) => [identity(r), r]));
const source = collectSourceCases(json(`${PROD}/packet-manifest.json`));
const rowMapDoc = json(path.relative(REPO, path.join(ROOT, "sealed/row-map.json"))), keyDoc = json(path.relative(REPO, path.join(ROOT, "sealed/control-key.json")));
const residualByQueue = new Map(residual.map((r) => [r.queueIndex, r]));
const liveRows = rowMapDoc.rows.filter((r) => r.packetId === supersedesPacketId && r.role === "LIVE").map((r) => residualByQueue.get(r.queueIndex));
assert(liveRows.length === 9 && liveRows.every(Boolean), "SECOND_SUPERSEDING_LIVE_RECONCILIATION");
const exposures = jsonl(path.relative(REPO, path.join(ROOT, "control-exposure-log.jsonl"))), usedQueue = new Set(exposures.map((x) => x.sourceStage2QueueIndex));
const pool = json(path.relative(REPO, path.join(ROOT, "sealed/control-pool.json"))), excludedParents = new Set(liveRows.map((r) => r.parentCaseId));
const positives = pool.positive.filter((r) => !usedQueue.has(r.queueIndex) && !excludedParents.has(r.parentCaseId)), negatives = pool.negative.filter((r) => !usedQueue.has(r.queueIndex) && !excludedParents.has(r.parentCaseId));
const pGroups = new Map(); for (const r of positives) { if (!pGroups.has(r.parentCaseId)) pGroups.set(r.parentCaseId, []); pGroups.get(r.parentCaseId).push(r); }
const candidates = [];
for (const [parent, rows] of pGroups) if (rows.length >= 3) for (const negative of negatives) {
  const rankedRows = [...rows].sort((a, b) => shaBytes(`${SEED}|${packetId}|positive|${identity(a)}`).localeCompare(shaBytes(`${SEED}|${packetId}|positive|${identity(b)}`)));
  const controls = [...rankedRows.slice(0, 3), negative];
  const entries = [...liveRows.map((row) => ({ row, role: "LIVE", rowToken: tokenFor(packetId, row) })), ...controls.map((expected) => ({ row: populationByIdentity.get(identity(expected)), role: "CONTROL", expected, checkerRowSha256: expected.checkerRowSha256, rowToken: tokenFor(packetId, expected) }))];
  if (!entries.every((x) => x.row)) continue;
  const packet = buildPacket(packetId, entries, source.cases), bytes = Buffer.byteLength(`${compact(packet)}\n`, "utf8");
  if (bytes <= MAX_BYTES) candidates.push({ parent, negativeParent: negative.parentCaseId, controls, entries, packet, bytes, parentCount: new Set(controls.map((r) => r.parentCaseId)).size, rank: shaBytes(`${SEED}|${packetId}|controls|${controls.map(identity).sort().join("|")}`) });
}
candidates.sort((a, b) => a.parentCount - b.parentCount || a.rank.localeCompare(b.rank));
assert(candidates.length > 0, "SECOND_SUPERSEDING_FRESH_CONTROL_PACKET_CEILING");
const chosen = candidates[0]; fs.writeFileSync(packetPath, `${compact(chosen.packet)}\n`);
const compare = path.join(ROOT, ".determinism-superseding-2"); fs.mkdirSync(compare); const rebuiltPath = path.join(compare, `${packetId}.json`); fs.writeFileSync(rebuiltPath, `${compact(buildPacket(packetId, chosen.entries, source.cases))}\n`); const byteIdentical = fs.readFileSync(packetPath).equals(fs.readFileSync(rebuiltPath)); fs.rmSync(compare, { recursive: true }); assert(byteIdentical, "SECOND_SUPERSEDING_NONDETERMINISTIC");
for (const entry of chosen.entries) rowMapDoc.rows.push({ packetId, rowToken: entry.rowToken, role: entry.role, queueIndex: entry.row.queueIndex, bankPath: entry.row.bankPath, parentCaseId: entry.row.parentCaseId, partId: entry.row.partId, sourcePacketId: source.cases.get(entry.row.parentCaseId).sourcePacketId, sourcePacketSha256: source.cases.get(entry.row.parentCaseId).sourcePacketSha256, supersedesPacketId });
for (const entry of chosen.entries.filter((x) => x.role === "CONTROL")) keyDoc.rows.push({ packetId, rowToken: entry.rowToken, sourceStage2QueueIndex: entry.expected.queueIndex, expectedPrimaryVerdict: entry.expected.verdict, expectedNoLeakSubclass: entry.expected.verdict.startsWith("NO_LEAK_") ? entry.expected.verdict : null, expectedSingleUnsafeStageId: entry.expected.verdict === "LEAK" ? entry.expected.unsafeStageIds[0] : null, expectedBilingualRelation: entry.expected.bilingualRelation, checkerRowSha256: entry.expected.checkerRowSha256, checkerAdjudicationSha256: pool.sourceCheckerAdjudication.sha256 });
fs.writeFileSync(path.join(ROOT, "sealed/row-map.json"), pretty(rowMapDoc)); fs.writeFileSync(path.join(ROOT, "sealed/control-key.json"), pretty(keyDoc));
const index = json(path.relative(REPO, path.join(ROOT, "packet-index.json"))), packetSha256 = shaBytes(fs.readFileSync(packetPath)); index.packets.push({ packetId, path: `packets/${packetId}.json`, supersedesPacketId, supersedingReason: "MECHANICAL_FAILURE_AFTER_BOUNDED_RETRY", nominalLiveTarget: 8, liveRows: 9, liveParentCases: new Set(liveRows.map((r) => r.parentCaseId)).size, controls: 4, totalTargets: chosen.packet.targetCount, stageCount: chosen.packet.cases.reduce((n, c) => n + c.stages.length, 0), serializedUtf8Bytes: chosen.bytes, compactSerializedUtf8Bytes: chosen.bytes - 1, stoppedByByteCeilingBeforeNominal: false, sha256: packetSha256, liveQueueIndices: liveRows.map((r) => r.queueIndex) }); fs.writeFileSync(path.join(ROOT, "packet-index.json"), pretty(index));
const manifest = { supersedingBuildVersion: "2.0", packetId, supersedesPacketId, reason: "mechanical G4 failure remained after one bounded fresh-context retry; affected live rows re-packeted without semantic repair", seed: SEED, workOrderSha256: WORK_ORDER_SHA, liveRows: liveRows.length, liveQueueIndices: liveRows.map((r) => r.queueIndex), controls: chosen.controls.map((r) => ({ queueIndex: r.queueIndex, role: r.verdict === "LEAK" ? "POSITIVE_SINGLE_UNSAFE" : "NEGATIVE_NO_LEAK", parentCaseId: r.parentCaseId })), controlParentCaseCount: chosen.parentCount, noPriorControlExposure: chosen.controls.every((r) => !usedQueue.has(r.queueIndex)), noControlLiveParentCollision: chosen.controls.every((r) => !excludedParents.has(r.parentCaseId)), packet: { path: `packets/${packetId}.json`, sha256: packetSha256, bytes: chosen.bytes }, deterministicRebuild: { byteIdentical, temporarySurfaceRemoved: true }, preservedFailureHistory: [`outputs/${supersedesPacketId}-attempt-1.jsonl`, `outputs/${supersedesPacketId}-attempt-2.jsonl`] };
fs.writeFileSync(path.join(ROOT, "second-superseding-calibration-build-manifest.json"), pretty(manifest)); console.log(JSON.stringify(manifest, null, 2));
