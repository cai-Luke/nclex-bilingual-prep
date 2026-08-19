# Stage 2a — M6 repair pre-census

**Work order:** `DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-PRE-CENSUS-CODEX-WORK-ORDER-2026-08-04.md` revision 2 only. The verification draft was not executed, filled, or modified.

All offsets below are zero-based, half-open ranges over raw UTF-8 bytes. Physical line numbers are one-based. A displayed physical line is its source bytes excluding its terminating LF; separately reported heading and M6.3-row ranges include the terminating LF where present.

## 1. Task 0 snapshots — first writes

- `audit/decisions-migration-2026-07-29/target-text-manifest.md` → `audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-SNAPSHOT-2026-08-04.md.frozen`: 308092 bytes; SHA-256 `8e0589dcfb9f7190b11ea145dfa9e10e9075c069a3c631ef1a03c3c0c42dc244`.
- `DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md` → `audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-RESUME-NOTE-SNAPSHOT-2026-08-04.md.frozen`: 55424 bytes; SHA-256 `e27fd31d1fd497c7a64a73126438f7981ecc206689aee6ac21eb60add38afa8a`.

Raw stdout from the snapshot command (the successful `cmp` commands themselves emitted no stdout; the following exit-status lines are output from the command wrapper):
```text
target snapshot destination absent; test exit 0
resume snapshot destination absent; test exit 0
cp target snapshot exit 0
cp resume snapshot exit 0
cmp target source versus snapshot exit 0
cmp resume source versus snapshot exit 0
  308092 audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-SNAPSHOT-2026-08-04.md.frozen
   55424 audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-RESUME-NOTE-SNAPSHOT-2026-08-04.md.frozen
  363516 total
8e0589dcfb9f7190b11ea145dfa9e10e9075c069a3c631ef1a03c3c0c42dc244  audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-SNAPSHOT-2026-08-04.md.frozen
e27fd31d1fd497c7a64a73126438f7981ecc206689aee6ac21eb60add38afa8a  audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-RESUME-NOTE-SNAPSHOT-2026-08-04.md.frozen
```

## 2. §1 identity and status verification

- Repository root: `/Users/holemini/Desktop/Project Shrimp`
- Branch: `codex/decisions-migration`
- HEAD: `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`
- `MIGRATION_BASELINE`: `d499cc1d0916e03830489ec9cd0324cd1a203a73`
- Target: `audit/decisions-migration-2026-07-29/target-text-manifest.md` — 308092 bytes; SHA-256 `8e0589dcfb9f7190b11ea145dfa9e10e9075c069a3c631ef1a03c3c0c42dc244`; 5875 physical lines; one terminal `@@ASSEMBLY_CURSOR@@` at line 5875.
- Resume note: 55424 bytes; SHA-256 `e27fd31d1fd497c7a64a73126438f7981ecc206689aee6ac21eb60add38afa8a`; 803 physical lines.
- `DECISIONS.md`: 76314 bytes; SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`.
- WO1 SHA-256 at beginning: `d3d0c9001c739603148e455053786e5e9aeec91fe4878ee7da6eea5881bbc005`.

Raw stdout for the pre-Task-0 `git status --porcelain`:
```text
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-BLOCK-GROUPING-WORKSHEET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-CANDIDATE-REGIONS-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-ADDENDUM-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-CODEX-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-CODEX-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-RECEIPT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-RESULTS-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-WORK-ORDER-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-GPT-DETERMINISTIC-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-HEADER-MEASUREMENT-WORK-ORDER-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-PRE-CENSUS-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-VERIFICATION-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-MANIFEST-SCAFFOLD-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-BINDING-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-07-31.md
?? DECISIONS-MIGRATION-STAGE-2A-P7-DATE-CORRECTION-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-A-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-B-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-B-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-AUTHORING-WORK-ORDER-2026-07-31.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PATH-CANDIDATE-WORKSHEET-2026-07-29.md
?? audit/decisions-migration-2026-07-29/
```

## 3. Task A — M6.3 primary repair population

- M6.3 data rows: 110.
- Field split: Evidence=59; Owner=51.
- Selected rows: 10.

All eight cells of each selected row, verbatim:
```text
| 2 | `E002` | `P2#0` | Evidence | — | NO-SINGLE-PATH | `OMIT` | M4.3 |
| 6 | `E004` | `P3#0` | Evidence | `scripts/audit/audit-non-mcq-bias.ts`, `scripts/audit/non-mcq-bias-layer-b.ts` | NO-SINGLE-PATH | `OMIT` | M4.5 |
| 10 | `E006` | `P5#0` | Evidence | `BANK-REVIEW-LEDGER.md` | NOT-AN-AUTHORITY, PARTIAL-STATEMENT | `OMIT` | M4.7 |
| 14 | `E008` | `P6#0` | Evidence | `AGENTS.md` | PARTIAL-STATEMENT | `OMIT` | M4.9 |
| 18 | `E039a` | `P8#0` | Evidence | — | NO-SINGLE-PATH | `OMIT` | M4.11 |
| 20 | `E010` | `P10#0` | Evidence | `src/schema.ts`, `src/sessionSampler.ts` | NO-SINGLE-PATH | `OMIT` | M4.12 |
| 38 | `E019` | `P21#0` | Evidence | `AGENTS.md`, `NCLEX-Question-Schema.md` | NO-SINGLE-PATH | `OMIT` | M4.22 |
| 49 | `E025` | `P24#0` | Evidence | `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` | PARTIAL-STATEMENT | `OMIT` | M4.28 |
| 59 | `E030` | `P26#0` | Evidence | `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` | PARTIAL-STATEMENT | `OMIT` | M4.33 |
| 71 | `E049` | `R2#0` | Evidence | `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` | PARTIAL-STATEMENT | `OMIT` | M4.40 |
```

## 4. Task B — Task A item-10 `Evidence` extracts

### M4.3
Item-10 block: bytes [21723, 22147).
```text
10. **Optional-field omissions:** `Authorized` — `OMIT`. `Not authorized` — `OMIT`. `Evidence` —
    `OMIT`; the rule spans governance practice across every seat and no single tracked path supports the
    complete statement. `Owner` — `OMIT`; same reason. `Execution` — `OMIT`; the entry decides a
    governance practice with no implementable owner, and the frozen classification carries no execution
    state.
```
`Evidence` disposition: bytes [21811, 21955); bare=false.
```text
`Evidence` —
    `OMIT`; the rule spans governance practice across every seat and no single tracked path supports the
    complete statement. 
```

### M4.5
Item-10 block: bytes [26136, 26486).
```text
10. **Optional-field omissions:** `Authorized` — `OMIT`. `Not authorized` — `OMIT`. `Evidence` —
    `OMIT`. `Owner` — `OMIT`; the offline-handoff boundary is realised across queue emission,
    validation, and merge, and no one path owns the whole statement. `Execution` — `OMIT`; the frozen
    classification carries no execution state.
```
`Evidence` disposition: bytes [26224, 26251); bare=true.
```text
`Evidence` —
    `OMIT`. 
```

### M4.7
Item-10 block: bytes [29634, 30019).
```text
10. **Optional-field omissions:** `Authorized` — `OMIT`. `Not authorized` — `OMIT`. `Evidence` —
    `OMIT`; `BANK-REVIEW-LEDGER.md` is an artifact of the pipeline rather than the owner of the
    promotion rule, and the statement covers review routing beyond it. `Owner` — `OMIT`; same reason.
    `Execution` — `OMIT`; the frozen classification carries no execution state.
```
`Evidence` disposition: bytes [29722, 29904); bare=false.
```text
`Evidence` —
    `OMIT`; `BANK-REVIEW-LEDGER.md` is an artifact of the pipeline rather than the owner of the
    promotion rule, and the statement covers review routing beyond it. 
```

### M4.9
Item-10 block: bytes [34215, 34807).
```text
10. **Optional-field omissions:** `Authorized` — `OMIT`. `Not authorized` — `OMIT`. `Evidence` —
    `OMIT`; `AGENTS.md` supports several clauses of this statement, including the deterministic-or-
    curated imagery policy, the AI-imagery prohibition, and the load-bearing rule, but no single
    eligible tracked repository path supports the complete statement. `Owner` — `OMIT`; per-kind
    `selfCheck` is a family of implementations rather than one path, and no curated-image lane exists in
    code. `Execution` — `OMIT`; the frozen classification carries no execution state.
