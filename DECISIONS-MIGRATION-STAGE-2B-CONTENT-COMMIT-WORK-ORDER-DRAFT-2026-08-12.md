# Stage 2b — commit sequence and repository-conformance acceptance work order

**Date:** 2026-08-12 · **Revised:** 2026-08-18 · **Seat:** Architect · **Revision:** 6
**Status: DRAFT — NOT OWNER-FROZEN, NOT AUTHORIZED, NOT EXECUTABLE.**
**Branch:** `codex/decisions-migration`

This draft was written during the 2026-08-12 → 2026-08-18 parking interval so the reasoning survived the
interval. Revision 4 was made on 2026-08-18, the day `MIGRATION_DATE` names, immediately after ratification.

**The Amendment 5 block is lifted.** `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-5-DRAFT-2026-08-12.md` was
ratified as written by owner act on 2026-08-18, at `12304` bytes / SHA-256
`cc0ca33350257b6aaa6f12dafd9cf822738adf613bd62c811f702656b7b43148`, recorded at
`DECISIONS-MIGRATION-COMMISSION-AMENDMENT-5-RATIFICATION-2026-08-18.md`. Commit 1's contents are therefore
determined, the cleanliness test is repaired, and the acceptance act is fixed.

**This order is still not executable.** Two owner acts remain, and neither is performed by revising this
file: the owner must **externally hash-freeze this revision**, then **issue a handoff**. Until both are done
this remains a draft and no seat may act on it. The architect seat does not freeze its own orders.

Revision history is at §11.

---

## 1. Scope

This order would commission the §9 commit sequence through Commit 3, and would pin the conformance
transition and the terms on which repository conformance is later accepted.

It would **not** authorize commission §6 (post-migration reference graph), §7.2 (full repository gate),
§8 (independent constitutional content review), §10 (`MIGRATION-RECEIPT.md`), or the `PROJECT-HISTORY.md`
closeout. Those remain separately commissioned, and **Commit 4 is not made until all of them exist**; see
§4 and §8.

It authorizes no new content: every byte it commits already exists on disk. It does not follow that every
byte has been accepted, and the order must not be read that way. Two distinct populations are committed on
different footings:

1. **Adjudicated implementation bytes** — the migrated `DECISIONS.md`, the normalized archive, the
   preservation snapshot, `lib/decisions-format.ts`, `scripts/tests/decisions-format.ts`, and the ratified
   target manifest. These carry a closed-phase acceptance or an owner ratification, and committing them
   commits an adjudicated artifact.
2. **Governance and evidence artifacts authorized by Amendment 5 Clause A** — work orders, receipts,
   closeouts, reports, snapshots, resume and resumption notes, and amendment texts. These are committed as
   the historical record. **Each retains exactly the status it already holds** — ratified, frozen, draft,
   superseded, or recorded-with-defect — and committing it changes none of them. Committing a receipt does
   not accept its findings; committing a draft does not promote it to an instrument; committing a
   superseded artifact does not revive it. Amendment 5 Clause A §1.4 states this expressly.

## 2. Governing authorities, read directly

| authority | bearing |
|---|---|
| commission §9 | the mandated commit sequence and the review boundaries it preserves |
| commission §5.2 | the complete allowlist of paths the branch may contain, as amended by Amendment 5 |
| Amendment 1 Clause B §2.2 | the `MIGRATION_DATE` author-timestamp predicate and the rebinding procedure |
| Amendment 1 Clause A §1.2 | E038's `Evidence` exception; the archive must be created **and tracked** in the same atomic PR before repository conformance is accepted |
| commission §7.1 item 2 | live conformance with zero findings |
| commission §7.3, as amended | repository integrity before and after commit |
| commission §8 | independent post-implementation review; `ACCEPT` means safe to merge |
| Phase 6 closeout, 2026-08-12 | the wiring this order's conformance run exercises |
| Phase 1 closeout, 2026-08-08 §5 item 3 | flagged commit sequencing as open; this order answers that flag |
| Amendment 5 Clause A, ratified 2026-08-18 | §5.2 item 13; the closed-world, owner-ratified census governing Commit 1's governance artifacts |
| Amendment 5 Clause B, ratified 2026-08-18 | the repaired §7.3 cleanliness test: intended-only before each commit, empty only after Commit 4 |
| Amendment 5 Clause C, ratified 2026-08-18 | repository conformance is accepted at merge; the rebinding window stays open until then |
| Amendment 5 ratification record, 2026-08-18 | the ratified identity, and the standing rule that the amendment's stale `DRAFT` banner is never repaired |

