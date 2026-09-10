# Campaign 16 Phase B — Stage 1 Iteration 1 Execution Plan

Date: 2026-08-27
Seat: Codex / GPT-5.6 Sol
Reasoning effort: high
Terminal vocabulary: `CAMPAIGN16_PHASE_B_CANDIDATES_COMPLETE` or `CAMPAIGN16_PHASE_B_BLOCKED`

## Frozen authorities

- Work order: `scratch/CAMPAIGN-16-PHASE-B-QUARANTINED-FIX-RECOVERY-WORK-ORDER-2026-08-27.md`
  - expected/observed file-byte SHA-256: `756ba6c10206bc2a197bb9cd577f1a2789829e3e73127145254858a7649b8b51`
  - result: PASS
- Stage 2 review: `audit/campaign-16-phase-b-recovery-2026-08-27/review.json`
  - expected/observed file-byte SHA-256: `f94fe88950d1aa8550609065cbfbb44f14db527693d05ba3319a84abb614576d`
  - result: PASS

## Authorized scope

Patch in place exactly the nine current `_r2` payloads whose frozen Stage 2 disposition is `BLOCK`.
Do not modify the four `AFFIRM` payloads, any `_r2` ID, any keyed identity/count, or any canonical
`banks/*.json` file. Do not create `_r3`. Do not promote, consolidate, publish, update ledger/history,
regenerate census artifacts, commit, or push.

Blocked roster derived from frozen `review.json`:

1. `gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08_r2`
2. `gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13_r2`
3. `gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18_r2`
4. `gpt_balance5_2026_07_16_mx_client_advocacy_02_r2`
5. `gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13_r2`
6. `gpt_balance6a_2026_07_16_bt_perioperative_care_13_r2`
7. `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05_r2`
8. `gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14_r2`
9. `gpt_balance6b_2026_07_16_hl_standard_precautions_hygiene_17_r2`

Frozen `AFFIRM` preservation roster:

1. `gpt_balance2_2026_07_15_dc_client_advocacy_02_r2`
2. `gpt_balance3_2026_07_16_dc_psychotropic_medications_11_r2`
3. `gpt_balance5_2026_07_16_mx_standard_precautions_hygiene_15_r2`
4. `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07_r2`

## Opening identity

- Repository: `/Users/holemini/Desktop/Project Shrimp`
- Branch: `main`
- HEAD: `3286024bcab90c1a114811a7202d956c3e586bf4`
- Upstream: `origin/main`
- Ahead/behind: `0/0`
- Staged paths: none
- Unstaged tracked paths:
  - `BANK-CENSUS.md`
  - `CLAUDE.md`
  - `STAGE-REFERENCE-SEMANTIC-CENSUS-GEMINI-CALIBRATION-SPEC-2026-07-23.md`
  - `census.json`
- Untracked paths:
  - `audit/campaign-16-phase-a-baseline-2026-08-26/baseline.json`
  - `audit/campaign-16-phase-a-baseline-2026-08-26/baseline.md`
  - `audit/campaign-16-phase-a-baseline-2026-08-26/execution-plan.md`
  - `audit/campaign-16-phase-a-check-2026-08-26/check.json`
  - `audit/campaign-16-phase-a-check-2026-08-26/check.md`
  - `audit/campaign-16-phase-a-check-2026-08-26/comparison.md`
  - `audit/campaign-16-phase-b-recovery-2026-08-27/execution-plan.md`
  - `audit/campaign-16-phase-b-recovery-2026-08-27/manifest.json`
  - `audit/campaign-16-phase-b-recovery-2026-08-27/report.md`
  - `audit/campaign-16-phase-b-recovery-2026-08-27/review.json`
  - `audit/campaign-16-phase-b-recovery-2026-08-27/review.md`
  - `scripts/patches/2026-08-27-campaign16-phase-b-recovery.ts`
- Dirty bundled `banks/*.json`: none
- Pre-existing dirty paths will be preserved without stash, revert, clean, delete, or normalization.

## Passed opening gates

- All 13 bundled-bank file-byte SHA-256 values exactly match §A.5 of the Phase A checker.
- Reviewed raw-draft file-byte SHA-256 equals
  `64a8333d37e17d6daf06e1b8a3553b394ea9892fcf83ec1e5beb21f0991800fd`.
- All four `AFFIRM` payloads match the frozen campaign-convention hashes in `review.json`.

## Execution sequence

1. Inspect complete current payloads and derive the smallest bilingual construct-preserving patch for
   every frozen repair requirement.
2. Verify every added clinical or operational fact against an authoritative primary source.
3. Write a sibling declarative iteration patch program using exact `_r2` IDs and exact before-values.
4. Apply the patch program once to the existing raw draft; do not rematerialize and do not mint IDs.
5. Prove the nine-row mutation set and four-row non-mutation set against the reviewed draft hashes.
6. Inspect each resulting revised payload and inventory all stem/case/plan/protocol/program references.
7. Run every applicable validation, normalization, identity, routing, uniqueness, absence, parity,
   envelope, canonical non-mutation, and `derivePopulation` gate.
8. Write `manifest-iteration-1.json` and `report-iteration-1.md` without amending prior evidence.

