# Gemini Adjudication Report & 42-Row Reconciliation

Status: **FINALIZED ADJUDICATION REPORT — independently verified**

Gate-seat follow-up: the independent gate accepted 40 Gemini dispositions, held row 23, and revised
row 34 to PA / `Cardiovascular Disorders` because the matrix spans burn, septic, and cardiogenic
shock rather than the Burn Management rollup. The gate result supersedes this report for execution;
see `BURN-MANAGEMENT-TOPIC-AUDIT-GATE-HANDOFF-2026-07-16.md`.

This report presents the independent adjudication of the 42 burn-related questions in the NCLEX prep banks. Each item has been audited against the stems, keys, and specific page numbers of the **NCSBN 2026 NCLEX-RN Test Plan**.

## Explicit Rulings

1. **Row 18 (`gemini_u5_fib_or_2026_06_09_fib_tbsa_04`)**: Retagged from **Physiological Adaptation (PA)** to **Reduction of Risk Potential (RRP)**. This reverses the June 16 architect ruling. Estimating %TBSA (anterior trunk 18% + right arm 9% = 27%) is a pure assessment/measurement function without any active treatment intervention or calculation of medication/IV rates. In the NCSBN 2026 Test Plan, this is a *System-Specific Assessment* (p. 44) under RRP.
2. **Row 23 (`gpt_visual_smoke_2026_06_12_matrix_burn_regions_03`)**: Rule **HOLD**. This matrix item asks the student to read the diagram and check whether specific regions are included. It requires no clinical judgment, no Rule of Nines math, and no clinical interpretation; it behaves as a diagram/renderer smoke test rather than an NCLEX item. It is marked as `burn_rollup_eligible: contested` and kept on its off-canonical topic string to exclude it from the active rollup.
3. **Rows 26 & 27 (Airway Inhalation Cues)**: **Split** based on the keyed nursing construct:
   - **Row 26 (`gpt_fmtgap_2026_07_14_hl_burn_inhalation_06`)** is retagged to **RRP**. It is a standalone highlight question where the key only scores the recognition of cues (singed nasal hair, soot in mouth, etc.). No clinical management is keyed.
   - **Row 27 (`gpt_case_major_burn_inhalation_fluid_creep_01_q2`)** is kept in **PA**. Although the action is highlight, the stem specifically frames the recognition in service of a management decision (discriminating between emergent intubation vs continued observation on non-rebreather mask).
