# Campaign 16 Phase E — Independent Checker Adjudications (blind, pre-reveal)

Date: 2026-09-08
Role: Independent checker for the narrow anchor-parent-calibration pilot. Read-only. Does not repair banks, redesign schema, or continue R3.

This document mirrors `checker-adjudications.json` in human-readable form. It was written and frozen **before** any producer artifact (`producer-adjudications.*`, `locked-producer-freeze.json`, `locked-comparison.md`, `calibration-summary.json`, `report.md`) was read. See `checker-freeze.json` for the blinding/provenance statement.

## Labels

- **BASELINE_BEFORE_FIRST_STAGE** — answerable from the always-visible baseline/global case material before any declared stage is revealed; revealing the first declared stage first would expose information past the intended answer boundary.
- **STAGE:\<id\>** — earliest defensible boundary is after the named declared stage (id copied verbatim from `caseStudy.stages[].id`).
- **AMBIGUOUS** — repository content does not support a unique defensible earliest boundary without guessing (P8).

## Parent 1 — `opus2_case_code_status_01` (claude-canonical, 3-stage/5-part)

Declared stages: `stage_1`, `stage_2`, `stage_3`

| Part | Label | Basis |
|---|---|---|
| `opus2_case_code_status_q1` | **BASELINE_BEFORE_FIRST_STAGE** | Stem anchored "At 0700"; the refusal statement and 0700 vitals/labs are top-level baseline. Stage 1 narrates the nurse *already having* documented capacity/verbatim statements (the correct answer) plus later provider-paging events — revealing it first spoils the answer. |
| `opus2_case_code_status_q2` | STAGE:stage_1 | "At 0800..." — Dr. Reeves's response is only in stage_1. |
| `opus2_case_code_status_q3` | STAGE:stage_2 | "By 1030..." — hypoxemia progression is only in stage_2. |
| `opus2_case_code_status_q4` | STAGE:stage_3 | "At 1100..." — RRT activation is only in stage_3. |
| `opus2_case_code_status_q5` | STAGE:stage_3 | "At 1130..." — DNAR/DNI entry is only in stage_3. |

## Parent 2 — `opus_vanco_case_01` (claude-canonical, ordinary 3-stage/6-part)

Declared stages: `stage_1_infusion_reaction`, `stage_2_trough_monitoring`, `stage_3_aki_tinnitus`

All 6 parts carry an explicit `Stage N:` prefix in their own stem text, and their content is drawn only from the matching stage's exhibits. No baseline-answerable parts.

| Part | Label |
|---|---|
| `opus_vanco_case_01_q1_infusion_reaction` | STAGE:stage_1_infusion_reaction |
| `opus_vanco_case_01_q2_documentation_cloze` | STAGE:stage_1_infusion_reaction |
| `opus_vanco_case_01_q3_supratherapeutic_trough_order` | STAGE:stage_2_trough_monitoring |
| `opus_vanco_case_01_q4_ototoxicity_screening` | STAGE:stage_2_trough_monitoring |
| `opus_vanco_case_01_q5_aki_cue_matrix` | STAGE:stage_3_aki_tinnitus |
| `opus_vanco_case_01_q6_lisinopril_aki` | STAGE:stage_3_aki_tinnitus |

## Parent 3 — `opus_agvd_case_agvhd_01` (gemini-canonical, ordinary 3-stage/6-part)

Declared stages: `stage_1`, `stage_2`, `stage_3`

All 6 parts carry an explicit "At Stage N" phrase in their own stem, and required data is only in the matching stage's exhibit. No baseline-answerable parts.

| Part | Label |
|---|---|
| `opus_agvd_case_agvhd_01_q1` | STAGE:stage_1 |
| `opus_agvd_case_agvhd_01_q2` | STAGE:stage_1 |
| `opus_agvd_case_agvhd_01_q3` | STAGE:stage_2 |
| `opus_agvd_case_agvhd_01_q4` | STAGE:stage_2 |
| `opus_agvd_case_agvhd_01_q5` | STAGE:stage_2 |
| `opus_agvd_case_agvhd_01_q6` | STAGE:stage_3 |

## Parent 4 — `gpt_case_gap_2026_06_11_case_adhf_01` (gpt-canonical, partially affected, 2-stage/4-part)

Declared stages: `adhf_stage2`, `adhf_stage3` (no `adhf_stage1` exists). Only 1 of 4 parts is affected; the other 3 already carry valid `stageId` anchors and were not re-adjudicated.

| Part | Label | Basis |
|---|---|---|
| `gpt_case_gap_2026_06_11_adhf_matrix_01` | **BASELINE_BEFORE_FIRST_STAGE** | All 5 matrix rows (SpO2 89% RA, crackles/orthopnea, troponin, 3.2 kg weight gain, potassium 3.7) are drawn verbatim from the two top-level baseline exhibits. The first declared stage (`adhf_stage2`) narrates a materially later deterioration event (SpO2 84%, pink frothy sputum) that is not needed to classify the baseline findings. |

## Parent 5 — `gpt_case_opus5_cdi_immunocompromised_01` (gpt-canonical, ordinary 3-stage/6-part)

