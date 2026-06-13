PROJECT SHRIMP — MARKDOWN PATCH TASK

Task: Patch `NCLEX-Question-Schema.md` so it accurately reflects the current implemented schema v1.2 visual contracts after the visual roadmap work. This is a documentation reconciliation patch only. Do not change runtime code, validators, question JSON, bank files, or clinical content.

Context:

* `NCLEX-Question-Schema.md` is treated by agents and reviewers as the schema source-of-truth document.
* The runtime source of truth for actual validation is `src/types.ts` + `src/schema.ts`.
* `visual-content-lanes-spec.md` is the current detailed generation/review spec for the completed arithmetic/documentation visual lanes as of 2026-06-13.
* Some external review agents are flagging valid visual JSON because they are working from a stale schema markdown. The goal is to stop those false schema findings.

Primary files to inspect:

1. `NCLEX-Question-Schema.md`
2. `visual-content-lanes-spec.md`
3. `src/types.ts`
4. `src/schema.ts`
5. Optional: `NCLEX_Audit_Spec.md` if it references schema authority or could benefit from one clarifying note.

Patch scope:

* Update `NCLEX-Question-Schema.md` to match the implemented schema v1.2 visual behavior.
* Keep the patch narrow and factual.
* Prefer concise schema-contract prose and small examples over copying the entire lane spec.
* Do not redesign the schema.
* Do not add new visual kinds or capabilities that are not present in `src/types.ts` / `src/schema.ts`.
* Do not turn this into a generation prompt. The detailed generation rules remain in `visual-content-lanes-spec.md`.

Specific issues to fix in `NCLEX-Question-Schema.md`:

1. Schema version / visual scope

* Ensure the document states that schemaVersion `"1.2"` supports deterministic JSON-defined visual stimuli.
* Clarify that visual stimuli are data-derived/local renderer inputs, not AI-generated medical images or external assets.
* Clarify that visuals can appear on supported standalone questions and, where implemented, case-study exhibits.

2. Supported visual kinds
   Add or update a section listing the implemented visual kinds. At minimum, include:

* `rhythm_strip`
* `vitals_trend`
* `lab_trend`
* `fetal_monitoring`
* `io_record`
* `medication_label`
* `device_screen`
* `burn_map`
* `mar`

For each kind, include only a short contract summary and point to the detailed generation spec where applicable. Avoid huge worked examples unless the schema doc already uses that pattern.

3. Common visual item rules
   Add/refresh a shared visual section with these rules:

* `question.visual` is optional overall, but if present it must match one implemented kind.
* `meta.visual_justification` is required for visual items and must explain what the learner must read from the visual that the stem does not state.
* The visual must be load-bearing; a decorative visual is invalid content.
* Learner-facing visual captions/titles/labels that use bilingual fields should preserve English/Simplified Chinese parity.
* `question.topic` remains English-only.

4. `derived_values_keyed` shape correction
   This is the most important stale-schema trap.

Patch any language that implies `meta.derived_values_keyed` is always an array.

The schema doc should explain that `derived_values_keyed` has kind-specific shape:

* For trend-style visuals such as `vitals_trend` / `lab_trend`, it may be a list of derived names when that is what the implemented validator expects.
* For arithmetic visual lanes (`io_record`, `medication_label`, `device_screen`, `burn_map`), it is an object/map of derivation key to computed number, for example:

```json
"meta": {
  "derived_values_keyed": {
    "tbsa_pct": 36,
    "parkland_total_ml": 10080
  }
}
```

State that validators/self-checks recompute these values and mismatches are validation failures, not reviewer preference notes.

5. Arithmetic/documentation lane summaries
   Add concise schema-contract notes for these five lanes:

`io_record`

* Visual kind: `"io_record"`
* Supported item types: `multiple_choice`, `select_all`, `matrix`, `fill_in_blank`
* The visual stores intake/output rows, not totals.
* `volumeMl` values are positive integers.
* `meta.derived_values_keyed` may include `intake_total_ml`, `output_total_ml`, `net_balance_ml`.

`medication_label`

