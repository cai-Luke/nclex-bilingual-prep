# Project Shrimp — Codex Independent Check of Gemini P27 Run 3, Module A

**Date:** 2026-08-25  
**Checker seat:** Codex, use the strongest available reasoning configuration appropriate to a content-judgment audit  
**Role:** producer-independent checker for **Gemini 3.7 Flash P27 requalification Run 3 — Module A only**  
**Authority:** issue a Module A checker disposition only; **do not issue an overall P27/P31 requalification verdict and do not authorize any current campaign lane**  
**Live-repo mutation:** prohibited except that this work order already exists under `scratch/`; all checker outputs and temporary scripts must stay outside the repository

---

## 0. Purpose

Gemini 3.7 Flash has produced a fresh-session Module A reconstruction of the historical 46-pair coherence task used for P27 requalification. The question is not whether the prose looks better than an older Gemini generation. The question is whether the **Run 3 work product is trustworthy on its own face under the exact Module A contract**.

This checker must therefore answer, independently:

1. Did Gemini extract the actual keyed/taught EN/ZH rules from the supplied frozen records without fabrication, mutation, or source drift?
2. Did it identify the **exact shared clinical decision** for each pair, or correctly use `NONE` when there is no shared decision?
3. Did each `strongestReconciliation` and `reconciliationTest` actually depend on that pair, rather than on a reusable domain-level template?
4. Did Gemini miss any real contradiction or create any false contradiction?
5. Did any reasoning import facts from another pair, from unsupported general knowledge, or from clinical material absent from the frozen record while presenting those facts as item-derived?
6. Are the candidate's own verification claims true?

The checker is intentionally blinded from prior pair-level findings at first. **Do not search for expected defect locations or expected counts.**

---

## 1. Governing material

Read first:

- `$HOME/Desktop/Project Shrimp/AGENTS.md`
- `$HOME/Desktop/Project Shrimp/DECISIONS.md` — especially current P2, P5, P27, and P31
- `$HOME/Desktop/Project Shrimp/scratch/GEMINI-P27-CONTENT-PREFLIGHT-REQUALIFICATION-WORK-ORDER-2026-08-24.md`
- this work order

The P27 work order's Module A contract controls the substantive task. In particular:

- 46 exact historical pairs;
- pair-specific reasoning rather than generic coherence prose;
- `sharedDecision` must name the **exact clinical decision** or `NONE`;
- EN/ZH rules must be quoted or tightly extracted from the supplied item records;
- every quoted/extracted rule must be traceable to the supplied historical record;
- no unrelated pair's content may appear inside another pair's reasoning;
- a reconciliation cannot pass merely because two items are broadly in the same nursing domain;
- the candidate's self-verification is evidence to audit, not evidence to trust.

Do not weaken those requirements because the candidate reached a plausible bottom line.

---

## 2. Exact frozen input package

Use the controller-supplied V2 package only:

`$HOME/Desktop/gemini-p27-calibration-input-2026-08-25-v2/`

Module A inputs:

- `module-a/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md`
- `module-a/pair-scope.json`
- `module-a/pairs.jsonl`
- `module-a/package-verification.md`
- `module-a/snapshot-proof.md`
- root `PACKAGE-RECEIPT.md`

Historical snapshot represented by those records:

`59664cacfe4cfbd43d212f84c5d164a09557c958`

Expected SHA-256 values from the V2 package receipt:

```text
2ddeb6699bea384a58b40b8f56c7b01366bb5b8b4a4d1f84b690a0b14cda36d7  module-a/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md
eff589adc096af42f32a960d5e49ad3f3015abcbdcfb8cf84562631b5a60f615  module-a/package-verification.md
acf45ad57aac94623e115966a88d094803435dbeb9e7b23e6cfb549fa80e1af3  module-a/pair-scope.json
ad3858c4d8f16d65065c12ca82ad50a071d6754fb2b0ab96f26a65554534117d  module-a/pairs.jsonl
75fbf95ef5c8249a75abe11a3efb00a869177040e06b7069ae6e8e974e1546a9  module-a/snapshot-proof.md
```

