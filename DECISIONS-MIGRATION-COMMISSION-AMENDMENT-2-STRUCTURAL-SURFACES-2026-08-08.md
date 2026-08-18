# Migration Commission Amendment 2 — target structural-surface bytes

> **NOT YET RATIFIED.** Drafted by the architect seat 2026-08-08; revised twice on independent GPT review.
> Requires owner exact-byte ratification before Stage 2b Phase 4 (commission §5.6) may be commissioned.

**Date:** 2026-08-08 · **Revision:** 3 · **Seat:** Architect
**Amends:** `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md` (RATIFIED 2026-07-29), §2.2, §4.8, §5.6, §9,
§10.
**Clarifies, and does not amend,** §5.2 — see §4.4 below.
**Supersedes, for eight named surfaces only,** the ratified Stage 2a manifest's own M1 sole-authority
statement — see §4.2 below. The manifest's `332579`/`818be99a…` bytes are not edited.

**Purpose:** supply the exact target-document bytes that commission §4.8 required to be pinned before
Stage 2a ratification and that the ratified manifest's own M5.0 discloses were never delivered, and amend
every commission surface that would otherwise still block Phase 4 on the ground that these bytes are "not
literally pinned by that manifest," so that Stage 2b Phase 4 has complete and unblocked construction
authority.

---

## 0. Revision history

**Revision 1** (2026-08-08) was drafted, measured at `13693` bytes, and sent for independent review before
any owner ratification. GPT's independent review returned `REVISE, narrowly` on 2026-08-08, with two
content-precision findings and one structural finding. Revision 2 repairs all three.

**Revision 2** was measured at `23437` bytes / SHA-256 `2ba8c1e404ed7a0c96c47775a88f83372b599fe9faabd643b150d30c704e17d3`
and sent for a second independent review. GPT's second review returned `REVISE, editorial-only` — no
substantive defect, and explicit agreement with this seat's narrower scope decision on §5.7, §7.1, §8, and
§12. It found two stale internal cross-references in this §0, both confirmed by this seat against the
actual §4.1–§4.6 structure before repair: the sentence at the end of GPT finding 3 pointed to "§2.2 and
§4.4" for the §2.2/M1 repairs (the correct pointers are §4.1 and §4.2) and to "§4.8 and §4.5–§4.7" for the
remaining chain (there is no §4.7; the correct range is §4.4–§4.6). Revision 3 repairs both pointers and
changes no operative text. No byte state of this amendment has been owner-ratified.

**GPT finding 1 (content, confirmed by this seat against the manifest before repair).** The drafted §7
transition claimed "Nothing here describes settled behavior." That is false against two of the three
actual T entries: manifest M4.64 (`Translation-friction scoring`) states outright that "the instrument,
comprising telemetry, export, and the dev panel, already ships," and M4.65 (`Exam-condition test and
adaptive modes`) describes what the two modes currently do at session creation and post-submit. The
unsettled thing in each is the governing question, not every fact the entry states. Repaired at §2.3 below.

**GPT finding 2 (content, confirmed by this seat against the format specification before repair).** The
drafted §4 transition described attached blocks as being "an application, amendment, narrowing, or
standing note," which reads as an exhaustive subtype vocabulary. Checked against
`DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md` §2.3: the format contract defines no such closed
vocabulary at all — those four words are this seat's own description of the current attachment
population's naming convention (visible in titles like "Application: composite trend artifacts" and
"Narrowing: named-model restrictions are lane policy"), not a grammar rule. Written as "A `####` block
*is*" one of four things, the sentence could be misread as forbidding a future legitimate attachment that
does not fit those four labels. Repaired at §2.3 below to describe the current population without closing
the grammar.

**GPT finding 3 (structural, the substantive one, confirmed by this seat against the live commission
text before repair).** Revision 1 amended §5.6 only. That is insufficient: commission §2.2 independently
hard-stops "the implementation would need to author, paraphrase, choose, split, merge, rename, date, or
omit anything not literally pinned by that manifest" — and this amendment's eight surfaces are, by
construction, not pinned by *that* manifest; they are pinned by this amendment instead. §5.6 alone does
not disarm that stop. Separately, the ratified manifest's own M1 states it is "the sole authority for
every byte Stage 2b writes" — a statement inside the ratified manifest bytes, which this amendment cannot
edit, and must instead expressly and narrowly supersede for these eight surfaces only. §4.1 and §4.2 below
repair those two conflicts. §4.4–§4.6 close the remaining authority chain (why the requirement §4.8 originally
imposed on the manifest is satisfied by a different instrument; the branch-output/§5.2 question; the
commit-ordering and receipt consequences).

