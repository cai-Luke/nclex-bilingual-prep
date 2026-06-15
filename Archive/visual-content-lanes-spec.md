# VISUAL-CONTENT-LANES-SPEC.md — arithmetic & documentation tier

Content-generation specs for the five under-served visual lanes whose renderers are complete but whose banks are nearly empty: `io_record` (3 items), `medication_label` (2), `device_screen` (2), `burn_map` (3, adult only), `mar` (5). The trend/waveform lanes (`rhythm_strip` 44, `lab_trend` 20, `vitals_trend` 11) are already populated and are **not** covered here; `fetal_monitoring` has its own spec.

These five share one backbone — DECISIONS principle 11, the machine-checked arithmetic/keyed-cell gate — so §1 is a shared core that applies to all of them, and §§2–6 are self-contained per-kind sections (each handable to a generator on its own). Rules are transcribed from `src/visuals/kinds/<kind>/` and the schema as of 2026-06-13; re-pull if a renderer changes. Authority on conflict: `AGENTS.md` › `NCLEX-Question-Schema.md` › this file.

---

## 1. Shared core (applies to all five lanes)

**Schema & bilingual.** Schema version `1.2`. Every displayed field is `{en, zh}` with full parity. `question.topic` is **English-only** — CJK in `topic` fails the Tier-0 gate and the build.

**`meta.visual_justification` is always required** (non-empty string) and must say *what the learner reads off the visual that the stem does not state*.

**Necessity (DECISIONS principle 6; AGENTS visual stages 3–4).** The visual must be load-bearing: removing it must change the answer. Never state in the stem the value or finding the visual carries (the total, the concentration, the %TBSA, the held dose). A decorative visual on an otherwise-text item is **invalid** — and the generation bots over-apply any tool they're handed, so this is the single most common way these lanes go wrong.

**`derived_values_keyed` is an OBJECT here, not an array.** This is the trap when copying a `vitals_trend`/`lab_trend` item, where `derived_values_keyed` is a list of names (`["map"]`). For the four arithmetic kinds below it is a **map of derivation-key → computed number** that `selfCheck` recomputes from the spec and asserts *exact equality* against (after a declared rounding). A mismatch is a **build failure**, not a content note:

```jsonc
"meta": { "derived_values_keyed": { "tbsa_pct": 36, "parkland_total_ml": 10080 } }   // OBJECT
```

**No unit-conversion / dosage engine (principle 11).** Every derivation is a one-line, *same-unit* computation. There is no mg↔mcg, no mg/kg or mcg/kg/min parsing. If a realistic order is in a different unit than the label, convert it yourself into the label's unit *before* keying, or pick inputs that already match — do not expect the renderer to convert. A derivation that needs cross-unit conversion is out of scope for that kind.

