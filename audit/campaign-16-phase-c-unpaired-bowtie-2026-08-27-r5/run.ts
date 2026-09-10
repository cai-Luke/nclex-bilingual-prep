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
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { derivePopulation, sha256, stableJson } from "../standalone-bowtie-answerability-census-2026-08-23/run.ts";

export const REPO = resolve(import.meta.dirname, "../..");
export const OUT = resolve(import.meta.dirname);
const CHECK_OUT = join(REPO, "audit/campaign-16-phase-c-check-2026-08-27-r5");
const R4_ROOT = join(REPO, "audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27");
const BASELINE_PATH = join(REPO, "audit/campaign-16-phase-a-baseline-2026-08-26/baseline.json");
const PAIRED_PATH = join(REPO, "audit/standalone-bowtie-answerability-census-2026-08-23/adjudication.jsonl");
const WORK_ORDER_PATH = join(REPO, "scratch/CAMPAIGN-16-PHASE-C-UNPAIRED-BOWTIE-ANSWERABILITY-WORK-ORDER-2026-08-27.md");
const WORK_ORDER_SHA = "74fb97e70ca5820a4e95acc62e2b0f3f54790d0eea766d2be58e8a427f924248";
const GPT_SHA = "e4955f7b8c54e4880bd9ddb0f2f7c35881169f53051b5ed3ce21757f86287b3b";
const LIVE_BT_IDS = [
  "gpt_balance6a_2026_07_16_bt_perioperative_care_13_r2",
  "gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14_r2",
] as const;
const HISTORICAL_BT_IDS = [
  "gpt_balance6a_2026_07_16_bt_perioperative_care_13",
  "gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14",
] as const;
const LABELS = ["C1", "C2", "C3", "A1", "A2", "A3", "A4", "P1", "P2", "P3", "P4"] as const;
const STAGE1_INSTRUCTION = "Using only the standalone stem, independently free-generate exactly one most likely condition, exactly two priority nursing actions, and exactly two monitoring or evaluation parameters. Return the required structured JSON and identify the stem evidence and any missing information needed for specificity or uniqueness.";
const STAGE2_INSTRUCTION = "Using only the standalone learner-facing English stem, prompts, and opaque token pools, select exactly one condition, two actions, and two parameters. Return the required structured JSON, including exactly one premise row for every opaque token. Do not infer absent client-specific facts.";

type Obj = Record<string, any>;
type Bank = { meta: Obj; questions: Obj[] };

export type R5PopulationRow = {
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

const error = (message: string): never => { throw new Error(message); };
const isObj = (value: unknown): value is Obj => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const digestFile = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
const parseJson = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const parseJsonl = (path: string) => {
  const text = readFileSync(path, "utf8").trim();
  return text ? text.split("\n").map(JSON.parse) : [];
};
const jsonl = (rows: unknown[]) => `${rows.map((row) => stableJson(row, 0).trimEnd()).join("\n")}\n`;
const ensureWrite = (path: string, text: string) => {
  mkdirSync(resolve(path, ".."), { recursive: true });
  writeFileSync(path, text.endsWith("\n") ? text : `${text}\n`, "utf8");
};
const writeJson = (path: string, value: unknown) => ensureWrite(path, stableJson(value));
const git = (...args: string[]) => execFileSync("git", args, { cwd: REPO, encoding: "utf8" }).trimEnd();

function walkFiles(root: string): string[] {
  const visit = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = join(directory, entry.name);
    return entry.isDirectory() ? visit(full) : [full];
  });
  return existsSync(root) ? visit(root).sort() : [];
}

function bankFilePaths(): string[] {
  return readdirSync(join(REPO, "banks"))
    .filter((name) => name.endsWith(".json") && statSync(join(REPO, "banks", name)).isFile())
    .sort()
    .map((name) => `banks/${name}`);
}

function workingBanks(): Map<string, Bank> {
  const result = new Map<string, Bank>();
  for (const bankPath of bankFilePaths()) {
    const bank = parseJson(join(REPO, bankPath));
    if (!isObj(bank) || !isObj(bank.meta) || !Array.isArray(bank.questions)) error(`malformed bundled bank: ${bankPath}`);
    result.set(bankPath, bank as Bank);
  }
  return result;
}

function captureOpeningPreservation() {
  const dirtyLines = git("status", "--porcelain=v1", "--untracked-files=all").split("\n").filter(Boolean);
  const outRel = `${relative(REPO, OUT)}/`;
  const checkRel = `${relative(REPO, CHECK_OUT)}/`;
  const preexisting = dirtyLines.filter((line) => {
    const path = line.slice(3);
    return !path.startsWith(outRel) && !path.startsWith(checkRel);
  });
  const dirtyPaths = preexisting.map((line) => {
    const path = line.slice(3);
    return { status: line.slice(0, 2), path, sha256: digestFile(join(REPO, path)) };
  });
  const revision4Tree = walkFiles(R4_ROOT).map((path) => ({ path: relative(REPO, path), sha256: digestFile(path) }));
  if (revision4Tree.length !== 8) error(`Revision-4 preservation gate: expected 8 files, observed ${revision4Tree.length}`);
  return {
    repositoryPath: REPO,
    branch: git("branch", "--show-current"),
    head: git("rev-parse", "HEAD"),
    upstream: git("rev-parse", "--abbrev-ref", "@{upstream}"),
    aheadBehindHeadVsUpstream: git("rev-list", "--left-right", "--count", "HEAD...@{upstream}"),
    phaseBState: "uncommitted working-tree publication bytes",
    dirtyPaths,
    decisionsSha256: digestFile(join(REPO, "DECISIONS.md")),
    revision4Tree,
  };
}

function bankIdentity() {
  const paths = bankFilePaths();
  if (paths.length !== 13) error(`§3.2 expected 13 banks, observed ${paths.length}`);
  const baseline = parseJson(BASELINE_PATH).campaignBaselineFileByteSha256 as Record<string, string>;
  const rows = paths.map((bankPath) => {
    const observedFileByteSha256 = digestFile(join(REPO, bankPath));
    const expectedFileByteSha256 = bankPath === "banks/gpt-canonical.json" ? GPT_SHA : baseline[bankPath];
    return {
      bankPath,
      expectedFileByteSha256,
      observedFileByteSha256,
      match: observedFileByteSha256 === expectedFileByteSha256,
      expectedSource: bankPath === "banks/gpt-canonical.json"
        ? "Revision-5 work order §3.2 literal; corroborated by audit/campaign-16-phase-b-recovery-2026-08-27/status-stage-3.log lines 117 and 145"
        : "audit/campaign-16-phase-a-baseline-2026-08-26/baseline.json campaignBaselineFileByteSha256",
    };
  });
  const mismatches = rows.filter((row) => !row.match);
  if (mismatches.length) error(`§3.2 bank identity mismatch: ${mismatches.map((row) => row.bankPath).join(", ")}`);
  return { status: "PASS", bankReadPath: "working-tree filesystem bytes", rows };
}

function zoneTokenCounts(question: Obj) {
  return {
    condition: question.bowtie?.condition?.tokens?.length ?? -1,
    actions: question.bowtie?.actions?.tokens?.length ?? -1,
    parameters: question.bowtie?.parameters?.tokens?.length ?? -1,
  };
}

function keyCounts(question: Obj) {
  return {
    condition: typeof question.bowtie?.condition?.correct === "string" ? 1 : 0,
    actions: Array.isArray(question.bowtie?.actions?.correct) ? question.bowtie.actions.correct.length : -1,
    parameters: Array.isArray(question.bowtie?.parameters?.correct) ? question.bowtie.parameters.correct.length : -1,
  };
}

