# Producer Commission — Scored-Format Batch 7

Date: 2026-07-16  
Status: **ready for generation**  
Producer: GPT-5.6 Sol (`gpt_` lane)  
Scope: 18 standalone, text-only questions in three independently runnable six-item files

## 1. Why this is a format order, not category rescue

The authoritative scored-leaf report generated from `INPUT_SHA`
`43a1087d48e1f622922abdd271d6d82f5f4a2b62` reports no category outside the standing tolerance,
no over-served category finding, and no standalone-capacity shortfall for a 50-question session.
Do not describe this batch as fixing category balance and do not move an item to a different category
to improve a histogram.

The remaining content opportunities are format-specific:

- `bowtie`: 148;
- `highlight`: 173;
- `fill_in_blank`: 201;
- `ordered_response`: 233; and
- `dropdown_cloze`: 271;

against an equal-average scored-format target of 303.8. The report's strongest topic/format
combinations drive this order. These are authoring suggestions, not a mandate to create weak filler.
If an assigned premise cannot support the named format with an unambiguous key and authoritative
source, stop and report the row as blocked; do not substitute a familiar topic or silently change its
category.

## 2. Deliverables

Return one valid JSON bank object per sub-batch, with no Markdown fence or commentary. Author against
the current schema in `NCLEX-Question-Schema.md`; this commission does not restate field shapes.

| Sub-batch | Exact contents | Raw filename |
|---|---|---|
| 7A | 6 `fill_in_blank` | `banks/banks-raw/gpt-format7a-fib-2026-07-16.json` |
| 7B | 6 `ordered_response` | `banks/banks-raw/gpt-format7b-ordered-2026-07-16.json` |
| 7C | 2 `bowtie` + 4 `highlight` | `banks/banks-raw/gpt-format7c-bowtie-highlight-2026-07-16.json` |

All 18 questions are standalone. No case studies, question visuals, rationale visuals, changes to
existing questions, or new clinical taxonomy are authorized. Use readable globally unique IDs with
the prefix `gpt_format7a_`, `gpt_format7b_`, or `gpt_format7c_` as applicable.

Aggregate distribution:

- Format: 6 fill-in-the-blank / 6 ordered response / 4 highlight / 2 bowtie.
- Category: 7 Physiological Adaptation / 4 Health Promotion and Maintenance / 4 Pharmacological and
  Parenteral Therapies / 2 Psychosocial Integrity / 1 Reduction of Risk Potential.
- Difficulty: 4 easy / 9 medium / 5 hard.

Category assignment follows the tested construct. It is not an attempt to manufacture a category
deficit that the scored-leaf report does not contain.

## 3. Exact assignment manifest

### Batch 7A — fill-in-the-blank

Every row must have one genuinely useful uncued response. Put the exact formula or scoring table in
the stem when more than simple clock arithmetic is involved. Do not test memory of a disputed
conversion factor. Use `numeric.value`, an explicit unit where applicable, and the narrowest
clinically defensible tolerance. None of these rows is a medication-dose calculation or generic
non-medication IV-fluid calculation.

| # | Category | Canonical topic | Difficulty | Mandated assessment target |
|---|---|---|---|---|
| 1 | Physiological Adaptation | Electrolyte Imbalances | medium | Hyperglycemia with dysnatremia. Supply the selected corrected-sodium equation in the stem and ask for the corrected sodium. The keyed construct is electrolyte interpretation, not DKA/HHS treatment or fluid selection. State the rounding rule and conventional units. |
| 2 | Physiological Adaptation | Electrolyte Imbalances | hard | Hyperosmolar physiology. Supply the exact effective-osmolality equation and all needed conventional-unit values, then ask for the result. Do not mix effective osmolality with total osmolality or ask the learner to infer which formula the author preferred. |
| 3 | Physiological Adaptation | Respiratory & Infectious Disorders | medium | Adult community-acquired pneumonia. Provide every CURB65 input explicitly and ask for the total score only. Do not turn the item into an uncued disposition recommendation; clinical judgment remains necessary in addition to the score. |
| 4 | Physiological Adaptation | Sepsis & Septic Shock | hard | Adult sepsis-associated organ dysfunction. Supply the complete scoring excerpt needed for a bounded SOFA-component or aggregate calculation and ask for one numeric result. Do not require recall of an unstated table and do not use qSOFA as a stand-alone rule-out test. |
| 5 | Pharmacological and Parenteral Therapies | Transfusion & Blood Products | easy | A prescribed packed-red-cell volume and administration duration are explicit. Ask for the pump rate in mL/hr using one-step arithmetic. This remains `Transfusion & Blood Products`; blood-product calculations do not migrate to `IV Fluid Calculations` or medication-only `Dosage Calculations`. |
| 6 | Pharmacological and Parenteral Therapies | Transfusion & Blood Products | medium | A blood product has a stated total volume, start time, volume already infused, and closed-world completion deadline from the order/facility policy. Ask for the revised mL/hr needed to complete within that supplied deadline. Do not invent a universal product time limit. |

