// Phase E Stage 2 — checker-local copy of the generic Phase E semantic-output validator.
// Adapted from the frozen producer validator: the expected population for a checker
// packet is that packet's SELECTED targets, not the full Stage-0 packet population.
// Reads only the checker root. Never reads producer semantic output.
import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const PACKETS = resolve(ROOT, "checker-packets");
const VERDICTS = new Set(["LEAK", "NO_LEAK_COMPLETE_RECORD", "NO_LEAK_NONANSWERING_DATA", "REVIEW"]);
const BILINGUAL = new Set(["PARALLEL", "EN_ONLY_LEAK", "ZH_ONLY_LEAK", "MATERIAL_DIVERGENCE", "UNRESOLVED"]);
const PART_SURFACES = new Set(["PART_STEM", "PART_RESPONSE", "PART_KEY", "PART_RATIONALE"]);
const ROW_KEYS = new Set(["queueIndex", "packetId", "bankPath", "parentCaseId", "partId", "verdict", "testedDecision", "requiredStageIds", "unsafeStageIds", "partEvidenceIds", "stageEvidenceIds", "bilingualRelation", "reason"]);

type Target = { queueIndex: number; packetId: string; bankPath: string; parentCaseId: string; partId: string; declaredStageIds: string[] };
type Evidence = { evidenceId: string; parentCaseId: string; ownerPartId?: string; surface: string; stageId?: string };
type Packet = { packetId: string; cases: Array<{ targets: Target[] }>; evidenceCatalog: Evidence[] };
type Row = { queueIndex: number; packetId: string; bankPath: string; parentCaseId: string; partId: string; verdict: string; testedDecision: string; requiredStageIds: string[]; unsafeStageIds: string[]; partEvidenceIds: string[]; stageEvidenceIds: string[]; bilingualRelation: string; reason: string };

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((e) => typeof e === "string");

async function jsonl(path: string): Promise<unknown[]> {
  const absolute = resolve(path);
  assert(absolute === ROOT || absolute.startsWith(`${ROOT}${sep}`), `input outside checker root: ${path}`);
  return (await readFile(absolute, "utf8")).split(/\r?\n/u).filter((l) => l.trim()).map((l, i) => { try { return JSON.parse(l); } catch (e) { throw new Error(`invalid JSONL line ${i + 1}: ${String(e)}`); } });
}
async function packet(id: string): Promise<Packet> {
  assert(/^packet-\d{3}$/u.test(id), `invalid packet ID ${id}`);
  return JSON.parse(await readFile(resolve(PACKETS, `${id}.json`), "utf8")) as Packet;
}
const expectedTargets = (p: Packet): Target[] => p.cases.flatMap((c) => c.targets).sort((a, b) => a.queueIndex - b.queueIndex);

