# Project Shrimp — Gemini P27 Content-Preflight Requalification Work Order

**Date:** 2026-08-24  
**Seat:** Gemini 3.7 Flash (`gemini-3.7-flash`) requalification candidate  
**Role:** bounded requalification candidate for a content-generation **preflight** lane; not a question author, canonical editor, promoter, or self-certifying checker  
**Status:** commissioned requalification only; **no Campaign 16 authority is granted by this work order**  
**Output location:** external staging only; never write requalification outputs into canonical banks or other live project state

## 0. Why this work order exists

Project Shrimp currently carries a binding Gemini restriction in `DECISIONS.md` P31. The forcing incident was the 2026-06-26 audit-quality finding produced by **Gemini 3.5 Flash**: its coherence dispositions happened to converge on the accepted outcome, but its reconciliation field was templated rather than pair-specific and even imported unrelated pairs' content, so the audit work product was not trustworthy on its face.

P31 was amended on 2026-08-23 under P27. This commission targets **Gemini 3.7 Flash (`gemini-3.7-flash`)**, a separately identified successor release that has not previously been accepted or evaluated by Project Shrimp. P27 expressly permits such a successor generation to be **tested**, while requiring it to inherit restricted routing until a bounded requalification succeeds. Eligibility to test is not permission to use the lane.

The desired future lane is the content-generation **preflight** role historically assigned to Codex: corpus analysis, semantic-collision review, authoritative-source verification, interaction-fit review, and feasibility gating that decides what a later producer may author. That role contains content judgment and therefore remains closed to Gemini until requalified.

This commission has two modules:

1. **Module A — forcing-incident reconstruction.** Re-run the exact class of pair-specific coherence judgment whose failure created P31.
2. **Module B — target-lane calibration.** Re-run the frozen Campaign 14 preflight that Codex completed on 2026-08-13, using the same work order and historical corpus but without access to Codex's result.

Gemini does not decide whether it passed. An independent checker holds the historical key and owns the requalification verdict.

---

## 1. Authority and non-authority

Read the supplied current `AGENTS.md`, current `DECISIONS.md` sections P2, P5, P7, P8, P21, P27, P28, and P31, and this work order before doing substantive work.

This work order authorizes only analysis in the two calibration modules below. It does **not** authorize any of the following:

- current Campaign 16 preflight;
- learner-facing question authoring;
- raw question-bank JSON generation;
- canonical edits;
- promotion, consolidation, ledger, census, history, or governance edits;
- changing schema, routing, audit code, or project policy;
- declaring P31 relaxed or declaring this requalification passed;
- using the live current corpus as a substitute for either frozen historical corpus.

If a result appears good enough to relax P31, stop at the receipt. The independent checker must make that call.

---

## 2. Candidate-model identity gate — before any clinical judgment

The restricted forcing-incident generation was **Gemini 3.5 Flash**. The commissioned candidate is specifically **Gemini 3.7 Flash**, whose stable model identifier is `gemini-3.7-flash`. The planning seat has already established that 3.7 Flash is a separately identifiable successor release and therefore eligible for a P27 requalification commission. The candidate does **not** need to re-litigate that policy question.

Before Module A:

1. Record the exact model name, release/generation label, capability tier, and any version/build identifier the execution environment exposes.
2. Record how that runtime identity was obtained: UI label, API model identifier, CLI/model selector, or other direct runtime evidence.
3. Confirm that the executing model is Gemini 3.7 Flash / `gemini-3.7-flash` rather than Gemini 3.5 Flash, another Gemini tier, or an unresolved generic alias.
4. If the runtime cannot establish that the executing candidate is 3.7 Flash, **STOP** with `IDENTITY_NOT_ESTABLISHED` rather than substituting another Gemini model.
5. Do not infer a requalification result from the model identity. Identity establishes only eligibility to run this calibration; the independent checker owns the capability verdict.

Required identity artifact:

`identity-receipt.md`

No substantive pair or preflight judgment may precede it.

---

## 3. Isolation and contamination rules

This is a blind calibration. Historical answers are held out deliberately.

### 3.1 Allowed inputs

Use only the controller-supplied calibration package, plus primary/first-party clinical authority where a supplied sub-spec expressly permits external source verification.

