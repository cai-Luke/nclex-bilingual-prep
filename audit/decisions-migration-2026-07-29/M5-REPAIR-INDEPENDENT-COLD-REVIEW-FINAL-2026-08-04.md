# M5 Repair — Final Independent Cold Review

**Review date:** 2026-08-04  
**Review mode:** disk-reading independent checker; live local branch/worktree snapshot  
**Question:** Is the repaired M5 safe to retain as the current Stage 2a candidate?

## 1. Disposition

**ACCEPT.**

The repaired M5 is mechanically sound and safe to retain as the current Stage 2a candidate. The repaired
manifest has the reported identity, its splice can be mapped exactly to the corrupted backup, all fourteen
baseline slices reproduce, the wrapper/index/register surfaces reconcile, the current parser behavior and
the ratified Stage 2b guard removal agree with the manifest, and the seven historical-kind calls are
supportable under the ratified taxonomy. No manifest defect requiring a byte change was found.

This disposition adjudicates the repaired M5 candidate, not the quality of an earlier review report.

## 2. Repository snapshot

The following snapshot was measured before this report was created.

```text
git branch --show-current
codex/decisions-migration

git rev-parse HEAD
05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5
```

`git status --short` returned only the pre-existing untracked Stage 2a population:

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

Both `git diff --stat` and `git diff --cached --stat` were empty. `git diff --name-only` and
`git diff --cached --name-only` were also empty. Therefore there were no staged changes and no tracked
working-tree changes attributable to the repair.

The repair backup's `untracked-stage-2a` snapshot contains 30 files. A byte comparison against live disk
found 29 unchanged files and one changed file: the manifest itself, whose change is the repair under
review. No file was missing. This independently confirms that the existing untracked Stage 2a work remained
intact and no unrelated snapshotted work was modified.

## 3. Repaired and backup identities

### Repaired manifest

Path: `audit/decisions-migration-2026-07-29/target-text-manifest.md`

| Measurement | Result |
|---|---|
| Byte length | `268,517` |
| SHA-256 | `e629c94f96f7dce16ffbf7756ae99383d4a4acc69614dd4d412e05ca25454698` |
| Physical lines / LF bytes | `5,418` / `5,418` |
| Strict UTF-8 decode | PASS |
| U+FFFD replacement characters | `0` |
| CRLF sequences / bare CR bytes | `0` / `0` |
| Final byte | LF |
| `@@ASSEMBLY_CURSOR@@` occurrences | `1` |

### Frozen `DECISIONS.md`

| Measurement | Result |
|---|---|
| Live-disk byte length | `76,314` |
| Live-disk SHA-256 | `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` |
| Baseline object | `d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md` |
| Baseline byte length / SHA-256 | `76,314` / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` |
| Live disk versus baseline `cmp` | byte-identical, PASS |

### Corrupted backup

The designated backup is:

```text
/tmp/project-shrimp-m5-repair.A1Xpnp/manifest-backup/target-text-manifest.md
```

| Measurement | Result |
|---|---|
| Byte length | `488,954` |
| SHA-256 | `8a91afe8b3a10375979760481d26fbc88f68330e9aac4a44f1d69564e8ad2b8c` |
| Physical lines / LF bytes | `9,896` / `9,896` |
| Strict UTF-8 decode | PASS |
| CRLF sequences / bare CR bytes | `0` / `0` |

The same corrupted bytes also exist at
`/tmp/project-shrimp-m5-repair.A1Xpnp/untracked-stage-2a/audit/decisions-migration-2026-07-29/target-text-manifest.md`.
That is the whole untracked-tree safety copy, not an ambiguous second repair candidate; both copies have the
same size and SHA-256.

## 4. Structural verification

All counts below were derived from live repaired bytes rather than accepted from manifest prose.

- Top-level `## M0` through `## M7` headings each occur exactly once, in numeric order, at repaired-file
  lines `26`, `130`, `150`, `196`, `266`, `4479`, `5306`, and `5312`.
- Within M5, `### M5.0` through `### M5.8` each occur exactly once, in numeric order, at lines `4481`,
  `4511`, `4544`, `4593`, `4624`, `4651`, `5198`, `5238`, and `5263`.
- The thirteen wrapper-record headings occur exactly once and are contiguous as `M5.5.1` through
  `M5.5.13`; their displayed wrapper numbers are likewise `01` through `13`.
- The top-level manifest header occurs once. No M0–M4 heading occurs after M5 begins.
- M6 remains only its placeholder: the `## M6. Not yet authored` heading, its one placeholder paragraph,
  and the following section separator.
