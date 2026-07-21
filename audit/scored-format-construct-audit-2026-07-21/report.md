# GPT Scored-Format Construct Audit — Final Report

## Status

`BLOCKED_OUTPUT_CONTAMINATION`

The primary 104-item adjudication and all 67 required independent checker adjudications are complete, but the work order cannot receive a complete status: the initial byte-identity proof created one task-owned temporary copy at `/tmp/population-first.jsonl`, outside the authorized audit directory. The temporary copy was removed, no repository or bank file was affected, and all durable task artifacts are inside the authorized directory; nevertheless Section 18 defines any such write as `BLOCKED_OUTPUT_CONTAMINATION`. Owner dispositions also remain open for retirement decisions and preserved primary/checker disagreements.

## Audit session header

- Primary auditor: OpenAI Codex, GPT-family.
- Independent checker: blind phase used Claude Code / Anthropic Opus for rows 1–36 and Google Antigravity / Gemini 3.1 Pro for rows 37–67; reveal/source/agreement phase used Google Antigravity / Gemini 3.1 Pro for rows 1–9 and Gemini CLI / Gemini 3.6 Flash for rows 10–67.
- Date: 2026-07-21.
- Branch / HEAD / upstream: `main` / `c0101f55f972863bd38ef0851440f84c055e1b0b` / `origin/main`, ahead 0, behind 0.
- Canonical population bank SHA-256: `61664a6bef854ec8d7a3a0113779a4773135724aabfdec65b970b7ac6464c5d2`.
- Population artifact SHA-256: `182c2bc0017629661154da9a9f0a855af45816dd460795364ea225c32de9cdaf`; a second builder run was byte-identical.
- Primary checkpoint sizes: 16, 16, 18, 18, 18, 18 (`primary-batch-01.jsonl`, `primary-batch-02.jsonl`, `primary-batch-03.jsonl`, `primary-batch-04.jsonl`, `primary-batch-05.jsonl`, `primary-batch-06.jsonl`).
- Starting changed paths recorded before task writes: `GEMINI-TERMINAL-SENTENCE-SEMANTIC-CENSUS-SPEC-2026-07-21.md`, `GPT-SCORED-FORMAT-CONSTRUCT-AUDIT-SPEC-2026-07-21.md`, `LAB-TREND-EPIC-STYLE-DUAL-SERIES-MIGRATION-CODEX-SPEC-2026-07-21.md`, and `audit/terminal-sentence-semantic-census-2026-07-21/`.
- Ending changed-path snapshot: `?? GEMINI-3.6-FLASH-TERMINAL-SENTENCE-PILOT-SPEC-2026-07-21.md`, `?? GEMINI-TERMINAL-SENTENCE-SEMANTIC-CENSUS-SPEC-2026-07-21.md`, `?? GPT-SCORED-FORMAT-CONSTRUCT-AUDIT-SPEC-2026-07-21.md`, `?? LAB-TREND-EPIC-STYLE-DUAL-SERIES-MIGRATION-CODEX-SPEC-2026-07-21.md`, `?? SONNET-TERMINAL-SENTENCE-SEMANTIC-CENSUS-SPEC-2026-07-21.md`, `?? TERMINAL-SENTENCE-POST-REVIEW-ADJUDICATION-SPEC-2026-07-21.md`, `?? audit/july16-coverage-construct-audit-2026-07-21/`, `?? audit/scored-format-construct-audit-2026-07-21/`, `?? audit/terminal-sentence-gemini-3-6-flash-pilot-2026-07-21/`, `?? audit/terminal-sentence-semantic-census-2026-07-21/`.
- All durable task-owned writes are confined to `audit/scored-format-construct-audit-2026-07-21/`. Other ending untracked paths appeared independently and were not touched by this task.
- Formal exception: one task-owned repeat-proof copy was temporarily written to `/tmp/population-first.jsonl` and subsequently removed. This is why the status is blocked despite no project-file contamination.
- All 13 bundled-bank ending hashes exactly equal the recorded starting hashes. No bank mutation occurred.

| Bank | Starting SHA-256 | Ending SHA-256 |
| --- | --- | --- |
| banks/burn-canonical.json | 5244b8d37daa49adbd1fbed7991f4ede52ded8ce710e26821841ef5e2ce3719f | 5244b8d37daa49adbd1fbed7991f4ede52ded8ce710e26821841ef5e2ce3719f |
| banks/capnography-canonical.json | 36d72a89405fe4400f27b3b8969cdbe1c51f3217151f8b2592b7f877d636f20c | 36d72a89405fe4400f27b3b8969cdbe1c51f3217151f8b2592b7f877d636f20c |
| banks/claude-canonical.json | b59035ecb717fd279fb9278e3ae678c1b420a6a896b9bf6ff638614f6233b5ce | b59035ecb717fd279fb9278e3ae678c1b420a6a896b9bf6ff638614f6233b5ce |
| banks/device-canonical.json | 83d5a6ac7219524f4c528265291cbee2ed5b2f17c13fbeb3649342bae2e4aac5 | 83d5a6ac7219524f4c528265291cbee2ed5b2f17c13fbeb3649342bae2e4aac5 |
| banks/gemini-canonical.json | 8259ffb6b12c5b3ba267566b8247207ec4fc573d536d9f78fafd5d18655b63c3 | 8259ffb6b12c5b3ba267566b8247207ec4fc573d536d9f78fafd5d18655b63c3 |
| banks/gpt-canonical.json | 61664a6bef854ec8d7a3a0113779a4773135724aabfdec65b970b7ac6464c5d2 | 61664a6bef854ec8d7a3a0113779a4773135724aabfdec65b970b7ac6464c5d2 |
| banks/hard-cases-canonical.json | 438c176897a41d3b7f212435e5945bd524c3f0ba5a62931eb5e85843c93d8730 | 438c176897a41d3b7f212435e5945bd524c3f0ba5a62931eb5e85843c93d8730 |
| banks/io-canonical.json | 2ce6488e65049ba00cd9dccf889a042e0a624f224387382d564d282e147b2645 | 2ce6488e65049ba00cd9dccf889a042e0a624f224387382d564d282e147b2645 |
| banks/lab-canonical.json | 1038cb68f6b91f6a2c981562d97ad9e16179db9b1332c75725fd538595c44b05 | 1038cb68f6b91f6a2c981562d97ad9e16179db9b1332c75725fd538595c44b05 |
| banks/mar-canonical.json | f12c03a28ff5b52411843f84bc942b4ca5667e989194357ed2d60a394f17641e | f12c03a28ff5b52411843f84bc942b4ca5667e989194357ed2d60a394f17641e |
| banks/medlabel-canonical.json | cc3bd0053516fc7ea4b23e814e46f186e6d2dbf40888fa713a862c07ea2b3993 | cc3bd0053516fc7ea4b23e814e46f186e6d2dbf40888fa713a862c07ea2b3993 |
| banks/visual-canonical.json | e42e2a3fa6aa349a61279e6988e250e65c2b752a6f36d33806a2671e0af0f9e4 | e42e2a3fa6aa349a61279e6988e250e65c2b752a6f36d33806a2671e0af0f9e4 |
| banks/vitals-canonical.json | 5154e25492bced8e4a49d763f04e25e154389c31e085bf37669651e13d411b9d | 5154e25492bced8e4a49d763f04e25e154389c31e085bf37669651e13d411b9d |

