# Stage 2a Part A — PROVISIONAL ARCHITECT DRAFT

> **NOT THE MANIFEST.** This is not `audit/decisions-migration-2026-07-29/target-text-manifest.md`, is
> not ratified, is not owner-approved wording, and must not be used to begin Stage 2b or to edit
> `DECISIONS.md`. Every statement byte below is a candidate awaiting GPT independent review and Luke's
> exact-byte ratification.

**Date:** 2026-07-29 · **Seat:** Architect · **Scope:** Part A only — P1 through P17 in ratified
numeric order, including P8/E039a in its ratified position between P7 and P10.

> **STALE IN THREE PLACES — the manifest governs.** Banner added 2026-07-30. The draft body below is
> unchanged from the state in which it was reviewed, and is preserved that way deliberately so a later
> reader can see exactly what each review saw. Three candidates below have since been superseded in
> `audit/decisions-migration-2026-07-29/target-text-manifest.md`, which is the sole authority for target
> bytes:
>
> 1. `P15#1` — the `Owner: scripts/patch-raw.ts` field line is **removed** in the manifest. That path
>    owns the field-path mutation mechanism carried by the first two sentences, but not the `P26`
>    preserved-surface proof carried by the third, so no single tracked path supports the complete
>    statement.
> 2. `P16#1` — the second statement sentence is **replaced** in the manifest, restoring the retained
>    advisory-only disposition of per-file distributional verdicts.
> 3. `P17#0` — the third statement sentence reads `rationale/dyad scoring` in the manifest, not
>    `rationale scoring`. The source names an NCSBN scoring family; shortening it narrows an
>    out-of-scope declaration and thereby widens what the entry permits.
>
> §4's omission register below also carries no rows for `P15#0` or `P15#1`. Both omissions are decided in
> the manifest records rather than here.

## Fixed inputs

- `MIGRATION_BASELINE`: `d499cc1d0916e03830489ec9cd0324cd1a203a73`
- Grammar: `DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md` §2, with fixtures `F1`–`F3`, `F10`
- Classification contract: `DECISIONS-TAXONOMY-2026-07-24.md`, Amendments 1–4
- Kind / status / force / execution: frozen, copied from the live source packet — not architect choices
- Dates: `DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-2026-07-29.md` with the three owner overrides
  (P2#0 and P5#0 accepted at `2026-07-18`; P8#0 corrected to `2026-07-24`; P7#0 corrected to
  `2026-06-09` per `DECISIONS-MIGRATION-STAGE-2A-P7-DATE-CORRECTION-2026-07-29.md`)
- Optional-field policy: owner ruling of 2026-07-29 — `Evidence` only where one tracked path supports
  the complete statement; `Owner` only where one tracked executable path is the singular live source of
  truth; otherwise omit and register

Part A population: 13 cores + 5 attachments = 18 blocks.

---

## 1. Candidate body text

### P1 — Answer placement is owned by code

A deterministic, item-ID-seeded shuffle applied at promotion owns option and answer placement; the
model never places or orders an answer. This governs positional bias across every item type, not only
multiple choice.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-09
- **Owner:** `lib/shuffle.ts`
- **Execution:** EXECUTED

### P2 — Independent review is scoped to judgment

Independent review is required wherever correctness depends on semantic judgment, clinical
interpretation, provenance, or contract interpretation; purely mechanical work may self-certify against
deterministic checks that have an independent null. Every active generation lane declares its producer
provenance and its independent-review routing.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-18

#### P2 — Application: spec conformance and content review stay split

When one seat authors a remediation spec and another implements it, the authoring seat cannot certify
the implementation and a seat blind to the spec cannot certify it either. Content review therefore goes
to the gate seat, which re-derives each disposition from source and standing rules, while
spec-conformance verification stays with the architect who wrote the spec.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-09

### P3 — Deterministic core, capped semantic residual

Counting, distributions, permutation integrity, and template repetition have known nulls and belong in
scripts that return identical verdicts every run. Model judgment is reserved for the irreducible
semantic residual, run only on items the deterministic layer flags and capped per batch. No API key or
live model call belongs in the repository; semantic findings enter through an offline validated handoff.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-12

