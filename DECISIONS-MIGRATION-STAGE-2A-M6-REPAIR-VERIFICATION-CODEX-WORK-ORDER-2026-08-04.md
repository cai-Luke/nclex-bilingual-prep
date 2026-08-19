# Stage 2a — M6 repair verification — CODEX WORK ORDER

**Date:** 2026-08-04 · **Issuing seat:** Architect · **Executing seat:** Codex
**Revision:** 4. **ISSUED.** Supersedes revisions 1, 2, and 3 of the same date, **all unexecuted**. No Codex
output exists against any of them.

## 0.0 Revision provenance

**Revision 3's header claim was false and is corrected here.** It stated that revision 3 changed exactly one
thing relative to revision 2. It changed six:

1. §1 — the pre-census identity rows were merged into one length/SHA row, and the re-measurement sentence
   was widened to cover the pre-census report as well as the two snapshots;
2. §1.1 — added;
3. §3 — heading changed from "M6 changed-surface allowlist — frozen at revision 1 and unchanged" to
   "M6 changed-surface allowlist";
4. §4 — rewritten, the intended change;
5. §5.6 — extended to require the same integrity set for the resume note; §5.7 scoped its count to the
   manifest;
6. §7 — added the requirement that Codex record this order's SHA-256; §8 — extended the confirming-read
   scope to name both new rulings.

**Revision 4's changes relative to revision 3**, in full: this §0.0; §1.2, added; §4's Cursor surface,
narrowed from the whole section to two exact spans. Nothing else changes.

The enumeration above is drawn from the architect's authoring record. Revisions 1 through 3 were overwritten
in place and no copy of them exists on disk. That is acceptable only because none was ever executed and each
was superseded before use; the identity that must be provable is the identity of the revision Codex actually
runs, which §1.2 and §7 make checkable in both directions.

## 0. What this is

Three obligations discharged in one pass:

1. **Verification of the M6 repair** against an exact changed-surface allowlist.
2. **The Task 2 rerun**, run over all 65 records, reporting the owed 43-record subset separately.
3. **The Task 3 rerun or supersession** against the current governed field-path population.

They fold together because the repair changes no statement bytes and no field lines. That is a premise to
verify at §5.2 and §5.3, not to assume.

Codex makes no judgment. Codex proposes no wording and repairs nothing. Codex stages, commits, pushes,
stashes, resets, checks out, and cleans nothing.

**Executable only after the architect's M6 repair has landed.** Immutable during execution. If this order is
wrong, stop and return to the architect; do not repair it in place.

## 1. Frozen identities

| item | value |
|---|---|
| Repository | `Project Shrimp` |
| Branch | `codex/decisions-migration` |
| Branch HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| `MIGRATION_BASELINE` | `d499cc1d0916e03830489ec9cd0324cd1a203a73` |
| Target file | `audit/decisions-migration-2026-07-29/target-text-manifest.md` |
| Pre-census report | `audit/decisions-migration-2026-07-29/M6-REPAIR-PRE-CENSUS-2026-08-04.md` |
| Pre-census byte length / SHA-256 | `63695` / `edbb96934841d3809db14b46c2e67ae718605537f76362acdd1850fc6755cff3` |
| Manifest snapshot | `audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-SNAPSHOT-2026-08-04.md.frozen` |
| Snapshot byte length / SHA-256 | `308092` / `8e0589dcfb9f7190b11ea145dfa9e10e9075c069a3c631ef1a03c3c0c42dc244` |
| Resume-note snapshot | `audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-RESUME-NOTE-SNAPSHOT-2026-08-04.md.frozen` |
| Resume snapshot byte length / SHA-256 | `55424` / `e27fd31d1fd497c7a64a73126438f7981ecc206689aee6ac21eb60add38afa8a` |
| Architect repair report | `audit/decisions-migration-2026-07-29/M6-REPAIR-REPORT-2026-08-04.md` |
| `DECISIONS.md` byte length / SHA-256 | `76314` / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` |

Both `.frozen` snapshots and the pre-census report were independently re-measured by the architect seat and
match the values above. The snapshots are the diff baselines. **If any measured identity differs from this
table, stop and report; do not diff against an approximation.**

The repair report is named here, before the repair, so it cannot function as a post hoc allowlist. It is
evidence, not authority.

`DECISIONS.md` must remain byte-identical to `MIGRATION_BASELINE`. Report `git status --porcelain` before and
after: only untracked Stage 2a paths, no staged changes, no modified tracked files, at both points.

### 1.1 Pre-census provenance

The pre-census report received one post-run correction before the identity above was measured. As reported
by the reviewing seat, the correction replaced Task D hit 1's containing-`###`-subsection label
`### M0.4 Deterministic measurements owed by Codex` with `none`. The architect seat has independently
confirmed on live disk that hit 1 now reads `none`, and that the hit sits in the `## M2.` preamble where no
`###` subsection contains it, so `none` is the correct label.

