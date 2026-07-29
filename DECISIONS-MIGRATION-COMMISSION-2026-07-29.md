# DECISIONS.md Cleanup — Staged Migration Commission

**Date:** 2026-07-29 · **Seat:** Architect
**Status:** **RATIFIED 2026-07-29 by Luke (owner).** Governing process and bounded implementation surface in force.
**Implementation shape:** one atomic migration branch / pull request, internally divided into a ratified architect-text stage and a closed-world mechanical implementation stage.

**Governing contracts:**

- `DECISIONS-TAXONOMY-2026-07-24.md`, Amendments 1–3, plus Amendment 4 once ratified and applied from `DECISIONS-ARCHIVE-PRESERVATION-AND-WRAPPER-ADDRESSING-AMENDMENT-2026-07-29.md`.
- `DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md`, as amended with the preservation-snapshot and wrapper-addressing clauses.
- `DECISIONS-FORMAT-FIXTURES-2026-07-28.md`, as amended through F16 and M23.
- `audit/decisions-cleanup-2026-07-24/inventory.md`.
- `audit/decisions-cleanup-2026-07-24/migration-table.md` and `outline-before-after.md`, subject only to the ratified E053 correction in Amendment 4.
- `DECISIONS-REFERENCE-GRAPH-HARDENING-CODEX-WORK-ORDER-2026-07-29.md`.

**Frozen identities:**

- `MIGRATION_BASELINE = d499cc1` — resolve and print the full SHA from the committed baseline declaration and the hardened pre-migration artifact before use; never substitute the current branch head.
- Hardened implementation commits: `eb0e02e` and artifact commit `b5d0027`.
- Authoritative pre-migration graph: `audit/decisions-reference-graph-hardening-2026-07-29/pre-migration-reference-graph.json` at `b5d0027`.
- Historical phase-1 graph: `audit/decisions-cleanup-2026-07-24/reference-graph.json`; frozen and never overwritten.

The implementer must resolve and print the full `MIGRATION_BASELINE` SHA from the committed declaration before any write. An abbreviated token in this commission is orientation only, never a command argument.

---

## 1. Purpose

Migrate legacy `DECISIONS.md` into the ratified target grammar without allowing the implementation seat to decide what the constitution says.

This commission separates the only judgment-heavy part — exact constitutional wording, archive labels, optional-field choices, and source-span boundaries — from the mechanical application. The result is one atomic repository change, but not one undifferentiated authorship act.

The migration is complete only when:

1. the exact target text has been independently reviewed and owner-ratified before `DECISIONS.md` is edited;
2. the ratified manifest is applied without semantic improvisation;
3. every displaced byte remains discoverable through either the normalized archive or the byte-identical preservation snapshot;
4. the format checker, reconciliation checker, hardened reference graph, and full promotion gate all agree on the post-migration state;
5. permanent conformance checking is wired into the pull-request gate in the same atomic pull request.

---

## 2. Preconditions and stop rules

### 2.1 Preconditions

All must hold before Stage 2a begins:

1. Amendment 4 is owner-ratified in writing.
2. The exact Amendment 4 text is applied to the taxonomy, format specification, and fixture file and committed on `main` before the migration branch is created.
3. The applied fixture amendment is hand-authored; it is not generated from parser output.
4. The repository is clean.
5. `main` contains `b5d0027` and the hardened pre-migration graph.
6. `DECISIONS.md` remains byte-identical to `MIGRATION_BASELINE`.
7. The frozen phase-1 artifacts and both pre-migration graphs are unchanged.

### 2.2 Hard stops

Stop without editing `DECISIONS.md` if any of the following is true:

- Amendment 4 is not ratified and committed.
- `git diff MIGRATION_BASELINE -- DECISIONS.md` is nonempty before migration application.
- the SHA or path of the authoritative pre-migration graph cannot be reproduced from disk;
- the phase-1 80-row population cannot be reconciled after applying the E053 correction;
- the Stage 2a manifest has any unresolved placeholder, optional-field ambiguity, source-span ambiguity, duplicate name-addressed title, or untracked `Evidence`/`Owner` path;
- the owner has not ratified the exact Stage 2a manifest bytes;
- the implementation would need to author, paraphrase, choose, split, merge, rename, date, or omit anything not literally pinned by that manifest.

