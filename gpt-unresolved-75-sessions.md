# GPT Adjudication Sessions — 75 Unresolved Residual Topics

10 sessions, grouped by category (≤15 items each). Paste one session at a time: the **Prompt**
block, then the **Items** block. The 46 canonical topics are listed once at the end for the out_of_category option.

---

## S01 — Reduction of Risk Potential (15 items)

**Prompt**
```
You are assigning ONE canonical NCLEX topic to each item, or determining the category itself is wrong.
For each id, choose exactly one:
  - propose:<canonical topic FROM candidateSet>  — only if it genuinely fits. Do NOT pick the least-bad.
  - out_of_category:<canonical topic NOT in candidateSet>  — if the true topic is clearly a canonical
    topic the current category does not license. This flags a CATEGORY error (route to the category worklist).
  - abstain  — if nothing canonical genuinely fits.
These 75 already defeated a first-pass classifier (it abstained), so expect out_of_category/abstain to be
common and legitimate. Return one line per id: <id> | <decision> | <topic-or-null> | <one-sentence reason>.
```
**Items**
```
id: dev_infusion_duration_vtbi_01  [fill_in_blank]
  oldTopic (free-text): infusion pump time verification
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: A nurse checks an IV infusion pump while planning the next assessment. Using the screen shown, calculate how many minutes remain until the programmed volume to be infused is complete if the rate is unchanged. Record a whole number.
  correctAnswer: b1: 120 min (tolerance 0)
  rationale: The pump shows VTBI 250 mL and rate 125 mL/hr. Time = VTBI ÷ rate × 60 = 250 ÷ 125 × 60 = 120 minutes.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_u6_matrix_cloze_2026_06_09_cloze_transfusion_trali_09  [dropdown_cloze]
  oldTopic (free-text): Transfusion-related acute lung injury response
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: Twenty minutes after a packed red blood cell transfusion begins, a client develops acute dyspnea, oxygen saturation 84%, fever, hypotension, and bilateral crackles. There is no jugular venous distention. Complete the nursing statement.
  correctAnswer: 1: transfusion-related acute lung injury; 2: stop the transfusion; 3: 0.9% sodium chloride using new tubing
  rationale: Acute hypoxemia, dyspnea, fever, hypotension, and noncardiogenic pulmonary edema during transfusion are concerning for transfusion-related acute lung injury. The nurse stops the transfusion and maintains IV access with normal saline through new tubing.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_case_gap_2026_06_11_case_tls_01_q4  [fill_in_blank]
  oldTopic (free-text): tumor lysis syndrome urine output monitoring
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: At Stage 1, the client's urine output is 80 mL total over the past 4 hours. Calculate the average urine output in mL/hr. Enter a whole number.
  correctAnswer: b1: 20 mL/hr (tolerance 0)
  rationale: Eighty mL divided by 4 hours equals 20 mL/hr. This is below the common adult minimum benchmark of about 30 mL/hr and supports oliguria in the setting of TLS-associated kidney injury.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_case_gap_2026_06_11_adhf_cloze_02  [dropdown_cloze]
  oldTopic (free-text): Acute pulmonary edema in heart failure
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: Complete the clinical judgment statement using the updated assessment data.
  correctAnswer: 1: acute pulmonary edema with respiratory failure; 2: pink frothy sputum, worsening hypoxemia, and crackles extending upward
  rationale: Pink frothy sputum, rapidly worsening hypoxemia, restlessness, and diffuse crackles indicate acute pulmonary edema that can progress to respiratory failure.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_case_gap_2026_06_11_adhf_fib_04  [fill_in_blank]
  oldTopic (free-text): Evaluating diuretic response
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: Calculate the client's net fluid balance since arrival in mL. Enter a negative number for a net loss.
  correctAnswer: b1: -1180 mL (tolerance 0)
  rationale: Net balance is intake minus output: 920 mL - 2,100 mL = -1,180 mL. The negative balance supports an initial diuretic response, but oxygenation and perfusion still require reassessment.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_case_gap_2026_06_11_aki_cloze_02  [dropdown_cloze]
  oldTopic (free-text): Hyperkalemia in acute kidney injury
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: Complete the clinical judgment statement using the latest data.
  correctAnswer: 1: life-threatening dysrhythmia; 2: potassium 6.2 mEq/L with peaked T waves
  rationale: Severe hyperkalemia with ECG changes is immediately dangerous because it can progress to lethal dysrhythmias.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_case_gap_2026_06_11_aki_fib_04  [fill_in_blank]
  oldTopic (free-text): Oliguria in acute kidney injury
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: The client weighs 80 kg. Calculate the urine output for the last 8 hr in mL/kg/hr. Round to the nearest hundredth.
  correctAnswer: b1: 0.19 mL/kg/hr (tolerance 0.01)
  rationale: Urine output is 120 mL ÷ 80 kg ÷ 8 hr = 0.1875 mL/kg/hr, rounded to 0.19 mL/kg/hr. This is oliguria and supports ongoing AKI risk.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_case_gap_2026_06_11_adrenal_fib_04  [fill_in_blank]
  oldTopic (free-text): Mean arterial pressure in shock
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: Calculate the mean arterial pressure (MAP) for BP 78/40 mm Hg using MAP = (SBP + 2DBP) / 3. Round to the nearest whole number.
  correctAnswer: b1: 53 mm Hg (tolerance 1)
  rationale: MAP = (78 + 2[40]) / 3 = 158 / 3 = 52.7, rounded to 53 mm Hg. This is below the usual perfusion target and supports shock-level urgency.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q1  [multiple_choice]
  oldTopic (free-text): post-fall assessment
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: Stage 1 describes a resident found on the floor. What should the nurse do first?
  correctAnswer: Keep the resident still and assess airway, breathing, circulation, pain, and injury
  rationale: Before moving the resident, the nurse should assess airway, breathing, circulation, level of consciousness, pain, and obvious injury to prevent worsening an occult injury.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_gap_2026_06_12_nonmcq_balanced_fib_wound_teachback_12  [fill_in_blank]
  oldTopic (free-text): home health wound-care teaching with teach-back failure
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: During a home health visit, the nurse reviews a wound-care log. Last visit, the wound measured 3.5 cm by 2.0 cm. Today it measures 4.5 cm by 2.4 cm. By how many square centimeters did the wound area increase? Round to the nearest tenth if needed.
  correctAnswer: b1: 3.8 cm² (tolerance 0)
  rationale: Last area: 3.5 × 2.0 = 7.0 cm². Today's area: 4.5 × 2.4 = 10.8 cm². Increase: 10.8 − 7.0 = 3.8 cm².
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: hl_smoke_2026_06_14_aki_hyperkalemia_01  [highlight]
  oldTopic (free-text): acute kidney injury and hyperkalemia
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: Highlight the findings that require immediate follow-up.
  correctAnswer: Urine output 18 mL over 4 hours.; Potassium 6.7 mEq/L.; Telemetry strip shows tall, peaked T waves.
  rationale: Severely decreased urine output, potassium 6.7 mEq/L, and peaked T waves suggest clinically important hyperkalemia in the setting of acute kidney injury and require immediate escalation. The stable blood pressure and mild incisional pain are not the priority cues.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: opus_car_t_crs_2026_06_11_case_01_q1  [matrix]
  oldTopic (free-text): CAR-T cytokine release syndrome and ICANS monitoring
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: The nurse reviews the clinical cues from Stage 1. For each cue, indicate whether it supports early Cytokine Release Syndrome (CRS), neutropenic fever/sepsis risk, or is a nonspecific finding. Each row may have more than one correct category.
  correctAnswer: Fever, rigors, and myalgias: Supports early Cytokine Release Syndrome (CRS), Supports neutropenic fever/sepsis risk; Absolute neutrophil count (ANC) 0.1 × 10³/µL: Supports neutropenic fever/sepsis risk; CRP 86 mg/L and ferritin 1,450 ng/mL: Supports early Cytokine Release Syndrome (CRS); Mild fatigue reported at 1600: Nonspecific or expected finding
  rationale: Recognizing the clinical signs of both CRS and neutropenic fever is critical in the post-CAR-T setting. Fever, rigors, and myalgias are hallmark initial signs of CRS but are also classic symptoms of sepsis in a neutropenic patient. An ANC of 0.1 × 10³/µL places the patient at profound risk for neutropenic fever and sepsis, requiring immediate intervention. The elevation of CRP and ferritin strongly supports the onset of CRS. Mild fatigue is a nonspecific finding often expected following lymphodepleting chemotherapy.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: opus_car_t_crs_2026_06_11_case_01_q2  [select_all]
  oldTopic (free-text): CAR-T cytokine release syndrome and ICANS monitoring
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: Based on the Stage 1 findings, which of the following actions should the nurse anticipate or implement? Select all that apply.
  correctAnswer: Notify the provider and activate the institutional CRS pathway.; Obtain blood cultures per protocol, including central-line lumens.; Anticipate initiating empiric broad-spectrum antibiotics per neutropenic fever protocol.; Administer acetaminophen as ordered for symptom management.; Increase the frequency of vital signs monitoring and continue ICE scoring.
  rationale: In a profoundly neutropenic patient post-CAR-T infusion, a new fever must be treated concurrently as potential Cytokine Release Syndrome (CRS) and a neutropenic fever/sepsis medical emergency. The nurse should notify the provider to activate the CRS pathway, obtain blood cultures per protocol, anticipate initiating broad-spectrum antibiotics, administer acetaminophen for symptom management, and increase the frequency of monitoring and ICE scoring. Waiting for culture results before giving antibiotics or assuming the fever is only CRS can cause fatal delays in treating sepsis.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: opus_car_t_crs_2026_06_11_case_01_q3  [ordered_response]
  oldTopic (free-text): CAR-T cytokine release syndrome and ICANS monitoring
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: At Stage 2, the patient is experiencing hypoxia, hypotension, and a declining ICE score. The provider has written several new orders. In what order should the nurse implement the following actions? Drag and drop to arrange the sequence.
  correctAnswer: 1. Apply low-flow oxygen via nasal cannula and raise the head of the bed.; 2. Begin the ordered normal saline IV fluid bolus.; 3. Administer tocilizumab IV as ordered for CRS Grade 2.; 4. Administer dexamethasone IV as ordered for concurrent probable ICANS.; 5. Prepare for possible ICU transfer while continuing frequent monitoring.
  rationale: Using the ABCs (Airway, Breathing, Circulation) framework, the nurse must first stabilize oxygenation by applying low-flow oxygen and raising the head of the bed. Second, initiate the IV fluid bolus to address hypotension and support perfusion. Once basic physiological stability is addressed, pharmacological interventions follow: administer tocilizumab (the definitive treatment for CRS) and then dexamethasone (for concurrent ICANS). Finally, prepare for potential ICU transfer while continuing frequent monitoring. Transfer preparation and team communication may occur in parallel, but they must not delay life-saving oxygen, fluids, or ordered medications.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: opus_car_t_crs_2026_06_11_case_01_q5  [dropdown_cloze]
  oldTopic (free-text): CAR-T cytokine release syndrome and ICANS monitoring
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: The nurse evaluates the patient's response 12 hours after tocilizumab and dexamethasone administration. Complete the sentences by choosing from the dropdown lists.
  correctAnswer: 1: a resolving fever and improved blood pressure without vasopressors; 2: improving urine output and an ICE score of 9/10; 3: is an unreliable marker alone because tocilizumab suppresses CRP production; 4: frequent monitoring must continue because CRS or ICANS can recur
  rationale: Clinical improvement after tocilizumab and dexamethasone must be evaluated using multiple parameters. A resolving fever, improved blood pressure without vasopressors, improved urine output, and an ICE score of 9/10 indicate genuine recovery from CRS and ICANS. However, the nurse must recognize that tocilizumab suppresses CRP production by blocking the IL-6 pathway, making a declining CRP an unreliable marker alone. Frequent monitoring must continue because CRS or ICANS can recur or fluctuate after initial improvement.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

```

