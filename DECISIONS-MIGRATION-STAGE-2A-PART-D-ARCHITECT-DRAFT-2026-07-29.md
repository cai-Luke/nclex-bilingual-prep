# Stage 2a Part D — PROVISIONAL ARCHITECT DRAFT (rev 3)

> **NOT THE MANIFEST.** This is not `audit/decisions-migration-2026-07-29/target-text-manifest.md`, is
> not ratified, is not owner-approved wording, and must not be used to begin Stage 2b or to edit
> `DECISIONS.md`. Every byte below is a candidate awaiting GPT independent review and Luke's
> exact-byte ratification.

**Date:** 2026-07-29 · **Seat:** Architect · **Revision:** rev 3, repairing the five findings in the
rev-2 GPT review (disposition `REVISE, narrowly`). Rev 3 reverses this seat's own rev-2 recommendation on
the E038 `Evidence` fork; see §8.3a for why the rev-2 argument was wrong.

**Scope:** the two carried Part C corrections; the pinned document order; exact target §§1–2; exact
target §3 with all 65 rows and the declared-total line; §§4–8 headings and transitions; the E053
structural §8 introduction; 13 archive wrappers with labels, metadata, index lines, and boundary
rationales; the six-row retired register; the separator convention; the E038 displaced-prose
preservation construction and `Evidence` pointer; and the manifest-level omission register.

## Revision record

| # | finding | source | disposition |
|---:|---|---|---|
| 1 | Target §1 read order stale and authority delegated to a Claude-specific file | GPT review 1 | Repaired, §3 |
| 2 | Target §2 `CONDITIONAL` omitted the ratified surviving-universal-core carve-out; `PARKED` asserted force through status | GPT review 2 | Repaired, §4 |
| 3 | E038 `Evidence` path cannot satisfy Stage 2a tracked-path verification | GPT review 3 | Route A selected; pending Amendment 1 ratification, §8.3a |
| 4 | Separator accounting off by one wrapper | GPT review 4 | Repaired, §8.5 |
| 5 | "Parser as it sits on disk" overclaimed; nine name-addressed P/R wrappers are rejected by the current parser | GPT review 5 | Repaired, §13 |
| 6 | Archive filename date `2026-07-29` no longer credible | GPT review, calls | Accepted. Filename and nine archival dates unbound to `<MIGRATION_DATE>`, §8.1 |
| 7 | Target §2 `REVISIT` omitted the ratified `ACTIVE + PENDING` limb | **this seat, rev 2** | Repaired, §4. Load-bearing for `R5#0` and `P25#3` |
| 8 | Target §2 omitted the ratified kind/status/execution independence rule | **this seat, rev 2** | Repaired, §4. This is Amendment 1's entire subject |
| 9 | Not every date-bearing byte moves with the migration date | **this seat, rev 2** | Pinned as an asymmetry, §8.1. A uniform re-date would break a ratified Amendment 4 byte |
| 10 | Prose occurrence count for the archive path was wrong (22 asserted, 20 enumerated) | rev-1 review, calls | Count removed rather than corrected, §8.1 |
| 11 | Rev 2's `PARKED` definition over-narrowed to settled rules and contradicted the two live `T + PARKED` entries | rev-2 review 1 | Repaired, §4 |
| 12 | Rev 2 recommended the deferred-pointer route on a misapplied ratchet argument | rev-2 review 2 | **Reversed. Route A selected; amendment drafted, §8.3a** |
| 13 | Sentence-count prerequisite described a 66-statement population against a pinned 65 | rev-2 review 3 | Repaired, §12.2 |
| 14 | Rev 2 asked for the date and the fork together, against its own §12.5 sequencing | rev-2 review 4 | Repaired, §12.5 |
| 15 | Rev 2 removed one hand count and introduced another — "eleven surfaces / seven do not" | rev-2 review 5 | Repaired, §14. Same defect class rev 2 had just condemned |

## Fixed inputs

- `MIGRATION_BASELINE`: `d499cc1d0916e03830489ec9cd0324cd1a203a73`
- Baseline byte length `76314`; SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`; valid UTF-8; trailing newline present
- Grammar: `DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md` as amended 2026-07-29
- Classification contract: `DECISIONS-TAXONOMY-2026-07-24.md`, Amendments 1–4, read live in full for rev 2
- Amendment 4: `DECISIONS-ARCHIVE-PRESERVATION-AND-WRAPPER-ADDRESSING-AMENDMENT-2026-07-29.md`, RATIFIED
- Process: `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md`, RATIFIED
- Verified archive spans and hashes: `DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md`
- Legacy source sections for `Origin`: `audit/decisions-cleanup-2026-07-24/inventory.md`
- Authority topology for §1 read live for rev 2: `CLAUDE.md` read order; `AGENTS.md` self-description
- Shared parser read live: `lib/decisions-format.ts`. Every parse-safety claim below is grounded in that
  file, with the post-guard qualification stated in §13.

Part D authors no live entry statement except the single E038 repair in §1.2. Parts A–C remain the
source of the 65 statements.

---

## 1. The two carried Part C corrections, applied

### 1.1 `R2#0` — `Owner` removed

`- **Owner:** `src/measurementUnitPolicy.ts`` is struck from `R2#0`. Final `R2#0` field list:

```markdown
- **Kind:** R
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-05
- **Execution:** EXECUTED
```

Registered in §10.2. No statement byte changes.

### 1.2 E038 — `Owner` removed, statement repaired, `Evidence` selected pending ratification

Changes to the Part C block titled `Producer assignments are operational state, not constitutional text`.

**Statement repaired.** Part C wrote "the project history record" as a bare description. GPT's Part C
correction directs that the statement keep its reference to `PROJECT-HISTORY.md` as the current
operational source of assignment state, which a description does not do. Repaired statement bytes:

```markdown
Current producer assignments are operational state and must be verified against `PROJECT-HISTORY.md`
rather than assumed timeless from this document. Changing the named producer does not alter permanent
identifiers, provenance classification, or independent-review obligations.
```

Two sentence boundaries under §2.1's grammar. `PROJECT-HISTORY.md` appears inside the statement, where
it is prose, not a field value — which is the distinction the correction turns on. Accepted at rev-2
review.

**Fields.** `Owner` struck; `Evidence` set to the normalized migration archive under Clause A of
`DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md` **once that clause is ratified** (§8.3a). The
field list is not manifest-eligible until then. Selected field list:

```markdown
- **Kind:** I
- **Status:** ACTIVE
- **Force:** ADVISORY
- **Date:** 2026-07-28
- **Evidence:** `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md`
```

`Owner: OMIT` is registered in §10.2.

**Heading and index summary unchanged** from Part C. The title is a name-addressed citation identity and
is not touched by this repair.

---

## 2. Pinned document and index order

Required by the deterministic review §3, which correctly refused to let scaffold stub order stand as a
ratified output order.

**Pinned:**

1. Target §4 carries `P` cores in ascending numeric identifier order, each core immediately followed by
   its own attachments in ascending ordinal order. Part A order then Part B order, unchanged.
2. Target §5 carries `R1` through `R6` in ascending numeric identifier order.
3. Target §6 carries the 19 `I` entries in the ratified outline order reproduced in Part C §5, rows
   44–62.
4. Target §7 carries the 3 `T` entries in the ratified outline order reproduced in Part C §5, rows
   63–65.
5. The target §3 index rows appear in exactly this order, which is the concatenation Part A → Part B →
   Part C.

The scaffold's destination-membership order — P8, P20, P31 after P30, and rulings sequenced R3, R5, R2,
R1, R4, R6 — is **not** the output order and is not carried forward. The format contract requires index
and body order to agree; it does not itself mandate numeric sorting, so this is an architect choice
recorded as one.

---

## 3. Exact target §1 — REPAIRED (rev 2, finding 1)

**What was wrong.** Rev 1 copied the legacy `DECISIONS.md` §1 read order, `AGENTS.md` → this file →
`PROJECT-HISTORY.md`, and attributed it to `CLAUDE.md`. Live `CLAUDE.md` states the order as `AGENTS.md`
→ `PROJECT-HISTORY.md` → `DECISIONS.md` → `NCLEX-Question-Schema.md`. The legacy prose is stale against
it, and migrating stale prose forward would launder a known-wrong claim through a ratification.

The deeper defect is the delegation itself. `CLAUDE.md` opens by stating it does not repeat `AGENTS.md`
or `PROJECT-HISTORY.md` and covers what is specific to working *as Claude*. `AGENTS.md` self-describes
as constitutional and says to read it first. A universal constitution may not source its authority
topology from a single-agent orientation file. Target §1 now states the relationships directly.

Rev 1 also asserted that a disagreeing claim is overridden by "the executable source named in the
entry's `Owner` field." Thirty-eight of the 65 blocks carry no `Owner`, and the `R2#0` correction in §1.1
exists precisely because a truthful singular owner was unavailable. The sentence is repaired to name the
executable source without presupposing a field.

```markdown
## 1. Purpose and authority boundaries

This file is the project's architectural constitution, not a chronological notebook. It is authoritative
for why a rule exists and what status that rule currently holds. It is never authoritative for a current
field shape, enum, version token, validator behavior, renderer contract, measurement, count, or citation:
those are owned by executable source or by a linked evidence document, named in the entry's `Owner` or
`Evidence` field where one path owns the whole statement. A claim here that disagrees with its owner is
stale rather than binding, whether or not this file names that owner.

`AGENTS.md` is the operational constitution and governs how work is done. `PROJECT-HISTORY.md` is the
current implementation-status map and overrides older implementation prose here. This file owns
architectural rationale and decision status. `NCLEX-Question-Schema.md`, `src/types.ts`, and
`src/schema.ts` own the schema and validator contracts.

A permanent identifier is the reference identity. Principles and rulings are cited as `P<n>` and `R<n>`;
standing invariants and open threads are cited by exact title, so a title is a citation identity and is
not edited for style. A Markdown slug is never a citation identity, and no Markdown anchor link into an
entry heading of this file is written inside this file. The legacy `principle N` form remains permanently
resolvable because `Archive/` is never rewritten.

Every entry states only what binds, authorizes, advises, or remains open, in one paragraph of one to
three sentences. Forcing-incident narrative, measurements, citation detail, chronology, method, and
litigation history are not restated here; they live in the source named by `Evidence` or in the files
named in §8. Compression is not deletion — material condensed out of an entry remains preserved and
discoverable through §8.
```