```
`Evidence` disposition: bytes [34303, 34585); bare=false.
```text
`Evidence` —
    `OMIT`; `AGENTS.md` supports several clauses of this statement, including the deterministic-or-
    curated imagery policy, the AI-imagery prohibition, and the load-bearing rule, but no single
    eligible tracked repository path supports the complete statement. 
```

### M4.11
Item-10 block: bytes [38307, 38672).
```text
10. **Optional-field omissions:** `Authorized` — `OMIT`. `Not authorized` — `OMIT`. `Evidence` —
    `OMIT`; a cross-seat authoring contract with no single tracked path, and the `E039b` extensions are
    archive-only and supply no live owner. `Owner` — `OMIT`; same reason. `Execution` — `OMIT`; the
    frozen classification carries no execution state.
```
`Evidence` disposition: bytes [38395, 38557); bare=false.
```text
`Evidence` —
    `OMIT`; a cross-seat authoring contract with no single tracked path, and the `E039b` extensions are
    archive-only and supply no live owner. 
```

### M4.12
Item-10 block: bytes [41220, 41638).
```text
10. **Optional-field omissions:** `Authorized` — `OMIT`. `Not authorized` — `OMIT`. `Evidence` —
    `OMIT`. `Owner` — `OMIT`; `src/schema.ts` and `src/sessionSampler.ts` are jointly necessary — the
    category weights live in the first, the draw, floor, and diversity behaviour in the second — and the
    one-path grammar forbids naming both, so selecting either alone would misrepresent the statement.
```
`Evidence` disposition: bytes [41308, 41335); bare=true.
```text
`Evidence` —
    `OMIT`. 
```

### M4.22
Item-10 block: bytes [65458, 65925).
```text
10. **Optional-field omissions:** `Authorized` — `OMIT`. `Not authorized` — `OMIT`. `Evidence` —
    `OMIT`; the statement defers shape to `AGENTS.md` and `NCLEX-Question-Schema.md` together, a
    combined value is illegal under the one-path grammar, and naming either alone would misstate the
    deferral. `Owner` — `OMIT`; a prompt-authoring rule with no executable owner. `Execution` —
    `OMIT`; the frozen classification carries no execution state.
```
`Evidence` disposition: bytes [65546, 65773); bare=false.
```text
`Evidence` —
    `OMIT`; the statement defers shape to `AGENTS.md` and `NCLEX-Question-Schema.md` together, a
    combined value is illegal under the one-path grammar, and naming either alone would misstate the
    deferral. 
```

### M4.28
Item-10 block: bytes [80944, 81551).
```text
10. **Optional-field omissions:** `Authorized` — `OMIT`. `Not authorized` — `OMIT`. `Evidence` —
    `OMIT`; `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` owns only rule F's
    `post_intervention` test, which is one clause of the source and no part of the target statement,
    so it fails the complete-statement standard applied to `P6#0`. `Owner` — `OMIT`; the statement's
    mechanisms are owned by four executable paths — `src/types.ts`, `src/schema.ts`,
    `src/measurementAllowlist.ts`, and `src/measurementUnitPolicy.ts` — and the one-path grammar
    admits no concatenation.
```
`Evidence` disposition: bytes [81032, 81300); bare=false.
```text
`Evidence` —
    `OMIT`; `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` owns only rule F's
    `post_intervention` test, which is one clause of the source and no part of the target statement,
    so it fails the complete-statement standard applied to `P6#0`. 
```

### M4.33
Item-10 block: bytes [97429, 98016).
```text
10. **Optional-field omissions:** `Authorized` — `OMIT`. `Not authorized` — `OMIT`. `Evidence` —
    `OMIT`; `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` supports the flowsheet origin, and
    the source states in terms that the rule is generalized past that origin, so one document
    supporting the origin is not evidence for the generalization. This is the reasoning applied to
    `P6#0`. `Owner` — `OMIT`; the rule governs every checked surface rather than one gate, and
    `scripts/exhibit-flowsheet-gate.ts` owns only the surface the forcing incident arose on.
```
`Evidence` disposition: bytes [97517, 97838); bare=false.
```text
`Evidence` —
    `OMIT`; `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` supports the flowsheet origin, and
    the source states in terms that the rule is generalized past that origin, so one document
    supporting the origin is not evidence for the generalization. This is the reasoning applied to
    `P6#0`. 
```

### M4.40
Item-10 block: bytes [118299, 119227).
```text
10. **Optional-field omissions:** `Authorized` — `OMIT`. `Not authorized` — `OMIT`. `Evidence` —
    `OMIT`; `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` was the candidate and supports only
    the extraction-preservation clause through its Rule C, so promoting it to a whole-entry field
    would assert support the source never gave for the analyte-aware display policy that is this
    ruling's governing claim. This is the clause-promotion error corrected at `P25#2`. `Owner` —
    `OMIT`; `src/measurementUnitPolicy.ts` owns the analyte-aware conversion table and the display
    layer but not the byte-exact source-unit-preservation clause, and one governing limb outside the
    candidate path is enough to require omission under the whole-statement test. The Part C draft kept
    this `Owner`; the Part C review and Part D §1.1 both direct its removal, and the manifest supersedes
    the draft here.
```
`Evidence` disposition: bytes [118387, 118786); bare=false.
```text
`Evidence` —
    `OMIT`; `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` was the candidate and supports only
    the extraction-preservation clause through its Rule C, so promoting it to a whole-entry field
    would assert support the source never gave for the analyte-aware display policy that is this
    ruling's governing claim. This is the clause-promotion error corrected at `P25#2`. 
```

## 5. Task C — ruling-19 cleanup row: M4.31, block P25#2

Item-10 block: bytes [91078, 91660).
```text
10. **Optional-field omissions:** `Authorized` — `OMIT`. `Not authorized` — `OMIT`. `Evidence` —
    `OMIT`, superseding the Part B and Part D drafts, which pinned
    `Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md`.
    That path is tracked, but it fails the complete-statement standard twice over, as recorded in
    item 12 below. `Owner` — `OMIT`; the unified geometry, the retained flowsheet, and the
    single-series band rule are owned by separate renderer paths, and no one path supports the
    complete statement.
```
`Evidence` disposition: bytes [91166, 91467); bare=false.
```text
`Evidence` —
    `OMIT`, superseding the Part B and Part D drafts, which pinned
    `Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md`.
    That path is tracked, but it fails the complete-statement standard twice over, as recorded in
    item 12 below. 
```

## 6. Task D — phrase sweep and expansion set

Population: entire target file. Case-insensitive literals: `complete statement`, `complete-statement`, `whole statement`, `whole-statement`. Hits: 28.

### Hit 1
- Literal: `whole-statement`
- Byte offset: 9766; physical line: 154
- Top-level section: `## M2. Exact target §1 — purpose and authority boundaries`
- Containing `###` subsection: none.
- Complete physical line, verbatim:
```text
orientation file, and a single whole-statement test applied to `Owner` and `Evidence` alike, which their
```

### Hit 2
- Literal: `complete statement`
- Byte offset: 21935; physical line: 389
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.3 `P2#0``
- Complete physical line, verbatim:
```text
    complete statement. `Owner` — `OMIT`; same reason. `Execution` — `OMIT`; the entry decides a
```
- Containing item-10 `Evidence` disposition for `M4.3`, bytes [21811, 21955):
```text
`Evidence` —
    `OMIT`; the rule spans governance practice across every seat and no single tracked path supports the
    complete statement. 
```

### Hit 3
- Literal: `whole statement`
- Byte offset: 26387; physical line: 505
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.5 `P3#0``
- Complete physical line, verbatim:
```text
    validation, and merge, and no one path owns the whole statement. `Execution` — `OMIT`; the frozen
```

### Hit 4
- Literal: `complete statement`
- Byte offset: 34565; physical line: 722
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.9 `P6#0``
- Complete physical line, verbatim:
```text
    eligible tracked repository path supports the complete statement. `Owner` — `OMIT`; per-kind
