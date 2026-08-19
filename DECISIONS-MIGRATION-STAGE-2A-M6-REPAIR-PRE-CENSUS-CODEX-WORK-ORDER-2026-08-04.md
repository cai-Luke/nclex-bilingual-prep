# Stage 2a — M6 repair pre-census — CODEX WORK ORDER

**Date:** 2026-08-04 · **Issuing seat:** Architect · **Executing seat:** Codex
**Revision:** 2. Supersedes revision 1 of the same date in full. Revision 1 was issued and reviewed but
never executed; it is replaced rather than amended, and no Codex output exists against it.
**Status:** ISSUED. Immutable during execution. If this order is wrong, stop and return to the architect;
do not repair it in place.

## 0. What this is and what it is not

M6 of the Stage 2a manifest was authored 2026-08-04 and drew a `REVISE, narrowly` independent review. The
defect is conceptual: M6's ground vocabulary collapses two deliberately different field-eligibility tests
into one. The architect seat will repair it. **This order preserves the pre-repair bytes and produces the
enumeration that repair is anchored to. It does nothing else.**

Codex makes no judgment in this order. Codex proposes no wording. Codex edits no existing file. Codex
stages, commits, pushes, stashes, resets, checks out, and cleans nothing. Every Stage 2a artifact in this
worktree is untracked and exists on no remote; losing the worktree loses the whole of Stage 2a. That is why
§2 comes first.

This order is closed-world. Every identity, path, and expected value needed to execute it is below. Do not
read sibling draft files, review reports, or resume notes to reconstruct context.

## 1. Fixed identities — verify before doing anything else

| item | value |
|---|---|
| Repository | `Project Shrimp` |
| Branch | `codex/decisions-migration` |
| Branch HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| `MIGRATION_BASELINE` | `d499cc1d0916e03830489ec9cd0324cd1a203a73` |
| Target file | `audit/decisions-migration-2026-07-29/target-text-manifest.md` |
| Target byte length | `308092` |
| Target SHA-256 | `8e0589dcfb9f7190b11ea145dfa9e10e9075c069a3c631ef1a03c3c0c42dc244` |
| Target physical lines | `5875` |
| `@@ASSEMBLY_CURSOR@@` occurrences | `1`, terminal |
| Resume note | `DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md` |
| Resume note byte length | `55424` |
| Resume note SHA-256 | `e27fd31d1fd497c7a64a73126438f7981ecc206689aee6ac21eb60add38afa8a` |
| Resume note physical lines | `803` |
| `DECISIONS.md` byte length | `76314` |
| `DECISIONS.md` SHA-256 | `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` |

**Hard stop.** If the target file's length or SHA-256 differs from the values above, stop and report. Do not
proceed against a different file state. If `DECISIONS.md` differs from baseline, stop and report; that is
commission §2.2's hard stop and it is not yours to resolve.

The resume note is measured here, not modified. It is baselined because the architect's repair will insert a
standing ruling into it, and the post-repair verification order must diff it against a pinned identity.
Report its actual measured values.

Report `git status --porcelain` before and after. It must show only untracked Stage 2a paths, no staged
changes, and no modified tracked files, at both points.

## 2. Task 0 — freeze the pre-repair bytes, before anything else

The manifest is untracked. Its pre-repair bytes exist in exactly one place and are recoverable from no
commit and no remote. If they are lost, the repair cannot be verified and cannot be undone.

1. Copy `audit/decisions-migration-2026-07-29/target-text-manifest.md` to:

   `audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-SNAPSHOT-2026-08-04.md.frozen`

2. Copy `DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md` to:

   `audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-RESUME-NOTE-SNAPSHOT-2026-08-04.md.frozen`

3. Verify each copy byte-for-byte against its source with `cmp`, and independently report each copy's byte
   length and SHA-256. They must equal the §1 values.

4. Report both snapshot paths and identities as the first section of your deliverable.

The `.frozen` extension is deliberate and is not to be changed. These files are preservation copies, not
manifest candidates. A prior repair in this workstream produced two same-named copies and cost an
independent reviewer real effort to disambiguate; the extension makes that impossible here and keeps the
snapshots out of any Markdown sweep.

**If either copy cannot be created or cannot be hash-verified, stop and report. Do not proceed to §3.**

## 3. Section anchors in the target file

`## M4.` through `## M7.` are top-level headings, each occurring once. M4 records are `### M4.<n> ` headings
for `n` in `0`–`66`; records `M4.2`–`M4.66` are the 65 live-block records. M6 subsections are `### M6.<n> `
headings for `n` in `0`–`10`.

Within each M4 record, the **item-10 block** begins at the literal `10. **Optional-field omissions:**` and
ends immediately before the line beginning `11. `.

Within an item-10 block, the **`Evidence` disposition substring** begins at the literal
`` `Evidence` — `OMIT` `` and ends at whichever comes first: the start of the next
`` `<FieldName>` — `OMIT` `` disposition, or the end of the item-10 block.

Derive all offsets yourself from the live bytes. Do not accept any line number from this order.

## 4. Task A — derive the primary repair population from M6.3

M6.3 is a Markdown table. Its data rows match `^\| \d+ \| ` and carry eight columns in this order:
`#`, `source`, `block`, `field`, `candidate label`, `ground`, `disposition`, `record`.

1. Parse every M6.3 data row. **Expected: 110 rows.**
2. Report the field split. **Expected: 59 `Evidence`, 51 `Owner`.**
3. Select every row where `field` is `Evidence` **and** the `ground` cell contains the token
   `NO-SINGLE-PATH` or the token `PARTIAL-STATEMENT`. Strip any trailing dagger (`†`) and any backticks
   before matching. **Expected: 10 rows.**
