# Producer Commission — Direct Case Pilot

Date: 2026-07-18

Status: **ready for generation**

Producer: GPT-5.6 Sol (`gpt_` lane)

Scope: target two unfolding `case_study` containers in one raw bank, normally 5–6 embedded scored
parts per case; no standalone companion items; one-case blocked outcome authorized only by Section 5

## 1. Commission purpose

This is the first episodic direct-GPT case commission after retirement of the Opus-skeleton pipeline.
It is a content pilot, not a replacement standing pipeline and not a request for new architecture.

The bank already has substantial case volume. These cases are commissioned for **case affordance**:
information must change over time, later data must alter the clinical interpretation or priority, the
learner must integrate more than one exhibit, and reassessment must close the loop after an
intervention. A diagnosis-themed bundle of otherwise independent questions does not satisfy this
order.

The producer owns most authorship decisions. Section 6 fixes the clinical rooms and divergence
fences; it does not prescribe twelve row-level assignments.

## 2. Required final disk state

Do **not** return question JSON in chat. Use repository read/write tools to create exactly this path:

`banks/banks-raw/gpt-direct-case-pilot-2026-07-18.json`

Before writing, confirm that the path is absent. If it exists, stop and report the collision; do not
overwrite, rename, or create an alternate copy. The file must contain one complete valid bank object
with two top-level case containers, except for the one-case blocked outcome authorized by Section 5,
and no Markdown fences, sidecar notes, or partial files.
Author to the current [`NCLEX-Question-Schema.md`](NCLEX-Question-Schema.md) contract and use the
current `2.0` bank schema version verified in `src/types.ts`.

Only the target raw path may be created or changed. Do not edit tracked files, canonical banks,
existing raw drafts, schema, ledger, census, history, decisions, or this spec. Do not run promotion,
consolidation, or any command that treats the draft as reviewed content.

The producer seat has repository read/write tools but no shell execution. After writing, report
`normalization and validation deferred to Codex/checker (no command execution in producer seat)`.
Codex/checker will run the commands in Section 9.

## 3. Producer-owned design space

For each primary brief, the producer owns:

- the patient identity and clinically relevant history;
- the exact trigger within the commissioned episode;
- stage count, stage boundaries, timestamps, and narrative progression;
- exhibit selection and composition;
- the 5–6 embedded item formats and their order;
- the specific nursing decisions, distractors, rationales, strategy text, and glossary;
- the distribution of natural `ngnSkill` values and difficulty within a hard case.

Do not recreate the retired one-question-per-NCJMM-step skeleton. Use at least three embedded formats
per case, but do not force a format that does not fit the decision. `bowtie` cannot be embedded under
the current schema. Do not add a standalone bowtie or any other companion item.

Use readable globally unique IDs under a common `gpt_casepilot_2026_07_18_` prefix. English is the
primary exam surface. Every learner-visible field must have natural, clinically faithful Simplified
Chinese parity; do not translate chart data into a different clinical claim.

## 4. Case-worthiness and no-leakage gates

Each delivered case must satisfy all of the following:

1. At least one later stage changes the supported interpretation, urgency, or next action.
2. At least two embedded parts require integration across exhibits or across time; they cannot be
   answered from one isolated sentence or value.
3. At least one intervention is followed by new evidence that supports a genuine evaluation-of-
   outcomes decision.
4. The episode remains coherent from baseline through reassessment. Do not use six unrelated facts
   about one diagnosis as a substitute for unfolding reasoning.
5. Every part has a distinct response demand. Do not ask the same recognition or action question in
   multiple formats.

The application allows the learner to navigate directly to any part before aggregate submission.
Selecting a later part can reveal its cumulative stages even when earlier parts are unanswered.
Therefore, audit the case under this adversarial assumption: **the learner may read every part stem,
choice, and stage before answering Part 1.** A later stem, option, exhibit, caption, rationale-free
prompt, or chart label must not disclose an earlier keyed answer. Top-level `caseStudy.exhibits` are
visible from the start and must never contain data intended to be stage-gated.

