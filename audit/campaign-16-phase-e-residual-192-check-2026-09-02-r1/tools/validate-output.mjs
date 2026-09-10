import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VERDICTS = new Set(["LEAK", "NO_LEAK_COMPLETE_RECORD", "NO_LEAK_NONANSWERING_DATA", "REVIEW"]);
const BILINGUAL = new Set(["PARALLEL", "EN_ONLY_LEAK", "ZH_ONLY_LEAK", "MATERIAL_DIVERGENCE", "UNRESOLVED"]);
const CONTRIBUTIONS = new Set(["REQUIRED", "UNSAFE", "NONANSWERING"]);
const ROW_KEYS = ["rowToken", "verdict", "testedDecision", "requiredStageIds", "unsafeStageIds", "stageEnumeration", "partEvidenceIds", "stageEvidenceIds", "locus", "bilingualRelation", "reason"].sort();
const ENUM_KEYS = ["stageId", "contribution", "evidenceIds", "basis"].sort();
const LOCUS_KEYS = ["stageId", "evidenceIds", "verbatimSpan"].sort();
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const exactKeys = (value, keys) => value && typeof value === "object" && !Array.isArray(value) && same(Object.keys(value).sort(), keys);
const norm = (s) => String(s).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const words = (s) => String(s).trim().split(/\s+/u).filter(Boolean).length;
const sentences = (s) => {
  const protectedText = String(s).replace(/(?<=\d)\.(?=\d)/gu, "∯").replace(/\b(?:e\.g\.|i\.e\.|Dr\.|Mr\.|Mrs\.|Ms\.|vs\.|etc\.)/giu, (m) => m.replaceAll(".", "∯"));
  const pieces = protectedText.split(/(?:[!?。！？]+|\.(?=\s+[A-Z\p{Script=Han}]|$))/u).map((x) => x.trim()).filter(Boolean);
  return pieces.length;
};
const stringLeaves = (value, out = []) => {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((x) => stringLeaves(x, out));
  else if (value && typeof value === "object") Object.entries(value).filter(([k]) => k !== "evidenceIds" && k !== "evidenceCatalog").forEach(([, x]) => stringLeaves(x, out));
  return out;
};

export function parseJsonl(raw) {
  const lines = raw.split(/\r?\n/u).filter((line) => line.trim() !== "");
  return lines.map((line, index) => {
    try { return JSON.parse(line); } catch (error) { throw new Error(`G1 line ${index + 1}: ${error.message}`); }
  });
}

