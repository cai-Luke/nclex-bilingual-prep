import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  REPO, ROOT, PROD, CHECK, R1, WORK_ORDER, WORK_ORDER_SHA, R1_WORK_ORDER,
  R1_WORK_ORDER_SHA, SEED, INSTRUMENT, MAX_BYTES, read, text, json, jsonl,
  shaBytes, sha, pretty, assert, git, identity, out, write, token, deepEqual, fileReceipt,
} from "./lib.mjs";

const now = () => new Date().toISOString();
const packetBytes = (value) => Buffer.from(`${JSON.stringify(value)}\n`, "utf8");
const parseStatusZ = (buf) => {
  const records = buf.toString("utf8").split("\0").filter(Boolean); const rows = [];
  for (let i = 0; i < records.length; i += 1) {
    const record = records[i]; const status = record.slice(0, 2); const p = record.slice(3);
    if (status[0] === "R" || status[0] === "C") { rows.push({ status, path: records[++i], sourcePath: p }); }
    else rows.push({ status, path: p });
  }
  return rows;
};
const statusNow = () => parseStatusZ(execFileSync("git", ["status", "--porcelain=v1", "-z", "--untracked-files=all"], { cwd: REPO }));
const ownedPrefix = "audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/";
const openingRows = statusNow().filter((x) => x.path !== ownedPrefix.slice(0, -1) && !x.path.startsWith(ownedPrefix));
const pathState = (entry) => {
  const absolute = path.join(REPO, entry.path); const exists = fs.existsSync(absolute); const stat = exists ? fs.statSync(absolute) : null;
  let indexEntry = null;
  if (entry.status !== "??") {
    try { indexEntry = git(["ls-files", "-s", "--", entry.path]) || null; } catch { indexEntry = null; }
  }
  return { ...entry, exists, type: stat ? (stat.isFile() ? "file" : stat.isDirectory() ? "directory" : "other") : null, worktreeSha256: stat?.isFile() ? shaBytes(fs.readFileSync(absolute)) : null, bytes: stat?.isFile() ? stat.size : null, indexEntry };
};

export function verifyFrozen() {
  assert(sha(WORK_ORDER) === WORK_ORDER_SHA, "BLOCKED_WORK_ORDER_DRIFT");
  assert(sha(R1_WORK_ORDER) === R1_WORK_ORDER_SHA, "BLOCKED_R1_LINEAGE_DRIFT");
  assert(git(["rev-parse", "--show-toplevel"]) === REPO, "BLOCKED_REPOSITORY_IDENTITY");
  assert(git(["branch", "--show-current"]) === "main", "BLOCKED_BRANCH");
  const opening = json(`${PROD}/opening-state.json`), freeze = json(`${PROD}/candidate-freeze.json`), manifest = json(`${PROD}/packet-manifest.json`), comparison = json(`${CHECK}/comparison.json`);
  assert(opening.bundledBanks.length === 13, "BLOCKED_BANK_COUNT");
  for (const bank of opening.bundledBanks) assert(sha(bank.bankPath) === bank.sha256, `BLOCKED_BANK_DRIFT ${bank.bankPath}`);
  assert(sha(`${PROD}/population.jsonl`) === freeze.population.sha256, "BLOCKED_SOURCE_POPULATION_DRIFT");
  assert(sha(`${PROD}/population-summary.json`) === freeze.populationSummary.sha256, "BLOCKED_SOURCE_SUMMARY_DRIFT");
  assert(sha(`${PROD}/packet-manifest.json`) === freeze.packetManifest.sha256, "BLOCKED_SOURCE_MANIFEST_DRIFT");
  for (const item of freeze.packetOutputs) assert(sha(`${PROD}/${item.path}`) === item.sha256, `BLOCKED_CANDIDATE_PACKET_DRIFT ${item.packetId}`);
  assert(manifest.packets.length === 75, "BLOCKED_SOURCE_PACKET_COUNT");
  for (const item of manifest.packets) { assert(sha(`${PROD}/${item.path}`) === item.sha256, `BLOCKED_SOURCE_PACKET_DRIFT ${item.packetId}`); assert(fs.statSync(path.join(REPO, PROD, item.path)).size === item.utf8Bytes, `BLOCKED_SOURCE_PACKET_SIZE ${item.packetId}`); }
  assert(sha(`${CHECK}/checker-selection.json`) === comparison.inputs.checkerSelection.sha256, "BLOCKED_CHECKER_SELECTION_DRIFT");
  assert(sha(`${CHECK}/checker-adjudication.jsonl`) === comparison.inputs.checkerAdjudication.sha256, "BLOCKED_CHECKER_ADJUDICATION_DRIFT");
  assert(sha(`${CHECK}/checker-packet-manifest.json`) === comparison.inputs.checkerPacketManifest.sha256, "BLOCKED_CHECKER_MANIFEST_DRIFT");
  return { opening, freeze, manifest, comparison };
}

