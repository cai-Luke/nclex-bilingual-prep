# Campaign 16 R4 — §H.3.5 producer-independent census confirmation

**Verdict: CONFIRMED**

- **Reviewer seat:** Claude Code / Claude Opus 5 — the external R4 checker named in R4 §H.3.5 and in `census-reconciliation.json`.
- **Date:** 2026-09-11
- **Scope:** the bounded census confirmation only.
- **Access:** live local working tree, direct shell execution.

## 1. Independence

This seat is producer-independent of the executing seat (Codex / GPT-6 Astra). It did not generate the repair, author or adjudicate any of the 451 semantic judgments, build the comparison or accepted mapping, apply the patches or schema-floor bumps, or regenerate the census.

Every identity below was **recomputed locally from disk**, not copied from the executor's assertions. Where a claim rests on recorded evidence rather than my own execution, §7 says so explicitly.

## 2. Opening state

Branch `main`, HEAD `a639b5fe7f6816e68228d7dc13d068c0c0f69e91` — matching the expected HEAD. `0/0` against `origin/main`. Exactly the seven expected tracked modifications: the four repaired banks, `BANK-REVIEW-LEDGER.md`, `census.json`, `BANK-CENSUS.md`.

Executor receipt hash recorded at entry:
`14e73c829dbc94b9fe412ebceebd2650d2bc7a819c955f09e092bf576749dc56`

All four recorded pins recomputed and matching — producer freeze `151c1327…`, checker freeze `f5061780…`, frozen inventory `9f66750c…`, R4 work order `8cd476c2…`.

**329/329** declared commission artifacts and **7/7** final tracked files recomputed to the recorded values. Zero mismatches, zero missing.

### Opening identities anchored to git

The preserved opening copies under `evidence/` are **byte-identical to the committed HEAD blobs** for `census.json`, `BANK-CENSUS.md`, and all four opening banks. The opening baseline therefore rests on git, not merely on executor-held copies. All four opening bank hashes agree across three independent sources: the evidence copy, `git show HEAD:`, and `census-reconciliation.json`'s `openingSha256`.

## 3. Reviewed version and count movement

| Bank | Before | After | Session units | Accepted baseline | Stage | Exceptions |
|---|---|---|---:|---:|---:|---:|
| claude-canonical.json | 2.0 | 2.1 | 96 (unchanged) | 46 | 5 | 7 |
| gemini-canonical.json | 2.0 | 2.1 | 874 (unchanged) | 38 | 2 | 6 |
| gpt-canonical.json | 2.0 | 2.1 | 773 (unchanged) | 201 | 7 | 35 |
| hard-cases-canonical.json | 1.8 | 2.1 | 66 (unchanged) | 84 | 2 | 18 |

Grouping: **1.2 = 77; 2.1 = 1,809; 2.0 = 57.** Total **1,943**, unchanged.
Arithmetic checks: `96 + 874 + 773 + 66 = 1,809` and `77 + 1,809 + 57 = 1,943`.
Accounting reconciles: `451 = 369 baseline + 16 stage + 66 exceptions`.

This matches the expected movement in the handoff exactly. It was verified against live data, not adopted from it.

## 4. The seven required confirmations

**1 — Each bumped bank actually receives accepted typed-baseline rows, at the approved version.** CONFIRMED. All 385 accepted rows were located in the live banks at `caseStudy.questions` and compared against their accepted boundary: 385/385 match, zero mismatches. Per-bank typed-baseline counts in the live data are 46/38/201/84 — exactly the accepted baseline counts.

The bump is **compelled, not discretionary**: `src/schema.ts:1422` rejects a typed baseline below `meta.schemaVersion` 2.1. Each of the four banks therefore *must* be at 2.1 to hold the rows it received. A corpus-wide scan of all 13 banks found typed baselines in only those four; the other nine hold zero and retain their original floors, including `visual-canonical.json`, which correctly stayed at 2.0 while leaving the old 2.0 group.

**2 — Per-file census counts unchanged.** CONFIRMED. All 13 `perFile` entries are present; the four bumped entries differ **only** in `schemaVersion`, with `metaCount`, `questionsLength` and `mismatch` identical. Cross-checked against the bank files themselves: all 13 agree on version and both counts.

