# Migration Commission Amendment 5 — Owner Ratification

**Date:** 2026-08-18 · **Act:** Owner exact-byte ratification, in the same form as
`DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-RATIFICATION-2026-08-08.md`,
`DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-RATIFICATION-2026-08-08.md`, and
`DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md`.

**Ratified instrument:** `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-5-DRAFT-2026-08-12.md`,
**exactly `12304` bytes**, **SHA-256
`cc0ca33350257b6aaa6f12dafd9cf822738adf613bd62c811f702656b7b43148`**.

Ratified **as written**, with no revision requested and no clause reserved. The amendment number `5`,
provisional under the amendment's own status line until this act, is now fixed.

This record exists as a separate file, rather than as a banner edited into the amendment itself, for the
same reason Amendment 2, Amendment 3, and the Stage 2a manifest were each ratified by a separate record:
writing a ratification banner into the ratified document would change its bytes, and the ratified identity
would no longer describe what is on disk.

**The amendment file is not edited by this act.** Its status line continues to read
`DRAFT — NOT RATIFIED` and its filename continues to carry `-DRAFT-`. Both are stale as of this record and
**neither is to be repaired**, on the standing treatment of `target-text-manifest.md`'s stale
`CANDIDATE, NOT RATIFIED` banner recorded at `DECISIONS-MIGRATION-STAGE-2B-RESUMPTION-NOTE-2026-08-12.md`
§6: cite the ratification record, never the banner, and do not edit the ratified bytes to make the banner
true. The amendment remains frozen at the identity above.

## What is in force

Per the amendment's own terms, effective on this act:

1. **Clause A** extends commission §5.2 by item 13 — migration governance and evidence artifacts at their
   existing paths: files under `audit/decisions-migration-2026-07-29/`, and repository-root files whose
   names begin with `DECISIONS-MIGRATION-` or which are ratified amendments to the commission.
2. Item 13 is **closed-world at the point of use**. It admits no path by pattern alone. Before Commit 1 of
   the §9 sequence, the executing seat produces an enumerated census of every path to be committed under
   item 13, measured from live disk with `git status --porcelain=v1 --untracked-files=all`, and the owner
   ratifies that enumeration. Only enumerated paths are staged. A path matching the description but absent
   from the ratified census is not authorized. **This record predates the census and belongs in the initial
   enumeration**, as does the content-commit work order at its current revision. Artifacts created *after*
   the census — any later closeout, the §10 receipt, and the §8 disposition — require a supplementary
   enumeration ratified before the commit that carries them.
3. Item 13 authorizes **commit, not acceptance**. Every artifact it carries retains exactly the status it
   already holds — ratified, frozen, draft, superseded, or recorded-with-defect (Clause A §1.4). Committing
   a receipt does not accept its findings; committing a draft does not promote it; committing a superseded
   artifact does not revive it.
4. Item 13 authorizes **no implementation surface**. Items 1–12 remain the exclusive authorization for
   code, configuration, workflow, archive, and constitutional paths, and §11's prohibition on bank, schema,
   renderer, runtime, clinical, and product files is untouched. No artifact is moved, renamed, edited, or
   reformatted to qualify.
5. **Clause B** repairs the commission §7.3 cleanliness test, which now reads:
   `git status --porcelain=v1 --untracked-files=all` contains only intended files before **each** commit in
   the §9 sequence, and is empty after **Commit 4**. Emptiness is not required after Commits 1, 2, or 3;
   the residue between them is verified against the expected remainder rather than against emptiness. The
   remaining §7.3 requirements are unchanged.
6. **Clause C** defines the acceptance act: **repository conformance is accepted at the merge of the
   migration pull request, and no earlier act constitutes acceptance.** The zero-finding §7.1 item 2
   conformance run is prerequisite and evidence, not acceptance. §8's `ACCEPT` is prerequisite, not
   acceptance. Neither closes the rebinding window.
7. **The Amendment 1 Clause B rebinding window remains open until merge** — through the §7.2 full gate,
   through independent content review, through completion of the §10 receipt, and through the final
   pre-merge author-date recheck.
