# Exhibit Flowsheet Migration Batch 17 Adjudication Queue

Date: 2026-07-06
Bucket: `scattered`
Manifest slice: final 17 uncovered refreshed-`scattered` refs after Batch 16, using
`EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json` after the ABG completeness-pattern refresh
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-17-scattered-2026-07-06.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-17-scattered-2026-07-06.json
```

Result:

- 17 records
- 0 FAIL
- 27 WARN

WARN classes:

- No-value / name-collision advisory mentions:
  - Home-medication/order text: `potassium chloride`, `normal saline`, `magnesium sulfate`, and
    `sodium phosphate` orders are not laboratory values.
  - Protocol thresholds in `opus26_case_refeeding_syndrome_01/admission_orders` are not current
    flowsheet values.
  - `background_discharge_plan`, `admission_orders`, and `exhibit_stage2_revised_plan` correctly stage
    as empty panels because they contain orders/teaching/protocol values, not current lab/vital data.
- Prose-normalization candidates:
  - HR source text written as `/min` but staged with implicit `bpm` in
    `opus27_case_ipv_prenatal_care_01/ex2_initial_assessment` and
    `opus5_case_consent_interpreter_01/initial_assessment`.
- Gate 2 advisory misses that should be treated as non-blocking unless checker review finds an actual
  omission:
  - `chloride` from `potassium chloride` / `normal saline` text.
  - `glucose` from "blood glucose monitoring/checks" without a scalar result.
  - `sodium`/`phosphate` from protocol or medication-order text.
  - `magnesium` from magnesium sulfate orders without current serum results.

## Sampling

Sampling mode: final partial `scattered` closure batch under the tapered regime.

Seed: `batch17-scattered-2026-07-06`

25% seeded random sample:

- 2 `opus20_case_cdiff_01/exhibit_stage1`
- 6 `opus24_case_elder_neglect_med_mismanagement_01/six_hour_response`
- 9 `opus26_case_refeeding_syndrome_01/stage_18h_update`
- 14 `opus3_iv_potassium_safety_case_01/exhibit_stage2_revised_plan`
- 17 `opus5_case_consent_interpreter_01/initial_assessment`

Always-sampled additions:

- All 17 records are included for checker-seat review because this is the final `scattered` partial
  batch and the closure set is dominated by risk surfaces: empty no-value/order records, refeeding
  trend restatements, prior-value exclusions, post-intervention context, CBC `/uL`/`/mcL` source units,
  and HR `/min` prose-normalization candidates.

Total checker-seat sample: 17 of 17 records.

## Sample Surface

| # | exhibitRef | Extractor disposition | Gate | Review note |
|---:|---|---|---|---|
| 1 | `opus20_case_cdiff_01/exhibit_baseline` | Keyed baseline vitals and labs | OK | Weight, stool count, Braden score, eGFR, and albumin out of scope. |
| 2 | `opus20_case_cdiff_01/exhibit_stage1` | Keyed HR/BP and repeat potassium | WARN | `potassium chloride` order triggers chloride advisory; intake/output and medication dose/rate omitted. |
| 3 | `opus24_case_elder_neglect_med_mismanagement_01/background_discharge_plan` | Empty extract | WARN | History, home meds, teaching, eGFR, EF, wound dimensions, insulin dose, and sodium restriction are out of values-only scope. |
| 4 | `opus24_case_elder_neglect_med_mismanagement_01/ed_initial_findings_orders` | Keyed ED vitals | WARN | KCl/NS/magnesium orders and glucose-check frequency omitted as non-current lab/vital values. |
| 5 | `opus24_case_elder_neglect_med_mismanagement_01/home_visit_day10_assessment` | Keyed home-visit vitals | WARN | Medication evidence, wound dimensions, strength score, capillary refill, and lack of scale omitted. |
| 6 | `opus24_case_elder_neglect_med_mismanagement_01/six_hour_response` | Keyed post-treatment labs/vitals | OK | Post-intervention context applied to all keyed values; eGFR, urine output, wound dimensions, and prior eGFR 28 omitted. |
| 7 | `opus26_case_refeeding_syndrome_01/admission_orders` | Empty extract | WARN | Orders/protocol thresholds only; no current lab/vital result. |
| 8 | `opus26_case_refeeding_syndrome_01/baseline_record` | Keyed baseline vitals and labs | OK | Weight/height, QTc, albumin/prealbumin/TSH, specific gravity, and urinalysis qualifiers omitted. |
| 9 | `opus26_case_refeeding_syndrome_01/stage_18h_update` | Keyed 12-hour vitals/labs; excluded admission K/phosphorus trends | OK | Current K/phosphorus are repeated in trend sentence; prior 3.6 and 3.1 are excluded as `trend`, not Rule D. |
| 10 | `opus26_case_refeeding_syndrome_01/stage_36h_update` | Keyed 36-hour vitals/labs; excluded prior phosphorus 2.4 | WARN | Sodium phosphate medication name triggers advisory; QTc, urine output, weight gain, and oral-phosphate order omitted. |
| 11 | `opus26_case_refeeding_syndrome_01/stage_60h_update` | Keyed 60-hour vitals/labs | WARN | Replacement orders, QTc, urine output, weight, edema grade, and next-day calorie target omitted. |
| 12 | `opus27_case_ipv_prenatal_care_01/ex2_initial_assessment` | Keyed vitals and CBC subset | WARN | HR `/min` prose-normalization candidate; fundal height, fetal heart tones, trace urine protein, and bruising location omitted. |
| 13 | `opus3_iv_potassium_safety_case_01/exhibit_stage1_labs_orders` | Keyed current labs | WARN | KCl/NS/magnesium orders omitted; `chloride` advisory is from medication/fluid text, not a chloride lab. |
| 14 | `opus3_iv_potassium_safety_case_01/exhibit_stage2_revised_plan` | Empty extract | WARN | Revised KCl and magnesium sulfate orders plus future repeat-level timing are not current serum values. |
| 15 | `opus3_iv_potassium_safety_case_01/exhibit_stage3_status` | Keyed post-intervention point-of-care potassium | WARN | Magnesium warning is from prior treatment text; telemetry PVC description and IV-site findings omitted. |
| 16 | `opus4_case_postop_sbar_01/baseline_0700` | Keyed baseline vitals; excluded baseline creatinine | WARN | CKD baseline creatinine 1.4 excluded as `prior`; blood glucose checks and I/O/drain output omitted. |
| 17 | `opus5_case_consent_interpreter_01/initial_assessment` | Keyed baseline vitals and capillary glucose | WARN | HR `/min` prose-normalization candidate; IV status and surgical marking omitted. |

## Checker-Seat Adjudication (Claude, 2026-07-06)

Independent review of all 17 records against live `caseStudy.exhibits`/`stages[].exhibits` content,
pulled fresh from `banks/claude-canonical.json` (`opus20_case_cdiff_01`,
`opus24_case_elder_neglect_med_mismanagement_01`, `opus26_case_refeeding_syndrome_01`,
`opus27_case_ipv_prenatal_care_01`) and `banks/hard-cases-canonical.json`
(`opus3_iv_potassium_safety_case_01`, `opus4_case_postop_sbar_01`, `opus5_case_consent_interpreter_01`).

**Verdict: zero confirmed selection errors, zero re-dispositions.**

Specific attention items from the queue, all confirmed correct:

- Row 9 (`stage_18h_update`): the "dropped from 3.1 to 2.4" / "3.6 to 3.4" restatements are exactly the
  already-keyed current values (2.4, 3.4) plus the admission-baseline values (3.1, 3.6); only the
  baseline pair is excluded as `trend`. No `skip_serial` is needed — these are not two independently
  stated current readings, just one current value plus its own trend annotation.
- Row 10 (`stage_36h_update`): phosphorus 2.4 mg/dL is correctly excluded as `prior` — it is the
  18-hour value restated only as the protocol-trigger context for starting oral sodium phosphate, not a
  new 36-hour measurement. The actual current 36-hour phosphorus (1.9 mg/dL) is correctly keyed.
- Row 16 (`baseline_0700`): CKD "baseline creatinine 1.4 mg/dL" is correctly excluded as `prior` — it's
  a chronic-history baseline, not a value drawn at this 0700 assessment. No current creatinine is stated
  in this exhibit, so nothing is keyed in its place, which is correct rather than fabricated.
- Rows 3, 7, 14 (`background_discharge_plan`, `admission_orders`, `exhibit_stage2_revised_plan`):
  correctly empty. All three are pure history/teaching, protocol/order, or care-plan-revision narrative
  with no current patient-measured value anywhere in the exhibit.

One additional finding worth flagging as a positive correctness signal, not an error: row 12
(`opus27_case_ipv_prenatal_care_01/ex2_initial_assessment`) reports fetal heart tones at 148/min
(Doppler) alongside maternal HR 82/min in the same sentence structure the pipeline has elsewhere
treated as a single vital-signs cluster. The extractor correctly keeps these separate — fetal heart
tones are never coerced into the `hr` (maternal heart rate) label — which matters for the same reason
the ascitic-fluid-WBC and ABG-SaO2 distinctions mattered in earlier batches: same-sounding measurements
from a different physiological source must not collapse into one flowsheet field.

All remaining WARNs (medication/protocol-order name collisions for `chloride`, `magnesium`, `sodium`,
`phosphate`, and `glucose`; HR `/min` prose-normalization candidates) were independently re-verified
against full exhibit prose and are correctly benign — no chloride, magnesium, sodium, phosphate, or
glucose lab *value* was ever fabricated or omitted because of these name collisions.

**Disposition: Batch 17 is clean.** This is the final `scattered` closure batch — the refreshed
`scattered` manifest is now 152/152 covered, 0 uncovered. `prose_embedded` remains at 143/149 (6
uncovered) and `serial` remains at 5/33 (28 uncovered) as the open lanes for future batches.

After this artifact, refreshed manifest coverage is:

- `prose_embedded`: 143/149 covered, 6 uncovered
- `scattered`: 152/152 covered, 0 uncovered
- `serial`: 5/33 covered, 28 uncovered
