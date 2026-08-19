# Stage 2b Phase 3 — normalized migration archive (commission §5.5)

**Date:** 2026-08-08 · **Revision:** 2 · **Seat issuing:** Architect · **Executing seat:** Codex

## 0. Identity, revision history, and immutability

**This order carries no hash slot by design.** Its authorized identity — byte length and SHA-256 — is measured externally by the owner and recorded in the resume note and Codex handoff in the form:

> Stage 2b Phase 3 work order revision 2 is authorized at `<length>` bytes / SHA-256 `<digest>`.

**This file is not edited after that measurement.** If non-author review finds a defect before external measurement, repair the unauthorized draft and advance the revision number if more than one byte state has carried the same revision label. If a defect is discovered after authorization, stop and return for a superseding instrument; do not repair this order in place.

**Revision history.** Revision 1 was the first drafted byte state. Before any external measurement or execution, the architect's own adversarial read found one precision defect in §6.3: it described all M5.6 wrapper/index correspondence as the "same label," although ID-addressed index labels intentionally omit the archive heading's em dash and use the grammar `<ID> <title>`. The same pre-hash pass also expanded abbreviated digest notation at execution-critical comparison points and clarified the preamble's terminal-LF wording. Because revision 1 had already existed on disk and been identified as the first Phase 3 draft, this corrected byte state advances to revision 2. No revision of this order has been externally measured, authorized, or executed.

---

## 1. Authority and scope

Stage 2a is closed by owner exact-byte ratification at `DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md`. Stage 2b Phase 1 is closed `ACCEPT` at `DECISIONS-MIGRATION-STAGE-2B-PHASE-1-CLOSEOUT-2026-08-08.md`. Stage 2b Phase 2 is closed `ACCEPT` at `DECISIONS-MIGRATION-STAGE-2B-PHASE-2-CLOSEOUT-2026-08-08.md`.

This order commissions **Phase 3 only**: commission §5.5, construction of the normalized migration archive. It authorizes no target `DECISIONS.md` construction under §5.6, no reconciliation-checker work under §5.7, no conformance wiring under §5.8, and no post-migration reference-graph work under §6.

The sole constitutional construction authority is the ratified manifest:

`audit/decisions-migration-2026-07-29/target-text-manifest.md`

at **`332579` bytes / SHA-256 `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2`**.

The manifest's stale opening `CANDIDATE, NOT RATIFIED` self-description is non-operative. The external owner ratification above fixes the exact-byte authority. **Do not edit the manifest to repair its banner.**

For this phase, the load-bearing manifest surfaces are M0.1 and M5.0–M5.5.13. M5.6 and M5.7 are read-only verification surfaces: they prove wrapper/index/register correspondence but are not written anywhere in Phase 3. Target §8 is Phase 4 output.

Where this order's checkpoint table and the ratified manifest disagree in any respect, **stop**. Do not choose one, repair one, or infer which was intended.

---

## 2. Seat and producer≠checker

Codex is the implementation producer under commission §5.1. Codex authors no archive wording, title, field value, date, source boundary, or separator choice. It mechanically constructs bytes already pinned by the ratified manifest.

The architect seat authored this order and adjudicates the returned receipt cold against live disk. Codex's own checks establish implementation feasibility and produce the required evidence; they do not substitute for architect adjudication.

Producer≠checker attaches to the producing seat, not to a model name.

---

## 3. Opening prerequisites

The executing seat re-measures every prerequisite from live disk before the first Phase 3 repository write.

Required state:

