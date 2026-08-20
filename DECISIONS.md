## 1. Purpose and authority boundaries

This file is the project's architectural constitution, not a chronological notebook. It is authoritative
for why a rule exists and what status that rule currently holds. It is never authoritative for a current
field shape, enum, version token, validator behavior, renderer contract, measurement, count, or citation:
those are owned by executable source or by a linked evidence document. `Owner` names the one tracked
path that owns the whole live statement. `Evidence` names the one tracked source that carries the
evidence, measurements, provenance, or method the statement is forbidden to restate, and it may not
contradict or materially misrepresent any limb the statement keeps. Where no single path meets its own
test the field is omitted rather than approximated, and a claim here that disagrees with its owner is
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

## 3. Entry index

One row per entry block, in document order. Derived and never the authority: where index and body
disagree, the body governs. The ID column is an em dash for name-addressed entries, whose summary equals
the entry title byte-for-byte.

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

## 4. Governing principles

Cited by permanent identifier. A `####` block is attached to the `###` core carrying the same identifier
and holds its own status, force, date, and execution state. Current attached blocks are applications,
amendments, narrowings, or standing notes. Identifiers `P9`, `P12`, `P18`, and `P22` are retired and `P13`
and `P14` were never assigned; see §8.

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
deterministic checks that have an independent null and do not merely confirm the author's intent. Every
active generation lane declares its producer provenance and its independent-review routing.

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
live model call belongs in the repository; semantic findings enter through an offline validated
handoff that merges them without modifying Layer A.

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
output for canonical promotion; every active generation lane declares its producer provenance and its
independent-review routing.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-18

#### P5 — Narrowing: named-model restrictions are lane policy

Named-model restrictions are current lane policy, not the universal definition of
generated-versus-reviewed content. This attachment states the constitutional floor beneath them; the
standing named-model restrictions themselves are carried by P31.

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

In any audit, five fully-evidenced findings beat thirty probable ones. Verbatim evidence, an honest
reconciliation attempt, and explicit confidence and dismissal discipline are the standard.

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
distributional verdict stands on its own statistic and does not inherit a per-file failure; per-file
distributional verdicts remain authoring-hygiene advisories only, while positional and mechanical
checks continue to inherit. A distributional verdict below its
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
Threshold-based retention, graded ease from partial scores, rationale/dyad scoring, and
ordered-response partial credit are out of scope.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-14
- **Execution:** EXECUTED

### P19 — Rationale visuals are explanation figures, not stimuli

Rationale visuals are an answer-revealed teaching slot reusing existing deterministic visual kinds;
structural kind validation applies to them, but item-type placement and `selfCheck` answer-coupling do
not. The load-bearing-stimulus rules continue to apply in full to the question's own visual. Rationale
figures participate in the shared full-schema projection for schema-floor detection, export-envelope
inference, and renderer parity, but are excluded from the deliberately narrower census artifact
population by ratification; the two traversals must not be unified.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-16
- **Execution:** EXECUTED

### P20 — Pronunciation audio is pre-generated and local-first

The pre-generated audio architecture — local-first bilingual distribution, field-level content-hashed
clips, and asset-presence resolution — is settled but inactive and not currently binding. It remains
subject to I: `Runtime audio carries no client-embedded secret`, which binds regardless of this
principle's status. Resumption is a lane decision rather than a re-derivation, triggered when the
current workaround stops sufficing, integrated bilingual audio becomes wanted, or scale makes a
per-user workaround unfit.

- **Kind:** P
- **Status:** PARKED
- **Force:** ADVISORY
- **Date:** 2026-06-22
- **Execution:** INACTIVE

### P21 — Repo-reading generation prompts carry the semantic floor

When the generating model can read the repository, the prompt defers all per-format shape to the
operational and schema documents and restates none of it. It inlines only the semantic floor the schema
cannot infer: no-filler distractors; rationales for keyed answers and distractors; closed-world stems;
clinical scope and monitorability; no lazy provider-notification key; unique ordered-response sequences;
bounded highlight selection; gradeable closed-vocabulary blanks; bilingual parity; and failure of the
whole item when a keyed ID does not exist. Narrow per-format shape reminders return only after a
measured recurring failure.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-14

#### P21 — Application: construction language stays off the learner surface

