# NCLEX Bank — Canonical Question Schema

**schemaVersion: `1.2` — current.** This document is the canonical authoring and review contract; runtime behavior is implemented by `src/types.ts`, `src/schema.ts`, and the registered modules under `src/visuals/`. `1.0` standalone-question banks remain supported. `1.1` case-study banks remain supported. Do not change shapes without bumping `schemaVersion` and writing a migration.

---

## Bank envelope

A generated bank is one JSON object:

```json
{
  "meta": {
    "schemaVersion": "1.2",
    "exam": "NCLEX-RN",
    "topic": "echo of the requested topic",
    "category": "echo of the requested category, or 'mixed'",
    "difficulty": "echo of the requested difficulty",
    "count": 6
  },
  "questions": [ /* Question objects */ ]
}
```

The importer also accepts a bare `[ ... ]` array of Question objects (no envelope). When present, `meta.schemaVersion` must be `"1.0"`, `"1.1"`, or `"1.2"`. `case_study` requires `"1.1"` or later. `visual` requires `"1.2"` when a bank envelope declares a schema version.

---

## Common fields (every Question, all types)

| field | type | required | notes |
|---|---|---|---|
| `id` | string | yes | unique within the bank; top-level bundled banks should be globally unique across each other because app state keys by `question.id`; uploaded imports regenerate collisions |
| `itemType` | enum | yes | `multiple_choice` \| `select_all` \| `ordered_response` \| `fill_in_blank` \| `matrix` \| `dropdown_cloze` \| `case_study` |
| `category` | enum | yes | one of the 8 client-needs subcategories (below), or `"mixed"` only at `meta` level — a question is always one specific category |
| `topic` | string | yes | free text, e.g. `"heart failure"`; keep concise + reusable for coverage tallying |
| `difficulty` | enum | yes | `easy` \| `medium` \| `hard` |
| `ngnSkill` | enum | optional | `recognize_cues` \| `analyze_cues` \| `prioritize_hypotheses` \| `generate_solutions` \| `take_action` \| `evaluate_outcomes` |
| `stem` | `{ en, zh }` | yes | scenario / question text, both languages |
| `rationale` | object | yes | see below |
| `testTakingStrategy` | `{ en, zh }` | yes | short strategy note, both languages |
| `glossary` | `[ { termEn, termZh, defZh } ]` | yes | key terms in the item; may be empty `[]` but prefer 2–5 |
| `visual` | object | optional | schema `1.2`; placement is per visual kind; renders above the stem |

**`category` controlled vocabulary (use these exact strings):**
`Management of Care`, `Safety and Infection Control`, `Health Promotion and Maintenance`, `Psychosocial Integrity`, `Basic Care and Comfort`, `Pharmacological and Parenteral Therapies`, `Reduction of Risk Potential`, `Physiological Adaptation`.

**`rationale` shape:**
```json
{
  "correct": { "en": "why the keyed answer(s) are correct", "zh": "..." },
  "byChoice": [
    { "refId": "A", "en": "why this choice is right/wrong", "zh": "..." }
  ]
}
```
`byChoice[].refId` points to the relevant per-type identifier:
- option types → `optionId`
- `matrix` → `rowId`
- `dropdown_cloze` → `dropdownId`
- `fill_in_blank` → `blankId`

`byChoice` is **required for option types** (one entry per option). For other types it's encouraged (one per row / dropdown / blank) but may be omitted if `rationale.correct` fully explains it.

All `{ en, zh }` pairs require both languages non-empty. `zh` is natural Simplified Chinese, not literal word-for-word.

---

## Optional visual stimulus — schema `1.2`

Visuals are deterministic data, not AI-generated medical images or external assets. A standalone question or case-study exhibit may carry an optional `visual` object. The app renders the visual locally as SVG from the stored parameters, with no raster assets, runtime API calls, or external files.

### Common Visual Rules

- **Optionality**: `question.visual` is optional overall, but if present it must exactly match one implemented kind.
- **Justification**: `meta.visual_justification` is **required** for visual items and must explain what the learner must read from the visual that the stem does not state.
- **Determinacy (Load-bearing)**: A visual item is only valid if the answer is only resolvable through the **combination** of stem + visual + answer choices. If removing the visual leaves the answer unchanged, the visual is decorative and the item is invalid.
- **Bilingual parity**: Learner-facing visual captions, titles, or labels that use bilingual fields should preserve English/Simplified Chinese parity.
- **Topic**: `question.topic` remains English-only.

### Visual kind taxonomy

Committed visual lanes (append-only). For detailed generation and review rules, consult `visual-content-lanes-spec.md`.

| `kind` | Description |
|---|---|
| `rhythm_strip` | ECG waveform |
| `capnography` | End-tidal CO₂ capnogram |
| `vitals_trend` | Multi-vital time-series chart |
| `lab_trend` | Serial laboratory values (1–2 analytes, ≥3 timepoints) |
| `mar` | Medication Administration Record |
| `io_record` | Intake and output flowsheet with derived totals and net balance |
| `medication_label` | Synthetic medication product label with structured strength |
| `device_screen` | PCA, infusion, or enteral pump settings display |
| `fetal_monitoring` | Synchronized fetal heart rate and uterine activity tracing |
| `burn_map` | Anterior/posterior whole-region burn diagram for Rule-of-Nines and Parkland arithmetic |

### Visual contract metadata

Some visual kinds require a question-level `meta` block that exists **for validation and audit only** — it must never be displayed to learners. This is distinct from the bank-envelope `meta` (schemaVersion, topic, etc.).

Supported visual `meta` keys include (requirements are kind-specific): `visual_justification`, `derived_values_keyed`, `expected_trend`, `expected_flags`, `expected_pattern`, `reference_bands`, `keyed_cells`, `keyed_relationship`, `keyed_settings`, `source`, `tier`, `skill_signature`, `stem_disambiguators`, `order`, `weight_kg`, `round`, and `shift_hours`.

```jsonc
// Sibling of `visual`, at the QUESTION level. Audit-only. Never displayed.
{
  "visual": { "kind": "vitals_trend" /* or "lab_trend" */, "...": "..." },
  "meta": {
    "visual_justification": "REQUIRED, non-empty. Why the visual is load-bearing.",
    "source": "Clinical source for ranges/pattern (strictest tier).",
    "tier": "strictest",
    "skill_signature": "stable skill tag, e.g. 'vit:narrowing-pulse-pressure/shock'",
    "expected_trend": [
      { "series": "creatinine", "direction": "up", "window": [0, 72] }
    ],
    "expected_flags": [
      { "series": "potassium", "at": 48, "flag": "H" }
    ],
    // Trend-style visuals may use a list of derived series names.
    "derived_values_keyed": ["map"],
    "reference_bands": "adult",
    "stem_disambiguators": ["acute kidney injury"]
  }
}
```

