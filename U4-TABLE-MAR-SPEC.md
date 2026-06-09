# U4 · Table/Form Primitive + `mar` Renderer Spec

**Type:** primitive (code) + renderer (code) + later content lane.
**Depends on:** U0 (registry).
**Concurrent-safe with:** U3 (`lab_trend`). Shared touch-points are the append-only union line and registration line only.
**Status:** specced, not implemented.

Read `AGENTS.md`, `DECISIONS.md`, `VISUAL-STIMULI-ROADMAP.md`, and `NCLEX-Question-Schema.md` first; on any conflict they win. This spec covers the U4 row of the roadmap: the reusable **table/form primitive** plus its first consumer, the **`mar`** (Medication Administration Record) kind. The primitive is built reusably so U5 (`io_record`), U6 (`medication_label`), and U9 (`device_screen`) are small later.

---

## 1. Purpose and necessity doctrine

`mar` renders a nursing **Medication Administration Record**: medications (name, dose, route, frequency) against a time grid of administration events (given / held / due / missed). Targets (roadmap): unsafe orders, missed doses, adverse-effect timing, prioritization.

A MAR is documentation, and a table of text is the *most* decorative-prone visual on the whole roadmap. Necessity is structural here too:

1. **The load-bearing cue must be a relationship across the grid**, not a single fact the stem already states. Legitimate cues: a dose given too close to the prior dose (timing collision), a held/missed dose, duplicate therapy across two rows, a PRN given outside its interval, an administration whose *timing* relative to another event is the danger. If the answer is "is this one drug appropriate for this diagnosis," that's a text item — the MAR adds nothing.
2. **Declared keyed cell(s).** The item declares in question-level `meta` which cell(s)/relationship the answer turns on; `selfCheck` asserts those cells exist in the rendered MAR (§6).
3. **Strictest tier (clinical).** Drug/dose/route/frequency correctness is a human-review responsibility (`AGENTS.md` strictest tier), not something `selfCheck` can judge. `selfCheck` enforces *structure* and *necessity*; stage-4 human review enforces *clinical safety* — including that nothing **other** than the keyed element is accidentally unsafe.

---

## 2. Files

```
src/visuals/primitives/table.ts        # NEW reusable primitive (renderDocTable)
src/visuals/kinds/mar/
  index.ts                             # validate / selfCheck / renderSvg / fixtures + registerVisual(...)
  types.ts                             # MarSpec, MarRoute, MarStatus, MarMedication
```

Reuse `graphPaper.ts` (`fmt`) and `escapeXml.ts`. Append-only shared lines:
- `src/visuals/types.ts`: `export type QuestionVisual = … | MarSpec;`
- `src/visuals/kinds/index.ts`: `import "./mar";`

No edits to `App.tsx` / `schema.ts` / `validate-bank.ts` / `coverage-report.ts`.

---

## 3. Table/form primitive (`primitives/table.ts`)

A pure SVG grid renderer styled as clinical documentation, analogous in shape and discipline to `renderLineChart` (returns a `<g>` fragment; deterministic; `fmt` on every coordinate; `escapeXml` on every text run).

```ts
export interface DocTableColumn {
  key: string;                 // matches keys in DocTableRow.cells
  label: string;               // header text
  align?: "left" | "center" | "right";  // default "left"
  widthFr?: number;            // flex fraction for column width; default 1
}
export interface DocTableCell {
  text: string;
  styleRole?: string;          // theme color (reuse lineChart colorForRole roles)
  emphasis?: "normal" | "bold" | "flag";  // "flag" = highlighted background (abnormal/attention)
}
export type DocTableCellInput = string | DocTableCell;   // bare string => {text, normal}
export interface DocTableRow {
  cells: Record<string, DocTableCellInput>;  // keyed by column.key; missing key => blank cell
  rowHeader?: boolean;         // render row as a section/group header band
}
export interface DocTableInput {
  title?: string;              // optional caption row inside the <g>
  columns: DocTableColumn[];
  rows: DocTableRow[];
  width?: number;              // default 600
  rowHeight?: number;          // default 28
  headerHeight?: number;       // default 32
}
export function renderDocTable(input: DocTableInput): string;  // returns <g class="doc-table">…</g>
```

