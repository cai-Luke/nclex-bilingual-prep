# Stage 2b Phase 5 — target reconciliation checker receipt

**Date:** 2026-08-11  
**Seat:** Codex / implementation producer  
**Phase:** Commission §5.7 only

## Opening measurement — Step 1

The authorized work order was confirmed before execution at `33073` bytes / SHA-256
`75cc6db647afd6f8e6e0950ac885ba5c7b225489bb73b03236d81f3eca66ceac`.

- Branch: `codex/decisions-migration` — matches §3.
- HEAD: `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` — matches §3.
- Staged paths: none — matches §3.
- Modified tracked paths: exactly `DECISIONS.md`, `lib/decisions-format.ts`, and
  `scripts/tests/decisions-format.ts` — matches §3.
- The pre-existing untracked migration working set contained 71 paths/status entries; it was accepted as
  expected scope under §3. The Phase 5 checker and receipt did not exist at opening.
- Resolved `MIGRATION_BASELINE`: `d499cc1d0916e03830489ec9cd0324cd1a203a73`.
- `git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md`: `76314` bytes — matches §3.

| input | bytes | SHA-256 | §3 comparison |
|---|---:|---|---|
| `DECISIONS.md` | 56964 | `3dc5dbc0c6acbfe4f74fa353b80d53c7feeec4f5ada0a42d7b9773f26c26f4a8` | match |
| `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` | 76314 | `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | match; snapshot equals baseline object identity |
| `Archive/DECISIONS-ARCHIVE-2026-08-18.md` | 13997 | `e75e979ea121fa1a697861f8de4a4527f07ef2d8b7ed1f4d299bf504163e873c` | match |
| `audit/decisions-migration-2026-07-29/target-text-manifest.md` | 332579 | `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` | match |
| `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-STRUCTURAL-SURFACES-2026-08-08.md` | 24202 | `4cb16995cf8810bcf3ee65ffb07dc32a14a4fb5b0c4adc8ba5bbb2a2a535e9f4` | match |
| `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-ASSEMBLY-JOINS-2026-08-08.md` | 26963 | `9a1a3a898bf847d8dbe760c7aba702f3a3c3c3381c760bba989ffa5b8542944e` | match |
| `DECISIONS-ARCHIVE-PRESERVATION-AND-WRAPPER-ADDRESSING-AMENDMENT-2026-07-29.md` | 22665 | `5d70d7f61ef1243a70ea59b8de0aee7b25dada45672ee93e203e808dfff14827` | byte length match; §3 pins no digest |
| `scripts/decisions-migration-reconcile.ts` | 20631 | `be8f258b6d0145b91a5e4605f920c84e668a0396742b3fb88773c0bcbb5f8420` | byte length match; read in full and left frozen |
| `package.json` | 8443 | `3b16c67a35fd7be226a8bb9f2bba4b016fddc8ea61a6e78200fcab53544d80ca` | match; old command present and target command absent |
| `audit/decisions-cleanup-2026-07-24/inventory.md` | 28554 | `cfae5a898c1520173d835af5d0e29b4c0bfd2b135a40fb4335de82b34da1333e` | byte length match |
| `audit/decisions-cleanup-2026-07-24/migration-table.md` | 16833 | `89a2812dc955a61e45723bf6c242e247f467df71c7daa301b4fde2fcae1a4535` | byte length match |
| `audit/decisions-cleanup-2026-07-24/outline-before-after.md` | 9878 | `3821323c711866e655fd25b044add86c33cdc859762a4aa6f62d522ff158440e` | byte length match |

Ratified Amendment 4 §6 was read directly. The located `lib/decisions-format.ts` exports selected for the
checker are `parseDecisionsDocument(text: string, source?: string): ParsedDecisionsDocument` and
`parseArchiveDocument(text: string, source?: string): ParsedArchiveDocument`.

## Checker design record — Step 2

The checker is `scripts/decisions-migration-target-reconcile.ts`. Its population nulls are literal
constants and are not read from any checked document:

- source accounting: 65 live rows + 13 wrapper rows + one structural `E053` row + one `E037`
  `MERGE_INTO` row = 80;
- section totals: 37 `P`, 6 `R`, 19 `I`, and 3 `T`;
- 13 archive wrappers and 13 archive-index lines;
- six retired-register rows: `P9`, `P12`, `P18`, and `P22` as `RETIRED`; `P13` and `P14` as
  `NEVER ASSIGNED`;
- allocation unions contiguous through `P31` and `R6`.

The test-only input-override interface is:

```text
tsx scripts/decisions-migration-target-reconcile.ts [--target <path>] [--archive <path>] [--snapshot <path>]
```

Only these three inputs can be redirected. With zero arguments, all three bind to the canonical repository
paths. The manifest, amendments, frozen phase-1 artifacts, and raw `git show
d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md` baseline always remain canonical.

Authority and assertion routing:

1. **Source-row accounting:** the independent null above, the frozen phase-1 inventory/migration/outline,
   the manifest's 65 live records and 13 wrapper records, and Amendment 4 §6's correction.
2. **Section totals and identifier allocation:** the independent section/register/allocation nulls against
   the parsed target.
3. **Wrapper preservation:** manifest M5.5's per-record byte spans, lengths, SHA-256 values, and separators
   against raw baseline `Buffer` slices and the corresponding parsed archive wrapper body by block key.
4. **Snapshot equality:** the snapshot bytes directly against the raw baseline Git object; no reported
   snapshot hash is used as its own oracle.
5. **No unaccounted source entry:** the independently constructed 80-ID population against the frozen
   artifacts and the four corrected target disposition classes.
6. **No duplicate destination accounting:** disjoint live/wrapper/`E053`/`E037` membership, including the
   ordered `E037` targets `E039a`, `E002`, `E006`.
7. **No target block absent from manifest:** manifest M4 items 7, 8, 9, and 11, compared exactly for every
   target→manifest identity match.
8. **No manifest block absent from target:** the same manifest-owned components, compared exactly for every
   manifest→target identity match.

Ratified Amendment 2 governs a separate positive check of its eight exact structural surfaces. Ratified
Amendment 4 §6 governs the positive `E053` correction check: historical 14-row archive classification,
exact live/wrapper agreement with the corrected frozen classifications, no `E053` wrapper or archive-index
line, the exact manifest M5.6 archive-index block, and corrected 13-wrapper/13-index-line accounting. Ratified
Amendment 3 governs the join-byte population, which is explicitly outside this checker's byte-verification
scope. The checker names the closed Phase 4 evidence that covers it: the 272-entry join ledger, independent
whole-document reconstruction, and pre/post-write `checkDecisionsFormat` runs accepted at Phase 4
closeout. No Phase 5 or §5.8 gate evidence is claimed.

## Package command — Step 3

Verbatim `git diff -- package.json`:

```diff
diff --git a/package.json b/package.json
index aa864b0..a69c3a6 100644
--- a/package.json
+++ b/package.json
@@ -106,6 +106,7 @@
     "survey:decisions-refs": "tsx scripts/decisions-reference-graph.ts",
     "graph:decisions-refs": "tsx scripts/decisions-reference-graph.ts",
     "reconcile:decisions-migration": "tsx scripts/decisions-migration-reconcile.ts",