## 3. The controlling finding: the content commit is not the next commit

Commission §9:

> One atomic pull request is preferred, with commits that preserve review boundaries:
> 1. ratified target manifest, after owner approval;
> 2. parser guard regression implementation against the already-landed Amendment 4 fixtures;
> 3. snapshot, normalized archive, and migrated `DECISIONS.md`;
> 4. reconciliation, graph artifact, conformance wiring, receipt, and `PROJECT-HISTORY.md` closeout.
>
> The target manifest must be committed before the migration implementation commit so the implementation
> can be diffed against an immutable in-branch authority. Do not squash away that boundary before
> independent review.

The branch HEAD is `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` and **no commit has been made**. Every
accepted output of Stage 2a and Stage 2b Phases 1–6 sits uncommitted in one worktree. The migrated
`DECISIONS.md` and normalized archive therefore **may not simply be committed next**. Two mandated commits
precede them, and the manifest boundary is load-bearing rather than stylistic: §8's independent reviewer
must diff the implementation against an immutable in-branch authority, which is impossible if the manifest
and the implementation land together.

Squashing is prohibited before independent review.

## 4. The authorized commit sequence

Each commit stages **only** the paths listed for it. `git add -A` and `git add .` are prohibited
throughout.

### Commit 1 — authority and ratified target manifest

| path | current status |
|---|---|
| `audit/decisions-migration-2026-07-29/target-text-manifest.md` | `??`, `332579` bytes, ratified identity `818be99a…` |
| governance and evidence artifacts | only as enumerated in the owner-ratified census; see below |

**Census pre-step, required before any staging.** Amendment 5 Clause A §1.2 makes item 13 closed-world at
the point of use. Before Commit 1 the executing seat produces an enumerated census of every path to be
committed under item 13, measured from live disk with `git status --porcelain=v1 --untracked-files=all` —
not the default `--porcelain`, and not a connector's status summary — and the owner ratifies that
enumeration as a separate act. Only enumerated paths are staged. A path that matches item 13's description
but is absent from the ratified census is **not authorized**, and its appearance in the staged set is a
stop. The census is mechanical and delegable; the ratification of it is not.

Artifacts written after the census is taken — including any later closeout, the §10 receipt, and the §8
disposition — are authorized by item 13 but require a **supplementary enumeration, ratified before the
commit that carries them**. This order at its frozen revision and the Amendment 5 ratification record both
predate the census and belong in the **initial** enumeration, not in a supplement.

**Census evidence is preserved without creating a self-referential repository artifact.** The census
ratification may be performed interactively — the owner reading the exact enumeration and ratifying it in
the moment, immediately before staging. Amendment 5 does not require a new repository file for that act,
and this order creates none before Commit 1: writing a fresh item-13 census artifact only after taking the
census would itself create a post-census path requiring supplementary enumeration. The executing seat must
therefore preserve the exact enumeration and the owner's ratification verbatim in its execution return, and
the §10 migration receipt must later preserve, for the completed sequence, the **exact initial Clause A
census**, **every supplementary census**, and **each corresponding owner-ratification act** with its date.
That durable incorporation discharges commission §10's existing principle that no migration evidence may
survive only in an end-of-chat report; this order creates no new §10 obligation and does not commission the
receipt.

Verify before staging that the manifest's byte length and SHA-256 still equal the ratified identity. A
mismatch is a stop: the ratified authority would no longer be what was ratified.

**Expected remainder after Commit 1.** Commit 1 consumes the manifest and the entire ratified item-13
population. Exactly eight paths remain, and nothing else:

| path | status | consumed by |
|---|---|---|
| `DECISIONS.md` | ` M` | Commit 3 |
| `lib/decisions-format.ts` | ` M` | Commit 2 |
| `scripts/tests/decisions-format.ts` | ` M` | Commit 2 |
| `package.json` | ` M` | Commit 4 |
| `.github/workflows/promotion-gate.yml` | ` M` | Commit 4 |
| `Archive/DECISIONS-ARCHIVE-2026-08-18.md` | `??` | Commit 3 |
| `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` | `??` | Commit 3 |
| `scripts/decisions-migration-target-reconcile.ts` | `??` | Commit 4 |

**How the remainder is checked, and what shifts it.** This table states the expected value on the
assumption that the ratified census equals the full item-13 population present on disk when the census is
taken. If the owner declines to ratify any enumerated path, that path stays in the remainder and this table
is wrong by exactly that path. The executing seat therefore derives the remainder mechanically as
**(the pre-Commit-1 working set) minus (the paths actually staged)**, compares it to this table, and treats
any divergence as a stop requiring return to the owner rather than a note. The comparison is made with
`git status --porcelain=v1 --untracked-files=all`. Path-level agreement is what is checked; a count carried
forward from any earlier session is not evidence.

### Commit 2 — parser guard regression

| path | current status |
|---|---|
| `lib/decisions-format.ts` | ` M`, `47075` bytes |
| `scripts/tests/decisions-format.ts` | ` M`, `41335` bytes |

Both are accepted outputs of Stage 2b Phase 1 (`ACCEPT`, 2026-08-08), which closed the F16 correction
through its resumption instrument. This commit introduces no new work.

**Expected remainder after Commit 2.** Exactly six paths, and nothing else:

| path | status | consumed by |
|---|---|---|
| `DECISIONS.md` | ` M` | Commit 3 |
| `package.json` | ` M` | Commit 4 |
| `.github/workflows/promotion-gate.yml` | ` M` | Commit 4 |
| `Archive/DECISIONS-ARCHIVE-2026-08-18.md` | `??` | Commit 3 |
| `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` | `??` | Commit 3 |
| `scripts/decisions-migration-target-reconcile.ts` | `??` | Commit 4 |

Derived and checked the same way as the post-Commit-1 remainder above.

### Commit 3 — the Stage 2b content commit

| path | current status |
|---|---|
| `DECISIONS.md` | ` M`, `56964` bytes |
| `Archive/DECISIONS-ARCHIVE-2026-08-18.md` | `??`, `13997` bytes |
| `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` | `??` |

**This is the commit Amendment 1 Clause B §2.2 governs** — the commit that first contains the migrated
`DECISIONS.md` and the normalized migration archive.

**Author-date predicate.** The calendar date of this commit's author timestamp, in `America/New_York`, must
equal `2026-08-18`. Verify immediately after creating it rather than assuming:

~~~bash
TZ=America/New_York git log -1 --format='%ad' --date=format-local:'%Y-%m-%d'
~~~

Any other value is a stop. Do not correct it by amending, do not correct it by renaming the archive, and do
not proceed with the mismatch recorded as a note. Return to the owner, who alone may rebind under Clause B.

The predicate is re-checked at the final pre-merge state. A plain rebase and `git commit --amend` preserve
the original author timestamp; `--reset-author`, `git rebase --ignore-date`, and an explicit `--date`
override replace it.

### Commit 4 — not made under this order

§9 defines Commit 4 as reconciliation, graph artifact, conformance wiring, receipt, and the
`PROJECT-HISTORY.md` closeout — one commit. Three of those five components do not yet exist. **Commit 4 is
made once, when all of its contents exist**, under a later order.

**Expected remainder after Commit 3.** Consequently, after Commit 3 the following remain uncommitted, and
that is the intended state, not drift. Three paths exist on disk; the remaining three rows name artifacts
that do not yet exist and therefore appear in no status output:

| path | status after Commit 3 |
|---|---|
| `scripts/decisions-migration-target-reconcile.ts` | `??`, `47448` bytes |
| `package.json` | ` M`, `8694` bytes |
| `.github/workflows/promotion-gate.yml` | ` M`, `1233` bytes |
| post-migration reference-graph artifact | does not exist — commission §6 |
| `audit/decisions-migration-2026-07-29/MIGRATION-RECEIPT.md` | does not exist — commission §10 |
| `PROJECT-HISTORY.md` | untouched — commission §5.2 item 11 |

