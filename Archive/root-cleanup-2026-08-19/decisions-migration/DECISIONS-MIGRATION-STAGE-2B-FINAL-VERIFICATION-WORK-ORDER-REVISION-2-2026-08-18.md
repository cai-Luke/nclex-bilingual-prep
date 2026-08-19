# Stage 2b Instrument A — deterministic final verification (commission §6, §7.1, §7.2, §7.3 as amended)

**Date:** 2026-08-18 · **Revision:** 2 · **Seat issuing:** Architect · **Executing seat:** Codex
**Status: DRAFT — NOT OWNER-FROZEN, NOT AUTHORIZED, NOT EXECUTABLE.**
**Branch:** `codex/decisions-migration`
**Supersedes:** `DECISIONS-MIGRATION-STAGE-2B-FINAL-VERIFICATION-WORK-ORDER-2026-08-18.md` (Revision 1).

## 0. Identity and immutability

**This order carries no hash slot by design**, for the reason every prior phase order in this migration has
carried none: a hash written into the document it describes cannot describe that document's current bytes,
because writing it changes them. Its authorized identity is measured externally by the owner and recorded
in the owner acknowledgment and the Codex handoff, in the form:

> Stage 2b Instrument A revision 2 is authorized at `<length>` bytes / SHA-256 `<digest>`.

**This file is not edited after that measurement.** If it proves defective mid-execution, stop and return
to the architect seat for a superseding instrument.

**Revision 1 is not edited, moved, or removed.** It remains on disk at its authorized identity, together
with its handoff, as the evidence of the execution that produced Codex's clean stop. Revision 1 is void as
an executable instrument and is superseded here; it is not void as evidence. This revision is a new file
for exactly that reason: rewriting Revision 1 in place would orphan the digest Codex's stop receipt cites.

Revision 1's execution-blocking defect was at §5 alone. Repairing it required consequential operative
alignment at §3 item 7 and §11. **No other section carries an operative change.** This revision also
carries non-operative clarifications at §1, §3 item 4, §10, and §12, which add no requirement. **§9 is
reproduced verbatim.** §12's prohibitions are unchanged in substance, but its wording is not verbatim: it
now states expressly that Revision 1 and its handoff are protected class (b) governance artifacts. Every
remaining section carries Revision 1's requirements unchanged. This section and the §14 revision history
are new. §14 gives the same account in full.

## 1. Authority and scope

| authority | bearing |
|---|---|
| commission §6.1–§6.5 | post-migration reference-graph artifact, target-state assertions, source segregation, expected-delta attribution, determinism |
| commission §7.1 items 1–11 | focused migration checks, rerun complete in the post-graph state |
| commission §7.2 | full repository gate, from the live workflow |
| commission §7.3, as amended by Amendment 5 Clause B | intended-only before each commit; emptiness only after Commit 4 |
| Amendment 5 Clause A | item 13; governance and evidence artifacts are committed, not accepted |
| Amendment 5 Clause C | nothing in this order accepts repository conformance; acceptance is at merge |
| commission §11 | non-goals, unchanged |

This order authorizes **exactly one new repository path**:
`audit/decisions-migration-2026-07-29/post-migration-reference-graph.json`. Both §5 runs write to that one
path; no second repository graph path is created at any point. This order produces no closeout artifact;
its results return to the owner in the execution return and are later reproduced in the §10 receipt under
Instrument C.

It does **not** authorize any commit, stage, push, PR, merge, or Commit 4, and does not authorize the §8.2
constitutional content review, which is Instrument B.

**Instrument B does not run concurrently with this order.** The intended sequence is Instrument A →
architect `ACCEPT` → Instrument B. Instrument B creates a class (b) path (§3 item 4), so a concurrent B
would falsify this order's own §10 residue invariant mid-execution.

## 2. Seat and producer≠checker

Codex is the implementation producer. Codex authors no constitutional wording and makes no migration
disposition. Every value this order requires is measured, not judged; an ambiguity is a stop condition
under §11.

**Codex's own post-run self-checks discharge feasibility only, never correctness.** The architect seat
adjudicates this return cold against live disk.

## 3. Preconditions, verified before any other action

Record each measured value. Do not assert any from this order.

