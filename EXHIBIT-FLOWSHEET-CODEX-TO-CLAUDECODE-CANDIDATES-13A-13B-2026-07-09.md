# Exhibit Flowsheet Candidates 13A + 13B Patch - Codex to Claude Code

Date: 2026-07-10
Producer: Codex
Promotion gate: Claude Code

## Status

Claude's review found real blockers in the original 13A/13B candidate set. The original promotion framing is superseded.

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13A-2026-07-09.json` now contains only the two accepted 13A records.
- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13B-2026-07-09.json` now contains only the one accepted 13B record.
- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13H-HOLD-2026-07-10.json` contains the seven held/flagged records for provenance and later rework.
- No canonical bank write was performed by Codex.

The three accepted refs are preserved, but this is intentionally a small accepted subset rather than a promotion-ready batch.

## Accepted Subset

Candidate 13A:

- `gpt_case_major_burn_inhalation_fluid_creep_01/baseline_labs`
- `gpt_case_opioid_recovery_relapse_risk_01/baseline_assessment_labs`

Candidate 13B:

- `gpt_case_nurse_provider_conflict_01/stage_2_escalation`

Expected routing if the gate seat later chooses to write the accepted subset:

- `gpt_case_major_burn_inhalation_fluid_creep_01/baseline_labs` routes to `banks/hard-cases-canonical.json`.
- `gpt_case_opioid_recovery_relapse_risk_01/baseline_assessment_labs` and `gpt_case_nurse_provider_conflict_01/stage_2_escalation` route to `banks/gpt-canonical.json`.

## Held Refs

Pediatric hold pending explicit population review:

- `gpt_case_opus23_nat_toddler_01/initial_assessment_labs`
- `gpt_case_nine_month_well_child_safety_01/baseline_record`

Refeeding hold pending baseline re-extraction and post-intervention ruling:

- `gpt_case_refeeding_syndrome_tpn_01/baseline_record`
- `gpt_case_refeeding_syndrome_tpn_01/stage_2_update`
- `gpt_case_refeeding_syndrome_tpn_01/stage_3_update`

Reference-range / thin-panel hold:

- `gpt_case_overdue_preventive_screening_01/baseline_assessment`
- `gpt_case_overdue_preventive_screening_01/stage_3_followup`

## Code Patches Landed With This Restage

- Added optional `structuredMeasurements.population?: "adult" | "peds_child" | "peds_infant"` with strict schema and unknown-key support. The deterministic applicator passes this through when a staged record supplies it.
- Added a flowsheet-gate hard FAIL for `excludedValues[].reason === "prior"` when the same label has no current panel value in the same record. This catches the refeeding baseline defect where a whole baseline panel was hidden as `prior` exclusions.
- Fixed structured measurement display so primary-unit values preserve significant trailing zeros, e.g. creatinine `1.0 mg/dL` and INR `1.0`.
- Suppressed placeholder display units for `(unitless)` and `(ratio)`, e.g. pH renders `7.32` and INR renders `1.0`.
- Re-pinned CBC display suppression so identical-scale SI parentheses stay hidden, e.g. `14,200/uL` renders `14.2 ×10³/µL`, not `14.2 ×10³/µL (14.2 ×10⁹/L)`.

## Suggested Gate Commands

Accepted subset only:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13A-2026-07-09.json --bank banks/gpt-canonical.json --bank banks/hard-cases-canonical.json
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13B-2026-07-09.json --bank banks/gpt-canonical.json --bank banks/hard-cases-canonical.json
```

The hold artifact is not promotion-ready. Running the gate over it is expected to surface review findings, including the new `prior` hard FAIL on the refeeding baseline until that case is re-extracted.

## Mechanical Suite

Codex reran the relevant mechanical suite after patching:

```sh
npm run test:structured-measurements
npm run test:schema-bank
npm run test:flowsheet-gate
npm run validate-bank -- banks/*.json
npm run scan-unknown-keys
npm run census:check
npm run build
```

See the commit message for final pass/fail status.
