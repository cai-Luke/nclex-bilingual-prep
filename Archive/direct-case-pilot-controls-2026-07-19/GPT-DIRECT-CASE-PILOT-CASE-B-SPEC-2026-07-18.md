# Producer Commission — Direct Case Pilot B: Severe Asthma With Serial ABGs

Date: 2026-07-18

Status: **ready for producer dispatch**

Producer: one GPT-5.6 Sol instance (`gpt_` lane)

Scope: one hard unfolding `case_study`, normally 5–6 embedded scored parts, with no standalone
companion item

## 1. Commission purpose

Author one coherent respiratory-deterioration case in one authoring context. This is an episodic
content commission after retirement of the Opus-skeleton pipeline, not a request for new
architecture or a standing multi-model workflow.

The case is commissioned for **case affordance**. Information must change over time, later data must
alter the supported interpretation or priority, the learner must integrate more than one exhibit,
and reassessment must close the loop after an intervention. A group of independent asthma or
acid-base questions about one client does not satisfy this order.

## 2. Required final disk state

Do **not** return question JSON in chat. Use repository read/write tools to create exactly:

`banks/banks-raw/gpt-direct-case-pilot-case-b-2026-07-18.json`

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
- the exact trigger, severity progression, and response to treatment;
- stage count, boundaries, timestamps, and narrative progression;
- exhibit selection and composition;
- the 5–6 embedded item formats and their order;
- the specific decisions, distractors, rationales, strategy text, and glossary;
- natural `ngnSkill` assignments and difficulty distribution within the hard case.

Do not recreate the retired one-question-per-NCJMM-step skeleton. Normally use at least three
embedded formats, but do not force a format that distorts the clinical decision. `bowtie` cannot be
embedded under the current schema. Do not add a standalone bowtie or any other companion item.

Use readable globally unique IDs under `gpt_casepilot_2026_07_18_b_`. English is the primary exam
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

| Existing item or case | Occupied construct this case must not repeat as an embedded leaf |
|---|---|
| `gpt_format10a_life_threatening_asthma_reduced_air_entry` | Diagnose life-threatening asthma from drowsiness, hypoxemia, quiet chest/reduced air entry, and low peak flow, then select immediate actions/monitoring. |
| `claude_a_matrix_asthma_06`, `gemini_jun05_a_matrix_asthma_exacerbation_07`, and `gpt_canonical_matrix_asthma_exacerbation_065` | Sort one-time post-treatment findings into improving versus deteriorating asthma. |
| `cap_gpt_2026_07_02_t03_006` | Interpret the shark-fin capnogram and rising airway pressure in already-intubated status asthmaticus. |
| `cs_asthma_01` | Pediatric outpatient action-plan zones, triggers, medications, and inhaler teaching. |
| `cs_copd_01` | COPD exacerbation with one ABG snapshot, generic treatment ordering, and two-hour improvement. |
| `opus2_case_postop_opioid_respiratory_depression_01` and `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01` | Opioid/OSA hypoventilation, naloxone escalation, and recurrent-sedation monitoring. |
| `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01`, `gpt_2026_06_19_case_ici_pneumonitis_01`, and `gpt_case_gbs_respiratory_compromise_01` | PE/RV strain, checkpoint pneumonitis, and neuromuscular respiratory-failure pathways. |
| `gpt_balance2_2026_07_15_bt_abg_acid_base_interpretation_18` and `sa_acid_base_01` | Single-snapshot respiratory-acidosis recognition in postoperative hypoventilation or chronic compensation. |

The case must turn on the serial relationship between bedside findings and ventilation, not on
recognizing the quiet-chest cue cluster, naming a generic respiratory acidosis, or copying the
existing intubated-asthma capnography item.

## 6. Clinical brief

**Container classification:** `Physiological Adaptation` / `Respiratory & Infectious Disorders` /
hard. Embedded parts whose actual scored construct is ABG interpretation should use `Reduction of
Risk Potential` / `ABG & Acid-Base Interpretation`.

An adult with an acute severe asthma exacerbation is treated in an emergency or critical-care
setting. Clinical work of breathing, air entry, mental status, oxygenation, and serial arterial
blood gases evolve over time. The initial data must not make the entire case answer obvious. A later
change in ventilation or fatigue alters the priority and prompts source-supported escalation;
subsequent reassessment closes the loop.

Serial ABG integration must be load-bearing in at least two parts, but do not write two versions of
the same acid-base classification question. At least one part must integrate the ABG trajectory with
the bedside respiratory assessment. The producer may use deterministic capnography or structured
measurements only when they add a distinct inference and pass their registered proof contract.

## 7. Governing source lanes

- GINA, *Global Strategy for Asthma Management and Prevention*, 2026, exact acute-care exacerbation
  assessment, ABG, treatment, reassessment, and escalation passages:
  <https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf>.
- Any additional keyed ventilation, oxygen, ABG, intubation, or post-intubation claim requires an
  exact current professional guideline, primary source, or named facility protocol. Do not extend a
  general asthma source beyond what it supports.

Do not invent bronchodilator, corticosteroid, magnesium, sedative, paralytic, or ventilator doses.
Do not reproduce a copyrighted GINA table or box verbatim; cite the exact section and paraphrase.

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
npm run normalize-raw-bank -- banks/banks-raw/gpt-direct-case-pilot-case-b-2026-07-18.json
npm run validate-bank -- banks/banks-raw/gpt-direct-case-pilot-case-b-2026-07-18.json
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