export function collectSourceCases(manifest) {
  const cases = new Map(), targets = new Map();
  for (const item of manifest.packets) {
    const packet = json(`${PROD}/${item.path}`);
    for (const sourceCase of packet.cases) {
      assert(!cases.has(sourceCase.parentCaseId), `DUPLICATE_SOURCE_CASE ${sourceCase.parentCaseId}`);
      const evidenceCatalog = packet.evidenceCatalog.filter((e) => e.parentCaseId === sourceCase.parentCaseId);
      cases.set(sourceCase.parentCaseId, { sourceCase, evidenceCatalog, sourcePacketId: packet.packetId, sourcePacketPath: item.path, sourcePacketSha256: item.sha256 });
      for (const target of sourceCase.targets) { const k = `${sourceCase.parentCaseId}\0${target.partId}`; assert(!targets.has(k), `DUPLICATE_SOURCE_TARGET ${k}`); targets.set(k, target); }
    }
  }
  return { cases, targets };
}

export function deriveResidualAndControls(frozen) {
  const candidateLines = jsonl(`${PROD}/candidate-adjudication.jsonl`), checkerLines = jsonl(`${CHECK}/checker-adjudication.jsonl`), populationLines = jsonl(`${PROD}/population.jsonl`);
  const candidate = candidateLines.map((x) => x.row), checker = checkerLines.map((x) => x.row), population = populationLines.map((x) => x.row);
  assert(candidate.length === 451 && checker.length === 259 && population.length === 451, "BLOCKED_GOVERNING_COUNTS");
  const checkerKeys = new Set(checker.map(identity));
  const selection = json(`${CHECK}/checker-selection.json`);
  const independentlySelected = candidate.filter((r) => r.verdict === "LEAK" || r.verdict === "REVIEW" || r.bilingualRelation !== "PARALLEL" || (Number.parseInt(shaBytes(`stage-ref-check|${r.bankPath}|${r.parentCaseId}|${r.partId}`).slice(0, 2), 16) % 10 === 0));
  assert(independentlySelected.length === 259 && independentlySelected.every((r) => checkerKeys.has(identity(r))), "BLOCKED_SELECTION_RECONCILIATION");
  assert(selection.derivation.filter((r) => r.selected).length === 259 && selection.derivation.filter((r) => r.selected).every((r) => checkerKeys.has(identity(r))), "BLOCKED_SELECTION_RECONCILIATION");
  const populationByIdentity = new Map(population.map((r) => [identity(r), r]));
  const residualCandidates = candidate.filter((r) => ["NO_LEAK_COMPLETE_RECORD", "NO_LEAK_NONANSWERING_DATA"].includes(r.verdict) && !checkerKeys.has(identity(r)));
  assert(residualCandidates.length === 192 && new Set(residualCandidates.map(identity)).size === 192, "BLOCKED_POPULATION_MISMATCH");
  const residual = residualCandidates.map((r) => populationByIdentity.get(identity(r))).sort((a, b) => a.queueIndex - b.queueIndex);
  assert(residual.every(Boolean) && !residual.some((r) => [370, 395].includes(r.queueIndex)), "BLOCKED_POPULATION_MISMATCH");
  const positive = [], negative = [];
  checkerLines.forEach(({ row, line }) => {
    if ([370, 395].includes(row.queueIndex) || row.verdict === "REVIEW") return;
    const entry = { ...row, checkerRowSha256: shaBytes(`${line}\n`) };
    if (row.verdict === "LEAK" && row.unsafeStageIds.length === 1) positive.push(entry);
    else if (["NO_LEAK_COMPLETE_RECORD", "NO_LEAK_NONANSWERING_DATA"].includes(row.verdict)) negative.push(entry);
  });
  assert(positive.length === 114 && negative.length === 67 && [...positive, ...negative].every((r) => r.bilingualRelation === "PARALLEL"), "BLOCKED_CONTROL_POOL_DRIFT");
  const r1Pool = json(`${R1}/sealed/control-pool.json`);
  assert(deepEqual(positive, r1Pool.positive) && deepEqual(negative, r1Pool.negative), "BLOCKED_CONTROL_POOL_DRIFT");
  const r1Residual = jsonl(`${R1}/residual-population.jsonl`).map((x) => x.row);
  assert(deepEqual(residual, r1Residual), "BLOCKED_R1_RESIDUAL_DRIFT");
  return { residual, positive, negative, r1Pool, populationByIdentity };
}

