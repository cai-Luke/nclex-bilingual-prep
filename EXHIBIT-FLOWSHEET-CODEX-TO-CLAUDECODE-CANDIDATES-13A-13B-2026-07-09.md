# Exhibit Flowsheet Structured Promotion Candidates 13A + 13B - Codex to Claude Code

Date: 2026-07-09
Producer: Codex
Promotion gate: Claude Code

## Scope

Candidate artifacts:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13A-2026-07-09.json`
- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13B-2026-07-09.json`

Source artifact:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-13-scattered-2026-07-05.json`

No canonical bank write was performed by Codex.

## Selected Refs

Candidate 13A:

- `gpt_case_major_burn_inhalation_fluid_creep_01/baseline_labs`
- `gpt_case_opioid_recovery_relapse_risk_01/baseline_assessment_labs`
- `gpt_case_opus23_nat_toddler_01/initial_assessment_labs`
- `gpt_case_overdue_preventive_screening_01/baseline_assessment`
- `gpt_case_overdue_preventive_screening_01/stage_3_followup`

Candidate 13B:

- `gpt_case_nine_month_well_child_safety_01/baseline_record`
- `gpt_case_nurse_provider_conflict_01/stage_2_escalation`
- `gpt_case_refeeding_syndrome_tpn_01/baseline_record`
- `gpt_case_refeeding_syndrome_tpn_01/stage_2_update`
- `gpt_case_refeeding_syndrome_tpn_01/stage_3_update`

## Routing

- Candidate 13A routes four refs to `banks/gpt-canonical.json` and one ref to `banks/hard-cases-canonical.json`.
- Candidate 13B routes all five refs to `banks/gpt-canonical.json`.

## Gate Shape

- Candidate 13A: `0 FAIL / 0 WARN`.
- Candidate 13B: `0 FAIL / 4 WARN`.
- Candidate 13B WARNs are disclosed review surfaces:
  - one HR `/min` to `bpm` prose-normalization WARN in the nine-month well-child baseline;
  - one potassium order/action text advisory in the nurse-provider conflict escalation;
  - two sodium phosphate order-name advisories in refeeding syndrome stage 2/stage 3.

## Selection Notes

- Codex deliberately skipped Batch 13 rows with mixed-clock panel labels or newly noisy unitless-chemistry surfaces after the comparator/inferred-unit patch. Those can be revisited in a later targeted pass.
- `major_burn_inhalation_fluid_creep_01/baseline_labs` includes the Batch 13 adjudication fix: PaO2 68 mmHg is keyed with the ABG panel.
- `refeeding_syndrome_tpn_01/baseline_record` includes 16 `excludedValues` from PACU/prior labs; promotion review should verify they do not appear in canonical `structuredMeasurements`.
- `stage_2_update` and `stage_3_update` in the refeeding case carry `post_intervention` on all selected values.
- No selected ref contains SaO2, Troponin I, comparator values, or `unitAliases`.
- All selected refs should remain supplement-only with prose preserved.

## Timestamp Sanity

Column-label sanity pass:

- Candidate 13A labels: `0645`, `Current`, `Current`, `Current`, `Current`.
- Candidate 13B labels: `Current`, `Current`, `Current`, `Current`, `Current`.
- No selected ref has a competing clock/military body-text decoy timestamp for the values being promoted.
- The burn ref's `0645` label comes from the exhibit title: `Baseline laboratory data at 0645`.

## Gate Output

Candidate 13A:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13A-2026-07-09.json --bank banks/gpt-canonical.json --bank banks/hard-cases-canonical.json
```

Result:

```text
EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13A-2026-07-09.json: 5 records, 0 FAIL, 0 WARN
```

Candidate 13B:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13B-2026-07-09.json --bank banks/gpt-canonical.json --bank banks/hard-cases-canonical.json
```

Result:

```text
EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13B-2026-07-09.json: 5 records, 0 FAIL, 4 WARN
```

## Applicator Dry-Runs

Candidate 13A:

```sh
npm run structured-measurements:apply -- --refs gpt_case_major_burn_inhalation_fluid_creep_01/baseline_labs,gpt_case_opioid_recovery_relapse_risk_01/baseline_assessment_labs,gpt_case_opus23_nat_toddler_01/initial_assessment_labs,gpt_case_overdue_preventive_screening_01/baseline_assessment,gpt_case_overdue_preventive_screening_01/stage_3_followup EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13A-2026-07-09.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: gpt-canonical.json (4 exhibit refs), hard-cases-canonical.json (1 exhibit refs)
```

Candidate 13B:

```sh
npm run structured-measurements:apply -- --refs gpt_case_nine_month_well_child_safety_01/baseline_record,gpt_case_nurse_provider_conflict_01/stage_2_escalation,gpt_case_refeeding_syndrome_tpn_01/baseline_record,gpt_case_refeeding_syndrome_tpn_01/stage_2_update,gpt_case_refeeding_syndrome_tpn_01/stage_3_update EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13B-2026-07-09.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: gpt-canonical.json (5 exhibit refs)
```

## Mechanical Suite

Codex ran:

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

After content review, Claude Code can apply Candidate 13A with:

```sh
npm run structured-measurements:apply -- --write --refs gpt_case_major_burn_inhalation_fluid_creep_01/baseline_labs,gpt_case_opioid_recovery_relapse_risk_01/baseline_assessment_labs,gpt_case_opus23_nat_toddler_01/initial_assessment_labs,gpt_case_overdue_preventive_screening_01/baseline_assessment,gpt_case_overdue_preventive_screening_01/stage_3_followup EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13A-2026-07-09.json
```

After content review, Claude Code can apply Candidate 13B with:

```sh
npm run structured-measurements:apply -- --write --refs gpt_case_nine_month_well_child_safety_01/baseline_record,gpt_case_nurse_provider_conflict_01/stage_2_escalation,gpt_case_refeeding_syndrome_tpn_01/baseline_record,gpt_case_refeeding_syndrome_tpn_01/stage_2_update,gpt_case_refeeding_syndrome_tpn_01/stage_3_update EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13B-2026-07-09.json
```

Then rerun the mechanical suite, regenerate census after any bank write, update the promotion ledger, and commit from the gate seat.
