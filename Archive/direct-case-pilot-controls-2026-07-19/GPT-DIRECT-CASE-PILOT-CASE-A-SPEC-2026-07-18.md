# Producer Commission — Direct Case Pilot A: Intrapartum Fetal Assessment

Date: 2026-07-18

Status: **ready for producer dispatch**

Producer: one GPT-5.6 Sol instance (`gpt_` lane)

Scope: one hard unfolding `case_study`, normally 5–6 embedded scored parts, with no standalone
companion item

## 1. Commission purpose

Author one coherent intrapartum case in one authoring context. This is an episodic content
commission after retirement of the Opus-skeleton pipeline, not a request for new architecture or a
standing multi-model workflow.

The case is commissioned for **case affordance**. Information must change over time, later data must
alter the supported interpretation or priority, the learner must integrate more than one exhibit,
and reassessment must close the loop after an intervention. A set of independent fetal-monitoring
questions about one laboring client does not satisfy this order.

## 2. Required final disk state

Do **not** return question JSON in chat. Use repository read/write tools to create exactly:

`banks/banks-raw/gpt-direct-case-pilot-case-a-2026-07-18.json`

Before writing, confirm that the path is absent. If it exists, stop and report the collision; do not
overwrite, rename, or create an alternate copy. The file must contain one complete valid bank object
with exactly one top-level case container and no Markdown fences, sidecar notes, partial files, or
standalone items. Author to the current [`NCLEX-Question-Schema.md`](NCLEX-Question-Schema.md)
contract and use the current `2.0` bank schema version verified in `src/types.ts`.

Only the target raw path may be created or changed. Do not edit tracked files, canonical banks,
existing raw drafts, schema, ledger, census, history, decisions, or this spec. Do not run promotion,
consolidation, or any command that treats the draft as reviewed content.

If the clinical premise cannot clear collision, current-source, coherence, or leakage review, leave
the target path absent and return a documented block. Do not substitute another case topic.

The producer seat has repository read/write tools but no shell execution. After writing, report
`normalization and validation deferred to Codex/checker (no command execution in producer seat)`.

## 3. Producer-owned design space

The producer owns:

- patient identity and clinically relevant history;
- the exact labor trigger and clinical mechanism;
- stage count, boundaries, timestamps, and narrative progression;
- exhibit selection and composition;
- the 5–6 embedded item formats and their order;
- the specific decisions, distractors, rationales, strategy text, and glossary;
- natural `ngnSkill` assignments and difficulty distribution within the hard case.

Do not recreate the retired one-question-per-NCJMM-step skeleton. Normally use at least three
embedded formats, but do not force a format that distorts the clinical decision. `bowtie` cannot be
embedded under the current schema. Do not add a standalone bowtie or any other companion item.

Use readable globally unique IDs under `gpt_casepilot_2026_07_18_a_`. English is the primary exam
surface. Every learner-visible field must have natural, clinically faithful Simplified-Chinese
parity; do not translate chart data into a different clinical claim.

## 4. Case-worthiness and leakage gates

The case must satisfy all of the following:

1. At least one later stage changes the supported interpretation, urgency, or next action.
2. At least two parts require integration across exhibits or time and cannot be answered from one
   isolated sentence or value.
3. At least one intervention is followed by new evidence supporting a genuine evaluation-of-
   outcomes decision.
4. The episode remains coherent from baseline through reassessment.
5. Every part has a distinct response demand; do not repeat one recognition or action question in
   multiple formats.

The application allows direct navigation to any part before aggregate submission. Selecting a later
part can reveal its cumulative stages even when earlier parts are unanswered. Audit under the
assumption that the learner may read every part stem, choice, and visible stage before answering
Part 1. A later stem, option, exhibit, or caption must not disclose an earlier keyed answer.
Top-level `caseStudy.exhibits` are visible from the start and must never contain stage-gated data.

