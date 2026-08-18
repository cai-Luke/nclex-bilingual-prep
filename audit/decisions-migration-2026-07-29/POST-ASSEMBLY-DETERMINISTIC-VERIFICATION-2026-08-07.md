# Stage 2a — post-assembly deterministic verification

**Date:** 2026-08-08  
**Executing seat:** Codex  
**Repository access:** local disk snapshot  
**Branch:** `codex/decisions-migration`  
**HEAD:** `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`

This report executes revision 4 of `DECISIONS-MIGRATION-STAGE-2A-POST-ASSEMBLY-DETERMINISTIC-VERIFICATION-WORK-ORDER-2026-08-07.md`. The authorization identity was independently measured, reported, and then accepted for execution after Luke stated that it matched Claude's measurement and authorized continuation. No manifest byte was edited. This report is the only file written and remains untracked.

## 1. Work-order authorization identity

| Measurement | Independently measured value |
|---|---:|
| Byte length | `12514` |
| SHA-256 | `f30133ba06a6b2a2ede706c186d69428710c46c4114ce924ab7a3b0b48524310` |

Result: **PASS**. This is the acknowledged immutable authorization identity under work-order §1.1.

## 2. Frozen-identity verification at opening

| Item | Expected | Measured | Result |
|---|---|---|---|
| Branch | `codex/decisions-migration` | `codex/decisions-migration` | **PASS** |
| Branch HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` | **PASS** |
| Completed manifest byte length | `332579` | `332579` | **PASS** |
| Completed manifest SHA-256 | `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` | `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` | **PASS** |
| `DECISIONS.md` byte length | `76314` | `76314` | **PASS** |
| `DECISIONS.md` SHA-256 | `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | **PASS** |
| Step-6 receipt byte length | `15729` | `15729` | **PASS** |
| Step-6 receipt SHA-256 | `818c7226dc2d6c8a1d85ee24de4e3b7c978a59d066685ca9189358ea127ea654` | `818c7226dc2d6c8a1d85ee24de4e3b7c978a59d066685ca9189358ea127ea654` | **PASS** |

## 3. Working-tree snapshots

### Opening `git status --porcelain=v1`

```text
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-BLOCK-GROUPING-WORKSHEET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-CANDIDATE-REGIONS-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-OCCURRENCE-CENSUS-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-ADDENDUM-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-CODEX-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DERIVED-REPORT-VALIDATION-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-CODEX-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-RECEIPT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-RESULTS-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-WORK-ORDER-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-COMPLETION-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-FRESH-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-FRESH-REVIEW-NARROW-RECOMMISSION-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-GPT-DETERMINISTIC-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-HEADER-MEASUREMENT-WORK-ORDER-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-ANAPHORA-REPAIR-WORK-ORDER-2026-08-05.md
?? DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-CONFIRMING-READ-RERUN-WORK-ORDER-2026-08-05.md
?? DECISIONS-MIGRATION-STAGE-2A-M4-RESERVATION-RECORDING-REPAIR-WORK-ORDER-2026-08-05.md
?? DECISIONS-MIGRATION-STAGE-2A-M4.35-EXCLUSIVITY-REPAIR-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-M4.35-SENTENCE-COUNT-REPAIR-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-M4.4-ADJACENT-WHITESPACE-REPAIR-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-COMPLETION-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-PRE-CENSUS-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-VERIFICATION-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-MANIFEST-SCAFFOLD-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-BINDING-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-07-31.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-P7-DATE-CORRECTION-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-A-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-B-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-B-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-AUTHORING-WORK-ORDER-2026-07-31.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PATH-CANDIDATE-WORKSHEET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-POST-ASSEMBLY-DETERMINISTIC-VERIFICATION-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-TASK-2-TASK-3-REMEASUREMENT-WORK-ORDER-2026-08-07.md
?? audit/decisions-migration-2026-07-29/
```

Opening classification: only untracked Stage 2a paths. `git diff --name-only` and `git diff --cached --name-only` each emitted no paths. No staged changes and no modified tracked files.

### Closeout `git status --porcelain=v1`

