# Project Shrimp — Learner Shell R3 Concept A Mechanical Integration Work Order

**Implementation seat:** Codex / integration executor
**Model:** GPT-5.6 Sol
**Reasoning effort:** high
**Independent review:** Claude (architect seat) performs the final gate per the owner handoff; the learner-shell change itself is already independently accepted and is NOT reopened by this order
**Date:** 2026-09-16
**Mode:** Mechanical integration + integration smoke + bookkeeping. No repair, no redesign, no re-review.

**Terminal on success:** `PROJECT_SHRIMP_LEARNER_SHELL_R3_CONCEPT_A_INTEGRATION_READY_FOR_FINAL_GATE`
**Terminal on prohibited overlap:** `PROJECT_SHRIMP_LEARNER_SHELL_R3_INTEGRATION_BLOCKED_OVERLAP`

---

## 0. Purpose and standing

Integrate an **already independently accepted** learner-shell change onto current `main`. The design, behavior, and accessibility of this change have been reviewed and accepted. Your job is to move accepted history onto `main` without altering it, prove mechanically that nothing changed in transit, run an integration smoke, and write the bookkeeping.

This is **not** a second review. Do not re-audit the shell design, re-derive invariance, re-run the independent browser matrix, or reopen closed findings.

Read `AGENTS.md` first. This order is subordinate to it.

## 1. Accepted lineage — established by the architect seat, authoritative

Do not infer commit roles from abbreviated hashes. The lineage below was verified from git objects by the architect seat and is the authority for this order. Re-verify it mechanically (§3.1); do not re-derive it by guesswork.

| Role | Commit | Contents |
|---|---|---|
| Frozen baseline | `511f66b7b7cb830649613793f0264725be25d450` | pre-change baseline; an ancestor of current `main` |
| Accepted implementation | `d581a66ff1a784d10e65b1b139d78c41851d45fa` | the production change |
| Producer evidence | `154d8520fcb0f183472994424acd42cdb64b817f` | evidence-only (36 paths, all task audit) |
| Independent review artifact | `6ae35a65a584c5ed8be3df5e3fc0cad5603b8693` | review-only; **accepted producer tip is `154d852`**, this sits on top |

Lineage is **linear**: `511f66b → d581a66 → 154d852 → 6ae35a6`. Branch holding it: `claude/learner-shell-r3-concept-a-r1-review`, worktree `/Users/holemini/Desktop/Project Shrimp Learner Shell R3 Review`.

**Task-owned production paths (exactly two):**

- `src/App.tsx`
- `src/styles.css`

Everything else in the lineage is under `audit/learner-shell-r3-concept-a-r1/`.

**Governing frozen implementation order** (owner-side, untracked, read-only):
`/Users/holemini/Desktop/Project Shrimp/LEARNER-SHELL-R3-CONCEPT-A-IMPLEMENTATION-WORK-ORDER-2026-09-13.md`
SHA-256 `521c5af27b13a774c75146c2431f210d47bea35161d44dba96d2f986b8c8e884`.

**Independent review artifact** (read for context, do not modify):
`audit/learner-shell-r3-concept-a-r1/independent-review/independent-review.md` at `6ae35a6`.

## 2. Isolation

1. Record `git -C "/Users/holemini/Desktop/Project Shrimp" rev-parse HEAD` and `git status --porcelain=v1 --untracked-files=all` before anything else. Re-record at closeout and confirm HEAD is unchanged and **no tracked file was modified**.
2. The owner/default checkout carries ~400 untracked entries of unrelated concurrent work, especially under `audit/gemini-p27-content-judgment-requalification-2026-09-13-r2/`. **Untouchable.** Never stage, edit, move, delete, stash, clean, or reset anything there. Expect that lane to keep adding untracked files while you work; new untracked entries under that path are normal and are not your doing.
3. Do **not** use the default checkout as your integration worktree. Create a new isolated worktree on a new branch based on **current live `main`**, e.g.
   `git worktree add -b codex/learner-shell-r3-concept-a-integration "/Users/holemini/Desktop/Project Shrimp Learner Shell R3 Integration" main`
4. `npm ci` in that worktree. Do not modify `package.json` or `package-lock.json`.
5. Remove any throwaway worktree you create with `git worktree remove`, never `rm -rf`.

## 3. Preflight — prove the integration can remain mechanical

Complete **all** of §3 before merging anything.

### 3.1 Confirm lineage

