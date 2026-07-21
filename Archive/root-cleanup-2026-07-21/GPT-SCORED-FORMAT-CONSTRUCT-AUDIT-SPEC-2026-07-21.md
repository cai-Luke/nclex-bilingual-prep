# Work Order — GPT Scored-Format Construct Audit

Date: 2026-07-21

Status: **ready to run**

Scope: 104 live standalone questions produced by the July 14 GPT-5.6 Sol format-gap commission and GPT Scored-Format Batches 7–11

Mode: deterministic provenance census → blind answer derivation → adversarial construct review → independent checker pass → owner disposition

## 1. Purpose

Audit the complete live population of questions produced under the July 14–18 GPT format-backfill pathway for defects that ordinary schema, key, source-string, and bilingual review did not reliably detect.

This is a narrowly targeted provenance audit, not a presumption that the broader bank is poor. Manual learner review is finding relatively few defects across ordinary 50-question sessions. The purpose is to close a known risk pocket created by format-first commissioning and to quantify whether the observed failures are isolated or systematic.

The audit asks a different question from the prior promotion reviews:

> **Does this item deserve to exist in this format, with this scenario, response demand, and key?**

The primary defect classes of concern are:

- procedures with only a partial order being forced into one total ordered-response sequence;
- concurrent processes serialized arbitrarily;
- branches that are not genuinely closed by the stem;
- dropdown blanks that mechanically reveal one another;
- extra dropdown inferences invented to satisfy a target blank count;
- a requested confirmatory test or next step not uniquely indicated by the supplied facts;
- incoherent scenarios assembled from several complication pathways;
- mixed clinical response horizons inside one item;
- weak or noncompeting bowtie alternatives;
- calculations or specialist diagnostic workflows that add little NCLEX or nursing value;
- source pins that match the commission string but do not support the full keyed construct;
- learner-facing language that compensates for an invalid design instead of fixing it.

This task is a review and evidence task. It must not edit, retire, rewrite, promote, consolidate, or otherwise mutate any question bank.

## 2. Why this audit is required

Several defects have now surfaced from the same provenance family despite prior claims of zero clinical, mathematical, or logical defects:

- `gpt_format11c_home_peak_flow_technique` appears to impose a total sequence on preparatory actions that do not all have a clinically necessary order.
- `gpt_format11c_microcytic_anemia_localization` calls an instruction “Record C,” uses an HbA2 result that already implies hemoglobin analysis occurred, and requests a further confirmation step without supplying a reason that molecular confirmation is uniquely indicated.
- `gpt_format10c_occupational_sharps_hiv_pep_sequence` previously forced concurrent source-patient and exposed-worker processes into one sequence and required a full rewrite.
- `gpt_format10b_hemodialysis_access_prompt_followup` previously combined contradictory access findings and several unrelated complication pathways and required regeneration.
- `gpt_format7c_exercise_hypoglycemia_bowtie` previously exposed authorial nursing-scope constraints on the learner surface.

The last three items have already been repaired. They remain useful process evidence but must be reviewed in their **current live state**, not automatically re-flagged from historical text.

The suspected review failure is not that earlier reviewers failed to read the answer key. It is that they largely verified:

- commission compliance;
- recognizable clinical correctness;
- exact source-string matching;
- arithmetic;
- full key permutations;
- bilingual presence;
- schema validity.

Those checks can all pass while the underlying item construct remains artificial, ambiguous, low-value, or internally incoherent.

## 3. Relationship to the terminal-sentence semantic census

The active terminal-sentence semantic census and this audit are complementary but independent.

The terminal-sentence census asks what job the final stem sentence is doing and whether that sentence belongs on the learner surface. This audit reads the **entire item** and asks whether the scenario, response format, answer space, key, rationale, and source form a worthwhile and uniquely answerable question.

Rules:

1. Do not use the terminal-sentence census verdicts during blind answer derivation.
2. Do not import its `PASS`, `FLAG`, `FAIL`, deletion-risk, or class labels into this audit.
3. After this audit's primary adjudication is complete, compare overlapping findings only as corroborating evidence.
4. A terminal sentence may be removable while the item construct remains valid.
5. A terminal sentence may be a symptom of a deeper construct failure that requires rewrite or retirement rather than deletion.
6. A terminal-sentence `PASS` is not evidence that the whole item passes this audit.

The audit must remain complete even if the terminal-sentence census is unfinished.

## 4. Authority and read order

