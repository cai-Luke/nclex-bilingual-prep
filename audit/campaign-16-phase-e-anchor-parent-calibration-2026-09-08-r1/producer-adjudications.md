# Campaign 16 Phase E — Producer Adjudications by Parent

Date: 2026-09-08  
Producer Seat: Gemini 3.8 Flash (High) — Primary Coding & Analysis Seat  
Frozen Source: `audit/campaign-16-phase-e-anchor-parent-calibration-2026-09-08-r1/producer-adjudications.json`  
Locked Digest (SHA-256): `73d36b6c5a0e937b2ca70e21fd2cdaaf4996b3dc5d79db312e075fac6837bb17`  

---

## Parent 1: `opus2_case_code_status_01`

- **Bank:** `banks/claude-canonical.json`
- **Declared Stages:** `stage_1, stage_2, stage_3`
- **Proposed Parent Anchor Vector:** `[ BASELINE_BEFORE_FIRST_STAGE, stage_1, stage_2, stage_3, stage_3 ]`
- **Parent Recoverability:** `STRUCTURALLY_UNREPRESENTABLE_BASELINE_GAP`
- **Coherence Check:** Part 1 is clinically and semantically answerable at 0700 baseline admission from global exhibit and stem. Declared stage_1 narrates provider paging and nursing actions taken in response to refusal, directly leaking Option A of Part 1. Parts 2-5 follow a coherent temporal progression (stage_1, stage_2, stage_3, stage_3).

### Part-Level Adjudications (5 parts):

#### Part 1 (`opus2_case_code_status_q1`, queueIndex: 1, type: `multiple_choice`)

- **Tested Decision:** Priority nursing action upon capacitated patient verbally refusing intubation/CPR when chart reflects Full Code
- **Baseline/Global-Exhibit Info:** Global exhibit exhibit_baseline (0700): patient alert x4 with full decision-making capacity, stable on 3L nasal cannula, chest wall pain. Stem introduces verbatim refusal.
- **Later Stage Info:** stage_1 exhibit (0700-0900) narrates that nurse documented capacity, verbatim statements, and paged Dr. Reeves.
- **Earliest Point Answerable:** Baseline (0700 admission, upon verbal refusal)
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `BASELINE_BEFORE_FIRST_STAGE`
- **Proposed Anchor:** *None (Non-anchor disposition)*
- **Confidence:** HIGH
- **Rationale/Evidence:** Part 1 tests the nurse immediate response to verbal refusal at admission. stage_1 narrative explicitly documents the nurse actions (documenting capacity, verbatim statements, escalating to provider), directly leaking option A. No declared stage exists for baseline prior to stage_1.

#### Part 2 (`opus2_case_code_status_q2`, queueIndex: 2, type: `multiple_choice`)

- **Tested Decision:** Nursing action at 0800 after covering provider Dr. Reeves indicates he will delay evaluation until 1100
- **Baseline/Global-Exhibit Info:** Patient stable on 3L O2; no communication with Dr. Reeves yet.
- **Later Stage Info:** stage_1 exhibit describes Dr. Reeves response at 0800 that he will see patient around 1100. stage_2 describes acute deterioration at 0930-1030.
- **Earliest Point Answerable:** stage_1 (at 0800 post-provider page response)
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_1`
- **Confidence:** HIGH
- **Rationale/Evidence:** Question specifically tests the 0800 dilemma when patient is stable and provider is delayed. Information is provided in stage_1. Later stages (stage_2) show acute respiratory deterioration which changes urgency.

#### Part 3 (`opus2_case_code_status_q3`, queueIndex: 3, type: `multiple_choice`)

- **Tested Decision:** Action at 1030 when patient deteriorates with hypoxemia and fatigue while code status remains Full Code
- **Baseline/Global-Exhibit Info:** Patient stable at 0700; no deterioration.
- **Later Stage Info:** stage_2 exhibit details 0930 CXR (pleural effusion), SpO2 drop to 89%, patient begging not to be intubated at 1030. stage_3 exhibit reveals RRT activation at 1100 and DNAR/DNI entry.
- **Earliest Point Answerable:** stage_2 (at 1030 post-deterioration)
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_2`
- **Confidence:** HIGH
- **Rationale/Evidence:** Question assesses managing acute deterioration at 1030. stage_2 provides clinical data. Revealing stage_3 leaks that RRT was called and provider entered DNAR/DNI.

#### Part 4 (`opus2_case_code_status_q4`, queueIndex: 4, type: `multiple_choice`)

