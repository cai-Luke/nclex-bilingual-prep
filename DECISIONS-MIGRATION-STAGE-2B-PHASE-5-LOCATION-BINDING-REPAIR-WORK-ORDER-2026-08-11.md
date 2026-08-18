# Stage 2b Phase 5 — location-binding repair (narrow)

**Date:** 2026-08-11 · **Revision:** 1 · **Seat issuing:** Architect · **Executing seat:** Codex

**Disk provenance.** The architect authored the operative inline draft. At owner direction, the GPT disk seat assembled this candidate on live disk and folded in bounded pre-freeze corrections derived from the accepted non-author review and `AGENTS.md`. This does not transfer the issuer role: the architect must accept the exact frozen identity before issuing the Codex handoff.

## 0. Identity, revision history, and immutability

**This order carries no hash slot by design.** A hash written into the document it describes cannot describe that document's current bytes. Its authorized identity is measured externally by the owner and recorded in the owner acknowledgment, the resume note, and the Codex handoff, in the form:

> Stage 2b Phase 5 location-binding repair order revision 1 is authorized at `<length>` bytes / SHA-256 `<digest>`.

**This file is not edited after that measurement.** Revision 1 is the first byte state to carry this label.

## 1. Authority and forcing incident

Stage 2b Phase 5 executed under `DECISIONS-MIGRATION-STAGE-2B-PHASE-5-RECONCILIATION-CHECKER-WORK-ORDER-2026-08-11.md` revision 2 (`33073` bytes / SHA-256 `75cc6db647afd6f8e6e0950ac885ba5c7b225489bb73b03236d81f3eca66ceac`) and returned `PASS` at `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-TARGET-RECONCILE-REPORT-2026-08-11.md`. Independent non-producer review returned `REVISE`. The architect seat adjudicated both findings cold against live disk and confirmed both. Phase 5 is **not closed**; this order repairs it.

**Finding A — structural surfaces are verified by global occurrence, not at their governed location.** The Phase 5 order required the checker to verify each of the eight Amendment 2 surfaces present in target `DECISIONS.md` byte-for-byte against ratified Amendment 2 §2's fenced payloads. The implemented predicate uses global occurrence counting, which establishes only that an expected payload occurs somewhere in the document. A mutation of a governed surface accompanied by insertion of the pristine payload elsewhere can therefore pass. The same location-blind pattern governs manifest M5.4 `E053` and M5.6 archive-index verification. Three of the eight Amendment 2 surfaces — the §3 table header, separator, and declared-total line — retain incidental location-bound parser cover, but that incidental cover is not a substitute for the authority-specific assertion. The §3 introduction, the four §§4–7 heading/transition surfaces, target §8's structural introduction, and the M5.6 archive-index block require explicit location-bound equality.

**Finding B — Step 6 did not establish the required untracked-set delta.** Step 6 required no untracked path added beyond the two authorized Phase 5 outputs and none removed. The receipt's evidence used default `git status --porcelain`, which collapses a wholly-untracked directory into one entry. `audit/decisions-migration-2026-07-29/` is wholly untracked, so file-level additions or removals beneath it were not observable. The prior receipt therefore does not prove the exact opening-to-closing untracked-file delta it claims.

**Authority is unchanged.** The ratified Stage 2a manifest, ratified Amendment 2, ratified Amendment 3, ratified Amendment 4, the Phase 5 revision-2 work order, and all previously accepted Phase 1–4 outputs retain exactly their existing authority and scope. This order amends nothing, ratifies nothing, and pins no new target byte. It repairs checker logic and the evidence method used to prove repository-state preservation.

### 1.1 Location-binding invariant — binding on every assertion this order adds

> **Authority payloads define the expected bytes. Independent target structure defines where those bytes must occur. A governed surface is never located by searching the target for the payload that surface is supposed to contain.**

An assertion that searches the target for its own expected payload proves only that the payload exists somewhere. Global exact-occurrence uniqueness may remain as an **additional** assertion. It may never be the location proof and may never be the sole assertion for a governed surface.

