# Terminal-Sentence Census — Blind Independent Checker Pilot

Date: 2026-07-22  
Owner: Project Shrimp architect seat  
Status: ready for repeated model qualification  
Mode: frozen 64-row packet → blind direct semantic review → owner-only evaluation

## 1. Purpose

Qualify a candidate model for the independent semantic-checker seat before assigning the full terminal-sentence census review.

The candidate must independently determine what each selected learner-visible terminal sentence is doing and whether it is legitimate or defective. The packet intentionally mixes:

- genuine template and renderer-placement defects;
- author/checker language leaked onto the learner surface;
- answer-bearing or item-design compensation;
- bilingual defects;
- ordinary clinical facts;
- legitimate response-format and calculation instructions;
- sentence-segmentation artifacts;
- difficult boundary cases.

The prevalence and identities of each group are intentionally undisclosed. Do not infer or target a desired number of flags.

This pilot is a qualification task only. It does not accept the prior census, authorize bank mutation, generate a remediation manifest, or replace the full checker commission.

## 2. Candidate identity

At the start, choose one filesystem-safe model slug containing only lowercase letters, numbers, and hyphens, for example:

```text
kimi-k3
model-name-version
```

Record the exact public model selector, provider, harness, and visible version in `delivery.md`. Do not describe a model as independent without identifying it precisely.

## 3. Authority and read order

Read current disk in this order:

1. `AGENTS.md`
2. `docs/AGENTS-RUNBOOK.md`
3. `DECISIONS.md`, especially:
   - principle 2: semantic judgment requires independent review;
   - principle 3: deterministic mechanics versus semantic residual;
   - principle 7: precision over volume;
   - principle 21: construction language stays off learner surfaces;
   - principle 26: deletion or suppression requires an independently checked precondition;
   - principle 28: scored leaves and case containers remain distinct.
4. `src/types.ts`
5. `src/App.tsx`, specifically the learner rendering paths for:
   - ordinary stems;
   - `FillInBlankControl`;
   - `DropdownClozeControl` and `ClozeLine`;
   - case-study containers and embedded parts.
6. `audit/terminal-sentence-semantic-census-2026-07-21/queue.jsonl`
7. The corresponding live `banks/*.json` item for every pilot row.

The live repository and renderer are authoritative. The queue is the frozen identity and extraction surface; it is not authority for renderer behavior when current code proves otherwise.

Do not browse the web. This task evaluates speech act, learner-surface placement, removal safety, item construction, and bilingual meaning. It does not verify current clinical guidance.

## 4. Blind boundary

The candidate must not read any prior semantic verdict, report, summary, calibration answer, or owner evaluation from this audit family before its output is frozen.

Explicitly prohibited:

```text
audit/terminal-sentence-sonnet-review-2026-07-21/**
audit/terminal-sentence-semantic-census-2026-07-21/adjudication-partial.jsonl
audit/terminal-sentence-semantic-census-2026-07-21/prefilter-signals.jsonl
audit/terminal-sentence-semantic-census-2026-07-21/quarantine/**
audit/terminal-sentence-gemini-3-6-flash-pilot-2026-07-21/**
SONNET-TERMINAL-SENTENCE-SEMANTIC-CENSUS-SPEC-2026-07-21.md
TERMINAL-SENTENCE-POST-REVIEW-ADJUDICATION-SPEC-2026-07-21.md
TERMINAL-SENTENCE-INDEPENDENT-CHECKER-SALVAGE-SPEC-2026-07-22.md
TERMINAL-SENTENCE-CHECKER-PILOT-OWNER-EVALUATION-2026-07-22.md
any prior candidate-model output under the pilot audit root
chat transcripts or summaries describing prior model findings
```

The exclusions are part of the test. If any prohibited semantic material is opened, stop and write `PILOT_BLOCKED_BLIND_CONTAMINATION`. Do not continue and claim independence.

The candidate may use exact queue indices supplied in this work order. Their inclusion does not imply any expected verdict.

## 5. Output boundary

Create exactly one model-owned directory:

```text
audit/terminal-sentence-independent-checker-pilot-2026-07-22/<model-slug>/
```

Authorized outputs:

```text
pilot-adjudication.jsonl
delivery.md
```

Everything else is read-only.

Do not:

- edit any bank;
- edit source, schema, prompts, governance, history, ledgers, queue, prior audits, or this spec;
- write outside the model-owned directory;
- stage, commit, push, stash, reset, clean, or switch branches;
- delete or normalize another model's pilot output.

## 6. Fixed pilot packet

Review exactly these 64 queue indices, in this order:

```text
57, 69, 147, 162, 226, 656, 702, 735,
799, 888, 890, 892, 902, 904, 905, 920,
921, 922, 931, 932, 933, 1103, 1108, 1486,
1492, 1731, 2115, 2123, 2130, 2166, 2175, 2176,
2177, 2178, 2179, 2181, 2185, 2189, 2190, 2192,
2199, 2211, 2212, 2219, 2221, 2224, 2226, 2227,
2228, 2230, 2231, 2232, 2235, 2238, 2370, 2402,
2412, 2413, 2425, 2433, 2438, 2440, 2477, 2493
```

`pilotOrdinal` is 1 through 64 in the sequence above. Do not sort the output differently, add nearby rows, substitute rows, or omit difficult rows.

For every selected queue row, inspect the complete live item. For an embedded leaf, inspect its parent case and applicable stage/exhibit context. For a top-level case container, judge the container stem as its own learner-rendered surface rather than treating it as a scored leaf.

## 7. Absolute prohibition on proxy adjudication

This is direct semantic review by the candidate model.

Do not write or execute code that generates, assigns, copies, defaults, transforms, or packages semantic dispositions. Prohibited mechanisms include:

- regex or keyword classification;
- a verdict map in code;
- a script containing model-authored row dictionaries;
- bulk PASS defaults with exception overrides;
- a program that fills verdicts, classes, reasons, evidence, removal risk, next steps, controls, or corrected spans;
- copying prior verdicts;
- revising rows to achieve a plausible distribution.

Read-only commands may locate queue rows, inspect live items, inspect renderer code, count output lines, or check Git status.

After the model has written the semantic rows directly, a deterministic validator may check JSON syntax, exact row count, index order, enum membership, and required-field presence. It may not alter the file or supply missing semantic content.

If the harness cannot write the 64 rows directly without semantic packaging code, stop with `PILOT_BLOCKED_OUTPUT_CONTAMINATION`.

## 8. Required inspection depth

For every row, read at least:

- `fullStemEn` and `fullStemZh` from the queue;
- extracted terminal and penultimate sentences;
- `recordKind`, item type, category, and topic;
- complete `responseContext`, including choices, rows, columns, blanks, tokens, cloze fields, and keys;
- correct rationale and test-taking strategy in both languages when present;
- selected control sentence when `controlSelected` is true;
- the complete live bank item.

Open the relevant renderer code when the judgment depends on:

- whether `{{...}}` is replaced or displayed literally;
- whether another response field renders separately;
- whether a sentence duplicates another learner surface;
- whether the apparent terminal fragment is only an extraction/segmentation artifact;
- whether a case-container stem renders learner-visible above embedded items.

Set `inspectionDepth` to:

- `QUEUE_AND_LIVE_ITEM`; or
- `QUEUE_LIVE_ITEM_AND_RENDERER`.

No queue-only adjudication is acceptable in this pilot.

## 9. Semantic decision sequence

For each row, answer in order:

1. What speech act does the terminal sentence perform?
2. Is it inside the clinical world, a genuine learner response operation, client/caregiver speech, or commentary addressed to an author, compiler, checker, or test designer?
3. Does deletion remove a needed clinical fact, governing rule, formula, threshold, timing constraint, response target, or answer-format instruction?
4. Does another learner-rendered field already perform the same job?
5. Does ordinary `stem` expose raw template syntax, placeholders, IDs, or schema notation?
6. Does the sentence describe how the item was bounded, sourced, serialized, defended, or constructed?
7. Does it disclose the interpretation needed to force the intended answer?
8. Does it compensate for incomplete choices, an ambiguous key, an invalid sequence, or an unsuitable item type?
9. Does Chinese preserve the complete meaning even when sentence boundaries differ?
10. Is an apparent fragment a queue segmentation artifact while the full live stem remains coherent?
11. Is deletion safe, or does the entire item require review?

Use `REVIEW` when the terminal function or removal safety is genuinely mixed. Do not force certainty and do not use REVIEW merely to avoid making a decision.

## 10. Precision rules

### 10.1 Normally legitimate

Do not flag a sentence merely because it is terminal, imperative, restrictive, self-contained, or awkward. These are commonly legitimate:

- ordinary multiple-choice, matrix, highlight, bowtie, select-all, cloze, and ordered-response demands;
- `Select all that apply.`;
- `Use each option once.`;
- `All options must be used.`;
- numeric entry and rounding rules;
- formulas, thresholds, provider orders, facility protocols, and supplied criteria needed to answer;
- direct clinical cautions about what a measurement or finding can and cannot establish;
- clinical facts that close the scenario;
- client preferences, refusals, and quotations;
- ordinary case navigation.