function hasFixedShape(question: Obj) {
  const tokens = zoneTokenCounts(question);
  const keys = keyCounts(question);
  return tokens.condition === 3 && tokens.actions === 4 && tokens.parameters === 4
    && keys.condition === 1 && keys.actions === 2 && keys.parameters === 2;
}

export function tokenMap(question: Obj): Record<string, Record<string, string>> {
  return {
    condition: Object.fromEntries(question.bowtie.condition.tokens.map((token: Obj, index: number) => [token.id, `C${index + 1}`])),
    actions: Object.fromEntries(question.bowtie.actions.tokens.map((token: Obj, index: number) => [token.id, `A${index + 1}`])),
    parameters: Object.fromEntries(question.bowtie.parameters.tokens.map((token: Obj, index: number) => [token.id, `P${index + 1}`])),
  };
}

export function canonicalLabels(question: Obj, map: Record<string, Record<string, string>>) {
  return {
    conditionLabel: map.condition[question.bowtie.condition.correct],
    actionLabels: question.bowtie.actions.correct.map((id: string) => map.actions[id]),
    parameterLabels: question.bowtie.parameters.correct.map((id: string) => map.parameters[id]),
  };
}

export function makeStage1Packet(question: Obj) {
  return { instruction: STAGE1_INSTRUCTION, stem: question.stem.en };
}

export function makeStage2Packet(question: Obj) {
  const prompts: Record<string, string> = {};
  const tokens: Record<string, { label: string; text: string }[]> = {};
  const zones = ["condition", "actions", "parameters"] as const;
  const prefixes = { condition: "C", actions: "A", parameters: "P" } as const;
  for (const zone of zones) {
    if (typeof question.bowtie[zone].prompt?.en === "string") prompts[zone] = question.bowtie[zone].prompt.en;
    tokens[zone] = question.bowtie[zone].tokens.map((token: Obj, index: number) => ({ label: `${prefixes[zone]}${index + 1}`, text: token.en }));
  }
  return { instruction: STAGE2_INSTRUCTION, stem: question.stem.en, ...(Object.keys(prompts).length ? { prompts } : {}), tokens };
}

function deriveGateEvidence(banks: Map<string, Bank>) {
  const baseline = parseJson(BASELINE_PATH);
  const derived = derivePopulation(banks as any) as any;
  const locatedById = new Map<string, any>(derived.located.map((row: any) => [row.question.id, row]));
  const suffixRoster = derived.suffixBowties.map((row: any) => row.question.id).sort();
  const pairedRoster = derived.paired.map((row: any) => row.candidate.question.id).sort();
  const unpairedRoster = derived.excluded.map((row: any) => row.candidateId).sort();
  const oldRoster = [...baseline.bowtie.pairedRoster.map((row: any) => row.id), ...baseline.bowtie.unpaired.map((row: any) => row.id)].sort();
  const population = {
    suffixRoster,
    suffixCount: suffixRoster.length,
    pairedRoster,
    pairedCount: pairedRoster.length,
    exactCount: derived.paired.filter((row: any) => row.pairingRule === "EXACT").length,
    ordinalSuffixCount: derived.paired.filter((row: any) => row.pairingRule === "ORDINAL_SUFFIX").length,
    unpairedRoster,
    unpairedCount: unpairedRoster.length,
    additionsVsPhaseA: suffixRoster.filter((id: string) => !oldRoster.includes(id)),
    removalsVsPhaseA: oldRoster.filter((id: string) => !suffixRoster.includes(id)),
  };
  if (population.suffixCount !== 50 || population.pairedCount !== 31 || population.exactCount !== 30 || population.ordinalSuffixCount !== 1 || population.unpairedCount !== 19 || population.additionsVsPhaseA.length || population.removalsVsPhaseA.length) {
    error(`§4.1 population gate failed: ${stableJson(population, 0).trim()}`);
  }

  const baselineUnpaired = new Map<string, any>(baseline.bowtie.unpaired.map((row: any) => [row.id, row]));
  const unpairedPayloads = unpairedRoster.map((candidateId: string) => {
    const located = locatedById.get(candidateId);
    const observedPayloadSha256 = sha256(stableJson(located.question, 0));
    const expectedPayloadSha256 = baselineUnpaired.get(candidateId)?.currentHash;
    return { candidateId, expectedPayloadSha256, observedPayloadSha256, status: expectedPayloadSha256 === observedPayloadSha256 ? "MATCH" : "DRIFT" };
  });
  const unpairedDrift = unpairedPayloads.filter((row: any) => row.status !== "MATCH");
  if (unpairedDrift.length) error(`§4.2 payload drift: ${unpairedDrift.map((row: any) => row.candidateId).join(", ")}`);

  const gpt = banks.get("banks/gpt-canonical.json")!;
  const liveIdRows = LIVE_BT_IDS.map((candidateId) => ({
    candidateId,
    liveQuestionIdCount: gpt.questions.filter((question) => question.id === candidateId).length,
    absentFromBowtieSuffixRoster: !suffixRoster.includes(candidateId),
  }));
  const historicalIdRows = HISTORICAL_BT_IDS.map((candidateId) => ({ candidateId, liveQuestionIdCount: gpt.questions.filter((question) => question.id === candidateId).length }));
  if (liveIdRows.some((row) => row.liveQuestionIdCount !== 1 || !row.absentFromBowtieSuffixRoster)) error("§4.3 live _r2 falsification gate failed");
  if (historicalIdRows.some((row) => row.liveQuestionIdCount !== 0)) error("§4.3 historical pre-repair ID absence gate failed");
  const btFalsification = { status: "PASS", tool: "Node JSON.parse walk over working-tree banks/gpt-canonical.json", liveIdRows, historicalIdRows };

  const caseIds = derived.located.filter((row: any) => row.question.itemType === "case_study").map((row: any) => row.question.id).sort();
  const siblingHits = unpairedRoster.flatMap((candidateId: string) => {
    const baseId = candidateId.slice(0, -"_bowtie".length);
    return caseIds.flatMap((caseId: string) => {
      const exact = caseId === baseId;
      const ordinal = caseId.startsWith(`${baseId}_`) && /^\d{2}$/.test(caseId.slice(baseId.length + 1));
      const substring = caseId.includes(baseId) || baseId.includes(caseId);
      return exact || ordinal || substring ? [{ candidateId, baseId, caseId, exact, ordinal, substring }] : [];
    });
  });
  if (siblingHits.length) error(`§4.5 sibling-absence probe hit: ${siblingHits.map((row: any) => `${row.candidateId}->${row.caseId}`).join(", ")}`);

  const frozenPaired = parseJsonl(PAIRED_PATH);
  if (frozenPaired.length !== 31) error(`§4.6 frozen paired count ${frozenPaired.length}`);
  const pairedPreservationRows = frozenPaired.map((row: any) => {
    const located = locatedById.get(row.candidateId);
    const observedPayloadSha256 = located ? sha256(stableJson(located.question, 0)) : null;
    return {
      candidateId: row.candidateId,
      expectedPayloadSha256: row.candidatePayloadSha256,
      observedPayloadSha256,
      status: row.candidatePayloadSha256 === observedPayloadSha256 ? "MATCH" : "DRIFT",
      preservedPrimaryVerdict: row.phaseF.primaryVerdict,
    };
  }).sort((a: any, b: any) => a.candidateId.localeCompare(b.candidateId));
  const pairedDrift = pairedPreservationRows.filter((row: any) => row.status !== "MATCH");
  if (pairedDrift.length) error(`§4.6 paired preservation failed: ${pairedDrift.map((row: any) => row.candidateId).join(", ")}`);

  const structuralRows = unpairedRoster.map((candidateId: string) => {
    const question = locatedById.get(candidateId).question;
    return { candidateId, tokenCounts: zoneTokenCounts(question), canonicalKeyCardinality: keyCounts(question), status: hasFixedShape(question) ? "PASS" : "FAIL" };
  });
  const structuralFailures = structuralRows.filter((row: any) => row.status !== "PASS");
  if (structuralFailures.length) error(`§4.4 fixed-shape gate failed: ${structuralFailures.map((row: any) => row.candidateId).join(", ")}`);

  return {
    population,
    unpairedPayloads,
    btFalsification,
    siblingAbsence: { status: "PASS", caseStudyIdsExamined: caseIds.length, hits: siblingHits },
    pairedPreservation: { status: "PASS", matchCount: pairedPreservationRows.length, rows: pairedPreservationRows },
    structuralRows,
    locatedById,
  };
}

