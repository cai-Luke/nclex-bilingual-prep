# Claude Sonnet Work Order — Terminal-Sentence Semantic Census

Date: 2026-07-21
Owner: Claude Sonnet review seat in Claude Code
Status: ready to run
Mode: frozen deterministic queue → direct bounded semantic batches → external reconciliation and adjudication

## 1. Purpose

Perform the semantic reading that the existing terminal-sentence census has not yet received.

Review the terminal sentence of every learner-facing question stem in the frozen queue and determine what job that sentence performs. The target defect family includes:

- raw template or schema syntax exposed to the learner;
- a response sentence duplicated between `stem` and another rendered response field;
- author/checker instructions presented as learner-facing prose;
- construct-boundary or source-defense disclaimers;
- answer-bearing adjudication notes;
- prose compensating for an ambiguous option set, sequence, key, or item type;
- material English/Chinese divergence at the terminal boundary.

Most terminal sentences are expected to be legitimate clinical facts, response demands, protocols, quotations, navigation language, or calculation instructions. Terminal position is not itself evidence of a defect.

This is a **direct semantic review**, not a detector-building task, not a remediation task, and not a census-reporting task. Sonnet produces bounded adjudication batches. A separate checker phase owns reconciliation, aggregate reporting, final disposition, and any repair authorization.

## 2. Current state

The prior Gemini execution was rejected and is not review evidence. The only authoritative input produced by that commission is the retained deterministic queue:

```text
audit/terminal-sentence-semantic-census-2026-07-21/queue.jsonl
```

Expected current size is 2,673 rows, but Sonnet must verify the actual line count before starting. Do not rebuild, reorder, narrow, or replace the queue.

The queue covers:

- top-level standalone scored leaves;
- embedded case-study scored leaves;
- top-level case-study containers as separate rendered-stem records.

These populations must remain distinct in the output identities.

## 3. Authority and read order

Read current disk in this order:

1. `AGENTS.md`
2. `DECISIONS.md`
   - principle 2: semantic judgment requires independent review;
   - principle 3: deterministic core, model only for the irreducible semantic layer;
   - principle 5: generated is not reviewed;
   - principle 7: precision over volume;
   - principle 21 and its construction-language application;
   - principle 28: scored leaves versus session units.
3. `NCLEX-Question-Schema.md`
4. `src/types.ts`
5. `src/App.tsx`, specifically the learner rendering paths for:
   - the ordinary stem;
   - `FillInBlankControl`;
   - `DropdownClozeControl` and `ClozeLine`;
   - case-study containers and embedded parts.
6. `audit/terminal-sentence-semantic-census-2026-07-21/queue.jsonl`
7. The corresponding live `banks/*.json` item only when a queue row needs additional context.

The repository and runtime are authoritative. The queue is a frozen extraction of those surfaces, not authority for renderer behavior when it conflicts with current code.

## 4. Blind boundary

Do not read or use any prior model labels, reports, summaries, or candidate counts from this audit family.

Explicitly excluded:

- `audit/terminal-sentence-semantic-census-2026-07-21/adjudication-partial.jsonl`;
- `audit/terminal-sentence-semantic-census-2026-07-21/prefilter-signals.jsonl`;
- `audit/terminal-sentence-semantic-census-2026-07-21/mechanical-prefilter.ts`;
- `audit/terminal-sentence-semantic-census-2026-07-21/quarantine/**`;
- `audit/terminal-sentence-gemini-3-6-flash-pilot-2026-07-21/**`;
- Gemini walkthroughs, chat summaries, or prior dispositions;
- aggregate expectations such as a target number of flags.

The calibration gates in §11 are the only supplied expected outcomes. They exist to enforce renderer-aware reasoning, not to provide a phrase list for the rest of the corpus.

Do not browse the web. This commission evaluates item speech acts, response-surface placement, and bilingual meaning. It does not verify clinical currency.

## 5. Output boundary

Create exactly one task-owned directory:

```text
audit/terminal-sentence-sonnet-review-2026-07-21/
```

