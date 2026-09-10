import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(import.meta.dirname, "../../..");
const ROOT = path.resolve(import.meta.dirname, "..");
const PROD = "audit/campaign-16-phase-e-stage-reference-census-2026-08-29-r1";
const CHECK = "audit/campaign-16-phase-e-stage-reference-check-2026-08-29-r1";
const WORK_ORDER = "scratch/CAMPAIGN-16-PHASE-E-RESIDUAL-192-FULL-SEMANTIC-CHECK-WORK-ORDER-2026-09-02-R1.md";
const WORK_ORDER_SHA = "5e7c4a5595a75d5bbcdc2a9811dba80495bbf2f3514c90f8237511c0aea061f4";
const SEED = "campaign16-phase-e-residual192-r1-v1";
const MAX_BYTES = 700_000;
const read = (p) => fs.readFileSync(path.join(REPO, p));
const text = (p) => read(p).toString("utf8");
const json = (p) => JSON.parse(text(p));
const jsonlWithLines = (p) => text(p).split(/\r?\n/u).filter(Boolean).map((line) => ({ line, row: JSON.parse(line) }));
const shaBytes = (v) => crypto.createHash("sha256").update(v).digest("hex");
const sha = (p) => shaBytes(read(p));
const pretty = (v) => `${JSON.stringify(v, null, 2)}\n`;
const compact = (v) => JSON.stringify(v);
const assert = (c, m) => { if (!c) throw new Error(m); };
const git = (args) => execFileSync("git", args, { cwd: REPO, encoding: "utf8" }).trimEnd();
const identity = (r) => `${r.queueIndex}\0${r.bankPath}\0${r.parentCaseId}\0${r.partId}`;
const safeMkdir = (p) => fs.mkdirSync(path.join(ROOT, p), { recursive: true });
const write = (p, body) => fs.writeFileSync(path.join(ROOT, p), body);

function fileReceipt(relativePath) {
  const absolutePath = path.join(REPO, relativePath);
  const st = fs.statSync(absolutePath);
  return { path: relativePath, type: st.isFile() ? "file" : st.isDirectory() ? "directory" : "other", bytes: st.isFile() ? st.size : null, mtime: st.mtime.toISOString(), sha256: st.isFile() ? sha(relativePath) : null };
}

function ensureFrozenInputs() {
  assert(sha(WORK_ORDER) === WORK_ORDER_SHA, "BLOCKED_WORK_ORDER_DRIFT");
  assert(git(["rev-parse", "--show-toplevel"]) === REPO, "BLOCKED_REPOSITORY_IDENTITY");
  assert(git(["branch", "--show-current"]) === "main", "BLOCKED_BRANCH");
  const opening = json(`${PROD}/opening-state.json`);
  assert(opening.bundledBanks.length === 13, "BLOCKED_BANK_COUNT");
  for (const bank of opening.bundledBanks) assert(sha(bank.bankPath) === bank.sha256, `BLOCKED_BANK_DRIFT ${bank.bankPath}`);
  const freeze = json(`${PROD}/candidate-freeze.json`);
  assert(sha(`${PROD}/population.jsonl`) === freeze.population.sha256, "BLOCKED_SOURCE_POPULATION_DRIFT");
  assert(sha(`${PROD}/population-summary.json`) === freeze.populationSummary.sha256, "BLOCKED_SOURCE_SUMMARY_DRIFT");
  assert(sha(`${PROD}/packet-manifest.json`) === freeze.packetManifest.sha256, "BLOCKED_SOURCE_MANIFEST_DRIFT");
  for (const item of freeze.packetOutputs) assert(sha(`${PROD}/${item.path}`) === item.sha256, `BLOCKED_CANDIDATE_PACKET_DRIFT ${item.packetId}`);
  const manifest = json(`${PROD}/packet-manifest.json`);
  assert(manifest.packets.length === 75, "BLOCKED_SOURCE_PACKET_COUNT");
  for (const item of manifest.packets) {
    assert(sha(`${PROD}/${item.path}`) === item.sha256, `BLOCKED_SOURCE_PACKET_DRIFT ${item.packetId}`);
    assert(fs.statSync(path.join(REPO, PROD, item.path)).size === item.utf8Bytes, `BLOCKED_SOURCE_PACKET_SIZE ${item.packetId}`);
  }
  const comparison = json(`${CHECK}/comparison.json`);
  assert(sha(`${CHECK}/checker-selection.json`) === comparison.inputs.checkerSelection.sha256, "BLOCKED_CHECKER_SELECTION_DRIFT");
  assert(sha(`${CHECK}/checker-adjudication.jsonl`) === comparison.inputs.checkerAdjudication.sha256, "BLOCKED_CHECKER_ADJUDICATION_DRIFT");
  assert(sha(`${CHECK}/checker-packet-manifest.json`) === comparison.inputs.checkerPacketManifest.sha256, "BLOCKED_CHECKER_MANIFEST_DRIFT");
  const checkerManifest = json(`${CHECK}/checker-packet-manifest.json`);
  for (const item of checkerManifest.packets) assert(sha(`${CHECK}/${item.path}`) === item.sha256, `BLOCKED_CHECKER_PACKET_DRIFT ${item.packetId}`);
  return { opening, freeze, manifest, comparison, checkerManifest };
}