The location mechanism must remain independent from the expected bytes. In particular, an expected heading, table literal, transition paragraph, E053 payload, or archive-index payload may not be used as the search key that discovers its own governed target location.

## 2. Seat and producer≠checker

Codex is the implementation producer and authors executable checker logic only. This repair writes no byte into `DECISIONS.md`, either archive file, the manifest, any amendment, `package.json`, the Phase 5 revision-2 work order, or the original Phase 5 receipt. An ambiguity is a stop condition (§7), never an inference.

Codex produced the checker being repaired. Codex's reruns discharge implementation feasibility and the repair order's own regression requirements only. They cannot satisfy the Phase 5 order §9 independent-execution requirement. See §9.

## 3. Frozen prerequisites and opening state

At issue, the branch is `codex/decisions-migration`, HEAD is `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`, nothing is staged, and exactly four tracked paths are modified:

- `DECISIONS.md`
- `lib/decisions-format.ts`
- `scripts/tests/decisions-format.ts`
- `package.json`

The following accepted identities and sizes govern this repair:

| item | frozen / expected state |
|---|---|
| Phase 5 revision-2 work order | `33073` bytes / SHA-256 `75cc6db647afd6f8e6e0950ac885ba5c7b225489bb73b03236d81f3eca66ceac` |
| `DECISIONS.md` | `56964` bytes / SHA-256 `3dc5dbc0c6acbfe4f74fa353b80d53c7feeec4f5ada0a42d7b9773f26c26f4a8` |
| `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` | `76314` bytes; exact equality to `MIGRATION_BASELINE` remains a Phase 5 requirement |
| `Archive/DECISIONS-ARCHIVE-2026-08-18.md` | `13997` bytes / SHA-256 `e75e979ea121fa1a697861f8de4a4527f07ef2d8b7ed1f4d299bf504163e873c` |
| Ratified Stage 2a manifest | `332579` bytes / SHA-256 `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` |
| Ratified Amendment 2 | revision 3, `24202` bytes / SHA-256 `4cb16995cf8810bcf3ee65ffb07dc32a14a4fb5b0c4adc8ba5bbb2a2a535e9f4` |
| Ratified Amendment 3 | revision 4, `26963` bytes / SHA-256 `9a1a3a898bf847d8dbe760c7aba702f3a3c3c3381c760bba989ffa5b8542944e` |
| Ratified Amendment 4 | `DECISIONS-ARCHIVE-PRESERVATION-AND-WRAPPER-ADDRESSING-AMENDMENT-2026-07-29.md`, `22665` bytes; ratified §6 governs E053 classification |
| `package.json` | `8542` bytes; Phase 5 script key already present; **read-only in this repair** |
| `scripts/decisions-migration-target-reconcile.ts` | `35743` bytes at repair issue; existing Phase 5 implementation and sole executable write target |
| Original Phase 5 receipt | `14247` bytes; preserved unchanged as the contemporaneous defective receipt |
| Frozen historical checker | `scripts/decisions-migration-reconcile.ts`, `20631` bytes; unchanged |
| Frozen Phase-1 source artifacts | `inventory.md` `28554`; `migration-table.md` `16833`; `outline-before-after.md` `9878` |

Step 1 must confirm these facts from live disk before implementation. A divergence from a frozen identity, an unexpected staged path, or a fifth modified tracked path is a stop.

**Untracked state is not pinned here by count.** A prior architect census observed 71 file-level untracked paths before this order itself existed. That number is orientation only and is expected to become stale as governance artifacts are written. Step 1 captures the operative opening set after this order and its handoff exist. Exact path-set identity, not cardinality, governs Step 7.

## 4. Write allowlist, frozen at issue

Exactly two repository paths may be written in this repair:

1. `scripts/decisions-migration-target-reconcile.ts` — modified.
2. `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-REPORT-2026-08-11.md` — new; the deliverable at §8.