Authorized outputs:

```text
audit/terminal-sentence-sonnet-review-2026-07-21/batches/batch-001.jsonl
...
audit/terminal-sentence-sonnet-review-2026-07-21/batches/batch-NNN.jsonl
audit/terminal-sentence-sonnet-review-2026-07-21/batch-ledger.md
audit/terminal-sentence-sonnet-review-2026-07-21/delivery.md
```

Do not create a consolidated adjudication file or final report. The post-review checker owns those artifacts.

Everything outside this directory is read-only. In particular:

- no bank edits;
- no prompt, schema, runtime, governance, history, census, ledger, or existing-audit edits;
- no movement or cleanup of the rejected Gemini artifacts;
- no staging, commit, push, stash, reset, or worktree cleanup.

Record the starting branch, HEAD, and changed paths in `delivery.md`. At the end, record the ending changed paths and confirm that only the Sonnet review directory was added by this task.

## 6. Absolute prohibition on proxy classification

The required work is direct semantic adjudication by Sonnet.

Do not write or execute code that generates, assigns, copies, defaults, transforms, or packages semantic dispositions.

Prohibited mechanisms include:

- regex or keyword classification;
- a verdict map embedded in Python, TypeScript, JavaScript, shell, or any other program;
- bulk defaults followed by exception overrides;
- a script that writes JSONL rows from model-authored dictionaries;
- a script that fills reasons, classes, evidence, removal risks, next steps, or control dispositions;
- deterministic assignment from item type, punctuation, queue position, IDs, or `mechanicalSignals`;
- copying any prior adjudication;
- using aggregate totals to revise earlier rows into a more plausible distribution.

Read-only shell commands may display queue ranges, count lines, inspect Git status, or locate a live item. They must not create scratch datasets or semantic output files.

Write each batch directly with the file-writing/editing tools of the harness. The semantic output itself must be the model-authored artifact, not the product of a generator.

A deterministic command may later check JSON syntax, line count, queue-index order, or enum membership. It may not alter the batch or supply missing semantic fields.

If direct review cannot continue reliably, stop with `SONNET_PARTIAL_CONTEXT_LIMIT`. Preserve completed batches and identify the exact next queue index. Never manufacture completion.

## 7. Review unit and required context

For every queue row, read at least:

- `fullStemEn` and `fullStemZh`;
- `terminalSentenceEn` and `terminalSentenceZh`;
- penultimate sentences when present;
- `recordKind`, item type, category, and topic;
- complete `responseContext`, including keys;
- `rationaleCorrectEn` and `rationaleCorrectZh`;
- `testTakingStrategyEn` and `testTakingStrategyZh`;
- parent-case identity/context for embedded leaves;
- the selected control sentence when `controlSelected` is true.

Re-open the live bank item when:

- the extracted response context is incomplete;
- sentence segmentation appears wrong;
- a terminal sentence may duplicate another rendered surface;
- deletion safety depends on the options, key, ordering, blanks, or case context;
- English and Chinese sentence boundaries do not align;
- an apparent defect may instead be a necessary closed-world fact.

A `PASS` is a disposition on the terminal sentence only. It is not a full clinical review of the question.

## 8. Semantic decision sequence

For each terminal sentence, answer these questions in order:

1. What speech act is the sentence performing?
2. Is it inside the clinical world, a genuine learner response operation, client/caregiver speech, or commentary addressed to an author/checker/compiler?
3. Would removing it discard necessary scenario information, a governing rule, a threshold, a formula, a response target, or an answer-format instruction?
4. Does another learner-rendered field already perform the same job?
5. Does the ordinary stem expose raw placeholders, schema notation, internal IDs, or compiler syntax?
6. Does the sentence explain how the item was bounded, defended, sourced, serialized, or adjudicated?
7. Does it tell the learner the interpretation required to force the intended answer?
8. Is it compensating for a deeper problem in the choices, key, sequence, or item type?
9. Does Chinese preserve the full meaning even when the terminal sentence boundary differs?
10. Is deletion actually safe, or does the item require full review or rewrite?

