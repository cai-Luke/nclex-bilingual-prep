# Terminal-Sentence Census — Independent Checker Salvage Commission

Date: 2026-07-22  
Owner: Project Shrimp architect seat  
Status: ready after candidate qualification  
Mode: nonconformant Sonnet evidence → expanded independent re-review → salvage or rejection

## 1. Purpose

Commission the full independent checker after a candidate model has completed the blind pilot and the owner has approved that model for this seat.

The checker must determine whether the completed Sonnet terminal-sentence review can be salvaged as useful evidence, and must produce the independently accepted finding set needed for later architect adjudication.

This commission does not assume that Sonnet's completed delivery is an accepted semantic census. It does not edit banks and does not write the final Codex remediation work order.

The checker owns:

1. mechanical characterization of the delivered evidence;
2. direct semantic re-review of the mandatory population;
3. an expanded deterministic PASS sample;
4. targeted expansion for known missed semantic families;
5. independent disposition of proposed findings;
6. a final recommendation to salvage or reject the census evidence;
7. a remediation-ready confirmed-finding set for the architect seat.

The architect, not the checker, converts accepted findings into exact bank operations.

## 2. Relationship to the 2026-07-21 post-review spec

Read and apply:

```text
TERMINAL-SENTENCE-POST-REVIEW-ADJUDICATION-SPEC-2026-07-21.md
```

This document is the successor addendum for the actual completed Sonnet delivery. It overrides the older spec where they conflict.

The following older assumptions are superseded:

- exact structural reconciliation is no longer expected to be green;
- a schema violation does not end all semantic analysis because the malformed tail remains directly reviewable from the queue and live banks;
- the known failed calibration gate prevents acceptance of the Sonnet census as-is, but permits checker-led salvage after complete family expansion;
- the PASS sample is increased from approximately 5% to approximately 10% for the otherwise unchecked pre-tail population;
- the checker does not write a Codex work order in this commission.

All constitutional, producer-routing, removal-safety, and no-bank-mutation requirements from the older spec remain in force.

## 3. Known starting conditions

Treat these as owner-provided facts to verify mechanically rather than questions to rediscover by trusting delivery prose:

1. The Sonnet directory nominally contains 42 batch files covering queue indices 1 through 2,673.
2. Sonnet reported no `REVIEW` rows.
3. Sonnet's `delivery.md` states that per-batch Python builder files were used to assemble semantic JSONL. The original work order prohibited scripts that package semantic dispositions.
4. The same delivery also states that no semantic generator/classifier script was written or executed. Record this internal inconsistency; do not resolve it by assumption.
5. Queue indices 2,369 through 2,673 use a plain string for `quotedEvidence` rather than the required array of evidence objects.
6. Queue index 1,731, `gpt_case_clozapine_toxicity_01_q5`, was passed even though it is a forcing row for learner-facing item-design compensation.
7. Queue index 2,413 contains a test-facing parenthetical about SIRS being “still tested on the NCLEX-RN” and requires independent review rather than inherited acceptance.

These conditions mean:

- the Sonnet delivery is nonconformant review evidence;
- the Sonnet completion claim cannot become the final null hypothesis;
- malformed evidence must never be silently normalized;
- semantic judgments may still be retained individually if they survive independent review and sampling;
- a final outcome may be `CHECKER_SALVAGE_SUPPORTED`, but never “Sonnet census passed unchanged.”

## 4. Candidate eligibility and independence

A newly evaluated model must have an owner-approved blind-pilot result before receiving this commission. The established standard workhorse may receive the commission under an explicit owner waiver when no experimental candidate qualifies; record the waiver rather than inventing a pilot result.

Record:

- exact model, provider, harness, and visible version;
- blind-pilot directory and owner disposition, or the exact owner waiver for the established standard workhorse;
- whether the checker is Claude-family;
- whether it may be producer-conflicted for any bank content.

The exact Sonnet model/harness that produced the original batches is ineligible for this checker seat.

A Claude-family model may perform the full review only if the owner explicitly accepts it as independent from the Sonnet run. It still cannot independently clear mutation-bearing content with possible or confirmed Claude producer provenance. Such rows must remain producer-conflicted until reviewed by a non-Claude checker.

