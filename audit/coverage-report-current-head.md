# NCLEX Bank Coverage Report

Files scanned: burn-canonical.json, capnography-canonical.json, claude-canonical.json, device-canonical.json, gemini-canonical.json, gpt-canonical.json, hard-cases-canonical.json, io-canonical.json, lab-canonical.json, mar-canonical.json, medlabel-canonical.json, visual-canonical.json, vitals-canonical.json
Total questions: 1798
Scored leaves: 2376 (standalone top-level + embedded case parts; case containers excluded)
Unique normalized topics: 274

## Category Counts
- Health Promotion and Maintenance: 164 (target 162, gap +2)
- Basic Care and Comfort: 165 (target 162, gap +3)
- Psychosocial Integrity: 171 (target 162, gap +9)
- Reduction of Risk Potential: 203 (target 216, gap -13)
- Safety and Infection Control: 228 (target 234, gap -6)
- Physiological Adaptation: 285 (target 252, gap +33)
- Management of Care: 291 (target 324, gap -33)
- Pharmacological and Parenteral Therapies: 291 (target 288, gap +3)

## Draw-Eligible Capacity per Category (requested session size 50)
Total eligible (non-case_study): 1655
- Management of Care: eligible 276 (requested target 9.0, gap +267.0)
- Safety and Infection Control: eligible 214 (requested target 6.5, gap +207.5)
- Health Promotion and Maintenance: eligible 146 (requested target 4.5, gap +141.5)
- Psychosocial Integrity: eligible 149 (requested target 4.5, gap +144.5)
- Basic Care and Comfort: eligible 152 (requested target 4.5, gap +147.5)
- Pharmacological and Parenteral Therapies: eligible 281 (requested target 8.0, gap +273.0)
- Reduction of Risk Potential: eligible 189 (requested target 6.0, gap +183.0)
- Physiological Adaptation: eligible 248 (requested target 7.0, gap +241.0)
Shortfalls (under requested target - these under-deliver and donate seats to other categories):
- none
Targets are the requested 50-Q adequacy yardstick (weight x 50); the sampler's realized allocation caps at eligible.length per category.

## Item Type Counts
- highlight: 133
- bowtie: 135
- case_study: 143
- dropdown_cloze: 172
- ordered_response: 173
- fill_in_blank: 175
- matrix: 192
- select_all: 220
- multiple_choice: 455

## Difficulty Counts
- easy: 245
- hard: 613
- medium: 940

## Visual Counts
Total visuals: 199
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

## Rhythm Strip Counts
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

## Lowest-Covered Topics
- accidental tracheostomy dislodgement: 1 (Reduction of Risk Potential; select_all)
- Acute decompensated heart failure: 1 (Reduction of Risk Potential; case_study)
- Acute Decompensated Heart Failure (ADHF): 1 (Physiological Adaptation; case_study)
- Acute gallstone pancreatitis with cholangitis: 1 (Physiological Adaptation; case_study)
- Acute Graft-Versus-Host Disease: 1 (Physiological Adaptation; case_study)
- Acute kidney injury: 1 (Reduction of Risk Potential; case_study)
- acute kidney injury fluid response: 1 (Reduction of Risk Potential; matrix)
- Acute Myocardial Infarction and Ventricular Fibrillation: 1 (Physiological Adaptation; case_study)
- Acute pancreatitis complications: 1 (Reduction of Risk Potential; case_study)
- Acute variceal hemorrhage in cirrhosis: 1 (Physiological Adaptation; case_study)
- Adenosine Side Effects: 1 (Pharmacological and Parenteral Therapies; select_all)
- Adrenal crisis: 1 (Reduction of Risk Potential; case_study)

## Format Backfill Opportunities
Over-served categories missing newer item types (raw count basis):
- none

MC-heavy topics missing newer item types (carved out of AVOID):
- Dosage Calculations [Basic Care and Comfort, Pharmacological and Parenteral Therapies, Physiological Adaptation, Safety and Infection Control]: MC x10, missing: ordered_response
- Substance Use & Withdrawal [Pharmacological and Parenteral Therapies, Physiological Adaptation, Psychosocial Integrity]: MC x10, missing: ordered_response
- Burn Management [Pharmacological and Parenteral Therapies, Physiological Adaptation, Reduction of Risk Potential]: MC x8, missing: ordered_response
- Injection route recognition from skin cross-section [Reduction of Risk Potential]: MC x4, missing: select_all, ordered_response, fill_in_blank, matrix, dropdown_cloze, highlight, bowtie
- Palliative & Supportive Care [Basic Care and Comfort, Safety and Infection Control]: MC x4, missing: select_all
- Electroconvulsive Therapy (ECT) [Psychosocial Integrity]: MC x3, missing: select_all, fill_in_blank
- Reproductive & Endocrine Health [Health Promotion and Maintenance, Physiological Adaptation]: MC x3, missing: fill_in_blank

