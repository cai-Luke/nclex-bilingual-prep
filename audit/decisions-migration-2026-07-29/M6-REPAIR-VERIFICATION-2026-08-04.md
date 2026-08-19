# M6 repair verification — 2026-08-04

**Executing seat:** Codex  \n**Scope:** revision 4 §§5–7; completion order §5 and §6 deliverables only. No repair, GPT confirming read, derived date-occurrence report, staging, commit, push, stash, reset, clean, checkout, or other write was performed. This report is the sole authorized write and is intentionally untracked.

## Authorization, repository, and frozen identities

- Repository view: local disk worktree; branch `codex/decisions-migration`; HEAD `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` (PASS).
- Revision-4 order identity: `21421` bytes / `76588efdca91e52e0f938837d3a0e41d283cc1119eee65212ca28a7aa863f577` (PASS).
- Completion-order identity: `10235` bytes / `97a8c5297c3da7d2f4ca8af215ba0e1ffda532b912815c44a41a52b74c152065` (PASS). Its repair-report §7 and §9 hashes are both this digest; revision 4 is recorded before and after the repair as `76588…f577` (PASS for §1.2 two-hash equality).
- `DECISIONS.md` is byte-identical to `d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md` (PASS).

| Path | Measured bytes | Measured SHA-256 | Pinned | Result |
|---|---:|---|---|---|
| `DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-VERIFICATION-CODEX-WORK-ORDER-2026-08-04.md` | 21421 | `76588efdca91e52e0f938837d3a0e41d283cc1119eee65212ca28a7aa863f577` | `21421` / `76588efdca91e52e0f938837d3a0e41d283cc1119eee65212ca28a7aa863f577` | PASS |
| `DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-COMPLETION-CODEX-WORK-ORDER-2026-08-04.md` | 10235 | `97a8c5297c3da7d2f4ca8af215ba0e1ffda532b912815c44a41a52b74c152065` | `10235` / `97a8c5297c3da7d2f4ca8af215ba0e1ffda532b912815c44a41a52b74c152065` | PASS |
| `audit/decisions-migration-2026-07-29/M6-PARTIAL-M6-ONLY-SNAPSHOT-2026-08-04.md.frozen` | 312411 | `26feb5dcbe9f501352561f8d324a34fd5285728669a01e5bccc17fa77ee8ad2f` | `312411` / `26feb5dcbe9f501352561f8d324a34fd5285728669a01e5bccc17fa77ee8ad2f` | PASS |
| `audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-SNAPSHOT-2026-08-04.md.frozen` | 308092 | `8e0589dcfb9f7190b11ea145dfa9e10e9075c069a3c631ef1a03c3c0c42dc244` | `308092` / `8e0589dcfb9f7190b11ea145dfa9e10e9075c069a3c631ef1a03c3c0c42dc244` | PASS |
| `audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-RESUME-NOTE-SNAPSHOT-2026-08-04.md.frozen` | 55424 | `e27fd31d1fd497c7a64a73126438f7981ecc206689aee6ac21eb60add38afa8a` | `55424` / `e27fd31d1fd497c7a64a73126438f7981ecc206689aee6ac21eb60add38afa8a` | PASS |
| `audit/decisions-migration-2026-07-29/M6-REPAIR-PRE-CENSUS-2026-08-04.md` | 63695 | `edbb96934841d3809db14b46c2e67ae718605537f76362acdd1850fc6755cff3` | `63695` / `edbb96934841d3809db14b46c2e67ae718605537f76362acdd1850fc6755cff3` | PASS |
| `DECISIONS.md` | 76314 | `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | `76314` / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | PASS |

The completion order §1 abbreviates the pre-repair manifest hash as `8e0589dc…4698`. Its tail is clerically incorrect. Per owner clarification, the governing full identity is `308092` bytes / `8e0589dcfb9f7190b11ea145dfa9e10e9075c069a3c631ef1a03c3c0c42dc244`, measured above as PASS. This is a documented immutable-order defect, not an actual snapshot mismatch. The already-existing partial-state snapshot was measured as `312411` / `26feb5dc…8ad2f`; Task 0 was not rerun and that snapshot was not modified.

### Pre-verification raw stdout — `git status --porcelain`

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
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-COMPLETION-CODEX-WORK-ORDER-2026-08-04.md
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

## 4. Resume-note allowlist diff

The pre-repair note is `55424` bytes / `e27fd31d1fd497c7a64a73126438f7981ecc206689aee6ac21eb60add38afa8a`; the current note is `59782` bytes / `7395262c1772a945957a1f1d735af1dd1f9335c970400a2f6bb6c2099778f18d`. Rulings 1–32 compare byte-for-byte individually: 1=PASS, 2=PASS, 3=PASS, 4=PASS, 5=PASS, 6=PASS, 7=PASS, 8=PASS, 9=PASS, 10=PASS, 11=PASS, 12=PASS, 13=PASS, 14=PASS, 15=PASS, 16=PASS, 17=PASS, 18=PASS, 19=PASS, 20=PASS, 21=PASS, 22=PASS, 23=PASS, 24=PASS, 25=PASS, 26=PASS, 27=PASS, 28=PASS, 29=PASS, 30=PASS, 31=PASS, 32=PASS. Exactly rulings 33 and 34 are added. Reversing R1–R4 (including the full R3 block and R4a/R4b replacements) produces a byte-identical pre-repair note: **PASS**. Thus all named immutable surfaces, including the rest of `## Cursor`, are byte-identical.

