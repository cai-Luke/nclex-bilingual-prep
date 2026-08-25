# Module A Verification Report: Mechanical and Diagnostic Checks

## 1. Mechanical Invariants Verification

- **Total Rows:** Exactly 46 rows in `pair-review.jsonl`.
- **Global Numbering:** `pairNumber` is complete, sequential, and unique from 1 to 46.
- **Part Numbering:**
  - Part A contains exactly 31 rows with `part == "A"` and `partPairNumber` 1..31.
  - Part B contains exactly 15 rows with `part == "B"` and `partPairNumber` 1..15.
- **Pair Identity & Sequence:** Every row matches the exact `itemAId` and `itemBId` pairing from the frozen `pairs.jsonl` input corpus in identical order.
- **Field Completeness:** All 16 required schema fields are fully populated with non-null, non-empty values across all 46 records:
  - `pairNumber`, `part`, `partPairNumber`, `itemAId`, `itemBId`, `sharedDecision`, `ruleA_en`, `ruleA_zh`, `ruleB_en`, `ruleB_zh`, `strongestReconciliation`, `reconciliationTest`, `verdict`, `sourceCheckNeeded`, `confidence`, `notes`.
- **Enum Validity:**
  - `verdict` ∈ {`CONTRADICTION`, `RECONCILABLE`, `NO_SHARED_DECISION`} (All valid: 31 RECONCILABLE, 15 NO_SHARED_DECISION, 0 CONTRADICTION).
  - `confidence` ∈ {`HIGH`, `MEDIUM`, `LOW`} (All 46 HIGH).
  - `sourceCheckNeeded` is boolean `false` for all 46 rows.
- **Scoped Item Cross-Contamination Guard:** Zero unrelated scoped item IDs appear in any pair's reasoning fields. All 68 unique scoped item IDs appear only in their authorized pair rows.
- **Reconciliation Block Uniqueness:** All 46 `strongestReconciliation + reconciliationTest` text blocks are globally unique across the entire corpus.
- **Traceability:** Keyed rules in English and Chinese directly trace to the item stems, answer keys, and rationales in the frozen snapshot (`59664cacfe4cfbd43d212f84c5d164a09557c958`).

---

## 2. Supporting Lexical Diagnostics

To provide diagnostic transparency regarding lexical variation across reconciliation reasoning blocks:

- **Metric:** Pairwise word-level Jaccard similarity across all 1,035 unique pair combinations of `strongestReconciliation + reconciliationTest`.
- **Average Pairwise Jaccard Similarity:** `0.0843` (~8.4% average word overlap).
- **Maximum Pairwise Jaccard Similarity:** `0.3256` (between Pair 15 and Pair 37, both being format-twin dismissals comparing procedural ordered steps against unrelated clinical decisions).
- **Highest Overlap Pairs (>0.25):**
  - Pairs 15 & 37: `0.3256`
  - Pairs 33 & 36: `0.2917`
  - Pairs 14 & 36: `0.2826`
  - Pairs 36 & 38: `0.2727`
  - Pairs 7 & 9: `0.2639`
  - Pairs 33 & 38: `0.2609`

### Semantic Template Review Disclaimer

> **IMPORTANT NOTICE:** In accordance with audit standards, lexical metrics such as Jaccard similarity or token overlap are reported solely as supporting diagnostics. Lexical variation does not prove de novo reasoning or the absence of noun-swapped templates. Final semantic template judgment and qualitative evaluation belong exclusively to the independent human checker.

---

## 3. Verification Summary

| Verification Check | Target / Invariant | Status | Result |
|---|---|---|---|
| Row Count | 46 records | PASS | 46 rows present |
| Global Indexing | 1..46 | PASS | Complete & unique |
| Local Part A Indexing | Part A 1..31 | PASS | Complete & unique |
| Local Part B Indexing | Part B 1..15 | PASS | Complete & unique |
| Pair ID Matching | 46/46 match frozen package | PASS | 100% exact match |
| Required Fields | 16 fields non-null | PASS | 0 missing fields |
| Scoped ID Isolation | 0 unrelated IDs in reasoning | PASS | Zero cross-contamination |
| Reasoning Uniqueness | 46 unique reconciliation blocks | PASS | Zero duplicated blocks |
| Rule Traceability | Traceable to frozen package | PASS | Verified against stems/keys |