| item | required opening state |
|---|---|
| Branch | `codex/decisions-migration` |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| Staged paths | none |
| Modified tracked paths | exactly `lib/decisions-format.ts` and `scripts/tests/decisions-format.ts` |
| `lib/decisions-format.ts` | `47075` bytes / SHA-256 `10e59335d02eb90163b465570c4e467323d3ff9d224585774e264846590fe1e4` |
| `scripts/tests/decisions-format.ts` | `41335` bytes / SHA-256 `251b55697b202845e805201c7f972c54bac2688e9156b6ba598e11454a75d15f` |
| `DECISIONS.md` | `76314` bytes / SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` |
| Preservation snapshot | `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md`, `76314` bytes / SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` |
| Prior archive | `Archive/DECISIONS-ARCHIVE-2026-07-14.md`, `37094` bytes / SHA-256 `d311813aeca181da908ea33907fdb919385b2c8171afad0003c3389b40e067a7` |
| Ratified manifest | `332579` bytes / SHA-256 `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` |
| `MIGRATION_BASELINE` full SHA | `d499cc1d0916e03830489ec9cd0324cd1a203a73` |
| Phase 3 archive | `Archive/DECISIONS-ARCHIVE-2026-08-18.md` **absent** |
| Phase 3 report | `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-3-NORMALIZED-ARCHIVE-REPORT-2026-08-08.md` **absent** |

The two tracked source modifications and the untracked snapshot are accepted outputs of earlier phases and are expected. A third modified tracked path, any staged path, a missing snapshot, or any pinned-identity mismatch is a stop.

The untracked governance working set may grow as orders, closeouts, handoffs, and reports are added. Its count is context, not a prerequisite, provided no existing file is moved, deleted, or overwritten outside the allowlist.

---

## 4. Write allowlist, frozen at issue

Exactly two **repository** paths may be written in this phase:

1. `Archive/DECISIONS-ARCHIVE-2026-08-18.md` — the normalized migration archive.
2. `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-3-NORMALIZED-ARCHIVE-REPORT-2026-08-08.md` — the Phase 3 receipt.

**No other repository path may be written, created, moved, renamed, deleted, staged, reverted, or committed.**

Ephemeral files and scripts under the OS temporary directory are permitted for byte slicing, construction, hashing, parsing, and independent verification. They are not branch outputs and must not be created inside the repository.

Protected surfaces include, without limitation:

- `DECISIONS.md`;
- the ratified manifest;
- the Phase 2 snapshot;
- `Archive/DECISIONS-ARCHIVE-2026-07-14.md`;
- both Phase 1 source files;
- package/workflow files;
- every prior order, closeout, handoff, receipt, and frozen artifact.

No commit and no push.

---

## 5. Baseline and manifest checkpoints

### 5.1 Resolve the baseline independently

Read the committed migration commission and resolve its abbreviated `MIGRATION_BASELINE` declaration to one full commit SHA. Print the full SHA and require exact equality to:

`d499cc1d0916e03830489ec9cd0324cd1a203a73`

Never pass an abbreviated token or the symbolic text `MIGRATION_BASELINE` as the Git object argument. Every source slice in this phase comes from:

`git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md`