For arithmetic visual lanes (`io_record`, `medication_label`, `device_screen`, and `burn_map`), `derived_values_keyed` is instead an object that maps each derivation key to its computed number:

```json
{
  "meta": {
    "derived_values_keyed": {
      "tbsa_pct": 36,
      "parkland_total_ml": 10080
    }
  }
}
```

The kind-specific `selfCheck` invoked by runtime bank validation recomputes declared arithmetic values. A mismatch is a validation failure, not a reviewer preference note.

- `series` — the kind-specific series identifier (`analyte` key for `lab_trend`, `vital` key for `vitals_trend`).
- `direction` — `"up"` | `"down"` | `"stable"`. `"stable"` passes when `|valEnd − valStart| ≤ stableEps × (refBand.high − refBand.low)` (default 10% per analyte).
- `expected_flags` — `H`/`L` assertions verified against the registry reference band for the declared `population`.
- `window` — `[t0, t1]` values matched by equality against `time.values`; must span more than one timepoint.
- `at` — single timepoint for flag assertions, matched by equality against `time.values`.

These fields give validators, `selfCheck`, and auditors a shared contract to verify the rendered artifact matches intent. `selfCheck` reads `question.meta.expected_trend` and `question.meta.expected_flags` (snake_case, arrays, under `meta`).

### selfCheck responsibilities

`selfCheck` (when implemented for a kind) is responsible for:

- Verifying rendered artifact matches source data (no silent data/render divergence)
- Verifying derived values (e.g. MAP = Math.round(DBP + (SBP − DBP) / 3))
- Verifying `expected_trend` entries in `question.meta` accurately reflect the data array
- Verifying `expected_flags` entries (H/L) recomputed from the registry band match declared values
- Verifying pattern assertions where applicable (e.g. capnography plateau/phase assertions)
- Verifying necessity assertions (`visual_justification` present; at least one keyed cue declared)

`selfCheck` errors are non-fatal at import (items are not skipped) but must be resolved before visual items are treated as reviewed study material.

Default supported locations:
- Top-level or embedded `multiple_choice`, `select_all`, and `matrix` questions.
- `case_study.caseStudy.exhibits[]` and `caseStudy.stages[].exhibits[]`.

Some arithmetic kinds, including `io_record`, `medication_label`, `device_screen`, and `burn_map`, also opt into top-level or embedded `fill_in_blank`.

Unsupported unless a kind explicitly opts in:
- `ordered_response`, `fill_in_blank`, `dropdown_cloze`, and the `case_study` parent object itself.

Placement is per-kind; the set above is the global default.

### Visual framework (kind-agnostic)

Every visual `kind` is a self-contained module under `src/visuals/kinds/<kind>.ts` registered in a shared registry. The kind-agnostic files — `src/App.tsx` (renders through one `VisualStimulus` dispatcher), `src/schema.ts` (validates through the registry), `scripts/validate-bank.ts`, and `scripts/coverage-report.ts` — iterate the registry and never special-case a kind. A kind module exposes a contract:

- `validate(spec) → VisualError[]` — structural + range validation of the spec **alone**; this is what the per-kind "Validation rules" below enumerate.
- `selfCheck?(spec, question) → VisualError[]` — optional cross-consistency check of render-vs-answer. This includes arithmetic gates (I&O totals, label dose, Parkland volume) and waveform phase gates (`fetal_monitoring`); `rhythm_strip` has none.
- `renderSvg(spec) → string` — pure, deterministic, XML-escaped SVG. No `Math.random` (seed the shared PRNG from `spec.seed ?? 0`), no `Date`/`performance`, no DOM, no network, no module-level mutable state. Route all coordinate numbers through the shared fixed-decimal formatter so float formatting can't drift; XML-escape any free text (only `caption` today).
- `requiredSchemaVersion?` / `allowedItemTypes?` — default to `"1.2"` and the global placement set above; a kind overrides only if it differs.
- `fixtures` — colocated valid + invalid examples the generic conformance harness runs automatically.

The compile-time spec union (`QuestionVisual`) is assembled in one barrel (`src/visuals/types.ts`) with **append-only** single-line additions; that union line is the only shared compile-time touch-point.

### Adding a new visual kind (checklist)

1. Create `src/visuals/kinds/<kind>.ts`: declare `interface <Kind>Visual { kind: "<kind>"; ... }`, implement `validate` / `renderSvg` / optional `selfCheck`, define `fixtures`, and call `registerVisual(<kind>Module)`.
2. Reuse `src/visuals/primitives/` (`prng`, `graphPaper`, `escapeXml`, and later `chart`/`table`) — do not re-implement scaling or PRNG.
3. Add `| <Kind>Visual` to the union in `src/visuals/types.ts` (append-only).
4. Add `import "./<kind>";` to `src/visuals/kinds/index.ts` (append-only registration barrel).
5. Add a per-kind subsection here (params, vocab, validation rules, caption rule).
6. Run `npm run test-visuals` + `npm run validate-bank -- banks/*.json` + `npm run coverage-report` + `npm run build`.
7. (Then, separately) generate questions via the kind's content lane → review → promote → ledger.

If a step requires editing `App.tsx`, `schema.ts`, `validate-bank.ts`, or `coverage-report.ts`, the framework was under-generalized — fix the framework, not the kind.

### Kind: `rhythm_strip`

```json
{
  "visual": {
    "kind": "rhythm_strip",
    "rhythm": "sinus",
    "rateBpm": 75,
    "durationSec": 6,
    "seed": 42,
    "calibrationPulse": true,
    "prSec": 0.16,
    "qrsSec": 0.08,
    "qtSec": 0.36,
    "caption": { "en": "Lead II rhythm strip" }
  }
}
```

`rhythm` controlled vocabulary:
`sinus`, `sinus_brady`, `sinus_tach`, `afib`, `aflutter`, `svt`, `avb_1`, `avb_2_mobitz1`, `avb_2_mobitz2`, `avb_3`, `pvc`, `vtach`, `vfib`, `asystole`.

