# Verification — June 13 Matrix Swap Regression Repair

## Opening and pre-edit evidence

- Disk snapshot: isolated worktree `/Users/holemini/Desktop/shrimp-matrix-swap-repair-2026-08-25`.
- Branch: `codex/june13-matrix-swap-regression-repair-2026-08-25`.
- Base: `3c33c03afc6bb06ab1f98cc772b13cae274f55a8` (`main` at opening).
- Origin relation at opening: `main...origin/main [ahead 7]`.
- Oracle: `91ab960^` = `b3a68e890988ca7155dcc8113881b3a36ddf6826`.
- Origin defect: `91ab9606269d4e5a82b4bf613234c06db5830276`.
- Pinned work-order SHA-256: `368ff78f4420482f24331aeca05a767c55119bd219c43ef8917cf337b9543cd7`.
- Preflight artifact SHA-256, captured before the bank edit: `6933e048f7ad797c0b443d5cac12715322d11c75c94505739e18e4b0806f4158`.
- Pre-repair `banks/gpt-canonical.json` SHA-256: `fe7fdc516f922a4acb6fe589311e8c852dc4ab3fe5dba7e5a780fa1aba32cb0b`.
- Deterministic patch script SHA-256 before execution: `0624734de3e5d46f60c7a26dc386f94ab54f8aac4a61b7d13b241b6c5bd5aa69`.
- Preflight parse assertions: 8 rows, 8 unique IDs, all `swapRegressionReproduced=true`, all `safeToRestore=true`, and all oracle SHAs exact.

The preflight artifact was finalized and hashed before the canonical bank was edited.

## Forensic source package copy hashes

| File | SHA-256 |
|---|---|
| `forensic-review/SEAL.md` | `707704b64a03c6f98d72957c856fbce59d2306921a00d4b8e16dcc4c146d656b` |
| `forensic-review/00-opening-receipt.md` | `3a40938b9a84ab6ebb4b41e872d5eaefee91494da9741ad283dffb90d3fd88d0` |
| `forensic-review/01-independent-reconstruction.md` | `f84e4cc4b98002fc395b38760ab81e47781815dd9a92697c727fa3976b33299d` |
| `forensic-review/02-git-and-repair-history.md` | `e2c005f32a1d91045d5c19b69603a093d5e39982d2beb53af63681b9173e2c9b` |
| `forensic-review/03-audit-workflow-analysis.md` | `435d516177c69521533c416e9651bec4673fc66a22b2e607f8e41ae57d0bb1f4` |
| `forensic-review/04-post-reveal-comparison.md` | `19cdb9f9f56d26110de16f5be6cedf97a82966b21ee806a8c9e371c39528d6d7` |
| `forensic-review/final-memo.md` | `531ac81395bb695ba4559a8867fdddf9f98616bb664ef296ae70b93bfad97bcb` |
| `forensic-review/receipt.md` | `42d75ee31c9e3f049145aeef6d0f39eacbc42d60f40ac90010e88658572d04c0` |

All source/destination `cmp` checks passed. The four sealed payload hashes and byte sizes match `SEAL.md`; the external source package was not modified.

## Primary-worktree isolation baseline

