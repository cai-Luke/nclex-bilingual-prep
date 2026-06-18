# RATIONALE-VISUALS-RETROFIT-PATCH-SPEC.md — hard-case retrofit (Claude Code)

**Scope:** add `rationale.visuals` to **three** existing items in `banks/hard-cases-canonical.json`.
**Source:** Gemini candidate sweep (`rationale_visual_candidate_sweep.md`), adjudicated for renderer producibility against the actual kind sources.
**Depends on:** `RATIONALE-VISUALS-SPEC.md` (schema `1.5`) merged and green first. Do not start until `1.5` is live.

This is a **conservative retrofit**. Each item has hard preconditions; if any fails, **skip that item and report it** — do not force a visual, do not invent patient data, do not substitute a different figure.

---

## Adjudication (why three, not five)

| candidate | kind | disposition | reason |
|---|---|---|---|
| `case_ami_01` / `case_ami_01_q1` | `rhythm_strip` | **DO NOT ADD** | `rhythm_strip` renders rhythm/rate only — no ST-segment morphology, no lead selection. It cannot depict a V3–V4 STEMI. A generic strip captioned as an anterior MI would teach a pattern the figure does not show. Not producible without a renderer change (out of scope). |
| `case_preeclampsia_magnesium_01` / `preeclampsia_mag_toxicity_matrix` | `vitals_trend` | **DO NOT ADD (v1)** | Urine output is not a `VitalKey` (`hr, sbp, dbp, map, rr, spo2, temp`); the RR+UO figure is not producible. Magnesium toxicity is threshold teaching, not a trend; a single snapshot is not plottable. |
| `case_burns_01` / `case_burns_01_part_2` | `burn_map` | **ADD** (pending §A checks) | Adult regions sum to the rationale's TBSA; payload fully determined. |
| `cs_hip_01` / `cs_hip_01_q5` | `medication_label` | **ADD** (pending §B checks) | Clean label payload; modest but real "read strength off label" value. |
| `cs_ngn_006_tbi` / `q6_1` | `vitals_trend` | **ADD** (pending §C checks) | Cushing's triad is the canonical `vitals_trend` use — only if ≥2 real timepoints exist. |

---

## Global preconditions (all three)

1. `banks/hard-cases-canonical.json` `meta.schemaVersion` must be `"1.5"`. If it is lower, bump it as part of this change (the bank now carries `rationale.visuals`).
2. The target item's `rationale.visuals` must be **absent** before the patch (declarative precondition; do not overwrite an existing array).
3. **Canonical edit friction:** these are canonical-file edits. Per DECISIONS principle 15, route through `scripts/patch-raw.ts --allow-canonical --reason "retrofit rationale.visuals (schema 1.5)"`, with declarative `before`→`after` ops, and add a `BANK-REVIEW-LEDGER.md` entry. No free-form hand-rewrite of the JSON (quote-hygiene gate, DECISIONS: edit programmatically, never retype).
4. **No `selfCheck` safety net.** Rationale visuals validate in exhibit mode — structural `validate` only. The arithmetic/parity check that `selfCheck` normally runs **does not run here**, so the recompute gate in each section below must be done by hand and must pass before writing.
5. Captions are answer-revealed (rationale visuals may name the finding) and must be bilingual EN + zh-CN.
6. After patching: `npm run validate-bank -- banks/hard-cases-canonical.json`, `npm run audit`, `npm run build`. (`npm run test-visuals` is unaffected — no kind changes.)

---

## A. `case_burns_01` → `case_burns_01_part_2` (`burn_map`)

**Data preconditions (verify in the real item before writing):**
- The part is a TBSA/Parkland item whose `rationale.correct` describes burns to the **anterior trunk, both anterior arms, and the anterior head/face**, and arrives at **31.5% TBSA** (adult Rule of Nines).
- The population is adult.

**Recompute gate:** `trunk_anterior 18 + arm_l_anterior 4.5 + arm_r_anterior 4.5 + head_anterior 4.5 = 31.5`. This must equal the TBSA stated in the rationale. If the rationale's regions or total differ, adjust the `burns` array to match the rationale (never the reverse), re-sum, and only proceed if the regions shaded equal the rationale's number. If they can't be reconciled with whole-region adult keys, **skip and report** (no fractional regions in v1).

