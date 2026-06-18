# Residual S01 Adjudication Dry Run

Generated: 2026-06-17T22:53:53.026Z
Mode: dry-run only
Canonical bank writes: none
Topic vocabulary writes: none

## Vocabulary/Licensing Changes Proposed

- Maternal-Newborn Care & Teaching: src/topics.ts: move/add topic to SHARED_TOPIC_CATEGORY with HPM/RRP/PhysAdapt licensing; remove strict-only HPM duplicate during write.
- Skin & Wound Care: src/topics.ts: add TOPICS.SKIN_WOUND_CARE and include it in STRICT_TOPIC_CATEGORY["Basic Care and Comfort"].
- Oncology & Immunotherapy Complications: src/topics.ts: add TOPICS.ONCOLOGY_IMMUNOTHERAPY_COMPLICATIONS and include it in SHARED_TOPIC_CATEGORY for PhysAdapt/RRP.

## Safety Summary

- Topic-only writes: 1
- Vocabulary-only-then-topic writes: 4
- Total topic-field-only bank writes after vocabulary approval: 5
- Category + topic writes: 10
- Vocabulary/licensing changes: 3
- Rows left untouched: 0
- Rows not found: 0
- Ambiguous matches / ID collisions: 0

## S01 Row Plan

| ID | Bank | Parent | Current category | Current topic | Proposed category | Proposed topic | Decision type | Reason |
|---|---|---|---|---|---|---|---|---|
| `dev_infusion_duration_vtbi_01` | device-canonical.json |  | Reduction of Risk Potential | infusion pump time verification | Pharmacological and Parenteral Therapies | Dosage Calculations | category_and_topic | The item calculates infusion time from VTBI and rate, which fits calculation/infusion math better than an RRP diagnostic or procedural topic. |
| `gpt_u6_matrix_cloze_2026_06_09_cloze_transfusion_trali_09` | gpt-canonical.json |  | Reduction of Risk Potential | Transfusion-related acute lung injury response | Reduction of Risk Potential | Procedural Complications & Dialysis | topic_only | The item tests recognition and immediate nursing response to a transfusion complication, which genuinely fits the procedural-complication bucket. |
| `gpt_case_gap_2026_06_11_case_tls_01_q4` | gpt-canonical.json | gpt_case_gap_2026_06_11_case_tls_01 | Reduction of Risk Potential | tumor lysis syndrome urine output monitoring | Physiological Adaptation | Renal & Gastrointestinal Disorders | category_and_topic | The item interprets oliguria in TLS-associated kidney injury rather than ABG, perioperative care, procedural complications, or diagnostic testing. |
| `gpt_case_gap_2026_06_11_adhf_cloze_02` | gpt-canonical.json | gpt_case_gap_2026_06_11_case_adhf_01 | Reduction of Risk Potential | Acute pulmonary edema in heart failure | Physiological Adaptation | Cardiovascular Disorders | category_and_topic | The item identifies acute pulmonary edema/respiratory failure from decompensated heart failure, which is cardiovascular physiology. |
| `gpt_case_gap_2026_06_11_adhf_fib_04` | gpt-canonical.json | gpt_case_gap_2026_06_11_case_adhf_01 | Reduction of Risk Potential | Evaluating diuretic response | Physiological Adaptation | Cardiovascular Disorders | category_and_topic | The net fluid balance is used to evaluate diuretic response in acute decompensated heart failure. |
| `gpt_case_gap_2026_06_11_aki_cloze_02` | gpt-canonical.json | gpt_case_gap_2026_06_11_case_aki_02 | Reduction of Risk Potential | Hyperkalemia in acute kidney injury | Physiological Adaptation | Electrolyte Imbalances | category_and_topic | The central cue is severe hyperkalemia with ECG changes and risk for lethal dysrhythmia. |
| `gpt_case_gap_2026_06_11_aki_fib_04` | gpt-canonical.json | gpt_case_gap_2026_06_11_case_aki_02 | Reduction of Risk Potential | Oliguria in acute kidney injury | Physiological Adaptation | Renal & Gastrointestinal Disorders | category_and_topic | The item calculates oliguria in acute kidney injury, which is renal physiologic adaptation. |
| `gpt_case_gap_2026_06_11_adrenal_fib_04` | gpt-canonical.json | gpt_case_gap_2026_06_11_case_adrenal_crisis_04 | Reduction of Risk Potential | Mean arterial pressure in shock | Physiological Adaptation | Cardiovascular Disorders | category_and_topic | The item calculates MAP and interprets shock-level perfusion, which is hemodynamic/cardiovascular rather than an RRP candidate topic. |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q1` | gpt-canonical.json | gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02 | Reduction of Risk Potential | post-fall assessment | Safety and Infection Control | Patient & Environment Safety | category_and_topic | The item tests post-fall safety assessment before moving a resident. |
| `gpt_gap_2026_06_12_nonmcq_balanced_fib_wound_teachback_12` | gpt-canonical.json |  | Reduction of Risk Potential | home health wound-care teaching with teach-back failure | Basic Care and Comfort | Skin & Wound Care | category_and_topic | The item calculates wound area change and belongs with wound monitoring/skin care now that Skin & Wound Care is an approved canonical topic. |
| `hl_smoke_2026_06_14_aki_hyperkalemia_01` | gpt-canonical.json |  | Reduction of Risk Potential | acute kidney injury and hyperkalemia | Physiological Adaptation | Electrolyte Imbalances | category_and_topic | The immediate-follow-up cues center on dangerous hyperkalemia with peaked T waves. |
| `opus_car_t_crs_2026_06_11_case_01_q1` | hard-cases-canonical.json | opus_car_t_crs_2026_06_11_case_01 | Reduction of Risk Potential | CAR-T cytokine release syndrome and ICANS monitoring | Reduction of Risk Potential | Oncology & Immunotherapy Complications | vocabulary_only_then_topic | The item tests CAR-T CRS/ICANS monitoring with concurrent neutropenic fever/sepsis risk, which belongs under the approved oncology/immunotherapy complication topic. |
| `opus_car_t_crs_2026_06_11_case_01_q2` | hard-cases-canonical.json | opus_car_t_crs_2026_06_11_case_01 | Reduction of Risk Potential | CAR-T cytokine release syndrome and ICANS monitoring | Reduction of Risk Potential | Oncology & Immunotherapy Complications | vocabulary_only_then_topic | The item requires concurrent CRS-pathway and neutropenic fever/sepsis management after CAR-T therapy. |
| `opus_car_t_crs_2026_06_11_case_01_q3` | hard-cases-canonical.json | opus_car_t_crs_2026_06_11_case_01 | Reduction of Risk Potential | CAR-T cytokine release syndrome and ICANS monitoring | Reduction of Risk Potential | Oncology & Immunotherapy Complications | vocabulary_only_then_topic | The sequence addresses CRS/ICANS escalation after CAR-T therapy, including oxygen, fluids, tocilizumab, dexamethasone, and ICU preparation. |
| `opus_car_t_crs_2026_06_11_case_01_q5` | hard-cases-canonical.json | opus_car_t_crs_2026_06_11_case_01 | Reduction of Risk Potential | CAR-T cytokine release syndrome and ICANS monitoring | Reduction of Risk Potential | Oncology & Immunotherapy Complications | vocabulary_only_then_topic | The item evaluates response after tocilizumab/dexamethasone for CRS/ICANS and ongoing recurrence monitoring. |

## Exact Before/After Diff Preview

### dev_infusion_duration_vtbi_01

- banks/device-canonical.json:questions.5.category: `Reduction of Risk Potential` -> `Pharmacological and Parenteral Therapies`
- banks/device-canonical.json:questions.5.topic: `infusion pump time verification` -> `Dosage Calculations`

### gpt_u6_matrix_cloze_2026_06_09_cloze_transfusion_trali_09

- banks/gpt-canonical.json:questions.130.topic: `Transfusion-related acute lung injury response` -> `Procedural Complications & Dialysis`

### gpt_case_gap_2026_06_11_case_tls_01_q4

- banks/gpt-canonical.json:questions.183.caseStudy.questions.3.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.183.caseStudy.questions.3.topic: `tumor lysis syndrome urine output monitoring` -> `Renal & Gastrointestinal Disorders`

### gpt_case_gap_2026_06_11_adhf_cloze_02

- banks/gpt-canonical.json:questions.184.caseStudy.questions.1.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.184.caseStudy.questions.1.topic: `Acute pulmonary edema in heart failure` -> `Cardiovascular Disorders`

### gpt_case_gap_2026_06_11_adhf_fib_04

- banks/gpt-canonical.json:questions.184.caseStudy.questions.3.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.184.caseStudy.questions.3.topic: `Evaluating diuretic response` -> `Cardiovascular Disorders`

### gpt_case_gap_2026_06_11_aki_cloze_02

- banks/gpt-canonical.json:questions.185.caseStudy.questions.1.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.185.caseStudy.questions.1.topic: `Hyperkalemia in acute kidney injury` -> `Electrolyte Imbalances`

### gpt_case_gap_2026_06_11_aki_fib_04

- banks/gpt-canonical.json:questions.185.caseStudy.questions.3.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.185.caseStudy.questions.3.topic: `Oliguria in acute kidney injury` -> `Renal & Gastrointestinal Disorders`

### gpt_case_gap_2026_06_11_adrenal_fib_04

- banks/gpt-canonical.json:questions.187.caseStudy.questions.3.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.187.caseStudy.questions.3.topic: `Mean arterial pressure in shock` -> `Cardiovascular Disorders`

### gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q1

- banks/gpt-canonical.json:questions.243.caseStudy.questions.0.category: `Reduction of Risk Potential` -> `Safety and Infection Control`
- banks/gpt-canonical.json:questions.243.caseStudy.questions.0.topic: `post-fall assessment` -> `Patient & Environment Safety`

### gpt_gap_2026_06_12_nonmcq_balanced_fib_wound_teachback_12

- banks/gpt-canonical.json:questions.253.category: `Reduction of Risk Potential` -> `Basic Care and Comfort`
- banks/gpt-canonical.json:questions.253.topic: `home health wound-care teaching with teach-back failure` -> `Skin & Wound Care`

### hl_smoke_2026_06_14_aki_hyperkalemia_01

- banks/gpt-canonical.json:questions.269.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.269.topic: `acute kidney injury and hyperkalemia` -> `Electrolyte Imbalances`

### opus_car_t_crs_2026_06_11_case_01_q1

- banks/hard-cases-canonical.json:questions.38.caseStudy.questions.0.topic: `CAR-T cytokine release syndrome and ICANS monitoring` -> `Oncology & Immunotherapy Complications`

### opus_car_t_crs_2026_06_11_case_01_q2

- banks/hard-cases-canonical.json:questions.38.caseStudy.questions.1.topic: `CAR-T cytokine release syndrome and ICANS monitoring` -> `Oncology & Immunotherapy Complications`

### opus_car_t_crs_2026_06_11_case_01_q3

- banks/hard-cases-canonical.json:questions.38.caseStudy.questions.2.topic: `CAR-T cytokine release syndrome and ICANS monitoring` -> `Oncology & Immunotherapy Complications`

### opus_car_t_crs_2026_06_11_case_01_q5

- banks/hard-cases-canonical.json:questions.38.caseStudy.questions.4.topic: `CAR-T cytokine release syndrome and ICANS monitoring` -> `Oncology & Immunotherapy Complications`

## Stop Gate

No changes have been applied. Apply only after Luke approves this exact dry-run.
