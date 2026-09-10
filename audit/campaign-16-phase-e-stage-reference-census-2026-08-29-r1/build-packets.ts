import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { basename, join, relative, resolve } from "node:path";
import { parseBankText } from "../../src/bankImport";
import { getVisibleCaseStages } from "../../src/examLayout";
import { validateBankObject } from "../../src/schema";
import type { BankEnvelope, CaseStudyQuestion, CaseSubQuestion, StandaloneQuestion } from "../../src/types";
import { findStageReferenceFindings, type AnchorFieldState } from "../../scripts/audit/audit-stage-refs";

const REPO = resolve(import.meta.dirname, "../..");
const PRODUCER = resolve(import.meta.dirname);
const DEFAULT_OUT = PRODUCER;
const BANK_DIR = resolve(REPO, "banks");
const WORK_ORDER = "scratch/CAMPAIGN-16-PHASE-E-STAGE-REFERENCE-SEMANTIC-CENSUS-WORK-ORDER-2026-08-29.md";
const FROZEN_WORK_ORDER_SHA256 = "91e7434905f52ef90f7288def1aa6d17118c3708b7e99d76f0384bfeeafad390";
const HISTORICAL_POPULATION = resolve(REPO, "audit/stage-reference-semantic-census-2026-07-23/population.jsonl");
const PHASE_A_BASELINE = resolve(REPO, "audit/campaign-16-phase-a-baseline-2026-08-26/baseline.md");
const CHECKER_ROOT = resolve(REPO, "audit/campaign-16-phase-e-stage-reference-check-2026-08-29-r1");
const MAX_TARGETS = 20;
const MAX_BYTES = 300_000;

type LoadedBank = { bankPath: string; filename: string; sha256: string; bank: BankEnvelope };
type Finding = Extract<ReturnType<typeof findStageReferenceFindings>[number], { kind: "revealsAllStages" }>;
type PopulationRow = {
  queueIndex: number;
  packetId: string;
  bankPath: string;
  bankSha256: string;
  parentCaseId: string;
  partId: string;
  casePath: string;
  partPath: string;
  partOrdinal: number;
  casePartCount: number;
  itemType: StandaloneQuestion["itemType"];
  anchorState: { answerableAfterStageId: AnchorFieldState; stageId: AnchorFieldState };
  declaredStageIds: string[];
  rendererVisibleStageIds: string[];
};
type EvidenceSurface = "CASE_CONTEXT" | "GLOBAL_EXHIBIT" | "STAGE" | "PART_STEM" | "PART_RESPONSE" | "PART_KEY" | "PART_RATIONALE" | "SIBLING_OUTLINE";
type EvidenceEntry = {
  evidenceId: string;
  parentCaseId: string;
  ownerPartId?: string;
  surface: EvidenceSurface;
  stageId?: string;
  language?: "en" | "zh";
  jsonPath: string;
  text: string;
};
type BuiltCase = {
  bankPath: string;
  bankSha256: string;
  parentCaseId: string;
  casePath: string;
  stem: unknown;
  title: unknown;
  summary?: unknown;
  globalExhibits: unknown[];
  stages: unknown[];
  siblingPartOutlines: unknown[];
  targets: unknown[];
  evidenceIds: string[];
  _evidenceCatalog: EvidenceEntry[];
  _populationRows: Omit<PopulationRow, "queueIndex" | "packetId">[];
};
type Packet = {
  packetVersion: "1.0";
  packetId: string;
  bankSnapshotSha256: string;
  targetCount: number;
  oversizedSingleCase: boolean;
  cases: Array<Omit<BuiltCase, "_evidenceCatalog" | "_populationRows">>;
  evidenceCatalog: EvidenceEntry[];
};

const compact = (value: unknown): string => JSON.stringify(value);
const pretty = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value: string | Buffer): string => createHash("sha256").update(value).digest("hex");
const token = (value: string): string => encodeURIComponent(value).replaceAll(".", "%2E");
const utf8Bytes = (value: unknown): number => Buffer.byteLength(compact(value), "utf8");
function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

