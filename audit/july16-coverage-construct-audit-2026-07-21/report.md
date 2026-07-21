# July 15–16 GPT Coverage-Batch Construct Audit

Date: 2026-07-21
Status: **COMPLETE_NO_OPEN_DISPOSITIONS**

## Executive finding

The 108-item outer ring is not broadly clinically corrupt. The adverse findings cluster in question construction:

- **16 noncompetitive bowties** turn an already-established problem into a decorative 1/2/2 differential;
- **10 ordered-response items** state their own exact sequence in the stem and then ask the learner to reproduce it;
- **8 repairable items** disclose answer-bearing policies or protocols in the stem;
- **5 fill-in items** test low-value labels or a supplied classification;
- **1 dropdown** has a mechanically dependent second blank; and
- **1 dropdown** adds an overly specialist delta-gap/corrected-bicarbonate construct.

Primary result: **67 PASS / 8 FIX / 33 RETIRE**. Of the 33 retirements, **5 are without replacement** and **28 require replacement only if coverage analysis justifies it**. The eight FIX items are repair/adjudication candidates, not permanent-retirement recommendations.

The independent non-GPT checker materially agreed with **all 41 primary adverse findings**. It raised **9 additional owner-facing disagreements** on primary PASS items: five dropdown repairs and four fill-in retirements. It matched 71 of 72 live keys; the sole mismatch was the synonymous response “escalation pathway” versus keyed “chain of command,” which supports the item's scoring-vulnerability retirement rather than exposing a clinical error.

Luke accepted every primary recommendation and all nine checker additions on 2026-07-21. The final owner disposition is **58 KEEP / 13 FIX / 37 RETIRE**. Of the retirements, **5 require no replacement** and **32 were replacement-conditional on coverage analysis**. All 13 FIX items were removed from delivery and preserved in a repair quarantine rather than permanently retired.

The accepted disposition was subsequently implemented in `banks/gpt-canonical.json`, reducing it from 771 to 721 questions. The 37 retired payloads and 13 repair-quarantined payloads are recoverable under `Archive/gpt-july16-construct-dispositions-2026-07-21/`. Coverage analysis found no zeroed category-topic pair and no operational 50-question category shortfall, so no immediate replacement generation was justified.

## Final owner ruling

Accepted on 2026-07-21:

- all 33 primary RETIRE recommendations;
- all 8 primary FIX recommendations;
- all 5 checker-added bounded dropdown repairs; and
- all 4 checker-added fill-in retirements.

Final disposition totals:

| Owner disposition | Count |
|---|---:|
| BOUNDED_TEXT_REPAIR | 13 |
| KEEP | 58 |
| RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | 32 |
| RETIRE_WITHOUT_REPLACEMENT | 5 |

The completed coverage analysis resolved all 32 conditional-replacement decisions as `NO_IMMEDIATE_REPLACEMENT_GENERATION`. Future content planning may still address the bank's ordinary format/topic priorities, but those are not one-for-one obligations created by these retirements.

## Frozen population

- Bank: `banks/gpt-canonical.json`
- Frozen bank SHA-256: `61664a6bef854ec8d7a3a0113779a4773135724aabfdec65b970b7ac6464c5d2`
- Population: 108 unique current top-level questions, exactly 18 in each of six anchored families.
- Population SHA-256: `42e00e39be580597a0d54ac1d7ac2e7b2be638dfb95343c3d2e870bc8180b3ee`
- Determinism: rerunning `build-population.ts` produced byte-identical output.
- Item types: bowtie 29, dropdown_cloze 16, fill_in_blank 9, highlight 31, matrix 11, ordered_response 10, select_all 2.
- Difficulty: easy 41, hard 18, medium 49.

## Primary results by family