- **Tested Decision:** Essential components of handoff to Rapid Response Team upon arrival at 1100
- **Baseline/Global-Exhibit Info:** Patient stable; no RRT activation.
- **Later Stage Info:** stage_3 exhibit narrates RRT arrival at 1100 and communication with critical care fellow.
- **Earliest Point Answerable:** stage_3 (at 1100 RRT arrival)
- **Does Later Stage Assist/Expose Answer:** No
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_3`
- **Confidence:** HIGH
- **Rationale/Evidence:** RRT activation and handoff occur at 1100, which opens stage_3.

#### Part 5 (`opus2_case_code_status_q5`, queueIndex: 5, type: `select_all`)

- **Tested Decision:** Evaluation actions at 1130 following formal entry of DNAR/DNI order
- **Baseline/Global-Exhibit Info:** Order not entered.
- **Later Stage Info:** stage_3 exhibit details DNAR/DNI entry and advance directive completion by 1130.
- **Earliest Point Answerable:** stage_3 (at 1130 post-order entry)
- **Does Later Stage Assist/Expose Answer:** No
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_3`
- **Confidence:** HIGH
- **Rationale/Evidence:** Tests evaluation of the completed advocacy process at 1130, occurring in stage_3.

---

## Parent 2: `opus_vanco_case_01`

- **Bank:** `banks/claude-canonical.json`
- **Declared Stages:** `stage_1_infusion_reaction, stage_2_trough_monitoring, stage_3_aki_tinnitus`
- **Proposed Parent Anchor Vector:** `[ stage_1_infusion_reaction, stage_1_infusion_reaction, stage_2_trough_monitoring, stage_2_trough_monitoring, stage_3_aki_tinnitus, stage_3_aki_tinnitus ]`
- **Parent Recoverability:** `FULLY_RECOVERABLE`
- **Coherence Check:** Classic 2-2-2 progression across 3 clinical stages. All parts cleanly map to declared stages with matching clinical chronology.

### Part-Level Adjudications (6 parts):

#### Part 1 (`opus_vanco_case_01_q1_infusion_reaction`, queueIndex: 6, type: `multiple_choice`)

- **Tested Decision:** First nursing action when vancomycin flushing syndrome develops 15 minutes into loading infusion
- **Baseline/Global-Exhibit Info:** Baseline assessment at 1200; infusion has not started.
- **Later Stage Info:** stage_1_infusion_reaction describes flushing, pruritus, wheals at 1445. stage_2 and stage_3 describe subsequent days.
- **Earliest Point Answerable:** stage_1_infusion_reaction
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_1_infusion_reaction`
- **Confidence:** HIGH
- **Rationale/Evidence:** Infusion reaction occurs at 1445 in stage_1. Requires stopping infusion immediately.

#### Part 2 (`opus_vanco_case_01_q2_documentation_cloze`, queueIndex: 7, type: `dropdown_cloze`)

- **Tested Decision:** Nursing documentation and handoff following resolution of rate-related infusion reaction
- **Baseline/Global-Exhibit Info:** Infusion has not started.
- **Later Stage Info:** stage_1_infusion_reaction outcome exhibit documents resolution after antihistamine and restart at slower rate.
- **Earliest Point Answerable:** stage_1_infusion_reaction
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_1_infusion_reaction`
- **Confidence:** HIGH
- **Rationale/Evidence:** Documents response to the infusion reaction occurring at Stage 1.

#### Part 3 (`opus_vanco_case_01_q3_supratherapeutic_trough_order`, queueIndex: 8, type: `ordered_response`)

- **Tested Decision:** Order of nursing actions when trough returns supratherapeutic at 22.4 mcg/mL on Day 3
- **Baseline/Global-Exhibit Info:** Day 1 baseline only.
- **Later Stage Info:** stage_2_trough_monitoring provides Day 3 trough result. stage_3 describes AKI on Day 4.
- **Earliest Point Answerable:** stage_2_trough_monitoring
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_2_trough_monitoring`
- **Confidence:** HIGH
- **Rationale/Evidence:** Tests response to Day 3 trough result presented in stage_2.

#### Part 4 (`opus_vanco_case_01_q4_ototoxicity_screening`, queueIndex: 9, type: `select_all`)

- **Tested Decision:** Ototoxicity screening interventions for client with baseline hearing aids on Day 3
- **Baseline/Global-Exhibit Info:** Baseline hearing aid use noted.
- **Later Stage Info:** stage_2_trough_monitoring pharmacist notes recommend increased ototoxicity monitoring. stage_3 reveals onset of tinnitus on Day 4.
- **Earliest Point Answerable:** stage_2_trough_monitoring
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_2_trough_monitoring`
- **Confidence:** HIGH
- **Rationale/Evidence:** Prompted by pharmacist recommendation in stage_2. Revealing stage_3 confirms tinnitus.