function git(args: string[]): string {
  return execFileSync("git", args, { cwd: REPO, encoding: "utf8" }).trimEnd();
}

async function rawHash(path: string): Promise<string | null> {
  try {
    const info = await stat(resolve(REPO, path));
    if (!info.isFile()) return null;
    return sha256(await readFile(resolve(REPO, path)));
  } catch { return null; }
}

function openingStatusEntries(): Array<{ status: string; path: string }> {
  const raw = execFileSync("git", ["-c", "core.quotepath=false", "status", "--porcelain=v1", "--untracked-files=all"], { cwd: REPO, encoding: "utf8" });
  return raw.split(/\r?\n/u).filter(Boolean).map((line) => ({ status: line.slice(0, 2), path: line.slice(3) }))
    .filter(({ path }) => !path.startsWith(`${relative(REPO, PRODUCER)}/`));
}

async function writeOpeningState(banks: LoadedBank[], out: string): Promise<void> {
  assert(resolve(out) === PRODUCER, "opening-state may only be written at the producer root");
  const workOrderText = await readFile(resolve(REPO, WORK_ORDER));
  assert(sha256(workOrderText) === FROZEN_WORK_ORDER_SHA256, "CAMPAIGN16_PHASE_E_BLOCKED work-order hash mismatch");
  try { await stat(CHECKER_ROOT); throw new Error("CAMPAIGN16_PHASE_E_BLOCKED checker root exists"); } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const statusEntries = openingStatusEntries();
  const dirtyPaths = [];
  for (const entry of statusEntries) {
    const indexLine = entry.status === "??" ? "" : git(["ls-files", "-s", "--", entry.path]).split(/\r?\n/u)[0] ?? "";
    dirtyPaths.push({
      ...entry,
      worktreeSha256: await rawHash(entry.path),
      indexBlob: indexLine === "" ? null : indexLine.split(/\s+/u)[1] ?? null,
    });
  }
  const upstream = git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"]);
  const [behind, ahead] = git(["rev-list", "--left-right", "--count", "@{upstream}...HEAD"]).split(/\s+/u).map(Number);
  const state = {
    openingStateVersion: "1.0",
    ownerFrozenLaunch: { workOrderPath: WORK_ORDER, sha256: FROZEN_WORK_ORDER_SHA256, liveMatch: true },
    repository: REPO,
    branch: git(["branch", "--show-current"]),
    head: git(["rev-parse", "HEAD"]),
    upstream,
    ahead,
    behind,
    producerRootAbsentBeforeAuthorizedCreation: true,
    checkerRootAbsentBeforeAuthorizedCreation: true,
    openingStatusPorcelainV1: statusEntries,
    openingDirtyPaths: dirtyPaths,
    bundledBanks: banks.map(({ bankPath, sha256: hash }) => ({ bankPath, sha256: hash })),
    traps: {
      mcp2MiBSkip: "ACTIVE_DIRECT_PARSE_USED",
      censusByteInstability: "ACTIVE_CENSUS_CHECK_ONLY",
      strictExitOne: "ACTIVE_CAPTURE_OUTPUT_BEFORE_EXIT",
      canonicalSweepSilentSkip: "ACTIVE_EXPLICIT_VALIDATE_AND_EXPLICIT_FILE_AUDIT",
      frozenBowtieGenerator: "N_A_HANDLED_NOT_INVOKED",
    },
  };
  await writeFile(join(out, "opening-state.json"), pretty(state));
}

function stripAuditOnly(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(stripAuditOnly);
  return Object.fromEntries(Object.entries(value as Record<string, unknown>)
    .filter(([key]) => key !== "meta" && key !== "selfCheck")
    .map(([key, child]) => [key, stripAuditOnly(child)]));
}