Every `stageId` and `answerableAfterStageId` used by an embedded part must byte-exactly match a
declared `caseStudy.stages[].id`. An unresolved reference is blocking because the renderer fails open
and may expose all stages. Opening parts may omit stage metadata when they depend only on permanently
visible baseline exhibits.

Perform a final leakage read from the last part back to Part 1 and report the result. If leakage
cannot be removed without weakening the case, block the premise rather than assuming sequential
locking.

## 5. Collision preflight

Before authoring, inspect every comparator below and every live JSON draft under
`banks/banks-raw/`. After drafting, compare every embedded part against the named comparators, the
other parts in this case, and the live raw drafts. Compare decisive cue cluster, tested inference,
keyed pathway, serial template, and response demand—not wording, demographics, or format. A case
wrapper does not make an occupied standalone construct new.

| Existing item | Occupied construct this case must not repeat as an embedded leaf |
|---|---|
| `fhr_gemini_smoke_2026_06_13_03` and `gpt_deepen_2026_06_23_bow_04` | Identify recurrent late decelerations during oxytocin and select generic intrauterine-resuscitation actions. |
| `fhr_gemini_smoke_2026_06_13_04` | Recognize variable decelerations immediately after membrane rupture and choose the standard initial actions. |
| `fhr_gemini_smoke_2026_06_13_05` | Classify actions for a prolonged deceleration after epidural-associated maternal blood-pressure decline. |
| `gpt_fmtgap_2026_07_14_hl_fetal_tachysystole_08` and `gpt_balance2_2026_07_15_or_intrapartum_fetal_monitoring_16` | Recognize tachysystole and reproduce a fixed oxytocin/prostaglandin response sequence. |
| `gpt_balance6a_2026_07_16_hl_intrapartum_fetal_monitoring_15` | Highlight the published acute-bradycardia/prolonged-deceleration escalation actions. |
| `gpt_format9a_suspected_uterine_rupture` | Diagnose suspected uterine rupture from VBAC, station loss, shock, and prolonged fetal bradycardia. |
| `gpt_balance3_2026_07_16_bt_intrapartum_fetal_monitoring_18` | Diagnose intraamniotic infection from fever, uterine/amnionic cues, and fetal tachycardia. |
| `gpt_balance5_2026_07_16_hl_intrapartum_fetal_monitoring_18` | Verify maternal-heart-rate artifact before diagnosing fetal bradycardia. |

These fences do not ban the facts from appearing incidentally. They ban a materially identical
scored demand. The case should synthesize trajectory and response rather than replay isolated
fetal-monitoring drills.

## 6. Clinical brief

**Container classification:** `Reduction of Risk Potential` / `Intrapartum Fetal Monitoring` / hard.

A term client undergoes induction or augmentation of labor. The opening maternal and fetal picture
is sufficiently reassuring to establish a baseline. A later labor event changes the fetal tracing
and/or uterine activity; the team performs source-supported nursing measures and reassesses. The
closing stage must require the learner to decide whether the combined maternal, labor-progress,
uterine-activity, and fetal evidence supports recovery, continued close observation, urgent
obstetric review, or preparation for expedited birth.

The producer chooses the exact trigger and progression. The whole clinical picture and change over
time must be load-bearing.

The case may use one deterministic `fetal_monitoring` exhibit visual when it materially improves the
case. Do not place multiple fetal-monitoring visuals in one case: the registered kind's proof
metadata is question-level, so separate staged tracings cannot carry independent
`expected_pattern` proofs. Show remaining temporal changes through staged chart exhibits. If a
visual is used, provide the exact question-level metadata and `selfCheck` proof required by the
registered kind. If no visual is used, the receipt must state how the chart exhibits still require
serial fetal/uterine interpretation rather than prose recall.

## 7. Governing source lanes

