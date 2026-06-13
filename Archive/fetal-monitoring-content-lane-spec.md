# FETAL-MONITORING-CONTENT-LANE-SPEC.md

Content-generation spec for the `fetal_monitoring` (`fhr_*`) visual lane. The renderer (U7) is complete and source-verified; this spec opens the **content** lane through the standard raw → cross-model review → source-check → visual audit → promote → ledger pipeline. It is the first content lane spec for a strictest-tier visual kind, so the first batch doubles as a calibration check — run a small smoke batch all the way through the gate before scaling.

Authority order on conflict: `AGENTS.md` (workflow) › `NCLEX-Question-Schema.md` (schema) › this file. Renderer behavior is whatever `src/visuals/kinds/fetal_monitoring/` actually does; the rules below are transcribed from that code and `audit/u7-fetal-monitoring-source-verification-2026-06-12.md` as of 2026-06-13 — re-pull if the renderer changes.

---

## 0. The five constraints most likely to break a batch

Put these in front of the generating model; everything else is detail.

1. **Item types are restricted to `multiple_choice`, `select_all`, `matrix`.** The module registers no `allowedItemTypes`, so it inherits the global visual default. `fill_in_blank`, `ordered_response`, `dropdown_cloze`, and `case_study` will **fail `validate-bank`**. If you want a "sequence the interventions" item, it has to be a non-visual ordered_response (different lane) — not an `fhr_*` item.
2. **The tracing must be load-bearing, and the stem must not name the pattern.** Removing the strip must change the answer. Never write "the tracing shows late decelerations…"; the learner reads the decel type / variability / category off the rendered FHR↔contraction phase relationship. A decorative tracing on an otherwise-text question is an invalid item (DECISIONS principle 6; AGENTS visual stages 3–4).
3. **Oxygen is not the answer for a normoxic mother.** Routine maternal O₂ for a Category II/III tracing is no longer supported (ACOG; current AWHONN). Do **not** key "apply oxygen" as the correct first/priority action unless the stem establishes maternal hypoxemia. "Apply O₂ by nonrebreather at 10 L/min" is a *distractor* in normoxic scenarios, and a good one.
4. **`selfCheck` is a build gate with exact geometry.** Decel/accel timing must satisfy the inequalities in §3. A late deceleration whose nadir doesn't lag the contraction peak by 10–90 s is a build failure, not a content note. Use the §3 cookbook geometry verbatim and change only the clinical wrapper.
5. **Strictest tier = item-level source review every time.** The renderer math is machine-checked; the *clinical* call (Category I/II/III, the correct action) is not. Every item needs a live-source check against NICHD 2008 / AWHONN / ACOG before promotion.

---

## 1. Lane parameters

| Parameter | Value |
|---|---|
| Kind | `fetal_monitoring` |
| ID prefix | `fhr_*` (globally unique across all bundled banks) |
| Schema version | `1.2` |
| Item types | `multiple_choice`, `select_all`, `matrix` **only** |
| Tier | `strictest` (every item carries item-level clinical source review) |
| Bank home | **Recommend `banks/fetal-canonical.json`** (dedicated per-kind home, mirroring `vitals-`/`lab-`/`mar-`/`capnography-canonical.json`). Bank file = label only; items can be redistributed later at zero cost. **Confirm before building.** |
| Bilingual | Every displayed field is `{en, zh}`. `topic` is **English-only** (Tier-0 CJK gate fails the build otherwise). |
| Category targeting | FHR interpretation tags naturally to **Reduction of Risk Potential** (fetal monitoring is a diagnostic/monitoring procedure with potential complications) and **Physiological Adaptation** (fetal compromise); antepartum-testing teaching → **Health Promotion and Maintenance**. Avoid over-labeling to "Maternal-Newborn Care & Teaching" — it is already an `AVOID_TOPIC` (43 items). This lane's leverage is that it is currently **empty (0 items)**, not that it closes the MoC/Pharm category deficits. |

---

## 2. Spec contract (transcribed from `validateFetalMonitoring`)