### Batch 7B — ordered response

Every option must participate in the keyed permutation. The stem must make the local sequence
closed-world; a reviewer must not need to guess which institution-specific step happens first.

| # | Category | Canonical topic | Difficulty | Mandated assessment target |
|---|---|---|---|---|
| 7 | Psychosocial Integrity | Substance Use & Withdrawal | medium | A hospitalized adult has suspected alcohol withdrawal without current seizure or delirium. Order the supplied pathway: focused severity/risk assessment, notification and prescribed protocol initiation, supportive monitoring, then reassessment/escalation based on response. Do not invent benzodiazepine doses. |
| 8 | Psychosocial Integrity | Substance Use & Withdrawal | hard | An ambulatory alcohol-withdrawal plan becomes unsafe because serial findings cross explicit transfer criteria supplied in the stem. Order reassessment, urgent escalation/transfer, stabilization/support during transfer, and handoff of the withdrawal history and treatment already given. Do not treat withdrawal management as definitive AUD treatment. |
| 9 | Reduction of Risk Potential | Burn Management | easy | A dry-chemical exposure is limited to skin and the client is stable. The stem supplies the applicable poison-control/burn-center pathway. Order staff protection, removal of contaminated clothing/dry material, then the specified irrigation and reassessment/escalation steps. Do not generalize this sequence to reactive metals or chemicals for which water is contraindicated. |
| 10 | Physiological Adaptation | Burn Management | hard | A circumferential extremity burn develops worsening distal perfusion findings. Order the supplied escalation pathway from immediate neurovascular reassessment and limb positioning through burn-team notification, prescribed intervention preparation, and post-intervention perfusion reassessment. Do not reopen burn-resuscitation calculations. |
| 11 | Pharmacological and Parenteral Therapies | Parenteral Nutrition | medium | Order a closed-world PN administration safety sequence: verify the current order and product label, inspect the bag and dedicated access, apply the specified filter/tubing and pump setup, initiate as ordered, then monitor the supplied parameters. Do not invent filter size or compatibility rules; the stem/source must supply them. |
| 12 | Pharmacological and Parenteral Therapies | Parenteral Nutrition | medium | Order a home-PN transition sequence: identify the responsible prescriber/team, reconcile and transmit the PN order plus laboratory-monitoring plan, verify supplies/access-care competence and contacts, then confirm follow-up/result ownership. Do not let generic discharge planning displace the load-bearing PN construct. |

### Batch 7C — bowtie and highlight

The bowties are authorized only if the differential, actions, and parameters are all natural for the
specific self-management vignette. A forced “condition” invented to fill a bowtie cell fails review.
Each highlight passage needs at least one clinically plausible selectable distractor, and the correct
set must be bounded rather than “highlight most of the note.”

| # | Category | Canonical topic | itemType | Difficulty | Mandated assessment target |
|---|---|---|---|---|---|
| 13 | Health Promotion and Maintenance | Chronic Disease Management & Lifestyle | bowtie | medium | A client with diabetes has recurrent activity-associated hypoglycemia because the existing self-management plan does not account for a new exercise routine. Competing conditions must remain plausible until the supplied glucose/activity pattern resolves them. Key two plan-alignment actions and two follow-up parameters; do not ask the nurse to prescribe an insulin dose. |
| 14 | Health Promotion and Maintenance | Chronic Disease Management & Lifestyle | bowtie | hard | Home monitoring in a client with chronic heart failure shows a supplied action-plan threshold has been crossed. Distinguish worsening fluid retention from a stable day-to-day fluctuation using closed-world findings, then key two actions already authorized by the plan and two outcome parameters. Do not substitute an acute-resuscitation item or invent a universal weight threshold. |
| 15 | Health Promotion and Maintenance | Chronic Disease Management & Lifestyle | highlight | easy | A diabetes self-management note contains individualized goals, monitoring, problem-solving, and referral/support elements plus plausible but inadequate generic instructions. Highlight the elements that make the plan actionable and individualized. |
| 16 | Health Promotion and Maintenance | Chronic Disease Management & Lifestyle | highlight | easy | A chronic-condition follow-up note documents a changed life circumstance that makes the old plan infeasible. Highlight cues and actions supporting reassessment, shared goal revision, teach-back, and connection to appropriate self-management support; leave generic admonitions and blame language unselected. |
| 17 | Physiological Adaptation | Sepsis & Septic Shock | highlight | medium | An adult triage narrative contains possible infection plus evolving organ-dysfunction cues and benign distractors. Highlight only the cues that require immediate sepsis evaluation/escalation under the cited guideline; do not make a single screening score the diagnosis. |
| 18 | Physiological Adaptation | Sepsis & Septic Shock | highlight | medium | A serial sepsis reassessment note mixes improvement, persistent hypoperfusion/organ-dysfunction cues, and unrelated stable findings. Highlight the findings that require continued escalation or treatment reassessment under the supplied clinical context. |

## 4. Source anchors