## Population reconciliation

All 104 rows are unique, current top-level standalone scored leaves. No planned missing row was reconstructed.

### Provenance family

| provenanceFamily | Count |
| --- | --- |
| FORMAT_GAP_2026_07_14 | 16 |
| SCORED_FORMAT_BATCH_10 | 17 |
| SCORED_FORMAT_BATCH_11 | 18 |
| SCORED_FORMAT_BATCH_7 | 17 |
| SCORED_FORMAT_BATCH_8 | 18 |
| SCORED_FORMAT_BATCH_9 | 18 |

### Sub-batch

| subBatch | Count |
| --- | --- |
| 10A | 5 |
| 10B | 6 |
| 10C | 6 |
| 11A | 6 |
| 11B | 6 |
| 11C | 6 |
| 7A | 6 |
| 7B | 5 |
| 7C | 6 |
| 8A | 6 |
| 8B | 6 |
| 8C | 6 |
| 9A | 6 |
| 9B | 6 |
| 9C | 6 |
| fmtgap | 16 |

### Item type

| itemType | Count |
| --- | --- |
| bowtie | 21 |
| dropdown_cloze | 9 |
| fill_in_blank | 26 |
| highlight | 24 |
| ordered_response | 23 |
| select_all | 1 |

### Difficulty

| difficulty | Count |
| --- | --- |
| easy | 16 |
| hard | 37 |
| medium | 51 |

### Category

| category | Count |
| --- | --- |
| Basic Care and Comfort | 9 |
| Health Promotion and Maintenance | 15 |
| Management of Care | 1 |
| Pharmacological and Parenteral Therapies | 11 |
| Physiological Adaptation | 31 |
| Psychosocial Integrity | 15 |
| Reduction of Risk Potential | 16 |
| Safety and Infection Prevention and Control | 6 |

### Topic

| Topic | Count |
| --- | --- |
| ABG & Acid-Base Interpretation | 3 |
| Burn Management | 2 |
| Cardiovascular Disorders | 3 |
| Chronic Disease Management & Lifestyle | 5 |
| Client Advocacy | 1 |
| Diabetic Ketoacidosis (DKA) | 2 |
| Electroconvulsive Therapy (ECT) | 7 |
| Electrolyte Imbalances | 3 |
| Endocrine & Neurological Disorders | 7 |
| IV Fluid Calculations | 1 |
| Intrapartum Fetal Monitoring | 3 |
| Laboratory & Diagnostic Tests | 4 |
| Maternal-Newborn Care & Teaching | 2 |
| Nutritional & Fluid Support | 1 |
| Oncology & Immunotherapy Complications | 4 |
| Palliative & Supportive Care | 3 |
| Parenteral Nutrition | 5 |
| Patient & Environment Safety | 1 |
| Pediatric & Toddler Safety | 5 |
| Procedural Complications & Dialysis | 2 |
| Psychotropic Medications | 1 |
| Renal & Gastrointestinal Disorders | 2 |
| Reproductive & Endocrine Health | 5 |
| Respiratory & Infectious Disorders | 6 |
| Sepsis & Septic Shock | 4 |
| Skin & Wound Care | 4 |
| Sleep & Rest | 2 |
| Standard Precautions & Hygiene | 1 |
| Substance Use & Withdrawal | 5 |
| Suicide & Crisis Intervention | 1 |
| Therapeutic Communication | 2 |
| Transfusion & Blood Products | 6 |
| Transmission-Based Precautions | 1 |

## Results

### Primary verdicts

| verdict | Count |
| --- | --- |
| FIX | 11 |
| PASS | 62 |
| RETIRE | 31 |

### Wave results

| Wave | PASS | FIX | RETIRE | REVIEW |
| --- | --- | --- | --- | --- |
| Wave 1: ordered response + dropdown | 14 | 8 | 10 | 0 |
| Wave 2: remaining formats | 48 | 3 | 21 | 0 |
| Total | 62 | 11 | 31 | 0 |

### Verdict by item type

| Item type | Verdict | Count |
| --- | --- | --- |
| bowtie | PASS | 16 |
| bowtie | FIX | 2 |
| bowtie | RETIRE | 3 |
| dropdown_cloze | PASS | 3 |
| dropdown_cloze | RETIRE | 6 |
| fill_in_blank | PASS | 8 |
| fill_in_blank | RETIRE | 18 |
| highlight | PASS | 23 |
| highlight | FIX | 1 |
| ordered_response | PASS | 11 |
| ordered_response | FIX | 8 |
| ordered_response | RETIRE | 4 |
| select_all | PASS | 1 |

### Verdict by sub-batch