Prove from git objects: `6ae35a6`'s parent is `154d852`; `154d852`'s parent is `d581a66`; `d581a66`'s parent is `511f66b`; and `git log --oneline 511f66b..6ae35a6` yields exactly those three commits and no others. Confirm `git diff --name-only 511f66b 6ae35a6` yields only `src/App.tsx`, `src/styles.css`, and paths under `audit/learner-shell-r3-concept-a-r1/`.

Record the integration base: the exact `main` SHA you branched from.

### 3.2 Prove no prohibited overlap

1. Confirm `511f66b` is an ancestor of current `main` (`git merge-base --is-ancestor`).
2. List every post-baseline commit on `main` touching a task-owned production path:
   `git log --oneline 511f66b..main -- src/App.tsx src/styles.css`
3. Compare blob IDs for both task-owned paths at `511f66b` and at `main`.

The architect seat measured the following at handoff. Confirm, do not assume:

| Path | blob @ `511f66b` | blob @ `main` |
|---|---|---|
| `src/App.tsx` | `12959d80f82b1a17ec348b5a60a72c774e73ba45` | `12959d80f82b1a17ec348b5a60a72c774e73ba45` |
| `src/styles.css` | `574d3d367dfae501bc1e36ad836881f97194f12c` | `574d3d367dfae501bc1e36ad836881f97194f12c` |

Equal blobs on both paths ⇒ **zero intervening production change** ⇒ the merge is mechanical.

### 3.3 Stop condition

If **any** of the following is true — a task-owned production path has materially overlapping post-baseline work on `main`; the blob comparison in §3.2 differs from the table; or any merge/cherry-pick reports a conflict:

**STOP. DO NOT RESOLVE IT. DO NOT ADAPT ANY HUNK.**

Leave the worktree in place for inspection and return
`PROJECT_SHRIMP_LEARNER_SHELL_R3_INTEGRATION_BLOCKED_OVERLAP`
with the exact overlapping paths, commits, and hunks for architect/owner adjudication.

A conflict-free mechanical application is authorized. A new implementation pass is not.

## 4. Integration method

Preserve provenance. **Do not squash, rebase, amend, or rewrite** the accepted producer/reviewer commits.

Preferred method, given §3.1 proved the branch contains exactly the accepted lineage and nothing unrelated:

```
git merge --no-ff claude/learner-shell-r3-concept-a-r1-review
```

into your integration branch. A no-fast-forward merge commit is expected and wanted; it keeps `d581a66`, `154d852`, and `6ae35a6` intact and attributable.

If the merge requires **any** conflict resolution, that is the §3.3 stop condition — stop, do not resolve.

State explicitly in the receipt that no conflict resolution occurred.

## 5. Exact-equivalence proof

Prove the integrated learner-shell result **is** the already-reviewed result, not a derivative.

Because §3.2 establishes `main` had no intervening change to either task-owned path, the integrated content of both files must be **byte-identical to the accepted candidate**. Expected values, measured by the architect seat:

| Path | integrated blob must equal | SHA-256 of content |
|---|---|---|
| `src/App.tsx` | `8eac13d0b4f7f2631501e20c1ac5d285b7359010` | `2bc7f80ffd45ef20f9fc0ea52eaa5034011b8596de34d69c69e73dbad2590d6a` |
| `src/styles.css` | `e95d261bc5713fac990ebc2bda4ef9320a521db7` | `37f81e2826950bb1ab8c2a3351e8c4ddfcfb30642f92aec7f03b7695c0658708` |

Any deviation is a **stop condition** — report it, do not "fix" it.

Also prove, on the integration result:

- no bank file changed by this integration (`banks/**` tree object equals `main`'s);
- no package dependency changed (`package.json`, `package-lock.json` equal `main`'s);
- `src/storage.ts`, `src/progressMigration.ts`, `src/sessionSampler.ts`, `src/grading.ts`, `src/schema.ts`, and `src/visuals/**` are unaffected **by this integration** — i.e. they equal current `main`, which already legitimately contains unrelated post-baseline work such as the burn-map refinement in `f30224e`. Compare against `main`, **not** against `511f66b`, for these paths.

Do **not** regenerate census or bank artifacts. No census movement is expected; if `npm run census:check` is run at all and reports drift, that is blocking evidence to report, not permission to regenerate.

## 6. Deterministic integration floor

Run in the integration worktree, capturing exit code and full output for each:

```bash
npx tsc -b --pretty false
npm run test:review-memory
npm run test:session-start-guard
npm run test:session-navigation
npm run test:session-sampler
npm run test:exam-layout
npm run test:calculator
npm run test:app-update
npm run build
git diff --check
```

This is an integration smoke, not a second design review. After `npm run build`, confirm no tracked-file drift outside expected build output.

## 7. Focused browser smoke

Real Chrome (system Google Chrome, normal web security, disposable profile). Purpose: detect **post-baseline interaction regressions**, nothing more. Record viewport, theme, text size, transport, result.

Cover:

- desktop Study root;
- mobile Study root with exactly Study / Library / Progress;
- active Study with the learner bottom nav absent;
- resumable-session replacement dialog;
- `Keep current set` and Escape-cancel both preserving the active session;
- replacement-dialog focus return to the originating control;
- one normal submit → rationale → next flow;
- one memory surface;
- production Large text;
- mobile calculator launch / use / close;
- final `file://` build load and navigation.

**Two environment facts that will otherwise cost you a wasted run** (established during the independent review):

1. Dark mode is driven **only** by `data-theme`, set from the persisted `themeMode` setting. There is no `prefers-color-scheme` rule in `src/styles.css`. A Playwright `colorScheme: "dark"` context renders **light**. Seed `localStorage["nclex-settings"]` with `themeMode: "dark"` and reload if you test dark.
2. The replacement dialog only appears for a **protected** session. `hasProtectedSession` (`src/sessionStartGuard.ts`) requires a recorded result, draft answer, or skip; an untouched set is replaced directly with no dialog. Submit an answer or use "Skip for now" before attempting a replacement.

Also note: answer options are `.option-row` elements, not `<button>`/`<input>`; correctness after submit reads from `.response-status`.

For the two inherited defects below, **confirm only that integration did not worsen or newly create them**. Their continued existence is explicitly not a blocker and you must not repair them:

- mobile `dropdown_cloze` horizontal overflow;
- calculator sheet overlapping the Submit control.

Do not repeat the original 30+ scenario independent review unless a genuinely new discrepancy appears.

## 8. Bookkeeping

### 8.1 `PROJECT-HISTORY.md`

Add the accepted learner-shell milestone. Factual and concise. It must record:

- that Concept A learner shell is integrated onto `main` from an independently accepted producer pass;
- independent acceptance by the Claude review seat, citing the review artifact path and commit `6ae35a6`;
- that two inherited, pre-existing defects (mobile `dropdown_cloze` horizontal overflow; calculator sheet / Submit overlap) are **deferred, outside this commission**, and awaiting separate narrow commissions.

**Do not alter any schema or version claim.** Do not restate facts another document owns.

### 8.2 Integration receipt

Write `audit/learner-shell-r3-concept-a-r1/integration/integration-receipt.md` containing:

- current-`main` integration base SHA;
- exact accepted producer/reviewer commits and their roles;
- integration branch and worktree;
- preflight overlap result, with the blob comparison;
- integration method;
- **explicit statement that no conflict resolution occurred**;
- changed-file inventory for the integration;
- exact-equivalence / hash proof (§5);
- deterministic results, each with exit code and log path;
- focused browser matrix;
- `file://` result;
- default-owner-worktree preservation statement (HEAD unchanged, no tracked modification, P27 and other untracked material untouched);
- deferred-defect note;
- final integration commit SHA;
- delegation disclosure by seat/model and role.

Commit the receipt and the history entry on the integration branch.

## 9. Prohibited without a new owner instruction

- resolving any merge/cherry-pick conflict (stop instead);
- modifying, rebasing, amending, squashing or rewriting the accepted producer or reviewer commits;
- editing `src/App.tsx` or `src/styles.css` in any way;
- repairing the two deferred inherited defects, or any other learner-shell behavior;
- touching the owner/default checkout's tracked or untracked files, including the P27 lane;
- merging to or pushing `main`, pushing any branch, or force-pushing — **publication is a separate gated step**;
- deploying GitHub Pages — **not authorized by this handoff**;
- regenerating census or bank artifacts;
- changing dependencies;
- altering schema/storage/grading/sampler semantics;
- editing the frozen implementation work order or the independent-review artifact.

## 10. Return

Stop after the integration commit, verification, and receipt. Do not push. Return exactly one terminal:

```
PROJECT_SHRIMP_LEARNER_SHELL_R3_CONCEPT_A_INTEGRATION_READY_FOR_FINAL_GATE
```

or

```
PROJECT_SHRIMP_LEARNER_SHELL_R3_INTEGRATION_BLOCKED_OVERLAP
```

Report the integration branch, integration base, final integration commit, deterministic results, browser matrix summary, and the receipt path.

SEND TO: Codex — GPT-5.6 Sol — high
