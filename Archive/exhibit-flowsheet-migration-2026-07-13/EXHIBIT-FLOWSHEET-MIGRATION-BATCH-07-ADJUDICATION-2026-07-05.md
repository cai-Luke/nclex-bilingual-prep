# Exhibit Flowsheet Migration Batch 07 Adjudication Queue

Date: 2026-07-05
Bucket: `prose_embedded`
Manifest slice: `prose_embedded` panels 101-120 from `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-07-prose_embedded-2026-07-05.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-07-prose_embedded-2026-07-05.json
```

Result:

- 20 records
- 0 FAIL
- 2 WARN

WARN classes:

- Prose-normalization candidates:
  - HR values written as `/min` but staged as `bpm` in `stage_3_deterioration` and
    `stage_1_assessment`.

## Sampling

Sampling mode: tapered `prose_embedded` batch.

Seed: `batch07-prose_embedded-2026-07-05`

25% seeded random sample:

- 110 `gpt_r1_regen_case_celiac_01/stage3_update`
- 111 `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/initial_ed_record`
- 117 `opus_case_warfarin_bridge_01/exh_stage2`
- 118 `opus_case_warfarin_bridge_01/exh_stage3`
- 119 `opus_scc_case_01/exh_stage1`

Always-sampled additions:

- 106 `gpt_pph_2026_06_16_case_01/ex_background` — `excludedValues` admission BP/Hgb/Hct.
- 107 `gpt_pph_2026_06_16_case_01/ex_baseline_labs` — noncanonical CBC `/µL` source unit.
- 109 `gpt_pph_2026_06_16_case_01/stage_1_update` — `post_intervention` context.
- 111 `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/initial_ed_record` —
  `excludedValues` prior INR.
- 112 `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/stage_2_thrombectomy_preparation`
  — `post_intervention` context.

Total checker-seat sample: 9 of 20 records.

## Sample Surface

| # | exhibitRef | Extractor disposition | Gate | Review note |
|---:|---|---|---|---|
| 106 | `gpt_pph_2026_06_16_case_01/ex_background` | Empty panel; excluded admission BP/Hgb/Hct as prior baseline | OK | Always-sampled due to admission-vs-current PPH baseline judgment. |
| 107 | `gpt_pph_2026_06_16_case_01/ex_baseline_labs` | Keyed baseline CBC/coags/electrolytes/Cr/glucose | OK | Always-sampled due to platelet `/µL`; fibrinogen and UA protein out of allowlist scope. |
| 109 | `gpt_pph_2026_06_16_case_01/stage_1_update` | Keyed post-intervention HR/BP/RR/SpO2 | OK | Always-sampled due to `post_intervention` context after fundal massage/catheter/fluids. |
| 110 | `gpt_r1_regen_case_celiac_01/stage3_update` | Keyed Hgb and total calcium | OK | Random sample; bone-health labs outside allowlist omitted. |
| 111 | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/initial_ed_record` | Empty panel; excluded INR from five days ago | OK | Random + always-sampled due to prior INR. |
| 112 | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/stage_2_thrombectomy_preparation` | Keyed post-nicardipine BP 168/94 | OK | Always-sampled due to `post_intervention`; protocol threshold not keyed as a patient value. |
| 117 | `opus_case_warfarin_bridge_01/exh_stage2` | Keyed INR 1.9 | OK | Random sample; outpatient timing and medication doses out of allowlist scope. |
| 118 | `opus_case_warfarin_bridge_01/exh_stage3` | Keyed final discharge vitals | OK | Random sample; anticoagulation appointment has no lab value. |
| 119 | `opus_scc_case_01/exh_stage1` | Keyed reassessment vitals | OK | Random sample; bladder scan and neuro grades out of allowlist scope. |

## Status

Codex staged the values-only artifact and deterministic gate result. Independent checker-seat
adjudication (Claude Code) of the 9-record tapered sample is complete.

Re-ran the gate against current `main`: 20 records, 0 FAIL, 2 WARN — matches the result recorded
above.

For each of the 9 sampled records, pulled the full case content from `banks/hard-cases-canonical.json`
/ `banks/claude-canonical.json` and independently re-derived the correct disposition:

- `#106 ex_background` (PPH case): the excluded admission BP (148/94, superseded by the acute
  hemorrhage vitals in the sibling `ex_initial_assessment`) and admission Hgb/Hct (11.8/35.2,
  restated from the dedicated `ex_baseline_labs` exhibit) are both defensible — consistent with the
  same background-exhibit-defers-to-dedicated-exhibit pattern seen in earlier batches (e.g. the CDI
  case's `exhibit_background`).
- `#112 stage_2_thrombectomy_preparation`: correctly keys only the actual reading ("BP is 168/94
  mmHg") and correctly leaves the institutional protocol threshold ("≤185/110 mmHg") unkeyed — a
  clean Rule B application (protocol thresholds are not patient values).
- `#117 exh_stage2` (warfarin bridge case): flagging as a **non-blocking observation, not a
  selection error** — INR 1.9 is independently keyed as current in both `exh_stage1` (first mention)
  and `exh_stage2` (restated in the same provider conversation), while the case's `exh_1` (the actual
  3-timepoint INR trend) is correctly out of the pipeline entirely as `serial`. Unlike `#106`, there's
  no dedicated exhibit here absorbing the value, so both narrative exhibits key it. No rule is
  violated (no explicit rule governs cross-exhibit deduplication of the same real-world reading) and
  no false value is shown, but if these staged records are ever merged into one rendered flowsheet,
  the same numeric point would appear twice. Worth flagging for whoever does the eventual
  supplement-vs-replace rendering pass; does not block this batch.
- All other sampled records (`#107`, `#109`, `#110`, `#111`, `#118`, `#119`) match source verbatim
  with correct current/prior/context handling and correct out-of-scope silence.

**No selection errors found.** This is the seventh `prose_embedded` batch; sampling stays tapered.
