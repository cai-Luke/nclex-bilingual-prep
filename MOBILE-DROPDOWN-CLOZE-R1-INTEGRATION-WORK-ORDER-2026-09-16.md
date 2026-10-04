# Project Shrimp — Mobile Dropdown-Cloze R1 Integration / Publication Work Order

**Status:** OWNER-AUTHORIZED INTEGRATION / PUBLICATION  
**Date:** 2026-09-16  
**Integration seat:** Codex, deterministic integration/publish lane.  
**Current owner `main` observed before this order:** `642b0f9c8707024037709b26b764c7b21e66ddce` (`main...origin/main`, tracked-clean; many unrelated untracked owner/P27 files present).  
**Accepted producer branch:** `codex/mobile-dropdown-cloze-overflow-r1`  
**Accepted producer worktree:** `/Users/holemini/Desktop/Project Shrimp Mobile Cloze R1`  
**Accepted production commit:** `3cb99e6478bd8a6ff9a90f571afb98860973db4c`  
**Accepted evidence tip:** `c521637191ce7a635cc7c2c22c2e8c4c0f077deb`  
**Corrected runner SHA-256:** `3e661e3cc32f1e40a8a8937205c475e504051cb0cee892e23cbd24c61f320667`  
**Frozen R2 SHA-256:** `968a575b9f2f5b2b734cc5281a992f92a09dd52c409ea7d104fd5043004d6a6e`  
**Owner-disposition SHA-256:** `5ba74604d9052e3a5f578627f9ac709c597d421af1f3ff788a934f1b5face11b`

## 1. Acceptance authority

The producer-independent review has returned the terminal:

`PROJECT_SHRIMP_MOBILE_CLOZE_R1_INDEPENDENT_ACCEPT`

The owner accepts that disposition for integration. The independent checker verified the production commit, the corrected producer runner, one admitted-base HTTP red, candidate HTTP and `file://` greens in a different Linux/Chromium environment, and a checker-written causal geometry probe. The checker found no production-code defect and confirmed the inherited calculator overlap remains outside this commission.

This order authorizes integration/publication of the already accepted cloze line. It does **not** authorize new cloze design changes, calculator implementation, P27 inspection, bank/schema/grading/storage work, or cleanup of unrelated owner files.

## 2. Read first and admission

Read current `AGENTS.md`, this order, the accepted R2 work order, the owner disposition, current `PROJECT-HISTORY.md`, and the accepted producer repair receipt at:

`audit/mobile-dropdown-cloze-overflow-r1/checker-harness-repair/repair-receipt.md`

Use the explicit local producer worktree for accepted candidate/evidence. Do not substitute GitHub for the unpushed accepted candidate.

Before writing:

1. Record the exact owner `main` HEAD, `origin/main` relation, tracked/untracked status, accepted producer branch HEAD, and producer cleanliness.
2. Confirm accepted evidence tip `c521637191ce7a635cc7c2c22c2e8c4c0f077deb` descends from current `main` and contains production commit `3cb99e6478bd8a6ff9a90f571afb98860973db4c` unchanged.
3. Confirm no commit after `3cb99e6` and through accepted tip `c521637` changes production `src/**`; later commits are test/evidence only as reviewed.
4. If owner `main` is still exactly `642b0f9...`, the accepted line should be a direct descendant and **fast-forward integration is preferred**. Do not manufacture a merge commit solely for ceremony.
5. If `main` has advanced, inspect the intervening tracked changes. If any touch `src/App.tsx`, `src/styles.css`, the cloze runner, or otherwise conflict with this accepted line, stop for owner disposition rather than rebasing/cherry-picking/reconciling silently. If advancement is demonstrably unrelated and a clean linear integration is still possible, document it precisely.

Perform integration work in an isolated integration worktree/branch. Never stage, move, delete, stash, clean, reset, or inspect the contents of unrelated owner untracked material, especially `audit/gemini-p27-content-judgment-requalification-2026-09-13-r2/`.

## 3. Integration mechanics

Preserve the accepted commit/evidence chain and object identities. Do not squash or rewrite `3cb99e6` or the evidence commits.

When current `main == 642b0f9...`:

- create a clean isolated integration checkout from current main;
- fast-forward it to accepted tip `c521637...`;
- verify the resulting tree is byte-identical to the accepted producer tip before publication-only edits;
- perform only the publication edits authorized below.

