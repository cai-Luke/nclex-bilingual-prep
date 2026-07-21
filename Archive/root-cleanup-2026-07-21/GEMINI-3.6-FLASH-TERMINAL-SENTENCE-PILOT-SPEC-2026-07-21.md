# Gemini 3.6 Flash Pilot — Blinded Terminal-Sentence Semantic Review

Date: 2026-07-21
Owner: Gemini 3.6 Flash review seat in Google Antigravity
Status: ready to run
Mode: bounded blinded pilot → external scoring → no autonomous continuation

## 1. Purpose

This is a **model-capability pilot**, not a corpus audit and not a remediation task.

Review exactly 64 preselected question records from the existing terminal-sentence queue and determine whether the terminal sentence belongs on the learner-facing stem. The batch deliberately mixes:

- legitimate clinical facts;
- legitimate response demands and answer-format instructions;
- legitimate case-navigation language;
- bilingual sentence-boundary asymmetries that may or may not be defects;
- raw template or schema leakage;
- duplicated response scaffolding;
- construct-boundary or source-defense commentary;
- prose that may compensate for a deeper item-design problem;
- ambiguous cases where `REVIEW` is more appropriate than forced certainty.

The identities, class distribution, and expected outcomes are intentionally not disclosed. The model must adjudicate each row from the item evidence rather than infer a target count.

The pilot answers one question:

> Can Gemini 3.6 Flash directly perform a bounded full-context semantic review without replacing the work with scripts, phrase matching, bulk defaults, or a fabricated completion report?

Passing or failing the pilot will be decided externally after the output is inspected. Gemini cannot declare that it passed.

## 2. Read boundary

Read only:

1. `AGENTS.md`;
2. this pilot specification;
3. the selected rows from:
   - `audit/terminal-sentence-semantic-census-2026-07-21/queue.jsonl`;
4. the corresponding live bank item when a selected queue row is incomplete, suspicious, or requires parent-case context.

To preserve the blind, **do not read**:

- `GEMINI-TERMINAL-SENTENCE-SEMANTIC-CENSUS-SPEC-2026-07-21.md`;
- `PROJECT-HISTORY.md` entries about prior attempts;
- `audit/terminal-sentence-semantic-census-2026-07-21/adjudication-partial.jsonl`;
- `audit/terminal-sentence-semantic-census-2026-07-21/prefilter-signals.jsonl`;
- `audit/terminal-sentence-semantic-census-2026-07-21/mechanical-prefilter.ts`;
- `audit/terminal-sentence-semantic-census-2026-07-21/quarantine/**`;
- prior batch files, walkthroughs, reports, or prior model dispositions;
- chat transcripts or external summaries of the earlier audit.

Do not browse the web. This pilot evaluates learner-surface speech acts and item construction, not current clinical-source verification.

## 3. Input batch

The authoritative source is:

```text
audit/terminal-sentence-semantic-census-2026-07-21/queue.jsonl
```

Review exactly these `queueIndex` values, in the order shown:

```text
1, 2, 3, 5, 6, 8, 19, 25,
31, 44, 69, 72, 79, 85, 92, 99,
147, 154, 162, 196, 198, 205, 207, 213,
218, 227, 236, 237, 244, 247, 270, 350,
500, 764, 823, 888, 889, 890, 891, 892,
902, 904, 905, 920, 921, 922, 931, 932,
933, 934, 1103, 1108, 1208, 1444, 1486, 1492,
1645, 1683, 1711, 1731, 1783, 2176, 2178, 2185
```

The pilot contains exactly 64 rows. Do not add adjacent rows, replace difficult rows, sample from the rest of the queue, or review the full corpus.

A read-only shell command may be used to locate or display the selected source rows. No helper program may be written or executed.

## 4. Absolute prohibition on proxy substitution

The required work is direct semantic adjudication by the model.

Do not:

- write TypeScript, JavaScript, Python, shell, regex, or other classification code;
- create a prefilter, sweeper, extractor script, summarizer, validator, append script, or report generator;
- use phrase matching as a substitute for reading the full row;
- assign default verdicts and override a small exception list;
- classify from punctuation, sentence position, item type, IDs, or mechanical signals alone;
- copy prior adjudications or reconstruct them from quarantined artifacts;
- call a deterministic process a “semantic sweep,” “model simulation,” or equivalent;
- create a report that claims the corpus was reviewed;
- edit an output after seeing aggregate totals merely to make the distribution look plausible.

