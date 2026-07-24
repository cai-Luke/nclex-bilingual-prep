# DECISIONS.md Taxonomy — Ratifiable Classification Contract

**Date:** 2026-07-24 · amended 2026-07-24 (Amendments 1 and 2 — section 10)
**Status:** **RATIFIED 2026-07-24 by Luke (owner)**, including Amendments 1 and 2. In force.
**Purpose:** Fix the target contract *before* any classification begins, so the surveying seat
classifies against a contract it did not author.

---

## 1. What DECISIONS.md is for

`DECISIONS.md` is authoritative for **why a rule exists** and **what status it currently holds**.

It is never authoritative for a current field shape, enum, version token, validator behavior,
renderer contract, measurement, count, or citation. Those are owned by executable source or by a
linked evidence document. A claim here that disagrees with its owner is stale, not binding.

This restates the existing section 1 of `DECISIONS.md` and changes nothing about it.

---

## 2. The compression rule

**No entry reproduces content that exists in a linked document.** Not measurements, not counts,
not citations, not source quotations, not method, not reasoning chains, not benchmark tables.

An entry states what binds and points at where the support lives. If a reader needs the evidence,
the pointer is the answer. This is the rule that does the actual shrinking; every other rule below
is structure.

---

## 3. Kinds

Every entry is exactly one kind. Kind determines which section it lives in.

**Kind is not a work-state axis.** Kind says what an entry *is*; status (section 4) says whether it
binds now; execution state (section 4a) says whether the thing it decided has been built. The three
are independent. No status value and no quantity of outstanding work may change an entry's kind. An
entry demoted from rule to thread because its implementation is pending has been silently weakened,
and a classifier that performs that demotion has produced a governance change disguised as cleanup.

**P — Governing principle.** A durable rule that decides cases not yet seen.
*Test:* could it settle a future dispute whose particulars nobody has encountered? If it only
records what was decided about one specific thing, it is not a principle.

**R — Concrete ruling.** A closed decision fixing particular values, dispositions, or scope.
*Test:* it settles specified items and generalizes to nothing further. `SBP ceiling 400 mmHg` and
the P5 ratified check list are rulings, not principles.

**I — Standing invariant.** A categorical property the architecture must have, generally not minted
by adjudication and needing no "why."
*Test:* violating it is a defect rather than a judgment call — bilingual parity, offline runtime,
globally unique IDs.

**T — Open thread.** An unsettled *question* with a named next action.
*Test:* the decision itself has not been made. A thread is not a rule and must never be read as one.
A settled decision whose implementation is outstanding is **not** a thread: it stays `P`, `R`, or `I`
and carries `EXECUTION: PENDING` (section 4a). Unbuilt is not undecided.

**X — Archived.** Superseded, lapsed, or condensed material. Lives in the archive; the live document
keeps only an index line naming what it was and where it went.

---

## 4. Status

The five existing status tags in `DECISIONS.md` section 2 are unchanged and continue to apply
**per entry**, independently of kind. Kind says what an entry is; status says whether it binds now.

Status constrains kind in exactly one direction, and the four consequences below are the whole of it.
Where a status is compatible with more than one kind, the entry's own wording decides; the classifier
may not pick the tidier reading.

- **`CONDITIONAL`** — a `P` scoped to a lane. When the lane retires the principle becomes `X`
  **unless** a surviving universal core is ratified to remain, in which case the principle is
  de-conditionalized, keeps its number, and returns to `ACTIVE`. Lane retirement is not automatic
  archival of everything that lane's principles said.
- **`PARKED`** — compatible with `P`, `R`, and `T`. A settled rule that is currently inactive is
  `P + PARKED` or `R + PARKED`; an unresolved question paused behind a resumption trigger is
  `T + PARKED`. The discriminator is whether reviving it requires a fresh decision or only a lane
  call.
- **`REVISIT`** — `T` only. A revisit queue is a location, not a status: a settled `P`, `R`, or `I`
  does not acquire `REVISIT` by having been filed inside one. A settled rule under renewed
  examination stays `ACTIVE` while a separate `T` carries the open reconsideration, unless the owner
  explicitly suspends the rule. Ratified-but-unbuilt work is `ACTIVE + PENDING`, never `REVISIT`.
- **`SUPERSEDED`** — `X`. This is the one status that does fix kind, because superseded content by
  definition no longer governs.

---

## 4a. Execution state

Independent of kind and status. Records whether what the entry decided has been built. Never records
whether it binds.

- **`EXECUTED`** — live in the executable owner named in section 6.
- **`PENDING`** — ratified, not yet implemented; names the commission or next action that would
  implement it. A `PENDING` rule binds fully. Nobody may choose a different value on the grounds that
  the ratified one is not in code yet.
- **`INACTIVE`** — specified, and deliberately not running. Reviving it is a lane call, not a
  re-derivation.
- Omitted where the entry decides nothing implementable.

`PENDING` is what stops a ratified-but-unbuilt value from being re-litigated as an open question.
`INACTIVE` is what stops parked architecture from being read as unfinished work.

---

## 5. Binding force

Every entry carries exactly one force. Force is a property of how the entry is written and where it
sits, not of how important it feels.

- **BINDING** — violating it fails a gate or is a defect.
- **AUTHORIZING** — grants or withholds permission for future work.
- **ADVISORY** — a recorded preference or heuristic; no gate, no permission.
- **HISTORICAL** — records what happened; binds nothing.

**Force may not change as a side effect of relocation.** Moving a hard prohibition out of a
principle body and into an appendix bullet weakens what it binds without altering a word. Any entry
whose force differs before and after is an owner ratification, never a cleanup outcome.