Validation rules:
- `kind` must be `"rhythm_strip"`.
- `rateBpm` is required. It must be 20–300, except `vfib` and `asystole` may use 0–300 because the renderer treats rate as nominal for those rhythms.
- `durationSec`, if present, must be 3–12. Default is 6.
- `seed`, if present, must be a non-negative integer. Default is 0.
- `calibrationPulse`, if present, must be boolean. Default is true.
- `atrialRateBpm`, if present, must be 20–400.
- `conductionRatio`, if present, must be an integer from 1–8.
- `prSec`, if present, must be 0.06–0.40 seconds.
- `qrsSec`, if present, must be 0.04–0.24 seconds.
- `qtSec`, if present, must be 0.16–0.70 seconds.
- `caption.en`, if caption is present, is required. `caption.zh` is optional but must be non-empty if present.

The `caption` must never reveal the answer. For example, do not caption a strip `"Atrial fibrillation"` on an item asking the learner to identify atrial fibrillation.

### Kind: `capnography`

```json
{
  "visual": {
    "kind": "capnography",
    "pattern": "shark_fin",
    "etco2": 45,
    "respiratoryRate": 20,
    "durationSec": 15,
    "severity": 0.8,
    "caption": { "en": "Capnogram" }
  }
}
```

`pattern` controlled vocabulary:
`normal`, `shark_fin`, `flat`, `rosc`, `rebreathing`.

Validation rules:
- `kind` must be `"capnography"`.
- `pattern` must be one of the 5 allowed patterns.
- `etco2` is required, must be 0–150. If `pattern` is `flat`, must be exactly 0.
- `respiratoryRate` is required, must be 4–60.
- `durationSec`, if present, must be 5–60. Default is 15.
- `severity` is required for `shark_fin`, strictly `0 < severity <= 1`, and disallowed for other patterns.
- `baselineEtco2` is required for `rebreathing`, strictly `0 < baselineEtco2 < etco2`, and disallowed for other patterns.
- `rosc` object is required for `rosc` (with `lowEtco2`, `highEtco2`, `stepAtSec` properties), and disallowed for other patterns.
- `caption.en`, if caption is present, is required. `caption.zh` is optional but must be non-empty if present.

### Kind: `vitals_trend`

```json
{
  "visual": {
    "kind": "vitals_trend",
    "time": { "unit": "hr", "values": [0, 4, 8] },
    "population": "adult",
    "series": [
      { "vital": "hr", "values": [85, 100, 120] },
      { "vital": "map", "values": [90, 75, 60] }
    ],
    "caption": { "en": "Vital signs flow sheet over 8 hours" }
  }
}
```

`VitalKey` controlled vocabulary: `hr`, `sbp`, `dbp`, `map`, `rr`, `spo2`, `temp`.

Validation rules:
- `kind` must be `"vitals_trend"`.
- `time.values` (preferred) or deprecated `timepointsHr` must be a strictly increasing array of finite numbers.
- `time.unit`, if `time` is used, must be `"hr"` or `"min"`.
- `population`, if present, must be `"adult"`, `"peds_child"`, or `"peds_infant"`. Default `"adult"`.
- `series` is required, must contain at least one series. No duplicate `vital` keys allowed.
- Each `series.values` array must have the exact same length as the time array.
- Values must be within sensible physiologic ranges per vital.
- If `map`, `sbp`, and `dbp` are all provided, `map` must satisfy `dbp <= map <= sbp` across all points.
- `tempUnit`, if present, must be `"C"` or `"F"`.
- `selfCheck` verifies that provided `map` values exactly match the computed `MAP = Math.round(DBP + (SBP - DBP) / 3)`.
- `selfCheck` reads `question.meta.expected_trend` (snake_case array) and verifies each entry's direction holds over its declared window.
- `caption.en`, if caption is present, is required. `caption.zh` is optional but must be non-empty if present.

### Kind: `lab_trend`

Renders serial laboratory values for 1–2 analytes across ≥3 timepoints, reusing the `lineChart` primitive with per-analyte reference bands. Load-bearing only when the answer turns on the *trajectory over time*, not a single snapshot value. Items that can be answered from a single final value are invalid.

```json
{
  "visual": {
    "kind": "lab_trend",
    "time": { "unit": "hr", "values": [0, 24, 48, 72] },
    "population": "adult",
    "series": [
      { "analyte": "creatinine", "values": [1.1, 1.8, 2.6, 3.5] }
    ],
    "caption": { "en": "Serum creatinine trend", "zh": "血肌酐变化趋势" }
  },
  "meta": {
    "visual_justification": "Rising creatinine trajectory is required to identify AKI progression vs. isolated acute elevation.",
    "source": "KDIGO AKI Guidelines 2012",
    "tier": "strictest",
    "skill_signature": "lab:rising-creatinine/aki-worsening",
    "expected_trend": [
      { "series": "creatinine", "direction": "up", "window": [0, 72] }
    ],
    "expected_flags": [
      { "series": "creatinine", "at": 72, "flag": "H" }
    ],
    "derived_values_keyed": [],
    "reference_bands": "adult",
    "stem_disambiguators": ["acute kidney injury", "rising creatinine"]
  }
}
```

`LabAnalyteKey` controlled vocabulary:
`sodium`, `potassium`, `chloride`, `bicarbonate`, `anion_gap`, `bun`, `creatinine`, `glucose`, `calcium`, `ionized_calcium`, `magnesium`, `phosphate`, `lactate`, `troponin_t`, `bnp`, `wbc`, `hemoglobin`, `hematocrit`, `platelets`, `inr`, `ptt`, `ph`, `paco2`, `pao2`, `hco3_abg`, `ast`, `alt`, `total_bilirubin`, `ammonia`.

Validation rules:
- `kind` must be `"lab_trend"`.
- `time` is required. `time.unit` must be `"hr"`, `"min"`, or `"day"`. `time.values` must be a strictly increasing array of finite numbers with length ≥ 3.
- `population`, if present, must be `"adult"`, `"peds_child"`, or `"peds_infant"`. Default `"adult"`.
- `series` must have 1–2 entries. No duplicate `analyte` keys.
- Each `analyte` must be in the `LabAnalyteKey` vocabulary above.
- Each `series.values` length must equal `time.values` length.
- Each value must be a finite number within the analyte's absolute physiologic sanity bounds (wide; these are not the reference band).
- `series.unit`, if given, must be one of the recognized units for that analyte (canonical or accepted alternate).
- `series.showReferenceBand`, if given, must be boolean.
- `selfCheck` verifies render fidelity (plotted values equal `series.values`), flag correctness (`expected_flags` H/L recomputed from registry band for the active `population`), trend correctness (`expected_trend` direction over declared window, including `"stable"`), and necessity assertions (`visual_justification` present; at least one `expected_trend` or `expected_flags` entry; every window spans more than one timepoint).
- `caption.en`, if caption is present, is required. `caption.zh` is optional but must be non-empty if present.

