# M6 repair — architect repair report

**Date:** 2026-08-04 · **Seat:** Architect
**Authorizing order:** `DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-VERIFICATION-CODEX-WORK-ORDER-2026-08-04.md`
revision 4.

**Status: PARTIAL. M6 is NOT complete.** The six revision-4 M6 surfaces were edited, but M6 remains
incomplete because two numeric prose claims lie outside revision 4's allowlist and are still wrong. The M4
half and the resume-note update are not started. The verification order is **not yet runnable**. See §6.

**This report is the producer's status record and evidence. It is not proof of correctness.** Every measured
value in it is this seat's own measurement of its own work and is superseded by Codex's independent
verification and the GPT confirming read.

## 1. Authorization basis — recorded before the first edit

| item | value |
|---|---|
| WO2 revision 4 byte length / SHA-256 | `21421` / `76588efdca91e52e0f938837d3a0e41d283cc1119eee65212ca28a7aa863f577` |
| Manifest, pre-repair byte length / SHA-256 | `308092` / `8e0589dcfb9f7190b11ea145dfa9e10e9075c069a3c631ef1a03c3c0c42dc244` |
| Resume note, pre-repair byte length / SHA-256 | `55424` / `e27fd31d1fd497c7a64a73126438f7981ecc206689aee6ac21eb60add38afa8a` |
| Manifest snapshot | `M6-PRE-REPAIR-SNAPSHOT-2026-08-04.md.frozen`, verified byte-identical to source |
| Resume snapshot | `M6-PRE-REPAIR-RESUME-NOTE-SNAPSHOT-2026-08-04.md.frozen`, verified byte-identical to source |
| Pre-census report | `M6-REPAIR-PRE-CENSUS-2026-08-04.md`, `63695`, `edbb9693…cff3` |
| Branch / HEAD | `codex/decisions-migration` / `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| `DECISIONS.md` | `76314`, `b22b3fff…0d6e`, byte-identical to `MIGRATION_BASELINE` |

`git status --porcelain` before the first edit: untracked Stage 2a paths only; zero staged changes; zero
modified tracked files.

## 2. The defect repaired

M6 as authored collapsed the `Evidence` and `Owner` eligibility tests into one complete-statement test and
cited standing ruling 23 as its authority. Ruling 23 says the opposite: it refines the complete-statement
language **for `Evidence` only** and leaves `Owner`'s whole-statement test intact. M2's target §1 bytes
already record the single-test formulation as a legacy-prose defect repaired on 2026-07-31. M6 therefore
contradicted M2, ruling 23, and its own M6.7.

## 3. Applied — M6 surfaces, all six allowlisted surfaces changed

**M6 preamble.** Rewritten so §4.6's population is stated as every omitted `Evidence` or `Owner` field, with
§4.4 item 10 and §10 carrying the wider five-field ledger. This is the finding-2 scope repair.

**M6.0.** `eight did not` → `ten did not`. New paragraph *The field-test repair of 2026-08-04* records the
defect, the authority, and the two governing tests stated separately.

**M6.1.** Rebuilt with a `field` column. Fourteen grounds → fifteen: `NO-SINGLE-PATH` → `NO-SINGLE-OWNER`,
`PARTIAL-STATEMENT` → `PARTIAL-OWNERSHIP`, `COEQUAL-PAIR` → `NO-SINGLE-EVIDENCE-SOURCE`, and `CLAUSE-SCOPED`
added. Six `Owner`-only, four `Evidence`-only, five both-field. `PARTIAL-OWNERSHIP` now incorporates ruling
28 — a candidate is not disqualified by a clause with no enforcement surface anywhere. `ARCHIVE-ONLY` now
states that location under `Archive/` is not itself disqualifying, citing `R3#0` and `R4#0` as the
counterexamples.

**M6.3.** 43 rows changed, `ground` cell only. Ten `Evidence` rows re-adjudicated:

