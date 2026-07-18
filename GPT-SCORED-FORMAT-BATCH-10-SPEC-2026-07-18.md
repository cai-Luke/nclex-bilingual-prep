# Producer Commission — Scored-Format Batch 10

Date: 2026-07-18

Status: **ready for generation**

Producer: GPT-5.6 Sol (`gpt_` lane)

Scope: 18 standalone, text-only questions in three independently runnable six-item raw files

## 1. Commission purpose

This is the next scored-format backfill order. Plan on the working assumption that most or all of
reviewed Batches 8 and 9 will clear Claude's independent content gate. The five lowest scored
standalone formats remain `bowtie`, `highlight`, `fill_in_blank`, `ordered_response`, and
`dropdown_cloze`; every Batch 10 seat belongs to one of those formats.

Batch 10 deliberately moves away from the dense Batch 8–9 clusters. It emphasizes procedure-related
complications, transmission precautions, occupational exposure, respiratory calculations,
electrolyte trending, and time-anchored preventive pathways. These are assignments, not permission to
force a premise. If an exact construct collides, lacks an authoritative source pin, or does not fit
its format naturally, block the row and name the reason. Do not silently substitute a familiar item.

## 2. Direct-write operating contract

Do **not** return JSON in chat. Use the available read/write tools to create these exact files directly
under `banks/banks-raw/`:

| Sub-batch | Exact contents | Raw filename |
|---|---|---|
| 10A | 4 `bowtie` + 2 `highlight` | `banks/banks-raw/gpt-format10a-bowtie-highlight-2026-07-18.json` |
| 10B | 2 `highlight` + 4 `fill_in_blank` | `banks/banks-raw/gpt-format10b-highlight-fib-2026-07-18.json` |
| 10C | 3 `ordered_response` + 3 `dropdown_cloze` | `banks/banks-raw/gpt-format10c-ordered-dropdown-2026-07-18.json` |

Before writing, confirm that none of the target paths exists. If one exists, stop on that sub-batch
and report the collision; do not overwrite, rename, or create an alternate copy. Create each bank as
one complete valid JSON object. Do not leave partial files, Markdown fences, or prose notes in the raw
directory.

After writing each file, run:

```bash
npm run normalize-raw-bank -- banks/banks-raw/<exact-filename>.json
npm run validate-bank -- banks/banks-raw/<exact-filename>.json
```

Normalization is a dry run. If it proposes deterministic changes, review them and use `--write` only
for normalizer-owned repairs. Any later JSON repair must load, mutate, and re-serialize the object
programmatically; never retype raw-bank structure.

Do not edit tracked files, canonical banks, existing raw drafts, schema, ledger, census, history, or
this spec. Do not run `promote`, `consolidate`, the promotion gate, or the canonical audit suite. The
final response should be a compact receipt with the three paths, item counts, normalization and
validation results, collision-preflight result, and any blocked row. Do not paste question JSON.

## 3. Mandatory collision preflight

The producer owns first-pass collision prevention. Perform it before authoring prose and repeat it
against the completed drafts. Inspect every top-level `banks/*.json` standalone item, every embedded
case-study leaf, and every live JSON draft under `banks/banks-raw/`, including Batches 8 and 9.

For each manifest row, identify the nearest existing item. Compare the tested equation or scoring
rule, decisive cue cluster, response demand, keyed pathway, and serial template—not just words or IDs.
A row is blocked when it repeats the same construct under different values, demographics, symptoms,
format, or category. In particular:

- changing only the symptom in an `assess → nonpharmacologic care → PRN treatment → timed reassess →
  escalate` ordered template is a collision;
- recommendations that occur concurrently cannot be turned into an ordered response unless the stem
  supplies real clock or milestone anchors; and
- a calculation using the same equation remains a collision even when the numbers and wrapper change.

If a collision is found, block the row. Do not cure it with cosmetic rewrites or edit the existing
item. The receipt must state either `18/18 collision-preflight clear` or list each blocked row and its
nearest conflicting ID.

## 4. Deliverable distribution

All questions are standalone. No case studies, visuals, rationale visuals, scoring-tool images, or
taxonomy changes are authorized. Author to the current `NCLEX-Question-Schema.md`. Use readable,
globally unique IDs with the corresponding prefix `gpt_format10a_`, `gpt_format10b_`, or
`gpt_format10c_`.

Aggregate distribution:

- Format: 4 bowtie / 4 highlight / 4 fill-in-the-blank / 3 ordered response / 3 dropdown cloze.
- Difficulty: 3 easy / 9 medium / 6 hard.
- Category follows the tested construct exactly; do not move a row to improve a histogram.

