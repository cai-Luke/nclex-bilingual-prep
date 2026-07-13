# Exhibit Flowsheet Migration Batch 05 Adjudication Queue

Date: 2026-07-05
Bucket: `prose_embedded`
Manifest slice: `prose_embedded` panels 61-80 from `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-05-prose_embedded-2026-07-05.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-05-prose_embedded-2026-07-05.json
```

Result:

- 20 records
- 0 FAIL
- 9 WARN

WARN classes:

- No-value / name-collision advisory mentions:
  - `stage_1_handoff`: blood pressure monitoring frequency only; no BP value.
  - `baseline_protocol_resources`: anhydrous ammonia exposure name-collision; no ammonia lab value.
  - `stage_1_course`: repeat lactate order; no lactate value.
  - `initial_ed_record`: AST/ALT orders only; no numeric AST/ALT value.
  - `exhibit_stage1_orders`: order text for potassium chloride and chloride-containing IV fluids; no
    serum potassium/chloride value.
- Prose-normalization candidates:
  - HR values written as `/min` but staged as `bpm` in `baseline_assessment` and `stage1_update`.

## Sampling

Sampling mode: tapered `prose_embedded` batch after two consecutive clean 100% batches.

Seed: `batch05-prose_embedded-2026-07-05`

25% seeded random sample:

- 64 `gpt_case_neutropenic_fever_nadir_01/baseline_orders`
- 66 `gpt_case_opioid_recovery_relapse_risk_01/stage_1_update`
- 70 `gpt_case_opus23_nat_toddler_01/stage_1_imaging_caregiver_update`
- 74 `gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage1_assessment`
- 75 `gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage1_labs`

Always-sampled additions:

- 73 `gpt_case_opus5_cdi_immunocompromised_01/exhibit_background` — `excludedValues` baseline
  creatinine.
- 75 `gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage1_labs` — noncanonical CBC `/µL`
  source units plus excluded prior WBC, potassium, and creatinine values.
- 77 `gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage2_status` — noncanonical CBC `/µL`
  source unit.
- 78 `gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage3_discharge` — noncanonical CBC
  `/µL` source unit.
- 79 `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/baseline_labs` — noncanonical CBC
  `/mcL` source units.
- 80 `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/stage1_update` — `excludedValues`
  preoperative baseline BP.

Total checker-seat sample: 10 of 20 records.

## Sample Surface

| # | exhibitRef | Extractor disposition | Gate | Review note |
|---:|---|---|---|---|
| 64 | `gpt_case_neutropenic_fever_nadir_01/baseline_orders` | Keyed baseline admission Temp/HR/BP/RR/SpO2 | OK | Random sample; protocol fever thresholds are not current measurements. |
| 66 | `gpt_case_opioid_recovery_relapse_risk_01/stage_1_update` | Keyed post-analgesia HR/BP/RR/SpO2 | OK | Random sample; pain score out of allowlist scope. |
| 70 | `gpt_case_opus23_nat_toddler_01/stage_1_imaging_caregiver_update` | Keyed HR 128 | OK | Random sample; caregiver-context wording should not alter extraction. |
| 73 | `gpt_case_opus5_cdi_immunocompromised_01/exhibit_background` | Empty panel; excluded baseline creatinine 1.1 | OK | Always-sampled due to `excludedValues`; eGFR out of allowlist scope. |
| 74 | `gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage1_assessment` | Keyed current Temp/HR/BP/RR/SpO2 | OK | Random sample; all keyed values are from the current assessment line. |
| 75 | `gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage1_labs` | Keyed current CBC/CMP/lactate; excluded prior WBC/K/Cr | OK | Random + always-sampled due to `/µL` CBC units and current-vs-prior split. |
| 77 | `gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage2_status` | Keyed current vitals and labs | OK | Always-sampled due to WBC `/µL`; verify stage-2 current values only. |
| 78 | `gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage3_discharge` | Keyed discharge vitals and labs | OK | Always-sampled due to WBC `/µL`; verify discharge-time values only. |
| 79 | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/baseline_labs` | Keyed baseline CBC/coags/CMP/glucose | OK | Always-sampled due to WBC/platelets `/mcL`; eGFR out of allowlist scope. |
| 80 | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/stage1_update` | Keyed current Temp/HR/BP/RR/SpO2; excluded baseline BP | WARN | Always-sampled due to `excludedValues`; HR `/min` prose-normalization candidate. |

## Status

Codex staged the values-only artifact and deterministic gate result. Independent checker-seat
adjudication (Claude Code) of the 10-record tapered sample is complete.

Re-ran the gate against current `main`: 20 records, 0 FAIL, 9 WARN — matches the result recorded
above.

For each of the 10 sampled records, pulled the full case content from `banks/gpt-canonical.json` /
`banks/hard-cases-canonical.json` and independently re-derived the correct disposition:

- `#73 exhibit_background` and `#75 exhibit_stage1_labs` (CDI case): confirmed the current-vs-prior
  splits against source. `#75` in particular does a **triple** split in one sentence — WBC, potassium,
  and creatinine each have an explicit prior value ("was X two days ago" / "(baseline X)") correctly
  excluded while the current reading of each stays keyed. All three checked out.
- `#79`/`#80` (PE case): `stage1_update`'s `excludedValues` correctly separates the current
  post-embolism BP (100/70) from the explicit "preoperative baseline of 138/82" in the same sentence.
- `#70` (NAT toddler case): the exhibit is a dense caregiver/imaging narrative; the extractor
  correctly pulled the single embedded vital ("HR decreases to 128 with the mother present") and did
  not fabricate or omit anything else — there is no other numeric vital in that specific exhibit's
  text (the ones in the same case's `initial_assessment_labs` are a separate exhibitRef, not this
  one).
- All "out of allowlist scope" claims (eGFR, albumin, CRP, pain score) check out against
  `ANALYTE_DEFS`/`VITAL_DEFS`.

**No selection errors found.** Sampling stays tapered at 25% + always-sampled for future
`prose_embedded` batches.