Closed-world construction describes an authoring method, not wording to show a learner: the governing
order, protocol, threshold, or criteria must instead be stated naturally in the question. Author and
checker scaffolding is naturalized before promotion without removing the embedded rule or changing the
tested construct. A project-internal producer constraint is embodied through clinical facts, choices,
and rationale rather than appended to the stem as a disclaimer.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-21
- **Execution:** EXECUTED

#### P21 — Application: construction language is functional, not positional

Construction language is any learner-facing prose whose function is to explain, justify, or defend how
the item was built, and it is identified by function, never by phrase and never by position. Terminal
position is a review heuristic only, because producers tend to append constraints, defenses, and
apologies after an otherwise complete item. A clean terminal-sentence sweep is therefore not evidence
that a corpus is free of construct defense.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-22

### P23 — Exam-like presentation is a renderer concern

Split layout is presentation only: a case study stays one top-level session question with one
aggregate submit and one aggregate score, and grading, storage, spaced repetition, progress, flags,
adaptive, and summary all key on the top-level question id; per-part submit and true unfolding reveal
remain deferred because they require a storage-and-grading redesign, and are revisited only if
real-session observation shows aggregate submit is the fidelity bottleneck. Stage visibility always
includes global exhibits and all stages through the active part and is fail-open, so an absent or
unresolved stage reference shows all stages, never fewer. Split eligibility is determined by measured
visual geometry rather than nominal item type, and a kind joins the standalone split allowlist only
after a measured proof render.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-14
- **Execution:** EXECUTED

#### P23 — Application: sparse shape-aware allocation

A kind-level split allowlist may be refined by payload geometry after the same measured proof this
principle requires. The measured one-series `lab_trend` takes the full-width route while the two-series
shape remains split; structured measurements independently use a whole-payload density predicate, so
only a sole one-panel, one-row, one-column payload receives a compact figure while mixed-panel and
denser payloads remain full-width. These are presentation allocations, not new content-validity floors.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-19
- **Owner:** `src/examLayout.ts`
- **Execution:** EXECUTED

#### P23 — Application: an embedded leaf is a planning unit, not a retirement unit

An embedded case leaf is an individual content-planning unit but not an ordinary unit of removal,
because the case is authored, navigated, submitted, and graded as one keyed identity. Schema legality
is never the test: default to rewriting or replacing a leaf in place, and retire the whole case only
when no coherent replacement is feasible. No embedded-leaf retirement mechanism is authorized.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-22

### P24 — Structured measurements are values-only exhibit presentation

Structured measurements supplement source prose and never replace it, except for a pure key-value
exhibit reduced to a pointer. Clinical identity — which analyte and which population — resolves
before display and before unit conversion and is never inferred from magnitude alone, because the
same source unit converts differently per registry key. Source values and typed bounds are stored
with canonical and display forms derived at the rendering edge rather than redundantly persisted,
censored values remain typed rather than coerced into a bare number, and non-rendering migration
dispositions — serial skips, empty extracts, excluded values, and unit aliases — stay ledger and
staging only, never entering canonical banks.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-14
- **Execution:** EXECUTED

### P25 — Necessity is a property of the artifact

A redundant element is permissible inside a necessary, value-complete artifact — one that already
carries every exact value the item turns on — when it adds a meaningful reading affordance such as
pattern, direction, crossover, or divergence rather than ornament, and it never licenses information
absent elsewhere in the artifact, an artifact whose values the stem already states, or inclusion
justified only by vendor ubiquity. Two fences travel with the waiver: the artifact-level necessity
gate stays strict, so an item that any single-timepoint tally resolves belongs to the non-trend kind
rather than the waived one, and no exact-value item is authored on a waived-element kind, whose item
briefs stay pattern-only. Reversal is specific rather than a reopening of the waiver: where review
repeatedly catches an item answerable from one timepoint the collapse gate is being ignored, and
that kind closes to new content until the gate holds.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-03

#### P25 — Application: composite trend artifacts

A deterministic trend artifact may present the same typed source data through both charts and a
renderer-derived table when the views carry distinct reading affordances: charts expose direction,
divergence, crossover, and trajectory, while the table exposes exact values in a familiar flowsheet
form. The artifact-level necessity gate is unchanged, so removing the complete chart-plus-table
artifact must materially change answerability, the item must still turn on multi-timepoint or
cross-series reasoning rather than one isolated cell, and the table is never an independently
authored second source of truth. Sparse cardinality is not a validity floor for these artifacts
either, resting on `P7` and this principle's own anti-ornament fence rather than on `P29`, whose
scope stays `lab_trend` and `structured_labs_panel`.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-18
- **Execution:** EXECUTED

