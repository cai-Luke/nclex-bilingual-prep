# DECISIONS migration Stage 2a — `MIGRATION_DATE` supersession

> **SUPERSEDED 2026-08-06.** The candidate `2026-08-11` bound below was superseded by the owner on
> 2026-08-06 under the same pre-ratification candidate supersession act class this file's own §3.1
> clarification defines; `MIGRATION_DATE` is now `2026-08-18`. See
> `DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-08-06.md`. This file is retained
> otherwise unaltered below as the historical record of the 2026-07-31 owner act and is not rewritten.
> Its §1 binding and §4 re-rendered-surfaces table are historical, not current. Its §3.1 ratified
> clarification remains current authority and is cited, not restated, by the 2026-08-06 record.

**Owner act date:** 2026-07-31 · **Seat:** Architect (recording only; the selection is the owner's)
**Authority:** `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md` Clause B §2.2, as clarified by
the pre-ratification supersession paragraph ratified in §3 below on 2026-07-31
**Supersedes:** `DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-BINDING-2026-07-30.md`, which is retained
**otherwise unaltered** as the historical record of the 2026-07-30 owner act. That file was changed in
exactly one place: a superseded-by notice inserted beneath its title, pointing here. Nothing else in it
was edited, and the 2026-07-30 owner act is not rewritten.

## 1. The superseding binding

> **`MIGRATION_DATE` = `2026-08-11`.** Bound by Luke (owner) on 2026-07-31, superseding the candidate
> `2026-07-31` bound on 2026-07-30. Selected deliberately by the owner. Not defaulted, not inferred, not
> selected by any seat.

| item | value |
|---|---|
| Prior candidate | `2026-07-31` |
| Replacement candidate | `2026-08-11` |
| Owner act date | `2026-07-31` |
| Act class | Pre-ratification candidate supersession |
| Resulting normalized migration archive filename | `Archive/DECISIONS-ARCHIVE-2026-08-11.md` |

The replacement is a **candidate**, exactly as its predecessor was. Clause B §2.2 defines `MIGRATION_DATE`
as a verification predicate on the `America/New_York` calendar date of the **author timestamp** of the
Stage 2b content commit that first contains the migrated `DECISIONS.md` and the normalized migration
archive. That predicate is checked against the actual commit and re-checked at the final pre-merge state
of the branch. This act changes the candidate; it does not discharge the predicate and does not make the
predicate any less checkable.

## 2. Why the prior candidate was superseded

The `2026-07-31` candidate could not satisfy its own predicate. At the time of this act the Stage 2a
cursor stands at 43 of 65 live blocks, and M5, M6, the derived date-occurrence report, Codex's
post-assembly deterministic verification, the full 65-record and 13-wrapper non-author constitutional
review, and the owner's exact-byte manifest ratification are all still owed — every one of them before
the Stage 2b content commit exists.

This is **prospective impossibility**, not predicate failure. Clause B §2.2's rebinding trigger fires on
a check "against the actual commit"; no Stage 2b content commit exists, so the predicate had not failed
and was not yet checkable. That distinction is what makes this act a supersession rather than a rebinding.

## 3. Act class — supersession, not rebinding

Clause B §2.2's rebinding procedure could not be performed here, and performing it would have required
fabricating the artifacts it exists to protect. Each of its four steps presupposes an antecedent that does
not exist:

| step | presupposes | live state |
|---|---|---|
| 1 — manifest-only rebinding commit | a ratified-manifest commit as the lower bound of its authorized window, per Amendment 1 §5 | the manifest is untracked; the window is empty |
| 2 — diff limited to bytes the **ratified** date-surface inventory authorizes | a ratified inventory | manifest M7 states no such ratification act has occurred, and the concrete rows are unauthored |
| 3 — replacement manifest SHA-256 superseding the earlier ratified authority | an earlier ratified authority | none exists; no manifest hash and no ratification record |
| 4 — **both** manifest hashes and **both** ratification records in the receipt | two of each | zero of each; the receipt is a Stage 2b output under commission §10 |

The clause's fourth derived-report proof — that every fixed surface is byte-identical **across the
rebinding** — likewise requires a before-and-after pair of assembled manifests, and no assembled manifest
exists.

The invariant Clause B §2.4 guards is not engaged. There is no ratified authority to make mutable. Both
controls the clause actually places on the date survive intact: the owner alone selects, and the
date-surface census and derived-report proofs still run once, over the finally ratified bytes.

### 3.1 Ratified clarification

Luke (owner) ratified the following clarification to Amendment 1 Clause B on 2026-07-31. It is in force.

> **Pre-ratification candidate supersession.** Before the initial owner ratification of exact manifest
> bytes under commission §12, `MIGRATION_DATE` carries no ratified manifest authority and the manifest
> pins a candidate only. During that interval, the owner may supersede the candidate by naming an exact
> replacement literal in a dated record identifying the candidate it supersedes; the architect seat then
> deterministically re-renders every already-authored date-dependent surface in the candidate bytes and no
> others. This repeats the initial binding act of §2.2 and is not a post-ratification rebinding.
>
> The §2.2 rebinding procedure requiring a manifest-only rebinding commit, a replacement manifest SHA-256
> superseding an earlier ratified authority, both ratification records, and a four-proof derived report
> across the rebinding applies only on and after the first owner ratification of exact manifest bytes.
> Those steps do not apply before an initial ratified manifest authority exists. Pre-ratification
> candidate supersession ends at that initial exact-byte ratification.
>
> No seat may select, infer, or default the replacement date. The date-surface census and derived-report
> obligations remain fully in force and are discharged over the finally assembled and ratified candidate
> bytes.

This clarification states what Clause B already meant rather than changing a rule, in the same sense in
which Amendment 1 clarifies commission §5.2 item 4 without amending it. It softens no invariant, so
Principle 27's forcing-incident requirement is not engaged: no invariant had attached to unratified
candidate bytes.

## 4. Surfaces re-rendered under this act

Two, and only two, authored date-dependent surfaces existed in
`audit/decisions-migration-2026-07-29/target-text-manifest.md` at the moment of this act. Both were
deterministically re-rendered by the architect seat.

| # | locator | before | after |
|---|---|---|---|
| 1 | manifest header `MIGRATION_DATE` binding declaration | `2026-07-31`, record pointer to the 2026-07-30 binding | `2026-08-11`, record pointer to this file |
| 2 | manifest M0.1, `Normalized migration archive filename` | `Archive/DECISIONS-ARCHIVE-2026-07-31.md` | `Archive/DECISIONS-ARCHIVE-2026-08-11.md` |

**No completed live-block record changed.** None of the 43 records at M4.2–M4.44 contained an occurrence
of the migration date, so none was touched and no provisionally cleared batch is reopened by this act.

`E038`'s `Evidence` — date-dependent surface family `D5` — was unauthored at the moment of this act and is
therefore authored directly against `2026-08-11` rather than re-rendered.

### 4.1 Consequential census repair — family `D6`

The manifest's header binding declaration carries a **bare** `MIGRATION_DATE` token, not a filename. Family
`D1` as defined at manifest M7.2 covers normalized-archive-filename occurrences other than the more
specifically assigned `D5` occurrence, so `D1` did not claim the header span, and no other family did.
Under M7.4 an unclaimed token is a finding returned to the architect seat for disposition and is never
silently assigned or defaulted to fixed.

The owner directed the disposition on 2026-07-31: a distinct date-dependent family **`D6` — manifest
header `MIGRATION_DATE` binding declaration** — claims that span. `D1` and `D5` are unchanged. `D6` is a
family definition only; the completed-manifest census expands it into concrete occurrence rows, and no
occurrence count is hand-authored.

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

Entry effective dates are likewise unchanged. `E038` retains `Date: 2026-07-28` per the owner override.
No baseline identity, hash, span, or anchor was altered.

## 6. What this act does not authorize

- **No Stage 2b work.** Stage 2b remains unauthorized. `DECISIONS.md` remains byte-identical to
  `MIGRATION_BASELINE` and is not edited.
- **No manifest ratification.** The manifest remains `CANDIDATE, NOT RATIFIED`, still carries its single
  reserved terminal append-point sentinel, and still requires GPT independent review under commission §8
  and Luke's exact-byte ratification under commission §12.
- **No entry wording.** This act ratifies no statement, field, title, or index row.
- **No Git write.** No commit, stage, push, or branch operation is authorized or performed by this act.
- **No second supersession by any seat.** A further change of candidate is again an owner act only.

## 7. Downstream staleness created by this act

- `DECISIONS-MIGRATION-STAGE-2A-PART-C-AUTHORING-WORK-ORDER-2026-07-31.md` §7.1 pins the literal
  `Archive/DECISIONS-ARCHIVE-2026-07-31.md`. That work order is **immutable during execution** and is not
  edited. Its July 31 literal is stale and superseded by this act; the supersession is recorded in the
  mutable status log, `DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md`, per the work
  order's own instruction to record progress there and not in the work order.
- `DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-BINDING-2026-07-30.md` §3's resolved-surface table and §1
  binding are superseded by this file. That record is preserved unaltered apart from a concise
  superseded-by notice; the 2026-07-30 owner act is historical and is not rewritten.
- `DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md` §8.1's provisional `D1`–`D5` /
  `F1`–`F8` table was already superseded by manifest M7's owner-directed model; `D6` extends that model.

## 8. Ratification

**Status: RATIFIED 2026-07-31 by Luke (owner).** The replacement candidate `2026-08-11` and the §3.1
clarification are both owner acts of 2026-07-31 and are in force. This record ratifies no manifest bytes.
