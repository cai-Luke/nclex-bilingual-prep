# Producer Commission — Direct Case Pilot D: Severe Asthma With Serial ABGs Rerun

Date: 2026-07-19

Status: **ready for producer dispatch**

Producer: one fresh GPT-5.6 Sol instance (`gpt_` lane)

Scope: one hard unfolding `case_study`, normally 5–6 embedded scored parts, with no standalone
companion item

Governing producer contract:
[`GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md`](GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md)

## 1. Experiment purpose

This is a controlled rerun of the Pilot B clinical room under the revised direct-case producer
contract. Author a new coherent respiratory-deterioration case from the commission and live sources;
do not patch, copy, translate, or use the held Pilot B raw output as a template.

The original Pilot B spec and raw draft remain preserved as the baseline control. They are not
promotion candidates and do not occupy this premise for collision purposes. Do not open or derive
content from:

- `GPT-DIRECT-CASE-PILOT-CASE-B-SPEC-2026-07-18.md`;
- `banks/banks-raw/gpt-direct-case-pilot-case-b-2026-07-18.json`.

Pilot A is also an excluded control. Continue to inspect all other named comparators and live raw
drafts as required by the common contract.

The objective is to test whether explicit claim allocation, serial-context accounting, stage-
transition review, distinct response demands, independent-evidence accounting, and pairwise leakage
review produce a cleaner one-pass case.

## 2. Required final disk state

Create exactly:

`banks/banks-raw/gpt-direct-case-pilot-case-d-2026-07-19.json`

Before writing, confirm that the path is absent. If it exists, stop and report the collision. The file
must contain one complete current-schema bank object with exactly one top-level case container and no
standalone item.

Use readable globally unique IDs under:

`gpt_casepilot_2026_07_19_d_`

Only the target raw path may be created or changed. All other disk, schema, source, validation,
review, and receipt rules come from the common contract.

## 3. Case affordance

The case must be one unfolding severe-asthma episode, not several asthma or acid-base questions about
one client.

It must include:

- a true initial stage mapped to Part 1;
- evolving bedside respiratory findings and serial arterial blood gases;
- at least one later change in ventilation or fatigue that alters priority;
- the review or escalation required at the stage where it becomes due;
- treatment and reassessment;
- a closing evaluation whose conclusion is limited by the support conditions under which the
  measurements were obtained.

Serial ABG integration must be load-bearing in at least two parts, but the parts may not ask two
versions of the same acid-base classification. At least one part must integrate the ABG trajectory
with work of breathing, air entry, speech, mental status, oxygenation, or fatigue. Every part must
have a distinct scored construct and response demand.

## 4. Collision fences

Inspect every item below and do not repeat its occupied construct as an embedded leaf:

| Existing item or case | Occupied construct |
|---|---|
| `gpt_format10a_life_threatening_asthma_reduced_air_entry` | Diagnose life-threatening asthma from drowsiness, hypoxemia, quiet chest/reduced air entry, and low peak flow, then select immediate actions/monitoring. |
| `claude_a_matrix_asthma_06`, `gemini_jun05_a_matrix_asthma_exacerbation_07`, and `gpt_canonical_matrix_asthma_exacerbation_065` | Sort one-time post-treatment findings into improving versus deteriorating asthma. |
| `cap_gpt_2026_07_02_t03_006` | Interpret the shark-fin capnogram and rising airway pressure in already-intubated status asthmaticus. |
| `cs_asthma_01` | Pediatric outpatient action-plan zones, triggers, medications, and inhaler teaching. |
| `cs_copd_01` | COPD exacerbation with one ABG snapshot, generic treatment ordering, and two-hour improvement. |
| `opus2_case_postop_opioid_respiratory_depression_01` and `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01` | Opioid/OSA hypoventilation, naloxone escalation, and recurrent-sedation monitoring. |
| `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01`, `gpt_2026_06_19_case_ici_pneumonitis_01`, and `gpt_case_gbs_respiratory_compromise_01` | PE/RV strain, checkpoint pneumonitis, and neuromuscular respiratory-failure pathways. |
| `gpt_balance2_2026_07_15_bt_abg_acid_base_interpretation_18` and `sa_acid_base_01` | Single-snapshot respiratory-acidosis recognition in postoperative hypoventilation or chronic compensation. |

The case must turn on the serial relationship between bedside findings and ventilation. Do not
reproduce the quiet-chest cue cluster as the main scored recognition, ask only for generic respiratory
acidosis, or duplicate the existing intubated-asthma capnography inference.

## 5. Clinical brief

**Container classification:** `Physiological Adaptation` / `Respiratory & Infectious Disorders` /
hard.

Embedded parts whose actual scored construct is ABG interpretation should use `Reduction of Risk
Potential` / `ABG & Acid-Base Interpretation`.

An adult with an acute severe asthma exacerbation is treated in an emergency or critical-care
setting. Clinical work of breathing, air entry, speech, mental status, oxygenation, and serial ABGs
evolve over time. Initial data must not disclose the whole case. A later ventilation/fatigue change
alters the priority and prompts source-supported escalation; subsequent reassessment closes the loop.

