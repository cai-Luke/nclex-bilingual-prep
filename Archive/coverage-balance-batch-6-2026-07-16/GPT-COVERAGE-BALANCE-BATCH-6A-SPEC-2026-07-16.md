# Producer Commission — Coverage Balance Batch 6A

**Producer:** GPT producer A (`gpt_` lane). **Deliverable:** exactly 18 standalone questions in one
JSON bank object. **No case studies. No visuals. No edits to existing questions.**

This is one independently runnable half of a coordinated 36-item order. The companion 6B packet is
not required context and must not be consulted or combined with this deliverable.

## Producer brief

Generate the assessment designs assigned below; do not invent substitute topics, formats, premise
families, or source lanes. Each row fixes the category, canonical topic, item type, difficulty,
clinical situation, and load-bearing decision. Your work is to author a strong bilingual item inside
that box.

Return only the JSON bank object, with no Markdown fence and no commentary. Use the current `2.0`
authoring contract in `NCLEX-Question-Schema.md` and the project rules in `AGENTS.md`; do not infer
field shapes from this commission or from prior generated banks.

Save the result as:

`banks/banks-raw/gpt-balance6a-coverage-batch-2026-07-16.json`

The hyphen after `gpt` in the filename is mandatory because canonical routing uses the `gpt-`
filename prefix. Question IDs use the underscore convention described below.

## Planning basis

This order provisionally counts the 18 reviewed-but-not-yet-promoted Batch 5 items because the user
has approved them for the next promotion gate. Batch 4 and its rejected Gemini output receive no
coverage credit.

Provisional post-Batch-5 baseline from `npm run coverage-report --
banks/banks-raw/gpt-balance5-coverage-batch-2026-07-16.json`:

- Total top-level questions: **1,816**
- Management of Care: **299** vs 327 target, gap **-28**
- Reduction of Risk Potential: **206** vs 218 target, gap **-12**
- Safety and Infection Control: **231** vs 236 target, gap **-5**
- All other categories are at or above their top-level targets
- Scarce standalone formats: bowtie **140**, highlight **140**, ordered_response **173**,
  dropdown_cloze **175**, matrix **195**
- Difficulty counts: easy **252**, medium **948**, hard **616**

Across 6A and 6B, the exact category distribution is **22 Management of Care / 8 Reduction of Risk
Potential / 6 Safety and Infection Control**. On the projected 1,852-item bank, that moves the three
gaps to approximately **-12 / -8 / -4**, respectively. A 36-item order cannot eliminate every gap
because each category target rises with the bank total.

This 6A packet has exact totals of **11 / 4 / 3 categories**, **6 highlight / 4 bowtie / 3
dropdown_cloze / 3 matrix / 2 ordered_response formats**, and **7 easy / 8 medium / 3 hard**.
No fill-in-the-blank item is commissioned because none of these premises is improved by an isolated
blank or arithmetic-only response.

## Topic governance

Copy every **Category** and **Canonical topic** string exactly. `Client Advocacy`, `Conflict
Resolution`, `Confidentiality & HIPAA`, and `Discharge Planning & Handoff` are STRICT Management of
Care topics in `src/topics.ts`. `Caregiver Role Strain & Family Coping` is explicitly licensed there
as a SHARED topic for Management of Care; use the assigned Management of Care category and do not
move it to Psychosocial Integrity. All other assigned pairs are current STRICT pairs.

## Exact assignment manifest

