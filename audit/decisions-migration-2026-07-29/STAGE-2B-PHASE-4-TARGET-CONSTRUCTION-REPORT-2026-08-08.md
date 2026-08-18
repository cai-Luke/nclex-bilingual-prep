# Stage 2b Phase 4 — Target Construction Report

**Date:** 2026-08-08 · **Seat:** Codex · **Phase:** commission §5.6 only

## 1. Opening measurement (Step 1)

- Branch: `codex/decisions-migration` — PASS.
- HEAD: `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` — PASS.
- Staged paths: none — PASS.
- Modified tracked paths: exactly `lib/decisions-format.ts` and `scripts/tests/decisions-format.ts` — PASS.

| Path | Expected | Observed | Result |
|---|---:|---:|---|
| `DECISIONS.md` | `76314` / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | `76314` / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | PASS |
| `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` | `76314` / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | `76314` / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | PASS |
| `Archive/DECISIONS-ARCHIVE-2026-08-18.md` | `13997` / `e75e979ea121fa1a697861f8de4a4527f07ef2d8b7ed1f4d299bf504163e873c` | `13997` / `e75e979ea121fa1a697861f8de4a4527f07ef2d8b7ed1f4d299bf504163e873c` | PASS |
| `audit/decisions-migration-2026-07-29/target-text-manifest.md` | `332579` / `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` | `332579` / `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` | PASS |
| `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-STRUCTURAL-SURFACES-2026-08-08.md` | `24202` / `4cb16995cf8810bcf3ee65ffb07dc32a14a4fb5b0c4adc8ba5bbb2a2a535e9f4` | `24202` / `4cb16995cf8810bcf3ee65ffb07dc32a14a4fb5b0c4adc8ba5bbb2a2a535e9f4` | PASS |
| `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-ASSEMBLY-JOINS-2026-08-08.md` | `26963` / `9a1a3a898bf847d8dbe760c7aba702f3a3c3c3381c760bba989ffa5b8542944e` | `26963` / `9a1a3a898bf847d8dbe760c7aba702f3a3c3c3381c760bba989ffa5b8542944e` | PASS |
| `lib/decisions-format.ts` | `47075` / `10e59335d02eb90163b465570c4e467323d3ff9d224585774e264846590fe1e4` | `47075` / `10e59335d02eb90163b465570c4e467323d3ff9d224585774e264846590fe1e4` | PASS |
| `scripts/tests/decisions-format.ts` | `41335` / `251b55697b202845e805201c7f972c54bac2688e9156b6ba598e11454a75d15f` | `41335` / `251b55697b202845e805201c7f972c54bac2688e9156b6ba598e11454a75d15f` | PASS |

Opening `git status --porcelain=v1 --untracked-files=all`:

```text
 M lib/decisions-format.ts
 M scripts/tests/decisions-format.ts
?? Archive/DECISIONS-ARCHIVE-2026-08-18.md
?? Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-RATIFICATION-2026-08-08.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-STRUCTURAL-SURFACES-2026-08-08.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-ASSEMBLY-JOINS-2026-08-08.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-RATIFICATION-2026-08-08.md
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
?? DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2A-TASK-2-TASK-3-REMEASUREMENT-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-1-CLOSEOUT-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-1-CODEX-HANDOFF-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-1-F16-CORRECTION-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-2-CLOSEOUT-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-2-CODEX-HANDOFF-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-2-PRESERVATION-SNAPSHOT-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-3-CLOSEOUT-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-3-CODEX-HANDOFF-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-3-NORMALIZED-ARCHIVE-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-4-CODEX-HANDOFF-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-4-TARGET-CONSTRUCTION-WORK-ORDER-2026-08-08.md
?? audit/decisions-migration-2026-07-29/DATE-OCCURRENCE-CENSUS-2026-08-07.md
?? audit/decisions-migration-2026-07-29/DERIVED-REPORT-STEP-6-VERIFICATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/DERIVED-REPORT-VALIDATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FOUR-FINDING-REPAIR-REPORT-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FOUR-FINDING-REPAIR-VERIFICATION-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-DISPOSITION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-A-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-B-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-C-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-D-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-E-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-REVIEW-NARROW-RECOMMISSION-SUPPLEMENTAL-DISPOSITION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-COMMISSION-STATUS-RECORD-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-DISPOSITION-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-A-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-B-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-C-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-D-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-E-2026-08-06.md
?? audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-REPAIR-REPORT-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-VERIFICATION-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-OWNER-CONFIRMING-READ-RERUN-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-OWNER-CONFIRMING-READ-VOID-RECEIPT-ADJUDICATION-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-RESERVATION-RECORDING-CONFIRMATION-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-RESERVATION-RECORDING-REPAIR-REPORT-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4.35-EXCLUSIVITY-REPAIR-REPORT-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.35-EXCLUSIVITY-REPAIR-VERIFICATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.35-SENTENCE-COUNT-CONFIRMING-READ-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.35-SENTENCE-COUNT-REPAIR-REPORT-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.35-SENTENCE-COUNT-REPAIR-VERIFICATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.4-ADJACENT-WHITESPACE-REPAIR-REPORT-2026-08-06.md
?? audit/decisions-migration-2026-07-29/M4.4-ADJACENT-WHITESPACE-REPAIR-VERIFICATION-2026-08-06.md
?? audit/decisions-migration-2026-07-29/M5-REPAIR-INDEPENDENT-COLD-REVIEW-FINAL-2026-08-04.md
?? audit/decisions-migration-2026-07-29/M6-PARTIAL-M6-ONLY-SNAPSHOT-2026-08-04.md.frozen
?? audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-RESUME-NOTE-SNAPSHOT-2026-08-04.md.frozen
?? audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-SNAPSHOT-2026-08-04.md.frozen
?? audit/decisions-migration-2026-07-29/M6-REPAIR-PRE-CENSUS-2026-08-04.md
?? audit/decisions-migration-2026-07-29/M6-REPAIR-REPORT-2026-08-04.md
?? audit/decisions-migration-2026-07-29/M6-REPAIR-VERIFICATION-2026-08-04.md
?? audit/decisions-migration-2026-07-29/POST-ASSEMBLY-DETERMINISTIC-VERIFICATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08-RESUMPTION.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-2-PRESERVATION-SNAPSHOT-REPORT-2026-08-08.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-3-NORMALIZED-ARCHIVE-REPORT-2026-08-08.md
?? audit/decisions-migration-2026-07-29/STEP-3-SURFACE-MAPPING-2026-08-07.md
?? audit/decisions-migration-2026-07-29/TASK-2-TASK-3-REMEASUREMENT-2026-08-07.md
?? audit/decisions-migration-2026-07-29/target-text-manifest.md
```

Located exported functions, read directly from `lib/decisions-format.ts`:

- `parseDecisionsDocument(text: string, source = "DECISIONS.md"): ParsedDecisionsDocument`
- `checkDecisionsFormat(input: ConformanceInput): ConformanceResult`

## 2. Candidate construction record (Step 2)

Scratch candidate: `/tmp/project-shrimp-phase4.obNF8Y/DECISIONS.candidate.md` (56964 bytes / SHA-256 `3dc5dbc0c6acbfe4f74fa353b80d53c7feeec4f5ada0a42d7b9773f26c26f4a8`).
The scratch path is outside the repository. Fragment payloads exclude the trailing line terminator before each source closing fence, per ratified Amendment 3 §2.1.

| Target section | Source sequence |
|---|---|
| §1 | Ratified manifest M2 fenced payload. |
| §2 | Ratified manifest M3 fenced payload. |
| §3 | Ratified Amendment 2 §2.1; Amendment 2 §2.2 header/separator; all 65 manifest M4 item-11 rows in M4.0 order; Amendment 2 §2.2 declared total. |
| §4 | Ratified Amendment 2 §2.3 §4 heading/transition; manifest M4.2–M4.38 items 7–9 in order. |
| §5 | Ratified Amendment 2 §2.3 §5 heading/transition; manifest M4.39–M4.44 items 7–9 in order. |
| §6 | Ratified Amendment 2 §2.3 §6 heading/transition; manifest M4.45–M4.63 items 7–9 in order. |
| §7 | Ratified Amendment 2 §2.3 §7 heading/transition; manifest M4.64–M4.66 items 7–9 in order. |
| §8 | Ratified manifest M5.4; manifest M5.6 as one uninterrupted fragment; manifest M5.7 as one uninterrupted fragment. |

### Fragment construction/provenance ledger