Read current disk in this order:

1. `AGENTS.md`
2. `docs/AGENTS-RUNBOOK.md`
3. `DECISIONS.md`
4. `PROJECT-HISTORY.md`
5. `BANK-REVIEW-LEDGER.md`
6. `NCLEX-Question-Schema.md`
7. `src/types.ts`
8. `src/schema.ts`
9. `src/grading.ts`
10. `lib/question-population.ts`
11. `Archive/root-cleanup-2026-07-16/GPT-SCORED-FORMAT-BATCH-7-SPEC-2026-07-16.md`
12. `Archive/root-cleanup-2026-07-19/GPT-SCORED-FORMAT-BATCH-8-SPEC-2026-07-18.md`
13. `Archive/root-cleanup-2026-07-19/GPT-SCORED-FORMAT-BATCH-9-SPEC-2026-07-18.md`
14. `Archive/root-cleanup-2026-07-19/GPT-SCORED-FORMAT-BATCH-10-SPEC-2026-07-18.md`
15. `Archive/root-cleanup-2026-07-19/GPT-SCORED-FORMAT-BATCH-11-SPEC-2026-07-18.md`
16. the live versions of every scoped item in `banks/gpt-canonical.json`
17. the July 21 repair records for the known repaired items named in Section 12.

The repository is authoritative. Historical specs explain what was commissioned but do not override the current bank text.

Do not infer the current item from the archived raw commission. Review the current live canonical item and use history only to understand provenance and prior repairs.

## 5. Role separation

This task has three roles:

### 5.1 Primary auditor

The primary auditor builds the deterministic population, performs blind answer derivation, reviews all 104 items, and writes evidence-only dispositions.

The primary auditor must not edit banks and must not declare its own output final content clearance.

### 5.2 Independent checker

A different model/harness or qualified human checker reviews:

- all 32 ordered-response and dropdown-cloze items;
- every primary-auditor `FIX`, `RETIRE`, or `REVIEW` item;
- every known-example gate in Section 12;
- a deterministic 20% sample of the remaining non-OR/non-dropdown `PASS` items.

When the primary auditor is GPT/Codex-family, the checker should be non-GPT or Luke. When the primary auditor is non-GPT, the checker must still be a different model/harness or Luke.

### 5.3 Owner

Luke adjudicates unresolved disagreements, retirement decisions, and whether a retired item needs a replacement for coverage.

No item is treated as newly cleared, newly defective, or safe to mutate solely from the primary auditor's output.

## 6. Blast-radius boundary

The audit may create or replace files only beneath:

```text
audit/scored-format-construct-audit-2026-07-21/
```

Expected artifacts:

- `build-population.ts` — deterministic population extractor;
- `population.jsonl` — exactly 104 scoped live items;
- `primary-adjudication.jsonl` — one primary result per population row;
- `checker-adjudication.jsonl` — checker results for the required checker population;
- `report.md` — reconciled findings and owner handoff;
- optional `batches/` checkpoint files;
- optional `source-notes/` files containing concise source verification notes.

Everything outside that directory is read-only.

Explicitly prohibited:

- no edits to `banks/*.json`, `banks/banks-raw/**`, or `banks/_promoted/**`;
- no patch scripts targeting canonical content;
- no edits to schema, runtime, prompts, governance, ledgers, census, history, or the terminal-sentence census;
- no promotion, consolidation, staging, commit, push, reset, stash, cleanup, or unrelated file movement;
- no replacement prose inside the adjudication files;
- no answer-key mutation proposals stated as already approved;
- no claim that a primary-auditor `PASS` is an independent final content review.

At the start, record branch, HEAD, upstream/ahead-behind when available, all changed paths, and SHA-256 hashes of bundled `banks/*.json` files. At the end, prove the bank hashes are unchanged and that all task-owned writes remain inside the authorized audit directory.

If any bundled bank changes during the audit, stop with `BLOCKED_CONCURRENT_BANK_CHANGE`.

## 7. Exact live population

The population is defined by current top-level IDs in `banks/gpt-canonical.json`, not by historical planned counts.

Include every current top-level item whose ID matches one of these anchored prefix families:

| Provenance family | Anchored ID prefix | Expected live count |
|---|---|---:|
| July 14 standalone format-gap batch | `^gpt_fmtgap_2026_07_14_` | 16 |
| Scored-Format Batch 7 | `^gpt_format7[abc]_` | 17 |
| Scored-Format Batch 8 | `^gpt_format8[abc]_` | 18 |
| Scored-Format Batch 9 | `^gpt_format9[abc]_` | 18 |
| Scored-Format Batch 10 | `^gpt_format10[abc]_` | 17 |
| Scored-Format Batch 11 | `^gpt_format11[abc]_` | 18 |
| **Total** |  | **104** |

The 104-item total corrects the planning-count overstatement of 105. Batch 7 and Batch 10 each have 17 live items, not 18.

Expected current item-type distribution:

| Item type | Count |
|---|---:|
| `ordered_response` | 23 |
| `dropdown_cloze` | 9 |
| `fill_in_blank` | 26 |
| `highlight` | 24 |
| `bowtie` | 21 |
| `select_all` | 1 |
| **Total** | **104** |

All scoped records are standalone top-level scored leaves. No case containers or embedded leaves belong to this population.

### 7.1 Population stop conditions

Stop with `BLOCKED_POPULATION_RECONCILIATION` when any of the following occurs:

- a prefix count differs from the table;
- total population is not 104;
- item-type totals do not reconcile to 104;
- any matched item is not a top-level standalone scored leaf;
- any stable ID appears twice;
- a known live forcing ID in Section 12 is absent.

Do not silently narrow the audit to recover the expected total.

## 8. Deterministic population builder

Write `build-population.ts` under the authorized audit directory.

The builder must:

1. Parse `banks/gpt-canonical.json` from one stable snapshot.
2. Select only the anchored prefix families in Section 7.
3. Preserve canonical question order and add a stable `populationIndex` from 1 through 104.
4. Record exact question index and JSON path.
5. Preserve all learner-facing bilingual text exactly.
6. Extract the complete answer structure and current key for later comparison.
7. Extract `meta.source` and question metadata.
8. Record a `provenanceFamily` and `subBatch` derived from the anchored prefix.
9. Emit compact UTF-8 JSONL with one complete item per line.
10. Produce byte-identical `population.jsonl` on a second run against the same bank hash.

Each row must include at least:

```json
{
  "populationIndex": 1,
  "bankPath": "banks/gpt-canonical.json",
  "bankSha256": "...",
  "questionIndex": 0,
  "questionPath": "questions[0]",
  "id": "gpt_fmtgap_2026_07_14_bt_therapeutic_panic_01",
  "provenanceFamily": "FORMAT_GAP_2026_07_14",
  "subBatch": "fmtgap",
  "itemType": "bowtie",
  "category": "...",
  "topic": "...",
  "difficulty": "...",
  "ngnSkill": "...",
  "stem": {"en": "...", "zh": "..."},
  "responseStructure": {},
  "currentKey": {},
  "rationale": {},
  "testTakingStrategy": {},
  "glossary": [],
  "sourceMetadata": "..."
}
```

Do not depend on the terminal-sentence census queue to build this population.

## 9. Core review protocol

Every item receives the same staged review. Do not jump directly to reading the rationale and confirming it.

### Pass A — blind construct and answer derivation

Temporarily withhold from the reviewer:

- the current key;
- `rationale.correct`;
- `rationale.byChoice`;
- `testTakingStrategy`;
- any prior audit verdict;
- the terminal-sentence census disposition.

Read the complete stem, response structure, and answer choices/tokens/segments. Then record:

1. What clinical or nursing judgment is the item actually testing?
2. Is that judgment appropriate for the stated item type?
3. What answer or answer set follows from the item alone?
4. Is the answer unique?
5. What alternative answer or sequence could a competent learner reasonably defend?
6. Is any information present only to force the author's intended answer?
7. Would the item remain worthwhile if stripped of producer/checker commentary?
8. Is the construct plausibly useful for NCLEX-RN preparation or bedside nursing judgment?

The blind derivation must be concrete. “Looks correct” is not an answer derivation.

### Pass B — key and rationale comparison

Reveal the current key and rationales. Compare them with the blind derivation.

Record:

- exact agreement or disagreement;
- whether the rationale introduces facts absent from the stem;
- whether the rationale merely restates the intended key without defeating plausible alternatives;
- whether a choice rationale exposes that the item was constructed around a source or scope restriction;
- whether the strategy tells the learner how the producer constrained the item rather than how to reason clinically.

### Pass C — source sufficiency

Review `meta.source` and the original commission source lane.

This is not a full clinical-currency census of every stable fact. Open and verify the authoritative source when:

- the item is ordered response or dropdown cloze;
- the key depends on a narrow sequence, threshold, classification, confirmatory test, or treatment pathway;
- the blind review finds a plausible competing answer;
- the source appears narrower than the keyed conclusion;
- the item may be `FIX`, `RETIRE`, or `REVIEW`;
- the reviewer relies on a clinical claim to dismiss a plausible alternative.

Record separately:

- whether the source supports the clinical facts;
- whether it supports the **exact response demand and key**;
- whether the source supports a partial order but not the total order imposed by the item;
- whether a general source is being used to justify a specialist diagnostic step it does not actually specify.

Exact source-string matching is not sufficient.

### Pass D — bilingual semantic comparison

Compare all answer-bearing English and Simplified Chinese surfaces:

- stem and instructions;
- options/tokens/segments/rows/columns/dropdowns;
- accepted answers;
- current key identity;
- rationale;
- strategy.

Flag only material differences affecting clinical meaning, response demand, answerability, or distractor plausibility. Ordinary stylistic differences are not defects.

### Pass E — disposition

Assign one verdict, one primary class, optional secondary classes, and one next disposition using Sections 10 and 11.

Do not write replacement text or patch instructions in this audit.

## 10. Format-specific adversarial gates

### 10.1 Ordered response — all 23 items

For each item, derive a dependency graph before viewing the key.

For every pair of actions, classify the relationship as:

- `MUST_PRECEDE`;
- `MUST_FOLLOW`;
- `CONCURRENT_OR_EITHER_ORDER`;
- `BRANCH_ALTERNATIVE`;
- `NOT_COMPARABLE`.

Then determine how many clinically defensible total orders satisfy the true dependencies.

The item fails construct uniqueness when more than one total order remains defensible and the stem does not supply a legitimate operational, temporal, or milestone constraint.

Specifically test for:

- preparation actions that can occur in either order;
- assessment, notification, specimen collection, or documentation steps that are concurrent or institution-dependent;
- source-patient and exposed-worker processes forced into one line;
- same-visit treatments split into arbitrary ranks;
- alternative branches included as if both occur;
- “per facility policy” used to conceal an unstated sequence;
- a final documentation step ordered after all care merely by convention;
- artificial bundling that contains an internal sequence different from the option's position;
- an authorial sentence appended to explain why the official order should be accepted.

A source's numbered educational list is not automatically proof that every adjacent pair has a clinically necessary dependency.

### 10.2 Dropdown cloze — all 9 items

For each dropdown, answer it using only the data assigned to that blank before considering another blank's answer.

Test for:

- mechanical reveal from a prior blank;
- one record being mislabeled as another record or instruction;
- multiple unrelated mini-questions disguised as one coherent item;
- a third inference invented to reach a three-dropdown target;
- a requested next test that repeats testing already represented in the stem;
- a confirmatory or molecular test that is not uniquely indicated;
- treatment implications mixed into diagnostic localization without a new decision point;
- options with different abstraction levels;
- one dropdown answer being true only because the rationale adds missing assumptions.

Each blank must contribute a separate, natural, clinically useful inference.

### 10.3 Bowtie — all 21 items

Test whether:

- at least two alternatives genuinely compete before the discriminating cues are read;
- the condition is not merely restating the stem's diagnosis;
- both actions belong to the same immediate clinical phase;
- both parameters measure response or deterioration rather than repeat diagnostic cues;
- distractors are plausible within the scenario, not unrelated diagnoses or obviously forbidden acts;
- the action set does not depend on an unstated order, dose, protocol, or authorization;
- the item is not an ordinary multiple-choice question stretched into 1/2/2 format for coverage.

### 10.4 Highlight — all 24 items

Read the whole note as one coherent patient record.

Test whether:

- the passage can describe one patient at one clinical moment;
- normal and abnormal findings do not contradict each other unless a genuine time trend explains them;
- the item does not collage several unrelated complications merely to create more selectable cues;
- every selected segment answers the same question direction and response horizon;
- the task is bounded enough that a competent learner can distinguish target cues from contextual facts;
- near-misses are clinically plausible rather than obviously irrelevant filler;
- the stem does not tell the learner which distractor class was deliberately included;
- punctuation or segmentation does not leak the key.

### 10.5 Fill in the blank — all 26 items

Test both arithmetic/closed-vocabulary correctness and construct worthiness.

An item may be numerically correct but still weak when:

- it tests a trivial acronym or one-word label with no useful reasoning;
- it provides a full equation and asks only for calculator transcription without meaningful clinical interpretation;
- the result is disconnected from the stated topic;
- the item appends a source-defense disclaimer because the number itself has limited clinical meaning;
- the response demand duplicates information already displayed by the UI;
- more than one unit or rounding convention is defensible;
- the answer key is correct only under an unstated input convention.

Do not fail a calculation merely because it is simple. Fail it when the format-backfill goal displaced educational value or answer uniqueness.

### 10.6 Select all — the single item

Verify that every option is independently judgeable and that no option becomes true or false only when paired with another. Confirm jurisdictional caveats do not make the key indeterminate.

## 11. Verdict, defect class, and disposition vocabulary

Every primary adjudication row receives exactly one `verdict`:

- `PASS` — current live item is worthwhile, coherent, uniquely answerable, and adequately supported;
- `FIX` — a valid underlying construct exists, but current live content requires bounded repair or full rewrite;
- `RETIRE` — the premise/format is not worth preserving or cannot be repaired without replacing the construct;
- `REVIEW` — material ambiguity remains that requires owner or qualified clinical adjudication.

Every row receives exactly one `primaryClass` from this closed vocabulary:

### Passing class

- `VALID_CONSTRUCT`

### Defect classes

- `ARBITRARY_SERIALIZATION`
- `PARALLEL_PROCESS_FORCED_SEQUENCE`
- `UNCLOSED_BRANCH`
- `MULTIPLE_VALID_KEYS`
- `MECHANICAL_CLOZE_DEPENDENCY`
- `INVENTED_EXTRA_INFERENCE`
- `UNSUPPORTED_OR_CIRCULAR_NEXT_STEP`
- `SCENARIO_CONTRADICTION`
- `COMPLICATION_COLLAGE`
- `MIXED_RESPONSE_HORIZONS`
- `WEAK_OR_NONCOMPETING_DIFFERENTIAL`
- `ACTION_PARAMETER_PHASE_MISMATCH`
- `UNBOUNDED_OR_SELF_REVEALING_HIGHLIGHT`
- `CALCULATION_WITHOUT_CLINICAL_VALUE`
- `NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT`
- `SOURCE_INSUFFICIENCY`
- `ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION`
- `BILINGUAL_MATERIAL_DIVERGENCE`
- `OTHER_CONFIRMED_CONSTRUCT_DEFECT`

### Review class

- `UNRESOLVED_CLINICAL_OR_PROTOCOL_AMBIGUITY`

Rows may carry `secondaryClasses` from the defect vocabulary.

Every row receives exactly one `nextDisposition`:

- `KEEP`
- `BOUNDED_TEXT_REPAIR`
- `FULL_ITEM_REWRITE_SAME_CONSTRUCT`
- `RETIRE_WITHOUT_REPLACEMENT`
- `RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED`
- `OWNER_OR_CLINICAL_ADJUDICATION`

### 11.1 Fix versus retire boundary

Use `FIX` when a worthwhile construct remains and can be preserved through one of these paths:

- deletion or naturalization of authorial commentary without changing answerability;
- correction of a bounded contradictory cue;
- narrowing a highlight to one coherent complication pathway;
- rebundling or rewriting an ordered-response option set while preserving the same clinically useful sequence;
- rewriting the stem so an already worthwhile diagnostic or nursing decision becomes uniquely indicated.

Use `RETIRE` when:

- the assigned format is intrinsically wrong for the task;
- the item tests arbitrary ordering rather than a real sequence;
- the third or later inference exists only to fill a format quota;
- the requested next step is circular or requires adding a new specialist scenario;
- the item has little nursing/NCLEX value even after repair;
- preserving the item would require replacing the scenario, response demand, key, and source lane;
- a cleaner replacement would be a fundamentally different question.

A `RETIRE` recommendation does not automatically require a replacement. Coverage need is an owner decision based on current live reports, not the historical format deficit that generated the item.

## 12. Known-example gates

These gates test whether the audit is reading current live content and applying the rubric rather than copying history.

### 12.1 `gpt_format11c_home_peak_flow_technique`

The reviewer must explicitly derive the dependency graph among inspection/reset, upright positioning, inhalation, sealing/blowing, repeating, and recording the highest result.

