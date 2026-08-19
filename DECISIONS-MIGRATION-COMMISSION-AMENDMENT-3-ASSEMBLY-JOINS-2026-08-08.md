# Migration Commission Amendment 3 — target-assembly join bytes

> **NOT YET RATIFIED.** Drafted by the architect seat 2026-08-08, revised three times on independent GPT
> review. Requires a fourth narrow independent review and owner exact-byte ratification before Stage 2b
> Phase 4 may be hash-frozen and issued to Codex.

**Date:** 2026-08-08 · **Revision:** 4 · **Seat:** Architect
**Amends:** `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md` (RATIFIED 2026-07-29), §2.2, §4.8, §5.6, §9,
§10 — the same five sections Amendment 2 touched, further amended here for a disjoint byte population.
**Supersedes, for the join-byte population only** (defined at §2.1 below): the ratified manifest's own M1
sole-authority statement, **and** ratified Amendment 2 §4.2's clause that M1 "continues to govern every
other byte in target `DECISIONS.md` without exception." Neither the manifest nor Amendment 2 is edited;
both remain frozen at their ratified identities.

**Purpose:** pin the exact bytes joining separately-authorized target-document fragments — the manifest's
65 individual entry-index rows, each of the 65 body blocks' separately-pinned heading/statement/field-list
items, Amendment 2's eight surfaces, and the manifest's §8 records — and amend every commission and
Amendment-2 surface that would otherwise still block those bytes as "not literally pinned," on the same
footing Amendment 2 itself required for its own eight surfaces.

---

## 0. Revision history

**Revision 1** (2026-08-08) was drafted and sent for independent GPT review before any owner ratification,
measured at `10778` bytes (architect byte-count measurement only; no SHA-256 was available this session).
GPT's independent review returned `REVISE` — the join-byte content itself was sound, but four repairs were
required. Revision 2 makes all four, verified by this seat against live sources before drafting the fix,
not accepted from GPT's description alone:

1. **Authority blocker, confirmed against Amendment 2's actual ratified text.** Revision 1 amended §5.6
   only — the identical mistake Amendment 2 revision 1 made and was caught for. Re-reading ratified
   Amendment 2 §4.2 confirms it directly: "Manifest M1's sole-authority statement continues to govern every
   other byte in target `DECISIONS.md` **without exception**." Join bytes are, by construction, part of
   that "every other byte" — Amendment 2 did not and could not have exempted them, since Revision 1 of
   *this* amendment did not yet exist. Commission §2.2's hard stop is likewise still live against join
   bytes: Amendment 2 §4.1 exempts only Amendment 2's own eight surfaces. §2.1 and §4 below repair this,
   mirroring Amendment 2's own §4.1/§4.2/§4.4/§4.5/§4.6 structure exactly.
2. **Byte-definition blocker, a real gap.** Revision 1 defined "one blank line" as "two consecutive `\n`
   bytes" without ever stating whether a fragment's own pinned payload includes the line terminator
   adjacent to its closing fence. Re-reading how this seat has extracted every fenced quotation this entire
   session (start = after the opening fence's own line terminator; end = the position of the `\n` that
   immediately precedes the closing fence, which is excluded) confirms the convention was already in use
   but never stated as authority. §2.1 below states it explicitly, adopting GPT's proposed convention.
3. **Coverage gaps, confirmed against live sources.** (a) The default-rule enumeration in Revision 1
   omitted the join between the declared-total line and the §4 heading entirely — confirmed by re-reading
   Revision 1's own list, which jumps from "§3's introduction→header row" straight to "§4–§7's each
   heading/transition." (b) Revision 1 named the join into §8's retired register as ending at "the
   retired-register's header row." Reading manifest M5.7 directly (`target-text-manifest.md:5267`) shows
   its fenced block opens with two sentences of prose — "Retired and never-assigned identifiers are
   permanently unavailable. This register is append-only..." — *before* the table header; the header is
   not the fragment's first line. (c) No EOF byte was pinned at all. §2.2 below repairs all three.