Parse notes. §1 contains no `###` heading, so no block is parsed from it. It contains no `](#…)`
sequence, so `ANCHOR_CITATION` cannot fire on it. `P<n>` and `R<n>` are backticked prose tokens carrying
no digits and are not derived-identifier shapes.

Note for review: the compression-rule paragraph now tracks taxonomy §2's enumeration — measurements,
counts, citations, source quotations, method, reasoning chains — and the first paragraph tracks taxonomy
§1's, which is wider than legacy §1's. Both were widened deliberately in rev 2.

---

## 4. Exact target §2 — REPAIRED (rev 2, findings 2, 7, 8)

**What was wrong.** Rev 1 restated legacy `DECISIONS.md` §2, which the ratified taxonomy has since
superseded on three of five status values.

- `CONDITIONAL`: rev 1 said the principle "lapses with that lane and needs no separate repeal." Taxonomy
  §4 ratifies the opposite as the default-plus-carve-out: the principle becomes `X` **unless** a
  surviving universal core is ratified to remain, in which case it is de-conditionalized, keeps its
  number, and returns to `ACTIVE`. Taxonomy §11 records `P8` as the first application of exactly that
  carve-out. Rev 1's wording would have made the live `P8` entry look anomalous in the document that
  ratifies it, and would have restated a superseded rule as constitutional text.
- `PARKED`: rev 1 said "not currently binding." That is a force claim asserted through the status axis.
  Taxonomy §5 makes force a separate axis, and Amendment 1's whole subject is that one axis was doing
  another's work. Legacy §2 did carry that phrase, and it is true of `P20#0` specifically — which
  carries `ADVISORY` — but it is not true of `PARKED` in general, since `P + PARKED` and `R + PARKED`
  may carry any force. The reader warning is preserved and moved onto the axis that owns it. **Rev 3:**
  rev 2's replacement then over-narrowed in the other direction, defining `PARKED` as settled
  architecture or a settled rule and asserting that revival is always a lane call. Taxonomy §4 makes
  `PARKED` compatible with `T`, and the target document carries two `T + PARKED` entries —
  `Translation-friction scoring` and `Exam-condition test and adaptive modes` — whose statements say the
  decisions are unresolved. Rev 2's bullet contradicted both live entries. Repaired below, with the
  taxonomy's own discriminator restored as the test.
- `REVISIT`: rev 1 gave only "`T` only" and dropped the limb that ratified-but-unbuilt work is
  `ACTIVE + PENDING` and never `REVISIT`. Two live blocks — `R5#0` and `P25#3` — are exactly that shape.
  Omitting the limb leaves the two entries most likely to be misread as open questions undefended in the
  vocabulary section. **This finding is this seat's, not the review's.**

Rev 1 also omitted the kind/status/execution independence rule entirely. That rule is the subject of
Amendment 1, it is what stops a `PENDING` rule being demoted to a thread, and a status-vocabulary section
that does not state it invites the exact regression the amendment was minted to prevent. **Also this
seat's finding.**

```markdown
## 2. Status vocabulary

Every entry carries exactly one kind, one status, and one force, plus an execution state where
implementation is a meaningful axis. There is no untagged default.

The four axes are independent. Kind says what an entry is; status says whether it binds now; force says
what it does when it applies; execution state says whether the thing it decided has been built. No
amount of outstanding work changes an entry's kind, and no status value overrides the force stated on the
entry. A settled decision whose implementation is pending is not an open question.

The closed vocabularies and the kind-to-status compatibility table are owned by
`DECISIONS-TAXONOMY-2026-07-24.md` and rendered into grammar by
`DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md`; the summaries here orient a reader and settle nothing.

Kinds: `P` a governing principle that decides cases not yet seen, cited by identifier and able to carry
attached blocks; `R` a concrete ruling that settles specified items and generalizes no further, cited by
identifier and able to carry attached blocks; `I` a standing invariant whose violation is a defect rather
than a judgment call, cited by exact title and carrying no attachments; `T` an unsettled question with a
named next action, cited by exact title and carrying no attachments; `X` an archived metadata wrapper,
which appears only in the archive file named in §8 and never here.

- **ACTIVE** — in force under the current project architecture.
- **CONDITIONAL** — a principle scoped to a named lane, feature, or workflow. When that lane retires the
  principle archives, unless a surviving universal core is ratified to remain, in which case the
  principle is de-conditionalized, keeps its number, and returns to `ACTIVE`. Lane retirement is not
  automatic archival of everything that lane's principles said. `P` only, and no live entry currently
  carries it.
- **PARKED** — inactive behind a named resumption trigger; compatible with `P`, `R`, and `T`. The
  discriminator is whether revival needs a fresh decision or only a lane call. For a `P` or `R` the
  decision is settled and revival is a lane call rather than a re-derivation. For a `T` the question is
  still unresolved and only work on it is paused, so revival resumes the decision process rather than
  activating a settled rule; what unblocks a parked thread is its named trigger, where a `REVISIT` thread
  waits on evidence or ratification instead. Force is stated on the entry and is not weakened by this
  status.
- **REVISIT** — an unresolved question awaiting evidence, a source check, a survey, or an explicit
  ratification. `T` only. A settled rule under renewed examination stays `ACTIVE` while a separate thread
  carries the reconsideration, and ratified-but-unbuilt work is `ACTIVE` with `Execution: PENDING`, never
  `REVISIT`.
- **SUPERSEDED** — replaced by a later cited ruling. No live entry carries it; it appears only on archive
  wrappers.

Force: `BINDING` means violating it fails a gate or is a defect; `AUTHORIZING` grants or withholds
permission for future work; `ADVISORY` records a preference or heuristic with no gate and no permission;
`HISTORICAL` records what happened and binds nothing. Force never changes as a side effect of
relocation — any entry whose force differs before and after a move is an owner ratification, not a
cleanup outcome.

`Execution` is `EXECUTED` where the decision is live in its named owner, `PENDING` where it is ratified
and not yet implemented, or `INACTIVE` where it is specified and deliberately not running. It is omitted
where the entry decides nothing implementable. A `PENDING` rule binds fully; nobody may choose a
different value on the grounds that the ratified one is not in code yet.
```

Parse notes. The five status bullets are `- **NAME** — …` list items in section 2.
`parseArchiveIndexLines` scans section 8 only, so they cannot be captured as archive-index lines.
`parseEntryIndex` scans section 3 only. The `CONDITIONAL` bullet's closing clause is a factual claim about
the post-migration document and is checkable: zero of the 65 blocks carry `CONDITIONAL`, because all four
`CONDITIONAL` principles retire and `P8` returns to `ACTIVE`.

---

## 5. Exact target §3

### 5.1 Introduction

```markdown
## 3. Entry index

One row per entry block, in document order. Derived and never the authority: where index and body
disagree, the body governs. The ID column is an em dash for name-addressed entries, whose summary equals
the entry title byte-for-byte.
```

### 5.2 Table, 65 rows, and declared total

