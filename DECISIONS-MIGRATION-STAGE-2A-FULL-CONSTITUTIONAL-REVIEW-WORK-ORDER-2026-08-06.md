# Stage 2a — full constitutional review commission, and bounded resume-note status update

**Date:** 2026-08-06 · **Authoring seat:** Architect · **Revision:** 1

**Class: commission-required review, routed.** This order commissions the review required by
`DECISIONS-MIGRATION-COMMISSION-2026-07-29.md` §4.9 over the complete 65-record and 13-wrapper Stage 2a
manifest, and it authorizes one bounded architect status update to the resume note in the same cycle. It is
not a continuation of `DECISIONS-MIGRATION-STAGE-2A-M4-RESERVATION-RECORDING-REPAIR-WORK-ORDER-2026-08-05.md`
revision 1, which is **discharged and closed**. Every edit authorized below is authorized by **this** order
and by no other.

**It opens no manifest byte.**

**Origin.** Codex returned
`audit/decisions-migration-2026-07-29/M4-RESERVATION-RECORDING-CONFIRMATION-2026-08-05.md`: **C1–C10 PASS or
MATCH, no advisory findings.** The provenance question raised against C8 — how the pre-repair null was
available to a seat that had not been given it — is **resolved in Codex's favour and accepted by this
seat**. The null existed as a Git blob before the confirmation run; Codex located and measured it by
read-only `git cat-file` enumeration; no `git hash-object -w` ran, no ref or index moved, and no Git object
was created. Reading an existing object is not a write. The sole-write claim therefore holds, C10 stands,
and the confirmation is accepted **without qualification**.

**Consequences accepted, and not reopened by this order:**

- `M4.4` / `P2#1` remains **authored, reserved, unadjudicated, and not cleared**.
- The three repaired `Owner` reasons at `M4.3` / `P2#0`, `M4.7` / `P5#0`, and `M4.11` / `P8#0` remain
  discharged as **CLEAR**. No seat re-reviews them under this order or a later one.
- The reservation-recording repair and its confirmation are **complete**.

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

### 1.2 Artifact identities

| path | bytes | SHA-256 | status |
|---|---:|---|---|
| `audit/decisions-migration-2026-07-29/target-text-manifest.md` | `314491` | `9d3283086a93daa3e0925ff539f9d98d5914cc9955035f129f3178329804fe5a` | **the subject of review. Closed to every seat for the duration of this order** |
| `DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md` | `74370` | `3b682e046a672de915f6ad75ca41ea700a72fa5098544234b9d5a54e4db69f20` | the sole mutable artifact, under the §6 allowlist |

Both rows are the **post-2026-08-06-owner-act identities**, measured by a hashing seat after the two
resume-note repairs at §8 and the manifest's 63-occurrence rebind had already landed, and before this
order's own execution begins. Neither is transcribed from an earlier record — the manifest's SHA-256 in
particular could not be, since 63 literal substitutions changed its content while its byte length stayed
unchanged at `314491`. **Both rows are re-measured, not transcribed, as the first act of execution under
§6**, on the same discipline every prior cycle in this workstream has followed.

**The resume-note pre-edit digest is a hard prerequisite,** on the same ground as the last cycle: the null
against which any reversal proof runs ceases to exist the moment the first edit lands, and a length match is
consistent with an equal-length edit. The `74370` / `3b682e04…` pair above was measured by a hashing seat
after the owner act's two resume-note repairs and is the null, provided a fresh measurement at §9 §1
confirms it unchanged. If it has changed, execution stops under §10.

The three `.frozen` snapshots stay untouched at `312411`, `308092`, and `55424`. **They are not review
inputs.** A frozen snapshot is a pre-repair state; reviewing against one reviews bytes that were
deliberately superseded.

### 1.3 The authorization identity

The architect seat has no hashing primitive. **No edit authorized by this order may be made until a seat
that can hash has returned this file's byte length and SHA-256 at revision 1, and those values are
transcribed into the record at §9 §1.** The same identity is re-measured after the last edit; opening and
closing values must be equal, both are measurements, and neither is transcribed from the other. Inequality
is a BLOCKER under §10.