**Scope this seat did not adopt from the review, and why.** GPT's review also proposed touching §5.7
(target reconciliation checker), §7.1 item 11 (manifest/output exact equality, part of final verification),
§8 (final independent implementation review), and §12 (ratification-gate enumeration). This seat checked
each: §5.7 governs Phase 5, not yet commissioned; §7.1 and §8 govern final verification after all seven
phases land; §12 was not amended by Amendment 1 either, despite Amendment 1 itself requiring its own
ratification act, so there is direct precedent that a ratification act does not require rewriting §12's
enumeration. Amending any of these now, before the phase or gate they govern is live, would widen this
instrument's surface area for no bytes any currently-commissioned phase needs — exactly the over-scoping
this project's phase orders have consistently avoided by design (Phase 1's own order: "does not authorize
any part of §5.4–§5.8"). The combined-authority principle this amendment establishes at §2.2/§4.2/§4.8/§5.6
is general enough that whoever drafts the Phase 5 order, the final §7.1/§8 verification, or a future §12
review can and should apply it to those surfaces at that time; this amendment states that expectation at
§4.6 below rather than pre-writing text for gates that are not yet live.

---

## 1. Forcing incident

The ratified manifest's own M5.0 states, in its own words, that the following are not pinned anywhere in
the manifest: target §3's introduction, table header row, separator row, and declared-total line; and the
§§4–7 section headings with their transition paragraphs. M5.0 records these as "owed before ratification
under commission §4.8" and "outside M5 and M6."

Independently confirmed before drafting this amendment, rather than accepted from M5.0's own say-so:

- every top-level manifest section (`M0`–`M7`) was enumerated; `M2` pins target §1, `M3` pins target §2,
  and no section pins target §3's furniture or the §4–7 headings;
- the manifest was searched in full for the literal parser-required string `**Declared total:**`; zero
  occurrences;
- `DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md` was read in full; it ratifies the manifest's
  exact bytes as they stand and does not address or close this gap.

Commission §5.6 requires target `DECISIONS.md` to contain **only** manifest-pinned structural text, and
manifest M1 forbids inferring, paraphrasing, or completing any target byte outside the manifest. Phase 4
therefore cannot proceed: constructing the missing surfaces without pinned authority would violate M1 and
§5.6 directly; stopping is correct, and did happen, at Stage 2b Phase 3 closeout.

**Why an amendment, not a manifest edit, and not a free-standing supplement.** Editing the ratified
manifest would supersede the `332579`/`818be99a…` identity that Phases 1–3's own opening-prerequisite
tables and closing measurements already cite as fixed, forcing re-verification of three already-closed
phases for an eight-surface gap that touches none of their work. A free-standing supplement would have no
hook in the commission's own governing text — §5.6 as ratified names only "the ratified manifest" as
authority, so Codex would have no warrant to consult a document the commission doesn't mention, and §2.2's
hard stop would still fire regardless. A narrow commission amendment that carries the missing bytes and
amends every commission surface that currently assumes single-document authority avoids all three
problems at once.

**Why the 65 entry-index rows are not carried by this amendment.** M5.0 states plainly that the 65 rows
are not the missing part. Manifest M4.0 already pins, completely and exclusively: the canonical body order
across target §§4–7 (P cores ascending with P8 between P7 and P10; R1–R6 ascending; the 19 I entries in
ratified outline order; E045/E046/E047b for T); and the fact that "body order and entry-index order are
identical by construction," with each row's exact bytes carried at that record's own item 11. Carrying the
65 rows a second time here would create a second source of truth for content the manifest already owns
exclusively. Phase 4 must construct the table body solely from M4's per-record item 11, walked in M4.0's
order.

---

## 2. Operative text — exact structural-surface bytes

### 2.1 Target §3 introduction