```text
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-BLOCK-GROUPING-WORKSHEET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-CANDIDATE-REGIONS-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-OCCURRENCE-CENSUS-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-ADDENDUM-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-CODEX-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DERIVED-REPORT-VALIDATION-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-CODEX-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-RECEIPT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-RESULTS-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-WORK-ORDER-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-COMPLETION-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-FRESH-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-FRESH-REVIEW-NARROW-RECOMMISSION-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-GPT-DETERMINISTIC-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-HEADER-MEASUREMENT-WORK-ORDER-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-ANAPHORA-REPAIR-WORK-ORDER-2026-08-05.md
?? DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-CONFIRMING-READ-RERUN-WORK-ORDER-2026-08-05.md
?? DECISIONS-MIGRATION-STAGE-2A-M4-RESERVATION-RECORDING-REPAIR-WORK-ORDER-2026-08-05.md
?? DECISIONS-MIGRATION-STAGE-2A-M4.35-EXCLUSIVITY-REPAIR-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-M4.35-SENTENCE-COUNT-REPAIR-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-M4.4-ADJACENT-WHITESPACE-REPAIR-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-COMPLETION-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-PRE-CENSUS-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-VERIFICATION-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-MANIFEST-SCAFFOLD-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-BINDING-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-07-31.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-P7-DATE-CORRECTION-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-A-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-B-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-B-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-AUTHORING-WORK-ORDER-2026-07-31.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PATH-CANDIDATE-WORKSHEET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-POST-ASSEMBLY-DETERMINISTIC-VERIFICATION-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-TASK-2-TASK-3-REMEASUREMENT-WORK-ORDER-2026-08-07.md
?? audit/decisions-migration-2026-07-29/
```

Closeout classification: byte-for-byte identical porcelain output to the opening snapshot. The report itself is inside the already-untracked `audit/decisions-migration-2026-07-29/` path represented by the final porcelain line. `git diff --name-only` and `git diff --cached --name-only` again each emitted no paths. No staged changes and no modified tracked files.

## 4. Header-pin reconfirmation

| Slot | Live remeasurement | Manifest value | Result |
|---|---|---|---|
| H1 | Pre-migration graph blob SHA-256 `d37a6b5e8ac0c587ba7b03c00e7e94164417b7ac20122e790df3a23d8205813b` (`5957923` bytes) | `d37a6b5e8ac0c587ba7b03c00e7e94164417b7ac20122e790df3a23d8205813b` | **PASS** |
| H2 | Blob field `inputGitSha` = `d499cc1d0916e03830489ec9cd0324cd1a203a73` | `d499cc1d0916e03830489ec9cd0324cd1a203a73` | **PASS** |
| H3 | Blob field `generatorGitSha` = `eb0e02e532c5d3bf4a26b374b00a4d741a85c06a` | `eb0e02e532c5d3bf4a26b374b00a4d741a85c06a` | **PASS** |
| H4 | `git rev-parse eb0e02e` = `eb0e02e532c5d3bf4a26b374b00a4d741a85c06a` | same full SHA | **PASS** |
| H5 | `git rev-parse b5d0027` = `b5d0027d0aab6e2f4d82eeabb6d3da64cc75c5b4` | same full SHA | **PASS** |
| H6 | `git rev-parse 05f9bcd` and current `HEAD` both = `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` | same full SHA | **PASS** |
| H7 | `git diff --quiet d499cc1… -- DECISIONS.md` exit `0`; working and baseline copies each `76314` bytes / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | `PASS`, same length/hash | **PASS** |
| H8 | Containment exit `0`; `main` reflog arrival epoch `1785340640` (`2026-07-29 11:57:20 -0400`); branch-creation reflog epoch `1785342102` (`2026-07-29 12:21:42 -0400`); delta `1462` seconds = `24m 22s` | `PASS`, unchanged finding | **PASS** |
| H9 | Six-path `git diff --quiet` exit `0`; each live length/hash equals its `05f9bcd…` copy; cleanup directory independently enumerates exactly the five prescribed files; unexpected members `0` | `PASS`, no unexpected members | **PASS** |

