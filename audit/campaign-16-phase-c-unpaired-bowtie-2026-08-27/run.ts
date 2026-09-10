import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  derivePopulation,
  sha256,
  stableJson,
} from "../standalone-bowtie-answerability-census-2026-08-23/run.ts";

export const REPO_ROOT = resolve(import.meta.dirname, "../..");
export const ARTIFACT_ROOT = resolve(import.meta.dirname);

const PHASE_A_BASELINE = join(REPO_ROOT, "audit/campaign-16-phase-a-baseline-2026-08-26/baseline.json");
const PAIRED_ADJUDICATION = join(REPO_ROOT, "audit/standalone-bowtie-answerability-census-2026-08-23/adjudication.jsonl");
const GPT_EXPECTED = "e4955f7b8c54e4880bd9ddb0f2f7c35881169f53051b5ed3ce21757f86287b3b";
const WORK_ORDER_SHA256 = "d9716c00e27e22f0fd70f8517af7bafcbec85861676869d00bba1690c6af2337";
const EXPECTED_SUFFIX = 50;
const EXPECTED_PAIRED = 31;
const EXPECTED_UNPAIRED = 19;
const PILOT_COUNT = 4;
const STAGE1_INSTRUCTION = "Using only the standalone stem, independently free-generate exactly one most likely condition, exactly two priority nursing actions, and exactly two monitoring or evaluation parameters. Return the required structured JSON and identify the stem evidence and any missing information needed for specificity or uniqueness.";
const STAGE2_INSTRUCTION = "Using only the standalone learner-facing English stem, prompts, and opaque token pools, select exactly one condition, two actions, and two parameters. Return the required structured JSON, including exactly one premise row for every opaque token. Do not infer absent client-specific facts.";
const ALL_LABELS = ["C1", "C2", "C3", "A1", "A2", "A3", "A4", "P1", "P2", "P3", "P4"];
const PREMISE_STATUSES = new Set(["SUPPORTED_EXPLICIT", "SUPPORTED_GENERAL_KNOWLEDGE", "MISSING_CLIENT_FACT", "CONTRADICTED", "NO_CLIENT_PREMISE"]);
const SUPPORT_CLASSES = new Set(["DIRECT", "GENERAL_KNOWLEDGE_LINK", "MISSING_CLIENT_FACT", "CONTRADICTED", "NOT_APPLICABLE"]);
const VERDICTS = new Set(["FAIL_HIDDEN_CASE_DEPENDENCY", "FAIL_UNSUPPORTED_TOKEN_PREMISE", "FAIL_UNDERDETERMINED", "FAIL_CANONICAL_KEY_OR_LOGIC", "HOLD_REVIEWER_DISAGREEMENT", "PASS_STANDALONE"]);
const PROVENANCE = new Set(["RATIONALE_ONLY", "OTHER_PROVENANCE", "UNSUPPORTED_ANYWHERE_CHECKED"]);
const BT_IDS = [
  "gpt_balance6a_2026_07_16_bt_perioperative_care_13",
  "gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14",
];

type JsonObject = Record<string, any>;
type Bank = { meta: JsonObject; questions: JsonObject[] };

export type PhaseCPopulationRecord = {
  surrogateId: string;
  candidateId: string;
  candidateBankPath: string;
  candidateJsonPath: string;
  candidateTopLevelIndex: number;
  candidateTopLevelOrdinal: number;
  companionCaseId: null;
  companionBankPath: null;
  companionJsonPath: null;
  companionTopLevelIndex: null;
  companionTopLevelOrdinal: null;
  pairingRule: null;
  unpairedReason: "NO_ELIGIBLE_SIBLING_CASE";
  bankSchemaVersion: string;
  category: string;
  topic: string;
  difficulty: string;
  ngnSkill?: string;
  tokenCounts: { condition: number; actions: number; parameters: number };
  canonicalKeyCardinality: { condition: number; actions: number; parameters: number };
  candidatePayloadSha256: string;
  stage1BlindInputSha256: string;
  stage2BlindInputSha256: string;
  pilot: boolean;
};

function fail(message: string): never {
  throw new Error(message);
}

function isObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readJson(path: string): any {
  return JSON.parse(readFileSync(path, "utf8"));
}

function readJsonl(path: string): any[] {
  const text = readFileSync(path, "utf8").trim();
  return text ? text.split("\n").map(JSON.parse) : [];
}

function jsonl(rows: unknown[]): string {
  return `${rows.map((row) => stableJson(row, 0).trimEnd()).join("\n")}\n`;
}

function writeText(path: string, text: string): void {
  mkdirSync(resolve(path, ".."), { recursive: true });
  writeFileSync(path, text.endsWith("\n") ? text : `${text}\n`, "utf8");
}

function writeStable(path: string, value: unknown): void {
  writeText(path, stableJson(value));
}

function git(...args: string[]): string {
  return execFileSync("git", args, { cwd: REPO_ROOT, encoding: "utf8" }).trimEnd();
}

export function bankPaths(): string[] {
  return readdirSync(join(REPO_ROOT, "banks"))
    .filter((name) => name.endsWith(".json") && statSync(join(REPO_ROOT, "banks", name)).isFile())
    .sort()
    .map((name) => `banks/${name}`);
}

export function loadWorkingTreeBanks(paths = bankPaths()): Map<string, Bank> {
  const result = new Map<string, Bank>();
  for (const bankPath of paths) {
    const bank = readJson(join(REPO_ROOT, bankPath));
    if (!isObject(bank) || !isObject(bank.meta) || !Array.isArray(bank.questions)) fail(`Malformed bank envelope: ${bankPath}`);
    result.set(bankPath, bank as Bank);
  }
  return result;
}

