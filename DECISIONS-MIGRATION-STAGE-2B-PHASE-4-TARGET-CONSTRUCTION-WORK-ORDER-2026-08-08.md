# Stage 2b Phase 4 — target `DECISIONS.md` construction (commission §5.6, as amended)

**Date:** 2026-08-08 · **Revision:** 5 · **Seat issuing:** Architect · **Executing seat:** Codex

## 0. Identity, revision history, and immutability

**This order carries no hash slot by design**, for the reason every prior phase order in this migration
has carried none: a hash written into the document it describes cannot describe that document's current
bytes, because writing it changes them. Its authorized identity is measured externally by the owner and
recorded in the owner acknowledgment, the resume note, and the Codex handoff, in the form:

> Stage 2b Phase 4 work order revision 5 is authorized at `<length>` bytes / SHA-256 `<digest>`.

**This file is not edited after that measurement.** If non-author review finds a defect before external
measurement, the correction is made in place on this unauthorized draft and the revision number is
advanced only if two distinct byte states have carried the same label. Once authorized, this file is not
edited; if it proves defective mid-execution, stop and return to the architect seat for a superseding
instrument.

**Revision history.** Revision 1 was never externally measured or authorized. GPT's cold review found that
manifest M4 items 7–9 pin each body block's heading, statement, and field list separately but pin no byte
joining them, and that direct concatenation is parse-invalid (`statementAndFieldStart` silently absorbs an
unseparated field list into the statement; `parseEntryIndex` requires *exactly* one blank line, not zero or
two, between the 65th entry-index row and the declared-total line) — a third construction-authority gap
under this order's own §1 stop rule. This seat independently confirmed both cases by reading the parser
directly, found the two cases have different tolerances, and audited every remaining join rather than
patching only the two parser-fatal ones. Commission Amendment 3 (drafted 2026-08-08, pending review and
ratification) pins the complete join convention. Revision 2 consumes it as a third authority, replaces the
Steps 3–4 manually-reimplemented structural checks with a direct call to the live `checkDecisionsFormat`
conformance function (which already performs index/body equality and order, declared-total
cross-checking, allocation continuity, retired-ID conflict, and archive-index/wrapper bijection —
reimplementing these by hand risked exactly the kind of divergence-from-the-real-parser this seat's own
Step 3/4 language was trying to guard against), and repairs a self-contradictory sentence at §8 ("write the
report before the first write" — creating the report is itself a write). This order remains unauthorized:
it may not be hash-frozen until Amendment 3 is independently reviewed and owner-ratified.

**Revision 3.** GPT's independent review of Amendment 3 revision 1 found it repeated Amendment 2's own
first-revision mistake (amending §5.6 only, leaving §2.2 and manifest M1/Amendment-2-§4.2's "without
exception" language still blocking join bytes), a byte-definition gap (fragment-extraction convention never
stated), and two coverage gaps (the declared-total→§4 join omitted; the M5.6→M5.7 join misnamed as ending
at M5.7's header row when M5.7's fenced fragment opens with two sentences of prose before that header,
confirmed by this seat reading the live manifest directly). Amendment 3 revision 2 repairs all four; that
repair is authority-side and is described in Amendment 3 §0, not here. GPT's review of Phase 4 itself found
two further defects, repaired in this revision: Step 4 said "a sample covering every join class," which
does not catch an unauthorized extra byte at an unsampled *instance* of a class — `checkDecisionsFormat`'s
own parser tolerance (e.g. any blank-line count ≥ 1 between a statement and its fields) means such a byte
could reach `DECISIONS.md` undetected; and Step 1 recorded only the document-level parser's signature, not
`checkDecisionsFormat`'s, though Step 3 depends on the latter. Both repaired below.

**Revision 4.** GPT's second review of Amendment 3 (now revision 2) found two byte-population repairs,
both independently confirmed by this seat against the live manifest before accepting them: manifest M5.6
is one single fenced fragment covering all 13 archive-index records — its own prose states they are
"reproduced here once in assembly order so that Stage 2b writes a contiguous block rather than gathering
thirteen fragments" (`target-text-manifest.md:5227–5266`) — so no inter-record adjacency inside it was
ever Amendment 3's to pin; and the end-of-document byte needed its own explicit population membership,
since Amendment 3 revision 2's authority language covered only inter-fragment boundaries. Amendment 3
revision 3 repairs both authority-side. This revision's consequential repair: Step 2 and Step 4 below now
treat M5.6 as one complete fragment (matching how M5.7 was already treated), and Step 4's ledger no longer
lists "12 inter-record archive-index joins" as a Step-4 concern — that population verifies as part of
M5.6's own byte-provenance check instead.

**Revision 5.** GPT's third review of Amendment 3 found its history claimed the Amendment-2
header→separator adjacency had been removed from exception 1 when it had not — the operative text still
claimed that join, contradicting Amendment 3 §2.4's own correct disjointness claim — and that Step 4's
count below was wrong (65 entry-index rows have 64 row-to-row joins, not 65; the separator→row-1 join is
a distinct, additional member of the same zero-blank-line group). Amendment 3 revision 4 repairs the
authority-side text; this revision repairs Step 2's and Step 4's corresponding language below to match —
neither Amendment 3 nor Amendment 2's own header+separator fragment supplies spacing across a boundary
that was never a real gap.

## 1. Authority

Three co-equal authorities govern this phase:

1. **The ratified Stage 2a manifest** (`332579` bytes / SHA-256
   `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2`) — sole authority for every target
   byte except the surfaces named below.
2. **Ratified Commission Amendment 2** (ratified 2026-08-08, Revision 3, `24202` bytes / SHA-256
   `4cb16995cf8810bcf3ee65ffb07dc32a14a4fb5b0c4adc8ba5bbb2a2a535e9f4`, recorded at
   `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-RATIFICATION-2026-08-08.md`) — additional construction
   authority for exactly eight surfaces: the target §3 introduction; the target §3 table header and
   separator rows; the declared-total line; and the four §§4–7 section headings and transition paragraphs.
3. **Commission Amendment 3** (Revision 4, drafted 2026-08-08; **not yet ratified — this order cannot be
   hash-frozen until it is**) — the join bytes connecting fragments the manifest and Amendment 2 separately
   pin, plus the end-of-document byte: the default two-`\n`-byte (one blank line) rule and its three named
   exceptions, per Amendment 3 §2.

**There is no overlap between the three authorities to resolve.** Each pins a disjoint set of bytes. If
this order or its execution ever appears to find a fourth gap, a conflict between authorities, or a byte
none of the three names, **stop** — do not infer which authority governs, and do not construct from any
fourth source.

Stage 2b Phases 1–3 are closed (`DECISIONS-MIGRATION-STAGE-2B-PHASE-1-CLOSEOUT-2026-08-08.md`,
`-PHASE-2-CLOSEOUT-`, `-PHASE-3-CLOSEOUT-`, all 2026-08-08). This order commissions **Phase 4 only**:
commission §5.6, as amended. It authorizes no part of §5.7 or §5.8.

Governing documents, in precedence order: `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md`;
`DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md`;
`DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-STRUCTURAL-SURFACES-2026-08-08.md`;
`DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-ASSEMBLY-JOINS-2026-08-08.md`;
`DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md`; the three Phase closeouts; this order.

## 2. Seat and producer≠checker

Codex is the implementation producer. Codex authors no constitutional wording — every byte this order
authorizes Codex to write is either copied verbatim from a named manifest record, copied verbatim from
Amendment 2 §2, copied verbatim from Amendment 3 §2 (join bytes only, never fragment content), or produced
by a verification script that makes no content choice. Codex makes no migration disposition and resolves
no ambiguity by inference; an ambiguity is a stop condition (§7).

The architect seat authored this order and adjudicates the returned receipt cold against live disk.
**Codex's own post-write self-checks discharge feasibility only, never correctness.** `DECISIONS.md` is
read back from disk after it is written; the receipt records the read-back, not the write.

## 3. Prerequisites, architect-measured cold on 2026-08-08

| item | architect-measured state |
|---|---|
| Branch | `codex/decisions-migration` |
| HEAD | `05f9bcd` (full: `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`) |
| Staged paths | none |
| Modified tracked paths | exactly two: `lib/decisions-format.ts`, `scripts/tests/decisions-format.ts` (Phase 1's accepted output, unchanged since) |
| `DECISIONS.md`, working tree | `76314` bytes / SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` — **this is the file this order replaces** |
| `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` | `76314` bytes / SHA-256 `b22b3fff…` (Phase 2 output, unchanged) |
| `Archive/DECISIONS-ARCHIVE-2026-08-18.md` | `13997` bytes / SHA-256 `e75e979ea121fa1a697861f8de4a4527f07ef2d8b7ed1f4d299bf504163e873c` (Phase 3 output, unchanged) — the 13 archive wrappers Phase 4's §8 construction must resolve against |
| Ratified manifest | `332579` bytes / SHA-256 `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` |
| Ratified Amendment 2 | Revision 3, `24202` bytes / SHA-256 `4cb16995cf8810bcf3ee65ffb07dc32a14a4fb5b0c4adc8ba5bbb2a2a535e9f4` |
| Amendment 3 | Revision 4, drafted 2026-08-08, `26963` bytes (architect byte-count measurement; SHA-256 not yet available — see §0). **Not yet ratified — blocks this order's own hash-freeze.** |

**The untracked migration working set is large and grows by design** — every prior phase's orders,
receipts, and closeouts, plus Amendment 1, Amendment 2, and its ratification record, all sit untracked.
This is expected and is not drift. Any *third* modified tracked path, or any change to a path listed
above, is a stop.

## 4. Write allowlist, frozen at issue

Exactly two paths may be written in this phase:

1. `DECISIONS.md` — replaced wholesale, per commission §5.6 ("not by editing legacy prose in place").
2. `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-4-TARGET-CONSTRUCTION-REPORT-2026-08-08.md` — the
   deliverable at §8.

**No other repository path may be written, created, moved, renamed, or deleted.** The manifest, Amendment
2, Amendment 3, both archive files, and the two Phase 1 source files are read-only inputs and are not
touched.

Ephemeral writes outside the repository (a scratch directory holding the assembled candidate before
replacement, and any verification script) are permitted and are not branch outputs; remove them when the
phase completes.

No commit and no push. This phase leaves its work in the working tree for architect adjudication.

## 5. Execution sequence

### Step 1 — opening measurement and parser reconnaissance

Record branch, HEAD, `git status --porcelain`, and the byte length/SHA-256 of every path in §3's table;
confirm against §3 and report any divergence before proceeding.

Locate the exported live-document parsing function in `lib/decisions-format.ts` (the counterpart to
`parseArchiveDocument`, used against `DECISIONS.md`'s own grammar rather than the archive's) **and** the
exported `checkDecisionsFormat` conformance function Step 3 depends on; record both exact names and
signatures. Do not assume either name from any prior document's prose — confirm both by reading the file.

### Step 2 — assemble the candidate, section by section, in an ephemeral file

Build the complete candidate target text in an ephemeral scratch file, in this exact order, with no byte
between sections beyond what each named source specifies:

1. **Target §1.** Manifest M2's fenced block, verbatim.
2. **Target §2.** Manifest M3's fenced block, verbatim.
3. **Target §3.** Amendment 2 §2.1 (introduction), then Amendment 2 §2.2's header and separator rows,
   then all 65 entry-index rows — sourced **exclusively** from each manifest M4 record's item 11 ("Exact
   entry-index row"), walked in the canonical order manifest M4.0 pins (P cores ascending with P8 between
   P7 and P10; R1–R6 ascending; the 19 I entries in ratified outline order; T entries in M4.0's stated
   order) — then Amendment 2 §2.2's declared-total line.
4. **Target §4.** Amendment 2 §2.3's `## 4. Governing principles` heading and transition, then every `P`
   record's body — each core's exact heading/statement/field-list bytes (manifest M4 items 7–9), followed
   immediately by any attachments under that core in document order — walked in M4.0's pinned P order.
5. **Target §5.** Amendment 2 §2.3's `## 5. Concrete rulings` heading and transition, then every `R`
   record's body in M4.0's pinned R1–R6 order, on the same pattern as §4.
6. **Target §6.** Amendment 2 §2.3's `## 6. Standing invariants` heading and transition, then every `I`
   record's body in M4.0's pinned outline order. `I` records carry no attachments (format spec §2.2).
7. **Target §7.** Amendment 2 §2.3's `## 7. Open threads` heading and transition, then every `T` record's
   body in M4.0's pinned order. `T` records carry no attachments.
8. **Target §8.** Manifest M5.4's structural introduction (carrying E053 and naming all three
   preservation files), verbatim; then manifest M5.6's single fenced fragment (all 13 archive-index lines,
   already assembled in manifest order as one block — not gathered from 13 separate records), verbatim;
   then manifest M5.7's six-row retired-identifier register (also one single fenced fragment), verbatim.

