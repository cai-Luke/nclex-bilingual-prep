# Project Shrimp — Mobile Dropdown-Cloze R1 Final Independent Review Handoff

**Date:** 2026-09-16  
**Audience:** fresh Claude.ai independent checker  
**Task:** finish the already-started independent acceptance of the mobile dropdown-cloze R1 repair.  
**Do not:** implement, merge, push, deploy, update `PROJECT-HISTORY.md`, start calculator work, inspect P27, or reopen accepted specification/product decisions without a concrete contradiction.

## 1. Why this is a continuation, not a fresh commission

A prior independent Claude.ai seat already reviewed the production change and began independent browser verification. That seat exhausted its filesystem/browser tool-call budget before final disposition. Treat the checkpoint below as orientation only; re-derive any load-bearing claim you rely on from live disk.

Prior checker checkpoint:

- production diff looked sound and cloze-scoped;
- no production-code defect was found;
- admitted-base overflow was independently reproduced before any new readout assertion;
- the prior producer runner was rejected because its matched non-cloze reference path reused persistent state and could drift between language/submission conditions;
- the prior runner also failed to assert observed submission state against requested submission state;
- therefore the candidate was **not accepted** at that checkpoint.

Codex has now repaired only those harness defects. The production commit remained byte-identical.

## 2. Live local state to review

Disk-reading worktree:

`/Users/holemini/Desktop/Project Shrimp Mobile Cloze R1`

Branch:

`codex/mobile-dropdown-cloze-overflow-r1`

Expected clean tip from producer return:

`c521637191ce7a635cc7c2c22c2e8c4c0f077deb`

Important identities:

- admitted base: `642b0f9c8707024037709b26b764c7b21e66ddce`
- tested production commit, unchanged: `3cb99e6478bd8a6ff9a90f571afb98860973db4c`
- harness-repair commit: `8df85e510bc446be1f2012e094aa884a1b8d1011`
- frozen R2 SHA-256: `968a575b9f2f5b2b734cc5281a992f92a09dd52c409ea7d104fd5043004d6a6e`
- owner causal-disposition SHA-256: `5ba74604d9052e3a5f578627f9ac709c597d421af1f3ff788a934f1b5face11b`
- corrected runner SHA-256: `3e661e3cc32f1e40a8a8937205c475e504051cb0cee892e23cbd24c61f320667`

The production commit is intentionally **not pushed**. Use the local worktree, not GitHub, for candidate review.

## 3. Read first

From the owner checkout:

1. `AGENTS.md`
2. `MOBILE-DROPDOWN-CLOZE-OVERFLOW-CODEX-WORK-ORDER-2026-09-16-R2.md`
3. `MOBILE-DROPDOWN-CLOZE-R1-OWNER-DISPOSITION-2026-09-16.md`

From the producer worktree:

4. `audit/mobile-dropdown-cloze-overflow-r1/checker-harness-repair/repair-receipt.md`
5. `audit/mobile-dropdown-cloze-overflow-r1/checker-harness-repair/final-invocations.json`
6. `audit/mobile-dropdown-cloze-overflow-r1/checker-harness-repair/scope-proof.json`
7. `scripts/tests/mobile-dropdown-cloze-layout.mjs`
8. the production diff from `642b0f9` to `3cb99e6` for `src/App.tsx` and `src/styles.css`

Read additional evidence only as needed to resolve a concrete question.

## 4. Producer repair claims that require independent confirmation

The corrected producer harness claims:

- every uncached matched non-cloze condition uses fresh isolated browser state with no live app capable of writing stale session state during seeding;
- observed viewport, DPR, theme, text size, language, transport **and submission state** are asserted before a reference witness is admitted;
- the causal containment oracle itself was not weakened except for added evidence recording;
- the same corrected runner bytes were used for all final runs;
- baseline fails on the true cloze defect: root `1302 / 320`, first native select about `1239.594 px` wide;
- candidate HTTP passes twice from fresh evidence directories at root `320 / 320`;
- candidate `file://` passes twice;
- 40 fresh reference profiles cover all requested/observed states;
- all 1,504 exercised ancestor comparisons have cloze-added excess delta `0 px`;
- inherited shell measurement remains `310 / 299` for both cloze and non-cloze control;
- production remains exactly `3cb99e6`; only the runner and new task evidence changed after the prior checker checkpoint;
- no shell-gutter, calculator, protected-path, owner-checkout, push, merge, deployment, or history change occurred.

