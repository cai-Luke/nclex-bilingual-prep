# Stage 2b Instrument D — closeout-evidence repair and Commit 5

**Date:** 2026-08-18 · **Revision:** 1 · **Seat issuing:** Architect · **Executing seat:** Codex
**Status: DRAFT — NOT OWNER-FROZEN, NOT AUTHORIZED, NOT EXECUTABLE.**
**Branch:** `codex/decisions-migration`

## 0. Identity and immutability

No hash slot, by design, as in Instruments A, B, and C. The authorized identity is measured externally by
the owner and recorded in the owner acknowledgment and the Codex handoff, in the form:

> Stage 2b Instrument D revision 1 is authorized at `<length>` bytes / SHA-256 `<digest>`.

**This file is not edited after that measurement.** If it proves defective mid-execution, stop and return
to the architect seat for a superseding instrument.

## 1. Authority and gate on entry

This order executes Amendment 6 Clause A. It does not begin until Amendment 6 is owner-ratified and that
ratification exists on disk as a separate record.

Authority: commission §10; Amendment 5 Clause A item 13; Amendment 6 Clauses A and B. Amendment 5 Clause C
is untouched — nothing here accepts repository conformance.

**Scope.** This order repairs the evidence carriage of `MIGRATION-RECEIPT.md` and commits that repair
together with the governance instruments authorizing it. It reopens nothing. The migration, Stage 2a, the
65 statements, Instruments A, B, and C, and their dispositions are closed.

## 2. The census/receipt ordering

Resolved path-wise, exactly as Instrument C §2 resolved it, in this fixed order:

1. Make the §5 receipt insertions.
2. Confirm every post-Commit-4 governance path intended for Commit 5 already exists — including this order
   and its own handoff.
3. Run the supplementary item-13 census and obtain owner ratification.
4. Append that census and the ratification verbatim to the receipt.
5. Create no new item-13 path after that point.
6. Stage only after the receipt contains the ratification.

`MIGRATION-RECEIPT.md` is already enumerated in the Instrument C ratified census and already tracked.
Editing it creates no new path and requires no supplement. The Commit-5 staged population is therefore the
newly ratified census **plus** `MIGRATION-RECEIPT.md`, and nothing else.

## 3. Preconditions

Record each measured value. Do not assert any from this order.

1. Branch is `codex/decisions-migration`; print the full `git rev-parse HEAD`.
2. HEAD is `32388990417222891730cd24113df12fdc779b15`.
3. The four-commit ancestry is `5b4d2fd8c76d1af94400322882d7a7c709704ed6` →
   `4511821448d7f0d643164be83009fc8013ed8977` → `345d0d9b72cd97b5f72bde29cd7822e96c94e8b7` →
   `32388990417222891730cd24113df12fdc779b15`, intact and in order, with no commit amended, rebased,
   squashed, `--reset-author`ed, or `--date`-overridden.
4. `git status --porcelain=v1 --untracked-files=all` — not the default `--porcelain`, and not a connector's
   status summary — returns **only** untracked repository-root governance paths for the Amendment 6
   ratification cycle and this repair: Amendment 6, its ratification record, this order, and this order's
   handoff. Enumerate them verbatim. **Any tracked modification, any staged path, or any path outside that
   class is a stop.**
5. `audit/decisions-migration-2026-07-29/MIGRATION-RECEIPT.md` is tracked and unmodified.

Any divergence is a stop. Do not repair it, move anything, or proceed with it recorded as a note.

## 4. Transcription rule

Every historical value in §5 is transcribed from the preserved Instrument A Revision 2 execution return, at
its recorded value, except Commit 4's identity, which is transcribed from Git history. Nothing in §5 is
re-run, regenerated, re-measured, reconstructed, inferred, or supplied from memory. Codex measures only its
own current execution state, as §3, §7, §8, and §9 require.

If any value in §5 cannot be transcribed as written, that is a stop, not an occasion to reconstruct it.

## 5. Step 1 — the five receipt insertions

Edit `audit/decisions-migration-2026-07-29/MIGRATION-RECEIPT.md` only. Make these five insertions and no
other change. Do not reformat, reorder, or re-word any existing content, and do not alter any finding,
disposition, or gate result.

### 5.1 Determinism

In **Determinism and focused gates**, replace only the sentence beginning "The exact Run-1 and Run-2 raw
and normalized digests are part of the Instrument A execution return" with the recorded values:

- Run 1 raw SHA-256: `2d65ec79cacf35f960488e4e8c72829bf93e692f2833197214d39925f62053b7`
- External Run-1 copy: `/tmp/shrimp-postmig-run1-20260818191919.json`; `cmp` fidelity proof exit `0`;
  copy removed: yes
- Run 2 raw SHA-256: `83d2af3b508eb6b83252f695e0df3295e55ab7388f0e5ad44534fa3972c46b1d`, identical to the
  retained-artifact identity already recorded in this receipt
- Normalized Run 1 SHA-256: `9adc5aaf073dcee0350675fa07e9b07c54949ff2b506969170e47430cc4d5c57`
- Normalized Run 2 SHA-256: `9adc5aaf073dcee0350675fa07e9b07c54949ff2b506969170e47430cc4d5c57`
- Non-`generatedAt` differences: `0`

The surrounding sentences about the shared measurement root and about Instrument C performing no new graph
generation are retained unchanged.

### 5.2 Full gate, per step

In **Full repository gate**, replace the prose step enumeration with the live workflow's actual step
structure, as read at Instrument A execution and reconfirmed against
`.github/workflows/promotion-gate.yml`: **twelve steps — two CI-only action steps and ten `run` steps
carrying thirteen commands.**

Record the two action steps, `actions/checkout@v4` and `actions/setup-node@v4`, as read and **not locally
invoked**.

Record each `run` step by its workflow `name`, its command or commands, and its result, all exit `0`:

| # | step name | command(s) | result |
|---:|---|---|---|
| 1 | Install dependencies | `npm ci` | exit 0 |
| 2 | Test visuals | `npm run test-visuals` | exit 0 |
| 3 | Run promotion gate | `npm run audit` | exit 0 |
| 4 | Test sweep validator | `npm run test:validate-sweep` | exit 0 |
| 5 | Test non-MCQ bias audit and Layer B handoff | `npm run test:non-mcq-bias` | exit 0 |
| 6 | Test bank schema invariants | `npm run test:schema-bank` | exit 0 |
| 7 | Test structured-measurement staging and application | `npm run test:flowsheet-gate`; `npm run test:structured-measurements`; `npm run test:structured-measurements-applicator` | each exit 0 |
| 8 | Test coverage targeting | `npm run test:coverage-report` | exit 0 |
| 9 | Check census drift | `npm run census:check` | exit 0 |
| 10 | Test DECISIONS format and repository conformance | `npm run test:decisions-format`; `npm run conform:decisions` | each exit 0 |

The existing sentence recording that the live `npm run audit` was separately observed as passing during
Instrument C's own checkout is retained, and is labelled as an Instrument C observation per §5.3.

### 5.3 Advisories, with provenance

Replace the advisory paragraph so that the four advisories Instrument A returned are attributed to
Instrument A and recorded separately, and any Instrument C observation is attributed to Instrument C.

Instrument A Revision 2 advisories, all of which did not affect acceptance:

1. `npm ci` — 7 npm audit vulnerabilities: 1 low, 2 moderate, 4 high.
2. `npm run audit` — 451 existing `revealsAllStages` advisory findings across 13 bank files; the gate still
   exited `0`.
3. Target reconciliation emitted its documented Amendment 3 `[SCOPE]` notice.
4. An initial non-authoritative snapshot probe used the invalid symbolic ref `MIGRATION_BASELINE` and
   failed; the formal check was rerun against the pinned full SHA and passed.

Instrument C observation, recorded as such: the audit output reported the draft-integrity lane as having no
draft files to verify and one not-yet-promoted item.

Advisory 4 is recorded because a check that failed for a methodological reason and was correctly redone is
part of the execution record. It is not restated as a defect and does not alter any disposition.

### 5.4 Commit 4 identity

In **Governing identity and commit sequence**, replace the Commit-4 bullet's closing clause "its final
identity is returned in the post-commit execution record" with the identity from Git history:
`32388990417222891730cd24113df12fdc779b15`.

Add one sentence recording that Commit 5, the closeout-evidence repair commit authorized by Amendment 6
Clause A, carries this repair, and that per Clause A its own identity is not recorded inside itself and is
durably held by Git.

### 5.5 Instrument B conditioning

In **Independent review dispositions**, add to the Instrument B bullet that Instrument B's entry was
conditioned on, and taken after, the Instrument A §7.1 item 11 manifest/output exact-equality **PASS**
already recorded in this receipt — the ratified manifest verified at 332,579 bytes / SHA-256
`818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2`, with both directions passing for all 65
live blocks.

## 6. Step 2 — completeness check, before the census

