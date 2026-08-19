# Stage 2b Instrument C — receipt, closeout, supplementary census, and Commit 4

**Date:** 2026-08-18 · **Revision:** 2 · **Seat issuing:** Architect · **Executing seat:** Codex
**Status: DRAFT — NOT OWNER-FROZEN, NOT AUTHORIZED, NOT EXECUTABLE.**
**Branch:** `codex/decisions-migration`

## 0. Identity and immutability

No hash slot, by design, as in Instruments A and B. The authorized identity is measured externally by the
owner and recorded in the owner acknowledgment and the Codex handoff, in the form:

> Stage 2b Instrument C revision 2 is authorized at `<length>` bytes / SHA-256 `<digest>`.

**This file is not edited after that measurement.** If it proves defective mid-execution, stop and return
to the architect seat for a superseding instrument.

**This order should not be frozen until Instruments A and B have returned and Blocks 1–5 at §3 are
populated**, because its §4 preconditions describe a repository state that does not yet exist at drafting
time and §3 is deliberately incomplete until then.

## 1. Gate on entry

This order does not begin until **both** are true and are stated in its handoff:

1. Instrument A returned, and the architect seat adjudicated it `ACCEPT` cold against live disk.
2. Instrument B — entered only after that `ACCEPT` and on a recorded Instrument A §7.1 item 11 PASS —
   returned `ACCEPT`, and the architect seat adjudicated it `ACCEPT` cold.

The two do not run concurrently. The sequence is Instrument A → architect `ACCEPT` → Instrument B →
architect `ACCEPT` → this order.

The §8.1 manifest-conformance disposition, performed by the architect seat, is supplied to this order as
pinned input **Block 5** at §3.

## 2. The census/receipt ordering, resolved path-wise

The §10 receipt is itself a post-initial-census item-13 path, while the frozen Revision 6 content-commit
order requires that receipt to preserve every supplementary census and its owner-ratification act. Executed
naively this recurses. It is resolved **path-wise, not recursively**, in this fixed order:

1. Create the receipt path and populate everything already known.
2. Confirm that every post-census item-13 path intended for Commit 4 already exists — including this order
   and its own handoff.
3. Run the exact supplementary item-13 census and obtain owner ratification.
4. **Append** that exact supplementary census and the ratification verbatim to the already-enumerated
   receipt path.
5. Create no new item-13 path after that point.
6. Stage only after the receipt contains the ratification.

**Amendment 5 Clause A's census authorizes enumerated paths, not immutable byte identities.** Editing an
already-enumerated path after the census does not create a new path and does **not** require a further
supplement. This is stated expressly so that step 4 is not read as an apparent recursion and stopped on.
Creating a **new** path after step 3 does require a further supplement, and under this order is a stop
instead.

## 3. Pinned inputs and faithful reconstruction rule

Blocks 2 and 4 are supplied by the **owner** from the preserved execution exchange. Block 5 is supplied by
the **architect seat** after the §8.1 review. Their fenced bodies below are copied into the receipt
**verbatim** — without summarizing, correcting, or reformatting.

The original chat text for Blocks 1 and 3 is not available as a durable byte store. Requiring an unavailable
chat transcript to be reproduced byte-for-byte would make closeout depend on archaeology rather than on the
repository evidence the migration was designed to preserve. Revision 2 therefore permits a **faithful
reconstruction** for those two blocks only. A reconstruction must preserve every material path, measured
result, stop condition, and owner/producer act needed to understand or reproduce the governed event; it may
not invent a missing measurement or silently improve the historical record.

**Block 1 is reconstructed mechanically, not from memory.** Frozen Revision 6 required Commit 1 to consume
the entire owner-ratified item-13 population then present, while the ratified manifest was committed under
its separate authority. Commit `5b4d2fd8c76d1af94400322882d7a7c709704ed6` is therefore the durable witness
to that initial census. During receipt construction Codex must derive the exact initial item-13 path list
from the Commit-1 delta against parent `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`, selecting only paths that
satisfy Amendment 5 Clause A item 13 and excluding
`audit/decisions-migration-2026-07-29/target-text-manifest.md`, which was committed under separate manifest
authority. The receipt prints that mechanically derived path list in full and labels it as the reconstructed
initial census. A mismatch between that path set and what Commit 1 actually contains is a stop.

### Block 1 — reconstructed initial Amendment 5 Clause A §1.2 census

