# Stage 2a header-measurement and precondition work order

**Date:** 2026-07-30 · **Seat commissioning:** Architect · **Producer:** Codex, shell-capable local-disk-reading seat
**Authority:** `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md` §§2.1, 2.2, 4.3; Amendment 1 RATIFIED 2026-07-30
**Scope:** nine deterministic tasks, `H1`–`H9`, including the ratified-precondition chronology proof at
`H8`, filling the corresponding slots at manifest §M0.4.

## 0. Read this first

This work order is closed-world. Every path, commit, and acceptance condition is restated inline. Do not
appeal to chat context, to the earlier deterministic-prerequisites work order, or to any Part A–D draft.

**This is not the derived occurrence-report task.** That task is deliberately not commissioned yet and its
inventory model is being revised. If you find yourself reading the manifest to count date occurrences, stop:
that is a different commission.

### 0.1 This pass writes nothing

**Return every measured value in your response. Do not create a results file.** The previous
prerequisites pass authorized one new path; this one authorizes zero. Specifically:

- create no repository path, including no results file, no scratch file, and no directory;
- stage nothing, commit nothing, push nothing, open no pull request;
- modify no tracked file and no untracked file, including the manifest — this seat inserts the returned
  bytes, not you;
- if you need scratch space, use a path outside the repository working tree entirely.

If any task appears to require a write, it does not. Report the obstacle and stop.

### 0.2 Execution snapshot to measure and report first

| pin | expected |
|---|---|
| Repository | `Project Shrimp` |
| Branch | `codex/decisions-migration` |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| `MIGRATION_BASELINE` | `d499cc1d0916e03830489ec9cd0324cd1a203a73` |
| Tracked worktree clean | yes |
| Index clean | yes |
| Untracked logical paths | `28` |

Report each as measured with a pass/fail disposition. A mismatch on branch, HEAD, or `MIGRATION_BASELINE`
is a hard stop.

### 0.3 The 28-path untracked population

Twenty-seven root-level `DECISIONS-MIGRATION-*.md` files plus one path under
`audit/decisions-migration-2026-07-29/`, for twenty-eight total:

```text
DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-BLOCK-GROUPING-WORKSHEET-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-CANDIDATE-REGIONS-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-ADDENDUM-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-CODEX-HANDOFF-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-GPT-REVIEW-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-CODEX-HANDOFF-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-RECEIPT-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-RESULTS-2026-07-30.md
DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-WORK-ORDER-2026-07-30.md
DECISIONS-MIGRATION-STAGE-2A-GPT-DETERMINISTIC-REVIEW-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-HANDOFF-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-HEADER-MEASUREMENT-WORK-ORDER-2026-07-30.md
DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-MANIFEST-SCAFFOLD-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-BINDING-2026-07-30.md
DECISIONS-MIGRATION-STAGE-2A-P7-DATE-CORRECTION-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-PART-A-ARCHITECT-DRAFT-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-PART-B-ARCHITECT-DRAFT-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-PART-B-GPT-REVIEW-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-PART-C-ARCHITECT-DRAFT-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-PART-C-GPT-REVIEW-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-PATH-CANDIDATE-WORKSHEET-2026-07-29.md
audit/decisions-migration-2026-07-29/target-text-manifest.md
```

**The list above is the authority; reconcile against it, never against arithmetic.** It contains 28 paths
and §0.2 pins 28. This work order is itself one of them, which is why the number moved: the population was
27 immediately before this file was created. Do not attempt to reconcile against the previous pass's 25,
against 26, or against 27 — each was true at a different moment, and none is true now.

**Rendering caveat, not a failure.** `git status --porcelain=v1` collapses a wholly-untracked directory to
its directory path, so the last entry may render as `audit/decisions-migration-2026-07-29/` rather than the
file inside it. Either rendering is acceptable **provided the underlying file set is identical**. Report the
verbatim `git status --porcelain=v1` output and the file set you derived from it; do not fail the pass on
the collapsed form, and do not fail it on this work order's presence.

### 0.4 No-write preservation proof, required

Path-set equality under `git status` is **not** sufficient. It would not detect an untracked file whose
contents were edited during the pass, which is precisely the failure this proof exists to exclude.

**Before any measurement**, derive the individual untracked population with:

```zsh
git ls-files --others --exclude-standard
```

