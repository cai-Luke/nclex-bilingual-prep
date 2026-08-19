# Stage 2b Phase 2 — preservation snapshot (commission §5.4)

**Date:** 2026-08-08 · **Revision:** 2 · **Seat issuing:** Architect · **Executing seat:** Codex

## 0. Identity, revision history, and immutability

**This order carries no hash slot by design.** Its authorized identity — byte length and SHA-256 — is
measured externally by the owner and recorded in the owner acknowledgment, the Claude resume note, and
the Codex handoff, in the form:

> Stage 2b Phase 2 work order revision 2 is authorized at `<length>` bytes / SHA-256 `<digest>`.

**This file is not edited after that measurement.** A hash written into the document it describes cannot
describe that document's current bytes, because writing it changes them.

**Revision history.** Revision 1 was drafted inline by the architect seat and, before any external measurement, corrected on one non-author-review mechanical defect: its command examples used the symbolic `MIGRATION_BASELINE` token even though the same order forbids passing abbreviated or symbolic baseline tokens as command arguments. The command examples now use the already-pinned full SHA `d499cc1d0916e03830489ec9cd0324cd1a203a73`. The revision number was advanced to 2 because two distinct byte states had been drafted under the label "revision 1," and an ambiguous revision label is not carried into an authorized identity. No byte state of this order has been externally measured, authorized, or executed.

**Immutable during execution.** Once authorized, this file is not edited. Execution notes, partial
results, and status belong in the deliverable at §9, never here. If this order proves defective
mid-execution, stop and return to the architect seat for a superseding instrument; do not repair the
order in place.

---

## 1. Authority

Stage 2a closed on 2026-08-08 by owner exact-byte ratification. Stage 2b Phase 1 closed on architect
`ACCEPT` on 2026-08-08 (`DECISIONS-MIGRATION-STAGE-2B-PHASE-1-CLOSEOUT-2026-08-08.md`), which is the
event commission §5.4 was fenced behind.

This order commissions **Phase 2 only**: commission §5.4, the preservation snapshot. It is the second of
seven bounded phases and authorizes no part of §5.3, §5.5–§5.8, or §6.

Governing documents, in precedence order: `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md`;
`DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md`;
`DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md`; the Phase 1 closeout above; this order.

---

## 2. Seat and producer≠checker

Codex is the implementation producer (commission §5.1). Codex authors no constitutional wording and makes
no migration disposition. This phase writes no constitutional text at all — it copies bytes.

The architect seat authored this order and adjudicates the returned receipt cold against live disk.
**Codex's own post-write self-checks discharge feasibility only, never correctness.** A returned diff is
not proof of persistence: the snapshot is read back from disk after it lands, and the receipt records the
read-back, not the write.

Producer≠checker attaches to the seat that produced, not to a model name.

---

## 3. Prerequisites, architect-measured cold on 2026-08-08

Verified against live disk by the architect seat before drafting. Recorded so the executing seat can
detect drift, **not** so it can skip its own opening measurement.

