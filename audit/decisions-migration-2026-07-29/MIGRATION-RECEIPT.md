# Stage 2b migration receipt

**Date:** 2026-08-18  
**Branch:** `codex/decisions-migration`  
**Purpose:** commission §10 receipt for the Stage 2b migration and Commit 4 closeout.  
**Acceptance boundary:** This receipt records evidence; under Amendment 5 Clause C, repository conformance is accepted only at merge.

## Governing identity and commit sequence

- Branch: `codex/decisions-migration`.
- Current HEAD at receipt construction: `345d0d9b72cd97b5f72bde29cd7822e96c94e8b7`.
- `MIGRATION_BASELINE`: `d499cc1d0916e03830489ec9cd0324cd1a203a73`.
- Commit 1: `5b4d2fd8c76d1af94400322882d7a7c709704ed6` — ratified manifest and initial migration governance/evidence population.
- Commit 2: `4511821448d7f0d643164be83009fc8013ed8977` — decisions-format parser/fixture regression.
- Commit 3: `345d0d9b72cd97b5f72bde29cd7822e96c94e8b7` — migrated `DECISIONS.md` and archive content.
- Commit 4: the single authorized closeout commit containing the owner-ratified supplementary census and the remainder of Instrument C; its identity is `32388990417222891730cd24113df12fdc779b15`.
- Commit 5, the closeout-evidence repair commit authorized by Amendment 6 Clause A, carries this repair. Per Clause A, its own identity is not recorded inside itself and is durably held by Git.
- The frozen Instrument C Revision 2 identity was verified before execution: 25,076 bytes / SHA-256 `6b4d2d7783a9f53478e1775812d0570f0439ab54f4524c7eaddb28b22fa52791` for `DECISIONS-MIGRATION-STAGE-2B-CLOSEOUT-AND-COMMIT-4-WORK-ORDER-2026-08-18.md`.

Instrument A Revision 2 returned and was adjudicated `ACCEPT` by the Claude architect seat. Instrument B entered after that A `ACCEPT`, returned `ACCEPT`, and was adjudicated `ACCEPT` by the Claude architect seat. The architect's separate commission §8.1 disposition is recorded below as `ACCEPT — commission §8.1 only`. These are prerequisite dispositions, not Amendment 5 Clause C acceptance.

## Source, target, and manifest identities

| artifact | bytes | SHA-256 | role |
|---|---:|---|---|
| `MIGRATION_BASELINE:DECISIONS.md` | 76314 | `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | baseline source |
| `DECISIONS.md` at Commit 3 | 56964 | `3dc5dbc0c6acbfe4f74fa353b80d53c7feeec4f5ada0a42d7b9773f26c26f4a8` | migrated target |
| `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` | 76314 | `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | byte-identical preservation snapshot |
| `Archive/DECISIONS-ARCHIVE-2026-07-14.md` | 37094 | `d311813aeca181da908ea33907fdb919385b2c8171afad0003c3389b40e067a7` | unchanged historical archive |
| `Archive/DECISIONS-ARCHIVE-2026-08-18.md` | 13997 | `e75e979ea121fa1a697861f8de4a4527f07ef2d8b7ed1f4d299bf504163e873c` | normalized migration archive |
| `audit/decisions-migration-2026-07-29/target-text-manifest.md` | 332579 | `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` | ratified construction authority |

The manifest was ratified by Luke on 2026-08-08 in `DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md`, which states the complete exact-byte authority as 332579 bytes / SHA-256 `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2`. `MIGRATION_DATE` remains owner-bound to `2026-08-18`; no rebinding was performed here.

## Archive-wrapper body offsets, lengths, and hashes

The 13 wrapper bodies are the manifest-pinned baseline spans. Separators are recorded because they are part of the preservation proof; parsed wrapper lengths include the parser-visible body termination where noted in the underlying report.

