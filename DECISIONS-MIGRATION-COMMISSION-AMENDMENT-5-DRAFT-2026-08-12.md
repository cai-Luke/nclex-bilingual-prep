# Migration Commission Amendment 5 — governance-artifact authorization, cleanliness-test repair, and the acceptance act

**Date:** 2026-08-12 · **Seat:** Architect
**Status: DRAFT — NOT RATIFIED.** The amendment number is provisional until ratification.

- **Clause A amends** `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md` §5.2 (authorized branch outputs).
- **Clause B amends** commission §7.3 (repository integrity).
- **Clause C amends** `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md` Clause A §1.2 and
  Clause B §2.2, **solely by defining the term "repository conformance is accepted"** on which both hang
  consequences and which neither defines. It changes nothing else in Amendment 1.
- **Clause C clarifies, and does not amend,** commission §7.1 item 2 and §8.

"Amends" is used here in the sense this commission's own amendments use it: Amendment 1 states that its
Clause A "amends §2.2, §4.6 item 2, §4.9" without editing a byte of the commission. Supplying a definition
that fixes the endpoint of Amendment 1's rebinding window is new operative meaning for Amendment 1, and is
named as an amendment for that reason rather than described as a byte-level non-event.

No clause changes the target grammar, the taxonomy, the classification of any entry, the identity or
wording of any statement, `MIGRATION_BASELINE`, any pinned span or hash, the bound value of
`MIGRATION_DATE`, or any commit's position in the §9 sequence. Nothing is relocated, renamed, or edited.

**Amendments 1–4 are not blanket-excluded from that list.** Clause C amends Amendment 1 as stated above,
by defining the acceptance act and thereby fixing when the Clause B rebinding window closes. Amendments 2,
3, and 4 are untouched.

---

## 1. Clause A — governance and evidence artifacts

### 1.1 Forcing incident

Commission §5.2 enumerates the complete set of paths the migration branch may contain and closes with "any
other path requires an amended commission." Item 10 authorizes "migration receipt and reconciliation
artifacts under `audit/decisions-migration-2026-07-29/`."

The migration has since produced two populations §5.2 does not cleanly authorize:

1. roughly sixty `DECISIONS-MIGRATION-*.md` instruments at the **repository root** — the commission's own
   amendments, work orders, handoffs, ratification records, phase closeouts, resume and resumption notes;
2. a substantial set of files under `audit/decisions-migration-2026-07-29/` that are evidence rather than
   receipts or reconciliation artifacts — frozen snapshots, surveys, and reports whose fit with item 10 is
   arguable in some cases and poor in others.

The result is that the entire governance record of a migration built specifically to be forensically
reconstructible would remain outside version control, which sits badly against §10's principle that no
evidence may live only in an end-of-chat report. The alternative readings are worse: relocating frozen
instruments to satisfy a directory convention would mutate paths named inside already-frozen orders, and
adjudicating the population file by file after the fact converts a bright-line rule into a case-by-case
negotiation.

### 1.2 Operative text

> §5.2 is extended by one item:
>
> 13. migration governance and evidence artifacts, at their existing paths: files under
>     `audit/decisions-migration-2026-07-29/`, and repository-root files whose names begin with
>     `DECISIONS-MIGRATION-` or which are ratified amendments to this commission.
>
> This authorization is **closed-world at the point of use, not at the point of amendment.** It admits no
> path by pattern alone. Before Commit 1 of the §9 sequence, the executing seat produces an enumerated
> census of every path to be committed under this item, measured from live disk with
> `git status --porcelain=v1 --untracked-files=all`, and the owner ratifies that enumeration. Only
> enumerated paths are staged. A path matching the description but absent from the ratified census is not
> authorized.
>
> No artifact is moved, renamed, edited, or reformatted to qualify. Frozen instruments are committed at the
> exact paths their issuing orders name.
>
> Artifacts created after the census — including any later phase closeout, the §10 migration receipt, and
> the §8 review disposition — are authorized by this item but require a supplementary enumeration ratified
> before the commit that carries them.

### 1.3 Why the census is deferred rather than frozen now

A literal path list frozen on 2026-08-12 would be stale before it was used. The remaining commissioned work
— the §6 graph artifact and its receipt, the §7.2 gate results, the §8 review disposition, the §10 migration
receipt, the `PROJECT-HISTORY.md` closeout, and the closeout of this amendment itself — each writes further
artifacts. A frozen enumeration would either exclude the very receipts §10 requires or need re-amendment on
each addition.

Deferring the enumeration to Commit 1 preserves the property that actually matters: nothing is committed
that the owner has not seen listed. It moves the census to the moment it is accurate, and it makes the
census a mechanical, delegable task rather than a governance act performed six days early against a moving
target.

### 1.4 What Clause A does not do

- It does not authorize any implementation surface. Items 1–12 remain the exclusive authorization for code,
  configuration, workflow, archive, and constitutional paths.
- It does not authorize bank, schema, renderer, runtime, clinical, or product files, which §11 forbids
  independently.
- It does not permit relocation. A tidier directory layout is not a reason to move a frozen instrument.
- **It does not ratify, accept, adopt, or revive the content of any artifact it authorizes for commit.**
  Every artifact retains exactly the status it already holds — ratified, frozen, draft, superseded, or
  recorded-with-defect. Committing a receipt does not accept its findings. Committing a draft does not
  promote it to an instrument. Committing a superseded artifact does not restore its authority. The commit
  records that the artifact existed and what it said, and nothing further.

