# Exhibit Flowsheet Migration Batch 12 Adjudication Queue

Date: 2026-07-05
Bucket: `scattered`
Manifest slice: `scattered` panels 41-60 from `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-12-scattered-2026-07-05.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-12-scattered-2026-07-05.json
```

Result:

- 20 records
- 0 FAIL
- 36 WARN

WARN classes:

- Serial-lane advisory:
  - `gpt_case_clozapine_toxicity_01/baseline_record` is `skip_serial` for sitting/standing current BP
    readings.
  - `gpt_case_clozapine_toxicity_01/day10_update` is `skip_serial` for sitting/standing current BP
    readings.
  - `gpt_case_clozapine_toxicity_01/day18_assessment` is `skip_serial` for duplicate current HR
    information in the vitals and ECG-rate prose.
- Rule C / unit-source discipline:
  - `gpt_case_gallstone_pancreatitis_01/stage_2_update` and
    `gpt_case_gallstone_pancreatitis_01/stage_3_update` contain many lab values without explicit
    source units. Those labs are left in prose rather than assigning guessed conventional units.
- Same-name / different-analyte discipline:
  - Clozapine records report Troponin I; the registry key is `troponin_t`, so Troponin I is not keyed
    as Troponin T.
  - `gpt_case_gbs_respiratory_compromise_01/ex_diagnostics` keys only the serum glucose comparator;
    CSF glucose and CSF WBC are not keyed as serum glucose or blood WBC.
- Prose-normalization candidates:
  - HR values written as `/min` but staged as `bpm` in adrenal crisis, AKI, anticoagulation bleeding,
    pancreatitis, TLS, and urosepsis records.
- No-value / name-collision advisory mentions:
  - `gpt_case_gallstone_pancreatitis_01/stage_1_update`: calcium gluconate is a medication dose, not a
    serum calcium result.
  - `gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_response`: platelet decline is a
    qualitative trend reference, not a current platelet value.
  - `gpt_case_gbs_respiratory_compromise_01/ex_diagnostics`: CBC/BMP/magnesium/phosphorus/calcium are
    named as unremarkable panels without numeric values.

## Sampling

Sampling mode: `scattered` bucket ramp, second 100% batch.

Batch 11 adjudicated clean and counts as clean scattered batch 1 of 2. Batch 12 is therefore queued
for 100% independent checker-seat adjudication. If no selection errors or re-dispositions are found,
it becomes clean scattered batch 2 of 2 and future `scattered` batches may taper to 25% +
always-sampled.

Total checker-seat sample: 20 of 20 records.

## Sample Surface