The correction affected a label only. No hit count, population, byte offset, expansion set, or census result
changed. **The SHA-256 pinned in §1 is the corrected report.** The census report is not to be edited again;
if it is, this order's §1 identity check fails, and that failure is a genuine stop, not a nuisance.

### 1.2 Authorization basis — the architect records this order's hash twice

Before changing one byte of the manifest or the resume note, the architect seat opens the §1 repair report
and records: this order's byte length and SHA-256; the manifest and resume-note pre-repair identities; both
`.frozen` snapshot identities; and `git status --porcelain`. After the repair completes, the architect
records this order's byte length and SHA-256 a second time.

**Codex must verify that both recorded hashes equal each other and equal the order it is executing.** A
single hash taken after the repair would prove the verification basis only. Two hashes, one taken before the
first edit, prove the **authorization** basis the architect actually edited under — that the order did not
change underneath the repair. A mismatch between the two, or between either and the executing order, is a
**BLOCKER**.

## 2. M4 changed-surface allowlist — 15 records

Changes are permitted **only** within the item-10 `Evidence` disposition substring, and **only** for these
records:

| # | record | block | source in the pre-census |
|---:|---|---|---|
| 1 | `M4.3` | `P2#0` | Task A |
| 2 | `M4.5` | `P3#0` | Task A |
| 3 | `M4.7` | `P5#0` | Task A |
| 4 | `M4.9` | `P6#0` | Task A |
| 5 | `M4.11` | `P8#0` | Task A |
| 6 | `M4.12` | `P10#0` | Task A |
| 7 | `M4.22` | `P21#0` | Task A |
| 8 | `M4.28` | `P24#0` | Task A |
| 9 | `M4.33` | `P26#0` | Task A |
| 10 | `M4.40` | `R2#0` | Task A |
| 11 | `M4.14` | `P15#0` | Task D expansion |
| 12 | `M4.26` | `P23#1` | Task D expansion |
| 13 | `M4.15` | `P15#1` | Task E expansion, retained after triage |
| 14 | `M4.30` | `P25#1` | Task E expansion, retained after triage |
| 15 | `M4.31` | `P25#2` | Task C, ruling-19 cleanup |

The item-10 block begins at `10. **Optional-field omissions:**` and ends immediately before the line
beginning `11. `. The `Evidence` disposition substring begins at `` `Evidence` — `OMIT` `` and ends at
whichever comes first: the start of the next `` `<FieldName>` — `OMIT` `` disposition, or the end of the
item-10 block.

A listed record that ends up unchanged is a finding to report, not an error. **A record changed but not
listed is a BLOCKER.**

### 2.1 Task E hits excluded from the allowlist, with grounds

The pre-census Task E expansion set contained 21 records. The architect triaged them and retained 2. The
other 19 are excluded because the literal search matched correct `Evidence` reasoning, not the collapsed
test. **This triage is architect judgment and is listed here so the confirming review can challenge it
rather than take it on trust.**

