# Producer Commission — Scored-Format Batch 8

Date: 2026-07-18

Status: **ready for generation**

Producer: GPT-5.6 Sol (`gpt_` lane)

Scope: 18 standalone, text-only questions in three independently runnable six-item raw files

## 1. Why this is another format order

The authoritative scored-leaf report generated from `INPUT_SHA`
`9bf33b2e56a5919d3b5b42e0cc54894497a6d5a1` reports no category outside the standing tolerance
and no standalone-capacity shortfall for a 50-question session. Do not describe this batch as
category rescue and do not move an item to a different category to improve a histogram.

The post–Batch 7 scored-format counts are:

- `bowtie`: 150;
- `highlight`: 177;
- `fill_in_blank`: 207;
- `ordered_response`: 238; and
- `dropdown_cloze`: 271;

against an equal-average scored-format target of 305.9. The report also names five especially useful
fill-in-the-blank gaps: Psychotropic Medications, Diabetic Ketoacidosis (DKA), Oncology &
Immunotherapy Complications, Electroconvulsive Therapy (ECT), and Reproductive & Endocrine Health.
This order uses the first four and rejects a forced reproductive calculation in favor of stronger
Sleep & Rest and ABG calculations; it addresses Reproductive & Endocrine Health with formats that
fit its clinical decisions naturally.

These are authoring assignments, not permission to produce filler. If an assigned premise cannot
support the named format with an unambiguous key and authoritative source, stop and report that row
as blocked. Do not substitute a familiar topic, silently change its category, or weaken the format.

## 2. Direct-write operating contract

Do **not** return JSON in chat. Use the available write tools to create the three exact files below
directly under `banks/banks-raw/`.

| Sub-batch | Exact contents | Raw filename |
|---|---|---|
| 8A | 6 `fill_in_blank` | `banks/banks-raw/gpt-format8a-fib-2026-07-18.json` |
| 8B | 6 `ordered_response` | `banks/banks-raw/gpt-format8b-ordered-2026-07-18.json` |
| 8C | 2 `bowtie` + 4 `highlight` | `banks/banks-raw/gpt-format8c-bowtie-highlight-2026-07-18.json` |

Before writing, confirm that none of the three target paths already exists. Do not overwrite or
rename an existing draft. Create each bank as one complete valid JSON object; do not leave partial
files, prose notes, Markdown fences, or alternate copies in the raw directory.

After writing each file, run:

```bash
npm run normalize-raw-bank -- banks/banks-raw/<exact-filename>.json
npm run validate-bank -- banks/banks-raw/<exact-filename>.json
```

The normalization command is a dry run. If it proposes changes, review them and use `--write` only
for the deterministic normalizations it owns. Any later structural repair must be a load → mutate →
re-serialize operation or use a repository patch script; never hand-retype JSON structure. Re-run
validation after every repair.

Do not edit any tracked file, canonical bank, existing raw draft, schema, ledger, census, history,
or producer spec. Do not run `promote`, `consolidate`, or any command that treats the draft as
reviewed. Your final response must be only a short receipt listing the three paths, item counts,
normalization/validation results, and any blocked row. Do not paste the questions into the response.

## 3. Deliverable distribution

All 18 questions are standalone. No case studies, question visuals, rationale visuals, changes to
existing questions, or new clinical taxonomy are authorized. Author against the current schema in
`NCLEX-Question-Schema.md`; this commission does not restate field shapes. Use readable globally
unique IDs with the prefix `gpt_format8a_`, `gpt_format8b_`, or `gpt_format8c_` as applicable.

Aggregate distribution:

- Format: 6 fill-in-the-blank / 6 ordered response / 4 highlight / 2 bowtie.
- Category: 5 Reduction of Risk Potential / 4 Physiological Adaptation / 3 Basic Care and Comfort /
  3 Health Promotion and Maintenance / 2 Psychosocial Integrity / 1 Pharmacological and Parenteral
  Therapies.
- Difficulty: 4 easy / 9 medium / 5 hard.

Category assignment follows the tested construct. The distribution is not a category-deficit claim.

## 4. Exact assignment manifest

### Batch 8A — fill-in-the-blank

