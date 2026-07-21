# Terminal-Sentence Census — Post-Review Adjudication and Remediation Planning

Date: 2026-07-21
Owner: architect/checker seat, followed by Codex implementation seat
Status: ready after Sonnet batch delivery
Mode: mechanical reconciliation → independent semantic check → owner disposition → exact Codex work order

## 1. Purpose

Define what happens after Claude Sonnet delivers the terminal-sentence semantic batches.

Sonnet’s output is **untrusted review evidence**, not an accepted census and not a mutation manifest. This phase must:

1. prove that every queue row received one structurally valid Sonnet disposition;
2. independently re-derive every proposed defect and every mutation-bearing recommendation;
3. measure Sonnet’s false-negative rate through a deterministic PASS sample and forcing gates;
4. reconcile producer/checker conflicts;
5. produce the accepted final census report;
6. divide accepted findings into safe bounded repairs, full-item rewrites, bilingual review, renderer/schema investigation, and dismissals;
7. derive an exact Codex remediation work order without changing canonical banks from the architect/checker seat.

No Sonnet `FLAG`, `REVIEW`, deletion candidate, or class label automatically becomes a bank edit.

## 2. Preconditions

This phase may start only when one of these Sonnet delivery states exists:

- `SONNET_BATCH_DELIVERY_COMPLETE`; or
- `SONNET_PARTIAL_CONTEXT_LIMIT` with an owner decision to adjudicate only the delivered prefix.

Primary inputs:

```text
SONNET-TERMINAL-SENTENCE-SEMANTIC-CENSUS-SPEC-2026-07-21.md
audit/terminal-sentence-semantic-census-2026-07-21/queue.jsonl
audit/terminal-sentence-sonnet-review-2026-07-21/batches/*.jsonl
audit/terminal-sentence-sonnet-review-2026-07-21/batch-ledger.md
audit/terminal-sentence-sonnet-review-2026-07-21/delivery.md
```

Current live bank files, schema, runtime, governance, and provenance records remain authoritative.

The rejected Gemini audit, Gemini pilot, mechanical prefilter, and prior partial adjudication are not semantic authority. They may be inspected only after the independent checker dispositions are frozen, and only as historical comparison.

## 3. Role split

### 3.1 Mechanical reconciliation seat

May use deterministic scripts to:

- concatenate batch files in queue order;
- validate JSONL syntax and closed enums;
- compare identities and exact terminal strings against the queue;
- detect missing, duplicate, extra, or out-of-order rows;
- calculate deterministic samples and aggregate counts;
- verify bank hashes and changed paths.

Mechanical code may never assign or modify a semantic verdict, class, reason, evidence quote, removal risk, next step, or repair action.

### 3.2 Independent semantic checker

Must re-open live items and independently judge:

- every Sonnet `FLAG`;
- every Sonnet `REVIEW`;
- every control sentence Sonnet marked `FLAG` or `REVIEW`;
- every calibration/forcing row regardless of Sonnet verdict;
- every row mechanically signaled as a raw placeholder or duplicated response surface regardless of Sonnet verdict;
- the deterministic PASS sample in §8;
- every mutation-bearing row with possible producer conflict.

The checker does not edit banks.

### 3.3 Owner/architect adjudication

Resolves checker disagreements and determines which accepted findings become:

- exact bounded deletion or placement repairs;
- rationale relocation;
- full-item review/rewrite;
- bilingual repair;
- renderer/schema investigation;
- no change.

The architect writes the exact Codex work order. The architect does not certify the eventual implementation.

### 3.4 Codex implementation seat

Receives only owner-approved, exact operations. Codex applies declarative repairs, runs the full verification floor, writes the ledger/report changes, and stops for independent content review.

Codex does not independently promote Sonnet findings into edits.

## 4. Constitutional boundaries

Read and apply:

1. `AGENTS.md`;
2. `docs/AGENTS-RUNBOOK.md`;
3. `DECISIONS.md`:
   - principle 2: independent review for semantic judgments and dispositions;
   - principle 3: deterministic mechanics versus semantic residual;
   - principle 5: generated is not reviewed;
   - principle 7: precision over volume;
   - principle 15: canonical corrections are declarative and precondition-checked;
   - principle 21: construction language stays off learner surfaces;
   - principle 26: a disposition that removes checked material needs an independently enforced precondition;
   - principle 28: scored leaves and case containers remain distinct.
4. `PROJECT-HISTORY.md` for current lane status;
5. `NCLEX-Question-Schema.md`, `src/types.ts`, `src/schema.ts`, and the actual rendering paths in `src/App.tsx`;
6. `BANK-REVIEW-LEDGER.md` for provenance and content status.

A green schema validator proves structure, not semantic safety. A model’s confidence or item-specific prose proves neither independence nor correctness.

## 5. Output boundary

Create exactly one adjudication directory:

```text
audit/terminal-sentence-post-review-2026-07-21/
```

Expected artifacts:

```text
reconcile-sonnet-batches.ts
reconciled-sonnet-adjudication.jsonl
reconciliation-report.md
checker-adjudication.jsonl
pass-sample.jsonl
final-census-report.md
remediation-manifest.jsonl
deferred-and-dismissed.jsonl
codex-remediation-work-order.md
```

The architect/checker phase may write only beneath this directory. It must not modify:

- `banks/*.json`;
- source/runtime/schema;
- prompts or governance;
- `PROJECT-HISTORY.md`;
- `BANK-REVIEW-LEDGER.md`;
- Sonnet batch files;
- the rejected Gemini audit.

No commit or push is authorized.

The generated Codex work order remains a proposal until Luke approves routing it to Codex.

## 6. Phase A — mechanical reconciliation

Write `reconcile-sonnet-batches.ts` as a task-local mechanical validator.

It may:

1. read the authoritative queue;
2. discover Sonnet batch files by exact `batch-NNN.jsonl` naming;
3. order them numerically;
4. parse every row;
5. validate the closed vocabulary from the Sonnet spec;
6. require exact identity equality for:
   - `queueIndex`;
   - `bankPath`;
   - `topLevelQuestionId`;
   - `embeddedQuestionId`;
   - `recordKind`;
   - `itemType`;
   - `terminalSentenceEn`;
   - `terminalSentenceZh`;
7. require one nonempty item-specific reason per row;
8. require evidence for every `FLAG` and `REVIEW`;
9. require control dispositions for every selected control row;
10. detect missing, duplicate, extra, and out-of-order queue indices;
11. write byte-stable `reconciled-sonnet-adjudication.jsonl` only when reconciliation passes.

The script must not:

- derive verdicts from text or signals;
- fill missing fields;
- normalize unauthorized enum values;
- rewrite reasons;
- suppress a malformed row;
- reorder rows to hide a batch error without reporting it.

`reconciliation-report.md` must include:

- queue and delivered counts;
- batch count and ranges;
- exact missing/duplicate/extra indices;
- identity mismatches;
- invalid enums;
- evidence/reason/control omissions;
- Sonnet delivery claims compared with disk state;
- starting and ending changed paths;
- one status:
  - `RECONCILED`
  - `BLOCKED_INCOMPLETE_DELIVERY`
  - `BLOCKED_IDENTITY_MISMATCH`
  - `BLOCKED_SCHEMA_VIOLATION`
  - `BLOCKED_OUTPUT_CONTAMINATION`.

Do not begin aggregate semantic reporting unless reconciliation is `RECONCILED`, except for an owner-authorized delivered-prefix analysis that is explicitly labeled incomplete.

## 7. Phase B — mandatory checker population

The independent checker population is the union of:

1. every Sonnet `FLAG` row;
2. every Sonnet `REVIEW` row;
3. every row whose selected control received `FLAG` or `REVIEW`;
4. every calibration row named in the Sonnet spec;
5. every queue row where `mechanicalSignals.rawPlaceholderInStem` or `terminalContainsRawPlaceholder` is true;
6. every queue row where the terminal sentence is exactly or materially duplicated in another rendered response field;
7. every row whose proposed next step is not `NONE`;
8. every row selected into the deterministic PASS sample;
9. every mutation-bearing row with known or possible Claude producer provenance.

Deduplicate by queue index. No candidate may be excluded because another class already covers it.

The checker must read the full live item, not merely the Sonnet row. For embedded leaves, inspect the parent case and applicable stage/exhibit context.

## 8. Deterministic PASS sample

A PASS sample is required to estimate whether Sonnet silently missed a defect class.

For each Sonnet `PASS` row not already in the mandatory checker population, calculate SHA-256 over:

```text
terminal-post-review|<bankPath>|<topLevelQuestionId>|<embeddedQuestionId-or-empty>|<recordKind>
```

Select the row when the first unsigned byte modulo 20 equals `0`.

This yields approximately 5% of otherwise unchecked PASS rows.

Also force into the PASS sample:

- at least five rows from every item type represented among Sonnet PASS rows, selected by lowest hash when the 5% sample supplies fewer than five;
- at least five case-container PASS rows;
- at least ten embedded-leaf PASS rows;
- every `claude_*`-prefixed PASS row selected by first byte modulo 10 equals `0`, in addition to the general sample.

Write `pass-sample.jsonl` with exact identities, hash, selection reason, and Sonnet disposition. Sampling is deterministic and must be byte-identical on rerun.

A sampled false negative is not patched in isolation and ignored. It triggers the escalation rules in §12.

## 9. Checker adjudication contract

Write exactly one `checker-adjudication.jsonl` row for every mandatory checker row.

Required shape:

```json
{
  "queueIndex": 1731,
  "bankPath": "banks/gpt-canonical.json",
  "topLevelQuestionId": "gpt_case_clozapine_toxicity_01",
  "embeddedQuestionId": "gpt_case_clozapine_toxicity_01_q5",
  "sonnetVerdict": "FLAG",
  "sonnetPrimaryClass": "ITEM_DESIGN_COMPENSATION",
  "checkerDisposition": "MODIFY",
  "finalVerdict": "FLAG",
  "finalPrimaryClass": "ITEM_DESIGN_COMPENSATION",
  "finalSecondaryFlags": ["CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE"],
  "finalRemovalRisk": "POSSIBLE_AMBIGUITY",
  "finalNextStep": "FULL_ITEM_REVIEW",
  "quotedEvidence": [
    {"location": "stem.en", "quote": "..."},
    {"location": "options/key", "quote": "..."}
  ],
  "checkerReason": "The sentence admits a clinically appropriate concurrent action was excluded to fit an ordered sequence; deletion alone does not validate the sequence.",
  "producerConflict": "NONE_KNOWN",
  "repairEligibility": "FULL_ITEM_REVIEW_ONLY"
}
```

Allowed `checkerDisposition` values:

- `ACCEPT`
- `MODIFY`
- `DISMISS`
- `ESCALATE`

Allowed `producerConflict` values:

- `NONE_KNOWN`
- `POSSIBLE_CLAUDE_PROVENANCE`
- `CONFIRMED_CHECKER_CONFLICT`
- `UNRESOLVED`

Allowed `repairEligibility` values:

- `NO_CHANGE`
- `EXACT_MECHANICAL_REPAIR`
- `BOUNDED_SEMANTIC_REPAIR`
- `FULL_ITEM_REVIEW_ONLY`
- `BILINGUAL_REVIEW_ONLY`
- `RENDERER_OR_SCHEMA_INVESTIGATION`
- `OWNER_DECISION_REQUIRED`

`finalVerdict`, classes, removal risk, and next step use the Sonnet closed vocabulary.

For `DISMISS`, the checker must quote the local context establishing why the terminal sentence is legitimate or why the apparent signal is a segmentation artifact.