Do not infer producer identity solely from a bank filename. Apply live provenance records and the current ruling in `DECISIONS.md`.

## 5. Read order

Read current disk in this order:

1. `AGENTS.md`
2. `docs/AGENTS-RUNBOOK.md`
3. `DECISIONS.md`, especially principles 2, 3, 5, 7, 15, 21, 26, and 28
4. `PROJECT-HISTORY.md`
5. `NCLEX-Question-Schema.md`
6. `src/types.ts`
7. `src/schema.ts`
8. relevant rendering paths in `src/App.tsx`
9. `BANK-REVIEW-LEDGER.md`
10. `TERMINAL-SENTENCE-POST-REVIEW-ADJUDICATION-SPEC-2026-07-21.md`
11. this successor spec
12. `audit/terminal-sentence-semantic-census-2026-07-21/queue.jsonl`
13. Sonnet batch files, ledger, and delivery
14. current live bank items as each row is reviewed

The rejected Gemini audit, Gemini pilot, prior partial adjudication, mechanical prefilter verdict suggestions, candidate-pilot owner key, and other candidate outputs are not semantic authority. Do not inspect them until the checker adjudication is frozen, unless the owner explicitly requests a post-freeze comparison appendix.

Do not browse the web. Route any clinical-currency question to owner adjudication rather than researching it inside this sentence-function audit.

## 6. Output boundary

Choose a filesystem-safe model slug and create exactly one model-owned directory:

```text
audit/terminal-sentence-independent-checker-2026-07-22/<model-slug>/
```

Authorized outputs:

```text
mechanical-reconciliation.json
checker-population.jsonl
sample-manifest.jsonl
checker-adjudication.jsonl
confirmed-findings.jsonl
deferred-and-dismissed.jsonl
final-report.md
delivery.md
```

The checker may also write one task-local deterministic validator or sampler beneath its directory:

```text
mechanical-reconcile-and-sample.ts
```

That script may inspect structure, identities, enums, hashes, signals, and sample membership. It may not create, copy, assign, default, transform, package, or modify any semantic verdict, class, reason, evidence quote, removal risk, next step, checker disposition, repair eligibility, or final finding.

Everything outside the model-owned directory is read-only.

No bank, runtime, schema, prompt, governance, history, ledger, queue, Sonnet batch, or prior audit file may be changed. No commit or push is authorized.

## 7. Phase A — mechanical characterization

Mechanically verify:

- branch and HEAD;
- starting changed paths;
- queue count and identities;
- discovered Sonnet batch count and numeric order;
- delivered row count and queue-index coverage;
- missing, duplicate, extra, or out-of-order rows;
- exact identity and terminal-string equality with the queue;
- enum membership;
- required reason presence;
- required control-field presence;
- `quotedEvidence` shape by row and batch;
- batch-ledger ranges;
- delivery claims compared with disk state;
- current bundled-bank hashes compared with the queue snapshot.

Write `mechanical-reconciliation.json` with machine-readable counts and exact affected indices.

Allowed `mechanicalStatus` values:

- `CONFORMANT`
- `NONCONFORMANT_BUT_ANALYZABLE`
- `BLOCKED_INCOMPLETE_OR_IDENTITY_MISMATCH`
- `BLOCKED_CONCURRENT_BANK_CHANGE`
- `BLOCKED_OUTPUT_CONTAMINATION`

The known evidence-shape violation and disclosed packaging method should normally produce `NONCONFORMANT_BUT_ANALYZABLE`, provided identities and live-bank snapshot remain stable.

Do not write a “reconciled” Sonnet JSONL that silently converts string evidence to arrays, supplies locations, or otherwise repairs the original artifacts. Preserve the original files as evidence.

Stop only when identity, snapshot, or output contamination prevents reliable direct review. Structural nonconformance alone does not excuse skipping the semantic population required below.

## 8. Mandatory checker population

The independent checker population is the deduplicated union of all rows in these groups.

### 8.1 Prior proposed findings

- every Sonnet `FLAG`;
- every Sonnet `REVIEW`;
- every selected control sentence Sonnet marked `FLAG` or `REVIEW`;
- every row whose Sonnet `nextStep` is not `NONE`.

### 8.2 Known nonconformant tail

