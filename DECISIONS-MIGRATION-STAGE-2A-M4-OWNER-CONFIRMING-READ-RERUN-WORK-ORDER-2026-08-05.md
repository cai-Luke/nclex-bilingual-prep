# Stage 2a — M4 `Owner` confirming-read rerun work order

**Date:** 2026-08-05 · **Authoring seat:** Architect · **Revision:** 1

**Class: review-return adjudication and recommission.** This order is not a continuation of
`DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-ANAPHORA-REPAIR-WORK-ORDER-2026-08-05.md` revision 3. Architect
editing under that order is closed and stays closed, and every byte it governed remains immutable here.
This order commissions the reading judgment that revision 3 §10 commissioned and that was not
discharged, adds one standing ruling, and opens four resume-note surfaces. **It opens no manifest byte.**

**Origin.** Codex's deterministic verification
(`audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-VERIFICATION-2026-08-05.md`) returned V1–V10
PASS, D1 PASS diagnostic, 0 BLOCKER, 0 REQUIRED REPAIR, 1 ADVISORY, and is accepted as complete within
its commissioned scope. The GPT confirming read commissioned at revision 3 §10 returned a receipt
disposing `Outcome A — all three M4 replacement reasons are valid`. **That receipt is void.** The grounds
are at §2. The reading judgment it was to supply is therefore still owed, and is recommissioned below to
a Codex reading seat by owner decision of 2026-08-05.

---

## 0. Revision history

**Revision 1 — this revision.** No prior revision exists. **No byte length or SHA-256 has been taken, and
none may be inferred.** This order is a draft with no authorization identity until §1.3 is satisfied.

---

## 1. Identity, authorization, and the bar on editing

### 1.1 Repository state, pinned

| item | value |
|---|---|
| Repository | `Project Shrimp`, local worktree |
| Branch | `codex/decisions-migration` |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| `MIGRATION_BASELINE` | `d499cc1d0916e03830489ec9cd0324cd1a203a73` |
| `DECISIONS.md` | `76314` / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`, byte-identical to baseline |

Branch, HEAD, and baseline were re-confirmed by the architect seat on 2026-08-05 after the void receipt,
against live `recent_commits` and `repository_status`.

### 1.2 Artifact identities, pinned

All values are Codex measurements taken at
`audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-VERIFICATION-2026-08-05.md` V6, V7, and V8. They
are **re-measured as the first act of execution, not assumed.**

| path | bytes | physical lines | SHA-256 |
|---|---:|---:|---|
| `audit/decisions-migration-2026-07-29/target-text-manifest.md` | `314491` | `5943` | `877941d8af310567abe8c8510c1f551013faa0221f9c1dadf79d8feb98db4e46` |
| `DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md` | `65124` | `915` | `19f796d1e60ca433460f2703eb47d44255da1ae1c6c3720e397bdf695796cbf2` |
| `DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-ANAPHORA-REPAIR-WORK-ORDER-2026-08-05.md` | `33084` | — | `aadca7b586c795ac6e08ede55ab4dd06329ecfddee02965c1ea8a0a726df48ea` |

**The manifest pin is the anchor of this whole order.** Every subject substring and every M6 surface below
is pinned by a digest measured against that manifest state. If the live manifest does not re-measure to
`314491` / `877941d8…` at the start of execution, the pins are stale, the commission is not executable, and
execution stops under §9.

The three existing `.frozen` snapshots stay untouched at `312411`, `308092`, and `55424`.
`audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-VERIFICATION-2026-08-05.md` carries no self-digest
by its own design; this order neither requires one nor infers one.

### 1.3 The authorization identity — recorded before the first edit under this order

The architect seat has no hashing primitive. **No edit authorized by this order may be made until a seat
that can hash has returned this file's byte length and SHA-256 at revision 1, and those values are
transcribed into the record at §8.** A digest this seat produced, inferred, or copied forward would
satisfy the form of this section and prove nothing.

The same identity is re-measured after the last edit. Opening and closing values must be equal;
inequality is a BLOCKER, because it means the instrument governing the edits is not the instrument
verified against them. Both measurements are measurements; neither is transcribed from the other.

**This order is immutable from the moment its revision-1 identity is taken.** A defect found after that
point is repaired by an amended order carrying a new identity, never by editing these bytes mid-execution.

---

## 2. The defect — why the receipt is void

The receipt reported a completed §10 read of the three repaired `Owner` dispositions. Four findings, each
established against live disk by the architect seat on 2026-08-05:

1. **It adjudicated records outside the commissioned set.** Revision 3 §3.1 opened exactly `M4.3` / `P2#0`,
   `M4.7` / `P5#0`, and `M4.11` / `P8#0`. The receipt adjudicated `M4.3`, `M4.5`, and `M4.6`. `M4.5` is
   `P3#0` and `M4.6` is `P4#0`; neither was opened by any order, and `M4.5`'s only 2026-08-05 involvement
   is as one of the fifteen immutable `Evidence` dispositions at revision 3 §3.2.
