import { parseStrictJsonl, StrictJsonError } from "./strict-json.mjs";
import { INSTRUMENT, deepEqual } from "./lib.mjs";

const verdicts = new Set(["LEAK", "NO_LEAK_COMPLETE_RECORD", "NO_LEAK_NONANSWERING_DATA", "REVIEW"]);
const relations = new Set(["PARALLEL", "EN_ONLY_LEAK", "ZH_ONLY_LEAK", "MATERIAL_DIVERGENCE", "UNRESOLVED"]);
const contributions = new Set(["REQUIRED", "UNSAFE", "NONANSWERING"]);
const topFields = ["rowToken", "verdict", "testedDecision", "stageEvaluations", "partEvidenceIds", "stageEvidenceIds", "locus", "bilingualRelation", "reason"];
const evalFields = ["contribution", "evidenceIds", "basis"];
const locusFields = ["stageToken", "evidenceIds", "verbatimSpan"];
const exactKeys = (obj, expected) => obj && typeof obj === "object" && !Array.isArray(obj) && Object.keys(obj).length === expected.length && expected.every((k) => Object.hasOwn(obj, k));
const words = (s) => typeof s === "string" ? (s.match(/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*/gu) ?? []).length : 0;
const sentenceCount = (s) => { if (typeof s !== "string") return 0; const cleaned = s.replace(/'[\s\S]*'|"[^"]*"|“[^”]*”|‘[^’]*’/gu, "quoted content").replace(/\b(?:e\.g|i\.e|Dr|Mr|Mrs|Ms|vs)\./giu, "abbr").replace(/\b[A-Z]\.(?=\s*[a-z])/gu, "initial").replace(/(?<=\d)\.(?=\d)/gu, "d"); return (cleaned.match(/[.!?](?=\s|$)/gu) ?? []).length; };
const filler = (s) => typeof s !== "string" || !s.trim() || /\b(?:placeholder|template(?:-completion)?|filler|housekeeping|slot(?:-filling)?|not applicable|as above|same as above|tbd)\b/iu.test(s);
const push = (errors, gate, row, code, detail) => errors.push({ gate, row: row + 1, code, detail });

export function validateTokenArtifact(raw, packet, rowMap, identitySanitization) {
  let rows;
  try { rows = parseStrictJsonl(raw); }
  catch (error) { return { phaseT: "FAIL", parseClass: error instanceof StrictJsonError ? error.kind : "MALFORMED_JSON", duplicateKey: error.key ?? null, duplicateKeyRows: error.kind === "DUPLICATE_KEY" ? 1 : 0, errors: [{ gate: "T-G1", row: error.row ?? null, code: error.kind ?? "MALFORMED_JSON", detail: { key: error.key ?? null, offset: error.offset ?? null } }], gates: { "T-G1": "FAIL" } }; }
  const errors = [], gates = Object.fromEntries([1,2,4,5,6,7,8,9,10,11,12,13,14,15].map((n) => [`T-G${n}`, "PASS"])); gates["T-G3"] = "RETIRED";
  const expectedTokens = packet.targetOrder, rowsByToken = new Map();
  rows.forEach((row, ri) => {
    if (!exactKeys(row, topFields)) push(errors, "T-G1", ri, "SCHEMA", { expectedFields: topFields, actualFields: row && typeof row === "object" ? Object.keys(row) : [] });
    if (!verdicts.has(row.verdict) || typeof row.testedDecision !== "string" || typeof row.reason !== "string" || !row.stageEvaluations || typeof row.stageEvaluations !== "object" || Array.isArray(row.stageEvaluations) || !Array.isArray(row.partEvidenceIds) || !Array.isArray(row.stageEvidenceIds) || !exactKeys(row.locus, locusFields)) push(errors, "T-G1", ri, "SCHEMA", {});
    if (rowsByToken.has(row.rowToken)) push(errors, "T-G2", ri, "CARDINALITY", { duplicateRowToken: row.rowToken }); else rowsByToken.set(row.rowToken, row);
  });
  if (rows.length !== expectedTokens.length) errors.push({ gate: "T-G2", row: null, code: "CARDINALITY", detail: { expected: expectedTokens.length, actual: rows.length } });
  for (const t of expectedTokens) if (!rowsByToken.has(t)) errors.push({ gate: "T-G2", row: null, code: "CARDINALITY", detail: { missingRowToken: t } });
  for (const t of rowsByToken.keys()) if (!expectedTokens.includes(t)) errors.push({ gate: "T-G2", row: null, code: "CARDINALITY", detail: { foreignRowToken: t } });
  const mapRows = new Map(rowMap.rows.filter((r) => r.packetId === packet.packetId).map((r) => [r.rowToken, r]));
  const caseByRow = new Map(); for (const c of packet.cases) for (const t of c.targets) caseByRow.set(t.rowToken, c);
  const reasons = new Map(), bases = new Map();
  rows.forEach((row, ri) => {
    const mr = mapRows.get(row.rowToken), c = caseByRow.get(row.rowToken); if (!mr || !c) return;
    const declared = mr.declaredStageTokens, actual = Object.keys(row.stageEvaluations ?? {}), missing = declared.filter((x) => !actual.includes(x)), foreign = actual.filter((x) => !declared.includes(x));
    if (missing.length || foreign.length) push(errors, "T-G4", ri, missing.length ? "MISSING_KEY" : "FOREIGN_KEY", { missing, foreign });
    const catalog = new Map(c.evidenceCatalog.map((e) => [e.evidenceId, e])); let unsafe = 0;
    for (const [stageToken, ev] of Object.entries(row.stageEvaluations ?? {})) {
      if (!exactKeys(ev, evalFields)) push(errors, "T-G1", ri, "SCHEMA", { stageToken, actualFields: ev && typeof ev === "object" ? Object.keys(ev) : [] });
      if (!contributions.has(ev?.contribution)) push(errors, "T-G5", ri, "VALUE", { stageToken, field: "contribution" });
      if (ev?.contribution === "UNSAFE") unsafe += 1;
      if (!Array.isArray(ev?.evidenceIds) || (["REQUIRED", "UNSAFE"].includes(ev?.contribution) && ev.evidenceIds.length === 0) || (ev?.evidenceIds ?? []).some((id) => catalog.get(id)?.stageToken !== stageToken)) push(errors, "T-G8", ri, "VALUE", { stageToken, field: "evidenceIds" });
      if (filler(ev?.basis)) push(errors, "T-G14", ri, "VALUE", { stageToken, field: "basis" });
      if (typeof ev?.basis === "string") { if (bases.has(ev.basis)) push(errors, "T-G14", ri, "VALUE", { repeatedBasisWithRow: bases.get(ev.basis) }); else bases.set(ev.basis, ri + 1); }
    }
    if ((row.verdict === "LEAK") !== (unsafe > 0)) push(errors, "T-G6", ri, "VALUE", {});
    const unsafeKeys = Object.entries(row.stageEvaluations ?? {}).filter(([, e]) => e.contribution === "UNSAFE").map(([k]) => k);
    if (row.verdict === "LEAK") { if (!unsafeKeys.includes(row.locus?.stageToken)) push(errors, "T-G7", ri, "VALUE", {}); }
    else if (row.locus?.stageToken !== null || row.locus?.evidenceIds?.length !== 0 || row.locus?.verbatimSpan !== null) push(errors, "T-G7", ri, "VALUE", {});
    if (row.partEvidenceIds.length < 1 || row.partEvidenceIds.length > 4 || row.partEvidenceIds.some((id) => catalog.get(id)?.rowToken !== row.rowToken)) push(errors, "T-G8", ri, "VALUE", { field: "partEvidenceIds" });
    if (row.stageEvidenceIds.length < 1 || row.stageEvidenceIds.length > 8 || row.stageEvidenceIds.some((id) => !declared.includes(catalog.get(id)?.stageToken))) push(errors, "T-G8", ri, "VALUE", { field: "stageEvidenceIds" });
    if (row.verdict === "LEAK" && (!row.locus.evidenceIds.length || row.locus.evidenceIds.some((id) => catalog.get(id)?.stageToken !== row.locus.stageToken || !row.stageEvidenceIds.includes(id)))) push(errors, "T-G9", ri, "VALUE", {});
    if (row.locus?.verbatimSpan !== null && (typeof row.locus.verbatimSpan !== "string" || !JSON.stringify(c).includes(JSON.stringify(row.locus.verbatimSpan).slice(1, -1)))) push(errors, "T-G10", ri, "VALUE", {});
    if (row.verdict === "REVIEW" && !/\b(?:ambig|unclear|cannot|unable|conflict|insufficient|unresolved|boundary)\b/iu.test(row.reason)) push(errors, "T-G11", ri, "VALUE", {});
    if (!relations.has(row.bilingualRelation)) push(errors, "T-G12", ri, "VALUE", {});
    if (words(row.testedDecision) > 30 || words(row.testedDecision) === 0 || sentenceCount(row.testedDecision) > 1) push(errors, "T-G13", ri, "VALUE", { words: words(row.testedDecision), sentences: sentenceCount(row.testedDecision) });
    if (filler(row.testedDecision) || filler(row.reason)) push(errors, "T-G14", ri, "VALUE", { field: "testedDecision/reason" });
    if (reasons.has(row.reason)) push(errors, "T-G14", ri, "VALUE", { repeatedReasonWithRow: reasons.get(row.reason) }); else reasons.set(row.reason, ri + 1);
    if (typeof row.rowToken !== "string" || !mapRows.has(row.rowToken) || row.locus?.stageToken !== null && !declared.includes(row.locus.stageToken)) push(errors, "T-G15", ri, "VALUE", { field: "structured identity" });
  });
  const rawString = raw; const high = identitySanitization.packets.find((p) => p.packetId === packet.packetId)?.highSpecificityDenySet ?? [];
  const residue = high.filter((id) => id && rawString.includes(id)); if (residue.length) errors.push({ gate: "T-G15", row: null, code: "VALUE", detail: { exactHighSpecificityResidueCount: residue.length } });
  for (const e of errors) gates[e.gate] = "FAIL";
  return { phaseT: errors.length ? "FAIL" : "PASS", parseClass: null, duplicateKeyRows: 0, rows, errors, gates, observations: { missingOrForeignKeyRows: new Set(errors.filter((e) => e.gate === "T-G4").map((e) => e.row)).size, fillerBasisRows: new Set(errors.filter((e) => e.gate === "T-G14" && e.detail?.field !== "testedDecision/reason").map((e) => e.row)).size } };
}

export function reconstructRows(rows, packet, rowMap, hashes, attempt) {
  const mapRows = new Map(rowMap.rows.filter((r) => r.packetId === packet.packetId).map((r) => [r.rowToken, r]));
  const packetCases = rowMap.cases.filter((c) => c.packetId === packet.packetId);
  const stageMap = new Map(packetCases.flatMap((c) => c.stages).map((s) => [s.stageToken, s]));
  const evidenceMap = new Map(packetCases.flatMap((c) => c.evidence).map((e) => [e.packetEvidenceId, e.canonicalEvidenceId]));
  const byToken = new Map(rows.map((r) => [r.rowToken, r])); const reconstructed = [], roundTrips = [];
  for (const rowToken of packet.targetOrder) {
    const row = byToken.get(rowToken), mr = mapRows.get(rowToken); const declared = mr.declaredStageTokens;
    const stageEnumeration = declared.map((st) => ({ stageId: stageMap.get(st).canonicalStageId, contribution: row.stageEvaluations[st].contribution, evidenceIds: row.stageEvaluations[st].evidenceIds.map((id) => evidenceMap.get(id)), basis: row.stageEvaluations[st].basis }));
    const requiredStageIds = stageEnumeration.filter((e) => e.contribution === "REQUIRED").map((e) => e.stageId), unsafeStageIds = stageEnumeration.filter((e) => e.contribution === "UNSAFE").map((e) => e.stageId);
    const canonical = { questionId: mr.questionId, queueIndex: mr.queueIndex, rowToken, packetId: packet.packetId, attempt, verdict: row.verdict, testedDecision: row.testedDecision, stageEnumeration, requiredStageIds, unsafeStageIds, partEvidenceIds: row.partEvidenceIds.map((id) => evidenceMap.get(id)), stageEvidenceIds: row.stageEvidenceIds.map((id) => evidenceMap.get(id)), locus: { stageId: row.locus.stageToken === null ? null : stageMap.get(row.locus.stageToken).canonicalStageId, evidenceIds: row.locus.evidenceIds.map((id) => evidenceMap.get(id)), verbatimSpan: row.locus.verbatimSpan }, bilingualRelation: row.bilingualRelation, reason: row.reason, instrument: INSTRUMENT, reconstruction: { rowMapSha256: hashes.rowMapSha256, packetSha256: hashes.packetSha256, outputSha256: hashes.outputSha256, labelsSuppliedByHarvester: 0 } };
    reconstructed.push(canonical);
    const retokenized = { rowToken, verdict: canonical.verdict, testedDecision: canonical.testedDecision, stageEvaluations: Object.fromEntries(declared.map((st, i) => [st, { contribution: canonical.stageEnumeration[i].contribution, evidenceIds: row.stageEvaluations[st].evidenceIds, basis: canonical.stageEnumeration[i].basis }])), partEvidenceIds: row.partEvidenceIds, stageEvidenceIds: row.stageEvidenceIds, locus: { stageToken: row.locus.stageToken, evidenceIds: row.locus.evidenceIds, verbatimSpan: row.locus.verbatimSpan }, bilingualRelation: canonical.bilingualRelation, reason: canonical.reason };
    roundTrips.push(deepEqual(retokenized, row));
  }
  const rA1 = reconstructed.every((r) => new Set(r.stageEnumeration.map((x) => x.stageId)).size === r.stageEnumeration.length && r.stageEnumeration.every((x) => x.stageId));
  const rA2 = reconstructed.every((r) => r.reconstruction.labelsSuppliedByHarvester === 0 && deepEqual(r.requiredStageIds, r.stageEnumeration.filter((x) => x.contribution === "REQUIRED").map((x) => x.stageId)) && deepEqual(r.unsafeStageIds, r.stageEnumeration.filter((x) => x.contribution === "UNSAFE").map((x) => x.stageId)));
  const rA3 = reconstructed.every((r) => r.verdict !== "LEAK" ? r.locus.stageId === null : r.unsafeStageIds.includes(r.locus.stageId));
  const rA4 = roundTrips.every(Boolean);
  return { phaseR: rA1 && rA2 && rA3 && rA4 ? "PASS" : "FAIL", assertions: { "R-A1": rA1 ? "PASS" : "FAIL", "R-A2": rA2 ? "PASS" : "FAIL", "R-A3": rA3 ? "PASS" : "FAIL", "R-A4": rA4 ? "PASS" : "FAIL" }, reconstructed };
}
