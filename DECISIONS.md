# DECISIONS.md

The reasoning-and-state layer for Project Shrimp. `AGENTS.md` says *how* to work; `PROJECT-HISTORY.md` records *what happened*; this file holds *why the architecture is the way it is* and *what is still open* — the things that are expensive to lose because a fresh agent (or future Luke) will otherwise re-litigate them from scratch.

## Standing principles

**1. Answer placement is owned by code, not the model.**
LLMs are biased samplers: they write the correct answer first and confabulate distractors around it, so correct answers cluster into early positions. An audit found option D correct in only ~3% of MCQs, where uniform would be 25%. The fix is not more prompt guard rails — it is a deterministic shuffle, seeded by item ID, applied at the promotion step, so placement is a verifiable transform rather than a behavior begged from a model. The same mechanism drives select-all correct options clustering at the top, so this governs positional bias across *all* item types, not just MCQ.

**2. The producer is never the checker.**
The program that generates or shuffles content cannot be the program that verifies it — a checker sharing a run or codebase with the producer cannot independently fail the producer's output. The only thing they may share is a pure, deterministic transform (e.g. the shuffle function) that the checker re-runs to assert equality.

**3. Deterministic core; LLM only for the irreducible semantic residual, capped.**
Counting, distributions, permutation integrity, template repetition — all have known nulls and belong in scripts that return identical verdicts every run. Reserve model judgment for what genuinely needs semantics (clinical inferability, distractor plausibility), run it only on items the deterministic layer flags, and cap the batch. Keeps verdicts reproducible and token spend bounded.

**4. Rationales are position-agnostic — bilingual.**
A rationale references option *content* ("furosemide is contraindicated because…"), never a letter or ordinal/spatial position ("Option D", "the first choice"). A rationale that never names a position cannot carry a stale answer-key reference after a shuffle — so this invariant makes a whole bug class structurally impossible rather than something to catch each run. Enforced across English and Simplified Chinese (选项A, 第一个, 以上 …).

**5. Generated ≠ reviewed.**
Raw model output is never trusted study material. It stages in `banks-raw/`, passes validation + audit + source-check, then promotes to a canonical `banks/*.json` with a `BANK-REVIEW-LEDGER.md` entry. The generating model never reviews its own batch; cross-model review precedes promotion. Gemini in particular is a raw-volume source only — small batches, never direct canonical edits.

**6. Visuals are deterministic, data-derived, and necessary.**
Every visual renders locally from inspectable structured data — no raster assets, no external images, no AI-generated medical imagery. A visual whose removal leaves the answer unchanged is decorative and therefore invalid. Each renderer ships with `selfCheck` cross-consistency assertions and registry conformance tests.

**7. Precision over volume.**
In any audit, five fully-evidenced findings beat thirty probable ones. Verbatim evidence, an honest reconciliation attempt, and explicit confidence/dismiss discipline are the standard (see the adversarial audit spec).

**8. Clinical truth is authored once, upstream, and read-only downstream.**
In the case-skeleton pipeline (Opus hub authors an English prose case → Gemini compiles to schema → GPT pass → Claude review), the author model owns the fact pattern, the correct actions, and the rationale. The compiler translates and shapes into schema but never decides or alters which action is correct, and never introduces clinical claims absent from the skeleton; distractors are drawn from the skeleton's enumerated nursing errors. This keeps the weaker-supervised compile step out of adjudicating medicine and preserves producer≠checker (principle 2) across the chain — author, compiler, and reviewer are three different models. A decision point too underspecified to yield an unambiguous item is dropped, not guessed. Validated end-to-end on the aGVHD case (2026-06-11).

**9. The case-skeleton is English-only; bilingual generation is concentrated in the compiler.**
The hub harness drifts to Spanish and mangles schema, so the authored skeleton is English prose only — no JSON, no second language. All zh is therefore generated downstream by the compiler, which makes compiler zh-fidelity the single point of failure. Gate it: a deterministic CJK-presence check on every must-be-bilingual field — the inverse of the topic-CJK Tier-0 gate (which fails when CJK *is* present). A missing zh, or English left sitting in a zh field, fails loud before review. (The aGVHD cure pass cleared this by hand — every English edit carried a matching zh edit — but the check should be mechanical, not trusted.)

**10. Study sessions mirror the exam's content distribution; difficulty is exam-sim-only.**
A study session is a representative slice of the NCLEX-RN, not a flat random draw over whatever was generated. The default test draws 50 questions (≈ the 52 scored content items of a minimum-length real exam, where the distribution actually resolves) weighted to the 2026 test-plan Client Needs distribution, with a within-category diversity penalty so no narrow topic or visual kind (the EKG-glut case) fills its category's slots, and a per-kind floor guaranteeing ≥1 of each well-stocked visual kind. Difficulty adaptivity is a *separate axis* — the real exam is CAT-adaptive on difficulty — and is deliberately deferred to a future exam-simulation mode; study mode never adjusts on difficulty. Case studies are excluded from the weighted draw (on the real exam they are a fixed allotment counted independently of the content-area percentages). Spec: `Archive/study-session-weighting-spec.md`.

