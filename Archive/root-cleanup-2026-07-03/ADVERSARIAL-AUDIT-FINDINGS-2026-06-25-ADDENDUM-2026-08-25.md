# Addendum to the June 25 Phase B Coherence Audit — 2026-08-25

This addendum preserves the closed historical report unchanged while correcting its disposition for
one exact pair. The original report and this addendum should be read together for Pair 40.

## Correction scope

The June report's statement that the coherence pass closed with zero contradictions is superseded for:

`claude_cs_jun06_pressure_injury_bcc_01` ×
`gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03`.

The GPT case's embedded child
`gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q1` carried an internally
contradictory matrix key: all five scored row mappings were the inverse of the direction stated by the
item's own English and Chinese `rationale.byChoice` text. The Claude item and GPT parent case address
different clinical subskills; the material defect was internal to the GPT child matrix.

## Historical cause

The affected child and seven sibling GPT matrices were correctly keyed at the pre-swap oracle
`b3a68e890988ca7155dcc8113881b3a36ddf6826`. Commit
`91ab9606269d4e5a82b4bf613234c06db5830276` then introduced the net `c1`/`c2` swap on all eight GPT
targets after a false inversion diagnosis. No later legitimate content evolution changed those eight
scoring constructs before the 2026-08-25 restoration. The two other names carried by the historical
script, `fhr_gemini_smoke_2026_06_13_06` and `io_matrix_prerenal_aki_recheck_04`, were net Git no-ops
for that commit and were independently confirmed correct in the 2026-08-25 acceptance review. This
chronology makes no stronger claim about an unrecoverable within-process execution sequence.

## Why the June audit missed it

The sealed forensic review found that the exact Pair 40 Gemini adjudication used templated dismissal
prose and left its evidence field empty. Layer A separately routed the embedded q1 child for coherence
review, but the sampled audit did not adjudicate that child-level pair. The case-level reviews that did
occur compared parent-case clinical themes rather than the child matrix's `correct` mapping against its
own `rationale.byChoice` direction. Process and tooling follow-up remains a separate commission.

## Repair and acceptance

Repair commit `e23962e7d81540421ab178e3e90d4dce77d21804` restored exactly eight scored leaves and 40 scalar
`correct[].columnIds` values. Claude independently re-derived all eight mappings and returned the
acceptance token `JUNE13_MATRIX_SWAP_REGRESSION_REPAIR_ACCEPTED`, with no ambiguous target. The complete
review is published under
[`audit/june13-matrix-swap-regression-2026-08-25/independent-acceptance/`](../../audit/june13-matrix-swap-regression-2026-08-25/independent-acceptance/),
and the repaired-ID inventory and mechanical proof are in the sibling
[`repair-report.md`](../../audit/june13-matrix-swap-regression-2026-08-25/repair-report.md).

The original `ADVERSARIAL-AUDIT-FINDINGS-2026-06-25.md` remains preserved unchanged.