Use `REVIEW` when the terminal function or removal safety is genuinely mixed. Do not force every row into confident `PASS` or `FLAG`.

## 9. Precision rules

### 9.1 Normally legitimate

Do not flag a sentence merely because it is last, imperative, restrictive, or awkward. These commonly belong on the learner surface:

- `Select all that apply.`
- `Place the actions in order.`
- `Round to the nearest whole number.`
- `Record the answer as a number.`
- `Do not include the unit in the answer box.`
- a provider order, formula, timing rule, threshold, facility protocol, or eligibility criterion needed to answer;
- a clinical fact completing the scenario;
- a client preference, refusal, quotation, or teaching statement;
- ordinary case navigation such as reviewing the client record and answering the case items.

A true clinical statement may still be defective if its learner-facing job is to defend the author’s construction. Judge placement and speech act, not factual truth alone.

### 9.2 Renderer-aware placeholder rules

The item type and runtime placement are load-bearing.

#### `dropdown_cloze`

- `stem` is ordinary scenario/question context and renders verbatim.
- `clozeStem` is the separate response surface whose `{{id}}` placeholders become dropdown controls.
- A cloze response sentence copied into ordinary `stem` is a duplicated learner surface.
- Raw `{{...}}` in ordinary `stem` remains visible as raw text and is a schema/template leak.

#### `fill_in_blank`

- `stem` renders verbatim.
- Inputs are rendered separately from `blanks[]` and their prompts.
- The runtime does **not** replace `{{b1}}`, `{{b2}}`, or similar tokens inside `stem` with inputs.
- Therefore raw `{{...}}` in a fill-in-blank stem is learner-visible template leakage, not a legitimate inline blank.

Do not infer that all braces are defective without checking the rendered field. The same placeholder syntax is legitimate inside the dedicated `dropdown_cloze.clozeStem` field.

### 9.3 Bilingual sentence boundaries

English and Chinese need not have identical sentence counts. One language may combine the response demand and rounding rule while preserving the same complete meaning. Classify a bilingual defect only when one language materially adds, omits, contradicts, or changes the clinical or response requirement.

### 9.4 Item-design compensation

A sentence that admits an omitted concurrent action, explains why only serial actions were offered, or tells the learner how the options were constrained is not necessarily a safe deletion.

Use:

- `ITEM_DESIGN_COMPENSATION` as a primary or secondary class;
- `POSSIBLE_AMBIGUITY` or `HIGH_REWRITE_REQUIRED`;
- `FULL_ITEM_REVIEW`;

when removing the sentence may expose an invalid ordered response, incomplete action set, ambiguous key, or unsuitable item type.

## 10. Closed adjudication vocabulary

Every row receives exactly one `verdict`:

- `PASS`
- `FLAG`
- `REVIEW`

Every row receives exactly one `primaryClass` from this closed vocabulary.

### PASS classes

- `LEGITIMATE_CLINICAL_FACT`
- `LEGITIMATE_RESPONSE_DEMAND`
- `LEGITIMATE_GOVERNING_PROTOCOL_OR_ORDER`
- `LEGITIMATE_CLIENT_QUOTE_OR_TEACHING`
- `LEGITIMATE_CALCULATION_OR_ROUNDING_INSTRUCTION`
- `LEGITIMATE_OTHER`

### FLAG classes

- `DUPLICATED_RESPONSE_SCAFFOLD`
- `RAW_TEMPLATE_OR_SCHEMA_LEAK`
- `AUTHORIAL_CONSTRAINT_LEAK`
- `CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE`
- `ANSWER_TELEGRAPHING_OR_ADJUDICATION_NOTE`
- `ITEM_DESIGN_COMPENSATION`
- `REDUNDANT_META_DISCLAIMER`
- `BILINGUAL_TERMINAL_DEFECT`
- `OTHER_CONFIRMED_TERMINAL_DEFECT`

### REVIEW class

- `AMBIGUOUS_TERMINAL_FUNCTION`

`secondaryFlags` may contain FLAG-class values only.

