# Producer Commission — Scored-Format Batch 11

Date: 2026-07-18

Status: **ready for generation**

Producer: GPT-5.6 Sol (`gpt_` lane)

Scope: 18 standalone, text-only questions in three independently runnable raw files, with six
pre-screened reserve rows

## 1. Commission purpose and planning assumption

This is the next scored-format backfill order. The current repository baseline records Batches 8 and
9 and 17 of 18 Batch 10 assignments as independently reviewed and promoted. Treat every promoted
item and every released Batch 8–10 manifest construct as occupied; a commissioned construct remains
excluded even if its row was blocked before promotion.

The five lowest scored standalone formats remain `bowtie`, `highlight`, `fill_in_blank`,
`ordered_response`, and `dropdown_cloze`. Batch 11 assigns 5 bowties, 4 highlights, 3
fill-in-the-blank questions, 3 ordered responses, and 3 dropdown clozes. The emphasis is on distinct
emergency differentials, bounded diagnostic calculations, procedure technique, and laboratory
localization rather than repeating the dense medication-administration or prior-batch pathways.

These are assignments, not permission to force a premise. Use a matched reserve when—and only
when—a primary row is blocked under Section 4. Do not invent an unlisted substitute.

## 2. Required final disk state

Do **not** return JSON in chat. Use the available repository read/write tools so that the final disk
state contains these exact new paths under `banks/banks-raw/`:

| Sub-batch | Required primary shape | Exact raw filename |
|---|---|---|
| 11A | 5 `bowtie` + 1 `highlight` | `banks/banks-raw/gpt-format11a-bowtie-highlight-2026-07-18.json` |
| 11B | 3 `highlight` + 3 `fill_in_blank` | `banks/banks-raw/gpt-format11b-highlight-fib-2026-07-18.json` |
| 11C | 3 `ordered_response` + 3 `dropdown_cloze` | `banks/banks-raw/gpt-format11c-ordered-dropdown-2026-07-18.json` |

Before writing, confirm that none of the target paths exists. If a target exists, stop on that
sub-batch and report the path collision; do not overwrite, rename, or create an alternate copy. Each
written path must contain one complete valid JSON object and no Markdown fence or prose note.

Only the three target paths may be created or changed. Do not edit tracked files, canonical banks,
existing raw drafts, schema, ledger, census, history, or this spec. Do not run promotion,
consolidation, the promotion gate, or the canonical audit suite.

No particular temporary-file or atomic-write implementation is required. The requirement is the
final disk state above: complete parseable JSON at the exact paths, with no partial or auxiliary
files left in `banks/banks-raw/`.

## 3. Capability-aware validation handoff

Repository read/write access does not imply shell execution.

- If command execution is available, after writing each file run the following checks and report the
  results:

  ```bash
  npm run normalize-raw-bank -- banks/banks-raw/<exact-filename>.json
  npm run validate-bank -- banks/banks-raw/<exact-filename>.json
  ```

  Normalization is a dry run. Use `--write` only after reviewing deterministic normalizer-owned
  changes. Any later JSON repair must load, mutate, and re-serialize the object programmatically.
- If command execution is unavailable, do **not** attempt the commands and do not treat that as a
  production failure. Report `normalization and validation deferred to Codex/checker (no command
  execution in producer seat)`. Codex/checker owns mandatory execution before Claude review.

The final response is a compact receipt: three paths, actual item counts, primary/reserve use,
collision-preflight result, and either command results or the exact deferred statement above. Do not
paste question JSON.

## 4. Collision preflight, reserves, and blocked-row policy

### 4.1 Producer preflight

Before authoring prose, and again against completed drafts, inspect:

1. every standalone question and embedded case-study leaf in top-level `banks/*.json`;
2. every live JSON draft under `banks/banks-raw/`; and
3. Batches 8–10 as occupied construct manifests, regardless of review status.

For each primary and reserve row, identify the nearest existing construct. Compare the equation or
scoring rule, decisive cue cluster, response demand, keyed pathway, and serial template—not just
diagnosis words. A row is blocked when it repeats the same construct under different values,
demographics, symptoms, format, category, or wrapper.

