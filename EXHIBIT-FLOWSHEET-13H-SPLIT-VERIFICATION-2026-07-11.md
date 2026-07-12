# Exhibit Flowsheet 13H Split Verification

Date: 2026-07-11
Producer: Codex
Status: staged review candidates only; no canonical bank write

## Successor artifacts

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13H-PEDS-2026-07-11.json`
- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13H-SCREENING-2026-07-11.json`
- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13H-REFEEDING-FOLLOWUP-2026-07-11.json`
- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13H-REFEEDING-BASELINE-HOLD-2026-07-11.json`

The original seven-record
`EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13H-HOLD-2026-07-10.json` was superseded and deleted
after the architect independently verified the split. The four successors cover all seven original
exhibit refs exactly once. Independent whitelist comparison found only the owner-ruled transformations:

- toddler: add `population: "peds_child"`;
- nine-month infant: add `population: "peds_infant"`;
- screening baseline: remove only glucose `118` from the staged panel;
- screening follow-up: remove only glucose `104` from the staged panel;
- both refeeding follow-ups and the refeeding baseline hold: byte-identical to the current source artifact.

Because the first four transformations intentionally change records, the transformed successors cannot
also recompose the source byte-for-byte. The architect corrected the operative deletion criterion to
exact seven-ref coverage plus edits traced to named rulings, verified both conditions, repointed
`DECISIONS.md`, and authorized deletion. The four successors are now the sole live 13H artifacts.

## Comparator prerequisite

The full staged-and-held extension is recorded in
`EXHIBIT-FLOWSHEET-COMPARATOR-SWEEP-2026-07-09.md`: 23 files, 377 records, 2,054 panel/excluded values,
zero comparator-bearing `value` hits, and zero records needing a new `bound`. The one existing Batch 12
bound is already correctly encoded.

## 13H-PEDS

Gate: **0 FAIL / 1 WARN**. Applicator dry-run: **PASS**, two selected refs in
`banks/gpt-canonical.json` as supplements; no write.

| Exhibit ref | Rule | Finding | Adjudication |
|---|---|---|---|
| `gpt_case_nine_month_well_child_safety_01/baseline_record` | Source-unit normalization | Source writes HR `128/min`; staged accepted unit is `bpm` | Accepted source-unit normalization |

`gpt_case_opus23_nat_toddler_01/initial_assessment_labs` gates `OK`. Population was authored from
case-wide bilingual source: the toddler case states a 22-month-old boy; the infant case states age nine
months. Neither value was inferred from an exhibit id.

Commands:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13H-PEDS-2026-07-11.json
npm run structured-measurements:apply -- --refs gpt_case_opus23_nat_toddler_01/initial_assessment_labs,gpt_case_nine_month_well_child_safety_01/baseline_record EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13H-PEDS-2026-07-11.json
```

## 13H-SCREENING

Gate: **0 FAIL / 4 WARN**. Applicator dry-run: **PASS**, two selected refs in
`banks/gpt-canonical.json` as supplements; no write.

| Exhibit ref | Rule | Finding | Adjudication |
|---|---|---|---|
| `gpt_case_overdue_preventive_screening_01/baseline_assessment` | Unscoped pediatric detector | Case-wide adult duration text (for example, about six years without care) matches the advisory age regex | Accepted unscoped pediatric-detector false positive; subject is explicitly 52 years old |
| `gpt_case_overdue_preventive_screening_01/baseline_assessment` | GATE 2 named-but-unkeyed | Non-fasting fingerstick glucose `118` remains in prose | Accepted owner-directed local omission; candidate is vitals-only |
| `gpt_case_overdue_preventive_screening_01/stage_3_followup` | Unscoped pediatric detector | Same case-wide adult duration context | Accepted unscoped pediatric-detector false positive; subject is explicitly 52 years old |
| `gpt_case_overdue_preventive_screening_01/stage_3_followup` | GATE 2 named-but-unkeyed | Fasting glucose `104` remains in prose | Accepted owner-directed local omission; candidate is vitals-only |

Commands:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13H-SCREENING-2026-07-11.json
npm run structured-measurements:apply -- --refs gpt_case_overdue_preventive_screening_01/baseline_assessment,gpt_case_overdue_preventive_screening_01/stage_3_followup EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13H-SCREENING-2026-07-11.json
```

## 13H-REFEEDING-FOLLOWUP

Gate: **0 FAIL / 4 WARN**. Applicator dry-run: **PASS**, two selected refs in
`banks/gpt-canonical.json` as supplements; no write.

| Exhibit ref | Rule | Finding | Adjudication |
|---|---|---|---|
| `gpt_case_refeeding_syndrome_tpn_01/stage_2_update` | Unscoped pediatric detector | Case-wide duration text such as weight loss over two months matches the advisory age regex | Accepted unscoped pediatric-detector false positive; subject is explicitly 62 years old |
| `gpt_case_refeeding_syndrome_tpn_01/stage_2_update` | GATE 2 named-but-unkeyed | `sodium` occurs in sodium phosphate order text, not as a serum result | Accepted GATE 2 protocol/medication-name collision |
| `gpt_case_refeeding_syndrome_tpn_01/stage_3_update` | Unscoped pediatric detector | Same case-wide adult duration context | Accepted unscoped pediatric-detector false positive; subject is explicitly 62 years old |
| `gpt_case_refeeding_syndrome_tpn_01/stage_3_update` | GATE 2 named-but-unkeyed | `sodium` occurs in sodium phosphate order text, not as a serum result | Accepted GATE 2 protocol/medication-name collision |

Both records preserve the ratified Rule F split: potassium, phosphate, magnesium, and glucose carry
`post_intervention`; creatinine and all six vitals are untagged.

Commands:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13H-REFEEDING-FOLLOWUP-2026-07-11.json
npm run structured-measurements:apply -- --refs gpt_case_refeeding_syndrome_tpn_01/stage_2_update,gpt_case_refeeding_syndrome_tpn_01/stage_3_update EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13H-REFEEDING-FOLLOWUP-2026-07-11.json
```

## Refeeding baseline hold

The baseline is not a promotion candidate and intentionally received no applicator dry-run. Its scoped
gate reports **0 FAIL / 16 WARN**: one accepted unscoped-pediatric false positive plus fifteen expected
GATE 2 unitless-numeric advisories for the PACU prior-context analytes now left in intact prose. The
staged record still contains current vitals/POC glucose and the single valid prior glucose `156`, but the
owner ruling forbids promotion of that current-only view. It remains the motivating example for a
deferred multi-column temporal-panel authoring lane.

## Verdict

All three actionable candidates have zero FAILs, no genuine extraction defects, and no unresolved
GATE 4 or calcium-identity findings. Every WARN is enumerated above. No canonical bank was changed.
