# Learner Shell R3 Concept A integration receipt

**Status:** mechanical integration complete; ready for the independent final gate

**Date:** 2026-09-16

**Work-order SHA-256:** `c0c8a12e117ac5da3a74cceca04698c0364dd2b77ac9c128136f0fa02b27256d` (matched before action)

**Integration branch:** `codex/learner-shell-r3-concept-a-integration`

**Integration worktree:** `/Users/holemini/Desktop/Project Shrimp Learner Shell R3 Integration`

**Current-`main` integration base:** `f30224ec156984cebf64c1ef28802d2f02c6dcd1`

**Final integration no-fast-forward merge commit:** `2082ee3142d1a4dde4d0292f2d006e3fa2082d5b`

The receipt and `PROJECT-HISTORY.md` entry are committed after the merge as bookkeeping only. They do not modify the accepted production files. The resulting branch-tip bookkeeping commit is reported at handoff because a commit cannot contain its own SHA.

## Accepted lineage and roles

| Role | Commit |
|---|---|
| Frozen baseline | `511f66b7b7cb830649613793f0264725be25d450` |
| Accepted implementation | `d581a66ff1a784d10e65b1b139d78c41851d45fa` |
| Producer evidence | `154d8520fcb0f183472994424acd42cdb64b817f` |
| Independent review artifact and accepted review tip | `6ae35a65a584c5ed8be3df5e3fc0cad5603b8693` |

Git-object inspection confirmed the exact linear parent chain `511f66b` → `d581a66` → `154d852` → `6ae35a6`; `git log --oneline 511f66b..6ae35a6` contained exactly those three accepted commits. The lineage diff contains only `src/App.tsx`, `src/styles.css`, and `audit/learner-shell-r3-concept-a-r1/**`.

## Preflight overlap result

`511f66b` is an ancestor of current `main`. `git log --oneline 511f66b..main -- src/App.tsx src/styles.css` returned no commits.

| Path | Blob at `511f66b` | Blob at live `main` | Result |
|---|---|---|---|
| `src/App.tsx` | `12959d80f82b1a17ec348b5a60a72c774e73ba45` | `12959d80f82b1a17ec348b5a60a72c774e73ba45` | equal; no overlap |
| `src/styles.css` | `574d3d367dfae501bc1e36ad836881f97194f12c` | `574d3d367dfae501bc1e36ad836881f97194f12c` | equal; no overlap |

The prohibited-overlap stop condition did not occur.

## Integration method and inventory

The accepted branch was integrated with:

```text
git merge --no-ff claude/learner-shell-r3-concept-a-r1-review
```

The merge completed with the `ort` strategy. **No conflict resolution occurred.** No accepted commit was squashed, rebased, amended, or rewritten. The merge commit has first parent `f30224ec156984cebf64c1ef28802d2f02c6dcd1` and second parent `6ae35a65a584c5ed8be3df5e3fc0cad5603b8693`.

Relative to live `main`, the merge introduces 174 paths: the two task-owned production paths plus 172 accepted evidence/review paths under `audit/learner-shell-r3-concept-a-r1/**`. This integration seat added only `PROJECT-HISTORY.md` and the integration evidence under `audit/learner-shell-r3-concept-a-r1/integration/**`. It did not edit `src/App.tsx` or `src/styles.css`.

## Exact-equivalence and protected-path proof

| Path | Integrated blob | Integrated SHA-256 | Expected |
|---|---|---|---|
| `src/App.tsx` | `8eac13d0b4f7f2631501e20c1ac5d285b7359010` | `2bc7f80ffd45ef20f9fc0ea52eaa5034011b8596de34d69c69e73dbad2590d6a` | exact match |
| `src/styles.css` | `e95d261bc5713fac990ebc2bda4ef9320a521db7` | `37f81e2826950bb1ab8c2a3351e8c4ddfcfb30642f92aec7f03b7695c0658708` | exact match |

The following objects are identical between live `main` and the integrated merge result:

| Path | Object ID at both revisions |
|---|---|
| `banks/**` tree | `6b360f953d7c1db4121f0cac5f2d24f056c44933` |
| `package.json` | `bfe7124f6d2c5c2ac5a60cb03e300e76a84bcf3b` |
| `package-lock.json` | `619990b540ab51fe2340645847afe04208589c2c` |
| `src/storage.ts` | `e00acd25cc24450f7b1992df45cbfca44a76e5ee` |
| `src/progressMigration.ts` | `cdb0b3988adea324b05c04f735050e87547a389b` |
| `src/sessionSampler.ts` | `deeea8a07c4b5c1969bf9b28c0e02a7b5d444bd3` |
| `src/grading.ts` | `9b8b4ffcc2ac85030d1daeab329a19f9bbbe5bb2` |
| `src/schema.ts` | `8295463e6c531043c2c7a4637b1d879db9e0d3fa` |
| `src/visuals/**` tree | `21bbf306093d01031fcf89064cec01ccc47657cd` |

No bank, census, dependency, schema, storage, grading, sampler, or visual-renderer change was made. Census generation and census checking were not run because no census movement was expected or observed.

## Deterministic integration floor