A true statement may still be defective when its learner-facing role is to defend the author's construction. Judge function and placement, not truth alone.

### 10.2 Construction-language boundary

Author/checker language includes prose that tells the learner:

- what “this item” or “this question” tests or excludes;
- why an action, category, or option was omitted;
- how distractors or “near-misses” were constructed;
- that a framework remains on an exam or was source-supported;
- why only serial rather than concurrent actions appear;
- how the writer bounded a construct to protect the key.

Some such sentences also contain useful clinical cautions. In those cases, do not assume deletion is safe. Use an appropriate defect class with `POSSIBLE_AMBIGUITY` or `HIGH_REWRITE_REQUIRED`, and route to `FULL_ITEM_REVIEW` or naturalization rather than deletion-only repair.

Direct learner guidance is not automatically authorial leakage. Distinguish prose about the clinical task or supplied rule from prose about the artifact's design.

### 10.3 Renderer-aware placeholder rules

For `dropdown_cloze`:

- ordinary `stem` renders verbatim;
- `clozeStem` is a separate response surface whose placeholders become controls;
- a cloze response sentence copied into ordinary `stem` may duplicate the functional response surface;
- raw placeholders in ordinary `stem` remain learner-visible text.

For `fill_in_blank`:

- ordinary `stem` renders verbatim;
- inputs render separately from `blanks[]`;
- the runtime does not replace `{{b1}}`, `{{b2}}`, or similar tokens inside ordinary `stem`.

Do not classify braces without checking both item type and rendered field.

### 10.4 Bilingual boundaries and segmentation

English and Chinese may divide equivalent meaning into different sentence counts. The extracted terminal fragments can therefore differ while the full stems remain parallel.

Flag bilingual content only when one language materially adds, omits, contradicts, corrupts, or changes a clinical or response requirement. A parenthesis fragment or different sentence split is not itself a learner-facing defect when the complete live stem is coherent.

Use `terminalSentenceCorrected` only when the extracted terminal span is materially wrong for adjudication. Quote the corrected terminal span exactly from the full stem; do not rewrite prose in that field.

## 11. Closed adjudication vocabulary

Every row receives exactly one `verdict`:

- `PASS`
- `FLAG`
- `REVIEW`

Every row receives exactly one `primaryClass`.

PASS classes:

- `LEGITIMATE_CLINICAL_FACT`
- `LEGITIMATE_RESPONSE_DEMAND`
- `LEGITIMATE_GOVERNING_PROTOCOL_OR_ORDER`
- `LEGITIMATE_CLIENT_QUOTE_OR_TEACHING`
- `LEGITIMATE_CALCULATION_OR_ROUNDING_INSTRUCTION`
- `LEGITIMATE_OTHER`

FLAG classes:

- `DUPLICATED_RESPONSE_SCAFFOLD`
- `RAW_TEMPLATE_OR_SCHEMA_LEAK`
- `AUTHORIAL_CONSTRAINT_LEAK`
- `CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE`
- `ANSWER_TELEGRAPHING_OR_ADJUDICATION_NOTE`
- `ITEM_DESIGN_COMPENSATION`
- `REDUNDANT_META_DISCLAIMER`
- `BILINGUAL_TERMINAL_DEFECT`
- `OTHER_CONFIRMED_TERMINAL_DEFECT`

REVIEW class:

- `AMBIGUOUS_TERMINAL_FUNCTION`

`secondaryFlags` may contain FLAG classes only.

Allowed `speechActTarget`:

- `CLINICAL_WORLD`
- `LEARNER_RESPONSE`
- `CLIENT_OR_CAREGIVER`
- `AUTHOR_OR_COMPILER`
- `CHECKER_OR_REVIEWER`
- `MIXED`
- `UNCLEAR`

Allowed `neededForAnswer`:

- `YES`
- `NO`
- `PARTLY`
- `UNCLEAR`

Allowed `removalRisk`:

- `NONE`
- `LOW`
- `POSSIBLE_AMBIGUITY`
- `HIGH_REWRITE_REQUIRED`
- `UNCLEAR`

Allowed `bilingualRelation`:

- `PARALLEL_VALID`
- `PARALLEL_DEFECT`
- `EN_ONLY_DEFECT`
- `ZH_ONLY_DEFECT`
- `MATERIAL_DIVERGENCE`
- `NO_COUNTERPART`
- `UNRESOLVED`

Allowed `nextStep`:

- `NONE`
- `DELETION_CANDIDATE`
- `MOVE_OR_RESTATE_IN_RATIONALE`
- `FULL_ITEM_REVIEW`
- `RENDERER_OR_SCHEMA_PLACEMENT_CHECK`
- `BILINGUAL_REVIEW`
- `OWNER_ADJUDICATION`

Do not invent enum values.

## 12. `pilot-adjudication.jsonl` contract

Write exactly 64 compact JSON objects, one per line, in the fixed packet order.

Required shape:

```json
{
  "pilotOrdinal": 1,
  "queueIndex": 57,
  "bankPath": "banks/example-canonical.json",
  "topLevelQuestionId": "example_id",
  "embeddedQuestionId": null,
  "recordKind": "TOP_LEVEL_SCORED_LEAF",
  "itemType": "multiple_choice",
  "terminalSentenceEn": "Exact queue string.",
  "terminalSentenceZh": "Exact queue string.",
  "terminalSentenceCorrected": null,
  "verdict": "PASS",
  "primaryClass": "LEGITIMATE_RESPONSE_DEMAND",
  "secondaryFlags": [],
  "speechActTarget": "LEARNER_RESPONSE",
  "neededForAnswer": "YES",
  "removalRisk": "HIGH_REWRITE_REQUIRED",
  "bilingualRelation": "PARALLEL_VALID",
  "quotedEvidence": [
    {"location": "stem.en", "quote": "Exact evidence."}
  ],
  "reason": "Concise, item-specific semantic reasoning.",
  "nextStep": "NONE",
  "inspectionDepth": "QUEUE_AND_LIVE_ITEM",
  "controlVerdict": null,
  "controlPrimaryClass": null,
  "controlQuotedEvidence": null,
  "controlReason": null
}
```

Requirements:

- identity and terminal strings match the frozen queue exactly;
- `quotedEvidence` is always an array of `{location, quote}` objects, never a string;
- every row has at least one exact evidence object;
- every FLAG or REVIEW quotes the defective span and the local context needed to prove function or removal risk;
- duplicate/placement findings quote the other rendered field;
- segmentation judgments quote enough of the full stem to show whether the learner-visible text is coherent;
- `reason` is item-specific and explains the sentence's actual job;
- repeated stock reasons are unacceptable when they omit context;
- `terminalSentenceCorrected` is an exact extracted-span correction, not proposed replacement prose;
- when `controlSelected` is true in the queue, populate all four control fields and review the exact control sentence independently;
- when `controlSelected` is false, all four control fields are `null`;
- control evidence uses the same array-of-objects shape;
- do not include Sonnet verdicts, confidence scores, repair copy, aggregate findings, or comparison commentary.

## 13. `delivery.md`

Write after the semantic output is complete or the run honestly stops.

Include:

- exact model, provider, harness, and visible version;
- date;
- branch and HEAD;
- starting and ending changed paths;
- model slug and output directory;
- expected packet count: 64;
- delivered row count;
- exact missing, duplicate, extra, or out-of-order indices;
- first unreviewed pilot ordinal and queue index, or `none`;
- confirmation that every delivered row was based on the queue plus live item;
- confirmation that prohibited prior semantic material was not read;
- confirmation that no semantic generator, classifier, packaging script, or verdict map was written or executed;
- confirmation that no existing file was modified;
- one status:
  - `PILOT_DELIVERY_COMPLETE`
  - `PILOT_PARTIAL_CONTEXT_LIMIT`
  - `PILOT_BLOCKED_BLIND_CONTAMINATION`
  - `PILOT_BLOCKED_OUTPUT_CONTAMINATION`
  - `PILOT_BLOCKED_CONCURRENT_BANK_CHANGE`.

`PILOT_DELIVERY_COMPLETE` means only that the model delivered a structurally complete blind review. It does not mean the model passed owner evaluation or is authorized for the full checker seat.

## 14. Stop conditions

Stop rather than manufacture completion when:

- prohibited prior semantic material was opened;
- the queue identity no longer matches the live bank and cannot be reconciled;
- another task changes a relevant bank during review;
- direct model-authored output cannot continue without semantic packaging code;
- context or tool limits prevent reliable review;
- the task writes outside its model-owned directory.

Do not reduce the packet, silently default rows, borrow another model's output, or relax evidence requirements.

## 15. Final response

After writing `delivery.md`, respond only with:

1. the model-owned output directory;
2. delivery status;
3. `64 input rows / <delivered rows> delivered rows`;
4. first unreviewed pilot ordinal and queue index, or `none`;
5. confirmation that the blind boundary was preserved, no semantic packaging script was used, and no existing file was changed.

Do not summarize findings or claim that the pilot passed.