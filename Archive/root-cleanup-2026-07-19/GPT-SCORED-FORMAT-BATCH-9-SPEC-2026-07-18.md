# Producer Commission — Scored-Format Batch 9

Date: 2026-07-18

Status: **ready for generation**

Producer: GPT-5.6 Sol (`gpt_` lane)

Scope: 18 standalone, text-only questions in three independently runnable six-item raw files

## 1. Commission purpose

This is another scored-format backfill order, not category rescue. Assume the reviewed Batch 8
content will be accepted unless its checker says otherwise. On that planning assumption, the five
lowest scored standalone formats remain `bowtie`, `highlight`, `fill_in_blank`, `ordered_response`,
and `dropdown_cloze`; this order gives those formats 17 of the 18 seats and uses the final seat to
fill ECT's missing `select_all` lane.

The topic mix emphasizes currently thin but clinically natural lanes: transfusion, palliative care,
ECT, intrapartum monitoring, pediatric safety, skin/wound care, and parenteral nutrition. These are
authoring assignments, not permission to force a premise. If a row cannot support its assigned
format, category, topic, unambiguous key, and exact source pin, report it as blocked. Do not silently
substitute a familiar question.

## 2. Direct-write operating contract

Do **not** return JSON in chat. Use the available read/write tools to create these exact files directly
under `banks/banks-raw/`:

| Sub-batch | Exact contents | Raw filename |
|---|---|---|
| 9A | 4 `bowtie` + 2 `highlight` | `banks/banks-raw/gpt-format9a-bowtie-highlight-2026-07-18.json` |
| 9B | 2 `highlight` + 3 `fill_in_blank` + 1 `select_all` | `banks/banks-raw/gpt-format9b-highlight-fib-sata-2026-07-18.json` |
| 9C | 3 `ordered_response` + 3 `dropdown_cloze` | `banks/banks-raw/gpt-format9c-ordered-dropdown-2026-07-18.json` |

Before writing, confirm that none of the target paths exists. If one exists, stop on that sub-batch
and report the collision; do not overwrite, rename, or create an alternate copy. Create each bank as
one complete valid JSON object. Do not leave partial files, Markdown fences, or prose notes in the
raw directory.

After writing each file, run:

```bash
npm run normalize-raw-bank -- banks/banks-raw/<exact-filename>.json
npm run validate-bank -- banks/banks-raw/<exact-filename>.json
```

Normalization is a dry run. If it proposes deterministic changes, review them and use `--write` only
for the normalizer-owned repairs. Any later JSON repair must load, mutate, and re-serialize the object
programmatically; never retype raw-bank structure.

Do not edit tracked files, canonical banks, existing raw drafts, schema, ledger, census, history, or
this spec. Do not run `promote` or `consolidate`. The final response should be a compact receipt with
the three paths, item counts, normalization/validation results, collision-preflight result, and any
blocked row. Do not paste question JSON into the response.

## 3. Mandatory collision preflight

The producer owns first-pass collision prevention for this batch. Perform the preflight **before
authoring prose**, then repeat it against the completed drafts.

Inspect:

1. every standalone question and embedded case-study leaf in top-level `banks/*.json`;
2. every existing JSON draft under `banks/banks-raw/`, including Batch 8; and
3. the exact assigned construct, not merely IDs, titles, or word overlap.

For each manifest row, identify the nearest existing bundled or raw item. A row fails when it repeats
the same tested equation, scoring tool, cue-to-decision path, priority sequence, or clinical response
pattern even if the setting, values, names, or item format differ. In particular, a new wrapper around
the same formula is a collision. Shared vocabulary or the same broad diagnosis is not sufficient by
itself; the response demand and key must also overlap materially.

If a collision is found, block the assigned row. Do not cure it by changing numbers, demographics,
format, category, or wording. Do not edit the colliding existing item. The receipt must state either
`18/18 collision-preflight clear` or list each blocked row and the nearest conflicting ID.

## 4. Deliverable distribution

All 18 questions are standalone. No case studies, visuals, rationale visuals, or taxonomy changes are
authorized. Author to the current `NCLEX-Question-Schema.md`. Use readable globally unique IDs with
the corresponding prefix `gpt_format9a_`, `gpt_format9b_`, or `gpt_format9c_`.

