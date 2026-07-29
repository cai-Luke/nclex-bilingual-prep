# DECISIONS.md Target Entry Format — Architect Specification

**Date:** 2026-07-28 · **Seat:** Architect · **Status:** **RATIFIED 2026-07-28 by Luke (owner),
together with `DECISIONS-FORMAT-FIXTURES-2026-07-28.md`; final pre-commit clarifications adopted
2026-07-28.**
**Authority:** `DECISIONS-CLEANUP-PHASE-1-CLOSURE-CODEX-WORK-ORDER-2026-07-28.md` §9 non-goal 8.
**Governing contract:** `DECISIONS-TAXONOMY-2026-07-24.md` (Amendments 1–3). This file renders that
contract into a grammar and adds no kind, status, force, field, or identifier rule. On any
disagreement the taxonomy governs and this file is the defect.

**Companion:** `DECISIONS-FORMAT-FIXTURES-2026-07-28.md` — hand-authored grammar fixtures, part of
this ratified commission. Neither file may be amended independently of the other.

---

## 1. Identity

**A permanent identifier is the reference identity. A Markdown slug is never one.** Owner ruling
2026-07-28. Titles are editorial; identifiers are not.

- The parser reads the identifier as a positionally fixed token in the heading (§2), never from the
  slug, title, or document order.
- The graph resolves an identifier citation to a synthetic target such as `DECISIONS.md#P25`, not
  against the Markdown-anchor index.
- A Markdown anchor link into a `DECISIONS.md` entry heading is not a valid permanent citation.
- **Legacy form is permanent.** `principle 25` appears throughout `Archive/`, which is never
  rewritten (taxonomy §9). `P25` is canonical for new writing; `principle 25` must remain resolvable
  indefinitely.

**Standing risk, accepted not solved.** `I` and `T` are cited by name under taxonomy §7 and therefore
carry title fragility that `P` and `R` avoid. Nineteen `I` entries are affected. Changing this is a
taxonomy amendment, not part of this commission.

---

## 2. Live entry grammar

### 2.1 ID-addressed entries (`P`, `R`)

```markdown
### P25 — Necessity is a property of the artifact

A visual, exhibit, or measurement block is included when the item cannot be answered without it,
not when it would be realistic to include. Realism is not necessity.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-03
- **Evidence:** `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md`
- **Owner:** `src/schema.ts`
- **Execution:** EXECUTED
```

Heading: `### ` + identifier + ` — ` + title. The separator is an em dash with one space on each
side. Identifier matches `^(P|R)\d+$`. Title carries no em dash and no backticks.

Statement: first non-blank block after the heading, terminated by a blank line. One paragraph, one
to three sentences (taxonomy §6.1). No list, code fence, or nested heading.

Sentence counting is deterministic. A boundary is a maximal run of `.`, `?`, or `!`. After that
run, skip zero or more closing straight or curly quotes, backticks, parentheses, or brackets; what
follows must be either end-of-block or whitespace and a Unicode uppercase letter. A period between
two digits is not a boundary. A period completing an item in the following closed,
case-insensitive abbreviation list is not a boundary: `e.g.`, `i.e.`, `etc.`, `Mr.`, `Mrs.`,
`Ms.`, `Dr.`, `No.`, `vs.`. Consecutive punctuation such as `?!` counts as one boundary. No other
abbreviation is inferred.

**Known conservative limitation.** A new sentence beginning with a lowercase or backticked
lowercase token after terminal punctuation is not counted as a boundary because it does not satisfy
the uppercase-start rule. Authors must avoid that construction in governed statement paragraphs;
semantic compression review remains responsible for catching it. This limitation is accepted in
this commission rather than expanding the sentence grammar again.

Field list: next non-blank block. Every line is `- **<Field>:** <value>`. Order is fixed as §2.4.

### 2.2 Name-addressed entries (`I`, `T`)

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

Heading: `### ` + title, with no identifier token and no em dash. The parser distinguishes the two
forms by whether the heading opens with `^(P|R)\d+ — `. A name-addressed heading whose title happens
to begin with such a token is a checker failure and must be renamed.

