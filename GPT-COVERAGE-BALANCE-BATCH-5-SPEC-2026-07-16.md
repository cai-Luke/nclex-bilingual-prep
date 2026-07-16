# Producer Commission — Coverage Balance Batch 5

**Producer:** GPT-5.6 Sol (`gpt_` lane). **Deliverable:** exactly 18 standalone questions in one
JSON bank object. **No case studies. No visuals. No edits to existing questions.**

## Producer brief

Generate the assessment designs assigned below; do not invent substitute topics, formats, or premise
families. Each row fixes the category, canonical topic, item type, difficulty, clinical situation,
load-bearing decision, and source lane. Your work is to author a strong bilingual item inside that
box.

Return only the JSON bank object, with no Markdown fence and no commentary. Use the current `2.0`
authoring contract in `NCLEX-Question-Schema.md` and the project rules in `AGENTS.md`; do not infer
field shapes from this commission.

Save the result as:

`banks/banks-raw/gpt-balance5-coverage-batch-2026-07-16.json`

The hyphen after `gpt` in the filename is mandatory because canonical routing uses the `gpt-`
filename prefix. Question IDs use the underscore convention described below.

## Planning basis

Batch 4 and its rejected Gemini output receive no coverage credit. This order is planned only from
the 13 current canonical banks after the promotion of GPT Batches 1–3.

Current canonical-bank baseline from `npm run coverage-report` and `BANK-CENSUS.md`:

- Total top-level questions: **1,799**
- Management of Care: **291** vs 324 target, gap **-33**
- Pharmacological and Parenteral Therapies: **276** vs 288 target, gap **-12**
- Safety and Infection Control: **227** vs 234 target, gap **-7**
- Reduction of Risk Potential: **210** vs 216 target, gap **-6**
- Scarce standalone formats: highlight **133**, bowtie **135**, dropdown_cloze **172**,
  ordered_response **173**, fill_in_blank **175**, matrix **193**
- Difficulty counts: easy **246**, medium **940**, hard **613**

The exact category distribution is **8 / 4 / 3 / 3** across those four under-target categories.
The exact format distribution is **7 highlight / 5 bowtie / 3 dropdown_cloze / 3 matrix**. The exact
difficulty distribution is **7 easy / 8 medium / 3 hard**.

This order intentionally does not commission `ordered_response` or `fill_in_blank`. Their numerical
gaps do not justify an artificial sequence, vocabulary blank, isolated deadline, or arithmetic-only
item. Format fit takes precedence over parity arithmetic.

## Topic governance

Every assigned topic is a current STRICT topic in `src/topics.ts`. Copy the **Category** and
**Canonical topic** strings exactly. Do not narrow, pluralize, translate, or paraphrase them. If a
clinical detail does not fit its assigned pair, repair that detail rather than changing metadata.

## Exact assignment manifest

