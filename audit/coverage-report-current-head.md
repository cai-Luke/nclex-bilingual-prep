# NCLEX Bank Coverage Report

Input Git SHA: 43a1087d48e1f622922abdd271d6d82f5f4a2b62
Files scanned (13): burn-canonical.json, capnography-canonical.json, claude-canonical.json, device-canonical.json, gemini-canonical.json, gpt-canonical.json, hard-cases-canonical.json, io-canonical.json, lab-canonical.json, mar-canonical.json, medlabel-canonical.json, visual-canonical.json, vitals-canonical.json

## Session-Unit Inventory and Delivery Capacity

This population is top-level delivery units only. Its distributions are inventory comparisons, not content-generation targets.

- Total session units: 1852
- Standalone top-level supply: 1709
- Case-container supply: 143
- Embedded-part inventory (not session units): 721
- Unique normalized session-unit topics: 51

### Session-Unit Category Inventory (not planning targets)
- Health Promotion and Maintenance: 165
- Basic Care and Comfort: 170
- Psychosocial Integrity: 172
- Reduction of Risk Potential: 198
- Safety and Infection Prevention and Control: 240
- Physiological Adaptation: 289
- Management of Care: 309
- Pharmacological and Parenteral Therapies: 309

### Standalone Draw-Eligible Capacity (requested session size 50)
Total eligible (non-case_study): 1709
- Management of Care: eligible 294 (requested target 9.0, gap +285.0)
- Safety and Infection Prevention and Control: eligible 226 (requested target 6.5, gap +219.5)
- Health Promotion and Maintenance: eligible 147 (requested target 4.5, gap +142.5)
- Psychosocial Integrity: eligible 150 (requested target 4.5, gap +145.5)
- Basic Care and Comfort: eligible 158 (requested target 4.5, gap +153.5)
- Pharmacological and Parenteral Therapies: eligible 299 (requested target 8.0, gap +291.0)
- Reduction of Risk Potential: eligible 189 (requested target 6.0, gap +183.0)
- Physiological Adaptation: eligible 246 (requested target 7.0, gap +239.0)
Shortfalls (under requested target - these under-deliver and donate seats to other categories):
- none
Targets are the requested 50-Q adequacy yardstick (weight x 50); the sampler's realized allocation caps at eligible.length per category.

### Session-Unit Item-Type Inventory
- case_study: 143
- bowtie: 148
- highlight: 152
- fill_in_blank: 175
- ordered_response: 177
- dropdown_cloze: 181
- matrix: 201
- select_all: 220
- multiple_choice: 455

`case_study` above is a delivery-container count. It is not a scored-format target.

### Session-Unit Difficulty Inventory
- easy: 266
- hard: 622
- medium: 964

### Session-Unit Topic Inventory — Lowest Counts (not generation instructions)
- Transfusion & Blood Products: 7 (Pharmacological and Parenteral Therapies, Physiological Adaptation, Safety and Infection Prevention and Control; bowtie, case_study, ordered_response, select_all)
- Electroconvulsive Therapy (ECT): 8 (Psychosocial Integrity; bowtie, dropdown_cloze, highlight, matrix, multiple_choice, ordered_response)
- IV Fluid Calculations: 8 (Pharmacological and Parenteral Therapies; fill_in_blank)
- ABG & Acid-Base Interpretation: 10 (Reduction of Risk Potential; bowtie, dropdown_cloze, fill_in_blank, matrix, multiple_choice)
- Oncology & Immunotherapy Complications: 12 (Physiological Adaptation, Reduction of Risk Potential; bowtie, case_study)
- Reproductive & Endocrine Health: 12 (Health Promotion and Maintenance; bowtie, dropdown_cloze, highlight, matrix, multiple_choice, select_all)
- Diabetic Ketoacidosis (DKA): 15 (Physiological Adaptation; bowtie, case_study, dropdown_cloze, highlight, matrix, multiple_choice, ordered_response, select_all)
- Intrapartum Fetal Monitoring: 15 (Reduction of Risk Potential; bowtie, dropdown_cloze, fill_in_blank, highlight, matrix, multiple_choice, ordered_response, select_all)
- Pediatric & Toddler Safety: 15 (Health Promotion and Maintenance; bowtie, case_study, dropdown_cloze, fill_in_blank, highlight, matrix, multiple_choice, ordered_response, select_all)
- Sepsis & Septic Shock: 15 (Physiological Adaptation; bowtie, case_study, dropdown_cloze, matrix, multiple_choice, select_all)
- Caregiver Role Strain & Family Coping: 16 (Management of Care, Psychosocial Integrity; bowtie, case_study, dropdown_cloze, fill_in_blank, highlight, matrix, ordered_response)
- Palliative & Supportive Care: 16 (Basic Care and Comfort; bowtie, case_study, dropdown_cloze, fill_in_blank, highlight, matrix, multiple_choice, ordered_response)