### H8 three-limb chronology proof

1. Containment: `git merge-base --is-ancestor 05f9bcd… refs/heads/main` exited `0`.
2. Main arrival: the raw `main` reflog records `05f9bcd…` at epoch `1785340640`, corresponding to `2026-07-29 11:57:20 -0400`.
3. Branch creation: the raw `codex/decisions-migration` reflog records creation from `05f9bcd…` at epoch `1785342102`, corresponding to `2026-07-29 12:21:42 -0400`.

The reflog event timestamps differ by `1462` seconds, so `main` reached the commit `24 minutes 22 seconds` before branch creation. This is a direct reflog proof, not an inference from containment.

### H9 per-path measurements

| Path | Live and `05f9bcd…` bytes | Live and `05f9bcd…` SHA-256 | Result |
|---|---:|---|---|
| `audit/decisions-cleanup-2026-07-24/findings.md` | `55131` | `c8caa37f067a4b62d1ab9d17f998dfbcf9aec8f55c6f8f454b0047b9c5bf46f3` | **PASS** |
| `audit/decisions-cleanup-2026-07-24/inventory.md` | `28554` | `cfae5a898c1520173d835af5d0e29b4c0bfd2b135a40fb4335de82b34da1333e` | **PASS** |
| `audit/decisions-cleanup-2026-07-24/migration-table.md` | `16833` | `89a2812dc955a61e45723bf6c242e247f467df71c7daa301b4fde2fcae1a4535` | **PASS** |
| `audit/decisions-cleanup-2026-07-24/outline-before-after.md` | `9878` | `3821323c711866e655fd25b044add86c33cdc859762a4aa6f62d522ff158440e` | **PASS** |
| `audit/decisions-cleanup-2026-07-24/reference-graph.json` | `5532553` | `42cdc8369b5db1dc24ddb9624d1832705c7c22337b20eca5246b4d745466c937` | **PASS** |
| `audit/decisions-reference-graph-hardening-2026-07-29/pre-migration-reference-graph.json` | `5957923` | `d37a6b5e8ac0c587ba7b03c00e7e94164417b7ac20122e790df3a23d8205813b` | **PASS** |

Independent cleanup-directory enumeration returned, in bytewise sort order:

```text
audit/decisions-cleanup-2026-07-24/findings.md
audit/decisions-cleanup-2026-07-24/inventory.md
audit/decisions-cleanup-2026-07-24/migration-table.md
audit/decisions-cleanup-2026-07-24/outline-before-after.md
audit/decisions-cleanup-2026-07-24/reference-graph.json
```

Unexpected directory members: `0`.

## 5. Whole-file mechanical integrity at final manifest identity

These measurements were run directly over the completed `332579`-byte manifest, not transcribed from the step-6 receipt.

| Check | Measured | Expected | Result |
|---|---:|---:|---|
| Strict UTF-8 decode | `PASS` | `PASS` | **PASS** |
| U+FFFD count | `0` | `0` | **PASS** |
| CRLF count | `0` | `0` | **PASS** |
| Bare CR count | `0` | `0` | **PASS** |
| Final LF present | `true` | `true` | **PASS** |
| LF count | `6262` | measured and reported | **MEASURED** |
| Physical line count | `6262` | measured and reported | **MEASURED** |
| Assembly-cursor occurrences | `0` | `0` | **PASS** |
| Measurement-sentinel occurrences | `0` | `0` | **PASS** |
| General `@@[A-Z0-9_:]+@@` match count | `0` | `0` | **PASS** |
| General sentinel full-match set | `[]` | empty | **PASS** |
| Working-tree state | only untracked Stage 2a paths; no staged or modified tracked files | same | **PASS** |

The zero results above establish the commissioned absence conditions only because the complete named byte surface was scanned directly. They are not treated as proof of any unperformed semantic or population check.

## 6. Findings

| Class | Count | Findings |
|---|---:|---|
| `BLOCKER` | `0` | None. |
| `REQUIRED REPAIR` | `0` | None. |
| `ADVISORY` | `0` | None. |