function collectSourceCases(manifest) {
  const cases = new Map();
  const targets = new Map();
  for (const item of manifest.packets) {
    const packet = json(`${PROD}/${item.path}`);
    for (const sourceCase of packet.cases) {
      assert(!cases.has(sourceCase.parentCaseId), `DUPLICATE_SOURCE_CASE ${sourceCase.parentCaseId}`);
      cases.set(sourceCase.parentCaseId, { sourceCase, evidenceCatalog: packet.evidenceCatalog.filter((e) => e.parentCaseId === sourceCase.parentCaseId), sourcePacketId: packet.packetId, sourcePacketSha256: item.sha256 });
      for (const target of sourceCase.targets) targets.set(`${sourceCase.parentCaseId}\0${target.partId}`, target);
    }
  }
  return { cases, targets };
}

function sanitizeCase(source, selected) {
  const partIds = new Set(selected.map((x) => x.row.partId));
  const targetByPart = new Map(source.sourceCase.targets.map((t) => [t.partId, t]));
  const targets = selected.map((entry) => {
    const target = targetByPart.get(entry.row.partId);
    assert(target, `SOURCE_TARGET_MISSING ${entry.row.parentCaseId}/${entry.row.partId}`);
    const { stageEvidenceIds: _stageEvidenceIds, contextEvidenceIds: _contextEvidenceIds, ...nonredundant } = structuredClone(target);
    return { rowToken: entry.rowToken, ...nonredundant };
  });
  const catalog = source.evidenceCatalog
    .filter((e) => !String(e.surface).startsWith("PART_") || partIds.has(e.ownerPartId))
    .map(({ text: _duplicateText, parentCaseId: _repeatedParentCaseId, jsonPath: _redundantSourcePath, ...mapping }) => mapping);
  const allowed = new Set(catalog.map((e) => e.evidenceId));
  for (const target of targets) for (const id of target.partEvidenceIds) assert(allowed.has(id), `EVIDENCE_FIDELITY_MISSING ${id}`);
  const { bankPath: _bankPath, bankSha256: _bankSha256, casePath: _casePath, targets: _targets, evidenceIds: _evidenceIds, ...base } = source.sourceCase;
  base.siblingPartOutlines = base.siblingPartOutlines.filter((outline) => !partIds.has(outline.id));
  return { case: { ...structuredClone(base), targets, evidenceCatalog: catalog }, catalog };
}

function buildPacket(packetId, entries, sourceCases) {
  const ordered = [...entries].sort((a, b) => shaBytes(`${SEED}|${packetId}|order|${identity(a.row)}`).localeCompare(shaBytes(`${SEED}|${packetId}|order|${identity(b.row)}`)));
  const byParent = new Map();
  for (const entry of ordered) {
    if (!byParent.has(entry.row.parentCaseId)) byParent.set(entry.row.parentCaseId, []);
    byParent.get(entry.row.parentCaseId).push(entry);
  }
  const cases = [];
  for (const [parentCaseId, chosen] of byParent) {
    const source = sourceCases.get(parentCaseId);
    assert(source, `SOURCE_CASE_MISSING ${parentCaseId}`);
    const built = sanitizeCase(source, chosen);
    cases.push(built.case);
  }
  const packet = { packetVersion: "campaign16_phase_e_residual_192_v1", packetId, targetCount: ordered.length, targetOrder: ordered.map((x) => x.rowToken), cases };
  const forbidden = ["producerVerdict", "checkerVerdict", "selectionReasons", "controlRole", "expectedVerdict", "unsafeStageIdExpected"];
  const serialized = compact(packet);
  for (const term of forbidden) assert(!serialized.includes(`\"${term}\"`), `PACKET_CONTAMINATION ${term}`);
  return packet;
}