Declared stages: `stage1`, `stage2`, `stage3`. **Structural note:** this parent's top-level `caseStudy.exhibits` is an empty array — all narrative, including background/history, lives inside `stage1`. There is no baseline state distinguishable from stage1 for this parent, so no part can be BASELINE_BEFORE_FIRST_STAGE here.

| Part | Label |
|---|---|
| `gpt_case_opus5_cdi_immunocompromised_01_q1` | STAGE:stage1 |
| `gpt_case_opus5_cdi_immunocompromised_01_q2` | STAGE:stage1 |
| `gpt_case_opus5_cdi_immunocompromised_01_q3` | STAGE:stage1 |
| `gpt_case_opus5_cdi_immunocompromised_01_q4` | STAGE:stage2 |
| `gpt_case_opus5_cdi_immunocompromised_01_q5` | STAGE:stage1 |
| `gpt_case_opus5_cdi_immunocompromised_01_q6` | STAGE:stage3 |

## Parent 6 — `gpt_case_warfarin_mvr_2026_06_11_01` (gpt-canonical, 4-stage/6-part)

Declared stages: `stage_1_1400`, `stage_2_2200`, `stage_3_0645`, `stage_3_1200`

| Part | Label | Basis |
|---|---|---|
| `gpt_case_warfarin_mvr_2026_06_11_01_q1` | **BASELINE_BEFORE_FIRST_STAGE** | Stem anchored "At 1030"; home-med list and INR 5.2/bleeding are top-level baseline. Stage 1 narrates the warfarin *already* being held (the correct answer) — revealing it first spoils the answer. |
| `gpt_case_warfarin_mvr_2026_06_11_01_q2` | **BASELINE_BEFORE_FIRST_STAGE** | The naproxen report is itself top-level baseline content. Stage 1 narrates "provider notification of naproxen exposure" as already done (the correct answer) — revealing it first spoils the answer. |
| `gpt_case_warfarin_mvr_2026_06_11_01_q3` | STAGE:stage_1_1400 | Stem explicitly: "vitamin K 2.5 mg by mouth during Stage 1." |
| `gpt_case_warfarin_mvr_2026_06_11_01_q4` | STAGE:stage_3_0645 | Stem anchored "At 0645"; hematuria/guaiac-positive data is only in stage_3_0645. |
| `gpt_case_warfarin_mvr_2026_06_11_01_q5` | STAGE:stage_3_1200 | IV vitamin K / 4-factor PCC orders are only in stage_3_1200. |
| `gpt_case_warfarin_mvr_2026_06_11_01_q6` | STAGE:stage_3_1200 | Stem anchored "At 1200"; INR 3.8/negative CT data is only in stage_3_1200. |

## Parent 7 — `cs_thyroid_storm_main` (hard-cases-canonical, breach row 370, 2-stage/4-part)

Declared stages: `stage_0830`, `stage_1200`

| Part | Label | Basis |
|---|---|---|
| `cs_thyroid_storm_q1` (row 369) | **BASELINE_BEFORE_FIRST_STAGE** | Stem explicitly restricted to "the client's initial 0800 triage presentation"; all 4 matrix rows are top-level baseline data. Stage `stage_0830` discloses confirmatory labs and the treatment sequence tested in Q2 — not needed to analyze the 0800 triage. |
| `cs_thyroid_storm_q2` (row 370) | STAGE:stage_0830 | Stem explicitly: "Based on the 0830 orders." |
| `cs_thyroid_storm_q3` (row 371) | **AMBIGUOUS** | Stem spans "between 0800 and 1200"; the general supportive interventions do not cite a single fact gated behind either stage specifically, and the stem does not anchor to one stage. Per P8, not resolved as baseline or a specific stage without guessing. |
| `cs_thyroid_storm_q4` (row 372) | STAGE:stage_1200 | Stem explicitly: "evaluates the 1200 laboratory results." |

## Parent 8 — `opus_tpn_case_mucositis_01` (hard-cases-canonical, breach row 395, ordinary 3-stage/6-part)

Declared stages: `stage_1`, `stage_2`, `stage_3`

All 6 parts carry an explicit "At Stage N" phrase in their own stem, and required data is only in the matching stage's exhibit. No baseline-answerable parts.

| Part | Label |
|---|---|
| `opus_tpn_case_mucositis_01_q1` (row 393) | STAGE:stage_1 |
| `opus_tpn_case_mucositis_01_q2` (row 394) | STAGE:stage_1 |
| `opus_tpn_case_mucositis_01_q3` (row 395) | STAGE:stage_2 |
| `opus_tpn_case_mucositis_01_q4` (row 396) | STAGE:stage_2 |
| `opus_tpn_case_mucositis_01_q5` (row 397) | STAGE:stage_3 |
| `opus_tpn_case_mucositis_01_q6` (row 398) | STAGE:stage_3 |

## Summary counts

- Total affected parts adjudicated: **40**
- BASELINE_BEFORE_FIRST_STAGE: **5** (parents 1, 4, 6 ×2, 7)
- AMBIGUOUS: **1** (parent 7, part 3)
- STAGE:\<id\>: **34**
- Parents containing at least one BASELINE_BEFORE_FIRST_STAGE finding: **4** of 8 (`opus2_case_code_status_01`, `gpt_case_gap_2026_06_11_case_adhf_01`, `gpt_case_warfarin_mvr_2026_06_11_01`, `cs_thyroid_storm_main`)