**Payload (set `rationale.visuals` to):**
```json
[
  {
    "kind": "burn_map",
    "population": "adult",
    "burns": ["trunk_anterior", "arm_l_anterior", "arm_r_anterior", "head_anterior"],
    "caption": { "en": "Burn distribution — 31.5% TBSA (anterior trunk, both anterior arms, anterior head)", "zh": "烧伤分布——体表面积 31.5%（前躯干、双前臂、前头部）" }
  }
]
```
Adjust the `caption` TBSA figure if the recompute lands on a different (reconciled) value.

---

## B. `cs_hip_01` → `cs_hip_01_q5` (`medication_label`)

**Data preconditions:**
- The part is a dosage-calculation item where the product strength **Enoxaparin 40 mg / 0.4 mL** is the "have," and the rationale computes a volume-to-administer from it.
- Confirm the exact strength string in the case (`40 mg / 0.4 mL`). If the real case uses a different strength, use those numbers; if there is no label-strength-based calculation, **skip and report**.

**Recompute gate:** the label's `amount/perQty` (40 / 0.4 = 100 mg/mL) must be consistent with the concentration the rationale uses. If the rationale's math implies a different concentration, do not paper over it — skip and report a figure-vs-rationale mismatch for Claude review.

**Payload:**
```json
[
  {
    "kind": "medication_label",
    "drugName": "Enoxaparin",
    "amount": 40,
    "amountUnit": "mg",
    "perQty": 0.4,
    "perUnit": "mL",
    "caption": { "en": "Enoxaparin 40 mg / 0.4 mL prefilled syringe", "zh": "依诺肝素 40 mg / 0.4 mL 预充式注射器" }
  }
]
```

---

## C. `cs_ngn_006_tbi` → `q6_1` (`vitals_trend`)

**Data preconditions (strict — this is the conditional one):**
- The case must contain **≥2 real timepoints** of vital signs including **HR and SBP/DBP** (e.g. a documented baseline and the 12:00 deterioration). Pull the actual numbers from the case exhibits/stages.
- If only a **single** snapshot exists (one set of vitals at 12:00 with no earlier set), there is no trend to plot — **skip and report**. Do not synthesize a baseline.

**Producibility notes:**
- Plot `hr` (falling — bradycardia), `sbp` (rising), `dbp` (flat/falling) to show the **widening pulse pressure + bradycardia** of Cushing's. Omit `map` (avoids any MAP-consistency concern; `selfCheck` is off regardless).
- `time.values` must be strictly increasing; use the case's real timepoints (clock hours or relative hours). `vitals_trend` has no ≥3-point minimum, so 2 points is valid.
- Each `series.values` length must equal `time.values` length, and values must sit in the per-vital physiologic range.

**Recompute/parity gate:** the plotted numbers must be the case's charted numbers verbatim, and the direction shown (HR down, pulse pressure widening) must match the rationale's described pattern. Mismatch → skip and report.

**Payload (fill `time.values` and each `values` array from the real case; example shape only):**
```json
[
  {
    "kind": "vitals_trend",
    "time": { "unit": "hr", "values": [0, 12] },
    "population": "adult",
    "series": [
      { "vital": "hr",  "values": [/* baseline */, /* 12:00 */] },
      { "vital": "sbp", "values": [/* baseline */, /* 12:00 */] },
      { "vital": "dbp", "values": [/* baseline */, /* 12:00 */] }
    ],
    "caption": { "en": "Vital sign trend — widening pulse pressure with bradycardia (Cushing's response)", "zh": "生命体征趋势——脉压增宽伴心动过缓（库欣反应）" }
  }
]
```

---

## Output

For each of the three: applied / skipped, with the precondition that decided it. If any item is skipped, state which check failed and what the case actually contained — that is the signal for whether the candidate is dead or just needs a different (still existing-kind) figure. Do not retry rejected candidates A/`case_ami_01` or the preeclampsia item under this spec.
