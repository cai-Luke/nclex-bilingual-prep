# Blocked-41 — TRIAGED (supersedes v1 worklist)

v1 grouped purely by the classifier's proposed topic and so propagated 8 misfires. Triaged against item
content below. Three disposition mechanisms + two vocabulary decisions.

## A. True category corrections — 14 items (category + topic write)
*These need a write that changes the `category` field (and sets the licensed topic) — distinct from the
topic-only Gemini-52 path. Route through the same dry-run → approve → `--allow-canonical` discipline.*

### A1 → recategorize to **Physiological Adaptation** (licenses **Burn Management**) — 6  (mirrors TBSA)
| id | current category | oldTopic |
|---|---|---|
| `burn_fib_tbsa_anterior_mix_01` | Reduction of Risk Potential | adult burn TBSA estimation |
| `burn_matrix_parkland_values_05` | Reduction of Risk Potential | burn Parkland calculation verification |
| `burn_mc_posterior_tbsa_07` | Reduction of Risk Potential | adult burn posterior surface TBSA |
| `gpt_visual_smoke_2026_06_12_fib_burn_parkland_rate_01` | Reduction of Risk Potential | adult burn resuscitation Parkland calculation |
| `gpt_visual_smoke_2026_06_12_mc_burn_tbsa_02` | Basic Care and Comfort | adult Rule of Nines TBSA estimation |
| `gpt_visual_smoke_2026_06_12_matrix_burn_regions_03` | Reduction of Risk Potential | adult Rule of Nines region recognition |

### A2 → recategorize to **Pharmacological and Parenteral Therapies** (licenses **Medication Safety & Admin**) — 8
*Injection-site route/technique recognition = parenteral administration, not infection control (answers Q6).*
| id | current category | oldTopic |
|---|---|---|
| `gpt_injection_smoke_2026_06_15_mc_intradermal_01` | Reduction of Risk Potential | Injection route recognition from skin cross-section |
| `gpt_injection_smoke_2026_06_15_mc_subcutaneous_02` | Reduction of Risk Potential | Injection route recognition from skin cross-section |
| `gpt_injection_smoke_2026_06_15_mc_intramuscular_03` | Reduction of Risk Potential | Injection route recognition from skin cross-section |
| `gpt_injection_smoke_2026_06_15_mc_intravenous_04` | Reduction of Risk Potential | Injection route recognition from skin cross-section |
| `gpt_injection_smoke_2026_06_15_mc_layer_highlight_05` | Reduction of Risk Potential | Target layer identification from visual |
| `gpt_injection_smoke_2026_06_15_sata_im_cues_06` | Reduction of Risk Potential | Injection visual cue interpretation |
| `gpt_injection_smoke_2026_06_15_matrix_subq_cues_07` | Reduction of Risk Potential | Injection visual cue interpretation |
| `gpt_injection_smoke_2026_06_15_matrix_route_match_08` | Reduction of Risk Potential | Visual technique analysis |