`I` and `T` take no attached blocks. An application of an invariant is its own entry.

### 2.3 Attached blocks (`P`, `R` only)

```markdown
#### P25 — Application: composite trend artifacts
```

- Exactly one `###` core exists per permanent identifier.
- Every `####` identifier equals the identifier of the nearest preceding `###` core.
- Each attached block carries its own complete statement paragraph and field list; status, force,
  date, and execution state are its own and may differ from the core's.
- Derived identifiers are forbidden: no `P25.1`, `P25a`, or equivalent.

### 2.4 Fields and compatibility

The permanent identifier is carried by the heading and is never repeated as a field line.

| field | required | value |
|---|---|---|
| `- **Kind:**` | always | `P` `R` `I` `T` |
| `- **Status:**` | always | `ACTIVE` `CONDITIONAL` `PARKED` `REVISIT` `SUPERSEDED` |
| `- **Force:**` | always | `BINDING` `AUTHORIZING` `ADVISORY` `HISTORICAL` |
| `- **Date:**` | always | `YYYY-MM-DD` |
| `- **Authorized:**` | optional | free text |
| `- **Not authorized:**` | optional | free text |
| `- **Evidence:**` | optional | backticked repository path |
| `- **Owner:**` | optional | backticked repository path |
| `- **Execution:**` | optional | `EXECUTED` `PENDING` `INACTIVE` |

Kind/status compatibility is closed, directly from taxonomy §4:

| kind | allowed status |
|---|---|
| `P` | `ACTIVE` `CONDITIONAL` `PARKED` |
| `R` | `ACTIVE` `PARKED` |
| `I` | `ACTIVE` |
| `T` | `ACTIVE` `PARKED` `REVISIT` |

This table governs live entries only. `CONDITIONAL` is `P` only and `REVISIT` is `T` only. Live
entries never carry `SUPERSEDED`; archived wrappers use their separate grammar in §4.2. A
vocabulary-valid status paired with an incompatible live kind is a checker failure.

Optional fields are omitted, not emptied. A present line with an empty value is a failure. Whether
an optional field ought to exist is architect review, never a checker assertion; the checker
validates what is present and the four always-required fields.

Taxonomy §2's compression rule is not machine-checkable. The one-to-three-sentence statement bound
is a structural proxy and nothing more.

### 2.5 Block key (checker-internal)

A core and its attachments share an identifier, so identifier sets cannot express index/body
equality. The parser assigns each block a key:

- ID-addressed core: `<ID>#0`.
- ID-addressed attachments: `<ID>#1..n`, in document order under that core.
- Name-addressed entry: exact heading title.

This key exists only inside the parser and its consumers. It is never a citation identity, never
written into a document, and never externally referenced.

---

## 3. Entry index (target §3)

One row per block, in document order.

```markdown
| ID | kind | status | force | summary |
|---|---|---|---|---|
| P25 | P | ACTIVE | BINDING | Necessity is a property of the artifact |
| P25 | P | ACTIVE | BINDING | Application: composite trend artifacts |
| — | I | ACTIVE | BINDING | Runtime audio carries no client-embedded secret |

**Declared total:** 3 entry blocks.
```

The declared-total line has exactly this grammar:

`**Declared total:** ` + unsigned decimal integer + ` entry blocks.`

It is required, carries no other text, and appears immediately after the table after at most one
blank line.

The index is derived and never the authority; where index and body disagree, the body governs.

Join rule:

- **ID-addressed:** join by block key `<ID>#<ordinal>`, with ordinal assigned by document order
  within the ID in both index and body. Summary text is not the join key.
- **Name-addressed:** ID column is `—`, summary equals the heading title byte-for-byte, and exact
  title is the join key. A title collision is a checker failure.

The checker asserts block-key equality in both directions and ordering equality. It separately
checks the declared total against both the index-row count and body-block population. A missing
line, malformed line, or unequal value is a distinct finding.