4. Emit the selected rows in full, all eight columns verbatim.

Every "expected" value above is a prediction to be tested, not a target to reconcile to. Report the actual
value. A mismatch is a finding you return; it is not something you correct.

## 5. Task B — extract the item-10 `Evidence` prose for the Task A records

For each record named in the `record` column of the Task A output:

1. Locate that `### M4.<n>` record and its item-10 block.
2. Emit the entire item-10 block verbatim, with its zero-based half-open byte range in the file.
3. Emit the `Evidence` disposition substring separately, verbatim, with its own byte range.
4. Where the `Evidence` disposition is bare — the literal `` `Evidence` — `OMIT`. `` with no following
   reason — say so explicitly. A bare disposition is a valid finding, not an extraction failure.

## 6. Task C — the separately named ruling-19 cleanup row

Record `M4.31`, block `P25#2`, is **not** in the Task A population and must not be added to it. It is
enumerated separately because its item-10 `Evidence` reasoning carries a stale reference the architect will
clean up on a different ground.

Perform Task B steps 1–4 for `M4.31` and report the result under a heading naming it as the ruling-19
cleanup row, distinct from the Task A population.

## 7. Task D — phrase sweep, and the population it expands

Search the entire target file, all sections, for these four literals, case-insensitively:

- `complete statement`
- `complete-statement`
- `whole statement`
- `whole-statement`

For every hit report: containing top-level section; containing `###` subsection if any; **the complete
physical line containing the hit, verbatim**; and the byte offset of the hit.

**Emit physical lines. Do not segment into sentences and do not write a sentence extractor.** A faulty
sentence extractor is what invalidated the earlier Task 2 run in this workstream. If a hit's line is part of
a wrapped paragraph, emit the containing item-10 `Evidence` disposition substring alongside it where
applicable, which is bounded by §3 and needs no parser.

**Do not classify which field a hit disposes.** That is judgment and belongs to the architect seat.

Then produce one additional named list, which is the point of this task:

> **Task D expansion set** — every M4 record whose hit falls **inside** an item-10 `Evidence` disposition
> substring as bounded by §3, and which is **not** already in the Task A population and is not `M4.31`.

The architect expects this set to contain `M4.14` and `M4.26`. Report the actual set. If it is larger, that
is the finding this task exists to produce.

## 8. Task E — Owner-shaped language inside `Evidence` reasoning

Task D's phrases will not catch all of the defect, because some records express the same collapsed test in
other words.

Across all 65 M4 records at `M4.2`–`M4.66`, restricted to the item-10 `Evidence` disposition substring,
search for these literals, case-insensitively:

- `owns`
- `own the`
- `owner of`
- `owned by`
- `jointly necessary`
- `no single tracked path`
- `no one path`
- `one-path grammar`
- `singular live source of truth`
- `singular source of truth`

Report every hit with record, block, the complete physical line verbatim, and byte offset. Same rule: no
sentence segmentation.

Then produce one additional named list:

> **Task E expansion set** — every M4 record hit that is not in the Task A population, not `M4.31`, and not
> already in the Task D expansion set.

## 9. Task F — ground/field consistency census over M6.3

Parse each `ground` cell by: splitting on commas; trimming whitespace; removing backticks; removing a
trailing dagger and adjacent whitespace; rejecting any empty or malformed token as a reported finding.

For each distinct ground token report: the token; the number of rows carrying it; the split of those rows by
`field`; and the list of records carrying it.

Then report, as its own list, every ground token appearing on **both** `Evidence` rows and `Owner` rows.

The architect expects six such tokens: `ARCHIVE-ONLY`, `NO-SINGLE-PATH`, `NOT-A-PATH`, `NOT-AN-AUTHORITY`,
`PARTIAL-STATEMENT`, and `UNRESOLVED-SUBJECT`. Report the actual set.

## 10. Task G — M6 structural offsets

Report the zero-based byte offset and physical line number of:

- the `## M6.` heading;
- each `### M6.<n>` heading, `n` = `0`–`10`;
- the `## M7.` heading;
- the start and end offsets of the **M6 opening preamble**, defined as the span from the end of the `## M6.`
  heading line to the start of the `### M6.0` heading line.

The preamble is measured explicitly because it carries text the architect will repair and it belongs to no
subsection.

Also report, for M6.3, the byte range of each of the 110 data rows, so the post-repair order can constrain
mutability to the `ground` cell alone.

## 11. Deliverable

Write one report to:

`audit/decisions-migration-2026-07-29/M6-REPAIR-PRE-CENSUS-2026-08-04.md`

That report and the two `.frozen` snapshots of §2 are the only three writes this order authorizes. Leave all
three untracked.

The report carries, in order: the §2 snapshot paths and verified identities; the §1 identity verification
with actual measured values; both `git status --porcelain` snapshots; Tasks A through G under their own
headings; and a closing statement of anything you were unable to measure, stated as unmeasured rather than
as absent.

Retain raw stdout for every command. A summarized result without its raw output does not discharge the task.

**A null or zero result discharges feasibility only, never correctness.** If a task returns nothing, say what
you searched and over what population, so the emptiness is checkable.

## 12. What happens next, so you can see why the shape of this matters

The architect freezes the exact repair allowlist from your Task A, Task C, Task D expansion, and Task E
expansion outputs, then issues the post-repair verification order against that frozen set and against the
`.frozen` snapshots. Until your report exists, that order cannot be both immutable and closed-world. Do not
attempt to anticipate it.
