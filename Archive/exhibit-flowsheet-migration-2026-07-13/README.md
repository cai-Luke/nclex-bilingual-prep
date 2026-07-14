# Exhibit Flowsheet Migration Archive

Archived 2026-07-13 after the values-only structured-measurement migration closed with no open
holds. This directory preserves the generated manifest, staged extraction batches, adjudications,
promotion candidates, comparison reports, handoffs, and correction artifacts. Filenames are kept
unchanged so historical references remain searchable.

Batch 19 is a failed serial classification pass and is retained only as failure provenance. Batch
20 is the authoritative serial redo. Neither Batch 19 nor any superseded hold/candidate artifact in
this directory is an actionable promotion input.

The live governing surfaces remain at the repository root:

- `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` — the active extraction contract (Rules A–F, GATE 1–4, record shape), retitled from its original "proposal" framing; its own worst-case smoke-batch content has been trimmed to a pointer into this directory.
- `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md` — ledger of record.
- `scripts/exhibit-flowsheet-gate.ts` and `scripts/apply-structured-measurements.ts` — current executable gate and applicator.

This directory additionally holds two specs whose implementation is complete and exercised by
promoted content, moved here from the root during the 2026-07-13 documentation cleanup:

- `EXHIBIT-FLOWSHEET-MULTI-COLUMN-STAGING-CONTRACT-2026-07-12.md` — implemented multi-column
  contract; current behavior is owned by the gate/applicator sources above, not this document.
- `exhibit-flowsheet-migration-batch-protocol-codex-spec.md` — completed batch protocol, retained
  for reproducibility.

Also archived here: `r9-age-marker-day-unit-codex-spec.md` and
`r9-age-marker-week-unit-codex-spec.md`, the implemented R9 pediatric-detector day-unit and
week-unit work orders (both merged; current behavior lives in `scripts/exhibit-flowsheet-gate.ts`).

The historical staging generators still emit their original root-level filenames when deliberately
rerun. Do not treat a regenerated file as reviewed or current merely because its name matches an
artifact in this archive; it must re-enter the current gate and independent-review path.
