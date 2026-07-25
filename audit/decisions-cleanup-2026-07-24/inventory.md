# DECISIONS.md Cleanup — Phase 1 (Pass 2) — Entry Inventory

**Commission:** `DECISIONS-CLEANUP-PHASE-1-SURVEY-CODEX-SPEC-2026-07-24.md` (Amendments 1–4)
**Contract:** `DECISIONS-TAXONOMY-2026-07-24.md` — **RATIFIED 2026-07-24 by Luke, including Amendments 1–2.**
**This is classify-and-propose. Nothing in `DECISIONS.md` is edited, moved, renumbered, retagged, or deleted.**

## What survives from pass 1, what does not (Amendment 1)

Preserved unchanged: the 76-entry inventory with its boundaries, byte lengths, and evidence-fraction
estimates; the E043/E047 splits; the E049 mis-file finding; the duplication findings; the fact that
the historical `R1..R17` inside `Archive/root-specs-2026-07-18/structured-measurements-schema-2-0-
codex-spec.md` is document-local (architect-verified, not re-derived here).

Discarded and rebuilt: every kind, status, and force assignment — the taxonomy they were rendered
against changed (kind/status/execution separated; `REVISIT` narrowed to `T` only), and two owner
rulings landed (principle 8 retained; no `P31` minted; R-series confirmed to start at `R1`).

**One new split not in pass 1:** E039 (principle 8) splits into a retained universal core (**E039a**)
and archived lane-specific detail (**E039b**) — the first application of the taxonomy's `CONDITIONAL`
carve-out (taxonomy §4), per the owner ruling in the spec's §8.

## Frozen input (spec §3, Amendment 4 ordering)

| Field | Value |
|---|---|
| `SURVEY_HEAD` | `f68210ceb62e42d7f028157629a770faf02eab42` — the commit carrying **only** the ratified taxonomy and the amended spec, captured *before* any graph was generated |
| `generatorGitSha` | `575f65fa532dabb4286b5279033fc54c5261ea15` — the generator commit (later than `SURVEY_HEAD` by design; dual provenance per spec §3) |
| Branch | `survey/decisions-cleanup-phase-1` (off `main` at `c413a50`) |
| Push target | this branch, draft PR — **nothing goes to `main`** |

## Legend

- **Kind** (taxonomy §3): `P` governing principle · `R` concrete ruling · `I` standing invariant ·
  `T` open thread (unsettled question only — Amendment 2) · `X` archived.
- **Status** (taxonomy §4): the five existing tags, now decoupled from kind.
- **Force** (taxonomy §5): `BINDING` · `AUTHORIZING` · `ADVISORY` · `HISTORICAL` — **force-as-written**,
  never force-as-placed (spec §8).
- **Exec** (taxonomy §4a): `EXECUTED` · `PENDING` · `INACTIVE` · `—` (omitted — decides nothing
  implementable).
- **Δ pass 1** — what changed and why. `unchanged` where nothing moved.

## Classification table

