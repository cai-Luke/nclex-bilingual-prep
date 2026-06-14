# Currency Audit — Session 07
## Medium-Provenance GPT: Immunization / Screening + Isolation / Precautions

**Session ID:** 2026-06-13-Currency-07
**Track:** currency / OG
**Reviewing model:** Claude Sonnet 4.6 (claude-sonnet-4-6)
**Date:** 2026-06-13
**Producer constraint satisfied:** GPT-produced items reviewed by Claude (cross-model)
**Layer A baseline used:** 1,645 inventory records / 1,301 queue rows / 1,127 unique queued IDs
**Note:** Concurrent bank additions since Layer A generation — current count is 1,652 records (+7); Layer A recalibration deferred to return package note.

---

## Scope

**Cluster: immunization_screening** — 11 GPT medium-provenance IDs
**Cluster: isolation_precautions** — 12 GPT medium-provenance IDs
**Total audited: 23 unique IDs**

All items from `banks/gpt-canonical.json`.

**Source families consulted:**
USPSTF 2021 (lung cancer, colorectal), USPSTF 2024 (breast), USPSTF 2018 (cervical), USPSTF 2018 (osteoporosis); CDC 2019 Isolation Precautions / Appendix A (TB airborne, varicella, C. difficile, norovirus, scabies, meningococcal); ONS infection-prevention guidance; CDC PPE doffing sequence.

---

## Session Header

| Field | Value |
|---|---|
| Audited IDs | 23 |
| FIX | 0 |
| REVIEW | 2 |
| CUT | 0 |
| No finding | 21 |
| Canonical banks edited | No |

---

## Immunization / Screening Items (11)

### 1. `mc_colonoscopy_screening_009` — bank path `questions[8]`

**Stem (en):** "A 52-year-old client with no colorectal cancer screening history asks about prevention. Which recommendation should the nurse reinforce?"
**Correct answer (option D):** "Discuss colorectal cancer screening options with the health care provider."
**Rationale (correct.en):** "Adults in this age group should discuss recommended colorectal cancer screening options even without symptoms or family history."

**Audit:** USPSTF 2021 lowered the B-grade average-risk starting age to 45. A 52-year-old with no screening history should discuss options with their provider. The correct answer teaches appropriate engagement and debunks family-history gating (option C). The rationale is current. **No finding.**

---

### 2. `gpt_gap_jun11_fib_colorectal_screening_01` — bank path `questions[197]`

**Stem (en):** Starting age for average-risk colorectal cancer screening (b1) and normal colonoscopy interval (b2).
**Blanks:** b1 = 45 years; b2 = 10 years.
**Rationale (correct.en):** "Average-risk colorectal cancer screening begins at age 45. When colonoscopy is chosen and the result is normal, the usual repeat interval is 10 years."

**Audit:** Matches USPSTF 2021 Grade B (age 45, biennial or 10-year colonoscopy). **No finding.**

---

### 3. `gpt_gap_jun11_fib_cervical_screening_02` — bank path `questions[207]`

**Stem (en):** Cervical screening begins at age ____ (b1) and every ____ years (b2) for ages 21–29 when normal.
**Blanks:** b1 = 21; b2 = 3.
**Rationale (correct.en):** "For average-risk individuals with a cervix, cervical cancer screening begins at age 21. For ages 21 through 29, cytology alone every 3 years is the recommended screening interval when results are normal."

**Audit:** Matches USPSTF 2018 Grade A/B (ages 21–29: cytology every 3 years). **No finding.**

---

### 4. `gpt_gap_2026_06_10_b_fib_mammography_screening_06` — bank path `questions[170]`

**Stem (en):** Average-risk breast cancer screening: when to begin and frequency.
**Rationale (correct.en):** "For average-risk women, current USPSTF guidance recommends screening mammography beginning at age 40 and continuing every 2 years through age 74. Individual risk factors may require provider-specific recommendations."

**Audit:** USPSTF 2024 final recommendation (Grade B) recommends biennial screening for all women starting at age 40. The item's claim ("age 40, every 2 years, through age 74") is consistent — the 2024 update found sufficient evidence through 74 and insufficient evidence beyond that. **No finding.**

