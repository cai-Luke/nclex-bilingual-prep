# Lab Reference-Range Verification Closeout

**Date:** 2026-07-19  
**Status:** Implemented; independent clinical-checker, promoted-visual parity, and local shell receipts remain pending  
**Scope owner:** `src/visuals/kinds/lab_trend/defs.ts`

## Disposition

The original 29 analytes × 3 populations request cannot be implemented safely with the current population vocabulary. Published pediatric intervals are not cleanly expressible as one `peds_infant` band and one `peds_child` band: they divide neonates by days or weeks, children by multiple age bands, and several analytes additionally divide by sex or assay. A coarse bucket would therefore create silent H/L errors.

The committed contract is:

1. `adult` means an educational adult lane (18 years and older unless the cited assay uses a slightly different adult floor).
2. Every analyte retains one sourced adult teaching band.
3. `peds_child` and `peds_infant` do **not** receive automatic laboratory reference bands.
4. Pediatric `lab_trend` remains available for trajectory-only questions when every series explicitly sets `showReferenceBand: false`.
5. Pediatric H/L assertions fail closed with `self_check_flag_requires_reference_band`.
6. Pediatric `direction: "stable"` assertions fail closed with `self_check_stable_requires_reference_band`, because the tolerance is derived from band width.
7. A pediatric spec that leaves the default reference-band behavior enabled fails validation with `reference_band_unavailable`.

This is deliberately narrower than inventing two pediatric intervals. It leaves the existing `Population` enum intact and provides a forward-compatible path: a future age-banded population model can add verified entries without changing the renderer contract.

## Interval-selection rules

- The values below are **teaching/display bands**, not universal laboratory truth. Reference intervals vary by laboratory, method, specimen, age, sex, altitude, and preanalytic conditions.
- Where a source publishes separate adult male and female intervals but the visual schema has no sex field, the registry uses the inclusive envelope (lowest lower bound through highest upper bound). This avoids false-positive flags at the cost of reduced sensitivity near sex-specific boundaries. A question must not key an answer to a borderline value in that envelope.
- `troponin_t` is now labeled **hs-Troponin T** and uses the inclusive adult University of Iowa high-sensitivity assay envelope converted from ng/L to ng/mL.
- Glucose uses the source laboratory's **random/general** interval, not the fasting diagnostic interval, because `lab_trend` does not encode fasting state.
- BNP retains the conventional 0–100 pg/mL assay interval from the cited performing-laboratory catalog. BNP and NT-proBNP are not interchangeable.
- Sanity bounds are warning-only numeric envelopes. They are not rendered as reference intervals and must not be described as critical values, reportable ranges, or physiologic impossibility cutoffs.

## Registry table

`stableEps` remains `0.10` for every analyte. It means 10% of the active reference-band width and is solely a deterministic chart assertion tolerance; it is not a clinical significant-change threshold.

