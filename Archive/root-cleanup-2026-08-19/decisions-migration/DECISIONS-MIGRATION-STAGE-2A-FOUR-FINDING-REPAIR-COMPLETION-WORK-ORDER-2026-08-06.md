# Stage 2a — four-finding repair completion and adjudication order

**Date:** 2026-08-06 · **Authoring seat:** Architect · **Revision:** 2

**Class: process-defect correction and bounded completion.** This order does three things and no
others: it records, without concealment, that revision 1 of
`DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-WORK-ORDER-2026-08-06.md` was executed without the
pre-edit authorization identity the preceding M4 repair process required of itself; it retains the
current worktree, reverting nothing; and it authorizes exactly one further manifest edit — the bounded
`M4.4` `Owner`-clause correction at §4 — under an identity measured and recorded outside this order's own
bytes.

This order was prompted by two rounds of GPT review conducted while execution was paused between turns.
This seat independently re-derived each round's claims against live disk before accepting any of them;
§2 records what was verified for the round producing this revision.

---

## 0. Revision history

**Revision 1 — 2026-08-06, superseded, never hashed, never executed.** Carried the same defect
disclosure and the same bounded `M4.4` correction as this revision, but required its own opening SHA-256
to be "recorded here" — inside the order's own body. That is unsatisfiable: writing a measured digest
into the file changes the file's bytes, which invalidates the digest just recorded. Revision 1 was never
hashed and no edit was ever authorized or executed under it; it is superseded in full by this revision
and is not itself amended.

**Revision 2 — this revision.** Three corrections, all accepted from a second GPT review, independently
re-verified against live disk before acceptance:

1. **Removes the self-referential identity mechanism.** The opening identity is no longer written into
   this order. §5 states the corrected mechanism: a hashing seat measures this immutable order once,
   externally; the measurement is recorded in the repair report, not here; this order is not edited again
   after that measurement is taken.
2. **Corrects the reversal population.** The live manifest carries four final changed spans versus the
   pre-repair null, not five. `M4.4` is one span reached by two edit operations — the intermediate
   formulation already landed, and the one further correction §4 authorizes — but only its **final** form
   differs from the pre-repair original. §6 is rewritten so Codex reverses four final spans, with `M4.4`'s
   reversal target being the original pre-repair clause, not the intermediate one.
3. **Tightens two process statements.** The worktree description now distinguishes the three already-final
   repairs from `M4.4`'s intermediate state awaiting its one authorized correction, and the consequence of
   reverting is restated as unnecessary mutation and process churn rather than as data loss, since all
   four final changes are independently reversible and verifiable regardless of which path was taken to
   reach them.

No substantive change is made to the `M4.4` replacement text itself; §4's before/after clauses are
byte-identical to revision 1's.

---

## 1. The defect, stated plainly

Revision 1 of the four-finding repair work order was written and then used as live execution authority
for four manifest edits without first obtaining an independent byte-length-and-SHA-256 measurement of
**that order itself**. The established two-hash pattern from the 2026-08-05 `Owner` anaphora repair
requires exactly this: "No repair edit authorized by this order may be made until a seat that can hash
has returned this file's byte length and SHA-256 at revision 3 and those values are transcribed into the
repair report's §1." Revision 1 of the four-finding order carried no equivalent §1.3, and none was
satisfied before the first `edit_file` call against the manifest.

**This is not being retroactively described as a satisfied two-hash proof.** It was not satisfied. The
manifest's own **pre-repair** identity was correctly pinned in revision 1 §1, transcribed from six
independently-authored 2026-08-06 review files that agree on it — that is a real measurement of the
*subject* of the edits. What is missing is an independent measurement of the *instrument authorizing*
the edits, taken before the instrument was used. Those are different guarantees, and only the second was
skipped.

**Why the worktree is retained rather than reverted.** The current worktree carries three accepted final
statement repairs — `M4.3`, `M4.5`, and `M4.35` — plus `M4.4` at its intermediate `Owner` clause, awaiting
the one further correction §4 authorizes. Each already-landed substring is individually verifiable
against the before/after text quoted verbatim in revision 1 §2, confirmed on live disk immediately after
it landed, before either completion order existed. The missing authorization identity is a gap in
*process proof*, not evidence of an *unauthorized or incorrect* edit — nothing in any of the landed
substrings has been shown to be wrong. Reverting correct, individually-verified edits to manufacture a
clean two-hash trail would not recover anything lost; it would create unnecessary mutation and process
churn, since all four final changes are independently reversible and verifiable exactly as they stand.
The defect is recorded and the process is corrected going forward, which is what this order does.