> **STRICTEST-TIER accuracy requirement.** All reference ranges and units are placeholders pending source-verification against authoritative clinical references before the content lane opens. Record the source per analyte in the U3 audit report.

### Kind: `mar`

Renders a nursing Medication Administration Record: medications (name, dose, route, frequency) against a time grid of administration events. Load-bearing only when the answer turns on a **relationship across the grid** — timing collision, held/missed dose, duplicate therapy across rows, or PRN given outside its interval. If the answer is "is this one drug appropriate for this diagnosis," no MAR is needed and the item is a text question.

`mar` is allowed on `multiple_choice`, `select_all`, and `matrix`; it does not support `fill_in_blank`. The dose is display-only text, with no arithmetic inputs. Single-cell items use `meta.keyed_cells` and cross-row or cross-time reasoning uses `meta.keyed_relationship`.

```json
{
  "visual": {
    "kind": "mar",
    "timeGrid": ["0600", "1200", "1800", "2400"],
    "medications": [
      {
        "name": "enoxaparin",
        "dose": "40 mg",
        "route": "SubQ",
        "frequency": "daily",
        "administrations": [
          { "time": "0600", "status": "given" },
          { "time": "1800", "status": "held" }
        ],
        "isHighAlert": true
      }
    ],
    "caption": { "en": "Medication Administration Record", "zh": "药物给药记录" }
  },
  "meta": {
    "visual_justification": "Held dose at 1800 is the load-bearing cue; its timing relative to labs is required to identify the clinical danger.",
    "tier": "strictest",
    "source": "...",
    "skill_signature": "mar:held-dose/anticoagulant-withhold",
    "stem_disambiguators": ["anticoagulant", "enoxaparin"],
    "keyed_cells": [
      { "medication": "enoxaparin", "time": "1800", "reason": "held_dose" }
    ],
    "keyed_relationship": null
  }
}
```

`MarRoute` vocabulary: `PO`, `IV`, `IVPB`, `IM`, `SubQ`, `SL`, `PR`, `topical`, `inhaled`, `ophthalmic`, `NG`.

`MarStatus` vocabulary and rendered glyphs (always English; stem carries Chinese context):

| Status | Glyph | `emphasis` |
|---|---|---|
| `given` | ✓ | — |
| `held` | H | flag (yellow) |
| `due` | — | — |
| `missed` | × | flag (yellow) |
| `late` | L | flag (yellow) |
| `not_given` | NG | — |

Empty slots (no administration entry for that time) render as a blank cell.

Validation rules:
- `kind` must be `"mar"`.
- `timeGrid` must be a non-empty array of non-empty, unique strings.
- `medications` must have ≥1 entry. Medication `name` values must be unique across rows.
- Each medication: non-empty `name`, `dose`, `frequency`; `route` in `MarRoute`; `administrations` as an array.
- Each administration: `time` must be in `timeGrid`; `status` in `MarStatus`. No duplicate `(medication, time)` pair.
- `isHighAlert`, if present, must be boolean.
- `caption.en` required when `caption` is present. `caption.zh` optional but non-empty if present.
- **Caption rule:** caption must never reveal the answer (e.g., do not caption "Duplicate anticoagulant therapy" on an item asking the learner to identify the duplication).
- `selfCheck` verifies: `visual_justification` present and non-empty; at least one `keyed_cells` entry or a non-null `keyed_relationship`; every `keyed_cells` entry resolves to an actual `(medication, time)` administration present in the spec.
- **STRICTEST tier.** `selfCheck` enforces structure and necessity only. Stage-4 human review must verify that drug/dose/route/frequency are clinically valid and that nothing other than the keyed element is accidentally unsafe.

### Kind: `io_record`

Renders a nursing intake and output flowsheet. The visual is load-bearing only when the learner must compute an intake total, output total, or net balance from the individual entries. Totals are never stored in the visual spec; the renderer and `selfCheck` derive them independently.

Unlike the global visual default, `io_record` is allowed on `multiple_choice`, `select_all`, `matrix`, and `fill_in_blank`.

```json
{
  "visual": {
    "kind": "io_record",
    "periodLabel": { "en": "0700-1500 shift", "zh": "0700-1500 班次" },
    "intake": [
      { "label": "PO water", "volumeMl": 480 },
      { "label": "0.9% NaCl IV", "volumeMl": 1000 },
      { "label": "IV piggyback antibiotic", "volumeMl": 100 }
    ],
    "output": [
      { "label": "Foley urine", "volumeMl": 600 },
      { "label": "Emesis", "volumeMl": 150 }
    ],
    "caption": { "en": "Intake and output flowsheet", "zh": "出入量记录单" }
  },
  "meta": {
    "visual_justification": "The learner must derive the net balance from the charted entries.",
    "tier": "standard",
    "source": "...",
    "skill_signature": "io_record:net-balance/positive-overload",
    "stem_disambiguators": ["intake and output", "net balance"],
    "derived_values_keyed": {
      "intake_total_ml": 1580,
      "output_total_ml": 750,
      "net_balance_ml": 830
    }
  }
}
```

Validation rules:
- `kind` must be `"io_record"`.
- `intake` and `output` must be arrays, with at least one entry across both arrays.
- Every entry requires a non-empty `label`.
- Every `volumeMl` must be a finite positive integer no greater than 10,000 mL. This maximum is a misplaced-digit sanity bound, not a clinical threshold.
- `periodLabel.en` and `caption.en` are required when their objects are present. Their optional `zh` values must be non-empty when present.
- `selfCheck` requires `visual_justification` and at least one declared value in `derived_values_keyed`.
- Supported keyed values are `intake_total_ml`, `output_total_ml`, and signed `net_balance_ml`. Each declared value must exactly equal the integer total recomputed from entries.
- **Caption rule:** `caption` and `periodLabel` must not reveal the answer or clinical interpretation.
- Human review must verify that deriving the value is genuinely required and that the rationale interprets it correctly.

### Kind: `medication_label`

Renders a synthetic medication product label for a vial, bag, premix, tablet, or capsule. The visual is load-bearing only when the product strength appears solely on the label and the learner must combine it with an order in the stem to compute a concentration, volume, quantity, or rate.

Unlike the global visual default, `medication_label` is allowed on `multiple_choice`, `select_all`, `matrix`, and `fill_in_blank`.