Every row must have one genuinely useful uncued response. Put the exact formula or scoring excerpt
in the stem when more than simple time arithmetic is involved. State units, time basis, and rounding.
Use `numeric.value`, an explicit unit where applicable, and the narrowest defensible tolerance.

| # | Category | Canonical topic | Difficulty | Mandated assessment target |
|---|---|---|---|---|
| 1 | Pharmacological and Parenteral Therapies | Psychotropic Medications | medium | Clozapine baseline monitoring. Supply the exact ANC equation in the stem and provide WBC, segmented-neutrophil percentage, and band percentage; ask for ANC in cells/µL. The calculation supports the label-required baseline ANC assessment. Do not reuse an already-calculated low ANC, ask for a clozapine dose, or invoke a superseded REMS administrative requirement. |
| 2 | Physiological Adaptation | Diabetic Ketoacidosis (DKA) | medium | A treated adult has two time-stamped glucose values. Ask for the average glucose decline in mg/dL/hr over the stated interval. The stem supplies the arithmetic rule and asks only for the rate; the rationale compares it with the exact current consensus lane. Do not reopen initial-fluid priority, potassium-before-insulin, corrected sodium, anion gap, or DKA/HHS differentiation. |
| 3 | Reduction of Risk Potential | Oncology & Immunotherapy Complications | hard | Post–CAR-T neurologic monitoring. Put the complete 10-point adult ICE scoring excerpt and every response in the stem, then ask for the total ICE score only. Do not infer an ICANS grade from the ICE score alone, prescribe treatment, or reproduce the bundled CAR-T case's client data. |
| 4 | Psychosocial Integrity | Electroconvulsive Therapy (ECT) | easy | The ECT record gives an unambiguous seizure-onset timestamp and seizure-end timestamp. Ask for the documented seizure duration in seconds. Test accurate procedural monitoring only; do not assert that a universal duration proves treatment adequacy, and do not duplicate expected postictal confusion or routine preprocedure care. |
| 5 | Basic Care and Comfort | Sleep & Rest | medium | A seven-night sleep diary supplies total sleep time and time in bed. Put `sleep efficiency = total sleep time ÷ time in bed × 100` in the stem and ask for the percentage rounded to a whole number. Do not turn the item into generic sleep-hygiene recall or diagnose insomnia from one number. |
| 6 | Reduction of Risk Potential | ABG & Acid-Base Interpretation | hard | Supply PaO2 and FiO2 and the exact `PaO2 ÷ FiO2` equation, then ask for the P/F ratio in mm Hg. If ARDS context is used, explicitly supply the other relevant definition conditions and ask only for the ratio; a ratio alone must not be treated as an ARDS diagnosis. Do not reuse anion-gap, Winter-formula, or delta-gap arithmetic. |

### Batch 8B — ordered response

Every option must participate in the keyed permutation. The stem must make the local sequence
closed-world; a reviewer must not need to guess which institution-specific step happens first.

| # | Category | Canonical topic | Difficulty | Mandated assessment target |
|---|---|---|---|---|
| 7 | Health Promotion and Maintenance | Reproductive & Endocrine Health | medium | After ulipristal emergency contraception, order the supplied CDC timeline for starting or resuming the chosen hormonal method, using back-up protection, and performing follow-up pregnancy testing when indicated. Make each option a distinct time-ordered action. Do not substitute levonorgestrel instructions or turn the item into a contraceptive contraindication matrix. |
| 8 | Reduction of Risk Potential | Oncology & Immunotherapy Complications | hard | Suspected peripheral vesicant extravasation. Order the source-pinned pathway: stop/send for help, leave the access device in place, aspirate residual drug, then perform the specified assessment and drug-specific plan. Do not flush or remove the device before aspiration, and do not invent an antidote or warm/cold-compress rule without naming the exact agent and source. |
| 9 | Basic Care and Comfort | Palliative & Supportive Care | easy | A comfort-focused client has distressing breathlessness and an individualized plan with a prescribed PRN medicine. Order focused assessment for a reversible contributor, immediate nonpharmacologic comfort measures, administration under the existing order, reassessment at the plan's stated interval, and escalation if distress persists. Do not use oxygen routinely when the stem does not establish symptomatic hypoxemia and do not invent a dose. |
| 10 | Health Promotion and Maintenance | Pediatric & Toddler Safety | easy | A conscious, breathing toddler may have swallowed an unknown household product. Order a closed-world Poison Control pathway: stop further access, rapidly assess for 911 red flags, contact Poison Control/webPOISONCONTROL with the container and exposure details, follow the product-specific instructions, then monitor/escalate as directed. Do not induce vomiting or prescribe universal dilution. |
| 11 | Reduction of Risk Potential | ABG & Acid-Base Interpretation | medium | Order a bounded arterial-blood-gas specimen workflow from identity/site preparation through collection, firm pressure, air-bubble removal/capping/mixing, labeling, and immediate transport under the supplied laboratory policy. Keep only steps with real serial constraints and state that the operator is trained and the procedure is in scope. Do not make a bedside Allen-test result a universal permission rule. |
| 12 | Basic Care and Comfort | Sleep & Rest | medium | A client using a supplied CBT-I stimulus-control plan remains awake in bed. Order leaving the bed, using a quiet low-stimulation activity, returning only when sleepy, repeating the cycle if needed, and maintaining the prescribed fixed wake time. Do not reduce chronic-insomnia treatment to sleep hygiene alone or introduce sedative medication. |