| # | Category | Canonical topic | itemType | Difficulty | Mandated assessment target |
|---|---|---|---|---|---|
| 1 | Management of Care | Client Advocacy | highlight | easy | A capable adult enrolled in a clinical study says, before the next study-only intervention, “I want to leave the study.” Staff imply that withdrawing could affect ordinary clinical care. Highlight the nursing statements/actions that honor withdrawal without penalty, stop further research-only interaction, notify the research team, and preserve ordinary care. |
| 2 | Management of Care | Client Advocacy | matrix | medium | A stable medical-surgical inpatient uses a trained service dog. Classify proposed staff actions as supporting or not supporting advocacy: allow the dog in ordinary patient areas; ask only the two ADA-permitted questions when the task is not obvious; do not demand certification or a task demonstration; let the client arrange animal care; exclude only for a specific allowed reason such as loss of control not corrected by the handler. |
| 3 | Management of Care | Conflict Resolution | highlight | easy | During qualified-interpreter-assisted teaching, the nurse and interpreter begin correcting one another in front of the client and teaching stalls. The stem states that facility workflow uses one speaker at a time, short segments, complete interpretation, and direct address to the client. Highlight responses that pause, move the professional disagreement away from the client, name the shared goal, invite the interpreter's perspective, agree to the stated workflow, then return jointly. |
| 4 | Management of Care | Conflict Resolution | bowtie | medium | Two potassium specimens have hemolyzed. Nursing and laboratory staff blame one another at the bedside while the repeat result needed for a treatment decision is delayed; the client is currently stable. The bowtie must identify unresolved interdepartmental conflict delaying necessary data, select a brief/huddle plus an objective shared collection-and-transport plan, and monitor closure of the repeat result and the agreed communication loop. |
| 5 | Management of Care | Confidentiality & HIPAA | dropdown_cloze | easy | An alert client was informed about the hospital directory and explicitly opted out. A caller asks whether the client is admitted and requests the room number. Complete a statement showing that staff must not confirm presence or location and should follow the client's directory restriction. |
| 6 | Management of Care | Confidentiality & HIPAA | highlight | medium | A nursing-station whiteboard is directly visible from a public elevator lobby and lists full names, room numbers, and specific diagnoses. Facility policy permits only initials and operational bed status on a board shielded from public view. Highlight the entries and placement facts that violate the stated safeguards; do not claim that every healthcare whiteboard is inherently prohibited. |
| 7 | Management of Care | Discharge Planning & Handoff | bowtie | medium | A hemodialysis client is relocating and is due for the next treatment within 48 hours. A possible receiving center is named, but acceptance and chair time are unconfirmed and the dialysis prescription, last treatment record, access information, recent laboratory results, and medication list have not been transmitted. Identify the unsafe transition, actions that confirm an accepting appointment and send the necessary handoff, and closure evidence that the next treatment is actually arranged. |
| 8 | Management of Care | Discharge Planning & Handoff | highlight | easy | A school-age child with epilepsy is returning to school after a new rescue-medication prescription. Highlight discharge gaps: no individualized seizure action plan sent with authorization, rescue-medication instructions/supply not coordinated with the school nurse, and no confirmation that responsible school staff know the response plan. Do not test state-specific delegation law. |
| 9 | Pharmacological and Parenteral Therapies | Psychotropic Medications | dropdown_cloze | easy | A client with a current or prior bulimia nervosa diagnosis receives a new bupropion XL order. Complete the statement to withhold/clarify the order because the history is a labeled contraindication associated with seizure risk. Do not add an invented serum threshold. |
| 10 | Pharmacological and Parenteral Therapies | Psychotropic Medications | highlight | medium | A client taking divalproex for bipolar disorder develops new persistent severe upper-abdominal pain, nausea/vomiting, and anorexia. Highlight the labeled symptom cues requiring prompt evaluation for valproate-associated pancreatitis while excluding unrelated stable findings. Do not reskin a generic pancreatitis-care item or require a diagnostic enzyme cutoff. |
| 11 | Pharmacological and Parenteral Therapies | Parenteral Nutrition | matrix | easy | Before administering a prescribed lipid injectable emulsion used with PN, classify bag/label findings as acceptable to continue verification or requiring the product to be held and replaced. Include a homogeneous white/milky appearance as expected and separation/oiling out, particles, discoloration, or container damage as reasons not to administer. The stem must state the facility's hold-and-clarify rule for any order-label mismatch. Use one named product label consistently. |
| 12 | Pharmacological and Parenteral Therapies | Cardiovascular & Endocrine Medications | bowtie | hard | Sacubitril/valsartan is due 12 hours after the client's last lisinopril dose. Identify an unsafe ACE-inhibitor-to-ARNI transition, select holding/clarifying the dose and establishing the labeled 36-hour washout, and monitor for angioedema plus blood pressure/clinical tolerance. Do not turn this into a generic ACE-inhibitor cough item. |
| 13 | Safety and Infection Control | Disaster & Emergency Preparedness | highlight | medium | After a mass-casualty incident, several unidentified clients arrive while families and media crowd the entrance. The activated plan requires temporary unique identifiers, a continuously updated patient-tracking list, a designated family-reunification channel, and media release only through the public-information function. Highlight actions consistent with that closed-world plan. |
| 14 | Safety and Infection Control | Standard Precautions & Hygiene | bowtie | hard | A professional-use blood glucose meter was shared across four clients without cleaning and disinfection between uses. Identify the cross-transmission/exposure risk, select stopping and securing the device plus notifying infection prevention and initiating the facility's exposed-client trace, and monitor completion of exposure evaluation and correction/audit of the meter workflow. Do not invent post-exposure drug prophylaxis. |
| 15 | Safety and Infection Control | Standard Precautions & Hygiene | matrix | easy | A blood-containing specimen tube breaks on the floor. Classify cleanup actions as appropriate or unsafe: use suitable PPE; collect contaminated glass mechanically rather than by hand; place fragments in a sharps container; clean then disinfect using the product's stated contact time; perform hand hygiene. Unsafe rows should include bare-hand pickup, compressing a waste bag, or using a vacuum. |
| 16 | Reduction of Risk Potential | ABG & Acid-Base Interpretation | dropdown_cloze | medium | A client with a high-output ileostomy has pH 7.29, PaCO2 29 mm Hg, HCO3 14 mEq/L, sodium 138 mEq/L, and chloride 112 mEq/L. State in the stem that anion gap = Na − (Cl + HCO3), normal is 8–12 mEq/L, and expected PaCO2 = 1.5(HCO3) + 8 ± 2. Complete the interpretation: normal-anion-gap metabolic acidosis from intestinal bicarbonate loss with appropriate respiratory compensation. |
| 17 | Reduction of Risk Potential | Perioperative Care | bowtie | hard | Immediately before electrosurgery above the xiphoid, alcohol-based prep remains wet and pooled beneath the client while open supplemental oxygen is present under the drapes. Identify imminent surgical-fire risk, select stopping the ignition step/removing pooled solution and waiting for complete drying plus coordinating the oxygen/ignition plan, and monitor prep dryness/pooling and the open-oxygen arrangement. |
| 18 | Reduction of Risk Potential | Intrapartum Fetal Monitoring | highlight | medium | During second-stage labor, the external “fetal” rate becomes 92/min and repeatedly coincides with the maternal pulse of 92/min. Highlight the cues and actions supporting suspected maternal-heart-rate artifact: compare both rates simultaneously, reposition/check the transducer, and confirm fetal rate by an independent appropriate method. Do not diagnose fetal bradycardia until signal identity is verified. |