**Every join between fragments follows Amendment 3 §2 exactly, in exact `\n` byte counts — not
resemblance, not "the obviously correct" spacing.** Per Amendment 3 §2.1's extraction convention, no
fragment's own pinned payload includes a trailing line terminator, so: apply **exactly two** `\n` bytes
(one blank line) at every join Amendment 3's default rule covers and does not except — including the join
between the declared-total line and the §4 heading/transition, the join between §7's last body block and
§8's structural introduction, the join between manifest M5.4's introduction and manifest M5.6's fragment,
and the join between manifest M5.6's fragment and manifest M5.7's fragment; apply **exactly one** `\n`
byte (zero blank lines) between Amendment 2's entry-index separator row and the first M4 item-11 row, and
between each of the 65 entry-index rows and the next — Amendment 2's own header+separator fragment is
preserved whole and is not touched here (Amendment 3 §2.2 exception 1);
apply **exactly two** `\n` bytes — not one, not three — between the 65th entry-index row and the
declared-total line (exception 2); apply **exactly two** `\n` bytes within each body block, between its
heading and statement and between its statement and field list (exception 3). Manifest M5.6 is written as
one uninterrupted copy of its own fenced content — every label-to-pointer and pointer-to-next-label byte
inside it is M5.6's own pinned content, not a Step-2 join, and is not touched or re-derived here. The join
from manifest M5.6's fragment into manifest M5.7 goes to M5.7's own first byte — its two-sentence
introduction, not its table header; everything inside M5.7 thereafter (introduction, header, separator,
six rows) is likewise M5.7's own internal content, not a Step-2 join. After M5.7's own last byte, append
**exactly one** `\n` byte and nothing further (Amendment 3 §2.3, end-of-document). No fragment's own
source specifies the bytes between it and its neighbor — that is what Amendment 3 is for.

