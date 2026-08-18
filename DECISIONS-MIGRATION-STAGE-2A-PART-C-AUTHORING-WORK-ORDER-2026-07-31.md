# Stage 2a Part C — architect authoring work order

**Date:** 2026-07-31 · **Issuing seat:** Architect (Claude, Cowork) · **Receiving seat:** Architect
(Claude, claude.ai chat, filesystem-enabled)

**Status:** Work order. Immutable during execution. The mutable status log for this workstream is
`DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md`; record progress there, not here.

**This document is closed-world.** Every path, order, and acceptance condition needed to execute the
assignment is stated inline or names an exact file on disk. Do not appeal to chat context, to a prior
session, or to any model's memory of this project.

---

## 0. Stop-first conditions

Read this section before anything else.

1. **The entire Stage 2a workstream is untracked** in the local `codex/decisions-migration` worktree —
   this work order, the manifest, the Part A–D drafts, the live-source packet, the commission
   amendment, the review files, and the deterministic results. None of it is recoverable from the
   recorded branch HEAD `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`, and none of it exists on any
   remote. **Run no cleanup, reset, checkout, stash, or `git clean` operation.** Losing the worktree
   loses the whole of Stage 2a.
2. **You do not own PRs, pushes, commits, or staging.** Claude Code and Codex do. Perform no Git write
   operation of any kind.
3. **Do not edit `DECISIONS.md`.** Stage 2b is not authorized, the manifest is not ratified, and
   `DECISIONS.md` must remain byte-identical to `MIGRATION_BASELINE`
   (`d499cc1d0916e03830489ec9cd0324cd1a203a73`, 76314 bytes, SHA-256
   `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`). Reading it is expected and
   correct; writing to it is a hard stop.
4. **Filesystem connector scope drifts between sessions.** At session start call
   `list_allowed_directories` on every mounted connector and use whichever allowed root contains
   `Project Shrimp`. Do not infer scope from the tool prefix, and do not conclude a file is missing
   from a single access denial.
5. **A garbled read is a connector artifact until proven otherwise.** Every mojibake alarm in this
   project's history has been one, and repository Markdown has been independently scanned clean. Re-read
   before reporting corruption. The converse applies to your writes: always `dryRun: true` before
   applying an edit, and re-read or probe afterward, because a returned diff is not proof of
   persistence.

---

## 1. Read order before authoring

Read these in order, from live disk, every session. Do not substitute a summary.

1. `AGENTS.md`
2. `PROJECT-HISTORY.md`
3. `DECISIONS.md`
4. `NCLEX-Question-Schema.md`
5. `CLAUDE.md`
6. `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md`
7. `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md`
8. `DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md` — **including standing rulings 1–26
   in full.** Do not author a record before reading them. They are the accumulated defect record of
   this workstream and most of them exist because a batch got one wrong.
9. `audit/decisions-migration-2026-07-29/target-text-manifest.md` — at minimum M0 through M4.1, plus
   several complete M4 records as worked examples. M4.19 (`P17#0`), M4.25 (`P23#0`), M4.31 (`P25#2`),
   and M4.38 (`P31#0`) are the most instructive.
10. The Part C draft, its review, and the live-source packet entries for your batch — see §4.

---

## 2. Cursor

37 of 65 live blocks are authored, at M4.2–M4.38. **Target §4 is structurally complete:** 37 `P`
blocks across 25 distinct permanent identifiers, both matching the frozen nulls at manifest M0.3.

All 37 records carry provisional non-author batch review. M4.33–M4.38 (`P26#0`, `P27#0`,
`P28#0`, `P29#0`, `P30#0`, `P31#0`) were reviewed on 2026-07-31 with a `REVISE, narrowly` disposition;
both required repairs were applied, and a confirming non-author read cleared the repaired bytes on
2026-07-31. They remain provisional and are not formally ratified.

Nothing in the manifest is formally ratified. Provisional batch clearance authorizes manifest
insertion only, and no count of cleared batches advances the ratification gate.

---

## 3. Assignment

Author the remaining **28 live blocks** into
`audit/decisions-migration-2026-07-29/target-text-manifest.md`, continuing the record numbering at
**M4.39**.

| target section | kind | count | blocks |
|---|---|---:|---|
| §5 | `R` | 6 | `R1#0` – `R6#0` |
| §6 | `I` | 19 | one name-addressed entry each |
| §7 | `T` | 3 | one name-addressed entry each |