Allowed field values:

### `speechActTarget`

- `CLINICAL_WORLD`
- `LEARNER_RESPONSE`
- `CLIENT_OR_CAREGIVER`
- `AUTHOR_OR_COMPILER`
- `CHECKER_OR_REVIEWER`
- `MIXED`
- `UNCLEAR`

### `neededForAnswer`

- `YES`
- `NO`
- `PARTLY`
- `UNCLEAR`

### `removalRisk`

- `NONE`
- `LOW`
- `POSSIBLE_AMBIGUITY`
- `HIGH_REWRITE_REQUIRED`
- `UNCLEAR`

### `bilingualRelation`

- `PARALLEL_VALID`
- `PARALLEL_DEFECT`
- `EN_ONLY_DEFECT`
- `ZH_ONLY_DEFECT`
- `MATERIAL_DIVERGENCE`
- `NO_COUNTERPART`
- `UNRESOLVED`

### `nextStep`

- `NONE`
- `DELETION_CANDIDATE`
- `MOVE_OR_RESTATE_IN_RATIONALE`
- `FULL_ITEM_REVIEW`
- `RENDERER_OR_SCHEMA_PLACEMENT_CHECK`
- `BILINGUAL_REVIEW`
- `OWNER_ADJUDICATION`

Do not invent additional enum values. An unmodeled concern belongs under `OTHER_CONFIRMED_TERMINAL_DEFECT` or `AMBIGUOUS_TERMINAL_FUNCTION` with an exact explanation.

## 11. Calibration gates

These gates test whether Sonnet is applying the renderer and semantic rules correctly. Inspect the live queue row and item before using the expected outcome.

### 11.1 `gap_50_mc_03`

If the live item still places:

> The nurse should first {{1}} and then {{2}}.

in ordinary `stem` while separately rendering the same sentence through `clozeStem`, classify it:

- `FLAG`;
- primary `DUPLICATED_RESPONSE_SCAFFOLD` or `RAW_TEMPLATE_OR_SCHEMA_LEAK`;
- the other class as a secondary flag;
- low removal risk;
- `RENDERER_OR_SCHEMA_PLACEMENT_CHECK` or `DELETION_CANDIDATE`.

### 11.2 Fill-in-blank literal placeholders

Inspect these live IDs when present:

- `gpt_gap_jun11_fib_scabies_precautions_03`;
- `gpt_gap_jun11_fib_lung_cancer_screening_03`.

If `{{b1}}` / `{{b2}}` remain in ordinary fill-in-blank `stem`, they are literal learner-visible template leaks because the fill-in-blank renderer does not substitute them. They must not pass as legitimate inline blanks.

### 11.3 Bilingual boundary nondefect

For `opus_bcc_rehab_2026_06_10_04`, English may split the calculation demand and rounding instruction while Chinese combines them. If the complete meanings remain equivalent, classify the terminal sentence as a legitimate rounding instruction with `PARALLEL_VALID`.

### 11.4 Ordinary clinical facts

Terminal clinical prose such as refractory lithium toxicity, nipple soreness during feeding, or a croup presentation is not defective merely because it ends the stem. Removal risk should reflect whether the fact is answer-bearing.

### 11.5 Clozapine ordered-response disclaimer

For `gpt_case_clozapine_toxicity_01_q5`, inspect the options and key. A sentence explaining that neutropenic precautions also apply but the options focus on serial steps is author-facing construction commentary and evidence of item-design compensation.

The expected shape is:

- `FLAG`;
- `ITEM_DESIGN_COMPENSATION` and/or `CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE`;
- removal risk at least `POSSIBLE_AMBIGUITY` unless full-item inspection proves deletion safe;
- `FULL_ITEM_REVIEW`, not automatic deletion-only remediation.

### 11.6 Construct-defense calculations

A terminal sentence beginning `This item asks only for...` after an otherwise complete calculation demand is likely `CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE`. Inspect the full item before deciding whether the disclaimer carries any necessary closed-world fact.