```markdown
| ID | kind | status | force | summary |
|---|---|---|---|---|
| P1 | P | ACTIVE | BINDING | Answer placement is owned by code |
| P2 | P | ACTIVE | BINDING | Independent review is scoped to judgment |
| P2 | P | ACTIVE | BINDING | Application: spec conformance and content review stay split |
| P3 | P | ACTIVE | BINDING | Deterministic core, capped semantic residual |
| P4 | P | ACTIVE | BINDING | Rationales are position-agnostic and bilingual |
| P5 | P | ACTIVE | BINDING | Generated is not reviewed |
| P5 | P | ACTIVE | AUTHORIZING | Narrowing: named-model restrictions are lane policy |
| P6 | P | ACTIVE | BINDING | Visuals are deterministic, curated imagery has a separate lane |
| P7 | P | ACTIVE | ADVISORY | Precision over volume |
| P8 | P | ACTIVE | BINDING | Clinical truth is authored upstream and read-only downstream |
| P10 | P | ACTIVE | BINDING | Study sessions mirror the exam distribution |
| P11 | P | ACTIVE | BINDING | Visual arithmetic is a machine-checked gate carrying no engine |
| P15 | P | ACTIVE | BINDING | Bank patches are raw-scoped and declarative |
| P15 | P | ACTIVE | BINDING | Application: a declarative op names a field path, not a record |
| P16 | P | ACTIVE | BINDING | Answer-pattern bias is presentation-first |
| P16 | P | ACTIVE | BINDING | Amendment: a canonical file is not a learner-visible population |
| P16 | P | ACTIVE | ADVISORY | Standing authoring note on surviving distributional signal |
| P17 | P | ACTIVE | BINDING | Scoring is polytomous, retention is full-marks |
| P19 | P | ACTIVE | BINDING | Rationale visuals are explanation figures, not stimuli |
| P20 | P | PARKED | ADVISORY | Pronunciation audio is pre-generated and local-first |
| P21 | P | ACTIVE | BINDING | Repo-reading generation prompts carry the semantic floor |
| P21 | P | ACTIVE | BINDING | Application: construction language stays off the learner surface |
| P21 | P | ACTIVE | BINDING | Application: construction language is functional, not positional |
| P23 | P | ACTIVE | BINDING | Exam-like presentation is a renderer concern |
| P23 | P | ACTIVE | BINDING | Application: sparse shape-aware allocation |
| P23 | P | ACTIVE | BINDING | Application: an embedded leaf is a planning unit, not a retirement unit |
| P24 | P | ACTIVE | BINDING | Structured measurements are values-only exhibit presentation |
| P25 | P | ACTIVE | BINDING | Necessity is a property of the artifact |
| P25 | P | ACTIVE | BINDING | Application: composite trend artifacts |
| P25 | P | ACTIVE | BINDING | Amendment: unified single-axis vitals trend with retained flowsheet |
| P25 | P | ACTIVE | BINDING | Application: reinstate the visible flowsheet beneath the unified chart |
| P26 | P | ACTIVE | BINDING | A disposition that suppresses a check must itself be checked |
| P27 | P | ACTIVE | BINDING | An invariant softens only by naming its forcing incident |
| P28 | P | ACTIVE | BINDING | Scored leaves govern planning, session units govern delivery |
| P29 | P | ACTIVE | BINDING | Sparse laboratory-presentation cardinality is not a validity floor |
| P30 | P | ACTIVE | BINDING | Lab reference bands are adult-only and pediatric bands fail closed |
| P31 | P | ACTIVE | BINDING | Gemini's standing restrictions |
| R1 | R | ACTIVE | AUTHORIZING | Standalone bowtie may be generated directly |
| R2 | R | ACTIVE | BINDING | CBC units are conventional-first with SI in parentheses |
| R3 | R | ACTIVE | BINDING | Temperature sanity ceiling 46.5 °C |
| R4 | R | ACTIVE | BINDING | Promoted visual parity is a committed per-kind baseline |
| R5 | R | ACTIVE | BINDING | Vital sanity ratifications for SBP, RR, and SpO2 |
| R6 | R | ACTIVE | AUTHORIZING | Pull-request and post-merge CI coverage are distinct |
| — | I | ACTIVE | ADVISORY | Producer assignments are operational state, not constitutional text |
| — | I | ACTIVE | BINDING | Deterministic review routing for promoted opus-prefixed case IDs |
| — | I | ACTIVE | BINDING | Runtime audio carries no client-embedded secret |
| — | I | ACTIVE | BINDING | Bilingual English and Simplified Chinese parity on all displayed text |
| — | I | ACTIVE | BINDING | Topic labels are English-only |
| — | I | ACTIVE | BINDING | JSON quote hygiene is a parse-time gate |
| — | I | ACTIVE | BINDING | Question IDs are globally unique across bundled banks |
| — | I | ACTIVE | BINDING | Raw-draft filename prefix routes to its canonical bank |
| — | I | ACTIVE | BINDING | Canonical merges are deterministic and gated |
| — | I | ACTIVE | BINDING | Runtime stays static, offline, and file-protocol compatible |
| — | I | ACTIVE | BINDING | Schema versions are an ordered token, not semver |
| — | I | ACTIVE | ADVISORY | Schema changes are rare and deliberate |
| — | I | ACTIVE | BINDING | Shared visual numeric helpers have a single definition |
| — | I | ACTIVE | BINDING | Case-study exhibit IDs share one namespace |
| — | I | ACTIVE | BINDING | Category targets are the current test-plan weights |
| — | I | ACTIVE | BINDING | Bank composition is a floor problem, not a balance problem |
| — | I | ACTIVE | BINDING | Repository-state hygiene is mechanism-specific |
| — | I | ACTIVE | BINDING | Some topics are deliberately shared across categories |
| — | I | ACTIVE | BINDING | Highlight's structural bias gate is schema-level |
| — | T | PARKED | ADVISORY | Translation-friction scoring |
| — | T | PARKED | ADVISORY | Exam-condition test and adaptive modes |
| — | T | REVISIT | ADVISORY | Unresolved vital sanity bounds |

**Declared total:** 65 entry blocks.
```

### 5.3 Index verification performed against the parser

- Header row is byte-identical to the literal the parser matches; separator row is `|---|---|---|---|---|`.
- 65 rows: 37 `P`, 6 `R`, 19 `I`, 3 `T`. Row count equals declared total equals expected body count.
- No summary cell contains `|`, which the row regex forbids.
- Every ID cell is either `—` or matches `^(P|R)\d+$`.
- ID-addressed block keys, derived by the parser's per-ID occurrence counter over this row order, are
  `P1#0`; `P2#0`, `P2#1`; `P3#0`; `P4#0`; `P5#0`, `P5#1`; `P6#0`; `P7#0`; `P8#0`; `P10#0`; `P11#0`;
  `P15#0`, `P15#1`; `P16#0`, `P16#1`, `P16#2`; `P17#0`; `P19#0`; `P20#0`; `P21#0`, `P21#1`, `P21#2`;
  `P23#0`, `P23#1`, `P23#2`; `P24#0`; `P25#0`, `P25#1`, `P25#2`, `P25#3`; `P26#0`; `P27#0`; `P28#0`;
  `P29#0`; `P30#0`; `P31#0`; `R1#0` through `R6#0`. These equal the Part A §3, Part B §3, and Part C §5
  body keys in the same order.
- Every name-addressed summary equals its heading title byte-for-byte, which the conformance metadata
  check requires and which is also that entry's block key.
- All 22 name-addressed titles are distinct across the whole document, so `TITLE_COLLISION` cannot fire.
- Allocation union: live `P` cores {1–8, 10, 11, 15–17, 19–21, 23–31} — 25 identifiers — plus register
  {P9, P12, P13, P14, P18, P22} = 31 identifiers, contiguous 1 through 31. Live `R` = R1–R6, contiguous.
- Declared-total line matches the required grammar exactly and follows the table after one blank line.
- Zero rows carry `CONDITIONAL`, consistent with §4's closing clause.

---

## 6. Exact §§4–7 headings and transitions

```markdown
## 4. Governing principles

Cited by permanent identifier. A `####` block is an application, amendment, narrowing, or standing note
attached to the `###` core carrying the same identifier, and it holds its own status, force, date, and
execution state. Identifiers `P9`, `P12`, `P18`, and `P22` are retired and `P13` and `P14` were never
assigned; see §8.
```

```markdown
## 5. Concrete rulings

Cited by permanent identifier. A ruling settles specified items and generalizes no further. Rulings may
carry attached blocks under the same grammar as §4; none currently does.
```

```markdown
## 6. Standing invariants

Cited by exact title. An invariant carries no attached blocks — an application of an invariant is its own
entry.
```

```markdown
## 7. Open threads

Cited by exact title. Nothing here describes settled behavior; each entry states what is unresolved and
what would settle it. A ratified decision awaiting implementation does not belong here — it stays in
§§4–6 carrying `Execution: PENDING`.
```

Parse note. All four blocks sit between a `## N.` heading and the section's first `###`, which the entry
loop never enters. The §4 transition names retired identifiers in backticks as prose, not as headings or
index rows, so assertion 10 and the retired-register parse are unaffected.

---

## 7. Exact target §8

Every occurrence of `<MIGRATION_DATE>` below is an unbound owner input governed by §8.1 and must be
rendered at assembly, not carried forward as a literal.

### 7.1 E053 structural introduction

E053 becomes structural prose under Amendment 4 §6. It receives no wrapper, no archive-index line, and
no register row, and is the single place all three preservation files are named.

```markdown
## 8. Archive and retired identifiers

This section carries pointers only: no entry bodies and no archive wrappers. Condensed forcing-incident
narrative, superseded rulings, and lapsed lane contracts are preserved rather than deleted, across three
files. `Archive/DECISIONS-ARCHIVE-2026-07-14.md` remains the record of the 2026-07-14
architectural-constitution pass and is not edited by this migration. `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md`
is the normalized archive for this migration and is the sole file every archive-index line below points
at. `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` is a one-time byte-identical snapshot of this file at
`MIGRATION_BASELINE`, authorized once under taxonomy §9 Amendment 4; it is never current authority,
carries no wrapper, receives no index line, and is never parsed by the conformance checker.

Archive index — thirteen wrappers, one line each, in ascending source-byte order.
```

Parse note, load-bearing. No line in this prose opens `- **`, so `parseArchiveIndexLines` cannot capture
any of it as an index line and cannot emit `INVALID_FIELD_VALUE` for a missing pointer. The paragraph
names three files but only the thirteen index lines below contribute to the archive-source set that
`selectDefinitionIndex` counts, so `TARGET_ARCHIVE_SOURCE_COUNT` sees exactly one file. Verified against
`scripts/decisions-reference-graph.ts`: that set is built from `parsed.archiveIndex` pointer files alone
and is not influenced by prose or by any `Evidence` field value.

**Snapshot filename asymmetry (rev 2, finding 9).** `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` is a
ratified literal in Amendment 4 §3.3 item 1 and taxonomy §9. It does **not** carry `<MIGRATION_DATE>` and
must not be re-dated when the migration date is bound. Re-dating it would break a ratified Amendment 4
byte and would require a fresh amendment. The two archive filenames in this paragraph therefore behave
differently on purpose.

### 7.2 The thirteen archive-index lines

```markdown
- **Most recent application of P27 and its rejected alternatives (2026-07-12 pass)** — condensed application and its standing rejection history, archived <MIGRATION_DATE>.
  `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md#most-recent-application-of-p27-and-its-rejected-alternatives-2026-07-12-pass`
- **Forward case-generation lane lapse note (2026-07-18)** — section-level lapse disposition, archived <MIGRATION_DATE>.
  `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md#forward-case-generation-lane-lapse-note-2026-07-18`
- **Lane-specific detail of P8 (forward case-generation pipeline)** — lapsed lane detail of a live principle, archived <MIGRATION_DATE>.
  `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md#lane-specific-detail-of-p8-forward-case-generation-pipeline`