---

## 4. Archive

### 4.1 Destination

One destination, one file in flight (taxonomy §9):

`Archive/DECISIONS-ARCHIVE-<YYYY-MM-DD of the migration commit>.md`

`Archive/DECISIONS-ARCHIVE-2026-07-14.md` is a prior archive and is never edited by this arc.

### 4.2 Archive entry — metadata wrapper over a verbatim body

An archive wrapper has its own closed field set and no statement paragraph. The verbatim body is the
content; a migration-authored summary would be a re-characterization. The wrapper preserves the
original entry's addressing mode.

**Originally ID-addressed (`P` or `R`):**

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

<verbatim historical body — everything to the next `###`>
```

The heading is `### ` + retired identifier + ` — ` + title. The checker-internal key is `<ID>#0`.
`Retired ID` is required and equals the heading identifier.

**Originally name-addressed (`I` or `T`):**

```markdown
### Runtime audio carries no client-embedded secret

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-07-28
- **Original Kind:** I
- **Original Status:** ACTIVE
- **Origin:** `DECISIONS.md` §6 at `MIGRATION_BASELINE`

<verbatim historical body — everything to the next `###`>
```

The heading is `### ` + exact former title, with no identifier and no em dash. The checker-internal
key is that exact title. `Retired ID` is forbidden because no permanent identifier existed.

Archive field order and vocabulary are fixed:

| field | required | value |
|---|---|---|
| `- **Kind:**` | always | `X` |
| `- **Status:**` | always | `SUPERSEDED` |
| `- **Force:**` | always | `HISTORICAL` |
| `- **Date:**` | always | `YYYY-MM-DD` |
| `- **Original Kind:**` | always | `P` `R` `I` `T` |
| `- **Original Status:**` | always | `ACTIVE` `CONDITIONAL` `PARKED` `REVISIT` `SUPERSEDED` |
| `- **Retired ID:**` | iff Original Kind is `P` or `R` | `P` or `R` followed by digits, matching heading |
| `- **Origin:**` | always | source section + ` at ` + `MIGRATION_BASELINE` |

The wrapper's `Status: SUPERSEDED` describes its current archival state. `Original Status` preserves
the pre-archive status exactly as resolved by the migration contract. The format checker validates
its five-tag vocabulary but does not infer, normalize, or reclassify the historical pairing with
`Original Kind`. Archival relocation therefore does not silently rewrite `ACTIVE`, `CONDITIONAL`,
`PARKED`, `REVISIT`, or `SUPERSEDED` into a different historical claim.

`Origin` names a token, never a SHA. `MIGRATION_BASELINE` is the pre-migration measurement baseline,
bound by the hardening commission and permanently thereafter.

Everything after the field list is opaque to the parser and never reformatted, rewrapped, or
tidied. The next `###` heading starts the next wrapper.

### 4.3 Archive index (target §8)

Target §8 carries pointers only: no entry bodies and no `X` wrapper blocks. One line exists per
archive wrapper.

```markdown
- **P22 CONDITIONAL conditional-principle prose** — lapsed lane contract, retired 2026-07-28.
  `Archive/DECISIONS-ARCHIVE-<date>.md#p22-conditional-conditional-principle-prose`
- **Runtime audio carries no client-embedded secret** — archived invariant, retired 2026-07-28.
  `Archive/DECISIONS-ARCHIVE-<date>.md#runtime-audio-carries-no-client-embedded-secret`