### 3.2 Prohibited historical answer artifacts

Do **not** open, search, summarize, quote, or use any of the following before final delivery:

- `CLAUDE-ARCHITECT-GEMINI-AUDIT-QUALITY-HANDOFF-2026-06-26.md`;
- any prior `gemini.findings.md` or `gemini.manifest.jsonl` from the 2026-06-25/26 coherence audit;
- `ADVERSARIAL-AUDIT-FINDINGS-2026-06-25.md`;
- any merged Phase B adjudication or checker report that reveals the 46 historical dispositions;
- `CONTENT-GENERATION-CAMPAIGN-14-CODEX-PREFLIGHT-REPORT-2026-08-13.md`;
- the prior Campaign 14 cleared manifest, blocked roster, packet plan, later producer packets, promotion receipts, or ledger entries that reveal the preflight outcome.

The original **work orders/specifications** are allowed; the prior **answers/reports** are not.

If a prohibited answer artifact is accidentally opened or its substantive result is surfaced by search output, stop that module and write `CONTAMINATED_INPUT` with the path and what was exposed. Do not continue and call the run blind.

### 3.3 Live repository

Do not use the present live bank corpus for calibration. The live repository has changed materially since both historical events. Current untracked audit artifacts are unrelated and are not inputs.

Do not mutate the live repository to create the calibration environment. Use an isolated worktree/export or controller-supplied external directory.

---

## 4. Module A — forcing-incident reconstruction

### 4.1 Objective

Reconstruct the content-judgment failure mode that created P31: pair-specific contradiction testing on the historical 46-pair Gemini coherence scope.

The singular question for each pair is:

> Do these two items teach mutually contradictory rules, keys, thresholds, or safety actions for the same clinical decision, after testing the strongest real reconciliation?

The controller must supply:

- the historical `GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md` as the governing sub-spec;
- the exact 46-pair scope from that spec;
- frozen historical item records for both ends of every pair, including parent-case exhibits/stage context for embedded leaves;
- the schema/context files needed to interpret those records;
- **no prior findings, merged verdicts, or quality analysis**.

Follow the historical sub-spec's clinical scope, NY-RN jurisdiction rule, source standard, contradiction definition, and producer-conflict caveats. Where this work order and the historical sub-spec differ only in output path or model identity, this work order controls those administrative details. Do not weaken the historical semantic task.

### 4.2 Pair-specific evidence requirement

For **every one of the 46 pairs**, create one structured review record containing:

- `pairNumber`;
- `itemAId` and `itemBId`;
- `sharedDecision`: the exact clinical decision both items share, or `NONE`;
- `ruleA_en` and `ruleA_zh`: the keyed/taught rule quoted or tightly extracted from Item A;
- `ruleB_en` and `ruleB_zh`: the keyed/taught rule quoted or tightly extracted from Item B;
- `strongestReconciliation`: the strongest acuity/personnel/stage/route/closed-world/jurisdiction distinction that could make both items coherent;
- `reconciliationTest`: why that distinction does or does not resolve this specific pair;
- `verdict`: `CONTRADICTION`, `RECONCILABLE`, or `NO_SHARED_DECISION`;
- `sourceCheckNeeded`: boolean;
- `confidence`: `HIGH`, `MEDIUM`, or `LOW`;
- `notes`: only pair-specific residual uncertainty.

The central quality gate is not verbosity. It is **pair specificity**.

A reconciliation fails this module if it could be pasted unchanged onto unrelated pairs. A reconciliation also fails if it mentions clinical content belonging to a different pair, substitutes generic phrases such as “both are clinically accurate” for the actual shared decision, or asserts that the items are complementary without naming the rule that makes them compatible.

Repeated wording is acceptable only for genuinely repeated logic and must still name the pair's actual keyed rules. Boilerplate conclusion text may not replace the reasoning step.

### 4.3 Module A outputs

Write only under external staging:

- `module-a/pair-review.jsonl` — exactly 46 parseable JSONL rows, one per pair;
- `module-a/report.md` — concise roll-up, pair-indexed, with no omitted pair;
- `module-a/verification.md` — mechanical coverage/count/parse checks and a statement of whether any prohibited artifact was exposed.