| Sub-batch | PASS | FIX | RETIRE | REVIEW |
| --- | --- | --- | --- | --- |
| 10A | 5 | 0 | 0 | 0 |
| 10B | 2 | 0 | 4 | 0 |
| 10C | 3 | 0 | 3 | 0 |
| 11A | 5 | 0 | 1 | 0 |
| 11B | 2 | 1 | 3 | 0 |
| 11C | 2 | 0 | 4 | 0 |
| 7A | 2 | 0 | 4 | 0 |
| 7B | 0 | 5 | 0 | 0 |
| 7C | 5 | 1 | 0 | 0 |
| 8A | 4 | 0 | 2 | 0 |
| 8B | 3 | 1 | 2 | 0 |
| 8C | 6 | 0 | 0 | 0 |
| 9A | 5 | 0 | 1 | 0 |
| 9B | 3 | 0 | 3 | 0 |
| 9C | 4 | 1 | 1 | 0 |
| fmtgap | 11 | 2 | 3 | 0 |

### Primary class

| primaryClass | Count |
| --- | --- |
| ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | 4 |
| ARBITRARY_SERIALIZATION | 7 |
| CALCULATION_WITHOUT_CLINICAL_VALUE | 12 |
| INVENTED_EXTRA_INFERENCE | 3 |
| MECHANICAL_CLOZE_DEPENDENCY | 1 |
| NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT | 7 |
| OTHER_CONFIRMED_CONSTRUCT_DEFECT | 2 |
| PARALLEL_PROCESS_FORCED_SEQUENCE | 2 |
| UNSUPPORTED_OR_CIRCULAR_NEXT_STEP | 1 |
| VALID_CONSTRUCT | 62 |
| WEAK_OR_NONCOMPETING_DIFFERENTIAL | 3 |

### Secondary class

| Secondary class | Count |
| --- | --- |
| ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | 2 |
| CALCULATION_WITHOUT_CLINICAL_VALUE | 4 |
| INVENTED_EXTRA_INFERENCE | 1 |
| NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT | 4 |
| PARALLEL_PROCESS_FORCED_SEQUENCE | 3 |
| SOURCE_INSUFFICIENCY | 1 |

### Next disposition

| nextDisposition | Count |
| --- | --- |
| BOUNDED_TEXT_REPAIR | 1 |
| FULL_ITEM_REWRITE_SAME_CONSTRUCT | 10 |
| KEEP | 62 |
| RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | 13 |
| RETIRE_WITHOUT_REPLACEMENT | 18 |

### Source check

| sourceCheck | Count |
| --- | --- |
| NOT_OPENED_STABLE_LOW_RISK | 48 |
| NOT_SUPPORTED | 1 |
| PARTIALLY_SUPPORTED | 10 |
| SUPPORTED | 45 |

### Nursing relevance

| nursingRelevance | Count |
| --- | --- |
| HIGH | 80 |
| LOW | 11 |
| MODERATE | 2 |
| OUT_OF_SCOPE_OR_OVERLY_SPECIALIST | 11 |

### Bilingual parity

| bilingualParity | Count |
| --- | --- |
| MATERIAL_MATCH | 104 |

### Independent checker

Required checker population: 67. Blind derivations frozen: 67. Fully checked: 67.

| Checker verdict | Count |
| --- | --- |
| FIX | 13 |
| PASS | 23 |
| RETIRE | 31 |

| Agreement status | Count |
| --- | --- |
| AGREE | 59 |
| DISAGREE | 4 |
| PARTIAL | 4 |

| Checker class | Count |
| --- | --- |
| ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | 5 |
| ARBITRARY_SERIALIZATION | 4 |
| CALCULATION_WITHOUT_CLINICAL_VALUE | 14 |
| INVENTED_EXTRA_INFERENCE | 3 |
| MECHANICAL_CLOZE_DEPENDENCY | 1 |
| NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT | 5 |
| OTHER_CONFIRMED_CONSTRUCT_DEFECT | 4 |
| PARALLEL_PROCESS_FORCED_SEQUENCE | 4 |
| UNSUPPORTED_OR_CIRCULAR_NEXT_STEP | 1 |
| VALID_CONSTRUCT | 23 |
| WEAK_OR_NONCOMPETING_DIFFERENTIAL | 3 |

| Checker disposition | Count |
| --- | --- |
| BOUNDED_TEXT_REPAIR | 3 |
| FULL_ITEM_REWRITE_SAME_CONSTRUCT | 10 |
| KEEP | 23 |
| RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | 13 |
| RETIRE_WITHOUT_REPLACEMENT | 18 |

| Checker source verification | Count |
| --- | --- |
| PARTIALLY_SUPPORTED | 38 |
| SUPPORTED | 29 |

| Checker item type | PASS | FIX | RETIRE | REVIEW |
| --- | --- | --- | --- | --- |
| bowtie | 1 | 4 | 3 | 0 |
| dropdown_cloze | 3 | 0 | 6 | 0 |
| fill_in_blank | 3 | 0 | 18 | 0 |
| highlight | 5 | 1 | 0 | 0 |
| ordered_response | 11 | 8 | 4 | 0 |

| Checker sub-batch | PASS | FIX | RETIRE | REVIEW |
| --- | --- | --- | --- | --- |
| 10A | 1 | 0 | 0 | 0 |
| 10B | 1 | 0 | 4 | 0 |
| 10C | 3 | 0 | 3 | 0 |
| 11A | 0 | 1 | 1 | 0 |
| 11B | 2 | 1 | 3 | 0 |
| 11C | 2 | 0 | 4 | 0 |
| 7A | 1 | 0 | 4 | 0 |
| 7B | 1 | 4 | 0 | 0 |
| 7C | 0 | 2 | 0 | 0 |
| 8A | 1 | 0 | 2 | 0 |
| 8B | 3 | 1 | 2 | 0 |
| 8C | 1 | 0 | 0 | 0 |
| 9A | 0 | 0 | 1 | 0 |
| 9B | 1 | 0 | 3 | 0 |
| 9C | 4 | 1 | 1 | 0 |
| fmtgap | 2 | 3 | 3 | 0 |

## High-priority queues