2. **It described substance no Stage 2a artifact contains.** The `M4.5` and `M4.6` adjudications turn on a
   learner-facing owner-flag field and on reasoning traces as non-authoritative evidence. The landed
   `M4.7` reason turns on `BANK-REVIEW-LEDGER.md` recording rather than owning; the landed `M4.11` reason
   turns on three limbs attaching at different chain stages. Repository-wide search returns zero
   occurrences of `owner-flag`, `reasoning trace`, or `escalation path` on any migration surface.
3. **It certified a repair that provably did not occur.** The receipt passes a repaired
   *old-principle-35* sentence naming four limbs and preserving a 2026-07-15 exception. No `P35`
   identifier exists anywhere in the migration corpus. More decisively, Codex V1's inverse-substitution
   round trip proves that **exactly three substrings changed** and that the manifest otherwise
   reconstructs to the post-M6 null `bc01e0be8d4ed291e0fe1ab21ccae088ff96be08a5ab50f129c1b5fcb771c264`.
   No such sentence was repaired, because no such bytes moved.
4. **Its one advisory misstates its own subject twice.** The receipt reports a stale §7 sentence saying
   *replacement wording* is owed, and states that V8 required that sentence to remain byte-identical.
   Repair report §7 says the **closing measurement** is owed, not replacement wording; and V8's
   byte-identity subject is the revision-3 **work order**, not the repair report, which was never a frozen
   object. The underlying observation is nonetheless true and is adjudicated at §7 S3 below — **on Codex's
   independent evidence, not on this receipt's.**

**Correct metadata does not salvage any of it.** The receipt's branch, HEAD `05f9bcdd…`, and no-mutation
statements are all correct and were verified. Repository identity is available without reading the
subject, so its correctness is evidence of nothing about the adjudications. Nor does the coincidental
agreement at finding 4 salvage the receipt: when a receipt is shown to adjudicate records it was not given
and to certify bytes that did not move, no seat can determine which of its remaining entries were read
from disk and which were composed. **The receipt is void for the whole commissioned scope, including its
`M4.3` entry, which names an in-scope record.** It discharges nothing and is cited nowhere as evidence.

**This is standing ruling 36**, drafted at §6.

---

## 3. Scope — exactly what is open

### 3.1 Open

- The single Codex deliverable at §4.
- The four resume-note surfaces at §7.
- One new architect-written adjudication record at §8.

**Zero manifest bytes are open under this order.** This is a reading commission and a records commission.
A manifest edit under this order is a BLOCKER without exception, including any edit a reviewing seat
believes a finding requires: a §4 finding returns to the architect seat and is repaired, if at all, by a
further order carrying its own identity.

### 3.2 Closed — every other byte

Immutable under this order, and a change to any of them is a BLOCKER:

- **The entire manifest**, all `314491` bytes, including the three repaired `Owner` substrings that are the
  subjects of the §4 read, all of M4, all of M6, M0–M3, M5, and `## M7.` to end of file.
- `DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-ANAPHORA-REPAIR-WORK-ORDER-2026-08-05.md` at revision 3, whose
  `33084` / `aadca7b5…` identity remains the authorization basis for the three landed repairs and is worth
  something only while those bytes hold.
- `audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-REPAIR-REPORT-2026-08-05.md` **in full, including
  its stale §7.** It is the producing seat's contemporaneous record. Editing it to reflect a later
  discharge would blur what that seat knew when it wrote, and §7's own rule is that the closing value is
  never transcribed into it. The discharge is recorded at §7 S3 of this order instead.
- `audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-VERIFICATION-2026-08-05.md` and
  `audit/decisions-migration-2026-07-29/M6-REPAIR-VERIFICATION-2026-08-04.md`.
