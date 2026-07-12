# Exhibit Flowsheet Candidate 14A — Claude/Sonnet Gate Handoff

Date: 2026-07-11
Producer seat: Codex
Requested checker seat: independent Claude/Sonnet
Status: staged review candidate only; no canonical bank write

## Live-main reconciliation

This handoff was prepared from local `main` at `f3566b5`, which is five commits ahead of
`origin/main` (`7360746`, merged PR #23). The five local commits are existing promotion work, not
part of Candidate 14A authoring:

- `dd825d2`: Candidates 12A/12B promoted (6 refs).
- `4255d84`: Candidates 13A/13B promoted (3 refs).
- `5d82581`: actionable 13H successors promoted (6 refs).
- `2302c3a`: TLS hold promoted (2 refs); gallstone remains held.
- `f3566b5`: promotion-sweep history closeout.

Canonical JSON inspection confirms all 17 refs above carry `structuredMeasurements`. The only live
12/13-family unpromoted holds are:

- `gpt_case_gallstone_pancreatitis_01/stage_2_update`
- `gpt_case_gallstone_pancreatitis_01/stage_3_update`
- `gpt_case_refeeding_syndrome_tpn_01/baseline_record`

Failed Batch 19 is excluded entirely. Batch 20 is the authoritative serial redo. Already promoted
candidate files, the deleted/superseded original 13H hold, `skip_serial` records, empty-panel
records, and held/non-actionable records were excluded from Candidate 14A inputs.

One current-authority drift remains outside this staging patch: `NCLEX-Question-Schema.md` still
labels `1.9` as current and documents the pre-2.0 comparator limitation, while merged runtime code
and `DECISIONS.md` enforce Schema 2.0 (`bound`, `population`, pediatric detection, and current Rule F
semantics). Candidate 14A follows the runtime/decision contract and introduces no 2.0-only field.

## Candidate 14A scope

Source: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-14-scattered-2026-07-06.json`

Staged artifact:
`EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-14A-2026-07-11.json`

Selected refs:

1. `gpt_case_taco_vs_trali_01/baseline_assessment_labs`
2. `gpt_case_warfarin_mvr_2026_06_11_01/initial_assessment_labs`
3. `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/ongoing_plan`
4. `gpt_opus21_case_colostomy_lep_discharge_01/stage3_discharge_teachback`

All four are non-empty `extract` records, remain unpromoted in canonical JSON, route to
`banks/gpt-canonical.json`, and were selected as complete JSON objects from Batch 14 by a
parse/filter/serialize transform. Their parsed values and structure are unchanged; no record was
retyped or semantically edited.

This is the smallest low-noise Batch 14 slice that avoids:

- the newly hard-failing `prior_no_current` warfarin admission record;
- `skip_serial` and empty-panel/non-rendered dispositions;
- mixed-timestamp records where the current applicator's single-column label heuristic could attach
  the wrong time to one panel; and
- already held or superseded inputs.

## Current gate result and complete WARN inventory

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-14A-2026-07-11.json --bank banks/gpt-canonical.json banks/hard-cases-canonical.json
```

Result: **4 records, 0 FAIL, 2 WARN**.

| Ref | Rule | WARN | Producer disposition for checker re-derivation |
|---|---|---|---|
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/ongoing_plan` | R9 pediatric detector (unscoped advisory) | Unscoped pediatric age/noun marker | False-positive relationship noun: the source says “The adult child asks”; the client is explicitly age 72 in `baseline_order`. `population` correctly remains absent. |
| `gpt_opus21_case_colostomy_lep_discharge_01/stage3_discharge_teachback` | GATE 2 advisory completeness | `glucose` mentioned but neither keyed nor excluded | The only numeric glucose text is the PCP target fasting range `70-130 mg/dL`, not a patient result. It remains intact prose and is correctly neither keyed nor excluded. |

There are no Rule F tags in the first two records. In `ongoing_plan`, RR and SpO2 remain tagged
`post_intervention`: both are reassessments after stimulation and oxygen, satisfying the
directed-domain plus temporal-linkage Rule F test. The colostomy discharge record has no Rule F tags.

## Applicator dry-run

Command:

```sh
npm run structured-measurements:apply -- --refs gpt_case_taco_vs_trali_01/baseline_assessment_labs,gpt_case_warfarin_mvr_2026_06_11_01/initial_assessment_labs,gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/ongoing_plan,gpt_opus21_case_colostomy_lep_discharge_01/stage3_discharge_teachback EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-14A-2026-07-11.json
```

Result: **dry-run validated 4 selected records; `gpt-canonical.json` would be the only touched bank.**

No `--write` command was run. Canonical banks, census artifacts, and review-ledger content counts
are unchanged by Candidate 14A staging.

## Independent checker request

Please re-derive each record from current canonical source prose and current runtime gate semantics,
with special attention to:

- the two WARN dispositions above;
- Rule F scope on `ongoing_plan` (RR/SpO2 only);
- the warfarin prior hemoglobin exclusion (`12.8` prior vs `11.4` current); and
- inferred applicator column labels (`Current`, `0900`, `1015`, `1445`) against source titles/text.

If accepted, promotion remains a separate `--write` pass followed by the bank-content verification
suite and a canonical-promotion ledger entry.
