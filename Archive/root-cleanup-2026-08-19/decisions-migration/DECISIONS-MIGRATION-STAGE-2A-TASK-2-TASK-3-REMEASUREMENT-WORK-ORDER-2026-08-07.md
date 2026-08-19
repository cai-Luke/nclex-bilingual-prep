# Stage 2a — Task 2 / Task 3 re-measurement against the repaired manifest — CODEX WORK ORDER

**Date:** 2026-08-07 · **Issuing seat:** Architect (Claude) · **Executing seat:** Codex · **Revision:** 1

**Class: deterministic re-measurement. No judgment, no repair, no assembly.** Codex proposes no wording, repairs nothing, and stages, commits, pushes, stashes, resets, checks out, and cleans nothing. This order does not ratify Stage 2a, authorize Stage 2b, or authorize any edit to `DECISIONS.md` or to the manifest.

---

## 0. Why this order exists — a correction to the recorded queue state

**Task 2 and Task 3 were not un-executed. They were executed on 2026-08-04 and have since gone stale.** The resume note and several work orders carry forward the phrase "the Task 2 rerun over the 43 records at `M4.2`–`M4.44`" as though the run were still owed. That wording is stale and is corrected here.

`DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-VERIFICATION-CODEX-WORK-ORDER-2026-08-04.md` revision 4 §§6.1–6.2 folded both obligations into the M6 repair verification. Codex executed them and returned results in `audit/decisions-migration-2026-07-29/M6-REPAIR-VERIFICATION-2026-08-04.md`:

- **Task 2:** complete 65-record run against the real exported `countStatementSentences`, boundary test read from source first, raw stdout retained. `TASK2_DISTRIBUTION_FULL=1=4 / 2=23 / 3=38`; `TASK2_DISTRIBUTION_M4_2_TO_44=2=10 / 3=33`; `TASK2_OUTSIDE_1_2_3=none`; `TASK2_FIRST_CHAR_BACKTICK=none`. The architect's provisional `1=5 / 2=24 / 3=36` was disproved and recorded as advisory 3.
- **Task 3:** 20 field instances across 19 distinct paths, `src/schema.ts` the only repeat; Population 1 = 18 paths, all `TRACKED`; Population 2 = 1 path, `EXEMPT`, reported per-contract and not pooled.

Both were therefore validly discharged **as against the manifest state of 2026-08-04**. Neither is discharged against the current `314811`-byte manifest, for two independent and separately verified reasons.

### 0.1 Task 2 staleness — statement bytes changed after the run

The four-finding repair sequence and the subsequent `M4.35` exclusivity repair landed **after** the 2026-08-04 run and changed item-8 statement bytes. `M4.3 / P2#0` restored E002's anti-author-intent condition; `M4.5 / P3#0` restored E004's Layer-A non-mutation safeguard; `M4.35 / P28#0` restored E033's generation-prompt-parameter population limb and then received the `draw` → `draw only` exclusivity correction. `M4.4 / P2#1` received an `Owner` replacement plus a bounded adjacent-whitespace correction.

A restored limb can add a sentence. The 2026-08-04 counts for those records were measured against bytes that no longer exist, and the one-to-three-sentence grammar is exactly the check a restoration could newly violate. **No seat may carry the 2026-08-04 counts forward for any record whose statement bytes moved.**

### 0.2 Task 3 staleness — the exempt path changed under the date rebind

The 2026-08-04/05 runs recorded the Population 2 exempt path as `Archive/DECISIONS-ARCHIVE-2026-08-11.md`, byte-equal to the then-pinned M0.1 normalized archive filename. `MIGRATION_DATE` was subsequently rebound by owner act to `2026-08-18`, re-rendering 63 date-dependent surfaces including `E038`'s `Evidence` at `M4.45` and the M0.1 pin. The live manifest now carries `Archive/DECISIONS-ARCHIVE-2026-08-18.md`. Task 3's Population 2 row is stale on its face, and its byte-equality proof was taken against a filename that is no longer the pin.

### 0.3 Scope decision — complete re-run, no carry-forward

A per-record carry-forward — proving byte-identity for the unchanged statements and re-measuring only the changed ones — was considered and **rejected**. It costs more to prove than the full run costs to execute, it requires pinning an intermediate manifest state that no `.frozen` snapshot captures, and the original Task 2 defect was adjudicated as invalidating the run in whole rather than as one wrong row. Re-run both tasks complete over all 65 records. Report the owed `M4.2`–`M4.44` subset separately, as before, so the historical accounting stays comparable.

---

## 1. Frozen identities