function chooseLiveGroups(residual, startGroup, targetCount) {
  const groups = [];
  for (const row of residual) {
    let group = groups.at(-1);
    if (!group || group.parentCaseId !== row.parentCaseId) { group = { parentCaseId: row.parentCaseId, rows: [] }; groups.push(group); }
    group.rows.push(row);
  }
  const chosen = []; let count = 0; let i = startGroup;
  while (i < groups.length && count < targetCount) { chosen.push(groups[i]); count += groups[i].rows.length; i += 1; }
  return { chosen, nextGroup: i, liveRows: chosen.flatMap((g) => g.rows) };
}

function groupResidual(residual) {
  const groups = [];
  for (const row of residual) {
    let group = groups.at(-1);
    if (!group || group.parentCaseId !== row.parentCaseId) { group = { parentCaseId: row.parentCaseId, rows: [] }; groups.push(group); }
    group.rows.push(row);
  }
  return groups;
}

function ranked(rows, label) {
  return [...rows].sort((a, b) => shaBytes(`${SEED}|${label}|${identity(a.row)}`).localeCompare(shaBytes(`${SEED}|${label}|${identity(b.row)}`)));
}

function chooseControls(packetId, liveRows, positivePool, negativePool, used) {
  const excludedParents = new Set(liveRows.map((r) => r.parentCaseId));
  const positives = ranked(positivePool.filter((x) => !used.has(identity(x.row)) && !excludedParents.has(x.row.parentCaseId)), `${packetId}|positive`);
  const negatives = ranked(negativePool.filter((x) => !used.has(identity(x.row)) && !excludedParents.has(x.row.parentCaseId)), `${packetId}|negative`);
  const byParent = new Map();
  for (const entry of positives) {
    if (!byParent.has(entry.row.parentCaseId)) byParent.set(entry.row.parentCaseId, { positives: [], negatives: [] });
    byParent.get(entry.row.parentCaseId).positives.push(entry);
  }
  for (const entry of negatives) {
    if (!byParent.has(entry.row.parentCaseId)) byParent.set(entry.row.parentCaseId, { positives: [], negatives: [] });
    byParent.get(entry.row.parentCaseId).negatives.push(entry);
  }
  const compactParents = [...byParent.entries()].filter(([, group]) => group.positives.length >= 3 && group.negatives.length >= 1)
    .sort(([a], [b]) => shaBytes(`${SEED}|${packetId}|control-parent|${a}`).localeCompare(shaBytes(`${SEED}|${packetId}|control-parent|${b}`)));
  assert(compactParents.length > 0, `CONTROL_PLACEMENT_COMPACT_PARENT ${packetId}`);
  const [, group] = compactParents[0];
  return [...group.positives.slice(0, 3), group.negatives[0]];
}

function tokenFor(packetId, row) { return `row_${shaBytes(`${SEED}|${packetId}|token|${identity(row)}`).slice(0, 24)}`; }

