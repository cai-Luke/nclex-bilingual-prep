# M4 Owner anaphora verification — 2026-08-05

Verifier: Codex deterministic-verification seat
Commission: DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-ANAPHORA-REPAIR-WORK-ORDER-2026-08-05.md, revision 3, §9.
Scope: verification only. This file is the sole repository write by this seat.

## Method and measurement contract

No project measurement script or generator was trusted for a result. All text comparisons, UTF-8 checks, SHA-256 digests, unified-diff application, and set calculations were direct read-only Node standard-library operations. Git was used only for branch, HEAD, index/worktree, baseline-object, and tracked-path checks.

The prior M6 verification's published unified diff was read and applied in memory to the frozen resume snapshot. It reconstructed the independently pinned post-M6 identity before serving as this verification's pre-M4-repair null.

The revision-3 order was independently measured at the beginning:

    bytes=33084
    sha256=aadca7b586c795ac6e08ede55ab4dd06329ecfddee02965c1ea8a0a726df48ea
    header=**Revision:** 3

That equals the owner-supplied repair-report §1 identity. Revisions 1 and 2 were not verification subjects.

## V1 — manifest change boundary

Method: I replaced the current item-10 Owner substrings at M4.3, M4.7, and M4.11 with the known pre-repair text Owner — OMIT; same reason, preserving trailing whitespace owned by each opened substring. The inverse manifest was SHA-256 checked against the independent post-M6 null, then the three captured current substrings were reapplied and the complete result compared to live disk.

Independent null: 313733 bytes / bc01e0be8d4ed291e0fe1ab21ccae088ff96be08a5ab50f129c1b5fcb771c264.

| record | pre bytes / SHA-256 | current bytes / SHA-256 |
|---|---|---|
| M4.3 | 33 / dd38c16e0cd59b3ddc972fd22f5d98b41175af47f5df37159a676754103067e1 | 319 / 3d0ee0b9a949ac89643e81040506643257cc06679b4feedcb93612c5e9e7ffd6 |
| M4.7 | 37 / 77aef568ff39a4a359892dbeee5ca1f1b0cb8a99fdbdca91d2ab8aae3458efc3 | 319 / e1d1ce93a0151ea3584318b761b53d88ae3aa33582e87426b932fa0802efb27c |
| M4.11 | 33 / dd38c16e0cd59b3ddc972fd22f5d98b41175af47f5df37159a676754103067e1 | 223 / eb6a3f8e33c188f3c0ecf7758c4289e5cd9b5da9c5cc285ca8f88d8e5190b4f5 |

Observed: the inverse is exactly the null; reapplication of exactly those three substrings recreates live disk exactly. Live manifest identity: 314491 bytes / 877941d8af310567abe8c8510c1f551013faa0221f9c1dadf79d8feb98db4e46.

Disposition: PASS. Exactly the three authorized Owner substrings changed; the full-file round trip proves no change outside them.

## V2 — fifteen Evidence repairs preserved

Method: for every commissioned record, I sliced the Evidence bytes through immediately before Owner in both the V1-reconstructed pre-repair manifest and live manifest. Null: byte equality. The adjacent records remain individual rows.

    M4.3   same  bytes=221  sha256=65c30eb74b2e186452bdbd47f16a8b19bdf32ef029f55e361fc8a7a2d2455d0f
    M4.5   same  bytes=297  sha256=3c33085b73767a8991e651be10b622bb5138fcee14638564ebc5542db86022e5
    M4.7   same  bytes=221  sha256=d7fcf2005d5a9d530c6205b60e8e68919ed0a72ed469b281019a10f143571fef
    M4.9   same  bytes=399  sha256=506a11e35e38d91c5bc26c79964d54f52d3b78c25ee2816f6edb14c3dda55c0c
    M4.11  same  bytes=215  sha256=aa33433f7237b47866880cca48b7a7191b68595d33f2cd3af2902234d62bc376
    M4.12  same  bytes=211  sha256=ca8e4da2757a7b2dd6d626096f9a3e7973626d9fcc0d8d29d79af2cb29f1b1db
    M4.14  same  bytes=992  sha256=8d6256c6bbbf2381de890a17d9ed63b1110d26f6be5f8876e9d01f3912a33895
    M4.15  same  bytes=178  sha256=ba01e043e50a5b1ab939a8a43fdb4feba031485a9a0603d5cddeb1342de6a79f
    M4.22  same  bytes=291  sha256=38e5c63b6fceb8227695b8570ef9a293e39d95f39dd86a67805cd7d9a60e91b6
    M4.26  same  bytes=773  sha256=99ca5f9f22b52306fae9127acec6e3e2a0edf1f2ee4219e63206ebfb25efc5c8
    M4.28  same  bytes=407  sha256=30d36225328b0cdf4a77c06d65142a61a946d683eb1644a707df320fe032a46e
    M4.30  same  bytes=235  sha256=e98210cc36b2b20a7e0d4bbf90d3ed7b8f6e347d40f1abf3aa68913a8a2bcef7
    M4.31  same  bytes=409  sha256=aa9aac2f6a7e542d27a0ea9fa6431f54f3f45f52927a1f77bb5333e479f661ad
    M4.33  same  bytes=307  sha256=3f2578f9c6c72ed45546bfeb1ef7c6d1fad4804405ba5c59d9f12e74497e7279
    M4.40  same  bytes=444  sha256=c373b60b4214effa35fba43ec942fdb4af9e13451de2814bcd3b1c8998a8ab34

