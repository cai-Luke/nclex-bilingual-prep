# Exhibit Flowsheet Migration Batch 18 Adjudication Queue

Date: 2026-07-06
Bucket: `prose_embedded`
Manifest slice: final 6 refreshed `prose_embedded` refs left uncovered after the ABG completeness-pattern
refresh, using `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-18-prose_embedded-2026-07-06.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-18-prose_embedded-2026-07-06.json
```

Result:

- 6 records
- 0 FAIL
- 2 WARN

WARN classes:

- ABG-pattern advisory / source-label collision:
  - `gemini_gap_case_pyloric_stenosis_01/ex2_labs` contains serum chemistry `Carbon Dioxide (HCO3):
    34 mEq/L`, so it is staged as BMP/chemistry `bicarbonate`, not `hco3_abg`. The ABG completeness
    pattern correctly surfaces a WARN for checker review, but the source is titled "Serum Chemistries"
    and lists Na/K/Cl/CO2/pH together.
- No-current-value advisory:
  - `opus2_case_postop_opioid_respiratory_depression_01/background_orders` contains age, hours after
    surgery, medication frequencies, IV fluid rate, and current time, but no current maternal/vital/lab
    heart-rate value. It is staged as an empty extract.

## Sampling

Sampling mode: final partial `prose_embedded` closure batch under the already-tapered prose regime.

Total checker-seat sample: 6 of 6 records, because this is the refreshed prose closure tail and includes
the ABG-pattern ambiguity that created the refreshed uncovered set.

## Sample Surface

| # | exhibitRef | Extractor disposition | Gate | Review note |
|---:|---|---|---|---|
| 1 | `gemini_gap_case_pyloric_stenosis_01/ex2_labs` | Keyed Na/K/Cl/BMP bicarbonate/pH | WARN | Serum chemistry HCO3 is intentionally `bicarbonate`, not `hco3_abg`; reference ranges omitted. |
| 2 | `gpt_case_major_burn_inhalation_fluid_creep_01/stage1_course` | Keyed SpO2 94% after NRB oxygen | OK | Oxygen delivery, Parkland formula, TBSA, fluid rates, urine-output targets/actuals, and times omitted. |
| 3 | `gpt_r1_regen_case_celiac_01/initial_labs` | Keyed Hgb/WBC/platelets/calcium/creatinine | OK | MCV, albumin, alk phos, IgA, ESR, CRP, stool results, and pending tTG-IgA omitted. |
| 4 | `opus_vanco_case_01/background_orders` | Empty panel; excluded baseline creatinine as prior | OK | CKD baseline creatinine is history, not a current result; creatinine clearance and medication/order quantities omitted. |
| 5 | `opus2_case_postop_opioid_respiratory_depression_01/background_orders` | Empty extract | WARN | No current HR; age, elapsed hours, PRN frequencies, fluid rate, pulse-ox order, CPAP status, morphine dose times, and current time omitted. |
| 6 | `opus20_case_cdiff_01/exhibit_stage3` | Keyed repeat labs/vitals with `post_intervention` context | OK | eGFR, urine output, stool count, wound status, oral-med transition, and hand-hygiene observations omitted. |

## Checker-Seat Adjudication (Claude, 2026-07-06)

Independent review of all 6 records against live `caseStudy.exhibits`/`stages[].exhibits` content, pulled
fresh from `banks/gemini-canonical.json` (`gemini_gap_case_pyloric_stenosis_01`),
`banks/hard-cases-canonical.json` (`gpt_case_major_burn_inhalation_fluid_creep_01`,
`gpt_r1_regen_case_celiac_01`, `opus2_case_postop_opioid_respiratory_depression_01`), and
`banks/claude-canonical.json` (`opus_vanco_case_01`, `opus20_case_cdiff_01`).

**Verdict: zero confirmed selection errors, zero re-dispositions.**

All four specific attention items from the queue, confirmed correct:

- Row 1: "Carbon Dioxide (HCO3): 34 mEq/L" is correctly staged as `bicarbonate`, not `hco3_abg` — it's
  listed alongside Na/K/Cl in a titled "Serum Chemistries" panel with no ABG/arterial context anywhere
  in the exhibit. The panel is clinically coherent as classic pyloric-stenosis hypochloremic,
  hypokalemic metabolic alkalosis (low Cl 88, low K 3.1, elevated bicarbonate 34, elevated pH 7.51).
- Row 4 (`opus_vanco_case_01/background_orders`): baseline creatinine 1.6 mg/dL is correctly excluded
  as `prior` — it's explicit chronic-CKD history ("History: stage 3b chronic kidney disease; baseline
  creatinine 1.6 mg/dL"), not a value drawn at this admission-orders exhibit, which has no other current
  lab/vital anywhere in its prose.
- Row 5 (`opus2_case_postop_opioid_respiratory_depression_01/background_orders`): correctly empty.
  Re-verified the full exhibit line by line — age, BMI, elapsed hours, PRN medication frequencies, fluid
  rate, a "continuous pulse oximetry" monitoring *order* (not a resulted SpO2 value), CPAP bedside
  status, three morphine administration timestamps, and the current clock time are the only content;
  no current HR, lab, or vital value is stated anywhere.
- Row 6 (`opus20_case_cdiff_01/exhibit_stage3`): `post_intervention` context is appropriate for the
  repeat treatment-response labs and vitals in this recovery-phase exhibit.

All remaining WARNs and "omitted" notes (MCV/albumin/alk-phos/IgA/ESR/CRP/qualitative stool results,
Parkland-formula/TBSA/urine-output targets, and eGFR/wound/stool-count/hand-hygiene detail) were
independently re-verified as correctly out of the current values-only allowlist scope.

**Disposition: Batch 18 is clean.** This closes `prose_embedded` at 149/149 covered, 0 uncovered.
Combined with Batch 17 closing `scattered` at 152/152, **both the `prose_embedded` and `scattered`
buckets are now fully covered.** `serial` remains the sole open bucket at 5/33 covered, 28 uncovered.

After this artifact, refreshed manifest coverage is:

- `prose_embedded`: 149/149 covered, 0 uncovered
- `scattered`: 152/152 covered, 0 uncovered
- `serial`: 5/33 covered, 28 uncovered