1. Branch is `codex/decisions-migration`.
2. `git rev-parse HEAD` is `345d0d9…` — print the full SHA.
3. The three-commit sequence `5b4d2fd` → `4511821` → `345d0d9` is intact and in order, with no commit
   amended, rebased, squashed, `--reset-author`ed, or `--date`-overridden.
4. `git status --porcelain=v1 --untracked-files=all` — not the default `--porcelain`, and not a
   connector's status summary — returns paths from **exactly two classes and nothing else**:

   **Class (a) — the three implementation residue paths, exactly:**

~~~
 M .github/workflows/promotion-gate.yml
 M package.json
?? scripts/decisions-migration-target-reconcile.ts
~~~

   **Class (b) — post-initial-census item-13 governance and evidence artifacts**: repository-root files
   whose names begin with `DECISIONS-MIGRATION-`, and files under
   `audit/decisions-migration-2026-07-29/`. This class necessarily includes **this order and its handoff,
   and the superseded Revision 1 order and its handoff**, and may include Instruments B and C and their
   handoffs, depending on what the owner has frozen and issued at execution time. Its exact membership is
   therefore not pinned here and **must not be inferred from this order**, and in particular must not be
   inferred from the enumeration recorded during the Revision 1 attempt.

   Enumerate class (b) exactly as observed and report it verbatim. Its presence is expected and is an input
   to Instrument C's supplementary census, **not a defect**. Class (b) paths are not staged, moved, edited,
   or removed by this order.

   **Any path in neither class is a stop.**

5. `audit/decisions-reference-graph-hardening-2026-07-29/pre-migration-reference-graph.json` exists and is
   unchanged; print its byte length and SHA-256.
6. `Archive/DECISIONS-ARCHIVE-2026-07-14.md` is unchanged; the frozen phase-1 artifacts are unchanged.
7. `audit/decisions-migration-2026-07-29/post-migration-reference-graph.json` **does not exist**.

   This precondition is unchanged from Revision 1 and remains a hard precondition. It is evaluated **once,
   here, before Run 1**. An existing path at this check is evidence from a prior attempt: it is a stop,
   returned to the owner intact, and is not replaced, renamed, or moved.

   This order authorizes that path's **creation by Run 1**, and its **single overwrite by Run 2** under §5
   and nowhere else. That overwrite permission is scoped strictly to the Run-1 → Run-2 window inside one
   execution of this order. **It does not generalize**: it does not authorize any other overwrite of that
   path, any overwrite by any other step, any re-run of §5 after §5 has completed, or any relaxation of the
   prohibitions at §9 and §12.

Any divergence is a stop. Do not repair it, move anything, or proceed with it recorded as a note.

## 4. Step 1 — frozen measurement root

`scripts/decisions-reference-graph.ts` states in its own header that it is to be run **only against a
frozen worktree**, and stamps `measurementRootKind: "throwaway_git_worktree"`. Running it against the live
worktree would measure uncommitted bytes and is prohibited.

Create a throwaway worktree at the Commit-3 tree, **outside the repository directory**, so that no
untracked path appears in the repository status:

~~~bash
git worktree add --detach /tmp/shrimp-postmig-<timestamp> <full SHA of 345d0d9>
~~~

`git worktree add` and `git worktree remove` are authorized by this order for this purpose only. Nothing is
written into the throwaway root. Remove it and run `git worktree prune` at §8.

## 5. Step 2 — graph generation and two-run determinism (§6.1, §6.5)

**Constraint that governs this section.** The live generator resolves a relative `--out` against the
generator checkout and rejects any output outside it (`OUTPUT_OUTSIDE_GENERATOR_CHECKOUT`), rejects any
output inside the measurement root (`OUTPUT_INSIDE_MEASUREMENT_ROOT`), and rejects the frozen phase-1
output path. Both runs therefore write **inside the live repository**, to the single authorized path. See
§14.

Run the generator twice against the same frozen measurement root, invoked from the live repository, in this
exact sequence. Do not reorder, and do not collapse any step.

1. **Run 1.** Generate directly to the authorized repository path:

~~~bash
npx tsx scripts/decisions-reference-graph.ts \
  --root /tmp/shrimp-postmig-<timestamp> \
  --out audit/decisions-migration-2026-07-29/post-migration-reference-graph.json
~~~