4. Phase 4 revision 2's own defects (Step 4 sampling instead of exhaustive verification; Step 1 not
   recording `checkDecisionsFormat`'s own signature) are repaired directly in Phase 4 revision 3, not here
   — they are execution-order defects, not construction-authority gaps, and this amendment pins authority
   only.

**Revision 2** was measured at `22506` bytes (architect byte-count measurement) and sent for a second
narrow review. GPT's second review returned `REVISE, two byte-population repairs only` — both confirmed by
this seat against live sources before repair:

1. **EOF was outside the population its own authority amendments referenced.** Revision 2's §2.1 defined
   the governed population as "the bytes at every boundary between two fragments... and nothing else" — a
   definition that, read literally, excludes the end-of-document byte pinned at §2.3, since that byte does
   not sit between two fragments. §§4.1–§4.2's §2.2/M1 exceptions, which apply only to "the population
   defined at §2.1," therefore did not actually authorize the EOF byte, even though §4.3 described the
   population as including it. §2.1 below now defines the population as the explicit union of inter-fragment
   join bytes and the one EOF byte, so every downstream reference is consistent by construction.
2. **M5.6 is one single fenced fragment, not thirteen.** Revision 2's exception 1 claimed Amendment-3
   ownership of the adjacency between each of the 13 archive-index records' label and pointer lines, and
   between one record's pointer line and the next record's label line. Reading manifest M5.6 directly
   (`target-text-manifest.md:5227–5266`) shows all 13 records are quoted inside **one** fenced block, whose
   own prose states they are "reproduced here once in assembly order so that Stage 2b writes a contiguous
   block rather than gathering thirteen fragments." Every byte inside that block, including all twelve
   inter-record joins, is already manifest-pinned; Amendment 3 owned none of it and was, in that respect,
   pinning bytes redundantly (and, since its stated byte count for those joins was never checked against
   the manifest's own, potentially in conflict with it). Separately, exception 1 also named the Amendment
   2 §2.2 header→separator adjacency — already flagged as "not owned" at §2.4 of the very same revision, an
   internal contradiction GPT caught. §2.2 and §2.4 below now treat M5.6 as one fragment and remove both
   redundant claims; the only M5.6-adjacent joins this amendment governs are M5.4→M5.6 and M5.6→M5.7.

GPT's review found no other substantive defect: the parser rules, the extraction convention, the
declared-total→§4 and M5.7-start repairs, the six authority-chain amendments, the exhaustive body/index
join coverage, the EOF value itself, and `checkDecisionsFormat` usage all passed unchanged. Phase 4
revision 3's own consequential repair (removing the "12 inter-record archive-index joins" ledger item and
verifying M5.6 as one complete fragment instead) is made directly in that order, not here.

---

**Revision 3** was measured at `25844` bytes (architect byte-count measurement) and sent for a third
narrow review, scoped to the two revision-2 fixes only. GPT's third review returned `REVISE` on one
remaining defect, confirmed by this seat against the operative text before repair: revision 3's own
history claimed exception 1 no longer named the Amendment 2 §2.2 header→separator adjacency, but the
operative §2.2 text still literally listed it as an Amendment-3-owned zero-blank-line join — directly
contradicting §2.4's correct claim that this same adjacency is internal to Amendment 2's own single fenced
fragment. The history note described a repair that had not actually landed in the operative text. §2.2
below removes the phrase; the remaining zero-blank-line index joins are the separator-row→first-row join
plus the 64 row-to-row joins among the 65 entry-index rows (65 total joins, not 65 "row-to-row" joins —
65 items have 64 adjacent pairs). GPT's review found no other defect in this scoped pass.

## 1. Forcing incident

