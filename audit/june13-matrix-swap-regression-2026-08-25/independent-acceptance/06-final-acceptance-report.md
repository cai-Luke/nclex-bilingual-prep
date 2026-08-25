# June 13 Matrix Swap Regression Repair — Final Acceptance Report

**Reviewed base commit:** `3c33c03afc6bb06ab1f98cc772b13cae274f55a8` (primary repo `main` HEAD at commission time)
**Reviewed candidate commit:** `e23962e7d81540421ab178e3e90d4dce77d21804` (`codex/june13-matrix-swap-regression-repair-2026-08-25`, single commit on top of base)
**Historical defect commit:** `91ab9606269d4e5a82b4bf613234c06db5830276`
**Restoration oracle:** `91ab960^` = `b3a68e890988ca7155dcc8113881b3a36ddf6826` (independently confirmed)

## Eight-target acceptance table

| # | ID | Location | Verdict |
|---|---|---|---|
| 1 | `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q2` | embedded | `RESTORE_CORRECT` |
| 2 | `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q1` | embedded | `RESTORE_CORRECT` |
| 3 | `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q1` | embedded | `RESTORE_CORRECT` |
| 4 | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q2` | embedded | `RESTORE_CORRECT` |
| 5 | `gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_contact_diarrhea_09` | top-level | `RESTORE_CORRECT` |
| 6 | `gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_stroke_rehab_10` | top-level | `RESTORE_CORRECT` |
| 7 | `gpt_2026_06_13_case_delirium_uti_01_q1` | embedded | `RESTORE_CORRECT` |
| 8 | `gpt_2026_06_13_case_delirium_uti_01_q4` | embedded | `RESTORE_CORRECT` (row r3 carries an independently-confirmed notation-only WBC unit change from a later, unrelated commit `018f7b0`; the numeric value and scoring direction are unchanged) |

All 8/8 targets are `RESTORE_CORRECT`. Full per-target base/oracle/candidate mappings and evidence are in the sealed `01-independent-eight-target-review.jsonl`. For every target and every row, the base-commit mapping is the exact uniform c1/c2 inversion of both the oracle and the item's own current EN/ZH `byChoice` rationale — the oracle and the rationale never disagreed for any of the 40 rows, so no `AMBIGUOUS` or history-over-rationale conflict arose.

## Mutation-scope conclusion

Confirmed by independent `git diff --name-status` and full-content diff review (`02-independent-scope-diff.md`):

- Exactly one bank-content file changed: `banks/gpt-canonical.json`.
- Exactly 8 changed scored leaves, exactly matching the 8 authorized IDs, in the same order.
- Exactly 40 `columnIds` scalar changes (8 leaves × 5 rows), matching the diff's 40 insertions / 40 deletions.
- No stems, rows, columns, rationale, translations, topic/category/difficulty metadata, sources, or sibling leaves changed.
- No ninth learner-facing item changed at the JSON value level.
- `banks/gemini-canonical.json` and `banks/io-canonical.json` are byte-identical to base.
- `census.json`, `BANK-CENSUS.md`, `PROJECT-HISTORY.md`, `DECISIONS.md`, `AGENTS.md`, `BANK-REVIEW-LEDGER.md` are byte-identical to base.
- The patch (`scripts/patches/2026-08-25-june13-matrix-swap-regression-repair.ts`) is declarative, ID/field-path-scoped (not array-index-based), exact-before/exact-after, and its fail-closed behavior (`deepEqual` precondition, abort-with-nothing-written on mismatch, scope-guarded canonical-mode write requiring explicit `--allow-canonical --reason`, atomic write with disk-reread re-validation) was verified directly from `scripts/patch-raw.ts` source, not merely asserted by the candidate report.

## Two no-op target classifications

- `fhr_gemini_smoke_2026_06_13_06`: `NO_OP_TARGET_CORRECT`. All 4 rows independently re-derived as matching their own rationale; no defect found.
- `io_matrix_prerenal_aki_recheck_04`: `NO_OP_TARGET_CORRECT`. All 4 rows independently re-derived as matching their own rationale and the keyed `derived_values_keyed` intake/output totals; no defect found.

Both are proven unchanged by the candidate via byte-identical `git diff` on their containing files (`banks/gemini-canonical.json`, `banks/io-canonical.json`). Per the work order, this net Git no-op is distinguished from any claim about the unrecoverable within-commit execution sequence at the historical `91ab960` commission — no such stronger claim is made. No follow-up is raised for either target, since no defect was found.

## Candidate-report audit conclusion

Every claim in `repair-report.md`, `verification.md`, `no-op-target-review.md`, `FORENSIC-REVIEW-MANIFEST.md`, and `repair-preflight.jsonl` was checked against my sealed, independently-derived Phase A findings (before those files were opened) and against directly reproduced hashes. No material mismatch was found. All 15 checkable hashes (bank before/after, patch script, 4 task-owned report artifacts, 8 copied forensic-review files) reproduced exactly on independent recomputation (`04-candidate-evidence-audit.md`). The WBC-notation attribution to commit `018f7b0` was independently corroborated by `git show --stat`. `BANK-REVIEW-LEDGER.md` was independently confirmed unchanged and containing no false completed-review claim.

## Command-verification summary

All 13 required commands (`validate-bank`, `audit`, 7 named `test:*` suites, `coverage-report`, `census:check`, `tsc -b`, `build`) exit 0 in the candidate worktree at the reviewed commit. All 6 recomputed inventory metrics (13 banks, 1,930 session units, 2,516 scored leaves, 340 matrix leaves, 199 visuals, zero census drift) match Codex's orientation claims exactly, independently recomputed rather than trusted. All warnings present (`audit:integrity` INSUFFICIENT, 451 `revealsAllStages` advisories, 1 distributional non-MCQ bias advisory, 1 Vite chunk-size advisory) are pre-existing and unrelated to the candidate's mutation surface. The candidate worktree's tracked diff is clean at `e23962e7` both before and after the command battery. Full detail in `05-command-verification.md`.

## Follow-ups

None required for acceptance. For the record (not blocking): the two no-op targets were re-confirmed defect-free; no new work order is raised for them.

## Final disposition

**PASS** — all ten acceptance criteria in §9 of the work order are independently satisfied; none of the blocking examples in §9 apply.

## Explicit statement

No merge, bank edit, ledger edit, historical audit addendum, governance edit, or push occurred during this acceptance task. The primary repository (`/Users/holemini/Desktop/Project Shrimp`) remains at `main` HEAD `3c33c03afc6bb06ab1f98cc772b13cae274f55a8`, 7 commits ahead of `origin/main`, with only the pre-existing untracked `audit/standalone-bowtie-answerability-census-2026-08-23/` directory — unchanged from the opening receipt. The repair worktree (`shrimp-matrix-swap-repair-2026-08-25`) remains at candidate commit `e23962e7d81540421ab178e3e90d4dce77d21804` with a clean tracked diff — unchanged from the opening receipt except for the untracked `dist/` build output produced by the read-only command-verification pass.

**Terminal token:** `JUNE13_MATRIX_SWAP_REGRESSION_REPAIR_ACCEPTED`

**Handoff marker:** `READY_FOR_ACCEPTANCE_PUBLICATION_AND_MERGE`

The next seat owns merge/publication, `BANK-REVIEW-LEDGER.md`, the June historical audit addendum, and any separate process-gap/tooling commission.
