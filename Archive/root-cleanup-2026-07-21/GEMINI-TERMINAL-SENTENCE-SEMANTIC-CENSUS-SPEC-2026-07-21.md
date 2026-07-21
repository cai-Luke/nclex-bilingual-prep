# Gemini Work Order — Terminal-Sentence Semantic Census of Learner-Facing Questions

Date: 2026-07-21
Owner: Gemini research/review seat in Antigravity
Status: ready to run
Mode: deterministic queue construction → exhaustive batched semantic reading → evidence-only census → later architect/Codex adjudication

## 1. Purpose

Read the terminal sentence of every learner-facing question stem in the bundled Project Shrimp banks and identify sentences that function as producer, checker, template, or item-construction scaffolding rather than legitimate learner-facing content.

Recent learner reports suggest that several unrelated defects share one positional habit: the producer finishes an otherwise usable stem, then appends an explanatory or structural sentence at the end. Confirmed or strongly suspected examples include:

1. A direct authorial nursing-scope fence:

   > Do not independently prescribe an insulin dose.

2. An adjudication note compensating for an ordered-response design problem:

   > Source-patient testing and exposed-worker testing are separate processes; do not delay indicated PEP for a source result.

3. A construct-boundary/source-defense disclaimer appended to a calculation item:

   > This item asks only for documentation of the index; RSBI alone is not required to determine spontaneous-breathing-trial readiness.

4. Raw dropdown-cloze response scaffolding duplicated into the ordinary stem of `gap_50_mc_03`:

   > The nurse should first {{1}} and then {{2}}.

The fourth example is not an authorial-constraint defect. It is a template/surface-placement defect. This task therefore audits the broader semantic question:

> **What job is the terminal sentence doing, and does that job belong on the learner-facing stem?**

This is a census and review task, not a remediation task. Gemini must not edit any bank, rewrite any item, update governance, install an audit gate, or claim that the returned findings are independently reviewed canonical corrections.

## 2. Governing hypothesis

The working hypothesis is that the final sentence of the stem has become a recurring dumping ground for:

- author/checker instructions;
- explanations of how an item was constrained;
- source-defense or construct-boundary disclaimers;
- answer-bearing adjudication notes used to force one interpretation;
- duplicated response instructions already rendered elsewhere;
- raw schema/template syntax;
- prose that compensates for an ambiguous or invalid item design.

The hypothesis is not a verdict. Most terminal sentences will be legitimate clinical facts or ordinary response demands. Gemini must read every scoped record and may not treat terminal position itself as evidence of a defect.

To test whether the problem is actually concentrated at the end, the task also includes a deterministic nonterminal control sample. The report must compare the defect rate in terminal sentences with the defect rate in that control sample. This comparison is descriptive evidence, not a statistical proof.

## 3. Authority and role boundaries

Read current disk in this order before constructing the queue:

1. `AGENTS.md`
2. `DECISIONS.md`
   - principle 2: semantic judgment requires independent review;
   - principle 3: deterministic queue, LLM only for the irreducible semantic residual;
   - principle 5: generated/reviewed distinction;
   - principle 7: precision over volume;
   - principle 21 and its 2026-07-21 construction-language application;
   - principle 28: scored leaves versus session units.
3. `PROJECT-HISTORY.md`
4. `NCLEX-Question-Schema.md`
5. `src/types.ts`
6. `src/schema.ts`
7. `lib/question-population.ts`
8. `lib/producer-vocabulary-leakage.ts`
9. `lib/authorial-constraint-leakage.ts`
10. `audit/authorial-constraint-leakage-2026-07-21/remediation-report.md`
11. `audit/authorial-constraint-leakage-2026-07-21/post-survey-residuals.jsonl`
12. `audit/authorial-constraint-leakage-2026-07-21/pep-independent-review-final.md`
13. `NCLEX-Bank-Generation-Prompt.md`
14. `GeminiPrompt.md`
15. `gpt-evergreen-generation-prompt.md`
16. `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md`