export function validate(packet, rows) {
  const errors = [];
  const fail = (gate, message) => errors.push(`${gate}: ${message}`);
  if (!packet || typeof packet !== "object" || !Array.isArray(packet.cases) || !Array.isArray(packet.targetOrder)) fail("G1", "invalid packet schema");
  const targets = new Map(), targetCase = new Map();
  for (const c of packet.cases ?? []) for (const t of c.targets ?? []) { targets.set(t.rowToken, t); targetCase.set(t.rowToken, c); }
  if (rows.length !== packet.targetOrder.length) fail("G2", `expected ${packet.targetOrder.length} rows, received ${rows.length}`);
  const tokens = rows.map((r) => r?.rowToken);
  if (new Set(tokens).size !== tokens.length) fail("G2", "duplicate rowToken");
  if (!same(tokens, packet.targetOrder)) fail("G3", "row identity/order differs from targetOrder");
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i], where = `row ${i + 1}`;
    if (!exactKeys(row, ROW_KEYS)) { fail("G1", `${where} keys/schema`); continue; }
    const target = targets.get(row.rowToken), c = targetCase.get(row.rowToken);
    if (!target || !c) { fail("G3", `${where} unknown rowToken`); continue; }
    if (!VERDICTS.has(row.verdict)) fail("G1", `${where} unknown verdict`);
    if (typeof row.testedDecision !== "string" || !row.testedDecision.trim() || words(row.testedDecision) > 30 || /[\r\n]/u.test(row.testedDecision)) fail("G1", `${where} testedDecision shape/length`);
    if (!Array.isArray(row.requiredStageIds) || !Array.isArray(row.unsafeStageIds) || !Array.isArray(row.stageEnumeration) || !Array.isArray(row.partEvidenceIds) || !Array.isArray(row.stageEvidenceIds)) fail("G1", `${where} array field shape`);
    if (!exactKeys(row.locus, LOCUS_KEYS)) fail("G1", `${where} locus shape`);
    if (!BILINGUAL.has(row.bilingualRelation)) fail("G12", `${where} bilingual vocabulary`);
    if (typeof row.reason !== "string" || !row.reason.trim() || sentences(row.reason) < 1 || sentences(row.reason) > 3) fail("G1", `${where} reason sentence shape`);
    const declared = target.declaredStageIds ?? [];
    const enumeratedIds = row.stageEnumeration.map((x) => x?.stageId);
    if (!same(enumeratedIds, declared)) fail("G4", `${where} stage enumeration must equal authored order`);
    const required = row.stageEnumeration.filter((x) => x?.contribution === "REQUIRED").map((x) => x.stageId);
    const unsafe = row.stageEnumeration.filter((x) => x?.contribution === "UNSAFE").map((x) => x.stageId);
    if (!same(row.requiredStageIds, required)) fail("G5", `${where} requiredStageIds binding`);
    if (!same(row.unsafeStageIds, unsafe)) fail("G6", `${where} unsafeStageIds binding`);
    if ((row.verdict === "LEAK") !== (row.unsafeStageIds.length > 0)) fail("G7", `${where} verdict/unsafe binding`);
    const catalog = new Map((c.evidenceCatalog ?? []).map((e) => [e.evidenceId, e]));
    const partAllowed = new Set(target.partEvidenceIds ?? []);
    const stages = new Map((c.stages ?? []).map((s) => [s.id, s]));
    const stageAllowed = new Set([...stages.values()].flatMap((s) => s.evidenceIds ?? []));
    if (row.partEvidenceIds.length < 1 || row.partEvidenceIds.length > 4 || row.partEvidenceIds.some((id) => !partAllowed.has(id) || !catalog.has(id))) fail("G9", `${where} part evidence ownership/count`);
    if (row.stageEvidenceIds.length < 1 || row.stageEvidenceIds.length > 8 || row.stageEvidenceIds.some((id) => !stageAllowed.has(id) || !catalog.has(id))) fail("G9", `${where} stage evidence ownership/count`);
    for (let j = 0; j < row.stageEnumeration.length; j += 1) {
      const e = row.stageEnumeration[j];
      if (!exactKeys(e, ENUM_KEYS) || !CONTRIBUTIONS.has(e.contribution) || !Array.isArray(e.evidenceIds) || typeof e.basis !== "string" || !e.basis.trim() || /[\r\n]/u.test(e.basis)) { fail("G1", `${where} enumeration ${j + 1} shape`); continue; }
      const stage = stages.get(e.stageId), ids = new Set(stage?.evidenceIds ?? []);
      if ((e.contribution === "REQUIRED" || e.contribution === "UNSAFE") && e.evidenceIds.length === 0) fail("G9", `${where} ${e.stageId} requires evidence`);
      if (e.evidenceIds.some((id) => !ids.has(id) || !catalog.has(id))) fail("G9", `${where} ${e.stageId} evidence ownership`);
    }
    if (row.verdict === "LEAK") {
      if (!row.unsafeStageIds.includes(row.locus.stageId) || row.locus.evidenceIds.length === 0 || row.locus.evidenceIds.some((id) => !row.stageEvidenceIds.includes(id))) fail("G8", `${where} leak locus binding`);
      const locusStage = stages.get(row.locus.stageId), locusAllowed = new Set(locusStage?.evidenceIds ?? []);
      if (row.locus.evidenceIds.some((id) => !locusAllowed.has(id))) fail("G8", `${where} locus evidence stage ownership`);
      if (row.locus.verbatimSpan !== null) {
        if (typeof row.locus.verbatimSpan !== "string" || !row.locus.verbatimSpan.trim() || !stringLeaves(locusStage).some((leaf) => leaf.includes(row.locus.verbatimSpan))) fail("G10", `${where} verbatim span is not exact stage text`);
      }
    } else if (row.locus.stageId !== null || !same(row.locus.evidenceIds, []) || row.locus.verbatimSpan !== null) fail("G8", `${where} non-leak locus must be null/empty`);
    if (row.verdict === "REVIEW" && (row.reason.trim().length < 30 || !/(ambig|unclear|cannot|unresolved|boundary|stage|intent|recover)/iu.test(row.reason))) fail("G11", `${where} inadequate REVIEW ambiguity`);
  }
  for (const [field, gate] of [["reason", "G13"], ["testedDecision", "G13"]]) {
    const counts = new Map(); for (const row of rows) { const value = norm(row?.[field]); if (value) counts.set(value, (counts.get(value) ?? 0) + 1); }
    for (const [value, count] of counts) if (count > 2) fail(gate, `${field} boilerplate repeated ${count} times: ${value.slice(0, 80)}`);
  }
  const forbiddenKeys = new Set(["queueIndex", "bankPath", "parentCaseId", "partId", "control", "controlRole", "expectedVerdict", "producerVerdict", "checkerVerdict", "selectionReasons"]);
  const scan = (value) => { if (Array.isArray(value)) value.forEach(scan); else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) { if (forbiddenKeys.has(k)) fail("G14", `forbidden output metadata key ${k}`); scan(v); } };
  rows.forEach(scan);
  return { ok: errors.length === 0, packetId: packet.packetId, expectedRows: packet.targetOrder.length, receivedRows: rows.length, gates: Object.fromEntries(Array.from({ length: 14 }, (_, i) => [`G${i + 1}`, errors.some((e) => e.startsWith(`G${i + 1}:`)) ? "FAIL" : "PASS"])), errors };
}

