# M4 `Owner` anaphora repair — architect repair report

**Date:** 2026-08-05 · **Seat:** Architect
**Authorizing order:** `DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-ANAPHORA-REPAIR-WORK-ORDER-2026-08-05.md`
revision 3.

**STATUS: APPLIED — architect editing under this order is closed.** All three manifest `Owner` substrings
and all four resume-note surfaces are applied and read back from disk. The order's §9 verification is now
runnable. One item remains owed from this seat and is named at §7.

**This report is the producer's status record and evidence. It is not proof of correctness.** Every value
in it that this seat measured is this seat's own measurement of its own work, and is superseded by Codex's
independent verification under revision 3 §9 and by the GPT confirming read under §10.

## 1. Authorization basis — recorded before the first edit

| item | value |
|---|---|
| Authorizing order | `DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-ANAPHORA-REPAIR-WORK-ORDER-2026-08-05.md`, revision 3 |
| Order byte length | `33084` |
| Order SHA-256 | `aadca7b586c795ac6e08ede55ab4dd06329ecfddee02965c1ea8a0a726df48ea` |
| Measuring seat | Luke (owner), personally, `shasum -a 256` in a local shell against the live worktree |
| Corroboration on length | independent architect-seat directory measurement returned `33084` before the digest was taken |
| Branch / HEAD | `codex/decisions-migration` / `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |

**Revisions 1 and 2 of the order carry no identity, were never hashed, and were never executed.** Revision
2's measured `30630` bytes are recorded at order §0 as the length of a superseded draft only.

**Provenance note, which is the point of the two-hash rule.** The architect seat has no hashing primitive.
The digest above was not produced by this seat and is not reproducible by it. The closing measurement at §7
is taken afresh by a hashing seat after the last edit and is never transcribed from this section.

This section was written to disk **before** the first manifest edit, as revision 3 §1.3 requires.

## 2. Pre-repair identities — re-measured, not assumed

Order §1.2 requires these re-measured as the first act of execution. **Measuring seat: Luke (owner),
personally**, on 2026-08-05, `shasum -a 256` in a local shell (`bash-3.2`) against the live worktree, with
the raw command output supplied to this seat. Byte lengths independently corroborated by architect-seat
directory listing in the same session. **Matching a pinned value is not itself evidence of who measured
it**; the attribution above is recorded because the owner ran the commands, not because the values agreed.

| path | bytes | SHA-256 | matches §1.2 pin |
|---|---:|---|---|
| `audit/decisions-migration-2026-07-29/target-text-manifest.md` | `313733` | `bc01e0be8d4ed291e0fe1ab21ccae088ff96be08a5ab50f129c1b5fcb771c264` | yes |
| `DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md` | `59782` | `7395262c1772a945957a1f1d735af1dd1f9335c970400a2f6bb6c2099778f18d` | yes |

Frozen snapshot byte lengths, architect-measured before and after the edits and unchanged at `312411`,
`308092`, and `55424`. No snapshot was created, replaced, or touched under this order.

`git status --porcelain` immediately before the first edit: untracked Stage 2a paths only; zero staged
changes; zero modified tracked files.

**Consequence for the anchors.** The manifest digest measured immediately before the repair equals the
digest Codex measured on 2026-08-04. The item-10 blocks this seat read live earlier in the session were
therefore byte-identical to the bytes edited, and that equality — not a fresh visual read — is what
licensed the `oldText` anchors. A `dryRun` preceded each live call regardless.

## 3. The three replacement substrings, as read back from disk

All three remain `OMIT`. No M6.3 ground was changed and no disposition was reversed. None of the three
contains an M6.1 ground token, per order §5.1.

**Boundary convention for the blocks below.** Each block begins at the backtick of `` `Owner` `` and ends
at the last visible character of the opened substring. Order §4 places the whitespace *preceding* a
disposition inside the *preceding* substring, so the leading whitespace shown in the manifest before
`` `Owner` `` belongs to the immutable `Evidence` substring and is **not** reproduced here. The trailing
whitespace that precedes `` `Execution` `` **is** inside the opened substring; because it is invisible in a
code block it is described in words after each one rather than shown.

### 3.1 `M4.3` / `P2#0` — physical lines 390–393