The repository is authoritative. This work order supplies forcing examples and review intent; it does not override live item text, schema, IDs, population counts, or current remediation status.

Gemini is acting as a semantic census reader. Because Gemini may have produced some items in `gemini-canonical.json`, this pass must not claim universal `producer != checker` independence. Luke and a later architect/Codex or non-producer checker will adjudicate and repair the findings.

## 4. Blast-radius boundary

Gemini may create or replace files only beneath:

```text
audit/terminal-sentence-semantic-census-2026-07-21/
```

Expected final artifacts:

- `build-queue.ts` — deterministic, task-local extractor;
- `queue.jsonl` — one terminal-sentence record per scoped question record, with optional control evidence;
- `adjudication.jsonl` — exactly one Gemini disposition per queue row;
- `report.md` — reconciliation, counts, findings, controls, and handoff;
- optional `batches/` checkpoint files used to process the queue without context loss.

Everything outside that directory is read-only.

Explicitly prohibited:

- no edits to `banks/*.json`, `banks/banks-raw/**`, or `banks/_promoted/**`;
- no edits to source, schema, runtime, tests, prompts, governance, history, census, ledgers, or existing audit artifacts;
- no patch script targeting a bank;
- no staging, commit, push, stash, reset, cleanup, reformatting, or unrelated file movement;
- no browser or external clinical research;
- no claim that a flagged item is clinically repaired, validated, reviewed, canonical-ready, or safe to mutate;
- no expansion into a general prose-quality or clinical-currency audit.

At the start, record branch, HEAD, upstream/ahead-behind if available, all changed paths, and SHA-256 hashes of every bundled `banks/*.json` file. At the end, verify that the bank hashes are unchanged and that the only task-owned writes are under the authorized audit directory.

If a bundled bank changes while the queue or adjudication is being produced, stop and report `BLOCKED_CONCURRENT_BANK_CHANGE`. Do not combine rows from two snapshots.

## 5. Corpus

### 5.1 Primary population

Parse every bundled top-level `banks/*.json` file and use the current question-population owner in `lib/question-population.ts`.

Include:

- every top-level standalone scored leaf;
- every embedded case-study scored leaf;
- every top-level `case_study` container as a separate rendered-stem record, even though it is not itself a scored leaf.

Use these record kinds exactly:

- `TOP_LEVEL_SCORED_LEAF`;
- `EMBEDDED_SCORED_LEAF`;
- `TOP_LEVEL_CASE_CONTAINER`.

The report must keep scored leaves and case containers separate. Do not call the sum “scored questions.”

### 5.2 Primary reviewed surface

The primary target is the terminal sentence of:

- `stem.en`;
- its paired `stem.zh` meaning, reviewed alongside it.

Gemini must inspect the full stem, not only the extracted suffix. The terminal sentence cannot be classified safely without knowing what precedes it.

### 5.3 Required contextual surfaces

For every queue row, extract enough item context to determine what the terminal sentence is doing:

- full `stem.en` and `stem.zh`;
- penultimate sentence in each language when present;
- item type, category, topic, difficulty, and `ngnSkill`;
- the complete item-specific response structure and key:
  - option text and key for MC/SATA/ordered response;
  - blank prompts and accepted/numeric targets for fill-in-blank;
  - matrix rows, columns, and key;
  - `clozeStem`, dropdown options, and dropdown keys;
  - highlight segments and key;
  - bowtie prompts, tokens, and keys;
- `rationale.correct.en/zh`;
- `testTakingStrategy.en/zh`;
- parent case identity and enough shared case context for embedded leaves to interpret the stem;
- question-level `meta.source` only as provenance context, never as a learner-facing surface or adjudication authority.

The queue may summarize large response structures into exact text/key arrays, but it must not omit information needed to tell whether a final sentence duplicates another rendered field, telegraphs an answer, or compensates for an ambiguous key.

## 6. Deterministic queue construction

Write `build-queue.ts` inside the authorized audit directory. It is an audit helper, not production code.

The extractor must:

1. Parse and validate every bundled bank using current repository utilities where practical.
2. Traverse the complete question population in deterministic bank/path order.
3. Preserve exact strings and exact JSON paths.
4. Extract the terminal English sentence conservatively and record exact JavaScript string offsets into the full stem.
5. Extract the paired Chinese terminal sentence independently; do not assume punctuation boundaries align one-to-one with English.
6. Retain the full stem so Gemini can correct a weak segmentation mechanically inferred by the extractor.
7. Emit deterministic compact JSONL sorted by:
   - `bankPath`;
   - top-level question index;
   - embedded question index, with case containers before their leaves;
   - stable question ID.
8. Produce byte-identical `queue.jsonl` on a second run from the same bank snapshot.

Use `Intl.Segmenter` sentence segmentation when supported by the current Node runtime, with a conservative punctuation fallback. Do not silently discard a record because the stem lacks final punctuation. For every row include:

- `segmentationMethod`;
- `segmentationConfidence`: `HIGH | MEDIUM | LOW`;
- exact JavaScript string offsets for the terminal span;
- the complete unmodified stem.

If segmentation is uncertain, the row remains in scope. Gemini must read the full stem and may set `terminalSentenceCorrected` in its adjudication row.

### 6.1 Mechanical signals

The extractor may compute evidence signals, but they do not decide the semantic disposition. Include at least:

- `rawPlaceholderInStem` — `{{...}}` occurs in ordinary `stem`;
- `terminalContainsRawPlaceholder`;
- `normalizedTerminalEqualsClozeStem`;
- `normalizedTerminalContainedInClozeStem`;
- `clozeStemContainedInStem`;
- `terminalBeginsThisItemOrQuestion` — e.g. “This item…” or “This question…”;
- `terminalMentionsLearnerExpectation`;
- `terminalFollowsExplicitResponseDemand` — the previous sentence already contains “select,” “place,” “calculate,” “highlight,” “complete,” or equivalent bounded response wording;
- `terminalContainsPromptVocabularyHit` using existing finite producer/authorial vocabularies only as evidence;
- `pairedChinesePresent`;
- `exactEnglishTerminalRepeatedElsewhereInItem`;
- `exactChineseTerminalRepeatedElsewhereInItem`.

Do not add a broad mechanical flag for `do not`, `only`, `alone`, `must`, `scope`, `provider`, `delay`, or `independently`. Those words are common in legitimate clinical teaching.

### 6.2 Deterministic nonterminal control sample

For every record with at least two English sentences, calculate SHA-256 over:

```text
<bankPath>|<topLevelQuestionId>|<embeddedQuestionId-or-empty>|<recordKind>
```

Select the row into the control sample when the first unsigned byte of the hash modulo 10 equals `0`.

For selected rows, store the exact penultimate sentence as `controlSentenceEn` and its paired Chinese sentence when structurally resolvable. This should yield approximately 10% of eligible records without nondeterministic sampling.

Gemini must classify the control sentence using the same speech-act reasoning used for the terminal sentence. The control result is descriptive evidence about positional concentration; it does not authorize review of every nonterminal sentence.

## 7. `queue.jsonl` contract

Each compact JSONL row must contain at least:

```json
{
  "queueIndex": 1,
  "bankPath": "banks/gemini-canonical.json",
  "bankSha256": "...",
  "topLevelQuestionId": "gap_50_mc_03",
  "embeddedQuestionId": null,
  "recordKind": "TOP_LEVEL_SCORED_LEAF",
  "questionPath": "questions[123]",
  "itemType": "dropdown_cloze",
  "fullStemEn": "...",
  "fullStemZh": "...",
  "terminalSentenceEn": "The nurse should first {{1}} and then {{2}}.",
  "terminalSentenceZh": "...",
  "responseContext": {},
  "mechanicalSignals": {},
  "controlSelected": false
}
```

The actual row must also include:

- `category`;
- `topic`;
- `difficulty`;
- `ngnSkill` or `null`;
- `stemPathEn` and `stemPathZh`;
- terminal offsets and segmentation metadata;
- `penultimateSentenceEn` and `penultimateSentenceZh` or `null`;
- `responseContext` with exact response text and keys appropriate to the item type;
- `rationaleCorrectEn` and `rationaleCorrectZh`;
- `testTakingStrategyEn` and `testTakingStrategyZh`;
- `sourceMetadata` or `null`;
- `mechanicalSignals`;
- `controlSentenceEn` and `controlSentenceZh` or `null`.

`queue.jsonl` must be valid UTF-8 JSONL with one complete compact object per line and no surrounding array.

## 8. Semantic review question

For each queue row, answer these questions in order:

1. **What is the speech act of the terminal sentence?**
   - a fact inside the clinical world;
   - a genuine learner response instruction;
   - a governing protocol/order/threshold needed to answer;
   - client speech or teaching content;
   - commentary addressed to the author, checker, reviewer, or source dispute;
   - raw template/schema scaffolding;
   - an attempted repair of ambiguity or item design;
   - unclear/mixed.
2. **Would the learner lose a necessary clinical fact or response demand if the sentence disappeared?**
3. **Does another rendered field already perform the same job?**
4. **Does the sentence tell the learner how the item was authored, bounded, defended, or adjudicated?**
5. **Does it reveal or strongly cue the intended answer rather than supplying ordinary scenario data?**
6. **Is it compensating for a deeper problem in the choices, key, sequence, or item type?**
7. **Does the Chinese terminal sentence contain the same defect, omit it, or materially diverge?**

Do not decide from stylistic awkwardness alone. A clumsy but necessary clinical fact is not producer leakage.

## 9. Disposition vocabulary

Every row receives exactly one `verdict`:

- `PASS` — terminal sentence belongs on the learner surface;
- `FLAG` — evidence supports a concrete defect class;
- `REVIEW` — plausible concern, but deletion or repair cannot be recommended without owner/clinical judgment.

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
  - the ordinary stem repeats a separate rendered response field such as `clozeStem`;
- `RAW_TEMPLATE_OR_SCHEMA_LEAK`
  - raw placeholders, internal IDs, schema notation, or compiler scaffolding are visible;
- `AUTHORIAL_CONSTRAINT_LEAK`
  - a producer/checker rule is addressed directly to the learner;
- `CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE`
  - the sentence explains what the item is or is not testing, or defends a narrowed claim against a source/guideline concern;
- `ANSWER_TELEGRAPHING_OR_ADJUDICATION_NOTE`
  - the sentence supplies the interpretation needed to force the intended answer rather than ordinary clinical context;
- `ITEM_DESIGN_COMPENSATION`
  - the sentence attempts to rescue an ambiguous ordered sequence, option set, key, or item type;
- `REDUNDANT_META_DISCLAIMER`
  - author-facing reassurance remains after the actual response demand and adds no needed fact;
- `BILINGUAL_TERMINAL_DEFECT`
  - the terminal content or defect exists materially in only one language or changes clinical meaning;
- `OTHER_CONFIRMED_TERMINAL_DEFECT`
  - use rarely and explain why no defined class fits.

### REVIEW class

- `AMBIGUOUS_TERMINAL_FUNCTION`

Rows may include `secondaryFlags` drawn from the FLAG vocabulary. For example, `gap_50_mc_03` may primarily be `DUPLICATED_RESPONSE_SCAFFOLD` with secondary `RAW_TEMPLATE_OR_SCHEMA_LEAK`.

Do not invent new primary classes during batching. Put an unmodeled concern under `OTHER_CONFIRMED_TERMINAL_DEFECT` or `AMBIGUOUS_TERMINAL_FUNCTION`, then explain it in the report.

## 10. Required adjudication fields

Write exactly one compact object per queue row to `adjudication.jsonl`, in the same order as `queue.jsonl`:

```json
{
  "queueIndex": 1,
  "bankPath": "banks/gemini-canonical.json",
  "topLevelQuestionId": "gap_50_mc_03",
  "embeddedQuestionId": null,
  "recordKind": "TOP_LEVEL_SCORED_LEAF",
  "itemType": "dropdown_cloze",
  "terminalSentenceEn": "The nurse should first {{1}} and then {{2}}.",
  "terminalSentenceZh": "...",
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
    {"location": "clozeStem.en", "quote": "The nurse should first {{1}} and then {{2}}."}
  ],
  "reason": "The terminal stem sentence duplicates the separately rendered cloze sentence and exposes raw placeholders above the functional dropdown controls.",
  "nextStep": "DELETION_CANDIDATE",
  "controlVerdict": null,
  "controlPrimaryClass": null,
  "controlReason": null
}
```

Allowed values:

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

For every `FLAG` or `REVIEW` row:

- quote exact evidence from the stem and any duplicated/contradictory response field;
- explain the defect in 1–4 concise sentences;
- distinguish a low-risk deletion candidate from a sentence that appears to compensate for a deeper item problem;
- do not write replacement prose or propose answer-key mutations.

For `PASS` rows, a controlled class plus a short evidence-based reason is sufficient. Do not use a single templated sentence for hundreds of rows without verifying the actual function.

For control-selected rows, fill `controlVerdict`, `controlPrimaryClass`, and `controlReason` using the same principles. A control sentence may be flagged, but it is not automatically added to the terminal-remediation queue; preserve it as evidence that the defect class is not exclusively terminal.

## 11. Known-example gates

### 11.1 Live forcing item: `gap_50_mc_03`

Locate the exact live record by stable ID, not by screenshot wording alone.

Expected review outcome if the live payload matches the learner report:

- `verdict`: `FLAG`;
- primary class: `DUPLICATED_RESPONSE_SCAFFOLD` or `RAW_TEMPLATE_OR_SCHEMA_LEAK`;
- the response sentence appears in ordinary `stem` and is separately rendered from `clozeStem`;
- deletion from `stem` appears low risk because `clozeStem` remains the functional response surface.

If the ID is absent or the live payload no longer matches, do not fabricate the finding. Report `KNOWN_EXAMPLE_NOT_FOUND_OR_CHANGED` with the searched ID and observed state. The overall task may be `COMPLETE_WITH_KNOWN_EXAMPLE_DRIFT` only when the corpus reconciliation is otherwise complete.

### 11.2 RSBI locator

Search live bundled banks for:

> This item asks only for documentation of the index

and the surrounding RSBI calculation stem.

If present, expected class is `CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE`, likely with low removal risk if the preceding calculation demand is complete. Gemini must still inspect the full live item and may use `REVIEW` if the sentence is carrying necessary answer context.

If absent, record the searched phrase and continue. The item may have been repaired between the learner report and this snapshot.

### 11.3 Historical controls, not expected live hits

The exercise-hypoglycemia and occupational-HIV-PEP defects are already recorded as repaired. Read them to understand the failure class, but do not expect the defective sentences to remain in live banks. Their absence is not a missed traversal.

Do not copy their prior dispositions onto superficially similar items.

## 12. Batch protocol

The queue is too large to adjudicate safely in one model context. Process it in deterministic batches of no more than 125 queue rows.

For each batch:

1. Read the complete queue rows in order.
2. Re-open the live bank item when the extracted context is incomplete or suspicious.
3. Write a batch result file under `batches/` containing one result per input row in the same order.
4. Reconcile input and output queue indices before moving to the next batch.
5. Keep a running count by verdict and class.
6. Do not revise an earlier batch merely to make later category totals look cleaner.

After all batches:

- concatenate results in queue order into `adjudication.jsonl`;
- verify every queue index appears exactly once;
- verify no unknown queue index appears;
- verify identity fields match the queue;
- validate every enum;
- verify all `FLAG`/`REVIEW` rows include evidence and a nonempty reason;
- rerun the queue builder and prove `queue.jsonl` is byte-identical;
- re-hash banks and prove the corpus snapshot did not change.

