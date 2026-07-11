# Exhibit Flowsheet — Migration Batch Protocol (Codex Spec)

Date: 2026-07-04
Author: Claude (architect seat). Implementer: Codex.
Scope of this spec: how to produce **staged** flowsheet-extraction artifacts for the
mechanically-recoverable case-study panels, gated and sample-adjudicated. Per the bounded GO in
`EXHIBIT-FLOWSHEET-BLIND-ADJUDICATION-2026-07-04.md`, this produces staged artifacts only — it does
**not** write to canonical banks and does **not** render. Canonical/render is the separate product
pass (`structured-measurements-schema-1.8-codex-spec.md`).

## Prerequisites (must land first, in order)

1. `measurement-allowlist-codex-spec.md` fully implemented: `src/measurementAllowlist.ts` built, the
   CBC registry fix (step 0) applied, gate refactored to import the shared module, drift-guard test
   passing. The migration must run against the shared allowlist, not the gate's old hand-mirror.
2. Gate + scorer on disk and green: `scripts/exhibit-flowsheet-gate.ts`,
   `scripts/exhibit-flowsheet-blind-score.ts`, `test:flowsheet-gate` passing.

## Step 1 — build the panel manifest (deterministic classification)

Before extracting anything, produce a manifest of every in-scope panel and its bucket. Write
`scripts/exhibit-flowsheet-manifest.ts` (register `flowsheet-manifest`) that scans the canonical
banks for case-study exhibits (`caseStudy.exhibits[]` and `caseStudy.stages[].exhibits[]`) whose
`content.en` contains ≥1 allowlisted measurement (reuse the gate's `LABEL_PATTERNS` + shared
allowlist), and classifies each into exactly one bucket by **structural heuristic** (not by asking a
model):

- **`clean_kv`** — the measurements appear as a newline/`Label: value unit` block with no additional
  narrative sentence interleaved. These are the deterministic-lift panels (Claude's earlier probe put
  this at ~22 of 242).
- **`prose_embedded`** — measurements embedded in ≤ ~2 narrative sentences, contiguous (~105).
- **`scattered`** — measurements spread across the exhibit / mixed with substantial narrative (~115).
- **`serial`** — the gate's `serialParams` fires (≥2 timepoints on a repeated parameter). These do
  **not** get a flowsheet (they are trend-chartable or serial by construction); manifest them as
  `serial` and exclude from extraction.

Emit `EXHIBIT-FLOWSHEET-MANIFEST-<date>.json`: an array of `{ exhibitRef, bucket, measurementCount,
bankFile }`, plus a summary count per bucket. This manifest is the migration's work queue and its
denominator. The heuristic is allowed to be imperfect at the boundary (prose_embedded vs scattered) —
misclassification only changes ordering and sampling intensity, never correctness, because every
batch is gated regardless. The clean_kv/serial calls must be precise; the prose split can be fuzzy.

## Step 2 — batch order and size

- **Batch size: 20 panels.** ~12 batches across the ~232.
- **Bucket order: `clean_kv` → `prose_embedded` → `scattered`.** Clean-KV first is a deliberate
  confidence-builder: it proves renderer ergonomics and the end-to-end loop on the safest material
  before any prose-parsing risk. Scattered last, when the loop is most trusted. (This adopts the
  structural triage from the external GPT review as *sequencing*, not as the "defer prose entirely"
  ruling that review proposed — our gated + sampled + stop-rule loop handles the prose risk that
  review was worried about.)
- One bucket is fully drained before the next begins.

## Step 3 — per-batch loop

For each batch of 20:

1. **Extract** (extractor model). Produce `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-<NN>-<bucket>-<date>.json`
   in the amended record shape (`panel[]` with `sourceUnit`/`sourceSpan`/optional `context`,
   `excludedValues[]` reason ∈ {prior,trend,serial}, `unitAliases[]`, or `skip_serial`). Under Schema
   2.0, censored values are keyed with typed `bound`; the gate's acceptance of an excluded
   `comparator` reason is compatibility-only for legacy/pre-2.0 staged artifacts and is not a current
   authoring alternative. The extractor never sees the adjudication (below).
