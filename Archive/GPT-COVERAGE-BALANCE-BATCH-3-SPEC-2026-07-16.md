# Producer Commission — Coverage Balance Batch 3

**Producer:** GPT-5.6 Sol (`gpt_` lane). **Type:** standalone items only (no `case_study`, no visuals). **Size:** 18 items.

## Planning basis

Treat both `banks/banks-raw/gpt_mocsic_coverage_batch_2026_07_15.json` (Batch 1) and `banks/banks-raw/gpt_balance2_coverage_batch_2026_07_15.json` (Batch 2) as fully promoted for this commission's coverage arithmetic.

After promoting all 36 items from Batches 1 and 2, the projected total questions will be 1,781. The category distribution and remaining target weight gaps are:
- **Management of Care:** 283 actual vs. 321 target, gap **-38**
- **Pharmacological and Parenteral Therapies:** 272 actual vs. 285 target, gap **-13**
- **Safety and Infection Control:** 224 actual vs. 232 target, gap **-8**
- **Reduction of Risk Potential:** 207 actual vs. 214 target, gap **-7**

The projected standalone formats continue to run behind the 198.0 per-type parity mark (total 1,781 across 9 types):
- **highlight:** 128 actual (gap **-70**)
- **bowtie:** 129 actual (gap **-69**)
- **dropdown_cloze:** 169 actual (gap **-29**)
- **ordered_response:** 171 actual (gap **-27**)
- **fill_in_blank:** 173 actual (gap **-25**)

This Batch 3 commission targets these 5 scarce standalone formats with an 8 / 4 / 3 / 3 category distribution.

Difficulty distribution is set to **7 easy / 8 medium / 3 hard** to continue correcting the bank-wide under-representation of easy questions (easy is the smallest difficulty bucket bank-wide).

## Topic governance

Every topic below is an existing STRICT topic in `src/topics.ts`. Copy the **Canonical topic** and **Category** columns exactly into each question. Do not narrow, pluralize, or paraphrase a topic. If a proposed premise does not fit the assigned pair, replace the clinical scenario rather than the metadata.

Counts in the rationale column are exact canonical-string counts after overlaying the promoted Batch 1 and Batch 2 deliverables. They are planning evidence, not fields to copy into the JSON.

## Target mix (18 items, exact assignment)

| # | Category | Canonical topic | itemType | Difficulty | Rationale |
|---|---|---|---|---|---|
| 1 | Management of Care | Discharge Planning & Handoff | bowtie | medium | topic count 38; scarce bowtie format |
| 2 | Management of Care | Client Advocacy | highlight | easy | topic count 22; scarce highlight format |
| 3 | Management of Care | Client Advocacy | ordered_response | medium | topic count 22; scarce ordered_response format |
| 4 | Management of Care | Confidentiality & HIPAA | fill_in_blank | easy | topic count 27; scarce fill_in_blank format |
| 5 | Management of Care | Confidentiality & HIPAA | dropdown_cloze | easy | topic count 27; scarce dropdown_cloze format |
| 6 | Management of Care | Conflict Resolution | bowtie | hard | topic count 17; scarce bowtie format |
| 7 | Management of Care | Conflict Resolution | highlight | easy | topic count 17; scarce highlight format |
| 8 | Management of Care | Discharge Planning & Handoff | dropdown_cloze | easy | topic count 38; scarce dropdown_cloze format |
| 9 | Pharmacological and Parenteral Therapies | Dosage Calculations | bowtie | medium | topic count 67; bowtie format. The dosage calculation must be load-bearing: the learner must complete a stated reconstitution, BSA, or safe-range calculation to determine the bow-tie condition. Do not make the arithmetic incidental to a generic "hold and clarify" scenario. |
| 10 | Pharmacological and Parenteral Therapies | Anticoagulant Therapy | ordered_response | medium | topic count 44; ordered_response format. The stem must provide the exact protocol sequence. The external source can support the general anticoagulation safety premise, but the item should not represent one local nomogram as a universal clinical law. |
| 11 | Pharmacological and Parenteral Therapies | Psychotropic Medications | dropdown_cloze | easy | topic count 17; scarce dropdown_cloze format |
| 12 | Pharmacological and Parenteral Therapies | Parenteral Nutrition | highlight | medium | topic count 11; scarce highlight format |
| 13 | Safety and Infection Control | Disaster & Emergency Preparedness | highlight | hard | topic count 21; scarce highlight format |
| 14 | Safety and Infection Control | PPE & Sterile Technique | bowtie | medium | topic count 32; scarce bowtie format |
| 15 | Safety and Infection Control | Standard Precautions & Hygiene | fill_in_blank | easy | topic count 31; scarce fill_in_blank format |
| 16 | Reduction of Risk Potential | Perioperative Care | bowtie | medium | topic count 33; scarce bowtie format |
| 17 | Reduction of Risk Potential | Procedural Complications & Dialysis | highlight | hard | topic count 46; scarce highlight format |
| 18 | Reduction of Risk Potential | Intrapartum Fetal Monitoring | bowtie | medium | topic count 11; scarce bowtie format |

