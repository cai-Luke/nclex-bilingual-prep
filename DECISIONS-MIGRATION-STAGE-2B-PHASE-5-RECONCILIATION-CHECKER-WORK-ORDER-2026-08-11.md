# Stage 2b Phase 5 — target reconciliation checker (commission §5.7)

**Date:** 2026-08-11 · **Revision:** 2 · **Seat issuing:** Architect · **Executing seat:** Codex

## 0. Identity, revision history, and immutability

**This order carries no hash slot by design**, for the reason every prior phase order in this migration
has carried none: a hash written into the document it describes cannot describe that document's current
bytes, because writing it changes them. Its authorized identity is measured externally by the owner and
recorded in the owner acknowledgment, the resume note, and the Codex handoff, in the form:

> Stage 2b Phase 5 work order revision 2 is authorized at `<length>` bytes / SHA-256 `<digest>`.

**This file is not edited after that measurement.** If non-author review finds a defect before external
measurement, the correction is made in place on this unauthorized draft and the revision number is
advanced only if two distinct byte states have carried the same label. Once authorized, this file is not
edited; if it proves defective mid-execution, stop and return to the architect seat for a superseding
instrument.

**Revision history.** Revision 1 was drafted 2026-08-11, byte-measured at `24134` bytes, and recorded at
that identity in the resume note before non-author review; it was never externally hash-frozen or issued.
GPT's independent cold review returned `REVISE` — accepting the authority architecture at §1.1 and the
pinned nulls, and finding seven defects, every one of which this seat independently confirmed against live
disk before repairing rather than accepting from the review's description:

1. **Reports 7–8 were weakened to an identity-only bijection** keyed on `P<n>#<ordinal>` or exact title.
   Confirmed against commission §5.7's own closing sentence: "The manifest supplies exact record identity
   **and text**, not the population null." An identity-only bijection would accept a block whose ID or
   title is right but whose statement or field bytes have been altered — precisely the class the manifest
   exists to pin. Repaired at Step 2: the 65 blocks are compared component-by-component over their
   **manifest-owned** bytes, with a matching negative control added at Step 5.
2. **Ratified Amendment 4 was named as an input but never wired into the authority set.** Confirmed:
   commission §5.7 lists "ratified Amendment 4's E053 correction" among the checker's inputs, and the
   actual instrument is `DECISIONS-ARCHIVE-PRESERVATION-AND-WRAPPER-ADDRESSING-AMENDMENT-2026-07-29.md`
   §6 (read in full; it ratifies E053 → structural §8 prose, no wrapper, no archive-index line, 13
   wrappers and 13 archive-index lines, and the 80-row reconciliation). Revision 1 omitted it from §1.2
   and §3 and hard-coded only its arithmetic consequence. Repaired at §1.2, §3, and Step 2.
3. **The wrapper span check would have been byte-incorrect in Node.** Confirmed by reading the manifest's
   own wording — "Source byte offsets," zero-based half-open — against a baseline containing multi-byte
   UTF-8 (`—`, `§`, `×10⁹`, `µ`). JavaScript string indices are UTF-16 code-unit indices, not byte
   offsets, so slicing decoded text at those numbers silently mis-slices every span after the first
   multi-byte character. Repaired at Step 2 report 3: raw `Buffer` throughout. The same finding noted the
   check searched the whole archive for the body rather than comparing it to the corresponding wrapper's
   own body, which would let two swapped wrapper bodies pass; repaired in the same place.
4. **Negative control 4 was not deterministic.** Confirmed: Amendment 2's eight surfaces include the §3
   table header, separator row, and declared-total line, all of which the parser requires as exact
   literals — mutating one breaks parsing and would legitimately fail the manifest-scoped reports too,
   destroying the independence the control is meant to prove. Repaired at Step 5 by pinning the mutation
   to a parser-neutral byte inside a §§4–7 transition prose payload.
5. **The scratch-input mechanism was unspecified.** Confirmed: the package command binds to canonical
   repository paths, yet Step 5 requires four runs against scratch copies, leaving Codex to invent the
   interface. Repaired at Step 2 as an explicit test-only input-override requirement.
6. **§8 repeated the "report before the first repository write" contradiction** — creating the report is
   itself a repository write. Confirmed; this exact class was already repaired once, in Phase 4 revision
   2's §8. Repaired at §8.
