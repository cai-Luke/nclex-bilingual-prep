import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { stableJson, sha256 } from "../standalone-bowtie-answerability-census-2026-08-23/run.ts";
import { repairChanges, type RepairChange } from "./repair-spec.ts";

type Obj = Record<string, any>;
const REPO = resolve(import.meta.dirname, "../..");
const OUT = resolve(import.meta.dirname);
const FROZEN_ADJ = join(REPO, "audit/standalone-bowtie-answerability-census-2026-08-23/adjudication.jsonl");
const UNPAIRED_ADJ = join(REPO, "audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/adjudication.jsonl");
const fail = (message: string): never => { throw new Error(`CAMPAIGN16_PHASE_D_BLOCKED: candidate build: ${message}`); };
const parseJsonl = (path: string): Obj[] => readFileSync(path, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const writeJson = (name: string, value: unknown) => writeFileSync(join(OUT, name), stableJson(value), "utf8");
const writeJsonl = (name: string, rows: unknown[]) => writeFileSync(join(OUT, name), rows.map((row) => stableJson(row, 0).trimEnd()).join("\n") + "\n", "utf8");

function pathText(path: RepairChange["path"]): string {
  return path.map((segment, index) => typeof segment === "string" ? (index ? `.${segment}` : segment) : typeof segment === "number" ? `[${segment}]` : "id" in segment ? `[id=${segment.id}]` : `[refId=${segment.refId}]`).join("");
}

function resolveLeaf(root: unknown, path: RepairChange["path"]): { parent: any; key: string | number } {
  let current: any = root;
  for (let index = 0; index < path.length - 1; index++) {
    const segment = path[index];
    if (typeof segment === "string" || typeof segment === "number") current = current[segment];
    else {
      if (!Array.isArray(current)) fail(`selector requires array at ${pathText(path.slice(0, index))}`);
      const key = "id" in segment ? "id" : "refId";
      const value = segment[key];
      const matches = current.filter((entry: Obj) => entry?.[key] === value);
      if (matches.length !== 1) fail(`${pathText(path.slice(0, index + 1))} matched ${matches.length}`);
      current = matches[0];
    }
    if (current === undefined) fail(`missing path ${pathText(path.slice(0, index + 1))}`);
  }
  const last = path.at(-1)!;
  if (typeof last === "string" || typeof last === "number") return { parent: current, key: last };
  fail(`final selector unsupported for setValue ${pathText(path)}`);
}

function structural(question: Obj) {
  return {
    identity: { id: question.id, itemType: question.itemType, category: question.category, topic: question.topic, difficulty: question.difficulty, ngnSkill: question.ngnSkill ?? null },
    tokenIds: {
      condition: question.bowtie.condition.tokens.map((token: Obj) => token.id),
      actions: question.bowtie.actions.tokens.map((token: Obj) => token.id),
      parameters: question.bowtie.parameters.tokens.map((token: Obj) => token.id),
    },
    key: { condition: question.bowtie.condition.correct, actions: question.bowtie.actions.correct, parameters: question.bowtie.parameters.correct },
    shape: { condition: question.bowtie.condition.tokens.length, actions: question.bowtie.actions.tokens.length, parameters: question.bowtie.parameters.tokens.length },
  };
}

const forbiddenById: Record<string, string[]> = {
  gpt_case_caregiver_role_strain_dementia_01_bowtie: ["bedroom-door barricade", "throw rugs", "cleaning supplies", "adult-day enrollment", "I'm failing her", "chair barricade", "Oxygen saturation is normal", "激动 episode"],
  gpt_case_infection_control_clustered_care_01_bowtie: ["Room 16", "Room 12", "wound dressing", "vancomycin", "Streptococcus pneumoniae", "Client B"],
  gpt_case_acute_hemolytic_transfusion_reaction_01_bowtie: ["ABO incompatibility", "Foley catheter", "this normal site"],
  gpt_case_client_advocacy_refusal_01_bowtie: ["DPOAHC", "dormant surrogate", "son's demand", "social work support", "reduce family conflict"],
  gpt_case_lateral_incivility_01_bowtie: ["Renee", "unresolved lateral incivility"],
  gpt_case_mass_casualty_start_triage_01_bowtie: ["At Stage 2", "A or G", "Bring D", "C, D, and E", "blast trauma, hemorrhage, burns", "charge nurse必须"],
  gpt_case_gbs_respiratory_compromise_01_bowtie: ["AIDP", "albuminocytologic", "demyelinating NCS", "sensory level", "cord MRI", "bowel/bladder", "Repeat CSF"],
  gpt_case_hipaa_disclosure_breach_01_bowtie: ["RN Casey", "Casey护士", "HIM fax", "HIM传真", "Robert Torrance", "postoperative", "术后", "orthopedic notes", "curiosity-based", "charge nurse"],
  gpt_case_neutropenic_fever_nadir_01_bowtie: ["poor oral intake", "repeat cultures", "Repeat chest X-ray", "rising lactate", "slower responses", "blood product exposure", "urticaria", "wheezing", "angioedema", "despite IV fluids"],
  gpt_case_unsafe_premature_discharge_01_bowtie: ["family support", "Repeat ambulation including stair"],
  gpt_pph_2026_06_16_case_01_bowtie: ["fibrinogen 280 mg/dL", "INR 1.1", "aPTT 30 sec", "urine output is the real-time"],
  gpt_format7c_exercise_hypoglycemia_bowtie: ["existing hypoglycemia", "已有低血糖", "Do not independently prescribe", "不要自行开立", "without independently changing a prescription", "不由患者或护士自行更改处方"],
};

function main() {
  const targetRows = parseJsonl(join(OUT, "stage0-targets.jsonl"));
  const frozen = parseJsonl(FROZEN_ADJ);
  const unpaired = parseJsonl(UNPAIRED_ADJ);
  const operations: Obj[] = [];
  const candidates: Obj[] = [];
  const manifestCandidates: Obj[] = [];
  const seen = new Set<string>();

  for (const target of targetRows) {
    const beforePayload = target.payload;
    const afterPayload = JSON.parse(JSON.stringify(beforePayload));
    const beforeStructure = structural(beforePayload);
    const candidateChanges = repairChanges.filter((change) => change.id === target.candidateId);
    if (!candidateChanges.length) fail(`${target.candidateId} has no operations`);
    const candidateOps = candidateChanges.flatMap((change) => {
      const key = `${change.id}|${JSON.stringify(change.path)}`;
      if (seen.has(key)) fail(`duplicate op ${key}`);
      seen.add(key);
      const { parent, key: leaf } = resolveLeaf(afterPayload, change.path);
      const before = parent[leaf];
      if (typeof before !== "string") fail(`${change.id} ${pathText(change.path)} before is ${typeof before}`);
      if (before === change.after) return [];
      parent[leaf] = change.after;
      const row = { kind: "setValue", id: change.id, path: change.path, before, after: change.after, note: change.note };
      operations.push({ bankPath: target.bankPath, ...row });
      return [row];
    });
    const afterStructure = structural(afterPayload);
    if (stableJson(beforeStructure, 0) !== stableJson(afterStructure, 0)) fail(`${target.candidateId} structural/key/identity movement`);
    const serialized = stableJson(afterPayload, 0);
    for (const phrase of forbiddenById[target.candidateId] ?? []) if (serialized.toLocaleLowerCase().includes(phrase.toLocaleLowerCase())) fail(`${target.candidateId} residual forbidden premise ${JSON.stringify(phrase)}`);
    const afterPayloadSha256 = sha256(serialized);
    const evidence = target.candidateId === "gpt_format7c_exercise_hypoglycemia_bowtie"
      ? unpaired.find((row) => row.candidateId === target.candidateId)
      : frozen.find((row) => row.candidateId === target.candidateId);
    if (!evidence) fail(`${target.candidateId} missing frozen evidence`);
    const missingRows = target.candidateId === "gpt_format7c_exercise_hypoglycemia_bowtie" ? evidence.missingFactProvenance : evidence.phaseF.missingFactProvenance;
    const newClinicalAssertion = target.candidateId === "gpt_case_gbs_respiratory_compromise_01_bowtie";
    const sourceEvidence = newClinicalAssertion ? [{
      authority: "DailyMed / FDA-approved GAMMAGARD LIQUID prescribing information",
      url: "https://www.dailymed.nlm.nih.gov/dailymed/getFile.cfm?setid=9d42adca-0dd7-4df7-864d-5a7feee52130&type=pdf",
      support: "The label states that changes in pulse rate and blood pressure can be infusion-rate related and directs clinicians to slow or stop the infusion when adverse reactions occur.",
      appliedTo: "act_continue_ivig EN/ZH and associated rationale",
    }] : [];
    candidates.push({ candidateId: target.candidateId, bankPath: target.bankPath, preRepairPayloadSha256: target.observedPayloadSha256, afterPayloadSha256, payload: afterPayload });
    manifestCandidates.push({
      candidateId: target.candidateId,
      canonicalBank: target.bankPath,
      frozenPreRepairPayloadSha256: target.expectedPayloadSha256,
      primaryVerdict: target.primaryVerdict,
      frozenEvidencePaths: target.candidateId === "gpt_format7c_exercise_hypoglycemia_bowtie" ? [
        "audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/adjudication.jsonl",
        "audit/campaign-16-phase-c-closeout-2026-08-28-r6/owner-adjudication.md",
      ] : [
        "audit/standalone-bowtie-answerability-census-2026-08-23/report.md",
        "audit/standalone-bowtie-answerability-census-2026-08-23/adjudication.jsonl",
      ],
      missingPremiseFindings: missingRows.map((row: Obj) => ({ ...row, disposition: "PATCH", reason: "Premise-neutral token/rationale rewrite removes the unsupported client-specific antecedent without changing the key or construct." })),
      operations: candidateOps,
      operationCount: candidateOps.length,
      introducesNewClinicalAssertion: newClinicalAssertion,
      authoritativeSourceEvidence: sourceEvidence,
      localeParity: target.candidateId === "gpt_case_acute_hemolytic_transfusion_reaction_01_bowtie"
        ? "All displayed EN/ZH fields are paired; glossary[1].defZh is an intentional schema-native Chinese-only definition field."
        : "Every changed displayed EN/ZH field has a paired operation; strict parity is required by the patch wrapper.",
      preservationAssertions: {
        questionIdUnchanged: true,
        itemTypeUnchanged: true,
        categoryUnchanged: true,
        topicUnchanged: true,
        difficultyUnchanged: true,
        ngnSkillUnchanged: true,
        tokenIdsUnchanged: true,
        tokenShapeUnchanged: "3/4/4",
        keyedTokenIdentitiesUnchanged: true,
        keyCardinalityUnchanged: "1/2/2",
      },
      proposedAfterPayloadSha256: afterPayloadSha256,
    });
  }
  if (!operations.length || operations.length > repairChanges.length || candidates.length !== 12) fail(`operation/candidate reconciliation ${operations.length}/${repairChanges.length}, ${candidates.length}/12`);
  writeJson("repair-manifest.json", {
    phase: "Campaign 16 Phase D",
    disposition: "RETAIN_ALL_12_PENDING_INDEPENDENT_CONTENT_GATE",
    reason: "smallest construct-preserving premise-neutral repair of the combined failing bow-tie set",
    declaredChangeCount: repairChanges.length,
    operationCount: operations.length,
    targetCount: candidates.length,
    candidates: manifestCandidates,
  });
  writeJsonl("repair-candidates.jsonl", candidates);
  writeJsonl("patch-operations.jsonl", operations);
  writeJson("candidate-build.json", { status: "PASS", targetCount: candidates.length, operationCount: operations.length, candidateHashes: candidates.map(({ candidateId, afterPayloadSha256 }) => ({ candidateId, afterPayloadSha256 })) });
  process.stdout.write(stableJson({ status: "PASS", targetCount: candidates.length, operationCount: operations.length }));
}

main();