| excluded records | matched literal | ground for exclusion |
|---|---|---|
| `M4.46`, `M4.47`, `M4.49`, `M4.51`, `M4.53`, `M4.54`, `M4.57`, `M4.58`, `M4.59`, `M4.60`, `M4.61`, `M4.62`, `M4.63` | `owns` | The phrase is "no measurement, provenance, or method a separate tracked **source owns**." The verb governs a *source owning substance*, which is the correct `Evidence` test under standing ruling 23, not a path owning a statement. |
| `M4.48`, `M4.56` | `owns` | Same phrase with "tracked **file** owns" in place of "tracked source owns". Same ground. |
| `M4.35` | `owns` | "no tracked document **owns the compressed-out substance**" — the object is the compressed-out substance, which is the `Evidence` test stated correctly. |
| `M4.24` | `one-path grammar` | The one-backticked-path grammar governs **both** fields. A directory is ineligible as `Evidence` for the same reason it is ineligible as `Owner`. No collapse. |
| `M4.43`, `M4.44` | `one-path grammar` | Coequal-source reasoning. The one-path grammar constrains `Evidence` selection genuinely; the ground is source inseparability, not statement ownership. |

If the confirming review disagrees with any exclusion, that is a returned finding and the record is added by
an amended order **before** any further edit — never by widening the allowlist after the fact.

## 3. M6 changed-surface allowlist

The repair may change bytes in these M6 surfaces and no others:

1. the **M6 opening preamble** — from the end of the `## M6.` heading line to the start of the `### M6.0`
   heading line;
2. `### M6.0`;
3. `### M6.1`;
4. `### M6.3`;
5. `### M6.7`;
6. `### M6.10`.

`M6.2`, `M6.4`, `M6.5`, `M6.6`, `M6.8`, and `M6.9` must be byte-identical.

**Within M6.3, only the `ground` cell of a data row is mutable.** For all 110 rows, row order and the
`#`, `source`, `block`, `field`, `candidate label`, `disposition`, and `record` cells must be byte-identical.
Verify this cell by cell; population and bijection checks alone would not detect a candidate-label edit.

## 4. Resume-note changed-surface allowlist — frozen

File: `DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md`. Diff against the resume-note
snapshot. Four mutable surfaces, and no others.

**R1 — exactly two new standing rulings, numbered 33 and 34,** inserted immediately after ruling 32 and
before the `## MIGRATION_DATE — RESOLVED by owner act, 2026-07-31` heading. Ruling 33's subject is
field-differentiated ground vocabulary and the joint-draft-row collapse at its source. Ruling 34's subject is
that a mechanical search over reasoning prose defines a candidate population and never a finding population,
so the narrowing is judgment that must be recorded with grounds. **Two rulings, no more and no fewer.** A
third ruling, or a ruling numbered other than 33 or 34, is a **BLOCKER**.

**R2 — the top `Updated:` metadata line only.** No other byte of the header block, including the `Seat:`
value on the same physical line, may change.

**R3 — the whole `## Next session — start here` block**, bounded by that heading and the `## Cursor`
heading. This block is a replaceable current-instruction surface rather than a historical ledger, so it is
mutable in full. Its authorized purpose is to replace the stale `Task: author M5` instruction with the
actual next action — run this order through Codex, and do not advance to the derived date-occurrence report
or to ratification until it clears.

**R4 — two exact spans inside `## Cursor`, and nothing else in that section.** `## Cursor` runs to the
`## Formal ratification gate` heading and is several hundred lines of historical batch adjudications, prior
deterministic results, and closed-flag records. Those are a ledger, not status. Revision 3 wrongly made the
whole section mutable.

- **R4a** — the exact sentence, verified unique in the file:

  `M5, M6, and the derived date-occurrence report are still owed.`

  Replaceable in place by a current-status sentence recording that M5 is authored, M6 is authored and
  repaired, and Codex verification of this order is pending.

- **R4b** — the exact span beginning at the unique literal:

  `Next: **the valid Task 2 rerun over M4.2–M4.44**`

  and ending at, and including, the unique literal:

  `authorized by any batch clearance.`

  Replaceable in place. **Everything from the following `Prior context,` onward is byte-identical**,
  including the Part C authoring work-order pointer, the §7.1 staleness note, and the target §7 completeness
  sentences. That text is durable, not stale.

Both R4 anchors were confirmed unique by the architect seat against the live file.

**Explicitly immutable, and named because a naive substring sweep would collide with it:** the historical
limitations paragraph in the M4.64–M4.66 batch record containing
`M5, M6, and the derived date-occurrence report remain unauthored`. That sentence is line-wrapped in the
source, correctly describes the state at that batch's clearance, and **must not be updated**. Historical
batch prose stays true to its own moment.

