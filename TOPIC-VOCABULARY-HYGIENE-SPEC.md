# Topic Vocabulary Hygiene — Cure Spec

Status: **implementation corrected after failed applied migration.** Topic-list/class decisions are
resolved (see Resolved Decisions and `TOPIC-VOCABULARY-DECISIONS.md`), but canonical bank writes are
paused pending review of conservative suggestions. Keep the failed applied report as an audit
artifact. Layer 3 now carries the two migration safety guards that the failed run violated.

## Definition (the keystone — read first)

> **`topic` is a stable dashboard/library rollup label, not a one-off clinical micro-description.**

Detailed clinical specificity belongs in `stem`, `rationale`, `glossary`, and possibly future
tags — never in `topic`. This single rule is what prevents future prompt writers from
reintroducing the long tail in the name of "specificity." It supersedes the older generation-prompt
guidance that told models to make `topic` "specific enough to be useful in the filter," which is the
instruction that produced the long tail in the first place.

Correct:

```json
{ "category": "Safety and Infection Control", "topic": "Transmission-Based Precautions" }
```

Wrong (useful semantic detail, bad metadata):

```json
{ "topic": "contact precautions workflow for diarrheal illness" }
```

## Problem

`question.topic` has drifted into an unmanaged model-output field. The census shows three symptoms:

- **Casing duplicates** counted as distinct topics — `Legal & Ethical Principles` (40) vs
  `legal & ethical principles` (5); `Prioritization & Delegation` (41) vs `prioritization & delegation` (5).
- **A free-form long tail** of model-coined strings — `interpreter-supported consent and discharge
  readiness`, `contact precautions workflow for diarrheal illness`, `pediatric dehydration oral
  rehydration teaching`.
- These split the dashboard's by-topic stats and break any topic-keyed feature.

## Root cause (three mechanisms, all must be fixed)

1. **No source of truth.** The canonical set is defined inline *twice* — `scripts/standardize-topics.ts`
   (`CANONICAL_TOPICS`) and `scripts/cleanup-topic-metadata.ts` (`canonicalTopics`) — diverged in
   naming/structure, imported by nothing.
2. **No prevention gate.** `validateQuestion` in `src/schema.ts` enforces only non-empty + English-only
   (CJK regex) on `topic`. Any English string passes. `category` is a closed enum and cannot drift;
   `topic` must be held to the same standard.
3. **Remediation is post-hoc and forked.** Two competing scripts run after the mess exists, with
   different strategies. A clean pass is re-dirtied by the next batch because nothing constrains
   generation or fails the build.

## The cure — four layers

Ordered by dependency. Layer 1 is the keystone; 2–4 import it.

### Layer 1 — Single source of truth: `src/topics.ts`

One module, imported everywhere a topic is asserted, classified, or generated. Category-keyed, with
explicit handling of clinically reusable topics via two classes:

```ts
// Topics that belong to exactly one category.
export const STRICT_TOPIC_CATEGORY: Record<Category, readonly string[]> = { ... };
// Topics legitimately allowed under multiple categories (falls, medication safety,
// discharge teaching, infection control, pain, communication, delegation, etc.).
export const SHARED_TOPIC_CATEGORY: Record<string, readonly Category[]> = { ... };

export const CANONICAL_TOPICS: ReadonlySet<string>;            // flattened union of both
export const isCanonicalTopic: (t: string) => boolean;
export const topicCategories: (t: string) => readonly Category[]; // 1 for strict, N for shared
export const TOPIC_ALIASES: ReadonlyMap<string, string>;       // normalized variant -> canonical
export const normalizeTopicKey: (t: string) => string;         // trim + lowercase + collapse ws
```

Reconcile the two inline lists into this one module under `src/` (so runtime, scripts, and
prompt-export all share it). The canonical set already exists — it needs unifying and relocating,
with names/classes locked in `TOPIC-VOCABULARY-DECISIONS.md`.

**Alias / structure invariants (enforced by a test, not by convention):**

- Every canonical topic aliases to itself under `normalizeTopicKey()`.
- No alias key maps to more than one canonical topic (collision = test failure).
- Every alias target exists in `CANONICAL_TOPICS`.
- Every topic appears in exactly one category unless explicitly listed in `SHARED_TOPIC_CATEGORY`.

### Layer 1b — Generated vocab artifact: `docs/topic-vocabulary.md`