| item | architect-measured state |
|---|---|
| Branch | `codex/decisions-migration` |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| Staged paths | none |
| Modified tracked paths | exactly two: `lib/decisions-format.ts` (`47075` bytes), `scripts/tests/decisions-format.ts` (`41335` bytes) |
| `DECISIONS.md`, working tree | `76314` bytes / SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` |
| `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` | **absent** — this phase creates it |
| `Archive/DECISIONS-ARCHIVE-2026-07-14.md` | present; exact length measured by the executing seat at Step 1 |
| Repository-root `.gitattributes` | **absent** — no `text`, `eol`, or filter attribute can alter bytes on this path |
| `MIGRATION_BASELINE`, full SHA per manifest M0.1 | `d499cc1d0916e03830489ec9cd0324cd1a203a73` |
| Ratified manifest | `332579` bytes / SHA-256 `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` |

**The two modified tracked paths are expected, not drift.** They are Phase 1's accepted output, left
uncommitted by that order's own §4. Their presence is a precondition of this phase, not a violation of
it. Any *third* modified tracked path is a stop.

**The untracked migration working set grows by design** as authorized orders and receipts land, and
already contains this order. A larger or different untracked population is context, not a finding.

**Provenance of the architect measurements above.** Byte lengths and the `DECISIONS.md` SHA-256 were
obtained by this seat by hashing a byte-exact copy of the live file. The copy pipeline's fidelity is
demonstrated, not assumed: the same pipeline independently reproduced both of Phase 1's closing digests
exactly. Every SHA-256 this order *requires of the executing seat* is nonetheless to be produced by that
seat's own hashing primitive against live disk, never transcribed from this table.

---

## 4. Write allowlist, frozen at issue

Exactly two **repository** paths may be written in this phase:

1. `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` — created by this phase, per §6 (commission §5.2
   item 3).
2. `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-2-PRESERVATION-SNAPSHOT-REPORT-2026-08-08.md` —
   the deliverable at §9 (commission §5.2 item 10).

**No other repository path may be written, created, moved, renamed, or deleted.**

**Phase 1's two modified source files are preserved exactly as they stand.** They are neither committed,
nor reverted, nor re-run, nor touched. This phase does not execute `npm run test:decisions-format`.

**Ephemeral writes outside the repository are permitted and are not branch outputs**, on the same footing
as Phase 1: a temporary file under the OS temp root holding `git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md`
for byte comparison is authorized, and is removed when the comparison completes.

**The ratified manifest is not touched.** Phase 2 neither reads nor writes
`audit/decisions-migration-2026-07-29/target-text-manifest.md`. The snapshot's content is defined
entirely by the baseline Git object, not by the manifest.

This allowlist is frozen now, before any write executes, and is not extended mid-execution. A repository
path that turns out to be necessary is a reason to stop and return to the architect, not a reason to
widen the list.

No commit and no push. This phase leaves its work in the working tree for architect adjudication.

---

## 5. Execution sequence

### Step 1 — opening measurement

Record from live disk: branch; HEAD; `git status --porcelain`; byte length and SHA-256 of `DECISIONS.md`,
`lib/decisions-format.ts`, and `scripts/tests/decisions-format.ts`; byte length and SHA-256 of
`Archive/DECISIONS-ARCHIVE-2026-07-14.md`; and confirmation that
`Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` does not exist. Compare against §3 and report any
divergence before proceeding.

### Step 2 — resolve `MIGRATION_BASELINE` independently

Resolve the abbreviated token `d499cc1` to its full commit SHA from the committed baseline declaration
and print it. **Do not pass an abbreviated token as a command argument** (commission, frozen identities).

Confirm the resolved full SHA equals `d499cc1d0916e03830489ec9cd0324cd1a203a73`. If it does not, stop —
the manifest's M0.1 pin and the repository disagree, which is an architect question.

### Step 3 — measure the baseline object, before writing anything

Compute the byte length and SHA-256 of `git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md` — the **Git object**,
not the working tree.

Required: `76314` bytes / SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`.

This is the load-bearing measurement of the phase. The snapshot's whole purpose is to preserve these
exact bytes, so they are established from the object store *before* any file is created, and are never
inferred from the working tree — even though §3 records that the working tree currently agrees.

Also record, from the same object: that it decodes as strict UTF-8, its final byte, and its CRLF and
bare-CR counts. The manifest pins the final byte as `0x0a`.

### Step 4 — create the snapshot

Per §6.

### Step 5 — verification, all four proofs required

Against the file as it exists on disk after Step 4:

1. **Byte length** equals `76314`.
2. **SHA-256** equals `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`, i.e. equals the
   Step 3 baseline digest.
3. **Exact-byte comparison** against the baseline object: write
   `git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md` to an ephemeral file outside the repository and compare
   byte-for-byte with `cmp`. `cmp` reporting no difference is the controlling proof.
4. **`git diff --no-index`** between that ephemeral file and the snapshot reports no difference.

Proofs 3 and 4 are both required and are not redundant: commission §5.4 names the `git diff --no-index`
form, while `cmp` is the exact-byte proof unaffected by any text normalization `git diff` may apply.
Where they disagree, `cmp` governs and the disagreement is itself a stop condition.

Record all four results verbatim, with the commands as run.

### Step 6 — confirm what did not change

Re-measure `Archive/DECISIONS-ARCHIVE-2026-07-14.md` and confirm it is byte-identical to Step 1
(commission §7.3). Re-measure both Phase 1 source files and confirm they are unchanged. Confirm
`DECISIONS.md` itself is untouched — this phase does not edit it; that is §5.6, and it is not commissioned.

### Step 7 — closing measurement

