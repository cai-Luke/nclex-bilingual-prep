# Independent Command Verification

All commands run directly in the repair worktree (`$HOME/Desktop/shrimp-matrix-swap-repair-2026-08-25`) at candidate commit `e23962e7d81540421ab178e3e90d4dce77d21804` (confirmed as HEAD before and after this section). No repository edits were made; `dist/` build output is untracked and gitignored.

| Command | Exit | Result |
|---|---|---|
| `npm run validate-bank -- banks/*.json` | 0 | All 13 bundled banks OK (`gpt-canonical.json OK (760 questions)` and the other 12) |
| `npm run audit` | 0 | `GATE PASSED (warnings present)`. `[INSUFFICIENT] ? audit:integrity` — expected, no `banks/banks-raw/` directory exists (confirmed by `ls`, exit 1/"No such file or directory"), matching the runbook's documented troubleshooting entry for this exact condition. `audit:topic-license` PASS over 1,930 top-level records / 731 embedded parts / 2,516 scored leaves. `audit:non-mcq-bias:mechanical` PASS. `audit:non-mcq-bias:distributional` WARN, 1 pre-existing advisory (`visual-canonical` select_all `correct_count_distribution`, unrelated to the eight repaired matrix items). Exactly 451 `revealsAllStages` findings (`451 finding(s) across 13 bank file(s): 0 unresolved, 451 revealsAllStages (leak), 0 missingRequiredAnchor.`) |
| `npm run test:grading` | 0 | "grading tests passed" |
| `npm run test:schema-bank` | 0 | "bank schema tests passed" |
| `npm run test:audit-integrity` | 0 | "audit-integrity tests passed" |
| `npm run test:audit-ids` | 0 | "audit-ids tests passed" |
| `npm run test:presentation-normalization` | 0 | "presentation normalization tests passed" |
| `npm run test:case-completeness` | 0 | "case completeness tests passed" |
| `npm run test:audit-references` | 0 | "audit-references tests passed" |
| `npm run coverage-report` | 0 | 1,930 session units; 731 embedded-part inventory; matrix: 340; total visual artifacts: 199 |
| `npm run census:check` | 0 | "census.json is up to date." — no drift |
| `npx tsc -b --pretty false` | 0 | Clean, no diagnostics |
| `npm run build` | 0 | "✓ 1654 modules transformed"; file-compatible build generated; `validate:build-info` — "build identity validated"; only the pre-existing chunk-size-over-500kB advisory printed (non-blocking, unrelated to bank content) |

## Recomputed inventory vs. Codex's orientation claims

Recomputed independently rather than trusted:

| Metric | Codex orientation claim | Independently recomputed |
|---|---|---|
| Bundled banks | 13 | 13 (validate-bank output) |
| Session units | 1,930 | 1,930 (coverage-report) |
| Scored leaves | 2,516 | 2,516 (audit `audit:topic-license` line) |
| Matrix leaves | 340 | 340 (coverage-report) |
| Visual artifacts | 199 | 199 (coverage-report) |
| Census drift | none | none (`census:check`: "census.json is up to date") |

All six recomputed values match the claimed orientation values exactly.

## Warning classification

- `[INSUFFICIENT] audit:integrity` — pre-existing/expected (no raw draft directory; documented runbook behavior, not related to this candidate).
- 451 `revealsAllStages` advisories — pre-existing (unrelated case-study stage-anchor items across many producer lanes; none of the 8 repaired IDs appear in the "Related IDs" list printed by the audit for this finding class, and this finding class is about `stageId`/`answerableAfterStageId` anchors, a field the candidate's patch never touches).
- 1 `audit:non-mcq-bias:distributional` warning — pre-existing, scoped to `visual-canonical` select_all items, unrelated to the GPT matrix leaves this candidate touches.
- Vite chunk-size warning — pre-existing, generic bundle-size advisory unrelated to bank content.

No new candidate-caused material failure was found. No warning traces to the candidate's mutation surface (the 8 authorized `correct[].columnIds` field paths).

## Final worktree cleanliness

```
$ git status
On branch codex/june13-matrix-swap-regression-repair-2026-08-25
nothing to commit, working tree clean

$ git diff --stat
(empty)

$ git rev-parse HEAD
e23962e7d81540421ab178e3e90d4dce77d21804
```

The candidate worktree's tracked diff remains clean at the reviewed commit after running the full command battery.

## Primary repository final state

```
$ git status   (in /Users/holemini/Desktop/Project Shrimp)
On branch main
Your branch is ahead of 'origin/main' by 7 commits.
Untracked files:
  audit/standalone-bowtie-answerability-census-2026-08-23/

$ git rev-parse HEAD
3c33c03afc6bb06ab1f98cc772b13cae274f55a8
```

Unchanged from the opening receipt's recorded state. No edit was made to the primary repository during this acceptance task.