The producer chooses the exact trigger, progression, and whether the endpoint remains pre-intubation
or proceeds to intubation. Do not reproduce the original Pilot B story.

The final receipt must record the airway-path decision: whether intubation was considered, whether the
case remained pre-intubation or proceeded through intubation, and why. If the case remains
pre-intubation, distinguish a deliberate clinical-design choice from a source-scope guard that fired
because adequate post-intubation support was unavailable. This records whether the Case B failure
class was exercised, avoided by design, or actively blocked by the revised contract.

## 6. Mandatory serial-context blueprint

In addition to the common blueprint, create an internal row for every ABG or load-bearing respiratory
measurement with:

- clock time;
- oxygen device, delivered concentration or equivalent support context;
- noninvasive or invasive ventilation status and relevant settings when applicable;
- bronchodilator or other intervention since the prior measurement, without invented doses;
- bedside work of breathing, air entry, speech, mental status, and fatigue;
- PEF or FEV1 basis and denominator when used;
- ABG values;
- intended inference;
- maximum defensible conclusion.

The final receipt must summarize whether support context is comparable for every keyed serial
inference.

Do not treat better PaO2, SaO2, or SpO2 under unspecified or materially increased support as proof of
improved underlying oxygen-transfer physiology. State only what the contextualized measurements
support.

## 7. Governing source lanes

- GINA, *Global Strategy for Asthma Management and Prevention*, 2026, exact acute-care exacerbation
  assessment, ABG, treatment, reassessment, and escalation passages:
  <https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf>
- Any keyed ventilation, oxygen, ABG, intubation, or post-intubation claim not covered by GINA
  requires an exact current professional guideline, primary source, or named valid facility protocol.

Source-fidelity guards:

- When using GINA's explicit ABG indication based on lung function, preserve `PEF or FEV1 below 50%
  predicted`. Do not substitute percent of personal best.
- Do not treat failed home rescue-inhaler use as GINA's failure to respond to initial treatment in the
  acute-care setting.
- Do not convert a related severe-asthma warning into an exact named criterion unless the source does
  so.
- GINA places ICU management outside the report's scope. If the case includes intubation or a keyed
  post-intubation evaluation, obtain an additional exact source or valid named local protocol before
  retaining those claims. If that support is unavailable, end the case before intubation or redesign
  the closing part.

Do not invent bronchodilator, corticosteroid, magnesium, sedative, paralytic, oxygen, or ventilator
doses/settings. Use a source-pinned closed-world order or protocol when an exact sequence or setting
must be graded.

## 8. Transition and evidence guards

At any stage showing worsening fatigue, increasingly limited speech, falling PEF/FEV1, impaired air
entry, altered mental status, or PaCO2 moving from low toward normal/high despite clinical worsening,
assess whether senior and critical-care escalation is already required concurrently with treatment.
Do not defer escalation merely to obtain another ABG when the existing combined evidence makes delay
clinically indefensible.

Do not double-count one ventilation finding. In particular, a current PaCO2 value and a trajectory
whose endpoint is that same value are not independent keyed evidence unless the part genuinely asks
two distinguishable judgments.

A later part may use the consequences of an earlier deterioration, but it may not restate the full
ABG trajectory, name respiratory failure, and expose airway escalation if an earlier part asks the
learner to infer those conclusions.

## 9. Item and visual scope

Use at least three embedded formats only when each supports a distinct response demand. For
`dropdown_cloze`, use simple dropdown IDs such as `dd1`–`dd3` and byte-exact placeholders in both
languages.

Deterministic capnography or structured measurements are optional. Use them only when they add a
distinct inference and pass the current registered/schema contract. Do not reproduce the existing
already-intubated shark-fin/rising-airway-pressure construct.

If structured measurements are used, preserve each value's source time, unit, support context, and
population. Do not place interpretive labels or answer-revealing flags into the table.

## 10. Checker handoff

After production, Codex/checker runs:

```bash
npm run normalize-raw-bank -- banks/banks-raw/gpt-direct-case-pilot-case-d-2026-07-19.json
npm run validate-bank -- banks/banks-raw/gpt-direct-case-pilot-case-d-2026-07-19.json
```

Codex/checker must also verify:

- every embedded part has a resolving `answerableAfterStageId`;
- dropdown placeholders exactly match IDs in both languages;
- every GINA criterion preserves its original operands, denominator, setting, and timing;
- every post-intubation claim has an additional valid source;
- every keyed serial comparison records support context;
- escalation occurs at the first stage where the combined findings require it;
- no current value and containing trajectory are double-counted;
- the pairwise leakage matrix remains clear under unrestricted navigation;
- the receipt records the airway-path decision and whether the post-intubation source-scope guard was
  exercised, avoided by design, or not applicable;
- the common contract's non-writing raw-file anchor assertion passes; `validate-bank` and the current
  bundled-bank `audit:stage-refs` command are not sufficient for omitted anchors in this raw draft.

The producer receipt and final acceptance requirements are those in the common contract.