### RETIRE candidates (31)

- `gpt_fmtgap_2026_07_14_bt_trach_decannulation_05` — `questions[561]`; WEAK_OR_NONCOMPETING_DIFFERENTIAL; RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED; evidence: “tube is accidentally pulled completely out”
- `gpt_fmtgap_2026_07_14_fib_reflection_10` — `questions[566]`; OTHER_CONFIRMED_CONSTRUCT_DEFECT; RETIRE_WITHOUT_REPLACEMENT; evidence: “Enter the one-word therapeutic communication technique”
- `gpt_fmtgap_2026_07_14_fib_cows_11` — `questions[567]`; OTHER_CONFIRMED_CONSTRUCT_DEFECT; RETIRE_WITHOUT_REPLACEMENT; evidence: “Enter the four-letter abbreviation”
- `gpt_format7a_corrected_sodium` — `questions[681]`; CALCULATION_WITHOUT_CLINICAL_VALUE; RETIRE_WITHOUT_REPLACEMENT; evidence: “use the following equation”
- `gpt_format7a_effective_osmolality` — `questions[682]`; CALCULATION_WITHOUT_CLINICAL_VALUE; RETIRE_WITHOUT_REPLACEMENT; evidence: “calculate effective serum osmolality using conventional units”
- `gpt_format7a_curb65_score` — `questions[683]`; CALCULATION_WITHOUT_CLINICAL_VALUE; RETIRE_WITHOUT_REPLACEMENT; evidence: “Use CURB65, assigning 1 point”
- `gpt_format7a_renal_sofa_component` — `questions[684]`; CALCULATION_WITHOUT_CLINICAL_VALUE; RETIRE_WITHOUT_REPLACEMENT; evidence: “Use this renal SOFA component excerpt”
- `gpt_format10b_corrected_count_increment` — `questions[705]`; NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT; RETIRE_WITHOUT_REPLACEMENT; evidence: “Do not diagnose platelet refractoriness from this single calculation”
- `gpt_format10b_free_water_deficit` — `questions[706]`; CALCULATION_WITHOUT_CLINICAL_VALUE; RETIRE_WITHOUT_REPLACEMENT; evidence: “asks only for the mathematical deficit”
- `gpt_format10b_average_sodium_correction_rate` — `questions[707]`; CALCULATION_WITHOUT_CLINICAL_VALUE; RETIRE_WITHOUT_REPLACEMENT; evidence: “Calculate the average correction rate”
- `gpt_format10b_rapid_shallow_breathing_index` — `questions[708]`; CALCULATION_WITHOUT_CLINICAL_VALUE; RETIRE_WITHOUT_REPLACEMENT; evidence: “asks only for documentation of the index”
- `gpt_format10c_parenteral_nutrition_discontinuation_plan` — `questions[711]`; ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION; RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED; evidence: “individualized non-PN target for 24 hours”
- `gpt_format10c_ect_continuation_maintenance_plan` — `questions[712]`; INVENTED_EXTRA_INFERENCE; RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED; evidence: “A client with major depressive disorder reaches remission after an effective acute index ECT course. The team proposes weekly and then biweekly ECT during the first 6 months after remission, with frequency adjusted durin”
- `gpt_format10c_latent_vs_active_tuberculosis` — `questions[714]`; MECHANICAL_CLOZE_DEPENDENCY; RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED; evidence: “A client has a positive interferon-gamma release assay (IGRA) after workplace screening. The client has no cough, fever, night sweats, weight loss, or fatigue. Chest radiograph is normal, and the medical evaluation finds”
- `gpt_format8a_haloperidol_qtcf` — `questions[715]`; NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT; RETIRE_WITHOUT_REPLACEMENT; evidence: “Calculate”
- `gpt_format8a_pf_ratio` — `questions[720]`; CALCULATION_WITHOUT_CLINICAL_VALUE; RETIRE_WITHOUT_REPLACEMENT; evidence: “Calculate”
- `gpt_format8b_palliative_breathlessness_plan` — `questions[723]`; ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION; RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED; evidence: “plan”
- `gpt_format8b_cbti_stimulus_control` — `questions[726]`; ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION; RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED; evidence: “plan”
- `gpt_format9a_esophageal_button_battery` — `questions[736]`; WEAK_OR_NONCOMPETING_DIFFERENTIAL; RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED; evidence: “radiographs show the battery lodged in the upper esophagus”
- `gpt_format9b_wound_depth_change` — `questions[741]`; CALCULATION_WITHOUT_CLINICAL_VALUE; RETIRE_WITHOUT_REPLACEMENT; evidence: “single dimension does not by itself establish healing”
- `gpt_format9b_montevideo_units` — `questions[742]`; NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT; RETIRE_WITHOUT_REPLACEMENT; evidence: “Do not diagnose labor arrest or change oxytocin”
- `gpt_format9b_pn_glucose_infusion_rate` — `questions[743]`; NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT; RETIRE_WITHOUT_REPLACEMENT; evidence: “Calculate the GIR”
- `gpt_format9c_pn_peripheral_central_access` — `questions[749]`; INVENTED_EXTRA_INFERENCE; RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED; evidence: “The nutrition-support service uses the following criteria for peripheral and central parenteral nutrition: peripheral PN may be used for a short anticipated duration when the final osmolarity is no more than 900 mOsm/L a”
- `gpt_format11a_immune_ttp` — `questions[755]`; NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT; RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED; evidence: “emergency hematology plan authorizes urgent therapeutic plasma exchange”
- `gpt_format11b_cockcroft_gault_crcl` — `questions[760]`; CALCULATION_WITHOUT_CLINICAL_VALUE; RETIRE_WITHOUT_REPLACEMENT; evidence: “does not by itself select or adjust a medication dose”
- `gpt_format11b_pediatric_oxygenation_index` — `questions[761]`; CALCULATION_WITHOUT_CLINICAL_VALUE; RETIRE_WITHOUT_REPLACEMENT; evidence: “tests arithmetic only”
- `gpt_format11b_ankle_brachial_index` — `questions[762]`; CALCULATION_WITHOUT_CLINICAL_VALUE; RETIRE_WITHOUT_REPLACEMENT; evidence: “Do not diagnose vascular disease or prescribe compression”
- `gpt_format11c_home_peak_flow_technique` — `questions[765]`; ARBITRARY_SERIALIZATION; RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED; evidence: “while standing upright”
- `gpt_format11c_adrenal_laboratory_localization` — `questions[766]`; INVENTED_EXTRA_INFERENCE; RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED; evidence: “Each dropdown refers only to its own client”
- `gpt_format11c_microcytic_anemia_localization` — `questions[767]`; UNSUPPORTED_OR_CIRCULAR_NEXT_STEP; RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED; evidence: “Record C asks for the next diagnostic step”
- `gpt_format11c_water_deprivation_desmopressin_interpretation` — `questions[768]`; NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT; RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED; evidence: “Partial and indeterminate response patterns are excluded”