~~~text
The original chat enumeration is unavailable as a durable byte record. Under Instrument C Revision 2 this block is reconstructed mechanically from Git history. Commit 1, 5b4d2fd8c76d1af94400322882d7a7c709704ed6, consumed the owner-ratified item-13 population present at the initial census. The receipt must print the exact item-13 path list derived from the Commit-1 delta against parent 05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5, excluding audit/decisions-migration-2026-07-29/target-text-manifest.md because that path was committed under separate manifest authority. That mechanically derived list is the faithful reconstruction of the initial Clause A §1.2 census.
~~~

### Block 2 — owner's ratification of the initial census, verbatim

~~~text
I ratify the exact Clause A §1.2 item-13 enumeration in your immediately preceding census return, as measured from live disk on 2026-08-18 with git status --porcelain=v1 --untracked-files=all, without addition, deletion, substitution, or reservation.

The four paths you identified as excluded from item 13 remain outside that enumeration and are governed separately by the frozen order: audit/decisions-migration-2026-07-29/target-text-manifest.md, Archive/DECISIONS-ARCHIVE-2026-08-18.md, Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md, and scripts/decisions-migration-target-reconcile.ts.

This is the owner ratification required by Amendment 5 Clause A §1.2. Preserve this ratification verbatim for later incorporation into the §10 migration receipt.

Proceed under frozen work-order Revision 6, 27486 bytes / SHA-256 734dfe10beb90dc9591e9cb4ea7033f9323e852310223f73eba8ef1d348c84da, from the point immediately following census ratification. Obey all staging, remainder, verification, stop, and commit-boundary requirements exactly.
~~~

### Block 3 — faithful reconstruction of the execution stop before Commit 3

~~~text
Codex stopped before Commit 3 after the three Commit-3 content paths had already been staged: DECISIONS.md, Archive/DECISIONS-ARCHIVE-2026-08-18.md, and Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md. In that staged state, npm run conform:decisions exited 0 with zero findings instead of the frozen order's required pre-Commit-3 exit 1 with exactly one UNTRACKED_PATH naming Archive/DECISIONS-ARCHIVE-2026-08-18.md. Codex treated the mismatch as a stop and did not make Commit 3, amend Commits 1 or 2, or edit governed working-tree bytes. The stop was returned to the owner for adjudication.
~~~

### Block 4 — owner's sequencing-defect adjudication, verbatim

~~~text
Owner stop adjudication, 2026-08-18.

The reported stop is accepted as a sequencing defect in frozen Revision 6, not as evidence of a migration-content or conformance defect.

`npm run conform:decisions` derives tracked paths from plain `git ls-files`, which reads the Git index. Because the three Commit 3 paths had already been staged, `Archive/DECISIONS-ARCHIVE-2026-08-18.md` was already tracked for purposes of the conformance checker, so exit 0 with zero findings is the expected result in that staged state.

The frozen order's required pre-Commit-3 observation is therefore to be made **before Commit 3's paths are staged**. This adjudication does not waive or alter that gate; it restores the index to the state in which the existing gate has its intended meaning.

Preserve Commits 1 and 2 exactly as they are. Do not edit any governed file and do not revise the frozen work order.

Proceed as follows:

1. Unstage **only**:
   - `DECISIONS.md` 
   - `Archive/DECISIONS-ARCHIVE-2026-08-18.md` 
   - `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` 
   Use an index-only operation such as `git restore --staged -- <those three paths>`; do not alter their working-tree bytes.
2.  Confirm HEAD remains Commit 2, `4511821`, and the three content paths remain present only in the working tree. 
3. In that unstaged pre-Commit-3 state, run the frozen order's checks. Require:
   - `npm run conform:decisions` → exit 1 with exactly one `UNTRACKED_PATH`, naming `Archive/DECISIONS-ARCHIVE-2026-08-18.md` 
   - `npm run test:decisions-format` → exit 0 
   -  both migration reconciliation commands → exit 0 
   Any different result is a new stop.
4.  If and only if those results match, stage exactly the same three Commit 3 paths again. 
5.  Verify the staged set is exactly those three paths. Do not stage `package.json`, `.github/workflows/promotion-gate.yml`, or `scripts/decisions-migration-target-reconcile.ts`. 
6.  Make Commit 3 under the frozen order. 
7.  Immediately verify its author date in `America/New_York` is `2026-08-18`. Any other date is a stop under Amendment 1. 
8.  Run the post-Commit-3 checks required by the order. `npm run conform:decisions` must now exit 0 with zero findings, and the format/reconciliation checks must remain exit 0. 
9.  Verify the post-Commit-3 working-tree remainder is exactly the three existing Commit 4 paths named above; the three not-yet-created Commit 4 artifacts naturally do not appear in status. 

Do not make Commit 4, push, open a PR, or merge. Return the full measured results.

