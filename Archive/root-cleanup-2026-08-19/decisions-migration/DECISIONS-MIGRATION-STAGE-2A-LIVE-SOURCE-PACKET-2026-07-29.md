# Stage 2a live source packet — deterministic review material

**Non-authoritative preparation.** This packet contains mechanically recovered source material only. It does not choose target headings, statements, dates, optional fields, attachment structure, index summaries, or constitutional wording; those remain architect work.

- Baseline: `d499cc1d0916e03830489ec9cd0324cd1a203a73`
- Manifest order source: ratified target outline
- Live records: 65
- Kind totals: 37 P / 6 R / 19 I / 3 T
- Frozen destination for every record: `STAY`
- Boundary token: `ARCHITECT REVIEW` marks source text whose exact semantic boundary is not mechanically established by the frozen artifacts.
- E037 accounting: rule 1 contributes to E039a/P8; rule 2 contributes to both E002/P2 and E006/P5.
- E036 live-tail accounting: bytes excluded from the E036 archive span are supplied in E043a context, alongside the E037 target contributions.
- E043 split accounting: E043a includes the live `opus*` deterministic-routing rule and the `claude_*` exclusion; E043b remains archive-only.

## 01 — E001

- Source entry ID(s): `E001`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P1`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P1 Answer placement owned by code
- Legacy anchor(s): line 87, bytes [7776,8570)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**1. Answer placement is owned by code, not the model. Status: ACTIVE.**
A deterministic, item-ID-seeded shuffle applied at the promotion step owns option/answer placement; the model never places or orders an answer. Forcing incident (the regression case any future positional-integrity tooling should still detect): an audit found the correct MCQ option landed in position D only ~3% of the time against a uniform 25% — LLMs are biased samplers that write the correct answer first and confabulate distractors around it, clustering correct answers into early positions. The same clustering affects select-all correct-option ordering, so this governs positional bias across every item type, not just MCQ. Owner: `lib/shuffle.ts` (FNV-1a seed + Fisher-Yates), applied by `scripts/promote.ts`.

````

## 02 — E002

- Source entry ID(s): `E002`, `E037` merge contribution
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P2`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `—`
- Frozen source heading: P2 Independent review scoped to judgment
- Legacy anchor(s): line 90, bytes [8570,9412)
- Fixed merge contribution: E037 rule 2 (fixed contribution to both targets):
2. Every active generation lane declares producer provenance and independent-review routing (principle 2).

- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**2. Independent review is scoped to judgment, mechanical work may self-certify. Status: ACTIVE (narrowed 2026-07-14).**
Independent review is required when correctness depends on semantic judgment, clinical interpretation, provenance, or contract interpretation. Purely mechanical work may be certified by deterministic checks and targeted smoke tests in the same implementation session, when those checks have an independent null and do not merely confirm the author's intent.

Strict independent review stays required for: clinical judgments and answer keys; canonical generated content; migrations and dispositions; schema/data-contract interpretations; source-dependent claims. Not required for: exact file moves; generated censuses; deterministic formatting; one-line render ordering; and similarly mechanical, fully testable changes.

````

## 03 — E003

- Source entry ID(s): `E003`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P2`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `—`
- Frozen source heading: P2 spec-conformance/content-review split
- Legacy anchor(s): line 95, bytes [9412,10344)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
Kept — the spec-conformance/content-review split (2026-07-09 extension): when Claude authors a remediation spec and Codex implements it, Claude cannot certify the implementation (matching the spec is not evidence of being correct), but a seat blind to the spec cannot certify it either (it has no null to fail against). The two checks stay split — content review goes to the gate seat, which re-derives each disposition from source and standing rules; spec-conformance verification stays with the architect who wrote the spec. Forcing incident (kept, compact): a `>150 seconds` aPTT in a staged candidate passed schema validation, the flowsheet gate, the applicator dry-run, and a 100% checker-seat content adjudication, because the defect lived in `parseMeasurementValue`'s comparator-strip *code* — the artifact-checking seat had no reason to read code. Full narrowing rationale and the original absolute wording: archive.

````

## 04 — E004

- Source entry ID(s): `E004`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P3`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `—`
- Frozen source heading: P3 Deterministic core; capped residual
- Legacy anchor(s): line 97, bytes [10344,11231)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**3. Deterministic core; LLM only for the capped semantic residual. Status: ACTIVE.**
Counting, distributions, permutation integrity, and template repetition all have known nulls and belong in scripts that return identical verdicts every run. Reserve model judgment for what genuinely needs semantics (clinical inferability, distractor plausibility), run it only on items the deterministic layer flags, and cap the batch — this keeps verdicts reproducible and token spend bounded. Applied: the non-MCQ bias audit is an offline handoff, not a live integration — the repo emits a deterministic queue/prompt, validates returned JSONL, and merges semantic findings without letting them modify Layer A; no API key or live model call belongs in the repository. A completed one-time proposal-only in-harness adjudication exception and the topic-licensing rulings it produced are archived.

````

## 05 — E005

- Source entry ID(s): `E005`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P4`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `—`
- Frozen source heading: P4 Rationales position-agnostic, bilingual
- Legacy anchor(s): line 100, bytes [11231,11639)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**4. Rationales are position-agnostic — bilingual. Status: ACTIVE.**
A rationale references option *content* ("furosemide is contraindicated because…"), never a letter or ordinal/spatial position ("Option D", "the first choice"). A rationale that never names a position cannot carry a stale answer-key reference after a shuffle, in either English or Simplified Chinese (选项A, 第一个, 以上 …).

````

## 06 — E006

- Source entry ID(s): `E006`, `E037` merge contribution
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P5`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `—`
- Frozen source heading: P5 Generated ≠ reviewed
- Legacy anchor(s): line 103, bytes [11639,12062)
- Fixed merge contribution: E037 rule 2 (fixed contribution to both targets):
2. Every active generation lane declares producer provenance and independent-review routing (principle 2).

- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**5. Generated ≠ reviewed. Status: ACTIVE (narrowed 2026-07-14).**
No model-generated learner-facing clinical content becomes canonical without independent content review and the promotion pipeline. Raw model output stages in `banks/banks-raw/`, passes validation + audit + source-check, then promotes to a canonical `banks/*.json` with a `BANK-REVIEW-LEDGER.md` entry; the generating model never reviews its own batch.

````

## 07 — E007

- Source entry ID(s): `E007`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P5`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `AUTHORIZING`; execution `—`
- Frozen source heading: P5 Narrowing note (named-model policy)
- Legacy anchor(s): line 106, bytes [12062,12410)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
Narrowing note: named-model restrictions (Gemini is raw-volume only, small batches, never direct canonical edits, and is demoted from any audit/judgment role — see §8) are current lane policy, not the universal definition of generated-vs-reviewed. They remain active as lane policy; this principle states the constitutional floor beneath them.

````

## 08 — E008

- Source entry ID(s): `E008`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P6`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `—`
- Frozen source heading: P6 Visuals deterministic; curated-image lane
- Legacy anchor(s): line 108, bytes [12410,13512)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**6. Visuals are deterministic and data-derived; curated licensed imagery has a separate lane. Status: ACTIVE (narrowed 2026-07-14 — resolves a direct conflict with `AGENTS.md`).**
Deterministic, data-derived visuals are the default for diagrammatic and numeric clinical cues. AI-generated medical imagery is prohibited. Curated licensed clinical imagery may enter only through a separate provenance, licensing, accessibility, and clinical-review lane. Every question-level stimulus remains load-bearing: a visual whose removal leaves the answer unchanged is decorative and therefore invalid. Each renderer ships `selfCheck` cross-consistency assertions and registry conformance tests.

The prior wording ("no raster assets, no external images... ever") directly conflicted with `AGENTS.md`'s existing "a visual must be deterministic data-derived **or a curated licensed image**" allowance. No curated-image lane exists in code today — the `QuestionVisual` kind union is entirely deterministic renderers — so this principle states the permitted policy, not a claim that the lane is implemented.

````

## 09 — E009

- Source entry ID(s): `E009`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P7`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `ADVISORY`; execution `—`
- Frozen source heading: P7 Precision over volume
- Legacy anchor(s): line 113, bytes [13512,13744)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**7. Precision over volume. Status: ACTIVE.**
In any audit, five fully-evidenced findings beat thirty probable ones. Verbatim evidence, an honest reconciliation attempt, and explicit confidence/dismiss discipline are the standard.

````

## 10 — E010

- Source entry ID(s): `E010`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P10`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P10 Study sessions mirror exam distribution
- Legacy anchor(s): line 116, bytes [13744,14789)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**10. Study sessions mirror the exam's content distribution; difficulty is exam-sim-only. Status: ACTIVE (narrowed 2026-07-14).**
Default Study sampling follows NCLEX category weighting and guards against narrow-topic clustering. Strict exam simulation is a separate product mode. Case studies are excluded from the weighted draw, mirroring the real exam's fixed, separately-counted case-study allotment. Difficulty adaptivity is deliberately a separate, deferred axis — see the parked `test`/`adaptive` modes in §6.