| # | Fragment | Section | Exact source | Bytes | SHA-256 |
|---:|---|---|---|---:|---|
| 1 | `M2` | §1 | Ratified manifest M2 fenced payload | 2180 | `e26836b2111a8f0ea5b0230efe95f68b7a05339fb5949a65415f9c5a294a6890` |
| 2 | `M3` | §2 | Ratified manifest M3 fenced payload | 3775 | `f29f4d5b905142806b0a49b55b4f95c02e64fd8a2e0ffa905160f4529a4261fe` |
| 3 | `A2-2.1` | §3 | Ratified Amendment 2 §2.1 fenced payload | 252 | `100a9e36cfd53c7e75a180a7fe38143791d6b6e15df085dbc0f3edb8011091aa` |
| 4 | `A2-2.2-header` | §3 | Ratified Amendment 2 §2.2 first fenced payload (header + separator) | 62 | `0fa172e58b411b4cb0f615f0000622303335e9913e0892e5c08221ed06fdaf0f` |
| 5 | `M4.2-item11` | §3 | Ratified manifest M4.2 item 11 | 65 | `94986bb984fbb2a0d66d12595fc9918b4c38efb7c7a8817c2692aaeb9810ec35` |
| 6 | `M4.3-item11` | §3 | Ratified manifest M4.3 item 11 | 72 | `96af5b9149175f15cde9286c494f30938fd95e6006c5604c1e31136c998316f2` |
| 7 | `M4.4-item11` | §3 | Ratified manifest M4.4 item 11 | 91 | `90e56f880e4160e3c8b99e44c1db2766f806a3f6ebe6f9879732c9aa9cf2e49f` |
| 8 | `M4.5-item11` | §3 | Ratified manifest M4.5 item 11 | 76 | `2dcda73ff1c22f668b9b79b5c2a3fd487f4f6824d89a88510a23b3eaeaef3fcb` |
| 9 | `M4.6-item11` | §3 | Ratified manifest M4.6 item 11 | 78 | `78d295962d7581309f9e2451db068042c540e9db23d02f982d65978be15964e1` |
| 10 | `M4.7-item11` | §3 | Ratified manifest M4.7 item 11 | 57 | `021ba782e61904af9bd25e3338107df4ec17be44a89be1c624c28bb0af700029` |
| 11 | `M4.8-item11` | §3 | Ratified manifest M4.8 item 11 | 87 | `4815279893bb0cb02c77fffdd039cd01eba80f4edec8981ffb64e076fc4709ae` |
| 12 | `M4.9-item11` | §3 | Ratified manifest M4.9 item 11 | 94 | `537ed3e9c8da5afcff26608bdd619f10f5f5bef7da1ca2a5bc09fb755009e14c` |
| 13 | `M4.10-item11` | §3 | Ratified manifest M4.10 item 11 | 54 | `bb4e9c64cea3447f453c26ade2a73990d9160ca8a47ac667e5f66d9ac4da04d7` |
| 14 | `M4.11-item11` | §3 | Ratified manifest M4.11 item 11 | 92 | `a1a59f6c86d9d0c66fda63eadefc003a46b51b6bf60ac162cafd0c8b5025ca62` |
| 15 | `M4.12-item11` | §3 | Ratified manifest M4.12 item 11 | 76 | `94123e5ba24b41b0b4d13c00e233674b05c91e8fd8a7fd4f240f13c951762177` |
| 16 | `M4.13-item11` | §3 | Ratified manifest M4.13 item 11 | 95 | `56eadac29bafeee12eff7d31c884d1b082c365abf7afc6d2459fe6f96ab16323` |
| 17 | `M4.14-item11` | §3 | Ratified manifest M4.14 item 11 | 76 | `f81ac19eb062e3d7d0e26913a2e17d48b7129600e7d229eda408d19edc5fe9e5` |
| 18 | `M4.15-item11` | §3 | Ratified manifest M4.15 item 11 | 95 | `002bd039088841aed54076738a8a31786216ae9c320a8d5c880956cf7c8ea671` |
| 19 | `M4.16-item11` | §3 | Ratified manifest M4.16 item 11 | 74 | `ccf820cd390c1550c81ea494a32fee356db92f3c07d56cc3c992eafc18f223d9` |
| 20 | `M4.17-item11` | §3 | Ratified manifest M4.17 item 11 | 96 | `5bca3f5e6e597389920cafe052cf8df2553343de76b6a08b53cf5b27c5239a01` |
| 21 | `M4.18-item11` | §3 | Ratified manifest M4.18 item 11 | 92 | `32ba82a3935c7f6af884d82dbc73f37795eb30e30707f25cb30c404f107a4e0b` |
| 22 | `M4.19-item11` | §3 | Ratified manifest M4.19 item 11 | 79 | `4844a550635ba17c17d100bb482979f90c87ad8c97f059461377eeab628d9002` |
| 23 | `M4.20-item11` | §3 | Ratified manifest M4.20 item 11 | 87 | `859a9deda0df843d07b9fd11a7eb9d69434bbc2f16ad9f71e90f3aa77222754a` |
| 24 | `M4.21-item11` | §3 | Ratified manifest M4.21 item 11 | 86 | `b751a5f8b694441453193f4b3ef7336ecab6d5b02c80747fe6f65801054f4e06` |
| 25 | `M4.22-item11` | §3 | Ratified manifest M4.22 item 11 | 89 | `12860407e160df76c98042dc2587794cf1d94251e6a2a5f0a94fc95d9a915327` |
| 26 | `M4.23-item11` | §3 | Ratified manifest M4.23 item 11 | 97 | `1392ba43c3703185f3e672758afb4274a04c153ee5d40e31d21e2d32b6b258d5` |
| 27 | `M4.24-item11` | §3 | Ratified manifest M4.24 item 11 | 97 | `b94caf9b24a98758f0f1510f386d68a53b44cd623c64df4781c3ad83688aee34` |
| 28 | `M4.25-item11` | §3 | Ratified manifest M4.25 item 11 | 77 | `2952b9fc0588c01435966d9fb87be039ee6561dfd4c8409a8c62488f7d53ea10` |
| 29 | `M4.26-item11` | §3 | Ratified manifest M4.26 item 11 | 75 | `5123346dd8076991c5e91f4d7fee8773c15578b97a42f0c731d5820e1c053450` |
| 30 | `M4.27-item11` | §3 | Ratified manifest M4.27 item 11 | 104 | `bca413b542615d9981d12147ed61bbb4088f3b8f6e35bbdd97648dad6bc8625d` |
| 31 | `M4.28-item11` | §3 | Ratified manifest M4.28 item 11 | 93 | `12bd504365c1c4de354773d0df0b239998dda063a94a8497d5c4627e8a1428fc` |
| 32 | `M4.29-item11` | §3 | Ratified manifest M4.29 item 11 | 72 | `03f022115cd0a0659ea0b54e54b0c6c9746167cc328cbf13383149a912c83e1d` |
| 33 | `M4.30-item11` | §3 | Ratified manifest M4.30 item 11 | 71 | `4ac47f196335915e1f286c78525304a6a45f3f50fcff27b30880b2992b4dcc53` |
| 34 | `M4.31-item11` | §3 | Ratified manifest M4.31 item 11 | 100 | `2e71c23e5241c51ae7a2da95961fea96c526a978705c02d6e8c9a902f510e89d` |
| 35 | `M4.32-item11` | §3 | Ratified manifest M4.32 item 11 | 103 | `80f617a4f80a511ef84b5906618bc54a0cae28f80eccf1f8418274908e00b280` |
| 36 | `M4.33-item11` | §3 | Ratified manifest M4.33 item 11 | 93 | `0d548de4f55c8b32221c94db748a10de63ca6036f261c81ff7c071126074218f` |
| 37 | `M4.34-item11` | §3 | Ratified manifest M4.34 item 11 | 89 | `1ea73aaab2a90e3009cad5c6253fa035c98c37b92400a65a58a266660414d409` |
| 38 | `M4.35-item11` | §3 | Ratified manifest M4.35 item 11 | 93 | `7d4abc384a22f67656df4062e55f297e0ff8067927cc385f08e72dd21f51b6ff` |
| 39 | `M4.36-item11` | §3 | Ratified manifest M4.36 item 11 | 99 | `9fdcdf772f9c2a4215a3bf3deb875fe9a664abf4217e70d2810d9a4e9ac55407` |
| 40 | `M4.37-item11` | §3 | Ratified manifest M4.37 item 11 | 99 | `a4ab9abea087d67a1042280c611c2d35cebc307d26b8e8d86bb03cc7d0fdeb73` |
| 41 | `M4.38-item11` | §3 | Ratified manifest M4.38 item 11 | 63 | `538bc38bc1578400b31349eb604b545779c5b94caf4030706bc26d3abb8ed7ae` |
| 42 | `M4.39-item11` | §3 | Ratified manifest M4.39 item 11 | 79 | `58baa6474ebe05f20cc73244655078c900e8f1f7e5ff18d16db156849443bb0e` |
| 43 | `M4.40-item11` | §3 | Ratified manifest M4.40 item 11 | 87 | `03877af59a9be0557e5803d2902b20ca49a416ca7a912e293ac99b77370cab09` |
| 44 | `M4.41-item11` | §3 | Ratified manifest M4.41 item 11 | 67 | `d58d7bc5faac51c5a843cbc3f57f895f9eaa6f7296520484ad231efd9319efa6` |
| 45 | `M4.42-item11` | §3 | Ratified manifest M4.42 item 11 | 87 | `05824ba42cc607367cacc155351cf29f66434e5a21d1d448e9ddfcf8d4995dfe` |
| 46 | `M4.43-item11` | §3 | Ratified manifest M4.43 item 11 | 80 | `96b834c95a71802538b67786e94c5a12b920d10a048bb49f2fc0f3a0053930cd` |
| 47 | `M4.44-item11` | §3 | Ratified manifest M4.44 item 11 | 88 | `6d28f95863b7a707630a1467bdabb91d146c9e588cad21bddc6d630394ae7687` |
| 48 | `M4.45-item11` | §3 | Ratified manifest M4.45 item 11 | 101 | `63e5a0a4d61865e76d1448dd4616301577651f6d7730c5766c33321ef0b5e8f5` |
| 49 | `M4.46-item11` | §3 | Ratified manifest M4.46 item 11 | 97 | `ac41d8708cae63787d20f49dfb3bcbef347eb145e0cbb111ed230b07b4ee8795` |
| 50 | `M4.47-item11` | §3 | Ratified manifest M4.47 item 11 | 80 | `28c1b601a1beace6b2afa48edb383cedb30014b8533143932c4bffc88e3db1ea` |
| 51 | `M4.48-item11` | §3 | Ratified manifest M4.48 item 11 | 102 | `b3799a732a3c554dbc2b31a8c59a6eba086c126658b50e004585e0b60b814f5d` |
| 52 | `M4.49-item11` | §3 | Ratified manifest M4.49 item 11 | 62 | `879e0b4831abc39306ad51c210254f71ae5462c7d2c18d114095db91fd195eaa` |
| 53 | `M4.50-item11` | §3 | Ratified manifest M4.50 item 11 | 72 | `44a4d97655ea48842b533bfb81608f30280ab9224b38f1c073fc8c1e6b52c6e8` |
| 54 | `M4.51-item11` | §3 | Ratified manifest M4.51 item 11 | 86 | `447911a5ae99c0cc2535c16a287487f0f333de4bbf180ca1c401a31a893433f4` |
| 55 | `M4.52-item11` | §3 | Ratified manifest M4.52 item 11 | 87 | `5a7bec22288a881d5f978a7538a6f81b6ea207e843f49480e790d032811d534c` |
| 56 | `M4.53-item11` | §3 | Ratified manifest M4.53 item 11 | 77 | `51860552302e02210fd66bab85b519e8700ff210f2817da0e8d158762305fa61` |
| 57 | `M4.54-item11` | §3 | Ratified manifest M4.54 item 11 | 92 | `f6986e3d8894c4ecaef63f46504c6fa36297249516e8403d40883d661761b2a4` |
| 58 | `M4.55-item11` | §3 | Ratified manifest M4.55 item 11 | 81 | `7de86030b30fc9bc12e8a435d302bfdfa09e393faa007b9074fe869b0f40ab96` |
| 59 | `M4.56-item11` | §3 | Ratified manifest M4.56 item 11 | 72 | `07bf102db0b34e473cf6073889f167d2bfc14f1cf572bfb9bfb058d6dc227284` |
| 60 | `M4.57-item11` | §3 | Ratified manifest M4.57 item 11 | 87 | `bdb20706391c86378cb800c1c32bb4972e1686b8e7c3423bfca56bfeb4a81ff7` |
| 61 | `M4.58-item11` | §3 | Ratified manifest M4.58 item 11 | 75 | `e7691ebd6b4085cfb754536e8f921a96c25492cd413841af1f0c732a0a95fc1a` |
| 62 | `M4.59-item11` | §3 | Ratified manifest M4.59 item 11 | 83 | `dbf879dac28640a15b91223afd2e1cd613f08b49dc5265605d171a376f3357c0` |
| 63 | `M4.60-item11` | §3 | Ratified manifest M4.60 item 11 | 91 | `a314cc1b1693df0aaa8368edc13be04457d46790e2b7acc61b5f3e7acca41815` |
| 64 | `M4.61-item11` | §3 | Ratified manifest M4.61 item 11 | 79 | `01959662dc6c4e0769b883afd0f0b264bb99864819061957431aac76190ae3f2` |
| 65 | `M4.62-item11` | §3 | Ratified manifest M4.62 item 11 | 86 | `745b3686ffa0d9163ec8d11e3aead71e36901b9530b49208ed5e433a1b0f9b00` |
| 66 | `M4.63-item11` | §3 | Ratified manifest M4.63 item 11 | 81 | `322674b4c107ea07568bff798dbb5ca73513a904245d90a18726dce0f95e6e86` |
| 67 | `M4.64-item11` | §3 | Ratified manifest M4.64 item 11 | 62 | `71fd129151d228c53b40463532812fd44910fc5ad7d8395749ab2bf40e4bffab` |
| 68 | `M4.65-item11` | §3 | Ratified manifest M4.65 item 11 | 72 | `cb8c1d310dd2cd0c79effa92d9c57cac96d1ec47339aaf748529e094a3a50a8a` |
| 69 | `M4.66-item11` | §3 | Ratified manifest M4.66 item 11 | 65 | `d44bbead43b07a1629f3c3bdf3ae4245b562a0c4c9de26c9b01cc003fa1f336a` |
| 70 | `A2-2.2-total` | §3 | Ratified Amendment 2 §2.2 second fenced payload (declared total) | 36 | `07747fb3e8e2238e8f96d946100cf197f0638161a1e63ba12847f3b09df0a423` |
| 71 | `A2-2.3-§4` | §4 | Ratified Amendment 2 §2.3 §4 fenced payload | 381 | `29449e6d190f4606c3825049528cbb3df988d5d554765d41e439c9fbe9e6101f` |
| 72 | `M4.2-item7` | §4 | Ratified manifest M4.2 item 7 | 44 | `9e8af7dfbee63c063e90169b883f24a9f4cb9205d64a058804802d9043fcb703` |
| 73 | `M4.2-item8` | §4 | Ratified manifest M4.2 item 8 | 217 | `0ff41d65f301b3280b0d0060cb54e50da7c2f9b320a34bb7e22ae635b19aa3f5` |
| 74 | `M4.2-item9` | §4 | Ratified manifest M4.2 item 9 | 134 | `16c2b050ef86cf5330a6cb34b265aa9ab0104400a46ae57481b2baa54330ec7a` |
| 75 | `M4.3-item7` | §4 | Ratified manifest M4.3 item 7 | 51 | `f482b1924ce90f68b8c5a1a3779b278c17752a56fc006338831f26abaf8674ad` |
| 76 | `M4.3-item8` | §4 | Ratified manifest M4.3 item 8 | 390 | `72c491c7bfcb33612dd4661c7d2616edc9de2133bec5bb58c3b2b2df327d7053` |
| 77 | `M4.3-item9` | §4 | Ratified manifest M4.3 item 9 | 78 | `5c2969bb740a391595bf2788b8ee4cc45a341cee1cbd25a8570459ea1011cbd3` |
| 78 | `M4.4-item7` | §4 | Ratified manifest M4.4 item 7 | 71 | `c7faa5c13989194bc031a820eba086a9b0ef83595d236cbf2efc9432ed4d26c9` |
| 79 | `M4.4-item8` | §4 | Ratified manifest M4.4 item 8 | 370 | `e42b8076f2332c3c57072a60fb08c0af1b0ed597602f461f828abbbc913a8bb6` |
| 80 | `M4.4-item9` | §4 | Ratified manifest M4.4 item 9 | 78 | `7cdb4f259db6513e3b5a430f51c177fb78994b09d58bc623b5cf7efce66f2393` |
| 81 | `M4.5-item7` | §4 | Ratified manifest M4.5 item 7 | 55 | `983324e741e4d03f67f7cf38b873ab2da3854fe487778138f5c53b0fcdbc7d5b` |
| 82 | `M4.5-item8` | §4 | Ratified manifest M4.5 item 8 | 450 | `0867af7db9bfc1d384331d6c15f11be4464a7e812559fd8191e16adbabc5ea59` |
| 83 | `M4.5-item9` | §4 | Ratified manifest M4.5 item 9 | 78 | `195dbb7d63f76d67882a5a14dd5c32d3866e705bfce866ecaf03365a66b087f2` |
| 84 | `M4.6-item7` | §4 | Ratified manifest M4.6 item 7 | 57 | `59d482aad43d12243d6d6447fca84c385f9b76df0a52330eedf8d2527983f638` |
| 85 | `M4.6-item8` | §4 | Ratified manifest M4.6 item 8 | 223 | `8be0e101331cf156b89b136134290320db7c17f1ae4a09c512374f5a92f96e97` |
| 86 | `M4.6-item9` | §4 | Ratified manifest M4.6 item 9 | 78 | `52a85b98bc1a51d6985c2bb8c2cab099900782e4d565ff1a6b9d058b7c6f9b4a` |
| 87 | `M4.7-item7` | §4 | Ratified manifest M4.7 item 7 | 36 | `fef3f36fd20a1b0d20a602b7cc51ffaa4e6d692f0946888e7c7204e4b29cae6d` |
| 88 | `M4.7-item8` | §4 | Ratified manifest M4.7 item 8 | 336 | `2475653f2df754bbdcdfc60ae68a2e143b5a8d4cebdeb1a6c1dd3125e16da43b` |
| 89 | `M4.7-item9` | §4 | Ratified manifest M4.7 item 9 | 78 | `5c2969bb740a391595bf2788b8ee4cc45a341cee1cbd25a8570459ea1011cbd3` |
| 90 | `M4.8-item7` | §4 | Ratified manifest M4.8 item 7 | 63 | `1ed8ef7f49bfdef3fd31f0ec73106ccd8318aad19cc1735fd24e028a91eeb722` |
| 91 | `M4.8-item8` | §4 | Ratified manifest M4.8 item 8 | 247 | `4dbea0be4b5ad64d27de9c8df0468c494662b686832ff79409041a43d8a98ab2` |
| 92 | `M4.8-item9` | §4 | Ratified manifest M4.8 item 9 | 203 | `7ced4ed979a88afd731b321c548766e005984d5413a570e29ad5a0c312558ec9` |
| 93 | `M4.9-item7` | §4 | Ratified manifest M4.9 item 7 | 73 | `8e5e9eed46054c3f518fefeca7b80caa19c82099f03bea4b9f01ea73d2ed6dfc` |
| 94 | `M4.9-item8` | §4 | Ratified manifest M4.9 item 8 | 498 | `14fab9492afd82f55d3700f0272a4c8582e73308116a06d18a9ddee947726b15` |
| 95 | `M4.9-item9` | §4 | Ratified manifest M4.9 item 9 | 78 | `2b2f550ec120bffb97cb48c11b3c733f0ed9e66a2dfeb41d704c6d6ceb1723ec` |
| 96 | `M4.10-item7` | §4 | Ratified manifest M4.10 item 7 | 32 | `c6055b3995c0720a8770610058958ac1b746873ed5d9da98572e5f264e866f27` |
| 97 | `M4.10-item8` | §4 | Ratified manifest M4.10 item 8 | 190 | `db0e29c22354f005b21008f461838077d1d9106f6b5fb611f06a5220604e74fb` |
| 98 | `M4.10-item9` | §4 | Ratified manifest M4.10 item 9 | 79 | `e0f2e0fd2c1277dc9be089248c020cc17bad0bfbb31519bf9b34ab23a4244b1a` |
| 99 | `M4.11-item7` | §4 | Ratified manifest M4.11 item 7 | 71 | `13cb391b8d3c2490fbfb515c55413e2d36f8e45298afb17a8895fb5983bf71cb` |
| 100 | `M4.11-item8` | §4 | Ratified manifest M4.11 item 8 | 420 | `b23d197862ae0eed83995fc66486a16fb810e08ee5dbd4a39655b7e92fe6022b` |
| 101 | `M4.11-item9` | §4 | Ratified manifest M4.11 item 9 | 78 | `42dd3a9f025dff7f74011724da63c983be898c9e0a9439b600f69e31a6300d91` |
| 102 | `M4.12-item7` | §4 | Ratified manifest M4.12 item 7 | 55 | `a7de82c8bf69e18fb2cf57f239b1ab561256015db6ab9d29e8cf4880ccb8ece1` |
| 103 | `M4.12-item8` | §4 | Ratified manifest M4.12 item 8 | 340 | `1848e3e298585d79ec9c2b1e9415b4c226c1efc6da56de472adeef306e3d0b9f` |
| 104 | `M4.12-item9` | §4 | Ratified manifest M4.12 item 9 | 104 | `3b6c7d813481f9595e6a8d74a7a270920968498c2f86188061c0cc926c038b52` |
| 105 | `M4.13-item7` | §4 | Ratified manifest M4.13 item 7 | 74 | `44392bc823325610a8c5ef7bf012b86523873e7615017be27d7994ac10616b29` |
| 106 | `M4.13-item8` | §4 | Ratified manifest M4.13 item 8 | 415 | `27a64affccfbcec9e1ec5c15c5d791ec11b069729c0e5858a621b9b5c0ed9ced` |
| 107 | `M4.13-item9` | §4 | Ratified manifest M4.13 item 9 | 104 | `98dddfbeb7f2e62559b03591252371f913bc1861bae94e405be158f10069a5ae` |
| 108 | `M4.14-item7` | §4 | Ratified manifest M4.14 item 7 | 55 | `3e17db9fc4236c3a207c24b456e2e4f828321fb46d23102ec5153b0979d99864` |
| 109 | `M4.14-item8` | §4 | Ratified manifest M4.14 item 8 | 337 | `5af35b07c8daf025580800a5d2984a45ad51161c5d21627e5ebfe340054e851a` |
| 110 | `M4.14-item9` | §4 | Ratified manifest M4.14 item 9 | 140 | `90f91f13a5b2c31891243d044a7c73b6a8b36254c9657e5b6ca6956eceadce31` |
| 111 | `M4.15-item7` | §4 | Ratified manifest M4.15 item 7 | 75 | `0d11c32e6f48531717ae8bebeca1984ba2459ceab448aa08df1ea37f61f360c0` |
| 112 | `M4.15-item8` | §4 | Ratified manifest M4.15 item 8 | 451 | `6d601473c3a4477bcdaec2cbe71ff17437f7df37957312e1fe9eb3016a74993c` |
| 113 | `M4.15-item9` | §4 | Ratified manifest M4.15 item 9 | 104 | `53d38cdff3b1630c3fa4858ecaeef4453a63e5a4b254573edb97a16b8aa0547c` |
| 114 | `M4.16-item7` | §4 | Ratified manifest M4.16 item 7 | 53 | `9854fd7cf385bf502e69dae1bbba526eec4c9ac2597770aed90125f0ba184168` |
| 115 | `M4.16-item8` | §4 | Ratified manifest M4.16 item 8 | 418 | `747676a640c316734db6947ec085709f10b8caf7b53ef0e5b501054337832787` |
| 116 | `M4.16-item9` | §4 | Ratified manifest M4.16 item 9 | 104 | `3b6c7d813481f9595e6a8d74a7a270920968498c2f86188061c0cc926c038b52` |
| 117 | `M4.17-item7` | §4 | Ratified manifest M4.17 item 7 | 76 | `9dca01d2c238f9f4a9c03b0c8f531bede7bcea6cf4ca837df993c270e2082c0d` |
| 118 | `M4.17-item8` | §4 | Ratified manifest M4.17 item 8 | 526 | `0d8521dba4ffd8ddf1e98133a5fd14af92c73ce633e09a6464e2823f4d3efb8d` |
| 119 | `M4.17-item9` | §4 | Ratified manifest M4.17 item 9 | 153 | `6898581febd63957971a5c0a98cafab1a968de7c8c5e1e6ccacef1dcb008dd23` |
| 120 | `M4.18-item7` | §4 | Ratified manifest M4.18 item 7 | 71 | `9e418ba8d25155db5d422fd1325d9c5bf466a79e4979492b3219449ec0def8f0` |
| 121 | `M4.18-item8` | §4 | Ratified manifest M4.18 item 8 | 243 | `cacb70ee888737d91cadc4ccaa90e1b79b35a3a72726256476d093cbb3532acc` |
| 122 | `M4.18-item9` | §4 | Ratified manifest M4.18 item 9 | 79 | `c3031c66570a7852ecd37f25fafa768ab2cdbfcf37ca22cc4d810ba7b695fd93` |
| 123 | `M4.19-item7` | §4 | Ratified manifest M4.19 item 7 | 58 | `240508dab00043374cd7604819e252934fad306b526649d90becd931e847dc60` |
| 124 | `M4.19-item8` | §4 | Ratified manifest M4.19 item 8 | 332 | `06599ee29152d05ebf19824c80059c1afc9f3646bf0587fd0d43b5386eda405d` |
| 125 | `M4.19-item9` | §4 | Ratified manifest M4.19 item 9 | 104 | `eb011c4ffdd95367174e00188cc03cf2daaee269768daa7545ffe088ff0e8ec5` |
| 126 | `M4.20-item7` | §4 | Ratified manifest M4.20 item 7 | 66 | `18339984ec2488d360d72a057f41701acccb539fbc40ecc0d5159ec24fbb908a` |
| 127 | `M4.20-item8` | §4 | Ratified manifest M4.20 item 8 | 570 | `99b1ba7fdc1d1cdf33e24441b02307d3c1efbf471ca4ffb5db770a7d1294b9a6` |
| 128 | `M4.20-item9` | §4 | Ratified manifest M4.20 item 9 | 104 | `fb94815aa165bcc3f4d0361dea5385d4024a59b72b9d5645a690a44e9cbc7e2c` |
| 129 | `M4.21-item7` | §4 | Ratified manifest M4.21 item 7 | 64 | `24e20988fb07045aa72efae51fccb40606b60a60f7644f8da8d485364cca0411` |
| 130 | `M4.21-item8` | §4 | Ratified manifest M4.21 item 8 | 523 | `22897ced73123941570be93df8476ca2caf0f4a458abc2a1a7334a546428121b` |
| 131 | `M4.21-item9` | §4 | Ratified manifest M4.21 item 9 | 105 | `ceb4de08d15a4df9e105f8794b1dacf6c8e72930dfd61819f0b807913d26a716` |
| 132 | `M4.22-item7` | §4 | Ratified manifest M4.22 item 7 | 68 | `2bf716e1dfbced80a70d1eabd916aa425c9b37e0c67086f24b177dd8581e83c5` |
| 133 | `M4.22-item8` | §4 | Ratified manifest M4.22 item 8 | 635 | `2537adba68c4bb60a5713403109cede02fe03ca14404b770f10e798f1c8e86e0` |
| 134 | `M4.22-item9` | §4 | Ratified manifest M4.22 item 9 | 78 | `2b2f550ec120bffb97cb48c11b3c733f0ed9e66a2dfeb41d704c6d6ceb1723ec` |
| 135 | `M4.23-item7` | §4 | Ratified manifest M4.23 item 7 | 77 | `f69770d2e6e6a675d9f34fb8be9c9348366abcc98e87e906a7723039880f2526` |
| 136 | `M4.23-item8` | §4 | Ratified manifest M4.23 item 8 | 471 | `d595a58f898da8765df2a8843ef5a05f2df331f87c7e89043030ed36b3895b13` |
| 137 | `M4.23-item9` | §4 | Ratified manifest M4.23 item 9 | 104 | `35ba6b31f85096d6801c30e4a8c64f42a0e73e6d5ac2403355d258ea6063d8e5` |
| 138 | `M4.24-item7` | §4 | Ratified manifest M4.24 item 7 | 77 | `2d9995f61bcca790fac2da7cedbadec846467a1ef7a3570230d162adf395c9dd` |
| 139 | `M4.24-item8` | §4 | Ratified manifest M4.24 item 8 | 447 | `a0d008b751ab42d242bb336402715072553ba0e43ec47620f66992c08ed25021` |
| 140 | `M4.24-item9` | §4 | Ratified manifest M4.24 item 9 | 78 | `0ac3393e7d9830d7e2d72633f3e533269fdfb2892341f3d323d393fb73cc6184` |
| 141 | `M4.25-item7` | §4 | Ratified manifest M4.25 item 7 | 56 | `eeb72e619fd099385fab99ad48f9464f8765e9034f0288d370e63d5a66a89495` |
| 142 | `M4.25-item8` | §4 | Ratified manifest M4.25 item 8 | 821 | `e12f9194f7d0d15aef4d66d214b29bb747abda2e3d42becacb98997e533b8fef` |
| 143 | `M4.25-item9` | §4 | Ratified manifest M4.25 item 9 | 104 | `3b6c7d813481f9595e6a8d74a7a270920968498c2f86188061c0cc926c038b52` |
| 144 | `M4.26-item7` | §4 | Ratified manifest M4.26 item 7 | 55 | `8caae42e6fc21ce9a8f66feeff27e013a1fea0db92f2cbecf0767b646a41e7c8` |
| 145 | `M4.26-item8` | §4 | Ratified manifest M4.26 item 8 | 506 | `c7ab1e404ec8fca9c1cc6fdb7fb6da119dde117c4575825c6cc4ac19889a39fb` |
| 146 | `M4.26-item9` | §4 | Ratified manifest M4.26 item 9 | 137 | `1b03fe5383156fc04c206c90766d0b78d5de0f994dbcbefc8fc34b45d5b7c29e` |
| 147 | `M4.27-item7` | §4 | Ratified manifest M4.27 item 7 | 84 | `0e6c78ec2f3f463e1774da806cb3fa9e16863004ea6351d82e70f9fadb63b0a2` |
| 148 | `M4.27-item8` | §4 | Ratified manifest M4.27 item 8 | 395 | `53a8f6c8965385182221500324506604f85301120451ba475634cd01562c662b` |
| 149 | `M4.27-item9` | §4 | Ratified manifest M4.27 item 9 | 78 | `0ac3393e7d9830d7e2d72633f3e533269fdfb2892341f3d323d393fb73cc6184` |
| 150 | `M4.28-item7` | §4 | Ratified manifest M4.28 item 7 | 72 | `307a22185e47d437378038134cc8571edcec88726ba9e53b387bcfc3f4a25736` |
| 151 | `M4.28-item8` | §4 | Ratified manifest M4.28 item 8 | 735 | `60e6b3058562c6dc7d3e217ea73599500f0a32b31273a26bc539ea75e46d3bac` |
| 152 | `M4.28-item9` | §4 | Ratified manifest M4.28 item 9 | 104 | `3b6c7d813481f9595e6a8d74a7a270920968498c2f86188061c0cc926c038b52` |
| 153 | `M4.29-item7` | §4 | Ratified manifest M4.29 item 7 | 51 | `e691064f103da86c1dcae9b352e0300bd31f7f851685784e678c6d32c5dd922a` |
| 154 | `M4.29-item8` | §4 | Ratified manifest M4.29 item 8 | 949 | `2a0a7529585d540219f4d5fa32a1b28decb2756429a0f10be106919a65111aa8` |
| 155 | `M4.29-item9` | §4 | Ratified manifest M4.29 item 9 | 78 | `9fd4f73b9b6bee45ffa235ef36ea171ff16018645c63f9141f78518bd6af3929` |
| 156 | `M4.30-item7` | §4 | Ratified manifest M4.30 item 7 | 51 | `05ab7bd84353f1cc7f3b1d691ee7a34a5d3b36ac0e3e64339ca7d02fadba0aed` |
| 157 | `M4.30-item8` | §4 | Ratified manifest M4.30 item 8 | 824 | `323e0fa989094c72dce69167bb3d98256ecb9d8045a54531f8a07916272927a3` |
| 158 | `M4.30-item9` | §4 | Ratified manifest M4.30 item 9 | 104 | `50ad48b0a745e4feed89786d3f40e84e939ca51d175e545a879d551a7d10790c` |
| 159 | `M4.31-item7` | §4 | Ratified manifest M4.31 item 7 | 80 | `967e6da4074380a2ca34f7cfef4c3dd76b066acf5a37b5f4160fd1508a3d81f6` |
| 160 | `M4.31-item8` | §4 | Ratified manifest M4.31 item 8 | 723 | `254b3427966fa1a9579a3d5b92ca99105f1b212b31f100ee0335148874f9d3f2` |
| 161 | `M4.31-item9` | §4 | Ratified manifest M4.31 item 9 | 104 | `6c7fe4af41063a58baa14d7be6bf8b84f7f92e7ae02dcdff12594dfa66fe24cc` |
| 162 | `M4.32-item7` | §4 | Ratified manifest M4.32 item 7 | 83 | `bd3ad8cc89954892ab6095bd09ae3d26a616471d30ea1c85f410fa1d25a18ced` |
| 163 | `M4.32-item8` | §4 | Ratified manifest M4.32 item 8 | 270 | `48a9065f7ddd2320a3550949126cf257c39d8b41fb69bbfacd19c3aae791723d` |
| 164 | `M4.32-item9` | §4 | Ratified manifest M4.32 item 9 | 103 | `5cdf61b2044b2e2a7b7cba2ef1440f2c19d60fd4a7f86768985b237dee0e5888` |
| 165 | `M4.33-item7` | §4 | Ratified manifest M4.33 item 7 | 72 | `4121c29efc520e3d0a41515625bb4a70655129155443e7320f55739264ece79e` |
| 166 | `M4.33-item8` | §4 | Ratified manifest M4.33 item 8 | 581 | `d3f327989de053252931321d22d02a38a8309f3488776027c20594cc9212872d` |
| 167 | `M4.33-item9` | §4 | Ratified manifest M4.33 item 9 | 104 | `3b6c7d813481f9595e6a8d74a7a270920968498c2f86188061c0cc926c038b52` |
| 168 | `M4.34-item7` | §4 | Ratified manifest M4.34 item 7 | 68 | `fed9fb151cf705ee9a4683f8681b9e4c34cade3d4724886b40d8660724c2d114` |
| 169 | `M4.34-item8` | §4 | Ratified manifest M4.34 item 8 | 511 | `b2b8a8f6bac3c9e9feaa434a93de7b9990d636e41136c05bf0c99d2c92f9d6f7` |
| 170 | `M4.34-item9` | §4 | Ratified manifest M4.34 item 9 | 78 | `649fc734653e0d14c416402eb4e59d2c88e139e9e706ed24085bef3e93ce167c` |
| 171 | `M4.35-item7` | §4 | Ratified manifest M4.35 item 7 | 72 | `162a005261735153d181bdc0387d336e1c698e16b085ec9711a96fadd436460e` |
| 172 | `M4.35-item8` | §4 | Ratified manifest M4.35 item 8 | 825 | `38a5b53cb16defe1f3243049aed67b8ccc5851cc5a718cb474f8ce52e2767d7c` |
| 173 | `M4.35-item9` | §4 | Ratified manifest M4.35 item 9 | 104 | `fb94815aa165bcc3f4d0361dea5385d4024a59b72b9d5645a690a44e9cbc7e2c` |
| 174 | `M4.36-item7` | §4 | Ratified manifest M4.36 item 7 | 78 | `787ca22991b93eb7cba85d854c9d4d67267e58565b2c8c51322401ce294759e5` |
| 175 | `M4.36-item8` | §4 | Ratified manifest M4.36 item 8 | 456 | `11ca2d1107e8cafd50b9d1881ba2322402a9fe5cf1b8431e5dd3ac60096fcae9` |
| 176 | `M4.36-item9` | §4 | Ratified manifest M4.36 item 9 | 305 | `c643fa0134a536ffce6b70f6ab750b20de41dcd7c7791a4eec931af583e49c08` |
| 177 | `M4.37-item7` | §4 | Ratified manifest M4.37 item 7 | 78 | `c89bbfc40f5ea68918febe00e9bc35e40a81a71c968bf41b528898d8f38dd5b9` |
| 178 | `M4.37-item8` | §4 | Ratified manifest M4.37 item 8 | 578 | `dd36a96377e31fa65bd66512d77aa76bd30feb269af940c113836e58f9ac72b7` |
| 179 | `M4.37-item9` | §4 | Ratified manifest M4.37 item 9 | 263 | `fa80f5e2507d159b2da2ba3c478b3df284977a3672c467b60d4bdec60701f8aa` |
| 180 | `M4.38-item7` | §4 | Ratified manifest M4.38 item 7 | 42 | `fda2e4abeedf013e1f8cbdb889fe42b7fd8b39b82826a30e5e7d9cf3c0ddb211` |
| 181 | `M4.38-item8` | §4 | Ratified manifest M4.38 item 8 | 601 | `ce1d54ea2387e9e5a9c79804f2e4360d4b1baf6c86d692fa8155ab5a1a37988d` |
| 182 | `M4.38-item9` | §4 | Ratified manifest M4.38 item 9 | 78 | `cb8b58e802927d1310ef12d0d52b9092476bd22200666e22ec558538e190b274` |
| 183 | `A2-2.3-§5` | §5 | Ratified Amendment 2 §2.3 §5 fenced payload | 201 | `da9914b4fe74365e8ea099da9d20599fd01d01fefc885eb188a5c12ae8a0b199` |
| 184 | `M4.39-item7` | §5 | Ratified manifest M4.39 item 7 | 54 | `3da37d4f5dae045ab61b13f1131a0956ac76a0afb450d6e0bf003ac7b5bff11f` |
| 185 | `M4.39-item8` | §5 | Ratified manifest M4.39 item 8 | 528 | `7cc7d8023334ad03657ce694cad68659455a90b25ec0e1738f4079d3f8e10ff0` |
| 186 | `M4.39-item9` | §5 | Ratified manifest M4.39 item 9 | 201 | `f6f6f3b25d0f96fa72106542e953431ac7f0b9421f57e5d28cfa11d92f0b9e56` |
| 187 | `M4.40-item7` | §5 | Ratified manifest M4.40 item 7 | 66 | `307e249df7da62734cefeb2f24c22dff591d8e6a0d1909987dd789e2ac1b7713` |
| 188 | `M4.40-item8` | §5 | Ratified manifest M4.40 item 8 | 562 | `1e0dc311337b07e85320787cacaec3492d1e5bda2093248a15062ce5a29cee6f` |
| 189 | `M4.40-item9` | §5 | Ratified manifest M4.40 item 9 | 104 | `a8f90bef390cc07c1c683637a2361d40a1b5da21865cca824dd8a6153bef4fe6` |
| 190 | `M4.41-item7` | §5 | Ratified manifest M4.41 item 7 | 46 | `2b291224a43ab05f0b6345523b7b908110ae76470c00fce306cb899f75f5a36d` |
| 191 | `M4.41-item8` | §5 | Ratified manifest M4.41 item 8 | 429 | `4c2a47f4e729e3058ed3c4ca75127521bd3a296401ef6dc6d3bb14d5d540d05b` |
| 192 | `M4.41-item9` | §5 | Ratified manifest M4.41 item 9 | 244 | `872fdfb53fc8571391b23b357bdbcc7a3cfea59bfc02a1a87e6c954fc5caec9c` |
| 193 | `M4.42-item7` | §5 | Ratified manifest M4.42 item 7 | 66 | `c369db014c6898126e3f4ae9583ceb1cb27f94d8873e5305b95199815cb873cf` |
| 194 | `M4.42-item8` | §5 | Ratified manifest M4.42 item 8 | 568 | `04b4dd7501668b5d63830d40c0e4bec1bb6f14f59ab4678a7bc1f1a4e18558b5` |
| 195 | `M4.42-item9` | §5 | Ratified manifest M4.42 item 9 | 216 | `2ea33bff3300139bb9d60a71a69cc1e3025d4f2fd5c3b9bed44952117287ee8e` |
| 196 | `M4.43-item7` | §5 | Ratified manifest M4.43 item 7 | 59 | `fe761b887520f2a1768cb477fb92dfecbf91671566d38a09e7b560284a3dbdb3` |
| 197 | `M4.43-item8` | §5 | Ratified manifest M4.43 item 8 | 537 | `ad5e5d97fb14038516adb1a71a36f1d142582701e6def1494782297e4b3cb7eb` |
| 198 | `M4.43-item9` | §5 | Ratified manifest M4.43 item 9 | 103 | `b226c095f75c70322927ccd38d8de0dfe669d88a8915de24cffcb4f38a2409b9` |
| 199 | `M4.44-item7` | §5 | Ratified manifest M4.44 item 7 | 63 | `809de4c83c5ef38560c68558c29083f81a512581842579ff546d27a8e0d08f5c` |
| 200 | `M4.44-item8` | §5 | Ratified manifest M4.44 item 8 | 398 | `f7cc187bc52dea0e3ebaf669adad1660c19761a9a677311a7b10c91d0b65d6c2` |
| 201 | `M4.44-item9` | §5 | Ratified manifest M4.44 item 9 | 509 | `9338877bc84b43552d4e50473d3c80bafd586d7ecd30c7390bf4bbff33348dd7` |
| 202 | `A2-2.3-§6` | §6 | Ratified Amendment 2 §2.3 §6 fenced payload | 141 | `0d49765367199456b6fa6d229222ad65e4b119b26af563fe4123bd494f3a29c2` |
| 203 | `M4.45-item7` | §6 | Ratified manifest M4.45 item 7 | 71 | `6761dd496f45f5fd600831f44d98739b0a8e6d3095617dbb429d11e502821334` |
| 204 | `M4.45-item8` | §6 | Ratified manifest M4.45 item 8 | 277 | `82ac78c16ec5cb03d23814c718a0e6c107ffd209a71f9b4a4f863de436db5e35` |
| 205 | `M4.45-item9` | §6 | Ratified manifest M4.45 item 9 | 137 | `17171b78e21b14c84ea2ee00ee2f9cddc5323cc4e08816f802005d385f1e012c` |
| 206 | `M4.46-item7` | §6 | Ratified manifest M4.46 item 7 | 68 | `5cffe94810c6937fdf343b2a13903806ce468be6f13378f23cfb0497f0a81269` |
| 207 | `M4.46-item8` | §6 | Ratified manifest M4.46 item 8 | 432 | `60eb28a23673aabff28862b2c1edb5bb4bc4ef721596e179dbad153b9e15edb2` |
| 208 | `M4.46-item9` | §6 | Ratified manifest M4.46 item 9 | 104 | `5eef66e2e02d6480b52cf4ab951ee3f39f76b59ca8beac207ad7bb47acfab1ed` |
| 209 | `M4.47-item7` | §6 | Ratified manifest M4.47 item 7 | 51 | `29b887dda45aa87c9a61d882a36eb7faed7648f6b2991e35ce246ad774dc217a` |
| 210 | `M4.47-item8` | §6 | Ratified manifest M4.47 item 8 | 395 | `7bea6aa8b4b4527a78f085909f95c095ac27a74bff8bcc29735670b0a13d0948` |
| 211 | `M4.47-item9` | §6 | Ratified manifest M4.47 item 9 | 104 | `c2d13b341f3487e331c5f60e97854c30b869b743d9070f2e6b5ee68cb93e4389` |
| 212 | `M4.48-item7` | §6 | Ratified manifest M4.48 item 7 | 73 | `2a0cbb725a0a497c9c31dbb9e446b0c114e507e2cf558a6182bd287184626c37` |
| 213 | `M4.48-item8` | §6 | Ratified manifest M4.48 item 8 | 75 | `955cf8fdbf5f0cacbc69c0280711407f749bd42a073e81aa9ddbf83ef80dd411` |
| 214 | `M4.48-item9` | §6 | Ratified manifest M4.48 item 9 | 104 | `29ba360746d1aef12715e8780282e9ae80b54c93d4409d4b9ad672966f7365d0` |
| 215 | `M4.49-item7` | §6 | Ratified manifest M4.49 item 7 | 33 | `4cd574c7e8a5eb951087c49bc1e0d9c2fde6d3801277eacf2193d7d0c1206fe1` |
| 216 | `M4.49-item8` | §6 | Ratified manifest M4.49 item 8 | 168 | `0235165de19f3e0cb4a0868a05fd4c4ff96908865441294bcf51900c54917457` |
| 217 | `M4.49-item9` | §6 | Ratified manifest M4.49 item 9 | 133 | `349588932ca166d80b56ee44a62d4d83b9389cadd4d5bd8dd9e6c6674211718b` |
| 218 | `M4.50-item7` | §6 | Ratified manifest M4.50 item 7 | 43 | `9170cba0997bfdfdf501144d61ca1539963e9e992922cc9425787e560db2fe2f` |
| 219 | `M4.50-item8` | §6 | Ratified manifest M4.50 item 8 | 287 | `051d8d2cdae38e6b6533ac4661781f2d3ab087c8914c19c68a9923660dcab07e` |
| 220 | `M4.50-item9` | §6 | Ratified manifest M4.50 item 9 | 145 | `c76eb541b1a3fe02143f3d5c64ee03dd5803664bfa8adaabde8db244cd640f44` |
| 221 | `M4.51-item7` | §6 | Ratified manifest M4.51 item 7 | 57 | `a69e125ac2818497aa75d2a83ecba5615bae195acdf563119fe00990ed06b42c` |
| 222 | `M4.51-item8` | §6 | Ratified manifest M4.51 item 8 | 162 | `2b3f79e91b080bbe63e712e469643a371cdf22908d5210d586db274e980326a6` |
| 223 | `M4.51-item9` | §6 | Ratified manifest M4.51 item 9 | 146 | `e3960a7640521266be46aa47a52e460a953d290905edba6d18707b20b722115f` |
| 224 | `M4.52-item7` | §6 | Ratified manifest M4.52 item 7 | 58 | `8504d1564b024f7bd997b800d8ea38e34b95aa36eefac4ced69be605ef02213b` |
| 225 | `M4.52-item8` | §6 | Ratified manifest M4.52 item 8 | 429 | `6b4e57efda807bf370f28d12c9c18ae625704e89fbb94363c8a5b04d1a8fc6dc` |
| 226 | `M4.52-item9` | §6 | Ratified manifest M4.52 item 9 | 144 | `7702c07c931439882319bc99a0b60e151125148092b17d2e92c830cb94a293ec` |
| 227 | `M4.53-item7` | §6 | Ratified manifest M4.53 item 7 | 48 | `61ede3fc74dd76cb69c7f82232824f010394f6d879539ab076fefd8ada15b2de` |
| 228 | `M4.53-item8` | §6 | Ratified manifest M4.53 item 8 | 116 | `de6826212d57da5f4668c57e35bd449b80024eb188fab2b685169d3d83105c57` |
| 229 | `M4.53-item9` | §6 | Ratified manifest M4.53 item 9 | 142 | `de38d6b8903f10b5163155e4fe82bb3777b4e69528ac1fabed45bff76e440b36` |
| 230 | `M4.54-item7` | §6 | Ratified manifest M4.54 item 7 | 63 | `a5c65c71272343d94eff4729a9a50ec34a097048265e9ef9ee7e5253492a5eb3` |
| 231 | `M4.54-item8` | §6 | Ratified manifest M4.54 item 8 | 144 | `dfd556a4d65882dfc5c0898b24955a931fe1d714db852a4165fd02aa39e27106` |
| 232 | `M4.54-item9` | §6 | Ratified manifest M4.54 item 9 | 78 | `b07a7b298274592d07ed4acd39570183ce7be395f19dd90252c05de6494d1804` |
| 233 | `M4.55-item7` | §6 | Ratified manifest M4.55 item 7 | 52 | `25507fe9ed1ed19d8b9f9202e452b3bdfb1e25c81ac878cf3bdcfddca8c4d918` |
| 234 | `M4.55-item8` | §6 | Ratified manifest M4.55 item 8 | 481 | `2f2a7f23286be235ea3b6ae0057dba3435523f926290cfdb06219a4607d33542` |
| 235 | `M4.55-item9` | §6 | Ratified manifest M4.55 item 9 | 104 | `230480d4080d4ed025c7e0b863c3b67ae94d0ded21cd260ac977258c0e329429` |
| 236 | `M4.56-item7` | §6 | Ratified manifest M4.56 item 7 | 42 | `f6c3225930623877ee8271587e13162cd9b9ad09ec413414b09a6a0225d32a36` |
| 237 | `M4.56-item8` | §6 | Ratified manifest M4.56 item 8 | 39 | `54a745929cb5dd7733cc9aee1c96408334185a7bfea6b2ce0d1ee67efee5a527` |
| 238 | `M4.56-item9` | §6 | Ratified manifest M4.56 item 9 | 79 | `6bd478c1854c819a48770c4b272f881b4c5cb0cf97273bb27176b7a894e24f8a` |
| 239 | `M4.57-item7` | §6 | Ratified manifest M4.57 item 7 | 58 | `687e7f486c08772cfc078f0c1e20788ff0df812f61705692f70d4c1de27bd54d` |
| 240 | `M4.57-item8` | §6 | Ratified manifest M4.57 item 8 | 125 | `b0ee14f05667d4ce4ca76d1191eba209af2541d5291319d7669133fd61d2fa4d` |
| 241 | `M4.57-item9` | §6 | Ratified manifest M4.57 item 9 | 156 | `f1bb939dc17f9aaa081d14b6edab848d807810eac5d78dc0798776168260f60e` |
| 242 | `M4.58-item7` | §6 | Ratified manifest M4.58 item 7 | 46 | `6128e5176fdc324e4a2f9c18f6a74f8221c72a4f4dae0079b51476086e740fe1` |
| 243 | `M4.58-item8` | §6 | Ratified manifest M4.58 item 8 | 233 | `5739be6f6f588b2595e7304aa7bca11fe79b235c2c14cae933cf5883f9b1cc88` |
| 244 | `M4.58-item9` | §6 | Ratified manifest M4.58 item 9 | 133 | `4d586af428b5500426b3d4c98eac9791d190a1fcdb8ed5d49ff058a5f930437b` |
| 245 | `M4.59-item7` | §6 | Ratified manifest M4.59 item 7 | 54 | `98924ed2ffeef3f47774a2ca24d1e1942fe8c1b38648196e2da82128e9d005c4` |
| 246 | `M4.59-item8` | §6 | Ratified manifest M4.59 item 8 | 344 | `450e151aa4516abc6a3d1e97a38de0fbc97b56552964e28fd1caa09c8a51bb66` |
| 247 | `M4.59-item9` | §6 | Ratified manifest M4.59 item 9 | 104 | `661689a0f681ce6cf6190d217971d795565fb4e777132178ee3e39feb8793331` |
| 248 | `M4.60-item7` | §6 | Ratified manifest M4.60 item 7 | 62 | `edb0ab0069172c49732e0e3bc1955575be16a45bc77e8fe36493ce51a524dc5a` |
| 249 | `M4.60-item8` | §6 | Ratified manifest M4.60 item 8 | 359 | `f4ac7b033687ef3777ab367a506c356470646a8de38062ff742d8b2f888c7023` |
| 250 | `M4.60-item9` | §6 | Ratified manifest M4.60 item 9 | 141 | `d0fae5f362246d02af5fe3d7f6d7bc4a1c5550deba82310d2f7bf7d6bcc7057f` |
| 251 | `M4.61-item7` | §6 | Ratified manifest M4.61 item 7 | 50 | `2f08fcc9b105ddcbede07239c92fdddb778ace2f87dd7f943d27bc28561f81fa` |
| 252 | `M4.61-item8` | §6 | Ratified manifest M4.61 item 8 | 288 | `f28c371b1399d8d41f1eded52fa06b61a4f56e1d1fb199b81bf53bf962bb327e` |
| 253 | `M4.61-item9` | §6 | Ratified manifest M4.61 item 9 | 103 | `270f17a153f9e2a865108908e6611b3421ee1abaf60e1a665669f2b45f16abff` |
| 254 | `M4.62-item7` | §6 | Ratified manifest M4.62 item 7 | 57 | `a84a6647838f2a8c0cbf7d18c9066d092ffd6262332e2a2efe9ead032bb53dfb` |
| 255 | `M4.62-item8` | §6 | Ratified manifest M4.62 item 8 | 316 | `c2fcab25db8df88ac10f550b76a86a06a403a829aaf9c9dcbbbcfbb88697df04` |
| 256 | `M4.62-item9` | §6 | Ratified manifest M4.62 item 9 | 133 | `098d60f38b09aea30f7f8f14dc34bbad8efd80b4a1e8d91c7e3a7a7c7f3deffa` |
| 257 | `M4.63-item7` | §6 | Ratified manifest M4.63 item 7 | 52 | `b9e668d72e7cec3b99006a9d8e6f0b0ccb67c3373462c973fc1e798170481b7a` |
| 258 | `M4.63-item8` | §6 | Ratified manifest M4.63 item 8 | 384 | `00b781f2971212c586da99c7df6340fc871424c4544c50199bd559e456cdf71f` |
| 259 | `M4.63-item9` | §6 | Ratified manifest M4.63 item 9 | 104 | `8537e2dbcb28509527f9c4f93b36a75f1080d8b66fe480ce5971d8265715607e` |
| 260 | `A2-2.3-§7` | §7 | Ratified Amendment 2 §2.3 §7 fenced payload | 297 | `22550676a17823c0d42b8c5e813f18a29ae1b0253c311e04d3f2d53fa5b7f6bf` |
| 261 | `M4.64-item7` | §7 | Ratified manifest M4.64 item 7 | 32 | `e27f15a7823bd744ff79c9ebb7125edb71ec97dcbf926c4daa40051cfdb98cfc` |
| 262 | `M4.64-item8` | §7 | Ratified manifest M4.64 item 8 | 388 | `49a402d61dd9d6fd933f8d5a327ceaf339b3564709465d5564d57d1169150f66` |
| 263 | `M4.64-item9` | §7 | Ratified manifest M4.64 item 9 | 79 | `de6f11edcf28f5e64ff2be17a9b550cea4a83fc84e7708048c454471dbbddb10` |
| 264 | `M4.65-item7` | §7 | Ratified manifest M4.65 item 7 | 42 | `f5d94a0cc82c7b210337cce7b6c4168e6acfdf3c75dff137e51f5ddf571e4476` |
| 265 | `M4.65-item8` | §7 | Ratified manifest M4.65 item 8 | 495 | `86f1ea9a656196d71df697fbe0af26996349f93284d3c35bb8628e02aa363384` |
| 266 | `M4.65-item9` | §7 | Ratified manifest M4.65 item 9 | 79 | `a3218148fbd35d9a8e333452a39ccbca21a457b1e53b767e67491cae18b57e34` |
| 267 | `M4.66-item7` | §7 | Ratified manifest M4.66 item 7 | 34 | `50c73036174d9cc07197a624172b1ad783865d5b630fb031f3ac8f0ce2a4fdab` |
| 268 | `M4.66-item8` | §7 | Ratified manifest M4.66 item 8 | 403 | `5e2c25efaad73ea03db1cb5ef91b1d46225502a15b0b71f2def6592e33a43f13` |
| 269 | `M4.66-item9` | §7 | Ratified manifest M4.66 item 9 | 80 | `3d9698b0dd653b7e344621a670555cddd345698d5277651f888156f7f17ced43` |
| 270 | `M5.4` | §8 | Ratified manifest M5.4 fenced payload | 932 | `24eee0ef37ca1a68582d9a0108c0f9b14214216ebe34548531b0cff44a43ecfb` |
| 271 | `M5.6` | §8 | Ratified manifest M5.6 single fenced payload | 2954 | `9dd048f6994e200ff9ff3dfe272723ae00b8198c77059549b8aba87136a2e4b0` |
| 272 | `M5.7` | §8 | Ratified manifest M5.7 single fenced payload | 835 | `d81b7336682fb0895ef6b1d9202063f13cd8e9e3f1d2a5c1844d6596aa51f4c7` |