At startup, recompute these hashes. If any mismatch exists, stop with `CHECK_INPUT_MISMATCH` rather than auditing different bytes.

The live current banks are **not** evidence for this check. Do not use them as substitutes or corrections.

---

## 3. Candidate artifact under check

Run 3 output directory:

`$HOME/Desktop/gemini-p27-preflight-requalification-run3-2026-08-25/module-a/`

Candidate artifacts:

- `pair-review.jsonl`
- `report.md`
- `verification.md`

Before opening or parsing their contents, compute and record SHA-256 and byte size for all three files. Recompute them at final delivery and prove they did not change during the check.

Do not edit, normalize, regenerate, or repair candidate artifacts.

---

## 4. Blindness / anti-anchoring boundary

### 4.1 Before the blind checker key is sealed

You may read only:

- the governance/work-order material in §1;
- the frozen V2 Module A package in §2.

You may **hash and stat** the Run 3 candidate artifacts, but you must not open, grep, parse, summarize, or search inside them yet.

You must not inspect:

- any earlier Gemini P27 run;
- any earlier Gemini pair review, report, verifier, or helper script;
- any GPT/Claude commentary about Run 3;
- any historical merged findings/adjudication containing the old 46-pair answers;
- any June 26 quality handoff describing which pair(s) or reasoning blocks were defective;
- any P31 departure-reconciliation artifact that exposes historical outcome-determinative records.

In particular, do not search the repository for likely pair numbers, phrases, or expected defect strings.

### 4.2 Historical-key reveal occurs only after candidate comparison is sealed

The historical answer material in §9 remains forbidden until the blind checker key **and** the candidate comparison artifacts have been finalized and hashed.

This ordering is mandatory. The purpose is to preserve a genuinely independent Codex judgment rather than a reconstruction of the held answer.

If prohibited historical answer material is accidentally surfaced before the appropriate seal, record the path and exposed content, stop, and return `CHECK_CONTAMINATED`.

---

## 5. Phase I — derive and seal an independent 46-pair checker key

Without reading Gemini Run 3, independently review all 46 rows in frozen `pairs.jsonl` under the historical Module A spec.

For each pair, produce one row in:

`01-blind-checker-key.jsonl`

Required fields:

- `pairNumber`
- `part`
- `partPairNumber`
- `itemAId`
- `itemBId`
- `sharedDecision`
- `ruleA_en`
- `ruleA_zh`
- `ruleB_en`
- `ruleB_zh`
- `strongestReconciliation`
- `reconciliationTest`
- `verdict`: `CONTRADICTION`, `RECONCILABLE`, or `NO_SHARED_DECISION`
- `sourceCheckNeeded`
- `confidence`: `HIGH`, `MEDIUM`, or `LOW`
- `notes`

### 5.1 Extraction discipline

For `ruleA_*` and `ruleB_*`:

- extract only what the frozen item, answer key, rationale, and supplied parent context actually support;
- preserve clinically material qualifiers, timing, route, stage, population, thresholds, and action order;
- do not silently add familiar textbook details that are absent from the supplied record;
- do not convert general model knowledge into an item-derived rule;
- if a useful clinical fact is an inference rather than an item-derived rule, label it as inference in `notes` rather than inserting it into the extracted rule.

For embedded leaves, parent context is allowed only from the parent container already present in the same frozen row.

### 5.2 Exact shared-decision discipline

`sharedDecision` is not a topic, specialty, workflow family, or broad care-domain label. A pair may occupy the same general nursing domain and still have no shared clinical decision. Use `NONE` unless both items actually constrain the same decision, rule, threshold, or safety action.

### 5.3 Source checks

The primary task is frozen-record fidelity, not fresh clinical research. Do **not** browse externally merely to enrich the items.

If you independently identify a clinical conflict that cannot be resolved from the frozen records and the historical spec calls for authoritative verification, you may perform that source check. First preserve the item-derived rules exactly; then record any external authority separately. External research may not retroactively make an unsupported candidate extraction "traceable."

### 5.4 Seal

