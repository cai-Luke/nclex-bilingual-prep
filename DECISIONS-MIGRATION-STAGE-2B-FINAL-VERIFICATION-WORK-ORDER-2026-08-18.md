# Stage 2b Instrument A — deterministic final verification (commission §6, §7.1, §7.2, §7.3 as amended)

**Date:** 2026-08-18 · **Revision:** 1 · **Seat issuing:** Architect · **Executing seat:** Codex
**Status: DRAFT — NOT OWNER-FROZEN, NOT AUTHORIZED, NOT EXECUTABLE.**
**Branch:** `codex/decisions-migration`

## 0. Identity and immutability

**This order carries no hash slot by design**, for the reason every prior phase order in this migration has
carried none: a hash written into the document it describes cannot describe that document's current bytes,
because writing it changes them. Its authorized identity is measured externally by the owner and recorded
in the owner acknowledgment and the Codex handoff, in the form:

> Stage 2b Instrument A revision 1 is authorized at `<length>` bytes / SHA-256 `<digest>`.

**This file is not edited after that measurement.** If it proves defective mid-execution, stop and return
to the architect seat for a superseding instrument.

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
`audit/decisions-migration-2026-07-29/post-migration-reference-graph.json`. It produces no closeout
artifact; its results return to the owner in the execution return and are later reproduced in the §10
receipt under Instrument C.

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
   `audit/decisions-migration-2026-07-29/`. This class necessarily includes **this order and its handoff**,
   and may include Instruments B and C and their handoffs, depending on what the owner has frozen and
   issued at execution time. Its exact membership is therefore not pinned here and **must not be inferred
   from this order**.

   Enumerate class (b) exactly as observed and report it verbatim. Its presence is expected and is an input
   to Instrument C's supplementary census, **not a defect**. Class (b) paths are not staged, moved, edited,
   or removed by this order.

   **Any path in neither class is a stop.**

5. `audit/decisions-reference-graph-hardening-2026-07-29/pre-migration-reference-graph.json` exists and is
   unchanged; print its byte length and SHA-256.
6. `Archive/DECISIONS-ARCHIVE-2026-07-14.md` is unchanged; the frozen phase-1 artifacts are unchanged.
7. `audit/decisions-migration-2026-07-29/post-migration-reference-graph.json` **does not exist**. This
   order authorizes that path's creation, never its overwrite. An existing path is evidence from a prior
   attempt: it is a stop, returned to the owner intact, and is not replaced, renamed, or moved.

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

Run the generator twice against the same frozen root, invoked from the live repository:

- **Run 1** writes to a path outside the repository, e.g. `/tmp/shrimp-postmig-run1.json`.
- **Run 2** writes to the commission path
  `audit/decisions-migration-2026-07-29/post-migration-reference-graph.json`.

Two runs to two outside paths followed by a copy is **not** authorized: it would create the retained
artifact by copy rather than by generation. Run 2 generates the retained artifact directly.

Do not overwrite either pre-migration graph (§6.1), and do not overwrite the retained artifact: its absence
was verified at §3 item 7, and Run 2 creates it.

Compare the two outputs after normalizing **only** `generatedAt`. They must be byte-identical. Record both
SHA-256 digests of the normalized forms and both digests of the raw forms. Any difference in any other
field — including `inputGitSha`, `generatorGitSha`, `generatorSha256`, `inputs`, or any count — is a stop,
reported field by field.

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
6. two-run post-migration graph determinism — the §5 hashes.
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
compare path-for-path. Any divergence is a stop requiring return to the owner, not a note. A count carried
forward from any earlier session is not evidence.

## 11. Stop conditions

Any of the following stops execution immediately, with nothing further changed and both the expected and
the measured values returned: identity mismatch at §0; any precondition divergence at §3, including a path
in neither class; any non-`generatedAt` difference between the two runs; any failed §6.2 assertion; any
§6.4 delta lacking individual attribution; any non-zero exit in §7.1 or §7.2 not already characterized as a
reported pre-existing advisory; any tracked-path mutation under §9 case 2; any residue divergence at §10.

**A stop is a successful control outcome.** Do not improvise past one, do not choose the reading that
protects the schedule, and do not record a mismatch as a note and proceed.

## 12. Not authorized

- Any commit, stage, push, PR, merge, or any part of Commit 4.
- Any edit to `DECISIONS.md`, either `Archive/` file, the ratified manifest, `lib/decisions-format.ts`,
  `scripts/tests/decisions-format.ts`, `scripts/decisions-migration-target-reconcile.ts`, `package.json`,
  or `.github/workflows/promotion-gate.yml`.
- Any edit to any class (b) governance artifact, including any frozen order and including repair of a stale
  banner or a recorded read hazard.
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
enumeration; both determinism digests, raw and normalized; the eleven §6.2 assertion results with evidence;
the three §6.3 populations; the §6.4 delta table with per-delta attribution; §7.1 items 1–11 with exit
codes, item 11 called out distinctly; the live §7.2 step list actually read and each step's result; every
advisory, separately; everything moved under §9 case 1 and where to; and the §10 residue.