2. **Gate** (deterministic, required). `npm run flowsheet-gate -- <batch>.json`. Any **FAIL** blocks
   the whole batch — fix the cause and re-extract; do not hand-patch a failing record past the gate.
   **GATE 4 WARN** and serial-mismatch WARN route to adjudication (they can be legitimate).
3. **Adjudicate the sample** (Claude or a non-extractor model — producer≠checker). This is the
   selection check the gate cannot do. For each sampled panel, independently determine from
   `content.en` the correct disposition (which values are current-keyed, which are prior/trend/serial
   excluded, which are post-intervention context, which are out-of-scope silent), then compare to the
   extractor's output. Record the sample, the picks, and any discrepancy in a per-batch note
   `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-<NN>-ADJUDICATION-<date>.md`.

### Sampling rate (the extended-validation ramp)

The blind validation that earned the GO was on *synthetic* traps. Real prose is unseen and more
varied, so the sample rate starts high and tapers only as the real-bank error rate proves out:

- **First 2 batches of each bucket: 100% adjudication** (all 20 panels). This is real-bank extended
  validation, per-bucket, because the three buckets are genuinely different material.
- **Taper to 25% random once a bucket proves out.** "Proves out" = two consecutive fully-adjudicated
  batches in that bucket with **zero** selection errors. After that, sample 25% (≈5 of 20) by a
  seeded random pick recorded in the note.
- **Always-sampled categories (100%, on top of the random draw, every batch, every bucket):** every
  GATE 4 WARN; every `skip_serial` record that slipped into an extract batch; every panel whose keyed
  `sourceUnit` is a non-canonical alt (the CBC `/µL`, `×10³/µL`, `K/µL` cases — the platelet-defect
  class); every `post_intervention` context tag; every record carrying an `excludedValues` entry (the
  prior/trend selection call). These are where a miss is most likely and most costly.

### Stop rule

Any adjudicated **selection error** (wrong current-vs-prior key, an out-of-scope leak, a mis-tagged
post-intervention, a wrong serial-lane call) **halts the run**. Understand the cause before
continuing; re-extract the affected batch; if the error class isn't already in the always-sampled
set, widen it. A halt is a signal, not a failure — it is the mechanism that keeps a systematic defect
from propagating across 232 panels.

## Producer≠checker at scale

Generator ≠ extractor ≠ adjudicator. The extractor model never gates or scores its own batch. The
adjudication sample's "correct disposition" is authored by Claude or a second model that did not
extract. Claude remains the final clinical gate. Nothing here relaxes the extraction contract.

## Outputs of the whole run

- The per-batch staged extraction JSONs (validation artifacts; **not** bank content).
- The per-batch adjudication notes.
- A `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-<date>.md`: per batch, the bucket, sample rate used, sample
  size, selection errors found, and disposition. This is the provenance record the product pass reads
  to decide what is safe to promote into `structuredMeasurements` blocks.

The staged corpus is the **input** to the product pass. Nothing here is canonical or rendered until
schema 1.8 + the renderer land and the supplement-vs-replace decision is made.

## Explicitly out of scope

- No canonical bank writes. No `structuredMeasurements` blocks. No render. No schema change.
- The ~10 panels the containment probe could not mechanically recover are **not** in this run — they
  are a separate, smaller manual-adjudication lane and were never expected to flow through this
  pipeline.
- H/L flags and reference-range columns — gated on the reference-range lane; not produced here (this
  is values-only).

## Decision Luke still owns

Whether to run all three buckets or **stop after `clean_kv`** and reassess. The clean-KV batch is the
low-risk proof; the prose buckets are the volume. The staged-artifact design makes "run it all" safe
via the ramp + stop rule, but the go/no-go on the prose buckets can be taken after clean_kv reports.
The protocol supports either — it just drains buckets in order and can be halted between them.