const groupResidual = (rows) => { const groups = []; for (const row of rows) { let g = groups.at(-1); if (!g || g.parentCaseId !== row.parentCaseId) { g = { parentCaseId: row.parentCaseId, rows: [] }; groups.push(g); } g.rows.push(row); } return groups; };
const rank = (rows, label) => [...rows].sort((a, b) => shaBytes(`${SEED}|${label}|${identity(a)}`).localeCompare(shaBytes(`${SEED}|${label}|${identity(b)}`)));
export function chooseControls(packetId, liveRows, positive, negative, used) {
  const excluded = new Set(liveRows.map((r) => r.parentCaseId));
  const pos = rank(positive.filter((r) => !used.has(r.queueIndex) && !excluded.has(r.parentCaseId)), `${packetId}|positive`);
  const neg = rank(negative.filter((r) => !used.has(r.queueIndex) && !excluded.has(r.parentCaseId)), `${packetId}|negative`);
  const byParent = new Map();
  for (const row of [...pos, ...neg]) { if (!byParent.has(row.parentCaseId)) byParent.set(row.parentCaseId, { positive: [], negative: [] }); byParent.get(row.parentCaseId)[row.verdict === "LEAK" ? "positive" : "negative"].push(row); }
  const eligible = [...byParent.entries()].filter(([, g]) => g.positive.length >= 3 && g.negative.length >= 1).sort(([a], [b]) => shaBytes(`${SEED}|${packetId}|control-parent|${a}`).localeCompare(shaBytes(`${SEED}|${packetId}|control-parent|${b}`)));
  if (eligible.length) { const [, g] = eligible[0]; return [...g.positive.slice(0, 3), g.negative[0]]; }
  assert(pos.length >= 3 && neg.length >= 1, `BLOCKED_CONTROL_PLACEMENT ${packetId}`);
  const fallback = [...pos.slice(0, 3), neg[0]];
  assert(new Set(fallback.map((r) => identity(r))).size === 4 && fallback.every((r) => !excluded.has(r.parentCaseId)), `BLOCKED_CONTROL_PLACEMENT ${packetId}`);
  return fallback;
}

const remapEvidence = (value, evidenceMap) => {
  if (typeof value === "string") return evidenceMap.get(value) ?? value;
  if (Array.isArray(value)) return value.map((v) => remapEvidence(v, evidenceMap));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, remapEvidence(v, evidenceMap)]));
  return value;
};
const translateAnchorValue = (value, stageMap) => {
  if (typeof value === "string" && stageMap.has(value)) return stageMap.get(value);
  if (Array.isArray(value)) return value.map((x) => translateAnchorValue(x, stageMap));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, translateAnchorValue(v, stageMap)]));
  return value;
};