- **P9 The case skeleton is English-only** — lapsed conditional lane contract, retired 2026-07-28.
  `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md#p9-the-case-skeleton-is-english-only`
- **P12 Author-side currency via closed-world construction and routed flags** — lapsed conditional lane contract, retired 2026-07-28.
  `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md#p12-author-side-currency-via-closed-world-construction-and-routed-flags`
- **P18 Fact-check and flag-only review are chain steps** — lapsed conditional lane contract, retired 2026-07-28.
  `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md#p18-fact-check-and-flag-only-review-are-chain-steps`
- **P22 Opus skeleton cases are GPT-provenance for review-conflict purposes** — lapsed conditional lane contract, retired 2026-07-28.
  `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md#p22-opus-skeleton-cases-are-gpt-provenance-for-review-conflict-purposes`
- **CBC American-conventional unit ruling (superseded 2026-07-05)** — superseded original ruling, archived <MIGRATION_DATE>.
  `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md#cbc-american-conventional-unit-ruling-superseded-2026-07-05`
- **Fishbone workflow-familiarity waiver (2026-07-06, superseded)** — superseded ad hoc waiver, archived <MIGRATION_DATE>.
  `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md#fishbone-workflow-familiarity-waiver-2026-07-06-superseded`
- **Withdrawn claim that vital sanity bounds pass every real value** — withdrawn characterization, archived <MIGRATION_DATE>.
  `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md#withdrawn-claim-that-vital-sanity-bounds-pass-every-real-value`
- **Withdrawn governance-markdown encoding gate (2026-07-09)** — withdrawn ruling with its named reasoning error, archived <MIGRATION_DATE>.
  `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md#withdrawn-governance-markdown-encoding-gate-2026-07-09`
- **Study-session distribution pointer to code** — appendix pointer condensed out of a live principle, archived <MIGRATION_DATE>.
  `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md#study-session-distribution-pointer-to-code`
- **Session artifacts implemented-spec pointer list** — appendix pointer list, archived <MIGRATION_DATE>.
  `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md#session-artifacts-implemented-spec-pointer-list`
```

Note on the four "retired 2026-07-28" phrases: those are historical retirement dates ratified on
2026-07-28 and are **not** `<MIGRATION_DATE>`. The nine "archived <MIGRATION_DATE>" phrases are archival
dates and do move. Same asymmetry as §7.1.

Parse verification against `lib/decisions-format.ts`:

- Each label line matches `^- \*\*(.+)\*\* — .+$`; no label contains `**`, so the greedy capture ends at
  the intended delimiter.
- Each pointer line is exactly two spaces, a backtick, the file path, `#`, the anchor, a backtick; the
  file part contains no `#`, which the pointer regex requires. `<MIGRATION_DATE>` contains no `#`.
- The four ID-addressed labels are `<ID> <title>` with a single space and no em dash, which is the
  `expectedLabel` the conformance check builds from the wrapper. The nine name-addressed labels equal
  their wrapper titles.
- No name-addressed label begins `P<n> ` or `R<n> `, so none parses as ID-addressed and none can fail
  `ARCHIVE_INDEX_MISMATCH` against a name-addressed wrapper.
- Every anchor equals `markdownHeadingAnchor` of the corresponding wrapper heading, derived in §8.4 and
  reproduced there per wrapper. Anchors contain no migration date and are unaffected by §8.1. For
  ID-addressed wrappers the anchor is derived from the full `<ID> — <title>` heading, so the em dash
  collapses into the surrounding hyphen run.
- Thirteen labels, thirteen wrappers, bijection by block key.

### 7.3 The six-row retired-identifier register

```markdown
Retired and never-assigned identifiers are permanently unavailable. This register is append-only; an
entry never leaves it, and no live entry may carry a listed identifier.

| ID | disposition | date | pointer |
|---|---|---|---|
| P9 | RETIRED | 2026-07-28 | `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md#p9-the-case-skeleton-is-english-only` |
| P12 | RETIRED | 2026-07-28 | `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md#p12-author-side-currency-via-closed-world-construction-and-routed-flags` |
| P13 | NEVER ASSIGNED | — | — |
| P14 | NEVER ASSIGNED | — | — |
| P18 | RETIRED | 2026-07-28 | `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md#p18-fact-check-and-flag-only-review-are-chain-steps` |
| P22 | RETIRED | 2026-07-28 | `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md#p22-opus-skeleton-cases-are-gpt-provenance-for-review-conflict-purposes` |
```

The four register dates are retirement dates, ratified 2026-07-28, and do not move with the migration
date. Only the pointer filenames move.

Parse notes. The register parser locates the header row in section 8 and skips exactly one separator
line, so the separator must be the single `|---|---|---|---|` row shown. `RETIRED` rows require both a
`YYYY-MM-DD` date and a backticked pointer; `NEVER ASSIGNED` rows require both cells to be exactly `—`.
Register order is P9, P12, P13, P14, P18, P22 — ascending numeric, which the parser does not require but
which matches the format specification's worked example. The two introductory sentences do not open
`- **`, so they cannot be captured as archive-index lines.

---

## 8. The normalized migration archive

### 8.1 The migration date is unbound — REPAIRED (rev 2, findings 6, 9, 10)

**Rev 1 pinned `Archive/DECISIONS-ARCHIVE-2026-07-29.md`. That is withdrawn.** At 23:12 EDT on
2026-07-29, with five prerequisites outstanding (§12), a 2026-07-29 migration commit is not credible
under the ratified staged process. The date is now an unbound owner input.

**`MIGRATION_DATE` is an owner input, bound once, before assembly.** It is defined mechanically in
Amendment 1 Clause B §2.2 as the `America/New_York` calendar date of the **author** timestamp of the Stage 2b
content commit that first contains the migrated `DECISIONS.md` and the normalized archive — a verification
predicate, not a derivation, since the filename cannot be computed from a commit that does not yet exist. It
is not defaulted and is not inferred by any seat. Assembly of
`audit/decisions-migration-2026-07-29/target-text-manifest.md` may not begin until it is bound, because the
commission forbids a placeholder in the manifest and the manifest must carry literal bytes.

**What moves when it is bound, and what does not.** This asymmetry is load-bearing; a uniform re-date
would break ratified bytes. Each row carries a stable surface ID — `D` for date-dependent, `F` for fixed —
as Amendment 1 Clause B §2.2 requires. **These IDs name surface classes. Assembly must resolve each ID to
concrete locators in the assembled bytes**; a class-level inventory does not satisfy Clause B, and the
derived occurrence report must map every concrete occurrence to exactly one row.

| ID | surface | moves with `MIGRATION_DATE`? |
|---|---|---|
| D1 | Normalized archive filename, every occurrence | **yes** |
| D2 | The nine non-retiring wrappers' `Date` field — an archival date | **yes** |
| D3 | The nine "archived …" phrases in archive-index lines | **yes** |
| D4 | Archive preamble title and its body prose | **yes** |
| D5 | E038 `Evidence` value, under Clause A of Amendment 1 once ratified (§8.3a) | **yes** |
| F1 | `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` | **no** — ratified literal in Amendment 4 §3.3 and taxonomy §9 |
| F2 | `Archive/DECISIONS-ARCHIVE-2026-07-14.md` | **no** — prior archive, never edited |
| F3 | The four retiring wrappers' `Date` field — 2026-07-28 retirement date | **no** — historical fact |
| F4 | The four register dates — 2026-07-28 | **no** — historical fact |
| F5 | The four "retired 2026-07-28" index phrases | **no** — historical fact |
| F6 | Every anchor | **no** — no anchor contains the migration date |
| F7 | `MIGRATION_BASELINE` and all thirteen span hashes | **no** |
| F8 | The `audit/decisions-migration-2026-07-29/` directory name | **no** — it is the commission's own ratified path |

**No prose occurrence count is carried.** Rev 1 asserted the filename appears in 22 ratified places and
then enumerated 20 — the assertion was wrong and the enumeration was the honest number. Rather than
correct a hand count that will go stale again, the assembled manifest must **derive and report the
occurrence population from its own bytes** and assert that every occurrence carries the bound date. A
hand-maintained count of a mechanically derivable population is the same class of defect as the `78`
that survived three passes.

### 8.2 Archive preamble — exact bytes

Placed before the first `###` wrapper heading.

```markdown
# DECISIONS archive — <MIGRATION_DATE> cleanup migration

Material condensed out of `DECISIONS.md` during the <MIGRATION_DATE> target-grammar migration. Each
wrapper below carries a migration-authored metadata header followed by a historical body preserved
byte-for-byte from `DECISIONS.md` at `MIGRATION_BASELINE`. Nothing in this file is current authority.
`Archive/DECISIONS-ARCHIVE-2026-07-14.md` remains the record of the earlier 2026-07-14
architectural-constitution pass and is not superseded by this file.

## Preserved displaced prose

This section carries prose condensed out of an entry that remains live under the same identity. It is not
an archive wrapper: it carries no metadata fields, produces no retired-register row, is reachable from no
archive-index line, and is pointed at only by the `Evidence` field of the live entry named below.

**Current producer assignment callout, displaced from the live standing invariant "Producer assignments
are operational state, not constitutional text" (`DECISIONS.md` §5 at `MIGRATION_BASELINE`).** The
paragraph below is preserved verbatim, including its self-reference: "this file" in it means
`DECISIONS.md` as it stood at the baseline, not this archive.

<E038 preserved slice — exact baseline bytes, see §8.3>

## Archived entries
```

Rev-3 note: rev 2 struck the clause naming the `Evidence` pointer, because the fork was open. It is
restored here conditionally. These preamble bytes and E038's `Evidence` field are manifest-eligible only if
Clause A of Amendment 1 is ratified. If Clause A is refused, Stage 2a remains blocked and no fallback
omission is authorized — omitting the field is the rejected deferral route of Amendment 1 §1.4 and fails the
phase-1 required outcome.

