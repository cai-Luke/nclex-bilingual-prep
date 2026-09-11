/**
 * Campaign 16 R4 §C.2 / §G — read-only structural post-repair verifier.
 *
 * Self-test (synthetic in-memory fixtures; no bank reads or writes):
 *   npx tsx audit/campaign-16-anchor-boundary-repair-2026-09-09-r1/tools/verify-boundaries.ts --self-test
 * Future post-repair use, ONLY after both full blind freezes and comparison:
 *   npx tsx audit/campaign-16-anchor-boundary-repair-2026-09-09-r1/tools/verify-boundaries.ts \
 *     --post-repair --commission-root audit/campaign-16-anchor-boundary-repair-2026-09-09-r1
 *
 * Both accepted-boundaries.jsonl and exceptions.jsonl must exist, even when empty.
 * Each record carries rowKey, stage0QueueIndex, bankPath, parentCaseId, partId.
 * Accepted records add disposition BASELINE|STAGE and acceptedBoundary (one exact
 * typed baseline or declared string). Exceptions add disposition EXCEPTION and
 * a nonempty exceptionReason. Additional documentary metadata is ignored.
 *
 * This gate does not determine earliest answerability, certify independent review,
 * grant patch authority, or replace §H's full parsed-object preservation proof.
 * It never reads producer/checker adjudications, generates mappings, or writes files.
 * Its JSON output is stdout only. No established gate/default command is modified.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  classifyCaseBoundary,
  isCaseBaselineBoundary,
  resolveCaseVisibilityBoundary,
} from "../../../src/caseVisibilityBoundary";
import { validateBankObject, supportedSchemaVersions } from "../../../src/schema";
import {
  findStageReferenceFindings,
  type StageReferenceFinding,
} from "../../../scripts/audit/audit-stage-refs";
import type { BankEnvelope, CaseStudyQuestion, CaseSubQuestion, SchemaVersion } from "../../../src/types";

const TOOL_PATH = fileURLToPath(import.meta.url);
const COMMISSION_ROOT = resolve(dirname(TOOL_PATH), "..");
const REPO = resolve(COMMISSION_ROOT, "../..");
const INVENTORY_PATH = "audit/campaign-16-phase-e-anchor-omission-inventory-2026-09-08-r1/frozen-inventory.jsonl";
const INVENTORY_SHA256 = "9f66750caaeead9d374742588856e2630a7fce09415bb7c2c662669a2af93e8e";
const WORK_ORDER_PATH = "scratch/CAMPAIGN-16-PHASE-E-451-BOUNDARY-REPAIR-WORK-ORDER-2026-09-09-R4.md";
const WORK_ORDER_SHA256 = "8cd476c23f2b6cadb07ae8115fd675fbbfc3f60acb46d7a521d5d1da30b2558b";
const EXPECTED = { rows: 451, parents: 93, banks: 13, packets: 27 };
const hasOwn = (object: object, key: string): boolean => Object.prototype.hasOwnProperty.call(object, key);
const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const nonempty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const digest = (value: string | Buffer): string => createHash("sha256").update(value).digest("hex");
const identical = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

export type FrozenRow = {
  rowKey: string;
  stage0QueueIndex: number;
  bankPath: string;
  parentCaseId: string;
  partId: string;
  declaredStageIds: string[];
  repairPacketId?: string;
};
type IdentityRecord = Pick<FrozenRow, "rowKey" | "stage0QueueIndex" | "bankPath" | "parentCaseId" | "partId">;
type Boundary = NonNullable<CaseSubQuestion["answerableAfterStageId"]>;
type AcceptedRecord = IdentityRecord & { disposition: "BASELINE" | "STAGE"; acceptedBoundary: Boundary };
type RowState = "REPAIRED_BASELINE" | "REPAIRED_STAGE" | "EXCEPTION_UNCHANGED";
type BankInput = { file: string; bank: unknown };
type VerifiedRow = IdentityRecord & { state: RowState };
const identity = (row: Pick<FrozenRow, "bankPath" | "parentCaseId" | "partId">): string =>
  JSON.stringify([row.bankPath, row.parentCaseId, row.partId]);
const parentIdentity = (row: FrozenRow): string => JSON.stringify([row.bankPath, row.parentCaseId]);
const identityFields = ["rowKey", "stage0QueueIndex", "bankPath", "parentCaseId", "partId"] as const;
const identityRecord = (row: FrozenRow): IdentityRecord => ({
  rowKey: row.rowKey, stage0QueueIndex: row.stage0QueueIndex, bankPath: row.bankPath,
  parentCaseId: row.parentCaseId, partId: row.partId,
});

function inventoryFailures(rows: FrozenRow[], expected: { rows: number; parents: number }): string[] {
  const failures: string[] = [];
  if (rows.length !== expected.rows) failures.push(`POPULATION_ROWS: expected ${expected.rows}, got ${rows.length}`);
  const parents = new Set(rows.map(parentIdentity));
  if (parents.size !== expected.parents) failures.push(`POPULATION_PARENTS: expected ${expected.parents}, got ${parents.size}`);
  for (const field of ["rowKey", "stage0QueueIndex"] as const) {
    if (new Set(rows.map(r => r[field])).size !== rows.length) failures.push(`DUPLICATE_INVENTORY_${field}`);
  }
  if (new Set(rows.map(identity)).size !== rows.length) failures.push("DUPLICATE_INVENTORY_IDENTITY");
  const stageLists = new Map<string, string>();
  for (const row of rows) {
    if (![row.rowKey, row.bankPath, row.parentCaseId, row.partId].every(nonempty) || !Number.isInteger(row.stage0QueueIndex)) {
      failures.push(`MALFORMED_INVENTORY_IDENTITY: ${row.rowKey}`);
    }
    if (!Array.isArray(row.declaredStageIds) || row.declaredStageIds.length === 0 ||
      !row.declaredStageIds.every(nonempty) || new Set(row.declaredStageIds).size !== row.declaredStageIds.length) {
      failures.push(`MALFORMED_INVENTORY_STAGES: ${row.rowKey}`);
    }
    const key = parentIdentity(row);
    const list = JSON.stringify(row.declaredStageIds);
    if (stageLists.has(key) && stageLists.get(key) !== list) failures.push(`INCONSISTENT_FROZEN_STAGES: ${row.rowKey}`);
    stageLists.set(key, list);
  }
  return failures;
}

function readPartition(rows: FrozenRow[], accepted: unknown[], exceptions: unknown[]) {
  const failures: string[] = [];
  const frozenByKey = new Map(rows.map(row => [row.rowKey, row]));
  const seen = new Set<string>();
  const acceptedByKey = new Map<string, AcceptedRecord>();
  const exceptionKeys = new Set<string>();
  for (const [kind, entries] of [["accepted", accepted], ["exception", exceptions]] as const) {
    for (const [index, entry] of entries.entries()) {
      if (!record(entry) || !nonempty(entry.rowKey)) {
        failures.push(`MALFORMED_${kind.toUpperCase()}_RECORD: line ${index + 1}`); continue;
      }
      const row = frozenByKey.get(entry.rowKey);
      if (!row) { failures.push(`UNRECOGNIZED_${kind.toUpperCase()}_ROW: ${entry.rowKey}`); continue; }
      if (seen.has(row.rowKey)) { failures.push(`DUPLICATE_OR_OVERLAPPING_PARTITION_ROW: ${row.rowKey}`); continue; }
      seen.add(row.rowKey);
      if (identityFields.some(field => entry[field] !== row[field])) {
        failures.push(`PARTITION_IDENTITY_MISMATCH: ${row.rowKey}`); continue;
      }
      if (kind === "exception") {
        if (entry.disposition !== "EXCEPTION" || !nonempty(entry.exceptionReason) || hasOwn(entry, "acceptedBoundary")) {
          failures.push(`MALFORMED_EXCEPTION_DISPOSITION: ${row.rowKey}`); continue;
        }
        exceptionKeys.add(row.rowKey);
      } else {
        const classification = classifyCaseBoundary(entry.acceptedBoundary, row.declaredStageIds);
        const baseline = isCaseBaselineBoundary(entry.acceptedBoundary) && entry.disposition === "BASELINE";
        const stage = nonempty(entry.acceptedBoundary) && classification.kind === "resolving-string" && entry.disposition === "STAGE";
        if (!baseline && !stage) { failures.push(`INVALID_ACCEPTED_BOUNDARY: ${row.rowKey}`); continue; }
        acceptedByKey.set(row.rowKey, entry as AcceptedRecord);
      }
    }
  }
  for (const row of rows) {
    if (!acceptedByKey.has(row.rowKey) && !exceptionKeys.has(row.rowKey)) failures.push(`MISSING_VALID_PARTITION_ROW: ${row.rowKey}`);
  }
  return { failures, acceptedByKey, exceptionKeys };
}

/** Reconcile the live collector independently with directly verified row states. */
function populationFailures(rows: FrozenRow[], proven: VerifiedRow[], findings: StageReferenceFinding[]): string[] {
  const failures: string[] = [];
  const frozenIdentities = new Set(rows.map(identity));
  const leakCounts = new Map<string, number>();
  for (const finding of findings.filter(f => f.kind === "revealsAllStages")) {
    const key = identity({ bankPath: finding.file, parentCaseId: finding.parentId, partId: finding.partId });
    leakCounts.set(key, (leakCounts.get(key) ?? 0) + 1);
    if (!frozenIdentities.has(key)) failures.push(`NEW_LEAK_OUTSIDE_FROZEN: ${key}`);
  }
  for (const [key, count] of leakCounts) if (count !== 1) failures.push(`DUPLICATE_AUDIT_LEAK: ${key}`);
  for (const row of proven) {
    const leaks = leakCounts.get(identity(row)) ?? 0;
    if (row.state === "EXCEPTION_UNCHANGED" && leaks !== 1) failures.push(`EXCEPTION_NOT_AUDIT_LEAK: ${row.rowKey}`);
    if (row.state !== "EXCEPTION_UNCHANGED" && leaks !== 0) failures.push(`REPAIRED_ROW_REMAINS_AUDIT_LEAK: ${row.rowKey}`);
  }
  return failures;
}