**11. Visual arithmetic is a machine-checked gate, not a trusted assertion — and it carries no engine.**
For every visual kind whose answer turns on a computed value (`io_record` totals/balance, `medication_label` dose/volume/rate, `device_screen` pump math, and `burn_map` %TBSA/Parkland, all shipped), the load-bearing numbers are typed on the visual spec, the question's inputs and keyed answer live in audit-only `meta`, and `selfCheck` recomputes the answer from spec + meta and asserts exact equality (after a declared rounding wherever division is involved). A mismatch is a *build failure*, not a content note — a keyed value that disagrees with the recompute is a broken item. The recompute is deliberately small: each kind exposes an *enumerated* set of one-line, same-unit derivations. We do not parse free-text doses or build a unit-conversion/dosage engine; a derivation that would need cross-unit conversion (mg↔mcg, mg/kg, mcg/kg/min, body-weight dosing) is out of scope for that kind, not a reason to grow the engine. This is principle 3 (deterministic core) and principle 6 (visuals necessary) made concrete for the chart/label/screen tier; human review still owns clinical validity — is the keyed value the load-bearing cue, and is anything *else* accidentally unsafe.

## Study-session distribution (2026 NCLEX-RN Test Plan, effective April 2026)

Category weights for the weighted study draw, keyed by the `Category` literals in `src/types.ts`. Midpoint targets from the published test plan; sum to 1.00. NCSBN permits ±3% per category, so these are targets, not constraints. ("Safety and Infection Control" is the schema label for the 2026 plan's "Safety and Infection Prevention and Control," 13%.)

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

Sampler rules (full detail in `Archive/study-session-weighting-spec.md`): largest-remainder rounding to the target count; floor set = visual kinds with ≥10 items in the bank (currently rhythm_strip, lab_trend, vitals_trend), derived at runtime so it self-corrects as content grows, active only at N≥40, reserved from within the distribution, silently dropped when a kind's pool is exhausted; soft diversity penalty on repeated `topic`/visual `kind` (α=β=1). The floor threshold and penalty constants are tuned against the within-category concentration the census reports (spec §5).

## Origin anchor

The D-correct-at-3% MCQ finding is the canonical example of why this apparatus exists. Keep it as the regression case: any new positional-integrity tooling should be able to detect it.

## Other standing invariants

- Bilingual EN / zh-CN parity on all displayed text.
- `question.topic` is English-only — it is a navigational label, not study content (the target user's working English covers the topic; the translation does its real work in the stem, options, and rationale, where the medical terminology lives). Enforced in `validateBankObject` (Tier 0): CJK in `topic` fails loudly and is never silently stripped.
- Question IDs globally unique across bundled top-level banks (progress, flags, sessions, and answer history key by `question.id`).
- Runtime stays static, offline, and `file://`-compatible. No server or live model call after build.
- Schema changes are rare and deliberate.
- Shared visual numeric helpers have a **single definition**: `fmt`, `fmtNum`, and `roundTo` live in `src/visuals/primitives/graphPaper.ts`, and every kind imports them — none redefines them. This is a correctness property, not just DRY: one canonical `roundTo` means every arithmetic kind rounds identically, so two kinds can never resolve the same dose math to different values. Same single-transform discipline the shuffle function follows (principle 2).

## Open threads / live state (as of this planning session)

**Promotion gate** — *fully implemented.* `lib/shuffle.ts` (FNV-1a seed + Fisher-Yates) owns all option ordering; `scripts/promote.ts` applies it to every draft in `banks/banks-raw/`; `.github/workflows/promotion-gate.yml` runs `npm run audit` (Tier 0 `validate:bank` + Tier 1 `audit:references` / `audit:positions` / `audit:integrity`) on every PR to main. The correct promotion flow is: stage raw in `banks/banks-raw/` → `npm run promote` (shuffle + validate) → `npm run audit` → merge shuffled output into the canonical bank → delete raw draft → ledger update. Merging directly into a canonical bank without running `npm run promote` first is a gate bypass: the shuffle step must be applied manually before or after if the draft path is not used. The 63 pre-existing `audit:references` positional-language hazards across `gemini-canonical.json`, `claude-canonical.json`, `gpt-canonical.json`, and `hard-cases-canonical.json` were cleared on Jun 09 (rationale-wording fixes only — no answer keys, option IDs, or clinical meaning changed). `audit:references` now passes at zero, so the gate enforces true zero-tolerance with no carried backlog; new content simply must not introduce any.

**Current shuffle batch** — completed. The initial Gemini MCQ shuffle and rationale repair was verified by Claude Code (Sonnet) against the pre-shuffle git state and merged to main (PR #1).

**SATA count null — open.** The non-MCQ bias audit has no natural null for "number correct." Decide between supplying a reference NGN count distribution (cleaner test) or falling back to degeneracy detection. Spec: `non-mcq-bias-audit-spec.md`.

**`max_cell_deviation_pp = 8` — placeholder.** The effect-size floor on positional uniformity checks is a guess; calibrate against the real bank once the audit runs.

**Sampler floor/penalty constants — placeholders.** `floorThreshold = 10` and `alpha = beta = 1` in the study-session sampler are first guesses. Calibrate against the within-category topic/visual-kind concentration emitted by `census.ts` (`Archive/study-session-weighting-spec.md` §5). The rhythm-strip share of its home category is the number to watch.

**Dormant audit checks.** The non-MCQ bias and adversarial audit specs reference `bowtie` and `highlight`/hotspot item types that are out of scope until a schema bump. Those checks stay dormant until those types ship — do not read their silence as a pass.

**Documentation drift / running census — specced this session.** `PROJECT-HISTORY.md` and `BANK-REVIEW-LEDGER.md` snapshot counts drift from the banks on disk: the 2026-06-09 census had to be hand-run by Sonnet because the prose had gone stale, and it surfaced that `capnography-canonical.json` was bundled but missing from the canonical list. Per principle 3 this is deterministic work that should never cost model tokens. Fix: a `scripts/census.ts` that reuses `coverage-report.ts`'s counters and topic normalizer, emits a structured `census.json` (source of truth) plus a generated `BANK-CENSUS.md`, and is wired into `npm run audit` / `promotion-gate.yml` so a stale committed census fails CI — converting "census" from a thing-someone-remembers-to-run into an invariant. Spec: `census-spec.md`. Two deterministic-layer bugs surfaced while speccing it: (a) `coverage.json` is an empty capture — `coverage-report.ts` has no `--json` branch, so a `--json` arg is silently treated as a bank-file path and ignored; (b) `normalizeTopic` strips all non-ASCII, which would silently erase any Simplified-Chinese text that leaked into `topic` — now closed by the English-only-`topic` invariant above, enforced in `validateBankObject` (Tier 0, fail loud on CJK).

**15. Bank patches are raw-scoped and declarative.**
`scripts/patch-raw.ts` writes only under `banks/banks-raw/`. Canonical files are read-only except via the explicit `--allow-canonical --reason` in-place mode, which forces a ledger entry. Patch ops are declarative (`before`→`after`, precondition-checked); there is deliberately no arbitrary-mutate primitive, because mechanical fixes belong in patches and semantic fixes belong in review.

**Content generation freeze — active.** No new question content is generated until the visual-stimuli roadmap renderers are specced and shipped. Every new-content lane is held; legacy banks are untouched (a Gemini research pass over existing content may be specced separately during the freeze). U6 `medication_label`, U9 `device_screen`, and U8 `burn_map` have shipped; U7 `fetal_monitoring` remains. The freeze lifts when U7 ships and the content lanes open under the existing raw→review→promote→ledger pipeline. Pediatric `burn_map` content has an additional source-verification gate even after the general freeze lifts. Rationale: finish the renderer surface before pouring content through it, so no batch is generated against a kind that later shifts shape.

**Visual panel primitive — U6 before U9 (ordering satisfied).** U6 shipped `renderFieldPanel` / `measureFieldPanel` (the key→value panel/label layout, sibling to `renderDocTable`) inside its first consumer, `medication_label`, following the build-the-primitive-in-its-first-consumer pattern (`lineChart`→U2, `renderDocTable`→U4). It also landed the shared `fmtNum` / `roundTo` helpers in `graphPaper.ts`. U9 `device_screen` now consumes these unchanged with `variant:"screen"`.

## Session artifacts (planning outputs, not yet in repo)

- `promotion-gate-spec.md` — the standing gate; principles 1–4 made operational.
- `shuffle-verification-spec.md` — one-time verification of the current shuffle batch.
- `non-mcq-bias-audit-spec.md` — forward-looking structural-bias audit across non-MCQ types.
- `census-spec.md` — deterministic bank-census script (`census.json` + generated `BANK-CENSUS.md`) and docs-drift CI check; principle 3 applied to documentation.
- `Archive/study-session-weighting-spec.md` — implemented NCLEX-distribution-weighted study-session sampler (50-question default, category weighting + diversity floor, difficulty deferred to exam-sim) and `census.ts` within-category breakdown.

Governing specs already in the repo/workflow: the adversarial audit spec, the portable bank-generation prompt, and `shrimp-visual-sweep-spec-v3.md`.
