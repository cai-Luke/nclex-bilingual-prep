# Producer Commission — Coverage Balance Batch 6B

**Producer:** GPT producer B (`gpt_` lane). **Deliverable:** exactly 18 standalone questions in one
JSON bank object. **No case studies. No visuals. No edits to existing questions.**

This is one independently runnable half of a coordinated 36-item order. The companion 6A packet is
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

`banks/banks-raw/gpt-balance6b-coverage-batch-2026-07-16.json`

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

This 6B packet has exact totals of **11 / 4 / 3 categories**, **6 highlight / 4 bowtie / 3
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
| 1 | Management of Care | Client Advocacy | highlight | medium | During an adult sexual-assault medical forensic examination, the client agrees to medical care and some evidence collection but says, “Stop—I do not want the genital examination or photographs.” Highlight trauma-informed actions that stop those portions, confirm the client's current choices without pressure, explain available options/consequences neutrally, document the scope of consent/declination, and continue desired medical care. Do not condition STI care or other ordinary treatment on completing the forensic examination or reporting to law enforcement. |
| 2 | Management of Care | Client Advocacy | highlight | easy | An alert adult with an intellectual disability asks a chosen supporter to help compare two treatment options but wants to make the decision personally. Highlight actions consistent with supported decision-making: ask what help the client wants, present accessible information, allow the chosen supporter to assist understanding/communication, direct the consent discussion to the client, and document the client's decision. Exclude transferring authority to the supporter or assuming incapacity from the diagnosis. The stem must state that no guardian or contrary legal order applies. |
| 3 | Management of Care | Conflict Resolution | matrix | easy | During a unit scheduling redesign, classify team statements as constructive task-focused conflict or destructive relationship-focused conflict. Constructive rows use observable data, clarify the shared goal, ask for the other view, or propose a testable solution. Destructive rows label motives, attack competence, recruit allies against a person, or refuse to discuss evidence. Keep the dispute operational rather than clinical. |
| 4 | Management of Care | Conflict Resolution | ordered_response | medium | A secure text thread between two disciplines has become sarcastic and ambiguous, and no urgent client danger is present. The stem states the facility's repair sequence: pause the escalating asynchronous exchange; move to a brief synchronous huddle; each person states the concern and relevant facts while the other confirms understanding; agree on one plan, owner, and deadline; send a concise closed-loop written summary. Order those steps. Do not test mnemonic recall. |
| 5 | Management of Care | Confidentiality & HIPAA | dropdown_cloze | easy | A consulting psychiatrist requests separately maintained psychotherapy session notes for treatment. Complete a statement distinguishing those notes from ordinary mental-health information in the medical record: with limited exceptions, disclosure of the separately maintained psychotherapy notes requires the client's valid written authorization even for another provider's treatment. The stem must state that no listed exception applies. |
| 6 | Management of Care | Confidentiality & HIPAA | highlight | easy | A clinic uses a waiting-room sign-in sheet. Highlight entries/safeguards consistent with HIPAA's incidental-disclosure rule: limited identifying information such as name and arrival time, no diagnosis or detailed reason for visit, reasonable positioning/handling safeguards, and calling a client's name without announcing clinical details. Do not claim that all sign-in sheets or name calling are prohibited. |
| 7 | Management of Care | Confidentiality & HIPAA | dropdown_cloze | easy | A hospitalist asks whether authorization is required to send relevant records to the specialist who will treat the same client. Complete the statement that HIPAA permits provider-to-provider disclosure for treatment without the client's authorization and that the minimum-necessary requirement does not apply to disclosures or requests between providers for treatment. Keep this distinct from psychotherapy notes and from optional internal workforce access. |
| 8 | Management of Care | Discharge Planning & Handoff | bowtie | hard | A ventilator-dependent child with a new tracheostomy is scheduled for first discharge home tomorrow. One parent completed routine care but neither caregiver has successfully managed a simulated obstruction/decannulation, backup equipment delivery is unconfirmed, and no awake trained caregiver is available overnight. Identify an unsafe tracheostomy-home transition, select delaying/revising the plan while completing emergency competency and confirming equipment/coverage, and monitor successful emergency simulation plus verified equipment and awake-caregiver coverage. Do not ask for device settings or a state-specific home-nursing entitlement. |
| 9 | Management of Care | Discharge Planning & Handoff | bowtie | medium | A hospitalized client receives maintenance methadone for opioid use disorder and will leave on Friday evening. The listed opioid treatment program has not accepted the handoff, its weekend dosing plan is unknown, and the last verified hospital dose/time have not been transmitted. Identify a threatened interruption in MOUD continuity, select direct OTP acceptance/communication plus transmitting the verified medication and last-dose information under the stated consent/workflow, and monitor a confirmed next dosing encounter plus absence of an unintended medication gap. Do not have the hospital independently prescribe an outpatient methadone supply or invent a universal restart dose. |
| 10 | Management of Care | Caregiver Role Strain & Family Coping | highlight | medium | Two willing adult daughters each believe the other is responsible for their father's evening medication setup and meal check, leaving repeated gaps; the capable client wants both involved. Highlight actions that resolve caregiver-role ambiguity: confirm the client's permission and preferences, meet with the client and both caregivers, name an accepted owner and backup for each task, create one shared closed-loop schedule/log, and verify that each person understands and can perform the assigned role. Exclude blaming either daughter or treating a vague promise to “help when possible” as coverage. |
| 11 | Management of Care | Caregiver Role Strain & Family Coping | matrix | medium | Before home discharge on a feeding pump, a caregiver says they are afraid and demonstrates several incorrect setup/alarm-response steps. Classify team responses as supporting safe caregiver capacity or not: use demonstration/teach-back and retraining; listen to concerns; simplify/adapt materials; reassess competence; revise the plan if competence is not achieved. Unsafe rows include shaming, documenting “noncompliant” without reassessment, giving only a brochure, or discharging because the supply company can answer later. |
| 12 | Reduction of Risk Potential | ABG & Acid-Base Interpretation | dropdown_cloze | hard | A client with diabetic ketoacidosis and repeated vomiting has pH 7.31, PaCO2 27 mm Hg, HCO3 13 mEq/L, Na 140 mEq/L, and Cl 96 mEq/L. Put all formulas and normals in the stem: AG = Na − (Cl + HCO3), normal AG 12; delta AG = measured AG − 12; corrected HCO3 = measured HCO3 + delta AG; expected PaCO2 = 1.5(HCO3) + 8 ± 2. Complete the interpretation: high-anion-gap metabolic acidosis with appropriate respiratory compensation plus a concurrent metabolic alkalosis shown by corrected HCO3 above the supplied normal range. Do not key on pH alone. |
| 13 | Reduction of Risk Potential | Perioperative Care | ordered_response | medium | Before wound closure, the final count is short one radiopaque sponge and a recount does not resolve it. The closed-world stem states the facility sequence: announce the discrepancy and stop closure; recount and search the field, wound, room, linen, and waste; notify the surgeon and complete a methodical wound examination; obtain intraoperative imaging if still unresolved; document the discrepancy and confirmed resolution before the client leaves the operating room. Order those actions. Do not let a “correct” recount erase an earlier unresolved discrepancy without reconciliation. |
| 14 | Reduction of Risk Potential | Procedural Complications & Dialysis | bowtie | hard | During a home peritoneal-dialysis exchange, the transfer set disconnects proximal to an open clamp and the open system is exposed. The client reconnects it and calls immediately; there are no current symptoms. The stem defines this as wet contamination and supplies the program's prophylaxis pathway. Identify wet PD-system contamination with peritonitis risk, select stopping further use/closing the system and contacting the PD team for transfer-set management plus prescribed prophylaxis, and monitor for cloudy effluent/abdominal pain plus completion of the program's follow-up. Do not invent the antibiotic, dose, or duration. |
| 15 | Reduction of Risk Potential | Intrapartum Fetal Monitoring | highlight | medium | Thick meconium is newly noted during labor while the fetal tracing remains normal and maternal observations are stable. Highlight actions consistent with the supplied guideline: characterize/document the meconium, complete a full maternal/fetal risk assessment, explain that meconium can increase risk and discuss continuous CTG monitoring, support the woman's informed choice, and continue reassessment. Exclude declaring an automatic emergency cesarean or ignoring a later tracing change. |
| 16 | Safety and Infection Control | Disaster & Emergency Preparedness | bowtie | medium | The hospital oxygen pipeline pressure falls abruptly while several clients depend on high-flow or ventilator oxygen. The facility utility-failure plan is activated. Identify an oxygen utility failure threatening dependent clients, select switching affected clients to verified backup/portable sources plus incident-command coordination of facilities/vendor response and conservation, and monitor client oxygenation/backup-source function plus cylinder inventory and burn rate. Do not ask the learner to choose an oxygen prescription not supplied in the stem. |
| 17 | Safety and Infection Control | Standard Precautions & Hygiene | highlight | easy | A nurse wearing artificial fingernail extensions is assigned direct care in the ICU. Highlight the finding and corrective actions supported by CDC guidance: artificial extensions are not worn for direct contact with high-risk ICU/OR patients, follow the facility hand-hygiene/nail policy, maintain natural nails no longer than the stated limit, and perform indicated hand hygiene. Do not claim that intact nail polish is universally prohibited when the source does not establish that rule. |
| 18 | Safety and Infection Control | Standard Precautions & Hygiene | matrix | easy | Classify reprocessing requirements for reusable ultrasound probes by contact: intact skin requires cleaning plus low-level disinfection according to manufacturer instructions; mucous membrane or nonintact-skin contact requires cleaning plus at least high-level disinfection; entry into sterile tissue requires sterilization or a validated sterile-device pathway. Include that a probe cover reduces contamination but does not replace required reprocessing. Keep gel selection out of the keyed decision. |

