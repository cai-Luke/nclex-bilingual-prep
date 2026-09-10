import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";

const ROOT = resolve(import.meta.dirname);
const POPULATION = resolve(ROOT, "population.jsonl");
const PACKETS = resolve(ROOT, "packets");
const VERDICTS = new Set(["LEAK", "NO_LEAK_COMPLETE_RECORD", "NO_LEAK_NONANSWERING_DATA", "REVIEW"]);
const BILINGUAL = new Set(["PARALLEL", "EN_ONLY_LEAK", "ZH_ONLY_LEAK", "MATERIAL_DIVERGENCE", "UNRESOLVED"]);
const PART_SURFACES = new Set(["PART_STEM", "PART_RESPONSE", "PART_KEY", "PART_RATIONALE"]);
const ROW_KEYS = new Set(["queueIndex", "packetId", "bankPath", "parentCaseId", "partId", "verdict", "testedDecision", "requiredStageIds", "unsafeStageIds", "partEvidenceIds", "stageEvidenceIds", "bilingualRelation", "reason"]);

type PopulationRow = { queueIndex: number; packetId: string; bankPath: string; parentCaseId: string; partId: string; declaredStageIds: string[] };
type Evidence = { evidenceId: string; parentCaseId: string; ownerPartId?: string; surface: string; stageId?: string };
type Packet = { packetId: string; evidenceCatalog: Evidence[] };
type Candidate = { queueIndex: number; packetId: string; bankPath: string; parentCaseId: string; partId: string; verdict: string; testedDecision: string; requiredStageIds: string[]; unsafeStageIds: string[]; partEvidenceIds: string[]; stageEvidenceIds: string[]; bilingualRelation: string; reason: string };

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((entry) => typeof entry === "string");
async function jsonl(path: string): Promise<unknown[]> {
  const absolute = resolve(path); assert(absolute === ROOT || absolute.startsWith(`${ROOT}${sep}`), `input outside producer root: ${path}`);
  return (await readFile(absolute, "utf8")).split(/\r?\n/u).filter((line) => line.trim()).map((line, index) => { try { return JSON.parse(line); } catch (error) { throw new Error(`invalid JSONL line ${index + 1}: ${String(error)}`); } });
}
async function population(): Promise<PopulationRow[]> { return await jsonl(POPULATION) as PopulationRow[]; }
async function packet(id: string): Promise<Packet> { assert(/^packet-\d{3}$/u.test(id), `invalid packet ID ${id}`); return JSON.parse(await readFile(resolve(PACKETS, `${id}.json`), "utf8")) as Packet; }