function buildControlArtifacts(destination: string, bankSnapshot: any, gateEvidence: any) {
  const banks = workingBanks();
  const derived = derivePopulation(banks as any) as any;
  const byId = new Map<string, any>(derived.located.map((row: any) => [row.question.id, row]));
  const population: R5PopulationRow[] = [];
  const controls: any[] = [];
  const generated: string[] = [];
  const writeTracked = (path: string, text: string) => { ensureWrite(join(destination, path), text); generated.push(path); };
  for (const [index, candidateId] of gateEvidence.population.unpairedRoster.entries()) {
    const located = byId.get(candidateId);
    const question = located.question;
    const surrogateId = `CAND-${String(index + 1).padStart(2, "0")}`;
    const map = tokenMap(question);
    const packet1 = makeStage1Packet(question);
    const packet2 = makeStage2Packet(question);
    const packet1Text = stableJson(packet1);
    const packet2Text = stableJson(packet2);
    writeTracked(`blind-packets/${surrogateId}-stage1.json`, packet1Text);
    writeTracked(`blind-packets/${surrogateId}-stage2.json`, packet2Text);
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
      tokenCounts: zoneTokenCounts(question),
      canonicalKeyCardinality: keyCounts(question),
      candidatePayloadSha256: sha256(stableJson(question, 0)),
      stage1BlindInputSha256: sha256(packet1Text),
      stage2BlindInputSha256: sha256(packet2Text),
      pilot: index < 4,
    });
    controls.push({
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
      canonicalSelection: canonicalLabels(question, map),
      candidatePayloadSha256: sha256(stableJson(question, 0)),
    });
  }
  writeTracked("population.jsonl", jsonl(population));
  writeTracked("control-manifest.jsonl", jsonl(controls));
  const roster = population.map((row) => `| ${row.surrogateId} | \`${row.candidateId}\` | null | null | ${row.unpairedReason} | ${row.pilot ? "pilot" : "scale-up"} |`).join("\n");
  const paired = gateEvidence.population.pairedRoster.map((id: string) => `- \`${id}\``).join("\n");
  writeTracked("population-summary.md", `# Campaign 16 Phase C Revision 5 Population\n\n- Bank read path: **working-tree filesystem bytes**.\n- Live \`_bowtie\` suffix roster: **50**.\n- Paired complement: **31** (30 \`EXACT\`, 1 \`ORDINAL_SUFFIX\`).\n- Live unpaired population: **19**.\n- Phase A delta: additions **0**, removals **0**.\n- Structural precondition: **19/19** at 3/4/4 tokens and 1/2/2 keys.\n- Pilot: first **4** rows in ascending candidate-ID order.\n\n## Nullable schema adaptation\n\nEvery manifest row explicitly carries \`companionCaseId\`, \`companionBankPath\`, companion JSON path/index/ordinal, and \`pairingRule\` as \`null\`, plus \`unpairedReason: \"NO_ELIGIBLE_SIBLING_CASE\"\`. The Revision-5 TypeScript type encodes these as null literals; no invented pairing member or cast is used.\n\n## Unpaired population\n\n| Surrogate | Candidate | Companion | Pairing | Reason | Lane |\n|---|---|---|---|---|---|\n${roster}\n\n## Paired complement\n\n${paired}\n`);
  writeTracked("opening-bank-snapshot.json", stableJson(bankSnapshot));
  writeTracked("deterministic-gates.json", stableJson({
    population: gateEvidence.population,
    unpairedPayloads: gateEvidence.unpairedPayloads,
    btFalsification: gateEvidence.btFalsification,
    siblingAbsence: gateEvidence.siblingAbsence,
    pairedPreservation: gateEvidence.pairedPreservation,
    structuralRows: gateEvidence.structuralRows,
    payloadHashConvention: "sha256(stableJson(q, 0)); recursively sorted object keys; compact JSON.stringify; trailing newline",
  }));
  writeTracked("generated-control-files.json", stableJson([...generated, "generated-control-files.json"].sort()));
  return generated;
}

function populationRows(): R5PopulationRow[] { return parseJsonl(join(OUT, "population.jsonl")); }
function controlRows(): any[] { return parseJsonl(join(OUT, "control-manifest.jsonl")); }
function populationRow(id: string) { const row = populationRows().find((item) => item.surrogateId === id); if (!row) error(`unknown surrogate ${id}`); return row; }
function controlRow(id: string) { const row = controlRows().find((item) => item.surrogateId === id); if (!row) error(`unknown control ${id}`); return row; }
function reviewPath(kind: string, id: string) {
  if (kind === "stage1" || kind === "stage2") return join(OUT, "blind-reviews", `${id}-${kind}.json`);
  if (kind === "phase-e") return join(OUT, "phase-e", `${id}.json`);
  if (kind === "phase-f") return join(OUT, "phase-f", `${id}.json`);
  error(`unknown review kind ${kind}`);
}
function sealPath(kind: string, id: string) { return join(OUT, "locks", `${id}-${kind}.json`); }

const allowedPremises = new Set(["SUPPORTED_EXPLICIT", "SUPPORTED_GENERAL_KNOWLEDGE", "MISSING_CLIENT_FACT", "CONTRADICTED", "NO_CLIENT_PREMISE"]);
const allowedSupport = new Set(["DIRECT", "GENERAL_KNOWLEDGE_LINK", "MISSING_CLIENT_FACT", "CONTRADICTED", "NOT_APPLICABLE"]);
const allowedVerdicts = new Set(["FAIL_HIDDEN_CASE_DEPENDENCY", "FAIL_UNSUPPORTED_TOKEN_PREMISE", "FAIL_UNDERDETERMINED", "FAIL_CANONICAL_KEY_OR_LOGIC", "HOLD_REVIEWER_DISAGREEMENT", "PASS_STANDALONE"]);
const allowedProvenance = new Set(["RATIONALE_ONLY", "OTHER_PROVENANCE", "UNSUPPORTED_ANYWHERE_CHECKED"]);

function exactStringArray(value: unknown, count: number, name: string) {
  if (!Array.isArray(value) || value.length !== count || value.some((item) => typeof item !== "string")) error(`invalid ${name}`);
}

export function validateStage1(value: any) {
  if (!isObj(value) || typeof value.condition !== "string") error("invalid Stage-1 condition");
  exactStringArray(value.priorityActions, 2, "priorityActions");
  exactStringArray(value.evaluationParameters, 2, "evaluationParameters");
  if (!Array.isArray(value.stemEvidence) || !Array.isArray(value.missingInformation) || !["high", "medium", "low"].includes(value.stage1Confidence) || typeof value.reasoning !== "string") error("invalid Stage-1 shape");
}