**`M4.4` is being corrected as a separate, substantive change**, not as a symptom of the missing hash. The
correction at §4 exists because the live intermediate clause, while self-contained and consistent with
M6.3 row 5's `ARCHIVE-ONLY` ground, states the Owner test indirectly. A tighter formulation is available
that states the whole-live-statement ownership test directly, per §4. This order treats the two matters
as separate rather than blending a wording improvement into an excuse for the missing identity.

---

## 2. Verification performed before accepting this round of review

- **Byte length of the executed revision-1 order.** `MCP:get_file_info` on
  `DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-WORK-ORDER-2026-08-06.md` returned `16652` bytes,
  matching the figure given in the first review round. This seat cannot produce a SHA-256 of that file;
  none is claimed.
- **The self-referential defect in revision 1's own §4, confirmed by re-reading it.** Revision 1 stated
  that its opening SHA-256 would be "recorded here," inside the order. That instruction is unsatisfiable
  as written, for the reason given at §0. The defect is real and revision 1 is superseded rather than
  patched in place.
- **The five-operation, four-span distinction, confirmed by re-reading this seat's own edit history.**
  Four `edit_file` calls landed against the manifest under revision 1: `M4.3`, an initial `M4.4`
  formulation, `M4.5`, and `M4.35`. No fifth edit has yet been made. The live manifest therefore carries
  exactly four spans differing from the pre-repair null, and will carry exactly four after `M4.4`'s one
  further correction — not five — because that correction replaces `M4.4`'s intermediate span rather than
  opening a new one.
- **The live `M4.4` clause, re-read from disk at the address the correction targets.** Confirmed present,
  byte-for-byte as quoted at §4 below.
- **No re-litigation of the three final statement repairs.** Their live text was not re-opened for this
  verification pass; they are out of scope here per §3.

---

## 3. Scope

### 3.1 Open

- Exactly one further manifest substring: the `M4.4` `Owner` clause, per §4.
- This order's own authorization identity, measured and recorded externally per §5.
- The repair report, which carries that identity and is authorized to be written after the opening
  measurement is returned and acknowledged, per §5.
- Codex verification, per the corrected reversal method at §6 (not issued by this order; recorded here so
  the commissioning seat does not have to re-derive it).

### 3.2 Closed — unchanged by this order

- `M4.3`, `M4.5`, and `M4.35`, each byte-identical to its already-landed final state.
- `M4.38` / `P31#0`, in full.
- All of M6.
- `DECISIONS.md`.
- Revision 1 of the four-finding repair work order, which is **not amended**. It stands, superseded, as
  the contemporaneous execution specification with the defect recorded at §0 and §1, not rewritten to
  appear compliant after the fact.

---

## 4. The `M4.4` correction

**Open substring:** the live `Owner` clause inside `M4.4` item 10, currently:

```text
`Owner` — `OMIT`; the material that would establish a single tracked owner for the
spec-conformance/content-review split — the narrowing history and its forcing incident — survives only
in archived material, and no live tracked path carries it.
```

**Replacement:**

```text
`Owner` — `OMIT`; no single live tracked path owns the whole spec-conformance/content-review split,
whose narrowing history and forcing incident survive only in archived material.
```

**Why this is a correction and not a reformulation for its own sake.** M6.1 defines the `Owner` test as
naming "the one tracked path that owns the whole live statement." The replacement states that test
directly and in the negative — no single live tracked path owns the whole split — before subordinating
the archival fact as the reason. The superseded clause led with what "would establish" ownership, which
describes evidentiary conditions for a claim rather than stating the ownership conclusion itself. Both
versions rest on the same fact pattern and the same M6.3 row 5 `ARCHIVE-ONLY` ground; neither introduces a
different M6 ground, and neither touches any M6 byte. The replacement remains self-contained, contains no
`same reason` anaphor or other cross-field reference, and inserts no M6.1 ground token verbatim.

**Not touched:** the `Evidence` clause immediately before it and the `Execution` clause immediately after
it, both of which remain exactly as landed under revision 1.

