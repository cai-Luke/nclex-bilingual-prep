# Batch 20 — Independent Claude Review Handoff

Date: 2026-07-13
Status: five bounded candidates staged; no canonical write
Producer seat: Codex
Required checker seat: independent Claude/Sonnet

## Live-main reconciliation

Batch 20 is the authoritative serial redo. Failed Batch 19 is excluded in full and is not a
promotion input. All 28 Batch 20 refs resolve exactly once on current `main`, none is already
promoted, and the original adjudications reconcile to ten actionable `extract` records plus
eighteen intentionally non-rendering records. The latter are fourteen genuine same-client serial
or preservation records and four empty, multi-client, or no-current-value records. Their exact refs
and dispositions are recorded in
`EXHIBIT-FLOWSHEET-BATCH-20-COMPARISON-2026-07-13.json`.

The ten actionable refs are staged once across five bounded candidates. Every candidate gates at
0 FAIL and passes an explicit-ref applicator dry-run without `--write`.

| Candidate | Refs | Banks | Gate |
|---|---:|---|---:|
| `20A-SIMPLE-CURRENT` | 3 | GPT | 0 FAIL / 4 WARN |
| `20B-NURSE-CONFLICT` | 2 | GPT | 0 FAIL / 4 WARN |
| `20C-PE` | 1 | hard cases | 0 FAIL / 3 WARN |
| `20D-TREATMENT` | 2 | GPT + Claude | 0 FAIL / 3 WARN |
| `20E-POSTOP` | 2 | Claude + hard cases | 0 FAIL / 2 WARN |

## 20A — simple current records

- `gpt_case_caregiver_role_strain_dementia_01/stage_3_follow_up`: current follow-up vitals only,
  implicit `Current` column, no Rule F tags. WARN R9 is a duration false positive: the case contains
  a `3-year history` of Alzheimer disease, not a pediatric client. The serial WARN is caused by the
  prose reference to prior `BP readings`, not a second numeric BP dataset in this exhibit.
- `gpt_case_lateral_incivility_01/stage_2_bp_spike`: 2200 vitals, no Rule F tags. The serial WARN is
  the order threshold `SBP > 180`, not a second observed BP dataset.
- `gpt_opus21_case_colostomy_lep_discharge_01/initial_record`: 0700 vitals and labs, no Rule F tags.
  The serial WARN is the same creatinine 0.9 restated in prose, not differing serial values.

## 20B — nurse/provider conflict

- `gpt_case_nurse_provider_conflict_01/baseline_record` uses source-authored explicit columns:
  vitals `1900` and labs `1600`. Its prior creatinine 1.3, potassium 3.8, and creatinine 1.4
  exclusions remain eligible because each has a current same-key value. WARNs: the serial heuristic
  sees those prior/restated potassium, chloride, and creatinine values; Gate 2's `hco3_abg`
  advisory is a synonym collision with the chemistry HCO3/bicarbonate value, which is keyed as
  `bicarbonate`.
- `gpt_case_nurse_provider_conflict_01/stage_3_resolution` uses explicit labs column `2245`.
  Potassium 3.4 retains `post_intervention`: the same sentence says it was drawn after the second
  administered replacement dose. WARNs: order/dose chronology trips the serial heuristic; the
  chloride advisory comes from the potassium-chloride medication order, not an observed chloride
  result.

## 20C — pulmonary embolism

`gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/stage2_update` corrects the old analyte identity
from troponin T to source-explicit `troponin_i`, and keys ABG `sao2` separately from pulse-oximetry
`spo2`. It uses source-authored explicit columns `Stat` / `急查` for labs and `0930` for vitals.
The stat labs and ABG precede UFH administration and carry no Rule F tag.

The five repeat measurements require individual Rule F review:

- HR 118, SBP 98, and DBP 66 occur ten minutes after the documented UFH bolus and infusion start;
  the treatment targets the acute PE/hemodynamic disease domain.
- RR 28 and SpO2 93 are explicitly measured `on non-rebreather`, a same-record connection to the
  oxygen intervention.

The producer disposition retains `post_intervention` on all five, but the checker should adjudicate
each independently under the refined directed-intervention-plus-own-record-linkage rule rather than
approve the cluster wholesale. WARNs: R9 mistakes `5 years ago` smoking cessation for pediatric
age; the serial heuristic mistakes the target aPTT 60–80 for a second observed PTT; HR's source
`/min` is normalized to the canonical `bpm`, while RR correctly retains `/min`.

## 20D — treatment response

- `gpt_case_warfarin_mvr_2026_06_11_01/stage_3_orders_outcomes` uses source-authored `1100–1200`
  columns for vitals and labs. HR/BP follow reversal and transfusion, INR follows vitamin K/PCC,
  and hemoglobin follows one unit PRBC with the second infusing; all five retain Rule F tags.
  WARNs: earlier/order INR and potassium language trips serial detection; the potassium advisory is
  medication/order text, not an unkeyed observed value.
- `opus_case_lithium_toxicity_01/exhibit_stage1` uses source-authored vitals column `0930`. HR 112
  and BP 94/58 retain Rule F tags because the record says a saline bolus was initiated before the
  0930 worsening measurements. Its serial WARN comes from one current BP plus order/history text,
  not a second observed dataset.

## 20E — postoperative records

- `opus1_case_tha_discharge_lep_01/baseline_record` uses explicit vitals `1600` and labs `Current`
  columns so the admission time 1530 is not promoted as a measurement label. Prior creatinine 1.3
  and hemoglobin 12.1 exclusions remain eligible because current same-key values exist. No Rule F
  tags occur. The serial WARN comes from historical HR/creatinine prose.
- `opus4_case_postop_sbar_01/stage2_provider_response` uses explicit vitals/labs `1200` columns so
  the 1115 call time is not used as the measurement label. No Rule F tags occur because the
  resident gave no new order or intervention. The serial WARN comes from narrative trend language
  around lactate, not a second current numeric dataset in this exhibit.

## Requested verdict

Return PASS/BLOCK separately for 20A through 20E. Re-derive every staged value, omission,
`excludedValues` disposition, analyte identity, population, explicit column/evidence/label,
measurement-level Rule F tag, and every WARN against canonical source. No canonical bank,
bank-review ledger, migration ledger, or census write is authorized in this PR.