Disposition: PASS. All fifteen are identical, including adjacent M4.3, M4.7, and M4.11.

## V3 — M6 byte identity

Method: current bytes were compared with the V1-reconstructed pre-repair manifest. Null: exact equality.

| surface | bytes | SHA-256 | observed |
|---|---:|---|---|
| all M6 | 44021 | 526fec7465e50dab4c39b35bca90e44a9c4ee8759894883245e7d40a05b42bf1 | identical |
| M6.1 | 3579 | 0216a4e02240a9c7017ba1819923234546643020245909c1290e1893d3a7212a | identical |
| M6.3 row 3 | 71 | 3eb9d83bd9a8d48ef8b923a4e67cbee567747fe36141f895ae0c03cb96ac22c2 | identical |
| M6.3 row 11 | 112 | 3bf80a58c819a5c51ee87cdfe1b23d6c21b14b9cf75a88876b23852fc5be594c | identical |
| M6.3 row 19 | 74 | 85198fb91b7f828b41953db67d54422df1be037d9ece9b12a6e5f1a529bc7dda | identical |
| M6.4 | 2987 | b43801d96b4c5ef14b4abcbe0bae95541016c10a97cbcfa4d6f58f10b4fe102e | identical |
| M6.7 | 3085 | 6acc67c221e90270c352b5d39b5b217d97f613816320dfa01629e7922f91d289 | identical |
| M6.10 | 2679 | 6af86fa91aaa8c5221ffbd476ff1faef2400ba34fe05e1954f21a229a7a769d7 | identical |

Disposition: PASS.

## V4 — optional-field populations

Method: I independently enumerated all 65 M4 records and counted explicit field — OMIT occurrences inside item 10 only. Null: the V1-reconstructed count.

| field | before | after |
|---|---:|---:|
| Authorized | 63 | 63 |
| Not authorized | 61 | 61 |
| Evidence | 59 | 59 |
| Owner | 51 | 51 |
| Execution | 23 | 23 |

Disposition: PASS.

## V5 — governed field-path population

Method: independently parse present Evidence and Owner values from every item-9 code fence in all 65 M4 records, before and after V1 reversal; then independently parse M6.4 and resolve its row-10 pointer via M0.1.

Both item-9 derivations: 20 instances, 19 distinct paths, exact sorted-set equality, no left-only or right-only instance. src/schema.ts is the only duplicate, with two instances. M6.4 independently yields 20 rows and exact (record, field, path) set equality in both directions.

The direct item-9 population is:

    M4.2 Owner lib/shuffle.ts
    M4.14 Owner scripts/patch-raw.ts
    M4.17 Owner scripts/audit/non-mcq-bias-lib.ts
    M4.26 Owner src/examLayout.ts
    M4.36 Evidence audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json
    M4.37 Evidence audit/lab-reference-range-verification-2026-07-19.md
    M4.41 Evidence Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md
    M4.41 Owner src/measurementAllowlist.ts
    M4.42 Evidence Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md
    M4.45 Evidence Archive/DECISIONS-ARCHIVE-2026-08-11.md
    M4.49 Owner src/schema.ts
    M4.50 Evidence docs/AGENTS-RUNBOOK.md
    M4.51 Owner scripts/audit/audit-ids.ts
    M4.52 Owner lib/canonical-routing.ts
    M4.53 Owner scripts/consolidate.ts
    M4.57 Owner src/visuals/primitives/graphPaper.ts
    M4.58 Owner src/schema.ts
    M4.60 Owner src/sessionSampler.ts
    M4.61 Owner AGENTS.md
    M4.62 Owner src/topics.ts