## Source anchors and load-bearing rule

The named source for every row is part of the assignment. `meta.source` must pin the specific section
that supports the keyed rule and include a checkable URL. A broad organization homepage is not
sufficient. You may add another authoritative source when it supports a separate load-bearing claim,
but do not replace a precise source below with a broader one.

| # | Required source anchor |
|---|---|
| 1 | HHS OHRP, *Withdrawal of Subjects from Research Guidance*, especially the discussion of 45 CFR 46.116 and discontinuing research interactions/interventions: <https://www.hhs.gov/ohrp/regulations-and-policy/guidance/guidance-on-withdrawal-of-subject/index.html> |
| 2 | U.S. Department of Justice, *Frequently Asked Questions about Service Animals and the ADA*, Q7, Q9, Q14–15, and permitted exclusions: <https://www.ada.gov/resources/service-animals-faqs/> |
| 3–4 | AHRQ TeamSTEPPS conflict-management, huddle, and DESC material. Pin the exact module/tool used rather than the program homepage; starting point: <https://www.ahrq.gov/teamstepps-program/curriculum/team/teach/two-day.html> |
| 5 | HHS OCR, HIPAA facility-directory FAQ, opt-out/restriction rule under 45 CFR 164.510(a): <https://www.hhs.gov/hipaa/for-professionals/faq/483/does-hipaa-permit-hospitals-to-inform-visitors-about-a-patients-location/index.html> |
| 6 | HHS OCR, reasonable safeguards for nursing-station whiteboards and public visibility: <https://www.hhs.gov/hipaa/for-professionals/faq/200/what-safeguards-are-needed-to-continue-practices/index.html> |
| 7 | CMS discharge-planning rule on sending necessary information to the responsible follow-up provider: <https://www.cms.gov/newsroom/fact-sheets/cms-discharge-planning-rule-supports-interoperability-and-patient-preferences>; CMS ESRD Network coordination context: <https://www.cms.gov/medicare/quality/quality-improvement-programs/end-stage-renal-disease-esrd-network-programs> |
| 8 | CDC, *Guidance for Schools — Epilepsy*, seizure action-plan content and rescue-medicine instructions: <https://www.cdc.gov/epilepsy/php/guidance-for-schools/index.html> |
| 9 | DailyMed, current bupropion XL prescribing information, Contraindications and seizure-risk sections. Use a current label, for example: <https://dailymed.nlm.nih.gov/dailymed/getFile.cfm?setid=080853c0-fcab-4645-9ddc-4946e895ac5f&type=pdf> |
| 10 | DailyMed, current divalproex prescribing information, Warnings and Precautions 5.5 Pancreatitis: <https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b367d81d-4eca-4e28-b490-34be4c003561> |
| 11 | DailyMed, current Nutrilipid 20% prescribing information, bag inspection/separation/particles/discoloration instructions: <https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=193290b1-a0a1-4054-a22a-de5c9e7a8b73> |
| 12 | DailyMed, current ENTRESTO prescribing information, Dosage and Administration 2.1, Contraindications 4, and Warnings and Precautions 5.2: <https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=14bfc60a-9ddf-cac7-e063-6294a90a597b> |
| 13 | ASPR TRACIE, *Hospital Mass Casualty Incident Response Plan Considerations*, patient tracking and family-reunification planning: <https://files.asprtracie.hhs.gov/documents/aspr-tracie-mci-response-plan-considerations.pdf> |
| 14 | CDC, *Considerations for Blood Glucose Monitoring and Insulin Administration*, shared-meter cleaning/disinfection and unsafe-practice discussion: <https://www.cdc.gov/injection-safety/hcp/infection-control/> |
| 15 | OSHA enforcement guidance on mechanically handling contaminated broken glass and sharps disposal: <https://www.osha.gov/enforcement/directives/cpl-2-244d>; CDC core cleaning/disinfection practice for product instructions and contact time: <https://www.cdc.gov/infection-control/hcp/core-practices/index.html> |
| 16 | Merck Manual Professional, *Metabolic Acidosis*, normal-gap causes, anion-gap evaluation, and Winter's formula: <https://www.merckmanuals.com/professional/nephrology/acid-base-regulation-and-disorders/metabolic-acidosis> |
| 17 | FDA surgical-fire prevention material and alcohol-prep labeling review supporting complete drying before draping/ignition: <https://www.accessdata.fda.gov/drugsatfda_docs/nda/2018/208288Orig1s000OtherR.pdf> |
| 18 | NICE, *Fetal monitoring in labour*, recommendations 1.4.5–1.4.7 and second-stage signal differentiation: <https://www.nice.org.uk/guidance/ng229/chapter/recommendations>; ACOG's current intrapartum fetal-monitoring guideline may be added for U.S. context: <https://www.acog.org/clinical/clinical-guidance/clinical-practice-guideline/articles/2025/10/intrapartum-fetal-heart-rate-monitoring-interpretation-and-management> |