| wrapper | source span | bytes | SHA-256 | separator |
|---|---:|---:|---|---|
| E032 | [41665,42597) | 932 | `ce225de0bc3b233986e8a968b54a1810f49defe82b5e190d10f9b7ab8d20174b` | 1 LF |
| E036 | [50844,51342) | 498 | `746a9c648223c2f2a0c1b1ce4c64ea1e62b4e12083f26fb1094a933f2b68a0b0` | 2 LFs |
| E039b | [53661,54291) | 630 | `781b8f8cde02d07338aebec48298d3833d2f8627d7780f8cd50587144d2c4d47` | 1 LF |
| E040 / P9 | [54292,54790) | 498 | `b5259fd359f139364f79de63a040c64cfe1fa499757b0d4df8de674904d3600b` | 1 LF |
| E041 / P12 | [54791,55582) | 791 | `b11d42ed7b9d1647f9987563eedee5e9c0a384082f05583a3be3701692054e19` | 1 LF |
| E042 / P18 | [55583,56120) | 537 | `2d6de6b17fc06f5505faa09ddeeaabf5df78904f9ff7d2022d864ada7453d8eb` | 1 LF |
| E043b / P22 | [56121,56543) | 422 | `4350881da63237d4c260d5a130132af3f45752231553050aad5fb8b8870b0a68` | 2 LFs |
| E048 | [62297,62907) | 610 | `600ffba62e19db1e17e9d2eb8190ae2538135e63c88642fa27da7068fc274fa6` | 1 LF |
| E050 | [64005,64356) | 351 | `55d77725bb717a2e6d740776c3156acbc4ca82440e20511f1ba3c4a6d5657438` | 1 LF |
| E051 | [64357,64837) | 480 | `0e22abba431d56e29150e2dd3c5e609053b659adc1598904e9ee96b077338e27` | 1 LF |
| E052 | [64838,66593) | 1755 | `d9e68b9dd5b29f17da155e2021b9b72da91172c677ce8cf445de48da676a4d76` | 1 LF |
| E075 | [75189,75483) | 294 | `0755d97e56843a9d966093d7d5e63273592ae5f82a9d92e6b52db7748f2b848d` | 1 LF |
| E076 | [75484,76314) | 830 | `3b4454aa392a128b3e074d570c7df0e50fe95927b01329936eabf0194b294039` | terminal LF owned by E076 |

The wrapper-index bijection is 13/13. The retired-ID wrappers are P9, P12, P18, and P22; the nine remaining wrappers are name-addressed.

## Reconciliation and optional-field register

- Target reconciliation: `npm run reconcile:decisions-migration-target` exited 0. Reports 1–8 were `PASS`; Amendment 2 was `PASS`; Amendment 3 was `SCOPE` for join bytes/end-of-document authority carried from Phase 4; Amendment 4 E053 was `PASS`.
- Source-row accounting: 65 live / 13 wrappers / 1 structural E053 / 1 `MERGE_INTO` E037 = 80.
- Destination allocation: P=37 / R=6 / I=19 / T=3; allocation unions contiguous through P31 and R6.
- Retired register: P9, P12, P18, and P22 `RETIRED`; P13 and P14 `NEVER_ASSIGNED`; six rows total. Retired-register/live-ID conflict check: zero.
- Preservation snapshot exact equality: PASS against `git-show MIGRATION_BASELINE:DECISIONS.md`.
- Optional-field register: 325 optional slots across 65 live blocks; 68 present and 257 omitted. Field totals: `Authorized` 2/63 present/omitted, `Not authorized` 4/61, `Evidence` 6/59, `Owner` 14/51, `Execution` 42/23. The §4.6 `Evidence`+`Owner` omission register has 110 rows; 20 blocks omit all five optional fields; 20 governed field instances name 19 distinct paths, with 18 requiring tracked verification and one covered by Amendment 1 Clause A. The register has 15 distinct grounds, 10 rows first grounded at M6, 7 recorded divergences from draft registers, and 1 rejected co-candidate on a populated field.

## Post-migration reference graph

Retained artifact: `audit/decisions-migration-2026-07-29/post-migration-reference-graph.json`, generated in target mode from the Commit-3 tree. It records `inputGitSha=345d0d9b72cd97b5f72bde29cd7822e96c94e8b7`, `generatorGitSha=345d0d9b72cd97b5f72bde29cd7822e96c94e8b7`, `generatorSha256=f4b69ff888a5975dba7b1223d6ffdd68b0bce9e6eaff51b54bb4e1da93f49aa5`, `measurementRootKind=throwaway_git_worktree`, and retained-artifact identity 8661911 bytes / SHA-256 `83d2af3b508eb6b83252f695e0df3295e55ab7388f0e5ad44534fa3972c46b1d`.

Graph counts: 526 sources; 19,531 references; 11,871 resolved; 11,459 live; 0 lapsed; 412 retired; 7,600 missing; 60 not applicable; 31 external; 16 ambiguous; 13 derived-identifier records; 0 invalid-anchor citations. The target principle index has P8 `LIVE`, P9/P12/P18/P22 `RETIRED`, P13/P14 `MISSING`, and P1–P31 allocation present where assigned.

The 11 target assertions were satisfied in the Instrument A return: target parser mode; no target parse/conformance failure; state routing for P8/P9/P12/P18/P22/P13/P14; exact live P/R resolution; exact title resolution; target-local derived identifiers zero; target-local invalid anchors zero; archive-index uniqueness; and no snapshot pointer parsed as an archive-index line. The graph's corpus-wide derived-identifier count is 13 (baseline hardened graph: 7) and corpus-wide target-anchor links were reported rather than assumed zero.

