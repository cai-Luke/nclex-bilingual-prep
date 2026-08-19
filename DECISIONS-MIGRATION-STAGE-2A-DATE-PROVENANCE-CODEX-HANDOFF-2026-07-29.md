# DECISIONS migration Stage 2a — live-entry date provenance handoff

**Status:** Bounded deterministic/research preparation. Do not edit governed files. Do not author constitutional statements.

## Purpose

Produce a reproducible date-provenance table for the 65 live target blocks so the architect can populate the always-required `Date` field without inventing provenance or using the migration date.

## Repository state

- Repository: `/Users/holemini/Desktop/Project Shrimp`
- Branch: `codex/decisions-migration`
- Expected HEAD: `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`
- `MIGRATION_BASELINE`: `d499cc1d0916e03830489ec9cd0324cd1a203a73`
- `DECISIONS.md` must remain byte-identical to the baseline.
- Preserve all existing untracked Stage 2a evidence files.

Stop if tracked state is dirty, HEAD differs, or baseline `DECISIONS.md` differs.

## Governing date semantics

For a live target block, `Date` is the **recorded effective date of the substantive governing decision represented by that block in its current target form**.

It is not:

- the Stage 2a or migration date;
- the date the current Markdown sentence was editorially rewritten;
- the date an identifier was allocated or a classification table was repaired, unless that act substantively changed what the block governs;
- automatically the latest commit touching `DECISIONS.md`.

Apply these rules:

1. A core block uses the effective date of the current governing rule.
2. An attachment uses the effective date of that application, amendment, narrowing, or implementation directive, independently of its core.
3. A block combining multiple ratified source contributions uses the latest effective date among the substantive decisions the target statement actually carries.
   - This applies especially to E002/P2, E006/P5, and E039a/P8 because of E037.
4. A later formatting, path, compression, index, numbering, or migration-only change does not reset the date.
5. A later substantive narrowing, amendment, superseding current presentation, newly binding restriction, or de-conditionalization does reset the date for the affected block.
6. R-series bootstrap/allocation dates do not replace the ruling's substantive effective date. Example fixed by fixture: E047c/R3 remains `2026-07-15`, not the 2026-07-28 R-series classification date.
7. Where no date can be established without judgment, mark `OWNER_REQUIRED`; do not guess.

The migration commission §4.9 expressly requires dates to be verified from recorded effective dates rather than the document-migration date.

## Evidence hierarchy

Use the strongest available source in this order:

1. **Explicit effective date in the source entry** — language such as ratified, amended, narrowed, closed, applied, implemented, or found/closed where it identifies the governing action.
2. **Ratified governance record** — taxonomy amendments, closure artifacts, owner rulings, architect specifications, or a source/evidence document that explicitly records the decision's effective date.
3. **`PROJECT-HISTORY.md` or another tracked history record** that explicitly records the governing decision and date.
4. **Git archaeology** — identify the commit that introduced the substantive governing rule, not merely the current string. Use `git log -S`, `git log -G`, `git blame`, parent diffs, and surrounding history as needed. Record the full commit SHA and its local calendar date.

Do not accept a commit solely because it first contains the current compressed wording. Explain why the diff is the substantive governing action rather than editorial churn.

When sources conflict, report the conflict and mark `OWNER_REQUIRED`.

## Required inputs

Read at minimum:

- `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md`
- `DECISIONS-TAXONOMY-2026-07-24.md`
- `DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md`
- `DECISIONS-FORMAT-FIXTURES-2026-07-28.md`
- `audit/decisions-cleanup-2026-07-24/inventory.md`
- `audit/decisions-cleanup-2026-07-24/migration-table.md`
- `audit/decisions-cleanup-2026-07-24/outline-before-after.md`
- `DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md`
- `DECISIONS-MIGRATION-STAGE-2A-BLOCK-GROUPING-WORKSHEET-2026-07-29.md`
- `DECISIONS.md` at `MIGRATION_BASELINE`
- `PROJECT-HISTORY.md`
- Git history for `DECISIONS.md` and named evidence/owner files where necessary.

Treat the GPT block-grouping worksheet as a candidate aid; independently verify its source IDs and target block grouping against the ratified outline.

## Fixed examples and controls

These are externally pinned controls:

- P7 fixture date: `2026-06-18`.
- P2 fixture date: `2026-07-14` for the narrowed independent-review rule before considering whether the later E037 contribution moves the assembled target block's effective date.
- P25 core fixture date: `2026-07-03`.
- P25 composite-trend attachment fixture date: `2026-07-18`.
- R3/E047c fixture date: `2026-07-15`.
- Runtime-audio invariant fixture date: `2026-06-22`.
- DBP/MAP sourcing thread fixture date: `2026-07-24`.

If your method contradicts a fixed fixture, stop and report the contradiction rather than overriding the fixture.

## Output

Create only:

`DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-2026-07-29.md`

Keep it untracked. Do not modify any existing file.

The report must include one row for each of the 65 live target blocks, in the ratified final body order:

- P1 through P31 in numeric ID order, attachments immediately after their core;
- R1 through R6;
- 19 invariants in ratified outline order;
- E045, E046, E047b.

For every block report:

1. block key;
2. source E-ID(s);
3. proposed `Date`;
4. provenance class: `EXPLICIT_SOURCE`, `RATIFIED_RECORD`, `PROJECT_HISTORY`, `GIT_INTRODUCTION`, or `OWNER_REQUIRED`;
5. exact supporting source:
   - tracked path and quoted date-bearing phrase/line reference, or
   - full Git commit SHA, commit date, and concise semantic-diff explanation;
6. later commits examined and rejected as editorial/non-substantive, where relevant;
7. merge-date calculation for multi-source blocks;
8. confidence: `FIXED`, `HIGH`, `MEDIUM`, or `OWNER_REQUIRED`.

Also include:

- a summary count by provenance class and confidence;
- a list of every unresolved or conflicting row;
- a method note explaining how substantive changes were distinguished from editorial rewrites;
- verification that all 65 rows are present exactly once and ordered correctly.

## P8 correction

The ratified Part A range is numeric, not merely E001–E017. P8/E039a belongs in Part A between P7 and P10. The complete Part A source population is therefore:

- E001–E017; plus
- E039a, carrying E037 rule 1.

Part B must not author E039a again.

## Prohibitions

Do not:

- edit `DECISIONS.md`, the scaffold, packet, worksheets, taxonomy, format spec, fixtures, history, or frozen artifacts;
- populate the manifest;
- choose headings, statements, optional fields, archive metadata, or wrapper dates;
- use `2026-07-29` as a blanket live-entry date;
- equate latest textual edit with effective date;
- stage, commit, or push.

Finish with branch, HEAD, tracked cleanliness, output SHA-256, row count, unresolved count, and exact untracked-file delta.