- M7 is preserved at repaired-file lines `5312–5418`.
- Exactly one final `@@ASSEMBLY_CURSOR@@` remains, at repaired-file line `5418`.

## 5. Exact corruption and splice mapping

The corrupted backup has 9,896 lines; the repaired manifest has 5,418. Source and destination line numbers
are distinguished explicitly below.

| Corrupted-backup source | Repaired-file destination | Result |
|---|---|---|
| lines `1–5266`, bytes `[0,258697)` | lines `1–5266`, bytes `[0,258697)` | byte-identical prefix |
| line `5267`, bytes `[258697,258746)` | beginning of repaired line `5267`, bytes `[258697,258746)` | surviving first-bullet stem, byte-identical |
| line `5267` byte-column 49 through line `9744`, bytes `[258746,479181)` | no destination; removed | exact duplicate insertion |
| line `9745`, bytes `[479181,479238)` | used as reconstruction evidence for repaired line `5267`; not byte-mapped | surviving first-bullet fragment |
| lines `9746–9896`, bytes `[479238,488954)` | lines `5268–5418`, bytes `[258801,268517)` | byte-identical suffix |

The removed insertion is exactly 220,435 bytes and equals repaired-file bytes `[0,220435)`, which are
repaired-file lines `1–4478` inclusive. Line `4478` is the blank line after the section separator immediately
before M5; M5 itself begins at repaired line `4479`. Therefore the duplicated material was the manifest
header through the end of the pre-M5 surface. It did **not** extend through M5.7.

The fused corruption begins on corrupted-backup line `5267`:

```text
- Each label line matches `^- \*\*(.+)\*\* — .+# Stage 2a target-text manifest — CANDIDATE, NOT RATIFIED
```

The duplicate copy then continues on corrupted-backup lines `5268–9744`. Its last two lines are the
pre-M5 separator (`---`) and following blank line. Corrupted-backup line `9745` resumes the interrupted
M5.8 bullet. Corrupted-backup lines `9746–9783` map to repaired M5.8 lines `5268–5305`;
corrupted-backup lines `9784–9789` map to repaired M6 lines `5306–5311`; and corrupted-backup lines
`9790–9896` map to repaired M7 lines `5312–5418`. This mapping proves preservation of M6 and M7 without
overlapping a removed range.

## 6. Reconstructed M5.8 line disclosure

The exact surviving pieces in the corrupted backup were:

```text
stem from backup line 5267:
- Each label line matches `^- \*\*(.+)\*\* — .+

fragment from backup line 9745:
, and no label contains `**`, so the greedy capture ends
```

The repaired line `5267` is:

```text
- Each label line matches `^- \*\*(.+)\*\* — .+$`; no label contains `**`, so the greedy capture ends
```

Relative to mechanically adjoining the surviving pieces, the repair restores the regex end anchor `$` and
closing code tick after `.+`, and uses `; no label` where the surviving fragment had `, and no label`.
The regex restoration is required to state the actual parser contract
`/^- \*\*(.+)\*\* — .+$/`. The connective change is stylistic and does not alter that assertion or the
claim about greedy capture. Classification: **reconstructed, substantively correct, exact original bytes
unavailable**. The line is not claimed as byte-preserved.

## 7. Parser-contract verification

### Archive-index parsing

`parseArchiveIndexLines` derives section state from `## <number>` headings and scans only lines whose
current section is 8. It recognizes labels with `^- \*\*(.+)\*\* — .+$` and requires the immediately
following pointer line to match ``^  `([^`#]+)#([^`]+)`$``. The file portion therefore cannot contain `#`.

An archive label matching `^((?:P|R)\d+) (.+)$` is ID-addressed. Its block key is `<ID>#0`; every other
label is name-addressed and uses the complete label as its block key. Thus `P<n> ` and `R<n> ` are reserved
prefix shapes. The M5.4 structural prose has no line beginning `- **`, and the M5.7 register uses table rows,
so neither surface can parse as an archive-index entry even after placement in target §8.

### Archive-wrapper parsing

`parseArchiveDocument` segments only on lines beginning exactly `### `. An ID-addressed heading must match
`^((?:P|R)\d+) — ([^—`]+)$`; derived-ID and malformed-ID shapes are rejected. Every other accepted heading
is name-addressed, with its complete heading text as title and block key.

Fields are parsed in this order: `Kind`, `Status`, `Force`, `Date`, `Original Kind`, `Original Status`,
optional `Retired ID`, `Origin`. Required fields are all of those except `Retired ID`. Values are constrained
to archive `Kind: X`, `Status: SUPERSEDED`, `Force: HISTORICAL`, a valid date, a live original kind/status,
and an `Origin` matching `` `path` section at `MIGRATION_BASELINE` ``. An ID-addressed wrapper requires a
`Retired ID` equal to the heading ID and an `Original Kind` agreeing with the ID series. A name-addressed
wrapper forbids `Retired ID`.

After the field list, the parser skips one blank physical line if present. `bodyStart` is the following
line start. `bodyEnd` is the next `### ` heading start, or end of file for the last wrapper.