function fileSha(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

export function computeBankIdentity() {
  const paths = bankPaths();
  if (paths.length !== 13) fail(`Phase C identity gate: expected 13 bundled banks, observed ${paths.length}`);
  const baseline = readJson(PHASE_A_BASELINE).campaignBaselineFileByteSha256 as Record<string, string>;
  const rows = paths.map((bankPath) => {
    const observed = fileSha(join(REPO_ROOT, bankPath));
    const expected = bankPath === "banks/gpt-canonical.json" ? GPT_EXPECTED : baseline[bankPath];
    if (!expected) fail(`Phase C identity gate: no expected hash for ${bankPath}`);
    return {
      bankPath,
      expected,
      observed,
      match: expected === observed,
      expectedSource: bankPath === "banks/gpt-canonical.json"
        ? "Phase C work order §3.2 literal; corroborating artifact audit/campaign-16-phase-b-recovery-2026-08-27/status-stage-3.log lines 117 and 145"
        : "audit/campaign-16-phase-a-baseline-2026-08-26/baseline.json campaignBaselineFileByteSha256",
    };
  });
  const mismatches = rows.filter((row) => !row.match);
  if (mismatches.length) fail(`Phase C identity gate mismatch: ${mismatches.map((row) => row.bankPath).join(", ")}`);
  return { status: "PASS", bankCount: paths.length, rows };
}

export function assertOpeningBankIdentity(): void {
  const opening = readJson(join(ARTIFACT_ROOT, "opening-identity.json"));
  const mismatches = opening.bankIdentity.rows.filter((row: any) => fileSha(join(REPO_ROOT, row.bankPath)) !== row.observed);
  if (mismatches.length) fail(`Frozen Phase C bank snapshot mismatch: ${mismatches.map((row: any) => row.bankPath).join(", ")}`);
}

export function opaqueMap(question: JsonObject): Record<string, Record<string, string>> {
  const zones = ["condition", "actions", "parameters"] as const;
  const prefixes = { condition: "C", actions: "A", parameters: "P" } as const;
  return Object.fromEntries(zones.map((zone) => [zone, Object.fromEntries(question.bowtie[zone].tokens.map((token: any, index: number) => [token.id, `${prefixes[zone]}${index + 1}`]))]));
}

export function canonicalSelection(question: JsonObject, map: Record<string, Record<string, string>>) {
  return {
    conditionLabel: map.condition[question.bowtie.condition.correct],
    actionLabels: question.bowtie.actions.correct.map((id: string) => map.actions[id]),
    parameterLabels: question.bowtie.parameters.correct.map((id: string) => map.parameters[id]),
  };
}

export function stage1Packet(question: JsonObject): JsonObject {
  if (typeof question.stem?.en !== "string" || !question.stem.en.trim()) fail(`Missing stem.en for ${question.id}`);
  return { instruction: STAGE1_INSTRUCTION, stem: question.stem.en };
}

export function stage2Packet(question: JsonObject): JsonObject {
  const zones = ["condition", "actions", "parameters"] as const;
  const prefixes = { condition: "C", actions: "A", parameters: "P" } as const;
  const prompts: Record<string, string> = {};
  const tokens: Record<string, { label: string; text: string }[]> = {};
  for (const zone of zones) {
    if (typeof question.bowtie?.[zone]?.prompt?.en === "string") prompts[zone] = question.bowtie[zone].prompt.en;
    tokens[zone] = question.bowtie[zone].tokens.map((token: any, index: number) => ({ label: `${prefixes[zone]}${index + 1}`, text: token.en }));
  }
  return {
    instruction: STAGE2_INSTRUCTION,
    stem: question.stem.en,
    ...(Object.keys(prompts).length ? { prompts } : {}),
    tokens,
  };
}

function keyCardinality(question: JsonObject) {
  return {
    condition: typeof question.bowtie?.condition?.correct === "string" ? 1 : 0,
    actions: Array.isArray(question.bowtie?.actions?.correct) ? question.bowtie.actions.correct.length : -1,
    parameters: Array.isArray(question.bowtie?.parameters?.correct) ? question.bowtie.parameters.correct.length : -1,
  };
}

function tokenCounts(question: JsonObject) {
  return {
    condition: question.bowtie?.condition?.tokens?.length ?? -1,
    actions: question.bowtie?.actions?.tokens?.length ?? -1,
    parameters: question.bowtie?.parameters?.tokens?.length ?? -1,
  };
}

function fixedShape(question: JsonObject): boolean {
  return stableJson(tokenCounts(question), 0) === stableJson({ condition: 3, actions: 4, parameters: 4 }, 0)
    && stableJson(keyCardinality(question), 0) === stableJson({ condition: 1, actions: 2, parameters: 2 }, 0);
}

function locatedById(derived: any): Map<string, any> {
  return new Map(derived.located.map((row: any) => [row.question.id, row]));
}

function preflightEvidence(banks: Map<string, Bank>, identity: any) {
  const baseline = readJson(PHASE_A_BASELINE);
  const derived = derivePopulation(banks as any);
  const byId = locatedById(derived);
  const suffixRoster = derived.suffixBowties.map((row: any) => row.question.id).sort();
  const pairedRoster = derived.paired.map((row: any) => row.candidate.question.id).sort();
  const unpairedRoster = derived.excluded.map((row: any) => row.candidateId).sort();
  const phaseASuffix = [...baseline.bowtie.pairedRoster.map((row: any) => row.id), ...baseline.bowtie.unpaired.map((row: any) => row.id)].sort();
  const populationDelta = {
    additions: suffixRoster.filter((id: string) => !phaseASuffix.includes(id)),
    removals: phaseASuffix.filter((id: string) => !suffixRoster.includes(id)),
  };
  const exact = derived.paired.filter((row: any) => row.pairingRule === "EXACT").length;
  const ordinal = derived.paired.filter((row: any) => row.pairingRule === "ORDINAL_SUFFIX").length;
  if (suffixRoster.length !== EXPECTED_SUFFIX || derived.paired.length !== EXPECTED_PAIRED || exact !== 30 || ordinal !== 1 || unpairedRoster.length !== EXPECTED_UNPAIRED || populationDelta.additions.length || populationDelta.removals.length) {
    fail(`§4.1 population gate failed: suffix ${suffixRoster.length}, paired ${derived.paired.length} (${exact} EXACT/${ordinal} ORDINAL_SUFFIX), unpaired ${unpairedRoster.length}, additions ${populationDelta.additions.length}, removals ${populationDelta.removals.length}`);
  }

  const baselineUnpaired = new Map(baseline.bowtie.unpaired.map((row: any) => [row.id, row]));
  const unpairedPayloadDrift = unpairedRoster.map((id: string) => {
    const located = byId.get(id);
    const currentHash = sha256(stableJson(located.question, 0));
    const expectedHash = (baselineUnpaired.get(id) as any)?.currentHash;
    return { candidateId: id, expectedHash, currentHash, status: expectedHash === currentHash ? "MATCH" : "DRIFT" };
  });
  const driftedUnpaired = unpairedPayloadDrift.filter((row: any) => row.status !== "MATCH");
  if (driftedUnpaired.length) fail(`§4.2 unpaired payload drift: ${driftedUnpaired.map((row: any) => row.candidateId).join(", ")}`);

  const gpt = banks.get("banks/gpt-canonical.json")!;
  const btFalsification = BT_IDS.map((id) => ({
    candidateId: id,
    presentInWorkingTreeGpt: gpt.questions.filter((q) => q.id === id).length === 1,
    absentFromSuffixRoster: !suffixRoster.includes(id),
    tool: "Node parsed working-tree banks/gpt-canonical.json",
  }));
  if (btFalsification.some((row) => !row.presentInWorkingTreeGpt || !row.absentFromSuffixRoster)) fail("§4.3 _bt_ falsification gate failed");

  const caseIds = derived.located.filter((row: any) => row.question.itemType === "case_study").map((row: any) => row.question.id).sort();
  const siblingHits = unpairedRoster.flatMap((candidateId: string) => {
    const baseId = candidateId.slice(0, -"_bowtie".length);
    return caseIds.flatMap((caseId: string) => {
      const exactHit = caseId === baseId;
      const ordinalHit = caseId.startsWith(`${baseId}_`) && /^\d{2}$/.test(caseId.slice(baseId.length + 1));
      const substringHit = caseId.includes(baseId) || baseId.includes(caseId);
      return exactHit || ordinalHit || substringHit ? [{ candidateId, baseId, caseId, rules: { exact: exactHit, ordinalSuffix: ordinalHit, substringEitherDirection: substringHit } }] : [];
    });
  });
  if (siblingHits.length) fail(`§4.5 sibling-absence gate failed: ${siblingHits.map((row: any) => `${row.candidateId}->${row.caseId}`).join(", ")}`);

  const frozenPaired = readJsonl(PAIRED_ADJUDICATION);
  if (frozenPaired.length !== EXPECTED_PAIRED) fail(`§4.6 frozen paired roster count ${frozenPaired.length}`);
  const pairedPreservation = frozenPaired.map((row: any) => {
    const located = byId.get(row.candidateId);
    const currentHash = located ? sha256(stableJson(located.question, 0)) : null;
    return {
      candidateId: row.candidateId,
      frozenCandidatePayloadSha256: row.candidatePayloadSha256,
      currentCandidatePayloadSha256: currentHash,
      status: currentHash === row.candidatePayloadSha256 ? "MATCH" : "DRIFT",
      preservedPrimaryVerdict: row.phaseF?.primaryVerdict,
    };
  }).sort((a: any, b: any) => a.candidateId.localeCompare(b.candidateId));
  const pairedDrift = pairedPreservation.filter((row: any) => row.status !== "MATCH");
  if (pairedDrift.length) fail(`§4.6 paired-disposition preservation failed: ${pairedDrift.map((row: any) => row.candidateId).join(", ")}`);

  const structural = unpairedRoster.map((id: string) => {
    const question = byId.get(id).question;
    return { candidateId: id, tokenCounts: tokenCounts(question), canonicalKeyCardinality: keyCardinality(question), status: fixedShape(question) ? "PASS" : "FAIL" };
  });
  const structuralFailures = structural.filter((row: any) => row.status !== "PASS");
  if (structuralFailures.length) fail(`§4.4 structural precondition failed: ${structuralFailures.map((row: any) => row.candidateId).join(", ")}`);

  return {
    status: "PASS",
    bankIdentity: identity,
    population: {
      suffixRoster,
      suffixCount: suffixRoster.length,
      pairedRoster,
      pairedCount: pairedRoster.length,
      pairingBreakdown: { EXACT: exact, ORDINAL_SUFFIX: ordinal },
      unpairedRoster,
      unpairedCount: unpairedRoster.length,
      populationDelta,
    },
    unpairedPayloadDrift,
    btFalsification,
    siblingAbsence: { caseStudyIdsExamined: caseIds.length, hits: siblingHits, status: "PASS" },
    pairedPreservation: { matchCount: pairedPreservation.length, requiredCount: EXPECTED_PAIRED, rows: pairedPreservation, status: "PASS" },
    structural,
  };
}

function controlFiles(outputRoot: string): string[] {
  const identity = computeBankIdentity();
  const banks = loadWorkingTreeBanks();
  const evidence = preflightEvidence(banks, identity);
  const derived = derivePopulation(banks as any);
  const byId = locatedById(derived);
  const population: PhaseCPopulationRecord[] = [];
  const control: any[] = [];
  const generated: string[] = [];
  const writeGeneratedText = (path: string, text: string) => {
    writeText(join(outputRoot, path), text);
    generated.push(path);
  };
  const writeGeneratedJson = (path: string, value: unknown) => {
    writeStable(join(outputRoot, path), value);
    generated.push(path);
  };

  evidence.population.unpairedRoster.forEach((candidateId: string, index: number) => {
    const located = byId.get(candidateId);
    const question = located.question;
    const surrogateId = `CAND-${String(index + 1).padStart(2, "0")}`;
    const map = opaqueMap(question);
    const packet1 = stage1Packet(question);
    const packet2 = stage2Packet(question);
    const packet1Text = stableJson(packet1);
    const packet2Text = stableJson(packet2);
    writeGeneratedText(`blind-packets/${surrogateId}-stage1.json`, packet1Text);
    writeGeneratedText(`blind-packets/${surrogateId}-stage2.json`, packet2Text);
    population.push({
      surrogateId,
      candidateId,
      candidateBankPath: located.bankPath,
      candidateJsonPath: `$.questions[${located.index}]`,
      candidateTopLevelIndex: located.index,
      candidateTopLevelOrdinal: located.index + 1,
      companionCaseId: null,
      companionBankPath: null,
      companionJsonPath: null,
      companionTopLevelIndex: null,
      companionTopLevelOrdinal: null,
      pairingRule: null,
      unpairedReason: "NO_ELIGIBLE_SIBLING_CASE",
      bankSchemaVersion: String(located.bank.meta.schemaVersion),
      category: question.category,
      topic: question.topic,
      difficulty: question.difficulty,
      ...(question.ngnSkill ? { ngnSkill: question.ngnSkill } : {}),
      tokenCounts: tokenCounts(question),
      canonicalKeyCardinality: keyCardinality(question),
      candidatePayloadSha256: sha256(stableJson(question, 0)),
      stage1BlindInputSha256: sha256(packet1Text),
      stage2BlindInputSha256: sha256(packet2Text),
      pilot: index < PILOT_COUNT,
    });
    control.push({
      surrogateId,
      candidateId,
      candidateBankPath: located.bankPath,
      candidateTopLevelIndex: located.index,
      companionCaseId: null,
      companionBankPath: null,
      pairingRule: null,
      unpairedReason: "NO_ELIGIBLE_SIBLING_CASE",
      category: question.category,
      topic: question.topic,
      difficulty: question.difficulty,
      ngnSkill: question.ngnSkill ?? null,
      tokenMap: map,
      canonicalSelection: canonicalSelection(question, map),
      candidatePayloadSha256: sha256(stableJson(question, 0)),
    });
  });

  writeGeneratedText("population.jsonl", jsonl(population));
  writeGeneratedText("control-manifest.jsonl", jsonl(control));
  writeGeneratedJson("opening-identity.json", {
    workOrderRawFileByteSha256: WORK_ORDER_SHA256,
    bankReadPath: "working-tree filesystem bytes",
    frozenSpecHelperImports: ["derivePopulation", "stableJson", "sha256"],
    prohibitedEntrypointsInvoked: [],
    dirtyGptBankPreconditionAdaptation: "Allowed and expected under Phase C work order §3.1; frozen spec clean-bank precondition inverted.",
    bankIdentity: identity,
  });
  writeGeneratedJson("preflight.json", evidence);
  const rosterRows = population.map((row) => `| ${row.surrogateId} | \`${row.candidateId}\` | null | null | ${row.unpairedReason} | ${row.pilot ? "pilot" : "scale-up"} |`).join("\n");
  const pairedRows = evidence.population.pairedRoster.map((id: string) => `- \`${id}\``).join("\n");
  writeGeneratedText("population-summary.md", `# Campaign 16 Phase C Population\n\n- Working-tree \`_bowtie\` suffix roster: **${evidence.population.suffixCount}**.\n- Paired complement: **${evidence.population.pairedCount}** (**${evidence.population.pairingBreakdown.EXACT} EXACT**, **${evidence.population.pairingBreakdown.ORDINAL_SUFFIX} ORDINAL_SUFFIX**).\n- Live unpaired Phase C population: **${evidence.population.unpairedCount}**.\n- Phase A roster delta: additions **0**, removals **0**.\n- Fixed shape: **19/19** at 3/4/4 tokens and 1/2/2 key cardinality.\n- Pilot: first **4** rows in ascending real candidate-ID order.\n\n## Required nullable schema adaptation\n\nEvery Phase C manifest row carries \`companionCaseId\`, \`companionBankPath\`, companion JSON path/index/ordinal, and \`pairingRule\` explicitly as \`null\`, plus \`unpairedReason: \"NO_ELIGIBLE_SIBLING_CASE\"\`. The TypeScript manifest type encodes those fields as nullable literals; no cast or invented pairing enum is used.\n\n## Live unpaired population\n\n| Surrogate | Candidate | Companion | Pairing rule | Reason | Lane |\n|---|---|---|---|---|---|\n${rosterRows}\n\n## Paired complement\n\n${pairedRows}\n`);
  writeGeneratedJson("generated-control-files.json", [...generated, "generated-control-files.json"].sort());
  return generated.sort();
}

function populationRows(): PhaseCPopulationRecord[] {
  return readJsonl(join(ARTIFACT_ROOT, "population.jsonl")) as PhaseCPopulationRecord[];
}

function populationRow(id: string): PhaseCPopulationRecord {
  const row = populationRows().find((item) => item.surrogateId === id);
  if (!row) fail(`Unknown surrogate ${id}`);
  return row;
}

function controlRows(): any[] {
  return readJsonl(join(ARTIFACT_ROOT, "control-manifest.jsonl"));
}

function controlRow(id: string): any {
  const row = controlRows().find((item) => item.surrogateId === id);
  if (!row) fail(`Unknown control surrogate ${id}`);
  return row;
}

function blindPacket(id: string, stage: 1 | 2): any {
  return readJson(join(ARTIFACT_ROOT, "blind-packets", `${id}-stage${stage}.json`));
}

function reviewPath(id: string, kind: string): string {
  if (kind === "stage1" || kind === "stage2") return join(ARTIFACT_ROOT, "blind-reviews", `${id}-${kind}.json`);
  if (kind === "phase-e") return join(ARTIFACT_ROOT, "phase-e", `${id}.json`);
  if (kind === "phase-f") return join(ARTIFACT_ROOT, "phase-f", `${id}.json`);
  fail(`Unknown review kind ${kind}`);
}

function lockPath(id: string, kind: string): string {
  return join(ARTIFACT_ROOT, "locks", `${id}-${kind}.json`);
}

function exactLabels(values: unknown, allowed: string[], count: number, field: string): void {
  if (!Array.isArray(values) || values.length !== count || new Set(values).size !== count || values.some((value) => typeof value !== "string" || !allowed.includes(value))) fail(`Invalid ${field}`);
}

export function validateStage1(value: any): void {
  if (!isObject(value) || typeof value.condition !== "string") fail("Invalid Stage-1 condition");
  exactStringArray(value.priorityActions, 2, "priorityActions");
  exactStringArray(value.evaluationParameters, 2, "evaluationParameters");
  if (!Array.isArray(value.stemEvidence) || !Array.isArray(value.missingInformation) || !["high", "medium", "low"].includes(value.stage1Confidence) || typeof value.reasoning !== "string") fail("Invalid Stage-1 review shape");
}

function exactStringArray(value: unknown, count: number, field: string): void {
  if (!Array.isArray(value) || value.length !== count || value.some((item) => typeof item !== "string")) fail(`Invalid ${field}`);
}

export function validateStage2(value: any): void {
  if (!isObject(value) || !["C1", "C2", "C3"].includes(value.conditionLabel)) fail("Invalid Stage-2 conditionLabel");
  exactLabels(value.actionLabels, ["A1", "A2", "A3", "A4"], 2, "actionLabels");
  exactLabels(value.parameterLabels, ["P1", "P2", "P3", "P4"], 2, "parameterLabels");
  if (!Array.isArray(value.selectionEvidence) || value.selectionEvidence.length !== 5 || !Array.isArray(value.ambiguousAlternatives) || !Array.isArray(value.missingInformation) || !["ANSWERABLE", "UNDERDETERMINED", "NOT_ANSWERABLE"].includes(value.poolAnswerability) || !["high", "medium", "low"].includes(value.stage2Confidence) || typeof value.reasoning !== "string") fail("Invalid Stage-2 review shape");
  if (!Array.isArray(value.tokenPremiseTable) || value.tokenPremiseTable.length !== 11) fail("Stage-2 tokenPremiseTable must contain exactly 11 rows");
  const labels = value.tokenPremiseTable.map((row: any) => row.opaqueTokenLabel).sort();
  if (labels.join("|") !== [...ALL_LABELS].sort().join("|")) fail("Stage-2 premise labels incomplete or duplicated");
  for (const row of value.tokenPremiseTable) {
    if (!PREMISE_STATUSES.has(row.premiseStatus) || !["NONE", "LOW", "MATERIAL"].includes(row.rankabilityImpact) || typeof row.supportingStemText !== "string" || typeof row.missingPremise !== "string" || typeof row.rankabilityJustification !== "string") fail(`Invalid premise row ${row.opaqueTokenLabel}`);
  }
}

export function validatePhaseE(value: any, id?: string): void {
  if (!isObject(value) || !isObject(value.canonicalSelection) || typeof value.blindExactMatch !== "boolean" || !["FULL", "PARTIAL", "NONE"].includes(value.stage1Alignment) || typeof value.stage1AlignmentExplanation !== "string" || typeof value.canonicalSetUniquelyDefensible !== "boolean" || typeof value.canonicalSetExplanation !== "string" || typeof value.anyCanonicalTargetDependsOnAbsentFact !== "boolean" || typeof value.unstatedClientFactMateriallyChangesRankability !== "boolean" || !Array.isArray(value.canonicalTargetSupport) || value.canonicalTargetSupport.length !== 5 || !Array.isArray(value.distractorPremiseFindings) || value.distractorPremiseFindings.length !== 6 || !Array.isArray(value.missingClientFacts)) fail("Invalid Phase-E review shape");
  if (id && stableJson(value.canonicalSelection, 0) !== stableJson(controlRow(id).canonicalSelection, 0)) fail(`Phase-E canonical selection mismatch for ${id}`);
  const keyed = [value.canonicalSelection.conditionLabel, ...value.canonicalSelection.actionLabels, ...value.canonicalSelection.parameterLabels].sort();
  if (value.canonicalTargetSupport.map((row: any) => row.opaqueTokenLabel).sort().join("|") !== keyed.join("|")) fail("Phase-E keyed support labels invalid");
  const distractors = ALL_LABELS.filter((label) => !keyed.includes(label)).sort();
  if (value.distractorPremiseFindings.map((row: any) => row.opaqueTokenLabel).sort().join("|") !== distractors.join("|")) fail("Phase-E distractor labels invalid");
  if (value.canonicalTargetSupport.some((row: any) => !SUPPORT_CLASSES.has(row.supportClassification) || typeof row.supportingStandaloneEvidence !== "string" || typeof row.missingClientFact !== "string")) fail("Phase-E support row invalid");
}

export function validatePhaseF(value: any, allowHiddenForSchemaTest = false): void {
  if (!isObject(value) || !VERDICTS.has(value.primaryVerdict) || !Array.isArray(value.secondaryFlags) || !Array.isArray(value.missingFactProvenance) || ![null, "P0", "P1", "P2", "P3"].includes(value.advisoryPriority) || typeof value.defectSummary !== "string" || !Array.isArray(value.bilingualCollateral) || !Array.isArray(value.clinicalCollateral) || !Array.isArray(value.scopeCollateral) || typeof value.reasoning !== "string") fail("Invalid Phase-F review shape");
  if (!allowHiddenForSchemaTest && (value.primaryVerdict === "FAIL_HIDDEN_CASE_DEPENDENCY" || value.secondaryFlags.includes("SIBLING_CASE_IMPORTED"))) fail("§5.2 unreachable hidden-case result is a population-derivation blocker");
  for (const row of value.missingFactProvenance) {
    if (!PROVENANCE.has(row.provenance) || typeof row.opaqueTokenLabel !== "string" || typeof row.missingFact !== "string" || typeof row.sourceEvidence !== "string" || !Array.isArray(row.checkedSurfaces) || typeof row.necessaryForRankability !== "boolean") fail("Invalid bounded-provenance row");
  }
}

function ingest(kind: string, id: string, encoded: string): void {
  populationRow(id);
  if (existsSync(lockPath(id, kind))) fail(`Cannot overwrite locked ${kind} for ${id}`);
  const value = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
  if (kind === "stage1") validateStage1(value);
  else if (kind === "stage2") validateStage2(value);
  else if (kind === "phase-e") validatePhaseE(value, id);
  else if (kind === "phase-f") validatePhaseF(value);
  else fail(`Unsupported ingest kind ${kind}`);
  writeStable(reviewPath(id, kind), value);
}

function requireLock(id: string, kind: string): any {
  const path = lockPath(id, kind);
  if (!existsSync(path)) fail(`Missing ${kind} lock for ${id}`);
  const lock = readJson(path);
  const observed = fileSha(reviewPath(id, kind));
  if (observed !== lock.sha256) fail(`${kind} review changed after lock for ${id}`);
  return lock;
}

function lock(kind: string, id: string): void {
  populationRow(id);
  if (existsSync(lockPath(id, kind))) fail(`Existing ${kind} lock for ${id}`);
  if (kind === "stage2") requireLock(id, "stage1");
  if (kind === "phase-e") requireLock(id, "stage2");
  if (kind === "phase-f") requireLock(id, "phase-e");
  const value = readJson(reviewPath(id, kind));
  if (kind === "stage1") validateStage1(value);
  else if (kind === "stage2") validateStage2(value);
  else if (kind === "phase-e") validatePhaseE(value, id);
  else if (kind === "phase-f") validatePhaseF(value);
  else fail(`Unsupported lock kind ${kind}`);
  writeStable(lockPath(id, kind), {
    artifact: relative(REPO_ROOT, reviewPath(id, kind)),
    sha256: fileSha(reviewPath(id, kind)),
    lockedAfterSha256: kind === "stage1" ? null : kind === "stage2" ? requireLock(id, "stage1").sha256 : kind === "phase-e" ? requireLock(id, "stage2").sha256 : requireLock(id, "phase-e").sha256,
  });
}

function contexts(): any[] {
  const path = join(ARTIFACT_ROOT, "semantic-contexts.jsonl");
  return existsSync(path) ? readJsonl(path) : [];
}

function recordContext(id: string, agentContextId: string): void {
  populationRow(id);
  const rows = contexts();
  if (rows.some((row) => row.controlId === id)) fail(`Context already registered for ${id}`);
  if (rows.some((row) => row.agentContextId === agentContextId)) fail(`Semantic context reused: ${agentContextId}`);
  rows.push({
    controlId: id,
    agentContextId,
    model: "gpt-5.6-sol",
    reasoningEffort: "high",
    isolatedCandidateContext: true,
    sequentialStageCount: 2,
    sharedWithOtherCandidates: false,
    reviewerRepositoryAccessPermitted: false,
  });
  writeText(join(ARTIFACT_ROOT, "semantic-contexts.jsonl"), jsonl(rows.sort((a, b) => a.controlId.localeCompare(b.controlId))));
}

function loadCandidate(id: string): JsonObject {
  const row = populationRow(id);
  const bank = readJson(join(REPO_ROOT, row.candidateBankPath)) as Bank;
  const candidate = bank.questions.find((question) => question.id === row.candidateId);
  if (!candidate || sha256(stableJson(candidate, 0)) !== row.candidatePayloadSha256) fail(`Candidate payload changed for ${id}`);
  return candidate;
}

function standaloneProjection(id: string): JsonObject {
  const question = loadCandidate(id);
  const control = controlRow(id);
  const map = control.tokenMap;
  const zone = (name: "condition" | "actions" | "parameters") => ({
    ...(question.bowtie[name].prompt ? { prompt: question.bowtie[name].prompt } : {}),
    tokens: question.bowtie[name].tokens.map((token: any) => ({ opaqueTokenLabel: map[name][token.id], en: token.en, zh: token.zh })),
  });
  return {
    stem: question.stem,
    bowtie: { condition: zone("condition"), actions: zone("actions"), parameters: zone("parameters") },
    rationale: {
      correct: question.rationale?.correct,
      byChoice: (question.rationale?.byChoice ?? []).map((row: any) => ({ opaqueTokenLabel: map.condition[row.refId] ?? map.actions[row.refId] ?? map.parameters[row.refId], en: row.en, zh: row.zh })),
    },
    testTakingStrategy: question.testTakingStrategy,
    glossary: question.glossary ?? [],
  };
}

function projectPhaseE(id: string): void {
  requireLock(id, "stage1");
  requireLock(id, "stage2");
  assertOpeningBankIdentity();
  writeStable(join(ARTIFACT_ROOT, "phase-e-packets", `${id}.json`), {
    instruction: "Treat both blind reviews as immutable. Compare them with the now-revealed canonical selection and complete standalone item. Do not inspect or infer any sibling or corpus material. Return the required standalone-adjudication record.",
    stage1Sha256: requireLock(id, "stage1").sha256,
    stage2Sha256: requireLock(id, "stage2").sha256,
    stage1: readJson(reviewPath(id, "stage1")),
    stage2: readJson(reviewPath(id, "stage2")),
    canonicalSelection: controlRow(id).canonicalSelection,
    standaloneItem: standaloneProjection(id),
  });
}

function projectPhaseF(id: string): void {
  requireLock(id, "phase-e");
  assertOpeningBankIdentity();
  writeStable(join(ARTIFACT_ROOT, "phase-f-packets", `${id}.json`), {
    instruction: "The Phase-E standalone adjudication is immutable. For each MISSING_CLIENT_FACT inspect only this candidate's own rationale/byChoice, strategy, glossary, Chinese counterpart, and any explicitly identified historical source that actually exists. Do not search the corpus. Classify bounded provenance, apply fixed verdict precedence, and record narrow bilingual/clinical/scope findings. FAIL_HIDDEN_CASE_DEPENDENCY and SIBLING_CASE_IMPORTED are unreachable and are blockers, not verdicts.",
    phaseESha256: requireLock(id, "phase-e").sha256,
    phaseE: readJson(reviewPath(id, "phase-e")),
    candidateSurfaces: standaloneProjection(id),
    explicitlyLinkedHistoricalSources: [],
  });
}

function verifyPacketShape(packet: any, stage: 1 | 2): void {
  const allowed = stage === 1 ? ["instruction", "stem"] : ["instruction", "prompts", "stem", "tokens"];
  const extra = Object.keys(packet).filter((key) => !allowed.includes(key));
  if (extra.length) fail(`Stage-${stage} forbidden fields: ${extra.join(", ")}`);
  if (stage === 1 && Object.keys(packet).sort().join("|") !== ["instruction", "stem"].sort().join("|")) fail("Stage-1 projection shape mismatch");
  if (stage === 2) {
    if (!isObject(packet.tokens) || packet.tokens.condition.length !== 3 || packet.tokens.actions.length !== 4 || packet.tokens.parameters.length !== 4) fail("Stage-2 token projection shape mismatch");
    const labels = [...packet.tokens.condition, ...packet.tokens.actions, ...packet.tokens.parameters].map((row: any) => row.label).sort();
    if (labels.join("|") !== [...ALL_LABELS].sort().join("|")) fail("Stage-2 neutral labels invalid");
  }
}

function verifyLeakage(): void {
  for (const row of populationRows()) {
    const control = controlRow(row.surrogateId);
    const packets = [blindPacket(row.surrogateId, 1), blindPacket(row.surrogateId, 2)];
    verifyPacketShape(packets[0], 1);
    verifyPacketShape(packets[1], 2);
    const exactForbidden = [
      row.candidateId,
      row.surrogateId,
      row.candidateBankPath,
      row.candidateJsonPath,
      ...Object.keys(control.tokenMap.condition),
      ...Object.keys(control.tokenMap.actions),
      ...Object.keys(control.tokenMap.parameters),
    ];
    for (const [index, packet] of packets.entries()) {
      const serialized = stableJson(packet, 0);
      for (const forbidden of exactForbidden) if (forbidden && serialized.includes(forbidden)) fail(`Stage-${index + 1} exact-value leakage for ${row.surrogateId}: ${forbidden}`);
      for (const forbiddenKey of ["candidateId", "surrogateId", "bank", "ordinal", "producer", "category", "topic", "difficulty", "ngnSkill", "pilot", "control", "hash", "pairingRule", "correct", "rationale", "testTakingStrategy", "glossary", "zh", "companion", "provenance", "refId"]) {
        if (Object.keys(packet).includes(forbiddenKey)) fail(`Stage-${index + 1} forbidden top-level key ${forbiddenKey}`);
      }
    }
  }
}

function verifyRepeat(): void {
  const temp = mkdtempSync(join(tmpdir(), "campaign16-phase-c-repeat-"));
  try {
    controlFiles(temp);
    const expected = readJson(join(ARTIFACT_ROOT, "generated-control-files.json")) as string[];
    for (const path of expected.filter((path) => path !== "generated-control-files.json")) {
      if (!readFileSync(join(ARTIFACT_ROOT, path)).equals(readFileSync(join(temp, path)))) fail(`Deterministic repeat mismatch: ${path}`);
    }
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

function verifyGenerated(): void {
  assertOpeningBankIdentity();
  verifyLeakage();
  verifyRepeat();
  console.log("PASS: Phase C controls/packets deterministic; 19 nullable-companion rows; exact leakage checks passed; bank snapshot unchanged.");
}

function verifyPilot(): void {
  const pilot = populationRows().filter((row) => row.pilot);
  if (pilot.length !== PILOT_COUNT || pilot.map((row) => row.surrogateId).join("|") !== "CAND-01|CAND-02|CAND-03|CAND-04") fail("Adapted pilot roster invalid");
  const registered = contexts().filter((row) => pilot.some((item) => item.surrogateId === row.controlId));
  if (registered.length !== PILOT_COUNT || new Set(registered.map((row) => row.agentContextId)).size !== PILOT_COUNT || registered.some((row) => row.model !== "gpt-5.6-sol" || row.reasoningEffort !== "high" || !row.isolatedCandidateContext || row.sequentialStageCount !== 2 || row.sharedWithOtherCandidates || row.reviewerRepositoryAccessPermitted)) fail("Adapted pilot context proof failed");
  for (const row of pilot) {
    requireLock(row.surrogateId, "stage1");
    requireLock(row.surrogateId, "stage2");
    validateStage2(readJson(reviewPath(row.surrogateId, "stage2")));
  }
  verifyGenerated();
  console.log("PASS: adapted four-row harness pilot; four unique Sol/high contexts; Stage-1→Stage-2 locks; 11-row premise tables; fixed schema and no-leak/determinism gates passed.");
}

function scaleUpRecheck(): void {
  assertOpeningBankIdentity();
  const opening = readJson(join(ARTIFACT_ROOT, "opening-identity.json"));
  writeStable(join(ARTIFACT_ROOT, "scale-up-bank-recheck.json"), {
    checkedImmediatelyBeforeFirstScaleUpDispatch: true,
    openingIdentitySha256: fileSha(join(ARTIFACT_ROOT, "opening-identity.json")),
    bankSha256: Object.fromEntries(opening.bankIdentity.rows.map((row: any) => [row.bankPath, row.observed])),
    exactMatch: true,
  });
  console.log("PASS: all 13 working-tree bank byte hashes exactly match the Phase C opening snapshot immediately before scale-up.");
}

function verifyAllSemantic(): void {
  const population = populationRows();
  const registered = contexts();
  if (population.length !== EXPECTED_UNPAIRED || registered.length !== EXPECTED_UNPAIRED || new Set(registered.map((row) => row.agentContextId)).size !== EXPECTED_UNPAIRED) fail("19-context accounting failed");
  for (const row of population) {
    requireLock(row.surrogateId, "stage1");
    requireLock(row.surrogateId, "stage2");
    validateStage1(readJson(reviewPath(row.surrogateId, "stage1")));
    validateStage2(readJson(reviewPath(row.surrogateId, "stage2")));
  }
  const recheck = readJson(join(ARTIFACT_ROOT, "scale-up-bank-recheck.json"));
  if (recheck.exactMatch !== true || recheck.checkedImmediatelyBeforeFirstScaleUpDispatch !== true) fail("Scale-up bank recheck evidence missing");
  assertOpeningBankIdentity();
  console.log("PASS: 19/19 candidates have unique isolated Sol/high contexts and immutable two-stage reviews (38 semantic turns total).");
}

function writeBlocked(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  writeStable(join(ARTIFACT_ROOT, "blocked-evidence.json"), { terminalStatus: "CAMPAIGN16_PHASE_C_BLOCKED", failedGate: message });
}

function commandMain(args: string[]): void {
  const [command, id, encoded] = args;
  if (command === "generate") {
    controlFiles(ARTIFACT_ROOT);
    console.log("PASS: identity, population, drift, _bt_, sibling-absence, paired-preservation, shape, manifest, and packet generation gates.");
  } else if (command === "verify-generated") verifyGenerated();
  else if (command === "ingest-stage1") ingest("stage1", id, encoded);
  else if (command === "lock-stage1") lock("stage1", id);
  else if (command === "ingest-stage2") ingest("stage2", id, encoded);
  else if (command === "lock-stage2") lock("stage2", id);
  else if (command === "record-context") recordContext(id, encoded);
  else if (command === "verify-pilot") verifyPilot();
  else if (command === "scale-up-recheck") scaleUpRecheck();
  else if (command === "verify-all-semantic") verifyAllSemantic();
  else if (command === "project-phase-e") projectPhaseE(id);
  else if (command === "ingest-phase-e") ingest("phase-e", id, encoded);
  else if (command === "lock-phase-e") lock("phase-e", id);
  else if (command === "project-phase-f") projectPhaseF(id);
  else if (command === "ingest-phase-f") ingest("phase-f", id, encoded);
  else if (command === "lock-phase-f") lock("phase-f", id);
  else fail(`Unknown command ${command}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    commandMain(process.argv.slice(2));
  } catch (error) {
    writeBlocked(error);
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
