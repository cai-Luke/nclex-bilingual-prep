# Producer Commission — Direct Case Pilot C: Intrapartum Fetal Assessment Rerun

Date: 2026-07-19

Status: **ready for producer dispatch**

Producer: one fresh GPT-5.6 Sol instance (`gpt_` lane)

Scope: one hard unfolding `case_study`, normally 5–6 embedded scored parts, with no standalone
companion item

Governing producer contract:
[`GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md`](GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md)

## 1. Experiment purpose

This is a controlled rerun of the Pilot A clinical room under the revised direct-case producer
contract. Author a new coherent intrapartum case from the commission and live sources; do not patch,
copy, translate, or use the held Pilot A raw output as a template.

The original Pilot A spec and raw draft remain preserved as the baseline control. They are not
promotion candidates and do not occupy this premise for collision purposes. Do not open or derive
content from:

- `GPT-DIRECT-CASE-PILOT-CASE-A-SPEC-2026-07-18.md`;
- `banks/banks-raw/gpt-direct-case-pilot-case-a-2026-07-18.json`.

Pilot B is also an excluded control. Continue to inspect all other named comparators and live raw
drafts as required by the common contract.

The objective is to test whether an explicit blueprint, visibility contract, claim allocation, stage-
transition review, independent-evidence accounting, and pairwise leakage audit produce a cleaner
one-pass draft without removing producer ownership.

## 2. Required final disk state

Create exactly:

`banks/banks-raw/gpt-direct-case-pilot-case-c-2026-07-19.json`

Before writing, confirm that the path is absent. If it exists, stop and report the collision. The file
must contain one complete current-schema bank object with exactly one top-level case container and no
standalone item.

Use readable globally unique IDs under:

`gpt_casepilot_2026_07_19_c_`

Only the target raw path may be created or changed. All other disk, schema, source, validation,
review, and receipt rules come from the common contract.

## 3. Case affordance

The case must be one unfolding intrapartum episode, not several fetal-monitoring questions sharing a
client.

It must include:

- a real baseline stage mapped to Part 1;
- a later labor event that changes the supported whole-picture interpretation, urgency, or next
  action;
- integration of maternal condition, labor progress, uterine activity, and fetal assessment;
- source-supported nursing action and required review/escalation at the stage where it becomes due;
- reassessment after intervention;
- a closing decision about recovery, continued close observation, urgent obstetric review, or
  preparation for expedited birth.

At least two parts must require comparison across time or exhibits. At least one part must evaluate
outcomes after an intervention. Every part must have a distinct scored construct and response demand.

## 4. Collision fences

Inspect every item below and do not repeat its occupied construct as an embedded leaf:

| Existing item | Occupied construct |
|---|---|
| `fhr_gemini_smoke_2026_06_13_03` and `gpt_deepen_2026_06_23_bow_04` | Identify recurrent late decelerations during oxytocin and select generic intrauterine-resuscitation actions. |
| `fhr_gemini_smoke_2026_06_13_04` | Recognize variable decelerations immediately after membrane rupture and choose the standard initial actions. |
| `fhr_gemini_smoke_2026_06_13_05` | Classify actions for a prolonged deceleration after epidural-associated maternal blood-pressure decline. |
| `gpt_fmtgap_2026_07_14_hl_fetal_tachysystole_08` and `gpt_balance2_2026_07_15_or_intrapartum_fetal_monitoring_16` | Recognize tachysystole and reproduce a fixed oxytocin/prostaglandin response sequence. |
| `gpt_balance6a_2026_07_16_hl_intrapartum_fetal_monitoring_15` | Highlight the published acute-bradycardia/prolonged-deceleration escalation actions. |
| `gpt_format9a_suspected_uterine_rupture` | Diagnose suspected uterine rupture from VBAC, station loss, shock, and prolonged fetal bradycardia. |
| `gpt_balance3_2026_07_16_bt_intrapartum_fetal_monitoring_18` | Diagnose intraamniotic infection from fever, uterine/amnionic cues, and fetal tachycardia. |
| `gpt_balance5_2026_07_16_hl_intrapartum_fetal_monitoring_18` | Verify maternal-heart-rate artifact before diagnosing fetal bradycardia. |