GPT's independent cold review of Stage 2b Phase 4 work order revision 1 found that manifest M4 items 7, 8,
and 9 separately pin each live block's heading, statement, and field-list payloads, but nowhere pins the
bytes joining those payloads — and that concatenating them directly is not merely inelegant but
parse-invalid.

This seat independently confirmed both cases GPT named by reading `lib/decisions-format.ts` directly,
found the two cases have *different* tolerances rather than a shared one, and audited every remaining join
in Phase 4's assembly sequence rather than patching only the two parser-fatal cases:

- **`statementAndFieldStart`** (governs the join between each body block's statement and its field list):
  skips any number of consecutive blank lines before treating a line as the first field line, but does not
  skip non-blank lines. Zero blank lines causes the first field line (`- **Kind:** ...`) to be silently
  absorbed into the statement text instead of parsed as a field. One or more blank lines both work.
- **`parseEntryIndex`**'s declared-total check (governs the join between the 65th entry-index row and the
  declared-total line): advances past *exactly one* blank line before checking for the literal
  `**Declared total:**` prefix — not a skip-loop. Zero blank lines breaks the row-scanning loop itself
  (which only terminates on a blank line), cascading `INVALID_FIELD_VALUE` findings across every remaining
  line including the declared-total line and beyond. Two blank lines lands the check on the second blank
  line, which is not the declared-total text, producing `MISSING_DECLARED_TOTAL`. Only exactly one blank
  line parses correctly.
- **`parseFields`** (the header/separator row pair, and each table row's neighbor): both require the very
  next line, with no blank-line tolerance at all — already correctly encoded as adjacent lines within
  Amendment 2's own §2.2 fenced block and within each manifest M4/M5.6/M5.7 record's own pinned bytes,
  where those pairs are internal to a single authorized fragment. This amendment does not re-pin those;
  they are not a gap.
- **Section-heading detection** (`sectionByLine`, and the `###`/`####` heading scan in
  `parseDecisionsDocument`) is heading-line-based and does not require any particular blank-line count
  before a heading. Joins in this category are not parser-fatal at any blank-line count, but M1's rule that
  no target byte may be inferred outside pinned authority applies to whitespace bytes exactly as it applies
  to content bytes — an inferred blank line is still an inferred byte.

Commission §5.6 as amended by Amendment 2 authorizes construction only from the manifest and Amendment 2's
eight named surfaces, and Amendment 2 §4.2 leaves manifest M1 fully in force over everything else,
"without exception." The join bytes fall inside that "everything else." Phase 4 therefore cannot proceed
without a third, narrow instrument that both supplies the join bytes and disarms the "without exception"
language for exactly that population.

**Why an amendment, not silent insertion of "the obviously correct" blank line.** Commission §2.2's hard
stop exists precisely to forbid this: "the implementation would need to author, paraphrase, choose, split,
merge, rename, date, or omit anything not literally pinned." A blank line is a byte. Getting it right by
inference rather than authority is the exact failure mode §2.2 exists to prevent, even where — as here —
the "obviously correct" choice and the authorized choice would likely coincide.

---

## 2. Operative text — the join convention

### 2.1 Fragment-extraction convention and the join-byte population, defined first

Every fragment this amendment joins is quoted, in its own authority (the manifest or Amendment 2), inside
a fenced Markdown block. **A fragment's pinned payload is the bytes strictly between the opening fence's
own line terminator and the line terminator immediately preceding the closing fence; that final line
terminator belongs to the fence, not the payload, and is excluded.** This is the extraction convention
this seat has used to quote and verify every fenced fragment this entire session; this amendment is the
first place it is stated as authority rather than left implicit.

**Consequence, stated in exact bytes.** Because no fragment's own payload ends with a trailing line
terminator, joining two fragments with *zero* blank lines (directly adjacent physical lines) requires
inserting **exactly one** `\n` byte between them; joining with *one* blank line requires inserting
**exactly two** `\n` bytes. Wherever §2.2 below says "zero blank lines" or "one blank line," this is the
byte count meant — not a description to be re-derived at construction time.

**The join-byte population this amendment governs** is exactly the union of two disjoint byte sets, and
this term means that union everywhere it is used in this amendment and in §4's commission-text changes:

- **(a) Inter-fragment join bytes** — the bytes at every boundary between two fragments separately pinned
  by the manifest, by Amendment 2, or by both, in Stage 2b Phase 4's assembly sequence (commission §5.6 as
  amended); and