#### P25 — Amendment: unified single-axis vitals trend with retained flowsheet

The unit-pure multi-panel geometry is superseded as the default `vitals_trend` presentation by a
single unified chart carrying one time axis, one zero-based numeric axis, and no unit family, with
the renderer-derived flowsheet retained and visible beneath it and the superseded panel geometry
retained as the fallback arm. Per-vital resolution for low-magnitude vitals is recovered through
that retained flowsheet and the interactive per-timepoint readout rather than through separate
panels, and every fence this principle sets carries over unchanged. Reference bands are
single-series only under the unified model and a multi-series unified chart shows none, and no
schema, bank-content, or clinical-range change follows.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-19
- **Execution:** EXECUTED

#### P25 — Application: reinstate the visible flowsheet beneath the unified chart

The visible flowsheet beneath the unified chart is a re-add of the existing flowsheet renderer,
because the tested build shipped the hidden-table disposition instead. Shipped code is brought into
agreement with the ratified model. No further architect input is required.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-19
- **Execution:** EXECUTED

### P26 — A disposition that suppresses a check must itself be checked

A disposition that removes material from a checked surface must have an independently enforced
precondition, and a producer may not silence its checker merely by declaring that nothing requires
review. Every disposition that removes a value from the checked surface — an exclusion, a skip, an
empty extract, an off-allowlist drop — purchases its silence by moving that value out of the
checker's view, so each needs its own precondition enforced by something other than the disposition
itself. Exclusion count is a positive signal for checker-seat sampling, not a negative one.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-14
- **Execution:** EXECUTED

### P27 — An invariant softens only by naming its forcing incident

To relax an invariant, name the incident it was minted from and argue that the condition which
produced it no longer holds; that the rule now feels heavy is not that argument. Every rule in this
repository was minted by a failure, and the endgame is exactly when ceremony feels most expensive
and the memory of why is thinnest, so the ratchet needs a procedure rather than a mood. A rule that
no longer earns its keep is retired on the record with its incident cited and marked `SUPERSEDED`
rather than deleted.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-10

### P28 — Scored leaves govern planning, session units govern delivery

Content-planning reports measure what is scored: standalone top-level questions plus embedded
case-study questions, excluding case-study containers, with each embedded leaf contributing its own
category, topic, item type, and difficulty, and parent-case metadata never standing as evidence
about a leaf; generation prompt parameters draw only from this same scored-leaf population. Delivery and
inventory reports measure what can be served, on the top-level session-unit population, and their capacity warnings never change the content-planning denominator,
while visual inventory is a third, recursive artifact population rather than an alias for either
question denominator. A `case_study` is a delivery container and may not enter equal-average
scored-item-type targets unless a case-cadence target is separately ratified.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-16
- **Execution:** EXECUTED

### P29 — Sparse laboratory-presentation cardinality is not a validity floor

A one-series `lab_trend` and a one-row `structured_labs_panel` are valid when that is the clinically
appropriate amount of information. Series count and row count are not validity axes layered on top
of `P24` and `P25`, and no cardinality floor is adopted, because a universal second-series or
second-row floor would force clinically unnecessary filler. Any presentation change on this surface
requires its own measured proof-render commission under `P23`.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-18
- **Not authorized:** Any schema, bank-content, renderer, or runtime change on the laboratory-presentation surface.
- **Evidence:** `audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json`
- **Execution:** EXECUTED

### P30 — Lab reference bands are adult-only and pediatric bands fail closed

Laboratory reference bands are source-verified adult-only, and pediatric reference bands are
intentionally absent because published pediatric intervals split by age, sex, and assay in ways the
current two-bucket population vocabulary cannot express safely. A pediatric series fails closed
rather than displaying a band, while a pediatric trajectory item stays valid with the band
disabled. Therapeutic-anticoagulation values that compute high against a healthy-population band
are intended behaviour rather than a defect to repair, and this entry closes range verification
only.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-19
- **Not authorized:** The learner-visible high-low flag and the reference-range column.
- **Evidence:** `audit/lab-reference-range-verification-2026-07-19.md`
- **Execution:** EXECUTED