- Every other prior work order, review file, receipt, and report.
- The three `.frozen` snapshots.
- `DECISIONS.md`, which is not touched at any point in Stage 2a.
- Every resume-note byte outside the four allowlisted surfaces at §7, **including rulings 1–35 verbatim.**

### 3.3 `M4.4` / `P2#1` — reservation unchanged

`M4.4` remains reserved, without adjudication, for the full 65-record, 13-wrapper constitutional review.
Revision 3 §3.3 states the reservation and this order changes nothing about it. **`M4.4` is not a subject
of the §4 read.** A §4 receipt that adjudicates it — in either direction — is out-of-scope adjudication
under ruling 36 and voids itself. The reviewing seat may record that it observed the construction and
declined to adjudicate it; that is a statement of scope, not a verdict.

---

## 4. The Codex confirming-read commission

**Seat:** Codex, reading seat. **Producer≠checker is satisfied:** Codex authored neither the three
replacement reasons nor ruling 35, and its authorship of the deterministic verification at
`M4-OWNER-ANAPHORA-VERIFICATION-2026-08-05.md` does not conflict, because this commission adjudicates the
architect seat's prose rather than reviewing that verification.

**One deliverable:**
`audit/decisions-migration-2026-07-29/M4-OWNER-CONFIRMING-READ-RERUN-2026-08-05.md`. That file is the
**sole authorized write**. No repair, no staging, no commit, no push, no stash, reset, clean, or checkout.

### 4.1 Subjects, pinned

Exactly three, and no others:

| # | record | block | subject | substring bytes | substring SHA-256 |
|---:|---|---|---|---:|---|
| 1 | `M4.3` | `P2#0` | item-10 `Owner` disposition | `319` | `3d0ee0b9a949ac89643e81040506643257cc06679b4feedcb93612c5e9e7ffd6` |
| 2 | `M4.7` | `P5#0` | item-10 `Owner` disposition | `319` | `e1d1ce93a0151ea3584318b761b53d88ae3aa33582e87426b932fa0802efb27c` |
| 3 | `M4.11` | `P8#0` | item-10 `Owner` disposition | `223` | `eb6a3f8e33c188f3c0ecf7758c4289e5cd9b5da9c5cc285ca8f88d8e5190b4f5` |

Substring boundaries are revision 3 §4's: the substring **begins** at the backtick of `` `Owner` `` and
**ends** immediately before the backtick of `` `Execution` ``, so the trailing whitespace is inside the
subject and the leading whitespace is not. The pinned lengths above are measured on exactly that
convention and are the same substrings V1 measured.

**This order deliberately does not reproduce the subject prose.** The reviewing seat reads it from disk or
does not have it. Revision 3 §5.4 withheld the replacement prose from the order on the same reasoning.

### 4.2 Proof of contact — required before any verdict

For each of the three subjects, the receipt carries, in this order:

1. The record and block identifier, and the physical line range at which the substring was found.
2. **The substring quoted verbatim from the live manifest**, in a fenced block, with the trailing
   whitespace described in words after the fence rather than shown.
3. The measured byte length and SHA-256 of exactly the quoted substring, **matched against §4.1's pin and
   reported as `MATCH` or `MISMATCH`.**

A `MISMATCH` on any subject is a BLOCKER under §9 and stops the read: it means the manifest moved beneath
the pins, and no verdict written against moved bytes is worth recording.

The whole-manifest re-measurement required by §1.2 is reported alongside, as `314491` / `877941d8…`
`MATCH` or `MISMATCH`.

### 4.3 Pairing — required before any verdict, and separately from it

Correct disk contact followed by classification drift is the failure this section exists to prevent. For
each subject, **before** its verdict, the receipt pairs the quoted substring explicitly with both of:

| record | M6.3 row | field | candidate | ground | row bytes | row SHA-256 |
|---|---:|---|---|---|---:|---|
| `M4.3` | 3 | `Owner` | — | `NO-SINGLE-OWNER` | `71` | `3eb9d83bd9a8d48ef8b923a4e67cbee567747fe36141f895ae0c03cb96ac22c2` |
| `M4.7` | 11 | `Owner` | `BANK-REVIEW-LEDGER.md` | `NOT-AN-AUTHORITY, PARTIAL-OWNERSHIP` | `112` | `3bf80a58c819a5c51ee87cdfe1b23d6c21b14b9cf75a88876b23852fc5be594c` |
| `M4.11` | 19 | `Owner` | — | `NO-SINGLE-OWNER` | `74` | `85198fb91b7f828b41953db67d54422df1be037d9ece9b12a6e5f1a529bc7dda` |