This item must not receive `PASS` merely because the current key matches one published list. A `PASS` requires evidence that the stem/source establishes one necessary total order. Otherwise classify the arbitrary-order defect and determine whether the item merits full rewrite or retirement.

### 12.2 `gpt_format11c_microcytic_anemia_localization`

The reviewer must explicitly address:

- whether the stem actually contains three records;
- whether HbA2 5.3% means hemoglobin analysis has already occurred;
- whether another “hemoglobinopathy evaluation” repeats the represented workup;
- whether molecular testing is uniquely indicated by the facts supplied;
- whether the approved iron-deficiency source supports the full confirmation step;
- whether the third blank is natural and useful for an NCLEX-RN learner.

This item must not receive `PASS` without resolving each point with exact evidence.

### 12.3 `gpt_format10c_occupational_sharps_hiv_pep_sequence`

Review the current repaired item only. Verify that:

- the ordered actions now apply to the exposed nurse;
- source-patient testing is not forced into the ordered sequence;
- baseline testing does not delay indicated PEP;
- the current option bundling has one defensible order.

Do not re-flag deleted historical wording.

### 12.4 `gpt_format10b_hemodialysis_access_prompt_followup`

Review the current regenerated item only. Verify that it remains limited to access stenosis/dysfunction, contains no contradictory simultaneous findings, and uses one response horizon.

Do not grade it against the retired multi-complication version.

### 12.5 `gpt_format7c_exercise_hypoglycemia_bowtie`

Review the current naturalized item. Verify the bowtie construct itself, not the deleted historical authorial sentence.

### 12.6 Population-count controls

Confirm that:

- Batch 7 contains 17 live items;
- Batch 10 contains 17 live items;
- the total is 104;
- no missing planned row is reconstructed or treated as a live item.

## 13. `primary-adjudication.jsonl` contract

Write exactly one compact object per population row in population order.

Each row must contain at least:

```json
{
  "populationIndex": 1,
  "id": "gpt_format11c_home_peak_flow_technique",
  "provenanceFamily": "SCORED_FORMAT_BATCH_11",
  "subBatch": "11C",
  "itemType": "ordered_response",
  "blindConstruct": "...",
  "blindDerivedAnswer": {},
  "blindUniqueness": "UNIQUE",
  "plausibleAlternativeAnswers": [],
  "keyComparison": "MATCH",
  "sourceCheck": "SUPPORTED",
  "nursingRelevance": "HIGH",
  "bilingualParity": "MATERIAL_MATCH",
  "verdict": "PASS",
  "primaryClass": "VALID_CONSTRUCT",
  "secondaryClasses": [],
  "quotedEvidence": [],
  "reason": "...",
  "nextDisposition": "KEEP",
  "terminalCensusOverlap": null
}
```

Allowed `blindUniqueness` values:

- `UNIQUE`
- `MULTIPLE_DEFENSIBLE`
- `NO_DEFENSIBLE_KEY`
- `UNCLEAR`

Allowed `keyComparison` values:

- `MATCH`
- `PARTIAL_MATCH`
- `DISAGREES`
- `NOT_APPLICABLE`

Allowed `sourceCheck` values:

- `SUPPORTED`
- `PARTIALLY_SUPPORTED`
- `NOT_SUPPORTED`
- `SOURCE_UNAVAILABLE`
- `NOT_OPENED_STABLE_LOW_RISK`

Allowed `nursingRelevance` values:

- `HIGH`
- `MODERATE`
- `LOW`
- `OUT_OF_SCOPE_OR_OVERLY_SPECIALIST`

Allowed `bilingualParity` values:

- `MATERIAL_MATCH`
- `MATERIAL_DIVERGENCE`
- `MISSING_OR_INCOMPLETE`
- `NOT_APPLICABLE`

For every `FIX`, `RETIRE`, or `REVIEW` row:

- quote exact evidence from the live item;
- identify at least one concrete plausible alternative, contradiction, missing premise, or source gap;
- explain why the existing rationale does or does not cure the problem;
- state whether the defect affects the key, format, scenario, source, nursing relevance, or bilingual surface;
- choose one next disposition;
- do not write replacement prose.

For every ordered-response row, include a compact `dependencyGraph` and `defensibleOrderCount` (`1`, an exact integer, or `MULTIPLE_NOT_ENUMERATED`).

For every dropdown-cloze row, include a per-blank `independentInference` result.

## 14. Primary batching protocol

Process the 104 items in deterministic batches of no more than 20 items.

Required wave order:

### Wave 1 — high-risk formats

Review all 32 ordered-response and dropdown-cloze items first:

- 23 `ordered_response`;
- 9 `dropdown_cloze`.

Do not interleave easier formats merely to improve the apparent pass rate.

### Wave 2 — remaining formats

Review the remaining 72 items:

- 26 `fill_in_blank`;
- 24 `highlight`;
- 21 `bowtie`;
- 1 `select_all`.

For each batch:

1. preserve population order within the selected wave;
2. complete blind derivation before revealing keys/rationales;
3. reconcile every input index with one output row;
4. retain a running count by verdict, defect class, batch, and item type;
5. do not revise earlier verdicts to make later totals look balanced;
6. write checkpoint output under `batches/`.

If context limits prevent complete review, stop with `PARTIAL_CONTEXT_LIMIT` and list the exact unreviewed population indices.

## 15. Independent checker protocol

Build the checker population deterministically after primary adjudication.

Include:

1. all 32 Wave 1 items;
2. all primary `FIX`, `RETIRE`, and `REVIEW` items from Wave 2;
3. all known-example gates in Section 12;
4. a 20% sample of remaining Wave 2 `PASS` items.

For the sample, calculate SHA-256 over:

```text
<bankPath>|<id>|<itemType>
```

Select when the first unsigned byte modulo 5 equals `0`.

The checker must independently perform the relevant blind derivation and may not merely endorse the primary reason.

Write one row per checked item to `checker-adjudication.jsonl` with:

- identity fields;
- checker verdict/class/disposition;
- agreement status: `AGREE | DISAGREE | PARTIAL`;
- exact disagreement explanation;
- source verification when relevant;
- owner decision requirement.

Any primary/checker disagreement on `PASS` versus `FIX/RETIRE`, any retirement disagreement, or any unresolved clinical ambiguity routes to Luke.

## 16. Report contract

Write `report.md` with this title:

```text
GPT Scored-Format Construct Audit — Final Report
```

Required sections:

### 16.1 Status

Use exactly one:

- `COMPLETE_PENDING_OWNER_DISPOSITIONS`
- `COMPLETE_NO_OPEN_DISPOSITIONS`
- `BLOCKED_POPULATION_RECONCILIATION`
- `BLOCKED_PARSE_FAILURE`
- `BLOCKED_CONCURRENT_BANK_CHANGE`
- `PARTIAL_CONTEXT_LIMIT`
- `BLOCKED_OUTPUT_CONTAMINATION`

### 16.2 Audit session header

Record:

- primary auditor model/harness;
- checker model/harness or human checker;
- date;
- branch and HEAD;
- starting and ending changed paths;
- bank hashes;
- batch sizes and batch files;
- confirmation that no bank mutation occurred.

### 16.3 Population reconciliation

Report exact counts by:

- provenance family;
- sub-batch;
- item type;
- difficulty;
- category;
- topic.

Confirm 104 total.

### 16.4 Results

Report primary and checked counts by:

- verdict;
- primary class;
- secondary class;
- next disposition;
- batch;
- item type;
- source-check result;
- nursing relevance;
- bilingual parity.

### 16.5 High-priority queues

List separately:

1. `RETIRE` candidates;
2. `FULL_ITEM_REWRITE_SAME_CONSTRUCT` candidates;
3. bounded fixes;
4. owner/clinical review items;
5. primary/checker disagreements.

For each include stable ID, exact item path, defect class, concise evidence, and next disposition.

### 16.6 Ordered-response findings

Report:

- items with one defensible total order;
- items with multiple defensible total orders;
- items containing concurrent processes;
- items containing unclosed branches;
- items whose source supports only a partial order;
- items requiring rewrite or retirement.

### 16.7 Dropdown-cloze findings

Report:

- independently answerable blanks;
- mechanically dependent blanks;
- invented extra inferences;
- unsupported/circular next steps;
- overly specialist or low-value constructs;
- items requiring rewrite or retirement.

### 16.8 Remaining-format findings

Summarize bowtie, highlight, fill-in-blank, and select-all defect rates and the most common classes.

### 16.9 Known-example reconciliation

State the current live result for all Section 12 items and explicitly distinguish historical repaired defects from current findings.

### 16.10 Terminal-census overlap

Only after primary adjudication is frozen, compare with available terminal-sentence findings.

Report:

- items flagged by both audits;
- terminal-only surface defects;
- construct-only defects;
- cases where a terminal sentence is design compensation requiring more than deletion.

