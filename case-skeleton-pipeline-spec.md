# Case-Skeleton Pipeline Spec — Opus authors, GPT compiles, Gemini reviews

**Status:** implemented; prompts updated to schema 1.4 (retrofit Jun 14) and role-split
updated Jun 15. Paste-ready prompts:
`opus-case-skeleton-prompt.md`/`.txt`, `gpt-case-skeleton-compiler-prompt.md`,
`gemini-case-compiler-prompt.md` (now the Gemini flag-only review-layer prompt).

## Problem this solves

The Opus institutional-hub harness is good at exactly one thing for us and bad at the rest. Evidence is in
`banks/banks-raw/opusraw.json`: the clinical content is strong (a TLS unfolding case with realistic serial
labs and a deliberately planted "uric-acid-drop-contradicts" distractor), but it declared `schemaVersion 1.2`
and then emitted a non-schema shape — `bankId`/`title`/`titleEs`, `caseStudy.narrative[]`, `type` instead of
`itemType`, `correctAnswers` keyed by display text — and rendered the **second language as Spanish, not
Chinese**. The harness nails the irreducible semantic residual (the fact pattern) and mangles everything
mechanical.

So we stop asking it to produce JSON at all and keep the semantic, compile, review,
and promotion responsibilities explicit.

## Architecture

```
Opus (hub)       GPT fact-check + compile       Gemini flag-only review       Claude
English case ──► clinical accuracy + ────────► structured issue list ───────► final gate +
skeleton          schema-1.4 bilingual           (no mutation)                promote
                  case_study cluster
                  (+ optional bowtie capstone)
```

- **Opus authors clinical truth.** One unfolding case as English prose in 10 fixed sections (CASE TITLE …
  EXPECTED LEARNING OBJECTIVES … BOW-TIE SYNTHESIS [optional]). No JSON, no Chinese, no Spanish. This is
  the only step that needs the expensive model, and it is the part the crippled harness can do
  (DECISIONS §3: model only for the irreducible semantic residual).
- **GPT is the baseline fact-checker and compiler.** GPT checks the skeleton's clinical accuracy and
  guidance currency, then compiles one skeleton into one fully bilingual `case_study` envelope targeting
  6 embedded questions, one per authored NCJMM decision point. Fewer items are allowed only when GPT logs
  a specific omission in the raw `_compileManifest`. GPT selects item types, generates ids, and produces all
  `zh`; it does **not** invent a different case or add unsupported clinical claims.
- **Gemini is a review layer, not a compiler.** Gemini receives the GPT-compiled raw artifact and emits a
  structured flag list only: structural issues, manifest faithfulness concerns, bilingual/stale-translation
  concerns, obvious internal inconsistencies, and omission-reason sanity checks. Gemini never rewrites JSON,
  skeleton prose, Chinese translation, ids, or answer keys.
- **Claude is the final reviewer.** The chain preserves producer≠checker (DECISIONS §2/§5): the author
  (Opus), GPT's compile pass, Gemini's independent review layer, and the final reviewer (Claude) have
  distinct roles. Gemini review is a pre-filter and never substitutes for Claude's clinical/content gate.

## Clinical fact-check, compile, and review steps

After the author model (Opus hub) produces the English skeleton and before final
review, the scaffold phase is:

1. **GPT fact-check + currency.** GPT clinically checks the author's fact pattern and current-guidance
   risks. When a claim is volatile, GPT either keeps the rule closed-world inside the case or flags it for
   Claude rather than treating memory as source verification.
2. **GPT compile / scaffold.** GPT compiles the checked fact pattern into schema-compliant bilingual JSON.
   The author's prose reasoning notes are stripped from the raw source before compilation, so the compiler
   works from the fact pattern alone, not author commentary. Provenance routes to the `gpt-` lane.
3. **Gemini flag-only review.** Gemini reviews the raw GPT artifact for parse/shape problems, id and answer
   reference integrity, `_compileManifest` faithfulness, bilingual completeness and obvious mistranslation,
   stale `zh`, unit/value drift, and internal contradictions. Gemini outputs only `{issue, location,
   severity}`-style flags for GPT to fix or Claude to adjudicate.

Gemini is deliberately out of scope for final clinical accuracy/currency adjudication, answer-defensibility
calls, and distractor-quality judgment. Those stay with Claude.

## Why one case → a cluster (decided)

The skeleton's three-stage CLINICAL COURSE plus 6 KEY DECISION POINTS is built to fan out into a multi-part
`case_study`, which amortizes the hard-to-schedule hub generation across several items and naturally walks the
NCJMM sequence. Cost: coverage is counted per item, not per case — see follow-ups.

