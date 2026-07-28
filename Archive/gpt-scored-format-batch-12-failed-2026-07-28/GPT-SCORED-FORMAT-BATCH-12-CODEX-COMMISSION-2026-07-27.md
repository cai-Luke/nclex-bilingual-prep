# GPT Scored-Format Batch 12 — Codex Producer Commission

**Date:** 2026-07-27  
**Status:** READY FOR COLLISION PREFLIGHT; JSON AUTHORING IS BLOCKED UNTIL THE ROSTER IS CLEARED  
**Producer:** Codex / GPT-5.6  
**Independent checker:** Deferred to Claude after token reset  
**Scope:** Raw content generation only; no canonical edits, promotion, consolidation, ledger, census, or history updates

## 1. Objective

Develop up to 18 new bilingual standalone NCLEX-RN scored questions that improve the current scored-leaf format and topic mix without creating another broad category-balance batch.

The current committed census reports no under-served NCLEX category, but the following scored formats remain below the equal-average target: `bowtie`, `highlight`, `fill_in_blank`, `ordered_response`, and `dropdown_cloze`. The prompt parameters also identify several comparatively thin topic lanes. This commission therefore targets those formats and topics directly.

The raw gate is a mechanical candidate-set gate, not a clinical-quality or semantic-originality verdict. A candidate that validates and passes `gate:raw` can still be clinically weak, interaction-mismatched, artificially sequenced, or materially duplicative. This commission therefore uses two separate approvals: first the construct must pass collision and interaction-fit preflight; only then may JSON be authored. Passing the raw gate never cures a failed content review.

## 2. Read order and live-disk authority

Before authoring, read:

1. `AGENTS.md`
2. `docs/AGENTS-RUNBOOK.md`
3. `PROJECT-HISTORY.md`
4. `NCLEX-Question-Schema.md`
5. `BANK-CENSUS.md`
6. `BANK-REVIEW-LEDGER.md`
7. `src/types.ts`
8. `src/schema.ts`
9. `src/topics.ts`
10. `lib/canonical-routing.ts`
11. `scripts/raw-gate.ts` and the current `gate:raw` package entrypoint

The repository is authoritative. If this commission conflicts with current code or schema, stop and report the conflict rather than guessing.

## 3. Two-stage delivery shape

### Stage A — mandatory preflight; no JSON

Before creating any bank file, return a preflight roster for every candidate row. For each row, record:

- the exact tested decision, not merely the topic or diagnosis;
- the closest comparator ID found in top-level banks, embedded case-study leaves, and live raw drafts;
- the material semantic difference from that comparator;
- an interaction-fit proof using the item-specific requirements in Section 6;
- the exact source section expected to support the key;
- one disposition: `CLEAR`, `REPLACE`, or `BLOCK`.

Do not begin Stage B unless the roster contains only `CLEAR` rows. A `REPLACE` row must be re-preflighted as a new construct; a `BLOCK` row is removed. Do not preserve a count by lowering the collision or interaction-fit standard.

### Stage B — raw JSON for cleared rows only

Organize the cleared questions in up to three raw bank files under `banks/banks-raw/`:

- `gpt-format12a-bowtie-highlight-2026-07-27.json`
- `gpt-format12b-highlight-fib-2026-07-27.json`
- `gpt-format12c-ordered-dropdown-2026-07-27.json`

If a group has no cleared rows, do not create an empty file. Use unique question IDs beginning with `gpt_format12a_`, `gpt_format12b_`, or `gpt_format12c_` as appropriate.

Maximum aggregate mix if all candidates clear:

- 4 `bowtie`
- 4 `highlight`
- 4 `fill_in_blank`
- 3 `ordered_response`
- 3 `dropdown_cloze`
- 6 easy / 8 medium / 4 hard
- no visuals
- no case studies
- no `multiple_choice`, `select_all`, or `matrix`

The listed 6 easy / 8 medium / 4 hard mix is a ceiling target, not a quota. The final counts and difficulty totals are whatever remains after fail-closed preflight. Every created file must contain only standalone questions and route to `gpt-canonical.json` under the current canonical-routing contract.

## 4. Candidate manifest

Each row is a construct to test during Stage A, not authorization to author it before collision review. Do not silently replace a blocked row with an unrelated scenario. Use the reserve policy in Section 8.