2. **Record Run 1's raw SHA-256 immediately**, from the repository artifact as written by Run 1, before
   anything else touches it.

3. **Preserve Run 1's bytes outside the repository.** Copy the Run-1 repository artifact to an external
   temporary path, e.g. `/tmp/shrimp-postmig-run1.json`. This copy is **comparison evidence only**. It is
   not a repository output, is never staged, and is never copied back into the repository.

4. **Prove the copy faithful before Run 2 destroys its original.** Run `cmp` between the external copy and
   the Run-1 repository artifact and record the result. The copy is the only surviving witness to Run 1
   once Run 2 executes, so an unproven copy is an unusable comparison basis. **A non-zero `cmp` exit, or
   any failure to run `cmp`, is a stop.** Do not proceed to Run 2 until this proof is recorded.

5. **Run 2.** Generate again, against the same frozen measurement root, to the same authorized repository
   path. This overwrite of the Run-1 instance at that path is expressly authorized by §3 item 7 **solely
   for this determinism test**, and only here.

6. **Record Run 2's raw SHA-256** from the final retained repository artifact.

7. **Compare** the preserved Run-1 external copy against the retained Run-2 repository artifact after
   normalizing **only** `generatedAt`. They must be byte-identical. Record the normalized SHA-256 of each,
   alongside the two raw digests already recorded. Any difference in any other field — including
   `inputGitSha`, `generatorGitSha`, `generatorSha256`, `inputs`, or any count — is a stop, reported field
   by field.

8. The external Run-1 copy may be removed after the comparison is recorded. Report its path and whether it
   was removed, either way.

**The retained artifact is Run 2's direct generator output at the commissioned path.** It is never created,
completed, or repaired by copying anything into place. A run to an external path followed by a copy into
the repository is **not** authorized and does not satisfy §6.1.

**Only one repository path is created by this section**, and both runs write to it. Creating a second
repository graph path — scratch, transient, or otherwise — is not authorized (§12).

Do not overwrite either pre-migration graph (§6.1). The permission granted in this section attaches to the
Run-1 instance of the retained post-migration artifact and to nothing else.

Confirm from the retained artifact that `inputGitSha` equals the full Commit-3 SHA and that `formatMode` is
`target`.

## 6. Step 3 — required assertions and reconciliation (§6.2, §6.3, §6.4)

**§6.2.** Verify each of the eleven target-state assertions individually against the retained artifact and
report each with its measured evidence, not as a pooled pass. This includes the two the commission
expressly does not assume: corpus-wide derived-identifier records, where the hardened pre-migration
population of 7 is expected to persist unless individually attributed; and corpus-wide links into target
`DECISIONS.md` entry anchors, which are reported and triaged because target-mode anchor detection becomes
active for the first time.

**§6.3.** Produce the three source populations — live governance corpus; preservation snapshot (all records
whose `from` equals `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md`); other Archive corpus — derived from
existing per-record `from` and per-source `inputs` data. **Do not change generator scope to manufacture
these groups.** Live-corpus citations to retired identifiers are legitimate records and stay in the
live-corpus report.

**§6.4.** Compare the retained artifact with the hardened pre-migration artifact by source and target
identity. The five expected transitions are enumerated at commission §6.4. **Every other reference change
requires individual attribution.** "Counts changed because the format changed" is not an attribution, and
is a stop if it is the only available account of a delta.

## 7. Step 4 — §7.1 items 1–11, complete rerun

Rerun all eleven in the post-graph state. Items 1–4 were run by the prior execution; they are rerun here,
not inherited.

1. `npm run test:decisions-format` — exit 0.
2. `npm run conform:decisions` — exit **0**, **zero** findings. A non-zero exit here is a stop: it means a
   tracked-path obstacle exists that the post-Commit-3 result did not predict.
3. `npm run reconcile:decisions-migration` — exit 0 at its historical 65/14/1 mapping.
4. `npm run reconcile:decisions-migration-target` — exit 0 at the exact target 65/13/1/1 accounting.
5. `npx tsx scripts/tests/decisions-reference-graph.ts` — exit 0.
6. two-run post-migration graph determinism — the §5 hashes, raw and normalized, together with the §5
   step 4 `cmp` result.