## S02 — Reduction of Risk Potential (10 items)

**Prompt**
```
You are assigning ONE canonical NCLEX topic to each item, or determining the category itself is wrong.
For each id, choose exactly one:
  - propose:<canonical topic FROM candidateSet>  — only if it genuinely fits. Do NOT pick the least-bad.
  - out_of_category:<canonical topic NOT in candidateSet>  — if the true topic is clearly a canonical
    topic the current category does not license. This flags a CATEGORY error (route to the category worklist).
  - abstain  — if nothing canonical genuinely fits.
These 75 already defeated a first-pass classifier (it abstained), so expect out_of_category/abstain to be
common and legitimate. Return one line per id: <id> | <decision> | <topic-or-null> | <one-sentence reason>.
```
**Items**
```
id: gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_q4  [select_all]
  oldTopic (free-text): Acute ischemic stroke thrombolysis and thrombectomy complications
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: At Stage 2, the client is a thrombectomy candidate with BP 186/102 mmHg. Which nursing actions are appropriate before transfer to the neurointerventional suite? Select all that apply.
  correctAnswer: Start the prescribed IV nicardipine infusion and titrate per protocol toward the pre-thrombectomy BP threshold; Maintain strict NPO status until a trained dysphagia screen is completed; Ensure two patent IV lines and continuous cardiac monitoring; Verify that proxy consent has been obtained because the client cannot provide informed consent due to aphasia
  rationale: For a thrombectomy candidate, the nurse supports ordered titratable BP control, maintains NPO status because dysphagia risk has not been cleared, ensures IV access and monitoring, and confirms proxy consent when the neurologic deficit prevents informed consent. Oral intake before swallowing screening is unsafe. Nitroprusside is generally avoided as an initial first-line stroke BP agent because it can raise intracranial pressure and cause abrupt hypotension; the case order is nicardipine.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_bowtie  [bowtie]
  oldTopic (free-text): Acute ischemic stroke thrombolysis and thrombectomy complications
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: Complete the bow-tie for this Stage 4 situation: after successful left MCA thrombectomy, the client initially improved, then became somnolent with loss of verbal output and a new sluggish left pupil. Emergent CT shows a 3 cm left frontoparietal intraparenchymal hemorrhage with edema and 4 mm left-to-right midline shift. The client is intubated, warfarin reversal has been ordered, and nicardipine is being titrated to the provider's stat systolic BP target.
  correctAnswer: condition: Post-reperfusion symptomatic intracerebral hemorrhage; actions: Maintain serial neurologic assessments every 15 minutes, tracking GCS, pupils, and motor response, Titrate nicardipine per order to maintain the prescribed systolic BP target; parameters: Neurologic examination: GCS, pupil size/reactivity, and motor response, Systolic BP trend on the nicardipine infusion
  rationale: The best synthesis is post-reperfusion symptomatic intracerebral hemorrhage because the client had initial improvement after successful thrombectomy, then abruptly developed decreased consciousness, loss of speech, and ipsilateral pupil dilation, and CT confirms hemorrhage with midline shift. The nurse's priority actions are frequent neurologic assessment and prescribed BP control because worsening examination or uncontrolled systolic BP can signal or worsen hematoma expansion. The priority parameters mirror those actions: GCS/pupils/motor response and systolic BP trend.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: io_fib_hf_net_balance_01  [fill_in_blank]
  oldTopic (free-text): fluid balance monitoring
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: A nurse reviews the 8-hour intake and output record below for a client with heart failure. Calculate the client's net fluid balance for the shift. Record the answer in milliliters (mL), including the sign.
  correctAnswer: b1: 580 mL (tolerance 0)
  rationale: Intake totals 360 + 240 + 500 + 100 = 1,200 mL. Output totals 560 + 60 = 620 mL. Net balance = 1,200 − 620 = +580 mL. A positive balance in heart failure requires continued assessment for fluid overload.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: io_matrix_prerenal_aki_recheck_04  [matrix]
  oldTopic (free-text): acute kidney injury fluid response
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: A client with suspected prerenal acute kidney injury is reassessed after a provider-prescribed fluid challenge. The provider's reassessment goal is at least 240 mL of urine output during this 6-hour period. Using the record shown, classify each nursing interpretation.
  correctAnswer: Notify the provider that the urine output goal was not met.: Appropriate interpretation; Recognize that intake exceeded output during the reassessment period.: Appropriate interpretation; Increase oral fluids because the client has a negative balance.: Inappropriate interpretation; Continue to monitor lung sounds while additional fluids are considered.: Appropriate interpretation
  rationale: Intake totals 1,120 mL and output totals 210 mL, giving a net balance of +910 mL. The urine output did not meet the stated 240 mL goal, so provider notification is appropriate. Because intake exceeds output, the nurse should monitor for fluid overload while the response to fluids is evaluated.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: io_matrix_bowel_prep_deficit_08  [matrix]
  oldTopic (free-text): bowel preparation fluid deficit
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: A client is completing bowel preparation for a colonoscopy. The nurse reviews the intake and output record below. Classify each nursing action.
  correctAnswer: Assess orthostatic vital signs and mucous membranes.: Appropriate action; Encourage allowed clear liquids if not contraindicated.: Appropriate action; Ignore the balance because stool output is expected during bowel preparation.: Inappropriate action; Notify the provider of dizziness, hypotension, or inability to maintain intake.: Appropriate action
  rationale: Intake totals 1,290 mL and output totals 2,500 mL, giving a net balance of −1,210 mL. Stool output is expected with bowel preparation, but the net deficit still requires assessment for dehydration, encouragement of permitted clear liquids if safe, and provider notification for concerning symptoms or inability to maintain intake.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_u3_labtrend_2026_06_09_cloze_magnesium_decline_08  [dropdown_cloze]
  oldTopic (free-text): falling magnesium trend
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: A client with prolonged diarrhea reports tremors and palpitations. Complete the statement using the magnesium trend in the visual.
  correctAnswer: 1: dysrhythmias related to worsening hypomagnesemia; 2: prescribed magnesium replacement and cardiac monitoring
  rationale: The magnesium is trending downward to a low level. Hypomagnesemia can contribute to tremors, neuromuscular irritability, and dysrhythmias, so replacement and monitoring are expected.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_u3_labtrend_2026_06_09_b_or_gi_bleed_hgb_06  [ordered_response]
  oldTopic (free-text): falling hemoglobin trend and suspected bleeding
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: A client admitted for a gastrointestinal bleed becomes lightheaded when sitting up. The nurse reviews the CBC trend in the visual. Place the nursing actions in order.
  correctAnswer: 1. Assess airway, breathing, circulation, vital signs, and level of consciousness.; 2. Notify the provider of symptomatic decline with falling hemoglobin and hematocrit.; 3. Prepare to obtain type and screen or type and crossmatch as prescribed.; 4. Maintain IV access and prepare for prescribed fluid or blood product administration.
  rationale: Assessment comes first because the client is symptomatic. The nurse then escalates the falling CBC trend, obtains ordered blood bank testing, and maintains access for ordered resuscitation or transfusion.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_u3_labtrend_2026_06_09_b_cloze_sodium_overcorrection_08  [dropdown_cloze]
  oldTopic (free-text): rapid sodium correction trend
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: A client admitted with severe hyponatremia is receiving prescribed hypertonic saline. The nurse reviews the sodium trend in the visual. Complete the statement.
  correctAnswer: 1: possible overly rapid sodium correction; 2: notify the provider and anticipate reassessment of the infusion plan
  rationale: The sodium rises from 118 to 134 mEq/L over 12 hours, a large rapid increase. The nurse should notify the provider because overly rapid correction can cause neurologic harm.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: rhy_afib_001  [matrix]
  oldTopic (free-text): new-onset atrial fibrillation
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: A client is admitted with the rhythm shown (no organized P waves, an irregularly irregular ventricular response at about 134/min, narrow QRS). For each assessment finding, indicate whether it is an anticipated finding for this rhythm or one that requires immediate provider notification.
  correctAnswer: Irregularly irregular radial pulse: Anticipated finding; New facial droop with right-arm weakness and slurred speech: Requires immediate provider notification; Apical-radial pulse deficit of 12 beats/min: Anticipated finding; Blood pressure 84/52 mm Hg with lightheadedness and diaphoresis: Requires immediate provider notification; Client reports a sensation of fluttering palpitations: Anticipated finding
  rationale: Atrial fibrillation produces a chaotic atrial baseline with no organized P waves and an irregularly irregular ventricular response, so an irregularly irregular pulse, a pulse deficit (not every ventricular contraction perfuses to the radial artery), and palpitations are all anticipated. Findings that signal a complication demand urgent notification: focal neurologic deficits suggest an embolic stroke (a fibrillating atrium can throw a clot), and hypotension with lightheadedness and diaphoresis indicates hemodynamic instability from the rapid ventricular rate.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: vit_05  [multiple_choice]
  oldTopic (free-text): increased intracranial pressure
  candidateSet: ['ABG & Acid-Base Interpretation', 'Perioperative Care', 'Procedural Complications & Dialysis', 'Laboratory & Diagnostic Tests']
  stem: A client is being monitored in the neuro-ICU following a severe traumatic brain injury. The nurse observes the following vital sign trends over the last 2 hours. Based on these findings, what is the nurse's most immediate concern?
  correctAnswer: Brainstem herniation
  rationale: The vital signs show Cushing's triad: a progressively widening pulse pressure (systolic BP is rising significantly while diastolic BP remains stable or drops), combined with a plummeting heart rate (bradycardia) and an erratic or dropping respiratory rate. This indicates a life-threatening increase in intracranial pressure with concern for possible impending brainstem herniation.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

```