| # | exhibitRef | Extractor disposition | Gate | Review note |
|---:|---|---|---|---|
| 1 | `gpt_case_clozapine_toxicity_01/baseline_record` | `skip_serial` | WARN | Sitting and standing current BP readings trigger Rule D. |
| 2 | `gpt_case_clozapine_toxicity_01/day10_update` | `skip_serial` | WARN | Sitting and standing current BP readings trigger Rule D. |
| 3 | `gpt_case_clozapine_toxicity_01/day18_assessment` | `skip_serial` | WARN | Current HR appears in vitals and ECG-rate prose; Troponin I is not mapped to Troponin T. |
| 4 | `gpt_case_clozapine_toxicity_01/four_hour_update` | Keyed repeat vitals | WARN | Values carry `post_intervention`; ANC/CRP out of scope, Troponin I not mapped to Troponin T. |
| 5 | `gpt_case_gallstone_pancreatitis_01/stage_1_update` | Empty panel | WARN | Calcium gluconate is a medication dose; sinus tachycardia has no numeric HR. |
| 6 | `gpt_case_gallstone_pancreatitis_01/stage_2_update` | Keyed hour-16 vitals only | WARN | Hour-18 labs lack explicit source units; urine output/lipase/CRP/imaging out of scope. |
| 7 | `gpt_case_gallstone_pancreatitis_01/stage_3_update` | Keyed hour-40 vitals only | WARN | Values carry `post_intervention`; hour-42 labs lack explicit source units. |
| 8 | `gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_deterioration` | Keyed BP/HR/glucose | WARN | HR `/min` prose-normalization candidate; PVCs have no allowlisted numeric key. |
| 9 | `gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_response` | Keyed response BP/HR/glucose/K/Na | WARN | Values carry `post_intervention`; HR `/min` candidate. |
| 10 | `gpt_case_gap_2026_06_11_case_aki_02/aki_initial` | Keyed admission temp/HR/BP | WARN | Urine output out of allowlist scope; HR `/min` candidate. |
| 11 | `gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_deterioration` | Keyed vitals/Hgb/platelets/aPTT | WARN | aPTT `>150 seconds` preserved with comparator; HR `/min` candidate. |
| 12 | `gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_response` | Keyed post-fluid BP/HR | WARN | Platelet decline is qualitative, not a current platelet result. |
| 13 | `gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_deterioration` | Keyed vitals/Hct/BUN/Ca | WARN | Urine output out of scope; HR `/min` candidate. |
| 14 | `gpt_case_gap_2026_06_11_case_tls_01/baseline_exhibit` | Keyed baseline vitals/labs | WARN | Uric acid and LDH out of scope; HR `/min` candidate. |
| 15 | `gpt_case_gap_2026_06_11_case_tls_01/stage1_exhibit` | Keyed new vitals/labs | WARN | Uric acid, LDH, urine output, ECG morphology out of scope; HR `/min` candidate. |
| 16 | `gpt_case_gap_2026_06_11_case_tls_01/stage3_exhibit` | Keyed post-treatment vitals/labs | WARN | Values carry `post_intervention`; uric acid and urine output out of scope. |
| 17 | `gpt_case_gap_2026_06_11_case_urosepsis_05/sepsis_deterioration` | Keyed post-fluid vitals/lactate | WARN | Values carry `post_intervention`; urine output out of scope; HR `/min` candidate. |
| 18 | `gpt_case_gbs_respiratory_compromise_01/ex_diagnostics` | Keyed serum glucose only | WARN | CSF glucose and CSF WBC are not serum glucose/blood WBC; unremarkable panels have no values. |
| 19 | `gpt_case_gbs_respiratory_compromise_01/stage2_12_24h_update` | `skip_serial` | OK | Hour 16/hour 20 repeated same-client vitals trigger Rule D. |
| 20 | `gpt_case_gbs_respiratory_compromise_01/stage3_icu_days2_5_update` | `skip_serial` | OK | ICU-day ranges and repeated day-5 vitals trigger Rule D. |

## Status

Codex staged the third `scattered` values-only artifact and deterministic gate result. Independent
checker-seat adjudication (Claude Code) of all 20 records is complete. **This batch does not qualify
as clean scattered batch 2 of 2** — one confirmed selection error and one fresh escalation surfaced.

Re-ran the gate against current `main`: 20 records, 0 FAIL, 36 WARN — matches the result recorded
above.

### Confirmed selection error: WBC/Hct omitted despite explicit source units

`gpt_case_gallstone_pancreatitis_01/stage_2_update` and `.../stage_3_update` both stage vitals-only
panels, per the review note reasoning "hour-X labs lack explicit source units." Checked against source:

- `stage_2_update`: "Hour 18 labs: **WBC 19,200/mcL, Hct 38%**, BUN 18, Cr 0.8, calcium 7.9, ionized
  calcium 4.0, lipase 2,640, glucose 220, lactate 2.6, CRP 285."
- `stage_3_update`: "Hour 42 labs: **WBC 11,800/mcL**, lipase 980, total bilirubin 1.8, AST 88, ALT 140,
  calcium 8.4, ionized calcium 4.4, glucose 148, CRP 190, lactate 1.2, **Hct 36%**."