- every queue index from 2,369 through 2,673 inclusive.

All 305 tail rows receive fresh checker-authored evidence arrays and direct semantic reasons. They are not accepted by reconstructing Sonnet's missing evidence location.

### 8.3 Calibration and forcing rows

Re-review every calibration/forcing row named in the 2026-07-21 Sonnet work order, regardless of Sonnet verdict.

At minimum include:

- the duplicated dropdown-cloze example;
- fill-in-blank raw-placeholder examples;
- the bilingual rounding nondefect;
- the clozapine ordered-response compensation row at queue index 1,731;
- RSBI and the related self-referential calculation disclaimers.

### 8.4 Deterministic placement signals

Include every queue row where any of these apply:

- `mechanicalSignals.rawPlaceholderInStem` is true;
- `mechanicalSignals.terminalContainsRawPlaceholder` is true;
- the terminal sentence is exactly or materially duplicated in another learner-rendered response field;
- a fill-in-blank ordinary stem contains brace placeholders;
- a dropdown-cloze ordinary stem contains a response sentence also represented by `clozeStem`.

### 8.5 Known missed semantic-family expansion

The failed calibration row requires a complete targeted expansion over likely item-design compensation and construct-defense surfaces.

Mechanically select, but do not mechanically classify, every terminal sentence whose English or Chinese contains a case-insensitive match for any of:

```text
this item
this question
本题
near-miss
near miss
excluded from this item
asks only
tests arithmetic only
still tested on the NCLEX
still tested on NCLEX
not a universal
not required to determine
options focus on
options are limited to
```

Also include any semantically equivalent row discovered during direct review, even when it does not match these strings.

These phrases are population selectors only. Some selected sentences may be legitimate direct clinical or response guidance and must be retained when appropriate.

### 8.6 Producer-conflict population

Include every mutation-bearing proposed finding with possible or confirmed Claude producer provenance.

If the current checker is conflicted, adjudicate the semantic issue but mark the row unresolved for independent clearance.

### 8.7 Expanded deterministic PASS sample

Apply §9 to all otherwise unchecked Sonnet PASS rows with queue indices 1 through 2,368.

Write the final deduplicated population in queue order to `checker-population.jsonl`, including every selection reason that applies. Population membership may be generated mechanically; semantic fields may not.

## 9. Expanded deterministic PASS sample

For every Sonnet PASS row at queue index 1 through 2,368 that is not already in the mandatory population, calculate SHA-256 over:

```text
terminal-independent-checker-2026-07-22|<bankPath>|<topLevelQuestionId>|<embeddedQuestionId-or-empty>|<recordKind>
```

Select the row when the first unsigned byte modulo 10 equals `0`.

This yields approximately 10% of the otherwise unchecked pre-tail PASS population.

Also force into the sample:

- at least ten rows from every represented item type, selected by lowest hash when the general sample supplies fewer than ten;
- at least ten top-level case-container PASS rows;
- at least twenty embedded-leaf PASS rows;
- at least ten rows from every bundled bank represented in the otherwise unchecked PASS population when available;
- every `claude_*`-prefixed otherwise unchecked PASS row whose first unsigned hash byte modulo 5 equals `0`.

Write `sample-manifest.jsonl` with:

- queue identity;
- hash;
- every selection reason;
- Sonnet verdict/class;
- producer-conflict status known before semantic review.

Sampling must be byte-stable on rerun. Do not alter the seed, modulus, fallback counts, population, or ordering in response to observed results.

## 10. Direct semantic review requirements

For every checker-population row:

- reopen the complete live item;
- inspect full EN/ZH stems, terminal and penultimate spans, response context, correct rationale, test-taking strategy, and selected control;
- inspect the parent case and applicable exhibits/stages for embedded leaves;
- inspect actual renderer code when placement, duplication, placeholders, segmentation, or case-container visibility matters;
- independently determine terminal function and removal safety;
- independently review the selected control rather than inheriting Sonnet's control judgment;
- quote exact evidence from live disk.

Do not use phrase matching as a verdict. Do not infer a desired FLAG count. Do not preserve a Sonnet verdict merely because its reason is detailed.

Use the decision sequence and closed vocabulary in the 2026-07-21 Sonnet work order, with these clarifications:

- a case-container clinical-topic sentence is not automatically an authorial leak;
- direct clinical cautions about what a measurement can establish may be legitimate even when restrictive;
- explicit references to “this item,” exam testing, distractor construction, or option-set design are presumptively author-facing but still require removal-safety analysis;
- a sentence admitting that an appropriate concurrent action was omitted to create a serial sequence is item-design compensation, not ordinary format guidance;
- a bilingual sentence-count difference is not a defect when the complete live stems remain parallel;
- raw placeholders in ordinary fill-in-blank stems render literally;
- ordinary dropdown-cloze stem and `clozeStem` are distinct learner surfaces.

## 11. `checker-adjudication.jsonl` contract

Write one compact JSON row for every checker-population row, in queue order.

Required shape:

```json
{
  "queueIndex": 1731,
  "bankPath": "banks/gpt-canonical.json",
  "topLevelQuestionId": "gpt_case_clozapine_toxicity_01",
  "embeddedQuestionId": "gpt_case_clozapine_toxicity_01_q5",
  "recordKind": "EMBEDDED_SCORED_LEAF",
  "itemType": "ordered_response",
  "selectionReasons": ["CALIBRATION_GATE", "KNOWN_MISSED_FAMILY_EXPANSION"],
  "sonnetVerdict": "PASS",
  "sonnetPrimaryClass": "LEGITIMATE_RESPONSE_DEMAND",
  "checkerDisposition": "MODIFY",
  "finalVerdict": "FLAG",
  "finalPrimaryClass": "ITEM_DESIGN_COMPENSATION",
  "finalSecondaryFlags": ["CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE"],
  "finalSpeechActTarget": "AUTHOR_OR_COMPILER",
  "finalNeededForAnswer": "PARTLY",
  "finalRemovalRisk": "POSSIBLE_AMBIGUITY",
  "finalBilingualRelation": "PARALLEL_DEFECT",
  "finalNextStep": "FULL_ITEM_REVIEW",
  "quotedEvidence": [
    {"location": "stem.en", "quote": "Exact terminal evidence."},
    {"location": "options/key or local context", "quote": "Exact context evidence."}
  ],
  "checkerReason": "Item-specific independent reasoning.",
  "producerConflict": "NONE_KNOWN",
  "repairEligibility": "FULL_ITEM_REVIEW_ONLY",
  "controlDisposition": null,
  "controlPrimaryClass": null,
  "controlQuotedEvidence": null,
  "controlReason": null
}
```

Allowed `checkerDisposition`:

- `ACCEPT`
- `MODIFY`
- `DISMISS`
- `ESCALATE`

Allowed `producerConflict`:

- `NONE_KNOWN`
- `POSSIBLE_CLAUDE_PROVENANCE`
- `CONFIRMED_CHECKER_CONFLICT`
- `UNRESOLVED`

Allowed `repairEligibility`:

- `NO_CHANGE`
- `EXACT_MECHANICAL_REPAIR`
- `BOUNDED_SEMANTIC_REPAIR`
- `FULL_ITEM_REVIEW_ONLY`
- `BILINGUAL_REVIEW_ONLY`
- `RENDERER_OR_SCHEMA_INVESTIGATION`
- `OWNER_DECISION_REQUIRED`

Final verdicts, classes, speech-act targets, needed-for-answer values, removal risks, bilingual relations, and next steps use the closed vocabulary from the Sonnet work order.

Requirements:

- `quotedEvidence` and `controlQuotedEvidence` are arrays of `{location, quote}` objects, never strings;
- every row receives fresh checker-authored evidence and reason;
- malformed Sonnet evidence is described, not normalized into a claimed Sonnet field;
- `ACCEPT` means the checker independently reached the same semantic outcome, not that it trusted the prior row;
- `MODIFY` states exactly which part changed;
- `DISMISS` quotes the context proving legitimacy or segmentation artifact;
- `ESCALATE` identifies the missing product, clinical, renderer, provenance, bilingual, or owner decision;
- mutation-bearing Claude-conflicted findings cannot receive independently cleared repair eligibility from a conflicted checker;
- no replacement bank prose is authored in this file.

## 12. Confirmed and dismissed outputs