7. **Step 6's closing accounting was wrong.** Confirmed: with staging forbidden, the new checker script
   and the report are **untracked**, not "new tracked paths," and revision 1's five-path population
   omitted the report entirely. Repaired at Step 6 with a tracked/untracked split.

The review additionally observed that revision 1's Amendment 3 scope line named "the format conformance
command" as join coverage, when Phase 5 does not run it and §5.8 has not wired it. Confirmed and repaired
at Step 2: the scope line now names only evidence that actually exists.

## 1. Authority

Stage 2b Phase 4 closed on architect `ACCEPT`
(`DECISIONS-MIGRATION-STAGE-2B-PHASE-4-CLOSEOUT-2026-08-08.md`, dated 2026-08-11), which is the
precondition commission §5.7 and Phase 4 work order §9 both require before this phase may be
commissioned. This order commissions **Phase 5 only**: commission §5.7, the target reconciliation
checker. It authorizes no part of §5.8 (conformance wiring), no part of §6 (post-migration
reference-graph artifact), and no part of §7.1 or §8 (final verification and independent
implementation review).

### 1.1 The expanded authority chain — read this before writing any assertion

Commission §5.7 was written on 2026-07-29, when the ratified Stage 2a manifest was the only construction
authority for target `DECISIONS.md`. That is no longer true, and **§5.7's own text was deliberately not
rewritten when it stopped being true.** Both amendments say so in their own operative text:

- Ratified Amendment 2 §0 and §3 state it does not amend §5.7, because §5.7 governed a phase not yet
  live; Amendment 2 §4.6's **forward note** instead instructs, as ratified text: "When the Phase 5 work
  order (commission §5.7) and the final §7.1/§8 verification are drafted, each must treat 'the ratified
  manifest' as shorthand for 'the ratified manifest and ratified Amendment 2, for the eight surfaces the
  latter pins' wherever it governs target `DECISIONS.md` content."
- Ratified Amendment 3 §3 states it does not amend §5.7 "for the same reasons Amendment 2 did not," and
  its §4.2 supersession statement is population-scoped and general: for the join-byte population,
  "ratified Amendment 3 is construction authority co-equal with the ratified manifest and ratified
  Amendment 2."
- `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-RATIFICATION-2026-08-08.md` item 6 records the same:
  "Commission §5.7, §7.1, §8, and §12 are not amended."

**Consequence, binding on this order and on the checker it commissions.** Wherever commission §5.7 says
"the ratified manifest," or wherever the checker would otherwise assert that some target content is or is
not authorized, the governing authority is **the ratified manifest, ratified Amendment 2, and ratified
Amendment 3 together**, each over its own disjoint population:

| target population | governing authority |
|---|---|
| The 65 live entry blocks (heading, statement, field list) and their 65 entry-index rows | Ratified manifest, M4 items 7–9 and 11 |
| Target §1 and §2 | Ratified manifest, M2 and M3 |
| Target §8's structural introduction, the 13 archive-index lines, the six-row retired register | Ratified manifest, M5.4, M5.6, M5.7 |
| Target §3's introduction, table header row, separator row, declared-total line; the §§4–7 section headings and transition paragraphs — eight surfaces | Ratified Amendment 2 §2 |
| Every inter-fragment join byte in the assembly, plus the single end-of-document byte | Ratified Amendment 3 §2 |

Separately, and not a target-byte authority at all: **ratified Amendment 4 §6** governs the *source
classification* the checker reconciles against — E053's destination, and therefore the 13-wrapper and
80-row accounting. It pins no target byte; it corrects what the frozen phase-1 artifacts say.

**Why this order does not require a fourth commission amendment, stated so a later seat does not
re-litigate it.** §5.7's own reporting obligations are **block-scoped and population-scoped**, not
byte-scoped over the whole document: it requires "no target block absent from the manifest; no manifest
block absent from target output," alongside the 80-row accounting, wrapper span/hash preservation, and
snapshot equality. Every *block* in target `DECISIONS.md` is manifest-pinned; Amendment 2 pins no block
and Amendment 3 pins no block, by each amendment's own explicit disclaimer (Amendment 2 §3, Amendment 3
§3). §5.7's literal obligations are therefore satisfiable exactly as written, and no conflict arises
requiring amendment.

