# Exhibit Flowsheet Migration Batch 04 Adjudication Queue

Date: 2026-07-05
Bucket: `prose_embedded`
Manifest slice: `prose_embedded` panels 41-60 from `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-04-prose_embedded-2026-07-05.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-04-prose_embedded-2026-07-05.json
```

Result:

- 20 records
- 0 FAIL
- 13 WARN

WARN classes:

- No-value / name-collision advisory mentions:
  - `adhf_labs`: `troponin not elevated` has no numeric troponin value.
  - `aki_response`: `45 mL/hr` urine-output prose trips the `hr` label pattern; no heart rate value.
  - `sepsis_response`: `Lactate pending` has no lactate value.
  - `baseline_client_snapshot`: `SpO2 93-94%` is a range rather than a scalar value.
- Prose-normalization candidates:
  - HR values written as `/min` but staged as `bpm` in `adhf_triage`, `adrenal_initial`,
    `aki_deterioration`, `anticoag_initial`, `panc_initial`, `panc_response`,
    `sepsis_initial`, and `sepsis_response`.
- Serial-lane advisory:
  - `gpt_case_gbs_respiratory_compromise_01/stage1_0_12h_update` staged as `skip_serial`; mechanical
    detector does not re-confirm, but source prose repeats respiratory parameters across hour 8 and
    hour 12.

## Sampling

Sampling mode: tapered `prose_embedded` batch after two consecutive clean 100% batches.

Seed: `batch04-prose_embedded-2026-07-05`

25% seeded random sample:

- 41 `gpt_case_gap_2026_06_11_case_adhf_01/adhf_labs`
- 47 `gpt_case_gap_2026_06_11_case_aki_02/aki_labs`
- 53 `gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_response`
- 57 `gpt_case_gbs_respiratory_compromise_01/ex_initial_assessment`
- 60 `gpt_case_infection_control_clustered_care_01/stage_2_1130_status`

Always-sampled additions:

- 49 `gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_initial` — `excludedValues`
  baseline Hgb/platelets.
- 50 `gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_labs` — noncanonical CBC
  `/mm3` source unit.
- 52 `gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_labs` — noncanonical CBC `/mm3` source unit.
- 55 `gpt_case_gap_2026_06_11_case_urosepsis_05/sepsis_labs` — noncanonical CBC `/mm3` source unit
  and excluded baseline creatinine.
- 58 `gpt_case_gbs_respiratory_compromise_01/stage1_0_12h_update` — `skip_serial`.

Total checker-seat sample: 10 of 20 records.

## Sample Surface

| # | exhibitRef | Extractor disposition | Gate | Review note |
|---:|---|---|---|---|
| 41 | `gpt_case_gap_2026_06_11_case_adhf_01/adhf_labs` | Keyed BNP/Na/K/Cr; no troponin value keyed | WARN | Random sample. Troponin text is qualitative only. |
| 47 | `gpt_case_gap_2026_06_11_case_aki_02/aki_labs` | Keyed BUN/Cr/K/HCO3; excluded baseline Cr | OK | Random + always-sampled due to `excludedValues`. |
| 49 | `gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_initial` | Keyed current HR/BP/SpO2; excluded baseline platelets/Hgb | WARN | Always-sampled due to `excludedValues`; HR `/min` prose-normalization candidate. |
| 50 | `gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_labs` | Keyed aPTT/platelets/Hgb | OK | Always-sampled due to platelet `/mm3` source unit. |
| 52 | `gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_labs` | Keyed WBC/Hct/Ca/glucose/BUN | OK | Always-sampled due to WBC `/mm3` source unit; lipase out of allowlist scope. |
| 53 | `gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_response` | Keyed BP/HR/SpO2 | WARN | Random sample; HR `/min` prose-normalization candidate. |
| 55 | `gpt_case_gap_2026_06_11_case_urosepsis_05/sepsis_labs` | Keyed WBC/lactate/Cr; excluded baseline Cr | OK | Always-sampled due to WBC `/mm3` and `excludedValues`; urine WBC/hpf is not blood WBC. |
| 57 | `gpt_case_gbs_respiratory_compromise_01/ex_initial_assessment` | Keyed Temp/HR/BP/RR/SpO2 | OK | Random sample; neuro strength/reflex values out of allowlist scope. |
| 58 | `gpt_case_gbs_respiratory_compromise_01/stage1_0_12h_update` | `skip_serial` | WARN | Always-sampled due to `skip_serial`; source repeats FVC/MIP/RR/SpO2 across hour 8 and hour 12. |
| 60 | `gpt_case_infection_control_clustered_care_01/stage_2_1130_status` | Keyed Client A Temp/HR/BP/K/Cr | OK | Random sample; intake/output and other clients' non-allowlist/status prose omitted. |

## Status

Codex staged the values-only artifact and deterministic gate result. Independent checker-seat
adjudication (Claude Code) of the 10-record tapered sample is complete.

Re-ran the gate against current `main`: 20 records, 0 FAIL, 13 WARN — matches the result recorded
above.

For each of the 10 sampled records, pulled the full case content from `banks/gpt-canonical.json` /
`banks/hard-cases-canonical.json` and independently re-derived the correct disposition:

- `#47 aki_labs` and `#49 anticoag_initial`: the excluded prior values (`creatinine 0.9` explicitly
  parenthetical "(baseline 0.9)"; `platelets 226,000` / `hemoglobin 13.2` explicitly "Baseline ...
  was") are genuine current-vs-prior splits, correctly excluded rather than keyed.
- `#55 sepsis_labs`: the extractor correctly did **not** key urinalysis `>50 WBC/hpf` as a second
  `wbc` value — that is urine microscopy per high-power field, a different quantity from the blood
  CBC `WBC 22,400/mm3` in the same sentence, not a duplicate/trend of it. Confirmed against source;
  this is a real distinction the extractor got right, not an omission.
- `#41 adhf_labs`, `#52 panc_labs`: all "out of allowlist scope" claims (troponin qualitative-only,
  weight, lipase) check out against `ANALYTE_DEFS`/`VITAL_DEFS` — none of these keys exist in the
  registry.
- `#50 anticoag_labs`, `#53 panc_response`, `#57 ex_initial_assessment`, `#60
  stage_2_1130_status`: all keyed values match source verbatim; non-allowlisted qualitative content
  (anti-Xa level, pain score, neuro strength/reflex grades, other clients' non-vital status prose)
  is correctly silent rather than force-keyed.
- `#58 stage1_0_12h_update` (`skip_serial`): correct disposition on independent read — the source
  repeats FVC/MIP/RR/SpO2 across "hour 4/8/12." The gate's "did not re-confirm ≥2 timepoints" WARN is
  a genuine mechanical-detector gap (its `TIMESTAMP` pattern doesn't recognize relative-hour
  phrasing), not a flag against the extractor's call — filed as
  `EXHIBIT-FLOWSHEET-CODEX-NOTE-serial-timestamp-gap-2026-07-05.md` for Codex, non-blocking.

**No selection errors found.** Sampling stays tapered at 25% + always-sampled for future
`prose_embedded` batches.