**This order is immutable from the moment its revision-1 identity is taken.**

---

## 2. What this order is, and what it is not

The commission separates one judgment-heavy act — the exact constitutional wording — from every mechanical
act around it, and then requires that judgment to be checked by a seat that did not perform it. Commission
§4.9 is that check. It is the last substantive gate before owner ratification, and **no count of cleared
batches advances it.** Twelve provisional batch clearances exist. Every one of them was scoped to a batch,
returned before M5 and M6 existed, and reviewed the manifest in pieces that no seat has since read as a
whole.

**This order therefore commissions a first review, not a re-review.** A receipt that treats the batch
clearances as a prior finding population, or that narrows its work on the ground that a batch already
cleared, has misread its commission. The batch clearances are inputs about where attention has already been
spent; they are not evidence about the complete manifest.

**This order decides nothing about the manifest's merits.** It commissions the review, pins what is to be
reviewed, and states how a receipt discharges its commission. Findings return to the architect seat for
adjudication. **No seat repairs anything under this order.**

---

## 3. Seat, and producer≠checker

**The review routes to Codex, by owner decision of 2026-08-06.**

**It is barred to the Claude seat.** Claude authored all 65 M4 records, M5, and M6. Producer≠checker attaches
to the seat that produced, not to a model name, and a later Claude instance reviewing its predecessor's
output does not satisfy the rule. This is a rule consequence and does not change if Claude usage becomes
available.

**Codex is eligible.** Codex authored no target statement, no field disposition, no omission ground, no
wrapper record, and no standing ruling. Its prior work in this workstream is deterministic verification and
reading commissions, neither of which is content production.

**One eligibility limit, stated so it is not discovered late.** Codex authored the batch-local deterministic
results at M4.45–M4.66 and the verification receipts for the M6 and `Owner` repairs. **Those are not
discharged by this order and are not re-run under it.** Where this review's method would otherwise rest on a
Codex deterministic result, it rests instead on a fresh read of the live bytes — the review is a reading
commission throughout, and a seat may not check its own prior arithmetic in place of reading the text that
arithmetic described.

---

## 4. Scope

### 4.1 Open

- The review population at §5.1, read against the live sources at §5.3.
- The six Codex deliverables at §5.8.
- The seven resume-note surfaces at §6.
- One new standing ruling at §7.
- One architect status record at §9.

### 4.2 Closed — a change to any of these is a BLOCKER

- **The entire manifest**, all `314491` bytes, for the full duration of this order and by every seat. No
  manifest edit is authorized here for any reason, **including one a finding appears to require.** A finding
  is written down and returned; it is not applied.
- `DECISIONS.md`.
- Standing rulings 1–36, verbatim. Ruling 37 is added under §7 and no existing ruling byte is opened.
- Every prior work order, verification, review file, receipt, and repair report — including
  `M4-RESERVATION-RECORDING-CONFIRMATION-2026-08-05.md`, which is closed and complete.
- The three `.frozen` snapshots.
- Every resume-note byte outside the seven surfaces at §6.

### 4.3 Sequence

1. Architect re-measures §1.2, applies §6, mints §7, and writes §9. **Manifest untouched throughout**, so
   the §1.2 manifest pin holds unchanged into the review.
2. A hashing seat measures this order at close; §9 §6 records the closing identity.
3. Codex executes §5 against the pinned manifest.
4. Findings return to the architect seat. Adjudication and any repair are a separate commission.

Step 3 does not begin before step 2 completes.

---

## 5. The review commission — Codex

**Authority:** commission §4.9, as amended by Amendment 1 Clause A §1.2.

### 5.1 Population — 78 units, plus the structural surfaces

| tranche | units | manifest locators |
|---|---:|---|
| A | 18 live records | `M4.2`–`M4.19` — Part A, `P1#0` through `P17#0`. **Contains `M4.4` / `P2#1`** |
| B | 19 live records | `M4.20`–`M4.38` |
| C | 18 live records | `M4.39`–`M4.56` |
| D | 10 live records | `M4.57`–`M4.66` |
| E | 13 archive wrappers | `M5.5.1`–`M5.5.13`, plus `M5.6`'s thirteen archive-index lines and `M5.7`'s six-row retired-identifier register |
| F | structural and cross-cutting | `M5.1`–`M5.4`, `M6`, and the §5.5 whole-manifest checks |

