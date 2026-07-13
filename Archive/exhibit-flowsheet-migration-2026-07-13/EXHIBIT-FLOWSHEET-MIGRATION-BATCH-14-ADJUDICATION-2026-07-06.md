# Exhibit Flowsheet Migration Batch 14 Adjudication

Date: 2026-07-06
Bucket: `scattered`
Manifest slice: first 20 uncovered refreshed-`scattered` refs after Batches 10-13, using
`EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json` after the ABG completeness-pattern refresh
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-14-scattered-2026-07-06.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-14-scattered-2026-07-06.json
```

Result:

- 20 records
- 0 FAIL
- 27 WARN

WARN classes:

- Prose-normalization candidates:
  - HR values written as `/min` but staged as `bpm` in
    `gpt_case_major_burn_inhalation_fluid_creep_01/stage3_course`,
    `gpt_case_svc_syndrome_01/baseline_record`, and
    `gpt_case_svc_syndrome_01/stage_2_update`.
- Serial-lane advisory:
  - `gpt_case_svc_syndrome_01/stage_1_update` is staged `skip_serial` for repeated same-client SpO2
    readings around the head-of-bed event and hour-6 vitals; detector does not re-confirm this prose
    shape.
  - `gpt_case_taco_vs_trali_01/stage_1_update` is staged `skip_serial` for 15-minute and end-of-unit
    vital-sign sets; detector does not re-confirm this prose shape.
  - `gpt_case_unsafe_premature_discharge_01/stage_3_discharge_readiness` is staged `skip_serial` for
    resting and exertional HR/RR/SpO2 readings plus repeat labs; detector does not re-confirm this
    prose shape.
- No-value / name-collision advisory mentions:
  - `gpt_case_unsafe_assignment_01/baseline_assessment`: three different clients, no single-client
    flowsheet surface.
  - `gpt_case_unsafe_assignment_01/baseline_assignment`: protocol/assignment parameters and medication
    drip rates, not resulted patient values.
  - `gpt_case_unsafe_premature_discharge_01/baseline_assessment_labs`: several labs are listed without
    source units; only explicit-unit/ratio values were keyed.
  - `gpt_case_taco_vs_trali_01/stage_4_resolution`: "repeat hemoglobin in 6 hours" is an order, not a
    resulted hemoglobin value.
  - `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01/stage3_update`: ascitic-fluid WBC is not
    blood WBC.
  - `gpt_case_warfarin_mvr_2026_06_11_01/admission_record`: potassium chloride is a home medication,
    and target/prior INR text is not a current admission lab.
  - `gpt_opus21_case_colostomy_lep_discharge_01/stage3_discharge_teachback`: fasting glucose range is
    a target range, not a current glucose value.

## Sampling

Sampling mode: `scattered` bucket ramp reset.

Batch 13 did not count clean after the confirmed PaO2 omission, even though Codex has now re-extracted
that value. Batch 14 was therefore assigned 100% independent checker-seat adjudication. Claude's
completed review found no selection errors or re-dispositions, so Batch 14 is clean scattered
**batch** 1 of 2 for the fresh post-PaO2-fix ramp.

Total checker-seat sample: 20 of 20 records.

## Sample Surface

| # | exhibitRef | Extractor disposition | Gate | Review note |
|---:|---|---|---|---|
| 1 | `gpt_case_major_burn_inhalation_fluid_creep_01/stage3_course` | Keyed 1600 HR/BP and labs | WARN | Later urine-output/airway/bladder-pressure values out of allowlist; HR `/min` candidate. |
| 2 | `gpt_case_svc_syndrome_01/baseline_record` | Keyed baseline vitals, CBC/chem/coag, ABG | WARN | D-dimer/SaO2/neck circumference out of scope; HR `/min` candidate. |
| 3 | `gpt_case_svc_syndrome_01/stage_1_update` | `skip_serial` | WARN | Repeated SpO2 around head-of-bed event and hour-6 vitals. |
| 4 | `gpt_case_svc_syndrome_01/stage_2_update` | Keyed hour-12 vitals and ABG | WARN | Neck circumference/SaO2 out of scope; HR `/min` candidate. |
| 5 | `gpt_case_taco_vs_trali_01/baseline_assessment_labs` | Keyed baseline vitals and explicit-unit labs | OK | Weight/eGFR/albumin/blood-bank metadata out of scope. |
| 6 | `gpt_case_taco_vs_trali_01/stage_1_update` | `skip_serial` | WARN | 15-minute and end-of-unit vital-sign sets trigger serial disposition. |
| 7 | `gpt_case_taco_vs_trali_01/stage_4_resolution` | Keyed current post-diuresis vitals and BNP | WARN | Repeat hemoglobin order is not a resulted value. |
| 8 | `gpt_case_unsafe_assignment_01/baseline_assessment` | Empty panel | WARN | Three-client assignment; no single-client flowsheet surface. |
| 9 | `gpt_case_unsafe_assignment_01/baseline_assignment` | Empty panel | WARN | Assignment/protocol thresholds and drip rates only. |
| 10 | `gpt_case_unsafe_premature_discharge_01/baseline_assessment_labs` | Keyed vitals, explicit creatinine/BNP/INR; excluded prior Cr/BNP | WARN | Unitless labs left unkeyed. |
| 11 | `gpt_case_unsafe_premature_discharge_01/stage_3_discharge_readiness` | `skip_serial` | WARN | Resting and exertional vitals plus repeat labs create repeated current parameters. |
| 12 | `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01/stage1_update` | Keyed post-bolus HR/BP/Hgb/lactate | OK | Values carry `post_intervention`; blood loss/urine output out of scope. |
| 13 | `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01/stage2_update` | Keyed post-intervention vitals, Hgb/lactate, four-hour labs | OK | Urine output/melena out of scope. |
| 14 | `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01/stage3_update` | Keyed vitals, Hgb, creatinine/ammonia/lactate | WARN | Ascitic-fluid WBC/ANC/SAAG out of allowlist scope. |
| 15 | `gpt_case_warfarin_mvr_2026_06_11_01/admission_record` | Empty panel with prior INR excluded | WARN | Target INR and medication doses are not current labs. |
| 16 | `gpt_case_warfarin_mvr_2026_06_11_01/initial_assessment_labs` | Keyed current vitals/coag/CBC/BUN/Cr; excluded prior Hgb | OK | PT not keyed; urinalysis/stool guaiac out of scope. |
| 17 | `gpt_case_warfarin_mvr_2026_06_11_01/stage_3_deterioration` | Keyed 0600 vitals and 0645 stat labs | OK | Urinalysis/RBCs out of scope. |
| 18 | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/ongoing_plan` | Keyed post-stimulation RR/SpO2 | OK | Sedation/pain scores and future reassessment protocol out of scope. |
| 19 | `gpt_opus21_case_colostomy_lep_discharge_01/stage3_discharge_teachback` | Keyed discharge vitals | WARN | Glucose target range is not a current value. |
| 20 | `gpt_pph_2026_06_16_case_01/stage_2_update` | Keyed post-intervention vitals and stat CBC/coags | OK | QBL/fibrinogen/type-cross out of allowlist scope. |