### 12.1 `confirmed-findings.jsonl`

Include every row whose final verdict is `FLAG` or `REVIEW`, plus any PASS row that exposes a mechanical audit-contract defect requiring renderer/schema investigation.

Required fields:

- exact queue identity;
- final semantic fields;
- checker disposition;
- exact evidence;
- repair eligibility;
- producer conflict;
- concise owner-facing issue statement;
- whether the finding was proposed by Sonnet or discovered as a false negative;
- family tag for targeted expansion and remediation grouping.

This is a finding set, not a patch manifest. Do not supply exact replacement prose or authorize canonical mutation.

### 12.2 `deferred-and-dismissed.jsonl`

Include:

- every reviewed Sonnet FLAG/REVIEW that the checker dismisses;
- every REVIEW or ESCALATE row awaiting owner decision;
- every producer-conflicted mutation-bearing row;
- every sampled or targeted PASS row whose apparent signal was legitimate or a segmentation artifact when that explanation is useful for future adjudication.

Preserve visibility of disagreements. Do not erase a Sonnet finding because the checker dismissed it.

## 13. False-negative and salvage rules

Classify every reviewed Sonnet PASS row as:

- `CONFIRMED_PASS`
- `MISSED_FLAG`
- `MISSED_REVIEW`
- `SEGMENTATION_ARTIFACT`
- `UNRESOLVED`

Calculate:

```text
observed false-negative rate = (MISSED_FLAG + MISSED_REVIEW) / reviewed Sonnet PASS rows
```

Report both:

- overall reviewed-PASS miss rate;
- deterministic-sample-only miss rate, excluding forced calibration, known-family expansion, and tail rows.

### 13.1 Required expansion

- Any raw-placeholder false negative triggers a complete deterministic recheck of the same item-type/rendering relation.
- Two or more substantively similar misses trigger complete targeted expansion for that semantic family.
- The known queue-1,731 miss requires the full item-design-compensation/construct-defense expansion in §8.5 even if no second miss appears.
- A new bilingual false-negative family triggers targeted review of mechanically similar bilingual terminal patterns.

### 13.2 Salvage-support threshold

`CHECKER_SALVAGE_SUPPORTED` is permitted only when all are true:

1. mechanical status is `NONCONFORMANT_BUT_ANALYZABLE` or better;
2. every Sonnet FLAG/REVIEW is directly checked;
3. every calibration/forcing row is directly checked;
4. every placement-signal row is directly checked;
5. every row 2,369–2,673 is directly checked;
6. required semantic-family expansion is complete;
7. the expanded deterministic PASS sample is complete;
8. deterministic-sample-only false-negative rate is at most 2%;
9. no missed calibration gate remains unrecognized by the checker;
10. every confirmed mutation-bearing finding is either independently cleared or visibly producer-conflicted;
11. checker output is structurally conformant and direct-review provenance is intact.

This status means the evidence can support architect remediation planning after checker reconstruction. It does not retroactively make the Sonnet output conformant.

### 13.3 Rejection threshold

Use `CHECKER_REJECT_REQUIRE_NEW_CENSUS` when any of these apply:

- deterministic-sample-only false-negative rate exceeds 2%;
- missed defects span multiple unrelated semantic families without complete expansion;
- the checker misses a forcing gate or cannot distinguish basic renderer-placement behavior;
- identities or concurrent bank changes prevent reliable review;
- semantic output was generated or packaged by prohibited code;
- producer conflicts prevent an independently cleared mutation-bearing set;
- the required 305-row tail review cannot be completed;
- the checker cannot support an exhaustive-enough claim even after expansion.

Do not lower the sample, redefine a defect, exclude difficult rows, or convert uncertain misses to PASS to obtain salvage status.

## 14. `final-report.md`

Write an owner-facing report with these sections.

### 14.1 Final status

Use exactly one:

- `CHECKER_SALVAGE_SUPPORTED`
- `CHECKER_REJECT_REQUIRE_NEW_CENSUS`
- `CHECKER_PARTIAL_CONTEXT_LIMIT`
- `CHECKER_BLOCKED_CONCURRENT_BANK_CHANGE`
- `CHECKER_BLOCKED_OUTPUT_CONTAMINATION`
- `CHECKER_BLOCKED_PRODUCER_CONFLICT`