## S03 — Physiological Adaptation (15 items)

**Prompt**
```
You are assigning ONE canonical NCLEX topic to each item, or determining the category itself is wrong.
For each id, choose exactly one:
  - propose:<canonical topic FROM candidateSet>  — only if it genuinely fits. Do NOT pick the least-bad.
  - out_of_category:<canonical topic NOT in candidateSet>  — if the true topic is clearly a canonical
    topic the current category does not license. This flags a CATEGORY error (route to the category worklist).
  - abstain  — if nothing canonical genuinely fits.
These 75 already defeated a first-pass classifier (it abstained), so expect out_of_category/abstain to be
common and legitimate. Return one line per id: <id> | <decision> | <topic-or-null> | <one-sentence reason>.
```
**Items**
```
id: opus_agvd_case_agvhd_01_q6  [matrix]
  oldTopic (free-text): Acute Graft-Versus-Host Disease
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: At Stage 3, after 48 hours of ruxolitinib and continued methylprednisolone, the nurse evaluates the patient's response. For each clinical finding, specify whether it indicates a therapeutic response or a finding requiring continued vigilance.
  correctAnswer: Stool volume decreased to 900 mL/24h with no visible blood: Indicates Therapeutic Response; Stabilization and fading of rash on upper chest and ears: Indicates Therapeutic Response; Blood glucose of 162 mg/dL: Requires Continued Vigilance; Total bilirubin decreased to 2.4 mg/dL: Indicates Therapeutic Response; Absence of fever while on ruxolitinib and high-dose corticosteroids: Requires Continued Vigilance
  rationale: The nurse correctly identifies that improvements in stool volume, rash extent, and bilirubin levels directly reflect resolution of the aGVHD. However, the nurse must remain vigilant about iatrogenic complications, such as steroid-induced hyperglycemia and the profound immunosuppression masked by the lack of a febrile response.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: q4_2  [multiple_choice]
  oldTopic (free-text): Hemolytic Reaction Identification
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: The lower back pain and hypotension suggest which type of reaction?
  correctAnswer: Acute hemolytic reaction
  rationale: Back pain and hypotension are classic signs of acute hemolytic reaction due to ABO incompatibility.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: q4_5  [multiple_choice]
  oldTopic (free-text): Hemolytic Reaction Confirmation
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: Which lab result would confirm an acute hemolytic reaction?
  correctAnswer: Positive Direct Coombs test
  rationale: A positive Direct Coombs test indicates antibodies are attached to the RBCs.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: q6_1  [multiple_choice]
  oldTopic (free-text): Cushing Triad Recognition
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: The set of vital signs at 12:00 is known as:
  correctAnswer: Cushing's Triad
  rationale: Bradycardia, hypertension with widening pulse pressure, and irregular respirations indicate late-stage increased ICP.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: q6_2  [multiple_choice]
  oldTopic (free-text): Cushing Triad Significance
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: What does Cushing's Triad signify in this client?
  correctAnswer: Impending brain herniation
  rationale: Cushing's Triad is a medical emergency indicating late-stage ICP and imminent herniation.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: q6_4  [select_all]
  oldTopic (free-text): ICP Management Interventions
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: Which actions maintain appropriate ICP management? Select all that apply.
  correctAnswer: Elevate head of bed to 30 degrees; Avoid hip flexion; Maintain neutral head alignment
  rationale: Suctioning increases ICP and should be limited.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: q8_1  [multiple_choice]
  oldTopic (free-text): Pyloric Stenosis Recognition
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: Infant A most likely has which condition?
  correctAnswer: Pyloric Stenosis
  rationale: Projectile vomiting and olive-shaped mass are classic for pyloric stenosis.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: q8_2  [multiple_choice]
  oldTopic (free-text): Intussusception Recognition
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: Infant B most likely has which condition?
  correctAnswer: Intussusception
  rationale: Currant jelly stools and episodic pain are hallmark signs of intussusception.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: q8_3  [multiple_choice]
  oldTopic (free-text): Pyloric Stenosis Metabolic Impact
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: What is the primary metabolic concern for Infant A?
  correctAnswer: Metabolic alkalosis
  rationale: Persistent vomiting of gastric acid leads to loss of hydrogen and chloride, causing metabolic alkalosis.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: q8_4  [select_all]
  oldTopic (free-text): Intussusception Interventions
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: Which interventions are appropriate for Infant B (Intussusception)? Select all that apply.
  correctAnswer: Prepare for an air or saline enema; Maintain NPO status; Monitor for normal brown stool passage
  rationale: Air/saline enemas can often reduce intussusception. Normal stool may indicate spontaneous reduction.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: q8_5  [multiple_choice]
  oldTopic (free-text): Intussusception Recovery Sign
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: In Infant B, the passage of a normal brown stool suggests:
  correctAnswer: The intussusception has resolved
  rationale: Normal stool passage indicates the bowel has un-telescoped.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: q10_1  [multiple_choice]
  oldTopic (free-text): Autonomic Dysreflexia Triggers
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: What is the most likely trigger for this condition?
  correctAnswer: Bladder distension
  rationale: The most common triggers are bladder or bowel distension and skin irritation.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: q10_4  [select_all]
  oldTopic (free-text): AD Cause Identification
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: Which actions should the nurse take to identify the cause? Select all that apply.
  correctAnswer: Check the urinary catheter for kinks; Palpate the bladder for distension; Assess for fecal impaction per protocol after bladder causes are addressed; Assess skin for pressure sores or tight clothing
  rationale: After sitting the client upright, systematically evaluate common triggers: urinary obstruction or bladder distension, bowel impaction using protocol, and skin or clothing irritation.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01_q3  [multiple_choice]
  oldTopic (free-text): Acute variceal hemorrhage in cirrhosis
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: Which bleeding source should guide the nurse's priority hypothesis and anticipated plan of care before endoscopic confirmation?
  correctAnswer: Esophageal variceal hemorrhage related to portal hypertension
  rationale: Known cirrhosis, portal hypertension, documented esophageal varices, large-volume hematemesis, ascites, caput medusae, and coagulopathy all point to variceal hemorrhage. The nurse should anticipate variceal-specific therapy while endoscopy is being arranged.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_r1_regen_case_celiac_01_q3  [multiple_choice]
  oldTopic (free-text): Celiac disease with dermatitis herpetiformis
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: At Stage 1, which diagnosis best explains the complete pattern of findings?
  correctAnswer: Celiac disease with dermatitis herpetiformis
  rationale: The markedly elevated tTG-IgA with normal total IgA, Marsh 3a duodenal biopsy, steatorrhea, proximal malabsorption deficiencies, and classic extensor papulovesicular rash point to celiac disease with dermatitis herpetiformis. Perilesional skin biopsy is used to confirm the skin manifestation; the duodenal biopsy confirms intestinal celiac disease.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

```