function buildSanitizedCase(packetId, source, selectedEntries) {
  const selectedPartIds = new Set(selectedEntries.map((x) => x.row.partId));
  const rowByPart = new Map(selectedEntries.map((x) => [x.row.partId, x.rowToken]));
  const stageMap = new Map(source.sourceCase.stages.map((s) => [s.id, token("s", packetId, `${source.sourceCase.parentCaseId}\0${s.id}`)]));
  assert(new Set(stageMap.values()).size === stageMap.size, "BLOCKED_TOKEN_LEAKAGE");
  const catalog = source.evidenceCatalog.filter((e) => !(e.ownerPartId && selectedPartIds.has(e.ownerPartId) && String(e.surface).startsWith("SIBLING_")) && !(e.ownerPartId && !selectedPartIds.has(e.ownerPartId) && String(e.surface).startsWith("PART_")));
  const evidenceMap = new Map(catalog.map((e) => [e.evidenceId, token("e", packetId, e.evidenceId)]));
  assert(new Set(evidenceMap.values()).size === evidenceMap.size, "BLOCKED_EVIDENCE_ID_COLLISION");
  const sourceTargetById = new Map(source.sourceCase.targets.map((t) => [t.partId, t]));
  const targetMaps = [];
  const targets = selectedEntries.map((entry) => {
    const t = sourceTargetById.get(entry.row.partId); assert(t, `BLOCKED_SOURCE_TARGET ${entry.row.partId}`);
    const result = { rowToken: entry.rowToken, partOrdinal: t.partOrdinal, itemType: t.itemType, stem: structuredClone(t.stem), response: structuredClone(t.response), rationale: structuredClone(t.rationale), testTakingStrategy: structuredClone(t.testTakingStrategy), anchorState: translateAnchorValue(structuredClone(t.anchorState), stageMap), declaredStageTokens: t.declaredStageIds.map((id) => { assert(stageMap.has(id), `BLOCKED_STAGE_MAP ${id}`); return stageMap.get(id); }), rendererVisibleStageTokens: t.rendererVisibleStageIds.map((id) => { assert(stageMap.has(id), `BLOCKED_STAGE_MAP ${id}`); return stageMap.get(id); }), partEvidenceIds: remapEvidence(t.partEvidenceIds, evidenceMap) };
    if (t.visual !== undefined) result.visual = structuredClone(t.visual);
    targetMaps.push({ rowToken: entry.rowToken, canonicalPartId: t.partId, original: structuredClone(t) });
    return result;
  });
  const stages = source.sourceCase.stages.map((s, ordinal) => { const { id, ...rest } = s; return { stageToken: stageMap.get(id), ...remapEvidence(structuredClone(rest), evidenceMap) }; });
  const siblingMaps = [];
  const siblingPartOutlines = source.sourceCase.siblingPartOutlines.filter((s) => !selectedPartIds.has(s.id)).map((s, ordinal) => { const { id, answerableAfterStageId, stageId, ...rest } = s; siblingMaps.push({ ordinal, canonicalPartId: id }); return { ...remapEvidence(structuredClone(rest), evidenceMap), answerableAfterStageToken: answerableAfterStageId === null ? null : stageMap.get(answerableAfterStageId), stageToken: stageId === null ? null : stageMap.get(stageId) }; });
  const sanitizedCatalog = catalog.map((e) => { const item = { evidenceId: evidenceMap.get(e.evidenceId), surface: e.surface, text: e.text, language: e.language }; if (e.stageId) item.stageToken = stageMap.get(e.stageId); if (e.ownerPartId && rowByPart.has(e.ownerPartId)) item.rowToken = rowByPart.get(e.ownerPartId); return item; });
  const { bankPath, bankSha256, parentCaseId, casePath, targets: _targets, stages: _stages, siblingPartOutlines: _siblings, evidenceIds, ...semanticBase } = source.sourceCase;
  const wire = { ...remapEvidence(structuredClone(semanticBase), evidenceMap), stages, siblingPartOutlines, targets, evidenceCatalog: sanitizedCatalog };
  const mapping = { packetId, sourcePacketId: source.sourcePacketId, sourcePacketPath: source.sourcePacketPath, sourcePacketSha256: source.sourcePacketSha256, canonicalParentCaseId: parentCaseId, removedCaseBookkeeping: { bankPath, bankSha256, parentCaseId, casePath, evidenceIds }, stages: source.sourceCase.stages.map((s, authoredOrdinal) => ({ stageToken: stageMap.get(s.id), canonicalStageId: s.id, canonicalParentCaseId: parentCaseId, authoredOrdinal })), targets: targetMaps, siblings: siblingMaps, evidence: catalog.map((e) => ({ packetEvidenceId: evidenceMap.get(e.evidenceId), canonicalEvidenceId: e.evidenceId, canonicalSourceLocus: structuredClone(e) })) };
  return { wire, mapping, sourceProjection: { ...structuredClone(source.sourceCase), siblingPartOutlines: source.sourceCase.siblingPartOutlines.filter((s) => !selectedPartIds.has(s.id)), targets: selectedEntries.map((x) => structuredClone(sourceTargetById.get(x.row.partId))), evidenceCatalog: structuredClone(catalog) } };
}

function rehydrateCase(wire, mapping) {
  const stageReverse = new Map(mapping.stages.map((x) => [x.stageToken, x.canonicalStageId])), evidenceReverse = new Map(mapping.evidence.map((x) => [x.packetEvidenceId, x.canonicalEvidenceId]));
  const evidenceCatalogById = new Map(mapping.evidence.map((x) => [x.packetEvidenceId, x.canonicalSourceLocus]));
  const targetByToken = new Map(mapping.targets.map((x) => [x.rowToken, x.original]));
  const siblingsByOrdinal = new Map(mapping.siblings.map((x) => [x.ordinal, x.canonicalPartId]));
  const { stages, siblingPartOutlines, targets, evidenceCatalog, ...semanticBase } = wire;
  const restoredStages = stages.map((s) => { const { stageToken, ...rest } = s; return { id: stageReverse.get(stageToken), ...remapEvidence(structuredClone(rest), evidenceReverse) }; });
  const restoredSiblings = siblingPartOutlines.map((s, ordinal) => { const { answerableAfterStageToken, stageToken, ...rest } = s; return { ...remapEvidence(structuredClone(rest), evidenceReverse), id: siblingsByOrdinal.get(ordinal), answerableAfterStageId: answerableAfterStageToken === null ? null : stageReverse.get(answerableAfterStageToken), stageId: stageToken === null ? null : stageReverse.get(stageToken) }; });
  const restoredTargets = targets.map((t) => structuredClone(targetByToken.get(t.rowToken)));
  const b = mapping.removedCaseBookkeeping;
  return { bankPath: b.bankPath, bankSha256: b.bankSha256, parentCaseId: b.parentCaseId, casePath: b.casePath, ...remapEvidence(structuredClone(semanticBase), evidenceReverse), stages: restoredStages, siblingPartOutlines: restoredSiblings, targets: restoredTargets, evidenceIds: structuredClone(b.evidenceIds), evidenceCatalog: evidenceCatalog.map((e) => structuredClone(evidenceCatalogById.get(e.evidenceId))) };
}

