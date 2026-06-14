# Currency Audit — Session 08
## Medium-Provenance GPT: Medication and Resuscitation

**Session ID:** 2026-06-13-Currency-08
**Track:** currency / OG
**Reviewing model:** Claude Sonnet 4.6 (claude-sonnet-4-6)
**Date:** 2026-06-13
**Producer constraint satisfied:** GPT-produced items reviewed by Claude (cross-model)
**Layer A baseline used:** 1,645 inventory records / 1,301 queue rows / 1,127 unique queued IDs

---

## Scope

| Cluster | IDs |
|---|---:|
| anticoagulation | 5 |
| dka_insulin | 2 |
| sepsis | 1 |
| stroke | 4 |
| burn_parkland | 3 |
| **Total** | **15** |

All items from `banks/gpt-canonical.json`.

**Source families consulted:**
FDA heparin labeling; current warfarin clinical pharmacology and ISMP guidance; 2024 ADA/AHA international hyperglycemic-crisis consensus; 2026 Surviving Sepsis Campaign / Sepsis-3 definitions; 2026 AHA/ASA acute ischemic stroke guidance; ASHA dysphagia practice guidance; ABA burn resuscitation guidance (Parkland formula project rule: preserve traditional 4 mL/kg/%TBSA wording).

---

## Session Header

| Field | Value |
|---|---|
| Audited IDs | 15 |
| FIX | 0 |
| REVIEW | 0 |
| CUT | 0 |
| No finding | 15 |
| Canonical banks edited | No |

---

## Anticoagulation Items (5)

### 1. `gpt_canonical_fib_heparin_rate_033` — bank path `questions[32]`

**Stem (en):** Heparin 1,200 units/hr; bag = 25,000 units/500 mL D5W. Calculate mL/hr.
**Rationale (correct.en):** Concentration = 25,000/500 = 50 units/mL. Rate = 1,200/50 = 24 mL/hr.

**Audit:** Arithmetic correct. Concentration and rate formula do not change with guidelines. **No finding.**

---

### 2. `gpt_visual_smoke_2026_06_12_fib_medlabel_heparin_rate_07` — bank path `questions[238]`

**Stem (en):** Heparin 1,000 units/hr from label showing 25,000 units/250 mL. Calculate mL/hr.
**Rationale (correct.en):** Concentration = 25,000/250 = 100 units/mL. Rate = 1,000/100 = 10 mL/hr.

**Audit:** Arithmetic correct. This visual item (medication label) reads from the visual stimulus; no guideline-volatile clinical threshold. **No finding.**

---

### 3. `gpt_u6_matrix_cloze_2026_06_09_matrix_heparin_safety_11` — bank path `questions[132]`

**Stem (en):** Continuous UFH infusion for PE: for each finding, continue routine monitoring vs. stop and notify.
**Correct keys:**
- r1 (therapeutic aPTT + small stable bruise) = c1 (continue)
- r2 (platelet count 45,000/mm3 after several days of heparin — large drop) = c2 (stop/notify) — HIT concern
- r3 (hematuria during infusion) = c2 (stop/notify)
- r4 (aPTT within therapeutic range) = c1 (continue)
- r5 (sudden severe neurologic symptoms) = c2 (stop/notify)

**Rationale (correct.en):** Therapeutic aPTT and small stable bruise can be monitored. A large platelet drop after several days suggests HIT, hematuria suggests bleeding, and sudden severe neurologic symptoms may indicate intracranial bleeding.

**Audit:** All clinical triggers for escalation align with current ASH anticoagulation and HIT guidelines (large drop in platelets after day 4–10, new bleeding, or neurologic change → hold and notify). **No finding.**

---

### 4. `gpt_canonical_sata_warfarin_teaching_061` — bank path `questions[60]`

**Stem (en):** Which instructions should the nurse include in warfarin teaching? Select all that apply.
**Correct (A, C, D, E — report bleeding, check with provider before ASA/NSAIDs, keep vitamin K consistent, soft toothbrush/electric razor).**
**Rationale (correct.en):** "Warfarin teaching focuses on consistent vitamin K, bleeding precautions, avoiding interacting drugs unless approved, and INR monitoring."

**Audit:** Current FDA warfarin labeling and ISMP warfarin guidance: consistent vitamin K intake (not elimination), bleeding precautions, drug interactions (ASA/NSAIDs), regular INR monitoring. The rationale and identified correct options align with current teaching. **No finding.**

---

### 5. `mc_warfarin_bleeding_teaching_018` — bank path `questions[17]`

**Stem (en):** "Which client statement indicates correct understanding of warfarin teaching?"
**Correct (option D = "I will use an electric razor and report unusual bleeding."):**
**Rationale (correct.en):** "Warfarin increases bleeding risk. Clients should use bleeding precautions and report bleeding; vitamin K intake should be consistent, not necessarily eliminated."