### Complete join ledger

This ledger is exhaustive: all 271 inter-fragment boundaries plus the one end-of-document byte are listed. No internal M5.6 or M5.7 adjacency is included.

| # | Boundary | Inserted bytes | LF count | Exact authority | Result |
|---:|---|---|---:|---|---|
| 1 | `M2` → `M3` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 2 | `M3` → `A2-2.1` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 3 | `A2-2.1` → `A2-2.2-header` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 4 | `A2-2.2-header` → `M4.2-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 5 | `M4.2-item11` → `M4.3-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 6 | `M4.3-item11` → `M4.4-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 7 | `M4.4-item11` → `M4.5-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 8 | `M4.5-item11` → `M4.6-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 9 | `M4.6-item11` → `M4.7-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 10 | `M4.7-item11` → `M4.8-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 11 | `M4.8-item11` → `M4.9-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 12 | `M4.9-item11` → `M4.10-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 13 | `M4.10-item11` → `M4.11-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 14 | `M4.11-item11` → `M4.12-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 15 | `M4.12-item11` → `M4.13-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 16 | `M4.13-item11` → `M4.14-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 17 | `M4.14-item11` → `M4.15-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 18 | `M4.15-item11` → `M4.16-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 19 | `M4.16-item11` → `M4.17-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 20 | `M4.17-item11` → `M4.18-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 21 | `M4.18-item11` → `M4.19-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 22 | `M4.19-item11` → `M4.20-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 23 | `M4.20-item11` → `M4.21-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 24 | `M4.21-item11` → `M4.22-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 25 | `M4.22-item11` → `M4.23-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 26 | `M4.23-item11` → `M4.24-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 27 | `M4.24-item11` → `M4.25-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 28 | `M4.25-item11` → `M4.26-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 29 | `M4.26-item11` → `M4.27-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 30 | `M4.27-item11` → `M4.28-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 31 | `M4.28-item11` → `M4.29-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 32 | `M4.29-item11` → `M4.30-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 33 | `M4.30-item11` → `M4.31-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 34 | `M4.31-item11` → `M4.32-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 35 | `M4.32-item11` → `M4.33-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 36 | `M4.33-item11` → `M4.34-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 37 | `M4.34-item11` → `M4.35-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 38 | `M4.35-item11` → `M4.36-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 39 | `M4.36-item11` → `M4.37-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 40 | `M4.37-item11` → `M4.38-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 41 | `M4.38-item11` → `M4.39-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 42 | `M4.39-item11` → `M4.40-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 43 | `M4.40-item11` → `M4.41-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 44 | `M4.41-item11` → `M4.42-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 45 | `M4.42-item11` → `M4.43-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 46 | `M4.43-item11` → `M4.44-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 47 | `M4.44-item11` → `M4.45-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 48 | `M4.45-item11` → `M4.46-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 49 | `M4.46-item11` → `M4.47-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 50 | `M4.47-item11` → `M4.48-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 51 | `M4.48-item11` → `M4.49-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 52 | `M4.49-item11` → `M4.50-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 53 | `M4.50-item11` → `M4.51-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 54 | `M4.51-item11` → `M4.52-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 55 | `M4.52-item11` → `M4.53-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 56 | `M4.53-item11` → `M4.54-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 57 | `M4.54-item11` → `M4.55-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 58 | `M4.55-item11` → `M4.56-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 59 | `M4.56-item11` → `M4.57-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 60 | `M4.57-item11` → `M4.58-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 61 | `M4.58-item11` → `M4.59-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 62 | `M4.59-item11` → `M4.60-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 63 | `M4.60-item11` → `M4.61-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 64 | `M4.61-item11` → `M4.62-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 65 | `M4.62-item11` → `M4.63-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 66 | `M4.63-item11` → `M4.64-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 67 | `M4.64-item11` → `M4.65-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 68 | `M4.65-item11` → `M4.66-item11` | `0a` | 1 | Ratified Amendment 3 §2.2 exception 1 | PASS |
| 69 | `M4.66-item11` → `A2-2.2-total` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 2 | PASS |
| 70 | `A2-2.2-total` → `A2-2.3-§4` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 71 | `A2-2.3-§4` → `M4.2-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 72 | `M4.2-item7` → `M4.2-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 73 | `M4.2-item8` → `M4.2-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 74 | `M4.2-item9` → `M4.3-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 75 | `M4.3-item7` → `M4.3-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 76 | `M4.3-item8` → `M4.3-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 77 | `M4.3-item9` → `M4.4-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 78 | `M4.4-item7` → `M4.4-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 79 | `M4.4-item8` → `M4.4-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 80 | `M4.4-item9` → `M4.5-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 81 | `M4.5-item7` → `M4.5-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 82 | `M4.5-item8` → `M4.5-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 83 | `M4.5-item9` → `M4.6-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 84 | `M4.6-item7` → `M4.6-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 85 | `M4.6-item8` → `M4.6-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 86 | `M4.6-item9` → `M4.7-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 87 | `M4.7-item7` → `M4.7-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 88 | `M4.7-item8` → `M4.7-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 89 | `M4.7-item9` → `M4.8-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 90 | `M4.8-item7` → `M4.8-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 91 | `M4.8-item8` → `M4.8-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 92 | `M4.8-item9` → `M4.9-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 93 | `M4.9-item7` → `M4.9-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 94 | `M4.9-item8` → `M4.9-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 95 | `M4.9-item9` → `M4.10-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 96 | `M4.10-item7` → `M4.10-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 97 | `M4.10-item8` → `M4.10-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 98 | `M4.10-item9` → `M4.11-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 99 | `M4.11-item7` → `M4.11-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 100 | `M4.11-item8` → `M4.11-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 101 | `M4.11-item9` → `M4.12-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 102 | `M4.12-item7` → `M4.12-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 103 | `M4.12-item8` → `M4.12-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 104 | `M4.12-item9` → `M4.13-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 105 | `M4.13-item7` → `M4.13-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 106 | `M4.13-item8` → `M4.13-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 107 | `M4.13-item9` → `M4.14-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 108 | `M4.14-item7` → `M4.14-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 109 | `M4.14-item8` → `M4.14-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 110 | `M4.14-item9` → `M4.15-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 111 | `M4.15-item7` → `M4.15-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 112 | `M4.15-item8` → `M4.15-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 113 | `M4.15-item9` → `M4.16-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 114 | `M4.16-item7` → `M4.16-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 115 | `M4.16-item8` → `M4.16-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 116 | `M4.16-item9` → `M4.17-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 117 | `M4.17-item7` → `M4.17-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 118 | `M4.17-item8` → `M4.17-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 119 | `M4.17-item9` → `M4.18-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 120 | `M4.18-item7` → `M4.18-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 121 | `M4.18-item8` → `M4.18-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 122 | `M4.18-item9` → `M4.19-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 123 | `M4.19-item7` → `M4.19-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 124 | `M4.19-item8` → `M4.19-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 125 | `M4.19-item9` → `M4.20-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 126 | `M4.20-item7` → `M4.20-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 127 | `M4.20-item8` → `M4.20-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 128 | `M4.20-item9` → `M4.21-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 129 | `M4.21-item7` → `M4.21-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 130 | `M4.21-item8` → `M4.21-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 131 | `M4.21-item9` → `M4.22-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 132 | `M4.22-item7` → `M4.22-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 133 | `M4.22-item8` → `M4.22-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 134 | `M4.22-item9` → `M4.23-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 135 | `M4.23-item7` → `M4.23-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 136 | `M4.23-item8` → `M4.23-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 137 | `M4.23-item9` → `M4.24-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 138 | `M4.24-item7` → `M4.24-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 139 | `M4.24-item8` → `M4.24-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 140 | `M4.24-item9` → `M4.25-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 141 | `M4.25-item7` → `M4.25-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 142 | `M4.25-item8` → `M4.25-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 143 | `M4.25-item9` → `M4.26-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 144 | `M4.26-item7` → `M4.26-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 145 | `M4.26-item8` → `M4.26-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 146 | `M4.26-item9` → `M4.27-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 147 | `M4.27-item7` → `M4.27-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 148 | `M4.27-item8` → `M4.27-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 149 | `M4.27-item9` → `M4.28-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 150 | `M4.28-item7` → `M4.28-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 151 | `M4.28-item8` → `M4.28-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 152 | `M4.28-item9` → `M4.29-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 153 | `M4.29-item7` → `M4.29-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 154 | `M4.29-item8` → `M4.29-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 155 | `M4.29-item9` → `M4.30-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 156 | `M4.30-item7` → `M4.30-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 157 | `M4.30-item8` → `M4.30-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 158 | `M4.30-item9` → `M4.31-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 159 | `M4.31-item7` → `M4.31-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 160 | `M4.31-item8` → `M4.31-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 161 | `M4.31-item9` → `M4.32-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 162 | `M4.32-item7` → `M4.32-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 163 | `M4.32-item8` → `M4.32-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 164 | `M4.32-item9` → `M4.33-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 165 | `M4.33-item7` → `M4.33-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 166 | `M4.33-item8` → `M4.33-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 167 | `M4.33-item9` → `M4.34-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 168 | `M4.34-item7` → `M4.34-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 169 | `M4.34-item8` → `M4.34-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 170 | `M4.34-item9` → `M4.35-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 171 | `M4.35-item7` → `M4.35-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 172 | `M4.35-item8` → `M4.35-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 173 | `M4.35-item9` → `M4.36-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 174 | `M4.36-item7` → `M4.36-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 175 | `M4.36-item8` → `M4.36-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 176 | `M4.36-item9` → `M4.37-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 177 | `M4.37-item7` → `M4.37-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 178 | `M4.37-item8` → `M4.37-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 179 | `M4.37-item9` → `M4.38-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 180 | `M4.38-item7` → `M4.38-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 181 | `M4.38-item8` → `M4.38-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 182 | `M4.38-item9` → `A2-2.3-§5` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 183 | `A2-2.3-§5` → `M4.39-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 184 | `M4.39-item7` → `M4.39-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 185 | `M4.39-item8` → `M4.39-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 186 | `M4.39-item9` → `M4.40-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 187 | `M4.40-item7` → `M4.40-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 188 | `M4.40-item8` → `M4.40-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 189 | `M4.40-item9` → `M4.41-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 190 | `M4.41-item7` → `M4.41-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 191 | `M4.41-item8` → `M4.41-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 192 | `M4.41-item9` → `M4.42-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 193 | `M4.42-item7` → `M4.42-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 194 | `M4.42-item8` → `M4.42-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 195 | `M4.42-item9` → `M4.43-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 196 | `M4.43-item7` → `M4.43-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 197 | `M4.43-item8` → `M4.43-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 198 | `M4.43-item9` → `M4.44-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 199 | `M4.44-item7` → `M4.44-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 200 | `M4.44-item8` → `M4.44-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 201 | `M4.44-item9` → `A2-2.3-§6` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 202 | `A2-2.3-§6` → `M4.45-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 203 | `M4.45-item7` → `M4.45-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 204 | `M4.45-item8` → `M4.45-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 205 | `M4.45-item9` → `M4.46-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 206 | `M4.46-item7` → `M4.46-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 207 | `M4.46-item8` → `M4.46-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 208 | `M4.46-item9` → `M4.47-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 209 | `M4.47-item7` → `M4.47-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 210 | `M4.47-item8` → `M4.47-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 211 | `M4.47-item9` → `M4.48-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 212 | `M4.48-item7` → `M4.48-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 213 | `M4.48-item8` → `M4.48-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 214 | `M4.48-item9` → `M4.49-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 215 | `M4.49-item7` → `M4.49-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 216 | `M4.49-item8` → `M4.49-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 217 | `M4.49-item9` → `M4.50-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 218 | `M4.50-item7` → `M4.50-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 219 | `M4.50-item8` → `M4.50-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 220 | `M4.50-item9` → `M4.51-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 221 | `M4.51-item7` → `M4.51-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 222 | `M4.51-item8` → `M4.51-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 223 | `M4.51-item9` → `M4.52-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 224 | `M4.52-item7` → `M4.52-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 225 | `M4.52-item8` → `M4.52-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 226 | `M4.52-item9` → `M4.53-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 227 | `M4.53-item7` → `M4.53-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 228 | `M4.53-item8` → `M4.53-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 229 | `M4.53-item9` → `M4.54-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 230 | `M4.54-item7` → `M4.54-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 231 | `M4.54-item8` → `M4.54-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 232 | `M4.54-item9` → `M4.55-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 233 | `M4.55-item7` → `M4.55-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 234 | `M4.55-item8` → `M4.55-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 235 | `M4.55-item9` → `M4.56-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 236 | `M4.56-item7` → `M4.56-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 237 | `M4.56-item8` → `M4.56-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 238 | `M4.56-item9` → `M4.57-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 239 | `M4.57-item7` → `M4.57-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 240 | `M4.57-item8` → `M4.57-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 241 | `M4.57-item9` → `M4.58-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 242 | `M4.58-item7` → `M4.58-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 243 | `M4.58-item8` → `M4.58-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 244 | `M4.58-item9` → `M4.59-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 245 | `M4.59-item7` → `M4.59-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 246 | `M4.59-item8` → `M4.59-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 247 | `M4.59-item9` → `M4.60-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 248 | `M4.60-item7` → `M4.60-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 249 | `M4.60-item8` → `M4.60-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 250 | `M4.60-item9` → `M4.61-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 251 | `M4.61-item7` → `M4.61-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 252 | `M4.61-item8` → `M4.61-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 253 | `M4.61-item9` → `M4.62-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 254 | `M4.62-item7` → `M4.62-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 255 | `M4.62-item8` → `M4.62-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 256 | `M4.62-item9` → `M4.63-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 257 | `M4.63-item7` → `M4.63-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 258 | `M4.63-item8` → `M4.63-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 259 | `M4.63-item9` → `A2-2.3-§7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 260 | `A2-2.3-§7` → `M4.64-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 261 | `M4.64-item7` → `M4.64-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 262 | `M4.64-item8` → `M4.64-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 263 | `M4.64-item9` → `M4.65-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 264 | `M4.65-item7` → `M4.65-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 265 | `M4.65-item8` → `M4.65-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 266 | `M4.65-item9` → `M4.66-item7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 267 | `M4.66-item7` → `M4.66-item8` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 268 | `M4.66-item8` → `M4.66-item9` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 exception 3 | PASS |
| 269 | `M4.66-item9` → `M5.4` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 270 | `M5.4` → `M5.6` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 271 | `M5.6` → `M5.7` | `0a 0a` | 2 | Ratified Amendment 3 §2.2 default rule | PASS |
| 272 | `M5.7` → `EOF` | `0a` | 1 | Ratified Amendment 3 §2.3 end-of-document byte | PASS |