| Key | Canonical unit | Adult teaching band | Pediatric band | Sanity envelope | Source / basis |
|---|---:|---:|---|---:|---|
| sodium | mEq/L | 135–145 | unavailable | 90–200 | UIowa sodium [S1] |
| potassium | mEq/L | 3.5–5.0 | unavailable | 1.0–10.0 | UIowa potassium [S2] |
| chloride | mEq/L | 95–107 | unavailable | 60–160 | UIowa chloride [S3] |
| bicarbonate | mEq/L | 22–29 | unavailable | 3–60 | UIowa CO2 content [S4] |
| anion_gap | mEq/L | 7–15 | unavailable | 0–50 | Mayo renal panel; method-dependent calculated interval [S5] |
| bun | mg/dL | 10–20 | unavailable | 1–250 | UIowa BUN [S6] |
| creatinine | mg/dL | 0.51–1.17 | unavailable | 0.1–25 | UIowa female/male adult inclusive envelope [S7] |
| glucose | mg/dL | 65–139 | unavailable | 10–1500 | UIowa random glucose [S8] |
| calcium | mg/dL | 8.5–10.5 | unavailable | 3–20 | UIowa total calcium [S9] |
| ionized_calcium | mmol/L | 0.95–1.30 | unavailable | 0.3–5.0 | UIowa 3.8–5.2 mg/dL converted by calcium molar mass [S10] |
| magnesium | mg/dL | 1.7–2.3 | unavailable | 0.3–10 | adult serum; clinical override of UIowa [S11] 1.5–2.9 per Luke's ratification 2026-07-19 (implausibly broad for serum Mg) |
| phosphate | mg/dL | 2.5–4.5 | unavailable | 0.2–20 | UIowa phosphorus, adults >18 [S12] |
| lactate | mmol/L | 0.5–2.0 | unavailable | 0.1–40 | UIowa adult lactate [S13] |
| troponin_t | ng/mL | 0–0.022 | unavailable | 0–50 | UIowa hs-TnT adult sex-inclusive envelope, 22 ng/L = 0.022 ng/mL [S14] |
| bnp | pg/mL | 0–100 | unavailable | 0–10,000 | Labcorp BNP assay interval; not NT-proBNP [S15] |
| wbc | ×10³/µL | 3.7–10.5 | unavailable | 0–200 | UIowa adult CBC [S16] |
| hemoglobin | g/dL | 11.9–17.7 | unavailable | 2–25 | UIowa adult female/male inclusive envelope [S16] |
| hematocrit | % | 35–52 | unavailable | 5–80 | UIowa adult female/male inclusive envelope [S16] |
| platelets | ×10³/µL | 150–400 | unavailable | 0–2,000 | UIowa platelet count [S17] |
| inr | ratio | 0.8–1.2 | unavailable | 0.5–20 | UIowa 2023 healthy-population interval update [S18] |
| ptt | seconds | 22–31 | unavailable | 10–300 | UIowa current aPTT reagent interval [S19] |
| ph | unitless | 7.35–7.45 | unavailable | 6.5–8.0 | MedlinePlus adult ABG [S20] |
| paco2 | mmHg | 35–45 | unavailable | 5–200 | MedlinePlus adult ABG; ceiling widened above prior 100 [S20] |
| pao2 | mmHg | 75–100 | unavailable | 10–700 | MedlinePlus adult ABG interval [S20] |
| hco3_abg | mEq/L | 22–26 | unavailable | 5–50 | MedlinePlus adult ABG [S20] |
| ast | U/L | 0–50 | unavailable | 0–10,000 | UIowa adult sex-inclusive envelope, P5P assay [S21] |
| alt | U/L | 0–50 | unavailable | 0–10,000 | UIowa adult sex-inclusive envelope, P5P assay [S22] |
| total_bilirubin | mg/dL | 0–1.2 | unavailable | 0–60 | UIowa adult total bilirubin [S23] |
| ammonia | µmol/L | 11–60 | unavailable | 0–1,000 | UIowa adult female/male inclusive envelope [S24] |

### Sanity-envelope audit

The existing envelopes were intentionally broad and were retained unless the review found a concrete false-rejection risk. The changed ceilings are:

- lactate: `30 → 40 mmol/L`
- INR: `12 → 20`
- aPTT: `200 → 300 seconds`
- PaCO2: `100 → 200 mmHg`
- PaO2: `600 → 700 mmHg`
- ammonia: `500 → 1,000 µmol/L`

These values are not claims that higher results are impossible. They are typo guards for deterministic educational data. Critical-value tables [S25] were used only as a floor check: every envelope comfortably contains the cited critical thresholds. Exact censored results such as `aPTT >200 seconds` remain **out of contract** for `lab_trend`, because its value array stores exact plottable numbers and has no comparator field. Such a source result must remain in structured measurements with schema-2.0 `bound`, or the trend author must use a separately sourced exact numeric result; stripping `>` is forbidden.

## Pediatric evidence

The two-bucket model fails even on common analytes:

- creatinine is divided into 0–15 days, 15 days–2 years, 2–4 years, 4–12 years, 12–16 years, then sex-specific adult intervals;
- hemoglobin and hematocrit have separate neonatal, monthly infancy, early-childhood, school-age, adolescent, and adult intervals;
- phosphorus has multiple age and sex divisions;
- neonatal bilirubin changes across 0–2, 2–3, 3–11, and 11–31 days;
- hs-troponin T changes at 6 months and 1 year and becomes sex-specific.

The source packet therefore supports trend-only pediatric rendering, not coarse pediatric H/L bands. See [S26] and the individual analyte sources.

## Adult vitals audit