The facts may appear incidentally, but the scored demand may not materially reproduce the occupied
cue-response pathway. The case should turn on trajectory, whole-picture synthesis, review/escalation,
and response to intervention.

## 5. Clinical brief

**Container classification:** `Reduction of Risk Potential` / `Intrapartum Fetal Monitoring` / hard.

A term client undergoes induction or augmentation of labor. The opening maternal and fetal picture is
sufficiently reassuring to establish a true baseline. A later labor event changes fetal assessment
and/or uterine activity. The team performs source-supported nursing measures, obtains the review or
escalation required by the current whole picture, and reassesses.

The producer chooses the exact trigger and progression. Do not reproduce the original Pilot A story.
The whole clinical picture and change over time must be load-bearing.

## 6. Topic-specific blueprint requirements

In addition to the common blueprint, explicitly record:

- the exact comparator basis for every change-over-time CTG claim;
- whether the comparison is from the start of labor, the preceding hourly review, or another exact
  source-supported interval;
- maternal, labor-progress, uterine-activity, and fetal evidence available at each part;
- the review/escalation that occurs before any subsequent diagnostic or stimulation maneuver;
- why the closing stage supports no stronger conclusion than the keyed outcome.

If a NICE feature depends on change from baseline or the preceding hourly review, either make the
observations exactly one hour apart or explicitly establish another qualifying comparator from the
source. Do not present a convenient longer interval as if it were the published criterion.

## 7. Governing source lanes

- NICE NG229, *Fetal monitoring in labour*, current recommendations and update record, especially
  whole-picture assessment, change over time, CTG features, escalation, reassessment, continued CTG,
  and fetal scalp stimulation:
  <https://www.nice.org.uk/guidance/ng229/chapter/Recommendations>
- ACOG Clinical Practice Guideline No. 10, *Intrapartum Fetal Heart Rate Monitoring:
  Interpretation and Management* (2025), only when the exact supporting passage is accessible. The
  PubMed record or landing page alone is not a passage-level pin:
  <https://pubmed.ncbi.nlm.nih.gov/40966736/>
- For any deterministic `fetal_monitoring` visual, use the current morphology, placement, metadata,
  and `selfCheck` contract in `NCLEX-Question-Schema.md` and its linked source-verification record.

Conditional source guards:

- If ongoing oxytocin is used as an indication for continued CTG, pin the exact NICE recommendation
  supporting that claim, including recommendation 1.3.8 when applicable.
- If the case uses suspicious CTG plus meconium followed by fetal scalp stimulation, explicitly chart
  the senior-midwife or obstetric review required before stimulation and pin the exact recommendation.
- Use Chinese terminology that means finger-performed fetal scalp stimulation, such as
  `指法胎儿头皮刺激`; do not use language implying digital/electronic stimulation.

Do not key routine maternal oxygen when maternal hypoxia is absent. Do not invent an oxytocin,
tocolytic, fluid, or anesthesia dose. A source-pinned local order may grade an exact dose or sequence,
but it may not replace external clinical truth.

## 8. Visual scope

The case may use one deterministic `fetal_monitoring` exhibit visual when it is load-bearing. Do not
place multiple fetal-monitoring visuals in one case because the registered proof metadata is
question-level and cannot independently prove separate staged tracings.

If a visual is used:

- keep its caption neutral;
- provide exact current question-level metadata and `selfCheck` proof;
- show remaining temporal changes through staged chart exhibits;
- confirm that removing the tracing changes at least one answer.

If no visual is used, the receipt must explain how the staged chart data still require serial fetal
and uterine interpretation rather than prose recall.

## 9. Checker handoff

After production, Codex/checker runs:

```bash
npm run normalize-raw-bank -- banks/banks-raw/gpt-direct-case-pilot-case-c-2026-07-19.json
npm run validate-bank -- banks/banks-raw/gpt-direct-case-pilot-case-c-2026-07-19.json
```

Codex/checker must also verify that every embedded part has a resolving
`answerableAfterStageId`, Part 1 sees only the declared baseline stage plus invariant top-level
content, and no source-defined comparator was transformed. This must include the common contract's
non-writing raw-file anchor assertion; `validate-bank` and the current bundled-bank
`audit:stage-refs` command are not sufficient because they do not reject an omitted anchor in this
raw draft.

The producer receipt and final acceptance requirements are those in the common contract.