Spec-author preflight for this commission covered current bundled standalone items, embedded leaves,
and the released Batch 8–10 manifests. By commissioning decision, Batch 10 raw content was not opened
or clinically reviewed during spec preparation; its promoted items were screened from the current
canonical bank and all 18 assigned constructs were conservatively treated as occupied. The producer
must complete the live-raw portion before authoring.

### 4.2 Reserve substitution policy

Six reserve rows are provided in Section 6, one for each item-type/difficulty lane in this batch.

- A primary row that passes preflight must be used; reserves are not elective alternatives.
- A blocked primary may be replaced only by the single unused reserve with the same `itemType` and
  difficulty.
- Each reserve may be used at most once and stays in the same sub-batch as the blocked primary's
  format lane.
- Report `primary # → reserve ID`, the conflicting existing ID, and the blocking reason.
- If a blocked primary has no unused matched reserve, omit it. Do not invent a nineteenth construct,
  change difficulty, or force the row.

The target is exactly 18 questions when primaries and available matched reserves clear preflight.
If unresolved blocks exceed reserve capacity, a smaller internally valid bank is the required final
state; the receipt must report the actual count. This blocked-row outcome is preferable to a silent
collision or an unlisted substitute.

## 5. Primary assignment manifest

All questions are standalone. No case studies, visuals, rationale visuals, scoring-tool images, or
taxonomy changes are authorized. Author to the current `NCLEX-Question-Schema.md`. Use readable,
globally unique IDs with prefixes `gpt_format11a_`, `gpt_format11b_`, or `gpt_format11c_`.

Aggregate primary distribution:

- Format: 5 bowtie / 4 highlight / 3 fill-in-the-blank / 3 ordered response / 3 dropdown cloze.
- Difficulty: 3 easy / 9 medium / 6 hard.
- Category follows the tested construct exactly; do not move a row to improve a histogram.

### Batch 11A — bowtie and highlight

| # | Category | Canonical topic | itemType | Difficulty | Mandated assessment target |
|---|---|---|---|---|---|
| 1 | Physiological Adaptation | Sepsis & Septic Shock | bowtie | hard | Distinguish a necrotizing soft-tissue infection from uncomplicated cellulitis, deep-vein thrombosis, and acute compartment syndrome using rapid progression, pain pattern, systemic toxicity, skin findings, and response to initial therapy. Key two immediate actions already authorized by the named IDSA pathway and two parameters that track deterioration or response. Surgical consultation/debridement cannot be delayed for imaging when clinical suspicion is high; do not invent an antibiotic dose. |
| 2 | Physiological Adaptation | Endocrine & Neurological Disorders | bowtie | hard | Distinguish acute primary angle closure from primary open-angle glaucoma, anterior uveitis, and migraine using abrupt pain, visual symptoms, pupil/corneal/anterior-chamber findings, nausea, and measured pressure supplied in the stem. Key two actions in an explicit ophthalmology emergency plan and two ocular/systemic response parameters. Do not ask a nurse to select an unsourced medication sequence or imply that chronic open-angle glaucoma presents this way. |
| 3 | Physiological Adaptation | Maternal-Newborn Care & Teaching | bowtie | hard | A postpartum client develops fever plus uterine tenderness and malodorous or purulent lochia after delivery. Distinguish postpartum endometritis from mastitis, urinary infection, wound infection, and septic pelvic thrombophlebitis using location and timing cues. Key two actions already ordered under the maternal-infection plan and two response/deterioration parameters. Do not prescribe a dose or claim that one finding alone proves the source. |
| 4 | Physiological Adaptation | Renal & Gastrointestinal Disorders | bowtie | hard | Distinguish acute mesenteric ischemia from pancreatitis, bowel obstruction, gastroenteritis, and uncomplicated biliary disease using abrupt pain out of proportion, embolic/vascular risk, evolving examination, lactate limitations, and the exact WSES diagnostic lane. Key urgent CTA/surgical-vascular actions already authorized and two perfusion/abdominal response parameters. Do not wait for peritonitis or a high lactate before escalation. |
| 5 | Physiological Adaptation | Cardiovascular Disorders | bowtie | hard | Distinguish immune thrombotic thrombocytopenic purpura from HIT, DIC, ITP, and HUS using thrombocytopenia, microangiopathic hemolysis, smear, coagulation pattern, renal/neurologic cues, and exposure history. Key the exact ISTH sequence of obtaining the ADAMTS13 sample before blood product/TPE when feasible without delaying urgent TPE/corticosteroid treatment, plus two response parameters. Do not use the historical pentad as a requirement, invent doses, or treat the ADAMTS13 result as a reason to delay a high-probability pathway. |
| 6 | Physiological Adaptation | Cardiovascular Disorders | highlight | hard | A chest/back-pain note mixes nonspecific findings with the exact ACC/AHA history and examination features that raise concern for acute aortic syndrome or branch-vessel malperfusion. Highlight only high-risk cues requiring the named urgent aortic-imaging/specialist pathway. Do not diagnose dissection from pain quality alone or highlight ordinary hypertension without the discriminating cluster. |

