import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { isCaseBaselineBoundary, classifyCaseBoundary, resolveCaseVisibilityBoundary, formatCaseVisibilityBoundary } from "../../src/caseVisibilityBoundary";
import { getVisibleCaseStages } from "../../src/examLayout";
import { supportedSchemaVersions, validateBankObject, validateQuestion } from "../../src/schema";
import { importQuestionsFromText, parseBankText, toExportEnvelope } from "../../src/bankImport";
import { getInitialAnswer } from "../../src/grading";
import { buildQuestionRescuePromptText } from "../../src/reviewPrompt";
import { findStageReferenceFindings } from "../audit/audit-stage-refs";
import { runRawGate, renderRawGate } from "../raw-gate";
import { consolidateInto } from "../consolidate";
import { shuffle } from "../../lib/shuffle";
import { normalizeRawBankStructure } from "../../lib/raw-bank-normalization";
import { normalizeBankPresentations, serializeBank } from "../../lib/presentation-normalization";
import { prepareRawPromotionPreview } from "../../lib/raw-promotion-preview";
import type { CaseSubQuestion, BankEnvelope } from "../../src/types";
import { typedBaselineCase, typedBaselineBank, baselinePart } from "./typed-baseline-fixture";

const stages = ["s1", "s2", "s3"];
const truthTable = [
  { name: "no active part", part: undefined, stages, kind: "no-part", visible: [] },
  { name: "no declared stages", part: { answerableAfterStageId: { kind: "baseline" } }, stages: [], kind: "no-stages", visible: [] },
  { name: "typed baseline wins over legacy", part: { answerableAfterStageId: { kind: "baseline" }, stageId: "s3" }, stages, kind: "baseline", visible: [] },
  { name: "resolving primary", part: { answerableAfterStageId: "s2", stageId: "s3" }, stages, kind: "prefix", visible: ["s1", "s2"] },
  { name: "unresolved primary legacy fallback", part: { answerableAfterStageId: "stale", stageId: "s2" }, stages, kind: "prefix", visible: ["s1", "s2"] },
  { name: "absent primary legacy fallback", part: { stageId: "s1" }, stages, kind: "prefix", visible: ["s1"] },
  { name: "both unresolved", part: { answerableAfterStageId: "stale", stageId: "bad" }, stages, kind: "fail-open", visible: stages },
  { name: "both absent", part: {}, stages, kind: "fail-open", visible: stages },
  { name: "malformed primary legacy fallback", part: { answerableAfterStageId: { kind: "baseline", extra: true }, stageId: "s2" }, stages, kind: "prefix", visible: ["s1", "s2"] },
  { name: "malformed primary bad legacy", part: { answerableAfterStageId: {}, stageId: "bad" }, stages, kind: "fail-open", visible: stages },
  { name: "malformed primary absent legacy", part: { answerableAfterStageId: {} }, stages, kind: "fail-open", visible: stages },
  ...["baseline", "@@case-baseline", "admission"].map(value => ({ name: `opaque ${value}`, part: { answerableAfterStageId: value }, stages, kind: "fail-open", visible: stages })),
  { name: "declared baseline string", part: { answerableAfterStageId: "baseline" }, stages: ["s1", "baseline", "s3"], kind: "prefix", visible: ["s1", "baseline"] },
];
for (const row of truthTable) {
  assert.equal(resolveCaseVisibilityBoundary(row.part, row.stages).kind, row.kind, row.name);
  const fixture = typedBaselineCase();
  fixture.caseStudy.stages = row.stages.map(id => ({ id, title: { en: id, zh: id }, exhibits: [] }));
  assert.deepEqual(getVisibleCaseStages(fixture, row.part as CaseSubQuestion | undefined).map(s => s.id), row.visible, row.name);
}
assert.equal(classifyCaseBoundary(undefined, stages).kind, "absent");
assert.equal(classifyCaseBoundary({ kind: "baseline" }, stages).kind, "baseline");
assert.equal(classifyCaseBoundary("s2", stages).kind, "resolving-string");
assert.equal(classifyCaseBoundary("missing", stages).kind, "unresolved-string");
assert.equal(classifyCaseBoundary({}, stages).kind, "malformed");
assert.equal(classifyCaseBoundary({ kind: "baseline" }, stages, false).kind, "malformed");
const malformed = [null, [], ["baseline"], {}, { kind: "Baseline" }, { kind: "admission" }, { kind: "baseline", extra: true }, { kind: { kind: "baseline" } }, 1, true];
for (const value of malformed) {
  assert.equal(isCaseBaselineBoundary(value), false);
  const fixture = typedBaselineCase();
  Object.assign(fixture.caseStudy.questions[0], { answerableAfterStageId: value });
  assert.equal(validateQuestion(fixture).ok, false, JSON.stringify(value));
  for (const rejectUnknownKeys of [false, true]) assert.equal(validateBankObject({ meta: { schemaVersion: "2.1", count: 1 }, questions: [fixture] }, { rejectUnknownKeys }).ok, false);
  assert.equal(resolveCaseVisibilityBoundary({ answerableAfterStageId: value, stageId: "s2" }, stages).kind, "prefix");
  assert.equal(resolveCaseVisibilityBoundary({ answerableAfterStageId: value }, stages).kind, "fail-open");
}
assert.equal(isCaseBaselineBoundary(Object.create({ kind: "baseline" })), false);
assert.equal(isCaseBaselineBoundary(Object.defineProperty({}, "kind", { value: "baseline", enumerable: false })), false);
assert.equal(validateQuestion(typedBaselineCase()).ok, true);
assert.equal(validateQuestion(baselinePart("uploaded_part")).ok, true);
assert.equal(validateBankObject(typedBaselineBank(), { rejectUnknownKeys: true, requireMeta: true }).ok, true);
for (const version of supportedSchemaVersions.filter(v => v !== "2.1")) {
  const checked = validateBankObject(typedBaselineBank(version));
  assert.equal(checked.ok, false);
  if (!checked.ok) assert(checked.reasons.some(r => r.includes("typed baseline boundary requires meta.schemaVersion 2.1")));
}
const legacyObject = typedBaselineCase();
Object.assign(legacyObject.caseStudy.questions[0], { stageId: { kind: "baseline" } });
assert.equal(validateQuestion(legacyObject).ok, false, "legacy remains string-only");
assert.equal(toExportEnvelope([typedBaselineCase()]).meta?.schemaVersion, "2.1");
const old = typedBaselineCase();
old.caseStudy.questions.forEach(p => { p.answerableAfterStageId = "s1"; });
assert.equal(toExportEnvelope([old]).meta?.schemaVersion, "1.6");
const exported = toExportEnvelope([typedBaselineCase()]);
assert.deepEqual(parseBankText(JSON.stringify(exported)), exported);
const uploaded = importQuestionsFromText(JSON.stringify([typedBaselineCase()]), new Set(), "synthetic baseline");
assert.equal(uploaded.summary.skipped.length, 0);
assert.equal(uploaded.records.length, 1);
assert.deepEqual(uploaded.records[0].question, typedBaselineCase());
const find = (bank: BankEnvelope) => findStageReferenceFindings([{ bank, file: "fixture.json" }], { strict: true });
assert.deepEqual(find(typedBaselineBank()), []);
const badLegacy = typedBaselineBank();
(badLegacy.questions[0] as ReturnType<typeof typedBaselineCase>).caseStudy.questions[0].stageId = "bad";
assert.deepEqual(find(badLegacy).map(f => [f.kind, f.kind === "unresolved" ? f.field : ""]), [["unresolved", "stageId"]]);
const unresolved = typedBaselineBank();
(unresolved.questions[0] as ReturnType<typeof typedBaselineCase>).caseStudy.questions[0].answerableAfterStageId = "baseline";
assert.deepEqual(find(unresolved).map(f => f.kind), ["unresolved", "revealsAllStages"]);
const fixture = typedBaselineCase();
const prompt = buildQuestionRescuePromptText({ question: fixture.caseStudy.questions[0], answer: getInitialAnswer(fixture.caseStudy.questions[0]), parentCase: fixture });
for (const token of ["BASELINE TITLE", "BASELINE SUMMARY", "GLOBAL CONTEXT"]) assert(prompt.includes(token));
assert(!prompt.includes("STAGED CONTENT"));
assert(!prompt.includes("UPDATE s"));
assert.equal(formatCaseVisibilityBoundary({ kind: "baseline" }), '{"kind":"baseline"}');
const checkObject = (bank: BankEnvelope) => assert.deepEqual((bank.questions[0] as ReturnType<typeof typedBaselineCase>).caseStudy.questions[0].answerableAfterStageId, { kind: "baseline" });
const shuffled = shuffle(typedBaselineCase());
assert.equal(shuffled.itemType, "case_study");
if (shuffled.itemType === "case_study") for (const part of shuffled.caseStudy.questions) assert.deepEqual(part.answerableAfterStageId, { kind: "baseline" });
const rawNormalized = normalizeRawBankStructure(typedBaselineBank());
assert.deepEqual(rawNormalized.changes, []);
checkObject(rawNormalized.bank as BankEnvelope);
checkObject(normalizeBankPresentations(typedBaselineBank()).bank);
checkObject(JSON.parse(serializeBank(typedBaselineBank())));

