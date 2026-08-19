# Stage 2a — M6 repair completion — CODEX WORK ORDER

**Date:** 2026-08-04 · **Issuing seat:** Architect · **Executing seat:** Codex
**Status:** ISSUED.

**This order does not supersede
`DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-VERIFICATION-CODEX-WORK-ORDER-2026-08-04.md` revision 4, and
revision 4's bytes must not be edited.** Revision 4 is the executed authorization basis for the M6 changes
that have already landed, and its hash was recorded before and after those edits in the repair report. That
two-hash proof is only worth anything if the file it names stays byte-identical. Revisions 1–3 were
overwritten in place because none had been executed; revision 4 has been, and is now immutable evidence.

This order is the **continuation** authority: it adds a narrow surface revision 4 does not permit, carries
forward revision 4's still-unexecuted authorizations, and extends verification.

## 1. Frozen identities

| item | value |
|---|---|
| Repository / branch / HEAD | `Project Shrimp` / `codex/decisions-migration` / `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| Manifest, **current partial state**, byte length / SHA-256 | `312411` / `26feb5dcbe9f501352561f8d324a34fd5285728669a01e5bccc17fa77ee8ad2f` |
| Manifest, physical lines | `5916` |
| Resume note, unchanged, byte length / SHA-256 | `55424` / `e27fd31d1fd497c7a64a73126438f7981ecc206689aee6ac21eb60add38afa8a` |
| WO2 revision 4, byte length / SHA-256 | `21421` / `76588efdca91e52e0f938837d3a0e41d283cc1119eee65212ca28a7aa863f577` |
| Pre-repair manifest snapshot | `audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-SNAPSHOT-2026-08-04.md.frozen`, `308092` / `8e0589dc…4698` |
| Pre-repair resume snapshot | `audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-RESUME-NOTE-SNAPSHOT-2026-08-04.md.frozen`, `55424` / `e27fd31d…fa8a` |
| Pre-census report | `audit/decisions-migration-2026-07-29/M6-REPAIR-PRE-CENSUS-2026-08-04.md`, `63695` / `edbb9693…cff3` |
| Repair report | `audit/decisions-migration-2026-07-29/M6-REPAIR-REPORT-2026-08-04.md` |
| `DECISIONS.md` | `76314` / `b22b3fff…0d6e`, byte-identical to `MIGRATION_BASELINE` |

Hard stop if any measured identity differs from this table.

## 2. Task 0 — freeze the current partial state, before any further edit

The partial manifest is untracked and recoverable from nothing. It is a distinct state from the pre-repair
snapshot and must be preserved independently.

1. Copy `audit/decisions-migration-2026-07-29/target-text-manifest.md` to
   `audit/decisions-migration-2026-07-29/M6-PARTIAL-M6-ONLY-SNAPSHOT-2026-08-04.md.frozen`.
   **Verify the destination does not already exist before copying. If it exists, stop and report; do not
   overwrite it.** An existing file at that path means a prior continuation attempt reached this step, and
   silently replacing it would destroy the only copy of whatever state that attempt froze.
2. `cmp` against source; independently report byte length and SHA-256; both must equal §1.
3. **If the copy cannot be created or hash-verified, stop and report. The architect does not resume editing
   until this is confirmed.**

Do not touch either existing `.frozen` file.

## 3. The defects this order authorizes repairing

Two numeric prose claims about the M6.7 dagger population are wrong on live disk. They sit in M6.3's
introductory prose and M6.7's introductory prose, which revision 4 §3 does **not** permit changing —
revision 4 limits M6.3 mutation to data-row `ground` cells.

| # | location | current text | correct text |
|---|---|---|---|
| 1 | M6.3 introductory prose | `those eight rows` | `those ten rows` |
| 2 | M6.7 first paragraph | `Eight of them are` | `Nine of them are` |

Defect 2's basis: the M6.7 table holds nine `NO-CANDIDATE` `Evidence` rows and one `NO-EXECUTABLE-OWNER`
`Owner` row, for ten.

**Defect 2 predates the repair and was not introduced by it.** The pre-repair snapshot reads `Five of them
are` against a table of seven. The original authoring pass stated this figure wrongly, the 2026-08-04
independent review did not catch it, and this seat's own M6.10 recomputation could not have caught it
because M6.10 never carried the figure. The confirming review should treat it as evidence about the original
authoring pass, and about the blind spot in a recomputation scoped to one section, rather than as evidence
about the repair.

**Authorized M6 surface, additional to revision 4:** the introductory prose of M6.3 — the span between the
`### M6.3` heading and the table's `| # | source |` header row — and the first paragraph of M6.7. No other
M6 surface is opened. M6.3's 110 data rows remain constrained by revision 4 §3 to `ground` cells only.

## 4. Carried forward from revision 4, still unexecuted

Both remain authorized exactly as revision 4 states them, and this order changes neither:

- **§2** — the fifteen M4 records whose item-10 `Evidence` disposition substring may change, and **§2.1**'s
  nineteen excluded Task E records with their grounds.
- **§4** — the four resume-note surfaces: rulings 33 and 34 only; the `Updated:` line only; the whole
  `## Next session — start here` block; and inside `## Cursor` only the two exact spans named there.

Revision 4 §§0, 1, 1.1, 1.2, 3, 5, 6, 7, and 8 continue to govern unless this order says otherwise.

