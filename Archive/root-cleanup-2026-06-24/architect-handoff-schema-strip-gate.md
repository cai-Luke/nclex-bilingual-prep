# Architect handoff — unknown-field strip gate + glossary `defEn` decision

**From:** Claude (content review / promotion seat)
**Date:** 2026-06-20
**Audience:** architect in claude.ai (assume no live repo access — all claims are quoted with file:line)
**Trigger:** final review + promotion of a 6-file Gemini batch into `gemini-canonical.json` (787→824). During glossary cleanup I found a non-schema field (`termDef`) that Gemini had emitted in 4 of the 6 batches.

This handoff has **one actionable architecture item (Finding A)** and **one deferred product decision (Finding B, with a ready-to-drop `DECISIONS.md` stub)**. The current batch is already clean and promoted — nothing here blocks shipped content; both items are forward-looking.

---

## Background (what `termDef` was)

The canonical glossary type is deliberately three fields:

```ts
// src/types.ts:40
export type GlossaryTerm = {
  termEn: string;   // English term (the exam-language word)
  termZh: string;   // Chinese term (maps it to the learner's language)
  defZh: string;    // Chinese definition (comprehension in the stronger language)
};
```

Gemini additionally emitted `termDef` (an **English** definition) on 26 glossary entries across 4 of the 6 batch files. It is in no type, no validator, no renderer, and **zero** of the 13 canonical banks. I stripped all 26 before promotion and populated 5 empty glossaries to canonical shape; the merged bank is clean. So `termDef` itself is a closed issue. What it *revealed* is the interesting part.

---

## Finding A — non-schema fields ride into canonical unstripped (actionable)

**Claim:** any key a generation model invents survives `promote` → `consolidate` into the bundled canonical bank, silently. `termDef` only got caught because I noticed it by hand.

**Why it happens (the full path):**

1. **Validation casts, it does not project.** `validateBankObject` returns the *same* parsed object cast to the type — unknown keys are retained, not dropped:
   - `src/schema.ts:210` → `question: raw as unknown as Question`
   - `src/schema.ts:255` → `const question = raw as Question;`
2. **The glossary check only asserts required keys.** It never rejects extras:
   - `src/schema.ts:247-249` — fails only if `termEn` / `termZh` / `defZh` are missing/empty; `termDef` (or any typo'd key) passes.
3. **Transforms spread the object.** Both shuffle and normalize copy questions with `...spread`, carrying unknown keys through verbatim:
   - `lib/shuffle.ts` (`return { ...q, rationale: { ...q.rationale, ... } }`)
   - `lib/presentation-normalization.ts` (`return { ...question, options }`, etc.)
4. **Serialization is a bare stringify.** `serializeBank` → `JSON.stringify(bank, null, 2)` (`lib/presentation-normalization.ts:220`). Whatever survived (3) is written to canonical.

**Net:** the pipeline validates *presence* of the schema but never *projects to* the schema. A model can inject a misspelled key (`defZh` → `defzh`, `correct` → `correrct`), a stray field, or a hallucinated convention, and it lands in the bundled app source. Some of these are benign (dead weight); some are dangerous (a typo'd required key would read as "missing" elsewhere while the junk twin persists).

**This generalizes beyond glossaries** — it's every object in the schema (options, rationale, matrix rows, dropdowns, exhibits). Glossary `termDef` is just the instance that happened to surface.

**Precedent that this is solvable in-place:** the pipeline *already* strips one known non-bank field — `stripCompileManifests` in `lib/case-completeness.ts`, called in `scripts/promote.ts` before validation. So a "remove fields that aren't part of the bank shape" step has an established home and pattern; it just only knows about `_compileManifest` today.

**Options (architect's call):**

- **A1 — strict reject (validator gate).** Extend the validators to fail on unknown keys (`reasons.push(\`glossary[${i}] has unknown key '${k}'\`)`). Loudest, catches typos of *required* keys too, zero silent drift. Cost: every legitimately-new field needs the validator updated first (which is arguably correct discipline). Strongest fit with the deterministic-core / minimal-surface house style.
- **A2 — strip to schema (projection in promote).** Add a `projectToSchema` pass alongside `stripCompileManifests` that rebuilds each object from a field whitelist. Silently canonicalizes; lower friction. Cost: silent — a typo'd required key would be dropped and then fail validation as "missing," which is actually a fine failure mode (loud at validate, not in canonical).
- **A3 — do nothing, rely on manual review.** Status quo. Not recommended — it only worked this time because the reviewer happened to look.

**My recommendation:** **A1 (strict reject) as a `validate-bank` / promote-gate addition.** It matches the project's "fail loudly at the gate, keep canonical clean" posture, it's symmetric with the existing collision/id gates, and it converts a silent drift vector into a build-time error. A2 is a fine lighter-weight alternative if reject-on-unknown is judged too brittle for rapid iteration. Either way, keep `stripCompileManifests` as-is (it's a legitimate compile-only field, not bank data).

---

## Finding B — should the glossary carry an English definition? (deferred decision)

Separate from the mechanics: *is `termDef` a feature we actually want, done properly?*

Not a hallucination in the "nonsensical" sense — Gemini pattern-matched a generic bilingual-glossary convention (term + definition in both languages). But it collides with what the current schema deliberately encodes. The `{termEn, termZh, defZh}` shape is a specific pedagogical scaffold: a Chinese-speaking student sitting an **English** exam sees the English *term* (which they need), maps it to Chinese, and gets the definition in their *stronger* language. Defining in Chinese only is a design choice, not an omission.

The only real case *for* an English definition is **graduated immersion** — advanced learners building test-language reading fluency read `defEn`; beginners lean on `defZh`. Legitimate pedagogy, but it doubles the authoring + bilingual-parity surface for every term, for a field nothing renders today, and cuts against "precision over volume / minimal surface."

Drop-in stub for `DECISIONS.md` (suggested home: **Open threads / live state**):

> ### Open thread — glossary English definition (`defEn`)?
>
> **Status:** deferred (raised 2026-06-20). **Lean: keep `defZh`-only.**
>
> The glossary shape `{termEn, termZh, defZh}` is a deliberate scaffold for a Chinese-speaking learner sitting an English exam: English term (exam language) + Chinese term + **Chinese** definition (comprehension in the stronger language). There is intentionally no English definition.
>
> A Gemini batch (2026-06-20) emitted an unsanctioned `termDef` (English definition) on 26 entries; all were stripped before promotion (non-schema, unrendered, absent from every canonical bank). That surfaced the latent question: *do we want an English definition for graduated immersion (advanced learners read `defEn`, beginners read `defZh`)?*
>
> **Decision posture:** Do **not** adopt `termDef`. If an English definition is ever wanted, add it as a first-class `defEn` field — typed in `GlossaryTerm`, validated in `schema.ts`, and rendered — not smuggled in under a model-invented key. Default is to leave it out unless there is concrete product appetite for dual-language definitions; the English *term* (`termEn`) already gives test-language exposure, and `defZh` already conveys meaning, so the marginal value is modest against the doubled bilingual-review cost.
>
> **Cross-ref:** see the unknown-field strip gate thread — the same episode is the motivating example for hardening promote against non-schema keys.

---

## What's already done (no action needed on current content)

- 26 `termDef` fields stripped from the 4 affected batch files; 5 empty MoC glossaries populated to canonical `{termEn, termZh, defZh}`.
- Batch reviewed, repaired (8 fixes, 0 cuts), promoted 787→824, full audit gate green, census regenerated, ledgered, pushed to `main`.

The two items above are forward-looking hardening, not cleanup of shipped state.
