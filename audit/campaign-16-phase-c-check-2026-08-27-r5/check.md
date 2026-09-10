# Campaign 16 Phase C Revision 5 — Independent Claude checker report (pass 2)

**Role:** independent Claude checker, pass 2 (post-unblinding comparison and final checker record).
**Date:** 2026-08-28.
**Repository HEAD:** `3286024bcab90c1a114811a7202d956c3e586bf4` (branch `main`, `origin/main`, ahead 0 / behind 0).
**Outcome:** **BLOCKED — verdict disagreement on 1 of 19 unpaired candidates. Exact primary-verdict agreement stands at 18/19; the exit gate requires 19/19.**

## Evidence paths

- Frozen pass-1 derivation (not modified by pass 2):
  - `audit/campaign-16-phase-c-check-2026-08-27-r5/independent-derivation.json`
  - `audit/campaign-16-phase-c-check-2026-08-27-r5/independent-derivation.md`
  - `audit/campaign-16-phase-c-check-2026-08-27-r5/blinding-provenance.json`
- Pass-2 files written by this report:
  - `audit/campaign-16-phase-c-check-2026-08-27-r5/comparison.md`
  - `audit/campaign-16-phase-c-check-2026-08-27-r5/check.json`
  - `audit/campaign-16-phase-c-check-2026-08-27-r5/check.md` (this file)
- Producer artifacts inspected under `audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/`: `execution-plan.md`, `population.jsonl`, `population-summary.md`, `preflight-result.json`, `deterministic-gates.json`, `opening-bank-snapshot.json`, `opening-preservation.json`, `control-manifest.jsonl`, `generated-control-files.json`, `blocked-evidence.json`, `scale-up-bank-recheck.json`, `semantic-contexts.jsonl`, `blind-packets/`, `blind-reviews/`, `phase-e-packets/`, `phase-e/`, `phase-f-packets/`, `phase-f/`, `locks/`, `adjudication.jsonl`, `report.md`, `verification.md`, `closeout-preservation.json`, `status.log`, `run.ts`, `test.ts`. Live-content check on CAND-18 read directly from `banks/gpt-canonical.json` in-session.
- Work-order re-hash: `sha256sum scratch/CAMPAIGN-16-PHASE-C-UNPAIRED-BOWTIE-ANSWERABILITY-WORK-ORDER-2026-08-27.md` → `74fb97e70ca5820a4e95acc62e2b0f3f54790d0eea766d2be58e8a427f924248` (matches expected).

## Mechanical gate results

| Gate | Producer | Pass-1 independent | Live re-check this pass | Result |
|---|---|---|---|---|
| §3.2 bank identity (13/13) | 13/13 MATCH | 13/13 MATCH | 13/13 MATCH | PASS |
| §4.1 population 50 / 31 / 19; delta 0 | equal | equal | equal | PASS |
| §4.2 unpaired payload drift | 0 | 0 | producer table row-for-row identical | PASS |
| §4.3 `_bt_` falsification (present-and-absent proof) | pass | pass | equal | PASS |
| §4.4 structural precondition (19/19 at 3/4/4 tokens, 1/2/2 keys) | 19/19 | 19/19 | equal | PASS |
| §4.5 sibling-absence probe (0 hits over 145 case-study IDs) | 0 hits | 0 hits | equal | PASS |
| §4.6 paired preservation (31/31 vs. frozen 2026-08-23) | 31/31 | 31/31 | equal | PASS |
| Blind semantic completion — 19 isolated Sol/high contexts × 2 sequential turns = 38 sealed turns | equal to lock inventory | N/A (independent) | 76 locks, 19 phase-e, 19 phase-f present as reported | PASS |
| GPT bank equal to §3.2 literal digest `e4955f7b…7b3b` (matches Phase-B closing) | MATCH | MATCH | MATCH | PASS |

All mechanical gates satisfy the frozen-spec and work-order requirements.

## 19/19 requirement and exact-agreement result

Requirement: 19 exact primary-verdict agreements between the independent Claude derivation and the producer disposition table, over the 19 unpaired candidates.

**Observed exact agreement: 18 / 19.**

Row-by-row comparison and CAND-18 detail live in `comparison.md`; a machine-readable copy is in `check.json`. Summary:

- 18 rows carry identical primary verdicts (all `PASS_STANDALONE`).
- 1 row diverges — CAND-18 (`gpt_format7c_exercise_hypoglycemia_bowtie`): producer `FAIL_UNSUPPORTED_TOKEN_PREMISE` (secondary `RATIONALE_ADDS_MISSING_FACT`, advisory `P1`); pass-1 independent `PASS_STANDALONE`.
- CAND-12 (palliative MBO) carries the producer's non-fatal `DISTRACTOR_PATIENT_FACT_INVENTION` / P2 secondary flag on a non-keyed distractor, which §12 explicitly permits on a `PASS_STANDALONE` row and does not affect primary-verdict agreement.