### 8.3 E038 displaced-prose preservation construction

**Requirement being discharged.** The phase-1 closure ruling
(`DECISIONS-CLEANUP-PHASE-1-CLOSURE-CODEX-WORK-ORDER-2026-07-28.md` §3 item 5) requires the displaced
dated assignment prose to be preserved verbatim in the phase-2 archive and pointed at from E038's
evidence pointer, and states that this creates no archive-index row. Amendment 4 permits no fourteenth
wrapper for it, because E038 remains live under the same title.

**Pinned slice.**

- Source: `git show MIGRATION_BASELINE:DECISIONS.md`
- Span: `[52641,53203)` — zero-based half-open, the same convention as the thirteen wrapper spans
- Byte length: `562`
- Final byte is `0x0a`: **yes**
- Provenance of the span: `DECISIONS-MIGRATION-STAGE-2A-CANDIDATE-REGIONS-2026-07-29.md`, line 307
  reported as `[52641,53203)`, with line 308 `[53203,53204)` the following blank line, which is
  **excluded** from the preserved slice. The live source packet's E038 anchor `[52641,53204)` includes
  that blank line; the preservation slice deliberately does not, so the slice ends at its own terminating
  newline and the archive supplies its own blank line.
- SHA-256: **required deterministic addendum — see §12.1. Not architect-authored and not guessed.**

**Placement.** Inside the archive preamble of §8.2, before the first `###` heading. Unchanged in rev 2
and accepted at review.

**Why that location and no other, verified against `lib/decisions-format.ts`.** `parseArchiveDocument`
segments the file on `^### ` headings only, and each wrapper body is `text.slice(bodyStart, bodyEnd)`
where `bodyEnd` is the start of the next `### ` line or end of file. Text placed after the last wrapper
would therefore be absorbed into that wrapper's body, breaking the pinned byte and hash preservation of
E076. Text placed between two wrappers would do the same to the earlier one. Only text before the first
`### ` heading is outside every wrapper body, and it is never parsed at all. A `##` heading does not
segment the archive, so the preamble's headings are inert.

**Framing bytes are migration-authored and outside the preserved slice.** The bold lead-in sentence in
§8.2 is authored text. It must never be counted inside the hashed slice, and the target reconcile checker
must compare the pinned 562 bytes against the file content between the framing paragraph and the
`## Archived entries` heading, exclusive of the blank lines that separate them.

### 8.3a The E038 `Evidence` exception — RESOLVED, OWNER RATIFICATION REQUIRED (rev 3)

**The conflict, stated precisely.** Two ratified contracts collide, and the collision is structural
rather than convenient.

- The phase-1 closure ruling requires E038's evidence pointer to name a **phase-2 output**: the
  normalized archive, which cannot exist before Stage 2b.
- Commission §4.6 requires every `Evidence` path to be resolved and **verified to exist at the Stage 2a
  review commit**, and §2.2 makes an untracked `Evidence` path a hard stop that forbids Stage 2b from
  beginning.

Stage 2b cannot begin until the manifest is ratified; the path cannot exist until Stage 2b begins. Rev 1
wrote that the path "becomes valid only inside the migration commit," which describes the problem and
does not discharge the contract. The review is right to refuse it.

**Architect position: the narrow sequencing exception, pending Amendment 1 ratification. This seat's rev-2
recommendation is withdrawn.** Rev 2
recommended deferring the pointer to a post-migration commission, on the ground that deferral "softens
nothing" while the exception softens a ratified verification floor. The rev-2 review overruled that, and
it was right. The error is recorded here rather than quietly corrected, because it was a misapplication of
principle 27 and not a slip.

Deferral does soften something ratified. The phase-1 closure ruling requires the **migrated** E038 entry
to point at the preserved prose through its `Evidence` field. A migration that lands E038 without that
pointer ships a target which fails a ratified final-state requirement and defers the repair. So the choice
was never between softening and not softening; it was between two deviations:

- the **exception** deviates on sequencing — one Stage 2a checkpoint is waived for one manifest-pinned
  path, while the required final state and the final conformance gate are both preserved;
- **deferral** deviates on outcome — the merged state is knowingly non-conforming to the phase-1 ruling,
  and the fix crosses a merge boundary.

The sequencing deviation is narrower, and it preserves the commission's atomic-PR shape, so the interval
in which the archive exists without its pointer is zero rather than one merge long. Deferral would
manufacture exactly the open governance debt this migration exists to close. Rev 2 weighed the cost to the
verification floor and failed to weigh the cost to the ratified outcome, which is the more load-bearing of
the two.

**The exception must be ratified as an amendment to the migration commission, not left inside a
provisional draft.** Part D is not a ratifiable instrument, and a scoped exception to ratified commission
§§2.2 and 4.6 needs its own. Drafted as
`DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md`, Clause A, whose operative text is the rev-2
review's wording — stronger than rev 2's own because it expressly preserves final conformance assertion
15, exact manifest equality, atomicity, and a return-to-Stage-2a trigger on any change to the pinned
filename — carried under principle 27 with the forcing incident named.

**Rejected without qualification:** an empty placeholder archive file, or `git add --intent-to-add` on a
path with no content, to manufacture trackedness at Stage 2a. Both fabricate the fact the check exists to
establish.

### 8.4 The thirteen wrappers — exact headings, fields, spans, and anchors

Every wrapper's live metadata is `Kind: X`, `Status: SUPERSEDED`, `Force: HISTORICAL`. `Original Kind`
and `Original Status` are historical metadata and are never `X` and never scaffold shorthand.
`Origin` takes the exact shape `` `DECISIONS.md` <section> at `MIGRATION_BASELINE` ``, which is what the
parser's Origin regex requires. Wrapper order is ascending source-byte offset.

#### Wrapper 01 — E032, name-addressed

- Heading: `### Most recent application of P27 and its rejected alternatives (2026-07-12 pass)`
- Anchor: `most-recent-application-of-p27-and-its-rejected-alternatives-2026-07-12-pass`
- Span `[41665,42597)`, length `932`, SHA-256 `ce225de0bc3b233986e8a968b54a1810f49defe82b5e190d10f9b7ab8d20174b`, final byte `0x0a`
- Separator after body: one LF

```markdown
- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** <MIGRATION_DATE>
- **Original Kind:** P
- **Original Status:** ACTIVE
- **Origin:** `DECISIONS.md` §4 at `MIGRATION_BASELINE`
```

`P27` remains live; no identifier retires and no register row is produced.

#### Wrapper 02 — E036, name-addressed

- Heading: `### Forward case-generation lane lapse note (2026-07-18)`
- Anchor: `forward-case-generation-lane-lapse-note-2026-07-18`
- Span `[50844,51342)`, length `498`, SHA-256 `746a9c648223c2f2a0c1b1ce4c64ea1e62b4e12083f26fb1094a933f2b68a0b0`, final byte **not** `0x0a`
- Separator after body: **two LFs**

```markdown
- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** <MIGRATION_DATE>
- **Original Kind:** R
- **Original Status:** ACTIVE
- **Origin:** `DECISIONS.md` §5 at `MIGRATION_BASELINE`
```

#### Wrapper 03 — E039b, name-addressed

- Heading: `### Lane-specific detail of P8 (forward case-generation pipeline)`
- Anchor: `lane-specific-detail-of-p8-forward-case-generation-pipeline`
- Span `[53661,54291)`, length `630`, SHA-256 `781b8f8cde02d07338aebec48298d3833d2f8627d7780f8cd50587144d2c4d47`, final byte `0x0a`
- Separator after body: one LF

```markdown
- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** <MIGRATION_DATE>
- **Original Kind:** P
- **Original Status:** CONDITIONAL
- **Origin:** `DECISIONS.md` §5 at `MIGRATION_BASELINE`
```

`P8` is restored live in target §4 under the taxonomy §4 `CONDITIONAL` carve-out; no identifier retires
here.

#### Wrapper 04 — E040, ID-addressed, retires P9

- Heading: `### P9 — The case skeleton is English-only`
- Anchor: `p9-the-case-skeleton-is-english-only`
- Span `[54292,54790)`, length `498`, SHA-256 `b5259fd359f139364f79de63a040c64cfe1fa499757b0d4df8de674904d3600b`, final byte `0x0a`
- Separator after body: one LF

```markdown
- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-07-28
- **Original Kind:** P
- **Original Status:** CONDITIONAL
- **Retired ID:** P9
- **Origin:** `DECISIONS.md` §5 at `MIGRATION_BASELINE`
```

#### Wrapper 05 — E041, ID-addressed, retires P12

- Heading: `### P12 — Author-side currency via closed-world construction and routed flags`
- Anchor: `p12-author-side-currency-via-closed-world-construction-and-routed-flags`
- Span `[54791,55582)`, length `791`, SHA-256 `b11d42ed7b9d1647f9987563eedee5e9c0a384082f05583a3be3701692054e19`, final byte `0x0a`
- Separator after body: one LF

```markdown
- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-07-28
- **Original Kind:** P
- **Original Status:** CONDITIONAL
- **Retired ID:** P12
- **Origin:** `DECISIONS.md` §5 at `MIGRATION_BASELINE`
```

#### Wrapper 06 — E042, ID-addressed, retires P18

- Heading: `### P18 — Fact-check and flag-only review are chain steps`
- Anchor: `p18-fact-check-and-flag-only-review-are-chain-steps`
- Span `[55583,56120)`, length `537`, SHA-256 `2d6de6b17fc06f5505faa09ddeeaabf5df78904f9ff7d2022d864ada7453d8eb`, final byte `0x0a`
- Separator after body: one LF

```markdown
- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-07-28
- **Original Kind:** P
- **Original Status:** CONDITIONAL
- **Retired ID:** P18
- **Origin:** `DECISIONS.md` §5 at `MIGRATION_BASELINE`
```