That form lists individual files and does not collapse directories, so it is the authority for the
population; the `git status --porcelain=v1` output of §0.3 is reported alongside it as a cross-check, not as
the basis. For every path returned, record byte length and SHA-256.

**After all measurements**, re-derive the same way and require all three:

1. the path set is identical — no path added, none removed;
2. every path's byte length is unchanged;
3. every path's SHA-256 is unchanged.

Report the pre-run and post-run inventories in full, and state the comparison result per condition. Any
difference is a hard stop and must be reported with the specific paths involved.

**Concurrent-writer condition.** This pass assumes no architect seat or other writer is modifying the
repository while it runs. If any path differs between the two inventories, do not retry, do not re-measure,
and do not attempt to determine who wrote it. Report the difference and stop — a concurrent write
invalidates the pass rather than merely delaying it.

---

## 1. H1–H3 — pre-migration graph identity, from the committed blob

`b5d0027` is the ratified artifact commit. The working-tree copy of this file may have changed and is not
the authority.

Derive all three from the committed blob only:

`git show <full b5d0027>:audit/decisions-reference-graph-hardening-2026-07-29/pre-migration-reference-graph.json`

| slot | measurement |
|---|---|
| H1 | SHA-256 of that blob's exact bytes |
| H2 | the blob's recorded `inputGitSha` |
| H3 | the blob's recorded `generatorGitSha` |

Requirements:

- Resolve `b5d0027` to its full SHA first (that is H5) and use the full SHA in the `git show` argument.
- Stream the blob; do not write it to a repository path.
- Parse H2 and H3 from the blob's JSON, not from the working tree, and not from any receipt or prose that
  restates them. Report the JSON pointer or key path you read each from.
- Additionally report, as a diagnostic and not as an acceptance condition, whether the working-tree copy at
  that path is byte-identical to the blob. If it differs, say so plainly — that is information the architect
  seat needs and it does not by itself fail this pass.
- If the file does not exist at `b5d0027`, that is a hard stop under commission §2.2's
  "SHA or path of the authoritative pre-migration graph cannot be reproduced from disk."

---

## 2. H4–H6 — full commit SHAs

Resolve each abbreviated token from the ratified commission to its unambiguous full commit SHA. Use a
commit-peeling form such as `git rev-parse <token>^{commit}`.