```
- Containing item-10 `Evidence` disposition for `M4.9`, bytes [34303, 34585):
```text
`Evidence` —
    `OMIT`; `AGENTS.md` supports several clauses of this statement, including the deterministic-or-
    curated imagery policy, the AI-imagery prohibition, and the load-bearing rule, but no single
    eligible tracked repository path supports the complete statement. 
```

### Hit 5
- Literal: `complete statement`
- Byte offset: 45907; physical line: 1003
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.14 `P15#0``
- Complete physical line, verbatim:
```text
    document supports the complete statement. Part A's omission register carried no row for this block;
```
- Containing item-10 `Evidence` disposition for `M4.14`, bytes [45764, 46019):
```text
`Evidence` —
    `OMIT`; the reason the rule exists is stated inside the statement itself, and no separate tracked
    document supports the complete statement. Part A's omission register carried no row for this block;
    the omission is decided here.
```

### Hit 6
- Literal: `complete statement`
- Byte offset: 48524; physical line: 1061
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.15 `P15#1``
- Complete physical line, verbatim:
```text
    truth for the complete statement. Part A's omission register carried no row for this block, and
```

### Hit 7
- Literal: `complete statement`
- Byte offset: 57459; physical line: 1278
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.19 `P17#0``
- Complete physical line, verbatim:
```text
    executable path owns, so no single tracked path supports the complete statement.
```

### Hit 8
- Literal: `complete statement`
- Byte offset: 60241; physical line: 1338
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.20 `P19#0``
- Complete physical line, verbatim:
```text
    truth for the complete statement. Narrowing the statement to fit the path was rejected.
```

### Hit 9
- Literal: `whole statement`
- Byte offset: 68369; physical line: 1514
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.23 `P21#1``
- Complete physical line, verbatim:
```text
    neither owns the whole statement, and narrowing the statement to fit one path would drop a
```

### Hit 10
- Literal: `complete statement`
- Byte offset: 73452; physical line: 1628
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.25 `P23#0``
- Complete physical line, verbatim:
```text
    separate paths, so no one path supports the complete statement. `src/examLayout.ts` is carried on
```

### Hit 11
- Literal: `complete statement`
- Byte offset: 76150; physical line: 1687
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.26 `P23#1``
- Complete physical line, verbatim:
```text
    tracked document supports the complete statement.
```
- Containing item-10 `Evidence` disposition for `M4.26`, bytes [76001, 76170):
```text
`Evidence` —
    `OMIT`; the allocation behaviour is owned by the executable path already named, and no separate
    tracked document supports the complete statement.
```

### Hit 12
- Literal: `complete-statement`
- Byte offset: 81253; physical line: 1800
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.28 `P24#0``
- Complete physical line, verbatim:
```text
    so it fails the complete-statement standard applied to `P6#0`. `Owner` — `OMIT`; the statement's
```
- Containing item-10 `Evidence` disposition for `M4.28`, bytes [81032, 81300):
```text
`Evidence` —
    `OMIT`; `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` owns only rule F's
    `post_intervention` test, which is one clause of the source and no part of the target statement,
    so it fails the complete-statement standard applied to `P6#0`. 
```

### Hit 13
- Literal: `whole statement`
- Byte offset: 88295; physical line: 1935
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.30 `P25#1``
- Complete physical line, verbatim:
```text
    `P25#2` supersedes, and no other executable path owns the whole statement.
```

### Hit 14
- Literal: `complete-statement`
- Byte offset: 91393; physical line: 1998
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.31 `P25#2``
- Complete physical line, verbatim:
```text
    That path is tracked, but it fails the complete-statement standard twice over, as recorded in
```
- Containing item-10 `Evidence` disposition for `M4.31`, bytes [91166, 91467):
```text
`Evidence` —
    `OMIT`, superseding the Part B and Part D drafts, which pinned
    `Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md`.
    That path is tracked, but it fails the complete-statement standard twice over, as recorded in
    item 12 below. 
```

### Hit 15
- Literal: `complete statement`
- Byte offset: 91640; physical line: 2001
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.31 `P25#2``
- Complete physical line, verbatim:
```text
    complete statement.
```

### Hit 16
- Literal: `whole-statement`
- Byte offset: 119057; physical line: 2564
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.40 `R2#0``
- Complete physical line, verbatim:
```text
    candidate path is enough to require omission under the whole-statement test. The Part C draft kept
```

### Hit 17
- Literal: `whole-statement`
- Byte offset: 155360; physical line: 3191
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.48 `Bilingual English and Simplified Chinese parity on all displayed text``
- Complete physical line, verbatim:
```text
    whole-statement test on the same ground as `P15#1`.
```

### Hit 18
- Literal: `whole-statement`
- Byte offset: 166159; physical line: 3409
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.51 `Question IDs are globally unique across bundled banks``
- Complete physical line, verbatim:
```text
    whole-statement owner under ruling 11, not a mechanism-only path.
```

### Hit 19
- Literal: `whole statement`
- Byte offset: 182974; physical line: 3778
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.57 `Shared visual numeric helpers have a single definition``
- Complete physical line, verbatim:
```text
    helpers are exported from it at one place each, so it owns the whole statement rather than a
```

### Hit 20
- Literal: `whole-statement`
- Byte offset: 183049; physical line: 3779
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.57 `Shared visual numeric helpers have a single definition``
- Complete physical line, verbatim:
```text
    mechanism inside it. This is a ruling 11 whole-statement owner.
```

### Hit 21
- Literal: `whole statement`
- Byte offset: 185958; physical line: 3844
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.58 `Case-study exhibit IDs share one namespace``
- Complete physical line, verbatim:
```text
    path, so it owns the whole statement under ruling 11.
```

### Hit 22
- Literal: `complete statement`
- Byte offset: 187655; physical line: 3888
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.59 `Category targets are the current test-plan weights``
- Complete physical line, verbatim:
```text
    — `OMIT`; no one tracked path owns the complete statement, and the reasoning is at item 12.
```

### Hit 23
- Literal: `complete statement`
- Byte offset: 189268; physical line: 3912
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.59 `Category targets are the current test-plan weights``
- Complete physical line, verbatim:
```text
    No one tracked path owns the complete statement, so `Owner` is omitted. This is the ruling 11 and
```

### Hit 24
- Literal: `whole statement`
- Byte offset: 196451; physical line: 4054
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.61 `Repository-state hygiene is mechanism-specific``
- Complete physical line, verbatim:
```text
    so it owns the whole statement, not a part of it. A markdown `Owner` is unusual in this manifest and
```

### Hit 25
- Literal: `complete statement`
- Byte offset: 204639; physical line: 4204
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.63 `Highlight's structural bias gate is schema-level``
- Complete physical line, verbatim:
```text
    semantic review. The complete statement therefore spans separate tracked execution surfaces and no
```

### Hit 26
- Literal: `whole statement`
- Byte offset: 211138; physical line: 4332
- Top-level section: `## M4. Live-block records — commission §4.4`
- Containing `###` subsection: `### M4.65 `Exam-condition test and adaptive modes``
- Complete physical line, verbatim:
```text
    current-behaviour sentence alone does not make any path the owner of the whole statement. `Execution`
```

### Hit 27
- Literal: `complete-statement`
- Byte offset: 265980; physical line: 5364
- Top-level section: `## M6. Optional-field omission register — commission §§4.4 item 10 and 4.6`
- Containing `###` subsection: `### M6.1 Ground vocabulary`
- Complete physical line, verbatim:
```text
| `PARTIAL-STATEMENT` | Exactly one tracked candidate exists and covers part of the statement only. This is the complete-statement test of standing rulings 11 and 23. |
```

### Hit 28
- Literal: `complete-statement`
- Byte offset: 300941; physical line: 5762
- Top-level section: `## M6. Optional-field omission register — commission §§4.4 item 10 and 4.6`
- Containing `###` subsection: `### M6.10 Derived counts`
- Complete physical line, verbatim:
```text
`PARTIAL-STATEMENT` at 14 are the same complete-statement test applied at different candidate counts, and
```

**Task D expansion set:** `M4.14`, `M4.26`.

## 7. Task E — Owner-shaped language inside `Evidence` reasoning

