# Structured Measurements Exhibit Field (Schema 1.8) — Product Pass Spec

Date: 2026-07-04
Author: Claude (architect seat). Implementer: Codex, **after the product decisions below are made.**
This is the "supplement-vs-replace product pass" flagged as its own gate in
`EXHIBIT-FLOWSHEET-BLIND-ADJUDICATION-2026-07-04.md`. It is framed as a **proposal with open product
decisions**, not a ready-to-build spec — do not implement until Luke rules on the decisions in the
last section.

> **Schema-version caveat for Codex:** this spec says "1.7 → 1.8" based on Claude's live read of
> CLAUDE.md this session (schema 1.7 current). Verify the actual current `schemaVersion` against
> `NCLEX-Question-Schema.md` + `src/schema.ts` at implementation time and bump from whatever is
> current — the number may have moved.

## Purpose

Give the validated staged flowsheet artifacts (from the migration batch protocol) a place to live in
the schema and a way to render as an Epic-ish flowsheet/table — **without** touching the load-bearing
`lab_trend` / `vitals_trend` trend renderers (principle 6) and **without** mutating reviewed case
prose (GATE 3 / principle 8).

This convergently matches the external GPT review's independent proposal (a new `structuredMeasurements`
exhibit field, values-only, structured-beside-prose) — treat that convergence as confirmation the
shape is right.

## Schema shape

Add an **optional** `structuredMeasurements` field to `CaseStudyExhibit` (case-study exhibits only —
`caseStudy.exhibits[]` and `caseStudy.stages[].exhibits[]`). The exhibit keeps its `id`, `title`,
`content` (prose), and optional `visual`; `structuredMeasurements` is additive.

```jsonc
{
  "id": "labs_ed",
  "title": { "en": "Laboratory results", "zh": "实验室结果" },
  "content": { "en": "…narrative, unchanged…", "zh": "…叙述，保持不变…" },
  "structuredMeasurements": {
    "kind": "labs_flowsheet",              // or "vitals_flowsheet"
    "columns": [
      { "id": "ed", "label": { "en": "ED", "zh": "急诊" } }
    ],
    "rows": [
      {
        "key": "potassium",                // allowlist key (shared module)
        "label": { "en": "Potassium", "zh": "血钾" },
        "values": [
          { "columnId": "ed", "value": "6.2", "unit": "mEq/L", "context": "post_intervention" }
        ]
      }
    ]
  }
}
```

Notes:
- **Values-only in v1.** A value carries `value` (byte-exact string, as extracted), `unit` (the
  source unit, as preserved by Rule C), and optional `context` (`post_intervention`). **No `flag`
  (H/L), no reference range.** Those are gated on the reference-range lane and are a later minor
  addition (see below).
- `key` must be an allowlist key from `src/measurementAllowlist.ts` (single source of truth). `unit`
  must be an accepted source unit for that key. Row `label` is bilingual and should match the
  registry label where one exists.
- `columns` are timepoint/panel headers (bilingual). A single-panel exhibit has one column. This is
  where multi-panel labs (e.g. "ED" vs "repeat") render as adjacent columns — but note **serial**
  trends (≥2 timepoints on one parameter) do **not** come here; they stay with the trend renderers.
  Flowsheet columns are distinct *panels* (draws), not a time series of one analyte.

## Supplement-vs-replace rule (the core product invariant)

**Default: supplement.** `structuredMeasurements` renders *beside* the prose `content`, which is kept
intact. This is GATE 3 at the product layer — splitting values into a table must not remove
load-bearing narrative (the sepsis case: vitals table + intact prose carrying mottling / cap-refill /
confusion).

**Replace only when the exhibit was pure-KV.** If `content` was nothing but a `Label: value unit`
block (the `clean_kv` bucket), the prose is fully represented by the table and `content` may be
reduced to an empty/short pointer. For every other bucket, prose stays.