The "no explicit units" rationale is correct for BUN/Cr/calcium/ionized_calcium/glucose/lactate/total_
bilirubin/AST/ALT in these two sentences (genuinely unitless in this abbreviated list, correctly left
in prose per Rule C) — but **WBC and Hct do carry explicit units in both sentences** (`/mcL`, `%`), the
same units this exact case already keys in `ex_admission_labs` ("WBC 14,500/mcL... Hct 48%"). The
gate's GATE 2 advisory independently flagged both ("source mentions 'wbc'"/"'hematocrit' but neither
keyed nor excluded") — the advisory did its job; the blanket "no units" rationale was applied to the
whole lab sentence when it only actually applies to 8 of the 10 listed values. This is not a judgment
call; Rule C is unambiguous that a value with an explicit source unit should be keyed. **Both records
need re-extraction to add `wbc` (19,200/mcL; 11,800/mcL) and `hematocrit` (38%; 36%).**

### New escalation: same-value HR via vitals + ECG in the clozapine case

`gpt_case_clozapine_toxicity_01/day18_assessment` is staged `skip_serial` because HR is mentioned
twice — "HR 118 at rest" in vitals and "sinus tachycardia at 118 bpm" on ECG — both the **same
number**, not a repeat-measurement protocol or distinct timepoint framing like the case's own
`baseline_record`/`day10_update` orthostatic sitting/standing pairs. This looks more like Rule C's
same-measurement handling (key once, as already established for the batch-8 duplicate fingerstick
glucose) than a genuine Rule D trigger, and the cost of treating it as serial is real — this exhibit
is the myocarditis-onset assessment. Filed as
`EXHIBIT-FLOWSHEET-ESCALATION-rule-d-same-value-dual-modality-2026-07-05.md` rather than adjudicated
either way.

### Everything else checked out

The remaining 17 records are correct, including several good clinical-safety distinctions:
- `gpt_case_clozapine_toxicity_01/four_hour_update`: Troponin I correctly not mapped to the registry's
  `troponin_t` key — these are different assays with different reference ranges, not interchangeable.
- `gpt_case_gbs_respiratory_compromise_01/ex_diagnostics`: CSF glucose/CSF WBC correctly kept separate
  from serum glucose/blood WBC (different body-fluid compartments, incompatible reference ranges); only
  the explicitly-labeled serum glucose (96 mg/dL) is keyed. "CBC, BMP, magnesium... unremarkable" is a
  qualitative panel summary with no numbers, correctly empty.
- `gpt_case_gallstone_pancreatitis_01/stage_1_update`: "calcium gluconate 2 g" correctly recognized as
  a medication dose, not a serum calcium result — contrast with `stage3_exhibit` in the TLS case, which
  correctly keys the *actual* lab-result calcium (7.5 mg/dL) appearing alongside a calcium-gluconate
  treatment mention in the same exhibit.
- `gpt_case_gbs_respiratory_compromise_01/stage2_12_24h_update` and `.../stage3_icu_days2_5_update`:
  genuinely serial (hour 16/20, ICU day 3/4/5, HR/BP ranges like "156/98 to 98/62 within 30 minutes") —
  correctly `skip_serial`, and mechanically re-confirmed clean (gate: OK) via the already-landed
  "hour N"/"day N" timestamp fix, a useful contrast with the two open Rule D questions above.
- Post-intervention tagging throughout (`adrenal_response`, `anticoag_response`, `sepsis_deterioration`,
  `tls_01/stage3_exhibit`, etc.) correctly follows the treatment mentioned in each exhibit's own text.

### Disposition

Batch 11 remains the one clean batch on record. Batch 12 breaks the consecutive-clean streak (one
confirmed omission, one open escalation) — the `scattered` ramp counter resets to 0 again. Once the
WBC/Hct omission is fixed and the dual-modality escalation is resolved, the next fully-adjudicated
batch with zero selection errors and zero re-dispositions becomes batch 1 of a fresh 2-batch clean
streak.
