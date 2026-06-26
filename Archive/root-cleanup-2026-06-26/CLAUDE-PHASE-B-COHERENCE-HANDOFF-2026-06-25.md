# Claude Coherence Audit Handoff — 2026-06-25

This document hands off the **Phase B Coherence Audit** session to Claude. We completed the Gemini review lane but halted the overall pipeline due to a slice count mismatch, as directed by the Phase B specification.

---

## 1. Current Status

### Completed: Gemini Coherence Lane
We completed the relational coherence audit for all **46 pairs** assigned to the Gemini lane in [GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md](file:///Users/holemini/Desktop/Project%20Shrimp/audit/early-bank-semantic/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md) (31 in Part A, 15 in Part B).

* **Findings Report:** [gemini.findings.md](file:///Users/holemini/Desktop/Project%20Shrimp/audit/early-bank-semantic/coherence/lanes/gemini.findings.md)
* **Manifest (92 Rows):** [gemini.manifest.jsonl](file:///Users/holemini/Desktop/Project%20Shrimp/audit/early-bank-semantic/coherence/lanes/gemini.manifest.jsonl)
* **Summary:** **Zero (0) clinical contradictions** were found. All 46 pairs are clinically accurate and consistent. We have recommended a **`DISMISS`** (`recommendedAction: keep`) for all of them. Detailed clinical justifications for each pair's coherence are documented in the report.

### Blocked: Phase B Slice Count Mismatch
We executed Step 1 of [PHASE-B-COHERENCE-HANDOFF-2026-06-25.md](file:///Users/holemini/Desktop/Project%20Shrimp/PHASE-B-COHERENCE-HANDOFF-2026-06-25.md) to generate the Phase B slice.

The routing logic in [build-audit-batch.ts](file:///Users/holemini/Desktop/Project%20Shrimp/scripts/audit/build-audit-batch.ts) is fully implemented and correctly handles all categories. However, running the script yielded a count discrepancy:

* **Expected (per Handoff Spec):** 99 items / 113 pairs (`claude=89, gpt-5=7, gemini=2, needs-provenance=15`)
* **Actual (on disk):** **93 items / 104 pairs** (`claude=81, gpt-5=6, gemini=2, needs-provenance=15`)
* **Discrepancy:** -6 items / -9 pairs (specifically affecting the `claude` and `gpt-5` lanes).

Per the handoff spec warning (*"A mismatch means the routing change or the queue is off — stop and report, do not proceed to the review lanes"*), we have stopped the session and deferred the remaining lanes.

---

## 2. Next Steps for Claude

When you resume this session, please perform the following:

### Step 1: Resolve the Slice Mismatch
Determine if the queue file (`audit/early-bank-semantic/layer-a-queue.jsonl`) or the active canonical banks are slightly out of sync with the handoff spec.
* To regenerate the Layer A semantic queue:
  ```bash
  npx tsx scripts/audit/early-bank-semantic-layer-a.ts
  ```
* Re-run the slice generator to verify counts:
  ```bash
  npx tsx scripts/audit/build-audit-batch.ts \
    --clusters mi_chest_pain,stroke_escalation,digoxin_hold,lithium_toxicity,dialysis_complications,fetal_heart_rate,pressure_injury,hipaa_disclosure \
    --label 2026-06-25-phaseB \
    --out audit/early-bank-semantic/coherence/2026-06-25-phaseB.slice.json
  ```

### Step 2: Run the Remaining Review Lanes
Once the slice is accepted or regenerated:
1. **GPT-5 / Codex Lane (Step 2):** Audit the `claude×gemini` pairs (6 or 7 pairs).
   * Outputs: `lanes/codex.phaseB.findings.md` and `.manifest.jsonl`
2. **Claude Lane (Step 3):** Audit the remaining pairs (81 or 89 pairs).
   * Outputs: `lanes/claude.phaseB.findings.md` and `.manifest.jsonl`

### Step 3: Final Aggregation & Merge
As the final reviewer, merge all lanes (Gemini, Codex, Claude) into:
* Report: `ADVERSARIAL-AUDIT-FINDINGS-2026-06-25.md`
* Manifest: `audit/early-bank-semantic/coherence/ADVERSARIAL-AUDIT-2026-06-25.manifest.jsonl`
Ensure that the final manifest is validated and all 17 fields on each row parse successfully.