For `MODIFY`, explain exactly what Sonnet got wrong: class, removal safety, bilingual relation, evidence, or next step.

For `ESCALATE`, state what clinical, product, renderer, or owner decision is missing. Do not invent replacement content.

## 10. Producer/checker routing

Sonnet cannot independently clear judgment on content it may have produced.

At minimum:

- stable IDs beginning `claude_` require provenance inspection;
- containing bank filename alone does not establish producer identity;
- `opus*` content follows the current provenance ruling in `DECISIONS.md` rather than being assumed Claude-produced;
- ledger or promotion records override prefix guesses when they identify the actual producer/compiler.

Every mutation-bearing row with possible or confirmed Claude provenance must be adjudicated by a non-Claude semantic checker before entering `remediation-manifest.jsonl`.

If the current checker is Claude-conflicted, set `producerConflict` accordingly and `repairEligibility: OWNER_DECISION_REQUIRED`; do not treat the finding as independently cleared.

## 11. Final semantic classes and repair tiers

After checker review, group accepted rows into these tiers.

### Tier A — exact mechanical placement repairs

Examples:

- raw `{{...}}` in ordinary `dropdown_cloze.stem` while the response remains in `clozeStem`;
- raw `{{...}}` in a `fill_in_blank.stem` where the renderer displays it literally;
- exact duplicated response scaffolding with a surviving dedicated response field.

Eligibility requires:

- exact live identity and path;
- exact before text;
- proof of the actual renderer behavior;
- proof that the functional response surface remains after repair;
- no answer-key, choice, blank, or scoring change;
- EN/ZH pair handled consistently.

### Tier B — bounded semantic naturalization

Examples:

- a redundant authorial disclaimer after a complete response demand;
- a construct-defense sentence whose removal preserves every needed clinical fact;
- explanatory content that belongs in the rationale rather than the stem.

Eligibility requires independent semantic clearance and an exact before/after string for both languages. Do not replace a leaked disclaimer with a more polished disclaimer.

### Tier C — full-item review or rewrite

Examples:

- omitted concurrent actions exposed by an ordered-response disclaimer;
- a sentence that forces one answer because options or key are ambiguous;
- removal that makes the item under-specified;
- a terminal note compensating for an unsuitable item type.

These rows do not receive a canonical patch in the bounded repair pass. They require a separate item-specific commission with clinical/source review, answer-key re-derivation, and producer≠checker closure.

### Tier D — bilingual review

Use when one language materially adds, omits, or changes the requirement. A punctuation or sentence-count difference alone does not qualify.

### Tier E — renderer/schema investigation

Use when the defect depends on actual rendering or indicates a general placement contract problem. The investigation may propose validation hardening, but no schema/runtime change is authorized merely because one item is malformed.

### Tier F — dismissed or retained

Legitimate terminal content, segmentation artifacts, unsupported model flags, and owner-rejected changes remain unchanged and are recorded in `deferred-and-dismissed.jsonl`.

## 12. False-negative escalation

The PASS sample measures whether the Sonnet census can be accepted as exhaustive enough for remediation planning.

Classify each sampled PASS as:

- `CONFIRMED_PASS`
- `MISSED_FLAG`
- `MISSED_REVIEW`
- `SEGMENTATION_ERROR`
- `UNRESOLVED`

Escalation rules:

1. Any missed calibration gate blocks final census acceptance.
2. Any renderer-specific false negative involving raw placeholders triggers a full deterministic recheck of all rows with the same mechanical signal and item-type/rendering relation.
3. Two or more substantively similar missed defects trigger targeted expansion over the complete corpus for that semantic family.
4. A sampled false-negative rate above 2% blocks the claim of an exhaustive semantic census and requires another independent review pass or a larger sample.
5. A single unique missed defect may be added to the checker population and reported, but the report must state the observed miss and confidence limitation.
6. Do not lower the sample, redefine defects, or exclude difficult rows to obtain a green rate.

These are acceptance rules for this one census, not authorization to add a permanent audit threshold to project governance.