Moved to code — verify there, not here: the category weight table is `NCLEX_CATEGORY_WEIGHTS` in `src/schema.ts`; the exact session count, floor threshold, priority visual allowlist, and diversity-penalty constants are `src/sessionSampler.ts`'s `DEFAULT_FLOOR_KIND_PRIORITY` / `floorThreshold` / `alpha` / `beta`. Full prior narrative (weight table restated in prose, sampler-rule paragraph, calibration history) archived — restating it here would be exactly the duplicated-definition risk principle 27(d) warns about.

````

## 11 — E011

- Source entry ID(s): `E011`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P11`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P11 Visual arithmetic machine-checked gate
- Legacy anchor(s): line 121, bytes [14789,15922)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**11. Visual arithmetic is a machine-checked gate, not a trusted assertion — and it carries no engine. Status: ACTIVE.**
For every visual kind whose answer turns on a computed value (`io_record` totals/balance, `medication_label` dose/volume/rate, `device_screen` pump math, `burn_map` %TBSA/Parkland), the load-bearing numbers are typed on the visual spec, the question's inputs and keyed answer live in audit-only `meta`, and `selfCheck` recomputes the answer from spec + meta and asserts exact equality (after a declared rounding wherever division is involved). A mismatch is a *build failure*, not a content note. The recompute is deliberately small — each kind exposes an *enumerated* set of one-line, same-unit derivations. We do not parse free-text doses or build a unit-conversion/dosage engine; a derivation needing cross-unit conversion (mg↔mcg, mg/kg, mcg/kg/min, body-weight dosing) is out of scope for that kind, not a reason to grow the engine. This is principle 3 (deterministic core) and principle 6 (visuals necessary) made concrete for the chart/label/screen tier; human review still owns clinical validity.

````

## 12 — E012

- Source entry ID(s): `E012`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P15`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P15 Bank patches raw-scoped, declarative
- Legacy anchor(s): line 124, bytes [15922,16386)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**15. Bank patches are raw-scoped and declarative. Status: ACTIVE.**
`scripts/patch-raw.ts` writes only under `banks/banks-raw/`. Canonical files are read-only except via the explicit `--allow-canonical --reason` in-place mode, which forces a ledger entry. Patch ops are declarative (`before`→`after`, precondition-checked) — there is deliberately no arbitrary-mutate primitive, because mechanical fixes belong in patches and semantic fixes belong in review.

````

## 13 — E013

- Source entry ID(s): `E013`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P15`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P15 App: op names a field path
- Legacy anchor(s): line 127, bytes [16386,18274)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**Application — a declarative op names a field path, not a record (2026-07-22).** "Declarative" means the op identifies the exact field path it mutates together with the `before`→`after` values *for that path*. A record-scoped string replacement is not a declarative op even when it declares a before and an after: it rewrites every occurrence in the record, including fields the op never named.

*Forcing evidence.* Across the terminal-sentence remediation manifest, seven `dropdown_cloze` items carry the flagged stem text a second time inside `clozeStem` — the functional response surface. On one of them the collision is language-asymmetric: the English anchor is unique in the record because `clozeStem.en` differs by a single article, while the Chinese anchor collides because `clozeStem.zh` is identical to the stem terminal. No uniform record-level rule is safe, and a serialize-and-replace implementation would have destroyed the response surface on those rows while reporting success.

Under principle 26 the preserved-surface proof is the independently enforced precondition: a patch must independently prove every learner-facing and scoring field outside its authorized mutation surface unchanged, enforced by something other than the op's own declaration. For the terminal-sentence dropdown repairs that preserved surface was `clozeStem`, dropdown bindings, options, and keys; the surface is named per work unit, since a different authorized repair may legitimately mutate a stem together with a related field, and most item types do not carry those particular surfaces at all. Moved to code — verify there, not here: the field-path mechanism is the `path` segment array in `scripts/patch-raw.ts`, including its `{ id }` / `{ refId }` selectors, which are the only means of addressing an embedded record since op identity resolves against top-level questions alone.

````

## 14 — E014

- Source entry ID(s): `E014`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P16`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P16 Answer-pattern bias presentation-first
- Legacy anchor(s): line 133, bytes [18274,19722)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**16. Answer-pattern bias is presentation-layer first, content-layer only where shuffling can't reach. Status: ACTIVE (narrowed 2026-07-14 — corrects a prior self-contradiction; amended 2026-07-15 — see the population amendment below).**
*Positional* tells (option order, dropdown index, matrix column, ordered-response scramble depth) carry no clinical meaning and are repaired mechanically by a deterministic, ID-seeded permutation. *Distributional* tells (SATA correct-count concentration, ordered-response template repetition) are properties of the item content itself and cannot be shuffled away — they are repaired only through future authoring or a deliberate targeted replacement/regeneration pass, never by hand-editing answer logic in reviewed canonical items. Incidental dilution from ordinary new content is acceptable but is **not** considered remediation: genuine distributional debt is frozen, not self-healing, and clears only through a deliberate targeted regeneration decision. (This sentence formerly cited "the standing global distributional FAILs" as that debt. They were not — see the 2026-07-15 amendment below.)

The audit's `fix_class` encodes exactly this fork: `SHUFFLE_AT_PROMOTION` is mechanical and automatable; `REGENERATE` is a non-blocking content-design backlog item. Live constants are named once, in the amendment below; verify them against `scripts/audit/non-mcq-bias-lib.ts`, never against this file.

````

## 15 — E015