function fixture() {
  const targets = [1, 2, 3].map((n) => ({ rowToken: `t${n}`, declaredStageIds: ["s1", "s2"], partEvidenceIds: [`p${n}`] }));
  const packet = { packetId: "fixture", targetOrder: targets.map((x) => x.rowToken), cases: [{ parentCaseId: "case", stages: [{ id: "s1", note: "Baseline finding.", evidenceIds: ["e1"] }, { id: "s2", note: "Later action completed.", evidenceIds: ["e2"] }], targets, evidenceCatalog: [...targets.map((t) => ({ evidenceId: t.partEvidenceIds[0], surface: "PART_STEM", ownerPartId: t.rowToken })), { evidenceId: "e1", surface: "STAGE", stageId: "s1" }, { evidenceId: "e2", surface: "STAGE", stageId: "s2" }] }] };
  const row = (n) => ({ rowToken: `t${n}`, verdict: "LEAK", testedDecision: `Choose response ${n} for this item.`, requiredStageIds: ["s1"], unsafeStageIds: ["s2"], stageEnumeration: [{ stageId: "s1", contribution: "REQUIRED", evidenceIds: ["e1"], basis: `Baseline ${n} is required.` }, { stageId: "s2", contribution: "UNSAFE", evidenceIds: ["e2"], basis: `Later action ${n} cues the response.` }], partEvidenceIds: [`p${n}`], stageEvidenceIds: ["e1", "e2"], locus: { stageId: "s2", evidenceIds: ["e2"], verbatimSpan: "Later action" }, bilingualRelation: "PARALLEL", reason: `Later stage evidence directly cues response ${n}.` });
  return { packet, rows: [row(1), row(2), row(3)] };
}

function selfTest() {
  const { packet, rows } = fixture();
  if (!validate(packet, rows).ok) throw new Error(`valid fixture failed: ${validate(packet, rows).errors.join("; ")}`);
  const tests = [];
  const add = (name, mutate, gate) => tests.push({ name, mutate, gate });
  add("missing", (p, r) => r.pop(), "G2"); add("duplicate", (p, r) => r[2] = structuredClone(r[1]), "G2"); add("extra", (p, r) => r.push({ ...structuredClone(r[0]), rowToken: "extra" }), "G2"); add("order", (p, r) => [r[0], r[1]] = [r[1], r[0]], "G3"); add("stages", (p, r) => r[0].stageEnumeration.pop(), "G4"); add("required", (p, r) => r[0].requiredStageIds = [], "G5"); add("unsafe", (p, r) => r[0].unsafeStageIds = [], "G6"); add("verdict", (p, r) => r[0].verdict = "NO_LEAK_NONANSWERING_DATA", "G7"); add("locus", (p, r) => r[0].locus.stageId = "s1", "G8"); add("part-evidence", (p, r) => r[0].partEvidenceIds = ["foreign"], "G9"); add("stage-evidence", (p, r) => r[0].stageEnumeration[1].evidenceIds = ["e1"], "G9"); add("span", (p, r) => r[0].locus.verbatimSpan = "not present", "G10"); add("review", (p, r) => { r[0].verdict = "REVIEW"; r[0].unsafeStageIds = []; r[0].stageEnumeration[1].contribution = "NONANSWERING"; r[0].locus = { stageId: null, evidenceIds: [], verbatimSpan: null }; r[0].reason = "Maybe."; }, "G11"); add("bilingual", (p, r) => r[0].bilingualRelation = "SAME", "G12"); add("boilerplate", (p, r) => r.forEach((x) => x.reason = "The identical generic reason is repeated."), "G13"); add("metadata", (p, r) => r[0].queueIndex = 1, "G14"); add("unknown-key", (p, r) => r[0].confidence = 0.8, "G1");
  for (const test of tests) { const p = structuredClone(packet), r = structuredClone(rows); test.mutate(p, r); const result = validate(p, r); if (result.ok || result.gates[test.gate] !== "FAIL") throw new Error(`${test.name} did not fail ${test.gate}: ${result.errors.join("; ")}`); }
  let parseRejected = false; try { parseJsonl("{bad}"); } catch { parseRejected = true; } if (!parseRejected) throw new Error("parse negative did not fail G1");
  return { status: "PASS", validFixtures: 1, negativeFixtures: tests.length + 1, decimalAndAbbreviationSentenceProtection: sentences("Dose is 2.5 mg, e.g. once daily.") === 1 };
}

function cli() {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) { console.log(JSON.stringify(selfTest(), null, 2)); return; }
  const packetArg = args.indexOf("--packet"), outputArg = args.indexOf("--output");
  if (packetArg < 0 || outputArg < 0) throw new Error("usage: validate-output.mjs --packet <path> --output <path>");
  const packet = JSON.parse(fs.readFileSync(args[packetArg + 1], "utf8"));
  let rows; try { rows = parseJsonl(fs.readFileSync(args[outputArg + 1], "utf8")); } catch (error) { console.log(JSON.stringify({ ok: false, packetId: packet.packetId, gates: { G1: "FAIL" }, errors: [error.message] }, null, 2)); process.exitCode = 1; return; }
  const result = validate(packet, rows); console.log(JSON.stringify(result, null, 2)); if (!result.ok) process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) cli();