## 5. Exact assignment manifest

### Batch 10A — bowtie and highlight

| # | Category | Canonical topic | itemType | Difficulty | Mandated assessment target |
|---|---|---|---|---|---|
| 1 | Reduction of Risk Potential | Procedural Complications & Dialysis | bowtie | hard | During or soon after an initial hemodialysis treatment, distinguish dialysis disequilibrium syndrome from routine fatigue, intradialytic hypotension, hypoglycemia, and an acute focal neurologic event using the exact timing and neurologic cue cluster. Key two actions already authorized by the named dialysis pathway and two neurologic/hemodynamic parameters that track deterioration or response. Do not make headache alone diagnostic, invent a mannitol dose, or substitute a generic dialysis-hypotension item. Block if an exact authoritative management lane cannot be pinned. |
| 2 | Physiological Adaptation | Respiratory & Infectious Disorders | bowtie | hard | A client with asthma develops a cue cluster supporting life-threatening exacerbation, including worsening work of breathing and reduced air movement despite an apparently less prominent wheeze. Preserve panic, pulmonary embolism, mucus plugging, and improving bronchospasm as plausible alternatives until discriminating data appear. Key two source-supported immediate actions under existing orders/pathway and two parameters that track ventilation/oxygenation. Do not treat a “silent chest” as improvement or invent drug doses. |
| 3 | Physiological Adaptation | Electrolyte Imbalances | bowtie | medium | A client receiving magnesium-containing therapy develops a source-supported toxicity cluster such as declining deep-tendon reflexes, respiratory depression, hypotension, and conduction change. Distinguish clinically significant hypermagnesemia from ordinary sedation, hypocalcemia, and disease progression. Key two actions already authorized by the local plan and two response parameters. Do not infer toxicity from one serum value alone or invent a calcium dose. |
| 4 | Reduction of Risk Potential | Maternal-Newborn Care & Teaching | bowtie | hard | A postpartum client develops new severe hypertension plus neurologic, respiratory, hepatic, or platelet cues supporting postpartum preeclampsia with severe features. Preserve migraine, isolated anxiety, post-dural-puncture headache, and uncomplicated postpartum discomfort as competitors until the full cluster appears. Key two immediate actions under the cited maternal-safety pathway and two deterioration/response parameters. Do not invent a delivery interval, magnesium dose, or universal blood-pressure-device protocol. |
| 5 | Safety and Infection Prevention and Control | Transmission-Based Precautions | highlight | medium | A triage/exposure note mixes compatible measles cues and exposure facts with non-discriminating findings. Highlight only the facts that trigger the exact current airborne-isolation, masking/placement, infection-prevention notification, and public-health pathway named in the stem. Do not diagnose measles from rash alone, conflate immune-status assessment with isolation, or substitute a generic airborne-precautions recall list. |
| 6 | Psychosocial Integrity | Substance Use & Withdrawal | highlight | hard | A longitudinal alcohol-withdrawal record mixes expected mild symptoms with findings that require immediate escalation for complicated withdrawal, seizure, hallucinosis/delirium, oversedation, or medical instability under the exact ASAM lane selected. Highlight only the escalation findings. Do not reproduce Batch 7's inpatient or ambulatory ordered pathways, and do not key a copyrighted score or a single tremor finding. |

### Batch 10B — highlight and fill-in-the-blank

Every fill-in-the-blank item has one clinically useful uncued response. Put the exact equation, units,
time basis, and rounding rule in the stem. Recompute every answer before writing.

