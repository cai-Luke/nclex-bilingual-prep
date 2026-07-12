# Batch 17 — Independent Claude Review Handoff

Date: 2026-07-12
Status: four bounded candidates staged; two concrete hold classes; no canonical write
Producer seat: Codex
Required checker seat: independent Claude/Sonnet

## Reconciliation

All 17 refs resolve on live `main`; none is already promoted. Eleven promotable records are staged
exactly once across 17A–17D. Three pure order/history records are intentionally non-rendering:

- `opus24_case_elder_neglect_med_mismanagement_01/background_discharge_plan`
- `opus26_case_refeeding_syndrome_01/admission_orders`
- `opus3_iv_potassium_safety_case_01/exhibit_stage2_revised_plan`

Three refs remain held rather than entering promotion inputs:

- `opus27_case_ipv_prenatal_care_01/ex2_initial_assessment`: current gate is 1 FAIL / 1 WARN. R9
  treats the separate 3-year-old son and child-welfare case context as the structured-measurement
  client's population. The client is an explicitly 28-year-old pregnant adult; `population: adult`
  still fails, while either pediatric value would be false.
- `opus3_iv_potassium_safety_case_01/exhibit_stage1_labs_orders` and `.../exhibit_stage3_status`:
  hold artifact gates 0 FAIL / 2 WARN, but applicator dry-run hard-errors because each exhibit ID
  exists twice in the same canonical case (baseline and stage arrays), yielding two matches.

Failed Batch 19 is unrelated and excluded. Exact deltas and dispositions are in
`EXHIBIT-FLOWSHEET-BATCH-17-COMPARISON-2026-07-12.json`.

| Candidate | Refs | Bank | Gate |
|---|---:|---|---:|
| `17A-CDIFF` | 2 | Claude | 0 FAIL / 1 WARN |
| `17B-ELDER-NEGLECT` | 3 | Claude | 0 FAIL / 7 WARN |
| `17C-REFEEDING` | 4 | Claude | 0 FAIL / 2 WARN |
| `17D-BASELINES` | 2 | hard cases | 0 FAIL / 3 WARN |

## 17A — C. difficile

Both records are untagged. Stage-1 HR/BP and potassium are measured before the new potassium order;
co-location with later replacement does not satisfy Rule F. WARN: `exhibit_stage1` matches chloride
inside the potassium-chloride/normal-saline order, not a chloride result. Both labels are `Current`.

## 17B — elder neglect / medication mismanagement

ED and home-visit records are untagged. In the six-hour response, HR/BP, RR/SpO2, sodium,
potassium, creatinine, and magnesium remain tagged after saline, K/Mg replacement, and oxygen.
Temperature and glucose are untagged: no directed temperature intervention is established, and
glucose monitoring/correction orders do not prove insulin preceded the scalar.

WARNs by ref:

- `ed_initial_findings_orders` (4): potassium/chloride are KCl/NS order hits; glucose is monitoring
  without a result; magnesium is a magnesium-sulfate order.
- `home_visit_day10_assessment` (3): potassium/chloride come from the medication bottle; glucose is
  the statement that it was not checked, with no scalar.

Labels are `Current`, `Day 10`, and `Current`.

## 17C — refeeding syndrome

Baseline and 18-hour update carry no Rule F tags. Refeeding itself is a background cause, not a
directed measurement intervention. Stage 36 tags only phosphate after initiated oral sodium
phosphate. Stage 60 tags only phosphate: the prior oral-phosphate intervention is established, but
the new IV replacement sentence says the provider ordered K-phosphate/Mg/KCl and never establishes
administration before the displayed values. The remaining vital/lab rows are untagged.

Each follow-up authors separate source-evidenced columns: current vitals plus labs labeled `12 h`,
`36 h`, or `60 h`; no panel borrows the other's time. Stage-18 trend exclusions and Stage-36 prior
phosphate remain valid same-key comparisons.

WARNs: Stage 36 sodium is the oral sodium-phosphate medication name; Stage 60 chloride is the KCl
order name. Baseline gate is clean.

## 17D — postoperative SBAR and consent

Both records are untagged. `baseline_0700` removes the historical prior-only creatinine exclusion
under current `prior_no_current`; chronic baseline creatinine 1.4 remains visible in prose. WARNs on
that ref are the unkeyed chronic creatinine and blood-glucose-check order without a scalar result.
The consent record WARN is HR `/min` staged as accepted `bpm`. Labels are `0700` and `Current`.

## Hold artifacts

`EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-17H-PRENATAL-HOLD-2026-07-12.json` preserves the
maternal-value extraction and demonstrates the population hard FAIL. Fetal heart tones remain
correctly unkeyed as maternal `hr`.

`EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-17H-IV-POTASSIUM-HOLD-2026-07-12.json` preserves
the two otherwise-valid records and demonstrates gate/applicator disagreement at canonical exhibit
identity. Its WARNs are chloride from KCl/NS order text and magnesium from prior treatment text.

## Verification and requested verdict

All four promotable candidates independently gate at 0 FAIL and applicator dry-run validates all 11
refs as supplements without `--write`. Return PASS/BLOCK separately for 17A–17D after independently
re-deriving every value, WARN, Rule F tag, exclusion, and column label. Separately confirm the two
hold diagnoses and recommend the smallest owner/architect resolution. No canonical bank, ledger, or
census write is authorized in this PR.