Verified against `DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md` §3 ("One row per block, in document
order... The index is derived and never the authority; where index and body disagree, the body governs...
Name-addressed: ID column is —, summary equals heading title byte-for-byte").

```markdown
## 3. Entry index

One row per entry block, in document order. Derived and never the authority: where index and body
disagree, the body governs. The ID column is an em dash for name-addressed entries, whose summary equals
the entry title byte-for-byte.
```

### 2.2 Target §3 table framing

Header row and separator row verified byte-for-byte against the live parser's exact required literals in
`lib/decisions-format.ts` (`parseEntryIndex`: the header line must equal `| ID | kind | status | force |
summary |` exactly; the following line must equal `|---|---|---|---|---|` exactly). The declared-total
line's grammar is verified against the format spec's exact production (`**Declared total:** ` + unsigned
decimal integer + ` entry blocks.`) and its count against manifest M0.3, which fixes the entry-index row
count at 65.

```markdown
| ID | kind | status | force | summary |
|---|---|---|---|---|
```

The 65 body rows are inserted here at Phase 4 construction time, sourced exclusively from manifest M4's
per-record item 11 in M4.0's pinned order. No row byte is pinned by this amendment.

```markdown
**Declared total:** 65 entry blocks.
```

### 2.3 Target §§4–7 headings and transitions — repaired revision 2

Section names and P/R/I/T mapping verified against `DECISIONS-TAXONOMY-2026-07-24.md` §8 ("4. Governing
principles (P)"; "5. Concrete rulings (R)"; "6. Standing invariants (I)"; "7. Open threads (T — unsettled
questions only)"). Content verified against the format spec (§2.2, §2.3), manifest M5.7 (the retired
register), the manifest's own R2 record (which states directly that no `R` attachment exists anywhere in
target §5), and — new in revision 2 — the actual statement text of manifest M4.64 and M4.65 for the §7
transition.

```markdown
## 4. Governing principles

Cited by permanent identifier. A `####` block is attached to the `###` core carrying the same identifier
and holds its own status, force, date, and execution state. Current attached blocks are applications,
amendments, narrowings, or standing notes. Identifiers `P9`, `P12`, `P18`, and `P22` are retired and `P13`
and `P14` were never assigned; see §8.
```

```markdown
## 5. Concrete rulings

Cited by permanent identifier. A ruling settles specified items and generalizes no further. Rulings may
carry attached blocks under the same grammar as §4; none currently does.
```

```markdown
## 6. Standing invariants

Cited by exact title. An invariant carries no attached blocks — an application of an invariant is its own
entry.
```

```markdown
## 7. Open threads

Cited by exact title. Each entry carries an unsettled governing question; current or already-settled
behavior may appear only as context for that question. A ratified decision awaiting implementation does
not belong here — it stays in §§4–6 carrying `Execution: PENDING`.
```

**Parse note, load-bearing.** All four blocks sit between a `## N.` heading and that section's first
`###`, which the entry loop never enters — confirmed against `parseDecisionsDocument`, which only begins
block parsing at a `#{3,4} ` heading. The §4 transition names the four retired identifiers as backticked
prose, not as headings or index rows, so `parseEntryIndex` and the retired-register parser are unaffected
by their appearance here.

---

## 3. What this amendment does not do

- It does not edit the ratified Stage 2a manifest. The manifest's `332579`/`818be99a…` identity is
  unchanged and remains sole authority for every byte it already pins.
- It does not carry, restate, or duplicate any of the 65 entry-index rows, any live-block statement or
  field, any archive-wrapper record, any archive-index line, or any retired-register row. Those remain
  exclusively manifest-pinned.
- It does not change `MIGRATION_BASELINE`, any pinned span or hash, the taxonomy, the format
  specification, the fixture file, or Amendment 4.
- It does not reopen Stage 2a ratification, or any Stage 2b phase Phases 1–3 already closed. None of those
  phases consumed any of the surfaces this amendment pins — Phase 1 was parser behavior, Phase 2 copied
  the baseline snapshot, Phase 3 consumed manifest M5 archive construction. The missing material becomes
  load-bearing for the first time at Phase 4.
- It does not authorize Phase 4 by itself. Phase 4 remains uncommissioned until this amendment is
  independently reviewed and owner-ratified.
- It does not amend §5.7, §7.1, §8, or §12. See §0's explanation of scope.

---

## 4. Commission amendments — exact text changes

### 4.1 §2.2 — narrow exception to the outside-manifest hard stop

