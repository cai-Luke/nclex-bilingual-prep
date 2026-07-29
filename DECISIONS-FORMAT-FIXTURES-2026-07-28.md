# DECISIONS.md Format — Grammar Fixtures

**Date:** 2026-07-28 · **Seat:** Architect · **Status:** **RATIFIED 2026-07-28 by Luke (owner),
together with `DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md`; final pre-commit clarifications
adopted 2026-07-28.**

Hand-authored. A fixture whose expected result was produced by running the parser is not a fixture.
Where parser and fixture disagree, the fixture is presumed correct until the architect seat rules
otherwise.

**Expected-result notation.** Compact assertions on the result, not a required return shape. The
implementer owns the shape, but every asserted value must hold. Absent optional fields are absent,
never empty.

**Parser rejection codes (closed set).** `HEADING_SHAPE` · `DERIVED_ID` · `DUPLICATE_CORE` ·
`ORPHAN_ATTACHMENT` · `EMPTY_FIELD` · `FIELD_ORDER` · `UNKNOWN_FIELD` · `MISSING_FIELD` ·
`INVALID_FIELD_VALUE` · `STATEMENT_LENGTH` · `STATEMENT_SHAPE` · `KIND_SECTION` · `STATUS_KIND` ·
`ANCHOR_CITATION` · `ID_ON_NAME_ADDRESSED` · `ARCHIVE_BLOCK_IN_DECISIONS` · `TITLE_COLLISION` ·
`DECLARED_TOTAL_SHAPE`.

**Conformance finding codes (closed set).** `MISSING_DECLARED_TOTAL` · `INDEX_BODY_MISMATCH` ·
`INDEX_ORDER_MISMATCH` · `DECLARED_TOTAL_MISMATCH` · `UNTRACKED_PATH` · `ALLOCATION_GAP` ·
`ARCHIVE_INDEX_MISMATCH` · `RETIRED_ID_CONFLICT`.

Every CLI failure carries exactly one code from these sets. Parser codes describe malformed syntax
or an invalid parsed block. Conformance codes describe disagreement among individually parseable
structures or repository state.

---

## Well-formed

### F1 — core `P`, all optional fields present

```markdown
### P25 — Necessity is a property of the artifact

A visual, exhibit, or measurement block is included when the item cannot be answered without it,
not when it would be realistic to include. Realism is not necessity.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-03
- **Authorized:** Redundant elements inside a value-complete artifact.
- **Not authorized:** An artifact whose values the stem already states.
- **Evidence:** `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md`
- **Owner:** `src/schema.ts`
- **Execution:** EXECUTED
```

```text
addressing=id  id=P25  ordinal=0  blockKey=P25#0  section=4
kind=P  status=ACTIVE  force=BINDING  date=2026-07-03
authorized=present  notAuthorized=present
evidence=EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md
owner=src/schema.ts  execution=EXECUTED
title=Necessity is a property of the artifact
statement.sentences=2
```

### F2 — core `P`, minimal

```markdown
### P7 — Precision over volume

In any audit, five fully-evidenced findings beat thirty probable ones.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** ADVISORY
- **Date:** 2026-06-18
```

```text
addressing=id  id=P7  ordinal=0  blockKey=P7#0  section=4
kind=P  status=ACTIVE  force=ADVISORY  date=2026-06-18
authorized=absent  notAuthorized=absent  evidence=absent  owner=absent  execution=absent
statement.sentences=1
```

### F3 — attached block

Parsed immediately after F1.

```markdown
#### P25 — Application: composite trend artifacts

A deterministic trend artifact may present the same typed source data through both charts and a
renderer-derived table when the views provide distinct reading affordances.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-18
- **Owner:** `src/visuals/kinds/vitals_trend/index.ts`
- **Execution:** PENDING
```

```text
addressing=id  id=P25  ordinal=1  blockKey=P25#1  section=4  attachedTo=P25#0
kind=P  status=ACTIVE  force=BINDING  date=2026-07-18
owner=src/visuals/kinds/vitals_trend/index.ts  execution=PENDING
statement.sentences=1
```

### F4 — core `R`, decimal sentence case

```markdown
### R3 — Temperature sanity ceiling 46.5 °C

The flowsheet gate's sanity ceiling for `temp` is independently authored at 46.5 °C, decoupled from
the renderer's legacy range.

- **Kind:** R
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-15
- **Evidence:** `Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md`
- **Owner:** `src/measurementAllowlist.ts`
- **Execution:** EXECUTED
```

```text
addressing=id  id=R3  ordinal=0  blockKey=R3#0  section=5
kind=R  status=ACTIVE  force=BINDING  date=2026-07-15
execution=EXECUTED  statement.sentences=1
```

Neither period inside `46.5` is a sentence boundary.

### F5 — name-addressed `I`