## 3. `checkDecisionsFormat` result (Step 3)

Call shape used, with `trackedPaths` omitted:

```ts
checkDecisionsFormat({
  decisionsText: candidate,
  archiveText: readFileSync("Archive/DECISIONS-ARCHIVE-2026-08-18.md", "utf8"),
  archiveSource: "Archive/DECISIONS-ARCHIVE-2026-08-18.md",
})
```

Full required result fields, verbatim:

```json
{
  "ok": true,
  "issues": []
}
```

## 4. Exhaustive byte provenance (Step 4)

- Independent reconstruction: `/tmp/project-shrimp-phase4.obNF8Y/DECISIONS.reconstructed.md` (56964 bytes / SHA-256 `3dc5dbc0c6acbfe4f74fa353b80d53c7feeec4f5ada0a42d7b9773f26c26f4a8`).
- Candidate versus independent reconstruction: byte-for-byte PASS.
- All 272 fragment payload entries above: independently re-extracted from their named fenced sources and byte-for-byte PASS.
- All 272 join/EOF ledger entries above: exact Amendment 3 LF counts PASS.

### Section-by-section result

| Section | Exact comparison | Result |
|---|---|---|
| §1 | Whole fragment against manifest M2. | PASS |
| §2 | Whole fragment against manifest M3. | PASS |
| §3 | Amendment 2 introduction/header/declared-total and each of 65 manifest item-11 rows. | PASS |
| §4 | Amendment 2 heading/transition and each heading/statement/field-list triplet for M4.2–M4.38. | PASS |
| §5 | Amendment 2 heading/transition and each heading/statement/field-list triplet for M4.39–M4.44. | PASS |
| §6 | Amendment 2 heading/transition and each heading/statement/field-list triplet for M4.45–M4.63. | PASS |
| §7 | Amendment 2 heading/transition and each heading/statement/field-list triplet for M4.64–M4.66. | PASS |
| §8 | Whole fragments against manifest M5.4, M5.6, and M5.7; M5.6 and M5.7 were not subdivided. | PASS |