| provenanceFamily | FIX | PASS | RETIRE |
|---|---:|---:|---:|
| COVERAGE_BALANCE_BATCH_2 | 0 | 9 | 9 |
| COVERAGE_BALANCE_BATCH_3 | 1 | 12 | 5 |
| COVERAGE_BALANCE_BATCH_5 | 3 | 11 | 4 |
| COVERAGE_BALANCE_BATCH_6A | 1 | 12 | 5 |
| COVERAGE_BALANCE_BATCH_6B | 2 | 10 | 6 |
| MOC_SIC_COVERAGE_BATCH | 1 | 13 | 4 |

## Primary results by item type

| itemType | FIX | PASS | RETIRE |
|---|---:|---:|---:|
| bowtie | 2 | 11 | 16 |
| dropdown_cloze | 1 | 13 | 2 |
| fill_in_blank | 0 | 4 | 5 |
| highlight | 3 | 28 | 0 |
| matrix | 2 | 9 | 0 |
| ordered_response | 0 | 0 | 10 |
| select_all | 0 | 2 | 0 |

## Primary disposition totals

| Disposition | Count |
|---|---:|
| BOUNDED_TEXT_REPAIR | 8 |
| KEEP | 67 |
| RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | 28 |
| RETIRE_WITHOUT_REPLACEMENT | 5 |

## Checker lane

- Deterministic checker population: 72 items.
- Inclusion: all 10 ordered responses, all 16 dropdowns, all 9 fill-ins, all other primary adverse items, and a deterministic 20% SHA-256 sample of remaining primary passes.
- Scoped item-specific historical repair records found: none; the known-repaired gate was therefore empty rather than silently substituted.
- Blind checker: Antigravity CLI, Gemini 3.1 Pro High; primary verdict, key, rationale, strategy, and source withheld.
- Reveal checker: Gemini CLI, Gemini 3.6 Flash; frozen blind result preserved, then compared with live key/rationale/source and primary finding.
- Checker result: FIX 13 / PASS 22 / RETIRE 37.
- Agreement: AGREE 63 / DISAGREE 9.
- Key comparison: DISAGREES 1 / MATCH 71.

## Source and bilingual checks

- Source metadata was revealed only after blind derivation. All ordered responses, dropdowns, and adverse items received a source comparison.
- The audit enumerated 61 unique cited URLs across 54 required source-check rows. Automated access reached 45; 16 returned access barriers, stale paths, or timeout. Access results are preserved in `source-access.jsonl`; an access failure was not treated as proof that a claim was false.
- Representative authoritative text was opened directly for HIPAA timing/minimum-necessary rules, CDC injection safety, OSHA respiratory protection, ASRA LAST response, NICE fetal monitoring, and ISPD peritoneal-dialysis guidance. These checks supported the factual content while leaving the construct defects intact.
- Primary bilingual comparison found `MATERIAL_MATCH` for all 108 items. Neither checker lane identified a material English/Chinese divergence.

## Primary adverse findings