`src/topics.ts` is the source of truth; **humans and prompts never hand-maintain a second copy.**
Add `npm run export-topic-vocab` that generates a category-keyed markdown table from `topics.ts`:

```
| Category | Allowed topics |
|---|---|
| Management of Care | Prioritization & Delegation; Legal & Ethical Principles; ... |
```

This artifact is the text pasted into generation prompts (Layer 4). Regenerating it is the only way
the prompt vocabulary changes — closing the same duplicate-source hole the whole spec is about.

### Layer 2 — Prevention gate (canonical/CI, hard-fail)

- **Placement: canonical/CI bank-level, not ordinary runtime import.** Keep `validateQuestion`
  permissive for user imports (warn or normalize on a noncanonical topic, but do **not** reject solely
  for that). Enforce the closed vocabulary through `validate-bank`, promotion, and CI — matching the
  existing distinction where bundled `banks/*.json` is the stricter curated surface.
- **Noncanonical topic = hard-fail** at the canonical gate. A warning will rot; topic drift joins the
  same family as the `validate-bank` / `coverage-report` / build failures that already define the
  "content cannot silently degrade" line.
- **Topic×category licensing is phased** to avoid false failures on reusable concepts:
  - **Phase 1 (now):** topic must be canonical — hard-fail. Category mismatch not enforced.
  - **Phase 2:** topic-category mismatch emits an audit report only.
  - **Phase 3 (after human review):** `STRICT_TOPIC_CATEGORY` topics get strict category licensing
    (hard-fail on mismatch); `SHARED_TOPIC_CATEGORY` topics validate against their allowed set.

### Layer 3 — One converged remediation pass (sanctioned one-time canonical write)

The mess is already in canonical, so this is **not** "pre-promotion." Run the explicit override path:

```
cleanup-topic-metadata.ts --allow-canonical --reason "one-time topic vocabulary migration"
```

**Migration safety guards (added after the failed applied run — non-negotiable).** The first applied
attempt wrote 877 changes with *0 unresolved* and corrupted topics wholesale (`cardiogenic shock →
Respiratory & Infectious Disorders`, `PPE & Sterile Technique → Transmission-Based Precautions`). Root
cause: the content classifier never abstains, so it force-resolved everything and the human-review
funnel caught nothing. Two guards make the pass safe:

- **Guard 1 — never reclassify an already-canonical topic.** A topic already in `CANONICAL_TOPICS`
  (case-insensitively) may only be normalized to its canonical casing — never semantically remapped to
  a different canonical topic. The migration maps *noncanonical* topics in; it has no authority to
  re-litigate a topic that is already valid. (`medication safety & admin → Medication Safety & Admin`
  is allowed; `Transmission-Based Precautions → Prioritization & Delegation` is forbidden.)
- **Guard 2 — only exact aliases may write; all semantic resolvers only suggest.** Exact aliases
  (including casing) are the only resolver permitted to mutate `topic`. ID overrides require the same
  review discipline as content rules: they emit suggestions unless they are later promoted into a
  reviewed execution manifest. Every clinical/content-phrase rule emits a review suggestion and
  writes nothing. Consequently the unresolved/suggested list is expected to be **large**, and a run
  reporting **0 unresolved before any human curation is a failure signal** (classifier overmatch), not
  success — the run should flag it, not celebrate it.

- Reconcile the two scripts into one migration that imports `src/topics.ts`. **Retire
  `scripts/standardize-topics.ts`** — the pure string-cascade is the weaker classifier and the
  duplicate source of truth. Keep the content-aware `cleanup-topic-metadata.ts` lineage, refit to
  import the SoT instead of its inline map.
- **Resolver precedence (write path):** exact alias (`TOPIC_ALIASES`, including casing
  normalization) **writes**. ID overrides and content/clinical-phrase rules **suggest only** → review
  list, never the write path. Any noncanonical topic with no exact-alias match routes to either the
  suggestion list (if an ID/content rule fires) or the unresolved human-decision list (if no
  suggestion exists). Explicitly forbid the category-based fallbacks presently in
  `standardize-topics.ts` (`-> "Adult Health"`, `-> "Physiological Adaptation"`, etc.) — a forced
  human-decision list is the whole point.