Splitting Commit 4 to land the wiring early is **not authorized**. §9 names it as one commit, no gate
depends on the wiring being committed before the PR exists, and an early partial landing would create a
review boundary the commission did not design.

## 5. The conformance transition

**Before Commit 3**, `npm run conform:decisions` exits `1` with exactly one finding: `UNTRACKED_PATH` at
`DECISIONS.md:792`, naming `Archive/DECISIONS-ARCHIVE-2026-08-18.md`. Independently reproduced in the
owner's shell on 2026-08-12; recorded at Phase 6 closeout §5.

**After Commit 3**, the archive is tracked, `git ls-files` includes it, and the finding must disappear:

- `npm run conform:decisions` exits `0`, with **zero** findings.

That the archive was the only obstacle is evidenced, not assumed: the Phase 6 execution produced exactly
one finding across the entire live document.

**Either departure is a stop.** A non-zero exit after Commit 3 means a second untracked path exists that
the single-finding result did not predict, and the tracked-path story is wrong. An exit `0` **before**
Commit 3 means tracked-path validation is inert.

`npm run test:decisions-format` and both reconciliation commands must exit `0` at every point in the
sequence.

### 5.1 Repository cleanliness, as amended by Amendment 5 Clause B

Commission §7.3's test now reads: `git status --porcelain=v1 --untracked-files=all` contains **only intended
files before each commit** in the §9 sequence, and is **empty after Commit 4**. Emptiness is not required
after Commits 1, 2, or 3.

Two consequences for this order:

1. **Before each of Commits 1, 2, and 3**, the working tree must contain only paths intended for the §9
   sequence. Any unrelated file — bank or content work, scratch output, an editor artifact — fails the test
   where it sits and is moved out of the worktree first, with `mv`. `git clean` is prohibited by §7, and
   the migration's artifacts exist on no remote.
2. **After Commits 1, 2, and 3** the residue is verified against the expected remainder for that commit,
   not against emptiness. The three tables are at §4: post-Commit-1 under the Commit 1 heading
   (eight paths), post-Commit-2 under the Commit 2 heading (six paths), post-Commit-3 under the Commit 4
   heading (three paths on disk). A residue that does not match the applicable table is a stop: either a
   path was staged that this order did not authorize, or a path this order expected to remain was consumed
   early.

Emptiness after Commit 4 is a later order's gate, not this one's.

## 6. When repository conformance is accepted

**Disposition: repository conformance is accepted at the merge of the migration pull request.** Ratified as
Amendment 5 Clause C §3.2 by owner act on 2026-08-18. This is no longer a disposition adopted by this
order; the reasoning below is retained as the ground of a ratified clause rather than as an argument for
one.

The textual ground is in Clause B itself. Clause B provides that *"a rebinding that occurs after the §8
independent review has returned `ACCEPT` requires that reviewer to re-confirm two things only."* A
rebinding after §8 `ACCEPT` is therefore expressly contemplated — which forecloses reading §8's `ACCEPT` as
the acceptance act, since acceptance closes the rebinding window. Clause B also conditions rebinding on the
branch being rewritten so the rebinding commit precedes the content commit, which is only possible before
merge. Clause A's requirement that the archive be tracked *"in the same atomic migration pull request
before repository conformance is accepted"* reads naturally as the merge of that pull request. And §8
defines `ACCEPT` as *"safe to merge"* — an authorization to act, not the act.

The zero-finding conformance run of §5 is therefore **evidence that the repository conforms, not the
acceptance of conformance**. It does not close the rebinding window.

At merge, and only at merge:

1. Clause A's exception is spent and satisfied — the archive was created and tracked in the same atomic
   pull request, before acceptance;
2. the Amendment 1 rebinding window closes, and a date change thereafter requires a new commission;
3. the Phase 6 lifecycle condition can no longer be triggered by a rebinding.

The window therefore stays open through the full gate, independent content review, receipt completion, and
the final pre-merge author-date recheck. That is the intended margin, not an oversight.

## 7. Prohibitions

- No `git push`, no merge, no PR opened, until §6 (graph), §7.2 (full gate), §8 (independent review), and
  §10 (receipt) are discharged and Commit 4 is made. Commission §9: nothing is pushed or merged until all
  gates pass and independent review accepts.