### 14.2 Mechanical evidence

Report:

- branch, HEAD, starting/ending changed paths;
- queue, batch, and delivered counts;
- missing/duplicate/extra identities;
- evidence-shape violation count and exact index range;
- delivery-method inconsistency;
- bank-hash stability;
- why semantic analysis did or did not continue.

### 14.3 Checker population

Report counts by every selection reason, deduplicated total, and completed total.

### 14.4 Sonnet versus checker

Report counts by:

- Sonnet verdict/class;
- checker disposition;
- final verdict/class;
- bank;
- item type;
- record kind;
- removal risk;
- next step;
- producer conflict;
- repair eligibility;
- false-negative family.

### 14.5 Calibration and known-condition reconciliation

State the independent disposition for:

- duplicated dropdown-cloze surfaces;
- fill-in-blank raw placeholders;
- bilingual sentence-boundary control;
- queue index 1,731;
- queue index 2,413;
- RSBI and related calculation disclaimers;
- the malformed 2,369–2,673 evidence range.

### 14.6 False-negative assessment

Report:

- deterministic sample size;
- forced/expanded PASS-review count;
- confirmed passes;
- missed flags/reviews;
- segmentation artifacts;
- unresolved rows;
- overall reviewed-PASS miss rate;
- deterministic-sample-only miss rate;
- every expansion performed;
- whether salvage criteria were met.

### 14.7 Accepted queues

List exact identities and counts for:

- exact mechanical repairs;
- bounded semantic repairs;
- full-item review;
- bilingual review;
- renderer/schema investigation;
- owner decision;
- dismissed or retained rows.

### 14.8 Handoff

End with:

- exact paths to all outputs;
- exact confirmed-finding count;
- exact false-negative count;
- exact producer-conflict count;
- explicit statement that no bank mutation occurred;
- explicit statement that the architect must independently authorize any remediation work order.

## 15. `delivery.md`

Record:

- exact model/provider/harness/version;
- pilot qualification path;
- model slug and output directory;
- branch and HEAD;
- starting and ending changed paths;
- mechanical status;
- mandatory checker population count;
- completed checker row count;
- first unreviewed queue index or `none`;
- exact output paths;
- final status;
- whether any prohibited semantic generator, classifier, packaging script, verdict map, or bulk default was written or executed;
- whether any file outside the model-owned directory changed;
- whether any commit or push occurred.

## 16. Stop conditions

Stop and report honestly when:

- queue/live-bank identity or hash drift prevents stable adjudication;
- another task changes a relevant bank;
- direct review cannot continue within context/tool limits;
- the task would require semantic packaging code;
- a producer-conflicted mutation-bearing set cannot be independently cleared;
- the task writes outside its directory;
- the checker cannot complete required expansion or the 305-row tail review.

Partial completion is evidence, not acceptance. Do not manufacture a green report.

## 17. Exit checklist

- [ ] pilot qualification and exact model identity recorded
- [ ] Sonnet delivery mechanically characterized without normalization
- [ ] packaging-method inconsistency recorded
- [ ] malformed evidence range recorded
- [ ] every Sonnet FLAG/REVIEW directly checked
- [ ] every forcing row directly checked
- [ ] every placement-signal row directly checked
- [ ] all 305 tail rows directly checked
- [ ] known missed-family expansion complete
- [ ] expanded deterministic sample complete
- [ ] false-negative rates calculated correctly
- [ ] producer conflicts routed correctly
- [ ] checker rows contain evidence arrays, not strings
- [ ] confirmed findings separated from dismissed/deferred rows
- [ ] salvage or rejection threshold applied without relaxation
- [ ] no bank mutation occurred
- [ ] no commit or push occurred

## 18. Final response

Respond with:

1. final status;
2. model-owned output directory;
3. paths to `final-report.md`, `checker-adjudication.jsonl`, `confirmed-findings.jsonl`, and `deferred-and-dismissed.jsonl`;
4. checker population and completed counts;
5. deterministic-sample-only false-negative count and rate;
6. confirmed-finding and producer-conflict counts;
7. confirmation that no bank mutation, commit, or push occurred.

Do not begin remediation implementation.