and the **M6.1 definition** of each ground named above, quoted verbatim from live M6.1. M6.1 is pinned as a
whole at `3579` / `0216a4e02240a9c7017ba1819923234546643020245909c1290e1893d3a7212a`; the receipt reports
that section digest as `MATCH` or `MISMATCH` once, and quotes the individual definitions it uses.

The M6.3 rows above are quoted from live disk and their digests matched to the pins, exactly as §4.2
requires for the subjects. The row and ground values in this table are transcribed from revision 3 §5.2 and
from Codex V3; **they are pins to be checked, not facts the receipt may adopt on this order's authority.**

**The adjacent ground must be quoted too.** For `M4.3` and `M4.11`, the receipt also quotes M6.1's
`NO-EXECUTABLE-OWNER` definition, because the drift those two records are exposed to is into that ground
and a verdict that has not held both definitions side by side has not tested for it.

### 4.4 Adjudication items

Carried forward from revision 3 §10, unchanged in substance, with the two flagged items made explicit:

1. **Self-containment.** Each replacement reason states its ground in its own terms without referring to
   the `Evidence` clause, to another record, or to any other disposition. `same reason`, `as above`,
   `likewise`, and every equivalent cross-field back-reference are prohibited in the replacement bytes.
2. **Agreement with the ground** — the judgment revision 3 §9 expressly withheld from deterministic
   verification. Whether each reason expresses the ground M6.3 assigns it and M6.1 defines, and, for
   `M4.3` and `M4.11`, whether it carries `NO-SINGLE-OWNER` substance rather than `NO-EXECUTABLE-OWNER`
   substance. A reason asserting that *nothing tracked carries this* is the wrong ground; a reason
   asserting that *several tracked things each carry part and none carries all* is the right one.
3. **The §5.3 per-record acceptance tests**, applied individually. `M4.7`'s reason must carry **both**
   limbs its ground pair requires — the authority limb and the partial-ownership limb. A single-limb
   `M4.7` reason reproduces the defect the repair exists to correct.
4. **The §5.4 limb-to-surface mapping** behind `M4.3`: whether `AGENTS.md`, `gpt-evergreen-generation-prompt.md`,
   and `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md` are current enforcement surfaces rather than
   archived examples or repeated prose, and whether they support the claim the `M4.3` reason makes. **The
   dating uncertainty recorded at revision 3 §5.4 is expressly in scope**, as is the architect's statement
   that the finding survives discounting the producer contract entirely.
5. **The `M4.3` `Execution` adjacency flagged at repair report §3.5**, which is a candidate finding and not
   a cleared point. `M4.3`'s immutable `Execution` disposition reads that the entry decides a governance
   practice with **no implementable owner**, four lines from a new `Owner` reason that names `AGENTS.md`
   and the lane contracts as carriers. The reviewing seat adjudicates whether those two clauses are
   consistent. **If they are not, the finding returns to the architect seat**; `Execution` is closed under
   §3.2 and no seat repairs it under this order.
6. **Ruling 35** against the required limbs at revision 3 §6.1, including limb 4's prohibition on
   certifying any surviving anaphor and limb 6's provenance.
7. **The `M4.4` reservation** is carried as reserved-and-unadjudicated in the repair report and in
   resume-note S3, and is written nowhere as cleared. Verifying that it is *recorded* correctly is in
   scope. Adjudicating `M4.4` itself is not — see §3.3.

### 4.5 Verdict grammar

Per subject: `CLEAR`, `REVISE, narrowly`, or `BLOCK`, each with its ground stated against the item numbers
at §4.4. Then one overall disposition. Then an explicit closing sentence naming the records **not**
adjudicated: the sixty-two other M4 records, `M4.4` among them, and every wrapper.

Findings outside §4.4 are reported as ADVISORY, with the surface named, and are repaired under a further
order or not at all. An ADVISORY does not authorize an edit by any seat.

---

## 5. The token-test bar, carried from revision 3 §9

Revision 3 §5.1 **prohibits** inserting an M6.1 ground token into the manifest prose: the record states
its reason in the record's own terms, and M6.3's ground cell is what classifies it.

The consequence binds this commission directly, because the seat now performing the reading judgment is
the seat that performed the deterministic one. **Token absence in the replacement prose is required, not a
defect, and token presence is not agreement.** A receipt that discharges §4.4 item 2 by matching ground
tokens against the prose has scored the correct output as a failure and the prohibited output as a pass, in
one operation. §4.4 item 2 is a reading judgment and is discharged only by reasoning about what the
sentence says.

