# Approved burn-map integration

Owner authorization (2026-09-13): “You can implement this version and push it to live.” This supersedes the earlier proposal-only publication limit for the selected Astra arm refinement. The integrated version uses the owner-selected fuller arms and Gemini-adapted grouped hands, with no further design changes.

Disk-reading snapshot: isolated `codex/burn-map-fuller-arms-live` worktree based on `e26e6a39a50f6593c4b27950663b6db520d68cd7` (`main` and fetched `origin/main`). Unrelated local files in the main worktree were preserved. Producer/integrator: Codex / GPT-6 Astra; no delegated or producer-independent review is claimed.

Both renderer source files are byte-identical to the approved `scratch/burn-map-astra-arm-refinement-2026-09-12/candidate` files. [Source verification](source-results.json) records their hashes, unchanged semantic implementation and region tables, and exact equality of all emitted geometry with the prior numerical geometry evidence. [Geometry evidence](geometry-receipt.json) covers thirteen valid positive-area contours, all 78 pairs at three subdivision resolutions with zero intersection area, and patient laterality. This is numerical corroboration, not a symbolic proof.

This is mechanical integration of an owner-selected presentation under DECISIONS P2. No question content, source attribution, schema, grading, region ownership, clinical values, or interpretation was authored or changed. It does not reopen pediatric eligibility or certify a new clinical visual lane. The existing renderer tests retain their semantic assertions; obsolete incumbent color/landmark assertions were replaced with checks for the approved display envelope, all thirteen fill owners, whole-contour laterality, independent perineal/leg selection, and deterministic selection order.

Verification on the integrated application source:

- Kind-specific burn-map test and `npm run test-visuals`: passed, including self-check regressions and all 199 promoted visual snapshots.
- Standard `parity:rebaseline --scope burn_map --before-ref e26e6a39a50f6593c4b27950663b6db520d68cd7`: exactly ten SVG hash changes, zero additions/removals, and 189 unchanged records. All ten declared keyed numeric values and before/after self-check results match; see the [generated parity receipt](../visual-parity-rebaseline-2026-09-14T01-07-10-202Z/receipt.json).
- TypeScript, all thirteen top-level bank validations, census drift check, and production build including the file-compatible build: passed. Census was not regenerated.
- Real Chrome: desktop, mobile, and `file://` app smoke passed, with all thirteen rendered paths matching the approved source; ordinary, expanded, scrolled, and restored states checked. No page errors or document overflow. The existing expanded view retains its readable minimum size and scrolling; Escape restores trigger focus. [Browser results](browser-results.json) and adjacent PNGs record these checks.

The initial browser harness used an overly strict implicit-label selector and timed out before selecting a question. Correcting the harness to use the observed Preview Lab select controls resolved it; no application change was required.

Local preview build identity embeds the base commit because verification occurred before the integration commit. The production workflow builds the final pushed commit; deployment success and served build identity must be verified after publication.