**No other repository path may be written, created, moved, renamed, or deleted.** In particular, `package.json` is already correct and read-only; the original Phase 5 receipt is preserved unchanged; `DECISIONS.md`, both archive files, the manifest, all amendments and ratifications, all frozen Phase-1 artifacts, `lib/decisions-format.ts`, `scripts/tests/decisions-format.ts`, and `scripts/decisions-migration-reconcile.ts` are read-only inputs.

Ephemeral writes outside the repository for negative-control fixtures are permitted and are not branch outputs. Remove them when the repair completes.

No staging, commit, push, branch operation, or pull-request action is authorized.

## 5. Execution sequence

### Step 1 — opening measurement and file-level repository census

Before the first repository write of this repair:

1. Confirm branch, HEAD, staged state, and the four modified tracked paths against §3.
2. Measure the byte length and SHA-256 of every frozen file identity in §3 for which a digest is supplied, and byte length for the remaining size-pinned inputs. Any mismatch is a stop.
3. Read `scripts/decisions-migration-target-reconcile.ts` in full.
4. Read ratified Amendment 2 §2, ratified Amendment 4 §6, manifest M5.4, and manifest M5.6 directly.
5. Read the relevant exports in `lib/decisions-format.ts`; do not assume an API from this order's prose.
6. Capture the complete file-level working-tree state using exactly:

```bash
git status --porcelain=v1 --untracked-files=all
```

Record the **complete verbatim output** in memory or an external scratch location before creating the repair report. The exact path/status lines are the opening baseline. Record the untracked-path count only as a secondary diagnostic; equal counts never prove equal sets.

The repair report itself is the **first repository write** of this phase. Immediately after the opening census, create the report and record the opening measurement and complete census there before modifying the checker.

Default `git status --porcelain` without `--untracked-files=all` must not be used as Step 1 or Step 7 evidence.

### Step 2 — implement an independent structural locator

Modify only `scripts/decisions-migration-target-reconcile.ts`.

Do **not** modify `lib/decisions-format.ts` to obtain structural spans. `sectionByLine()` is private, and parser-source modification is outside §4. Implement a small local raw-text structural slicer in the Phase 5 checker instead, using parser-exposed line numbers where they exist.

The public parser result exposes `LiveEntry.section`, `LiveEntry.line`, `EntryIndexRow.line`, `EntryIndex.declaredTotalLine`, and `ArchiveIndexLine.line`; use those rather than re-deriving information the parser already exposes.

#### 2.1 Physical-line representation

Build one local physical-line representation of `targetText` that preserves exact line content and supports 1-based line addressing. It may track character offsets internally, but the compared target payload must be reconstructed without trimming or line-ending normalization. The canonical target uses LF line endings; if a scratch target supplied to the checker contains CRLF or malformed line endings, exact comparison must fail rather than silently normalize them.

#### 2.2 Top-level section locator

Independently scan physical target lines for the parser-equivalent section shape:

```text
^## (\d+)(?:\.|\s|$)
```

Require sections 3, 4, 5, 6, 7, and 8 each to have exactly one matching top-level heading. Zero or multiple matches for any required section are checker failures. The expected Amendment 2 or manifest heading payload must not be used to locate the line.

#### 2.3 Helper semantics

Implement local helpers whose behavior is explicit and testable:

- `line(n)` returns the exact physical contents of 1-based line `n`, excluding only its LF terminator.
- `sliceLines(start, end)` returns lines `start..end` inclusive joined by exactly `\n`, with no leading/trailing normalization.
- `lastNonBlankBefore(n, floor)` walks backward from `n - 1` to `floor` using blankness only to determine the boundary; it does not alter any included line.
- Every derived line number must be range-checked before slicing. Invalid or inverted boundaries are failures, never empty-string fallbacks.

The helper names are illustrative; equivalent local code is permitted if and only if it has the same semantics.

### Step 3 — repair location-bound equality for all ten governed non-block surfaces

Every surface below is located from independent target structure and compared with `===` to its authority payload.