```

The label of an ID-addressed archive line begins with its retired ID. The label of a name-addressed
archive line is its exact former title.

---

## 5. Retired-identifier register

The register lives in target §8.

```markdown
| ID | disposition | date | pointer |
|---|---|---|---|
| P9  | RETIRED        | 2026-07-28 | `Archive/DECISIONS-ARCHIVE-<date>.md#...` |
| P12 | RETIRED        | 2026-07-28 | ... |
| P13 | NEVER ASSIGNED | —          | — |
| P14 | NEVER ASSIGNED | —          | — |
| P18 | RETIRED        | 2026-07-28 | ... |
| P22 | RETIRED        | 2026-07-28 | ... |
```

The register is ID-based so it can carry `R` identifiers when one is retired. It is append-only; an
entry never leaves.

Graph mapping:

- `RETIRED` → target state `RETIRED`. This is a resolution state, not a judgment about the citing
  prose.
- `NEVER ASSIGNED` → `MISSING`.

---

## 6. Shared parser

**Path:** `lib/decisions-format.ts`. Pure functions over text and explicit context; no filesystem,
git, process exit, or implicit global state. The conformance checker and later reference graph both
consume it and neither reimplements the grammar.

A shared parser can be wrong in a way that makes both consumers agree. The companion fixtures are
the external pin against that failure.

---

## 7. Grammar fixtures — the external pin

`DECISIONS-FORMAT-FIXTURES-2026-07-28.md` contains hand-authored well-formed, malformed, and
cross-conformance cases. They exist before either consumer and ratify with this specification.

A fixture whose expected result was produced by running the parser is not a fixture. Where parser
and fixture disagree, the fixture is presumed correct until the architect seat rules otherwise.

---

## 8. Conformance checker — assertion list

Structural and deterministic only; no semantic adjudication. Report every failure, not the first.
Every parser rejection and checker finding carries exactly one closed reason code from the companion
fixture file.

1. Every live block parses under §2: heading, statement, and field list.
2. Every archive wrapper parses under §4.2: heading, archive field list, and opaque body.
3. Live field names are drawn from §2.4; archive field names are drawn from §4.2. No unknown line,
   empty value, or out-of-order field is accepted.
4. Always-required live and archive fields are present.
5. Present values belong to their closed vocabularies; `Date` is `YYYY-MM-DD`; every live
   kind/status pair is permitted by §2.4. Archive `Original Kind` and `Original Status` are
   vocabulary-checked historical metadata and are not reclassified by the format checker.
6. Kind/section agreement holds: `P`→§4, `R`→§5, `I`→§6, `T`→§7. `X` blocks appear only in the
   archive file.
7. `P`/`R` headings carry identifiers; `I`/`T` headings carry none.
8. Exactly one `###` core exists per live identifier; every `####` identifier equals its core's;
   `I`/`T` carry no attachments.
9. No derived identifier token appears in `DECISIONS.md`. Full-corpus detection belongs to the later
   graph-hardening commission.
10. No live entry carries an identifier listed in the retired register.
11. Over the union of live, retired, and never-assigned `P` numbers, the set is contiguous from 1 to
    its maximum. The same rule holds for `R`. Live sets may be gappy.
12. Index/body block-key equality holds in both directions and ordering agrees.
13. The required declared-total line parses and equals both index-row and body-block counts.
14. Every archive-index line resolves to exactly one wrapper; every wrapper has exactly one index
    line; no wrapper appears in target §8. Both addressing modes are supported.
15. Every `Evidence` and `Owner` value is a tracked repository path that exists.
16. No Markdown anchor link into a `DECISIONS.md` entry heading is written inside `DECISIONS.md`.
17. The parser and checker reproduce every hand-authored fixture result and failure code.

**Migration consequence of assertion 15.** A prose label, symbol, command name, or unnamed owner is
never copied into `Evidence` or `Owner` as a pseudo-path. The later migration commission resolves it
to a real tracked path or omits the optional field. Every unresolved omission is enumerated in the
migration receipt. This does not relax the checker.

A negative control is required before acceptance and must name each injected defect individually and
distinguishably. Procedure belongs to the implementing commission.

---

## 9. Non-goals

1. No edit to `DECISIONS.md`.
2. No entry wording; E074 and E038 compression remain phase-2b.
3. No change to `scripts/decisions-reference-graph.ts` under this commission.
4. No change to taxonomy, survey spec, closure work order, or `Archive/`.
5. No migration, archive creation, or content movement.
6. No production package-script wiring or CI integration before migration.
7. No new live-entry status, kind, force, execution, or field value.