---

### 5. `gpt_gap_2026_06_10_b_fib_lung_screening_07` — bank path `questions[171]`

**Rationale (correct.en):** "Routine annual low-dose CT screening is recommended for adults ages 50 to 80 who have a 20 pack-year smoking history and currently smoke or quit within the past 15 years."

**Audit:** Matches USPSTF 2021 Grade B (ages 50–80, ≥20 pack-years, current smoker or quit within 15 years). **No finding.**

---

### 6. `gpt_gap_jun11_fib_lung_cancer_screening_03` — bank path `questions[217]`

**Blanks:** b1 = 20 pack-years; b2 = 80.
**Rationale (correct.en):** "USPSTF recommends annual low-dose CT screening for adults ages 50 through 80 with at least a 20 pack-year smoking history who currently smoke or quit within the past 15 years."

**Audit:** Same source as item 5; values consistent. **No finding.**

---

### 7. `gpt_gap_jun11_matrix_osteoporosis_prevention_02` — bank path `questions[208]`

**Stem (en):** A 66-year-old woman: classify fracture-prevention recommendations.
**Correct keys:** r1 (DXA screening) = c1 evidence-based; r2 (weight-bearing/strengthening exercise) = c1; r3 (smoking cessation + alcohol moderation) = c1; r4 (avoid ALL activity) = c2 not recommended; r5 (calcium/vitamin D as part of broader plan) = c1; r6 (supplements alone instead of exercise) = c2 not recommended.

**Audit:** USPSTF 2018 recommends osteoporosis screening with DXA for women ≥65 (and younger women with risk factors). All row keys are clinically appropriate. The r5 qualifier "as part of a broader prevention plan" avoids over-claiming supplement efficacy. **No finding.**

---

### 8. `gpt_gap_2026_06_10_or_colorectal_screening_access_05` — bank path `questions[151]`

**Stem (en):** 46-year-old adult with barriers to CRC screening. Place nurse actions in priority order.
**Correct sequence:** Confirm eligibility and permission (A) → Assess barriers (B) → Provide interpreter-supported education (C) → Connect with resources (D) → Set follow-up (E).
**Rationale (correct.en):** Nurse verifies screening appropriateness, provides language-concordant education, identifies barriers, connects with services, and plans follow-up.

**Audit:** The 46-year-old is within the current average-risk screening window (USPSTF 2021 Grade B, start at 45). The sequence reflects standard community health nursing practice; no volatile clinical thresholds. **No finding.**

---

### 9. `gpt_canonical_or_colonoscopy_prep_101` — bank path `questions[100]`

**Stem (en):** Colonoscopy prep teaching: place in best sequence.
**Correct sequence:** Review medication instructions and bowel-prep schedule (A) → Have a responsible adult available to drive home (B) → Stop oral intake for specified time (C) → Follow clear-liquid and bowel-prep instructions as prescribed (D).

**Audit:** No specific guideline-sensitive claim; the sequence correctly sequences pre-procedure planning before the prep itself, and the driver requirement before NPO timing is a reasonable clinical education sequence. **No finding.**

---

### 10. `gpt_visual_smoke_2026_06_12_fib_device_enteral_duration_10` — bank path `questions[241]`

**Rationale (correct.en):** Pump rate 60 mL/hr, VTBI 240 mL → 240 ÷ 60 = 4 hours.
**Audit:** Mathematical calculation, not guideline-dependent. **No finding.**

---

### 11. `gpt_visual_smoke_2026_06_12_matrix_device_pca_basal_09` — bank path `questions[240]`

**Correct key:** r1 (basal infusion setting) = follow_up; r2–r4 (drug, demand dose, lockout) = expected_setting (routine verify).
**Rationale (correct.en):** Basal opioid delivery increases oversedation and respiratory depression risk in opioid-naive clients; verify against order and policy before continuing.

**Audit:** Current ISMP and AAPM/ASA guidance identifies basal infusions in opioid-naive patients as a high-alert PCA safety concern. **No finding.**