What *does* arise is a live misreading risk, which Step 2 below exists to close: an implementer who reads
"no target block absent from the manifest" as "no target *text* absent from the manifest" would flag
Amendment 2's eight surfaces and Amendment 3's join bytes as unaccounted, and the checker would fail the
target it is supposed to certify. That is a false failure, and producing one is a defect of this phase,
not a finding about Phase 4. **Block-scoping is not text-weakening**: within each block, the manifest owns
exact text as well as identity, and Step 2 checks it (§5.7's own closing sentence).

**If execution finds any §5.7 obligation that genuinely cannot be satisfied without construction
authority none of the ratified instruments supplies, that is a stop (§7), not an invitation to infer,
narrow the obligation, or weaken a pinned null.** Commission §7.1 item 11's byte-scoped "manifest/output
exact equality check" will need this same combined reading when final verification is drafted; this order
does not pre-write it and does not authorize it.

### 1.2 Governing documents, in precedence order

`DECISIONS-MIGRATION-COMMISSION-2026-07-29.md`;
`DECISIONS-ARCHIVE-PRESERVATION-AND-WRAPPER-ADDRESSING-AMENDMENT-2026-07-29.md` (ratified Amendment 4;
its §6 is the E053 correction commission §5.7 names as a checker input);
`DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md`;
`DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-STRUCTURAL-SURFACES-2026-08-08.md` with its ratification
record; `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-ASSEMBLY-JOINS-2026-08-08.md` with its ratification
record; `DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md`; the four Stage 2b phase closeouts;
this order.

## 2. Seat and producer≠checker

Codex is the implementation producer. Codex authors **executable checker logic**, not constitutional
wording: this phase writes no byte into `DECISIONS.md`, into either archive file, into the manifest, or
into any amendment. Codex makes no migration disposition and resolves no ambiguity by inference; an
ambiguity is a stop condition (§7).

The architect seat authored this order and adjudicates the returned receipt cold against live disk.
**Codex's own post-write self-checks discharge feasibility only, never correctness.** A checker that
passes is not thereby a correct checker — a checker that asserts nothing also passes. Step 5 therefore
requires negative-control evidence, and §9's adjudication independently re-runs the checker and
independently exercises at least one negative control of the architect's own choosing.

## 3. Prerequisites, architect-measured cold on 2026-08-11

| item | architect-measured state |
|---|---|
| Branch | `codex/decisions-migration` |
| HEAD | `05f9bcd` (full: `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`) |
| Staged paths | none |
| Modified tracked paths | exactly three: `DECISIONS.md` (Phase 4's accepted output), `lib/decisions-format.ts`, `scripts/tests/decisions-format.ts` (Phase 1's accepted output) |
| `DECISIONS.md`, working tree | `56964` bytes / SHA-256 `3dc5dbc0c6acbfe4f74fa353b80d53c7feeec4f5ada0a42d7b9773f26c26f4a8` — Phase 4's accepted output; **read-only in this phase** |
| `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` | `76314` bytes (Phase 2 output, unchanged) |
| `Archive/DECISIONS-ARCHIVE-2026-08-18.md` | `13997` bytes / SHA-256 `e75e979ea121fa1a697861f8de4a4527f07ef2d8b7ed1f4d299bf504163e873c` (Phase 3 output, unchanged) |
| Ratified manifest | `332579` bytes / SHA-256 `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` |
| Ratified Amendment 2 | Revision 3, `24202` bytes / SHA-256 `4cb16995cf8810bcf3ee65ffb07dc32a14a4fb5b0c4adc8ba5bbb2a2a535e9f4` |
| Ratified Amendment 3 | Revision 4, `26963` bytes / SHA-256 `9a1a3a898bf847d8dbe760c7aba702f3a3c3c3381c760bba989ffa5b8542944e` |
| Ratified Amendment 4 | `DECISIONS-ARCHIVE-PRESERVATION-AND-WRAPPER-ADDRESSING-AMENDMENT-2026-07-29.md`, `22665` bytes — §6 carries the E053 correction |
| `MIGRATION_BASELINE` | `d499cc1d0916e03830489ec9cd0324cd1a203a73`; `git show <full>:DECISIONS.md` is `76314` bytes |
| `scripts/decisions-migration-reconcile.ts` | `20631` bytes — the frozen phase-1 checker; **not modified in this phase** |
| `scripts/decisions-migration-target-reconcile.ts` | **does not exist** — this phase creates it |
| `package.json` | `8443` bytes; `"reconcile:decisions-migration"` present; **no** `reconcile:decisions-migration-target` key present |
| Frozen phase-1 artifacts | `audit/decisions-cleanup-2026-07-24/inventory.md` `28554` bytes; `migration-table.md` `16833` bytes; `outline-before-after.md` `9878` bytes — **read-only, never rewritten** |

Confirm every row above against live disk in Step 1 and report any divergence before proceeding. The
untracked migration working set is large and grows by design; that is expected and is not drift. Any
*fourth* modified tracked path beyond the three listed, or any change to a path listed above, is a stop.

## 4. Write allowlist, frozen at issue

Exactly three paths may be written in this phase:

1. `scripts/decisions-migration-target-reconcile.ts` — new; commission §5.2 item 8.
2. `package.json` — **one single change only**: adding the `"reconcile:decisions-migration-target"` script
   key. No dependency, version, field, ordering, or formatting change of any kind.
3. `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-TARGET-RECONCILE-REPORT-2026-08-11.md` — the
   deliverable at §8.

**No other repository path may be written, created, moved, renamed, or deleted.** `DECISIONS.md`, both
archive files, the manifest, all amendments, the frozen phase-1 artifacts, the existing
`scripts/decisions-migration-reconcile.ts`, and the two Phase 1 source files are read-only inputs and are
not touched.

Ephemeral writes outside the repository (a scratch directory for negative-control fixtures) are permitted
and are not branch outputs; remove them when the phase completes.

No commit and no push. This phase leaves its work in the working tree for architect adjudication.

## 5. Execution sequence

### Step 1 — opening measurement and reconnaissance

Record branch, HEAD, `git status --porcelain`, and the byte length/SHA-256 of every path in §3's table;
confirm against §3 and report any divergence before proceeding. Resolve and print the full
`MIGRATION_BASELINE` SHA with `git rev-parse` rather than copying it from this order, and confirm
`git show <full>:DECISIONS.md` measures `76314` bytes.

Read `scripts/decisions-migration-reconcile.ts` before writing anything. It is the frozen phase-1 checker
and the structural precedent for the new one — same invocation convention (`tsx`), same accumulate-and-
report failure style, same hard-pinned-constants discipline. Do not import from it, do not refactor it,
do not extract shared helpers out of it into a common module: it is frozen, and a shared-helper extraction
would modify it. Duplicated helper logic between the two checkers is intentional and correct here.

Read ratified Amendment 4 §6 directly. Locate and record the exact names and signatures of any
`lib/decisions-format.ts` exports the new checker consumes. Confirm each by reading the file; do not
assume any name from this order's prose or any prior document's.

### Step 2 — author the target checker with independently pinned nulls

Create `scripts/decisions-migration-target-reconcile.ts`.

**The pinned null is authority and is hard-coded in the checker.** Per commission §5.7 and §3.2, the
checker carries these constants and **must not derive any of them from the manifest, from any amendment,
or from the target files it is checking**:

- Source-row accounting: **65 live / 13 wrappers / 1 structural E053 / 1 `MERGE_INTO` = 80**.
- Section totals: **37 `P` / 6 `R` / 19 `I` / 3 `T`**.
- Archive-index lines: **13**. Archive wrappers: **13**.
- Retired-identifier register: **6 rows** — `P9`, `P12`, `P18`, `P22` `RETIRED`; `P13`, `P14`
  `NEVER ASSIGNED`.
- Allocation union contiguous through `P31` and `R6`.

The manifest supplies exact record identity **and text**; it does not supply the population null. A
checker that reads its expected counts out of the document it is checking asserts nothing.

**Inputs, per commission §5.7:** the frozen phase-1 inventory and migration table as historical source
classification; ratified Amendment 4 §6's E053 correction; the `MIGRATION_BASELINE` source read via
`git show` as **raw bytes**, not from the working tree and not from the preservation snapshot; the
ratified Stage 2a manifest; ratified Amendment 2; target `DECISIONS.md`; the normalized archive; the
preservation snapshot.

**Test-only input override, required so Step 5 is executable.** The checker exposes an explicit
interface — CLI flags, environment variables, or equivalent — that redirects the target, archive, and
snapshot inputs to alternate paths. The zero-argument `npm run reconcile:decisions-migration-target`
invocation must remain bound to the canonical repository paths, so the wired command can never be
silently pointed elsewhere. Document the interface in the checker's own header comment and in the
receipt.

**Required separate reports, per commission §5.7 — each reported on its own line with its own verdict,
never pooled into a single aggregate pass:**

1. 65 live rows; 13 wrapper rows; E053 structural row; E037 merge row; total 80.
2. Section totals 37/6/19/3.
3. Exact source-span and hash preservation for all 13 wrapper bodies.
4. Snapshot exact equality.
5. No unaccounted source entry.
6. No duplicate destination accounting.
7. No target block absent from the manifest.
8. No manifest block absent from target output.

**Report 3 — raw bytes, and wrapper-to-wrapper.** The manifest's M5.5.*n* spans are **zero-based
half-open byte offsets** into the baseline, and the baseline contains multi-byte UTF-8. Read
`git show <full>:DECISIONS.md` as a `Buffer` and slice with `Buffer.subarray`/`Buffer.slice` at those
offsets; **never** index a decoded JavaScript string with them, since string indices are UTF-16 code
units and would silently mis-slice every span following the first multi-byte character. Verify each
slice's own byte length and SHA-256 against the manifest's pinned values **before** using it. Then
compare the slice to the body of **the corresponding wrapper** in the normalized archive, matched by
block key — not to the archive as a whole. A substring search anywhere in the archive would pass two
wrapper bodies that had been swapped or misbound to the wrong heading.

**Report 4 — non-circular.** Compare `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` byte-for-byte to
the `git show MIGRATION_BASELINE:DECISIONS.md` object. Never compare the snapshot against itself, and
never against a hash that the snapshot's own Phase 2 receipt reports; either is circular.

**Reports 7 and 8 — block-scoped population, exact text within each block.** Both are scoped to the 65
live entry blocks; neither is a claim about every byte in the target document. Establish a bijection
between the manifest's 65 M4 records and the 65 blocks parsed out of target `DECISIONS.md`, keyed on
block identity (`P<n>#<ordinal>` for ID-addressed entries, exact title for name-addressed entries) —
**and then, for every matched pair, compare the manifest-owned components exactly**:

- the exact heading bytes (M4 item 7);
- the exact statement bytes (M4 item 8);
- the exact field list, every line, in order (M4 item 9);
- the exact entry-index row for that block (M4 item 11), against the corresponding row in target §3.

Identity agreement alone is not sufficient and does not discharge reports 7 and 8: commission §5.7 states
the manifest supplies exact record identity *and text*, so a block whose ID or title matches but whose
statement or field bytes differ is a report 7/8 failure. The bytes joining these components are Amendment
3's, not the manifest's, and are excluded from this comparison.

The checker **must not** emit any finding to the effect that a byte, line, heading, transition paragraph,
table header, separator row, declared-total line, or blank line is "unaccounted," "unmanifested," or
"absent from the manifest." Those surfaces are authorized by Amendment 2 and Amendment 3 per §1.1's
table, and reporting them as manifest defects is a false failure and a Step-2 defect.

**Positive verification of Amendment 2's eight surfaces.** So that the combined authority is checked
rather than merely exempted, the checker additionally verifies each of the eight Amendment 2 surfaces
present in target `DECISIONS.md` byte-for-byte against ratified Amendment 2 §2's fenced payloads, using
Amendment 3 §2.1's extraction convention (payload excludes the line terminator immediately preceding the
closing fence). This is reported as its own separate line item, attributed to Amendment 2 — never folded
into the manifest-scoped reports 7 and 8.