Preserve this owner adjudication verbatim for incorporation into the eventual §10 migration receipt.
~~~

### Block 5 — architect seat's §8.1 manifest-conformance disposition, verbatim

~~~text
Commission §8.1 — manifest-conformance disposition
Seat: Claude architect seat. Recorded 2026-08-18, adjudicated cold against live disk.
Disposition: ACCEPT — commission §8.1 only.

Question, per commission §8 item 1: did Codex apply the ratified manifest
exactly, preserve bytes, and satisfy the deterministic gates?

LIMB 1 — RATIFIED MANIFEST APPLIED EXACTLY.
This seat read scripts/decisions-migration-target-reconcile.ts at live source
rather than relying on its output labels. Reports 7 and 8 form a bidirectional
pair over the 65 live blocks on a cardinality-checked bijection, comparing exact
heading, statement, field-list, and entry-index-row bytes in both directions
against payloads parsed from the ratified manifest's fenced records. Report 3
pins each of the 13 wrapper bodies to its baseline span by byte length and
SHA-256 and checks the wrapper separator bytes. Amendment 2's eight structural
surfaces are compared byte-for-byte, location-bound, and for global payload
uniqueness. Amendment 4's E053 routing is verified location-bound and unique,
including the positive assertion that the target §8 introduction carries no
archive-index-shaped line. The ratified manifest measures 332579 bytes on live
disk, matching its ratified identity.

RECORDED SCOPE SEAM. The checker prints "Amendment 3 joins [SCOPE]": join bytes
and the end-of-document byte are outside its byte-verification scope. Their
authority is ratified Amendment 3 as covered at Phase 4 closeout, which this seat
adjudicated ACCEPT on 2026-08-11 after independently executing
checkDecisionsFormat against live content (ok: true, issues: [], counts
65/65/65/13/13/6) and performing raw line-indexed adjacency checks at the join
boundaries, including the entry-index-to-declared-total join that produced Phase
1's original stop. The committed target measures 56964 bytes, the same length
verified at Phase 4, and DECISIONS.md has been frozen since. This seat carries
that join verification forward on length identity plus the freeze, not on a
digest computed here.

LIMB 2 — BYTES PRESERVED.
Measured on live disk: Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md at 76314
bytes, equal to the MIGRATION_BASELINE blob length; Archive/DECISIONS-ARCHIVE-
2026-07-14.md at 37094 bytes, unchanged from its Instrument A precondition
measurement; the normalized migration archive present at 13997 bytes.
git status --porcelain=v1 --untracked-files=all shows DECISIONS.md, both Archive
files, the ratified manifest, and the frozen phase-1 artifacts tracked and
unmodified. The only tracked modifications are the pre-existing Phase 6
package.json and .github/workflows/promotion-gate.yml. HEAD is 345d0d9 with the
chain 5b4d2fd -> 4511821 -> 345d0d9 intact and no Commit 4.

LIMB 3 — DETERMINISTIC GATES SATISFIED.
Satisfied on the post-Commit-3 gate results recorded by the owner and on
Instrument A Revision 2, which this seat adjudicated ACCEPT on 2026-08-18 against
live disk.

LIMITS ON THIS DISPOSITION.
No SHA-256 in any return was computed by this seat. Every checkable byte length
corroborates; digests remain producer-self-reported. This seat executed no gate
itself: deterministic-gate satisfaction rests on Codex's execution of scripts
whose source this seat has read. This is the §8.1 review only. It is not the
§8.2 constitutional content review, from which this seat is barred as author of
the migrated statements. Under Amendment 5 Clause C it is prerequisite to merge,
not acceptance of repository conformance.
~~~

**Architect-seat orientation note — not evidence, not copied into the receipt.** The substance of Block 4,
as the architect seat understands it, is that Codex stopped before Commit 3 because Revision 6 required the
pre-Commit-3 conformance observation after the three Commit 3 paths had already been staged;
`conform:decisions` derives trackedness from plain `git ls-files`, so staging the new archive made the
checker report zero findings; the owner adjudicated this as a work-order sequencing defect rather than a
migration-content defect, and Codex unstaged only the three Commit 3 paths, reproduced the intended
pre-staging gate, then restaged exactly those paths and continued. **This paragraph is the architect seat's
summary and is not the owner's act.** It exists to orient a reader of this order. It is not pasted into
Block 4, is not copied into the receipt, and does not discharge Block 4's population.

Pinning these blocks here **supplements but does not replace** the receipt's obligation under Revision 6 §4
to preserve both the initial and the supplementary census and ratification evidence.