Publication-only edits after accepted-tip equivalence:

1. Add `audit/mobile-dropdown-cloze-overflow-r1/integration/integration-receipt.md`.
2. Update `PROJECT-HISTORY.md` with a concise Sep 16 milestone closing the mobile dropdown-cloze overflow commission.

The history entry must state, without overclaiming:

- the original 320 px root overflow was independently reproduced and repaired;
- accepted production is `3cb99e6...` and accepted evidence tip is `c521637...`;
- the native select remains the answer input and a neutral wrapping selected-option readout was added;
- the final causal containment gate distinguishes the inherited full-bleed shell extent from cloze-added overflow;
- producer and independent checker reproduced baseline red / candidate green, including `file://` compatibility;
- the calculator overlap remains a separate pending commission and is **not** closed by this milestone;
- no bank/schema/grading/storage semantics changed.

Do not add the owner-side untracked work-order files themselves to Git unless an existing repository convention or explicit owner instruction requires it. Their hashes and paths may be cited in the integration receipt.

## 4. Integration verification

First prove equivalence of the integration tree to accepted tip before publication-only edits. After the history/receipt commit, prove the only additional tree changes relative to accepted tip are exactly `PROJECT-HISTORY.md` and `audit/mobile-dropdown-cloze-overflow-r1/integration/**`.

Run the integration floor from the integrated tree:

```bash
npx tsc -b --pretty false
npm run test:grading
npm run test:case-completeness
npm run test:exam-layout
npm run test:session-navigation
npm run build
git diff --check
```

Run one focused final candidate browser smoke with the corrected runner against the integrated build over HTTP and one against the final `file://` artifact, using fresh task-owned integration output directories and the existing external Playwright installation. The accepted baseline red does not need to be rerun again unless integration-tree equivalence fails or a new concrete concern appears.

Require:

- root containment remains green at the pinned 320 px witness;
- selected readout remains present/readable;
- no new browser warning/error beyond the already admitted narrow `file://` manifest diagnostic, if emitted;
- integration/browser evidence does not overwrite producer evidence.

No census regeneration is required because no bank/census inputs change. Do not broaden into the learner-shell matrix without a new concrete concern.

## 5. Receipt

Write the integration receipt with:

- owner main/base and accepted branch identities;
- integration method (fast-forward or otherwise, with justification);
- accepted production/evidence/runner/authority hashes;
- proof that accepted production/evidence history was preserved without rewrite;
- pre-publication accepted-tip tree equivalence;
- exact publication-only changed-file list;
- verification commands/results;
- final HTTP and `file://` smoke results;
- final `main` SHA before push and after publication commit;
- owner default-checkout preservation statement;
- explicit statement that calculator R3 remains pending and becomes eligible only after this integrated/published main is established.

## 6. Publication / push authority

After all integration gates pass, this order authorizes publication to `main` and `origin/main` **without force**.

Because the owner default checkout contains extensive unrelated untracked material, do not move integration files through it or perform cleanup there. Use a safe Git fast-forward/update strategy that preserves those untracked files. Before pushing, verify the intended `main` tip and that no unrelated tracked commit entered the line.

Push only the accepted integrated line plus the publication receipt/history commit. Do not push P27 or other owner-side untracked files.

After push, verify local `main` and `origin/main` resolve to the same final full SHA. Report that exact SHA: it becomes the required `EXECUTION_BASE` for the separately accepted calculator R3 work order.

Do **not** start calculator implementation in this same commission.

## 7. Terminal

Success:

`PROJECT_SHRIMP_MOBILE_CLOZE_R1_INTEGRATED_PUBLISHED`

Return:

- final local/remote `main` SHA;
- integration method;
- publication commit SHA;
- integration receipt path;
- final verification summary;
- confirmation that owner/P27 untracked material was untouched;
- confirmation calculator work was not started.

Block on any identity mismatch, relevant `main` advancement, accepted-tip equivalence failure, verification failure, unsafe owner-checkout update, or push divergence:

`PROJECT_SHRIMP_MOBILE_CLOZE_R1_INTEGRATION_BLOCKED`

Preserve all worktrees/evidence and report the smallest exact blocker.