function stripEvidenceNoise(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(stripEvidenceNoise);
  return Object.fromEntries(Object.entries(value as Record<string, unknown>)
    .filter(([key]) => !new Set(["meta", "selfCheck", "id", "type", "kind", "columnId", "refId"]).has(key))
    .map(([key, child]) => [key, stripEvidenceNoise(child)]));
}

class EvidenceBuilder {
  readonly entries: EvidenceEntry[] = [];
  private readonly ids = new Set<string>();
  constructor(private readonly parentCaseId: string) {}
  add(id: string, surface: EvidenceSurface, jsonPath: string, text: string, extra: Partial<Pick<EvidenceEntry, "ownerPartId" | "stageId" | "language">> = {}): string {
    assert(!this.ids.has(id), `BLOCKED_EVIDENCE_PROJECTION_FAILURE duplicate ${id}`);
    this.ids.add(id);
    this.entries.push({ evidenceId: id, parentCaseId: this.parentCaseId, surface, jsonPath, text, ...extra });
    return id;
  }
  walk(prefix: string, surface: EvidenceSurface, jsonPath: string, value: unknown, extra: Partial<Pick<EvidenceEntry, "ownerPartId" | "stageId">> = {}): string[] {
    const ids: string[] = [];
    const visit = (node: unknown, path: string, suffix: string, language?: "en" | "zh"): void => {
      if (node !== null && typeof node === "object") {
        if (Array.isArray(node)) node.forEach((child, index) => visit(child, `${path}[${index}]`, `${suffix}.${index}`, language));
        else Object.keys(node as Record<string, unknown>).sort().forEach((key) => visit((node as Record<string, unknown>)[key], `${path}.${key}`, `${suffix}.${token(key)}`, key === "en" || key === "zh" ? key : language));
        return;
      }
      if (node === undefined) return;
      ids.push(this.add(`${prefix}${suffix}`, surface, path, typeof node === "string" ? node : JSON.stringify(node), { ...extra, language }));
    };
    visit(value, jsonPath, "");
    return ids;
  }
}

function responseProjection(part: CaseSubQuestion): { visible: unknown; key: unknown; complete: unknown } {
  if (part.itemType === "multiple_choice" || part.itemType === "select_all" || part.itemType === "ordered_response") {
    const visible = { options: part.options }; const key = { correct: part.correct }; return { visible, key, complete: { ...visible, ...key } };
  }
  if (part.itemType === "fill_in_blank") {
    const visible = { blanks: part.blanks.map(({ acceptable: _acceptable, numeric: _numeric, ...blank }) => blank) };
    const key = { blanks: part.blanks.map(({ id, acceptable, numeric }) => ({ id, acceptable, numeric })) };
    return { visible, key, complete: { blanks: part.blanks } };
  }
  if (part.itemType === "matrix") {
    const visible = { matrix: part.matrix }; const key = { correct: part.correct }; return { visible, key, complete: { ...visible, ...key } };
  }
  if (part.itemType === "dropdown_cloze") {
    const visible = { clozeStem: part.clozeStem, dropdowns: part.dropdowns.map(({ correct: _correct, ...dropdown }) => dropdown) };
    const key = { dropdowns: part.dropdowns.map(({ id, correct }) => ({ id, correct })) };
    return { visible, key, complete: { clozeStem: part.clozeStem, dropdowns: part.dropdowns } };
  }
  if (part.itemType === "highlight") {
    const visible = { highlight: { segments: part.highlight.segments } }; const key = { correct: part.highlight.correct };
    return { visible, key, complete: { highlight: part.highlight } };
  }
  const visible = { bowtie: Object.fromEntries(Object.entries(part.bowtie).map(([name, zone]) => [name, { prompt: zone.prompt, tokens: zone.tokens }])) };
  const key = { bowtie: Object.fromEntries(Object.entries(part.bowtie).map(([name, zone]) => [name, { correct: zone.correct }])) };
  return { visible, key, complete: { bowtie: part.bowtie } };
}