7. snapshot SHA equality.
8. 13/13 archive wrapper-index bijection.
9. retired-register / live-ID conflict check — zero.
10. tracked `Evidence`/`Owner` path check — zero findings.
11. **manifest/output exact equality check.** Report this one distinctly and prominently: Instrument B's
    disposition is conditioned on it. Verify first that the ratified manifest is still `332579` bytes /
    SHA-256 `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2`; a mismatch means the
    ratified authority is no longer what was ratified, and is a stop.

## 8. Step 5 — §7.2 full repository gate

**Read the live `.github/workflows/promotion-gate.yml` at execution time and run every step it contains.**
That file is the source of truth.

As observed by the architect seat on 2026-08-18 it carries `npm ci`, `npm run test-visuals`,
`npm run audit`, `npm run test:validate-sweep`, `npm run test:non-mcq-bias`, `npm run test:schema-bank`,
the three structured-measurement steps, `npm run test:coverage-report`, `npm run census:check`, and the
wired `npm run test:decisions-format` + `npm run conform:decisions` pair. **That list is orientation only
and is not the authority.** If the live file differs, the live file governs and the difference is reported.

Report any pre-existing advisory separately. **No failure is waived because it appears unrelated to the
migration.**

Then remove the throwaway worktree and run `git worktree prune`.

## 9. Gate-artifact hygiene — two distinct cases

These are not the same case and must not be handled the same way.

1. **Newly created untracked or ignored scratch output that is not an authorized migration output** — move
   it out of the worktree with `mv`, to a location outside the repository, and report what was moved and to
   where. `git clean` is prohibited by commission §7 and the migration's artifacts exist on no remote.
2. **A gate step mutating a tracked path outside the intended Commit-4 working set** — this is a **stop**.
   Report the path and the diff. **Do not move the tracked file away, do not `git checkout` or
   `git restore` it, and do not revert it.** Moving or reverting a tracked mutation conceals the fact that
   a gate step wrote to a governed surface, which is precisely the fact that must be surfaced.

The post-migration reference graph is an **authorized retained output**, not scratch. It is not moved.
Class (b) governance artifacts under §3 item 4 are not scratch. They are not moved.

## 10. Step 6 — expected residue

After §8, `git status --porcelain=v1 --untracked-files=all` must return **exactly** the §3 item 4 classes
plus one new path, and nothing else:

- class (a), unchanged:

~~~
 M .github/workflows/promotion-gate.yml
 M package.json
?? scripts/decisions-migration-target-reconcile.ts
~~~

- class (b), **path-for-path identical to the enumeration recorded at §3** — no addition and no removal;
- and:

~~~
?? audit/decisions-migration-2026-07-29/post-migration-reference-graph.json
~~~

Derive the residue mechanically as the pre-execution working set plus the single authorized new path, and
compare path-for-path. The two §5 runs do not change this expectation: they write to one path, and that
path appears here once. Any divergence is a stop requiring return to the owner, not a note. A count carried
forward from any earlier session — including the Revision 1 attempt — is not evidence.

## 11. Stop conditions

Any of the following stops execution immediately, with nothing further changed and both the expected and
the measured values returned: identity mismatch at §0; any precondition divergence at §3, **including the
retained graph path already existing at the §3 item 7 check, before Run 1**, and including a path in
neither class; failure of the §5 step 4 `cmp` fidelity proof, or proceeding to Run 2 without it; any
non-`generatedAt` difference between the two runs; any failed §6.2 assertion; any §6.4 delta lacking
individual attribution; any non-zero exit in §7.1 or §7.2 not already characterized as a reported
pre-existing advisory; any tracked-path mutation under §9 case 2; any residue divergence at §10.

**A stop is a successful control outcome.** Do not improvise past one, do not choose the reading that
protects the schedule, and do not record a mismatch as a note and proceed. Revision 1's execution
demonstrates the standard: a correct stop with zero repository residue is the outcome this order wants when
a requirement cannot be met as written.

## 12. Not authorized

- Any commit, stage, push, PR, merge, or any part of Commit 4.
- Any edit to `DECISIONS.md`, either `Archive/` file, the ratified manifest, `lib/decisions-format.ts`,
  `scripts/tests/decisions-format.ts`, `scripts/decisions-migration-target-reconcile.ts`, `package.json`,
  or `.github/workflows/promotion-gate.yml`.