## 13. `remediation-manifest.jsonl`

Only independently accepted Tier A and Tier B rows enter the bounded remediation manifest by default. A Tier D row may enter only after independent bilingual review resolves it to an exact owner-approved parity repair; unresolved Tier D rows remain deferred.

Required fields:

```json
{
  "repairId": "terminal-2026-07-21-001",
  "queueIndex": 890,
  "bankPath": "banks/gemini-canonical.json",
  "topLevelQuestionId": "gap_50_mc_03",
  "embeddedQuestionId": null,
  "itemType": "dropdown_cloze",
  "repairTier": "A",
  "action": "DELETE_DUPLICATED_STEM_SENTENCE",
  "targets": [
    {
      "jsonPath": "stem.en",
      "before": "Full exact current English stem...",
      "after": "Full exact repaired English stem..."
    },
    {
      "jsonPath": "stem.zh",
      "before": "完整当前中文题干...",
      "after": "完整修复后中文题干..."
    }
  ],
  "preservedResponseSurface": "clozeStem",
  "answerKeyChange": false,
  "itemTypeChange": false,
  "clinicalFactChange": false,
  "sourceCheckRequired": false,
  "independentCheckerStatus": "CLEARED",
  "rationale": "Exact duplicated cloze response is removed from ordinary stem; functional dropdown sentence remains unchanged."
}
```

Allowed bounded actions:

- `DELETE_DUPLICATED_STEM_SENTENCE`
- `REMOVE_LITERAL_TEMPLATE_FROM_STEM`
- `DELETE_REDUNDANT_AUTHORIAL_DISCLAIMER`
- `MOVE_EXPLANATION_TO_RATIONALE`
- `NATURALIZE_REQUIRED_CLINICAL_RULE`
- `BILINGUAL_PARITY_REPAIR`

`MOVE_EXPLANATION_TO_RATIONALE`, `NATURALIZE_REQUIRED_CLINICAL_RULE`, and `BILINGUAL_PARITY_REPAIR` require exact owner-approved replacement text and independent clinical/bilingual review before Codex execution.

Do not place a Tier C full rewrite into this manifest by pretending it is a string deletion.

## 14. `deferred-and-dismissed.jsonl`

Record every checked row not entering bounded remediation:

- dismissed Sonnet flags;
- retained legitimate terminal sentences;
- Tier C full-item reviews;
- Tier D bilingual escalations not yet resolved;
- Tier E renderer/schema investigations;
- producer-conflicted findings awaiting another checker;
- owner-deferred decisions.

Each row must state the exact reason and next owner. Deferred rows remain visible; they are not counted as repaired.

## 15. `final-census-report.md`

The report may be written only after reconciliation and checker review satisfy the acceptance rules.

Required sections:

### 15.1 Status

Use exactly one:

- `ACCEPTED_FOR_REMEDIATION_PLANNING`
- `ACCEPTED_WITH_STATED_FALSE_NEGATIVE_LIMITATION`
- `PARTIAL_DELIVERY_ONLY`
- `BLOCKED_RECONCILIATION`
- `BLOCKED_SEMANTIC_RELIABILITY`
- `BLOCKED_PRODUCER_CONFLICT`
- `BLOCKED_CONCURRENT_BANK_CHANGE`

### 15.2 Snapshot and reconciliation

Report:

- branch and HEAD;
- starting/ending changed paths;
- bundled bank hashes;
- queue population by record kind;
- Sonnet batch and row counts;
- identity/schema reconciliation;
- controls selected and reviewed.

### 15.3 Sonnet results versus checker results

Provide counts by:

- Sonnet verdict/class;
- checker disposition;
- final verdict/class;
- bank;
- item type;
- record kind;
- removal risk;
- next step;
- producer conflict;
- repair tier.

### 15.4 False-negative assessment

Report:

- deterministic PASS sample size;
- confirmed passes;
- missed flags/reviews;
- observed miss rate;
- any targeted expansion performed;
- whether the census can be treated as exhaustive enough for remediation planning.