function buildCase(loaded: LoadedBank, question: CaseStudyQuestion, caseIndex: number, findings: Finding[]): BuiltCase {
  const casePath = `questions[${caseIndex}]`;
  const evidence = new EvidenceBuilder(question.id);
  const base = `case.${token(question.id)}`;
  const contextEvidenceIds = [
    ...evidence.walk(`${base}.context.stem`, "CASE_CONTEXT", `${casePath}.stem`, question.stem),
    ...evidence.walk(`${base}.context.title`, "CASE_CONTEXT", `${casePath}.caseStudy.title`, question.caseStudy.title),
    ...(question.caseStudy.summary ? evidence.walk(`${base}.context.summary`, "CASE_CONTEXT", `${casePath}.caseStudy.summary`, question.caseStudy.summary) : []),
  ];
  const globalExhibits = question.caseStudy.exhibits.map((exhibit, index) => {
    const projection = stripAuditOnly(exhibit);
    const evidenceIds = evidence.walk(`${base}.global.${token(exhibit.id)}`, "GLOBAL_EXHIBIT", `${casePath}.caseStudy.exhibits[${index}]`, stripEvidenceNoise(projection));
    return { ...(projection as object), evidenceIds };
  });
  const stages = (question.caseStudy.stages ?? []).map((stage, index) => {
    const projection = stripAuditOnly(stage) as Record<string, unknown>;
    const evidenceIds = evidence.walk(`${base}.stage.${token(stage.id)}`, "STAGE", `${casePath}.caseStudy.stages[${index}]`, stripEvidenceNoise(projection), { stageId: stage.id });
    return { ...projection, evidenceIds };
  });
  const siblingPartOutlines = question.caseStudy.questions.map((part, index) => {
    const outline = { ordinal: index + 1, id: part.id, itemType: part.itemType, stem: part.stem, answerableAfterStageId: part.answerableAfterStageId ?? null, stageId: part.stageId ?? null };
    const evidenceIds = [
      ...evidence.walk(`${base}.sibling.${token(part.id)}.stem`, "SIBLING_OUTLINE", `${casePath}.caseStudy.questions[${index}].stem`, part.stem, { ownerPartId: part.id }),
      evidence.add(`${base}.sibling.${token(part.id)}.anchors`, "SIBLING_OUTLINE", `${casePath}.caseStudy.questions[${index}]`, compact({ answerableAfterStageId: part.answerableAfterStageId ?? null, stageId: part.stageId ?? null }), { ownerPartId: part.id }),
    ];
    return { ...outline, evidenceIds };
  });
  const findingByPart = new Map(findings.map((finding) => [finding.partId, finding]));
  const targets: unknown[] = [];
  const rows: Omit<PopulationRow, "queueIndex" | "packetId">[] = [];
  question.caseStudy.questions.forEach((part, index) => {
    const finding = findingByPart.get(part.id);
    if (!finding) return;
    const partPath = `${casePath}.caseStudy.questions[${index}]`;
    const partBase = `${base}.part.${token(part.id)}`;
    const projectedResponse = responseProjection(part);
    const response = stripAuditOnly(projectedResponse.complete);
    const stemEvidenceIds = evidence.walk(`${partBase}.stem`, "PART_STEM", `${partPath}.stem`, part.stem, { ownerPartId: part.id });
    const responseEvidenceIds = evidence.walk(`${partBase}.response`, "PART_RESPONSE", partPath, stripEvidenceNoise(projectedResponse.visible), { ownerPartId: part.id });
    const keyEvidenceIds = [evidence.add(`${partBase}.key`, "PART_KEY", partPath, compact(projectedResponse.key), { ownerPartId: part.id })];
    const rationaleEvidenceIds = evidence.walk(`${partBase}.rationale`, "PART_RATIONALE", `${partPath}.rationale`, stripEvidenceNoise(part.rationale), { ownerPartId: part.id });
    const strategyEvidenceIds = evidence.walk(`${partBase}.strategy`, "PART_RATIONALE", `${partPath}.testTakingStrategy`, part.testTakingStrategy, { ownerPartId: part.id });
    const visual = part.visual ? stripAuditOnly(part.visual) : undefined;
    const visualEvidenceIds = visual ? evidence.walk(`${partBase}.visual`, "PART_RESPONSE", `${partPath}.visual`, stripEvidenceNoise(visual), { ownerPartId: part.id }) : [];
    const partEvidenceIds = [...stemEvidenceIds, ...responseEvidenceIds, ...keyEvidenceIds, ...rationaleEvidenceIds, ...strategyEvidenceIds, ...visualEvidenceIds];
    targets.push({
      partId: part.id,
      partOrdinal: index + 1,
      itemType: part.itemType,
      stem: part.stem,
      response,
      visual,
      rationale: part.rationale,
      testTakingStrategy: part.testTakingStrategy,
      anchorState: finding.anchorState,
      declaredStageIds: finding.validStageIds,
      rendererVisibleStageIds: getVisibleCaseStages(question, part).map(({ id }) => id),
      partEvidenceIds,
      stageEvidenceIds: stages.flatMap((stage) => stage.evidenceIds),
      contextEvidenceIds,
    });
    rows.push({
      bankPath: loaded.bankPath, bankSha256: loaded.sha256, parentCaseId: question.id, partId: part.id,
      casePath, partPath, partOrdinal: index + 1, casePartCount: question.caseStudy.questions.length,
      itemType: part.itemType, anchorState: finding.anchorState, declaredStageIds: finding.validStageIds,
      rendererVisibleStageIds: getVisibleCaseStages(question, part).map(({ id }) => id),
    });
  });
  assert(targets.length === findings.length, `BLOCKED_POPULATION_RECONCILIATION ${question.id}`);
  return { bankPath: loaded.bankPath, bankSha256: loaded.sha256, parentCaseId: question.id, casePath, stem: question.stem, title: question.caseStudy.title, summary: question.caseStudy.summary, globalExhibits, stages, siblingPartOutlines, targets, evidenceIds: evidence.entries.map(({ evidenceId }) => evidenceId), _evidenceCatalog: evidence.entries, _populationRows: rows };
}

