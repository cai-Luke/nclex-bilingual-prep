# M4.4 reservation-recording repair — architect repair report

**Date:** 2026-08-05 · **Seat:** Architect
**Authorizing order:** `DECISIONS-MIGRATION-STAGE-2A-M4-RESERVATION-RECORDING-REPAIR-WORK-ORDER-2026-08-05.md`
revision 1.

**STATUS: CLOSED — §§1, 3, and 4 written before the first edit; §§2, 5, and 6 filled at closeout.**
This file was mutable during execution and is closed now that §6 carries a measurement. It is the
architect seat's record and evidence, not proof of correctness.

## 1. Authorization basis — recorded before the first edit

| item | value |
|---|---|
| Authorizing order | `DECISIONS-MIGRATION-STAGE-2A-M4-RESERVATION-RECORDING-REPAIR-WORK-ORDER-2026-08-05.md`, revision 1 |
| Order byte length | `16070` |
| Order SHA-256 | `02b118a9cfd6a615f5312307ac95a32833fe5420dc45f913bd14b3b9a0223b72` |
| Measuring seat | Luke (owner), personally, `LC_ALL=C wc -c` and `shasum -a 256` from the repository root |
| Corroboration on length | independent architect-seat directory measurement returned `16070` before the digest was taken |
| Branch / HEAD | `codex/decisions-migration` / `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |

### 1.1 §1.2 re-measurement, taken as the first act of execution

| path | pinned bytes | measured bytes | SHA-256 | provenance |
|---|---:|---:|---|---|
| `audit/decisions-migration-2026-07-29/target-text-manifest.md` | `314491` | `314491` | `877941d8af310567abe8c8510c1f551013faa0221f9c1dadf79d8feb98db4e46` | digest owed to the §7 Codex check C1; **closed surface, not edited under this order** |
| `DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md` | `71861` | `71861` | `c59ee87b71a69fa1aa04a27b5825fcdbe3999fffa7b9953b4f4e1730357a392d` | **pre-edit null**, measured by Luke (owner), personally, before the first edit |

The resume-note digest is the null against which the §7 C8 reversal proof runs. It was measured before
the first edit and cannot be recovered afterwards. Byte length alone would not have served: a length match
is consistent with an equal-length edit.

The three `.frozen` snapshots were not opened and remain at `312411`, `308092`, and `55424`.

## 2. The six surfaces as applied

Each row was read back from disk after the edit landed, and each `dryRun` diff was inspected and confined
to its allowlisted span before the live call.

| id | surface | outcome |
|---|---|---|
| S1 | `## Cursor`, the blanket statement | applied at lines 141–144. Now states all three §4 limbs on one surface. The authorship sentence at line 140 and the batch sentence that follows are unchanged |
| S2 | the Part A status line | applied at lines 416–419, as **Part A is provisionally closed with one reserved exception**, with 17 of those 18 blocks cleared and `M4.4` named. The range description — `P1#0` through `P17#0`, 13 cores and 5 attachments — is retained verbatim |
| S3 | `## Review status`, the blanket statement | applied at lines 954–957. Now states all three limbs; the following batch-and-date sentences are unchanged |
| S4 | `## Next session`, the next-action and confirming-read paragraphs | applied. Task line and immediate-next-action rewritten to the §7 commission with its `16070` / `02b118a9…` identity and the C3 independent-enumeration requirement; a new paragraph records the rerun outcome, `CLEAR` on all three with all pins `MATCH` and the recording-only `BLOCK`; the derived-report bar re-pointed at the §7 confirmation. The void-receipt paragraph, the revision-3 discharge paragraph, the `M4.4` reservation paragraph, the routing list, the schedule constraint, the delegation clauses, the hashing-primitive note, and the write-back note are all retained |
| S5 | the two `## Cursor` spans | applied at lines 165–171 and 436–444. Both record the rerun as returned with all three reasons `CLEAR` and the block as recording-only. Everything from `Prior context,` onward is byte-identical |
| S6 | the `**Updated:**` line | **no-op.** Already `2026-08-05` and the repair landed 2026-08-05, so no byte changed. `**Seat:** Architect` untouched |

**The `M4.4` reservation paragraph was not opened**, per §3.4.

Standing rulings verified after the last edit: the note carries `34.`, `35.`, `36.` and no `37.`, at lines
795, 809, and 842. No ruling byte was opened.

## 3. The population, as adjudicated before the first edit

### 3.1 Retained — three statements

| # | location | why it is a finding |
|---:|---|---|
| 1 | `## Cursor`, physical lines 141–142 | `All 65 live M4 records at M4.2–M4.66 are authored and provisionally cleared` contains `M4.4` by construction |
| 2 | physical line 414 | `Part A is provisionally closed` — Part A's range is `P1#0` through `P17#0`, which is M4.2–M4.19, and `P2#1` is `M4.4`. *Closed* is not *cleared* on its face, but the line sits among batch-disposition statements and reads as a review status. An ambiguous status line over a reserved record is itself the defect |
| 3 | `## Review status`, physical line 952 | `All sixty-five M4 records at M4.2–M4.66 carry provisional non-author clearance` — same construction as 1 |

### 3.2 Excluded — with a ground for each

Ruling 34 governs. The sweep ran over `provisionally cleared`, `provisional non-author clearance`,
`provisionally closed`, `provisionally reviewed`, `carry provisional`, `all 65`, `All 65`, `sixty-five`,
and `Part A`, and returned a candidate population from which the following are excluded:

| location | ground |
|---|---|
| lines 165, 170, 174, 178, 224, 228, 270, 338 — the batch statements | **range.** Each ranges over M4.20–M4.66; `M4.4` falls outside all of them |
| line 140, `M4 records authored — all 65 live blocks` | **content.** An authorship claim, true and required to stay true |
| line 160 and the Part A block list, which includes `P2#1` | **content.** An authorship inventory asserting no clearance |
| lines 369 and 493 | **content.** Both describe the full review as *owed*, which is correct |
| line 780 | **content.** Inside ruling 34, describing a search population. Rulings are closed under order §3.2 |
| line 883, `no provisionally cleared batch is reopened` | **content and surface.** Asserts non-reopening rather than clearance of any named record, and sits inside the record of an owner act |

### 3.3 Three seats, one population

The Codex receipt quoted statement 1. The GPT adjudication named all three. This seat swept the note
independently and retained the same three. **That agreement is not what makes the population complete** —
the §7 C3 check requires Codex to enumerate independently and report any statement all three seats missed,
because a confirmation that adopts this section has verified nothing about the sweep.

### 3.4 What this repair does not decide

`M4.4` / `P2#1` remains authored, reserved, unadjudicated, and not cleared, routed to the full 65-record,
13-wrapper constitutional review. **No byte of the reservation paragraph in the `## Next session` block is
opened.** It was already correct; it is the surface the other three contradicted, and repairing it would
have been repairing the wrong end of the conflict.

## 4. Discharge of the void-receipt record's outstanding digest obligation

`M4-OWNER-CONFIRMING-READ-VOID-RECEIPT-ADJUDICATION-2026-08-05.md` §1.1 recorded the revision-3 anaphora
repair order's digest as owed, discharged by the §4 Codex read. **It is discharged.** The Codex reading
seat measured that order freshly at `33084` /
`aadca7b586c795ac6e08ede55ab4dd06329ecfddee02965c1ea8a0a726df48ea`, reported **MATCH**, at
`M4-OWNER-CONFIRMING-READ-RERUN-2026-08-05.md` §1.

Recorded here rather than in that record, which is **CLOSED** under order §3.2. A closed contemporaneous
record is not reopened to absorb a later measurement; the discharge is recorded where the later work is.
This is the same disposition applied to `M4-OWNER-ANAPHORA-REPAIR-REPORT-2026-08-05.md` §7 on 2026-08-05.

## 5. Architect-measured post-repair state

| item | value |
|---|---|
| Resume note byte length | `73645`, from `71861` |
| Resume note SHA-256 | **not measured by this seat**; owed to the §7 Codex check C8 |
| Manifest | **unchanged at `314491`**, mtime unchanged. No manifest byte was opened |
| Authorizing order, re-measured after the last edit | `16070` by architect directory listing — equal to §1's length; the digest is owed at §6 |
| All three `.frozen` snapshots | untouched, at `312411`, `308092`, and `55424` |
| `DECISIONS.md` | untouched |
| Repository shape | `git status --porcelain` lists **48** untracked entries, all `??`; zero staged, zero modified tracked. The session opened at 43. The five added are the four this seat wrote under two orders and the one Codex receipt |

Architect-measured invariants at this state:

- Three blanket statements existed before the repair, at lines 141–142, 414, and 952. All three are
  repaired, and each now carries §4 limb 3 on the same surface as limb 2.
- The note carries `34.`, `35.`, `36.` and no `37.`
- `M4.4` / `P2#1` appears nowhere in the note as cleared, closed, or reviewed.

**A correction, recorded because the error is this seat's own and the class matters.** Earlier in this
session this seat reported the untracked-entry count twice — as `36` and then `37` — from estimation
rather than from counting the listing, and both absolute figures were wrong. The reported *deltas* were
correct each time, because a delta is checkable against the immediately preceding call, and the absolute
value was not, because nothing forced a count. **A number stated alongside measurements reads as a
measurement.** The figure above is counted from the live listing. Neither wrong figure reached disk.

**Every other figure in this section is this seat's own measurement of its own work and discharges
nothing.** Byte length is measurable on this connector; SHA-256 is not, and none is claimed. The §7 C8
reversal proof against the `c59ee87b…` pre-edit null is what tests this section.

## 6. Closing authorization measurement — TAKEN

**Taken 2026-08-05, after the last authorized architect edit under this order.** The two-hash rule at
order §1.3 is **satisfied**: the closing values equal §1's opening identity, so the instrument governing
the edits is the instrument they were made under. No inequality blocker exists under order §9.

| measurement | bytes | SHA-256 | measuring seat |
|---|---:|---|---|
| opening, §1 | `16070` | `02b118a9cfd6a615f5312307ac95a32833fe5420dc45f913bd14b3b9a0223b72` | Luke (owner), personally, `LC_ALL=C wc -c` and `shasum -a 256` from the repository root |
| closing, this section | `16070` | `02b118a9cfd6a615f5312307ac95a32833fe5420dc45f913bd14b3b9a0223b72` | Luke (owner), personally, `wc -c` and `shasum -a 256`, run afresh after the last edit |

**Both rows are measurements.** The closing row was taken afresh and is **not transcribed from §1**; the
architect-seat length agreement recorded at §5 is corroboration on length only and is neither
measurement.

**This record is closed.** The remaining obligation is the §7 Codex confirmation, whose C8 reversal proof
runs against the pre-edit null at §1.1 — `71861` /
`c59ee87b71a69fa1aa04a27b5825fcdbe3999fffa7b9953b4f4e1730357a392d`. That confirmation is a check on this
repair, not a continuation of it, and it authorizes no edit by any seat.
