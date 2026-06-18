# Codex Spec — Gemini-52 Approved-Manifest Canonical Write + Verification

The one place in the topic-hygiene rollout where **semantic** proposals reach canonical — and only because
the manifest is human-reviewed and corrected. This tool executes an approved execution manifest; it never
re-derives, "improves," or re-classifies proposals.

## Preconditions (state — reconfirm live, do not trust this note)

- `proposal_manifest_gemini.json` is the **approved** execution manifest: 52 entries, reviewed + corrected by
  Luke (TBSA recategorization to Physiological Adaptation → Burn Management; grief construct-based routing;
  GCS / ET-suctioning recorded as weak-but-licensed RRP compromises). Entry shape:
  `{ id, category, oldTopic, proposedTopic, reason }`.
- Prior reconciliation (must be re-run by this tool, not assumed): **51 PENDING** (canonical still at
  `oldTopic`), **1 already-WRITTEN** — `gemini_u5_fib_or_2026_06_09_fib_tbsa_04`, already at `Burn Management`
  via an out-of-band fix.

## Authority

Default mode is **`--dry-run`** (plan only). Canonical mutation occurs **only** under
`--allow-canonical --reason "<text>"`, and only after a dry-run plan has been produced. Suggested reason:
`"gemini-52 approved semantic topic execution manifest"`.

## Inputs

- `proposal_manifest_gemini.json` — approved manifest. Extract `{id, oldTopic, proposedTopic}` per entry.
  Tolerant of both a top-level array and an object-with-numeric-keys shape (iterate values; pull `id`).
- `src/topics.ts` — SoT: `CANONICAL_TOPICS` (membership), `STRICT_TOPIC_CATEGORY` / `SHARED_TOPIC_CATEGORY`
  (licensing), `normalizeTopicKey`. Confirm export names against the file.
- `banks/*-canonical.json` — write targets, located by `id` (recursive; case children are nested).

## Pipeline

### Step 1 — Recursive id index
Build `id → { bankFile, jsonPath, currentTopic, trustedCategory }` over every `banks/*-canonical.json`,
traversing nested case structures (same recursion the 835 tool needs; a flat `questions[]` scan misses case
children). For each manifest id, resolve its current record.

### Step 2 — Per-id classification (deterministic; fail-closed)
Normalize with `normalizeTopicKey` on both sides before comparing.

| Class | Condition | Action |
|---|---|---|
| **WRITE** | current == `oldTopic` **and** `proposedTopic` ∈ `CANONICAL_TOPICS` **and** `proposedTopic` licensed for trusted category | apply |
| **SKIP-DONE** | current == `proposedTopic` | no-op (e.g. TBSA) |
| **ABORT-GUARD1** | current is already canonical **and** != `proposedTopic` | block — migration may not remap an already-canonical topic |
| **ABORT-DRIFT** | current is noncanonical **and** != `oldTopic` | block — state drifted since proposal |
| **ABORT-LICENSE** | `proposedTopic` ∉ `CANONICAL_TOPICS`, or not licensed for the trusted category | block |
| **ABORT-CAT-UNTRUSTED** | category missing / noncanonical → can't license-check | block |
| **ABORT-MISSING** | id not found in any bank | block |

**Default fail-closed:** if any id lands in an `ABORT-*` class, the run produces the plan and **does not
write** — those items are exactly the ones needing human eyes. An explicit flag may later authorize writing
only the `WRITE` set while leaving aborts for separate handling, but that is opt-in, not default.

### Step 3 — Dry-run plan (default output)
Emit counts per class and a per-id table `(id, currentTopic, oldTopic, proposedTopic, class)`. No mutation.

### Step 4 — Write (only under `--allow-canonical --reason`)
For each `WRITE` id, set `topic = proposedTopic` **in place**. Change only the topic field — nothing else.
Write each affected bank file exactly once.

## Verification (post-write, deterministic — the point of this spec)

- **V1 — Re-reconcile:** every `WRITE` id now reads `proposedTopic`; every `SKIP-DONE` id unchanged; no
  `ABORT-*` id mutated.
- **V2 — Exact diff:** diff each affected bank before/after; assert the **only** changed JSON paths are the
  `topic` fields of the `WRITE` ids. Changed-field count == `WRITE` count. No collateral edits, reordering,
  or whitespace churn elsewhere.
- **V3 — validate-bank:** run `validate-bank` / `schema.ts` validation on every affected bank; must pass
  (all new topics canonical, English-only CJK Tier-0 intact, no structural breakage).
- **V4 — Vocabulary delta:** report before/after unique-topic counts and the noncanonical `oldTopic`s
  removed; assert none of the written ids still carry their `oldTopic`.
- **V5 — Idempotency:** a second dry-run reports **0 WRITE** (everything now `SKIP-DONE`).

## Outputs

- `audit/gemini-52-write-plan-<rundate>.md` — dry-run plan.
- `audit/gemini-52-write-<rundate>.report.md` — post-write V1–V5 results, applied-id list, before/after
  counts, the `--reason` string used.
- **No silent ledger/history writes.** The `BANK-REVIEW-LEDGER.md` entry and any `PROJECT-HISTORY.md`
  milestone for this canonical promotion are **Luke's to author** (canonical-routing/ledger decisions are
  deferred to execution time).

## Hard invariants

1. Default `--dry-run`; canonical mutation only under `--allow-canonical --reason "<text>"`.
2. Only the `topic` field of `WRITE` ids changes; V2 exact-diff enforces it.
3. Guard 1: an already-canonical current topic is never remapped.
4. Every written `proposedTopic` ∈ `CANONICAL_TOPICS` and licensed for the item's trusted category.
5. Fail-closed on any `ABORT-*` by default; aborts never silently dropped.
6. Already-at-target ids (TBSA) are no-op skips, never re-written.
7. Idempotent: re-running writes nothing.
8. The manifest is approved input; this tool never re-derives or edits proposals.

## Out of scope

- The 835 residual (its own proposal-only tool).
- `coverage-report` recompute (downstream, after both the 52 and the adjudicated 835 land).
- Ledger / PROJECT-HISTORY authorship (Luke).