#### Wrapper 07 — E043b, ID-addressed, retires P22

- Heading: `### P22 — Opus skeleton cases are GPT-provenance for review-conflict purposes`
- Anchor: `p22-opus-skeleton-cases-are-gpt-provenance-for-review-conflict-purposes`
- Span `[56121,56543)`, length `422`, SHA-256 `4350881da63237d4c260d5a130132af3f45752231553050aad5fb8b8870b0a68`, final byte **not** `0x0a`
- Separator after body: **two LFs**

```markdown
- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-07-28
- **Original Kind:** P
- **Original Status:** CONDITIONAL
- **Retired ID:** P22
- **Origin:** `DECISIONS.md` §5 at `MIGRATION_BASELINE`
```

#### Wrapper 08 — E048, name-addressed

- Heading: `### CBC American-conventional unit ruling (superseded 2026-07-05)`
- Anchor: `cbc-american-conventional-unit-ruling-superseded-2026-07-05`
- Span `[62297,62907)`, length `610`, SHA-256 `600ffba62e19db1e17e9d2eb8190ae2538135e63c88642fa27da7068fc274fa6`, final byte `0x0a`
- Separator after body: one LF

```markdown
- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** <MIGRATION_DATE>
- **Original Kind:** R
- **Original Status:** SUPERSEDED
- **Origin:** `DECISIONS.md` §8 at `MIGRATION_BASELINE`
```

The original ruling never held an `R` number, so none retires and none is invented. `R2` carries the
surviving amendment as a live ruling.

#### Wrapper 09 — E050, name-addressed

- Heading: `### Fishbone workflow-familiarity waiver (2026-07-06, superseded)`
- Anchor: `fishbone-workflow-familiarity-waiver-2026-07-06-superseded`
- Span `[64005,64356)`, length `351`, SHA-256 `55d77725bb717a2e6d740776c3156acbc4ca82440e20511f1ba3c4a6d5657438`, final byte `0x0a`
- Separator after body: one LF

```markdown
- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** <MIGRATION_DATE>
- **Original Kind:** R
- **Original Status:** SUPERSEDED
- **Origin:** `DECISIONS.md` §8 at `MIGRATION_BASELINE`
```

#### Wrapper 10 — E051, name-addressed

- Heading: `### Withdrawn claim that vital sanity bounds pass every real value`
- Anchor: `withdrawn-claim-that-vital-sanity-bounds-pass-every-real-value`
- Span `[64357,64837)`, length `480`, SHA-256 `0e22abba431d56e29150e2dd3c5e609053b659adc1598904e9ee96b077338e27`, final byte `0x0a`
- Separator after body: one LF

```markdown
- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** <MIGRATION_DATE>
- **Original Kind:** R
- **Original Status:** SUPERSEDED
- **Origin:** `DECISIONS.md` §8 at `MIGRATION_BASELINE`
```

#### Wrapper 11 — E052, name-addressed

- Heading: `### Withdrawn governance-markdown encoding gate (2026-07-09)`
- Anchor: `withdrawn-governance-markdown-encoding-gate-2026-07-09`
- Span `[64838,66593)`, length `1755`, SHA-256 `d9e68b9dd5b29f17da155e2021b9b72da91172c677ce8cf445de48da676a4d76`, final byte `0x0a`
- Separator after body: one LF

```markdown
- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** <MIGRATION_DATE>
- **Original Kind:** R
- **Original Status:** SUPERSEDED
- **Origin:** `DECISIONS.md` §8 at `MIGRATION_BASELINE`
```

#### Wrapper 12 — E075, name-addressed

- Heading: `### Study-session distribution pointer to code`
- Anchor: `study-session-distribution-pointer-to-code`
- Span `[75189,75483)`, length `294`, SHA-256 `0755d97e56843a9d966093d7d5e63273592ae5f82a9d92e6b52db7748f2b848d`, final byte `0x0a`
- Separator after body: one LF

```markdown
- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** <MIGRATION_DATE>
- **Original Kind:** P
- **Original Status:** ACTIVE
- **Origin:** `DECISIONS.md` Reference appendices at `MIGRATION_BASELINE`
```

#### Wrapper 13 — E076, name-addressed

- Heading: `### Session artifacts implemented-spec pointer list`
- Anchor: `session-artifacts-implemented-spec-pointer-list`
- Span `[75484,76314)`, length `830`, SHA-256 `3b4454aa392a128b3e074d570c7df0e50fe95927b01329936eabf0194b294039`, final byte `0x0a`
- Separator after body: **none — this is the last wrapper and the body's own final LF is the file's final byte**

```markdown
- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** <MIGRATION_DATE>
- **Original Kind:** R
- **Original Status:** ACTIVE
- **Origin:** `DECISIONS.md` Reference appendices at `MIGRATION_BASELINE`
```

### 8.5 Wrapper block shape and the separator convention — REPAIRED (rev 2, finding 4)

Each wrapper is written as: the `###` heading line, one blank line, the field list with every field on
exactly one physical line in the fixed archive order, one blank line, then the preserved body bytes
unaltered.

**Separator rule, pinned. Corrected counts.**

| separator | wrappers | count |
|---|---|---:|
| one LF | E032, E039b, E040, E041, E042, E048, E050, E051, E052, E075 | **10** |
| two LFs | E036, E043b | **2** |
| none | E076 | **1** |

Rev 1 said "one LF … eleven wrappers," which counted E076 among the LF-terminated bodies — true of its
final byte, false of its separator, since it is last and receives none. The corrected partition is
10 / 2 / 1. Eleven bodies end in `0x0a`; ten of them take a separator.

Separator bytes are written *outside* the body, are never part of the hashed historical body, and are
never counted in the pinned byte length. Either non-zero case leaves exactly one blank line before the
next `###` heading.

**Consequence for the target reconcile checker, restated per record.** The parser's `body` for a wrapper
is `text.slice(bodyStart, bodyEnd)` where `bodyEnd` is the next `### ` line start, so the parser's body
*includes* the separator bytes. Rev 1 said a raw comparison would fail all thirteen wrappers; it would
fail **twelve**. E076 carries no separator, so its parser body should already equal its source slice
exactly, and a checker that blanket-strips trailing LFs would silently accept a corrupted E076.

The checker must therefore assert, per record and not generically:

1. `parsed body length == pinned source length + pinned separator length`, where separator length is
   1, 2, or 0 exactly as pinned above;
2. the first `pinned source length` bytes hash to the pinned source SHA-256;
3. the remaining bytes equal exactly `\n`, `\n\n`, or empty, matching the pinned value for that record.

**Do not implement a generic trailing-whitespace strip.** That would let arbitrary whitespace
normalization pass as byte preservation, which is the failure this construction exists to make
detectable. This formulation is adopted from the rev-2 review and is better than rev 1's.

No historical body is rewrapped, spell-corrected, indentation-normalized, or Markdown-tidied. Codex slices
only by pinned offsets and verifies the pinned hash before use.

---

## 9. Boundary rationales

Commission §4.7 item 12 requires a boundary rationale wherever a logical entry is embedded in a shared
paragraph or section, and names E032, E036, E039b, E075, and E076 as a minimum. **Correction to the
resume note, accepted at rev-2 review:** on the verified spans, at least two further wrappers divide
shared source material — E043b, whose span ends mid-line with the remainder routed to E043a, and E048,
whose span covers the heading and original ruling of a §8 block whose amendment paragraph becomes live
`R2`. The resume note's "six required boundary rationales" is therefore under-inclusive. Rationales for
all thirteen are supplied below so that no reading of the requirement is left undischarged.

1. **E032** — embedded inside P27's §4 block. The span begins at the sentence opening the most-recent
   application and ends at that block's final newline, excluding P27's universal core, which stays live.
   The archived unit carries two historical components — the 2026-07-12 risk-tiered-verification
   application, and the alternatives that pass rejected and whose rejection continues to stand — and the
   label names both, as the deterministic review §7 requires.
2. **E036** — a section-level lapse note, not a numbered block. The span covers the disposition prose and
   stops mid-line: bytes `[51342,51986)` of the same line are the live tail that Part C routes into the
   E043a invariant and into the E037 merge contributions. The split is why the body lacks a final newline
   and why it takes the two-LF separator.
3. **E039b** — shares legacy line 309 with E039a. The span begins at `Extensions (condensed; full
   narrative archived):` and runs to the block's end; everything before it is P8's live core. The
   preceding slice's final byte is the U+0020 separator, so no byte is duplicated or dropped across the
   boundary.
4. **E040** — a whole numbered block, `[54292,54790)`. Boundary is a block boundary; the rationale is
   recorded only because P9's retirement makes the wrapper ID-addressed and register-bearing.
5. **E041** — a whole numbered block, `[54791,55582)`. Same disposition as E040 for P12.
6. **E042** — a whole numbered block, `[55583,56120)`. Same disposition as E040 for P18.
7. **E043b** — shares legacy lines 321–322 with E043a. The span ends mid-line at byte 56543; bytes
   `[56543,56891)` are the `opus*` deterministic-routing rule and the `claude_*` exclusion, which stay
   live as a §6 invariant. The archived remainder is the lapsed conditional prose only. Two-LF separator.
8. **E048** — embedded in a shared §8 block. The span covers the superseded heading and the *Original
   ruling* paragraph and stops before the *Amendment (2026-07-05)* paragraph, which is E049 and becomes
   live `R2`. Archiving the amendment with it would archive a live ruling.
9. **E050** — a self-contained §8 paragraph pair, `[64005,64356)`, with no shared boundary. Recorded for
   completeness.
