# Migration Commission Amendment 1 — E038 evidence sequencing, and date rebinding

> **RATIFIED 2026-07-30 by Luke (owner).** Both clauses are in force. Clause A §1.2 approved as written;
> Clause B §2.2 approved subject to the rebinding-deadline synchronization repair, which is applied, and the
> two architect additions inside that repair are separately confirmed. This amendment ratifies no Stage 2a
> entry wording, which still requires separate ratification of the exact manifest bytes under commission
> §12.

**Date:** 2026-07-29, revised 2026-07-30 · **Seat:** Architect
**Amends:** `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md` (RATIFIED 2026-07-29)

- **Clause A amends** §2.2 (hard stops), §4.6 item 2 (Stage 2a path existence), §4.9 (independent
  reviewer's tracked-path obligation).
- **Clause B amends** §4.3 and §4.8 (manifest content), §9 (authorized commit structure), §10 (receipt
  contents).
- **Clause B clarifies, and does not amend,** §5.2 item 4. That item already forbids Codex from modifying
  ratified manifest bytes and is silent on the architect seat; Clause B states the production boundary
  expressly rather than changing the rule. A rebinding commit touches only §5.2 path 4, which is already
  authorized, so §5.2's "any other path requires an amended commission" is not engaged.

**Purpose:** resolve two structural defects in the ratified commission that block Stage 2a manifest
ratification and cannot be resolved by any seat.

Neither clause changes the target grammar, the taxonomy, Amendment 4, the classification of any entry, the
identity or wording of any statement, `MIGRATION_BASELINE`, or any pinned span or hash.

---

## 1. Clause A — the E038 `Evidence` sequencing exception

### 1.1 Forcing incident

Two ratified contracts collide, structurally rather than accidentally.

The phase-1 closure ruling (`DECISIONS-CLEANUP-PHASE-1-CLOSURE-CODEX-WORK-ORDER-2026-07-28.md` §3 item 5)
requires the displaced dated producer-assignment prose to be preserved verbatim in the phase-2 archive and
pointed at from the **migrated** E038 entry's `Evidence` field. Amendment 4 permits no archive wrapper for
that prose, because E038 remains live under the same title, so the pointer target is necessarily a Stage 2b
output.

Three ratified checks independently forbid that. Commission §4.6 item 2 requires every `Evidence` path to be
verified to exist at the **Stage 2a review commit**. §2.2 makes an untracked `Evidence` path a hard stop on
beginning Stage 2b. §4.9 separately obliges the independent Stage 2a reviewer to verify each present path is
tracked, before owner ratification.

Stage 2b cannot begin until the manifest is ratified. The path cannot exist until Stage 2b begins. Under the
commission as ratified, the manifest can satisfy the phase-1 ruling or the Stage 2a checkpoints, never both.

A first draft of this clause named only §§2.2 and 4.6. That was insufficient: §4.9 would have blocked E038
at independent review regardless, and the clause would have appeared to resolve the collision while leaving
it live one gate later.

### 1.2 Operative text

> For E038 only, Stage 2a may pin `Evidence` to the exact normalized migration archive path even though
> that Stage 2b output does not yet exist at the Stage 2a review commit. This exception waives only the
> Stage 2a existence-and-trackedness checkpoint for that single manifest-pinned path, in each of the three
> places the commission imposes it: the §2.2 hard stop, the §4.6 item 2 existence check, and the §4.9
> independent-reviewer obligation. In place of trackedness, the §4.9 reviewer must verify that the pinned
> value equals the manifest's pinned normalized-archive filename byte-for-byte.
>
> The exception does not waive final conformance assertion 15, exact equality with the manifest, or the
> hard stop on any other untracked `Evidence` or `Owner` path. The normalized archive must be created and
> tracked in the same atomic migration pull request before repository conformance is accepted. Any change
> to its manifest-pinned filename or date returns to Stage 2a for owner ratification. The exception is
> exhausted by this single use.

### 1.3 What Clause A does not do

- It does not weaken assertion 15. The path must exist and be tracked before the Stage 2b conformance run,
  and conformance still fails closed if it does not.
- It does not admit a second future-output path. Every other `Evidence` and `Owner` path in the manifest
  remains subject to the unmodified §4.6, §2.2, and §4.9 checks.
- It does not leave the reviewer with nothing to check. Trackedness is replaced by an exact-equality check
  against the manifest's own pinned filename, which is the property that actually matters for this path.
- It does not authorize an empty placeholder archive file, or `git add --intent-to-add` on a path with no
  content, at Stage 2a. Both fabricate the fact the check exists to establish and both remain forbidden.
- It does not survive this migration. The exception is spent on one path in one commission.

### 1.4 Rejected alternative, recorded

Deferring the pointer — migrating E038 with `Evidence: OMIT` and adding the field in a later commission —
was the architect seat's earlier recommendation and is rejected. It was argued to soften nothing; it softens
the phase-1 ruling's required final state, shipping a knowingly non-conforming target and moving the repair
across a merge boundary. Clause A deviates on sequencing while preserving the required outcome and the final
gate; deferral deviates on outcome. The sequencing deviation is narrower, and it keeps the archive and its
pointer in one atomic pull request, so the interval in which the archive exists unpointed is zero rather
than one merge long.

---

## 2. Clause B — narrow date rebinding

### 2.1 Forcing incident

Format specification §4.1 defines the normalized archive filename by the date of the migration commit.
Commission §4.3 requires the manifest to pin that exact filename, and §2.2 forbids a placeholder in the
manifest. The manifest is ratified before Stage 2b begins, so the date must be chosen before the commit it
names exists.

That is an irreducible schedule bet. A date chosen too early is overtaken by a slipped commit; a date chosen
too late does not equal the commit date the specification defines it as. Either outcome is a specification
violation, and under the commission as ratified the only remedy is re-ratification of every date-bearing
byte — which in practice pressures a seat toward the improvisation §2.2 forbids, or pressures the owner
toward a conservative date chosen to protect the process rather than to describe the work.

The commission provides no bounded correction for a mechanical, semantics-free change.

### 2.2 Operative text

> **Definition.** `MIGRATION_DATE` is the `YYYY-MM-DD` calendar date, in `America/New_York`, of the **author
> timestamp** of the Stage 2b content commit that first contains the migrated `DECISIONS.md` and the
> normalized migration archive.
>
> This definition is a verification predicate, not a derivation: the filename cannot be computed from a
> commit that does not yet exist. The owner selects a candidate date, the manifest pins it, and the predicate
> is checked against the actual commit. It must be re-checked at the final pre-merge state of the branch,
> because history rewriting can move the timestamp. If the predicate fails at any point before merge, the
> date is rebound under this clause or the migration stops; it is never reconciled by editing the filename
> alone.
>
> **Production boundary.** The owner selects and ratifies the replacement date. The architect seat performs
> the deterministic manifest re-render. Codex never edits ratified manifest bytes, before or after a
> rebinding, consistent with §5.2 item 4.
>
> **Rebinding procedure.** A rebinding is a bounded owner act and must produce, in order:
>
> 1. a manifest-only rebinding commit, landed **before** the Stage 2b content commit, so the content commit
>    is still diffed against an immutable in-branch authority as §9 requires;
> 2. an exact owner-ratified diff limited to bytes the ratified date-surface inventory authorizes as
>    date-dependent, and containing no other change;
> 3. a replacement manifest SHA-256, superseding the earlier one as the ratified authority;
> 4. both manifest hashes, both ratification records, and the rebinding act itself recorded in the migration
>    receipt.
>
> No statement, wrapper body, span, hash, anchor, classification, or field other than the re-rendered dates
> may change.
>
> Rebinding is permitted until repository conformance is accepted, provided the branch is rewritten so
> that the manifest-only rebinding commit precedes the Stage 2b content commit and every downstream
> artifact and check affected by the date is regenerated. Those are, at minimum: the normalized archive
> filename and preamble, the migrated `DECISIONS.md`, the post-migration reference-graph artifact of §6.1,
> the target reconcile run, the live conformance run, and the receipt. After repository conformance has
> been accepted, a date change requires a new commission.
>
> A rebinding that occurs after the §8 independent review has returned `ACCEPT` requires that reviewer to
> re-confirm two things only: the date-only diff and the regenerated derived report. It does not reopen
> content review, because a rebinding may not alter any statement, wrapper body, span, hash, anchor,
> classification, or non-date field.
>
> **Date-surface inventory.** The Stage 2a manifest must carry a date-surface inventory that assigns a
> stable surface ID to every surface whose bytes are a function of `MIGRATION_DATE`, and to every
> date-bearing surface that is **not** a function of it together with the reason each is fixed. The
> inventory assigns concrete locators, not surface classes.
>
> **Derived report.** A rebinding is valid only when the manifest's derived occurrence report is regenerated
> from the assembled bytes and proves all four of:
>
> 1. every concrete date-bearing occurrence maps to exactly one inventory row;
> 2. no occurrence is unmapped, and none is multiply mapped;
> 3. only surfaces the inventory marks date-dependent changed, and all of them carry the new date;
> 4. every surface the inventory marks fixed is byte-identical across the rebinding.
>
> A rebinding satisfying this clause discharges the Stage 2a return trigger in Clause A. No seat may select,
> infer, or default the date.

### 2.3 Two departures from the review's proposed wording

**Author timestamp, not committer timestamp.** The review proposed anchoring on the committer timestamp.
Committer timestamps are reset by `git commit --amend` and by every rebase; author timestamps survive both.
Anchoring the filename to the committer timestamp would make a ratified byte fragile to routine branch
hygiene on a branch the commission expects to sit unmerged through gates and independent review. Author date
is the stable anchor, and the re-check requirement above covers the residual case where history rewriting
moves even that.

**§5.2 is clarified, not amended.** The review proposed listing §5.2 among the amended surfaces. §5.2 item 4
already forbids Codex from modifying ratified manifest bytes and says nothing about the architect seat, so
the production boundary is a restatement rather than a change. Naming it as amended would overstate what
this instrument does, which is its own kind of governance error.

### 2.4 What Clause B does not do

- It does not let any seat choose or change the date. Both binding and rebinding are owner acts.
- It does not authorize re-rendering by resemblance. Only surfaces the ratified inventory marks
  date-dependent may change. `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` is a ratified Amendment 4
  literal, and the four 2026-07-28 retirement dates are historical facts; a uniform re-date that touched
  either would break ratified bytes.
- It does not make the manifest mutable by implication. Every rebinding produces a new ratified authority
  with its own hash and its own owner act, landed before the commit it governs.
- It does not replace the derived report with a hand count. A hand-maintained count of a mechanically
  derivable population is the defect class this project has already paid for twice in this workstream alone.
- It does not extend past conformance acceptance.

---

## 3. Principle 27 compliance

Principle 27 permits softening an invariant only where the forcing incident is named and the generating
condition no longer holds.

**Clause A.** Forcing incident: §1.1. The tracked-path rule was minted to stop prose labels, commands,
symbols, and pseudo-paths being copied into field slots that are supposed to name real repository objects.
That condition does not obtain here: the value is an exact filename created by the same commission, pinned
in the manifest, verified for exact equality at review, and verified for existence and trackedness by the
unmodified final gate. The rule's purpose is preserved; only the moment of verification moves.

**Clause B.** Forcing incident: §2.1. The re-ratification requirement exists so that ratified bytes are not
changed without review. That condition does not obtain for a date re-render, because the changed bytes carry
no semantics a human review could evaluate — the inventory fixes which bytes may change and the derived
report proves which did. Clause B is a narrowing of scope, not a removal of review: it substitutes a
mechanical proof for a human one on exactly the class of change where the mechanical proof is stronger, and
it keeps the owner act.

Both clauses are self-limiting: Clause A is exhausted by one use, Clause B expires at conformance
acceptance.

---

## 4. Precedent scope

Neither clause sets precedent. Clause A is spent. Clause B is bounded to this migration and to
date-dependent bytes named in a ratified inventory. A future commission wanting either mechanism argues it
on its own forcing incident.

---

## 5. Consequential requirements on the manifest and receipt

Clause B adds to commission §§4.3 and 4.8:

1. the date-surface inventory of §2.2 — a table with a stable surface ID per row, an explicit
   dependent/fixed disposition, concrete locators rather than surface classes, and a reason per fixed row;
2. the derived occurrence report, generated from the assembled manifest bytes and satisfying the four
   proofs in §2.2.

Clause B adds to commission §9 one authorized commit: the manifest-only rebinding commit, which may occur
only between the ratified-manifest commit and the content commit.

Clause B adds to commission §10: every manifest SHA-256 in the ratification chain rather than one, every
owner-ratification record, and the rebinding act with its date-only diff.

A draft inventory exists at `DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md` §8.1,
carrying surface IDs `D1`–`D5` and `F1`–`F8`. That draft is provisional and assigns surface IDs only; this
amendment binds the ratified manifest's inventory, which must resolve each ID to concrete locators in the
assembled bytes.

---

## 6. Ratification

**Status: RATIFIED 2026-07-30 by Luke (owner).** §1.2 approved as written. §2.2 approved subject to the
rebinding-deadline synchronization repair, now applied.

**Two architect additions inside the ratified §2.2 repair are confirmed by the owner, 2026-07-30.** The
approved repair text said "every downstream artifact and check affected by the date is regenerated" and set
the deadline at conformance acceptance. Beyond that, this seat added, and the owner confirmed as written:

1. the concrete enumeration of those downstream artifacts, prefixed "at minimum" — it makes the abstract
   phrase actionable in a closed-world instrument and does not change its scope;
2. the requirement that a rebinding after a §8 `ACCEPT` sends the date-only diff and regenerated derived
   report back to that reviewer — a new obligation, and a tightening rather than a loosening, closing the
   case where a rebind silently invalidates the byte basis of a completed independent review.

Both only add checks. Neither is load-bearing for the three deterministic prerequisites. Both are now in
force as ratified text.

On ratification, both clauses take effect immediately and the Stage 2a prerequisite sequence is:

1. Ratify this amendment.
2. Produce the E038 preservation-slice hash (shell-capable seat).
3. Run `countStatementSentences` over the 65 target statements, plus the superseded E038 wording as a
   separately labelled control.
4. Verify trackedness of every present `Evidence` and `Owner` path against `git ls-files`, excepting only
   E038's under Clause A.
5. Owner binds `MIGRATION_DATE`.
6. Assemble the manifest, including the date-surface inventory and derived occurrence report.

Items 2 through 4 are independent and may run in any order or together. Item 5 is last before assembly.

The ratification record carries 2026-07-30, the date of the owner act; this document retains its 2026-07-29
drafting filename and drafting date.