- **(b) The one end-of-document byte** pinned at §2.3, which follows the last fragment in the assembly
  rather than sitting between two fragments, and is therefore not itself a member of (a).

This population does not include any byte internal to a single already-pinned fragment (see §2.4).

### 2.2 The join rules

**Default rule.** Between any two separately-authorized fragments not named as an exception in §2.2.1–3
below, the join is **exactly two `\n` bytes** (one blank line, per §2.1). This covers, walking the full
assembly sequence in order: §1 end → §2 start; §2 end → §3's introduction start; §3's introduction end →
header row start; **the declared-total line end → the §4 heading/transition start**; each of §4's, §5's,
§6's, and §7's heading/transition end → that section's first body-block heading start; within §§4–7, the
end of one body block's field list → the next body block's heading start (core→core, core→its own
attachment, attachment→next core, and the last block of one section → the next section's heading/transition
start); §7's last body block end → §8's structural introduction (manifest M5.4) start; **M5.4's introduction
end → manifest M5.6's single fenced fragment start** (all 13 archive-index lines are one manifest-pinned
block; see §2.4); **M5.6's fragment end → the start of manifest M5.7's fragment** (its two-sentence
introductory prose, *not* its table header — M5.7's fenced block opens with prose before the header; see
§2.4).

**Named exceptions:**

1. **Zero blank lines (exactly one `\n` byte), no exception:** between Amendment 2's entry-index
   separator row and the first of the 65 entry-index rows — the header→separator adjacency immediately
   before it is internal to Amendment 2 §2.2's own fenced fragment, not this exception (see §2.4); and
   between each of the 65 entry-index rows and the next, 64 such row-to-row joins in all.
2. **Exactly one blank line (exactly two `\n` bytes), not zero, not two — the sole load-bearing exception:**
   between the 65th (last) entry-index row and the declared-total line. Verified against `parseEntryIndex`:
   the row-scanning loop terminates only at a blank line, then the declared-total check advances past
   exactly one such line before requiring the literal `**Declared total:**` prefix on the very next line.
   Any other count fails to parse a declared total at all.
3. **One blank line (exactly two `\n` bytes; any count ≥ 1 would parse identically, but this amendment pins
   exactly one for a single deterministic byte sequence):** between each body block's heading and its
   statement paragraph; between each body block's statement paragraph and its field list.

### 2.3 End of document

After manifest M5.7's fragment (its own last byte, the final `|` of its sixth data row, per §2.1's
extraction convention), the document ends with **exactly one** `\n` byte and no further content — matching
the current `DECISIONS.md`, the Phase 3 archive, and every other text file in this repository, all of
which end in exactly one trailing line terminator.

### 2.4 What is explicitly not owned by this amendment

Adjacency **internal** to a single already-pinned fragment is not this amendment's to pin and is not
repeated here — it is already whatever that fragment's own authority says, verbatim:

- Within Amendment 2 §2.2 (the §3 header and separator rows), the adjacency between them is Amendment 2's
  own pinned bytes.
- **The whole of manifest M5.6 — all 13 archive-index records, both the label→pointer adjacency inside
  each record and the pointer→next-label adjacency between every consecutive pair — is one single fenced
  fragment.** M5.6's own prose states the 13 records are reproduced "once in assembly order so that Stage
  2b writes a contiguous block rather than gathering thirteen fragments"; every byte inside that block is
  manifest-pinned, not Amendment-3-pinned. This amendment's concern with M5.6 is limited to its two outer
  boundaries, both named in §2.2's default rule: M5.4's introduction into M5.6's first byte, and M5.6's
  last byte into M5.7's first byte.