Everything else is byte-identical, **including all existing standing rulings 1 through 32, each verified
individually**, and including `## Formal ratification gate`, `## In-place assembly rule`, `## Open
deterministic defect`, `## MIGRATION_DATE`, `## Repository-state warning`, `## Inputs already on disk`,
`## Review status`, `## Resuming efficiently`, and `## Read order before resuming`.

Any change to an existing ruling, to any part of `## Cursor` outside R4a and R4b, or to any section outside
R1–R4, is a **BLOCKER**.

Report the diff explicitly: the two inserted rulings in full; the changed `Updated:` line; the replaced
`## Next session — start here` block; the R4a and R4b replacements; and the byte-identity result for every
other surface named above.

## 5. Verification tasks

### 5.1 Whole-section byte identity

`M0`, `M1`, `M2`, `M3`, `M5`, and `## M7.` to end of file: each byte-identical to the manifest snapshot.
Report each as a named PASS or FAIL with byte length before and after.

### 5.2 M4 surface identity

For all 65 records at `M4.2`–`M4.66`, prove byte-identity of items 1–9, item 11, and items 12–14, and of
every part of item 10 outside the `Evidence` disposition substring — the `Authorized`, `Not authorized`,
`Owner`, and `Execution` dispositions and all framing text.

Report the exact set of records whose `Evidence` substring changed, and cross-check it against §2's fifteen
in both directions.

### 5.3 Optional-field population unchanged

Re-derive from item 9 of all 65 records, independently of anything M6 asserts: 325 slots; 68 present; 257
omitted; `Authorized` 2/63; `Not authorized` 4/61; `Evidence` 6/59; `Owner` 14/51; `Execution` 42/23. Any
deviation means the repair changed a field it was not authorized to change. **BLOCKER.**

### 5.4 M6.3 re-derivation and the doctrine check

Parse each `ground` cell by: splitting on commas; trimming whitespace; removing backticks; removing a
trailing dagger and adjacent whitespace; rejecting any empty token or any token not matching
`^[A-Z]+(?:-[A-Z]+)*$` as a reported finding.

1. Row count, expected `110`; field split, expected `59` `Evidence` / `51` `Owner`.
2. Per-record bijection against §5.3's omission set, reported in both directions.
3. Ground-token distribution: token, row count, split by field, record list.
4. **Vocabulary integrity, parsed from the repaired M6.1's field-applicability column — never from any list
   in this order:** exactly one M6.1 definition per token; no duplicate definitions; every M6.3 token
   defined in M6.1; no malformed tokens; allowed applicability values only.
5. **Field-applicability violations:** any `Evidence` row carrying an Owner-only token, or any `Owner` row
   carrying an Evidence-only token. Expected zero. Any violation is a **BLOCKER**.
6. Any M6.1 ground defined but carried by no M6.3 row, reported as an advisory.

For orientation only, the pre-census measured these pre-repair values, which the repair is expected to
change: `NO-SINGLE-PATH` at 24 rows split Evidence=5 / Owner=19, and `PARTIAL-STATEMENT` at 14 rows split
Evidence=5 / Owner=9. After repair both must be Owner-only. The architect expects 15 grounds — six
Owner-only, four Evidence-only, five both-field. Every one of these is a prediction to test, not a count to
reconcile to.

### 5.5 M6.10 re-derivation, with a per-row source map

**Derive each row from its actual source, then compare. Never read the stated value and confirm it.**

| M6.10 row | mechanical source |
|---|---|
| Live blocks | count of `### M4.<n>` records, `n` = 2–66 |
| Optional-field slots / present / omitted | item 9 of all 65 records |
| Per-field present / omitted, all five | item 9 of all 65 records |
| §4.6 register rows | M6.3 row count |
| Blocks omitting all five | M6.2 `omitted` column, cross-checked against item 9 |
| Governed field instances / distinct paths | item 9 present `Evidence` and `Owner` values, cross-checked against M6.4 |
| Paths requiring tracked verification / exempt | M6.4, and §6.2 of this order |
| Rejected co-candidates | M6.5 row count |
| Rows first grounded at M6 | M6.3 dagger count, cross-checked against M6.7 row count |
| Recorded draft divergences | M6.8 row count |
| Ground distribution table | M6.3 ground cells |

