# DECISIONS.md Archive — 2026-07-14 Constitution Pass

This file preserves the full forcing-incident narratives, exact historical metrics, superseded
prior wordings, and closed-out chronology that were condensed out of `DECISIONS.md` during the
2026-07-14 architectural-constitution pass (status vocabulary expanded to
ACTIVE/CONDITIONAL/PARKED/REVISIT/SUPERSEDED; every numbered principle re-litigated and tagged;
conditional forward-generation-lane principles grouped; principle 20 parked). Nothing here is
current authority — read `DECISIONS.md` for what's binding today. This file exists so a future
agent asking "why did the old wording say X" or "what was the full incident behind this rule" can
still find the answer, per principle 27's own discipline (retain superseded material, don't delete
it).

Sections below are keyed to the `DECISIONS.md` principle number they were condensed from.

---

## Principle 2 — original wording and narrowing rationale

**Original absolute wording (pre-2026-07-14):** "The producer is never the checker. The program that
generates or shuffles content cannot be the program that verifies it — a checker sharing a run or
codebase with the producer cannot independently fail the producer's output. The only thing they may
share is a pure, deterministic transform (e.g. the shuffle function) that the checker re-runs to
assert equality."

**Why it was narrowed.** Read literally and absolutely, this wording would require independent
review even for changes with no judgment content at all — an exact file move, a regenerated census,
a one-line render-order fix that a deterministic test already proves correct. The mature
verification architecture (`AGENTS.md`'s risk-tiered verification table, itself ratified under
principle 27) already differentiates by risk class; principle 2's wording had not caught up. The
2026-07-14 pass narrowed it to bind independent review to judgment-dependent work specifically,
while explicitly re-affirming it for every category where it actually matters (clinical judgments,
canonical content, migrations, schema/contract interpretation, source-dependent claims).

---

## Principle 3 — GPT-5 in-harness extension and topic licensing decisions (completed, historical)

**Principle 3 extension — proposal-only topic residual passes may use in-harness GPT-5 (Jun 18).**
For the post-S01 residual topic rerun, in-harness GPT-5 adjudication was accepted instead of an
external queue/ingest loop because the safety boundary was proposal-only output: complete dry-run
manifest, exact category/topic diff preview, non-Gemini classifier metadata, and Luke approval of
the exact manifest before any canonical write. This exception did not authorize Gemini
classification, automatic `topics.ts` writes, or removing the stop gate. This was a one-time,
completed pass, not a standing generation mode.

**Topic licensing decisions from residual dry-run review (Jun 18).** `Skin & Wound Care` is shared
across Basic Care and Comfort, Reduction of Risk Potential, and Safety and Infection Control so
pressure-injury/wound staging, prevention, monitoring, and skin-integrity rows can keep their real
NCLEX category instead of moving to BCC solely to reach the topic. `Transfusion & Blood Products` is
a shared topic across Safety and Infection Control, Pharmacological and Parenteral Therapies,
Reduction of Risk Potential, and Physiological Adaptation so transfusion reactions and blood-product
roles do not scatter across weak cardiovascular/lab/procedural buckets. (This fact remains live and
is now a compact bullet in `DECISIONS.md`'s "Other standing invariants" appendix — it is archived
here for its full original context only.)

---

## Principle 10 — original weight table and sampler-rule paragraph

**Original principle 10 body:** "A study session is a representative slice of the NCLEX-RN, not a
flat random draw over whatever was generated. The default recommended practice session draws 50
questions (≈ the 52 scored content items of a minimum-length real exam, where the distribution
actually resolves) weighted to the 2026 test-plan Client Needs distribution, with a within-category
diversity penalty so no narrow topic or visual kind (the EKG-glut case) fills its category's slots,
and a per-kind floor guaranteeing ≥1 of each well-stocked visual kind. Difficulty adaptivity is a
*separate axis* — the real exam is CAT-adaptive on difficulty — and is deliberately deferred to a
future exam-simulation mode; study mode never adjusts on difficulty. Case studies are excluded from
the weighted draw (on the real exam they are a fixed allotment counted independently of the
content-area percentages). Spec: `Archive/study-session-weighting-spec.md`."