| row | block | old ground | new ground |
|---:|---|---|---|
| 2 | `P2#0` | `NO-SINGLE-PATH` | `NO-CANDIDATE` |
| 6 | `P3#0` | `NO-SINGLE-PATH` | `NOT-AN-AUTHORITY` |
| 10 | `P5#0` | `NOT-AN-AUTHORITY, PARTIAL-STATEMENT` | `NOT-AN-AUTHORITY` |
| 14 | `P6#0` | `PARTIAL-STATEMENT` | `NO-COMPRESSED-SUBSTANCE` |
| 18 | `P8#0` | `NO-SINGLE-PATH` | `ARCHIVE-ONLY` |
| 20 | `P10#0` | `NO-SINGLE-PATH` | `NOT-AN-AUTHORITY` |
| 38 | `P21#0` | `NO-SINGLE-PATH` | `NO-SINGLE-EVIDENCE-SOURCE` |
| 49 | `P24#0` | `PARTIAL-STATEMENT` | `CLAUSE-SCOPED` |
| 59 | `P26#0` | `PARTIAL-STATEMENT` | `CLAUSE-SCOPED` |
| 71 | `R2#0` | `PARTIAL-STATEMENT` | `CLAUSE-SCOPED` |

All ten remain `OMIT`. The remaining 33 changed rows are the three token renames plus two added daggers.
**No `#`, `source`, `block`, `field`, `candidate label`, `disposition`, or `record` cell changed, and row
order is unchanged.**

**M6.7.** Eight rows → ten. `P4#0` and `P7#0` added. `P3#0` and `P10#0` are **not** added, correcting the
"8 → 12" figure this seat gave earlier: both are in the M4 allowlist, so their grounds will be stated at the
record rather than only at M6.

**M6.10.** Counts and distribution re-derived: rows first grounded at M6 `8` → `10`; two new count rows for
the vocabulary; token total `117` → `116`; distribution table rebuilt with a `field` column. The claim that
38 rows share one complete-statement test is deleted and replaced with the ownership-class figure of 28. A
closing statement of the field-applicability invariant is added.

## 4. Not applied — state at the partial checkpoint, superseded by §8

- **Two numeric prose claims in M6 are still wrong**, found by the pre-handoff review of 2026-08-04:
  M6.3's introductory prose reads `those eight rows` where the dagger population is now ten, and M6.7's
  first paragraph reads `Eight of them are` `NO-CANDIDATE` where the table holds nine. Neither surface is
  inside revision 4's allowlist, so neither could be repaired under it. **`Eight of them are` is a
  carried-forward error, not a new one:** the pre-repair snapshot reads `Five of them are` against a table
  of seven. Authorized for repair by
  `DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-COMPLETION-CODEX-WORK-ORDER-2026-08-04.md` §3.
- **The 15 M4 item-10 `Evidence` prose repairs.** Not started. All 65 M4 records are byte-identical to
  pre-repair.
- **The resume-note update.** Not started. The file is byte-identical to pre-repair.

## 5. Post-repair identities, as of this partial state

| item | value |
|---|---|
| Manifest byte length | `312411` |
| Manifest SHA-256 | `26feb5dcbe9f501352561f8d324a34fd5285728669a01e5bccc17fa77ee8ad2f` |
| Manifest physical lines | `5916` |
| Resume note | unchanged at `55424` / `e27fd31d…fa8a` |
| WO2 revision 4, re-measured after editing | `21421` / `76588efdca91e52e0f938837d3a0e41d283cc1119eee65212ca28a7aa863f577` — equal to §1 |

Architect-measured invariants at this state:

- `M0`–`M4` byte-identical to the snapshot; `M5` byte-identical; `## M7.` to EOF byte-identical.
- Zero occurrences of `NO-SINGLE-PATH`, `PARTIAL-STATEMENT`, or `COEQUAL-PAIR` remain in M6.3.
- Exactly one `@@ASSEMBLY_CURSOR@@`, terminal.
- `2026-08-11` occurrence count `63`, unchanged.

These are this seat's own measurements and **discharge nothing**. They are the producer's self-report and
are superseded by Codex's independent verification.

## 6. Exact next action

1. **Codex: Task 0 of the completion order** — freeze the current partial manifest at `312411` /
   `26feb5dc…` as `M6-PARTIAL-M6-ONLY-SNAPSHOT-2026-08-04.md.frozen`. No further architect edit occurs
   until that copy is hash-verified.
2. Architect: the two M6 prose corrections at completion-order §3; then the fifteen M4 records at revision 4
   §2; then the resume note at revision 4 §4. Record the completion order's hash before and after,
   retaining the revision-4 two-hash proof already at §1 and §5 for the landed M6 changes.