Also verify every **numeric claim in M6.10's prose**, not only the table values, including any total-token
count, and report any numeric prose claim no mechanical source supports.

### 5.6 File-level integrity

For the manifest: strict UTF-8 decode; zero U+FFFD; zero CRLF and zero bare CR; final byte LF; exactly one
`@@ASSEMBLY_CURSOR@@`, terminal. Report new byte length, physical line count, and SHA-256. Report the same
integrity set, excluding the sentinel check, for the resume note.

### 5.7 Migration-date occurrence count

Count the literal `2026-08-11` in the manifest. Expected `63`, unchanged. Report; adjust nothing to reach
it.

## 6. Folded obligations

### 6.1 Task 2 — complete 65-record rerun

**Before running anything,** read the source of the exported `countStatementSentences` in
`lib/decisions-format.ts` and report, as a named line item, what its boundary test actually is, and whether
the harness feeds it the exact item-8 statement bytes and nothing else. A spec that asserts what a command
will produce is not discharged until that assertion is checked against the script.

Then for each of the 65 records: extract exact item-8 statement bytes; run the real exported function;
report record, block, and count.

Report: the full 65-record distribution; the 43-record subset at `M4.2`–`M4.44` separately, which is the
owed rerun; every record returning a count outside `{1,2,3}`; and whether each statement's first character
is a backtick, expected zero.

The architect's provisional expectation for the full 65 is `1 = 5 / 2 = 24 / 3 = 36`. Test it; report
actuals. Retain raw stdout.

### 6.2 Task 3 — governed field-path population

Derive from item 9 of all 65 records. Expected 20 field instances across 19 distinct paths, `src/schema.ts`
the only repeat.

For each distinct path report `git ls-files --error-unmatch` disposition against HEAD
`05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` as `TRACKED` or `UNTRACKED`.

**Report the nulls per contract, never pooled:**

- **Population 1 — tracked-path verification required: 18 distinct paths.** Every one must return `TRACKED`.
- **Population 2 — exempt: 1 path.** `E038`'s `Evidence` at `M4.45` names a Stage 2b output absent at the
  Stage 2a review commit, exempt by ratified sequencing exception. Report it `EXEMPT`, report that its value
  is byte-equal to the normalized archive filename pinned at M0.1, and do not count it in Population 1 in
  either direction.

`UNTRACKED` in Population 1 is a **BLOCKER**, not a path to reclassify as exempt.

## 7. Deliverable

One report at `audit/decisions-migration-2026-07-29/M6-REPAIR-VERIFICATION-2026-08-04.md`. That single file
is the only write authorized. Leave it untracked.

Order: this order's own byte length and SHA-256, plus the §1.2 two-hash equality check; §1 identity
verification with measured values, including both `.frozen` snapshots and the pre-census report; both
`git status --porcelain` snapshots; §§4, 5, and 6 under their own headings; a findings table classed
`BLOCKER` / `REQUIRED REPAIR` / `ADVISORY` with counts; and a closing statement of anything unmeasured,
stated as unmeasured rather than as absent.

Retain raw stdout throughout. **A null or zero result discharges feasibility only, never correctness.**

## 8. What this order does not do

It does not ratify Stage 2a, authorize Stage 2b, or authorize any edit to `DECISIONS.md`. It does not
substitute for the commission-required constitutional-content review of all 65 live records and 13 archive
wrappers, which is barred to the seat that authored them. It does not clear the semantic repair.

That confirming read routes to the reviewing GPT seat and covers: the changed M4 item-10 reasoning across
all fifteen allowlisted records; **the §2.1 exclusion triage**; the M6 preamble, M6.0, M6.1, the changed
M6.3 rows, M6.7, and M6.10; the resume-note diff including both new rulings; and consistency with M2 and
standing rulings 19, 23, and 28.

The derived date-occurrence report is generated **after** this verification clears, because these edits move
byte offsets inside the manifest. No M5 source-span offset is affected — those are offsets into baseline
`DECISIONS.md`, not into this file.