- **Behavior fix for the survivor:** today `cleanup-topic-metadata.ts` sets `newTopic = override ??
  exact ?? oldTopic`, silently *keeping* an unmatched topic. Corrected: a noncanonical `oldTopic` with
  no override/alias match routes to the unresolved list (never kept as-is, never content-classified
  into a write); a canonical `oldTopic` is kept, casing-normalized only (Guard 1). Content rules never
  enter the write path.
- Cover embedded case-study parts. Validate before and after. Write once.
- Emit `audit/topic-vocabulary-migration-2026-06-16.report.md` containing: changed topics, alias
  hits, ID overrides used, content-rule classifications, unresolved human decisions, category
  mismatches, and before/after unique-topic counts.

### Layer 4 — Constrain at generation (terse, closed-choice)

Inject the generated vocabulary (Layer 1b) into the generation prompts (`opus-case-skeleton-prompt.md`
/ `GeminiPrompt.md` — confirm exact insertion point against the files at implementation time). Keep
the instruction brutal, not philosophical:

```
TOPIC FIELD RULE:
question.topic must be copied exactly from the canonical topic vocabulary below.
Do not invent, specialize, lowercase, pluralize, or translate topic strings.
If no exact topic fits, choose the closest canonical topic and express the specific
clinical angle in the stem/rationale, not in topic.
```

…followed by the pasted category-keyed list. The Layer-2 gate is the backstop when models ignore it;
this prompt rule is the first line. Together they make Layer 3 a one-time event.

## Resolved decisions

| Decision | Resolution |
|---|---|
| Gate placement | Canonical/CI bank-level; runtime import warns/normalizes, never rejects on topic alone |
| Noncanonical topic | Hard-fail at the canonical gate |
| Topic×category licensing | Phased — Phase 1 membership hard-fail; Phase 2 mismatch audit-only; Phase 3 strict licensing for STRICT-class topics after review |
| Canonical-write protocol | One-time sanctioned migration via `--allow-canonical --reason` + full audit report, only after conservative suggestions are reviewed |
| Failed applied migration | `audit/topic-vocabulary-migration-2026-06-16.report.md` is retained as a failed-attempt audit artifact; its canonical bank edits were rolled back |
| Final topic list | Locked in `TOPIC-VOCABULARY-DECISIONS.md`; err slightly coarser than the current tail |
| Shared topics | Medication Safety & Admin = Pharmacological + Safety/Infection Control; Laboratory & Diagnostic Tests = Reduction of Risk Potential + Pharmacological |
| Strict judgment calls | Palliative & Supportive Care = Basic Care and Comfort; Discharge Planning & Handoff = Management of Care; Patient & Environment Safety = Safety and Infection Control; Therapeutic Communication = Psychosocial Integrity; Dosage Calculations = Pharmacological |

## Fit with existing invariants

- Topic-as-closed-vocabulary mirrors `category` already being a closed enum in `schema.ts`.
- SoT in `src/`, with the prompt vocab *generated* from it, eliminates duplicate definitions
  permanently — the root cause does not recur.
- Topic stays English-only; the CJK Tier-0 check is unchanged and fires first.
- No schema bump: `topic` stays a string. Validation + content-hygiene change only.

## Acceptance criteria

- `src/topics.ts` is the only definition of the canonical vocabulary; both inline copies are gone;
  `standardize-topics.ts` is retired.
- Alias/structure invariants pass as a test (collisions, self-alias, target existence, single-category
  unless shared).
- `npm run export-topic-vocab` produces `docs/topic-vocabulary.md`; the generation prompts consume
  that artifact rather than a hand-maintained list.
- The Layer 3 migration **writes only exact aliases**; it never reclassifies an already-canonical
  topic and never writes an ID/content-rule guess. A run reporting 0 unresolved/suggested rows before
  human curation fails as a classifier-overmatch signal.
- Canonical banks reach full `CANONICAL_TOPICS` coverage (including embedded case parts) **only after**
  the unresolved/suggested rows are alias-resolved, ID-overridden, or human-adjudicated across
  iterations — not in a single automated pass; no silent category fallback occurred.
- A canonical bank with a noncanonical topic hard-fails `validate-bank` / promotion / CI; a user
  import with a noncanonical topic does not reject on that basis alone.
- Generation prompts carry the terse TOPIC FIELD RULE + pasted vocabulary.
- Dashboard by-topic and topic-keyed features show one entry per real topic — no casing or tail splits.
