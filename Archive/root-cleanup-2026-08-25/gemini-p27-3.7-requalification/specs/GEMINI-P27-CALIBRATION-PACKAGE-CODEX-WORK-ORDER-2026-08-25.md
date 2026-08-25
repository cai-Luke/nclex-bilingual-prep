# Project Shrimp — Gemini P27 Calibration Input Package — Codex Work Order

**Date:** 2026-08-25
**Seat:** Codex
**Role:** deterministic historical-input recovery and packaging only; no clinical judgment and no requalification verdict
**Live repo:** `/Users/holemini/Desktop/Project Shrimp`
**Output:** external staging outside the repo

## 0. Purpose

Prepare the exact blind input package needed to resume the Gemini 3.7 Flash P27 requalification defined by:

`scratch/GEMINI-P27-CONTENT-PREFLIGHT-REQUALIFICATION-WORK-ORDER-2026-08-24.md`

Gemini Run 1 is already preserved and classified `PROVISIONAL — INVALID BASELINE`. Do not modify, delete, rewrite, or use its judgments as package inputs.

This is a controller-side packaging task only. Do not perform any pair adjudication, Campaign 14 feasibility judgment, or requalification scoring.

## 1. Read first

Read current:

- `AGENTS.md`
- `DECISIONS.md` P2, P5, P27, P31
- `scratch/GEMINI-P27-CONTENT-PREFLIGHT-REQUALIFICATION-WORK-ORDER-2026-08-24.md`

For Module A historical scope read:

- `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md`
- `Archive/root-cleanup-2026-06-26/PHASE-B-COHERENCE-HANDOFF-2026-06-25.md`

The controller designates commit:

`59664ca`

(`2026-06-25 11:12:30 -0400`, `Close Phase A adversarial audit`)

as the candidate historical bank snapshot for Module A, subject to the proof gate below.

## 2. Strict contamination boundary

### Prohibited answer artifacts — DO NOT OPEN, SEARCH CONTENTS, SUMMARIZE, OR COPY

Do not inspect any historical answer/adjudication artifact, including but not limited to:

- `Archive/root-cleanup-2026-06-26/CLAUDE-ARCHITECT-GEMINI-AUDIT-QUALITY-HANDOFF-2026-06-26.md`
- `Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-25.md`
- historical `gemini.findings.md`
- historical `gemini.manifest.jsonl`
- merged Phase B findings/manifests or adjudication reports
- `CONTENT-GENERATION-CAMPAIGN-14-CODEX-PREFLIGHT-REPORT-2026-08-13.md`
- historical Campaign 14 cleared manifests, blocked rosters, packet plans, producer packets, promotion receipts, or ledger outcomes that reveal the preflight result

Filename/path existence checks are permitted only where needed to avoid copying prohibited files. Do not read their contents.

If prohibited substantive content is accidentally surfaced, stop and report `PACKAGE_CONTAMINATED` with the path and exposure.

## 3. Repository safety

- Do not modify canonical banks, governance, ledger, census, history, schema, code, or existing Gemini Run 1 artifacts.
- Do not write package outputs under `Project Shrimp`.
- Use detached worktrees, `git show`, temporary directories, or read-only extraction as needed.
- Preserve unrelated working-tree/untracked state.
- Do not commit anything.

External final package root:

`/Users/holemini/Desktop/gemini-p27-calibration-input-2026-08-25/`

Temporary working directories must also be outside the live repo.

## 4. Module A — prove and package the June 25 historical corpus

### 4.1 Snapshot proof gate

Before extracting item bytes, prove whether `59664ca` is a valid historical bank snapshot for the 46-pair Gemini Phase B commission.

At minimum:

1. Verify commit identity and timestamp.
2. Verify that the authoritative Phase B dispatch/spec was created/executed after this snapshot.
3. Verify there was no change to canonical bank content between `59664ca` and the Phase B closeout state that could have altered any of the 46 scoped records before Gemini reviewed them. Use Git history/diff over bank paths; do not infer from dates alone.
4. Specifically compare relevant canonical bank paths between `59664ca` and the closeout-era commit(s). If any scoped item or parent case differs, stop Module A and report the exact IDs/paths and candidate snapshots; do not choose a replacement silently.

Write the proof to:

`module-a/snapshot-proof.md`

If the proof fails, terminal Module A state is `MODULE_A_BASELINE_UNRESOLVED`.

### 4.2 Scope extraction

Only after the proof gate passes:

- Use the exact 46-pair scope defined by `GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md`.
- Extract each scoped item from the `59664ca` tree, not from current banks.
- For an embedded case-study leaf, also extract sufficient parent-case context from the same historical tree: parent stem/common fields, exhibits, stages, and any other case context needed to interpret the leaf as it existed at that snapshot.
- Preserve item content byte-faithfully at the JSON value level. Do not normalize, rewrite, translate, “clean up,” or update any clinical language.
- Do not add historical verdicts or findings.

Required Module A package:

```text
module-a/
  snapshot-proof.md
  GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md
  pair-scope.json
  pairs.jsonl
  package-verification.md
```

`pair-scope.json` must contain only pair numbering and the two IDs from the historical spec.

`pairs.jsonl` must contain exactly 46 rows. Each row should contain:

- `pairNumber`
- `itemAId`
- `itemBId`
- `itemA` — exact historical question object
- `itemB` — exact historical question object
- `itemAParentContext` — `null` for standalone; otherwise historical parent context sufficient to interpret the embedded leaf
- `itemBParentContext` — same rule
- `sourceBankA`
- `sourceBankB`
- `snapshotCommit`: full SHA for `59664ca`

Do not include any prior disposition, reviewer result, contradiction label, reconciliation, or answer-report prose.

### 4.3 Module A verification

Mechanically verify and record:

- 46 rows exactly
- pair numbers unique and complete 1–46
- ID pairs exactly match the historical spec
- every extracted ID exists at the designated snapshot
- embedded leaves carry their historical parent context
- no current-bank bytes were substituted
- no prohibited answer artifact content entered the package
- SHA-256 for every Module A final file

## 5. Module B — recover and package the Campaign 14 baseline

Historical repository snapshot is fixed by the requalification work order:

`b5d0027d0aab6e2f4d82eeabb6d3da64cc75c5b4`

Expected canonical scored leaves: `2477`.

Required external Batch 13 supplement:

`gpt-format13-scored-recovery-2026-07-28.json`

Expected SHA-256:

`b0822dee4066bdcc3c70df1ee4ef0dabf290af83566c77544ba722d475eec74a`

Reserved unauthored constructs:

- `gpt_format13_mosteller_bsa_fib`
- `gpt_format13_c_to_f_fib`

### 5.1 Supplement recovery search

The file is absent from the current working tree and ordinary Desktop backup search. Perform a deterministic local recovery search, without reading Campaign 14 answer/report artifacts.

Search, as appropriate:

- `git log --all -- <exact raw-file path>`
- all local branches and refs
- reflogs
- stashes
- unreachable/dangling Git objects where safely attributable
- prior worktrees
- local Project Shrimp backup/archive directories
- known generation-staging directories on the Mac mini

Do not use a later canonical reconstruction merely because the ten promoted questions appear in `gpt-canonical.json`; the required input is the exact historical raw supplement and must match the expected SHA-256 byte-for-byte.

If one or more candidates are found:

1. recover them outside the live repo;
2. hash each candidate before reading it substantively;
3. accept only a candidate whose SHA-256 exactly equals the expected hash;
4. record recovery provenance (ref/commit/blob/path) without exposing any held-out Campaign 14 preflight outcome.

If no exact-hash candidate is locally recoverable, stop Module B with `MODULE_B_SUPPLEMENT_NOT_RECOVERED`. Do not synthesize or reconstruct it.

### 5.2 Campaign 14 work-order input

The exact historical Campaign 14 preflight work order may not be present in the current repo. Search only by exact filename/path and safe metadata; do not open the prohibited historical report.

Required filename:

`CONTENT-GENERATION-CAMPAIGN-14-CODEX-PREFLIGHT-WORK-ORDER-2026-08-13.md`

If the exact work order is not locally recoverable, record `CAMPAIGN14_WORK_ORDER_MISSING` in the receipt. Do not substitute the report.

### 5.3 Historical repository snapshot

Create a read-only/detached historical export or worktree outside the live repo for `b5d0027d...` sufficient for Gemini to execute the old preflight. Do not include later history or current banks as substitutes.

Verify:

- commit SHA
- canonical scored-leaf count = 2477
- expected canonical bank population needed by the work order

Required Module B package, if all prerequisites are recoverable:

```text
module-b/
  historical-repo/          # detached/exported b5d0027... inputs needed by the old preflight
  CONTENT-GENERATION-CAMPAIGN-14-CODEX-PREFLIGHT-WORK-ORDER-2026-08-13.md
  gpt-format13-scored-recovery-2026-07-28.json
  reservations.json
  recovery-receipt.md
  package-verification.md
```

`reservations.json` should contain only the two named reserved constructs above and no preflight outcome.

Do not include any Campaign 14 report, cleared/blocked manifest, packet plan, later generated packet, promotion receipt, or ledger outcome.

## 6. Final package audit

Before returning success:

1. Recursively list every packaged file.
2. Explicitly compare the list against the prohibited-artifact names/patterns.
3. Hash every file in the package.
4. Verify no symlink resolves back into the live repository or into a prohibited artifact.
5. Verify no file under the package contains a copied historical result/report merely because it was adjacent to an allowed input.
6. Record whether Module A and Module B are independently complete.

Write:

`/Users/holemini/Desktop/gemini-p27-calibration-input-2026-08-25/PACKAGE-RECEIPT.md`

The receipt must include:

- full Module A snapshot SHA and proof result
- Module A row/count verification
- Module B historical snapshot SHA/count verification
- Batch 13 supplement recovery provenance and SHA, or explicit not-recovered state
- Campaign 14 work-order recovery state
- complete package manifest with SHA-256 hashes
- contamination status
- explicit statement: `No clinical judgment, Campaign 14 preflight judgment, or P27 requalification verdict was performed by this packaging seat.`

## 7. Terminal status

Return exactly one of:

- `GEMINI_P27_CALIBRATION_PACKAGE_COMPLETE`
- `GEMINI_P27_CALIBRATION_PACKAGE_PARTIAL`
- `MODULE_A_BASELINE_UNRESOLVED`
- `PACKAGE_CONTAMINATED`

Use `COMPLETE` only if both Module A and Module B are fully packaged and verified. Use `PARTIAL` if Module A is complete but an exact Module B prerequisite could not be recovered locally.