async function loadBanks(): Promise<LoadedBank[]> {
  const filenames = (await readdir(BANK_DIR)).filter((name) => name.endsWith(".json")).sort();
  assert(filenames.length === 13, `CAMPAIGN16_PHASE_E_BLOCKED expected 13 banks, found ${filenames.length}`);
  const banks: LoadedBank[] = [];
  for (const filename of filenames) {
    const text = await readFile(join(BANK_DIR, filename), "utf8");
    const result = validateBankObject(parseBankText(text), { rejectUnknownKeys: true });
    assert(result.ok, `CAMPAIGN16_PHASE_E_BLOCKED ${filename}: ${result.ok ? "" : result.reasons.join("; ")}`);
    banks.push({ bankPath: `banks/${filename}`, filename, sha256: sha256(text), bank: result.value });
  }
  return banks;
}

function snapshotHash(banks: LoadedBank[]): string { return sha256(banks.map(({ bankPath, sha256: hash }) => `${bankPath}\0${hash}\n`).join("")); }
function packetFromCases(packetId: string, snapshot: string, cases: BuiltCase[], oversizedSingleCase = false): Packet {
  return { packetVersion: "1.0", packetId, bankSnapshotSha256: snapshot, targetCount: cases.reduce((n, c) => n + c._populationRows.length, 0), oversizedSingleCase, cases: cases.map(({ _evidenceCatalog, _populationRows, ...rest }) => rest), evidenceCatalog: cases.flatMap((c) => c._evidenceCatalog) };
}
function packCases(cases: BuiltCase[], snapshot: string): Packet[] {
  const groups: BuiltCase[][] = []; let current: BuiltCase[] = [];
  for (const builtCase of cases) {
    const candidate = [...current, builtCase];
    const projected = packetFromCases(`packet-${String(groups.length + 1).padStart(3, "0")}`, snapshot, candidate);
    if (current.length > 0 && (projected.targetCount > MAX_TARGETS || utf8Bytes(projected) > MAX_BYTES)) { groups.push(current); current = [builtCase]; }
    else current = candidate;
  }
  if (current.length) groups.push(current);
  return groups.map((group, index) => {
    const id = `packet-${String(index + 1).padStart(3, "0")}`;
    const ordinary = packetFromCases(id, snapshot, group);
    return packetFromCases(id, snapshot, group, group.length === 1 && (ordinary.targetCount > MAX_TARGETS || utf8Bytes(ordinary) > MAX_BYTES));
  });
}

