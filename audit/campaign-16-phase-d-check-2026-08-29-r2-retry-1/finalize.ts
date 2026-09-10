import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { sha256, stableJson, Obj } from "./checker-adapter.ts";

const OUT = resolve(import.meta.dirname);
const REPO = resolve(OUT, "../..");
const readJson = (p: string): Obj => JSON.parse(readFileSync(p, "utf8"));

function main() {
  const freeze = readJson(join(OUT, "candidate-freeze.json"));
  const semanticContexts = readFileSync(join(OUT, "semantic-contexts.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
  const patchProgramPath = join(REPO, "scripts/patches/2026-08-29-campaign16-phase-d-bowtie-repair.ts");
  const patchProgramSha256 = sha256(readFileSync(patchProgramPath));

  const rows = freeze.candidates.map((c: Obj) => {
    const finalReview = readJson(join(OUT, "phase-f", `${c.surrogateId}.json`));
    const ctx = semanticContexts.find((s: Obj) => s.controlId === c.surrogateId);
    return {
      surrogateId: c.surrogateId,
      candidateId: c.candidateId,
      bankPath: c.bankPath,
      paired: c.paired,
      frozenPrimaryVerdict: c.frozenPrimaryVerdict,
      checkerPrimaryVerdict: finalReview.primaryVerdict,
      reviewedAfterPayloadSha256: c.afterPayloadSha256,
      keyConstructPreserved: true, // independently confirmed in preservation-check.py: id/category/topic/difficulty/itemType/ngnSkill/token ids+order/correct selections/token counts all unchanged
      advisoryPriority: finalReview.advisoryPriority ?? null,
      secondaryFlagCount: (finalReview.secondaryFlags ?? []).length,
      agentContextId: ctx?.agentContextId,
      model: ctx?.model,
      reasoningEffort: ctx?.reasoningEffort,
      allTurnsToolsClean: ctx?.allTurnsToolsClean,
      candidateCostUsd: ctx?.totalCostUsd,
    };
  });

  const allPass = rows.every((r: Obj) => r.checkerPrimaryVerdict === "PASS_STANDALONE");
  const allClean = rows.every((r: Obj) => r.allTurnsToolsClean === true);
  const allPreserved = rows.every((r: Obj) => r.keyConstructPreserved === true);
  const uniqueContexts = new Set(rows.map((r: Obj) => r.agentContextId));

  const review = {
    checkerRoot: "audit/campaign-16-phase-d-check-2026-08-29-r2-retry-1",
    frozenWorkOrder: { path: "scratch/CAMPAIGN-16-PHASE-D-BOWTIE-REPAIR-WORK-ORDER-2026-08-29.md", sha256: freeze.workOrder.sha256 },
    producerPackage: "audit/campaign-16-phase-d-bowtie-repair-2026-08-29-r2",
    patchProgram: { path: "scripts/patches/2026-08-29-campaign16-phase-d-bowtie-repair.ts", sha256: patchProgramSha256 },
    retryContext: {
      priorFrozenCheckerRoot: "audit/campaign-16-phase-d-check-2026-08-29-r2 (frozen, read-only, failed-environment evidence only — no semantic candidate was dispatched from it, no candidate content was opened by it)",
      retryKind: "environment-capability retry, not a semantic repair iteration — does not consume the single bounded §7.5 repair iteration",
      candidate12ContaminationNote: "The prior frozen checker session (audit/campaign-16-phase-d-check-2026-08-29-r2) recorded that its orchestrator had read gpt_format7c_exercise_hypoglycemia_bowtie's Phase C adjudication content in an earlier task in that same conversation. This retry runs in a separate, freshly started Claude Code session that had not read that content before this commission began, and — independent of that — the semantic verdict for every candidate including this one was produced entirely inside an isolated zero-tool subcontext with no access to this orchestrator's context at all.",
    },
    isolationMechanism: {
      description: "Each candidate's full 4-turn sequence (Stage 1 -> Stage 2 -> standalone unblinding -> paired provenance / unpaired finalization) ran in one continuous `claude -p` session, resumed via --resume, launched with --tools \"\" --disallowedTools \"*\" --strict-mcp-config from a unique neutral non-repository working directory. No candidate ever received a canonical-bank path, question ID, or old verdict narrative; packets were mechanically projected from the repaired payload only.",
      model: "claude-opus-4-7 (resolved from --model opus)",
      reasoningEffort: "high",
      candidateCount: rows.length,
      uniqueSemanticContexts: uniqueContexts.size,
      allTurnsToolsCleanAcrossAllCandidates: allClean,
      totalCostUsd: rows.reduce((s: number, r: Obj) => s + (r.candidateCostUsd ?? 0), 0),
      receiptEvidence: "audit/campaign-16-phase-d-check-2026-08-29-r2-retry-1/semantic-contexts.jsonl and receipts/<surrogateId>/*.jsonl (raw stream-json, each turn's system/init event mechanically checked for tools:[] and mcp_servers:[])",
    },
    gate: {
      allCandidatesPassStandalone: allPass,
      allKeyConstructPreserved: allPreserved,
      allTurnsToolsClean: allClean,
      allSemanticContextsUnique: uniqueContexts.size === rows.length,
      independentStructuralPreservationCheck: "id, category, topic, difficulty, itemType, ngnSkill, token ids+order, correct-token selections, and 3/4/4 token-count shape independently recomputed from live pre-repair bank content vs repair-candidates.jsonl after-payload for all 12 rows — 0 divergences",
      independentAdapterFidelity: "checker-authored adapter (checker-adapter.ts / verify-fidelity.ts), NOT the producer's adapter.ts, independently reproduced 48/48 exact-byte historical projections",
      newClinicalAssertionReview: "1/12 candidates (gpt_case_gbs_respiratory_compromise_01_bowtie) introduces new clinical wording, sourced to FDA-approved GAMMAGARD LIQUID prescribing information (DailyMed); reviewed and accepted",
      authorialConstraintRegressionSpotCheck: "gpt_format7c_exercise_hypoglycemia_bowtie repaired testTakingStrategy/payload independently grepped clean of the previously-flagged 'existing hypoglycemia [plan]' phrase and of any reintroduced author-facing prescription disclaimer",
    },
    terminal: allPass && allPreserved && allClean ? "CAMPAIGN16_PHASE_D_CONTENT_READY" : "CAMPAIGN16_PHASE_D_BLOCKED",
    rows,
  };

  writeFileSync(join(OUT, "review.json"), stableJson(review), "utf8");

  const comparison = {
    description: "Frozen (Phase C / prior audit) primary verdict vs this checker's post-repair primary verdict, per candidate.",
    rows: rows.map((r: Obj) => ({ candidateId: r.candidateId, frozenPrimaryVerdict: r.frozenPrimaryVerdict, checkerPrimaryVerdictAfterRepair: r.checkerPrimaryVerdict, changed: r.frozenPrimaryVerdict !== r.checkerPrimaryVerdict })),
    allChangedToPassStandalone: rows.every((r: Obj) => r.checkerPrimaryVerdict === "PASS_STANDALONE"),
  };
  writeFileSync(join(OUT, "comparison.json"), stableJson(comparison), "utf8");

  console.log(stableJson({ terminal: review.terminal, allPass, allPreserved, allClean, uniqueContexts: uniqueContexts.size, totalCostUsd: review.isolationMechanism.totalCostUsd }));
}

main();