**3 — The only substantive movement is the four authorized transitions and their grouping.** CONFIRMED. An independent recursive leaf-level diff of the entire `census.json`, opening versus live, returns **exactly 11 leaf differences**: 2 generator provenance, 5 in `bySchemaVersion` grouping, 4 `perFile.schemaVersion`. Nothing else in the document differs.

**4 — Generator provenance changes are accurate and separate.** CONFIRMED. The prior `inputGitSha` `3286024b` is a real ancestor commit dated 2026-08-26, consistent with the 2026-08-28 `generatedAt`; the new value equals current HEAD exactly. `generatedAt` and `inputGitSha` are precisely the generator's `stripVolatile` set, so provenance is structurally separate from content by the generator's own definition.

**5 — The complete remaining JSON and Markdown content is unchanged.** CONFIRMED, on full content rather than headline totals. `scoredLeaves`, `visualArtifacts`, `idUniqueness`, `docsDrift` and the `sessionUnits` totals (1,943 / 1,798 / 145 / 731 / 2,674) are object-identical to opening. The Markdown diff is 16 lines — 8 pairs: 2 provenance, 4 per-file version cells, 2 grouping lines — with per-file counts untouched. `BANK-CENSUS.md` was additionally proven generator-derived: rendering the live `census.json` through `renderCensus` from `scripts/census.ts` reproduces the file **byte-for-byte** (`e428f652…`), so it was not hand-edited.

**6 — Read-only `npm run census:check` succeeds.** CONFIRMED. Exit 0, `census.json is up to date`. `npm run census` was **not** run. The command was first confirmed read-only by source inspection (`--check` routes to `checkDrift()`, which never writes), then proven non-mutating: `census.json`, `BANK-CENSUS.md` and all 13 banks hashed identically before and after.

This result is stronger than a formatting check — it means the on-disk census is exactly what the generator produces from the current live banks.

**7 — Evidence unchanged while reviewed.** CONFIRMED. Re-verification at exit: 329/329 artifacts and 7/7 tracked files unchanged; branch, HEAD and tracked status identical to entry.

## 5. Items identified, not altered

Present in the commission but absent from the executor manifest: `architect-conformance-review.md`, `claude-census-confirmation-handoff.md`, and two `tools/__pycache__/*.pyc` bytecode caches. The Markdown files are the legitimate post-executor review artifacts; the `.pyc` files are incidental interpreter output, not evidence mutation. No declared artifact is missing from disk.

One untracked file, `UX-0B-ACTIVE-SESSION-REPLACEMENT-PROTECTION-CODEX-SPEC-2026-09-11.md`, **appeared during this review session** and was absent at entry. It is an unrelated queued UX spec that references no bank, census, or commission artifact and is itself gated until Campaign 16 closes. It does not affect this confirmation. Reported rather than removed.

## 6. Preservation

No Git mutation of any kind — no commit, push, merge, checkout, stash, reset, or clean. Only read-only inspection plus the single authorized read-only `npm run census:check`. No bank, runtime, package script, census artifact, ledger, history, governance file, frozen manifest, comparison, accepted mapping, exception record, semantic freeze, or executor receipt was edited. No patch, bump, planning, or finalization tool was re-run. The only files created are the two receipts in this directory.

## 7. Acceptance limitations

- This confirms the **census transform only**. It certifies nothing about clinical correctness, bilingual quality, or complete answer-leakage closure.
- The 451 semantic judgments were not re-run and the 66 exceptions were not resolved — both explicitly out of scope.
- Executor preservation, comparison, patch and schema-floor tooling were **not** re-executed. Those results remain attributed to recorded evidence. The file identities, live-bank anchor verification, census content analysis and `census:check` result above are this seat's own observations.
- `census:check` compares substantive content only; the two provenance fields are excluded by `stripVolatile` and were verified separately.
- The full test suite, `npx tsc`, `npm run build` and the production `file://` smoke were not run here; the smoke gate was removed from this assignment by owner confirmation.
- **This receipt is not full R4 acceptance** and confers no authority to publish, commit, merge, or update `PROJECT-HISTORY.md`.

## 8. Result

The census movement matches the reviewed repair. The remaining R4 §H.3.5 obligation is discharged.
