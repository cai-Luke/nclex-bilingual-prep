# Phase A Seal

Sealed at: **2026-08-25T15:21:37Z** (UTC, `date -u` on the operator host, run immediately after computing the hashes below).

Writing order (all four files were authored and finalized in this order, before this SEAL.md was written, and before any candidate report or prior-Claude forensic package file was opened):

1. `00-opening-receipt.md`
2. `01-independent-eight-target-review.jsonl`
3. `02-independent-scope-diff.md`
4. `03-independent-no-op-review.md`

## Payload hashes (SHA-256) and byte sizes

| File | Bytes | SHA-256 |
|---|---|---|
| `00-opening-receipt.md` | 3693 | `6bd80f18454add4914e8981bf0a7827f0e1e59e4f3d7bc5471ce73ea279b1991` |
| `01-independent-eight-target-review.jsonl` | 10211 | `9df56397e4daa6e0bbc349a0dbfac9fc46421d0bd88654a99bb338f7c5c39a7a` |
| `02-independent-scope-diff.md` | 8257 | `f508b8d65663b8f3416fa318aa46337dc97519586551a3bc3a973e5d0affe8c7` |
| `03-independent-no-op-review.md` | 4188 | `33d17b6b1e63e1b4de116101ee969ce359d055051650ce5326bd0c86bf08210f` |

Computed with `shasum -a 256 <file>` and `wc -c <file>` on the operator host, run together immediately before this seal was written.

## Contamination status at seal time

**NOT CONTAMINATED.** No file under `audit/june13-matrix-swap-regression-2026-08-25/repair-report.md`, `repair-preflight.jsonl`, `verification.md`, `no-op-target-review.md`, `FORENSIC-REVIEW-MANIFEST.md`, or `audit/june13-matrix-swap-regression-2026-08-25/forensic-review/**` was opened before this seal. Only `scripts/patches/2026-08-25-june13-matrix-swap-regression-repair.ts` was read from the candidate's task-owned artifact set, which is explicitly authorized for Phase A inspection under §2 of the work order.

Phase A is now sealed. The four payload files above must not be edited after this point; any later correction will be an explicitly versioned addendum that preserves the sealed originals.