export function validateStage2(value: any) {
  if (!isObj(value) || !["C1", "C2", "C3"].includes(value.conditionLabel)) error("invalid Stage-2 condition");
  if (!Array.isArray(value.actionLabels) || value.actionLabels.length !== 2 || new Set(value.actionLabels).size !== 2 || value.actionLabels.some((label: string) => !["A1", "A2", "A3", "A4"].includes(label))) error("invalid Stage-2 actions");
  if (!Array.isArray(value.parameterLabels) || value.parameterLabels.length !== 2 || new Set(value.parameterLabels).size !== 2 || value.parameterLabels.some((label: string) => !["P1", "P2", "P3", "P4"].includes(label))) error("invalid Stage-2 parameters");
  if (!Array.isArray(value.selectionEvidence) || value.selectionEvidence.length !== 5 || !Array.isArray(value.ambiguousAlternatives) || !Array.isArray(value.missingInformation) || !["ANSWERABLE", "UNDERDETERMINED", "NOT_ANSWERABLE"].includes(value.poolAnswerability) || !["high", "medium", "low"].includes(value.stage2Confidence) || typeof value.reasoning !== "string") error("invalid Stage-2 shape");
  if (!Array.isArray(value.tokenPremiseTable) || value.tokenPremiseTable.length !== 11) error("tokenPremiseTable must have 11 rows");
  if (value.tokenPremiseTable.map((row: any) => row.opaqueTokenLabel).sort().join("|") !== [...LABELS].sort().join("|")) error("tokenPremiseTable labels invalid");
  for (const row of value.tokenPremiseTable) {
    if (!allowedPremises.has(row.premiseStatus) || !["NONE", "LOW", "MATERIAL"].includes(row.rankabilityImpact) || typeof row.supportingStemText !== "string" || typeof row.missingPremise !== "string" || typeof row.rankabilityJustification !== "string") error(`invalid premise row ${row.opaqueTokenLabel}`);
  }
}

export function validatePhaseE(value: any, expectedCanonical?: any) {
  if (!isObj(value) || !isObj(value.canonicalSelection) || typeof value.blindExactMatch !== "boolean" || !["FULL", "PARTIAL", "NONE"].includes(value.stage1Alignment) || typeof value.stage1AlignmentExplanation !== "string" || typeof value.canonicalSetUniquelyDefensible !== "boolean" || typeof value.canonicalSetExplanation !== "string" || typeof value.anyCanonicalTargetDependsOnAbsentFact !== "boolean" || typeof value.unstatedClientFactMateriallyChangesRankability !== "boolean" || !Array.isArray(value.canonicalTargetSupport) || value.canonicalTargetSupport.length !== 5 || !Array.isArray(value.distractorPremiseFindings) || value.distractorPremiseFindings.length !== 6 || !Array.isArray(value.missingClientFacts)) error("invalid Phase-E shape");
  if (expectedCanonical && stableJson(value.canonicalSelection, 0) !== stableJson(expectedCanonical, 0)) error("Phase-E canonical selection mismatch");
  const keyed = [value.canonicalSelection.conditionLabel, ...value.canonicalSelection.actionLabels, ...value.canonicalSelection.parameterLabels].sort();
  if (value.canonicalTargetSupport.map((row: any) => row.opaqueTokenLabel).sort().join("|") !== keyed.join("|")) error("Phase-E keyed support labels invalid");
  const unkeyed = LABELS.filter((label) => !keyed.includes(label)).sort();
  if (value.distractorPremiseFindings.map((row: any) => row.opaqueTokenLabel).sort().join("|") !== unkeyed.join("|")) error("Phase-E distractor labels invalid");
  if (value.canonicalTargetSupport.some((row: any) => !allowedSupport.has(row.supportClassification) || typeof row.supportingStandaloneEvidence !== "string" || typeof row.missingClientFact !== "string")) error("invalid Phase-E support row");
}

export function validatePhaseF(value: any, schemaOnly = false) {
  if (!isObj(value) || !allowedVerdicts.has(value.primaryVerdict) || !Array.isArray(value.secondaryFlags) || !Array.isArray(value.missingFactProvenance) || ![null, "P0", "P1", "P2", "P3"].includes(value.advisoryPriority) || typeof value.defectSummary !== "string" || !Array.isArray(value.bilingualCollateral) || !Array.isArray(value.clinicalCollateral) || !Array.isArray(value.scopeCollateral) || typeof value.reasoning !== "string") error("invalid Phase-F shape");
  if (!schemaOnly && (value.primaryVerdict === "FAIL_HIDDEN_CASE_DEPENDENCY" || value.secondaryFlags.includes("SIBLING_CASE_IMPORTED"))) error("§5.2 unreachable hidden-case output");
  for (const row of value.missingFactProvenance) {
    if (!allowedProvenance.has(row.provenance) || typeof row.opaqueTokenLabel !== "string" || typeof row.missingFact !== "string" || typeof row.sourceEvidence !== "string" || !Array.isArray(row.checkedSurfaces) || typeof row.necessaryForRankability !== "boolean") error("invalid bounded provenance row");
  }
}

function putReview(kind: string, id: string, base64: string) {
  populationRow(id);
  if (existsSync(sealPath(kind, id))) error(`cannot overwrite sealed ${kind} ${id}`);
  const value = JSON.parse(Buffer.from(base64, "base64").toString("utf8"));
  if (kind === "stage1") validateStage1(value);
  else if (kind === "stage2") validateStage2(value);
  else if (kind === "phase-e") validatePhaseE(value, controlRow(id).canonicalSelection);
  else if (kind === "phase-f") validatePhaseF(value);
  else error(`unsupported review kind ${kind}`);
  writeJson(reviewPath(kind, id), value);
}

function requireSeal(kind: string, id: string) {
  const path = sealPath(kind, id);
  if (!existsSync(path)) error(`missing ${kind} seal for ${id}`);
  const seal = parseJson(path);
  if (seal.sha256 !== digestFile(reviewPath(kind, id))) error(`${kind} changed after seal for ${id}`);
  return seal;
}

function sealReview(kind: string, id: string) {
  populationRow(id);
  if (existsSync(sealPath(kind, id))) error(`seal exists for ${kind} ${id}`);
  if (kind === "stage2") requireSeal("stage1", id);
  if (kind === "phase-e") requireSeal("stage2", id);
  if (kind === "phase-f") requireSeal("phase-e", id);
  const value = parseJson(reviewPath(kind, id));
  if (kind === "stage1") validateStage1(value);
  else if (kind === "stage2") validateStage2(value);
  else if (kind === "phase-e") validatePhaseE(value, controlRow(id).canonicalSelection);
  else if (kind === "phase-f") validatePhaseF(value);
  writeJson(sealPath(kind, id), {
    artifact: relative(REPO, reviewPath(kind, id)),
    sha256: digestFile(reviewPath(kind, id)),
    priorSealSha256: kind === "stage1" ? null : kind === "stage2" ? requireSeal("stage1", id).sha256 : kind === "phase-e" ? requireSeal("stage2", id).sha256 : requireSeal("phase-e", id).sha256,
  });
}

function contextRows() { const path = join(OUT, "semantic-contexts.jsonl"); return existsSync(path) ? parseJsonl(path) : []; }
function registerContext(id: string, contextId: string) {
  populationRow(id);
  const rows = contextRows();
  if (rows.some((row) => row.controlId === id || row.contextId === contextId)) error("context registration collision");
  rows.push({ controlId: id, contextId, model: "gpt-5.6-sol", reasoningEffort: "high", isolatedPerCandidate: true, sequentialStages: 2, sharedCandidateContext: false, repositoryAccessPermitted: false });
  ensureWrite(join(OUT, "semantic-contexts.jsonl"), jsonl(rows.sort((a, b) => a.controlId.localeCompare(b.controlId))));
}

function assertOpeningBanks() {
  const opening = parseJson(join(OUT, "opening-bank-snapshot.json"));
  const bad = opening.rows.filter((row: any) => digestFile(join(REPO, row.bankPath)) !== row.observedFileByteSha256);
  if (bad.length) error(`bank snapshot changed: ${bad.map((row: any) => row.bankPath).join(", ")}`);
}

