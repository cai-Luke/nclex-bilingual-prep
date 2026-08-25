# Receipt — June 13 Matrix Swap Regression, Claude Independent Acceptance

## Claude seat/model identity

Claude Sonnet 5 (model id `claude-sonnet-5`), running as Claude Code inside a VS Code native extension host, seated as the independent acceptance / content-judgment checker for this work order.

## Opening repo/worktree state

**Primary repository** (`/Users/holemini/Desktop/Project Shrimp`):
- Branch `main`, HEAD `3c33c03afc6bb06ab1f98cc772b13cae274f55a8`, 7 ahead of `origin/main` / 0 behind.
- Clean except pre-existing untracked `audit/standalone-bowtie-answerability-census-2026-08-23/`.

**Repair worktree** (`$HOME/Desktop/shrimp-matrix-swap-repair-2026-08-25`):
- Branch `codex/june13-matrix-swap-regression-repair-2026-08-25`, HEAD `e23962e7d81540421ab178e3e90d4dce77d21804`.
- Clean ("nothing to commit, working tree clean").

## Final repo/worktree state

**Primary repository:** unchanged — branch `main`, HEAD `3c33c03afc6bb06ab1f98cc772b13cae274f55a8`, 7 ahead / 0 behind, same single pre-existing untracked directory. No edit made.

**Repair worktree:** unchanged tracked state — HEAD still `e23962e7d81540421ab178e3e90d4dce77d21804`, `git diff --stat` empty, `git status` clean. The read-only command-verification pass (`npm run build`, etc.) produced only untracked/gitignored `dist/` output. No repository edit, merge, or push occurred.

## Candidate commit identity

- Base: `3c33c03afc6bb06ab1f98cc772b13cae274f55a8`
- Candidate: `e23962e7d81540421ab178e3e90d4dce77d21804`
- Historical defect: `91ab9606269d4e5a82b4bf613234c06db5830276`
- Oracle: `91ab960^` = `b3a68e890988ca7155dcc8113881b3a36ddf6826` (independently confirmed via `git rev-parse 91ab960^`)

## Phase A seal hashes / time / order

Sealed at **2026-08-25T15:21:37Z** (UTC). Writing order: `00-opening-receipt.md` → `01-independent-eight-target-review.jsonl` → `02-independent-scope-diff.md` → `03-independent-no-op-review.md` → `SEAL.md`.

| File | Bytes | SHA-256 |
|---|---|---|
| `00-opening-receipt.md` | 3693 | `6bd80f18454add4914e8981bf0a7827f0e1e59e4f3d7bc5471ce73ea279b1991` |
| `01-independent-eight-target-review.jsonl` | 10211 | `9df56397e4daa6e0bbc349a0dbfac9fc46421d0bd88654a99bb338f7c5c39a7a` |
| `02-independent-scope-diff.md` | 8257 | `f508b8d65663b8f3416fa318aa46337dc97519586551a3bc3a973e5d0affe8c7` |
| `03-independent-no-op-review.md` | 4188 | `33d17b6b1e63e1b4de116101ee969ce359d055051650ce5326bd0c86bf08210f` |

## First-open time/order for candidate reports and prior forensic package

First opened at **2026-08-25T15:21:57Z** (UTC), 20 seconds after Phase A seal. Opened in one batch (parallel Read calls): `repair-report.md`, `verification.md`, `no-op-target-review.md`, `FORENSIC-REVIEW-MANIFEST.md`, `repair-preflight.jsonl`. The copied `forensic-review/**` prior-Claude package files were verified by hash reproduction (matching `FORENSIC-REVIEW-MANIFEST.md`'s claims) rather than opened in full text, since their content is superseded for acceptance purposes by my own independent Phase A findings and the hash match confirms faithful, unaltered copying.

## Hashes of all acceptance artifacts

| File | Bytes | SHA-256 |
|---|---|---|
| `00-opening-receipt.md` | 3693 | `6bd80f18454add4914e8981bf0a7827f0e1e59e4f3d7bc5471ce73ea279b1991` |
| `01-independent-eight-target-review.jsonl` | 10211 | `9df56397e4daa6e0bbc349a0dbfac9fc46421d0bd88654a99bb338f7c5c39a7a` |
| `02-independent-scope-diff.md` | 8257 | `f508b8d65663b8f3416fa318aa46337dc97519586551a3bc3a973e5d0affe8c7` |
| `03-independent-no-op-review.md` | 4188 | `33d17b6b1e63e1b4de116101ee969ce359d055051650ce5326bd0c86bf08210f` |
| `SEAL.md` | (see below) | (see below) |
| `04-candidate-evidence-audit.md` | 5613 | `9bffb5d98bb9dd56038bac69f8e8e7915c5635866b767942bb65a65545fbbbcb` |
| `05-command-verification.md` | 4623 | `47af43b8c9d6c91d247c05b09fca1baed0b69d97f50fba765e0403e2795fd1b7` |
| `06-final-acceptance-report.md` | 7157 | `f5f7d223ae964a2e1b436b02ef3df2706c535747ef27e2156a8940fa39d53c80` |

`SEAL.md`'s own hash is not self-referential (it hashes the four payload files listed above it); its byte size and content are fixed as written and can be independently reproduced with `shasum -a 256 SEAL.md` against the copy in this directory.

## Contamination status

**NOT CONTAMINATED.** Phase A (independent commit/content review, mutation-scope audit, no-op-target review) was completed and sealed entirely before any candidate report (`repair-report.md`, `repair-preflight.jsonl`, `verification.md`, `no-op-target-review.md`, `FORENSIC-REVIEW-MANIFEST.md`) or the prior-Claude forensic package (`forensic-review/**`) was opened. The only candidate-owned file read during Phase A was `scripts/patches/2026-08-25-june13-matrix-swap-regression-repair.ts`, explicitly authorized for Phase A inspection under work-order §2.

## Terminal token

`JUNE13_MATRIX_SWAP_REGRESSION_REPAIR_ACCEPTED`

## Handoff marker

`READY_FOR_ACCEPTANCE_PUBLICATION_AND_MERGE`