```json
{
  "visual": {
    "kind": "medication_label",
    "drugName": "Heparin Sodium",
    "amount": 25000,
    "amountUnit": "units",
    "perQty": 250,
    "perUnit": "mL",
    "showDerivedConcentration": false,
    "fields": [
      { "label": "Diluent", "value": "D5W" }
    ],
    "caption": { "en": "Heparin premix label", "zh": "肝素预混液标签" }
  },
  "meta": {
    "visual_justification": "The learner must read the product strength from the label to compute the infusion rate.",
    "tier": "strictest",
    "source": "...",
    "skill_signature": "medlbl:concentration-to-rate/heparin-infusion",
    "stem_disambiguators": ["heparin", "units per hour"],
    "order": {
      "kind": "dose_rate",
      "value": 1000,
      "unit": "units",
      "round": 0
    },
    "derived_values_keyed": {
      "rate_ml_per_hr": 10
    }
  }
}
```

Controlled vocabularies:
- `amountUnit`: `mg`, `mcg`, `g`, `units`, `mEq`, `mmol`
- `perUnit`: `mL`, `tablet`, `capsule`
- `meta.order.kind`: `dose`, `dose_rate`, or `none` when only `concentration_per_ml` is keyed
- `meta.order.round`: `0`, `1`, or `2`; defaults to `1`

Validation and arithmetic rules:
- `kind` must be `"medication_label"`.
- `drugName` must be a non-empty string.
- `amount` and `perQty` must be finite positive numbers. Sanity maxima are 1,000,000 and 5,000 respectively; these catch misplaced digits and are not clinical thresholds.
- `showDerivedConcentration`, if present, must be boolean and may be true only when `perUnit` is `"mL"`.
- Every optional ancillary `fields` entry requires non-empty `label` and `value` strings. Ancillary fields are display-only and must never be load-bearing.
- `caption.en` is required when `caption` is present. Optional `caption.zh` must be non-empty.
- `selfCheck` requires `visual_justification` and at least one recognized `derived_values_keyed` value.
- Supported keyed values are `concentration_per_ml`, `volume_to_administer_ml`, `quantity_to_administer_tablets`, `quantity_to_administer_capsules`, and `rate_ml_per_hr`.
- All dose, quantity, and rate derivations require `meta.order.unit === visual.amountUnit`. Cross-unit conversion, weight-based dosing, and free-text dose parsing are out of scope.
- `selfCheck` recomputes each declared value from `amount / perQty`, rounds to the declared precision, and requires exact equality.
- `showDerivedConcentration` must be false when the item keys on `concentration_per_ml`, because displaying that row would reveal the answer.
- **Caption rule:** captions and ancillary fields must not reveal the answer or clinical interpretation.
- **STRICTEST tier.** Human review must source-check the product strength, verify the order is clinically plausible, confirm the strength is not restated in the stem, and ensure nothing else on the item is accidentally unsafe.

### Kind: `device_screen`

Renders a PCA, infusion, or enteral pump settings display, not a picture of the device. The visual is load-bearing only when the learner must read a keyed setting from the screen or compute a value from settings that are not restated in the stem.

Unlike the global visual default, `device_screen` is allowed on `multiple_choice`, `select_all`, `matrix`, and `fill_in_blank`.

```json
{
  "visual": {
    "kind": "device_screen",
    "device": "pca",
    "title": { "en": "PCA Pump - morphine", "zh": "PCA 泵 - 吗啡" },
    "settings": [
      { "key": "drug", "text": "morphine" },
      { "key": "concentration", "text": "1 mg/mL" },
      { "key": "mode", "text": "PCA+basal" },
      { "key": "demand_dose", "value": 1, "unit": "mg" },
      { "key": "lockout_min", "value": 8, "unit": "min" },
      { "key": "basal_rate", "value": 1, "unit": "mg/hr", "flag": true }
    ],
    "caption": { "en": "PCA pump settings", "zh": "PCA 泵设置" }
  },
  "meta": {
    "visual_justification": "The learner must identify the basal infusion from the pump screen.",
    "tier": "strictest",
    "source": "...",
    "skill_signature": "device:pca-basal-opioid-naive",
    "stem_disambiguators": ["PCA", "opioid-naive"],
    "keyed_settings": [
      { "key": "basal_rate", "reason": "present_in_opioid_naive_pca" }
    ],
    "derived_values_keyed": {
      "max_dose_1h_mg": 8
    },
    "round": 0
  }
}
```

Controlled vocabularies:
- `device`: `pca`, `infusion`, `enteral`
- Text setting keys: `drug`, `concentration`, `mode`
- Numeric setting keys: `demand_dose`, `lockout_min`, `basal_rate`, `limit_1h`, `limit_4h`, `attempts`, `delivered`, `rate_ml_hr`, `vtbi_ml`, `volume_infused_ml`, `duration_min`

Validation and arithmetic rules:
- `kind` must be `"device_screen"` and `device` must use the controlled vocabulary.
- `settings` must be non-empty with no duplicate keys. Text keys require non-empty `text` and no numeric `value`; numeric keys require a finite value from 0 through 100,000.
- Optional `flag` values must be boolean. Flagging changes display emphasis only and does not assert that a setting is unsafe.
- `title.en` and `caption.en` are required when their objects are present. Optional `zh` values must be non-empty.
- `selfCheck` requires `visual_justification` and at least one cue in `keyed_settings` or recognized `derived_values_keyed`.
- Every `keyed_settings` entry must resolve to a setting present on the screen.
- Supported keyed derivations are `max_demands_1h`, `max_dose_1h_mg`, `delivered_dose_total_mg`, `infusion_volume_ml`, and `infusion_duration_min`.
- PCA hourly maxima derive from `lockout_min` and `demand_dose`; basal dose is included only when the displayed mode includes basal. Delivered-dose totals also require `meta.shift_hours` when basal is included.
- Infusion and enteral volume/duration derivations use only `rate_ml_hr`, `duration_min`, and `vtbi_ml`. Richer titration and free-water calculations are out of scope.
- `meta.round` may be `0`, `1`, or `2` and defaults to `0`. `selfCheck` recomputes each declared value, applies the shared deterministic rounding helper, and requires exact equality.
- **Caption/title rule:** captions, titles, and settings must not state a verdict or display a computed answer.
- **STRICTEST tier.** Human review must source-check device and drug settings, confirm the keyed cue is not restated in the stem, and verify that nothing other than the intended keyed element is accidentally unsafe.

### Kind: `fetal_monitoring`