```diff
--- audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-RESUME-NOTE-SNAPSHOT-2026-08-04.md.frozen
+++ DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md
@@ -1,44 +1,61 @@
 # Stage 2a Claude resume note
 
-**Updated:** 2026-08-01 · **Seat:** Architect
+**Updated:** 2026-08-05 · **Seat:** Architect
 
 ## Next session — start here
 
-**Task: author M5.** Do not re-derive queue state and do not re-litigate routing; both were settled
-2026-08-01 and the outcome is recorded below.
-
-**No part of M5's content is specified in this section,** because the seat that wrote it had not read the
-governing sources. Read them before authoring:
-
-1. `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md` — the M5 requirement itself: 13 archive-wrapper
-   records, archive-index lines, and the retired-ID register.
-2. `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md`.
-3. `DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md` — wrapper offsets, hashes, lengths.
-4. `DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md` — preparatory only, ruling 12.
-5. The manifest's own format specification and target §1 bytes.
-6. Standing rulings 1–32 in this note. Rulings 5, 12, 13, 18, 26, 27, 30, and 31 have each fired on a
-   prior authoring pass.
-
-M5 and M6 are authored in place above M7. The terminal `@@ASSEMBLY_CURSOR@@` is reserved for the derived
-date-occurrence report and is never the insertion point.
+**Task: run the M6 repair verification through Codex.** M4, M5, and M6 are authored. Do not re-derive
+queue state, do not re-litigate routing, and do not reopen M4 authoring; all were settled and the
+outcomes are recorded below and in the repair report.
+
+**The immediate next action** is Codex's single deliverable at
+`audit/decisions-migration-2026-07-29/M6-REPAIR-VERIFICATION-2026-08-04.md`, covering
+`DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-VERIFICATION-CODEX-WORK-ORDER-2026-08-04.md` revision 4 §§5
+and 6 **plus** `DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-COMPLETION-CODEX-WORK-ORDER-2026-08-04.md` §5.
+Revision 4's bytes are immutable: it is the executed authorization basis for the landed M6 changes, and
+its two-hash proof is worth something only while the file it names stays byte-identical.
+
+**What landed, and where it is recorded.** The 2026-08-04 M6 repair and its 2026-08-05 continuation are
+applied: the six revision-4 M6 surfaces; two numeric prose corrections at M6.3 and M6.7 under the
+completion order §3; and the fifteen item-10 `Evidence` dispositions at revision 4 §2. Every measured
+value, every judgment made in passing, and two process failures are at
+`audit/decisions-migration-2026-07-29/M6-REPAIR-REPORT-2026-08-04.md`. **Read that report before
+touching M6 or those fifteen records.**
+
+**Do not advance to the derived date-occurrence report and do not advance to ratification until that
+verification clears.** The report's rows carry byte offsets into the manifest, and these edits moved
+them; generating it against an unverified manifest spends the generation and hides whatever the
+verification would have caught. **Then** the GPT confirming read, revision 4 §8 scope extended to the
+two prose corrections and the fifteen repaired dispositions. That read is barred to the Claude seat,
+which authored them.
+
+**The architect seat cannot hash.** The filesystem connector exposes no SHA-256 primitive; byte length
+and content are measurable, digests are not. Every digest in the repair report was produced by a seat
+that can run `shasum` and is recorded with that provenance. A closing digest is measured afresh and
+never copied forward from the opening record — two hashes prove an authorization basis only if both are
+measurements.
+
+M5 and M6 were authored in place above M7. The terminal `@@ASSEMBLY_CURSOR@@` is reserved for the
+derived date-occurrence report and is never the insertion point.
 
 **Routing settled 2026-08-01.**
 
-- **Architect seat:** M5, M6, adjudication of review returns, new standing rulings, and the Stage 2b
-  `DECISIONS.md` writes.
+- **Architect seat:** adjudication of review returns, new standing rulings, and the Stage 2b
+  `DECISIONS.md` writes. M5 and M6 are authored and the M6 repair is complete.
 - **The commission-required full 65-record and 13-wrapper constitutional review is barred to the Claude
   seat** and routes to a GPT or Codex seat. Claude authored the M4 records, and producer≠checker attaches
   to the seat that produced. This is a rule consequence, not a scheduling choice; it does not change if
   Claude usage becomes available.
-- **Codex:** the Task 2 rerun over the 43 records at M4.2–M4.44; the Task 3 rerun or explicit
-  supersession; generation, mapping, validation, embedding, and re-derivation of the date-occurrence
-  report; post-assembly deterministic verification.
+- **Codex:** the M6 repair verification above, which folds the Task 2 rerun in as a complete 65-record
+  run reporting the owed 43-record subset at M4.2–M4.44 separately, and the Task 3 rerun or explicit
+  supersession; then generation, mapping, validation, embedding, and re-derivation of the
+  date-occurrence report; then post-assembly deterministic verification.
 - **Owner:** exact-byte ratification of the complete sentinel-free manifest.
 
 **Schedule constraint.** `MIGRATION_DATE` `2026-08-11` is a verification predicate on the Stage 2b content
-commit's author timestamp in `America/New_York`. As of 2026-08-01, M5, M6, the derived report, both Codex
-reruns, the post-assembly verification, the full non-author review, and owner ratification are all owed
-against ten days. Any further change to the bound value is an owner act. Once the first exact-byte
+commit's author timestamp in `America/New_York`. As of 2026-08-05, the M6 repair verification with both
+Codex reruns folded in, the derived report, the post-assembly verification, the full non-author review,
+and owner ratification are all owed against six days. Any further change to the bound value is an owner act. Once the first exact-byte
 ratification lands, a further change stops being a pre-ratification candidate supersession and becomes the
 full Amendment 1 Clause B procedure — manifest-only rebinding commit landed before the Stage 2b content
 commit, owner-ratified diff limited to the §3 date-dependent bytes, replacement manifest SHA-256
@@ -72,7 +89,8 @@
 **Target §§4–7 are structurally complete, and M4 is complete.** Target §4 carries 37 `P` blocks across
 25 distinct permanent identifiers, target §5 carries 6 `R` blocks, target §6 carries all 19 `I`
 entries, and target §7 carries all 3 `T` entries; all match the frozen nulls at M0.3. **No live block
-remains unauthored.** M5, M6, and the derived date-occurrence report are still owed.
+remains unauthored.** M5 and M6 are authored; M6's 2026-08-04 repair and its 2026-08-05 continuation
+are applied, and Codex verification of them is pending.
 
 **Part A — 18 blocks at M4.2–M4.19:**
 
@@ -336,9 +354,10 @@
 `rationale/dyad scoring` category in the statement, and this note's Task 3 repair. The reviewing seat
 has since checked the applied bytes on live disk.
 
-Next: **the valid Task 2 rerun over M4.2–M4.44**, and the commission-required complete review of the 65
-live records and 13 wrappers. M5, M6, and the derived date-occurrence report remain owed and are not
-authorized by any batch clearance. Prior context,
+Next: **Codex verification of the M6 repair**, under revision 4 §§5 and 6 plus the completion order §5,
+and then the commission-required complete review of the 65 live records and 13 wrappers. M4, M5, and M6
+are authored. The derived date-occurrence report remains owed, is not authorized by any batch clearance,
+and is not generated until that verification clears. Prior context,
 under
 `DECISIONS-MIGRATION-STAGE-2A-PART-C-AUTHORING-WORK-ORDER-2026-07-31.md`, which is closed-world and
 supersedes this section's summary where the two differ — **except at its §7.1, whose
@@ -673,6 +692,35 @@
     which ruling applies, and it cannot be replaced by reading the punctuation. Found 2026-08-01 while
     authoring M4.62.
 
+33. **A ground vocabulary that cannot name its field will collapse the two field tests.** M6's omission
+    register was authored with one ground list serving both `Evidence` and `Owner`, and within a single
+    pass it was applying one complete-statement test to both — citing ruling 23, which says the
+    opposite. The vocabulary made the correct distinction inexpressible, so the register could not
+    record it and no mechanical check could detect its absence. Repaired 2026-08-04: every §M6.1 ground
+    now declares the field it may serve — six `Owner`-only, four `Evidence`-only, five both — and an
+    `Evidence` row carrying an `Owner`-only ground is now a defect a script finds. **The collapse
+    reaches back into the drafts.** Part A recorded `P4#0` and `P7#0` as *joint* `Evidence, Owner`
+    omission rows under a single reason, and that reason is `Owner`-shaped; a joint row carrying one
+    field-shaped reason discharges one field and silently inherits to the other. Both are now grounded
+    separately at §M6.7, which is why that population grew from eight rows to ten. **Rule:** where two
+    fields have different tests, the vocabulary that classifies their dispositions carries the field as
+    data, and a register row is never shared between them. Found 2026-08-04 by the pre-handoff review
+    of M6.
+
+34. **A mechanical search over reasoning prose yields a candidate population, never a finding
+    population.** The M6 repair pre-census swept the item-10 `Evidence` reasoning of all 65 records for
+    `Owner`-shaped literals — `owns`, `owned by`, `one-path grammar`, `no single tracked path` — and
+    returned 27 hits, 21 of them outside the already-known repair set. Nineteen were correct `Evidence`
+    reasoning that happened to use the verb: "no measurement, provenance, or method a separate tracked
+    **source owns**" governs a source owning substance, which is exactly the test ruling 23 states. Two
+    more turned on the one-path grammar, which constrains both fields alike. Only two were the collapse.
+    **That narrowing from 21 to 2 is architect judgment, and it is recorded with a per-record ground at
+    revision 4 §2.1 so the confirming review can challenge it rather than take it on trust.** The
+    failure mode runs both ways: a seat that treats the hit list as the finding list repairs correct
+    text, and a seat that narrows silently presents a judgment as a measurement. **Rule:** report the
+    search population and the retained set separately, and state a ground for every exclusion. Found
+    2026-08-04 while triaging the Task E expansion set.
+
 ## MIGRATION_DATE — RESOLVED by owner act, 2026-07-31
 
 **`MIGRATION_DATE` is `2026-08-11`.** Bound by Luke (owner) on 2026-07-31, superseding the `2026-07-31`
