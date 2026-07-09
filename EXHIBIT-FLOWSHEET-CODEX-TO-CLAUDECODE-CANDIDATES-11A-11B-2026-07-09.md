# Exhibit Flowsheet Structured Promotion Candidates 11A + 11B — Codex to Claude Code

Date: 2026-07-09
Producer: Codex
Promotion gate: Claude Code

## Scope

Candidate artifacts:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-11A-2026-07-09.json`
- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-11B-2026-07-09.json`

Source artifact:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-11-scattered-2026-07-05.json`

Selected refs:

Candidate 11A:

- `gemini_gap_case_pediatric_croup_02/ex2_treatment_response`
- `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/admission_labs`
- `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/stage1_course`
- `gpt_case_caregiver_role_strain_dementia_01/baseline_assessment_and_labs`
- `gpt_case_client_advocacy_refusal_01/stage_2_update`

Candidate 11B:

- `gpt_2026_06_13_case_delirium_uti_01/ed_assessment_labs`
- `gpt_2026_06_13_case_delirium_uti_01/ed_course`
- `gpt_2026_06_13_case_delirium_uti_01/med_surg_update`
- `gpt_2026_06_13_case_delirium_uti_01/recovery_update`
- `gpt_case_client_advocacy_refusal_01/baseline_record`

No canonical bank write was performed by Codex.

## Routing

- Candidate 11A routes one ref to `banks/gemini-canonical.json`, two refs to `banks/gpt-canonical.json`, and two refs to `banks/hard-cases-canonical.json`.
- Candidate 11B routes all five refs to `banks/gpt-canonical.json`.

## Gate Shape

- Candidate 11A is low-noise: `0 FAIL / 0 WARN`.
- Candidate 11B is intentionally not warning-free: `0 FAIL / 6 WARN`.
- The 11B WARNs are the same adjudicated Batch 11 surfaces:
  - four HR values written in source prose as `/min` but staged under the allowlist's `bpm` heart-rate unit;
  - sodium/chloride mentions in `ed_course` caused by IV fluid text, not serum electrolyte results.
- These are disclosed here for gate-seat review rather than hidden by re-keying or source-unit laundering.

## Deliberate Exclusions

- Batch 11 empty/no-value rows, `skip_serial` rows, and excluded-only rows remain deferred.
- The acute hemolytic transfusion-reaction cluster remains deferred because every candidate row carries the known HR `/min` prose-normalization WARN plus a denser lab/vitals review surface.
- No selected ref contains SaO2 or troponin I.
- Candidate 11B includes `excludedValues` on `ed_assessment_labs` and `baseline_record`; these are prior/baseline values to verify absent from the canonical write.
- No selected ref contains `unitAliases`.

## Review Notes

- Candidate 11A:
  - `ex2_treatment_response` keys only post-racemic-epinephrine SpO2/HR with `post_intervention`.
  - `admission_labs` correctly keeps venous pH as `ph` while VBG pCO2 and urine sodium remain out of scope per Batch 11 adjudication.
  - `stage1_course` keys post-fluid/medication-review vitals with `post_intervention`.
  - `baseline_assessment_and_labs` keys Margaret's vitals/labs only; weight, albumin/prealbumin, TSH, and UA remain prose.
  - `stage_2_update` keys renewed-refusal vitals/BNP/Cr/K/Na with no context tag.
- Candidate 11B:
  - Delirium/UTI `ed_assessment_labs` keys ED vitals/labs and keeps baseline creatinine excluded.
  - `ed_course` keys post-fluid/ceftriaxone hour-3 vitals; sodium/chloride are IV fluid terms, not serum values.
  - `med_surg_update` and `recovery_update` key improving post-intervention vitals/labs.
  - Client-advocacy `baseline_record` keys baseline vitals/labs and keeps baseline creatinine 2.8 excluded.
- All selected refs should remain supplement-only with prose preserved.

## Timestamp Sanity

After Claude's Candidate 06A column-label finding, Codex ran a title/content timestamp sanity pass on every selected ref:

- Candidate 11A labels: `0330`, `Current`, `Current`, `Current`, `Current`.
- Candidate 11B labels: `Current`, `Current`, `Current`, `Current`, `Current`.
- No selected row has a competing body-text decoy timestamp tied to a different clinical event.

## Gate Output

Current-bank flowsheet gate, Candidate 11A:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-11A-2026-07-09.json --bank banks/gemini-canonical.json --bank banks/gpt-canonical.json --bank banks/hard-cases-canonical.json
```

Result:

```text
EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-11A-2026-07-09.json: 5 records, 0 FAIL, 0 WARN
```

Current-bank flowsheet gate, Candidate 11B:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-11B-2026-07-09.json --bank banks/gpt-canonical.json
```

Result:

```text
EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-11B-2026-07-09.json: 5 records, 0 FAIL, 6 WARN
```

Applicator dry-run, Candidate 11A:

```sh
npm run structured-measurements:apply -- --refs gemini_gap_case_pediatric_croup_02/ex2_treatment_response,gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/admission_labs,gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/stage1_course,gpt_case_caregiver_role_strain_dementia_01/baseline_assessment_and_labs,gpt_case_client_advocacy_refusal_01/stage_2_update EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-11A-2026-07-09.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: gemini-canonical.json (1 exhibit refs), gpt-canonical.json (2 exhibit refs), hard-cases-canonical.json (2 exhibit refs)
```

Applicator dry-run, Candidate 11B:

```sh
npm run structured-measurements:apply -- --refs gpt_2026_06_13_case_delirium_uti_01/ed_assessment_labs,gpt_2026_06_13_case_delirium_uti_01/ed_course,gpt_2026_06_13_case_delirium_uti_01/med_surg_update,gpt_2026_06_13_case_delirium_uti_01/recovery_update,gpt_case_client_advocacy_refusal_01/baseline_record EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-11B-2026-07-09.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: gpt-canonical.json (5 exhibit refs)
```

Mechanical suite run by Codex:

```sh
npm run validate-bank -- banks/*.json
npm run scan-unknown-keys
npm run test:structured-measurements
npm run test:measurement-allowlist
npm run census:check
npm run build
npm run test:schema-bank
npm run test:flowsheet-gate
```

Results:

- All passed.
- `scan-unknown-keys` reported 0 off-schema key occurrences; generated report was removed.
- `build` passed with the existing Vite large-chunk warning.

## Write Commands For Gate Seat

After content review, Claude Code can apply Candidate 11A with:

```sh
npm run structured-measurements:apply -- --write --refs gemini_gap_case_pediatric_croup_02/ex2_treatment_response,gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/admission_labs,gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/stage1_course,gpt_case_caregiver_role_strain_dementia_01/baseline_assessment_and_labs,gpt_case_client_advocacy_refusal_01/stage_2_update EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-11A-2026-07-09.json
```

After content review, Claude Code can apply Candidate 11B with:

```sh
npm run structured-measurements:apply -- --write --refs gpt_2026_06_13_case_delirium_uti_01/ed_assessment_labs,gpt_2026_06_13_case_delirium_uti_01/ed_course,gpt_2026_06_13_case_delirium_uti_01/med_surg_update,gpt_2026_06_13_case_delirium_uti_01/recovery_update,gpt_case_client_advocacy_refusal_01/baseline_record EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-11B-2026-07-09.json
```

Then rerun the mechanical suite, regenerate census after any bank write, update the promotion ledger, and commit from the gate seat.
