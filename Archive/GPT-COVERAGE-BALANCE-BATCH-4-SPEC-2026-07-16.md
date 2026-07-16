# Producer Commission — Coverage Balance Batch 4

> **Disposition (2026-07-16): DISCARDED.** The associated Gemini generation was rejected by the
> project owner and is not pending review, promotion, or coverage credit. This archived order is
> retained only as process history and must not be reused as an active commission.

**Producer:** GPT-5.6 Sol (`gpt_` lane). **Type:** 16 standalone items + 2 case study completions. **Size:** 18 items total.

## Planning basis

Based on `npm run coverage-report` and `BANK-CENSUS.md` following the promotion of Batch 3:
- **Total questions:** 1,799
- **Category gaps:**
  - Management of Care: 291 vs 324 target, gap **-33**
  - Pharmacological and Parenteral Therapies: 276 vs 288 target, gap **-12**
  - Safety and Infection Control: 227 vs 234 target, gap **-7**
  - Reduction of Risk Potential: 210 vs 216 target, gap **-6**
- **Standalone formats gaps** (against parity target ~200):
  - highlight: 133 vs 200, gap **-67**
  - bowtie: 135 vs 200, gap **-65**
  - dropdown_cloze: 172 vs 200, gap **-28**
  - ordered_response: 173 vs 200, gap **-27**
  - fill_in_blank: 175 vs 200, gap **-25**
  - matrix: 193 vs 200, gap **-7**
- **Visual kind gaps:**
  - `io_trend`: 4 items (recently added, very low coverage)
  - `fetal_monitoring`: 6 items
  - `injection_site`: 8 items

This Batch 4 commission targets these gaps with:
1. **16 Standalone Items** to address categories and formats.
2. **2 Case Study Completions** to resolve the legacy 5-part case studies identified in `audit/case-completion/FINAL-ARCHITECTURE-REPORT.md`.

Difficulty distribution is set to **6 easy / 8 medium / 4 hard** to continue balancing the bank-wide under-representation of easy questions.

---

## Topic governance

Every topic below is an existing STRICT topic in `src/topics.ts`. Copy the **Canonical topic** and **Category** columns exactly into each question. Do not narrow, pluralize, or paraphrase a topic. If a proposed premise does not fit the assigned pair, replace the clinical scenario rather than the metadata.

---

## Target mix (18 items, exact assignment)

### Part 1: Standalone Format-Gap & Visual-Gap Top-ups (16 items)

| # | Category | Canonical topic | itemType | Difficulty | Rationale |
|---|---|---|---|---|---|
| 1 | Management of Care | Prioritization & Delegation | bowtie | medium | topic count 55; scarce bowtie format |
| 2 | Management of Care | Client Advocacy | highlight | easy | topic count 24; scarce highlight format |
| 3 | Management of Care | Confidentiality & HIPAA | fill_in_blank | easy | topic count 29; scarce fill_in_blank format |
| 4 | Management of Care | Conflict Resolution | dropdown_cloze | medium | topic count 19; scarce dropdown_cloze format |
| 5 | Management of Care | Discharge Planning & Handoff | ordered_response | easy | topic count 39; scarce ordered_response format |
| 6 | Management of Care | Legal & Ethical Principles | matrix | medium | topic count 51; matrix format |
| 7 | Management of Care | Legal & Ethical Principles | highlight | easy | topic count 51; scarce highlight format |
| 8 | Pharmacological and Parenteral Therapies | Dosage Calculations | ordered_response | medium | topic count 56. The dosage calculation ordered response must test a clinical sequence of calculations (e.g. recalculating a rate after titration or converting units step-by-step), and must be load-bearing. |
| 9 | Pharmacological and Parenteral Therapies | Anticoagulant Therapy | bowtie | hard | topic count 44; scarce bowtie format |
| 10 | Pharmacological and Parenteral Therapies | Psychotropic Medications | highlight | easy | topic count 18; scarce highlight format |
| 11 | Pharmacological and Parenteral Therapies | Parenteral Nutrition | dropdown_cloze | medium | topic count 12; scarce dropdown_cloze format |
| 12 | Safety and Infection Control | Standard Precautions & Hygiene | fill_in_blank | easy | topic count 30; scarce fill_in_blank format |
| 13 | Safety and Infection Control | PPE & Sterile Technique | bowtie | medium | topic count 29; scarce bowtie format |
| 14 | Safety and Infection Control | Disaster & Emergency Preparedness | highlight | hard | topic count 13; scarce highlight format |
| 15 | Reduction of Risk Potential | Intrapartum Fetal Monitoring | dropdown_cloze | medium | topic count 12. Must be a visual-based item utilizing the `fetal_monitoring` kind to interpret heart rate patterns. |
| 16 | Reduction of Risk Potential | Procedural Complications & Dialysis | select_all | hard | topic count 45. Must be a visual-based item utilizing the newly-introduced `io_trend` kind to identify complications of fluid overload or dialysis deficits. |