async function validate(rows: unknown[], packetId?: string, catalogOverride?: Map<string, Map<string, Evidence>>): Promise<string[]> {
  const all = await population();
  const expected = packetId ? all.filter((row) => row.packetId === packetId) : all;
  const packetIds = [...new Set(expected.map((row) => row.packetId))];
  const catalogs = new Map<string, Map<string, Evidence>>();
  for (const id of packetIds) { const source = await packet(id); catalogs.set(id, new Map(source.evidenceCatalog.map((entry) => [entry.evidenceId, entry]))); }
  if (catalogOverride) for (const [id, catalog] of catalogOverride) catalogs.set(id, catalog);
  const errors: string[] = [];
  if (rows.length !== expected.length) errors.push(`target count mismatch: expected ${expected.length}, received ${rows.length}`);
  const expectedQueue = expected.map(({ queueIndex }) => queueIndex);
  const actualQueue = rows.map((row) => typeof row === "object" && row !== null ? (row as { queueIndex?: unknown }).queueIndex : undefined);
  if (JSON.stringify(actualQueue) !== JSON.stringify(expectedQueue)) errors.push("missing, duplicate, extra, or out-of-order target");
  const reasonCounts = new Map<string, Map<string, number>>();
  rows.forEach((raw, index) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) { errors.push(`row ${index + 1}: must be object`); return; }
    const row = raw as Partial<Candidate>; const wanted = expected[index];
    if (!wanted) { errors.push(`row ${index + 1}: extra target`); return; }
    const keys = Object.keys(row); if (keys.length !== ROW_KEYS.size || keys.some((key) => !ROW_KEYS.has(key))) errors.push(`row ${index + 1}: row shape is not closed`);
    for (const field of ["queueIndex", "packetId", "bankPath", "parentCaseId", "partId"] as const) if (row[field] !== wanted[field]) errors.push(`row ${index + 1}: identity mismatch for ${field}`);
    if (typeof row.verdict !== "string" || !VERDICTS.has(row.verdict)) errors.push(`row ${index + 1}: unknown verdict`);
    if (typeof row.bilingualRelation !== "string" || !BILINGUAL.has(row.bilingualRelation)) errors.push(`row ${index + 1}: unknown bilingual relation`);
    if (typeof row.testedDecision !== "string" || !row.testedDecision.trim()) errors.push(`row ${index + 1}: empty testedDecision`);
    else if (row.testedDecision.trim().split(/\s+/u).length > 30) errors.push(`row ${index + 1}: testedDecision exceeds 30 words`);
    if (typeof row.reason !== "string" || !row.reason.trim()) errors.push(`row ${index + 1}: empty reason`);
    else {
      if (row.verdict === "REVIEW" && row.reason.trim().length < 20) errors.push(`row ${index + 1}: inadequate REVIEW explanation`);
      const sentences = row.reason.split(/[.!?]+(?:\s+|$)/u).filter((sentence) => sentence.trim()).length;
      if (sentences < 1 || sentences > 3) errors.push(`row ${index + 1}: reason must be 1-3 sentences`);
      const packetReasons = reasonCounts.get(wanted.packetId) ?? new Map<string, number>(); packetReasons.set(row.reason, (packetReasons.get(row.reason) ?? 0) + 1); reasonCounts.set(wanted.packetId, packetReasons);
    }
    for (const [field, minimum, maximum] of [["requiredStageIds", 0, Infinity], ["unsafeStageIds", 0, Infinity], ["partEvidenceIds", 1, 4], ["stageEvidenceIds", 1, 6]] as const) {
      const value = row[field]; if (!isStringArray(value)) errors.push(`row ${index + 1}: ${field} must be string array`);
      else { if (value.length < minimum || value.length > maximum) errors.push(`row ${index + 1}: ${field} length outside contract`); if (new Set(value).size !== value.length) errors.push(`row ${index + 1}: ${field} duplicate`); }
    }
    const declared = new Set(wanted.declaredStageIds);
    for (const stageId of [...(row.requiredStageIds ?? []), ...(row.unsafeStageIds ?? [])]) if (!declared.has(stageId)) errors.push(`row ${index + 1}: undeclared required/unsafe stage ${stageId}`);
    if (row.verdict === "LEAK" && !row.unsafeStageIds?.length) errors.push(`row ${index + 1}: LEAK has no unsafe stage`);
    if (row.verdict !== "LEAK" && row.unsafeStageIds?.length) errors.push(`row ${index + 1}: non-LEAK has unsafe stages`);
    const catalog = catalogs.get(wanted.packetId) ?? new Map<string, Evidence>();
    const inspect = (ids: string[] | undefined, kind: "part" | "stage") => (ids ?? []).forEach((id) => {
      const entry = catalog.get(id); if (!entry) { errors.push(`row ${index + 1}: foreign evidence ID ${id}`); return; }
      if (entry.parentCaseId !== wanted.parentCaseId) errors.push(`row ${index + 1}: cross-case evidence ID ${id}`);
      if (kind === "part" && !PART_SURFACES.has(entry.surface)) errors.push(`row ${index + 1}: part evidence has surface ${entry.surface}`);
      if (kind === "part" && entry.ownerPartId !== wanted.partId) errors.push(`row ${index + 1}: evidence belongs to another part`);
      if (kind === "stage" && entry.surface !== "STAGE") errors.push(`row ${index + 1}: stage evidence has surface ${entry.surface}`);
    });
    inspect(row.partEvidenceIds, "part"); inspect(row.stageEvidenceIds, "stage");
    if (row.verdict === "LEAK" && (!row.partEvidenceIds?.length || !row.stageEvidenceIds?.length)) errors.push(`row ${index + 1}: LEAK lacks part and stage support`);
  });
  for (const [id, reasons] of reasonCounts) for (const [reason, count] of reasons) if (count > 2) errors.push(`${id}: repeated boilerplate reason on ${count} rows: ${reason}`);
  return errors;
}

