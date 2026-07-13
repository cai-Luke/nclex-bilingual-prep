# Exhibit Flowsheet Migration Batch 15 Adjudication Queue

Date: 2026-07-06
Bucket: `scattered`
Manifest slice: next 20 uncovered refreshed-`scattered` refs after Batch 14, using
`EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json` after the ABG completeness-pattern refresh
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-15-scattered-2026-07-06.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-15-scattered-2026-07-06.json
```

Result:

- 20 records
- 0 FAIL
- 16 WARN

WARN classes:

- Serial-lane advisory:
  - `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/baseline_assessment` is staged
    `skip_serial` for two same-window current BP readings (`188/104` and repeat manual `186/102`).
  - `opus_case_se_01/exhibit_baseline` is staged `skip_serial` for two current glucose readings by
    different modalities (`142` fingerstick and `148` lab draw), mirroring the resolved Batch 13
    refeeding-syndrome policy.
  - `opus_case_se_01/exhibit_stage_1` is staged `skip_serial` for two different current SpO2 readings
    after oxygen support (`92%` and repeat vitals `93%`).
- Prose-normalization candidates:
  - HR source text written as `/min` or `beats/min` but staged with implicit `bpm`.
- No-value / name-collision advisory mentions:
  - `stage_4_ich_management`: systolic-BP order threshold and IV vitamin K dose are not current BP or
    potassium values.
  - `exhibit_labs_01`: lactate dehydrogenase is not serum lactate.
  - `exhibit_stage1_01`: bilirubin stage range is a disease-staging criterion, not a patient lab
    result in that exhibit.
  - `exhibit_stage2_01` and lithium `exhibit_stage2`: potassium chloride medication orders are not
    chloride lab results.
  - SE stage 2/3: BMP `bicarbonate` advisory is the gate's synonym collision; ABG bicarbonate is keyed
    as `hco3_abg`.

Implementation note:

- This batch exposed a legitimate source-unit variant: `banks/gemini-canonical.json` uses Greek
  `μL` for CBC counts. Codex added `/μL` as an accepted WBC/platelet source unit and conversion alias,
  with `test:measurement-allowlist` coverage. This keeps `sourceUnit` byte-exact instead of laundering
  it to the micro-sign spelling `/µL`.

## Sampling

Sampling mode: `scattered` bucket ramp remains at 100%.

Batch 14 is clean scattered batch 1 of 2 for the fresh post-PaO2-fix streak. Batch 15 therefore needs
100% independent checker-seat adjudication. If Batch 15 adjudicates with zero selection errors and zero
re-dispositions, it becomes clean scattered batch 2 of 2 and future scattered batches may taper.

Total checker-seat sample: 20 of 20 records.

## Sample Surface

| # | exhibitRef | Extractor disposition | Gate | Review note |
|---:|---|---|---|---|
| 1 | `gpt_pph_2026_06_16_case_01/stage_3_update` | Keyed post-source-control vitals and repeat CBC/coags | OK | QBL/fibrinogen/urine output out of scope; all keyed values carry `post_intervention`. |
| 2 | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/baseline_assessment` | `skip_serial` | WARN | Initial and repeat manual BP values are both current and differ. |
| 3 | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/stage_1_stroke_team` | Keyed INR and BP | OK | Alteplase INR threshold is protocol text, not a patient measurement. |
| 4 | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/stage_3_post_procedure_baseline` | Keyed post-thrombectomy arrival vitals | WARN | HR `/min` prose-normalization candidate; SBP target order not keyed. |
| 5 | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/stage_4_ich_management` | Keyed repeat INR/Hgb/platelets | WARN | BP target and vitamin K order are not resulted values. |
| 6 | `opus_agvd_case_agvhd_01/exhibit_labs_01` | Keyed baseline CBC/chem/liver values | WARN | LDH is not lactate; ANC/albumin/tacrolimus/CRP out of scope. |
| 7 | `opus_agvd_case_agvhd_01/exhibit_presentation_01` | Keyed baseline vitals | WARN | HR `beats/min` prose-normalization candidate; weight/BSA/rash percent out of scope. |
| 8 | `opus_agvd_case_agvhd_01/exhibit_stage1_01` | Keyed vitals and repeat K/Mg | WARN | Disease-stage bilirubin range is not a patient lab result. |
| 9 | `opus_agvd_case_agvhd_01/exhibit_stage2_01` | Keyed post-steroid vitals and repeat labs | WARN | Potassium chloride order causes chloride advisory; non-allowlisted stool/albumin/tacrolimus values skipped. |
| 10 | `opus_agvd_case_agvhd_01/exhibit_stage3_01` | Keyed post-ruxolitinib vitals and repeat labs | WARN | Direct bilirubin/albumin/tacrolimus out of scope. |
| 11 | `opus_car_t_crs_2026_06_11_case_01/ex3` | Keyed baseline labs | OK | CRP/ferritin/fibrinogen/D-dimer/LDH out of scope. |
| 12 | `opus_car_t_crs_2026_06_11_case_01/ex4` | Keyed CRS grade-1 vitals and stat Cr/AST/ALT | OK | Same-value HR/telemetry restatement keyed once. |
| 13 | `opus_car_t_crs_2026_06_11_case_01/ex5` | Keyed fever/vitals/MAP and repeat labs | OK | CRS markers outside allowlist skipped. |
| 14 | `opus_car_t_crs_2026_06_11_case_01/ex6` | Keyed post-treatment reassessment values; excluded trend values | OK | Prior temp/HR/BP/Cr values excluded as trends. |
| 15 | `opus_case_lithium_toxicity_01/exhibit_admission` | Keyed admission vitals and labs; excluded baseline Cr | OK | Lithium/eGFR/osmolality and medication ECG intervals out of scope. |
| 16 | `opus_case_lithium_toxicity_01/exhibit_stage2` | Keyed repeat sodium/K/Cr/BUN | WARN | Potassium chloride medication order causes chloride advisory. |
| 17 | `opus_case_se_01/exhibit_baseline` | `skip_serial` | WARN | Fingerstick glucose and lab glucose differ in one exhibit. |
| 18 | `opus_case_se_01/exhibit_stage_1` | `skip_serial` | WARN | Two current post-oxygen SpO2 values differ in one exhibit. |
| 19 | `opus_case_se_01/exhibit_stage_2` | Keyed vitals, lactate, ABG, potassium | WARN | ABG bicarbonate keyed as `hco3_abg`; BMP `bicarbonate` advisory is benign. |
| 20 | `opus_case_se_01/exhibit_stage_3` | Keyed post-intubation vitals and repeat labs/ABG | WARN | ABG bicarbonate keyed as `hco3_abg`; CK/urine output/FiO2 out of scope. |

## Checker-Seat Adjudication (Claude, 2026-07-06)

100% independent review against live `caseStudy.exhibits`/`stages[].exhibits` content, pulled fresh
from all four default gate banks (`banks/gpt-canonical.json`, `banks/hard-cases-canonical.json`,
`banks/claude-canonical.json`, `banks/gemini-canonical.json` — the aGVHD case lives in the Gemini bank,
the lithium-toxicity case in the Claude bank). All 20 records checked for correct value/unit/label
against full exhibit prose, correct `extract` vs `skip_serial` disposition under Rule D, correct
`excludedValues` reasons, and any allowlisted analyte present in source but neither keyed nor excluded.

**Verdict: zero confirmed selection errors, zero re-dispositions.**

Per-record notes beyond the gate's own WARN list:

- Rows 2, 17, 18 (`skip_serial`): all three are genuine Rule D duplicates — two different current BP
  readings in one exhibit (188/104 initial vs. 186/102 repeat manual); fingerstick 142 vs. lab-draw 148
  glucose in the same exhibit (directly analogous to the resolved Batch 13 refeeding-syndrome
  differing-value precedent); and two different current SpO2 values (92% then 93%) after oxygen
  support in one exhibit. All correctly conservative.
- Row 12 (`opus_car_t_crs_2026_06_11_case_01/ex4`): "heart rate 104 and sinus tachycardia on
  telemetry" is the same HR value stated via two modalities (manual/cuff and telemetry), correctly
  keyed once — same disposition class as the resolved Batch 12 same-value dual-modality escalation, not
  a Rule D serial case.
- Row 14 (`.../ex6`): the parenthetical "down from 39.8" / "improved from 122" / "up from 88/52" /
  "improving from 1.6" comparisons are correctly excluded with reason `trend`, not treated as a second
  ambiguous current reading — a clean example of the trend/Rule-D distinction working as intended, since
  the current values (37.6, 96, 108/68, 1.2) are each stated only once in this exhibit.
- Rows 19, 20 (`opus_case_se_01/exhibit_stage_2`, `exhibit_stage_3`): ABG-derived bicarbonate is
  correctly keyed as `hco3_abg`, distinct from BMP `bicarbonate`, in every record where both patterns
  could collide. The GATE 2 `bicarbonate` advisory on these rows is the same benign synonym-collision
  class noted for `SaO2`/`spo2` in Batch 14, not an omission.
- Row 8 (`opus_agvd_case_agvhd_01/exhibit_stage1_01`): the disease-staging text "liver (stage 1,
  bilirubin 2.0-3.0 mg/dL)" is a grading-criterion range, not a resulted patient value, and is correctly
  left unkeyed — same category as the Batch 14 discharge-glucose-target exclusion.
- Rows 9, 16: "IV potassium chloride 40 mEq"/"20 mEq" are medication-order doses; GATE 2's `chloride`
  synonym pattern matches the drug name and fires an advisory, but no chloride lab value exists in
  either exhibit to omit, and the actual `potassium` lab values were correctly keyed once each from the
  labs, not doubled from the order text.
- `context: post_intervention` tagging is consistent within every exhibit this batch (all keyed values
  in a post-intervention narrative window carry the tag, including labs) — no repeat of the Batch 14
  vitals/labs tagging inconsistency.
- All remaining WARNs (HR `/min`/`beats/min` prose-normalization candidates, out-of-allowlist items
  such as ANC/albumin/tacrolimus/LDH/CRP/ferritin/fibrinogen/D-dimer/CK/eGFR/osmolality/QTc, and the
  SBP-target/vitamin-K-order non-values) were independently re-verified against full exhibit prose and
  are correctly benign.

**Disposition: Batch 15 is clean scattered batch 2 of 2.** This closes the fresh post-PaO2-fix
2-batch clean streak. Per the established prose_embedded precedent, future `scattered` batches may now
taper from 100% checker-seat sampling (e.g., to 25% + always-sampled) rather than starting a new ramp.

After this artifact, refreshed manifest coverage is:

- `prose_embedded`: 143/149 covered, 6 uncovered
- `scattered`: 115/152 covered, 37 uncovered
- `serial`: 5/33 covered, 28 uncovered