### Batch 11B — highlight and fill-in-the-blank

Every fill-in-the-blank row has one bounded numerical response. Put the exact equation, units,
input convention, and rounding rule in the stem; recompute the key independently.

| # | Category | Canonical topic | itemType | Difficulty | Mandated assessment target |
|---|---|---|---|---|---|
| 7 | Physiological Adaptation | Cardiovascular Disorders | highlight | medium | A sudden limb-symptom note mixes chronic PAD findings with acute limb-ischemia cues. Highlight only findings that establish an immediately threatened or irreversibly threatened limb under the selected ESVS/Rutherford lane, including the exact sensory, motor, and Doppler distinctions supplied by the source. Do not turn the six Ps into an unbounded recall list or infer viability from pain alone. |
| 8 | Physiological Adaptation | Endocrine & Neurological Disorders | highlight | medium | A new-visual-symptom note mixes benign stable floaters with sudden flashes, a rapid increase in floaters, a curtain/shadow, field loss, or trauma-linked findings requiring urgent retinal evaluation under the NEI lane. Highlight only the retinal-detachment emergency cues. Do not use eye pain as required or substitute chronic cataract/open-angle-glaucoma findings. |
| 9 | Physiological Adaptation | Endocrine & Neurological Disorders | highlight | medium | An older adult's headache/vision note mixes nonspecific symptoms with giant-cell-arteritis cranial ischemia cues such as new localized headache, scalp tenderness, jaw/tongue claudication, transient or persistent visual symptoms, and compatible inflammatory context. Highlight only findings requiring urgent same-day escalation under the named guideline. Do not diagnose from ESR alone or delay the pathway for a biopsy result. |
| 10 | Pharmacological and Parenteral Therapies | Laboratory & Diagnostic Tests | fill_in_blank | medium | Supply age, weight, stable serum creatinine, sex coefficient, and the exact Cockcroft–Gault equation in the stem. State which supplied weight to use so no body-size judgment is hidden. Ask only for estimated creatinine clearance in mL/min with a rounding rule; do not choose or adjust a medication dose or equate the result with indexed eGFR. |
| 11 | Physiological Adaptation | Respiratory & Infectious Disorders | fill_in_blank | medium | For an invasively ventilated child, supply mean airway pressure, FiO2 as a decimal, PaO2, and `OI = mean airway pressure × FiO2 × 100 ÷ PaO2`. Ask for the oxygenation index with stated rounding. Test arithmetic only; do not diagnose PARDS or change ventilator settings from the number alone. |
| 12 | Reduction of Risk Potential | Laboratory & Diagnostic Tests | fill_in_blank | medium | Supply bilateral brachial systolic pressures and dorsalis-pedis/posterior-tibial pressures for one leg plus the exact AHA convention: higher ankle pressure divided by higher brachial pressure. Ask for that leg's ankle–brachial index rounded to two decimals. Do not diagnose or prescribe compression from the number alone. |

### Batch 11C — ordered response and dropdown cloze

Every ordered key is a permutation of every option. Each step needs a true serial or milestone
constraint; bundle simultaneous actions instead of inventing an internal rank.