18 + 19 + 18 + 10 = **65**. 65 + 13 = **78**.

**Tranche boundaries are administrative and carry no authority.** They exist because a single 78-unit pass
in one session is where a receipt goes thin, and a thin receipt on this commission is the expensive failure.
A finding may cross a boundary; record it in the tranche where it is found and again in tranche F.

### 5.2 Commission §4.9's nine obligations, mapped

Stated in full so no obligation falls between this order and another.

| §4.9 obligation | disposition under this order |
|---|---|
| re-derive all 65 kind/status/force/destination assignments from the ratified classification record | **in scope** — tranches A–D |
| check every literal statement for semantic preservation and prohibited duplicated evidence | **in scope** — tranches A–D, the core of §5.4 |
| check P/R core-versus-attachment grouping | **in scope** — tranche F |
| check all name-addressed identity titles for collisions and reserved-prefix shapes | **in scope** — tranche F, across live `I`/`T` titles **and** the 13 wrapper labels together |
| verify all dates from recorded effective dates rather than document-migration date | **in scope** — tranches A–E, per record |
| verify each present `Evidence`/`Owner` path is tracked | **in scope** — tranche F, against `git ls-files`, **excepting `E038`'s under Amendment 1 Clause A**, for which the check is byte-exact equality with the manifest's pinned normalized-archive filename |
| independently reproduce all 13 source slices and hashes from `MIGRATION_BASELINE` | **in scope** — tranche E |
| reconcile 80 rows exactly | **in scope** — tranche F, against commission §3.1 |
| confirm no implementation or parser change has begun | **in scope** — tranche F |

**Not in scope, and separately owed:** the Task 2 rerun over the 43 records at `M4.2`–`M4.44`; the Task 3
rerun or explicit supersession; the derived date-occurrence report and its six-step sequence at `M7.5`; the
post-assembly deterministic verification. None of those is discharged by this order and none discharges it.

### 5.3 What the review reads against

**Authorities:**

- `git show MIGRATION_BASELINE:DECISIONS.md` — the frozen source.
- `DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md` — verbatim source and byte spans. Ordered
  by source entry ID: `E044` sits at packet entry 36 rather than beside `E018`, and `E032` and `E036` are
  archive wrappers rather than live blocks.
- `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md` and Amendment 1.
- The ratified taxonomy, format specification, and fixture file.
- The live repository, for every claim a record makes about code.

**Not authorities.** The Part A–D architect drafts are **preparatory**, per standing ruling 12: where the
manifest diverges from a draft, the manifest governs and the record states the supersession. A finding of
the form *the manifest differs from the draft* is not a finding. **The grammar fixtures `F1`–`F8` are
illustrative and are not date or content controls.** The `.frozen` snapshots are not inputs.

### 5.4 Method — the reading standard

**1. Limb enumeration, per standing ruling 18.** For every record, enumerate the operative limbs of its
source before comparing, then account for each one explicitly as retained in the target statement, carried
by another **named** target entry, or superseded by a **named** later source. A limb absent from both the
target statement and every other target entry is **deleted, not compressed**. This is the dominant defect
class of this workstream: `P23#0` alone dropped four limbs, all four passed a prior independent review, and
each was found only by reading source against target limb by limb. **Fluent, plausible compression is
exactly what this defect looks like from the outside.**

**2. Population resizing is a defect in both directions, per rulings 7 and 29.** Widening a governed
population requires owner ratification. Narrowing one is the same defect class and is harder to see, because
narrowing reads as precision. Check the governed term against what actually enforces it.

**3. Where a source list has a live owner, compare it with the owner, per ruling 32.** Fidelity to a source
list does not answer a stale list. Where no live owner exists, ruling 18 governs unmodified — the comparison
is the step that decides which ruling applies and it cannot be replaced by reading the punctuation.