8. Clause C amends Amendment 1 Clause A §1.2 and Clause B §2.2 **solely** by supplying that definition, and
   clarifies without amending §7.1 item 2 and §8. Zero findings remain required; §8 review remains required
   in full with no sampling; no deadline is extended and no rebinding is authorized.
9. **Nothing else moves.** No clause changes the target grammar, the taxonomy, the classification of any
   entry, the identity or wording of any statement, `MIGRATION_BASELINE`, any pinned span or hash, the
   bound value of `MIGRATION_DATE`, or any commit's position in the §9 sequence. The Amendment 1 Clause B
   author-date predicate on Commit 3 is unchanged.
10. Amendments 2, 3, and 4 are untouched. The ratified Stage 2a manifest (`332579` bytes / SHA-256
    `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2`) remains authoritative and
    unchanged.
11. Stage 2b Phases 1–6 remain closed exactly as previously recorded. This ratification consumes no phase
    and closes none.

## What this act does not do

- It does **not** authorize the §9 commit sequence. Per Amendment 5 §5, the blocker it lifts is the block
  on `DECISIONS-MIGRATION-STAGE-2B-CONTENT-COMMIT-WORK-ORDER-DRAFT-2026-08-12.md`. That order must be
  revised against the ratified clauses to its current revision, then **externally hash-frozen by the owner**
  at that revision, then handed off. Ratifying this amendment does not freeze or issue that order. This
  record does not track the order's revision number; read the order's own header for it.
- It does **not** produce the Clause A §1.2 census. That is an execution-time act of the executing seat,
  followed by a separate owner ratification of the enumeration.
- It does **not** bind or rebind `MIGRATION_DATE`, which remains `2026-08-18` under Amendment 1 Clause B.
- It does **not** accept repository conformance, which by the clause it ratifies occurs only at merge.

## Architect-side confirmation at time of ratification

Independently confirmed against live disk immediately before recording this act:

- `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-5-DRAFT-2026-08-12.md` is **`12304` bytes**, an exact match to
  the owner's stated byte count.
- Its modification timestamp is `2026-08-13T02:44:45.060Z`, unchanged across this seat's full read of the
  file earlier in the same session, confirming no intervening write between that read and this act.
- The full text was read end to end by this seat before the record was written; the clause summary above is
  taken from the operative text, not from a prior summary.

**Digest provenance, stated rather than glossed.** The SHA-256 above is the owner's, produced by
`shasum -a 256` in the owner's shell. **This seat did not independently reproduce it.** The architect seat
has no SHA-256 primitive through the filesystem connectors in this session, and no sandbox bridge was
available; corroboration extends to byte length and non-modification only. This is weaker than the
Amendment 3 ratification, where a fresh copy was independently hashed to an exact match, and is recorded as
weaker rather than presented as equivalent. Any seat re-verifying this identity should recompute the digest
from disk rather than treat this record as an independent confirmation of it.

## Correction, 2026-08-18

Two corrections, recorded rather than silently applied. Both were caught in cold review by the GPT seat and
independently confirmed against live disk by this seat before repair.

**1. Census chronology.** As first written, item 2 of "What is in force" listed **this record** among the
artifacts created *after* the Clause A census and therefore requiring a supplementary enumeration. That was
a chronology error by the authoring seat: this record was written on 2026-08-18, before any census has been
taken, and it belongs in the **initial** enumeration. Item 2 is corrected above.

**2. Stale revision reference.** As first written, "What this act does not do" stated that the content-commit
order must be revised "to revision 4." That number was current when this record was written and went stale
the same day. The sentence now refers to the order's current revision generically and points to the order's
own header, so that this record cannot go stale again on a number it does not govern.

Both corrections touch only the authoring seat's own explanatory prose. Neither alters the ratified
instrument, its byte identity, the owner act this record memorializes, or any operative clause of
Amendment 5.

## Preservation advisory, restated

This record, the ratified amendment, and every governance artifact named above are untracked and exist on no
remote. The branch `codex/decisions-migration` has no configured upstream and carries no commits. The
backup advisory at `DECISIONS-MIGRATION-STAGE-2B-RESUMPTION-NOTE-2026-08-12.md` §4 is unspent: a cold copy
of the worktree to a location outside the repository remains advisable, and copying anything into the
repository remains not.
