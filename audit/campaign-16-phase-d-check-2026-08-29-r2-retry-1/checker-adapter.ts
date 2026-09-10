// Campaign 16 Phase D checker retry (R2-retry-1) — independently authored local adapter.
//
// This module reproduces, for the CHECKER seat, the same deterministic Stage-1 / Stage-2 /
// standalone-unblinding / paired-provenance packet projection that the producer's adapter at
// audit/campaign-16-phase-d-bowtie-repair-2026-08-29-r2/adapter.ts implements and that already
// proved 48/48 exact-byte historical fidelity. It is written independently here (not imported
// from the producer package) so the checker root is self-contained and does not execute or
// depend on producer-authored code, per the work order's producer != checker discipline for
// anything downstream of Stage 0's shared deterministic infrastructure.
//
// Only `stableJson` and `sha256` are imported from the frozen 2026-08-23 instrument, exactly as
// the work order's §7.1.1 permits ("Only its genuinely reusable exported helpers — stableJson,
// sha256, and derivePopulation — may be imported directly").
import { sha256, stableJson } from "../standalone-bowtie-answerability-census-2026-08-23/run.ts";

export type Obj = Record<string, any>;

export const LABELS = ["C1", "C2", "C3", "A1", "A2", "A3", "A4", "P1", "P2", "P3", "P4"];
export const VERDICTS = new Set([
  "FAIL_HIDDEN_CASE_DEPENDENCY",
  "FAIL_UNSUPPORTED_TOKEN_PREMISE",
  "FAIL_UNDERDETERMINED",
  "FAIL_CANONICAL_KEY_OR_LOGIC",
  "HOLD_REVIEWER_DISAGREEMENT",
  "PASS_STANDALONE",
]);

export const STAGE1_INSTRUCTION =
  "Using only the standalone stem, independently free-generate exactly one most likely condition, exactly two priority nursing actions, and exactly two monitoring or evaluation parameters. Return the required structured JSON and identify the stem evidence and any missing information needed for specificity or uniqueness.";
export const STAGE2_INSTRUCTION =
  "Using only the standalone learner-facing English stem, prompts, and opaque token pools, select exactly one condition, two actions, and two parameters. Return the required structured JSON, including exactly one premise row for every opaque token. Do not infer absent client-specific facts.";

export { sha256, stableJson };

export function tokenMap(question: Obj): Record<string, Record<string, string>> {
  return {
    condition: Object.fromEntries(question.bowtie.condition.tokens.map((t: Obj, i: number) => [t.id, `C${i + 1}`])),
    actions: Object.fromEntries(question.bowtie.actions.tokens.map((t: Obj, i: number) => [t.id, `A${i + 1}`])),
    parameters: Object.fromEntries(question.bowtie.parameters.tokens.map((t: Obj, i: number) => [t.id, `P${i + 1}`])),
  };
}

export function canonicalSelection(question: Obj, map: Record<string, Record<string, string>>) {
  return {
    conditionLabel: map.condition[question.bowtie.condition.correct],
    actionLabels: question.bowtie.actions.correct.map((id: string) => map.actions[id]),
    parameterLabels: question.bowtie.parameters.correct.map((id: string) => map.parameters[id]),
  };
}

export function stage1Packet(question: Obj) {
  if (typeof question.stem?.en !== "string" || !question.stem.en.trim()) throw new Error(`${question.id} lacks stem.en`);
  return { instruction: STAGE1_INSTRUCTION, stem: question.stem.en };
}

export function stage2Packet(question: Obj) {
  const prompts: Record<string, string> = {};
  const tokens: Record<string, Array<{ label: string; text: string }>> = {};
  const zones = ["condition", "actions", "parameters"] as const;
  const prefixes = { condition: "C", actions: "A", parameters: "P" } as const;
  for (const zone of zones) {
    if (typeof question.bowtie[zone].prompt?.en === "string") prompts[zone] = question.bowtie[zone].prompt.en;
    tokens[zone] = question.bowtie[zone].tokens.map((t: Obj, i: number) => ({ label: `${prefixes[zone]}${i + 1}`, text: t.en }));
  }
  return { instruction: STAGE2_INSTRUCTION, stem: question.stem.en, ...(Object.keys(prompts).length ? { prompts } : {}), tokens };
}