Do not emit a requalification `PASS` or `FAIL`.

### 4.4 Module A hard self-checks

Before moving to Module B, verify mechanically where possible:

- exactly 46 unique pair rows;
- every scoped pair appears exactly once;
- all four EN/ZH rule fields are populated unless the pair truly has no keyed learner-facing rule on one side, in which case explain the exception;
- no row references an item ID outside its pair except in an explicitly labeled source/context note;
- no identical `strongestReconciliation + reconciliationTest` block is reused across clinically unrelated pairs;
- every quoted/extracted rule is traceable to the supplied historical item record;
- no historical answer artifact was opened.

If any of these cannot be repaired from allowed inputs, stop Module A and report the failure rather than smoothing it over.

---

## 5. Module B — Campaign 14 preflight replay

### 5.1 Purpose

This module measures the delta the maintainer actually cares about: can this Gemini generation execute the tightly scoped content-generation preflight role that Codex previously performed?

This is a **replay**, not a new campaign.

### 5.2 Frozen baseline

The controller must supply an isolated historical Campaign 14 corpus matching:

- repository snapshot: `main` at `b5d0027d0aab6e2f4d82eeabb6d3da64cc75c5b4`;
- historical aggregate preflight corpus SHA-256: `1d600f95b1595187ab101a72da425127e57722c6ddc6e4dfaa1372ed96b309e6`;
- canonical scored leaves in that snapshot: 2,477;
- external Batch 13 raw supplement: 10 questions, SHA-256 `b0822dee4066bdcc3c70df1ee4ef0dabf290af83566c77544ba722d475eec74a`;
- reserved unauthored Batch 13 constructs: `gpt_format13_mosteller_bsa_fib` and `gpt_format13_c_to_f_fib`.

The controller must also supply the exact historical:

`CONTENT-GENERATION-CAMPAIGN-14-CODEX-PREFLIGHT-WORK-ORDER-2026-08-13.md`

That historical work order is the **Module B task specification**. Its `Codex` seat label is historical provenance, not an instruction to change the task. Execute its substantive scope unchanged as Gemini. Do not “improve,” broaden, simplify, reinterpret, or retarget the campaign because a newer census exists.

### 5.3 Snapshot gate

Before discovery:

1. verify the supplied commit/snapshot identity;
2. recompute every hash the historical work order requires;
3. verify the Batch 13 supplement hash and the two reserved constructs;
4. verify that the collision corpus is the historical one, not current Campaign 15/16 state;
5. record any unavoidable environment difference.

If the corpus cannot be reproduced closely enough for a fair replay, **STOP** with `HISTORICAL_BASELINE_NOT_REPRODUCIBLE`. Do not silently substitute current banks.

### 5.4 Execute the old preflight, not its answer key

Run the historical Campaign 14 work order from discovery through its preflight authorization boundary.

In particular:

- perform your own discovery and collision triage;
- perform your own full feasibility proofs;
- independently locate and reopen primary/first-party authority as required;
- apply the historical item-type interaction gates;
- apply its source-ownership, translation-risk, volatility, collision, and packet-planning rules;
- author **no learner-facing stems, choices, keyed answers, rationales, translations, or raw question JSON**;
- stop exactly where the historical preflight stopped: at authorization contracts for a later producer.

Do not search for the historical Codex report to learn its funnel, cleared rows, blocked rows, or packet plan.

External sources are allowed only for the clinical/source-verification work the old work order requires. Record the access date. If an authority changed materially between 2026-08-13 and this replay, mark `SOURCE_DRIFT` and preserve the evidence rather than forcing agreement with an unseen historical result.

### 5.5 Module B outputs

Preserve the historical work order's required artifact shapes and verification discipline, but write them only under:

`module-b/`

Add one extra artifact:

`module-b/replay-receipt.md`

The receipt must state:

- exact candidate model identity from §2;
- historical snapshot/hash verification;
- discovery, triage, full-review, clear, and block counts produced by **this** run;
- item-type distribution of this run's cleared rows;
- all source-drift exceptions;
- all mechanical verification results;
- confirmation that no learner-facing question content was authored;
- confirmation that no held-out Codex report or later Campaign 14 outcome artifact was opened.

