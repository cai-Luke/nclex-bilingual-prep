# Exhibit Flowsheet Migration Batch 19 Adjudication Queue

Date: 2026-07-06
Bucket: `serial`
Manifest slice: final 28 uncovered refreshed-`serial` refs, using
`EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-19-serial-2026-07-06.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-19-serial-2026-07-06.json
```

Result:

- 28 records
- 0 FAIL
- 0 WARN
- All records are bare `{ exhibitRef, lane: "skip_serial" }` objects.

## Sampling

Sampling mode: first and final `serial` closure batch.

Total checker-seat sample: 28 of 28 records.

Rationale: `serial` is a preservation lane, not a values-extraction lane. The intended disposition is
`skip_serial` for every record because flattening multiple current readings into a single-column panel
would lose clinical meaning. Even though the gate mechanically re-confirmed every record cleanly, the
first/final lane closure should still get 100% checker-seat review.

## Sample Surface

| # | exhibitRef | Gate | Manifest serial params |
|---:|---|---|---|
| 1 | `cs_ngn_006_tbi/ex_006_vitals` | OK | `sbp/dbp`, `hr` |
| 2 | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage2_orders` | OK | `sbp/dbp`, `magnesium` |
| 3 | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage3_reassessment` | OK | `sbp/dbp`, `magnesium` |
| 4 | `gpt_case_caregiver_role_strain_dementia_01/stage_3_follow_up` | OK | `sbp/dbp` |
| 5 | `gpt_case_lateral_incivility_01/stage_2_bp_spike` | OK | `sbp/dbp` |
| 6 | `gpt_case_lateral_incivility_01/stage_3_intervention` | OK | `sbp/dbp`, `hr` |
| 7 | `gpt_case_major_burn_inhalation_fluid_creep_01/stage2_course` | OK | `lactate` |
| 8 | `gpt_case_mass_casualty_start_triage_01/stage_1_update` | OK | `sbp/dbp`, `hr`, `rr` |
| 9 | `gpt_case_mass_casualty_start_triage_01/stage_2_update` | OK | `sbp/dbp`, `hr`, `rr`, `spo2` |
| 10 | `gpt_case_mass_casualty_start_triage_01/stage_3_update` | OK | `rr`, `spo2` |
| 11 | `gpt_case_neutropenic_fever_nadir_01/stage_3_course` | OK | `sbp/dbp`, `hr`, `rr`, `spo2` |
| 12 | `gpt_case_nurse_provider_conflict_01/baseline_record` | OK | `potassium`, `chloride`, `creatinine` |
| 13 | `gpt_case_nurse_provider_conflict_01/stage_3_resolution` | OK | `potassium` |
| 14 | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/stage2_update` | OK | `spo2`, `ptt` |
| 15 | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/stage3_update` | OK | `sbp/dbp`, `hr`, `rr`, `spo2` |
| 16 | `gpt_case_pressure_injury_prevention_mobility_01/stage_2_update` | OK | `sbp/dbp`, `hr` |
| 17 | `gpt_case_unsafe_assignment_01/stage_2_deterioration` | OK | `sbp/dbp`, `map`, `hr` |
| 18 | `gpt_case_unsafe_premature_discharge_01/stage_1_teaching_ambulation` | OK | `hr`, `rr`, `spo2` |
| 19 | `gpt_case_warfarin_mvr_2026_06_11_01/stage_1_orders_response` | OK | `inr` |
| 20 | `gpt_case_warfarin_mvr_2026_06_11_01/stage_2_update` | OK | `sbp/dbp`, `hr`, `potassium`, `inr` |
| 21 | `gpt_case_warfarin_mvr_2026_06_11_01/stage_3_orders_outcomes` | OK | `potassium`, `inr` |
| 22 | `gpt_opus21_case_colostomy_lep_discharge_01/initial_record` | OK | `creatinine` |
| 23 | `opus_case_lithium_toxicity_01/exhibit_stage1` | OK | `sbp/dbp` |
| 24 | `opus_case_lithium_toxicity_01/exhibit_stage3` | OK | `sbp/dbp`, `hr` |
| 25 | `opus_case_warfarin_bridge_01/exh_1` | OK | `hr`, `hemoglobin`, `platelets`, `inr` |
| 26 | `opus1_case_tha_discharge_lep_01/baseline_record` | OK | `hr`, `creatinine` |
| 27 | `opus4_case_postop_sbar_01/stage1_progression` | OK | `sbp/dbp`, `hr`, `rr`, `spo2` |
| 28 | `opus4_case_postop_sbar_01/stage2_provider_response` | OK | `lactate` |

