# U5 · `io_record` Renderer Spec

**Type:** renderer (code) + later content lane.
**Depends on:** U4 (table/form primitive — `renderDocTable`, already merged).
**Concurrent-safe with:** U6/U9; U3 and U4 already landed. Shared touch-points are the append-only union line and registration line only.
**Status:** implemented 2026-06-11.

Read `AGENTS.md`, `DECISIONS.md`, `VISUAL-STIMULI-ROADMAP.md`, and `NCLEX-Question-Schema.md` first; on any conflict they win. This spec covers the U5 row of the roadmap: the **`io_record`** (intake & output flowsheet) kind. It reuses the U4 table primitive directly and adds no new primitive — `renderFieldPanel` (the U6/U9 panel primitive) is **not** needed here.

---

## 1. Purpose and necessity doctrine

`io_record` renders a nursing **intake & output (I&O) flowsheet**: charted fluid intake entries and output entries over a documented period. Targets (roadmap): fluid overload, dehydration, AKI/oliguria recognition, evaluation of a treatment's effect on fluid balance.

An I&O sheet is documentation, so it is decorative-prone — the gating rule applies with force:

1. **The load-bearing cue must be a *computed* value** the stem does not already state — a total or the net balance the learner has to **derive** from the individual entries. If the stem says "the client's net balance is +800 mL, what is the priority?", the flowsheet adds nothing and the item is a text item. The flowsheet earns its place only when reading the totals off the entries is the task.
2. **Declared keyed value(s).** The item declares in question-level `meta.derived_values_keyed` which total(s) the answer turns on; `selfCheck` recomputes them from the entries and asserts exact equality (§6). This is the whole point of the kind: **the arithmetic is machine-verified, not trusted.**
3. **Totals cannot be hand-keyed — structurally.** The spec carries only per-entry `volumeMl`; there are **no total fields on the spec**. Both the renderer and `selfCheck` derive totals by summation. A total can therefore never drift from its entries, because it never exists as independent data. This is the cleanest expression of the roadmap's "never hand-key a total" rule — there is nothing to hand-key.

`selfCheck` enforces *structure* and *arithmetic*; stage-4 human review enforces that the derivation is actually *required* (not restated in the stem) and that the rationale interprets the balance correctly.

---

## 2. Files

```
src/visuals/kinds/io_record/
  index.ts                # validate / selfCheck / renderSvg / fixtures + registerVisual(...)
  types.ts                # IoEntry, IoRecordSpec
```

Reuse `primitives/table.ts` (`renderDocTable`), `primitives/graphPaper.ts` (`fmt`), `primitives/escapeXml.ts`. Append-only shared lines:
- `src/visuals/types.ts`: `export type QuestionVisual = … | IoRecordSpec;` and `import type { IoRecordSpec } from "./kinds/io_record/types";`
- `src/visuals/kinds/index.ts`: `import "./io_record";`

No edits to `App.tsx` / `schema.ts` / `validate-bank.ts` / `coverage-report.ts` (all registry-driven).

---

## 3. Placement

```md
allowedItemTypes:
[
  "multiple_choice",
  "select_all",
  "matrix",
  "fill_in_blank"
]
```

Rationale:

io_record is one of the few visual kinds where direct calculation is often
the learning objective.

Numeric fill_in_blank items are explicitly supported.

Visual rendering already occurs at the QuestionCard layer independent of
answer-control type, so no additional UI wiring is required.

---

## 4. Spec type (`kinds/io_record/types.ts`)

```ts
export interface IoEntry {
  /** Display detail, e.g. "PO water", "0.9% NaCl IV", "Foley urine". escapeXml'd at render. */
  label: string;
  /** Whole milliliters. Integer > 0. There are NO total fields on the spec — totals are derived. */
  volumeMl: number;
}

export interface IoRecordSpec {
  kind: "io_record";
  /** Optional display label for the charted period, e.g. "0700–1500 shift", "24-hour total". Display only; no arithmetic. */
  periodLabel?: { en: string; zh?: string };
  /** Intake entries (may be empty if the item keys only on output). */
  intake: IoEntry[];
  /** Output entries (may be empty if the item keys only on intake). */
  output: IoEntry[];
  caption?: { en: string; zh?: string };
}
```