| surface | authority | independent target extraction |
|---|---|---|
| §3 introduction | Amendment 2 §2.1 | unique §3 heading through the last nonblank line strictly before `parsed.index.rows[0].line - 2` |
| §3 table header | Amendment 2 §2.2 | exact physical line at `parsed.index.rows[0].line - 2` |
| §3 separator | Amendment 2 §2.2 | exact physical line at `parsed.index.rows[0].line - 1` |
| §3 declared total | Amendment 2 §2.2 | exact physical line at `parsed.index.declaredTotalLine` |
| §4 heading/transition | Amendment 2 §2.3 | unique §4 heading through the last nonblank line strictly before the minimum `entry.line` for `entry.section === 4` |
| §5 heading/transition | Amendment 2 §2.3 | unique §5 heading through the last nonblank line strictly before the minimum `entry.line` for `entry.section === 5` |
| §6 heading/transition | Amendment 2 §2.3 | unique §6 heading through the last nonblank line strictly before the minimum `entry.line` for `entry.section === 6` |
| §7 heading/transition | Amendment 2 §2.3 | unique §7 heading through the last nonblank line strictly before the minimum `entry.line` for `entry.section === 7` |
| §8 structural introduction / E053 | manifest M5.4 | unique §8 heading through the last nonblank line strictly before `parsed.archiveIndex[0].line` |
| §8 archive-index block | manifest M5.6 | `parsed.archiveIndex[0].line` through `parsed.archiveIndex[12].line + 1`, inclusive |

#### 3.1 Required preconditions

Each missing prerequisite is a named checker failure rather than a skipped assertion:

- `parsed.index.rows.length > 0`.
- `parsed.index.rows[0].line - 2` is strictly after the unique §3 heading.
- `parsed.index.declaredTotalLine` is defined, in range, and after the parsed index body.
- Each of sections 4–7 has at least one parsed entry and all entries used to derive the first-entry boundary report their expected section number.
- `parsed.archiveIndex.length === 13`.
- The 13th archive-index label has a following physical line available for its pointer.
- Every boundary is ordered and in range.

Do not derive a fallback location from an expected authority string when any prerequisite fails.

#### 3.2 Exact comparison discipline

The authority extractors already produce expected fenced payload strings. Once the target surface boundary is fixed independently, compare the target surface and expected payload using exact string equality.

Do not call `.trim()`, `.trimEnd()`, whitespace collapsing, line-ending normalization, Markdown normalization, or any generic cleanup on either side of the comparison. Boundary detection may skip separator blank lines because those blank lines are Amendment 3 join bytes; the selected surface itself is not normalized.

For single-line §3 surfaces, compare the physical line itself, not a substring discovered with `indexOf`.

#### 3.3 Banned location mechanisms

None of the following may determine where a governed surface is located:

- `indexOf`, `includes`, regex search, `countOccurrences`, or any other search of target text for the payload being verified;
- searching the target for the expected §3 table header or separator literals to find their own location;
- searching for an expected Amendment 2 section heading or manifest heading to find its own surface;
- accepting a global occurrence count as the sole evidence for a surface.

Retain the existing global exact-occurrence uniqueness assertions **after** location-bound equality as independent duplicate-detection assertions. They are no longer sufficient as location proofs, but they remain part of the established gate's default behavior and provide the discriminating PASS condition for compensated-relocation controls 6–8.

#### 3.4 Reporting

Keep the existing report architecture and eight numbered reconciliation reports unchanged. Keep a separate Amendment 2 structural-surface verification and Amendment 4 / manifest-§8 verification.

On failure, name each specific structural surface that disagrees with its authority payload. The Amendment 3 scope statement remains unchanged: this repair does not claim manifest or Amendment 2 ownership of join bytes.

### Step 4 — repair the dead E053 shape assertion

The current archive-index-shape assertion inspects the manifest-derived `e053Payload`, making the assertion incapable of detecting a malformed target and causing its message to attribute a manifest property to target §8.