**Audit:** Electric razor and reporting unusual bleeding are correct warfarin safety behaviors. The rationale also clarifies that vitamin K should be consistent rather than eliminated (addressing the wrong answer "Green vegetables must be completely avoided"). All claims current. **No finding.**

---

## DKA / Insulin Items (2)

### 6. `mc_dka_priority_fluid_024` — bank path `questions[23]`

**Stem (en):** Client with DKA (glucose 520, confusion, dry mucous membranes, Kussmaul respirations). Which provider prescription should the nurse anticipate as an early priority?
**Correct (option = "Begin isotonic IV fluid replacement"):**
**Rationale (correct.en):** "DKA causes severe dehydration from osmotic diuresis. Early treatment includes isotonic fluids, followed by insulin and electrolyte management per protocol."

**Audit:** 2024 international hyperglycemic-crisis consensus statement (Diabetes Care) confirms isotonic crystalloid (0.9% NS) as first-line DKA resuscitation fluid before insulin initiation, with potassium correction assessed before insulin is started. Isotonic fluid as the early priority is current. **No finding.**

---

### 7. `gpt_u6_matrix_cloze_2026_06_09_matrix_potassium_shift_insulin_15` — bank path `questions[136]`

**Stem (en):** Client receiving IV insulin for severe hyperglycemia: for each finding, is it expected with insulin therapy or requires prompt follow-up?
**Correct keys:**
- r1 (falling potassium to hypokalemic levels) = c2 (prompt follow-up)
- r2 (improving glucose) = c1 (expected)
- r3 (dysrhythmias) = c2 (prompt follow-up)
- r4 (improving thirst) = c1 (expected)
- r5 (blood glucose drop requiring dextrose addition) = c2 (prompt follow-up)

**Rationale (correct.en):** "Insulin lowers glucose and shifts potassium into cells. Falling potassium to hypokalemic levels or dysrhythmias requires prompt follow-up before continuing or increasing insulin, while improving glucose and thirst are expected treatment responses."

**Audit:** 2024 consensus: hypokalemia (K < 3.5 mEq/L) should be corrected before insulin is started or escalated; dysrhythmias during insulin infusion require prompt evaluation; improving glucose and thirst are expected responses. The item does not cite a specific potassium threshold, using "hypokalemic levels" — this is appropriately conservative. **No finding.**

---

## Sepsis Item (1)

### 8. `gpt_canonical_cloze_sepsis_035` — bank path `questions[34]`

**Stem (en):** Complete the clinical judgment statement for a client with suspected sepsis.
**Rationale (correct.en):** "Fever, tachycardia, hypotension, infection, and new confusion suggest sepsis with impaired perfusion. Early escalation, cultures, fluids as prescribed, and antibiotics are time-sensitive."

**Audit:** The rationale uses non-specific but clinically sound language. The 2026 Surviving Sepsis Campaign and Sepsis-3 (2016) definitions support early cultures and antibiotics; the rationale avoids specific MAP or lactate thresholds that could become outdated. The approach of "escalate, cultures, fluids, antibiotics, time-sensitive" aligns with current guidance without over-specifying parameters. **No finding.**

---

## Stroke Items (4)

### 9. `mc_dysphagia_positioning_013` — bank path `questions[12]`

**Stem (en):** Client post-stroke coughs when drinking thin liquids. Which action should the nurse take first?
**Correct (option D = "Stop oral intake and notify the provider or speech therapist for swallowing evaluation"):**
**Rationale (correct.en):** "Coughing with thin liquids suggests aspiration risk. The nurse should stop oral intake until swallowing safety is evaluated."

**Audit:** 2026 AHA/ASA acute ischemic stroke guidance and current ASHA dysphagia practice: coughing on thin liquids = aspiration risk signal → stop oral intake → initiate formal swallowing evaluation. The response is individualized (rather than universally applying thickened liquids or chin-down posture without evaluation). **No finding.**

---

### 10. `sata_stroke_warning_signs_025` — bank path `questions[24]`

**Stem (en):** Which findings are warning signs of a possible stroke? Select all that apply.
**Correct (sudden difficulty speaking, sudden facial drooping, sudden severe headache, sudden arm weakness; excludes gradual hair thinning).**

**Audit:** Consistent with AHA FAST + "sudden severe headache without known cause" teaching. Hair thinning is a chronic finding unrelated to stroke. **No finding.**

---

### 11. `gpt_gap_2026_06_12_nonmcq_balanced_matrix_stroke_aspiration_rehab_10` — bank path `questions[251]`

