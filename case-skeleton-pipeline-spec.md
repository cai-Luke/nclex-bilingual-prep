# Case-Skeleton Pipeline Spec — Opus authors, Gemini compiles

**Status:** planning artifact (not yet in repo). Two paste-ready prompts ship alongside it:
`opus-case-skeleton-prompt.md` and `gemini-case-compiler-prompt.md`.

## Problem this solves

The Opus institutional-hub harness is good at exactly one thing for us and bad at the rest. Evidence is in
`banks/banks-raw/opusraw.json`: the clinical content is strong (a TLS unfolding case with realistic serial
labs and a deliberately planted "uric-acid-drop-contradicts" distractor), but it declared `schemaVersion 1.2`
and then emitted a non-schema shape — `bankId`/`title`/`titleEs`, `caseStudy.narrative[]`, `type` instead of
`itemType`, `correctAnswers` keyed by display text — and rendered the **second language as Spanish, not
Chinese**. The harness nails the irreducible semantic residual (the fact pattern) and mangles everything
mechanical.

So we stop asking it to produce JSON at all and cut the work along that seam.

## Architecture

```
Opus (hub)            Gemini (web client)        GPT pass            Claude
English case   ─────►  schema-1.2 case_study ───► refine/check ───► review + promote
skeleton (prose)       bilingual cluster          (candidate)        (canonical + ledger)
```

- **Opus authors clinical truth.** One unfolding case as English prose in 11 fixed sections (CASE TITLE …
  EXPECTED LEARNING OBJECTIVES). No JSON, no Chinese, no Spanish. This is the only step that needs the
  expensive model, and it is the part the crippled harness can do (DECISIONS §3: model only for the
  irreducible semantic residual).
- **Gemini compiles + translates.** One skeleton → one `case_study` envelope, 4–6 embedded questions = the
  cluster, fully bilingual. It selects item types, generates ids, and produces all `zh`. It does **not**
  decide medicine.
- **GPT then Claude** are the existing review tail. The chain preserves generator≠reviewer (DECISIONS §2/§5):
  the author (Opus), the compiler (Gemini), and the reviewer (Claude) are three different models.

## Why one case → a cluster (decided)

The skeleton's three-stage CLINICAL COURSE plus 4–6 KEY DECISION POINTS is built to fan out into a multi-part
`case_study`, which amortizes the hard-to-schedule hub generation across several items and naturally walks the
NCJMM sequence. Cost: coverage is counted per item, not per case — see follow-ups.

## The contract (what makes Gemini's job mechanical)

Each skeleton section has a fixed destination, so the compiler is shaping, not inventing:

| Skeleton section | Schema-1.2 target |
|---|---|
| CASE TITLE | `caseStudy.title` + English `topic` |
| PATIENT BACKGROUND + INITIAL PRESENTATION | `caseStudy.summary` + first exhibit |
| ASSESSMENT FINDINGS + LABORATORY DATA | exhibit `content` (chart-like) |
| CLINICAL COURSE Stage 1/2/3 | `caseStudy.stages[]` (the unfold) |
| KEY DECISION POINTS | embedded `questions[]` — correct answer + `rationale.correct` + `ngnSkill` |
| COMMON NURSING ERRORS | distractor options + their `rationale.byChoice` |
| EXPECTED LEARNING OBJECTIVES | coverage check + `category` selection |

The load-bearing rule: **correct answers are read from KEY DECISION POINTS, distractors from COMMON NURSING
ERRORS.** Gemini may translate and rephrase but may not change which action is correct or introduce clinical
claims absent from the skeleton. An underspecified decision point is dropped, not guessed.

## The Spanish bug doesn't vanish — it migrates, and is gated

Making the skeleton English-only removes the language Opus was mistranslating into and concentrates **all**
bilingual generation in Gemini. That makes Gemini's `zh` fidelity the new single point of failure. It's
cheap to gate: a CJK-presence regex on every must-be-bilingual field, failing loud before review (the inverse
of the existing topic-CJK gate, which fails loud when CJK *is* present). You noted Gemini's translation is
reliable and that checking it is effectively free on GPT-web tokens — good; this just makes the check a gate
rather than a hope.

## Proposed DECISIONS.md additions (apply on your go)

1. **Clinical truth is authored once, upstream, and is read-only downstream.** In the case-skeleton pipeline
   the author (Opus) owns the fact pattern, correct actions, and rationale; the compiler (Gemini) translates
   and shapes but never decides or alters which action is correct, and never adds clinical claims absent from
   the skeleton. Distractors are sourced from the skeleton's enumerated nursing errors. This keeps the
   weaker-supervised compile step out of the business of adjudicating medicine.

2. **The case-skeleton is English-only; bilingual generation is concentrated in the compiler.** Therefore a
   deterministic CJK-presence gate on must-be-bilingual fields is required before review — the inverse of the
   topic-CJK Tier-0 gate. Absence of `zh` (or untranslated English left in a `zh` field) fails loud.

## Follow-ups (not in the prompts; flag for implementation)

- **Coverage/census recursion.** Because the authored unit is the *case* but coverage counts *items*,
  confirm `coverage-report.ts` and `census.ts` recurse into `case_study.questions[]` when tallying topics and
  categories — otherwise a 6-item case reads as one item. This intersects the already-open `census.ts` work.
- **Necessity gate stays downstream.** Visual educational-necessity is judged at Claude review or a script,
  not by Gemini; the compiler defaults to text exhibits and only emits a visual when a decision point turns on
  a trajectory/grid relationship. Confirm the four necessity gates from U3 scoping are the ones applied here.
- **Raw staging path.** Compiled output lands in `banks/banks-raw/` and goes through `npm run promote`
  (shuffle + validate) → `npm run audit` → merge → ledger, same as every other lane.