Design notes:
- **Two arrays, not a per-entry `type` field.** Direction (intake vs output) is encoded by which array an entry lives in — this matches how a real I&O sheet is organized and removes a validation case.
- **`volumeMl` is an integer.** Charted volumes are whole mL; requiring integers means `selfCheck` equality is exact integer arithmetic with **no epsilon** (contrast `lab_trend`'s `stableEps`). State and enforce it.
- **No `category` vocabulary in v1.** Source identity is a free display string. A controlled `IoCategory` enum (for grouping/icons) is a possible later extension; it is not load-bearing for the totals, so it is out of v1 scope.

---

## 5. `validate(spec): VisualError[]`

Follow `validateMar` / `validateLabTrend` defensive style — never throw; guard every access.

| Check | `code` |
|---|---|
| `kind === "io_record"` | `invalid_kind` |
| `intake` is an array | `intake_invalid` |
| `output` is an array | `output_invalid` |
| `intake.length + output.length >= 1` | `no_entries` |
| each entry `label` non-empty string | `entry_label_missing` |
| each entry `volumeMl` is a finite integer `> 0` | `invalid_volume` |
| each entry `volumeMl <= MAX_ENTRY_ML` (sanity) | `volume_out_of_range` |
| `periodLabel` rule (en required if present; zh non-empty if present) | `period_label_en_required` / `period_label_zh_empty` |
| caption rule (en required if present; zh non-empty if present) | `caption_en_required` / `caption_zh_empty` |

`MAX_ENTRY_ML = 10000` is a **sanity bound, not a clinical claim** — it catches a misplaced digit on a single charted volume, not a clinically implausible one. Like `max_cell_deviation_pp` in `DECISIONS.md`, treat it as a calibratable placeholder; widen it if a legitimate single-entry volume trips it during the content lane.

No duplicate-label check: two `0.9% NaCl IV` intake rows are legitimate, and because `selfCheck` keys on **totals** (not on individual entries), duplicate labels are harmless.

---

## 6. Question-level `meta` + `selfCheck(spec, question)`

`io_record` uses the canonical question-level `meta` block (§6.1 of `NCLEX-Question-Schema.md`) and adds one kind-specific keyed-cue field, `derived_values_keyed`. Full shape:

```jsonc
"meta": {
  // --- inherited from §6.1 canonical shape ---
  "visual_justification": "REQUIRED non-empty — why deriving the total/balance from the sheet is the task.",
  "tier": "standard",
  "source": "string",
  "skill_signature": "io_record:net-balance/positive-overload",
  "stem_disambiguators": ["intake and output", "net balance"],
  // --- io_record-specific addition ---
  "derived_values_keyed": {
    "intake_total_ml": 1580,    // optional
    "output_total_ml": 750,     // optional
    "net_balance_ml": 830       // optional; intake_total - output_total (signed)
  }
}
```

`selfCheck` responsibilities (non-fatal at import; clean before promotion; **never throws** — return `[]` on malformed spec, mirror `selfCheckVitalsTrend`):

1. **Necessity — justification.** `visual_justification` present/non-empty → else `self_check_missing_justification`.
2. **Necessity — keyed value.** `derived_values_keyed` present with at least one of `intake_total_ml` / `output_total_ml` / `net_balance_ml` → else `self_check_no_keyed_values`. (If the answer turns on no computed value, the sheet is decorative.)
3. **Arithmetic gate (the core of the kind).** Recompute from the entries:
   - `intakeTotal = Σ intake[i].volumeMl`
   - `outputTotal = Σ output[i].volumeMl`
   - `netBalance = intakeTotal − outputTotal`
   For each key **present** in `derived_values_keyed`, assert exact integer equality with the recomputed value. Any mismatch → `self_check_total_mismatch`. **Per the roadmap this is a build failure, not a content note** — a keyed total that disagrees with the entries is a broken item.
4. **Internal consistency echo.** Re-assert each `volumeMl` is a finite positive integer (cheap, independent of `validate`) → `self_check_invalid_volume`.

Conformance-harness behavior:

selfCheck({} as IoRecordSpec, {} as Question)
returns [] and never throws.

Promotion-gate behavior:

When question.meta exists, the following become mandatory:

- visual_justification
- derived_values_keyed

Missing required fields generate self-check errors.

`selfCheck` does **not** judge clinical interpretation (whether +830 mL means overload in *this* client). That is stage-4 human review.

---

## 7. `renderSvg(spec): string`

Single stacked documentation table via `renderDocTable`. The renderer **computes** the subtotal/total/net rows by summing entries — it never reads a total from the spec (there are none).

- `title` = `periodLabel?.en ?? "Intake & Output Record"`.
- Columns: `[{ key: "item", label: "", widthFr: 3, align: "left" }, { key: "vol", label: "Volume (mL)", widthFr: 1.4, align: "right" }]`.
- Rows, in order:
  1. `{ rowHeader: true, cells: { item: "Intake" } }`
  2. one row per intake entry: `{ cells: { item: e.label, vol: fmt(e.volumeMl) } }`
  3. `{ cells: { item: { text: "Intake total", emphasis: "bold" }, vol: { text: fmt(intakeTotal), emphasis: "bold" } } }`
  4. `{ rowHeader: true, cells: { item: "Output" } }`
  5. one row per output entry
  6. `{ cells: { item: { text: "Output total", emphasis: "bold" }, vol: { text: fmt(outputTotal), emphasis: "bold" } } }`
  7. `{ cells: { item: { text: "Net balance", emphasis: "bold" }, vol: { text: signed(netBalance), emphasis: "bold" } } }`
- `signed(n)` renders `"+" + n` for `n >= 0`, `"−" + Math.abs(n)` (U+2212) otherwise. The header carries the unit, so entry/total cells are bare integers.
- Wrap: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 <h>" role="img" aria-label="<escaped>" data-kind="io_record"> … </svg>`, where `aria-label` = escaped `caption.en` (else `periodLabel.en`, else `"Intake and Output Record"`) and `<h>` is derived deterministically from `renderDocTable`'s height math (title + header + rowCount·rowHeight; rowCount = `intake.length + output.length + 5`).
- **No clinical editorializing in styling.** The net-balance row is bold but uses **no `flag` color** — flagging it red/yellow would assert a verdict (overload/deficit) that belongs to the question, not the visual. (Mirror `mar`'s "the render must not state the answer.")
- Deterministic: identical spec → byte-identical SVG. `escapeXml` on `aria-label`; `renderDocTable` already escapes all cell text.

**Caption rule:** `caption` / `periodLabel` must never reveal the answer — do not caption a sheet "Fluid volume overload."

---

## 8. Fixtures

`valid` (≥2):
1. **Net-positive shift.** intake `PO 480`, `0.9% NaCl IV 1000`, `IV piggyback antibiotic 100` (= 1580); output `Foley urine 600`, `Emesis 150` (= 750); net `+830`. With `caption` + `periodLabel` (en/zh).
2. **Output-heavy / net-negative.** intake `PO 240`, `0.9% NaCl IV 500` (= 740); output `Urine 1400`, `NG drainage 300` (= 1700); net `−960`.

`invalid` (assert each `code`): `no_entries` (both arrays empty); `invalid_volume` (a negative or non-integer `volumeMl`); `volume_out_of_range` (e.g. `volumeMl: 50000`); `entry_label_missing` (empty label); `invalid_kind` (`kind: "mar"`); `intake_invalid` (`intake` not an array); `caption_en_required` (`caption: { en: "" }`); `caption_zh_empty` (`caption: { en: "x", zh: "" }`); `period_label_en_required` (`periodLabel: { en: "" }`); `period_label_zh_empty` (`periodLabel: { en: "x", zh: "" }`).

The conformance harness runs these automatically (valid → 0 validate errors, well-formed `<svg>…</svg>`, no `NaN`/`undefined`, deterministic ×2, `selfCheck` no-throw).

---

## 9. Tests

- **Conformance (automatic):** fixtures + determinism over all kinds (`visuals-conformance.ts`).
- **Kind-specific** (`scripts/tests/io-record.ts`, register in the `test-visuals` script): assert representative validation codes (`invalid_volume`, `no_entries`, `volume_out_of_range`, `entry_label_missing`), render determinism, and — the important one — the **arithmetic `selfCheck`**:
  - keyed `{ intake_total_ml: 1580, output_total_ml: 750, net_balance_ml: 830 }` against the fixture-1 entries → 0 errors;
  - a planted wrong total (`net_balance_ml: 999`) → `self_check_total_mismatch`;
  - `meta` with `visual_justification` but no `derived_values_keyed` → `self_check_no_keyed_values`;
  - `selfCheck({} as IoRecordSpec, {})` → no throw, `[]` (defensive).
  This is also the dedicated-test pattern `lab_trend`/`mar` currently lack; U5 ships with it from the start.
- **Parity:** update parity snapshots if this repo expects checked-in visual hashes.

---

## 10. Acceptance / verification

```sh
npm run test-visuals
npm run validate-bank -- banks/*.json
npm run census
npm run census:check
npm run build
```

All green. `NCLEX-Question-Schema.md` gains an `io_record` per-kind subsection (§3–§6 of this spec) referencing the shared §6.1 `meta` contract and documenting `derived_values_keyed` as the arithmetic gate. Mark the U5 row **DONE** in `VISUAL-STIMULI-ROADMAP.md` and add a `PROJECT-HISTORY.md` milestone.

---

## 11. Content lane (after the renderer lands — separate pass)

- ID prefix `io_*`, disjoint from other kinds.
- Generate → `banks/banks-raw/` → cross-model review (generator never reviews its own) → source-check → visual audit (artifact matches spec; the derivation is genuinely required, not restated in the stem) → human content review → `npm run promote` → merge into `banks/io-canonical.json` → `npm run audit` → ledger entry → delete raw.
- The arithmetic is machine-checked by `selfCheck`, so human review concentrates on: are these realistic charted volumes? is the keyed total the load-bearing cue (not restated in the stem)? does the rationale interpret the balance correctly and position-agnostically (per `DECISIONS.md` principle 4)?
- Targets (roadmap): fluid overload, dehydration, AKI/oliguria, evaluation of treatment effect.

---

## 12. Error Codes

Validation codes

```text
invalid_kind
intake_invalid
output_invalid
no_entries
entry_label_missing
invalid_volume
volume_out_of_range
period_label_en_required
period_label_zh_empty
caption_en_required
caption_zh_empty
```

Self-check codes

```text
self_check_missing_justification
self_check_no_keyed_values
self_check_total_mismatch
self_check_invalid_volume
```

---

## 13. Canonical SVG Example

```text
Intake
PO water                     480
0.9% NaCl IV                1000
IV piggyback antibiotic      100
Intake total                1580

Output
Foley urine                  600
Emesis                       150
Output total                 750

Net balance                 +830
```

---

## 14. Do Not Touch

Do not modify:

```text
src/schema.ts
src/App.tsx
scripts/validate-bank.ts
scripts/coverage-report.ts
scripts/census.ts
```

unless a failing test demonstrates a required change.

---

> Implement U5 io_record exactly as specified. Follow existing mar and lab_trend patterns. Prefer copying established visual-kind structure over inventing new abstractions. Registry architecture already exists. Fill-in-blank support is approved. Census integration already exists. Do not perform content generation or promotion work.