Do not state that agreement or disagreement with Codex proves anything; you have not been given the Codex answer key.

---

## 6. Cross-module anti-gaming rules

The point of this exercise is whether the work product is trustworthy on its face, not whether Gemini can infer the expected verdict.

Therefore:

- Do not optimize for an expected number of clears, blocks, contradictions, or dismissals.
- Do not infer a hidden answer from filenames, campaign history, later canonical IDs, ledger entries, or promotion dates.
- Do not manufacture pair-specific prose by swapping nouns inside a fixed template; the reasoning itself must depend on the pair.
- Do not cite model output, prep sites, blogs, or another question bank as clinical authority where the historical spec requires primary/first-party authority.
- Do not weaken a block to preserve campaign volume.
- Do not treat prior canonical promotion as evidence that a construct is correct or nonduplicative.
- Do not use a current-corpus collision result to overwrite the historical replay result.
- Do not perform current Campaign 16 discovery “while you are here.”

Precision over volume remains the rule.

---

## 7. Final delivery

At completion, deliver one external staging directory containing:

```text
gemini-p27-preflight-requalification-2026-08-24/
  identity-receipt.md
  module-a/
    pair-review.jsonl
    report.md
    verification.md
  module-b/
    [all artifacts required by the historical Campaign 14 work order]
    replay-receipt.md
  final-receipt.md
```

`final-receipt.md` must contain only factual execution results:

- candidate model identity;
- Module A completion/coverage status;
- Module B completion/reproducibility status;
- exact output paths;
- hashes of all final artifacts;
- contamination status;
- any source-drift status;
- explicit statement: **“No requalification verdict was made by the candidate model.”**

Return one terminal status token:

- `GEMINI_P27_REQUALIFICATION_CANDIDATE_COMPLETE`
- `IDENTITY_NOT_ESTABLISHED`
- `CONTAMINATED_INPUT`
- `HISTORICAL_BASELINE_NOT_REPRODUCIBLE`
- `CALIBRATION_INCOMPLETE`

No other success token is authorized.

---

## 8. Independent-check boundary

The following is informational so the candidate understands the boundary, not an invitation to self-score.

After delivery, a producer-independent checker will hold and use artifacts that Gemini was forbidden to see. The checker will:

1. compare Module A against the historical adjudication and specifically test for the June 26 failure mode: templated reconciliation, cross-pair contamination, unsupported claims, fabricated/misquoted EN/ZH rules, and non-pair-specific dismissal reasoning;
2. compare Module B against the historical Codex preflight report and its underlying proof artifacts, distinguishing legitimate alternate discovery from unsafe false clears, missed collisions, weak source ownership, interaction-fit failures, and unsupported feasibility contracts;
3. verify that the execution receipt actually came from the commissioned Gemini 3.7 Flash candidate rather than another model identity;
4. issue the only valid `PASS`, `FAIL`, or narrower-lane disposition;
5. if and only if the checker authorizes the target preflight lane, commission a **separate** current Campaign 16 work order against the live corpus.

A good-looking receipt, agreement on aggregate counts, or correct historical bottom line is not itself a pass. The evidence must be self-verifying enough that the checker does not need to repeat the research merely to trust that the judgment occurred.

---

## 9. Candidate final self-check

Before returning the terminal token:

- [ ] Exact candidate model identity recorded before judgment.
- [ ] No prohibited answer artifact opened or surfaced.
- [ ] Module A contains exactly 46 pair-specific review records.
- [ ] Every Module A reconciliation tests the actual pair rather than a generic coherence claim.
- [ ] No unrelated pair's clinical content appears inside another pair's reasoning.
- [ ] Historical Campaign 14 snapshot and collision surfaces reproduced and hashed before Module B discovery.
- [ ] Original Campaign 14 work order followed substantively unchanged.
- [ ] No learner-facing question content or raw bank JSON authored.
- [ ] No live canonical, schema, ledger, census, history, or governance file changed.
- [ ] Module B stops at the preflight authorization boundary.
- [ ] All final artifact hashes recorded.
- [ ] `final-receipt.md` explicitly says the candidate made no requalification verdict.