#### Part 5 (`opus_vanco_case_01_q5_aki_cue_matrix`, queueIndex: 10, type: `matrix`)

- **Tested Decision:** Interpreting Day 4 toxicity cues (Cr 2.4, oliguria, tinnitus) relative to morning vancomycin dose
- **Baseline/Global-Exhibit Info:** Cr 1.8 baseline.
- **Later Stage Info:** stage_3_aki_tinnitus presents Day 4 labs and tinnitus onset.
- **Earliest Point Answerable:** stage_3_aki_tinnitus
- **Does Later Stage Assist/Expose Answer:** No
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_3_aki_tinnitus`
- **Confidence:** HIGH
- **Rationale/Evidence:** Requires Day 4 clinical data presented in stage_3.

#### Part 6 (`opus_vanco_case_01_q6_lisinopril_aki`, queueIndex: 11, type: `multiple_choice`)

- **Tested Decision:** Managing active lisinopril order in setting of acute kidney injury and hyperkalemia (K 5.1)
- **Baseline/Global-Exhibit Info:** Cr 1.8, K 4.6 baseline.
- **Later Stage Info:** stage_3_aki_tinnitus exhibits show Cr 2.4, K 5.1, and provider order holding lisinopril.
- **Earliest Point Answerable:** stage_3_aki_tinnitus
- **Does Later Stage Assist/Expose Answer:** No
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_3_aki_tinnitus`
- **Confidence:** HIGH
- **Rationale/Evidence:** Tests recognition that lisinopril must be held when AKI and hyperkalemia occur at Stage 3.

---

## Parent 3: `opus_agvd_case_agvhd_01`

- **Bank:** `banks/gemini-canonical.json`
- **Declared Stages:** `stage_1, stage_2, stage_3`
- **Proposed Parent Anchor Vector:** `[ stage_1, stage_1, stage_2, stage_2, stage_2, stage_3 ]`
- **Parent Recoverability:** `FULLY_RECOVERABLE`
- **Coherence Check:** Monotonic vector ([stage_1, stage_1, stage_2, stage_2, stage_2, stage_3]). Question stems explicitly cite the stage corresponding to each decision.

### Part-Level Adjudications (6 parts):

#### Part 1 (`opus_agvd_case_agvhd_01_q1`, queueIndex: 59, type: `multiple_choice`)

- **Tested Decision:** Recognizing acute graft-versus-host disease (aGVHD) after negative infectious workup at 12 hours
- **Baseline/Global-Exhibit Info:** Readmission with watery diarrhea and palm/sole rash; infectious workup pending.
- **Later Stage Info:** stage_1 exhibit shows stool studies and viral PCRs negative, team diagnoses aGVHD.
- **Earliest Point Answerable:** stage_1
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_1`
- **Confidence:** HIGH
- **Rationale/Evidence:** Stem explicitly references Stage 1 negative infectious results.

#### Part 2 (`opus_agvd_case_agvhd_01_q2`, queueIndex: 60, type: `multiple_choice`)

- **Tested Decision:** Priority electrolyte replacement (K 3.1, Mg 1.4) before high-dose corticosteroids at Stage 1
- **Baseline/Global-Exhibit Info:** Baseline K 3.4.
- **Later Stage Info:** stage_1 provides repeat labs and planned corticosteroid therapy.
- **Earliest Point Answerable:** stage_1
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_1`
- **Confidence:** HIGH
- **Rationale/Evidence:** Stem explicitly sets timing before corticosteroid administration in Stage 1.

#### Part 3 (`opus_agvd_case_agvhd_01_q3`, queueIndex: 61, type: `multiple_choice`)

- **Tested Decision:** Prioritizing hypovolemic shock / hemodynamic instability at Stage 2 (48 hours)
- **Baseline/Global-Exhibit Info:** Hemodynamics stable at admission.
- **Later Stage Info:** stage_2 describes worsening vital signs (HR 118, BP 92/56, oliguria 180 mL/8h).
- **Earliest Point Answerable:** stage_2
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_2`
- **Confidence:** HIGH
- **Rationale/Evidence:** Requires hemodynamic deterioration data presented in stage_2.

#### Part 4 (`opus_agvd_case_agvhd_01_q4`, queueIndex: 62, type: `multiple_choice`)

- **Tested Decision:** Action for elevated tacrolimus level (18.4 ng/mL) and rising creatinine (1.6 mg/dL) at Stage 2
- **Baseline/Global-Exhibit Info:** Cr 1.0 baseline.
- **Later Stage Info:** stage_2 provides repeat tacrolimus trough and renal function.
- **Earliest Point Answerable:** stage_2
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_2`
- **Confidence:** HIGH
- **Rationale/Evidence:** Assesses tacrolimus nephrotoxicity cues presented in stage_2.