```

## 5. Repair verification

### 5.1 Whole-section and immutable-surface identity

`M0`: before 6665, after 6665, PASS.
`M1`: before 1141, after 1141, PASS.
`M2`: before 2966, after 2966, PASS.
`M3`: before 4598, after 4598, PASS.
`M5`: before 41136, after 41136, PASS.
`M7 to EOF`: before 6815, after 6815, PASS.
`M6.2` immutable: before 7733, after 7733, PASS.
`M6.4` immutable: before 2988, after 2988, PASS.
`M6.5` immutable: before 569, after 569, PASS.
`M6.6` immutable: before 2418, after 2418, PASS.
`M6.8` immutable: before 1996, after 1996, PASS.
`M6.9` immutable: before 1064, after 1064, PASS.

### 5.2 M4 surface identity

Items 1–9, 11, and 12–14 are byte-identical in every one of the 65 records. Item-10 bytes outside its `Evidence` disposition substring are byte-identical in every record. The exact changed-`Evidence` set is: `M4.3`, `M4.5`, `M4.7`, `M4.9`, `M4.11`, `M4.12`, `M4.14`, `M4.15`, `M4.22`, `M4.26`, `M4.28`, `M4.30`, `M4.31`, `M4.33`, `M4.40`. It equals the fifteen-record allowlist in both directions (PASS).

### 5.3 Optional fields

Independent item-9 derivation: **325** slots; **68** present; **257** omitted. `Authorized` 2/63; `Not authorized` 4/61; `Evidence` 6/59; `Owner` 14/51; `Execution` 42/23. PASS.

### 5.4 M6.3 doctrine check

Rows: 110 (Evidence 59, Owner 51); dagger rows: 10; ground tokens: 116. Item-9 ↔ M6.3 omission bijection: both directions empty (PASS). M6.1 vocabulary: 15 unique definitions, no duplicate definition, all application values allowed; malformed tokens, undefined tokens, unused definitions, and field-applicability violations: none. No `Evidence` row carries Owner-only vocabulary and no `Owner` row carries Evidence-only vocabulary (PASS).
- `ARCHIVE-ONLY` — rows 12; Evidence 11; Owner 1; records M4.2, M4.4, M4.4, M4.11, M4.15, M4.17, M4.27, M4.30, M4.34, M4.35, M4.39, M4.52.
- `CARRIED-ELSEWHERE` — rows 2; Evidence 0; Owner 2; records M4.16, M4.25.
- `CLAUSE-SCOPED` — rows 3; Evidence 3; Owner 0; records M4.28, M4.33, M4.40.
- `NO-CANDIDATE` — rows 10; Evidence 10; Owner 0; records M4.3, M4.6, M4.10, M4.13, M4.16, M4.19, M4.20, M4.21, M4.23, M4.25.
- `NO-COMPRESSED-SUBSTANCE` — rows 20; Evidence 20; Owner 0; records M4.9, M4.14, M4.26, M4.39, M4.46, M4.47, M4.48, M4.49, M4.51, M4.53, M4.54, M4.55, M4.56, M4.57, M4.58, M4.59, M4.60, M4.61, M4.62, M4.63.
- `NO-EXECUTABLE-OWNER` — rows 11; Evidence 0; Owner 11; records M4.6, M4.8, M4.10, M4.22, M4.24, M4.27, M4.29, M4.34, M4.36, M4.38, M4.56.
- `NO-SINGLE-EVIDENCE-SOURCE` — rows 4; Evidence 4; Owner 0; records M4.22, M4.43, M4.44, M4.66.
- `NO-SINGLE-OWNER` — rows 19; Evidence 0; Owner 19; records M4.3, M4.5, M4.11, M4.12, M4.21, M4.23, M4.25, M4.28, M4.30, M4.31, M4.35, M4.37, M4.39, M4.42, M4.47, M4.54, M4.55, M4.59, M4.63.
- `NOT-A-PATH` — rows 6; Evidence 4; Owner 2; records M4.8, M4.9, M4.13, M4.24, M4.32, M4.38.
- `NOT-AN-AUTHORITY` — rows 8; Evidence 5; Owner 3; records M4.5, M4.7, M4.7, M4.12, M4.18, M4.18, M4.29, M4.45.
- `PARTIAL-OWNERSHIP` — rows 9; Evidence 0; Owner 9; records M4.7, M4.15, M4.19, M4.20, M4.33, M4.40, M4.46, M4.48, M4.50.
- `PENDING` — rows 4; Evidence 0; Owner 4; records M4.32, M4.43, M4.44, M4.66.
- `SUPERSEDED-SCOPE` — rows 1; Evidence 0; Owner 1; records M4.30.
- `UNRESOLVED-SUBJECT` — rows 6; Evidence 3; Owner 3; records M4.64, M4.64, M4.65, M4.65, M4.66, M4.66.
- `WRONG-AUTHORITY` — rows 1; Evidence 1; Owner 0; records M4.31.

### 5.5 M6.10 re-derivation and numeric prose

Every M6.10 table row and all 15 ground-distribution rows re-derived from the named mechanical source: **PASS**; no table mismatch. Numeric prose support: 110 rows, 116 tokens, 19 `NO-SINGLE-OWNER`, 9 `PARTIAL-OWNERSHIP`, 28 combined, and 20 `NO-COMPRESSED-SUBSTANCE`; “Two classes” has exactly two named classes. No numeric-prose claim lacks a mechanical source.

| M6.10 row | Stated | Independently derived | Result |
|---|---:|---:|---|
| Live blocks | 65 | 65 | PASS |
| slots / present / omitted | 325 / 68 / 257 | 325 / 68 / 257 | PASS |
| Authorized present / omitted | 2 / 63 | 2 / 63 | PASS |
| Not authorized present / omitted | 4 / 61 | 4 / 61 | PASS |
| Evidence present / omitted | 6 / 59 | 6 / 59 | PASS |
| Owner present / omitted | 14 / 51 | 14 / 51 | PASS |
| Execution present / omitted | 42 / 23 | 42 / 23 | PASS |
| §4.6 register rows | 110 | 110 | PASS |
| blocks omitting all five | 20 | 20, cross-checked M6.2 / item 9 | PASS |
| governed instances / distinct paths | 20 / 19 | 20 / 19, cross-checked M6.4 | PASS |
| tracked-verification / exempt paths | 18 / 1 | 18 / 1 | PASS |
| rejected co-candidates / first-grounded / divergences | 1 / 10 / 7 | 1 / 10 / 7 | PASS |
| definitions / Owner-only / Evidence-only / both | 15 / 6 / 4 / 5 | 15 / 6 / 4 / 5 | PASS |
| 15-row ground-distribution table | 116 tokens across its stated rows | 116 tokens; every token field and row count matches M6.3 | PASS |

### 5.6 File integrity and 5.7 date count

Manifest: strict UTF-8, U+FFFD 0, CRLF 0, bare CR 0, final LF yes, one terminal `@@ASSEMBLY_CURSOR@@`; `313733` bytes, `5935` physical lines, `bc01e0be8d4ed291e0fe1ab21ccae088ff96be08a5ab50f129c1b5fcb771c264`. Resume note: strict UTF-8, U+FFFD 0, CRLF 0, bare CR 0, final LF yes; `59782` bytes, `851` physical lines, `7395262c1772a945957a1f1d735af1dd1f9335c970400a2f6bb6c2099778f18d`. Literal `2026-08-11`: `63`. All PASS.

### Completion-order §5 named comparisons

| # | Claim | Derived source value | Result |
|---:|---|---|---|
| 1 | `Fifteen grounds are used` | 15 | PASS |
| 2 | `ten did not` | 10 | PASS |
| 3 | `One hundred and ten rows` | 110 | PASS |
| 4 | `those ten rows` | 10 | PASS |
| 5 | `Ten rows carry` | 10 | PASS |
| 6 | `Nine of them are` | 9 | PASS |
| 7 | `grew from eight to ten` | 8 → 10 | PASS |
| 8 | `Three records` | 3 (`P3#0`, `P10#0`, `P16#2`) | PASS |
| 9 | `Twenty field instances across nineteen distinct paths` | 20 / 19 | PASS |
| 10 | `Eighteen distinct paths` | 18 | PASS |
| 11 | `63/2; 61/4; 23/42` | 63/2; 61/4; 23/42 | PASS |
| 12 | `thirteen archive wrappers` | 13 | PASS |
| 13 | `nine name-addressed wrappers` | 9 | PASS |
| 14 | `116 tokens over 110 rows` | 116 / 110 | PASS |
| 15 | `19; 9; 28 rows` | 19; 9; 28 | PASS |
| 16 | `20 rows` | 20 | PASS |
| 17 | every M6.10 table row | independently re-derived from rev-4 §5.5 source map | PASS |

### Completion-order §5.1 candidate enumeration and §5.3 residue

Raw mechanical enumeration over M6 prose only: 224 candidates; 28 consumed by named comparisons; 196 unclassified residue. No candidate was excluded by judgment. Each line below gives subsection, UTF-8 byte offset, token, and complete physical line.