| # | Category | Canonical topic | itemType | Difficulty | Mandated assessment target |
|---|---|---|---|---|---|
| 7 | Reduction of Risk Potential | Procedural Complications & Dialysis | highlight | medium | A hemodialysis-access assessment mixes reassuring findings with cues of thrombosis, infection, aneurysmal skin risk, distal ischemia/steal, or access dysfunction that meet exact KDOQI evaluation/escalation criteria. Highlight only findings requiring prompt follow-up. Do not turn absence of a thrill into a generic “notify the provider” item without the accompanying access assessment and exact source pin. |
| 8 | Physiological Adaptation | Endocrine & Neurological Disorders | highlight | hard | A client with back pain has a note mixing common mechanical features with spinal epidural infection/compression red flags such as fever or bacteremia risk, progressive neurologic deficit, sphincter dysfunction, or severe focal pain. Highlight only cues requiring urgent diagnostic escalation under the exact selected guideline. Do not claim that the classic triad must be complete, and do not reproduce the existing malignant spinal-cord-compression oncology case. |
| 9 | Pharmacological and Parenteral Therapies | Transfusion & Blood Products | fill_in_blank | hard | Supply pretransfusion and posttransfusion platelet counts, body surface area, and the platelet dose plus the exact AABB corrected-count-increment equation. Ask for CCI with a stated time point, unit convention, and rounding rule. Test the arithmetic only; do not diagnose refractoriness from one result or omit the platelet-dose unit conversion. |
| 10 | Pharmacological and Parenteral Therapies | IV Fluid Calculations | fill_in_blank | medium | Supply a client's total body water directly and the exact `free-water deficit = TBW × (measured sodium ÷ target sodium − 1)` equation. Ask for liters rounded to the nearest tenth. The item asks only for the estimate; do not choose a replacement fluid, infusion rate, target correction speed, or infer volume status from the result. |
| 11 | Physiological Adaptation | Electrolyte Imbalances | fill_in_blank | medium | Give two time-stamped serum-sodium values during treatment and supply `average correction rate = change in sodium ÷ elapsed hours`. Ask for mEq/L/hr rounded as stated, then compare in the rationale only with the exact source-pinned lane in the stem. Do not prescribe hypertonic saline, convert a 24-hour ceiling into a universal hourly rule, or ignore the client's stated risk context. |
| 12 | Physiological Adaptation | Respiratory & Infectious Disorders | fill_in_blank | easy | A respiratory protocol records respiratory rate and tidal volume in liters. Supply `RSBI = breaths/min ÷ tidal volume (L)` and ask for breaths/min/L as a whole number. Ask only for accurate documentation; current AARC guidance says RSBI is not required by itself to determine readiness for a spontaneous-breathing trial, so do not make the number a stand-alone extubation decision. Block if the equation cannot be pinned to a primary or professional source. |

### Batch 10C — ordered response and dropdown cloze

Every ordered option participates in the keyed permutation. The sequence must come from true time or
milestone constraints in the named pathway; do not order simultaneous recommendations arbitrarily.

| # | Category | Canonical topic | itemType | Difficulty | Mandated assessment target |
|---|---|---|---|---|---|
| 13 | Health Promotion and Maintenance | Pediatric & Toddler Safety | ordered_response | medium | After a mammal exposure with a bite or saliva contact that warrants rabies evaluation, order the CDC time-anchored pathway: immediate wound cleansing, urgent exposure/public-health assessment, day-0 prophylaxis as one bundled milestone when indicated, and completion of the future vaccine schedule. State prior-vaccination status and immune status. Do not split HRIG infiltration and day-0 vaccine into an arbitrary rank when they belong to the same visit, and do not invent a schedule. |
| 14 | Safety and Infection Prevention and Control | Standard Precautions & Hygiene | ordered_response | medium | A health-care worker sustains a percutaneous sharps exposure. Order the 2025 U.S. Public Health Service occupational pathway from immediate first aid through prompt reporting/exposure evaluation, urgent HIV PEP decision/initiation when indicated, and scheduled follow-up. Keep source-patient testing and exposed-worker care distinct; do not delay PEP for pending results, squeeze the wound, or substitute the nonoccupational PEP guideline. |
| 15 | Pharmacological and Parenteral Therapies | Parenteral Nutrition | ordered_response | easy | A closed-world ASPEN-based plan discontinues PN after reliable oral/enteral intake is established. Order verification of adequate non-PN intake, coordination of insulin changes, the prescribed PN taper, stopping the infusion, and the plan's timed post-discontinuation glucose check. The local plan must own the exact times. Do not duplicate Batch 7's administration/filter or home-transition sequences, and do not assert that every adult universally requires the same taper. |
| 16 | Psychosocial Integrity | Electroconvulsive Therapy (ECT) | dropdown_cloze | medium | Given a longitudinal ECT plan, distinguish an acute index course from continuation and maintenance treatment, select the purpose of ongoing symptom/cognitive monitoring, and identify when consent/capacity must be revisited. Each dropdown tests a separate inference. Do not reuse routine preprocedure, immediate recovery, seizure-duration, cognitive-decline, or consent-capacity items from Batches 8–9. |
| 17 | Health Promotion and Maintenance | Reproductive & Endocrine Health | dropdown_cloze | medium | Apply the CDC 2024 DMPA repeat-injection lane to an exact number of weeks since the last injection. Distinguish the on-time/two-week grace period from the more-than-15-week pathway, then select the pregnancy-certainty, seven-day backup, and emergency-contraception implications that actually follow. Do not mix combined-pill or ulipristal restart instructions into this item. |
| 18 | Physiological Adaptation | Respiratory & Infectious Disorders | dropdown_cloze | easy | Use symptoms, chest imaging/microbiologic context, and infectiousness cues to distinguish latent TB infection from active pulmonary TB disease, then select the corresponding airborne-isolation/public-health implication and the meaning of a positive screening test. Do not say a positive IGRA alone proves active disease, and do not treat latent infection as contagious. |