The queue’s `mechanicalSignals` are nonbinding extraction evidence. They may prompt closer inspection but must never determine the verdict. In particular, sentence-count mismatch is not automatically a bilingual defect.

If the task cannot be completed by direct review in the current context, stop honestly with `PILOT_PARTIAL_CONTEXT_LIMIT`. Do not manufacture the remaining rows.

## 5. Semantic review method

For every selected row, read at least:

- `fullStemEn` and `fullStemZh`;
- `terminalSentenceEn` and `terminalSentenceZh`;
- the item type;
- `responseContext`, including choices and key where present;
- the correct rationale;
- the test-taking strategy when present.

Re-open the live item when the queue lacks enough parent-case or response-surface context.

Answer these questions in order:

1. What speech act is the terminal sentence performing?
2. Is it a clinical-world fact, a governing rule, or a genuine learner response instruction?
3. Would removing it discard necessary scenario information or answer-format requirements?
4. Does another rendered field already perform the same response job?
5. Does it expose raw placeholders, internal schema syntax, or compiler scaffolding?
6. Does it explain how the author constrained, defended, or adjudicated the item?
7. Does it reveal the interpretation needed to force the answer rather than provide ordinary scenario data?
8. Is it compensating for a deeper defect in the choices, key, ordering, or item type?
9. Does the Chinese version preserve the full meaning even when sentence boundaries differ?

Use `REVIEW` when the function is genuinely mixed or deletion safety cannot be determined from the evidence. Uncertainty is preferable to invented confidence.

## 6. Precision rules

### 6.1 Normally legitimate

Do not flag a sentence merely because it is last or sounds instructional. These commonly belong on the learner surface:

- `Select all that apply.`
- `Place the actions in order.`
- `Round to the nearest whole number.`
- `Record the answer as a number.`
- `Do not include the unit in the answer box.`
- a formula, timing rule, threshold, protocol, provider order, source result, client preference, or refusal needed to answer;
- a clinical fact that completes the scenario;
- ordinary directions to read a case record and answer its questions.

A response-format rule is not an authorial leak merely because it tells the learner how to enter an answer.

### 6.2 Confirmed defect shapes

A terminal sentence is a defect when evidence shows that it:

- places raw `{{...}}` template syntax on the ordinary learner-facing stem;
- repeats a separately rendered response surface such as `clozeStem`;
- addresses the author, compiler, or checker rather than the learner;
- explains what the item was limited to or why the choices were constructed a certain way;
- appends source-defense language after an otherwise complete response demand;
- forces one interpretation to rescue ambiguous choices, sequencing, or item type;
- materially changes or omits meaning in only one language.

### 6.3 Bilingual boundary trap

English and Chinese do not need identical sentence counts. A Chinese sentence may combine an English calculation demand and rounding instruction while preserving the same full meaning. That is not a material defect by itself.

Classify `BILINGUAL_TERMINAL_DEFECT` only when the paired language materially adds, omits, contradicts, or changes the learner-facing requirement or clinical meaning.

### 6.4 Deletion safety

A sentence can be defective but still load-bearing because it compensates for a deeper item problem. In that case use:

- `verdict: REVIEW` or `FLAG`;
- `removalRisk: POSSIBLE_AMBIGUITY` or `HIGH_REWRITE_REQUIRED`;
- `nextStep: FULL_ITEM_REVIEW` or `OWNER_ADJUDICATION`.

Do not call every defect a deletion-only repair.

## 7. Closed adjudication vocabulary

Every row receives exactly one `verdict`:

- `PASS`
- `FLAG`
- `REVIEW`

Every row receives exactly one `primaryClass` from this closed list.

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

Do not invent synonyms or additional enum values.

Allowed values for the remaining fields:

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

## 8. Output boundary

Create exactly one task-owned directory:

```text
audit/terminal-sentence-gemini-3-6-flash-pilot-2026-07-21/
```

Write exactly two files:

```text
audit/terminal-sentence-gemini-3-6-flash-pilot-2026-07-21/pilot-adjudication.jsonl
audit/terminal-sentence-gemini-3-6-flash-pilot-2026-07-21/pilot-run.md
```