Commission §2.2 currently lists, among its hard stops:

> the implementation would need to author, paraphrase, choose, split, merge, rename, date, or omit
> anything not literally pinned by that manifest.

A clause is added immediately after it:

> This stop does not fire for the eight target-document surfaces pinned by ratified Commission Amendment
> 2 (target §3's introduction, table header row, separator row, and declared-total line; and the §§4–7
> section headings and transition paragraphs) — for those eight surfaces only, "literally pinned" means
> pinned by the manifest **or** by ratified Amendment 2. Every other clause of this hard stop, and this
> clause itself for every surface Amendment 2 does not name, is unchanged.

### 4.2 Manifest M1 — narrow supersession, stated here rather than edited into the manifest

Manifest M1 states: "This manifest is the sole authority for every byte Stage 2b writes into target
`DECISIONS.md`... No target text may be inferred, paraphrased, completed, shortened, retitled, redated, or
omitted outside this manifest." That sentence is ratified manifest text and is not edited by this
amendment. This amendment instead states, as the owner act ratifying it:

> For the eight target-document surfaces pinned at §2 of this amendment, and for those surfaces only,
> ratified Amendment 2 is construction authority co-equal with the ratified manifest. Manifest M1's
> sole-authority statement continues to govern every other byte in target `DECISIONS.md` without
> exception. Where Amendment 2 and the manifest could ever overlap, there is no overlap to resolve: this
> amendment pins only the eight surfaces named at its §2, and the manifest pins everything else. A Phase 4
> order that finds any other gap, or any apparent conflict, stops and returns to the architect seat rather
> than inferring which authority governs.

### 4.3 §5.6 — construction from combined authority

Commission §5.6 currently reads:

> Write `DECISIONS.md` from the ratified manifest, not by editing legacy prose in place.
>
> The resulting file must contain only:
>
> - manifest-pinned structural text;
> - the 65 manifest-pinned entry blocks;
> - 13 manifest-pinned archive-index lines;
> - the six-row retired register.
>
> No legacy paragraph may survive accidentally outside a pinned target block. No unmanifested sentence may
> be introduced.

Amended to read:

> Write `DECISIONS.md` from the ratified manifest and ratified Amendment 2's structural-surface bytes, not
> by editing legacy prose in place.
>
> The resulting file must contain only:
>
> - manifest-pinned structural text;
> - Amendment 2's pinned target §3 introduction, table header and separator rows, and declared-total line,
>   with the 65 table body rows sourced exclusively from manifest M4 item 11 in M4.0's pinned order;
> - Amendment 2's pinned §§4–7 section headings and transition paragraphs;
> - the 65 manifest-pinned entry blocks;
> - 13 manifest-pinned archive-index lines;
> - the six-row retired register.
>
> No legacy paragraph may survive accidentally outside a pinned target block. No unmanifested sentence may
> be introduced. Where this amendment and the ratified manifest could ever disagree, there is no overlap
> to disagree on: Amendment 2 pins only the eight surfaces named at its §2, and the manifest pins
> everything else; a Phase 4 order that finds any other gap stops and returns to the architect seat rather
> than inferring which authority governs.

### 4.4 §4.8 and §5.2 — what this amendment discharges, and what it does not touch

**§4.8.** §4.8 required these eight surfaces to be pinned in the Stage 2a manifest before ratification.
That requirement went undischarged, as M5.0 discloses, and Stage 2a is closed — this amendment does not
reopen it or rewrite the ratification record. §4.8 is amended by one added sentence:

> The requirement above, for the eight surfaces named at Commission Amendment 2 §2, is prospectively
> discharged by that amendment's ratification rather than by manifest content. This does not rewrite the
> historical fact that Stage 2a ratification proceeded without them pinned; it supplies the missing bytes
> by a second, narrower owner act instead.

**§5.2 is clarified, not amended**, on the same footing as Amendment 1's treatment of §5.2 item 4.
Amendment 1 was itself ratified as a commission-governing instrument without ever being added to §5.2's
enumerated branch-output list, because a commission amendment is governing text the owner ratifies
directly — like the commission itself and its taxonomy — not a Stage 2b implementation surface Codex
produces inside the migration branch. Amendment 2 sits in the identical category: it is expected to exist
as an owner-ratified governance record, committed by ordinary means, the same way Amendment 4 was
committed to `main` before the migration branch was created. It is not a "migration branch output" in
§5.2's sense, and §5.2's "any other path requires an amended commission" is satisfied by this very
amendment's existence rather than by adding Amendment 2's own path to its own list.