Mechanical disposition: **PASS** for every commissioned check. This statement assigns no broader Stage 2a disposition, does not ratify Stage 2a, and does not authorize Stage 2b.

## 7. Raw stdout retained

### Opening identities

```text
   12514 DECISIONS-MIGRATION-STAGE-2A-POST-ASSEMBLY-DETERMINISTIC-VERIFICATION-WORK-ORDER-2026-08-07.md
  332579 audit/decisions-migration-2026-07-29/target-text-manifest.md
   76314 DECISIONS.md
   15729 audit/decisions-migration-2026-07-29/DERIVED-REPORT-STEP-6-VERIFICATION-2026-08-07.md
  437136 total
f30133ba06a6b2a2ede706c186d69428710c46c4114ce924ab7a3b0b48524310  DECISIONS-MIGRATION-STAGE-2A-POST-ASSEMBLY-DETERMINISTIC-VERIFICATION-WORK-ORDER-2026-08-07.md
818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2  audit/decisions-migration-2026-07-29/target-text-manifest.md
b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e  DECISIONS.md
818c7226dc2d6c8a1d85ee24de4e3b7c978a59d066685ca9189358ea127ea654  audit/decisions-migration-2026-07-29/DERIVED-REPORT-STEP-6-VERIFICATION-2026-08-07.md
```

### H1–H7 core output

```text
5957923
d37a6b5e8ac0c587ba7b03c00e7e94164417b7ac20122e790df3a23d8205813b  -
d499cc1d0916e03830489ec9cd0324cd1a203a73
eb0e02e532c5d3bf4a26b374b00a4d741a85c06a
eb0e02e532c5d3bf4a26b374b00a4d741a85c06a
b5d0027d0aab6e2f4d82eeabb6d3da64cc75c5b4
05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5
05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5
```

`git diff --quiet d499cc1d0916e03830489ec9cd0324cd1a203a73 -- DECISIONS.md` exit status:

```text
0
```

```text
76314 DECISIONS.md
b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e  DECISIONS.md
76314
b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e  -
```

### H8 raw reflog lines

```text
5b30046004d2172a49f787030be79adb68f4c81b 05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5 Luke Cai <lcai2@northwell.edu> 1785340640 -0400	commit: docs: apply decisions migration amendment 4
0000000000000000000000000000000000000000 05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5 Luke Cai <lcai2@northwell.edu> 1785342102 -0400	branch: Created from 05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5
```

`git merge-base --is-ancestor 05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5 refs/heads/main` exit status:

```text
0
```

### H9 raw per-path output

```text
55131 audit/decisions-cleanup-2026-07-24/findings.md
c8caa37f067a4b62d1ab9d17f998dfbcf9aec8f55c6f8f454b0047b9c5bf46f3  audit/decisions-cleanup-2026-07-24/findings.md
55131
c8caa37f067a4b62d1ab9d17f998dfbcf9aec8f55c6f8f454b0047b9c5bf46f3  -
28554 audit/decisions-cleanup-2026-07-24/inventory.md
cfae5a898c1520173d835af5d0e29b4c0bfd2b135a40fb4335de82b34da1333e  audit/decisions-cleanup-2026-07-24/inventory.md
28554
cfae5a898c1520173d835af5d0e29b4c0bfd2b135a40fb4335de82b34da1333e  -
16833 audit/decisions-cleanup-2026-07-24/migration-table.md
89a2812dc955a61e45723bf6c242e247f467df71c7daa301b4fde2fcae1a4535  audit/decisions-cleanup-2026-07-24/migration-table.md
16833
89a2812dc955a61e45723bf6c242e247f467df71c7daa301b4fde2fcae1a4535  -
9878 audit/decisions-cleanup-2026-07-24/outline-before-after.md
3821323c711866e655fd25b044add86c33cdc859762a4aa6f62d522ff158440e  audit/decisions-cleanup-2026-07-24/outline-before-after.md
9878
3821323c711866e655fd25b044add86c33cdc859762a4aa6f62d522ff158440e  -
5532553 audit/decisions-cleanup-2026-07-24/reference-graph.json
42cdc8369b5db1dc24ddb9624d1832705c7c22337b20eca5246b4d745466c937  audit/decisions-cleanup-2026-07-24/reference-graph.json
5532553
42cdc8369b5db1dc24ddb9624d1832705c7c22337b20eca5246b4d745466c937  -
5957923 audit/decisions-reference-graph-hardening-2026-07-29/pre-migration-reference-graph.json
d37a6b5e8ac0c587ba7b03c00e7e94164417b7ac20122e790df3a23d8205813b  audit/decisions-reference-graph-hardening-2026-07-29/pre-migration-reference-graph.json
5957923
d37a6b5e8ac0c587ba7b03c00e7e94164417b7ac20122e790df3a23d8205813b  -
audit/decisions-cleanup-2026-07-24/findings.md
audit/decisions-cleanup-2026-07-24/inventory.md
audit/decisions-cleanup-2026-07-24/migration-table.md
audit/decisions-cleanup-2026-07-24/outline-before-after.md
audit/decisions-cleanup-2026-07-24/reference-graph.json
```