Do not accept those claims from the receipt alone.

## 5. Minimum independent closure work

This is the acceptance floor. Broaden only for a concrete concern.

### A. Identity and scope

Confirm:

- worktree branch/tip and cleanliness;
- production still resolves to `3cb99e6` with no later production change;
- corrected runner hash is exactly `3e661e3c...f320667`;
- harness repair changed only the task runner and new checker-harness evidence relative to the prior reviewed tip;
- production diff remains bounded to `ClozeLine` and cloze-scoped CSS as previously reviewed.

### B. Review the harness fix

Read `matchedNonCloze()` and the admission assertions. Confirm that:

- an uncached reference condition cannot inherit a live app instance from the prior condition;
- requested versus observed `submitted` state is explicitly checked before cache admission;
- requested versus observed language remains checked;
- stale or mismatched evidence cannot be cached as an admitted witness;
- no sleep/retry/"accept whatever appeared" workaround was introduced;
- `.session-shell` is not generically allowlisted;
- root/subject/client-box containment remains strict under the owner disposition.

### C. Rerun producer evidence

Use fresh reviewer-owned output directories. At minimum rerun:

1. one admitted-base HTTP invocation — expected typed/factual red on the original cloze width defect before readout/reference admission;
2. one candidate HTTP invocation — expected complete green;
3. one candidate `file://` invocation — expected green with only the narrowly inherited manifest diagnostics.

You do **not** need to reproduce the producer's second repetition unless the first reviewer candidate run shows instability or another concrete concern.

### D. Checker-written decisive witness

S1 requires at least one decisive measurement with a probe written by the independent checker rather than the producer runner.

Write a small fresh probe that, at minimum, independently verifies on candidate and admitted base:

- root width of the pinned cloze witness at 320 px;
- selected/readout or select geometry on candidate remains inside the viewport;
- candidate `.session-shell` excess is not larger than a canonical non-cloze active-Study control under a matched condition;
- the measured full-bleed shell attribution is not caused by the cloze subtree.

Use your own selectors/calculation path where reasonable rather than copying the producer oracle.

If you find a stronger simple independent witness, use it.

### E. Production judgment

Inspect the production change itself. Confirm no change to answer/grading/persistence/language semantics beyond the accepted selected-option readout and cloze containment repair.

The prior checker found no production defect, but the final acceptance seat must independently satisfy itself that this remains true.

## 6. Broad sweep is optional, not an acceptance prerequisite

The prior checker had considered a 199-standalone / 91-case cloze sweep. R2 and S1 do **not** require that corpus-wide sweep.

Do not run it merely because it was previously contemplated. Run broader sampling only if the corrected runner, your independent probe, production diff, or fixture selection exposes a concrete reason to suspect the bounded matrix is not representative.

Likewise, Inspect-view and Preview-Lab cloze surfaces are outside this commission's required matrix unless a concrete shared-component defect emerges.

## 7. Final disposition

If the corrected harness fix is sound, your reruns reproduce baseline red/candidate green, your checker-written probe supports the causal containment conclusion, and production remains bounded and behaviorally sound, return:

`PROJECT_SHRIMP_MOBILE_CLOZE_R1_INDEPENDENT_ACCEPT`

State the independently verified production commit, evidence tip, runner hash, rerun results, checker-written witness result, and any nonblocking limitations. Make clear that the inherited calculator overlap remains outside this commission.

If acceptance still fails, return:

`PROJECT_SHRIMP_MOBILE_CLOZE_R1_INDEPENDENT_BLOCK`

Identify the smallest concrete remaining defect and whether it is production, harness, evidence, or authority/scope related.

Do not implement a repair in the independent-review seat.
