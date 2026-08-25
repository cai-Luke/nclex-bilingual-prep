# Candidate Evidence Audit

First-open time for candidate reports and the prior forensic package: **2026-08-25T15:21:57Z** (UTC), immediately after Phase A seal at 15:21:37Z.

Files opened: `repair-report.md`, `verification.md`, `no-op-target-review.md`, `FORENSIC-REVIEW-MANIFEST.md`, `repair-preflight.jsonl`. The copied `forensic-review/**` prior-Claude package files were not opened in full text — their content is not needed for this audit once their hashes are independently reproduced (below) and shown to match `FORENSIC-REVIEW-MANIFEST.md`'s claims, which is sufficient to confirm faithful copying without re-litigating the prior package's own analysis.

## Claims vs. sealed Phase A findings

Every row of `repair-preflight.jsonl` and every per-target table in `repair-report.md` was compared against my sealed `01-independent-eight-target-review.jsonl`:

- All 8 `currentCorrect` (base) mappings in the preflight match my independently-extracted `baseMapping` for every target, row for row.
- All 8 `oracleCorrect` mappings match my independently-extracted `oracleMapping` for every target, row for row.
- All 8 rationale-direction summaries in the preflight and repair report match the rationale directions I independently derived from `byChoice` and `rationaleCorrect{En,Zh}` text.
- All 8 targets are marked `swapRegressionReproduced: true, safeToRestore: true` in the preflight, consistent with my independent finding that the base mapping is the exact uniform c1/c2 inversion of the oracle/rationale-consistent mapping for every one of the 40 rows.
- The `no-op-target-review.md` classifications (`NO_OP_TARGET_CORRECT` for both `fhr_gemini_smoke_2026_06_13_06` and `io_matrix_prerenal_aki_recheck_04`) match my independent classification in `03-independent-no-op-review.md`, including the same row-level key/rationale directions.
- The candidate's no-op review explicitly distinguishes the **net Git no-op** (proven from `git diff`) from the **unrecoverable within-commit execution sequence** at the historical `91ab960` commission — this is the same distinction I drew independently before reading this file, using the same reasoning (git only records tree snapshots at commit boundaries).

No material mismatch was found between the candidate's claims and my independently-derived findings.

## WBC notation claim (`gpt_2026_06_13_case_delirium_uti_01_q4`, row r3)

The candidate report attributes the WBC unit-notation difference between the oracle text (`14,200/µL` → `10,400/µL`) and current text (`14.2 ×10³/µL` → `10.4 ×10³/µL`) to commit `018f7b0`. Independently verified:

```
$ git show --stat 018f7b0
commit 018f7b0b4541a941b7f55101755d3cea49294649
Author: Luke Cai <lcai2@northwell.edu>
Date:   Mon Jul 20 14:30:29 2026 -0400

    Verify adult lab reference bands, ratify magnesium override, land WBC/platelet prose-unit normalization
```

The commit subject independently corroborates a global WBC/platelet prose-unit normalization pass, consistent with the candidate's attribution. I had already independently confirmed (before opening any candidate report — see `01-independent-eight-target-review.jsonl`, target 8's `note` field) that 14,200/µL and 14.2 ×10³/µL are the same numeric value in different notation, and that this does not change the row's clinical direction or correct column. The candidate's claim that this notation-only edit does not change the clinical/scoring construct is confirmed independently, not merely taken on the candidate's word.

## Hash reproduction

All of the following were recomputed independently on disk/via `git show` and matched the candidate's claimed values exactly:

| Artifact | Claimed SHA-256 | Reproduced |
|---|---|---|
| `banks/gpt-canonical.json` @ base `3c33c03a` | `fe7fdc51...cb0b` | MATCH |
| `banks/gpt-canonical.json` @ candidate `e23962e7` | `be83c943...5a76d` | MATCH |
| `scripts/patches/2026-08-25-june13-matrix-swap-regression-repair.ts` | `0624734d...aa69` | MATCH |
| `repair-preflight.jsonl` | `6933e048...4158` | MATCH |
| `repair-report.md` | `c119e862...c68b` | MATCH |
| `no-op-target-review.md` | `b1ca8189...cde9` | MATCH |
| `FORENSIC-REVIEW-MANIFEST.md` | `39ff7619...977a` | MATCH |
| `forensic-review/SEAL.md` | `707704b6...656b` | MATCH |
| `forensic-review/00-opening-receipt.md` | `3a40938b...88d0` | MATCH |
| `forensic-review/01-independent-reconstruction.md` | `f84e4cc4...299d` | MATCH |
| `forensic-review/02-git-and-repair-history.md` | `e2c005f3...2c9b` | MATCH |
| `forensic-review/03-audit-workflow-analysis.md` | `435d5161...bb1f4` | MATCH |
| `forensic-review/04-post-reveal-comparison.md` | `19cdb9f9...8d6d7` | MATCH |
| `forensic-review/final-memo.md` | `531ac813...fbcb` | MATCH |
| `forensic-review/receipt.md` | `42d75ee3...4c0` | MATCH |

All reproduced. The copied forensic-review package matches the manifest's claimed hashes exactly, confirming the prior-Claude package was copied byte-for-byte and not altered in transit.

## Ledger handling

`BANK-REVIEW-LEDGER.md` is byte-identical between base and candidate commits (`git diff` empty), and contains no reference to this repair (`grep` for "june13"/"June 13"/"matrix_swap" returns zero hits). The candidate report's claim — that it "left `BANK-REVIEW-LEDGER.md` unchanged" and did not falsely record completed independent review — is confirmed. The report correctly states `INDEPENDENT_CHECK_REQUIRED` as the outstanding condition, which is exactly the seat this acceptance task fills.

## Conclusion

No material misstatement was found in any candidate report. Every checkable claim reproduced exactly.