Source-segregated graph populations are interpreted from the graph's per-record `from` data: the live governance corpus is the non-snapshot, non-historical-archive population; the preservation snapshot is every record whose `from` is `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md`; and the other Archive corpus is historical Archive material excluding the preservation snapshot and normalized migration archive. Snapshot-driven `RETIRED` records are a distinct historical source population and are not live-corpus regressions.

Expected-delta comparison: P8 `LAPSED → LIVE`; P9/P12/P18/P22 `LAPSED → RETIRED`; P13/P14 remain missing/never assigned; target titles and archive-wrapper definitions become available under target grammar; and the preservation snapshot adds its historical source population. All other graph differences were individually covered by the Instrument A assertion and source-segregation return.

## Determinism and focused gates

Instrument A Revision 2 returned a successful two-run determinism result: both runs used the same throwaway Commit-3 measurement root, differed only in `generatedAt`, and the normalized outputs were byte-identical. The exact Run-1 and Run-2 raw and normalized digests are: Run 1 raw SHA-256 `2d65ec79cacf35f960488e4e8c72829bf93e692f2833197214d39925f62053b7`; external Run-1 copy `/tmp/shrimp-postmig-run1-20260818191919.json`; `cmp` fidelity proof exit `0`; copy removed: yes; Run 2 raw SHA-256 `83d2af3b508eb6b83252f695e0df3295e55ab7388f0e5ad44534fa3972c46b1d`, identical to the retained-artifact identity already recorded in this receipt; Normalized Run 1 SHA-256 `9adc5aaf073dcee0350675fa07e9b07c54949ff2b506969170e47430cc4d5c57`; Normalized Run 2 SHA-256 `9adc5aaf073dcee0350675fa07e9b07c54949ff2b506969170e47430cc4d5c57`; non-`generatedAt` differences: `0`. No new graph generation is performed by Instrument C because the commissioned retained artifact already exists and is not overwritten by this order.

Focused checks carried into this receipt:

| check | result |
|---|---|
| `npm run test:decisions-format` | exit 0 |
| `npm run conform:decisions` after Commit 3 | exit 0, zero findings |
| `npm run reconcile:decisions-migration` | exit 0, historical 65/14/1 mapping |
| `npm run reconcile:decisions-migration-target` | exit 0, Reports 1–8 PASS / Amendment 2 PASS / Amendment 3 SCOPE / Amendment 4 PASS |
| `npx tsx scripts/tests/decisions-reference-graph.ts` | exit 0 |
| snapshot SHA equality | PASS |
| 13/13 wrapper-index bijection | PASS |
| retired-register/live-ID conflict | PASS, zero |
| tracked `Evidence`/`Owner` path check | PASS, zero findings |
| manifest/output exact equality, Instrument A §7.1 item 11 | PASS in both directions for all 65 live blocks |

## Full repository gate

The live `.github/workflows/promotion-gate.yml` was read and reconfirmed against the workflow. It defines twelve steps: two CI-only action steps and ten `run` steps carrying thirteen commands. The action steps were read and not locally invoked: `actions/checkout@v4` and `actions/setup-node@v4`.

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

The full gate returned successfully in Instrument A's execution, and the live `npm run audit` was separately observed as passing during Instrument C's own checkout. The following Instrument A Revision 2 advisories did not affect acceptance:

1. `npm ci` — 7 npm audit vulnerabilities: 1 low, 2 moderate, 4 high.
2. `npm run audit` — 451 existing `revealsAllStages` advisory findings across 13 bank files; the gate still exited `0`.
3. Target reconciliation emitted its documented Amendment 3 `[SCOPE]` notice.
4. An initial non-authoritative snapshot probe used the invalid symbolic ref `MIGRATION_BASELINE` and failed; the formal check was rerun against the pinned full SHA and passed.

Instrument C observation, recorded as such: the audit output reported the draft-integrity lane as having no draft files to verify and one not-yet-promoted item.

Advisory 4 is recorded because a check that failed for a methodological reason and was correctly redone is part of the execution record. It is not restated as a defect and does not alter any disposition. The gate did not alter any tracked path outside the authorized Commit-4 population.

## Changed-path allowlist and diff statistics

The complete Commit-4 population is the ratified supplementary item-13 census plus `PROJECT-HISTORY.md`, `package.json`, `.github/workflows/promotion-gate.yml`, and `scripts/decisions-migration-target-reconcile.ts`. Before Commit 4, the implementation surfaces are the two pre-existing modified files and the one untracked reconciliation script; the governance/evidence population is listed by the initial and supplementary censuses below. The staged path-for-path verification and diff statistics are recorded below before the single authorized commit.