Population: the item-10 `Evidence` disposition substring of each M4.2–M4.66 record where that substring exists. Case-insensitive literals: `owns`, `own the`, `owner of`, `owned by`, `jointly necessary`, `no single tracked path`, `no one path`, `one-path grammar`, `singular live source of truth`, `singular source of truth`.
Records without an `Evidence` disposition substring, therefore not searched in this restricted population: `M4.36`, `M4.37`, `M4.41`, `M4.42`, `M4.45`, `M4.50`.
Hits: 27.

### Hit 1
- Record: `M4.3`; block: `P2#0`
- Literal: `no single tracked path`; byte offset: 21895; physical line: 388
- Complete physical line, verbatim:
```text
    `OMIT`; the rule spans governance practice across every seat and no single tracked path supports the
```

### Hit 2
- Record: `M4.7`; block: `P5#0`
- Literal: `owner of`; byte offset: 29820; physical line: 602
- Complete physical line, verbatim:
```text
    `OMIT`; `BANK-REVIEW-LEDGER.md` is an artifact of the pipeline rather than the owner of the
```

### Hit 3
- Record: `M4.11`; block: `P8#0`
- Literal: `no single tracked path`; byte offset: 38459; physical line: 823
- Complete physical line, verbatim:
```text
    `OMIT`; a cross-seat authoring contract with no single tracked path, and the `E039b` extensions are
```

### Hit 4
- Record: `M4.15`; block: `P15#1`
- Literal: `owner of`; byte offset: 48074; physical line: 1056
- Complete physical line, verbatim:
```text
    `OMIT`; the forcing evidence is a dated remediation work artifact rather than the owner of the rule,
```

### Hit 5
- Record: `M4.22`; block: `P21#0`
- Literal: `one-path grammar`; byte offset: 65698; physical line: 1456
- Complete physical line, verbatim:
```text
    combined value is illegal under the one-path grammar, and naming either alone would misstate the
```

### Hit 6
- Record: `M4.24`; block: `P21#2`
- Literal: `one-path grammar`; byte offset: 70835; physical line: 1569
- Complete physical line, verbatim:
```text
    concept rather than a single tracked file and is therefore ineligible under the one-path grammar.
```

### Hit 7
- Record: `M4.26`; block: `P23#1`
- Literal: `owned by`; byte offset: 76056; physical line: 1686
- Complete physical line, verbatim:
```text
    `OMIT`; the allocation behaviour is owned by the executable path already named, and no separate
```

### Hit 8
- Record: `M4.28`; block: `P24#0`
- Literal: `owns`; byte offset: 81113; physical line: 1798
- Complete physical line, verbatim:
```text
    `OMIT`; `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` owns only rule F's
```

### Hit 9
- Record: `M4.30`; block: `P25#1`
- Literal: `owner of`; byte offset: 88089; physical line: 1933
- Complete physical line, verbatim:
```text
    than a tracked owner of the general contract. `Owner` — `OMIT`;
```

### Hit 10
- Record: `M4.35`; block: `P28#0`
- Literal: `owns`; byte offset: 103269; physical line: 2245
- Complete physical line, verbatim:
```text
    owns the compressed-out substance. `Owner` — `OMIT`; `lib/question-population.ts`,
```

### Hit 11
- Record: `M4.43`; block: `R5#0`
- Literal: `one-path grammar`; byte offset: 131654; physical line: 2788
- Complete physical line, verbatim:
```text
    independent checker, coequal records of which the one-path grammar admits only one, and selecting
```

### Hit 12
- Record: `M4.44`; block: `R6#0`
- Literal: `one-path grammar`; byte offset: 135604; physical line: 2857
- Complete physical line, verbatim:
```text
    report and its independent checker, coequal records of which the one-path grammar admits only one,
```

### Hit 13
- Record: `M4.46`; block: `Deterministic review routing for promoted opus-prefixed case IDs`
- Literal: `owns`; byte offset: 144895; physical line: 3014
- Complete physical line, verbatim:
```text
    the routing carries no measurement, provenance, or method a separate tracked source owns. `Owner` —
```

### Hit 14
- Record: `M4.47`; block: `Runtime audio carries no client-embedded secret`
- Literal: `owns`; byte offset: 150353; physical line: 3103
- Complete physical line, verbatim:
```text
    the statement carries its own reason and no separate tracked source owns evidence it is forbidden to
```

### Hit 15
- Record: `M4.48`; block: `Bilingual English and Simplified Chinese parity on all displayed text`
- Literal: `owns`; byte offset: 155060; physical line: 3188
- Complete physical line, verbatim:
```text
    tracked file owns. `Owner` — `OMIT`; the statement governs **all** displayed text, which spans the
```

### Hit 16
- Record: `M4.49`; block: `Topic labels are English-only`
- Literal: `owns`; byte offset: 157660; physical line: 3246
- Complete physical line, verbatim:
```text
    the statement restates no measurement, provenance, or method that a separate tracked source owns.
```

### Hit 17
- Record: `M4.51`; block: `Question IDs are globally unique across bundled banks`
- Literal: `owns`; byte offset: 164748; physical line: 3387
- Complete physical line, verbatim:
```text
    the statement restates no measurement, provenance, or method a separate tracked source owns.
```

### Hit 18
- Record: `M4.53`; block: `Canonical merges are deterministic and gated`
- Literal: `owns`; byte offset: 171272; physical line: 3523
- Complete physical line, verbatim:
```text
    the statement restates no measurement, provenance, or method a separate tracked source owns.
```

### Hit 19
- Record: `M4.54`; block: `Runtime stays static, offline, and file-protocol compatible`
- Literal: `owns`; byte offset: 173372; physical line: 3575
- Complete physical line, verbatim:
```text
    the statement restates no measurement, provenance, or method a separate tracked source owns. `Owner`
```

### Hit 20
- Record: `M4.56`; block: `Schema changes are rare and deliberate`
- Literal: `owns`; byte offset: 179388; physical line: 3703
- Complete physical line, verbatim:
```text
    tracked file owns. `Owner` — `OMIT`; the entry states an authoring disposition rather than a rule any
```

### Hit 21
- Record: `M4.57`; block: `Shared visual numeric helpers have a single definition`
- Literal: `owns`; byte offset: 181722; physical line: 3758
- Complete physical line, verbatim:
```text
    the statement restates no measurement, provenance, or method a separate tracked source owns.
```

### Hit 22
- Record: `M4.58`; block: `Case-study exhibit IDs share one namespace`
- Literal: `owns`; byte offset: 184571; physical line: 3822
- Complete physical line, verbatim:
```text
    the statement restates no measurement, provenance, or method a separate tracked source owns.
```

### Hit 23
- Record: `M4.59`; block: `Category targets are the current test-plan weights`
- Literal: `owns`; byte offset: 187596; physical line: 3887
- Complete physical line, verbatim:
```text
    the statement restates no measurement, provenance, or method a separate tracked source owns. `Owner`
```

### Hit 24
- Record: `M4.60`; block: `Bank composition is a floor problem, not a balance problem`
- Literal: `owns`; byte offset: 191243; physical line: 3959
- Complete physical line, verbatim:
```text
    the statement restates no measurement, provenance, or method a separate tracked source owns.
```

### Hit 25
- Record: `M4.61`; block: `Repository-state hygiene is mechanism-specific`
- Literal: `owns`; byte offset: 194313; physical line: 4025
- Complete physical line, verbatim:
```text
    the statement restates no measurement, provenance, or method a separate tracked source owns, and the
```

### Hit 26
- Record: `M4.62`; block: `Some topics are deliberately shared across categories`
- Literal: `owns`; byte offset: 198220; physical line: 4099
- Complete physical line, verbatim:
```text
    the statement restates no measurement, provenance, or method a separate tracked source owns.
```

### Hit 27
- Record: `M4.63`; block: `Highlight's structural bias gate is schema-level`
- Literal: `owns`; byte offset: 202154; physical line: 4172
- Complete physical line, verbatim:
```text
    the statement restates no measurement, provenance, or method a separate tracked source owns. `Owner`
```

**Task E expansion set:** `M4.15`, `M4.24`, `M4.30`, `M4.35`, `M4.43`, `M4.44`, `M4.46`, `M4.47`, `M4.48`, `M4.49`, `M4.51`, `M4.53`, `M4.54`, `M4.56`, `M4.57`, `M4.58`, `M4.59`, `M4.60`, `M4.61`, `M4.62`, `M4.63`.