---

## 6. Required fields per entry

Live entries carry these and nothing else. Absent fields are omitted, not filled with prose.

1. **Statement** — what binds. One to three sentences.
2. **Kind, status, force, date.**
3. **Permanent ID** (section 7).
4. **Authorized / not authorized** — where the entry grants or withholds permission.
5. **Evidence pointer** — repository path. Never the evidence itself.
6. **Executable owner** — repository path, where the live truth is verified.
7. **Execution state** (section 4a) — where the entry decides something implementable.

---

## 7. Identifiers

**Principle numbers are permanent. They are never reused and never renumbered.** 13 and 14 are
already intentionally unused; that precedent governs. An entry that stops being a principle retires
its number, and everything below it keeps its own.

**A number does not retire for being asleep.** Only a change of kind retires a principle number —
never `PARKED`, never `EXECUTION: INACTIVE`, and never a lane lapse that leaves a ratified universal
core standing. An inactive principle is still a principle.

Rulings take their own permanent series `R1`, `R2`, ... likewise never reused. Invariants and
threads are cited by name.

**Bootstrap for existing rulings**, applied once during the cleanup migration and never again:
order by effective ratification date; break ties by current document order; where a ruling is
undated or its ordering is disputed, assign no number and route the row to
`UNCLEAR_REQUIRES_OWNER`. After the migration, a new ruling simply takes the next unused number.

Markdown has no compiler. Every renumbering breaks external citations silently.

---

## 8. Target structure

```
1. How to read this document      (purpose, authority boundaries, compression rule)
2. Status vocabulary              (unchanged)
3. Entry index                    (ID, kind, status, force, one line)
4. Governing principles           (P)
5. Concrete rulings               (R)
6. Standing invariants            (I)
7. Open threads                   (T — unsettled questions only)
8. Archive index                  (X — pointers only, no bodies)
```

Today's sections 5 (conditional lane contracts) and 6 (parked architecture) dissolve into this, but
not uniformly. A parked item routes by its own kind: parked *questions* become threads in section 7;
parked *settled rules* stay in sections 4–6 carrying `PARKED` and `EXECUTION: INACTIVE`. A lapsed
lane contract becomes an archive index line unless a universal core is ratified to remain.

---

## 9. Where displaced material goes

**Everything leaving `DECISIONS.md` goes to the archive.** One destination, one file in flight.

`PROJECT-HISTORY.md` is not a destination for this work. Promoting archived material into the
chronology is a separate later decision, taken on its own merits, and is out of scope for the
cleanup entirely.

Preserved verbatim in the archive, never deleted: forcing incidents, superseded wordings, historical
metrics, and litigation chronology. Principle 27 requires that a forcing incident stay retrievable
in order to relax the invariant it minted; an archive pointer satisfies that requirement and a
deletion would silently disable the ratchet.

---

## 10. Amendment record

**Amendment 1 — 2026-07-24, architect seat. Kind/status/execution separation.**

The contract as first written stated in section 4 that kind and status are independent and then
immediately coupled them, forcing every `PARKED` and `REVISIT` item to `T`. Applied to
`DECISIONS.md` at `c413a50`, that rule would have demoted three settled decisions to open threads:
principle 20 (parked audio architecture, whose own wording says a restart is "a lane decision, not a
re-derivation"), the flowsheet reinstatement implementer note ("no further architect input is
required"), and the stage-3 vital-sanity ratifications (SBP `400`, RR `150`, `spo2` `0%`, ratified
and not yet in `src/measurementAllowlist.ts`). In principle 20's case the demotion would also have
retired its number under section 7.

One cause, three symptoms: the kind axis was doing double duty as a work-state axis. Amendment 1
adds section 4a, replaces the section 4 consequences, protects principle numbers from inactivity in
section 7, and routes parked items by kind in section 8. It changes no kind definition and no force
definition.

**Amendment 2 — 2026-07-24, architect seat. `REVISIT` narrowed to unsettled threads.**

Amendment 1 left `REVISIT` compatible with `R` "where a settled ruling sits in a revisit queue
alongside genuinely open sides." That let physical placement determine status — the same error the
survey spec's section 8 forbids for force, reintroduced into the status axis by the same amendment
that corrected it out of the kind axis. It would also have let the mixed vital-sanity entry keep a
status that legitimizes its present shape instead of requiring the split the survey correctly
identified.

`REVISIT` is now `T` only. A settled rule under renewed examination stays `ACTIVE` and a separate
thread carries the reconsideration; suspending a live rule is an owner act, not a filing decision.

The through-line of both amendments: **layout is not semantics.** Where a document's physical
arrangement disagrees with an entry's own wording, the wording governs on every axis — kind, status,
and force — and the disagreement is a mis-file to repair, never a property to preserve.

---

## 11. Ratification

**Ratified 2026-07-24 by Luke (owner)**, including Amendments 1 and 2. This contract is in force and
is the classification contract for the phase-1 survey's second pass.

Consequent owner rulings, recorded operatively in
`DECISIONS-CLEANUP-PHASE-1-SURVEY-CODEX-SPEC-2026-07-24.md` section 8:

- Principle 8 is de-conditionalized and retained under its own number; its lane-specific detail
  archives. This is the section 4 `CONDITIONAL` carve-out and its first application.
- No `P31` is minted.

The pass-1 classifications rendered against the unratified draft are discarded. The mechanical
inventory facts listed in the survey spec's section 12 are reused.