### Step 3 — structural and cross-document verification via `checkDecisionsFormat`

Do not hand-reimplement conformance logic and do not call the lower-level parse functions individually for
this step. Call the live `checkDecisionsFormat` export directly — located at Step 1 alongside the
document-level parser — with:

```
checkDecisionsFormat({
  decisionsText: <the assembled candidate>,
  archiveText: <the live Archive/DECISIONS-ARCHIVE-2026-08-18.md text, read fresh, not reused from Phase 3>,
  archiveSource: "Archive/DECISIONS-ARCHIVE-2026-08-18.md",
})
```

Omit `trackedPaths` entirely — the resulting `UNTRACKED_PATH` check (assertion 15) does not run when it is
omitted, and Amendment 1 already establishes that the normalized-archive path is intentionally untracked
at this phase. This is a deliberate scope narrowing, not an oversight; do not construct a `trackedPaths` set
to satisfy it.

Required: `result.ok === true` and `result.issues.length === 0`. If not, the returned `issues` array
identifies the failing assertion(s) by `code` and `assertion` number — record them verbatim in the report;
do not attempt a second construction pass to work around a failing assertion, since that would mean
authoring an unauthorized byte to satisfy the checker. A failing assertion here is a stop (§7).

This single call covers what Steps 3–4 of revision 1 attempted to reimplement by hand: entry-index/body
key equality and order, index/body metadata agreement, declared-total presence and cross-check,
P/R allocation-union continuity against manifest M5.7's register, retired-ID conflict, and the full
archive-index/wrapper bijection (both directions, plus pointer file and anchor agreement) against the live
Phase 3 archive read fresh in this step — not a cached result from any earlier phase.