## S04 — Physiological Adaptation (5 items)

**Prompt**
```
You are assigning ONE canonical NCLEX topic to each item, or determining the category itself is wrong.
For each id, choose exactly one:
  - propose:<canonical topic FROM candidateSet>  — only if it genuinely fits. Do NOT pick the least-bad.
  - out_of_category:<canonical topic NOT in candidateSet>  — if the true topic is clearly a canonical
    topic the current category does not license. This flags a CATEGORY error (route to the category worklist).
  - abstain  — if nothing canonical genuinely fits.
These 75 already defeated a first-pass classifier (it abstained), so expect out_of_category/abstain to be
common and legitimate. Return one line per id: <id> | <decision> | <topic-or-null> | <one-sentence reason>.
```
**Items**
```
id: ekg_b2_mc_01  [multiple_choice]
  oldTopic (free-text): Atrial Fibrillation
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: The nurse is reviewing a client's telemetry monitor and notes a rapid, irregular rhythm with no discernible P waves. The baseline appears wavy and chaotic. Which rhythm should the nurse document?
  correctAnswer: Atrial Fibrillation
  rationale: Atrial fibrillation is characterized by a lack of P waves, a chaotic/wavy baseline (fibrillatory waves), and an 'irregularly irregular' R-R interval. Normal SA node depolarization is replaced by rapid, disorganized electrical impulses from multiple ectopic foci in the atria.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: ekg_b2_mc_07  [multiple_choice]
  oldTopic (free-text): Atrial Flutter
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: A client's monitor displays a rapid, regular rhythm with a saw-tooth baseline pattern. The QRS complexes are narrow and occur at a regular interval. The ventricular rate is 75 beats per minute. How should the nurse identify this rhythm on the rhythm strip?
  correctAnswer: Atrial Flutter with 4:1 conduction
  rationale: Atrial flutter is defined by regular, rapid atrial waves presenting as a 'saw-tooth' pattern, termed flutter (F) waves. The atrial rate is typically 250-350 bpm. The AV node acts as a gatekeeper, conducting only a fraction of these impulses (conduction ratio). Here, the atrial rate is 300 bpm and the ventricular rate is 75 bpm, representing a 4:1 conduction ratio (4 atrial waves to 1 QRS complex).
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: ekg_b2_matrix_10  [matrix]
  oldTopic (free-text): Atrial Arrhythmias
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: The nurse is analyzing telemetry strips for three different clients. Match each rhythm's visual characteristics to the correct clinical arrhythmia classification.
  correctAnswer: Chaotic wavy baseline, irregular QRS rhythm, absence of P waves: Atrial Fibrillation; Regular sawtooth baseline waves (F waves), regular narrow QRS complexes: Atrial Flutter; Rapid, highly regular rate (180 bpm), narrow QRS complexes, P waves buried in T waves: Supraventricular Tachycardia (SVT)
  rationale: Row 1 describes the classic irregular features of atrial fibrillation. Row 2 outlines the sawtooth appearance of atrial flutter. Row 3 details the rapid, regular narrow-complex tachycardia features of SVT.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: ekg_b3_mc_01  [multiple_choice]
  oldTopic (free-text): First-Degree AV Block
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: The nurse is analyzing a client's telemetry strip. The heart rate is 68 beats per minute and regular. Every P wave is followed by a narrow QRS complex. The PR interval is measured at 0.26 seconds and is constant. Which conduction disturbance is present?
  correctAnswer: First-Degree Atrioventricular (AV) Block
  rationale: First-degree AV block is characterized by a prolonged PR interval (>0.20 seconds) that remains constant from beat to beat, with a 1:1 P-to-QRS ratio (no dropped beats). It represents a delay in conduction through the AV node, but all impulses eventually pass to the ventricles.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: ekg_b3_matrix_10  [matrix]
  oldTopic (free-text): AV Heart Blocks
  candidateSet: ['Cardiovascular Disorders', 'Respiratory & Infectious Disorders', 'Renal & Gastrointestinal Disorders', 'Endocrine & Neurological Disorders', 'Electrolyte Imbalances', 'Diabetic Ketoacidosis (DKA)', 'Sepsis & Septic Shock', 'Burn Management']
  stem: The nurse is analyzing heart block parameters for three different clients. Match each rhythm's conduction characteristics to the correct heart block classification.
  correctAnswer: PR interval >0.20 seconds and constant, all P waves conducted to ventricles (1:1 ratio): First-Degree AV Block; PR interval progressively lengthens until a QRS complex is dropped, then resets: Second-Degree AV Block Mobitz I; PR intervals of conducted beats are constant, but there are sudden dropped QRS complexes: Second-Degree AV Block Mobitz II
  rationale: Row 1 outlines the features of first-degree block (prolonged, constant, 1:1 conduction). Row 2 details Mobitz I (progressive lengthening and dropped beat). Row 3 explains Mobitz II (constant PR with sudden dropped beats).
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

```

## S05 — Safety and Infection Control (11 items)