**The parser body includes the per-record separator bytes because the body ends at the next `###` heading.
The manifest pins those separator bytes as one LF, two LFs, or none. No Markdown horizontal-rule separator
is present or authorized.** Ten records pin one LF, E036 and E043b pin two LFs because their preserved
bodies do not end in LF, and final record E076 pins none.

### Current guard and Stage 2b authority

The current parser contains one additional name-addressed guard: if `Original Kind` is not `I` or `T`, it
emits `INVALID_FIELD_VALUE`. It therefore rejects all nine candidate name-addressed wrappers whose
historical `Original Kind` is `P` or `R`.

Amendment 4 Clause B §4.2 ratifies name-addressed wrappers with any historical `Original Kind` where no
identifier retires; §4.3 identifies removal of exactly this one guard as the implementation consequence.
The migration commission §5.3 delegates that removal to Stage 2b after the prescribed fixture pre-failure.
No other parser branch or reason code is authorized to change.

## 8. Wrapper/index/register reconciliation

The following table was derived from each M5.5 record and independently compared with the contiguous M5.6
index block using the parser's block-key and `markdownHeadingAnchor` algorithms.

| Record | Source | Addressing | Block identity | `Retired ID` | Index label / anchor |
|---|---|---|---|---|---|
| 01 | E032 | name | Most recent application of P27 and its rejected alternatives (2026-07-12 pass) | — | PASS / PASS |
| 02 | E036 | name | Forward case-generation lane lapse note (2026-07-18) | — | PASS / PASS |
| 03 | E039b | name | Lane-specific detail of P8 (forward case-generation pipeline) | — | PASS / PASS |
| 04 | E040 | ID | `P9#0` | P9 | PASS / PASS |
| 05 | E041 | ID | `P12#0` | P12 | PASS / PASS |
| 06 | E042 | ID | `P18#0` | P18 | PASS / PASS |
| 07 | E043b | ID | `P22#0` | P22 | PASS / PASS |
| 08 | E048 | name | CBC American-conventional unit ruling (superseded 2026-07-05) | — | PASS / PASS |
| 09 | E050 | name | Fishbone workflow-familiarity waiver (2026-07-06, superseded) | — | PASS / PASS |
| 10 | E051 | name | Withdrawn claim that vital sanity bounds pass every real value | — | PASS / PASS |
| 11 | E052 | name | Withdrawn governance-markdown encoding gate (2026-07-09) | — | PASS / PASS |
| 12 | E075 | name | Study-session distribution pointer to code | — | PASS / PASS |
| 13 | E076 | name | Session artifacts implemented-spec pointer list | — | PASS / PASS |

Derived totals and set checks:

- 13 wrappers, 13 labels, and 13 anchors; each set is internally unique.
- Four ID-addressed wrappers and nine name-addressed wrappers.
- Four `Retired ID` fields, exactly `P9`, `P12`, `P18`, and `P22`.
- No name-addressed label has a reserved `P<n> ` or `R<n> ` prefix.
- Wrapper/index block-key bijection: 13/13; expected labels: 13/13; anchor equality: 13/13.
- Six register rows: `P9`, `P12`, `P18`, and `P22` are `RETIRED`; `P13` and `P14` are
  `NEVER ASSIGNED` with em dashes in both date and pointer cells.
- The register's retired-ID set equals the wrapper `Retired ID` set.

## 9. Full 14-row slice/hash reproduction table

All slices below were freshly cut from
`git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md` using zero-based half-open byte offsets.
Expected values came from the live manifest; actual values were independently calculated from the Git
object. The final-byte column reports the actual byte.