### CAND-18 disposition, in brief

Producer position: keyed action A3 ("Carry rapid-acting carbohydrate and immediately follow the existing hypoglycemia treatment plan when symptoms or a low reading occurs") presupposes an **existing client-specific** hypoglycemia treatment plan and rapid-carbohydrate access. The stem establishes a preexisting **meal/insulin** plan only. `rationale.byChoice[A3]`, `rationale.correct`, and `testTakingStrategy` all assert "the existing hypoglycemia plan" — a fact absent from the stem. Phase-F provenance is therefore `RATIONALE_ONLY`. Because §4.5 leaves sibling inspection unreachable, `SIBLING_CASE_IMPORTED` cannot rescue the classification, and §12 fixed precedence takes `FAIL_UNSUPPORTED_TOKEN_PREMISE`.

Live re-check confirms the three quoted producer surfaces do carry those assertions in both English and Simplified Chinese, and the stem does not. Producer's evidence chain is internally coherent under frozen spec §§10–12 and work-order §5.3.

Pass-1 position: the "existing hypoglycemia plan and rapid-carb access" element is `GENERAL_KNOWLEDGE_LINK` (universal T1DM DSMES content), not a missing client-specific fact. Under that reading no keyed target requires a missing client-specific fact, and `PASS_STANDALONE` follows.

Both readings are defensible under §10; the divergence is at the `MISSING_CLIENT_FACT` vs. `GENERAL_KNOWLEDGE_LINK` support-classification choice for a keyed action whose wording uses a definite article. Per pass-2 instructions, **pass 1 is not revised**. The frozen `independent-derivation.*` and `blinding-provenance.json` files remain byte-identical to their pass-1 state.

## Producer internal consistency

`adjudication.jsonl` has 19 rows (CAND-01…CAND-19). Each row's `phaseESha256` and `phaseFSha256` resolve to the corresponding files in `phase-e/` and `phase-f/`, and the `locks/` directory carries all 76 expected locks (19 × 4 stages). Combined 50-item accounting (18 + 20 = 38 PASS_STANDALONE, 0 + 7 = 7 hidden-case, 1 + 4 = 5 unsupported-premise) is arithmetically correct against the frozen 2026-08-23 paired totals. Charter Traps 1, 5, and 6 are addressed in `verification.md` and match the harness structure in `run.ts`. **Producer artifacts are internally consistent.**

## No-bank-change proof

- `shasum -a 256 banks/*.json` returns the exact 13 digests recorded in the pass-1 §3.2 identity gate and in `report.md`. No bank file has been altered by the producer, by pass 1, or by pass 2.
- `closeout-preservation.json → bankRows` reports 13 rows with `unchanged: true` and `openingSha256 == closingSha256` on every row; this pass verifies each row against live disk and finds identical digests.
- `closeout-preservation.json → revision4TreeOpening / revision4TreeClosing` enumerate the 8 files of the failed R4 tree at `audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27/`; opening equals closing on every file, and re-hashing all 8 files in-session equals the closing record. **R4 tree byte-preserved.**
- Repository HEAD, upstream tracking, and ahead/behind counters are unchanged. The pre-existing dirty state enumerated by pass 1 (`BANK-CENSUS.md`, `BANK-REVIEW-LEDGER.md`, `CLAUDE.md`, `PROJECT-HISTORY.md`, `STAGE-REFERENCE-SEMANTIC-CENSUS-GEMINI-CALIBRATION-SPEC-2026-07-23.md`, `banks/gpt-canonical.json`, `census.json`, plus the untracked audit and patch-script paths) is unchanged. No new dirtiness has been introduced by pass 2.
- No producer artifact under `audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/` has been written or modified by pass 2. No pass-1 file under `audit/campaign-16-phase-c-check-2026-08-27-r5/` has been written or modified. Only the three pass-2 files listed above were created.

**Preservation: PASS.**

## Exit gate

Requirement: 19/19 exact primary-verdict agreement between the independent Claude derivation and the producer.

Observed: 18/19.

**Exit gate satisfied: false.**

Failed gate: **work-order §12 exit-gate item — "exact primary-verdict agreement on all 19 unpaired candidates between the independent Claude derivation and the producer disposition table."** Disagreement is confined to CAND-18 (`gpt_format7c_exercise_hypoglycemia_bowtie`). Neither the frozen pass-1 record nor the producer record has been converted, adjusted, or reinterpreted to force the count to 19; both stand as written. Architect adjudication is required before Phase C can proceed to Phase D.