### P31 — Gemini's standing restrictions

Gemini is restricted to raw-volume generation and never makes direct canonical edits, which is
`P5`'s constitutional floor applied as named-model lane policy. It is demoted from every
content-judgment audit lane, because templated, non-pair-specific reconciliations required
independent re-research to trust where verbatim-evidenced lanes were self-verifying. If an
irreducible producer-clean residual ever forces a Gemini audit lane, any row whose reconciliation is
not pair-specific and does not quote the keyed English and Chinese rule routes to re-review rather
than being accepted as a dismissal.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-26

## 5. Concrete rulings

Cited by permanent identifier. A ruling settles specified items and generalizes no further. Rulings may
carry attached blocks under the same grammar as §4; none currently does.

### R1 — Standalone bowtie may be generated directly

A standalone bowtie may be generated directly rather than only harvested from a case skeleton, because
bowtie is standalone-only by construction regardless of origin. A direct generation lane runs through
the normal raw, cross-model review, promote, and ledger pipeline on equal footing with every other item
type, under the same semantic floor as the case-embedded synthesis zones. This relaxes neither
producer-versus-checker discipline nor the case-embedded compiler's obligations for bowties that do
arise inside a skeleton.

- **Kind:** R
- **Status:** ACTIVE
- **Force:** AUTHORIZING
- **Date:** 2026-07-02
- **Authorized:** Direct standalone-bowtie generation through the normal promotion pipeline.
- **Execution:** EXECUTED

### R2 — CBC units are conventional-first with SI in parentheses

Laboratory unit policy is analyte-aware: each analyte carries its own conventional forms, keyed by
analyte and source unit in one sourced conversion table, never by unit token alone. Accepted source
units stay permissive and extraction preserves the source unit byte-exactly, while display is a
separate policy layer offering a conventional primary with an optional SI parenthetical, consumed by
both the laboratory-trend and structured-measurement surfaces. One sourced conversion table serves the
sanity gate, parenthetical generation, and prose normalization.

- **Kind:** R
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-05
- **Execution:** EXECUTED

### R3 — Temperature sanity ceiling 46.5 °C

Vital `sanity` bounds are inherited renderer validation envelopes, not authored
physiologic-plausibility tripwires. For `temp` that inheritance is repaired: the flowsheet gate's
canonical-unit sanity ceiling is decoupled from the renderer's legacy registry range and independently
sourced and ratified at 46.5 °C. The ratified ceiling executes through a dedicated canonical-unit
override rather than through the inherited range.

- **Kind:** R
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-15
- **Evidence:** `Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md`
- **Owner:** `src/measurementAllowlist.ts`
- **Execution:** EXECUTED

### R4 — Promoted visual parity is a committed per-kind baseline

Promoted visual parity is a committed per-kind baseline pinning every promoted visual identity across
every full-schema visual location, and no permanent cross-file equality assertion between the parity
artifacts remains. An intentional renderer change rebaselines only through the rebaseline command with
a declared scope covering changed, added, and removed identities, a Git-derived per-delta cause, and a
committed receipt. Added or removed identities with no corresponding bank change fail as identity
drift, and the one-time bootstrap is permanently unavailable.

- **Kind:** R
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-17
- **Evidence:** `Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md`
- **Execution:** EXECUTED

### R5 — Vital sanity ratifications for SBP, RR, and SpO2

Three per-side vital `sanity` bounds are ratified: an SBP ceiling of 400 mmHg, an RR ceiling of 150 per
minute, and an `spo2` floor of 0%. The governed population is bedside and charted flowsheet values,
which is what selects 400 over the higher instrumented-measurement candidate. The three ratified sides
execute through per-side canonical-unit sanity overrides while renderer envelopes remain unchanged and
the required sanity minimum remains present.

- **Kind:** R
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-24
- **Execution:** EXECUTED

### R6 — Pull-request and post-merge CI coverage are distinct

Pull-request and post-merge coverage are distinct: a check running only after merge may protect the
deploy but does not prevent the bad merge, and existing post-merge coverage is not by itself a finding
of redundancy. A gate addition therefore requires measured evidence of incremental pre-merge value.
Any further pull-request gate expansion needs its own measured evidence and owner ratification.