| Row | ID suffix | Item type | Difficulty | Category | Topic | Required construct and decision |
|---:|---|---|---|---|---|---|
| 1 | `ect_emergence_agitation` | bowtie | medium | Psychosocial Integrity | Electroconvulsive Therapy (ECT) | Distinguish post-ECT emergence agitation with immediate safety risk from expected brief confusion and from prolonged seizure activity; select exactly two complementary nursing actions and exactly two response/safety parameters. Do not reuse the existing ECT recovery/reflex construct. |
| 2 | `sepsis_fluid_responsiveness` | bowtie | hard | Physiological Adaptation | Sepsis & Septic Shock | Use a closed set of pre/post fluid-challenge findings to identify inadequate perfusion with poor fluid responsiveness; select exactly two complementary escalation actions and exactly two monitoring parameters. Do not duplicate generic “give 30 mL/kg” recognition or the existing sepsis response-trend leaves. |
| 3 | `palliative_opioid_neurotoxicity` | bowtie | medium | Basic Care and Comfort | Palliative & Supportive Care | In a comfort-focused client with new renal decline, distinguish opioid-induced neurotoxicity from expected analgesia and disease progression; select exactly two proportionate nursing actions and exactly two monitoring parameters without implying abandonment of comfort goals. Do not reuse the existing palliative dyspnea/toxicity bowties. |
| 4 | `pd_outflow_failure` | bowtie | hard | Reduction of Risk Potential | Procedural Complications & Dialysis | Use competing inflow/outflow, abdominal, effluent, and constipation cues to distinguish mechanical peritoneal-dialysis outflow failure from peritonitis; select exactly two protocol-supported actions and exactly two parameters that test resolution and screen for infection. |
| 5 | `abg_mixed_disorder_cues` | highlight | hard | Reduction of Risk Potential | ABG & Acid-Base Interpretation | Highlight only the supplied findings that establish a mixed acid-base disorder. The passage must provide enough closed-world data for independent derivation and include plausible non-key distractor findings. |
| 6 | `fetal_monitoring_escalation_cues` | highlight | medium | Reduction of Risk Potential | Intrapartum Fetal Monitoring | Highlight the tracing-description and maternal/uterine findings that require intrauterine resuscitation and escalation. Do not narrate the diagnosis in the stem. |
| 7 | `palliative_caregiver_burden_cues` | highlight | easy | Basic Care and Comfort | Palliative & Supportive Care | Highlight only caregiver statements that show unmanaged symptom burden or inability to carry out the current home plan and therefore require interdisciplinary follow-up. Include non-key statements that express emotion or ordinary information needs without independently showing plan failure. |
| 8 | `pediatric_toddler_ingestion_cues` | highlight | easy | Health Promotion and Maintenance | Pediatric & Toddler Safety | Highlight home-history and child findings that indicate a clinically important toxic ingestion requiring urgent evaluation. Avoid generic poisoning-prevention teaching. |
| 9 | `fib_open_equation_easy` | fill_in_blank | easy | Pharmacological and Parenteral Therapies | Dosage Calculations | Propose one clinically useful single-result calculation only after an equation-level bank search shows that the same formula and tested result are not already scored elsewhere. Supply every required conversion or convention in the stem. This row is `BLOCK` if no collision-resistant equation is found. |
| 10 | `fib_open_equation_medium` | fill_in_blank | medium | Reduction of Risk Potential | Laboratory & Diagnostic Tests | Propose one clinically useful laboratory calculation only after an equation-level bank search shows that the same formula and tested result are not already scored elsewhere. Supply the exact formula and reference interpretation in the stem. This row is `BLOCK` if no collision-resistant equation is found. |
| 11 | `reproductive_gestational_age` | fill_in_blank | easy | Health Promotion and Maintenance | Reproductive & Endocrine Health | Calculate gestational age in completed weeks from an explicitly supplied dating basis and encounter date. Make calendar arithmetic unambiguous and avoid reliance on outside conventions not stated in the stem. |
| 12 | `pediatric_maintenance_fluid` | fill_in_blank | easy | Pharmacological and Parenteral Therapies | IV Fluid Calculations | Calculate hourly pediatric maintenance fluid using the supplied 4-2-1 rule. This row clears only if preflight demonstrates a materially different tested result from the existing daily-maintenance calculation; a different weight alone is not sufficient divergence. |
| 13 | `ect_seizure_emergency_sequence` | ordered_response | medium | Psychosocial Integrity | Electroconvulsive Therapy (ECT) | Order the nursing response to a prolonged seizure after ECT. Keep the sequence serial and clinically meaningful; do not force simultaneous notification/documentation steps into artificial order. |
| 14 | `fetal_monitoring_tachysystole_sequence` | ordered_response | hard | Reduction of Risk Potential | Intrapartum Fetal Monitoring | Order the immediate bedside response to oxytocin-associated uterine tachysystole with a nonreassuring fetal pattern. Use only actions whose temporal order is defensible from the supplied protocol/source. |
| 15 | `transfusion_suspected_sepsis_sequence` | ordered_response | medium | Safety and Infection Prevention and Control | Transfusion & Blood Products | Order the response to suspected bacterial contamination during transfusion. Keep blood-culture/specimen handling and notification steps aligned with a specific source or an explicit facility protocol supplied in the stem. |
| 16 | `dropdown_open_three_record` | dropdown_cloze | medium | Physiological Adaptation | Renal & Gastrointestinal Disorders | Propose three separate short patient records that test three independently sourced decisions within one narrow renal or gastrointestinal subtopic. Preflight must show that the records neither repeat an existing three-record cloze nor reveal one another's answers. Do not reuse DKA resolution/transition criteria. |
| 17 | `conflict_resolution_response` | dropdown_cloze | easy | Management of Care | Conflict Resolution | Use three separate short workplace mini-scenarios, one per dropdown, to select the most appropriate assertive communication response. Avoid repeated DESC/CUS wording already common in the bank. |
| 18 | `reproductive_emergency_triage` | dropdown_cloze | medium | Health Promotion and Maintenance | Reproductive & Endocrine Health | Use three separate outpatient symptom-triage records, one per dropdown, to select the appropriate urgency of follow-up for reproductive-health presentations. Each record must contain independent evidence, must not ask for diagnostic localization, and must stay within health-promotion/teaching scope. |