| # | ID | Type | Verdict | Primary class | Disposition | Evidence-backed reason |
|---:|---|---|---|---|---|---|
| 1 | `gpt_balance2_2026_07_15_bt_client_advocacy_01` | bowtie | RETIRE | WEAK_OR_NONCOMPETING_DIFFERENTIAL | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The record explicitly establishes untreated severe pain and excludes both alternative conditions: no opioid has been given, respiratory depression is absent, and pain remains 9/10. The useful advocacy action is stretched into a 1/2/2 bowtie with no competing condition. |
| 4 | `gpt_balance2_2026_07_15_or_confidentiality_hipaa_04` | ordered_response | RETIRE | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The stem states the required total sequence and the response options reproduce it. The key is supported, but ordering disclosed steps measures transcription rather than sequencing judgment. |
| 5 | `gpt_balance2_2026_07_15_fib_conflict_resolution_05` | fill_in_blank | RETIRE | OTHER_CONFIRMED_CONSTRUCT_DEFECT | RETIRE_WITHOUT_REPLACEMENT | The response demand is the exact label “Suggest” after the stem supplies its defining features. The live key is correct, but the item measures closed-vocabulary recall rather than a consequential nursing decision. |
| 7 | `gpt_balance2_2026_07_15_bt_discharge_planning_handoff_07` | bowtie | RETIRE | WEAK_OR_NONCOMPETING_DIFFERENTIAL | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The stem directly states that pending-result ownership and client notification are absent. Routine completed follow-up and a medication discrepancy do not compete with that condition; the item is an ordinary discharge-safety action question expanded into a bowtie. |
| 8 | `gpt_balance2_2026_07_15_fib_discharge_planning_handoff_08` | fill_in_blank | RETIRE | OTHER_CONFIRMED_CONSTRUCT_DEFECT | RETIRE_WITHOUT_REPLACEMENT | The response demand is the exact label “warm handoff” after the stem supplies its defining features. The live key is correct, but the item measures closed-vocabulary recall rather than a consequential nursing decision. |
| 10 | `gpt_balance2_2026_07_15_or_psychotropic_medications_10` | ordered_response | RETIRE | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The stem states the required total sequence and the response options reproduce it. The key is supported, but ordering disclosed steps measures transcription rather than sequencing judgment. |
| 13 | `gpt_balance2_2026_07_15_bt_disaster_emergency_preparedness_13` | bowtie | RETIRE | WEAK_OR_NONCOMPETING_DIFFERENTIAL | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The generator failure explicitly identifies an internal utility emergency. Infectious outbreak and external mass-casualty surge are unrelated alternatives, while their associated action and monitoring distractors are equally noncompeting. |
| 16 | `gpt_balance2_2026_07_15_or_intrapartum_fetal_monitoring_16` | ordered_response | RETIRE | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The stem states the required total sequence and the response options reproduce it. The key is supported, but ordering disclosed steps measures transcription rather than sequencing judgment. |
| 17 | `gpt_balance2_2026_07_15_fib_intrapartum_fetal_monitoring_17` | fill_in_blank | RETIRE | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | RETIRE_WITHOUT_REPLACEMENT | The stem supplies the defining rule for the classification and asks only for the exact category label. The answer is correct but no fetal-monitoring interpretation remains for the learner to perform. |
| 21 | `gpt_balance3_2026_07_16_or_client_advocacy_03` | ordered_response | RETIRE | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The stem states the required total sequence and the response options reproduce it. The key is supported, but ordering disclosed steps measures transcription rather than sequencing judgment. |
| 24 | `gpt_balance3_2026_07_16_bt_conflict_resolution_06` | bowtie | RETIRE | WEAK_OR_NONCOMPETING_DIFFERENTIAL | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The stem names an unresolved personal dispute and a clinically incomplete, unaccepted handoff. The other condition labels are contradicted rather than plausible alternatives, and the actions/parameters simply restate safe handoff closure. |
| 28 | `gpt_balance3_2026_07_16_or_anticoagulant_therapy_10` | ordered_response | RETIRE | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The stem states the required total sequence and the response options reproduce it. The key is supported, but ordering disclosed steps measures transcription rather than sequencing judgment. |
| 31 | `gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13` | highlight | FIX | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | BOUNDED_TEXT_REPAIR | Every keyed highlight action is enumerated in the preceding plan sentence and then repeated nearly verbatim in the selectable record. Deleting the enumeration would restore an independent downtime-safety judgment without changing the key. |
| 32 | `gpt_balance3_2026_07_16_bt_ppe_sterile_technique_14` | bowtie | RETIRE | WEAK_OR_NONCOMPETING_DIFFERENTIAL | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The stem already classifies the event as a hazardous-drug spill. Infectious isolation breach and nonhazardous IV leakage do not compete, and several response distractors are plainly unsafe. |
| 34 | `gpt_balance3_2026_07_16_bt_perioperative_care_16` | bowtie | RETIRE | WEAK_OR_NONCOMPETING_DIFFERENTIAL | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | Measured hypothermia with shivering directly resolves the condition. Expected normothermia and malignant hyperthermia are opposites rather than competing interpretations; the action and parameter sets add obvious unrelated distractors. |
| 40 | `gpt_mocsic_2026_07_15_fb_conflict_resolution_04` | fill_in_blank | RETIRE | OTHER_CONFIRMED_CONSTRUCT_DEFECT | RETIRE_WITHOUT_REPLACEMENT | The response demand is the exact label “chain of command” after the stem supplies its defining features. The live key is correct, but the item measures closed-vocabulary recall rather than a consequential nursing decision. |
| 44 | `gpt_mocsic_2026_07_15_or_confidentiality_hipaa_08` | ordered_response | RETIRE | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The stem states the required total sequence and the response options reproduce it. The key is supported, but ordering disclosed steps measures transcription rather than sequencing judgment. |
| 49 | `gpt_mocsic_2026_07_15_bt_standard_precautions_hygiene_13` | bowtie | RETIRE | WEAK_OR_NONCOMPETING_DIFFERENTIAL | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | Unsafe re-entry directly establishes possible vial contamination. Refrigeration potency and routine medication waste do not compete with the exposure event, so the bowtie condition zone is decorative. |
| 53 | `gpt_mocsic_2026_07_15_fb_disaster_emergency_preparedness_17` | fill_in_blank | RETIRE | OTHER_CONFIRMED_CONSTRUCT_DEFECT | RETIRE_WITHOUT_REPLACEMENT | The response demand is the exact label “vertical evacuation” after the stem supplies its defining features. The live key is correct, but the item measures closed-vocabulary recall rather than a consequential nursing decision. |
| 54 | `gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18` | dropdown_cloze | FIX | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | BOUNDED_TEXT_REPAIR | Both dropdown answers are supplied verbatim in the two-sentence stem before the learner completes the same before/after statement. |
| 56 | `gpt_balance5_2026_07_16_mx_client_advocacy_02` | matrix | FIX | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | BOUNDED_TEXT_REPAIR | The stem enumerates the ADA rule set and the matrix rows then restate each permitted or prohibited behavior. The current task is rule transcription rather than independent advocacy judgment. |
| 58 | `gpt_balance5_2026_07_16_bt_conflict_resolution_04` | bowtie | RETIRE | WEAK_OR_NONCOMPETING_DIFFERENTIAL | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The record directly establishes an interdepartmental process conflict. Client refusal is absent and acute hyperkalemia is explicitly unconfirmed because the specimens are hemolyzed; the condition alternatives do not compete. |
| 59 | `gpt_balance5_2026_07_16_dc_confidentiality_hipaa_05` | dropdown_cloze | RETIRE | MECHANICAL_CLOZE_DEPENDENCY | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | Once the first blank establishes that staff must not confirm presence or location, the second blank merely renames the same opt-out obligation as following the directory restriction. It contributes no independent inference. |
| 61 | `gpt_balance5_2026_07_16_bt_discharge_handoff_07` | bowtie | RETIRE | WEAK_OR_NONCOMPETING_DIFFERENTIAL | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The stem explicitly supplies every missing transition element. A fully established schedule and treatment refusal are contradicted, so condition selection adds no differential reasoning. |
| 67 | `gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13` | highlight | FIX | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | BOUNDED_TEXT_REPAIR | The plan sentence lists all four keyed actions, which the highlight record repeats nearly verbatim. |
| 68 | `gpt_balance5_2026_07_16_bt_standard_precautions_hygiene_14` | bowtie | RETIRE | WEAK_OR_NONCOMPETING_DIFFERENTIAL | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The exposure and required response are preclassified in the stem. A fourth-client dosing error and expected safe use are unrelated or contradicted alternatives. |
| 69 | `gpt_balance5_2026_07_16_mx_standard_precautions_hygiene_15` | matrix | FIX | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | BOUNDED_TEXT_REPAIR | The stem recites every keyed cleanup step before the matrix rows reproduce those same steps. |
| 76 | `gpt_balance6a_2026_07_16_bt_conflict_resolution_04` | bowtie | RETIRE | WEAK_OR_NONCOMPETING_DIFFERENTIAL | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The audit finding directly names the process defect. Supply shortage, equipment knowledge deficit, and an active emergency are not supported by the record; the bowtie therefore has no condition differential. |
| 79 | `gpt_balance6a_2026_07_16_bt_discharge_planning_handoff_07` | bowtie | RETIRE | WEAK_OR_NONCOMPETING_DIFFERENTIAL | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The stem explicitly states an unowned OPAT transition while also confirming timely supply delivery. Refusal, allergy, and delayed supplies are unsupported, leaving one obvious condition and an ordinary handoff-closure task. |
| 82 | `gpt_balance6a_2026_07_16_bt_caregiver_role_strain_family_coping_10` | bowtie | RETIRE | WEAK_OR_NONCOMPETING_DIFFERENTIAL | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The caregiver directly states a physical-capacity mismatch. Intentional delay, no rehabilitation need, and refusal of all participation are contradicted or stigmatizing nonalternatives. |
| 85 | `gpt_balance6a_2026_07_16_bt_perioperative_care_13` | bowtie | FIX | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | BOUNDED_TEXT_REPAIR | The clinical cues can support an independent LAST diagnosis, but the stem then names the LAST protocol and supplies both keyed actions before the bowtie. Removing that protocol recital preserves a strong emergency construct. |
| 86 | `gpt_balance6a_2026_07_16_or_procedural_complications_dialysis_14` | ordered_response | RETIRE | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The stem states the required total sequence and the response options reproduce it. The key is supported, but ordering disclosed steps measures transcription rather than sequencing judgment. |
| 89 | `gpt_balance6a_2026_07_16_or_ppe_sterile_technique_17` | ordered_response | RETIRE | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The stem states the required total sequence and the response options reproduce it. The key is supported, but ordering disclosed steps measures transcription rather than sequencing judgment. |
| 94 | `gpt_balance6b_2026_07_16_or_conflict_resolution_04` | ordered_response | RETIRE | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The stem states the required total sequence and the response options reproduce it. The key is supported, but ordering disclosed steps measures transcription rather than sequencing judgment. |
| 98 | `gpt_balance6b_2026_07_16_bt_discharge_handoff_08` | bowtie | RETIRE | WEAK_OR_NONCOMPETING_DIFFERENTIAL | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The stem lists three explicit readiness failures. Ventilator intolerance has no supporting findings and routine readiness is contradicted, so the useful transition actions are stretched into a noncompetitive bowtie. |
| 99 | `gpt_balance6b_2026_07_16_bt_discharge_handoff_09` | bowtie | RETIRE | WEAK_OR_NONCOMPETING_DIFFERENTIAL | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The stem directly establishes threatened methadone-continuity interruption. Duplicate dosing is not confirmed and expected treatment completion is false; the remaining response is a straightforward closed-loop handoff question. |
| 102 | `gpt_balance6b_2026_07_16_dc_abg_acid_base_12` | dropdown_cloze | RETIRE | NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The first two blanks use familiar anion-gap and compensation calculations, but the third requires delta-gap/corrected-bicarbonate analysis to diagnose a second metabolic disorder. That specialist acid-base construct exceeds useful NCLEX-RN depth despite a mathematically correct key. |
| 103 | `gpt_balance6b_2026_07_16_or_perioperative_care_13` | ordered_response | RETIRE | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The stem states the required total sequence and the response options reproduce it. The key is supported, but ordering disclosed steps measures transcription rather than sequencing judgment. |
| 104 | `gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14` | bowtie | FIX | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | BOUNDED_TEXT_REPAIR | The stem names the keyed condition and then recites both keyed actions and the follow-up domain. Removing the answer-bearing program directive would leave a source-grounded PD contamination judgment. |
| 106 | `gpt_balance6b_2026_07_16_bt_disaster_emergency_preparedness_16` | bowtie | RETIRE | WEAK_OR_NONCOMPETING_DIFFERENTIAL | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | The utility failure is explicitly named and activated. Pulse-oximeter failure and routine demand reduction do not compete, while the correct actions follow directly from the declared emergency. |
| 107 | `gpt_balance6b_2026_07_16_hl_standard_precautions_hygiene_17` | highlight | FIX | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | BOUNDED_TEXT_REPAIR | The policy sentence gives the central finding and corrective limits, and the highlight record repeats them as keyed selections. Removing the exact rule recital would restore independent infection-control knowledge. |

