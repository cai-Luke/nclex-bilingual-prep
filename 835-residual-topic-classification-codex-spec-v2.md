# Codex Spec v2 — 835-Residual Topic Classification (Proposal-Only)

Supersedes v1. Changes fold in a cross-model (GPT) pre-implementation review plus three additional
guards. **Owner of final calls:** Luke, in the Codex harness, post-run. **Authority of this harness:**
produce a **proposal manifest** for human review. It **never writes to any canonical bank**; no
`--allow-canonical` path exists in this tool.

## 0. Why this is proposal-only (do not re-litigate in code)

Origin per `TOPIC-VOCABULARY-HYGIENE-SPEC.md` is *the model that authored the `topic` field, including the
compile step — not the ID prefix*, and that provenance is **not recoverable** (no author field in the
residual or banks; `banks/banks-raw/` empty; later content authored collaboratively). So we take the spec's
sanctioned alternative: a single **non-Gemini** classifier, **proposal-only**, with human adjudication by
category as the safety net. Gemini is excluded outright (universal compile step → plausibly in the
topic-authoring path for everything it compiled).

Standing guard from the failed migration: a classifier that never abstains force-resolves everything and the
human funnel catches nothing. **Abstention is mandatory; a high unresolved rate is the healthy outcome.
Zero unresolved before human curation is a FAILURE signal (overmatch) — the run must flag it, not celebrate
it.**

## 1. Inputs

- `audit/unresolved_gpt_claude.json` — 835 residual items:
  `{ id, category, oldTopic, context: { stem, correctOptionText, rationale, parentContext } }`.
  **Verified state:** `correctOptionText` and `rationale` are empty for **all 835**; `parentContext` empty
  for 273 (non-case) and populated for the rest (case children); `stem` always present. → hydration (Step 1)
  is load-bearing.
- `src/topics.ts` — SoT. Expected exports (confirm signatures against the file): `CANONICAL_TOPICS`,
  `isCanonicalTopic`, `topicCategories(t)`, `STRICT_TOPIC_CATEGORY`, `SHARED_TOPIC_CATEGORY`,
  `normalizeTopicKey(t)`, `TOPIC_ALIASES`.
- `banks/*-canonical.json` — all canonical banks; read-only, hydration only.
- `NCLEX-Question-Schema.md` / `src/types.ts` — SoT for where the correct answer and rationale live **per
  `itemType`**. Read before writing hydration.

## 2. Pipeline (deterministic core; model judgment only at Step 5)

### Step 0 — Scope assertion (deterministic, fail-fast)
- Assert the configured classifier model is **not Gemini** (substring/family check). Abort the run if it is.
- Assert the 835 input ids are **disjoint** from the Gemini-52 ids in `proposal_manifest_gemini.json`. Any
  overlap aborts the run (scope boundary breach).

### Step 1 — Context hydration (deterministic; load-bearing)
Build a **recursive** `id → { itemType, correctAnswerText, rationale, parentTitle, canonicalCategory }`
index over every `banks/*-canonical.json`, traversing nested case structures (case children carry their own
`id`/`topic`/`category` nested under parent case objects; a flat `questions[]` scan misses them).

Per residual item, hydrate by `id`:
- `correctAnswerText` + `rationale` extracted **per `itemType`** per the schema (mc → correct option text;
  fill_in_blank → blank answer(s); sata → correct subset; matrix → correct mappings). Read the schema; do
  not guess field locations.
- `parentTitle` = at most a **one-line** parent title/diagnosis (truncate hard).
- If the `id` is not found in any bank → `status: context-incomplete`, skip classification (routes to human
  review as-is). Never classify on a bare stem.

### Step 2 — Category trustedness (deterministic ONLY — no clinical inference)
`category-untrusted` is raised **only** from deterministic signals:
- category missing, or a noncanonical category string; or
- **residual `category` ≠ hydrated canonical `category`** for the same id; or
- parent/child category conflict where the canonical child record clearly carries a different category.

**Do not infer category mistrust from clinical content in this tool** — that is the separate category-sanity
pass, not this one. On a residual-vs-canonical mismatch, treat the **canonical bank category as
authoritative** for candidate-set licensing, and record the disagreement in the *Category Integrity* report
section (Step 6). Untrusted items are not force-topic'd.

### Step 3 — Already-canonical short-circuit (deterministic; Guard-1 analog)
If `normalizeTopicKey(oldTopic)` is already canonical → `status: already-canonical`, suggesting only the
canonical-cased form. **Never semantically remap an already-canonical topic.**

### Step 4 — Category-license candidate set (deterministic)
Candidate topics = canonical topics licensed for the item's (authoritative) category: STRICT topics of that
category ∪ SHARED topics whose allowance includes it. Persist the candidate set on each record (the reviewer
sees the menu the model was given).

### Step 5 — Classification (model judgment; proposal-only)
Model input is **only** the scoped context: `stem + hydrated correctAnswerText + hydrated rationale`
(+ one-line `parentTitle` for case children). **Never** include distractors, incorrect-option rationales,
glossary, full parent exhibits — **and never include `oldTopic`** (anchoring on the existing noncanonical
label produces canonicalization instead of independent classification).