#### Part 5 (`opus_agvd_case_agvhd_01_q5`, queueIndex: 63, type: `multiple_choice`)

- **Tested Decision:** Sequencing concurrent interventions at Stage 2 (IV fluid bolus first)
- **Baseline/Global-Exhibit Info:** No concurrent orders active.
- **Later Stage Info:** stage_2 gives new orders for volume resuscitation, telemetry, med adjustments.
- **Earliest Point Answerable:** stage_2
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_2`
- **Confidence:** HIGH
- **Rationale/Evidence:** Prioritizes immediate interventions for Stage 2 hemodynamic crisis.

#### Part 6 (`opus_agvd_case_agvhd_01_q6`, queueIndex: 64, type: `matrix`)

- **Tested Decision:** Evaluating therapeutic response vs. vigilance findings at Stage 3 (96 hours) post-ruxolitinib
- **Baseline/Global-Exhibit Info:** Initial data only.
- **Later Stage Info:** stage_3 provides clinical response data after 48h of ruxolitinib.
- **Earliest Point Answerable:** stage_3
- **Does Later Stage Assist/Expose Answer:** No
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_3`
- **Confidence:** HIGH
- **Rationale/Evidence:** Matrix evaluates clinical outcomes occurring at Stage 3.

---

## Parent 4: `gpt_case_gap_2026_06_11_case_adhf_01`

- **Bank:** `banks/gpt-canonical.json`
- **Declared Stages:** `adhf_stage2, adhf_stage3`
- **Proposed Parent Anchor Vector:** `[ BASELINE_BEFORE_FIRST_STAGE, adhf_stage2, adhf_stage2, adhf_stage3 ]`
- **Parent Recoverability:** `STRUCTURALLY_UNREPRESENTABLE_BASELINE_GAP`
- **Coherence Check:** Part 1 tests initial triage cues from global exhibits before any stage progression. Declared stages begin at adhf_stage2 (30 minutes later acute pulmonary edema). Parts 2-4 carry pre-existing stageId anchors (adhf_stage2, adhf_stage2, adhf_stage3). No valid declared stage exists for Part 1.

### Part-Level Adjudications (1 parts):

#### Part 1 (`gpt_case_gap_2026_06_11_adhf_matrix_01`, queueIndex: 153, type: `matrix`)

- **Tested Decision:** Classifying initial triage cues as acute decompensated heart failure vs. less related
- **Baseline/Global-Exhibit Info:** Global exhibits adhf_triage (vital signs, lung crackles, ankle edema, missed furosemide) and adhf_labs (CXR pulmonary congestion, BNP 1240, Na 132, K 3.7, troponin normal, weight 84 kg vs 80.8 kg).
- **Later Stage Info:** adhf_stage2 (Thirty minutes later) shows acute deterioration (SpO2 84%, pink frothy sputum, drowning sensation).
- **Earliest Point Answerable:** Baseline (at ED triage arrival, before adhf_stage2)
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `BASELINE_BEFORE_FIRST_STAGE`
- **Proposed Anchor:** *None (Non-anchor disposition)*
- **Confidence:** HIGH
- **Rationale/Evidence:** Part 1 matrix rows exclusively evaluate the admission triage assessment and initial labs. adhf_stage2 represents acute pulmonary edema 30 minutes later; anchoring to adhf_stage2 exposes future deterioration prematurely. No declared stage exists in caseStudy.stages[] for baseline triage.

---

## Parent 5: `gpt_case_opus5_cdi_immunocompromised_01`

- **Bank:** `banks/gpt-canonical.json`
- **Declared Stages:** `stage1, stage2, stage3`
- **Proposed Parent Anchor Vector:** `[ stage1, stage1, stage1, stage2, stage1, stage3 ]`
- **Parent Recoverability:** `FULLY_RECOVERABLE`
- **Coherence Check:** Part 5 is an ordered-response item testing the initial Stage 1 action sequence, but was authored in position 5 following a Stage 2 matrix item. Semantically, Part 5 is answerable immediately after stage1. Both stage1 and stage2 vectors are coherent; earliest answerability is stage1.

### Part-Level Adjudications (6 parts):