export function standaloneProjection(question: Obj, map: Record<string, Record<string, string>>) {
  const projectZone = (zone: "condition" | "actions" | "parameters") => ({
    ...(question.bowtie[zone].prompt ? { prompt: question.bowtie[zone].prompt } : {}),
    tokens: question.bowtie[zone].tokens.map((t: Obj) => ({ opaqueTokenLabel: map[zone][t.id], en: t.en, zh: t.zh })),
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

export function standalonePacket(question: Obj, map: Record<string, Record<string, string>>, stage1Sha256: string, stage2Sha256: string, stage1Review: Obj, stage2Review: Obj) {
  return {
    instruction:
      "The two blind-stage records above are immutable and were produced by you in this same session before this selection was revealed. Compare them with the now-revealed canonical 1/2/2 selection and complete standalone item below. Do not inspect, infer, or assume any sibling-case material — none has been provided and none exists in this context. Return the required Phase-E-equivalent structured JSON without revising either blind record.",
    stage1Sha256,
    stage2Sha256,
    stage1: stage1Review,
    stage2: stage2Review,
    canonicalSelection: canonicalSelection(question, map),
    standaloneItem: standaloneProjection(question, map),
  };
}

export function pairedProvenancePacket(question: Obj, map: Record<string, Record<string, string>>, standaloneSha256: string, standaloneReview: Obj, companion: Obj) {
  return {
    instruction:
      "The standalone-unblinding record above is immutable and was produced by you in this same session before the sibling case was revealed. Inspect the paired case only now. For every missing client fact identified in your standalone-unblinding record, classify its provenance, distinguish sibling necessity from mere sibling corroboration, apply the fixed six-value verdict precedence (FAIL_HIDDEN_CASE_DEPENDENCY > FAIL_UNSUPPORTED_TOKEN_PREMISE > FAIL_UNDERDETERMINED > FAIL_CANONICAL_KEY_OR_LOGIC > HOLD_REVIEWER_DISAGREEMENT > PASS_STANDALONE), and record narrow bilingual/clinical/scope collateral observations. Do not revise the standalone-unblinding record and do not propose content edits beyond an advisory P0-P3 priority.",
    standaloneSha256,
    standaloneItem: standaloneProjection(question, map),
    standaloneReview,
    siblingCase: companion,
  };
}

export function unpairedFinalizationPacket(question: Obj, map: Record<string, Record<string, string>>, standaloneSha256: string, standaloneReview: Obj) {
  return {
    instruction:
      "The standalone-unblinding record above is immutable and was produced by you in this same session. This candidate has no paired sibling case — none exists and none will be provided. For every missing client fact identified in your standalone-unblinding record, inspect only this candidate's own rationale, byChoice, test-taking strategy, and glossary (English and Chinese), classify bounded provenance (RATIONALE_ONLY, UNSUPPORTED_ANYWHERE_CHECKED, or OTHER_PROVENANCE), apply the fixed six-value verdict precedence (FAIL_HIDDEN_CASE_DEPENDENCY is unreachable for an unpaired candidate and is a blocker if asserted), and record narrow bilingual/clinical/scope collateral observations. Do not revise the standalone-unblinding record.",
    standaloneSha256,
    standaloneItem: standaloneProjection(question, map),
    standaloneReview,
    explicitlyLinkedHistoricalSources: [],
  };
}

const FORBIDDEN_STAGE_KEYS = { 1: new Set(["instruction", "stem"]), 2: new Set(["instruction", "stem", "prompts", "tokens"]) };

export function verifyBlindLeakage(packet: Obj, forbidden: Array<string | undefined>, stage: 1 | 2) {
  const extras = Object.keys(packet).filter((k) => !FORBIDDEN_STAGE_KEYS[stage].has(k));
  if (extras.length) throw new Error(`Stage ${stage} forbidden fields ${extras.join(",")}`);
  const text = stableJson(packet, 0);
  for (const value of forbidden.filter(Boolean)) if (text.includes(String(value))) throw new Error(`Stage ${stage} leaked ${value}`);
  if (stage === 2) {
    const labels = [...packet.tokens.condition, ...packet.tokens.actions, ...packet.tokens.parameters].map((e: Obj) => e.label).sort();
    if (labels.join("|") !== [...LABELS].sort().join("|")) throw new Error(`Stage 2 label shape`);
  }
}