No `VITAL_DEFS` code change is included. The current adult teaching bands are consistent with the cited general references or remain deliberately broad:

| Vital | Current band | Disposition |
|---|---:|---|
| heart rate | 60–100 bpm | retained; MedlinePlus adult resting pulse [V1] |
| systolic BP | 90–120 mmHg | retained as a display envelope; normal is above the hypotension boundary and below/equal to the conventional healthy upper boundary [V1, V2] |
| diastolic BP | 60–80 mmHg | retained [V1, V2] |
| MAP | 70–100 mmHg | retained; normal MAP reference [V3] |
| respiratory rate | 12–20/min | retained as conventional nursing teaching band; MedlinePlus gives 12–18/min, so answer-bearing borderline values 19–20 must not be keyed as universally normal [V1] |
| SpO2 | 95–100% | retained [V4] |
| temperature | 36.5–37.5 °C | retained as a rounded teaching envelope; MedlinePlus gives 36.5–37.3 °C [V1] |

Pediatric vitals remain unchanged and are not added here. Pediatric blood pressure itself depends on age, sex, and height percentile, which confirms that the same coarse-population problem extends beyond labs [V2].

## Code and regression changes

- `ANALYTE_DEFS.refBand` now requires `adult` while making only the two pediatric population keys optional.
- All placeholder pediatric bands were deleted.
- Validation emits `reference_band_unavailable` unless an unsupported population explicitly sets `showReferenceBand: false`.
- `selfCheck` blocks H/L and stable assertions when the active band is unavailable; up/down trend assertions remain valid.
- The renderer already omits an unavailable band and now has a valid pediatric trend-only fixture.
- `scripts/tests/lab-trend-reference-bands.ts` pins the adult-only registry, pediatric fail-closed behavior, trend-only allowance, the INR/aPTT/glucose/PaO2 corrections, and validates all 20 promoted `banks/lab-canonical.json` visuals plus their expected trend/H/L contracts against the updated registry.
- `npm run test-visuals` now includes that regression; `npm run test:lab-reference-ranges` runs it directly.

## Promoted-bank impact review

All 20 promoted `lab_trend` items use `population: "adult"`. Their answer-bearing H/L assertions remain on values clearly outside both the old and new teaching bands (for example potassium 2.9/6.4, sodium 118/120, creatinine 1.7–2.3, aPTT 118, WBC 1.6/19/21.1, and INR 4.4/4.8). No bank JSON edit is required. The dedicated regression now loads the complete canonical lab bank and runs both `validateLabTrend` and `selfCheckLabTrend` for every item, so future range changes cannot silently flip a promoted flag.

## Promoted visual-parity impact

Reference bands are rendered geometry, so changing a band can legitimately change a promoted `lab_trend` SVG hash even when the authored bank payload and keyed answer remain unchanged. The committed promoted-visual baseline must therefore be regenerated through its governed receipt path; the snapshot file must not be hand-edited. After the independent clinical checker accepts the final table, run:

```bash
npm run parity:rebaseline -- --reason "source-verified adult lab reference bands" --scope lab_trend
npm run test:visual-parity-promoted
```

The rebaseline should classify the deltas as `renderer`, because the source change is under `src/visuals/kinds/lab_trend/` and no canonical bank changed. `lab_trend` is not a calibrated tracing kind, so the parity mechanism does not require the tracing contact-sheet toolchain for this scope.

## Independent checker receipt

This pass is the producer/implementer. It does not self-certify the spec's producer≠checker gate. The independent checker should verify, directly against the linked source pages, that each adult number and unit is transcribed correctly; that sex-specific ranges are represented by the documented inclusive-envelope rule; that pediatric omission follows from the cited age/sex splits; and that the widened sanity ceilings remain warning-only typo guards rather than clinical cutoffs. Any discrepancy should be corrected in the table and registry together.

## Required local verification receipt

Run from the repository root:

```bash
npm run test:lab-reference-ranges
npm run test:measurement-allowlist
npm run validate-bank -- banks/*.json
npx tsc -b --pretty false
npm run parity:rebaseline -- --reason "source-verified adult lab reference bands" --scope lab_trend
npm run test-visuals
npm run build
```

The connector used for this pass can read and write the Desktop repository but cannot execute shell commands. Do not promote the implementation as fully verified until both the independent clinical-checker receipt and a local shell run record their results.