Totals: bowtie 6, highlight 5, dropdown_cloze 3, ordered_response 2, fill_in_blank 2. Difficulty: 7 easy / 8 medium / 3 hard.

## Do not repeat these premises

Do not reuse or lightly reskin these live, raw, or planned premises. This is a negative collision list, not a menu of required replacement scenarios:

- **Client Advocacy:** family suppression of a terminal diagnosis; uncertainty or withdrawal around surgical consent; DPOAHC/family override of a capable client's refusal; refusal of blood transfusions, antibiotics, PEG tube placement, rehabilitation, or urinary catheterization; family members utilized instead of a certified medical interpreter; colleague falsification of controlled-substance documentation; partner coercion around signing consent; clinic exam-table/wheelchair accessibility accommodations; rights of a hospitalized client under legal custody; sickle cell vaso-occlusive crisis pain management plan advocacy; patient's right to refuse observation by student nurses/observers.
- **Confidentiality & HIPAA:** unverified family/employer/visitor telephone disclosures; proxy-status verification; unattended unlocked EHR workstations; personal-device photography of client wounds; coworker snooping on charts of high-profile or non-assigned clients; printed laboratory sheets or discharge packets given to the wrong patient; voicemail/disclosure-log verification mistakes; bedside shift reports overheard by roommates' visitors; missing hospital-issued mobile devices; minimum-necessary data disclosures to quality improvement auditors; HIPAA violation via private social-media group posts; processing and timeline steps for client EHR amendment requests.
- **Conflict Resolution:** nursing workload or emergency-cart duty distribution; preceptor publicly criticizing a new graduate nurse; disagreements over which clinician updates a family; discharge-teaching readiness or timing disagreements; potassium-dosing or missed-antihypertensive resident-nurse escalation; float-nurse competency disputes regarding vasoactive infusions; scripted constructive conflict communication regarding shared infusion pumps; the formal two-challenge chain-of-command escalation pathway; TeamSTEPPS DESC structure definition (Describe, Express, Suggest, Consequences); constructive DESC message application.
- **Discharge Planning & Handoff:** standard SBAR/ISBAR transition checklists; missing surgical drain details in post-op transfer notes; certified interpreter, hearing aid, or low-literacy language barrier accommodations during discharge; validation of new ostomy care or wound-vac skills; heart-failure teach-back/home health access barriers; post-stroke medical transport or rehabilitation referrals; community resource referrals for food, medication, or aging-services; premature unsafe discharge warnings in acute decompensation; discharge with pending critical outpatient lab/pathology results; teach-back method naming.
- **Dosage Calculations:** basic single-step dose conversions (e.g., mg to mcg); routine pediatric weight-based calculations (e.g., mg/kg/day); drip rate (gtt/min) calculation from standard tubing; basic infusion time remaining calculations.
- **Anticoagulant Therapy:** routine warfarin dietary vitamin K teaching; heparin-induced thrombocytopenia (HIT) diagnosis and immediate cessation; protamine sulfate or phytonadione (vitamin K) reversal agent administration; bridging therapy rules from IV heparin to oral anticoagulation.
- **Psychotropic Medications:** clozapine-induced neutropenia, myocarditis, or infection parameters; lithium toxicity thresholds, dehydration risks, thiazide/NSAID cross-interactions, or serum level classification; haloperidol/chlorpromazine extrapyramidal symptoms (EPS) or neuroleptic malignant syndrome (NMS); monoamine oxidase inhibitor (MAOI) tyramine dietary restriction teaching; sertraline + linezolid serotonin syndrome drug interaction; Lamotrigine Stevens-Johnson syndrome (SJS) clinical progression.
- **Parenteral Nutrition:** refeeding syndrome metabolic markers; hyperglycemia/polyuria during continuous parenteral infusion; central-line administration safety rules; sudden interruption of PN managed with hypertonic dextrose (e.g., D10W) and scheduled insulin; pump-time-remaining arithmetic; central line complications/CLABSI.
- **Cardiovascular & Endocrine Medications:** ACE-inhibitor cough, angioedema, or routine teaching; digoxin toxicity/hold rules; rapid-acting-insulin hypoglycemia; abrupt prednisone withdrawal; metformin with iodinated contrast; levothyroxine with food/iron; furosemide hypokalemia; combined potassium-retaining medications with hyperkalemia; AV-nodal blocker holds; SGLT2 inhibitor (empagliflozin) euglycemic DKA.
- **Disaster & Emergency Preparedness:** START/SALT triage protocols after industrial explosions, dirty bombs, anthrax, smallpox, chemical spills, or transit accidents; structural-fire horizontal evacuation; flood-driven vertical evacuation; active-shooter lockdown, silencing devices, and secure-in-place all-clear response sequences; emergency electrical power loss during regional heat emergency.
- **PPE & Sterile Technique:** sterile field contamination during wound dressing, urinary catheterization, or central-line care; routine airborne/contact/droplet room-exit doffing orders; N95 respirator annual fit testing versus daily user seal checks; splash PPE selection for deep-wound irrigation; sterile technique for open tracheal suctioning; measles (rubeola) airborne transmission precaution protocols.
- **Standard Precautions & Hygiene:** needlestick exposure prophylaxis sequence; C. difficile or norovirus contact precaution/outbreak hand hygiene (soap and water); latex cross-sensitivities; CVC site dressing precautions; hand hygiene duration; used-syringe reentry into a multidose vial; respiratory hygiene/cough etiquette at point-of-entry screening; phone handling or carrying uncapped sharps during medication preparation; CDC linen handling protocols (shaking, bagging, point of use).
- **Perioperative Care:** routine pre-op checklist items (e.g., removal of jewelry, voiding); informed consent verification roles (surgeon vs. nurse); malignant hyperthermia dantrolene administration and genetic risk assessment.
- **Procedural Complications & Dialysis:** disequilibrium syndrome after initial hemodialysis; peritonitis signs (cloudy dialysate, fever) during peritoneal dialysis; dialysis catheter access care and thrill/bruit verification.
- **Intrapartum Fetal Monitoring:** Category I normal baseline tracings; early decelerations; late decelerations related to uteroplacental insufficiency or oxytocin infusion; variable decelerations following membrane rupture; prolonged decelerations after epidural-associated maternal hypotension; baseline bradycardia with absent variability; tachysystole management; dinoprostone cervical ripening insert tachysystole intervention sequence; NICHD 3-tier fetal heart rate category classification (e.g. sinusoidal Category III).
- **ABG & Acid-Base Interpretation:** anion-gap calculation in salicylate toxicity; CKD metabolic acidosis; chronic COPD respiratory acidosis/compensation; COPD plus prolonged vomiting; generic matrix classification of several ABG sets; respiratory acidosis from opioid-induced respiratory depression.