### 4.5 §9 — commit ordering

Commission §9 lists an authorized commit sequence. One sentence is added:

> Where Amendment 2 is ratified, its ratification is a governance act external to the migration branch,
> exactly as the commission and Amendment 1 were. The Phase 4 target-content commit may not land before
> Amendment 2's ratification is recorded — its identity must be resolvable and immutable before Phase 4's
> own construction begins, on the same footing the manifest's ratified identity already receives.

### 4.6 §10 — receipt contents

Commission §10 requires the migration receipt to report "manifest SHA-256 and owner-ratification record."
Amended to read: "manifest SHA-256 and owner-ratification record, and, once Amendment 2 is ratified, its
SHA-256 and owner-ratification record alongside the manifest's — not the manifest's alone."

**Forward note, not an amendment to unwritten text.** When the Phase 5 work order (commission §5.7) and
the final §7.1/§8 verification are drafted, each must treat "the ratified manifest" as shorthand for "the
ratified manifest and ratified Amendment 2, for the eight surfaces the latter pins" wherever it governs
target `DECISIONS.md` content. This amendment states that expectation; it does not pre-write §5.7's or
§7.1's or §8's text, for the reasons given at §0.

---

## 5. One cross-reference recorded, not repaired

Manifest M1 states, of the Part A–D architect drafts: "This manifest inlines their content; no pointer to
them survives as a construction instruction." M5.0's own disclosure shows this was not true for the two
surface categories this amendment now supplies — they were never inlined. This is a minor imprecision in
the ratified manifest's own self-description, in the same category as the M1–M9 section-numbering
convention referring to a non-existent M8/M9. Recorded here so a later seat does not re-discover it as a
new finding. Not repaired, for the same reason the M8/M9 reference is not repaired: it is a stale
cross-reference, not a construction-authority defect, and fixing it would mean editing the ratified
manifest for no bytes any phase actually needs.

---

## 6. Independent review required before ratification

Before owner ratification, an independent reviewer must, over exactly the eight surfaces pinned at §2 and
the six commission-text changes at §4, and nothing else:

- verify the target §3 introduction against `DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md` §3;
- verify the header row and separator row are byte-identical to the literals `parseEntryIndex` requires;
- verify the declared-total line's grammar against the format spec's exact production and its count
  against manifest M0.3;
- verify each of the four §§4–7 headings and transitions against `DECISIONS-TAXONOMY-2026-07-24.md` §8 and
  the format specification, and against current manifest content where a transition makes a checkable
  claim (the four retired identifiers against M5.7; the "no R attachment" claim against the manifest's own
  R2 record; the §7 transition against the actual statement text of every T entry, not only the two this
  revision checked);
- confirm no row, statement, field, wrapper, index line, or register row is carried by this amendment;
- confirm the six §4 amendment texts (§2.2, M1 supersession statement, §5.6, §4.8, §9, §10) are complete,
  internally consistent with each other, and do not silently touch §5.7, §7.1, §8, or §12;
- confirm the "Amends:" line at the top of this document accurately lists every section §4 actually
  changes.

This is a narrow review over eight surfaces and six commission-text changes. It does not reopen the
78-unit constitutional review, the derived date-occurrence report, or any Stage 2a gate.

---

## 7. Precedent scope

This amendment sets no precedent. It is bounded to the eight named target-document surfaces and the
narrow authority-chain repairs needed to unblock Phase 4 specifically, supplying exactly the bytes
commission §4.8 already called for. A future commission with an analogous gap argues it on its own
forcing incident.

---

## 8. Ratification

**Status: not yet ratified.** Pending independent review (§6) and owner exact-byte ratification of this
document's complete revision-2 bytes.

On ratification:

1. This amendment's identity (byte length and SHA-256) becomes, alongside the existing manifest identity,
   joint construction authority for Stage 2b Phase 4 under amended commission §5.6, and the amended §2.2
   hard stop no longer fires for the eight named surfaces.
2. Stage 2b Phase 4 (commission §5.6) may be commissioned.
3. The migration receipt (commission §10, as amended at §4.6 above) must record both authority identities.