**Known read hazard, recorded and not repaired.** The frozen Revision 6 order's §11 Revision 4→5 history
entry still states that the enumeration "is written to disk before staging," which Revision 6 removed from
operative §4. **§4 governs.** That file is tracked as of Commit 1 and **is not edited** — editing it would
also produce a ` M` residue outside the Commit-4 population and fail the amended §7.3 test where it sits.

## 4. Preconditions

1. Branch is `codex/decisions-migration`; print the full `git rev-parse HEAD`.
2. Commit 3 is unrewritten: `5b4d2fd` → `4511821` → `345d0d9`, in order, with no commit amended, rebased,
   squashed, `--reset-author`ed, or `--date`-overridden.
3. `git status --porcelain=v1 --untracked-files=all` matches the post-A-and-B state stated in this order's
   handoff, including the retained §6.1 graph artifact created by Instrument A and the disposition report
   created by Instrument B. Instrument A cannot have left the latter: the sequence is Instrument A →
   architect `ACCEPT` → Instrument B → architect `ACCEPT` → this order.

Any divergence is a stop.

## 5. Step 1 — the receipt

Create `audit/decisions-migration-2026-07-29/MIGRATION-RECEIPT.md` and populate every element commission
§10 requires: all governing commit SHAs; the full baseline SHA; the manifest SHA-256 and its
owner-ratification record; snapshot source and target hashes; the normalized archive hash; the 13 wrapper
body offsets, byte lengths, and hashes; the 65/13/1/1 reconciliation; the optional-field omission register
summary; the conformance result; the retired register and allocation-union result; post-migration graph
identity, counts, expected deltas, and source-segregated snapshot population; the two-run determinism
hashes; full gate results; the exact changed-path allowlist and diff statistics; the independent-review
disposition; and every advisory that did not affect acceptance.

Additionally: copy the fenced bodies of Blocks 2, 4, and 5 from §3 verbatim; copy the pinned reconstructed
statements of Blocks 1 and 3 exactly as written; and, for Block 1, print the mechanically derived initial
item-13 path list in full immediately after the reconstructed statement. Instrument B's §8.2 disposition is
reproduced with the Instrument A §7.1 item 11 PASS on which its entry was conditioned. The architect-seat
orientation note at §3 is **not** copied into the receipt.

The receipt explains snapshot-driven `RETIRED` records as a distinct historical source population rather
than presenting them as live-corpus regressions (commission §6.3).

## 6. Step 2 — `PROJECT-HISTORY.md` closeout

Write the migration closeout into `PROJECT-HISTORY.md`. This is a tracked implementation surface authorized
by commission §5.2 item 11 and named in the §9 Commit-4 population. **Its authorization does not come from
the supplementary census.**

## 7. Step 3 — completeness check, before the census

Confirm on disk that every intended post-initial-census governance and evidence artifact already exists. At
minimum: Instrument A's order and its handoff; Instrument B's order and its handoff; **this order and its
own handoff**; Instrument B's disposition report; the §6.1 post-migration graph artifact; and the receipt
path created at §5.

This order's handoff necessarily predates the supplementary census and must itself be enumerated in it.

If any intended artifact does not yet exist, **stop before taking the census** — creating it afterwards is
exactly what the supplement cannot absorb.

## 8. Step 4 — supplementary census and owner ratification

Run exactly:

~~~bash
git status --porcelain=v1 --untracked-files=all
~~~

Not the default `--porcelain`, and not a connector's status summary.

From that output enumerate **only** the item-13 population: files under
`audit/decisions-migration-2026-07-29/`, and repository-root files whose names begin with
`DECISIONS-MIGRATION-` or which are ratified amendments to the commission.

Return the exact enumeration to the owner for ratification as a separate act. **Only enumerated paths are
staged.** A path matching item 13's description but absent from the ratified supplement is **not
authorized**, and its appearance in the staged set is a stop. The census is mechanical and delegable; the
ratification of it is not.

**The supplementary census is not authorization for any implementation surface.** `PROJECT-HISTORY.md`,
`package.json`, `.github/workflows/promotion-gate.yml`, and `scripts/decisions-migration-target-reconcile.ts`
carry their own separate commission §5.2 items 1–12 authorization and are **not** enumerated under item 13.
Item 13 authorizes no implementation surface. Do not describe or record the supplement as covering them.

Where an artifact carries independent authorization as well — the graph artifact under commission §6.1, the
receipt under §10, Instrument B's disposition report under §8 — enumerate it in the supplement because it
sits under the item-13 directory, and record its independent authority alongside it.

Item 13 authorizes **commit, not acceptance**: every artifact retains exactly the status it already holds —
ratified, frozen, draft, superseded, or recorded-with-defect. Committing a receipt does not accept its
findings; committing a draft does not promote it; committing a superseded artifact does not revive it. No
artifact is moved, renamed, edited, or reformatted to qualify.

