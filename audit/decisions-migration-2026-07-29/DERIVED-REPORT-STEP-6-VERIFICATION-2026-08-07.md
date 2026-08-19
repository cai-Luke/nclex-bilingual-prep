# Stage 2a derived occurrence report — M7.5 step 6 verification receipt

**Disposition: PASS.** This receipt executes M7.5 step 6 only. The completed-manifest occurrence population remains exactly the mapped 288 occurrences, the inserted terminal report adds no occurrence, and the embedded report is byte-identical to an independent regeneration from the validated mapping.

No Stage 2b work, owner ratification, manifest edit, mapping edit, census edit, work-order edit, or `DECISIONS.md` edit is performed or authorized by this receipt.

## 1. Opening authority and repository state

| item | independently measured value | result |
|---|---|---|
| Completed manifest | `332579` bytes / `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` | PASS |
| Step-2 census | `60122` bytes / `a7231030b7d837deb8a216004ae44f21eb2145b924756ae1a5631735d849f8f8` | PASS |
| Step-3 mapping | `49206` bytes / `5a2e0500eee982b81ea7f6ea87745b6f86b4245e11f289cc9bdbe4dc6a3acc86` | PASS |
| Step-4 generation work order | `14334` bytes / `9b4f11300949053dde9ed5c366bce67fcce9a136a9420b3dc6cea75eafe24e4f` | PASS |
| Step-4 generated-report authority | `17788` bytes / `fec09bf2db0cc58443d78e781f7bb85f8a38f0fec746e93ccffdfa231427fc18` | PASS |
| Branch | `codex/decisions-migration` | PASS |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` | PASS |
| `DECISIONS.md` | `76314` bytes / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | PASS |
| `MIGRATION_BASELINE:DECISIONS.md` | `76314` bytes / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | PASS |
| `DECISIONS.md` byte-identical to baseline | `true` | PASS |
| Tracked working-tree diff names | `0` | PASS |
| Staged diff names | `0` | PASS |

### Opening `git status --porcelain`

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
?? DECISIONS-MIGRATION-STAGE-2A-TASK-2-TASK-3-REMEASUREMENT-WORK-ORDER-2026-08-07.md
?? audit/decisions-migration-2026-07-29/
```

## 2. Completed-manifest population re-derivation

The occurrence population was re-derived over the complete manifest byte range from byte 0 through EOF using ripgrep’s PCRE2 raw-byte matcher with the locked maximal ISO-token rule and adjacent-digit boundary guards. The scan did not stop at the pre-insertion boundary and did not take its population from the census or mapping.

```text
scan_scope=completed manifest bytes 0..332579
completed_occurrence_count=288
mapping_occurrence_count=288
census_occurrence_count=288
ordered_mapping_offsets_and_literals_equal=true
ordered_census_offsets_and_literals_equal=true
first_occurrence_offset=1026
last_occurrence_offset=311458
```

**PASS.** All 288 completed-manifest matches have the same ordered byte offsets and literals as the 288 validated mapping rows and the 288 accepted census rows. No occurrence was added, removed, moved, or changed.

## 3. Inserted-report occurrence exclusion

| assertion | measured value | result |
|---|---:|---|
| Embedded report start offset | `314791` | PASS |
| Completed population last occurrence start | `311458` | PASS |
| ISO occurrences in embedded report bytes | `0` | PASS |
| Completed-manifest occurrences | `288` | PASS |
| Pre-insertion census occurrences | `288` | PASS |

The terminal report begins after the last occurrence and contains zero matches under the binding occurrence rule. Because the full-file ordered population equals the accepted pre-insertion population, the insertion introduced no occurrence.

The locked four near-miss scans also measured zero over the embedded bytes:

| scan | hits |
|---|---:|
| Exactly eight digits bounded by non-digits | 0 |
| Slash-form numeric date | 0 |
| Dot-form numeric date | 0 |
| English month-name date, either order | 0 |

## 4. Independent regeneration from the validated mapping

The report was regenerated in memory from the pinned mapping under the locked step-4 rules: the date-free header and family register; one ascending row per mapped occurrence; `front-matter` for occurrences 1–7; authoritative mapping sections for occurrences 8–288; mapped `record_item`, `surface_id`, byte spans, and family; and disposition derived only from the family prefix. No literal, context, filename, dated locator, family ground, or free-text locator was emitted.

| regenerated property | measured value | result |
|---|---|---|
| Byte length | `17788` | PASS |
| SHA-256 | `fec09bf2db0cc58443d78e781f7bb85f8a38f0fec746e93ccffdfa231427fc18` | PASS |
| Final LF present | `true` | PASS |
| Matches step-4 authority | `true` | PASS |
| ISO occurrence scan | `0` hits | PASS |
| Eight-digit near-miss scan | `0` hits | PASS |
| Slash-form near-miss scan | `0` hits | PASS |
| Dot-form near-miss scan | `0` hits | PASS |
| Month-name near-miss scan | `0` hits | PASS |