Materialize that complete object in an ephemeral file outside the repository and verify it measures `76314` bytes / SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` before using any offset.

### 5.2 Verify the ratified manifest before consuming it

Freshly measure the live manifest and require exact identity `332579` bytes / SHA-256 `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2`. Then read M0.1 and M5.0–M5.5.13 from that live file. Confirm the M0.1 normalized archive filename is exactly:

`Archive/DECISIONS-ARCHIVE-2026-08-18.md`

No review receipt, frozen partial snapshot, candidate-regions file, live-source packet, or prior draft is construction authority. Those files may be used only for independent cross-checks after the manifest-derived construction plan is fixed.

### 5.3 Fourteen source-slice checkpoints

Before constructing any archive candidate, reproduce all fourteen source slices independently from the full baseline object and compare each against the live manifest pins. The table below is a checkpoint copied from the ratified M5 records; it is **not** a substitute for reading those records.

| unit | source span | bytes | SHA-256 | separator after preserved body |
|---|---:|---:|---|---|
| E038 displaced prose | `[52641,53203)` | 562 | `d5603bebbc00308c04f938279960c2873a849ae1c622419a7095c0bf3789c3cf` | n/a — preamble insertion |
| E032 | `[41665,42597)` | 932 | `ce225de0bc3b233986e8a968b54a1810f49defe82b5e190d10f9b7ab8d20174b` | 1 LF |
| E036 | `[50844,51342)` | 498 | `746a9c648223c2f2a0c1b1ce4c64ea1e62b4e12083f26fb1094a933f2b68a0b0` | 2 LFs |
| E039b | `[53661,54291)` | 630 | `781b8f8cde02d07338aebec48298d3833d2f8627d7780f8cd50587144d2c4d47` | 1 LF |
| E040 / P9 | `[54292,54790)` | 498 | `b5259fd359f139364f79de63a040c64cfe1fa499757b0d4df8de674904d3600b` | 1 LF |
| E041 / P12 | `[54791,55582)` | 791 | `b11d42ed7b9d1647f9987563eedee5e9c0a384082f05583a3be3701692054e19` | 1 LF |
| E042 / P18 | `[55583,56120)` | 537 | `2d6de6b17fc06f5505faa09ddeeaabf5df78904f9ff7d2022d864ada7453d8eb` | 1 LF |
| E043b / P22 | `[56121,56543)` | 422 | `4350881da63237d4c260d5a130132af3f45752231553050aad5fb8b8870b0a68` | 2 LFs |
| E048 | `[62297,62907)` | 610 | `600ffba62e19db1e17e9d2eb8190ae2538135e63c88642fa27da7068fc274fa6` | 1 LF |
| E050 | `[64005,64356)` | 351 | `55d77725bb717a2e6d740776c3156acbc4ca82440e20511f1ba3c4a6d5657438` | 1 LF |
| E051 | `[64357,64837)` | 480 | `0e22abba431d56e29150e2dd3c5e609053b659adc1598904e9ee96b077338e27` | 1 LF |
| E052 | `[64838,66593)` | 1755 | `d9e68b9dd5b29f17da155e2021b9b72da91172c677ce8cf445de48da676a4d76` | 1 LF |
| E075 | `[75189,75483)` | 294 | `0755d97e56843a9d966093d7d5e63273592ae5f82a9d92e6b52db7748f2b848d` | 1 LF |
| E076 | `[75484,76314)` | 830 | `3b4454aa392a128b3e074d570c7df0e50fe95927b01329936eabf0194b294039` | none |

Required mechanical facts from M5.1:

- the wrapper order is exactly E032, E036, E039b, E040, E041, E042, E043b, E048, E050, E051, E052, E075, E076;
- exactly two bodies — E036 and E043b — lack a final LF and therefore take two separator LFs;
- ten other non-final wrappers take one separator LF;
- E076 takes no external separator and its body-owned final LF is the archive file's final byte;
- separator bytes are outside the pinned source-body length and hash, but the archive parser's `body` includes them because it slices through the byte before the next `###` heading.

Any length, hash, order, final-byte, or separator disagreement is a stop before construction.

---

## 6. Exact archive construction contract

### 6.1 Preamble

The archive begins with the exact M5.2 fenced `markdown` bytes from the ratified manifest. The directive line

`<<E038-PRESERVED-SLICE>>`

is a deterministic byte-insertion directive, not output text. Replace the **complete directive line including its terminating LF** with the exact 562-byte E038 slice `[52641,53203)`, which itself ends in LF. Preserve the surrounding blank lines exactly as M5.2 pins them. Do not emit the directive token into the archive.

The resulting preamble starts:

`# DECISIONS archive — 2026-08-18 cleanup migration`

and ends with the line `## Archived entries` followed by exactly one LF, immediately before the first wrapper heading. Do not add a wrapper around E038. E038 produces no `###` heading, no metadata fields, no retired-register row, and no archive-index line.

Before any repository write, verify that the candidate's bytes between the M5.2 framing paragraph and `## Archived entries`, excluding the framing blank lines as M5.3 defines, equal the exact 562-byte slice and hash to `d5603bebbc00308c04f938279960c2873a849ae1c622419a7095c0bf3789c3cf`.

### 6.2 Thirteen wrappers

After the preamble, append the thirteen M5.5 wrappers in M5.1 order. For each wrapper, write only bytes pinned by its live manifest record:

1. exact item-3 `###` heading line;
2. one blank line;
3. exact item-4 field lines in their listed order, each on one physical line;
4. one blank line;
5. exact baseline body bytes from items 9–11;
6. exact item-13 separator bytes.