#### Part 1 (`gpt_case_opus5_cdi_immunocompromised_01_q1`, queueIndex: 159, type: `multiple_choice`)

- **Tested Decision:** Recognizing that PRN loperamide should be held in suspected CDI
- **Baseline/Global-Exhibit Info:** No global exhibits. stage1 exhibits provide presentation on Day 14.
- **Later Stage Info:** stage2 provides Day 15 lab confirmation.
- **Earliest Point Answerable:** stage1
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage1`
- **Confidence:** HIGH
- **Rationale/Evidence:** Tests initial medication safety action upon identifying CDI risk in stage1.

#### Part 2 (`gpt_case_opus5_cdi_immunocompromised_01_q2`, queueIndex: 160, type: `select_all`)

- **Tested Decision:** First hour nursing actions for suspected CDI (contact precautions, soap/water handwashing)
- **Baseline/Global-Exhibit Info:** No global exhibits.
- **Later Stage Info:** stage2 outlines confirmed isolation plan.
- **Earliest Point Answerable:** stage1
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage1`
- **Confidence:** HIGH
- **Rationale/Evidence:** Tests immediate infection-control actions during first hour in stage1.

#### Part 3 (`gpt_case_opus5_cdi_immunocompromised_01_q3`, queueIndex: 161, type: `dropdown_cloze`)

- **Tested Decision:** Explaining rationale for oral rather than intravenous vancomycin in luminal CDI
- **Baseline/Global-Exhibit Info:** No global exhibits.
- **Later Stage Info:** stage1 provider orders include oral vancomycin.
- **Earliest Point Answerable:** stage1
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage1`
- **Confidence:** HIGH
- **Rationale/Evidence:** Oral vancomycin is ordered in stage1; teaching can occur once order is placed.

#### Part 4 (`gpt_case_opus5_cdi_immunocompromised_01_q4`, queueIndex: 162, type: `matrix`)

- **Tested Decision:** Classifying Day 15 (Stage 2) monitoring findings as expected improvement vs. escalation
- **Baseline/Global-Exhibit Info:** No global exhibits.
- **Later Stage Info:** stage2 exhibit details Day 15 status.
- **Earliest Point Answerable:** stage2
- **Does Later Stage Assist/Expose Answer:** No
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage2`
- **Confidence:** HIGH
- **Rationale/Evidence:** Stem explicitly references Stage 2 monitoring findings.

#### Part 5 (`gpt_case_opus5_cdi_immunocompromised_01_q5`, queueIndex: 163, type: `ordered_response`)

- **Tested Decision:** Ordering initial nursing actions in response to Stage 1 findings
- **Baseline/Global-Exhibit Info:** No global exhibits.
- **Later Stage Info:** Content is strictly Stage 1 cues (fever, diarrhea, antibiotics, holding loperamide, contact precautions, SBAR).
- **Earliest Point Answerable:** stage1
- **Does Later Stage Assist/Expose Answer:** No
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage1`
- **Confidence:** HIGH
- **Rationale/Evidence:** Stem explicitly specifies ordering actions for initial response to Stage 1 findings. Earliest answerability is stage1, though placed in ordinal position 5.

#### Part 6 (`gpt_case_opus5_cdi_immunocompromised_01_q6`, queueIndex: 164, type: `multiple_choice`)

- **Tested Decision:** Discharge teaching on clinical resolution vs. unnecessary retesting on Days 17-18
- **Baseline/Global-Exhibit Info:** No global exhibits.
- **Later Stage Info:** stage3 provides discharge planning data.
- **Earliest Point Answerable:** stage3
- **Does Later Stage Assist/Expose Answer:** No
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage3`
- **Confidence:** HIGH
- **Rationale/Evidence:** Assesses discharge teaching after clinical resolution in stage3.

---

## Parent 6: `gpt_case_warfarin_mvr_2026_06_11_01`

- **Bank:** `banks/gpt-canonical.json`
- **Declared Stages:** `stage_1_1400, stage_2_2200, stage_3_0645, stage_3_1200`
- **Proposed Parent Anchor Vector:** `[ BASELINE_BEFORE_FIRST_STAGE, BASELINE_BEFORE_FIRST_STAGE, stage_1_1400, stage_3_0645, stage_3_1200, stage_3_1200 ]`
- **Parent Recoverability:** `STRUCTURALLY_UNREPRESENTABLE_BASELINE_GAP`
- **Coherence Check:** Parts 1 and 2 test 1030 admission decisions from global exhibits (admission_record and initial_assessment_labs). First declared stage stage_1_1400 narrates provider orders holding warfarin and nursing actions addressing naproxen, directly leaking the answers to Parts 1 and 2. Parts 3-6 follow a coherent progression across stage_1_1400, stage_3_0645, and stage_3_1200.