M0.1's normalized archive filename is Archive/DECISIONS-ARCHIVE-2026-08-11.md; it is byte-equal to E038/M4.45 Evidence and is the sole future-output exemption. Git ls-files --error-unmatch returned exit 0 and the exact requested path for each of the remaining 18 distinct paths.

Disposition: PASS. 18 tracked paths and one valid exemption; M6.4 is equal to the independently derived population.

## V6 — manifest integrity

Method: direct byte scan and fatal UTF-8 decode.

    strict UTF-8=true; U+FFFD=0; CRLF=0; bare CR=0; final LF=true
    @@ASSEMBLY_CURSOR@@ count=1; terminal=true
    literal 2026-08-11 count=63
    bytes=314491; physical lines=5943
    sha256=877941d8af310567abe8c8510c1f551013faa0221f9c1dadf79d8feb98db4e46

Disposition: PASS.

## V7 — resume note

Method: applying the published M6 unified diff to the frozen snapshot (55424 bytes / e27fd31d1fd497c7a64a73126438f7981ecc206689aee6ac21eb60add38afa8a) recreates the post-M6 null exactly: 59782 bytes, 851 physical lines, and 7395262c1772a945957a1f1d735af1dd1f9335c970400a2f6bb6c2099778f18d.

I then reversed S1–S4 from the current note: remove rule 35, leave the already-correct S2 line unchanged, and restore S3 plus S4a/S4b from that reconstructed post-M6 note. Result: the same exact 59782 / 851 / 739526…f18d identity. Thus reversal recreates the pre-M4-repair note byte-for-byte.

Current resume note: 65124 bytes, 915 physical lines, SHA-256 19f796d1e60ca433460f2703eb47d44255da1ae1c6c3720e397bdf695796cbf2.

Ruling-record boundaries are numbered header through final content line; separator blank lines are delimiters. Under that boundary, each existing ruling compares byte-identically:

    1=PASS, 2=PASS, 3=PASS, 4=PASS, 5=PASS, 6=PASS, 7=PASS, 8=PASS, 9=PASS, 10=PASS, 11=PASS, 12=PASS, 13=PASS, 14=PASS, 15=PASS, 16=PASS, 17=PASS
    18=PASS, 19=PASS, 20=PASS, 21=PASS, 22=PASS, 23=PASS, 24=PASS, 25=PASS, 26=PASS, 27=PASS, 28=PASS, 29=PASS, 30=PASS, 31=PASS, 32=PASS, 33=PASS, 34=PASS

Exactly rule 35 is added; there is no rule 36. The raw diff's only extra byte adjacent to rule 34 is the separator blank line before the inserted rule, not rule-34 content. The Updated line is byte-identical on both states: Updated 2026-08-05, Seat Architect. The only other resume-note hunks are the allowed S3 block and S4a/S4b Cursor spans; no later Cursor byte changes.

Disposition: PASS.

## V8 — immutable revision-3 order

Method: independent wc -c and shasum -a 256 measurements at verification opening and after all deterministic checks.

| measurement | bytes | SHA-256 | revision |
|---|---:|---|---:|
| opening | 33084 | aadca7b586c795ac6e08ede55ab4dd06329ecfddee02965c1ea8a0a726df48ea | 3 |
| closing | 33084 | aadca7b586c795ac6e08ede55ab4dd06329ecfddee02965c1ea8a0a726df48ea | 3 |

Disposition: PASS. Repair report §7 still says the closing measurement is owed. Under the actual revision-3 order, the owner-supplied fresh closing measurement and both independent V8 measurements discharge that requirement. The stale §7 wording is therefore one ADVISORY outside V1–V10, not a V8 failure and not authority to edit the report.

## V9 — repository boundary

Method: direct Git identity, index, worktree, baseline-object, and status checks.

    branch=codex/decisions-migration
    HEAD=05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5
    git diff --cached --quiet exit=0
    git diff --quiet exit=0
    MIGRATION_BASELINE=d499cc1d0916e03830489ec9cd0324cd1a203a73
    baseline DECISIONS.md sha256=b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e
    live DECISIONS.md bytes=76314 sha256=b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e

Git status reports 34 entries. Every entry is ?? and either a root DECISIONS-MIGRATION Stage 2a artifact or audit/decisions-migration-2026-07-29/; no staged or modified tracked entries exist. The expected untracked Stage 2a worktree is preserved.