### Batch 8C — bowtie and highlight

The bowties are authorized only if the differential, actions, and parameters are natural for the
specific vignette. Each highlight passage needs at least one clinically plausible selectable
distractor, and the correct set must be bounded rather than “highlight most of the note.”

| # | Category | Canonical topic | itemType | Difficulty | Mandated assessment target |
|---|---|---|---|---|---|
| 13 | Reduction of Risk Potential | ABG & Acid-Base Interpretation | bowtie | hard | A symptomatic client with a reported salicylate exposure has an apparently near-normal pH, low PaCO2, low bicarbonate, and an elevated anion gap. Distinguish mixed respiratory alkalosis plus anion-gap metabolic acidosis from plausible simple disturbances. Key two source-supported immediate actions already authorized by the toxicology pathway and two parameters that track response or deterioration. Do not use a serum level alone to dismiss clinical severity or invent a bicarbonate dose. |
| 14 | Physiological Adaptation | Oncology & Immunotherapy Complications | bowtie | hard | A client receiving an immune checkpoint inhibitor develops a cue cluster supporting hypophysitis with secondary adrenal insufficiency and hemodynamic risk. Preserve plausible infection, thyroid-only, and ordinary cancer-fatigue alternatives until the discriminating hormone/electrolyte/hemodynamic data appear. Key two actions already authorized by the pathway and two response parameters; when multiple pituitary deficits are present, do not sequence thyroid replacement before cortisol coverage. |
| 15 | Psychosocial Integrity | Electroconvulsive Therapy (ECT) | highlight | medium | A post-ECT recovery note mixes expected short-lived headache/drowsiness/disorientation with respiratory compromise, failure to regain expected responsiveness, focal neurologic change, or other findings meeting a supplied escalation rule. Highlight only the escalation findings. Do not duplicate the existing item that asks learners to recognize routine transient postictal confusion. |
| 16 | Health Promotion and Maintenance | Reproductive & Endocrine Health | highlight | easy | A newly diagnosed client is about to receive potentially gonadotoxic cancer treatment. Highlight the cues and documented actions supporting timely fertility-risk counseling, elicitation of reproductive goals, and referral before treatment when feasible. Leave assumptions about age, relationship status, parity, gender identity, and future desire unselected. |
| 17 | Physiological Adaptation | Diabetic Ketoacidosis (DKA) | highlight | medium | A serial treatment note mixes improved glucose with current ketone/acidosis status and transition-planning details. Highlight only the findings that satisfy the current consensus resolution lane and safe transition context supplied in the stem. Glucose improvement alone is not DKA resolution; do not use obsolete urine-ketone or anion-gap-only criteria. |
| 18 | Physiological Adaptation | Oncology & Immunotherapy Complications | highlight | medium | An immune-checkpoint-inhibitor follow-up note mixes mild nonspecific symptoms with diarrhea frequency, blood or mucus, abdominal pain, fever, dehydration, or peritoneal cues. Highlight only the findings that cross the exact source-pinned evaluation/escalation lane for suspected immune-mediated colitis. Do not diagnose colitis from one loose stool or let infection assessment disappear from the pathway. |

