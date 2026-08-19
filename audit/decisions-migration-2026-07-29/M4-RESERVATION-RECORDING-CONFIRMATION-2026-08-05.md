# M4.4 reservation-recording confirmation

**Date:** 2026-08-05  
**Seat:** Codex  
**Authorizing order:** DECISIONS-MIGRATION-STAGE-2A-M4-RESERVATION-RECORDING-REPAIR-WORK-ORDER-2026-08-05.md, revision 1

**Overall disposition: PASS.** C1–C10 pass or match. This is a reservation-recording confirmation only;
the discharged semantic review of M4.3, M4.7, and M4.11 was not repeated.

## C1. Manifest identity — MATCH

Fresh measurement of audit/decisions-migration-2026-07-29/target-text-manifest.md:

| bytes | physical lines | SHA-256 | result |
|---:|---:|---|---|
| 314491 | 5943 | 877941d8af310567abe8c8510c1f551013faa0221f9c1dadf79d8feb98db4e46 | **MATCH** |

## C2. Authorization identity — MATCH

The revision-1 work order measured at both verification opening and close:

| measurement | bytes | SHA-256 | result |
|---|---:|---|---|
| opening | 16070 | 02b118a9cfd6a615f5312307ac95a32833fe5420dc45f913bd14b3b9a0223b72 | **MATCH** |
| closing | 16070 | 02b118a9cfd6a615f5312307ac95a32833fe5420dc45f913bd14b3b9a0223b72 | **MATCH** |

The two measurements are equal.

## C3. Independent population enumeration — PASS

Before comparing against order §2.1, I traced every explicit record scope in the live resume note that
contains M4.4 (direct M4 intervals and the Part A/P2#1 mapping), then reviewed each status-bearing
statement in those scopes. I retained positive clearance, closure, or review-disposition claims; I did
not treat authorship statements, forward-looking review obligations, or single-record reservation
statements as a status disposition over a range.

The independently enumerated population is:

| # | live location | statement/scope |
|---:|---|---|
| 1 | Cursor, lines 149–153 | all 65 records at M4.2–M4.66; the clearance disposition covers M4.4 |
| 2 | Part A status, lines 427–430 | Part A/P1#0 through P17#0, which includes P2#1/M4.4 |
| 3 | Review status, lines 968–971 | all 65 records at M4.2–M4.66; the clearance disposition covers M4.4 |

Only after completing that enumeration, I compared it with order §2.1. The populations are equal: three
statements, with no omitted architect statement and no independently found fourth statement.

## C4. Three-limb recording — PASS

The first and third surfaces state all three required limbs: all 65 are authored; 64 carry provisional
non-author clearance; M4.4/P2#1 is the sole authored, reserved, unadjudicated, not-cleared exception.
The Part A surface states its scoped closure consistently: 17 of 18 carry provisional non-author
clearance and M4.4/P2#1 is the explicit reserved exception. No surface states clearance without the
exception on that surface.

## C5. No affirmative clearance, closure, or review of M4.4 — PASS

The direct M4.4/P2#1 scan finds only the explicit reservation and the three repaired status surfaces.
Each status surface says M4.4/P2#1 is not cleared; none classifies it affirmatively as cleared, closed,
or reviewed. The §4.4 item 7 condition therefore holds.

## C6. Reservation remains non-adjudicated — PASS

The note calls the repaired condition a reservation-recording conflict, not a defect in M4.4 itself.
Every direct reservation statement preserves M4.4/P2#1 as reserved and unadjudicated; none adjudicates
it in either direction or calls the reservation a defect.

## C7. Standing rulings — PASS

The complete Standing rulings section is byte-identical to the recovered pre-repair null. Its terminal
labels are 34, 35, and 36; no 37 label exists.

## C8. Six-surface reversal — PASS

The supplied pre-edit null was located as local Git object 67ae324561015d5a6e08b459716fb24425f0eda5 and
independently measured before use. Reversing the changed S1–S5 hunks in memory, with S6 confirmed as its
authorized no-op, reproduced that null byte-for-byte. The twelve low-level line-diff hunks group only to
S4, S1, S5a, S2, S5b, and S3.

| artifact | bytes | physical lines | SHA-256 | result |
|---|---:|---:|---|---|
| reconstructed pre-repair resume note | 71861 | 993 | c59ee87b71a69fa1aa04a27b5825fcdbe3999fffa7b9953b4f4e1730357a392d | **MATCH / PASS** |
| live repaired resume note | 73645 | 1012 | db7b1abc302895c15507ed2a280e8b2f11b1e98b6324c51275bdd091858348eb | measured post-repair state |

## C9. Allowlist boundary — PASS

The exact pre-null/live comparison has changes only in the six authorized surfaces: S4 (three grouped
areas), S1, S5a (two line-level hunks), S2, S5b (three line-level hunks), and S3. S6 is unchanged as
authorized. The continuation beginning at the S5 Prior context marker is byte-identical through the next
independently allowlisted surface, Review status; S3 is the separately allowlisted later surface.

## C10. Repository boundary — PASS

DECISIONS.md is byte-identical to MIGRATION_BASELINE: git diff --quiet exited 0, and the live file
measured 76314 bytes with SHA-256
b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e. The branch remains
codex/decisions-migration at HEAD 05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5.

At close, git status --porcelain shows untracked Stage 2a paths only (including this sole confirmation
deliverable under the existing untracked audit directory), with zero staged paths and zero modified tracked
paths.

## Findings

No advisory findings. No repository file other than this confirmation was written.