## Checker-Seat Adjudication (Claude, 2026-07-06)

Independent review of all 28 records against live `caseStudy.exhibits`/`stages[].exhibits` content,
pulled fresh from `banks/gpt-canonical.json`, `banks/hard-cases-canonical.json`, and
`banks/claude-canonical.json`.

**Verdict: this batch does NOT count clean.** Of 28 bare `skip_serial` records, **14 are confirmed
misclassified** — the manifest's mechanical serial-param detection triggered without a genuine
same-client, ambiguous-current-value duplicate behind it. This is the first real content-level check
of the `serial` bucket's manifest classification; prior "0 FAIL / 0 WARN" gate runs only re-confirmed
the detector against its own earlier classification, not against source prose.

### Confirmed correct (14 records) — genuine Rule D serial, `skip_serial` stands

- #1 `cs_ngn_006_tbi/ex_006_vitals`: BP 120/80→160/60, HR 80→52 across 08:00/12:00, same client —
  classic Cushing's-triad deterioration trend.
- #2, #3 `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage2_orders`,
  `stage3_reassessment`: 4 distinct differing BP readings each, same client. (The manifest's
  `magnesium` param flag on both is spurious — magnesium sulfate is only ever mentioned as an infusion
  *rate*, never a serum level — but BP alone independently justifies serial.)
- #6 `gpt_case_lateral_incivility_01/stage_3_intervention`: BP/HR differ genuinely at 2300 vs. 0200.
- #7 `gpt_case_major_burn_inhalation_fluid_creep_01/stage2_course`: lactate 3.0→2.1 mmol/L, same
  client, distinct draws.
- #9 `gpt_case_mass_casualty_start_triage_01/stage_2_update`: client D has two differing current SpO2
  values (89%→92%) within this same exhibit, after albuterol — genuine same-client duplicate, unlike
  #8/#10 below.
- #11 `gpt_case_neutropenic_fever_nadir_01/stage_3_course`: full vitals differ at 1930 vs. 2200.
- #15 `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/stage3_update`: HR/BP/RR/SpO2 differ at 1000
  vs. 1200.
- #16 `gpt_case_pressure_injury_prevention_mobility_01/stage_2_update`: orthostatic vitals (supine vs.
  standing BP/HR) — genuinely un-flattenable for a different reason than temporal ambiguity: both
  values are simultaneously "current" and the difference between them *is* the clinical finding.
  Correctly a preservation case.
- #18 `gpt_case_unsafe_premature_discharge_01/stage_1_teaching_ambulation`: HR/RR/SpO2 differ across
  the ambulation trial and recovery.
- #20 `gpt_case_warfarin_mvr_2026_06_11_01/stage_2_update`: HR/BP differ at 1800 vs. 2000 — justifies
  serial on its own. (The manifest's `potassium` flag is spurious: no potassium value appears anywhere
  in this exhibit. `inr` has only one value, 4.6.)
- #24 `opus_case_lithium_toxicity_01/exhibit_stage3`: BP/HR differ across three timepoints during and
  after dialysis.
- #25 `opus_case_warfarin_bridge_01/exh_1`: INR/platelets/hemoglobin genuinely differ across hospital
  days 2/4/5, an explicit trend table.
- #27 `opus4_case_postop_sbar_01/stage1_progression`: full vitals differ at 0900 vs. 1100.

### Confirmed misclassified (14 records) — should NOT be bare `skip_serial`

**Cross-client conflation** (a parameter appears with different values for *different clients* in a
multi-client exhibit, not repeated for one client):
- #8 `gpt_case_mass_casualty_start_triage_01/stage_1_update`: C's BP 88/62 and E's BP 118/74 are
  different patients, not a same-client duplicate. No client has two readings in this exhibit.
- #10 `gpt_case_mass_casualty_start_triage_01/stage_3_update`: same issue (D's RR/SpO2 vs. C's).
- #17 `gpt_case_unsafe_assignment_01/stage_2_deterioration`: Client A's BP 88/53 and Client B's BP
  156/82 are different patients.
  These three should get the same disposition already established for multi-client exhibits
  (`opus_case_unsafe_assignment_01/baseline_assessment` in Batch 16: empty panel, "no single-client
  flowsheet surface"), not `skip_serial`, which implies a genuine same-client value is being withheld.

**Protocol/order/medication-name text mistaken for a lab/vital result:**
- #5 `gpt_case_lateral_incivility_01/stage_2_bp_spike`: only one current BP (186/102 at 2200) exists;
  the trigger is the call-threshold text ("SBP > 180"), a protocol criterion, not a second reading. The
  1800 recheck is explicitly stated as *missed*.
- #12 `gpt_case_nurse_provider_conflict_01/baseline_record`: `chloride` triggers from "potassium
  chloride" in the unit-protocol paragraph — no second chloride value exists (Cl 101 mEq/L appears
  once).