Do not modify or move any existing file. In particular:

- no bank edits;
- no prompt, schema, source, governance, history, census, or ledger edits;
- no changes to the existing census directory;
- no quarantine cleanup;
- no staging, commit, push, stash, reset, or worktree cleanup.

## 9. `pilot-adjudication.jsonl` contract

Write exactly 64 compact JSON objects, one per line, in the exact input order.

Each row must contain:

```json
{
  "queueIndex": 890,
  "bankPath": "banks/example.json",
  "topLevelQuestionId": "example_id",
  "embeddedQuestionId": null,
  "recordKind": "TOP_LEVEL_SCORED_LEAF",
  "itemType": "dropdown_cloze",
  "terminalSentenceEn": "...",
  "terminalSentenceZh": "...",
  "verdict": "FLAG",
  "primaryClass": "DUPLICATED_RESPONSE_SCAFFOLD",
  "secondaryFlags": ["RAW_TEMPLATE_OR_SCHEMA_LEAK"],
  "speechActTarget": "AUTHOR_OR_COMPILER",
  "neededForAnswer": "NO",
  "removalRisk": "LOW",
  "bilingualRelation": "PARALLEL_DEFECT",
  "quotedEvidence": [
    {"location": "stem.en", "quote": "..."},
    {"location": "responseContext.clozeStem.en", "quote": "..."}
  ],
  "reason": "Item-specific semantic explanation.",
  "nextStep": "DELETION_CANDIDATE"
}
```

Requirements:

- identity fields and terminal strings must match the queue exactly;
- all enums must come from the closed vocabulary;
- every row requires a nonempty, item-specific `reason`;
- a generic repeated reason is not acceptable;
- every `FLAG` or `REVIEW` requires exact quoted evidence;
- `PASS` rows may use one concise evidence-based reason but still require actual item-specific judgment;
- do not include expected labels, confidence scores, aggregate counts, or claims that the pilot passed.

## 10. `pilot-run.md` contract

Keep this file short. Include only:

- exact model selector label and backend/model ID if visible;
- harness: Google Antigravity;
- date;
- branch and HEAD if available;
- starting changed paths;
- ending changed paths;
- input row count: 64;
- output row count;
- output order and identity reconciliation result;
- confirmation that no script or automated classifier was written or executed;
- confirmation that no file outside the pilot directory was changed;
- one status:
  - `PILOT_BATCH_COMPLETE`
  - `PILOT_PARTIAL_CONTEXT_LIMIT`
  - `PILOT_BLOCKED_INPUT_RECONCILIATION`
  - `PILOT_BLOCKED_OUTPUT_CONTAMINATION`

`PILOT_BATCH_COMPLETE` means only that the 64-row deliverable is complete. It does not mean that the model passed external evaluation, that the corpus was reviewed, or that remediation is authorized.

Do not include a prose findings report, counts by class, terminal-position hypothesis, remediation plan, or recommendation to continue.

## 11. External acceptance gates

These gates are for the owner/checker. Gemini must not self-score against them or edit its output after being shown the result.

The pilot is eligible to pass only when all are true:

- all 64 identities appear exactly once and in order;
- only authorized enum values appear;
- all 64 rows contain direct, item-specific reasoning;
- raw template syntax and duplicated response surfaces are recognized when present;
- construct-defense and item-design compensation are recognized when present;
- ordinary clinical facts are not flagged merely for being terminal prose;
- ordinary rounding and answer-format instructions are not flagged merely for being instructions;
- bilingual sentence-boundary differences are not mislabeled as material divergence;
- ambiguous cases use `REVIEW` rather than fabricated certainty;
- no helper script, bulk-default mechanism, regex classifier, or generated completion report exists;
- the model does not claim to have reviewed the 2,673-row corpus;
- no existing file was changed.

A single principal forcing-item miss, systematic false-positive pattern, invented enum, proxy-classification script, or fabricated completion claim is sufficient to fail the pilot.

## 12. Final response

After writing the two files, respond only with:

1. the two output paths;
2. the pilot status;
3. `64 input rows / <N> output rows`;
4. confirmation that no existing file was changed and no classifier script was created.

Do not summarize findings or claim that the model passed.