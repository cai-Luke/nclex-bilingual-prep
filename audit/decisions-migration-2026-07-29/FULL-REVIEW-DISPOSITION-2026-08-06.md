# Stage 2a full constitutional review — disposition

Read-only §5 full constitutional review deliverable. Review began only after the two pinned identities were freshly remeasured.

- Work order: DECISIONS-MIGRATION-STAGE-2A-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md — 32622 bytes; SHA-256 ba03de1bcf8058eea5062d0d67d838faa5d316038c9cd083c33b13f468ec39ac.
- Manifest: audit/decisions-migration-2026-07-29/target-text-manifest.md — 314491 bytes; SHA-256 9d3283086a93daa3e0925ff539f9d98d5914cc9955035f129f3178329804fe5a.
- Commissioned records: F1–F9 structural/cross-cutting checks; M6 and §5.5 whole-manifest checks.
- Branch: codex/decisions-migration; HEAD: 05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5.
- Review mode: source re-derivation only; no repair, no manifest edit, no resume/status/decision-file edit, and no Stage 2b tranche review.

## Cross-cutting findings and structural checks

### F1 — entry index
- **PASS.** Re-derived exactly 65 live index rows from M4.2–M4.66. Every row matches its block heading, permanent ID/title or name title, Kind, Status, Force, and summary; declared total is 65.

### F2 — population and classification
- **PASS.** Re-derived 37 P blocks across 25 distinct IDs (P1, P2, P3, P4, P5, P6, P7, P8, P10, P11, P15, P16, P17, P19, P20, P21, P23, P24, P25, P26, P27, P28, P29, P30, P31), 6 R blocks, 19 I entries, and 3 T entries. All frozen destinations are STAY.

### F3 — attachment grouping
- **PASS.** Attachment keys are contiguous beneath their cores: P2#1, P5#1, P15#1, P16#1/#2, P21#1/#2, P23#1/#2, and P25#1/#2/#3. No orphan, duplicate, or out-of-order attachment was found.

### F4 — title namespace
- **PASS.** The 19 live I titles, 3 live T titles, and 13 wrapper labels form one 35-name namespace: unique, collision-free, and no title begins P<n> or R<n>. Each wrapper label is byte-equal to its M5.6 archive-index label.

### F5 — name-addressed citations
- **PASS.** The sole live target citation is the P20 I: citation; it is inside backticks, unsplit, and resolves byte-for-byte to the live invariant title. No unresolved I:/T: citation was found.

### F6 — Evidence/Owner path tracking
- **PASS.** All 20 present Evidence/Owner instances were tested against git ls-files: 19 distinct candidate strings, 18 tracked paths, and the single untracked Evidence exception is E038's exact normalized archive filename Archive/DECISIONS-ARCHIVE-2026-08-18.md, allowed by Amendment 1 Clause A. Evidence and Owner used separate M6.1 tests.

### F7 — 80-row reconciliation
- **PASS.** Exact union: 65 live M4 rows + 13 M5.5 wrappers + E053 structural target-§8 introduction + E037 merge source row = 80 source-accounting rows. No extra or missing row; retired-register rows remain separately checked metadata.

### F8 — retired-identifier register
- **PASS.** Six rows are exact and complete:

| ID | disposition | date | wrapper |
|---|---|---|---|
| P9 | RETIRED | 2026-07-28 | E040 |
| P12 | RETIRED | 2026-07-28 | E041 |
| P13 | NEVER ASSIGNED | — | — |
| P14 | NEVER ASSIGNED | — | — |
| P18 | RETIRED | 2026-07-28 | E042 |
| P22 | RETIRED | 2026-07-28 | E043b |

The four retired IDs have exact E040/E041/E042/E043b wrappers; P13 and P14 are exact NEVER ASSIGNED rows. No live block carries a listed ID.

### F9 — no implementation/parser change
- **PASS.** Branch and HEAD remain codex/decisions-migration / 05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5. DECISIONS.md is byte-identical to MIGRATION_BASELINE by git diff --quiet and independent length/hash equality. Relevant implementation/parser paths are unmodified; repository status contains only pre-existing untracked Stage 2a inputs plus these six authorized deliverables.

### M6 optional-field register and date checks
- **PASS.** Every live M4 record has explicit Authorized, Not authorized, Evidence, Owner, and Execution disposition. All 110 M6.3 Evidence/Owner rows were reconciled to their owning M4 record; no M6 row authorizes a field or reopens discharged P2#0/P5#0/P8#0 Owner reasons.
- **PASS.** All live dates match their effective-date sources, including corrected P7 2026-06-09 and P8 2026-07-24; wrapper dates follow the fixed retirement/archive asymmetry.

## Findings inventory

| record | result | issue |
|---|---|---|
| M4.3 / P2#0 | FINDING | E002 independent-null anti-author-intent condition omitted. |
| M4.4 / P2#1 | FINDING | Owner anaphora fails independent Owner-ground requirement; DEFECT, never reserved. |
| M4.5 / P3#0 | FINDING | E004 Layer-A non-mutation safeguard omitted. |
| M4.35 / P28#0 | FINDING | E033 generation-prompt-parameters limb omitted. |
| M4.38 / P31#0 | FINDING | E074 forward flag-only/never-compiler/never-mutation restriction omitted. |

No QUESTION remains. No finding was repaired, re-reviewed by convenience, or converted to clear.

## §5.9 disposition

**REVISE**

The review does not authorize Stage 2b. The five findings require an authorized manifest/owner disposition and any separately commissioned repair/re-review before ACCEPT can be considered. This file records the review result only; it does not change the manifest, resume note, status record, DECISIONS.md, or any other pre-existing file.

Disposition closure: F1–F9, M6, §5.5, and the 80-row reconciliation were written and closed; no Stage 2b review or implementation was begun.