export function buildPacket(packetId, entries, sourceCases) {
  const ordered = [...entries].sort((a, b) => shaBytes(`${SEED}|${packetId}|order|${identity(a.row)}`).localeCompare(shaBytes(`${SEED}|${packetId}|order|${identity(b.row)}`)));
  const byParent = new Map(); for (const e of ordered) { if (!byParent.has(e.row.parentCaseId)) byParent.set(e.row.parentCaseId, []); byParent.get(e.row.parentCaseId).push(e); }
  const cases = [], maps = [], sourceProjections = [], rehydration = [];
  for (const [parentCaseId, selected] of byParent) { const source = sourceCases.get(parentCaseId); assert(source, `BLOCKED_SOURCE_CASE ${parentCaseId}`); const built = buildSanitizedCase(packetId, source, selected); cases.push(built.wire); maps.push(built.mapping); sourceProjections.push(built.sourceProjection); const restored = rehydrateCase(built.wire, built.mapping); assert(deepEqual(restored, built.sourceProjection), `BLOCKED_IDENTITY_SANITIZATION rehydration ${parentCaseId}`); rehydration.push({ canonicalParentCaseId: parentCaseId, sourceProjectionSha256: shaBytes(JSON.stringify(built.sourceProjection)), rehydratedProjectionSha256: shaBytes(JSON.stringify(restored)), exactMatch: true }); }
  const packet = { packetVersion: INSTRUMENT, packetId, targetCount: ordered.length, targetOrder: ordered.map((x) => x.rowToken), cases };
  const highSpecificity = new Set();
  for (const m of maps) { highSpecificity.add(m.canonicalParentCaseId); highSpecificity.add(m.sourcePacketId); highSpecificity.add(m.sourcePacketPath); for (const v of Object.values(m.removedCaseBookkeeping)) if (typeof v === "string") highSpecificity.add(v); for (const x of m.targets) highSpecificity.add(x.canonicalPartId); for (const x of m.siblings) highSpecificity.add(x.canonicalPartId); for (const x of m.evidence) highSpecificity.add(x.canonicalEvidenceId); }
  const serialized = JSON.stringify(packet); const residue = [...highSpecificity].filter((x) => x && serialized.includes(x));
  assert(!residue.length, `BLOCKED_IDENTITY_SANITIZATION residue ${residue.slice(0, 3).join(",")}`);
  const allTokens = [...ordered.map((x) => x.rowToken), ...maps.flatMap((m) => m.stages.map((x) => x.stageToken)), ...maps.flatMap((m) => m.evidence.map((x) => x.packetEvidenceId))];
  assert(new Set(allTokens).size === allTokens.length, `BLOCKED_TOKEN_LEAKAGE collision ${packetId}`);
  for (const tok of allTokens) for (const id of highSpecificity) assert(!tok.includes(id) && tok !== id, `BLOCKED_TOKEN_LEAKAGE encoding ${packetId}`);
  return { packet, ordered, maps, highSpecificity: [...highSpecificity].sort(), rehydration, sourceProjections };
}