function main() {
  const frozen = ensureFrozenInputs();
  const candidateLines = jsonlWithLines(`${PROD}/candidate-adjudication.jsonl`);
  const checkerLines = jsonlWithLines(`${CHECK}/checker-adjudication.jsonl`);
  const population = jsonlWithLines(`${PROD}/population.jsonl`).map((x) => x.row);
  const selection = json(`${CHECK}/checker-selection.json`);
  const candidate = candidateLines.map((x) => x.row), checker = checkerLines.map((x) => x.row);
  assert(candidate.length === 451 && checker.length === 259 && population.length === 451, "BLOCKED_GOVERNING_COUNTS");
  const checkerKeys = new Set(checker.map(identity));
  const independentlySelected = candidate.filter((r) => r.verdict === "LEAK" || r.verdict === "REVIEW" || r.bilingualRelation !== "PARALLEL" || (parseInt(shaBytes(`stage-ref-check|${r.bankPath}|${r.parentCaseId}|${r.partId}`).slice(0, 2), 16) % 10 === 0));
  const frozenSelected = selection.derivation.filter((r) => r.selected);
  assert(independentlySelected.length === 259 && new Set(independentlySelected.map(identity)).size === 259, "BLOCKED_SELECTION_REDERIVATION_COUNT");
  assert([...new Set(independentlySelected.map(identity))].every((k) => checkerKeys.has(k)) && frozenSelected.every((r) => checkerKeys.has(identity(r))), "BLOCKED_SELECTION_RECONCILIATION");
  const populationByIdentity = new Map(population.map((r) => [identity(r), r]));
  const residualCandidate = candidate.filter((r) => (r.verdict === "NO_LEAK_COMPLETE_RECORD" || r.verdict === "NO_LEAK_NONANSWERING_DATA") && !checkerKeys.has(identity(r)));
  assert(residualCandidate.length === 192 && new Set(residualCandidate.map(identity)).size === 192, "BLOCKED_POPULATION_MISMATCH");
  assert(!residualCandidate.some((r) => r.queueIndex === 370 || r.queueIndex === 395), "BLOCKED_EXCLUDED_ROW_IN_RESIDUAL");
  const residual = residualCandidate.map((r) => { const source = populationByIdentity.get(identity(r)); assert(source, `BLOCKED_SOURCE_POPULATION_IDENTITY ${identity(r)}`); return source; }).sort((a, b) => a.queueIndex - b.queueIndex);
  const source = collectSourceCases(frozen.manifest);
  for (const row of residual) assert(source.targets.has(`${row.parentCaseId}\0${row.partId}`), `BLOCKED_SOURCE_EVIDENCE ${identity(row)}`);

  const positivePool = [], negativePool = [];
  for (let i = 0; i < checkerLines.length; i += 1) {
    const { row } = checkerLines[i];
    if ([370, 395].includes(row.queueIndex) || row.verdict === "REVIEW") continue;
    const entry = { row, checkerRowSha256: shaBytes(`${checkerLines[i].line}\n`) };
    if (row.verdict === "LEAK" && row.unsafeStageIds.length === 1) positivePool.push(entry);
    else if (row.verdict === "NO_LEAK_COMPLETE_RECORD" || row.verdict === "NO_LEAK_NONANSWERING_DATA") negativePool.push(entry);
  }
  assert(positivePool.length === 114 && negativePool.length === 67, "BLOCKED_CONTROL_POOL_COUNT");
  assert([...positivePool, ...negativePool].every((x) => x.row.bilingualRelation === "PARALLEL"), "BLOCKED_CONTROL_BILINGUAL_REFERENCE");

  const usedControls = new Set();
  const specs = [{ packetId: "cal-a", nominal: 8 }, { packetId: "cal-b", nominal: 16 }];
  const residualGroups = groupResidual(residual);
  let nextLiveGroup = 0;
  const built = [];
  for (const spec of specs) {
    const nominal = chooseLiveGroups(residual, nextLiveGroup, spec.nominal);
    const controls = chooseControls(spec.packetId, nominal.liveRows, positivePool, negativePool, usedControls);
    controls.forEach((x) => usedControls.add(identity(x.row)));
    const controlEntries = controls.map((x) => ({ row: populationByIdentity.get(identity(x.row)), role: "CONTROL", expected: x.row, checkerRowSha256: x.checkerRowSha256, rowToken: tokenFor(spec.packetId, x.row) }));
    const acceptedGroups = [];
    let liveRows = [];
    while (nextLiveGroup + acceptedGroups.length < residualGroups.length && liveRows.length < spec.nominal) {
      const next = residualGroups[nextLiveGroup + acceptedGroups.length];
      const proposedRows = [...liveRows, ...next.rows];
      const proposedEntries = [...proposedRows.map((row) => ({ row, role: "LIVE", rowToken: tokenFor(spec.packetId, row) })), ...controlEntries];
      const proposedPacket = buildPacket(spec.packetId, proposedEntries, source.cases);
      if (Buffer.byteLength(`${compact(proposedPacket)}\n`, "utf8") > MAX_BYTES) break;
      acceptedGroups.push(next); liveRows = proposedRows;
    }
    assert(liveRows.length > 0, `BLOCKED_PACKET_CEILING_NO_LIVE_ROWS ${spec.packetId}`);
    nextLiveGroup += acceptedGroups.length;
    const entries = [...liveRows.map((row) => ({ row, role: "LIVE", rowToken: tokenFor(spec.packetId, row) })), ...controlEntries];
    for (const entry of entries) assert(entry.row, `PACKET_ROW_SOURCE_MISSING ${identity(entry.expected ?? entry.row)}`);
    const packet = buildPacket(spec.packetId, entries, source.cases);
    const bytes = Buffer.byteLength(`${compact(packet)}\n`, "utf8");
    assert(bytes <= MAX_BYTES, `BLOCKED_PACKET_CEILING ${spec.packetId} ${bytes}`);
    assert(controls.length === 4 && controls.filter((x) => x.row.verdict === "LEAK").length === 3, `CONTROL_TOPOLOGY ${spec.packetId}`);
    assert(!controls.some((x) => liveRows.some((r) => r.parentCaseId === x.row.parentCaseId)), `BLOCKED_CONTROL_PLACEMENT ${spec.packetId}`);
    built.push({ ...spec, liveRows, controls, entries, packet, bytes, stoppedByByteCeilingBeforeNominal: liveRows.length < spec.nominal });
  }
  assert(!built[0].liveRows.some((x) => built[1].liveRows.some((y) => identity(x) === identity(y))), "CALIBRATION_LIVE_OVERLAP");

  const boundFiles = [WORK_ORDER, "AGENTS.md", "DECISIONS.md", "scratch/CAMPAIGN-16-PHASE-E-STAGE-REFERENCE-SEMANTIC-CENSUS-WORK-ORDER-2026-08-29.md", `${PROD}/candidate-adjudication.jsonl`, `${PROD}/candidate-freeze.json`, `${PROD}/packet-manifest.json`, `${PROD}/population.jsonl`, `${PROD}/opening-state.json`, `${PROD}/build-packets.ts`, `${CHECK}/checker-adjudication.jsonl`, `${CHECK}/checker-selection.json`, `${CHECK}/comparison.json`, `${CHECK}/review.md`, `${CHECK}/verification.md`, `${CHECK}/tools/harvest.py`];
  const sourcePacketInventory = frozen.manifest.packets.map((x) => fileReceipt(`${PROD}/${x.path}`));
  const upstream = git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"]);
  const [behind, ahead] = git(["rev-list", "--left-right", "--count", "@{upstream}...HEAD"]).split(/\s+/u).map(Number);
  const openingPreservation = json(path.relative(REPO, path.join(ROOT, "opening-preservation.json")));
  const binding = { bindingManifestVersion: "1.0", createdAtUtc: new Date().toISOString(), workOrder: { path: WORK_ORDER, expectedSha256: WORK_ORDER_SHA, liveSha256: sha(WORK_ORDER), match: true }, repository: { path: REPO, branch: git(["branch", "--show-current"]), head: git(["rev-parse", "HEAD"]), upstream, ahead, behind, origin: git(["remote", "get-url", "origin"]) }, openingPreservationSnapshot: openingPreservation, boundFiles: boundFiles.map(fileReceipt), directories: [{ path: `${PROD}/packets`, governedInventory: sourcePacketInventory }], banks: frozen.opening.bundledBanks.map((x) => ({ ...fileReceipt(x.bankPath), expectedSha256: x.sha256, match: sha(x.bankPath) === x.sha256 })), semanticRuntimeCapability: openingPreservation.semanticRuntimeCapability, allBindingsPass: true };

  safeMkdir("packets"); safeMkdir("sealed"); safeMkdir("outputs"); safeMkdir("raw"); safeMkdir("locks"); safeMkdir("admitted"); safeMkdir("runtime-sandbox");
  write("input-binding-manifest.json", pretty(binding));
  write("residual-population.jsonl", residual.map((r) => compact(r)).join("\n") + "\n");
  write("residual-population-summary.json", pretty({ summaryVersion: "1.0", derivation: "Stage 1 producer no-leak rows minus frozen Stage 2 checker adjudication membership", rowCount: residual.length, parentCaseCount: new Set(residual.map((r) => r.parentCaseId)).size, queueIndexMin: residual[0].queueIndex, queueIndexMax: residual.at(-1).queueIndex, queueIndex370Absent: !residual.some((r) => r.queueIndex === 370), queueIndex395Absent: !residual.some((r) => r.queueIndex === 395), uniqueIdentityCount: new Set(residual.map(identity)).size, allExistExactlyOnceInStage0Population: true, noneInStage2: true, sourcePopulationSha256: sha(`${PROD}/population.jsonl`), producerCandidateSha256: sha(`${PROD}/candidate-adjudication.jsonl`), checkerAdjudicationSha256: sha(`${CHECK}/checker-adjudication.jsonl`) }));
  write("role-scope.json", pretty({ roleScopeVersion: "1.0", population: "campaign16_phase_e_producer_no_leak_residual", n: 192, conditioning: "Stage 1 producer no-leak plus absence from frozen Stage 2 selection", representativeOnlyOf: "Stage 1 producer-no-leak rows left unchecked after predecessor Stage 2 selection", notRepresentativeOf: ["full Phase E leakage prevalence", "bank or corpus leakage prevalence", "general content judgment", "model-wide semantic accuracy"], instrument: "campaign16_phase_e_residual_192_v1", poolabilityWithPredecessorStage2Selected259: false, positiveControlLimitation: "Positive controls cover only accepted Stage 2 LEAK rows with exactly one unsafe stage; fidelity is not established for multi-unsafe-stage leakage.", bilingualControlLimitation: "All frozen control-pool rows are PARALLEL, so bilingual control agreement is a non-discriminating vocabulary tripwire and not bilingual-fidelity evidence.", contestantComparisonMeaning: "Agreement with this reference seat unless separately owner-gold-adjudicated." }));
  write("benchmark-manifest.json", pretty({ naturalistic_holdout: {}, p31_challenge_set: {}, boundary_set: {}, paired_items: {}, perturbations: {}, gold_key: {} }));
  write("sealed/control-pool.json", pretty({ controlPoolVersion: "1.0", sourceCheckerAdjudication: { path: `${CHECK}/checker-adjudication.jsonl`, sha256: sha(`${CHECK}/checker-adjudication.jsonl`) }, exclusions: { queueIndices: [370, 395], reviewQueueIndices: [204, 280] }, topologyLimit: "positive controls restricted to exactly one unsafe stage", bilingualReferenceLimit: "all eligible rows are PARALLEL", positive: positivePool.map((x) => ({ ...x.row, checkerRowSha256: x.checkerRowSha256 })), negative: negativePool.map((x) => ({ ...x.row, checkerRowSha256: x.checkerRowSha256 })) }));
  const rowMap = [], keyRows = [];
  for (const item of built) for (const entry of item.entries) {
    rowMap.push({ packetId: item.packetId, rowToken: entry.rowToken, role: entry.role, queueIndex: entry.row.queueIndex, bankPath: entry.row.bankPath, parentCaseId: entry.row.parentCaseId, partId: entry.row.partId, sourcePacketId: source.cases.get(entry.row.parentCaseId).sourcePacketId, sourcePacketSha256: source.cases.get(entry.row.parentCaseId).sourcePacketSha256 });
    if (entry.role === "CONTROL") keyRows.push({ packetId: item.packetId, rowToken: entry.rowToken, sourceStage2QueueIndex: entry.expected.queueIndex, expectedPrimaryVerdict: entry.expected.verdict, expectedNoLeakSubclass: entry.expected.verdict.startsWith("NO_LEAK_") ? entry.expected.verdict : null, expectedSingleUnsafeStageId: entry.expected.verdict === "LEAK" ? entry.expected.unsafeStageIds[0] : null, expectedBilingualRelation: entry.expected.bilingualRelation, checkerRowSha256: entry.checkerRowSha256, checkerAdjudicationSha256: sha(`${CHECK}/checker-adjudication.jsonl`) });
  }
  write("sealed/row-map.json", pretty({ rowMapVersion: "1.0", rows: rowMap }));
  write("sealed/control-key.json", pretty({ controlKeyVersion: "1.0", rows: keyRows }));
  for (const item of built) write(`packets/${item.packetId}.json`, `${compact(item.packet)}\n`);
  const promptRel = path.relative(REPO, path.join(ROOT, "tools/SEMANTIC-PROMPT-TEMPLATE.md"));
  const packetIndex = { packetIndexVersion: "1.0", seed: SEED, maxSerializedUtf8Bytes: MAX_BYTES, packets: built.map((x) => ({ packetId: x.packetId, path: `packets/${x.packetId}.json`, nominalLiveTarget: x.nominal, liveRows: x.liveRows.length, liveParentCases: new Set(x.liveRows.map((r) => r.parentCaseId)).size, controls: 4, totalTargets: x.packet.targetCount, stageCount: x.packet.cases.reduce((n, c) => n + c.stages.length, 0), serializedUtf8Bytes: fs.statSync(path.join(ROOT, `packets/${x.packetId}.json`)).size, compactSerializedUtf8Bytes: Buffer.byteLength(compact(x.packet), "utf8"), stoppedByByteCeilingBeforeNominal: x.stoppedByByteCeilingBeforeNominal, sha256: sha(path.relative(REPO, path.join(ROOT, `packets/${x.packetId}.json`))), liveQueueIndices: x.liveRows.map((r) => r.queueIndex) })) };
  write("packet-index.json", pretty(packetIndex));
  const manifest = { packetBuildManifestVersion: "1.0", createdAtUtc: new Date().toISOString(), seed: SEED, workOrderSha256: WORK_ORDER_SHA, semanticTemplate: { path: "tools/SEMANTIC-PROMPT-TEMPLATE.md", sha256: sha(promptRel), bytes: fs.statSync(path.join(ROOT, "tools/SEMANTIC-PROMPT-TEMPLATE.md")).size }, residualPopulation: { path: "residual-population.jsonl", sha256: sha(path.relative(REPO, path.join(ROOT, "residual-population.jsonl"))), rows: 192 }, controlPool: { path: "sealed/control-pool.json", sha256: sha(path.relative(REPO, path.join(ROOT, "sealed/control-pool.json"))), positiveRows: positivePool.length, negativeRows: negativePool.length }, packets: packetIndex.packets.map((x) => ({ packetId: x.packetId, path: x.path, sha256: x.sha256, serializedUtf8Bytes: x.serializedUtf8Bytes, compactSerializedUtf8Bytes: x.compactSerializedUtf8Bytes, liveRows: x.liveRows, controls: x.controls })), deterministicRebuild: null };

  const compare = path.join(ROOT, ".determinism-compare"); fs.mkdirSync(compare, { recursive: true });
  for (const item of built) fs.writeFileSync(path.join(compare, `${item.packetId}.json`), `${compact(buildPacket(item.packetId, item.entries, source.cases))}\n`);
  const comparisons = built.map((item) => { const original = fs.readFileSync(path.join(ROOT, `packets/${item.packetId}.json`)); const rebuilt = fs.readFileSync(path.join(compare, `${item.packetId}.json`)); return { packetId: item.packetId, byteIdentical: original.equals(rebuilt), originalSha256: shaBytes(original), rebuiltSha256: shaBytes(rebuilt) }; });
  assert(comparisons.every((x) => x.byteIdentical), "BLOCKED_NONDETERMINISTIC_REBUILD"); fs.rmSync(compare, { recursive: true });
  manifest.deterministicRebuild = { temporarySurfaceRemoved: true, allByteIdentical: true, comparisons };
  write("packet-build-manifest.json", pretty(manifest));
  write("semantic-contexts.jsonl", ""); write("control-exposure-log.jsonl", ""); write("dispatch-log.jsonl", ""); write("cost-ledger.jsonl", ""); write("sealed/calibration-escrow.jsonl", ""); write("admitted/residual-adjudication.jsonl", "");
  write("partial-progress.json", pretty({ status: "CALIBRATION_PACKETS_READY", calibrationPacketsBuilt: 2, calibrationPacketsDispatched: 0, calibrationPacketsLocked: 0, calibrationPacketsVoid: 0, mainDispatchAuthorized: false }));
  write("RESUMPTION-NOTE.md", `# Residual-192 calibration resumption\n\nFrozen work order: \`${WORK_ORDER_SHA}\`. Calibration packets are built and byte-identically rebuilt. Main dispatch is not authorized.\n`);
  console.log(JSON.stringify({ status: "PASS", residualRows: 192, residualParentCases: new Set(residual.map((r) => r.parentCaseId)).size, controls: { positive: positivePool.length, negative: negativePool.length }, packets: packetIndex.packets, deterministicRebuild: true }, null, 2));
}

export { REPO, ROOT, PROD, CHECK, WORK_ORDER_SHA, SEED, MAX_BYTES, identity, shaBytes, pretty, compact, collectSourceCases, buildPacket, tokenFor };
if (process.argv[1] === fileURLToPath(import.meta.url)) main();