Every item must carry a checkable `meta.source` that pins the exact section, recommendation, table, or
formula supporting its keyed rule. A topic homepage alone is insufficient. The producer may use a
newer authoritative replacement if it explicitly identifies the superseded source and the reviewer
confirms the replacement.

| Rows | Required source lane |
|---|---|
| 1–2 | NCBI Bookshelf/Endotext hyperglycemic-crisis material for the exact equation used. Put the equation in the stem because correction factors and osmolality definitions vary by source: <https://www.ncbi.nlm.nih.gov/books/NBK620700/>. |
| 3 | NICE NG250, adult pneumonia assessment, Box 2 CURB65: <https://www.nice.org.uk/guidance/ng250/chapter/Recommendations>. |
| 4, 17–18 | Current SCCM Surviving Sepsis Campaign adult guideline and the exact linked recommendation/table used: <https://www.sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines>. |
| 5–6 | AABB June 2024 Circular of Information plus the explicit product order/facility deadline supplied in the stem: <https://www.aabb.org/news-resources/resources/circular-of-information>. |
| 7–8 | ASAM Clinical Practice Guideline on Alcohol Withdrawal Management, with the exact level-of-care/monitoring/transfer recommendations pinned: <https://www.asam.org/quality-care/clinical-guidelines/alcohol-withdrawal-management-guideline>. |
| 9–10 | American Burn Association clinical-practice-guideline lane. Pin the exact chemical-burn or perfusion/escharotomy source used; the ABA index is only the starting point: <https://www.ameriburn.org/quality-care/clinical-practice-guidelines>. |
| 11–12 | ASPEN PN Care Pathway and the exact linked administration or care-transition resource: <https://nutritioncare.org/clinical-resources/enteral-nutrition/aspen-parenteral-nutrition-care-pathway/>. |
| 13–16 | CDC chronic-condition/DSMES material plus a current disease-specific professional guideline for any threshold or action-plan claim: <https://www.cdc.gov/chronic-disease/living-with/index.html> and <https://www.cdc.gov/diabetes/education-support-programs/index.html>. |

The producer does not get to convert a source gap into a confident answer. If the exact keyed rule is
not supported, the row is blocked.

## 5. Semantic and taxonomy gates

- Use the exact category and canonical topic strings in the manifest.
- `Dosage Calculations` remains medication-only. None of Batch 7A is a medication-dose, dilution,
  titration, or medication-infusion calculation.
- `IV Fluid Calculations` is only prescribed non-medication IV-fluid arithmetic. It does not absorb
  the two blood-product calculations.
- Burn calculations remain `Burn Management`, but this order deliberately commissions no new burn
  arithmetic and does not reopen the closed 36-item burn audit population.
- Parent scenarios, administration routes, and the presence of an IV do not override the tested
  construct.
- SHARED topic licensing is not semantic proof. The two Burn rows use different categories because
  their tested constructs differ; do not copy the category from another burn item.
- Do not use any `AVOID_TOPICS` subject as a substitute for a difficult assigned row.
- Preserve English-first exam wording and faithful Simplified-Chinese parity on every displayed field.

## 6. Format-specific gates

### Fill in the blank

- One bounded response per item; no multi-step response hidden in one blank.
- State equations, units, time basis, and rounding in the stem.
- `acceptable` values and `numeric` metadata must agree.
- Recompute every key independently during review.
- A calculation that does not improve the clinical construct should be rejected, not retained for
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
- Both parameters must confirm response or deterioration; decoy parameters must be plausibly tempting
  but truly non-discriminating.
- If either chronic-disease premise cannot meet this floor, block it. Do not weaken the differential.

### Highlight

- At least one selectable distractor must be a real near-miss.
- The correct set must be bounded and answer the stated task.
- English and Chinese segmentation must map one-to-one.

## 7. Review and promotion chain

No generated question is reviewed by its producer.

1. GPT-5.6 Sol generates each six-item raw file independently.
2. Normalize programmatically; never repair JSON shape by retyping it.
3. Validate each raw file.
4. A non-GPT checker independently recomputes all Batch 7A arithmetic and verifies every source
   anchor, key, category/topic pair, and bilingual response.
5. Claude performs the content gate, with special attention to ordered-response sequence necessity,
   bowtie differential quality, and highlight cue boundaries.
6. Promote, audit with raw plus staged files present, consolidate, update the review ledger, regenerate
   census/coverage, and delete raw files only after the canonical merge passes.

Minimum post-merge path:

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

## 8. Acceptance

- [ ] Three valid six-item raw banks with the exact filenames and manifest distributions.
- [ ] No case study or visual content.
- [ ] All arithmetic independently recomputed; all source pins support the keyed rule.
- [ ] No category/topic pair changed for histogram convenience.
- [ ] No `case_study`, category-rescue claim, or clinical-threshold invention enters the batch.
- [ ] Producer and checker are different seats; Claude content gate completed.
- [ ] Promotion, consolidation, ledger update, census regeneration, and full verification pass.