After all 46 blind rows are complete:

1. mechanically verify 46/46 coverage, numbering, IDs, parseability, and field completeness;
2. write `01-blind-checker-key.md` summarizing only your own independent findings;
3. compute SHA-256 for both blind-key artifacts;
4. record those hashes in `00-input-and-seal-receipt.md`.

After the hashes are recorded, do not edit the blind key. Any correction requires a new explicitly versioned file preserving the original bytes.

Only then may you open Gemini Run 3.

---

## 6. Phase II — compare Gemini Run 3 against the sealed checker key and frozen bytes

Open the three Run 3 candidate artifacts only after Phase I is sealed.

Do not compare only verdict labels. Audit the evidence chain.

For every one of the 46 rows, write one record to:

`02-candidate-comparison.jsonl`

Required fields:

- `pairNumber`
- `itemAId`
- `itemBId`
- `candidateVerdict`
- `checkerVerdict`
- `verdictMatch`
- `sharedDecisionGrade`: one of `MATCH`, `TOO_BROAD`, `TOO_NARROW`, `WRONG`, `CANDIDATE_NONE_VALID`, `CHECKER_NONE_CANDIDATE_SHARED`
- `ruleA_en_trace`: `SUPPORTED`, `PARTIAL`, `UNSUPPORTED`, or `MUTATED`
- `ruleA_zh_trace`: same enum
- `ruleB_en_trace`: same enum
- `ruleB_zh_trace`: same enum
- `reconciliationGrade`: one of `PAIR_SPECIFIC_SUPPORTED`, `PAIR_SPECIFIC_WITH_UNSUPPORTED_ADDITION`, `DOMAIN_LEVEL_ONLY`, `TEMPLATED`, `CROSS_PAIR_CONTAMINATION`, `OTHER_DEFECT`
- `sourceCheckAssessment`
- `severity`: `NONE`, `OBSERVATION`, `MINOR`, or `MAJOR`
- `finding`
- `frozenEvidence`: concise source-field/path references supporting the grade

### 6.1 Traceability test

For every candidate `ruleA_en`, `ruleA_zh`, `ruleB_en`, and `ruleB_zh`, compare the actual claim against the corresponding frozen record.

A rule is not `SUPPORTED` merely because it is clinically true in general.

Flag as appropriate when the candidate:

- adds a treatment, precaution, threshold, timing rule, population, route, test, symptom, or management step absent from the item;
- changes a keyed first action or sequence;
- merges the parent case's broader theme into a leaf-specific rule the leaf does not teach;
- attributes a fact to "Item A" or "Item B" when the frozen bytes do not contain it;
- introduces general clinical knowledge and then uses that knowledge to manufacture the claimed shared decision;
- embellishes the Chinese rule beyond the English/source meaning or vice versa.

A concise, meaning-preserving paraphrase is supported. A clinically plausible invention is not.

### 6.2 Reconciliation test

Independently decide whether the candidate's reconciliation:

- names the actual pair-specific distinction;
- depends on facts supported by the two frozen records;
- resolves an apparent contradiction rather than merely observing that both statements can coexist;
- would cease to make sense if pasted onto an unrelated pair.

Broad "complementary components of X care" reasoning is not automatically sufficient. Determine whether the pair truly shares a decision or merely a topic/domain.

### 6.3 Cross-pair contamination

Search all reasoning fields across all 46 rows for:

- item IDs belonging to another pair;
- distinctive diseases, drugs, procedures, thresholds, or actions that belong to another scoped pair but not the current frozen pair;
- repeated semantic blocks where only nouns have been swapped.

Do not limit this to literal item IDs. The original forcing defect was semantic, so semantic contamination matters.

---

## 7. Phase III — corpus-level template and pair-specificity audit

Write:

`03-template-and-pair-specificity-audit.md`

Use deterministic text diagnostics as supporting evidence only. At minimum:

- exact duplicate `strongestReconciliation + reconciliationTest` blocks;
- repeated sentence/opening patterns;
- pairwise lexical similarity or another transparent similarity diagnostic;
- clusters with unusually high overlap;
- repeated conclusion structures across unrelated domains.