Aggregate distribution:

- Format: 4 bowtie / 4 highlight / 3 fill-in-the-blank / 3 ordered response / 3 dropdown cloze /
  1 select-all-that-apply.
- Category: 6 Basic Care and Comfort / 3 Safety and Infection Prevention and Control / 3 Reduction
  of Risk Potential / 2 Health Promotion and Maintenance / 2 Psychosocial Integrity /
  2 Pharmacological and Parenteral Therapies.
- Difficulty: 3 easy / 9 medium / 6 hard.

The category follows the tested construct. Do not move a row to improve a histogram.

## 5. Exact assignment manifest

### Batch 9A — bowtie and highlight

| # | Category | Canonical topic | itemType | Difficulty | Mandated assessment target |
|---|---|---|---|---|---|
| 1 | Safety and Infection Prevention and Control | Transfusion & Blood Products | bowtie | hard | During or soon after a transfusion, distinguish suspected bacterial contamination/transfusion-transmitted infection from febrile nonhemolytic and hemolytic alternatives using a source-supported cue cluster. Key two immediate actions already authorized by the transfusion-reaction pathway and two parameters that track deterioration or response. Do not invent a universal culture set, antibiotic, or restart rule; identify the implicated component and preserve required reporting/culture steps from the exact source. |
| 2 | Basic Care and Comfort | Skin & Wound Care | bowtie | medium | Distinguish incontinence-associated dermatitis from a pressure injury using distribution, exposure, wound-edge/depth, and bony-prominence cues. Key two skin/protection actions and two parameters that assess improvement or worsening. Do not stage IAD as a pressure injury, infer a pressure-injury stage from missing depth data, or duplicate a generic pressure-prevention item. |
| 3 | Reduction of Risk Potential | Intrapartum Fetal Monitoring | bowtie | hard | A laboring client with a prior cesarean birth develops a cue cluster supporting suspected uterine rupture. Preserve abruption, tachysystole, and ordinary labor pain as plausible alternatives until the discriminating maternal/fetal data appear. Key two immediate source-supported actions and two deterioration/response parameters. Do not use one tracing feature alone as diagnostic or invent an operating-room interval. |
| 4 | Health Promotion and Maintenance | Pediatric & Toddler Safety | bowtie | hard | Suspected esophageal button-battery impaction. Use age, ingestion timing, symptoms, and imaging/location cues to distinguish it from a battery beyond the esophagus and nonbattery ingestion. Key two guideline-supported actions and two high-risk monitoring parameters. Honey is selectable only if every National Capital Poison Center eligibility criterion is explicit; it must never delay emergency evaluation or removal. |
| 5 | Safety and Infection Prevention and Control | Transfusion & Blood Products | highlight | easy | A preadministration note contains correct checks mixed with identity, compatibility, component, expiration, integrity, or order discrepancies. Highlight only the discrepancies that require stopping before spiking or starting the component. Keep the task preadministration; do not recreate an acute-reaction stop-the-transfusion sequence. |
| 6 | Reduction of Risk Potential | Skin & Wound Care | highlight | medium | An NPWT follow-up note mixes expected device/wound findings with bleeding, infection, loss-of-therapy, or device-failure cues meeting an exact source- or manufacturer-IFU escalation rule. Highlight only the escalation findings. Do not generalize one manufacturer's alarms or pressure settings to all devices. |

### Batch 9B — highlight, fill-in-the-blank, and select-all

Every fill-in-the-blank row must have one clinically useful uncued response. Put the exact formula,
units, time basis, and rounding rule in the stem. Recompute each answer before writing.

