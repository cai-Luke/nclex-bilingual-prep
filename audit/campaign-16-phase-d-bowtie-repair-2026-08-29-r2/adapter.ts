import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { sha256, stableJson } from "../standalone-bowtie-answerability-census-2026-08-23/run.ts";

type Obj = Record<string, any>;

const REPO = resolve(import.meta.dirname, "../..");
const OUT = resolve(import.meta.dirname);
const PAIRED = join(REPO, "audit/standalone-bowtie-answerability-census-2026-08-23");
const UNPAIRED = join(REPO, "audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5");
const TARGETS = join(OUT, "stage0-targets.jsonl");
const COMPANIONS = join(OUT, "stage0-companions.jsonl");
const LABELS = ["C1", "C2", "C3", "A1", "A2", "A3", "A4", "P1", "P2", "P3", "P4"];
const VERDICTS = new Set(["FAIL_HIDDEN_CASE_DEPENDENCY", "FAIL_UNSUPPORTED_TOKEN_PREMISE", "FAIL_UNDERDETERMINED", "FAIL_CANONICAL_KEY_OR_LOGIC", "HOLD_REVIEWER_DISAGREEMENT", "PASS_STANDALONE"]);
const STAGE1_INSTRUCTION = "Using only the standalone stem, independently free-generate exactly one most likely condition, exactly two priority nursing actions, and exactly two monitoring or evaluation parameters. Return the required structured JSON and identify the stem evidence and any missing information needed for specificity or uniqueness.";
const STAGE2_INSTRUCTION = "Using only the standalone learner-facing English stem, prompts, and opaque token pools, select exactly one condition, two actions, and two parameters. Return the required structured JSON, including exactly one premise row for every opaque token. Do not infer absent client-specific facts.";