## 6. Source anchors

Every question needs `meta.source` pinned to the exact section, recommendation, equation, table, or
manufacturer/agency instruction supporting the key. A topic homepage is not enough. If the exact rule
cannot be opened and verified, block the row.

| Rows | Required source lane |
|---|---|
| 1 | An authoritative nephrology/dialysis source that explicitly supports dialysis-disequilibrium timing, neurologic cues, immediate response, and monitoring. A tertiary summary may orient the search but cannot be the sole pin for a keyed treatment rule. |
| 2 | Current GINA severe/life-threatening asthma exacerbation guidance, exact severity and acute-management passages: <https://ginasthma.org/reports/>. |
| 3 | Current DailyMed magnesium sulfate injection labeling for toxicity cues, monitoring, stopping therapy, and ordered reversal/support, plus an authoritative electrolyte reference if the label does not support the full differential: <https://dailymed.nlm.nih.gov/dailymed/>. |
| 4 | Alliance for Innovation on Maternal Health, severe-hypertension/preeclampsia patient-safety bundle, plus the exact ACOG severe-feature lane used: <https://saferbirth.org/psbs/severe-hypertension-in-pregnancy/>. |
| 5 | CDC, current measles infection-control guidance for health-care settings, exact triage/airborne/notification passages: <https://www.cdc.gov/infection-control/hcp/measles/>. |
| 6 | ASAM, *Clinical Practice Guideline on Alcohol Withdrawal Management*, exact transfer/escalation and complicated-withdrawal passages: <https://www.asam.org/quality-care/clinical-guidelines/alcohol-withdrawal-management-guideline>. |
| 7 | KDOQI 2019 Vascular Access Guideline and implementation tools, exact access-monitoring and urgent-referral cues: <https://www.kidney.org/professionals/kdoqi/guidelines-and-commentaries/vascular-access>. |
| 8 | An authoritative spinal-infection/epidural-abscess source that explicitly supports the keyed urgent red flags and diagnostic escalation. Cross-check IDSA's native vertebral osteomyelitis guideline: <https://www.idsociety.org/practice-guideline/vertebral-osteomyelitis/>. |
| 9 | AABB, *Circular of Information for the Use of Human Blood and Blood Components* (June 2024), corrected count increment equation and unit convention: <https://www.aabb.org/docs/default-source/default-document-library/resources/circular-of-information-watermark.pdf>. |
| 10 | Merck Manual Professional, *Hypernatremia*, exact free-water-deficit equation and limitations: <https://www.merckmanuals.com/professional/nephrology/electrolyte-disorders/hypernatremia>. The stem supplies TBW rather than asking the learner to choose a demographic coefficient. |
| 11 | Society for Endocrinology, *Emergency management of severe and moderately severely symptomatic hyponatraemia in adult patients*, exact monitoring and overcorrection lane: <https://www.endocrinology.org/media/xhrhxhxm/emergency-management-of-severe-and-moderately-severely-symptomatic-hyponatraemia-in-adult-patients-2022.pdf>. |
| 12 | AARC, *Clinical Practice Guideline: Spontaneous Breathing Trials for Liberation From Adult Mechanical Ventilation* (2024), including the recommendation that RSBI is not required alone for readiness: <https://www.aarc.org/wp-content/uploads/2023/11/CPG2024SpontaneousBreathingTrial.pdf>, plus the exact primary/professional source defining the equation. |
| 13 | CDC, rabies post-exposure prophylaxis guidance, exact wound-care, HRIG, prior-vaccination, immune-status, and vaccine-schedule passages: <https://www.cdc.gov/rabies/hcp/clinical-care/post-exposure-prophylaxis.html>. |
| 14 | 2025 U.S. Public Health Service occupational HIV-exposure/PEP guideline: <https://stacks.cdc.gov/view/cdc/183609/cdc_183609_DS1.pdf>. Do not use the 2025 nonoccupational guideline as the primary lane. |
| 15 | ASPEN, *Back to Basics: Parenteral Nutrition 101*, “How to Safely Wean PN” and glucose-monitoring passages: <https://nutritioncare.org/wp-content/uploads/2025/04/Back-to-Basics_Parenteral-Nutrition-101_Glanz.pdf>. The stem's individualized order owns the exact taper and check times. |
| 16 | *Clinical Practice Guidelines for the Use of Electroconvulsive Therapy* (2023), exact index/continuation/maintenance, monitoring, and ongoing-consent sections: <https://pmc.ncbi.nlm.nih.gov/articles/PMC10096214/>. |
| 17 | CDC, *U.S. Selected Practice Recommendations for Contraceptive Use, 2024*, “Timing of Repeat Injections” and late-DMPA passage: <https://www.cdc.gov/mmwr/volumes/73/rr/rr7303a1.htm> and <https://www.cdc.gov/contraception/hcp/usspr/injectables.html>. |
| 18 | CDC, current clinical overview and infection-control guidance for TB, exact latent-versus-active and infectiousness passages: <https://www.cdc.gov/tb/hcp/clinical-overview/latent-tuberculosis-infection.html> and <https://www.cdc.gov/tb/hcp/clinical-overview/tuberculosis-disease.html>. |