- **Kind:** R
- **Status:** ACTIVE
- **Force:** AUTHORIZING
- **Date:** 2026-07-24
- **Authorized:** The build check, topic-population, topic-license as detector-regression coverage only, topic-vocabulary, and an exact-byte drift check for the topic-vocabulary document.
- **Not authorized:** A separate standalone type-check step, fatal live topic-license enforcement, a duplicate promoted-bank validator, and generalized regeneration or drift-checking of historical audit artifacts.
- **Execution:** PENDING

## 6. Standing invariants

Cited by exact title. An invariant carries no attached blocks — an application of an invariant is its own
entry.

### Producer assignments are operational state, not constitutional text

Current producer assignments are operational state and must be verified against `PROJECT-HISTORY.md`
rather than assumed timeless from this document. Changing the named producer does not alter permanent
identifiers, provenance classification, or independent-review obligations.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** ADVISORY
- **Date:** 2026-07-28
- **Evidence:** `Archive/DECISIONS-ARCHIVE-2026-08-18.md`

### Deterministic review routing for promoted opus-prefixed case IDs

An already-promoted case identifier carrying the `opus*` prefix routes as producer `gpt` at low tier,
identically to a `gpt_case_` item, which is effectively what it is. This does not extend to `claude_*`
items Claude authored directly, which remain Claude-produced and route to a non-Claude reviewer. The
rule survives the retirement of the forward skeleton lane because it routes already-promoted items
rather than new production.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-18
- **Execution:** EXECUTED

### Runtime audio carries no client-embedded secret

Runtime audio must not require a client-embedded secret or a live API call, and an absent pre-generated
asset must fail safely to the supported `speechSynthesis` fallback. This binds regardless of the parked
status of `P20`, because the bundler inlines `VITE_`-prefixed variables as plaintext into the published
bundle and any client-embedded key would therefore be world-readable on the deploy.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-22
- **Execution:** EXECUTED

### Bilingual English and Simplified Chinese parity on all displayed text

All displayed text carries bilingual English and Simplified Chinese parity.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-09
- **Execution:** EXECUTED

### Topic labels are English-only

A question's topic is English-only, a navigational label rather than study content. CJK characters in a
topic fail loudly at validation and are never silently stripped.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-10
- **Owner:** `src/schema.ts`
- **Execution:** EXECUTED

### JSON quote hygiene is a parse-time gate

JSON quote hygiene is enforced at parse time: structural tokens are ASCII double quotes only, and
Chinese quotation marks are valid only inside `zh` values. JSON shape is edited programmatically and
never retyped, because the dominant corruption source is editing rather than generation.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-13
- **Evidence:** `docs/AGENTS-RUNBOOK.md`
- **Execution:** EXECUTED

### Question IDs are globally unique across bundled banks

Question identifiers are globally unique across bundled banks, including embedded case-study leaf
questions. Uniqueness is gate-enforced rather than conventional.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-14
- **Owner:** `scripts/audit/audit-ids.ts`
- **Execution:** EXECUTED

### Raw-draft filename prefix routes to its canonical bank

A raw-draft filename prefix routes to its canonical bank through a fixed table that is the executable
source of truth, and no prose copy of that table is hand-maintained. The original per-kind canonicals
are complete frozen content sets rather than active generation targets; `visual-canonical.json` is the
only live visual generation target. A visual kind added after the original roadmap does not mint a new
per-kind canonical.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-09
- **Owner:** `lib/canonical-routing.ts`
- **Execution:** EXECUTED

### Canonical merges are deterministic and gated

Canonical merges are deterministic and gated through the consolidation script, and canonicals are never
hand-merged.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-19
- **Owner:** `scripts/consolidate.ts`
- **Execution:** EXECUTED

### Runtime stays static, offline, and file-protocol compatible

The runtime stays static, offline, and compatible with direct `file://` loading. Neither a server call
nor a live model call occurs after build.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-09

### Schema versions are an ordered token, not semver

Schema versions are an ordered token rather than semantic versions, and the minor component never
exceeds nine, so every version string sorts correctly under naive numeric, lexicographic, and index
comparison. The exported `schemaVersionAtLeast`, operating over a private index, is the single legal
comparison primitive. The supported version set is verified against the `SchemaVersion` union in code,
never against any prose restatement of it, including the schema document's own.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-09
- **Execution:** EXECUTED

### Schema changes are rare and deliberate