Disposition: PASS.

## V10 — same-reason finding population

Method: literal searches restricted to each item's item-10 span.

| item-10 span | occurrences of same reason |
|---|---:|
| M4.3 | 0 |
| M4.7 | 0 |
| M4.11 | 0 |
| M4.4 | 1 |

Disposition: PASS. M4.4 is expected-present outside V10's finding population; its merits are reserved and unadjudicated.

## D1 — item-10 backticked repository-path mentions

Method: across all 65 M4 item-10 spans, enumerate backticked root-filename or slash-path values and compare before/after multisets.

    path                                                                                           before after
    AGENTS.md                                                                                           3     4
    Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md     1     1
    BANK-REVIEW-LEDGER.md                                                                               1     2
    EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md                                                 4     4
    lib/authorial-constraint-leakage.ts                                                                 1     1
    lib/producer-vocabulary-leakage.ts                                                                  1     1
    lib/question-population.ts                                                                          1     1
    NCLEX-Question-Schema.md                                                                            1     1
    PROJECT-HISTORY.md                                                                                  1     1
    scripts/audio/build-tts-queue.ts                                                                    1     1
    scripts/audit/audit-non-mcq-bias.ts                                                                 1     1
    scripts/audit/build-audit-batch.ts                                                                  1     1
    scripts/audit/early-bank-semantic-layer-a.ts                                                        1     1
    scripts/audit/non-mcq-bias-layer-b.ts                                                               1     1
    scripts/audit/non-mcq-bias-lib.ts                                                                   1     1
    scripts/census.ts                                                                                   1     1
    scripts/coverage-report.ts                                                                          1     1
    scripts/exhibit-flowsheet-gate.ts                                                                   1     1
    scripts/fix-bank-quotes.ts                                                                          1     1
    scripts/patch-raw.ts                                                                                2     2
    src/App.tsx                                                                                         2     2
    src/audio/normalizeForTts.ts                                                                        2     2
    src/examLayout.ts                                                                                   1     1
    src/grading.ts                                                                                      1     1
    src/measurementAllowlist.ts                                                                         3     3
    src/measurementUnitPolicy.ts                                                                        2     2
    src/schema.ts                                                                                       6     6
    src/sessionSampler.ts                                                                               2     2
    src/types.ts                                                                                        2     2
    src/visuals/kinds/lab_trend/defs.ts                                                                 1     1
    src/visuals/kinds/lab_trend/index.ts                                                                1     1
    src/visuals/kinds/vitals_trend/index.ts                                                             1     1

Differences: AGENTS.md is 3 → 4 because M4.3's authorized Owner replacement names it once. BANK-REVIEW-LEDGER.md is 1 → 2 because M4.7's authorized Owner replacement names it once in addition to unchanged Evidence prose. M4.11 adds none. Both differences are inside opened Owner substrings.

Result: PASS diagnostic. No difference lies outside the three opened substrings.

## Findings

| Class | Count | Finding |
|---|---:|---|
| BLOCKER | 0 | None. |
| REQUIRED REPAIR | 0 | None; this verification authorizes no repair. |
| ADVISORY | 1 | Repair report §7's owed-closing-measurement wording is stale against the actually satisfied V8 rule; it remains unedited. |

## Final receipt

| check | disposition |
|---|---|
| V1 | PASS |
| V2 | PASS |
| V3 | PASS |
| V4 | PASS |
| V5 | PASS |
| V6 | PASS |
| V7 | PASS |
| V8 | PASS |
| V9 | PASS |
| V10 | PASS |
| D1 | PASS diagnostic |

Output path: audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-VERIFICATION-2026-08-05.md.

Current branch / HEAD: codex/decisions-migration / 05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5.

Measured identities: manifest 314491 / 877941d8af310567abe8c8510c1f551013faa0221f9c1dadf79d8feb98db4e46; resume note 65124 / 19f796d1e60ca433460f2703eb47d44255da1ae1c6c3720e397bdf695796cbf2; work order 33084 / aadca7b586c795ac6e08ede55ab4dd06329ecfddee02965c1ea8a0a726df48ea at both V8 measurements.

The verification file's final self-identity is reported in the external final receipt. Recording its own final digest inside these bytes would alter the measured object.

No repair, staging, commit, push, cleanup, reset, stash, or checkout occurred. The order's §10 GPT confirming read is authorized to begin. The derived date-occurrence report and every later migration step remain unstarted.
