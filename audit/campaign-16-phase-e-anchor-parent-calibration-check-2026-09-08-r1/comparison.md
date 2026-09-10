# Campaign 16 Phase E — Checker vs. Producer Comparison (post-reveal)

Date: 2026-09-08
This comparison was written **after** `checker-freeze.json` existed. The checker's frozen labels were not revised in response to anything read here.

Producer artifacts read after freeze: `producer-adjudications.json`, `locked-producer-freeze.json`, `calibration-summary.json`, `locked-comparison.md`. `report.md` was not needed and was not read — nothing in it affects the counts below, which come entirely from `producer-adjudications.json`.

## Part-level agreement

**39 / 40 parts (97.5%) agree exactly.**

The single disagreement:

| Parent | Part | Checker | Producer |
|---|---|---|---|
| `cs_thyroid_storm_main` | `cs_thyroid_storm_q3` (row 371) | AMBIGUOUS | STAGE:stage_0830 (ANCHOR_RECOVERED, confidence HIGH) |

Both sides agree this part is **not** a baseline-before-first-stage case — the disagreement is about which single declared stage to commit to (exact-stage-choice), not about the more fundamental baseline/no-baseline question. The checker found the interventions listed (cooling, environment, acetaminophen, seizure precautions) not clearly gated behind either declared stage specifically — they are framed in the stem as spanning "between 0800 and 1200" — and, per P8, returned AMBIGUOUS rather than resolve the tie by inference. The producer resolved it to `stage_0830` on the reasoning that "care plan established at 0830 alongside acute pharmacological management." This is a defensible read but not one the checker could independently verify to a HIGH-confidence, unique boundary from the repository content alone.

## Parent-level agreement

**8 / 8 parents (100%) agree exactly** on whether the parent contains at least one BASELINE_BEFORE_FIRST_STAGE part.

| Parent | Checker: has baseline part? | Producer: has baseline part? | Agree? |
|---|---|---|---|
| `opus2_case_code_status_01` | Yes | Yes | ✓ |
| `opus_vanco_case_01` | No | No | ✓ |
| `opus_agvd_case_agvhd_01` | No | No | ✓ |
| `gpt_case_gap_2026_06_11_case_adhf_01` | Yes | Yes | ✓ |
| `gpt_case_opus5_cdi_immunocompromised_01` | No | No | ✓ |
| `gpt_case_warfarin_mvr_2026_06_11_01` | Yes | Yes | ✓ |
| `cs_thyroid_storm_main` | Yes | Yes | ✓ |
| `opus_tpn_case_mucositis_01` | No | No | ✓ |

## Baseline findings

- **Shared baseline findings (both sides agree, 5 total):** `opus2_case_code_status_01/opus2_case_code_status_q1`, `gpt_case_gap_2026_06_11_case_adhf_01/gpt_case_gap_2026_06_11_adhf_matrix_01`, `gpt_case_warfarin_mvr_2026_06_11_01/gpt_case_warfarin_mvr_2026_06_11_01_q1`, `gpt_case_warfarin_mvr_2026_06_11_01/gpt_case_warfarin_mvr_2026_06_11_01_q2`, `cs_thyroid_storm_main/cs_thyroid_storm_q1`.
- **Producer-only baseline findings:** none.
- **Checker-only baseline findings:** none.

## Gate-breach rows (row 370, row 395)

Both flagged rows resolve identically between checker and producer:

| Row | Parent/Part | Checker | Producer | Agree? |
|---|---|---|---|---|
| 370 | `cs_thyroid_storm_main`/`cs_thyroid_storm_q2` | STAGE:stage_0830 | STAGE:stage_0830 | ✓ |
| 395 | `opus_tpn_case_mucositis_01`/`opus_tpn_case_mucositis_01_q3` | STAGE:stage_2 | STAGE:stage_2 | ✓ |

## Reading of the producer's process

`locked-comparison.md` records that the producer session initially froze its own vectors while flagging (correctly, per its own governance reading) that it could not supply its own independent checker, and left `independentCheckerStatus: PENDING_EXTERNAL_SEAT`. This checker run, executed as a separate session with its own blind derivation from live sources before any producer artifact was read, is that pending independent seat.