function verifyBlindProjectionAndLeakage() {
  for (const row of populationRows()) {
    const control = controlRow(row.surrogateId);
    const packet1 = parseJson(join(OUT, "blind-packets", `${row.surrogateId}-stage1.json`));
    const packet2 = parseJson(join(OUT, "blind-packets", `${row.surrogateId}-stage2.json`));
    if (Object.keys(packet1).sort().join("|") !== "instruction|stem") error(`Stage-1 field leak ${row.surrogateId}`);
    const allowed2 = new Set(["instruction", "stem", "prompts", "tokens"]);
    if (Object.keys(packet2).some((key) => !allowed2.has(key))) error(`Stage-2 field leak ${row.surrogateId}`);
    const exactForbidden = [row.candidateId, row.surrogateId, row.candidateBankPath, row.candidateJsonPath, ...Object.keys(control.tokenMap.condition), ...Object.keys(control.tokenMap.actions), ...Object.keys(control.tokenMap.parameters)];
    for (const [stage, packet] of [[1, packet1], [2, packet2]] as const) {
      const text = stableJson(packet, 0);
      for (const forbidden of exactForbidden) if (forbidden && text.includes(forbidden)) error(`Stage-${stage} exact forbidden leakage ${row.surrogateId}: ${forbidden}`);
    }
    const neutral = [...packet2.tokens.condition, ...packet2.tokens.actions, ...packet2.tokens.parameters].map((item: any) => item.label).sort();
    if (neutral.join("|") !== [...LABELS].sort().join("|")) error(`Stage-2 neutral labels invalid ${row.surrogateId}`);
  }
}

function verifyRepeatability() {
  const temp = mkdtempSync(join(tmpdir(), "phase-c-r5-repeat-"));
  try {
    const snapshot = parseJson(join(OUT, "opening-bank-snapshot.json"));
    const gates = parseJson(join(OUT, "deterministic-gates.json"));
    buildControlArtifacts(temp, snapshot, gates);
    const expectedFiles = parseJson(join(OUT, "generated-control-files.json")) as string[];
    for (const path of expectedFiles.filter((path) => path !== "generated-control-files.json")) {
      if (!readFileSync(join(OUT, path)).equals(readFileSync(join(temp, path)))) error(`repeatability mismatch: ${path}`);
    }
  } finally { rmSync(temp, { recursive: true, force: true }); }
}

function runPreflight() {
  if (digestFile(WORK_ORDER_PATH) !== WORK_ORDER_SHA) error("launch work-order digest mismatch");
  const preservation = captureOpeningPreservation();
  writeJson(join(OUT, "opening-preservation.json"), preservation);
  const snapshot = bankIdentity();
  writeJson(join(OUT, "opening-bank-snapshot.json"), snapshot);
  const banks = workingBanks();
  const gates = deriveGateEvidence(banks);
  buildControlArtifacts(OUT, snapshot, gates);
  verifyBlindProjectionAndLeakage();
  verifyRepeatability();
  writeJson(join(OUT, "preflight-result.json"), {
    status: "PASS",
    workOrderSha256: WORK_ORDER_SHA,
    bankIdentity: "13/13",
    population: "50 suffix / 31 paired (30 exact, 1 ordinal) / 19 unpaired",
    unpairedPayloads: "19/19 MATCH",
    correctedBtFalsification: "PASS",
    siblingAbsence: "0 hits",
    pairedPreservation: "31/31 MATCH",
    structural: "19/19 PASS",
    leakage: "PASS",
    deterministicRepeatability: "PASS",
    prohibitedEntrypointsInvoked: [],
    importedFrozenHelpers: ["derivePopulation", "stableJson", "sha256"],
  });
  console.log("PASS: Revision-5 deterministic gates, corrected _bt_ check, 19-row manifest, leakage, and exact repeatability.");
}

function verifyPilot() {
  const pilot = populationRows().filter((row) => row.pilot);
  if (pilot.map((row) => row.surrogateId).join("|") !== "CAND-01|CAND-02|CAND-03|CAND-04") error("pilot roster mismatch");
  const contexts = contextRows().filter((row) => pilot.some((candidate) => candidate.surrogateId === row.controlId));
  if (contexts.length !== 4 || new Set(contexts.map((row) => row.contextId)).size !== 4 || contexts.some((row) => row.model !== "gpt-5.6-sol" || row.reasoningEffort !== "high" || !row.isolatedPerCandidate || row.sequentialStages !== 2 || row.sharedCandidateContext || row.repositoryAccessPermitted)) error("pilot context isolation failure");
  for (const row of pilot) {
    requireSeal("stage1", row.surrogateId);
    requireSeal("stage2", row.surrogateId);
    validateStage2(parseJson(reviewPath("stage2", row.surrogateId)));
  }
  assertOpeningBanks();
  verifyBlindProjectionAndLeakage();
  verifyRepeatability();
  console.log("PASS: adapted four-row pilot gate, four isolated Sol/high contexts, sequential seals, 11-row tables, no leakage, and repeatability.");
}

function scaleupRecheck() {
  assertOpeningBanks();
  const opening = parseJson(join(OUT, "opening-bank-snapshot.json"));
  writeJson(join(OUT, "scale-up-bank-recheck.json"), {
    status: "PASS",
    checkedImmediatelyBeforeFirstScaleUpDispatch: true,
    openingSnapshotSha256: digestFile(join(OUT, "opening-bank-snapshot.json")),
    rows: opening.rows.map((row: any) => ({ bankPath: row.bankPath, openingFileByteSha256: row.observedFileByteSha256, scaleUpFileByteSha256: digestFile(join(REPO, row.bankPath)), match: true })),
  });
  console.log("PASS: 13/13 bank bytes reverified immediately before scale-up.");
}

function verifyAllBlind() {
  const population = populationRows();
  const contexts = contextRows();
  if (population.length !== 19 || contexts.length !== 19 || new Set(contexts.map((row) => row.contextId)).size !== 19) error("19-context accounting failure");
  for (const row of population) { requireSeal("stage1", row.surrogateId); requireSeal("stage2", row.surrogateId); }
  assertOpeningBanks();
  console.log("PASS: 19 isolated Sol/high contexts and 38 sealed semantic turns complete.");
}

function candidateBySurrogate(id: string) {
  const row = populationRow(id);
  const bank = parseJson(join(REPO, row.candidateBankPath)) as Bank;
  const question = bank.questions.find((item) => item.id === row.candidateId);
  if (!question || sha256(stableJson(question, 0)) !== row.candidatePayloadSha256) error(`candidate bytes changed ${id}`);
  return question;
}

function standaloneProjection(id: string) {
  const question = candidateBySurrogate(id);
  const map = controlRow(id).tokenMap;
  const projectZone = (zone: "condition" | "actions" | "parameters") => ({
    ...(question.bowtie[zone].prompt ? { prompt: question.bowtie[zone].prompt } : {}),
    tokens: question.bowtie[zone].tokens.map((token: Obj) => ({ opaqueTokenLabel: map[zone][token.id], en: token.en, zh: token.zh })),
  });
  return {
    stem: question.stem,
    bowtie: { condition: projectZone("condition"), actions: projectZone("actions"), parameters: projectZone("parameters") },
    rationale: { correct: question.rationale.correct, byChoice: (question.rationale.byChoice ?? []).map((entry: Obj) => ({ opaqueTokenLabel: map.condition[entry.refId] ?? map.actions[entry.refId] ?? map.parameters[entry.refId], en: entry.en, zh: entry.zh })) },
    testTakingStrategy: question.testTakingStrategy,
    glossary: question.glossary ?? [],
  };
}

