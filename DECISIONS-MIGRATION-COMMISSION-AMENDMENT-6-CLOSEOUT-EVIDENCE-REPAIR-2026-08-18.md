# Migration Commission Amendment 6 — bounded closeout-evidence repair after Commit 4

**Date:** 2026-08-18 · **Seat:** Architect · **Drafting revision:** 4
**Status: DRAFT — NOT RATIFIED.** The amendment number is provisional until ratification.

- **Clause A amends** `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md` §9 (commit and pull-request structure)
  and §10 (migration receipt).
- **Clause B amends** `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-5-*` Clause B §2.2, solely by relocating
  the cleanliness endpoint from a named commit to the branch's terminal pre-merge commit.

No clause changes the target grammar, the taxonomy, the classification or wording of any entry,
`MIGRATION_BASELINE`, any pinned span or hash, the bound value of `MIGRATION_DATE`, or the identity or
position of Commits 1–4. None of those migration-content authorities, pinned identities, or Commits 1–4 is
relocated, renamed, amended, rebased, or edited. Amendment 5 Clause C is untouched: repository conformance
is still accepted only at merge.

---

## 1. Clause A — the evidence-repair commit

### 1.1 Forcing incident

Commission §10 requires the receipt to report the two-run determinism hashes, full gate results, all
governing commit SHAs, and any advisory that did not affect acceptance, and closes: "No evidence may live
only in an end-of-chat report."

The receipt created under Instrument C Revision 2 and landed in Commit 4 does not carry, at the receipt
path: Run 1's raw digest, the `cmp` fidelity result, either normalized digest, the per-step §7.2 results,
two of the four advisories Instrument A returned, or Commit 4's identity. The historical execution evidence
listed above exists in the preserved Instrument A Revision 2 execution return held by the owner, but is not
carried at the receipt path. Commit 4's identity exists durably in Git history but likewise is absent from
the receipt.

Instrument C §12 stopped after Commit 4 and §13 forbids any commit beyond it, so the repair requires new
authority. Amending Commit 4 is excluded twice over: Instrument C §11 requires the four-commit sequence
unamended, and amending would change the very SHA the repair must record.

### 1.2 Operative text

> §9 is extended by one commit, after Commit 4 and before merge:
>
> 5. a single closeout-evidence repair commit, carrying only the completion of the §10 receipt and the
>    governance instruments authorizing that completion.
>
> This commit authors no new historical evidence. It transcribes the Instrument A Revision 2 measurements
> and results only from the preserved execution return, at their recorded values. Those historical values
> may not be re-run, regenerated, re-measured, reconstructed, inferred, or supplied from memory. This
> prohibition does not prevent the repair instrument from measuring its own current execution state as
> necessary to verify identity, repository status, supplementary-census membership, staged population,
> diff statistics, or terminal cleanliness.
>
> Identities of commits that already exist are transcribed from Git history rather than from that return,
> and attributing an already-recorded advisory to the seat that observed it is a completion of the receipt
> rather than new evidence. Neither is authority to add any other value from any other source.
>
> The commit may not alter any finding, disposition, or gate result. A value that cannot be transcribed
> from a preserved instrument return is recorded in the receipt as unrecoverable, with the reason; it is
> never reconstructed, inferred, or supplied from memory.
>
> Commit 5 is made once. It touches no implementation surface and no constitutional path. Every path it
> carries is authorized under §5.2 item 10 or item 13; item 13 paths created after the Instrument C
> supplementary census require a further supplementary enumeration, ratified by the owner before Commit 5,
> in the same form Amendment 5 Clause A §1.2 requires.
>
> §10's "all governing commit SHAs" expressly includes Commits 4 and 5. **The terminal commit's own
> identity is not recorded inside itself.** A receipt cannot contain the hash of the commit that carries
> it; that identity is durably recorded by Git and by the execution return. This states the boundary
> expressly so no further commit is generated to record the previous one.

### 1.3 What Clause A does not do

- It does not reopen the migration. Stage 2a, the 65 statements, the wrapper boundaries, the manifest, and
  Instruments A and B and their dispositions are closed and are not re-reviewed.
- It does not authorize a second determinism run, a regenerated graph, or any overwrite of the retained
  §6.1 artifact. Instrument A §3 item 7's overwrite permission was expressly non-generalizing and is spent.
- It does not authorize any edit to `DECISIONS.md`, either `Archive/` file, the ratified manifest,
  `lib/decisions-format.ts`, `scripts/tests/decisions-format.ts`, `package.json`, the workflow, or any
  frozen order.
- It does not accept the receipt's findings, and does not accept repository conformance.
- It does not split migration or gate wiring into partial landings; §11's non-goal is untouched, because
  every implementation surface already landed atomically in Commit 4.

## 2. Clause B — cleanliness endpoint

### 2.1 Forcing incident

Amendment 5 Clause B fixed the §7.3 cleanliness test at "empty after **Commit 4**," drafted when Commit 4
was the branch's terminal commit. That test was applied at Commit 4 and passed. Clause A makes Commit 4
non-terminal, so the ratified endpoint would now name a commit that is no longer the last.

### 2.2 Operative text

> In §7.3 as amended, the cleanliness test reads: `git status --porcelain=v1 --untracked-files=all`
> contains only intended files before each commit in the §9 sequence, and is empty after the **terminal
> pre-merge commit** of that sequence. Emptiness is not required after any earlier commit.
>
> The verified emptiness after Commit 4 stands as recorded and is not retracted. The remaining §7.3
> requirements are unchanged.

## 3. Ratification

This amendment requires one owner act. It is not self-executing. The closeout-evidence repair instrument
is blocked until this amendment is ratified or rejected, and is not to be hash-frozen before then.

## 4. Drafting history

**Revision 1 → Revision 2, 2026-08-18, pre-ratification.** Owner correction to Clause A §1.2. Revision 1
prohibited the repair commit from re-running, regenerating, or re-measuring "anything." Read literally that
barred the repair instrument's own required current-state measurements — identity verification, the
supplementary census, staged-set verification, diff statistics, and terminal cleanliness — and so would
have made the instrument unexecutable as written. The prohibition is narrowed to the historical Instrument
A evidence being transcribed, with an express carve-out for current-execution-state measurement. Two
consequential additions follow from that narrowing: Git history is named as the source for commit
identities, which postdate the Instrument A return, and provenance-attribution of an already-recorded
advisory is named as receipt completion. The bar on altering findings and the unrecoverable-value rule are
carried forward from Revision 1 unchanged.

**Revision 2 → Revision 3, 2026-08-18, pre-ratification.** Factual correction to Clause A §1.1, on the
reviewing seat's finding. Revisions 1 and 2 stated that in each case the missing evidence sits in the
Instrument A Revision 2 execution return. That is false of Commit 4's identity, which postdates that return
and which §1.2 correctly sources from Git history. §1.1 now distinguishes the two sources. This is a
consequential sweep the Revision 2 edit should have performed at the same time it named Git history in
§1.2.

**Revision 3 → Revision 4, 2026-08-18, pre-ratification.** Mechanical correction to the preamble, on the
reviewing seat's finding. The sentence "Nothing is relocated, renamed, amended, rebased, or edited" was
overbroad: this instrument amends the commission and Amendment 5 Clause B by its own terms. The sentence is
narrowed to the migration-content authorities, pinned identities, and Commits 1–4 it was written to protect.

No revision changes any authorization, commit population, acceptance condition, gate result, or
implementation surface.