```markdown
### Runtime audio carries no client-embedded secret

Runtime audio must not require a client-embedded secret or a live API call, and an absent
pre-generated asset fails safely to `speechSynthesis`.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-22
- **Owner:** `src/audio/normalizeForTts.ts`
```

```text
addressing=name  id=absent
blockKey=Runtime audio carries no client-embedded secret  section=6
kind=I  status=ACTIVE  force=BINDING  date=2026-06-22
owner=src/audio/normalizeForTts.ts  statement.sentences=1
```

### F6 — name-addressed `T`

```markdown
### DBP and MAP ceiling sourcing

Whether DBP and MAP carry authored sanity ceilings is unresolved; a bounded sourcing pass is
authorized with no number selected.

- **Kind:** T
- **Status:** REVISIT
- **Force:** ADVISORY
- **Date:** 2026-07-24
- **Evidence:** `audit/vital-sanity-bounds-p3-stage-3-source-packet-2026-07-23.md`
```

```text
addressing=name  id=absent  blockKey=DBP and MAP ceiling sourcing  section=7
kind=T  status=REVISIT  force=ADVISORY  date=2026-07-24
statement.sentences=1
```

### F7 — ID-addressed archive wrapper

```markdown
### P22 — CONDITIONAL conditional-principle prose

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-07-28
- **Original Kind:** P
- **Original Status:** CONDITIONAL
- **Retired ID:** P22
- **Origin:** `DECISIONS.md` §5 at `MIGRATION_BASELINE`

**22. CONDITIONAL — Opus skeleton cases are GPT-provenance for review-conflict purposes.**
The producer principle 2 protects against self-review is the compiler, not the prose author.
```

```text
addressing=id  id=P22  blockKey=P22#0  file=archive
kind=X  status=SUPERSEDED  force=HISTORICAL  date=2026-07-28
originalKind=P  originalStatus=CONDITIONAL  retiredId=P22
origin.section=DECISIONS.md §5  origin.token=MIGRATION_BASELINE
statement=absent  body=opaque  bodyBytesPreserved=true
```

### F8 — ID-addressed archive-index line

```markdown
- **P22 CONDITIONAL conditional-principle prose** — lapsed lane contract, retired 2026-07-28.
  `Archive/DECISIONS-ARCHIVE-<date>.md#p22-conditional-conditional-principle-prose`
```

```text
kind=archiveIndexLine  addressing=id
label=P22 CONDITIONAL conditional-principle prose
pointer.file=Archive/DECISIONS-ARCHIVE-<date>.md
pointer.anchor=p22-conditional-conditional-principle-prose
```

### F9 — retired-register rows

```markdown
| P22 | RETIRED        | 2026-07-28 | `Archive/DECISIONS-ARCHIVE-<date>.md#p22-...` |
| P13 | NEVER ASSIGNED | —          | —                                             |
```

```text
row1: id=P22  disposition=RETIRED  date=2026-07-28  pointer=present  graphState=RETIRED
row2: id=P13  disposition=NEVER_ASSIGNED  date=absent  pointer=absent  graphState=MISSING
```

### F10 — closed abbreviation

```markdown
### P2 — Independent review is scoped to judgment

A source may name Dr. Smith without creating a second sentence.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-14
```

```text
addressing=id  id=P2  ordinal=0  blockKey=P2#0  section=4
kind=P  status=ACTIVE  force=BINDING  date=2026-07-14
statement.sentences=1
```

`Dr.` is not a boundary even though it is followed by whitespace and an uppercase letter.

### F11 — entry index with declared total

```markdown
| ID | kind | status | force | summary |
|---|---|---|---|---|
| P25 | P | ACTIVE | BINDING | Necessity is a property of the artifact |
| P25 | P | ACTIVE | BINDING | Application: composite trend artifacts |
| — | I | ACTIVE | BINDING | Runtime audio carries no client-embedded secret |

**Declared total:** 3 entry blocks.
```

```text
kind=entryIndex  rows=3
row1.blockKey=P25#0  row2.blockKey=P25#1
row3.blockKey=Runtime audio carries no client-embedded secret
declaredTotal=3
```

### F12 — name-addressed archive wrapper

```markdown
### Runtime audio carries no client-embedded secret

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-07-28
- **Original Kind:** I
- **Original Status:** ACTIVE
- **Origin:** `DECISIONS.md` §6 at `MIGRATION_BASELINE`

**Runtime audio must not require a client-embedded secret.**
The original invariant body remains byte-for-byte unchanged.
```

```text
addressing=name  id=absent
blockKey=Runtime audio carries no client-embedded secret  file=archive
kind=X  status=SUPERSEDED  force=HISTORICAL  date=2026-07-28
originalKind=I  originalStatus=ACTIVE  retiredId=absent
origin.section=DECISIONS.md §6  origin.token=MIGRATION_BASELINE
statement=absent  body=opaque  bodyBytesPreserved=true
```

### F13 — name-addressed archive-index line

```markdown
- **Runtime audio carries no client-embedded secret** — archived invariant, retired 2026-07-28.
  `Archive/DECISIONS-ARCHIVE-<date>.md#runtime-audio-carries-no-client-embedded-secret`
