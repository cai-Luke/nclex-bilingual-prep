# GPT Scored-Format Batch 13 — Codex Preflight Report

Date: 2026-07-28

Reviewer: Codex

Role: feasibility reviewer only

Status: **12 rows cleared for a separate GPT authoring session**

## Outcome

The preflight considered 14 candidates. Twelve are `CLEAR`, two are `REPLACE`, and none are `BLOCK`. The cleared roster has three rows of each permitted item type:

| Measure | Count |
|---|---:|
| `bowtie` | 3 |
| `highlight` | 3 |
| `fill_in_blank` | 3 |
| `dropdown_cloze` | 3 |
| Easy | 1 |
| Medium | 9 |
| Hard | 2 |

Category totals are:

| Category | Count |
|---|---:|
| Reduction of Risk Potential | 6 |
| Safety and Infection Prevention and Control | 3 |
| Health Promotion and Maintenance | 1 |
| Pharmacological and Parenteral Therapies | 1 |
| Physiological Adaptation | 1 |

There are no batch-shape preference deviations: the roster contains 12 rows, at least two and no more than four of each allowed type, and no more than three hard rows. Difficulty is driven by reasoning burden rather than urgency.

The binding machine-readable contracts for the 12 `CLEAR` rows are in `GPT-SCORED-FORMAT-BATCH-13-CLEARED-MANIFEST-2026-07-28.json`. This report records every candidate considered and the evidence for its disposition; it is not learner-facing content.

## Repository and Corpus Snapshot

- Branch: `main`
- Commit: `b335e28609a9adb85d02d4393e58d9d088a1b138`
- Local relation at preflight start: one commit ahead of `origin/main`
- Relevant pre-existing dirty state:
  - untracked `Archive/gpt-scored-format-batch-12-failed-2026-07-28/`
  - untracked `GPT-SCORED-FORMAT-BATCH-13-CODEX-PREFLIGHT-2026-07-28.md`
  - untracked `NCLEX-EXAM-CALCULATOR-CODEX-SPEC-2026-07-26.md`
- Bank state at preflight start: no canonical-bank diff; no live JSON draft under `banks/banks-raw/`
- Scored corpus searched: all 13 top-level bundled bank JSON files, all embedded scored case-study leaves, and the live raw-draft directory
- Corpus size reference: 1,891 scored session units in the current census
- ID result: no existing `gpt_format13_` ID
- Live routing result: the planned `gpt-format13-scored-recovery-2026-07-28.json` filename begins with `gpt-` and targets `gpt-canonical.json`

Repo authorities read before judgment included `AGENTS.md`, `docs/AGENTS-RUNBOOK.md`, `PROJECT-HISTORY.md`, `NCLEX-Question-Schema.md`, `BANK-REVIEW-LEDGER.md`, `BANK-CENSUS.md`, `census.json`, `src/types.ts`, `src/schema.ts`, `src/grading.ts`, `src/topics.ts`, `lib/canonical-routing.ts`, the current banks, the live raw area, and the quarantined Batch 12 archive. The live `SchemaVersion` union and validator were treated as authoritative for version claims; this preflight did not modify any data contract.

## Collision Method

Each candidate was searched by diagnosis or domain label and by its load-bearing semantic signature: cue cluster, threshold set, formula with equivalent forms, action/parameter map, or three-record decision partition. Searches covered question IDs, standalone questions, embedded case-study leaves, stems, answer structures, and rationales. A change in patient, values, wrapper, output unit, or setting was not accepted as divergence.

The known Batch 12 blocked patterns were explicitly excluded. No fetal-monitoring highlight, pediatric maintenance-fluid formula, ulipristal follow-up, generic contaminated-transfusion response, generic post-ECT recovery, palliative-opioid dyspnea/toxicity, refeeding bowtie, DKA transition, remaining-infusion-time calculation, or Winter's-formula calculation returned to the roster.

## Candidate Proof

### C01 — Local anesthetic systemic toxicity bowtie