| # | Category | Canonical topic | itemType | Difficulty | Mandated assessment target |
|---|---|---|---|---|---|
| 7 | Basic Care and Comfort | Palliative & Supportive Care | highlight | medium | A dying client's individualized assisted-hydration trial note contains possible benefits and possible harms. Highlight only the findings that support continuing, reducing, or stopping the trial under the exact NICE review rule named in the stem. The key must follow the stated question direction and must not imply that hydration universally prolongs life or relieves every symptom. |
| 8 | Psychosocial Integrity | Electroconvulsive Therapy (ECT) | highlight | hard | A longitudinal ECT record mixes stable baseline features with subjective and objective cognitive changes during a treatment course. Highlight only the findings requiring clinical review or treatment-plan reassessment under the cited guideline. Do not use unsupported fixed recovery thresholds, and do not duplicate expected short-lived postictal confusion. |
| 9 | Basic Care and Comfort | Skin & Wound Care | fill_in_blank | easy | Supply a source-pinned wound-measurement convention and the exact `surface area = greatest length × greatest perpendicular width` formula in the stem. Give measurements in centimeters and ask for area in cm² with an explicit rounding rule. Test documentation arithmetic only; do not infer wound volume, stage, tissue percentage, or healing from area alone. Block the row if the exact measurement convention cannot be pinned. |
| 10 | Reduction of Risk Potential | Intrapartum Fetal Monitoring | fill_in_blank | medium | Supply a 10-minute intrauterine-pressure record, the resting tone, and the exact Montevideo-units rule in the stem. Ask for the sum of each contraction's peak pressure above baseline in MVU. Do not diagnose labor arrest or prescribe oxytocin from the number alone. |
| 11 | Pharmacological and Parenteral Therapies | Parenteral Nutrition | fill_in_blank | hard | Supply dextrose grams, infusion duration, and weight plus the exact glucose-infusion-rate equation in the stem; ask for mg/kg/min with a stated rounding rule. Use a value set that does not require an unstated dry-weight judgment. Ask only for GIR, not a prescription or insulin dose. |
| 12 | Psychosocial Integrity | Electroconvulsive Therapy (ECT) | select_all | medium | Select the documented actions that satisfy informed-consent, capacity, surrogate, and shared-decision requirements before or during an ECT course. Include plausible but invalid coercive, blanket-consent, or capacity-assumption distractors. Do not turn ordinary forgetfulness into incapacity or claim that emergency/legal rules are identical across jurisdictions. |

### Batch 9C — ordered response and dropdown cloze

Every ordered option must participate in the keyed permutation. The stem must make the local sequence
closed-world; the key cannot depend on guessing an institution-specific ritual.

| # | Category | Canonical topic | itemType | Difficulty | Mandated assessment target |
|---|---|---|---|---|---|
| 13 | Health Promotion and Maintenance | Reproductive & Endocrine Health | ordered_response | medium | After missed combined oral contraceptive pills, order the supplied CDC actions for taking missed pills, continuing the pack, using barrier protection/abstinence, and considering emergency contraception when the exact missed-pill timing calls for it. State whether one or at least two consecutive hormonal pills were missed and the week of the pack. Do not mix ulipristal follow-up instructions into this item. |
| 14 | Basic Care and Comfort | Skin & Wound Care | ordered_response | medium | Order a closed-world ISTAP skin-tear pathway from assessment and bleeding control through cleansing, flap realignment when viable, atraumatic dressing/marking, and reassessment. Include only steps with true serial constraints; do not force simultaneous documentation actions into an arbitrary order or use adhesive closure that risks further trauma. |
| 15 | Basic Care and Comfort | Palliative & Supportive Care | ordered_response | medium | A comfort-focused client develops agitation/delirium and has an individualized, source-consistent plan with a named reassessment interval. Order the plan's reversible-cause review, immediate environmental/nonpharmacologic measures, administration under an existing PRN order when indicated, reassessment, and specialist escalation if distress persists or unwanted sedation occurs. Do not invent a drug/dose. Block the row if the source and stem cannot establish real serial constraints. |
| 16 | Safety and Infection Prevention and Control | Transfusion & Blood Products | dropdown_cloze | hard | Use onset after transfusion, hemoglobin/hematocrit change, bilirubin/LDH, DAT, antibody findings, and absence/presence of competing acute cues to distinguish a delayed hemolytic transfusion reaction from plausible alternatives. Each dropdown must test a distinct inference. Do not use the retired NHSN adverse-reaction taxonomy as the sole authority; pin the AABB Circular's exact delayed-reaction passage. |
| 17 | Pharmacological and Parenteral Therapies | Parenteral Nutrition | dropdown_cloze | medium | Given a closed-world PN order with osmolarity, anticipated duration, and access characteristics, distinguish peripheral from central administration and select the source-supported monitoring implication. Pin the exact ASPEN lane used; do not present one osmolarity threshold as a universal law or duplicate Batch 7's filter, line-dedication, home-transition, refeeding, or hyperglycemia items. |
| 18 | Basic Care and Comfort | Palliative & Supportive Care | dropdown_cloze | easy | In a last-days-of-life scenario with noisy respiratory secretions but no evidence of distress, choose the source-supported interpretation, family explanation, and management approach. Distinguish secretions from dyspnea and pulmonary edema. Do not promise that medication will eliminate the sound, and do not use routine suctioning as a universal first action. |