## The contract (what makes the compiler's job mechanical)

Each skeleton section has a fixed destination, so the compiler is shaping, not inventing:

| Skeleton section | Schema-1.4 target |
|---|---|
| CASE TITLE | `caseStudy.title` + English `topic` |
| PATIENT BACKGROUND + INITIAL PRESENTATION | `caseStudy.summary` + first exhibit |
| ASSESSMENT FINDINGS + LABORATORY DATA | exhibit `content` (chart-like) |
| CLINICAL COURSE stages | `caseStudy.stages[]` (the unfold; 3 stages, or 4 when the skeleton includes a Stage 4) |
| KEY DECISION POINTS | embedded `questions[]` — correct answer + `rationale.correct` + `ngnSkill`; a recognize/analyze-cues DP over a findings passage may compile to an embedded `highlight` item |
| COMMON NURSING ERRORS | distractor options + their `rationale.byChoice` |
| EXPECTED LEARNING OBJECTIVES | coverage check + `category` selection |
| BOW-TIE SYNTHESIS (optional) | standalone `bowtie` as a *second* top-level question (not embedded); `meta.count` = 2 when present, 1 otherwise |

The load-bearing rule: **correct answers are read from KEY DECISION POINTS, distractors from COMMON NURSING
ERRORS.** The compiler may translate and rephrase but may not change which action is correct or introduce clinical
claims absent from the skeleton. An underspecified decision point is dropped, not guessed, and the omission
is recorded in the raw `_compileManifest`. A malformed BOW-TIE SYNTHESIS section is dropped, not repaired —
the bowtie is omitted, the reason is logged, and count stays 1. Promotion verifies the manifest against
actual output and strips it before canonical merge.

## The Spanish bug doesn't vanish — it migrates, and is gated

Making the skeleton English-only removes the language Opus was mistranslating into and concentrates **all**
bilingual generation in the compiler. That makes compiler `zh` fidelity the new single point of failure.
It's cheap to gate: a CJK-presence regex on every must-be-bilingual field, failing loud before review (the
inverse of the existing topic-CJK gate, which fails loud when CJK *is* present). This makes the check a gate
rather than a hope regardless of which scaffold model compiles a given case.

## DECISIONS.md additions (landed as principles 8 and 9)

1. **Clinical truth is authored once, upstream, and is read-only downstream.** In the case-skeleton pipeline
   the author (Opus) owns the fact pattern, correct actions, and rationale; the compiler translates
   and shapes but never decides or alters which action is correct, and never adds clinical claims absent from
   the skeleton. Distractors are sourced from the skeleton's enumerated nursing errors. This keeps the
   weaker-supervised compile step out of the business of adjudicating medicine.

2. **The case-skeleton is English-only; bilingual generation is concentrated in the compiler.** Therefore a
   deterministic CJK-presence gate on must-be-bilingual fields is required before review — the inverse of the
   topic-CJK Tier-0 gate. Absence of `zh` (or untranslated English left in a `zh` field) fails loud.

## Follow-ups (not in the prompts; flag for implementation)

- **Coverage/census recursion.** Because the authored unit is the *case* but coverage counts *items*,
  confirm `coverage-report.ts` and `census.ts` (a) recurse into `case_study.questions[]` when tallying
  topics and categories — otherwise a 6-item case reads as one item — and (b) also count the standalone
  `bowtie` as its own top-level item (it has its own `topic`/`category` that must not be lost). This
  intersects the already-open `census.ts` work.
- **CJK-presence gate field list.** The gate from principle 9 must cover the new bilingual surfaces added by
  this retrofit: `bowtie.{condition,actions,parameters}.tokens[].{en,zh}`,
  `bowtie.{condition,actions,parameters}.prompt.{en,zh}`, `bowtie.stem.{en,zh}`, and
  `highlight.segments[].{en,zh}`.
- **Necessity gate stays downstream.** Visual educational-necessity is judged at Claude review or a script,
  not by the compiler; the compiler defaults to text exhibits and only emits a visual when a decision point
  turns on a trajectory/grid relationship. Confirm the four necessity gates from U3 scoping are the ones
  applied here.
- **Raw staging path.** Compiled output lands in `banks/banks-raw/` and goes through `npm run promote`
  (shuffle + validate) → `npm run audit` → merge → ledger, same as every other lane. A skeleton yielding
  both a `case_study` and a `bowtie` produces one raw file with `meta.count` = 2; both items traverse
  the same pipeline together.