- No squash, no rebase collapsing the commits, no `--reset-author` or `--date` override at any point.
- No `git add -A`, no `git add .`, no `git clean`, no `git reset --hard`, no `git checkout` of a governed
  path. The migration's artifacts exist on no remote; a destructive command is unrecoverable.
- No edit to any migration implementation surface. This order commits existing bytes; it authors none.
- No tracking of any path not authorized by §5.2 as amended.

## 8. Why §6, §7.2, §8, and §10 are separate but still gate the merge

§9 places the graph artifact, receipt, and `PROJECT-HISTORY.md` closeout inside Commit 4 of the same pull
request, and §7.1 items 5–6 and §10 require post-migration graph identity, two-run determinism, and full
gate results as migration evidence. They are affirmatively required **in the same pull request**. Nothing
requires them in the same *commissioned execution*, and §8's constitutional content review must be
performed by a seat that did not author the statements, which bars the Claude seat entirely.

They are out of this order's scope and remain gates on Commit 4 and on merge.

## 9. Open questions

**Q1 and Q2 are moved to `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-5-DRAFT-2026-08-12.md`** and are not
restated here. Q1 (artifact authorization) and Q2 (cleanliness test) are **resolved** by that amendment,
ratified as written on 2026-08-18.

**Q3 (acceptance act) and Q4 (Commit 4 splitting) are resolved above**, at §6 and §4 respectively.

**No question remains open in this order.** The deferred-census form of Amendment 5 Clause A §1.2 was
adopted at owner direction on 2026-08-12, recorded at Amendment 5 §5, and ratified as written on
2026-08-18. Q1 and Q2 are closed on that ratification. The contingency stated in revision 3 — that Q1 and
Q2 reopen if Amendment 5 were rejected or materially revised — did not occur and is spent.

## 10. Not authorized

- Executing this order in any form before the owner hash-freezes this revision and issues a handoff.
  Amendment 5's ratification lifted the amendment block only; it neither froze nor issued this order.
- Resolving any remaining question by inference, by choosing the reading that protects the schedule, or by
  recording a note and proceeding.
- Any edit to `DECISIONS.md`, the normalized archive, the preservation snapshot, the ratified manifest, or
  any script.
- Binding or rebinding `MIGRATION_DATE`. That is an owner act under Amendment 1 Clause B.
- Making Commit 4, in whole or in part.

## 11. Revision history

**Revision 1 → 2, 2026-08-12.** Three changes, all recorded rather than silently applied:

1. **Q4 error, first correction (revision 1, same day).** Revision 1 asserted that declining to split
   Commit 4 would delay the *content* commit past 2026-08-18 and force a Clause B rebinding. That was
   wrong: §9 orders the commits 1 → 4, so Commits 1–3 may land on 2026-08-18 and Commit 4 may be completed
   afterward. Q4 carries no schedule consequence for the author-date predicate.
2. **Q4 error, second correction (this revision).** Revision 1 further proposed authorizing a *partial*
   Commit 4 carrying the wiring and checker under the 2026-08-18 order. That is also withdrawn. §9 names
   Commit 4 as one commit; nothing gates on the wiring being committed early; and the partial landing would
   have invented a review boundary the commission did not design. Both errors shared one root cause — the
   authoring seat reasoning about what would be convenient to land on the 18th rather than about what §9
   authorizes.
3. **Q3 resolved** at §6, on the Clause B textual ground that a rebinding after §8 `ACCEPT` is expressly
   contemplated. The disposition originated with the reviewing GPT seat and the supporting Clause B
   sentence was independently confirmed against live disk by this seat before adoption.

**Revision 2 → 3, 2026-08-12.** Two changes:

1. **§1 corrected.** Revision 2 stated that every byte this order commits "has already been accepted by a
   closed phase." That was false of the Amendment 5 Clause A governance and evidence artifacts, which
   include drafts, superseded material, and at least one artifact carrying a recorded-but-unrepaired
   defect. §1 now separates adjudicated implementation bytes from governance artifacts and states that the
   latter retain the status they already hold. Committing an artifact is not accepting it.
2. **§9 stale question removed.** The frozen-versus-deferred census question was resolved by owner
   direction and is recorded at Amendment 5 §5.