**Prompt**
```
You are assigning ONE canonical NCLEX topic to each item, or determining the category itself is wrong.
For each id, choose exactly one:
  - propose:<canonical topic FROM candidateSet>  — only if it genuinely fits. Do NOT pick the least-bad.
  - out_of_category:<canonical topic NOT in candidateSet>  — if the true topic is clearly a canonical
    topic the current category does not license. This flags a CATEGORY error (route to the category worklist).
  - abstain  — if nothing canonical genuinely fits.
These 75 already defeated a first-pass classifier (it abstained), so expect out_of_category/abstain to be
common and legitimate. Return one line per id: <id> | <decision> | <topic-or-null> | <one-sentence reason>.
```
**Items**
```
id: gpt_gap_2026_06_10_or_pressure_injury_prevention_04  [ordered_response]
  oldTopic (free-text): Pressure injury prevention in rehabilitation
  candidateSet: ['Patient & Environment Safety', 'Transmission-Based Precautions', 'Standard Precautions & Hygiene', 'PPE & Sterile Technique', 'Disaster & Emergency Preparedness', 'Medication Safety & Admin']
  stem: A client with limited sensation and decreased mobility is admitted to a rehabilitation unit with intact skin. Arrange the nursing actions to prevent a pressure injury.
  correctAnswer: 1. Complete a head-to-toe skin inspection and a standardized pressure-injury risk assessment.; 2. Relieve pressure from the heels and sacrum and place the client on an appropriate pressure-redistributing surface.; 3. Create an individualized turning, mobility, nutrition, and moisture-management plan with the care team.; 4. Teach the client and caregiver to inspect skin daily and report nonblanchable redness.; 5. Evaluate skin condition and adherence to the plan each shift and revise the plan if redness or moisture develops.
  rationale: Prevention starts with risk and skin assessment. Immediate pressure relief follows, then an individualized interdisciplinary plan, teaching for continued prevention, and ongoing evaluation with plan revision.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_case_gap_2026_06_11_pressure_ltc_part_1_matrix_risk  [matrix]
  oldTopic (free-text): Pressure injury prevention in long-term care
  candidateSet: ['Patient & Environment Safety', 'Transmission-Based Precautions', 'Standard Precautions & Hygiene', 'PPE & Sterile Technique', 'Disaster & Emergency Preparedness', 'Medication Safety & Admin']
  stem: For each finding, select the prevention concern it most directly supports.
  correctAnswer: Resident cannot reposition independently in bed.: Pressure/mobility; Brief is wet; loose stool noted near sacrum.: Moisture/skin protection; Ate 25% of meals yesterday and drank little fluid.: Nutrition/hydration; Both heels rest directly on the mattress.: Pressure/mobility; Sacral redness blanches when gently pressed.: Pressure/mobility
  rationale: Immobility and heel pressure require offloading and repositioning; moisture requires incontinence care and barrier protection; low intake requires nutrition/hydration support; blanchable redness requires pressure relief and monitoring, not staging as an open injury.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_case_gap_2026_06_11_pressure_ltc_part_2_sata_plan  [select_all]
  oldTopic (free-text): Pressure injury prevention in long-term care
  candidateSet: ['Patient & Environment Safety', 'Transmission-Based Precautions', 'Standard Precautions & Hygiene', 'PPE & Sterile Technique', 'Disaster & Emergency Preparedness', 'Medication Safety & Admin']
  stem: Which interventions should the nurse include in the prevention plan? Select all that apply.
  correctAnswer: Create an individualized repositioning schedule based on skin tolerance, support surface, and mobility.; Offload the heels so they do not rest directly on the mattress.; Provide prompt incontinence care and apply moisture-barrier product as ordered or per protocol.; Request evaluation for a pressure-redistribution mattress or overlay.; Consult the dietitian for poor intake and protein/calorie needs.
  rationale: The plan should individualize repositioning, offload heels, manage moisture promptly, use a pressure-redistribution surface as indicated, and consult dietary support. Massage, donut cushions, and delaying incontinence care increase harm.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_case_gap_2026_06_11_pressure_ltc_part_3_mc_delegate  [multiple_choice]
  oldTopic (free-text): Pressure injury prevention in long-term care
  candidateSet: ['Patient & Environment Safety', 'Transmission-Based Precautions', 'Standard Precautions & Hygiene', 'PPE & Sterile Technique', 'Disaster & Emergency Preparedness', 'Medication Safety & Admin']
  stem: Which task is appropriate for the nurse to delegate to assistive personnel for this resident?
  correctAnswer: Reposition the resident according to the posted plan and report any new redness or pain.
  rationale: Assistive personnel can perform routine repositioning and report skin changes after the nurse establishes the plan. The nurse retains responsibility for assessment, staging, care-plan revision, and clinical referrals.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_case_gap_2026_06_11_pressure_ltc_part_4_cloze_outcome  [dropdown_cloze]
  oldTopic (free-text): Pressure injury prevention in long-term care
  candidateSet: ['Patient & Environment Safety', 'Transmission-Based Precautions', 'Standard Precautions & Hygiene', 'PPE & Sterile Technique', 'Disaster & Emergency Preparedness', 'Medication Safety & Admin']
  stem: Use the 48-hour update to evaluate the plan.
  correctAnswer: 1: improving skin tolerance; 2: continue the prevention plan and reassess skin each shift
  rationale: Less moisture exposure and redness that resolves after pressure relief suggest the prevention plan is improving skin tolerance. Nonblanchable redness, open skin, or worsening pain would require prompt reassessment.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_gap_2026_06_10_b_or_moisture_pressure_prevention_04  [ordered_response]
  oldTopic (free-text): Moisture management for pressure injury prevention
  candidateSet: ['Patient & Environment Safety', 'Transmission-Based Precautions', 'Standard Precautions & Hygiene', 'PPE & Sterile Technique', 'Disaster & Emergency Preparedness', 'Medication Safety & Admin']
  stem: An older adult in a rehabilitation facility is incontinent of urine, spends most of the day in bed, and has intact but reddened sacral skin that blanches. Place the nurse's preventive actions in the best order for this shift.
  correctAnswer: 1. Assess the sacrum, heels, and skin folds and note whether redness blanches.; 2. Cleanse the skin promptly after incontinence using a gentle cleanser.; 3. Apply a moisture-barrier product to areas exposed to urine.; 4. Reposition using pillows or wedges to offload the sacrum and heels.; 5. Update the care plan with the turning schedule and skin findings to report.
  rationale: The nurse assesses first, then removes moisture and protects skin, then offloads pressure, and finally updates the care plan so prevention is consistent across caregivers and shifts.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_case_gap_2026_06_11_sepsis_matrix_01  [matrix]
  oldTopic (free-text): Sepsis from urinary source
  candidateSet: ['Patient & Environment Safety', 'Transmission-Based Precautions', 'Standard Precautions & Hygiene', 'PPE & Sterile Technique', 'Disaster & Emergency Preparedness', 'Medication Safety & Admin']
  stem: Classify each cue.
  correctAnswer: New confusion: Sepsis/organ dysfunction cue; Lactate 3.8 mmol/L: Sepsis/organ dysfunction cue; Obstructing ureteral stone with hydronephrosis: Sepsis/organ dysfunction cue; SpO2 96% on room air: Not a current sepsis cue; Creatinine doubled from baseline: Sepsis/organ dysfunction cue
  rationale: Altered mentation, elevated lactate, AKI, and an obstructed infected urinary source indicate sepsis with organ dysfunction risk. Normal oxygen saturation does not support pneumonia or respiratory failure here.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_gap_jun11_fib_cauti_prevention_01  [fill_in_blank]
  oldTopic (free-text): CAUTI Prevention Bundle
  candidateSet: ['Patient & Environment Safety', 'Transmission-Based Precautions', 'Standard Precautions & Hygiene', 'PPE & Sterile Technique', 'Disaster & Emergency Preparedness', 'Medication Safety & Admin']
  stem: A nurse is reviewing catheter-associated urinary tract infection (CAUTI) prevention with a new graduate nurse. Complete the teaching statement: The single most effective prevention measure is to remove an indwelling urinary catheter when it is no longer medically necessary. Catheter necessity should be reassessed at least every ____ hours, or once ____.
  correctAnswer: b1: 24 hours (tolerance 0); b2: 1 time per day (tolerance 0)
  rationale: The most effective CAUTI prevention strategy is avoiding unnecessary catheter days. A daily or every-24-hour necessity review prompts removal as soon as there is no appropriate indication.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: q3_1  [multiple_choice]
  oldTopic (free-text): Shaken Baby Syndrome Signs
  candidateSet: ['Patient & Environment Safety', 'Transmission-Based Precautions', 'Standard Precautions & Hygiene', 'PPE & Sterile Technique', 'Disaster & Emergency Preparedness', 'Medication Safety & Admin']
  stem: Which finding is most concerning for abusive head trauma (shaken baby syndrome) in this context?
  correctAnswer: Retinal hemorrhages
  rationale: Retinal hemorrhages together with subdural hematoma and diffuse axonal injury are highly concerning for abusive head trauma.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: q3_4  [select_all]
  oldTopic (free-text): Child Abuse Interventions
  candidateSet: ['Patient & Environment Safety', 'Transmission-Based Precautions', 'Standard Precautions & Hygiene', 'PPE & Sterile Technique', 'Disaster & Emergency Preparedness', 'Medication Safety & Admin']
  stem: Which actions should the nurse take next? Select all that apply.
  correctAnswer: Perform a full body skin assessment for bruises; Maintain head in a neutral position; Monitor for seizures; Anticipate a skeletal survey to evaluate for occult fractures
  rationale: The nurse should stabilize neurologic status, assess for additional injuries, monitor for seizures, and support the mandated-reporting evaluation.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: vit_10  [multiple_choice]
  oldTopic (free-text): malignant hyperthermia
  candidateSet: ['Patient & Environment Safety', 'Transmission-Based Precautions', 'Standard Precautions & Hygiene', 'PPE & Sterile Technique', 'Disaster & Emergency Preparedness', 'Medication Safety & Admin']
  stem: A client is undergoing general anesthesia using volatile inhaled anesthetics. Ten minutes into the procedure, the nurse notes the following rapid vital sign changes. Which complication is most likely occurring?
  correctAnswer: Malignant hyperthermia
  rationale: The chart shows a dangerously rapid increase in both body temperature and heart rate shortly after the induction of general anesthesia. Combined with the exposure to inhaled anesthetics, this rapid hypermetabolic state is highly indicative of malignant hyperthermia, a rare but life-threatening complication requiring immediate administration of dantrolene.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

```