Repair it so that the assertion inspects the **extracted target §8 structural introduction** from Step 3 and fails if any physical line of that extracted target surface begins with `- **`.

This shape assertion is additional to, not a replacement for, exact M5.4 location-bound equality.

### Step 5 — run constitutional and canonical verification

This is an established maintenance/migration checker, so `AGENTS.md`'s audit/maintenance-tooling floor applies in addition to the Phase 5-specific commands. Run exactly:

1. `npx tsc -b --pretty false`
2. `npm run reconcile:decisions-migration`
3. `npm run reconcile:decisions-migration-target`

All three must pass on canonical repository inputs. Record full verbatim output in the repair report. The negative-control matrix in Step 6 is the focused behavioral test surface for the changed checker.

**Established-gate default-output proof.** Before implementation, extract the prior canonical zero-argument `npm run reconcile:decisions-migration-target` transcript from the preserved original Phase 5 receipt. After the repaired canonical run, compare the new command output **byte-for-byte** with that preserved transcript, including the eight numbered report lines, the Amendment 2 line, the Amendment 3 scope line, the Amendment 4 line, and the final pass line. The repaired checker adds stronger internal predicates but must not change the established zero-argument success output. Record the comparison result in the repair report. Any byte divergence is a stop and returns to the architect for adjudication; do not normalize, whitelist, or silently accept a changed line under this order.

`npm run census:check` is not required because this checker cannot affect census inputs or generated census artifacts. `npm run build` is not required because no application-imported code or normal build path is modified. Those omissions follow the `AGENTS.md` maintenance-tooling floor rather than weakening it.

A failure of TypeScript compilation or either canonical reconciliation command is a stop. Do not weaken an assertion, alter accepted target/archive/snapshot content, or narrow a report to obtain a pass. If a repaired location-bound assertion fails against the accepted Phase 4 target, stop and return the finding to the architect because the failure would implicate accepted target construction rather than this checker repair.

### Step 6 — mandatory negative-control matrix

Use ephemeral scratch copies outside the repository and the existing test-only three-flag input-override interface. Canonical zero-argument npm behavior remains unchanged.

For every control, record the exact command, non-zero exit, and exact relevant failure message. After every scratch run, confirm canonical repository files remain untouched.

#### 6.1 Regression controls from the Phase 5 order

The existing five controls remain mandatory and retain their prior semantics:

1. Delete one complete live block from scratch target: live-block / manifest coverage must fail.
2. Mutate a format-valid byte inside one live block's statement or field while preserving identity: manifest exact-text reports 7/8 must fail.
3. Mutate one byte inside a corresponding normalized wrapper body: wrapper/source preservation report 3 must fail.
4. Mutate one byte in the preservation snapshot: snapshot equality report 4 must fail.
5. Mutate one parser-neutral byte inside one canonical §§4–7 Amendment 2 transition surface, preserving heading and line structure: Amendment 2 structural verification must fail while manifest block reports 7/8 remain pass.

#### 6.2 New compensated-relocation controls

Controls 6–8 prove the repaired **location predicate**. Each deliberately leaves a pristine expected payload elsewhere in the scratch target so that the old global-occurrence implementation would be fooled.

6. **Amendment 2 compensated relocation.** Corrupt one parser-neutral byte in the canonical §3 introduction prose or one §§4–7 transition prose surface, without changing the canonical section heading, line count, or parser structure. Then create a synthetic trailing scratch section such as `## 9. Negative-control scratch`. On the following physical line write a non-newline sentinel prefix immediately followed by one pristine copy of the exact A2 payload, so the pristine payload remains an exact target-text substring for the retained global exact-occurrence predicate but its opening `## N` does **not** begin a physical line and therefore cannot become a second structural section heading. The named **global uniqueness assertion must remain PASS** while the named **location-bound Amendment 2 equality assertion fails**. Record both verdicts explicitly, confirm the required-section uniqueness preconditions remain satisfied, and record that live-block manifest reports remain pass where the chosen mutation is block-neutral.