Do not merge the two verdict systems.

### 16.11 Review-process diagnosis

Explain whether the failures support any of these hypotheses:

- format quota pressure caused weak premises;
- prior review confirmed commissioned keys rather than deriving answers blind;
- exact source-string matching masked source insufficiency;
- full permutations were mistaken for unique clinical sequences;
- bilingual presence checks missed shared bilingual defects;
- the issue is isolated rather than systematic.

Distinguish evidence from inference.

### 16.12 Outer-ring recommendation

Do not automatically expand this task.

Recommend a separate 108-item July 16 coverage-batch audit only when at least one trigger is met:

- 5% or more of the 72 Wave 2 items receive `FIX`, `RETIRE`, or `REVIEW` after checker reconciliation;
- the same confirmed construct-defect class appears in at least three distinct provenance families;
- a defect mechanism clearly derives from the shared commission/review process rather than one topic;
- the checker finds a materially higher defect rate than the primary auditor's pass sample suggested.

The potential outer ring consists of the six 18-item July 15–16 coverage batches (`gpt_mocsic`, `gpt_balance2`, `gpt_balance3`, `gpt_balance5`, `gpt_balance6a`, and `gpt_balance6b` families), totaling 108 live items. A new work order is required before that audit begins.

### 16.13 Handoff

End with:

- exact `PASS`, `FIX`, `RETIRE`, and `REVIEW` counts;
- exact owner decisions required;
- exact items eligible for bounded repair;
- exact items requiring full rewrite;
- exact retirement candidates;
- whether the outer-ring trigger fired;
- paths to all audit artifacts;
- explicit statement that no bank mutation occurred.

## 17. Acceptance gates

The audit may be marked complete only when all are true:

- [ ] One stable canonical-bank snapshot was used.
- [ ] The six prefix families reconcile to 16/17/18/18/17/18.
- [ ] `population.jsonl` contains exactly 104 unique current top-level items.
- [ ] Item-type totals reconcile to 23 OR / 9 DD / 26 FIB / 24 highlight / 21 bowtie / 1 SATA.
- [ ] Every population row has exactly one primary adjudication row.
- [ ] Every ordered response has a dependency graph and defensible-order result.
- [ ] Every dropdown has per-blank independent-inference findings.
- [ ] Blind answer derivation preceded key/rationale review for every item.
- [ ] Every `FIX`, `RETIRE`, and `REVIEW` contains exact evidence and a next disposition.
- [ ] Every source-dependent adverse verdict distinguishes factual support from exact key/response-demand support.
- [ ] Bilingual answer-bearing surfaces were compared for every item.
- [ ] The checker population includes all 32 Wave 1 items, every adverse Wave 2 item, all known examples, and the deterministic 20% Wave 2 pass sample.
- [ ] Every primary/checker disagreement is preserved for owner adjudication.
- [ ] Known repaired items were judged from current live content, not historical wording.
- [ ] The terminal-sentence census was not used to seed primary verdicts.
- [ ] `population.jsonl` is byte-identical on rerun from the same bank snapshot.
- [ ] Bank hashes are unchanged at task end.
- [ ] Only the authorized audit directory was written.
- [ ] No remediation, commit, or push occurred.

## 18. Stop conditions

Stop and report the applicable status when:

- `BLOCKED_POPULATION_RECONCILIATION` — counts, IDs, or item types do not match Section 7;
- `BLOCKED_PARSE_FAILURE` — the canonical bank cannot be parsed sufficiently for complete review;
- `BLOCKED_CONCURRENT_BANK_CHANGE` — the canonical bank hash changes during work;
- `PARTIAL_CONTEXT_LIMIT` — reliable review cannot be completed for all required rows;
- `BLOCKED_OUTPUT_CONTAMINATION` — any write occurs outside the authorized audit directory.

Do not force completion by omitting difficult items, collapsing `REVIEW` into `PASS`, or treating a source's numbered list as proof of a unique ordered-response key.

## 19. Final response

After writing and validating the artifacts, return only:

1. the principal artifact paths;
2. the final status;
3. the reconciled 104-item population counts;
4. exact primary and checked `PASS`, `FIX`, `RETIRE`, and `REVIEW` counts;
5. exact owner decisions required;
6. whether the conditional 108-item outer-ring trigger fired;
7. confirmation that no bank or project file outside the audit directory changed.

Do not begin remediation.