## S06 — Basic Care and Comfort (7 items)

**Prompt**
```
You are assigning ONE canonical NCLEX topic to each item, or determining the category itself is wrong.
For each id, choose exactly one:
  - propose:<canonical topic FROM candidateSet>  — only if it genuinely fits. Do NOT pick the least-bad.
  - out_of_category:<canonical topic NOT in candidateSet>  — if the true topic is clearly a canonical
    topic the current category does not license. This flags a CATEGORY error (route to the category worklist).
  - abstain  — if nothing canonical genuinely fits.
These 75 already defeated a first-pass classifier (it abstained), so expect out_of_category/abstain to be
common and legitimate. Return one line per id: <id> | <decision> | <topic-or-null> | <one-sentence reason>.
```
**Items**
```
id: opus_bcc_rehab_2026_06_10_06  [ordered_response]
  oldTopic (free-text): pressure injury staging and evaluation of wound healing
  candidateSet: ['Nutritional & Fluid Support', 'Mobility & Immobility', 'Elimination & Comfort', 'Sleep & Rest', 'Palliative & Supportive Care']
  stem: A rehabilitation nurse is evaluating the healing progress of a client's sacral pressure injury over a 4-week period. Arrange the following wound assessment findings in the order that indicates progressive healing from earliest sign of improvement (first) to most advanced healing (last).
  correctAnswer: 1. Necrotic tissue loosens and separates from the wound bed through autolytic debridement; 2. Inflammatory exudate decreases and wound base transitions from yellow slough to red granulation tissue; 3. Wound edges contract and wound dimensions decrease measurably; 4. Pink epithelial tissue migrates inward from wound margins; 5. Wound fully resurfaces with new epithelium; scar tissue matures and remodels
  rationale: Wound healing follows a predictable sequence: during the inflammatory/debridement phase, necrotic tissue must first separate and be removed to prepare the wound bed; as the proliferative phase begins, slough clears and healthy red granulation tissue fills the wound bed; wound contraction then draws the edges closer together, reducing the wound size; epithelial cells migrate from the wound margins across the granulation tissue to resurface the wound; finally, in the maturation/remodeling phase, epithelial coverage is complete and the underlying collagen scar matures and strengthens over weeks to months.
  (first-pass abstained: The item tests skin/wound care, and no licensed candidate genuinely fits.)

id: gpt_case_premium_2026_06_10_case04_cloze_stage1_02  [dropdown_cloze]
  oldTopic (free-text): pressure injury prevention in rehabilitation
  candidateSet: ['Nutritional & Fluid Support', 'Mobility & Immobility', 'Elimination & Comfort', 'Sleep & Rest', 'Palliative & Supportive Care']
  stem: Complete the nurse's interpretation of the day-3 finding.
  correctAnswer: 1: a stage 1 pressure injury; 2: offload pressure and update the prevention plan
  rationale: Intact, nonblanchable redness over a pressure point is consistent with stage 1 pressure injury and requires pressure relief, not massage.
  (first-pass abstained: The item tests skin/wound care, and no licensed candidate genuinely fits.)

id: gpt_case_premium_2026_06_10_case04_mc_first_action_03  [multiple_choice]
  oldTopic (free-text): pressure injury prevention in rehabilitation
  candidateSet: ['Nutritional & Fluid Support', 'Mobility & Immobility', 'Elimination & Comfort', 'Sleep & Rest', 'Palliative & Supportive Care']
  stem: Which nursing action is the priority after finding the nonblanchable sacral redness?
  correctAnswer: Relieve pressure from the sacrum and request an appropriate pressure-redistribution surface.
  rationale: The priority is to remove pressure and use pressure redistribution; donut cushions and massage can worsen tissue injury.
  (first-pass abstained: The item tests skin/wound care, and no licensed candidate genuinely fits.)

id: gpt_gap_2026_06_10_fib_daily_skin_inspection_07  [fill_in_blank]
  oldTopic (free-text): Home skin inspection for pressure injury prevention
  candidateSet: ['Nutritional & Fluid Support', 'Mobility & Immobility', 'Elimination & Comfort', 'Sleep & Rest', 'Palliative & Supportive Care']
  stem: A client with decreased sensation in the lower body is learning home skin care. The nurse teaches the client to inspect high-pressure areas at least once each _____.
  correctAnswer: b1: day / daily / each day / 24 hours / twenty-four hours / 一天 / 每天
  rationale: Clients with decreased sensation may not feel early pressure or friction injury. Daily inspection of high-pressure areas supports early identification of redness, moisture damage, or skin breakdown.
  (first-pass abstained: The item tests skin/wound care, and no licensed candidate genuinely fits.)

id: gpt_gap_2026_06_10_b_fib_bed_repositioning_08  [fill_in_blank]
  oldTopic (free-text): Repositioning schedule for pressure injury prevention
  candidateSet: ['Nutritional & Fluid Support', 'Mobility & Immobility', 'Elimination & Comfort', 'Sleep & Rest', 'Palliative & Supportive Care']
  stem: A bedbound client is at risk for pressure injury. The facility care plan states the client should be turned at least every 2 hours while in bed unless an individualized plan requires a different interval. Complete the teaching statement for the family caregiver.
  correctAnswer: b1: 2 hours (tolerance 0)
  rationale: The care plan specifies repositioning at least every 2 hours while the client is in bed. The nurse should also teach that the schedule may be individualized based on skin tolerance, support surfaces, comfort, and clinical condition.
  (first-pass abstained: The item tests skin/wound care, and no licensed candidate genuinely fits.)

id: gpt_gap_jun11_or_nonpharm_pain_01  [ordered_response]
  oldTopic (free-text): Nonpharmacological Musculoskeletal Pain Management
  candidateSet: ['Nutritional & Fluid Support', 'Mobility & Immobility', 'Elimination & Comfort', 'Sleep & Rest', 'Palliative & Supportive Care']
  stem: A client reports 6/10 musculoskeletal pain. The prescribed analgesic plan is adequate, and the nurse is adding nonpharmacological comfort measures. Arrange the steps in the correct order.
  correctAnswer: 1. Help the client change position into therapeutic alignment that avoids strain on the painful area.; 2. Apply heat or cold according to the pain type, skin condition, and client preference.; 3. Coach the client in guided breathing, relaxation, or distraction while the comfort measure is in place.; 4. Reassess the pain rating and functional response 30–60 minutes after the measures are started.; 5. Document the interventions used, the reassessment findings, and the client’s response.
  rationale: Nonpharmacological pain care begins with positioning to reduce strain, adds appropriate thermal therapy, supports relaxation or distraction, reassesses effectiveness within a reasonable interval, and documents the intervention and response.
  (first-pass abstained: The item tests skin/wound care, and no licensed candidate genuinely fits.)

id: claude_cs_jun06_pressure_injury_bcc_01_part_4  [multiple_choice]
  oldTopic (free-text): Pressure Injury Staging and Prevention
  candidateSet: ['Nutritional & Fluid Support', 'Mobility & Immobility', 'Elimination & Comfort', 'Sleep & Rest', 'Palliative & Supportive Care']
  stem: Two days later the right heel that was previously intact now has thick black eschar covering the wound bed so the depth cannot be visualized. How should the nurse document this injury?
  correctAnswer: Unstageable pressure injury
  rationale: When the wound bed is obscured by slough or eschar so that the true depth (and therefore the stage) cannot be determined, the injury is classified as unstageable until enough nonviable tissue is removed to visualize the base.
  (first-pass abstained: The item tests skin/wound care, and no licensed candidate genuinely fits.)

```