## Prompt Parameters
PRIORITIZE_TOPICS:
- Dosage Calculations — add: ordered_response
- Substance Use & Withdrawal — add: ordered_response
- Burn Management — add: ordered_response
- Injection route recognition from skin cross-section — add: select_all, ordered_response, fill_in_blank, matrix, dropdown_cloze, highlight, bowtie
- Palliative & Supportive Care — add: select_all
- Electroconvulsive Therapy (ECT) — add: select_all, fill_in_blank
- Reproductive & Endocrine Health — add: fill_in_blank
- highlight (133 vs target 199.8)
- bowtie (135 vs target 199.8)
- case_study (143 vs target 199.8)
- dropdown_cloze (172 vs target 199.8)
- ordered_response (173 vs target 199.8)
- fill_in_blank (175 vs target 199.8)
- matrix (192 vs target 199.8)
- accidental tracheostomy dislodgement
- Acute decompensated heart failure
- Acute Decompensated Heart Failure (ADHF)
- Acute gallstone pancreatitis with cholangitis
- Acute Graft-Versus-Host Disease
- Acute kidney injury
- acute kidney injury fluid response
- Acute Myocardial Infarction and Ventricular Fibrillation
- Acute pancreatitis complications
- Acute variceal hemorrhage in cirrhosis
- Adenosine Side Effects
- Adrenal crisis

AVOID_TOPICS:
- Cardiovascular Disorders (79)
- Mental Health Disorders (64)
- Medication Safety & Admin (60)
- Prioritization & Delegation (56)
- Legal & Ethical Principles (51)
- Patient & Environment Safety (49)
- Transmission-Based Precautions (48)

## Scored-Leaf Coverage (case containers excluded)

Total scored leaves: 2376
Unique normalized topics: 330

### Category Counts
- Basic Care and Comfort: 214 (target 214, gap +0)
- Health Promotion and Maintenance: 232 (target 214, gap +18)
- Psychosocial Integrity: 249 (target 214, gap +35)
- Reduction of Risk Potential: 252 (target 285, gap -33)
- Safety and Infection Control: 277 (target 309, gap -32)
- Pharmacological and Parenteral Therapies: 368 (target 380, gap -12)
- Management of Care: 382 (target 428, gap -46)
- Physiological Adaptation: 402 (target 333, gap +69)

### Item Type Counts
- bowtie: 135
- highlight: 154
- fill_in_blank: 201
- ordered_response: 229
- dropdown_cloze: 262
- matrix: 333
- select_all: 376
- multiple_choice: 686

### Difficulty Counts
- easy: 248
- hard: 944
- medium: 1184

### Lowest-Covered Topics
- accidental tracheostomy dislodgement: 1 (Reduction of Risk Potential; select_all)
- acute hemorrhage prioritization: 1 (Physiological Adaptation; matrix)
- acute kidney injury fluid response: 1 (Reduction of Risk Potential; matrix)
- Acute variceal hemorrhage in cirrhosis: 1 (Physiological Adaptation; multiple_choice)
- AD Cause Identification: 1 (Physiological Adaptation; select_all)
- Adenosine Side Effects: 1 (Pharmacological and Parenteral Therapies; select_all)
- ADHF Pathophysiology: 1 (Reduction of Risk Potential; dropdown_cloze)
- Adrenal crisis emergency response: 1 (Management of Care; ordered_response)
- Advance Directives & Code Status: 1 (Management of Care; highlight)
- Advocacy / Informed Refusal: 1 (Management of Care; bowtie)
- anaphylaxis response to epinephrine: 1 (Pharmacological and Parenteral Therapies; multiple_choice)
- Anti-tuberculosis hepatotoxicity monitoring: 1 (Pharmacological and Parenteral Therapies; multiple_choice)

### Prompt Parameters
PRIORITIZE_TOPICS:
- Substance Use & Withdrawal — add: ordered_response
- Burn Management — add: ordered_response
- Sepsis & Septic Shock — add: select_all, highlight
- Chronic Disease Management & Lifestyle — add: highlight, bowtie
- Psychotropic Medications — add: fill_in_blank
- C. difficile colitis and dehydration — add: select_all, ordered_response, fill_in_blank, matrix, dropdown_cloze, highlight, bowtie
- Injection route recognition from skin cross-section — add: select_all, ordered_response, fill_in_blank, matrix, dropdown_cloze, highlight, bowtie
- Oncology & Immunotherapy Complications — add: fill_in_blank
- Transfusion & Blood Products — add: ordered_response, fill_in_blank
- Acute Graft-Versus-Host Disease — add: select_all, ordered_response, fill_in_blank, dropdown_cloze, highlight, bowtie
- Electroconvulsive Therapy (ECT) — add: select_all, fill_in_blank
- lithium toxicity — add: ordered_response, fill_in_blank, matrix, dropdown_cloze, highlight, bowtie
- Mucositis TPN and CRBSI — add: select_all, fill_in_blank, matrix, dropdown_cloze, highlight, bowtie
- Reproductive & Endocrine Health — add: fill_in_blank
- warfarin-enoxaparin-bridge — add: select_all, ordered_response, fill_in_blank, dropdown_cloze, highlight, bowtie
- bowtie (135 vs target 297.0)
- highlight (154 vs target 297.0)
- fill_in_blank (201 vs target 297.0)
- ordered_response (229 vs target 297.0)
- dropdown_cloze (262 vs target 297.0)
- accidental tracheostomy dislodgement
- acute hemorrhage prioritization
- acute kidney injury fluid response
- Acute variceal hemorrhage in cirrhosis
- AD Cause Identification
- Adenosine Side Effects
- ADHF Pathophysiology
- Adrenal crisis emergency response
- Advance Directives & Code Status
- Advocacy / Informed Refusal
- anaphylaxis response to epinephrine
- Anti-tuberculosis hepatotoxicity monitoring

AVOID_TOPICS:
- Cardiovascular Disorders (97)
- Dosage Calculations (83)
- Adult Health & Wellness (75)
- Mental Health Disorders (74)
- Medication Safety & Admin (70)
- Legal & Ethical Principles (65)
- Discharge Planning & Handoff (65)
- Prioritization & Delegation (62)