A stop is a successful control, not a partial failure. Do not “make the obvious choice” to continue.

---

## 3. Fixed population and corrected counts

The phase-1 inventory remains 80 logical rows. Amendment 4 corrects only E053's destination treatment; the frozen phase-1 artifacts remain untouched.

### 3.1 Accounted population

| disposition | count | accounting |
|---|---:|---|
| Live target blocks | 65 | 37 `P` + 6 `R` + 19 `I` + 3 `T` |
| Normalized archive wrappers | 13 | one target §8 index line each |
| Structural target §8 introduction | 1 | E053; no wrapper and no archive-index line |
| `MERGE_INTO` source row | 1 | E037 dissolves into E039a, E002, and E006 |
| **Total source rows accounted for** | **80** | exact |

### 3.2 Target counts

- Entry-index rows: **65**.
- Declared total: **65 entry blocks**.
- Live `P` blocks: **37**, carried by **25 distinct live P identifiers**.
- Live `R` blocks: **6**, `R1`–`R6`.
- Live `I` entries: **19**.
- Live `T` entries: **3**.
- Archive wrappers: **13**.
- Archive-index lines: **13**.
- Retired-identifier register rows: **6**:
  - `P9`, `P12`, `P18`, `P22` — `RETIRED`;
  - `P13`, `P14` — `NEVER ASSIGNED`.
- The allocation union, not the live subset, is contiguous through `P31` and `R6`.

### 3.3 E037

E037 has no independent target block and no archive wrapper.

- Rule 1 lands in E039a / `P8`.
- Rule 2 lands in both E002 / `P2` and E006 / `P5`.
- The manifest must show the literal text contribution in all three target records.
- No permanent identifier is minted for E037.

### 3.4 E053

E053 becomes structural prose at the opening of target §8. It names:

1. `Archive/DECISIONS-ARCHIVE-2026-07-14.md`;
2. the normalized migration archive;
3. `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md`.

It must not take archive-index-line syntax and must not be counted as a wrapper or live entry.

---

## 4. Stage 2a — architect-authored exact-text manifest

### 4.1 Seat and authority

The architect authors Stage 2a. The implementation seat does not collaborate on wording and does not preflight by proposing alternate text.

The manifest is independently reviewed against the live repository, the taxonomy, the format contract, the fixtures, the 80-row classification, and the frozen `DECISIONS.md`. The owner then ratifies the exact manifest bytes. Ratification of this commission alone does not ratify later entry wording.

### 4.2 Output

Create:

`audit/decisions-migration-2026-07-29/target-text-manifest.md`

The manifest is a complete literal construction plan. It must contain no prose instruction such as “compress appropriately,” “preserve the intent,” “use the current title,” or “include evidence where available.” Every target choice is written out.

A companion machine-readable file may be included only if it is a lossless projection of the ratified Markdown manifest and its generated equality is checked. The Markdown manifest remains the owner-ratified authority.

### 4.3 Manifest header

Pin:

- full `MIGRATION_BASELINE` SHA;
- source `DECISIONS.md` byte length and SHA-256 at the baseline;
- authoritative pre-migration graph path, artifact SHA-256, `inputGitSha`, and `generatorGitSha`;
- taxonomy, format-specification, fixture, and Amendment 4 commit SHAs;
- expected 80-row reconciliation and all counts in §3;
- exact migration archive filename and snapshot filename;
- implementation branch name;
- the statement that no target text may be inferred outside the manifest.

### 4.4 One record per live block

For each of the 65 target blocks, pin all of the following:

1. source entry ID (`E001` etc.; multiple source IDs where a merge contributes);
2. target section;
3. addressing mode;
4. heading level (`###` core or `####` attachment);
5. permanent identifier, when any;
6. attachment ordinal and target core;
7. exact heading bytes;
8. exact one-to-three-sentence statement bytes;
9. exact field lines in final order:
   - `Kind`;
   - `Status`;
   - `Force`;
   - `Date`;
   - `Authorized`, if present;
   - `Not authorized`, if present;
   - `Evidence`, if present;
   - `Owner`, if present;
   - `Execution`, if present;
10. explicit omission list for every optional field not present;
11. exact entry-index row, including summary;
12. source-to-target rationale identifying which legacy rule(s) the statement carries;
13. for E037 targets, the exact clause contributed by E037;
14. source span or spans used for semantic review, even where the target is a compression rather than a byte copy.

Optional-field omission is an architect decision. The manifest must say `OMIT` for each absent optional field; silence is not sufficient.

### 4.5 Statement authorship constraints

- One prose paragraph, one to three sentences under the ratified sentence-count grammar.
- State only what binds, authorizes, advises, or remains open.
- Do not reproduce measurements, counts, citation detail, source quotations, chronology, method, or litigation chains that a linked source owns.
- Do not create a second source of executable truth.
- Preserve force. Compression may not turn `BINDING` into a suggestion or an `AUTHORIZING` ruling into a descriptive note.
- Preserve `PENDING` and `INACTIVE` as execution states rather than weakening kind or status.
- E074 / `P31` must be grounded in current P3/P5 and producer-versus-checker restrictions, not the retired forward-lane topology.
- E038 must be a stable invariant about current-producer callout ownership and freshness, not a timeless assertion naming the current model as permanent.
- Name-addressed `I` and `T` titles are citation identities; title choice is therefore load-bearing and must be reviewed for uniqueness and durability.

### 4.6 Evidence and Owner resolution

For every candidate `Evidence` or `Owner` value:

1. resolve it to exactly one tracked repository path;
2. verify the path exists at the Stage 2a review commit;
3. use one backticked path only, as the format grammar requires;
4. otherwise pin `OMIT` and state the reason in the manifest's review note.

Commands, symbols, prose labels, directories used as concepts, combined pseudo-paths, GitHub Pages, “Tier 0,” `selfCheck`, `audit:ids`, enum names, and source sections are not paths and must not be copied into these fields.

Every omission must appear in a manifest-level omission register with source entry, candidate label, and disposition. This register is review evidence and does not appear in `DECISIONS.md`.

### 4.7 Archive wrapper manifest

For each of the 13 wrapper dispositions, pin:

1. source entry ID;
2. wrapper addressing mode;
3. exact unique heading / archive label;
4. exact field list and values;
5. whether an identifier retires;
6. `Retired ID`, if and only if ID-addressed;
7. exact `Origin` value;
8. exact target §8 archive-index line and pointer anchor;
9. exact source byte start and end offsets in `git show MIGRATION_BASELINE:DECISIONS.md`;
10. SHA-256 of the exact body bytes;
11. byte length;
12. boundary rationale.

The boundary rationale is mandatory where a logical entry is embedded in a shared paragraph or section, including at minimum E032, E036, E039b, E075, and E076. Codex may slice only by the pinned byte offsets and must verify the pinned hash before using the body.

ID-addressed wrappers are only the four actual identifier retirements: P9, P12, P18, and P22, unless the ratified manifest demonstrates another retired identifier consistent with the register. Non-retiring P/R historical units are name-addressed under Amendment 4.

Name-addressed archive titles:

- must be unique;
- must not begin with `P<n> ` or `R<n> `;
- must match their §8 archive-index labels byte-for-byte;
- carry no retired-register row.

### 4.8 Structural surfaces

Pin the complete literal text of:

- target §1, including purpose, authority boundaries, and compression rule;
- target §2 status vocabulary;
- target §3 table, separator, 65 rows, and declared-total line;
- section headings for §§4–8;
- target §8 structural introduction carrying E053 and naming all three preservation files;
- all 13 archive-index lines;
- the six-row retired-identifier register;
- any structural transition sentence outside entry blocks.