If model context or tool limits prevent complete review, stop honestly with `PARTIAL_CONTEXT_LIMIT`, retain completed batches, list the exact unreviewed queue range, and do not label the report complete.

## 13. Precision rules

### 13.1 Do not flag ordinary response instructions

Examples that normally pass:

- `Select the 2 priority actions.`
- `Place the actions in order.`
- `Highlight the findings that require immediate follow-up.`
- `Calculate the dose and round to the nearest tenth.`
- `Complete the bowtie by selecting one condition, two actions, and two parameters.`

These are legitimate learner-response demands unless they duplicate another rendered field or contain raw template syntax.

### 13.2 Do not remove needed closed-world facts

A terminal sentence may appropriately state:

- a provider order;
- an explicit facility protocol;
- a calculation formula;
- a threshold;
- a timing rule;
- a client preference or refusal;
- a source result;
- the response format or rounding rule.

If that fact is needed to make the answer determinate, it is not a leak merely because it appears last.

### 13.3 Distinguish clinical teaching from source defense

`RSBI should not be used as the sole readiness criterion` can be legitimate rationale teaching. Appended after a complete calculation demand as `This item asks only for...` it becomes commentary on the construct. Judge speech act and placement, not just factual truth.

### 13.4 Distinguish clinical no-delay rules from adjudication notes

`Do not delay indicated PEP` may be clinically correct. It becomes suspicious when appended after an ordering demand to explain why parallel processes were serialized or to reveal the intended ordering. Inspect options and key before deciding.

### 13.5 Treat deletion risk honestly

A sentence may be defective but load-bearing because the rest of the item is under-specified. In that case:

- `verdict`: `FLAG` or `REVIEW`;
- `removalRisk`: `POSSIBLE_AMBIGUITY` or `HIGH_REWRITE_REQUIRED`;
- `nextStep`: `FULL_ITEM_REVIEW`;
- do not call it a deletion-only fix.

## 14. `report.md` contract

Title:

```text
Terminal-Sentence Semantic Census — Gemini Review Report
```

Required sections:

### 14.1 Status

Use exactly one:

- `COMPLETE`;
- `COMPLETE_WITH_KNOWN_EXAMPLE_DRIFT`;
- `BLOCKED_PARSE_FAILURE`;
- `BLOCKED_COUNT_RECONCILIATION`;
- `BLOCKED_CONCURRENT_BANK_CHANGE`;
- `PARTIAL_CONTEXT_LIMIT`.

### 14.2 Audit session header

Record:

- exact Gemini model and harness;
- date;
- branch and HEAD;
- starting and ending changed paths;
- bundled bank hashes;
- queue batch size;
- number of batch files;
- confirmation that no unauthorized file was changed.

### 14.3 Corpus reconciliation

Report:

- bundled banks parsed;
- top-level session units;
- top-level scored leaves;
- case containers;
- embedded scored leaves;
- total scored leaves;
- total queue rows;
- rows with at least two sentences;
- control-selected rows;
- rows reviewed;
- missing, duplicate, or extra adjudication rows.

Counts must reconcile to current live disk, not the historical 1,942/2,528 orientation figures.

### 14.4 Results

Provide counts by:

- verdict;
- primary class;
- secondary flag;
- bank;
- producer-prefix family where inferable from ID;
- item type;
- record kind;
- removal risk;
- bilingual relation;
- next step.

### 14.5 High-priority evidence queues

Group flagged rows into:

1. **Tier A — mechanical placement defects**
   - raw placeholders/schema syntax;
   - exact duplication of `clozeStem` or another response surface.
2. **Tier B — likely bounded semantic deletions**
   - authorial constraints, construct defenses, or redundant disclaimers with `LOW` removal risk.
3. **Tier C — possible item-design compensation**
   - answer telegraphing, adjudication notes, ambiguous ordering, or `HIGH_REWRITE_REQUIRED`.
4. **Tier D — owner review**
   - all `REVIEW` rows and bilingual uncertainty.