## Collision boundaries

The assigned premise is affirmative: use it. Do not swap in a familiar premise merely because it is
easier to write. In particular, do not reuse or lightly reskin any of these recent live clusters:

- capable-client refusal overridden by family, partner pressure around procedural consent, family
  interpretation, low-vision materials, inaccessible examination equipment, correctional custody,
  pain-plan bias, student-observer refusal, or a grievance after accent-based mistreatment;
- unverified family/employer calls, proxy verification, unlocked EHRs, personal-device photos,
  chart snooping, wrong discharge packets, voicemail logs, overheard bedside report, missing managed
  devices, social-media posts, public-health reporting, record amendment, or record-access deadlines;
- workload or equipment disputes, public preceptor criticism, family-update ownership, discharge
  teaching timing, unsafe potassium orders, float competency, two-challenge escalation, DESC recall,
  postoperative mobilization, handoff refusal, or receiving feedback after a rapid response;
- generic SBAR/ISBAR, missing drain data, language/hearing accommodations, ostomy or wound-device
  competency, heart-failure barriers, post-stroke transport, community-resource lists, premature
  decompensation discharge, pending pathology, warm handoff naming, medication-list mismatch, or
  long-acting-injection timing;
- clozapine neutropenia/myocarditis, lithium toxicity or interactions, EPS/NMS, MAOI diet teaching,
  serotonin syndrome, lamotrigine mucocutaneous reactions, or olanzapine metabolic monitoring;
- PN refeeding syndrome, hyperglycemia, abrupt interruption/D10, line infection, dedicated-lumen
  rules, pump arithmetic, or triglyceride/pancreatitis stop thresholds;