Pre-commit staged verification: the staged path set is exactly 15/15 authorized paths, consisting of 12 additions and 3 modifications, with no unauthorized path staged. The staged diff summary is 15 files changed, 277012 insertions, and 0 deletions.

## Independent review dispositions

- Instrument B report: `audit/decisions-migration-2026-07-29/INDEPENDENT-CONTENT-REVIEW-2026-08-18.md`, `ACCEPT — Instrument B §8.2 independent constitutional content review only`; coverage was 65 live statements, 13 wrapper boundaries, E053, and all three E037 placements, with zero omission, added-meaning, altered-force, or unreviewable findings. Instrument B's entry was conditioned on, and taken after, the Instrument A §7.1 item 11 manifest/output exact-equality **PASS** already recorded in this receipt — the ratified manifest verified at 332,579 bytes / SHA-256 `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2`, with both directions passing for all 65 live blocks.
- Architect commission §8.1 disposition, copied from Instrument C §3 Block 5: `ACCEPT — commission §8.1 only`.
- Neither disposition is repository-conformance acceptance; merge remains the owner acceptance act.

## Pinned Instrument C evidence blocks

### Block 1 — reconstructed initial Amendment 5 Clause A §1.2 census

~~~text
The original chat enumeration is unavailable as a durable byte record. Under Instrument C Revision 2 this block is reconstructed mechanically from Git history. Commit 1, 5b4d2fd8c76d1af94400322882d7a7c709704ed6, consumed the owner-ratified item-13 population present at the initial census. The receipt must print the exact item-13 path list derived from the Commit-1 delta against parent 05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5, excluding audit/decisions-migration-2026-07-29/target-text-manifest.md because that path was committed under separate manifest authority. That mechanically derived list is the faithful reconstruction of the initial Clause A §1.2 census.
~~~

Mechanically derived initial item-13 path list, from the Commit-1 delta against parent `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`, excluding `audit/decisions-migration-2026-07-29/target-text-manifest.md`:

~~~text
DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md
DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-RATIFICATION-2026-08-08.md
DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-STRUCTURAL-SURFACES-2026-08-08.md
DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-ASSEMBLY-JOINS-2026-08-08.md
DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-RATIFICATION-2026-08-08.md
DECISIONS-MIGRATION-COMMISSION-AMENDMENT-5-DRAFT-2026-08-12.md
DECISIONS-MIGRATION-COMMISSION-AMENDMENT-5-RATIFICATION-2026-08-18.md
DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-BLOCK-GROUPING-WORKSHEET-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-CANDIDATE-REGIONS-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-DATE-OCCURRENCE-CENSUS-WORK-ORDER-2026-08-07.md
DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-ADDENDUM-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-CODEX-HANDOFF-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-GPT-REVIEW-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-DERIVED-REPORT-VALIDATION-WORK-ORDER-2026-08-07.md
DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-CODEX-HANDOFF-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-RECEIPT-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-RESULTS-2026-07-30.md
DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-WORK-ORDER-2026-07-30.md
DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-COMPLETION-WORK-ORDER-2026-08-06.md
DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-WORK-ORDER-2026-08-06.md
DECISIONS-MIGRATION-STAGE-2A-FRESH-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-07.md
DECISIONS-MIGRATION-STAGE-2A-FRESH-REVIEW-NARROW-RECOMMISSION-WORK-ORDER-2026-08-07.md
DECISIONS-MIGRATION-STAGE-2A-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md
DECISIONS-MIGRATION-STAGE-2A-GPT-DETERMINISTIC-REVIEW-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-HANDOFF-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-HEADER-MEASUREMENT-WORK-ORDER-2026-07-30.md
DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-ANAPHORA-REPAIR-WORK-ORDER-2026-08-05.md
DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-CONFIRMING-READ-RERUN-WORK-ORDER-2026-08-05.md
DECISIONS-MIGRATION-STAGE-2A-M4-RESERVATION-RECORDING-REPAIR-WORK-ORDER-2026-08-05.md
DECISIONS-MIGRATION-STAGE-2A-M4.35-EXCLUSIVITY-REPAIR-WORK-ORDER-2026-08-07.md
DECISIONS-MIGRATION-STAGE-2A-M4.35-SENTENCE-COUNT-REPAIR-WORK-ORDER-2026-08-07.md
DECISIONS-MIGRATION-STAGE-2A-M4.4-ADJACENT-WHITESPACE-REPAIR-WORK-ORDER-2026-08-06.md
DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-COMPLETION-CODEX-WORK-ORDER-2026-08-04.md
DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-PRE-CENSUS-CODEX-WORK-ORDER-2026-08-04.md
DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-VERIFICATION-CODEX-WORK-ORDER-2026-08-04.md
DECISIONS-MIGRATION-STAGE-2A-MANIFEST-SCAFFOLD-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-BINDING-2026-07-30.md
DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-07-31.md
DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-08-06.md
DECISIONS-MIGRATION-STAGE-2A-P7-DATE-CORRECTION-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-PART-A-ARCHITECT-DRAFT-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-PART-B-ARCHITECT-DRAFT-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-PART-B-GPT-REVIEW-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-PART-C-ARCHITECT-DRAFT-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-PART-C-AUTHORING-WORK-ORDER-2026-07-31.md
DECISIONS-MIGRATION-STAGE-2A-PART-C-GPT-REVIEW-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-PATH-CANDIDATE-WORKSHEET-2026-07-29.md
DECISIONS-MIGRATION-STAGE-2A-POST-ASSEMBLY-DETERMINISTIC-VERIFICATION-WORK-ORDER-2026-08-07.md
DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md
DECISIONS-MIGRATION-STAGE-2A-TASK-2-TASK-3-REMEASUREMENT-WORK-ORDER-2026-08-07.md
DECISIONS-MIGRATION-STAGE-2B-CONTENT-COMMIT-CODEX-HANDOFF-2026-08-18.md
DECISIONS-MIGRATION-STAGE-2B-CONTENT-COMMIT-WORK-ORDER-DRAFT-2026-08-12.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-1-CLOSEOUT-2026-08-08.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-1-CODEX-HANDOFF-2026-08-08.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-1-F16-CORRECTION-WORK-ORDER-2026-08-08.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-WORK-ORDER-2026-08-08.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-2-CLOSEOUT-2026-08-08.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-2-CODEX-HANDOFF-2026-08-08.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-2-PRESERVATION-SNAPSHOT-WORK-ORDER-2026-08-08.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-3-CLOSEOUT-2026-08-08.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-3-CODEX-HANDOFF-2026-08-08.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-3-NORMALIZED-ARCHIVE-WORK-ORDER-2026-08-08.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-4-CLOSEOUT-2026-08-08.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-4-CODEX-HANDOFF-2026-08-08.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-4-TARGET-CONSTRUCTION-WORK-ORDER-2026-08-08.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-5-CLOSEOUT-2026-08-11.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-5-CODEX-HANDOFF-2026-08-11.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-CODEX-HANDOFF-2026-08-11.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-WORK-ORDER-2026-08-11.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-5-RECONCILIATION-CHECKER-WORK-ORDER-2026-08-11.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-6-CLOSEOUT-2026-08-12.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-6-CODEX-HANDOFF-2026-08-12.md
DECISIONS-MIGRATION-STAGE-2B-PHASE-6-CONFORMANCE-WIRING-WORK-ORDER-2026-08-12.md
DECISIONS-MIGRATION-STAGE-2B-RESUMPTION-NOTE-2026-08-12.md
audit/decisions-migration-2026-07-29/DATE-OCCURRENCE-CENSUS-2026-08-07.md
audit/decisions-migration-2026-07-29/DERIVED-REPORT-STEP-6-VERIFICATION-2026-08-07.md
audit/decisions-migration-2026-07-29/DERIVED-REPORT-VALIDATION-2026-08-07.md
audit/decisions-migration-2026-07-29/FOUR-FINDING-REPAIR-REPORT-2026-08-06.md
audit/decisions-migration-2026-07-29/FOUR-FINDING-REPAIR-VERIFICATION-2026-08-06.md
audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-DISPOSITION-2026-08-07.md
audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-A-2026-08-07.md
audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-B-2026-08-07.md
audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-C-2026-08-07.md
audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-D-2026-08-07.md
audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-E-2026-08-07.md
audit/decisions-migration-2026-07-29/FRESH-REVIEW-NARROW-RECOMMISSION-SUPPLEMENTAL-DISPOSITION-2026-08-07.md
audit/decisions-migration-2026-07-29/FULL-REVIEW-COMMISSION-STATUS-RECORD-2026-08-06.md
audit/decisions-migration-2026-07-29/FULL-REVIEW-DISPOSITION-2026-08-06.md
audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-A-2026-08-06.md
audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-B-2026-08-06.md
audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-C-2026-08-06.md
audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-D-2026-08-06.md
audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-E-2026-08-06.md
audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-REPAIR-REPORT-2026-08-05.md
audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-VERIFICATION-2026-08-05.md
audit/decisions-migration-2026-07-29/M4-OWNER-CONFIRMING-READ-RERUN-2026-08-05.md
audit/decisions-migration-2026-07-29/M4-OWNER-CONFIRMING-READ-VOID-RECEIPT-ADJUDICATION-2026-08-05.md
audit/decisions-migration-2026-07-29/M4-RESERVATION-RECORDING-CONFIRMATION-2026-08-05.md
audit/decisions-migration-2026-07-29/M4-RESERVATION-RECORDING-REPAIR-REPORT-2026-08-05.md
audit/decisions-migration-2026-07-29/M4.35-EXCLUSIVITY-REPAIR-REPORT-2026-08-07.md
audit/decisions-migration-2026-07-29/M4.35-EXCLUSIVITY-REPAIR-VERIFICATION-2026-08-07.md
audit/decisions-migration-2026-07-29/M4.35-SENTENCE-COUNT-CONFIRMING-READ-2026-08-07.md
audit/decisions-migration-2026-07-29/M4.35-SENTENCE-COUNT-REPAIR-REPORT-2026-08-07.md
audit/decisions-migration-2026-07-29/M4.35-SENTENCE-COUNT-REPAIR-VERIFICATION-2026-08-07.md
audit/decisions-migration-2026-07-29/M4.4-ADJACENT-WHITESPACE-REPAIR-REPORT-2026-08-06.md
audit/decisions-migration-2026-07-29/M4.4-ADJACENT-WHITESPACE-REPAIR-VERIFICATION-2026-08-06.md
audit/decisions-migration-2026-07-29/M5-REPAIR-INDEPENDENT-COLD-REVIEW-FINAL-2026-08-04.md
audit/decisions-migration-2026-07-29/M6-PARTIAL-M6-ONLY-SNAPSHOT-2026-08-04.md.frozen
audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-RESUME-NOTE-SNAPSHOT-2026-08-04.md.frozen
audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-SNAPSHOT-2026-08-04.md.frozen
audit/decisions-migration-2026-07-29/M6-REPAIR-PRE-CENSUS-2026-08-04.md
audit/decisions-migration-2026-07-29/M6-REPAIR-REPORT-2026-08-04.md
audit/decisions-migration-2026-07-29/M6-REPAIR-VERIFICATION-2026-08-04.md
audit/decisions-migration-2026-07-29/POST-ASSEMBLY-DETERMINISTIC-VERIFICATION-2026-08-07.md
audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08-RESUMPTION.md
audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08.md
audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-2-PRESERVATION-SNAPSHOT-REPORT-2026-08-08.md
audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-3-NORMALIZED-ARCHIVE-REPORT-2026-08-08.md
audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-4-TARGET-CONSTRUCTION-REPORT-2026-08-08.md
audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-REPORT-2026-08-11.md
audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-SECTION-9-INDEPENDENT-EXECUTION-RECORD-2026-08-11.md
audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-TARGET-RECONCILE-REPORT-2026-08-11.md
audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-6-CONFORMANCE-WIRING-REPORT-2026-08-12.md
audit/decisions-migration-2026-07-29/STEP-3-SURFACE-MAPPING-2026-08-07.md
audit/decisions-migration-2026-07-29/TASK-2-TASK-3-REMEASUREMENT-2026-08-07.md
~~~