---

## Isolation / Precautions Items (12)

### 12. `mc_airborne_tb_precautions_004` — bank path `questions[3]`

**Correct (option A):** "Place the client in a private negative-pressure room."
**Rationale (correct.en):** "Suspected tuberculosis requires airborne precautions, including a negative-pressure room and N95 respirator use by staff."

**Audit:** Current CDC guidance: suspected pulmonary TB requires airborne infection isolation room (AIIR) with negative pressure and N95-level respirator for staff. Placing the client in the AIIR is the first priority action (correct). **No finding.**

---

### 13. `gpt_gap_jun11_sata_tb_airborne_precautions_01` — bank path `questions[192]`

**Correct (A, B, C, D, E; excludes F):**
- A: fit-tested N95 or higher for staff ✓
- B: surgical mask for medically necessary transport ✓
- C: isolation room door closed ✓
- D: notify infection prevention ✓
- E: negative-pressure AIIR ✓
- F (excluded): droplet precautions / surgical mask for staff — incorrect for active TB

**Audit:** Consistent with CDC TB transmission-based precautions; N95 required for staff (not surgical mask), negative-pressure room required, surgical mask on patient during transport. **No finding.**

---

### 14. `gpt_gap_jun11_sata_varicella_precautions_02` — bank path `questions[202]`

**Correct (A, B, C, D, E; excludes F "droplet alone"):**
- A: airborne + contact precautions ✓
- B: negative-pressure AIIR if available ✓
- C: N95 or higher if not immune ✓
- D: surgical mask + cover lesions during essential transport ✓
- E: gown and gloves for direct care ✓

**Audit:** Current CDC guidance: varicella (chickenpox) = Airborne + Contact precautions. Droplet alone is insufficient. **No finding.**

---

### 15. `gpt_gap_jun11_sata_meningococcal_droplet_03` — bank path `questions[212]`

**Correct (A, B, C, E; excludes D "negative-pressure room + N95" and F "discontinue when fever improves"):**
- A: private room with Droplet + Standard Precautions ✓
- B: surgical mask for close contact ✓
- C: continue until ≥24 hours after effective antimicrobial therapy ✓
- E: notify infection prevention for PEP evaluation ✓
- D (excluded): negative-pressure room + N95 — this is airborne, not needed for meningococcal ✓
- F (excluded): discontinue on fever improvement alone — incorrect (minimum 24h after antibiotics) ✓

**Audit:** Current CDC guidance: meningococcal meningitis = Droplet Precautions until ≥24h after effective antibiotics; no negative-pressure room or N95 required for routine care. The item correctly distinguishes droplet from airborne isolation. **No finding.**

---

### 16. `gpt_canonical_matrix_meningitis_precautions_105` — bank path `questions[104]`

**Rows/correct:**
- r1 "Place on droplet precautions" → c1 Appropriate ✓
- r2 "Surgical mask for close care" → c1 Appropriate ✓
- r3 "Use only standard precautions (not transmissible)" → c2 Inappropriate ✓
- r4 "Limit close exposure until effective therapy per policy" → c1 Appropriate ✓

**Audit:** Consistent with CDC meningococcal Droplet Precautions guidance. **No finding.**

---

### 17. `gpt_canonical_mc_cdiff_precautions_080` — bank path `questions[79]`

**Correct (option D):** "Use contact precautions and wash hands with soap and water after care."
**Rationale (correct.en):** "C. difficile requires contact precautions. Soap and water are preferred after care because spores are not reliably removed by alcohol hand rub alone."

**Audit:** Current CDC C. difficile guidance: contact precautions; soap and water required (ABHR does not reliably remove spores). **No finding.**

---

### 18. `gpt_canonical_cloze_scabies_precautions_106` — bank path `questions[105]`

**Cloze:** "initiate [contact precautions] and ensure [close contacts and linens are managed according to policy]."
**Rationale (correct.en):** "Scabies spreads through prolonged skin contact and contaminated linens or clothing. Contact precautions, treatment of affected people and close contacts per policy, and linen management reduce spread."