- Source entry ID(s): `E015`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P16`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P16 Amendment: canonical file not a population
- Legacy anchor(s): line 138, bytes [19722,22368)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**Amendment to 16 (2026-07-15) — a canonical file is not a learner-visible population.**
Distributional checks measure concentration in the population the learner actually draws from: the bundled bank. A canonical `banks/*.json` is an authoring-provenance boundary, not a population — no learner draws from `lab-canonical`. Two consequences, ratified against the PR #48 evidence base. First, a global distributional verdict stands on its own statistic and does not inherit a per-file failure; per-file distributional verdicts are retained as authoring-hygiene advisories only. Positional and mechanical checks continue to inherit, because a positional tell in any file is a real tell in the bundled corpus regardless of which file carries it. Second, a distributional verdict requires enough observations to mean anything: `sata_count_min_n` and a minimum n derived from `template_repeat_max_share` gate both checks to `INSUFFICIENT` below the floor. The prior `sata_missing_count_fails` rule is removed outright — it conflated bin *coverage* with *bias*, and failed every non-empty SATA bank in the live corpus because every bank lacked at least one demanded bin, including banks with no meaningful concentration. Bin coverage remains reported as a diagnostic and is not audit debt.

This is a correction, not a softening under principle 27: no forcing incident is recorded in the active governance or archived audit-design materials reviewed. The missing-bin failure rule and absent minimum-n gates entered audit v2.0 as design-time defaults rather than recorded responses to an observed failure. The evidence that retired them is that they produced no true positives — every FAIL they generated was an arithmetic floor, a file boundary, or a missing bin, and the one surviving real signal (`visual-canonical` SATA, n=11 at 0.909) is found by the concentration threshold alone. Principle 16's core is unchanged and unrelaxed: distributional tells are still content properties, still unshufflable, still clear only through deliberate authoring or targeted regeneration, and incidental dilution is still not remediation.

Live constants (verify against `scripts/audit/non-mcq-bias-lib.ts`, not here): `audit_version 2.1.0`, `max_cell_deviation_pp: 8`, `sata_count_degeneracy: 0.70`, `sata_count_min_n: 8`, `scramble_min_n: 8`, `template_repeat_max_share: 0.15`. The ordered-response template minimum is derived from the share limit, not stored. `scramble_min_n` and `sata_count_min_n` are independent knobs that currently coincide at 8; they are not interchangeable, and collapsing them would couple two rules that must move separately.

````

## 16 — E016

- Source entry ID(s): `E016`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P16`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `ADVISORY`; execution `—`
- Frozen source heading: P16 Standing authoring note
- Legacy anchor(s): line 145, bytes [22368,22670)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**Standing authoring note (non-blocking):** `visual-canonical` SATA is the sole surviving distributional signal. Vary correct counts where clinical truth naturally permits. This is not retire-and-replace — retiring necessity-gated visual items to move a histogram would violate principles 6 and 25.

````

## 17 — E017

- Source entry ID(s): `E017`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P17`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P17 Scoring polytomous; retention full-marks
- Legacy anchor(s): line 147, bytes [22670,23124)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**17. Scoring is exam-style polytomous; retention is full-marks. Status: ACTIVE.**
Grading returns `ItemScore { earned, possible }` per the NGN families. Partial credit feeds the session score and per-item feedback only; spaced repetition resurfaces any item below full marks (`earned === possible`). Explicitly out of scope: threshold-based retention, graded-SRS ease from partial scores, rationale/dyad scoring, and `ordered_response` partial credit.

````

## 18 — E018

- Source entry ID(s): `E018`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P19`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P19 Rationale visuals are explanation figures
- Legacy anchor(s): line 150, bytes [23124,24133)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**19. Rationale visuals are explanation figures, not stimuli. Status: ACTIVE.**
`rationale.visuals` is an answer-revealed teaching slot reusing existing deterministic visual kinds, rendered after the correct rationale and before per-choice rationales. Structural kind validation runs on them, but item-type placement and `selfCheck` answer-coupling do not — an explanation figure may intentionally reveal a threshold, abnormality, or relationship the stem didn't require. The load-bearing-stimulus rules still apply in full to `question.visual`.

Schema-floor detection and export-envelope inference traverse all six supported visual locations,
including top-level and embedded rationale figures, through `src/schema.ts`'s shared full-schema
projection. Renderer parity consumes that same projection. The census artifact population remains a
separate, deliberately narrower four-location traversal under principle 28 and excludes rationale
figures by ratification; the two populations must not be unified.

````

## 19 — E019

- Source entry ID(s): `E019`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P21`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `—`
- Frozen source heading: P21 Repo-reading prompts carry semantic floor
- Legacy anchor(s): line 159, bytes [24133,25173)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**21. Generation prompts for repo-reading instances carry the semantic floor, not the schema. Status: ACTIVE (narrowed 2026-07-14).**
When the generating model can read the repo, the prompt defers all per-format *shape* to `AGENTS.md`/`NCLEX-Question-Schema.md` and restates none of it. It inlines only the semantic-quality floor the schema cannot infer: no-filler distractors; per-choice rationale for keyed answers *and* distractors; closed-world stems; no lazy "notify provider" key; unique ordered-response sequences; bounded highlight selection; gradeable closed-vocabulary blanks; clinical scope/monitorability; bilingual parity — plus the one mechanical caveat that is not auto-recoverable, a `correct` reference to a nonexistent id, which fails the whole item where normalization silently repairs enum casing. Reintroduce narrow per-format shape reminders only after a measured recurring failure — the default for repo-reading instances stays minimal. Historical validation metrics and the June experiment narrative: archived.

````

## 20 — E020

- Source entry ID(s): `E020`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P21`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P21 App: construction language off learner surface
- Legacy anchor(s): line 162, bytes [25173,26287)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**Application — construction language stays off the learner surface (2026-07-21).** `Closed-world` describes an authoring construction, not wording to show a learner: the governing order, protocol, threshold, or criteria must instead be stated naturally in the question. Author/checker scaffolding such as `source-pinned`, `source-supported`, and metaphorical `lane` language is naturalized before promotion without removing the embedded rule or changing the tested construct. Project-internal constraints also stay off learner surfaces: a producer rule such as “do not independently prescribe” must be embodied through clinical facts, choices, and rationale rather than appended to the stem as a disclaimer. The finite HIGH-confidence label lexicon remains enforced by [`lib/producer-vocabulary-leakage.ts`](lib/producer-vocabulary-leakage.ts); the separate constraint-shaped survey and narrow blocker are owned by [`lib/authorial-constraint-leakage.ts`](lib/authorial-constraint-leakage.ts). Broader directive shapes remain review-only because legitimate clinical scope teaching uses the same vocabulary.

````

## 21 — E021

- Source entry ID(s): `E021`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P21`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `—`
- Frozen source heading: P21 App: construction language functional not positional
- Legacy anchor(s): line 164, bytes [26287,28613)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**Application — construction language is functional, not positional (2026-07-22).** Construction language under this principle is any learner-facing prose whose *function* is to explain, justify, or defend how the item was built — a scope caveat, a sourcing note, a construct defense, an apology for an omission. It is identified by function, never by phrase and never by position. Terminal position is a **review heuristic only**: producers tend to append constraints, defenses, sourcing notes, and apologies after an otherwise complete item, which makes the final sentence the highest-yield place to look first. It does not define the defect, and a mid-stem construct defense is the same defect in a less convenient place.

*Forcing incident (compact).* Luke identified a PEP `ordered_response` stem whose closing sentence correctly distinguished source-patient testing, exposed-worker testing, and non-delay of PEP — clinically accurate, but reading as an adjudication note defending the authored sequence rather than as clinical instruction. A later RSBI item stated "This item asks only for documentation of the index; RSBI alone is not required to determine spontaneous-breathing-trial readiness," showing post-hoc construct defense as a general producer pattern rather than a single lapse. `gap_50_mc_03` then proved the family was not confined to prose: its stem rendered raw `{{1}}` / `{{2}}` placeholders to the learner (`The nurse should first {{1}} and then {{2}}.`) and duplicated the response demand already carried by `clozeStem`, so the same behavior also produced response-surface placement defects. Adjacent construct audits found the identical behavior expressed structurally — ordered responses forcing concurrent actions into a total order, fill-ins reducing interpretation to labels or arithmetic, dependent dropdown blanks, and decorative bowtie expansion. The common cause is a producer completing an item and then defending it; the defense surfaces as prose, as a placeholder, or as a distorted construct.

*Consequence for review design.* A positional filter is a sampling strategy, never a definition, and a clean terminal-sentence sweep is therefore not evidence that a corpus is free of construct defense. Remediation lane and evidence: `audit/terminal-sentence-remediation-2026-07-22/`.

````

## 22 — E022

- Source entry ID(s): `E022`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P23`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P23 Exam-like presentation is a renderer concern
- Legacy anchor(s): line 170, bytes [28613,30089)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**23. Exam-like presentation is a renderer concern; case identity and grading are not. Status: ACTIVE.**
The split layout (client chart left, active item right) is presentation only. A `case_study` stays one top-level session question — one `AnswerState.caseStudy`, one aggregate submit, one aggregate score; grading, storage, SRS, progress, flags, adaptive, and summary all key on the top-level `question.id`. Per-part submit / true unfolding reveal is deferred: it needs a storage-and-grading redesign (per-part result/completeness state, synthetic ids) and is revisited only if real-session observation shows aggregate submit is the fidelity bottleneck.

Stage visibility is cumulative and fail-open: both `stageId` and `answerableAfterStageId` show global exhibits plus all stages through the active part's stage; an absent or unresolved reference shows **all** stages, never fewer. Split eligibility is determined by measured visual geometry, not nominal item type — calibrated wide tracings stay full-width; squarish/vertical/compacted-table kinds join the standalone split allowlist only after a measured proof render, never a predicted one.

Moved to code/status — verify there, not here: the exact split allowlist is `STANDALONE_SPLIT_VISUAL_KINDS` in `src/examLayout.ts`; exact pixel/viewBox dimensions, proof-render sizes, and the current case-mapping coverage percentage belong to code and `PROJECT-HISTORY.md`'s current-status section, not this principle.

````

## 23 — E023

- Source entry ID(s): `E023`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P23`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P23 App: sparse shape-aware allocation
- Legacy anchor(s): line 177, bytes [30089,30817)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**Application — sparse shape-aware allocation (2026-07-19).** A kind-level split allowlist may be
refined by payload geometry after the same measured proof this principle requires. The measured
one-series `lab_trend` shape now takes the full-width route while the two-series shape remains in the
split. Structured measurements use an independent whole-payload density predicate: only a sole
one-panel × one-row × one-column payload receives a natural compact figure, while mixed-panel and
denser payloads retain the established full-width behavior. These are presentation allocations, not
new content-validity floors; principle 29's sparse-cardinality ruling and principle 24's prose-
supplement contract remain unchanged.

````

## 24 — E024

- Source entry ID(s): `E024`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P23`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `—`
- Frozen source heading: P23 App: embedded leaf planning not retirement
- Legacy anchor(s): line 186, bytes [30817,32618)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**Application — an embedded leaf is a planning unit, not a retirement unit (2026-07-22).** Principle 28 makes each embedded case leaf an individual *content-planning* unit carrying its own category, topic, item type, and difficulty. That does not make it an ordinary unit of removal. This principle keeps the `case_study` one top-level session question — one aggregate submit, one aggregate score, one keyed identity — so a case is authored, navigated, submitted, and graded as a single unit, and deleting one leaf is a case-level structural revision rather than a content edit.

Schema legality is not the test. `caseStudy.questions` requiring only two members means a five-part case still validates after losing one; validation says nothing about whether the surviving narrative, stage references, part cadence, and aggregate scoring still cohere. **Default to rewriting or replacing the leaf in place.** Where a leaf's construct is unsalvageable — for example an `ordered_response` whose corrected content would force genuinely concurrent actions into a total order — replace it with an appropriate non-serial format after source-backed construct and key re-derivation, subject to whole-case producer≠checker review of progression, stages, exhibits, leakage, part cadence, aggregate scoring, and narrative closure. Retire the **whole case** when no coherent replacement is feasible. No embedded-leaf retirement mechanism is authorized; schema legality is never the argument for minting one.

*Forcing incident.* The terminal-sentence remediation initially authorized retiring a single embedded `ordered_response` leaf on schema-legality grounds. Luke withdrew that authorization on 2026-07-22 as too harsh and structurally unprecedented, routing the row to whole-case rewrite instead.

````

## 25 — E025

- Source entry ID(s): `E025`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P24`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P24 Structured measurements values-only
- Legacy anchor(s): line 192, bytes [32618,34428)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**24. Structured measurements are values-only exhibit presentation; identity/display resolve at the edges. Status: ACTIVE (narrowed 2026-07-14).**
Structured measurements supplement source prose — they never replace it except for pure key-value exhibits reduced to a pointer. Clinical identity (which analyte, which population) is resolved before display, never inferred from magnitude alone: total and ionized calcium are distinct registry keys (not unit variants of one value) routed by explicit source label, because a bare "calcium 1.2 mmol/L" is a normal *ionized* value but a critically-low *total* one — identity must resolve before the unit conversion, since the same source unit converts differently per key. Source values and typed bounds (`bound: ">" | "<"`) are stored; canonical and display forms are derived at the rendering edge rather than redundantly persisted, so there is one place — not several — that can drift. Censored values remain typed, never coerced into a bare number. Non-rendering migration dispositions (`skip_serial`, empty extracts, `excludedValues`, `unitAliases`) are ledger/staging-only and never enter canonical banks.

Rule F (the `post_intervention` operative test) is owned by `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` — do not restate its test here.

Moved to code/schema — verify there, not here: exact fields, enums, columns, validation behavior, and allowlist contents live in `src/types.ts`, `src/schema.ts`, `src/measurementAllowlist.ts`, and `src/measurementUnitPolicy.ts`. Proof-batch composition, Batch 19/20 handling, fast-follow fishbone sequencing, and applicator procedure narrative are migration detail, now redundant with the closed migration's archive and the extraction contract's authority map — archived, not restated here.

````

## 26 — E026

- Source entry ID(s): `E026`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P25`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `—`
- Frozen source heading: P25 Necessity is a property of the artifact
- Legacy anchor(s): line 199, bytes [34428,35775)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**25. Necessity is a property of the artifact, not of every element in it. Status: ACTIVE.**
A redundant element is permissible inside a necessary, value-complete artifact — one that already carries every exact value the item turns on — when it adds a meaningful reading affordance such as pattern, direction, crossover, or divergence, rather than mere ornament. It never licenses an ornament that carries information absent elsewhere in the artifact, and it never licenses an artifact whose values the stem already states.

Two fences travel with this waiver and are load-bearing: the necessity gate stays unchanged and strict at the artifact level (if any single-timepoint tally resolves the item, it is the non-trend kind's item, not the waived kind's); and no exact-value item is authored on a waived-element kind (the table makes such an item *renderable*, but authoring it would prove the kind redundant — item briefs on a waived kind are pattern-only). Vendor ubiquity (a chart because a vendor's EHR draws one) is explicitly not a qualifying criterion. Reversal is cheap and specific: if review repeatedly catches an item answerable from one timepoint, the waiver is not the problem — the collapse gate is being ignored, and the kind closes to new content until it holds. Full `io_trend`/fishbone litigation chronology: archived.

````

## 27 — E027

- Source entry ID(s): `E027`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P25`
- Frozen classification: kind `P`; status `ACTIVE (vitals_trend clause superseded by E028)`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P25 App: composite trend artifacts
- Legacy anchor(s): line 204, bytes [35775,36934)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**Application — composite trend artifacts.** A deterministic trend artifact may present the same typed source data through both charts and a renderer-derived table when the views provide distinct reading affordances: charts expose direction, divergence, crossover, and trajectory; the table exposes exact values in a familiar flowsheet form. The artifact-level necessity gate remains unchanged — removing the complete chart-plus-table artifact must materially change answerability, and the item must still turn on multi-timepoint or cross-series reasoning, never one isolated cell. The table is never an independently authored second source of truth. Sparse cardinality is not a validity floor here by the same reasoning principle 29 applies to laboratory presentations — principle 7 plus principle 25's anti-ornament fence — not under principle 29 itself, which remains scoped to `lab_trend` and `structured_labs_panel`. First applied to `vitals_trend` by the 2026-07-18 composite readability repair: unit-pure scale-family panels, panel-exclusive reference bands, and a renderer-derived vital-sign flowsheet, with no schema or bank-content change.

````

## 28 — E028

- Source entry ID(s): `E028`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P25`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P25 Amendment: unified single-axis vitals_trend
- Legacy anchor(s): line 206, bytes [36934,38883)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**Amendment (2026-07-19) — unified single-axis presentation supersedes the multi-panel geometry for `vitals_trend`; the flowsheet is retained.** The 2026-07-18 unit-pure multi-panel geometry above is superseded as the default `vitals_trend` presentation by an Epic-style single unified chart (one time axis, one 0-based numeric axis, no unit family, interactive per-timepoint readout, legend-driven emphasis), with the renderer-derived flowsheet retained and visible beneath the chart. Forcing evidence per principle 27: a concluded A/B experiment in which the real user preferred the unified chart in ordinary study flow — not vendor familiarity, which principle 25 excludes as a qualifying criterion. Both arms shipped behind the persisted `vitalsChartStyle` setting (`epic` default; `panels` the preserved byte-identical composite, retained as the fallback) per `Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md`, the experiment's adjudicator being the user's experience as set at commission. What the unit-pure panels bought geometrically — per-vital resolution for low-magnitude vitals such as RR and temperature — the unified chart recovers instead through the retained flowsheet (exact values) plus the interactive readout, keeping principle 25's chart-carries-pattern / table-carries-exact-values division intact; the user's own request to keep the visible table is the signal that its exact-value affordance is load-bearing, not ornamental — exactly the redundancy principle 25 blesses. All principle-25 fences carry over unchanged: the artifact-level necessity gate, no exact-value item authored on the waived kind, and the table never an independently authored second source of truth. Reference bands, having no panels to be exclusive to, are single-series-only under the unified model; the multi-series unified chart shows none. No schema, bank-content, or clinical-range change.

````

## 29 — E029

- Source entry ID(s): `E029`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P25`
- Frozen classification: kind `P (was `R`)`; status `ACTIVE`; force-after `BINDING`; execution `PENDING`
- Frozen source heading: P25 Implementer note (reinstate flowsheet)
- Legacy anchor(s): line 208, bytes [38883,39231)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**Implementer note (not architect-gated).** The visible flowsheet beneath the Epic chart is a low-cost re-add of the existing, known flowsheet renderer code; the tested `epic` build used the hidden-table (Route C) disposition, so reinstate the visible flowsheet so shipped code matches this ratified model. No further architect input is required.

````

## 30 — E030

- Source entry ID(s): `E030`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P26`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P26 Disposition suppressing a check must be checked
- Legacy anchor(s): line 210, bytes [39231,40746)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**26. A disposition that suppresses a check must itself be checked. Status: ACTIVE (narrowed 2026-07-14).**
A disposition that removes material from a checked surface must have an independently enforced precondition; a producer may not silence its checker merely by declaring that nothing requires review. Generalized past its origin: every disposition that *removes* a value from the checked surface — an exclusion, a skip, an empty extract, an off-allowlist drop — purchases its silence by moving the value out of the checker's view, so each needs its own precondition enforced by something other than the disposition itself. Corollary: exclusion count is a **positive** signal for checker-seat sampling, not a negative one.

Forcing incident (kept, compact): a staged flowsheet record's sixteen `reason: "prior"` exclusions silently deleted an entire baseline electrolyte panel and still gated clean, because excluding a value moves it out of the checker's view by construction, and the clinical judgment the record was meant to support was graded on exactly the value that had been deleted. The gate was silent exactly where it needed to speak. The full six-ruling extraction-semantics amendment this incident produced (post-intervention tagging, `prior_no_current`, censored-value typing, per-analyte unit inference, population-precedes-rendering) is flowsheet-extraction detail now owned by `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` and the migration archive — archived here, not restated.

````

## 31 — E031

- Source entry ID(s): `E031`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P27`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `—`
- Frozen source heading: P27 Invariant softens only by naming its incident
- Legacy anchor(s): line 215, bytes [40746,41665)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**27. An invariant softens only by naming the incident it was minted from and showing the generating condition is gone. Status: ACTIVE.**
Every rule in this repo was minted by a failure — positional integrity from the D-correct-at-3% finding, quote hygiene from two independent corruption incidents, the single-definition `roundTo` from two kinds resolving the same dose math differently, producer≠checker from a field reaching four files without a version boundary. The endgame is exactly when ceremony feels most expensive and the memory of *why* is thinnest, so the ratchet needs a procedure, not a mood: **to relax an invariant, name the incident it was minted from and argue that the condition which produced it no longer holds.** "This feels heavy now" is not that argument. A rule that no longer earns its keep is retired on the record, with its incident cited, and marked `SUPERSEDED` rather than deleted.

````

## 32 — E033

- Source entry ID(s): `E033`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P28`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P28 Scored leaves govern planning
- Legacy anchor(s): line 220, bytes [42598,44464)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**28. Scored leaves govern content planning; session units govern delivery capacity and inventory. Status: ACTIVE (ratified 2026-07-16).**
Content-planning reports measure what is scored: standalone top-level questions plus embedded case-study questions, excluding case-study containers. Each embedded leaf contributes its own category, topic, item type, and difficulty; parent-case metadata is not evidence about the leaf. Category and topic distributions, difficulty and item-type distributions, target gaps, and generation prompt parameters therefore use only this scored-leaf population. `case_study` is a delivery container and cannot enter equal-average scored-item-type targets absent a separately ratified case-cadence target.

Delivery and inventory reports measure what can be served: top-level session units, separated into standalone questions and case containers, with case lengths and embedded-part totals reported alongside them. Standalone draw capacity and weighted-session constructibility stay on that operational population and may emit clearly labelled capacity warnings; those warnings never change the content-planning denominator. Visual inventory is a third, recursive artifact population rather than an alias for either question denominator.

Reason: the dual traversal introduced in PR #51 made both populations visible but did not establish which one governed planning, leaving competing target and prompt blocks that could direct generation from incompatible denominators. PR #52 makes the authority singular while retaining both legitimate analytical views. Executable owners: `lib/question-population.ts` (shared population and visual-artifact traversal), `scripts/census.ts` (canonical census shape and reconciliation), and `scripts/coverage-report.ts` (explicit call-site coverage views and the single scored-leaf planning output).

````

## 33 — E034

- Source entry ID(s): `E034`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P29`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P29 Sparse lab cardinality not a validity floor
- Legacy anchor(s): line 227, bytes [44464,47377)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
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

````

## 34 — E035

- Source entry ID(s): `E035`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P30`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P30 Lab reference bands adult-only; peds fail closed
- Legacy anchor(s): line 244, bytes [47377,50753)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
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

````

## 35 — E039a

- Source entry ID(s): `E039a`, `E037` merge contribution, shared context `E039b`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P8`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `—`
- Frozen source heading: P8 universal core
- Legacy anchor(s): lines 309–310, mechanically isolated core bytes [53204,53661); shared legacy paragraph; final slice byte is the U+0020 separator before E039b
- Fixed merge contribution: E037 rule 1 (fixed contribution):
1. Clinical truth and answer logic have an explicit upstream owner; every downstream transformation (translation, schema compilation, formatting) may read but never silently invent or change them.

- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.
- Boundary marker: **ARCHITECT REVIEW — confirm the semantic boundary inside the shared P8 paragraph; E039b begins at byte 53661.**

### Verbatim baseline source text

````text
**8. CONDITIONAL — clinical truth is authored once, upstream, and read-only downstream.**
The author model (currently Opus) owns the fact pattern, the correct actions, and the rationale; the compiler (currently GPT) translates and shapes into schema but never decides or alters which action is correct and never introduces clinical claims absent from the skeleton. A decision point too underspecified to yield an unambiguous item is dropped, not guessed.
````

### Shared-paragraph context

````text
**8. CONDITIONAL — clinical truth is authored once, upstream, and read-only downstream.**
The author model (currently Opus) owns the fact pattern, the correct actions, and the rationale; the compiler (currently GPT) translates and shapes into schema but never decides or alters which action is correct and never introduces clinical claims absent from the skeleton. A decision point too underspecified to yield an unambiguous item is dropped, not guessed. Extensions (condensed; full narrative archived): an optional author-supplied bowtie-synthesis zone lets the compiler assemble a standalone `bowtie` alongside the case without inventing the differential or irrelevant-parameter pools itself; case completion is accounted via a `_compileManifest`, never assumed — a genuinely underspecified decision point may be omitted only with a specific manifest entry, and promotion fails if authored points disappear unaccounted; Gemini is a flag-only review layer over the compiler's output, never a compiler itself, and never mutates JSON, prose, ids, answer keys, or Chinese translation.
````

## 36 — E044

- Source entry ID(s): `E044`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P20`
- Frozen classification: kind `P`; status `PARKED`; force-after `ADVISORY`; execution `INACTIVE`
- Frozen source heading: P20 Pronunciation/audio (PARKED)
- Legacy anchor(s): line 326, bytes [56919,58058)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**20. Pronunciation/audio is pre-generated, local-first, resolved by asset presence. Status: PARKED.**
The pre-generated-audio architecture itself — local-first bilingual TTS distribution, field-level content-hashed clips, asset-presence resolution — is inactive and not currently binding; it is subject to the universal runtime-audio invariant below, which stays active regardless of this principle's status.

Deprioritized 2026-06-22 on real user feedback (a GPT-conversation workaround currently suffices for the acute trigger), not killed — the queue/cost/per-field-clip machinery is fully built (`src/audio/normalizeForTts.ts`, `scripts/audio/build-tts-queue.ts`), so a restart is a lane decision, not a re-derivation. **Resumption triggers:** the workaround stops sufficing, integrated bilingual audio becomes wanted, or the project reaches a scale where a workaround-per-user no longer fits. Clip counts, minute/storage estimates, price-per-tier projections, provider/model/codec choices, Pages limits, R2 scaling plans, and queue implementation detail: archived — none of it is active constitutional content while parked.

````

## 37 — E074

- Source entry ID(s): `E074`
- Frozen destination: `STAY`
- Target section: `§4`
- Permanent ID already fixed: `P31`
- Frozen classification: kind `P`; status `ACTIVE`; force-after `BINDING`; execution `—`
- Frozen source heading: Gemini's standing restrictions
- Legacy anchor(s): line 387, bytes [74491,75189)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**Gemini's standing restrictions (cross-references principles 3, 5, 8, 18, 22 above):** raw-volume generation only, never direct canonical edits (principle 5); flag-only review in the forward case lane, never compiler, never mutation (principle 8/18); demoted from every content-judgment audit lane (Jun 26 — templated, non-pair-specific reconciliations required Luke's independent re-research to trust, versus self-verifying verbatim-evidenced Claude/Codex lanes). If an irreducible producer-clean residual ever forces a Gemini audit lane, any row whose reconciliation is not pair-specific and does not quote the keyed rule (EN+ZH) is auto-rejected to re-review, never accepted as a dismissal.

````

## 38 — E047c

- Source entry ID(s): `E047c`, shared context `E047a`/`E047b`/`E047c`
- Frozen destination: `STAY`
- Target section: `§5`
- Permanent ID already fixed: `R3`
- Frozen classification: kind `R`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: Vital-`sanity` found/temp-closed ruling
- Legacy anchor(s): shared line 339, bytes [59048,62233)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.
- Boundary marker: **ARCHITECT REVIEW — E047c shares one physical paragraph with E047a/E047b/E047c; frozen artifacts classify the semantic parts but do not pin exact byte boundaries.**

### Verbatim baseline source text

````text
- **Vital-sign `sanity` bounds are copied renderer validation envelopes, not authored plausibility bounds (Amendment 3A/R17, found 2026-07-10; `temp` closed 2026-07-15).** `MeasurementDef.sanity` is derived straight from `VITAL_DEFS[key].range` for six of seven vitals, a renderer validation envelope, not an authored physiologic-plausibility tripwire. For `temp` this is now repaired: the flowsheet gate's GATE 4 sanity ceiling is decoupled from the renderer's legacy `110` range and independently authored at `46.5 °C`, sourced to Slovis CM, Anderson GF, Casolaro A, "Survival in a heat stroke victim with a core temperature in excess of 46.5 C," *Annals of Emergency Medicine* (1982) — the highest of three documented full-recovery hyperthermia cases considered, chosen as the most conservative point within the engineering interval that both preserves the renderer's full `86–109 °F` authoring envelope and catches the full Fahrenheit-mis-staged-as-Celsius defect class. Luke's sign-off and architect ratification: 2026-07-15. Full reasoning, citations, and the engineering-interval derivation: `Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md`. Moved to code — verify there, not here: the ratified value is `VITAL_SANITY_MAX_OVERRIDES.temp` in `src/measurementAllowlist.ts`; the floor remains inherited from `VITAL_DEFS.temp.range.min` and is explicitly not ratified by this closure. The remaining six vitals (`hr`, `sbp`, `dbp`, `map`, `rr`, `spo2`) stay open under REVISIT, and `temp`'s own floor remains inherited and unratified: survey and pre-move sweep are complete (2026-07-11: zero flips in the promoted corpus under either tested probe), but no bound beyond the `temp` ceiling is ratified. The deterministic inventory across all seven vitals is now **complete and merged** (P3 survey, `audit/vital-sanity-bounds-survey-2026-07-17/survey-manifest.json`; independent classification review closed, provenance repair `9bf33b2`), and its stage-2 architect adjudication is ratified as §20 of `VITAL-SANITY-BOUNDS-P3-SURVEY-ARCHITECT-SPEC-2026-07-17.md`. Stage 3 closed 2026-07-24 with three per-side ratifications: SBP ceiling `400 mmHg`, RR ceiling `150/min`, and `spo2` floor `0%`. The governed population is bedside and charted flowsheet values, which is what selects `400` over the higher instrumented-measurement candidate. The separate `sao2` laboratory key stays provisionally at a floor of `50%`; pulse-oximeter evidence does not govern it, and the divergence is deliberate. A later implementation commission may add the ratified SBP and RR ceiling overrides and a per-side mechanism for the `spo2` floor; renderer envelopes must remain unchanged, `sanity.min` may not be removed or made optional, and a fresh corpus-impact survey is required. DBP and MAP ceilings are authorized for a separate bounded sourcing pass, with no number selected here. All other unratified sides, including the `temp` floor, remain provisional. No bound is authored from model memory at any stage. Evidence: `audit/vital-sanity-bounds-p3-stage-3-source-packet-2026-07-23.md`, `audit/vital-sanity-bounds-p3-stage-3-independent-checker-2026-07-23.md`.
````

## 39 — E047a

- Source entry ID(s): `E047a`, shared context `E047a`/`E047b`/`E047c`
- Frozen destination: `STAY`
- Target section: `§5`
- Permanent ID already fixed: `R5`
- Frozen classification: kind `R`; status `ACTIVE`; force-after `BINDING`; execution `PENDING`
- Frozen source heading: Vital-`sanity` SBP/RR/`spo2` ratifications
- Legacy anchor(s): shared line 339, bytes [59048,62233)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.
- Boundary marker: **ARCHITECT REVIEW — E047a shares one physical paragraph with E047a/E047b/E047c; frozen artifacts classify the semantic parts but do not pin exact byte boundaries.**

### Verbatim baseline source text

````text
- **Vital-sign `sanity` bounds are copied renderer validation envelopes, not authored plausibility bounds (Amendment 3A/R17, found 2026-07-10; `temp` closed 2026-07-15).** `MeasurementDef.sanity` is derived straight from `VITAL_DEFS[key].range` for six of seven vitals, a renderer validation envelope, not an authored physiologic-plausibility tripwire. For `temp` this is now repaired: the flowsheet gate's GATE 4 sanity ceiling is decoupled from the renderer's legacy `110` range and independently authored at `46.5 °C`, sourced to Slovis CM, Anderson GF, Casolaro A, "Survival in a heat stroke victim with a core temperature in excess of 46.5 C," *Annals of Emergency Medicine* (1982) — the highest of three documented full-recovery hyperthermia cases considered, chosen as the most conservative point within the engineering interval that both preserves the renderer's full `86–109 °F` authoring envelope and catches the full Fahrenheit-mis-staged-as-Celsius defect class. Luke's sign-off and architect ratification: 2026-07-15. Full reasoning, citations, and the engineering-interval derivation: `Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md`. Moved to code — verify there, not here: the ratified value is `VITAL_SANITY_MAX_OVERRIDES.temp` in `src/measurementAllowlist.ts`; the floor remains inherited from `VITAL_DEFS.temp.range.min` and is explicitly not ratified by this closure. The remaining six vitals (`hr`, `sbp`, `dbp`, `map`, `rr`, `spo2`) stay open under REVISIT, and `temp`'s own floor remains inherited and unratified: survey and pre-move sweep are complete (2026-07-11: zero flips in the promoted corpus under either tested probe), but no bound beyond the `temp` ceiling is ratified. The deterministic inventory across all seven vitals is now **complete and merged** (P3 survey, `audit/vital-sanity-bounds-survey-2026-07-17/survey-manifest.json`; independent classification review closed, provenance repair `9bf33b2`), and its stage-2 architect adjudication is ratified as §20 of `VITAL-SANITY-BOUNDS-P3-SURVEY-ARCHITECT-SPEC-2026-07-17.md`. Stage 3 closed 2026-07-24 with three per-side ratifications: SBP ceiling `400 mmHg`, RR ceiling `150/min`, and `spo2` floor `0%`. The governed population is bedside and charted flowsheet values, which is what selects `400` over the higher instrumented-measurement candidate. The separate `sao2` laboratory key stays provisionally at a floor of `50%`; pulse-oximeter evidence does not govern it, and the divergence is deliberate. A later implementation commission may add the ratified SBP and RR ceiling overrides and a per-side mechanism for the `spo2` floor; renderer envelopes must remain unchanged, `sanity.min` may not be removed or made optional, and a fresh corpus-impact survey is required. DBP and MAP ceilings are authorized for a separate bounded sourcing pass, with no number selected here. All other unratified sides, including the `temp` floor, remain provisional. No bound is authored from model memory at any stage. Evidence: `audit/vital-sanity-bounds-p3-stage-3-source-packet-2026-07-23.md`, `audit/vital-sanity-bounds-p3-stage-3-independent-checker-2026-07-23.md`.
````

## 40 — E049

- Source entry ID(s): `E049`
- Frozen destination: `STAY`
- Target section: `§5`
- Permanent ID already fixed: `R2`
- Frozen classification: kind `R`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: CBC conventional-first + SI-paren, analyte-aware
- Legacy anchor(s): line 347, bytes [62908,64005)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
*Amendment (2026-07-05) — refined to conventional-first + SI-in-parentheses, analyte-aware.* Dogfooding showed "never SI" was too rigid in two ways: conventional reporting is itself multi-form (magnesium/calcium legitimately carry `mEq/L`, not just `mg/dL`, as a real US form — not SI), and some SI-looking units (lactate `mmol/L`, ammonia `µmol/L`, ionized calcium `mmol/L`, troponin-T `ng/mL`) are the normal US reporting form and must not be mechanically inverted. The governing rule is **analyte-aware**: each analyte has its own conventional form(s), keyed by (analyte, sourceUnit) in one sourced conversion table, never by unit token alone. Consequences: accepted *source* units became permissive again (extraction preserves byte-exact `sourceUnit`, including SI `×10⁹/L` where source states it, per Rule C in the extraction contract); display became a separate policy layer (conventional-primary, optional SI-paren) consumed by both `lab_trend` and `structuredMeasurements`; and one sourced conversion table serves GATE 4 sanity, display-paren generation, and prose normalization.

````

## 41 — E070

- Source entry ID(s): `E070`
- Frozen destination: `STAY`
- Target section: `§5`
- Permanent ID already fixed: `R1`
- Frozen classification: kind `R`; status `ACTIVE`; force-after `AUTHORIZING`; execution `EXECUTED`
- Frozen source heading: Standalone bowtie direct generation
- Legacy anchor(s): line 382, bytes [71397,72065)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- **Standalone bowtie may be generated directly, not only harvested from a case skeleton (2026-07-02).** The case-origination requirement was mis-scoped: it protected the compiler from inventing the differential/irrelevant-parameter pools, but bowtie is standalone-only by construction regardless of origin. A direct standalone-bowtie generation lane runs through the normal raw→cross-model review→promote→ledger pipeline on equal footing with every other item type, under the same semantic floor as the case-embedded synthesis zones. This does not relax producer≠checker or the case-embedded compiler's discipline for bowties that do arise inside a skeleton.
````

## 42 — E072

- Source entry ID(s): `E072`
- Frozen destination: `STAY`
- Target section: `§5`
- Permanent ID already fixed: `R4`
- Frozen classification: kind `R`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: Promoted visual parity per-kind baseline
- Legacy anchor(s): line 384, bytes [72488,73454)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- **Promoted visual parity is a committed per-kind baseline over every full-schema visual location (closed 2026-07-17, PR #55).** `scripts/tests/__snapshots__/visual-parity-promoted/<kind>.json` pins all 199 promoted identities across the 12 registered kinds and all six locations; `visual-parity.json` owns only its 11 validation-reason cases after the lossless U0 migration, and no permanent cross-file equality assertion survives it. An intentional renderer change rebaselines only through `npm run parity:rebaseline` with a declared `--scope` covering `changed`/`added`/`removed`, a Git-derived per-delta cause, and a committed receipt; added or removed identities with no corresponding `banks/**` change fail as identity drift. The one-time bootstrap is permanently unavailable. Review tiers, proof surfaces, and rebaseline procedure: `Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md` — do not restate them here.
````

## 43 — E073

- Source entry ID(s): `E073`
- Frozen destination: `STAY`
- Target section: `§5`
- Permanent ID already fixed: `R6`
- Frozen classification: kind `R`; status `ACTIVE`; force-after `AUTHORIZING`; execution `PENDING`
- Frozen source heading: PR vs post-merge CI coverage distinct
- Legacy anchor(s): line 385, bytes [73454,74491)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- **Pull-request and post-merge CI coverage are distinct; a gate addition requires measured evidence of incremental pre-merge value (ratified 2026-07-24).** A check running only after merge may protect the deploy but does not prevent the bad merge; equally, "already covered post-merge" is not by itself a finding of redundancy. Ratified for a later implementation commission and authorizing nothing else: `npm run build`; `test:topic-population`; `test:topic-license` as detector-regression coverage only; `test:topic-vocabulary`; and an exact-byte drift check for `docs/topic-vocabulary.md`. Rejected or deferred: a separate `tsc -b` step (`npm run build` already runs it); fatal live topic-license enforcement; a duplicate promoted-bank validator; and generalized regeneration or drift-checking of historical audit artifacts. Any further PR-gate expansion needs its own measured evidence and owner ratification. Evidence: `audit/ci-coverage-survey-2026-07-23.report.md`, `audit/ci-coverage-survey-2026-07-23.independent-checker.md`.

````

## 44 — E038

- Source entry ID(s): `E038`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `ADVISORY`; execution `—`
- Frozen source heading: §5 Current producer assignment callout
- Legacy anchor(s): line 307, bytes [52641,53204)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**Current producer assignment (verify against `PROJECT-HISTORY.md`, not assumed timeless from this file):** as of 2026-07-18, GPT-5.6 Sol is the current producer for every `gpt_`-prefixed lane (evergreen standalone items, episodic direct case-study commissions, and new visual-kind content), replacing the prior GPT producer outright. The retired case-skeleton compiler is not an active lane. GPT-5.6 Sol remains "GPT" for review-routing purposes. A future producer substitution updates only this callout, never the principle numbers or their obligations below.

````

## 45 — E043a

- Source entry ID(s): `E043a`, containing contexts `E036` and `E043b`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: P22 `opus*` routing rule (still in force)
- Legacy anchor(s): line 300 live tail bytes [51342,51986) plus line 322 post-E043b bytes [56543,56891)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.
- Boundary marker: **ARCHITECT REVIEW — select the exact E043a statement boundary from the discontiguous live-tail context. Both the `opus*` deterministic-routing rule and the `claude_*` exclusion are present.**

### Verbatim baseline source text

````text
 The `opus*` case-ID routing in `scripts/audit/early-bank-semantic-layer-a.ts` (principle 22) is unaffected and stays in force, since it routes already-promoted cases already carrying that ID prefix, not new production. The replacement episodic direct-GPT pathway is specified by `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md` and topic-specific commissions. The C/D rerun established that it can produce gate-worthy cases with bounded checker repair; use it when a topic or load-bearing visual calls for case form. It is not a standing bulk-generation lane, and every output remains subject to principle 5 and independent promotion review.

[DISCONTIGUOUS SOURCE CONTINUATION]
 Deterministic routing: `opus*` ids (matcher `/^opus\d*_/`) tag producer `gpt`, tier `low` (`scripts/audit/early-bank-semantic-layer-a.ts`) — identical to `gpt_case_` items, which is what they effectively are. This does **not** extend to `claude_*` items Claude authored directly, which remain Claude-produced and route to a non-Claude reviewer.
````

### Shared-paragraph context

````text
**Lapse note (2026-07-18; pathway disposition 2026-07-19):** Luke retired the Opus-skeleton → GPT compile/fact-check → Gemini flag-review → Claude gate pipeline in favor of wholesale case_study production in the current GPT model. Per §2, CONDITIONAL principles lapse with their governing lane and need no separate repeal, so principles 8, 9, 12, 18, and 22 below no longer bind. They are retained verbatim for historical reference — do not apply them to any new lane without re-ratifying. The `opus*` case-ID routing in `scripts/audit/early-bank-semantic-layer-a.ts` (principle 22) is unaffected and stays in force, since it routes already-promoted cases already carrying that ID prefix, not new production. The replacement episodic direct-GPT pathway is specified by `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md` and topic-specific commissions. The C/D rerun established that it can produce gate-worthy cases with bounded checker repair; use it when a topic or load-bearing visual calls for case form. It is not a standing bulk-generation lane, and every output remains subject to principle 5 and independent promotion review.
The producer principle 2 protects against self-review is the compiler (currently GPT), not the prose author (currently Opus) — an `opus*` case is checker-conflicted for the compiler and for the flag-review layer, but **not** for Claude, since the clinical substance an audit evaluates is the compiler's, not the prose author's. Deterministic routing: `opus*` ids (matcher `/^opus\d*_/`) tag producer `gpt`, tier `low` (`scripts/audit/early-bank-semantic-layer-a.ts`) — identical to `gpt_case_` items, which is what they effectively are. This does **not** extend to `claude_*` items Claude authored directly, which remain Claude-produced and route to a non-Claude reviewer.
````

## 46 — E054

- Source entry ID(s): `E054`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: INV Runtime audio: no client-embedded secret
- Legacy anchor(s): line 366, bytes [67121,67556)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- **Runtime audio must not require a client-embedded secret or a live API call; an absent pre-generated asset must fail safely to the supported fallback (`speechSynthesis`).** This binds regardless of principle 20's parked status below — it is categorical under GitHub Pages, not prudential: Vite inlines `VITE_`-prefixed vars as plaintext into the published bundle, so any client-embedded key would be world-readable on the deploy.
````

## 47 — E055

- Source entry ID(s): `E055`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: INV Bilingual EN / zh-CN parity
- Legacy anchor(s): line 367, bytes [67556,67609)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- Bilingual EN / zh-CN parity on all displayed text.
````

## 48 — E056

- Source entry ID(s): `E056`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: INV `question.topic` English-only
- Legacy anchor(s): line 368, bytes [67609,67792)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- `question.topic` is English-only — a navigational label, not study content. Enforced in `validateBankObject` (Tier 0): CJK in `topic` fails loudly and is never silently stripped.
````

## 49 — E057

- Source entry ID(s): `E057`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: INV JSON quote hygiene parse-time gate
- Legacy anchor(s): line 369, bytes [67792,68108)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- **JSON quote hygiene is a parse-time gate, and JSON shape is edited programmatically, never retyped.** Structural tokens are ASCII `"` only; Chinese quotation marks are valid only inside `zh` values. The dominant corruption source is editing, not generation. Full quote-safety mechanics: `docs/AGENTS-RUNBOOK.md`.
````

## 50 — E058

- Source entry ID(s): `E058`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: INV Question IDs globally unique
- Legacy anchor(s): line 370, bytes [68108,68236)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- Question IDs are globally unique across bundled banks, including embedded case-study leaves — gate-enforced by `audit:ids`.
````

## 51 — E059

- Source entry ID(s): `E059`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: INV Raw-draft prefix routing
- Legacy anchor(s): line 371, bytes [68236,68713)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- **Raw-draft filename prefix routes to its canonical bank by a fixed table**, `CANONICAL_PREFIXES` in `lib/canonical-routing.ts` — the executable source of truth; do not hand-maintain a prose copy of the table. The eight original per-kind canonicals are complete, frozen content sets, not active generation targets; `visual-canonical.json` is the only live visual generation target, and a visual kind added after the original roadmap does not mint a new per-kind canonical.
````

## 52 — E060

- Source entry ID(s): `E060`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: INV Canonical merges deterministic
- Legacy anchor(s): line 372, bytes [68713,68821)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- Canonical merges are deterministic and gated via `npm run consolidate`; canonicals are never hand-merged.
````

## 53 — E061

- Source entry ID(s): `E061`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `BINDING`; execution `—`
- Frozen source heading: INV Runtime static/offline/`file://`
- Legacy anchor(s): line 373, bytes [68821,68922)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- Runtime stays static, offline, and `file://`-compatible. No server or live model call after build.
````

## 54 — E062

- Source entry ID(s): `E062`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: INV Schema versions ordered token, minor ≤ 9
- Legacy anchor(s): line 374, bytes [68922,69436)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- **Schema versions are an ordered token, not semver — the minor component never exceeds 9.** Every version string must sort correctly under naive numeric, lexicographic, and index comparison; `schemaVersionAtLeast` (over a private index) is the single legal comparison primitive. Current supported set: verify against the `SchemaVersion` union in `src/types.ts`, not against any version list restated in prose (including `NCLEX-Question-Schema.md`'s own restatement, which must itself be checked against code).
````

## 55 — E063

- Source entry ID(s): `E063`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `ADVISORY`; execution `—`
- Frozen source heading: INV Schema changes rare and deliberate
- Legacy anchor(s): line 375, bytes [69436,69478)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- Schema changes are rare and deliberate.
````

## 56 — E064

- Source entry ID(s): `E064`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: INV Shared visual numeric helpers single def
- Legacy anchor(s): line 376, bytes [69478,69635)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- Shared visual numeric helpers have a single definition: `fmt`, `fmtNum`, `roundTo` live in `src/visuals/primitives/graphPaper.ts`; no kind redefines them.
````

## 57 — E065

- Source entry ID(s): `E065`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: INV Case-study exhibit ids one namespace
- Legacy anchor(s): line 377, bytes [69635,69844)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- Case-study exhibit ids share one namespace across the whole case (top-level `exhibits` plus every stage); `caseStudy.exhibits` may be empty if the case's opening content is meant to be entirely stage-gated.
````

## 58 — E066

- Source entry ID(s): `E066`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: INV Category targets are test-plan weights
- Legacy anchor(s): line 378, bytes [69844,70144)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- Category targets are the current test-plan weights project-wide, not uniform, for both the weighted study draw and the generation coverage backlog (`NCLEX_CATEGORY_WEIGHTS`, single map). Item-type balance stays uniform by design — the test plan weights Client Needs categories, not item formats.
````

## 59 — E067

- Source entry ID(s): `E067`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: INV Bank composition is a floor problem
- Legacy anchor(s): line 379, bytes [70144,70497)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- **Bank composition is a floor problem, not a balance problem.** No release gate enforces balance; the rule is that no format may fall below the depth its sampling path requires (the `floorThreshold` viability gate), and above that floor, topic fit and item quality override census arithmetic — no weak item is authored merely to close a census gap.
````

## 60 — E068

- Source entry ID(s): `E068`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `BINDING`; execution `—`
- Frozen source heading: INV Repository-state hygiene mechanism-specific
- Legacy anchor(s): line 380, bytes [70497,70847)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- **Repository-state hygiene is mechanism-specific.** GitHub-reading agents can see only committed and pushed inputs; disk-reading agents operate against an explicit local branch/worktree snapshot and must preserve unrelated changes. No agent may assume local and remote state are identical. The binding operational requirements live in `AGENTS.md`.
````

## 61 — E069

- Source entry ID(s): `E069`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: INV Some topics shared across categories
- Legacy anchor(s): line 381, bytes [70847,71397)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- **Some topics are deliberately shared across NCLEX categories, not misclassified.** `Skin & Wound Care` spans Basic Care and Comfort, Reduction of Risk Potential, and Safety and Infection Prevention and Control; `Transfusion & Blood Products` spans Safety and Infection Prevention and Control, Pharmacological and Parenteral Therapies, Reduction of Risk Potential, and Physiological Adaptation (`src/topics.ts`). Do not "fix" an item's category to make it match a topic's single most-obvious category — the topic is intentionally cross-category.
````

## 62 — E071

- Source entry ID(s): `E071`
- Frozen destination: `STAY`
- Target section: `§6`
- Permanent ID already fixed: *(invariant, by name)*
- Frozen classification: kind `I`; status `ACTIVE`; force-after `BINDING`; execution `EXECUTED`
- Frozen source heading: INV Highlight structural bias gate schema-level
- Legacy anchor(s): line 383, bytes [72065,72488)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
- **Highlight's structural bias gate is schema-level, not audit-level.** Every `highlight` item must include at least one selectable distractor segment (Tier 0 validation) — "highlight everything" cannot enter a bank. Segment order is clinically meaningful passage order and is never shuffled; the non-MCQ positional audit has no applicable position null for highlight, so semantic cue quality stays content-review work.
````

## 63 — E045

- Source entry ID(s): `E045`
- Frozen destination: `STAY`
- Target section: `§7`
- Permanent ID already fixed: *(thread, by name)*
- Frozen classification: kind `T`; status `PARKED`; force-after `ADVISORY`; execution `—`
- Frozen source heading: Translation-friction scoring (PARKED)
- Legacy anchor(s): line 331, bytes [58058,58439)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**Translation-friction scoring. Status: PARKED.** Folding reveal-tap friction into the targeted-review sampler stays open until real dogfooding sessions show reveal concentration that is genuinely topic/category-specific and miss-predictive beyond the existing missed-topic signal. The instrument (telemetry, export, dev panel) already ships; only the scoring decision is parked.

````

## 64 — E046

- Source entry ID(s): `E046`
- Frozen destination: `STAY`
- Target section: `§7`
- Permanent ID already fixed: *(thread, by name)*
- Frozen classification: kind `T`; status `PARKED`; force-after `ADVISORY`; execution `—`
- Frozen source heading: test/adaptive exam-condition modes (PARKED)
- Legacy anchor(s): line 333, bytes [58439,58952)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.

### Verbatim baseline source text

````text
**`test` and `adaptive` exam-condition modes. Status: PARKED.** Both are non-default half-exam placeholders — they force `languageMode: "off"` at session creation and still reveal the answer, rationale, and per-choice breakdown immediately after each submit — pending a decision to spec each as a real exam simulator (deferred feedback, no translate-all, strict language mode) or remove them. Deferred sub-question: whether a strict exam environment should ever permit a post-submit full translation reveal.

````

## 65 — E047b

- Source entry ID(s): `E047b`, shared context `E047a`/`E047b`/`E047c`
- Frozen destination: `STAY`
- Target section: `§7`
- Permanent ID already fixed: *(thread, by name)*
- Frozen classification: kind `T`; status `REVISIT`; force-after `ADVISORY`; execution `—`
- Frozen source heading: Vital-`sanity` DBP/MAP/temp-floor/`sao2` open
- Legacy anchor(s): shared line 339, bytes [59048,62233)
- Fixed merge contribution: None.
- Architect-owned target choices: exact heading, statement, date, fields, optional omissions, core/attachment placement and ordinal, and entry-index summary.
- Boundary marker: **ARCHITECT REVIEW — E047b shares one physical paragraph with E047a/E047b/E047c; frozen artifacts classify the semantic parts but do not pin exact byte boundaries.**

### Verbatim baseline source text

````text
- **Vital-sign `sanity` bounds are copied renderer validation envelopes, not authored plausibility bounds (Amendment 3A/R17, found 2026-07-10; `temp` closed 2026-07-15).** `MeasurementDef.sanity` is derived straight from `VITAL_DEFS[key].range` for six of seven vitals, a renderer validation envelope, not an authored physiologic-plausibility tripwire. For `temp` this is now repaired: the flowsheet gate's GATE 4 sanity ceiling is decoupled from the renderer's legacy `110` range and independently authored at `46.5 °C`, sourced to Slovis CM, Anderson GF, Casolaro A, "Survival in a heat stroke victim with a core temperature in excess of 46.5 C," *Annals of Emergency Medicine* (1982) — the highest of three documented full-recovery hyperthermia cases considered, chosen as the most conservative point within the engineering interval that both preserves the renderer's full `86–109 °F` authoring envelope and catches the full Fahrenheit-mis-staged-as-Celsius defect class. Luke's sign-off and architect ratification: 2026-07-15. Full reasoning, citations, and the engineering-interval derivation: `Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md`. Moved to code — verify there, not here: the ratified value is `VITAL_SANITY_MAX_OVERRIDES.temp` in `src/measurementAllowlist.ts`; the floor remains inherited from `VITAL_DEFS.temp.range.min` and is explicitly not ratified by this closure. The remaining six vitals (`hr`, `sbp`, `dbp`, `map`, `rr`, `spo2`) stay open under REVISIT, and `temp`'s own floor remains inherited and unratified: survey and pre-move sweep are complete (2026-07-11: zero flips in the promoted corpus under either tested probe), but no bound beyond the `temp` ceiling is ratified. The deterministic inventory across all seven vitals is now **complete and merged** (P3 survey, `audit/vital-sanity-bounds-survey-2026-07-17/survey-manifest.json`; independent classification review closed, provenance repair `9bf33b2`), and its stage-2 architect adjudication is ratified as §20 of `VITAL-SANITY-BOUNDS-P3-SURVEY-ARCHITECT-SPEC-2026-07-17.md`. Stage 3 closed 2026-07-24 with three per-side ratifications: SBP ceiling `400 mmHg`, RR ceiling `150/min`, and `spo2` floor `0%`. The governed population is bedside and charted flowsheet values, which is what selects `400` over the higher instrumented-measurement candidate. The separate `sao2` laboratory key stays provisionally at a floor of `50%`; pulse-oximeter evidence does not govern it, and the divergence is deliberate. A later implementation commission may add the ratified SBP and RR ceiling overrides and a per-side mechanism for the `spo2` floor; renderer envelopes must remain unchanged, `sanity.min` may not be removed or made optional, and a fresh corpus-impact survey is required. DBP and MAP ceilings are authorized for a separate bounded sourcing pass, with no number selected here. All other unratified sides, including the `temp` floor, remain provisional. No bound is authored from model memory at any stage. Evidence: `audit/vital-sanity-bounds-p3-stage-3-source-packet-2026-07-23.md`, `audit/vital-sanity-bounds-p3-stage-3-independent-checker-2026-07-23.md`.
````
