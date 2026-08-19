# Stage 2a — post-assembly deterministic verification — CODEX WORK ORDER

**Date:** 2026-08-07 · **Issuing seat:** Architect (Claude) · **Executing seat:** Codex · **Revision:** 4

**Class: deterministic verification. No judgment, no assignment, no repair, no assembly.** Codex re-measures the completed manifest's `M0.4` header pins against live repository state and re-confirms whole-file mechanical integrity at the final identity. Codex assigns no disposition beyond the mechanical pass/fail of each named check, drafts no wording, repairs nothing, edits no byte of the manifest, and stages, commits, pushes, stashes, resets, checks out, and cleans nothing. This order does not ratify Stage 2a, authorize Stage 2b, or authorize any edit to `DECISIONS.md` or to the manifest.

---

## 0. Position in sequence, and what this order does not reopen

This is item 3 of the resume note's formal ratification gate: M4/M5/M6 complete (item 1); the derived date-occurrence report generated, mapped, validated, embedded, and re-derived (item 2, `M7.5` closed `ACCEPT` 2026-08-07); **Codex's post-assembly deterministic verification (item 3, this order)**; the non-author full constitutional-content review (item 4, already discharged); Luke's exact-byte ratification (item 5).

**The governing obligation is `M0.4` alone.** `M0.4` records nine measurements (`H1`–`H9`) as Codex's own deterministic output, pinned into the manifest on 2026-07-30. The manifest has since changed substantially — `M6` was authored and repaired, `M4` records were repaired, `M4.35` was corrected, and the derived report was generated and inserted. Nothing has re-confirmed `H1`–`H9` against live repository state since. That re-confirmation, plus a final whole-file integrity re-measurement at the manifest's now-final identity, is the entire scope of this order.

**Three things this order explicitly does not do, each because the work is already closed elsewhere:**

- **It does not reproduce the thirteen archive-wrapper source slices or the `E038` preservation slice.** The manifest does not contain future wrapper-body bytes to verify against a baseline; `M5.5` records baseline source-span/length/hash construction pins, and reproducing them is a content-review act. Commission §4.9's source-slice reproduction was already executed independently: `FRESH-FULL-REVIEW-TRANCHE-E-2026-08-07.md` reproduced all 13 baseline wrapper slices — "every source slice length and hash above matched the baseline bytes exactly" — and separately recomputed the `E038` preservation slice at `[52641,53203)`, `562` bytes / `d5603bebbc00308c04f938279960c2873a849ae1c622419a7095c0bf3789c3cf`. `Tranche E` result: `PASS — 13/13 wrappers CLEAR`. Not reopened here.
- **It does not run `lib/decisions-format.ts` over the manifest.** That parser's exported functions default their `source` parameter to `"DECISIONS.md"` or `"archive.md"`; it parses target output, not the architect manifest, and has no fence-aware handling of a document that carries literal target bytes inside markdown fences alongside its own prose and tables. Requiring the manifest itself to "parse under" that grammar has no defined total pass condition, and any hand-built substitute risks smuggling judgment into a deterministic order. `M7.5` step 6 already proves the terminal report was appended exactly and the pre-report candidate was preserved byte-for-byte; that discharges what an insertion-correctness check over this file could prove. Not invented here.
- **It does not investigate the 65/13/80-row classification reconciliation.** `FRESH-FULL-REVIEW-DISPOSITION-2026-08-07.md` §F7, "exact 80-row reconciliation — PASS," states the accounting directly: `65 live M4 records + 13 M5.5 wrappers + structural E053 + merge-only E037 = 80`. The resume note's "78 units" is the same population under a different count — 65 individually reviewed live records plus 13 wrappers, without `E053` and `E037`, which `F7` counts as structural additions rather than individually-reviewed units. No gap exists. Not investigated here.

If any check below reveals that a supposedly-discharged item is not, in fact, covered by any existing receipt, report that as a finding rather than resolving it. This order does not authorize Codex to perform a semantic review it discovers is missing; it authorizes Codex to say so.