async function parseJsonl(path: string): Promise<Record<string, unknown>[]> {
  return (await readFile(path, "utf8")).split(/\r?\n/u).filter(Boolean).map((line) => JSON.parse(line) as Record<string, unknown>);
}

async function build(out: string): Promise<{ banks: LoadedBank[]; population: PopulationRow[]; packets: Packet[] }> {
  assert(resolve(out).startsWith(`${PRODUCER}/`) || resolve(out) === PRODUCER, "output outside producer root");
  const workOrderSha = sha256(await readFile(resolve(REPO, WORK_ORDER)));
  assert(workOrderSha === FROZEN_WORK_ORDER_SHA256, "CAMPAIGN16_PHASE_E_BLOCKED work-order hash changed");
  const banks = await loadBanks();
  const snapshot = snapshotHash(banks);
  const auditBanks = banks.map(({ bank, filename }) => ({ bank, file: filename }));
  const strictFindings = findStageReferenceFindings(auditBanks, { strict: true });
  const findings = strictFindings.filter((finding): finding is Finding => finding.kind === "revealsAllStages");
  const keys = new Set<string>();
  for (const finding of findings) { const key = `${finding.file}|${finding.parentId}|${finding.partId}`; assert(!keys.has(key), `CAMPAIGN16_PHASE_E_BLOCKED duplicate ${key}`); keys.add(key); }
  const cases: BuiltCase[] = [];
  for (const loaded of banks) loaded.bank.questions.forEach((question, index) => {
    if (question.itemType !== "case_study") return;
    const caseFindings = findings.filter(({ file, parentId }) => file === loaded.filename && parentId === question.id);
    if (caseFindings.length) cases.push(buildCase(loaded, question, index, caseFindings));
  });
  assert(cases.reduce((n, c) => n + c._populationRows.length, 0) === findings.length, "CAMPAIGN16_PHASE_E_BLOCKED population resolution");
  const packets = packCases(cases, snapshot);
  const population: PopulationRow[] = []; let queueIndex = 1;
  for (const packet of packets) for (const packetCase of packet.cases) {
    const built = cases.find((candidate) => candidate.bankPath === packetCase.bankPath && candidate.parentCaseId === packetCase.parentCaseId)!;
    for (const row of built._populationRows) population.push({ queueIndex: queueIndex++, packetId: packet.packetId, ...row });
  }
  assert(population.length === findings.length, "CAMPAIGN16_PHASE_E_BLOCKED packet population mismatch");
  for (const packet of packets) {
    assert(packet.oversizedSingleCase || (packet.targetCount <= MAX_TARGETS && utf8Bytes(packet) <= MAX_BYTES), `CAMPAIGN16_PHASE_E_BLOCKED packet limit ${packet.packetId}`);
    assert(new Set(packet.evidenceCatalog.map(({ evidenceId }) => evidenceId)).size === packet.evidenceCatalog.length, `CAMPAIGN16_PHASE_E_BLOCKED evidence collision ${packet.packetId}`);
  }
  const historical = await parseJsonl(HISTORICAL_POPULATION);
  const identity = (row: Record<string, unknown> | PopulationRow) => `${row.bankPath}|${row.parentCaseId}|${row.partId}`;
  const liveSet = new Set(population.map(identity)); const historicalSet = new Set(historical.map(identity));
  const additions = [...liveSet].filter((key) => !historicalSet.has(key)).sort();
  const removals = [...historicalSet].filter((key) => !liveSet.has(key)).sort();
  const phaseABaselineText = await readFile(PHASE_A_BASELINE, "utf8");
  const phaseAHashes = new Map([...phaseABaselineText.matchAll(/`(banks\/[\w-]+\.json)` \| `([a-f0-9]{64})`/gu)].map((match) => [match[1], match[2]]));
  const bankDriftAgainstPhaseA = banks.map(({ bankPath, sha256: hash }) => ({ bankPath, phaseASha256: phaseAHashes.get(bankPath) ?? null, liveSha256: hash, changed: phaseAHashes.get(bankPath) !== hash }));
  await rm(join(out, "packets"), { recursive: true, force: true });
  await mkdir(join(out, "packets"), { recursive: true });
  await writeFile(join(out, "population.jsonl"), `${population.map(compact).join("\n")}\n`);
  await writeFile(join(out, "population-summary.json"), pretty({ populationVersion: "1.0", bankSnapshotSha256: snapshot, targetCount: population.length, parentCaseCount: cases.length, bankCount: banks.length, unresolvedCount: strictFindings.filter((f) => f.kind === "unresolved").length, strictMissingRequiredAnchorCount: strictFindings.filter((f) => f.kind === "missingRequiredAnchor").length, countsByBank: Object.fromEntries(banks.map(({ bankPath }) => [bankPath, population.filter((row) => row.bankPath === bankPath).length])), countsByItemType: Object.fromEntries([...new Set(population.map(({ itemType }) => itemType))].sort().map((itemType) => [itemType, population.filter((row) => row.itemType === itemType).length])), reconciliation: { phaseAOrientation: { targetCount: 451, parentCaseCount: 93, targetCountDelta: population.length - 451, parentCaseCountDelta: cases.length - 93 }, julyIdentityOnly: { historicalCount: historical.length, additions, removals }, bankDriftAgainstPhaseA } }));
  const manifest = { manifestVersion: "1.0", bankSnapshotSha256: snapshot, bankFiles: banks.map(({ bankPath, sha256: hash }) => ({ bankPath, sha256: hash })), targetCount: population.length, parentCaseCount: cases.length, packetCount: packets.length, limits: { targetParts: MAX_TARGETS, utf8Bytes: MAX_BYTES }, packets: packets.map((packet) => ({ packetId: packet.packetId, path: `packets/${packet.packetId}.json`, targetCount: packet.targetCount, parentCaseCount: packet.cases.length, utf8Bytes: utf8Bytes(packet), sha256: sha256(compact(packet)), oversizedSingleCase: packet.oversizedSingleCase, queueIndices: population.filter((row) => row.packetId === packet.packetId).map(({ queueIndex }) => queueIndex) })) };
  await writeFile(join(out, "packet-manifest.json"), pretty(manifest));
  for (const packet of packets) await writeFile(join(out, "packets", `${packet.packetId}.json`), compact(packet));
  return { banks, population, packets };
}

async function main(): Promise<void> {
  const argIndex = process.argv.indexOf("--out");
  const out = argIndex >= 0 ? resolve(PRODUCER, process.argv[argIndex + 1]) : DEFAULT_OUT;
  await mkdir(out, { recursive: true });
  const result = await build(out);
  if (out === PRODUCER && !process.argv.includes("--skip-opening")) await writeOpeningState(result.banks, out);
  console.log(pretty({ status: "CAMPAIGN16_PHASE_E_PACKETS_BUILT", out: relative(REPO, out), targetCount: result.population.length, parentCaseCount: new Set(result.population.map((row) => `${row.bankPath}|${row.parentCaseId}`)).size, packetCount: result.packets.length }));
}

await main();