3. Then run revision 4 §§5 and 6 **plus** completion-order §5 through Codex. **They must not run against
   this partial state**: revision 4 §5.2 would report zero changed M4 records against a fifteen-record
   allowlist, and §4 an unchanged resume note against a four-surface allowlist. Both are findings the order
   expects to be non-empty.
4. Then the GPT confirming read.

Nothing was staged, committed, pushed, cleaned, or modified beyond the six M6 surfaces and this report.

## 7. Continuation authorization basis — recorded before the first continuation edit

**Authorizing order for the continuation:**
`DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-COMPLETION-CODEX-WORK-ORDER-2026-08-04.md`. It does not supersede
revision 4 and does not edit revision 4's bytes. It adds the M6.3 and M6.7 introductory-prose surface, and
carries revision 4 §2 and §4 forward still unexecuted.

| item | value |
|---|---|
| Completion order, byte length / SHA-256, **recorded before the first continuation edit** | `10235` / `97a8c5297c3da7d2f4ca8af215ba0e1ffda532b912815c44a41a52b74c152065` |
| WO2 revision 4, re-measured at this checkpoint | `21421` / `76588efdca91e52e0f938837d3a0e41d283cc1119eee65212ca28a7aa863f577` — equal to §1 and §5 |
| Manifest, pre-continuation byte length / SHA-256 | `312411` / `26feb5dcbe9f501352561f8d324a34fd5285728669a01e5bccc17fa77ee8ad2f` |
| Manifest, pre-continuation physical lines | `5916` |
| Resume note, pre-continuation | `55424` / `e27fd31d1fd497c7a64a73126438f7981ecc206689aee6ac21eb60add38afa8a` |
| Partial-state snapshot, Task 0 | `M6-PARTIAL-M6-ONLY-SNAPSHOT-2026-08-04.md.frozen`, `312411` / `26feb5dc…8ad2f`, `cmp` against the manifest exited `0` |
| Pre-repair manifest snapshot | `M6-PRE-REPAIR-SNAPSHOT-2026-08-04.md.frozen`, `308092` / `8e0589dc…c244` |
| Pre-repair resume snapshot | `M6-PRE-REPAIR-RESUME-NOTE-SNAPSHOT-2026-08-04.md.frozen`, `55424` / `e27fd31d…fa8a` |
| Pre-census report | `M6-REPAIR-PRE-CENSUS-2026-08-04.md`, `63695` / `edbb9693…cff3` |
| Branch / HEAD | `codex/decisions-migration` / `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| `DECISIONS.md` | `76314` / `b22b3fff…0d6e`, byte-identical to `MIGRATION_BASELINE` |

`git status --porcelain` at this checkpoint: untracked Stage 2a paths only, including everything under
`audit/decisions-migration-2026-07-29/`; zero staged changes; zero modified tracked files.

**Provenance of the completion order's digest, stated because this seat did not produce it.** The architect
seat has no hashing primitive on the filesystem connector; it can measure byte length and content but not
compute SHA-256. The digest above is Codex's `shasum -a 256` on the file, and it equals a value the
reviewing GPT seat produced independently beforehand. Two seats, two paths to the value, one result. This
seat measured the byte length `10235` independently and it agrees — but length agreement is corroboration
of length only and is **no evidence at all about the digest**, which is why the second measurement was
required rather than the first accepted.

**The closing measurement at §8 is a second measurement, not a transcription.** The completion order's
two-hash requirement proves the authorization basis only if both values are measured. Copying this table's
digest forward would prove nothing and would disguise the fact that nothing had been proven.

The partial-state snapshot named above is the diff baseline for the continuation. The two pre-repair
snapshots remain the diff baselines revision 4 §5 and §4 name, and none of the three is touched.

## 8. Continuation applied — 2026-08-05

**Status: the two M6 prose corrections, the fifteen M4 `Evidence` dispositions, and the four
resume-note surfaces are applied. The continuation is complete apart from its closing measurement at
§9.** This section supersedes §4 entirely.

### 8.1 M6 prose corrections — completion order §3

| # | surface | from | to |
|---:|---|---|---|
| 1 | M6.3 introductory prose | `those eight rows` | `those ten rows` |
| 2 | M6.7 first paragraph | `Eight of them are` | `Nine of them are` |

Both were **re-derived before editing rather than taken from the order**. M6.3 carries daggers at rows
8, 13, 16, 22, 27, 32, 34, 36, 40, and 44 — ten. The M6.7 table holds ten data rows, nine
`NO-CANDIDATE` on `Evidence` and one `NO-EXECUTABLE-OWNER` on `Owner`.

The neighbouring claim `grew from eight to ten` was checked against the pre-repair snapshot, which
carries daggers at rows 13, 22, 27, 32, 34, 36, 40, and 44 — eight. It is correct as written and was
not changed. That measurement also reconciles the apparent conflict between this report's §3
(`Eight rows → ten`) and the completion order's `a table of seven`: the pre-repair M6.7 table held
eight rows, seven of them `NO-CANDIDATE`. Both statements are true of different populations. **No
third prose defect was found in the two authorized spans.**

### 8.2 The fifteen M4 item-10 `Evidence` dispositions — revision 4 §2

All fifteen rewritten. Thirteen stated the collapsed complete-statement test; two — `M4.5` and `M4.12`
— were bare `OMIT` with no reasoning at all and now carry a ground. Each record's wording is governed
by its repaired M6.3 ground and by the `Evidence` test stated at M6.0.

| record | ground | what the new reasoning asserts |
|---|---|---|
| `M4.3` | `NO-CANDIDATE` | No candidate proposed at the record or in any draft register; omission rests on that and on no judgment about what an eligible source could carry. |
| `M4.5` | `NOT-AN-AUTHORITY` | The two registered audit scripts implement the deterministic layer rather than carry evidence the statement is forbidden to restate. |
| `M4.7` | `NOT-AN-AUTHORITY` | `BANK-REVIEW-LEDGER.md` is an operational record the pipeline produces, not a source carrying compressed-out substance. |
| `M4.9` | `NO-COMPRESSED-SUBSTANCE` | `AGENTS.md` states the same policy rather than carrying evidence behind it. Names ruling 23 explicitly to foreclose the partial-support objection. |
| `M4.11` | `ARCHIVE-ONLY` | Substance survives only in the archived `E039b` extensions and pre-compression governance text, neither a tracked path. |
| `M4.12` | `NOT-AN-AUTHORITY` | `src/schema.ts` and `src/sessionSampler.ts` implement the weighting and the draw rather than carrying evidence. |
| `M4.14` | `NO-COMPRESSED-SUBSTANCE` | Rationale is carried inside the statement; nothing is compressed out. Part A provenance sentence retained verbatim. |
| `M4.15` | `ARCHIVE-ONLY` | Forcing evidence survives only in a dated remediation work artifact that is no tracked path. |
| `M4.22` | `NO-SINGLE-EVIDENCE-SOURCE` | The deferred shape is divided inseparably across two coequal sources; naming either would materially misrepresent the deferral. |
| `M4.26` | `NO-COMPRESSED-SUBSTANCE` | The measured proof is set by the principle it refines rather than compressed out of a source. Owner-side reasoning removed. |
| `M4.28` | `CLAUSE-SCOPED` | The source is expressly attached to rule F's `post_intervention` test, a clause this statement does not keep. Ruling 19. |
| `M4.30` | `ARCHIVE-ONLY` | The composite-readability spec survives only as archived history and is no tracked path. |
| `M4.31` | `WRONG-AUTHORITY` | The pinned path is tracked but ratifies the opposite of a limb the statement keeps. Ruling 19. |
| `M4.33` | `CLAUSE-SCOPED` | The source is attached to the flowsheet origin and the statement generalizes past it. Ruling 19. |
| `M4.40` | `CLAUSE-SCOPED` | The source is attached to the extraction-preservation clause through its Rule C. Ruling 19. |

**Three cross-references were repaired as a consequence, not as an independent choice.** `M4.28` and
`M4.33` both pointed at `P6#0` as the authority for their reasoning, and `M4.40` pointed at `P25#2` as
a clause-promotion precedent. `P6#0` is `M4.9`, whose ground is now `NO-COMPRESSED-SUBSTANCE`, and
`P25#2` is `M4.31`, whose ground is now `WRONG-AUTHORITY` — a different defect from clause promotion.
Leaving those pointers would have left three records citing an authority that no longer says what they
claim. Each now names standing ruling 19 directly.