7. **M5.4 / E053 compensated relocation.** Corrupt one parser-neutral byte in canonical target §8 introduction prose, without changing the canonical `## 8` heading, creating a `- **` line, or changing archive-index parsing. Create a synthetic trailing `## 9. Negative-control scratch` section. On the following physical line write a non-newline sentinel prefix immediately followed by one pristine M5.4 payload. This preserves the pristine M5.4 string as an exact substring for the retained global exact-occurrence predicate while preventing its leading `## 8` from being recognized as a second structural §8 heading. The unique-section locator must therefore remain green, the **global M5.4 uniqueness assertion must remain PASS**, and the **canonical location-bound M5.4/E053 equality assertion itself must fail**. Record both structural verdicts explicitly and record which numbered reports remain pass.

8. **M5.6 compensated relocation.** In one canonical §8 archive-index label line, mutate a byte only in the descriptive prose **after the em dash**, leaving the bolded label, block key, and following pointer line unchanged and preserving parser validity. Append a synthetic `## 9. Negative-control scratch` section after canonical §8 and place one pristine M5.6 26-line archive-index payload beneath it. Because `parseArchiveIndexLines` is section-8-scoped, the relocated pristine block must not join the parsed archive-index population. The **global M5.6 uniqueness assertion must remain PASS** while the **location-bound M5.6 assertion fails**, even though the pristine expected block exists elsewhere as an exact target-text substring. Record both verdicts explicitly, confirm the parser still returns exactly 13 canonical archive-index entries, and identify any other report that fails; if the mutation unexpectedly disturbs unrelated report semantics, choose a different parser-valid descriptive-prose byte and rerun rather than weakening the expected outcome.

For controls 6–8, a passing repaired checker is a stop: it proves the location-binding defect survives.

### Step 7 — closing measurement and exact set comparison

After canonical and negative-control runs:

1. Re-measure every §3 frozen identity and confirm no read-only input changed.
2. Confirm `package.json` and the original Phase 5 receipt are byte-identical to their Step 1 state.
3. Confirm the only repository implementation diff introduced by this repair is in `scripts/decisions-migration-target-reconcile.ts`, plus the new repair report path.
4. Re-run exactly:

```bash
git status --porcelain=v1 --untracked-files=all
```

5. Compare opening and closing status/path sets explicitly in both directions.

Because `scripts/decisions-migration-target-reconcile.ts` already exists as an untracked path at opening, the expected path-set delta is exactly one new path:

`audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-REPORT-2026-08-11.md`

Therefore:

- closing untracked path set = opening untracked path set ∪ exactly that report path;
- no opening untracked path may disappear;
- no other untracked path may appear;
- modified tracked paths remain exactly the same four paths as at opening;
- nothing is staged.

Equal counts without exact two-directional set equality do not discharge this step.

## 6. What this order does not authorize

This repair does not authorize:

- any edit to `DECISIONS.md`, either archive file, the manifest, any amendment or ratification, the frozen Phase-1 artifacts, `lib/decisions-format.ts`, `scripts/tests/decisions-format.ts`, or `scripts/decisions-migration-reconcile.ts`;
- any edit to `package.json`;
- any edit, annotation, supersession, or withdrawal of the original Phase 5 receipt;
- reopening Phase 4 target bytes, the pinned 65/13/1/1 and 37/6/19/3 nulls, raw-`Buffer` baseline slicing, wrapper-to-wrapper binding, snapshot equality, package wiring, Amendment 4 source-classification arithmetic, Amendment 3 join ownership, or any other already-accepted Phase 5 predicate not named by this repair;
- any part of commission §5.8, §6, §7.1, §8, final migration verification, or post-migration reference-graph work;
- any commit, push, staging, branch mutation, or pull-request action;
- treating Codex's clean repair result as final independent Phase 5 closure.

This order repairs only location binding and the **Phase 5 revision-2 order's Step-6 repository-state evidence method**, then regression-tests previously accepted checker behavior.

