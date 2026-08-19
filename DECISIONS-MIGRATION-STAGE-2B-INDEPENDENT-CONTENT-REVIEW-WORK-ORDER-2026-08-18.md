# Stage 2b Instrument B — independent constitutional content review (commission §8.2)

**Date:** 2026-08-18 · **Revision:** 1 · **Seat issuing:** Architect · **Executing seat:** Codex
**Status: DRAFT — NOT OWNER-FROZEN, NOT AUTHORIZED, NOT EXECUTABLE.**
**Branch:** `codex/decisions-migration`

## 0. Identity and immutability

No hash slot, by design, as in Instrument A: a hash written into the document it describes cannot describe
that document's current bytes. The authorized identity is measured externally by the owner and recorded in
the owner acknowledgment and the Codex handoff, in the form:

> Stage 2b Instrument B revision 1 is authorized at `<length>` bytes / SHA-256 `<digest>`.

**This file is not edited after that measurement.** If it proves defective mid-execution, stop and return
to the architect seat for a superseding instrument.

## 1. Why this seat, recorded rather than assumed

Commission §8.2 requires that the constitutional content review be "independently re-derived by a seat that
did not author the statements."

- **The Claude architect seat is barred.** It authored the Stage 2a statements.
- **The GPT seat is barred.** `DECISIONS-MIGRATION-STAGE-2A-PART-B-GPT-REVIEW-2026-07-29.md` prescribes
  substantive statement content under "Required repairs" at `P19#0`, `P21#0`, `P23#1`, `P24#0`, and
  `P25#0`, and its own 2026-07-30 banner records that `P23#0`'s four dropped limbs were later found and
  restored in the manifest and that the `P21#0` wording was refined and is carried separately in the
  manifest. GPT is therefore a partial statement producer. Because §8 forbids sampling, partial
  ineligibility is whole-document ineligibility.
- **Codex is eligible.** Commission §5.1 and the frozen Stage 2b Phase 4 order §2 both state that Codex
  authors no constitutional wording: every byte Codex was authorized to write was copied verbatim from a
  named manifest record, from Amendment 2 §2, or from Amendment 3 §2 join bytes, or was produced by a
  verification script that makes no content choice.

## 2. The condition on this review, and why it exists

Codex is the implementation producer of the file under review, so its miss-risk on a transcription defect
is correlated with its produce-risk. The review is nevertheless sound because its proper subject is
**ratified manifest wording against legacy source** — wording Codex did not author — and that reduction
holds only once live-text-to-manifest identity has been independently established.

Accordingly:

- **This review does not run concurrently with Instrument A.** The intended sequence is Instrument A →
  architect `ACCEPT` → Instrument B. Two independent reasons: Instrument A §3 records the exact class (b)
  governance population at entry and its §10 requires that population path-for-path unchanged, while this
  order's §7 report is itself a class (b) path — a concurrent B would falsify A's own residue invariant
  mid-execution; and the condition below is cleaner as an entry gate than as a later ripening.
- **Entry condition: Instrument A's §7.1 item 11 (manifest/output exact equality) has returned PASS**, and
  that PASS is stated in this order's handoff. This order does not begin otherwise. If item 11 is later
  found not to have held, this disposition is **void, not amendable**, and the review re-executes against
  repaired bytes.
- The architect seat separately performs and records the §8.1 manifest-conformance review. This order does
  not cover §8.1 and Codex does not perform it.

## 3. Subject and sources

- **Target under review:** `DECISIONS.md` as committed at Commit 3 (`345d0d9`), read from the committed
  object rather than from the working tree.
- **Legacy source:** `DECISIONS.md` at `MIGRATION_BASELINE`. **Resolve and print the full baseline SHA from
  the committed baseline declaration and the hardened pre-migration artifact before use; never substitute
  the current branch head.** The abbreviated token `d499cc1` is orientation only, never a command argument.
- **Source-span addressing:** the ratified target manifest, `332579` bytes / SHA-256
  `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2`. The manifest addresses **where** each
  source span is. It is **not** the authority on what the source means; meaning is derived from the legacy
  source text itself.
- **Frozen phase-1 artifacts:** `audit/decisions-cleanup-2026-07-24/inventory.md` and `migration-table.md`,
  subject only to the ratified Amendment 4 E053 correction. These are read, never edited.

**Prior review artifacts are inputs, not clearance.** The Part B and Part C GPT reviews, the Stage 2a full
and fresh constitutional review artifacts, and every phase closeout are read as leads only, and their
dispositions are **not inherited**. The Part B review's own banner states that it "is superseded as a
clearance statement and must not be cited as one," and that a later seat "must re-derive them against the
live source rather than inheriting this document's dispositions." Re-derive every finding.