### Block 2 — owner's ratification of the initial census, verbatim

~~~text
I ratify the exact Clause A §1.2 item-13 enumeration in your immediately preceding census return, as measured from live disk on 2026-08-18 with git status --porcelain=v1 --untracked-files=all, without addition, deletion, substitution, or reservation.

The four paths you identified as excluded from item 13 remain outside that enumeration and are governed separately by the frozen order: audit/decisions-migration-2026-07-29/target-text-manifest.md, Archive/DECISIONS-ARCHIVE-2026-08-18.md, Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md, and scripts/decisions-migration-target-reconcile.ts.

This is the owner ratification required by Amendment 5 Clause A §1.2. Preserve this ratification verbatim for later incorporation into the §10 migration receipt.

Proceed under frozen work-order Revision 6, 27486 bytes / SHA-256 734dfe10beb90dc9591e9cb4ea7033f9323e852310223f73eba8ef1d348c84da, from the point immediately following census ratification. Obey all staging, remainder, verification, stop, and commit-boundary requirements exactly.
~~~

### Block 3 — faithful reconstruction of the execution stop before Commit 3

~~~text
Codex stopped before Commit 3 after the three Commit-3 content paths had already been staged: DECISIONS.md, Archive/DECISIONS-ARCHIVE-2026-08-18.md, and Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md. In that staged state, npm run conform:decisions exited 0 with zero findings instead of the frozen order's required pre-Commit-3 exit 1 with exactly one UNTRACKED_PATH naming Archive/DECISIONS-ARCHIVE-2026-08-18.md. Codex treated the mismatch as a stop and did not make Commit 3, amend Commits 1 or 2, or edit governed working-tree bytes. The stop was returned to the owner for adjudication.
~~~