```ts
visual: {
  kind: "fetal_monitoring",
  baselineFhr: number,            // REQUIRED, 50–220 bpm. Normal 110–160; brady <110; tachy >160.
  variability: "absent" | "minimal" | "moderate" | "marked",  // REQUIRED
  durationSec?: number,           // default 600; if present 120–1200. Use 300–480 for a readable single-page strip.
  seed?: number,                  // optional non-negative integer; only changes variability texture
  contractions?: [{ peakSec: number,            // 0..durationSec
                    amplitudeMmHg?: number,     // 5–100, default 50
                    durationSec?: number }],    // 20–180, default 60
  accelerations?: [{ peakSec: number,           // 0..durationSec
                     riseBpm: number,           // 1–60
                     durationSec: number }],     // 5–120
  decelerations?: [{ type: "early"|"late"|"variable"|"prolonged",
                     nadirSec: number,          // 0..durationSec
                     depthBpm: number,          // 1–120
                     durationSec: number,       // 5–600
                     contractionIndex?: number }],  // see rule below
  caption?: { en: string, zh?: string }         // if present, en non-empty; zh non-empty when present
}
```

`contractionIndex` rule: **required** for `early`/`late` (must index an existing contraction); **must be omitted** for `variable`; omit for `prolonged`.

Variability is rendered at a **fixed** peak-to-trough amplitude per category — `absent` 0 bpm (flat line), `minimal` 4, `moderate` 14, `marked` 32. You choose the category; you cannot tune the exact bpm.

---

## 3. `selfCheck` geometry — the build gates (from `features.ts`)

These fire as **build failures**. The inequalities, then a copy-this cookbook.

**Acceleration (term, ≥32 wk model):** `riseBpm ≥ 15` AND `15 ≤ durationSec < 60`.

**Early decel:** `contractionIndex` set · `durationSec ≥ 60` (gradual) · `|nadirSec − contraction.peakSec| ≤ 5` (nadir at the peak).

**Late decel:** `contractionIndex` set · `durationSec ≥ 60` (gradual) · `10 ≤ (nadirSec − contraction.peakSec) ≤ 90` (nadir lags the peak).

**Variable decel:** `contractionIndex` omitted · `depthBpm ≥ 15` · `15 ≤ durationSec < 60` (abrupt; onset-to-nadir = durationSec/2 < 30).

**Prolonged decel:** `contractionIndex` omitted · `depthBpm ≥ 15` · `120 ≤ durationSec < 600` (≥2 min, <10 min).

`depthBpm` for early/late is not gated by `selfCheck` beyond ≥1, but keep them clinically modest (10–30 bpm). `early`/`late` are *gradual and usually symmetrical*; `variable` is *abrupt and V-shaped*.

### Pattern cookbook (drop-in geometry; change only the clinical wrapper)

All on a 480 s strip with contractions at `peakSec` 90 / 240 / 390 unless noted.

| Pattern | `baselineFhr` | `variability` | `contractions` | `decelerations` / `accelerations` |
|---|---|---|---|---|
| **Cat I reassuring** | 140 | `moderate` | optional, none-to-mild | `accelerations:[{peakSec:160,riseBpm:20,durationSec:30}]`; no decels |
| **Early (benign, head compression)** | 140 | `moderate` | 90, 240, 390 | `[{type:"early",nadirSec:90,depthBpm:20,durationSec:70,contractionIndex:0}, …240/idx1, …390/idx2]` |
| **Recurrent late (uteroplacental insufficiency)** | 140 | `minimal` | 90, 240, 390 | `[{type:"late",nadirSec:115,depthBpm:20,durationSec:70,contractionIndex:0}, …265/idx1, …415/idx2]` (lag 25 s) |
| **Variable (cord compression)** | 145 | `moderate` | (independent) | `[{type:"variable",nadirSec:120,depthBpm:45,durationSec:24}, {type:"variable",nadirSec:300,depthBpm:40,durationSec:22}]` |
| **Prolonged decel** | 140 | `moderate` | 80 | `[{type:"prolonged",nadirSec:240,depthBpm:35,durationSec:180}]` |
| **Bradycardia + absent variability (ominous)** | 95 | `absent` | 90, 240, 390 | optional recurrent `late` as above; the flat baseline + low rate is the cue |

---

## 4. `meta` contract (from `selfCheckFetalMonitoring` + inherited §6.1)