## 5. Replacement and disk read-back (Step 5)

- Report existence before first `DECISIONS.md` write: PASS (`audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-4-TARGET-CONSTRUCTION-REPORT-2026-08-08.md`).
- Whole-file replacement from verified scratch candidate: PASS.
- `cmp -s /tmp/project-shrimp-phase4.obNF8Y/DECISIONS.candidate.md DECISIONS.md`: exit 0; PASS.
- Disk read-back: `56964` bytes / SHA-256 `3dc5dbc0c6acbfe4f74fa353b80d53c7feeec4f5ada0a42d7b9773f26c26f4a8`; exact candidate match PASS.
- Post-write `checkDecisionsFormat` result, same call shape with `trackedPaths` omitted:

```json
{
  "ok": true,
  "issues": []
}
```

## 6. Closing measurement (Step 6)

- Branch: `codex/decisions-migration` — unchanged; PASS.
- HEAD: `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` — unchanged; PASS.
- Staged paths: none — PASS.
- Modified tracked paths: `DECISIONS.md`, plus the two pre-existing accepted Phase 1 modifications `lib/decisions-format.ts` and `scripts/tests/decisions-format.ts` — PASS.
- Phase-owned tracked change: `DECISIONS.md` only — PASS.
- Phase-created repository path: the allowlisted report only — PASS.
- No commit, push, branch operation, move, rename, or deletion occurred — PASS.
- All read-only authority/archive/Phase-1 input identities remained unchanged — PASS.