## 5. Source contract

For every item:

- Use authoritative primary or first-party sources: government guidance, current professional guidelines, or official prescribing information.
- Open and read the exact source section supporting the keyed decision.
- Record a precise `meta.source` string with the organization/document and specific section, table, recommendation, or label subsection.
- Do not cite a homepage or search-result summary when a more exact source exists.
- Do not invent a universal protocol where practice is institution-dependent. For facility-dependent sequencing, place the controlling protocol facts in the stem and make the item closed-world.
- Keep source scope aligned with the exact population and clinical state in the item.

## 6. Content and schema requirements

Each question must:

- conform to the current live schema and current schema-version rules;
- use an exact licensed category/topic pair from `src/topics.ts`;
- contain complete English and Simplified Chinese learner-facing surfaces;
- include a specific `rationale.correct` and complete `rationale.byChoice` coverage where the item type supports choice-level references;
- include a concise bilingual test-taking strategy and useful bilingual glossary terms;
- keep author/checker instructions, source-scope notes, closed-world construction notes, and collision notes out of learner-facing text;
- avoid absolute language unless the source genuinely supports it;
- avoid decorative numbers or data that do not contribute to the inference;
- avoid answer-key leakage through diagnosis labels, headings, captions, or mutually dependent blanks/dropdowns;
- preserve the current six-option maximum where applicable.

For `fill_in_blank`, independently recompute the key and align numeric answer, accepted strings, displayed unit, rounding rule, and tolerance. The current grader parses a numeric response; the `unit` field is display metadata and does not enforce that the learner types the unit. Do not write stems or rationales that claim otherwise. Preflight must compare the equation signature—inputs, formula, requested result, and rounding—not just the clinical wrapper.

For `ordered_response`, use 3–6 options. The `correct` array must be a full permutation of the option IDs, grading is all-or-nothing, and the order must be clinically serial rather than an arbitrary ordering of concurrent actions. In preflight, explain why each adjacent pair has a defensible before/after dependency. If two actions can normally occur concurrently, do not force them into separate ranked steps unless an explicit stem protocol controls the sequence.

For `bowtie`, preserve the exact schema key cardinality: one condition, two actions, and two parameters. Before drafting, name all five intended keys and explain why the two actions are non-duplicative and why each parameter evaluates a different necessary dimension. Singular-action constructs do not fit this item type.

For `highlight`, include meaningful near-miss distractor segments and keep every keyed segment independently necessary. Preflight must state the selection rule and show that removing any keyed segment would discard distinct decision-relevant evidence; mere restatements of the same cue do not count as separate keys.

For `dropdown_cloze`, each dropdown must be independently answerable from its own supplied evidence. A multi-record item should put the records in the stem and use a concise cloze response surface. Preflight must provide a three-row evidence-partition table showing which record supports which dropdown and why no answer mechanically constrains another. Do not place every correct option first intentionally; promotion will shuffle, but the raw draft should not exhibit a trivial producer pattern.

## 7. Collision contract

Before drafting each row and again after the complete delivered set is drafted:

- search all bundled top-level banks;
- search embedded case-study leaves;
- search all live raw drafts;
- compare the actual tested decision, equation, cue-response mapping, and priority sequence, not merely surface wording.

A cosmetic reskin of an existing construct is a blocking collision. A new population, diagnosis label, numerical values, setting, or prose wrapper does not create semantic divergence when the learner performs the same equation, cue-to-decision mapping, or priority sequence. Record the nearest comparator ID and explain the material semantic divergence in the producer receipt. These comparator notes belong in the receipt, not learner-facing JSON.

The following previously proposed constructs are already known to collide and must not be restored as substitutions:

- generic post-ECT recovery/reflex bowtie — comparator `gpt_fmtgap_2026_07_14_bt_ect_recovery_03`;
- generic palliative opioid dyspnea/toxicity bowtie — comparator `gpt_deepen_2026_06_23_bcc_09`;
- parenteral-nutrition refeeding bowtie — comparators include `gpt_case_refeeding_syndrome_tpn_01_bowtie` and `gpt_fresh_2026_06_22_pharm_06`;
- delayed hemolytic transfusion reaction cloze/highlight reskin — comparator `gpt_format9c_delayed_hemolytic_reaction`;
- remaining-infusion-time calculation — comparator `dev_infusion_duration_vtbi_01`;
- Winter's-formula expected-PaCO₂ calculation — comparator `gpt_balance5_2026_07_16_dc_abg_acid_base_16`;
- DKA resolution/transition/overlap cloze — comparator `gpt_format8c_dka_resolution_transition`.

## 8. Reserve policy

Use a reserve only when a primary row is `REPLACE` or `BLOCK` because of a material semantic collision, unavailable authoritative support, or unavoidable ambiguity. Every reserve is itself only a preflight candidate and must independently earn `CLEAR`. A reserve should match the blocked row's item type and difficulty when possible, but preserving aggregate count or difficulty never overrides quality.

Available reserves:

1. `bowtie`, medium — BCC / Palliative & Supportive Care: a comfort-plan complication with one condition, two genuinely distinct nursing actions, and two distinct evaluation parameters; it must not reuse opioid dyspnea/toxicity.
2. `bowtie`, hard — RRP / Procedural Complications & Dialysis: another dialysis complication only if it tests a different cue/action/monitoring map from row 4 and all current dialysis bowties.
3. `highlight`, medium — Pharm / Psychotropic Medications: a medication-risk escalation rule only if it does not reuse the existing lithium case or merely collect textbook toxicity signs.
4. `highlight`, easy — HPM / Adult Health & Wellness: outpatient teaching statements that independently cross a supplied escalation threshold, with a rule that produces meaningful near misses.
5. `fill_in_blank`, medium — Pharm / Dosage Calculations: a single-result calculation whose complete equation signature is absent from the bank; changing the medication or numbers does not qualify.
6. `ordered_response`, medium — Safety / PPE & Sterile Technique: a genuinely serial replacement/repreparation pathway only if an explicit source or stem protocol establishes every adjacency.
7. `dropdown_cloze`, hard — PA / Sepsis & Septic Shock: three independent mini-records only if each tests a distinct decision and the set does not repeat current perfusion/lactate/vasopressor clozes.

If a primary is blocked and no reserve clears, deliver fewer than 18 valid questions and report the blocked row. Never fill a seat with weak, ambiguous, interaction-mismatched, or duplicate content merely to preserve count.

## 9. Required mechanical workflow

After Stage A has cleared the roster and Stage B has written the nonempty files:

1. Run raw normalization in dry-run mode on each file.
2. Inspect any proposed normalization; apply only if it is deterministic shape repair and does not change meaning.
3. Run strict validation on each file.
4. Run the prospective raw gate on the complete candidate set using the current CLI and comparison-population contract, for example:
   `npm run gate:raw -- --file banks/banks-raw/<file-a>.json --file banks/banks-raw/<file-b>.json`
5. Correct candidate-local or candidate-set failures within the authorized row construct; do not broaden the commission.
6. Re-run until all delivered files pass the raw gate.

The raw-gate verdict is necessary but not sufficient. After it passes, perform a separate content audit against the Stage A roster and fail any item whose authored JSON drifted from its cleared decision, source scope, interaction-fit proof, or semantic divergence.

Do not run promotion or consolidation. Do not edit top-level canonical banks. Do not update `BANK-REVIEW-LEDGER.md`, `BANK-CENSUS.md`, `PROJECT-HISTORY.md`, or generated census artifacts. A producer-independent checker will later perform the clinical/source/bilingual/collision review and decide whether anything is eligible for promotion.

## 10. Final receipt

Return a concise receipt containing:

- the Stage A roster and final `CLEAR` / `REPLACE` / `BLOCK` disposition for every candidate considered;
- files created and question counts;
- delivered rows and any reserve substitutions or blocked rows;
- exact item-type and difficulty totals;
- normalization results;
- validation results;
- raw-gate command and verdict;
- nearest comparator ID plus semantic divergence for every delivered question;
- the interaction-fit proof for every delivered question;
- source used for every delivered question;
- confirmation that the post-gate content audit found no drift from the cleared roster;
- confirmation that no canonical bank, ledger, census, history, schema, grading, renderer, or application file was changed.

Do not paste the generated JSON into chat. The files on disk are the deliverable.
