# DECISIONS.md Taxonomy — Ratifiable Classification Contract

**Date:** 2026-07-24
**Status:** Proposed for owner ratification. Nothing below is in force until Luke ratifies it.
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

**T — Open thread.** An outstanding obligation with a named next action.
*Test:* it describes work not yet settled. A thread is not a rule and must never be read as one.

**X — Archived.** Superseded, lapsed, or condensed material. Lives in the archive; the live document
keeps only an index line naming what it was and where it went.

---

## 4. Status

The five existing status tags in `DECISIONS.md` section 2 are unchanged and continue to apply
**per entry**, independently of kind. Kind says what an entry is; status says whether it binds now.

Consequences worth stating explicitly, because the current document has no home for them:

- A `CONDITIONAL` principle is a **P** scoped to a lane. When its lane retires it becomes **X**.
- A `PARKED` item is a **T** whose next action is a named resumption trigger.
- A `REVISIT` item is a **T** whose next action is outstanding work.
- A `SUPERSEDED` item is **X**.

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

---

## 7. Identifiers

**Principle numbers are permanent. They are never reused and never renumbered.** 13 and 14 are
already intentionally unused; that precedent governs. An entry that stops being a principle retires
its number, and everything below it keeps its own.

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
7. Open threads                   (T — REVISIT and PARKED)
8. Archive index                  (X — pointers only, no bodies)
```

Today's sections 5 (conditional lane contracts) and 6 (parked architecture) dissolve into this:
lapsed lane contracts become archive index lines, parked items become threads.

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