| id | § | line | heading (abbrev) | kind | status | force | exec | Δ pass 1 |
|---|---|---|---|---|---|---|---|---|
| E001 | 4 | 87 | P1 Answer placement owned by code | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E002 | 4 | 90 | P2 Independent review scoped to judgment (core) | P | ACTIVE | BINDING | — | unchanged (now also carries E037's second rule — see Detail) |
| E003 | 4 | 95 | P2 Kept: spec-conformance/content-review split | P | ACTIVE | BINDING | — | unchanged |
| E004 | 4 | 97 | P3 Deterministic core; LLM capped residual | P | ACTIVE | BINDING | — | unchanged |
| E005 | 4 | 100 | P4 Rationales position-agnostic, bilingual | P | ACTIVE | BINDING | — | unchanged |
| E006 | 4 | 103 | P5 Generated ≠ reviewed (core) | P | ACTIVE | BINDING | — | unchanged (now also carries E037's second rule — see Detail) |
| E007 | 4 | 106 | P5 Narrowing note (named-model restrictions) | P | ACTIVE | AUTHORIZING | — | unchanged |
| E008 | 4 | 108 | P6 Visuals deterministic; curated-image lane | P | ACTIVE | BINDING | — | unchanged |
| E009 | 4 | 113 | P7 Precision over volume | P | ACTIVE | ADVISORY | — | unchanged |
| E010 | 4 | 116 | P10 Study sessions mirror exam distribution | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E011 | 4 | 121 | P11 Visual arithmetic machine-checked gate | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E012 | 4 | 124 | P15 Bank patches raw-scoped, declarative (core) | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E013 | 4 | 127 | P15 Application: op names a field path (2026-07-22) | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E014 | 4 | 133 | P16 Answer-pattern bias presentation-first (core) | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E015 | 4 | 138 | P16 Amendment: canonical file not a population (2026-07-15) | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E016 | 4 | 145 | P16 Standing authoring note | P | ACTIVE | ADVISORY | — | unchanged |
| E017 | 4 | 147 | P17 Scoring polytomous; retention full-marks | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E018 | 4 | 150 | P19 Rationale visuals are explanation figures | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E019 | 4 | 159 | P21 Repo-reading prompts carry semantic floor (core) | P | ACTIVE | BINDING | — | unchanged |
| E020 | 4 | 162 | P21 App: construction language off learner surface | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E021 | 4 | 164 | P21 App: construction language functional not positional | P | ACTIVE | BINDING | — | unchanged |
| E022 | 4 | 170 | P23 Exam-like presentation is a renderer concern (core) | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E023 | 4 | 177 | P23 App: sparse shape-aware allocation | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E024 | 4 | 186 | P23 App: embedded leaf planning not retirement | P | ACTIVE | BINDING | — | unchanged |
| E025 | 4 | 192 | P24 Structured measurements values-only | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E026 | 4 | 199 | P25 Necessity is a property of the artifact (core) | P | ACTIVE | BINDING | — | unchanged |
| E027 | 4 | 204 | P25 App: composite trend artifacts | P | ACTIVE (vitals_trend clause superseded by E028) | BINDING | EXECUTED | unchanged |
| E028 | 4 | 206 | P25 Amendment: unified single-axis vitals_trend | P | ACTIVE | BINDING | EXECUTED | unchanged |
| **E029** | 4 | 208 | P25 Implementer note (reinstate flowsheet) | **R** | ACTIVE | **BINDING** | **PENDING** | **kind T→R, force ADVISORY→BINDING** — see Detail (a pass-1 misreading, corrected while determining execution state, not a taxonomy-driven force change) |
| E030 | 4 | 210 | P26 Disposition suppressing a check must be checked | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E031 | 4 | 215 | P27 Invariant softens only by naming its incident (core) | P | ACTIVE | BINDING | — | unchanged |
| E032 | 4 | 218 | P27 Most recent application (2026-07-12 pass) | X | ACTIVE | HISTORICAL | — | unchanged |
| E033 | 4 | 220 | P28 Scored leaves govern planning | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E034 | 4 | 227 | P29 Sparse lab cardinality not a validity floor | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E035 | 4 | 244 | P30 Lab reference bands adult-only; peds fail closed | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E036 | 5 | 300 | §5 Lapse note (2026-07-18) | X | CONDITIONAL→lapsed | HISTORICAL | — | unchanged (live clauses already carried by E037/E043a) |
| E037 | 5 | 302 | §5 Two universal rules stated once | P | ACTIVE | BINDING | — | **destination changed: no P31 — dissolves into E039a + E002/E006** (owner ruling) |
| E038 | 5 | 307 | §5 Current producer assignment callout | I | ACTIVE | ADVISORY | — | unchanged (still near-`UNCLEAR`) |
| **E039a** | 5 | 309 | **P8 universal core (NEW split)** | **P** | **ACTIVE** | **BINDING** | — | **new — principle 8 retained** (owner ruling) |
| **E039b** | 5 | 309 | P8 lane-specific detail (Opus skeleton shape, compiler topology, synthesis zones) | X | CONDITIONAL (LAPSED) | HISTORICAL | — | **new split — archives** |
| E040 | 5 | 312 | P9 CONDITIONAL skeleton English-only | X | CONDITIONAL (LAPSED) | HISTORICAL | — | unchanged — **not ruled on; open owner question** (see Detail) |
| E041 | 5 | 315 | P12 CONDITIONAL author-side currency | X | CONDITIONAL (LAPSED) | HISTORICAL | — | unchanged — **not ruled on; open owner question** |
| E042 | 5 | 318 | P18 CONDITIONAL fact-check/flag-review chain | X | CONDITIONAL (LAPSED) | HISTORICAL | — | unchanged — **not ruled on; open owner question** |
| E043b | 5 | 321 | P22 CONDITIONAL conditional-principle prose | X | CONDITIONAL (LAPSED) | HISTORICAL | — | unchanged — **not ruled on; open owner question** |
| E043a | 5 | 321(via §5 note l.300) | P22 `opus*` routing rule (still in force) | I | ACTIVE | BINDING | EXECUTED | unchanged — force-preservation hazard, see findings |
| **E044** | 6 | 326 | P20 Pronunciation/audio (PARKED) | **P** | PARKED | ADVISORY | **INACTIVE** | **kind T→P; number 20 RETAINED, not retired** — Amendment 1's own worked example |
| E045 | 6 | 331 | Translation-friction scoring (PARKED) | T | PARKED | ADVISORY | — | unchanged (unsettled question paused behind a resumption trigger) |
| E046 | 6 | 333 | test/adaptive exam-condition modes (PARKED) | T | PARKED | ADVISORY | — | unchanged |
| **E047a** | 7 | 339 | Vital-`sanity` SBP/RR/`spo2` ratifications | R | **ACTIVE** (not REVISIT) | BINDING | **PENDING** | **status REVISIT→ACTIVE (Amendment 2); force BINDING confirmed as-written, NOT a change** — see Detail |
| E047b | 7 | 339 | Vital-`sanity` DBP/MAP/temp-floor/`sao2` open sides | T | REVISIT | ADVISORY | — | unchanged (legitimately T — Amendment 2 confirms) |
| E047c | 7 | 339 | Vital-`sanity` found/temp-closed chronology | X | REVISIT | HISTORICAL | — | unchanged |
| E048 | 8 | 343 | CBC American-conventional (superseded original) | X | SUPERSEDED | HISTORICAL | — | unchanged |
| **E049** | 8 | 347 | CBC conventional-first + SI-paren, analyte-aware | R | **ACTIVE** (mis-filed SUPERSEDED) | BINDING | **EXECUTED** | **force confirmed as-written, NOT a change — mis-file, not ratification** (spec explicitly names this pass-1 error) |
| E050 | 8 | 349 | Fishbone workflow-familiarity waiver (superseded) | X | SUPERSEDED | HISTORICAL | — | unchanged |
| E051 | 8 | 351 | "Vitals sanity passes every real value" (withdrawn) | X | SUPERSEDED | HISTORICAL | — | unchanged |
| E052 | 8 | 353 | Governance-markdown encoding gate (withdrawn) | X | SUPERSEDED | HISTORICAL | — | unchanged |
| E053 | 8 | 359 | §8 closing archive pointer | X | ACTIVE | HISTORICAL | — | unchanged |
| E054 | app | 366 | INV Runtime audio: no client-embedded secret | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E055 | app | 367 | INV Bilingual EN / zh-CN parity | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E056 | app | 368 | INV `question.topic` English-only | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E057 | app | 369 | INV JSON quote hygiene parse-time gate | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E058 | app | 370 | INV Question IDs globally unique | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E059 | app | 371 | INV Raw-draft prefix routing | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E060 | app | 372 | INV Canonical merges deterministic | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E061 | app | 373 | INV Runtime static/offline/`file://` | I | ACTIVE | BINDING | — | unchanged |
| E062 | app | 374 | INV Schema versions ordered token, minor ≤ 9 | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E063 | app | 375 | INV Schema changes rare and deliberate | I | ACTIVE | ADVISORY | — | unchanged |
| E064 | app | 376 | INV Shared visual numeric helpers single def | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E065 | app | 377 | INV Case-study exhibit ids one namespace | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E066 | app | 378 | INV Category targets are test-plan weights | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E067 | app | 379 | INV Bank composition is a floor problem | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E068 | app | 380 | INV Repository-state hygiene mechanism-specific | I | ACTIVE | BINDING | — | unchanged |
| E069 | app | 381 | INV Some topics shared across categories | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E070 | app | 382 | Standalone bowtie may be generated directly | R | ACTIVE | AUTHORIZING | EXECUTED | R-number confirmed **R1** (was pending) |
| E071 | app | 383 | INV Highlight structural bias gate schema-level | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E072 | app | 384 | Promoted visual parity per-kind baseline | R | ACTIVE | BINDING | EXECUTED | R-number confirmed **R3** (was pending) |
| **E073** | app | 385 | PR vs post-merge CI coverage distinct | R | ACTIVE | AUTHORIZING | **PENDING** | R-number confirmed **R5**; exec state added — entry's own text: "for a later implementation commission" |
| E074 | app | 387 | Gemini's standing restrictions | P | ACTIVE | BINDING | — | unchanged (still principle-grade cross-lane rule; no number proposed, per taxonomy §7 default — see Detail) |
| E075 | app | 389 | Study-session distribution pointer | X | ACTIVE | HISTORICAL | — | unchanged |
| E076 | app | 391 | Session artifacts (implemented spec pointers) | X | ACTIVE | HISTORICAL | — | unchanged |

**78 rows** (76 pass-1 entries + the new E039a/E039b split, replacing the single E039).

## Detail — what actually changed and why

### 1. Principle 8 restored (E039 → E039a + E039b)

Owner ruling (spec §8, ratified 2026-07-24): principle 8's universal core — *"clinical truth and
answer logic have an explicit upstream owner, and downstream translation, compilation, formatting,
and review may read them but never silently invent or alter them"* — survives the 2026-07-18 lapse
of the forward case-generation lane. This is taxonomy §4's `CONDITIONAL` carve-out ("de-
conditionalized, keeps its number, returns to `ACTIVE`") in its first application. **E039a** (the
core, above) is `P`/`ACTIVE`/`BINDING`, `STAY`, keeps number **8**. **E039b** (Opus skeleton shape,
compiler topology, optional synthesis-zone mechanics — everything else in the original principle 8
body) is `X`/`HISTORICAL`, `ARCHIVE`.

### 2. No P31 (E037 dissolves)

Owner ruling: E037's first rule is a restatement of principle 8's core — it dedupes with E039a
rather than needing its own home. E037's second rule (*"every active generation lane declares
producer provenance and independent-review routing"*) is an application of principles 2 and 5 and
attaches to those bodies. **Neither mints a number.** E037 as a row therefore has no independent
destination — findings.md records this as a duplication resolved by the ruling, not a live
duplication needing a phase-2 decision.

### 3. Principle 20 retained, not retired (E044)

Pass 1 filed the PARKED audio principle as a thread and — because the taxonomy as first written
coupled kind to status — that filing would have retired principle number 20 under old §7. Amendment
1 exists specifically because this is wrong: taxonomy §7 now states explicitly, *"A number does not
retire for being asleep... An inactive principle is still a principle."* E044 is `P`/`PARKED`, force
`ADVISORY` (the entry's own text: *"is inactive and not currently binding"* — this is the one place
where the written force genuinely is non-binding, distinct from the mis-files below), execution
`INACTIVE` (*"a restart is a lane decision, not a re-derivation"* is a verbatim match for taxonomy
§4a's `INACTIVE` definition). **Number 20 stays live and stays a principle.**

### 4. The implementer note is a ruling, not a thread (E029)

Pass 1 filed this as `T`/`ADVISORY` reasoning that "not architect-gated" meant optional. Re-reading
against the taxonomy's kind test (*"a settled decision whose implementation is outstanding is not a
thread... it stays P, R, or I and carries EXECUTION: PENDING"*): what to build is **fully decided**
("reinstate the visible flowsheet **so shipped code matches this ratified model**. No further
architect input is required") — only the build is outstanding. "Not architect-gated" means no
further sign-off gates execution, not that the directive is optional. Reclassified `R`/`ACTIVE`/
`BINDING`/`EXECUTION: PENDING`. This is a correction to my own pass-1 reading, prompted by having to
assign an execution state to every settled-but-unbuilt row — not a case the taxonomy amendments
forced by themselves, but exactly the class of error Amendment 1 was written to catch.

### 5. E047a and E049 are mis-files, not force changes (correcting pass 1's own error)

The spec's own amendment record calls this out by name: *"pass 1 did this twice, for the CBC
unit-display amendment and for the stage-3 vital-sanity ratifications, both of which self-declare as
governing in their own text... Cleanup repairs placement; it never re-mints a ratification."*

- **E049** (line 347): sits under a `Status: SUPERSEDED` §8 heading but its own text states *"The
  governing rule is analyte-aware..."* in the present, active voice. Force-as-written is `BINDING`
  and always was; pass 1's "force change" was actually a placement-repair finding wearing the wrong
  label. `EXECUTION: EXECUTED` — `src/measurementUnitPolicy.ts` implements the analyte-keyed table.
- **E047a** (SBP `400`/RR `150`/`spo2` `0%`, line 339): sits inside a `§7 Revisit queue` bullet, but
  its own text states *"Stage 3 closed 2026-07-24 with three per-side ratifications."* Under
  Amendment 2, `REVISIT` is `T`-only — a settled ruling does not inherit `REVISIT` status merely by
  sitting inside a revisit-queue bullet. Reclassified `R`/`ACTIVE`/`BINDING` — force-as-written was
  always `BINDING`; only the **status** (`REVISIT`→`ACTIVE`) and **kind-location** actually move, and
  neither of those is the force axis. `EXECUTION: PENDING` — the entry's own words: *"A later
  implementation commission **may** add the ratified SBP and RR ceiling overrides"* — not yet in
  `src/measurementAllowlist.ts`.

### 6. Principles 9, 12, 18, 22 — not ruled on, routed to the owner

The spec is explicit: *"Do not extend ruling 1 to them by analogy — that the carve-out exists is not
evidence that it applies."* E040/E041/E042/E043b keep the taxonomy's `CONDITIONAL` default (lapse →
archive, no surviving core ratified) **as written**, unchanged from pass 1. This is not a decision
that they lack a core — it is the absence of a decision either way, carried forward as an explicit
open question in `findings.md` rather than resolved by analogy to principle 8.

### 7. R-series bootstrap confirmed, no longer pending

Architect ruling: the permanent series begins at `R1`; the historical `R1..R17` in
`Archive/root-specs-2026-07-18/structured-measurements-schema-2-0-codex-spec.md` is document-local
and reserves nothing globally (verified against that file, not inferred). Bootstrap order (effective
ratification date, ties broken by document order) is unchanged from pass 1's proposal and is now
final: **R1** E070 (2026-07-02) · **R2** E049 (2026-07-05) · **R3** E072 (2026-07-17) · **R4** E047a
(2026-07-24, line 339) · **R5** E073 (2026-07-24, line 385). The *(R-origin pending)* marks from pass
1 are dropped.

### 8. Forcing incidents, evidence pointers, contradiction flags

**Unchanged from pass 1** except as noted above (`E049`/`E047a` mis-file corrections; `E039`
restoration). The full forcing-incident table, evidence-pointer list, and the four contradiction
flags from the first pass remain accurate; they are not reproduced a second time here. The pass-1
deliverables themselves were never committed (spec §3 step 2 removes them from the tree before
`SURVEY_HEAD` is cut), so there is no git history to point to — the load-bearing subset that changes
meaning under the new taxonomy is restated in `findings.md`; everything else carries forward as
originally written and is unchanged.