Then manually inspect the highest-overlap and most structurally similar clusters.

**No lexical threshold by itself proves or disproves templating.** The final judgment must ask whether the reasoning depends on the actual clinical rules of each pair.

Explicitly distinguish:

- legitimate repeated logic for genuinely similar pairs;
- stylistic repetition;
- noun-swapped or domain-swapped reasoning that substitutes for pair-specific analysis.

---

## 8. Phase IV — audit the candidate's own `verification.md`

Write:

`04-candidate-verification-audit.md`

For each substantive verification claim in Run 3 `verification.md`, classify it as:

- `TRUE`
- `PARTLY_TRUE`
- `FALSE`
- `NOT_MECHANICALLY_PROVABLE_AS_STATED`

At minimum audit:

- total row count;
- global/local numbering;
- pair identity/order;
- required field completeness;
- enum validity;
- cross-pair ID isolation;
- reconciliation-block uniqueness;
- claimed source traceability;
- any implication that the lexical diagnostics establish semantic independence.

A verifier may report deterministic facts mechanically, but it must not label a semantic judgment as mechanically proven when it was not actually checked.

If even one concrete row disproves a corpus-wide claim such as "all extracted rules are traceable," the corpus-wide claim is false. Record the exact counterexample(s) you independently found.

---

## 9. Phase V — held historical key reveal, only after Phase II/IV artifacts are sealed

Before opening any held historical answer artifact:

1. finalize and hash `02-candidate-comparison.jsonl`;
2. finalize and hash `03-template-and-pair-specificity-audit.md`;
3. finalize and hash `04-candidate-verification-audit.md`;
4. record those hashes in the seal receipt.

Only then may you open the historical answer material below for **post-blind comparison**:

- `$HOME/Desktop/Project Shrimp/Archive/root-cleanup-2026-06-26/CLAUDE-ARCHITECT-GEMINI-AUDIT-QUALITY-HANDOFF-2026-06-26.md`
- `$HOME/Desktop/Project Shrimp/Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-25.md`

If a path has moved due to archive maintenance, locate that exact named historical artifact by filename; do not substitute a later retrospective summary.

Write:

`05-historical-key-comparison.md`

Compare:

- your sealed independent verdicts vs the historical adjudication;
- Gemini Run 3 vs the historical adjudication;
- whether Run 3 reproduces or avoids the **historically documented failure mechanism**;
- whether your blind findings identify any new failure mechanism not captured by the old incident.

Do **not** edit or reinterpret your sealed blind findings to agree with the historical key. Any disagreement must remain visible and be discussed as a disagreement.

---

## 10. Severity and Module A disposition rubric

The checker owns the final Module A judgment. Apply the contract, not an expected outcome.

### `MAJOR`

Examples include, but are not limited to:

- a fabricated, unsupported, or materially mutated item-derived rule that affects the shared-decision analysis or reconciliation;
- cross-pair semantic contamination;
- noun-swapped/template reasoning that substitutes for pair-specific judgment;
- a missed real contradiction or invented contradiction;
- broad domain-level "shared decision" reasoning that materially defeats the exact-decision requirement;
- a materially false candidate verification claim about a hard Module A gate;
- reliance on outside knowledge to repair or invent what the frozen item supposedly teaches.

### `MINOR`

Examples may include:

- wording imprecision that remains meaning-faithful to the frozen record;
- a debatable `RECONCILABLE` vs `NO_SHARED_DECISION` classification where the candidate still extracted both item rules accurately and did not rely on the classification to hide a conflict;
- non-material phrasing excess that does not alter the clinical decision.

### `OBSERVATION`

Style or diagnostic notes with no contract violation.

### Module A terminal disposition

Use exactly one:

- `GEMINI_P27_RUN3_MODULE_A_CHECK_PASS`
- `GEMINI_P27_RUN3_MODULE_A_CHECK_FAIL`
- `GEMINI_P27_RUN3_MODULE_A_CHECK_INCONCLUSIVE`