Closing `git status --porcelain=v1 --untracked-files=all`:

```text
 M DECISIONS.md
 M lib/decisions-format.ts
 M scripts/tests/decisions-format.ts
?? Archive/DECISIONS-ARCHIVE-2026-08-18.md
?? Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-RATIFICATION-2026-08-08.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-STRUCTURAL-SURFACES-2026-08-08.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-ASSEMBLY-JOINS-2026-08-08.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-RATIFICATION-2026-08-08.md
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
?? DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2A-TASK-2-TASK-3-REMEASUREMENT-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-1-CLOSEOUT-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-1-CODEX-HANDOFF-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-1-F16-CORRECTION-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-2-CLOSEOUT-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-2-CODEX-HANDOFF-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-2-PRESERVATION-SNAPSHOT-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-3-CLOSEOUT-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-3-CODEX-HANDOFF-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-3-NORMALIZED-ARCHIVE-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-4-CODEX-HANDOFF-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-4-TARGET-CONSTRUCTION-WORK-ORDER-2026-08-08.md
?? audit/decisions-migration-2026-07-29/DATE-OCCURRENCE-CENSUS-2026-08-07.md
?? audit/decisions-migration-2026-07-29/DERIVED-REPORT-STEP-6-VERIFICATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/DERIVED-REPORT-VALIDATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FOUR-FINDING-REPAIR-REPORT-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FOUR-FINDING-REPAIR-VERIFICATION-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-DISPOSITION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-A-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-B-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-C-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-D-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-E-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-REVIEW-NARROW-RECOMMISSION-SUPPLEMENTAL-DISPOSITION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-COMMISSION-STATUS-RECORD-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-DISPOSITION-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-A-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-B-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-C-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-D-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-E-2026-08-06.md
?? audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-REPAIR-REPORT-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-VERIFICATION-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-OWNER-CONFIRMING-READ-RERUN-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-OWNER-CONFIRMING-READ-VOID-RECEIPT-ADJUDICATION-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-RESERVATION-RECORDING-CONFIRMATION-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-RESERVATION-RECORDING-REPAIR-REPORT-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4.35-EXCLUSIVITY-REPAIR-REPORT-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.35-EXCLUSIVITY-REPAIR-VERIFICATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.35-SENTENCE-COUNT-CONFIRMING-READ-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.35-SENTENCE-COUNT-REPAIR-REPORT-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.35-SENTENCE-COUNT-REPAIR-VERIFICATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.4-ADJACENT-WHITESPACE-REPAIR-REPORT-2026-08-06.md
?? audit/decisions-migration-2026-07-29/M4.4-ADJACENT-WHITESPACE-REPAIR-VERIFICATION-2026-08-06.md
?? audit/decisions-migration-2026-07-29/M5-REPAIR-INDEPENDENT-COLD-REVIEW-FINAL-2026-08-04.md
?? audit/decisions-migration-2026-07-29/M6-PARTIAL-M6-ONLY-SNAPSHOT-2026-08-04.md.frozen
?? audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-RESUME-NOTE-SNAPSHOT-2026-08-04.md.frozen
?? audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-SNAPSHOT-2026-08-04.md.frozen
?? audit/decisions-migration-2026-07-29/M6-REPAIR-PRE-CENSUS-2026-08-04.md
?? audit/decisions-migration-2026-07-29/M6-REPAIR-REPORT-2026-08-04.md
?? audit/decisions-migration-2026-07-29/M6-REPAIR-VERIFICATION-2026-08-04.md
?? audit/decisions-migration-2026-07-29/POST-ASSEMBLY-DETERMINISTIC-VERIFICATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08-RESUMPTION.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-2-PRESERVATION-SNAPSHOT-REPORT-2026-08-08.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-3-NORMALIZED-ARCHIVE-REPORT-2026-08-08.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-4-TARGET-CONSTRUCTION-REPORT-2026-08-08.md
?? audit/decisions-migration-2026-07-29/STEP-3-SURFACE-MAPPING-2026-08-07.md
?? audit/decisions-migration-2026-07-29/TASK-2-TASK-3-REMEASUREMENT-2026-08-07.md
?? audit/decisions-migration-2026-07-29/target-text-manifest.md
```

## 7. Overall disposition

**PASS** — the target was constructed exclusively from the three ratified, disjoint authorities; exhaustive reconstruction/provenance, live conformance, exact disk read-back, and closing-state checks all passed.