Renders a synchronized cardiotocograph with fetal heart rate (FHR) above uterine activity (UA) on one time axis. The visual is load-bearing only when the learner must infer variability, acceleration presence, or deceleration type from the tracing. The stem must not name the keyed pattern.

```json
{
  "visual": {
    "kind": "fetal_monitoring",
    "durationSec": 300,
    "baselineFhr": 135,
    "variability": "minimal",
    "seed": 17,
    "contractions": [
      { "peakSec": 90, "amplitudeMmHg": 50, "durationSec": 60 },
      { "peakSec": 210, "amplitudeMmHg": 50, "durationSec": 60 }
    ],
    "decelerations": [
      {
        "type": "late",
        "nadirSec": 110,
        "depthBpm": 30,
        "durationSec": 70,
        "contractionIndex": 0
      }
    ],
    "caption": { "en": "Fetal monitoring tracing", "zh": "胎儿监护图" }
  },
  "meta": {
    "visual_justification": "The learner must infer the deceleration phase and variability from the synchronized tracing.",
    "tier": "strictest",
    "source": "NICHD 2008 workshop definitions; AWHONN FHM Principles and Practices, 6th ed.",
    "skill_signature": "fhr:late-deceleration/minimal-variability",
    "stem_disambiguators": ["fetal heart rate", "contractions"],
    "expected_pattern": {
      "decelerations": ["late"],
      "variability": "minimal",
      "accelerations_present": false
    }
  }
}
```

Controlled vocabularies:
- `variability`: `absent`, `minimal`, `moderate`, `marked`
- `decelerations[].type`: `early`, `late`, `variable`, `prolonged`

Validation and phase rules:
- `baselineFhr` is required and must be finite from 50 through 220 bpm.
- `durationSec` defaults to 600 and must be 120–1200. `seed` defaults to 0 and must be a non-negative integer.
- Contraction `peakSec` must lie on the strip. Optional amplitude is 5–100 mmHg and duration is 20–180 seconds.
- Acceleration `peakSec` must lie on the strip; structural bounds are rise 1–60 bpm and duration 5–120 seconds. The v1 `selfCheck` gate models the ≥32-week definition: rise ≥15 bpm, duration ≥15 seconds, and abrupt onset-to-peak under 30 seconds. Pre-32-week 10-by-10 and prolonged accelerations are out of v1 scope because gestational age and asymmetric onset are not modeled.
- Deceleration `nadirSec` must lie on the strip; structural bounds are depth 1–120 bpm and duration 5–600 seconds.
- `early` and `late` require a valid `contractionIndex`. `variable` omits it because variable decelerations have no fixed contraction-phase relationship; this does not mean they cannot occur near contractions.
- Gradual onset means onset-to-nadir ≥30 seconds. Early nadir is approximately simultaneous with the contraction peak; late nadir occurs after the contraction peak. The renderer uses a 5-second early tolerance and a 10–90-second late offset to keep synthetic fixtures visually unambiguous; those offsets are renderer guardrails, not NICHD clinical thresholds.
- Variable decelerations require abrupt onset-to-nadir under 30 seconds, depth ≥15 bpm, total duration ≥15 seconds and <2 minutes.
- Prolonged decelerations require depth ≥15 bpm and duration ≥2 minutes and <10 minutes; ≥10 minutes is a baseline change.
- Variability peak-to-trough bands are: absent = undetectable, minimal = detectable through 5 bpm, moderate = 6–25 bpm, marked = >25 bpm. The renderer uses deterministic representative amplitudes of 0, 4, 14, and 32 bpm.
- **NICHD 2008 Verified Constants:**
  - **Baseline normal:** 110–160 bpm.
  - **Variability:** absent = undetectable, minimal = detectable but ≤5 bpm, moderate = 6–25 bpm, marked = >25 bpm.
  - **Accelerations (Term/≥32 week):** abrupt increase, ≥15 bpm above baseline for ≥15 seconds and <2 minutes. (For <32 weeks, 10×10 criteria apply; content must specify term/gestational age when using 15×15).
  - **Decelerations:** 
    - Early: gradual onset, nadir mirrors contraction peak.
    - Late: gradual onset, nadir after contraction peak.
    - Variable: abrupt onset, ≥15 bpm drop lasting ≥15 seconds and <2 minutes, not necessarily time-locked.
    - Prolonged: ≥15 bpm drop lasting ≥2 minutes but <10 minutes.
- **Oxygen/Management Rule:** Do not key routine oxygen administration for Category II/III fetal tracings unless maternal hypoxia is explicitly present. Avoid oxygen as a distractor if it creates ambiguity with older teaching. Prefer maternal repositioning, stopping oxytocin if infusing, IV fluid bolus, provider notification, and preparation for expedited birth if unresolved.
- `selfCheck` requires non-empty `visual_justification` and at least one supported cue in `meta.expected_pattern`.
- Declared deceleration types, variability, and acceleration presence must match the visual spec. Every deceleration must pass its morphology/phase rule; every acceleration must pass the v1 term morphology rule.
- **Caption rule:** captions and visible SVG text must remain neutral. Never print a variability category, deceleration type, phase arrow, or clinical verdict.
- **Content rules:**
  - The stem must not name the deceleration type if the learner is expected to identify it.
  - The item must require reading the phase relationship between FHR nadir and contraction peak.
  - Rationales must be position-agnostic and not rely on option order.
- **STRICTEST tier.** Definitions were checked against the 2008 NICHD workshop report and AWHONN's current statement. See `audit/visual-source-verification-2026-06-12.md`.
- Future content uses globally unique `fhr_*` IDs and remains subject to raw → cross-model review → visual audit → promote → ledger.

### Kind: `burn_map`

Renders fixed anterior and posterior body schematics with whole burned regions shaded in solid translucent red. The visual is load-bearing only when the learner must identify the shaded regions and derive %TBSA or a Parkland value; the stem must not restate %TBSA.

Unlike the global visual default, `burn_map` is allowed on `multiple_choice`, `select_all`, `matrix`, and `fill_in_blank`.

```json
{
  "visual": {
    "kind": "burn_map",
    "population": "adult",
    "burns": ["trunk_anterior", "leg_l_anterior", "leg_r_anterior"],
    "caption": { "en": "Burn diagram", "zh": "烧伤示意图" }
  },
  "meta": {
    "visual_justification": "The learner must sum the shaded regions and use the result in Parkland arithmetic.",
    "tier": "strictest",
    "source": "Rule of Nines and Parkland references",
    "skill_signature": "burn:rule-of-nines-parkland/adult-major-burn",
    "stem_disambiguators": ["Rule of Nines", "Parkland"],
    "weight_kg": 70,
    "round": 0,
    "derived_values_keyed": {
      "tbsa_pct": 36,
      "parkland_total_ml": 10080,
      "parkland_first8h_ml": 5040,
      "parkland_rate_first8h_ml_hr": 630
    }
  }
}
```