const fail = (message: string): never => { throw new Error(`CAMPAIGN16_PHASE_D_BLOCKED: adapter fidelity: ${message}`); };
const parseJson = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const parseJsonl = (path: string): Obj[] => readFileSync(path, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const fileHash = (path: string) => sha256(readFileSync(path));
const observedHash = (value: unknown) => sha256(stableJson(value));

function tokenMap(question: Obj): Record<string, Record<string, string>> {
  return {
    condition: Object.fromEntries(question.bowtie.condition.tokens.map((token: Obj, index: number) => [token.id, `C${index + 1}`])),
    actions: Object.fromEntries(question.bowtie.actions.tokens.map((token: Obj, index: number) => [token.id, `A${index + 1}`])),
    parameters: Object.fromEntries(question.bowtie.parameters.tokens.map((token: Obj, index: number) => [token.id, `P${index + 1}`])),
  };
}

export function stage1Packet(question: Obj) {
  if (typeof question.stem?.en !== "string" || !question.stem.en.trim()) fail(`${question.id} lacks stem.en`);
  return { instruction: STAGE1_INSTRUCTION, stem: question.stem.en };
}

export function stage2Packet(question: Obj) {
  const prompts: Record<string, string> = {};
  const tokens: Record<string, Array<{ label: string; text: string }>> = {};
  const zones = ["condition", "actions", "parameters"] as const;
  const prefixes = { condition: "C", actions: "A", parameters: "P" } as const;
  for (const zone of zones) {
    if (typeof question.bowtie[zone].prompt?.en === "string") prompts[zone] = question.bowtie[zone].prompt.en;
    tokens[zone] = question.bowtie[zone].tokens.map((token: Obj, index: number) => ({ label: `${prefixes[zone]}${index + 1}`, text: token.en }));
  }
  return { instruction: STAGE2_INSTRUCTION, stem: question.stem.en, ...(Object.keys(prompts).length ? { prompts } : {}), tokens };
}

export function standaloneProjection(question: Obj, map: Record<string, Record<string, string>>) {
  const projectZone = (zone: "condition" | "actions" | "parameters") => ({
    ...(question.bowtie[zone].prompt ? { prompt: question.bowtie[zone].prompt } : {}),
    tokens: question.bowtie[zone].tokens.map((token: Obj) => ({ opaqueTokenLabel: map[zone][token.id], en: token.en, zh: token.zh })),
  });
  return {
    stem: question.stem,
    bowtie: { condition: projectZone("condition"), actions: projectZone("actions"), parameters: projectZone("parameters") },
    rationale: {
      correct: question.rationale.correct,
      byChoice: (question.rationale.byChoice ?? []).map((entry: Obj) => ({
        opaqueTokenLabel: map.condition[entry.refId] ?? map.actions[entry.refId] ?? map.parameters[entry.refId],
        en: entry.en,
        zh: entry.zh,
      })),
    },
    testTakingStrategy: question.testTakingStrategy,
    glossary: question.glossary ?? [],
  };
}

function verifyBlindLeakage(packet: Obj, row: Obj, control: Obj, stage: 1 | 2) {
  const allowed = new Set(stage === 1 ? ["instruction", "stem"] : ["instruction", "stem", "prompts", "tokens"]);
  const extras = Object.keys(packet).filter((key) => !allowed.has(key));
  if (extras.length) fail(`${row.candidateId} Stage ${stage} forbidden fields ${extras.join(",")}`);
  const forbidden = [row.candidateId, row.surrogateId, row.companionCaseId, row.candidateBankPath, row.companionBankPath, row.category, row.topic, row.difficulty, row.ngnSkill, row.pairingRule, ...Object.keys(control.tokenMap.condition), ...Object.keys(control.tokenMap.actions), ...Object.keys(control.tokenMap.parameters)].filter(Boolean);
  const text = stableJson(packet, 0);
  for (const value of forbidden) if (text.includes(String(value))) fail(`${row.candidateId} Stage ${stage} leaked ${value}`);
  if (stage === 2) {
    const labels = [...packet.tokens.condition, ...packet.tokens.actions, ...packet.tokens.parameters].map((entry: Obj) => entry.label).sort();
    if (labels.join("|") !== [...LABELS].sort().join("|")) fail(`${row.candidateId} Stage 2 label shape`);
  }
}

function requireReviewLock(root: string, surrogate: string, kind: string, paired: boolean) {
  const review = kind === "stage1" || kind === "stage2"
    ? join(root, "blind-reviews", `${surrogate}-${kind}.json`)
    : join(root, kind, `${surrogate}.json`);
  const lock = join(root, "locks", `${surrogate}-${kind}.json`);
  const lockValue = parseJson(lock);
  const expectedKey = paired ? "lockedAfter" : "priorSealSha256";
  if (typeof lockValue.sha256 !== "string" || fileHash(review) !== lockValue.sha256) fail(`${surrogate} ${kind} review/lock mismatch`);
  if (!(expectedKey in lockValue)) fail(`${surrogate} ${kind} lock missing ${expectedKey}`);
  return { reviewPath: review, review: parseJson(review), lockPath: lock, lock: lockValue };
}

function comparePacket(candidateId: string, stage: string, expectedPath: string, value: unknown) {
  const expectedSha256 = fileHash(expectedPath);
  const observedSha256 = observedHash(value);
  const exactByteMatch = readFileSync(expectedPath).equals(Buffer.from(stableJson(value), "utf8"));
  if (!exactByteMatch) fail(`${candidateId} ${stage} expected ${expectedSha256}, observed ${observedSha256}`);
  return { stage, expectedPath: expectedPath.slice(REPO.length + 1), expectedSha256, observedSha256, exactByteMatch };
}

function main() {
  const targets = parseJsonl(TARGETS);
  const companions = new Map(parseJsonl(COMPANIONS).map((row) => [row.candidateId, row.payload]));
  const pairedPopulation = parseJsonl(join(PAIRED, "population.jsonl"));
  const pairedControls = parseJsonl(join(PAIRED, "control-manifest.jsonl"));
  const unpairedPopulation = parseJsonl(join(UNPAIRED, "population.jsonl"));
  const unpairedControls = parseJsonl(join(UNPAIRED, "control-manifest.jsonl"));
  const rows: Obj[] = [];

  for (const target of targets) {
    const isUnpaired = target.candidateId === "gpt_format7c_exercise_hypoglycemia_bowtie";
    const root = isUnpaired ? UNPAIRED : PAIRED;
    const population = (isUnpaired ? unpairedPopulation : pairedPopulation).find((row) => row.candidateId === target.candidateId);
    const control = (isUnpaired ? unpairedControls : pairedControls).find((row) => row.candidateId === target.candidateId);
    if (!population || !control) fail(`${target.candidateId} historical population/control resolution`);
    const surrogate = population.surrogateId;
    const question = target.payload;
    const map = control.tokenMap;
    if (stableJson(map, 0) !== stableJson(tokenMap(question), 0)) fail(`${target.candidateId} token map drift`);

    const packet1 = stage1Packet(question);
    const packet2 = stage2Packet(question);
    verifyBlindLeakage(packet1, population, control, 1);
    verifyBlindLeakage(packet2, population, control, 2);
    const stage1 = comparePacket(target.candidateId, "stage1", join(root, "blind-packets", `${surrogate}-stage1.json`), packet1);
    const stage2 = comparePacket(target.candidateId, "stage2", join(root, "blind-packets", `${surrogate}-stage2.json`), packet2);

    const stage1Input = requireReviewLock(root, surrogate, "stage1", !isUnpaired);
    const stage2Input = requireReviewLock(root, surrogate, "stage2", !isUnpaired);
    if (!Array.isArray(stage2Input.review.tokenPremiseTable) || stage2Input.review.tokenPremiseTable.length !== 11) fail(`${target.candidateId} Stage 2 review cardinality`);
    const stage2Labels = stage2Input.review.tokenPremiseTable.map((entry: Obj) => entry.opaqueTokenLabel).sort();
    if (stage2Labels.join("|") !== [...LABELS].sort().join("|")) fail(`${target.candidateId} Stage 2 review labels`);

    let phaseEPacket: Obj;
    if (isUnpaired) {
      phaseEPacket = {
        instruction: "The two blind records are immutable. Compare them with the current canonical five-target selection and complete standalone item. Do not inspect or infer sibling/corpus material. Return the required Phase-E standalone-adjudication record without revising either blind stage.",
        stage1Sha256: stage1Input.lock.sha256,
        stage2Sha256: stage2Input.lock.sha256,
        stage1: stage1Input.review,
        stage2: stage2Input.review,
        canonicalSelection: control.canonicalSelection,
        standaloneItem: standaloneProjection(question, map),
      };
    } else {
      phaseEPacket = {
        instruction: "The two blind-stage records are immutable. Compare them with the now-revealed canonical 1/2/2 selection and complete standalone item. Do not inspect or infer sibling-case material. Return the required Phase-E structured JSON without revising either blind record.",
        canonicalSelection: control.canonicalSelection,
        standaloneItem: standaloneProjection(question, map),
      };
    }
    const phaseE = comparePacket(target.candidateId, "phase-e", join(root, "phase-e-packets", `${surrogate}.json`), phaseEPacket);
    const phaseEInput = requireReviewLock(root, surrogate, "phase-e", !isUnpaired);
    if (phaseEInput.review.canonicalTargetSupport?.length !== 5 || phaseEInput.review.distractorPremiseFindings?.length !== 6) fail(`${target.candidateId} Phase E review cardinality`);

    let phaseFPacket: Obj;
    if (isUnpaired) {
      phaseFPacket = {
        instruction: "Phase E is immutable. For every missing client fact inspect only this candidate's rationale/byChoice, strategy, glossary, Chinese counterpart, and an explicitly linked historical source if one exists. Do not search the corpus. Classify bounded provenance, apply fixed verdict precedence, and record narrow bilingual/clinical/scope findings. Hidden-case dependency is unreachable and is a blocker if asserted.",
        phaseESha256: phaseEInput.lock.sha256,
        phaseE: phaseEInput.review,
        candidateSurfaces: standaloneProjection(question, map),
        explicitlyLinkedHistoricalSources: [],
      };
    } else {
      const companion = companions.get(target.candidateId);
      if (!companion) fail(`${target.candidateId} companion snapshot missing`);
      phaseFPacket = {
        instruction: "The Stage-1, Stage-2, and Phase-E records are immutable. Inspect the paired case only now. Classify provenance for every Phase-E missing client fact, distinguish sibling necessity from corroboration, apply the fixed verdict precedence, and record narrow bilingual/clinical/scope collateral observations. Do not revise Phase E and do not propose content edits beyond an advisory P0-P3 priority.",
        phaseESha256: phaseEInput.lock.sha256,
        standaloneItem: standaloneProjection(question, map),
        siblingCase: companion,
      };
    }
    const phaseF = comparePacket(target.candidateId, "phase-f", join(root, "phase-f-packets", `${surrogate}.json`), phaseFPacket);
    const phaseFInput = requireReviewLock(root, surrogate, "phase-f", !isUnpaired);
    if (!VERDICTS.has(phaseFInput.review.primaryVerdict)) fail(`${target.candidateId} Phase F verdict vocabulary`);

    rows.push({
      candidateId: target.candidateId,
      historicalLineage: isUnpaired ? "campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5" : "standalone-bowtie-answerability-census-2026-08-23",
      historicalSurrogateId: surrogate,
      stages: [stage1, stage2, phaseE, phaseF],
      historicalInputLocks: {
        stage1ReviewSha256: stage1Input.lock.sha256,
        stage2ReviewSha256: stage2Input.lock.sha256,
        phaseEReviewSha256: phaseEInput.lock.sha256,
        phaseFReviewSha256: phaseFInput.lock.sha256,
      },
      cardinalities: { stage2PremiseRows: 11, phaseECanonicalSupportRows: 5, phaseEDistractorRows: 6 },
      finalVerdictVocabularyValid: true,
      leakageChecks: "PASS",
    });
  }

  if (rows.length !== 12 || rows.some((row) => row.stages.length !== 4 || row.stages.some((stage: Obj) => !stage.exactByteMatch))) fail("12 x four-stage reconciliation failed");
  const artifact = {
    status: "PASS",
    adapterPath: "audit/campaign-16-phase-d-bowtie-repair-2026-08-29-r2/adapter.ts",
    importedFrozenHelpers: ["stableJson", "sha256"],
    prohibitedFrozenEntrypointsInvoked: [],
    frozenLineageWrites: [],
    candidateCount: rows.length,
    stageComparisonCount: rows.reduce((sum, row) => sum + row.stages.length, 0),
    exactByteComparisonCount: 48,
    rows,
  };
  writeFileSync(join(OUT, "adapter-fidelity.json"), stableJson(artifact), "utf8");
  process.stdout.write(stableJson({ status: artifact.status, candidateCount: artifact.candidateCount, stageComparisonCount: artifact.stageComparisonCount, exactByteComparisonCount: artifact.exactByteComparisonCount }));
}

main();