Do not derive headings from source prose, infer fields from parser behavior, normalize body text, reflow lines, repair punctuation, trim whitespace, add provenance prose, or generate dates from the filename. The manifest already made every such choice.

Checkpoint metadata that must agree with the live manifest:

| wrapper | addressing | Date | Original Kind | Original Status | Retired ID | Origin section |
|---|---|---|---|---|---|---|
| E032 | name | 2026-08-18 | P | ACTIVE | absent | §4 |
| E036 | name | 2026-08-18 | R | ACTIVE | absent | §5 |
| E039b | name | 2026-08-18 | P | CONDITIONAL | absent | §5 |
| E040 | ID P9 | 2026-07-28 | P | CONDITIONAL | P9 | §5 |
| E041 | ID P12 | 2026-07-28 | P | CONDITIONAL | P12 | §5 |
| E042 | ID P18 | 2026-07-28 | P | CONDITIONAL | P18 | §5 |
| E043b | ID P22 | 2026-07-28 | P | CONDITIONAL | P22 | §5 |
| E048 | name | 2026-08-18 | R | SUPERSEDED | absent | §8 |
| E050 | name | 2026-08-18 | R | SUPERSEDED | absent | §8 |
| E051 | name | 2026-08-18 | R | SUPERSEDED | absent | §8 |
| E052 | name | 2026-08-18 | R | SUPERSEDED | absent | §8 |
| E075 | name | 2026-08-18 | P | ACTIVE | absent | Reference appendices |
| E076 | name | 2026-08-18 | R | ACTIVE | absent | Reference appendices |

Every wrapper also carries exactly `Kind: X`, `Status: SUPERSEDED`, and `Force: HISTORICAL`. Every `Origin` line uses the parser-required manifest literal shape:

`` `DECISIONS.md` <section> at `MIGRATION_BASELINE` ``

The four ID-addressed wrappers are exactly P9, P12, P18, and P22. The other nine are name-addressed and must not carry `Retired ID`.

### 6.3 No target §8 write in this phase

M5.6 and M5.7 are **verification inputs only** in Phase 3. Do not write their archive-index lines or retired-register rows into any repository file except the Phase 3 report as quoted evidence. `DECISIONS.md` remains untouched.

For each candidate wrapper, verify that exactly one M5.6 index record in the ratified manifest has the addressing-specific identity required by the grammar and points to:

`Archive/DECISIONS-ARCHIVE-2026-08-18.md#<that wrapper's manifest-pinned anchor>`

For a **name-addressed** wrapper, the M5.6 label equals `wrapper.title` byte-for-byte. For an **ID-addressed** wrapper, the M5.6 label is `<ID> <wrapper.title>` — the identifier, one ASCII space, then the title — while the archive heading itself is `### <ID> — <title>`; the index label therefore intentionally contains no em dash. Its parsed identity must join to the same `<ID>#0` wrapper. **Do not require literal heading/index-label equality for P9, P12, P18, or P22.**

The 13-to-13 bijection must be exact. E038 has no M5.6 line. This is a manifest-to-archive verification, not live target conformance.

---

## 7. Pre-write candidate verification

Construct the complete archive first as an ephemeral file outside the repository. **Do not create the repository archive until every check below passes.**

The Phase 3 report is the first permitted repository write: after the opening measurement, create its skeleton and record the opening state. The archive itself is written only after the candidate passes this section.

Required candidate checks:

1. **Strict UTF-8:** complete candidate decodes strictly.
2. **Final byte:** exactly `0x0a` and owned by E076's preserved source slice; no extra byte follows it.
3. **Archive parser:** using the current accepted `lib/decisions-format.ts`, call `parseArchiveDocument` on the candidate. Require `issues.length === 0` and `wrappers.length === 13`.
4. **Wrapper order and identity:** parsed wrapper keys, addressing modes, titles/IDs, and field values match manifest M5.5.1–M5.5.13 exactly and in order.
5. **Per-wrapper body proof:** for each parsed wrapper, require:
   - parsed-body byte length = pinned source length + pinned separator length;
   - the first pinned source-length bytes hash to that wrapper's pinned SHA-256;
   - the suffix equals exactly the pinned separator (`\n`, `\n\n`, or empty).
