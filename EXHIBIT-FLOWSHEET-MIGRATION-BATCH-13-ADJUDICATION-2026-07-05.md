# Exhibit Flowsheet Migration Batch 13 Adjudication Queue

Date: 2026-07-05
Bucket: `scattered`
Manifest slice: `scattered` panels 61-80 from `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-13-scattered-2026-07-05.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-13-scattered-2026-07-05.json
```

Result:

- 20 records
- 0 FAIL
- 38 WARN

WARN classes:

- Rule C / unit-source discipline:
  - `gpt_case_lateral_incivility_01/baseline_assessment_labs`,
    `gpt_case_neutropenic_fever_nadir_01/initial_assessment_labs`, and
    `gpt_case_pressure_injury_prevention_mobility_01/baseline_assessment_labs` contain abbreviated
    lab lists with unitless chemistry values. Explicit-unit CBC/vital values are keyed; unitless
    chemistry values stay prose.
  - `gpt_case_refeeding_syndrome_tpn_01/stage_2_update` and `.../stage_3_update` mention sodium only
    through sodium phosphate treatment orders, not current serum sodium values.
- Rule D / serial-lane advisory:
  - `gpt_case_pressure_injury_prevention_mobility_01/stage_3_update` is `skip_serial` for orthostatic
    BP/HR plus later current vitals in the same exhibit.
  - `gpt_case_refeeding_syndrome_tpn_01/stage_1_update` is `skip_serial` for two differing current
    glucose readings: repeat-lab glucose 198 and point-of-care glucose 204 mg/dL.
- Multi-subject / attribution discipline:
  - `gpt_case_mass_casualty_start_triage_01/triage_point_findings` is an empty `extract` panel, not
    `skip_serial`; multiple victims' RR/pulse/ammonia-exposure findings cannot be attributed to one
    client.
- Prose-normalization candidates:
  - HR values written as `/min` but staged as `bpm` in the HIPAA disclosure and nine-month well-child
    records.
- No-value / name-collision advisory mentions:
  - `gpt_case_nurse_provider_conflict_01/stage_1_order_conflict`: potassium chloride is an order dose,
    creatinine is qualitative ("has risen"), and the potassium `3.1` has no source unit.
  - `gpt_case_nurse_provider_conflict_01/stage_2_escalation`: "Potassium has not been administered" is
    an order/action statement, not a current lab value.

## Sampling

Sampling mode: `scattered` bucket ramp reset.

Batch 12 did not count clean after the confirmed gallstone omission. Batch 13 is therefore queued for
100% independent checker-seat adjudication. If no selection errors or re-dispositions are found, it
becomes clean scattered batch 1 of 2 for a fresh taper attempt.

Total checker-seat sample: 20 of 20 records.

## Sample Surface

| # | exhibitRef | Extractor disposition | Gate | Review note |
|---:|---|---|---|---|
| 1 | `gpt_case_hipaa_disclosure_breach_01/baseline_assessment_labs` | Keyed 0715 vitals and 0600 Hgb/Cr/glucose | WARN | HR `/min` prose-normalization candidate; eGFR out of scope. |
| 2 | `gpt_case_lateral_incivility_01/baseline_assessment_labs` | Keyed 1930 vitals only | WARN | 0600 chemistry/CBC/BNP values lack source units; UA and telemetry narrative out of scope. |
| 3 | `gpt_case_lateral_incivility_01/baseline_client_record` | Empty panel with prior/trend BP/Cr excluded | OK | Arrival BP, baseline creatinine, and BP trend are not current values. |
| 4 | `gpt_case_major_burn_inhalation_fluid_creep_01/baseline_labs` | Keyed CBC/BMP/ABG/lactate values | OK | PaO2, carboxyhemoglobin, urinalysis out of current allowlist scope. |
| 5 | `gpt_case_mass_casualty_start_triage_01/triage_point_findings` | Empty panel | WARN | Multi-victim scene; no single-client attribution field, so no values are keyed. |
| 6 | `gpt_case_neutropenic_fever_nadir_01/initial_assessment_labs` | Keyed vitals, explicit-unit CBC values, lactate | WARN | BMP values are unitless; ANC/UA/urine output out of scope. |
| 7 | `gpt_case_neutropenic_fever_nadir_01/stage_2_course` | Keyed 1745 vitals and 1800 lactate | OK | Prior lactate 1.4 excluded; intervention starts after these values. |
| 8 | `gpt_case_nine_month_well_child_safety_01/baseline_record` | Keyed vitals, Hgb/Hct | WARN | HR `/min` candidate; anthropometrics/lead out of scope. |
| 9 | `gpt_case_nurse_provider_conflict_01/stage_1_order_conflict` | Empty panel | WARN | Potassium chloride is an order dose; potassium 3.1 lacks unit; creatinine is qualitative. |
| 10 | `gpt_case_nurse_provider_conflict_01/stage_2_escalation` | Keyed current vitals | WARN | Potassium text is about the unadministered order, not a current lab. |
| 11 | `gpt_case_opioid_recovery_relapse_risk_01/baseline_assessment_labs` | Keyed current vitals | OK | CBC/BMP/hepatic/coag panels are qualitative only; drug screen out of scope. |
| 12 | `gpt_case_opus23_nat_toddler_01/initial_assessment_labs` | Keyed vitals and explicit labs | OK | PT/lipase/urinalysis out of allowlist scope. |
| 13 | `gpt_case_overdue_preventive_screening_01/baseline_assessment` | Keyed vitals and fingerstick glucose | OK | Screening/literacy scores and urine dipstick out of scope. |
| 14 | `gpt_case_overdue_preventive_screening_01/stage_3_followup` | Keyed fasting glucose and vitals | OK | Lipids and vaccine scheduling out of scope. |
| 15 | `gpt_case_pressure_injury_prevention_mobility_01/baseline_assessment_labs` | Keyed vitals, explicit CBC values, INR | WARN | Na/K/BUN/Cr/glucose are unitless; albumin/prealbumin out of scope. |
| 16 | `gpt_case_pressure_injury_prevention_mobility_01/stage_3_update` | `skip_serial` | WARN | Orthostatic supine/standing BP/HR plus later current vitals trigger Rule D. |
| 17 | `gpt_case_refeeding_syndrome_tpn_01/baseline_record` | Keyed current vitals/POC glucose; prior PACU labs excluded | OK | Current PACU-era lab list is explicitly 6 hours earlier and excluded as prior. |
| 18 | `gpt_case_refeeding_syndrome_tpn_01/stage_1_update` | `skip_serial` | WARN | Repeat-lab glucose 198 and POC glucose 204 mg/dL are differing current glucose readings. |
| 19 | `gpt_case_refeeding_syndrome_tpn_01/stage_2_update` | Keyed post-repletion labs/vitals | WARN | Values carry `post_intervention`; sodium appears only in sodium phosphate order text. |
| 20 | `gpt_case_refeeding_syndrome_tpn_01/stage_3_update` | Keyed post-intervention labs/vitals | WARN | Values carry `post_intervention`; sodium appears only in sodium phosphate order text. |

## Status

Codex staged the fourth `scattered` values-only artifact and deterministic gate result. Independent
checker-seat adjudication of all 20 records is pending. Because Batch 12 reset the ramp, this batch
must adjudicate clean before it can count as clean scattered batch 1 of 2.