### 15.5 Terminal versus control evidence

Using accepted final dispositions, report terminal and control `FLAG + REVIEW` counts/rates and a descriptive enrichment ratio when defined. Do not claim statistical significance.

### 15.6 Accepted finding queues

List exact stable identities and evidence for:

- Tier A mechanical placement repairs;
- Tier B bounded semantic repairs;
- Tier C full-item review;
- Tier D bilingual review;
- Tier E renderer/schema investigation.

### 15.7 Known-example reconciliation

State the final disposition for all calibration gates, including:

- `gap_50_mc_03`;
- fill-in-blank raw-placeholder examples;
- the bilingual rounding nondefect;
- the clozapine ordered-response disclaimer;
- RSBI and other `This item asks only...` calculation disclaimers.

### 15.8 Handoff

End with:

- exact bounded-remediation count;
- exact full-item-review count;
- exact bilingual-review count;
- exact renderer/schema-investigation count;
- exact dismissed count;
- paths to the final adjudication and manifests;
- explicit statement that no bank mutation occurred in this phase.

## 16. `codex-remediation-work-order.md`

Derive this work order only from `remediation-manifest.jsonl` and owner-approved Tier C commissions, never directly from Sonnet labels.

The Codex work order must include:

1. exact read order and starting-worktree isolation;
2. one enumerated repair per manifest row;
3. exact `before` → `after` operations for every changed EN/ZH path;
4. required declarative canonical patch mechanism;
5. exact precondition failures and stop codes;
6. answer-key, option/token, ID, source, item-type, scoring, and count preservation assertions;
7. separate handling for full-item rewrites;
8. renderer/schema investigation boundaries;
9. ledger and report obligations;
10. independent post-implementation content-review handoff;
11. full verification commands;
12. no commit/push authorization.

Recommended canonical patch reason:

```text
remove independently adjudicated terminal-sentence template and authorial leakage while preserving learner task, answer logic, and bilingual meaning
```

Canonical JSON must not be free-hand edited. Use the current declarative patch pathway from `scripts/patch-raw.ts --allow-canonical --reason`, with exact full-string preconditions and a ledger entry.

## 17. Codex implementation tiers

### 17.1 Bounded patch pass

Codex may apply approved Tier A and Tier B operations that:

- preserve answer keys and response structures;
- preserve clinical facts except for explicitly approved naturalization;
- preserve IDs, item type, category, topic, difficulty, `ngnSkill`, source metadata, visuals, stages, exhibits, and array order;
- change only exact listed learner-facing strings.

### 17.2 Full-item rewrite pass

Tier C rows require a separate item-specific work order or explicit appendix containing:

- why deletion alone is unsafe;
- complete live item evidence;
- re-derived construct and answer key;
- exact replacement item or exact bounded rewrite;
- source/currency requirements when clinical facts change;
- non-producer content review before mutation.

Do not mix unresolved Tier C rows into a mechanical deletion batch.

### 17.3 Prospective hardening

A permanent audit rule is optional and evidence-dependent.

- Exact duplicated `dropdown_cloze.stem` / `clozeStem` and raw-placeholder placement may support deterministic schema/audit hardening after a measured bank-impact survey.
- Fill-in-blank raw placeholders may support an item-type-specific validator because the renderer does not substitute them.
- Broad semantic phrases such as `This item asks only`, `do not`, `scope`, `alone`, or `not required` remain unsuitable as generic blockers without a proved high-precision signature.
- Existing producer-vocabulary and authorial-constraint audits must not be weakened or duplicated.

Any hardening proposal must identify its executable owner, negative tests, current live hits, and whether it would reject legitimate learner instructions.

## 18. Verification floor for Codex

At minimum:

```sh
npm run validate-bank -- banks/*.json
npm run audit
npm run coverage-report
npm run census
npm run census:check
npx tsc -b --pretty false
npm run build
git diff --check
```