37 + 28 = 65. Do not author M5, M6, or the derived date-occurrence report; they are separately owed
and §8 below records why.

### 3.1 Adopted order — do not re-derive it

The manifest adopted this order at M4.0. It is an architect ruling, not an inheritance from the
scaffold. Body order and entry-index order are identical by construction.

**§5 — `R` in ascending identifier order, regardless of live-source-packet order:**

`R1` = `E070` · `R2` = `E049` · `R3` = `E047c` · `R4` = `E072` · `R5` = `E047a` · `R6` = `E073`

Every live ruling has exactly one block and therefore one core. No `R` attachment is classified.

**§6 — the 19 `I` entries in ratified outline order:**

`E038`, `E043a`, `E054`, `E055`, `E056`, `E057`, `E058`, `E059`, `E060`, `E061`, `E062`, `E063`,
`E064`, `E065`, `E066`, `E067`, `E068`, `E069`, `E071`

**§7 — the 3 `T` entries:**

`E045`, `E046`, `E047b`

`I` and `T` entries are name-addressed, take no attachments, and carry no permanent identifier.

### 3.2 Where the bytes go

M4, M5, and M6 are authored **in place above M7** in the manifest. The manifest ends with a single
reserved append-point sentinel; it marks the insertion point for the derived date-occurrence report
**only** and is never the insertion point for M4, M5, or M6. Do not introduce any new sentinel of
either class — the manifest is not ratifiable while one survives, and ratifiability is checked by exact
fixed-string search.

### 3.3 Suggested batch size

Author in batches and stop for review between them. The session record is unambiguous: the 18-block
Part A batch produced the most missed limbs, the 8-block batch fewer, and the 5- and 6-block batches
were the cleanest. Suggested split: `R1#0`–`R6#0`; then the 19 `I` entries in two or three batches;
then the 3 `T` entries. Do not author all 28 in one pass.

---

## 4. Sources for your batch

Read forward into these rather than loading anything whole.

- **`DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md`** — verbatim baseline source text,
  frozen classification (kind / status / force / execution), legacy anchor line, and byte span for
  every entry. **It is ordered by source entry ID, not by target order,** so `E070` sits at packet
  entry 41 and `E038` at packet entry 44. The packet exceeds a single comfortable read; locate your
  entry's section heading first, then read that range.
- **`DECISIONS-MIGRATION-STAGE-2A-PART-C-ARCHITECT-DRAFT-2026-07-29.md`** — candidate statements and
  fields. **Preparatory, not an authority.** Where the manifest diverges from it, the manifest governs
  and the record states the supersession explicitly.
- **`DECISIONS-MIGRATION-STAGE-2A-PART-C-GPT-REVIEW-2026-07-29.md`** — a 2026-07-29 review. Its
  findings are **inputs for fresh review, not clearance.** The equivalent Part B review missed four
  live limbs in a single record it accepted.
- **`DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-2026-07-29.md`** — the `Date` byte and its
  provenance class per block. Note the standing correction in
  `DECISIONS-MIGRATION-STAGE-2A-P7-DATE-CORRECTION-2026-07-29.md`: a parser fixture is never an
  effective-date authority, so any row whose provenance traces to a fixture needs its label corrected
  in the record even where the date byte itself survives.
- **`DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md`** §§ on optional fields —
  per-block present/omitted field dispositions. Preparatory; the manifest governs.
- **`audit/decisions-cleanup-2026-07-24/inventory.md`** — the frozen 80-row classification table, and
  the place to check any kind/status/force repair recorded against a source entry.

---

## 5. Record shape

Every record pins the fourteen items of commission §4.4 under the fixed numbering established at
manifest M4.1. Copy the shape from an existing record; do not invent a variant. Items absent by
architect decision read `OMIT` explicitly — silence is not an omission.

Field lines appear in this order, omitting any that is not present:

```
- **Kind:** <P | R | I | T>
- **Status:** <ACTIVE | CONDITIONAL | PARKED | REVISIT | SUPERSEDED>
- **Force:** <BINDING | AUTHORIZING | ADVISORY | HISTORICAL>
- **Date:** <YYYY-MM-DD>
- **Authorized:** <free text>
- **Not authorized:** <free text>
- **Evidence:** `<one tracked path>`
- **Owner:** `<one tracked path>`
- **Execution:** <EXECUTED | PENDING | INACTIVE>
```