## Schema and quality bar

Use the current `2.0` authoring contract in `NCLEX-Question-Schema.md` and the project rules in `AGENTS.md`; do not infer field shape from this commission. Return exactly one JSON bank object with 18 questions and no Markdown fence or commentary.

Hold to these semantic and quality requirements:

- **Closed-World stems:** State any governing facility sequence, classification rule, threshold, reference interval, or calculation convention needed to resolve the item in the stem.
- **Plausible distractors:** Avoid filler, joke, category-error, or visibly unsafe distractors that make the item answerable without nursing judgment.
- **Translation parity:** Provide full bilingual English/Simplified-Chinese parity for every learner-facing text field, including `testTakingStrategy`, glossary entries, tokens, segments, blanks, and dropdown content.
- **Choice-level rationales:** Provide `rationale.byChoice` coverage for every resolvable choice reference: every bowtie token, every selectable highlight segment, every dropdown, every blank, and every ordered-response option.
- **Source precision:** `meta.source` must support the item's load-bearing rule; a topic-level homepage is insufficient. Cite the specific regulation, guideline section, official drug labeling section, or similarly precise authoritative source. If a facility policy makes an exact sequence closed-world, the external source must still support the general clinical or safety premise.
- **No visuals:** Do not use AI-generated medical images. This commission requests no visuals of any kind, including `rationale.visuals`.
- **Ordered-Response Safeguards:** Do not serialize actions that are normally concurrent. Use the `ordered_response` format only when the stem establishes a stable, clinically defensible, and sequential set of steps. Do not turn mathematical steps into an artificial sequence or imply that the nurse is placing the order. The stem must provide the exact protocol sequence to be ordered (e.g. for heparin titration or administration nomograms); the item should not represent one local policy or nomogram as a universal clinical law.

## ID convention

`gpt_balance3_<generation-date:YYYY_MM_DD>_<itemtype-abbrev>_<topic-slug>_<2-digit-seq>` — for example, `gpt_balance3_2026_07_16_bt_client_advocacy_01`. The `gpt_balance3` prefix is unused across the 13 canonical banks and the raw batches. Use one globally unique top-level ID per item and unique local reference IDs within it.

## Promotion path

Save as `banks/banks-raw/gpt_balance3_coverage_batch_2026_07_16.json`, then run normalization and validation checks. A downstream semantic-similarity and human collision sweep is still required; this list protects against known premise clusters, not every possible semantic collision in the bank. Follow `docs/AGENTS-RUNBOOK.md` for the full raw-content promotion pipeline.