- **The whole of manifest M5.7 — its two-sentence introduction, header row, separator row, and six data
  rows — is one single fenced fragment**, on the identical footing as M5.6. Every byte inside it, including
  the join from its introduction into its header row, is M5.7's own pinned content. This amendment's
  concern with M5.7 begins and ends at the single boundary named in §2.2's default rule: M5.6's last byte
  into M5.7's first byte.

---

## 3. What this amendment does not do

- It does not edit the ratified manifest or ratified Amendment 2. Both remain frozen at their ratified
  identities (manifest: `332579`/`818be99a…`; Amendment 2: Revision 3, `24202`/`4cb16995…`).
- It does not carry, restate, or duplicate any fragment's content — not a heading, not a statement, not a
  field, not a row, not an index line, not a register row, not M5.7's introductory prose.
- It does not reopen Stage 2a, or any Stage 2b phase. Phases 1–3 consumed none of this; the join-byte gap
  becomes load-bearing for the first time exactly where Phase 4 first tries to concatenate separately-pinned
  fragments into one document.
- It does not authorize Phase 4 by itself. Phase 4 remains uncommissioned (in hash-frozen, issuable form)
  until this amendment is independently reviewed and owner-ratified.
- It does not amend §5.7, §7.1, §8, or §12, for the same reasons Amendment 2 did not — those govern phases
  and gates not yet live.

---

## 4. Commission amendments — exact text changes

### 4.1 §2.2 — narrow exception to the outside-manifest hard stop, for the join-byte population

Commission §2.2, as it reads after Amendment 2 §4.1's addition, ends with:

> This stop does not fire for the eight target-document surfaces pinned by ratified Commission Amendment
> 2 ... Every other clause of this hard stop, and this clause itself for every surface Amendment 2 does
> not name, is unchanged.

A further clause is added immediately after it:

> This stop additionally does not fire for the join-byte population defined at ratified Commission
> Amendment 3 §2.1 — for that population only, "literally pinned" means pinned by ratified Amendment 3.
> Every other clause of this hard stop, for every byte neither Amendment 2 nor Amendment 3 names, is
> unchanged.

### 4.2 Manifest M1 and Amendment 2 §4.2 — narrow supersession for the join-byte population

Amendment 2 §4.2 states: "Manifest M1's sole-authority statement continues to govern every other byte in
target `DECISIONS.md` without exception." That sentence is ratified Amendment-2 text and is not edited by
this amendment. This amendment instead states, as the owner act ratifying it:

> For the join-byte population defined at this amendment's §2.1, and for that population only, ratified
> Amendment 3 is construction authority co-equal with the ratified manifest and ratified Amendment 2.
> Manifest M1's sole-authority statement, and Amendment 2 §4.2's "without exception" clause, continue to
> govern every byte that is neither one of Amendment 2's eight named surfaces nor part of Amendment 3's
> join-byte population. There is no overlap between the three authorities to resolve: each pins a disjoint
> byte population. A Phase 4 order that finds any other gap, or any apparent conflict, stops and returns to
> the architect seat rather than inferring which authority governs.

### 4.3 §5.6 — construction from three-way combined authority

Commission §5.6, as amended by Amendment 2 §4.3, currently reads (in relevant part):

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

A further clause is added:

> Every join between two of the fragments named above — every blank-line and end-of-document byte the
> assembly requires — is Amendment 3's pinned join-byte population (§2 of that amendment) and no other
> authority's. No join byte may be inferred, chosen, or copied by resemblance from a different section;
> where Amendment 3 does not name a specific join, that is a stop, not an invitation to write the
> "obviously correct" spacing.

### 4.4 §4.8 — prospective discharge for the join-byte population

