# DECISIONS.md

The reasoning-and-state layer for Project Shrimp. `AGENTS.md` says *how* to work; `PROJECT-HISTORY.md` records *what happened*; this file holds *why the architecture is the way it is* and *what is still open* — the things that are expensive to lose because a fresh agent (or future Luke) will otherwise re-litigate them from scratch.

## 1. Purpose and authority boundaries

This file is the project's architectural constitution, not a chronological notebook. It is authoritative for *why* a rule exists and *what status it currently holds*. It is never authoritative for a current field shape, enum, version token, validator behavior, or renderer contract — those are owned by the executable source named in each entry, and a claim here that disagrees with that source is stale, not binding. When a principle's full forcing-incident narrative, exact historical metrics, or superseded chronology has been condensed out of the active entry below, it is preserved verbatim in [`Archive/DECISIONS-ARCHIVE-2026-07-14.md`](Archive/DECISIONS-ARCHIVE-2026-07-14.md) rather than deleted.

Read order and authority relative to sibling docs is set by `CLAUDE.md`: `AGENTS.md` (operational constitution) → `DECISIONS.md` (this file) → `PROJECT-HISTORY.md` (current status; overrides this file's older prose on live implementation facts) → `NCLEX-Question-Schema.md` (schema source of truth).

## 2. Status vocabulary

Every numbered principle below carries exactly one of these five statuses, stated immediately after its heading. There is no untagged default.

- **ACTIVE** — universally binding under current project architecture, regardless of which content lane or feature is in use.
- **CONDITIONAL** — binding only while the named lane, feature, or workflow it governs is active. If that lane is retired, the rule lapses with it rather than needing a separate repeal.
- **PARKED** — settled architecture that is currently inactive and carries a named resumption trigger. Not abandoned; do not re-derive it from scratch on revival, and do not treat it as currently binding either.
- **REVISIT** — unresolved; further evidence, a source-check, a bank-impact survey, or an explicit ratification is pending. Do not treat the described behavior as settled.
- **SUPERSEDED** — replaced by a later, cited ruling. Retained verbatim for history; do not follow its claims.

## 3. Decision index (2026-07-18)

Navigation aid only — restates no ruling and settles nothing new. Read the target entry for the actual reasoning. Every numbered principle (1–30, excluding the intentionally unused 13–14) appears in exactly one bucket below, matching its heading's tag.

### ACTIVE (22)

| # | One-line rule |
|---|---|
| 1 | Answer/option placement is owned by deterministic code, never the model. |
| 2 | Independent review is required for judgment-dependent work; purely mechanical work may self-certify against a deterministic null. |
| 3 | Deterministic core; LLM judgment only for the capped, irreducible semantic residual. |
| 4 | Rationales are position-agnostic, in both languages. |
| 5 | No model-generated learner-facing content becomes canonical without independent review and the promotion pipeline. |
| 6 | Visuals are deterministic and data-derived by default; curated licensed imagery has its own separate lane; AI-generated medical imagery is prohibited. |
| 7 | Precision over volume in any audit or review. |
| 10 | Study sampling mirrors the exam's content distribution; strict exam simulation is a separate mode. |
| 11 | Visual arithmetic is a machine-checked gate, not a trusted assertion; no general conversion engine. |
| 15 | Bank patches are raw-scoped and declarative. |
| 16 | Positional answer-pattern bias is repaired mechanically; distributional bias only through deliberate authoring/regeneration. |
| 17 | Scoring is exam-style polytomous; SRS retention requires full marks. |
| 19 | Rationale visuals are explanation figures, not answer-coupled stimuli. |
| 21 | Repo-reading generation prompts carry the semantic floor, not the schema shape. |
| 23 | Exam-like split presentation is a renderer concern; case identity and grading are not. |
| 24 | Structured measurements are values-only exhibit presentation; identity and display resolve at the rendering edge. |
| 25 | Necessity is a property of the artifact, not of every element inside it. |
| 26 | A disposition that removes material from a checked surface needs its own independently enforced precondition. |
| 27 | An invariant softens only by naming its forcing incident and showing the condition is gone. |
| 28 | Scored leaves govern content planning; session units govern delivery capacity and inventory. |
| 29 | Sparse laboratory-presentation cardinality is not a validity floor. |
| 30 | Lab reference bands are source-verified adult-only; pediatric bands fail closed; the learner-visible H/L-flag feature remains unauthorized. |

### CONDITIONAL — forward case-generation lane (5) — LAPSED 2026-07-18

Bound only while the Opus-skeleton → GPT compile/fact-check → Gemini flag-review → Claude gate pipeline was the active forward-case lane. Luke retired that lane on 2026-07-18 in favor of wholesale case_study production in the current GPT model; per §2's CONDITIONAL definition these five principles lapse with it and need no separate repeal. Retained below for historical reference — see §5 for the lapse note and current state.

Case studies may now be commissioned directly and episodically through the current GPT producer contract when a topic or load-bearing visual warrants case form. This is a viable high-quality raw-case pathway subject to bounded checker repair and the normal independent promotion gate; no standing multi-model or bulk forward-case pipeline replaces the retired lane.

| # | One-line rule |
|---|---|
| 8 | Clinical truth is authored once, upstream, and read-only downstream. |
| 9 | The case skeleton is English-only; bilingual generation concentrates in the compiler. |
| 12 | Author-side currency via closed-world construction + routed flags, never a changelog. |
| 18 | Fact-check/currency and flag-only review are chain steps, not optional asides. |
| 22 | Opus skeleton cases are GPT-provenance for review-conflict purposes. |

### PARKED (1)

| # | One-line rule | Trigger |
|---|---|---|
| 20 | Pronunciation/audio is pre-generated, local-first, resolved by asset presence. | Workaround stops sufficing, integrated bilingual audio becomes wanted, or Flushing scale (see §6). |

Also parked (open threads, not numbered principles — see §6): translation-friction scoring; `test`/`adaptive` exam-condition modes.

### REVISIT (open threads, not numbered principles — see §7)

- Vital-sign `sanity` bounds are copied renderer validation envelopes, not authored plausibility bounds; the `temp` ceiling is sourced and ratified (2026-07-15, see §7). The all-seven-vital deterministic inventory (P3) is complete and merged, and its stage-2 adjudication is ratified; the remaining open sides stay under REVISIT pending stage-3 clinical sourcing and per-side ratification for the three sides that advanced (SBP ceiling, RR ceiling, SpO₂ floor).

### SUPERSEDED (§8)

- CBC lab units are American-conventional-only (2026-07-04) — reversed by the 2026-07-05 amendment (conventional-first + SI-in-parentheses, analyte-aware).
- The ad hoc fishbone "workflow-familiarity" waiver (2026-07-06) — superseded by principle 25's artifact-level necessity rule.
- "Vitals `sanity` passes every real transcribed value" — withdrawn as unprovable of a copied renderer envelope (folded into the principle 27/REVISIT vitals-sanity thread).
- Governance markdown needs an encoding gate (2026-07-09) — withdrawn 2026-07-16: every alarm to date has been a connector-read artifact, not disk corruption.

## 4. Active constitutional principles

**1. Answer placement is owned by code, not the model. Status: ACTIVE.**
A deterministic, item-ID-seeded shuffle applied at the promotion step owns option/answer placement; the model never places or orders an answer. Forcing incident (the regression case any future positional-integrity tooling should still detect): an audit found the correct MCQ option landed in position D only ~3% of the time against a uniform 25% — LLMs are biased samplers that write the correct answer first and confabulate distractors around it, clustering correct answers into early positions. The same clustering affects select-all correct-option ordering, so this governs positional bias across every item type, not just MCQ. Owner: `lib/shuffle.ts` (FNV-1a seed + Fisher-Yates), applied by `scripts/promote.ts`.

**2. Independent review is scoped to judgment, mechanical work may self-certify. Status: ACTIVE (narrowed 2026-07-14).**
Independent review is required when correctness depends on semantic judgment, clinical interpretation, provenance, or contract interpretation. Purely mechanical work may be certified by deterministic checks and targeted smoke tests in the same implementation session, when those checks have an independent null and do not merely confirm the author's intent.

Strict independent review stays required for: clinical judgments and answer keys; canonical generated content; migrations and dispositions; schema/data-contract interpretations; source-dependent claims. Not required for: exact file moves; generated censuses; deterministic formatting; one-line render ordering; and similarly mechanical, fully testable changes.

Kept — the spec-conformance/content-review split (2026-07-09 extension): when Claude authors a remediation spec and Codex implements it, Claude cannot certify the implementation (matching the spec is not evidence of being correct), but a seat blind to the spec cannot certify it either (it has no null to fail against). The two checks stay split — content review goes to the gate seat, which re-derives each disposition from source and standing rules; spec-conformance verification stays with the architect who wrote the spec. Forcing incident (kept, compact): a `>150 seconds` aPTT in a staged candidate passed schema validation, the flowsheet gate, the applicator dry-run, and a 100% checker-seat content adjudication, because the defect lived in `parseMeasurementValue`'s comparator-strip *code* — the artifact-checking seat had no reason to read code. Full narrowing rationale and the original absolute wording: archive.

**3. Deterministic core; LLM only for the capped semantic residual. Status: ACTIVE.**
Counting, distributions, permutation integrity, and template repetition all have known nulls and belong in scripts that return identical verdicts every run. Reserve model judgment for what genuinely needs semantics (clinical inferability, distractor plausibility), run it only on items the deterministic layer flags, and cap the batch — this keeps verdicts reproducible and token spend bounded. Applied: the non-MCQ bias audit is an offline handoff, not a live integration — the repo emits a deterministic queue/prompt, validates returned JSONL, and merges semantic findings without letting them modify Layer A; no API key or live model call belongs in the repository. A completed one-time proposal-only in-harness adjudication exception and the topic-licensing rulings it produced are archived.

**4. Rationales are position-agnostic — bilingual. Status: ACTIVE.**
A rationale references option *content* ("furosemide is contraindicated because…"), never a letter or ordinal/spatial position ("Option D", "the first choice"). A rationale that never names a position cannot carry a stale answer-key reference after a shuffle, in either English or Simplified Chinese (选项A, 第一个, 以上 …).

**5. Generated ≠ reviewed. Status: ACTIVE (narrowed 2026-07-14).**
No model-generated learner-facing clinical content becomes canonical without independent content review and the promotion pipeline. Raw model output stages in `banks/banks-raw/`, passes validation + audit + source-check, then promotes to a canonical `banks/*.json` with a `BANK-REVIEW-LEDGER.md` entry; the generating model never reviews its own batch.

Narrowing note: named-model restrictions (Gemini is raw-volume only, small batches, never direct canonical edits, and is demoted from any audit/judgment role — see §8) are current lane policy, not the universal definition of generated-vs-reviewed. They remain active as lane policy; this principle states the constitutional floor beneath them.

**6. Visuals are deterministic and data-derived; curated licensed imagery has a separate lane. Status: ACTIVE (narrowed 2026-07-14 — resolves a direct conflict with `AGENTS.md`).**
Deterministic, data-derived visuals are the default for diagrammatic and numeric clinical cues. AI-generated medical imagery is prohibited. Curated licensed clinical imagery may enter only through a separate provenance, licensing, accessibility, and clinical-review lane. Every question-level stimulus remains load-bearing: a visual whose removal leaves the answer unchanged is decorative and therefore invalid. Each renderer ships `selfCheck` cross-consistency assertions and registry conformance tests.

The prior wording ("no raster assets, no external images... ever") directly conflicted with `AGENTS.md`'s existing "a visual must be deterministic data-derived **or a curated licensed image**" allowance. No curated-image lane exists in code today — the `QuestionVisual` kind union is entirely deterministic renderers — so this principle states the permitted policy, not a claim that the lane is implemented.

**7. Precision over volume. Status: ACTIVE.**
In any audit, five fully-evidenced findings beat thirty probable ones. Verbatim evidence, an honest reconciliation attempt, and explicit confidence/dismiss discipline are the standard.

**10. Study sessions mirror the exam's content distribution; difficulty is exam-sim-only. Status: ACTIVE (narrowed 2026-07-14).**
Default Study sampling follows NCLEX category weighting and guards against narrow-topic clustering. Strict exam simulation is a separate product mode. Case studies are excluded from the weighted draw, mirroring the real exam's fixed, separately-counted case-study allotment. Difficulty adaptivity is deliberately a separate, deferred axis — see the parked `test`/`adaptive` modes in §6.

Moved to code — verify there, not here: the category weight table is `NCLEX_CATEGORY_WEIGHTS` in `src/schema.ts`; the exact session count, floor threshold, priority visual allowlist, and diversity-penalty constants are `src/sessionSampler.ts`'s `DEFAULT_FLOOR_KIND_PRIORITY` / `floorThreshold` / `alpha` / `beta`. Full prior narrative (weight table restated in prose, sampler-rule paragraph, calibration history) archived — restating it here would be exactly the duplicated-definition risk principle 27(d) warns about.

**11. Visual arithmetic is a machine-checked gate, not a trusted assertion — and it carries no engine. Status: ACTIVE.**
For every visual kind whose answer turns on a computed value (`io_record` totals/balance, `medication_label` dose/volume/rate, `device_screen` pump math, `burn_map` %TBSA/Parkland), the load-bearing numbers are typed on the visual spec, the question's inputs and keyed answer live in audit-only `meta`, and `selfCheck` recomputes the answer from spec + meta and asserts exact equality (after a declared rounding wherever division is involved). A mismatch is a *build failure*, not a content note. The recompute is deliberately small — each kind exposes an *enumerated* set of one-line, same-unit derivations. We do not parse free-text doses or build a unit-conversion/dosage engine; a derivation needing cross-unit conversion (mg↔mcg, mg/kg, mcg/kg/min, body-weight dosing) is out of scope for that kind, not a reason to grow the engine. This is principle 3 (deterministic core) and principle 6 (visuals necessary) made concrete for the chart/label/screen tier; human review still owns clinical validity.

**15. Bank patches are raw-scoped and declarative. Status: ACTIVE.**
`scripts/patch-raw.ts` writes only under `banks/banks-raw/`. Canonical files are read-only except via the explicit `--allow-canonical --reason` in-place mode, which forces a ledger entry. Patch ops are declarative (`before`→`after`, precondition-checked) — there is deliberately no arbitrary-mutate primitive, because mechanical fixes belong in patches and semantic fixes belong in review.

**Application — a declarative op names a field path, not a record (2026-07-22).** "Declarative" means the op identifies the exact field path it mutates together with the `before`→`after` values *for that path*. A record-scoped string replacement is not a declarative op even when it declares a before and an after: it rewrites every occurrence in the record, including fields the op never named.

*Forcing evidence.* Across the terminal-sentence remediation manifest, seven `dropdown_cloze` items carry the flagged stem text a second time inside `clozeStem` — the functional response surface. On one of them the collision is language-asymmetric: the English anchor is unique in the record because `clozeStem.en` differs by a single article, while the Chinese anchor collides because `clozeStem.zh` is identical to the stem terminal. No uniform record-level rule is safe, and a serialize-and-replace implementation would have destroyed the response surface on those rows while reporting success.

Under principle 26 the preserved-surface proof is the independently enforced precondition: a patch must independently prove every learner-facing and scoring field outside its authorized mutation surface unchanged, enforced by something other than the op's own declaration. For the terminal-sentence dropdown repairs that preserved surface was `clozeStem`, dropdown bindings, options, and keys; the surface is named per work unit, since a different authorized repair may legitimately mutate a stem together with a related field, and most item types do not carry those particular surfaces at all. Moved to code — verify there, not here: the field-path mechanism is the `path` segment array in `scripts/patch-raw.ts`, including its `{ id }` / `{ refId }` selectors, which are the only means of addressing an embedded record since op identity resolves against top-level questions alone.

**16. Answer-pattern bias is presentation-layer first, content-layer only where shuffling can't reach. Status: ACTIVE (narrowed 2026-07-14 — corrects a prior self-contradiction; amended 2026-07-15 — see the population amendment below).**
*Positional* tells (option order, dropdown index, matrix column, ordered-response scramble depth) carry no clinical meaning and are repaired mechanically by a deterministic, ID-seeded permutation. *Distributional* tells (SATA correct-count concentration, ordered-response template repetition) are properties of the item content itself and cannot be shuffled away — they are repaired only through future authoring or a deliberate targeted replacement/regeneration pass, never by hand-editing answer logic in reviewed canonical items. Incidental dilution from ordinary new content is acceptable but is **not** considered remediation: genuine distributional debt is frozen, not self-healing, and clears only through a deliberate targeted regeneration decision. (This sentence formerly cited "the standing global distributional FAILs" as that debt. They were not — see the 2026-07-15 amendment below.)

The audit's `fix_class` encodes exactly this fork: `SHUFFLE_AT_PROMOTION` is mechanical and automatable; `REGENERATE` is a non-blocking content-design backlog item. Live constants are named once, in the amendment below; verify them against `scripts/audit/non-mcq-bias-lib.ts`, never against this file.

**Amendment to 16 (2026-07-15) — a canonical file is not a learner-visible population.**
Distributional checks measure concentration in the population the learner actually draws from: the bundled bank. A canonical `banks/*.json` is an authoring-provenance boundary, not a population — no learner draws from `lab-canonical`. Two consequences, ratified against the PR #48 evidence base. First, a global distributional verdict stands on its own statistic and does not inherit a per-file failure; per-file distributional verdicts are retained as authoring-hygiene advisories only. Positional and mechanical checks continue to inherit, because a positional tell in any file is a real tell in the bundled corpus regardless of which file carries it. Second, a distributional verdict requires enough observations to mean anything: `sata_count_min_n` and a minimum n derived from `template_repeat_max_share` gate both checks to `INSUFFICIENT` below the floor. The prior `sata_missing_count_fails` rule is removed outright — it conflated bin *coverage* with *bias*, and failed every non-empty SATA bank in the live corpus because every bank lacked at least one demanded bin, including banks with no meaningful concentration. Bin coverage remains reported as a diagnostic and is not audit debt.

This is a correction, not a softening under principle 27: no forcing incident is recorded in the active governance or archived audit-design materials reviewed. The missing-bin failure rule and absent minimum-n gates entered audit v2.0 as design-time defaults rather than recorded responses to an observed failure. The evidence that retired them is that they produced no true positives — every FAIL they generated was an arithmetic floor, a file boundary, or a missing bin, and the one surviving real signal (`visual-canonical` SATA, n=11 at 0.909) is found by the concentration threshold alone. Principle 16's core is unchanged and unrelaxed: distributional tells are still content properties, still unshufflable, still clear only through deliberate authoring or targeted regeneration, and incidental dilution is still not remediation.

Live constants (verify against `scripts/audit/non-mcq-bias-lib.ts`, not here): `audit_version 2.1.0`, `max_cell_deviation_pp: 8`, `sata_count_degeneracy: 0.70`, `sata_count_min_n: 8`, `scramble_min_n: 8`, `template_repeat_max_share: 0.15`. The ordered-response template minimum is derived from the share limit, not stored. `scramble_min_n` and `sata_count_min_n` are independent knobs that currently coincide at 8; they are not interchangeable, and collapsing them would couple two rules that must move separately.

**Standing authoring note (non-blocking):** `visual-canonical` SATA is the sole surviving distributional signal. Vary correct counts where clinical truth naturally permits. This is not retire-and-replace — retiring necessity-gated visual items to move a histogram would violate principles 6 and 25.

**17. Scoring is exam-style polytomous; retention is full-marks. Status: ACTIVE.**
Grading returns `ItemScore { earned, possible }` per the NGN families. Partial credit feeds the session score and per-item feedback only; spaced repetition resurfaces any item below full marks (`earned === possible`). Explicitly out of scope: threshold-based retention, graded-SRS ease from partial scores, rationale/dyad scoring, and `ordered_response` partial credit.

**19. Rationale visuals are explanation figures, not stimuli. Status: ACTIVE.**
`rationale.visuals` is an answer-revealed teaching slot reusing existing deterministic visual kinds, rendered after the correct rationale and before per-choice rationales. Structural kind validation runs on them, but item-type placement and `selfCheck` answer-coupling do not — an explanation figure may intentionally reveal a threshold, abnormality, or relationship the stem didn't require. The load-bearing-stimulus rules still apply in full to `question.visual`.

Schema-floor detection and export-envelope inference traverse all six supported visual locations,
including top-level and embedded rationale figures, through `src/schema.ts`'s shared full-schema
projection. Renderer parity consumes that same projection. The census artifact population remains a
separate, deliberately narrower four-location traversal under principle 28 and excludes rationale
figures by ratification; the two populations must not be unified.

**21. Generation prompts for repo-reading instances carry the semantic floor, not the schema. Status: ACTIVE (narrowed 2026-07-14).**
When the generating model can read the repo, the prompt defers all per-format *shape* to `AGENTS.md`/`NCLEX-Question-Schema.md` and restates none of it. It inlines only the semantic-quality floor the schema cannot infer: no-filler distractors; per-choice rationale for keyed answers *and* distractors; closed-world stems; no lazy "notify provider" key; unique ordered-response sequences; bounded highlight selection; gradeable closed-vocabulary blanks; clinical scope/monitorability; bilingual parity — plus the one mechanical caveat that is not auto-recoverable, a `correct` reference to a nonexistent id, which fails the whole item where normalization silently repairs enum casing. Reintroduce narrow per-format shape reminders only after a measured recurring failure — the default for repo-reading instances stays minimal. Historical validation metrics and the June experiment narrative: archived.

**Application — construction language stays off the learner surface (2026-07-21).** `Closed-world` describes an authoring construction, not wording to show a learner: the governing order, protocol, threshold, or criteria must instead be stated naturally in the question. Author/checker scaffolding such as `source-pinned`, `source-supported`, and metaphorical `lane` language is naturalized before promotion without removing the embedded rule or changing the tested construct. Project-internal constraints also stay off learner surfaces: a producer rule such as “do not independently prescribe” must be embodied through clinical facts, choices, and rationale rather than appended to the stem as a disclaimer. The finite HIGH-confidence label lexicon remains enforced by [`lib/producer-vocabulary-leakage.ts`](lib/producer-vocabulary-leakage.ts); the separate constraint-shaped survey and narrow blocker are owned by [`lib/authorial-constraint-leakage.ts`](lib/authorial-constraint-leakage.ts). Broader directive shapes remain review-only because legitimate clinical scope teaching uses the same vocabulary.

**Application — construction language is functional, not positional (2026-07-22).** Construction language under this principle is any learner-facing prose whose *function* is to explain, justify, or defend how the item was built — a scope caveat, a sourcing note, a construct defense, an apology for an omission. It is identified by function, never by phrase and never by position. Terminal position is a **review heuristic only**: producers tend to append constraints, defenses, sourcing notes, and apologies after an otherwise complete item, which makes the final sentence the highest-yield place to look first. It does not define the defect, and a mid-stem construct defense is the same defect in a less convenient place.

*Forcing incident (compact).* Luke identified a PEP `ordered_response` stem whose closing sentence correctly distinguished source-patient testing, exposed-worker testing, and non-delay of PEP — clinically accurate, but reading as an adjudication note defending the authored sequence rather than as clinical instruction. A later RSBI item stated "This item asks only for documentation of the index; RSBI alone is not required to determine spontaneous-breathing-trial readiness," showing post-hoc construct defense as a general producer pattern rather than a single lapse. `gap_50_mc_03` then proved the family was not confined to prose: its stem rendered raw `{{1}}` / `{{2}}` placeholders to the learner (`The nurse should first {{1}} and then {{2}}.`) and duplicated the response demand already carried by `clozeStem`, so the same behavior also produced response-surface placement defects. Adjacent construct audits found the identical behavior expressed structurally — ordered responses forcing concurrent actions into a total order, fill-ins reducing interpretation to labels or arithmetic, dependent dropdown blanks, and decorative bowtie expansion. The common cause is a producer completing an item and then defending it; the defense surfaces as prose, as a placeholder, or as a distorted construct.

*Consequence for review design.* A positional filter is a sampling strategy, never a definition, and a clean terminal-sentence sweep is therefore not evidence that a corpus is free of construct defense. Remediation lane and evidence: `audit/terminal-sentence-remediation-2026-07-22/`.

**23. Exam-like presentation is a renderer concern; case identity and grading are not. Status: ACTIVE.**
The split layout (client chart left, active item right) is presentation only. A `case_study` stays one top-level session question — one `AnswerState.caseStudy`, one aggregate submit, one aggregate score; grading, storage, SRS, progress, flags, adaptive, and summary all key on the top-level `question.id`. Per-part submit / true unfolding reveal is deferred: it needs a storage-and-grading redesign (per-part result/completeness state, synthetic ids) and is revisited only if real-session observation shows aggregate submit is the fidelity bottleneck.

Stage visibility is cumulative and fail-open: both `stageId` and `answerableAfterStageId` show global exhibits plus all stages through the active part's stage; an absent or unresolved reference shows **all** stages, never fewer. Split eligibility is determined by measured visual geometry, not nominal item type — calibrated wide tracings stay full-width; squarish/vertical/compacted-table kinds join the standalone split allowlist only after a measured proof render, never a predicted one.

Moved to code/status — verify there, not here: the exact split allowlist is `STANDALONE_SPLIT_VISUAL_KINDS` in `src/examLayout.ts`; exact pixel/viewBox dimensions, proof-render sizes, and the current case-mapping coverage percentage belong to code and `PROJECT-HISTORY.md`'s current-status section, not this principle.

**Application — sparse shape-aware allocation (2026-07-19).** A kind-level split allowlist may be
refined by payload geometry after the same measured proof this principle requires. The measured
one-series `lab_trend` shape now takes the full-width route while the two-series shape remains in the
split. Structured measurements use an independent whole-payload density predicate: only a sole
one-panel × one-row × one-column payload receives a natural compact figure, while mixed-panel and
denser payloads retain the established full-width behavior. These are presentation allocations, not
new content-validity floors; principle 29's sparse-cardinality ruling and principle 24's prose-
supplement contract remain unchanged.

**Application — an embedded leaf is a planning unit, not a retirement unit (2026-07-22).** Principle 28 makes each embedded case leaf an individual *content-planning* unit carrying its own category, topic, item type, and difficulty. That does not make it an ordinary unit of removal. This principle keeps the `case_study` one top-level session question — one aggregate submit, one aggregate score, one keyed identity — so a case is authored, navigated, submitted, and graded as a single unit, and deleting one leaf is a case-level structural revision rather than a content edit.

Schema legality is not the test. `caseStudy.questions` requiring only two members means a five-part case still validates after losing one; validation says nothing about whether the surviving narrative, stage references, part cadence, and aggregate scoring still cohere. **Default to rewriting or replacing the leaf in place.** Where a leaf's construct is unsalvageable — for example an `ordered_response` whose corrected content would force genuinely concurrent actions into a total order — replace it with an appropriate non-serial format after source-backed construct and key re-derivation, subject to whole-case producer≠checker review of progression, stages, exhibits, leakage, part cadence, aggregate scoring, and narrative closure. Retire the **whole case** when no coherent replacement is feasible. No embedded-leaf retirement mechanism is authorized; schema legality is never the argument for minting one.

*Forcing incident.* The terminal-sentence remediation initially authorized retiring a single embedded `ordered_response` leaf on schema-legality grounds. Luke withdrew that authorization on 2026-07-22 as too harsh and structurally unprecedented, routing the row to whole-case rewrite instead.

**24. Structured measurements are values-only exhibit presentation; identity/display resolve at the edges. Status: ACTIVE (narrowed 2026-07-14).**
Structured measurements supplement source prose — they never replace it except for pure key-value exhibits reduced to a pointer. Clinical identity (which analyte, which population) is resolved before display, never inferred from magnitude alone: total and ionized calcium are distinct registry keys (not unit variants of one value) routed by explicit source label, because a bare "calcium 1.2 mmol/L" is a normal *ionized* value but a critically-low *total* one — identity must resolve before the unit conversion, since the same source unit converts differently per key. Source values and typed bounds (`bound: ">" | "<"`) are stored; canonical and display forms are derived at the rendering edge rather than redundantly persisted, so there is one place — not several — that can drift. Censored values remain typed, never coerced into a bare number. Non-rendering migration dispositions (`skip_serial`, empty extracts, `excludedValues`, `unitAliases`) are ledger/staging-only and never enter canonical banks.

Rule F (the `post_intervention` operative test) is owned by `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` — do not restate its test here.

Moved to code/schema — verify there, not here: exact fields, enums, columns, validation behavior, and allowlist contents live in `src/types.ts`, `src/schema.ts`, `src/measurementAllowlist.ts`, and `src/measurementUnitPolicy.ts`. Proof-batch composition, Batch 19/20 handling, fast-follow fishbone sequencing, and applicator procedure narrative are migration detail, now redundant with the closed migration's archive and the extraction contract's authority map — archived, not restated here.

**25. Necessity is a property of the artifact, not of every element in it. Status: ACTIVE.**
A redundant element is permissible inside a necessary, value-complete artifact — one that already carries every exact value the item turns on — when it adds a meaningful reading affordance such as pattern, direction, crossover, or divergence, rather than mere ornament. It never licenses an ornament that carries information absent elsewhere in the artifact, and it never licenses an artifact whose values the stem already states.

Two fences travel with this waiver and are load-bearing: the necessity gate stays unchanged and strict at the artifact level (if any single-timepoint tally resolves the item, it is the non-trend kind's item, not the waived kind's); and no exact-value item is authored on a waived-element kind (the table makes such an item *renderable*, but authoring it would prove the kind redundant — item briefs on a waived kind are pattern-only). Vendor ubiquity (a chart because a vendor's EHR draws one) is explicitly not a qualifying criterion. Reversal is cheap and specific: if review repeatedly catches an item answerable from one timepoint, the waiver is not the problem — the collapse gate is being ignored, and the kind closes to new content until it holds. Full `io_trend`/fishbone litigation chronology: archived.

**Application — composite trend artifacts.** A deterministic trend artifact may present the same typed source data through both charts and a renderer-derived table when the views provide distinct reading affordances: charts expose direction, divergence, crossover, and trajectory; the table exposes exact values in a familiar flowsheet form. The artifact-level necessity gate remains unchanged — removing the complete chart-plus-table artifact must materially change answerability, and the item must still turn on multi-timepoint or cross-series reasoning, never one isolated cell. The table is never an independently authored second source of truth. Sparse cardinality is not a validity floor here by the same reasoning principle 29 applies to laboratory presentations — principle 7 plus principle 25's anti-ornament fence — not under principle 29 itself, which remains scoped to `lab_trend` and `structured_labs_panel`. First applied to `vitals_trend` by the 2026-07-18 composite readability repair: unit-pure scale-family panels, panel-exclusive reference bands, and a renderer-derived vital-sign flowsheet, with no schema or bank-content change.

**Amendment (2026-07-19) — unified single-axis presentation supersedes the multi-panel geometry for `vitals_trend`; the flowsheet is retained.** The 2026-07-18 unit-pure multi-panel geometry above is superseded as the default `vitals_trend` presentation by an Epic-style single unified chart (one time axis, one 0-based numeric axis, no unit family, interactive per-timepoint readout, legend-driven emphasis), with the renderer-derived flowsheet retained and visible beneath the chart. Forcing evidence per principle 27: a concluded A/B experiment in which the real user preferred the unified chart in ordinary study flow — not vendor familiarity, which principle 25 excludes as a qualifying criterion. Both arms shipped behind the persisted `vitalsChartStyle` setting (`epic` default; `panels` the preserved byte-identical composite, retained as the fallback) per `Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md`, the experiment's adjudicator being the user's experience as set at commission. What the unit-pure panels bought geometrically — per-vital resolution for low-magnitude vitals such as RR and temperature — the unified chart recovers instead through the retained flowsheet (exact values) plus the interactive readout, keeping principle 25's chart-carries-pattern / table-carries-exact-values division intact; the user's own request to keep the visible table is the signal that its exact-value affordance is load-bearing, not ornamental — exactly the redundancy principle 25 blesses. All principle-25 fences carry over unchanged: the artifact-level necessity gate, no exact-value item authored on the waived kind, and the table never an independently authored second source of truth. Reference bands, having no panels to be exclusive to, are single-series-only under the unified model; the multi-series unified chart shows none. No schema, bank-content, or clinical-range change.

**Implementer note (not architect-gated).** The visible flowsheet beneath the Epic chart is a low-cost re-add of the existing, known flowsheet renderer code; the tested `epic` build used the hidden-table (Route C) disposition, so reinstate the visible flowsheet so shipped code matches this ratified model. No further architect input is required.

**26. A disposition that suppresses a check must itself be checked. Status: ACTIVE (narrowed 2026-07-14).**
A disposition that removes material from a checked surface must have an independently enforced precondition; a producer may not silence its checker merely by declaring that nothing requires review. Generalized past its origin: every disposition that *removes* a value from the checked surface — an exclusion, a skip, an empty extract, an off-allowlist drop — purchases its silence by moving the value out of the checker's view, so each needs its own precondition enforced by something other than the disposition itself. Corollary: exclusion count is a **positive** signal for checker-seat sampling, not a negative one.

Forcing incident (kept, compact): a staged flowsheet record's sixteen `reason: "prior"` exclusions silently deleted an entire baseline electrolyte panel and still gated clean, because excluding a value moves it out of the checker's view by construction, and the clinical judgment the record was meant to support was graded on exactly the value that had been deleted. The gate was silent exactly where it needed to speak. The full six-ruling extraction-semantics amendment this incident produced (post-intervention tagging, `prior_no_current`, censored-value typing, per-analyte unit inference, population-precedes-rendering) is flowsheet-extraction detail now owned by `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` and the migration archive — archived here, not restated.

**27. An invariant softens only by naming the incident it was minted from and showing the generating condition is gone. Status: ACTIVE.**
Every rule in this repo was minted by a failure — positional integrity from the D-correct-at-3% finding, quote hygiene from two independent corruption incidents, the single-definition `roundTo` from two kinds resolving the same dose math differently, producer≠checker from a field reaching four files without a version boundary. The endgame is exactly when ceremony feels most expensive and the memory of *why* is thinnest, so the ratchet needs a procedure, not a mood: **to relax an invariant, name the incident it was minted from and argue that the condition which produced it no longer holds.** "This feels heavy now" is not that argument. A rule that no longer earns its keep is retired on the record, with its incident cited, and marked `SUPERSEDED` rather than deleted.

Most recent application (2026-07-12 pass, kept as the standing precedent this current pass follows): risk-tiered verification replaced an undifferentiated ritual (`AGENTS.md`'s change-class matrix — docs-only is *not* the safe tier, since stale version prose has repeatedly misrouted reasoning about schema floors); `AGENTS.md` became constitutional with a runbook carrying the operational load; this file's entries gained the explicit status tag now formalized further in §2 above; and single-definition discipline was applied to prose the same way it applies to code (a duplicated routing table was cut in favor of one owner plus a link). The alternatives that pass rejected — fresh-context review counting as independence, shortening the read order, demoting `PROJECT-HISTORY.md`'s override authority, compressing the quote-safety two-mode summary to one line — still stand; full reasoning for each rejection is archived.

**28. Scored leaves govern content planning; session units govern delivery capacity and inventory. Status: ACTIVE (ratified 2026-07-16).**
Content-planning reports measure what is scored: standalone top-level questions plus embedded case-study questions, excluding case-study containers. Each embedded leaf contributes its own category, topic, item type, and difficulty; parent-case metadata is not evidence about the leaf. Category and topic distributions, difficulty and item-type distributions, target gaps, and generation prompt parameters therefore use only this scored-leaf population. `case_study` is a delivery container and cannot enter equal-average scored-item-type targets absent a separately ratified case-cadence target.

Delivery and inventory reports measure what can be served: top-level session units, separated into standalone questions and case containers, with case lengths and embedded-part totals reported alongside them. Standalone draw capacity and weighted-session constructibility stay on that operational population and may emit clearly labelled capacity warnings; those warnings never change the content-planning denominator. Visual inventory is a third, recursive artifact population rather than an alias for either question denominator.

Reason: the dual traversal introduced in PR #51 made both populations visible but did not establish which one governed planning, leaving competing target and prompt blocks that could direct generation from incompatible denominators. PR #52 makes the authority singular while retaining both legitimate analytical views. Executable owners: `lib/question-population.ts` (shared population and visual-artifact traversal), `scripts/census.ts` (canonical census shape and reconciliation), and `scripts/coverage-report.ts` (explicit call-site coverage views and the single scored-leaf planning output).

**29. Sparse laboratory-presentation cardinality is not a validity floor. Status: ACTIVE (ratified 2026-07-18).**
A one-series `lab_trend` and a one-row `structured_labs_panel` are valid when that is the clinically appropriate amount of information. Series count and row count are not validity axes layered on top of principles 24 and 25: a single-analyte trajectory still carries the pattern/direction affordance principle 25 waives redundancy for, and a single-row labs panel still supplements source prose exactly as principle 24 requires. A universal second-series/second-row floor would force clinically-unnecessary filler — forbidden by principle 7 (precision over volume) and the anti-ornament fence of 25 — so no cardinality floor is adopted.

Adjudicated from the P4 single-row lab presentation survey (`Archive/root-cleanup-2026-07-19/SINGLE-ROW-LAB-PANELS-P4-SURVEY-SPEC-2026-07-18.md`; manifest `audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json`), mechanically complete and independently re-derived from the raw banks (24 object paths, population totals 20/11/9 `lab_trend` and 126/13/113 `structured_labs_panel`, and the answer-reference split all reproduced):

- **L1 and S1 ratified** — preserve the current one-or-two-series and nonempty-row contracts.
- **L2 and S2 rejected** — the survey supplied no evidence of a renderer, comprehension, or safety failure caused by sparse cardinality, and a universal floor incentivizes filler.
- **L3 rejected as machinery that changes nothing** — on this corpus it is behaviorally identical to L1 (0/11 fail either).
- **S3 rejected as a mismatched predicate** — its "not exactly duplicated by prose" clause imports a `question.visual` rule into a surface principle 24 designs to coexist with intact prose, so a conforming supplement can never satisfy it.
- **S4 closed without naming a class** — the only structural shape the evidence offers ("single-value stage-update panel duplicated in prose") also covers the answer-referenced panels, and the discriminating property is a read-the-answer-key judgment, not a deterministic validator predicate.

Framing on the record: the per-datum finding is **answer-referenced vs non-answer-referenced** (whether the value appears in a keyed response), not artifact-level load-bearing. Under the principle-25 collapse test all 13 panels are removable without changing answerability, because prose retains the value by design (principle 24); "non-answer-referenced" is therefore a legitimate, expected category on an additive surface (background, stability, anti-beacon context), not a defect. The nine non-answer-referenced structured rows open no remediation lane.

Any presentation change would require its own measured proof-render commission under principle 23; none is authorized here.

P4 is closed. This ruling authorizes no schema, bank-content, renderer, or runtime change.

**30. Lab reference bands are source-verified adult-only; pediatric bands fail
closed; the learner-visible H/L-flag feature remains unauthorized.
Status: ACTIVE (ratified 2026-07-19).**

The 29-analyte × 3-population request is not safely expressible in the current
peds_infant/peds_child vocabulary — published pediatric intervals split by
age-in-days/weeks, by sex, and by assay, so a coarse two-bucket band would ship
silent H/L errors. Resolved to source-verified adult teaching bands only, with
pediatric reference bands intentionally absent. `ANALYTE_DEFS`
(`src/visuals/kinds/lab_trend/defs.ts`) carries sourced adult bands plus
warning-only sanity envelopes; per-analyte provenance ([S1]–[S20]) lives in
`audit/lab-reference-range-verification-2026-07-19.md`.

Pediatric fail-closed contract (validator, `src/visuals/kinds/lab_trend/index.ts`):
`reference_band_unavailable` when a peds series leaves the band enabled;
`self_check_flag_requires_reference_band` for peds H/L; `self_check_stable_requires_reference_band`
for peds stable (its tolerance needs a band width). Peds up/down trajectory stays
valid with `showReferenceBand:false`.

Clinical ratifications (Luke, lab professional, final call): magnesium tightened
to 1.7–2.3 mg/dL, a deliberate override of the sourced UIowa 1.5–2.9 as
implausibly broad for serum Mg; glucose left at 65–139 mg/dL (random/general
interval, facility-consistent — the Mayo 70–140 action-threshold framing is
noted for the future flag feature but not adopted now); sex-inclusive envelopes
accepted (creatinine, hemoglobin, hematocrit, AST/ALT, ammonia) under the
standing rule that no answer is keyed to a borderline envelope value; anion gap
7–15 and BNP 0–100 accepted though their citations ([S5] Mayo, [S15] Labcorp)
were unverifiable by automated fetch.

Therapeutic-anticoagulation flagging is intended, not a defect: warfarin INR
(2.0–3.0) and therapeutic aPTT/heparin sit above the healthy-population bands and
correctly compute "H". Recorded so it is not later "repaired."

Scope boundary: this closes range VERIFICATION, the documented prerequisite. It
does NOT authorize the learner-visible H/L-flag / reference-range-column feature,
which remains a separate, unauthorized decision.

Renderer geometry moved (INR band 0.8–1.1 → 0.8–1.2, magnesium 1.5–2.9 → 1.7–2.3,
and other analyte corrections), so the governed `lab_trend` promoted-visual
parity baseline was rebaselined via `parity:rebaseline --scope lab_trend`
(Luke-authorized 2026-07-19/20). Regression: `scripts/tests/lab-trend-reference-bands.ts`,
wired into `test-visuals`.

Producer≠checker: produced by GPT (connector, no shell), independently checked by
the shell seat (receipt: `test:lab-reference-ranges`, `test:measurement-allowlist`,
`validate-bank` ×13, `tsc`, `test-visuals` [green through every lab_trend-relevant
step and the rebaselined parity survey; one unrelated pre-existing `rationale-visual-floor`
survey-drift failure, confirmed present on committed `main` before this work, is
out of this scope], `build`; flowsheet-gate cross-consumer at
`exhibit-flowsheet-gate.ts:400` confirmed). Architect conformance + citation
spot-check (INR 0.8–1.2 confirmed verbatim at the UIowa 2023 source) 2026-07-19,
magnesium override re-verified empty-diff against all 20 promoted `lab-canonical.json`
items 2026-07-20.

## 5. Conditional lane contracts — forward case-generation pipeline (LAPSED 2026-07-18)

**Lapse note (2026-07-18; pathway disposition 2026-07-19):** Luke retired the Opus-skeleton → GPT compile/fact-check → Gemini flag-review → Claude gate pipeline in favor of wholesale case_study production in the current GPT model. Per §2, CONDITIONAL principles lapse with their governing lane and need no separate repeal, so principles 8, 9, 12, 18, and 22 below no longer bind. They are retained verbatim for historical reference — do not apply them to any new lane without re-ratifying. The `opus*` case-ID routing in `scripts/audit/early-bank-semantic-layer-a.ts` (principle 22) is unaffected and stays in force, since it routes already-promoted cases already carrying that ID prefix, not new production. The replacement episodic direct-GPT pathway is specified by `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md` and topic-specific commissions. The C/D rerun established that it can produce gate-worthy cases with bounded checker repair; use it when a topic or load-bearing visual calls for case form. It is not a standing bulk-generation lane, and every output remains subject to principle 5 and independent promotion review.

Principles 8, 9, 12, 18, and 22 collectively described **one** forward case-skeleton pipeline. They are conditional on that lane remaining the active forward-generation path, not five separate universal project principles. Two rules from this group are universal regardless of which lane is active, and are stated once here rather than five times:

1. Clinical truth and answer logic have an explicit upstream owner; every downstream transformation (translation, schema compilation, formatting) may read but never silently invent or change them.
2. Every active generation lane declares producer provenance and independent-review routing (principle 2).

**Current producer assignment (verify against `PROJECT-HISTORY.md`, not assumed timeless from this file):** as of 2026-07-18, GPT-5.6 Sol is the current producer for every `gpt_`-prefixed lane (evergreen standalone items, episodic direct case-study commissions, and new visual-kind content), replacing the prior GPT producer outright. The retired case-skeleton compiler is not an active lane. GPT-5.6 Sol remains "GPT" for review-routing purposes. A future producer substitution updates only this callout, never the principle numbers or their obligations below.

**8. CONDITIONAL — clinical truth is authored once, upstream, and read-only downstream.**
The author model (currently Opus) owns the fact pattern, the correct actions, and the rationale; the compiler (currently GPT) translates and shapes into schema but never decides or alters which action is correct and never introduces clinical claims absent from the skeleton. A decision point too underspecified to yield an unambiguous item is dropped, not guessed. Extensions (condensed; full narrative archived): an optional author-supplied bowtie-synthesis zone lets the compiler assemble a standalone `bowtie` alongside the case without inventing the differential or irrelevant-parameter pools itself; case completion is accounted via a `_compileManifest`, never assumed — a genuinely underspecified decision point may be omitted only with a specific manifest entry, and promotion fails if authored points disappear unaccounted; Gemini is a flag-only review layer over the compiler's output, never a compiler itself, and never mutates JSON, prose, ids, answer keys, or Chinese translation.

**9. CONDITIONAL — the case skeleton is English-only; bilingual generation concentrates in the compiler.**
The authoring harness drifts to Spanish and mangles schema under bilingual load, so the authored skeleton is English prose only; all `zh` is generated downstream by the compiler, making compiler zh-fidelity the single point of failure. Gated by a deterministic CJK-presence check on every must-be-bilingual field: a missing `zh`, or English left in a `zh` field, fails loud before review.

**12. CONDITIONAL — author-side currency via closed-world construction + routed flags, never a changelog.**
The author model is frozen at its training cutoff and has no tools, so currency belongs to the downstream fact-checker and Claude's final review, never the author. Two mechanisms, neither of which tries to update the author: closed-world construction states the governing protocol/threshold *inside* the case as an order or clinic rule, so the keyed answer survives external guideline drift; and an optional sentinel-delimited currency-flag block lets the author name only the specific claims it doubts, stripped before compile. Deliberately not fed: a "what changed since cutoff" changelog — always partial, costly to maintain, and redundant with the independent currency pass.

**18. CONDITIONAL — fact-check/currency and flag-only review are chain steps, not optional asides.**
Every forward skeleton-derived case passes through clinical fact-check/currency plus compilation, then flag-only review, then Claude's final clinical and promotion gate. Record this topology explicitly in every `Chain:` line; an annotation that omits fact-check or the flag-review step understates the independent checks, and one implying the flag-review layer edited content reopens the corruption vector this split exists to close.

**22. CONDITIONAL — Opus skeleton cases are GPT-provenance for review-conflict purposes.**
The producer principle 2 protects against self-review is the compiler (currently GPT), not the prose author (currently Opus) — an `opus*` case is checker-conflicted for the compiler and for the flag-review layer, but **not** for Claude, since the clinical substance an audit evaluates is the compiler's, not the prose author's. Deterministic routing: `opus*` ids (matcher `/^opus\d*_/`) tag producer `gpt`, tier `low` (`scripts/audit/early-bank-semantic-layer-a.ts`) — identical to `gpt_case_` items, which is what they effectively are. This does **not** extend to `claude_*` items Claude authored directly, which remain Claude-produced and route to a non-Claude reviewer.

## 6. Parked architecture

**20. Pronunciation/audio is pre-generated, local-first, resolved by asset presence. Status: PARKED.**
The pre-generated-audio architecture itself — local-first bilingual TTS distribution, field-level content-hashed clips, asset-presence resolution — is inactive and not currently binding; it is subject to the universal runtime-audio invariant below, which stays active regardless of this principle's status.

Deprioritized 2026-06-22 on real user feedback (a GPT-conversation workaround currently suffices for the acute trigger), not killed — the queue/cost/per-field-clip machinery is fully built (`src/audio/normalizeForTts.ts`, `scripts/audio/build-tts-queue.ts`), so a restart is a lane decision, not a re-derivation. **Resumption triggers:** the workaround stops sufficing, integrated bilingual audio becomes wanted, or the project reaches a scale where a workaround-per-user no longer fits. Clip counts, minute/storage estimates, price-per-tier projections, provider/model/codec choices, Pages limits, R2 scaling plans, and queue implementation detail: archived — none of it is active constitutional content while parked.

**Translation-friction scoring. Status: PARKED.** Folding reveal-tap friction into the targeted-review sampler stays open until real dogfooding sessions show reveal concentration that is genuinely topic/category-specific and miss-predictive beyond the existing missed-topic signal. The instrument (telemetry, export, dev panel) already ships; only the scoring decision is parked.

**`test` and `adaptive` exam-condition modes. Status: PARKED.** Both are non-default half-exam placeholders — they force `languageMode: "off"` at session creation and still reveal the answer, rationale, and per-choice breakdown immediately after each submit — pending a decision to spec each as a real exam simulator (deferred feedback, no translate-all, strict language mode) or remove them. Deferred sub-question: whether a strict exam environment should ever permit a post-submit full translation reveal.

## 7. Revisit queue

Each entry names its next step; none of these describes settled behavior.

- **Vital-sign `sanity` bounds are copied renderer validation envelopes, not authored plausibility bounds (Amendment 3A/R17, found 2026-07-10; `temp` closed 2026-07-15).** `MeasurementDef.sanity` is derived straight from `VITAL_DEFS[key].range` for six of seven vitals, a renderer validation envelope, not an authored physiologic-plausibility tripwire. For `temp` this is now repaired: the flowsheet gate's GATE 4 sanity ceiling is decoupled from the renderer's legacy `110` range and independently authored at `46.5 °C`, sourced to Slovis CM, Anderson GF, Casolaro A, "Survival in a heat stroke victim with a core temperature in excess of 46.5 C," *Annals of Emergency Medicine* (1982) — the highest of three documented full-recovery hyperthermia cases considered, chosen as the most conservative point within the engineering interval that both preserves the renderer's full `86–109 °F` authoring envelope and catches the full Fahrenheit-mis-staged-as-Celsius defect class. Luke's sign-off and architect ratification: 2026-07-15. Full reasoning, citations, and the engineering-interval derivation: `Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md`. Moved to code — verify there, not here: the ratified value is `VITAL_SANITY_MAX_OVERRIDES.temp` in `src/measurementAllowlist.ts`; the floor remains inherited from `VITAL_DEFS.temp.range.min` and is explicitly not ratified by this closure. The remaining six vitals (`hr`, `sbp`, `dbp`, `map`, `rr`, `spo2`) stay open under REVISIT, and `temp`'s own floor remains inherited and unratified: survey and pre-move sweep are complete (2026-07-11: zero flips in the promoted corpus under either tested probe), but no bound beyond the `temp` ceiling is ratified. The deterministic inventory across all seven vitals is now **complete and merged** (P3 survey, `audit/vital-sanity-bounds-survey-2026-07-17/survey-manifest.json`; independent classification review closed, provenance repair `9bf33b2`), and its stage-2 architect adjudication is ratified as §20 of `VITAL-SANITY-BOUNDS-P3-SURVEY-ARCHITECT-SPEC-2026-07-17.md`. Next step is therefore no longer the inventory but the post-inventory sequence, per that §20: stage-3 clinical/device/reporting-limit sourcing for the three ratified sides only (SBP ceiling, RR ceiling, SpO₂ floor), then producer≠checker source-dependent review, then Luke's per-vital/per-side ratification, then an implementation PR carrying only ratified overrides plus any required floor-mechanism extension and a fresh flip survey. The other ten open sides (including the `temp` floor) remain provisional or structural and are not sourced now. No bound is authored from model memory at any stage — own thread, own gate, own review, not blocking anything else.

## 8. Superseded rulings and compact forcing-incident history

**CBC lab units are American conventional, not SI (2026-07-04). Status: SUPERSEDED** by the Amendment (2026-07-05) below. Do not follow this entry's "never SI" / "`×10⁹/L` dropped" claims.

*Original ruling.* For WBC/platelet counts the app used conventional US units only, grounded in Luke's bench experience as a laboratory technologist — US labs report these conventionally (`×10³/µL`/`K/µL`/raw `/µL`), not SI `×10⁹/L`. `lab_trend`'s canonical unit for `wbc`/`platelets` moved to the conventional form (numerically identical, only the label changes), dropping `×10⁹/L` as an accepted unit.

*Amendment (2026-07-05) — refined to conventional-first + SI-in-parentheses, analyte-aware.* Dogfooding showed "never SI" was too rigid in two ways: conventional reporting is itself multi-form (magnesium/calcium legitimately carry `mEq/L`, not just `mg/dL`, as a real US form — not SI), and some SI-looking units (lactate `mmol/L`, ammonia `µmol/L`, ionized calcium `mmol/L`, troponin-T `ng/mL`) are the normal US reporting form and must not be mechanically inverted. The governing rule is **analyte-aware**: each analyte has its own conventional form(s), keyed by (analyte, sourceUnit) in one sourced conversion table, never by unit token alone. Consequences: accepted *source* units became permissive again (extraction preserves byte-exact `sourceUnit`, including SI `×10⁹/L` where source states it, per Rule C in the extraction contract); display became a separate policy layer (conventional-primary, optional SI-paren) consumed by both `lab_trend` and `structuredMeasurements`; and one sourced conversion table serves GATE 4 sanity, display-paren generation, and prose normalization.

**The fishbone "workflow-familiarity" waiver (2026-07-06). Status: SUPERSEDED** by principle 25 (§4), on stronger grounds: the fishbone qualifies because it *preserves exact values* (a partial H/H fishbone is value-complete), not because clinicians are used to seeing one. Vendor ubiquity is explicitly not a qualifying criterion under principle 25.

**"Vitals `sanity` passes every real transcribed value." Status: SUPERSEDED / withdrawn.** An earlier characterization that the six non-`temp` vital `sanity` bounds were clinically ratified and admit every real reading is withdrawn as unprovable of a copied renderer envelope, and contradicted by evidence (documented SBP to ~370, RR at the `80` ceiling with no margin, displayable SpO₂ below 50). They are retained provisionally, not ratified — see the REVISIT entry in §7.

**Governance markdown needs an encoding gate (2026-07-09). Status: SUPERSEDED / withdrawn 2026-07-16.** Luke's ruling, after three independent clean scans (2026-07-09; 2026-07-16 × 2 — the latter covering untracked files and confirming all repository Markdown is valid UTF-8, with no U+FFFD and no mojibake signatures). Every mojibake alarm this project has raised has been a **connector-read artifact**: the corruption is in the path Claude reads through, never on disk. A repo-side CI gate is the wrong instrument — it would scan clean files indefinitely, never fire, and falsely imply the read path had been validated.

*The reasoning error, named so it is not repeated.* The original entry correctly identified the 2026-07-09 alarm as a connector artifact and then concluded that "the underlying gap stands" by analogy to `banks/*.json`. **The analogy does not transfer.** `scanForReplacementChar` guards bank JSON because bank JSON is *machine-consumed* — a U+FFFD there ships silently to a learner. Governance markdown is *read by humans and models*, so a corrupted glyph is visible at the point of use, and has in fact been caught by the reader every time. Different consequence class, different control. **Do not re-open this by citing "banks are gated but markdown isn't."**

*Replacement control*, aimed at the actual failure surface: `CLAUDE.md` (§ *You have filesystem access*) now directs the reading seat to suspect its own connector before the repo and to confirm with a second method before raising an alarm. The residual write-path risk — Claude authoring governance text *through* the suspect connector — is covered by a one-time plain `grep` of the final tree at commit time by a non-connector tool, not by a standing gate.

Full forcing-incident narratives, exact historical metrics, superseded prior wordings, and closed-out chronology for every principle narrowed in this pass live in [`Archive/DECISIONS-ARCHIVE-2026-07-14.md`](Archive/DECISIONS-ARCHIVE-2026-07-14.md).

## Reference appendices

Supporting material for the active principles above — not itself a status bucket, and not restated in the principle bodies to avoid the duplicated-definition risk principle 27(d) warns about.

**Other standing invariants (all ACTIVE unless noted):**
- **Runtime audio must not require a client-embedded secret or a live API call; an absent pre-generated asset must fail safely to the supported fallback (`speechSynthesis`).** This binds regardless of principle 20's parked status below — it is categorical under GitHub Pages, not prudential: Vite inlines `VITE_`-prefixed vars as plaintext into the published bundle, so any client-embedded key would be world-readable on the deploy.
- Bilingual EN / zh-CN parity on all displayed text.
- `question.topic` is English-only — a navigational label, not study content. Enforced in `validateBankObject` (Tier 0): CJK in `topic` fails loudly and is never silently stripped.
- **JSON quote hygiene is a parse-time gate, and JSON shape is edited programmatically, never retyped.** Structural tokens are ASCII `"` only; Chinese quotation marks are valid only inside `zh` values. The dominant corruption source is editing, not generation. Full quote-safety mechanics: `docs/AGENTS-RUNBOOK.md`.
- Question IDs are globally unique across bundled banks, including embedded case-study leaves — gate-enforced by `audit:ids`.
- **Raw-draft filename prefix routes to its canonical bank by a fixed table**, `CANONICAL_PREFIXES` in `lib/canonical-routing.ts` — the executable source of truth; do not hand-maintain a prose copy of the table. The eight original per-kind canonicals are complete, frozen content sets, not active generation targets; `visual-canonical.json` is the only live visual generation target, and a visual kind added after the original roadmap does not mint a new per-kind canonical.
- Canonical merges are deterministic and gated via `npm run consolidate`; canonicals are never hand-merged.
- Runtime stays static, offline, and `file://`-compatible. No server or live model call after build.
- **Schema versions are an ordered token, not semver — the minor component never exceeds 9.** Every version string must sort correctly under naive numeric, lexicographic, and index comparison; `schemaVersionAtLeast` (over a private index) is the single legal comparison primitive. Current supported set: verify against the `SchemaVersion` union in `src/types.ts`, not against any version list restated in prose (including `NCLEX-Question-Schema.md`'s own restatement, which must itself be checked against code).
- Schema changes are rare and deliberate.
- Shared visual numeric helpers have a single definition: `fmt`, `fmtNum`, `roundTo` live in `src/visuals/primitives/graphPaper.ts`; no kind redefines them.
- Case-study exhibit ids share one namespace across the whole case (top-level `exhibits` plus every stage); `caseStudy.exhibits` may be empty if the case's opening content is meant to be entirely stage-gated.
- Category targets are the current test-plan weights project-wide, not uniform, for both the weighted study draw and the generation coverage backlog (`NCLEX_CATEGORY_WEIGHTS`, single map). Item-type balance stays uniform by design — the test plan weights Client Needs categories, not item formats.
- **Bank composition is a floor problem, not a balance problem.** No release gate enforces balance; the rule is that no format may fall below the depth its sampling path requires (the `floorThreshold` viability gate), and above that floor, topic fit and item quality override census arithmetic — no weak item is authored merely to close a census gap.
- **Worktree hygiene for content-generating instances.** A clean, pushed worktree is required before a repo-reading generation session, because those instances read GitHub, not disk — a dirty or unpushed local worktree is invisible to them regardless of branch isolation.
- **Some topics are deliberately shared across NCLEX categories, not misclassified.** `Skin & Wound Care` spans Basic Care and Comfort, Reduction of Risk Potential, and Safety and Infection Prevention and Control; `Transfusion & Blood Products` spans Safety and Infection Prevention and Control, Pharmacological and Parenteral Therapies, Reduction of Risk Potential, and Physiological Adaptation (`src/topics.ts`). Do not "fix" an item's category to make it match a topic's single most-obvious category — the topic is intentionally cross-category.
- **Standalone bowtie may be generated directly, not only harvested from a case skeleton (2026-07-02).** The case-origination requirement was mis-scoped: it protected the compiler from inventing the differential/irrelevant-parameter pools, but bowtie is standalone-only by construction regardless of origin. A direct standalone-bowtie generation lane runs through the normal raw→cross-model review→promote→ledger pipeline on equal footing with every other item type, under the same semantic floor as the case-embedded synthesis zones. This does not relax producer≠checker or the case-embedded compiler's discipline for bowties that do arise inside a skeleton.
- **Highlight's structural bias gate is schema-level, not audit-level.** Every `highlight` item must include at least one selectable distractor segment (Tier 0 validation) — "highlight everything" cannot enter a bank. Segment order is clinically meaningful passage order and is never shuffled; the non-MCQ positional audit has no applicable position null for highlight, so semantic cue quality stays content-review work.
- **Promoted visual parity is a committed per-kind baseline over every full-schema visual location (closed 2026-07-17, PR #55).** `scripts/tests/__snapshots__/visual-parity-promoted/<kind>.json` pins all 199 promoted identities across the 12 registered kinds and all six locations; `visual-parity.json` owns only its 11 validation-reason cases after the lossless U0 migration, and no permanent cross-file equality assertion survives it. An intentional renderer change rebaselines only through `npm run parity:rebaseline` with a declared `--scope` covering `changed`/`added`/`removed`, a Git-derived per-delta cause, and a committed receipt; added or removed identities with no corresponding `banks/**` change fail as identity drift. The one-time bootstrap is permanently unavailable. Review tiers, proof surfaces, and rebaseline procedure: `Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md` — do not restate them here.

**Gemini's standing restrictions (cross-references principles 3, 5, 8, 18, 22 above):** raw-volume generation only, never direct canonical edits (principle 5); flag-only review in the forward case lane, never compiler, never mutation (principle 8/18); demoted from every content-judgment audit lane (Jun 26 — templated, non-pair-specific reconciliations required Luke's independent re-research to trust, versus self-verifying verbatim-evidenced Claude/Codex lanes). If an irreducible producer-clean residual ever forces a Gemini audit lane, any row whose reconciliation is not pair-specific and does not quote the keyed rule (EN+ZH) is auto-rejected to re-review, never accepted as a dismissal.

**Study-session distribution:** the category weight table and sampler-rule detail this section used to restate in prose now live only in code (`NCLEX_CATEGORY_WEIGHTS` in `src/schema.ts`; `src/sessionSampler.ts`) per principle 10 above. Full original table and calibration narrative: archived.

**Session artifacts (implemented spec pointers, not open work):** `Archive/Fixtures/promotion-gate-spec.md` (principles 1–4, operationalized); presentation normalization (implemented 2026-06-12, the rebaseline vehicle for principle 16 — no standalone spec file survives; see `lib/presentation-normalization.ts` and `scripts/tests/presentation-normalization.ts`); `Archive/root-specs-2026-06-18/census-spec.md`; `Archive/study-session-weighting-spec.md`; `Archive/root-cleanup-2026-06-24/tts-queue-builder-codex-spec.md` and `Archive/root-cleanup-2026-06-24/tts-cost-report-codex-spec.md` (principle 20, parked); `Archive/root-cleanup-2026-06-30/exam-layout-extraction-and-tests-codex-spec.md`; `Archive/root-cleanup-2026-06-30/standalone-visual-review-layout-codex-spec.md`; `Archive/Fixtures/shrimp-visual-sweep-spec-v3.md`.