- ACOG Clinical Practice Guideline No. 10, *Intrapartum Fetal Heart Rate Monitoring:
  Interpretation and Management* (2025), exact evaluation/management passages; public record:
  <https://pubmed.ncbi.nlm.nih.gov/40966736/>.

  The PubMed record and public
  [ACOG landing page](https://www.acog.org/clinical/clinical-guidance/clinical-practice-guideline/articles/2025/10/intrapartum-fetal-heart-rate-monitoring-interpretation-and-management)
  identify the guideline but are not valid passage-level pins. Use ACOG only when the exact
  supporting passage can be opened. Do not key a claim solely to inaccessible full text.
- NICE NG229, *Fetal monitoring in labour*, current recommendations and update record, especially
  whole-picture assessment, change over time, CTG features, escalation, and reassessment:
  <https://www.nice.org.uk/guidance/ng229/chapter/Recommendations>.
- For any deterministic `fetal_monitoring` visual, use the morphology and metadata contract in
  [`NCLEX-Question-Schema.md`](NCLEX-Question-Schema.md) and its linked source-verification audit.

Do not key routine maternal oxygen when maternal hypoxia is absent. Do not use a tracing label or
caption that names its interpretation. Do not invent an oxytocin, tocolytic, fluid, or anesthesia
dose; use a source-pinned local order/pathway if exact dosing or timing is necessary.

## 8. Source, visual, and semantic requirements

- Give the case container and every embedded part a question-level `meta.source` identifying the
  exact guideline section, recommendation, table, label passage, or local protocol supporting its
  key. A homepage alone is not a source pin.
- Every material dose, interval, threshold, range, equation, and reassessment time must be sourced
  or explicitly owned by a named closed-world order/protocol in the case.
- A local order may make a sequence gradeable; it may not launder an externally false premise into
  correctness.
- Do not reproduce proprietary scoring instruments or copyrighted tables without repository rights.
- Visuals are optional, deterministic, data-derived, and load-bearing. No AI-generated medical
  image is allowed.
- A visual-bearing case invokes validation, `selfCheck`, visual audit against source data, human
  content review, and promotion/ledger review.
- Rationales must be position-agnostic and explain the key from data available at that part's stage.
  `byChoice` coverage must meet the current format contract.
- Do not make a later stage retroactively necessary to answer a part whose metadata says it is
  answerable earlier.

## 9. Producer/checker handoff

After production, Codex/checker runs:

```bash
npm run normalize-raw-bank -- banks/banks-raw/gpt-direct-case-pilot-case-a-2026-07-18.json
npm run validate-bank -- banks/banks-raw/gpt-direct-case-pilot-case-a-2026-07-18.json
```

Normalization is a dry run. Use `--write` only after reviewing normalizer-owned deterministic
repairs. Any JSON repair must load, mutate, and re-serialize the object programmatically.

The producer's final response is a compact receipt with the exact path and part count, chosen
episode and case affordance, nearest-comparator result for every part, source-pin status, visual kind
or `none`, stage-reference result, `reverse-order cross-part leakage audit clear` or unresolved
leakage, and the deferred normalization/validation statement. A blocked outcome names the source,
collision, coherence, or leakage reason and leaves the target path absent.

The producer is not the content checker. A separate non-GPT checker independently opens every source
pin, reviews every clinical key, tests collision and leakage claims, verifies bilingual parity, and
inspects any visual against its source data. Promotion, consolidation, ledgering, census
regeneration, and raw-file deletion remain outside this commission.

## 10. Acceptance

- [ ] The exact raw path contains one complete 5–6-part case and no standalone item, or remains
      absent with a documented block.
- [ ] Only the target raw path was created or changed.
- [ ] The case earns case form through temporal change, exhibit integration, intervention, and
      reassessment; no weak filler was added to reach six parts.
- [ ] Every authored stage reference byte-exactly resolves to a declared stage.
- [ ] The reverse-order leakage audit is clear under unrestricted part navigation.
- [ ] Named comparator and live-raw preflight is complete.
- [ ] Every clinical key has an accessible exact source pin or a valid closed-world local protocol.
- [ ] Any visual is deterministic, load-bearing, source-matched, and ready for full visual review.
- [ ] Dry-run normalization and raw validation pass under Codex/checker.
- [ ] GPT remains the producer; independent non-GPT review remains pending.
