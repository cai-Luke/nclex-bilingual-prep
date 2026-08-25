# Opening Receipt — June 13 Matrix Swap Regression, Claude Independent Acceptance

**Seat:** Claude independent acceptance / content-judgment checker
**Runtime identity:** Claude Sonnet 5 (model id `claude-sonnet-5`), running as Claude Code inside a VS Code native extension host.
**Session start (this acceptance task):** work order commissioned 2026-08-25; this receipt authored 2026-08-25T15:19:41Z (UTC, `date -u` on the operator host).

## Governing material read before analysis

- `$HOME/Desktop/Project Shrimp/AGENTS.md` (full)
- `$HOME/Desktop/Project Shrimp/docs/AGENTS-RUNBOOK.md` (full)
- `$HOME/Desktop/Project Shrimp/DECISIONS.md` — P2 (Independent review is scoped to judgment), P5 (Generated is not reviewed, plus the P5 narrowing attachment), P15 (Bank patches are raw-scoped and declarative, plus the P15 application note on declarative field-path ops)
- This work order: `scratch/JUNE13-MATRIX-SWAP-REGRESSION-CLAUDE-INDEPENDENT-ACCEPTANCE-WORK-ORDER-2026-08-25.md`

## Opening repository/worktree state

**Primary repository** (`$HOME/Desktop/Project Shrimp`):
- Branch: `main`
- HEAD: `3c33c03afc6bb06ab1f98cc772b13cae274f55a8`
- Ahead of `origin/main` by: 7 commits (0 behind)
- `git status`: clean except one untracked directory, `audit/standalone-bowtie-answerability-census-2026-08-23/` (pre-existing, unrelated to this task)
- No edits made to this repository during this acceptance task.

**Repair worktree** (`$HOME/Desktop/shrimp-matrix-swap-repair-2026-08-25`):
- Branch: `codex/june13-matrix-swap-regression-repair-2026-08-25`
- HEAD: `e23962e7d81540421ab178e3e90d4dce77d21804`
- `git status`: clean ("nothing to commit, working tree clean")
- `git log --oneline 3c33c03a..e23962e7`: exactly one commit, `e23962e fix(bank): restore June 13 matrix answer mappings`
- Confirmed `3c33c03a` is an ancestor of `e23962e7` (linear single-commit repair on top of the exact stated base).
- No edits made to this worktree during this acceptance task.

## Candidate identity confirmed

- Base commit: `3c33c03afc6bb06ab1f98cc772b13cae274f55a8` — matches primary repo HEAD at commission time.
- Candidate commit: `e23962e7d81540421ab178e3e90d4dce77d21804` — single commit on top of base.
- Historical bad-swap commit: `91ab9606269d4e5a82b4bf613234c06db5830276` — confirmed present as a commit object in the repair worktree.
- Oracle commit: confirmed `91ab9606269d4e5a82b4bf613234c06db5830276^` resolves to `b3a68e890988ca7155dcc8113881b3a36ddf6826` exactly as the work order states.

## Phase A discipline

Before this receipt and the three payload files below were written, the only files opened under `audit/june13-matrix-swap-regression-2026-08-25/` were:
- `scripts/patches/2026-08-25-june13-matrix-swap-regression-repair.ts` (authorized for Phase A inspection)

No file was opened from:
- `audit/june13-matrix-swap-regression-2026-08-25/repair-report.md`
- `audit/june13-matrix-swap-regression-2026-08-25/repair-preflight.jsonl`
- `audit/june13-matrix-swap-regression-2026-08-25/verification.md`
- `audit/june13-matrix-swap-regression-2026-08-25/no-op-target-review.md`
- `audit/june13-matrix-swap-regression-2026-08-25/FORENSIC-REVIEW-MANIFEST.md`
- `audit/june13-matrix-swap-regression-2026-08-25/forensic-review/**` (the copied prior Claude forensic package)

Phase A analysis was performed by extracting the eight target IDs and the two no-op-target IDs directly from `banks/gpt-canonical.json` (base, candidate, and oracle blobs, via `git show`), `banks/gemini-canonical.json`, and `banks/io-canonical.json` using a local Node.js script, and by reading `git diff` output directly. No contamination occurred.

Contamination status: **NOT CONTAMINATED.**