/** Pure in-memory verifier; every bank is validated by the live strict validator. */
export function verifyStructuralClosure(input: {
  inventory: FrozenRow[]; banks: BankInput[]; accepted: unknown[]; exceptions: unknown[];
  expected: { rows: number; parents: number };
}) {
  const { inventory, banks, accepted, exceptions, expected } = input;
  const failures = inventoryFailures(inventory, expected);
  const partition = readPartition(inventory, accepted, exceptions);
  failures.push(...partition.failures);
  const validBanks: Array<{ file: string; bank: BankEnvelope }> = [];
  const bankNames = new Set<string>();
  for (const loaded of banks) {
    if (bankNames.has(loaded.file)) { failures.push(`DUPLICATE_BANK: ${loaded.file}`); continue; }
    bankNames.add(loaded.file);
    const validated = validateBankObject(loaded.bank, { requireMeta: true, rejectUnknownKeys: true });
    if (!validated.ok) { failures.push(`BANK_SCHEMA_INVALID: ${loaded.file}: ${validated.reasons.join("; ")}`); continue; }
    validBanks.push({ file: loaded.file, bank: validated.value });
  }
  const proven: VerifiedRow[] = [];
  for (const row of inventory) {
    const before = failures.length;
    const bank = validBanks.find(b => b.file === row.bankPath);
    if (!bank) { failures.push(`BANK_NOT_VALIDATED: ${row.rowKey}`); continue; }
    const parents = bank.bank.questions.filter(q => q.id === row.parentCaseId);
    if (parents.length !== 1 || parents[0].itemType !== "case_study") {
      failures.push(`PARENT_NOT_EXACTLY_ONE_CASE: ${row.rowKey} (matches ${parents.length})`); continue;
    }
    const parent = parents[0];
    const parts = parent.caseStudy.questions.filter(p => p.id === row.partId);
    if (parts.length !== 1) { failures.push(`PART_NOT_EXACTLY_ONE: ${row.rowKey} (matches ${parts.length})`); continue; }
    const part = parts[0];
    const stageIds = (parent.caseStudy.stages ?? []).map(s => s.id);
    if (!identical(stageIds, row.declaredStageIds)) failures.push(`DECLARED_STAGE_LIST_DRIFT: ${row.rowKey}`);
    if (hasOwn(part, "stageId")) failures.push(`LEGACY_FIELD_NOT_ABSENT: ${row.rowKey}`);
    const resolution = resolveCaseVisibilityBoundary(part, stageIds);
    let state: RowState | undefined;
    if (partition.exceptionKeys.has(row.rowKey)) {
      if (hasOwn(part, "answerableAfterStageId") || hasOwn(part, "stageId")) failures.push(`EXCEPTION_NOT_PURE_OMISSION: ${row.rowKey}`);
      if (resolution.kind !== "fail-open") failures.push(`EXCEPTION_NOT_FAIL_OPEN: ${row.rowKey}`);
      state = "EXCEPTION_UNCHANGED";
    } else {
      const agreement = partition.acceptedByKey.get(row.rowKey);
      if (!agreement) continue;
      if (!identical(part.answerableAfterStageId, agreement.acceptedBoundary)) failures.push(`ACTUAL_ACCEPTED_BOUNDARY_MISMATCH: ${row.rowKey}`);
      const classification = classifyCaseBoundary(part.answerableAfterStageId, stageIds);
      if (isCaseBaselineBoundary(part.answerableAfterStageId)) {
        if (resolution.kind !== "baseline") failures.push(`BASELINE_RESOLUTION_MISMATCH: ${row.rowKey}`);
        state = "REPAIRED_BASELINE";
      } else if (nonempty(part.answerableAfterStageId) && classification.kind === "resolving-string") {
        if (resolution.kind !== "prefix" || resolution.field !== "answerableAfterStageId" || resolution.index !== classification.index) {
          failures.push(`PRIMARY_PREFIX_RESOLUTION_MISMATCH: ${row.rowKey}`);
        }
        state = "REPAIRED_STAGE";
      } else failures.push(`PRIMARY_NOT_REPAIRED: ${row.rowKey}`);
    }
    if (failures.length === before && state) proven.push({ ...identityRecord(row), state });
  }
  const findings = findStageReferenceFindings(validBanks, { strict: true });
  failures.push(...populationFailures(inventory, proven, findings));
  const repairedBaseline = proven.filter(r => r.state === "REPAIRED_BASELINE").length;
  const repairedStage = proven.filter(r => r.state === "REPAIRED_STAGE").length;
  const exceptionCount = proven.filter(r => r.state === "EXCEPTION_UNCHANGED").length;
  const reconciled = repairedBaseline + repairedStage + exceptionCount;
  if (reconciled !== expected.rows) failures.push(`ACCOUNTING_NOT_CLOSED: ${reconciled}/${expected.rows}`);
  return {
    ok: failures.length === 0, failures,
    accounting: { total: expected.rows, repairedBaseline, repairedStage, exceptions: exceptionCount, reconciled },
    equation: `${expected.rows} = ${repairedBaseline} + ${repairedStage} + ${exceptionCount}`,
    closure: failures.length ? "FAILED" : exceptionCount ? "REPAIRED_SUBSET_ONLY" : "ALL_FROZEN_ROWS",
    remainingLeaks: findings.filter(f => f.kind === "revealsAllStages").length,
    strictOnlyMissingRequiredAnchor: findings.filter(f => f.kind === "missingRequiredAnchor").length,
    unresolvedFindings: findings.filter(f => f.kind === "unresolved").length,
    rows: proven,
    limitation: "Structural §G only. Exception status proves anchor omission and audit leakage, not whole-part deep equality. Independent semantic acceptance and §H preservation remain separate mandatory gates.",
  };
}