**4. `Evidence` and `Owner` have different tests, per rulings 11, 23, 28, and 33.** `Owner` names the one
tracked path that owns the **whole live statement**, and is defeated by an outside limb with its own
enforcement surface in another tracked path — not by a clause with no enforcement surface anywhere.
`Evidence` names the one tracked source carrying evidence, measurement, provenance, or method the statement
is forbidden to restate, and may not contradict or materially misrepresent any limb the statement keeps.
Check each `M6.3` ground against `M6.1`'s `field` column: an `Evidence` row carrying an `Owner`-only ground
is a defect, and so is the reverse.

**5. A candidate population is not a finding population, per ruling 34.** Where a mechanical search is used,
report the search population and the retained set **separately**, and state a ground for every exclusion. A
seat that treats the hit list as the finding list reports correct text as defective; a seat that narrows
silently presents a judgment as a measurement.

**6. Cover the heading and reread the statement, per ruling 27.** A limb surviving only in a name-addressed
title has left the governed text. The format checker never reads a title as a statement.

**7. Read the code, not the description of the code.** Every record claiming that a path enforces something
is checked against that path on live disk.

### 5.5 Whole-manifest checks — tranche F

Nine checks, each reported with its measured population:

| # | check |
|---:|---|
| F1 | entry-index rows: exactly 65, each matching its block's heading and summary; declared total states 65 |
| F2 | live composition: 37 `P` across 25 distinct live `P` identifiers, 6 `R` (`R1`–`R6`), 19 `I`, 3 `T` |
| F3 | `P`/`R` core-versus-attachment grouping, and attachment ordinals contiguous within each core |
| F4 | name-addressed title uniqueness across all live `I`/`T` titles **and** all 13 wrapper labels in one namespace; no title begins `P<n> ` or `R<n> `; each wrapper label matches its §8 archive-index label byte-for-byte |
| F5 | citation integrity: every `I:`/`T:` citation matches the ruling-15 matcher, sits inside a backtick run, is not split across a physical line, and resolves to an existing title |
| F6 | governed field-path population: every present `Evidence`/`Owner` resolves to exactly one tracked path, verified against `git ls-files`; `E038` excepted under Clause A and checked for byte-exact equality with the pinned archive filename instead |
| F7 | 80-row reconciliation against commission §3.1: 65 live + 13 wrappers + `E053` structural + `E037` `MERGE_INTO` = 80, exact. `E037` contributes its literal clause in all three of `P8`, `P2`, `P5`, and mints no identifier |
| F8 | retired-identifier register: exactly six rows — `P9`, `P12`, `P18`, `P22` `RETIRED`; `P13`, `P14` `NEVER ASSIGNED`; the four ID-addressed wrappers are exactly the four retirements |
| F9 | no implementation or parser change has begun: `DECISIONS.md` byte-identical to baseline; `lib/decisions-format.ts`, `scripts/tests/decisions-format.ts`, and every other commission §5.2 Stage 2b path unmodified; branch and HEAD unchanged; `git status --porcelain` shows untracked Stage 2a paths only |

**Sentence-count grammar is not a tranche F check.** It is the Task 2 rerun's subject, that run is separately
owed, and folding it in here would let a deterministic result stand in for a reading judgment.

### 5.6 `M4.4` / `P2#1` — the reserved record

**This is the record the reservation was made for, and this review is where it is adjudicated.**

`M4.4` carries an item-10 `Owner` disposition of `OMIT`; same reason — an anaphor. Unlike the three repaired
at `M4.3`, `M4.7`, and `M4.11`, **no repair moved its antecedent**, so it sits outside the causal surface of
the 2026-08-05 return. Ruling 35 reaches the anaphor whose antecedent was replaced beneath it; it does not
by itself adjudicate an unchanged one, and **it must not be read as certifying any surviving inherited
reason.** Requiring self-contained field reasoning and clearing an inherited reason are incompatible
positions, and ruling 35 takes only the first.

**Required of the receipt, in tranche A:**

1. Quote the live `M4.4` item-10 `Evidence` disposition and the live `Owner` disposition, both verbatim from
   the pinned manifest.
2. Quote the actual antecedent the `Owner` anaphor refers to, and state whether that antecedent's ground is
   `Evidence`-only, `Owner`-only, or serves both, checked against `M6.1`'s `field` column.
