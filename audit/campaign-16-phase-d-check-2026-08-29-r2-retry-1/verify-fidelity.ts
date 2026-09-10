// Independent checker-side replay of the four-stage historical adapter-fidelity proof (§7.1.1).
// Mirrors the producer's replay but is authored and executed independently in the checker root,
// using only the checker's own adapter module. A PASS here is the checker's own basis for trusting
// the local adapter before it is used to project packets for the 12 repaired candidates.
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  sha256,
  stableJson,
  tokenMap,
  stage1Packet,
  stage2Packet,
  standaloneProjection,
  verifyBlindLeakage,
  LABELS,
  VERDICTS,
  Obj,
} from "./checker-adapter.ts";

const OUT = resolve(import.meta.dirname);
const REPO = resolve(OUT, "../..");
const PRODUCER = join(REPO, "audit/campaign-16-phase-d-bowtie-repair-2026-08-29-r2");
const PAIRED = join(REPO, "audit/standalone-bowtie-answerability-census-2026-08-23");
const UNPAIRED = join(REPO, "audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5");

const fail = (m: string): never => { throw new Error(`CAMPAIGN16_PHASE_D_BLOCKED: checker adapter fidelity: ${m}`); };
const parseJson = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const parseJsonl = (p: string): Obj[] => readFileSync(p, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const fileHash = (p: string) => sha256(readFileSync(p));

function requireReviewLock(root: string, surrogate: string, kind: string, paired: boolean) {
  const review = kind === "stage1" || kind === "stage2" ? join(root, "blind-reviews", `${surrogate}-${kind}.json`) : join(root, kind, `${surrogate}.json`);
  const lock = join(root, "locks", `${surrogate}-${kind}.json`);
  const lockValue = parseJson(lock);
  const expectedKey = paired ? "lockedAfter" : "priorSealSha256";
  if (typeof lockValue.sha256 !== "string" || fileHash(review) !== lockValue.sha256) fail(`${surrogate} ${kind} review/lock mismatch`);
  if (!(expectedKey in lockValue)) fail(`${surrogate} ${kind} lock missing ${expectedKey}`);
  return { review: parseJson(review), lock: lockValue };
}

function comparePacket(candidateId: string, stage: string, expectedPath: string, value: unknown) {
  const expectedSha256 = fileHash(expectedPath);
  const observedSha256 = sha256(stableJson(value));
  const exactByteMatch = readFileSync(expectedPath).equals(Buffer.from(stableJson(value), "utf8"));
  if (!exactByteMatch) fail(`${candidateId} ${stage} expected ${expectedSha256}, observed ${observedSha256}`);
  return { stage, expectedPath: expectedPath.slice(REPO.length + 1), expectedSha256, observedSha256, exactByteMatch };
}

function main() {
  const targets = parseJsonl(join(PRODUCER, "stage0-targets.jsonl"));
  const companions = new Map(parseJsonl(join(PRODUCER, "stage0-companions.jsonl")).map((r) => [r.candidateId, r.payload]));
  const pairedPopulation = parseJsonl(join(PAIRED, "population.jsonl"));
  const pairedControls = parseJsonl(join(PAIRED, "control-manifest.jsonl"));
  const unpairedPopulation = parseJsonl(join(UNPAIRED, "population.jsonl"));
  const unpairedControls = parseJsonl(join(UNPAIRED, "control-manifest.jsonl"));
  const rows: Obj[] = [];

  for (const target of targets) {
    const isUnpaired = target.candidateId === "gpt_format7c_exercise_hypoglycemia_bowtie";
    const root = isUnpaired ? UNPAIRED : PAIRED;
    const population = (isUnpaired ? unpairedPopulation : pairedPopulation).find((r) => r.candidateId === target.candidateId);
    const control = (isUnpaired ? unpairedControls : pairedControls).find((r) => r.candidateId === target.candidateId);
    if (!population || !control) fail(`${target.candidateId} historical population/control resolution`);
    const surrogate = population.surrogateId;
    const question = target.payload;
    const map = control.tokenMap;
    if (stableJson(map, 0) !== stableJson(tokenMap(question), 0)) fail(`${target.candidateId} token map drift`);

    const packet1 = stage1Packet(question);
    const packet2 = stage2Packet(question);
    verifyBlindLeakage(packet1, [target.candidateId, population.surrogateId, control.companionCaseId], 1);
    verifyBlindLeakage(packet2, [target.candidateId, population.surrogateId, control.companionCaseId], 2);
    const stage1 = comparePacket(target.candidateId, "stage1", join(root, "blind-packets", `${surrogate}-stage1.json`), packet1);
    const stage2 = comparePacket(target.candidateId, "stage2", join(root, "blind-packets", `${surrogate}-stage2.json`), packet2);

    const stage1Input = requireReviewLock(root, surrogate, "stage1", !isUnpaired);
    const stage2Input = requireReviewLock(root, surrogate, "stage2", !isUnpaired);
    if (!Array.isArray(stage2Input.review.tokenPremiseTable) || stage2Input.review.tokenPremiseTable.length !== 11) fail(`${target.candidateId} Stage 2 review cardinality`);

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

    rows.push({ candidateId: target.candidateId, stages: [stage1, stage2, phaseE, phaseF] });
  }

  if (rows.length !== 12 || rows.some((r) => r.stages.length !== 4 || r.stages.some((s: Obj) => !s.exactByteMatch))) fail("12 x four-stage reconciliation failed");
  const artifact = {
    status: "PASS",
    adapterPath: "audit/campaign-16-phase-d-check-2026-08-29-r2-retry-1/checker-adapter.ts",
    authoredBy: "checker (independent of producer adapter.ts)",
    candidateCount: rows.length,
    stageComparisonCount: rows.reduce((s, r) => s + r.stages.length, 0),
    exactByteComparisonCount: rows.reduce((s, r) => s + r.stages.length, 0),
    rows,
  };
  writeFileSync(join(OUT, "checker-adapter-fidelity.json"), stableJson(artifact), "utf8");
  process.stdout.write(stableJson({ status: artifact.status, candidateCount: artifact.candidateCount, exactByteComparisonCount: artifact.exactByteComparisonCount }));
}

main();
