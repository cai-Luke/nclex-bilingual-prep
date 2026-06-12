# U9 · `device_screen` Renderer Spec

**Type:** renderer (code) + later content lane.
**Depends on:** **U6** (`renderFieldPanel` + `measureFieldPanel` in `primitives/table.ts`). Also U4 (same module). U6 must merge first — U9 adds no primitive.
**Concurrent-safe with:** U3/U5 (landed) and the U6 *content* lane. Not concurrent with U6's *code* (shared primitive). **U6-before-U9 is enforced by delivery order — this spec is not handed to Codex until U6 has merged**, so the `renderFieldPanel`/`measureFieldPanel`/`fmtNum`/`roundTo` it imports are guaranteed to exist.
**Status:** implemented (2026-06-12).

Read `AGENTS.md`, `DECISIONS.md`, `VISUAL-STIMULI-ROADMAP.md`, `NCLEX-Question-Schema.md`, and **the U6 spec** first; on conflict they win. This spec covers the U9 row: **`device_screen`** — a rendered device **settings display** (PCA pump, infusion pump, enteral feeding pump), *not* a picture of a device.

---

## 1. Purpose and necessity doctrine

`device_screen` renders the **settings panel of an infusion-class device**: the numbers a nurse reads off the screen. Targets (roadmap): unsafe pump settings, PCA-by-proxy / family-controlled-analgesia danger, lockout/limit appropriateness, rate verification.

It is decorative-prone (a screen can be slapped on any drug question), so the gating rule binds hard:

1. **A setting (or a value computed from settings) the answer turns on must live *only* on the screen.** If the stem states "the PCA basal rate is 2 mg/hr," the screen is redundant. The screen earns its place when reading the settings off it — or computing an hourly/interval total from them — is the task. Human review confirms the keyed cue is not restated in the stem.
2. **Two distinct load-bearing modes**, both valid:
   - **Direct read** — the unsafe element *is* a displayed setting (e.g., a basal rate present in an opioid-naïve PCA; a lockout far too short). Declared via `meta.keyed_settings` (analogous to MAR's `keyed_cells`).
   - **Computed** — the answer turns on a value derived from settings (max deliverable per hour, total delivered over the shift). Declared via `meta.derived_values_keyed`; `selfCheck` recomputes and asserts equality (§5.3).
   An item needs at least one of the two.
3. **The render must not state the verdict.** No "UNSAFE" banner, no computed answer printed. `flag` emphasis (amber, from `renderFieldPanel`'s `screen` variant) may mark a setting the question references, but flagging is a content-review decision and never asserts safe/unsafe (mirror MAR glyphs and U6 §8).
4. **Computed values are machine-recomputed, never trusted** — same gate as U6.

**Strictest tier** (high-alert infusions). `selfCheck` enforces structure + arithmetic + necessity. Stage-4 human review enforces clinical validity: realistic device, plausible settings, and that **only the keyed element is unsafe** — nothing else accidentally dangerous.

### Scope decision (recommend: PCA-complete, infusion/enteral thin)

v1 ships three `device` types that all **render** through `renderFieldPanel`, but the **arithmetic gate is fully built only for PCA** (the highest-yield, PCA-by-proxy danger). `infusion` and `enteral` get a single generic `rate × time` / `volume ÷ rate` derivation and otherwise rely on `keyed_settings` direct-read items. Their richer derivations (e.g. titration tables, enteral free-water math) are flagged extensions, not v1. This keeps U9 bounded the way U6 bounds itself to five derivations. **Override if you want infusion math in v1**; it slots into the same enumerated-derivation mechanism.

---

## 2. Files

```
src/visuals/kinds/device_screen/
  index.ts            # validate / selfCheck / renderSvg / fixtures + registerVisual(...)
  types.ts            # DeviceScreenSpec + enums
```

Reuse `primitives/table.ts` (`renderFieldPanel`, `measureFieldPanel`), `graphPaper.ts` (`fmt`), `escapeXml.ts`. Append-only shared lines in `src/visuals/types.ts` (`| DeviceScreenSpec`) and `src/visuals/kinds/index.ts` (`import "./device_screen";`). No edits to `App.tsx`/`schema.ts`/`validate-bank.ts`/`coverage-report.ts`/`census.ts`.

---

## 3. Placement (`allowedItemTypes`)

```
["multiple_choice", "select_all", "matrix", "fill_in_blank"]
```
Same rationale as `io_record`/`medication_label`: settings verification is typically `multiple_choice`/`select_all`/`matrix`; a computed hourly total is `fill_in_blank`.

---

## 4. Spec type (`kinds/device_screen/types.ts`)

```ts
export type DeviceType = "pca" | "infusion" | "enteral";

/** Controlled setting keys. value is numeric; unit is a display string. Which keys a device uses is
 *  documented per type below; validate() only checks key membership + numeric sanity, not per-device requiredness. */
export type DeviceSettingKey =
  // PCA
  | "drug" | "concentration" | "mode" | "demand_dose" | "lockout_min"
  | "basal_rate" | "limit_1h" | "limit_4h" | "attempts" | "delivered"
  // infusion / enteral
  | "rate_ml_hr" | "vtbi_ml" | "volume_infused_ml" | "duration_min";

export interface DeviceSetting {
  key: DeviceSettingKey;
  /** Numeric value (most settings). For TEXT settings (`drug`, `mode`, `concentration`) use `text` instead. */
  value?: number;       // finite, >= 0 when present
  text?: string;        // for `drug`, `mode`, `concentration`; display only
  /** Display unit, e.g. "mg", "min", "mg/hr", "mL/hr". Display only — never parsed. */
  unit?: string;
  /** Visual emphasis only (renderFieldPanel `flag`); not a clinical assertion. */
  flag?: boolean;
}

export interface DeviceScreenSpec {
  kind: "device_screen";
  device: DeviceType;
  /** Banner, e.g. "PCA Pump — morphine". Display string. */
  title?: { en: string; zh?: string };
  /** Ordered settings rows, ≥1. Order is render order. */
  settings: DeviceSetting[];
  caption?: { en: string; zh?: string };
}
```

Notes:
- **Typed numeric settings, display units only.** Same discipline as U6: the load-bearing numbers are `value`s; `unit` is never parsed. The arithmetic gate reads named keys' `value`s.
- **`drug`/`mode` carry `text`, not `value`.** Everything else carries `value` (+ optional `unit`).
- No per-device requiredness in `validate` (keeps it generalizable); the *item* declares which settings are load-bearing via `meta`, and `selfCheck`'s derivations assert the specific keys they need are present.

### Per-device setting conventions (documentation, enforced via selfCheck not validate)

- **`pca`**: `drug`(text), `concentration`(text e.g. "1 mg/mL" — display only, not the gate), `mode`(text: "PCA"|"PCA+basal"|"continuous"), `demand_dose`(mg), `lockout_min`(min), `basal_rate`(mg/hr, optional), `limit_1h`/`limit_4h`(mg, optional), `attempts`(count), `delivered`(count).
- **`infusion`**: `drug`(text), `rate_ml_hr`, `vtbi_ml`, `volume_infused_ml`, `duration_min`.
- **`enteral`**: `rate_ml_hr`, `vtbi_ml`, `volume_infused_ml`, `duration_min` (free water/flush math deferred).

---

## 5. Question-level `meta` + `selfCheck(spec, question)`

### 5.1 `meta` shape

```jsonc
"meta": {
  "visual_justification": "REQUIRED non-empty — why the setting/computed value is the task.",
  "tier": "strictest",
  "source": "device + drug reference.",
  "skill_signature": "device:pca-basal-opioid-naive/proxy-danger",
  "stem_disambiguators": ["PCA", "opioid-naive"],

  // direct-read mode: each entry resolves to a real setting on the spec
  "keyed_settings": [ { "key": "basal_rate", "reason": "present_in_opioid_naive_pca" } ],

  // computed mode: present key selects the derivation (§5.3); value is keyed answer after `round`
  "derived_values_keyed": { "max_dose_1h_mg": 12 },
  "round": 1
}
```

An item supplies **`keyed_settings` and/or `derived_values_keyed`** (≥1 of the two).

### 5.2 `selfCheck` responsibilities

Defensive, never throws, `[]` on malformed spec (mirror `selfCheckMar`/`selfCheckIoRecord`):

1. **Necessity — justification** → `self_check_missing_justification`.
2. **Necessity — keyed cue.** ≥1 `keyed_settings` entry **or** ≥1 recognized `derived_values_keyed` key → else `self_check_no_keyed_cue`.
3. **Keyed-setting presence.** Each `keyed_settings[i].key` must be present in `spec.settings` → else `self_check_keyed_setting_absent` (analogue of MAR's keyed-cell presence check).
4. **Arithmetic gate.** For each present `derived_values_keyed` key, recompute from the required settings (§5.3), round to `meta.round` (default `0`), assert exact equality → `self_check_value_mismatch`. Missing required settings for a declared derivation → `self_check_derivation_unsupported`. **Build failure, not a content note.**
5. **Internal consistency echo.** Re-assert every numeric `setting.value` is finite `>= 0` → `self_check_invalid_setting`.

`selfCheck` does not judge whether a basal rate is *clinically* unsafe — that is stage-4 review.

### 5.3 Derivation set (enumerated; PCA-complete, infusion/enteral generic)

| key | device | requires (keys) | formula | unit |
|---|---|---|---|---|
| `max_demands_1h` | pca | `lockout_min` | `Math.floor(60 / lockout_min)` | count |
| `max_dose_1h_mg` | pca | `lockout_min`, `demand_dose` (+ `basal_rate` if mode includes basal) | `floor(60/lockout_min) * demand_dose + (basal_rate ?? 0)` | mg |
| `delivered_dose_total_mg` | pca | `delivered`, `demand_dose` (+ `basal_rate`, `shift_hours`) | `delivered * demand_dose (+ basal_rate * shift_hours)` | mg |
| `infusion_volume_ml` | infusion/enteral | `rate_ml_hr`, `duration_min` | `rate_ml_hr * duration_min / 60` | mL |
| `infusion_duration_min` | infusion/enteral | `vtbi_ml` (or remaining), `rate_ml_hr` | `vtbi_ml / rate_ml_hr * 60` | min |

- `shift_hours` for `delivered_dose_total_mg`, when basal is included, is supplied in `meta` (`"shift_hours": 8`) — it is a question parameter, not a screen setting. Without basal, omit it.
- A declared key whose required settings are absent → `self_check_derivation_unsupported` (don't guess).
- **Rounding** uses the shared `roundTo` exported from `primitives/graphPaper.ts` (created in U6) — **do not redefine it**; importing the single definition is what guarantees U6/U9/U8 round identically. Half-away-from-zero, exact equality after rounding; default `round: 0` since dose/volume totals are usually whole — items override per case.

---

## 6. `validate(spec): VisualError[]`

| Check | `code` |
|---|---|
| `kind === "device_screen"` | `invalid_kind` |
| `device` ∈ {`pca`,`infusion`,`enteral`} | `invalid_device` |
| `settings` is a non-empty array | `settings_empty` |
| each `settings[i].key` ∈ `DeviceSettingKey` | `invalid_setting_key` |
| no duplicate `key` across `settings` | `duplicate_setting` |
| text settings (`drug`, `mode`, `concentration`) carry non-empty `text` (no numeric `value`); **all other keys** require finite numeric `value >= 0` | `setting_value_invalid` |
| `value <= MAX_SETTING` sanity bound | `setting_out_of_range` |
| `flag` boolean if present | `invalid_flag` |
| `title`/`caption` bilingual rule (en required if present; zh non-empty if present) | `title_en_required`/`title_zh_empty`/`caption_en_required`/`caption_zh_empty` |

`MAX_SETTING = 100_000` — calibratable sanity bound, not a clinical claim. Duplicate-key is an error because a screen shows each setting once and `selfCheck` reads by key.

Define `TEXT_SETTING_KEYS = new Set(["drug", "mode", "concentration"])`: a key in that set must carry non-empty `text` and no numeric `value`; every other key must carry a finite `value >= 0`. (`concentration` is a display string like `"1 mg/mL"` and is **never** the arithmetic gate — the gate reads `demand_dose`/`basal_rate`/`rate_ml_hr` numerics — so it must be exempt from the numeric requirement alongside `drug`/`mode`.)

---

## 7. `renderSvg(spec): string`

One `renderFieldPanel` call, **`variant: "screen"`** (the LCD treatment U6 ships), wrapped in `<svg>`.

- **Title** = `title?.en` (else a device default: `"PCA Pump"` / `"Infusion Pump"` / `"Feeding Pump"`).
- **Single section, no heading**; one field per setting, in spec order:
  - label = a fixed display name per key (`demand_dose → "Dose"`, `lockout_min → "Lockout"`, `basal_rate → "Basal"`, `limit_4h → "4 hr limit"`, `attempts → "Attempts"`, `delivered → "Delivered"`, `rate_ml_hr → "Rate"`, `vtbi_ml → "VTBI"`, `mode → "Mode"`, `drug → "Drug"`, …). Keep the label map in the kind, not the primitive.
  - value = `text` for text settings, else `\`${fmtNum(value)}${unit ? " " + unit : ""}\``.
  - `emphasis: spec.setting.flag ? "flag" : "normal"`.
- Wrap: `<svg … viewBox="0 0 360 <h>" role="img" aria-label="<escaped>" data-kind="device_screen"> … </svg>`, `<h> = measureFieldPanel(input)`, `aria-label` = escaped `caption.en` (else `title.en`, else device default).
- **No computed value rendered, no verdict text.** Deterministic; `escapeXml` all text; `fmt`/`fmtNum` all numbers. **Import `fmtNum` (and `roundTo`) from `primitives/graphPaper.ts`** — both are created in U6; do not redefine them.
- **Caption/title rule:** never reveal the answer (no "Unsafe basal rate").

---

## 8. Fixtures

`valid` (≥3):
1. **PCA, opioid-naïve with basal (direct-read danger).** `device:"pca"`, settings `drug:"morphine"`, `concentration:"1 mg/mL"`, `mode:"PCA+basal"`, `demand_dose:1 mg`, `lockout_min:8`, `basal_rate:1 mg/hr`, `limit_4h:20 mg`, `attempts:14`, `delivered:9`. Pairs with `keyed_settings:[{key:"basal_rate"}]`.
2. **PCA, computed max hourly.** `mode:"PCA"`, `demand_dose:1 mg`, `lockout_min:10` (no basal). Pairs with `derived_values_keyed:{max_dose_1h_mg:6}` (floor(60/10)=6 demands × 1 mg).
3. **Infusion volume.** `device:"infusion"`, `rate_ml_hr:125`, `duration_min:90`. Pairs with `derived_values_keyed:{infusion_volume_ml:188}` round 0 (125×90/60 = 187.5 → 188) **— note the rounding makes the item key 188; verify this is the intended NCLEX convention in content review** (some texts truncate; the gate enforces whatever `round` declares, so declare deliberately).

`invalid` (assert each): `invalid_kind`; `invalid_device` (`device:"ventilator"`); `settings_empty` (`[]`); `invalid_setting_key` (`key:"tidal_volume"`); `duplicate_setting` (two `lockout_min`); `setting_value_invalid` (`demand_dose` with `text` instead of `value`, or negative `value`); `setting_out_of_range` (`value:999999`); `caption_en_required`; `caption_zh_empty`.

---

## 9. Tests (`scripts/tests/device-screen.ts`, register in `test-visuals`)

- Representative validation codes (`invalid_device`, `duplicate_setting`, `invalid_setting_key`, `setting_value_invalid`).
- Render determinism; `measureFieldPanel`/render height agreement; `screen` variant emits monospaced/LCD styling and `flag` amber.
- **Arithmetic `selfCheck`:**
  - fixture-2 → `max_dose_1h_mg:6` → 0 errors; planted `7` → `self_check_value_mismatch`.
  - `delivered_dose_total_mg` with basal + `shift_hours` → recompute matches; wrong → mismatch.
  - fixture-1 `keyed_settings:[{key:"basal_rate"}]` present → 0; keyed a `key` absent from settings → `self_check_keyed_setting_absent`.
  - declared `infusion_volume_ml` on a PCA spec lacking `rate_ml_hr` → `self_check_derivation_unsupported`.
  - `meta` with neither `keyed_settings` nor `derived_values_keyed` → `self_check_no_keyed_cue`.
  - `selfCheck({} as DeviceScreenSpec, {})` → no throw, `[]`.
- Parity snapshot update if applicable.

---

## 10. Acceptance / verification

```sh
npm run test-visuals
npm run validate-bank -- banks/*.json
npm run census && npm run census:check
npm run build
```
All green. `NCLEX-Question-Schema.md` gains a `device_screen` per-kind subsection (§4–§7) referencing §6.1, documenting `keyed_settings` + the `derived_values_keyed` key set + `shift_hours`. Append `device_screen` to the kind taxonomy table. Mark **U9 DONE** in `VISUAL-STIMULI-ROADMAP.md`; add a `PROJECT-HISTORY.md` milestone. **No content generation in this pass.**

---

## 11. Content lane (separate pass)

- ID prefix `dev_*` (roadmap uses the device family; keep it disjoint — confirm the exact prefix when the lane opens).
- Generate → `banks/banks-raw/` → cross-model review → source-check settings against device/drug references (strictest) → visual audit (settings match spec; keyed cue not restated in stem; only the keyed element unsafe) → human review → `npm run promote` → `banks/device-canonical.json` → `npm run audit` → ledger → delete raw.
- `selfCheck` machine-checks the math; human review owns the clinical safety judgment (is a basal rate dangerous *here*? is the lockout inappropriate? PCA-by-proxy framing) and rationale position-agnosticism.

---

## 12. Error codes

Validation:
```text
invalid_kind
invalid_device
settings_empty
invalid_setting_key
duplicate_setting
setting_value_invalid
setting_out_of_range
invalid_flag
title_en_required
title_zh_empty
caption_en_required
caption_zh_empty
```
Self-check:
```text
self_check_missing_justification
self_check_no_keyed_cue
self_check_keyed_setting_absent
self_check_value_mismatch
self_check_derivation_unsupported
self_check_invalid_setting
```

---

## 13. Do not touch

```text
src/schema.ts
src/App.tsx
scripts/validate-bank.ts
scripts/coverage-report.ts
scripts/census.ts
primitives/table.ts       (renderFieldPanel/measureFieldPanel come from U6 unchanged; consume, don't edit)
primitives/graphPaper.ts  (fmtNum/roundTo come from U6 unchanged; import, don't redefine)
```
unless a failing test demonstrates a required change.

---

> Implement U9 after U6 merges. Reuse `renderFieldPanel` (`variant:"screen"`) and `measureFieldPanel` unchanged. Follow the `mar`/`io_record` kind structure. PCA arithmetic is the full gate; infusion/enteral get the generic rate/volume derivation only. The arithmetic is machine-checked — a keyed value disagreeing with the recompute is a build failure. Do not render verdicts or computed answers. No content generation.