This is the same withholding revision 3 §9 recorded when it declined to commission agreement
deterministically. The seat has changed; the reason has not.

---

## 6. Standing ruling 36 — authorized

**Exactly one new standing ruling is authorized: ruling 36.** Rulings 1–35 are byte-identical. A finding
warranting ruling status beyond this one arrives by amended order.

**Decision: a new ruling, not an extension of 35.** Ruling 35 is about what a byte-identity proof over a
substring can prove — a limit on a *verification instrument*. Ruling 36 is about what a receipt must show
to prove it read the bytes at all — a floor on a *reviewing seat's output*. They meet at the same repair
and diverge in what they bind. Ruling 35's payoff binds the seat designing an allowlist; ruling 36's binds
the seat adjudicating a returned receipt.

### 6.1 Ruling 36 as authorized for insertion

> 36. **A semantic receipt discharges its commission only if it proves contact with the commissioned
>     bytes.** On 2026-08-05 the confirming read commissioned at revision 3 §10 over the three repaired
>     `Owner` dispositions returned a receipt whose branch, HEAD, and no-mutation statements were all
>     correct and whose substance was not. It adjudicated `M4.5` and `M4.6`, which no order had opened; it
>     described dispositions no Stage 2a artifact contains; and it certified a repaired sentence at an
>     *old principle 35* that carries no identifier in the corpus and whose bytes Codex's V1 round trip
>     had already proven unchanged. **Rule:** a receipt on a reading commission pins the artifact by byte
>     length and digest, names the records it was commissioned over, and quotes each live subject
>     substring it adjudicates. A receipt that adjudicates a record outside the commissioned set, or that
>     asserts a mutation the pinned artifact does not contain, is **void for the whole commissioned
>     scope** and discharges nothing — not merely defective on the offending entry.
>
>     **Why the whole scope, and why correct metadata does not salvage it.** Repository identity —
>     branch, HEAD, staged and untracked state — is available without reading the subject, so its
>     correctness is evidence about the seat's repository access and about nothing else. Agreement that
>     happens to be right elsewhere is not evidence either. Once a receipt is shown to adjudicate records
>     it was not given and to certify bytes that did not move, no seat can determine which of the
>     remaining entries were read from disk and which were composed, and an adjudicating seat that keeps
>     the entries naming in-scope records is selecting on the only criterion the defect has already
>     defeated.
>
>     **What quotation proves, and what it does not.** Quotation is a contact test, not a review. A
>     receipt that quotes every subject correctly and reasons badly about it is a bad review, adjudicated
>     on its merits and returnable as `REVISE, narrowly`. A receipt that cannot quote them has not reached
>     the merits at all. The two failures are separate, and **the contact test never substitutes for the
>     substantive one**: a commission is not discharged by quotation, and a seat that quotes its three
>     subjects and then reasons from a ground it did not read has satisfied this ruling and failed its
>     commission.
>
>     **The disposition carries no finding of bad faith.** Voiding states what the receipt proves, not why
>     it reads as it does, and this ruling requires no account of the latter. Re-routing after a void
>     receipt is a routing judgment made on the work owed and the time available; it is not a sanction and
>     no seat is disqualified by one.
>
>     **Enforcement.** A commission requiring a semantic receipt states the pins and the quotation
>     requirement in the order itself, so the contact test is mechanical for the receiving seat and for
>     the adjudicating one. An order that asks for a reading judgment without pinning what was to be read
>     leaves the adjudicating seat nothing to test against, which is the condition that let this receipt
>     travel as far as it did. Found 2026-08-05 on the void confirming read of
>     `DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-ANAPHORA-REPAIR-WORK-ORDER-2026-08-05.md` revision 3.

The blockquote markers above are presentation in this order only. The ruling is inserted into the resume
note in the same plain numbered form as rulings 33, 34, and 35.

---

## 7. Resume-note allowlist — exactly four surfaces