**Every `Authorized`, `Not authorized`, `Evidence`, `Owner`, and `Execution` field occupies exactly one
physical line.** Format specification §2.1 requires each field line to match `- **<Field>:** <value>`,
so a wrapped continuation line parses as an unknown field. Statement paragraphs may wrap; field lines
may not.

Source spans are zero-based half-open byte ranges into
`git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md`, cited by **legacy anchor line**, not
by legacy line, because a cited range may extend beyond the named physical line.

### 5.1 Statement grammar

One prose paragraph, one to three sentences. State only what binds, authorizes, advises, or remains
open. Do not reproduce measurements, counts, citation detail, source quotations, chronology, method, or
litigation chains that a linked source owns. Preserve force: compression may not turn `BINDING` into a
suggestion or an `AUTHORIZING` ruling into a descriptive note. Preserve `PENDING` and `INACTIVE` as
execution states rather than weakening kind or status.

**A mechanical hazard found on 2026-07-31 and not yet recorded elsewhere.** The exported
`countStatementSentences` splits on a terminal period followed by a space and an **uppercase** letter.
A sentence that begins with a backticked identifier — `` `case_study` is a delivery container… `` —
is therefore not counted as a new sentence, and a three-sentence statement silently measures as two.
Undercounting is the direction that fails. **Do not begin a statement sentence with a backtick.**
`P28#0` was reworded to `A \`case_study\` is a delivery container…` for exactly this reason.

### 5.2 `Owner` and `Evidence` have different tests

Target §1 as authored at manifest M2 was corrected on 2026-07-31 to stop imposing one whole-statement
test on both fields. The current tests are:

- **`Owner`** — the one tracked path that owns the **whole live statement**. A path that owns the
  mechanism but not the whole statement does not earn the field; `P15#1`'s `Owner` was removed on that
  ground even though `scripts/patch-raw.ts` is tracked and owns the mechanism.
- **`Evidence`** — the one tracked source that carries the evidence, measurements, provenance, or
  method the statement is **forbidden to restate**. It may not contradict or materially misrepresent
  any limb the statement keeps.

Where no single path meets its own test, pin `OMIT` and state the reason in the record. Two failure
modes are already on the record and will recur in Part C:

- **Clause-promotion.** Where the legacy text attaches a path to one clause with `per <path>`,
  promoting it to the entry's `Evidence` asserts support the source never gave. `P25#2`'s `Evidence`
  was removed on that ground, plus the stronger one that the cited spec ratifies the opposite of a
  limb the statement carries.
- **Non-paths.** Commands, symbols, prose labels, directories used as concepts, combined pseudo-paths,
  GitHub Pages, "Tier 0", `selfCheck`, `audit:ids`, enum names, entry identities, and source sections
  are not paths and must never be copied into these fields.

Verify each present path is tracked. `DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-RESULTS-2026-07-30.md`
carries per-path verdicts, but **its population and totals are stale** — see §8. Its surviving per-path
verdicts remain usable; its counts do not.

### 5.3 Name-addressed entries — the title is a citation identity

This is new work: every block authored so far is ID-addressed. All 22 of your `I` and `T` entries are
name-addressed, and their titles are load-bearing.

- The exact title **is** the citation identity. It must be unique across the document and durable
  enough not to be edited for style later.
- A name-addressed citation is written `I: ` or `T: ` followed by the title **inside a backtick run**.
  The target-mode matcher in `scripts/decisions-reference-graph.ts` is:

  ```
  /(^|[ \t\v\f(\[{])([IT]): (`+)(.+?)\3(?=$|[ \t\v\f.,;:!?)\]}])/g
  ```

  The citation must be preceded by start-of-line or one of a small whitespace/bracket set, and
  followed by end-of-line or one of a small punctuation set. **A quoted title produces no citation edge
  while looking like one,** which is worse than a plainly descriptive reference. The citation must not
  be split across a physical line, because the matcher runs per line.
- Name-addressed index summaries must match their titles byte-for-byte.
- No Markdown anchor link into an entry heading may be authored inside target `DECISIONS.md`.

**A standing citation dependency already exists.** `P20#0` at manifest M4.21 carries the manifest's
first name-addressed citation: `I:` plus the backtick-delimited runtime-audio invariant title. **If you
change that title while authoring `E054`, you must change `P20#0`'s citation with it.** Check this
before finalizing the `E054` title.

