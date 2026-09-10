import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { derivePopulation, sha256, stableJson } from "../standalone-bowtie-answerability-census-2026-08-23/run.ts";

type Obj = Record<string, any>;
type Bank = { meta: Obj; questions: Obj[] };

const REPO = resolve(import.meta.dirname, "../..");
const OUT = resolve(import.meta.dirname);
const OPENING = join(OUT, "opening-state.json");
const FROZEN_ADJ = join(REPO, "audit/standalone-bowtie-answerability-census-2026-08-23/adjudication.jsonl");
const UNPAIRED_ADJ = join(REPO, "audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/adjudication.jsonl");
const BASELINE_COMMIT = "c2ff546";

const roster = [
  ["gpt_case_caregiver_role_strain_dementia_01_bowtie", "banks/gpt-canonical.json", "FAIL_HIDDEN_CASE_DEPENDENCY", "7b2d554215d8a3c2249aaa9bd595721793b4f3a439663e74e76efabe5a3ff6e1"],
  ["gpt_case_infection_control_clustered_care_01_bowtie", "banks/gpt-canonical.json", "FAIL_HIDDEN_CASE_DEPENDENCY", "9257f536a25485a9761d3f004f6deb2679177570b83a6937f1e65ef880d45daf"],
  ["gpt_case_acute_hemolytic_transfusion_reaction_01_bowtie", "banks/gpt-canonical.json", "FAIL_HIDDEN_CASE_DEPENDENCY", "789d52ef3191509f938526bdd66cbfb6fc32d6ee1bbb45b4a14b2c2b33f0da65"],
  ["gpt_case_client_advocacy_refusal_01_bowtie", "banks/gpt-canonical.json", "FAIL_HIDDEN_CASE_DEPENDENCY", "d601c32d131bb984399cbb131b98f3c995e4fe1ef2512ddb1d30c61757172521"],
  ["gpt_case_lateral_incivility_01_bowtie", "banks/gpt-canonical.json", "FAIL_HIDDEN_CASE_DEPENDENCY", "fea2d76c8716a73087600efe5fd026a33cb36e5b19f28dde067b940ff57e9563"],
  ["gpt_case_mass_casualty_start_triage_01_bowtie", "banks/gpt-canonical.json", "FAIL_HIDDEN_CASE_DEPENDENCY", "7cdf149aff899a7cd171c9395ec6ab23b93b571c15cb779dc169d605e1dbd4d6"],
  ["gpt_case_gbs_respiratory_compromise_01_bowtie", "banks/hard-cases-canonical.json", "FAIL_HIDDEN_CASE_DEPENDENCY", "74e4fc43567f17a8eed82ce10fd440372afe4bfde7da0878bda51fb30aa34804"],
  ["gpt_case_hipaa_disclosure_breach_01_bowtie", "banks/gpt-canonical.json", "FAIL_UNSUPPORTED_TOKEN_PREMISE", "9ba8faa3ec3cea8e1668c0460b2888686f1600d52186d7f5b8297dc6ae332984"],
  ["gpt_case_neutropenic_fever_nadir_01_bowtie", "banks/gpt-canonical.json", "FAIL_UNSUPPORTED_TOKEN_PREMISE", "f8e8ca6eddd5f48cf67ef7ea5a51d9eb5bcfea2c67def6b50eafcbf0818ac00b"],
  ["gpt_case_unsafe_premature_discharge_01_bowtie", "banks/gpt-canonical.json", "FAIL_UNSUPPORTED_TOKEN_PREMISE", "d9462741c338b5041762f5f4a4c51cffd17bd54d34d17839c381b02cbd59bf5e"],
  ["gpt_pph_2026_06_16_case_01_bowtie", "banks/hard-cases-canonical.json", "FAIL_UNSUPPORTED_TOKEN_PREMISE", "efcc3588cf2750744fb89be66529904081f6953d6158505dfc694e48086fed39"],
  ["gpt_format7c_exercise_hypoglycemia_bowtie", "banks/gpt-canonical.json", "FAIL_UNSUPPORTED_TOKEN_PREMISE", "df41a515bafd2325afb0a63fa1b3050ae5d6c6165213af41314d8e3e8dc8ad81"],
] as const;