### Part 2: Case Study Completions (2 items)

These items complete two legacy 5-part case studies to standard 6-part NGN structures.

| # | Category | Canonical topic | itemType | Difficulty | Rationale / Completion Task |
|---|---|---|---|---|---|
| 17 | Reduction of Risk Potential | Oncology & Immunotherapy Complications | matrix | hard | **Case study to complete:** `opus_car_t_crs_2026_06_11_case_01` (in `banks/hard-cases-canonical.json`). <br><br>**Task:** Q4 currently merges Decision Point 4 (ICANS) and Decision Point 5 (lab trends/end-organ dysfunction). Modify Q4 to focus exclusively on ICANS clinical assessment and actions (DP4). Create a new Q5 (`opus_car_t_crs_2026_06_11_case_01_q5` in `matrix` format) focusing on the laboratory data/end-organ dysfunction trends (DP5) from Stage 2. Shift the existing post-intervention evaluation dropdown-cloze question to Q6 (`opus_car_t_crs_2026_06_11_case_01_q6`). This fully restores the 6-part structure from `Archive/case_sources/OpusCarT.md`. |
| 18 | Management of Care | code status escalation | multiple_choice | medium | **Case study to complete:** `opus2_case_code_status_01` (in `banks/claude-canonical.json`). <br><br>**Task:** Create a new 6th question (`opus2_case_code_status_q6` in `multiple_choice` format) to test contemporaneous, factual documentation of Mr. Jeffries's expressed wishes and escalation attempts across the entire shift (Decision Point 6 in `Archive/case_sources/Opus2.md`). Focus on objective documentation standards (avoiding retrospective summary notes, editorial interpretations, or omitting provider escalation timeline events). This fully completes the 6-part structure from the source markdown skeleton. |

---

## Do not repeat these premises

Do not reuse or lightly reskin these live, raw, or planned premises. This is a negative collision list, not a menu of required replacement scenarios:

- **Client Advocacy:** family suppression of a terminal diagnosis; uncertainty or withdrawal around surgical consent; DPOAHC/family override of a capable client's refusal; refusal of blood transfusions, antibiotics, PEG tube placement, rehabilitation, or urinary catheterization; family members utilized instead of a certified medical interpreter; colleague falsification of controlled-substance documentation; partner coercion around signing consent; clinic exam-table/wheelchair accessibility accommodations; rights of a hospitalized client under legal custody; sickle cell vaso-occlusive crisis pain management plan advocacy; patient's right to refuse observation by student nurses/observers; correctional-client advocacy.
- **Confidentiality & HIPAA:** unverified family/employer/visitor telephone disclosures; proxy-status verification; unattended unlocked EHR workstations; personal-device photography of client wounds; coworker snooping on charts of high-profile or non-assigned clients; printed laboratory sheets or discharge packets given to the wrong patient; voicemail/disclosure-log verification mistakes; bedside shift reports overheard by roommates' visitors; missing hospital-issued mobile devices; minimum-necessary data disclosures to quality improvement auditors; HIPAA violation via private social-media group posts; processing and timeline steps for client EHR amendment requests.
- **Conflict Resolution:** nursing workload or emergency-cart duty distribution; preceptor publicly criticizing a new graduate nurse; disagreements over which clinician updates a family; discharge-teaching readiness or timing disagreements; potassium-dosing or missed-antihypertensive resident-nurse escalation; float-nurse competency disputes regarding vasoactive infusions; scripted constructive conflict communication regarding shared infusion pumps; the formal two-challenge chain-of-command escalation pathway; TeamSTEPPS DESC structure definition (Describe, Express, Suggest, Consequences); constructive DESC message application; interdisciplinary postoperative mobilization conflict with reassessment policy.
- **Discharge Planning & Handoff:** standard SBAR/ISBAR transition checklists; missing surgical drain details in post-op transfer notes; certified interpreter, hearing aid, or low-literacy language barrier accommodations during discharge; validation of new ostomy care or wound-vac skills; heart-failure teach-back/home health access barriers; post-stroke medical transport or rehabilitation referrals; community resource referrals for food, medication, or aging-services; premature unsafe discharge warnings in acute decompensation; discharge with pending critical outpatient lab/pathology results; teach-back method naming.
- **Dosage Calculations:** basic single-step dose conversions (e.g., mg to mcg); routine pediatric weight-based calculations (e.g., mg/kg/day); drip rate (gtt/min) calculation from standard tubing; basic infusion time remaining calculations; reconstitution, BSA, or safe-range calculations.
- **Anticoagulant Therapy:** routine warfarin dietary vitamin K teaching; heparin-induced thrombocytopenia (HIT) diagnosis and immediate cessation; protamine sulfate or phytonadione (vitamin K) reversal agent administration; bridging therapy rules from IV heparin to oral anticoagulation.
- **Psychotropic Medications:** clozapine-induced neutropenia, myocarditis, or infection parameters; lithium toxicity thresholds, dehydration risks, thiazide/NSAID cross-interactions, or serum level classification; haloperidol/chlorpromazine extrapyramidal symptoms (EPS) or neuroleptic malignant syndrome (NMS); monoamine oxidase inhibitor (MAOI) tyramine dietary restriction teaching; sertraline + linezolid serotonin syndrome drug interaction; Lamotrigine Stevens-Johnson syndrome (SJS) clinical progression.
- **Parenteral Nutrition:** refeeding syndrome metabolic markers; hyperglycemia/polyuria during continuous parenteral infusion; central-line administration safety rules; sudden interruption of PN managed with hypertonic dextrose (e.g., D10W) and scheduled insulin; pump-time-remaining arithmetic; central line complications/CLABSI.
- **Disaster & Emergency Preparedness:** START/SALT triage protocols after industrial explosions, dirty bombs, anthrax, smallpox, chemical spills, or transit accidents; structural-fire horizontal evacuation; flood-driven vertical evacuation; active-shooter lockdown, silencing devices, and secure-in-place all-clear response sequences; emergency electrical power loss during regional heat emergency.
- **PPE & Sterile Technique:** sterile field contamination during wound dressing, urinary catheterization, or central-line care; routine airborne/contact/droplet room-exit doffing orders; N95 respirator annual fit testing versus daily user seal checks; splash PPE selection for deep-wound irrigation; sterile technique for open tracheal suctioning; measles (rubeola) airborne transmission precaution protocols.
- **Standard Precautions & Hygiene:** needlestick exposure prophylaxis sequence; C. difficile or norovirus contact precaution/outbreak hand hygiene (soap and water); latex cross-sensitivities; CVC site dressing precautions; hand hygiene duration; used-syringe reentry into a multidose vial; respiratory hygiene/cough etiquette at point-of-entry screening; phone handling or carrying uncapped sharps during medication preparation; CDC linen handling protocols (shaking, bagging, point of use).
- **Perioperative Care:** routine pre-op checklist items (e.g., removal of jewelry, voiding); informed consent verification roles (surgeon vs. nurse); malignant hyperthermia dantrolene administration and genetic risk assessment.
- **Procedural Complications & Dialysis:** disequilibrium syndrome after initial hemodialysis; peritonitis signs (cloudy dialysate, fever) during peritoneal dialysis; dialysis catheter access care and thrill/bruit verification.
- **Intrapartum Fetal Monitoring:** Category I normal baseline tracings; early decelerations; late decelerations related to uteroplacental insufficiency or oxytocin infusion; variable decelerations following membrane rupture; prolonged decelerations after epidural-associated maternal hypotension; baseline bradycardia with absent variability; tachysystole management; dinoprostone cervical ripening insert tachysystole intervention sequence; NICHD 3-tier fetal heart rate category classification (e.g. sinusoidal Category III).

