# Exhibit Flowsheet Candidates 13A + 13B Patch - Codex to Claude Code

Date: 2026-07-10
Producer: Codex
Promotion gate: Claude Code

## Status

Claude's review found real blockers in the original 13A/13B candidate set. The original promotion framing is superseded.

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13A-2026-07-09.json` now contains only the two accepted 13A records.
- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13B-2026-07-09.json` now contains only the one accepted 13B record.
- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13H-HOLD-2026-07-10.json` is superseded as an
  actionable promotion unit. It is retained temporarily as the immutable seven-record split source.
- The seven refs now live exactly once across three review candidates plus one baseline hold:
  `13H-PEDS`, `13H-SCREENING`, `13H-REFEEDING-FOLLOWUP`, and
  `13H-REFEEDING-BASELINE-HOLD` (all dated 2026-07-11).
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

## 2026-07-11 13H Successor Split

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13H-PEDS-2026-07-11.json` — two pediatric
  records with source-supported `peds_child` / `peds_infant` population declarations.
- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13H-SCREENING-2026-07-11.json` — two
  vitals-only screening records; the one-row glucose labs remain only in intact prose.
- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13H-REFEEDING-FOLLOWUP-2026-07-11.json` —
  Stage 2/3 follow-ups preserving the ratified measurement-level Rule F split.
- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13H-REFEEDING-BASELINE-HOLD-2026-07-11.json`
  — baseline remains held for a deferred multi-column temporal-panel authoring lane.

The required staged-and-held comparator sweep is complete with zero comparator-bearing staged
`value` hits and zero records needing a new `bound`. Exact separate gate totals, WARN adjudications,
applicator dry-runs, seven-ref coverage, and transformation-whitelist verification are recorded in
`EXHIBIT-FLOWSHEET-13H-SPLIT-VERIFICATION-2026-07-11.md`.

The original seven-record file has not been deleted: two population additions and two owner-directed
glucose-row omissions mean transformed successors cannot literally recompose it byte-for-byte. It is
non-actionable and retained only until the deletion-gate interpretation is confirmed. `DECISIONS.md`
remains architect-owned and needs its 13H pointer repointed to these four successors.

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

The original hold artifact is superseded and must not be promoted as one unit. Use the successor
commands and exact results in `EXHIBIT-FLOWSHEET-13H-SPLIT-VERIFICATION-2026-07-11.md`.

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