---

## 6. The method that catches the dominant defect

The dominant defect of this workstream is the **dropped live limb** — a compression that reads fluently
and silently deletes a rule. It has been found in `P16#1`, `P17#0`, `P19#0`, `P21#0`, `P23#0` (four
limbs in one record), `P24#0`, `P25#0`, `P25#1`, `P25#2`, `P27#0`, `P28#0`, and `P30#0`. In `P23#0` all
four omissions passed an independent review. Fluent, plausible compression is exactly what this defect
looks like from the outside.

**Before compressing any source entry, enumerate every operative source limb and account for each one
explicitly as:**

1. **retained** in the target statement; or
2. **carried by another identified target entry** — name it; or
3. **superseded by a named later source** — name it.

**A limb absent from both the target statement and every other target entry has been deleted, not
compressed.** Write the accounting into item 12 of the record, not only into your reasoning.

Four limb classes have been missed repeatedly and deserve a specific look:

- a **deferral with a named revisit condition** — a live scope boundary, not chronology;
- an **enumerated list** — carried complete or not at all;
- a **named non-qualifying criterion** — "vendor ubiquity is not a criterion", "'this feels heavy now'
  is not that argument";
- a **term of art used without its definition** — fluent and unenforceable.

And two scope hazards at word level:

- **Do not widen.** `P7#0`'s proposed "audit or review" was rejected; expanding a governed population
  requires affirmative owner ratification.
- **Do not narrow while repairing a widening.** `P31#0`'s connective was repaired from "or" back to
  "and" and the predicate was restated as "a quotation of" the rule in the same sentence, which
  narrowed it. A seat rewriting a clause to fix one drift is at its most likely to introduce another,
  because it is already touching bytes it had decided were load-bearing.

---

## 7. Part C boundary conditions

These are specific and load-bearing. Verify each against the live source rather than accepting it from
this list, but do not author against a different scope without recording why.

- **`E043a` / `I`** — carries only the live `opus*` deterministic routing rule and the `claude_*`
  exclusion. Exclude the replacement direct-GPT contract, the rerun assessment, case-form advice, and
  general `P5` review obligations. The live `E036` tail bytes excluded from the `E036` archive span are
  supplied in `E043a` context in the live-source packet.
- **`R3` / `E047c`** — carries the copied-renderer-envelope finding, the ratified 46.5 °C temperature
  ceiling, and `Execution: EXECUTED`. Excludes the temperature floor and every other vital side. Its
  kind and force were repaired by owner ratification on 2026-07-28: `X`→`R`, `HISTORICAL`→`BINDING`.
  This is the cleanup's first genuine force change and is an owner act, not a survey finding.
- **`R5` / `E047a`** — carries the SBP 400 mmHg ceiling, the RR 150/min ceiling, the SpO₂ 0% floor, the
  bedside-and-charted governed population, unchanged renderer envelopes, and the fresh-survey
  prerequisite, at `Execution: PENDING`. Excludes DBP, MAP, the temperature floor, and laboratory SaO₂.
  The bedside-and-charted population is what selects 400 over the higher instrumented candidate; it is
  a limb, not context.
- **`E047b` / `T`** — carries only the unresolved sides: DBP and MAP ceiling sourcing, the temperature
  floor, laboratory SaO₂, and other unratified sides. It must remain an unsettled question with a named
  next action, `Status: REVISIT`, `T` only.
- **`E038` / `I`** — must state the durable operational-state rule about current-producer callout
  ownership and freshness. **It must not preserve a named current model as timeless constitutional
  text.** Date `2026-07-28` per owner override.
- **`R6` / `E073`** and **`R5`** are `Execution: PENDING` with `Status: ACTIVE`. A settled rule whose
  implementation is pending is `ACTIVE` + `PENDING` and **never** `REVISIT`. A `PENDING` rule binds
  fully.

### 7.1 `E038` carries the one live exception in this commission

Amendment 1 Clause A permits `E038` — and only `E038` — to pin `Evidence` to the exact normalized
migration archive path even though that Stage 2b output does not exist yet:

```
Archive/DECISIONS-ARCHIVE-2026-07-31.md
```

The filename's date is `MIGRATION_DATE`, bound to `2026-07-31` by Luke on 2026-07-30. The value must
equal the manifest's pinned normalized-archive filename **byte-for-byte** — that exact-equality check
replaces the trackedness check for this one path. The exception waives nothing else, admits no second
future-output path, does not authorize an empty placeholder file, and is **exhausted by this single
use.**

---

## 8. What is owed elsewhere — do not attempt it here

- **M5** — the 13 archive wrapper records at commission §4.7's twelve items each, plus 13
  archive-index lines and the six-row retired register. Not this assignment.
- **M6** — the manifest-level omission register of commission §4.6. Not this assignment.
- **The derived date-occurrence report** — a separate commission, not yet issued, executed by Codex
  against the completed candidate bytes. Not this assignment.
- **Codex Task 2 rerun (owed).** The 2026-07-30 sentence-count run is **invalid**, not merely wrong in
  one row: its extraction returned two sentences for a `P16#0` statement that the real exported
  `countStatementSentences` returns three for, which invalidates the run's "blocks outside {1,2,3}:
  none" claim. Eleven current manifest statements postdate that run and carry no measured count at all.
  Do not cite that artifact's counts, and do not restore any `PASS` or `GREEN` disposition from it.
- **Codex Task 3 rerun (owed).** Its per-path artifact still records 25 path rows and 24 `TRACKED` and
  still carries a `P15#1` `Owner` row and a `P25#2` `Evidence` row, both since removed. The current
  population is provisionally **23 rows and 22 `TRACKED`**, plus the `E038` exception. Surviving
  per-path verdicts are usable; the counts are not.
- **Header pin `H8`** returned `PASS` on 2026-07-30. The M4–M6 assembly pause is discharged.

---

## 9. Producer ≠ checker

Authoring Part C makes you the **producer** of these 28 statements. You may not clear them.

Every target statement is architect-authored compression and must receive non-author review before
formal ratification. Producer≠checker attaches to whichever seat *produced*, never to a model name, so
a later Claude instance reviewing its own predecessor's Part C output does not satisfy it.

Separately, the commission-required **full constitutional-content review** of the complete 65-record,
13-wrapper manifest has not occurred and remains owed. Batch review does not certify the complete
manifest or eliminate that final review.

---

## 10. Acceptance conditions for this assignment

The assignment is complete when all of the following hold and are verifiable from live disk:

1. 28 new records exist at M4.39 onward, in the §3.1 order, bringing the manifest to 65 live blocks.
2. Section totals reconcile to the frozen nulls: **37 `P` / 6 `R` / 19 `I` / 3 `T` = 65**.
3. Every record pins all fourteen commission §4.4 items, with explicit `OMIT` for each absent optional
   field.
4. Every `Authorized`, `Not authorized`, `Evidence`, `Owner`, and `Execution` field is on exactly one
   physical line.
5. Every statement is one paragraph of one to three sentences, with no list, fence, or nested heading,
   and no sentence beginning with a backtick.
6. Every name-addressed title is unique, is byte-identical to its index summary, and — where cited —
   is delimited by a backtick run inside a single physical line.
7. `P20#0`'s runtime-audio citation still matches the final `E054` title.
8. Item 12 of every record carries the explicit limb accounting of §6.
9. No `R` attachment and no `I`/`T` attachment exists.
10. No live `P9`, `P12`, `P18`, or `P22` block exists; `P13` and `P14` remain never assigned.
11. The manifest still contains exactly one sentinel: the reserved terminal append point.
12. `git status` shows the Stage 2a files still untracked and nothing staged, committed, or deleted.
13. The resume note's cursor, standing rulings, and open flags are updated, and the Part C draft's
    banner records every record the manifest supersedes.

---

## 11. Reporting

Report to Luke in prose, not as a file dump. State: which blocks were authored; every limb restored
against the reviewed draft and why it is live; every divergence from the Part C draft, the Part C
review, or the Part D field dispositions, each reasoned in place in the record itself; any new standing
ruling, appended to the resume note from 26 upward; and anything you could not verify from this seat,
labelled **unverified by this seat** rather than asserted or silently dropped.

Do not report a governance or PR artifact you cannot see as absent. Disk-absence is not evidence about
a non-disk artifact.