Fetal-specific keyed pattern is `expected_pattern` (not `expected_trend`). There are no derived numeric values, so `derived_values_keyed` is omitted/empty.

```jsonc
"meta": {
  "visual_justification": "<non-empty; why the strip is load-bearing — what the learner must read off it>",
  "expected_pattern": {
    // declare AT LEAST ONE of the three; each is cross-checked against the rendered spec:
    "decelerations": ["late"],        // every listed type must actually be present in visual.decelerations
    "variability": "minimal",         // must EQUAL visual.variability
    "accelerations_present": false    // must EQUAL (visual.accelerations.length > 0)
  },
  "source": "<authoritative ref, e.g. 'NICHD 2008 / AWHONN FHM 6th ed.' or 'ACOG Practice Bulletin 106/116'>",
  "tier": "strictest",
  "skill_signature": "fhr:<cue>/<conclusion>",   // e.g. "fhr:recurrent-late/uteroplacental-insufficiency"
  "stem_disambiguators": ["<textual context that frames but does NOT give away the answer>"]
}
```

Mismatch codes to expect if you get it wrong: `self_check_pattern_absent`, `self_check_variability_mismatch`, `self_check_accel_mismatch`, `self_check_no_keyed_pattern`, `self_check_missing_justification`, plus the per-decel phase codes from §3.

---

## 5. Clinical content rules (strictest tier)

- **Three-tier NICHM system.** Category I = all reassuring (baseline 110–160, moderate variability, ± accelerations, no late/variable decels; early decels allowed) → continue monitoring. Category III = absent variability **with** recurrent late OR recurrent variable OR bradycardia, **or** sinusoidal → intrauterine resuscitation + expedite delivery. Category II = everything between; requires evaluation/intervention. **`selfCheck` verifies the *features*, not the category label** — the I/II/III call is human-review territory.
- **Variability is the dominant indicator** of fetal oxygenation/acid-base status. Moderate variability is reassuring even alongside some decels; absent/minimal variability is the red flag.
- **Intrauterine resuscitation bundle:** reposition (left lateral), IV fluid bolus, **discontinue oxytocin**, correct maternal hypotension, consider tocolytic, notify provider. **Oxygen only for maternal hypoxemia** — see §0.3.
- **Decel → cause mapping (the load-bearing read):** early = head compression (benign); late = uteroplacental insufficiency (concerning); variable = cord compression; prolonged = ≥2 min event. VEAL CHOP is fine as a `testTakingStrategy` anchor but the item must turn on reading the strip, not reciting the mnemonic.
- **Source every clinical claim** to NICHD 2008, AWHONN FHM (6th ed.), or ACOG. Put the ref in `meta.source`.

---

## 6. Question-design patterns by item type

- **`multiple_choice`** — identify the pattern; classify the tracing (Cat I/II/III); identify the priority nursing action; identify the underlying cause. Best for the oxygen-caveat trap.
- **`select_all`** — which interventions are appropriate for this tracing; which findings are present / reassuring / non-reassuring. (Correct count must not collapse to a single value across the batch — the non-MCQ bias audit checks this.)
- **`matrix`** — finding → reassuring/non-reassuring; or action → indicated/contraindicated for the shown tracing; or (with one strip) feature → category. Strictest-tier wording rules apply to every cell.

Follow the existing schema shapes for SATA/matrix exactly as the bank already uses them; only the `visual` + `meta` blocks are kind-specific.

---

## 7. Out of scope for this lane

- **Sinusoidal pattern** — not modelable (no sinusoidal field; `marked` variability ≠ sinusoidal). Do not key items to it.
- **Pre-32-week acceleration definition** (10×10) — no gestational-age field; term 15×15 only.
- **Category label as a machine-checked fact** — `selfCheck` checks features, not the I/II/III label.
- **`fill_in_blank` / `ordered_response` / `dropdown_cloze` / `case_study`** — not registered for this kind (§0.1).
- No pediatric/age-band variants; no AI-generated imagery (never).

---

## 8. Pipeline mapping (fits the current actor setup)

