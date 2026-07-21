# Temperature Prose Residual Adjudication

Generated from the accepted survey residuals without mutating canonical bank content.

- Decisions: 5
- Residual occurrences consumed exactly once: 15
- Authorized target fields: 11
- Canonical bank writes in this pass: 0
- Input: `review-residuals.jsonl`
- Output: `residual-adjudication.jsonl`
- Output SHA-256: `918560851164235625a532ec890e675976e9ea018c530e53a58c3dbef7d698fa`

## Decisions

1. **temperature-residual-01-tb-measured-vital** — Normalize the Chinese-only TB measured vital from the Celsius-authored value. (1 residual row, 1 field)
2. **temperature-residual-02-delirium-measured-vital** — Normalize the bilingual delirium/UTI measured vital from the Celsius-authored value. (2 residual rows, 2 fields)
3. **temperature-residual-03-neutropenic-fever-threshold** — Preserve the published neutropenic-fever threshold pairing while reordering it. (4 residual rows, 4 fields)
4. **temperature-residual-04-tpn-measured-vital** — Correct the erroneous Fahrenheit counterpart for the bilingual TPN measured vital. (2 residual rows, 2 fields)
5. **temperature-residual-05-transfusion-delta-rewrite** — Rewrite the bilingual transfusion rationale with explicit paired temperature deltas. (6 residual rows, 2 fields)

## Closed-migration contract

Every target records its bank path, owner IDs, JSON path, survey occurrence IDs and indexes, complete original field text and hash, exact resulting expression or complete rewrite, and complete resulting field text and hash. A later applicator must reject any preimage mismatch.

The 16 survey rows classified as `COUNTERPART_MISSING_TEMPERATURE` remain known pre-existing parity debt. They are not residual adjudications and do not authorize adding or removing counterpart clinical facts.