async function fixture(packetId: string): Promise<Candidate[]> {
  const all = await population(); const expected = all.filter((row) => row.packetId === packetId); const source = await packet(packetId);
  return expected.map((row) => {
    const part = source.evidenceCatalog.find((entry) => entry.parentCaseId === row.parentCaseId && entry.ownerPartId === row.partId && PART_SURFACES.has(entry.surface))!;
    const stage = source.evidenceCatalog.find((entry) => entry.parentCaseId === row.parentCaseId && entry.surface === "STAGE")!;
    return { queueIndex: row.queueIndex, packetId: row.packetId, bankPath: row.bankPath, parentCaseId: row.parentCaseId, partId: row.partId, verdict: "REVIEW", testedDecision: `Determine the intended decision for target ${row.queueIndex}.`, requiredStageIds: [], unsafeStageIds: [], partEvidenceIds: [part.evidenceId], stageEvidenceIds: [stage.evidenceId], bilingualRelation: "UNRESOLVED", reason: `The intended stage boundary for target ${row.queueIndex} cannot be recovered unambiguously from this packet.` };
  });
}

async function selfTest(): Promise<void> {
  const all = await population(); const groups = new Map<string, PopulationRow[]>(); for (const row of all) groups.set(row.packetId, [...(groups.get(row.packetId) ?? []), row]);
  const id = [...groups].find(([, rows]) => rows.length >= 3)?.[0];
  assert(id, "self-test needs a packet with at least three targets");
  const source = await packet(id);
  const baseline = await fixture(id); assert((await validate(baseline, id)).length === 0, "valid control fixture failed");
  const clone = () => structuredClone(baseline);
  const cases: Array<[string, (rows: Candidate[]) => void, RegExp]> = [
    ["missing target", (rows) => { rows.pop(); }, /target count|out-of-order/u],
    ["duplicate target", (rows) => { rows[1] = structuredClone(rows[0]); }, /out-of-order|identity/u],
    ["extra target", (rows) => { rows.push(structuredClone(rows.at(-1)!)); }, /target count|extra/u],
    ["out-of-order target", (rows) => { [rows[0], rows[1]] = [rows[1], rows[0]]; }, /out-of-order|identity/u],
    ["wrong identity", (rows) => { rows[0].partId = "wrong"; }, /identity/u],
    ["unknown verdict", (rows) => { rows[0].verdict = "MAYBE"; }, /unknown verdict/u],
    ["unknown bilingual relation", (rows) => { rows[0].bilingualRelation = "SAME"; }, /unknown bilingual/u],
    ["foreign evidence", (rows) => { rows[0].partEvidenceIds = ["foreign"]; }, /foreign evidence/u],
    ["undeclared stage", (rows) => { rows[0].verdict = "LEAK"; rows[0].unsafeStageIds = ["foreign-stage"]; }, /undeclared/u],
    ["LEAK no unsafe", (rows) => { rows[0].verdict = "LEAK"; }, /no unsafe/u],
    ["LEAK no support", (rows) => { rows[0].verdict = "LEAK"; rows[0].unsafeStageIds = [all.find((r) => r.queueIndex === rows[0].queueIndex)!.declaredStageIds[0]]; rows[0].stageEvidenceIds = []; }, /length|lacks/u],
    ["non-LEAK unsafe", (rows) => { rows[0].unsafeStageIds = [all.find((r) => r.queueIndex === rows[0].queueIndex)!.declaredStageIds[0]]; }, /non-LEAK/u],
    ["inadequate REVIEW", (rows) => { rows[0].reason = "Unclear."; }, /inadequate/u],
    ["repeated boilerplate", (rows) => { rows.slice(0, 3).forEach((row) => { row.reason = "The same generic reason repeats across unrelated rows."; }); }, /repeated boilerplate/u],
  ];
  for (const [name, mutate, pattern] of cases) { const rows = clone(); mutate(rows); const errors = await validate(rows, id); assert(errors.some((error) => pattern.test(error)), `${name} not rejected: ${errors.join("; ")}`); }
  const otherPacketId = [...groups.keys()].find((candidateId) => candidateId !== id)!;
  const foreignEntry = (await packet(otherPacketId)).evidenceCatalog[0];
  const crossCaseRows = clone(); crossCaseRows[0].partEvidenceIds = [foreignEntry.evidenceId];
  const injectedCatalog = new Map(source.evidenceCatalog.map((entry) => [entry.evidenceId, entry]));
  injectedCatalog.set(foreignEntry.evidenceId, foreignEntry);
  const crossCaseErrors = await validate(crossCaseRows, id, new Map([[id, injectedCatalog]]));
  assert(crossCaseErrors.some((error) => /cross-case/u.test(error)), `cross-case evidence not rejected: ${crossCaseErrors.join("; ")}`);
  let siblingId: string | undefined; let siblingSource: Packet | undefined; let siblingVictim = -1;
  for (const [candidateId, rows] of groups) {
    const candidatePacket = await packet(candidateId);
    const index = rows.findIndex((row) => candidatePacket.evidenceCatalog.some((entry) =>
      entry.parentCaseId === row.parentCaseId && entry.ownerPartId !== undefined &&
      entry.ownerPartId !== row.partId && PART_SURFACES.has(entry.surface)));
    if (index >= 0) { siblingId = candidateId; siblingSource = candidatePacket; siblingVictim = index; break; }
  }
  assert(siblingId && siblingSource && siblingVictim >= 0, "self-test needs a same-case sibling target");
  const siblingRows = await fixture(siblingId);
  const foreignPart = siblingSource.evidenceCatalog.find((entry) =>
    entry.parentCaseId === siblingRows[siblingVictim].parentCaseId && entry.ownerPartId !== undefined &&
    entry.ownerPartId !== siblingRows[siblingVictim].partId && PART_SURFACES.has(entry.surface))!;
  siblingRows[siblingVictim].partEvidenceIds = [foreignPart.evidenceId];
  const siblingErrors = await validate(siblingRows, siblingId);
  assert(siblingErrors.some((error) => /another part/u.test(error)), `another-part evidence not rejected: ${siblingErrors.join("; ")}`);
  console.log(`candidate validator controls passed: valid 1/1, negative ${cases.length + 2}/${cases.length + 2}`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2); if (args.includes("--self-test")) { await selfTest(); return; }
  const packetIndex = args.indexOf("--packet"); const inputIndex = args.indexOf("--input");
  const packetId = packetIndex >= 0 ? args[packetIndex + 1] : undefined; const input = inputIndex >= 0 ? args[inputIndex + 1] : undefined;
  assert(input, "--input required"); const rows = await jsonl(input); const errors = await validate(rows, packetId);
  if (errors.length) { errors.forEach((error) => console.error(error)); process.exitCode = 1; return; }
  console.log(`candidate output valid: ${rows.length}/${packetId ? (await population()).filter((row) => row.packetId === packetId).length : (await population()).length}`);
}

await main();