const repoRoot = resolve(import.meta.dirname, "../..");
const root = await mkdtemp(join(tmpdir(), "shrimp-typed-baseline-"));
try {
  const dirs = { stagingDir: join(root, "staging"), canonicalDir: join(root, "canonical") };
  await mkdir(dirs.stagingDir); await mkdir(dirs.canonicalDir);
  const source = join(root, "gemini-baseline.json");
  await writeFile(source, serializeBank(typedBaselineBank()));
  const prepared = await prepareRawPromotionPreview({ displayPath: source, resolvedPath: source });
  assert(prepared.ok, JSON.stringify(prepared));
  checkObject(prepared.prepared.bank); checkObject(JSON.parse(prepared.prepared.serialized));
  let gate = await runRawGate({ files: [source], comparisonFiles: [] });
  assert.equal(gate.exitCode, 0, renderRawGate(gate));
  const canonical = join(dirs.canonicalDir, "gemini-canonical.json");
  await writeFile(canonical, serializeBank({ meta: { schemaVersion: "2.0", count: 0 }, questions: [] }));
  gate = await runRawGate({ files: [source], comparisonFiles: [canonical] });
  assert.equal(gate.exitCode, 1); assert.match(renderRawGate(gate), /higher than routed canonical/);
  await writeFile(join(dirs.stagingDir, "gemini-baseline.json"), prepared.prepared.serialized);
  let result = await consolidateInto(dirs, "gemini-baseline.json");
  assert.equal(result.ok, false); assert.match(result.reason, /higher|version/i);
  await writeFile(canonical, serializeBank({ meta: { schemaVersion: "2.1", count: 0 }, questions: [] }));
  result = await consolidateInto(dirs, "gemini-baseline.json");
  assert.equal(result.ok, true, JSON.stringify(result));
  checkObject(JSON.parse(await readFile(canonical, "utf8")));
  const ordinary = baselinePart("ordinary_new"); delete ordinary.answerableAfterStageId;
  const ordinaryBank: BankEnvelope = { meta: { schemaVersion: "2.0", count: 1 }, questions: [ordinary] };
  await writeFile(source, serializeBank(ordinaryBank));
  gate = await runRawGate({ files: [source], comparisonFiles: [canonical] });
  assert.equal(gate.exitCode, 0, renderRawGate(gate));
  await writeFile(join(dirs.stagingDir, "gemini-ordinary.json"), serializeBank(ordinaryBank));
  assert.equal((await consolidateInto(dirs, "gemini-ordinary.json")).ok, true);
  checkObject(JSON.parse(await readFile(canonical, "utf8")));
  await writeFile(source, serializeBank(typedBaselineBank("2.0")));
  gate = await runRawGate({ files: [source], comparisonFiles: [] });
  assert.equal(gate.exitCode, 1); assert.match(renderRawGate(gate), /requires meta.schemaVersion 2.1/);

  // Execute the existing promotion CLI in a disposable synthetic repository.
  await mkdir(join(root, "banks/banks-raw"), { recursive: true });
  await writeFile(join(root, "banks/banks-raw/gemini-baseline.json"), serializeBank(typedBaselineBank()));
  const promotion = spawnSync(join(repoRoot, "node_modules/.bin/tsx"), [join(repoRoot, "scripts/promote.ts")], { cwd: root, encoding: "utf8" });
  assert.equal(promotion.status, 0, promotion.stdout + promotion.stderr);
  checkObject(JSON.parse(await readFile(join(root, "banks/_promoted/gemini-baseline.json"), "utf8")));
} finally { await rm(root, { recursive: true, force: true }); }

if (process.env.TYPED_BASELINE_RECEIPTS) {
  await writeFile(join(process.env.TYPED_BASELINE_RECEIPTS, "boundary-truth-table.json"), JSON.stringify(truthTable, null, 2) + "\n");
}
console.log("typed-baseline resolver, schema, import/export, audit, raw gate, promotion, consolidation, and preservation fixtures passed");