### P4 — Rationales are position-agnostic and bilingual

A rationale references option content, never a letter or an ordinal or spatial position. A rationale
that names no position cannot carry a stale answer-key reference after a shuffle, in either English or
Simplified Chinese.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-09

### P5 — Generated is not reviewed

No model-generated learner-facing clinical content becomes canonical without independent content review
and the promotion pipeline. The generating lane never reviews its own batch and cannot certify its own
output for canonical promotion; every active lane declares its producer provenance and review routing.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-18

#### P5 — Narrowing: named-model restrictions are lane policy

Named-model restrictions are current lane policy, not the universal definition of generated-versus-
reviewed content. This attachment states the constitutional floor beneath them; the standing
named-model restrictions themselves are carried by P31.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** AUTHORIZING
- **Date:** 2026-06-26
- **Not authorized:** Treating named-model lane policy as the universal definition of generated versus reviewed content.

### P6 — Visuals are deterministic, curated imagery has a separate lane

Deterministic, data-derived visuals are the default for diagrammatic and numeric clinical cues;
AI-generated medical imagery is prohibited, and each renderer ships `selfCheck` cross-consistency
assertions and registry conformance tests. Curated licensed clinical imagery may enter only through a
separate provenance, licensing, accessibility, and clinical-review lane. Every question-level stimulus
remains load-bearing: a visual whose removal leaves the answer unchanged is decorative and invalid.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-14

### P7 — Precision over volume

In any audit or review, five fully-evidenced findings beat thirty probable ones. Verbatim evidence, an
honest reconciliation attempt, and explicit confidence and dismissal discipline are the standard.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** ADVISORY
- **Date:** 2026-06-09

### P8 — Clinical truth is authored upstream and read-only downstream

Clinical truth and answer logic have an explicit upstream owner, and every downstream transformation
may read them but never silently invent or alter them. A downstream stage translates and shapes content
into schema without deciding which action is correct and without introducing clinical claims absent
from the authored source. A decision point too underspecified to yield an unambiguous item is dropped,
not guessed.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-24

### P10 — Study sessions mirror the exam distribution

Default Study sampling follows NCLEX category weighting and guards against narrow-topic clustering,
while strict exam simulation is a separate product mode. Case studies are excluded from the weighted
draw, mirroring the exam's fixed, separately counted case-study allotment. Difficulty adaptivity is a
deliberately separate, deferred axis.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-14
- **Execution:** EXECUTED

### P11 — Visual arithmetic is a machine-checked gate carrying no engine

For every visual kind whose answer turns on a computed value, the load-bearing numbers are typed on the
visual spec and `selfCheck` recomputes the answer from spec and audit metadata, asserting exact
equality after any declared rounding. A mismatch is a build failure, not a content note. Each kind
exposes an enumerated set of one-line, same-unit derivations, and no unit-conversion or dosage engine is
authorized.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-12
- **Execution:** EXECUTED

### P15 — Bank patches are raw-scoped and declarative

Bank patches write only under the raw bank directory, and canonical files are read-only except through
an explicit in-place mode that forces a ledger entry. Patch operations are declarative and
precondition-checked, and no arbitrary-mutate primitive exists, because mechanical fixes belong in
patches and semantic fixes belong in review.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-10
- **Owner:** `scripts/patch-raw.ts`
- **Execution:** EXECUTED

#### P15 — Application: a declarative op names a field path, not a record

A declarative operation identifies the exact field path it mutates together with the before and after
values for that path. A record-scoped string replacement is not declarative even when it declares a
before and an after, because it rewrites every occurrence in the record, including fields the operation
never named. Under P26 a patch must independently prove every learner-facing and scoring field outside
its authorized mutation surface unchanged.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-22
- **Owner:** `scripts/patch-raw.ts`
- **Execution:** EXECUTED

### P16 — Answer-pattern bias is presentation-first

Positional tells carry no clinical meaning and are repaired mechanically by a deterministic, ID-seeded
permutation. Distributional tells are properties of item content, cannot be shuffled away, and clear
only through deliberate authoring or a targeted regeneration pass, never by hand-editing answer logic in
reviewed canonical items. Incidental dilution from ordinary new content is acceptable but is not
remediation.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-14
- **Execution:** EXECUTED