## 8. Task F — ground/field consistency census over M6.3

M6.3 rows parsed: 110. Ground cells were split on commas, whitespace-trimmed, stripped of backticks, and stripped of a trailing dagger plus adjacent whitespace. Empty tokens and tokens not matching `^[A-Z]+(?:-[A-Z]+)*$` were rejected as findings.
Malformed/empty findings: none.

- `ARCHIVE-ONLY` — rows=11; Evidence=10; Owner=1; records: `M4.2`, `M4.4`, `M4.15`, `M4.17`, `M4.27`, `M4.30`, `M4.34`, `M4.35`, `M4.39`, `M4.52`.
- `CARRIED-ELSEWHERE` — rows=2; Evidence=0; Owner=2; records: `M4.16`, `M4.25`.
- `COEQUAL-PAIR` — rows=3; Evidence=3; Owner=0; records: `M4.43`, `M4.44`, `M4.66`.
- `NO-CANDIDATE` — rows=9; Evidence=9; Owner=0; records: `M4.6`, `M4.10`, `M4.13`, `M4.16`, `M4.19`, `M4.20`, `M4.21`, `M4.23`, `M4.25`.
- `NO-COMPRESSED-SUBSTANCE` — rows=19; Evidence=19; Owner=0; records: `M4.14`, `M4.26`, `M4.39`, `M4.46`, `M4.47`, `M4.48`, `M4.49`, `M4.51`, `M4.53`, `M4.54`, `M4.55`, `M4.56`, `M4.57`, `M4.58`, `M4.59`, `M4.60`, `M4.61`, `M4.62`, `M4.63`.
- `NO-EXECUTABLE-OWNER` — rows=11; Evidence=0; Owner=11; records: `M4.6`, `M4.8`, `M4.10`, `M4.22`, `M4.24`, `M4.27`, `M4.29`, `M4.34`, `M4.36`, `M4.38`, `M4.56`.
- `NO-SINGLE-PATH` — rows=24; Evidence=5; Owner=19; records: `M4.3`, `M4.5`, `M4.11`, `M4.12`, `M4.21`, `M4.22`, `M4.23`, `M4.25`, `M4.28`, `M4.30`, `M4.31`, `M4.35`, `M4.37`, `M4.39`, `M4.42`, `M4.47`, `M4.54`, `M4.55`, `M4.59`, `M4.63`.
- `NOT-A-PATH` — rows=6; Evidence=4; Owner=2; records: `M4.8`, `M4.9`, `M4.13`, `M4.24`, `M4.32`, `M4.38`.
- `NOT-AN-AUTHORITY` — rows=6; Evidence=3; Owner=3; records: `M4.7`, `M4.18`, `M4.29`, `M4.45`.
- `PARTIAL-STATEMENT` — rows=14; Evidence=5; Owner=9; records: `M4.7`, `M4.9`, `M4.15`, `M4.19`, `M4.20`, `M4.28`, `M4.33`, `M4.40`, `M4.46`, `M4.48`, `M4.50`.
- `PENDING` — rows=4; Evidence=0; Owner=4; records: `M4.32`, `M4.43`, `M4.44`, `M4.66`.
- `SUPERSEDED-SCOPE` — rows=1; Evidence=0; Owner=1; records: `M4.30`.
- `UNRESOLVED-SUBJECT` — rows=6; Evidence=3; Owner=3; records: `M4.64`, `M4.65`, `M4.66`.
- `WRONG-AUTHORITY` — rows=1; Evidence=1; Owner=0; records: `M4.31`.

**Ground tokens appearing on both `Evidence` and `Owner` rows:** `ARCHIVE-ONLY`, `NO-SINGLE-PATH`, `NOT-A-PATH`, `NOT-AN-AUTHORITY`, `PARTIAL-STATEMENT`, `UNRESOLVED-SUBJECT`.

## 9. Task G — M6 structural offsets

Heading and M6.3-row ranges include their terminating LF where present. The M6 opening-preamble range begins immediately after the LF terminating the `## M6.` heading line; that LF belongs to the heading line and does not belong to the preamble.
- `## M6. Optional-field omission register — commission §§4.4 item 10 and 4.6`: byte offset 261571; physical line 5306; heading-line bytes [261571, 261650).
- `### M6.0 Scope, authority, and reading rules`: byte offset 262367; physical line 5317; heading-line bytes [262367, 262412).
- `### M6.1 Ground vocabulary`: byte offset 264990; physical line 5352; heading-line bytes [264990, 265017).
- `### M6.2 Per-block optional-field ledger — commission §4.4 item 10`: byte offset 267244; physical line 5375; heading-line bytes [267244, 267314).
- `### M6.3 `Evidence` and `Owner` omission register — commission §4.6`: byte offset 274977; physical line 5454; heading-line bytes [274977, 275048).
- `### M6.4 Governed field-path population — every present `Evidence` and `Owner``: byte offset 287820; physical line 5574; heading-line bytes [287820, 287901).
- `### M6.5 Rejected co-candidates on a populated field`: byte offset 290808; physical line 5618; heading-line bytes [290808, 290861).
- `### M6.6 `Authorized`, `Not authorized`, and `Execution` omissions`: byte offset 291377; physical line 5627; heading-line bytes [291377, 291444).
- `### M6.7 Omissions first grounded at M6`: byte offset 293795; physical line 5657; heading-line bytes [293795, 293835).
- `### M6.8 Divergences from the draft omission registers`: byte offset 296096; physical line 5681; heading-line bytes [296096, 296151).
- `### M6.9 Surfaces that generate no register row`: byte offset 298092; physical line 5700; heading-line bytes [298092, 298140).
- `### M6.10 Derived counts`: byte offset 299156; physical line 5715; heading-line bytes [299156, 299181).
- `## M7. Date-surface inventory — owner-directed candidate model`: byte offset 301277; physical line 5769; heading-line bytes [301277, 301342).
- M6 opening preamble: bytes [261650, 262367); length 717.