Schema changes are rare and deliberate.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** ADVISORY
- **Date:** 2026-06-09

### Shared visual numeric helpers have a single definition

The shared visual numeric helpers `fmt`, `fmtNum`, and `roundTo` have a single definition, and no visual
kind redefines them.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-12
- **Owner:** `src/visuals/primitives/graphPaper.ts`
- **Execution:** EXECUTED

### Case-study exhibit IDs share one namespace

Case-study exhibit identifiers share one namespace across the whole case, spanning the top-level
`caseStudy.exhibits` array and every stage. That array may be empty when the case's opening content is
meant to be entirely stage-gated.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-13
- **Owner:** `src/schema.ts`
- **Execution:** EXECUTED

### Category targets are the current test-plan weights

Category targets are the current test-plan weights project-wide rather than uniform, and they are held
in the single `NCLEX_CATEGORY_WEIGHTS` map that both the weighted study draw and the generation coverage
backlog read. Item-type balance stays uniform by design, because the test plan weights Client Needs
categories rather than item formats.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-12
- **Execution:** EXECUTED

### Bank composition is a floor problem, not a balance problem

Bank composition is a floor problem rather than a balance problem: no release gate enforces balance, and
the rule is that no format falls below the depth its sampling path requires, which is the
`floorThreshold` viability gate. Above that floor, topic fit and item quality override census
arithmetic, and no weak item is authored merely to close a census gap.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-10
- **Owner:** `src/sessionSampler.ts`
- **Execution:** EXECUTED

### Repository-state hygiene is mechanism-specific

Repository-state hygiene is mechanism-specific: a GitHub-reading agent sees only committed and pushed
inputs, while a disk-reading agent works from an explicit local branch or worktree snapshot and must
preserve unrelated changes. No agent may assume local and remote state are identical.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-23
- **Owner:** `AGENTS.md`

### Some topics are deliberately shared across categories

Some topics are deliberately shared across NCLEX categories rather than misclassified, and the shared
set with each topic's categories is held in the `SHARED_TOPIC_CATEGORY` map. An item's category is never
corrected to match a topic's single most obvious category, because the topic is intentionally
cross-category.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-18
- **Owner:** `src/topics.ts`
- **Execution:** EXECUTED

### Highlight's structural bias gate is schema-level

Every `highlight` item must include at least one selectable distractor segment, enforced at schema
validation rather than at audit, so an all-selectable item cannot enter a bank. Segment order is
clinically meaningful passage order and is never shuffled, so the non-MCQ positional audit has no
applicable position null for highlight and semantic cue quality stays content-review work.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-14
- **Execution:** EXECUTED

## 7. Open threads

Cited by exact title. Each entry carries an unsettled governing question; current or already-settled
behavior may appear only as context for that question. A ratified decision awaiting implementation does
not belong here — it stays in §§4–6 carrying `Execution: PENDING`.

### Translation-friction scoring

Whether reveal-tap friction folds into the targeted-review sampler is unresolved, and it stays open
until real dogfooding sessions show reveal concentration that is genuinely topic-specific or
category-specific and miss-predictive beyond the existing missed-topic signal. The instrument,
comprising telemetry, export, and the dev panel, already ships; only the scoring decision is parked.

- **Kind:** T
- **Status:** PARKED
- **Force:** ADVISORY
- **Date:** 2026-07-01

### Exam-condition test and adaptive modes

Whether the non-default `test` and `adaptive` half-exam placeholder modes are specified as real exam
simulators, with deferred feedback, no translate-all, and strict language mode, or are removed instead,
is unresolved. Both force `languageMode: "off"` at session creation and still reveal the answer, the
rationale, and the per-choice breakdown immediately after each submit. A deferred sub-question is
whether a strict exam environment should ever permit a post-submit full translation reveal.

- **Kind:** T
- **Status:** PARKED
- **Force:** ADVISORY
- **Date:** 2026-07-09

### Unresolved vital sanity bounds

DBP and MAP ceilings are authorized for a separate bounded sourcing pass, with no number selected here.
The `temp` floor remains inherited and unratified, and the laboratory `sao2` key stays provisionally at
a floor of 50%, a deliberate divergence because pulse-oximeter evidence does not govern it. All other
unratified sides remain provisional, and no bound is authored from model memory at any stage.