## 2. Clause B — repository-integrity test repair

### 2.1 Forcing incident

Commission §7.3 requires that `git status --porcelain` "contains only intended files before commit and is
empty after commit." Two defects:

1. **The command is wrong for the purpose.** Default `--porcelain` collapses wholly untracked directories
   into a single directory entry, so it cannot serve as a file-level preservation census. This was
   established at Stage 2b Phase 5 and has governed every phase since.
2. **The timing is wrong for the mandated sequence.** §9 requires four commits. Intermediate dirt between
   Commits 1, 2, and 3 is inherent in that sequence — after Commit 3 the conformance wiring and the target
   reconciliation checker are still uncommitted by design. A test demanding emptiness after each commit
   contradicts the commit structure the same commission mandates.

### 2.2 Operative text

> In §7.3, the cleanliness test reads: `git status --porcelain=v1 --untracked-files=all` contains only
> intended files before each commit in the §9 sequence, and is empty after **Commit 4**. Emptiness is not
> required after Commits 1, 2, or 3; the residue between them is the remainder of the mandated sequence and
> is verified against the expected remainder rather than against emptiness.
>
> The remaining §7.3 requirements are unchanged: no bank, schema, renderer, runtime, or unrelated audit file
> changes; frozen phase-1 artifacts unchanged; hardened pre-migration graph unchanged; `MIGRATION_BASELINE`
> object accessible; `Archive/DECISIONS-ARCHIVE-2026-07-14.md` unchanged.

## 3. Clause C — the acceptance act

### 3.1 Forcing incident

Amendment 1 hangs two irreversible consequences on the moment repository conformance is accepted, and
defines that moment nowhere.

Clause A §1.2: the normalized archive "must be created and tracked in the same atomic migration pull
request before repository conformance is accepted." Clause B §2.2: "rebinding is permitted until repository
conformance is accepted," and "after repository conformance has been accepted, a date change requires a new
commission."

Four candidate acts are available — the zero-finding §7.1 item 2 conformance run, an architect record
adjudicating that run, §8's independent-review `ACCEPT`, and merge. They are days apart, and the window's
closure cannot be undone without a new commission. Leaving the act unstated invites a seat to discover
mid-execution that the window closed earlier than anyone intended.

### 3.2 Operative text

> **Repository conformance is accepted at the merge of the migration pull request.** No earlier act
> constitutes acceptance.
>
> The zero-finding live conformance run required by §7.1 item 2 is a **prerequisite and evidence** that the
> repository conforms. It is not the acceptance act and does not close the Amendment 1 Clause B rebinding
> window.
>
> The §8 independent-review disposition of `ACCEPT` is a **prerequisite** to merge. It is not the acceptance
> act and does not close the rebinding window.
>
> **The Amendment 1 Clause B rebinding window remains open until merge**, and therefore remains open
> through the full repository gate of §7.2, through independent content review, through completion of the
> §10 migration receipt, and through the final pre-merge author-date recheck Clause B requires.

### 3.3 Ground

Amendment 1 Clause B provides that "a rebinding that occurs after the §8 independent review has returned
`ACCEPT` requires that reviewer to re-confirm two things only." A rebinding after §8 `ACCEPT` is therefore
expressly contemplated by the ratified text, which forecloses reading §8's `ACCEPT` as the act that closes
the window.

Clause B further conditions rebinding on the branch being rewritten so the manifest-only rebinding commit
precedes the content commit. Branch rewriting is available only before merge, so merge is the natural
endpoint of the capability rather than an endpoint imposed on it.

Amendment 1 Clause A speaks of the archive being tracked "in the same atomic migration pull request before
repository conformance is accepted," which reads naturally as the merge of that pull request.

Commission §8 defines `ACCEPT` as "implementation is safe to merge" — an authorization to act, not the act.

### 3.4 What Clause C does not do

- It does not weaken §7.1 item 2. Zero findings remain required, and a non-zero conformance result still
  blocks merge.
- It does not weaken §8. Independent content review remains required in full, with no sampling.
- It does not extend any deadline or authorize a rebinding. It states when the option ends; whether to use
  it remains an owner act under Clause B, and the current owner plan is to require no rebinding at all.
- It does not make merge a formality. Merge is the owner's irreversible acceptance act and carries every
  §7.2 and §8 prerequisite with it.

## 4. Effect on the §9 sequence

Clause A determines the contents of Commit 1 beyond the ratified manifest, and of Commit 4 beyond the five
components §9 names. Clause B determines when the cleanliness test is applied. Clause C determines when the
rebinding window closes and therefore how much margin exists after Commit 3.

No clause changes any commit's position, any commit's governed identity, or the Amendment 1 Clause B
author-date predicate on Commit 3.

## 5. Ratification

This amendment requires one owner act. It is not self-executing and does not take effect by being written.
`DECISIONS-MIGRATION-STAGE-2B-CONTENT-COMMIT-WORK-ORDER-DRAFT-2026-08-12.md` is blocked until this
amendment is ratified or rejected, and is not to be hash-frozen before then.

**Recorded:** the deferred-census form of Clause A §1.2 was adopted at owner direction on 2026-08-12, over
an alternative from the reviewing GPT seat that would have enumerated and frozen the census inside this
amendment. §1.3 gives the reasons. Clause C's disposition originated with that same reviewing seat; its
supporting Clause B sentence was independently confirmed against live disk by this seat before adoption.
