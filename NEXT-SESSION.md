# NEXT SESSION — Topic Hygiene Rollout → Resume Development

Handoff for the next chat. This session finished the **architecture** of the topic-vocabulary
hygiene work; what remains is **rollout of the bulk residual** plus one gating decision, after which
content development resumes. Project is near endgame — spend shifts from architecture to content
review and the parked readings feature.

## Step 0 — re-orient before doing anything

- Repo: `/Users/holemini/Desktop/Project Shrimp/`. Reach it via the **`MCP:` / fsmcp.lukecai.com**
  connector (scoped to all of `/Users/holemini`). The `Filesystem:` connector is microscopy-only and
  **cannot see this repo** — an "access denied" there is a connector-selection error, not a missing file.
- **Read current state from disk first; it drifts between sessions.** Pull, in order:
  `TOPIC-VOCABULARY-HYGIENE-SPEC.md` (the plan + invariants), `TOPIC-VOCABULARY-DECISIONS.md` (locked
  vocabulary + judgment calls), `src/topics.ts` (source of truth), and the `audit/` reports below.
- **Verify what actually landed**, because this handoff may be stale: did the reviewed/corrected
  **Gemini-52** proposals get written to canonical, or is that write still pending an approved
  execution manifest? Confirm before assuming.

## What's done (do not redo)

- **Layer 1 — `src/topics.ts`** is the single source of truth: 46 canonical topics (45 + approved
  `Caregiver Role Strain & Family Coping`), `STRICT`/`SHARED` category licensing, and a **two-tier
  alias map** — `LEXICAL_ALIASES` (write path) vs `SEMANTIC_ALIASES` (suggest-only). Both inline
  copies retired; `standardize-topics.ts` retired.
- **Layer 1b** — `npm run export-topic-vocab` → `docs/topic-vocabulary.md` (generated, not hand-kept).
- **Layer 4** — the closed-vocabulary `TOPIC FIELD RULE` is injected into `GeminiPrompt.md`,
  `gpt-case-skeleton-compiler-prompt.md`, and `opus-case-skeleton-prompt.md`. New generation now emits
  canonical topics → **the stop-the-bleeding half of the freeze is lifted.**
- **Migration refit** (`scripts/cleanup-topic-metadata.ts`): exact-alias-write-only, every write
  category-license-checked, two-tier split, origin-split residual, blocked/untrusted counted
  separately. Keyword classifier removed.
- **Exact-only pass applied**: 54 deterministic writes (casing + approved aliases), 0 untrusted.
- **Gemini-origin slice (52)** ran through the gated LLM proposal pass → `audit/proposal_manifest_gemini.json`,
  reviewed by category. Corrections made: TBSA item recategorized to Physiological Adaptation
  (→ Burn Management); grief re-ruled to **construct-based routing** (assessment → Mental Health
  Disorders, therapeutic response → Therapeutic Communication, active crisis → Suicide & Crisis
  Intervention; the two grief→Suicide aliases removed); GCS and ET-suctioning recorded as weak-but-
  licensed RRP compromises in the decisions doc.

## The gating decision — settle this FIRST next session

The bulk residual is **`audit/unresolved_gpt_claude.json` (835 items)**; the Gemini slice was
`audit/unresolved_gemini.json` (52, now processed). The 835 bucket was split **by ID prefix** (narrow
reading of origin). But the spec now defines **origin as whoever authored the `topic` field, including
the compile step** (broad reading). If Gemini compiled a chunk of those 835 during the pipeline, a
Gemini classification pass over them is **soft self-review** under our own definition. Likewise, if
Codex/GPT-family classifies GPT-authored items, same problem.

**Action:** re-derive the residual split by *topic-field authorship*, not ID prefix; then assign a
classifier per bucket that authored none of it. This is a ~15-minute origin tally that decides whether
the big pass is compliant. Do not run the 835 pass until this is settled.

## Rollout sequence (after the gating decision)

1. **Category sanity pass — insert early, before the 835 run.** The TBSA item proved `category` is not
   100% trustworthy, and the LLM pass *trusts category as its license* — a bad category silently
   mis-scopes every proposal for that item. Sweep for other miscategorized items first.
2. **Run the 835 gated semantic pass** (category-scoped candidate filter, scoped context = stem +
   correct answer + correct rationale, no self-review per the gating decision) → proposal manifest.
3. **Human review by category** (not globally); approve into an execution manifest.
4. **One canonical write** under `--allow-canonical --reason …`, honoring all three guards.
5. **Recompute `coverage-report`** against clean topics → the real gap map.
6. **Lift the accurate-targeting half of the freeze.** Then consider turning on Phase 2 (category-
   mismatch audit) → Phase 3 (strict licensing) per the spec.

## Open vocabulary questions (decide as they come up)

- **RRP lacks an assessment/monitoring home** — GCS scoring and ET-suctioning had to be forced into
  Laboratory & Diagnostic Tests / Procedural Complications & Dialysis. Consider whether RRP needs a
  cleaner assessment/monitoring topic, or leave as compromises.
- Granularity check (e.g. rhythm-strip/EKG under Cardiovascular Disorders?) and any near-empty topics
  worth dropping — both answerable from the recomputed coverage report, not by guessing.

## Then: resume development

The thread that started all this was the **end-of-session "suggested readings" / Saunders pointer**
for the partner's remediation flow (parked pending user observation). It keys off exactly the metadata
we just cleaned: a category→Saunders unit/concept map (reference the named unit, not page numbers —
multiple editions in circulation), surfaced on the summary screen for missed categories. Buildable on
real data once coverage is recomputed. The lightweight "Review these areas" rollup on `SummaryView`
(missed categories/topics) is the zero-schema first step; the Saunders map is the small app-side
addition on top. Revisit with fresh user observation of how she actually uses the GPT remediation step.