+    "reconcile:decisions-migration-target": "tsx scripts/decisions-migration-target-reconcile.ts",
     "tts-queue": "tsx scripts/audio/build-tts-queue.ts"
   },
   "dependencies": {
```

This is exactly one added line and no other `package.json` change.

## Checker runs — Step 4

`npm run reconcile:decisions-migration` — exit `0`, full output verbatim:

```text
> nclex-bilingual-prep@0.1.0 reconcile:decisions-migration
> tsx scripts/decisions-migration-reconcile.ts

DECISIONS migration reconciliation passed.
inventory=80; independent=79; STAY=65; ARCHIVE=14; MERGE_INTO=1
sections: §4=37 (25 permanent numbers), §5=6, §6=19, §7=3, §8=14
```

`npm run reconcile:decisions-migration-target` — exit `0`, full output verbatim:

```text
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
```

## Negative controls — Step 5

Each control used a fresh scratch copy outside the repository through the explicit three-flag interface.
Every control exited `1`.

### Control 1 — delete one live target block

Mutation: removed target `P1#0`, leaving the entry-index row intact. Exact emitted failures:

```text
FAIL: Report 1: target live blocks: found 64, pinned 65
FAIL: Report 2: P blocks: found 36, pinned 37
FAIL: Report 2: 1 is in pinned P1–P31 but not P allocation union
FAIL: Report 7: live-block bijection cardinality differs: target 64, manifest 65
FAIL: Report 8: live-block bijection cardinality differs: target 64, manifest 65
FAIL: Report 8: P1#0: target block occurrences 0, target index-row occurrences 1
```

### Control 2 — identity-preserving live-text mutation

Mutation: changed one byte inside `P1#0`'s statement while retaining its heading, identity, line structure,
and field names. Reports 1–6 remained `PASS`; reports 7 and 8 failed. Exact emitted failures:

```text
FAIL: Report 7: P1#0: exact statement bytes differ from manifest
FAIL: Report 8: P1#0: exact statement bytes differ from manifest
```

### Control 3 — wrapper-body mutation

Mutation: changed one byte inside the `E040` / `P9#0` preserved body. Report 3 failed; all other numbered
reports remained `PASS`. Exact emitted failure:

```text
FAIL: Report 3: E040/P9#0: corresponding wrapper body does not preserve its pinned baseline span
```

### Control 4 — preservation-snapshot mutation

Mutation: changed the snapshot's first byte. Report 4 failed; all other numbered reports remained `PASS`.
Exact emitted failure:

```text
FAIL: Report 4: preservation snapshot differs from MIGRATION_BASELINE (snapshot 76314 bytes/b4d0693e03899f69ddbec1045d237048f7ef9bc9d24c19662b4b8e828c5564f1, baseline 76314 bytes/b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e)
```

### Control 5 — parser-neutral Amendment 2 transition mutation

Mutation: changed one byte in the target §4 transition prose while preserving line count and structure.
The Amendment 2 check failed; reports 7 and 8 explicitly remained `PASS`. Exact emitted failure:

```text
FAIL: Amendment 2 surfaces: §4 heading/transition: exact ratified payload occurs 0 times in target; expected 1
```

The scratch tree was removed after execution. Post-control measurements confirmed that no repository input
was mutated:

| protected input | bytes | SHA-256 after controls |
|---|---:|---|
| `DECISIONS.md` | 56964 | `3dc5dbc0c6acbfe4f74fa353b80d53c7feeec4f5ada0a42d7b9773f26c26f4a8` |
| `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` | 76314 | `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` |
| `Archive/DECISIONS-ARCHIVE-2026-08-18.md` | 13997 | `e75e979ea121fa1a697861f8de4a4527f07ef2d8b7ed1f4d299bf504163e873c` |
| `audit/decisions-migration-2026-07-29/target-text-manifest.md` | 332579 | `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` |
| Ratified Amendment 2 | 24202 | `4cb16995cf8810bcf3ee65ffb07dc32a14a4fb5b0c4adc8ba5bbb2a2a535e9f4` |
| Ratified Amendment 3 | 26963 | `9a1a3a898bf847d8dbe760c7aba702f3a3c3c3381c760bba989ffa5b8542944e` |
| Ratified Amendment 4 | 22665 | `5d70d7f61ef1243a70ea59b8de0aee7b25dada45672ee93e203e808dfff14827` |

Additional implementation verification: `npx tsc -b --pretty false` exited `0`; `git diff --check`
exited `0`.

## Closing measurement — Step 6

- Branch: `codex/decisions-migration` — unchanged.
- HEAD: `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` — unchanged; no commit was made.
- Staged paths: none.
- Modified tracked paths: exactly four — the three opening paths plus this phase's `package.json`.
- New Phase 5 untracked outputs: exactly
  `scripts/decisions-migration-target-reconcile.ts` and this report.
- Normalizing closing `git status --porcelain` by removing the one new `package.json` modification and the
  one separately visible checker path produced a byte-for-byte/path-for-path match to the opening status
  (`comm -3` count `0`). This report lives inside the already-untracked
  `audit/decisions-migration-2026-07-29/` directory and was separately confirmed present as the second new
  Phase 5 output. No pre-existing untracked path was removed.
- Protected-input byte lengths and hashes match the opening table exactly after the controls.
- No path outside the §4 write allowlist was written. Nothing was staged, committed, pushed, moved,
  renamed, or deleted in the repository.

## Overall disposition

`PASS` — all eight required target-reconciliation reports, both canonical checker runs, five mandatory
negative controls, protected-input remeasurements, and closing-scope checks passed with only the three
authorized repository paths written.
