# Campaign 16 Phase B — §10.7 Final Publication Freeze

Date: 2026-08-27
Emitted by: Stage 2 checker seat, Claude Opus 5 (read-only, no content edit)
Machine-readable counterpart: `publication-freeze.json`

**Whole-batch §10.7 reconciliation: PASS**
**Final publication roster: 13 rows**

This artifact binds the entire final publication set to the current draft. It is identity
reconciliation and freeze construction, not a second substantive content review of already-affirmed
rows.

---

## 1. Why this artifact exists

§9.2 binds one review pass to the draft state it reviewed. After the §10.4 iteration that binding is
stale by design, and `review-iteration-1.json` does not solve it either: it covers only the nine
revised rows and does not independently bind the four affirmed in the first pass. Stage 3 needs one
artifact binding the *whole* final set to the *current* draft. This is it, and per §11.1 it is
Stage 3's sole publication authority.

## 2. Identity evidence, and who produced it

**This seat computed no digest and asserts none as checker-derived.** It has no byte-hashing
primitive in this session. Every digest below is owner-computed or owner-recomputed and is labelled
accordingly.

The Stage 2 iteration review withheld this freeze precisely because the identity evidence was, at
that point, entirely producer-reported — which would have made Stage 3's pre-flight agree by
construction. The owner has now discharged that prerequisite independently:

| Evidence | Result | Computed by |
|---|---|---|
| Current raw draft file-byte SHA-256 | `RAW_FILE_BYTE_HASH: PASS` | **Owner** |
| All 13 current payload hashes, campaign convention, via the repository's own `stableJson` and `sha256` | `CAMPAIGN_PAYLOAD_HASHES: 13/13 PASS` | **Owner** |

Each recomputed payload hash matched its latest governing `AFFIRM` — four from the original frozen
`review.json`, nine from the frozen `review-iteration-1.json`. That is the anti-self-report check
§9.2 item 1 exists for: the producer's declared digests were reached independently rather than
restated. §9.2 item 1 is now discharged, by owner recomputation.

One precision worth preserving: the hash *values* recorded per row are carried from the governing
`AFFIRM` artifacts. The owner's contribution is the independent confirmation that each equals the
current draft's recomputed value. Stage 3 compares against these values.

## 3. Frozen authorities

| Artifact | File-byte SHA-256 | Governs |
|---|---|---|
| `scratch/CAMPAIGN-16-PHASE-B-QUARANTINED-FIX-RECOVERY-WORK-ORDER-2026-08-27.md` | `756ba6c1…9b8b51` | all three stages |
| `audit/…/review.json` | `f94fe889…14576d` | the four first-pass `AFFIRM` rows |
| `audit/…/review-iteration-1.json` | `7375d129…b42d234` | the nine iteration `AFFIRM` rows |
| `audit/…/review-iteration-1.md` | `3e1f47cb…3ad8b4` | narrative counterpart, frozen |

Current raw draft `banks/banks-raw/gpt-campaign16-phase-b-recovery-2026-08-27.json`:
`4e515f2adb7043d4e99e8210e4958c30728ce68c419844c3b562ad3255b3e192` (owner-recomputed).
88,948 bytes, 13 questions, `meta.count` 13.

## 4. The eight required reconciliations

| # | Requirement | Result |
|---|---|---|
| 1 | All 13 rows have a final governing state | PASS |
| 2 | All 13 final states are `RETURN_CANDIDATE + AFFIRM` | PASS |
| 3 | The four original `AFFIRM` rows are governed by frozen `review.json` | PASS |
| 4 | The nine revised rows are governed by frozen `review-iteration-1.json` | PASS |
| 5 | No later `BLOCK`, `OWNER_ADJUDICATION_REQUIRED`, retirement, hold, or superseding disposition | PASS |
| 6 | Every current payload hash equals its latest governing `AFFIRM` hash | PASS (owner) |
| 7 | Current raw file-byte hash is `4e515f2a…d3255b3e192` | PASS (owner) |
| 8 | Roster is exactly those 13 `_r2` IDs and no others | PASS |

On check 2, Stage 1 `manifest.json` records `RETURN_CANDIDATE` on all 13 and `status.log` records
"13 RETURN_CANDIDATE; 0 RETIRE_CANDIDATE; 0 HELD_FOR_OWNER_ADJUDICATION".