All commands ran in the isolated integration worktree after the no-fast-forward merge. Every command exited `0`; the build left no tracked-file drift.

| Command | Exit | Full log | Exit record |
|---|---:|---|---|
| `npx tsc -b --pretty false` | 0 | `integration/logs/01-tsc.log` | `integration/logs/01-tsc.exit` |
| `npm run test:review-memory` | 0 | `integration/logs/02-review-memory.log` | `integration/logs/02-review-memory.exit` |
| `npm run test:session-start-guard` | 0 | `integration/logs/03-session-start-guard.log` | `integration/logs/03-session-start-guard.exit` |
| `npm run test:session-navigation` | 0 | `integration/logs/04-session-navigation.log` | `integration/logs/04-session-navigation.exit` |
| `npm run test:session-sampler` | 0 | `integration/logs/05-session-sampler.log` | `integration/logs/05-session-sampler.exit` |
| `npm run test:exam-layout` | 0 | `integration/logs/06-exam-layout.log` | `integration/logs/06-exam-layout.exit` |
| `npm run test:calculator` | 0 | `integration/logs/07-calculator.log` | `integration/logs/07-calculator.exit` |
| `npm run test:app-update` | 0 | `integration/logs/08-app-update.log` | `integration/logs/08-app-update.exit` |
| `npm run build` | 0 | `integration/logs/09-build.log` | `integration/logs/09-build.exit` |
| `git diff --check` | 0 | `integration/logs/10-git-diff-check.log` | `integration/logs/10-git-diff-check.exit` |

## Focused Chrome integration smoke

Final runner exit: `0`. Raw matrix and measurements: `integration/focused-browser-smoke-results.json`. Full console output: `integration/focused-browser-smoke.log`. Runner: `integration/focused-browser-smoke.mjs`.

Transport was system Google Chrome 152 through Playwright, headless, with normal web security and disposable persistent profiles. The HTTP and `file://` profiles were separate. The smoke did not repeat the accepted 30+ scenario review.

| Scenario | Viewport | Theme | Text | Transport | Result |
|---|---|---|---|---|---|
| Desktop Study root | 1440×900 | light | Default | `http:` | PASS |
| Mobile Study root; exactly Study / Library / Progress | 390×844 | light | Default | `http:` | PASS |
| Active Study; learner bottom navigation absent | 390×844 | light | Default | `http:` | PASS |
| Calculator launch, `2 + 3 = 5`, minimize/close | 390×844 | light | Default | `http:` | PASS |
| Normal option submit → `.response-status` → rationale → Next | 390×844 | light | Default | `http:` | PASS |
| Protected-session replacement dialog; safe initial focus | 390×844 | light | Default | `http:` | PASS |
| Escape and `Keep current set` preserve full active-session snapshot and return focus | 390×844 | light | Default | `http:` | PASS |
| Saved memory surface from persisted flag | 390×844 | light | Default | `http:` | PASS |
| Production Large text Study root, no root overflow | 390×844 | light | Large | `http:` | PASS |
| Final production artifact loads and navigates Library → Progress → Study | 390×844 | light | Default | `file:` | PASS |

The final `file://` artifact was `dist/index.html` with SHA-256 `b709547252c03c1c3e763dd8816c1093b616cc5ffccf0565a0eeb9d48c7a7e31`. Application load and navigation passed. Chrome emitted only the `manifest.webmanifest` `file://` CORS diagnostic plus its paired `net::ERR_FAILED`; the accepted artifacts already identify this structurally inherited path and no module, script, style, or navigation failure occurred.

### Deferred inherited defects

The two accepted inherited defects remain outside this commission and were not repaired:

- Mobile `dropdown_cloze` horizontal overflow remained observable at 320×740 (`scrollWidth` 1302, `innerWidth` 320).
- The mobile calculator sheet remained overlapped with the Submit control (43.59 px vertical intersection in the focused measurement).

These observations are not new acceptance findings. The exact production blob/hash identity above proves the integration did not create or worsen either behavior relative to the independently accepted candidate. Separate narrow commissions remain required for any repair.

## Default-owner-worktree preservation

The default checkout stayed at `f30224ec156984cebf64c1ef28802d2f02c6dcd1` and had zero tracked status entries at both the start and closeout measurement. Its untracked inventory grew concurrently from 452 entries (442 in the P27 lane) to 538 entries (528 in the P27 lane); all 86 new entries were under `audit/gemini-p27-content-judgment-requalification-2026-09-13-r2/`. The integration seat did not create, edit, stage, move, delete, stash, clean, reset, or otherwise touch the P27 lane or any other default-checkout material.

## Delegation disclosure

No work was delegated. The Codex integration executor (work-order-assigned model: GPT-5.6 Sol) directly performed the mechanical lineage/overlap proof, no-fast-forward merge, exact-equivalence proof, deterministic floor, focused Chrome smoke, and bookkeeping. The previously accepted implementation/evidence was produced by the accepted producer lineage, and independent acceptance was supplied by the Claude review seat at `6ae35a6`; this integration seat did not redo that review.

`PROJECT_SHRIMP_LEARNER_SHELL_R3_CONCEPT_A_INTEGRATION_READY_FOR_FINAL_GATE`