| slot | token | assertion |
|---|---|---|
| H4 | `eb0e02e` | hardened implementation commit; resolves uniquely |
| H5 | `b5d0027` | hardened artifact commit; resolves uniquely |
| H6 | `05f9bcd` | **must equal** `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |

An ambiguous abbreviation is a hard stop, not a best match. H6 inequality is a hard stop.

---

## 3. H7 — `DECISIONS.md` byte-identical to `MIGRATION_BASELINE`

Commission §2.2 makes a nonempty `git diff MIGRATION_BASELINE -- DECISIONS.md` a hard stop on migration
application. Prove emptiness two independent ways:

1. `git diff --quiet d499cc1d0916e03830489ec9cd0324cd1a203a73 -- DECISIONS.md` exits `0`;
2. an independently computed byte-length and SHA-256 equality proof: SHA-256 of the working-tree
   `DECISIONS.md` equals SHA-256 of `git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md`, both
   equal `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`, and both byte lengths equal
   `76314`.

**Use `--quiet`, and do not treat a plain `git diff` exit status as evidence.** Plain `git diff` exits `0`
even when it prints differences; only `--quiet`, which implies `--exit-code`, makes the exit status
meaningful. Reporting "exited zero" from the plain form would be a false proof.

Limb 2 is independent of limb 1 on purpose: it must be computed from bytes, not inferred from limb 1's exit
status. Any inequality in either limb is a hard stop.

---

## 4. H8 — Amendment 4 precondition chronology

**This is the load-bearing task and the reason bulk assembly is paused.**

Commission §2.1 item 2 requires the Amendment 4 text to be applied to the taxonomy, format specification,
and fixture file **and committed on `main` before the migration branch is created**. `git log` per path
shows all three surfaces were last modified by `05f9bcd`, which is also the current branch HEAD. Current
containment alone does not establish the ratified ordering, so prove chronology, not merely membership.

Prove all three limbs independently:

1. **Containment.** `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` is contained in local `main` — for example
   `git merge-base --is-ancestor <commit> main`, corroborated by `git branch --contains <commit>`. Report
   both the exit status and the branch list.
2. **`main` reached it before the branch existed.** From `git reflog show main --date=iso`, report the
   entry at which `main` first reached that commit, with its reflog timestamp.
3. **Branch creation point.** From `git reflog show codex/decisions-migration --date=iso`, report the
   **earliest** entry — the branch-creation record — with its timestamp and the commit it records creation
   from.

Then compare limb 2's timestamp against limb 3's and state the ordering explicitly.

### 4.1 Disposition vocabulary, and the rule about inference

Return exactly one of:

- `PASS` — all three limbs proven and the `main` arrival strictly precedes branch creation.
- `FAIL` — any limb disproven, including an ordering that shows the branch was created before `main`
  reached the commit, or the commit not contained in `main` at all.
- `UNPROVEN` — the evidence needed for a limb does not exist. **Missing, expired, pruned, or truncated
  reflog evidence is `UNPROVEN`, never an inferred `PASS`.** Do not substitute commit timestamps,
  `CommitDate`, topology, or plausibility for reflog evidence. Do not reason that the precondition was
  "presumably" satisfied because the work proceeded.

Report which limbs are proven and which are not, individually, whatever the overall disposition.

### 4.2 What a non-pass means, so you do not act on it

`FAIL` or `UNPROVEN` is a **hard stop on further manifest assembly**. It is not yours to remediate and not
yours to dispose of. Do not rebase, do not re-point `main`, do not create or move any branch, do not amend
history, and do not propose which remediation to take.

The owner may select remediation or an amendment. The owner may **not** waive the existing ratified
precondition by declaration, so do not offer that as an option and do not record the finding in language
that invites it.

---

## 5. H9 — frozen-artifact integrity, path by path

Commission §2.1 item 7 requires the frozen phase-1 artifacts and the pre-migration graph unchanged. Check
this exact six-path population against `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`:

```text
audit/decisions-cleanup-2026-07-24/findings.md
audit/decisions-cleanup-2026-07-24/inventory.md
audit/decisions-cleanup-2026-07-24/migration-table.md
audit/decisions-cleanup-2026-07-24/outline-before-after.md
audit/decisions-cleanup-2026-07-24/reference-graph.json
audit/decisions-reference-graph-hardening-2026-07-29/pre-migration-reference-graph.json
```

The first five are every file under `audit/decisions-cleanup-2026-07-24/`. Independently enumerate that
directory and report any path present on disk or in the commit that is absent from this list — an
unexpected member is itself a finding.

For each path report: path, current working-tree SHA-256, committed SHA-256 at `05f9bcd…`, byte lengths,
and an equality disposition of `IDENTICAL` or `DIFFERS`. Any `DIFFERS` is a hard stop.

Note that the last path is checked here against `05f9bcd` for drift, and separately in H1 against `b5d0027`
for identity. Those are different questions; report both rather than collapsing them.

---

## 6. What to return

In your response, not in a file:

1. the §0.2 execution snapshot as measured, each with pass/fail;
2. verbatim `git status --porcelain=v1` output, the derived file set, and its reconciliation against §0.3;
3. H1–H3 with the blob source and the working-tree diagnostic;
4. H4–H6 with full SHAs and the H6 equality assertion;
5. H7 with both proofs and the byte length;
6. H8 with all three limbs, both timestamps, the ordering statement, and one disposition from §4.1;
7. H9 as a six-row table plus any unexpected directory member;
8. every command run, **verbatim**, so this seat can re-derive rather than trust;
9. the §0.4 pre-run and post-run inventories in full, with the three-condition comparison result, plus a
   closing proof that nothing is staged and no repository path was created;
10. an overall disposition: `GREEN` only if every task passes and H8 returns `PASS`.

A null or zero result discharges feasibility only, never correctness. Report what you ran, not just what you
concluded.

---

## 7. What happens next, so you do not do it

On `GREEN`, this seat inserts the returned values into manifest §M0.4 and resumes bulk assembly at §M4.

**Do not** insert them yourself. **Do not** begin the derived occurrence report — its inventory model is
being revised and it is a separate commission. **Do not** begin assembly, Stage 2b, or any commit.

On `FAIL` or `UNPROVEN` at H8, or a hard stop anywhere else, return the evidence and stop. Assembly stays
paused. A stop is a successful control, not a partial failure — do not make the obvious choice and continue.