### Part-Level Adjudications (6 parts):

#### Part 1 (`gpt_case_warfarin_mvr_2026_06_11_01_q1`, queueIndex: 165, type: `multiple_choice`)

- **Tested Decision:** Action at 1030 admission regarding scheduled warfarin 7.5 mg when INR is 5.2 with active bleeding
- **Baseline/Global-Exhibit Info:** Global exhibits admission_record (home meds) and initial_assessment_labs (INR 5.2, gingival oozing, ecchymoses).
- **Later Stage Info:** stage_1_1400 exhibit narrates: ED provider orders warfarin held pending INR results. Cardiology hospitalist orders: continue holding warfarin; vitamin K 2.5 mg PO.
- **Earliest Point Answerable:** Baseline (1030 admission, before stage_1_1400 orders)
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `BASELINE_BEFORE_FIRST_STAGE`
- **Proposed Anchor:** *None (Non-anchor disposition)*
- **Confidence:** HIGH
- **Rationale/Evidence:** Question tests the nurse immediate action at 1030 admission. stage_1_1400 exhibit reveals that the provider ordered warfarin held and gave vitamin K, leaking option B. No baseline stage exists in caseStudy.stages[].

#### Part 2 (`gpt_case_warfarin_mvr_2026_06_11_01_q2`, queueIndex: 166, type: `select_all`)

- **Tested Decision:** Nursing response during admission medication reconciliation upon discovering unapproved naproxen use
- **Baseline/Global-Exhibit Info:** Medication reconciliation during 1030 admission.
- **Later Stage Info:** stage_1_1400 exhibit explicitly lists: Nursing actions: ... medication reconciliation, and provider notification of naproxen exposure.
- **Earliest Point Answerable:** Baseline (1030 admission med reconciliation)
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `BASELINE_BEFORE_FIRST_STAGE`
- **Proposed Anchor:** *None (Non-anchor disposition)*
- **Confidence:** HIGH
- **Rationale/Evidence:** Medication reconciliation occurs at intake. stage_1_1400 explicitly narrates provider notification of naproxen exposure, giving away key options.

#### Part 3 (`gpt_case_warfarin_mvr_2026_06_11_01_q3`, queueIndex: 167, type: `dropdown_cloze`)

- **Tested Decision:** Client teaching regarding oral vitamin K 2.5 mg ordered during Stage 1
- **Baseline/Global-Exhibit Info:** Vitamin K not yet ordered.
- **Later Stage Info:** stage_1_1400 exhibit provides provider order for oral vitamin K 2.5 mg.
- **Earliest Point Answerable:** stage_1_1400
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_1_1400`
- **Confidence:** HIGH
- **Rationale/Evidence:** Stem explicitly references vitamin K ordered during Stage 1.

#### Part 4 (`gpt_case_warfarin_mvr_2026_06_11_01_q4`, queueIndex: 168, type: `matrix`)

- **Tested Decision:** Classifying nursing actions at 0645 for acute major bleeding (gross hematuria, INR 6.8, lightheadedness)
- **Baseline/Global-Exhibit Info:** Minor bleeding only at baseline.
- **Later Stage Info:** stage_3_0645 presents gross hematuria and stat labs.
- **Earliest Point Answerable:** stage_3_0645
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_3_0645`
- **Confidence:** HIGH
- **Rationale/Evidence:** Assesses deterioration occurring at 0645 in stage_3_0645.

#### Part 5 (`gpt_case_warfarin_mvr_2026_06_11_01_q5`, queueIndex: 169, type: `select_all`)

- **Tested Decision:** Nursing actions for administering IV vitamin K and 4-factor PCC for major hemorrhage
- **Baseline/Global-Exhibit Info:** PCC and IV vitamin K not ordered.
- **Later Stage Info:** stage_3_1200 orders exhibit gives PCC and IV vitamin K orders.
- **Earliest Point Answerable:** stage_3_1200
- **Does Later Stage Assist/Expose Answer:** No
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_3_1200`
- **Confidence:** HIGH
- **Rationale/Evidence:** Orders for urgent reversal are given in stage_3_1200.

#### Part 6 (`gpt_case_warfarin_mvr_2026_06_11_01_q6`, queueIndex: 170, type: `multiple_choice`)

- **Tested Decision:** Handoff statement at 1200 evaluating transition status post-reversal
- **Baseline/Global-Exhibit Info:** Intake data only.
- **Later Stage Info:** stage_3_1200 provides 1200 evaluation data (INR 3.8, Hb 9.8, negative head CT).
- **Earliest Point Answerable:** stage_3_1200
- **Does Later Stage Assist/Expose Answer:** No
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_3_1200`
- **Confidence:** HIGH
- **Rationale/Evidence:** Evaluates post-reversal stabilization at 1200 in stage_3_1200.