### Block 4 — owner's sequencing-defect adjudication, verbatim

~~~text
Owner stop adjudication, 2026-08-18.

The reported stop is accepted as a sequencing defect in frozen Revision 6, not as evidence of a migration-content or conformance defect.

`npm run conform:decisions` derives tracked paths from plain `git ls-files`, which reads the Git index. Because the three Commit 3 paths had already been staged, `Archive/DECISIONS-ARCHIVE-2026-08-18.md` was already tracked for purposes of the conformance checker, so exit 0 with zero findings is the expected result in that staged state.

The frozen order's required pre-Commit-3 observation is therefore to be made **before Commit 3's paths are staged**. This adjudication does not waive or alter that gate; it restores the index to the state in which the existing gate has its intended meaning.

Preserve Commits 1 and 2 exactly as they are. Do not edit any governed file and do not revise the frozen work order.

Proceed as follows:

1. Unstage **only**:
   - `DECISIONS.md` 
   - `Archive/DECISIONS-ARCHIVE-2026-08-18.md` 
   - `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` 
   Use an index-only operation such as `git restore --staged -- <those three paths>`; do not alter their working-tree bytes.
2. Confirm HEAD remains Commit 2, `4511821`, and the three content paths remain present only in the working tree. 
3. In that unstaged pre-Commit-3 state, run the frozen order's checks. Require:
   - `npm run conform:decisions` → exit 1 with exactly one `UNTRACKED_PATH`, naming `Archive/DECISIONS-ARCHIVE-2026-08-18.md` 
   - `npm run test:decisions-format` → exit 0 
   -  both migration reconciliation commands → exit 0 
   Any different result is a new stop.
4. If and only if those results match, stage exactly the same three Commit 3 paths again. 
5. Verify the staged set is exactly those three paths. Do not stage `package.json`, `.github/workflows/promotion-gate.yml`, or `scripts/decisions-migration-target-reconcile.ts`. 
6. Make Commit 3 under the frozen order. 
7. Immediately verify its author date in `America/New_York` is `2026-08-18`. Any other date is a stop under Amendment 1. 
8. Run the post-Commit-3 checks required by the order. `npm run conform:decisions` must now exit 0 with zero findings, and the format/reconciliation checks must remain exit 0. 
9. Verify the post-Commit-3 working-tree remainder is exactly the three existing Commit 4 paths named above; the three not-yet-created Commit 4 artifacts naturally do not appear in status. 

Do not make Commit 4, push, open a PR, or merge. Return the full measured results.

Preserve this owner adjudication verbatim for incorporation into the eventual §10 migration receipt.
~~~

### Block 5 — architect seat's §8.1 manifest-conformance disposition, verbatim

~~~text
Commission §8.1 — manifest-conformance disposition
Seat: Claude architect seat. Recorded 2026-08-18, adjudicated cold against live disk.
Disposition: ACCEPT — commission §8.1 only.

Question, per commission §8 item 1: did Codex apply the ratified manifest
exactly, preserve bytes, and satisfy the deterministic gates?

LIMB 1 — RATIFIED MANIFEST APPLIED EXACTLY.
This seat read scripts/decisions-migration-target-reconcile.ts at live source
rather than relying on its output labels. Reports 7 and 8 form a bidirectional
pair over the 65 live blocks on a cardinality-checked bijection, comparing exact
heading, statement, field-list, and entry-index-row bytes in both directions
against payloads parsed from the ratified manifest's fenced records. Report 3
pins each of the 13 wrapper bodies to its baseline span by byte length and
SHA-256 and checks the wrapper separator bytes. Amendment 2's eight structural
surfaces are compared byte-for-byte, location-bound, and for global payload
uniqueness. Amendment 4's E053 routing is verified location-bound and unique,
including the positive assertion that the target §8 introduction carries no
archive-index-shaped line. The ratified manifest measures 332579 bytes on live
disk, matching its ratified identity.