## 5. Embedded terminal report extraction and equality

The exact line `# Derived occurrence report` occurs once in the completed manifest. Extraction begins at its `#` byte and runs through EOF, including the final LF.

| embedded property | measured value | result |
|---|---|---|
| Header count | `1` | PASS |
| Start offset | `314791` | PASS |
| Terminal through EOF | `true` | PASS |
| Byte length | `17788` | PASS |
| SHA-256 | `fec09bf2db0cc58443d78e781f7bb85f8a38f0fec746e93ccffdfa231427fc18` | PASS |
| Final LF present | `true` | PASS |
| Matches step-4 authority | `true` | PASS |
| Byte-identical to regeneration | `true` | PASS |
| Byte-identical to the step-4 receipt block | `true` | PASS |

**PASS.** Embedded and regenerated byte streams are identical for all 17,788 bytes, including the final LF. Both measure SHA-256 `fec09bf2db0cc58443d78e781f7bb85f8a38f0fec746e93ccffdfa231427fc18`.

## 6. Cursor removal and pre-report byte preservation

| assertion | measured value | result |
|---|---|---|
| `@@ASSEMBLY_CURSOR@@` count in completed manifest | `0` | PASS |
| Pre-report prefix length | `314791` bytes | PASS |
| Expected pre-report prefix length | `314791` bytes | PASS |
| In-memory candidate reconstruction length | `314811` bytes | PASS |
| In-memory candidate reconstruction SHA-256 | `33821e548cd576eae33609931af8cffd0e6e3b9771a693df968bd758d5c5580c` | PASS |
| Reconstruction equals pinned pre-insertion candidate identity | `true` | PASS |
| Completed-size arithmetic: prefix plus embedded report | `true` | PASS |

The pre-insertion candidate was reconstructed only in memory as the completed manifest’s 314,791-byte prefix followed by the original 20-byte `@@ASSEMBLY_CURSOR@@` line and LF. The reconstruction is exactly 314,811 bytes with SHA-256 `33821e548cd576eae33609931af8cffd0e6e3b9771a693df968bd758d5c5580c`, equal to the pinned candidate authority. Therefore no pre-report byte changed; step 5 replaced only the terminal cursor line with the authorized report bytes.

## 7. Completed-manifest integrity

| check | measured value | result |
|---|---:|---|
| Strict UTF-8 decode | `true` | PASS |
| U+FFFD count | `0` | PASS |
| CRLF count | `0` | PASS |
| Bare CR count | `0` | PASS |
| Final LF present | `true` | PASS |
| Physical lines | `6262` | PASS |

## 8. Findings

| class | count | disposition |
|---|---:|---|
| BLOCKER | 0 | None measured. |
| REQUIRED REPAIR | 0 | None measured. |
| ADVISORY | 0 | None measured. |

## 9. Closing state and boundaries

Closeout remeasurement:

| item | measured value | result |
|---|---|---|
| Completed manifest | `332579` bytes / `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` | PASS |
| Step-2 census | `60122` bytes / `a7231030b7d837deb8a216004ae44f21eb2145b924756ae1a5631735d849f8f8` | PASS |
| Step-3 mapping | `49206` bytes / `5a2e0500eee982b81ea7f6ea87745b6f86b4245e11f289cc9bdbe4dc6a3acc86` | PASS |
| Step-4 work order | `14334` bytes / `9b4f11300949053dde9ed5c366bce67fcce9a136a9420b3dc6cea75eafe24e4f` | PASS |
| `DECISIONS.md` | `76314` bytes / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | PASS |
| Branch | `codex/decisions-migration` | PASS |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` | PASS |
| Tracked working-tree diff names | `0` | PASS |
| Staged diff names | `0` | PASS |
| Step-6 receipt state | untracked | PASS |

### Closing `git status --porcelain`

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
?? DECISIONS-MIGRATION-STAGE-2A-TASK-2-TASK-3-REMEASUREMENT-WORK-ORDER-2026-08-07.md
?? audit/decisions-migration-2026-07-29/
```

Unmeasured and not asserted by this receipt: Stage 2b readiness, owner ratification, semantic correctness of family assignments or fixedness grounds, comparative rebinding proofs beyond this completed-state equality check, and the commission-required constitutional-content review.

The only repository write authorized and performed is this untracked step-6 receipt. The manifest, mapping, census, step-4 work order, and `DECISIONS.md` remain unedited; no file was staged, committed, pushed, stashed, reset, checked out, or cleaned.