- START/SALT triage, chemical/radiological/biological events, structural fire evacuation, flooding,
  active shooter, electrical power loss, ransomware downtime, or hazardous-drug spill cleanup;
- needlestick response, C. difficile/norovirus hand hygiene, latex food cross-reactivity, central-line
  care, handwashing duration, syringe re-entry into vials, respiratory etiquette, linen handling,
  single-dose-vial reuse, or medication-preparation phone/sharps breaches;
- generic ABG classification, salicylate anion-gap arithmetic, COPD compensation, opioid respiratory
  depression, residual neuromuscular blockade, routine fetal categories, early/late/variable
  decelerations, membrane-rupture cord prolapse, epidural hypotension, tachysystole, sinusoidal
  pattern, or intraamniotic-infection fetal tachycardia.

These boundaries protect against known nearby clusters, not every semantic collision in the bank. A
downstream similarity and human collision sweep remains required.

## Item-construction rules

- **Closed world:** Put every facility-only workflow, classification rule, reference interval,
  formula, and threshold needed to resolve an item in the stem. An external source does not excuse
  hidden local policy.
- **One clinical judgment:** Each item must have one dominant load-bearing decision. Do not append a
  second unrelated teaching point simply to make the item feel harder.
- **Format integrity:** Highlights must require selecting meaningful cues/actions, not isolated
  vocabulary. Matrices must use mutually clear columns and independent rows. Dropdowns must make
  each blank independently resolvable. Bowties must have one condition, two actions, and two
  monitoring/evaluation selections that all belong to the same clinical model.
- **Plausible distractors:** No jokes, category errors, obviously reckless behavior, grammatical
  giveaways, or distractors contradicted by basic wording rather than nursing judgment.
- **No artificial sequencing or blanks:** Do not change any row to `ordered_response` or
  `fill_in_blank`, even if those formats are numerically scarce.
- **Translation parity:** Provide complete English/Simplified-Chinese parity for every learner-facing
  field, including strategy, glossary, tokens, segments, rows, columns, and dropdown content. Keep
  drug names, regulatory names, formulas, units, and identifiers technically exact.
- **Rationale coverage:** Provide `rationale.byChoice` for every resolvable choice reference: every
  highlight segment, matrix row/column decision, dropdown option, and bowtie token. Explain why the
  keyed choice fits and why each distractor does not.
- **Citation placement:** Put detailed citations and subsection identifiers in `meta.source`, not in
  option text or `rationale.byChoice`; inline parenthetical subsection labels can be mistaken for
  option-letter references by the audit.
- **No visuals:** Do not add `visual`, structured measurements, or `rationale.visuals`. Do not create
  or request medical images.
- **No case-study mutation:** Do not add, remove, renumber, or rewrite questions inside an existing
  case study. All 18 deliverables are new top-level standalone questions.

## ID convention

Use:

`gpt_balance5_<generation-date:YYYY_MM_DD>_<itemtype-abbrev>_<topic-slug>_<2-digit-seq>`

Example: `gpt_balance5_2026_07_16_hl_client_advocacy_01`.

The `gpt_balance5` ID prefix is unused in the current 13 canonical banks. Use one globally unique
top-level ID per item and unique local IDs for all options, segments, rows, columns, dropdowns, and
bowtie tokens.

## Producer preflight before returning JSON

Confirm all of the following:

- exactly 18 questions and `meta.count` agrees;
- `meta.schemaVersion` is exactly `2.0`;
- rows 1–18 match the assigned category, topic, item type, and difficulty exactly;
- totals are 8/4/3/3 categories, 7/5/3/3 formats, and 7/8/3 difficulties;
- every item uses its mandated premise and source anchor;
- every correct answer is supported by the stem plus cited load-bearing source;
- every learner-facing string has EN/ZH parity;
- every choice reference has a matching choice-level rationale;
- no visual, case study, ordered response, fill-in-the-blank, duplicate ID, or Markdown commentary is
  present.

After generation, the file remains raw and untrusted until normalization, validation, independent
producer-not-checker review, collision review, promotion, consolidation, ledger entry, and census
regeneration are complete under `docs/AGENTS-RUNBOOK.md`.
