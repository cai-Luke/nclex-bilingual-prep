# Content Review Spec — Batch Promoted 2026-06-13

These questions were promoted through the structural gate (`validate-bank`, `selfCheck`, `audit`) but were **not reviewed for clinical accuracy, bilingual parity, or answer unambiguity** before promotion. This spec is for a future review pass.

## Context

- Gate passed: schema valid, derived values match, no positional-language hazards, shuffle/normalization integrity confirmed.
- What the gate does NOT check: whether the keyed answer is clinically correct, whether distractors are defensible, whether zh translation is accurate and appropriately precise, whether visuals are necessary and non-decorative.
- All questions are now in the canonical banks (see locations below). Do NOT hand-edit promoted files — if a question needs correction, fix the source and re-promote, or make a targeted edit and re-run `npm run audit`.

## How to pull a question

```sh
# Find a question by ID across all banks
grep -r '"id": "QUESTION_ID"' banks/*.json
```

Or load the bank file directly and filter by ID.

## Review criteria (apply to every question)

1. **Correct answer is correct.** Verify the keyed answer against current clinical guidelines (AHA, ISMP, TJC, AWHONN, etc. as appropriate). For calculations, re-derive by hand.
2. **Distractors are defensible.** Wrong answers should be plausible but unambiguously wrong. A distractor that a reasonable nurse could defend on boards is a content defect.
3. **Answer is unambiguous.** If a question has a "best answer" dependency on missing context, or if more than one option could be defended, flag it.
4. **Bilingual parity.** Read the `zh` stem and options against the `en` version. Flag omissions, additions, or paraphrase that changes clinical meaning. Chinese speech marks (`"..."`) are U+201C/U+201D — correct as content, do not alter.
5. **For case studies:** verify that each stage's exhibit is consistent with the clinical arc across all three stages, and that question keys don't contradict each other within the same case.
6. **For calculation questions (FIB, medication label, burn map, etc.):** re-derive the answer. The `selfCheck` validates schema arithmetic but not whether the clinical setup is realistic.

## Output format

For each defect found:

```
ID: <question_id>
Bank: <bank_filename>
Defect type: [wrong_key | ambiguous | distractor_defensible | zh_parity | clinical_setup | other]
Severity: [critical | moderate | minor]
Finding: <one paragraph describing the issue>
Proposed fix: <specific change or "needs SME review">
```

If a question passes all criteria, no entry needed — only log defects.

---

## Priority 1 — Opus case studies (highest risk: multi-stage arcs, high-acuity scenarios)

**Bank:** `banks/hard-cases-canonical.json`

| ID | Topic |
|---|---|
| `opus1_case_discharge_med_rec_anticoag_01` | discharge medication reconciliation (anticoagulation) |
| `opus2_case_postop_opioid_respiratory_depression_01` | opioid-induced respiratory depression |
| `opus3_iv_potassium_safety_case_01` | IV potassium replacement safety |
| `opus4_case_postop_sbar_01` | postoperative deterioration / SBAR escalation |
| `opus5_case_consent_interpreter_01` | informed consent with interpreter services |
| `opus12_case_inpatient_suicide_risk_01` | inpatient suicide risk and safety precautions |
| `opus_case_warfarin_bridge_01` | warfarin–enoxaparin bridge therapy |

Each is a `case_study` item with a `caseStudy` object containing 3 stages and a `questions` array of sub-questions. Pull the full item to review — the stages (clinical narrative) and the sub-questions (answer keys) must both be evaluated.

High-risk topics in this set: IV potassium (ISMP high-alert), opioid respiratory depression, warfarin bridging (anticoagulation dosing and hold parameters), suicide safety precautions. Errors here have direct patient-safety analogues.

---

## Priority 2 — GPT case studies and NGN items

**Bank:** `banks/gpt-canonical.json` — last 25 questions appended 2026-06-13

### Case studies (4 from batch-a, 4 from batch-b)