## 4. The review question

For each unit: **does the migrated statement accurately preserve the source rule and its force, without
omission and without new meaning?**

Three distinct failure modes, reported distinctly:

1. **Omission** — a limb, condition, exception, revisit condition, or named consequence present in the
   source and absent from the target.
2. **Added meaning** — force, scope, or a condition present in the target and not derivable from the
   source.
3. **Altered force** — the same content at a different modal strength: binding rendered as advisory, a
   floor rendered as a target, `PENDING` rendered as executed, or the converse.

## 5. Coverage — no sampling

Every unit receives full review and appears in the coverage ledger with an individual finding, including
the units with no finding.

| population | count |
|---|---:|
| live statements | 65 |
| archive wrapper boundaries | 13 |
| E053 structural §8 prose | 1 |
| E037 three-target merge | 3 target records |

**E037** carries no independent target block and no archive wrapper. Verify that rule 1 lands in E039a /
`P8`; that rule 2 lands in **both** E002 / `P2` and E006 / `P5`; that the literal text contribution appears
in all three target records; and that no permanent identifier was minted for E037.

**E053** must be structural prose opening target §8, naming `Archive/DECISIONS-ARCHIVE-2026-07-14.md`, the
normalized migration archive, and `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md`. It must not take
archive-index-line syntax and must not be counted as a wrapper or a live entry.

**Wrapper boundaries** are reviewed for whether the wrapper's span preserves the displaced source content
in full and whether its label states the source truthfully — not for body byte content, which is pinned
elsewhere and is not this review's subject.

Any unit that cannot be reviewed for any reason is a stop, not an omission from the ledger.

## 6. Disposition

One of the three defined at commission §8:

- **`ACCEPT`** — implementation is safe to merge.
- **`REPAIR`** — bounded mechanical mismatch against already-ratified text; **no new wording**.
- **`REFUSE`** — manifest defect, unratified semantic change, preservation failure, or unbounded
  implementation defect.

**Codex proposes no replacement wording under any disposition.** A `REPAIR` finding states the mismatch,
the ratified text it departs from, and the exact location. Whether and how to repair is an architect
adjudication and an owner act. Commission §11 forbids Codex improving or shortening ratified statement
wording.

A single unrepaired finding of any severity precludes `ACCEPT` for the whole review. There is no partial
acceptance and no sampled acceptance.

## 7. Retained output — exactly one path

Write the disposition report to:

`audit/decisions-migration-2026-07-29/INDEPENDENT-CONTENT-REVIEW-2026-08-18.md`

**Precondition, verified before any review output is written:** that path **does not exist**. This order
authorizes its creation, never its overwrite. An existing path is evidence from a prior attempt: it is a
stop, returned to the owner intact, and is not replaced, renamed, or moved.

This is the only repository path this order creates. It is retained rather than returned only in chat
because commission §10 requires the receipt to report the independent-review disposition and requires that
no migration evidence live only in an end-of-chat report, and because an 82-unit coverage ledger cannot
survive as a chat return. It is enumerated in Instrument C's supplementary census.

The report contains: the resolved full baseline SHA; the manifest identity as measured; the full coverage
ledger with a per-unit finding; every finding classified by §4 failure mode; the disposition; and an
explicit statement of the Instrument A §7.1 item 11 PASS on which this order's entry was conditioned.

## 8. Stop conditions

Identity mismatch at §0; inability to resolve the full `MIGRATION_BASELINE` SHA from the committed
declaration; a manifest identity that does not match §3; any unit that cannot be reviewed; any need to
author wording in order to state a finding; any apparent conflict between the manifest and the legacy
source that cannot be stated as a finding without resolving it.

**A stop is a successful control outcome.** Report the measured state and do not improvise past it.

## 9. Not authorized

- Any edit to `DECISIONS.md`, either `Archive/` file, the ratified manifest, the frozen phase-1 artifacts,
  or any script or workflow.
- Any commit, stage, push, PR, merge, or any part of Commit 4.
- Authoring, proposing, improving, or shortening any constitutional wording.
- Inheriting any prior seat's disposition as clearance.
- Sampling, or resolving any unit by inference from a neighbouring unit.
- Performing the §8.1 manifest-conformance review.
- Creating any repository path other than the single §7 report.
- Treating `ACCEPT` as acceptance of repository conformance. Under Amendment 5 Clause C, §8's `ACCEPT` is
  prerequisite, not acceptance, and does not close the Amendment 1 Clause B rebinding window.