3. Adjudicate the `Owner` classification **on its own two grounds** — the `M6.3` ground and the live
   statement's ownership test — rather than on the anaphor's survival.
4. Return a disposition in one direction: **CLEAR** on stated grounds, or **DEFECT** with the defect named.

**A receipt may not return `M4.4` as still reserved.** The reservation was made because no seat had
adjudicated it; a review that repeats the reservation has done the one thing the reservation was holding a
place for. **Nothing in this order predisposes the outcome, and no seat may read the reservation, or its
long survival, as evidence in either direction.**

### 5.7 Contact and pinning, per ruling 36

A receipt on a reading commission **pins the artifact by byte length and digest, names the records it was
commissioned over, and quotes each live subject substring it adjudicates.** These are mechanical
requirements, stated here so the test is mechanical for the producing seat and for the adjudicating one.

A receipt that adjudicates a record outside its commissioned tranche, or that asserts a mutation the pinned
artifact does not contain, is **void for the whole tranche** and discharges nothing — not merely defective on
the offending entry. Correct branch, HEAD, and no-mutation statements salvage nothing: repository identity is
available without reading the subject.

**Quotation is a contact test, not a review.** A receipt that quotes every subject and reasons badly about it
is a bad review, adjudicated on its merits and returnable. A receipt that cannot quote them has not reached
the merits at all. **The contact test never substitutes for the substantive one.**

**On null results, and stated as a floor.** A tranche returning no findings is possible and is not
suspicious in itself. But a zero-finding tranche discharges feasibility only, never correctness, and its
receipt therefore carries the same per-record limb enumeration and the same quotations as a tranche that
found something. **A receipt whose brevity is its own evidence of thoroughness is the shape this workstream
has already been burned by.**

### 5.8 Deliverables

Six files under `audit/decisions-migration-2026-07-29/`. **These are the sole authorized Codex writes.** No
repair, staging, commit, push, stash, reset, clean, or checkout.

| file | covers |
|---|---|
| `FULL-REVIEW-TRANCHE-A-2026-08-06.md` | `M4.2`–`M4.19`, including the §5.6 `M4.4` adjudication |
| `FULL-REVIEW-TRANCHE-B-2026-08-06.md` | `M4.20`–`M4.38` |
| `FULL-REVIEW-TRANCHE-C-2026-08-06.md` | `M4.39`–`M4.56` |
| `FULL-REVIEW-TRANCHE-D-2026-08-06.md` | `M4.57`–`M4.66` |
| `FULL-REVIEW-TRANCHE-E-2026-08-06.md` | the 13 wrappers, index lines, and retired register |
| `FULL-REVIEW-DISPOSITION-2026-08-06.md` | tranche F, the cross-cutting checks, and the single §4.9 disposition |

Each tranche file is **closed when written** and is not reopened by a later tranche. A later tranche that
changes an earlier one's judgment records the change in tranche F and says which entry it supersedes.

Each file opens with: this order's revision-1 identity, re-measured; the manifest pin, re-measured; the
records it was commissioned over; and the branch and HEAD.

**Per-record entry format,** for each of the 78:

1. record locator and permanent identifier or name-addressed title;
2. source entry ID(s) and packet locator;
3. the enumerated source limbs, each marked retained / carried by a named entry / superseded by a named
   source / **deleted**;
4. field-by-field disposition check, with each `Evidence`/`Owner` call tested against §5.4 item 4;
5. date check, against the recorded effective date;
6. verdict: `CLEAR`, `FINDING`, or `QUESTION`, with a stated ground.

`QUESTION` is available and is not a weaker `FINDING`. It is for a call the reviewing seat cannot resolve
from the authorities available, and it returns to the architect seat like any finding.

### 5.9 Disposition

The tranche F file carries exactly one commission §4.9 disposition: **`ACCEPT`**, **`REVISE`**, or
**`REFUSE`**. Only `ACCEPT`, followed by owner ratification of the exact manifest bytes, authorizes Stage 2b.

`REVISE` is the expected outcome of a first full review of a 314KB architect-authored constitution and
carries no adverse implication. **Do not shade a finding to protect a deadline.** `MIGRATION_DATE` binding is
an owner act and no reviewing seat's disposition changes it.