## Preserved primary/checker disagreements

| # | ID | Primary | Checker | Checker class | Checker disposition | Disagreement |
|---:|---|---|---|---|---|---|
| 2 | `gpt_balance2_2026_07_15_dc_client_advocacy_02` | PASS | FIX | MECHANICAL_CLOZE_DEPENDENCY | BOUNDED_TEXT_REPAIR | The primary rated this a PASS, but the blind audit correctly identified that Blank 2 options are absurdly noncompeting (e.g., 'staff convenience during scheduling' vs. 'personal privacy'), which makes the blank a mechanical completion rather than an independent clinical inference. Bounded text repair to revise Blank 2 options will resolve this and satisfy the strict gate. |
| 22 | `gpt_balance3_2026_07_16_fib_confidentiality_hipaa_04` | PASS | RETIRE | NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | Checker retires due to trivial rote recall of an administrative statutory deadline (30 days), which fails the strict NCLEX fill-in-the-blank construct gate against trivial label/acronym recall; primary passed the item. |
| 26 | `gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08` | PASS | FIX | MECHANICAL_CLOZE_DEPENDENCY | BOUNDED_TEXT_REPAIR | The primary auditor passed this item, but the blind audit correctly identified that the dropdown options lack plausible clinical competition (Blank 1 uses crude qualifiers like 'only', and Blank 2 includes an absurd administrative date), reducing the question to a mechanical selection rather than testing independent nursing inferences. |
| 29 | `gpt_balance3_2026_07_16_dc_psychotropic_medications_11` | PASS | FIX | MECHANICAL_CLOZE_DEPENDENCY | BOUNDED_TEXT_REPAIR | The primary auditor passed this item, but the blind audit correctly identified that the distractors across all three dropdowns (e.g., serum copper, pupil size, hearing acuity) are absurd noncompeting options, violating the requirement that dropdown blanks must test independent clinical inference. |
| 33 | `gpt_balance3_2026_07_16_fib_standard_precautions_hygiene_15` | PASS | RETIRE | ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | Checker retires due to trivial answer disclosure ('single-dose' -> 1) and invalid non-math fill-in-the-blank format; primary passed as valid construct. |
| 45 | `gpt_mocsic_2026_07_15_fb_confidentiality_hipaa_09` | PASS | RETIRE | OTHER_CONFIRMED_CONSTRUCT_DEFECT | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | Checker retires due to invalid non-math fill-in-the-blank format and scoring ambiguity across synonyms; primary passed as valid construct. |
| 46 | `gpt_mocsic_2026_07_15_fb_ppe_sterile_technique_10` | PASS | RETIRE | OTHER_CONFIRMED_CONSTRUCT_DEFECT | RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED | Checker disagrees with primary PASS. The item requires rote recall of a specific safety label ('user seal check') in a fill-in-the-blank format, which violates the strict construct gate against trivial label recall and introduces open-ended grading ambiguity. |
| 95 | `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05` | PASS | FIX | WEAK_OR_NONCOMPETING_DIFFERENTIAL | BOUNDED_TEXT_REPAIR | The primary passed the item, but Blank 2 contains noncompeting administrative distractors (appointment scheduling, directory management) that do not require clinical knowledge to eliminate, rendering it a mechanical completion. |
| 97 | `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07` | PASS | FIX | WEAK_OR_NONCOMPETING_DIFFERENTIAL | BOUNDED_TEXT_REPAIR | The primary passed the item, but Blank 2 contains an absurd fictional distractor (one-page limit) that fails to provide a plausible regulatory alternative, resulting in a mechanical selection. |

