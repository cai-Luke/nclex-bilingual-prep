# Structured Measurements Exhibit Field (Schema 1.8) — Product Pass Spec

Date: 2026-07-04
Author: Claude (architect seat). Implementer: Codex.
Ratified: 2026-07-07 (Luke, this session). This began as the "supplement-vs-replace product pass"
flagged as its own gate in `EXHIBIT-FLOWSHEET-BLIND-ADJUDICATION-2026-07-04.md`. **The open product
decisions have now been litigated and ratified — see "Frozen decisions" at the end. This is a
ready-to-build contract.** The standing record is `DECISIONS.md` principle 24; on any conflict, principle
24 wins.

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
    "panels": [
      {
        "kind": "labs",                        // "labs" | "vitals"
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
    ]
  }
}
```

Notes:
- **Wrapper of typed `panels[]`, not a single `kind` per exhibit.** One exhibit may carry a `labs`
  panel and a `vitals` panel side by side; staged records mix vitals + stat labs + ABG in one
  extraction, and labs vs vitals render differently (fishbone vs flat). A single-panel exhibit has a
  `panels` array of length one. Do **not** collapse to one exhibit-root `kind`/`columns`/`rows`.
- **Values-only in v1.** A value carries `value` (byte-exact source value) + `unit` + optional
  `context` (`post_intervention`). **No `flag` (H/L), no reference range** — validation rejects both in
  v1 (every `refBand` in `lab_trend/defs.ts` is an unverified placeholder); they wait on the
  reference-range lane.
- **`unit` is the accepted *input* unit, not a byte-exact source token.** It is the token
  `measurementUnitPolicy` consumes to convert/display. The field is deliberately **not** named
  `sourceUnit`/`sourceUnitText`: v1 does not store the literal prose token (no v1 consumer reads it; it
  is recoverable from the staged `sourceSpan`). Canonical value and display unit are **derived at
  render** (`toCanonicalMeasurementValue` / `displayPolicyFor`), never stored — storing derived copies
  invites drift.
- `key` must be an allowlist key from `src/measurementAllowlist.ts` (single source of truth); `unit`
  must be in that key's `acceptedSourceUnits`. Row `label` is bilingual and matches the registry label
  where one exists.
- **`columns` are applicator-authored panel/timepoint headers, never renderer-inferred.** `id` is
  required; `label` is optional bilingual and carries the source's stated marker ("ED", "1600", "on
  admission") when one exists. A single-panel exhibit has one column. The renderer never infers
  grouping from `sourceSpan`. Timestamps are not required and are not fabricated; a machine-readable
  `observedAtText` is a deferred additive field, not v1. Columns are distinct *panels* (draws), not a
  time series — serial trends (≥2 timepoints on one parameter) do **not** come here; they stay with the
  trend renderers as `skip_serial`.

## Supplement-vs-replace rule (the core product invariant)

**Default: supplement.** `structuredMeasurements` renders *beside* the prose `content`, which is kept
intact. This is GATE 3 at the product layer — splitting values into a table must not remove
load-bearing narrative (the sepsis case: vitals table + intact prose carrying mottling / cap-refill /
confusion).

**Replace only when the exhibit was pure-KV.** If `content` was nothing but a `Label: value unit`
block (the `clean_kv` bucket), the prose is fully represented by the table and `content` is reduced to a
**short pointer** — never empty, because `content` is a required non-empty `TextPair`
(`validateCaseStudyExhibit` → `addTextPairError`). For every other bucket, prose stays.

This guard is **applicator-enforced, schema-backstopped** — not fully generic schema validation. Schema
validation cannot know that narrative was removed from a non-KV exhibit after the fact (it has no memory
of the pre-migration prose); it enforces only the always-on `content`-non-empty floor. The bucket-aware
rule — *only* `clean_kv` exhibits may reduce prose to a pointer — lives in the deterministic applicator,
which reads the migration manifest/adjudication bucket and fails loud if a non-KV exhibit tries to shrink
its prose.

## Renderer

- **Proof ships on existing flat primitives.** The schema/applicator/promotion proof renders with
  `renderDocTable` / `renderFieldPanel` (`src/visuals/primitives/`). Do **not** add a new graph visual
  kind and do **not** overload `lab_trend`/`vitals_trend`.
- **Fishbone is a fast-follow, not a proof gate.** Labs snapshots eventually render as a fishbone
  (CBC/BMP/CMP skeleton), but that is a net-new renderer (no primitive draws the X-layout) built
  *after* the proof validates on flat primitives. Necessity is waived for it per the 2026-07-06
  override — accepted decoration justified by workflow familiarity — but it still ships the full
  renderer + `selfCheck` + registry-conformance build. Routing rule: a `labs` panel whose analytes
  occupy a recognized skeleton renders fishbone, **full or partial** (an isolated H/H is a valid
  partial fishbone, preferred over a flat report); non-template analytes (LFTs, lone troponin, lactate)
  and all `vitals` panels render flat; trends never route here.
- **Density cap deferred to the real render.** v1 proof is single-panel snapshots (few rows, one
  column), so density is not a v1 problem — render inline in the exhibit's normal flow. Set the actual
  column/row cap that routes an over-budget panel to its own pane from the observed proof render, not a
  guess; the live layout is horizontal chart-over-work and must not blow out.
- Bilingual: labels and column headers render in the active language; values/units are
  language-neutral.

## Migration wiring

A deterministic **dry-run applicator** transforms staged extraction records into
`structuredMeasurements`: match `caseId`/`exhibitId`, mutate the loaded object, re-serialize, validate
every target bank, regenerate the census. Never hand-edit canonical JSON.
- `panel[]` entries → `panels[].rows[].values`; `context` carries through. A single-panel record is one
  `panels` entry with one `columns` entry.
- **Consume Batch 20** (serial redo) and **exclude failed Batch 19** from promotion input. Do not glob
  every staged JSON blindly — drive off the refreshed manifest + clean adjudicated artifacts.
- `excludedValues[]`, `skip_serial`, empty extracts, and `unitAliases[]` are **ledger/staging-only**,
  never written to canonical (principle 24). `skip_serial` exhibits get **no** `structuredMeasurements`
  (their prose stays; trend renderers own serial); empty extracts get no field (never a blank learner
  table).
- **Allowlist prerequisites, before any promotion:** add `troponin_i` (distinct from `troponin_t`) and
  `sao2` (distinct from `spo2`); fix the gate's `spo2` synonym so `SaO2` no longer matches. Re-route the
  mislabeled Batch 16/20 troponin-I rows to `troponin_i`. Bands stay placeholder — deferred to the
  reference-range lane.
Only panels whose staged artifact passed the gate **and** cleared migration adjudication promote. The
migration ledger is the gate for what promotes.

## Schema bump discipline

- Bump `schemaVersion` (1.7 → 1.8, or from whatever is current — verify).
- Update `NCLEX-Question-Schema.md` (the contract), `src/types.ts` (`CaseStudyExhibit`), `src/schema.ts`
  (validation), and add the "add a field" migration note. Existing banks without the field are valid
  (it's optional) — no data migration needed for the bump itself, only for the panels being promoted.
- `structuredMeasurements` is exhibit presentation, validated in exhibit mode (structural validation
  runs; item-type placement / answer-coupling `selfCheck` do not apply — it's a stimulus table, like
  other exhibits).
- Validation rules (v1): `panels[].kind ∈ {labs, vitals}`; every `values[].columnId` resolves to a
  `columns[].id` in the same panel; `key ∈ ALLOWLIST_KEYS`; `unit ∈ acceptedSourceUnits[key]`; a row
  carrying any `flag` or reference-range field **fails**; `content` stays a required non-empty `TextPair`
  (the schema backstop). The bucket-aware blank-prose-on-non-KV guard is applicator-enforced, not
  schema-generic — see Supplement-vs-replace.

## Fixtures / tests

- Pure-prose exhibit unchanged (no `structuredMeasurements`) — still valid.
- Pure-KV exhibit, one `labs` panel (replace case) — renders, prose reduced to pointer.
- Prose + `labs`/`vitals` panel mixed (supplement case) — both render, prose intact; the
  blank-prose-on-non-KV guard fires when prose is wrongly blanked.
- One exhibit with both a `labs` and a `vitals` panel — both render under one `structuredMeasurements`.
- `columnId` referential integrity: a `values[].columnId` with no matching `columns[].id` fails.
- Values-only guard: a row carrying a `flag` or reference range fails validation in v1.
- Allowlist guard: `troponin_i`/`troponin_t` are distinct keys; `sao2`/`spo2` are distinct keys; the
  `spo2` detector no longer matches `SaO2`.

## Later (not v1): the flag/range column

Once the reference-range lane lands sourced bands, a minor follow-on adds an optional `flag` (H/L,
computed from the sourced band, never authored) and/or a reference-range column. That is a separate
small schema addition gated on the reference-range lane — explicitly **out of scope here**. v1 is
values-only.

## Implementation constraints (Codex review 2026-07-07, resolved)

Codex raised six pre-implementation concerns against live source. All were verified and accepted; none
changes a frozen decision — they constrain *how* the contract is built.

1. **`content` is a required non-empty `TextPair` — pure-KV replace uses a short pointer, never an empty
   string.** `validateCaseStudyExhibit` runs `addTextPairError(value.content)`. See Supplement-vs-replace.
2. **The supplement guard is applicator-enforced, schema-backstopped.** Schema validation cannot detect
   that narrative was removed from a non-KV exhibit after the fact; the bucket-aware rule (only `clean_kv`
   may reduce prose) lives in the deterministic applicator off the migration bucket, with the
   `content`-non-empty floor as the schema backstop.
3. **A `structuredMeasurements → plain text` serializer lands before ANY pure-KV prose is reduced.** The
   TTS field-walk (`scripts/audio/build-tts-queue.ts` → `walkExhibit`) and the GPT rescue prompt
   (`src/reviewPrompt.ts` → `renderExhibit`) both read only `exhibit.content` (+ `visual`). Reducing
   pure-KV prose to a pointer without a serializer hides the actual values from audio and review. Both
   consumers must call the serializer; it is a hard prerequisite for the replace path.
4. **`troponin_i` / `sao2` are structured-measurement-only allowlist entries — a def source unioned into
   `src/measurementAllowlist.ts`, NOT added to the `lab_trend`/`vitals_trend` defs.** The allowlist
   derives from the trend defs today; adding the keys there would expand the trend-plot key surface
   (axis, styleRole, refBand, stableEps, `normal()` — plotting metadata a flowsheet cell does not need)
   and imply a plotting contract we are not deciding now. The structured-only source supplies just
   `{canonicalUnit, acceptedSourceUnits, sanity, kind}` for GATE 4; bands stay deferred. Also de-conflate
   the gate's `LABEL_PATTERNS`: remove `SaO2` from the `spo2` pattern (add a distinct `sao2` pattern) and
   stop mapping bare `troponin` to `troponin_t`; add `IMPLICIT_SOURCE_UNITS` / identity handling for the
   new keys as needed (the calcium total/ionized logic is the pattern to mirror).
5. **Strict unknown-key tooling must learn the new field.** Add `structuredMeasurements` to
   `allowedKeySets.caseStudyExhibit` and add nested key sets (`panels` → `kind`/`columns`/`rows`;
   `column` → `id`/`label`; `row` → `key`/`label`/`values`; `value` →
   `columnId`/`value`/`unit`/`context`), and extend `collectCaseStudyExhibitUnknownKeys` to recurse into
   them — otherwise `scan-unknown-keys` / strict `validate-bank` flag the field as drift.
6. **The applicator takes an explicit manifest/artifact path and refuses blind globbing.** Consume
   `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-20-serial-redo-2026-07-06.json` (at repo root) for the serial redo
   and exclude Batch 19; historical pre-refresh artifacts remain on disk, so drive off the refreshed
   manifest + named clean artifacts only.

## Frozen decisions (ratified 2026-07-07)

All open product decisions were litigated with Luke this session and ratified. Standing record:
`DECISIONS.md` principle 24 (authoritative on conflict).

1. **Supplement is default; replace only on pure-KV.** Encoded as a fail-loud applicator rule with a
   schema backstop, not a convention. Span-replacement is out of scope for v1 (it overlaps the
   prose-normalization lane).
2. **Placement: inline in the exhibit; density cap deferred.** v1 single-panel snapshots render inline
   in the chart-over-work flow. The numeric column/row cap is set from the observed proof render, not
   guessed now.
3. **Scope: tiny mixed proof first.** The 2 `clean_kv` records (replace path) **plus 3–5 reviewed
   single-panel prose/scattered records** (supplement path — `clean_kv` alone never exercises it).
   Promote the rest only after the proof render validates.
4. **`kind`: typed `panels[]` wrapper.** `labs` / `vitals` panels; one exhibit may hold both. Not a
   single exhibit-root `kind`, not one generic untyped table. (See Schema shape.)
5. **Unit field naming (GPT tightening, resolved).** Store `value` + `unit`, where `unit` is an
   *accepted input* unit, not a byte-exact source token. GPT's `sourceUnitText`/`inputUnit` rejected —
   no v1 consumer reads the literal token; it is recoverable from `sourceSpan`. Canonical/display units
   derive at render, never stored.
6. **Column identity (GPT tightening, resolved).** Columns are applicator-authored (`id` + optional
   bilingual `label` carrying the source marker), never inferred from `sourceSpan`. A separate
   machine-readable `observedAtText` is **not** added in v1 — the label carries the marker; the field is
   additive later if a temporal-sort consumer appears.
7. **Troponin I vs T: split now.** Add `troponin_i` distinct from `troponin_t` before rendering or
   bands. No generic `troponin`. Re-route mislabeled Batch 16/20 rows. Clinical sign-off given.
8. **SaO2 vs SpO2: split now.** Add `sao2` (arterial, ABG/co-ox context) distinct from `spo2` (pulse
   ox); fix the gate `spo2` synonym so `SaO2` no longer matches. Naming `sao2` confirmed (matches
   `spo2`/`pao2`/`paco2`).
9. **Reference ranges / H-L flags: rejected in v1 validation.** Bands are unverified placeholders;
   flags/ranges are a later minor addition gated on the reference-range lane.
10. **Fishbone: accepted as fast-follow.** Template-membership routing (CBC/BMP/CMP skeleton), full or
    partial (H/H valid); non-template + vitals flat; trends never here. Necessity waived per the
    2026-07-06 override. Proof ships on flat primitives; the fishbone renderer + `selfCheck` +
    conformance is a second pass before wide promotion.

### Recommended build sequence

1. Schema/types/validation for the tiny proof shape (`panels[]`, `value`+`unit`, no flag/range); update
   `allowedKeys.ts` + `collectCaseStudyExhibitUnknownKeys` for the nested keys (constraint 5).
2. Allowlist: add `troponin_i`, `sao2` via a structured-measurement-only def source unioned into
   `measurementAllowlist.ts` (constraint 4); de-conflate the gate `spo2`/`SaO2` and bare-`troponin`
   patterns.
3. `structuredMeasurements → plain text` serializer; wire it into the TTS field-walk and the
   review-prompt exhibit render (constraint 3).
4. Deterministic dry-run applicator with an explicit artifact path (exclude Batch 19, consume Batch 20 —
   constraint 6).
5. Promote the tiny proof batch; validate; render inline on flat primitives. Pure-KV prose reduces to a
   short pointer only after step 3 lands.
6. Formatter tests for conventional-first display (the existing `MEASUREMENT_DISPLAY_POLICIES` set).
7. After the proof render is good: build the fishbone renderer, then promote the rest of the clean panels.
8. Prose-normalization is a **separate** lane — do not fold it into structured-measurement promotion.