| item | value |
|---|---|
| Repository | `Project Shrimp` |
| Branch | `codex/decisions-migration` |
| Branch HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| `MIGRATION_BASELINE` | `d499cc1d0916e03830489ec9cd0324cd1a203a73` |
| Target file | `audit/decisions-migration-2026-07-29/target-text-manifest.md` |
| Manifest byte length / SHA-256 | `314811` / `e99335567d157a86f8f2b6f178b7222bf86ccfe15e5f827da5a03864c1d04b31` |
| `DECISIONS.md` byte length / SHA-256 | `76314` / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` |
| Owner-bound `MIGRATION_DATE` | `2026-08-18` |
| Normalized archive filename | `Archive/DECISIONS-ARCHIVE-2026-08-18.md` |

Measure the manifest and `DECISIONS.md` at opening and again at closeout. Any mismatch against this table is a **BLOCKER**; do not measure against an approximation and do not adjust anything to reach a pinned value. `DECISIONS.md` must remain byte-identical to `MIGRATION_BASELINE`. Report `git status --porcelain` before and after: only untracked Stage 2a paths, no staged changes, no modified tracked files, at both points.

### 1.1 This order's authorization identity

Not executable until a hashing-capable seat returns this file's byte length and SHA-256 and the architect acknowledges them. From that acknowledgment the order is immutable. Record this order's byte length and SHA-256 at the top of the deliverable, measured independently rather than transcribed from this section.

---

## 2. Task 2 — complete 65-record sentence-count re-measurement

**Before running anything,** read the source of the exported `countStatementSentences` in `lib/decisions-format.ts` and report, as a named line item: what its boundary test actually is, and whether the harness feeds it the exact item-8 statement bytes and nothing else. This check is not optional and is not discharged by the 2026-08-04 report having performed it — the script may have changed. A spec that asserts what a command will produce is not discharged until that assertion is checked against the script.

Then for each of the 65 records at `M4.2`–`M4.66`: extract exact item-8 statement bytes; run the real exported function; report record, block or name-addressed title, and count.

Report:

1. the full 65-record distribution;
2. the 43-record subset at `M4.2`–`M4.44` separately;
3. every record returning a count outside `{1,2,3}` — each is a **REQUIRED REPAIR** finding, reported and not repaired;
4. whether each statement's first character is a backtick, expected zero;
5. an explicit per-record comparison against the 2026-08-04 counts, naming every record whose count changed and every record whose count is unchanged. The 2026-08-04 baseline for comparison is `M6-REPAIR-VERIFICATION-2026-08-04.md`, distribution `1=4 / 2=23 / 3=38`.

**Item 5 is the point of this order.** A silent agreement with the old distribution is a real result and must be stated as one; a changed count at `M4.3`, `M4.5`, or `M4.35` is expected-plausible rather than surprising, and a changed count anywhere else is a finding worth naming explicitly.

Retain raw stdout.

---

## 3. Task 3 — complete governed field-path re-derivation

Derive from item 9 of all 65 records, independently of anything M6 or any prior receipt asserts.

For each distinct path report `git ls-files --error-unmatch` disposition against HEAD `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` as `TRACKED` or `UNTRACKED`.

**Report the nulls per contract, never pooled:**

- **Population 1 — tracked-path verification required.** Every path must return `TRACKED`. `UNTRACKED` here is a **BLOCKER**, not a path to reclassify as exempt.
- **Population 2 — exempt.** `E038`'s `Evidence` at `M4.45` names a Stage 2b output absent at the Stage 2a review commit, exempt by ratified sequencing exception under Amendment 1 Clause A. Report it `EXEMPT`, report whether its value is byte-equal to the normalized archive filename **currently** pinned at M0.1, and do not count it in Population 1 in either direction.

**The Clause A byte-equality check is re-performed against the current pin, not inherited.** The prior run proved equality against `Archive/DECISIONS-ARCHIVE-2026-08-11.md`; that filename is superseded. If the `E038` value and the M0.1 pin disagree, or if either still reads `2026-08-11`, that is a **BLOCKER** — the date rebind missed a surface.

Report the instance count, the distinct-path count, and any repeated path. Compare explicitly against the 2026-08-04 result of 20 instances / 19 distinct paths / `src/schema.ts` the only repeat, naming any difference.

---

## 4. Deliverable

One report at `audit/decisions-migration-2026-07-29/TASK-2-TASK-3-REMEASUREMENT-2026-08-07.md`. That single file is the only write authorized. Leave it untracked.

Order of contents: this order's independently measured byte length and SHA-256; §1 identity verification with measured values; both `git status --porcelain` snapshots; §2 under its own heading including the script-source line item and the per-record comparison; §3 under its own heading including the Clause A re-check; a findings table classed `BLOCKER` / `REQUIRED REPAIR` / `ADVISORY` with counts; and a closing statement of anything unmeasured, stated as unmeasured rather than as absent.

**A null or zero result discharges feasibility only, never correctness.**

---

## 5. Closeout and boundaries

Remeasure at closeout: this order's byte length and SHA-256, which must equal the acknowledged opening identity; the manifest at `314811` / `e99335567d157a86f8f2b6f178b7222bf86ccfe15e5f827da5a03864c1d04b31`; `DECISIONS.md` at `76314` / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`; branch and HEAD unchanged.

Do not begin the derived date-occurrence report, Stage 2b, post-assembly deterministic verification, or owner ratification in the same turn. The date-occurrence report is the next commission in sequence and is generated only after this re-measurement returns clean or its findings are adjudicated, because its rows carry byte offsets into the manifest.

This order does not substitute for the commission-required constitutional-content review, which is discharged separately and is not reopened here.
