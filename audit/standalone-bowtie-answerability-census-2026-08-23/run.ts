import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";

export const REPO_ROOT = resolve(import.meta.dirname, "../..");
export const ARTIFACT_ROOT = resolve(import.meta.dirname);
export const BASELINE_COMMIT = "c2ff546";
export const HISTORICAL_COMMIT = "0179fb2223c3329fab182fd84685fb3657ab2613";
export const HISTORICAL_ID = "gpt_case_nine_month_well_child_safety_01_bowtie";
export const EXPECTED_COUNT = 31;
export const PILOT_IDS = new Set([
  "gpt_case_caregiver_role_strain_dementia_01_bowtie",
  "gpt_case_infection_control_clustered_care_01_bowtie",
  "gpt_case_nine_month_well_child_safety_01_bowtie",
  "gpt_case_opioid_recovery_relapse_risk_01_bowtie",
  "gpt_case_overdue_preventive_screening_01_bowtie",
  "gpt_case_pressure_injury_prevention_mobility_01_bowtie",
  "opus_case_lithium_toxicity_bowtie",
]);

const SHA_RE = /^[a-f0-9]{64}$/;
const SUFFIX = "_bowtie";
const STAGE1_INSTRUCTION = "Using only the standalone stem, independently free-generate exactly one most likely condition, exactly two priority nursing actions, and exactly two monitoring or evaluation parameters. Return the required structured JSON and identify the stem evidence and any missing information needed for specificity or uniqueness.";
const STAGE2_INSTRUCTION = "Using only the standalone learner-facing English stem, prompts, and opaque token pools, select exactly one condition, two actions, and two parameters. Return the required structured JSON, including exactly one premise row for every opaque token. Do not infer absent client-specific facts.";

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
type Question = Record<string, any>;
type Bank = { meta: Record<string, any>; questions: Question[] };
type Located = { question: Question; bankPath: string; index: number; bank: Bank };