```

```text
kind=archiveIndexLine  addressing=name
label=Runtime audio carries no client-embedded secret
pointer.file=Archive/DECISIONS-ARCHIVE-<date>.md
pointer.anchor=runtime-audio-carries-no-client-embedded-secret
```

---

## Malformed — must reject for the stated parser reason

### M1 — hyphen instead of em dash

`### P25 - Necessity is a property of the artifact` → `REJECT: HEADING_SHAPE`

### M2 — derived identifier

`### P25.1 — Application: composite trend artifacts` → `REJECT: DERIVED_ID`

### M3 — duplicate core

Two `### P25 — …` blocks in one document → `REJECT: DUPLICATE_CORE`

### M4 — attachment disagrees with core

`#### P26 — …` whose nearest preceding core is `### P25 — …` → `REJECT: ORPHAN_ATTACHMENT`

### M5 — empty value

`- **Owner:**` with nothing after it → `REJECT: EMPTY_FIELD`

### M6 — field order

`Force` before `Status` → `REJECT: FIELD_ORDER`

### M7 — unknown live field

`- **Origin:** ...` on a live entry → `REJECT: UNKNOWN_FIELD`

### M8 — statement too long

Four sentences before the field list → `REJECT: STATEMENT_LENGTH`

### M9 — statement shape

A bullet inside the statement block → `REJECT: STATEMENT_SHAPE`

### M10 — kind/section disagreement

`Kind: R` on a block in target §4 → `REJECT: KIND_SECTION`

### M11 — anchor citation inside `DECISIONS.md`

`see [P25](#p25--necessity-is-a-property-of-the-artifact)` → `REJECT: ANCHOR_CITATION`

### M12 — identifier on name-addressed entry

`### I4 — Runtime audio carries no client-embedded secret` with `Kind: I`
→ `REJECT: ID_ON_NAME_ADDRESSED`

### M13 — archive wrapper inside `DECISIONS.md`

An `X` wrapper appearing in target §8 → `REJECT: ARCHIVE_BLOCK_IN_DECISIONS`

### M14 — name-addressed title collision

Two `I` entries titled `Schema changes are rare and deliberate` → `REJECT: TITLE_COLLISION`

### M15 — missing required field

A live entry whose field list omits `Date` → `REJECT: MISSING_FIELD`

### M16 — invalid value

`- **Status:** CURRENT` → `REJECT: INVALID_FIELD_VALUE`

### M17 — invalid kind/status pairing

A live `P` entry carrying `Status: REVISIT` → `REJECT: STATUS_KIND`

### M18 — malformed declared-total syntax

`**Declared total:** three entry blocks.` → `REJECT: DECLARED_TOTAL_SHAPE`

### M19 — archive wrapper missing original status

An otherwise valid archive wrapper that omits `Original Status`
→ `REJECT: MISSING_FIELD`

---

## Conformance — parseable inputs that must fail cross-checking

### C1 — declared total missing

A valid entry-index table followed by the next section heading, with no declared-total line
→ `FINDING: MISSING_DECLARED_TOTAL`

### C2 — equal-count index/body mismatch

Index has `P25#0` and `P26#0`; body has `P25#0` and `P27#0`; both counts are two
→ `FINDING: INDEX_BODY_MISMATCH`

### C3 — ordering mismatch

Index and body contain the same keys, but index orders `P26#0` before `P25#0` while the body orders
`P25#0` before `P26#0`
→ `FINDING: INDEX_ORDER_MISMATCH`

### C4 — declared total mismatch

Index and body each contain three blocks while the line reads
`**Declared total:** 4 entry blocks.` → `FINDING: DECLARED_TOTAL_MISMATCH`

### C5 — untracked repository pointer

A valid entry carries this field line:

```markdown
- **Owner:** `not-a-real-owner.ts`
```

The path is absent from the tracked index → `FINDING: UNTRACKED_PATH`

### C6 — allocation union gap

Combined live + retired + never-assigned `P` set is `{P1, P2, P4}`
→ `FINDING: ALLOCATION_GAP`

### C7 — archive-index mismatch

A valid archive-index line points to a wrapper that does not exist
→ `FINDING: ARCHIVE_INDEX_MISMATCH`

### C8 — retired identifier reused live

`P22` appears as a live entry and as `RETIRED` in the register
→ `FINDING: RETIRED_ID_CONFLICT`

---

## Coverage note

F1–F13 define successful parsing. M1–M19 exercise every parser rejection code and pin the archive
requirement to preserve original status. C1–C8 exercise every conformance finding code. F7/F8 and
F12/F13 pin both archive addressing modes.
