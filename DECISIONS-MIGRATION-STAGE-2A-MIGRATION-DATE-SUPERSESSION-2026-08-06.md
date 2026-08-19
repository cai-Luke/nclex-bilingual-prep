# DECISIONS migration Stage 2a — `MIGRATION_DATE` supersession

**Owner act date:** 2026-08-06 · **Seat:** Architect (recording only; the selection is the owner's)
**Authority:** `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md` Clause B §2.2, as clarified by
the pre-ratification supersession paragraph ratified 2026-07-31 at
`DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-07-31.md` §3.1. That clarification is
cited as authority and is not restated here.
**Supersedes:** `DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-07-31.md`, which is
retained **otherwise unaltered** as the historical record of the 2026-07-31 owner act. That file was
changed in exactly one place: a superseded-by notice inserted beneath its title, pointing here. Nothing
else in it was edited, the 2026-07-31 owner act is not rewritten, and its §3.1 clarification remains
current authority. The 2026-07-30 binding record and its own superseded-by notice are untouched by this
act and are not reopened.

## 1. The superseding binding

> **`MIGRATION_DATE` = `2026-08-18`.** Bound by Luke (owner) on 2026-08-06, superseding the candidate
> `2026-08-11` bound on 2026-07-31. Selected deliberately by the owner. Not defaulted, not inferred, not
> selected by any seat or model.

| item | value |
|---|---|
| Prior candidate | `2026-08-11` |
| Replacement candidate | `2026-08-18` |
| Owner act date | `2026-08-06` |
| Act class | Pre-ratification candidate supersession, per the 2026-07-31 §3.1 clarification |
| Resulting normalized migration archive filename | `Archive/DECISIONS-ARCHIVE-2026-08-18.md` |

The replacement is a **candidate**, exactly as both predecessors were. No exact-byte manifest ratification
has occurred under commission §12, so the interval the 2026-07-31 §3.1 clarification describes is still
open and this act falls inside it rather than triggering the full Clause B §2.2 rebinding procedure. This
act changes the candidate; it does not discharge the Clause B §2.2 predicate and does not make that
predicate any less checkable once a Stage 2b content commit exists.

## 2. Why the prior candidate was superseded

The `2026-08-11` candidate could not satisfy its own predicate inside the time remaining. At the time of
this act: all 65 M4 records, M5, and M6 are authored; the M6 repair and the two-stage `Owner` anaphora
repair are Codex-verified; the reservation-recording repair is applied and its confirmation returned
C1–C10 PASS with no advisory findings, discharging the provenance question raised against its C8
reversal proof. Still owed, every one of them before a Stage 2b content commit can exist: the
commission-required full 65-record and 13-wrapper constitutional review (just commissioned to Codex under
`DECISIONS-MIGRATION-STAGE-2A-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md`, not yet executed);
adjudication of that review's findings and any resulting repair; the Task 2 rerun over the 43 records at
`M4.2`–`M4.44`; the Task 3 rerun or explicit supersession; the six-step derived date-occurrence report;
Codex's post-assembly deterministic verification; and the owner's exact-byte manifest ratification.

This is **prospective impossibility**, the same finding the 2026-07-31 act made against its own
predecessor, not a predicate failure: no Stage 2b content commit exists, so the Clause B §2.2 predicate
has not failed and is not yet checkable. That is what makes this act a supersession rather than a
rebinding, on the same reasoning the 2026-07-31 record's §3 sets out at length and which this record does
not repeat.

## 3. Act class — supersession, not rebinding

Unchanged from the 2026-07-31 act's own finding. No ratified manifest authority exists: the manifest
remains untracked, `CANDIDATE, NOT RATIFIED`, carrying its single reserved terminal sentinel. Every
antecedent Clause B §2.2's four-step rebinding procedure presupposes — a ratified-manifest commit, a
ratified date-surface inventory, an earlier ratified manifest hash, two ratification records — is still
absent. The 2026-07-31 §3.1 clarification governs this act on that ground and is cited rather than
re-derived.

## 4. Surfaces re-rendered under this act

**Population confirmed against live disk before editing**, per owner instruction. `search_repository_files`
over `audit/decisions-migration-2026-07-29/target-text-manifest.md` for the literal token `2026-08-11`
returned **63 occurrences**, none outside the manifest's date-dependent families. That figure is an
independent cross-check against Codex's own 2026-08-05 deterministic measurement at
`M4-OWNER-ANAPHORA-VERIFICATION-2026-08-05.md` V6 (`literal 2026-08-11 count=63`), taken while the
candidate was already `2026-08-11` and M5 was already fully authored; the two counts agree.

**This is not the Clause B §2.2 derived occurrence report.** That report is a separate commission, not yet
issued, per manifest M7.5. The table below documents what this act re-rendered, at family granularity, for
this record's own purposes; it asserts no per-occurrence locator or byte offset and does not discharge
M7.5.

Unlike the 2026-07-31 act — which pre-dated M5 and touched only two header surfaces, because no wrapper,
archive-index line, or register row existed yet — M5 is now fully authored, so every already-authored
family with a live occurrence was re-rendered:

| family | surface | occurrences re-rendered |
|---|---|---:|
| `D6` | manifest header `MIGRATION_DATE` binding declaration (§1) | 1 |
| `D1` | normalized archive filename, every occurrence other than `D5` — M0.1 header pin, the target §8 structural-introduction sentence (`E053`, manifest M5.4), each of the 13 wrappers' item-8 pointer line (manifest M5.5.1–M5.5.13), the M5.6 assembled duplicate of those 13 pointers, and the 4 filled rows of the M5.7 retired-identifier register | 1 + 1 + 13 + 13 + 4 = 32 |
| `D2` | the 9 non-retiring wrappers' `Date` field, an archival date | 9 |
| `D3` | the 9 non-retiring wrappers' `archived …` index-line phrase, per record (manifest M5.5.x item 8) and again in the M5.6 assembled block | 9 + 9 = 18 |
| `D4` | archive preamble title and body prose (manifest M5.2, reproduced verbatim at M5.5's own preamble text) | 2 |
| `D5` | `E038`'s `Evidence` field at manifest M4.45 | 1 |
| **Total** | | **63** |

`D1`'s count of 32 already excludes the `D5` occurrence, consistent with the exclusion manifest M7.2
states: `D5` is a `D1`-shaped span assigned to the more specific family, not counted twice. All four
records with `Original Kind`/`Original Status` combinations identical to another record — the four
`R`/`SUPERSEDED`/§8 wrappers `E048`, `E050`, `E051`, `E052` — were re-rendered individually, each anchored
by its own unique heading, so no cross-record collision occurred in the edit itself even though the
surrounding field values repeat.

**No completed live-block record's statement, field disposition, title, index row, span, hash, or anchor
changed.** The edit touched only the date-dependent bytes named above. Verified live: the four retiring
wrappers' `Date` fields (`E040`/`P9`, `E041`/`P12`, `E042`/`P18`, `E043b`/`P22`) remain `2026-07-28`; their
index-line `retired 2026-07-28` phrases and the six-row register's four retirement dates are untouched;
only the pointer filenames inside those same lines moved, because a pointer filename is `D1` regardless of
which record's line carries it.

## 4.1 `D6` unchanged in its own scope

Family `D6`, added by owner direction on 2026-07-31 per manifest M7.2a, claims the header's bound-value
span only. The owner-act date and the record filename inside that same declaration are separate, fixed
spans that describe when and where the act happened; per M7.2a they do not move with a later rebind of the
value they sit beside. This act's header declaration therefore carries three changed sub-parts together —
the bound value (`D6`), a new owner-act date, and a new record filename — because all three describe *this*
act, not because any of the two non-`D6` spans became retroactively mutable. A future third supersession
would not reopen `on 2026-08-06` any more than this act reopened `on 2026-07-31`.

## 5. Fixed surfaces — unchanged by this act

Every surface the ratified inventory model marks fixed is untouched, in fact and by instruction.

| ID | surface | disposition |
|---|---|---|
| F1 | `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` | unchanged — ratified Amendment 4 literal |
| F2 | `Archive/DECISIONS-ARCHIVE-2026-07-14.md` | unchanged — prior archive, never edited |
| F3 | The four retiring wrappers' `Date` — `E040`, `E041`, `E042`, `E043b` — `2026-07-28` | unchanged — historical retirement date |
| F4 | The four retired-register dates — `2026-07-28` | unchanged — historical fact |
| F5 | The four `retired 2026-07-28` index phrases | unchanged — historical fact |
| F6 | Every anchor | unchanged — no anchor carries the migration date |
| F7 | `MIGRATION_BASELINE` `d499cc1d0916e03830489ec9cd0324cd1a203a73` and all thirteen span hashes | unchanged — content identity, not dates |
| F8 | The `audit/decisions-migration-2026-07-29/` directory name | unchanged — the commission's own ratified path |

Every other entry effective date across all 65 live records is likewise unchanged, including `E038`'s
`Date: 2026-07-28`. No baseline identity, hash, span, or anchor was altered. `DECISIONS.md` remains
byte-identical to `MIGRATION_BASELINE`; this act wrote no byte outside the manifest and this record.

## 6. What this act does not authorize

- **No Stage 2b work.** Stage 2b remains unauthorized. `DECISIONS.md` remains byte-identical to
  `MIGRATION_BASELINE` and is not edited.
- **No manifest ratification.** The manifest remains `CANDIDATE, NOT RATIFIED`, still carries its single
  reserved terminal append-point sentinel, and still requires the commissioned non-author constitutional
  review and Luke's exact-byte ratification under commission §12.
- **No entry wording.** This act ratifies no statement, field, title, or index row, and repairs no
  finding from any review.
- **No Git write.** No commit, stage, push, or branch operation is authorized or performed by this act.
- **No position on the full-review commission's findings.** The full 65-record and 13-wrapper review
  commissioned the same day is unaffected in scope, method, and disposition options by this date change.
- **No second supersession by any seat.** A further change of candidate is again an owner act only.

## 7. Downstream staleness created by this act

- `DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md` carried two stale surfaces, both
  repaired in this cycle as owner-act status-log maintenance performed before the full-review order's
  revision-1 identity was taken — not as an edit made under that unhashed order. The `**Schedule
  constraint.**` paragraph named `2026-08-11` and a day count taken from 2026-08-05; it now reads
  `2026-08-18` and a twelve-day count as of 2026-08-06. The dedicated `## MIGRATION_DATE` section
  carried the full 2026-07-31 record — stating the superseded `2026-08-11` binding, the superseded
  supersession-record filename, and the now-obsolete “exactly two surfaces” population from before M5
  existed — and has been rewritten wholesale to state this act's binding, this record's filename, and
  the current 63-occurrence, six-family population.
- `DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-07-31.md` §1's binding and §4's
  re-rendered-surfaces table are superseded by this file. That record is preserved unaltered apart from a
  concise superseded-by notice; the 2026-07-31 owner act is historical and is not rewritten.
- `DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-BINDING-2026-07-30.md` is unaffected by this act; it was
  already superseded on 2026-07-31 and is not reopened.
- No work order pins the `2026-08-11` filename as an immutable literal the way the Part C authoring work
  order pinned `2026-07-31`. `DECISIONS-MIGRATION-STAGE-2A-M4-RESERVATION-RECORDING-REPAIR-WORK-ORDER-2026-08-05.md`
  and the two `Owner`-repair work orders are all **closed and discharged**; none is reopened by this act,
  and none requires a downstream-staleness notice here.

## 8. Ratification

**Status: RATIFIED 2026-08-06 by Luke (owner).** The replacement candidate `2026-08-18` is an owner act of
2026-08-06 and is in force. This record ratifies no manifest bytes.