Rules:
- Column x-positions computed from `widthFr` over `width`; deterministic.
- Header row uses a distinct fill; body rows zebra-stripe (deterministic by index).
- `emphasis:"flag"` gives the cell a highlighted background (e.g., `band` role) — **styling only**; it must not encode the answer key (a caption/flag must never reveal the answer — see §7).
- All text `escapeXml`-ed; all numbers via `fmt`. No `Date`/`Math.random`/DOM/network.

**Extension surface (design for, don't build in U4):** U6 `medication_label` and U9 `device_screen` are key-value *panels*, not grids. Add a sibling `renderFieldPanel(input)` (label/value rows) to this module when U6 lands; keep `renderDocTable` and `renderFieldPanel` colocated so the "table/form primitive" is one module. U4 ships `renderDocTable` only; note the intended `renderFieldPanel` signature in a comment so U6/U9 don't redesign it.

---

## 4. `mar` spec type (`kinds/mar/types.ts`)

```ts
export type MarRoute =
  | "PO" | "IV" | "IVPB" | "IM" | "SubQ" | "SL" | "PR" | "topical" | "inhaled" | "ophthalmic" | "NG";
export type MarStatus = "given" | "held" | "due" | "missed" | "late" | "not_given";

export interface MarMedication {
  /** Generic name (brand optional in parentheses). Display string. */
  name: string;
  /** Display dose, e.g. "40 mg", "5000 units". Dose ARITHMETIC is U6's job, not mar's. */
  dose: string;
  route: MarRoute;
  /** e.g. "q6h", "daily", "BID", "PRN q4h". Display string. */
  frequency: string;
  /** Administration events; each time must be a member of MarSpec.timeGrid. */
  administrations: { time: string; status: MarStatus }[];
  /** Visual emphasis + audit aid only; not a clinical assertion. */
  isHighAlert?: boolean;
}

export interface MarSpec {
  kind: "mar";
  /** Column labels for time slots, e.g. ["0600","1200","1800","2400"]. Non-empty, unique. */
  timeGrid: string[];
  /** >=1 medication rows. */
  medications: MarMedication[];
  caption?: { en: string; zh?: string };
}
```

`dose` and `frequency` are display strings, not parsed quantities: a MAR is a record, and dose math belongs to U6 `medication_label`. Keeping them as strings avoids a half-built dosage engine here.

---

## 5. `validate(spec): VisualError[]`

| Check | `code` |
|---|---|
| `kind === "mar"` | `invalid_kind` |
| `timeGrid` non-empty array of non-empty strings | `time_grid_empty` |
| `timeGrid` entries unique | `time_grid_duplicate` |
| `medications` length >= 1 | `medications_empty` |
| each med `name`/`dose`/`frequency` non-empty string | `med_field_missing` |
| each med `route` in `MarRoute` | `invalid_route` |
| each med `administrations` is an array | `administrations_invalid` |
| each administration `time` is a member of `timeGrid` | `admin_time_not_in_grid` |
| each administration `status` in `MarStatus` | `invalid_status` |
| no duplicate `(medication, time)` administration | `duplicate_administration` |
| `isHighAlert` (if given) boolean | `invalid_high_alert` |
| caption rule (en required if present; zh non-empty if present) | `caption_en_required` / `caption_zh_empty` |

Never throw; guard every access (follow `validateVitalsTrend`'s defensive style).

---

## 6. Question-level `meta` + `selfCheck(spec, question)`

`mar` uses the same canonical question-level `meta` block defined in **U3 spec §6.1** (`visual_justification`, `source`, `tier`, `skill_signature`, `stem_disambiguators`). It adds a `mar`-specific keyed-cue field:

```jsonc
"meta": {
  "visual_justification": "REQUIRED non-empty — why the MAR is load-bearing.",
  "tier": "strictest",
  "source": "string",
  "keyed_cells": [
    { "medication": "enoxaparin", "time": "1800", "reason": "held_dose" }
  ],
  "keyed_relationship": "string | null"   // e.g. 'duplicate anticoagulant across rows', when the cue spans cells
}
```

`selfCheck` responsibilities (non-fatal at import; clean before promotion; never throws):

1. **Necessity** — `visual_justification` present/non-empty (`self_check_missing_justification`); at least one `keyed_cells` entry **or** a non-null `keyed_relationship` (`self_check_no_keyed_cue`).
2. **Keyed-cell presence** — every `keyed_cells` entry resolves to an actual `(medication, time)` administration in the spec, with the time in `timeGrid` (`self_check_keyed_cell_absent`). This is the structural backstop: the thing the answer turns on must be in the rendered artifact.
3. **Internal consistency echo** — re-assert that all administration times are in the grid and statuses are valid (cheap double-check independent of `validate`).

`selfCheck` deliberately does **not** judge clinical safety (right drug/dose/route). That is stage-4 human review under the strictest tier — including verifying nothing *other* than the keyed cell is accidentally unsafe.

---

## 7. `renderSvg(spec): string`

- Build a `DocTableInput`: columns = `["Medication","Dose","Route","Freq", ...timeGrid]`; one body row per medication; time-slot cells render the `status` (short glyph/abbrev, e.g. given "✓ 0600" or a status token) with `emphasis:"flag"` for `held`/`missed`/`late`, `bold` for `isHighAlert` med names.
- Pass to `renderDocTable`; wrap: `<svg xmlns=... viewBox="0 0 600 <h>" role="img" aria-label="Medication Administration Record" data-kind="mar"> … </svg>` where height is derived deterministically from row count.
- **The rendered status tokens and flag styling must not state the answer.** Highlighting a held dose is fine (it's a finding to interpret); a caption or cell text saying "unsafe" or "duplicate therapy" is not (§ caption rule below).
- Deterministic: identical spec → byte-identical SVG.

**Caption rule:** `caption` must never reveal the answer (mirror `rhythm_strip`'s rule). Do not caption a MAR "Duplicate anticoagulant therapy" on an item asking the learner to identify the duplication.

---

## 8. Fixtures

`valid` (≥2): a four-slot MAR with a held heparin dose at one slot (single keyed cell); a two-row MAR showing a timing collision (keyed_relationship).

`invalid` (assert each `code`): `medications_empty`; `invalid_route`; `admin_time_not_in_grid`; `duplicate_administration`; `time_grid_duplicate`; `invalid_status`.

Conformance harness runs these automatically.

---

## 9. Tests

- **Conformance (automatic):** fixtures + determinism over all kinds.
- **Primitive** (`scripts/tests/doc-table.ts`): column layout determinism; `escapeXml` on cell text (XSS `<script>` token is neutralized); zebra/flag styling stable; missing-key cell renders blank.
- **Kind-specific** (`scripts/tests/mar.ts`, register in `npm run test-visuals`): validation codes; `selfCheck` necessity + keyed-cell presence; render determinism.
- **Parity:** add `mar` fixtures to `scripts/tests/__snapshots__/visual-parity.json`.

---

## 10. Acceptance / verification

```sh
npm run test-visuals
npm run validate-bank -- banks/*.json
npm run coverage-report      # mar appears in the per-kind breakdown
npm run build
```

All green; `NCLEX-Question-Schema.md` gains a `mar` per-kind subsection (§4–§7) and references the shared §6.1 `meta` contract; the table primitive is documented as reusable with the `renderFieldPanel` extension noted for U6/U9.

---

## 11. Content lane (after the renderer lands — separate pass)

- ID prefix `mar_*`, disjoint from other kinds.
- Generate → `banks/banks-raw/` → cross-model review (generator never reviews its own) → **strictest-tier source-check** (drug/dose/route/frequency clinically valid; the unsafe element is the one the key flags; nothing else accidentally unsafe) → visual audit (artifact matches spec; necessity holds) → human content review → promote to `banks/visual-canonical.json` → ledger entry → delete raw.
- Every item carries the §6 `meta` with a specific `visual_justification` and resolvable `keyed_cells`/`keyed_relationship`.
- Targets (roadmap): unsafe orders, missed/held doses, adverse-effect timing, prioritization across the MAR.

---

## Sequencing note (U3 ∥ U4)

`lab_trend` (U3) and the table primitive + `mar` (U4) touch disjoint files; the only shared edits are the two append-only barrel lines. Run them in parallel, one agent per slice end-to-end. **One coordination point:** both specs adopt the canonical question-level `meta` contract defined in **U3 §6.1**, and U3 owns the `vitals_trend` `selfCheck` / schema-doc reconciliation (§6.3). Land U3's `meta` reconciliation (or at least merge its §6.1 definition into `NCLEX-Question-Schema.md`) before `mar` content generation begins, so both kinds generate against one documented contract.