#### P16 — Amendment: a canonical file is not a learner-visible population

Distributional checks measure concentration in the population a learner actually draws from, so a
canonical bank file is an authoring-provenance boundary rather than a population. A global
distributional verdict stands on its own statistic and does not inherit a per-file failure, while
positional and mechanical checks continue to inherit. A distributional verdict below its
minimum-observation floor reports as insufficient rather than as a failure.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-15
- **Owner:** `scripts/audit/non-mcq-bias-lib.ts`
- **Execution:** EXECUTED

#### P16 — Standing authoring note on surviving distributional signal

The surviving `visual-canonical` SATA distributional signal is addressed by varying correct counts
where clinical truth naturally permits. This is not retire-and-replace: necessity-gated visual items
are not retired merely to move a histogram.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** ADVISORY
- **Date:** 2026-07-15

### P17 — Scoring is polytomous, retention is full-marks

Grading returns an earned-and-possible score per NGN family. Partial credit feeds the session score and
per-item feedback only, and spaced repetition resurfaces any item scored below full marks.
Threshold-based retention, graded ease from partial scores, rationale scoring, and ordered-response
partial credit are out of scope.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-14
- **Execution:** EXECUTED

---

## 2. Candidate entry-index rows (Part A fragment of target §3)

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

No declared-total line appears here. The declared total is a whole-document value authored in the
assembly pass, not a Part A value.

---

## 3. Block-key and order verification

| # | block key | source | attached to |
|---:|---|---|---|
| 1 | `P1#0` | E001 | — |
| 2 | `P2#0` | E002 + E037 rule 2 | — |
| 3 | `P2#1` | E003 | `P2#0` |
| 4 | `P3#0` | E004 | — |
| 5 | `P4#0` | E005 | — |
| 6 | `P5#0` | E006 + E037 rule 2 | — |
| 7 | `P5#1` | E007 | `P5#0` |
| 8 | `P6#0` | E008 | — |
| 9 | `P7#0` | E009 | — |
| 10 | `P8#0` | E039a + E037 rule 1 | — |
| 11 | `P10#0` | E010 | — |
| 12 | `P11#0` | E011 | — |
| 13 | `P15#0` | E012 | — |
| 14 | `P15#1` | E013 | `P15#0` |
| 15 | `P16#0` | E014 | — |
| 16 | `P16#1` | E015 | `P16#0` |
| 17 | `P16#2` | E016 | `P16#0` |
| 18 | `P17#0` | E017 | — |

Checks performed against the emitted body above:

- 13 cores, 5 attachments, 18 blocks; index rows 18; body/index order identical.
- Exactly one `###` core per permanent ID: P1, P2, P3, P4, P5, P6, P7, P8, P10, P11, P15, P16, P17.
- Every `####` identifier equals its nearest preceding `###` core identifier.
- Attachment ordinals ascend in document order within each ID: `P2#1`; `P5#1`; `P15#1`; `P16#1`,
  `P16#2`.
- Numeric ascending core order holds, with P8 between P7 and P10 as ratified.
- No derived identifier token appears. No `P9`, `P12`, `P13`, `P14` block exists in this range.
- Field order in every block is Kind, Status, Force, Date, then present optional fields in §2.4 order.
- Every live kind/status pair is `P` + `ACTIVE`, permitted by §2.4.
- Every statement is one paragraph of one to three sentences with no list, fence, or nested heading.
- No heading title contains an em dash or a backtick.
- Every present optional field carries a non-empty value.
- Three `Owner` paths confirmed present on live disk this session: `lib/shuffle.ts`,
  `scripts/patch-raw.ts`, `scripts/audit/non-mcq-bias-lib.ts`. Trackedness under assertion 15 is
  **unverified by this seat** and requires the shell-capable pass.

Contiguity (assertion 11) is a whole-document check and is deliberately not asserted here.

---

## 4. Part A omission register

Candidates considered and rejected, with reason. Every row is an optional field deliberately absent,
not overlooked.