## 5. Source anchors

Every item must carry a checkable `meta.source` that pins the exact section, recommendation, table,
formula, or scoring tool supporting its keyed rule. A topic homepage alone is insufficient. The
producer may use a newer authoritative replacement if it identifies the superseded source and the
replacement supports the same exact key.

| Rows | Required source lane |
|---|---|
| 1 | FDA clozapine prescribing information for the baseline/severe-neutropenia ANC tables, plus FDA's August 2025 notice that the REMS was removed while clinical ANC monitoring continues: <https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/019758s106lbl.pdf> and <https://www.fda.gov/drugs/drug-safety-and-availability/fda-removes-risk-evaluation-and-mitigation-strategy-rems-program-antipsychotic-drug-clozapine>. Put the ANC equation in the stem and source it separately if the label does not define the arithmetic. |
| 2, 17 | ADA/EASD/JBDS/AACE/DTS, *Hyperglycemic Crises in Adults With Diabetes: A Consensus Report* (2024), exact monitoring and resolution sections: <https://diabetesjournals.org/care/article/47/8/1257/156808/Hyperglycemic-Crises-in-Adults-With-Diabetes-A>. |
| 3 | ASTCT adult ICE scoring table, with the ASCO CAR-T adverse-event guideline as a management cross-check: <https://www.astctjournal.org/article/S1083-8791%25252818%25252931691-4/fulltext> and <https://ascopubs.org/doi/10.1200/JCO.21.01992>. |
| 4, 15 | The 2023 *Clinical Practice Guidelines for the Use of Electroconvulsive Therapy*, exact seizure-monitoring and recovery sections: <https://pmc.ncbi.nlm.nih.gov/articles/PMC10096214/>. Do not revive fixed seizure-duration adequacy rules the guideline rejects. |
| 5 | AASM sleep-efficiency definition/formula plus the current VA/DoD chronic-insomnia guideline for the clinical lane: <https://aasm.org/wp-content/uploads/2017/07/PharmacologicTreatmentofInsomnia.pdf> and <https://www.healthquality.va.gov/guidelines/CD/insomnia/index.asp>. |
| 6 | 2023 global ARDS definition, exact oxygenation table and conditions: <https://doi.org/10.1164/rccm.202303-0558WS>. |
| 7 | CDC, *U.S. Selected Practice Recommendations for Contraceptive Use, 2024*, “Use of Regular Contraception After ECPs — Ulipristal Acetate”: <https://www.cdc.gov/mmwr/volumes/73/rr/rr7303a1.htm>. |
| 8 | eviQ, “Extravasation management,” exact SLAP pathway and agent-specific table when used: <https://www.eviq.org.au/clinical-resources/extravasation/157-extravasation-management>. |
| 9 | NICE NG31 recommendations 1.5.15–1.5.17 plus the individualized plan supplied in the stem: <https://www.nice.org.uk/guidance/ng31/chapter/Recommendations>. |
| 10 | Poison Control, “First aid: Act fast!”, swallowed-poison and 911 criteria: <https://www.poison.org/first-aid-for-poisonings>. |
| 11 | WHO, *Guidelines on Drawing Blood*, chapter 5.2 arterial blood sampling: <https://www.ncbi.nlm.nih.gov/books/NBK138661/>. |
| 12 | VA/DoD 2025 chronic-insomnia guideline, CBT-I/stimulus-control section: <https://www.healthquality.va.gov/HEALTHQUALITY/guidelines/CD/insomnia/I-OSA-CPG_2025-Guideline_final_20250915.pdf>. |
| 13 | American College of Medical Toxicology, “Management Priorities in Salicylate Toxicity,” exact acid-base, serial-level, alkalinization, and escalation passages: <https://pmc.ncbi.nlm.nih.gov/articles/PMC4371029/>. |
| 14, 18 | ASCO, *Management of Immune-Related Adverse Events in Patients Treated With Immune Checkpoint Inhibitor Therapy: Guideline Update*, exact endocrine and GI-toxicity tables: <https://ascopubs.org/doi/10.1200/JCO.21.01440>. |
| 16 | ASCO 2025 fertility-preservation guideline update, exact counseling/referral recommendations: <https://ascopubs.org/doi/10.1200/JCO-24-02782>. |