## B. Topic-licensing change — 19 items, NO per-item edit
*All 19 sit in clinically-correct categories (RRP / Physiological Adaptation). The only maternal topic is
`Maternal-Newborn Care & Teaching`, currently licensed ONLY under Health Promotion and Maintenance. Make it
**SHARED across Physiological Adaptation + Reduction of Risk Potential** (topics.ts `SHARED_TOPIC_CATEGORY`).
That one change licenses the topic in place — do NOT recategorize acute fetal/preeclampsia/PPH to HPM (answers Q5).*
| id | current category | oldTopic |
|---|---|---|
| `fhr_gemini_smoke_2026_06_13_01` | Reduction of Risk Potential | intrapartum fetal monitoring |
| `fhr_gemini_smoke_2026_06_13_02` | Reduction of Risk Potential | intrapartum fetal monitoring |
| `fhr_gemini_smoke_2026_06_13_03` | Reduction of Risk Potential | intrapartum fetal monitoring |
| `fhr_gemini_smoke_2026_06_13_04` | Reduction of Risk Potential | intrapartum fetal monitoring |
| `fhr_gemini_smoke_2026_06_13_05` | Reduction of Risk Potential | intrapartum fetal monitoring |
| `fhr_gemini_smoke_2026_06_13_06` | Reduction of Risk Potential | intrapartum fetal monitoring |
| `gpt_u6_matrix_cloze_2026_06_09_cloze_preeclampsia_magnesium_20` | Reduction of Risk Potential | Magnesium sulfate toxicity in preeclampsia |
| `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q1` | Reduction of Risk Potential | Late postpartum preeclampsia with severe features |
| `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q2` | Reduction of Risk Potential | Late postpartum preeclampsia with severe features |
| `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q3` | Reduction of Risk Potential | Late postpartum preeclampsia with severe features |
| `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q6` | Reduction of Risk Potential | Late postpartum preeclampsia with severe features |
| `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_bowtie` | Reduction of Risk Potential | Late postpartum preeclampsia with severe features |
| `gpt_pph_2026_06_16_case_01_q1` | Physiological Adaptation | Postpartum hemorrhage due to uterine atony |
| `gpt_pph_2026_06_16_case_01_q2` | Physiological Adaptation | Postpartum hemorrhage due to uterine atony |
| `gpt_pph_2026_06_16_case_01_q3` | Physiological Adaptation | Postpartum hemorrhage due to uterine atony |
| `gpt_pph_2026_06_16_case_01_q4` | Physiological Adaptation | Postpartum hemorrhage due to uterine atony |
| `gpt_pph_2026_06_16_case_01_q5` | Physiological Adaptation | Postpartum hemorrhage due to uterine atony |
| `gpt_pph_2026_06_16_case_01_q6` | Physiological Adaptation | Postpartum hemorrhage due to uterine atony |
| `gpt_pph_2026_06_16_case_01_bowtie` | Physiological Adaptation | Postpartum hemorrhage due to uterine atony |

## C. False positives — 8 items, DROP from category worklist → re-route
*Classifier misfires; each has a licensed topic available in its CURRENT category (so no recategorization).
Send to the 75-style GPT pass / 136 re-run. Two are blocked on the vocab gap in D2.*

| id | why it's a false positive | in-place resolution |
|---|---|---|
| `gpt_case_gap_2026_06_11_ostomy_literacy_part_2_matrix_findings` | ostomy teaching, not burn | Elimination & Comfort (stays Basic Care and Comfort) |
| `gpt_gap_jun12_matrix_pressure_injury_staging_01` | pressure injury, not burn | BLOCKED — no wound/skin topic exists (vocab gap) |
| `claude_cs_jun06_pressure_injury_bcc_01_part_1` | pressure injury, not burn | BLOCKED — no wound/skin topic exists (vocab gap) |
| `opus3_iv_potassium_safety_case_01_q6` | IV-K site complication, not burn | Medication Safety & Admin / Electrolyte Imbalances (stays Pharm) |
| `opus22_case_postpartum_intrusive_thoughts_01_q1` | postpartum mental health, not maternal-newborn | Mental Health Disorders (stays Psychosocial) |
| `opus22_case_postpartum_intrusive_thoughts_01_q2` | postpartum mental health, not maternal-newborn | Therapeutic Communication (stays Psychosocial) |
| `opus22_case_postpartum_intrusive_thoughts_01_q3` | postpartum mental health, not maternal-newborn | Mental Health Disorders (stays Psychosocial) |
| `opus1_case_discharge_med_rec_anticoag_01_q1` | discharge med reconciliation, not med-safety drift | Discharge Planning & Handoff (stays Management of Care) |

## D. Two vocabulary decisions for Luke (topics.ts / DECISIONS)
**D1 — Maternal-Newborn shared licensing.** Add Physiological Adaptation + Reduction of Risk Potential to the
licensed categories for `Maternal-Newborn Care & Teaching`. Unblocks all 19 in section B.

**D2 — Add a wound/skin topic (e.g., `Skin & Wound Care`).** There is currently NO canonical topic for
pressure injury / wound / skin care. This gap forces misfires (2 pressure-injury items above reached for
Burn Management) AND drives ~7 of the 75 unresolved abstentions ("skin/wound, no candidate fits"). Adding one
topic resolves that whole cluster — highest-leverage single decision in the residual.