## Source anchors and load-bearing rule

The named source for every row is part of the assignment. `meta.source` must pin the specific section
supporting the keyed rule and include a checkable URL. A topic homepage is insufficient. You may add
another authoritative source for a separate load-bearing claim, but do not replace a precise anchor
below with a broader page.

| # | Required source anchor |
|---|---|
| 1 | U.S. DOJ OVW, *National Protocol for Sexual Assault Medical Forensic Examinations—Adults/Adolescents*, informed-consent and scope-of-examination sections: <https://www.justice.gov/ovw/media/1367191/dl> |
| 2 | HHS Administration for Community Living, supported decision-making definition, chosen supporters, and retained decision authority: <https://acl.gov/programs/consumer-control/supported-decision-making-program> |
| 3–4 | AHRQ TeamSTEPPS conflict/team tools. Pin the exact conflict, huddle, or closed-loop section used; starting points: <https://www.ahrq.gov/teamstepps-program/curriculum/mutual/tools/conflict.html>, <https://www.ahrq.gov/teamstepps-program/curriculum/team/tools/huddle.html>, and <https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/loop.html> |
| 5 | HHS OCR FAQ on disclosing psychotherapy notes through an HIO, including the treatment-purpose authorization rule: <https://www.hhs.gov/hipaa/for-professionals/faq/558/does-hipaa-permit-a-covered-entity-to-disclose-psychotherapy-notes-to-an-hio/index.html> |
| 6 | HHS OCR FAQ on sign-in sheets and calling names with limited information and reasonable safeguards: <https://www.hhs.gov/hipaa/for-professionals/faq/199/may-health-care-providers-use-sign-in-sheets/index.html> |
| 7 | HHS OCR treatment-disclosure and minimum-necessary FAQ: <https://www.hhs.gov/hipaa/for-professionals/faq/208/wont-minium-necessary-restriction-impede-delivery/index.html> and <https://www.hhs.gov/hipaa/for-professionals/faq/treatment-payment-and-health-care-operations-disclosures/index.html> |
| 8 | American Thoracic Society, *Care of Infants and Children with Tracheostomies*, Recommendation 2/Table 2 and the awake-attentive-trained-caregiver recommendation: <https://academic.oup.com/ajrccm/article/211/11/2001/8444168> |
| 9 | SAMHSA, *Advisory: Expanding Access to Methadone Treatment in Hospital Settings*: <https://library.samhsa.gov/product/advisory-expanding-access-methadone-treatment-hospital-settings/pep25-02-007>; SAMHSA *Federal Guidelines for Opioid Treatment Programs*, medication-continuity discussion around pp. 30–31: <https://library.samhsa.gov/sites/default/files/federal-guidelines-opioid-treatment-pep24-02-011.pdf> |
| 10 | AHRQ IDEAL Discharge Planning, including the patient/family as full partners and listening to goals, preferences, observations, and concerns: <https://www.ahrq.gov/patient-safety/patients-families/engagingfamilies/strategy4/index.html>; AHRQ RED guidance on identifying the actual caregivers who will share responsibilities and confirming understanding: <https://www.ahrq.gov/patient-safety/settings/hospital/red/toolkit/redtool3.html> |
| 11 | AHRQ RED guidance on demonstration/teach-back and creating an alternative plan if understanding is not achieved: <https://www.ahrq.gov/patient-safety/settings/hospital/red/toolkit/redtool3a.html>; NICE self-management competency for artificial nutrition: <https://www.nice.org.uk/guidance/qs24/chapter/quality-statement-4-self-management-of-artificial-nutrition-support> |
| 12 | Merck Manual Professional, *Metabolic Acidosis*, delta-gap/corrected-bicarbonate and Winter's-formula discussion: <https://www.merckmanuals.com/professional/nephrology/acid-base-regulation-and-disorders/metabolic-acidosis> |
| 13 | AHRQ PSNet, *Reducing Preventable Patient Harm Due to Retained Surgical Items: The RSI Bundle*, surgical STOP and imaging before closure for unresolved incorrect counts: <https://psnet.ahrq.gov/innovation/reducing-preventable-patient-harm-due-retained-surgical-items-rsi-bundle> |
| 14 | ISPD, *Peritonitis guideline recommendations: 2022 update*, dry-versus-wet contamination and prophylaxis discussion: <https://journals.sagepub.com/doi/10.1177/08968608221080586> |
| 15 | NICE NG229, *Fetal monitoring in labour*, recommendations 1.3.10–1.3.12 on meconium, risk assessment, discussion, and CTG choice: <https://www.nice.org.uk/guidance/ng229/chapter/recommendations> |
| 16 | ASPR TRACIE, *Utility Failures in Health Care Tip Sheet: Oxygen*, pressure loss, backup, conservation, and partner coordination: <https://files.asprtracie.hhs.gov/documents/utility-failure-tip-sheet-oxygen.pdf> |
| 17 | CDC, *Clinical Safety: Hand Hygiene for Healthcare Workers*, fingernail safety section: <https://www.cdc.gov/clean-hands/hcp/clinical-safety/index.html> |
| 18 | CDC, *Recommendations for Disinfection and Sterilization in Healthcare Facilities*, Recommendations 3.a–3.c and 10.b–10.d: <https://www.cdc.gov/infection-control/hcp/disinfection-sterilization/summary-recommendations.html> |