**Amendment 3's join bytes are explicitly out of this checker's byte-verification scope, and the checker
says so rather than being silent.** Join and end-of-document bytes were verified exhaustively in Phase 4
and that record is closed: a 272-entry join ledger, an independent byte-for-byte reconstruction of the
whole document from the named sources, and pre- and post-write runs of `checkDecisionsFormat` against the
assembled and on-disk text, all adjudicated at Phase 4's architect closeout. The checker emits one
explicit scope line naming Amendment 3 as the joins' authority and naming that Phase 4 evidence as their
coverage. **Name only evidence that exists** — Phase 5 does not run any §5.8 conformance wiring, which is
not yet commissioned, so the scope line must not imply a gate command contributed evidence here. And do
not silently omit the line: an unstated scope gap in a permanently wired checker is how a later seat comes
to believe coverage exists that does not.

**E053 verified against ratified Amendment 4, not hard-coded arithmetic.** Commission §5.7 names
Amendment 4's E053 correction as an input, so the checker consumes it rather than merely inheriting its
result. Verify, against Amendment 4 §6's ratified corrections: that the frozen phase-1 artifacts classify
E053 as `ARCHIVE` within a 14-row historical archive population; that the corrected disposition makes
E053 structural target-§8 introduction prose; that E053 accordingly has **no** archive wrapper and **no**
archive-index line; and that the historical 14 therefore reconciles to exactly 13 target wrappers plus 13
archive-index lines plus 1 structural E053 row. Encode this as a positive reconciliation with the ratified
correction as its source — not as an incidental consequence of counting to 13. Per commission §5.7, the
checker must fail if the historical 14-entry archive classification is treated as the target count.
Confirm too that the E053 prose in target §8 does not take the archive-index line shape, which Amendment
4 §3.3 item 7 makes load-bearing.