## 5. Extended verification — numeric prose claims in M6

Revision 4 §5.5 required M6.10's numeric claims to be re-derived. That was too narrow: it would not have
caught either defect above, because neither is in M6.10. The generalisation must be **mechanical**, because
this order forbids Codex judgment. It runs in three steps.

### 5.1 Candidate enumeration — mechanical, no classification

Over the M6 section only, restricted to **prose lines** — lines that do not begin with `|` and are not
inside a fenced code block — enumerate every occurrence of:

- an integer numeral matching `\b\d+\b`; and
- a spelled integer word from this closed list, case-insensitively, including hyphenated compounds formed
  from it: `one`, `two`, `three`, `four`, `five`, `six`, `seven`, `eight`, `nine`, `ten`, `eleven`,
  `twelve`, `thirteen`, `fourteen`, `fifteen`, `sixteen`, `seventeen`, `eighteen`, `nineteen`, `twenty`,
  `thirty`, `forty`, `fifty`, `sixty`, `seventy`, `eighty`, `ninety`, `hundred`.

Report each with its subsection, byte offset, and complete physical line. Do not classify any of them.
Exclude nothing on the grounds that it looks like a section number, a ruling number, or a date component —
over-inclusion here is cheap and correct.

### 5.2 Named comparisons — explicit claim, explicit source

Compare exactly these claims against exactly these sources. Derive the source value first, then compare;
never read the stated value and confirm it. Report each as PASS or FAIL with both values.

| # | claim, located by its literal text | mechanical source |
|---|---|---|
| 1 | M6.1, `Fifteen grounds are used` | count of M6.1 table data rows |
| 2 | M6.0, `ten did not` | count of M6.7 table data rows |
| 3 | M6.3 prose, `One hundred and ten rows` | count of M6.3 table data rows |
| 4 | M6.3 prose, `those ten rows` | count of M6.3 data rows whose `ground` cell contains `†` |
| 5 | M6.7 prose, `Ten rows carry` | count of M6.7 table data rows |
| 6 | M6.7 prose, `Nine of them are` | count of M6.7 table data rows whose `ground` cell is `` `NO-CANDIDATE` `` |
| 7 | M6.7 prose, `grew from eight to ten` | dagger count in `M6-PRE-REPAIR-SNAPSHOT-2026-08-04.md.frozen` M6.3, and in the current file |
| 8 | M6.7 prose, `Three records` | count of block identifiers listed in that sentence |
| 9 | M6.4 prose, `Twenty field instances across nineteen distinct paths` | present `Evidence` and `Owner` values in item 9 of all 65 M4 records, instances and distinct |
| 10 | M6.4 prose, `Eighteen distinct paths` | §9 distinct count minus the one exempt path |
| 11 | M6.6 prose, `63 omissions, 2 present` / `61 omissions, 4 present` / `23 omissions, 42 present` | item 9 of all 65 M4 records, per field |
| 12 | M6.9 prose, `thirteen archive wrappers` | count of wrapper records at M5.5 |
| 13 | M6.9 prose, `nine name-addressed wrappers` | count of M5.5 wrappers carrying no `Retired ID` |
| 14 | M6.10 prose, `116 tokens over 110 rows` | M6.3 ground tokens, and M6.3 data row count |
| 15 | M6.10 prose, `at 19 rows` / `at 9` / `carry 28 rows` | M6.3 rows carrying `NO-SINGLE-OWNER`, `PARTIAL-OWNERSHIP`, and their sum |
| 16 | M6.10 prose, `at 20 rows` | M6.3 rows carrying `NO-COMPRESSED-SUBSTANCE` |
| 17 | every M6.10 table row | revision 4 §5.5's source map |

Expected for 4, 5, 6, and M6.10's dagger row: **ten** dagger rows; **nine** `NO-CANDIDATE`; and **one**
`NO-EXECUTABLE-OWNER` in the M6.7 table. Predictions to test, not values to reconcile to.

### 5.3 Residue

Every §5.1 candidate not consumed by a §5.2 comparison is reported **unclassified**, as a plain list with
line and offset. Codex does not decide whether an unclassified candidate quantifies anything. That list
goes to the GPT confirming read, which does make that judgment.

A large residue is expected and is not a finding in itself — section numbers, ruling numbers, and commission
references will dominate it.

## 6. Sequence and deliverable

1. Codex: the Task 0 freeze.
2. Architect: the two prose corrections at §3; then revision 4 §2's fifteen M4 records; then revision 4
   §4's resume note. The architect records this order's hash before and after the continuation, in the
   repair report, retaining the revision-4 two-hash proof already recorded there for the landed M6 changes.
3. Codex: revision 4 §§5 and 6 **plus** §5 of this order, in the single deliverable revision 4 §7 names,
   `audit/decisions-migration-2026-07-29/M6-REPAIR-VERIFICATION-2026-08-04.md`. Record the SHA-256 of both
   revision 4 and this order at the top of that report.
4. GPT: the confirming read, scope as revision 4 §8, extended to the two prose corrections.

Codex makes no judgment, proposes no wording, and stages, commits, pushes, cleans, and resets nothing. Task
0's snapshot and the verification report are the only writes authorized.

**A null or zero result discharges feasibility only, never correctness.**