## Sources

- **S1:** University of Iowa, Sodium — https://www.healthcare.uiowa.edu/path_handbook/handbook/test1728.html
- **S2:** University of Iowa, Potassium — https://www.healthcare.uiowa.edu/path_handbook/rhandbook/test1535.html
- **S3:** University of Iowa, Chloride — https://www.healthcare.uiowa.edu/path_handbook/handbook/test433.html
- **S4:** University of Iowa, Carbon Dioxide (CO2 Content) — https://www.healthcare.uiowa.edu/path_handbook/handbook/test384.html
- **S5:** Mayo Clinic Laboratories, Renal Function Panel — https://www.mayocliniclabs.com/test-catalog/Overview/113634
- **S6:** University of Iowa, Urea Nitrogen — https://www.healthcare.uiowa.edu/path_handbook/handbook/test1889.html
- **S7:** University of Iowa, Creatinine — https://www.healthcare.uiowa.edu/path_handbook/handbook/test530.html
- **S8:** University of Iowa, Glucose — https://www.healthcare.uiowa.edu/path_handbook/handbook/test883.html
- **S9:** University of Iowa, Calcium (Total) — https://www.healthcare.uiowa.edu/path_handbook/rhandbook/test368.html
- **S10:** University of Iowa, Calcium, Ionized — https://www.healthcare.uiowa.edu/path_handbook/handbook/test370.html
- **S11:** University of Iowa, Magnesium — https://www.healthcare.uiowa.edu/path_handbook/handbook/test1282.html
- **S12:** University of Iowa, Phosphorus — https://www.healthcare.uiowa.edu/path_handbook/rhandbook/test1131.html
- **S13:** University of Iowa, Lactate — https://www.healthcare.uiowa.edu/path_handbook/handbook/test1184.html
- **S14:** University of Iowa, Troponin T, High Sensitivity — https://www.healthcare.uiowa.edu/path_handbook/handbook/test3665.html
- **S15:** Labcorp, B-Type Natriuretic Peptide (BNP) — https://www.labcorp.com/tests/140889/b-type-natriuretic-peptide-bnp
- **S16:** University of Iowa, CBC — https://www.healthcare.uiowa.edu/path_handbook/handbook/test299.html
- **S17:** University of Iowa, Platelet Count — https://www.healthcare.uiowa.edu/path_handbook/handbook/test1512.html
- **S18:** University of Iowa, 2023 INR reference-interval update — https://www.healthcare.uiowa.edu/path_handbook/lab_bulletins/archived/2023/LabBroadcast_8_1_23.html
- **S19:** University of Iowa, Activated Partial Thromboplastin Time — https://www.healthcare.uiowa.edu/path_handbook/handbook/test48.html
- **S20:** MedlinePlus, Arterial Blood Gas Test — https://medlineplus.gov/lab-tests/arterial-blood-gas-abg-test/
- **S21:** University of Iowa, AST with P5P — https://www.healthcare.uiowa.edu/path_handbook/handbook/test239.html
- **S22:** University of Iowa, ALT with P5P — https://www.healthcare.uiowa.edu/path_handbook/handbook/test71.html
- **S23:** University of Iowa, Bilirubin, Total — https://www.healthcare.uiowa.edu/path_handbook/handbook/test288.html
- **S24:** University of Iowa, Ammonia — https://www.healthcare.uiowa.edu/path_handbook/handbook/test126.html
- **S25:** University of Iowa, Critical Laboratory Tests and Values — https://www.healthcare.uiowa.edu/path_handbook/appendix/common/un_crit_lab_val.html
- **S26:** University of Iowa, Pediatric Reference Ranges — https://www.healthcare.uiowa.edu/path_handbook/appendix/heme/pediatric_normals.html
- **V1:** MedlinePlus, Vital Signs — https://medlineplus.gov/ency/article/002341.htm
- **V2:** NHLBI, High Blood Pressure Diagnosis — https://www.nhlbi.nih.gov/health/high-blood-pressure/diagnosis
- **V3:** NCBI Bookshelf, Cerebral Perfusion Pressure — https://www.ncbi.nlm.nih.gov/books/NBK537271/
- **V4:** MedlinePlus, Pulse Oximetry — https://medlineplus.gov/lab-tests/pulse-oximetry/