The implementer may not regenerate summaries from headings unless the manifest explicitly makes the exact bytes equal.

### 4.9 Stage 2a review and ratification

Before owner ratification, an independent reviewer must:

- re-derive all 65 kind/status/force/destination assignments from the ratified classification record;
- check every literal statement for semantic preservation and prohibited duplicated evidence;
- check P/R core-versus-attachment grouping;
- check all name-addressed identity titles for collisions and reserved-prefix shapes;
- verify all dates from recorded effective dates rather than document-migration date;
- verify each present `Evidence`/`Owner` path is tracked;
- independently reproduce all 13 source slices and hashes from `MIGRATION_BASELINE`;
- reconcile 80 rows exactly;
- confirm no implementation or parser change has begun.

The review disposition is one of `ACCEPT`, `REVISE`, or `REFUSE`. Only `ACCEPT` followed by owner ratification authorizes Stage 2b.

---

## 5. Stage 2b — closed-world mechanical implementation

### 5.1 Seat

Codex is the implementation producer. It authors no constitutional wording and makes no migration disposition.

### 5.2 Authorized branch outputs

The migration branch / pull request may contain only the following outputs. The Stage 2a manifest is architect-authored and ratified before Stage 2b; all other listed migration outputs are bounded Stage 2b surfaces:

1. `DECISIONS.md`;
2. `Archive/DECISIONS-ARCHIVE-<migration commit date>.md`;
3. `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md`;
4. `audit/decisions-migration-2026-07-29/target-text-manifest.md`, architect-authored and owner-ratified before Stage 2b; Codex may consume but not modify its ratified bytes;
5. `lib/decisions-format.ts`, limited to removal of the single name-addressed `Original Kind: P/R` rejection guard;
6. `scripts/tests/decisions-format.ts`, limited to implementing the ratified F14–F16 and M20–M23 expectations and any direct regression needed to execute them;
7. `scripts/decisions-format-conform.ts` and/or package/workflow files only for permanent post-migration conformance wiring already authorized by this commission;
8. `scripts/decisions-migration-target-reconcile.ts`, a new target-migration checker consuming the ratified manifest and migrated surfaces; the existing `scripts/decisions-migration-reconcile.ts` is not modified;
9. a new post-migration reference-graph artifact under `audit/decisions-migration-2026-07-29/`;
10. migration receipt and reconciliation artifacts under `audit/decisions-migration-2026-07-29/`;
11. `PROJECT-HISTORY.md`, limited to the accepted migration and gate-wiring state;
12. `package.json` and `.github/workflows/promotion-gate.yml`, limited to the exact commands and conformance wiring specified below.

Any other path requires an amended commission.

### 5.3 Implement ratified Amendment 4's parser consequence

The taxonomy, format specification, and hand-authored fixture amendments are already committed prerequisites. Stage 2b then:

1. implement the test cases for F14–F16 and M20–M23 exactly from the already-committed fixture document, without changing parser behavior;
2. run `npm run test:decisions-format` and record the expected pre-implementation result: F14 and F15 fail under the old name-addressed `Original Kind: P/R` guard; F16's wrapper/index bijection cannot pass because F14 is rejected; M20–M23 already pass because they pin rejections the current parser already produces;
3. remove only the single parser guard rejecting name-addressed P/R original kinds;
4. rerun the fixture suite and show F14–F16 and M20–M23 all pass with the existing reason codes;
5. make no further parser change unless a newly exposed failure proves the ratified fixture impossible, in which case stop and return to the architect.

Do not derive fixture expectations from the modified parser.

### 5.4 Create the preservation snapshot

Create `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` from:

`git show MIGRATION_BASELINE:DECISIONS.md`

Do not copy from the working tree.

Verify and record:

- baseline source SHA-256;
- snapshot SHA-256;
- exact equality;
- byte length;
- `git diff --no-index` empty result or equivalent exact-byte proof.