10. **E051** — a self-contained §8 paragraph, `[64357,64837)`. Recorded for completeness.
11. **E052** — a self-contained §8 block including its named reasoning error and replacement control,
    `[64838,66593)`. The named reasoning error is retained inside the body precisely so the "banks are
    gated but markdown isn't" argument stays refuted in the archive.
12. **E075** — an appendix bullet inside the shared Reference appendices section, subordinate to P10. The
    span covers only that bullet. P10 stays live, so no identifier retires; `Original Kind: P` records
    that the material was principle-appendix content, and `Original Status: ACTIVE` records that it was
    true as written.
13. **E076** — the final appendix bullet, `[75484,76314)`, ending at end of file. It records concrete
    implemented-spec dispositions rather than a governing principle, which is why `Original Kind` is `R`;
    it never held an identifier, so the wrapper is name-addressed.

---

## 10. Manifest-level omission register

### 10.1 Per-block optional-field ledger

Commission §4.4 item 10 requires an explicit `OMIT` for every absent optional field; silence is not
sufficient. Optional fields are `Authorized`, `Not authorized`, `Evidence`, `Owner`, `Execution`. Where
the OMIT column reads `all five`, all five are absent and deliberately so.

| # | block | present optional fields | OMIT |
|---:|---|---|---|
| 1 | `P1#0` | Owner, Execution | Authorized, Not authorized, Evidence |
| 2 | `P2#0` | — | all five |
| 3 | `P2#1` | — | all five |
| 4 | `P3#0` | — | all five |
| 5 | `P4#0` | — | all five |
| 6 | `P5#0` | — | all five |
| 7 | `P5#1` | Not authorized | Authorized, Evidence, Owner, Execution |
| 8 | `P6#0` | — | all five |
| 9 | `P7#0` | — | all five |
| 10 | `P8#0` | — | all five |
| 11 | `P10#0` | Execution | Authorized, Not authorized, Evidence, Owner |
| 12 | `P11#0` | Execution | Authorized, Not authorized, Evidence, Owner |
| 13 | `P15#0` | Owner, Execution | Authorized, Not authorized, Evidence |
| 14 | `P15#1` | Owner, Execution | Authorized, Not authorized, Evidence |
| 15 | `P16#0` | Execution | Authorized, Not authorized, Evidence, Owner |
| 16 | `P16#1` | Owner, Execution | Authorized, Not authorized, Evidence |
| 17 | `P16#2` | — | all five |
| 18 | `P17#0` | Execution | Authorized, Not authorized, Evidence, Owner |
| 19 | `P19#0` | Execution | Authorized, Not authorized, Evidence, Owner |
| 20 | `P20#0` | Execution | Authorized, Not authorized, Evidence, Owner |
| 21 | `P21#0` | — | all five |
| 22 | `P21#1` | Execution | Authorized, Not authorized, Evidence, Owner |
| 23 | `P21#2` | — | all five |
| 24 | `P23#0` | Execution | Authorized, Not authorized, Evidence, Owner |
| 25 | `P23#1` | Owner, Execution | Authorized, Not authorized, Evidence |
| 26 | `P23#2` | — | all five |
| 27 | `P24#0` | Execution | Authorized, Not authorized, Evidence, Owner |
| 28 | `P25#0` | — | all five |
| 29 | `P25#1` | Execution | Authorized, Not authorized, Evidence, Owner |
| 30 | `P25#2` | Evidence, Execution | Authorized, Not authorized, Owner |
| 31 | `P25#3` | Execution | Authorized, Not authorized, Evidence, Owner |
| 32 | `P26#0` | Execution | Authorized, Not authorized, Evidence, Owner |
| 33 | `P27#0` | — | all five |
| 34 | `P28#0` | Execution | Authorized, Not authorized, Evidence, Owner |
| 35 | `P29#0` | Evidence, Execution | Authorized, Not authorized, Owner |
| 36 | `P30#0` | Evidence, Execution | Authorized, Not authorized, Owner |
| 37 | `P31#0` | — | all five |
| 38 | `R1#0` | Authorized, Execution | Not authorized, Evidence, Owner |
| 39 | `R2#0` | Execution | Authorized, Not authorized, Evidence, Owner |
| 40 | `R3#0` | Evidence, Owner, Execution | Authorized, Not authorized |
| 41 | `R4#0` | Evidence, Execution | Authorized, Not authorized, Owner |
| 42 | `R5#0` | Execution | Authorized, Not authorized, Evidence, Owner |
| 43 | `R6#0` | Authorized, Not authorized, Execution | Evidence, Owner |
| 44 | Producer assignments are operational state, not constitutional text | Evidence | Authorized, Not authorized, Owner, Execution |
| 45 | Deterministic review routing for promoted opus-prefixed case IDs | Owner, Execution | Authorized, Not authorized, Evidence |
| 46 | Runtime audio carries no client-embedded secret | Execution | Authorized, Not authorized, Evidence, Owner |
| 47 | Bilingual English and Simplified Chinese parity on all displayed text | Execution | Authorized, Not authorized, Evidence, Owner |
| 48 | Topic labels are English-only | Owner, Execution | Authorized, Not authorized, Evidence |
| 49 | JSON quote hygiene is a parse-time gate | Evidence, Execution | Authorized, Not authorized, Owner |
| 50 | Question IDs are globally unique across bundled banks | Owner, Execution | Authorized, Not authorized, Evidence |
| 51 | Raw-draft filename prefix routes to its canonical bank | Owner, Execution | Authorized, Not authorized, Evidence |
| 52 | Canonical merges are deterministic and gated | Owner, Execution | Authorized, Not authorized, Evidence |
| 53 | Runtime stays static, offline, and file-protocol compatible | — | all five |
| 54 | Schema versions are an ordered token, not semver | Execution | Authorized, Not authorized, Evidence, Owner |
| 55 | Schema changes are rare and deliberate | — | all five |
| 56 | Shared visual numeric helpers have a single definition | Owner, Execution | Authorized, Not authorized, Evidence |
| 57 | Case-study exhibit IDs share one namespace | Owner, Execution | Authorized, Not authorized, Evidence |
| 58 | Category targets are the current test-plan weights | Owner, Execution | Authorized, Not authorized, Evidence |
| 59 | Bank composition is a floor problem, not a balance problem | Owner, Execution | Authorized, Not authorized, Evidence |
| 60 | Repository-state hygiene is mechanism-specific | Owner | Authorized, Not authorized, Evidence, Execution |
| 61 | Some topics are deliberately shared across categories | Owner, Execution | Authorized, Not authorized, Evidence |
| 62 | Highlight's structural bias gate is schema-level | Owner, Execution | Authorized, Not authorized, Evidence |
| 63 | Translation-friction scoring | — | all five |
| 64 | Exam-condition test and adaptive modes | — | all five |
| 65 | Unresolved vital sanity bounds | — | all five |

Every present-field path was confirmed to exist on live disk this session, including the two
`Archive/root-cleanup-2026-07-19/` specs,
`audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json`,
`audit/lab-reference-range-verification-2026-07-19.md`, and `docs/AGENTS-RUNBOOK.md`. Trackedness under
assertion 15 remains **unverified by this seat** (§12.3). Row 44's `Evidence` is the only future-output
path in the set and is governed by Clause A of Amendment 1 once ratified; rev 1's claim that it "becomes
valid only inside the migration commit" is withdrawn as an inadequate discharge of commission §4.6, and
rev 2's proposal to omit the field instead is withdrawn as the wider of the two deviations. Note that
commission §4.9 independently obliges the Stage 2a reviewer to verify each present path as tracked, so
Clause A must reach §4.9 as well as §§2.2 and 4.6 or this row still fails review.

### 10.2 Candidate-and-reason register

The manifest's candidate/reason register is the union of Part A §4, Part B §5, and Part C §7, plus the two
rows below. The assembly pass must inline all four sets: the manifest is closed-world and may not point at
sibling draft files.

| block | field | candidate | disposition and reason |
|---|---|---|---|
| `R2#0` | Owner | `src/measurementUnitPolicy.ts` | `OMIT`. The path owns the analyte-aware conversion table and the display-policy layer, but not the statement's byte-exact extraction-preservation clause. Under the ratified complete-statement policy one governing limb outside the candidate path is sufficient to require omission — the same test that removed `P19#0`'s owner. Supersedes Part C §8 item 2, which kept it. |
| Producer assignments are operational state, not constitutional text | Owner | `PROJECT-HISTORY.md` | `OMIT`. It is the current operational-state record named inside the statement, not the singular executable owner of the whole invariant. The path is retained in the statement as prose, and the vacated field slot is used by `Evidence` under Clause A of Amendment 1 once ratified. |

---

## 11. E037 merge contributions, shown in all three targets

E037 mints no identifier, takes no block, and takes no wrapper. Commission §3.3 requires the literal
contribution to be visible in each target record.

Source rule 1: *Clinical truth and answer logic have an explicit upstream owner; every downstream
transformation (translation, schema compilation, formatting) may read but never silently invent or change
them.*

Source rule 2: *Every active generation lane declares producer provenance and independent-review routing
(principle 2).*

| target | rule | exact carrying clause in the target statement |
|---|---|---|
| `P8#0` | rule 1 | `Clinical truth and answer logic have an explicit upstream owner, and every downstream transformation may read them but never silently invent or alter them.` |
| `P2#0` | rule 2 | `Every active generation lane declares its producer provenance and its independent-review routing.` |
| `P5#0` | rule 2 | `every active lane declares its producer provenance and review routing` |

The lane-naming parentheticals are dropped deliberately: the statements must be lane-independent, and
`currently Opus` / `currently GPT` may not survive as permanent constitutional assignments.

---

## 12. Blocking prerequisites before the manifest can be ratified

Five, not two. Rev 1's chat receipt understated this; the review is right. Commission §2.2 makes any
unresolved placeholder a hard stop, so these are prerequisites rather than residuals.

