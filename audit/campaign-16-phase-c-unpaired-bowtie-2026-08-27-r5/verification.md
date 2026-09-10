# Campaign 16 Phase C — Revision 5 verification

All commands below ran from `/Users/holemini/Desktop/Project Shrimp`.

| Gate | Exact command | Emitted status | Exit |
|---|---|---|---:|
| Launch digest | `sha256sum scratch/CAMPAIGN-16-PHASE-C-UNPAIRED-BOWTIE-ANSWERABILITY-WORK-ORDER-2026-08-27.md` | `74fb97e70ca5820a4e95acc62e2b0f3f54790d0eea766d2be58e8a427f924248` exact | 0 |
| §§3.2, 4.1–4.6, manifest, leakage, repeatability | `npx tsx audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/run.ts preflight` | PASS | 0 |
| Focused harness tests | `npx tsx audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/test.ts` | PASS | 0 |
| TypeScript floor | `npx tsc -b --pretty false` | PASS | 0 |
| Diff whitespace | `git diff --check` | PASS | 0 |
| Four-row pilot | `npx tsx audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/run.ts pilot-gate` | PASS | 0 |
| Pre-scale-up snapshot | `npx tsx audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/run.ts scaleup-recheck` | PASS 13/13 | 0 |
| Blind semantic completion | `npx tsx audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/run.ts blind-complete` | PASS: 19 isolated contexts / 38 sealed turns | 0 |
| Producer closeout | `npx tsx audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/run.ts finalize-producer` | PASS | 0 |

## Gate accounting

- §3.2: 13/13 raw working-tree bank-byte identities matched; GPT matched the literal Phase-B closing digest, 12 non-GPT banks matched Phase A.
- §4.1: 50 suffix / 31 paired (30 exact, 1 ordinal) / 19 unpaired; zero additions and removals versus Phase A.
- §4.2: 19/19 unpaired payload hashes matched under `sha256(stableJson(q, 0))` with recursively sorted keys and trailing newline.
- §4.3: both live `_r2` IDs were present once and absent from the suffix roster; both historical pre-repair IDs were absent as live IDs.
- §4.4: 19/19 fixed 3/4/4 token shape and 1/2/2 key cardinality.
- §4.5: zero exact, ordinal-like, or substring sibling-case ID hits.
- §4.6: 31/31 paired payload hashes matched their frozen Aug-23 adjudication rows; combined accounting is therefore authorized.
- §6: the expected dirty GPT bank was accepted only through the named byte identity; all reads came from the working-tree filesystem. No `git show HEAD:<bank>` input was used.
- §7: 19 unique Sol/high context IDs, exactly two sequential stages each, no context shared across candidates, and 38 immutable semantic seals.

## Leakage, ordering, and provenance proof

- Stage-1 packets contain only instruction and English stem; Stage-2 packets contain only instruction, English stem/prompts, and opaque token pools.
- Exact real ID, surrogate ID, token ID, key, rationale, and companion-field leakage checks passed.
- Every Stage-1 seal predates the corresponding Stage-2 packet use; every Stage-2 seal predates Phase E; every Phase-E seal predates its Phase-F packet.
- All 19 token-premise tables contain exactly 11 unique rows.
- Deterministic control-artifact regeneration was byte-identical.
- Provenance inspection was bounded to each candidate's own rationale/byChoice, strategy, glossary, Chinese counterpart, and explicitly linked historical sources; no corpus-wide semantic search ran.

## Charter traps

- Trap 1: handled with Node filesystem/JSON parsing, not MCP file search, for every bank presence/absence claim.
- Trap 2: N/A — no census generation or checking was run.
- Trap 3: N/A — no census generation or checking was run.
- Trap 4: N/A — no stage-reference audit was run.
- Trap 5: handled — only pure `derivePopulation`, `stableJson`, and `sha256` helpers were imported; prohibited frozen entrypoints were never invoked.
- Trap 6: handled — all live bank reads used working-tree filesystem bytes; HEAD predates Phase B publication.

## Scope and preservation

- No bank, schema, grading, runtime, census, ledger/governance/status, `DECISIONS.md`, or unrelated dirty path was changed.
- Failed Revision-4 evidence tree: 8/8 files byte-identical.
- No staging, commit, push, stash, restore, clean, repair, retirement, promotion, authoring, or Phase D work occurred.
- Calibration checklist requirement: inapplicable under F1 = OMIT; no calibration directory or placeholder was created.