- **Proposed ID / disposition:** `gpt_format13_last_bowtie` — `CLEAR`
- **Decision and classification:** Recognize local anesthetic systemic toxicity after a peripheral block and select two complementary responses plus two distinct monitoring dimensions. `bowtie`; hard; Reduction of Risk Potential; Perioperative Care; `take_action`.
- **Difficulty rationale:** Requires integration of an early neurologic prodrome with later cardiovascular toxicity, followed by separation of source control/team activation, syndrome-specific rescue, and neurologic versus cardiovascular evaluation.
- **Coverage rationale:** No current scored construct maps LAST recognition, two emergency functions, and two response dimensions.
- **Scenario contract:** Awake or minimally sedated adult in a monitored perioperative area; symptoms begin within minutes of local anesthetic administration; perioral numbness, metallic taste, or tinnitus progresses to seizure, ventricular ectopy/dysrhythmia, and hypotension. Exclude rash/bronchospasm, unilateral deficit, pneumothorax, prior seizure disorder, unrelated later medication exposure, and established arrest. Do not name LAST or identify lipid as its antidotal therapy. Use ASRA's emergency framework without inventing a local order or dose.
- **Interaction proof:** Condition: local anesthetic systemic toxicity. Actions: stop local anesthetic delivery and activate help/get the LAST rescue kit; initiate protocol-directed 20% lipid emulsion early. Parameters: neurologic status/seizure recurrence; rhythm, blood pressure, and hemodynamic stability. The actions perform exposure-control/team-mobilization and specific rescue functions; the parameters evaluate central nervous system and cardiovascular toxicity, so cardinality is not forced.
- **Collision proof:** Searched `local anesthetic systemic toxicity`, `LAST`, `lipid emulsion`, `perioral numbness`, `metallic taste`, `tinnitus`, and `ventricular arrhythmia` across all live scored and raw surfaces. Only incidental local-anesthesia references were found; there is no scored condition/action/parameter comparator.
- **Sources and mapping:** [ASRA LAST checklist, version 1.1 (2020)](https://asra.com/docs/default-source/guidelines-articles/local-anesthetic-systemic-toxicity-rgb.pdf?sfvrsn=33b348e_2), entire checklist, supports help/rescue-kit activation, early lipid emulsion, seizure and arrhythmia/hypotension response, and post-stabilization observation. [ASRA POCUS Spotlight, LAST section (2022-05-01)](https://asra.com/news-publications/asra-newsletter/newsletter-item/asra-news/2022/05/01/pocus-spotlight-point-of-care-ultrasound-in-cardiopulmonary-resuscitation) supports the early sensory/oral cues, seizure progression, hemodynamic instability, and arrhythmias. Scope is suspected toxicity after local-anesthetic exposure in a resuscitation-capable clinical setting.
- **Disposition reason:** The five bowtie slots are independently source-supported, nonduplicative, and corpus-distinct.

### C02 — Malignant hyperthermia bowtie

- **Proposed ID / disposition:** `gpt_format13_mh_bowtie` — `CLEAR`
- **Decision and classification:** Recognize acute malignant hyperthermia and select two response functions plus two response parameters. `bowtie`; medium; Reduction of Risk Potential; Perioperative Care; `take_action`.
- **Difficulty rationale:** The trigger-linked cluster is classic, but the learner must distinguish trigger removal/oxygenation from dantrolene rescue and end-tidal carbon dioxide from temperature response.
- **Coverage rationale:** Extends a current diagnosis-only visual item into a nonvisual management-and-evaluation map.
- **Scenario contract:** Adult under general anesthesia with volatile-agent or succinylcholine exposure, unexplained rapid end-tidal carbon dioxide rise despite ventilation, tachycardia, rigidity, and rapidly rising core temperature. Exclude rash/bronchospasm, hemorrhage, infection, local-anesthetic exposure, and arrest. Do not name malignant hyperthermia or reveal dantrolene. Keep dosing protocol-directed.
- **Interaction proof:** Condition: acute malignant hyperthermia. Actions: discontinue triggers and hyperventilate with 100% oxygen; administer rapid protocol-directed IV dantrolene. Parameters: end-tidal carbon dioxide trend; core-temperature trend. The actions remove/support versus specifically treat; the parameters track hypermetabolism/ventilation versus thermal progression.
- **Collision proof:** Searched `malignant hyperthermia`, `dantrolene`, `volatile anesthetic`, `succinylcholine`, `ETCO2`, `end-tidal CO2`, and `rigidity`. Closest comparator: `vit_10`, a visual multiple-choice recognition task using temperature and heart-rate patterns. Material divergence: C02 scores the emergency action and evaluation map, with end-tidal carbon dioxide and rigidity, rather than diagnosis alone.
- **Sources and mapping:** [MHAUS Managing a Crisis, Emergency Treatment for an Acute MH Event](https://www.mhaus.org/healthcare-professionals/managing-a-crisis/) supports trigger discontinuation, 100% oxygen, rapid dantrolene, end-tidal carbon dioxide response, and temperature-directed cooling. [MHAUS What Is MH?, signs section](https://www.mhaus.org/about/what-is-mh-mhaus/) supports rigidity, tachycardia, temperature rise, and metabolic features. Current-page dates are not stated; accessed 2026-07-28.
- **Disposition reason:** The interaction tests a materially broader, clinically coherent construct than its visual comparator.

### C03 — Peritoneal-dialysis peritonitis bowtie

- **Proposed ID / disposition:** `gpt_format13_pd_peritonitis_bowtie` — `CLEAR`
- **Decision and classification:** Recognize suspected PD-related peritonitis, preserve specimen-before-treatment sequencing, and select local and systemic response monitoring. `bowtie`; medium; Reduction of Risk Potential; Procedural Complications & Dialysis; `take_action`.
- **Difficulty rationale:** Requires linking two local findings to the syndrome and maintaining diagnostic yield while distinguishing effluent response from patient-level deterioration.
- **Coverage rationale:** No current scored PD-peritonitis construct was found.
- **Scenario contract:** Hemodynamically stable adult on maintenance PD with new cloudy effluent and generalized abdominal pain before effluent studies or antibiotics. Exclude sepsis, an isolated mechanical outflow problem, surgical abdomen, isolated exit-site/tunnel infection, and prior antibiotics. Do not name peritonitis or supply an interpreted effluent count. Regimen choice remains center-specific; intraperitoneal preference applies because systemic sepsis is excluded.
- **Interaction proof:** Condition: suspected PD-related peritonitis. Actions: collect effluent for cell count/differential/Gram stain/culture before antibiotics; start center-specific empiric gram-positive/gram-negative therapy promptly after collection under the authorized protocol. Parameters: effluent appearance/WBC trend; abdominal pain/systemic clinical status. Diagnostic preservation and therapy initiation are distinct; local inflammatory and whole-patient response are distinct.
- **Collision proof:** Searched `peritoneal dialysis`, `PD peritonitis`, `cloudy effluent`, `dialysis outflow`, `effluent culture`, and `effluent white blood cell` across all live surfaces. No comparator contained the condition/action/parameter map.
- **Sources and mapping:** [ISPD peritonitis guideline recommendations: 2022 update](https://ispd.org/wp-content/uploads/2025/09/LI-ET-1.pdf), corrected 2023-03 and 2024-04: diagnosis pp. 119–120 supports cloudy-effluent presumption and effluent testing; empirical selection p. 122 supports prompt center-specific gram-positive/gram-negative coverage; route p. 123 supports intraperitoneal preference absent systemic sepsis; subsequent management p. 128 supports clinical and effluent-WBC reassessment.
- **Disposition reason:** Both actions and both response dimensions are directly supported without inventing a drug regimen.

### C04 — Metabolic-syndrome threshold highlight

- **Proposed ID / disposition:** `gpt_format13_metabolic_syndrome_highlight` — `CLEAR`
- **Decision and classification:** Select the three raw measurements meeting the cited general adult metabolic-syndrome criteria. `highlight`; medium; Health Promotion and Maintenance; Adult Health & Wellness; `analyze_cues`.
- **Difficulty rationale:** Requires simultaneous application of five adjacent thresholds without a supplied interpretation.
- **Coverage rationale:** No live item scores the five-factor threshold boundary.
- **Scenario contract:** Adult woman at a preventive visit using NHLBI's general adult thresholds. Selectable measurements: waist 36.5 inches, repeated BP 132/86 mm Hg, fasting glucose 104 mg/dL, triglycerides 148 mg/dL, and HDL 52 mg/dL. Exclude medication treatment, pregnancy, established disease diagnoses, and ethnicity-specific waist rules. Do not call any value abnormal or state the conclusion.
- **Interaction proof:** Selection rule: choose only waist, blood pressure, and fasting glucose, which together reach the three-of-five boundary. Each key supplies a different criterion; removing any key leaves only two. Same-level near misses are triglycerides just below 150 and HDL not below 50 for women. No direct conclusion or preinterpreted result may appear.
- **Collision proof:** Searched `metabolic syndrome`, `waist circumference`, `triglycerides 150`, `HDL 50`, `fasting glucose 100`, and `three of five`. Only incidental waist-measurement content appeared; no scored threshold-set comparator was found.
- **Sources and mapping:** [NHLBI What Is Metabolic Syndrome? (2022-05-18)](https://www.nhlbi.nih.gov/health/metabolic-syndrome) supports the three-of-five rule. [NHLBI Diagnosis (2022-05-18)](https://www.nhlbi.nih.gov/health/metabolic-syndrome/diagnosis) supports every keyed and near-miss threshold. The item must state that the cited general adult thresholds are being used because waist cutoffs may vary by race and ethnicity.
- **Disposition reason:** The selection boundary is exact, all three keys are necessary, and two plausible near misses sit at the same decision level.

### C05 — qSOFA cue highlight

- **Proposed ID / disposition:** `gpt_format13_qsofa_highlight` — `REPLACE`
- **Decision and classification:** In an adult with suspected infection, select respiratory rate at least 22/min, altered mentation, and systolic BP at most 100 mm Hg as the qSOFA variables. `highlight`; medium; Physiological Adaptation; Sepsis & Septic Shock; `analyze_cues`.
- **Difficulty rationale:** Requires applying three exact cutoffs amid plausible sepsis findings, but the cue set itself is compact.
- **Coverage rationale:** qSOFA is a discrete bedside criterion set, but its intended cue-selection surface is already densely represented.
- **Scenario contract:** Adult outside the ICU with suspected infection; raw mental-status, respiratory-rate, systolic-pressure, heart-rate, temperature, lactate, and white-cell data. Exclude vasopressors, shock, respiratory failure, and a supplied score. Do not name qSOFA in the passage or preinterpret any value. Scope is bedside risk prompting further evaluation, not a standalone sepsis diagnosis.
- **Interaction proof:** Selection rule would key only altered mentation, respiratory rate at least 22/min, and systolic BP at most 100 mm Hg. Each is one qSOFA point; removal changes the total. Same-level near misses would include tachycardia, fever, leukocytosis, and lactate. Direct conclusion and calculated score would be excluded.
- **Collision proof:** Searched `qSOFA`, `respiratory rate 22`, `systolic blood pressure 100`, `altered mentation`, `sepsis triage`, `confusion hypotension tachypnea`, and the complete three-cue cluster. Closest comparators: `gpt_format7c_sepsis_triage_cues_highlight`, which already highlights infection, new confusion, hypotension/perfusion findings, and lactate as urgent sepsis cues; and `cs_sepsis_shock_01_part_1`, which scores recognition of an infection-related deterioration cluster. The proposed change from general sepsis cues to the named qSOFA thresholds does not create a clean enough highlight interaction divergence because confusion, low pressure, and tachypnea remain the load-bearing selection surface.
- **Source and mapping:** [Singer et al., “The Third International Consensus Definitions for Sepsis and Septic Shock,” JAMA 2016](https://jamanetwork.com/journals/jama/articlepdf/2492881/jsc160002.pdf), Box 4, supports the three qSOFA variables and cutoffs and frames them as a prompt to investigate organ dysfunction and escalate monitoring. It does not support using qSOFA as a stand-alone diagnosis.
- **Disposition reason:** Replaced because the exact scored cue cluster is too close to current sepsis-triage highlighting. C06 underwent a new full preflight and replaced it.

### C06 — Kawasaki principal-feature highlight

- **Proposed ID / disposition:** `gpt_format13_kawasaki_highlight` — `CLEAR`
- **Decision and classification:** With prolonged fever supplied as fixed context, select four principal Kawasaki features. `highlight`; medium; Physiological Adaptation; Cardiovascular Disorders; `recognize_cues`.
- **Difficulty rationale:** Requires separating four principal features from a near-threshold lymph-node finding and a plausible associated symptom.
- **Coverage rationale:** No current scored Kawasaki construct was found.
- **Scenario contract:** Three-year-old with fever at or above 101.3 °F (38.5 °C) for six days as nonselectable context. Selectable facts include bilateral nonexudative conjunctival change, polymorphous rash, red/swollen palms and soles, red cracked lips/strawberry tongue, a unilateral 1.0-cm cervical node, and vomiting or diarrhea. Exclude coronary findings, shock, myocarditis, an alternative diagnosis, and a node larger than 1.5 cm. Do not name Kawasaki disease or label findings as principal.
- **Interaction proof:** Key the four ocular, rash, extremity, and oral-mucosal classes. Each is a distinct principal feature, and removal leaves only three of the four needed with prolonged fever. Near misses are the undersized node and a nonspecific gastrointestinal symptom. No conclusion statement or interpreted result is permitted.
- **Collision proof:** Searched `Kawasaki`, `five-day fever`, `strawberry tongue`, `conjunctival`, `swollen palms`, `swollen soles`, and `cervical lymph node 1.5`. No current scored comparator was found.
- **Source and mapping:** [American Heart Association, Kawasaki Disease, Symptoms and Diagnosis, reviewed 2025-09-03](https://www.heart.org/en/health-topics/kawasaki-disease) supports prolonged fever plus at least four of five principal features and the greater-than-1.5-cm cervical-node boundary. It also notes that no single test confirms the condition; incomplete presentations and mimics remain outside the narrow classic-feature construct.
- **Disposition reason:** The replacement has an exact source boundary, four independently necessary keys, credible near misses, and no semantic comparator.

### C07 — WHO pediatric-dehydration highlight

- **Proposed ID / disposition:** `gpt_format13_who_dehydration_highlight` — `REPLACE`
- **Decision and classification:** Select findings that establish WHO severe dehydration in a child with diarrhea. `highlight`; medium; Physiological Adaptation; Renal & Gastrointestinal Disorders; `recognize_cues`.
- **Difficulty rationale:** Requires applying the two-or-more sign boundary while distinguishing “some dehydration” findings.
- **Coverage rationale:** Pediatric dehydration is clinically important, but the live corpus already scores essentially the same classification boundary.
- **Scenario contract:** Young child with acute diarrhea; raw general condition, eyes, drinking, and skin-pinch findings. The intended severe signs were lethargic/unconscious, sunken eyes, unable to drink/drinking poorly, and skin pinch returning very slowly; plausible near misses were restlessness/irritability, drinking eagerly/thirsty, and skin pinch returning slowly. Exclude shock, severe malnutrition, dysentery, and preassigned dehydration class. Do not label a sign or classification.
- **Interaction proof:** Selection rule would choose the WHO severe-dehydration signs, with at least two required for classification. Each evidence class occupies a separate IMCI assessment dimension, and near misses come from the adjacent “some dehydration” row. No calculated or interpreted result would be supplied.
- **Collision proof:** Searched `severe dehydration`, `some dehydration`, `sunken eyes`, `skin pinch very slowly`, `unable to drink`, `WHO dehydration`, and the four-sign matrix. Closest comparators: `sa_ped_dehydration_01`, which already uses the same pediatric dehydration classification matrix, and `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03_q1`, which scores the same clinical severity/cue family. Changing the wrapper to a highlight would not sufficiently change the tested decision.
- **Source and mapping:** [WHO IMCI chart booklet](https://iris.who.int/bitstream/handle/10665/69694/IMCI_chartbooklet.pdf?sequence=1), “Does the child have diarrhoea?” dehydration classification table, supports the four severe-dehydration signs, the two-or-more rule, and the adjacent some-dehydration signs. Scope is children assessed under the IMCI algorithm.
- **Disposition reason:** Replaced because the severity classification and load-bearing cue set collide with current scored content. C08 underwent a new full preflight and replaced it.

### C08 — KDIGO stage 2 AKI creatinine highlight

- **Proposed ID / disposition:** `gpt_format13_kdigo_aki_stage2_highlight` — `CLEAR`
- **Decision and classification:** Select only the baseline/current creatinine facts necessary to establish stage 2 AKI by KDIGO's creatinine criterion. `highlight`; medium; Reduction of Risk Potential; Laboratory & Diagnostic Tests; `analyze_cues`.
- **Difficulty rationale:** Requires identifying the acute baseline/current pair, mentally verifying a ratio boundary, and rejecting renal data that do not independently stage the injury.
- **Coverage rationale:** Adds a raw-data creatinine staging construct distinct from the existing urine-output calculation.
- **Scenario contract:** Adult inpatient with stable baseline creatinine 0.8 mg/dL three days earlier and current creatinine 1.7 mg/dL; plausible nonkeys are BUN 28 mg/dL, urine output 0.7 mL/kg/h for 12 hours, potassium 4.6 mEq/L, and chronic hypertension. Exclude additional staging values, oliguria that meets a stage boundary, dialysis, and anuria. Do not state the ratio, AKI, or stage. Use final KDIGO 2012 rather than the March 2026 public-review draft.
- **Interaction proof:** Key the dated baseline and current creatinine only. The baseline supplies denominator and acute timing; the current value supplies the numerator. Together they produce 2.125 times baseline, within 2.0–2.9. Removing either destroys the inference. BUN, normal potassium, history, and the supplied urine output are same-domain near misses but do not establish stage 2.
- **Collision proof:** Searched `KDIGO`, `AKI stage 2`, `2.0-2.9 times baseline`, `serum creatinine baseline`, `urine output criteria`, and `acute kidney injury staging`. Closest comparator: `gpt_case_gap_2026_06_11_aki_fib_04`, which calculates weight-normalized urine output and interprets oliguria. C08 instead selects two creatinine facts and applies a different staging boundary.
- **Source and mapping:** [KDIGO Clinical Practice Guideline for Acute Kidney Injury, final 2012](https://kdigo.org/wp-content/uploads/2016/10/KDIGO-2012-AKI-Guideline-English.pdf), recommendations 2.1.1–2.1.2 and Table 2, supports the seven-day acute timing, stage 2 serum-creatinine range of 2.0–2.9 times baseline, and the separate urine-output criteria.
- **Disposition reason:** The replacement is mathematically and semantically distinct from the nearest renal comparator and has a precise final-guideline boundary.

### C09 — Urine albumin-to-creatinine ratio fill-in-blank

- **Proposed ID / disposition:** `gpt_format13_uacr_fib` — `CLEAR`
- **Decision and classification:** Calculate UACR from spot urine albumin and creatinine. `fill_in_blank`; medium; Reduction of Risk Potential; Laboratory & Diagnostic Tests; `analyze_cues`.
- **Difficulty rationale:** Requires preserving the unlike denominator units in a short ratio, without a scored interpretation.
- **Coverage rationale:** The complete UACR equation is absent from the live formula corpus.
- **Scenario contract:** Adult outpatient spot urine with albumin 3.6 mg/dL and creatinine 0.09 g/dL; supply the NIDDK formula. Exclude reference thresholds, CKD stage, treatment decisions, and unstated conversions. Do not show the division or classify the result.
- **Interaction proof:** Inputs 3.6 mg/dL and 0.09 g/dL; formula UACR (mg/g) = albumin (mg/dL) ÷ creatinine (g/dL); no conversion; request mg/g; round to nearest whole. Independent check: 3.6 ÷ 0.09 = 40; final 40 mg/g. Equivalent searches covered `UACR`, `ACR`, full albumin-to-creatinine wording, mg/dL over g/dL, mg/L/g/L forms, and rearrangements.
- **Collision proof:** Closest comparator: `gpt_format11b_cockcroft_gault_crcl`, another renal calculation. It uses age, weight, sex factor, and serum creatinine for creatinine clearance; it does not share this equation, analytes, or result unit.
- **Source and mapping:** [NIDDK Assess Urine Albumin, UACR section](https://www.niddk.nih.gov/health-information/professionals/clinical-tools-patient-management/kidney-disease/identify-manage-patients/evaluate-ckd/assess-urine-albumin), reviewed 2012-03, directly supplies the mg/dL ÷ g/dL = mg/g formula. No interpretive threshold is scored.
- **Disposition reason:** The complete mathematical signature is source-owned, independently recomputed, and noncolliding.

### C10 — Mosteller BSA fill-in-blank

- **Proposed ID / disposition:** `gpt_format13_mosteller_bsa_fib` — `CLEAR`
- **Decision and classification:** Calculate BSA with the supplied Mosteller formula. `fill_in_blank`; medium; Pharmacological and Parenteral Therapies; Dosage Calculations; `analyze_cues`.
- **Difficulty rationale:** Requires correct substitution into a square-root formula and rounding, but no downstream medication judgment.
- **Coverage rationale:** Computes BSA itself rather than using an already provided BSA in a drug-dose check.
- **Scenario contract:** Adult oncology verification; height 165 cm and weight 64 kg; supply and name the Mosteller formula. Exclude medication dose, maximum, organ adjustment, interpretation, and alternate BSA equations. Do not show intermediate values or a precomputed BSA.
- **Interaction proof:** Formula: √([165 × 64] ÷ 3600); no conversion; request m² to nearest hundredth. Independent check: radicand 2.9333333333; unrounded result 1.7126976772; final 1.71 m². Equivalent searches covered `Mosteller`, `BSA`, the square-root signature, already-supplied-BSA items, and rearranged/wrapped forms.
- **Collision proof:** Closest comparator: `gpt_balance3_2026_07_16_bt_dosage_calculations_09`, which uses a supplied BSA to evaluate a doxorubicin mg/m² dose. C10 scores the antecedent BSA calculation only.
- **Source and mapping:** [NCI CTEP Pharmaceutical Management Branch, “BSA in Four-Part Harmony,” 2011-11](https://ctep.cancer.gov/branches/pmb/inside_pmb/nov2011.pdf), Mosteller formula section, supports the exact equation and units. Because several BSA formulas exist, the stem must name and supply Mosteller.
- **Disposition reason:** The equation signature, scored result, and reasoning step are distinct from the supplied-BSA medication comparator.

### C11 — Celsius-to-Fahrenheit fill-in-blank

- **Proposed ID / disposition:** `gpt_format13_c_to_f_fib` — `CLEAR`
- **Decision and classification:** Convert a Celsius-only clinical measurement to Fahrenheit. `fill_in_blank`; easy; Reduction of Risk Potential; Laboratory & Diagnostic Tests; `analyze_cues`.
- **Difficulty rationale:** A single supplied linear conversion requires one multiplication, one addition, and direct rounding.
- **Coverage rationale:** Adds an exact measurement conversion not currently scored, while matching the product's Fahrenheit-first learner convention.
- **Scenario contract:** Adult device or laboratory measurement of 38.3 °C only; supply °F = (°C × 1.8) + 32. Exclude a fever threshold, diagnosis, treatment decision, second temperature, and preconverted display pair. Do not label the value or show substitution.
- **Interaction proof:** Input 38.3 °C; exact formula supplied; request °F to nearest tenth. Independent check: 38.3 × 1.8 + 32 = 100.94; final 100.9 °F. Equivalent searches covered Celsius/Fahrenheit terms, ×9/5 + 32, inverse conversion, and existing bilingual display pairs.
- **Collision proof:** No scored conversion equation was found. Existing Fahrenheit/Celsius pairs are learner-facing displays, not mathematical tasks, so they do not collide.
- **Source and mapping:** [NIST SI Units — Temperature, Temperature Conversion (Exact)](https://www.nist.gov/pml/owm/si-units-temperature), current page updated 2026, supports the exact formula. It does not support or require a clinical fever interpretation.
- **Disposition reason:** The equation is stable, exact, independently recomputed, and absent from the formula corpus.

### C12 — Occupational HBV postexposure dropdown

- **Proposed ID / disposition:** `gpt_format13_hbv_pep_dropdown` — `CLEAR`
- **Decision and classification:** Select HBV postexposure management for three independent healthcare-personnel profiles. `dropdown_cloze`; medium; Safety and Infection Prevention and Control; Standard Precautions & Hygiene; `take_action`.
- **Difficulty rationale:** Requires three distinct branches from one CDC table based on series, documented response or prompt titer, and source status.
- **Coverage rationale:** Adds exact HBV prophylaxis decisions rather than generic needlestick washing/reporting.
- **Scenario contract:** Three percutaneous or mucosal occupational exposures. Record 1 is a documented responder after a complete series with an HBsAg-positive source. Record 2 is a documented nonresponder after two complete series with a positive or unknown source. Record 3 completed a series but lacks prior response documentation, has prompt anti-HBs below 10 mIU/mL, and has a positive or unknown source. Exclude other pathogen management, active hepatitis, separate trauma, and unstated histories. Do not label immunity or prophylaxis need.
- **Interaction proof / evidence partition:**

| Record | Self-contained evidence | Distinct decision | Same-level distractor classes | Correct position |
|---|---|---|---|---:|
| 1 | Complete series; documented response ≥10; positive source | No HBV PEP | No action; vaccine only; HBIG once + revaccination; HBIG twice | 2 |
| 2 | Two complete series; documented response <10 after both; positive/unknown source | HBIG twice, one month apart | Same four CDC-table branches | 3 |
| 3 | Complete series; prior response unknown; prompt anti-HBs <10; positive/unknown source | HBIG once + initiate revaccination | Same four CDC-table branches | 1 |

  Each record carries all evidence for its own table branch and does not reveal another. Position plan: `[2, 3, 1]`.
- **Collision proof:** Searched `hepatitis B occupational exposure`, `HBV PEP`, `HBIG`, `anti-HBs 10`, `vaccine responder`, `vaccine nonresponder`, and `needlestick`. Closest comparator: `gemini_sic_ngn_2026_06_21_q4`, which tests immediate wash/report actions. C12 begins after first aid and scores immune-status prophylaxis branches.
- **Source and mapping:** [CDC Table 1: Treatment for HBV Exposures in Health Care Settings, 2024-05-13](https://www.cdc.gov/hepatitis-b/hcp/infection-control/table-1.html) directly supports all three record decisions. Scope is occupational exposure in healthcare; unrelated bloodborne-pathogen management and optional local follow-up are excluded.
- **Disposition reason:** The three records are independent, genuinely different decisions within one narrow subtopic, and use balanced same-level distractors.

### C13 — Tetanus wound-prophylaxis dropdown

- **Proposed ID / disposition:** `gpt_format13_tetanus_wound_dropdown` — `CLEAR`
- **Decision and classification:** Choose tetanus vaccine and TIG management for three wound/immunization profiles. `dropdown_cloze`; medium; Safety and Infection Prevention and Control; Patient & Environment Safety; `take_action`.
- **Difficulty rationale:** Requires combining wound class, primary-series status, elapsed time, and TIG eligibility across three different outcomes.
- **Coverage rationale:** No current scored wound algorithm combines the five-/ten-year vaccine thresholds with TIG.
- **Scenario contract:** Three adults presenting promptly. Record 1: clean minor wound, complete primary series, last dose eight years ago. Record 2: dirty puncture wound, complete series, last dose seven years ago, no HIV or severe immunodeficiency. Record 3: dirty major wound, vaccination history unknown. Exclude tetanus disease, infection, delay, hemorrhage, and antibiotic decisions. Do not reveal booster/TIG need.
- **Interaction proof / evidence partition:**

| Record | Self-contained evidence | Distinct decision | Same-level distractor classes | Correct position |
|---|---|---|---|---:|
| 1 | Clean minor; complete series; dose 8 years ago | No vaccine and no TIG | Neither; vaccine only; TIG only; both | 3 |
| 2 | Dirty puncture; complete series; dose 7 years ago; no immune exception | Vaccine only | Same four prophylaxis classes | 1 |
| 3 | Dirty major; unknown history | Vaccine plus TIG | Same four prophylaxis classes | 2 |

  Each record independently supplies wound type, history, elapsed time when needed, and the immune-status boundary. Position plan: `[3, 1, 2]`.
- **Collision proof:** Searched `tetanus`, `TIG`, `tetanus immune globulin`, `dirty wound`, `puncture wound`, `5 years`, `10 years`, and `wound vaccination`. Routine Tdap content was found, but no equivalent wound-prophylaxis set.
- **Source and mapping:** [CDC Clinical Guidance for Wound Management to Prevent Tetanus, 2025-06-10](https://www.cdc.gov/tetanus/hcp/clinical-guidance/index.html), assessing risk, vaccination, and TIG sections, supports record 1's ten-year clean-wound rule, record 2's five-year dirty-wound booster without TIG, and record 3's vaccine-plus-TIG pathway. HIV/severe-immunodeficiency exceptions are expressly excluded from record 2.
- **Disposition reason:** All records are self-contained and exercise separate branches with noncaricatured prophylaxis options.

### C14 — Varicella-exposed healthcare-personnel dropdown

- **Proposed ID / disposition:** `gpt_format13_varicella_hcp_dropdown` — `CLEAR`
- **Decision and classification:** Choose postexposure prophylaxis, monitoring, and work restriction for three asymptomatic exposed healthcare personnel. `dropdown_cloze`; hard; Safety and Infection Prevention and Control; Transmission-Based Precautions; `take_action`.
- **Difficulty rationale:** Requires integrating evidence of immunity, vaccination eligibility, pregnancy, VariZIG, and two different monitoring/exclusion windows.
- **Coverage rationale:** Tests occupational postexposure management, not patient isolation.
- **Scenario contract:** Record 1 has documented evidence of immunity. Record 2 lacks other evidence, has one prior vaccine dose, is eligible for live vaccine, and receives a second dose within five days. Record 3 is a susceptible pregnant worker for whom VariZIG is indicated and administered. All are asymptomatic after defined exposures. Exclude current illness, other immunocompromise, additional exposure dates, and hidden immunity. Do not label immune/susceptible or state intervals outside options.
- **Interaction proof / evidence partition:**

| Record | Self-contained evidence | Distinct decision | Same-level distractor classes | Correct position |
|---|---|---|---|---:|
| 1 | Exposure; evidence of immunity; asymptomatic | No PEP/restriction; monitor days 8–21 | Monitor only; exclude 8–21; vaccinate; VariZIG/exclude 8–28 | 1 |
| 2 | Exposure; one prior dose; no other immunity; vaccine eligible; second dose within 5 days; asymptomatic | No routine restriction; monitor days 8–21 | Same occupational PEP/restriction classes | 3 |
| 3 | Exposure; no immunity; pregnancy; VariZIG given; asymptomatic | Exclude days 8–28 after last exposure | Same occupational PEP/restriction classes | 2 |

  Each record contains its own immunity, eligibility/prophylaxis, and symptom facts. The day-28 extension appears only in the VariZIG record. Position plan: `[1, 3, 2]`.
- **Collision proof:** Searched `varicella healthcare personnel`, `varicella postexposure`, `evidence of immunity`, `VariZIG`, `exclude from work day 8`, `day 21`, `day 28`, and `second vaccine dose`. Closest comparator: `gpt_gap_jun11_sata_varicella_precautions_02`, which tests isolation actions for a patient with suspected varicella. C14 instead tests three asymptomatic worker PEP/restriction branches.
- **Source and mapping:** [CDC Varicella-Zoster Virus: Infection Control in Healthcare Personnel](https://www.cdc.gov/infection-control/hcp/healthcare-personnel-epidemiology-control/varicella.html), current 2025 guideline/page dated 2026-03-23, recommendations 1–2 and postexposure prophylaxis, supports record 1's monitoring-only pathway, record 2's prompt second dose/no routine restriction pathway, and record 3's VariZIG-linked day 8–28 exclusion.
- **Disposition reason:** The records are independently answerable and test three distinct occupational decisions; the construct is materially different from patient isolation.

## Clearance and Authoring Boundary

Only the 12 `CLEAR` candidates appear in the manifest. C05 and C07 do not. The later producer may not add, substitute, materially revise, or silently repair rows. A row that cannot be authored safely may be omitted only by returning it to preflight, as encoded in the manifest.

No polished learner-facing stem, options, rationale, translation, raw bank, promoted bank, ledger entry, census update, schema change, or application change is part of this preflight.

## Mechanical Verification

The final verification covered JSON parsing, recomputed totals, ID uniqueness against all bundled standalone and embedded scored IDs, live enum vocabulary, category/topic licensing, interaction shapes, source references, dropdown permutations, absence of disposition fields, and live canonical routing.

Commands used:

```sh
jq empty GPT-SCORED-FORMAT-BATCH-13-CLEARED-MANIFEST-2026-07-28.json

jq '{questions:(.rows|length), itemTypes:(.rows|group_by(.itemType)|map({key:.[0].itemType,value:length})|from_entries), difficulties:(.rows|group_by(.difficulty)|map({key:.[0].difficulty,value:length})|from_entries), categories:(.rows|group_by(.category)|map({key:.[0].category,value:length})|from_entries)}' GPT-SCORED-FORMAT-BATCH-13-CLEARED-MANIFEST-2026-07-28.json

npx tsx -e '<manifest contract checker: totals, IDs, vocabulary, topic licensing, interaction shapes, sources, dropdown plans, dispositions, and routing>'

git diff --check -- GPT-SCORED-FORMAT-BATCH-13-CODEX-PREFLIGHT-REPORT-2026-07-28.md GPT-SCORED-FORMAT-BATCH-13-CLEARED-MANIFEST-2026-07-28.json
```

Result: **PASS**. The recomputed totals are 12 questions; item types 3/3/3/3; difficulties 1 easy, 9 medium, 2 hard; categories 6/3/1/1/1 as listed above. The planned raw filename resolves to `gpt-canonical.json`. No raw or canonical bank was created or changed.