| # | Category | Canonical topic | itemType | Difficulty | Mandated assessment target |
|---|---|---|---|---|---|
| 1 | Management of Care | Client Advocacy | dropdown_cloze | easy | A capable inpatient names a close friend as the desired visitor/support person. Staff plan to exclude the friend solely because the person is not legally related to the client. Complete a statement showing that the hospital must honor the client's designated visitor without relationship-based discrimination unless a clinically necessary or otherwise reasonable restriction applies equally and is explained. Do not imply unlimited visitation during a genuine safety restriction. |
| 2 | Management of Care | Client Advocacy | matrix | medium | A client with dysarthria uses a speech-generating device and communicates slowly. Classify proposed staff behaviors as advocacy-supporting or not: ask the client which communication method works best; provide and allow use of the device; allow response time; address the client directly; verify unclear words respectfully; do not finish sentences, redirect all questions to the companion, or equate impaired speech with impaired decision-making. The stem must state that the client is alert and has decision-making capacity. |
| 3 | Management of Care | Conflict Resolution | highlight | easy | After a medication near miss that caused no harm, a brief team debrief begins. Highlight facilitator statements/actions that review the specific goal and facts, invite each role's observations, identify what worked and what should change, avoid individual blame, and assign a concrete follow-up. Exclude accusatory, speculative, or punitive comments. |
| 4 | Management of Care | Conflict Resolution | bowtie | medium | Day and night shifts repeatedly accuse each other of failing to restock a time-critical airway cart. An objective audit shows that responsibility changes at 1900 but the handoff checklist has no named owner or verification step. Identify role/process ambiguity sustaining recurrent conflict, select a joint huddle plus a revised owner-and-closed-loop verification process, and monitor completion of the new handoff check plus recurrence of stock omissions. Do not turn this into an emergency response to an actively deteriorating client. |
| 5 | Management of Care | Confidentiality & HIPAA | dropdown_cloze | easy | A client experiencing intimate-partner stalking asks the clinic to send appointment reminders only to a new email address and not to the home telephone or mailing address. Complete a statement recognizing a request for confidential communications by an alternative means/location and the need to route it through the covered entity's process rather than continue the unsafe channels. Do not ask the learner to decide state-specific documentation. |
| 6 | Management of Care | Confidentiality & HIPAA | highlight | medium | A client pays a laboratory service in full out of pocket and, before the claim is submitted, asks the covered provider not to disclose that service to the health plan for payment or healthcare operations. Highlight facts and actions supporting the mandatory health-plan restriction: full out-of-pocket payment for the specific service, a disclosure sought for payment/operations rather than treatment, recording/routing the restriction, and not billing the plan for that service. Exclude a demand to conceal information needed for another provider's treatment. |
| 7 | Management of Care | Discharge Planning & Handoff | bowtie | hard | A client is leaving today on outpatient parenteral antimicrobial therapy. The infusion supply delivery is confirmed, but no clinician/team has accepted responsibility for the OPAT course, ordered laboratory dates have no named recipient, and follow-up is unbooked. Identify an unsafe unowned OPAT transition, select confirming the responsible OPAT/ID clinician plus transmitting the regimen and monitoring plan, and monitor receipt/review of scheduled laboratory results plus attendance/clinical follow-up. Do not invent a universal test frequency; the stem must provide the prescribed monitoring plan. |
| 8 | Management of Care | Discharge Planning & Handoff | highlight | easy | An adult with uncomplicated mild traumatic brain injury is being discharged from the emergency department. Highlight missing discharge elements: verbal and written delayed-danger-sign instructions, informing a chosen family member/friend what to watch for, a follow-up plan within the stated timeframe, and individualized written return-to-work/driving/activity guidance. Do not require routine repeat imaging when the closed-world stem states that the evaluation supports discharge. |
| 9 | Management of Care | Discharge Planning & Handoff | matrix | medium | A client will begin home enteral feeding with a pump. Classify transition elements as ready or unresolved: individualized regimen and monitoring plan; patient/caregiver return demonstration; routine and emergency contact numbers; confirmed delivery of formula, pump, tubing, and ancillaries; coordinated community nutrition/home-care support. Unresolved rows should include only a video link without competence assessment, an equipment order with no delivery confirmation, or no after-hours contact. Do not test bedside tube-placement verification technique. |
| 10 | Management of Care | Caregiver Role Strain & Family Coping | bowtie | medium | A spouse is listed as the sole helper for a newly dependent stroke client, but states that a two-person transfer is physically impossible and fears dropping the client. Identify a discharge plan that exceeds the willing caregiver's capacity, select reassessing transfer needs with therapy and revising equipment/personnel/home-support arrangements, and monitor a safe demonstrated transfer plan plus confirmation of the actual support schedule. Do not frame caregiver inability as unwillingness or nonadherence. |
| 11 | Management of Care | Caregiver Role Strain & Family Coping | highlight | easy | The discharge record says an adult son is “available daily,” but the son tells the nurse he lives two hours away and can come only on weekends; the client will need help every morning. Highlight the cues/actions requiring correction of the plan: verify availability directly with the caregiver and client, document the real schedule, identify the uncovered weekday need, and arrange/refer for an alternative support plan before relying on him. |
| 12 | Reduction of Risk Potential | ABG & Acid-Base Interpretation | dropdown_cloze | medium | A client with prolonged nasogastric suction has pH 7.51, PaCO2 48 mm Hg, HCO3 37 mEq/L, chloride 88 mEq/L, and no chronic lung disease. State in the stem that expected PaCO2 in metabolic alkalosis rises about 0.6–0.75 mm Hg per 1 mEq/L rise in HCO3 above 24 and generally does not exceed 55 mm Hg from compensation alone. Complete the interpretation: chloride-responsive metabolic alkalosis from gastric acid/chloride loss with appropriate respiratory compensation. |
| 13 | Reduction of Risk Potential | Perioperative Care | bowtie | hard | Minutes after a peripheral nerve block, the client reports metallic taste and tinnitus, then develops agitation, a seizure, hypotension, and a wide-complex dysrhythmia. Identify local anesthetic systemic toxicity, select stopping local-anesthetic administration/calling for the LAST rescue pathway plus airway/seizure support and 20% lipid emulsion per the supplied protocol, and monitor rhythm/hemodynamic stability plus neurologic recovery. Do not import standard ACLS drug doses that conflict with the ASRA LAST checklist; place any dose required for an option in the stem. |
| 14 | Reduction of Risk Potential | Procedural Complications & Dialysis | ordered_response | hard | A peritoneal-dialysis client reports new cloudy effluent and abdominal pain but is hemodynamically stable. The closed-world stem states the unit sequence: notify the PD clinician; obtain effluent for cell count/differential, Gram stain, and culture before the first antibiotic dose when this does not cause dangerous delay; begin prescribed empiric therapy promptly; then reassess symptoms, effluent clarity, and results for regimen adjustment. Order those actions. Do not require the producer to invent antibiotic selection or dwell-time dosing. |
| 15 | Reduction of Risk Potential | Intrapartum Fetal Monitoring | highlight | medium | During labor, a previously normal tracing develops a single prolonged deceleration/acute bradycardia that has lasted 3 minutes. Highlight the actions supported by the stem's unit pathway: call urgent obstetric help, assess for an acute event such as cord prolapse or abruption, stop oxytocin if infusing, reposition/correct reversible maternal causes, and prepare for urgent birth if the abnormality persists. Exclude waiting for routine reassessment or automatically performing an operative delivery before the rapid evaluation. |
| 16 | Safety and Infection Control | Disaster & Emergency Preparedness | highlight | easy | A hospital is under a municipal boil-water advisory. Highlight actions consistent with the activated emergency water plan: stop use of tap water and ordinary ice for drinking; use bottled/appropriately disinfected water; use safe water for wound care and specified equipment; notify affected users; and suspend sterile processing if required water quality cannot be supplied. Do not claim that every use of tap water is prohibited when the CDC guidance distinguishes uses and patient risk. |
| 17 | Safety and Infection Control | PPE & Sterile Technique | ordered_response | medium | A nurse with facial hair crossing the seal area is assigned to enter an airborne-infection room using a tight-fitting respirator. The stem states the facility respiratory-protection pathway: do not enter using the failed tight-fitting respirator; notify the respiratory-protection lead; obtain the approved alternative (for example, a loose-fitting PAPR) and complete required inspection/training; then enter with the correctly used ensemble. Order the steps. Do not imply that shaving is the only permissible accommodation. |
| 18 | Safety and Infection Control | PPE & Sterile Technique | matrix | easy | Before a sterile procedure, classify wrapped-set findings as usable or not usable under event-related sterility: dry intact package with intact seal and acceptable indicator; wet package; torn or punctured wrap; broken seal; visibly damaged container. The stem must state that an apparently old but intact package remains governed by facility dating policy and that an external chemical indicator alone does not prove sterility. |