## Key-comparison exception

- `gpt_mocsic_2026_07_15_fb_conflict_resolution_04`: blind checker derived “escalation pathway”; live key is “chain of command.” The checker still agreed with RETIRE/OTHER_CONFIRMED_CONSTRUCT_DEFECT/RETIRE_WITHOUT_REPLACEMENT because synonymous free-text answers demonstrate the exact-label scoring defect.

## Verification and boundary proof

- Branch/head at audit start and close: `main` / `c0101f55f972863bd38ef0851440f84c055e1b0b`; upstream divergence `0 0`.
- Six primary batch files contain 18 rows each; no batch exceeds the 18-item limit.
- Twelve blind checker batches and twelve reveal batches reconcile to 72 unique checker rows.
- Primary artifact: 108 rows and 108 unique IDs.
- Checker artifact: 72 rows and 72 unique IDs, in checker-population order.
- Starting and ending bundled-bank SHA-256 values for the evidence-collection phase were identical:

```text
burn-canonical.json 5244b8d37daa49adbd1fbed7991f4ede52ded8ce710e26821841ef5e2ce3719f
capnography-canonical.json 36d72a89405fe4400f27b3b8969cdbe1c51f3217151f8b2592b7f877d636f20c
claude-canonical.json b59035ecb717fd279fb9278e3ae678c1b420a6a896b9bf6ff638614f6233b5ce
device-canonical.json 83d5a6ac7219524f4c528265291cbee2ed5b2f17c13fbeb3649342bae2e4aac5
gemini-canonical.json 8259ffb6b12c5b3ba267566b8247207ec4fc573d536d9f78fafd5d18655b63c3
gpt-canonical.json 61664a6bef854ec8d7a3a0113779a4773135724aabfdec65b970b7ac6464c5d2
hard-cases-canonical.json 438c176897a41d3b7f212435e5945bd524c3f0ba5a62931eb5e85843c93d8730
io-canonical.json 2ce6488e65049ba00cd9dccf889a042e0a624f224387382d564d282e147b2645
lab-canonical.json 1038cb68f6b91f6a2c981562d97ad9e16179db9b1332c75725fd538595c44b05
mar-canonical.json f12c03a28ff5b52411843f84bc942b4ca5667e989194357ed2d60a394f17641e
medlabel-canonical.json cc3bd0053516fc7ea4b23e814e46f186e6d2dbf40888fa713a862c07ea2b3993
visual-canonical.json e42e2a3fa6aa349a61279e6988e250e65c2b752a6f36d33806a2671e0af0f9e4
vitals-canonical.json 5154e25492bced8e4a49d763f04e25e154389c31e085bf37669651e13d411b9d
```