## 6. Source anchors

Each question must include `meta.source` with the exact section, recommendation, table, formula, or
manufacturer IFU supporting the key. A topic homepage alone is insufficient. If a required exact
rule is unavailable, block the row rather than converting a source gap into a confident answer.

| Rows | Required source lane |
|---|---|
| 1, 5, 16 | AABB, *Circular of Information for the Use of Human Blood and Blood Components* (June 2024), exact pretransfusion, suspected bacterial contamination, and delayed hemolytic reaction passages: <https://www.aabb.org/docs/default-source/default-document-library/resources/circular-of-information-watermark.pdf>. For row 1, cross-check the current CDC NHSN Hemovigilance transfusion-transmitted-infection investigation lane: <https://www.cdc.gov/nhsn/pdfs/biovigilance/bv-hv-protocol-current.pdf>. |
| 2 | WOCN IAD resources, plus an authoritative IAD-versus-pressure-injury differential source: <https://bwap.wocn.org/> and <https://www.agedcarequality.gov.au/news-publications/clinical-alerts-and-advice/incontinence-associated-dermatitis-and-pressure-injury>. |
| 3, 10 | NICE NG229 fetal-monitoring recommendations and NICE NG192 suspected-uterine-rupture/category-1-birth lane, with ACOG's current labor-management guideline for the exact MVU context: <https://www.nice.org.uk/guidance/NG229/chapter/recommendations>, <https://www.nice.org.uk/guidance/NG192/chapter/recommendations>, and <https://www.acog.org/clinical/clinical-guidance/clinical-practice-guideline/articles/2024/01/first-and-second-stage-labor-management>. The row 10 stem must itself define the MVU arithmetic. |
| 4 | National Capital Poison Center, *Button Battery Ingestion Triage and Treatment Guideline*, exact honey, imaging, esophageal-removal, and red-flag passages: <https://www.poison.org/battery/guideline>. |
| 6 | FDA NPWT safety/labeling material plus the exact selected device manufacturer's current IFU for any alarm, pressure, loss-of-therapy, or device-failure key: <https://www.fda.gov/medical-devices/guidance-documents-medical-devices-and-radiation-emitting-products/non-powered-suction-apparatus-device-intended-negative-pressure-wound-therapy-npwt-class-ii-special>. |
| 7, 15, 18 | NICE NG31, exact recommendations for clinically assisted hydration, agitation/delirium, and noisy respiratory secretions: <https://www.nice.org.uk/guidance/ng31/chapter/Recommendations>. The individualized plan supplied in row 15 must own any local reassessment interval. |
| 8, 12 | *Clinical Practice Guidelines for the Use of Electroconvulsive Therapy* (2023), exact cognitive-monitoring, consent, and capacity sections: <https://pmc.ncbi.nlm.nih.gov/articles/PMC10096214/>. |
| 9 | The exact wound-measurement standard selected by the producer, pinned to the passage defining greatest length and perpendicular width. The source must support the convention; the formula must also appear in the stem. A commercial summary page alone is insufficient. |
| 11, 17 | ASPEN Parenteral Nutrition resources and the exact current document defining the GIR equation or peripheral/central osmolarity lane used: <https://nutritioncare.org/clinical-resources/parenteral-nutrition/> and <https://nutritioncare.org/wp-content/uploads/2025/04/Back-to-Basics_Parenteral-Nutrition-101_Glanz.pdf>. |
| 13 | CDC, *U.S. Selected Practice Recommendations for Contraceptive Use, 2024*, exact combined-hormonal-contraceptive missed-dose figure/section: <https://www.cdc.gov/mmwr/volumes/73/rr/rr7303a1.htm> and <https://www.cdc.gov/contraception/hcp/usspr/combined-hormonal-contraceptives.html>. |
| 14 | ISTAP, *Best practice recommendations for the prevention and management of skin tears in aged skin* (2025), exact assessment/treatment pathway: <https://woundsinternational.com/wp-content/uploads/2025/05/ISTAP25_CD_Skin-tears_WINT_web.pdf>. |