Validation and arithmetic rules:
- `population` is `adult` or `pediatric` and defaults to `adult`.
- `burns` must contain one or more unique supported whole-region keys. Fractional burns and Lund-Browder interpolation are out of v1 scope.
- The fixed table covers anterior/posterior head, trunk, left/right arms, left/right legs, plus genitalia. Each population table sums to exactly 100.
- **Adult content:** Adult Rule of Nines is verified and adult `burn_map` content may proceed. Constants: Head/neck 9% (4.5% ant/post); Trunk 36% (18% ant/post); Each arm 9% (4.5% ant/post); Each leg 18% (9% ant/post); Genitalia/perineum 1%.
- **Pediatric content:** Pediatric `burn_map` content remains **BLOCKED**. Do not use a single modified pediatric Rule of Nines table for generated content. Pediatric content requires age-banded Lund-Browder support or a future deliberate scope decision.
- **Parkland wording rule:** Arithmetic keys use the traditional Parkland formula: `4 mL × body weight kg × %TBSA burned`. Half is given in the first 8 hours and half over the next 16 hours. Timing begins from time of burn injury, not time of arrival. %TBSA includes partial-thickness and full-thickness burns only, not superficial/first-degree. Because modern guidance may use lower starting volumes (e.g., 2 mL), any item keyed to the 4 mL calculation must explicitly say "Using the traditional Parkland formula..." or provide the 4 mL/kg/%TBSA constant in the stem/exhibit.
- `selfCheck` requires `visual_justification` and at least one recognized `derived_values_keyed` value.
- Supported keyed values are `tbsa_pct`, `parkland_total_ml`, `parkland_first8h_ml`, and `parkland_rate_first8h_ml_hr`.
- Parkland derivations require finite positive `meta.weight_kg`. `meta.round` may be `0`, `1`, or `2` and defaults to `0`.
- `selfCheck` recomputes %TBSA from the selected population table and shaded regions, derives Parkland values, applies shared deterministic rounding, and requires exact equality.
- For `fill_in_blank`, every numeric blank answer must exactly match at least one present recomputed derived value after that derivation is rounded. A mismatch reports `self_check_answer_value_mismatch`.
- **Answer-reveal rule:** the SVG may show only `Anterior`, `Posterior`, and the population label. It must not show region percentages, %TBSA, Parkland totals, or rates.
- **Content rule:** the stem must not state the %TBSA if the map is used.
- **STRICTEST tier.** Clinical review must also confirm the visual is necessary and the burn distribution and weight are plausible.

---

## Per-type structure

### 1. `multiple_choice` — single best answer
```json
{
  "id": "mc_hf_01", "itemType": "multiple_choice",
  "category": "Physiological Adaptation", "topic": "heart failure", "difficulty": "medium",
  "stem": { "en": "...", "zh": "..." },
  "options": [
    { "id": "A", "en": "...", "zh": "..." },
    { "id": "B", "en": "...", "zh": "..." },
    { "id": "C", "en": "...", "zh": "..." },
    { "id": "D", "en": "...", "zh": "..." }
  ],
  "correct": ["B"],
  "rationale": { "correct": {"en":"...","zh":"..."}, "byChoice": [ {"refId":"A","en":"...","zh":"..."}, {"refId":"B","en":"...","zh":"..."}, {"refId":"C","en":"...","zh":"..."}, {"refId":"D","en":"...","zh":"..."} ] },
  "testTakingStrategy": {"en":"...","zh":"..."},
  "glossary": [ {"termEn":"afterload","termZh":"后负荷","defZh":"心室收缩时必须克服的阻力"} ]
}
```
- `options`: 3–5 items, ids `A`,`B`,`C`,…
- `correct`: array with **exactly one** optionId.

### 2. `select_all` — SATA / multiple response
Same shape as `multiple_choice` but:
- `options`: 5–6.
- `correct`: array of **one or more** optionIds (no fixed count).

### 3. `ordered_response` — prioritization / drag-to-order
```json
{
  "itemType": "ordered_response",
  "options": [ {"id":"A","en":"step ...","zh":"..."}, {"id":"B",...}, {"id":"C",...}, {"id":"D",...} ],
  "correct": ["C","A","D","B"]
}
```
- `correct`: **every** optionId, listed in the correct order. Must be a permutation of all option ids (same set, no repeats, no omissions).

### 4. `fill_in_blank` — numeric (dosage calc) or short text
```json
{
  "itemType": "fill_in_blank",
  "stem": { "en": "Order: 500 mg in 250 mL over 2 h. Infuse at how many mL/hr?", "zh": "..." },
  "blanks": [
    {
      "id": "b1",
      "prompt": { "en": "mL/hr", "zh": "毫升/小时" },
      "acceptable": ["125", "125 mL/hr"],
      "numeric": { "value": 125, "tolerance": 0, "unit": "mL/hr" }
    }
  ]
}
```
- **No `options`.** No top-level `correct`.
- `blanks`: usually length 1; array allows multiple.
- Each blank needs **at least one** of `acceptable` (string match, trimmed + case-insensitive) or `numeric` (`value` ± `tolerance`, optional `unit`). If `numeric` present, the grader parses the entered number and accepts within tolerance.

### 5. `matrix` — grid / matrix multiple-choice
Rows are statements/findings; columns are categories. Each row gets a selection.
```json
{
  "itemType": "matrix",
  "matrix": {
    "rows": [ {"id":"r1","en":"Crackles in lung bases","zh":"肺底湿啰音"}, {"id":"r2",...} ],
    "columns": [ {"id":"c1","en":"Expected","zh":"预期"}, {"id":"c2","en":"Unexpected","zh":"非预期"} ],
    "selectionMode": "single_per_row"
  },
  "correct": [ {"rowId":"r1","columnIds":["c2"]}, {"rowId":"r2","columnIds":["c1"]} ]
}
```
- `selectionMode`: `single_per_row` (radio per row, `columnIds` length 1) or `multiple_per_row` (checkboxes, `columnIds` length ≥1).
- `correct`: exactly one entry per row; every `rowId` must exist in `matrix.rows`, every `columnId` in `matrix.columns`.