Confirm on disk that every intended post-Commit-4 governance artifact already exists: Amendment 6, its
owner-ratification record, this order, and this order's handoff.

If any intended artifact does not yet exist, **stop before taking the census.**

## 7. Step 3 — supplementary census and owner ratification

Run exactly:

~~~bash
git status --porcelain=v1 --untracked-files=all
~~~

From that output enumerate **only** the new item-13 population: repository-root files whose names begin with
`DECISIONS-MIGRATION-` or which are ratified amendments to the commission, plus any file under
`audit/decisions-migration-2026-07-29/`. `MIGRATION-RECEIPT.md` appears as a tracked modification, not a new
path; it is not enumerated in this census and is separately authorized under §2.

Return the exact enumeration to the owner for ratification as a separate act, then **stop**. The census is
mechanical and delegable; the ratification of it is not. A path matching item 13's description but absent
from the ratified census is not authorized, and its appearance in the staged set is a stop.

Item 13 authorizes commit, not acceptance. Every artifact retains the status it already holds. No artifact
is moved, renamed, edited, or reformatted to qualify.

## 8. Step 4 — append, then freeze the population

Append the exact ratified census and the owner's ratification act, with its date, verbatim to the receipt.
Per §2 this is an edit to an already-enumerated path and requires no further supplement.

**From this point no new item-13 path is created.** If one becomes necessary, stop and return to the owner.

## 9. Step 5 — Commit 5, once

Stage exactly the ratified census paths plus `audit/decisions-migration-2026-07-29/MIGRATION-RECEIPT.md`,
and nothing else. `git add -A` and `git add .` are prohibited.

Verify the staged set path-for-path against that list before committing. Any path staged that is not on it,
or any path on it that is not staged, is a stop. Record the staged diff statistics.

Commit once, with message:

~~~
chore: complete decisions migration closeout receipt evidence
~~~

## 10. Step 6 — post-commit verification

1. `git status --porcelain=v1 --untracked-files=all` must now be **empty**, per Amendment 6 Clause B.
   Any residue is a stop.
2. Print Commit 5's full SHA in the execution return. Do not write it into the receipt.
3. Confirm the five-commit sequence is intact and in order, and that Commits 1–4 retain the exact SHAs
   recorded at §3, with no commit amended, rebased, squashed, `--reset-author`ed, or `--date`-overridden.
4. Commit-3 author-date recheck, the Amendment 1 Clause B predicate:

~~~bash
TZ=America/New_York git log -1 --format='%ad' --date=format-local:'%Y-%m-%d' 345d0d9b72cd97b5f72bde29cd7822e96c94e8b7
~~~

   Must equal `2026-08-18`. Any other value is a stop returned to the owner, who alone may rebind.

## 11. Stop, and what happens next

**Stop here.** No `git push`, no pull request, no merge, no Commit 6. Return the full execution record to
the owner.

Merge remains the Amendment 5 Clause C acceptance act and is an owner act. **Nothing in this order accepts
repository conformance.**

## 12. Not authorized

- `git push`, opening a pull request, merging, or any commit beyond Commit 5.
- Amending, rebasing, squashing, or rewriting any of Commits 1–4.
- Any edit to `DECISIONS.md`, either `Archive/` file, the ratified manifest, the retained graph artifact,
  `lib/decisions-format.ts`, `scripts/decisions-format-conform.ts`, `scripts/tests/decisions-format.ts`,
  `scripts/decisions-migration-target-reconcile.ts`, `package.json`, `.github/workflows/promotion-gate.yml`,
  `PROJECT-HISTORY.md`, or any frozen order — including to repair a stale banner or recorded read hazard.
- Re-running Instrument A, Stage 2a, the content review, the determinism runs, or any migration gate.
- Regenerating or overwriting the post-migration reference graph.
- Any edit to `MIGRATION-RECEIPT.md` beyond the five insertions at §5 and the append at §8.
- Recording Commit 5's own SHA inside the receipt.
- Creating any item-13 path after the census.
- Binding or rebinding `MIGRATION_DATE`.
- `git clean`, `git reset --hard`, `git checkout` or `git restore` of a governed path, `git add -A`,
  `git add .`.

## 13. Return

One execution return to the owner containing: every measured precondition including the verbatim §3 item 4
enumeration; confirmation of each of the five §5 insertions; the §6 completeness result; the exact census
returned and the ratification received; the staged set verified path-for-path with diff statistics;
Commit 5's full SHA; the §10 cleanliness, ancestry, and author-date results; and any stop.