| Record | Offset range | Expected length | Actual length | Expected SHA-256 | Actual SHA-256 | Final byte | Result |
|---|---:|---:|---:|---|---|---:|---|
| E032 | `[41665,42597)` | 932 | 932 | `ce225de0bc3b233986e8a968b54a1810f49defe82b5e190d10f9b7ab8d20174b` | `ce225de0bc3b233986e8a968b54a1810f49defe82b5e190d10f9b7ab8d20174b` | `0x0a` | PASS |
| E036 | `[50844,51342)` | 498 | 498 | `746a9c648223c2f2a0c1b1ce4c64ea1e62b4e12083f26fb1094a933f2b68a0b0` | `746a9c648223c2f2a0c1b1ce4c64ea1e62b4e12083f26fb1094a933f2b68a0b0` | `0x2e` | PASS |
| E039b | `[53661,54291)` | 630 | 630 | `781b8f8cde02d07338aebec48298d3833d2f8627d7780f8cd50587144d2c4d47` | `781b8f8cde02d07338aebec48298d3833d2f8627d7780f8cd50587144d2c4d47` | `0x0a` | PASS |
| E040 | `[54292,54790)` | 498 | 498 | `b5259fd359f139364f79de63a040c64cfe1fa499757b0d4df8de674904d3600b` | `b5259fd359f139364f79de63a040c64cfe1fa499757b0d4df8de674904d3600b` | `0x0a` | PASS |
| E041 | `[54791,55582)` | 791 | 791 | `b11d42ed7b9d1647f9987563eedee5e9c0a384082f05583a3be3701692054e19` | `b11d42ed7b9d1647f9987563eedee5e9c0a384082f05583a3be3701692054e19` | `0x0a` | PASS |
| E042 | `[55583,56120)` | 537 | 537 | `2d6de6b17fc06f5505faa09ddeeaabf5df78904f9ff7d2022d864ada7453d8eb` | `2d6de6b17fc06f5505faa09ddeeaabf5df78904f9ff7d2022d864ada7453d8eb` | `0x0a` | PASS |
| E043b | `[56121,56543)` | 422 | 422 | `4350881da63237d4c260d5a130132af3f45752231553050aad5fb8b8870b0a68` | `4350881da63237d4c260d5a130132af3f45752231553050aad5fb8b8870b0a68` | `0x2e` | PASS |
| E048 | `[62297,62907)` | 610 | 610 | `600ffba62e19db1e17e9d2eb8190ae2538135e63c88642fa27da7068fc274fa6` | `600ffba62e19db1e17e9d2eb8190ae2538135e63c88642fa27da7068fc274fa6` | `0x0a` | PASS |
| E050 | `[64005,64356)` | 351 | 351 | `55d77725bb717a2e6d740776c3156acbc4ca82440e20511f1ba3c4a6d5657438` | `55d77725bb717a2e6d740776c3156acbc4ca82440e20511f1ba3c4a6d5657438` | `0x0a` | PASS |
| E051 | `[64357,64837)` | 480 | 480 | `0e22abba431d56e29150e2dd3c5e609053b659adc1598904e9ee96b077338e27` | `0e22abba431d56e29150e2dd3c5e609053b659adc1598904e9ee96b077338e27` | `0x0a` | PASS |
| E052 | `[64838,66593)` | 1,755 | 1,755 | `d9e68b9dd5b29f17da155e2021b9b72da91172c677ce8cf445de48da676a4d76` | `d9e68b9dd5b29f17da155e2021b9b72da91172c677ce8cf445de48da676a4d76` | `0x0a` | PASS |
| E075 | `[75189,75483)` | 294 | 294 | `0755d97e56843a9d966093d7d5e63273592ae5f82a9d92e6b52db7748f2b848d` | `0755d97e56843a9d966093d7d5e63273592ae5f82a9d92e6b52db7748f2b848d` | `0x0a` | PASS |
| E076 | `[75484,76314)` | 830 | 830 | `3b4454aa392a128b3e074d570c7df0e50fe95927b01329936eabf0194b294039` | `3b4454aa392a128b3e074d570c7df0e50fe95927b01329936eabf0194b294039` | `0x0a` | PASS |
| E038 | `[52641,53203)` | 562 | 562 | `d5603bebbc00308c04f938279960c2873a849ae1c622419a7095c0bf3789c3cf` | `d5603bebbc00308c04f938279960c2873a849ae1c622419a7095c0bf3789c3cf` | `0x0a` | PASS |

Result: 14/14 lengths and hashes pass. E036 and E043b correctly end in `0x2e`; every other slice ends
in LF. E076 ends exactly at baseline EOF byte `76,314`.

## 10. Historical-kind review

The ratified definitions were applied literally:

- `P`: a durable governing rule capable of deciding future cases.
- `R`: a closed decision fixing particular values, dispositions, or scope.
- `I`: a categorical architectural property whose violation is a defect.
- `T`: an unsettled question with a named next action.

`I` was not treated as an implementation-pointer, index-row, or generic informational category.