## Collision boundaries

Use each assigned premise affirmatively. Do not replace it with a familiar neighboring scenario. In
particular, do not reuse or lightly reskin:

- capable-client refusal overridden by family, partner coercion around ordinary procedural consent,
  research withdrawal, service animals, low-vision materials, inaccessible examination equipment,
  correctional custody, pain-plan bias, student observers, family interpreters, accent-based
  mistreatment, or skilled-facility choice;
- unverified callers, directory opt-out, voicemail logs, proxy verification, unlocked EHRs, chart
  snooping, personal-device photos, wrong packets, overheard bedside report, missing managed devices,
  public whiteboards, social media, public-health disclosure, record amendment, access deadlines,
  generic minimum-necessary selection, or family access to a chart;
- workload/equipment blame during active care, public criticism, family-update ownership, teaching
  timing, unsafe-order escalation, two-challenge/DESC recall, float competency, mobility disputes,
  handoff refusal, post-event feedback, interpreter disputes, or nursing-versus-laboratory blame;
- generic SBAR/ISBAR, missing drain data, accessibility/language accommodations, ostomy/wound-device
  competency, heart-failure barriers, transport, generic resource lists, premature discharge,
  pending pathology, warm-handoff naming, medication-list mismatch, anticoagulant/INR follow-up,
  long-acting-injection timing, dialysis relocation, or school seizure planning;
