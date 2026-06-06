# Topic Metadata Cleanup Verification

Date: 2026-06-06

## Summary

This pass treated `metadata_inconsistencies_audit.md` as untrusted input and verified its claims against the canonical bank JSON files.

Accepted from the Gemini review:

- Six named high-severity examples were real metadata problems or reasonable canonical rollups.
- `gap-fill-50.json` had 33 lowercase/descriptive topic aliases that should be canonicalized.
- `gemini-canonical.json` had a large set of one-off Gemini batch topic aliases that should be canonicalized.

Rejected or deferred:

- Broad "category mismatch" counts were not applied wholesale. Several are taxonomy/product choices rather than clear errors.
- The remaining non-canonical topics are the custom hard-case/case-study labels in `hard-cases-canonical.json`. These are intentionally left for a product decision because they provide useful unfolding-case specificity but do not aggregate cleanly in coverage reports.

## Result

- Non-canonical topic records before Gemini-verification pass: 157 of 992 scanned parent/subquestion records.
- Non-canonical topic records after this pass: 60 of 992.
- Remaining non-canonical records by file:
  - `banks/claude-canonical.json`: 0
  - `banks/gap-fill-50.json`: 0
  - `banks/gemini-canonical.json`: 0
  - `banks/gpt-canonical.json`: 0
  - `banks/hard-cases-canonical.json`: 60

## Verification

- `npm run validate-bank -- banks/*.json`: passed.
- `npm run coverage-report`: passed.
- `npm run build`: passed, with the existing Vite large-chunk warning.