The producer does not get to convert a source gap into a confident answer. If the exact keyed rule is
not supported, the row is blocked.

## 6. Semantic, taxonomy, and duplicate gates

- Use the exact category and canonical topic strings in the manifest.
- `Dosage Calculations` remains medication-only. Batch 8A does not ask for a medication dose,
  dilution, titration, or medication-infusion rate.
- A formula supplied in a stem does not override the tested construct, but generic arithmetic is not
  enough to justify a clinical topic.
- SHARED topic licensing is not semantic proof. The Oncology rows use two categories because their
  tested constructs differ; do not copy a category from another oncology item.
- Do not use any `AVOID_TOPICS` subject as a substitute for a difficult assigned row.
- Preserve English-first exam wording and faithful Simplified-Chinese parity on every displayed field.
- Inspect the current bundled banks before authoring. Do not recreate Naegele-rule due-date arithmetic;
  DKA initial-fluid, anion-gap, corrected-sodium, or potassium-before-insulin items; routine ECT
  preprocedure or expected-recovery items; generic sleep-hygiene or OSA teaching; acute transfusion-
  reaction sequences; dry-chemical burn decontamination; or the existing oncology cases on checkpoint
  pneumonitis, neutropenic fever, superior vena cava syndrome, tumor lysis syndrome, malignant spinal
  cord compression, and CAR-T treatment escalation.
- Shared vocabulary is not duplication by itself. The tested decision, cue pattern, response demand,
  and keyed pathway must together be materially distinct.

## 7. Format-specific gates

### Fill in the blank

- One bounded response per item; no multi-step response hidden in one blank.
- State equations, units, time basis, scoring excerpt, and rounding in the stem.
- `acceptable` values and `numeric` metadata must agree.
- Recompute every key independently before writing the file.
- A calculation that does not improve the clinical construct should be blocked, not retained as
  format arithmetic.

### Ordered response

- The key is a permutation of every option.
- Each step is distinct and necessary; no two steps may be clinically simultaneous unless the stem
  explicitly imposes an operational order.
- The sequence must come from the supplied pathway or closed-world stem, not an invented universal
  nursing ritual.

### Bowtie

- The competing condition must genuinely compete with the key until discriminating data are read.
- Both actions must be appropriate priority actions for the keyed condition.
- Both parameters must confirm response or deterioration; decoys must be plausibly tempting but
  truly non-discriminating.
- If a premise cannot meet this floor, block it. Do not weaken the differential.

### Highlight

- At least one selectable distractor must be a real near-miss.
- The correct set must be bounded and answer the stated task.
- English and Chinese segmentation must map one-to-one.

## 8. Review and promotion chain

No generated question is reviewed by its producer.

1. GPT-5.6 Sol writes each six-item raw file independently and completes only raw-file normalization
   and validation.
2. A non-GPT checker independently recomputes all Batch 8A arithmetic/scoring and verifies every
   source anchor, key, category/topic pair, duplicate exclusion, and bilingual response.
3. Claude performs the content gate, with special attention to ordered-response necessity, bowtie
   differential quality, and highlight cue boundaries.
4. The promotion seat normalizes as needed, promotes, audits with raw plus staged files present,
   consolidates, updates the review ledger, regenerates census/coverage, and deletes raw files only
   after the canonical merge passes.

Minimum post-merge path for the later promotion seat:

```bash
npm run validate-bank -- banks/*.json
npm run audit
npm run test:coverage-report
npm run test:topic-license
npx tsc -b --pretty false
npm run census && npm run census:check
npm run coverage-report
npm run build
git diff --check
```

## 9. Acceptance

- [ ] Three valid six-item raw banks exist at the exact paths; the producer returned a receipt, not JSON.
- [ ] Only the three new paths under `banks/banks-raw/` were written.
- [ ] Dry-run normalization and raw-file validation pass for all three banks.
- [ ] No case study or visual content.
- [ ] All arithmetic/scoring was independently recomputed and all source pins support the keyed rule.
- [ ] No category/topic pair changed for histogram convenience.
- [ ] The explicit duplicate exclusions were checked against bundled content.
- [ ] Producer and checker are different seats; Claude content gate completed.
- [ ] Promotion, consolidation, ledger update, census regeneration, and full verification pass later.