RECORDED SCOPE SEAM. The checker prints "Amendment 3 joins [SCOPE]": join bytes
and the end-of-document byte are outside its byte-verification scope. Their
authority is ratified Amendment 3 as covered at Phase 4 closeout, which this seat
adjudicated ACCEPT on 2026-08-11 after independently executing
checkDecisionsFormat against live content (ok: true, issues: [], counts
65/65/65/13/13/6) and performing raw line-indexed adjacency checks at the join
boundaries, including the entry-index-to-declared-total join that produced Phase
1's original stop. The committed target measures 56964 bytes, the same length
verified at Phase 4, and DECISIONS.md has been frozen since. This seat carries
that join verification forward on length identity plus the freeze, not on a
digest computed here.

LIMB 2 — BYTES PRESERVED.
Measured on live disk: Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md at 76314
bytes, equal to the MIGRATION_BASELINE blob length; Archive/DECISIONS-ARCHIVE-
2026-07-14.md at 37094 bytes, unchanged from its Instrument A precondition
measurement; the normalized migration archive present at 13997 bytes.
git status --porcelain=v1 --untracked-files=all shows DECISIONS.md, both Archive
files, the ratified manifest, and the frozen phase-1 artifacts tracked and
unmodified. The only tracked modifications are the pre-existing Phase 6
package.json and .github/workflows/promotion-gate.yml. HEAD is 345d0d9 with the
chain 5b4d2fd -> 4511821 -> 345d0d9 intact and no Commit 4.

LIMB 3 — DETERMINISTIC GATES SATISFIED.
Satisfied on the post-Commit-3 gate results recorded by the owner and on
Instrument A Revision 2, which this seat adjudicated ACCEPT on 2026-08-18 against
live disk.

LIMITS ON THIS DISPOSITION.
No SHA-256 in any return was computed by this seat. Every checkable byte length
corroborates; digests remain producer-self-reported. This seat executed no gate
itself: deterministic-gate satisfaction rests on Codex's execution of scripts
whose source this seat has read. This is the §8.1 review only. It is not the
§8.2 constitutional content review, from which this seat is barred as author of
the migrated statements. Under Amendment 5 Clause C it is prerequisite to merge,
not acceptance of repository conformance.
~~~

## Supplementary item-13 census and owner ratification

# Owner Ratification — Instrument C Revision 2 §8

**Owner ratification, 2026-08-18.**

For Instrument C Revision 2 §8, I ratify the following **exact supplementary item-13 enumeration**:

~~~text
DECISIONS-MIGRATION-STAGE-2B-CLOSEOUT-AND-COMMIT-4-CODEX-HANDOFF-2026-08-18.md
DECISIONS-MIGRATION-STAGE-2B-CLOSEOUT-AND-COMMIT-4-WORK-ORDER-2026-08-18.md
DECISIONS-MIGRATION-STAGE-2B-FINAL-VERIFICATION-CODEX-HANDOFF-2026-08-18.md
DECISIONS-MIGRATION-STAGE-2B-FINAL-VERIFICATION-REVISION-2-CODEX-HANDOFF-2026-08-18.md
DECISIONS-MIGRATION-STAGE-2B-FINAL-VERIFICATION-WORK-ORDER-2026-08-18.md
DECISIONS-MIGRATION-STAGE-2B-FINAL-VERIFICATION-WORK-ORDER-REVISION-2-2026-08-18.md
DECISIONS-MIGRATION-STAGE-2B-INDEPENDENT-CONTENT-REVIEW-CODEX-HANDOFF-2026-08-18.md
DECISIONS-MIGRATION-STAGE-2B-INDEPENDENT-CONTENT-REVIEW-WORK-ORDER-2026-08-18.md
audit/decisions-migration-2026-07-29/INDEPENDENT-CONTENT-REVIEW-2026-08-18.md
audit/decisions-migration-2026-07-29/MIGRATION-RECEIPT.md
audit/decisions-migration-2026-07-29/post-migration-reference-graph.json
~~~

This ratification is limited to that exact enumeration for the purpose required by §8. It does not independently ratify the substantive contents, findings, or conclusions of any enumerated artifact, and it does not enlarge or otherwise modify Instrument C Revision 2.

**OWNER RATIFICATION: RATIFIED.**

Owner ratification, 2026-08-18.

I explicitly ratify the following exact supplementary census for Instrument D:

1. `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-6-CLOSEOUT-EVIDENCE-REPAIR-2026-08-18.md`
2. `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-6-RATIFICATION-2026-08-18.md`
3. `DECISIONS-MIGRATION-STAGE-2B-CLOSEOUT-EVIDENCE-REPAIR-CODEX-HANDOFF-2026-08-18.md`
4. `DECISIONS-MIGRATION-STAGE-2B-CLOSEOUT-EVIDENCE-REPAIR-WORK-ORDER-2026-08-18.md`

This ratification is limited to that exact enumeration and authorizes continuation from the §7 stop boundary in accordance with the controlling Instrument D work order. No additional path is ratified by implication.