The checker exits non-zero on any failure and prints every failure, not only the first. It reinterprets
no classification semantics and rewrites no frozen artifact.

### Step 3 — wire the package command

Add exactly one key to `package.json`'s `"scripts"` object:

```
"reconcile:decisions-migration-target": "tsx scripts/decisions-migration-target-reconcile.ts",
```

Place it immediately after the existing `"reconcile:decisions-migration"` key. Change nothing else in
`package.json` — no reordering, no reformatting, no dependency change. Confirm with `git diff` that the
file's diff is exactly one added line.

This is the §5.7 command only. **Wiring either reconciliation command into
`.github/workflows/promotion-gate.yml` is commission §5.8 and is not authorized here** (§6).

### Step 4 — run both checkers

1. `npm run reconcile:decisions-migration` — the frozen phase-1 checker, unchanged, must still pass at
   its historical 65/14/1 mapping against the frozen phase-1 artifacts. Record its output verbatim.
2. `npm run reconcile:decisions-migration-target` — must pass with the exact target 65/13/1/1 accounting.
   Record its full output verbatim, every separate report line included.

A failure of either is a stop (§7). Do not adjust a pinned null, weaken an assertion, or narrow a report
to make a checker pass: if the checker is right, the finding is real and belongs to the architect seat;
if the checker is wrong, the fix is to the checker's logic, and if that is not obvious and mechanical,
that too is a stop.

