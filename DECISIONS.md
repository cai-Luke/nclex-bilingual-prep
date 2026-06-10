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

## Origin anchor

The D-correct-at-3% MCQ finding is the canonical example of why this apparatus exists. Keep it as the regression case: any new positional-integrity tooling should be able to detect it.

## Other standing invariants

- Bilingual EN / zh-CN parity on all displayed text.
- `question.topic` is English-only — it is a navigational label, not study content (the target user's working English covers the topic; the translation does its real work in the stem, options, and rationale, where the medical terminology lives). Enforced in `validateBankObject` (Tier 0): CJK in `topic` fails loudly and is never silently stripped.
- Question IDs globally unique across bundled top-level banks (progress, flags, sessions, and answer history key by `question.id`).
- Runtime stays static, offline, and `file://`-compatible. No server or live model call after build.
- Schema changes are rare and deliberate.

## Open threads / live state (as of this planning session)

**Promotion gate** — *fully implemented.* `lib/shuffle.ts` (FNV-1a seed + Fisher-Yates) owns all option ordering; `scripts/promote.ts` applies it to every draft in `banks/banks-raw/`; `.github/workflows/promotion-gate.yml` runs `npm run audit` (Tier 0 `validate:bank` + Tier 1 `audit:references` / `audit:positions` / `audit:integrity`) on every PR to main. The correct promotion flow is: stage raw in `banks/banks-raw/` → `npm run promote` (shuffle + validate) → `npm run audit` → merge shuffled output into the canonical bank → delete raw draft → ledger update. Merging directly into a canonical bank without running `npm run promote` first is a gate bypass: the shuffle step must be applied manually before or after if the draft path is not used. The 63 pre-existing `audit:references` positional-language hazards across `gemini-canonical.json`, `claude-canonical.json`, `gpt-canonical.json`, and `hard-cases-canonical.json` were cleared on Jun 09 (rationale-wording fixes only — no answer keys, option IDs, or clinical meaning changed). `audit:references` now passes at zero, so the gate enforces true zero-tolerance with no carried backlog; new content simply must not introduce any.

**Current shuffle batch** — completed. The initial Gemini MCQ shuffle and rationale repair was verified by Claude Code (Sonnet) against the pre-shuffle git state and merged to main (PR #1).

**SATA count null — open.** The non-MCQ bias audit has no natural null for "number correct." Decide between supplying a reference NGN count distribution (cleaner test) or falling back to degeneracy detection. Spec: `non-mcq-bias-audit-spec.md`.

**`max_cell_deviation_pp = 8` — placeholder.** The effect-size floor on positional uniformity checks is a guess; calibrate against the real bank once the audit runs.

**Dormant audit checks.** The non-MCQ bias and adversarial audit specs reference `bowtie` and `highlight`/hotspot item types that are out of scope until a schema bump. Those checks stay dormant until those types ship — do not read their silence as a pass.

**Documentation drift / running census — specced this session.** `PROJECT-HISTORY.md` and `BANK-REVIEW-LEDGER.md` snapshot counts drift from the banks on disk: the 2026-06-09 census had to be hand-run by Sonnet because the prose had gone stale, and it surfaced that `capnography-canonical.json` was bundled but missing from the canonical list. Per principle 3 this is deterministic work that should never cost model tokens. Fix: a `scripts/census.ts` that reuses `coverage-report.ts`'s counters and topic normalizer, emits a structured `census.json` (source of truth) plus a generated `BANK-CENSUS.md`, and is wired into `npm run audit` / `promotion-gate.yml` so a stale committed census fails CI — converting "census" from a thing-someone-remembers-to-run into an invariant. Spec: `census-spec.md`. Two deterministic-layer bugs surfaced while speccing it: (a) `coverage.json` is an empty capture — `coverage-report.ts` has no `--json` branch, so a `--json` arg is silently treated as a bank-file path and ignored; (b) `normalizeTopic` strips all non-ASCII, which would silently erase any Simplified-Chinese text that leaked into `topic` — now closed by the English-only-`topic` invariant above, enforced in `validateBankObject` (Tier 0, fail loud on CJK).

**15. Bank patches are raw-scoped and declarative.**
`scripts/patch-raw.ts` writes only under `banks/banks-raw/`. Canonical files are read-only except via the explicit `--allow-canonical --reason` in-place mode, which forces a ledger entry. Patch ops are declarative (`before`→`after`, precondition-checked); there is deliberately no arbitrary-mutate primitive, because mechanical fixes belong in patches and semantic fixes belong in review.

## Session artifacts (planning outputs, not yet in repo)

- `promotion-gate-spec.md` — the standing gate; principles 1–4 made operational.
- `shuffle-verification-spec.md` — one-time verification of the current shuffle batch.
- `non-mcq-bias-audit-spec.md` — forward-looking structural-bias audit across non-MCQ types.
- `census-spec.md` — deterministic bank-census script (`census.json` + generated `BANK-CENSUS.md`) and docs-drift CI check; principle 3 applied to documentation.

Governing specs already in the repo/workflow: the adversarial audit spec, the portable bank-generation prompt, and `shrimp-visual-sweep-spec-v3.md`.