- dementia/Parkinson caregiver burden or generic “seek respite” advice; these caregiver rows must test
  sustainable trained coverage or demonstrated competence for a concrete home plan;
- START/SALT triage, chemical/radiological/biological events, structural fire, flooding, active
  shooter, electrical failure, ransomware downtime, mass-casualty identity tracking, or hazardous-drug
  spills;
- needlesticks, C. difficile/norovirus hygiene, latex-food cross-reactivity, central-line care,
  handwashing duration, multidose-vial re-entry, respiratory etiquette, linen, single-dose-vial reuse,
  medication-preparation sharps, shared glucose meters, broken-specimen cleanup, or reusable insulin
  pens;
- generic ABG classification, salicylate arithmetic, COPD compensation, opioid depression, residual
  neuromuscular blockade, ileostomy bicarbonate loss, isolated vomiting alkalosis, perioperative
  fire/hypothermia/compartment syndrome, dialysis disequilibrium/air embolism/steal syndrome or cloudy
  effluent, routine fetal categories, deceleration recognition drills, cord prolapse, epidural
  hypotension, tachysystole, sinusoidal pattern, maternal artifact, or infection-related tachycardia.

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

`gpt_balance6b_<generation-date:YYYY_MM_DD>_<itemtype-abbrev>_<topic-slug>_<2-digit-seq>`

Example: `gpt_balance6b_2026_07_16_bt_discharge_handoff_08`.

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