Every `stageId` and `answerableAfterStageId` used by an embedded part must byte-exactly match a
declared `caseStudy.stages[].id`. An unresolved reference is blocking because the current renderer
fails open and may expose all stages. Opening parts may omit stage metadata when they depend only on
permanently visible baseline exhibits.

The producer must perform a final cross-part leakage read from the last part back to Part 1 and report
the result in the receipt. If leakage cannot be removed without weakening the case, block the premise
rather than assuming sequential locking.

## 5. Collision preflight and blocked-premise policy

Codex's bounded corpus screen covered the current bundled banks by target topic, relevant case title,
stem mechanism, and the released Batch 8–11 constructs. It found no existing intrapartum fetal-
monitoring case container, but it found several occupied leaf constructs in that lane. It also found
multiple respiratory deterioration cases and asthma/ABG standalones that sharply constrain Case B.
The nearest comparators and required divergence are part of each brief below.

Before authoring, the producer must inspect:

- every primary comparator named in Section 6, plus the Section 7 comparators if the reserve is used;
- every live JSON draft under `banks/banks-raw/`; and
- any additional canonical item surfaced by a direct phrase, mechanism, equation, or response-demand
  search while drafting.

After drafting, compare every embedded part against the named comparators, the other parts in its own
case, the other commissioned case, and all live raw drafts. Compare the decisive cue cluster, tested
inference, keyed pathway, serial template, and scoring demand—not merely wording, demographics, or
format. A case wrapper does not make an occupied standalone construct new.

If one primary case cannot clear collision, current-source, internal-coherence, or no-leakage review,
use the single reserve in Section 7. The reserve is not elective. Report the blocked primary, nearest
conflicting ID or source gap, and reserve use. If both primaries block, use the reserve for only one
and deliver one valid case; do not invent a second substitute.

## 6. Primary case briefs

### Case A — evolving intrapartum fetal assessment

**Container classification:** `Reduction of Risk Potential` / `Intrapartum Fetal Monitoring` / hard.

**Clinical room:** A term client undergoes induction or augmentation of labor. The opening maternal
and fetal picture is sufficiently reassuring to establish a baseline. A later labor event changes
the fetal tracing and/or uterine activity; the team performs source-supported nursing measures and
reassesses. The closing stage must require the learner to decide whether the combined maternal,
labor-progress, uterine-activity, and fetal evidence supports recovery, continued close observation,
urgent obstetric review, or preparation for expedited birth.

The producer chooses the exact trigger and narrative. The case must make *change over time* and the
whole clinical picture load-bearing. It may use one deterministic `fetal_monitoring` exhibit visual
when that materially improves the case. Do not place multiple fetal-monitoring visuals in one case:
the registered kind's proof metadata is question-level, so separate staged tracings cannot carry
independent `expected_pattern` proofs. Show the remaining temporal changes through staged chart
exhibits. If a visual is used, the tracing must carry the exact question-level metadata and
`selfCheck` proof required by the registered kind. If it is not, the receipt must state how the chart
exhibits still require serial fetal/uterine interpretation rather than prose recall.

**Occupied comparators and divergence fences:**