The snapshot is never passed as `archiveText` to `checkDecisionsFormat` and receives no §8 index line.

### 5.5 Build the normalized archive

For each of the 13 manifest records:

1. read the exact source bytes from `git show MIGRATION_BASELINE:DECISIONS.md` using the pinned offsets;
2. verify the byte length and SHA-256 before writing;
3. write the manifest's exact wrapper heading and field list;
4. append the source bytes without normalization;
5. preserve line endings and final-newline behavior as pinned;
6. verify the complete archive parses under the amended archive grammar;
7. verify each wrapper has exactly one target §8 index line and pointer.

No historical body is rewrapped, spell-corrected, indentation-normalized, or Markdown-tidied.

### 5.6 Construct target `DECISIONS.md`

Write `DECISIONS.md` from the ratified manifest, not by editing legacy prose in place.

The resulting file must contain only:

- manifest-pinned structural text;
- the 65 manifest-pinned entry blocks;
- 13 manifest-pinned archive-index lines;
- the six-row retired register.

No legacy paragraph may survive accidentally outside a pinned target block. No unmanifested sentence may be introduced.

### 5.7 Reconciliation checkers

The existing `npm run reconcile:decisions-migration` is the frozen phase-1 closure checker. It is hard-pinned to the historical 65/14/1 mapping and must remain unchanged and continue to pass against the frozen phase-1 artifacts.

Add `npm run reconcile:decisions-migration-target`, owned by new `scripts/decisions-migration-target-reconcile.ts`, and run it against:

- frozen phase-1 inventory and mapping as historical source classification;
- ratified Amendment 4's E053 correction;
- `MIGRATION_BASELINE` source text;
- ratified Stage 2a manifest;
- target `DECISIONS.md`;
- normalized archive;
- preservation snapshot.

The target checker must report separately:

- 65 live rows;
- 13 wrapper rows;
- E053 structural row;
- E037 merge row;
- total 80;
- exact source-span/hash preservation for all wrapper bodies;
- snapshot exact equality;
- no unaccounted source entry;
- no duplicate destination accounting;
- no target block absent from the manifest;
- no manifest block absent from target output.

The new target checker carries an independent pinned null of **65 live / 13 wrappers / 1 structural E053 / 1 MERGE_INTO = 80**, plus the section totals **37 P / 6 R / 19 I / 3 T**. It verifies the manifest and migrated surfaces against those constants; it must not derive its expected counts from the manifest it is checking. The manifest supplies exact record identity and text, not the population null.

The target checker does not rewrite or reinterpret the frozen phase-1 artifacts. It must fail if the historical 14-entry archive classification is silently treated as the target count rather than reconciled through E053's ratified structural correction. The implementation may not revise classification semantics.

### 5.8 Permanent conformance wiring

In the same pull request, wire the target format checker into the PR gate after migration content exists.

Add or retain a package command with one stable name. Prefer the already-existing `test:decisions-format` for regression fixtures and add one explicit repository conformance command only if needed for the live files. The workflow must run both:

1. parser/fixture regressions;
2. live `DECISIONS.md` + normalized archive conformance with tracked-path validation.

Do not validate the preservation snapshot as an archive wrapper document.

The exact workflow edit is mechanical and must not duplicate grammar logic in YAML.

---

## 6. Reference-graph post-migration contract

### 6.1 Artifact

Generate a third artifact under:

`audit/decisions-migration-2026-07-29/post-migration-reference-graph.json`

Do not overwrite either pre-migration graph.

The artifact must use target mode and record the post-migration input SHA and generator SHA.

### 6.2 Required target-state assertions