| Record | Re-derived kind | Basis in the exact historical slice |
|---|---|---|
| E036 | `R` | It records the concrete retirement of a named generation pipeline and the disposition of specified conditional principles. It closes a particular lane; it is not a categorical architecture property. |
| E048 | `R` | The original text fixed WBC/platelet units to specified conventional labels and rejected SI labels. That is a concrete value/scope ruling, later superseded. |
| E050 | `R` | It records and then supersedes a specified fishbone waiver on specified grounds. The disposition is particular and closed. |
| E051 | `R` | It withdraws a specified claim about six non-temperature vital bounds and routes the remaining question to a named revisit entry. This is a concrete claim disposition. |
| E052 | `R` | It withdraws the proposed governance-Markdown encoding gate after specified scans and fixes a particular replacement control. It is a closed control decision. |
| E075 | `P` | This is the weakest call because the slice is a pointer-like appendix fragment. Nevertheless, it is subordinate to live P10 and states a durable canonical-ownership rule: distribution weights and sampler detail live only in code rather than being restated in prose. That future-facing ownership rule supports `P`. It is not equally defensible as `I`, because the slice is not written as a categorical architecture property whose violation is simply a defect. |
| E076 | `R` | It records the implemented disposition and surviving pointers for a specified list of session artifacts, including one specification for which no standalone file survives. Those are concrete artifact dispositions, so `R`; it is not an `I`. |

All seven manifest calls are supportable. None requires a manifest-byte revision.

## 11. Scope and authority review

- **Commission §4.7** governs the thirteen wrapper records and requires the addressing, exact wrapper/index
  text, source offsets, hashes, lengths, and boundary rationales pinned by M5.5. M5's per-record separator
  pin is an additional construction detail needed by the actual parser body boundary.
- **Commission §4.8** requires complete literal structural surfaces. For M5 that includes the target §8
  introduction, all thirteen archive-index lines, the retired register, and structural transition text
  outside entry blocks. M5.4, M5.6, and M5.7 cover these surfaces.
- **E038's original preservation obligation** is the phase-1 closure ruling §3 item 5: the displaced dated
  assignment prose must be preserved verbatim in the normalized archive and pointed at by migrated E038,
  with no archive-index row. Amendment 1 Clause A does not create that duty; it only resolves the Stage 2a
  sequencing exception allowing E038's `Evidence` to name the future Stage 2b archive path before that path
  exists and is tracked.
- **Amendment 4 Clause A** authorizes exactly one byte-identical preservation snapshot and requires target
  §8 to make the prior archive, normalized migration archive, and snapshot discoverable. That authority
  does not by itself prescribe every sentence of the normalized archive preamble.
- **Archive preamble authority and placement:** the preamble is migration-authored structural framing
  needed to build the normalized archive safely and to carry the separately required E038 preserved slice.
  It is outside all wrapper bodies because it precedes the first `###` wrapper heading. That placement is
  justified by the parser's body segmentation; placing prose between or after wrappers would absorb it into
  a hashed wrapper body. M5.0 records the architect's construction choice; it is not self-authorizing.

The authority chain is therefore coherent: the phase-1 closure ruling supplies the E038 preservation duty;
Amendment 4 supplies the one-time snapshot and disposition-keyed wrapper grammar; Amendment 1 supplies the
E038 path-timing exception; commission §§4.7–4.8 require the exact wrapper and structural surfaces; and the
Stage 2a architect manifest pins the migration-authored framing bytes for later owner ratification.

## 12. Findings by severity

| Class | Count | Findings |
|---|---:|---|
| BLOCKER | 0 | None. |
| REQUIRED REPAIR | 0 | None. |
| ADVISORY | 3 | See §13. |

## 13. Residual advisories

1. The first M5.8 bullet is reconstructed text. Its parser claim is substantively correct, but its exact
   pre-corruption bytes are unavailable and must not be described as byte-preserved.
2. E075 remains the least certain historical-kind call. `P` is supportable because the fragment is
   subordinate to P10 and carries a future-facing canonical-ownership rule; `I` is not an equally valid
   fallback under the ratified taxonomy.
3. The earlier Gemini Flash report and Claude Sonnet amendment are superseded by this final consolidated
   report. They should not be used as separate disposition authorities.

## 14. Exact next action

Retain `audit/decisions-migration-2026-07-29/target-text-manifest.md` unchanged at SHA-256
`e629c94f96f7dce16ffbf7756ae99383d4a4acc69614dd4d412e05ca25454698`, use this report as the durable final
cold-review evidence, and route those exact candidate bytes to the owner-ratification step required by the
migration commission. Do not begin Stage 2b merely from this review; Stage 2b remains gated on owner
ratification of the exact manifest bytes.

## 15. Final answer

**Is the repaired M5 safe to retain as the current Stage 2a candidate?**

**YES.**

No manifest byte change is required.