§4.8, as amended by Amendment 2 §4.4, discharges the original manifest-pinning requirement for Amendment
2's eight surfaces. One further sentence is added:

> The requirement above is additionally, and separately, prospectively discharged for the join-byte
> population defined at ratified Commission Amendment 3 §2.1, by that amendment's ratification. §4.8 never
> contemplated join bytes as a distinct category; this sentence closes that gap rather than rewriting the
> historical record of what §4.8 originally required.

### 4.5 §9 — commit ordering

Commission §9, as amended by Amendment 2 §4.5, requires Amendment 2's ratification to be recorded and
immutable before the Phase 4 target-content commit lands. One further sentence is added, on the identical
footing:

> Ratified Commission Amendment 3 receives the same treatment: its ratification is a governance act
> external to the migration branch, and its identity must be resolvable and immutable before Phase 4's own
> construction begins, on the same footing the manifest's and Amendment 2's ratified identities already
> receive.

### 4.6 §10 — receipt contents

Commission §10, as amended by Amendment 2 §4.6, requires the migration receipt to record the manifest's
and Amendment 2's SHA-256 and ratification records. Amended further to read: "...and, once Amendment 3 is
ratified, its SHA-256 and owner-ratification record alongside the other two — not either alone or both
without the third."

---

## 5. One advisory, not repaired by this amendment

Ratified Amendment 2 (Revision 3, `24202`/`4cb16995…`) still opens with a `NOT YET RATIFIED` banner and its
own §8 still refers to "complete revision-2 bytes" — both stale lifecycle prose left over from its draft
state, flagged on GPT's review of this amendment's own revision 1. The separate exact-byte ratification
record, `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-RATIFICATION-2026-08-08.md`, controls and is not stale.
Per the same reasoning already applied to the ratified manifest's own stale `CANDIDATE, NOT RATIFIED`
banner: repairing Amendment 2's self-description would mean editing its ratified bytes, destroying the
ratified identity, for no construction-authority gain. Not repaired.

---

## 6. Independent review required before ratification

Before owner ratification, an independent reviewer must, over exactly the join rules at §2, the six
commission-text changes at §4, and nothing else:

- verify the extraction convention at §2.1 against how fenced fragments are actually quoted in the
  manifest and Amendment 2 (that no quoted fragment's payload includes a trailing line terminator);
- verify each named exception at §2.2 against the live parser, independently rather than by re-reading this
  amendment's own claims;
- confirm the default-rule enumeration at §2.2 covers every join in Phase 4's assembly sequence with no
  gap — walk the full sequence from §1 through end-of-document and confirm each boundary is named;
- verify the M5.7 boundary claim (introductory prose precedes the table header) directly against the live
  manifest at `target-text-manifest.md`, not against this amendment's description of it;
- confirm §2.4's disjointness claims are accurate — that nothing named there is actually ungoverned;
- confirm the six §4 amendment texts are complete, internally consistent with Amendment 2's own text, and
  do not silently touch §5.7, §7.1, §8, or §12;
- confirm the "Amends:" and "Supersedes:" lines at the top of this document accurately list everything §4
  actually changes.

This is a narrow review over one join convention and its authority chain. It does not reopen the manifest,
Amendment 2, the 78-unit constitutional review, or any closed Stage 2b phase.

---

## 7. Precedent scope

This amendment sets no precedent beyond the target-document assembly it governs. A future commission
amendment with an analogous join-byte gap argues it on its own forcing incident.

---

## 8. Ratification

**Status: not yet ratified.** Pending independent review (§6) and owner exact-byte ratification of this
document's complete revision-4 bytes.

On ratification, the manifest, ratified Amendment 2, and this amendment together become complete
construction authority for Stage 2b Phase 4 under commission §5.6 as twice-amended, the amended §2.2 hard
stop no longer fires for the join-byte population, and Phase 4's own work order may be hash-frozen and
issued to Codex.