function readJson(path: string): unknown { return JSON.parse(readFileSync(path, "utf8")); }
function readJsonl(path: string): unknown[] {
  // readFileSync deliberately fails on absent files: empty artifacts must be explicit.
  return readFileSync(path, "utf8").split(/\r?\n/).filter(line => line.trim()).map((line, index) => {
    try { return JSON.parse(line); } catch { throw new Error(`INVALID_JSONL: ${path} line ${index + 1}`); }
  });
}
function requireRecord(value: unknown, label: string): Record<string, unknown> {
  assert(record(value), `${label} must be a JSON object`); return value;
}

function postRepair(root: string) {
  assert.equal(resolve(REPO, root), COMMISSION_ROOT, "--commission-root must identify this verifier's own R4 commission");
  const manifest = requireRecord(readJson(join(COMMISSION_ROOT, "commission-manifest.json")), "manifest");
  const opening = requireRecord(readJson(join(COMMISSION_ROOT, "opening-state.json")), "opening state");
  assert.equal(manifest.commissionRoot, relative(REPO, COMMISSION_ROOT));
  assert.equal(manifest.workOrderPath, WORK_ORDER_PATH);
  assert.equal(manifest.workOrderSha256, WORK_ORDER_SHA256);
  assert.equal(digest(readFileSync(join(REPO, WORK_ORDER_PATH))), WORK_ORDER_SHA256, "work-order hash drift");
  assert.equal(manifest.inventoryPath, INVENTORY_PATH);
  assert.equal(manifest.inventorySha256, INVENTORY_SHA256);
  assert.equal(digest(readFileSync(join(REPO, INVENTORY_PATH))), INVENTORY_SHA256, "frozen inventory hash drift");
  assert.deepEqual(manifest.banks, opening.banks, "opening/manifest bank fingerprint disagreement");
  assert.equal(manifest.head, opening.head, "opening/manifest HEAD disagreement");
  const inventory = readJsonl(join(REPO, INVENTORY_PATH)) as FrozenRow[];
  assert.deepEqual(inventoryFailures(inventory, EXPECTED), [], "frozen population invalid");
  const packets = manifest.packets;
  assert(Array.isArray(packets) && packets.length === EXPECTED.packets, "manifest must declare 27 packets");
  const packetRows = new Set<string>();
  const packetIds = new Set<string>();
  for (const rawPacket of packets) {
    const packet = requireRecord(rawPacket, "packet");
    assert(nonempty(packet.repairPacketId) && !packetIds.has(packet.repairPacketId), "duplicate/malformed packet id");
    packetIds.add(packet.repairPacketId);
    const expectedRows = inventory.filter(r => r.repairPacketId === packet.repairPacketId);
    assert.deepEqual(packet.rowKeys, expectedRows.map(r => r.rowKey), "manifest packet row order/content drift");
    assert.equal(packet.rowCount, expectedRows.length);
    assert(expectedRows.length >= 6 && expectedRows.length <= 20, "packet count outside frozen bounds");
    assert(expectedRows.every(r => r.bankPath === packet.bankPath), "packet is not bank-pure");
    assert.deepEqual(packet.parentCaseIds, [...new Set(expectedRows.map(r => r.parentCaseId))]);
    assert.equal(packet.producer, "Codex / GPT-6 Astra");
    assert.equal(packet.checker, "Claude Code / Claude Opus 5");
    for (const row of expectedRows) { assert(!packetRows.has(row.rowKey)); packetRows.add(row.rowKey); }
  }
  assert.equal(packetRows.size, EXPECTED.rows);
  const bankPins = requireRecord(manifest.banks, "manifest banks");
  const paths = readdirSync(join(REPO, "banks")).filter(p => p.endsWith(".json")).sort().map(p => `banks/${p}`);
  assert.equal(paths.length, EXPECTED.banks, "bundled bank count drift");
  assert.deepEqual(paths, Object.keys(bankPins).sort(), "bundled bank path set drift");
  const affected = new Set(inventory.map(r => r.bankPath));
  const bankDigests: Record<string, { openingSha256: string; sha256: string; affected: boolean }> = {};
  const banks = paths.map(file => {
    const text = readFileSync(join(REPO, file), "utf8");
    const pin = requireRecord(bankPins[file], file);
    assert(typeof pin.sha256 === "string" && /^[a-f0-9]{64}$/.test(pin.sha256));
    const sha256 = digest(text);
    if (!affected.has(file)) assert.equal(sha256, pin.sha256, `unaffected bank fingerprint drift: ${file}`);
    bankDigests[file] = { openingSha256: pin.sha256, sha256, affected: affected.has(file) };
    return { file, bank: JSON.parse(text) };
  });
  const acceptedPath = join(COMMISSION_ROOT, "accepted-boundaries.jsonl");
  const exceptionsPath = join(COMMISSION_ROOT, "exceptions.jsonl");
  const accepted = readJsonl(acceptedPath);
  const exceptions = readJsonl(exceptionsPath);
  const result = verifyStructuralClosure({ inventory, banks, accepted, exceptions, expected: EXPECTED });
  return {
    mode: "POST_REPAIR_STRUCTURAL_G", commissionRoot: relative(REPO, COMMISSION_ROOT),
    workOrderSha256: WORK_ORDER_SHA256, openingHead: manifest.head,
    hashes: { tool: digest(readFileSync(TOOL_PATH)), inventory: INVENTORY_SHA256,
      manifest: digest(readFileSync(join(COMMISSION_ROOT, "commission-manifest.json"))),
      acceptedBoundaries: digest(readFileSync(acceptedPath)), exceptions: digest(readFileSync(exceptionsPath)),
      sharedBoundary: digest(readFileSync(join(REPO, "src/caseVisibilityBoundary.ts"))),
      schema: digest(readFileSync(join(REPO, "src/schema.ts"))),
      stageReferenceAudit: digest(readFileSync(join(REPO, "scripts/audit/audit-stage-refs.ts"))) },
    bankDigests, ...result,
  };
}