Encode this as a validation rule, not a convention: a `labs_flowsheet`/`vitals_flowsheet` on an
exhibit whose `content.en` carries narrative sentences beyond the keyed values must keep that
`content` non-empty. Fail loud if a migration tries to blank prose on a non-KV exhibit.

## Renderer

- **Reuse existing table primitives** — `renderDocTable` (documentation tables) or `renderFieldPanel`
  (key→value panels) from `src/visuals/primitives/`. Do **not** add a new graph visual kind, and do
  **not** overload `lab_trend`/`vitals_trend`.
- **Density budget (GPT's split-layout concern, adopted).** The flowsheet must fit the case chart
  pane without becoming MAR-dense. Spec a column cap and a row-height budget; if a flowsheet exceeds
  it, it renders in the exhibit's own pane/tab rather than the shared chart pane. Current decisions
  put live case studies in a horizontal chart-over-work layout; the flowsheet must not blow that out.
  (Exact cap is a product decision — see below.)
- Bilingual: labels and column headers render in the active language; values/units are
  language-neutral.

## Migration wiring

A deterministic transform from the staged extraction record shape (`panel[]` / `excludedValues[]` /
`skip_serial`) to `structuredMeasurements`:
- `panel[]` entries → `rows[].values` (single column per exhibit unless the extraction identified
  distinct panels). `context` carries through.
- `excludedValues[]` → **not rendered** (they are prior/trend/serial; the flowsheet shows current
  values only). They remain in the staged artifact for audit.
- `skip_serial` exhibits → **no `structuredMeasurements`** (trend-chartable / serial; leave to the
  trend renderers).
- `unitAliases[]` → not rendered (audit-only).
Only panels whose staged artifact passed the gate **and** cleared migration adjudication become
`structuredMeasurements` blocks. The migration ledger is the gate for what promotes.

## Schema bump discipline

- Bump `schemaVersion` (1.7 → 1.8, or from whatever is current — verify).
- Update `NCLEX-Question-Schema.md` (the contract), `src/types.ts` (`CaseStudyExhibit`), `src/schema.ts`
  (validation), and add the "add a field" migration note. Existing banks without the field are valid
  (it's optional) — no data migration needed for the bump itself, only for the panels being promoted.
- `structuredMeasurements` is exhibit presentation, validated in exhibit mode (structural validation
  runs; item-type placement / answer-coupling `selfCheck` do not apply — it's a stimulus table, like
  other exhibits).

## Fixtures / tests

- Pure-prose exhibit unchanged (no `structuredMeasurements`) — still valid.
- Pure `labs_flowsheet` (KV-replace case) — renders, prose reduced.
- Prose + flowsheet mixed (supplement case) — both render, prose intact; the blank-prose-on-non-KV
  guard fires when prose is wrongly blanked.
- Split-screen / case chart-pane render at the density budget; over-budget flowsheet routes to its own
  pane.
- Values-only guard: a row carrying a `flag` or reference range fails validation in v1.

## Later (not v1): the flag/range column

Once the reference-range lane lands sourced bands, a minor follow-on adds an optional `flag` (H/L,
computed from the sourced band, never authored) and/or a reference-range column. That is a separate
small schema addition gated on the reference-range lane — explicitly **out of scope here**. v1 is
values-only.

## Product decisions Luke must make before Codex builds

1. **Supplement as default — confirm.** (Recommended yes; replace only on pure-KV.)
2. **Render placement.** Flowsheet in the shared case chart pane, or its own exhibit pane/tab? And the
   density cap (column count, row count) that routes an over-budget flowsheet to its own pane.
3. **Scope of first render.** Ship the renderer against the `clean_kv` staged artifacts only first
   (smallest, safest, proves ergonomics), then widen — or all validated buckets at once?
4. **`kind` split.** One `labs_flowsheet` + `vitals_flowsheet`, or a single `measurement_flowsheet`
   with a type tag? (Labs and vitals differ in column semantics — labs = draws, vitals = a spot set —
   so two kinds is probably cleaner, but confirm.)