**Audit:** Current CDC guidance: contact precautions for scabies; treatment of case and close contacts. No specific duration after treatment is claimed, which is appropriate given facility-policy variability. **No finding.**

---

### 19. `gpt_canonical_or_norovirus_outbreak_108` — bank path `questions[107]`

**Correct sequence:** A (assess clients) → B (contact precautions + soap-and-water HH) → C (notify infection prevention) → D (environmental cleaning with appropriate disinfectant).
**Rationale (correct.en):** Client stability assessed first; isolation and hand hygiene reduce spread; infection prevention guides outbreak; environmental cleaning controls contamination.

**Audit:** Soap-and-water hand hygiene for norovirus is current (ABHR does not reliably inactivate norovirus). Contact precautions are appropriate. The clinical sequence prioritizes client safety (assess first), then transmission control. **No finding.**

---

### 20. `gpt_canonical_mc_sterile_field_048` — bank path `questions[47]`

**Correct (option B):** "Discard the field and set up a new sterile field."
**Rationale (correct.en):** "A sterile field must remain in view. If the nurse turns away, the field is considered contaminated and should be replaced."

**Audit:** Standard sterile technique; not guideline-volatile. **No finding.**

---

### 21. `gpt_u6_matrix_cloze_2026_06_09_matrix_infection_precautions_02` — bank path `questions[123]`

**Correct keys:** r1 (disseminated varicella) = airborne+contact (c1); r2 (pertussis) = droplet (c2); r3 (C. difficile) = contact (c3); r4 (severe neutropenia) = protective precautions (c4).

**Audit:** All assignments consistent with current CDC transmission-based precautions. **No finding.**

---

### 22. `gpt_canonical_cloze_neutropenia_038` — bank path `questions[37]` — **REVIEW**

**Bank evidence (verbatim):**
- `clozeStem.en`: "The nurse should place the client in {{1}} and avoid {{2}}."
- Dropdown 2 correct option (o1): `"fresh flowers and raw produce"`
- `rationale.correct.en`: "Severe neutropenia requires infection-prevention measures that reduce exposure to organisms. Fresh flowers, plants, and raw foods can carry microbes."
- `rationale.correct.zh`: "严重中性粒细胞减少需要采取减少接触病原体的感染预防措施。鲜花、植物和生食可能携带微生物。"

**Clinical claim:** Categorical avoidance of "fresh flowers and raw produce" is taught as the correct protective action for ANC 400/mm3.

**Current guidance:**
- CDC Protective Environment guidance (2019 Isolation Precautions Appendix A): recommends avoiding plants and flowers in PE rooms due to potential fungal spore contamination. The flower restriction is specifically supported.
- ONS Oncology Nursing Society (2023): The evidence for categorical restriction of fresh raw produce in neutropenic patients is weak and practices are institution-specific. Contemporary ONS guidance does not universally mandate a neutropenic diet (low-bacteria diet) for all patients.
- IDSA/SHEA (2013 update, confirmed in subsequent guidance): Low-bacteria neutropenic diet has insufficient evidence to recommend as a universal standard; facility-specific policies apply.

**Alternative interpretation:** The item conflates two restrictions with different evidence bases. Avoiding fresh flowers in PE rooms has specific CDC support; avoiding all raw produce is institution-specific with weak evidence. The cloze options do not offer a nuanced alternative ("fresh flowers" without "and raw produce"), so no FIX can be proposed that works within the current option structure.

**Verdict:** REVIEW
**Confidence:** MEDIUM
No fix proposed. The item should be reviewed by a clinical content expert to determine whether the "avoid raw produce" component should be softened to facility-policy–specific language or whether the cloze structure should be revised to separate flower restriction from raw-produce teaching.

---

### 23. `gpt_canonical_or_ppe_doffing_104` — bank path `questions[103]` — **REVIEW**