- Evidence-collection writes were beneath `audit/july16-coverage-construct-audit-2026-07-21/`; the later owner-authorized implementation also changed the canonical bank, generated census/coverage artifacts, recorded governance closeout, and wrote the recoverable archive.
- No `/tmp` output was used.
- Concurrent unrelated untracked paths were observed and left untouched.
- Owner acceptance is recorded in `owner-dispositions.jsonl`. Implementation details and post-removal proofs are recorded in `bank-implementation-closeout.md`, `coverage-impact.json`, and `post-removal-verification.json`.

## Artifact manifest

- `WORK-ORDER.md`
- `build-population.ts`, `population.jsonl`
- `build-primary.ts`, `primary-adjudication.jsonl`, `batches/`
- `checker-population.jsonl`, `checker-blind-population.jsonl`
- `run-antigravity-blind.ts`, `build-final-checker-input.ts`, `run-gemini-final.ts`
- `checker-batches/`, `build-checker-adjudication.ts`, `checker-adjudication.jsonl`
- `check-source-access.ts`, `source-access.jsonl`
- `build-owner-dispositions.ts`, `owner-dispositions.jsonl`
- `archive-owner-dispositions.ts`, `build-coverage-impact.ts`, `capture-pre-removal-hashes.ts`, `verify-post-removal.ts`
- `coverage-impact.json`, `coverage-impact.md`, `pre-removal-question-hashes.json`, `post-removal-verification.json`
- `bank-implementation-closeout.md`
- `build-report.ts`, `report.md`
