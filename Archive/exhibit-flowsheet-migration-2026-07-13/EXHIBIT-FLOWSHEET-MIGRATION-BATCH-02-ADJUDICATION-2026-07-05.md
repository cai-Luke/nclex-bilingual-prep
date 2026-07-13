# Exhibit Flowsheet Migration Batch 02 Adjudication Queue

Date: 2026-07-05
Bucket: `prose_embedded`
Manifest slice: first 20 `prose_embedded` panels from `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-02-prose_embedded-2026-07-05.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-02-prose_embedded-2026-07-05.json
```

Result:

- 20 records
- 0 FAIL
- 9 WARN after the source-unit-laundering gate fix

WARNs include 7 advisory GATE 2 completeness checks from allowlist label mentions without extractable
measurement values:

- `case_preeclampsia_magnesium_01/orders`: medication-order prose mentions `Magnesium sulfate` and
  `2 g/hr`; no serum magnesium or HR value is present.
- `case_sepsis_pneumonia_01/sepsis_orders`: order prose says `repeat lactate`; no lactate value is
  present.
- `cs_stemi_vfib_04/arrest_1415`: `rapid waveform` implies rhythm rate qualitatively; no numeric HR is
  present.
- `gemini_gap_case_pediatric_diabetes_03/ex1_ped_dm_orders`: glucose-monitoring order only; no glucose
  value is present.
- `gemini_gap_case_pediatric_diabetes_03/ex2_school_exercise`: education prose mentions blood glucose
  levels; no glucose value is present.
- `gemini_gapfill_case_2026_06_10_case_caregiver_08/history`: mentions blood pressure medicine; no BP
  value is present.

The two additional WARNs are nonstandard/conflicting vital-unit source prose now surfaced for the
prose-normalization lane:

- `case_ami_01/ex_vitals_new`: `RR: 24 bpm` staged as RR `/min`.
- `case_sepsis_pneumonia_01/triage`: `HR 118/min` staged as HR `bpm`.

## 100% Adjudication Surface

Per protocol, this first `prose_embedded` batch requires 100% independent adjudication before widening.

| # | exhibitRef | Extractor disposition | Gate | Review note |
|---:|---|---|---|---|
| 1 | `case_ami_01/ex_vitals_new` | Keyed SBP/DBP/HR/RR | OK | Source says `RR: 24 bpm`; staged as RR `/min` via implicit vital-unit handling. Reviewer should confirm this is acceptable source-prose typo handling. |
| 2 | `case_preeclampsia_magnesium_01/orders` | Empty panel | WARN | Medication magnesium dose/rate only, no serum magnesium or HR measurement. |
| 3 | `case_sepsis_pneumonia_01/sepsis_orders` | Empty panel | WARN | `repeat lactate` order only, no lactate value. |
| 4 | `case_sepsis_pneumonia_01/triage` | Keyed Temp/HR/RR/BP/SpO2 | OK | Current vital-sign sentence. |
| 5 | `claude_cs_jun06_cdiff_sic_01/assessment` | Keyed Temp/WBC | OK | WBC source unit is ASCII `/mm3`; gate now accepts this as a source spelling variant of `/mm³`. |
| 6 | `claude_cs_jun06_chest_tube_rrp_01/drainage_obs` | Keyed SpO2 | OK | Current oxygen saturation. |
| 7 | `claude_cs_jun06_chest_tube_rrp_01/incident` | Keyed SpO2 | OK | Current oxygen saturation. |
| 8 | `cs_ckd_01/assessment` | Keyed BP | OK | Current BP; weight/dry weight out of allowlist scope. |
| 9 | `cs_copd_01/labs` | Keyed pH/PaCO2/PaO2/HCO3/SAO2 | OK | Unitless pH allowed by gate; ABG bicarbonate keyed as `hco3_abg` in staged artifact. |
| 10 | `cs_ngn_001_anorexia/ex_001_labs` | Keyed Na/K/phosphate/Mg/glucose | OK | Current lab sentence. |
| 11 | `cs_ngn_004_blood/ex_004_vitals` | Keyed BP/HR/RR/Temp | OK | Current vital-sign sentence. |
| 12 | `cs_ngn_007_dic/ex_007_labs` | Keyed platelets/PTT | OK | PT, D-dimer, fibrinogen are out of current allowlist scope. |
| 13 | `cs_ngn_010_ad/ex_010_vitals` | Keyed BP/HR | OK | Current vital-sign sentence. |
| 14 | `cs_stemi_vfib_04/arrest_1415` | Empty panel | WARN | Qualitative VF/rhythm description only; no numeric HR. |
| 15 | `gemini_gap_case_chronic_hf_05/ex1_hf_clinic_visit` | Keyed BP/HR | OK | Weight and medication doses out of allowlist scope. |
| 16 | `gemini_gap_case_cirrhosis_homecare_04/ex1_cirrhosis_clinic_note` | Keyed BP/HR | OK | Current clinic note vitals. |
| 17 | `gemini_gap_case_hypertension_lifestyle_02/ex1_htn_baseline` | Keyed current BP; excluded prior BP | OK | Prior visit BP excluded as `prior`. |
| 18 | `gemini_gap_case_pediatric_diabetes_03/ex1_ped_dm_orders` | Empty panel | WARN | Glucose-monitoring order only; insulin dosing/carb ratio out of scope. |
| 19 | `gemini_gap_case_pediatric_diabetes_03/ex2_school_exercise` | Empty panel | WARN | Glucose-level education prose only; no value. |
| 20 | `gemini_gapfill_case_2026_06_10_case_caregiver_08/history` | Empty panel | WARN | Blood-pressure medication mention only; no BP value. |

## Status

Independent Opus adjudication found no selection errors. This is the first clean full-adjudication
`prose_embedded` batch; one more clean 100% `prose_embedded` batch is required before sampling can
taper.
