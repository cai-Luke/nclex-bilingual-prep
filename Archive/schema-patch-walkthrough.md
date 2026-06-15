# Schema Patch Implementation Walkthrough

The documentation reconciliation in `schema-patch.md` is complete after checking the final prose against `src/types.ts`, `src/schema.ts`, the registered visual modules, and `visual-content-lanes-spec.md`.

## Files Changed

### `NCLEX-Question-Schema.md`

- Describes schema `1.2` visuals as deterministic local renderer inputs rather than AI-generated images or external assets.
- Lists all ten implemented visual kinds: `rhythm_strip`, `capnography`, `vitals_trend`, `lab_trend`, `mar`, `io_record`, `medication_label`, `device_screen`, `fetal_monitoring`, and `burn_map`.
- Documents shared visual rules for necessity, `meta.visual_justification`, bilingual learner-facing fields, and English-only `question.topic`.
- Distinguishes trend-style `derived_values_keyed` arrays from arithmetic-lane derivation maps with separate examples.
- Records the implemented item-type, metadata, arithmetic, and self-check contracts for `io_record`, `medication_label`, `device_screen`, `burn_map`, and `mar`.
- Points detailed content-generation and review work to `visual-content-lanes-spec.md`.

### `NCLEX_Audit_Spec.md`

- Adds one schema-authority note directing reviewers to the current schema markdown, runtime implementation, and relevant visual lane spec.

## Runtime Decisions

Where prose could be read more broadly than the implementation, the runtime contract was treated as authoritative:

- Arithmetic values are recomputed by each visual kind's `selfCheck`, which runtime bank validation invokes after structural validation succeeds.
- `mar` supports only `multiple_choice`, `select_all`, and `matrix`; its dose is display-only and it has no arithmetic path.
- The four arithmetic lanes use object-shaped `derived_values_keyed`; trend lanes may use an array of derived series names.
- Visual metadata requirements remain kind-specific. House-required promotion metadata is not described as universally enforced by TypeScript.

## Verification

- Compared all visual taxonomy entries with `src/visuals/types.ts`.
- Compared placement and keyed derivations with the five lane modules under `src/visuals/kinds/`.
- Confirmed the patch changes documentation only: no TypeScript, validators, banks, or clinical content were modified for this reconciliation.