---

## Parent 7: `cs_thyroid_storm_main`

- **Bank:** `banks/hard-cases-canonical.json`
- **Declared Stages:** `stage_0830, stage_1200`
- **Proposed Parent Anchor Vector:** `[ BASELINE_BEFORE_FIRST_STAGE, stage_0830, stage_0830, stage_1200 ]`
- **Parent Recoverability:** `STRUCTURALLY_UNREPRESENTABLE_BASELINE_GAP`
- **Coherence Check:** Part 1 tests differentiating 0800 triage presentation from global exhibit ex_triage_0800. First declared stage stage_0830 provides diagnostic confirmation and orders. Part 2 (row 370 gate breach) is cleanly anchored to stage_0830, hiding stage_1200 and neutralizing the answer leak.

### Part-Level Adjudications (4 parts):

#### Part 1 (`cs_thyroid_storm_q1`, queueIndex: 369, type: `matrix`)

- **Tested Decision:** Differentiating 0800 triage cues as uncomplicated hyperthyroidism vs. thyroid storm
- **Baseline/Global-Exhibit Info:** Global exhibit ex_triage_0800 contains all cues (T 104.2, HR 152 irregular, bounding pulses, diaphoresis, delirium).
- **Later Stage Info:** stage_0830 gives TSH, Free T4, Afib with RVR, and thyroid storm orders (PTU, Lugol, hydrocortisone).
- **Earliest Point Answerable:** Baseline (0800 triage, before stage_0830)
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `BASELINE_BEFORE_FIRST_STAGE`
- **Proposed Anchor:** *None (Non-anchor disposition)*
- **Confidence:** HIGH
- **Rationale/Evidence:** Part 1 analyzes the 0800 triage presentation. stage_0830 orders definitively reveal thyroid storm diagnosis. No baseline stage exists in caseStudy.stages[].

#### Part 2 (`cs_thyroid_storm_q2`, queueIndex: 370, type: `ordered_response`)

- **Tested Decision:** Sequencing administration of 0830 prescribed medications (beta blocker -> PTU -> Lugols -> hydrocortisone)
- **Baseline/Global-Exhibit Info:** Orders not yet present.
- **Later Stage Info:** stage_0830 provides the 0830 orders. CRITICAL LEAK: stage_1200 exhibit lists: The client has received IV fluids, propranolol, PTU, Lugol iodine, and hydrocortisone as prescribed.
- **Earliest Point Answerable:** stage_0830
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_0830`
- **Confidence:** HIGH
- **Rationale/Evidence:** GATE-BREACH ROW 370. Stem explicitly says Based on the 0830 orders. Anchoring to stage_0830 hides stage_1200, which verbatim reveals the correct administration order.

#### Part 3 (`cs_thyroid_storm_q3`, queueIndex: 371, type: `select_all`)

- **Tested Decision:** Supportive interventions to manage hyperpyrexia and safety between 0800 and 1200
- **Baseline/Global-Exhibit Info:** Hyperpyrexia and agitation noted at 0800.
- **Later Stage Info:** Can be planned once orders and diagnosis established at 0830.
- **Earliest Point Answerable:** stage_0830
- **Does Later Stage Assist/Expose Answer:** No
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_0830`
- **Confidence:** HIGH
- **Rationale/Evidence:** Care plan established at 0830 alongside acute pharmacological management.

#### Part 4 (`cs_thyroid_storm_q4`, queueIndex: 372, type: `multiple_choice`)