**Source of the record text.** Authoring ran against a Codex extraction packet at
`Project Shrimp Scratch/M6-M4-COMPLETE-AUTHORING-PACKET-2026-08-05.txt`, `28619` /
`5cbdeacf52e4b23458d081f641a04d81c40317329de51686cf02969e6f33c2fe`, carrying item 8, item 9, item 10,
and the bounded `Evidence` substring for each of the fifteen — 60 blocks, none missing, no ambiguous
boundary, manifest identity equal at start and end, nothing written inside the repository. The item-8
statements were required because the correct `Evidence` reasoning turns on what each statement is
forbidden to restate, which cannot be recovered from a ground cell.

### 8.3 Two process events, recorded because neither is visible in the bytes

**Specification drift across the extraction handoff chain.** The four-block request this seat issued
reached the executing seat as three successive commissions, and the requirement that one transport
artifact carry all four blocks per record was lost in the middle one. As reported by the reviewing
seat: an initial inline run emitted `ITEM8`, `ITEM9`, and `ITEM10` for all fifteen records — 45 of the
60 blocks — and failed all fifteen `EVIDENCE` extractions, its matcher not accepting the physical line
break between the field label and `OMIT`; the reviewing seat then narrowed the follow-up commission
expressly to the failed `Evidence` substrings and expressly excluded items 8, 9, and 10; a third
commission restored the full requirement and produced the accepted 60/60 packet.