| ID | Topic |
|---|---|
| `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01` | home oxygen safety, COPD discharge |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02` | post-fall assessment, LTC escalation |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03` | pressure injury, nutritional support |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04` | delirium prevention, family education |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01` | opioid safety and respiratory reassessment |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02` | interpreter-supported consent |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03` | pediatric dehydration, ORS teaching |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04` | home health wound care, teach-back |
| `gpt_2026_06_13_case_delirium_uti_01` | delirium superimposed on dementia, UTI |

### NGN standalone items (matrix, ordered_response, fill_in_blank, dropdown_cloze)

| ID | Type | Topic |
|---|---|---|
| `gpt_gap_2026_06_12_nonmcq_balanced_matrix_opioid_sedation_05` | matrix | opioid sedation reassessment |
| `gpt_gap_2026_06_12_nonmcq_balanced_or_interpreter_discharge_06` | ordered_response | interpreter consent workflow |
| `gpt_gap_2026_06_12_nonmcq_balanced_fib_pediatric_ors_07` | fill_in_blank | pediatric ORS volume |
| `gpt_gap_2026_06_12_nonmcq_balanced_cloze_food_med_access_08` | dropdown_cloze | food insecurity referral |
| `gpt_gap_2026_06_12_nonmcq_balanced_or_contact_precautions_diarrhea_09` | ordered_response | contact precautions sequence |
| `gpt_gap_2026_06_12_nonmcq_balanced_matrix_stroke_aspiration_rehab_10` | matrix | stroke rehab with aspiration precautions |
| `gpt_gap_2026_06_12_nonmcq_balanced_cloze_palliative_coping_11` | dropdown_cloze | palliative symptom management |
| `gpt_gap_2026_06_12_nonmcq_balanced_fib_wound_teachback_12` | fill_in_blank | wound care teach-back |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_fib_io_balance_05` | fill_in_blank | I&O net balance calculation |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_fib_pressure_area_trend_06` | fill_in_blank | pressure injury wound area |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_cloze_food_med_access_07` | dropdown_cloze | food insecurity referral |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_cloze_palliative_coping_08` | dropdown_cloze | palliative dyspnea, family coping |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_contact_diarrhea_09` | matrix | contact precautions |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_stroke_rehab_10` | matrix | stroke rehab, aspiration |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_or_home_oxygen_setup_11` | ordered_response | home oxygen equipment setup |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_or_stool_specimen_contact_12` | ordered_response | stool specimen under contact precautions |

Note: batch-a and batch-b contain parallel NGN items on the same topics (opioid safety, interpreter consent, peds dehydration, wound care, etc.) — check that the paired items aren't subtly contradicting each other in their answer keys.

---

## Priority 3 — MAR visual questions

**Bank:** `banks/mar-canonical.json` (all 8 questions are new)

| ID | Topic |
|---|---|
| `mar_av_nodal_blockers_1600_01` | AV nodal blocker administration safety |
| `mar_lispro_meal_delayed_02` | rapid-acting insulin with delayed meal |
| `mar_enoxaparin_prior_held_03` | enoxaparin when prior dose held |
| `mar_acetaminophen_duplicate_products_04` | acetaminophen duplicate therapy check |
| `mar_opioid_benzodiazepine_due_05` | opioid + benzodiazepine co-administration |
| `mar_warfarin_antibiotic_bleeding_06` | warfarin + antibiotic interaction |
| `mar_missed_antibiotic_followup_07` | missed dose follow-up workflow |
| `mar_digoxin_low_pulse_due_08` | digoxin administration with low apical pulse |

MAR items involve high-alert medications (opioids, anticoagulants, digoxin, insulin). Verify: hold parameters are correct, interaction flags match current guidance, and the scenario's MAR visual data is internally consistent with the stem.

---

## Priority 4 — FHR visual questions (specialized domain)

**Bank:** `banks/gemini-canonical.json` — last 6 questions appended 2026-06-13

| ID | Type |
|---|---|
| `fhr_gemini_smoke_2026_06_13_01` | multiple_choice |
| `fhr_gemini_smoke_2026_06_13_02` | multiple_choice |
| `fhr_gemini_smoke_2026_06_13_03` | multiple_choice |
| `fhr_gemini_smoke_2026_06_13_04` | select_all |
| `fhr_gemini_smoke_2026_06_13_05` | matrix |
| `fhr_gemini_smoke_2026_06_13_06` | matrix |

All are `intrapartum fetal monitoring` topic. AWHONN/NICHD strip interpretation — verify category assignments and intervention priorities match current NICHD 3-tier classification. The visual (rhythm_strip kind) was rendered correctly by selfCheck; review is for clinical interpretation accuracy.

---

## Priority 5 — Medication label and calculation questions

**Bank:** `banks/medlabel-canonical.json` (all 8 questions are new)

| ID | Topic |
|---|---|
| `medlbl_heparin_infusion_rate_001` | heparin infusion rate |
| `medlbl_morphine_iv_volume_002` | morphine IV dose volume |
| `medlbl_potassium_chloride_rate_003` | KCl infusion rate |
| `medlbl_enoxaparin_volume_004` | enoxaparin subcutaneous volume |
| `medlbl_digoxin_tablets_005` | digoxin tablet count |
| `medlbl_cephalexin_capsules_006` | cephalexin capsule count |
| `medlbl_furosemide_matrix_007` | IV furosemide dose/volume matrix |
| `medlbl_regular_insulin_volume_008` | regular insulin volume |

Arithmetic is validated by selfCheck. Review focus: are the label values (concentration, dose, volume) clinically realistic? Are the ordered doses within normal therapeutic ranges for the clinical context given?

---

## Priority 6 — Other visual-kind questions (lower clinical risk)

Arithmetic validated by selfCheck. Review focus is clinical plausibility of the scenario data and correctness of interpretation questions, not the calculations themselves.

**`banks/burn-canonical.json`** (8q): `burn_fib_tbsa_anterior_mix_01` through `burn_fib_parkland_first8h_leg_arm_08` — Parkland formula and TBSA estimation. Verify rule-of-nines values in visual match stem, Parkland volumes are correct for stated weight and TBSA.

**`banks/device-canonical.json`** (8q): `dev_pca_basal_opioid_naive_01` through `dev_high_alert_kcl_pump_mismatch_01` — PCA pump settings and infusion pump scenarios. Verify PCA parameters (basal rate, demand dose, lockout) are within institutional-range plausibility for opioid-naive patients.

**`banks/io-canonical.json`** (8q): `io_fib_hf_net_balance_01` through `io_matrix_bowel_prep_deficit_08` — fluid balance calculations and clinical interpretation. Verify net balance arithmetic against visual data, clinical framing of deficit/overload is accurate.

---

## Suggested review order

1. opus case studies (7 items — read full caseStudy objects including all stages)
2. MAR questions (8 items — high-alert meds)
3. GPT case studies (9 items)
4. FHR questions (6 items — requires intrapartum interpretation expertise)
5. GPT NGN standalones (16 items)
6. Medication label calculations (8 items)
7. Burn/device/IO visual questions (24 items)

Total: ~78 questions. A full pass at clinical depth should take 3–4 hours. If time is limited, stop after priority 3 — the remaining items have lower patient-safety stakes and the arithmetic is already machine-verified.