---

## 1. Frozen identities

| item | value |
|---|---|
| Repository | `Project Shrimp` |
| Branch | `codex/decisions-migration` |
| Branch HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| `MIGRATION_BASELINE` | `d499cc1d0916e03830489ec9cd0324cd1a203a73` |
| Completed manifest | `audit/decisions-migration-2026-07-29/target-text-manifest.md` |
| Completed manifest byte length / SHA-256 | `332579` / `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` |
| `DECISIONS.md` byte length / SHA-256 | `76314` / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` |
| Step-6 verification receipt | `audit/decisions-migration-2026-07-29/DERIVED-REPORT-STEP-6-VERIFICATION-2026-08-07.md`, `15729` / `818c7226dc2d6c8a1d85ee24de4e3b7c978a59d066685ca9189358ea127ea654` |

Measure the completed manifest and `DECISIONS.md` at opening and again at closeout. Any mismatch against this table is a **BLOCKER**; do not measure against an approximation. `DECISIONS.md` must remain byte-identical to `MIGRATION_BASELINE`. Report `git status --porcelain` before and after: only untracked Stage 2a paths, no staged changes, no modified tracked files, at both points.

### 1.1 This order's authorization identity

Not executable until a hashing-capable seat returns this file's byte length and SHA-256 and the architect acknowledges them: `@@MEASUREMENT:POST_ASSEMBLY_ORDER_IDENTITY@@`. From that acknowledgment the order is immutable. Record this order's byte length and SHA-256 at the top of the deliverable, measured independently rather than transcribed from this section.

---

## 2. Header-pin re-confirmation against live repository state

Re-measure each of `H1`–`H9` against the **current** repository state and assert it still equals the value the completed manifest carries at `M0.4`. This is a repository fact, not a manifest fact — a manifest edit could not have broken it — but nothing has re-confirmed it since the branch moved forward under it.

| slot | re-measure | assert equals manifest's recorded value |
|---|---|---|
| `H1` | SHA-256 of the pre-migration graph artifact at blob `b5d0027` | `d37a6b5e8ac0c587ba7b03c00e7e94164417b7ac20122e790df3a23d8205813b` |
| `H2` | `inputGitSha` from that same blob | `d499cc1d0916e03830489ec9cd0324cd1a203a73` |
| `H3` | `generatorGitSha` from that same blob | `eb0e02e532c5d3bf4a26b374b00a4d741a85c06a` |
| `H4` | Full SHA of `eb0e02e` | `eb0e02e532c5d3bf4a26b374b00a4d741a85c06a` |
| `H5` | Full SHA of `b5d0027` | `b5d0027d0aab6e2f4d82eeabb6d3da64cc75c5b4` |
| `H6` | Full SHA of `05f9bcd`, asserted equal to current branch HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| `H7` | `DECISIONS.md` byte-identical to `MIGRATION_BASELINE` — `git diff --quiet` exit status plus independent length/hash equality | `PASS`, `76314` bytes, `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` |
| `H8` | Chronology: `main` reached `05f9bcd` before `codex/decisions-migration` was created — reflog-proven, not inferred from containment | `PASS`, unchanged from the manifest's recorded finding |
| `H9` | The following six paths remain byte-identical to `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`: `audit/decisions-cleanup-2026-07-24/findings.md`, `audit/decisions-cleanup-2026-07-24/inventory.md`, `audit/decisions-cleanup-2026-07-24/migration-table.md`, `audit/decisions-cleanup-2026-07-24/outline-before-after.md`, `audit/decisions-cleanup-2026-07-24/reference-graph.json`, `audit/decisions-reference-graph-hardening-2026-07-29/pre-migration-reference-graph.json`. The first five are every file under `audit/decisions-cleanup-2026-07-24/`; independently enumerate that directory and report any path present on disk that is absent from this list as an unexpected member. | `PASS`, no unexpected members |

`H8` remains in full scope, including its three-limb chronology proof (containment, `main` reflog arrival, branch-creation reflog entry) — it is a repository fact independent of manifest content and is not superseded by anything `M7.5` did.

**Any divergence from the manifest's recorded value is a BLOCKER**, reported with both values and no correction attempted — a header pin is architect-inserted text that Codex does not edit under this order.

---

## 3. Whole-file mechanical integrity, at final identity

Re-measure over the completed `332579`-byte manifest, independently rather than by citing the step-6 receipt's figures:

| check | expect |
|---|---|
| Strict UTF-8 decode | `PASS` |
| U+FFFD count | `0` |
| CRLF count | `0` |
| Bare CR count | `0` |
| Final LF present | `true` |
| Physical line count | measure and report |
| `@@ASSEMBLY_CURSOR@@` occurrences | `0` |
| Surviving `@@MEASUREMENT:…@@` sentinels, any name | `0` |
| Working tree state | only untracked Stage 2a paths; no staged or modified tracked files |

The manifest header states that absence of both sentinel classes is a ratifiability condition — not only the terminal assembly cursor `M7.5` consumed, but any surviving `@@MEASUREMENT:…@@` placeholder anywhere in the file. Scan for the general pattern `@@[A-Z0-9_:]+@@` — the colon is required, since every measurement sentinel in this project's own convention, including this order's own §1.1, takes the form `@@MEASUREMENT:NAME@@` — and assert its full match set is empty; an exact count of zero across that pattern is sufficient to close this check, and no per-class enumeration beyond the two named above is required.

This is a redundant, independently-run cross-check against step 6's own findings, not a re-derivation of the occurrence population. **Do not re-run the occurrence census, the family mapping, the report-generation or embedding proof, or the report-equality proof; those are `M7.5` steps 2–6 and are closed.**

---

## 4. Deliverable

One report at `audit/decisions-migration-2026-07-29/POST-ASSEMBLY-DETERMINISTIC-VERIFICATION-2026-08-07.md`. That single file is the only write authorized. Leave it untracked.

Order of contents:

1. this order's independently measured byte length and SHA-256;
2. §1 identity verification with measured values;
3. both `git status --porcelain` snapshots;
4. §2 header-pin re-confirmation, all nine slots;
5. §3 whole-file mechanical integrity re-measurement, including both sentinel-class counts;
6. a findings table classed `BLOCKER` / `REQUIRED REPAIR` / `ADVISORY` with counts;
7. a closing statement of anything unmeasured, stated as unmeasured rather than as absent.

Retain raw stdout. **A null or zero result discharges feasibility only, never correctness.** If any check cannot be performed, report it as unperformed and say why; do not report it as clear.

---

## 5. Boundaries and closeout

Barred, in full:

- **any edit to the manifest** — not one byte, not whitespace, not a trailing newline;
- re-running or re-deriving the `M7.5` occurrence census, the surface mapping, the report generation, the insertion, or the step-6 equality proof — all closed, all out of scope;
- reproducing the thirteen archive-wrapper source slices or the `E038` preservation slice — already closed by `Tranche E`;
- running `lib/decisions-format.ts`, or any substitute grammar, over the manifest itself — that parser targets `DECISIONS.md`/`archive.md`, not this document, and no such check is commissioned;
- investigating or re-deriving the 65/13/80-row classification reconciliation — already closed by `Tranche F` §F7;
- performing the semantic content review commission §4.9 otherwise requires — a non-author reviewer's act, separately discharged;
- any repair to any file, including a defect this verification finds;
- staging, commit, push, stash, reset, checkout, clean, or any other Git write;
- beginning Stage 2b, owner ratification, or any act that presumes this receipt's disposition before it is adjudicated.

Remeasure at closeout: this order, the completed manifest, and `DECISIONS.md`, each against §1; branch and HEAD unchanged.

Return the deliverable for adjudication. Owner exact-byte ratification of `818be99a…` follows adjudication, if the identity is still unchanged; Stage 2b follows ratification.