```text
`Owner` — `OMIT`; the review-scoping and self-certification limbs are carried by `AGENTS.md`'s
    risk-tiered verification floors, while the lane-declaration limb is carried by each active
    generation lane's own contract rather than by any central path, so no one tracked path carries
    the complete statement.
```

Trailing bytes of the opened substring: a single space after `statement.`, immediately before
`` `Execution` `` on the same physical line.

**Derivation.** Item 8's statement carries three operative limbs. The §4 feasibility mapping locates the
first two in `AGENTS.md`'s risk-tiered verification table and its census-drift procedure, and the third in
per-lane generation contracts, with `AGENTS.md` silent on it. Distinct tracked paths carry distinct limbs
and none carries all three, which is the `NO-SINGLE-OWNER` fact stated in the record's own terms. Order
§5.3 required this to avoid asserting that *no* tracked path carries the rule, which would be the adjacent
`NO-EXECUTABLE-OWNER` ground; the reason as written names carriers rather than denying them.

### 3.2 `M4.7` / `P5#0` — physical lines 611–614

```text
`Owner` — `OMIT`; `BANK-REVIEW-LEDGER.md` records what the promotion pipeline did
    rather than owning the rule that governs it, and the self-review prohibition and the
    lane-declaration obligation bind before promotion runs, so they reach beyond anything the ledger
    or the promotion machinery enforces.
```

Trailing bytes of the opened substring: a newline after `enforces.` followed by the record's four-space
continuation indent, with `` `Execution` `` opening the next physical line. That newline-plus-indent is
byte-identical to its pre-repair form.

**Derivation.** The ground pair requires both limbs and order §5.3 made a single-limb reason a failure.
The first clause carries the authority limb: the ledger is the pipeline's operational record, not the
owner of the rule the pipeline implements. The second carries the partial-ownership limb: the self-review
prohibition and the lane-declaration obligation attach before promotion runs at all, so no part of the
promotion machinery could own them even if the ledger were set aside.

### 3.3 `M4.11` / `P8#0` — physical lines 838–840

```text
`Owner` — `OMIT`; the upstream-ownership, read-only-downstream, and drop-rather-than-guess
    limbs attach at different stages of the authoring and transformation chain, and no single tracked
    path carries all three.
```

Trailing bytes of the opened substring: a single space after `three.`, immediately before
`` `Execution` `` on the same physical line.

**Derivation.** Taken from the record's own item 8 and item 12, which identify the three limbs and the
cross-seat authoring character of the contract. No live-path assertion is made beyond what the record
already establishes, which is the alternative order §5.1 permits where a path has not been read; the
reason therefore turns on the distribution of the limbs across stages rather than on a claim about any
named file.

### 3.4 Boundary compliance

Each anchor reproduced the immutable leading whitespace byte-for-byte in its replacement, so no `Evidence`
byte moved. The trailing whitespace before `` `Execution` `` was preserved in shape in all three records:
`M4.3` and `M4.11` keep a single space on the same line, `M4.7` keeps its newline plus four-space indent.
No `` `Execution` `` byte moved on any of the three, and no continuation indent differs from the record's
existing four spaces.

### 3.5 One adjacency observed and deliberately not repaired

`M4.3`'s `Execution` disposition, which is immutable under order §3.2, reads that the entry decides a
governance practice **with no implementable owner**. The new `Owner` reason names `AGENTS.md` and the lane
contracts as carriers. These are consistent on the reading this seat applied — carrying an obligation in
governing text is not the same as a code path executing it, and `Execution` is answering the
implementability question rather than the ownership question — but the two clauses sit four lines apart and
a reader who treats *implementable owner* as synonymous with the `Owner` field will read the record as
self-contradicting.

**Not repaired here.** The `Execution` bytes are closed, and opening them would be the widening this order
exists to avoid. **Flagged expressly to the confirming read under order §10 items 1 and 3**, and it is a
candidate finding rather than a cleared point. The reviewing seat's provisional view, recorded because it
bears on weight rather than on outcome, is that it is a legitimate confirming-read question but not
presently a contradiction, and that it authorizes no widening of this repair.