const digest = (value: Buffer | string) => createHash("sha256").update(value).digest("hex");
const fileDigest = (path: string) => digest(readFileSync(path));
const parseJson = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const parseJsonl = (path: string): Obj[] => readFileSync(path, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const git = (...args: string[]) => execFileSync("git", args, { cwd: REPO, encoding: "utf8" }).trim();
const fail = (message: string): never => { throw new Error(`CAMPAIGN16_PHASE_D_BLOCKED: ${message}`); };
const writeJson = (name: string, value: unknown) => writeFileSync(join(OUT, name), stableJson(value), "utf8");
const writeJsonl = (name: string, rows: unknown[]) => writeFileSync(join(OUT, name), rows.map((row) => stableJson(row, 0).trimEnd()).join("\n") + "\n", "utf8");

function bankPaths(): string[] {
  return readdirSync(join(REPO, "banks"))
    .filter((name) => name.endsWith(".json") && statSync(join(REPO, "banks", name)).isFile())
    .sort()
    .map((name) => `banks/${name}`);
}

function readBanks(): Map<string, Bank> {
  const banks = new Map<string, Bank>();
  for (const path of bankPaths()) {
    const bank = parseJson(join(REPO, path));
    if (!bank || typeof bank !== "object" || !Array.isArray(bank.questions)) fail(`malformed bundled bank ${path}`);
    banks.set(path, bank as Bank);
  }
  return banks;
}

function counts(question: Obj) {
  return {
    tokens: {
      condition: question.bowtie?.condition?.tokens?.length,
      actions: question.bowtie?.actions?.tokens?.length,
      parameters: question.bowtie?.parameters?.tokens?.length,
    },
    key: {
      condition: typeof question.bowtie?.condition?.correct === "string" ? 1 : 0,
      actions: question.bowtie?.actions?.correct?.length,
      parameters: question.bowtie?.parameters?.correct?.length,
    },
  };
}

function assertOpeningUnchanged(opening: Obj) {
  const rows = opening.dirtyPaths.map((row: Obj) => {
    const full = join(REPO, row.path);
    const observedFileSha256 = statSync(full).isFile() ? fileDigest(full) : null;
    let observedIndexBlob: string | null = null;
    if (row.tracked) observedIndexBlob = git("rev-parse", `:${row.path}`);
    return {
      path: row.path,
      expectedFileSha256: row.fileSha256,
      observedFileSha256,
      expectedIndexBlob: row.indexBlob,
      observedIndexBlob,
      match: observedFileSha256 === row.fileSha256 && observedIndexBlob === row.indexBlob,
    };
  });
  const failures = rows.filter((row: Obj) => !row.match);
  if (failures.length) fail(`opening dirty/index drift: ${failures.map((row: Obj) => row.path).join(", ")}`);
  return rows;
}

function main() {
  const opening = parseJson(OPENING);
  if (opening.branch !== git("branch", "--show-current") || opening.head !== git("rev-parse", "HEAD")) fail("branch or HEAD changed since opening freeze");
  const openingPreservation = assertOpeningUnchanged(opening);
  const paths = bankPaths();
  if (paths.length !== 13) fail(`expected 13 bundled banks, observed ${paths.length}`);
  const banks = readBanks();
  const population = derivePopulation(banks as any);
  const locations = new Map<string, Array<{ bankPath: string; index: number; question: Obj }>>();
  for (const [bankPath, bank] of banks) bank.questions.forEach((question, index) => {
    const rows = locations.get(question.id) ?? [];
    rows.push({ bankPath, index, question });
    locations.set(question.id, rows);
  });

  const frozenRows = parseJsonl(FROZEN_ADJ);
  const unpairedRows = parseJsonl(UNPAIRED_ADJ);
  const targetRows = roster.map(([candidateId, expectedBank, primaryVerdict, expectedPayloadSha256], ordinal) => {
    const matches = locations.get(candidateId) ?? [];
    if (matches.length !== 1) fail(`${candidateId} matched ${matches.length} top-level records`);
    const live = matches[0];
    if (live.bankPath !== expectedBank) fail(`${candidateId} routed to ${live.bankPath}, expected ${expectedBank}`);
    const observedPayloadSha256 = sha256(stableJson(live.question, 0));
    if (observedPayloadSha256 !== expectedPayloadSha256) fail(`${candidateId} payload ${observedPayloadSha256}, expected ${expectedPayloadSha256}`);
    const shape = counts(live.question);
    if (stableJson(shape.tokens, 0) !== stableJson({ condition: 3, actions: 4, parameters: 4 }, 0) || stableJson(shape.key, 0) !== stableJson({ condition: 1, actions: 2, parameters: 2 }, 0)) fail(`${candidateId} fixed shape/key failed`);
    return {
      ordinal: ordinal + 1,
      candidateId,
      bankPath: live.bankPath,
      jsonPath: `$.questions[${live.index}]`,
      topLevelIndex: live.index,
      primaryVerdict,
      expectedPayloadSha256,
      observedPayloadSha256,
      tokenCounts: shape.tokens,
      keyCardinality: shape.key,
      keyIdentity: {
        condition: live.question.bowtie.condition.correct,
        actions: live.question.bowtie.actions.correct,
        parameters: live.question.bowtie.parameters.correct,
      },
      payload: live.question,
    };
  });

  const pairedTargets = targetRows.filter((row) => row.candidateId !== "gpt_format7c_exercise_hypoglycemia_bowtie");
  const companionRows = pairedTargets.map((target) => {
    const frozen = frozenRows.find((row) => row.candidateId === target.candidateId);
    if (!frozen) fail(`missing frozen adjudication row for ${target.candidateId}`);
    const derived = population.paired.find((row: any) => row.candidate.question.id === target.candidateId);
    if (!derived) fail(`live population has no companion for ${target.candidateId}`);
    if (derived.companion.question.id !== frozen.companionCaseId || derived.companion.bankPath !== frozen.companionBankPath || derived.pairingRule !== frozen.pairingRule) fail(`companion resolution drift for ${target.candidateId}`);
    const baselineBank = JSON.parse(execFileSync("git", ["show", `${BASELINE_COMMIT}:${frozen.companionBankPath}`], { cwd: REPO, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }));
    const baselineMatches = baselineBank.questions.filter((question: Obj) => question.id === frozen.companionCaseId);
    if (baselineMatches.length !== 1) fail(`baseline companion ${frozen.companionCaseId} matched ${baselineMatches.length}`);
    const liveHash = sha256(stableJson(derived.companion.question, 0));
    const baselineHash = sha256(stableJson(baselineMatches[0], 0));
    if (liveHash !== baselineHash) fail(`companion c2ff546 identity mismatch for ${target.candidateId}: live ${liveHash}, baseline ${baselineHash}`);
    return {
      candidateId: target.candidateId,
      companionCaseId: frozen.companionCaseId,
      companionBankPath: frozen.companionBankPath,
      pairingRule: frozen.pairingRule,
      livePayloadSha256: liveHash,
      baselinePayloadSha256: baselineHash,
      match: true,
      payload: derived.companion.question,
    };
  });

  const bankRows = paths.map((path) => ({ bankPath: path, fileByteSha256: fileDigest(join(REPO, path)) }));
  const serializationRows = ["banks/gpt-canonical.json", "banks/hard-cases-canonical.json"].map((path) => {
    const bytes = readFileSync(join(REPO, path), "utf8");
    const reserialized = JSON.stringify(JSON.parse(bytes), null, 2) + "\n";
    const stable = bytes === reserialized;
    if (!stable) fail(`${path} serialization stability failed`);
    return { bankPath: path, fileByteSha256: digest(bytes), serializationStable: stable };
  });

  const passingIds = [
    ...frozenRows.filter((row) => row.phaseF?.primaryVerdict === "PASS_STANDALONE").map((row) => row.candidateId),
    ...unpairedRows.filter((row) => row.primaryVerdict === "PASS_STANDALONE").map((row) => row.candidateId),
  ].sort();
  if (passingIds.length !== 38 || new Set(passingIds).size !== 38) fail(`passing preservation set expected 38, observed ${passingIds.length}/${new Set(passingIds).size}`);
  const passingControls = passingIds.map((candidateId) => {
    const matches = locations.get(candidateId) ?? [];
    if (matches.length !== 1) fail(`passing control ${candidateId} matched ${matches.length}`);
    return { candidateId, bankPath: matches[0].bankPath, payloadSha256: sha256(stableJson(matches[0].question, 0)) };
  });

  const targetSet = new Set(targetRows.map((row) => row.candidateId));
  const targetBankSnapshots = serializationRows.map(({ bankPath }) => {
    const bank = banks.get(bankPath)!;
    return {
      bankPath,
      fileByteSha256: fileDigest(join(REPO, bankPath)),
      questionOrder: bank.questions.map((question) => question.id),
      nonTargetPayloads: bank.questions.filter((question) => !targetSet.has(question.id)).map((question) => ({ id: question.id, payloadSha256: sha256(stableJson(question, 0)) })),
    };
  });

  const summary = {
    status: "PASS",
    capturedAt: new Date().toISOString(),
    hashConvention: "sha256(stableJson(question, 0)); stableJson recursively sorts object keys and appends newline",
    repository: { path: REPO, branch: opening.branch, head: opening.head, upstream: opening.upstream, aheadBehind: opening.aheadBehind },
    openingDirtyPathCount: opening.dirtyPathCount,
    openingPreservationCount: openingPreservation.length,
    bundledBankCount: paths.length,
    targetCount: targetRows.length,
    pairedTargetCount: pairedTargets.length,
    companionIdentityCount: companionRows.length,
    passingControlCount: passingControls.length,
    population: { suffixBowties: population.suffixBowties.length, paired: population.paired.length, unpaired: population.excluded.length },
    serializationRows,
    bankRows,
  };
  writeJson("stage0-preflight.json", summary);
  writeJsonl("stage0-targets.jsonl", targetRows);
  writeJsonl("stage0-companions.jsonl", companionRows);
  writeJson("stage0-preservation-controls.json", { passingControls, targetBankSnapshots });
  process.stdout.write(stableJson(summary));
}

main();