## Canonical Content-Planning Coverage — Scored Leaves

This authoritative planning population is standalone top-level questions plus embedded case parts. Case-study containers are excluded, and each embedded leaf contributes its own metadata.

- Total scored leaves: 2430
- Unique normalized scored-leaf topics: 51

### Scored-Leaf Category Counts and Targets
- Basic Care and Comfort: 219 (target 219, gap +0)
- Health Promotion and Maintenance: 230 (target 219, gap +11)
- Psychosocial Integrity: 249 (target 219, gap +30)
- Reduction of Risk Potential: 251 (target 292, gap -41)
- Safety and Infection Prevention and Control: 288 (target 316, gap -28)
- Pharmacological and Parenteral Therapies: 393 (target 389, gap +4)
- Management of Care: 400 (target 437, gap -37)
- Physiological Adaptation: 400 (target 340, gap +60)

### Scored-Leaf Item-Type Counts
- bowtie: 148
- highlight: 173
- fill_in_blank: 201
- ordered_response: 233
- dropdown_cloze: 271
- matrix: 342
- select_all: 376
- multiple_choice: 686

### Scored-Leaf Difficulty Counts
- easy: 269
- hard: 953
- medium: 1208

### Scored-Leaf Lowest-Covered Topics
- Electroconvulsive Therapy (ECT): 8 (Psychosocial Integrity; bowtie, dropdown_cloze, highlight, matrix, multiple_choice, ordered_response)
- IV Fluid Calculations: 9 (Pharmacological and Parenteral Therapies; fill_in_blank)
- ABG & Acid-Base Interpretation: 10 (Reduction of Risk Potential; bowtie, dropdown_cloze, fill_in_blank, matrix, multiple_choice)
- Reproductive & Endocrine Health: 12 (Health Promotion and Maintenance; bowtie, dropdown_cloze, highlight, matrix, multiple_choice, select_all)
- Intrapartum Fetal Monitoring: 15 (Reduction of Risk Potential; bowtie, dropdown_cloze, fill_in_blank, highlight, matrix, multiple_choice, ordered_response, select_all)
- Diabetic Ketoacidosis (DKA): 18 (Physiological Adaptation; bowtie, dropdown_cloze, highlight, matrix, multiple_choice, ordered_response, select_all)
- Palliative & Supportive Care: 21 (Basic Care and Comfort; bowtie, dropdown_cloze, fill_in_blank, highlight, matrix, multiple_choice, ordered_response, select_all)
- Transfusion & Blood Products: 21 (Pharmacological and Parenteral Therapies, Physiological Adaptation, Safety and Infection Prevention and Control; bowtie, dropdown_cloze, highlight, matrix, multiple_choice, ordered_response, select_all)
- Parenteral Nutrition: 22 (Pharmacological and Parenteral Therapies; bowtie, dropdown_cloze, fill_in_blank, highlight, matrix, multiple_choice, select_all)
- Pediatric & Toddler Safety: 22 (Health Promotion and Maintenance; bowtie, dropdown_cloze, fill_in_blank, highlight, matrix, multiple_choice, ordered_response, select_all)
- Sepsis & Septic Shock: 23 (Physiological Adaptation; bowtie, dropdown_cloze, matrix, multiple_choice, ordered_response, select_all)
- Substance Use & Withdrawal: 26 (Psychosocial Integrity; bowtie, dropdown_cloze, fill_in_blank, highlight, matrix, multiple_choice, select_all)

### Scored-Leaf Format Backfill Opportunities
Over-served categories missing newer item types (raw count basis):
- none