M6.3 data rows: 110. Each row range below includes its terminating LF.
```text
row 1: bytes [275518, 275590); physical line 5463; | 1 | `E001` | `P1#0` | Evidence | — | ARCHIVE-ONLY | `OMIT` | M4.2 |
row 2: bytes [275590, 275664); physical line 5464; | 2 | `E002` | `P2#0` | Evidence | — | NO-SINGLE-PATH | `OMIT` | M4.3 |
row 3: bytes [275664, 275735); physical line 5465; | 3 | `E002` | `P2#0` | Owner | — | NO-SINGLE-PATH | `OMIT` | M4.3 |
row 4: bytes [275735, 275807); physical line 5466; | 4 | `E003` | `P2#1` | Evidence | — | ARCHIVE-ONLY | `OMIT` | M4.4 |
row 5: bytes [275807, 275876); physical line 5467; | 5 | `E003` | `P2#1` | Owner | — | ARCHIVE-ONLY | `OMIT` | M4.4 |
row 6: bytes [275876, 276025); physical line 5468; | 6 | `E004` | `P3#0` | Evidence | `scripts/audit/audit-non-mcq-bias.ts`, `scripts/audit/non-mcq-bias-layer-b.ts` | NO-SINGLE-PATH | `OMIT` | M4.5 |
row 7: bytes [276025, 276171); physical line 5469; | 7 | `E004` | `P3#0` | Owner | `scripts/audit/audit-non-mcq-bias.ts`, `scripts/audit/non-mcq-bias-layer-b.ts` | NO-SINGLE-PATH | `OMIT` | M4.5 |
row 8: bytes [276171, 276243); physical line 5470; | 8 | `E005` | `P4#0` | Evidence | — | NO-CANDIDATE | `OMIT` | M4.6 |
row 9: bytes [276243, 276319); physical line 5471; | 9 | `E005` | `P4#0` | Owner | — | NO-EXECUTABLE-OWNER | `OMIT` | M4.6 |
row 10: bytes [276319, 276435); physical line 5472; | 10 | `E006` | `P5#0` | Evidence | `BANK-REVIEW-LEDGER.md` | NOT-AN-AUTHORITY, PARTIAL-STATEMENT | `OMIT` | M4.7 |
row 11: bytes [276435, 276548); physical line 5473; | 11 | `E006` | `P5#0` | Owner | `BANK-REVIEW-LEDGER.md` | NOT-AN-AUTHORITY, PARTIAL-STATEMENT | `OMIT` | M4.7 |
row 12: bytes [276548, 276641); physical line 5474; | 12 | `E007` | `P5#1` | Evidence | the `P31` cross-reference | NOT-A-PATH | `OMIT` | M4.8 |
row 13: bytes [276641, 276722); physical line 5475; | 13 | `E007` | `P5#1` | Owner | — | NO-EXECUTABLE-OWNER † | `OMIT` | M4.8 |
row 14: bytes [276722, 276808); physical line 5476; | 14 | `E008` | `P6#0` | Evidence | `AGENTS.md` | PARTIAL-STATEMENT | `OMIT` | M4.9 |
row 15: bytes [276808, 276893); physical line 5477; | 15 | `E008` | `P6#0` | Owner | per-kind `selfCheck` | NOT-A-PATH | `OMIT` | M4.9 |
row 16: bytes [276893, 276967); physical line 5478; | 16 | `E009` | `P7#0` | Evidence | — | NO-CANDIDATE | `OMIT` | M4.10 |
row 17: bytes [276967, 277045); physical line 5479; | 17 | `E009` | `P7#0` | Owner | — | NO-EXECUTABLE-OWNER | `OMIT` | M4.10 |
row 18: bytes [277045, 277122); physical line 5480; | 18 | `E039a` | `P8#0` | Evidence | — | NO-SINGLE-PATH | `OMIT` | M4.11 |
row 19: bytes [277122, 277196); physical line 5481; | 19 | `E039a` | `P8#0` | Owner | — | NO-SINGLE-PATH | `OMIT` | M4.11 |
row 20: bytes [277196, 277310); physical line 5482; | 20 | `E010` | `P10#0` | Evidence | `src/schema.ts`, `src/sessionSampler.ts` | NO-SINGLE-PATH | `OMIT` | M4.12 |
row 21: bytes [277310, 277421); physical line 5483; | 21 | `E010` | `P10#0` | Owner | `src/schema.ts`, `src/sessionSampler.ts` | NO-SINGLE-PATH | `OMIT` | M4.12 |
row 22: bytes [277421, 277500); physical line 5484; | 22 | `E011` | `P11#0` | Evidence | — | NO-CANDIDATE † | `OMIT` | M4.13 |
row 23: bytes [277500, 277587); physical line 5485; | 23 | `E011` | `P11#0` | Owner | per-kind `selfCheck` | NOT-A-PATH | `OMIT` | M4.13 |
row 24: bytes [277587, 277673); physical line 5486; | 24 | `E012` | `P15#0` | Evidence | — | NO-COMPRESSED-SUBSTANCE | `OMIT` | M4.14 |
row 25: bytes [277673, 277748); physical line 5487; | 25 | `E013` | `P15#1` | Evidence | — | ARCHIVE-ONLY | `OMIT` | M4.15 |
row 26: bytes [277748, 277844); physical line 5488; | 26 | `E013` | `P15#1` | Owner | `scripts/patch-raw.ts` | PARTIAL-STATEMENT | `OMIT` | M4.15 |
row 27: bytes [277844, 277923); physical line 5489; | 27 | `E014` | `P16#0` | Evidence | — | NO-CANDIDATE † | `OMIT` | M4.16 |
row 28: bytes [277923, 278032); physical line 5490; | 28 | `E014` | `P16#0` | Owner | `scripts/audit/non-mcq-bias-lib.ts` | CARRIED-ELSEWHERE | `OMIT` | M4.16 |
row 29: bytes [278032, 278107); physical line 5491; | 29 | `E015` | `P16#1` | Evidence | — | ARCHIVE-ONLY | `OMIT` | M4.17 |
row 30: bytes [278107, 278220); physical line 5492; | 30 | `E016` | `P16#2` | Evidence | the `visual-canonical` bank data file | NOT-AN-AUTHORITY | `OMIT` | M4.18 |
row 31: bytes [278220, 278330); physical line 5493; | 31 | `E016` | `P16#2` | Owner | the `visual-canonical` bank data file | NOT-AN-AUTHORITY | `OMIT` | M4.18 |
row 32: bytes [278330, 278409); physical line 5494; | 32 | `E017` | `P17#0` | Evidence | — | NO-CANDIDATE † | `OMIT` | M4.19 |
row 33: bytes [278409, 278499); physical line 5495; | 33 | `E017` | `P17#0` | Owner | `src/grading.ts` | PARTIAL-STATEMENT | `OMIT` | M4.19 |
row 34: bytes [278499, 278578); physical line 5496; | 34 | `E018` | `P19#0` | Evidence | — | NO-CANDIDATE † | `OMIT` | M4.20 |
row 35: bytes [278578, 278667); physical line 5497; | 35 | `E018` | `P19#0` | Owner | `src/schema.ts` | PARTIAL-STATEMENT | `OMIT` | M4.20 |
row 36: bytes [278667, 278746); physical line 5498; | 36 | `E044` | `P20#0` | Evidence | — | NO-CANDIDATE † | `OMIT` | M4.21 |
row 37: bytes [278746, 278883); physical line 5499; | 37 | `E044` | `P20#0` | Owner | `src/audio/normalizeForTts.ts`, `scripts/audio/build-tts-queue.ts` | NO-SINGLE-PATH | `OMIT` | M4.21 |
row 38: bytes [278883, 278996); physical line 5500; | 38 | `E019` | `P21#0` | Evidence | `AGENTS.md`, `NCLEX-Question-Schema.md` | NO-SINGLE-PATH | `OMIT` | M4.22 |
row 39: bytes [278996, 279075); physical line 5501; | 39 | `E019` | `P21#0` | Owner | — | NO-EXECUTABLE-OWNER | `OMIT` | M4.22 |
row 40: bytes [279075, 279154); physical line 5502; | 40 | `E020` | `P21#1` | Evidence | — | NO-CANDIDATE † | `OMIT` | M4.23 |
row 41: bytes [279154, 279300); physical line 5503; | 41 | `E020` | `P21#1` | Owner | `lib/producer-vocabulary-leakage.ts`, `lib/authorial-constraint-leakage.ts` | NO-SINGLE-PATH | `OMIT` | M4.23 |
row 42: bytes [279300, 279419); physical line 5504; | 42 | `E021` | `P21#2` | Evidence | `audit/terminal-sentence-remediation-2026-07-22/` | NOT-A-PATH | `OMIT` | M4.24 |
row 43: bytes [279419, 279498); physical line 5505; | 43 | `E021` | `P21#2` | Owner | — | NO-EXECUTABLE-OWNER | `OMIT` | M4.24 |
row 44: bytes [279498, 279577); physical line 5506; | 44 | `E022` | `P23#0` | Evidence | — | NO-CANDIDATE † | `OMIT` | M4.25 |
row 45: bytes [279577, 279686); physical line 5507; | 45 | `E022` | `P23#0` | Owner | `src/examLayout.ts` | CARRIED-ELSEWHERE, NO-SINGLE-PATH | `OMIT` | M4.25 |
row 46: bytes [279686, 279772); physical line 5508; | 46 | `E023` | `P23#1` | Evidence | — | NO-COMPRESSED-SUBSTANCE | `OMIT` | M4.26 |
row 47: bytes [279772, 279847); physical line 5509; | 47 | `E024` | `P23#2` | Evidence | — | ARCHIVE-ONLY | `OMIT` | M4.27 |
row 48: bytes [279847, 279926); physical line 5510; | 48 | `E024` | `P23#2` | Owner | — | NO-EXECUTABLE-OWNER | `OMIT` | M4.27 |
row 49: bytes [279926, 280056); physical line 5511; | 49 | `E025` | `P24#0` | Evidence | `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` | PARTIAL-STATEMENT | `OMIT` | M4.28 |
row 50: bytes [280056, 280221); physical line 5512; | 50 | `E025` | `P24#0` | Owner | `src/types.ts`, `src/schema.ts`, `src/measurementAllowlist.ts`, `src/measurementUnitPolicy.ts` | NO-SINGLE-PATH | `OMIT` | M4.28 |
row 51: bytes [280221, 280350); physical line 5513; | 51 | `E026` | `P25#0` | Evidence | `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` | NOT-AN-AUTHORITY | `OMIT` | M4.29 |
row 52: bytes [280350, 280441); physical line 5514; | 52 | `E026` | `P25#0` | Owner | `src/schema.ts` | NO-EXECUTABLE-OWNER | `OMIT` | M4.29 |
row 53: bytes [280441, 280516); physical line 5515; | 53 | `E027` | `P25#1` | Evidence | — | ARCHIVE-ONLY | `OMIT` | M4.30 |
row 54: bytes [280516, 280646); physical line 5516; | 54 | `E027` | `P25#1` | Owner | `src/visuals/kinds/vitals_trend/index.ts` | SUPERSEDED-SCOPE, NO-SINGLE-PATH | `OMIT` | M4.30 |
row 55: bytes [280646, 280817); physical line 5517; | 55 | `E028` | `P25#2` | Evidence | `Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md` | WRONG-AUTHORITY | `OMIT` | M4.31 |
row 56: bytes [280817, 280891); physical line 5518; | 56 | `E028` | `P25#2` | Owner | — | NO-SINGLE-PATH | `OMIT` | M4.31 |
row 57: bytes [280891, 280988); physical line 5519; | 57 | `E029` | `P25#3` | Evidence | the `P25#2` cross-reference | NOT-A-PATH | `OMIT` | M4.32 |
row 58: bytes [280988, 281055); physical line 5520; | 58 | `E029` | `P25#3` | Owner | — | PENDING | `OMIT` | M4.32 |
row 59: bytes [281055, 281185); physical line 5521; | 59 | `E030` | `P26#0` | Evidence | `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` | PARTIAL-STATEMENT | `OMIT` | M4.33 |
row 60: bytes [281185, 281294); physical line 5522; | 60 | `E030` | `P26#0` | Owner | `scripts/exhibit-flowsheet-gate.ts` | PARTIAL-STATEMENT | `OMIT` | M4.33 |
row 61: bytes [281294, 281369); physical line 5523; | 61 | `E031` | `P27#0` | Evidence | — | ARCHIVE-ONLY | `OMIT` | M4.34 |
row 62: bytes [281369, 281448); physical line 5524; | 62 | `E031` | `P27#0` | Owner | — | NO-EXECUTABLE-OWNER | `OMIT` | M4.34 |
row 63: bytes [281448, 281523); physical line 5525; | 63 | `E033` | `P28#0` | Evidence | — | ARCHIVE-ONLY | `OMIT` | M4.35 |
row 64: bytes [281523, 281673); physical line 5526; | 64 | `E033` | `P28#0` | Owner | `lib/question-population.ts`, `scripts/census.ts`, `scripts/coverage-report.ts` | NO-SINGLE-PATH | `OMIT` | M4.35 |
row 65: bytes [281673, 281752); physical line 5527; | 65 | `E034` | `P29#0` | Owner | — | NO-EXECUTABLE-OWNER | `OMIT` | M4.36 |
row 66: bytes [281752, 281900); physical line 5528; | 66 | `E035` | `P30#0` | Owner | `src/visuals/kinds/lab_trend/defs.ts`, `src/visuals/kinds/lab_trend/index.ts` | NO-SINGLE-PATH | `OMIT` | M4.37 |
row 67: bytes [281900, 282027); physical line 5529; | 67 | `E074` | `P31#0` | Evidence | cross-references to legacy principles 3, 5, 8, 18, and 22 | NOT-A-PATH | `OMIT` | M4.38 |
row 68: bytes [282027, 282106); physical line 5530; | 68 | `E074` | `P31#0` | Owner | — | NO-EXECUTABLE-OWNER | `OMIT` | M4.38 |
row 69: bytes [282106, 282205); physical line 5531; | 69 | `E070` | `R1#0` | Evidence | — | NO-COMPRESSED-SUBSTANCE, ARCHIVE-ONLY | `OMIT` | M4.39 |
row 70: bytes [282205, 282278); physical line 5532; | 70 | `E070` | `R1#0` | Owner | — | NO-SINGLE-PATH | `OMIT` | M4.39 |
row 71: bytes [282278, 282407); physical line 5533; | 71 | `E049` | `R2#0` | Evidence | `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` | PARTIAL-STATEMENT | `OMIT` | M4.40 |
row 72: bytes [282407, 282510); physical line 5534; | 72 | `E049` | `R2#0` | Owner | `src/measurementUnitPolicy.ts` | PARTIAL-STATEMENT | `OMIT` | M4.40 |
row 73: bytes [282510, 282659); physical line 5535; | 73 | `E072` | `R4#0` | Owner | `scripts/promoted-visual-parity.ts`, `scripts/promoted-visual-parity-survey.ts` | NO-SINGLE-PATH | `OMIT` | M4.42 |
row 74: bytes [282659, 282871); physical line 5536; | 74 | `E047a` | `R5#0` | Evidence | `audit/vital-sanity-bounds-p3-stage-3-source-packet-2026-07-23.md`, `audit/vital-sanity-bounds-p3-stage-3-independent-checker-2026-07-23.md` | COEQUAL-PAIR | `OMIT` | M4.43 |
row 75: bytes [282871, 282964); physical line 5537; | 75 | `E047a` | `R5#0` | Owner | `src/measurementAllowlist.ts` | PENDING | `OMIT` | M4.43 |
row 76: bytes [282964, 283144); physical line 5538; | 76 | `E073` | `R6#0` | Evidence | `audit/ci-coverage-survey-2026-07-23.report.md`, `audit/ci-coverage-survey-2026-07-23.independent-checker.md` | COEQUAL-PAIR | `OMIT` | M4.44 |
row 77: bytes [283144, 283210); physical line 5539; | 77 | `E073` | `R6#0` | Owner | — | PENDING | `OMIT` | M4.44 |
row 78: bytes [283210, 283365); physical line 5540; | 78 | `E038` | `Producer assignments are operational state, not constitutional text` | Owner | `PROJECT-HISTORY.md` | NOT-AN-AUTHORITY | `OMIT` | M4.45 |
row 79: bytes [283365, 283511); physical line 5541; | 79 | `E043a` | `Deterministic review routing for promoted opus-prefixed case IDs` | Evidence | — | NO-COMPRESSED-SUBSTANCE | `OMIT` | M4.46 |
row 80: bytes [283511, 283691); physical line 5542; | 80 | `E043a` | `Deterministic review routing for promoted opus-prefixed case IDs` | Owner | `scripts/audit/early-bank-semantic-layer-a.ts` | PARTIAL-STATEMENT | `OMIT` | M4.46 |
row 81: bytes [283691, 283819); physical line 5543; | 81 | `E054` | `Runtime audio carries no client-embedded secret` | Evidence | — | NO-COMPRESSED-SUBSTANCE | `OMIT` | M4.47 |
row 82: bytes [283819, 283990); physical line 5544; | 82 | `E054` | `Runtime audio carries no client-embedded secret` | Owner | `src/App.tsx`, `src/audio/normalizeForTts.ts`, `AGENTS.md` | NO-SINGLE-PATH | `OMIT` | M4.47 |
row 83: bytes [283990, 284140); physical line 5545; | 83 | `E055` | `Bilingual English and Simplified Chinese parity on all displayed text` | Evidence | — | NO-COMPRESSED-SUBSTANCE | `OMIT` | M4.48 |
row 84: bytes [284140, 284308); physical line 5546; | 84 | `E055` | `Bilingual English and Simplified Chinese parity on all displayed text` | Owner | `src/schema.ts`, `src/App.tsx` | PARTIAL-STATEMENT | `OMIT` | M4.48 |
row 85: bytes [284308, 284418); physical line 5547; | 85 | `E056` | `Topic labels are English-only` | Evidence | — | NO-COMPRESSED-SUBSTANCE | `OMIT` | M4.49 |
row 86: bytes [284418, 284578); physical line 5548; | 86 | `E057` | `JSON quote hygiene is a parse-time gate` | Owner | `scripts/fix-bank-quotes.ts`, `scripts/patch-raw.ts` | PARTIAL-STATEMENT | `OMIT` | M4.50 |
row 87: bytes [284578, 284712); physical line 5549; | 87 | `E058` | `Question IDs are globally unique across bundled banks` | Evidence | — | NO-COMPRESSED-SUBSTANCE | `OMIT` | M4.51 |
row 88: bytes [284712, 284836); physical line 5550; | 88 | `E059` | `Raw-draft filename prefix routes to its canonical bank` | Evidence | — | ARCHIVE-ONLY | `OMIT` | M4.52 |
row 89: bytes [284836, 284961); physical line 5551; | 89 | `E060` | `Canonical merges are deterministic and gated` | Evidence | — | NO-COMPRESSED-SUBSTANCE | `OMIT` | M4.53 |
row 90: bytes [284961, 285101); physical line 5552; | 90 | `E061` | `Runtime stays static, offline, and file-protocol compatible` | Evidence | — | NO-COMPRESSED-SUBSTANCE | `OMIT` | M4.54 |
row 91: bytes [285101, 285229); physical line 5553; | 91 | `E061` | `Runtime stays static, offline, and file-protocol compatible` | Owner | — | NO-SINGLE-PATH | `OMIT` | M4.54 |
row 92: bytes [285229, 285358); physical line 5554; | 92 | `E062` | `Schema versions are an ordered token, not semver` | Evidence | — | NO-COMPRESSED-SUBSTANCE | `OMIT` | M4.55 |
row 93: bytes [285358, 285503); physical line 5555; | 93 | `E062` | `Schema versions are an ordered token, not semver` | Owner | `src/types.ts`, `src/schema.ts` | NO-SINGLE-PATH | `OMIT` | M4.55 |
row 94: bytes [285503, 285622); physical line 5556; | 94 | `E063` | `Schema changes are rare and deliberate` | Evidence | — | NO-COMPRESSED-SUBSTANCE | `OMIT` | M4.56 |
row 95: bytes [285622, 285734); physical line 5557; | 95 | `E063` | `Schema changes are rare and deliberate` | Owner | — | NO-EXECUTABLE-OWNER | `OMIT` | M4.56 |
row 96: bytes [285734, 285869); physical line 5558; | 96 | `E064` | `Shared visual numeric helpers have a single definition` | Evidence | — | NO-COMPRESSED-SUBSTANCE | `OMIT` | M4.57 |
row 97: bytes [285869, 285992); physical line 5559; | 97 | `E065` | `Case-study exhibit IDs share one namespace` | Evidence | — | NO-COMPRESSED-SUBSTANCE | `OMIT` | M4.58 |
row 98: bytes [285992, 286123); physical line 5560; | 98 | `E066` | `Category targets are the current test-plan weights` | Evidence | — | NO-COMPRESSED-SUBSTANCE | `OMIT` | M4.59 |
row 99: bytes [286123, 286309); physical line 5561; | 99 | `E066` | `Category targets are the current test-plan weights` | Owner | `src/schema.ts`, `src/sessionSampler.ts`, `scripts/coverage-report.ts` | NO-SINGLE-PATH | `OMIT` | M4.59 |
row 100: bytes [286309, 286449); physical line 5562; | 100 | `E067` | `Bank composition is a floor problem, not a balance problem` | Evidence | — | NO-COMPRESSED-SUBSTANCE | `OMIT` | M4.60 |
row 101: bytes [286449, 286577); physical line 5563; | 101 | `E068` | `Repository-state hygiene is mechanism-specific` | Evidence | — | NO-COMPRESSED-SUBSTANCE | `OMIT` | M4.61 |
row 102: bytes [286577, 286712); physical line 5564; | 102 | `E069` | `Some topics are deliberately shared across categories` | Evidence | — | NO-COMPRESSED-SUBSTANCE | `OMIT` | M4.62 |
row 103: bytes [286712, 286842); physical line 5565; | 103 | `E071` | `Highlight's structural bias gate is schema-level` | Evidence | — | NO-COMPRESSED-SUBSTANCE | `OMIT` | M4.63 |
row 104: bytes [286842, 287050); physical line 5566; | 104 | `E071` | `Highlight's structural bias gate is schema-level` | Owner | `src/schema.ts`, `scripts/audit/non-mcq-bias-lib.ts`, `scripts/audit/non-mcq-bias-layer-b.ts` | NO-SINGLE-PATH | `OMIT` | M4.63 |
row 105: bytes [287050, 287195); physical line 5567; | 105 | `E045` | `Translation-friction scoring` | Evidence | the shipped translation-friction instrument | UNRESOLVED-SUBJECT | `OMIT` | M4.64 |
row 106: bytes [287195, 287297); physical line 5568; | 106 | `E045` | `Translation-friction scoring` | Owner | — | UNRESOLVED-SUBJECT | `OMIT` | M4.64 |
row 107: bytes [287297, 287412); physical line 5569; | 107 | `E046` | `Exam-condition test and adaptive modes` | Evidence | — | UNRESOLVED-SUBJECT | `OMIT` | M4.65 |
row 108: bytes [287412, 287524); physical line 5570; | 108 | `E046` | `Exam-condition test and adaptive modes` | Owner | — | UNRESOLVED-SUBJECT | `OMIT` | M4.65 |
row 109: bytes [287524, 287679); physical line 5571; | 109 | `E047b` | `Unresolved vital sanity bounds` | Evidence | the two P3 stage-3 records at row 74 | COEQUAL-PAIR, UNRESOLVED-SUBJECT | `OMIT` | M4.66 |
row 110: bytes [287679, 287819); physical line 5572; | 110 | `E047b` | `Unresolved vital sanity bounds` | Owner | `src/measurementAllowlist.ts` | PENDING, UNRESOLVED-SUBJECT | `OMIT` | M4.66 |
```

## 10. Closing

No wording was proposed, classified, altered, or adjudicated. Task D and Task E sets are enumerations only. All requested populations were measured. The six records noted in Task E had no bounded `Evidence` disposition substring and were therefore not part of that task’s restricted search population; this is reported as a measured structural condition, not as an absence finding. No other requested measurement was unmeasured.

The end-of-run snapshot comparisons, snapshot identities, WO1 hash, and post-run `git status --porcelain` follow in the appended end-verification section.

## 11. End verification

The following was measured after Tasks A–G and after this report was first created. Both `cmp` commands succeeded (each had empty native stdout; their wrapper recorded exit 0). The target and resume snapshots still match their sources byte-for-byte, retain their initial lengths and SHA-256 values, and the WO1 hash at end equals its beginning hash. Thus WO1 remained byte-identical during execution.

Raw stdout:

```text
cmp target source versus snapshot exit 0
cmp resume source versus snapshot exit 0
  308092 audit/decisions-migration-2026-07-29/target-text-manifest.md
  308092 audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-SNAPSHOT-2026-08-04.md.frozen
   55424 DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md
   55424 audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-RESUME-NOTE-SNAPSHOT-2026-08-04.md.frozen
  727032 total