// Fixture-only data; contains no copied clinical material or real frozen identity.
function fixture() {
  const text = { en: "Synthetic fixture.", zh: "合成测试。" };
  const parts: CaseSubQuestion[] = ["p1", "p2", "p3"].map(id => ({
    id, itemType: "fill_in_blank", category: "Management of Care", topic: "fixture", difficulty: "medium",
    stem: text, blanks: [{ id: "b1", prompt: text, acceptable: ["fixture"] }],
    rationale: { correct: text }, testTakingStrategy: text, glossary: [],
  }));
  parts[0].answerableAfterStageId = { kind: "baseline" };
  parts[1].answerableAfterStageId = "s2";
  const parent: CaseStudyQuestion = {
    id: "synthetic_case", itemType: "case_study", category: "Management of Care", topic: "fixture", difficulty: "medium",
    stem: text, rationale: { correct: text }, testTakingStrategy: text, glossary: [],
    caseStudy: { title: text, summary: text, exhibits: [{ id: "global", title: text, content: text }],
      stages: ["s1", "s2", "s3"].map(id => ({ id, title: text, exhibits: [{ id: `${id}_exhibit`, title: text, content: text }] })),
      questions: parts },
  };
  const bank: BankEnvelope = { meta: { schemaVersion: "2.1", count: 1 }, questions: [parent] };
  const inventory: FrozenRow[] = parts.map((part, index) => ({ rowKey: `synthetic_row_${index + 1}`, stage0QueueIndex: index + 1,
    bankPath: "banks/fixture.json", parentCaseId: parent.id, partId: part.id, declaredStageIds: ["s1", "s2", "s3"] }));
  const accepted: unknown[] = [
    { ...identityRecord(inventory[0]), disposition: "BASELINE", acceptedBoundary: { kind: "baseline" } },
    { ...identityRecord(inventory[1]), disposition: "STAGE", acceptedBoundary: "s2" },
  ];
  const exceptions: unknown[] = [{ ...identityRecord(inventory[2]), disposition: "EXCEPTION", exceptionReason: "Synthetic unresolved semantic question." }];
  return { inventory, banks: [{ file: "banks/fixture.json", bank }], accepted, exceptions, expected: { rows: 3, parents: 1 } };
}
type Fixture = ReturnType<typeof fixture>;
const fixtureParent = (f: Fixture): CaseStudyQuestion => f.banks[0].bank.questions[0] as CaseStudyQuestion;

