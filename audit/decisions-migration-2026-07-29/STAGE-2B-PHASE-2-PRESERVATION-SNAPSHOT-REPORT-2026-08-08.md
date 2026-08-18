# Stage 2b Phase 2 — preservation snapshot report

**Authorized order:** `DECISIONS-MIGRATION-STAGE-2B-PHASE-2-PRESERVATION-SNAPSHOT-WORK-ORDER-2026-08-08.md`, revision 2, externally verified at 15047 bytes / SHA-256 `7cef5c4955b8ff1577d38a8bfe0aa869d59df69403d6e9b8e78b7a7799e2f9ee`

## 1. Opening measurement

Measured from live local disk before any Phase 2 repository write:

| item | observed state | §3 comparison |
|---|---:|---|
| Branch | `codex/decisions-migration` | Match |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` | Match |
| Staged paths | None | Match |
| Modified tracked paths | Exactly `lib/decisions-format.ts` and `scripts/tests/decisions-format.ts` | Match; expected Phase 1 output |
| `DECISIONS.md` | 76314 bytes / SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | Match |
| `lib/decisions-format.ts` | 47075 bytes / SHA-256 `10e59335d02eb90163b465570c4e467323d3ff9d224585774e264846590fe1e4` | Match |
| `scripts/tests/decisions-format.ts` | 41335 bytes / SHA-256 `251b55697b202845e805201c7f972c54bac2688e9156b6ba598e11454a75d15f` | Match |
| `Archive/DECISIONS-ARCHIVE-2026-07-14.md` | 37094 bytes / SHA-256 `d311813aeca181da908ea33907fdb919385b2c8171afad0003c3389b40e067a7` | Present; length measured here as required |
| `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` | Absent | Match; this phase creates it |
| Repository-root `.gitattributes` | Absent | Match |
| Ratified manifest | 332579 bytes / SHA-256 `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` | Match |

The complete porcelain status contains the two expected modified tracked paths and the pre-existing untracked migration working set, including this order, the Phase 2 handoff, and the audit directory. No third tracked path is modified, and nothing is staged. The untracked population is context, not a finding.

## 2. Resolved `MIGRATION_BASELINE`

The committed declaration was read with:

~~~sh
git show HEAD:DECISIONS-MIGRATION-COMMISSION-2026-07-29.md | sed -n 's/.*MIGRATION_BASELINE = \([0-9a-f][0-9a-f]*\).*/\1/p' | head -1
~~~

It yielded the abbreviated token `d499cc1`. Resolving that prefix against `git rev-list --all` yielded exactly one full commit SHA:

~~~text
d499cc1d0916e03830489ec9cd0324cd1a203a73
~~~

This equals the M0.1 pin and was the only SHA passed to the baseline-object command.

## 3. Baseline object measurement

Before any snapshot write, the baseline object was materialized ephemerally with:

~~~sh
git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md > <OS-temp>/baseline-DECISIONS.md
~~~

Measured result:

~~~text
object_bytes=76314
object_sha256=b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e
utf8_strict_decode=PASS
final_byte=0x0a
crlf_count=0
bare_cr_count=0
~~~

The baseline object therefore matches the required length and digest exactly. The ephemeral baseline file remains available for the authorized comparison steps and is not a repository output.

## 4. Snapshot creation

The snapshot was created with exactly this raw-byte redirect, using the full resolved baseline SHA:

~~~sh
git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md > Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md
~~~

The command's immediate read-back measured 76314 bytes, SHA-256 b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e, first byte 0x23, and final byte 0x0a.

## 5. Verification proofs

All four required proofs were run against the snapshot after creation. The ephemeral baseline path below is the exact file created from the full Git object before any repository snapshot write.

~~~text
$ wc -c Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md
   76314 Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md
$ shasum -a 256 Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md
b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e  Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md
$ cmp /var/folders/xg/4dvh83z944d7xxvff879ywgr0000gn/T/tmp.m7fmXS5ojR/baseline-DECISIONS.md Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md
cmp_exit=0
$ git diff --no-index /var/folders/xg/4dvh83z944d7xxvff879ywgr0000gn/T/tmp.m7fmXS5ojR/baseline-DECISIONS.md Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md
git_diff_no_index_exit=0
~~~

Proof 1 (length), proof 2 (SHA-256), proof 3 (cmp), and proof 4 (git diff --no-index) all passed. Both exact-comparison commands emitted no difference output.

## 6. Unchanged surfaces

The required unchanged-surface remeasurements and comparison were:

~~~text
$ wc -c Archive/DECISIONS-ARCHIVE-2026-07-14.md
   37094 Archive/DECISIONS-ARCHIVE-2026-07-14.md
$ shasum -a 256 Archive/DECISIONS-ARCHIVE-2026-07-14.md
d311813aeca181da908ea33907fdb919385b2c8171afad0003c3389b40e067a7  Archive/DECISIONS-ARCHIVE-2026-07-14.md
$ wc -c lib/decisions-format.ts scripts/tests/decisions-format.ts
   47075 lib/decisions-format.ts
   41335 scripts/tests/decisions-format.ts
   88410 total
$ shasum -a 256 lib/decisions-format.ts scripts/tests/decisions-format.ts
10e59335d02eb90163b465570c4e467323d3ff9d224585774e264846590fe1e4  lib/decisions-format.ts
251b55697b202845e805201c7f972c54bac2688e9156b6ba598e11454a75d15f  scripts/tests/decisions-format.ts
$ cmp /var/folders/xg/4dvh83z944d7xxvff879ywgr0000gn/T/tmp.m7fmXS5ojR/baseline-DECISIONS.md DECISIONS.md
cmp_decisions_exit=0
$ git diff --name-only -- DECISIONS.md
~~~

The archive hash and both Phase 1 source hashes are unchanged from Step 1. DECISIONS.md is byte-identical to the baseline object, and git diff reports no DECISIONS.md path. This phase did not edit or pass the snapshot to the parser.

## 7. Closing measurement

Measured from live local disk after all Phase 2 writes:

~~~text
$ git branch --show-current
codex/decisions-migration
$ git rev-parse HEAD
05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5
$ git diff --cached --name-only
$ git diff --name-only
lib/decisions-format.ts
scripts/tests/decisions-format.ts
$ git status --porcelain (authorized paths / tracked changes)
 M lib/decisions-format.ts
 M scripts/tests/decisions-format.ts
?? Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-2-PRESERVATION-SNAPSHOT-REPORT-2026-08-08.md
~~~

The two modified tracked source paths are the unchanged Phase 1 outputs and were not touched. The snapshot and this report are the only Phase 2 repository paths created. Nothing is staged, committed, pushed, moved, renamed, deleted, or written outside the frozen allowlist.

## 8. Overall disposition

**PASS** — the full baseline Git object was copied byte-for-byte into the authorized preservation snapshot, all four proofs passed, and all protected surfaces remained unchanged.