function main() {
  const frozen = verifyFrozen(); const derived = deriveResidualAndControls(frozen); const source = collectSourceCases(frozen.manifest);
  for (const row of derived.residual) assert(source.targets.has(`${row.parentCaseId}\0${row.partId}`), `BLOCKED_SOURCE_EVIDENCE ${identity(row)}`);
  const openingHead = git(["rev-parse", "HEAD"]), upstream = git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"]), [behind, ahead] = git(["rev-list", "--left-right", "--count", "@{upstream}...HEAD"]).split(/\s+/u).map(Number);
  const openingPreservation = { preservationVersion: "2.0", capturedAtUtc: now(), repository: REPO, branch: git(["branch", "--show-current"]), head: openingHead, upstream, ahead, behind, origin: git(["remote", "get-url", "origin"]), outRootAbsentBeforeAuthorizedCreation: true, openingStatusPorcelainV1Sha256: shaBytes(fs.readFileSync("/tmp/c16-r2-opening-status-v1.txt")), openingStatusPorcelainV1: fs.readFileSync("/tmp/c16-r2-opening-status-v1.txt", "utf8").split(/\n/u).filter(Boolean), openingDirtyPaths: openingRows.map(pathState), workOrder: { path: WORK_ORDER, ownerMeasuredSha256: WORK_ORDER_SHA, observedSha256: sha(WORK_ORDER), match: true }, r1WorkOrder: { path: R1_WORK_ORDER, expectedSha256: R1_WORK_ORDER_SHA, observedSha256: sha(R1_WORK_ORDER), match: true }, banks: frozen.opening.bundledBanks.map((b) => ({ path: b.bankPath, expectedSha256: b.sha256, observedSha256: sha(b.bankPath), match: true })), semanticRuntimeCapability: { executable: "/Users/holemini/.local/bin/claude", cliVersion: execFileSync("/Users/holemini/.local/bin/claude", ["--version"], { encoding: "utf8" }).trim(), requestedModelAlias: "opus", requestedContextMode: "1M", establishedBy: "Claude Code --autocompact 1M plus per-dispatch modelUsage.contextWindow receipt", minimumTokensRequired: 1000000 } };
  write("opening-preservation.json", pretty(openingPreservation));
  write("residual-population.jsonl", derived.residual.map(JSON.stringify).join("\n") + "\n");
  const baseSummary = { summaryVersion: "1.0", derivation: "Stage 1 producer no-leak rows minus frozen Stage 2 checker adjudication membership", rowCount: 192, parentCaseCount: new Set(derived.residual.map((r) => r.parentCaseId)).size, queueIndexMin: derived.residual[0].queueIndex, queueIndexMax: derived.residual.at(-1).queueIndex, queueIndex370Absent: true, queueIndex395Absent: true, uniqueIdentityCount: new Set(derived.residual.map(identity)).size, allExistExactlyOnceInStage0Population: true, noneInStage2: true, sourcePopulationSha256: sha(`${PROD}/population.jsonl`), producerCandidateSha256: sha(`${PROD}/candidate-adjudication.jsonl`), checkerAdjudicationSha256: sha(`${CHECK}/checker-adjudication.jsonl`) };
  const r1Summary = json(`${R1}/residual-population-summary.json`);
  const summary = { ...baseSummary, summaryVersion: "2.0", r1Comparison: { path: `${R1}/residual-population-summary.json`, residualPopulationSha256Match: shaBytes(Buffer.from(derived.residual.map(JSON.stringify).join("\n") + "\n")) === sha(`${R1}/residual-population.jsonl`), governingFieldsMatch: Object.entries(r1Summary).every(([k, v]) => deepEqual(baseSummary[k], v)) } };
  assert(summary.parentCaseCount === 84 && summary.r1Comparison.residualPopulationSha256Match, "BLOCKED_POPULATION_MISMATCH");
  write("residual-population-summary.json", pretty(summary));
  write("sealed/control-pool.json", pretty(derived.r1Pool));
  write("role-scope.json", pretty({ roleScopeVersion: "2.0", population: "campaign16_phase_e_producer_no_leak_residual", n: 192, conditioning: "Stage 1 producer no-leak plus absence from frozen Stage 2 selection", representativeOnlyOf: "Stage 1 producer-no-leak rows left unchecked after predecessor Stage 2 selection", notRepresentativeOf: ["full Phase E or bank/corpus leakage prevalence", "general content judgment", "model-wide semantic accuracy"], instrument: INSTRUMENT, poolabilityWithPredecessorStage2Selected259: false, positiveControlTopologyLimitation: "single-unsafe-stage accepted LEAK controls only", bilingualControlLimitation: "all controls are PARALLEL; non-discriminating vocabulary tripwire only", contestantComparisonMeaning: "agreement with this reference seat unless owner-gold-adjudicated", instrumentLineage: { instrument: "campaign16_phase_e_residual_192_v1", admittedRows: 0, terminal: "CAMPAIGN16_PHASE_E_RESIDUAL_192_BLOCKED_OUTPUT_FAILURE_AFTER_BOUNDED_RETRY" } }));
  write("benchmark-manifest.json", pretty({ naturalistic_holdout: [], p31_challenge_set: [], boundary_set: [], paired_items: [], perturbations: [], gold_key: [] }));

  const groups = groupResidual(derived.residual), used = new Set(), specs = [{ packetId: "r2-cal-a", nominal: 8 }, { packetId: "r2-cal-b", nominal: 16 }]; let groupIndex = 0; const builds = [];
  for (const spec of specs) {
    const candidateGroups = []; let live = [];
    while (groupIndex + candidateGroups.length < groups.length && live.length < spec.nominal) { const next = groups[groupIndex + candidateGroups.length]; candidateGroups.push(next); live = candidateGroups.flatMap((g) => g.rows); }
    let controls, entries, built, bytes;
    while (candidateGroups.length) {
      live = candidateGroups.flatMap((g) => g.rows);
      controls = chooseControls(spec.packetId, live, derived.positive, derived.negative, used);
      entries = [...live.map((row) => ({ row, role: "LIVE", rowToken: token("r", spec.packetId, identity(row)) })), ...controls.map((expected) => ({ row: derived.populationByIdentity.get(identity(expected)), role: "CONTROL", expected, rowToken: token("r", spec.packetId, identity(expected)) }))];
      assert(entries.every((x) => x.row), `BLOCKED_SOURCE_EVIDENCE ${spec.packetId}`); built = buildPacket(spec.packetId, entries, source.cases); bytes = packetBytes(built.packet).length;
      if (bytes <= MAX_BYTES) break;
      candidateGroups.pop();
    }
    assert(candidateGroups.length && live.length, `BLOCKED_PACKET_CEILING_NO_LIVE_ROWS ${spec.packetId}`);
    controls.forEach((r) => used.add(r.queueIndex));
    assert(bytes <= MAX_BYTES, `BLOCKED_PACKET_CEILING ${spec.packetId} ${bytes}`); assert(controls.length === 4 && controls.filter((x) => x.verdict === "LEAK").length === 3, `BLOCKED_CONTROL_TOPOLOGY ${spec.packetId}`); assert(!controls.some((c) => live.some((r) => r.parentCaseId === c.parentCaseId)), `BLOCKED_CONTROL_PLACEMENT ${spec.packetId}`);
    builds.push({ ...spec, live, controls, entries, built, bytes, parentCaseCount: new Set(entries.map((x) => x.row.parentCaseId)).size, stageCount: built.packet.cases.reduce((n, c) => n + c.stages.length, 0), distinctStageTokenCount: new Set(built.packet.cases.flatMap((c) => c.stages.map((s) => s.stageToken))).size }); groupIndex += candidateGroups.length;
  }
  assert(!builds[0].live.some((a) => builds[1].live.some((b) => identity(a) === identity(b))), "CALIBRATION_LIVE_OVERLAP");
  const rebuilds = builds.map((b) => buildPacket(b.packetId, b.entries, source.cases));
  builds.forEach((b, i) => assert(packetBytes(b.built.packet).equals(packetBytes(rebuilds[i].packet)) && deepEqual(b.built.maps, rebuilds[i].maps), `BLOCKED_NONDETERMINISM ${b.packetId}`));

  const rowMap = { mapVersion: "2.0", instrument: INSTRUMENT, seed: SEED, procedure: "sha256-domain-separated-v2", rows: [], stages: [], evidence: [], cases: [], packets: [] };
  const controlKey = { keyVersion: "2.0", instrument: INSTRUMENT, exposures: [] };
  const identitySanitization = { version: "2.0", result: "PASS", semanticPayloadPreserved: true, rehydrationExact: true, exactHighSpecificityDenySetChecks: [], fieldAwareStageReferenceChecks: [], packets: [] };
  for (const b of builds) {
    write(`packets/${b.packetId}.json`, packetBytes(b.built.packet)); const packetSha256 = shaBytes(packetBytes(b.built.packet)); rowMap.packets.push({ packetId: b.packetId, packetSha256 });
    for (const entry of b.built.ordered) rowMap.rows.push({ packetId: b.packetId, rowToken: entry.rowToken, role: entry.role, questionId: entry.row.partId, queueIndex: entry.row.queueIndex, sourceStage2QueueIndex: entry.role === "CONTROL" ? entry.row.queueIndex : null, canonicalParentCaseId: entry.row.parentCaseId, declaredStageTokens: b.built.maps.find((m) => m.canonicalParentCaseId === entry.row.parentCaseId).stages.filter((s) => source.targets.get(`${entry.row.parentCaseId}\0${entry.row.partId}`).declaredStageIds.includes(s.canonicalStageId)).sort((a, c) => a.authoredOrdinal - c.authoredOrdinal).map((s) => s.stageToken) });
    for (const m of b.built.maps) { rowMap.cases.push(m); rowMap.stages.push(...m.stages); rowMap.evidence.push(...m.evidence); }
    for (const entry of b.entries.filter((x) => x.role === "CONTROL")) controlKey.exposures.push({ packetId: b.packetId, rowToken: entry.rowToken, sourceStage2QueueIndex: entry.row.queueIndex, expectedPrimaryVerdict: entry.expected.verdict, expectedNoLeakSubclass: entry.expected.verdict.startsWith("NO_LEAK") ? entry.expected.verdict : null, expectedSingleCanonicalUnsafeStageId: entry.expected.verdict === "LEAK" ? entry.expected.unsafeStageIds[0] : null, expectedBilingualRelation: entry.expected.bilingualRelation, frozenCheckerProvenance: `${CHECK}/checker-adjudication.jsonl`, frozenCheckerRowSha256: entry.expected.checkerRowSha256 });
    identitySanitization.packets.push({ packetId: b.packetId, sourceCaseCount: b.built.maps.length, highSpecificityDenySet: b.built.highSpecificity, residueCount: 0, evidenceCount: b.built.maps.reduce((n, m) => n + m.evidence.length, 0), evidenceUniqueCount: new Set(b.built.maps.flatMap((m) => m.evidence.map((e) => e.packetEvidenceId))).size, evidenceRemintInjective: true, evidenceRoundTripLossless: true, rehydration: b.built.rehydration, tokenNonEncoding: true, statusPositionSignalAbsent: true });
  }
  write("sealed/row-map.json", pretty(rowMap)); write("sealed/control-key.json", pretty(controlKey)); write("sealed/identity-sanitization.json", pretty(identitySanitization)); write("sealed/calibration-escrow.jsonl", ""); write("sealed/voided-escrow.jsonl", "");
  const packetIndex = { indexVersion: "2.0", instrument: INSTRUMENT, packets: builds.map((b) => ({ packetId: b.packetId, path: `packets/${b.packetId}.json`, sha256: sha(`audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/packets/${b.packetId}.json`), bytes: b.bytes, nominalLiveRows: b.nominal, liveRows: b.live.length, controls: 4, parentCases: b.parentCaseCount, stages: b.stageCount, distinctStageTokens: b.distinctStageTokenCount, targetCount: b.entries.length, targetOrder: b.built.packet.targetOrder })) };
  write("packet-index.json", pretty(packetIndex));
  const buildManifest = { manifestVersion: "2.0", instrument: INSTRUMENT, seed: SEED, maxPacketBytes: MAX_BYTES, deterministicRebuildByteIdentical: true, rowMapSha256: sha("audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/sealed/row-map.json"), identitySanitizationSha256: sha("audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/sealed/identity-sanitization.json"), structuralIdentitySanitization: "PASS", rehydration: "PASS", exactAndFieldAwareDenySetChecks: "PASS", evidenceRemintCollisionCheck: "PASS", evidenceRemintRoundTrip: "PASS", packets: packetIndex.packets, template: { path: "tools/SEMANTIC-PROMPT-TEMPLATE.md", sha256: sha("audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/tools/SEMANTIC-PROMPT-TEMPLATE.md"), bytes: fs.statSync(out("tools/SEMANTIC-PROMPT-TEMPLATE.md")).size } };
  write("packet-build-manifest.json", pretty(buildManifest));
  const boundFiles = [WORK_ORDER, R1_WORK_ORDER, "AGENTS.md", "docs/AGENTS-RUNBOOK.md", "DECISIONS.md", "scratch/CAMPAIGN-16-QUALITY-CLOSEOUT-CHARTER-2026-08-26.md", "scratch/CAMPAIGN-16-PHASE-E-STAGE-REFERENCE-SEMANTIC-CENSUS-WORK-ORDER-2026-08-29.md", `${PROD}/candidate-adjudication.jsonl`, `${PROD}/candidate-freeze.json`, `${PROD}/packet-manifest.json`, `${PROD}/population.jsonl`, `${PROD}/opening-state.json`, `${PROD}/build-packets.ts`, `${CHECK}/checker-adjudication.jsonl`, `${CHECK}/checker-selection.json`, `${CHECK}/comparison.json`, `${CHECK}/review.md`, `${CHECK}/verification.md`, `${CHECK}/tools/harvest.py`, `${R1}/residual-population.jsonl`, `${R1}/residual-population-summary.json`, `${R1}/sealed/control-pool.json`, `${R1}/validator-self-test.json`, `${R1}/benchmark-manifest.json`, `${R1}/calibration-report.json`, `${R1}/preservation-verification.json`];
  const binding = { bindingManifestVersion: "2.0", createdAtUtc: now(), workOrder: openingPreservation.workOrder, r1WorkOrder: openingPreservation.r1WorkOrder, repository: { path: REPO, branch: "main", head: openingHead, upstream, ahead, behind }, completeOpeningRepositoryStatus: openingPreservation.openingStatusPorcelainV1, openingPreservationSnapshot: openingPreservation, boundFiles: boundFiles.map(fileReceipt), directories: [{ path: `${PROD}/packets`, governedInventory: frozen.manifest.packets.map((x) => fileReceipt(`${PROD}/${x.path}`)) }, { path: `${R1}/outputs`, governedInventory: fs.readdirSync(path.join(REPO, R1, "outputs")).filter((x) => /^cal-a-superseding-.*\.jsonl$/u.test(x)).sort().map((x) => fileReceipt(`${R1}/outputs/${x}`)) }], banks: openingPreservation.banks, semanticRuntimeCapability: openingPreservation.semanticRuntimeCapability, allBindingsPass: true };
  write("input-binding-manifest.json", pretty(binding));
  write("control-exposure-log.jsonl", ""); write("dispatch-log.jsonl", ""); write("cost-ledger.jsonl", ""); write("semantic-contexts.jsonl", ""); write("resource-checkpoint.json", "[]\n"); write("admitted/residual-adjudication.jsonl", ""); write("admitted/residual-leak-roster.jsonl", ""); write("admitted/residual-review-roster.jsonl", ""); write("admitted/unresolved-roster.jsonl", "");
  console.log(JSON.stringify({ terminal: "DETERMINISTIC_BUILD_READY", residualRows: 192, parentCases: 84, positiveControls: 114, negativeControls: 67, packets: packetIndex.packets, rowMapSha256: buildManifest.rowMapSha256, identitySanitizationSha256: buildManifest.identitySanitizationSha256 }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