## 4. `M4.3` feasibility gate — carried forward from order §5.4

Executed on 2026-08-05 **before** revision 3 was frozen; result **PASS**. Paths read live: `AGENTS.md` in
full; `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md`; `gpt-evergreen-generation-prompt.md`; plus
repository-wide searches under three vocabularies.

| operative limb of the `P2#0` statement | live tracked surface carrying it |
|---|---|
| judgment-dependent work requires independent review | `AGENTS.md` — risk-tiered minimum-verification table; bank-content row requiring the full promotion pipeline including `producer≠checker review` |
| purely mechanical work may self-certify against a deterministic check with an independent null | `AGENTS.md` — the same table's reduced tiers, with the census-drift procedure supplying the independent null through `npm run census:check` |
| every active generation lane declares producer provenance and independent-review routing | not `AGENTS.md`, which is silent on it; carried per lane by `gpt-evergreen-generation-prompt.md` and `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md` |

`NO-SINGLE-OWNER` is supported and M6.3 row 3 stands. The dating uncertainty and the ruling-34 false
negative are recorded at order §5.4 and are in scope for the confirming read under order §10 item 3.

## 5. Ruling 35 as written

Inserted at resume-note physical line 755, after ruling 34 and before the `## MIGRATION_DATE` heading.
The note carries `33.`, `34.`, and `35.` and no `36.`, verified by search after the write. Opening
sentence and rule, as read back from disk:

> **A byte-identity proof over a substring proves the substring did not move; it does not prove the
> substring still says what it said.**

The ruling then records: the mechanism, that an anaphor makes a disposition's meaning depend on bytes
outside itself and an allowlist that opens the antecedent while closing the anaphor is correct about the
bytes and wrong about the meaning; the rule, that a field disposition never states its ground by reference
to another field's disposition where the two fields have different eligibility tests, with `Evidence` and
`Owner` named under target §1 and ruling 23, and with the requirement that a genuinely shared ground still
be stated in each disposition's own terms; the verification consequence, that where an allowlist opens text
another closed substring depends on, byte identity is not sufficient evidence and a reading seat must
adjudicate the pair, with the 2026-08-04 verification recorded as **correct within its commission** and the
gap located in the commission's design rather than its execution; the limit, that the ruling reaches only
the anaphor whose antecedent was replaced beneath it, **must not be read as certifying any surviving
inherited reason**, and leaves an unchanged anaphor owed an adjudication rather than settled in either
direction, with `M4.4` / `P2#1` named as reserved without adjudication; the enforcement limb, that ruling
34 governs its own application so a mechanical search returns a candidate population and every exclusion
carries a stated ground; and its provenance, found 2026-08-05 by the GPT confirming read and repaired the
same day under revision 3.

**No worked counterexample is stated**, per order §6.1 limb 4. `M4.4` appears only as an instance of the
owed-an-adjudication category, never as a certified compliant construction.

## 6. Resume-note surfaces as applied, and architect-measured state

| id | surface | outcome |
|---|---|---|
| S1 | ruling 35 after ruling 34 | applied at line 755; `33.`, `34.`, `35.` present, no `36.` |
| S2 | the `**Updated:**` line | **no-op.** Order §7 sets it to the landing date and leaves it unchanged where that equals the value present; the note already read `2026-08-05` and the repair landed 2026-08-05, so no byte changed. The `**Seat:**` value on the same line is untouched |
| S3 | the `## Next session — start here` block | applied. Task line, immediate-next-action, and what-landed paragraphs rewritten to this order's verification and confirming read; the `M4.4` reservation added in reserved-and-unadjudicated terms; a write-back discipline note added; architect and Codex routing bullets and the schedule sentence updated. The hashing-primitive paragraph, the routing list's remaining bullets, the three unratified delegation clauses, the schedule constraint's Clause B text, and the 2026-08-01 process note are retained |
| S4 | the two `## Cursor` spans | applied. S4a records the M6 repair as Codex-verified at 0 BLOCKER / 0 REQUIRED REPAIR, the confirming read as `REVISE, narrowly`, and the three `Owner` repairs as pending verification. S4b names this order's §9 verification and §10 confirming read as next and bars the derived report until both clear. Everything from `Prior context,` onward is untouched |