| # | Category | Canonical topic | itemType | Difficulty | Mandated assessment target |
|---|---|---|---|---|---|
| 13 | Health Promotion and Maintenance | Pediatric & Toddler Safety | ordered_response | easy | Order the IADT first-aid pathway for an avulsed permanent tooth: identify that it is permanent, handle only the crown, rinse briefly without scrubbing when contaminated, replant promptly when appropriate or place in an approved storage medium, and obtain immediate dental care. Make contraindications and the primary-tooth exclusion explicit. Do not rank replantation and storage as simultaneous choices; use a closed branch in the stem. |
| 14 | Reduction of Risk Potential | Laboratory & Diagnostic Tests | ordered_response | easy | Order an adult clean-catch midstream urine collection using a supplied laboratory procedure: hand hygiene and preparation, cleanse without contaminating the cup, begin voiding into the toilet, collect the midstream sample, finish voiding, cap/label, and route promptly as directed. Keep sex-specific cleansing instructions inside the chosen closed pathway. Do not substitute catheter-port collection. |
| 15 | Health Promotion and Maintenance | Chronic Disease Management & Lifestyle | ordered_response | easy | Order correct home peak-flow-meter technique: reset/inspect, assume the stated upright position, inhale fully, seal and blow once hard/fast, record/reset and repeat for three attempts, then record the highest—not the average—in the action plan. Do not ask the learner to choose a treatment zone or medication. |
| 16 | Physiological Adaptation | Endocrine & Neurological Disorders | dropdown_cloze | medium | Given paired ACTH, cortisol, potassium, renin/aldosterone, and history data, distinguish primary from secondary adrenal insufficiency, identify whether mineralocorticoid deficiency is expected, and select the corresponding localization. Each dropdown tests one inference. Do not reopen adrenal-crisis treatment or claim one random cortisol value is diagnostic. |
| 17 | Reduction of Risk Potential | Laboratory & Diagnostic Tests | dropdown_cloze | medium | Use a bounded CBC/iron-study pattern to distinguish iron-deficiency anemia, anemia of chronic inflammation, and thalassemia trait. Separate ferritin/TIBC/transferrin-saturation inference from RBC-count/HbA2 inference, and identify the next confirmatory lane without treating a screening pattern as a final genetic diagnosis. Do not use ferritin without accounting for inflammation. |
| 18 | Physiological Adaptation | Endocrine & Neurological Disorders | dropdown_cloze | medium | In a monitored diagnostic record with hypotonic polyuria, use water-deprivation and desmopressin-response data to distinguish complete central DI from complete nephrogenic DI and primary polydipsia, then select the expected urine-osmolality response and sodium-safety implication. Avoid partial/indeterminate patterns. Do not instruct unsupervised water deprivation or turn desmopressin response into a treatment dose. |

## 6. Matched reserve manifest

Use a reserve only under Section 4.2. Reserve IDs are receipt labels, not required question-ID text.