## S07 — Pharmacological and Parenteral Therapies (5 items)

**Prompt**
```
You are assigning ONE canonical NCLEX topic to each item, or determining the category itself is wrong.
For each id, choose exactly one:
  - propose:<canonical topic FROM candidateSet>  — only if it genuinely fits. Do NOT pick the least-bad.
  - out_of_category:<canonical topic NOT in candidateSet>  — if the true topic is clearly a canonical
    topic the current category does not license. This flags a CATEGORY error (route to the category worklist).
  - abstain  — if nothing canonical genuinely fits.
These 75 already defeated a first-pass classifier (it abstained), so expect out_of_category/abstain to be
common and legitimate. Return one line per id: <id> | <decision> | <topic-or-null> | <one-sentence reason>.
```
**Items**
```
id: q9_1  [multiple_choice]
  oldTopic (free-text): Serotonin Syndrome Recognition
  candidateSet: ['Dosage Calculations', 'Anticoagulant Therapy', 'Cardiovascular & Endocrine Medications', 'Psychotropic Medications', 'Parenteral Nutrition', 'Medication Safety & Admin', 'Laboratory & Diagnostic Tests']
  stem: Client 1 is most likely experiencing:
  correctAnswer: Serotonin Syndrome
  rationale: Hyperreflexia, clonus, and tremor are key features of Serotonin Syndrome.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: q9_2  [multiple_choice]
  oldTopic (free-text): SS vs NMS Distinction
  candidateSet: ['Dosage Calculations', 'Anticoagulant Therapy', 'Cardiovascular & Endocrine Medications', 'Psychotropic Medications', 'Parenteral Nutrition', 'Medication Safety & Admin', 'Laboratory & Diagnostic Tests']
  stem: What is the hallmark physical exam difference between the two?
  correctAnswer: Reflexes: Hyperreflexia in Serotonin, Hyporeflexia/Rigidity in NMS
  rationale: Neuromuscular hyperactivity (clonus/hyperreflexia) defines serotonin syndrome, while 'lead-pipe' rigidity defines NMS.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: q9_4  [select_all]
  oldTopic (free-text): Hyperthermic Syndrome Interventions
  candidateSet: ['Dosage Calculations', 'Anticoagulant Therapy', 'Cardiovascular & Endocrine Medications', 'Psychotropic Medications', 'Parenteral Nutrition', 'Medication Safety & Admin', 'Laboratory & Diagnostic Tests']
  stem: Which nursing actions apply to both clients? Select all that apply.
  correctAnswer: Discontinue the offending agents immediately; Initiate cooling measures; Monitor for Rhabdomyolysis
  rationale: Cessation of drugs and supportive care for fever and muscle breakdown are critical.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: ekg_b2_sata_06  [select_all]
  oldTopic (free-text): Adenosine Side Effects
  candidateSet: ['Dosage Calculations', 'Anticoagulant Therapy', 'Cardiovascular & Endocrine Medications', 'Psychotropic Medications', 'Parenteral Nutrition', 'Medication Safety & Admin', 'Laboratory & Diagnostic Tests']
  stem: A client has just received a rapid IV bolus of adenosine 6 mg for the conversion of supraventricular tachycardia (SVT). Which transient side effects or clinical findings should the nurse anticipate immediately following administration? Select all that apply.
  correctAnswer: A brief period of asystole or cardiac pause on the monitor; Facial flushing and warmth; Substernal chest pressure or discomfort; Shortness of breath or dyspnea
  rationale: Adenosine slows conduction through the AV node, which often causes a brief, transient period of asystole (cardiac pause), which can be alarming but is expected and usually self-limiting. Other common, transient side effects include peripheral vasodilation (facial flushing), bronchospasm (shortness of breath/dyspnea), and chest pressure due to adenosine receptor activation in the heart. Seizures and hypertensive crisis are not side effects of adenosine.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: vit_04  [multiple_choice]
  oldTopic (free-text): fluid resuscitation
  candidateSet: ['Dosage Calculations', 'Anticoagulant Therapy', 'Cardiovascular & Endocrine Medications', 'Psychotropic Medications', 'Parenteral Nutrition', 'Medication Safety & Admin', 'Laboratory & Diagnostic Tests']
  stem: A client is admitted with severe dehydration and receives 2 liters of 0.9% normal saline over 4 hours. The nurse evaluates the client's vital signs as shown. Which conclusion is most accurate based on these data?
  correctAnswer: The fluid resuscitation is effective.
  rationale: The chart shows a positive response to fluid resuscitation. As intravascular volume is restored, the initially elevated heart rate (compensatory tachycardia) steadily decreases back into the normal range, while the initially low mean arterial pressure (MAP) steadily rises into the normal range.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

```

## S08 — Psychosocial Integrity (4 items)

**Prompt**
```
You are assigning ONE canonical NCLEX topic to each item, or determining the category itself is wrong.
For each id, choose exactly one:
  - propose:<canonical topic FROM candidateSet>  — only if it genuinely fits. Do NOT pick the least-bad.
  - out_of_category:<canonical topic NOT in candidateSet>  — if the true topic is clearly a canonical
    topic the current category does not license. This flags a CATEGORY error (route to the category worklist).
  - abstain  — if nothing canonical genuinely fits.
These 75 already defeated a first-pass classifier (it abstained), so expect out_of_category/abstain to be
common and legitimate. Return one line per id: <id> | <decision> | <topic-or-null> | <one-sentence reason>.
```
**Items**
```
id: opus24_case_elder_neglect_med_mismanagement_01_q1  [matrix]
  oldTopic (free-text): elder neglect recognition
  candidateSet: ['Therapeutic Communication', 'Mental Health Disorders', 'Substance Use & Withdrawal', 'Suicide & Crisis Intervention', 'Electroconvulsive Therapy (ECT)', 'Caregiver Role Strain & Family Coping']
  stem: At the first home visit, classify each finding according to whether it supports suspected elder neglect by the responsible caregiver or is primarily a medical finding that still requires follow-up.
  correctAnswer: No blood glucose log or daily weights despite discharge teaching: Supports suspected neglect pattern; Soiled incontinence brief reportedly unchanged since the previous evening: Supports suspected neglect pattern; Potassium bottle nearly full and insulin pen appears unused: Supports suspected neglect pattern; Mild cognitive impairment documented 6 months earlier: Medical finding requiring follow-up but not specific to neglect by itself; Sacral pressure injury is larger with maceration and drainage: Supports suspected neglect pattern; Sodium is 149 mEq/L and BUN is 48 mg/dL: Medical finding requiring follow-up but not specific to neglect by itself
  rationale: The pattern of omitted monitoring, unchanged soiled brief, medication evidence inconsistent with the prescribed regimen, and a worsened pressure injury after prolonged sitting supports suspected neglect. Cognitive impairment and abnormal labs require care, but by themselves they do not prove neglect; they become concerning when integrated with caregiver failures and environmental evidence.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_case_premium_2026_06_10_case05_cloze_teaching_03  [dropdown_cloze]
  oldTopic (free-text): health literacy teaching plan
  candidateSet: ['Therapeutic Communication', 'Mental Health Disorders', 'Substance Use & Withdrawal', 'Suicide & Crisis Intervention', 'Electroconvulsive Therapy (ECT)', 'Caregiver Role Strain & Family Coping']
  stem: Complete the nurse's teaching strategy.
  correctAnswer: 1: a plain-language picture schedule in the client's preferred language; 2: teach-back using the client's own words
  rationale: Plain-language, language-concordant visual teaching plus teach-back addresses health literacy and confirms practical understanding.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_case_premium_2026_06_10_case05_sata_adherence_04  [select_all]
  oldTopic (free-text): medication adherence support
  candidateSet: ['Therapeutic Communication', 'Mental Health Disorders', 'Substance Use & Withdrawal', 'Suicide & Crisis Intervention', 'Electroconvulsive Therapy (ECT)', 'Caregiver Role Strain & Family Coping']
  stem: Which strategies should the nurse include to improve adherence? Select all that apply.
  correctAnswer: Help the client link the medication to a consistent waking routine.; Ask permission before involving the nephew in refill reminders.; Coordinate refill planning so the client does not run out of medication.; Provide instructions in the client's preferred language using short sentences.
  rationale: Adherence improves when the plan is tied to routines, respects permission, prevents refill gaps, and uses accessible language.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: gpt_case_premium_next_case_caregiver_adaptation_dementia_03_matrix_cues  [matrix]
  oldTopic (free-text): caregiver burden and safety cue recognition
  candidateSet: ['Therapeutic Communication', 'Mental Health Disorders', 'Substance Use & Withdrawal', 'Suicide & Crisis Intervention', 'Electroconvulsive Therapy (ECT)', 'Caregiver Role Strain & Family Coping']
  stem: For each finding, select all interpretations that apply.
  correctAnswer: The spouse reports yelling and holding the client's wrists to stop wandering.: Caregiver strain cue, Immediate safety concern, Care coordination need; The smoke alarm in the hallway is disabled.: Immediate safety concern, Care coordination need; The spouse sleeps 3 to 4 hours per night.: Caregiver strain cue, Care coordination need; Two morning doses of antihypertensive medication were missed.: Care coordination need; No bruising or injury is observed on the client's wrists.: Reassuring finding
  rationale: The spouse's exhaustion and physical blocking of wandering raise caregiver strain and safety concerns. Disabled alarms, missed medications, and sleep deprivation require coordinated supports. Absence of wrist injury is reassuring but does not eliminate the need to address safety and strain.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

```