### 5.10 What this receipt may not do

- It may not repair anything, in the manifest or elsewhere.
- It may not re-review the three `Owner` reasons at `M4.3`, `M4.7`, `M4.11`. **Discharged.** A receipt
  re-arguing them has exceeded its commission.
- It may not re-run or re-report the batch-local deterministic results, the sentence-count grammar, or the
  date-occurrence census.
- It may not treat a prior batch clearance as evidence, in either direction.
- It may not read a `.frozen` snapshot or an architect draft as an authority.
- It may not resolve a `QUESTION` by choosing the reading that requires no change.

---

## 6. Resume-note allowlist — exactly seven surfaces

Applied by the architect seat before the review begins. **The manifest is not opened.**

| id | surface | change |
|---|---|---|
| S1 | the `**Updated:**` line, physical line 3 | set to the landing date in `America/New_York`. `**Seat:** Architect` is immutable |
| S2 | `## Next session — start here`, the task line and immediate-next-action paragraph, physical lines 7–20 | replace with this order's commission: the review population, the Codex routing, the six deliverables, and this order's revision-1 identity once §1.3 is satisfied |
| S3 | the confirming-read paragraph, physical lines 22–31 | record the 2026-08-05 confirmation as returned **C1–C10 PASS, no advisory findings**; record the provenance clarification as accepted and the sole-write claim as holding; record the reservation-recording repair and its confirmation as **complete** |
| S4 | the derived-report bar paragraph, physical lines 83–89 | re-point: the bar now runs to the completion of this review and the `M7.5` report sequence, not to the discharged §7 confirmation |
| S5 | the two `## Cursor` spans at physical lines 170–171 and the `Next:` paragraph at 437 | record the confirmation as cleared and name this review as the next action. **Everything from `Prior context,` onward is immutable** |
| S6 | the `**Codex:**` routing bullet, physical line 112 | replace the discharged confirming-read limb with this review commission. The Task 2 rerun, the Task 3 rerun-or-supersession, the derived-report steps, and the post-assembly verification limbs are **retained**, because none is discharged |
| S7 | the `**Schedule constraint.**` paragraph, physical line 122 | restate the owed-work list and the day count as of the landing date. **The bound value is whatever the owner has bound at landing; this order does not select, infer, or default it.** The Clause B procedure sentences are retained verbatim. **Already applied,** directly under the owner's 2026-08-06 `MIGRATION_DATE` act and its own Clause B production-boundary authority — not under this order's §1.3 hash-gate, which had not yet been satisfied when that act occurred. A seat executing this order finds S7 already reads correctly and makes no further change there |

**Retained and not opened:** the `M4.4` reservation paragraph at lines 73–77, which remains correct and
whose routing target this order now supplies; the void-receipt paragraph; the revision-3 discharge
paragraph; the hashing-primitive note; the write-back note; the three unratified delegation clauses; the
architect and full-review routing bullets; the process note; every ruling byte; and every byte of every
other section.

---

## 7. One new standing ruling — 37

**Authorized: exactly one.** At closeout the note carries `34.`, `35.`, `36.`, `37.` and no `38.`, and
rulings 1–36 are byte-identical.

> **37. A read-only recovery of a superseded null is not a write, and a sole-write constraint is a
> constraint on object creation and ref movement.** The 2026-08-05 confirmation reproduced a pre-repair
> null it had not been handed, under a commission authorizing exactly one file write. That is answerable,
> and the answer is mechanical rather than a matter of trust: the null existed as a Git blob before the
> run, `git cat-file` enumeration reads existing objects, and no object was created, no ref moved, and no
> index changed. **Rule:** a verification seat may recover a superseded artifact from existing repository
> objects, and must report the object ID and its own independent measurement of the recovered bytes. It may
> not create an object — `git hash-object -w`, `git add`, `git stash`, and any ref update are writes and are
> forbidden where the commission authorizes one file write. **Corollary, narrowed to what the
> mechanism actually supports:** where the architect seat cannot hash, a pre-edit digest recorded by a
> hashing seat is a convenience and not the only route to a reversal proof, so a lost or unrecorded null
> **may** be recoverable — never automatically, and only where a pre-existing, independently-verifiable
> repository object can be located for it. Recovery is a per-case finding, not a standing guarantee that
> every lost null has a surviving object; most will not. Where no qualifying object exists or can be
> independently verified, the evidentiary gap remains a blocker under §10, exactly as it would without this
> ruling, and object creation to manufacture one remains forbidden under a sole-write commission. A seat
> that recovers a null this way says so in the receipt, with the object ID and its own independent
> measurement, rather than presenting the null as if it had been supplied. Found 2026-08-06 on the
> provenance question raised against C8.