### Full-item rewrites, same construct (10)

- `gpt_fmtgap_2026_07_14_bt_therapeutic_panic_01` — `questions[557]`; WEAK_OR_NONCOMPETING_DIFFERENTIAL; FULL_ITEM_REWRITE_SAME_CONSTRUCT; evidence: “documented panic disorder”
- `gpt_fmtgap_2026_07_14_or_dry_chemical_burn_15` — `questions[571]`; ARBITRARY_SERIALIZATION; FULL_ITEM_REWRITE_SAME_CONSTRUCT; evidence: “not water-reactive and directs water irrigation after dry decontamination”
- `gpt_format7b_inpatient_alcohol_withdrawal_pathway` — `questions[687]`; ARBITRARY_SERIALIZATION; FULL_ITEM_REWRITE_SAME_CONSTRUCT; evidence: “operational order”
- `gpt_format7b_ambulatory_withdrawal_transfer` — `questions[688]`; PARALLEL_PROCESS_FORCED_SEQUENCE; FULL_ITEM_REWRITE_SAME_CONSTRUCT; evidence: “newly confused, has persistent vomiting, and has a blood pressure of 84/50”
- `gpt_format7b_circumferential_burn_perfusion` — `questions[689]`; ARBITRARY_SERIALIZATION; FULL_ITEM_REWRITE_SAME_CONSTRUCT; evidence: “complete the following actions in operational order”
- `gpt_format7b_pn_administration_safety` — `questions[690]`; ARBITRARY_SERIALIZATION; FULL_ITEM_REWRITE_SAME_CONSTRUCT; evidence: “checklist actions in the correct operational order”
- `gpt_format7b_home_pn_transition` — `questions[691]`; ARBITRARY_SERIALIZATION; FULL_ITEM_REWRITE_SAME_CONSTRUCT; evidence: “requires the following steps to be completed in sequence”
- `gpt_format7c_heart_failure_action_plan_bowtie` — `questions[693]`; ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION; FULL_ITEM_REWRITE_SAME_CONSTRUCT; evidence: “The plan defines the yellow zone”
- `gpt_format8b_toddler_unknown_ingestion` — `questions[724]`; ARBITRARY_SERIALIZATION; FULL_ITEM_REWRITE_SAME_CONSTRUCT; evidence: “Place”
- `gpt_format9c_missed_combined_pills` — `questions[745]`; PARALLEL_PROCESS_FORCED_SEQUENCE; FULL_ITEM_REWRITE_SAME_CONSTRUCT; evidence: “starting now and over the next 7 days”

### Bounded fixes (1)

- `gpt_format11b_rutherford_iib_limb_threat` — `questions[757]`; NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT; BOUNDED_TEXT_REPAIR; evidence: “classified as Rutherford IIb”

### Owner or clinical review items

- No primary `REVIEW` rows. Owner clearance remains required after the independent checker for all 31 retirement recommendations and for every future checker disagreement.

### Primary/checker disagreements

Material disagreements (4):

- `gpt_fmtgap_2026_07_14_or_toddler_choking_16` — primary PASS/VALID_CONSTRUCT/KEEP; checker FIX/OTHER_CONFIRMED_CONSTRUCT_DEFECT/FULL_ITEM_REWRITE_SAME_CONSTRUCT; Primary rated PASS under Red Cross source metadata. Independent final checker rates FIX because NCLEX-RN relies on AHA BLS guidelines where back blows (Option A) are not recommended for children >=1 year (abdominal thrusts only). Including Option A as a required step embeds a protocol mismatch against AHA standards.
- `gpt_format7b_circumferential_burn_perfusion` — primary FIX/ARBITRARY_SERIALIZATION/FULL_ITEM_REWRITE_SAME_CONSTRUCT; checker PASS/VALID_CONSTRUCT/KEEP; The primary reviewer incorrectly classified 'reassessment' and 'notification' as parallel. In acute deterioration, a focused reassessment must strictly precede notification to provide the prescriber with actionable data.
- `gpt_format7c_exercise_hypoglycemia_bowtie` — primary PASS/VALID_CONSTRUCT/KEEP; checker FIX/OTHER_CONFIRMED_CONSTRUCT_DEFECT/BOUNDED_TEXT_REPAIR; The primary audit passed the item, but the blind review correctly identified that the distractors are noncompeting and trivially dismissible, requiring repair.
- `gpt_format11a_acute_mesenteric_ischemia` — primary PASS/VALID_CONSTRUCT/KEEP; checker FIX/ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION/BOUNDED_TEXT_REPAIR; Primary failed to identify the stem telegraphing and weak distractors in the action and parameter sections, which were correctly caught by the blind derivation.

Class/disposition partial agreements (4):