**Study-session distribution (2026 NCLEX-RN Test Plan, effective April 2026).** Category weights for
the weighted study draw, keyed by the `Category` literals in `src/types.ts`. Midpoint targets from
the published test plan; sum to 1.00. The same map (`NCLEX_CATEGORY_WEIGHTS`, homed in
`src/schema.ts`) drives generation targeting in `coverage-report.ts`. NCSBN permits ±3% per category,
so these are targets, not constraints. ("Safety and Infection Control" is the schema label for the
2026 plan's "Safety and Infection Prevention and Control," 13%.)

| Category | Weight |
|----------|:------:|
| Management of Care | 0.18 |
| Pharmacological and Parenteral Therapies | 0.16 |
| Physiological Adaptation | 0.14 |
| Safety and Infection Control | 0.13 |
| Reduction of Risk Potential | 0.12 |
| Health Promotion and Maintenance | 0.09 |
| Psychosocial Integrity | 0.09 |
| Basic Care and Comfort | 0.09 |

**Sampler rules** (full detail in `Archive/study-session-weighting-spec.md`, with the Jun 26
calibration in the live code): largest-remainder rounding to the target count; floor set = the
explicit priority allowlist `["rhythm_strip", "lab_trend", "vitals_trend"]` filtered by
`floorThreshold >= 10` as a viability gate, active only at N≥40, reserved from within the
distribution, silently dropped when a listed kind's pool is too thin; soft diversity penalty on
repeated `topic`/visual `kind` (α=β=1). The count-derived floor selector was retired because content
volume is not an exam-frequency signal.

**Verified 2026-07-14: this table and these constants still match live code exactly**
(`NCLEX_CATEGORY_WEIGHTS` in `src/schema.ts`; `DEFAULT_FLOOR_KIND_PRIORITY`, `floorThreshold`,
`alpha`, `beta` in `src/sessionSampler.ts`). They were removed from the live principle body not
because they're wrong, but because restating a fact code already owns is exactly the duplicated-
definition risk principle 27(d) exists to prevent — if the code ever changes, this archived copy
will NOT update, and that's fine: it's provenance, not a second source of truth.

**Sampler floor/penalty constants — resolved 2026-06-26 (full calibration rationale).**
`alpha = beta = 1` in the study-session sampler was retained after checking the live
case-study-excluded sampler denominator: rhythm strips are ~32/231 (~14%) of Physiological
Adaptation, and Cardiovascular Disorders are ~72/231 (~31%), so the existing soft penalty
sufficiently suppresses repeat topic/visual clusters without a hard cap. `floorThreshold = 10`
remains as a viability gate, but it no longer selects every visual kind above the line: content
growth had pushed the old count-derived floor from the intended three kinds to eight
(`medication_label`, `device_screen`, `burn_map`, `io_record`, and `mar` crossed the threshold),
proving bank counts track generation volume rather than exam frequency. The floor is now the
explicit, threshold-gated priority allowlist `["rhythm_strip", "lab_trend", "vitals_trend"]`,
reserved in that order and deduped for caller overrides.

---

## Principle 16 — non-MCQ bias audit rollout history

**SATA count null — resolved for Layer A; now the dominant residual, routed to generation.** The
non-MCQ bias audit does not pretend the number-correct distribution is uniform. It uses the v2
spec's deterministic degeneracy rule instead: fail when one count covers more than 70% of SATA items
or when a plausible count is absent. After the 2026-06-12 presentation normalization,
`correct_count_distribution` is the largest remaining FAIL surface (global n=255, plus most banks
with usable n) and is unreachable by shuffling — every generator converges on the same count
concentration independently. Generation prompts carry an explicit SATA correct-count constraint
going forward (spread counts across the legal 2…N−1 range per batch, no single count exceeding ~50%
of SATA items). Existing FAILs are not edited. **Correction (2026-07-02):** the earlier framing that
these "dilute as constrained new content lands" assumed high-volume generation the endgame is not
doing — at marginal top-up volume the per-batch constraint prevents new degenerate batches but does
not meaningfully erode the existing global FAIL. Treat the distributional backlog as frozen debt,
not self-healing.

**Ordered-response template repetition — content backlog, metric key confirmed.** The second
distributional residual (`template_repetition`, global n=217 WARN after the Jun 26 gate wiring).
Trips when one option-order→correct-rank signature exceeds `template_repeat_max_share = 0.15`:
`permutationTemplate(question)` is `question.options.map(o => correctRank.get(o.id) ?? -1).join(",")`.
Unreachable by shuffling. Generation prompts require varied ordered-response framings
(prioritization vs. procedure-sequence vs. escalation-sequence), varied option counts (4/5/6), and
varied clinical scaffolding. These WARNs are backlog, frozen debt per the 2026-07-02 correction, not
self-healing.

**Non-MCQ bias audit — mechanical gate enforced by default (2026-06-26).** `npm run audit` prints a
Tier-2 split routed by `fix_class` — `SHUFFLE_AT_PROMOTION` is the mechanical axis (real `FAIL`
status, blocking by default in local audit, local promote, and CI), `REGENERATE` is a non-blocking
distributional `WARN`, and `RATIONALE_REPAIR` stays owned by the Tier-1 `audit:references` gate.
Verified canonical baseline (2026-06-26): `audit:non-mcq-bias:mechanical` PASS;
`audit:non-mcq-bias:distributional` WARN with 12 records. Promote-time normalization
(`normalizeBankPresentations`) was completed in the Phase 2 Schema-Hardening Step A closeout
(2026-06-24). A loose thread (a `scramble_depth` FAIL attributed to a bank that no longer existed
standalone, having been folded into `gpt-canonical.json`) was resolved 2026-06-26 as a stale
audit-report artifact, not a live bug.

**`max_cell_deviation_pp = 8` — calibrated, retained.** The effect-size floor on positional
uniformity checks held up against the 2026-06-12 post-normalization baseline: every positional check
with usable n passed at 8pp (global SATA position n=536/412, dropdown index n=78/346, matrix
column n=698/205/77, matrix row n≥48 across bands, ordered scramble depth at the bank level). No
positional check sits in a marginal band that 8pp is hiding, so the value stays.

**Promotion gate — fully implemented (rollout history).** `lib/shuffle.ts` (FNV-1a seed +
Fisher-Yates) owns all option ordering; `scripts/promote.ts` applies it to every draft in
`banks/banks-raw/`; `.github/workflows/promotion-gate.yml` runs `npm run audit` on every PR to main.
The 63 pre-existing `audit:references` positional-language hazards across all four original
canonical banks were cleared on Jun 09 (rationale-wording fixes only — no answer keys, option IDs,
or clinical meaning changed). `audit:references` now passes at zero, with no carried backlog.

**Current shuffle batch — completed.** The initial Gemini MCQ shuffle and rationale repair was
verified by Claude Code (Sonnet) against the pre-shuffle git state and merged to main (PR #1).

---

## Principle 20 — full pronunciation/audio architecture (parked)

**20 (original body). Pronunciation/audio is pre-generated, local-first, and resolved by asset
presence — never a client-embedded key.** Bank text gets real bilingual TTS instead of browser
`speechSynthesis`, which garbles medical terminology (the `striae` failure that triggered this).
Audio is produced by an offline pipeline stage; it is never synthesized at runtime against a live
key. Under GitHub Pages this is categorical, not prudential: Vite inlines `VITE_`-prefixed vars as
plaintext into the published bundle, so any client-embedded key is world-readable on the github.io
deploy. The Gemini key lives only in the local generation environment.

*Distribution is local-first.* The full bilingual library is generated locally and delivered to the
single user as a folder (USB or local directory), served alongside the build by a local static
server so audio loads same-origin and fully offline. The github.io deploy ships without the audio
folder and therefore serves the `speechSynthesis` fallback automatically. Pages' 1 GB published-site
cap, 100 GB/mo bandwidth, 10-minute build timeout, and not-for-commercial-SaaS TOS all make it the
wrong host for the audio payload; local-first sidesteps every one. Actual library size is measured
at the end of the first generation session, not estimated.

*The resolver is forward-compatible by construction.* Clips are field-level — one file per `stem`,
`option`, `rationale.correct`, `rationale.byChoice` entry, `testTakingStrategy`, and glossary term —
never whole-item concatenation: Gemini TTS drifts past a few minutes, and per-field clips let a
single corrected field be re-voiced without regenerating the item. Filenames are deterministic and
content-hashed (`{itemId}.{field}.{lang}.{hash}.opus`; terms keyed by a hash of `termEn`), so
re-voiced text gets a new name and stale audio can never play under fixed text. A root
`manifest.json` (key→hash) is fetched once and consulted in memory rather than probing files, and
the app reads everything through a single `AUDIO_BASE` constant. The runtime fallback branches on
asset presence, never on user identity or device: manifest-hit or successful load → pre-generated
audio; miss or `onerror` → `speechSynthesis`. Codec is Opus ~24–32 kbps mono (or AAC/`.m4a` for
zero-risk Safari/iOS); Gemini's native 24 kHz 16-bit PCM is transcoded in the pipeline and never
shipped (~48 KB/s, 10–16× larger). Generation dedups by content hash (shared terms voiced once) and
retries the known failure where the model returns a text token instead of audio and 500s on a small
random fraction of calls. Scaling keeps the package abstraction and swings `AUDIO_BASE` local →
Release asset → object storage (Cloudflare R2, no egress); at scale clips are fetched lazily
per-asset rather than as a monolithic download. Photographic clinical images are a separate track —
generated audio is clean-provenance, but real images carry licensing baggage and are a sourcing
decision before a packaging one; principle 6 already owns deterministic diagrammatic stimuli.

**Audio generation — deprioritized 2026-06-22 (user feedback; parked, not killed).** Shelved on real
feedback: she gets English pronunciation by conversing with GPT and it's working, so the acute
trigger (`striae`) is met outside the app for now. The workaround does not cover the fuller intent —
bilingual, in-app per-card audio, offline/deterministic — so the revisit trigger is one of: the GPT
workaround stops sufficing, integrated bilingual audio becomes wanted, or Flushing scale. The
machinery is fully in place, so a restart is a decision, not a re-derivation. Queue built:
**60,241 distinct clips · ~7,025 min · ~1.2–1.6 GB Opus** (`audio/manifest.queue.json`, ~25 MB,
gitignored/regenerable; field-walk reconciles to census 1558/721/2279). Full bilingual run ≈ **$210**
at Gemini 3.1 Flash TTS standard ($20/1M output audio, 25 tok/s; input negligible), **~$105** on
Batch (50% off), **~$53** on Batch + 2.5 Flash TTS ($10/1M). Cost is audio-seconds-driven — case
prose + the four per-item `byChoice` rationales dominate, terms are cheap — so ~$30 batched would
plausibly cover the terms + `rat.correct` tier outright. `scripts/audio/tts-cost-report.ts` (spec
`Archive/root-cleanup-2026-06-24/tts-cost-report-codex-spec.md`) quantifies cost-per-tier vs the
budget line. On revival: pick the lane (scope × model × batch) against the report + feedback, then
write the generation-pass spec (priority order + budget cap + Batch + skip-by-hash resume + retry on
the text-token-instead-of-audio failure). Storage is a non-issue local-first; only the generation
budget ever gated.

---

## Principle 21 — June experiment validation metrics

Validated 2026-06-22-b (GPT deepen round 3, the "trusted-agent" prompt): 29 items across 6 formats
promoted with zero schema errors and zero normalizer structural changes, against the prior deepen
batch that needed a deterministic fix script for `ngnSkill` casing and missing bilingual glossary
fields. Bound: these instances read the repo but cannot execute `validate-bank` or write to disk, so
the prompt asks for a downloadable file and an in-chat self-check, never an executed gate — the real
gate is the pipeline after the file lands. The per-format shape lines stay a cheap, targeted re-add
if a future round regresses on one specific type; the default for repo-reading instances is minimal.

---

## Principle 23 — content-payoff coverage note (historical, still low)

*Content, not the renderer, gates the case payoff.* Only ~12 of 102 staged cases have clean
part→stage mappings; ~88% fall to the all-stages fallback, so the chart-filtering benefit is
currently small. Backfilling correct mappings — and authoring a real first stage for the 6 `gpt_*`
cases whose first part referenced a non-existent `*_initial` stage (since removed to fallback) — is
a clinical-judgment content lane verified by `audit:stage-refs`, deferred until dogfooding justifies
it. Pure split/stage logic lives in `src/examLayout.ts` with `scripts/tests/exam-layout.ts` to lock
the cumulative/fail-open invariant. (Verify current percentage against `PROJECT-HISTORY.md` /
`audit:stage-refs` output, not this archived figure, if this becomes actionable again.)

---

## Principle 24 — full structured-measurements body and the 2026-07-09 six-ruling amendment

**24 (original body, schema 1.8, ratified 2026-07-07).** Optional `structuredMeasurements` on
`CaseStudyExhibit` (both `caseStudy.exhibits[]` and `stages[].exhibits[]`), additive to
`id/title/content/visual`. Shape is a wrapper of typed `panels[]` (`kind: "labs" | "vitals"`), each
with applicator-authored `columns[]` (`id` + optional bilingual `label`; the label carries the
source's panel/timepoint marker — "ED", "1600", "on admission" — and is never inferred from
`sourceSpan` at render time) and allowlist-keyed `rows[]`. The wrapper (not a single `kind` per
exhibit) is forced by two live facts: staged records mix vitals + stat labs + ABG in one panel, and
labs vs vitals render differently (fishbone vs flat). A value stores only `value` (byte-exact source
value) + `unit` (an accepted input unit for the key) + optional `context: "post_intervention"`. Not
stored: canonical value and display unit both derive at render via `measurementUnitPolicy`. A stored
`displayUnit`, and a proposed byte-exact `sourceUnitText`, were both rejected as fields no v1
consumer reads. Renders beside intact prose (supplement); prose reduces to a pointer only for
pure-KV exhibits, fail-loud if a non-KV exhibit blanks prose. No flags/ranges in v1 — a row carrying
either fails validation, because every `refBand` in `lab_trend/defs.ts` is an unverified placeholder.
Non-rendered dispositions are ledger/staging-only, never canonical. Assay identity precedes
rendering: `troponin_i`/`troponin_t` and `sao2`/`spo2` were split as structured-measurement-only
allowlist entries before any promotion, because label/cutoff/interpretation differ and the `spo2`
synonym collision already caused a real misclassification. Fishbone (labs snapshots): a labs panel
whose analytes occupy a recognized skeleton (CBC/BMP/CMP) renders as a fishbone, full or partial;
non-template analytes and all vitals render flat; trends never route here. The fishbone was a
net-new renderer built as a fast-follow — the schema/applicator/promotion proof shipped on the
existing flat table primitives first. Proof batch = 2 clean-KV records (replace path) + 3–5 reviewed
single-panel prose/scattered records (supplement path). The applicator is a deterministic dry-run
loader (match `caseId`/`exhibitId`, mutate, serialize, validate every target bank, regenerate
census), consuming Batch 20 for the serial redo and excluding failed Batch 19.

**Amendment (2026-07-09, Luke rulings) — extraction disposition semantics, censored values, unit
inference, and population.** Six rulings out of the Candidates 12/13 gate review, all v1-scoped:

- **`post_intervention` is a reassessment marker, not a co-location marker.** Tag a value only when
  it is explicitly presented as a reassessment following an intervention directed at *that
  measurement*, or a clearly framed treatment bundle. The forcing case: refeeding `stage_2_update`'s
  only preceding therapy is TPN initiation, the *cause* of the derangement rather than a response to
  it, so its values are untagged; `stage_3_update` ("After interventions, repeat labs") is tagged.
- **`prior` requires a same-key current value in the same record.** A value labeled prior/baseline
  with no same-key current sibling routes to a `prior_no_current` review/fail path — never silently
  into `excludedValues`. Where the earlier value is the exhibit's only reading, it keys as the
  current column and the column label carries the source's marker.
- **Censored values are typed, never coerced.** A source reporting a bound (`aPTT >150 seconds`) is
  not reporting a number; `parseMeasurementValue` returns `null` on `/[<>≤≥]/`, and the representation
  is an optional sibling `bound: ">" | "<"`. Sanity bounds become one-sided for bounded values; the SI
  parenthetical is suppressed; a bounded value is never compared against `refBand`.
  *Correction (2026-07-11):* the hypothetical hospital's aPTT reporting ceiling was subsequently
  standardized to 200 seconds and all cases reflect it; the `>150` references stay intact as
  provenance — that is the incident that minted the invariant, not the current hospital contract.
- **Absent units may be inferred per analyte, never from `canonicalUnit`.** The inference is authored
  per key via `MeasurementDef.inferredUnit`, never defaulted to the registry canonical — a
  canonical-unit default on the gallstone exhibit's bare `ionized calcium 4.0` would key it as
  `4.0 mmol/L` and pass sanity while being roughly triple the truth (source is `mg/dL`). `calcium`
  and `ionized_calcium` therefore carry no `inferredUnit`. Landed keys: `bun`, `creatinine`,
  `glucose`, `lactate`, `ast`, `alt`, `total_bilirubin`.
- **Population precedes pediatric rendering.** `structuredMeasurements.population` sits at the
  wrapper, not per-panel; an absent value behaves as adult only for non-pediatric records, and a
  pediatric case with `population` absent is a FAIL. Without this, pediatric-normal vitals/labs enter
  canonical against adult bands and get flagged as abnormal after the fact.
- **`uric_acid` ratified retroactively as structured-measurements-only; LDH rejected for v1.**
  `uric_acid` joins `troponin_i` and `sao2` as a structured-only allowlist entry — load-bearing as a
  Cairo-Bishop TLS criterion. LDH is prognostic rather than criterion and stays prose.

*Verification (2026-07-09).* A comparator sweep of every promoted `structuredMeasurements` value
across the Candidate 02A–11B lineage returned 0 hits, confirming the extractor preserves comparators
byte-exactly. The sweep covered promoted records only.

All of the above extraction-semantics detail now lives operationally in
`EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` (the authority map + Rule F) and
`EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md`; it is archived here only as the forcing-incident
record for why `DECISIONS.md` principle 24 reads the way it does.

---

## Principle 25 — full `io_trend`/fishbone waiver litigation

**Original 2026-07-06 ad hoc waiver (superseded).** The fishbone was granted a workflow-familiarity
waiver — clinicians are used to seeing lab panels in a fishbone shape, so the redundant diagram was
allowed even though every value was already in the table.

**25 (ratified 2026-07-09) — the durable replacement rule.** Principle 6 requires that a visual whose
removal leaves the answer unchanged is decorative and therefore invalid. Read element-wise, that
forbids any redundant presentation layer, including a chart drawn over a table of the same numbers —
because a value table is an informational superset of the chart plotted from it. Read artifact-wise,
the rule is about whether the *visual* carries information the stem does not state, and the
artifact-wise reading is correct: *A redundant element is permissible when it is additive over a
value-complete artifact* — the rendered visual carries every exact value the item turns on, and the
redundant element adds a reading affordance (pattern, direction, crossover, divergence) rather than
being the sole cue. This supersedes the ad hoc fishbone waiver and subsumes it on stronger grounds:
the fishbone qualifies because it preserves exact values, not because clinicians are used to seeing
one. Vendor ubiquity is explicitly not a qualifying criterion — Epic's diverging I/O chart is one
vendor's view, and `io_trend` (principle 25's first new consumer, schema 1.9) earns its composite
chart-over-table render because the table beneath it is value-complete, not because Epic draws it
that way.

Two fences are load-bearing and travel with the waiver: the necessity gate is unchanged and still
strict at the artifact level (for `io_trend`: valid iff collapsing the series to a single net balance
changes the answer — the waiver relaxes chart-vs-table, never visual-vs-no-visual); and no exact-value
items on a waived-element kind (the table makes "what was the net balance at 1200?" renderable;
authoring it is forbidden, because it would prove the trend kind redundant — item briefs on
`io_trend` are pattern-only: direction, divergence, crossover). The reversal trigger is cheap and
specific: if review repeatedly catches `io_trend` items answerable from one timepoint, the waiver is
not the problem — the collapse gate is being ignored, and the kind closes to new content until it
holds.

---

## Principle 27 — the 2026-07-12 pass's rejected alternatives and corrections of record

**Rejected.**
(a) *Fresh context is not independence.* The durable rule is producer≠checker on provenance, not
vendor — principle 22 already routes Opus skeleton cases as GPT-provenance for exactly this reason.
But a fresh-context reviewer from the generating family loses only its *memory* of the output, not
the correlated priors that produced it, and the errors this project cares about are systematic, not
memory artifacts. Proof, 2026-07-10: Codex audited the Schema 2.0 surface and missed the applicator's
hard-pinned `"1.8"`; a second GPT seat adjudicated that audit and missed it too, while writing that
the implementation shape was "apparently" already there. Two seats, one blind spot; the independent
seat found it on the first live read.
(b) *The read order stays four files.* Dropping `DECISIONS.md` to "relevant decisions when linked or
implicated" is unworkable because you cannot know a decision is implicated until you have read it —
the same 2026-07-10 review re-derived the ratified `schemaVersionAtLeast` rule as though it were
novel and proposed traversal tests that would have forced a floor retrofit this file explicitly
defers pending a bank-impact survey.
(c) *`PROJECT-HISTORY.md` is not demoted to orientation.* `CLAUDE.md` grants it override authority on
current-status facts; that conflict rule is load-bearing and stays.
(d) *The quote-safety two-mode summary is not compressed to a one-liner.* "Parse, mutate, serialize"
does not carry the two facts that actually prevent the bug — that corruption originates in *editing*
rather than generation, and that Chinese quotation marks are legitimate inside `zh` values while
ASCII `"` in structural position is not — nor the targeted-edit protocol. The forensic history moves
to the runbook; the discriminating rule stays.

**Corrections of record.**
*Bank composition is a floor problem, not a balance problem.* (Now a standing-invariant bullet in the
live file.) No release gate enforces balance (`census:check` gates census freshness only), and the
endgame rescope already carved census-named gaps out of the observation gate. But "the sampler
controls exposure, so composition is irrelevant" is false in the tails: the sampler's floor set drops
any kind failing the `floorThreshold >= 10` viability gate, and the diversity penalty needs pool depth
to penalize.

*The rationale-visual carve-out is already ratified* (principle 19: explanation figures validate in
exhibit mode, `selfCheck` answer-coupling does not run); only `AGENTS.md`'s absolute wording was
stale, which was a documentation sync, not a softening.

*Worktree isolation and clean-and-pushed are two different rules* (now a standing-invariant bullet in
the live file) — `AGENTS.md` already says to leave unrelated edits alone, while `CLAUDE.md`'s
clean/pushed requirement exists because the content-generating instances read GitHub rather than
disk. A dedicated branch does not fix a stale pushed snapshot.

---

## Now-closed flowsheet/extraction rulings (fully superseded by the closed migration + extraction contract)

These entries are retained only as forcing-incident provenance. Current authority for all of them is
`EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` (the extraction contract) and
`Archive/exhibit-flowsheet-migration-2026-07-13/` (the closed migration's chronology).

- **R9 pediatric detector — context provenance, not a general kinship/anaphora-memory rule
  (resolved 2026-07-13).** `detectPediatricContext` scans the staged exhibit's own text and
  case-wide context text with different strictness: local text keeps the full subject-scoping
  detector (including a bare noun+verb heuristic), while case-wide context text hard-triggers only
  on explicit subject-identity evidence. This resolved a false positive where a different exhibit's
  sentence about "the child" (the client's own son, introduced by kinship elsewhere in the case)
  forced a false subject-scoped FAIL onto the adult client's own vitals/labs exhibit.
- **Rule F carries no automatic carry-forward across stages (resolved 2026-07-13).** A measurement
  earns `post_intervention` only when its own record, or unambiguous sequencing directly governing
  that record, establishes a directed intervention preceded it — a prior stage's attribution does not
  persist merely because treatment may still be ongoing. Two corrections applied under this ruling:
  `16E-THA`'s POD3 creatinine tag (borrowed from POD2's own sentence) and
  `17C-REFEEDING`'s stage-60 phosphate tag (a bare later reading with no explicit connection to an
  earlier administration).
- **Baseline prior-only exclusions — closed under existing rules.** The refeeding baseline's 15
  PACU exclusions with no current same-key sibling were re-adjudicated as out-of-scope-silent
  (removed from `excludedValues`, retained in prose) rather than a `prior_no_current` fail, trading
  15 hard FAILs for ~15 advisory GATE 2 WARNs.
- **Enum-drift reconciliation — closed.** Live gate `EXCLUSION_REASONS` = `{prior, trend, serial,
  comparator}`; `comparator` (added 2026-07-09 for censored source values) is superseded for new
  extraction by the typed `bound` field, and is gate-accepted only for legacy/pre-2.0 staged
  artifacts.
- **`vitals_trend` rendered adult reference bands on pediatric clients (resolved 2026-07-10, merged
  to main).** `renderVitalsTrendSvg` never threaded `spec.population` into `VitalDef.normal`, so a
  pediatric item shipped a shaded "normal" band scaled to adult ranges despite the author declaring
  population twice. The keyed answer was unaffected in the one shipped instance (a rendering defect,
  not a content defect). Fix: the renderer treats only literal `"adult"`/absent as adult and
  suppresses the band otherwise; validation FAILs only when an author explicitly demands a band on a
  non-adult visual. A pediatric band *table* was explicitly rejected — age spans within `peds_child`
  are too wide for one band, and any future pediatric banding needs an age/age-band field, not a
  three-value population enum.
- **Structured-measurements display formatting (resolved 2026-07-10, merged to main).** Primary-unit
  source values preserve authorial precision (render the comma-stripped source string); converted
  values use numeric formatting. A secondary-unit parenthetical is suppressed only when both units
  resolve to the same known linear scale factor. Affine conversions (°F/°C) and unknown scale
  relationships fail toward displaying both.

---

## Visual panel primitive ordering (implementation-sequencing note)

**Visual panel primitive — U6 before U9 (ordering satisfied).** U6 shipped `renderFieldPanel` /
`measureFieldPanel` (the key→value panel/label layout, sibling to `renderDocTable`) inside its first
consumer, `medication_label`, following the build-the-primitive-in-its-first-consumer pattern
(`lineChart`→U2, `renderDocTable`→U4). It also landed the shared `fmtNum` / `roundTo` helpers in
`graphPaper.ts`. U9 `device_screen` now consumes these unchanged with `variant:"screen"`.

## Documentation drift / running census (why `scripts/census.ts` exists)

`PROJECT-HISTORY.md` and `BANK-REVIEW-LEDGER.md` snapshot counts drift from the banks on disk: the
2026-06-09 census had to be hand-run because the prose had gone stale, and it surfaced that
`capnography-canonical.json` was bundled but missing from the canonical list. Fix: `scripts/census.ts`
reuses `coverage-report.ts`'s counters, emits `census.json` (source of truth) plus generated
`BANK-CENSUS.md`, and is wired into `npm run audit` / CI so a stale committed census fails CI. Two
deterministic-layer bugs surfaced while speccing it: `coverage-report.ts` had no `--json` branch
(silently treated as a bank-file path); `normalizeTopic` stripped all non-ASCII, which would have
silently erased leaked Simplified-Chinese in `topic` (closed by the English-only-`topic` Tier-0
gate). Spec: `Archive/root-specs-2026-06-18/census-spec.md`.

**Coverage-report category target — implemented.** `coverage-report.ts` formerly measured category
under/over against a uniform `questions.length / categories.length`, inconsistent with the
test-plan-weighted draw. Reporting, census output, and the sampler now share
`NCLEX_CATEGORY_WEIGHTS`. Spec: `Archive/coverage-target-spec.md`.

## Gemini demotion from peer audit lane — full incident (Jun 26)

The Phase B coherence audit (0 contradictions across 104 pairs; merged report
`Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-25.md`) showed that lane
*convergence* on the verdict masked a lane-*quality* gap. Routed as an audit lane, Gemini reached the
correct outcome via templated, non-pair-specific reconciliations — identical boilerplate across all
46 pairs, with Part B text citing other pairs' content — that Luke had to independently re-research to
trust, while the Claude and Codex lanes produced self-verifying, verbatim-evidenced reconciliations.
Of 104 pairs only ~2 genuinely required a third reviewer, and even those were re-researched by hand.
Architect handoff: `Archive/root-cleanup-2026-06-26/CLAUDE-ARCHITECT-GEMINI-AUDIT-QUALITY-HANDOFF-2026-06-26.md`.
Standing position: do not route content-judgment audit lanes to Gemini; drive the producer≠checker
third-model residual toward zero using the existing carve-outs (Opus prose-only cases route as
GPT-provenance; the GPT-5/Codex lane covers GPT-conflicted pairs).

## GPT-5.6 Sol lane substitution — full proof-batch detail (2026-07-13)

Following GPT-5.6 Sol's preview launch and Codex's demonstrated strength on this repo's own
implementation lane, all `gpt_`-prefixed content generation now runs on GPT-5.6 Sol. First test: the
`io_trend` proof batch, split into a producer copy with no keys and an architect-only key-reveal file
withheld from the producer entirely. Reached V3 after two rounds of GPT review, both independently
re-verified before acting: round 1 caught a blinding failure and context leakage in the original
2026-07-09 frames; round 2 caught leaking headings and management-action keys the given data
couldn't support. All four frames test trend interpretation; an indeterminate collapsed result
explicitly counts as divergence when the endpoint cannot support any offered shape interpretation.