---

## Schema and quality bar

Use the current `2.0` authoring contract in `NCLEX-Question-Schema.md` and the project rules in `AGENTS.md`. Hold to these semantic and quality requirements:

- **Closed-World stems:** State any governing facility sequence, classification rule, threshold, reference interval, or calculation convention needed to resolve the item in the stem.
- **Plausible distractors:** Avoid filler, joke, category-error, or visibly unsafe distractors that make the item answerable without nursing judgment.
- **Translation parity:** Provide full bilingual English/Simplified-Chinese parity for every learner-facing text field, including `testTakingStrategy`, glossary entries, tokens, segments, blanks, and dropdown content.
- **Choice-level rationales:** Provide `rationale.byChoice` coverage for every resolvable choice reference: every bowtie token, every selectable highlight segment, every dropdown, every blank, and every ordered-response option.
- **Source precision:** `meta.source` must support the item's load-bearing rule. Cite the specific regulation, guideline section, official drug labeling section, or similarly precise authoritative source.
- **Visual items:** For items utilizing visual kinds (such as `fetal_monitoring` and `io_trend`), ensure that the visual is load-bearing: the item must not be answerable without interpreting the visual data. Do not use AI-generated images; visuals must be locally rendered from structured data.
- **Ordered-Response Safeguards:** Do not serialize actions that are normally concurrent. Use the `ordered_response` format only when the stem establishes a stable, clinically defensible, and sequential set of steps. Do not turn mathematical steps into an artificial sequence. The stem must provide the exact protocol sequence to be ordered.
- **Case Study Completion Hardening:** Ensure the completed case studies match the existing case studies in `banks/hard-cases-canonical.json` and `banks/claude-canonical.json` exactly, except for the modifications described in Part 2. The IDs and structures must remain aligned, and all new questions must follow the 2.0 schema (e.g., complete `en`/`zh` translations, full `rationale.byChoice` mapping, and precise `meta.source`).

---

## ID convention

`gpt_balance4_<generation-date:YYYY_MM_DD>_<itemtype-abbrev>_<topic-slug>_<2-digit-seq>` — for example, `gpt_balance4_2026_07_16_bt_prioritization_01`.

For the case study completions, match the existing case question ID formats:
- CAR-T new question: `opus_car_t_crs_2026_06_11_case_01_q5` (shifting the existing Q5 to `opus_car_t_crs_2026_06_11_case_01_q6`).
- Code Status new question: `opus2_case_code_status_q6`.

---

## Promotion path

Save the 16 standalone questions as `banks/banks-raw/gpt-balance4-coverage-batch-2026-07-16.json`, then run normalization and validation checks.
Save the 2 completed case studies in full as `banks/banks-raw/gpt-case-completions-batch-2026-07-16.json` (when promoted, this will overwrite the older 5-part versions in their respective canonical files).
Run `npm run validate-bank -- <path-to-generated-json>` and `npm run audit` to verify compliance.