- `gpt_format7b_inpatient_alcohol_withdrawal_pathway` — primary FIX/ARBITRARY_SERIALIZATION/FULL_ITEM_REWRITE_SAME_CONSTRUCT; checker FIX/PARALLEL_PROCESS_FORCED_SEQUENCE/FULL_ITEM_REWRITE_SAME_CONSTRUCT; Checker FIX/PARALLEL_PROCESS_FORCED_SEQUENCE/FULL_ITEM_REWRITE_SAME_CONSTRUCT; primary FIX/ARBITRARY_SERIALIZATION/FULL_ITEM_REWRITE_SAME_CONSTRUCT.
- `gpt_format7b_home_pn_transition` — primary FIX/ARBITRARY_SERIALIZATION/FULL_ITEM_REWRITE_SAME_CONSTRUCT; checker FIX/PARALLEL_PROCESS_FORCED_SEQUENCE/FULL_ITEM_REWRITE_SAME_CONSTRUCT; Checker FIX/PARALLEL_PROCESS_FORCED_SEQUENCE/FULL_ITEM_REWRITE_SAME_CONSTRUCT; primary FIX/ARBITRARY_SERIALIZATION/FULL_ITEM_REWRITE_SAME_CONSTRUCT.
- `gpt_format9b_montevideo_units` — primary RETIRE/NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT/RETIRE_WITHOUT_REPLACEMENT; checker RETIRE/CALCULATION_WITHOUT_CLINICAL_VALUE/RETIRE_WITHOUT_REPLACEMENT; Checker RETIRE/CALCULATION_WITHOUT_CLINICAL_VALUE/RETIRE_WITHOUT_REPLACEMENT; primary RETIRE/NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT/RETIRE_WITHOUT_REPLACEMENT.
- `gpt_format9b_pn_glucose_infusion_rate` — primary RETIRE/NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT/RETIRE_WITHOUT_REPLACEMENT; checker RETIRE/CALCULATION_WITHOUT_CLINICAL_VALUE/RETIRE_WITHOUT_REPLACEMENT; Checker RETIRE/CALCULATION_WITHOUT_CLINICAL_VALUE/RETIRE_WITHOUT_REPLACEMENT; primary RETIRE/NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT/RETIRE_WITHOUT_REPLACEMENT.

## Ordered-response findings

- One defensible total order: 14: `gpt_fmtgap_2026_07_14_or_hyperkalemia_dialysis_14`, `gpt_fmtgap_2026_07_14_or_toddler_choking_16`, `gpt_format10c_pediatric_rabies_pep_sequence`, `gpt_format10c_occupational_sharps_hiv_pep_sequence`, `gpt_format10c_parenteral_nutrition_discontinuation_plan`, `gpt_format8b_ulipristal_followup_timeline`, `gpt_format8b_doxorubicin_extravasation`, `gpt_format8b_palliative_breathlessness_plan`, `gpt_format8b_abg_specimen_workflow`, `gpt_format8b_cbti_stimulus_control`, `gpt_format9c_istap_skin_tear_pathway`, `gpt_format9c_enteral_tube_occlusion`, `gpt_format11c_avulsed_permanent_tooth_first_aid`, `gpt_format11c_clean_catch_midstream_urine`.
- Multiple defensible total orders: 9: `gpt_fmtgap_2026_07_14_or_dry_chemical_burn_15`, `gpt_format7b_inpatient_alcohol_withdrawal_pathway`, `gpt_format7b_ambulatory_withdrawal_transfer`, `gpt_format7b_circumferential_burn_perfusion`, `gpt_format7b_pn_administration_safety`, `gpt_format7b_home_pn_transition`, `gpt_format8b_toddler_unknown_ingestion`, `gpt_format9c_missed_combined_pills`, `gpt_format11c_home_peak_flow_technique`.
- Concurrent or either-order processes were confirmed in the alcohol-withdrawal, burn-perfusion, PN-transition/administration, ingestion, missed-pill, and peak-flow items.
- Unclosed branches: none confirmed in the current live versions. The avulsed-tooth stem legitimately closes the replantation branch.
- Sources supported only a partial order for the nine multiple-order items; none of their numbered educational/checklist lists established every adjacent rank.
- Ordered-response disposition: PASS 11 / FIX 8 / RETIRE 4.

## Dropdown-cloze findings

- Three items had three separate, natural, independently useful inferences: `gpt_format10c_dmpa_late_repeat_injection`, `gpt_format9c_delayed_hemolytic_reaction`, and `gpt_format9c_noisy_respiratory_secretions`.
- Mechanical dependency: `gpt_format10c_latent_vs_active_tuberculosis`.
- Invented/assembled extra inference: `gpt_format10c_ect_continuation_maintenance_plan`, `gpt_format9c_pn_peripheral_central_access`, and `gpt_format11c_adrenal_laboratory_localization`.
- Unsupported/circular next step: `gpt_format11c_microcytic_anemia_localization`.
- Overly specialist/low-value construct: `gpt_format11c_adrenal_laboratory_localization`, `gpt_format11c_microcytic_anemia_localization`, and `gpt_format11c_water_deprivation_desmopressin_interpretation`.
- Dropdown disposition: PASS 3 / FIX 0 / RETIRE 6.

## Remaining-format findings

| Item type | Population | Adverse | Adverse rate |
| --- | --- | --- | --- |
| fill_in_blank | 26 | 18 | 69.2% |
| highlight | 24 | 1 | 4.2% |
| bowtie | 21 | 5 | 23.8% |
| select_all | 1 | 0 | 0.0% |

Wave 2 has 24 adverse rows out of 72 (33.3%). The dominant mechanism is calculation without clinical value, followed by specialist constructs and noncompeting/telegraphed bowties. The single select-all item passed independent-option and jurisdictional-caveat review.

## Known-example reconciliation

- `gpt_format11c_home_peak_flow_technique`: current item RETIRE / arbitrary serialization. True dependencies are inhalation before blow, repetition before highest-value recording; inspection/reset and standing remain either-order.
- `gpt_format11c_microcytic_anemia_localization`: current item RETIRE. It contains two laboratory records, not three; HbA2 already represents structural hemoglobin analysis; the cited iron-deficiency source does not establish uniquely indicated molecular confirmation.
- `gpt_format10c_occupational_sharps_hiv_pep_sequence`: current repaired item PASS. All ranked actions now concern the exposed nurse; source-patient testing is not serialized; baseline testing does not delay PEP; one order remains.
- `gpt_format10b_hemodialysis_access_prompt_followup`: current regenerated item PASS. It is limited to stenosis/dysfunction, has no contradictory simultaneous access findings, and uses one response horizon.
- `gpt_format7c_exercise_hypoglycemia_bowtie`: current naturalized item PASS. The deleted historical scope commentary was not re-flagged; the live bowtie has a coherent exercise-linked condition, two same-phase actions, and response-monitoring parameters.
- Count controls passed: Batch 7 = 17, Batch 10 = 17, total = 104.

