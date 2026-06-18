# Codex Spec — 835-Residual Reclaim Pass (parents + child-category guard)

A scoped follow-up to the 2026-06-17 residual run. It reclaims the two **non-judgment** debt buckets without
re-touching the 493 already written or the 75/41 judgment buckets (handled separately by GPT sessions + the
category-correction worklist). Same standing guards apply: **non-Gemini classifier, proposal-only, no
canonical write except via the approved-manifest path.**

## Background (from the 2026-06-17 manifest)

835 residual → 493 proposed+written, **342 remaining**, which decomposes as:
- 90 `context-incomplete` — *all* "id not found"; *all* case-**parent container** ids (no `_qN` suffix).
- 136 `category-untrusted` — *all* "parent category differs from child category"; mostly `_qN` **children**.
- 41 `blocked-cross-category` — category-drift → `blocked-41-category-correction-worklist.md` (not here).
- 75 `unresolved` — genuine topic calls → `gpt-unresolved-75-sessions.md` (not here).

This pass addresses the first two only.

## Part 1 — Resolve the 90 parent containers

Hypothesis (id-shape-confirmed): these ids are case **parents**; the gradeable, topic-bearing records in
canonical are their `_qN` children, so hydration by parent id finds nothing.

For each of the 90 ids:
1. Determine whether the id exists in canonical as a **gradeable record that carries its own `topic` field**
   (recursive lookup; not merely as a container node).
2. Classify:
   - **not-gradeable container** (expected majority): the parent has no own `topic` to fix → **drop from the
     residual**. Record its `_qN` children and their current (post-write) topics for the audit trail.
   - **gradeable with own topic** (if any): route it back into the normal proposal flow on a later pass —
     it was wrongly skipped, not a phantom.
3. If the schema gives case parents a *filter-level* topic field that must be canonical (confirm against
   `NCLEX-Question-Schema.md` / `src/types.ts`), set it deterministically from the children's now-canonical
   topics (e.g. modal child topic), **flagged for Luke**, never auto-written.

Output `audit/residual-reclaim-parents-<rundate>.md`: per parent — gradeable? · children ids · children
topics · recommended disposition (drop / requeue / derive-filter-topic). No canonical write in this part.

## Part 2 — Recalibrate the child-category guard, then re-run the 136

**Root cause:** Step 2 currently raises `category-untrusted` on *any* parent≠child category mismatch. Case
children legitimately span categories (a Management-of-Care discharge case with Health-Promotion and
Pharmacological children is correct), so the guard over-fires.

**Recalibration (deterministic):** a case child is **trusted** when its *own* `category` is a valid canonical
category. License its candidate set off the **child's own category**, independent of the parent. Raise
`category-untrusted` only when the child's own category is missing / noncanonical, or the child's residual
category disagrees with its hydrated canonical category. Parent≠child alone is **not** mistrust — at most an
informational note in the Category Integrity section.

**Re-run (proposal-only):** for the 136 now-trusted children, regenerate the pipeline — emit a fresh
model-input queue, classify with the **same non-Gemini** model, produce a **delta** manifest +
by-category report in the v2 shape (statuses, abstention healthy, dominance flags, separate
blocked/untrusted tallies). Luke adjudicates / bulk-approves exactly as before; approved rows write through
the approved-manifest tool, never directly.

Expected: the bulk reclassify as `proposed`; a residue lands in `unresolved`/`blocked-cross-category` and
joins the existing judgment queues.

## Invariants

1. The 493 already-written ids are never re-touched.
2. The 75 `unresolved` and 41 `blocked` ids are out of scope here (their own flows).
3. Guard recalibration is deterministic; only the re-run's per-item proposal is model judgment.
4. Re-run is proposal-only; no canonical write except via the approved-manifest path (non-Gemini, dry-run
   default, `--allow-canonical --reason`).
5. Part 1 writes nothing to canonical; parent dispositions are recommendations for Luke.
6. Output is a delta manifest + reports + the parent reconciliation list.

## Out of scope

- The 41 category corrections and the 75 unresolved (separate artifacts).
- Any `coverage-report` recompute (downstream, after all residual buckets settle).
- Ledger / PROJECT-HISTORY authorship (Luke).