```text
UNCLASSIFIED	subsection=M6 preamble	byte_offset=262955	token=4	line=## M6. Optional-field omission register — commission §§4.4 item 10 and 4.6
UNCLASSIFIED	subsection=M6 preamble	byte_offset=262957	token=4	line=## M6. Optional-field omission register — commission §§4.4 item 10 and 4.6
UNCLASSIFIED	subsection=M6 preamble	byte_offset=262964	token=10	line=## M6. Optional-field omission register — commission §§4.4 item 10 and 4.6
UNCLASSIFIED	subsection=M6 preamble	byte_offset=262971	token=4	line=## M6. Optional-field omission register — commission §§4.4 item 10 and 4.6
UNCLASSIFIED	subsection=M6 preamble	byte_offset=262973	token=6	line=## M6. Optional-field omission register — commission §§4.4 item 10 and 4.6
UNCLASSIFIED	subsection=M6 preamble	byte_offset=262989	token=4	line=Commission §4.6 requires a **manifest-level omission register** carrying, for every omitted `Evidence` or
UNCLASSIFIED	subsection=M6 preamble	byte_offset=262991	token=6	line=Commission §4.6 requires a **manifest-level omission register** carrying, for every omitted `Evidence` or
UNCLASSIFIED	subsection=M6 preamble	byte_offset=263168	token=4	line=`Owner` field, the source entry, the candidate label, and the disposition. That is §4.6's whole population:
UNCLASSIFIED	subsection=M6 preamble	byte_offset=263170	token=6	line=`Owner` field, the source entry, the candidate label, and the disposition. That is §4.6's whole population:
UNCLASSIFIED	subsection=M6 preamble	byte_offset=263194	token=4	line=§4.6 is the Evidence-and-Owner resolution section, and its "every omission" means every omission of those
UNCLASSIFIED	subsection=M6 preamble	byte_offset=263196	token=6	line=§4.6 is the Evidence-and-Owner resolution section, and its "every omission" means every omission of those
UNCLASSIFIED	subsection=M6 preamble	byte_offset=263299	token=two	line=two fields. §M6.3 is that register.
UNCLASSIFIED	subsection=M6 preamble	byte_offset=263316	token=3	line=two fields. §M6.3 is that register.
UNCLASSIFIED	subsection=M6 preamble	byte_offset=263337	token=Two	line=Two further instruments justify the wider five-field build. Commission §4.4 item 10 requires an explicit
UNCLASSIFIED	subsection=M6 preamble	byte_offset=263379	token=five	line=Two further instruments justify the wider five-field build. Commission §4.4 item 10 requires an explicit
UNCLASSIFIED	subsection=M6 preamble	byte_offset=263410	token=4	line=Two further instruments justify the wider five-field build. Commission §4.4 item 10 requires an explicit
UNCLASSIFIED	subsection=M6 preamble	byte_offset=263412	token=4	line=Two further instruments justify the wider five-field build. Commission §4.4 item 10 requires an explicit
UNCLASSIFIED	subsection=M6 preamble	byte_offset=263419	token=10	line=Two further instruments justify the wider five-field build. Commission §4.4 item 10 requires an explicit
UNCLASSIFIED	subsection=M6 preamble	byte_offset=263500	token=10	line=`OMIT` for every absent optional field, and commission §10 requires an *optional-field* omission-register
UNCLASSIFIED	subsection=M6 preamble	byte_offset=263591	token=2	line=summary in the migration receipt. §§M6.2 and M6.6 carry that wider population, which §4.6 does not itself
UNCLASSIFIED	subsection=M6 preamble	byte_offset=263600	token=6	line=summary in the migration receipt. §§M6.2 and M6.6 carry that wider population, which §4.6 does not itself
UNCLASSIFIED	subsection=M6 preamble	byte_offset=263639	token=4	line=summary in the migration receipt. §§M6.2 and M6.6 carry that wider population, which §4.6 does not itself
UNCLASSIFIED	subsection=M6 preamble	byte_offset=263641	token=6	line=summary in the migration receipt. §§M6.2 and M6.6 carry that wider population, which §4.6 does not itself
UNCLASSIFIED	subsection=M6 preamble	byte_offset=263791	token=4	line=The register is review evidence. **No byte of this section reaches `DECISIONS.md`,** and commission §4.6
UNCLASSIFIED	subsection=M6 preamble	byte_offset=263793	token=6	line=The register is review evidence. **No byte of this section reaches `DECISIONS.md`,** and commission §4.6
UNCLASSIFIED	subsection=M6.0	byte_offset=263894	token=0	line=### M6.0 Scope, authority, and reading rules
UNCLASSIFIED	subsection=M6.0	byte_offset=264031	token=4	line=**Division of labour, stated so neither obligation is read onto the other surface.** Commission §4.4 item
UNCLASSIFIED	subsection=M6.0	byte_offset=264033	token=4	line=**Division of labour, stated so neither obligation is read onto the other surface.** Commission §4.4 item
UNCLASSIFIED	subsection=M6.0	byte_offset=264040	token=10	line=10 requires each record to carry an explicit `OMIT` for every absent optional field — a *list*, and each
UNCLASSIFIED	subsection=M6.0	byte_offset=264162	token=one	line=record carries one. Commission §4.6 item 4 requires the *reason* for an `Evidence` or `Owner` omission to
UNCLASSIFIED	subsection=M6.0	byte_offset=264180	token=4	line=record carries one. Commission §4.6 item 4 requires the *reason* for an `Evidence` or `Owner` omission to
UNCLASSIFIED	subsection=M6.0	byte_offset=264182	token=6	line=record carries one. Commission §4.6 item 4 requires the *reason* for an `Evidence` or `Owner` omission to
UNCLASSIFIED	subsection=M6.0	byte_offset=264189	token=4	line=record carries one. Commission §4.6 item 4 requires the *reason* for an `Evidence` or `Owner` omission to
UNCLASSIFIED	subsection=M6.0	byte_offset=264366	token=10	line=item 10 as well; ten did not, and their grounds are stated here and flagged at §M6.7. **No record required
CONSUMED	subsection=M6.0	byte_offset=264378	token=ten	line=item 10 as well; ten did not, and their grounds are stated here and flagged at §M6.7. **No record required
UNCLASSIFIED	subsection=M6.0	byte_offset=264445	token=7	line=item 10 as well; ten did not, and their grounds are stated here and flagged at §M6.7. **No record required
UNCLASSIFIED	subsection=M6.0	byte_offset=264498	token=4	line=a byte change to discharge §4.6,** because §4.6 never located the reason at the record.
UNCLASSIFIED	subsection=M6.0	byte_offset=264500	token=6	line=a byte change to discharge §4.6,** because §4.6 never located the reason at the record.
UNCLASSIFIED	subsection=M6.0	byte_offset=264515	token=4	line=a byte change to discharge §4.6,** because §4.6 never located the reason at the record.
UNCLASSIFIED	subsection=M6.0	byte_offset=264517	token=6	line=a byte change to discharge §4.6,** because §4.6 never located the reason at the record.
UNCLASSIFIED	subsection=M6.0	byte_offset=264587	token=2026	line=**The field-test repair of 2026-08-04.** As first authored, this section's ground vocabulary collapsed the
UNCLASSIFIED	subsection=M6.0	byte_offset=264592	token=08	line=**The field-test repair of 2026-08-04.** As first authored, this section's ground vocabulary collapsed the
UNCLASSIFIED	subsection=M6.0	byte_offset=264595	token=04	line=**The field-test repair of 2026-08-04.** As first authored, this section's ground vocabulary collapsed the
UNCLASSIFIED	subsection=M6.0	byte_offset=264713	token=one	line=`Evidence` and `Owner` eligibility tests into one complete-statement test and cited standing ruling 23 as
UNCLASSIFIED	subsection=M6.0	byte_offset=264767	token=23	line=`Evidence` and `Owner` eligibility tests into one complete-statement test and cited standing ruling 23 as
UNCLASSIFIED	subsection=M6.0	byte_offset=264795	token=23	line=its authority. Ruling 23 says the opposite: it refines the complete-statement language **for `Evidence`
UNCLASSIFIED	subsection=M6.0	byte_offset=264948	token=1	line=only** and leaves `Owner`'s whole-statement test intact. M2's target §1 bytes already record the
UNCLASSIFIED	subsection=M6.0	byte_offset=265034	token=2026	line=single-test formulation as a legacy-prose defect, repaired 2026-07-31. The vocabulary at §M6.1 is now
UNCLASSIFIED	subsection=M6.0	byte_offset=265039	token=07	line=single-test formulation as a legacy-prose defect, repaired 2026-07-31. The vocabulary at §M6.1 is now
UNCLASSIFIED	subsection=M6.0	byte_offset=265042	token=31	line=single-test formulation as a legacy-prose defect, repaired 2026-07-31. The vocabulary at §M6.1 is now
UNCLASSIFIED	subsection=M6.0	byte_offset=265069	token=1	line=single-test formulation as a legacy-prose defect, repaired 2026-07-31. The vocabulary at §M6.1 is now
UNCLASSIFIED	subsection=M6.0	byte_offset=265100	token=ten	line=field-differentiated, ten `Evidence` rows were re-adjudicated on Evidence-appropriate grounds, and a
UNCLASSIFIED	subsection=M6.0	byte_offset=265215	token=10	line=separate bounded repair to the item-10 `Evidence` reasoning of fifteen M4 records is governed by its own
UNCLASSIFIED	subsection=M6.0	byte_offset=265242	token=fifteen	line=separate bounded repair to the item-10 `Evidence` reasoning of fifteen M4 records is governed by its own
UNCLASSIFIED	subsection=M6.0	byte_offset=265399	token=two	line=repair.** The two governing tests are:
UNCLASSIFIED	subsection=M6.0	byte_offset=265449	token=one	line=- **`Owner`** names the one tracked path that owns the whole live statement. It is defeated by an operative
UNCLASSIFIED	subsection=M6.0	byte_offset=265629	token=28	line=  limb with its own independent enforcement surface in another tracked path — standing ruling 28 — and not
UNCLASSIFIED	subsection=M6.0	byte_offset=265727	token=one	line=- **`Evidence`** names the one tracked source carrying the evidence, measurement, provenance, or method the
UNCLASSIFIED	subsection=M6.0	byte_offset=265990	token=10	line=**Closed-world.** Part D §10.2 directs that the assembly pass inline the union of the Part A, Part B, and
UNCLASSIFIED	subsection=M6.0	byte_offset=265993	token=2	line=**Closed-world.** Part D §10.2 directs that the assembly pass inline the union of the Part A, Part B, and
UNCLASSIFIED	subsection=M6.0	byte_offset=266247	token=4	line=**Supersession.** This section supersedes Part A §4, Part B §5, Part C §7, and Part D §§10.1–10.2 as
UNCLASSIFIED	subsection=M6.0	byte_offset=266259	token=5	line=**Supersession.** This section supersedes Part A §4, Part B §5, Part C §7, and Part D §§10.1–10.2 as
UNCLASSIFIED	subsection=M6.0	byte_offset=266271	token=7	line=**Supersession.** This section supersedes Part A §4, Part B §5, Part C §7, and Part D §§10.1–10.2 as
UNCLASSIFIED	subsection=M6.0	byte_offset=266289	token=10	line=**Supersession.** This section supersedes Part A §4, Part B §5, Part C §7, and Part D §§10.1–10.2 as
UNCLASSIFIED	subsection=M6.0	byte_offset=266292	token=1	line=**Supersession.** This section supersedes Part A §4, Part B §5, Part C §7, and Part D §§10.1–10.2 as
UNCLASSIFIED	subsection=M6.0	byte_offset=266296	token=10	line=**Supersession.** This section supersedes Part A §4, Part B §5, Part C §7, and Part D §§10.1–10.2 as
UNCLASSIFIED	subsection=M6.0	byte_offset=266299	token=2	line=**Supersession.** This section supersedes Part A §4, Part B §5, Part C §7, and Part D §§10.1–10.2 as
UNCLASSIFIED	subsection=M6.0	byte_offset=266334	token=four	line=construction authority. Those four registers remain historical inputs and are stale in the places recorded
UNCLASSIFIED	subsection=M6.0	byte_offset=266419	token=8	line=at §M6.8. Where a draft register and this section differ, this section governs, and where this section and
UNCLASSIFIED	subsection=M6.0	byte_offset=266668	token=2	line=**Derivation.** The ledger at §M6.2 and the register at §M6.3 were derived from the M4 records' own item 9
UNCLASSIFIED	subsection=M6.0	byte_offset=266695	token=3	line=**Derivation.** The ledger at §M6.2 and the register at §M6.3 were derived from the M4 records' own item 9
UNCLASSIFIED	subsection=M6.0	byte_offset=266740	token=9	line=**Derivation.** The ledger at §M6.2 and the register at §M6.3 were derived from the M4 records' own item 9
UNCLASSIFIED	subsection=M6.0	byte_offset=266763	token=10	line=field lines and item 10 omission lists in this file, not from the drafts and not from memory. Candidate
UNCLASSIFIED	subsection=M6.0	byte_offset=267237	token=two	line=the two drift, which is the defect class this migration exists to prevent. The `ground` column is a
UNCLASSIFIED	subsection=M6.0	byte_offset=267540	token=1	line=spans are date-bearing surfaces under M7.1 and the post-assembly derived report must claim each of them;
UNCLASSIFIED	subsection=M6.0	byte_offset=267704	token=30	line=they are **not** functions of `MIGRATION_DATE` and re-render on no rebinding. Under standing ruling 30 this
UNCLASSIFIED	subsection=M6.0	byte_offset=267807	token=4	line=section reproduces no migration-date literal: `E038`'s `Evidence` value is referred to at §M6.4 by pointer
UNCLASSIFIED	subsection=M6.0	byte_offset=267830	token=1	line=to the M0.1 pin rather than typed out, so M6 adds no date-dependent span to the manifest.
UNCLASSIFIED	subsection=M6.1	byte_offset=267918	token=1	line=### M6.1 Ground vocabulary
CONSUMED	subsection=M6.1	byte_offset=267939	token=Fifteen	line=Fifteen grounds are used. A row may carry more than one. **Every ground declares which field it may serve.**
UNCLASSIFIED	subsection=M6.1	byte_offset=267991	token=one	line=Fifteen grounds are used. A row may carry more than one. **Every ground declares which field it may serve.**
UNCLASSIFIED	subsection=M6.1	byte_offset=268118	token=two	line=A vocabulary that cannot express that distinction is what allowed the two tests to be collapsed in the first
UNCLASSIFIED	subsection=M6.1	byte_offset=268466	token=one	line=it, rather than adjudicating one hundred and ten calls separately.
UNCLASSIFIED	subsection=M6.1	byte_offset=268470	token=hundred	line=it, rather than adjudicating one hundred and ten calls separately.
UNCLASSIFIED	subsection=M6.1	byte_offset=268482	token=ten	line=it, rather than adjudicating one hundred and ten calls separately.
UNCLASSIFIED	subsection=M6.2	byte_offset=271498	token=2	line=### M6.2 Per-block optional-field ledger — commission §4.4 item 10
UNCLASSIFIED	subsection=M6.2	byte_offset=271549	token=4	line=### M6.2 Per-block optional-field ledger — commission §4.4 item 10
UNCLASSIFIED	subsection=M6.2	byte_offset=271551	token=4	line=### M6.2 Per-block optional-field ledger — commission §4.4 item 10
UNCLASSIFIED	subsection=M6.2	byte_offset=271558	token=10	line=### M6.2 Per-block optional-field ledger — commission §4.4 item 10
UNCLASSIFIED	subsection=M6.2	byte_offset=271713	token=10	line=carries an explicit `OMIT` at its own item 10 for every field in its `omitted` column; this table is the
UNCLASSIFIED	subsection=M6.2	byte_offset=271837	token=0	line=Source-entry column note: `P2#0` and `P5#0` additionally carry the `E037` rule 2 merge contribution, `P8#0`
UNCLASSIFIED	subsection=M6.2	byte_offset=271848	token=0	line=Source-entry column note: `P2#0` and `P5#0` additionally carry the `E037` rule 2 merge contribution, `P8#0`
UNCLASSIFIED	subsection=M6.2	byte_offset=271886	token=2	line=Source-entry column note: `P2#0` and `P5#0` additionally carry the `E037` rule 2 merge contribution, `P8#0`
UNCLASSIFIED	subsection=M6.2	byte_offset=271912	token=0	line=Source-entry column note: `P2#0` and `P5#0` additionally carry the `E037` rule 2 merge contribution, `P8#0`
UNCLASSIFIED	subsection=M6.2	byte_offset=271952	token=1	line=additionally carries the `E037` rule 1 merge contribution, and `E043a` is recorded at its record with
UNCLASSIFIED	subsection=M6.2	byte_offset=272096	token=1	line=containing contexts `E036` and `E043b`. Those relationships are pinned at item 1 of each record and are not
UNCLASSIFIED	subsection=M6.3	byte_offset=279231	token=3	line=### M6.3 `Evidence` and `Owner` omission register — commission §4.6
UNCLASSIFIED	subsection=M6.3	byte_offset=279291	token=4	line=### M6.3 `Evidence` and `Owner` omission register — commission §4.6
UNCLASSIFIED	subsection=M6.3	byte_offset=279293	token=6	line=### M6.3 `Evidence` and `Owner` omission register — commission §4.6
CONSUMED	subsection=M6.3	byte_offset=279296	token=One	line=One hundred and ten rows. `disposition` is `OMIT` on every row, as commission §4.6 item 4 requires when a
CONSUMED	subsection=M6.3	byte_offset=279300	token=hundred	line=One hundred and ten rows. `disposition` is `OMIT` on every row, as commission §4.6 item 4 requires when a
CONSUMED	subsection=M6.3	byte_offset=279312	token=ten	line=One hundred and ten rows. `disposition` is `OMIT` on every row, as commission §4.6 item 4 requires when a
UNCLASSIFIED	subsection=M6.3	byte_offset=279376	token=4	line=One hundred and ten rows. `disposition` is `OMIT` on every row, as commission §4.6 item 4 requires when a
UNCLASSIFIED	subsection=M6.3	byte_offset=279378	token=6	line=One hundred and ten rows. `disposition` is `OMIT` on every row, as commission §4.6 item 4 requires when a
UNCLASSIFIED	subsection=M6.3	byte_offset=279385	token=4	line=One hundred and ten rows. `disposition` is `OMIT` on every row, as commission §4.6 item 4 requires when a
UNCLASSIFIED	subsection=M6.3	byte_offset=279441	token=one	line=candidate does not resolve to exactly one tracked path that satisfies the field's test. A dagger in the
CONSUMED	subsection=M6.3	byte_offset=279602	token=ten	line=`ground` column marks a row whose ground is first stated here rather than at the record; those ten rows
UNCLASSIFIED	subsection=M6.3	byte_offset=279643	token=7	line=are listed and reasoned at §M6.7.
UNCLASSIFIED	subsection=M6.4	byte_offset=292124	token=4	line=### M6.4 Governed field-path population — every present `Evidence` and `Owner`
UNCLASSIFIED	subsection=M6.4	byte_offset=292212	token=4	line=Commission §4.6 items 1–3 govern present values, and commission §4.9 obliges the independent reviewer to
UNCLASSIFIED	subsection=M6.4	byte_offset=292214	token=6	line=Commission §4.6 items 1–3 govern present values, and commission §4.9 obliges the independent reviewer to
UNCLASSIFIED	subsection=M6.4	byte_offset=292222	token=1	line=Commission §4.6 items 1–3 govern present values, and commission §4.9 obliges the independent reviewer to
UNCLASSIFIED	subsection=M6.4	byte_offset=292226	token=3	line=Commission §4.6 items 1–3 govern present values, and commission §4.9 obliges the independent reviewer to
UNCLASSIFIED	subsection=M6.4	byte_offset=292268	token=4	line=Commission §4.6 items 1–3 govern present values, and commission §4.9 obliges the independent reviewer to
UNCLASSIFIED	subsection=M6.4	byte_offset=292270	token=9	line=Commission §4.6 items 1–3 govern present values, and commission §4.9 obliges the independent reviewer to
UNCLASSIFIED	subsection=M6.4	byte_offset=292398	token=one	line=verify each present path is tracked. The population is pinned here so that obligation has one address.
CONSUMED	subsection=M6.4	byte_offset=292414	token=Twenty	line=**Twenty field instances across nineteen distinct paths.** `src/schema.ts` is the only path used twice,
CONSUMED	subsection=M6.4	byte_offset=292444	token=nineteen	line=**Twenty field instances across nineteen distinct paths.** `src/schema.ts` is the only path used twice,
UNCLASSIFIED	subsection=M6.4	byte_offset=294025	token=10	line=Row 10 is the one future-output value in the set. It is `E038`'s `Evidence`, and it is the single path
UNCLASSIFIED	subsection=M6.4	byte_offset=294035	token=one	line=Row 10 is the one future-output value in the set. It is `E038`'s `Evidence`, and it is the single path
UNCLASSIFIED	subsection=M6.4	byte_offset=294209	token=3	line=exempt from the `git ls-files` tracked-path check, under the sequencing exception M5.3 records as exhausted
UNCLASSIFIED	subsection=M6.4	byte_offset=294240	token=one	line=by this one use. It is equal by construction to the M0.1 normalized archive filename pin and is written here
UNCLASSIFIED	subsection=M6.4	byte_offset=294287	token=1	line=by this one use. It is equal by construction to the M0.1 normalized archive filename pin and is written here
UNCLASSIFIED	subsection=M6.4	byte_offset=294401	token=30	line=as a pointer rather than as a literal under standing ruling 30, so this table adds no date-dependent span.
CONSUMED	subsection=M6.4	byte_offset=294450	token=Eighteen	line=**Eighteen distinct paths therefore require live tracked-path verification; one is exempt, and no path in
UNCLASSIFIED	subsection=M6.4	byte_offset=294524	token=one	line=**Eighteen distinct paths therefore require live tracked-path verification; one is exempt, and no path in
UNCLASSIFIED	subsection=M6.4	byte_offset=294690	token=3	line=This population supersedes the deterministic-prerequisites Task 3 artifact. That artifact's recorded
UNCLASSIFIED	subsection=M6.4	byte_offset=294780	token=1	line=population predates the removal of `Owner` from `P15#1`, `R2#0`, `E043a`, `E066`, and `E071`, the removal of
UNCLASSIFIED	subsection=M6.4	byte_offset=294788	token=0	line=population predates the removal of `Owner` from `P15#1`, `R2#0`, `E043a`, `E066`, and `E071`, the removal of
UNCLASSIFIED	subsection=M6.4	byte_offset=294857	token=2	line=`Evidence` from `P25#2`, and the whole of the later name-addressed authoring, so it is stale in both its
UNCLASSIFIED	subsection=M6.4	byte_offset=294973	token=3	line=totals and its membership. Task 3 is rerun or explicitly superseded against these twenty instances and
UNCLASSIFIED	subsection=M6.4	byte_offset=295023	token=twenty	line=totals and its membership. Task 3 is rerun or explicitly superseded against these twenty instances and
UNCLASSIFIED	subsection=M6.4	byte_offset=295044	token=nineteen	line=nineteen distinct paths, not against its own recorded rows.
UNCLASSIFIED	subsection=M6.5	byte_offset=295112	token=5	line=### M6.5 Rejected co-candidates on a populated field
UNCLASSIFIED	subsection=M6.5	byte_offset=295159	token=One	line=One candidate was considered and rejected on a field that is nevertheless present. It generates no §4.6
UNCLASSIFIED	subsection=M6.5	byte_offset=295260	token=4	line=One candidate was considered and rejected on a field that is nevertheless present. It generates no §4.6
UNCLASSIFIED	subsection=M6.5	byte_offset=295262	token=6	line=One candidate was considered and rejected on a field that is nevertheless present. It generates no §4.6
UNCLASSIFIED	subsection=M6.6	byte_offset=295681	token=6	line=### M6.6 `Authorized`, `Not authorized`, and `Execution` omissions
UNCLASSIFIED	subsection=M6.6	byte_offset=295748	token=three	line=These three fields sit outside commission §4.6's candidate-resolution procedure — none of them takes a
UNCLASSIFIED	subsection=M6.6	byte_offset=295786	token=4	line=These three fields sit outside commission §4.6's candidate-resolution procedure — none of them takes a
UNCLASSIFIED	subsection=M6.6	byte_offset=295788	token=6	line=These three fields sit outside commission §4.6's candidate-resolution procedure — none of them takes a
UNCLASSIFIED	subsection=M6.6	byte_offset=295924	token=4	line=repository path — but each absence is still an architect decision under §4.4 item 10, and silence is not an
UNCLASSIFIED	subsection=M6.6	byte_offset=295926	token=4	line=repository path — but each absence is still an architect decision under §4.4 item 10, and silence is not an
UNCLASSIFIED	subsection=M6.6	byte_offset=295933	token=10	line=repository path — but each absence is still an architect decision under §4.4 item 10, and silence is not an
UNCLASSIFIED	subsection=M6.6	byte_offset=296012	token=2	line=omission. Membership is the `omitted` column of §M6.2; the grounds are classed here.
CONSUMED	subsection=M6.6	byte_offset=296065	token=63	line=**`Authorized` — 63 omissions, 2 present.** Present on `R1#0` and `R6#0`. The uniform ground is that the
CONSUMED	subsection=M6.6	byte_offset=296079	token=2	line=**`Authorized` — 63 omissions, 2 present.** Present on `R1#0` and `R6#0`. The uniform ground is that the
UNCLASSIFIED	subsection=M6.6	byte_offset=296107	token=0	line=**`Authorized` — 63 omissions, 2 present.** Present on `R1#0` and `R6#0`. The uniform ground is that the
UNCLASSIFIED	subsection=M6.6	byte_offset=296118	token=0	line=**`Authorized` — 63 omissions, 2 present.** Present on `R1#0` and `R6#0`. The uniform ground is that the
UNCLASSIFIED	subsection=M6.6	byte_offset=296299	token=One	line=the statement or manufacture a grant. One record's ground is specific and is stated at its item 10: `R5#0`
UNCLASSIFIED	subsection=M6.6	byte_offset=296357	token=10	line=the statement or manufacture a grant. One record's ground is specific and is stated at its item 10: `R5#0`
UNCLASSIFIED	subsection=M6.6	byte_offset=296365	token=0	line=the statement or manufacture a grant. One record's ground is specific and is stated at its item 10: `R5#0`
UNCLASSIFIED	subsection=M6.6	byte_offset=296455	token=three	line=keeps its implementation latitude inside the statement because the grant is bounded by three constraints in
CONSUMED	subsection=M6.6	byte_offset=296625	token=61	line=**`Not authorized` — 61 omissions, 4 present.** Present on `P5#1`, `P29#0`, `P30#0`, and `R6#0`. The uniform
CONSUMED	subsection=M6.6	byte_offset=296639	token=4	line=**`Not authorized` — 61 omissions, 4 present.** Present on `P5#1`, `P29#0`, `P30#0`, and `R6#0`. The uniform
UNCLASSIFIED	subsection=M6.6	byte_offset=296667	token=1	line=**`Not authorized` — 61 omissions, 4 present.** Present on `P5#1`, `P29#0`, `P30#0`, and `R6#0`. The uniform
UNCLASSIFIED	subsection=M6.6	byte_offset=296676	token=0	line=**`Not authorized` — 61 omissions, 4 present.** Present on `P5#1`, `P29#0`, `P30#0`, and `R6#0`. The uniform
UNCLASSIFIED	subsection=M6.6	byte_offset=296685	token=0	line=**`Not authorized` — 61 omissions, 4 present.** Present on `P5#1`, `P29#0`, `P30#0`, and `R6#0`. The uniform
UNCLASSIFIED	subsection=M6.6	byte_offset=296697	token=0	line=**`Not authorized` — 61 omissions, 4 present.** Present on `P5#1`, `P29#0`, `P30#0`, and `R6#0`. The uniform
UNCLASSIFIED	subsection=M6.6	byte_offset=296805	token=Four	line=ground is that the entry withholds no permission beyond what its statement already carries. Four records
UNCLASSIFIED	subsection=M6.6	byte_offset=296855	token=10	line=carry specific grounds at their item 10 and are the reviewable set here: `R1#0`, whose only negative limb is
UNCLASSIFIED	subsection=M6.6	byte_offset=296895	token=0	line=carry specific grounds at their item 10 and are the reviewable set here: `R1#0`, whose only negative limb is
UNCLASSIFIED	subsection=M6.6	byte_offset=296947	token=two	line=a non-relaxation of two existing disciplines that the statement carries directly; `R3#0` and `R5#0`, whose
UNCLASSIFIED	subsection=M6.6	byte_offset=297013	token=0	line=a non-relaxation of two existing disciplines that the statement carries directly; `R3#0` and `R5#0`, whose
UNCLASSIFIED	subsection=M6.6	byte_offset=297024	token=0	line=a non-relaxation of two existing disciplines that the statement carries directly; `R3#0` and `R5#0`, whose
UNCLASSIFIED	subsection=M6.6	byte_offset=297092	token=7	line=negative limbs concern vital-sign sides that the target §7 thread carries rather than these entries; and
UNCLASSIFIED	subsection=M6.6	byte_offset=297144	token=0	line=`R4#0`, whose permanent unavailability of the bootstrap is a live rule the statement carries rather than a
UNCLASSIFIED	subsection=M6.6	byte_offset=297284	token=24	line=withheld permission. Standing ruling 24 governs the opposite direction — a ruling's closing
UNCLASSIFIED	subsection=M6.6	byte_offset=297428	token=0	line=non-authorization belongs in this field rather than being compressed away — and `P29#0` and `P30#0` are the
UNCLASSIFIED	subsection=M6.6	byte_offset=297440	token=0	line=non-authorization belongs in this field rather than being compressed away — and `P29#0` and `P30#0` are the
UNCLASSIFIED	subsection=M6.6	byte_offset=297451	token=two	line=two records where it fired.
CONSUMED	subsection=M6.6	byte_offset=297498	token=23	line=**`Execution` — 23 omissions, 42 present.** The dominant ground is that the frozen classification carries no
CONSUMED	subsection=M6.6	byte_offset=297512	token=42	line=**`Execution` — 23 omissions, 42 present.** The dominant ground is that the frozen classification carries no
UNCLASSIFIED	subsection=M6.6	byte_offset=297731	token=10	line=records add a second limb at item 10 — that the entry decides nothing implementable, advises rather than
UNCLASSIFIED	subsection=M6.6	byte_offset=297912	token=one	line=one optional field whose omissions are mostly not discretionary,** and a reviewer should test them against
UNCLASSIFIED	subsection=M6.7	byte_offset=298099	token=7	line=### M6.7 Omissions first grounded at M6
CONSUMED	subsection=M6.7	byte_offset=298133	token=Ten	line=Ten rows carry a ground stated here rather than at the record. Nine of them are `NO-CANDIDATE` on
CONSUMED	subsection=M6.7	byte_offset=298196	token=Nine	line=Ten rows carry a ground stated here rather than at the record. Nine of them are `NO-CANDIDATE` on
CONSUMED	subsection=M6.7	byte_offset=298572	token=eight	line=The population grew from eight to ten on 2026-08-04. `P4#0` and `P7#0` were added: their draft registers
CONSUMED	subsection=M6.7	byte_offset=298581	token=ten	line=The population grew from eight to ten on 2026-08-04. `P4#0` and `P7#0` were added: their draft registers
UNCLASSIFIED	subsection=M6.7	byte_offset=298588	token=2026	line=The population grew from eight to ten on 2026-08-04. `P4#0` and `P7#0` were added: their draft registers
UNCLASSIFIED	subsection=M6.7	byte_offset=298593	token=08	line=The population grew from eight to ten on 2026-08-04. `P4#0` and `P7#0` were added: their draft registers
UNCLASSIFIED	subsection=M6.7	byte_offset=298596	token=04	line=The population grew from eight to ten on 2026-08-04. `P4#0` and `P7#0` were added: their draft registers
UNCLASSIFIED	subsection=M6.7	byte_offset=298604	token=0	line=The population grew from eight to ten on 2026-08-04. `P4#0` and `P7#0` were added: their draft registers
UNCLASSIFIED	subsection=M6.7	byte_offset=298615	token=0	line=The population grew from eight to ten on 2026-08-04. `P4#0` and `P7#0` were added: their draft registers
UNCLASSIFIED	subsection=M6.7	byte_offset=298812	token=one	line=discharges the `Owner` omission and not the `Evidence` one. A joint row carrying one field-shaped reason is
UNCLASSIFIED	subsection=M6.7	byte_offset=298838	token=one	line=discharges the `Owner` omission and not the `Evidence` one. A joint row carrying one field-shaped reason is
UNCLASSIFIED	subsection=M6.7	byte_offset=300664	token=23	line=**Why the `Owner` ground was not copied across.** Standing ruling 23 fixes that `Evidence` and `Owner` have
CONSUMED	subsection=M6.7	byte_offset=300816	token=Three	line=record. Three records — `P3#0`, `P10#0`, and `P16#2` — also carried a bare `Evidence — OMIT` at item 10 and
UNCLASSIFIED	subsection=M6.7	byte_offset=300838	token=0	line=record. Three records — `P3#0`, `P10#0`, and `P16#2` — also carried a bare `Evidence — OMIT` at item 10 and
UNCLASSIFIED	subsection=M6.7	byte_offset=300847	token=0	line=record. Three records — `P3#0`, `P10#0`, and `P16#2` — also carried a bare `Evidence — OMIT` at item 10 and
UNCLASSIFIED	subsection=M6.7	byte_offset=300860	token=2	line=record. Three records — `P3#0`, `P10#0`, and `P16#2` — also carried a bare `Evidence — OMIT` at item 10 and
UNCLASSIFIED	subsection=M6.7	byte_offset=300915	token=10	line=record. Three records — `P3#0`, `P10#0`, and `P16#2` — also carried a bare `Evidence — OMIT` at item 10 and
UNCLASSIFIED	subsection=M6.7	byte_offset=300953	token=2	line=are **not** flagged here. `P16#2`'s draft reason is expressly applicable to both fields; `P3#0` and `P10#0`
UNCLASSIFIED	subsection=M6.7	byte_offset=301015	token=0	line=are **not** flagged here. `P16#2`'s draft reason is expressly applicable to both fields; `P3#0` and `P10#0`
UNCLASSIFIED	subsection=M6.7	byte_offset=301027	token=0	line=are **not** flagged here. `P16#2`'s draft reason is expressly applicable to both fields; `P3#0` and `P10#0`
UNCLASSIFIED	subsection=M6.7	byte_offset=301046	token=10	line=have their item-10 `Evidence` reasoning repaired under the 2026-08-04 work order, so their grounds are
UNCLASSIFIED	subsection=M6.7	byte_offset=301089	token=2026	line=have their item-10 `Evidence` reasoning repaired under the 2026-08-04 work order, so their grounds are
UNCLASSIFIED	subsection=M6.7	byte_offset=301094	token=08	line=have their item-10 `Evidence` reasoning repaired under the 2026-08-04 work order, so their grounds are
UNCLASSIFIED	subsection=M6.7	byte_offset=301097	token=04	line=have their item-10 `Evidence` reasoning repaired under the 2026-08-04 work order, so their grounds are
UNCLASSIFIED	subsection=M6.8	byte_offset=301185	token=8	line=### M6.8 Divergences from the draft omission registers
UNCLASSIFIED	subsection=M6.8	byte_offset=301387	token=12	line=case the manifest governs under standing ruling 12.
UNCLASSIFIED	subsection=M6.9	byte_offset=303181	token=9	line=### M6.9 Surfaces that generate no register row
CONSUMED	subsection=M6.9	byte_offset=303304	token=thirteen	line=- **The thirteen archive wrappers at M5.5.** The amended archive grammar admits `Kind`, `Status`, `Force`,
UNCLASSIFIED	subsection=M6.9	byte_offset=303336	token=5	line=- **The thirteen archive wrappers at M5.5.** The amended archive grammar admits `Kind`, `Status`, `Force`,
UNCLASSIFIED	subsection=M6.9	byte_offset=303557	token=one	line=  and no `Owner` field, so no wrapper can omit one. The nine name-addressed wrappers carry no `Retired ID`,
CONSUMED	subsection=M6.9	byte_offset=303566	token=nine	line=  and no `Owner` field, so no wrapper can omit one. The nine name-addressed wrappers carry no `Retired ID`,
UNCLASSIFIED	subsection=M6.9	byte_offset=303841	token=8	line=- **The target §8 structural introduction carrying `E053`.** Structural prose, not an entry block; it has no
UNCLASSIFIED	subsection=M6.9	byte_offset=303994	token=three	line=- **The `E037` merge row.** It dissolves into three target records and has no independent block, so its
UNCLASSIFIED	subsection=M6.9	byte_offset=304092	token=0	line=  optional fields are the fields of `P2#0`, `P5#0`, and `P8#0`, already registered.
UNCLASSIFIED	subsection=M6.9	byte_offset=304100	token=0	line=  optional fields are the fields of `P2#0`, `P5#0`, and `P8#0`, already registered.
UNCLASSIFIED	subsection=M6.9	byte_offset=304112	token=0	line=  optional fields are the fields of `P2#0`, `P5#0`, and `P8#0`, already registered.
UNCLASSIFIED	subsection=M6.9	byte_offset=304144	token=six	line=- **The six-row retired-identifier register.** A table of identifier dispositions, not entry blocks.
UNCLASSIFIED	subsection=M6.10	byte_offset=304245	token=10	line=### M6.10 Derived counts
UNCLASSIFIED	subsection=M6.10	byte_offset=305494	token=110	line=Ground distribution across the 110 register rows, counting each ground token once per row it appears on,
CONSUMED	subsection=M6.10	byte_offset=305572	token=116	line=for 116 tokens over 110 rows:
CONSUMED	subsection=M6.10	byte_offset=305588	token=110	line=for 116 tokens over 110 rows:
UNCLASSIFIED	subsection=M6.10	byte_offset=306195	token=Two	line=**Two classes carry most of the register and are the ones to test as classes.** `NO-SINGLE-OWNER` at 19 rows
CONSUMED	subsection=M6.10	byte_offset=306294	token=19	line=**Two classes carry most of the register and are the ones to test as classes.** `NO-SINGLE-OWNER` at 19 rows
CONSUMED	subsection=M6.10	byte_offset=306329	token=9	line=and `PARTIAL-OWNERSHIP` at 9 are the same whole-statement ownership test at different candidate counts, and
CONSUMED	subsection=M6.10	byte_offset=306430	token=28	line=together they carry 28 rows; if that test is misapplied, it is misapplied 28 times. `NO-COMPRESSED-SUBSTANCE`
UNCLASSIFIED	subsection=M6.10	byte_offset=306484	token=28	line=together they carry 28 rows; if that test is misapplied, it is misapplied 28 times. `NO-COMPRESSED-SUBSTANCE`
CONSUMED	subsection=M6.10	byte_offset=306523	token=20	line=at 20 rows concentrates in the name-addressed `I` batches, where a single mistaken reading of what `Evidence`
UNCLASSIFIED	subsection=M6.10	byte_offset=306869	token=1	line=That is the field-applicability invariant, and it is checkable mechanically against §M6.1's `field` column
```

## 6. Folded obligations

### 6.1 Task 2 — complete rerun

`countStatementSentences` was read before the harness. It scans runs of `.?!`, skips decimal-internal runs and recognized abbreviations, then counts only a run followed (after closing quotes/brackets) by end-of-string or whitespace plus a Unicode-uppercase character. The harness passed only exact item-8 `text`-fence content to the actual exported function, with no fence, heading, item label, or other bytes.

```text
TASK2	M4.2	`P1#0`	count=2
TASK2	M4.3	`P2#0`	count=2
TASK2	M4.4	`P2#1`	count=2
TASK2	M4.5	`P3#0`	count=3
TASK2	M4.6	`P4#0`	count=2
TASK2	M4.7	`P5#0`	count=2
TASK2	M4.8	`P5#1`	count=2
TASK2	M4.9	`P6#0`	count=3
TASK2	M4.10	`P7#0`	count=2
TASK2	M4.11	`P8#0`	count=3
TASK2	M4.12	`P10#0`	count=3
TASK2	M4.13	`P11#0`	count=3
TASK2	M4.14	`P15#0`	count=2
TASK2	M4.15	`P15#1`	count=3
TASK2	M4.16	`P16#0`	count=2
TASK2	M4.17	`P16#1`	count=3
TASK2	M4.18	`P16#2`	count=2
TASK2	M4.19	`P17#0`	count=3
TASK2	M4.20	`P19#0`	count=3
TASK2	M4.21	`P20#0`	count=3
TASK2	M4.22	`P21#0`	count=3
TASK2	M4.23	`P21#1`	count=3
TASK2	M4.24	`P21#2`	count=3
TASK2	M4.25	`P23#0`	count=3
TASK2	M4.26	`P23#1`	count=3
TASK2	M4.27	`P23#2`	count=3
TASK2	M4.28	`P24#0`	count=3
TASK2	M4.29	`P25#0`	count=3
TASK2	M4.30	`P25#1`	count=3
TASK2	M4.31	`P25#2`	count=3
TASK2	M4.32	`P25#3`	count=3
TASK2	M4.33	`P26#0`	count=3
TASK2	M4.34	`P27#0`	count=3
TASK2	M4.35	`P28#0`	count=3
TASK2	M4.36	`P29#0`	count=3
TASK2	M4.37	`P30#0`	count=3
TASK2	M4.38	`P31#0`	count=3
TASK2	M4.39	`R1#0`	count=3
TASK2	M4.40	`R2#0`	count=3
TASK2	M4.41	`R3#0`	count=3
TASK2	M4.42	`R4#0`	count=3
TASK2	M4.43	`R5#0`	count=3
TASK2	M4.44	`R6#0`	count=3
TASK2	M4.45	`Producer assignments are operational state, not constitutional text`	count=2
TASK2	M4.46	`Deterministic review routing for promoted opus-prefixed case IDs`	count=3
TASK2	M4.47	`Runtime audio carries no client-embedded secret`	count=2
TASK2	M4.48	`Bilingual English and Simplified Chinese parity on all displayed text`	count=1
TASK2	M4.49	`Topic labels are English-only`	count=2
TASK2	M4.50	`JSON quote hygiene is a parse-time gate`	count=2
TASK2	M4.51	`Question IDs are globally unique across bundled banks`	count=2
TASK2	M4.52	`Raw-draft filename prefix routes to its canonical bank`	count=3
TASK2	M4.53	`Canonical merges are deterministic and gated`	count=1
TASK2	M4.54	`Runtime stays static, offline, and file-protocol compatible`	count=2
TASK2	M4.55	`Schema versions are an ordered token, not semver`	count=3
TASK2	M4.56	`Schema changes are rare and deliberate`	count=1
TASK2	M4.57	`Shared visual numeric helpers have a single definition`	count=1
TASK2	M4.58	`Case-study exhibit IDs share one namespace`	count=2
TASK2	M4.59	`Category targets are the current test-plan weights`	count=2
TASK2	M4.60	`Bank composition is a floor problem, not a balance problem`	count=2
TASK2	M4.61	`Repository-state hygiene is mechanism-specific`	count=2
TASK2	M4.62	`Some topics are deliberately shared across categories`	count=2
TASK2	M4.63	`Highlight's structural bias gate is schema-level`	count=2
TASK2	M4.64	`Translation-friction scoring`	count=2
TASK2	M4.65	`Exam-condition test and adaptive modes`	count=3
TASK2	M4.66	`Unresolved vital sanity bounds`	count=3
TASK2_DISTRIBUTION_FULL=1=4 / 2=23 / 3=38
TASK2_DISTRIBUTION_M4_2_TO_44=2=10 / 3=33
TASK2_OUTSIDE_1_2_3=none
TASK2_FIRST_CHAR_BACKTICK=none
```

### 6.2 Task 3 — governed field paths

Independent item-9 population: 20 field instances, 19 distinct paths; `src/schema.ts` is the only repeat (2 instances). Population 1 has 18 paths and every `git ls-files --error-unmatch` result is TRACKED. Population 2 is only E038 `Evidence`: `Archive/DECISIONS-ARCHIVE-2026-08-11.md` equals M0.1’s normalized archive filename byte-for-byte (PASS), so it is EXEMPT and was not pooled into Population 1.

```text
TASK3_INSTANCE	M4.2	Owner	lib/shuffle.ts
TASK3_INSTANCE	M4.14	Owner	scripts/patch-raw.ts
TASK3_INSTANCE	M4.17	Owner	scripts/audit/non-mcq-bias-lib.ts
TASK3_INSTANCE	M4.26	Owner	src/examLayout.ts
TASK3_INSTANCE	M4.36	Evidence	audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json
TASK3_INSTANCE	M4.37	Evidence	audit/lab-reference-range-verification-2026-07-19.md
TASK3_INSTANCE	M4.41	Evidence	Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md
TASK3_INSTANCE	M4.41	Owner	src/measurementAllowlist.ts
TASK3_INSTANCE	M4.42	Evidence	Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md
TASK3_INSTANCE	M4.45	Evidence	Archive/DECISIONS-ARCHIVE-2026-08-11.md
TASK3_INSTANCE	M4.49	Owner	src/schema.ts
TASK3_INSTANCE	M4.50	Evidence	docs/AGENTS-RUNBOOK.md
TASK3_INSTANCE	M4.51	Owner	scripts/audit/audit-ids.ts
TASK3_INSTANCE	M4.52	Owner	lib/canonical-routing.ts
TASK3_INSTANCE	M4.53	Owner	scripts/consolidate.ts
TASK3_INSTANCE	M4.57	Owner	src/visuals/primitives/graphPaper.ts
TASK3_INSTANCE	M4.58	Owner	src/schema.ts
TASK3_INSTANCE	M4.60	Owner	src/sessionSampler.ts
TASK3_INSTANCE	M4.61	Owner	AGENTS.md
TASK3_INSTANCE	M4.62	Owner	src/topics.ts
TASK3_PATH	lib/shuffle.ts	TRACKED	git_ls_files_exit=0	stdout='lib/shuffle.ts'	stderr=''
TASK3_PATH	scripts/patch-raw.ts	TRACKED	git_ls_files_exit=0	stdout='scripts/patch-raw.ts'	stderr=''
TASK3_PATH	scripts/audit/non-mcq-bias-lib.ts	TRACKED	git_ls_files_exit=0	stdout='scripts/audit/non-mcq-bias-lib.ts'	stderr=''
TASK3_PATH	src/examLayout.ts	TRACKED	git_ls_files_exit=0	stdout='src/examLayout.ts'	stderr=''
TASK3_PATH	audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json	TRACKED	git_ls_files_exit=0	stdout='audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json'	stderr=''
TASK3_PATH	audit/lab-reference-range-verification-2026-07-19.md	TRACKED	git_ls_files_exit=0	stdout='audit/lab-reference-range-verification-2026-07-19.md'	stderr=''
TASK3_PATH	Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md	TRACKED	git_ls_files_exit=0	stdout='Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md'	stderr=''
TASK3_PATH	src/measurementAllowlist.ts	TRACKED	git_ls_files_exit=0	stdout='src/measurementAllowlist.ts'	stderr=''
TASK3_PATH	Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md	TRACKED	git_ls_files_exit=0	stdout='Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md'	stderr=''
TASK3_PATH	Archive/DECISIONS-ARCHIVE-2026-08-11.md	EXEMPT	git_ls_files=NOT_RUN
TASK3_PATH	src/schema.ts	TRACKED	git_ls_files_exit=0	stdout='src/schema.ts'	stderr=''
TASK3_PATH	docs/AGENTS-RUNBOOK.md	TRACKED	git_ls_files_exit=0	stdout='docs/AGENTS-RUNBOOK.md'	stderr=''
TASK3_PATH	scripts/audit/audit-ids.ts	TRACKED	git_ls_files_exit=0	stdout='scripts/audit/audit-ids.ts'	stderr=''
TASK3_PATH	lib/canonical-routing.ts	TRACKED	git_ls_files_exit=0	stdout='lib/canonical-routing.ts'	stderr=''
TASK3_PATH	scripts/consolidate.ts	TRACKED	git_ls_files_exit=0	stdout='scripts/consolidate.ts'	stderr=''
TASK3_PATH	src/visuals/primitives/graphPaper.ts	TRACKED	git_ls_files_exit=0	stdout='src/visuals/primitives/graphPaper.ts'	stderr=''
TASK3_PATH	src/sessionSampler.ts	TRACKED	git_ls_files_exit=0	stdout='src/sessionSampler.ts'	stderr=''
TASK3_PATH	AGENTS.md	TRACKED	git_ls_files_exit=0	stdout='AGENTS.md'	stderr=''
TASK3_PATH	src/topics.ts	TRACKED	git_ls_files_exit=0	stdout='src/topics.ts'	stderr=''
```

## Findings

| Class | Count | Finding |
|---|---:|---|
| BLOCKER | 0 | No actual frozen-identity mismatch, allowlist escape, field-population change, vocabulary violation, or Population-1 untracked path. |
| REQUIRED REPAIR | 0 | No repair is authorized or proposed. |
| ADVISORY | 3 | (1) Completion-order §1’s abbreviated pre-repair SHA tail `…4698` conflicts with governing `…c244`; owner clarification controls. (2) Repair report opening `PARTIAL` status conflicts with its chronological §§8–9 continuation-complete handoff; no repair made. (3) Task-2 provisional distribution `1=5 / 2=24 / 3=36` was disproved by the real-export rerun: actual `1=4 / 2=23 / 3=38`; all statements remain within 1–3. |

## Unmeasured / intentionally not performed

Nothing required by revision 4 §§5–7 or completion-order §5 remains unmeasured. The GPT confirming read, any migration repair, and the derived date-occurrence report were intentionally not begun; they are outside this authorization and explicitly barred pending this verification.

## Post-verification `git status --porcelain`

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
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-COMPLETION-CODEX-WORK-ORDER-2026-08-04.md
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