### Step 4 — exhaustive join and byte-provenance verification against a complete ledger

**Sampling is not sufficient and is not authorized for this step.** `checkDecisionsFormat`'s own parser
tolerance (for example, any blank-line count ≥ 1 between a statement and its fields still parses cleanly)
means an unauthorized extra byte at an unsampled join could pass Step 3 undetected and still reach
`DECISIONS.md`. Build a complete ledger, mechanically, of every fragment boundary in the Step 2 assembly —
the Amendment-2-separator-row→first-row join plus each of the 64 row-to-row joins among the 65
entry-index rows (65 joins total in that group), both joins inside each of the 65 body blocks, every
body-block-to-next-block join, every section-to-section join, the M5.4→M5.6 join, the M5.6→M5.7 join, and
the end-of-document byte — and check every entry in that ledger, not a subset, against the exact `\n` byte
count Amendment 3 §2.2 assigns it. Do not include anything internal to manifest M5.6 or M5.7 in this
ledger — both are single fenced fragments verified whole at the byte-provenance step below, not join by
join. A reconstruction assertion (re-deriving the candidate byte-for-byte from the named sources plus
Amendment 3's rules, independently of how Step 2 built it, and comparing the two) satisfies this without
hand-checking each entry individually; a manual walk of every ledger entry is also acceptable. A sampled
subset is not.

Separately, and just as exhaustively: confirm each of the eight sections' fragment bytes are an exact,
uninterrupted copy of the named source — not a close paraphrase, not a resemblance:

- §1 against manifest M2; §2 against manifest M3, byte-for-byte.
- §3's introduction, header/separator, and declared-total line against Amendment 2 §2.1/§2.2,
  byte-for-byte; each of the 65 index rows against its own M4 record's item 11.
- §§4–7's four headings/transitions against Amendment 2 §2.3, byte-for-byte; each of the 65 body blocks
  against its own M4 record's items 7–9 (heading, statement, field list), byte-for-byte.
- §8's introduction against manifest M5.4, byte-for-byte; the entire archive-index block against manifest
  M5.6 as one complete fragment (all 13 label/pointer pairs, in order, in a single comparison — not
  record by record); the register against manifest M5.7 as one complete fragment — all byte-for-byte.

A single differing byte anywhere in this step — fragment, join, or the end-of-document byte — is a stop,
not a candidate for the closest correct value.

### Step 5 — replace, then read back and prove equality

Only after Steps 3–4 both pass: write the verified candidate to `DECISIONS.md`, replacing it wholesale.

Then, as a proof independent of the write itself:

1. Read `DECISIONS.md` back from disk.
2. Compare it byte-for-byte (`cmp`, not a text diff) against the ephemeral candidate file from Step 2.
3. Re-run `checkDecisionsFormat` (same call shape as Step 3) against the file now on disk and confirm the
   same `ok: true` / zero-issues result Step 3 already established — not merely the lower-level parser,
   since Step 3's authoritative result came from `checkDecisionsFormat`.

The write is not proof of its own correctness; the read-back is.

### Step 6 — closing measurement

Re-record branch, HEAD, and `git status --porcelain`. Confirm `DECISIONS.md` is the only tracked path that
changed, that no path outside §4's allowlist was written, and that nothing is staged and nothing was
committed.

## 6. What this order does not authorize

- Any edit to the ratified manifest, ratified Amendment 2, or Amendment 3, under any circumstance.
- Any edit to either archive file, or to the two Phase 1 source files.
- Any part of commission §5.7 (reconciliation checkers) or §5.8 (conformance wiring) — not commissioned.
- Running `npm run reconcile:decisions-migration`, any target-reconcile script, or any package/workflow
  change. Those are later phases' concerns.
- Any commit, push, branch operation, or pull-request action.
- Constructing, inferring, or guessing any byte — fragment or join — not traceable to a named source in
  Step 2. Where a needed byte cannot be found in the manifest, Amendment 2, or Amendment 3, that is a stop,
  not an invitation to write the "obviously correct" value (commission §2.2) — this is the exact failure
  mode that produced Amendment 3 in the first place.

## 7. Stop conditions

Stop and return to the architect seat, with the receipt documenting the state reached, if any of these
occur:

1. Step 1 finds a divergence from §3 in tracked state, or `checkDecisionsFormat` (or the document-level
   parser it wraps) cannot be located.
2. Any named source (a specific M2/M3/M4/M5.4/M5.6/M5.7 record, an Amendment 2 §2 surface, or an
   Amendment 3 §2 join rule) is missing, ambiguous, or internally inconsistent in a way this order does
   not already resolve.
3. The Step 3 `checkDecisionsFormat` call does not return `ok: true` with zero issues.
4. Any Step 4 byte-provenance check — fragment or join — finds even one differing byte.
5. The Step 5 read-back does not match the Step 2 candidate byte-for-byte, or the post-write
   `checkDecisionsFormat` run does not reproduce the pre-write result.
6. Any work would require writing a repository path outside §4, or editing the manifest, Amendment 2,
   Amendment 3, or either archive file.

A stop is a successful outcome of this order when its condition is met. Do not "make the obvious choice"
to continue past a stop condition (commission §2.2).

## 8. Deliverable

Exactly one new file:

`audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-4-TARGET-CONSTRUCTION-REPORT-2026-08-08.md`

Containing, in this order: opening measurement (Step 1) with the §3 comparison and the located function
names; the assembled candidate's construction record (Step 2) naming, per section and per join, the exact
source(s) consumed; the Step 3 `checkDecisionsFormat` call and its full result (`ok`, `issues`) verbatim;
the Step 4 byte-provenance results, section by section and join by join; the Step 5 write, exact `cmp`
result, and post-write `checkDecisionsFormat` re-run result; closing measurement (Step 6); and a single
overall disposition — `PASS`, `STOPPED`, or `FAIL` — with the governing reason in one sentence.

Create the report before the first write to `DECISIONS.md` executes, and close it only when the closing
measurement is filled.

## 9. Architect adjudication

On return, the architect seat reads the receipt cold and independently re-measures live disk — including
re-running `checkDecisionsFormat` against the file now on `DECISIONS.md`, not trusting the receipt's own
run of it. Phase 4 closes only on architect `ACCEPT`. Phase 5 (commission §5.7, reconciliation checkers) is
not issued until it does.