The model is shown the **candidate set** (its proposal menu) and, separately, the full `CANONICAL_TOPICS`
list (reachable only via the out_of_category escape). Prompt instruction is explicit: **"Do not choose the
least-bad topic. If no candidate genuinely fits, abstain."**

Structured output, hard-validated:
```json
{ "decision": "propose | abstain | out_of_category",
  "topic": "canonical topic or null",
  "reason": "one short sentence" }
```
Validation:
- `propose` → `topic` ∈ candidate set → `status: proposed`.
- `out_of_category` → `topic` ∈ `CANONICAL_TOPICS` **and** ∉ candidate set → `status:
  blocked-cross-category` (recorded as a category-drift signal, **never** applied as a proposal).
- `abstain` → `topic` null → `status: unresolved`.
- Malformed / schema-violating output → **one** repair attempt; if still invalid →
  `status: unresolved`, `reason: classifier-output-invalid`. Never retry-to-usable (it pressures overmatch).

Keep temperature 0 / low; Steps 0–4 and accounting are fully deterministic and must reproduce run-to-run.

## 3. Output — manifest

`audit/topic-residual-proposals-2026-06-16.manifest.json`:
```json
{
  "meta": {
    "generatedAt": "ISO-8601",
    "inputFile": "audit/unresolved_gpt_claude.json",
    "inputCount": 835,
    "topicsSourceHash": "...",
    "banksSourceHash": "...",
    "classifier": "<model id, asserted non-Gemini>",
    "temperature": 0,
    "schemaVersion": "topic-residual-proposal-v1"
  },
  "records": [
    { "id", "category", "oldTopic", "candidateSet": [],
      "decision", "proposedTopic": null, "status", "reason", "scopedContextHash" }
  ]
}
```
`status ∈ { proposed, unresolved, blocked-cross-category, category-untrusted, context-incomplete,
already-canonical }`. Run-level hashes prove "same deterministic inputs → same hydration."

## 4. Output — review report

`audit/topic-residual-proposals-2026-06-16.report.md`, **grouped by category**, intra-category tables sorted
**status → proposedTopic → oldTopic → id** (so repeated mappings approve/reject in batches). Sections:

- **Status counts** — blocked-cross-category and category-untrusted tallied **separately** from unresolved.
- **Overmatch check** — if `unresolved == 0` pre-curation, a prominent **FAILURE** banner.
- **Hydration summary by itemType** — found X / missing Y per type (distinguishes real missing data from a
  hydration bug; load-bearing given the all-empty residual).
- **Proposed-topic distribution** with **dominance flags** (review flags, not run failures): any proposed
  topic ≥ **20% of all proposed records globally**, or ≥ **35% within a single category**. Thresholds are
  advisory and tunable; a small concentrated category may legitimately trip the per-category flag.
- **Category Integrity** — residual-vs-canonical category mismatches and parent/child conflicts (feeds the
  separate category-sanity pass).
- **Per-category adjudication tables** sized for Luke. Category sizes: Physiological Adaptation 199,
  Reduction of Risk Potential 130, Pharmacological & Parenteral 123, Management of Care 99, Psychosocial
  Integrity 83, Basic Care & Comfort 69, Health Promotion & Maintenance 67, Safety & Infection Control 65.

## 5. Hard invariants (acceptance)

1. No canonical bank modified; hydration reads read-only.
2. Classifier asserted non-Gemini (Step 0); run aborts otherwise.
3. 835 ids asserted disjoint from the Gemini-52 ids; run aborts on overlap.
4. `oldTopic` never enters the model's input.
5. Every applied proposal ∈ candidate set; out-of-set answers recorded as blocked-cross-category, never
   applied.
6. Abstention available and exercised; `unresolved == 0` pre-curation fails the run as overmatch.
7. blocked-cross-category and category-untrusted tallied separately from unresolved.
8. `category-untrusted` raised from deterministic signals only — never from clinical content.
9. Already-canonical topics casing-normalized only, never semantically remapped.
10. Scoped context = stem + correct answer + correct rationale (+ one-line parent title); no distractors /
    incorrect rationales / glossary / exhibits ever reach the model.
11. Malformed classifier output → one repair attempt → unresolved; never retry-to-usable.
12. Steps 0–4 reproduce exactly run-to-run; only Step 5 is model judgment.
13. Output is manifest + by-category report. The downstream human-review → execution-manifest →
    `--allow-canonical --reason` write is a **separate** tool, owned by Luke.

## 6. Out of scope

- Any write to canonical (separate, later spec).
- The Gemini-52 slice (`proposal_manifest_gemini.json`) — its write command + verification is its own spec.
  Do not touch those 52 ids here (enforced by Step 0).
- A clinical-content category audit — deliberately excluded so this tool stays a proposal generator, not a
  silent category re-classifier.