### 6. `dropdown_cloze` — drop-down rationale / cloze
```json
{
  "itemType": "dropdown_cloze",
  "stem": { "en": "scenario context ...", "zh": "..." },
  "clozeStem": {
    "en": "The client is most at risk for {{1}} due to {{2}}.",
    "zh": "由于 {{2}}，该患者最有可能发生 {{1}}。"
  },
  "dropdowns": [
    { "id": "1", "options": [ {"id":"o1","en":"hypokalemia","zh":"低钾血症"}, {"id":"o2","en":"hyperkalemia","zh":"高钾血症"} ], "correct": "o1" },
    { "id": "2", "options": [ {"id":"o1","en":"loop diuretic use","zh":"袢利尿剂使用"}, {"id":"o2","en":"beta blocker use","zh":"β受体阻滞剂使用"} ], "correct": "o1" }
  ]
}
```
- `clozeStem`: both languages, with `{{id}}` placeholders matching each `dropdowns[].id`. Placeholders must appear in both `en` and `zh`.
- Each dropdown's `correct` is one of its own option ids. No top-level `correct`.

### 7. `case_study` — unfolding NGN case container
`case_study` is a top-level `1.1+` item type for harder NGN practice. It presents shared chart/exhibit data once, then asks 2–6 embedded standalone questions that reuse the existing six item types.

```json
{
  "id": "case_sepsis_01",
  "itemType": "case_study",
  "category": "Physiological Adaptation",
  "topic": "sepsis from pneumonia",
  "difficulty": "hard",
  "stem": { "en": "Review the client record and answer the case-study items.", "zh": "..." },
  "caseStudy": {
    "title": { "en": "Unfolding case: suspected sepsis", "zh": "..." },
    "summary": { "en": "Brief case setup", "zh": "..." },
    "exhibits": [
      {
        "id": "triage",
        "title": { "en": "0730 triage note", "zh": "..." },
        "content": { "en": "Vital signs, history, labs, etc.", "zh": "..." },
        "visual": { "kind": "rhythm_strip", "rhythm": "sinus", "rateBpm": 75 }
      }
    ],
    "stages": [
      {
        "id": "stage_0815",
        "title": { "en": "0815 update", "zh": "..." },
        "exhibits": [
          {
            "id": "new_labs",
            "title": { "en": "New results", "zh": "..." },
            "content": { "en": "...", "zh": "..." }
          }
        ]
      }
    ],
    "questions": [
      { "id": "case_sepsis_01_part_1", "itemType": "matrix", "...": "full standalone question shape" },
      { "id": "case_sepsis_01_part_2", "itemType": "ordered_response", "...": "full standalone question shape" }
    ]
  },
  "rationale": { "correct": { "en": "Case-level clinical reasoning summary", "zh": "..." } },
  "testTakingStrategy": { "en": "...", "zh": "..." },
  "glossary": []
}
```

- `caseStudy.exhibits`: required, at least one exhibit. Use concise chart-like content; newline-separated vitals/labs are allowed.
- `caseStudy.exhibits[].visual`: optional schema `1.2` visual stimulus. Exhibit `title` and `content` remain required even when a visual is present.
- `caseStudy.stages`: optional unfolding updates, each with at least one exhibit.
- `caseStudy.questions`: 2–6 embedded standalone questions. Embedded questions must be one of the six v1.0 item types and must include their own full common fields, rationale, strategy, and glossary.
- Embedded question ids must be unique within the case and differ from the parent case id.
- Case-level `rationale.correct` summarizes the whole case. Each embedded question carries the detailed graded rationale.

---

## Validation rules (importer + commit-time check)

An item is **invalid → skipped and reported** (never partially rendered) if any apply:
- Missing `id`, `itemType`, `stem.en`, `stem.zh`, `rationale.correct.en/zh`, `testTakingStrategy.en/zh`.
- `category` not in the controlled vocabulary; `difficulty`/`itemType`/`ngnSkill` not in their enums.
- Any required `{ en, zh }` pair with an empty string.
- **option types:** missing `options` or `correct`; a `correct` id not present in `options`; `multiple_choice` `correct` length ≠ 1; `ordered_response` `correct` not a permutation of all option ids.
- **fill_in_blank:** missing `blanks`, or a blank with neither `acceptable` nor `numeric`.
- **matrix:** missing `matrix.rows`/`matrix.columns`/`correct`; a `rowId`/`columnId` not found; `single_per_row` with a `columnIds` length ≠ 1.
- **dropdown_cloze:** a `{{id}}` in `clozeStem` with no matching dropdown (or vice versa); a dropdown `correct` not among its options; placeholders missing from `zh`.
- **case_study:** `meta.schemaVersion` is `"1.0"`; missing `caseStudy.exhibits`; fewer than 2 or more than 6 embedded questions; an embedded question is another `case_study`; embedded ids are duplicated.
- **visual:** present in a versioned bank below schema `"1.2"`; placed on an unsupported item type; unknown visual `kind`; invalid rhythm class; out-of-range rate, duration, interval, seed, atrial rate, or conduction ratio.

Report format: `"imported N of M; skipped K (reasons...)"`.

---

## Grading (app must implement consistently)

- `multiple_choice`: correct iff selected == the single `correct` id.
- `select_all`: correct iff selected set == `correct` set exactly (NCLEX gives no partial credit on SATA; the app may optionally show "x of y" but scores it all-or-nothing).
- `ordered_response`: correct iff submitted order == `correct` order exactly.
- `fill_in_blank`: per blank, correct iff matches an `acceptable` (trim + lowercase) OR (if `numeric`) parsed value within `value ± tolerance`. All blanks must pass.
- `matrix`: correct iff every row's selected `columnIds` set == the `correct` entry for that row.
- `dropdown_cloze`: correct iff every dropdown's selection == its `correct`.
- `case_study`: correct iff every embedded question is correct. The app also shows each part's correct/review status and rationale after submission.

---

## Notes

- `highlight` / enhanced hot-spot and `bowtie` are still intentionally not in v1.2. Adding them later = a `1.x` bump with new type blocks.
- `case_study` is the v1.1 hard-mode container for multi-part unfolding practice. It deliberately reuses v1.0 embedded item types instead of introducing new grading rules.
- IDs: any unique string is fine. A readable convention like `<type>_<topicslug>_<n>` helps debugging but isn't required.
- Keep `topic` strings consistent across batches (e.g., always `"heart failure"`, not sometimes `"CHF"`) so the coverage tool tallies cleanly. Minor variants can be fuzzy-grouped by the tool.