The six-path `git diff --quiet 05f9bcd… -- <six prescribed paths>` exit status was `0`.

### Whole-file mechanical output

```text
strict_utf8=PASS
ufffd_count=0
crlf_count=0
bare_cr_count=0
final_lf_present=true
lf_count=6262
physical_line_count=6262
assembly_cursor_occurrences=0
measurement_sentinel_occurrences=0
general_sentinel_occurrences=0
general_sentinel_matches=[]
```

## 8. Unmeasured scope

The following were **unmeasured**, not found absent:

- the `M7.5` occurrence census, surface mapping, report generation, insertion, and step-6 equality proof;
- the thirteen archive-wrapper source slices and the `E038` preservation slice;
- any parse of the manifest under `lib/decisions-format.ts` or any substitute grammar;
- the 65/13/80-row classification reconciliation;
- semantic or constitutional-content review;
- Stage 2a ratification, owner exact-byte ratification, Stage 2b readiness, and any migration application;
- the substantive contents of the step-6 receipt beyond its commissioned frozen byte length and SHA-256 identity.

Nothing in this report states an unmeasured item as absent or clear.

## 9. Closeout identity

| Item | Expected | Closeout measurement | Result |
|---|---|---|---|
| Work order byte length | `12514` | `12514` | **PASS** |
| Work order SHA-256 | `f30133ba06a6b2a2ede706c186d69428710c46c4114ce924ab7a3b0b48524310` | `f30133ba06a6b2a2ede706c186d69428710c46c4114ce924ab7a3b0b48524310` | **PASS** |
| Completed manifest byte length | `332579` | `332579` | **PASS** |
| Completed manifest SHA-256 | `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` | `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` | **PASS** |
| `DECISIONS.md` byte length | `76314` | `76314` | **PASS** |
| `DECISIONS.md` SHA-256 | `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | **PASS** |
| Branch | `codex/decisions-migration` | `codex/decisions-migration` | **PASS** |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` | **PASS** |

Raw closeout identity stdout:

```text
12514 DECISIONS-MIGRATION-STAGE-2A-POST-ASSEMBLY-DETERMINISTIC-VERIFICATION-WORK-ORDER-2026-08-07.md
332579 audit/decisions-migration-2026-07-29/target-text-manifest.md
76314 DECISIONS.md
421407 total
f30133ba06a6b2a2ede706c186d69428710c46c4114ce924ab7a3b0b48524310  DECISIONS-MIGRATION-STAGE-2A-POST-ASSEMBLY-DETERMINISTIC-VERIFICATION-WORK-ORDER-2026-08-07.md
818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2  audit/decisions-migration-2026-07-29/target-text-manifest.md
b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e  DECISIONS.md
```

Closeout result: all frozen identities remain unchanged. The branch and HEAD remain unchanged. The worktree contains only untracked Stage 2a paths, including this single authorized report; there are no staged changes and no modified tracked files.
