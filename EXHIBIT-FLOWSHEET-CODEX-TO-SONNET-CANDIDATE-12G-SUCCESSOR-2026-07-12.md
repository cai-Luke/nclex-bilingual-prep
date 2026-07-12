# Candidate 12G Successor — Independent Sonnet Review Handoff

Date: 2026-07-12
Status: staged only; no canonical write
Producer seat: Codex
Required checker seat: independent Claude/Sonnet

## Scope and lineage

Review only these two refs in `banks/hard-cases-canonical.json`:

- `gpt_case_gallstone_pancreatitis_01/stage_2_update`
- `gpt_case_gallstone_pancreatitis_01/stage_3_update`

The staged successor is
`EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12G-GALLSTONE-SUCCESSOR-2026-07-12.json`.
Its source lineage is Batch 12
`EXHIBIT-FLOWSHEET-MIGRATION-BATCH-12-scattered-2026-07-05.json`, through the superseded hold
`EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12G-GALLSTONE-HOLD-2026-07-09.json`.
The machine-produced field comparison is
`EXHIBIT-FLOWSHEET-12G-SUCCESSOR-COMPARISON-2026-07-12.json`.

The predecessor is provenance and comparison evidence only. Re-derive every keyed measurement and
Rule F disposition from current canonical prose.

## Calcium disposition

Both total-calcium and ionized-calcium readings remain visible in intact learner-facing prose. They
are intentionally unkeyed, absent from `excludedValues`, and have no inferred unit. This applies to
Stage 2 (`calcium 7.9`, `ionized calcium 4.0`) and Stage 3 (`calcium 8.4`, `ionized calcium 4.4`).
The four resulting GATE 2 unitless-subclass WARNs are expected and must remain visible.

## Rule F disposition, measurement by measurement

`Tag` means `context: "post_intervention"`; `No tag` means the field is absent.

| Ref | Measurement(s) | Disposition | Directed intervention and temporal evidence |
|---|---|---|---|
| Stage 2 | `temp` | No tag | The fever is measured after LR, but LR is not directed at temperature/infection. |
| Stage 2 | `hr`, `sbp`, `dbp` | Tag | Goal-directed LR for hypovolemia precedes the hour-16 hemodynamic reassessment. |
| Stage 2 | `rr`, `spo2` | No tag | The reading is co-located with “on 2 L NC”; the source does not establish oxygen initiation before this reading. |
| Stage 2 | `wbc` | No tag | Cultures, GI consultation, and planned ERCP follow the hour-18 labs; no prior infection-directed intervention is established. |
| Stage 2 | `hematocrit`, `bun`, `creatinine`, `lactate` | Tag | These volume/perfusion or renal-perfusion measurements follow 12 hours of goal-directed LR. |
| Stage 2 | `glucose` | No tag | Sliding-scale insulin is initiated after the hour-18 glucose result. |
| Stage 3 | `temp`, `wbc` | Tag | Hour-28 ERCP source control for evolving cholangitis precedes the hour-40/42 infection-domain reassessment. |
| Stage 3 | `hr`, `sbp`, `dbp`, `hematocrit`, `lactate` | Tag | Earlier goal-directed LR for hypovolemia/perfusion precedes these later perfusion/volume reassessments. |
| Stage 3 | `rr`, `spo2` | Tag | Stage 2 respiratory support on 2 L NC precedes the Stage 3 room-air respiratory reassessment. |
| Stage 3 | `total_bilirubin`, `ast`, `alt` | Tag | ERCP stone extraction and biliary decompression precede the biliary-domain laboratory reassessment. |
| Stage 3 | `glucose` | Tag | Sliding-scale insulin initiation precedes the hour-42 glucose reassessment. |

The checker must adjudicate every row independently. Any disputed tag blocks promotion.

## Current gate WARN inventory

The current scoped gate reports `0 FAIL / 7 WARN`:

| Ref | Rule/gate | Adjudication |
|---|---|---|
| Stage 2 | R9 unscoped pediatric marker | False positive from case-wide history text: “cholelithiasis diagnosed 2 years ago”; the client is explicitly 45. |
| Stage 2 | Rule C inferred-unit advisory, `bun=18` | Source omits a unit. `mg/dL` is the standing US-reporting inference, but the gate correctly warns because `mmol/L` is also accepted. |
| Stage 2 | GATE 2 unitless subclass, `ionized_calcium=4.0` | Expected; remains prose-only with no inferred unit. |
| Stage 2 | GATE 2 unitless subclass, `calcium=7.9` | Expected; remains prose-only with no inferred unit. |
| Stage 3 | R9 unscoped pediatric marker | Same false-positive case-wide “2 years ago” history; client is 45. |
| Stage 3 | GATE 2 unitless subclass, `ionized_calcium=4.4` | Expected; remains prose-only with no inferred unit. |
| Stage 3 | GATE 2 unitless subclass, `calcium=8.4` | Expected; remains prose-only with no inferred unit. |

## Commands and producer-seat results

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12G-GALLSTONE-SUCCESSOR-2026-07-12.json
npm run structured-measurements:apply -- --refs gpt_case_gallstone_pancreatitis_01/stage_2_update,gpt_case_gallstone_pancreatitis_01/stage_3_update EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12G-GALLSTONE-SUCCESSOR-2026-07-12.json
```

Gate: `2 records, 0 FAIL, 7 WARN`.

Applicator: dry-run validated both selected supplement records and identified only
`hard-cases-canonical.json`; no `--write` was used.

## Requested independent verdict

Return PASS or BLOCK after independently checking source-value completeness, analyte identity,
unit treatment, all seven WARNs, and every Rule F row. Do not treat agreement with this handoff as
evidence. No canonical bank, census, or migration-ledger write is authorized in this review.