| Reserve | May replace | Category / topic | itemType | Difficulty | Mandated assessment target |
|---|---|---|---|---|---|
| R-BT-H | Primary 1–5 | Physiological Adaptation / Endocrine & Neurological Disorders | bowtie | hard | Pheochromocytoma multisystem crisis: distinguish catecholamine crisis with extreme blood-pressure lability and organ injury from panic, stimulant toxicity, thyroid storm, and sepsis. Key two actions already authorized by a named expert pathway and two hemodynamic/organ response parameters. Preserve the alpha-before-beta safety rule; do not invent a dose or make immediate unprepared surgery universal. |
| R-HL-H | Primary 6 | Physiological Adaptation / Renal & Gastrointestinal Disorders | highlight | hard | Acute liver failure without known cirrhosis: highlight the coagulopathy, encephalopathy, hypoglycemia, acidosis, renal injury, and neurologic findings that require ICU/transplant-center escalation under the AASLD lane. Do not substitute chronic decompensated cirrhosis or use ammonia alone. |
| R-HL-M | Primary 7–9 | Health Promotion and Maintenance / Pediatric & Adolescent Health | highlight | medium | Acute scrotal-pain note: highlight only the sudden-onset, nausea/vomiting, abnormal lie, swelling/tenderness, or intermittent-torsion history cues requiring immediate testicular-torsion evaluation. Include plausible epididymitis/torsed-appendage near-misses. Do not delay a high-suspicion surgical pathway for a routine outpatient ultrasound. |
| R-FIB-M | Primary 10–12 | Physiological Adaptation / Respiratory & Infectious Disorders | fill_in_blank | medium | Supply hemoglobin, SaO2 as a decimal, PaO2, and `CaO2 = 1.34 × Hgb × SaO2 + 0.003 × PaO2`. Ask for arterial oxygen content in mL O2/dL rounded to the nearest tenth. Ask only for the calculation; do not prescribe oxygen or infer adequate tissue delivery without cardiac output. |
| R-OR-E | Primary 13–15 | Health Promotion and Maintenance / Adult Health & Wellness | ordered_response | easy | Order uncomplicated anterior-epistaxis first aid: sit and lean forward, pinch the soft lower nose continuously for the source-specified interval while breathing through the mouth, then reassess and seek care if bleeding persists or red flags apply. Do not tilt the head back, repeatedly release pressure, or invent an ice requirement. |
| R-DD-M | Primary 16–18 | Reduction of Risk Potential / Laboratory & Diagnostic Tests | dropdown_cloze | medium | Use reticulocyte count, LDH, indirect bilirubin, haptoglobin, and smear pattern to distinguish hemolysis from blood loss and underproduction, then identify the appropriate next etiologic test lane. Keep the scenario nontransfusion. Do not diagnose a specific hemolytic disorder from one marker. |

## 7. Pre-release semantic screen register

The following is the spec author's canonical/manifests screen. `No material match` means no equal
equation, cue-to-key demand, or response pathway was found; it does not waive the producer's live-raw
preflight.