async function validate(rows: unknown[], packetId: string, catalogOverride?: Map<string, Evidence>): Promise<string[]> {
  const source = await packet(packetId);
  const expected = expectedTargets(source);
  const catalog = catalogOverride ?? new Map(source.evidenceCatalog.map((e) => [e.evidenceId, e]));
  const errors: string[] = [];
  if (rows.length !== expected.length) errors.push(`target count mismatch: expected ${expected.length}, received ${rows.length}`);
  const expectedQueue = expected.map(({ queueIndex }) => queueIndex);
  const actualQueue = rows.map((r) => (typeof r === "object" && r !== null ? (r as { queueIndex?: unknown }).queueIndex : undefined));
  if (JSON.stringify(actualQueue) !== JSON.stringify(expectedQueue)) errors.push("missing, duplicate, extra, or out-of-order target");
  const reasonCounts = new Map<string, number>();
  rows.forEach((raw, index) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) { errors.push(`row ${index + 1}: must be object`); return; }
    const row = raw as Partial<Row>; const wanted = expected[index];
    if (!wanted) { errors.push(`row ${index + 1}: extra target`); return; }
    const keys = Object.keys(row);
    if (keys.length !== ROW_KEYS.size || keys.some((k) => !ROW_KEYS.has(k))) errors.push(`row ${index + 1}: row shape is not closed`);
    for (const f of ["queueIndex", "packetId", "bankPath", "parentCaseId", "partId"] as const) if (row[f] !== wanted[f]) errors.push(`row ${index + 1}: identity mismatch for ${f}`);
    if (typeof row.verdict !== "string" || !VERDICTS.has(row.verdict)) errors.push(`row ${index + 1}: unknown verdict`);
    if (typeof row.bilingualRelation !== "string" || !BILINGUAL.has(row.bilingualRelation)) errors.push(`row ${index + 1}: unknown bilingual relation`);
    if (typeof row.testedDecision !== "string" || !row.testedDecision.trim()) errors.push(`row ${index + 1}: empty testedDecision`);
    else if (row.testedDecision.trim().split(/\s+/u).length > 30) errors.push(`row ${index + 1}: testedDecision exceeds 30 words`);
    if (typeof row.reason !== "string" || !row.reason.trim()) errors.push(`row ${index + 1}: empty reason`);
    else {
      if (row.verdict === "REVIEW" && row.reason.trim().length < 20) errors.push(`row ${index + 1}: inadequate REVIEW explanation`);
      const sentences = row.reason.split(/[.!?]+(?:\s+|$)/u).filter((s) => s.trim()).length;
      if (sentences < 1 || sentences > 3) errors.push(`row ${index + 1}: reason must be 1-3 sentences`);
      reasonCounts.set(row.reason, (reasonCounts.get(row.reason) ?? 0) + 1);
    }
    for (const [field, min, max] of [["requiredStageIds", 0, Infinity], ["unsafeStageIds", 0, Infinity], ["partEvidenceIds", 1, 4], ["stageEvidenceIds", 1, 6]] as const) {
      const value = row[field];
      if (!isStringArray(value)) errors.push(`row ${index + 1}: ${field} must be string array`);
      else { if (value.length < min || value.length > max) errors.push(`row ${index + 1}: ${field} length outside contract`); if (new Set(value).size !== value.length) errors.push(`row ${index + 1}: ${field} duplicate`); }
    }
    const declared = new Set(wanted.declaredStageIds);
    for (const s of [...(row.requiredStageIds ?? []), ...(row.unsafeStageIds ?? [])]) if (!declared.has(s)) errors.push(`row ${index + 1}: undeclared required/unsafe stage ${s}`);
    if (row.verdict === "LEAK" && !row.unsafeStageIds?.length) errors.push(`row ${index + 1}: LEAK has no unsafe stage`);
    if (row.verdict !== "LEAK" && row.unsafeStageIds?.length) errors.push(`row ${index + 1}: non-LEAK has unsafe stages`);
    const inspect = (ids: string[] | undefined, kind: "part" | "stage") => (ids ?? []).forEach((id) => {
      const entry = catalog.get(id);
      if (!entry) { errors.push(`row ${index + 1}: foreign evidence ID ${id}`); return; }
      if (entry.parentCaseId !== wanted.parentCaseId) errors.push(`row ${index + 1}: cross-case evidence ID ${id}`);
      if (kind === "part" && !PART_SURFACES.has(entry.surface)) errors.push(`row ${index + 1}: part evidence has surface ${entry.surface}`);
      if (kind === "part" && entry.ownerPartId !== wanted.partId) errors.push(`row ${index + 1}: evidence belongs to another part`);
      if (kind === "stage" && entry.surface !== "STAGE") errors.push(`row ${index + 1}: stage evidence has surface ${entry.surface}`);
    });
    inspect(row.partEvidenceIds, "part"); inspect(row.stageEvidenceIds, "stage");
    if (row.verdict === "LEAK" && (!row.partEvidenceIds?.length || !row.stageEvidenceIds?.length)) errors.push(`row ${index + 1}: LEAK lacks part and stage support`);
  });
  for (const [reason, count] of reasonCounts) if (count > 2) errors.push(`${packetId}: repeated boilerplate reason on ${count} rows: ${reason}`);
  return errors;
}

async function fixture(packetId: string): Promise<Row[]> {
  const source = await packet(packetId);
  return expectedTargets(source).map((t) => {
    const part = source.evidenceCatalog.find((e) => e.parentCaseId === t.parentCaseId && e.ownerPartId === t.partId && PART_SURFACES.has(e.surface))!;
    const stage = source.evidenceCatalog.find((e) => e.parentCaseId === t.parentCaseId && e.surface === "STAGE")!;
    return { queueIndex: t.queueIndex, packetId: t.packetId, bankPath: t.bankPath, parentCaseId: t.parentCaseId, partId: t.partId, verdict: "REVIEW", testedDecision: `Determine the intended decision for target ${t.queueIndex}.`, requiredStageIds: [], unsafeStageIds: [], partEvidenceIds: [part.evidenceId], stageEvidenceIds: [stage.evidenceId], bilingualRelation: "UNRESOLVED", reason: `The intended stage boundary for target ${t.queueIndex} cannot be recovered unambiguously from this packet.` };
  });
}

