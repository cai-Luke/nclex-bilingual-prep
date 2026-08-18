# DECISIONS Migration — Stage 2a Deterministic Prep Handoff

**Date:** 2026-07-29  
**Seat:** Codex / shell-capable mechanical producer  
**Status:** Untracked preparation only. Stage 2b is not authorized.

This handoff is closed-world. Read the named repository files; do not rely on chat history.

## Goal

Remove deterministic work from the architect seat before it authors the exact Stage 2a manifest. Produce verified source data and a non-authoritative scaffold. Do not write constitutional prose, select optional fields, or begin migration implementation.

## Repository state to verify first

- Repository: `Project Shrimp`
- Branch: `codex/decisions-migration`
- Expected HEAD: `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`
- Full `MIGRATION_BASELINE`: `d499cc1d0916e03830489ec9cd0324cd1a203a73`
- Tracked state must be clean.
- Existing untracked evidence files:
  - `DECISIONS-MIGRATION-STAGE-2A-HANDOFF-2026-07-29.md`
  - `DECISIONS-MIGRATION-STAGE-2A-CANDIDATE-REGIONS-2026-07-29.md`

Preserve those files. Do not stage, commit, push, or create an upstream.

## Read order

1. `AGENTS.md`
2. `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md`
3. `DECISIONS-ARCHIVE-PRESERVATION-AND-WRAPPER-ADDRESSING-AMENDMENT-2026-07-29.md`
4. The two existing untracked Stage 2a evidence files
5. `audit/decisions-cleanup-2026-07-24/inventory.md`
6. `audit/decisions-cleanup-2026-07-24/migration-table.md`
7. `audit/decisions-cleanup-2026-07-24/outline-before-after.md`
8. `DECISIONS-TAXONOMY-2026-07-24.md`
9. `DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md`
10. `DECISIONS-FORMAT-FIXTURES-2026-07-28.md`

The frozen phase-1 artifacts are read-only.

## Required untracked outputs

Create exactly these four evidence/preparation files and keep them untracked:

1. `DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md`
2. `DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md`
3. `DECISIONS-MIGRATION-STAGE-2A-MANIFEST-SCAFFOLD-2026-07-29.md`
4. `DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-RECEIPT-2026-07-29.md`

Use a temporary script outside the repository, or remove it before finishing. No additional repository file should remain.

## A. Verify and hash the 13 archive bodies

Materialize the baseline blob once from:

```bash
git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md
```

Before slicing, require:

- byte length `76314`;
- SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`;
- valid UTF-8;
- trailing newline present.

Stop on any mismatch.

Use these zero-based half-open spans:

| Record | Start | End | Bytes |
|---|---:|---:|---:|
| E032 | 41665 | 42597 | 932 |
| E036 | 50844 | 51342 | 498 |
| E039b | 53661 | 54291 | 630 |
| E040 | 54292 | 54790 | 498 |
| E041 | 54791 | 55582 | 791 |
| E042 | 55583 | 56120 | 537 |
| E043b | 56121 | 56543 | 422 |
| E048 | 62297 | 62907 | 610 |
| E050 | 64005 | 64356 | 351 |
| E051 | 64357 | 64837 | 480 |
| E052 | 64838 | 66593 | 1755 |
| E075 | 75189 | 75483 | 294 |
| E076 | 75484 | 76314 | 830 |

For every body report:

- `[start,end)`;
- byte length;
- SHA-256;
- whether the final byte is `0x0a`;
- exact first and last 80 decoded characters.

Assert:

- all spans are in bounds and non-overlapping;
- total sliced bytes are `8628`;
- E036 and E043b do not end in newline;
- every other body does;
- E076 ends at EOF.

## B. Build the 65-record live source packet

Derive the target-live population from the frozen migration table plus Amendment 4. Produce one record in manifest order for each of the 65 live target blocks.

For each record include only mechanically recoverable review material:

- source entry ID or IDs;
- frozen destination;
- target section from the ratified outline;
- permanent ID when already fixed;
- frozen kind, status, force-after, and execution state;
- legacy line anchor or anchors;
- verbatim baseline source text needed to review the rule;
- any shared-paragraph context needed to avoid losing adjacent material;
- fixed merge contribution where already ratified.

Special accounting must be explicit:

- E037 rule 1 contributes to E039a/P8.
- E037 rule 2 contributes to both E002/P2 and E006/P5.
- The live tail excluded from E036 remains accounted for through E043a and the E037 targets.
- E043a must carry both the `opus*` deterministic-routing rule and the `claude_*` exclusion excluded from E043b.

Do not paraphrase or compress source prose. Do not select headings, statements, dates, `Evidence`, `Owner`, optional-field omissions, attachment structure, or index summaries. Mark those as architect work.

If an exact source-entry boundary is not mechanically established by the frozen artifacts, include the containing context and mark the boundary `ARCHITECT REVIEW`; do not guess.

## C. Build a non-authoritative manifest scaffold

The scaffold is preparation material only. It is **not** the commission output `audit/decisions-migration-2026-07-29/target-text-manifest.md`, and it must state that prominently.

Prepopulate only fixed or mechanically derived information:

- full baseline identity and verified source metadata;
- expected `65 live / 13 wrappers / 1 E053 structural / 1 E037 merge = 80` reconciliation;
- `37 P / 6 R / 19 I / 3 T` live totals;
- one stub for every live block with source IDs and frozen classification;
- one stub for every archive wrapper with addressing mode, retirement disposition, verified span, byte length, and SHA-256;
- E053 as the structural §8 row;
- E037 as the sole `MERGE_INTO` row;
- the six fixed retired-register rows;
- explicit placeholders for every architect-authored byte or choice.

Use a conspicuous token such as `ARCHITECT_REQUIRED` for:

- exact headings and statements;
- core/attachment choice and ordinal;
- exact field lines;
- dates not already mechanically fixed;
- `Authorized` / `Not authorized`;
- `Evidence` / `Owner` path choice;
- optional-field omission decisions;
- entry-index and archive-index wording;
- archive labels and wrapper field values;
- boundary rationales;
- structural prose.

Do not infer or propose candidate wording.

## D. Write the deterministic-prep receipt

Record:

- branch, HEAD, upstream state, and full baseline SHA;
- whole baseline length/hash/encoding/newline result;
- SHA-256 and byte length of each of the three substantive output files;
- 13/13 span verification and `8628`-byte reconciliation;
- 65-record live source-packet count and kind totals;
- scaffold accounting `65/13/1/1 = 80`;
- any `ARCHITECT REVIEW` boundary markers;
- final repository status.

## Hard stops and prohibitions

Stop and report rather than continuing if:

- branch, HEAD, baseline blob, or tracked cleanliness differs;
- the source population does not reconcile to 80;
- the live packet does not reconcile to 65 and `37/6/19/3`;
- any archive span or whole-file check fails;
- completing a field would require semantic judgment;
- any governed or frozen file changes.

Do not modify:

- `DECISIONS.md`;
- any file under `audit/decisions-cleanup-2026-07-24/`;
- parser, tests, package files, workflow files, or reconciliation scripts;
- either pre-migration reference graph;
- any archive file.

Do not begin Stage 2b. Do not create the authoritative manifest. Do not commit or push.

## Final response

Return a concise summary with:

- pass/fail for each section A–D;
- the four output paths and SHA-256 values;
- any architect-review markers;
- branch/HEAD/status;
- confirmation that no tracked file changed.