A `PASS` requires no unresolved `MAJOR` findings and satisfaction of the Module A hard gates. Minor/observational findings may be present if they do not undermine trust in the work product.

A `FAIL` is appropriate when one or more major defects demonstrate that the candidate artifact does not satisfy the Module A contract on its own face.

`INCONCLUSIVE` is reserved for checker-input/provenance ambiguity or a genuine inability to adjudicate the frozen evidence, not for ordinary disagreement.

**This token is a Module A checker disposition only. It does not relax P31, does not authorize Gemini for the target preflight lane, and does not substitute for unfinished Module B.**

---

## 11. Output location and required artifacts

Write everything outside the repo under:

`$HOME/Desktop/gemini-p27-run3-codex-module-a-check-2026-08-25/`

Required tree:

```text
gemini-p27-run3-codex-module-a-check-2026-08-25/
  00-input-and-seal-receipt.md
  01-blind-checker-key.jsonl
  01-blind-checker-key.md
  02-candidate-comparison.jsonl
  03-template-and-pair-specificity-audit.md
  04-candidate-verification-audit.md
  05-historical-key-comparison.md
  final-report.md
  receipt.md
```

Temporary scripts are allowed only inside this external directory (for example under `_tools/`) and must not mutate any input artifact.

### `final-report.md`

Must contain:

- blind checker verdict distribution;
- candidate verdict distribution;
- verdict-agreement count;
- counts of `MAJOR`, `MINOR`, and `OBSERVATION` findings;
- list of every pair carrying a non-`NONE` severity, with concise evidence;
- source-traceability summary for EN and ZH rules;
- template/pair-specificity conclusion;
- candidate-verification conclusion;
- post-blind historical-key comparison summary;
- final Module A disposition and exact rationale;
- explicit statement that no overall P27/P31 requalification decision was made.

### `receipt.md`

Must contain:

- checker identity/configuration as exposed by Codex;
- exact input paths;
- expected and recomputed frozen-package hashes;
- initial and final hashes/byte sizes of the three Run 3 candidate artifacts;
- hashes of all checker artifacts;
- blind-key seal time/order;
- candidate-comparison seal time/order;
- exact point at which historical answer artifacts were first opened;
- contamination status;
- live-repository mutation check;
- terminal disposition token.

---

## 12. Hard non-authority / do-not-touch list

Do not:

- edit any canonical bank;
- edit Run 3 outputs;
- edit the frozen package;
- run current Campaign 16 discovery;
- perform Module B;
- repair any clinical item;
- update `DECISIONS.md`, `BANK-REVIEW-LEDGER.md`, `PROJECT-HISTORY.md`, census, or governance;
- commit or push anything;
- use current-bank contents to replace historical bytes;
- read previous Gemini Run 1/Run 2 artifacts as evidence;
- read held historical answer artifacts before the required seals;
- infer a required number of contradictions, reconciliations, or dismissals.

If unrelated live-repo changes exist, leave them untouched.

---

## 13. Final self-check

Before returning:

- [ ] V2 Module A hashes reproduced exactly.
- [ ] Candidate artifacts hashed before being opened and unchanged at the end.
- [ ] Blind checker key derived from frozen package before candidate content was opened.
- [ ] Blind key sealed and hashed before candidate comparison.
- [ ] All 46 pairs independently adjudicated.
- [ ] Every candidate EN/ZH extracted rule checked against frozen bytes.
- [ ] Shared decision judged as exact decision vs broad domain label.
- [ ] Reconciliation checked for pair specificity and source support.
- [ ] Cross-pair semantic contamination checked, not merely item-ID contamination.
- [ ] Lexical diagnostics treated as diagnostics, not proof.
- [ ] Candidate `verification.md` claims independently audited.
- [ ] Historical answer artifacts remained closed until all pre-reveal artifacts were sealed.
- [ ] Blind findings were not rewritten after historical reveal.
- [ ] No live repository or input artifact was modified.
- [ ] No overall P27/P31 qualification or current-campaign authority was issued.
- [ ] Exactly one Module A terminal token returned.