6. **E038 proof:** exact 562-byte slice appears exactly once at the M5.2 position and hashes to `d5603bebbc00308c04f938279960c2873a849ae1c622419a7095c0bf3789c3cf`; it is outside all parsed wrappers.
7. **Preamble proof:** all migration-authored preamble bytes outside the inserted E038 slice equal M5.2 exactly; the literal directive token occurs zero times in candidate output.
8. **Wrapper population:** exactly 4 ID-addressed wrappers and 9 name-addressed wrappers; retired IDs exactly `{P9,P12,P18,P22}`; zero `Retired ID` fields on name-addressed wrappers.
9. **Manifest M5.6 bijection:** each of the 13 wrappers has exactly one corresponding manifest archive-index line and pointer under the addressing-specific rule in §6.3; name-addressed labels equal wrapper titles, while ID-addressed labels use `<ID> <title>` and join by ID to the same `<ID>#0` wrapper. There is no fourteenth wrapper or index line, and E038 has none.
10. **No protected-surface dependency:** candidate construction used only the full baseline Git object plus ratified manifest bytes. The working-tree `DECISIONS.md`, snapshot, review receipts, and July 14 archive were not used as source material.

Record the candidate's complete byte length and SHA-256 after all checks pass. There is no pre-authorized whole-file digest: the archive is deterministically assembled from manifest-pinned parts, and this candidate identity becomes the null for repository write/read-back equality.

Do not use `checkDecisionsFormat` with the current legacy `DECISIONS.md` and this archive. The target `DECISIONS.md` does not exist yet, so a full conformance join at this phase would compare different document generations and is outside the commission. Phase 3 uses `parseArchiveDocument` plus the manifest M5.6 bijection only.

---

## 8. Repository write and read-back verification

After §7 passes, write the ephemeral candidate byte-for-byte to:

`Archive/DECISIONS-ARCHIVE-2026-08-18.md`

Use a raw binary copy or equivalent byte-preserving operation. Do not route the archive through an editor, formatter, Markdown serializer, template engine, or text-normalizing write path.

Then read the repository file back from disk and require all of the following:

1. byte length equals the ephemeral candidate length;
2. SHA-256 equals the ephemeral candidate SHA-256;
3. `cmp` between ephemeral candidate and repository file exits `0` with no output;
4. a fresh `parseArchiveDocument` run again returns 13 wrappers and zero issues;
5. the complete per-wrapper body/separator proof from §7 passes again on the live file;
6. the E038/preamble proof from §7 passes again on the live file;
7. the M5.6 wrapper/index bijection passes again against the still-unchanged ratified manifest.

A write is not evidence of itself. The report records these **read-back** measurements and parser results, not merely the candidate checks performed before the write.

---

## 9. Unchanged surfaces and closing state

After the live read-back passes, freshly re-measure:

- `DECISIONS.md` — still `76314` bytes / SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`;
- `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` — still `76314` bytes / SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`;
- `Archive/DECISIONS-ARCHIVE-2026-07-14.md` — still `37094` bytes / SHA-256 `d311813aeca181da908ea33907fdb919385b2c8171afad0003c3389b40e067a7`;
- ratified manifest — still `332579` bytes / SHA-256 `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2`;
- `lib/decisions-format.ts` — still `47075` bytes / SHA-256 `10e59335d02eb90163b465570c4e467323d3ff9d224585774e264846590fe1e4`;
- `scripts/tests/decisions-format.ts` — still `41335` bytes / SHA-256 `251b55697b202845e805201c7f972c54bac2688e9156b6ba598e11454a75d15f`.

Re-record branch, HEAD, staged paths, tracked modified paths, and porcelain status. Require branch and HEAD unchanged, nothing staged, no commit, and no repository write outside §4.

The new normalized archive and Phase 3 report are expected untracked outputs. The accepted snapshot remains untracked. The only modified tracked files remain the two Phase 1 source files.

---

## 10. Stop conditions

Stop and return to the architect seat with the report documenting the state reached if any of these occurs:

1. This work order's externally authorized byte length or SHA-256 does not reproduce exactly at execution opening.
2. Any §3 prerequisite diverges: wrong branch or HEAD, anything staged, a third modified tracked path, a pinned file identity mismatch, missing snapshot, or pre-existing Phase 3 output path.
3. The full baseline SHA cannot be independently resolved to exactly `d499cc1d0916e03830489ec9cd0324cd1a203a73`, or its `DECISIONS.md` object is not `76314` bytes / SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`.
4. The ratified manifest is not exactly `332579` bytes / SHA-256 `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2`.
5. This order's checkpoint table and live manifest M5 disagree in any respect.
6. Any E038 or wrapper source slice fails its manifest-pinned span, length, SHA-256, final-byte, or separator expectation.
7. Exact archive construction would require a wording, title, field, date, boundary, order, separator, or framing choice not literally pinned by M5.
8. The pre-write candidate fails any §7 check.
9. The live repository archive differs byte-for-byte from the accepted ephemeral candidate or fails any §8 check.
10. Any protected surface changes or any work would require a repository write outside §4.

A stop is a successful control when its condition is met. Do not repair manifest bytes, widen the allowlist, substitute a derivative source, or make an "obvious" construction choice after a stop.

---

## 11. What this order does not authorize

- Any edit to the ratified manifest.
- Any edit to `DECISIONS.md` or construction of target §§1–8.
- Any edit to the preservation snapshot or July 14 archive.
- Any parser, fixture, reconciliation-script, package, workflow, graph, bank, schema, renderer, runtime, or project-history change.
- Any target §8 archive-index or retired-register write.
- Any full target/archive conformance join against legacy `DECISIONS.md`.
- Any commit, push, branch operation, stash, reset, cleanup, or staging action.
- Any semantic review or migration disposition by Codex.

---

## 12. Deliverable

Exactly one Phase 3 report path:

`audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-3-NORMALIZED-ARCHIVE-REPORT-2026-08-08.md`

The report is created as the first Phase 3 repository write after opening measurements and is closed only after all work stops or completes. It contains, in order:

1. **Authorization identity:** work-order revision, independently measured byte length and SHA-256.
2. **Opening measurement:** branch, HEAD, complete staged/tracked state, and every §3 pinned identity.
3. **Baseline resolution and object measurement:** exact commands and full SHA.
4. **Manifest measurement:** exact identity and M0.1 filename confirmation.
5. **Fourteen-slice proof table:** source span, measured length, measured SHA-256, final-byte fact where relevant, and comparison to manifest; all 14 must be individually reported.
6. **Construction procedure:** exact ephemeral method used, including how the M5.2 directive line was replaced by E038 bytes and how wrapper separators were emitted.
7. **Pre-write candidate identity:** complete byte length and SHA-256.
8. **Pre-write parser and structural results:** wrapper count/issues, ordered wrapper identities, 4-ID/9-name split, retired-ID set, E038 proof, preamble proof, and M5.6 bijection.
9. **Per-wrapper preservation table:** parsed-body length, source-prefix hash result, exact separator suffix result for all 13 wrappers.
10. **Repository write/read-back:** exact write command or operation, live archive byte length/SHA-256, `cmp` result against candidate, fresh parser result, repeated preservation/E038/preamble/bijection results.
11. **Unchanged surfaces:** every §9 protected identity freshly re-measured.
12. **Closing repository state:** branch, HEAD, staged/tracked/untracked authorized outputs, no commit/push, and allowlist conformance.
13. **Overall disposition:** exactly one of `PASS`, `STOPPED`, or `FAIL`, with one sentence naming the governing reason.

Raw command output may be fenced or summarized into exact measured tables where the table preserves every required value. A required failed check must not be omitted merely because execution stopped before later steps.

---

## 13. Architect adjudication

On return, the architect seat reads the report cold, independently inspects the live archive and repository state, and checks the construction against the ratified manifest rather than accepting the producer's summary.

Phase 3 closes only on architect `ACCEPT`. Phase 4 (commission §5.6, target `DECISIONS.md` construction) is not commissioned until that acceptance is recorded.