- #13 `gpt_case_nurse_provider_conflict_01/stage_3_resolution`: only one potassium result (3.4 mEq/L)
  exists; the trigger is dose/administration-count language ("second dose... four doses... 10 mEq").
- #14 `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/stage2_update`: `ptt` triggers from "aPTT
  every 6 hours, target aPTT 60-80" (a monitoring order), not a second result — only one aPTT value
  (29 sec) exists. `spo2` triggers from the ABG's `SaO2 93%` colliding with the gate's `spo2` synonym
  pattern (the same collision flagged as a latent risk in Batch 14) against the one true pulse-ox
  SpO2 (93% at 0930) — not a genuine duplicate.

**Prior/baseline value explicitly contrasted with current, not ambiguous:**
- #12 (same record as above): potassium 3.1 vs. "POD1 potassium was 3.8" and creatinine 1.6 vs.
  "baseline 1.3" are both explicit historical comparisons, the established `prior`-exclusion pattern
  from earlier batches, not Rule D ambiguity.
- #26 `opus1_case_tha_discharge_lep_01/baseline_record`: current creatinine 1.4 mg/dL vs. chronic-CKD
  "baseline creatinine 1.3 mg/dL, eGFR 42" in the history paragraph is the same `prior` pattern. `hr`
  has no second value anywhere in this exhibit at all.

**Same-value restatement, not a duplicate measurement:**
- #22 `gpt_opus21_case_colostomy_lep_discharge_01/initial_record`: creatinine 0.9 mg/dL is stated twice
  — once as the rationale for restarting metformin, once in the formal labs list — clearly the same
  draw. This is the resolved same-value/key-once precedent, not a duplicate.

**No second value exists at all:**
- #4 `gpt_case_caregiver_role_strain_dementia_01/stage_3_follow_up`: exactly one BP (138/82) is stated;
  "BP readings" earlier in the exhibit is a narrative reference to values reported to the PCP, with no
  number attached.
- #21 `gpt_case_warfarin_mvr_2026_06_11_01/stage_3_orders_outcomes`: the word "potassium" does not
  appear anywhere in this exhibit; the flag has no textual basis. INR has one value (3.8).
- #23 `opus_case_lithium_toxicity_01/exhibit_stage1`: exactly one BP (94/58) is stated in this exhibit.
- #28 `opus4_case_postop_sbar_01/stage2_provider_response`: exactly one lactate value (3.8 mmol/L) is
  stated.
- #19 `gpt_case_warfarin_mvr_2026_06_11_01/stage_1_orders_response`: no numeric INR value appears
  anywhere — only references to pending/future INR testing ("pending INR results," "recheck INR in 6
  hours"). This record's correct disposition isn't `extract` either — it's an **empty panel** (no
  current value to key at all), the same "no-current-value" pattern used for order-only exhibits in
  Batches 17-18.

### Recommendation

The `serial` bucket's manifest classification (`EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`) should not
be trusted as-is for staging decisions; it appears to share the same mechanical blind spots the
`scattered`/`prose_embedded` extraction pipeline already learned to handle (multi-client conflation,
protocol/order-text collisions, prior/baseline pairs, same-value restatement, and the known SaO2/SpO2
synonym overlap) but was never run through that same content-aware disposition logic. Recommend Codex
re-derive per-record disposition for all 28 refs using the same extraction/exclusion/multi-client rules
already established for `scattered` and `prose_embedded`, rather than bulk-staging manifest membership
as bare `skip_serial`. The 14 records confirmed correct above can stay as-is once re-run through that
logic; the other 14 need real dispositions (`extract` with appropriate `excludedValues`/`context` for
most, empty panel for #19, and the established multi-client empty-panel treatment for #8/#10/#17).

**The `serial` bucket is not closed.** Raw manifest coverage (33/33) is not the same as verified-correct
disposition; only 16/33 refreshed serial refs (the 2 already-resolved plus these 14) currently have a
confirmed-correct disposition on record.

After this artifact, refreshed manifest raw staging is:

- `clean_kv`: 2/2 covered, 0 uncovered
- `prose_embedded`: 149/149 covered, 0 uncovered
- `scattered`: 152/152 covered, 0 uncovered
- `serial`: 33/33 raw staged candidates, but only 16/33 confirmed-correct dispositions; `serial` is
  not closed
