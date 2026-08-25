# Independent Mutation-Scope Audit — `3c33c03a..e23962e7`

All commands run directly against the repair worktree (`$HOME/Desktop/shrimp-matrix-swap-repair-2026-08-25`) with no repository edits.

## File-level diff (`git diff --name-status 3c33c03a..e23962e7`)

```
A	audit/june13-matrix-swap-regression-2026-08-25/FORENSIC-REVIEW-MANIFEST.md
A	audit/june13-matrix-swap-regression-2026-08-25/forensic-review/00-opening-receipt.md
A	audit/june13-matrix-swap-regression-2026-08-25/forensic-review/01-independent-reconstruction.md
A	audit/june13-matrix-swap-regression-2026-08-25/forensic-review/02-git-and-repair-history.md
A	audit/june13-matrix-swap-regression-2026-08-25/forensic-review/03-audit-workflow-analysis.md
A	audit/june13-matrix-swap-regression-2026-08-25/forensic-review/04-post-reveal-comparison.md
A	audit/june13-matrix-swap-regression-2026-08-25/forensic-review/SEAL.md
A	audit/june13-matrix-swap-regression-2026-08-25/forensic-review/final-memo.md
A	audit/june13-matrix-swap-regression-2026-08-25/forensic-review/receipt.md
A	audit/june13-matrix-swap-regression-2026-08-25/no-op-target-review.md
A	audit/june13-matrix-swap-regression-2026-08-25/repair-preflight.jsonl
A	audit/june13-matrix-swap-regression-2026-08-25/repair-report.md
A	audit/june13-matrix-swap-regression-2026-08-25/verification.md
M	banks/gpt-canonical.json
A	scripts/patches/2026-08-25-june13-matrix-swap-regression-repair.ts
```

Only one bank-content file is modified: `banks/gpt-canonical.json`. Everything else is a new file, and every new file is either task-owned audit/report material under `audit/june13-matrix-swap-regression-2026-08-25/` or the one-off declarative patch script under `scripts/patches/`. Not opened during Phase A: the report/manifest/forensic-review contents themselves (per the anti-anchoring instruction) — only their existence and path were confirmed via `git diff --name-status`.

## `banks/gemini-canonical.json` and `banks/io-canonical.json`

```
$ git diff 3c33c03a..e23962e7 -- banks/gemini-canonical.json banks/io-canonical.json
(no output)
```

Byte-for-byte unchanged. Confirms the candidate did not touch either file — this is independent of, and in addition to, the semantic no-op-target review in `03-independent-no-op-review.md`.

## Census / history / governance files

```
$ git diff 3c33c03a..e23962e7 -- census.json BANK-CENSUS.md PROJECT-HISTORY.md DECISIONS.md BANK-REVIEW-LEDGER.md AGENTS.md
(no output)
```

Unchanged.

## `banks/gpt-canonical.json` diff shape

`git diff --stat` reports `80 +++++------` (40 insertions, 40 deletions) for this file. Every hunk in `git diff -- banks/gpt-canonical.json` touches only lines inside a `"columnIds": [...]` array nested under a `"correct"` entry — no hunk touches `"id"`, `"en"`, `"zh"`, `"rowId"`, `"columns"`, `"rows"`, `"rationale"`, `"glossary"`, `"testTakingStrategy"`, `"topic"`, `"category"`, `"difficulty"`, `"meta"`, or any sibling structural key. This was confirmed by reading the complete `git diff -- banks/gpt-canonical.json` output line by line, not by sampling.

There are exactly 8 hunks. Each hunk was independently mapped to its enclosing top-level or embedded question id by scanning backward from the hunk's line number in the candidate file for the nearest `"id": "gpt_..."` line:

| Hunk line (candidate) | Nearest enclosing question id |
|---|---|
| 42308 | `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q2` |
| 42878 | `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q1` |
| 43509 | `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q1` |
| 45790 | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q2` |
| 47762 | `gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_contact_diarrhea_09` |
| 47897 | `gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_stroke_rehab_10` |
| 49062 | `gpt_2026_06_13_case_delirium_uti_01_q1` |
| 49397 | `gpt_2026_06_13_case_delirium_uti_01_q4` |

This is exactly the set of 8 IDs authorized in §3 of the work order, in the same order — no more, no fewer, no substitution. No ninth question is touched at the JSON value level.

Each of the 8 changed leaves has exactly 5 rows (confirmed against the extracted row arrays for all three blobs — base, candidate, oracle — in `01-independent-eight-target-review.jsonl`), so 8 × 5 = 40 `columnIds` scalar changes, matching the diff's 40/40 insertion/deletion count exactly.

## Patch script inspection (`scripts/patches/2026-08-25-june13-matrix-swap-regression-repair.ts`)

Read in full. Findings:

- Imports `runPatch`, `setValue` from `../patch-raw` (i.e., `scripts/patch-raw.ts`), the existing declarative patch engine — not an ad hoc rewrite.
- Contains exactly 9 `setValue` ops (8 targets; `gpt_2026_06_13_case_delirium_uti_01` is patched twice, once for `_q1` and once for `_q4`, since both are embedded sub-questions of the same case wrapper — the wrapper `id` used for `findQuestion` is the same, and the `path` selector `{ id: "..._q1" }` / `{ id: "..._q4" }` disambiguates the embedded target). This does not add a ninth mutated top-level question; it is two field-path mutations inside one case wrapper's `caseStudy.questions` array, consistent with §3 items 7 and 8 both being embedded in `gpt_2026_06_13_case_delirium_uti_01`.
- Every op's `path` names an exact field path terminating at `"correct"` (top-level matrix items) or `["caseStudy", "questions", { id: "..." }, "correct"]` (embedded matrix items) — a stable-id selector, not a brittle array index, satisfying the P15 application note ("A declarative operation identifies the exact field path it mutates ... not a record").
- Every op's `before` value was independently checked against my own extraction of the base-commit mapping for that target (see `01-independent-eight-target-review.jsonl`'s `baseMapping` field for each target) — they match exactly.
- Every op's `after` value was independently checked against my own extraction of the oracle mapping (`oracleMapping` field) — they match exactly.
- Inspection of `scripts/patch-raw.ts`'s `setValue` handling (`applyOp`, `resolvePath`) confirms the engine performs a `deepEqual` precondition check against `op.before` before writing, and aborts the entire patch with nothing written if any op's precondition fails (`applyOp` throws synchronously; `runPatch`'s op loop calls `process.exit(1)` on the first failure, before any file write). This is genuine fail-closed behavior, not merely a declarative-looking wrapper around an unconditional write.
- `scripts/patch-raw.ts`'s scope guard (`checkScopeGuard`) refuses to write outside `banks/banks-raw/` unless both `--allow-canonical` and a non-empty `--reason` are supplied, and in that canonical mode further requires `--in === --out` (in-place correction only) — consistent with P15's "canonical files are read-only except through an explicit in-place mode." The canonical-mode banner (`printCanonicalBanner`) prints "LEDGER ENTRY REQUIRED" as an operator reminder at write time; it is advisory output, not a write-blocking runtime check (the write proceeds regardless), so a still-pending `BANK-REVIEW-LEDGER.md` entry after this patch runs is consistent with the tool's actual mechanics, not a violation of them.
- After applying all ops, `runPatch` recomputes `meta.count`, re-validates the patched object with `validateBankObject`, performs an atomic write-then-rename with a disk-round-trip re-validation, and aborts (no file left behind) on any validation failure. This is credible, not merely asserted, fail-closed behavior for the write path itself.

## Conclusion

Mutation scope is exactly: the 8 authorized `correct[].columnIds` field paths (40 scalar values total) inside `banks/gpt-canonical.json`, plus new task-owned audit/report/patch-script files. No stems, rows, columns, rationale, translations, topics, categories, difficulties, sources, metadata, or sibling leaves changed. No ninth learner-facing item changed. `banks/gemini-canonical.json` and `banks/io-canonical.json` are byte-identical to base. Census/history/governance files are unchanged. The patch is declarative, exact-before/exact-after, ID-path-scoped, and its fail-closed/retry behavior is verified from the engine source, not merely asserted.