- **Kind:** T
- **Status:** REVISIT
- **Force:** ADVISORY
- **Date:** 2026-07-24

## 8. Archive and retired identifiers

This section carries pointers only: no entry bodies and no archive wrappers. Condensed forcing-incident
narrative, superseded rulings, and lapsed lane contracts are preserved rather than deleted, across three
files. `Archive/DECISIONS-ARCHIVE-2026-07-14.md` remains the record of the 2026-07-14
architectural-constitution pass and is not edited by this migration. `Archive/DECISIONS-ARCHIVE-2026-08-18.md`
is the normalized archive for this migration and is the sole file every archive-index line below points
at. `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` is a one-time byte-identical snapshot of this file at
`MIGRATION_BASELINE`, authorized once under taxonomy §9 Amendment 4; it is never current authority,
carries no wrapper, receives no index line, and is never parsed by the conformance checker.

Archive index — thirteen wrappers, one line each, in ascending source-byte order.

- **Most recent application of P27 and its rejected alternatives (2026-07-12 pass)** — condensed application and its standing rejection history, archived 2026-08-18.
  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#most-recent-application-of-p27-and-its-rejected-alternatives-2026-07-12-pass`
- **Forward case-generation lane lapse note (2026-07-18)** — section-level lapse disposition, archived 2026-08-18.
  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#forward-case-generation-lane-lapse-note-2026-07-18`
- **Lane-specific detail of P8 (forward case-generation pipeline)** — lapsed lane detail of a live principle, archived 2026-08-18.
  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#lane-specific-detail-of-p8-forward-case-generation-pipeline`
- **P9 The case skeleton is English-only** — lapsed conditional lane contract, retired 2026-07-28.
  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p9-the-case-skeleton-is-english-only`
- **P12 Author-side currency via closed-world construction and routed flags** — lapsed conditional lane contract, retired 2026-07-28.
  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p12-author-side-currency-via-closed-world-construction-and-routed-flags`
- **P18 Fact-check and flag-only review are chain steps** — lapsed conditional lane contract, retired 2026-07-28.
  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p18-fact-check-and-flag-only-review-are-chain-steps`
- **P22 Opus skeleton cases are GPT-provenance for review-conflict purposes** — lapsed conditional lane contract, retired 2026-07-28.
  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p22-opus-skeleton-cases-are-gpt-provenance-for-review-conflict-purposes`
- **CBC American-conventional unit ruling (superseded 2026-07-05)** — superseded original ruling, archived 2026-08-18.
  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#cbc-american-conventional-unit-ruling-superseded-2026-07-05`
- **Fishbone workflow-familiarity waiver (2026-07-06, superseded)** — superseded ad hoc waiver, archived 2026-08-18.
  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#fishbone-workflow-familiarity-waiver-2026-07-06-superseded`
- **Withdrawn claim that vital sanity bounds pass every real value** — withdrawn characterization, archived 2026-08-18.
  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#withdrawn-claim-that-vital-sanity-bounds-pass-every-real-value`
- **Withdrawn governance-markdown encoding gate (2026-07-09)** — withdrawn ruling with its named reasoning error, archived 2026-08-18.
  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#withdrawn-governance-markdown-encoding-gate-2026-07-09`
- **Study-session distribution pointer to code** — appendix pointer condensed out of a live principle, archived 2026-08-18.
  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#study-session-distribution-pointer-to-code`
- **Session artifacts implemented-spec pointer list** — appendix pointer list, archived 2026-08-18.
  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#session-artifacts-implemented-spec-pointer-list`

Retired and never-assigned identifiers are permanently unavailable. This register is append-only; an
entry never leaves it, and no live entry may carry a listed identifier.

| ID | disposition | date | pointer |
|---|---|---|---|
| P9 | RETIRED | 2026-07-28 | `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p9-the-case-skeleton-is-english-only` |
| P12 | RETIRED | 2026-07-28 | `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p12-author-side-currency-via-closed-world-construction-and-routed-flags` |
| P13 | NEVER ASSIGNED | — | — |
| P14 | NEVER ASSIGNED | — | — |
| P18 | RETIRED | 2026-07-28 | `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p18-fact-check-and-flag-only-review-are-chain-steps` |
| P22 | RETIRED | 2026-07-28 | `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p22-opus-skeleton-cases-are-gpt-provenance-for-review-conflict-purposes` |
