# Codex Spec — Consolidated Residual Re-Run (post-vocabulary)

One pass that re-classifies **everything not yet written to canonical** against the now-updated `topics.ts`,
collapsing the remaining residual into a single dry-run for one review. Replaces running S02–S10 by hand.
Same standing guards: **non-Gemini classifier, proposal/dry-run only, no canonical write except via the
category+topic writer after Luke approves.**

## Why now

S01's payoff was three global vocabulary/licensing changes, now merged into `topics.ts`:
- `Maternal-Newborn Care & Teaching` → **shared** across HPM / RRP / Physiological Adaptation.
- `Skin & Wound Care` → **new** topic, currently **strict-only Basic Care and Comfort**.
- `Oncology & Immunotherapy Complications` → **new** topic, **shared** Physiological Adaptation / RRP.

These change the candidate set for every still-open item, so the cheapest next step is a single re-run, not
nine more sessions. The candidate sets baked into prior queues are now **stale** and must be recomputed.

## Scope — everything not yet written (≈237 items)

Re-classify the union of all not-yet-written topic items:
- S02–S10 unresolved — 60 (the original 75 `unresolved` minus the 15 S01 already applied).
- Original `blocked-cross-category` — 41 (`topic-residual-proposals-2026-06-17.manifest.json`).
- Reclaim residual — 23 `unresolved` + 4 `blocked` (`residual-reclaim-children-2026-06-17.manifest.json`).
- Reclaim pending proposes — 109 (proposed pre-vocab, **not yet written**); re-score so pre-vocab
  least-fit picks (e.g. an oncology item parked in `Laboratory & Diagnostic Tests`) get upgraded. The prior
  proposed topic/category is **withheld from the classifier** (same anti-anchoring rule as `oldTopic`); the
  old vs new proposal is compared only **after** validation, for the carried-vs-changed report.

**Settled, do not touch:** the 493 written + the 15 S01 applied. **Out of scope:** the 90 parent containers
(separate deterministic parent-topic pass — see §7).

## 0. Preconditions (fail-fast)

- **Build the run set by unique item id/path.** Pull from all sources in §Scope, collapse to one run-row per
  id, and record each row's source membership. Differing prior statuses across sources are informational
  only (the re-run assigns a fresh status), so union the source tags rather than treating them as a
  conflict. Abort only on a true ambiguity — one id resolving to two different canonical records.
- Assert `topics.ts` actually contains the three changes above (topics exist; licensing as stated). Abort if
  not — the whole re-run depends on it.
- Assert classifier is **not Gemini**.
- Recompute every candidate set **live from `topics.ts`**; never reuse a stored `candidateSet`.

## 1. Engine — reuse the S01 adjudication engine

Per item, hydrate scoped context (stem + correct answer + rationale; +one-line parent title for children),
then the model returns one decision type, matching the S01 dry-run schema:
- **topic_only** — a licensed topic fits in the item's current category.
- **category_and_topic** — the item is miscategorized; propose the corrected category + its licensed topic.
  (This is the RRP→Physiological Adaptation drift S01 confirmed; expect a lot of it.)
- **vocabulary_gap** — no canonical topic fits without a new topic or licensing change; emit the proposed
  `topics.ts` change as a **flag only**, do not self-apply. (This is how S01 surfaced oncology/wound.)
- **abstain** — genuinely nothing fits; `unresolved`.

`oldTopic` is never shown to the model. Hard-validate every return: `topic_only` topic ∈ licensed set for
current category; `category_and_topic` topic ∈ licensed set for the *proposed* category; `vocabulary_gap`
not applied. One repair attempt on malformed output, else `unresolved`.

## 2. Consolidated output

Two views, one source of truth:
- **Manifest** (`audit/residual-rerun-<rundate>.manifest.json`) — **complete**: every in-scope row with its
  final validated status (proposed / carried-forward / unresolved / vocabulary_gap / …). The category+topic
  writer consumes this full manifest, not just the changed rows.
- **Dry-run report** (`audit/residual-rerun-<rundate>.dry-run.md`) — human review, in the S01 dry-run shape;
  may emphasize changed-vs-carried rows for readability. Sections:
- **Vocabulary/Licensing Changes Proposed** — batched new gaps (so Luke makes a handful of decisions, not
  one per row).
- **Safety Summary** — counts by decision type; topic-only vs category+topic vs vocab-then-topic; rows
  untouched / not found / ambiguous; and the **overmatch banner if `unresolved == 0`**.
- **S01-impact table** — rows newly resolved by each S01 change, to show whether S01 paid off globally or
  only fixed the first batch. Attribution is computable, not eyeballed: a row counts under a given change if
  its new proposal uses a topic that was **not** licensed for the row's category in the pre-S01 `topics.ts`
  but **is** post-S01. Buckets: maternal shared licensing / Skin & Wound Care / Oncology & Immunotherapy
  Complications / resolved with no S01-dependent change.
- **Dominance + Category Integrity** flags (≥20% global / ≥35% per-category advisory; residual-vs-canonical
  mismatches).
- **Wound-licensing watch (explicit):** report how many wound rows required a **recategorization to BCC**
  solely to reach `Skin & Wound Care`. If that count is non-trivial, recommend promoting the topic to
  **shared (BCC + RRP + Safety)** instead of moving items — same call we made for Maternal-Newborn.
- **Row plan** grouped by decision type, then category, sorted status → proposedTopic → oldTopic → id.
- **Exact before/after diff preview** (category and/or topic fields only) + **stop gate**.

## 3. Hard invariants

1. No canonical write; dry-run + manifest only. Writes happen later via the category+topic writer after Luke
   approves this exact dry-run.
2. `topics.ts` precondition asserted; candidate sets recomputed live.
3. Classifier non-Gemini; `oldTopic` never in model input.
4. Every applied-eligible proposal is licensed for its (proposed) category; vocab gaps flagged, not applied.
5. Settled items (493 written + 15 S01) are never re-touched; the 90 parents are out of scope.
6. Abstention healthy; `unresolved == 0` fails the run as overmatch.
7. Exact-diff: only `category` and `topic` fields change.
8. **Reproducible scaffolding:** record model name, provider, temperature, prompt hash, `topics.ts` hash,
   input manifest hashes, and run timestamp; temperature 0 if available. Steps 0–1 are deterministic except
   the per-item model decision, so re-running with identical inputs should produce either the same plan or a
   machine-readable diff.

## 7. Next (not this spec)

- Deterministic **parent-topic pass** for the 90 containers (derive each parent's filter-topic from its
  now-settled children; proposal-only).
- The **category+topic writer** consumes the approved re-run manifest (dry-run → exact-diff verify →
  `--allow-canonical --reason`), same discipline as the S01 apply.
- Any vocab gaps this re-run surfaces are Luke's `topics.ts`/DECISIONS calls before the dependent rows write.