- parser selection is `target`, never legacy;
- no target-surface parse or conformance failure;
- `P8` resolves `LIVE`;
- `P9`, `P12`, `P18`, and `P22` resolve `RETIRED`;
- `P13` and `P14` resolve `MISSING` / never assigned;
- all live `P` and `R` citations resolve to exactly one target;
- exact-byte `I:` and `T:` title citations resolve only on one exact title match;
- zero derived identifiers in target `DECISIONS.md`; corpus-wide derived-identifier records remain reported, with the hardened pre-migration population of 7 expected to persist unless individually attributed;
- zero invalid entry-anchor citations authored inside target `DECISIONS.md`, matching format assertion 16; corpus-wide links into target `DECISIONS.md` entry anchors are reported and triaged because target-mode anchor detection becomes active for the first time, not assumed zero;
- all archive-index lines select exactly one normalized archive source;
- no snapshot pointer is parsed as an archive-index line.

### 6.3 Source-segregated reconciliation

The snapshot remains in graph scope. Report it as its own source population.

Produce at minimum:

1. **live governance corpus** — target `DECISIONS.md`, normalized migration archive, active governance/specification files, excluding the byte-identical snapshot from pooled interpretation;
2. **preservation snapshot** — all records whose `from` equals `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md`;
3. **other Archive corpus** — historical files other than the snapshot and normalized migration archive.

Live-corpus citations to retired identifiers are legitimate records and remain in the live-corpus report. Snapshot-attributed records are segregated because they are a distinct historical source population, not because the snapshot is the only source of `RETIRED` resolutions.

Do not change generator scope to manufacture these groups. Derive them from existing per-record `from` and per-source `inputs` data.

The receipt must explain snapshot-driven `RETIRED` records rather than presenting them as live-corpus regressions.

### 6.4 Expected-delta comparison

Compare the post-migration artifact with the hardened pre-migration artifact by source and target identity.

Expected governance state transitions are limited to:

- `P8`: legacy `LAPSED` → target `LIVE`;
- `P9`, `P12`, `P18`, `P22`: legacy `LAPSED` → target `RETIRED`;
- `P13`, `P14`: remain `MISSING`;
- live target titles and archive-wrapper definitions become available under target grammar;
- the preservation snapshot adds a new historical source population.

All other reference changes require individual attribution. “Counts changed because the format changed” is not an attribution.

### 6.5 Determinism

Run the post-migration graph twice from the same committed input. The artifacts must be byte-identical except for `generatedAt`. Record both hashes after normalizing only that field.

---

## 7. Verification

### 7.1 Focused migration checks

Required:

1. `npm run test:decisions-format`.
2. live repository conformance command — zero findings.
3. `npm run reconcile:decisions-migration` — frozen phase-1 checker still passes at its historical 65/14/1 mapping.
4. `npm run reconcile:decisions-migration-target` — exact target 65/13/1/1 accounting.
5. `npx tsx scripts/tests/decisions-reference-graph.ts`.
6. two-run post-migration graph determinism.
7. snapshot SHA equality.
8. 13/13 archive wrapper-index bijection.
9. retired-register/live-ID conflict check — zero.
10. tracked `Evidence`/`Owner` path check — zero findings.
11. manifest/output exact equality check.

### 7.2 Full repository gate

Run every pull-request gate step from the live `.github/workflows/promotion-gate.yml`. At commission drafting, that set is:

- `npm ci`;
- `npm run test-visuals`;
- `npm run audit`;
- `npm run test:validate-sweep`;
- `npm run test:non-mcq-bias`;
- `npm run test:schema-bank`;
- `npm run test:flowsheet-gate`;
- `npm run test:structured-measurements`;
- `npm run test:structured-measurements-applicator`;
- `npm run test:coverage-report`;
- `npm run census:check`;
- the newly wired DECISIONS conformance commands.

The live workflow at implementation time is the source of truth if its exact command set has changed. Report any pre-existing advisory separately; no failure is waived because it appears unrelated.

### 7.3 Repository integrity

Before and after verification:

- `git status --porcelain` contains only intended files before commit and is empty after commit;
- no bank, schema, renderer, runtime, or unrelated audit file changes;
- frozen phase-1 artifacts unchanged;
- hardened pre-migration graph unchanged;
- `MIGRATION_BASELINE` object remains accessible;
- `Archive/DECISIONS-ARCHIVE-2026-07-14.md` unchanged.