## 7. Stop conditions

Stop and return to the architect seat, with the repair report documenting the state reached, if:

1. Step 1 finds a frozen-identity mismatch, staged path, or fifth modified tracked path.
2. Any location-bound assertion fails on canonical accepted inputs after mechanically correct implementation.
3. The repair would require writing a path outside §4.
4. Any structural anchor cannot be derived from parser-exposed line numbers plus the independent local top-level-section locator under the exact boundaries in Step 3.
5. Any control 1–8 fails to produce its specified failure, including any compensated-relocation control passing.
6. TypeScript compilation or either canonical checker fails for a cause that is not a mechanical defect in the new checker code.
7. The repaired canonical `npm run reconcile:decisions-migration-target` output differs by any byte from the preserved original Phase 5 receipt transcript.
8. Closing repository-state comparison cannot prove exact opening-to-closing path preservation under Step 7.

A stop is a compliant outcome when its condition is met. Do not repair an accepted upstream artifact under this order.

## 8. Deliverable

Exactly one new repository file:

`audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-REPORT-2026-08-11.md`

The report is the **first repository write** of this repair. Create it immediately after the Step 1 opening census and before modifying the checker. It must contain, in this order:

1. opening branch/HEAD/staged/modified state and all §3 measurements;
2. the complete verbatim opening `git status --porcelain=v1 --untracked-files=all` output;
3. the repair record for all ten governed structural surfaces, naming authority, structural locator, exact comparison, and any retained uniqueness assertion;
4. the E053 target-shape repair;
5. the full verbatim diff of `scripts/decisions-migration-target-reconcile.ts` relative to its Step 1 bytes;
6. full verbatim output of `npx tsc -b --pretty false` and both canonical checker runs, plus the byte-for-byte comparison of the repaired target-checker output against the preserved original Phase 5 receipt transcript;
7. all eight negative controls, each with command, non-zero exit, exact relevant failure message, and for controls 6–8 the explicit retained-global-uniqueness `PASS` versus location-bound `FAIL` verdict together with the unrelated reports that remained pass;
8. closing remeasurement and complete verbatim closing file-level status output;
9. explicit two-directional opening/closing set comparison showing exactly the authorized report-path addition and no removal;
10. one overall disposition: `PASS`, `STOPPED`, or `FAIL`, with its governing reason in one sentence.

Do not rewrite the original Phase 5 receipt. The original receipt remains the contemporaneous record of the defective implementation and is evidence for why this repair exists.

## 9. Architect adjudication and independent-execution prerequisite

On return, the architect seat must read the repair report cold and independently re-measure live disk where its filesystem seat permits: confirm frozen identities and read-only paths, inspect the repaired checker against §1.1 and Steps 2–4, confirm the constitutional TypeScript check passed, and verify the exact opening/closing set comparison from the receipt rather than accepting Codex's summary.

**Independent execution remains a separate Phase 5 prerequisite.** The Phase 5 revision-2 order §9 requires both reconciliation commands to be rerun and at least one negative control to be independently exercised by a seat that did not produce the checker. Codex is the producer, so its Step 5 and Step 6 evidence cannot satisfy that requirement.

Do **not** assume a particular non-producer seat lacks shell access. Route the independent execution to any available non-producer mechanism that can execute on the same repository state — for example a separate model/tool seat with repository command execution, or the owner's local shell. The independent executor must record:

1. branch and HEAD;
2. the repaired checker identity;
3. full output of `npm run reconcile:decisions-migration`;
4. full output of `npm run reconcile:decisions-migration-target`;
5. at least one independently constructed negative control, preferably the identity-preserving live-text mutation from control 2 or one compensated-relocation control from 6–8;
6. restoration/no-mutation evidence for canonical repository inputs.

Phase 5 closes only after **both** the repair is architect-accepted and this non-producer independent execution is accepted. Phase 6 (commission §5.8) is not issued before that closure.