| block | field | candidate(s) | reason for omission |
|---|---|---|---|
| `P1#0` | Evidence | none — forcing incident archived | The D-at-3% metric is archived evidence; the compression rule forbids restating it and no live tracked path carries it. |
| `P1#0` | Owner co-candidate | `scripts/promote.ts` | Application site, not the placement owner. `lib/shuffle.ts` is the singular source of truth for placement; naming both is illegal. |
| `P2#0` | Evidence, Owner | none | Rule spans governance practice across all seats; no single tracked path owns it. |
| `P2#1` | Evidence, Owner | archive | Narrowing rationale and forcing incident are archived; not a single tracked file. |
| `P3#0` | Evidence, Owner | `scripts/audit/audit-non-mcq-bias.ts`, `scripts/audit/non-mcq-bias-layer-b.ts` | The offline-handoff boundary is realised across queue emission, validation, and merge; no one path owns the whole statement. |
| `P4#0` | Evidence, Owner | none | Authoring rule with no single executable owner. |
| `P5#0` | Evidence, Owner | `BANK-REVIEW-LEDGER.md` | Ledger is an artifact of the pipeline, not the owner of the promotion rule; the statement covers review routing beyond it. |
| `P5#1` | Evidence | `E074` / P31 cross-reference | An entry identity, not a repository path. Carried as a P31 citation inside the statement instead. |
| `P6#0` | Evidence | `AGENTS.md` | Supports only the curated-image clause, not the determinism default, the AI-imagery prohibition, or the load-bearing rule. One clause is not the complete statement. **Flagged for review** — closest call in Part A. |
| `P6#0` | Owner | per-kind `selfCheck` | A family of implementations, not one path. No curated-image lane exists in code. |
| `P7#0` | Evidence, Owner | none | Advisory audit standard; no executable owner. |
| `P8#0` | Evidence, Owner | none | Cross-seat authoring contract; no single tracked path. E039b extensions are archive-only and supply no live owner. |
| `P10#0` | Evidence, Owner | `src/schema.ts`, `src/sessionSampler.ts` | Jointly necessary — weights in the first, draw and floor and diversity behavior in the second. Selecting one would misrepresent the statement. |
| `P11#0` | Owner | per-kind `selfCheck` | Symbol family across visual kinds, not one path. |
| `P16#0` | Owner | `scripts/audit/non-mcq-bias-lib.ts` | Deliberately carried on `P16#1`, where the live constants and check behavior actually reside. Core states the fork only. |
| `P16#2` | Evidence, Owner | `visual-canonical` bank data file | A bank data file is not an evidence or owner path for an advisory authoring note. The signal is named in the statement, bounded to the source, with no corpus count restated. |
| `P17#0` | Owner | `src/grading.ts` | Not resolved by the ratified path worksheet; statement also covers out-of-scope declarations no single path owns. Candidate recorded for review. |

---

## 5. Owner dispositions and remaining open items

**Corrections applied 2026-07-29 on owner ruling.**

1. `P6#0` statement restored the renderer requirement — each renderer ships `selfCheck`
   cross-consistency assertions and registry conformance tests. P11 does not absorb this, being limited
   to visual kinds whose answers turn on a computed value. `Evidence` stays omitted.
2. `P16#2` generalisation reverted. The statement is bounded to the dated source application naming the
   surviving `visual-canonical` SATA signal, with no corpus count restated.
3. `P5#1` `Not authorized` flattened to one physical line. **Standing rule for Parts B–D:** every
   `Authorized`, `Not authorized`, `Evidence`, `Owner`, and `Execution` field occupies exactly one
   physical line. Grammar basis — §2.1 requires every field line to match `- **<Field>:** <value>`, so a
   wrapped continuation line parses as an unknown field. Statement paragraphs may wrap; fields may not.

**Accepted as authored:** `P6#0` `Evidence` omitted; `P17#0` `Owner` omitted; the executable `Owner`
for P16 carried on `P16#1` rather than the core; sparse optional fields throughout.

**Remaining open items.**

1. **Statement compression is unreviewed.** Every statement above is architect-authored compression of
   a longer source body. Producer is this seat; no seat has checked it. That review is GPT's.
2. **Trackedness** of the three selected paths is unverified by this seat and belongs to the
   shell-capable pass, together with hash reproduction and date corroboration.