**What this seat observed, separated from what it was told.** This seat received the two scratch
artifacts and their receipts. The first carries fifteen `Evidence` substrings and no other block and
reports `Successfully extracted: 15 requested records` with `Missing or ambiguous boundary: none` —
accurate against the narrowed commission it actually ran, which this seat had not seen. This seat's
first account of that gap attributed it to the executing seat anchoring on the final clause of a prose
request. **That attribution was an inference this seat did not witness, and it is withdrawn.** The
initial inline run and the narrowing instruction are not in this seat's context and are **unverified
by this seat**; they rest on the reviewing seat's report. One detail is at least consistent with that
report: every `Evidence` disposition in this file does place a physical line break between
`` `Evidence` — `` and `` `OMIT` ``, which is the failure mode described.

**The generalizable point survives either account.** A corrective commission that repairs a failed
sub-population can silently drop the parent requirement that the artifact be self-contained. No
intermediate receipt was false; the loss lived in the commissions, not in the reports, which is why
reading the receipts more carefully would not have caught it. What did catch it was an arithmetic
target — sixty blocks, reported as `BLOCKS_EMITTED`, checkable without judgment. **Recorded as an
observation and deliberately not as a standing ruling:** revision 4 §4 R1 authorizes exactly two new
rulings, 33 and 34, and names a third as a BLOCKER. If this warrants ruling status it must arrive by
amended order.

**One `edit_file` call aborted and applied nothing.** The third batch of five was submitted with the
new text pasted into the `oldText` field of the `M4.40` edit. The call is atomic, so the anchor
mismatch aborted all five; the manifest was re-measured before the retry and was unchanged from the
post-batch-2 state. The retry with the correct anchor applied all five.

### 8.4 Architect-measured state after the continuation edits

| item | value |
|---|---|
| Manifest byte length | `313733` |
| Manifest, characters as reported by the edit tool | `311954` |
| Resume note, characters as reported by the edit tool | `59454`, from `55109` |
| Resume note byte length | **not measured by this seat**; owed at closeout and from revision 4 §5.6 |
| Completion order | re-measure owed at closeout; **not** transcribed from §7 |
| All three `.frozen` snapshots | untouched, at `312411`, `308092`, and `55424` |

Residual-literal check over the manifest: every surviving occurrence of `complete statement` or
`complete-statement` sits in an `Owner` disposition, in an item 12, or in M6.0's own account of the
defect. **None sits in the `Evidence` disposition of any of the fifteen.** Seven of the fifteen
initially left `` `Owner` `` inline on an over-long line; the whitespace preceding a following
disposition belongs to the `Evidence` substring under revision 4 §2, so the wrap was corrected there
and **no `Owner` byte moved**.

Every figure in this section is this seat's own measurement of its own work and **discharges nothing**.
Byte length is measurable on this connector; SHA-256 is not, and none is claimed.

### 8.5 Resume note — revision 4 §4's four surfaces