| item | value |
|---|---|
| Manifest byte length | `314491`, from `313733` |
| Manifest, characters as reported by the edit tool | `312712`, from `311954` |
| Resume note byte length | `65124`, from `59782` |
| Resume note, characters as reported by the edit tool | `64785`, from `59454` |
| Manifest and resume-note SHA-256 | **not measured by this seat**; owed to the §9 verification |
| Authorizing order, re-measured after the last edit | `33084` by architect directory listing — equal to §1's length; the digest is owed at §7 |
| All three `.frozen` snapshots | untouched, at `312411`, `308092`, and `55424` |

Architect-measured invariants at this state:

- Four `same reason` occurrences existed in the manifest before the repair, at physical lines 390, 455,
  608, and 832. Two survive: `M4.4`'s at line 458 and the `R5#0` construction at line 2885, both shifted
  by the lines added above them and neither edited.
- The three opened substrings no longer contain `same reason`.
- The resume note carries rulings `33.`, `34.`, `35.` and no `36.`

Every figure in this section is this seat's own measurement of its own work and **discharges nothing**.
Byte length is measurable on this connector; SHA-256 is not, and none is claimed.

## 7. Closing authorization measurement — owed

**Owed and not yet taken.** A hashing seat re-measures
`DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-ANAPHORA-REPAIR-WORK-ORDER-2026-08-05.md` after this last edit.
The two-hash rule is satisfied only if the closing values equal §1's:

- byte length `33084`
- SHA-256 `aadca7b586c795ac6e08ede55ab4dd06329ecfddee02965c1ea8a0a726df48ea`

Inequality is a BLOCKER under order §11. This value is **measured afresh and never transcribed from §1**;
the architect-seat length agreement recorded at §6 is corroboration on length only and is not the closing
measurement.

## 8. Process events, recorded because neither is visible in the bytes

**An `edit_file` call aborted and applied nothing.** The `dryRun` over the three manifest edits succeeded.
On the live call, the replacement text for `M4.11` was submitted in that edit's `oldText` field. The call
is atomic, so the anchor mismatch aborted all three and no byte moved; the manifest was re-read before the
retry and still carried all four `same reason` occurrences at their original lines. The retry with the
correct anchor applied all three. **This is the identical failure mode recorded at
`M6-REPAIR-REPORT-2026-08-04.md` §8.3**, which reported the same paste-into-`oldText` error on that
repair's third batch. Recorded as an observation and **deliberately not proposed as a standing ruling**:
order §6 authorizes exactly ruling 35 and no other, and a second occurrence of a known mechanical slip is
evidence about this seat's process rather than a new governance finding. If it warrants ruling status it
arrives by amended order.

**A claimed write that had not been made.** Earlier in this session the architect seat reported revision 3
of the authorizing order as written to disk before the write call was issued. GPT's read of the live
repository found revision 2 still in place and returned the discrepancy. The correction is recorded at
order §0 as well as here and at resume-note S3. It is the reason §3 of this report is written from a disk
read-back rather than from the text this seat intended to write, and the reason order §8 now states that a
write is not evidence of itself.

**Two order revisions died unhashed.** Revisions 1 and 2 were each returned by the owner before an
identity was taken — revision 1 on three defects, revision 2 on two. Recorded because the absence of an
identity is what made those returns cheap: an instrument that has not been frozen can be corrected in
place, and freezing early to save a round trip would have converted each return into an amended-order
cycle.

## 9. Exact next action

1. A hashing seat: the closing measurement at §7.
2. Codex: the single verification deliverable at order §9, V1–V10 plus diagnostic D1, written to
   `audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-VERIFICATION-2026-08-05.md`.
3. GPT: the confirming read at order §10, with §3.5's adjacency and §4's dating uncertainty expressly in
   scope.
4. No later migration step — in particular the derived date-occurrence report — begins before that read
   clears.