### Step 5 — negative-control evidence, mandatory

A checker that never fails is indistinguishable from a checker that asserts nothing, and Step 4's pass
alone does not tell them apart. Using the Step 2 input-override interface against **ephemeral scratch
copies outside the repository only** — never against any repository file — demonstrate that the checker
actually fails when it should. Run at minimum these five mutations, each independently, each against a
fresh scratch copy, and record the exact failure message and non-zero exit for each:

1. Delete one live entry block from the target copy → the 65-row and bijection reports fail.
2. **Identity-preserving text mutation:** in the target copy, alter a format-valid byte inside one live
   block's statement or field-list value while leaving its heading, ID/title, line structure, and field
   names intact → **reports 7/8 fail**. This is the control that proves reports 7–8 check manifest-owned
   text and not merely identity; a passing run here means the checker is defective, not the fixture.
3. Alter one byte inside one wrapper body in the archive copy → that wrapper's span/hash preservation
   report fails.
4. Alter one byte in the preservation-snapshot copy → the snapshot-equality report fails.
5. **Parser-neutral Amendment 2 mutation:** alter one byte inside one of the §§4–7 **transition prose**
   payloads — not the §3 table header, separator row, or declared-total line, and not a section heading,
   all of which the parser requires as exact literals — preserving line count and line structure → the
   Amendment 2 surface verification fails **and** the manifest-scoped reports 7 and 8 still pass. Pinning
   the mutation to parser-neutral prose is what makes this control prove separate reporting rather than
   merely propagate a parse failure into every report at once.

Confirm afterward, by `git status --porcelain` and by re-measuring, that no repository file was mutated
by this step and that `DECISIONS.md`, both archive files, the manifest, and every amendment retain the
exact identities recorded in Step 1.

### Step 6 — closing measurement

Re-record branch, HEAD, and `git status --porcelain`, and confirm exactly this closing population:

- **Four modified tracked paths:** the three pre-existing accepted outputs (`DECISIONS.md`,
  `lib/decisions-format.ts`, `scripts/tests/decisions-format.ts`) plus this phase's `package.json`.
- **Two new untracked Phase 5 outputs:** `scripts/decisions-migration-target-reconcile.ts` and the §8
  report. Nothing is staged in this phase, so neither is a tracked path.
- **The pre-existing untracked migration working set otherwise unchanged** — no untracked path added
  beyond those two, none removed.

Confirm no path outside §4's allowlist was written, that nothing is staged, and that nothing was
committed.

## 6. What this order does not authorize

- Any edit to `DECISIONS.md`, either archive file, the ratified manifest, ratified Amendment 2, ratified
  Amendment 3, ratified Amendment 4, the frozen phase-1 artifacts, or
  `scripts/decisions-migration-reconcile.ts`, under any circumstance.
- Any change to `package.json` other than the single added script key.
- Any part of commission §5.8 (conformance wiring), including any edit to
  `.github/workflows/promotion-gate.yml` — not commissioned.
- Any part of commission §6 (post-migration reference-graph artifact) — not commissioned.
- Any part of commission §7.1 or §8 (final verification, independent implementation review) — not
  commissioned. In particular, this order does not discharge §7.1 item 11's byte-scoped manifest/output
  exact-equality check.
- Any commit, push, branch operation, or pull-request action.
- Weakening, widening, or re-deriving any pinned null in Step 2 to obtain a passing run.
- Treating a clean Phase 5 result as authorization to begin any later phase.

## 7. Stop conditions

Stop and return to the architect seat, with the receipt documenting the state reached, if any of these
occur:

1. Step 1 finds a divergence from §3 in tracked state or in any measured identity, or a named
   `lib/decisions-format.ts` export cannot be located.
2. A commission §5.7 obligation cannot be satisfied without construction or verification authority that
   the ratified manifest, Amendment 2, Amendment 3, and Amendment 4 together do not supply.
3. Either checker in Step 4 fails, and the cause is not an obvious mechanical defect in the new
   checker's own logic.
4. The target, the archive, the snapshot, or the manifest is found to disagree with the pinned null or
   with a pinned span/hash. **This is a finding about already-accepted work and is never repaired here** —
   it returns to the architect seat immediately.
5. Any Step 5 negative control fails to produce the failure it is specified to produce — including
   control 2 passing, or control 5 failing reports 7/8 alongside the Amendment 2 verification.
6. Any work would require writing a repository path outside §4.

A stop is a successful outcome of this order when its condition is met. Do not "make the obvious choice"
to continue past a stop condition (commission §2.2).

## 8. Deliverable

Exactly one new file:

`audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-TARGET-RECONCILE-REPORT-2026-08-11.md`

Containing, in this order: opening measurement (Step 1) with the §3 comparison, the resolved full
`MIGRATION_BASELINE` SHA, and the located export names; the checker's design record (Step 2) stating each
pinned null, the input-override interface, and, per report, which authority governs the population it
covers, including the explicit Amendment 3 join-byte scope line and the Amendment 4 E053 reconciliation;
the `package.json` diff (Step 3) shown verbatim; both checker runs' full verbatim output (Step 4); the
five negative controls with their exact failure messages and the post-step confirmation that no
repository file was mutated (Step 5); closing measurement (Step 6); and a single overall disposition —
`PASS`, `STOPPED`, or `FAIL` — with the governing reason in one sentence.

**Create this report as the first repository write of the phase**, before either implementation path is
created or modified, and close it only when the closing measurement is filled. Creating the report is
itself a write, so it is ordered first rather than described as preceding all writes.

## 9. Architect adjudication

On return, the architect seat reads the receipt cold and independently re-measures live disk. Independent
verification must include, at minimum: re-running both reconciliation commands rather than trusting the
receipt's transcript of them; independently exercising at least one negative control against the seat's
own scratch copy, chosen by the architect and not necessarily one of Step 5's five, with the
identity-preserving text mutation (control 2) preferred because it is the one that distinguishes a real
text check from an identity-only bijection; confirming the `package.json` diff is exactly one line; and
confirming `DECISIONS.md`, both archive files, the manifest, and every amendment retain their §3
identities. Phase 5 closes only on architect `ACCEPT`. Phase 6 (commission §5.8, conformance wiring) is
not issued until it does.