| Stage | Actor | Output |
|---|---|---|
| 1. Author fact pattern + correct interpretation/action (English prose; closed-world where a protocol value is load-bearing) | Opus harness | English skeleton per item |
| 2. Compile to `fetal_monitoring` JSON: build `visual` from §3 cookbook geometry, write bilingual stem/options/rationale, fill `meta` per §4 | GPT / Gemini | raw `fhr_*` items in `banks/banks-raw/` |
| 3. Cross-model review (the model that did **not** compile a given batch reviews it) — schema, parity, necessity, geometry sanity | GPT ↔ Gemini | review notes |
| 4. Gatekeep: run the gate, source-check clinical currency against live sources, open PR | Opus-in-Claude-Code | passing PR |
| 5. Final content review before promotion | here (planning Claude) | promote + ledger |

The generator never reviews its own batch (DECISIONS principle 2/5). Currency is verified at stage 4 against live sources, never trusted from a model's cutoff (principle 12).

---

## 9. Worked example (passes `validate` + `selfCheck`; copy as the template)

Recurrent late decelerations + minimal variability, oxytocin running — tests reading the strip **and** the oxygen caveat.

```json
{
  "id": "fhr_late_oxytocin_01",
  "itemType": "multiple_choice",
  "category": "Reduction of Risk Potential",
  "topic": "intrapartum fetal monitoring",
  "difficulty": "hard",
  "stem": {
    "en": "A client at 39 weeks' gestation is receiving an oxytocin infusion to augment labor. Maternal oxygen saturation is 98% on room air and blood pressure is 118/72 mmHg. The nurse reviews the fetal monitoring tracing below. Which action should the nurse take first?",
    "zh": "一名妊娠39周的患者正在接受缩宫素输注以加强产程。产妇在室内空气下的血氧饱和度为98%，血压为118/72 mmHg。护士查看下面的胎儿监护图。护士应首先采取哪项措施？"
  },
  "options": [
    { "id": "A", "en": "Discontinue the oxytocin infusion and reposition the client to a lateral position.", "zh": "停止缩宫素输注并将患者转为侧卧位。" },
    { "id": "B", "en": "Apply oxygen by nonrebreather mask at 10 L/minute.", "zh": "通过非重复呼吸面罩以10升/分钟给氧。" },
    { "id": "C", "en": "Document the tracing as Category I and continue routine monitoring.", "zh": "将图形记录为I类并继续常规监测。" },
    { "id": "D", "en": "Increase the oxytocin infusion rate to strengthen contractions.", "zh": "增加缩宫素输注速率以增强宫缩。" }
  ],
  "correct": ["A"],
  "rationale": {
    "correct": {
      "en": "The tracing shows recurrent decelerations whose nadir follows each contraction peak, with minimal variability and no accelerations. This late-deceleration pattern with reduced variability indicates uteroplacental insufficiency. With oxytocin infusing, the priority is to remove the stressor: discontinue the oxytocin and reposition the client to improve uteroplacental perfusion.",
      "zh": "图形显示反复出现的减速，其最低点在每次宫缩峰值之后，伴有微小变异且无加速。这种伴变异减少的晚期减速模式提示子宫胎盘功能不全。在缩宫素输注的情况下，首要措施是去除应激源：停止缩宫素并为患者重新摆位以改善子宫胎盘灌注。"
    },
    "byChoice": [
      { "refId": "A", "en": "Recurrent late decelerations with minimal variability call for intrauterine resuscitation; stopping oxytocin removes the contraction stressor and repositioning improves perfusion.", "zh": "伴微小变异的反复晚期减速需要进行宫内复苏；停止缩宫素可去除宫缩应激源，重新摆位可改善灌注。" },
      { "refId": "B", "en": "Maternal saturation is 98%; routine oxygen is not indicated for a normoxic mother and does not address the uterine stressor.", "zh": "产妇血氧饱和度为98%；对血氧正常的产妇不需常规给氧，且这不能解决子宫应激源。" },
      { "refId": "C", "en": "Decelerations whose nadir lags the contraction peak with minimal variability are not Category I and are not reassuring.", "zh": "最低点滞后于宫缩峰值且变异微小的减速不是I类，也不属于安心型。" },
      { "refId": "D", "en": "Increasing oxytocin intensifies contractions and worsens uteroplacental insufficiency.", "zh": "增加缩宫素会加剧宫缩并恶化子宫胎盘功能不全。" }
    ]
  },
  "testTakingStrategy": {
    "en": "Read the timing: a deceleration whose lowest point comes after the contraction peak is 'late' (placental insufficiency). When oxytocin is running, the first move is to stop the stressor, not to add oxygen.",
    "zh": "看时间关系：最低点出现在宫缩峰值之后的减速是“晚期”减速（胎盘功能不全）。当缩宫素正在输注时，第一步是停止应激源，而不是给氧。"
  },
  "glossary": [
    { "termEn": "late deceleration", "termZh": "晚期减速", "defZh": "胎心率逐渐下降，其最低点出现在宫缩峰值之后，提示子宫胎盘功能不全" }
  ],
  "visual": {
    "kind": "fetal_monitoring",
    "durationSec": 480,
    "baselineFhr": 140,
    "variability": "minimal",
    "seed": 11,
    "contractions": [ { "peakSec": 90 }, { "peakSec": 240 }, { "peakSec": 390 } ],
    "decelerations": [
      { "type": "late", "nadirSec": 115, "depthBpm": 20, "durationSec": 70, "contractionIndex": 0 },
      { "type": "late", "nadirSec": 265, "depthBpm": 20, "durationSec": 70, "contractionIndex": 1 },
      { "type": "late", "nadirSec": 415, "depthBpm": 20, "durationSec": 70, "contractionIndex": 2 }
    ],
    "caption": { "en": "Fetal monitoring tracing", "zh": "胎儿监护图" }
  },
  "meta": {
    "visual_justification": "The diagnosis turns on the phase relationship between each deceleration's nadir and the contraction peak plus the minimal variability — cues that can only be read off the synchronized tracing; stating them in text would give away the answer.",
    "expected_pattern": {
      "decelerations": ["late"],
      "variability": "minimal",
      "accelerations_present": false
    },
    "source": "NICHD 2008; ACOG Practice Bulletin 106/116; AWHONN FHM 6th ed.",
    "tier": "strictest",
    "skill_signature": "fhr:recurrent-late-minimal-variability/uteroplacental-insufficiency",
    "stem_disambiguators": ["oxytocin infusion", "maternal SpO2 98% on room air", "BP 118/72"]
  }
}
```