* Visual kind: `"medication_label"`
* Supported item types: `multiple_choice`, `select_all`, `matrix`, `fill_in_blank`
* The label carries amount/per-quantity information.
* Same-unit math only; no unit-conversion engine.
* `order.unit` must match `amountUnit` for dose/rate derivations.
* `meta.derived_values_keyed` may include concentration, volume, quantity, or rate keys as implemented.

`device_screen`

* Visual kind: `"device_screen"`
* Supported item types: `multiple_choice`, `select_all`, `matrix`, `fill_in_blank`
* Device types include PCA, infusion, and enteral pump screens if implemented in the runtime types.
* Direct-read safety items use `meta.keyed_settings`.
* Arithmetic items use `meta.derived_values_keyed`.
* PCA basal math only counts basal when `mode` text includes `"basal"`; basal total-dose derivations require `meta.shift_hours`.

`burn_map`

* Visual kind: `"burn_map"`
* Supported item types: `multiple_choice`, `select_all`, `matrix`, `fill_in_blank`
* Generated/reviewed content is adult-only even if the renderer has broader internal support.
* Rule-of-Nines region keys are used to compute `%TBSA`.
* Parkland constants should be stated in the stem for closed-world testability.
* `meta.derived_values_keyed` may include `tbsa_pct`, `parkland_total_ml`, `parkland_first8h_ml`, and `parkland_rate_first8h_ml_hr`.
* `meta.weight_kg` is required for Parkland keys.
* Numeric fill-in answers must match the keyed derived value being tested.

`mar`

* Visual kind: `"mar"`
* Supported item types: `multiple_choice`, `select_all`, `matrix`
* No `fill_in_blank`.
* No arithmetic; dose is display-only text.
* Every administration time must exist in `timeGrid`.
* Single-cell items use `meta.keyed_cells`.
* Cross-row or cross-time reasoning uses `meta.keyed_relationship`.

6. `meta` keys for visuals
   Ensure the schema markdown recognizes these visual meta keys as valid where appropriate:

* `visual_justification`
* `derived_values_keyed`
* `keyed_cells`
* `keyed_relationship`
* `keyed_settings`
* `source`
* `tier`
* `skill_signature`
* `stem_disambiguators`
* `order`
* `weight_kg`
* `round`
* `shift_hours`

Do not imply all of these are required for every visual. Explain that requirements are kind-specific.

7. Audit-spec note
   If editing `NCLEX_Audit_Spec.md`, add only a small note near the beginning or in the quick-reference section:

“Schema-validity review must use the current `NCLEX-Question-Schema.md` together with runtime `src/types.ts` / `src/schema.ts`. For v1.2 visual items, also consult the relevant visual lane spec. Do not file schema findings from older copies of the schema markdown.”

Do not otherwise rewrite the adversarial audit spec; it is primarily for evidence-supported clinical/key/bilingual contradictions.

8. Non-goals
   Do not:

* Change any `.ts` files.
* Change validation behavior.
* Change JSON banks.
* Generate new items.
* Rewrite the whole schema document.
* Add pediatric burn-map content permission.
* Add `fill_in_blank` support to `mar`.
* Treat MAR dose strings as arithmetic inputs.
* Convert `derived_values_keyed` object maps back into arrays.
* Remove old schema version compatibility notes for v1.0/v1.1 unless they are directly wrong.

Acceptance criteria:

* `NCLEX-Question-Schema.md` no longer falsely implies that visual support is rhythm-only.
* `NCLEX-Question-Schema.md` no longer falsely implies that `derived_values_keyed` is always an array.
* All implemented visual kinds are discoverable in the schema markdown.
* The five arithmetic/documentation lanes are summarized accurately enough that a reviewer will not flag valid visual JSON solely because they are using the schema markdown.
* Any audit-spec change is minimal and only clarifies current schema authority.
* Markdown remains readable and consistent with the existing document style.

Output:

* Provide a concise diff summary.
* List files changed.
* Note any places where the markdown was ambiguous and you chose to defer to `src/types.ts` / `src/schema.ts`.
* Do not produce question-bank JSON.