Re-record branch, HEAD, and `git status --porcelain`. Confirm that no repository path outside §4 was
written, created, moved, renamed, or deleted, and that nothing is staged and nothing was committed.

---

## 6. The snapshot, specified exactly

Create exactly one file:

`Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md`

Its content is the **complete, unaltered byte stream** of:

```
git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md
```

**Write it as a raw byte-stream redirect from that command.** Do not route the content through any editor,
formatter, template, string variable, or Markdown-aware tool that could alter bytes.

**Do not copy from the working tree** (commission §5.4, explicit). The working tree currently agrees with
the baseline object, and that is precisely why the prohibition matters: an implementation that reads the
working tree would produce a byte-identical file today and would silently be wrong the first time it
did not.

**Nothing is added.** No wrapper heading, no front matter, no provenance header, no "preservation
snapshot" banner, no explanatory note, no license line, no trailing blank line. The snapshot is not a
normalized archive wrapper and takes none of that grammar. Its first byte is the baseline's first byte
and its last byte is the baseline's last byte.

**Line endings and the final newline are preserved exactly as they occur in the object.** The manifest
pins the baseline's final byte as `0x0a`; the snapshot ends on exactly one such byte, neither stripped
nor doubled.

**The snapshot is never passed as `archiveText` to `checkDecisionsFormat`** and receives no target §8
archive-index line (commission §5.4, closing sentence). It is not a wrapper, is not counted in the 13,
and takes no register row. This phase runs no conformance command at all; the prohibition is stated here
so it cannot be violated by a later seat reading this order as precedent.

**The snapshot is not current authority.** It is a preservation artifact. Commission §11 forbids treating
it as current authority or as a normalized archive.

---

## 7. Stop conditions

Stop and return to the architect seat, with the receipt documenting the state reached, if any of these
occur:

1. Step 1 finds a divergence from §3 in tracked state — a different branch or HEAD, anything staged, a
   third modified tracked path, or a different byte length or SHA-256 on any pinned file. A change in the
   untracked migration working set is not a divergence and is not a stop.
2. `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` already exists at Step 1.
3. The resolved full `MIGRATION_BASELINE` SHA does not equal the M0.1 pin.
4. The baseline object at Step 3 does not measure `76314` bytes / `b22b3fff…`.
5. Any of the four Step 5 proofs fails, or proofs 3 and 4 disagree with each other.
6. `Archive/DECISIONS-ARCHIVE-2026-07-14.md` or either Phase 1 source file is found changed.
7. Any work would require writing a repository path outside §4.

A stop is a successful outcome of this order when its condition is met. Returning early with an accurate
receipt is correct; proceeding past a stop condition is not. Do not "make the obvious choice" to continue
(commission §2.2).

---

## 8. What this order does not authorize

- Any edit to the ratified manifest, under any circumstance.
- Any edit to `DECISIONS.md`. Target construction is commission §5.6 and is not commissioned.
- Any normalized-archive work. That is commission §5.5 and is not commissioned.
- Any repository output outside the two paths at §4.
- Any parser, fixture, `package.json`, or workflow change.
- Any commit, push, branch operation, or pull-request action.
- Reverting, committing, or re-running Phase 1's output.
- Reopening any Stage 2a work the ratification gate closed, or any closed contemporaneous record.

---

## 9. Deliverable

Exactly one new file:

`audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-2-PRESERVATION-SNAPSHOT-REPORT-2026-08-08.md`

Containing, in this order:

1. Opening measurement (Step 1), with the §3 comparison.
2. The resolved full `MIGRATION_BASELINE` SHA and the command that resolved it (Step 2).
3. The baseline object measurement — length, SHA-256, UTF-8 decode result, final byte, CRLF and bare-CR
   counts (Step 3).
4. The exact command used to create the snapshot (Step 4).
5. All four verification proofs with commands and verbatim output (Step 5).
6. The unchanged-surfaces confirmation (Step 6).
7. Closing measurement (Step 7).
8. A single overall disposition: `PASS`, `STOPPED`, or `FAIL`, with the governing reason in one sentence.

Write the report before the first write executes and close it only when the closing measurement is
filled. Do not backfill a report after the fact from memory of what happened.

---

## 10. Architect adjudication

On return, the architect seat reads the receipt cold and independently re-measures live disk rather than
accepting the receipt's own numbers. Phase 2 closes only on architect `ACCEPT`. Phase 3 (commission §5.5,
the normalized archive) is not issued until it does.