| Existing item | Occupied construct the new case must not repeat as an embedded leaf |
|---|---|
| `fhr_gemini_smoke_2026_06_13_03` and `gpt_deepen_2026_06_23_bow_04` | Identify recurrent late decelerations during oxytocin and select generic intrauterine-resuscitation actions. |
| `fhr_gemini_smoke_2026_06_13_04` | Recognize variable decelerations immediately after membrane rupture and choose the standard initial actions. |
| `fhr_gemini_smoke_2026_06_13_05` | Classify actions for a prolonged deceleration after epidural-associated maternal blood-pressure decline. |
| `gpt_fmtgap_2026_07_14_hl_fetal_tachysystole_08` and `gpt_balance2_2026_07_15_or_intrapartum_fetal_monitoring_16` | Recognize tachysystole and reproduce a fixed oxytocin/prostaglandin response sequence. |
| `gpt_balance6a_2026_07_16_hl_intrapartum_fetal_monitoring_15` | Highlight the published acute-bradycardia/prolonged-deceleration escalation actions. |
| `gpt_format9a_suspected_uterine_rupture` | Diagnose suspected uterine rupture from VBAC, station loss, shock, and prolonged fetal bradycardia. |
| `gpt_balance3_2026_07_16_bt_intrapartum_fetal_monitoring_18` | Diagnose intraamniotic infection from fever, uterine/amnionic cues, and fetal tachycardia. |
| `gpt_balance5_2026_07_16_hl_intrapartum_fetal_monitoring_18` | Verify maternal-heart-rate artifact before diagnosing fetal bradycardia. |

These fences do not ban those clinical facts from appearing incidentally. They ban making an
embedded part's scored demand materially identical to the occupied item. A good Case A asks the
learner to synthesize trajectory and response, not to replay eight isolated fetal-monitoring drills.

**Governing source lanes:**