4. **Row 28 (`gpt_deepen_2026_06_23_bow_03`)**: Retagged to **PA** (overriding GPT's proposed RRP). The bowtie item's key includes active emergency airway interventions (high-flow oxygen, airway team involvement) for an acute, life-threatening airway compromise, placing it squarely in *Alterations in Body Systems* (p. 46) under PA.
5. **Row 39 (`gpt_fmtgap_2026_07_14_or_dry_chemical_burn_15`)**: Retagged to **Safety and Infection Control** and rerouted out of the Burn Management rollup. This item orders the steps of dry chemical decontamination (PPE -> dry brush -> irrigate). Decontamination of hazardous materials is a Safety construct (*Handling Hazardous and Infectious Materials*, p. 25). This moves the item which was promoted on July 15 under PA.

## Topic License Recommendation

Based on the 42-row audit, all active burn questions reside in one of three Client Needs categories. We recommend the following post-route-out license:

> `Burn Management` → **SHARED `[Physiological Adaptation, Reduction of Risk Potential, Pharmacological and Parenteral Therapies]`**

All other items containing burn keywords are routed to generic topics (e.g., standard precautions, hazmat decontamination, nutritional support) and categories (BCC, Safety) to prevent license inflation for single-item edge cases.

## Execution Manifest Table

| # | ID | Current Category | Proposed Category | Proposed Topic | Rollup Eligible | Action |
|---|----|------------------|-------------------|----------------|-----------------|--------|
| 1 | `sa_parkland_01` | Physiological Adaptation | **Pharmacological and Parenteral Therapies** | `Burn Management` | yes | cat retag |
| 2 | `gemini_p6_burn_02` | Pharmacological and Parenteral Therapies | **Pharmacological and Parenteral Therapies** | `Burn Management` | yes | keep |
| 3 | `gemini_p6_burn_01` | Reduction of Risk Potential | **Pharmacological and Parenteral Therapies** | `Burn Management` | yes | cat retag |
| 4 | `gemini_p6_burn_03` | Reduction of Risk Potential | **Pharmacological and Parenteral Therapies** | `Burn Management` | yes | cat retag |
| 5 | `gemini_p6_burn_04` | Reduction of Risk Potential | **Pharmacological and Parenteral Therapies** | `Burn Management` | yes | cat retag + source note |
| 6 | `gemini_b7_02` | Reduction of Risk Potential | **Pharmacological and Parenteral Therapies** | `Burn Management` | yes | cat retag |
| 7 | `gemini_d9_07` | Physiological Adaptation | **Pharmacological and Parenteral Therapies** | `Burn Management` | yes | cat retag |
| 8 | `gemini_jun05_a_fib_parkland_burn_47` | Reduction of Risk Potential | **Pharmacological and Parenteral Therapies** | `Burn Management` | yes | cat retag |
| 9 | `gemini_jun05_b_fib_burn_06` | Reduction of Risk Potential | **Pharmacological and Parenteral Therapies** | `Burn Management` | yes | cat retag |
| 10 | `gpt_2026_07_03_1344_t1_05` | Physiological Adaptation | **Pharmacological and Parenteral Therapies** | `Burn Management` | yes | cat retag |
| 11 | `gpt_case_major_burn_inhalation_fluid_creep_01_q3` | Physiological Adaptation | **Pharmacological and Parenteral Therapies** | `Burn Management` | yes | cat retag |
| 12 | `burn_fib_parkland_total_posterior_03` | Physiological Adaptation | **Pharmacological and Parenteral Therapies** | `Burn Management` | yes | cat retag |
| 13 | `burn_fib_parkland_rate_arm_trunk_genitalia_04` | Physiological Adaptation | **Pharmacological and Parenteral Therapies** | `Burn Management` | yes | cat retag |
| 14 | `burn_fib_parkland_first8h_leg_arm_08` | Physiological Adaptation | **Pharmacological and Parenteral Therapies** | `Burn Management` | yes | cat retag |
| 15 | `burn_sata_parkland_chain_06` | Physiological Adaptation | **Pharmacological and Parenteral Therapies** | `Burn Management` | yes | cat retag |
| 16 | `burn_matrix_parkland_values_05` | Reduction of Risk Potential | **Pharmacological and Parenteral Therapies** | `Burn Management` | yes | cat retag + topic reroute |
| 17 | `gpt_visual_smoke_2026_06_12_fib_burn_parkland_rate_01` | Reduction of Risk Potential | **Pharmacological and Parenteral Therapies** | `Burn Management` | yes | cat retag + topic reroute |
| 18 | `gemini_u5_fib_or_2026_06_09_fib_tbsa_04` | Physiological Adaptation | **Reduction of Risk Potential** | `Burn Management` | yes | cat retag |
| 19 | `gpt_case_major_burn_inhalation_fluid_creep_01_q1` | Physiological Adaptation | **Reduction of Risk Potential** | `Burn Management` | yes | cat retag |
| 20 | `burn_fib_tbsa_anterior_mix_01` | Reduction of Risk Potential | **Reduction of Risk Potential** | `Burn Management` | yes | topic reroute |
| 21 | `burn_mc_posterior_tbsa_07` | Reduction of Risk Potential | **Reduction of Risk Potential** | `Burn Management` | yes | topic reroute |
| 22 | `gpt_visual_smoke_2026_06_12_mc_burn_tbsa_02` | Basic Care and Comfort | **Reduction of Risk Potential** | `Burn Management` | yes | cat retag + topic reroute |
| 23 | `gpt_visual_smoke_2026_06_12_matrix_burn_regions_03` | Reduction of Risk Potential | **Reduction of Risk Potential** | `adult Rule of Nines region recognition` | contested | topic reroute — HOLD |
| 24 | `gemini_b7_05` | Reduction of Risk Potential | **Reduction of Risk Potential** | `Burn Management` | yes | keep |
| 25 | `gemini_b7_08` | Reduction of Risk Potential | **Reduction of Risk Potential** | `Burn Management` | yes | keep |
| 26 | `gpt_fmtgap_2026_07_14_hl_burn_inhalation_06` | Physiological Adaptation | **Reduction of Risk Potential** | `Burn Management` | yes | cat retag |
| 27 | `gpt_case_major_burn_inhalation_fluid_creep_01_q2` | Physiological Adaptation | **Physiological Adaptation** | `Burn Management` | yes | keep |
| 28 | `gpt_deepen_2026_06_23_bow_03` | Reduction of Risk Potential | **Physiological Adaptation** | `Burn Management` | yes | cat retag — dissent |
| 29 | `easy_burns_01` | Physiological Adaptation | **Physiological Adaptation** | `Burn Management` | yes | keep |
| 30 | `easy_burns_02` | Physiological Adaptation | **Physiological Adaptation** | `Burn Management` | yes | keep |
| 31 | `gemini_c10_08` | Physiological Adaptation | **Physiological Adaptation** | `Burn Management` | yes | keep |
| 32 | `gemini_d9_01` | Physiological Adaptation | **Physiological Adaptation** | `Burn Management` | yes | keep |
| 33 | `gemini_d9_04` | Physiological Adaptation | **Physiological Adaptation** | `Burn Management` | yes | keep |
| 34 | `gemini_d9_10` | Physiological Adaptation | **Physiological Adaptation** | `Burn Management` | yes | keep |
| 35 | `burn_mc_resuscitation_threshold_02` | Physiological Adaptation | **Physiological Adaptation** | `Burn Management` | yes | keep |
| 36 | `gpt_case_major_burn_inhalation_fluid_creep_01_q4` | Physiological Adaptation | **Physiological Adaptation** | `Burn Management` | yes | keep |
| 37 | `gpt_case_major_burn_inhalation_fluid_creep_01_q5` | Physiological Adaptation | **Physiological Adaptation** | `Burn Management` | yes | keep |
| 38 | `gpt_case_major_burn_inhalation_fluid_creep_01_bowtie` | Physiological Adaptation | **Physiological Adaptation** | `Burn Management` | yes | keep |
| 39 | `gpt_fmtgap_2026_07_14_or_dry_chemical_burn_15` | Physiological Adaptation | **Safety and Infection Control** | `Patient & Environment Safety` | no | cat retag + topic reroute |
| 40 | `easy_burns_03` | Safety and Infection Control | **Safety and Infection Control** | `Standard Precautions & Hygiene` | no | topic reroute |
| 41 | `trad_batchD_19` | Basic Care and Comfort | **Basic Care and Comfort** | `Nutritional & Fluid Support` | no | no change |
| 42 | `gpt_case_gbs_respiratory_compromise_01_q1` | Physiological Adaptation | **Physiological Adaptation** | `Endocrine & Neurological Disorders` | no | topic reroute |

### Manifest Statistics & Tallies

- **Total Rows / Unique IDs:** 42
- **All IDs verified present on disk:** Yes
- **Proposed Category Counts (sum to 42):**
  - Pharmacological and Parenteral Therapies: **17**
  - Physiological Adaptation: **13**
  - Reduction of Risk Potential: **9**
  - Safety and Infection Control: **2**
  - Basic Care and Comfort: **1**
- **Rollup Membership (Burn Management):**
  - Active Rollup (`Elig: yes`): **37**
  - Contested/Held (`Elig: contested`): **1** (Row 23)
  - Routed Out (`Elig: no`): **4** (Rows 39, 40, 41, 42)

---

## Individual Row Analysis Details

### Row 1: `sa_parkland_01`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Pharmacological and Parenteral Therapies` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Fluid math calculation with Parkland formula coefficient supplied. Classifies under Parenteral/Intravenous Therapies (p. 40).

### Row 2: `gemini_p6_burn_02`
- **Current:** Category: `Pharmacological and Parenteral Therapies` | Topic: `Burn Management`
- **Proposed:** Category: `Pharmacological and Parenteral Therapies` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Parkland rate calculation. Correctly categorized already under Pharm.

### Row 3: `gemini_p6_burn_01`
- **Current:** Category: `Reduction of Risk Potential` | Topic: `Burn Management`
- **Proposed:** Category: `Pharmacological and Parenteral Therapies` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Parkland total 24h volume calculation with coefficient supplied. Retag to Pharm.

### Row 4: `gemini_p6_burn_03`
- **Current:** Category: `Reduction of Risk Potential` | Topic: `Burn Management`
- **Proposed:** Category: `Pharmacological and Parenteral Therapies` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Parkland rate calculation for specific window. Retag to Pharm.

### Row 5: `gemini_p6_burn_04`
- **Current:** Category: `Reduction of Risk Potential` | Topic: `Burn Management`
- **Proposed:** Category: `Pharmacological and Parenteral Therapies` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Pediatric fluid calculation using provider-ordered coefficient (3 mL/kg/%TBSA). Retag to Pharm, add source note explaining facility order.

### Row 6: `gemini_b7_02`
- **Current:** Category: `Reduction of Risk Potential` | Topic: `Burn Management`
- **Proposed:** Category: `Pharmacological and Parenteral Therapies` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Parkland hourly rate calculation with arrival/delay elapsed-time correction. Retag to Pharm.

### Row 7: `gemini_d9_07`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Pharmacological and Parenteral Therapies` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Parkland rate calculation with arrival delay. Retag to Pharm.

### Row 8: `gemini_jun05_a_fib_parkland_burn_47`
- **Current:** Category: `Reduction of Risk Potential` | Topic: `Burn Management`
- **Proposed:** Category: `Pharmacological and Parenteral Therapies` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Parkland resuscitation volume math where the coefficient is not supplied in stem. Recalling a coefficient and computing is still IV therapy math. Retag to Pharm.

### Row 9: `gemini_jun05_b_fib_burn_06`
- **Current:** Category: `Reduction of Risk Potential` | Topic: `Burn Management`
- **Proposed:** Category: `Pharmacological and Parenteral Therapies` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Parkland 8h volume calculation. Identical to row 1. Retag to Pharm.

### Row 10: `gpt_2026_07_03_1344_t1_05`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Pharmacological and Parenteral Therapies` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Dropdown cloze calculating prescribed volume/rate from provider order specifying Parkland. Retag to Pharm.

### Row 11: `gpt_case_major_burn_inhalation_fluid_creep_01_q3`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Pharmacological and Parenteral Therapies` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Case study leaf requiring Parkland 24h volume and initial rate calculation. Retag to Pharm.

### Row 12: `burn_fib_parkland_total_posterior_03`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Pharmacological and Parenteral Therapies` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** TBSA read from diagram, followed by Parkland calculation. Key is the numeric calculation output, so retag to Pharm.

### Row 13: `burn_fib_parkland_rate_arm_trunk_genitalia_04`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Pharmacological and Parenteral Therapies` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** TBSA read from diagram, followed by Parkland rate calculation. Key is the numeric calculation output, so retag to Pharm.

### Row 14: `burn_fib_parkland_first8h_leg_arm_08`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Pharmacological and Parenteral Therapies` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** TBSA read from diagram, followed by Parkland volume calculation. Key is the numeric calculation output, so retag to Pharm.

### Row 15: `burn_sata_parkland_chain_06`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Pharmacological and Parenteral Therapies` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** SATA evaluating statements in Parkland calculation chain (visual TBSA -> total volume -> half -> rate). Retag to Pharm.

### Row 16: `burn_matrix_parkland_values_05`
- **Current:** Category: `Reduction of Risk Potential` | Topic: `burn Parkland calculation verification`
- **Proposed:** Category: `Pharmacological and Parenteral Therapies` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Verifying another nurse's Parkland worksheet values. Arithmetic verification of IV therapies belongs under Pharm. Topic rerouted to canonical.

### Row 17: `gpt_visual_smoke_2026_06_12_fib_burn_parkland_rate_01`
- **Current:** Category: `Reduction of Risk Potential` | Topic: `adult burn resuscitation Parkland calculation`
- **Proposed:** Category: `Pharmacological and Parenteral Therapies` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Parkland rate calculation based on visual TBSA. Retag to Pharm and reroute topic to canonical.

### Row 18: `gemini_u5_fib_or_2026_06_09_fib_tbsa_04`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Reduction of Risk Potential` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Reverses the Jun 16 ruling. Rule of Nines TBSA calculation with no treatment/management action. Pure focused assessment, which belongs under RRP.

### Row 19: `gpt_case_major_burn_inhalation_fluid_creep_01_q1`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Reduction of Risk Potential` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Rule of Nines TBSA calculation leaf. Pure assessment, retag to RRP.

### Row 20: `burn_fib_tbsa_anterior_mix_01`
- **Current:** Category: `Reduction of Risk Potential` | Topic: `adult burn TBSA estimation`
- **Proposed:** Category: `Reduction of Risk Potential` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Pure TBSA estimation. Category RRP correct. Reroute topic to canonical.

### Row 21: `burn_mc_posterior_tbsa_07`
- **Current:** Category: `Reduction of Risk Potential` | Topic: `adult burn posterior surface TBSA`
- **Proposed:** Category: `Reduction of Risk Potential` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Pure posterior TBSA estimation. Category RRP correct. Reroute topic to canonical.

### Row 22: `gpt_visual_smoke_2026_06_12_mc_burn_tbsa_02`
- **Current:** Category: `Basic Care and Comfort` | Topic: `adult Rule of Nines TBSA estimation`
- **Proposed:** Category: `Reduction of Risk Potential` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Pure Rule of Nines estimation. Retag from BCC (which is incorrect) to RRP. Reroute topic to canonical.

### Row 23: `gpt_visual_smoke_2026_06_12_matrix_burn_regions_03`
- **Current:** Category: `Reduction of Risk Potential` | Topic: `adult Rule of Nines region recognition`
- **Proposed:** Category: `Reduction of Risk Potential` | Topic: `adult Rule of Nines region recognition` | Rollup: `contested`
- **Ruling:** Explicit ruling: HOLD. This matrix item only tests diagram-reading of region boundaries without TBSA arithmetic or clinical context. It is closer to a renderer smoke test than an NCLEX nursing item. Left as is (contested, off-canonical topic string) to exclude it from the Burn Management rollup.

### Row 24: `gemini_b7_05`
- **Current:** Category: `Reduction of Risk Potential` | Topic: `Burn Management`
- **Proposed:** Category: `Reduction of Risk Potential` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Resuscitation monitoring (UOP 25 mL/hr). Evaluates response to procedures/treatments. Category RRP is correct.

### Row 25: `gemini_b7_08`
- **Current:** Category: `Reduction of Risk Potential` | Topic: `Burn Management`
- **Proposed:** Category: `Reduction of Risk Potential` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Surveillance matrix for resuscitation adequacy (vital trends, sensorium, UOP). RRP correct.

### Row 26: `gpt_fmtgap_2026_07_14_hl_burn_inhalation_06`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Reduction of Risk Potential` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Explicit ruling (split from 27): Standalone highlight. Keyed task is pure cue-recognition of inhalation injury and airway edema risk. No active clinical management or intervention is keyed, so retag to RRP.

### Row 27: `gpt_case_major_burn_inhalation_fluid_creep_01_q2`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Physiological Adaptation` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Explicit ruling (split from 26): Case study highlight where the stem asks to identify cues that support a specific urgent management choice (intubation vs observation). Keyed action is highlight, but the construct tested is airway emergency management decision. Category PA correct.

### Row 28: `gpt_deepen_2026_06_23_bow_03`
- **Current:** Category: `Reduction of Risk Potential` | Topic: `Burn Management`
- **Proposed:** Category: `Physiological Adaptation` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Explicit ruling: Retag to PA. Bowtie item where the keyed actions contain active airway management interventions (high-flow oxygen, airway team involvement) for an acute compromise, which belongs under PA (pp. 46-48).

### Row 29: `easy_burns_01`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Physiological Adaptation` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Priority emergency care for severe burn (airway ABCs). Category PA correct.

### Row 30: `easy_burns_02`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Physiological Adaptation` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Resuscitation priority choice to prevent hypovolemic shock (administering massive IV fluids). Keys the clinical intervention decision (no arithmetic calculation). Category PA correct.

### Row 31: `gemini_c10_08`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Physiological Adaptation` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Matrix classifying interventions between emergent (resuscitation) and acute (wound healing) phases. Active clinical management. Category PA correct.

### Row 32: `gemini_d9_01`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Physiological Adaptation` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Intervention decision in response to vital sign deterioration and low UOP (increase isotonic IV fluid rate). Active management of hemodynamic stability. Category PA correct.

### Row 33: `gemini_d9_04`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Physiological Adaptation` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** SATA identifying pathophysiological fluid shifts, hyperkalemia, metabolic acidosis in the first 24h. Pathophysiology of acute condition. Category PA correct.

### Row 34: `gemini_d9_10`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Physiological Adaptation` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Matrix matching laboratory abnormalities (Hct, procalcitonin, BNP/troponin) to their pathophysiological shock mechanism. Tests pathophysiological mechanisms, not just lab reporting. Category PA correct.

### Row 35: `burn_mc_resuscitation_threshold_02`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Physiological Adaptation` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Reading diagram TBSA and deciding whether to initiate formal IV resuscitation protocol. Decision to initiate, so PA correct.

### Row 36: `gpt_case_major_burn_inhalation_fluid_creep_01_q4`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Physiological Adaptation` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Case leaf deciding to increase IV rate per titration protocol for low UOP. Active hemodynamic titration. Category PA correct.

### Row 37: `gpt_case_major_burn_inhalation_fluid_creep_01_q5`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Physiological Adaptation` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Case leaf managing established complication of fluid overload/creep (reduce rate, notify, monitor bladder pressure, assess pulses). Category PA correct.

### Row 38: `gpt_case_major_burn_inhalation_fluid_creep_01_bowtie`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Physiological Adaptation` | Topic: `Burn Management` | Rollup: `yes`
- **Ruling:** Bowtie item managing fluid creep / over-resuscitation complication. Active emergency intervention. Category PA correct.

### Row 39: `gpt_fmtgap_2026_07_14_or_dry_chemical_burn_15`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Safety and Infection Control` | Topic: `Patient & Environment Safety` | Rollup: `no`
- **Ruling:** Explicit ruling: moves item promoted July 15. Sequence of dry chemical decontamination (PPE -> dry brush -> water flush). Tests hazardous materials procedures (Safety and Infection Control, p. 25). Rerouted out of Burn Management.

### Row 40: `easy_burns_03`
- **Current:** Category: `Safety and Infection Control` | Topic: `Burn Management`
- **Proposed:** Category: `Safety and Infection Control` | Topic: `Standard Precautions & Hygiene` | Rollup: `no`
- **Ruling:** Meticulous hand hygiene to prevent infection in burn patient. Core construct is standard precautions/infection control (Safety, p. 26). Rerouted out of Burn Management.

### Row 41: `trad_batchD_19`
- **Current:** Category: `Basic Care and Comfort` | Topic: `Nutritional & Fluid Support`
- **Proposed:** Category: `Basic Care and Comfort` | Topic: `Nutritional & Fluid Support` | Rollup: `no`
- **Ruling:** Nutritional recommendation (protein) for wound healing. Core construct is basic care nutrition (BCC, p. 36-37). Already routed to Nutritional topic; kept there.

### Row 42: `gpt_case_gbs_respiratory_compromise_01_q1`
- **Current:** Category: `Physiological Adaptation` | Topic: `Burn Management`
- **Proposed:** Category: `Physiological Adaptation` | Topic: `Endocrine & Neurological Disorders` | Rollup: `no`
- **Ruling:** Guillain-Barré respiratory compromise question. Autotagged on 'burning pain' text match. Retain PA but reroute topic to Endocrine & Neurological Disorders.