## Terminal-census overlap

The primary construct file was frozen before this comparison. The available terminal-census file has one row for each scoped ID: 54 PASS and 50 FAIL. The verdict systems remain separate.

- Flagged by both: 27: `gpt_fmtgap_2026_07_14_fib_reflection_10`, `gpt_fmtgap_2026_07_14_fib_cows_11`, `gpt_format7a_corrected_sodium`, `gpt_format7a_effective_osmolality`, `gpt_format7a_curb65_score`, `gpt_format7a_renal_sofa_component`, `gpt_format10b_corrected_count_increment`, `gpt_format10b_free_water_deficit`, `gpt_format10b_average_sodium_correction_rate`, `gpt_format10b_rapid_shallow_breathing_index`, `gpt_format10c_parenteral_nutrition_discontinuation_plan`, `gpt_format10c_ect_continuation_maintenance_plan`, `gpt_format10c_latent_vs_active_tuberculosis`, `gpt_format8a_haloperidol_qtcf`, `gpt_format8a_pf_ratio`, `gpt_format9a_esophageal_button_battery`, `gpt_format9b_wound_depth_change`, `gpt_format9b_montevideo_units`, `gpt_format9b_pn_glucose_infusion_rate`, `gpt_format9c_pn_peripheral_central_access`, `gpt_format11b_cockcroft_gault_crcl`, `gpt_format11b_pediatric_oxygenation_index`, `gpt_format11b_ankle_brachial_index`, `gpt_format11c_home_peak_flow_technique`, `gpt_format11c_adrenal_laboratory_localization`, `gpt_format11c_microcytic_anemia_localization`, `gpt_format11c_water_deprivation_desmopressin_interpretation`.
- Terminal-only surface findings: 23: `gpt_fmtgap_2026_07_14_fib_siadh_12`, `gpt_fmtgap_2026_07_14_fib_suicide_direct_13`, `gpt_format7a_prbc_basic_rate`, `gpt_format7a_prbc_revised_rate`, `gpt_format7c_sepsis_triage_cues_highlight`, `gpt_format10c_pediatric_rabies_pep_sequence`, `gpt_format10c_dmpa_late_repeat_injection`, `gpt_format8a_dka_glucose_decline_rate`, `gpt_format8a_car_t_ice_score`, `gpt_format8a_ect_seizure_duration`, `gpt_format8a_sleep_efficiency_week`, `gpt_format8b_doxorubicin_extravasation`, `gpt_format8c_ect_recovery_escalation`, `gpt_format9b_ect_cognitive_change_review`, `gpt_format9b_ect_consent_capacity`, `gpt_format9c_enteral_tube_occlusion`, `gpt_format9c_delayed_hemolytic_reaction`, `gpt_format9c_noisy_respiratory_secretions`, `gpt_format11a_necrotizing_soft_tissue_infection`, `gpt_format11a_acute_mesenteric_ischemia`, `gpt_format11a_acute_aortic_syndrome_cues`, `gpt_format11b_retinal_detachment_emergency_cues`, `gpt_format11b_giant_cell_arteritis_cues`.
- Construct-only findings: 15: `gpt_fmtgap_2026_07_14_bt_therapeutic_panic_01`, `gpt_fmtgap_2026_07_14_bt_trach_decannulation_05`, `gpt_fmtgap_2026_07_14_or_dry_chemical_burn_15`, `gpt_format7b_inpatient_alcohol_withdrawal_pathway`, `gpt_format7b_ambulatory_withdrawal_transfer`, `gpt_format7b_circumferential_burn_perfusion`, `gpt_format7b_pn_administration_safety`, `gpt_format7b_home_pn_transition`, `gpt_format7c_heart_failure_action_plan_bowtie`, `gpt_format8b_palliative_breathlessness_plan`, `gpt_format8b_toddler_unknown_ingestion`, `gpt_format8b_cbti_stimulus_control`, `gpt_format9c_missed_combined_pills`, `gpt_format11a_immune_ttp`, `gpt_format11b_rutherford_iib_limb_threat`.
- Design compensation requiring more than terminal deletion includes the telegraphed ordered-response plans, specialist calculation disclaimers, invented cloze records/counterfactuals, and the peak-flow total-order demand.

## Review-process diagnosis

- Evidence: all six provenance families contain adverse primary rows; Wave 2 adverse rate is 33.3%; repeated mechanisms occur across multiple families; key comparison still matched on 103 of 104 rows despite 42 adverse construct outcomes.
- Inference: format-quota pressure likely produced weak premises and extra calculations/blanks; prior review appears to have confirmed commissioned keys more often than it derived answer spaces blind; exact source pins and full permutations were treated as stronger evidence than they are.
- Evidence: no material bilingual divergence was found. Inference: bilingual presence/parity checks could not detect defects shared by both languages.
- Conclusion: the concern is systematic within this provenance pocket, not isolated to 11C. This does not establish a defect rate for the broader bank.

## Outer-ring recommendation

The conditional trigger fired. Wave 2 has 24/72 primary adverse rows (33.3%), all retained as adverse by the checker, and the checker additionally flagged two sampled Wave 2 primary passes. Repeated mechanisms span at least three provenance families and plausibly derive from the shared format-first commission/review process. Recommend a separate work order for the defined 108-item July 16 outer ring after owner disposition. This report does not begin or authorize that audit.

## Handoff

### Owner ruling recorded 2026-07-21