A calibration-gate miss does not authorize retroactive bulk relabeling by phrase. Correct the individual row from live evidence and continue direct review.

## 12. Batch protocol

Review contiguous queue ranges in exact order.

Maximum batch size: **64 rows**.

When the queue contains 2,673 rows, the expected shape is:

- batches 001–041: 64 rows each;
- batch 042: queue indices 2625–2673, 49 rows.

If the live queue count differs, derive the final batch boundary mechanically and record it before review. Do not change the 64-row maximum.

For every batch:

1. Read every row in the range directly.
2. Re-open live items as required by §7.
3. Write one JSON object per input row, in exact queue order, to the corresponding batch file.
4. Confirm line count and queue-index sequence.
5. Update `batch-ledger.md` with:
   - batch number;
   - queue-index range;
   - input count;
   - output count;
   - first and last stable identities;
   - `DELIVERED`, `PARTIAL`, or `BLOCKED`;
   - exact next queue index.
6. Do not revise an earlier batch to normalize later totals. Correct an earlier row only when direct reinspection identifies a specific mistake; record the correction in the ledger.

Context compaction is not a reason to abandon the task. The queue, batch files, and ledger are the durable state. After compaction, reread this spec, the ledger, and the last completed batch before continuing.

## 13. Batch JSONL contract

Each batch file contains exactly one compact JSON object per queue row in the same order:

```json
{
  "queueIndex": 890,
  "bankPath": "banks/gemini-canonical.json",
  "topLevelQuestionId": "gap_50_mc_03",
  "embeddedQuestionId": null,
  "recordKind": "TOP_LEVEL_SCORED_LEAF",
  "itemType": "dropdown_cloze",
  "terminalSentenceEn": "The nurse should first {{1}} and then {{2}}.",
  "terminalSentenceZh": "护士应首先 {{1}}，然后 {{2}}。",
  "terminalSentenceCorrected": null,
  "verdict": "FLAG",
  "primaryClass": "DUPLICATED_RESPONSE_SCAFFOLD",
  "secondaryFlags": ["RAW_TEMPLATE_OR_SCHEMA_LEAK"],
  "speechActTarget": "AUTHOR_OR_COMPILER",
  "neededForAnswer": "NO",
  "removalRisk": "LOW",
  "bilingualRelation": "PARALLEL_DEFECT",
  "quotedEvidence": [
    {"location": "stem.en", "quote": "The nurse should first {{1}} and then {{2}}."},
    {"location": "responseContext.clozeStem.en", "quote": "The nurse should first {{1}} and then {{2}}."}
  ],
  "reason": "The ordinary stem duplicates the separately rendered cloze response and exposes raw placeholders above the functional dropdown controls.",
  "nextStep": "RENDERER_OR_SCHEMA_PLACEMENT_CHECK",
  "controlVerdict": null,
  "controlPrimaryClass": null,
  "controlReason": null
}
```

Requirements:

- identity fields and terminal strings match the queue exactly;
- `terminalSentenceCorrected` is non-null only when segmentation is materially wrong, and must quote the corrected terminal span from the full stem;
- every row has a concise, item-specific reason;
- repeated stock reasons are unacceptable when they do not identify the actual role of the sentence;
- every `FLAG` or `REVIEW` has exact quoted evidence;
- every duplicate/placement finding quotes the other rendered field;
- every `FULL_ITEM_REVIEW` reason states what deeper ambiguity or design issue may remain;
- every control-selected row has `controlVerdict`, `controlPrimaryClass`, and `controlReason` populated;
- non-selected control fields are `null`;
- no aggregate counts, confidence scores, repair prose, or replacement text appear in batch rows.

For PASS rows, the reason may be brief but must identify the item-specific function, for example `Essential final assessment finding establishing refractory lithium toxicity.` It may not be a blind default such as `Legitimate terminal sentence.`

## 14. Control-sentence review

When `controlSelected` is true, classify the exact penultimate control sentence using the same semantic principles.

Allowed control verdicts:

- `PASS`
- `FLAG`
- `REVIEW`

