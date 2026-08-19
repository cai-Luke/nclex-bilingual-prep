# Stage 2b Phase 6 — conformance wiring report

**Date:** 2026-08-12  
**Phase:** Stage 2b Phase 6 / commission §5.8  
**Branch:** \`codex/decisions-migration\`  
**Disposition:** Success-path receipt; repository conformance is not accepted by this phase.

## 1. Frozen-order identity

Quoted from the owner-issued handoff:

| field | value |
|---|---|
| File | \`DECISIONS-MIGRATION-STAGE-2B-PHASE-6-CONFORMANCE-WIRING-WORK-ORDER-2026-08-12.md\` |
| Revision | 7 |
| Byte length | \`25296\` |
| SHA-256 | \`a550d3c7a3eb26ad6f7c1f85c4beb6e9b1b04a8cc52c74e9f78f3230beebf4c7\` |
| Frozen by | Owner, 2026-08-12 |

## 2. Opening and closing measurements

Opening state:

- Branch: \`codex/decisions-migration\`
- HEAD: \`05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5\`
- Staged paths: none.
- Opening status contained 131 entries. The full \`git status --porcelain=v1 --untracked-files=all\` path/status set was:

~~~text
 M DECISIONS.md
 M lib/decisions-format.ts
 M package.json
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
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-4-CLOSEOUT-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-4-CODEX-HANDOFF-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-4-TARGET-CONSTRUCTION-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-5-CLOSEOUT-2026-08-11.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-5-CODEX-HANDOFF-2026-08-11.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-CODEX-HANDOFF-2026-08-11.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-WORK-ORDER-2026-08-11.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-5-RECONCILIATION-CHECKER-WORK-ORDER-2026-08-11.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-6-CODEX-HANDOFF-2026-08-12.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-6-CONFORMANCE-WIRING-WORK-ORDER-2026-08-12.md
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
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-REPORT-2026-08-11.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-SECTION-9-INDEPENDENT-EXECUTION-RECORD-2026-08-11.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-TARGET-RECONCILE-REPORT-2026-08-11.md
?? audit/decisions-migration-2026-07-29/STEP-3-SURFACE-MAPPING-2026-08-07.md
?? audit/decisions-migration-2026-07-29/TASK-2-TASK-3-REMEASUREMENT-2026-08-07.md
?? audit/decisions-migration-2026-07-29/target-text-manifest.md
?? scripts/decisions-migration-target-reconcile.ts
~~~


Opening digests and lengths:

| path | bytes | SHA-256 |
|---|---:|---|
| \`package.json\` | 8542 | \`8f0ade576da1515e7400b7f6c54990b4ae71ea2cd5b1846b7f788d71ab4af582\` |
| \`.github/workflows/promotion-gate.yml\` | 1078 | \`65a5b63f9e95f34eb9834739f39c1b9b6c246f9661bca6dc95fe339b45ef77dc\` |
| \`DECISIONS.md\` | 56964 | \`3dc5dbc0c6acbfe4f74fa353b80d53c7feeec4f5ada0a42d7b9773f26c26f4a8\` |
| \`Archive/DECISIONS-ARCHIVE-2026-08-18.md\` | 13997 | \`e75e979ea121fa1a697861f8de4a4527f07ef2d8b7ed1f4d299bf504163e873c\` |
| \`Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md\` | 76314 | \`b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e\` |
| \`scripts/decisions-format-conform.ts\` | 4666 | \`b037dfa75a99c990541a3d6a50ecfe73b35be4ab249b046a970059b0f467c9db\` |
| \`scripts/tests/decisions-format.ts\` | 41335 | \`251b55697b202845e805201c7f972c54bac2688e9156b6ba598e11454a75d15f\` |
| \`scripts/decisions-migration-target-reconcile.ts\` | 47448 | \`bd89de205fa873f8f65824e607a950c68dfe33cdc926dc1317e1d63b7aac2639\` |
| \`lib/decisions-format.ts\` | 47075 | \`10e59335d02eb90163b465570c4e467323d3ff9d224585774e264846590fe1e4\` |
| \`audit/decisions-migration-2026-07-29/target-text-manifest.md\` | 332579 | \`818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2\` |

Locality-baseline copies outside the repository matched their opening digests:

- \`/tmp/project-shrimp-phase6.is3AgS/package.json.opening\`: \`8f0ade576da1515e7400b7f6c54990b4ae71ea2cd5b1846b7f788d71ab4af582\`
- \`/tmp/project-shrimp-phase6.is3AgS/promotion-gate.yml.opening\`: \`65a5b63f9e95f34eb9834739f39c1b9b6c246f9661bca6dc95fe339b45ef77dc\`

Closing state:

- Branch: \`codex/decisions-migration\`
- HEAD: \`05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5\`
- Staged paths: none.
- Closing status contained 132 entries: the opening set plus the authorized modified workflow path \` M .github/workflows/promotion-gate.yml\`. The complete closing output was otherwise identical to the opening set, with no other additions, removals, or status changes.
- The bidirectional status comparison passed:
  - \`opening_status_entries=131\`
  - \`closing_status_entries=132\`
  - \`status_paths_bidirectional_comparison=PASS\`
  - \`only_package_json_and_workflow_may_differ=PASS\`

Closing digests and lengths:

| path | bytes | SHA-256 |
|---|---:|---|
| \`package.json\` | 8694 | \`1ac8b4fcb54dd8595733bbb4874e78a0a3b40ca618c0f3febb7eb61ceb3c624d\` |
| \`.github/workflows/promotion-gate.yml\` | 1233 | \`a25933a0aa3265f0638db13cf50a9d29d7cea53e88600ed64fe6ff03d230692b\` |
| \`DECISIONS.md\` | 56964 | \`3dc5dbc0c6acbfe4f74fa353b80d53c7feeec4f5ada0a42d7b9773f26c26f4a8\` |
| \`Archive/DECISIONS-ARCHIVE-2026-08-18.md\` | 13997 | \`e75e979ea121fa1a697861f8de4a4527f07ef2d8b7ed1f4d299bf504163e873c\` |
| \`Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md\` | 76314 | \`b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e\` |
| \`scripts/decisions-format-conform.ts\` | 4666 | \`b037dfa75a99c990541a3d6a50ecfe73b35be4ab249b046a970059b0f467c9db\` |
| \`scripts/tests/decisions-format.ts\` | 41335 | \`251b55697b202845e805201c7f972c54bac2688e9156b6ba598e11454a75d15f\` |
| \`scripts/decisions-migration-target-reconcile.ts\` | 47448 | \`bd89de205fa873f8f65824e607a950c68dfe33cdc926dc1317e1d63b7aac2639\` |
| \`lib/decisions-format.ts\` | 47075 | \`10e59335d02eb90163b465570c4e467323d3ff9d224585774e264846590fe1e4\` |
| \`audit/decisions-migration-2026-07-29/target-text-manifest.md\` | 332579 | \`818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2\` |

Protected-surface byte identity passed for all eight protected surfaces enumerated by §10 step 11. The index check also passed:

~~~text
index_paths=<none>
index_unchanged=PASS
branch=codex/decisions-migration
HEAD=05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5
~~~

## 3. Authorized edits and locality proofs

### package.json

Exact added line:

~~~text
    "conform:decisions": "tsx scripts/decisions-format-conform.ts --root . --decisions DECISIONS.md --archive Archive/DECISIONS-ARCHIVE-2026-08-18.md",
~~~

The opening copy was reconstructed in memory by inserting that exact line immediately after the existing \`reconcile:decisions-migration-target\` line. The live file compared byte-for-byte equal to the reconstruction.

~~~text
json_parse=PASS
package_opening_bytes=8542
package_closing_bytes=8694
package_byte_delta=152
package_expected_delta=152
added_script_keys=["conform:decisions"]
other_script_keys_unchanged=PASS
added_line=    "conform:decisions": "tsx scripts/decisions-format-conform.ts --root . --decisions DECISIONS.md --archive Archive/DECISIONS-ARCHIVE-2026-08-18.md",
package_locality_reconstruction=PASS
~~~

Arithmetic: 8542 + 152 = 8694.

### .github/workflows/promotion-gate.yml

Exact added lines:

~~~text
      - name: Test DECISIONS format and repository conformance
        run: |
          npm run test:decisions-format
          npm run conform:decisions
~~~

The opening copy was reconstructed in memory by appending exactly that block immediately after the existing \`Check census drift\` step. The live file compared byte-for-byte equal to the reconstruction.

~~~text
yaml_parse=PASS
workflow_opening_bytes=1078
workflow_closing_bytes=1233
workflow_byte_delta=155
workflow_expected_delta=155
workflow_step_count_before=11
workflow_step_count_after=12
existing_workflow_steps_unchanged=PASS
added_line_1=      - name: Test DECISIONS format and repository conformance
added_line_2=        run: |
added_line_3=          npm run test:decisions-format
added_line_4=          npm run conform:decisions
workflow_locality_reconstruction=PASS
~~~

Arithmetic: 1078 + 155 = 1233.

## 4. Pin comparisons

Pre-edit comparison:

~~~text
M0.1_pin=Archive/DECISIONS-ARCHIVE-2026-08-18.md
prescribed_archive=Archive/DECISIONS-ARCHIVE-2026-08-18.md
archive_present_on_disk=Archive/DECISIONS-ARCHIVE-2026-08-18.md
pre_edit_pin_comparison=PASS
~~~

Post-edit comparison:

~~~text
M0.1_pin=Archive/DECISIONS-ARCHIVE-2026-08-18.md
package_command_archive=Archive/DECISIONS-ARCHIVE-2026-08-18.md
archive_present_on_disk=Archive/DECISIONS-ARCHIVE-2026-08-18.md
post_edit_pin_comparison=PASS
~~~

## 5. Command transcript

The following are the Phase 6 execution commands and their exit codes. The pre-edit and post-edit fixture runs produced the same output.

### Pre-edit fixture regression — exit 0

Command: \`npm run test:decisions-format\`

~~~text
> nclex-bilingual-prep@0.1.0 test:decisions-format
> tsx scripts/tests/decisions-format.ts

Fixture matrix
F1: PASS
F2: PASS
F3: PASS
F4: PASS
F5: PASS
F6: PASS
F7: PASS
F8: PASS
F9: PASS
F10: PASS
F11: PASS
F12: PASS
F13: PASS
F14: PASS
F15: PASS
F16: PASS
M1: REJECT HEADING_SHAPE
M2: REJECT DERIVED_ID
M3: REJECT DUPLICATE_CORE
M4: REJECT ORPHAN_ATTACHMENT
M5: REJECT EMPTY_FIELD
M6: REJECT FIELD_ORDER
M7: REJECT UNKNOWN_FIELD
M8: REJECT STATEMENT_LENGTH
M9: REJECT STATEMENT_SHAPE
M10: REJECT KIND_SECTION
M11: REJECT ANCHOR_CITATION
M12: REJECT ID_ON_NAME_ADDRESSED
M13: REJECT ARCHIVE_BLOCK_IN_DECISIONS
M14: REJECT TITLE_COLLISION
M15: REJECT MISSING_FIELD
M16: REJECT INVALID_FIELD_VALUE
M17: REJECT STATUS_KIND
M18: REJECT DECLARED_TOTAL_SHAPE
M19: REJECT MISSING_FIELD
M20: PASS
M21: PASS
M22: PASS
M23: PASS
C1: FINDING MISSING_DECLARED_TOTAL
C2: FINDING INDEX_BODY_MISMATCH
C3: FINDING INDEX_ORDER_MISMATCH
C4: FINDING DECLARED_TOTAL_MISMATCH
C5: FINDING UNTRACKED_PATH
C6: FINDING ALLOCATION_GAP
C7: FINDING ARCHIVE_INDEX_MISMATCH
C8: FINDING RETIRED_ID_CONFLICT
Negative control output
[FAIL] HEADING_SHAPE negative-DECISIONS.md:33 block=P4 - Malformed heading — Invalid entry heading: P4 - Malformed heading
[FAIL] INDEX_BODY_MISMATCH negative-DECISIONS.md assertion=12 — Index-only keys: P2#0; body-only keys: P3#0
[FAIL] UNTRACKED_PATH negative-DECISIONS.md:14 assertion=15 block=P1#0 — Owner path is not tracked: not-a-real-owner.ts
[FAIL] ARCHIVE_INDEX_MISMATCH negative-DECISIONS.md assertion=14 — Archive index/wrapper mismatch for Missing archive wrapper
Repaired control output
[PASS] DECISIONS format conforms
live blocks: 2
index rows: 2
archive wrappers: 0
archive index lines: 0
retired-register rows: 0
decisions-format tests passed
~~~

### Package edit locality proof — exit 0

Command: the Node reconstruction/JSON/locality check shown in §3.

~~~text
json_parse=PASS
package_opening_bytes=8542
package_closing_bytes=8694
package_byte_delta=152
package_expected_delta=152
added_script_keys=["conform:decisions"]
other_script_keys_unchanged=PASS
added_line=    "conform:decisions": "tsx scripts/decisions-format-conform.ts --root . --decisions DECISIONS.md --archive Archive/DECISIONS-ARCHIVE-2026-08-18.md",
package_locality_reconstruction=PASS
~~~

### Workflow edit locality proof — exit 0

Command: the Ruby YAML/reconstruction/locality check shown in §3.

~~~text
yaml_parse=PASS
workflow_opening_bytes=1078
workflow_closing_bytes=1233
workflow_byte_delta=155
workflow_expected_delta=155
workflow_step_count_before=11
workflow_step_count_after=12
existing_workflow_steps_unchanged=PASS
added_line_1=      - name: Test DECISIONS format and repository conformance
added_line_2=        run: |
added_line_3=          npm run test:decisions-format
added_line_4=          npm run conform:decisions
workflow_locality_reconstruction=PASS
~~~

### Post-edit fixture regression — exit 0

Command: \`npm run test:decisions-format\`

Output was byte-for-byte identical to the pre-edit fixture regression output above; all fixture, negative-control, repaired-control, and live conformance checks passed.

### Live repository conformance — exit 1, predicted evidence

Command: \`npm run conform:decisions\`

~~~text
> nclex-bilingual-prep@0.1.0 conform:decisions
> tsx scripts/decisions-format-conform.ts --root . --decisions DECISIONS.md --archive Archive/DECISIONS-ARCHIVE-2026-08-18.md

[FAIL] UNTRACKED_PATH DECISIONS.md:792 assertion=15 block=Producer assignments are operational state, not constitutional text — Evidence path is not tracked: Archive/DECISIONS-ARCHIVE-2026-08-18.md
~~~

This is the exact single predicted finding. Repository conformance is intentionally not accepted because the normalized archive remains untracked, as required by the order.

### Post-edit pin comparison — exit 0

Output is recorded in §4; \`post_edit_pin_comparison=PASS\`.

### Existing migration reconciliation — exit 0

Command: \`npm run reconcile:decisions-migration\`

~~~text
> nclex-bilingual-prep@0.1.0 reconcile:decisions-migration
> tsx scripts/decisions-migration-reconcile.ts

DECISIONS migration reconciliation passed.
inventory=80; independent=79; STAY=65; ARCHIVE=14; MERGE_INTO=1
sections: §4=37 (25 permanent numbers), §5=6, §6=19, §7=3, §8=14
~~~

### Target migration reconciliation — exit 0

Command: \`npm run reconcile:decisions-migration-target\`

~~~text
> nclex-bilingual-prep@0.1.0 reconcile:decisions-migration-target
> tsx scripts/decisions-migration-target-reconcile.ts

Report 1 [PASS] — source-row accounting: 65 live / 13 wrappers / 1 structural E053 / 1 MERGE_INTO E037 = 80
Report 2 [PASS] — section totals and identifier allocation: P=37 / R=6 / I=19 / T=3; allocation unions P1–P31 and R1–R6
Report 3 [PASS] — wrapper source-span and hash preservation: 13 baseline Buffer spans verified and matched to the corresponding parsed wrapper body
Report 4 [PASS] — preservation snapshot exact equality: snapshot bytes compared directly to git-show MIGRATION_BASELINE:DECISIONS.md
Report 5 [PASS] — no unaccounted source entry: the independently pinned 80-row population is fully covered by target dispositions
Report 6 [PASS] — no duplicate destination accounting: each of the 80 source rows occupies exactly one of the four target disposition classes
Report 7 [PASS] — no target block absent from the manifest: 65 live blocks checked by identity and exact manifest-owned heading/statement/field/index bytes
Report 8 [PASS] — no manifest block absent from target output: 65 manifest records checked by identity and exact manifest-owned heading/statement/field/index bytes
Amendment 2 surfaces [PASS] — eight ratified structural surfaces checked byte-for-byte in target DECISIONS.md.
Amendment 3 joins [SCOPE] — join bytes and the end-of-document byte are outside this Phase 5 checker's byte-verification scope; authority is ratified Amendment 3, covered by Phase 4's 272-entry join ledger, independent whole-document reconstruction, and pre/post-write checkDecisionsFormat runs accepted at Phase 4 closeout.
Amendment 4 E053 [PASS] — historical 14-entry ARCHIVE classification reconciled to 13 wrappers + 13 index lines + one structural E053 row, with no E053 wrapper or index-line shape.
DECISIONS target reconciliation passed.
~~~

### TypeScript build check — exit 0

Command: \`npx tsc -b --pretty false\`

Output: empty.

### Index/ref preservation check — exit 0

~~~text
index_paths=<none>
index_unchanged=PASS
branch=codex/decisions-migration
HEAD=05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5
~~~

## 6. Lifecycle condition

Any \`MIGRATION_DATE\` rebinding, or any manifest supersession affecting the M0.1 normalized-archive filename, occurring before repository conformance is accepted, **invalidates the Phase 6 conformance result**. The result does not become valid again until the \`conform:decisions\` command in \`package.json\` is updated to the new M0.1 filename under whatever authority then governs, and all of the following are reproduced against the new pin: three-way pin equality per §7; the fixture regression command; the live conformance command, with the expected result appropriate to the archive's trackedness at that time; both reconciliation commands; the TypeScript build check; and byte identity of the protected surfaces enumerated in §10 step 11, measured between the opening and closing state of that revalidation run itself. Protected-surface byte identity after a rebinding never means equality to the pre-rebinding Phase 6 digests: an authorized rebinding necessarily changes the ratified manifest, the migrated \`DECISIONS.md\`, the date-dependent archive surfaces, and the package command's archive argument. That is a verification set, not a re-execution of §10 — §10 contains one-time wiring and receipt steps that cannot be performed twice.

A rebinding is never reconciled by editing the archive filename alone, and never by editing the package command alone.

## 7. Disposition

No stop condition fired. The authorized wiring is complete and locally proven.

Repository conformance is **not accepted by this phase**. The live command is wired correctly and its only finding is the predicted untracked normalized archive path. Tracking that archive is reserved for the later Stage 2b content commit and was expressly unauthorized here.

No repository path outside the two authorized edits and this receipt was changed. Nothing was staged, committed, pushed, or tracked.