- Accept the 18 `RETIRE_WITHOUT_REPLACEMENT` recommendations.
- Retire the other 13 current items and replace only where current coverage analysis justifies replacement.
- Quarantine all 13 checker-level `FIX` items for repair or adjudication; do not treat them as permanent retirements.
- Treat the removed `/tmp` repeat-proof copy as a process blemish, not a challenge to the audit findings.
- Proceed under a separate work order with the defined 108-item outer-ring audit.

- Primary totals: PASS 62 / FIX 11 / RETIRE 31 / REVIEW 0.
- Checked totals: PASS 23 / FIX 13 / RETIRE 31 / REVIEW 0; agreement status AGREE 59 / DISAGREE 4 / PARTIAL 4.
- Exact owner decisions required: (1) adjudicate all 31 retirement recommendations (`gpt_fmtgap_2026_07_14_bt_trach_decannulation_05`, `gpt_fmtgap_2026_07_14_fib_reflection_10`, `gpt_fmtgap_2026_07_14_fib_cows_11`, `gpt_format7a_corrected_sodium`, `gpt_format7a_effective_osmolality`, `gpt_format7a_curb65_score`, `gpt_format7a_renal_sofa_component`, `gpt_format10b_corrected_count_increment`, `gpt_format10b_free_water_deficit`, `gpt_format10b_average_sodium_correction_rate`, `gpt_format10b_rapid_shallow_breathing_index`, `gpt_format10c_parenteral_nutrition_discontinuation_plan`, `gpt_format10c_ect_continuation_maintenance_plan`, `gpt_format10c_latent_vs_active_tuberculosis`, `gpt_format8a_haloperidol_qtcf`, `gpt_format8a_pf_ratio`, `gpt_format8b_palliative_breathlessness_plan`, `gpt_format8b_cbti_stimulus_control`, `gpt_format9a_esophageal_button_battery`, `gpt_format9b_wound_depth_change`, `gpt_format9b_montevideo_units`, `gpt_format9b_pn_glucose_infusion_rate`, `gpt_format9c_pn_peripheral_central_access`, `gpt_format11a_immune_ttp`, `gpt_format11b_cockcroft_gault_crcl`, `gpt_format11b_pediatric_oxygenation_index`, `gpt_format11b_ankle_brachial_index`, `gpt_format11c_home_peak_flow_technique`, `gpt_format11c_adrenal_laboratory_localization`, `gpt_format11c_microcytic_anemia_localization`, `gpt_format11c_water_deprivation_desmopressin_interpretation`); (2) decide replacement need for the 13 `RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED` rows; (3) resolve four material PASS-versus-FIX disagreements (`gpt_fmtgap_2026_07_14_or_toddler_choking_16`, `gpt_format7b_circumferential_burn_perfusion`, `gpt_format7c_exercise_hypoglycemia_bowtie`, `gpt_format11a_acute_mesenteric_ischemia`); (4) reconcile four class-only partials (`gpt_format7b_inpatient_alcohol_withdrawal_pathway`, `gpt_format7b_home_pn_transition`, `gpt_format9b_montevideo_units`, `gpt_format9b_pn_glucose_infusion_rate`). These queues contain 37 unique stable IDs because two class-only partials are already retirement candidates.
- Eligible bounded repair: `gpt_format11b_rutherford_iib_limb_threat`.
- Full rewrite candidates: `gpt_fmtgap_2026_07_14_bt_therapeutic_panic_01`, `gpt_fmtgap_2026_07_14_or_dry_chemical_burn_15`, `gpt_format7b_inpatient_alcohol_withdrawal_pathway`, `gpt_format7b_ambulatory_withdrawal_transfer`, `gpt_format7b_circumferential_burn_perfusion`, `gpt_format7b_pn_administration_safety`, `gpt_format7b_home_pn_transition`, `gpt_format7c_heart_failure_action_plan_bowtie`, `gpt_format8b_toddler_unknown_ingestion`, `gpt_format9c_missed_combined_pills`.
- Retirement candidates: `gpt_fmtgap_2026_07_14_bt_trach_decannulation_05`, `gpt_fmtgap_2026_07_14_fib_reflection_10`, `gpt_fmtgap_2026_07_14_fib_cows_11`, `gpt_format7a_corrected_sodium`, `gpt_format7a_effective_osmolality`, `gpt_format7a_curb65_score`, `gpt_format7a_renal_sofa_component`, `gpt_format10b_corrected_count_increment`, `gpt_format10b_free_water_deficit`, `gpt_format10b_average_sodium_correction_rate`, `gpt_format10b_rapid_shallow_breathing_index`, `gpt_format10c_parenteral_nutrition_discontinuation_plan`, `gpt_format10c_ect_continuation_maintenance_plan`, `gpt_format10c_latent_vs_active_tuberculosis`, `gpt_format8a_haloperidol_qtcf`, `gpt_format8a_pf_ratio`, `gpt_format8b_palliative_breathlessness_plan`, `gpt_format8b_cbti_stimulus_control`, `gpt_format9a_esophageal_button_battery`, `gpt_format9b_wound_depth_change`, `gpt_format9b_montevideo_units`, `gpt_format9b_pn_glucose_infusion_rate`, `gpt_format9c_pn_peripheral_central_access`, `gpt_format11a_immune_ttp`, `gpt_format11b_cockcroft_gault_crcl`, `gpt_format11b_pediatric_oxygenation_index`, `gpt_format11b_ankle_brachial_index`, `gpt_format11c_home_peak_flow_technique`, `gpt_format11c_adrenal_laboratory_localization`, `gpt_format11c_microcytic_anemia_localization`, `gpt_format11c_water_deprivation_desmopressin_interpretation`.
- Outer-ring trigger: YES.
- Artifacts: `build-population.ts`, `population.jsonl`, `build-primary.ts`, `primary-adjudication.jsonl`, `checker-population.jsonl`, `checker-blind-population.jsonl`, `checker-blind-adjudication.jsonl`, `checker-adjudication.jsonl`, `checker-batches/`, `batches/`, checker runner/build scripts, `build-report.ts`, and `report.md`.
- No bank mutation occurred, and this task changed no project file outside `audit/scored-format-construct-audit-2026-07-21/`.