8e0589dcfb9f7190b11ea145dfa9e10e9075c069a3c631ef1a03c3c0c42dc244  audit/decisions-migration-2026-07-29/target-text-manifest.md
8e0589dcfb9f7190b11ea145dfa9e10e9075c069a3c631ef1a03c3c0c42dc244  audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-SNAPSHOT-2026-08-04.md.frozen
e27fd31d1fd497c7a64a73126438f7981ecc206689aee6ac21eb60add38afa8a  DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md
e27fd31d1fd497c7a64a73126438f7981ecc206689aee6ac21eb60add38afa8a  audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-RESUME-NOTE-SNAPSHOT-2026-08-04.md.frozen
d3d0c9001c739603148e455053786e5e9aeec91fe4878ee7da6eea5881bbc005  DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-PRE-CENSUS-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-BLOCK-GROUPING-WORKSHEET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-CANDIDATE-REGIONS-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-ADDENDUM-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-CODEX-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-CODEX-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-RECEIPT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-RESULTS-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-WORK-ORDER-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-GPT-DETERMINISTIC-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-HEADER-MEASUREMENT-WORK-ORDER-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-PRE-CENSUS-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-VERIFICATION-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-MANIFEST-SCAFFOLD-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-BINDING-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-P7-DATE-CORRECTION-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-A-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-B-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-B-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-AUTHORING-WORK-ORDER-2026-07-31.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PATH-CANDIDATE-WORKSHEET-2026-07-29.md
?? audit/decisions-migration-2026-07-29/
```
