# Topic Vocabulary Hygiene — Cure Spec

Status: **implementation corrected after failed applied migration.** Topic-list/class decisions are
resolved (see Resolved Decisions and `TOPIC-VOCABULARY-DECISIONS.md`), but canonical bank writes are
paused pending review of conservative suggestions. Keep the failed applied report as an audit
artifact. Layer 3 now carries the two migration safety guards that the failed run violated and resolves
the residual via a **gated LLM pass**, not a keyword classifier. Content generation is **frozen** until
the freeze lift conditions below are met. The alias map is two-tier (lexical writes / semantic
suggests), every write is category-license-checked, and proposed topics are never wired into the write
path until approved.

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
- **Guard 2 — only the lexical alias tier may write; every other resolver only suggests, and every
  write is category-checked.** `src/topics.ts` splits aliases into `LEXICAL_ALIASES` (`TOPIC_ALIASES`)
  and `SEMANTIC_ALIASES` (`SEMANTIC_TOPIC_ALIASES`). Only the **lexical** tier mutates `topic` —
  casing/abbreviation variants plus human-curated mappings explicitly signed off (the caregiver
  aliases). `SEMANTIC_ALIASES`, ID overrides, and the LLM pass emit suggestions into the proposal
  manifest and write nothing. **Even a lexical write must pass the category-license check**: if the
  alias target is not licensed for the item's trusted `category`, it does not write — it routes to a
  blocked cross-category suggestion, exactly like the LLM pass. The deterministic path does not get to
  skip the gate the semantic path obeys. Consequently the unresolved/suggested list is expected to be
  **large**, and a run reporting **0 unresolved before any human curation is a failure signal**
  (classifier overmatch), not success — the run should flag it, not celebrate it.
- **Guard 3 — a *proposed* topic never enters the write path until approved.** A topic under “Approved
  additions” only after Luke signs off; while it sits under “Proposed additions (pending approval)” in
  `TOPIC-VOCABULARY-DECISIONS.md` it must not appear in `TOPICS`, `STRICT/SHARED_TOPIC_CATEGORY`, or
  `LEXICAL_ALIASES`. Approval *is* moving it out of “proposed”; wiring it into code beforehand silently
  converts a proposal into an auto-write. (`Caregiver Role Strain & Family Coping` is now approved and
  locked into the lexical tier; its three aliases write.)

- Reconcile the two scripts into one migration that imports `src/topics.ts`. **Retire
  `scripts/standardize-topics.ts`** — the pure string-cascade is the weaker classifier and the
  duplicate source of truth. Keep the content-aware `cleanup-topic-metadata.ts` lineage, refit to
  import the SoT instead of its inline map.
- **Resolver precedence (write path):** lexical alias (`TOPIC_ALIASES`) → **write** (subject to the
  category-license check); `SEMANTIC_ALIASES`, ID overrides, and the LLM pass → **suggest only** →
  proposal manifest. Any noncanonical topic with no lexical-alias match routes to the suggestion list
  (semantic alias or LLM proposal) or, failing both, the unresolved human-decision list. The
  `standardize-topics.ts` category fallbacks (`-> "Adult Health"`, `-> "Physiological Adaptation"`,
  etc.) remain forbidden — a forced human-decision list is the whole point.
- **Behavior fix for the survivor:** today `cleanup-topic-metadata.ts` sets `newTopic = override ??
  exact ?? oldTopic`, silently *keeping* an unmatched topic. Corrected: a noncanonical `oldTopic` with
  no lexical-alias match routes to the unresolved list (never kept as-is, never semantically resolved
  into a write); a canonical `oldTopic` is kept, casing-normalized only (Guard 1). Semantic proposals
  never enter the write path; they flow to a reviewed execution manifest.
- Cover embedded case-study parts. Validate before and after. Write once.
- Emit `audit/topic-vocabulary-migration-2026-06-16.report.md` containing: changed topics, alias
  hits, semantic proposals, unresolved human decisions, **blocked cross-category suggestions**
  (counted separately), **category-untrusted** rows, and before/after unique-topic counts.

**Semantic resolution of the residual — gated LLM pass, not a keyword classifier.** The residual is a
*flat* tail: 633 distinct old-topic strings across 902 rows (~1.4 rows/string), so alias curation has
no leverage and a bulk resolver is unavoidable. The keyword classifier overmatches *structurally*
(`heparin` in a distractor → Anticoagulant Therapy; `isolation` homonym → Transmission-Based
Precautions; `priority` stem-idiom → Prioritization & Delegation), and tightening triggers only chases
the symptom. Replace it with a model reading the item, under hard constraints:

- **Category-license candidate filter.** The candidate set is the canonical topics licensed for
  `question.category` (STRICT = that category; SHARED via the allowance map); the resolver may only
  choose from that set. A proposal outside the set is recorded as a **blocked cross-category
  suggestion**, counted *separately* from unresolved — never silently applied. (Measured: 38% of the
  prior run's 820 suggestions were cross-category and die here for free.)
- **Category trustedness.** Use category as a license *only if the category is itself canonical and
  trusted*. If `question.category` is missing, noncanonical, or internally contradictory, do not force
  a topic inside it — emit `UNRESOLVED: category-untrusted`. Otherwise category-scoping would launder
  bad category metadata into locally-valid-looking topics.
- **Scoped classification context.** Feed the model only `stem + correct-answer text + correct-answer
  rationale`. For case children: `child stem + child correct answer + child rationale`, plus at most a
  one-line parent title/diagnosis — never distractors, incorrect-option rationales, glossary, or full
  parent exhibits/stages. A medication or keyword appearing only in a distractor must not influence
  classification.
- **No self-review.** A model never topics its own output. Split the residual by item origin so no
  model classifies items it generated, *or* treat the pass strictly as a proposal requiring a
  different model plus human spot-check before any write. **Origin means the model that authored the
  `topic` field — including a compile step that set it — not merely the ID prefix**: an Opus-skeleton
  item whose topic Gemini set during compilation counts as Gemini-origin for this split. Either way the
  pass yields a **proposal manifest**, not a write.
- **Acceptance gates before any semantic write.** Cross-category blocks reported separately;
  unresolved stays nonzero unless genuinely resolved; review **by category**, not globally; no target
  topic with absurd dominance (the `Anticoagulant Therapy: 119` smell test must not recur); and no
  semantic write mode until a human-approved execution manifest exists.

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

## Generation freeze (content lanes)

Content generation is **frozen** while topic hygiene is unresolved, for two independent reasons: (1)
`coverage-report` reads per-topic counts, and with ~900 items mis-topic'd it is misreporting where the
gaps are — generating now feeds false gaps and starves real ones; (2) every batch under the
uncontrolled regime mints fresh noncanonical strings, compounding the tail. The freeze has **two lift
conditions, lifted independently**:

- **Stop-the-bleeding (lift first, cheap):** Layer 4 lands — the prompt-level closed vocabulary is
  injected and generation emits only canonical topics. Deliverable the moment the list is locked (it
  is). This alone stops *adding* to the tail and can lift the freeze for *new* generation.
- **Accurate-targeting (lift second, the bigger one):** the residual is classified (gated LLM pass)
  and `coverage-report` is recomputed against clean topics, so lane-targeting reflects real gaps.
  Required before any *coverage-driven* generation decisions.

The two run in parallel; do not let the 900-item remediation block the one-prompt fix.

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
- The Layer 3 migration **writes only lexical aliases**, each passing the category-license check; it
  never reclassifies an already-canonical topic and never writes a semantic/ID guess. A run reporting 0
  unresolved/suggested rows before human curation fails as a classifier-overmatch signal.
- The semantic resolver is **category-license-constrained**: every proposal is within the licensed set
  for the item's (trusted) category, or recorded as a blocked cross-category suggestion, or
  `category-untrusted` — never an unconstrained free choice. No semantic write occurs without a
  human-approved execution manifest, and review is conducted per-category.
- The alias map is two-tier: only `LEXICAL_ALIASES` write (each category-license-checked);
  `SEMANTIC_ALIASES` (e.g. `dvt`, `pain management`, grief routing) only suggest. No proposed
  (unapproved) topic is wired into `TOPICS`/`SHARED`/`LEXICAL_ALIASES`.
- The migration report counts **blocked cross-category** and **category-untrusted** rows separately
  from unresolved rows.
- Canonical banks reach full `CANONICAL_TOPICS` coverage (including embedded case parts) **only after**
  the unresolved/suggested rows are alias-resolved, ID-overridden, or human-adjudicated across
  iterations — not in a single automated pass; no silent category fallback occurred.
- A canonical bank with a noncanonical topic hard-fails `validate-bank` / promotion / CI; a user
  import with a noncanonical topic does not reject on that basis alone.
- Generation prompts carry the terse TOPIC FIELD RULE + pasted vocabulary.
- Dashboard by-topic and topic-keyed features show one entry per real topic — no casing or tail splits.

## Task routing — next run

1. **Lock `src/topics.ts` (Claude Code).** Build the SoT from `TOPIC-VOCABULARY-DECISIONS.md` (45
   locked topics + the two SHARED entries), the alias map, the structure-invariants test (Layer 1),
   and `npm run export-topic-vocab` → `docs/topic-vocabulary.md` (Layer 1b). Deterministic; no model
   judgment.
2. **Refit the migration (Claude Code).** Retire `standardize-topics.ts`; make the survivor
   exact-alias-write-only with the category-license candidate filter, scoped context, category-
   trustedness handling, and separate blocked/untrusted accounting. Re-emit `.exact-only` + `.dry-run`
   reports. Writes no semantic proposals.
3. **Semantic proposal pass (LLM, not the item's origin model).** Run the gated pass over the residual
   to produce a proposal manifest (category-scoped, scoped context, no self-review by origin split).
   Output is a manifest for review, not a write. *(This is the optional Gemini-tokens job — acceptable
   only for items Gemini did not generate.)*
4. **Land Layer 4 prompt vocabulary (Claude Code) — parallel with 1–3.** Lifts the stop-the-bleeding
   half of the freeze.
5. **Human pass (Luke).** Review the proposal manifest **by category**, approve into an execution
   manifest, authorize the one semantic write. Confirm/append `Caregiver Role Strain & Family Coping`
   (decisions doc) before classification if approved.
6. **Recompute coverage; lift the accurate-targeting freeze.**