For every listed item include bank path, stable identities, exact JSON path, exact terminal sentence, class, removal risk, and concise reason.

### 14.6 Terminal-position hypothesis

Report:

- terminal `FLAG` + `REVIEW` count and rate;
- nonterminal control `FLAG` + `REVIEW` count and rate;
- descriptive enrichment ratio when the control denominator and numerator permit it;
- counts by defect class in terminal versus control sentences;
- a cautious interpretation.

Do not claim statistical significance or causal proof.

### 14.7 Known-example reconciliation

State the live result for:

- `gap_50_mc_03`;
- the RSBI phrase locator;
- absence/presence of the already repaired insulin and PEP defective strings in bundled banks.

### 14.8 Method limitations

State at minimum:

- terminal-sentence segmentation can be imperfect around abbreviations and numeric notation;
- the review is semantic and model-dependent;
- only stems are exhaustively terminal-reviewed in this commission;
- the control sample is descriptive and covers penultimate sentences only;
- no external clinical currency verification was performed;
- Gemini provenance may overlap some canonical items;
- a `PASS` is not an independent full content review of the question.

### 14.9 Handoff

End with a compact handoff for the next architect/Codex task:

- exact flagged item count;
- exact deletion-candidate count;
- exact full-item-review count;
- exact renderer/schema-placement-check count;
- exact bilingual-review count;
- path to `adjudication.jsonl`;
- explicit statement that no bank mutation was performed.

Do not write a remediation spec, patch list, or governance change from the Gemini seat.

## 15. Acceptance gates

The task may be marked `COMPLETE` only when all are true:

- [ ] Every current bundled `banks/*.json` file was parsed from one stable snapshot.
- [ ] Every top-level standalone scored leaf has exactly one queue row.
- [ ] Every embedded scored leaf has exactly one queue row.
- [ ] Every top-level case container has exactly one separate queue row.
- [ ] Every queue row has exactly one adjudication row.
- [ ] Queue/adjudication identity and order reconcile exactly.
- [ ] Every terminal English sentence was semantically read in full item context.
- [ ] Every paired Chinese terminal sentence was compared for meaning and defect parity.
- [ ] Every selected penultimate control sentence was classified.
- [ ] `gap_50_mc_03` was located and adjudicated, or known-example drift was explicitly reported.
- [ ] The RSBI locator was searched and its live status recorded.
- [ ] All `FLAG` and `REVIEW` rows contain exact evidence, reason, removal risk, and next step.
- [ ] No sentence was flagged merely for awkward style or for containing broad clinical words.
- [ ] `queue.jsonl` is deterministic and byte-identical on rerun.
- [ ] Bank hashes are unchanged at task end.
- [ ] Only the authorized audit directory was written.
- [ ] No commit or push occurred.

## 16. Stop conditions

Stop and report the applicable status when:

- `BLOCKED_PARSE_FAILURE` — any bundled bank cannot be parsed/validated sufficiently for complete traversal;
- `BLOCKED_COUNT_RECONCILIATION` — question-population totals or queue/adjudication identities do not reconcile;
- `BLOCKED_CONCURRENT_BANK_CHANGE` — any bundled bank hash changes during the task;
- `PARTIAL_CONTEXT_LIMIT` — Gemini cannot complete all batches without losing reliable context;
- `KNOWN_EXAMPLE_NOT_FOUND_OR_CHANGED` — report as a substatus for `gap_50_mc_03`; do not invent evidence;
- `BLOCKED_OUTPUT_CONTAMINATION` — Gemini changed anything outside the authorized audit directory.

Do not force a green result by omitting difficult records, collapsing `REVIEW` into `PASS`, or narrowing the queue after seeing the findings.

## 17. Final response

After writing and validating the artifacts, return only:

1. the four principal output paths;
2. the final status;
3. one concise paragraph with corpus counts and counts of `FLAG`, `REVIEW`, deletion candidates, and full-item-review candidates;
4. confirmation that no bank or project file outside the audit directory was changed.

Do not begin remediation.