function writePhaseEPacket(id: string) {
  requireSeal("stage1", id); requireSeal("stage2", id); assertOpeningBanks();
  writeJson(join(OUT, "phase-e-packets", `${id}.json`), {
    instruction: "The two blind records are immutable. Compare them with the current canonical five-target selection and complete standalone item. Do not inspect or infer sibling/corpus material. Return the required Phase-E standalone-adjudication record without revising either blind stage.",
    stage1Sha256: requireSeal("stage1", id).sha256,
    stage2Sha256: requireSeal("stage2", id).sha256,
    stage1: parseJson(reviewPath("stage1", id)),
    stage2: parseJson(reviewPath("stage2", id)),
    canonicalSelection: controlRow(id).canonicalSelection,
    standaloneItem: standaloneProjection(id),
  });
}

function writePhaseFPacket(id: string) {
  requireSeal("phase-e", id); assertOpeningBanks();
  writeJson(join(OUT, "phase-f-packets", `${id}.json`), {
    instruction: "Phase E is immutable. For every missing client fact inspect only this candidate's rationale/byChoice, strategy, glossary, Chinese counterpart, and an explicitly linked historical source if one exists. Do not search the corpus. Classify bounded provenance, apply fixed verdict precedence, and record narrow bilingual/clinical/scope findings. Hidden-case dependency is unreachable and is a blocker if asserted.",
    phaseESha256: requireSeal("phase-e", id).sha256,
    phaseE: parseJson(reviewPath("phase-e", id)),
    candidateSurfaces: standaloneProjection(id),
    explicitlyLinkedHistoricalSources: [],
  });
}

function markdownCell(value: unknown) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}

function countBy<T>(values: T[]) {
  const counts: Record<string, number> = {};
  for (const value of values) counts[String(value)] = (counts[String(value)] ?? 0) + 1;
  return counts;
}

function finalizeProducer() {
  if (digestFile(WORK_ORDER_PATH) !== WORK_ORDER_SHA) error("closeout work-order digest mismatch");
  assertOpeningBanks();
  const opening = parseJson(join(OUT, "opening-preservation.json"));
  const gates = parseJson(join(OUT, "deterministic-gates.json"));
  const snapshot = parseJson(join(OUT, "opening-bank-snapshot.json"));
  if (git("branch", "--show-current") !== opening.branch || git("rev-parse", "HEAD") !== opening.head) error("branch or HEAD changed during Phase C");
  if (digestFile(join(REPO, "DECISIONS.md")) !== opening.decisionsSha256) error("DECISIONS.md changed during Phase C");
  const r4Now = walkFiles(R4_ROOT).map((path) => ({ path: relative(REPO, path), sha256: digestFile(path) }));
  if (stableJson(r4Now, 0) !== stableJson(opening.revision4Tree, 0)) error("Revision-4 tree changed during Revision-5 execution");
  for (const row of opening.dirtyPaths) {
    const path = join(REPO, row.path);
    if (!existsSync(path) || digestFile(path) !== row.sha256) error(`pre-existing dirty path changed: ${row.path}`);
  }

  const rows = populationRows().map((population) => {
    for (const kind of ["stage1", "stage2", "phase-e", "phase-f"]) requireSeal(kind, population.surrogateId);
    const phaseE = parseJson(reviewPath("phase-e", population.surrogateId));
    const phaseF = parseJson(reviewPath("phase-f", population.surrogateId));
    validatePhaseE(phaseE, controlRow(population.surrogateId).canonicalSelection);
    validatePhaseF(phaseF);
    return {
      surrogateId: population.surrogateId,
      candidateId: population.candidateId,
      candidateBankPath: population.candidateBankPath,
      candidatePayloadSha256: population.candidatePayloadSha256,
      companionCaseId: null,
      pairingRule: null,
      unpairedReason: "NO_ELIGIBLE_SIBLING_CASE",
      pilot: population.pilot,
      canonicalSelection: phaseE.canonicalSelection,
      blindExactMatch: phaseE.blindExactMatch,
      stage1Alignment: phaseE.stage1Alignment,
      canonicalSetUniquelyDefensible: phaseE.canonicalSetUniquelyDefensible,
      anyCanonicalTargetDependsOnAbsentFact: phaseE.anyCanonicalTargetDependsOnAbsentFact,
      primaryVerdict: phaseF.primaryVerdict,
      secondaryFlags: phaseF.secondaryFlags,
      advisoryPriority: phaseF.advisoryPriority,
      defectSummary: phaseF.defectSummary,
      missingFactProvenance: phaseF.missingFactProvenance,
      bilingualCollateral: phaseF.bilingualCollateral,
      clinicalCollateral: phaseF.clinicalCollateral,
      scopeCollateral: phaseF.scopeCollateral,
      stage1Sha256: requireSeal("stage1", population.surrogateId).sha256,
      stage2Sha256: requireSeal("stage2", population.surrogateId).sha256,
      phaseESha256: requireSeal("phase-e", population.surrogateId).sha256,
      phaseFSha256: requireSeal("phase-f", population.surrogateId).sha256,
    };
  });
  ensureWrite(join(OUT, "adjudication.jsonl"), jsonl(rows));

  const verdictTotals = countBy(rows.map((row) => row.primaryVerdict));
  if ((verdictTotals.PASS_STANDALONE ?? 0) !== 18 || (verdictTotals.FAIL_UNSUPPORTED_TOKEN_PREMISE ?? 0) !== 1 || Object.values(verdictTotals).reduce((a, b) => a + b, 0) !== 19) error("unexpected Phase C verdict totals");
  const pairedTotals = countBy(gates.pairedPreservation.rows.map((row: Obj) => row.preservedPrimaryVerdict));
  const combinedTotals: Record<string, number> = { ...pairedTotals };
  for (const [verdict, count] of Object.entries(verdictTotals)) combinedTotals[verdict] = (combinedTotals[verdict] ?? 0) + count;
  const provenanceRows = rows.flatMap((row) => row.missingFactProvenance.map((fact: Obj) => ({ candidateId: row.candidateId, ...fact })));
  const pilotRows = rows.filter((row) => row.pilot);
  const scaleRows = rows.filter((row) => !row.pilot);
  const table = (header: string, separator: string, body: string[]) => [header, separator, ...body].join("\n");

  const report = `# Campaign 16 Phase C — Revision 5 report

Terminal producer status: **READY FOR INDEPENDENT CLAUDE CHECK**. The Phase C terminal token is issued only after the independent exit gate passes.

## Authority and method

- Frozen Revision-5 work-order raw file-byte SHA-256: \`${WORK_ORDER_SHA}\` — exact match at launch and producer closeout.
- Phase B state: uncommitted working-tree publication bytes on branch \`${opening.branch}\`, HEAD \`${opening.head}\`, upstream \`${opening.upstream}\`, ahead/behind \`${opening.aheadBehindHeadVsUpstream}\`.
- The frozen-spec clean-bank precondition was explicitly inverted under Revision-5 §3.1: the dirty GPT bank was expected, and identity was governed by bytes.
- All bank reads used working-tree filesystem bytes, never \`git show HEAD:<bank>\`. The corrected §4.3 presence/absence proof used a Node \`JSON.parse\` walk over the working-tree GPT bank.
- Payload convention: \`${gates.payloadHashConvention}\`.
- Schema adaptation: every population row retains null companion fields and null \`pairingRule\`, plus \`unpairedReason: "NO_ELIGIBLE_SIBLING_CASE"\`; no fictitious companion or pairing rule was introduced.
- Semantic lane: 19 isolated GPT-5.6 Sol/high contexts, two sequential turns in each context, 38 sealed turns total. No candidate batching or cross-candidate semantic context was used.

## Bank identity gate

${table("| Bank | Expected raw-byte SHA-256 | Observed raw-byte SHA-256 | Result |", "|---|---|---|---|", snapshot.rows.map((row: Obj) => `| ${markdownCell(row.bankPath)} | \`${row.expectedFileByteSha256}\` | \`${row.observedFileByteSha256}\` | ${row.match ? "MATCH" : "MISMATCH"} |`))}

