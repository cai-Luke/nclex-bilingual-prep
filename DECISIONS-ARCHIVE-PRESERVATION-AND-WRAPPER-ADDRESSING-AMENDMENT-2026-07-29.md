# Archive Preservation and Wrapper-Addressing Amendment — Architect Draft

**Date:** 2026-07-29 · **Seat:** Architect
**Status:** **RATIFIED 2026-07-29 by Luke (owner).** In force.
**Amends:**
- `DECISIONS-TAXONOMY-2026-07-24.md` §9 and §10 (Amendment 4)
- `DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md` §4.1 and §4.2
- `DECISIONS-FORMAT-FIXTURES-2026-07-28.md` (F14–F16, M20–M23)

The format specification and its fixtures were ratified as inseparable and are amended together here. Neither may be applied without the other.

**Authority:** Architect commission under owner ratification 2026-07-29, as the precondition named by the staged migration commission.
**Discipline:** This softens ratified invariants and is written under principle 27: the forcing incident is named in §2 and the generating condition is argued in §3.1 and §4.1.

---

## 1. Scope — what this changes and what it does not

Two clauses, one forcing incident, one migration prerequisite.

- **Clause A** authorizes exactly one byte-identical preservation snapshot, once, and states that taxonomy §9's one-file rule governs *normalized* archives rather than byte-identical copies.
- **Clause B** rules that archive-wrapper addressing is determined by **identifier disposition**, not by `Original Kind`.

**This amendment changes archive-wrapper field and addressing rules.** It changes the requirement rule for `Retired ID` and the permitted `Original Kind` values on a name-addressed wrapper. Any claim that it changes no field or identifier rule would be false.

It does **not** change: live-entry grammar or identity; the permanence, allocation, or retirement of any identifier under taxonomy §7; any kind, status, force, or execution vocabulary; the meaning of any conformance assertion; or the closed parser and conformance reason-code sets. **No new reason code is introduced.**

---

## 2. Forcing incident

The target archive grammar admits no truthful wrapper for material condensed out of an entry that **remains live under the same permanent identifier**, nor for superseded material that never carried an identifier at all.

Format spec §4.2 requires `Retired ID` iff `Original Kind` is `P` or `R`, which forces an ID-addressed heading asserting that the identifier is retired. The shared parser closes the other route, rejecting `Original Kind` `P` or `R` on a name-addressed wrapper. Both routes are therefore shut for a condensed predecessor of a live `P25`: the ID-addressed route either enters `P25` into the retired register — tripping assertion 10 against the live entry — or asserts a retirement the register does not record, and the name-addressed route is refused outright.

This is not hypothetical. It reaches the migration in two places:

1. **Bulk displaced prose.** The migration condenses 65 live blocks to one-to-three-sentence statements, evicting substantial narrative from entries that keep their numbers or names.
2. **At least six of the thirteen archive dispositions.** `E032` (an application of P27, while P27 stays live) and `E039b` (P8's lane detail, while P8 is restored live) would falsely retire a live number. `E048`, `E050`, `E051`, and `E052` are superseded rulings that never carried a permanent identifier, so there is no ID to place in the heading at all.

`Archive/DECISIONS-ARCHIVE-2026-07-14.md` cannot absorb any of it. That file's own header scopes it to material "condensed out of `DECISIONS.md` during the 2026-07-14 architectural-constitution pass," so it contains no post-2026-07-14 material — not `P29`, `P30`, the vital-sanity ratifications, the promoted-visual-parity baseline, the CI-coverage ruling, the unified `vitals_trend` amendment, the terminal-sentence application, or `E074`.

Deletion is unavailable. Taxonomy §9 requires forcing incidents to stay retrievable precisely so principle 27's ratchet cannot be silently disabled.

---

## 3. Clause A — preservation snapshot

### 3.1 Why §9's generating condition does not obtain

The one-file rule exists to prevent archive sprawl: several concurrent **normalized** archives, each carrying `X` wrappers and index lines, which a reader must reconcile to learn what was retired.

A byte-identical preservation snapshot is not a second normalized archive. Nobody authors it, it carries no wrapper, it is reachable from no archive-index line, it is never consulted as authority, and it cannot disagree with the normalized archive because it makes no claim. The reconciliation burden §9 guards against does not arise.

### 3.2 Git-only recoverability is insufficient — rejected on the record

`git show MIGRATION_BASELINE:DECISIONS.md` recovers identical bytes, and this objection will recur if it is not answered here.

It is rejected. Taxonomy §9 requires a forcing incident to stay **retrievable in order to relax the invariant it minted**. A Git object is retrievable only by a reader who already knows the material existed, knows it was removed at a migration, and knows the baseline token to look under. A reader lacking those three facts — the fresh agent this corpus exists to serve — concludes the material was never written. Discoverability from the governance corpus is the property principle 27 depends on, and a commit object does not carry it. The snapshot is pointed at from the live document (§3.3 item 7) for exactly this reason.

### 3.3 The rule — binding once ratified

1. **One snapshot, once.** `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` is created by the migration commission as a **byte-identical** copy of `DECISIONS.md` at `MIGRATION_BASELINE`.
2. **Verified, not asserted.** Its SHA-256 must equal that of `git show MIGRATION_BASELINE:DECISIONS.md`. Both values appear in the migration receipt. A mismatch is a hard failure, not a note.
3. **Preservation only.** Never current authority, never an archive-wrapper input, never an input to `checkDecisionsFormat`, and never edited, reformatted, rewrapped, or tidied after creation.
4. **No archive-index line.** It receives no target §8 row. This is load-bearing rather than tidy: `selectDefinitionIndex` fails closed with `TARGET_ARCHIVE_SOURCE_COUNT` when §8 archive-index lines name more than one file.
5. **Every §8 archive-index line points to the normalized migration archive `Archive/DECISIONS-ARCHIVE-<migration date>.md` and to no other file.**
6. **`Archive/DECISIONS-ARCHIVE-2026-07-14.md` is untouched**, and remains the record of the earlier constitution pass.
7. **Discoverable.** The live document's §8 introductory prose names all three files: the 2026-07-14 prior archive, the normalized migration archive, and this snapshot. That prose is structural and must not use the archive-index line shape (a line opening `- **…** — ` followed by an indented backticked `file#anchor` pointer), because `parseArchiveIndexLines` scans every §8 line and would otherwise capture it as an index line or emit `INVALID_FIELD_VALUE` for a missing pointer.

### 3.4 Reference-graph reporting obligation

The snapshot is a tracked file under `Archive/`, and `markdownSources()` admits every tracked `Archive/**.md`. It is therefore **inside reference-graph scope**, and its legacy `principle N` prose resolves against the post-migration target index. The snapshot contributes a distinct historical population alongside live-corpus citations that may also resolve to retired identifiers; neither population may be mistaken for the other.

Accordingly: **post-migration reference-graph reconciliation reports snapshot-attributed records segregated by source and never pools them with the live governance corpus.** Live-corpus deltas are computed against the live corpus alone. This mirrors the standing rule that a survey spanning surfaces governed by different contracts reports per contract and never pools.

No generator change is authorized or required. Every artifact already carries per-source `inputs` and a `from` field on every record, so segregation is a reconciliation obligation discharged in reporting. A scope-exclusion list in the generator is specifically **not** adopted: the hardening commission removed a hand-maintained scope authority for cause, and reintroducing one here would recreate the defect.

---

## 4. Clause B — non-retiring archive wrappers

### 4.1 The rule is keyed to the wrong axis

`Original Kind` records what the material historically was. Whether an identifier retires is a disposition of the identifier. Binding the first to the second makes "was a principle" and "retires a number" the same claim, which is false for an application of a still-live principle and for a superseded ruling that never held a number.

Addressing must therefore key on identifier disposition.

### 4.2 The rule — binding once ratified

1. **ID-addressed wrappers are used iff the archived unit retires the identifier in its heading.** `Retired ID` is **required** and must match that heading.
2. **Name-addressed wrappers are used when the archived unit has no retiring permanent identifier.** `Original Kind` may be `P`, `R`, `I`, or `T`. `Retired ID` is **forbidden**.
3. **Name-addressed archival labels are architect-authored unique labels pinned in the Stage 2a manifest.** They must not begin with `P<n> ` or `R<n> `; that shape is reserved for ID-addressed archive-index entries. A name-addressed wrapper heading in that shape is rejected `HEADING_SHAPE` by existing machinery, and an index label in that shape parses as ID-addressed and fails `ARCHIVE_INDEX_MISMATCH` against its name-addressed wrapper. Worked renamings: `E032` → `Most recent application of P27 (2026-07-12 pass)`; `E039b` → `Lane-specific detail of P8 (forward case-generation pipeline)`.
4. **Name-addressed archival material produces no retired-register row** and has no effect on assertion 10.
5. **This changes no live-entry identity and no identifier-retirement rule.** It permits truthful wrappers for historical fragments, applications of still-live principles, and unnumbered superseded rulings, and nothing else.

### 4.3 Implementation consequence — one guard

The shared parser **already** keys `Retired ID` to addressing rather than to `Original Kind`: ID-addressed requires it and rejects a mismatch; name-addressed forbids it. Those branches are already correct and are not changed.

The divergence is the spec's field-table wording and exactly one parser guard: the rejection of `Original Kind` `P` or `R` on a name-addressed wrapper. Removing that guard, and nothing else, implements Clause B.

This amendment authorizes no code change by itself. The removal is delegated to the migration commission's implementation stage, gated on F14–F16 and M20–M23 being hand-authored and ratified first, per the standing rule that a fixture whose expected result was produced by running the parser is not a fixture.

---

## 5. Fixture amendments

Append to `DECISIONS-FORMAT-FIXTURES-2026-07-28.md` in the existing series and notation.

### F14 — name-addressed archive wrapper, `Original Kind: P`

```markdown
### Most recent application of P27 (2026-07-12 pass)

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-07-29
- **Original Kind:** P
- **Original Status:** ACTIVE
- **Origin:** `DECISIONS.md` §4 at `MIGRATION_BASELINE`

**Applied 2026-07-12.** The historical application body remains byte-for-byte unchanged.
```

```text
addressing=name  id=absent
blockKey=Most recent application of P27 (2026-07-12 pass)  file=archive
kind=X  status=SUPERSEDED  force=HISTORICAL  date=2026-07-29
originalKind=P  originalStatus=ACTIVE  retiredId=absent
origin.section=DECISIONS.md §4  origin.token=MIGRATION_BASELINE
statement=absent  body=opaque  bodyBytesPreserved=true
```

`P27` remains live. No retired-register row is produced and assertion 10 is unaffected.

### F15 — name-addressed archive wrapper, `Original Kind: R`

```markdown
### CBC American-conventional units (superseded original ruling)

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-07-29
- **Original Kind:** R
- **Original Status:** SUPERSEDED
- **Origin:** `DECISIONS.md` §8 at `MIGRATION_BASELINE`

The original 2026-07-04 ruling body remains byte-for-byte unchanged.
```

```text
addressing=name  id=absent
blockKey=CBC American-conventional units (superseded original ruling)  file=archive
kind=X  status=SUPERSEDED  force=HISTORICAL  date=2026-07-29
originalKind=R  originalStatus=SUPERSEDED  retiredId=absent
origin.section=DECISIONS.md §8  origin.token=MIGRATION_BASELINE
statement=absent  body=opaque  bodyBytesPreserved=true
```

The ruling never held an `R` number, so no number retires and none is invented.

### F16 — archive-index line for a name-addressed `P`/`R` historical unit

```markdown
- **Most recent application of P27 (2026-07-12 pass)** — condensed application, archived 2026-07-29.
  `Archive/DECISIONS-ARCHIVE-<date>.md#most-recent-application-of-p27-2026-07-12-pass`
```

```text
kind=archiveIndexLine  addressing=name
label=Most recent application of P27 (2026-07-12 pass)
pointer.file=Archive/DECISIONS-ARCHIVE-<date>.md
pointer.anchor=most-recent-application-of-p27-2026-07-12-pass
matches=F14  expectedLabel=wrapper.title  registerRow=absent
```

The label mentions `P27` without beginning `P27 `, so it parses name-addressed and matches F14.

### M20 — name-addressed wrapper carrying `Retired ID`

A wrapper headed `### CBC American-conventional units (superseded original ruling)` whose field list includes `- **Retired ID:** R2` → `REJECT: INVALID_FIELD_VALUE`.

### M21 — ID-addressed wrapper missing `Retired ID`

`### P22 — CONDITIONAL conditional-principle prose` with `Original Kind: P` and no `Retired ID` line → `REJECT: MISSING_FIELD`.

### M22 — ID-addressed wrapper with mismatching `Retired ID`

`### P22 — CONDITIONAL conditional-principle prose` carrying `- **Retired ID:** P18` → `REJECT: INVALID_FIELD_VALUE`.

### M23 — name-addressed label in reserved ID shape

A name-addressed wrapper headed `### P27 Most recent application (2026-07-12 pass)` → `REJECT: HEADING_SHAPE`.

The unit must be renamed so its label does not begin `P<n> ` or `R<n> ` (Clause B item 3). This pins the renaming requirement rather than introducing a new reason code.

### Coverage note — replacement text

> F1–F16 define successful parsing. M1–M23 exercise every parser rejection code and pin the archive requirements to preserve original status and to key wrapper addressing to identifier disposition. C1–C8 exercise every conformance finding code. F7/F8 pin ID-addressed archive addressing; F12/F13, F14/F16, and F15 pin name-addressed addressing across `I`, `P`, and `R` original kinds.

---

## 6. E053 correction — folded into this ratification packet

The ratified phase-1 artifacts classify `E053` as `ARCHIVE` and count 14 archive entries in target §8. That classification is corrected here rather than left for inference.

`E053` is the closing pointer sentence of today's §8. It is not superseded, lapsed, or condensed material; it is still true, binds nothing, and is navigational. `X` does not fit it, and wrapping a sentence that says "the archive is over there" inside the archive would be circular.

Ratified corrections:

1. **`E053` becomes structural target-§8 introduction prose.**
2. **It receives no wrapper and no archive-index line.** Under Clause A §3.3 item 7 it is where all three archive files are named, in structural prose that must not take the index-line shape.
3. **The normalized migration archive therefore carries exactly 13 wrappers and 13 archive-index lines.** The outline's "14 entries" pooled 13 dispositions with one structural row.
4. **Reconciliation:** 65 live blocks + 13 archive wrappers + 1 structural `E053` row + 1 `MERGE_INTO` row (`E037` → `E039a`, `E002`, `E006`) = **80** original inventory rows accounted for.

Consequent counts, pinned for the Stage 2a manifest and binding on it:

| surface | count |
|---|---:|
| Live entry blocks (declared total) | 65 = 37 `P` + 6 `R` + 19 `I` + 3 `T` |
| Entry-index rows | 65 |
| Archive wrappers | 13 |
| Archive-index lines | 13 |
| Retired-register rows | 6 — `P9`/`P12`/`P18`/`P22` `RETIRED`; `P13`/`P14` `NEVER ASSIGNED` |
| Distinct live `P` numbers | 25 |
| Live `R` numbers | 6 |

The allocation union is contiguous from `P1` through `P31` and from `R1` through `R6`; the live subsets are intentionally gappy where the retired and never-assigned register rows fill the allocation union.

`audit/decisions-cleanup-2026-07-24/` is frozen and is **not** edited by this correction. The corrected counts live here and in the Stage 2a manifest; the phase-1 artifacts remain the historical record of what the closure pass concluded before this correction.

---

## 7. What this does not authorize

1. No second normalized archive, now or later. The one-file rule is otherwise unchanged.
2. No precedent for a further snapshot. A future pass needs its own amendment and forcing incident.
3. No new kind, status, force, execution state, live field, or reason code.
4. No change to identifier permanence, allocation, or retirement under taxonomy §7.
5. No edit to `DECISIONS.md` — that belongs to the migration commission.
6. No relaxation of the requirement that material which *does* retire an identifier takes an ID-addressed wrapper, an index line, and a register row.
7. No parsing of the snapshot by the conformance checker, ever.
8. No code change under this amendment; the §4.3 guard removal is delegated and fixture-gated.

---

## 8. Exact text to apply on ratification

### 8.1 Taxonomy §9 — insert after “One destination, one file in flight.”

> **Snapshot exception (Amendment 4, 2026-07-29).** The one-file rule governs *normalized* archives: files carrying `X` wrappers and reachable from the target §8 archive index. It does not reach a byte-identical preservation snapshot. Exactly one such snapshot is authorized, once, for the cleanup migration — `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md`, byte-identical to `DECISIONS.md` at `MIGRATION_BASELINE`. It carries no wrapper, is reachable from no archive-index line, is never parsed by the conformance checker, and is never current authority. It exists because the archive grammar admits no wrapper for material condensed out of an entry that remains live under the same permanent identifier, and because a Git object is not discoverable by a reader who does not already know the material existed.

### 8.2 Taxonomy §10 — append

> **Amendment 4 — 2026-07-29, owner ratification. Preservation snapshot and wrapper addressing.**
>
> §9 required displaced material to reach the archive and fixed one destination. The format commission then specified an archive grammar in which every wrapper retires an identifier: `Retired ID` was required whenever `Original Kind` was `P` or `R`, and a name-addressed wrapper could not carry those kinds. Neither rule was wrong alone, but together they left no legal shape for prose condensed out of an entry that keeps its number, for an application of a still-live principle, or for a superseded ruling that never held a number — which is most of what the cleanup migration displaces. The 2026-07-14 archive cannot absorb it either; that file is scoped by its own header to the 2026-07-14 pass and predates `P29`, `P30`, the vital-sanity ratifications, and `E074`.
>
> Amendment 4 adds a one-time, preservation-only snapshot, states that the one-file rule governs normalized archives rather than byte-identical copies, and rules that archive-wrapper addressing is determined by identifier disposition rather than by `Original Kind`. It changes no live-entry identity, no identifier-retirement rule, and no reason code, and sets no precedent.

### 8.3 Format spec §4.1 — append

> **Preservation snapshot (amended 2026-07-29).** `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` is a byte-identical copy of `DECISIONS.md` at `MIGRATION_BASELINE`, authorized once by taxonomy §9 Amendment 4. It is not an archive destination in the sense of this section: it holds no `X` wrapper, receives no §8 archive-index line, and is never an input to the conformance checker. Every §8 archive-index line points to the normalized migration archive and to no other file.

### 8.4 Format spec §4.2 — replace the `Retired ID` field-table row

> | `- **Retired ID:**` | iff the heading is ID-addressed | `P` or `R` followed by digits, matching heading |

### 8.5 Format spec §4.2 — replace the name-addressed-wrapper sentence

Replace “`Retired ID` is forbidden because no permanent identifier existed.” with:

> `Retired ID` is forbidden on a name-addressed wrapper. **Addressing is determined by identifier disposition, not by `Original Kind` (amended 2026-07-29).** An ID-addressed wrapper is used iff the archived unit retires the identifier in its heading; otherwise the wrapper is name-addressed and may carry `Original Kind` `P`, `R`, `I`, or `T`. Name-addressed archival material produces no retired-register row and does not engage assertion 10. Its label is an architect-authored unique label and must not begin with `P<n> ` or `R<n> `, a shape reserved for ID-addressed archive-index entries.

### 8.6 Format spec §4.2 — replace the addressing descriptions

Replace:

> The wrapper preserves the original entry's addressing mode.

with:

> The wrapper's addressing mode is determined by identifier disposition (§4.2, amended 2026-07-29), not inherited from the source entry.

Replace the example subheading:

> **Originally ID-addressed (`P` or `R`):**

with:

> **ID-addressed — the archived unit retires its identifier:**

Replace the example subheading:

> **Originally name-addressed (`I` or `T`):**

with:

> **Name-addressed — no identifier retires:**

### 8.7 Fixture file — append and replace exactly as §5

Append F14–F16 and M20–M23 exactly as written in §5 of this amendment, preserving the existing fixture notation and sequence. Replace the fixture coverage note with the exact replacement text under §5's “Coverage note — replacement text.” The format specification and fixture changes are one inseparable application; neither subset may land alone.

---

## 9. Ratification

**Ratified 2026-07-29 by Luke (owner).** Amendment 4 — the one-time preservation snapshot, disposition-keyed archive-wrapper addressing, fixtures F14–F16 and M20–M23, and the E053 correction to 13 wrappers and 13 archive-index lines — is ratified and in force. This act does not ratify any Stage 2a entry wording, which requires separate ratification of the exact manifest bytes.