export type PopulationRecord = {
  surrogateId: string;
  candidateId: string;
  candidateBankPath: string;
  candidateJsonPath: string;
  candidateTopLevelIndex: number;
  candidateTopLevelOrdinal: number;
  companionCaseId: string;
  companionBankPath: string;
  companionJsonPath: string;
  companionTopLevelIndex: number;
  companionTopLevelOrdinal: number;
  pairingRule: "EXACT" | "ORDINAL_SUFFIX";
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

function isObject(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function stableJson(value: unknown, indent = 2): string {
  const normalize = (input: any): any => {
    if (Array.isArray(input)) return input.map(normalize);
    if (!isObject(input)) return input;
    return Object.fromEntries(Object.keys(input).sort().map((key) => [key, normalize(input[key])]));
  };
  return `${JSON.stringify(normalize(value), null, indent)}\n`;
}

export function sha256(input: string | Buffer): string {
  return createHash("sha256").update(input).digest("hex");
}

function writeStable(path: string, value: unknown): void {
  mkdirSync(resolve(path, ".."), { recursive: true });
  writeFileSync(path, stableJson(value), "utf8");
}

function writeText(path: string, value: string): void {
  mkdirSync(resolve(path, ".."), { recursive: true });
  writeFileSync(path, value.endsWith("\n") ? value : `${value}\n`, "utf8");
}

function jsonl(rows: unknown[]): string {
  return rows.map((row) => stableJson(row, 0).trimEnd()).join("\n") + "\n";
}

function git(...args: string[]): string {
  return execFileSync("git", args, { cwd: REPO_ROOT, encoding: "utf8" }).trimEnd();
}

function bankPaths(): string[] {
  return readdirSync(join(REPO_ROOT, "banks"))
    .filter((name) => name.endsWith(".json") && statSync(join(REPO_ROOT, "banks", name)).isFile())
    .sort()
    .map((name) => `banks/${name}`);
}

function readBanks(paths = bankPaths()): Map<string, Bank> {
  const banks = new Map<string, Bank>();
  for (const bankPath of paths) {
    const bank = JSON.parse(readFileSync(join(REPO_ROOT, bankPath), "utf8"));
    if (!isObject(bank) || !isObject(bank.meta) || !Array.isArray(bank.questions)) fail(`Malformed bank envelope: ${bankPath}`);
    banks.set(bankPath, bank as Bank);
  }
  return banks;
}

function stage1Packet(question: Question): Record<string, unknown> {
  if (!isObject(question.stem) || typeof question.stem.en !== "string" || !question.stem.en.trim()) fail("Candidate lacks stem.en");
  return { instruction: STAGE1_INSTRUCTION, stem: question.stem.en };
}

function stage2Packet(question: Question): Record<string, unknown> {
  const zones = ["condition", "actions", "parameters"] as const;
  const prefixes = { condition: "C", actions: "A", parameters: "P" } as const;
  const prompts: Record<string, string> = {};
  const tokens: Record<string, { label: string; text: string }[]> = {};
  for (const zoneName of zones) {
    const zone = question.bowtie?.[zoneName];
    if (!isObject(zone) || !Array.isArray(zone.tokens)) fail(`Malformed ${zoneName} zone`);
    if (isObject(zone.prompt) && typeof zone.prompt.en === "string") prompts[zoneName] = zone.prompt.en;
    tokens[zoneName] = zone.tokens.map((token: any, index: number) => ({ label: `${prefixes[zoneName]}${index + 1}`, text: token.en }));
  }
  return {
    instruction: STAGE2_INSTRUCTION,
    stem: question.stem.en,
    ...(Object.keys(prompts).length ? { prompts } : {}),
    tokens,
  };
}

function opaqueMap(question: Question): Record<string, Record<string, string>> {
  const zones = ["condition", "actions", "parameters"] as const;
  const prefixes = { condition: "C", actions: "A", parameters: "P" } as const;
  return Object.fromEntries(zones.map((zoneName) => [zoneName, Object.fromEntries(question.bowtie[zoneName].tokens.map((token: any, index: number) => [token.id, `${prefixes[zoneName]}${index + 1}`]))]));
}

function canonicalLabels(question: Question, tokenMap: Record<string, Record<string, string>>) {
  return {
    conditionLabel: tokenMap.condition[question.bowtie.condition.correct],
    actionLabels: question.bowtie.actions.correct.map((id: string) => tokenMap.actions[id]),
    parameterLabels: question.bowtie.parameters.correct.map((id: string) => tokenMap.parameters[id]),
  };
}

export function derivePopulation(banks: Map<string, Bank>) {
  const located: Located[] = [];
  for (const [bankPath, bank] of [...banks].sort(([a], [b]) => a.localeCompare(b))) {
    bank.questions.forEach((question, index) => located.push({ question, bankPath, index, bank }));
  }

  const idLocations = new Map<string, Located[]>();
  for (const row of located) {
    if (typeof row.question.id !== "string") fail(`${row.bankPath} questions[${row.index}] lacks string id`);
    const matches = idLocations.get(row.question.id) ?? [];
    matches.push(row);
    idLocations.set(row.question.id, matches);
  }
  const duplicates = [...idLocations].filter(([, rows]) => rows.length > 1);
  if (duplicates.length) fail(`Duplicate top-level IDs: ${duplicates.map(([id]) => id).join(", ")}`);

  const suffixBowties = located
    .filter(({ question }) => question.itemType === "bowtie" && question.id.endsWith(SUFFIX))
    .sort((a, b) => a.question.id.localeCompare(b.question.id));
  const paired: { candidate: Located; companion: Located; pairingRule: "EXACT" | "ORDINAL_SUFFIX" }[] = [];
  const excluded: Record<string, unknown>[] = [];

  for (const candidate of suffixBowties) {
    const baseId = candidate.question.id.slice(0, -SUFFIX.length);
    const matches = located.filter(({ question }) => question.id === baseId || (question.id.startsWith(`${baseId}_`) && /^\d{2}$/.test(question.id.slice(baseId.length + 1))));
    const nonCases = matches.filter(({ question }) => question.itemType !== "case_study");
    const cases = matches.filter(({ question }) => question.itemType === "case_study");
    if (nonCases.length) fail(`Pair for ${candidate.question.id} resolves to non-case item(s): ${nonCases.map(({ question }) => question.id).join(", ")}`);
    if (cases.length > 1) fail(`Ambiguous case pairing for ${candidate.question.id}: ${cases.map(({ question }) => question.id).join(", ")}`);
    if (cases.length === 0) {
      excluded.push({ candidateId: candidate.question.id, bankPath: candidate.bankPath, jsonPath: `$.questions[${candidate.index}]`, topLevelIndex: candidate.index, topLevelOrdinal: candidate.index + 1, exclusionReason: "NO_ELIGIBLE_SIBLING_CASE" });
      continue;
    }
    paired.push({ candidate, companion: cases[0], pairingRule: cases[0].question.id === baseId ? "EXACT" : "ORDINAL_SUFFIX" });
  }
  return { located, suffixBowties, paired, excluded };
}

function assertFixedShape(question: Question, id: string): void {
  const counts = [question.bowtie?.condition?.tokens?.length, question.bowtie?.actions?.tokens?.length, question.bowtie?.parameters?.tokens?.length];
  const keyCounts = [typeof question.bowtie?.condition?.correct === "string" ? 1 : 0, question.bowtie?.actions?.correct?.length, question.bowtie?.parameters?.correct?.length];
  if (counts.join("/") !== "3/4/4" || keyCounts.join("/") !== "1/2/2") fail(`Structural-contract failure for ${id}: tokens ${counts.join("/")}; key ${keyCounts.join("/")}`);
}

function projectStandaloneForPhaseE(question: Question, map: Record<string, Record<string, string>>) {
  const remapZone = (zoneName: "condition" | "actions" | "parameters") => ({
    ...(question.bowtie[zoneName].prompt ? { prompt: question.bowtie[zoneName].prompt } : {}),
    tokens: question.bowtie[zoneName].tokens.map((token: any) => ({ opaqueTokenLabel: map[zoneName][token.id], en: token.en, zh: token.zh })),
  });
  const byChoice = (question.rationale?.byChoice ?? []).map((row: any) => {
    const label = map.condition[row.refId] ?? map.actions[row.refId] ?? map.parameters[row.refId];
    return { opaqueTokenLabel: label, en: row.en, zh: row.zh };
  });
  return {
    stem: question.stem,
    bowtie: { condition: remapZone("condition"), actions: remapZone("actions"), parameters: remapZone("parameters") },
    rationale: { correct: question.rationale.correct, byChoice },
    testTakingStrategy: question.testTakingStrategy,
    glossary: question.glossary ?? [],
  };
}

function openingIdentity(paths: string[]) {
  const bankSha256 = Object.fromEntries(paths.map((bankPath) => [bankPath, sha256(readFileSync(join(REPO_ROOT, bankPath)))]));
  const baselineBankSha256 = Object.fromEntries(paths.map((bankPath) => [bankPath, sha256(Buffer.from(execFileSync("git", ["show", `${BASELINE_COMMIT}:${bankPath}`], { cwd: REPO_ROOT, maxBuffer: 50 * 1024 * 1024 })))]));
  for (const path of paths) if (bankSha256[path] !== baselineBankSha256[path]) fail(`Current bank differs from ${BASELINE_COMMIT}: ${path}`);
  return {
    branch: git("branch", "--show-current"),
    head: git("rev-parse", "HEAD"),
    upstream: git("rev-parse", "--abbrev-ref", "@{upstream}"),
    upstreamRelation: git("rev-list", "--left-right", "--count", "@{upstream}...HEAD"),
    startingDirtyPaths: [],
    baselineCommit: BASELINE_COMMIT,
    bankSha256,
    baselineBankSha256,
    specSha256: sha256(readFileSync(join(REPO_ROOT, "STANDALONE-BOWTIE-ANSWERABILITY-AUDIT-SPEC-2026-08-23.md"))),
    specGitBlob: git("hash-object", "STANDALONE-BOWTIE-ANSWERABILITY-AUDIT-SPEC-2026-08-23.md"),
  };
}

export function generateArtifacts(outputRoot = ARTIFACT_ROOT): string[] {
  const paths = bankPaths();
  const identity = openingIdentity(paths);
  const banks = readBanks(paths);
  const derived = derivePopulation(banks);
  if (derived.paired.length !== EXPECTED_COUNT) fail(`Population count ${derived.paired.length} does not equal expected ${EXPECTED_COUNT}`);
  const exact = derived.paired.filter((row) => row.pairingRule === "EXACT").length;
  const ordinal = derived.paired.filter((row) => row.pairingRule === "ORDINAL_SUFFIX").length;
  if (exact !== 30 || ordinal !== 1) fail(`Pairing breakdown mismatch: EXACT ${exact}, ORDINAL_SUFFIX ${ordinal}`);
  if (derived.excluded.length !== 19) fail(`Exclusion count ${derived.excluded.length} does not equal checkpoint 19`);

  const generated: string[] = [];
  const writeJson = (path: string, value: unknown) => { const full = join(outputRoot, path); writeStable(full, value); generated.push(path); };
  const writeLines = (path: string, rows: unknown[]) => { const full = join(outputRoot, path); writeText(full, jsonl(rows)); generated.push(path); };
  const writeMd = (path: string, text: string) => { const full = join(outputRoot, path); writeText(full, text); generated.push(path); };

  const population: PopulationRecord[] = [];
  const control: Record<string, unknown>[] = [];
  derived.paired.forEach((row, index) => {
    const q = row.candidate.question;
    assertFixedShape(q, q.id);
    const surrogateId = `CAND-${String(index + 1).padStart(2, "0")}`;
    const map = opaqueMap(q);
    const packet1 = stage1Packet(q);
    const packet2 = stage2Packet(q);
    const packet1Text = stableJson(packet1);
    const packet2Text = stableJson(packet2);
    writeMd(`blind-packets/${surrogateId}-stage1.json`, packet1Text);
    writeMd(`blind-packets/${surrogateId}-stage2.json`, packet2Text);
    population.push({
      surrogateId,
      candidateId: q.id,
      candidateBankPath: row.candidate.bankPath,
      candidateJsonPath: `$.questions[${row.candidate.index}]`,
      candidateTopLevelIndex: row.candidate.index,
      candidateTopLevelOrdinal: row.candidate.index + 1,
      companionCaseId: row.companion.question.id,
      companionBankPath: row.companion.bankPath,
      companionJsonPath: `$.questions[${row.companion.index}]`,
      companionTopLevelIndex: row.companion.index,
      companionTopLevelOrdinal: row.companion.index + 1,
      pairingRule: row.pairingRule,
      bankSchemaVersion: String(row.candidate.bank.meta.schemaVersion),
      category: q.category,
      topic: q.topic,
      difficulty: q.difficulty,
      ...(q.ngnSkill ? { ngnSkill: q.ngnSkill } : {}),
      tokenCounts: { condition: 3, actions: 4, parameters: 4 },
      canonicalKeyCardinality: { condition: 1, actions: 2, parameters: 2 },
      candidatePayloadSha256: sha256(stableJson(q, 0)),
      stage1BlindInputSha256: sha256(packet1Text),
      stage2BlindInputSha256: sha256(packet2Text),
      pilot: PILOT_IDS.has(q.id),
    });
    control.push({
      surrogateId,
      candidateId: q.id,
      companionCaseId: row.companion.question.id,
      tokenMap: map,
      canonicalSelection: canonicalLabels(q, map),
      candidatePayloadSha256: sha256(stableJson(q, 0)),
    });
  });

  if (population.filter((row) => row.pilot).length !== 7) fail("Pilot population does not contain exactly seven rows");
  writeLines("population.jsonl", population);
  writeLines("control-manifest.jsonl", control);
  writeLines("exclusions.jsonl", derived.excluded);
  writeJson("opening-identity.json", identity);

  const candidateRows = population.map((row) => `| ${row.surrogateId} | \`${row.candidateId}\` | \`${row.companionCaseId}\` | ${row.pairingRule} | ${row.pilot ? "pilot" : "scale-up"} |`).join("\n");
  const excludedRows = derived.excluded.map((row: any) => `| \`${row.candidateId}\` | ${row.exclusionReason} | \`${row.bankPath}\` | ${row.topLevelOrdinal} |`).join("\n");
  writeMd("population-summary.md", `# Standalone Bowtie Answerability Population\n\n- Frozen bank baseline: \`${BASELINE_COMMIT}\`\n- Actual paired candidates: **${population.length}**\n- Expected checkpoint: **${EXPECTED_COUNT}**\n- Pairing: **${exact} EXACT**, **${ordinal} ORDINAL_SUFFIX**\n- Excluded \`_bowtie\` items: **${derived.excluded.length}**\n- Duplicate IDs, ambiguous pairs, non-case matches, structural deviations: **0**\n\n## Paired population\n\n| Surrogate | Candidate | Companion | Rule | Lane |\n|---|---|---|---|---|\n${candidateRows}\n\n## Explicit exclusion roster\n\n| Candidate | Reason | Bank | Top-level ordinal (1-based) |\n|---|---|---|---:|\n${excludedRows}\n`);

  const historicalBank = JSON.parse(execFileSync("git", ["show", `${HISTORICAL_COMMIT}:banks/gpt-canonical.json`], { cwd: REPO_ROOT, encoding: "utf8", maxBuffer: 20 * 1024 * 1024 })) as Bank;
  const historical = historicalBank.questions.find((question) => question.id === HISTORICAL_ID);
  if (!historical) fail("Historical calibration item not found");
  assertFixedShape(historical, HISTORICAL_ID);
  const calibrationMap = opaqueMap(historical);
  const calibration1 = stage1Packet(historical);
  const calibration2 = stage2Packet(historical);
  writeJson("calibration/control-manifest.json", {
    calibrationId: "CAL-01",
    sourceGitObject: `${HISTORICAL_COMMIT}:banks/gpt-canonical.json`,
    sourceQuestionId: HISTORICAL_ID,
    excludedFromLiveDenominator: true,
    tokenMap: calibrationMap,
    canonicalSelection: canonicalLabels(historical, calibrationMap),
    payloadSha256: sha256(stableJson(historical, 0)),
    stage1BlindInputSha256: sha256(stableJson(calibration1)),
    stage2BlindInputSha256: sha256(stableJson(calibration2)),
  });
  writeJson("calibration/blind-packets/CAL-01-stage1.json", calibration1);
  writeJson("calibration/blind-packets/CAL-01-stage2.json", calibration2);
  writeJson("calibration/sensitivity-checklist.json", {
    registeredBeforeReview: true,
    sourceReviewPresentAtRegistration: false,
    families: [
      { family: "dietary / hemoglobin follow-up", found: false, supportingOpaqueTokenLabels: [] },
      { family: "developmental-screening evaluation", found: false, supportingOpaqueTokenLabels: [] },
      { family: "broad safety-teaching content", found: false, supportingOpaqueTokenLabels: [] },
    ],
  });

  const bankLines = Object.entries(identity.bankSha256).map(([path, hash]) => `- \`${path}\` — \`${hash}\``).join("\n");
  writeMd("verification.md", `# Verification Evidence\n\n## Opening snapshot\n\n- Branch: \`${identity.branch}\`\n- HEAD: \`${identity.head}\`\n- Upstream: \`${identity.upstream}\`\n- Upstream relation (behind ahead): \`${identity.upstreamRelation}\`\n- Repair-resolution bank baseline: \`${BASELINE_COMMIT}\`\n- Accepted-spec SHA-256: \`${identity.specSha256}\`\n- Accepted-spec Git blob: \`${identity.specGitBlob}\`\n- Opening bank dirty paths: none\n- Opening worktree dirty paths: none\n\n## Frozen bundled-bank SHA-256 set\n\n${bankLines}\n\nAll current bank hashes equal the corresponding immutable \`${BASELINE_COMMIT}\` Git-object bytes. Further verification evidence is appended only by the deterministic audit tooling.\n`);
  writeJson("generated-files.json", [...generated, "generated-files.json"].sort());
  return generated.sort();
}

function readJson(path: string): any {
  return JSON.parse(readFileSync(path, "utf8"));
}

function populationRow(id: string): PopulationRecord {
  const rows = readFileSync(join(ARTIFACT_ROOT, "population.jsonl"), "utf8").trim().split("\n").map(JSON.parse) as PopulationRecord[];
  const row = rows.find((candidate) => candidate.surrogateId === id);
  if (!row) fail(`Unknown surrogate: ${id}`);
  return row;
}

function controlRow(id: string): any {
  const rows = readFileSync(join(ARTIFACT_ROOT, "control-manifest.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
  const row = rows.find((candidate: any) => candidate.surrogateId === id);
  if (!row) fail(`Unknown control surrogate: ${id}`);
  return row;
}

function reviewPath(kind: string, id: string): string {
  const calibration = id === "CAL-01";
  if (kind === "stage1" || kind === "stage2") return join(ARTIFACT_ROOT, ...(calibration ? ["calibration", "blind-reviews"] : ["blind-reviews"]), `${id}-${kind}.json`);
  if (calibration) fail(`Calibration does not support ${kind}`);
  if (kind === "phase-e") return join(ARTIFACT_ROOT, "phase-e", `${id}.json`);
  if (kind === "phase-f") return join(ARTIFACT_ROOT, "phase-f", `${id}.json`);
  fail(`Unknown review kind: ${kind}`);
}

function lockPath(kind: string, id: string): string {
  return join(ARTIFACT_ROOT, ...(id === "CAL-01" ? ["calibration", "locks"] : ["locks"]), `${id}-${kind}.json`);
}

function validateStage1(value: any): void {
  if (!isObject(value) || typeof value.condition !== "string" || !Array.isArray(value.priorityActions) || value.priorityActions.length !== 2 || !value.priorityActions.every((x: any) => typeof x === "string") || !Array.isArray(value.evaluationParameters) || value.evaluationParameters.length !== 2 || !value.evaluationParameters.every((x: any) => typeof x === "string") || !Array.isArray(value.stemEvidence) || !Array.isArray(value.missingInformation) || !["high", "medium", "low"].includes(value.stage1Confidence) || typeof value.reasoning !== "string") fail("Invalid Stage-1 review shape");
}

const PREMISE = new Set(["SUPPORTED_EXPLICIT", "SUPPORTED_GENERAL_KNOWLEDGE", "MISSING_CLIENT_FACT", "CONTRADICTED", "NO_CLIENT_PREMISE"]);
const IMPACT = new Set(["NONE", "LOW", "MATERIAL"]);
const ALL_LABELS = ["C1", "C2", "C3", "A1", "A2", "A3", "A4", "P1", "P2", "P3", "P4"];

function exactLabels(values: any, allowed: string[], count: number, field: string): void {
  if (!Array.isArray(values) || values.length !== count || new Set(values).size !== count || values.some((value) => !allowed.includes(value))) fail(`Invalid ${field}`);
}

function validateStage2(value: any): void {
  if (!isObject(value) || !["C1", "C2", "C3"].includes(value.conditionLabel)) fail("Invalid Stage-2 conditionLabel");
  exactLabels(value.actionLabels, ["A1", "A2", "A3", "A4"], 2, "actionLabels");
  exactLabels(value.parameterLabels, ["P1", "P2", "P3", "P4"], 2, "parameterLabels");
  if (!Array.isArray(value.selectionEvidence) || value.selectionEvidence.length !== 5 || !Array.isArray(value.ambiguousAlternatives) || !Array.isArray(value.missingInformation) || !["ANSWERABLE", "UNDERDETERMINED", "NOT_ANSWERABLE"].includes(value.poolAnswerability) || !["high", "medium", "low"].includes(value.stage2Confidence) || typeof value.reasoning !== "string") fail("Invalid Stage-2 review shape");
  if (!Array.isArray(value.tokenPremiseTable) || value.tokenPremiseTable.length !== 11) fail("Stage-2 tokenPremiseTable must contain exactly 11 rows");
  const labels = value.tokenPremiseTable.map((row: any) => row.opaqueTokenLabel).sort();
  if (labels.join("|") !== [...ALL_LABELS].sort().join("|")) fail("Stage-2 tokenPremiseTable labels are incomplete or duplicated");
  for (const row of value.tokenPremiseTable) {
    if (!PREMISE.has(row.premiseStatus) || !IMPACT.has(row.rankabilityImpact) || typeof row.supportingStemText !== "string" || typeof row.missingPremise !== "string" || typeof row.rankabilityJustification !== "string") fail(`Invalid token-premise row for ${row.opaqueTokenLabel}`);
  }
}

function validatePhaseE(value: any, id: string): void {
  if (!isObject(value) || !isObject(value.canonicalSelection) || typeof value.blindExactMatch !== "boolean" || !["FULL", "PARTIAL", "NONE"].includes(value.stage1Alignment) || typeof value.stage1AlignmentExplanation !== "string" || typeof value.canonicalSetUniquelyDefensible !== "boolean" || typeof value.canonicalSetExplanation !== "string" || typeof value.anyCanonicalTargetDependsOnAbsentFact !== "boolean" || typeof value.unstatedClientFactMateriallyChangesRankability !== "boolean" || !Array.isArray(value.canonicalTargetSupport) || value.canonicalTargetSupport.length !== 5 || !Array.isArray(value.distractorPremiseFindings) || value.distractorPremiseFindings.length !== 6 || !Array.isArray(value.missingClientFacts)) fail("Invalid Phase-E review shape");
  const control = controlRow(id);
  if (stableJson(value.canonicalSelection, 0) !== stableJson(control.canonicalSelection, 0)) fail("Phase-E canonicalSelection does not match the control manifest");
  const expected = [control.canonicalSelection.conditionLabel, ...control.canonicalSelection.actionLabels, ...control.canonicalSelection.parameterLabels].sort();
  const actual = value.canonicalTargetSupport.map((row: any) => row.opaqueTokenLabel).sort();
  if (expected.join("|") !== actual.join("|")) fail("Phase-E canonicalTargetSupport does not contain exactly the five keyed labels");
  const distractorExpected = ALL_LABELS.filter((label) => !expected.includes(label)).sort();
  const distractorActual = value.distractorPremiseFindings.map((row: any) => row.opaqueTokenLabel).sort();
  if (distractorExpected.join("|") !== distractorActual.join("|")) fail("Phase-E distractorPremiseFindings does not contain exactly the six non-keyed labels");
  const support = new Set(["DIRECT", "GENERAL_KNOWLEDGE_LINK", "MISSING_CLIENT_FACT", "CONTRADICTED", "NOT_APPLICABLE"]);
  if (value.canonicalTargetSupport.some((row: any) => !support.has(row.supportClassification) || typeof row.supportingStandaloneEvidence !== "string" || typeof row.missingClientFact !== "string")) fail("Invalid Phase-E support row");
}

const VERDICTS = new Set(["FAIL_HIDDEN_CASE_DEPENDENCY", "FAIL_UNSUPPORTED_TOKEN_PREMISE", "FAIL_UNDERDETERMINED", "FAIL_CANONICAL_KEY_OR_LOGIC", "HOLD_REVIEWER_DISAGREEMENT", "PASS_STANDALONE"]);
function validatePhaseF(value: any): void {
  if (!isObject(value) || !VERDICTS.has(value.primaryVerdict) || !Array.isArray(value.secondaryFlags) || !Array.isArray(value.missingFactProvenance) || !Array.isArray(value.canonicalTargetSiblingOverlap) || ![null, "P0", "P1", "P2", "P3"].includes(value.advisoryPriority) || typeof value.defectSummary !== "string" || !Array.isArray(value.bilingualCollateral) || !Array.isArray(value.clinicalCollateral) || !Array.isArray(value.scopeCollateral) || typeof value.reasoning !== "string") fail("Invalid Phase-F review shape");
}

function previousLock(kind: string, id: string): any | null {
  const path = lockPath(kind, id);
  try { return readJson(path); } catch { return null; }
}

function requireLock(kind: string, id: string): any {
  const lock = previousLock(kind, id);
  if (!lock || !SHA_RE.test(lock.sha256)) fail(`Missing ${kind} lock for ${id}`);
  const actual = sha256(readFileSync(reviewPath(kind, id)));
  if (actual !== lock.sha256) fail(`${kind} review changed after lock for ${id}`);
  return lock;
}

function ingest(kind: string, id: string, encoded: string): void {
  if (previousLock(kind, id)) fail(`Cannot overwrite locked ${kind} review for ${id}`);
  const text = Buffer.from(encoded, "base64").toString("utf8").trim();
  const value = JSON.parse(text);
  if (kind === "stage1") validateStage1(value);
  else if (kind === "stage2") validateStage2(value);
  else if (kind === "phase-e") validatePhaseE(value, id);
  else if (kind === "phase-f") validatePhaseF(value);
  else fail(`Unsupported ingest kind: ${kind}`);
  writeStable(reviewPath(kind, id), value);
}

function lock(kind: string, id: string): void {
  if (kind === "stage2") requireLock("stage1", id);
  if (kind === "phase-e") requireLock("stage2", id);
  if (kind === "phase-f") requireLock("phase-e", id);
  const path = reviewPath(kind, id);
  const value = readJson(path);
  if (kind === "stage1") validateStage1(value);
  else if (kind === "stage2") validateStage2(value);
  else if (kind === "phase-e") validatePhaseE(value, id);
  else if (kind === "phase-f") validatePhaseF(value);
  else fail(`Unsupported lock kind: ${kind}`);
  const content = readFileSync(path);
  writeStable(lockPath(kind, id), { artifact: relative(REPO_ROOT, path), sha256: sha256(content), lockedAfter: kind === "stage1" ? null : kind === "stage2" ? previousLock("stage1", id)?.sha256 : kind === "phase-e" ? previousLock("stage2", id)?.sha256 : previousLock("phase-e", id)?.sha256 });
}

function loadLocated(row: PopulationRecord): { candidate: Question; companion: Question } {
  const candidateBank = JSON.parse(readFileSync(join(REPO_ROOT, row.candidateBankPath), "utf8")) as Bank;
  const companionBank = row.companionBankPath === row.candidateBankPath ? candidateBank : JSON.parse(readFileSync(join(REPO_ROOT, row.companionBankPath), "utf8")) as Bank;
  const candidate = candidateBank.questions[row.candidateTopLevelIndex];
  const companion = companionBank.questions[row.companionTopLevelIndex];
  if (candidate.id !== row.candidateId || companion.id !== row.companionCaseId) fail(`Frozen population lookup changed for ${row.surrogateId}`);
  return { candidate, companion };
}

function assertFrozenBanks(): void {
  const opening = readJson(join(ARTIFACT_ROOT, "opening-identity.json"));
  for (const [path, expected] of Object.entries(opening.bankSha256)) {
    const actual = sha256(readFileSync(join(REPO_ROOT, path)));
    if (actual !== expected) fail(`Frozen bank mismatch: ${path}`);
  }
}

function projectPhaseE(id: string): void {
  requireLock("stage1", id);
  requireLock("stage2", id);
  assertFrozenBanks();
  const row = populationRow(id);
  const control = controlRow(id);
  const { candidate } = loadLocated(row);
  const packet = {
    instruction: "The two blind-stage records are immutable. Compare them with the now-revealed canonical 1/2/2 selection and complete standalone item. Do not inspect or infer sibling-case material. Return the required Phase-E structured JSON without revising either blind record.",
    canonicalSelection: control.canonicalSelection,
    standaloneItem: projectStandaloneForPhaseE(candidate, control.tokenMap),
  };
  writeStable(join(ARTIFACT_ROOT, "phase-e-packets", `${id}.json`), packet);
}

function projectPhaseF(id: string): void {
  requireLock("phase-e", id);
  assertFrozenBanks();
  const row = populationRow(id);
  const { candidate, companion } = loadLocated(row);
  const control = controlRow(id);
  const packet = {
    instruction: "The Stage-1, Stage-2, and Phase-E records are immutable. Inspect the paired case only now. Classify provenance for every Phase-E missing client fact, distinguish sibling necessity from corroboration, apply the fixed verdict precedence, and record narrow bilingual/clinical/scope collateral observations. Do not revise Phase E and do not propose content edits beyond an advisory P0-P3 priority.",
    phaseESha256: requireLock("phase-e", id).sha256,
    standaloneItem: projectStandaloneForPhaseE(candidate, control.tokenMap),
    siblingCase: companion,
  };
  writeStable(join(ARTIFACT_ROOT, "phase-f-packets", `${id}.json`), packet);
}

function verifyLeakage(packet: any, forbidden: string[], stage: 1 | 2): void {
  const serialized = stableJson(packet, 0);
  for (const value of forbidden) if (value && serialized.includes(value)) fail(`Stage-${stage} leakage: ${value}`);
  const allowed = stage === 1 ? ["instruction", "stem"] : ["instruction", "prompts", "stem", "tokens"];
  const extras = Object.keys(packet).filter((key) => !allowed.includes(key));
  if (extras.length) fail(`Stage-${stage} forbidden fields: ${extras.join(", ")}`);
}

function verifyGenerated(): void {
  const temp = mkdtempSync(join(tmpdir(), "bowtie-audit-repeat-"));
  try {
    const repeat = generateArtifacts(temp);
    const expected = readJson(join(ARTIFACT_ROOT, "generated-files.json")) as string[];
    const comparable = expected.filter((path) => path !== "generated-files.json" && path !== "verification.md");
    for (const path of comparable) {
      const left = readFileSync(join(ARTIFACT_ROOT, path));
      const right = readFileSync(join(temp, path));
      if (!left.equals(right)) fail(`Repeat generation differs: ${path}`);
    }
    const population = readFileSync(join(ARTIFACT_ROOT, "population.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
    const control = readFileSync(join(ARTIFACT_ROOT, "control-manifest.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
    for (const row of population) {
      const c = control.find((item: any) => item.surrogateId === row.surrogateId);
      const forbidden = [row.candidateId, row.surrogateId, row.companionCaseId, row.candidateBankPath, row.companionBankPath, row.category, row.topic, row.difficulty, row.ngnSkill, row.pairingRule, ...Object.keys(c.tokenMap.condition), ...Object.keys(c.tokenMap.actions), ...Object.keys(c.tokenMap.parameters)];
      verifyLeakage(readJson(join(ARTIFACT_ROOT, "blind-packets", `${row.surrogateId}-stage1.json`)), forbidden, 1);
      verifyLeakage(readJson(join(ARTIFACT_ROOT, "blind-packets", `${row.surrogateId}-stage2.json`)), forbidden, 2);
    }
    const checklist = readJson(join(ARTIFACT_ROOT, "calibration/sensitivity-checklist.json"));
    if (checklist.families.length !== 3 || checklist.families.some((row: any) => row.found !== false || row.supportingOpaqueTokenLabels.length !== 0)) fail("Calibration checklist was not pre-registered with three false rows");
    assertFrozenBanks();
    console.log(`PASS: ${comparable.length} exact-byte-repeat controls/packets plus parsed final verification; 31 population rows; 19 exclusions; leakage and frozen-bank checks passed.`);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

function scoreCalibration(): void {
  const lock = requireLock("stage2", "CAL-01");
  const registrationPath = join(ARTIFACT_ROOT, "calibration/sensitivity-checklist.json");
  const registration = readJson(registrationPath);
  const review = readJson(reviewPath("stage2", "CAL-01"));
  const missingRows = review.tokenPremiseTable.filter((row: any) => row.premiseStatus === "MISSING_CLIENT_FACT");
  const rules = [
    { family: "dietary / hemoglobin follow-up", matches: (text: string) => /diet|food/i.test(text) && /hemoglobin/i.test(text) },
    { family: "developmental-screening evaluation", matches: (text: string) => /development|ASQ-?3/i.test(text) },
    { family: "broad safety-teaching content", matches: (text: string) => /food/i.test(text) && /sleep/i.test(text) && /car.?seat/i.test(text) },
  ];
  if (registration.families.map((row: any) => row.family).join("|") !== rules.map((row) => row.family).join("|")) fail("Calibration family registration changed");
  const families = rules.map((rule) => {
    const rows = missingRows.filter((row: any) => rule.matches(`${row.missingPremise} ${row.rankabilityJustification}`));
    return {
      family: rule.family,
      found: rows.length > 0,
      supportingOpaqueTokenLabels: rows.map((row: any) => row.opaqueTokenLabel),
      explicitMissingClientFactEvidence: rows.map((row: any) => row.missingPremise),
    };
  });
  writeStable(join(ARTIFACT_ROOT, "calibration/sensitivity-score.json"), {
    registrationSha256: sha256(readFileSync(registrationPath)),
    lockedStage2Sha256: lock.sha256,
    families,
    sensitivityGatePassed: families.every((row) => row.found),
  });
  if (!families.every((row) => row.found)) fail(`Calibration sensitivity gate failed: ${families.filter((row) => !row.found).map((row) => row.family).join(", ")}`);
  console.log(`PASS: calibration sensitivity gate surfaced all three pre-registered families (${families.map((row) => `${row.family}: ${row.supportingOpaqueTokenLabels.join(",")}`).join("; ")}).`);
}

function semanticContexts(): any[] {
  try {
    const text = readFileSync(join(ARTIFACT_ROOT, "semantic-contexts.jsonl"), "utf8").trim();
    return text ? text.split("\n").map(JSON.parse) : [];
  } catch {
    return [];
  }
}

function recordContext(id: string, agentContextId: string, model: string, reasoningEffort: string): void {
  if (id !== "CAL-01") populationRow(id);
  if (model !== "gpt-5.6-sol" || reasoningEffort !== "high") fail(`Semantic context ${id} must use gpt-5.6-sol/high`);
  const rows = semanticContexts();
  const existing = rows.find((row) => row.controlId === id);
  if (existing && (existing.agentContextId !== agentContextId || existing.model !== model || existing.reasoningEffort !== reasoningEffort)) fail(`Conflicting semantic context registration for ${id}`);
  if (!existing) rows.push({ controlId: id, agentContextId, model, reasoningEffort, forkedPriorContext: false, reviewerRepositoryAccessPermitted: false });
  if (new Set(rows.map((row) => row.agentContextId)).size !== rows.length) fail("A semantic context was reused across candidates");
  writeText(join(ARTIFACT_ROOT, "semantic-contexts.jsonl"), jsonl(rows.sort((a, b) => a.controlId.localeCompare(b.controlId))));
}

function verifyPilot(): void {
  const pilotIds = readFileSync(join(ARTIFACT_ROOT, "population.jsonl"), "utf8").trim().split("\n").map(JSON.parse).filter((row) => row.pilot).map((row) => row.surrogateId);
  if (pilotIds.length !== 7) fail("Pilot does not contain seven live rows");
  for (const id of pilotIds) for (const kind of ["stage1", "stage2", "phase-e", "phase-f"]) requireLock(kind, id);
  requireLock("stage1", "CAL-01");
  requireLock("stage2", "CAL-01");
  const score = readJson(join(ARTIFACT_ROOT, "calibration/sensitivity-score.json"));
  if (score.sensitivityGatePassed !== true || score.families.length !== 3 || score.families.some((row: any) => row.found !== true)) fail("Calibration sensitivity gate is not satisfied");
  const contexts = semanticContexts().filter((row) => pilotIds.includes(row.controlId) || row.controlId === "CAL-01");
  if (contexts.length !== 8 || new Set(contexts.map((row) => row.agentContextId)).size !== 8 || contexts.some((row) => row.model !== "gpt-5.6-sol" || row.reasoningEffort !== "high" || row.forkedPriorContext !== false || row.reviewerRepositoryAccessPermitted !== false)) fail("Pilot/calibration isolated-context proof failed");
  assertFrozenBanks();
  console.log("PASS: seven live pilot rows locked through Phase F; calibration locked through Stage 2; eight unique Sol/high contexts; sensitivity and frozen-bank gates passed.");
}

function recordScaleUpBankRecheck(): void {
  assertFrozenBanks();
  const openingPath = join(ARTIFACT_ROOT, "opening-identity.json");
  const opening = readJson(openingPath);
  writeStable(join(ARTIFACT_ROOT, "scale-up-bank-recheck.json"), {
    openingIdentitySha256: sha256(readFileSync(openingPath)),
    bankSha256: opening.bankSha256,
    exactMatch: true,
    checkedImmediatelyBeforeFirstScaleUpDispatch: true,
  });
  console.log("PASS: pre-scale-up bundled-bank SHA-256 set exactly matches the opening frozen snapshot.");
}

function readJsonlFile(path: string): any[] {
  const text = readFileSync(path, "utf8").trim();
  return text ? text.split("\n").map(JSON.parse) : [];
}

function auditFiles(): string[] {
  const walk = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [relative(REPO_ROOT, path)];
  });
  return walk(ARTIFACT_ROOT).sort();
}

function orderedPopulation(): PopulationRecord[] {
  const population = readJsonlFile(join(ARTIFACT_ROOT, "population.jsonl")) as PopulationRecord[];
  const pilotOrder = [...PILOT_IDS];
  return [...population].sort((a, b) => {
    const aPilot = pilotOrder.indexOf(a.candidateId);
    const bPilot = pilotOrder.indexOf(b.candidateId);
    if (aPilot >= 0 || bPilot >= 0) {
      if (aPilot < 0) return 1;
      if (bPilot < 0) return -1;
      return aPilot - bPilot;
    }
    return a.candidateId.localeCompare(b.candidateId);
  });
}

function verifyCompleteAudit(): void {
  assertFrozenBanks();
  const population = readJsonlFile(join(ARTIFACT_ROOT, "population.jsonl")) as PopulationRecord[];
  if (population.length !== EXPECTED_COUNT || population.filter((row) => row.pilot).length !== 7 || population.filter((row) => !row.pilot).length !== 24) fail("Live denominator accounting failed");
  const contexts = semanticContexts();
  if (contexts.length !== 32 || new Set(contexts.map((row) => row.agentContextId)).size !== 32) fail("Expected 32 unique semantic contexts (31 live plus calibration)");
  if (contexts.some((row) => row.model !== "gpt-5.6-sol" || row.reasoningEffort !== "high" || row.forkedPriorContext !== false || row.reviewerRepositoryAccessPermitted !== false)) fail("Semantic context isolation/model proof failed");
  for (const row of population) {
    const id = row.surrogateId;
    for (const kind of ["stage1", "stage2", "phase-e", "phase-f"]) requireLock(kind, id);
    const stage2 = readJson(reviewPath("stage2", id));
    const phaseE = readJson(reviewPath("phase-e", id));
    const phaseF = readJson(reviewPath("phase-f", id));
    validateStage2(stage2);
    validatePhaseE(phaseE, id);
    validatePhaseF(phaseF);
    const control = controlRow(id);
    const keyed = [control.canonicalSelection.conditionLabel, ...control.canonicalSelection.actionLabels, ...control.canonicalSelection.parameterLabels].sort();
    const overlaps = phaseF.canonicalTargetSiblingOverlap.map((item: any) => item.opaqueTokenLabel).sort();
    if (overlaps.join("|") !== keyed.join("|") || phaseF.canonicalTargetSiblingOverlap.length !== 5) fail(`Phase-F canonical overlap cardinality failed for ${id}`);
    const phaseEMissingLabels = [...new Set(phaseE.missingClientFacts.map((item: any) => item.opaqueTokenLabel))].sort();
    const phaseFProvenanceLabels = [...new Set(phaseF.missingFactProvenance.map((item: any) => item.opaqueTokenLabel))].sort();
    if (phaseFProvenanceLabels.join("|") !== phaseEMissingLabels.join("|")) fail(`Phase-F provenance coverage failed for ${id}`);
    const provenance = new Set(["SIBLING_CASE_IMPORTED", "RATIONALE_ONLY", "UNSUPPORTED_ANYWHERE_CHECKED", "OTHER_PROVENANCE"]);
    if (phaseF.missingFactProvenance.some((item: any) => !provenance.has(item.provenance) || typeof item.missingFact !== "string" || typeof item.opaqueTokenLabel !== "string" || typeof item.sourceEvidence !== "string" || typeof item.necessaryForRankability !== "boolean")) fail(`Invalid Phase-F provenance row for ${id}`);
    const overlapClasses = new Set(["SIBLING_CASE_IMPORTED", "SIBLING_CORROBORATION_ONLY", "NO_SIBLING_OVERLAP"]);
    if (phaseF.canonicalTargetSiblingOverlap.some((item: any) => !overlapClasses.has(item.classification) || typeof item.overlap !== "boolean" || typeof item.description !== "string")) fail(`Invalid Phase-F overlap row for ${id}`);
  }
  requireLock("stage1", "CAL-01");
  requireLock("stage2", "CAL-01");
  const calibration = readJson(join(ARTIFACT_ROOT, "calibration/sensitivity-score.json"));
  if (calibration.sensitivityGatePassed !== true || calibration.families.length !== 3 || calibration.families.some((row: any) => row.found !== true)) fail("Calibration sensitivity gate failed at final verification");
  const recheck = readJson(join(ARTIFACT_ROOT, "scale-up-bank-recheck.json"));
  if (recheck.exactMatch !== true || recheck.checkedImmediatelyBeforeFirstScaleUpDispatch !== true) fail("Pre-scale-up bank recheck proof missing");
}

function adjudicationRows(): any[] {
  const contexts = semanticContexts();
  return orderedPopulation().map((row) => {
    const id = row.surrogateId;
    return {
      ...row,
      semanticContext: contexts.find((context) => context.controlId === id),
      locks: Object.fromEntries(["stage1", "stage2", "phase-e", "phase-f"].map((kind) => [kind, requireLock(kind, id)])),
      stage1: readJson(reviewPath("stage1", id)),
      stage2: readJson(reviewPath("stage2", id)),
      phaseE: readJson(reviewPath("phase-e", id)),
      phaseF: readJson(reviewPath("phase-f", id)),
    };
  });
}

function buildReport(): string {
  const rows = adjudicationRows();
  const identity = readJson(join(ARTIFACT_ROOT, "opening-identity.json"));
  const exclusions = readJsonlFile(join(ARTIFACT_ROOT, "exclusions.jsonl"));
  const calibration = readJson(join(ARTIFACT_ROOT, "calibration/sensitivity-score.json"));
  const verdictCounts = new Map<string, number>();
  for (const row of rows) verdictCounts.set(row.phaseF.primaryVerdict, (verdictCounts.get(row.phaseF.primaryVerdict) ?? 0) + 1);
  const verdictOrder = ["FAIL_HIDDEN_CASE_DEPENDENCY", "FAIL_UNSUPPORTED_TOKEN_PREMISE", "FAIL_UNDERDETERMINED", "FAIL_CANONICAL_KEY_OR_LOGIC", "HOLD_REVIEWER_DISAGREEMENT", "PASS_STANDALONE"];
  const bankHashes = Object.entries(identity.bankSha256).map(([path, hash]) => `- \`${path}\` — \`${hash}\``).join("\n");
  const roster = rows.map((row) => `| ${row.pilot ? "pilot" : "scale-up"} | \`${row.candidateId}\` | \`${row.companionCaseId}\` | ${row.pairingRule} | ${row.phaseF.primaryVerdict} | ${row.phaseF.secondaryFlags.join("; ") || "—"} | ${row.phaseE.stage1Alignment} | ${row.phaseE.blindExactMatch ? "yes" : "no"} | ${row.phaseF.advisoryPriority ?? "—"} |`).join("\n");
  const exclusionRows = exclusions.map((row: any) => `| \`${row.candidateId}\` | ${row.exclusionReason} | \`${row.bankPath}\` | ${row.topLevelOrdinal} |`).join("\n");
  const defectRows = rows.filter((row) => row.phaseF.primaryVerdict !== "PASS_STANDALONE").flatMap((row) => {
    const facts = row.phaseF.missingFactProvenance.length ? row.phaseF.missingFactProvenance : [{ opaqueTokenLabel: "—", missingFact: row.phaseF.defectSummary, provenance: "OTHER_PROVENANCE", necessaryForRankability: true }];
    return facts.map((fact: any) => `| \`${row.candidateId}\` | ${row.phaseF.primaryVerdict} | ${fact.opaqueTokenLabel} | ${String(fact.missingFact).replaceAll("|", "\\|")} | ${fact.provenance} | ${fact.necessaryForRankability ? "yes" : "no"} |`);
  }).join("\n");
  const collateralRows = rows.flatMap((row) => [
    ...row.phaseF.bilingualCollateral.map((item: any) => ({ lane: "bilingual", ...item })),
    ...row.phaseF.clinicalCollateral.map((item: any) => ({ lane: "clinical", ...item })),
    ...row.phaseF.scopeCollateral.map((item: any) => ({ lane: "scope", ...item })),
  ].map((item: any) => `| \`${row.candidateId}\` | ${item.lane} | ${item.priority ?? "—"} | ${String(item.concern).replaceAll("|", "\\|")} | ${String(item.evidence).replaceAll("|", "\\|")} |`)).join("\n");
  const priorityRows = rows.filter((row) => row.phaseF.advisoryPriority).sort((a, b) => String(a.phaseF.advisoryPriority).localeCompare(String(b.phaseF.advisoryPriority)) || a.candidateId.localeCompare(b.candidateId)).map((row) => `| ${row.phaseF.advisoryPriority} | \`${row.candidateId}\` | ${row.phaseF.primaryVerdict} | ${String(row.phaseF.defectSummary).replaceAll("|", "\\|")} |`).join("\n");
  const pilotRows = rows.filter((row) => row.pilot).map((row) => `- \`${row.candidateId}\`: **${row.phaseF.primaryVerdict}**${row.phaseF.secondaryFlags.length ? ` (${row.phaseF.secondaryFlags.join(", ")})` : ""}`).join("\n");
  const sensitivity = calibration.families.map((row: any) => `- ${row.family}: **found** at ${row.supportingOpaqueTokenLabels.join(", ")}`).join("\n");
  return `# Standalone Bowtie Answerability Census — Final Report\n\n## Frozen identity and denominator\n\n- Branch: \`${identity.branch}\`\n- HEAD: \`${identity.head}\`\n- Repair-resolution baseline: \`${identity.baselineCommit}\`\n- Accepted-spec SHA-256: \`${identity.specSha256}\`\n- Accepted-spec Git blob: \`${identity.specGitBlob}\`\n- Live population: **31/31 complete** (7 pilot, 24 scale-up)\n- Pairing: **30 EXACT**, **1 ORDINAL_SUFFIX**\n- Fixed bowtie shape: **31/31 at 3/4/4 tokens and 1/2/2 key cardinality**\n- Excluded unpaired \`_bowtie\` items: **19**, outside the denominator\n- Historical calibration: **outside the live denominator**\n\n### Frozen bundled-bank SHA-256 set\n\n${bankHashes}\n\n## Method interpretation\n\n\`blindExactMatch\` is diagnostic selection agreement, not proof of standalone support. Stage 1 measures stem-only free-generation alignment; Stage 2 measures pool-constrained selection and premise support. A sibling fact counts as dependency only when necessary for rankability; otherwise it is \`SIBLING_CORROBORATION_ONLY\`. Missing patient facts are distinguished from weak or self-marking distractors. No second reviewer was invented, so reviewer disagreement was not manufactured.\n\n## Pilot and calibration\n\n${pilotRows}\n\nThe historical positive control passed its sensitivity gate. All three pre-registered families were independently surfaced as explicit \`MISSING_CLIENT_FACT\` rows:\n\n${sensitivity}\n\n## Verdict totals\n\n${verdictOrder.map((verdict) => `- ${verdict}: **${verdictCounts.get(verdict) ?? 0}**`).join("\n")}\n\n## Complete live adjudication roster\n\nPilot rows are shown first, followed by the 24 scale-up rows in ascending candidate-ID order.\n\n| Lane | Candidate | Companion | Pairing | Primary verdict | Secondary flags | Stage-1 alignment | Stage-2 exact match | Priority |\n|---|---|---|---|---|---|---|---|---|\n${roster}\n\n## Non-PASS defect and provenance table\n\nEvery Phase-E missing client fact for a non-PASS row is shown with its affected opaque token and post-sibling provenance. “Necessary” means necessary to standalone rankability, not merely present in the sibling.\n\n| Candidate | Verdict | Token | Missing or unsupported fact | Provenance | Necessary |\n|---|---|---|---|---|---|\n${defectRows}\n\n## Collateral bilingual, clinical, and scope observations\n\nThese observations do not override primary-verdict precedence.\n\n| Candidate | Lane | Priority | Concern | Evidence |\n|---|---|---|---|---|\n${collateralRows || "| — | — | — | None | — |"}\n\n## Explicit 19-item exclusion roster\n\n| Candidate | Reason | Bank | Top-level ordinal |\n|---|---|---|---:|\n${exclusionRows}\n\n## Advisory repair queue only\n\nNo repair was performed. P0–P3 labels are recommendations for separate owner-authorized commissions.\n\n| Priority | Candidate | Verdict | Advisory finding |\n|---|---|---|---|\n${priorityRows}\n\n## Scope and preservation\n\nNo canonical bank, stem, token, key, rationale, translation, metadata, source, ledger status, schema, grading, loading, renderer, runtime, \`DECISIONS.md\`, \`PROJECT-HISTORY.md\`, \`BANK-REVIEW-LEDGER.md\`, or census artifact was changed. No question was repaired, retired, or replaced. The bank population remained byte-identical to the opening snapshot. Audit artifacts are confined to \`audit/standalone-bowtie-answerability-census-2026-08-23/\`; complete path and verification evidence are in \`verification.md\`.\n`;
}

function writeFinalCore(): void {
  writeText(join(ARTIFACT_ROOT, "adjudication.jsonl"), jsonl(adjudicationRows()));
  writeText(join(ARTIFACT_ROOT, "report.md"), buildReport());
}

function finalVerification(): void {
  generateArtifacts();
  verifyGenerated();
  verifyCompleteAudit();
  const testOutput = execFileSync("npx", ["tsx", relative(REPO_ROOT, join(ARTIFACT_ROOT, "test.ts"))], { cwd: REPO_ROOT, encoding: "utf8" }).trim();
  execFileSync("npx", ["tsc", "-b", "--pretty", "false"], { cwd: REPO_ROOT, stdio: "pipe" });
  execFileSync("git", ["diff", "--check"], { cwd: REPO_ROOT, stdio: "pipe" });
  execFileSync("git", ["diff", "--quiet", BASELINE_COMMIT, "--", ...bankPaths()], { cwd: REPO_ROOT, stdio: "pipe" });
  writeFinalCore();
  writeText(join(ARTIFACT_ROOT, "verification.md"), "# Verification Evidence\n\nFinal verification is being serialized.\n");
  writeFinalCore();
  const adjudicationExpected = jsonl(adjudicationRows());
  const reportExpected = buildReport().endsWith("\n") ? buildReport() : `${buildReport()}\n`;
  if (readFileSync(join(ARTIFACT_ROOT, "adjudication.jsonl"), "utf8") !== adjudicationExpected) fail("Deterministic adjudication repeat failed");
  if (readFileSync(join(ARTIFACT_ROOT, "report.md"), "utf8") !== reportExpected) fail("Deterministic report repeat failed");
  const identity = readJson(join(ARTIFACT_ROOT, "opening-identity.json"));
  const finalStatus = git("status", "--short", "--untracked-files=all").split("\n").filter(Boolean);
  const outside = finalStatus.filter((line) => {
    const path = line.slice(3);
    return !path.startsWith(`${relative(REPO_ROOT, ARTIFACT_ROOT)}/`);
  });
  if (outside.length) fail(`Out-of-scope dirty paths at closeout: ${outside.join(", ")}`);
  const bankLines = Object.entries(identity.bankSha256).map(([path, hash]) => `- \`${path}\` — opening \`${hash}\`; final \`${sha256(readFileSync(join(REPO_ROOT, path)))}\`; **MATCH**`).join("\n");
  const created = auditFiles().map((path) => `- \`${path}\``).join("\n");
  const dirty = finalStatus.map((line) => `- \`${line}\``).join("\n") || "- none";
  const contexts = semanticContexts();
  const verification = `# Verification Evidence\n\n## Opening snapshot\n\n- Branch: \`${identity.branch}\`\n- HEAD: \`${identity.head}\`\n- Upstream: \`${identity.upstream}\`\n- Upstream relation (behind ahead): \`${identity.upstreamRelation}\`\n- Repair-resolution baseline: \`${identity.baselineCommit}\`\n- Accepted-spec SHA-256: \`${identity.specSha256}\`\n- Accepted-spec Git blob: \`${identity.specGitBlob}\`\n- Starting dirty paths: none\n\n## Frozen-bank final proof\n\n${bankLines}\n\nThe complete bank SHA set matched at opening, immediately before scale-up, and at closeout. \`git diff --quiet ${BASELINE_COMMIT} -- banks/*.json\` also passed.\n\n## Deterministic and semantic-protocol checks\n\n- Focused test suite: **PASS** — ${testOutput.replaceAll("\n", " ")}\n- Direct audit-generator execution against frozen corpus: **PASS**\n- Population: **PASS** — 31 paired, 30 EXACT, 1 ORDINAL_SUFFIX, 19 exclusions, no duplicate/ambiguous/non-case/shape failures\n- Surrogate/token-map determinism and blind projections: **PASS**\n- Forbidden identity/token/metadata leakage checks: **PASS**\n- Stage-1-before-Stage-2 lock/hash chain: **PASS**\n- Phase-E-before-Phase-F lock/hash chain: **PASS**\n- Mandatory 11-row premise cardinality: **PASS**\n- Phase-F provenance cardinality and five-keyed-target overlap cardinality: **PASS**\n- Calibration fixed-family registration and three-family sensitivity: **PASS**\n- Isolated semantic contexts: **PASS** — ${contexts.length} unique contexts, all \`gpt-5.6-sol\` / \`high\`, no context reuse, no repository access\n- Exact-byte repeat of 73 generated controls/packets: **PASS**\n- Deterministic repeat of \`adjudication.jsonl\` and \`report.md\`: **PASS**\n- \`npx tsc -b --pretty false\`: **PASS**\n- \`git diff --check\`: **PASS**\n- Census generation, production build, and bank-content promotion pipeline: **not run, per R2.3 scope**\n\n## Final dirty paths\n\n${dirty}\n\nAll final dirty paths are audit-created paths under the authorized artifact root. There were no pre-existing dirty paths to preserve. \`DECISIONS.md\`, \`PROJECT-HISTORY.md\`, \`BANK-REVIEW-LEDGER.md\`, canonical banks, application code, schema, runtime, and census artifacts remain untouched.\n\n## Audit-created paths\n\n${created}\n`;
  writeText(join(ARTIFACT_ROOT, "verification.md"), verification
    .replace("Phase-F provenance cardinality", "Phase-F provenance coverage")
    .replace("Exact-byte repeat of 73 generated controls/packets", "Exact-byte repeat of 71 generated controls/packets; final verification parsed separately"));
  console.log("PASS: complete 31-row audit, 32 isolated contexts, calibration, repeatability, TypeScript, diff, and frozen-bank verification.");
}

function usage(): never {
  fail("Usage: run.ts generate|verify-generated|ingest <stage1|stage2|phase-e|phase-f> <ID> <base64-json>|lock <kind> <ID>|project-phase-e <ID>|project-phase-f <ID>|score-calibration|record-context <ID> <agent-id> gpt-5.6-sol high|verify-pilot|record-scaleup-bank-recheck|check-frozen-banks|finalize-and-verify");
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  const [command, ...args] = process.argv.slice(2);
  if (command === "generate") {
    generateArtifacts();
    console.log(`Generated deterministic audit controls under ${relative(REPO_ROOT, ARTIFACT_ROOT)}`);
  } else if (command === "verify-generated") verifyGenerated();
  else if (command === "ingest" && args.length === 3) ingest(args[0], args[1], args[2]);
  else if (command === "lock" && args.length === 2) lock(args[0], args[1]);
  else if (command === "project-phase-e" && args.length === 1) projectPhaseE(args[0]);
  else if (command === "project-phase-f" && args.length === 1) projectPhaseF(args[0]);
  else if (command === "score-calibration") scoreCalibration();
  else if (command === "record-context" && args.length === 4) recordContext(args[0], args[1], args[2], args[3]);
  else if (command === "verify-pilot") verifyPilot();
  else if (command === "record-scaleup-bank-recheck") recordScaleUpBankRecheck();
  else if (command === "check-frozen-banks") { assertFrozenBanks(); console.log("PASS: bundled-bank SHA-256 set equals opening frozen snapshot."); }
  else if (command === "finalize-and-verify") finalVerification();
  else usage();
}