**Tier & sourcing.** All five are strictest-tier except `io_record` (strict). Every clinical claim is source-checked live at the gatekeeping step (never trusted from a model's cutoff); record the reference in `meta.source`. Put load-bearing protocol constants *inside the stem* (closed-world, principle 12) so the keyed answer survives guideline drift — this is mandatory for Parkland (`burn_map`).

**ID prefixes (globally unique):** `io_*`, `medlbl_*`, `dev_*`, `burn_*`, `mar_*`, `inj_*`.

**Bank homes.** `mar` continues into the existing `banks/mar-canonical.json`. The other four currently have only `gpt_visual_smoke_*` items inside `gpt-canonical.json`; **recommend** dedicated homes (`banks/io-canonical.json`, `medlabel-canonical.json`, `device-canonical.json`, `burn-canonical.json`), migrating the existing smoke items at the same time (zero cost — bank file is just a label). **Confirm before building.**

**Pipeline (same as the fetal lane).** Opus authors the clinical fact pattern + correct answer (English, closed-world where a constant is load-bearing) → GPT/Gemini compile to JSON (build the `visual`, write bilingual text, fill `meta`) → cross-model review (the model that did not compile reviews) → Opus-in-Claude-Code gatekeeps, source-checks, opens the PR → final content review here → 5-stage visual gate → promote → ledger. The generator never reviews its own batch.

**House `meta` shape** (worked examples below follow it): `visual_justification`, the kind's keyed object/array, `source`, `tier`, `skill_signature` (`<kind>:<cue>/<conclusion>`), `stem_disambiguators`, plus kind-specific keys (`order`, `weight_kg`, `round`, `shift_hours`). `selfCheck` enforces only `visual_justification` + the keyed values; `source`/`tier` are house-required for promotion.

**`fill_in_blank` shape.** Where supported, a numeric blank carries `blanks[i].numeric.value`. The numeric answer must equal the keyed derived value it tests (`burn_map` enforces this mechanically; for the others it is a review requirement).

---

## 2. `io_record` — intake/output flowsheet

| | |
|---|---|
| ID / tier | `io_*` / **strict** (fluid balance) |
| Item types | `multiple_choice`, `select_all`, `matrix`, `fill_in_blank` |
| Biggest gotcha | Totals are **not** fields — they are summed from entries; never state a total in the stem. `volumeMl` must be a **positive integer**. |

**Spec contract**
```ts
visual: {
  kind: "io_record",
  periodLabel?: { en: string, zh?: string },     // display-only, e.g. "0700–1500 shift"
  intake: [{ label: string, volumeMl: number }],  // volumeMl: positive integer, ≤ 10000
  output: [{ label: string, volumeMl: number }],
  caption?: { en: string, zh?: string }
}   // at least one intake OR output entry
```

**`selfCheck` / `meta`.** `meta.derived_values_keyed` is an object with ≥1 of `intake_total_ml`, `output_total_ml`, `net_balance_ml`, each asserted equal to: `Σ intake`, `Σ output`, `intake − output` (integers; no rounding).

**Clinical targets.** Fluid overload, dehydration, AKI, evaluating diuresis or resuscitation response. The reasoning turns on summing the columns and judging the net balance against the clinical picture.

**Item-type patterns.** `fill_in_blank` → compute the net balance or a total (answer = the keyed value). `multiple_choice` → interpret the balance ("which conclusion / priority action"). `matrix`/`select_all` → which findings are consistent with the charted balance.

**Worked example** (fill_in_blank, net balance):
```json
{
  "id": "io_net_balance_chf_01",
  "itemType": "fill_in_blank",
  "category": "Reduction of Risk Potential",
  "topic": "fluid balance monitoring",
  "difficulty": "medium",
  "stem": {
    "en": "A nurse reviews the 8-hour intake and output record below for a client with heart failure. Calculate the client's net fluid balance for the shift. Record your answer in milliliters (mL), including the sign.",
    "zh": "护士查看下面一名心力衰竭患者8小时的出入量记录。计算该患者本班次的净体液平衡。以毫升（mL）记录你的答案，并注明正负号。"
  },
  "blanks": [
    { "id": "b1", "numeric": { "value": 230, "unit": "mL", "tolerance": 0 } }
  ],
  "rationale": {
    "correct": {
      "en": "Intake totals 480 + 1000 + 100 = 1580 mL. Output totals 1200 + 150 = 1350 mL. Net balance = 1580 − 1350 = +230 mL. A positive balance in heart failure warrants monitoring for fluid overload.",
      "zh": "入量合计为 480 + 1000 + 100 = 1580 mL。出量合计为 1200 + 150 = 1350 mL。净平衡 = 1580 − 1350 = +230 mL。心力衰竭患者出现正平衡时需监测液体超负荷。"
    }
  },
  "testTakingStrategy": {
    "en": "Add each column separately, then subtract output from intake. Keep the sign — a positive number means more in than out.",
    "zh": "分别将每一列相加，然后用入量减去出量。保留符号——正数表示入量多于出量。"
  },
  "visual": {
    "kind": "io_record",
    "periodLabel": { "en": "0700–1500 shift", "zh": "0700–1500 班次" },
    "intake": [
      { "label": "PO water", "volumeMl": 480 },
      { "label": "0.9% NaCl IV", "volumeMl": 1000 },
      { "label": "IV piggyback antibiotic", "volumeMl": 100 }
    ],
    "output": [
      { "label": "Foley urine", "volumeMl": 1200 },
      { "label": "Emesis", "volumeMl": 150 }
    ],
    "caption": { "en": "Intake and output flowsheet", "zh": "出入量记录单" }
  },
  "meta": {
    "visual_justification": "The net balance can only be obtained by summing the charted intake and output rows; the totals are not stated anywhere in the stem.",
    "derived_values_keyed": { "intake_total_ml": 1580, "output_total_ml": 1350, "net_balance_ml": 230 },
    "source": "Fundamentals of Nursing — fluid balance",
    "tier": "strict",
    "skill_signature": "io:net-balance/fluid-overload-risk",
    "stem_disambiguators": ["heart failure", "8-hour shift"]
  }
}
```

---

## 3. `medication_label` — drug label dose/volume/rate

| | |
|---|---|
| ID / tier | `medlbl_*` / **strictest** (dosage, high-alert) |
| Item types | `multiple_choice`, `select_all`, `matrix`, `fill_in_blank` |
| Biggest gotcha | `order.unit` **must equal** `amountUnit` (no mg↔mcg). `fields[]` are ancillary only — never load-bearing. |

**Spec contract**
```ts
visual: {
  kind: "medication_label",
  drugName: string,
  amount: number,                                   // positive, ≤ 1,000,000
  amountUnit: "mg"|"mcg"|"g"|"units"|"mEq"|"mmol",
  perQty: number,                                   // positive, ≤ 5000
  perUnit: "mL"|"tablet"|"capsule",
  showDerivedConcentration?: boolean,               // true ONLY when perUnit === "mL"
  fields?: [{ label: string, value: string }],      // printed ancillary facts only
  caption?: { en: string, zh?: string }
}
```

**`selfCheck` / `meta`.** `meta.derived_values_keyed` object with ≥1 of:

| key | needs | formula |
|---|---|---|
| `concentration_per_ml` | `perUnit:"mL"` | `amount / perQty` |
| `volume_to_administer_ml` | `perUnit:"mL"` + `order.kind:"dose"` | `order.value / (amount/perQty)` |
| `quantity_to_administer_tablets` | `perUnit:"tablet"` + `dose` | `order.value / (amount/perQty)` |
| `quantity_to_administer_capsules` | `perUnit:"capsule"` + `dose` | `order.value / (amount/perQty)` |
| `rate_ml_per_hr` | `perUnit:"mL"` + `order.kind:"dose_rate"` | `order.value / (amount/perQty)` |

`meta.order` is required for everything except `concentration_per_ml`: `{ kind:"dose"|"dose_rate", value: positive, unit: <MUST equal amountUnit>, round?: 0|1|2 }`. Result rounded to `order.round` (default 1).

**Clinical targets.** Dosage/infusion calculation, label verification, high-alert safety (heparin, insulin, opioids, electrolytes). The cue is the label's strength; the stem gives the order, not the concentration.

**Worked example** (fill_in_blank, heparin rate — high-alert):
```json
{
  "id": "medlbl_heparin_rate_01",
  "itemType": "fill_in_blank",
  "category": "Pharmacological and Parenteral Therapies",
  "topic": "high-alert medication infusion",
  "difficulty": "hard",
  "stem": {
    "en": "A provider orders a heparin infusion at 1000 units/hour. Using the medication label shown, at what rate in milliliters per hour (mL/hr) should the nurse set the infusion pump?",
    "zh": "医生开具肝素输注医嘱，速率为1000单位/小时。根据所示的药物标签，护士应将输液泵设置为每小时多少毫升（mL/hr）？"
  },
  "blanks": [
    { "id": "b1", "numeric": { "value": 10, "unit": "mL/hr", "tolerance": 0 } }
  ],
  "rationale": {
    "correct": {
      "en": "The label concentration is 25,000 units / 250 mL = 100 units/mL. To deliver 1000 units/hr: 1000 ÷ 100 = 10 mL/hr.",
      "zh": "标签浓度为 25,000 单位 / 250 mL = 100 单位/mL。要输注 1000 单位/小时：1000 ÷ 100 = 10 mL/hr。"
    }
  },
  "testTakingStrategy": {
    "en": "First reduce the label to a concentration (amount ÷ volume), then divide the ordered hourly dose by that concentration.",
    "zh": "先将标签换算为浓度（量 ÷ 体积），再用医嘱的每小时剂量除以该浓度。"
  },
  "visual": {
    "kind": "medication_label",
    "drugName": "Heparin Sodium",
    "amount": 25000,
    "amountUnit": "units",
    "perQty": 250,
    "perUnit": "mL",
    "showDerivedConcentration": false,
    "fields": [{ "label": "Diluent", "value": "D5W" }],
    "caption": { "en": "Heparin premix label", "zh": "肝素预混液标签" }
  },
  "meta": {
    "visual_justification": "The infusion rate depends on the label concentration (25,000 units/250 mL), which is shown only on the label and not stated in the stem.",
    "derived_values_keyed": { "concentration_per_ml": 100, "rate_ml_per_hr": 10 },
    "order": { "kind": "dose_rate", "value": 1000, "unit": "units", "round": 0 },
    "source": "ISMP high-alert medication guidance; institutional heparin protocol",
    "tier": "strictest",
    "skill_signature": "medlbl:concentration/heparin-rate",
    "stem_disambiguators": ["1000 units/hour order"]
  }
}
```

---

## 4. `device_screen` — PCA / infusion / enteral pump settings

| | |
|---|---|
| ID / tier | `dev_*` / **strictest** (high-alert infusions) |
| Item types | `multiple_choice`, `select_all`, `matrix`, `fill_in_blank` |
| Biggest gotcha | Basal is included in PCA math **only if** `mode` text contains "basal". `delivered_dose_total_mg` with basal also needs `meta.shift_hours`. Text keys (`drug`/`mode`/`concentration`) carry `text`, no `value`; everything else carries `value`, no `text`. |

**Spec contract**
```ts
visual: {
  kind: "device_screen",
  device: "pca"|"infusion"|"enteral",
  title?: { en, zh? },
  settings: [{ key: DeviceSettingKey, value?: number, text?: string, unit?: string, flag?: boolean }],
  caption?: { en, zh? }
}
```
Setting keys: `drug`,`concentration`,`mode` (text-only); `demand_dose`,`lockout_min`,`basal_rate`,`limit_1h`,`limit_4h`,`attempts`,`delivered`,`rate_ml_hr`,`vtbi_ml`,`volume_infused_ml`,`duration_min` (numeric, ≥0, ≤100000). No duplicate keys. `flag:true` highlights an unsafe setting.

**`selfCheck` / `meta`.** Needs ≥1 of: `meta.keyed_settings` (array of `{key}` that each resolve to a present setting — the *direct-read* path, for "is this setting safe/appropriate" items) **or** `meta.derived_values_keyed` (object) with ≥1 of:

| key | device | formula |
|---|---|---|
| `max_demands_1h` | pca | `floor(60 / lockout_min)` |
| `max_dose_1h_mg` | pca | `floor(60/lockout)·demand_dose + basal_rate` (basal only if `mode` has "basal") |
| `delivered_dose_total_mg` | pca | `delivered·demand_dose (+ basal_rate·meta.shift_hours if basal mode)` |
| `infusion_volume_ml` | infusion/enteral | `rate_ml_hr · duration_min / 60` |
| `infusion_duration_min` | infusion/enteral | `vtbi_ml / rate_ml_hr · 60` |

PCA dose math assumes `demand_dose`/`basal_rate` are in **mg** (keys end `_mg`). Rounding `meta.round` (0/1/2, default 0).

**Clinical targets.** Unsafe pump settings, PCA-by-proxy / inappropriate basal on an opioid-naïve client, lockout/limit appropriateness, rate/duration verification.

**Worked example** (multiple_choice, keyed_settings — unsafe basal on opioid-naïve client):
```json
{
  "id": "dev_pca_basal_opioid_naive_01",
  "itemType": "multiple_choice",
  "category": "Pharmacological and Parenteral Therapies",
  "topic": "patient-controlled analgesia safety",
  "difficulty": "hard",
  "stem": {
    "en": "An opioid-naïve adult is started on patient-controlled analgesia after surgery. The nurse reviews the pump screen shown. Which setting should the nurse question before initiating therapy?",
    "zh": "一名未曾使用过阿片类药物的成年人术后开始使用患者自控镇痛。护士查看所示的泵屏幕。在开始治疗前，护士应对哪项设置提出疑问？"
  },
  "options": [
    { "id": "A", "en": "The continuous basal rate", "zh": "持续基础输注速率" },
    { "id": "B", "en": "The 8-minute lockout interval", "zh": "8分钟的锁定间隔" },
    { "id": "C", "en": "The 1 mg demand dose", "zh": "1 mg的需求剂量" },
    { "id": "D", "en": "The 4-hour dose limit", "zh": "4小时剂量限制" }
  ],
  "correct": ["A"],
  "rationale": {
    "correct": {
      "en": "A continuous basal opioid infusion is generally not recommended for opioid-naïve clients because it delivers opioid independent of the client's demand, increasing the risk of respiratory depression. The demand dose, lockout, and 4-hour limit shown are within usual ranges.",
      "zh": "对于未曾使用阿片类药物的患者，通常不推荐持续基础阿片类输注，因为它不依赖患者的需求给药，会增加呼吸抑制的风险。所示的需求剂量、锁定间隔和4小时限制均在常规范围内。"
    },
    "byChoice": [
      { "refId": "A", "en": "A basal infusion in an opioid-naïve client raises the risk of respiratory depression and should be questioned.", "zh": "对未曾使用阿片类药物的患者使用基础输注会增加呼吸抑制风险，应提出疑问。" },
      { "refId": "B", "en": "An 8-minute lockout is within the usual range for PCA morphine.", "zh": "8分钟的锁定间隔在PCA吗啡的常规范围内。" },
      { "refId": "C", "en": "A 1 mg morphine demand dose is a standard starting dose.", "zh": "1 mg吗啡需求剂量是标准的起始剂量。" },
      { "refId": "D", "en": "The 4-hour limit shown constrains total delivery and is appropriate.", "zh": "所示的4小时限制约束了总给药量，是适当的。" }
    ]
  },
  "testTakingStrategy": {
    "en": "For an opioid-naïve client, the danger is opioid the client did not request — look at the basal (continuous) setting first.",
    "zh": "对于未曾使用阿片类药物的患者，危险在于患者未主动请求的阿片类给药——首先查看基础（持续）设置。"
  },
  "visual": {
    "kind": "device_screen",
    "device": "pca",
    "title": { "en": "PCA Pump — morphine", "zh": "PCA泵 — 吗啡" },
    "settings": [
      { "key": "drug", "text": "morphine" },
      { "key": "concentration", "text": "1 mg/mL" },
      { "key": "mode", "text": "PCA+basal" },
      { "key": "demand_dose", "value": 1, "unit": "mg" },
      { "key": "lockout_min", "value": 8, "unit": "min" },
      { "key": "basal_rate", "value": 1, "unit": "mg/hr", "flag": true },
      { "key": "limit_4h", "value": 20, "unit": "mg" }
    ],
    "caption": { "en": "PCA pump settings", "zh": "PCA泵设置" }
  },
  "meta": {
    "visual_justification": "The unsafe element is the continuous basal infusion, which is only visible on the pump screen; the stem does not state which settings are programmed.",
    "keyed_settings": [{ "key": "basal_rate" }, { "key": "mode" }],
    "source": "ISMP PCA safety; institutional PCA policy",
    "tier": "strictest",
    "skill_signature": "dev:pca-basal/opioid-naive-risk",
    "stem_disambiguators": ["opioid-naïve", "post-surgical PCA"]
  }
}
```
For an arithmetic device item, drop `keyed_settings` and use `derived_values_keyed` instead, e.g. a `lockout_min: 8` pump → `{ "max_demands_1h": 7 }` (`floor(60/8)`), `meta.round: 0`.

---

## 5. `burn_map` — Rule of Nines / Parkland

| | |
|---|---|
| ID / tier | `burn_*` / **strictest** (dosage) |
| Item types | `multiple_choice`, `select_all`, `matrix`, `fill_in_blank` |
| Biggest gotcha | **ADULT ONLY.** Do not emit `population:"pediatric"` — pediatric is renderer-supported but **content-blocked** (no age-banded Lund-Browder). Parkland constant `4 mL/kg/%TBSA` must be **stated in the stem** (closed-world). |

**Spec contract**
```ts
visual: {
  kind: "burn_map",
  population?: "adult",          // omit or "adult" ONLY for generated content
  burns: BurnRegionKey[],         // non-empty, unique
  caption?: { en, zh? }
}
```
Region keys + adult %TBSA: `head_anterior` 4.5, `head_posterior` 4.5, `trunk_anterior` 18, `trunk_posterior` 18, `arm_l_anterior`/`arm_l_posterior`/`arm_r_anterior`/`arm_r_posterior` 4.5 each, `leg_l_anterior`/`leg_l_posterior`/`leg_r_anterior`/`leg_r_posterior` 9 each, `genitalia` 1. (Sums to 100.)

**`selfCheck` / `meta`.** `meta.derived_values_keyed` object with ≥1 of:

| key | needs | formula |
|---|---|---|
| `tbsa_pct` | — | `Σ adult %TBSA over burns[]` |
| `parkland_total_ml` | `meta.weight_kg` | `4 · weight_kg · tbsa` |
| `parkland_first8h_ml` | `meta.weight_kg` | `total / 2` |
| `parkland_rate_first8h_ml_hr` | `meta.weight_kg` | `total / 2 / 8` |

`meta.weight_kg` (positive) required for any Parkland key. Rounding `meta.round` (0/1/2, default 0). For `fill_in_blank`, every numeric blank value must equal one of the present computed derived values (mechanically enforced — `self_check_answer_value_mismatch` otherwise).

**Clinical targets.** Rule of Nines %TBSA, Parkland resuscitation volume/rate, severity classification. %TBSA must be readable only from the shaded regions; never state it in the stem.

**Worked example** (fill_in_blank, Parkland first-8h rate):
```json
{
  "id": "burn_parkland_rate_01",
  "itemType": "fill_in_blank",
  "category": "Physiological Adaptation",
  "topic": "burn fluid resuscitation",
  "difficulty": "hard",
  "stem": {
    "en": "A 70 kg adult is admitted with the deep partial- and full-thickness burns shaded on the diagram. Using the Parkland formula (4 mL × kg × %TBSA, half over the first 8 hours), calculate the infusion rate in milliliters per hour (mL/hr) for the first 8 hours.",
    "zh": "一名70 kg的成年人因图中阴影所示的深二度及三度烧伤入院。使用Parkland公式（4 mL × kg × %体表面积，前8小时输注一半），计算前8小时的输注速率（mL/hr）。"
  },
  "blanks": [
    { "id": "b1", "numeric": { "value": 630, "unit": "mL/hr", "tolerance": 0 } }
  ],
  "rationale": {
    "correct": {
      "en": "Shaded regions: anterior trunk (18%) + anterior right leg (9%) + anterior left leg (9%) = 36% TBSA. Parkland total = 4 × 70 × 36 = 10,080 mL. Half (5,040 mL) is given over the first 8 hours: 5,040 ÷ 8 = 630 mL/hr.",
      "zh": "阴影区域：躯干前侧（18%）+ 右下肢前侧（9%）+ 左下肢前侧（9%）= 36% 体表面积。Parkland总量 = 4 × 70 × 36 = 10,080 mL。前8小时给予一半（5,040 mL）：5,040 ÷ 8 = 630 mL/hr。"
    }
  },
  "testTakingStrategy": {
    "en": "Read %TBSA off the shaded body regions first, then apply Parkland in order: total, then half, then divide the first half by 8 hours.",
    "zh": "先从阴影的身体区域读出%体表面积，再按顺序应用Parkland：总量、一半、再将前一半除以8小时。"
  },
  "visual": {
    "kind": "burn_map",
    "population": "adult",
    "burns": ["trunk_anterior", "leg_l_anterior", "leg_r_anterior"],
    "caption": { "en": "Burn diagram", "zh": "烧伤示意图" }
  },
  "meta": {
    "visual_justification": "The %TBSA, and therefore the Parkland volume and rate, can only be obtained by reading which body regions are shaded on the diagram; the stem does not state the %TBSA.",
    "derived_values_keyed": {
      "tbsa_pct": 36,
      "parkland_total_ml": 10080,
      "parkland_first8h_ml": 5040,
      "parkland_rate_first8h_ml_hr": 630
    },
    "weight_kg": 70,
    "round": 0,
    "source": "ABA Advanced Burn Life Support — Parkland formula",
    "tier": "strictest",
    "skill_signature": "burn:tbsa-parkland/first8h-rate",
    "stem_disambiguators": ["70 kg", "4 mL × kg × %TBSA stated in stem"]
  }
}
```

---

## 6. `mar` — Medication Administration Record

| | |
|---|---|
| ID / tier | `mar_*` / **strictest** (medication, prioritization) |
| Item types | `multiple_choice`, `select_all`, `matrix` — **no `fill_in_blank`** |
| Biggest gotcha | `mar` carries **no arithmetic** — `dose` is a display string ("40 mg"); dose *math* is `medication_label`'s job. Every administration `time` must be a member of `timeGrid`. |

**Spec contract**
```ts
visual: {
  kind: "mar",
  timeGrid: string[],                  // non-empty, unique, e.g. ["0600","1200","1800","2400"]
  medications: [{
    name: string,
    dose: string,                       // DISPLAY ONLY, e.g. "40 mg"
    route: "PO"|"IV"|"IVPB"|"IM"|"SubQ"|"SL"|"PR"|"topical"|"inhaled"|"ophthalmic"|"NG",
    frequency: string,                  // display, e.g. "q6h", "BID", "PRN q4h"
    administrations: [{ time: string /* ∈ timeGrid */, status: "given"|"held"|"due"|"missed"|"late"|"not_given" }],
    isHighAlert?: boolean               // bolds the name; audit aid, not a clinical claim
  }],                                   // ≥1 medication; names unique
  caption?: { en, zh? }
}
```

**`selfCheck` / `meta`.** Needs ≥1 of: `meta.keyed_cells` (array of `{ medication, time }` that each resolve to a real administration in the spec) **or** `meta.keyed_relationship` (non-empty string describing a cross-row/cross-time relationship). No `derived_values_keyed`.

**Clinical targets.** Unsafe/duplicate orders, missed/held/late doses, adverse-effect timing, prioritization, drug–drug timing collisions, high-alert flags. The reasoning turns on reading statuses, times, and combinations off the grid.

**Worked example** (multiple_choice, keyed_relationship — concurrent AV-nodal blockers):
```json
{
  "id": "mar_av_nodal_blockers_01",
  "itemType": "multiple_choice",
  "category": "Pharmacological and Parenteral Therapies",
  "topic": "medication administration safety",
  "difficulty": "hard",
  "stem": {
    "en": "A nurse reviews the medication administration record below before the 1600 medication pass. Which action is the priority?",
    "zh": "护士在1600给药前查看下面的药物给药记录。哪项措施是首要的？"
  },
  "options": [
    { "id": "A", "en": "Assess the heart rate and blood pressure before giving the 1600 dose.", "zh": "在给予1600剂量前评估心率和血压。" },
    { "id": "B", "en": "Administer both 1600 doses as scheduled without further assessment.", "zh": "按计划给予两种1600剂量，无需进一步评估。" },
    { "id": "C", "en": "Hold all cardiac medications for the rest of the shift.", "zh": "在本班次剩余时间内停用所有心脏药物。" },
    { "id": "D", "en": "Document the late dose and take no further action.", "zh": "记录延迟的剂量，不采取进一步措施。" }
  ],
  "correct": ["A"],
  "rationale": {
    "correct": {
      "en": "Metoprolol (a beta-blocker) and diltiazem (a non-dihydropyridine calcium channel blocker) both slow AV-nodal conduction and lower heart rate and blood pressure. Both have been given earlier and are scheduled again; the nurse must assess heart rate and blood pressure before the next doses to avoid bradycardia and hypotension.",
      "zh": "美托洛尔（β受体阻滞剂）与地尔硫卓（非二氢吡啶类钙通道阻滞剂）均减慢房室结传导并降低心率和血压。两者此前均已给药且再次列入计划；护士必须在下次给药前评估心率和血压，以避免心动过缓和低血压。"
    },
    "byChoice": [
      { "refId": "A", "en": "Two AV-nodal blocking agents together require pre-dose heart rate and blood pressure assessment.", "zh": "两种房室结阻滞剂联用需要在给药前评估心率和血压。" },
      { "refId": "B", "en": "Giving both without assessment risks additive bradycardia and hypotension.", "zh": "未经评估同时给药有叠加性心动过缓和低血压的风险。" },
      { "refId": "C", "en": "Blanket holding is not indicated; assessment guides whether to give or hold.", "zh": "不应一概停药；评估结果决定给药还是停药。" },
      { "refId": "D", "en": "Documentation alone ignores the additive cardiac risk of the combination.", "zh": "仅作记录忽视了该组合叠加的心脏风险。" }
    ]
  },
  "testTakingStrategy": {
    "en": "Scan the MAR for two drugs that do the same thing to the heart. When two rate-lowering drugs land together, assess before you give.",
    "zh": "扫描MAR，寻找两种对心脏作用相同的药物。当两种减慢心率的药物同时出现时，先评估再给药。"
  },
  "visual": {
    "kind": "mar",
    "timeGrid": ["0800", "1200", "1600", "2000"],
    "medications": [
      {
        "name": "metoprolol",
        "dose": "25 mg",
        "route": "PO",
        "frequency": "BID",
        "administrations": [
          { "time": "0800", "status": "given" },
          { "time": "1600", "status": "due" }
        ]
      },
      {
        "name": "diltiazem",
        "dose": "30 mg",
        "route": "PO",
        "frequency": "TID",
        "administrations": [
          { "time": "0800", "status": "given" },
          { "time": "1200", "status": "given" },
          { "time": "1600", "status": "due" }
        ]
      }
    ],
    "caption": { "en": "Medication Administration Record", "zh": "药物给药记录" }
  },
  "meta": {
    "visual_justification": "The priority is visible only by reading that two AV-nodal blocking agents are both scheduled at 1600 on the record; the stem names neither the drugs nor the timing collision.",
    "keyed_relationship": "metoprolol and diltiazem both due at 1600 — concurrent AV-nodal blockade",
    "source": "Lexicomp drug interactions; cardiac medication administration standards",
    "tier": "strictest",
    "skill_signature": "mar:concurrent-av-nodal-blockers/pre-dose-assessment",
    "stem_disambiguators": ["1600 medication pass"]
  }
}
```
For a single-cell item, use `keyed_cells` instead, e.g. a held high-alert anticoagulant dose: `"keyed_cells": [{ "medication": "enoxaparin", "time": "1800" }]`.

---

## 7. Smoke-batch acceptance (per lane, run before scaling)

Open each lane with a small batch (6–8 items) and take it fully through the gate once — that batch is the calibration check.

Per-lane minimum composition:
- **io_record** — ≥1 `fill_in_blank` (net balance/total) + interpretation MC; cover overload and deficit.
- **medication_label** — cover `mL` volume, `mL` rate, and `tablet` quantity derivations; ≥1 high-alert drug.
- **device_screen** — ≥1 arithmetic (`max_demands_1h`/`infusion_*`) + ≥1 `keyed_settings` safety MC; cover pca and infusion/enteral.
- **burn_map** — **adult only**; cover `tbsa_pct` alone and a full Parkland chain; Parkland constant stated in every stem.
- **mar** — cover `keyed_cells` (single unsafe/held cell) and `keyed_relationship` (cross-row); no `fill_in_blank`.

Gate (all must pass):
```sh
npm run validate-bank -- banks/banks-raw/<draft>.json   # schema + spec ranges; selfCheck runs inside
npm run test-visuals                                     # registry conformance / determinism, no regressions
npm run promote                                          # deterministic shuffle (MC/SATA)
npm run audit                                            # Tier 0 validate + Tier 1 references/positions/integrity
# merge → delete raw draft → ledger
npm run census && npm run census:check                   # regenerate + commit census.json + BANK-CENSUS.md
npm run build
```

Human sign-off (strictest tier):
- [ ] Every arithmetic item: keyed `derived_values_keyed` recomputes exactly (zero `self_check_*`); units match (no cross-unit math); rounding declared.
- [ ] Every item: removing the visual changes the answer; the stem never states the carried value/finding.
- [ ] `burn_map`: no `pediatric`; Parkland constant in the stem.
- [ ] `device_screen`: basal only counted when `mode` says "basal"; `shift_hours` present where `delivered_dose_total_mg` uses basal.
- [ ] `mar`: dose treated as display only (no math); all admin times ∈ `timeGrid`.
- [ ] Clinical claims source-checked; `meta.source` recorded; bilingual parity; `topic` English-only.
- [ ] SATA correct-count not collapsed to one value across the batch.
- [ ] `BANK-REVIEW-LEDGER.md` updated; raw draft deleted after merge.

If a lane clears with no `selfCheck` or geometry surprises, its worked example is the validated template and the lane scales on it.