---

## 8. `MIGRATION_DATE`

**Bound to `2026-08-18`,** by owner act of 2026-08-06, superseding the `2026-08-11` candidate this order
was drafted against. The act is recorded at
`DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-08-06.md` and was executed directly under
Amendment 1 Clause B's production boundary — owner selects, architect re-renders — rather than under this
order, which authorizes no date change itself and took no position on whether one was warranted. The
manifest's 63 already-authored date-dependent occurrences were deterministically re-rendered under that
act; §4.2's closed-manifest instruction bound this order's own review commission and did not and could not
bar a separate, superior owner act from touching the manifest before this order's identity was taken. §6
S7 reflects the new binding, applied under that same act.

**A second resume-note surface was also repaired under the same act, outside §6's allowlist entirely.**
The resume note's dedicated `## MIGRATION_DATE` section — never one of the seven §6 surfaces, and
therefore always outside this order's jurisdiction rather than newly exempted from it — stated the
superseded `2026-08-11` binding, pointed at the superseded 2026-07-31 supersession record, and described
a two-surface re-rendered population that predated M5's authoring. It has been rewritten wholesale under
the 2026-08-06 act's own status-log-maintenance authority to state the current binding, the current
record, and the current 63-occurrence population, on the same production-boundary ground as the schedule
paragraph. Both resume-note updates were completed, and read back from live disk, before this order's
§1.3 identity was taken; both are **closed under this order** and are not reopened by §6's later
execution.

**No seat may select, infer, or default a further replacement.** Any further change is again an owner act,
and until the first exact-byte ratification lands it remains a pre-ratification candidate supersession
rather than the full Amendment 1 Clause B procedure.

**Recorded as context, not as authority.** As of 2026-08-06, twelve days remain, and the following are
owed: this review; adjudication of its findings and any resulting repair; the Task 2 rerun over 43 records;
the Task 3 rerun or supersession; the six-step derived date-occurrence report; the post-assembly
deterministic verification; and owner ratification. **Schedule pressure authorizes nothing.** A ratified
constitution asserting that a record was reviewed when no seat reviewed it is the expensive failure; a
missed candidate date is a bounded owner act.

---

## 9. Architect status record

The architect seat writes exactly one new file:
`audit/decisions-migration-2026-07-29/FULL-REVIEW-COMMISSION-STATUS-RECORD-2026-08-06.md`, carrying:
§1 this order's revision-1 identity and the fresh §1.2 re-measurements, taken **before** the first edit;
§2 the seven surfaces as read back from disk; §3 the acceptance of the provenance clarification and of the
confirmation, with grounds; §4 ruling 37 as minted; §5 architect-measured post-edit state, labelled as the
producer's self-report; §6 the closing authorization measurement.

**§6 is filled in place at closeout and this record is not marked closed until it carries a measurement.**
Every architect-produced figure discharges nothing. **A write is not evidence of itself:** every edit is read
back from disk before it is reported as applied, and every absolute count is counted from a live listing
rather than estimated.

---

## 10. Blockers

Execution stops and returns to the architect seat on any of: a §1.2 identity mismatch at fresh measurement;
an inequality between the opening and closing measurements of this order; **any manifest edit whatsoever, by
any seat, at any point**; any change to a §4.2 closed surface; any change to a ruling byte other than the
§7 addition; a tranche receipt that cannot quote its live subjects; a receipt adjudicating a record outside
its tranche; any attempt to repair a finding rather than report it; and any return of `M4.4` as still
reserved.