**R1 — rulings 33 and 34, and no others.** Inserted after ruling 32 and before the
`## MIGRATION_DATE` heading. Ruling 33 is the field-differentiated ground vocabulary and the
joint-draft-row collapse at its source; ruling 34 is that a mechanical search over reasoning prose
defines a candidate population and never a finding population, with the 21-to-2 narrowing named as
judgment carrying per-record grounds. Verified after the write: the note carries `32.`, `33.`, and
`34.` and no `35.`

**R2 — the `Updated:` line only.** `2026-08-01` → `2026-08-05`. The `Seat:` value on the same physical
line is unchanged.

**R3 — the `## Next session — start here` block.** The stale `Task: author M5` instruction and its
six-item M5 reading list are replaced by the actual next action: Codex's single verification
deliverable, the bar on advancing to the derived report or to ratification before it clears, and the
GPT confirming read after it. A pointer to this repair report is added, and so is a standing note that
the architect seat has no hashing primitive and that a closing digest is always a fresh measurement.
The routing list, the schedule constraint, the three unratified delegation clauses, and the 2026-08-01
process note are **retained**, with only their stale figures updated — the block is mutable in full,
but most of it was not stale.

**R4a and R4b — the two exact `## Cursor` spans, and nothing else in that section.** R4a's sentence now
records M5 and M6 authored, the repair and continuation applied, and Codex verification pending. R4b's
span now names the M6 verification as next and states that the derived report is not generated until it
clears. Everything from the following `Prior context,` onward is untouched.

**The explicitly immutable sentence was not touched.** The M4.64–M4.66 batch record's historical
`... remain unauthored; formal ratification and Stage 2b remain unauthorized.` is byte-identical; it
moved from physical line 287 to 305 only because R3's block grew above it. A naive substring sweep for
`remain unauthored` would have collided with it and with the retained finding in the `MIGRATION_DATE`
section; both are historical prose that stays true to its own moment.

### 8.6 Exact next action

1. Architect: §9 of this report — the completion order's closing byte length and SHA-256, **measured
   afresh by a seat that can hash**, never copied from §7. This is the last architect step.
2. Codex: revision 4 §§5 and 6 plus completion-order §5, in the single deliverable revision 4 §7 names.
   Revision 4 §5.6 supplies the resume note's measured byte length, line count, and digest, which this
   seat could not measure.
3. GPT: the confirming read, revision 4 §8 scope extended to the two prose corrections and the fifteen
   repaired `Evidence` dispositions.

## 9. Closing authorization measurement — completion order §6.2

Measured after the last continuation edit landed, by a fresh Codex run rather than by transcription
from §7.

| item | opening, §7 | closing, §9 | equal |
|---|---|---|---|
| Byte length | `10235` | `10235` | yes |
| SHA-256 | `97a8c5297c3da7d2f4ca8af215ba0e1ffda532b912815c44a41a52b74c152065` | `97a8c5297c3da7d2f4ca8af215ba0e1ffda532b912815c44a41a52b74c152065` | yes |

**Findings.**

1. Opening and closing byte lengths are equal.
2. Opening and closing SHA-256 values are equal.
3. `DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-COMPLETION-CODEX-WORK-ORDER-2026-08-04.md`, the authorizing
   instrument for the continuation, remained byte-identical from before the first continuation edit
   through the last. The authorization basis and the verification basis are the same bytes.
4. **No blocker arose under revision 4 §1.2.**

The same discipline holds for revision 4 itself: its `21421` / `76588efd…f577` identity is recorded at
§1, §5, and §7 and was equal at each, so the instrument governing the landed M6 changes and the
fifteen `Evidence` dispositions is also unchanged across the whole repair.

**Provenance, restated because it is the point of the two-hash rule.** Neither value in the table above
was produced by the architect seat, which has no hashing primitive. Both are `shasum -a 256` output
from a measuring seat, taken at two separate times, and the opening value was additionally corroborated
by an independent GPT measurement before any edit was made. A closing digest copied from an opening
record would satisfy the form of this section and prove nothing; this one was measured.

**Architect editing on this repair is closed.** The manifest, the resume note, the completion order,
and revision 4 are not to be altered again by this seat. The next action is Codex's full verification
deliverable under revision 4 §§5–7 plus completion-order §5, followed by the GPT confirming read. Any
finding either returns is adjudicated by the architect seat as a review return, under a fresh
authorization identity recorded before the first repair edit — not as a continuation of this one.