---

## 10. Smoke-batch acceptance criteria (run this first)

Generate **6–10 items** spanning the pattern space, then take the whole batch through the gate once. This is the recalibration check before scaling.

Batch composition (minimum):
- 1 Cat I reassuring (variability `moderate` + accelerations) — the "continue monitoring" control.
- 1 early decels (benign) — distinguishes early vs late by phase.
- 1 recurrent late (the worked example or a sibling).
- 1 variable decels (cord compression).
- 1 prolonged decel or bradycardia + absent variability.
- 1 management item that uses the oxygen-caveat distractor.
- ≥1 `select_all` and ≥1 `matrix` (don't ship MC-only).

Gate (all must pass; from `AGENTS.md`):
```sh
npm run validate-bank -- banks/banks-raw/<draft>.json   # schema + spec ranges
npm run test-visuals                                     # registry conformance / determinism (no regressions)
# selfCheck runs inside validate; confirm zero self_check_* codes
npm run promote                                          # deterministic shuffle, MC/SATA
npm run audit                                            # Tier 0 validate + Tier 1 references/positions/integrity
# merge shuffled output into banks/fetal-canonical.json → delete raw draft
npm run census && npm run census:check                   # regenerate + commit census.json + BANK-CENSUS.md
npm run build
```

Human sign-off (strictest tier):
- [ ] Each item: removing the strip changes the answer (load-bearing); stem does not name the pattern.
- [ ] Each item: clinical call source-checked against NICHD 2008 / AWHONN / ACOG; ref recorded in `meta.source`.
- [ ] No item keys routine oxygen for a normoxic mother.
- [ ] Bilingual parity on every displayed field; `topic` English-only.
- [ ] SATA correct-count not collapsed to a single value across the batch.
- [ ] `BANK-REVIEW-LEDGER.md` updated; raw draft deleted after merge.

If the smoke batch clears with no geometry or `selfCheck` surprises, the cookbook geometry is validated and the remaining lanes can scale on the same template.