Also require:

- patch dry-run before apply;
- exact target/path count reconciliation;
- patch idempotency on rerun;
- targeted tests for any new placement validator;
- direct EN/ZH inspection of every changed field;
- proof that question/session/visual populations are unchanged unless an owner-approved full-item retirement explicitly says otherwise;
- proof that keys, response options/tokens/blanks, and scoring remain unchanged for bounded repairs;
- focused live-render checks for dropdown-cloze and fill-in-blank placement repairs;
- before/after bank hashes and exact diff inventory.

A green build does not prove a semantic deletion was safe.

## 19. Ledger and project-history handling

Every canonical content correction receives a `BANK-REVIEW-LEDGER.md` entry that records:

- audit and final-adjudication paths;
- stable item identities and changed field count;
- repair tier and action;
- whether answer logic or clinical facts changed;
- EN/ZH parity status;
- declarative patch path and reason;
- verification results;
- independent content-review status.

Do not mark repaired content `REVIEWED` until the independent checker closes the post-implementation diff.

Update `PROJECT-HISTORY.md` only when the completed work materially changes active content, active audit coverage, or active producer rules. Do not record rejected model attempts or item-by-item detail as project milestones.

## 20. Independent post-implementation review

The checker receives:

- final census report;
- checker adjudication;
- remediation and deferred manifests;
- exact Codex work order;
- declarative patch;
- exact bank diff;
- verification receipts;
- ledger entry.

The checker independently verifies:

1. every changed terminal sentence and its local item context;
2. deletion safety and surviving response demand;
3. all dropdown-cloze and fill-in-blank renderer-placement assumptions;
4. all EN/ZH paired changes;
5. preservation of answer keys and item constructs;
6. every full-item rewrite’s clinical and source logic;
7. absence of unauthorized changes;
8. any new blocker’s false-positive floor.

Only after this review may the ledger be cleared to reviewed status.

## 21. Stop conditions

Stop and report the applicable condition when:

- Sonnet batches do not reconcile exactly;
- the queue or live banks changed between review and adjudication;
- a proposed deletion lacks an independent safety check;
- a producer-conflicted row lacks a non-conflicted checker;
- sampled false negatives exceed the acceptance rule;
- exact before text or stable identity no longer matches;
- EN/ZH repair cannot preserve meaning;
- a full-item rewrite requires an unresolved clinical/source decision;
- another task already modifies a targeted canonical bank;
- the architect/checker phase writes outside its audit directory.

Do not force a remediation manifest by dismissing ambiguity, collapsing full rewrites into deletions, or treating Sonnet’s completion claim as an independent null.

## 22. Exit checklist

- [ ] Sonnet batches reconciled against every queue identity
- [ ] Closed enums and required evidence validated
- [ ] Every Sonnet FLAG/REVIEW independently checked
- [ ] Every mechanical placeholder/duplication signal independently checked
- [ ] Calibration gates independently re-derived
- [ ] Deterministic PASS sample reviewed
- [ ] False-negative escalation resolved
- [ ] Producer conflicts routed correctly
- [ ] Final accepted census report written
- [ ] Bounded remediation separated from full-item rewrites
- [ ] Exact remediation manifest contains only independently cleared rows
- [ ] Deferred/dismissed rows remain visible
- [ ] Codex work order uses exact before/after operations
- [ ] No bank mutation occurred in architect/checker phase
- [ ] No commit or push occurred

## 23. Final response

After completing this post-review phase, respond with:

1. final status;
2. paths to `final-census-report.md`, `checker-adjudication.jsonl`, `remediation-manifest.jsonl`, `deferred-and-dismissed.jsonl`, and `codex-remediation-work-order.md`;
3. exact counts for bounded repairs, full-item reviews, bilingual reviews, renderer/schema investigations, and dismissals;
4. PASS-sample miss count and observed rate;
5. confirmation that no bank mutation occurred.

Do not begin Codex implementation without explicit owner routing.