## Source anchors and load-bearing rule

The named source for every row is part of the assignment. `meta.source` must pin the specific section
supporting the keyed rule and include a checkable URL. A topic homepage is insufficient. You may add
another authoritative source for a separate load-bearing claim, but do not replace a precise anchor
below with a broader page.

| # | Required source anchor |
|---|---|
| 1 | CMS State Operations Manual guidance for 42 CFR 482.13(h), including patient-designated visitors, nondiscrimination, and clinically necessary/reasonable restrictions: <https://www.cms.gov/Regulations-and-Guidance/Guidance/Transmittals/downloads/R75SOMA.pdf> |
| 2 | U.S. DOJ, *ADA Requirements: Effective Communication*, especially speech disabilities, auxiliary aids, the person's usual method, and allowing more time: <https://www.ada.gov/resources/effective-communication/> |
| 3 | AHRQ TeamSTEPPS, *Reviewing the Team's Performance: Debrief*, especially performance improvement and avoiding blame: <https://www.ahrq.gov/teamstepps-program/curriculum/team/tools/debrief.html> |
| 4 | AHRQ TeamSTEPPS huddle/teamwork tools. Pin the exact huddle or closed-loop tool used; starting points: <https://www.ahrq.gov/teamstepps-program/curriculum/team/tools/huddle.html> and <https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/loop.html> |
| 5–6 | 45 CFR 164.522(b) confidential communications and 164.522(a)(1)(vi) paid-in-full health-plan restriction: <https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E/section-164.522> |
| 7 | IDSA, *Clinical Practice Guideline for the Management of OPAT*, Recommendations 14 and 16 and the discussion of responsible oversight and laboratory-result availability: <https://www.idsociety.org/practice-guideline/outpatient-parenteral-antimicrobial-therapy/> |
| 8 | CDC adult mild-TBI discharge instructions and checklist: <https://www.cdc.gov/traumatic-brain-injury/media/pdfs/TBI_Patient_Instructions-a.pdf> and <https://www.cdc.gov/traumaticbraininjury/pdf/checklist_adult_mTBI-508.pdf> |
| 9 | NICE CG32, Recommendations 1.9.2–1.9.4, coordinated home-enteral support, individualized plan, training, emergency contacts, and equipment/feed delivery: <https://www.nice.org.uk/guidance/CG32/chapter/recommendations> |
| 10–11 | CMS discharge-planning guidance requiring consideration of caregiver availability, capacity, and capability: <https://www.cms.gov/Regulations-and-Guidance/Guidance/Manuals/downloads/som107ap_pp_guidelines_ltcf.pdf>; AHRQ IDEAL/RED implementation details: <https://www.ahrq.gov/patient-safety/patients-families/engagingfamilies/strategy4/index.html> |
| 12 | Merck Manual Professional, *Metabolic Alkalosis*, nasogastric suction/chloride-responsive causes, plus its expected-compensation table: <https://www.merckmanuals.com/professional/nephrology/acid-base-regulation-and-disorders/metabolic-alkalosis> and <https://www.merckmanuals.com/professional/multimedia/table/primary-changes-and-compensations-in-simple-acid-base-disorders> |
| 13 | ASRA, *Checklist for Treatment of Local Anesthetic Systemic Toxicity (LAST)*: <https://asra.com/docs/default-source/guidelines-articles/local-anesthetic-systemic-toxicity-rgb.pdf> |
| 14 | ISPD, *Peritonitis guideline recommendations: 2022 update*, diagnostic criteria/specimen collection and prompt empiric therapy sections: <https://journals.sagepub.com/doi/10.1177/08968608221080586> |
| 15 | NICE NG229, *Fetal monitoring in labour*, acute bradycardia/single prolonged deceleration recommendations: <https://www.nice.org.uk/guidance/ng229/chapter/recommendations> |
| 16 | CDC, *Guidance for Healthcare Water System Repair and Recovery Following a Boil Water Alert or Disruption of Water Supply*, especially drinking water, wound care, equipment, and sterile processing: <https://www.cdc.gov/infection-control/hcp/reopen-health-facilities/water-system-repair.html> |
| 17 | OSHA interpretation on facial hair and respirator sealing surfaces, including the loose-fitting PAPR alternative: <https://www.osha.gov/laws-regs/standardinterpretations/2012-09-14> |
| 18 | CDC sterilization guidance on event-related sterility and package wetness/damage: <https://www.cdc.gov/infection-control/hcp/disinfection-sterilization/sterilizing-practices.html> and <https://stacks.cdc.gov/view/cdc/154498/cdc_154498_DS1.pdf> |