- **Tested Decision:** Recognizing PTU-induced agranulocytosis (WBC 2.8) on 1200 laboratory panel
- **Baseline/Global-Exhibit Info:** 1200 labs not available.
- **Later Stage Info:** stage_1200 provides 1200 laboratory evaluation data.
- **Earliest Point Answerable:** stage_1200
- **Does Later Stage Assist/Expose Answer:** No
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_1200`
- **Confidence:** HIGH
- **Rationale/Evidence:** Tests evaluation of 1200 laboratory results presented in stage_1200.

---

## Parent 8: `opus_tpn_case_mucositis_01`

- **Bank:** `banks/hard-cases-canonical.json`
- **Declared Stages:** `stage_1, stage_2, stage_3`
- **Proposed Parent Anchor Vector:** `[ stage_1, stage_1, stage_2, stage_2, stage_3, stage_3 ]`
- **Parent Recoverability:** `FULLY_RECOVERABLE`
- **Coherence Check:** Monotonic 2-2-2 vector across 3 stages. Part 3 (row 395 gate breach) is cleanly anchored to stage_2, hiding stage_3 and neutralizing the answer leak.

### Part-Level Adjudications (6 parts):

#### Part 1 (`opus_tpn_case_mucositis_01_q1`, queueIndex: 393, type: `multiple_choice`)

- **Tested Decision:** Identifying emerging CRBSI/septic shock at Stage 1 post-fluid bolus
- **Baseline/Global-Exhibit Info:** Baseline fever and PICC erythema; response to bolus pending.
- **Later Stage Info:** stage_1 describes persistent hypotension and rising lactate post-bolus.
- **Earliest Point Answerable:** stage_1
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_1`
- **Confidence:** HIGH
- **Rationale/Evidence:** Stem explicitly evaluates response to fluid bolus in Stage 1.

#### Part 2 (`opus_tpn_case_mucositis_01_q2`, queueIndex: 394, type: `multiple_choice`)

- **Tested Decision:** Managing refractory hyperglycemia (BG 324) on TPN at Stage 1 (TPN rate reduction + regular insulin infusion)
- **Baseline/Global-Exhibit Info:** Initial glucose 248.
- **Later Stage Info:** stage_1 shows BG 324 despite sliding scale.
- **Earliest Point Answerable:** stage_1
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_1`
- **Confidence:** HIGH
- **Rationale/Evidence:** Evaluates glycemic escalation occurring in Stage 1.

#### Part 3 (`opus_tpn_case_mucositis_01_q3`, queueIndex: 395, type: `ordered_response`)

- **Tested Decision:** Sequencing interventions when preliminary blood culture flags positive before peripheral at Stage 2
- **Baseline/Global-Exhibit Info:** Cultures pending.
- **Later Stage Info:** stage_2 provides preliminary culture report. CRITICAL LEAK: stage_3 exhibit confirms CRBSI, orders PICC removed, places new line for TPN, and continues vancomycin.
- **Earliest Point Answerable:** stage_2
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_2`
- **Confidence:** HIGH
- **Rationale/Evidence:** GATE-BREACH ROW 395. Stem explicitly says At Stage 2. Anchoring to stage_2 hides stage_3, which directly reveals line removal and alternative central access sequence.

#### Part 4 (`opus_tpn_case_mucositis_01_q4`, queueIndex: 396, type: `multiple_choice`)

- **Tested Decision:** Managing severe mucositis pain and oral care refusal at Stage 2 (coordinate analgesia prior to care)
- **Baseline/Global-Exhibit Info:** Mucositis noted but pain refusal occurs at Stage 2.
- **Later Stage Info:** stage_2 describes oral care refusal due to bleeding mucositis pain.
- **Earliest Point Answerable:** stage_2
- **Does Later Stage Assist/Expose Answer:** **YES**
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_2`
- **Confidence:** HIGH
- **Rationale/Evidence:** Addresses patient refusal during Stage 2 update.

#### Part 5 (`opus_tpn_case_mucositis_01_q5`, queueIndex: 397, type: `matrix`)

- **Tested Decision:** Evaluating clinical response vs. ongoing monitoring cues at Stage 3 (lactate, glucose, temp vs triglycerides)
- **Baseline/Global-Exhibit Info:** Earlier stage data.
- **Later Stage Info:** stage_3 provides post-intervention lab panel and vitals.
- **Earliest Point Answerable:** stage_3
- **Does Later Stage Assist/Expose Answer:** No
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_3`
- **Confidence:** HIGH
- **Rationale/Evidence:** Evaluates post-intervention response in stage_3.

#### Part 6 (`opus_tpn_case_mucositis_01_q6`, queueIndex: 398, type: `multiple_choice`)

- **Tested Decision:** Evaluating safety of enteral transition vs. continuing TPN at Stage 3 given oral tolerance
- **Baseline/Global-Exhibit Info:** Intake data only.
- **Later Stage Info:** stage_3 describes patient tolerating gentle rinses but unable to swallow liquids.
- **Earliest Point Answerable:** stage_3
- **Does Later Stage Assist/Expose Answer:** No
- **Proposed Disposition:** `ANCHOR_RECOVERED`
- **Proposed Anchor:** `stage_3`
- **Confidence:** HIGH
- **Rationale/Evidence:** Assesses nutritional transition readiness at Stage 3.

---