| id | surface | change |
|---|---|---|
| S1 | after ruling 35, before the `## MIGRATION_DATE` heading | insert ruling 36 per §6.1. Nothing else in the rulings list is touched; the note must carry `34.`, `35.`, `36.` and no `37.` |
| S2 | the `**Updated:**` line only | set to the calendar date on which this order's edits land, in `America/New_York`; unchanged if that equals the value already present. The `**Seat:**` value on the same physical line is immutable |
| S3 | the `## Next session — start here` block | four changes, and no others: replace the next-action paragraph with the §4 Codex commission; record the void receipt and the fact that the §10 judgment is still owed; **record the repair report §7 closing-measurement discharge**; retain the standing bar on the derived date-occurrence report and the `M4.4` reservation in reserved-and-unadjudicated terms. The routing list, the schedule constraint, the three unratified delegation clauses, the hashing-primitive note, and the write-back-discipline note are retained |
| S4 | the `## Cursor` section's two exact spans | record the `Owner` anaphora repair as Codex-verified at 0 BLOCKER / 0 REQUIRED REPAIR, the §10 confirming read as void and recommissioned to Codex, and the derived report as still barred. Everything from `Prior context,` onward is immutable |

**S3's discharge wording, fixed here so it is not re-derived at edit time.** Repair report §7 records the
closing authorization measurement as owed. Codex V8 measured
`DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-ANAPHORA-REPAIR-WORK-ORDER-2026-08-05.md` independently at
verification opening and again after all deterministic checks, returning `33084` /
`aadca7b586c795ac6e08ede55ab4dd06329ecfddee02965c1ea8a0a726df48ea` both times. **Both are measurements by
a hashing seat taken after the architect's last edit, and neither is transcribed from the other or from
repair report §1.** The two-hash rule at revision 3 §1.3 is therefore satisfied and the §7 obligation is
discharged. **The report itself is not edited**, per §3.2; a future reader who finds §7 reading *owed* is
directed by S3 to V8. The stale §7 wording is documentary debt, closed by annotation elsewhere and not by
rewriting a contemporaneous record.

---

## 8. Void-receipt adjudication record

The architect seat writes exactly one new file:
`audit/decisions-migration-2026-07-29/M4-OWNER-CONFIRMING-READ-VOID-RECEIPT-ADJUDICATION-2026-08-05.md`.

It carries: §1 this order's revision-1 authorization identity, measured by a hashing seat before the first
edit; §2 the void receipt as received, reproduced in full, marked as evidence and not as authority; §3 the
four grounds at §2 above, each with the live-disk check that established it and the tool call that made it;
§4 the searches returning zero occurrences of `owner-flag`, `reasoning trace`, `escalation path`, and
`P35` across the migration corpus, with paths and result counts; §5 the ruling-36 disposition and its
scope; §6 the owner's seat decision of 2026-08-05 routing the rerun to Codex; §7 the closing authorization
measurement.

The receipt is reproduced **because it is the sole evidence of the event and exists only in chat.**
Recording it is not citing it: no statement in it is relied on anywhere, and the record states so.

**Every figure the architect seat produces in that record discharges nothing.** Byte length is measurable
on this connector; SHA-256 is not, and none is claimed. **A write is not evidence of itself:** every edit
is read back from disk before it is reported as applied.

---

## 9. Blockers

Execution stops and returns to the architect seat on any of:

- a §1.2 identity mismatch at re-measurement, in particular a live manifest that does not measure
  `314491` / `877941d8…`;
- a `MISMATCH` on any of the three subject substrings at §4.2, or on the M6.3 rows or M6.1 section at §4.3;
- an inequality between the opening and closing measurements of this order;
- any change to a §3.2 surface, **any manifest edit whatsoever**, or any repository mutation other than the
  two authorized new files and the four allowlisted resume-note surfaces;
- a §4 receipt that adjudicates a record outside the three subjects, `M4.4` included;
- a §4.4 item 5 finding that the `M4.3` `Owner` and `Execution` clauses are inconsistent, which returns to
  the architect seat rather than being repaired in place;
- any finding that would require a manifest repair, a change to an M6.3 ground, or a change to the M6.4
  population.

**Deadline context, not authority.** `MIGRATION_DATE` is bound to `2026-08-11`. As of 2026-08-05 the §4
read, the derived date-occurrence report, the Task 2 rerun and Task 3 rerun or supersession, the
post-assembly deterministic verification, the full 65-record and 13-wrapper non-author constitutional
review, and owner ratification are all owed against six days. **Schedule pressure authorizes nothing.** A
step skipped to meet the date is a defect carried into a ratified constitution, and Amendment 1 Clause B
is the cheaper failure. The void receipt is the current instance of the underlying risk: an unread review
returned instantly is faster than a read one and worth less than nothing.