## Collision boundaries

Use each assigned premise affirmatively. Do not replace it with a familiar neighboring scenario. In
particular, do not reuse or lightly reskin:

- capable-client refusal overridden by family, partner coercion around consent, research withdrawal,
  service animals, low-vision materials, inaccessible examination equipment, correctional custody,
  pain-plan bias, student observers, family interpreters, accent-based mistreatment, or skilled-facility
  choice;
- unverified callers, directory opt-out, voicemail logs, proxy verification, unlocked EHRs, chart
  snooping, personal-device photos, wrong packets, overheard bedside report, missing managed devices,
  public whiteboards, social media, public-health disclosure, record amendment, or access deadlines;
- workload/equipment blame during active care, public criticism, family-update ownership, teaching
  timing, unsafe-order escalation, two-challenge/DESC recall, float competency, mobility disputes,
  handoff refusal, post-event feedback, interpreter disputes, or nursing-versus-laboratory blame;
- generic SBAR/ISBAR, missing drain data, accessibility/language accommodations, ostomy/wound-device
  competency, heart-failure barriers, transport, generic resource lists, premature discharge,
  pending pathology, warm-handoff naming, medication-list mismatch, long-acting-injection timing,
  dialysis relocation, or school seizure planning;
- dementia/Parkinson caregiver burden, generic respite advice, or a caregiver who is available but
  simply declines training; these caregiver rows must test whether the plan is feasible and verified;