On check 5, only two Stage 2 disposition artifacts exist for this phase. A directory enumeration
confirms no `review-iteration-2` or later artifact and no prior freeze. A regex sweep for
`RETIRE_CANDIDATE`, `HELD_FOR_OWNER`, and `OWNER_ADJUDICATION_REQUIRED` across the phase evidence
directory returned only vocabulary definitions and zero-counts, never a row disposition. Per §8 that
absence is reported with its positive control in the same invocation shape: the paired
`RETURN_CANDIDATE` sweep returned 13 hits in `manifest.json`, 13 in `review.json`, and 9 in
`manifest-iteration-1.json`, proving those files were actually enumerated rather than silently
skipped. The nine first-pass `BLOCK`s are superseded history, recorded per row.

## 5. Final publication roster — 13 rows

All 13 are `RETURN_CANDIDATE + AFFIRM`, publishable, with no superseding disposition.

| Minted `_r2` ID | Governing `AFFIRM` | Prior |
|---|---|---|
| `gpt_balance2_2026_07_15_dc_client_advocacy_02_r2` | `review.json` | — |
| `gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08_r2` | `review-iteration-1.json` | BLOCK superseded |
| `gpt_balance3_2026_07_16_dc_psychotropic_medications_11_r2` | `review.json` | — |
| `gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13_r2` | `review-iteration-1.json` | BLOCK superseded |
| `gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18_r2` | `review-iteration-1.json` | BLOCK superseded |
| `gpt_balance5_2026_07_16_mx_client_advocacy_02_r2` | `review-iteration-1.json` | BLOCK superseded |
| `gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13_r2` | `review-iteration-1.json` | BLOCK superseded |
| `gpt_balance5_2026_07_16_mx_standard_precautions_hygiene_15_r2` | `review.json` | — |
| `gpt_balance6a_2026_07_16_bt_perioperative_care_13_r2` | `review-iteration-1.json` | BLOCK superseded |
| `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05_r2` | `review-iteration-1.json` | BLOCK superseded |
| `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07_r2` | `review.json` | — |
| `gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14_r2` | `review-iteration-1.json` | BLOCK superseded |
| `gpt_balance6b_2026_07_16_hl_standard_precautions_hygiene_17_r2` | `review-iteration-1.json` | BLOCK superseded |

Per-row campaign-convention payload hashes and old→new ID mapping are in `publication-freeze.json`.

All 13 questions currently in the raw draft are on the roster, so §11.2 filtering removes nothing.
Stage 3 must confirm that rather than assume it, and must not recompute the roster from Stage 1 and
Stage 2 dispositions.

## 6. Non-publishable rows

None. No retirement candidate, no surviving `BLOCK`, no held row, no owner decision to leave a row
out. The §11.0 zero-return branch does not apply.

## 7. Owner decisions of record

§10.7 makes this artifact the durable record of the owner's explicit adjudications and retirement
accept/decline decisions for this phase. **There were none.** No row ever reached
`HELD_FOR_OWNER_ADJUDICATION` or `OWNER_ADJUDICATION_REQUIRED`, and no retirement was recommended,
so there was nothing for the owner to adjudicate or accept. This seat transcribes such decisions; it
does not make, infer, or revisit them.

Two owner actions are recorded as evidence rather than adjudications: authorizing the §10.4 relaunch
on exactly the nine blocked rows, and performing the independent identity recomputation in §2.

## 8. Notes carried to Stage 3

- This artifact is the **sole** publication authority. Do not take the roster or any hash from
  `review.json` or `review-iteration-1.json`; after iteration those bind superseded draft states.
- Every hash here is **pre-promotion**. `npm run promote` applies the deterministic shuffle and
  canonical presentation normalization, so promoted and consolidated payloads differ by design. All
  comparisons against this artifact happen before §11.4. That difference is not a mismatch.
- Stage 3 regenerates and reports the census diff but **must not self-certify the movement**. The
  Stage 2 seat or the owner confirms it.
- Expected drift: `gpt-canonical.json` only.

## 9. Freeze artifact digests

`OWNER_TO_COMPUTE` for both files. This seat invents no digest. The owner runs `shasum -a 256` on
`publication-freeze.json` and `publication-freeze.md` immediately after this write and carries both
digests to the Stage 3 launch, where §11.1 step 1 verifies them against the owner-supplied values.
Those digests cannot live inside the files they describe. Neither file is modified thereafter.

## 10. Scope close-out

No content edited. No numbered review artifact modified. No canonical bank or raw draft modified. No
promotion, consolidation, census run, ledger, history, or status-map write, `DECISIONS.md` write, raw
deletion, commit, or push. Stage 3 not entered; it remains owner-launched.