## 7. Explicit exclusions and semantic gates

- Do not reproduce the ANC equation/scenario in the existing bundled Gemini fill-in-the-blank item
  or the Batch 8 raw ANC draft. More broadly, do not reuse any existing equation or scoring excerpt
  under a new wrapper.
- Do not use unsupported fixed post-ECT escalation thresholds such as `SpO2 <92%` or failure to follow
  commands at exactly 30 minutes. Do not duplicate routine short-lived ECT recovery findings.
- Do not recreate acute hemolytic, TACO, TRALI, acute-reaction ordered-response, or already-bundled
  transfusion administration constructs. Rows 1, 5, and 16 must remain distinct from one another.
- Do not recreate generic pressure-injury staging/prevention, an unknown-household-ingestion pathway,
  or an item whose answer is simply “call Poison Control.”
- Do not duplicate Batch 7 PN administration/filter, home-transition, refeeding, or hyperglycemia
  constructs, and do not duplicate Batch 8's PN or other raw-draft constructs.
- Do not reproduce Batch 8's ulipristal sequence; row 13 is the distinct CDC missed-COC pathway.
- Do not reproduce or adapt copyrighted clinical scoring instruments unless the repository has a
  clear right to use them. This order deliberately excludes PPSv2.
- English is the primary exam surface. Every displayed field needs faithful natural Simplified-Chinese
  parity; highlight segmentation must map one-to-one across languages.
- Use the manifest's exact category and canonical topic strings. SHARED topic licensing is not proof
  that a category fits the tested construct.

## 8. Format-specific gates

### Bowtie

- The alternative conditions must genuinely compete until the discriminating cues appear.
- Both keyed actions must be immediate and appropriate for the keyed condition.
- Both keyed parameters must measure response or deterioration, not merely repeat diagnostic cues.
- If the natural bowtie cannot meet those rules, block it.

### Highlight

- Include at least one clinically plausible selectable distractor.
- Keep the correct set bounded and aligned with the stated direction.
- Segment English and Chinese one-to-one; do not make punctuation or clause boundaries reveal the key.

### Fill in the blank

- One bounded response per item; no hidden multi-part answer.
- State formula, units, time basis, and rounding in the stem.
- `acceptable` and `numeric` must agree, and the key must be independently recomputed.

### Ordered response

- The correct key is a permutation of every option.
- Each step is necessary and serial. Remove simultaneous or merely documentary steps rather than
  inventing an order.
- The order must come from a named pathway or the closed-world stem.

### Dropdown cloze and select-all

- Each dropdown tests a separate inference and has one unambiguous option.
- Select-all distractors must remain independently judgeable; do not create coupled partial truths.
- Every option needs an exact bilingual `byChoice` rationale.

## 9. Review handoff

The producer is not the content checker. GPT writes and validates only the three raw files. A separate
checker independently recomputes all calculations, opens every source pin, reviews collision results,
and checks bilingual parity. Claude owns the clinical/content gate and decides which raw items advance.
Promotion, consolidation, ledgering, census regeneration, and deletion of raw files occur only after
that review and are outside this producer commission.

## 10. Acceptance

- [ ] Three valid six-item raw banks exist at the exact paths; the producer returned a receipt, not JSON.
- [ ] Only those three new paths under `banks/banks-raw/` were written.
- [ ] Dry-run normalization and raw-file validation pass for all three banks.
- [ ] Collision preflight covered bundled standalone items, embedded leaves, and all live raw drafts.
- [ ] No case study, visual, rationale visual, silent substitution, or category/topic drift.
- [ ] All equations and keyed clinical rules were independently checked against exact source passages.
- [ ] Producer and checker remain different seats; Claude content review remains pending.
