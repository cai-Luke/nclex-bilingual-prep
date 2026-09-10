# Campaign 16 Phase B — Stage 3 Execution Plan

Status: complete — `CAMPAIGN16_PHASE_B_PUBLISHED`
Authority: §11 of `scratch/CAMPAIGN-16-PHASE-B-QUARANTINED-FIX-RECOVERY-WORK-ORDER-2026-08-27.md`
Role: mechanical publication only; no content revision authority
Freeze authority: `publication-freeze.json` only

## Identity and scope

- Verify the immutable work-order file-byte SHA-256 before relying on it.
- Verify both frozen publication artifacts and the current raw draft against the hashes in the freeze.
- Recompute all 13 frozen campaign payload hashes using `sha256(stableJson(q, 0))`.
- Recheck all 13 canonical-bank file-byte hashes against the Phase A §A.5 baseline.
- Snapshot pre-promotion census bytes and opening census diff for attribution.
- Prove raw/frozen roster set equality and mechanically filter with zero removals; validate the resulting raw draft.

## Publication sequence

- Confirm `banks/banks-raw/*.json` contains only the task-owned campaign draft and record existing `banks/_promoted/*.json`.
- Run exactly `npm run promote`.
- Run exactly `npm run audit`, capturing the `audit:integrity` verified-draft count and requiring at least one.
- Run the required consolidate dry run, then the required real consolidation command.

## Post-publication gates

- Validate all 13 bundled banks.
- Run `npm run audit` and require `GATE PASSED`.
- Require clean `audit:topic-license`.
- Re-run the pure §8.2 `derivePopulation` proof with only `derivePopulation`, `stableJson`, and `sha256` imported.
- Re-run the §8.4 original-ID absence proof with the required positive control.
- Run the required census stale-check → regenerate → inspect both diffs → final check sequence.

## Records and stopping boundary

- Report the actual all-bank drift against the Phase A baseline.
- Update `BANK-REVIEW-LEDGER.md` and `PROJECT-HISTORY.md` only after all preceding gates pass.
- Delete only the task-owned raw draft after both records land successfully.
- Do not modify freeze artifacts, the work order, Stage 2 artifacts, `DECISIONS.md`, or unrelated paths.
- Do not run `git add`, `git commit`, or `git push`; leave the completed task-owned working tree changes for owner inspection and independent census confirmation.
- On any mandatory failure, stop with `CAMPAIGN16_PHASE_B_PUBLICATION_BLOCKED` and record the failure and mutations.