## S09 — Management of Care (2 items)

**Prompt**
```
You are assigning ONE canonical NCLEX topic to each item, or determining the category itself is wrong.
For each id, choose exactly one:
  - propose:<canonical topic FROM candidateSet>  — only if it genuinely fits. Do NOT pick the least-bad.
  - out_of_category:<canonical topic NOT in candidateSet>  — if the true topic is clearly a canonical
    topic the current category does not license. This flags a CATEGORY error (route to the category worklist).
  - abstain  — if nothing canonical genuinely fits.
These 75 already defeated a first-pass classifier (it abstained), so expect out_of_category/abstain to be
common and legitimate. Return one line per id: <id> | <decision> | <topic-or-null> | <one-sentence reason>.
```
**Items**
```
id: gpt_visual_smoke_2026_06_12_fib_device_enteral_duration_10  [fill_in_blank]
  oldTopic (free-text): enteral pump duration calculation
  candidateSet: ['Prioritization & Delegation', 'Legal & Ethical Principles', 'Client Advocacy', 'Confidentiality & HIPAA', 'Discharge Planning & Handoff', 'Conflict Resolution', 'Caregiver Role Strain & Family Coping']
  stem: Review the enteral feeding pump screen. If the displayed settings continue unchanged, over how many hours will the volume to be infused run? Round to the nearest whole number.
  correctAnswer: b1: 4 hr (tolerance 0)
  rationale: The pump shows a rate of 60 mL/hr and a volume to be infused of 240 mL. Duration is 240 ÷ 60 = 4 hours.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

id: mar_missed_antibiotic_followup_07  [matrix]
  oldTopic (free-text): missed dose follow-up
  candidateSet: ['Prioritization & Delegation', 'Legal & Ethical Principles', 'Client Advocacy', 'Confidentiality & HIPAA', 'Discharge Planning & Handoff', 'Conflict Resolution', 'Caregiver Role Strain & Family Coping']
  stem: At 0800, a nurse assumes care of a client being treated for suspected sepsis and reviews the MAR shown. For each possible nursing action, select whether it is appropriate or inappropriate.
  correctAnswer: Notify the provider or pharmacist that the 0600 IV antibiotic dose was missed and ask how to adjust the schedule.: Appropriate; Give the missed 0600 antibiotic dose and the next scheduled antibiotic dose together.: Inappropriate; Assess the client for clinical deterioration and document the missed dose and follow-up actions.: Appropriate; Ignore the missed dose because another dose is due later in the day.: Inappropriate
  rationale: The MAR shows the 0600 cefepime dose was missed. The nurse should assess the client, document accurately, and contact the provider or pharmacist for schedule guidance rather than doubling doses or ignoring the omission.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

```

## S10 — Health Promotion and Maintenance (1 items)

**Prompt**
```
You are assigning ONE canonical NCLEX topic to each item, or determining the category itself is wrong.
For each id, choose exactly one:
  - propose:<canonical topic FROM candidateSet>  — only if it genuinely fits. Do NOT pick the least-bad.
  - out_of_category:<canonical topic NOT in candidateSet>  — if the true topic is clearly a canonical
    topic the current category does not license. This flags a CATEGORY error (route to the category worklist).
  - abstain  — if nothing canonical genuinely fits.
These 75 already defeated a first-pass classifier (it abstained), so expect out_of_category/abstain to be
common and legitimate. Return one line per id: <id> | <decision> | <topic-or-null> | <one-sentence reason>.
```
**Items**
```
id: ekg_b5_sata_06  [select_all]
  oldTopic (free-text): Pacemaker Discharge Teaching
  candidateSet: ['Maternal-Newborn Care & Teaching', 'Pediatric & Adolescent Health', 'Pediatric & Toddler Safety', 'Adult Health & Wellness', 'Reproductive & Endocrine Health', 'Chronic Disease Management & Lifestyle']
  stem: The nurse is preparing a discharge teaching plan for a client who has just received a permanent cardiac pacemaker. Which instructions should the nurse include in the client's teaching? Select all that apply.
  correctAnswer: Avoid lifting the arm on the pacemaker side above shoulder height for 4 weeks; Check your radial pulse daily and report rates below the pacemaker set limit; Inform all healthcare providers and dentists that you have a pacemaker; Carry a pacemaker identification card at all times
  rationale: Discharge teaching for a new permanent pacemaker includes preventing lead dislodgement (avoid raising the arm above shoulder level for 4 weeks), monitoring cardiac activity (daily pulse checks), safety warnings (carrying the ID card, notifying all clinicians), and avoiding electromagnetic interference. MRI scans are contraindicated unless the device is cleared as MRI-conditional. Cell phones should be kept at least 6 inches away from the generator.
  (first-pass abstained: No candidate topic genuinely fits the scoped context.)

```

---
## Canonical topics (for out_of_category)

Prioritization & Delegation, Legal & Ethical Principles, Client Advocacy, Confidentiality & HIPAA, Discharge Planning & Handoff, Conflict Resolution, Patient & Environment Safety, Transmission-Based Precautions, Standard Precautions & Hygiene, PPE & Sterile Technique, Disaster & Emergency Preparedness, Maternal-Newborn Care & Teaching, Pediatric & Adolescent Health, Pediatric & Toddler Safety, Adult Health & Wellness, Reproductive & Endocrine Health, Chronic Disease Management & Lifestyle, Therapeutic Communication, Mental Health Disorders, Substance Use & Withdrawal, Suicide & Crisis Intervention, Electroconvulsive Therapy (ECT), Nutritional & Fluid Support, Mobility & Immobility, Elimination & Comfort, Sleep & Rest, Palliative & Supportive Care, Dosage Calculations, Anticoagulant Therapy, Cardiovascular & Endocrine Medications, Psychotropic Medications, Parenteral Nutrition, ABG & Acid-Base Interpretation, Perioperative Care, Procedural Complications & Dialysis, Cardiovascular Disorders, Respiratory & Infectious Disorders, Renal & Gastrointestinal Disorders, Endocrine & Neurological Disorders, Electrolyte Imbalances, Diabetic Ketoacidosis (DKA), Sepsis & Septic Shock, Burn Management, Medication Safety & Admin, Laboratory & Diagnostic Tests, Caregiver Role Strain & Family Coping