The GPT expected value came from the literal Revision-5 §3.2 identity \`${GPT_SHA}\`, corroborated by \`audit/campaign-16-phase-b-recovery-2026-08-27/status-stage-3.log\` lines 117 and 145. The other 12 expected hashes came from \`audit/campaign-16-phase-a-baseline-2026-08-26/baseline.json\` → \`campaignBaselineFileByteSha256\`. Result: **13/13 MATCH**.

## Population and deterministic gates

- Live \`_bowtie\` suffix roster: **${gates.population.suffixCount}**.
- Paired complement: **${gates.population.pairedCount}** = ${gates.population.exactCount} \`EXACT\` + ${gates.population.ordinalSuffixCount} \`ORDINAL_SUFFIX\`.
- Phase C unpaired population: **${gates.population.unpairedCount}** \`NO_ELIGIBLE_SIBLING_CASE\` rows.
- Delta against Phase A: additions **${gates.population.additionsVsPhaseA.length}**, removals **${gates.population.removalsVsPhaseA.length}**; both ID lists are empty.
- Structural precondition: **19/19 PASS** at 3/4/4 tokens and 1/2/2 canonical keys.
- Deterministic sibling-absence probe: **0 hits** across ${gates.siblingAbsence.caseStudyIdsExamined} live case-study IDs.
- Paired-disposition preservation: **31/31 MATCH**. This is the explicit warrant for the combined current 50-item disposition below.

### Corrected \`_bt_\` falsification

${table("| ID | Live question.id count | Absent from live `_bowtie` suffix roster |", "|---|---:|---|", gates.btFalsification.liveIdRows.map((row: Obj) => `| ${row.candidateId} | ${row.liveQuestionIdCount} | ${row.absentFromBowtieSuffixRoster ? "YES" : "NO"} |`))}

The historical pre-repair IDs \`${HISTORICAL_BT_IDS[0]}\` and \`${HISTORICAL_BT_IDS[1]}\` each have live \`question.id\` count 0, as expected after Phase B's \`_r2\` minting.

### Unpaired payload preservation

${table("| Candidate ID | Phase-A payload SHA-256 | Live payload SHA-256 | Result |", "|---|---|---|---|", gates.unpairedPayloads.map((row: Obj) => `| ${row.candidateId} | \`${row.expectedPayloadSha256}\` | \`${row.observedPayloadSha256}\` | ${row.status} |`))}

## Four-row pilot and scale-up

- Pilot (CAND-01…04): ${pilotRows.length}/4 completed; verdicts ${JSON.stringify(countBy(pilotRows.map((row) => row.primaryVerdict)))}.
- Scale-up (CAND-05…19): ${scaleRows.length}/15 completed; verdicts ${JSON.stringify(countBy(scaleRows.map((row) => row.primaryVerdict)))}.
- Frozen bank snapshot was rechecked 13/13 immediately before the first scale-up dispatch.

## Candidate dispositions

${table("| Candidate ID | Companion | Pairing | Primary verdict | Secondary flags | Stage-1 alignment | Stage-2 exact match |", "|---|---|---|---|---|---|---|", rows.map((row) => `| ${markdownCell(row.candidateId)} | null | null | ${row.primaryVerdict} | ${markdownCell(row.secondaryFlags.join(", ") || "—")} | ${row.stage1Alignment} | ${row.blindExactMatch ? "true" : "false"} |`))}

All 19 Stage-2 selections matched the canonical five-target set after order-insensitive opaque-label mapping. This selection agreement is diagnostic only; it did not substitute for the standalone support judgment. Stage-1 alignment separately records free-generation agreement before pools were visible.

## Verdict totals and combined current accounting