**Stem (en):** Client with right-sided weakness, dysarthria, coughing on thin liquids during breakfast. Classify rehabilitation and aspiration-precaution interventions.
**Correct keys:**
- r1 (swallow screening / SLP evaluation before advancing oral intake) = c1 (appropriate)
- r2 (upright positioning) = c1 (appropriate)
- r3 (encourage thin liquids while coughing) = c2 (not appropriate)
- r4 (supervised mobility with therapy guidance) = c1 (appropriate)
- r5 (oral care) = c1 (appropriate)

**Audit:** 2026 AHA/ASA guideline: dysphagia screening before initiating oral intake in acute stroke; upright positioning; individualized texture modification rather than universal thin-liquid encouragement after aspiration signs. All keys appropriate. **No finding.**

---

### 12. `gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_stroke_rehab_10` — bank path `questions[263]`

**Stem (en):** Client with right-sided weakness and dysphagia; speech therapy recommends nectar-thick liquids, upright positioning, supervised swallowing strategies. Classify care-plan actions.
**Correct keys:**
- r1 (thin liquids via straw against SLP order) = c2 (not appropriate)
- r2 (upright positioning) = c1 (appropriate)
- r3 (rushing meals) = c2 (not appropriate)
- r4 (straw use with thin liquids against SLP order) = c2 (not appropriate)
- r5 (checking for pocketing and supervised mobility) = c1 (appropriate)

**Audit:** Item correctly frames the SLP's individualized plan (nectar-thick liquids, upright positioning) as the baseline, and identifies deviations from that plan as not appropriate. This aligns with the 2026 AHA/ASA recommendation that dysphagia interventions be individualized. **No finding.**

---

## Burn / Parkland Items (3)

*Note: Project Shrimp has an explicit rule to preserve traditional Parkland-formula (4 mL/kg/%TBSA) wording for all burn items. ABA's more recent starting-volume guidance is not substituted for items that explicitly name the traditional formula.*

### 13. `gpt_visual_smoke_2026_06_12_fib_burn_parkland_rate_01` — bank path `questions[232]`

**Stem (en):** 70 kg client; burn map shades anterior trunk (18%) + anterior left leg (9%) + anterior right leg (9%) = 36% TBSA. Rate for first 8 hours?
**Rationale (correct.en):** TBSA = 18 + 9 + 9 = 36%. Parkland = 4 × 70 × 36 = 10,080 mL/24h; half = 5,040 mL/8h; rate = 5,040/8 = **630 mL/hr**.

**Audit:** Arithmetic verified correct. Traditional Parkland formula preserved per project rule. **No finding.**

---

### 14. `gpt_visual_smoke_2026_06_12_mc_burn_tbsa_02` — bank path `questions[233]`

**Stem (en):** Adult burn: anterior head (4.5%) + entire left arm (anterior 4.5% + posterior 4.5% = 9%) = ?
**Correct (A = 13.5%):**
**Rationale (correct.en):** "4.5% + 9% = 13.5%."

**Audit:** Adult Rule of Nines: head anterior = 4.5%, full arm = 9%. Arithmetic correct. **No finding.**

---

### 15. `gpt_visual_smoke_2026_06_12_matrix_burn_regions_03` — bank path `questions[234]`

**Stem (en):** For each body region, indicate whether it is included in the shaded burn area.
**Correct keys:** r1 (posterior trunk) = included; r2 (full right arm) = included; r3 (anterior trunk) = not included; r4 (left arm) = not included.

**Audit:** Keys read from the visual stimulus (burn map). No guideline-sensitive clinical claim. **No finding.**

---

## No-Finding IDs

`gpt_canonical_fib_heparin_rate_033`, `gpt_visual_smoke_2026_06_12_fib_medlabel_heparin_rate_07`, `gpt_u6_matrix_cloze_2026_06_09_matrix_heparin_safety_11`, `gpt_canonical_sata_warfarin_teaching_061`, `mc_warfarin_bleeding_teaching_018`, `mc_dka_priority_fluid_024`, `gpt_u6_matrix_cloze_2026_06_09_matrix_potassium_shift_insulin_15`, `gpt_canonical_cloze_sepsis_035`, `mc_dysphagia_positioning_013`, `sata_stroke_warning_signs_025`, `gpt_gap_2026_06_12_nonmcq_balanced_matrix_stroke_aspiration_rehab_10`, `gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_stroke_rehab_10`, `gpt_visual_smoke_2026_06_12_fib_burn_parkland_rate_01`, `gpt_visual_smoke_2026_06_12_mc_burn_tbsa_02`, `gpt_visual_smoke_2026_06_12_matrix_burn_regions_03`

---

## Validation Confirmation

- Canonical banks were not edited during this session.
- No patches or cuts were executed.
- All 15 IDs accounted for: 15 no-finding.