The revision number was bumped because the §1 correction landed after revision 2 was written, so the
revision-2 bytes no longer described the file.

**Revision 3 → 4, 2026-08-18.** Amendment 5 was ratified as written. This revision carries that through and
makes no other change. Six changes:

1. **The Amendment 5 block is lifted** in the preamble, with the ratified identity pinned. The order's own
   status is unchanged: still DRAFT, still not owner-frozen, still not executable.
2. **§2** gains four authority rows — Clauses A, B, and C as ratified, and the ratification record.
3. **§4 Commit 1** replaces the placeholder governance-artifact row with the closed-world census pre-step,
   including the requirement that this revision and the ratification record themselves be enumerated.
4. **§5.1 added**, carrying Clause B's repaired cleanliness test and its two consequences for this
   sequence, including that an unrelated file is moved out with `mv` rather than cleaned.
5. **§6** restated as a ratified clause rather than as an owner disposition pending ratification.
6. **§9 and §10** closed against the ratification: Q1 and Q2 are spent, and the sole remaining bar to
   execution is the owner's hash-freeze and handoff.

Nothing in this revision touches `DECISIONS.md`, the archive, the snapshot, the manifest, any script, the
§9 commit order, or the Amendment 1 Clause B author-date predicate on Commit 3.

**Revision 4 → 5, 2026-08-18.** Three bounded repairs, all raised in cold review by the GPT seat against
the live file and each independently confirmed against live disk by this seat before repair. No other
change.

1. **Dangling verification reference repaired — an authoring-seat defect.** Revision 4 §5.1 directed that
   residue after Commits 1, 2, and 3 be verified against "the expected remainder tabulated at §4," but §4
   contained only the post-Commit-3 table. Clause B's residue test was therefore not mechanically
   executable for Commits 1 and 2. Revision 4's own summary had promised remainder tables for Commits 1–3
   and delivered one. This instance of the standing pattern — asserting what a verification will produce
   without reading whether the referenced artifact contains it — is recorded here for the defect ledger.
   Explicit post-Commit-1 (eight paths) and post-Commit-2 (six paths) tables are added at §4, each with the
   derivation rule, the shift condition when the owner declines to ratify an enumerated path, and the
   command used for comparison. §5.1 now names all three tables by location and expected path count.
2. **Census evidence preservation added** at §4. Interactive owner ratification of the census is permitted;
   interactive-only survival is not. The enumeration is written to disk before staging, and the §10 receipt
   must preserve the exact initial census, every supplementary census, and each corresponding ratification
   act. Stated as an application of §10's existing evidence principle, not as a new §10 obligation.
3. **Census chronology corrected** at §4: this order at its frozen revision and the Amendment 5
   ratification record predate the census and belong in the initial enumeration, not in a supplement. The
   same error was corrected in the ratification record itself, under a recorded correction note.

No governed implementation surface was touched. `DECISIONS.md`, both `Archive/` files, the manifest,
`lib/decisions-format.ts`, `scripts/tests/decisions-format.ts`,
`scripts/decisions-migration-target-reconcile.ts`, `package.json`, and
`.github/workflows/promotion-gate.yml` are byte-unchanged by this revision.

**Revision 5 → 6, 2026-08-18.** Two freeze-blocking defects found in a final GPT cold read were repaired,
and nothing else changed.

1. **Census self-reference removed.** Revision 5 required the executing seat to take the Clause A census and
   then create a new item-13 census file under `audit/decisions-migration-2026-07-29/` before Commit 1.
   Because that file would be created after the census, Amendment 5 would itself require a supplementary
   enumeration for the evidence file, creating the same problem recursively. Revision 6 creates no new
   repository path for the census before Commit 1. The exact enumeration and owner-ratification act are
   preserved verbatim in the execution return and later incorporated into the §10 receipt.
2. **Stale operative revision reference removed.** Revision 5 §10 still barred execution until the owner
   hash-froze "revision 4." Both the preamble and §10 now say **this revision**, so the execution condition
   cannot silently point at a superseded draft after a bounded repair.

The historically accurate preamble sentence recording that Revision 4 was made on 2026-08-18 is retained.
No governed implementation surface was touched by this revision.