## Checker-Seat Adjudication (Claude, 2026-07-06)

100% independent review against live `caseStudy.exhibits`/`stages[].exhibits` content pulled from
`banks/gpt-canonical.json` and `banks/hard-cases-canonical.json` (not reconstructed from the gate's
WARN summary). All 20 records checked for: correct value/unit/label against full exhibit prose (not
just the quoted `sourceSpan`), correct `extract` vs `skip_serial` disposition under the amended Rule D,
correct `excludedValues` reasons, and any allowlisted analyte present in source but neither keyed nor
excluded.

**Verdict: zero confirmed selection errors, zero re-dispositions.**

Per-record notes beyond the gate's own WARN list:

- Rows 3, 6, 11 (`skip_serial`): all three are producer judgment calls the mechanical serial detector
  does not itself re-confirm (no clock-format timestamp pair — "Hour 6" vs. an untimed desat episode;
  spelled-out "Fifteen-minute"/"end-of-unit"; "Next morning" vs. a single `09:00`). In every case the
  underlying prose genuinely carries ≥2 current same-parameter readings for one client (SpO2 94→91→94;
  two full vital sets around a transfusion unit; resting vs. exertional HR/RR/SpO2). Conservative
  `skip_serial` is the correct call in all three; this is the detector's known blind spot (relies on
  digit-timestamp tokens), not a producer error.
- Row 2 (`svc_syndrome_01/baseline_record`) and row 4 (`stage_2_update`): ABG `SaO2` is correctly left
  unkeyed and distinct from pulse-ox `spo2` — the two values happen to be numerically identical in both
  records, which is why GATE 2's advisory sweep doesn't flag it (the `spo2` synonym pattern in
  `scripts/exhibit-flowsheet-gate.ts` also matches `SaO2`, so once `spo2` is accounted for the sweep is
  satisfied even though `SaO2` was never itself keyed). Not a defect in this batch — both are correctly
  omitted from panel/excluded — but worth a Codex note: if a future scattered exhibit has ABG `SaO2` and
  pulse-ox `SpO2` diverge (e.g., carboxyhemoglobin), the shared regex would silently mask that GATE 2
  couldn't see `SaO2` as unaccounted. Low priority, not blocking.
- Row 14 (`variceal_hemorrhage.../stage3_update`): ascitic-fluid WBC (620 cells/µL) correctly excluded
  from the blood `wbc` analyte — this is exactly the kind of same-label-different-fluid trap the
  allowlist is meant to catch, and it was caught correctly.
- Row 20 (`gpt_pph_2026_06_16_case_01/stage_2_update`): minor inconsistency, not a selection error —
  the five vitals (`hr`/`sbp`/`dbp`/`rr`/`spo2`) are tagged `context: "post_intervention"`, but the
  concurrent "Stat labs" from the same sentence/narrative window (`hemoglobin`, `hematocrit`,
  `platelets`, `inr`, `ptt`) are not, even though they occur after the same massage/oxytocin/uterotonic
  attempts as the vitals. Compare rows 12/13 (variceal hemorrhage), where vitals and labs from the same
  post-bolus/post-transfusion window are tagged consistently. Recommend Codex apply `post_intervention`
  uniformly within a single narrative window in future batches; does not warrant a re-disposition or
  selection-error count here since Rule F only validates the tag's *value* when present, not its
  completeness.
- All "no-value / name-collision" and "unitless-labs-left-unkeyed" WARNs in the gate's own list were
  independently re-verified against full exhibit prose (not just the WARN summary) and are correctly
  benign: target/prior INR and BNP values, non-patient assignment/protocol parameters, a future lab
  order ("repeat hemoglobin in 6 hours"), a target glucose range, and labs genuinely given without a
  source unit token (Rule C correctly declines to guess).

**Disposition: Batch 14 is clean scattered batch 1 of 2.** One more zero-error 100%-adjudicated
scattered batch is needed before the ramp can taper.

After this artifact, refreshed manifest coverage is:

- `prose_embedded`: 143/149 covered, 6 uncovered
- `scattered`: 95/152 covered, 57 uncovered
- `serial`: 5/33 covered, 28 uncovered