## 7. Explicit exclusions and semantic gates

- Do not reproduce any Batch 8 or Batch 9 equation, scoring excerpt, ordered template, cue-to-decision
  pathway, or close cosmetic variant. This includes ANC, DKA glucose-decline rate, ICE, ECT seizure
  duration, sleep efficiency, P/F ratio, wound area/depth change, MVU, GIR, missed-COC and ulipristal
  timelines, palliative symptom-plan templates, skin-tear care, and enteral-tube declogging.
- Do not reproduce the bundled anion-gap, Winter-formula, delta-gap, Parkland, oxygen-cylinder,
  maintenance-fluid, urine-output, QTcF, or Naegele-rule arithmetic.
- Do not reproduce existing oncology cases on checkpoint pneumonitis/myocarditis, malignant spinal
  cord compression, CAR-T escalation, tumor lysis syndrome, or neutropenic fever.
- Do not use copyrighted proprietary scoring tools or excerpts without a clear repository right to
  reproduce them.
- English is the primary exam surface. Every displayed field needs natural faithful Simplified-Chinese
  parity; highlight segmentation must map one-to-one.
- Use the manifest's exact category and canonical topic strings. SHARED topic licensing is not proof
  that a category fits the tested construct.

## 8. Format-specific gates

### Bowtie

- Alternative conditions genuinely compete until discriminating cues appear.
- Both actions are immediate and appropriate for the keyed condition.
- Both parameters track response or deterioration rather than repeat diagnostic cues.
- If the natural differential cannot support the bowtie, block it.

### Highlight

- Include at least one clinically plausible selectable near-miss.
- Keep the correct set bounded and aligned with the stated direction.
- Segment English and Chinese one-to-one without punctuation or clause-boundary key leakage.

### Fill in the blank

- One bounded response per item; no hidden multi-part answer.
- State the equation, units, time basis, and rounding rule in the stem.
- `acceptable` and `numeric` agree, and the key is independently recomputed.
- A number alone cannot be used to make a diagnosis or treatment decision the source does not support.

### Ordered response

- The key is a permutation of every option.
- Each step has a genuine serial or milestone constraint.
- Bundle simultaneous same-visit actions rather than inventing an internal rank.
- Time-sensitive decisions occur promptly, not after a later backup/follow-up interval.

### Dropdown cloze

- Each dropdown tests a separate inference and has one unambiguous option.
- Every option has an exact bilingual `byChoice` rationale.
- Do not make one dropdown's answer reveal the next mechanically.

## 9. Review handoff

The producer is not the content checker. GPT writes and validates only the three raw files. A separate
checker independently recomputes all calculations, opens every source pin, reviews the collision
preflight, and checks bilingual parity. Claude owns the clinical/content gate. Promotion,
consolidation, ledgering, census/coverage regeneration, and deletion of raw files happen only after
that review and are outside this commission.

## 10. Acceptance

- [ ] Three valid six-item raw banks exist at the exact paths; the producer returned a receipt, not JSON.
- [ ] Only those three new paths under `banks/banks-raw/` were written.
- [ ] Dry-run normalization and raw-file validation pass for all three banks.
- [ ] Collision preflight covered bundled standalone items, embedded leaves, and all live raw drafts.
- [ ] No case study, visual, rationale visual, silent substitution, or category/topic drift.
- [ ] All calculations and keyed clinical rules were independently checked against exact source passages.
- [ ] Producer and checker remain different seats; Claude content review remains pending.
