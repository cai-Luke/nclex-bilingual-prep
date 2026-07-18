# Exhibit Flowsheet — Session Handoff / Index (2026-07-04)

This ties together the exhibit-flowsheet work line for the next Codex session. It is the entry point:
read this, then the specs in dependency order.

> **Provenance note.** The three new specs in this package were authored from Claude's **live reads
> this session** (CLAUDE.md, both visual registries, the gate, the scorer, DECISIONS.md, the schema
> shape) — not from memory — then committed to the repo root with this handoff. Before executing,
> Codex should still verify the one staleness-prone detail: the current `schemaVersion` (this package
> assumes 1.7→1.8; verify against
> `NCLEX-Question-Schema.md` + `src/schema.ts`).

## Where the flowsheet line stands

- **Extraction contract:** defined and twice-amended. `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md`
  (on disk). Rules A–F, GATES 1–4, the record shape. sourceUnit + GATE 4 (platelet-defect fix) and
  Rule F (post-intervention keyed-with-context) are folded in.
- **Deterministic gate:** `scripts/exhibit-flowsheet-gate.ts` (on disk), `test:flowsheet-gate`
  passing. Structural layer: containment, sourceUnit recognition, serial shape, dimensional sanity.
- **Semantic scorer:** `scripts/exhibit-flowsheet-blind-score.ts` (on disk, `flowsheet-blind-score`
  npm script). Reproducible; scored the blind batch **12/12**.
- **Validation verdict:** `EXHIBIT-FLOWSHEET-BLIND-ADJUDICATION-2026-07-04.md` (on disk). Blind set
  (separate generator, held-back key, designed trap distribution) matched 12/12 → the contract
  **generalizes**, not overfits. **GO for staged migration artifacts** — bounded: not canonical, not
  render.
- **CBC units ruling:** recorded in `DECISIONS.md` (2026-07-04). American conventional units, never
  SI. Resolves the shared-module blocker.

## What's DECIDED vs OPEN

**Decided:** CBC American-conventional units (registry canonical for wbc/platelets → `×10³/µL`, drop
SI). Bounded GO for staged artifacts. Values-only first (no H/L, no ranges). Additive/supplement is
the default disposition (prose never mutated). The gate is a required promotion step. The
sample-adjudication policy (batch 20, 100% early then 25% + always-sampled categories, stop rule).

**Open (Luke owns):** whether to run all three migration buckets or stop after `clean_kv` and
reassess. The four product decisions in the schema-1.8 spec (supplement default, render placement +
density cap, first-render scope, one flowsheet kind or two). Reference-range sourcing + the peds
age-band model.

## Dependency order for Codex

1. **`Archive/root-specs-2026-07-18/measurement-allowlist-codex-spec.md`** (already on disk, blocker resolved this session). Build
   `src/measurementAllowlist.ts`; apply the step-0 CBC registry fix (canonical `×10³/µL`, alts
   `[K/µL, /µL]`, drop SI) with the bank-grep precondition; refactor the gate to import it; add the
   drift-guard test. **This is the first build item.**
2. **`exhibit-flowsheet-migration-batch-protocol-codex-spec.md`**. Build the panel
   manifest; run the `clean_kv` batch first at 100% adjudication through gate + scorer. Produces
   staged artifacts + a migration ledger. Not canonical, not render.
3. **`lab-reference-range-verification-spec.md`**. Runs **in parallel** — it's a
   clinical-content/sourcing lane, not blocked by and not blocking the migration. Unblocks the future
   flag/range feature and de-placeholders the registry bands the migration's GATE 4 leans on.
4. **`Archive/root-specs-2026-07-18/structured-measurements-schema-1.8-codex-spec.md`**. The product pass:
   schema-1.8 `structuredMeasurements` field + renderer (reusing table primitives, not a new visual
   kind). **Do not build until Luke rules on the four product decisions.** Consumes the staged corpus
   from step 2.

## Standing discipline (carries through all of the above)

- **Producer≠checker** at every stage: the model that generates/extracts a batch never gates or scores
  it; Claude is the final clinical gate; Luke the final call.
- **Deterministic core, LLM only for the irreducible semantic residual.** The gate and scorer are
  scripts. The only model judgment is current-vs-prior selection, which the sample adjudication checks.
- **Prose is never mutated** (GATE 3 / principle 8). Flowsheets are additive except on pure-KV
  exhibits.
- **No canonical writes or render** until the product pass clears its decisions. Staged artifacts are
  cheap to discard; canonical/render is not.
- **Load-bearing renderers untouched** (principle 6): `lab_trend`/`vitals_trend` are not overloaded;
  the CBC registry edit changes only unit *labels* (no plotted value moves).

## File map

Live root context (repo root / scripts):
- `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` — the contract
- `EXHIBIT-FLOWSHEET-BLIND-ADJUDICATION-2026-07-04.md` — the GO verdict
- `Archive/root-specs-2026-07-18/measurement-allowlist-codex-spec.md` — step 1
- `scripts/exhibit-flowsheet-gate.ts`, `scripts/exhibit-flowsheet-blind-score.ts` + their tests
- `DECISIONS.md` — CBC ruling recorded
- `exhibit-flowsheet-migration-batch-protocol-codex-spec.md` — step 2
- `lab-reference-range-verification-spec.md` — step 3 (parallel)
- `Archive/root-specs-2026-07-18/structured-measurements-schema-1.8-codex-spec.md` — step 4 (product pass)
- `EXHIBIT-FLOWSHEET-SESSION-HANDOFF-2026-07-04.md` — this index

Archived proof/scaffolding artifacts:
- `Archive/root-cleanup-2026-07-05/` — completed smoke/blind batch specs, prior Codex handoffs, and
  the JSON evidence artifacts used by the gate and scorer.
