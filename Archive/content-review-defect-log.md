# Content Review Defect Log

## Date: 2026-06-13
## Review Phase: Priority 2 (GPT Case Studies & NGN Standalones)

### Finding: Widespread Inverted Matrix Answer Keys

During the review of the 25 GPT Priority 2 items, a systematic defect was discovered in almost all of the generated `matrix` questions. The `columnIds` in the `Correct` answer arrays are perfectly inverted, meaning the correct answers map exactly opposite to their intended columns according to the provided rationales and clinical safety standards.

#### Impacted Questions:
1. `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q2`
2. `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q1`
3. `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q1`
4. `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q2`
5. `gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_contact_diarrhea_09`
6. `gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_stroke_rehab_10`
7. `gpt_2026_06_13_case_delirium_uti_01_q1`
8. `gpt_2026_06_13_case_delirium_uti_01_q4`

*Note: Some matrix questions (e.g., `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q1`, `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03_q1`, `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q1`) were structured correctly.*

#### Required Remediation:
The `correct` array for these matrix questions in `banks/gpt-canonical.json` must be patched. For each of the affected questions, all `c1` references in the correct mappings need to be changed to `c2`, and vice versa, without altering the order of the actual columns to maintain consistency with the stem and rationale.

Other than this systematic matrix key inversion, the clinical scenarios, distractors, translations, and remaining item types (e.g., cloze, ordered response, multiple choice) met the criteria established in `content-review-spec-2026-06-13.md`.

### Finding: Inverted Matrix Answer Key in FHR Batch

During the review of the Priority 4 FHR items (gemini-canonical.json), an inverted matrix key was found in `fhr_gemini_smoke_2026_06_13_06`. The rationale indicates a Category III tracing, but the answers in the matrix are completely swapped.

#### Required Remediation:
The `correct` array for `fhr_gemini_smoke_2026_06_13_06` must be patched to swap c1 and c2.

### Finding: Inverted Matrix Answer Key in IO Batch

During the review of the Priority 6 IO items (io-canonical.json), an inverted matrix key was found in `io_matrix_prerenal_aki_recheck_04`. The rationale indicates certain actions are appropriate, but the matrix answers are mapped inversely.

#### Required Remediation:
The `correct` array for `io_matrix_prerenal_aki_recheck_04` must be patched to swap c1 and c2.

---

## Addendum: 2026-06-13 — Claude Second-Pass Resolution

Second-pass review (Claude) performed after Gemini's first-pass review above. Findings on Gemini's claimed fixes:

### GPT matrix inversions (8 items — Priority 2)
Not independently re-verified in this pass. Gemini reported fixes applied to `gpt-canonical.json`. Priority 2 was deferred from the Claude second-pass scope.

### FHR `fhr_gemini_smoke_2026_06_13_06` — **Re-fixed 2026-06-13**
Gemini's claimed fix was **not applied correctly** — all 4 matrix rows remained inverted when the Claude second-pass read the file. Re-fixed directly in `banks/gemini-canonical.json` via Node.js. Columns: c1=True / c2=False.

Correct key after fix:
- r1 → c1 (variability IS absent = True)
- r2 → c2 (baseline NOT in normal range — 95 bpm is bradycardia, not 110–160 = False)
- r3 → c2 (NOT predictive of NORMAL acid-base — Category III = abnormal acid-base = False)
- r4 → c1 (DOES require immediate resuscitation = True)

Validation passed: `gemini-canonical.json OK (777 questions)`.

### IO `io_matrix_prerenal_aki_recheck_04` — **Re-fixed 2026-06-13**
Gemini's claimed fix was **not applied correctly** — all 4 matrix rows remained inverted when the Claude second-pass read the file. Re-fixed directly in `banks/io-canonical.json` via Node.js. Columns: c1=Appropriate interpretation / c2=Inappropriate interpretation.

Correct key after fix:
- r1 → c1 (notify provider: urine output goal not met = Appropriate)
- r2 → c1 (intake 1,120 mL > output 210 mL = positive balance = Appropriate interpretation)
- r3 → c2 (increase fluids because "negative balance" — false premise: balance is +910 mL POSITIVE = Inappropriate)
- r4 → c1 (monitor lung sounds while fluid management considered = Appropriate)

Validation passed: `io-canonical.json OK (8 questions)`.

Full audit after both fixes: GATE PASSED (all tiers).