## 9. Step 5 — append, then freeze the population

Append the exact supplementary census and the owner's ratification act, with its date, verbatim to the
receipt. Per §2 this is an edit to an already-enumerated path and requires no further supplement.

**From this point no new item-13 path is created.** If one becomes necessary, stop and return to the owner.

## 10. Step 6 — Commit 4, once

Stage the exact complete Commit-4 population and nothing else. `git add -A` and `git add .` are prohibited.
The population is:

1. every path in the ratified supplementary item-13 census;
2. `PROJECT-HISTORY.md`;
3. `package.json`;
4. `.github/workflows/promotion-gate.yml`;
5. `scripts/decisions-migration-target-reconcile.ts`.

Verify the staged set path-for-path against that list before committing. Any path staged that is not on it,
or any path on it that is not staged, is a stop.

**Commit 4 is made once.** Commission §9 names it as one commit; no partial or split landing is authorized,
and splitting it to land the wiring early is expressly not authorized.

## 11. Step 7 — post-commit verification

1. **Amended §7.3 cleanliness.** `git status --porcelain=v1 --untracked-files=all` must now be **empty**.
   This is the one point in the sequence where emptiness is required. Any residue is a stop: either a path
   was staged that was not authorized, or a path that should have landed did not.
2. **Commit-3 author-date recheck.**

~~~bash
TZ=America/New_York git log -1 --format='%ad' --date=format-local:'%Y-%m-%d' <full SHA of 345d0d9>
~~~

   Must equal `2026-08-18`. Any other value is a stop. Do not correct it by amending, do not correct it by
   renaming the archive, and do not proceed with the mismatch recorded as a note. Return to the owner, who
   alone may rebind under Amendment 1 Clause B.

3. Confirm the four-commit sequence is intact and in order, with no commit amended, rebased, squashed,
   `--reset-author`ed, or `--date`-overridden.

## 12. Stop, and what happens next

**Stop here.** No `git push`, no pull request, no merge. Return the full execution record to the owner.

Merge is the Amendment 5 Clause C acceptance act for repository conformance, and it is an owner act. At
merge, and only at merge, Clause A's exception is spent and satisfied, the Amendment 1 Clause B rebinding
window closes, and the Phase 6 lifecycle condition can no longer be triggered by a rebinding. **Nothing in
this order accepts repository conformance.**

## 13. Not authorized

- `git push`, opening a pull request, merging, or any commit beyond Commit 4.
- Splitting Commit 4, or making any part of it before every component exists.
- Any edit to `DECISIONS.md`, either `Archive/` file, the ratified manifest, `lib/decisions-format.ts`,
  `scripts/tests/decisions-format.ts`, or any frozen order — including to repair the Revision 6 §11 read
  hazard or any stale banner.
- Creating any item-13 path after the supplementary census.
- Binding or rebinding `MIGRATION_DATE`.
- Summarizing, paraphrasing, correcting, or reformatting the verbatim fence bodies of Blocks 2, 4, or 5 at §3; or altering the pinned reconstructions of Blocks 1 or 3 except to materialize Block 1's exact Git-derived path list as expressly required.
- Recording the supplementary census as authorization for any implementation surface.
- `git clean`, `git reset --hard`, `git checkout` or `git restore` of a governed path, `git add -A`,
  `git add .`.

## 14. Revision history

**Revision 1 → Revision 2, 2026-08-18.** Bounded closeout-evidence repair before owner freeze. Revision 1
required byte-verbatim reproduction of two execution-chat blocks that were never preserved as durable
repository artifacts: the initial Clause A census enumeration and Codex's pre-Commit-3 stop return. That
requirement made final closeout depend on recovering ephemeral chat bytes even though the governed events
have stronger durable witnesses.

Revision 2 changes only the evidence-carriage method for §3 Blocks 1 and 3 and populates all five blocks.
Block 1 is reconstructed mechanically from Commit 1's Git delta, which is the durable path-level witness to
the owner-ratified item-13 population that Commit 1 consumed; the receipt must print the resulting path list
in full. Block 3 is a bounded factual reconstruction of the stop, preserving the three staged paths, the
unexpected zero-finding conformance result, the fact that Commit 3 was not made, and the return to the owner.
Blocks 2 and 4 are populated from the owner's preserved execution text and remain verbatim. Block 5 is
populated from the architect seat's §8.1 disposition and remains verbatim. No execution authority, commit
population, acceptance condition, gate result, or implementation surface is changed by this revision.