### 12.1 One additional deterministic span hash — required

The E038 preservation slice needs the same treatment the thirteen wrapper spans already received.
Commission a one-item addendum to `DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md`,
produced by a shell-capable seat, reporting for span `[52641,53203)` of
`git show MIGRATION_BASELINE:DECISIONS.md`:

- byte length, asserted equal to `562`;
- SHA-256;
- final-byte-is-`0x0a` disposition, asserted `yes`;
- exact first and last 80 decoded characters, in the existing packet's format.

The architect seat may not author that hash, and the manifest may not carry a placeholder in its place.

### 12.2 Mechanical sentence-count re-verification — required

Every one of the 65 statements was counted by hand in Parts A–C, plus the rev-2 E038 repair.
`countStatementSentences` in `lib/decisions-format.ts` is the authoritative counter and admits one
construction hand-counting reliably misses: a sentence beginning with a lowercase or backticked-lowercase
token after terminal punctuation is not counted as a boundary. Run the real function and report:

- **the target population — exactly 65 results, one per target block.** This is the whole live population
  and no other statement enters it;
- **separately, and labelled as a control, the superseded Part C E038 wording**, reported alongside the
  revised §1.2 bytes so the repair's effect on the count is visible.

Rev 2 described this as "66 statements," which would introduce a second population into a document whose
live population is pinned at 65 — the rev-2 review is right to refuse that framing, and this project's own
history of a hand-entered `78` surviving three passes is why the pedantry is earned. The control is a
diagnostic, never a row.

This is the check most likely to turn a ratified manifest into a Stage 2b hard stop if skipped, and it
costs one script.

### 12.3 Trackedness verification — required

Assertion 15 checks `Evidence` and `Owner` against `git ls-files`. Existence on disk was confirmed this
session; trackedness was not and cannot be from this seat.

### 12.4 Commission Amendment 1 — required owner act

`DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md`. Clause A ratifies the E038 `Evidence`
sequencing exception (§8.3a). Clause B ratifies the narrow date-rebinding mechanism (§12.5). Neither may be
resolved by a seat.

### 12.5 Migration-date binding — required owner act, last

§8.1. `<MIGRATION_DATE>` must be bound to a real date, chosen after 12.1–12.4 are green and immediately
before assembly, and not defaulted. **Rev 2's closing receipt asked for the date and the exception
together, which contradicted this item's own sequencing; the rev-2 review is right and that request is
withdrawn.**

The binding must precede assembly because the commission forbids a placeholder in the manifest, and it
must precede Stage 2b because the manifest is ratified before implementation begins. That leaves an
irreducible schedule bet: too early a date and the content commit slips past its own filename; too late
and the filename does not equal the commit date that format specification §4.1 defines it as. Either way a
mismatch is a specification violation, so the lever is not optimism or pessimism about the date but the
cost of being wrong.

**Clause B of Amendment 1 makes being wrong cheap.** It authorizes the owner to re-render exactly the
surfaces in §8.1's table against a new date, as a bounded owner act, without re-reviewing statement or
wrapper content — with the derived occurrence report required to confirm every occurrence carries the new
date. That converts a slip from a manifest-wide re-ratification into a narrow one, which is what makes an
optimistic date safe to pick. Without Clause B a slip is expensive and the conservative date is correct;
with it, the owner may pick the realistic date and absorb a slip mechanically.

---

## 13. What Part D verified, and what it did not

**Verified this session against live disk and the live parser:**

- Every parse-safety claim in §§3, 4, 5, 7, and 8 was checked against `lib/decisions-format.ts` as it sits
  on disk. Four that matter and were confirmed rather than assumed: the archive is segmented on `^### `
  alone, so the preamble is the only wrapper-safe location for displaced prose; the parser's wrapper
  `body` includes migration-authored separator bytes; §8 heading blocks discard `parseFields` issues; and
  the archive-source count that `selectDefinitionIndex` fails closed on is built from archive-index
  pointer files only, so the E038 `Evidence` value cannot trip `TARGET_ARCHIVE_SOURCE_COUNT`.
- The authority topology in §3 against live `CLAUDE.md` and `AGENTS.md`, which is what exposed rev 1's
  stale read order.
- The status vocabulary in §4 against live `DECISIONS-TAXONOMY-2026-07-24.md` §§3, 4, 4a, 5, and 11, which
  is what exposed rev 1's three superseded status definitions.
- All thirteen wrapper spans, lengths, hashes, and newline dispositions copied identically from the hash
  packet; legacy `Origin` sections from `audit/decisions-cleanup-2026-07-24/inventory.md`.
- All 22 name-addressed titles distinct; all 13 archive labels distinct; all 13 anchors distinct; no
  name-addressed label in reserved `P<n> ` / `R<n> ` shape.
- Allocation union contiguous 1–31 for `P` and 1–6 for `R`.
- Every present `Evidence` and `Owner` path exists on live disk.

**Qualification required, and rev 1 overclaimed (finding 5).** Parse *safety* is verified against the
current parser; target *conformance* is not, and cannot be until Stage 2b. Nine wrappers here are
name-addressed with `Original Kind` `P` or `R` — E032, E039b, E075 with `P`, and E036, E048, E050, E051,
E052, E076 with `R` — and the parser on disk today rejects every one of them with
`INVALID_FIELD_VALUE`, at the single guard Amendment 4 §4.3 delegates to Stage 2b for removal. These nine
are valid under the **ratified post-guard grammar**, not under the parser as it currently stands. That is
by design and is not a Part D defect, but rev 1's blanket "verified against the parser as it sits on disk"
was wrong to leave unqualified. The fixture pre-failure that must be observed before the guard is removed
is commission §5.3 item 2.

**Not verified by this seat:**

- The thirteen source hashes were not recomputed from `git show`; the commission's independent Stage 2a
  reviewer still owes that.
- The E038 slice hash does not exist yet (§12.1).
- Sentence counts were not run through the real counter (§12.2).
- Trackedness (§12.3).
- Statement compression across all 65 blocks remains producer-unchecked by construction: this seat wrote
  it. That review is GPT's. Part D changes it in exactly one place — the E038 repair in §1.2 — which was
  accepted at rev-2 review.

---

## 14. Open items carried out of Part D rev 2

1. **Commission Amendment 1 is the only item blocking assembly on a judgment rather than a computation.**
   §8.3a and §12.5. This seat's rev-2 recommendation on Clause A is withdrawn; the exception is now the
   architect position, and Clause B is new in rev 3.
2. **`<MIGRATION_DATE>` is unbound** and must be bound after the deterministic prerequisites are green and
   immediately before assembly (§12.5). Do not default it.
3. **The date asymmetry in §8.1 is the highest-risk assembly step.** The table, not a prose count, is
   authoritative about which bytes move with the migration date. One row that does not move —
   `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` — is a ratified Amendment 4 literal that a well-meaning
   uniform re-date would silently break. Rev 2 wrote "eleven surfaces move and seven do not," an undefined
   hand count introduced two sections after rev 2 had condemned exactly that; the rev-2 review is right and
   the count is struck.
4. **`Original Kind: R` on E036, E048, E050, E051, E052, and E076.** Six wrappers assert that material
   which never held an `R` number was historically a concrete ruling. That is the truthful reading and it
   is what Amendment 4 exists to permit, but it is six architect judgments about historical metadata, and
   the reviewer should re-derive each rather than accept the pattern.
5. **`Original Kind: P` on E075.** An appendix pointer subordinate to P10 called principle-appendix
   content. Weakest of the thirteen metadata calls; flagged as such.
6. **The archive preamble is a new archive-file surface.** No prior archive carries non-wrapper content
   before its first wrapper. `Archive/DECISIONS-ARCHIVE-2026-07-14.md` has a header paragraph but no
   preserved-prose section. The target reconcile checker must be told the preamble exists and must account
   for its bytes, or it will report unaccounted archive content.
7. **Target §§1–2 are now substantially rev-3 text, not migrated legacy prose.** §3 and §4 replaced legacy
   wording that was stale or superseded on five counts across two revisions — read order, authority
   delegation, `CONDITIONAL`, `PARKED` twice, and `REVISIT` — and added the kind/status/execution
   independence rule. Every one of those was a defect in migrated constitutional prose that entry-level
   review would not have caught, which is the standing lesson: structural prose needs the same scrutiny as
   a statement, and it has now had two passes finding something each time.
8. **The resume note still describes rev-1 state** — it records the two Part C corrections as pending and
   carries the under-inclusive boundary-rationale count. Correct it in the same pass as the next
   substantive deliverable rather than as a standalone turn.
9. **Assembly is still owed.** Parts A–D are four drafts. The candidate
   `audit/decisions-migration-2026-07-29/target-text-manifest.md` must inline all four — including the
   per-block source-boundary rationales and source spans Parts A–C left to assembly — with no pointer to a
   sibling draft file surviving, no `<MIGRATION_DATE>` token surviving, and a derived-and-reported archive
   filename occurrence population per §8.1.
10. **Amendment 1 lifecycle prose is stale throughout this draft and must be corrected before assembly.**
    Amendment 1 was RATIFIED 2026-07-30, both clauses and both architect additions. This draft still says
    "pending Amendment 1 ratification" (revision row 3), "`Evidence` selected pending ratification" (§1.2
    heading), "once that clause is ratified" (§1.2 fields), "OWNER RATIFICATION REQUIRED" (§8.3a heading),
    "once ratified" (§8.1 row `D5`, §10.1, §10.2), and "required owner act" (§12.4). It also still frames §8.2's
    preamble clause as conditional and §12.5's date binding as gated on §12.4. None of this blocks the
    deterministic measurement pass — the ratified amendment and the work order supersede this draft's status
    prose — but the assembled manifest must carry no contradictory lifecycle state, so sweep every instance
    in the assembly pass rather than patching them one at a time now.