- Primary HEAD: `3c33c03afc6bb06ab1f98cc772b13cae274f55a8`, branch `main`, `+7/-0` relative to `origin/main`.
- Primary tracked and staged binary-diff stream SHA-256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` (empty).
- Only primary untracked path: `audit/standalone-bowtie-answerability-census-2026-08-23/`.
- Bow-tie audit baseline: 394 files, 4,384,130 bytes, sorted file-content manifest SHA-256 `0736bd7b3d85590bce1e1a9d5a18cfe1a98547b15a4944fbcd39946150f23980`.

## Post-edit machine assertions

- `AUTHORIZED_EIGHT_COLUMNIDS_ONLY`: PASS.
- GPT scored-leaf count before/after: 1,025 / 1,025.
- Changed scored leaves: exactly 8, equal to the authorized ID set.
- Root JSON changed scalar paths: exactly 40; each is one target's `correct[0..4].columnIds[0]`.
- All eight post-repair `correct` arrays exactly equal the `b3a68e8` oracle arrays.
- All non-`correct` fields on the eight target leaves are JSON-value-identical to the pre-repair base.
- No ninth scored leaf changed.
- Pre-repair bank SHA-256: `fe7fdc516f922a4acb6fe589311e8c852dc4ab3fe5dba7e5a780fa1aba32cb0b`.
- Post-repair bank SHA-256: `be83c943bbe6e50297de94d25b596069767b8fee876426ec798dc66ca8d5a76d`.
- Exact-precondition retry: expected exit 1 on the first already-restored `before` mismatch; bank hash remained `be83c943bbe6e50297de94d25b596069767b8fee876426ec798dc66ca8d5a76d`, proving fail-closed behavior with no second write.
- `git diff --check`: PASS.
- Protected-path diff check: `census.json`, `BANK-CENSUS.md`, `PROJECT-HISTORY.md`, `DECISIONS.md`, `scripts/patch-matrix.py`, `banks/gemini-canonical.json`, and `banks/io-canonical.json` unchanged.
- Forensic copy `cmp` recheck: PASS for all eight files.
- Primary-worktree final recheck equals baseline: HEAD/branch/ahead state unchanged, tracked+staged diff stream remains the empty SHA-256, and the bow-tie tree remains 394 files / 4,384,130 bytes / manifest SHA-256 `0736bd7b3d85590bce1e1a9d5a18cfe1a98547b15a4944fbcd39946150f23980`.

## Required commands

- Guarded canonical patch with exact required `--allow-canonical` reason and `--strict-parity`: PASS; 8 FIX operations, 760→760 top-level questions, in-process and disk-reread validation PASS, no parity warnings.
- `npm run validate-bank -- banks/*.json`: PASS; 13/13 bundled banks.
- `npm run audit`: exit 0. Structural validation, references, positions, IDs, producer vocabulary, and authorial-constraint gates passed. `audit:integrity` reported the expected `INSUFFICIENT` because no raw draft directory exists; Tier 2 repeated the established 451 `revealsAllStages` advisories.
- `npm run test:grading`: PASS; this regression suite exercises matrix `single_per_row` and `multiple_per_row` scoring.
- `npm run test:schema-bank`: PASS.
- `npm run test:audit-integrity`: PASS.
- `npm run test:audit-ids`: PASS.
- `npm run test:presentation-normalization`: PASS.
- `npm run test:case-completeness`: PASS.
- `npm run test:audit-references`: PASS.
- `npm run coverage-report`: PASS; 1,930 session units, 2,516 scored leaves, 340 matrix leaves, 199 visual artifacts.
- `npm run census:check`: PASS (`census.json is up to date`); no regeneration performed.
- `npx tsc -b --pretty false`: PASS.
- `npm run build`: PASS; 1,654 modules transformed, file-compatible build generated, build identity validated. The existing chunk-size advisory was non-blocking.

## Final hashes

| Artifact | SHA-256 |
|---|---|
| `repair-preflight.jsonl` | `6933e048f7ad797c0b443d5cac12715322d11c75c94505739e18e4b0806f4158` |
| `FORENSIC-REVIEW-MANIFEST.md` | `39ff76193cb7d481e93d5cea2e5b0bab0e6dd4f1f1f339c40a59e2814057977a` |
| `no-op-target-review.md` | `b1ca8189aa4261f494462214b7d936aff90861baa8793bd93a1ecb95b2e3cde9` |
| `repair-report.md` | `c119e86241a6c772027d218f4bec5094117d4abb24854e0264154667c52bc68b` |
| `scripts/patches/2026-08-25-june13-matrix-swap-regression-repair.ts` | `0624734de3e5d46f60c7a26dc386f94ab54f8aac4a61b7d13b241b6c5bd5aa69` |
| `banks/gpt-canonical.json` before | `fe7fdc516f922a4acb6fe589311e8c852dc4ab3fe5dba7e5a780fa1aba32cb0b` |
| `banks/gpt-canonical.json` after | `be83c943bbe6e50297de94d25b596069767b8fee876426ec798dc66ca8d5a76d` |
`verification.md` does not claim a self-hash. All other final reports and task-owned evidence are hashed above or in the forensic-copy table.