- ACOG Clinical Practice Guideline No. 10, *Intrapartum Fetal Heart Rate Monitoring:
  Interpretation and Management* (2025), exact evaluation/management passages; public record:
  <https://pubmed.ncbi.nlm.nih.gov/40966736/>.

  The PubMed record and public
  [ACOG landing page](https://www.acog.org/clinical/clinical-guidance/clinical-practice-guideline/articles/2025/10/intrapartum-fetal-heart-rate-monitoring-interpretation-and-management)
  identify the guideline but are not themselves valid passage-level pins. Use ACOG only when the
  producer can open the exact supporting passage. Do not key a claim solely to inaccessible full
  text.
- NICE NG229, *Fetal monitoring in labour*, current recommendations and update record, especially
  whole-picture assessment, change over time, CTG features, escalation, and reassessment:
  <https://www.nice.org.uk/guidance/ng229/chapter/Recommendations>.
- For any deterministic `fetal_monitoring` visual, the verified morphology and metadata contract in
  [`NCLEX-Question-Schema.md`](NCLEX-Question-Schema.md) and its linked source-verification audit.

Do not key routine maternal oxygen when maternal hypoxia is absent. Do not use a tracing label or
caption that names its interpretation. Do not invent an oxytocin, tocolytic, fluid, or anesthesia
dose; use a source-pinned local order/pathway if exact dosing or timing is clinically necessary.

### Case B — respiratory deterioration with serial acid-base change

**Container classification:** `Physiological Adaptation` / `Respiratory & Infectious Disorders` /
hard. Embedded parts whose actual scored construct is ABG interpretation should use `Reduction of
Risk Potential` / `ABG & Acid-Base Interpretation` rather than inheriting the container label.

**Clinical room:** An adult with an acute severe asthma exacerbation is treated in an emergency or
critical-care setting. Clinical work of breathing, air entry, mental status, oxygenation, and serial
arterial blood gases evolve over time. The initial data must not make the entire case answer obvious.
A later change in ventilation or fatigue alters the priority and prompts source-supported escalation;
subsequent reassessment closes the loop.

Serial ABG integration must be load-bearing in at least two parts, but do not write two versions of
the same acid-base classification question. At least one part must integrate the ABG trajectory with
the bedside respiratory assessment. The producer may use deterministic capnography or structured
measurements only when they add a distinct inference and pass their registered proof contract.

**Occupied comparators and divergence fences:**

| Existing item or case | Occupied construct the new case must not repeat as an embedded leaf |
|---|---|
| `gpt_format10a_life_threatening_asthma_reduced_air_entry` | Diagnose life-threatening asthma from drowsiness, hypoxemia, quiet chest/reduced air entry, and low peak flow, then select immediate actions/monitoring. |
| `claude_a_matrix_asthma_06`, `gemini_jun05_a_matrix_asthma_exacerbation_07`, and `gpt_canonical_matrix_asthma_exacerbation_065` | Sort one-time post-treatment findings into improving versus deteriorating asthma. |
| `cap_gpt_2026_07_02_t03_006` | Interpret the shark-fin capnogram and rising airway pressure in already-intubated status asthmaticus. |
| `cs_asthma_01` | Pediatric outpatient action-plan zones, triggers, medications, and inhaler teaching. |
| `cs_copd_01` | COPD exacerbation with one ABG snapshot, generic treatment ordering, and two-hour improvement. |
| `opus2_case_postop_opioid_respiratory_depression_01` and `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01` | Opioid/OSA hypoventilation, naloxone escalation, and recurrent-sedation monitoring. |
| `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01`, `gpt_2026_06_19_case_ici_pneumonitis_01`, and `gpt_case_gbs_respiratory_compromise_01` | PE/RV strain, checkpoint pneumonitis, and neuromuscular respiratory-failure pathways. |
| `gpt_balance2_2026_07_15_bt_abg_acid_base_interpretation_18` and `sa_acid_base_01` | Single-snapshot respiratory-acidosis recognition in postoperative hypoventilation or chronic compensation. |

Case B must turn on the *serial relationship* between bedside findings and ventilation, not on
recognizing the quiet-chest cue cluster from Batch 10, naming a generic respiratory acidosis, or
copying the existing intubated-asthma capnography item. If that distinct trajectory cannot be made
unambiguous from current sources, block Case B and use the reserve.

**Governing source lanes:**

- GINA, *Global Strategy for Asthma Management and Prevention*, 2026, exact acute-care exacerbation
  assessment, treatment, reassessment, and escalation passages:
  <https://ginasthma.org/2026-gina-strategy-report/>.
- Any additional keyed ventilation, oxygen, ABG, intubation, or post-intubation claim requires an
  exact current professional guideline, primary source, or named facility protocol. Do not extend a
  general asthma source beyond what it actually supports.

Do not invent bronchodilator, corticosteroid, magnesium, sedative, paralytic, or ventilator doses.
Do not reproduce a copyrighted GINA table or box verbatim; cite the exact section and paraphrase.

## 7. Single reserve — compact ECT course

Use this only if one primary is blocked under Section 5.

**Container classification:** `Psychosocial Integrity` / `Electroconvulsive Therapy (ECT)` / hard.

**Clinical room:** A compact 4–5-part case spanning preprocedure reconciliation/readiness, the
immediate postanesthesia period, short-term cognitive or symptom reassessment, and a later treatment-
course decision. The case must remain clinically longitudinal; do not stretch stable teaching facts
into a sixth part.

Occupied constructs include `gemini_jun05_a_mc_ect_prep_42`, `gemini_d4_02`, `gemini_d4_04`,
`gemini_d4_09`, `gpt_2026_07_03_1344_t1_06`, `gpt_2026_07_03_2114_t2_03_ect_recovery_dropdown`,
`gpt_fmtgap_2026_07_14_bt_ect_recovery_03`, `gpt_fmtgap_2026_07_14_hl_ect_preprocedure_07`,
`gpt_format8a_ect_seizure_duration`, `gpt_format8c_ect_recovery_escalation`,
`gpt_format9b_ect_cognitive_change_review`, `gpt_format9b_ect_consent_capacity`, and
`gpt_format10c_ect_continuation_maintenance_plan`. The reserve must not simply collect these existing
preparation, recovery, duration, cognitive-review, consent, and continuation/maintenance questions
under one client. Its scored decisions must depend on how the client's record changes across the
course.

Primary source lane: *Clinical Practice Guidelines for the Use of Electroconvulsive Therapy* (2023),
exact preprocedure, recovery, cognitive monitoring, treatment-course, and ongoing-consent sections:
<https://pmc.ncbi.nlm.nih.gov/articles/PMC10096214/>. Add an exact anesthesia or medication source for
any keyed claim the guideline does not own. Do not assume jurisdiction-specific surrogate or
emergency-consent rules.

## 8. Source, visual, and semantic requirements

- Give the case container and every embedded part a question-level `meta.source` that identifies the
  exact guideline section, recommendation, table, label passage, or local protocol supporting its
  key. A homepage alone is not a source pin.
- Every number that matters—dose, interval, threshold, reference range, equation, or reassessment
  time—must be sourced or explicitly owned by a named closed-world order/protocol in the case.
- A local order may make a sequence gradeable; it may not launder an externally false clinical
  premise into correctness.
- Do not use proprietary scoring instruments or reproduce copyrighted tables without repository
  rights.
- Visuals are optional, deterministic, and data-derived. No AI-generated medical image is allowed.
  A visual must be load-bearing: if removing it leaves every answer unchanged, omit it.
- Any visual-bearing case invokes the full five-gate visual workflow: validation, `selfCheck`, visual
  audit against source data, human content review, and promotion/ledger update.
- Rationales must explain why the keyed response follows from the available stage data without
  referring to option position. `byChoice` coverage must meet the current format contract.
- Do not make a later stage retroactively necessary to answer a part whose stage metadata says it is
  answerable earlier.

## 9. Producer/checker handoff

After the producer writes the raw bank, Codex/checker runs:

```bash
npm run normalize-raw-bank -- banks/banks-raw/gpt-direct-case-pilot-2026-07-18.json
npm run validate-bank -- banks/banks-raw/gpt-direct-case-pilot-2026-07-18.json
```

Normalization is a dry run. Codex/checker uses `--write` only after reviewing normalizer-owned
deterministic repairs. Any JSON repair must load, mutate, and re-serialize the object programmatically;
never retype raw-bank structure.

The producer's final response is a compact receipt containing:

- the exact raw path and actual case/embedded-part counts;
- primary or reserve use and any blocked premise;
- the chosen episode and one-sentence case affordance for each delivered case;
- the nearest-comparator result for every embedded part;
- source-pin completion status;
- visual kinds used, or `none`;
- `reverse-order cross-part leakage audit clear` or the unresolved leakage;
- the exact deferred normalization/validation statement from Section 2.

The producer is not the content checker. A separate non-GPT checker must independently open every
source pin, review every keyed clinical claim and calculation, test the collision/divergence claims,
read both cases for forward and reverse answer leakage, verify bilingual parity, and inspect every
visual against source data. Promotion, consolidation, ledgering, census regeneration, and deletion
of the raw file occur only after that review and are outside this commission.

## 10. Acceptance

- [ ] The exact raw path contains two complete case containers and no standalone companion items, or
      one complete case only under the explicit dual-primary block outcome in Section 5.
- [ ] Each primary has 5–6 embedded parts, unless the ECT reserve is used at its authorized 4–5-part
      compact size; no weak filler was added to hit six.
- [ ] Only the target raw path was created or changed by the producer.
- [ ] Every case earns case form through temporal change, exhibit integration, intervention, and
      reassessment.
- [ ] Every authored `stageId` and `answerableAfterStageId` byte-exactly resolves to a declared stage.
- [ ] The reverse-order leakage audit is clear under unrestricted part navigation.
- [ ] Named comparator and live-raw preflight is complete; no case-wrapped standalone collision
      remains.
- [ ] Every clinical key has an exact current source pin or an explicitly named closed-world local
      protocol that does not contradict external evidence.
- [ ] Any visual is deterministic, load-bearing, source-matched, and ready for the five-gate visual
      review.
- [ ] Dry-run normalization and raw validation pass under Codex/checker.
- [ ] GPT remains the producer; independent non-GPT clinical/content review remains pending.