---

## 8. Independent post-implementation review

The architect who authored Stage 2a may perform spec-conformance review but may not be the sole content checker of their own wording. Producer-versus-checker separation requires two distinct review questions:

1. **Manifest conformance:** Did Codex apply the ratified manifest exactly, preserve bytes, and satisfy the deterministic gates? The manifest author may check this.
2. **Constitutional content review:** Do the migrated statements accurately preserve the source rules and force without omission or new meaning? This must be independently re-derived by a seat that did not author the statements.

The final review must sample nothing: all 65 live statements, all 13 wrapper boundaries, E053 structural prose, and E037's three-target merge are load-bearing and receive full review.

Disposition is `ACCEPT`, `REPAIR`, or `REFUSE`.

- `ACCEPT`: implementation is safe to merge.
- `REPAIR`: bounded mechanical mismatch against already-ratified text; no new wording.
- `REFUSE`: manifest defect, unratified semantic change, preservation failure, or unbounded implementation defect; return to Stage 2a or amend the commission.

---

## 9. Commit and pull-request structure

One atomic pull request is preferred, with commits that preserve review boundaries:

1. ratified target manifest, after owner approval;
2. parser guard regression implementation against the already-landed Amendment 4 fixtures;
3. snapshot, normalized archive, and migrated `DECISIONS.md`;
4. reconciliation, graph artifact, conformance wiring, receipt, and `PROJECT-HISTORY.md` closeout.

The target manifest must be committed before the migration implementation commit so the implementation can be diffed against an immutable in-branch authority. Do not squash away that boundary before independent review.

Nothing is pushed or merged until all gates pass and independent review accepts.

---

## 10. Migration receipt

Create:

`audit/decisions-migration-2026-07-29/MIGRATION-RECEIPT.md`

It must report:

- all governing commit SHAs;
- full baseline SHA;
- manifest SHA-256 and owner-ratification record;
- snapshot source and target hashes;
- normalized archive hash;
- 13 wrapper body offsets, byte lengths, and hashes;
- 65/13/1/1 reconciliation;
- optional-field omission register summary;
- conformance result;
- retired register and allocation-union result;
- post-migration graph identity, counts, expected deltas, and source-segregated snapshot population;
- two-run determinism hashes;
- full gate results;
- exact changed-path allowlist and diff statistics;
- independent-review disposition;
- any advisory that did not affect acceptance.

No evidence may live only in an end-of-chat report.

---

## 11. Non-goals

This commission does not authorize:

- any bank, schema, renderer, runtime, clinical, or product change;
- repair of `unqualified-basename` graph records;
- corpus-wide citation rewriting;
- a generator scope-exclusion list for the snapshot;
- editing the July 14 archive;
- editing frozen phase-1 artifacts;
- changing permanent identifier allocation or reusing retired/never-assigned numbers;
- adding identifiers to `I` or `T`;
- rewriting archive body bytes;
- changing the format reason-code vocabulary;
- changing the target grammar beyond ratified Amendment 4;
- changing the historical semantics or pinned counts of `scripts/decisions-migration-reconcile.ts`;
- allowing Codex to improve or shorten ratified statement wording;
- splitting migration and gate wiring into unrelated partial landings;
- treating the snapshot as current authority or as a normalized archive.

---

## 12. Ratification gates

This commission requires three distinct owner acts:

1. **Amendment 4 ratification** — authorizes the snapshot, non-retiring name-addressed P/R wrappers, and E053 correction.
2. **Commission ratification** — authorizes the staged process and bounded implementation surface.
3. **Stage 2a manifest ratification** — approves the exact constitutional text, fields, archive labels, and source spans that Codex may apply.

No earlier ratification implies a later one.

**Ratified 2026-07-29 by Luke (owner).** The staged migration commission is ratified as the governing process and bounded implementation surface. Amendment 4 is separately ratified and in force. Neither act ratifies any Stage 2a entry wording, which requires separate ratification of the exact manifest bytes.