| Row | Nearest existing or commissioned construct | Required semantic divergence |
|---|---|---|
| 1 | `gpt_deepen_2026_06_22_b_rrp_07` compartment-syndrome bowtie | Infection progression/systemic toxicity and urgent surgical infection pathway, not pressure-related limb ischemia. |
| 2 | `gemini_jun05_a_cloze_glaucoma_48` chronic open-angle-glaucoma/cataract dropdown | Acute painful angle closure with emergency ophthalmology response, not progressive painless loss. |
| 3 | `gemini_p9_sata_08` postpartum discharge-warning SATA | Localize an inpatient postpartum uterine infection and evaluate its response; do not ask generic reportable symptoms. |
| 4 | `gpt_case_gallstone_pancreatitis_01_bowtie` evolving cholangitis bowtie | Vascular bowel ischemia, CTA/revascularization lane, and pain-out-of-proportion logic; no biliary obstruction or ERCP. |
| 5 | `gpt_deepen_2026_06_22_bow_02` HIT bowtie | MAHA/schistocytes and ADAMTS13/TPE pathway; no heparin-dependent thrombosis construct. |
| 6 | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01` PE case | Select ACC/AHA acute-aortic and malperfusion cues only; do not test PE recognition or management. |
| 7 | `gpt_deepen_2026_06_22_bow_02` cool-foot HIT complication | Classify limb threat from sensory/motor/Doppler findings; do not identify HIT or choose anticoagulant actions. |
| 8 | `gemini_jun05_a_cloze_glaucoma_48` chronic vision-loss dropdown | Posterior retinal flashes/floaters/curtain emergency cues; no cataract/open-angle comparison. |
| 9 | No material match; nearest visual-symptom content is `gemini_jun05_a_cloze_glaucoma_48` | Cranial-ischemia GCA cue selection and same-day escalation; do not test chronic ocular disease. |
| 10 | `gpt_balance3_2026_07_16_or_anticoagulant_therapy_10` uses an already-calculated CrCl | Compute Cockcroft–Gault only; no neuraxial timing or drug-dose decision. |
| 11 | Batch 8 row 6 P/F ratio and Batch 10 row 12 RSBI | Use pediatric OI with mean airway pressure; no P/F, RSBI, extubation, or standalone diagnosis. |
| 12 | `gemini_jun05_a_matrix_cardiac_cath_18` post-catheter limb assessment | Calculate ABI from a supplied bilateral measurement convention; no postprocedure complication classification. |
| 13 | Batch 8 row 10 swallowed-poison pathway | Dental-trauma crown handling/replant-or-store branch; no ingestion or Poison Control sequence. |
| 14 | `gemini_d7_04` catheter-port sterile specimen question | Spontaneous-void clean-catch technique; no indwelling-catheter sampling. |
| 15 | `gpt_format10a_life_threatening_asthma_reduced_air_entry` uses peak flow as one severity datum | Meter technique and highest of three attempts only; no exacerbation, bowtie, or medication-zone decision. |
| 16 | Batch 8 hypophysitis/secondary-adrenal-risk bowtie and `gemini_b1_08` primary-AI matrix | Paired stable primary-versus-secondary localization using ACTH/mineralocorticoid data; no crisis or hypophysitis treatment. |
| 17 | `gemini_d6_toddler_milk_iron_10` iron-deficiency prevention teaching | Adult microcytic-lab differential across IDA/inflammation/thalassemia; no nutrition teaching. |
| 18 | `gemini_jun05_a_cloze_siadh_di_38` postoperative DI recognition | Complete central-versus-nephrogenic localization from supervised desmopressin response; no generic DI recognition. |
| R-BT-H | No material pheochromocytoma construct found | Crisis-specific blood-pressure lability/organ injury and alpha-before-beta safety; no routine preoperative teaching. |
| R-HL-H | `gpt_deepen_2026_06_23_bow_07` cirrhosis with hepatic encephalopathy | New acute liver failure without cirrhosis and transplant-center escalation; no chronic-cirrhosis trigger pathway. |
| R-HL-M | No material testicular-torsion construct found | Time-critical acute-scrotum cue selection; no generalized pediatric pain or reproductive teaching. |
| R-FIB-M | Batch 8 row 6 P/F ratio | Arterial oxygen content including hemoglobin-bound and dissolved components; no oxygenation ratio or ARDS classification. |
| R-OR-E | Anticoagulant and transfusion bleeding pathways | Uncomplicated first-aid positioning plus uninterrupted timed nasal pressure; no reversal, transfusion stop, or medication sequence. |
| R-DD-M | `gpt_case_acute_hemolytic_transfusion_reaction_01_bowtie` | Nontransfusion laboratory localization of hemolysis versus loss/underproduction; no reaction recognition or transfusion actions. |

## 8. Approved source pins

Every question needs `meta.source` pinned to the exact section, recommendation, equation, table, or
procedure supporting its key. The URLs below were opened successfully during spec preparation. The
producer may copy the corresponding approved source text verbatim into `meta.source`; if a source has
changed or the exact passage cannot be opened, block the row.

| Rows | Approved `meta.source` pin |
|---|---|
| 1 | IDSA, *2014 Skin and Soft Tissue Infection Guideline*, section “Evaluation and Treatment of Necrotizing Fasciitis,” recommendations 1–3 and listed suggestive features: https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/ |
| 2 | Royal College of Ophthalmologists, *The Management of Angle-Closure Glaucoma* (2022), acute angle-closure presentation, immediate management, referral, and monitoring sections: https://www.rcophth.ac.uk/wp-content/uploads/2021/10/The-Management-of-Angle-Closure-Glaucoma-Clinical-Guidelines.pdf |
| 3 | WHO, *Recommendations on maternal health* (2nd ed., 2025), Table 65, postpartum-endometritis treatment recommendation and resolution findings: https://www.ncbi.nlm.nih.gov/books/NBK615643/table/part2.tab65/ |
| 4 | World Society of Emergency Surgery, *Acute mesenteric ischemia: updated guidelines* (2022), clinical presentation/laboratory limitations, CTA without delay, resuscitation, antibiotics, and revascularization/source-control recommendations: https://pmc.ncbi.nlm.nih.gov/articles/PMC9580452/ |
| 5 | ISTH, *Guidelines for the diagnosis of TTP* (2020), Recommendation 1 steps 1–4: https://pmc.ncbi.nlm.nih.gov/articles/PMC8146131/; and *Guidelines for treatment of TTP*, first acute iTTP recommendation: https://pmc.ncbi.nlm.nih.gov/articles/PMC8091490/. The 2025 focused update reports no change to the acquired-iTTP recommendations: https://pubmed.ncbi.nlm.nih.gov/40533296/ |
| 6 | 2022 ACC/AHA *Guideline for the Diagnosis and Management of Aortic Disease*, acute-aortic-syndrome presentation/high-risk examination features and diagnostic-evaluation sections: https://pmc.ncbi.nlm.nih.gov/articles/PMC9860464/ |
| 7 | ESVS, *2020 Clinical Practice Guidelines on Acute Limb Ischaemia*, clinical presentation and Rutherford limb-viability classification: https://pubmed.ncbi.nlm.nih.gov/31899099/ and open guideline PDF https://solaci.org/_files/2020-02-06-10-1016-j-ejvs-2019-09-006.pdf |
| 8 | National Eye Institute, *Retinal Detachment*, “Symptoms” and immediate-care passages: https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/retinal-detachment |
| 9 | ACR/Vasculitis Foundation, *2021 Guideline for Management of Giant Cell Arteritis*, cranial-ischemia/visual-manifestation definitions and treatment recommendations: https://www.vasculitisfoundation.org/wp-content/uploads/2024/01/2021-ACR-VF-Guideline-for-Management-of-Giant-Cell-Arteritis-and-Takayasu-Artheritis.pdf |
| 10 | National Kidney Foundation, *Cockcroft-Gault Equation for Estimating Creatinine Clearance*, equation and medication-dosing context: https://www.kidney.org/professionals/kdoqi/cockcroft-gault-equation-estimating-creatinine-clearance |
| 11 | PALICC-2, *Executive Summary of the Second International Guidelines for PARDS*, definition table and oxygenation-index equation: https://pmc.ncbi.nlm.nih.gov/articles/PMC9848214/ |
| 12 | AHA scientific statement, *Measurement and Interpretation of the Ankle-Brachial Index*, standardized higher-ankle/higher-brachial calculation convention: https://pubmed.ncbi.nlm.nih.gov/23159553/; open summary of the exact calculation: https://www.aafp.org/pubs/afp/issues/2013/1215/p866.pdf |
| 13 | IADT 2020, *Guidelines for the Management of Traumatic Dental Injuries: Avulsion of Permanent Teeth*, first-aid/replantation/storage pathway: https://www.aapd.org/media/policies_guidelines/e_avulsion.pdf |
| 14 | MedlinePlus, *Clean catch urine sample*, adult preparation and midstream-collection procedure: https://medlineplus.gov/ency/article/007487.htm |
| 15 | American Lung Association, *Measuring Your Peak Flow Rate*, Steps 1–8 and three-attempt/highest-reading instruction: https://www.lung.org/lung-health-diseases/lung-disease-lookup/asthma/treatment/devices/peak-flow |
| 16 | Endotext, *Diagnosis and Management of Adrenal Insufficiency*, primary-versus-central AI ACTH/mineralocorticoid distinctions and diagnostic tables: https://www.ncbi.nlm.nih.gov/sites/books/NBK279122/ |
| 17 | ARUP Consult, *Iron Deficiency Anemia*, “Ferritin/Iron and Iron Binding Capacity” and HbA2/RBC-count differential sections, plus the linked IDA-versus-ACD algorithm: https://arupconsult.com/content/iron-deficiency-anemia |
| 18 | Endotext, *Diagnostic Tests for Diabetes Insipidus*, water-deprivation and desmopressin-response interpretation, complete central versus nephrogenic DI passages: https://www.ncbi.nlm.nih.gov/books/NBK537591/ |
| R-BT-H | Japan Endocrine Society, *Clinical Practice Guideline for Pheochromocytoma and Paraganglioma 2025*, section I-6 on hypertensive crisis/multisystem crisis and alpha-before-beta management: https://www.jstage.jst.go.jp/article/endocrj/73/1/73_EJ25-0165/_html/-char/en |
| R-HL-H | AASLD, *Defining and Managing Acute Liver Failure*, diagnostic definition, ICU monitoring, and transplant-center transfer passages: https://www.aasld.org/liver-fellow-network/core-series/back-basics/defining-and-managing-acute-liver-failure |
| R-HL-M | AAFP, *Testicular Torsion: Diagnosis, Evaluation, and Management*, presentation/examination and urgent-surgical-evaluation passages: https://www.aafp.org/pubs/afp/issues/2013/1215/p835.pdf |
| R-FIB-M | NCBI Bookshelf, *Clinical Methods: Arterial Blood Gases*, arterial oxygen-content equation and unit convention: https://www.ncbi.nlm.nih.gov/books/NBK371/ |
| R-OR-E | NHS, *Nosebleed*, first-aid sequence and 10–15-minute escalation threshold: https://www.nhs.uk/conditions/nosebleed/ |
| R-DD-M | ARUP Consult, *Hemolytic Anemias*, standard hemolysis workup and confirmatory marker pattern: https://arupconsult.com/content/hemolytic-anemias |

## 9. Format and bilingual gates

### Bowtie

- Alternative conditions genuinely compete until discriminating cues appear.
- Both actions are immediate and appropriate for the keyed condition.
- Both parameters track response or deterioration rather than repeat diagnostic cues.
- The condition/action/parameter key retains exact 1/2/2 structure with distractors in every zone.

### Highlight

- Include at least one clinically plausible selectable near-miss.
- Keep the correct set bounded and aligned with the stated direction.
- Segment English and Chinese one-to-one without punctuation or clause-boundary key leakage.

### Fill in the blank

- One bounded response per item; no hidden multi-part answer.
- State equation, inputs, units, and rounding rule in the stem.
- `acceptable` and `numeric` agree, and the key is independently recomputed.
- Do not turn the calculated value into a diagnosis or treatment decision beyond its source lane.

### Ordered response

- The key is a permutation of every option.
- Every step has a genuine serial or milestone constraint.
- Bundle simultaneous actions and encode a single closed branch when alternatives exist.

### Dropdown cloze

- Each dropdown tests a separate inference and has one unambiguous option.
- `rationale.byChoice` contains exactly one bilingual entry per **dropdown ID**, not one entry per
  option. Each entry explains why that dropdown's keyed option fits and why its alternatives do not.
- Do not make one dropdown's answer reveal the next mechanically.

### Bilingual and taxonomy

- English is the primary exam surface. Every displayed field needs natural, faithful Simplified
  Chinese parity.
- Use the manifest's exact category and canonical topic strings.
- Do not reproduce copyrighted proprietary scoring tools or tables without repository rights.

## 10. Review handoff and acceptance

The producer is not the content checker. GPT writes the raw files and performs semantic preflight.
Codex/checker runs normalization and validation when the producer lacks command execution, recomputes
every calculation, opens every source pin, reviews substitutions, and checks bilingual parity.
Claude owns the independent clinical/content gate. Promotion, consolidation, ledgering, census
regeneration, and raw-file deletion remain outside this commission.

Acceptance:

- [ ] The three exact raw paths exist, contain complete parseable JSON, and no auxiliary raw files
  were left behind.
- [ ] The files contain 18 questions if primaries plus available matched reserves clear; otherwise
  the receipt explicitly reports the smaller valid count and every unresolved block.
- [ ] Every reserve substitution matches item type and difficulty and is reported one-for-one.
- [ ] Producer preflight covered bundled standalone items, embedded leaves, live raw drafts, and
  occupied Batch 8–10 constructs.
- [ ] No case study, visual, rationale visual, silent substitution, or category/topic drift.
- [ ] Every question uses the approved exact source pin or is blocked.
- [ ] Dropdown rationales use one `byChoice` entry per dropdown ID.
- [ ] Normalization/validation either ran successfully or were explicitly deferred to Codex/checker
  because the producer seat lacked command execution.
- [ ] Producer and checker remain different seats; Claude review remains pending.
