# Exhibit Flowsheet Migration Batch 09 Adjudication Queue

Date: 2026-07-05
Bucket: `prose_embedded`
Manifest slice: `prose_embedded` panels 141-145 from `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-09-prose_embedded-2026-07-05.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-09-prose_embedded-2026-07-05.json
```

Result:

- 5 records
- 0 FAIL
- 5 WARN

WARN classes:

- No-value / name-collision advisory mentions:
  - `background`: sodium chloride IV order and capillary glucose monitoring order only; no serum
    sodium/chloride or numeric glucose value.
- Prose-normalization candidates:
  - HR values written as `/min` but staged as `bpm` in `stage_2_note` and `stage_3_note`.

## Sampling

Sampling mode: tapered final partial `prose_embedded` batch.

Seed: `batch09-prose_embedded-2026-07-05`

25% seeded random sample, rounded up for the 5-record closing batch:

- 141 `opus4_case_postop_sbar_01/stage3_interventions`
- 142 `opus5_case_consent_interpreter_01/background`

Always-sampled additions:

- 141 `opus4_case_postop_sbar_01/stage3_interventions` — `post_intervention` context.
- 143 `opus5_case_consent_interpreter_01/preop_labs` — noncanonical CBC `/µL` source units.

Total checker-seat sample: 3 of 5 records.

## Sample Surface

| # | exhibitRef | Extractor disposition | Gate | Review note |
|---:|---|---|---|---|
| 141 | `opus4_case_postop_sbar_01/stage3_interventions` | Keyed post-intervention pre-transport vitals | OK | Random + always-sampled due to chain-of-command/intervention context. |
| 142 | `opus5_case_consent_interpreter_01/background` | Empty panel | WARN | Random sample; sodium chloride and glucose-monitoring orders have no lab value. |
| 143 | `opus5_case_consent_interpreter_01/preop_labs` | Keyed previous-day preop CBC/coags/BUN/Cr/K/glucose | OK | Always-sampled due to `/µL`; HbA1c out of allowlist scope. |

## Status

Codex staged the values-only artifact and deterministic gate result. Independent checker-seat
adjudication (Claude Code) of the 3-record tapered sample is complete.

Re-ran the gate against current `main`: 5 records, 0 FAIL, 5 WARN — matches the result recorded
above.

For each of the 3 sampled records, pulled the full case content from `banks/hard-cases-canonical.json`
and independently re-derived the correct disposition:

- `#141 stage3_interventions`: pre-transport vitals correctly keyed current with `post_intervention`
  context ("after oxygen was applied"); Foley output correctly out of scope.
- `#142 background`: correctly empty — "sodium chloride" (IV fluid name) and "capillary blood glucose
  every 4 hours" (monitoring-frequency order) are name-collision GATE 2 advisories, not actual serum
  sodium/chloride/glucose values.
- `#143 preop_labs`: "Labs drawn the previous day" correctly kept current, not excluded as prior —
  there is no more-recent contradicting value anywhere in this case for these analytes; "the previous
  day" describes standard preop draw timing, not a superseded reading (same reasoning as the
  `outpatient hemoglobin 6.4` case validated in batch 6). HbA1c correctly out of scope.

**No selection errors found.** This is the final `prose_embedded` batch — all 145 `prose_embedded`
panels (batches 02-09, plus the 2-panel `clean_kv` proof batch) are now staged and adjudicated with
**zero selection errors across the entire bucket**. Remaining work is the `scattered` bucket (160
panels, the hardest, not yet started).
