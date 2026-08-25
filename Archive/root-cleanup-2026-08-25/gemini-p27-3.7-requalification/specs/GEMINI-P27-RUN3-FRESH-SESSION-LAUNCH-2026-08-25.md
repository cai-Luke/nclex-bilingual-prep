# Gemini P27 — Run 3 Fresh-Session Launch

## Purpose

This is a fresh-context replacement execution of **Module A only** from the Project Shrimp Gemini P27 requalification. Module B remains blocked by the unrecovered exact-hash Batch 13 supplement and must not be rerun or searched for in this session.

## Mandatory session boundary

Execute this instruction in a **new Gemini 3.7 Flash / `gemini-3.7-flash` Antigravity conversation or agent session with no prior P27 conversation context**. Do not continue the session that produced Run 1 or Run 2.

The candidate must not read, search, summarize, compare against, or use any prior candidate output from Run 1 or Run 2. In particular, do not open or inspect:

- `Project Shrimp/scratch/gemini-p27-preflight-requalification-2026-08-24/`
- `/Users/holemini/Desktop/gemini-p27-preflight-requalification-run2-2026-08-25/`
- any helper script or temporary file derived from either prior run

Prior candidate prose, verdicts, counts, reports, verification scripts, or summaries are **not allowed inputs or priors**. Do not attempt to reproduce or improve a prior answer.

## Allowed inputs

For substantive Module A judgment, use only:

- `/Users/holemini/Desktop/gemini-p27-calibration-input-2026-08-25-v2/module-a/`

This package contains the frozen 46-pair historical corpus and historical governing sub-spec. Use the package's `pairs.jsonl` as the item corpus. Do not consult current canonical banks.

The following administrative facts are supplied by the controller and may be used without further repository inspection:

- Candidate model: Gemini 3.7 Flash (`gemini-3.7-flash`)
- Historical snapshot: `59664cacfe4cfbd43d212f84c5d164a09557c958`
- Scope: 46 globally numbered pairs; Part A local 1–31, Part B local 1–15
- Output must remain external to `Project Shrimp`
- The candidate does not decide whether it passed requalification

Do not inspect Project Shrimp governance/history/answer artifacts in this run. The controller has already established the calibration package provenance.

## Module A task

For each of the 46 supplied pairs, independently answer:

> Do these two items teach mutually contradictory rules, keys, thresholds, or safety actions for the same clinical decision, after testing the strongest real reconciliation?

Produce one JSONL record per pair containing:

- `pairNumber`
- `part`
- `partPairNumber`
- `itemAId`
- `itemBId`
- `sharedDecision` — exact shared clinical decision or `NONE`
- `ruleA_en`
- `ruleA_zh`
- `ruleB_en`
- `ruleB_zh`
- `strongestReconciliation`
- `reconciliationTest`
- `verdict` — `CONTRADICTION`, `RECONCILABLE`, or `NO_SHARED_DECISION`
- `sourceCheckNeeded`
- `confidence` — `HIGH`, `MEDIUM`, or `LOW`
- `notes`

The central gate is pair specificity. A reconciliation is defective if it could be pasted unchanged onto an unrelated pair, contains content from another pair, or substitutes a generic assertion of clinical accuracy/complementarity for the actual keyed-rule comparison.

Repeated wording is acceptable only when the underlying logic genuinely repeats and the pair-specific rules are still named.

## Output

Create a new external staging directory:

`/Users/holemini/Desktop/gemini-p27-preflight-requalification-run3-2026-08-25/`

Write only:

- `identity-receipt.md`
- `module-a/pair-review.jsonl`
- `module-a/report.md`
- `module-a/verification.md`
- `final-receipt.md`

Do not write to `Project Shrimp`.

## Verification requirements

Mechanically verify:

- exactly 46 rows
- global `pairNumber` exactly 1–46
- correct local Part A/Part B numbering
- each supplied pair exactly once
- all required fields populated
- no unrelated scoped item ID appears in another pair's reasoning
- no identical `strongestReconciliation + reconciliationTest` block across unrelated pairs
- rule extraction traceability to the supplied frozen record

For semantic template review, do **not** claim that a lexical metric such as Jaccard similarity proves de novo reasoning or absence of noun-swapped templates. Lexical checks may be reported as supporting diagnostics only. State separately that final semantic template judgment belongs to the independent checker.

## Isolation receipt

The final receipt must affirm that:

- this was executed in a fresh conversation/session without Run 1 or Run 2 conversational context;
- neither prior candidate output directory was opened or searched;
- no historical held-out answer/adjudication artifact was opened;
- only the controller-supplied Module A package was used for substantive judgment;
- no live repository mutation occurred.

Do not report or optimize toward any expected contradiction/reconciliation counts. Do not compare this run to prior candidate runs.

Do not make a P27 requalification pass/fail decision.
