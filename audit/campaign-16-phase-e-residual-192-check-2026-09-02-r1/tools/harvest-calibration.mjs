import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { parseJsonl, validate } from "./validate-output.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const shaBytes = (v) => crypto.createHash("sha256").update(v).digest("hex");
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const append = (p, value) => fs.appendFileSync(path.join(ROOT, p), `${JSON.stringify(value)}\n`);
const args = process.argv.slice(2), pidx = args.indexOf("--packet"), aidx = args.indexOf("--attempt");
if (pidx < 0) throw new Error("usage: harvest-calibration.mjs --packet <id> [--attempt 1]");
const packetId = args[pidx + 1], attempt = aidx < 0 ? 1 : Number(args[aidx + 1]);
const lockRel = `locks/${packetId}-attempt-${attempt}.json`, outputRel = `outputs/${packetId}-attempt-${attempt}.jsonl`, rawRel = `raw/${packetId}-attempt-${attempt}.cli.json`, processRel = `raw/${packetId}-attempt-${attempt}.process.json`, packetRel = `packets/${packetId}.json`;
if (fs.existsSync(path.join(ROOT, lockRel))) { console.log(JSON.stringify({ packetId, attempt, status: "ALREADY_LOCKED_UNCHANGED", lockSha256: shaBytes(fs.readFileSync(path.join(ROOT, lockRel))) })); process.exit(0); }
for (const p of [outputRel, rawRel, processRel, packetRel]) if (!fs.existsSync(path.join(ROOT, p))) { console.log(JSON.stringify({ packetId, attempt, status: "MISSING_ARTIFACT", path: p })); process.exit(2); }
const packetBytes = fs.readFileSync(path.join(ROOT, packetRel)), outputBytes = fs.readFileSync(path.join(ROOT, outputRel));
const packet = JSON.parse(packetBytes), processReceipt = readJson(processRel);
let rows, validation;
try { rows = parseJsonl(outputBytes.toString("utf8")); validation = validate(packet, rows); } catch (error) { validation = { ok: false, packetId, gates: { G1: "FAIL" }, errors: [error.message] }; rows = []; }
if (!validation.ok) { console.log(JSON.stringify({ packetId, attempt, status: "VALIDATION_FAIL", validation }, null, 2)); process.exit(3); }
const keyRows = readJson("sealed/control-key.json").rows.filter((x) => x.packetId === packetId), key = new Map(keyRows.map((x) => [x.rowToken, x]));
const rowMap = readJson("sealed/row-map.json").rows.filter((x) => x.packetId === packetId), map = new Map(rowMap.map((x) => [x.rowToken, x]));
const controlResults = [];
for (const row of rows.filter((x) => key.has(x.rowToken))) {
  const expected = key.get(row.rowToken), expectedNoLeak = expected.expectedPrimaryVerdict.startsWith("NO_LEAK_"), returnedNoLeak = row.verdict.startsWith("NO_LEAK_");
  const primaryPass = expectedNoLeak ? returnedNoLeak : row.verdict === expected.expectedPrimaryVerdict;
  const subclassAdvisory = expectedNoLeak && returnedNoLeak && row.verdict !== expected.expectedPrimaryVerdict;
  const locusPass = expected.expectedPrimaryVerdict !== "LEAK" || (row.verdict === "LEAK" && row.locus.stageId === expected.expectedSingleUnsafeStageId);
  const bilingualPass = row.bilingualRelation === expected.expectedBilingualRelation;
  controlResults.push({ rowToken: row.rowToken, sourceStage2QueueIndex: expected.sourceStage2QueueIndex, expectedPrimaryVerdict: expected.expectedPrimaryVerdict, returnedPrimaryVerdict: row.verdict, primaryPass, expectedSingleUnsafeStageId: expected.expectedSingleUnsafeStageId, returnedLocusStageId: row.locus.stageId, locusPass, expectedBilingualRelation: expected.expectedBilingualRelation, returnedBilingualRelation: row.bilingualRelation, bilingualPass, noLeakSubclassAdvisory: subclassAdvisory });
}
if (controlResults.length !== 4) throw new Error(`control scoring count ${controlResults.length}`);
const voidPacket = controlResults.some((x) => !x.primaryPass || !x.locusPass);
const lock = { lockVersion: "1.0", packetId, attempt, lockedAtUtc: new Date().toISOString(), packet: { path: packetRel, sha256: shaBytes(packetBytes), bytes: packetBytes.length }, output: { path: outputRel, sha256: shaBytes(outputBytes), bytes: outputBytes.length, rows: rows.length }, rawCliResponse: { path: rawRel, sha256: shaBytes(fs.readFileSync(path.join(ROOT, rawRel))) }, processReceipt: { path: processRel, sha256: shaBytes(fs.readFileSync(path.join(ROOT, processRel))) }, mechanicalValidation: validation, controlScoring: { controls: controlResults, primaryPassCount: controlResults.filter((x) => x.primaryPass).length, locusPassCount: controlResults.filter((x) => x.locusPass).length, bilingualPassCount: controlResults.filter((x) => x.bilingualPass).length, noLeakSubclassAdvisories: controlResults.filter((x) => x.noLeakSubclassAdvisory).length, bilingualDiscriminatingPower: "NONE_ALL_FROZEN_CONTROLS_PARALLEL", packetVoid: voidPacket }, calibrationLiveDisposition: voidPacket ? "VOID_DISCARDED_NOT_ADMITTED" : "ESCROW_ONLY_NOT_ADMITTED", mainAdjudicationAdmission: false };
fs.writeFileSync(path.join(ROOT, lockRel), `${JSON.stringify(lock, null, 2)}\n`);
const semantic = processReceipt.semanticMetadata ?? {};
append("semantic-contexts.jsonl", { receiptVersion: "1.0", packetId, attempt, semanticTemplateSha256: processReceipt.semanticTemplate.sha256, packetSha256: processReceipt.packet.sha256, outputSha256: lock.output.sha256, rawCliResponseSha256: lock.rawCliResponse.sha256, sessionId: semantic.sessionId ?? null, requestedModelAlias: processReceipt.invocation.requestedModelAlias, actualModelUsage: semantic.modelUsage ?? null, effort: processReceipt.invocation.effort, startedAtUtc: processReceipt.startedAtUtc, endedAtUtc: processReceipt.endedAtUtc, wallTimeSeconds: processReceipt.wallTimeSeconds, inputTokens: semantic.usage?.input_tokens ?? null, cacheCreationInputTokens: semantic.usage?.cache_creation_input_tokens ?? null, cacheReadInputTokens: semantic.usage?.cache_read_input_tokens ?? null, outputTokens: semantic.usage?.output_tokens ?? null, totalCostUsd: semantic.totalCostUsd ?? null, isolation: { freshProcess: true, safeMode: true, tools: [], disallowedTools: "*", strictMcpConfig: true, slashCommandsDisabled: true, sessionPersistence: false, chrome: false, childCwd: "runtime-sandbox", contentExposure: "frozen semantic template as system prompt plus exactly one frozen calibration packet on stdin" }, mechanicalValidation: "PASS", controlVoid: voidPacket });
const liveRows = rows.filter((x) => map.get(x.rowToken)?.role === "LIVE");
for (const row of liveRows) append("sealed/calibration-escrow.jsonl", { packetId, attempt, packetVoid: voidPacket, escrowStatus: voidPacket ? "VOID_DISCARDED" : "ESCROW_ONLY", mainAdmission: false, identity: map.get(row.rowToken), semanticRow: row, outputSha256: lock.output.sha256 });
const index = readJson("packet-index.json").packets.find((x) => x.packetId === packetId);
const usageModels = semantic.modelUsage ? Object.values(semantic.modelUsage) : [];
append("cost-ledger.jsonl", { packetId, attempt, liveRows: liveRows.length, parentCases: index.liveParentCases, controls: 4, stageCount: index.stageCount, serializedBytes: index.serializedUtf8Bytes, inputTokens: semantic.usage?.input_tokens ?? null, cacheCreationInputTokens: semantic.usage?.cache_creation_input_tokens ?? null, cacheReadInputTokens: semantic.usage?.cache_read_input_tokens ?? null, outputTokens: semantic.usage?.output_tokens ?? null, modelUsageInputTokens: usageModels.reduce((n, x) => n + (x.inputTokens ?? 0) + (x.cacheCreationInputTokens ?? 0) + (x.cacheReadInputTokens ?? 0), 0) || null, modelUsageOutputTokens: usageModels.reduce((n, x) => n + (x.outputTokens ?? 0), 0) || null, wallTimeSeconds: processReceipt.wallTimeSeconds, modelDeployment: Object.keys(semantic.modelUsage ?? {}), effort: processReceipt.invocation.effort, mechanicalFailures: 0, controlVoid: voidPacket, harvested: true, liveRowsAdmitted: false, liveRowsEscrowed: !voidPacket ? liveRows.length : 0, totalCostUsd: semantic.totalCostUsd ?? null });
console.log(JSON.stringify({ packetId, attempt, status: "LOCKED", mechanicalValidation: "PASS", packetVoid: voidPacket, liveRows: liveRows.length, controls: controlResults, lockPath: lockRel }, null, 2));