MC-heavy topics missing newer item types (carved out of AVOID):
- Electrolyte Imbalances [Physiological Adaptation]: MC x15, missing: fill_in_blank
- Substance Use & Withdrawal [Psychosocial Integrity]: MC x10, missing: ordered_response
- Burn Management [Pharmacological and Parenteral Therapies, Physiological Adaptation, Reduction of Risk Potential]: MC x9, missing: ordered_response
- Chronic Disease Management & Lifestyle [Health Promotion and Maintenance]: MC x8, missing: highlight, bowtie
- Respiratory & Infectious Disorders [Physiological Adaptation]: MC x8, missing: fill_in_blank
- Sepsis & Septic Shock [Physiological Adaptation]: MC x8, missing: fill_in_blank, highlight
- Transfusion & Blood Products [Pharmacological and Parenteral Therapies, Physiological Adaptation, Safety and Infection Prevention and Control]: MC x8, missing: fill_in_blank
- Psychotropic Medications [Pharmacological and Parenteral Therapies]: MC x7, missing: fill_in_blank
- Diabetic Ketoacidosis (DKA) [Physiological Adaptation]: MC x5, missing: fill_in_blank
- Oncology & Immunotherapy Complications [Physiological Adaptation, Reduction of Risk Potential]: MC x5, missing: fill_in_blank
- Parenteral Nutrition [Pharmacological and Parenteral Therapies]: MC x4, missing: ordered_response
- Electroconvulsive Therapy (ECT) [Psychosocial Integrity]: MC x3, missing: select_all, fill_in_blank
- Reproductive & Endocrine Health [Health Promotion and Maintenance]: MC x3, missing: ordered_response, fill_in_blank

### Targets

Under-served categories:
- none

Over-served categories:
- none

Equal-average scored item-type target: 303.8
Under-served scored item types:
- bowtie: 148
- highlight: 173
- fill_in_blank: 201
- ordered_response: 233
- dropdown_cloze: 271

### Prompt Parameters

PRIORITIZE_TOPICS:
- Electrolyte Imbalances — add: fill_in_blank
- Substance Use & Withdrawal — add: ordered_response
- Burn Management — add: ordered_response
- Chronic Disease Management & Lifestyle — add: highlight, bowtie
- Respiratory & Infectious Disorders — add: fill_in_blank
- Sepsis & Septic Shock — add: fill_in_blank, highlight
- Transfusion & Blood Products — add: fill_in_blank
- Psychotropic Medications — add: fill_in_blank
- Diabetic Ketoacidosis (DKA) — add: fill_in_blank
- Oncology & Immunotherapy Complications — add: fill_in_blank
- Parenteral Nutrition — add: ordered_response
- Electroconvulsive Therapy (ECT) — add: select_all, fill_in_blank
- Reproductive & Endocrine Health — add: ordered_response, fill_in_blank
- bowtie (148 vs target 303.8)
- highlight (173 vs target 303.8)
- fill_in_blank (201 vs target 303.8)
- ordered_response (233 vs target 303.8)
- dropdown_cloze (271 vs target 303.8)
- Electroconvulsive Therapy (ECT)
- IV Fluid Calculations
- ABG & Acid-Base Interpretation
- Reproductive & Endocrine Health
- Intrapartum Fetal Monitoring
- Diabetic Ketoacidosis (DKA)
- Palliative & Supportive Care
- Transfusion & Blood Products
- Parenteral Nutrition
- Pediatric & Toddler Safety
- Sepsis & Septic Shock
- Substance Use & Withdrawal

AVOID_TOPICS:
- Medication Safety & Admin (124)
- Prioritization & Delegation (107)
- Cardiovascular Disorders (104)
- Legal & Ethical Principles (89)
- Discharge Planning & Handoff (83)
- Patient & Environment Safety (82)
- Mental Health Disorders (78)
- Laboratory & Diagnostic Tests (78)

## Recursive Visual Artifact Inventory

This is an independent recursive artifact traversal across question visuals, case exhibits, staged exhibits, and embedded-leaf visuals. It uses neither the session-unit nor scored-leaf denominator.

Total visual artifacts: 199
- burn_map: 10
- capnography: 25
- device_screen: 12
- fetal_monitoring: 6
- injection_site: 8
- io_record: 11
- io_trend: 4
- lab_trend: 20
- mar: 11
- medication_label: 13
- rhythm_strip: 50
- vitals_trend: 29

### Rhythm Strip Artifacts
- aflutter: 2
- avb_2_mobitz1: 2
- avb_2_mobitz2: 2
- avb_1: 3
- avb_3: 3
- pvc: 3
- vfib: 3
- asystole: 4
- sinus: 4
- sinus_tach: 4
- svt: 4
- vtach: 4
- afib: 6
- sinus_brady: 6