- Any edit to any class (b) governance artifact, including any frozen order and including repair of a stale
  banner or a recorded read hazard. This expressly includes Revision 1 and its handoff.
- Any change to generator scope, the format reason-code vocabulary, or the historical semantics or pinned
  counts of `scripts/decisions-migration-reconcile.ts`.
- Overwriting either pre-migration graph.
- `git clean`, `git reset --hard`, `git checkout` or `git restore` of any governed path, `git add -A`,
  `git add .`.
- Creating any repository path other than the single §6.1 artifact.
- Performing or anticipating the §8.2 constitutional content review.
- Binding or rebinding `MIGRATION_DATE`.
- Treating any result in this order as acceptance of repository conformance. Amendment 5 Clause C fixes
  acceptance at merge.

## 13. Return

One execution return to the owner containing: every measured precondition, including the verbatim class (b)
enumeration; the §5 sequence in order, with both raw digests, the `cmp` fidelity result, and both
normalized digests; the eleven §6.2 assertion results with evidence; the three §6.3 populations; the §6.4
delta table with per-delta attribution; §7.1 items 1–11 with exit codes, item 11 called out distinctly; the
live §7.2 step list actually read and each step's result; every advisory, separately; everything moved
under §9 case 1 and where to; the disposition of the external Run-1 copy; and the §10 residue.

## 14. Revision history

**Revision 1 → Revision 2 (2026-08-18). Forcing incident: work-order defect at §5, detected at execution.**

Revision 1 §5 required Run 1 to write to a path outside the repository, e.g. `/tmp/shrimp-postmig-run1.json`.
The live generator forbids this. `scripts/decisions-reference-graph.ts` resolves `--out` against the
generator checkout and raises `OUTPUT_OUTSIDE_GENERATOR_CHECKOUT` for any output outside it. Revision 1 §5
was therefore unexecutable as written.

Codex executed Revision 1, passed every §3 precondition, and stopped at Run 1 with:

~~~
Error: OUTPUT_OUTSIDE_GENERATOR_CHECKOUT: /tmp/shrimp-postmig-run1-20260818174835.json
~~~

Run 2, the determinism checks, the §6 assertions, the §7 gates, and the §10 residue verification were not
executed. The throwaway worktree was removed and pruned. **No repository file was created, staged, or
committed: zero repository residue.** The stop is adjudicated a correct control outcome and is recorded
here as such.

**Architect adjudication.** The defect is in the work order. No migration defect and no generator defect is
implicated; the generator's three output guards are working as designed, and Revision 1 §5 was written
without reading them. The architect seat records this as an instance of a standing error pattern: asserting
what a command will do without first reading the code that command runs.

**Repair carried in this revision.** Both determinism runs write to the one already-authorized repository
path. Run 1 creates it; Run 1's bytes are hashed and preserved to an external copy, and that copy is proven
byte-identical with `cmp` before Run 2; Run 2 overwrites the Run-1 instance at that same path and is the
retained artifact, generator-produced in place and never copied into place. This creates no second
repository path, so §1's one-path authorization, §10's expected residue, and §12's prohibition on creating
any other repository path are all unchanged and remain literally true.

**Operative changes — three sections.** §5, rewritten; this was the execution-blocking defect. §3 item 7,
where the absence precondition is retained and its scope made explicit and a single, non-generalizing Run-2
overwrite permission is added. §11, where the stop conditions are aligned with the amended §3 item 7 and
the new `cmp` proof. §3 item 7 and §11 change only because §5's repair requires it.

**New sections.** §0 (revision identity, supersession, preservation of Revision 1) and §14 (this section).

**Non-operative clarifications, adding no requirement.** §1, §3 item 4, §10, and §12.

**§9 is reproduced verbatim.** Its rule that the retained graph is not moved holds, because nothing in this
revision moves it.

**§12's prohibitions are unchanged in substance, but §12 is not reproduced verbatim.** It now states
expressly that Revision 1 and its handoff are protected class (b) governance artifacts. Its prohibition on
overwriting either **pre-migration** graph is untouched by a permission that attaches only to the
post-migration artifact.

**Not carried forward:** the class (b) enumeration recorded during the Revision 1 attempt. Class (b)
membership is measured fresh at §3 item 4 and now includes this revision.