**Bank evidence (verbatim):**
- `correct`: ["A", "B", "C", "D", "E"]
  - A = "Remove gloves" (first)
  - B = "Remove goggles" (second)
  - C = "Remove gown" (third)
  - D = "Remove mask" (fourth)
  - E = "Perform hand hygiene" (fifth / last)
- `rationale.correct.en`: "The CDC recommended standard sequence for doffing is: Gloves are removed first as they are the most contaminated. Goggles are removed next, followed by the gown and the mask. Hand hygiene (E) is performed as the final step immediately after removing all PPE."
- `testTakingStrategy.en`: "Remember the standard alphabetical doffing sequence: G-G-G-M (Gloves, Goggles, Gown, Mask), followed by hand hygiene."

**Clinical claim:** PPE doffing sequence is Gloves → Goggles → Gown → Mask → Hand hygiene (last).

**Current guidance:**
- CDC 2019 "Guidelines for Isolation Precautions: Preventing Transmission of Infectious Agents in Healthcare Settings" (Appendix A, Table 4): Recommended doffing sequence is Gloves → Gown → Hand hygiene → Face protection (goggles/face shield) → Mask/respirator → Hand hygiene. Gown precedes goggles; intermediate hand hygiene follows gown removal.
- CDC "How to Put on and Take Off Your PPE" (2020 update): Gloves (optionally with gown) → Hand hygiene → Face shield/goggles → Mask → Hand hygiene.

**Differences from bank:**
1. The item teaches Goggles before Gown; CDC 2019 recommends Gown before Goggles.
2. The item has no intermediate hand hygiene step; CDC recommends hand hygiene after gloves/gown before removing face protection.
3. The `testTakingStrategy` mnemonic "G-G-G-M" embeds the non-CDC sequence.

**Alternative interpretation:** Multiple CDC documents have slight variations. Several nursing education resources and NCLEX prep materials teach simplified sequences that place hand hygiene only at the end. For NCLEX purposes the most consequential principle (gloves first, hand hygiene before exit) may be preserved. The Goggles/Gown ordering has lower clinical consequence than missing intermediate hand hygiene.

**Verdict:** REVIEW
**Confidence:** MEDIUM
No fix proposed. The item should be reviewed against the most current CDC PPE doffing reference used by the project's clinical sources to determine whether the sequence requires updating. Any fix would need to revise `correct`, `rationale.correct` (en + zh), and `testTakingStrategy` (en + zh) together.

---

## No-Finding IDs

`mc_colonoscopy_screening_009`, `gpt_gap_jun11_fib_colorectal_screening_01`, `gpt_gap_jun11_fib_cervical_screening_02`, `gpt_gap_2026_06_10_b_fib_mammography_screening_06`, `gpt_gap_2026_06_10_b_fib_lung_screening_07`, `gpt_gap_jun11_fib_lung_cancer_screening_03`, `gpt_gap_jun11_matrix_osteoporosis_prevention_02`, `gpt_gap_2026_06_10_or_colorectal_screening_access_05`, `gpt_canonical_or_colonoscopy_prep_101`, `gpt_visual_smoke_2026_06_12_fib_device_enteral_duration_10`, `gpt_visual_smoke_2026_06_12_matrix_device_pca_basal_09`, `mc_airborne_tb_precautions_004`, `gpt_gap_jun11_sata_tb_airborne_precautions_01`, `gpt_gap_jun11_sata_varicella_precautions_02`, `gpt_gap_jun11_sata_meningococcal_droplet_03`, `gpt_canonical_matrix_meningitis_precautions_105`, `gpt_canonical_mc_cdiff_precautions_080`, `gpt_canonical_cloze_scabies_precautions_106`, `gpt_canonical_or_norovirus_outbreak_108`, `gpt_canonical_mc_sterile_field_048`, `gpt_u6_matrix_cloze_2026_06_09_matrix_infection_precautions_02`

---

## Validation Confirmation

- Canonical banks were not edited during this session.
- No patches or cuts were executed.
- REVIEW verdicts are proposals only; no fix values are provided because no concrete bilingual cure was identified.
- All 23 IDs accounted for: 21 no-finding + 2 REVIEW = 23.