async function selfTest(): Promise<void> {
  const manifest = JSON.parse(await readFile(resolve(ROOT, "checker-packet-manifest.json"), "utf8")) as { packets: Array<{ packetId: string; targetCount: number }> };
  const id = manifest.packets.find((p) => p.targetCount >= 3)?.packetId;
  assert(id, "self-test needs a checker packet with at least three targets");
  const source = await packet(id);
  const baseline = await fixture(id);
  assert((await validate(baseline, id)).length === 0, "valid control fixture failed");
  const clone = () => structuredClone(baseline);
  const declaredOf = (q: number) => expectedTargets(source).find((t) => t.queueIndex === q)!.declaredStageIds[0];
  const cases: Array<[string, (rows: Row[]) => void, RegExp]> = [
    ["missing target", (r) => { r.pop(); }, /target count|out-of-order/u],
    ["duplicate target", (r) => { r[1] = structuredClone(r[0]); }, /out-of-order|identity/u],
    ["extra target", (r) => { r.push(structuredClone(r.at(-1)!)); }, /target count|extra/u],
    ["out-of-order target", (r) => { [r[0], r[1]] = [r[1], r[0]]; }, /out-of-order|identity/u],
    ["wrong identity", (r) => { r[0].partId = "wrong"; }, /identity/u],
    ["wrong queueIndex", (r) => { r[0].queueIndex = r[0].queueIndex === 1 ? 999999 : 1; }, /out-of-order|identity/u],
    ["unknown verdict", (r) => { r[0].verdict = "MAYBE"; }, /unknown verdict/u],
    ["unknown bilingual relation", (r) => { r[0].bilingualRelation = "SAME"; }, /unknown bilingual/u],
    ["open row shape", (r) => { (r[0] as Record<string, unknown>).confidence = 0.9; }, /not closed/u],
    ["foreign evidence", (r) => { r[0].partEvidenceIds = ["foreign"]; }, /foreign evidence/u],
    ["undeclared stage", (r) => { r[0].verdict = "LEAK"; r[0].unsafeStageIds = ["foreign-stage"]; }, /undeclared/u],
    ["LEAK no unsafe", (r) => { r[0].verdict = "LEAK"; }, /no unsafe/u],
    ["LEAK no support", (r) => { r[0].verdict = "LEAK"; r[0].unsafeStageIds = [declaredOf(r[0].queueIndex)]; r[0].stageEvidenceIds = []; }, /length|lacks/u],
    ["non-LEAK unsafe", (r) => { r[0].unsafeStageIds = [declaredOf(r[0].queueIndex)]; }, /non-LEAK/u],
    ["inadequate REVIEW", (r) => { r[0].reason = "Unclear."; }, /inadequate/u],
    ["testedDecision over 30 words", (r) => { r[0].testedDecision = Array.from({ length: 31 }, (_, i) => `w${i}`).join(" "); }, /exceeds 30 words/u],
    ["repeated boilerplate", (r) => { r.slice(0, 3).forEach((row) => { row.reason = "The same generic reason repeats across unrelated rows."; }); }, /repeated boilerplate/u],
  ];
  for (const [name, mutate, pattern] of cases) {
    const rows = clone(); mutate(rows);
    const errors = await validate(rows, id);
    assert(errors.some((e) => pattern.test(e)), `${name} not rejected: ${errors.join("; ")}`);
  }
  const otherId = manifest.packets.find((p) => p.packetId !== id)!.packetId;
  const foreign = (await packet(otherId)).evidenceCatalog[0];
  const crossRows = clone(); crossRows[0].partEvidenceIds = [foreign.evidenceId];
  const injected = new Map(source.evidenceCatalog.map((e) => [e.evidenceId, e])); injected.set(foreign.evidenceId, foreign);
  const crossErrors = await validate(crossRows, id, injected);
  assert(crossErrors.some((e) => /cross-case/u.test(e)), `cross-case evidence not rejected: ${crossErrors.join("; ")}`);
  console.log(`checker validator controls passed: valid 1/1, negative ${cases.length + 1}/${cases.length + 1}`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) { await selfTest(); return; }
  const pi = args.indexOf("--packet"); const ii = args.indexOf("--input");
  const packetId = pi >= 0 ? args[pi + 1] : undefined; const input = ii >= 0 ? args[ii + 1] : undefined;
  assert(packetId, "--packet required"); assert(input, "--input required");
  const rows = await jsonl(input);
  const errors = await validate(rows, packetId);
  if (errors.length) { errors.forEach((e) => console.error(e)); process.exitCode = 1; return; }
  console.log(`checker output valid: ${rows.length}/${expectedTargets(await packet(packetId)).length} ${packetId}`);
}

await main();