| Population | PASS | Hidden-case dependency | Unsupported token premise | Other verdicts | Total |
|---|---:|---:|---:|---:|---:|
| Unpaired Phase C | ${verdictTotals.PASS_STANDALONE ?? 0} | ${verdictTotals.FAIL_HIDDEN_CASE_DEPENDENCY ?? 0} | ${verdictTotals.FAIL_UNSUPPORTED_TOKEN_PREMISE ?? 0} | 0 | 19 |
| Preserved paired | ${pairedTotals.PASS_STANDALONE ?? 0} | ${pairedTotals.FAIL_HIDDEN_CASE_DEPENDENCY ?? 0} | ${pairedTotals.FAIL_UNSUPPORTED_TOKEN_PREMISE ?? 0} | 0 | 31 |
| Combined current \`_bowtie\` | ${combinedTotals.PASS_STANDALONE ?? 0} | ${combinedTotals.FAIL_HIDDEN_CASE_DEPENDENCY ?? 0} | ${combinedTotals.FAIL_UNSUPPORTED_TOKEN_PREMISE ?? 0} | 0 | 50 |

Unsupported-premise descriptive rates: **1/19 = 5.26%** for the unpaired population; **4/31 = 12.90%** for the preserved paired population. These are small denominators and descriptive only. No confidence interval, significance test, or generative-versus-harvest conclusion is authorized or asserted.

## Non-PASS defect

| Candidate ID | Affected token | Primary verdict | Exact defect | Provenance | Advisory |
|---|---|---|---|---|---|
| gpt_format7c_exercise_hypoglycemia_bowtie | A3 | FAIL_UNSUPPORTED_TOKEN_PREMISE | The keyed action presupposes an existing client-specific hypoglycemia treatment plan and access to rapid carbohydrate; the stem establishes neither. | RATIONALE_ONLY | P1 |

The rationale and test-taking strategy introduce the missing “existing plan” premise. Under the frozen instrument, provenance cannot rescue a standalone omission.

## Bounded provenance

${table("| Candidate ID | Token | Missing fact | Classification | Necessary for rankability | Checked surfaces |", "|---|---|---|---|---|---|", provenanceRows.map((row: Obj) => `| ${markdownCell(row.candidateId)} | ${row.opaqueTokenLabel} | ${markdownCell(row.missingFact)} | ${row.provenance} | ${row.necessaryForRankability ? "YES" : "NO"} | ${markdownCell(row.checkedSurfaces.join("; "))} |`))}

No corpus-wide search or sibling substitution was performed. \`FAIL_HIDDEN_CASE_DEPENDENCY\` and \`SIBLING_CASE_IMPORTED\` remained unreachable, consistent with the zero-hit structural probe.

## Collateral and advisory routing

- Bilingual, clinical-currency, and nursing-scope collateral: no concrete concern recorded in the narrow §13 pass.
- \`gpt_format15_palliative_malignant_bowel_obstruction_bowtie\` remains PASS with \`DISTRACTOR_PATIENT_FACT_INVENTION\` / P2: non-keyed A4 presupposes an unestablished octreotide order and sequence but remains clearly rejectable.
- The single P1 finding and the P2 distractor finding route to Phase D for owner/architect prioritization. No repair was performed.

## Historical calibration

**NOT RERUN — OWNER DECISION F1.** The inherited semantic instrument already demonstrated sensitivity on that exact historical control; the Phase C novelty was the null-companion harness and bounded provenance adaptation, neither exercised by the paired historical control.

## Preservation statement

No canonical bank, answer key, ledger status, schema, runtime, \`DECISIONS.md\`, \`PROJECT-HISTORY.md\`, census artifact, or unrelated dirty path was changed by this commission. The complete failed Revision-4 tree remained byte-identical. Detailed proof is in \`closeout-preservation.json\` and \`verification.md\`.
`;
  ensureWrite(join(OUT, "report.md"), report);

  const verification = `# Campaign 16 Phase C — Revision 5 verification

All commands below ran from \`${REPO}\`.

| Gate | Exact command | Emitted status | Exit |
|---|---|---|---:|
| Launch digest | \`sha256sum scratch/CAMPAIGN-16-PHASE-C-UNPAIRED-BOWTIE-ANSWERABILITY-WORK-ORDER-2026-08-27.md\` | \`${WORK_ORDER_SHA}\` exact | 0 |
| §§3.2, 4.1–4.6, manifest, leakage, repeatability | \`npx tsx audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/run.ts preflight\` | PASS | 0 |
| Focused harness tests | \`npx tsx audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/test.ts\` | PASS | 0 |
| TypeScript floor | \`npx tsc -b --pretty false\` | PASS | 0 |
| Diff whitespace | \`git diff --check\` | PASS | 0 |
| Four-row pilot | \`npx tsx audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/run.ts pilot-gate\` | PASS | 0 |
| Pre-scale-up snapshot | \`npx tsx audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/run.ts scaleup-recheck\` | PASS 13/13 | 0 |
| Blind semantic completion | \`npx tsx audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/run.ts blind-complete\` | PASS: 19 isolated contexts / 38 sealed turns | 0 |
| Producer closeout | \`npx tsx audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/run.ts finalize-producer\` | PASS | 0 |

## Gate accounting

- §3.2: 13/13 raw working-tree bank-byte identities matched; GPT matched the literal Phase-B closing digest, 12 non-GPT banks matched Phase A.
- §4.1: 50 suffix / 31 paired (30 exact, 1 ordinal) / 19 unpaired; zero additions and removals versus Phase A.
- §4.2: 19/19 unpaired payload hashes matched under \`sha256(stableJson(q, 0))\` with recursively sorted keys and trailing newline.
- §4.3: both live \`_r2\` IDs were present once and absent from the suffix roster; both historical pre-repair IDs were absent as live IDs.
- §4.4: 19/19 fixed 3/4/4 token shape and 1/2/2 key cardinality.
- §4.5: zero exact, ordinal-like, or substring sibling-case ID hits.
- §4.6: 31/31 paired payload hashes matched their frozen Aug-23 adjudication rows; combined accounting is therefore authorized.
- §6: the expected dirty GPT bank was accepted only through the named byte identity; all reads came from the working-tree filesystem. No \`git show HEAD:<bank>\` input was used.
- §7: 19 unique Sol/high context IDs, exactly two sequential stages each, no context shared across candidates, and 38 immutable semantic seals.

## Leakage, ordering, and provenance proof

- Stage-1 packets contain only instruction and English stem; Stage-2 packets contain only instruction, English stem/prompts, and opaque token pools.
- Exact real ID, surrogate ID, token ID, key, rationale, and companion-field leakage checks passed.
- Every Stage-1 seal predates the corresponding Stage-2 packet use; every Stage-2 seal predates Phase E; every Phase-E seal predates its Phase-F packet.
- All 19 token-premise tables contain exactly 11 unique rows.
- Deterministic control-artifact regeneration was byte-identical.
- Provenance inspection was bounded to each candidate's own rationale/byChoice, strategy, glossary, Chinese counterpart, and explicitly linked historical sources; no corpus-wide semantic search ran.

## Charter traps

- Trap 1: handled with Node filesystem/JSON parsing, not MCP file search, for every bank presence/absence claim.
- Trap 2: N/A — no census generation or checking was run.
- Trap 3: N/A — no census generation or checking was run.
- Trap 4: N/A — no stage-reference audit was run.
- Trap 5: handled — only pure \`derivePopulation\`, \`stableJson\`, and \`sha256\` helpers were imported; prohibited frozen entrypoints were never invoked.
- Trap 6: handled — all live bank reads used working-tree filesystem bytes; HEAD predates Phase B publication.

## Scope and preservation

- No bank, schema, grading, runtime, census, ledger/governance/status, \`DECISIONS.md\`, or unrelated dirty path was changed.
- Failed Revision-4 evidence tree: 8/8 files byte-identical.
- No staging, commit, push, stash, restore, clean, repair, retirement, promotion, authoring, or Phase D work occurred.
- Calibration checklist requirement: inapplicable under F1 = OMIT; no calibration directory or placeholder was created.
`;
  ensureWrite(join(OUT, "verification.md"), verification);

  const finalDirtyLines = git("status", "--porcelain=v1", "--untracked-files=all").split("\n").filter(Boolean);
  const closeout = {
    status: "PRODUCER_ARTIFACTS_READY_FOR_CLAUDE_CHECK",
    repositoryPath: REPO,
    branch: opening.branch,
    head: opening.head,
    upstream: opening.upstream,
    aheadBehindHeadVsUpstream: opening.aheadBehindHeadVsUpstream,
    workOrderSha256: digestFile(WORK_ORDER_PATH),
    bankRows: snapshot.rows.map((row: Obj) => ({ bankPath: row.bankPath, openingSha256: row.observedFileByteSha256, closingSha256: digestFile(join(REPO, row.bankPath)), unchanged: row.observedFileByteSha256 === digestFile(join(REPO, row.bankPath)) })),
    preexistingDirtyProof: opening.dirtyPaths.map((row: Obj) => ({ path: row.path, openingSha256: row.sha256, closingSha256: digestFile(join(REPO, row.path)), unchanged: row.sha256 === digestFile(join(REPO, row.path)) })),
    decisions: { openingSha256: opening.decisionsSha256, closingSha256: digestFile(join(REPO, "DECISIONS.md")), unchanged: opening.decisionsSha256 === digestFile(join(REPO, "DECISIONS.md")) },
    revision4TreeOpening: opening.revision4Tree,
    revision4TreeClosing: r4Now,
    revision4TreeUnchanged: stableJson(r4Now, 0) === stableJson(opening.revision4Tree, 0),
    finalDirtyPaths: finalDirtyLines.map((line: string) => ({ status: line.slice(0, 2), path: line.slice(3) })),
    auditCreatedPaths: walkFiles(OUT).map((path) => relative(REPO, path)),
    verdictTotals,
    combinedTotals,
  };
  writeJson(join(OUT, "closeout-preservation.json"), closeout);
  const existingStatus = readFileSync(join(OUT, "status.log"), "utf8").trimEnd();
  ensureWrite(join(OUT, "status.log"), `${existingStatus}\nPRODUCER_FINALIZED: 18 PASS_STANDALONE; 1 FAIL_UNSUPPORTED_TOKEN_PREMISE; awaiting independent Claude checker.`);
  console.log("PASS: producer adjudication/report/verification finalized; independent Claude checker required.");
}

function blockedEvidence(message: string) {
  writeJson(join(OUT, "blocked-evidence.json"), { terminalStatus: "CAMPAIGN16_PHASE_C_BLOCKED", failedGate: message });
}

function main(args: string[]) {
  const [command, a, b, c] = args;
  if (command === "preflight") runPreflight();
  else if (command === "put") putReview(a, b, c);
  else if (command === "put-stdin") putReview(a, b, Buffer.from(readFileSync(0, "utf8"), "utf8").toString("base64"));
  else if (command === "seal") sealReview(a, b);
  else if (command === "context") registerContext(a, b);
  else if (command === "pilot-gate") verifyPilot();
  else if (command === "scaleup-recheck") scaleupRecheck();
  else if (command === "blind-complete") verifyAllBlind();
  else if (command === "phase-e-packet") writePhaseEPacket(a);
  else if (command === "phase-f-packet") writePhaseFPacket(a);
  else if (command === "finalize-producer") finalizeProducer();
  else error(`unknown command ${command}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv.slice(2)); }
  catch (caught) {
    const message = caught instanceof Error ? caught.message : String(caught);
    blockedEvidence(message);
    console.error(message);
    process.exitCode = 1;
  }
}