- START/SALT triage, chemical/radiological/biological events, structural fire, flooding, active
  shooter, electrical failure, ransomware downtime, mass-casualty identity tracking, or hazardous-drug
  spills;
- needlesticks, C. difficile/norovirus hygiene, latex-food cross-reactivity, central-line care,
  handwashing duration, multidose-vial re-entry, respiratory etiquette, linen, single-dose-vial reuse,
  medication-preparation sharps, shared glucose meters, or broken-specimen cleanup;
- generic ABG classification, salicylate arithmetic, COPD compensation, opioid depression, residual
  neuromuscular blockade, ileostomy bicarbonate loss, perioperative fire/hypothermia/compartment
  syndrome, dialysis disequilibrium/air embolism/steal syndrome, routine fetal categories,
  deceleration recognition drills, cord prolapse, epidural hypotension, tachysystole, sinusoidal
  pattern, maternal artifact, or infection-related fetal tachycardia.

These boundaries cover known nearby clusters, not every semantic collision in the bank. A downstream
similarity and human collision sweep remains required.

## Item-construction rules

- **Closed world:** Put every facility-only workflow, classification, reference interval, formula,
  threshold, and sequence needed to resolve the item in the stem. A source does not excuse hidden
  local policy.
- **One clinical judgment:** Each item has one dominant load-bearing decision. Do not append an
  unrelated teaching point to manufacture difficulty.
- **Format integrity:** Highlights select meaningful cues/actions. Matrices have mutually clear
  columns and independent rows. Each dropdown blank is independently resolvable. Bowties have one
  condition, exactly two actions, and exactly two monitoring/evaluation selections within one model.
  Ordered responses test an actual dependency and must not include interchangeable steps.
- **Plausible distractors:** No jokes, category errors, reckless caricatures, grammar giveaways, or
  distractors contradicted by wording rather than nursing judgment.
- **Translation parity:** Provide complete English/Simplified-Chinese parity for every learner-facing
  field, including strategy, glossary, tokens, segments, rows, columns, and dropdown content. Keep
  regulatory terms, formulas, units, and identifiers technically exact.
- **Rationale coverage:** Provide `rationale.byChoice` for every resolvable choice reference: every
  highlight segment, matrix decision, dropdown option, bowtie token, and ordered-response step.
- **Citation placement:** Put detailed citations and subsection identifiers in `meta.source`, not in
  option text or `rationale.byChoice`; parenthetical subsection labels can be mistaken for choice
  references by the audit.
- **No visuals or cases:** Do not add `visual`, structured measurements, `rationale.visuals`, a case
  container, or an edit to an existing case-study part.

## ID convention

Use:

`gpt_balance6a_<generation-date:YYYY_MM_DD>_<itemtype-abbrev>_<topic-slug>_<2-digit-seq>`

Example: `gpt_balance6a_2026_07_16_hl_conflict_resolution_03`.

Use one globally unique top-level ID per item and unique local IDs for every option, segment, row,
column, dropdown, and bowtie token.

## Producer preflight before returning JSON

Confirm all of the following:

- exactly 18 questions and `meta.count` agrees;
- `meta.schemaVersion` is exactly `2.0`;
- rows 1–18 match assigned category, canonical topic, item type, difficulty, premise, and source;
- totals are 11/4/3 categories, 6/4/3/3/2 formats, and 7/8/3 difficulties;
- every load-bearing rule is supported by the pinned subsection in `meta.source`;
- every learner-facing string has EN/ZH parity and every choice reference has a rationale;
- no visual, case study, fill-in-the-blank, duplicate ID, or Markdown commentary is present.

After generation, the file remains raw and untrusted until normalization, validation, independent
producer-not-checker review, source adjudication, collision review, promotion, consolidation, ledger
entry, and census regeneration are complete under `docs/AGENTS-RUNBOOK.md`.