export function selfTest() {
  const tests: Array<{ name: string; status: "PASS" }> = [];
  const test = (name: string, run: () => void) => { run(); tests.push({ name, status: "PASS" }); };
  const negative = (name: string, mutate: (f: Fixture) => void, expectedCode: string) => test(name, () => {
    const f = fixture(); mutate(f); const result = verifyStructuralClosure(f);
    assert.equal(result.ok, false, name);
    assert(result.failures.some(reason => reason.includes(expectedCode)), `${name}: ${result.failures.join(" | ")}`);
  });
  test("positive: exact baseline + resolving primary + unchanged exception and subset-only claim", () => {
    const result = verifyStructuralClosure(fixture()); assert(result.ok, result.failures.join(" | "));
    assert.deepEqual(result.accounting, { total: 3, repairedBaseline: 1, repairedStage: 1, exceptions: 1, reconciled: 3 });
    assert.equal(result.closure, "REPAIRED_SUBSET_ONLY"); assert.equal(result.remainingLeaks, 1);
  });
  test("positive: every row repaired; exact accounting and no leaks", () => {
    const f = fixture(); fixtureParent(f).caseStudy.questions[2].answerableAfterStageId = "s1";
    f.accepted.push({ ...identityRecord(f.inventory[2]), disposition: "STAGE", acceptedBoundary: "s1" }); f.exceptions = [];
    const result = verifyStructuralClosure(f); assert(result.ok, result.failures.join(" | "));
    assert.equal(result.closure, "ALL_FROZEN_ROWS"); assert.equal(result.remainingLeaks, 0);
  });
  test("positive: ordinary string baseline is a stage only when declared", () => {
    const f = fixture(); fixtureParent(f).caseStudy.stages![1].id = "baseline";
    for (const row of f.inventory) row.declaredStageIds[1] = "baseline";
    fixtureParent(f).caseStudy.questions[1].answerableAfterStageId = "baseline";
    (f.accepted[1] as AcceptedRecord).acceptedBoundary = "baseline";
    const result = verifyStructuralClosure(f); assert(result.ok, result.failures.join(" | ")); assert.equal(result.accounting.repairedStage, 1);
  });
  test("positive: all exceptions reconciled without claiming any repaired row", () => {
    const f = fixture(); for (const part of fixtureParent(f).caseStudy.questions) delete part.answerableAfterStageId;
    f.accepted = []; f.exceptions = f.inventory.map(row => ({ ...identityRecord(row), disposition: "EXCEPTION", exceptionReason: "Synthetic." }));
    const result = verifyStructuralClosure(f); assert(result.ok, result.failures.join(" | "));
    assert.equal(result.accounting.repairedBaseline + result.accounting.repairedStage, 0); assert.equal(result.closure, "REPAIRED_SUBSET_ONLY");
  });
  for (const value of [null, [], {}, { kind: "Baseline" }, { kind: "baseline", extra: true }, { kind: { kind: "baseline" } }, true, 1, ""]) {
    negative(`negative: malformed primary ${JSON.stringify(value)}`, f => Object.assign(fixtureParent(f).caseStudy.questions[0], { answerableAfterStageId: value }), "BANK_SCHEMA_INVALID");
    negative(`negative: malformed accepted ${JSON.stringify(value)}`, f => Object.assign(f.accepted[0] as object, { acceptedBoundary: value }), "INVALID_ACCEPTED_BOUNDARY");
  }
  for (const value of ["missing", "baseline", "@@case-baseline", "admission"]) {
    negative(`negative: unresolved opaque primary ${value}`, f => fixtureParent(f).caseStudy.questions[0].answerableAfterStageId = value, "PRIMARY_NOT_REPAIRED");
  }
  for (const version of supportedSchemaVersions.filter(v => v !== "2.1")) {
    test(`negative: live validator rejects baseline below floor ${version}`, () => {
      const f = fixture(); f.banks[0].bank.meta!.schemaVersion = version;
      const result = verifyStructuralClosure(f); assert(!result.ok);
      assert(result.failures.some(r => r.includes("typed baseline boundary requires meta.schemaVersion 2.1")));
    });
  }
  negative("negative: missing bank envelope cannot bypass schema floor", f => delete f.banks[0].bank.meta, "BANK_SCHEMA_INVALID");
  negative("negative: legacy-only repair rejected", f => { const p = fixtureParent(f).caseStudy.questions[1]; delete p.answerableAfterStageId; p.stageId = "s2"; }, "LEGACY_FIELD_NOT_ABSENT");
  negative("negative: legacy field forbidden even beside exact baseline", f => fixtureParent(f).caseStudy.questions[0].stageId = "s1", "LEGACY_FIELD_NOT_ABSENT");
  negative("negative: resolving wrong accepted stage", f => fixtureParent(f).caseStudy.questions[1].answerableAfterStageId = "s3", "ACTUAL_ACCEPTED_BOUNDARY_MISMATCH");
  negative("negative: stage substituted for agreed baseline", f => fixtureParent(f).caseStudy.questions[0].answerableAfterStageId = "s1", "ACTUAL_ACCEPTED_BOUNDARY_MISMATCH");
  negative("negative: primary omission never counted as repair", f => delete fixtureParent(f).caseStudy.questions[0].answerableAfterStageId, "PRIMARY_NOT_REPAIRED");
  negative("negative: exception with primary changed", f => fixtureParent(f).caseStudy.questions[2].answerableAfterStageId = "s1", "EXCEPTION_NOT_PURE_OMISSION");
  negative("negative: exception with own undefined field is not absent", f => Object.assign(fixtureParent(f).caseStudy.questions[2], { answerableAfterStageId: undefined }), "EXCEPTION_NOT_PURE_OMISSION");
  negative("negative: stage order drift", f => fixtureParent(f).caseStudy.stages!.reverse(), "DECLARED_STAGE_LIST_DRIFT");
  negative("negative: stage id drift", f => fixtureParent(f).caseStudy.stages![0].id = "renamed", "DECLARED_STAGE_LIST_DRIFT");
  negative("negative: declared stages removed", f => delete fixtureParent(f).caseStudy.stages, "DECLARED_STAGE_LIST_DRIFT");
  negative("negative: missing parent", f => fixtureParent(f).id = "renamed_parent", "PARENT_NOT_EXACTLY_ONE_CASE");
  negative("negative: duplicate parent", f => { f.banks[0].bank.questions.push(structuredClone(fixtureParent(f))); f.banks[0].bank.meta!.count = 2; }, "BANK_SCHEMA_INVALID");
  negative("negative: missing part", f => fixtureParent(f).caseStudy.questions[0].id = "renamed_part", "PART_NOT_EXACTLY_ONE");
  negative("negative: duplicate part", f => fixtureParent(f).caseStudy.questions[1].id = "p1", "BANK_SCHEMA_INVALID");
  negative("negative: duplicate bank", f => f.banks.push(structuredClone(f.banks[0])), "DUPLICATE_BANK");
  negative("negative: duplicate frozen identity", f => f.inventory[1] = structuredClone(f.inventory[0]), "DUPLICATE_INVENTORY_IDENTITY");
  negative("negative: frozen row count drift", f => f.inventory.pop(), "POPULATION_ROWS");
  negative("negative: frozen parent count drift", f => f.expected.parents = 2, "POPULATION_PARENTS");
  negative("negative: unrecognized exception", f => Object.assign(f.exceptions[0] as object, { rowKey: "not_frozen" }), "UNRECOGNIZED_EXCEPTION_ROW");
  negative("negative: duplicate exception", f => f.exceptions.push(structuredClone(f.exceptions[0])), "DUPLICATE_OR_OVERLAPPING_PARTITION_ROW");
  negative("negative: empty exception reason", f => Object.assign(f.exceptions[0] as object, { exceptionReason: "" }), "MALFORMED_EXCEPTION_DISPOSITION");
  negative("negative: exception identity disagreement", f => Object.assign(f.exceptions[0] as object, { partId: "different" }), "PARTITION_IDENTITY_MISMATCH");
  negative("negative: missing exception partition row", f => f.exceptions = [], "MISSING_VALID_PARTITION_ROW");
  negative("negative: missing accepted partition row", f => f.accepted.pop(), "MISSING_VALID_PARTITION_ROW");
  negative("negative: duplicate accepted row", f => f.accepted.push(structuredClone(f.accepted[0])), "DUPLICATE_OR_OVERLAPPING_PARTITION_ROW");
  negative("negative: accepted exception overlap", f => f.exceptions.push({ ...identityRecord(f.inventory[0]), disposition: "EXCEPTION", exceptionReason: "Synthetic." }), "DUPLICATE_OR_OVERLAPPING_PARTITION_ROW");
  negative("negative: non-object exception", f => f.exceptions = [null], "MALFORMED_EXCEPTION_RECORD");
  negative("negative: accepted disposition/value disagreement", f => Object.assign(f.accepted[0] as object, { disposition: "STAGE" }), "INVALID_ACCEPTED_BOUNDARY");
  negative("negative: new leak outside frozen population", f => { const p = structuredClone(fixtureParent(f).caseStudy.questions[2]); p.id = "outside"; fixtureParent(f).caseStudy.questions.push(p); }, "NEW_LEAK_OUTSIDE_FROZEN");
  test("negative: collector contradiction repaired row remains leak", () => {
    const f = fixture(); const result = verifyStructuralClosure(f); assert(result.ok);
    const leak: StageReferenceFinding = { kind: "revealsAllStages", file: "banks/fixture.json", parentId: "synthetic_case", partId: "p1",
      anchorState: { answerableAfterStageId: { status: "absent" }, stageId: { status: "absent" } }, validStageIds: ["s1", "s2", "s3"] };
    assert(populationFailures(f.inventory, result.rows, [leak]).some(r => r.includes("REPAIRED_ROW_REMAINS_AUDIT_LEAK")));
  });
  test("negative: exception must remain collector-visible", () => {
    const f = fixture(); const result = verifyStructuralClosure(f); assert(result.ok);
    assert(populationFailures(f.inventory, result.rows, []).some(r => r.includes("EXCEPTION_NOT_AUDIT_LEAK")));
  });
  return { mode: "SYNTHETIC_IN_MEMORY_SELF_TEST", ok: true, count: tests.length, tests,
    scope: "No canonical-bank reads/writes, no real row adjudications, no accepted mappings, no independent-review claim." };
}

function main(args: string[]) {
  if (args.length === 1 && args[0] === "--self-test") return selfTest();
  if (args.length === 3 && args[0] === "--post-repair" && args[1] === "--commission-root" && nonempty(args[2])) return postRepair(args[2]);
  throw new Error("Explicit mode required: --self-test OR --post-repair --commission-root <this R4 root>. Post-repair requires both accepted-boundaries.jsonl and exceptions.jsonl. No implicit/default repair or exception mode exists.");
}
if (process.argv[1] && resolve(process.argv[1]) === TOOL_PATH) {
  try { const result = main(process.argv.slice(2)); console.log(JSON.stringify(result, null, 2)); if (!result.ok) process.exitCode = 1; }
  catch (error) { console.log(JSON.stringify({ ok: false, status: "FAIL_CLOSED", error: error instanceof Error ? error.message : String(error) }, null, 2)); process.exitCode = 1; }
}
