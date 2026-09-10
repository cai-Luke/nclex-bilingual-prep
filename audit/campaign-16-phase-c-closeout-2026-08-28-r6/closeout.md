# Campaign 16 Phase C Revision 6 Closeout Record

Date: 2026-08-28

## Owner disposition and preserved dissent

The owner accepts the producer disposition for `gpt_format7c_exercise_hypoglycemia_bowtie` (surrogate `CAND-18`): primary verdict `FAIL_UNSUPPORTED_TOKEN_PREMISE`, secondary `RATIONALE_ADDS_MISSING_FACT`, provenance `RATIONALE_ONLY`, advisory priority `P1`. The complete verbatim owner disposition is preserved in `owner-adjudication.md`.

Claude's independent `PASS_STANDALONE` derivation remains a legitimate checker dissent on the record. Both readings were defensible on the record; the owner chose the producer disposition. The dissent was not withdrawn, downgraded to an error, rewritten, or superseded. Its preserved evidence paths are:

- `audit/campaign-16-phase-c-check-2026-08-27-r5/independent-derivation.md`
- `audit/campaign-16-phase-c-check-2026-08-27-r5/independent-derivation.json`
- `audit/campaign-16-phase-c-check-2026-08-27-r5/comparison.md`
- `audit/campaign-16-phase-c-check-2026-08-27-r5/check.md`
- `audit/campaign-16-phase-c-check-2026-08-27-r5/check.json`

## Revision-5 §12 finding

Revision-5 §12 required complete independent re-derivation of all 19 final primary dispositions, not checker/producer unanimity. The `19/19` language quantified coverage of the re-derivation, and that requirement was met. The Revision-5 `CAMPAIGN16_PHASE_C_BLOCKED` terminal is superseded by owner adjudication and has been left byte-identical on disk rather than corrected in place. The Revision-5 checker acted correctly by escalating the disagreement rather than resolving it seat-side.

## Final Phase C accounting

### Unpaired population

| Primary verdict | Count |
|---|---:|
| `PASS_STANDALONE` | 18 |
| `FAIL_HIDDEN_CASE_DEPENDENCY` | 0 |
| `FAIL_UNSUPPORTED_TOKEN_PREMISE` | 1 |
| all other primary verdicts | 0 |
| **total** | **19** |

### Combined current `_bowtie` population

The already-proven 31/31 paired-disposition preservation is the warrant for this combined claim.

| Primary verdict | Paired (31) | Unpaired (19) | Combined |
|---|---:|---:|---:|
| `PASS_STANDALONE` | 20 | 18 | **38** |
| `FAIL_HIDDEN_CASE_DEPENDENCY` | 7 | 0 | **7** |
| `FAIL_UNSUPPORTED_TOKEN_PREMISE` | 4 | 1 | **5** |
| all other primary verdicts | 0 | 0 | **0** |
| **total** | **31** | **19** | **50** |

The Revision-5 report's descriptive unsupported-premise rates are carried forward unchanged: 1/19 unpaired and 4/31 paired. They are descriptive only with small denominators. No confidence interval, significance test, other inferential statistic, or generative-versus-harvest conclusion was computed or stated.

## Preserved Revision-5 findings

- work-order SHA exact;
- bank identity 13/13;
- population 50 / 31 / 19, delta 0;
- unpaired payload preservation 19/19;
- corrected `_r2` falsification PASS;
- sibling-absence probe 0 hits;
- paired-disposition preservation 31/31;
- structural precondition 19/19 at 3/4/4 tokens and 1/2/2 key cardinality;
- 19 isolated Sol/high contexts and 38 sealed semantic turns completed, 76 locks present;
- deterministic tooling, tests, TypeScript, leakage regression, repeatability, and `git diff --check` passed;
- bank, worktree, and governance preservation passed;
- historical calibration `NOT_RERUN — OWNER DECISION F1`.

## Preservation and scope

No canonical bank, answer key, rationale, token text, metadata, schema, runtime, ledger status, census artifact, `PROJECT-HISTORY.md`, or `DECISIONS.md` was changed. No commit or push was made. All three earlier Phase C evidence trees were preserved byte-for-byte and inventory-for-inventory as recorded in `preservation.json`.

## Executor status

`CAMPAIGN16_PHASE_C_CLOSEOUT_READY`

The executor record is complete and self-consistent. Phase C closure additionally requires the independent §9 check and the owner's separate declaration. This executor did not begin §9 and makes neither later-state assertion.