Use the same primary-class vocabulary. The control result describes whether the suspected defect family is concentrated terminally; it does not authorize mutation of the control sentence.

Do not automatically pass controls. Do not classify them from a phrase list. Read their complete item context.

## 15. `batch-ledger.md`

Keep the ledger factual and compact.

Required header:

- exact Sonnet selector/model label and Claude Code version if visible;
- date;
- branch and HEAD;
- queue path and line count;
- planned batch size;
- starting changed paths.

Required batch table:

| Batch | Queue range | Input | Output | Status | Next index | Notes |
|---|---:|---:|---:|---|---:|---|

The ledger records delivery state only. It must not summarize findings or claim semantic correctness.

## 16. `delivery.md`

Write this only after the final delivered batch or an honest stop.

Include:

- exact model/harness;
- branch and HEAD;
- starting and ending changed paths;
- queue line count;
- expected and actual batch count;
- delivered row count;
- missing, duplicate, or extra queue indices known from direct checks;
- first unreviewed queue index, or `none`;
- confirmation that no semantic generator/classifier script was written or executed;
- confirmation that no existing file was modified;
- one status:
  - `SONNET_BATCH_DELIVERY_COMPLETE`
  - `SONNET_PARTIAL_CONTEXT_LIMIT`
  - `SONNET_BLOCKED_INPUT_RECONCILIATION`
  - `SONNET_BLOCKED_OUTPUT_CONTAMINATION`
  - `SONNET_BLOCKED_CONCURRENT_BANK_CHANGE`

`SONNET_BATCH_DELIVERY_COMPLETE` means only that Sonnet delivered one direct adjudication row for every queue row. It does not mean the census is accepted, independently reviewed, remediation-ready, or complete at the project level.

Do not write a findings report, class totals, terminal-position enrichment claim, deletion count, remediation plan, governance proposal, or recommendation to mutate banks.

## 17. Producer-conflict boundary

Sonnet may be producer-conflicted for some `claude_*` content. Do not claim that this pass independently clears principle 2 for every row.

The post-review checker will route every mutation-bearing finding on known or possible Claude-produced content to a non-Claude seat. `opus*` IDs remain governed by the current provenance ruling in `DECISIONS.md`; do not infer producer conflict from the containing canonical filename alone.

This conflict does not excuse incomplete semantic review. It limits what the later project may treat as independently certified.

## 18. Acceptance gates for delivery

Sonnet may use `SONNET_BATCH_DELIVERY_COMPLETE` only when:

- every queue index appears in exactly one batch file;
- batch rows remain in exact queue order;
- all identity fields and terminal strings match the queue;
- only authorized enum values appear;
- every row has direct, item-specific reasoning;
- every selected control sentence was semantically reviewed;
- all calibration gates were located and handled from live evidence;
- ordinary clinical facts and rounding/format instructions were not systematically overflagged;
- dropdown-cloze and fill-in-blank placeholder behavior was distinguished correctly;
- ambiguous deletion safety used `REVIEW` or `FULL_ITEM_REVIEW` rather than forced certainty;
- no semantic generation/classification script exists;
- no prior adjudication was copied;
- no existing repository file was changed;
- no commit or push occurred.

The external checker may still reject the delivery despite these conditions.

## 19. Stop conditions

Stop and record the applicable status when:

- the queue line count or identities cannot be reconciled;
- a live bank changes during review and the queue snapshot can no longer be trusted;
- any existing file is modified by the task;
- direct review cannot continue without proxy classification or fabricated rows;
- context/tool limits prevent reliable continuation.

Do not reduce the corpus, omit controls, expand the batch size, or assign default PASS rows to obtain a completed ledger.

## 20. Final response

After writing `delivery.md`, respond only with:

1. the Sonnet review directory path;
2. the delivery status;
3. `<queue rows> input rows / <delivered rows> delivered rows / <batch count> batches`;
4. the first unreviewed queue index or `none`;
5. confirmation that no existing file was changed and no semantic classifier/generator was created.

Do not summarize findings or claim that the project census passed.