**Execution condition.** This edit is not made until this order's own opening identity (§5) is measured,
returned, and acknowledged, and is dry-run then live against a fresh re-read of the exact "open
substring" text immediately before the call.

---

## 5. This order's own authorization identity

**No digest is written into this order.** A measured SHA-256 recorded inside the file it measures is
invalidated by the write that records it; this is the defect revision 1 carried and revision 2 does not
repeat. The mechanism instead runs entirely outside this immutable order's bytes:

1. A hashing seat measures this file — the finished revision-2 order — once, and returns its byte length
   and SHA-256.
2. That identity is recorded **outside** this order, in the repair report's authorization section, which
   is the sole mutable record of it. This order itself carries no identity table and is not reopened to
   add one.
3. This seat (the architect) acknowledges the returned identity before executing §4 — that
   acknowledgment, and the identity it acknowledges, both live in the repair report, not here.
4. §4 executes: the one `M4.4` edit lands.
5. The repair report is completed.
6. Codex independently remeasures this same order — byte length and SHA-256 — after the manifest edit and
   the repair-report write. The opening measurement (step 1) and this closing measurement must match
   exactly; inequality is a BLOCKER, because it means the instrument that authorized the edit is not the
   instrument verified against it afterward.

**This order is immutable from the moment the step-1 measurement is taken**, on the same discipline as
every prior order in this workstream. A defect found after that point is corrected by a further revision
carrying its own fresh identity, never by editing these bytes mid-execution.

---

## 6. Codex verification method — carried forward for the eventual verification commission

Direct whole-file digest comparison against the original pre-repair manifest is not available as a live
artifact to diff against, because the manifest has already been edited in place and will be edited once
more. Codex's verification therefore reconstructs the pre-repair null **in memory** rather than comparing
two files on disk.

**Five edit operations, four final spans.** The execution chronology contains five `edit_file` calls
against the manifest: `M4.3`; an intermediate `M4.4` formulation; `M4.5`; `M4.35`; and the final
correction of that same `M4.4` span. The **final** manifest, compared against the pre-repair null, differs
in exactly **four** places, because the fourth and fifth operations both address `M4.4` and only the
fifth's result survives. The intermediate `M4.4` formulation is recorded in the execution chronology and
in the repair report only; it is not a fifth reversal target and must not be searched for in the final
manifest.

1. Read the final repaired manifest, after `M4.4`'s one further correction has landed.
2. Reverse each of the **four final** replacement substrings to its exact pre-repair form, requiring each
   reverse replacement to match exactly once in the live text. For `M4.4`, reverse the **final** `Owner`
   clause directly to the original pre-repair clause, `` `Owner` — `OMIT`; same reason. `` — not to the
   intermediate formulation, which does not appear in the final manifest and is not a reversal target.
3. Write no temporary file, Git object, ref, or index entry during this reconstruction.
4. Measure the reconstructed byte sequence's length and SHA-256.
5. Require exact equality with the pinned pre-repair identity: `314491` bytes,
   `9d3283086a93daa3e0925ff539f9d98d5914cc9955035f129f3178329804fe5a`.

A match is the proof that every byte outside the four final repair spans is unchanged; it does not require
an intact pre-repair snapshot file, only the reversibility of the four recorded substrings. This is the
same reversal technique the 2026-08-05 `Owner` anaphora verification used against a 313733-byte pre-repair
null.

Codex verification additionally confirms: the final forward diff contains exactly **four final
record-local differences from the pre-repair null** (`M4.3`, `M4.5`, `M4.35`, and `M4.4` at its final
wording); `M4.38` / `P31#0` byte-identical to the pre-repair null; all of M6 byte-identical; zero
`same reason` occurrences remaining in M4; encoding, terminal-cursor, branch, HEAD, and `DECISIONS.md`
checks; and this order's own opening and closing identities equal, per §5 step 6.

---

## 7. Blockers

Execution of §4 stops and returns to the person on any of: this order's opening identity not returned and
acknowledged before the edit; a live re-read of the `M4.4` clause that does not match the "open substring"
quoted at §4; any attempted edit to `M4.3`, `M4.5`, `M4.35`, `M4.38`, or any M6 byte; or an opening/closing
identity mismatch on this order once both are measured per §5.

**Not yet done under this order:** the `M4.4` edit itself, the repair report, Codex verification, the
confirming read, and the resume-note update. All remain contingent on §5 step 1's measurement being
returned and acknowledged.
