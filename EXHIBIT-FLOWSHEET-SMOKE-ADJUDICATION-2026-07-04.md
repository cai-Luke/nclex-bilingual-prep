# Exhibit Flowsheet Smoke Batch — Adjudication

Date: 2026-07-04
Adjudicator: Claude (gate + senior semantic review)
Input: `EXHIBIT-FLOWSHEET-SMOKE-EXTRACTION-2026-07-04.json` (Codex extraction)
Spec: `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md`
Method: deterministic gate (verbatim containment, allowlist, unit cross-check, reason enum, serial-shape)
run programmatically over all 6 records, then manual semantic review of trap panels, unit annotations,
out-of-scope omissions, and the serial skip. No bank, schema, or renderer change made.

## Verdict

The extraction is **strong but not clean**: it passes the deterministic gate on all six panels and
handles every prior/trend/serial trap correctly, but contains **one hard clinical defect** (a 1000×
platelet unit error) and surfaces **one genuine policy question** (post-intervention BP) that the
spec under-specified. The batch did its job: it exposed exactly the value+unit failure mode the
deterministic gate structurally cannot catch, which is the single most important finding for scoping
the full migration.

## What passed (deterministic gate — all 6)

- **Verbatim containment (GATE 1):** every keyed value and every excluded value round-trips
  byte-exact against `content.en` after NFC. Zero hallucinated or transposed values.
- **Allowlist (Rule A/B):** every panel and excluded label is a registry key. No off-allowlist
  labels appeared anywhere.
- **Exclusion reason enum (GATE 2):** all reasons in `{prior, trend, post_intervention}` — in-set.
- **Serial skip (Rule D):** Panel 5 correctly emitted `{ exhibitRef, lane: "skip_serial" }` and
  nothing else. The serial detector fired on the four-timepoint BP as designed.

## What passed (semantic — the judgment layer)

- **Prior/trend selection — perfect across all traps:**
  - Mucositis: keyed current temp 38.9 / BP 96·58 / creatinine 1.6 / glucose 268; excluded prior
    37.2 / 118·72 / 1.3 / 312. All correct.
  - Lithium: keyed creatinine 1.9; excluded baseline 0.9. Correct.
  - SCC stage3: keyed hemoglobin 9.6 / calcium 10.4; excluded trend values 10.8 / 10.8. Correct
    (both the "dropped from 10.8" and "improved from 10.8" priors caught).
- **Out-of-scope omission — perfect (9/9):** albumin, prealbumin, triglycerides, CRP (mucositis);
  lithium, eGFR, osmolality (lithium); alkaline phosphatase (SCC); eGFR (THA) — all correctly
  absent from both `panel[]` and `excludedValues[]`, exactly as Rule B requires. No off-allowlist
  value leaked in, and none was force-fit into an exclusion.
- **Unit-alias handling (Rule C) — correct where used:** mucositis recorded temp `102.0 °F`, WBC
  `0.3 × 10³/µL`, platelets `18,000/µL` as `unitAliases`, neither keyed nor excluded. The *alias
  capture* is right; the *panel unit* is where the defect lives (below).

## FINDING 1 — HARD DEFECT: platelet unit is a 1000× error (must fix)

- **Panel:** `opus_tpn_case_mucositis_01/exhibit_baseline`, platelets.
- **What Codex emitted:** `{ label: "platelets", value: "18,000", unit: "×10⁹/L" }`.
- **Source:** `platelets 18,000/µL`.
- **The error:** `18,000/µL` equals **18 ×10⁹/L**, not 18,000 ×10⁹/L. Codex kept the byte-exact
  source value `18,000` (so GATE 1 passes) but stamped the registry *canonical* unit `×10⁹/L` onto
  it without converting the scale. Rendered as `18,000 ×10⁹/L`, a critically-low platelet count
  (correct clinical meaning: severe thrombocytopenia) displays as an impossibly high number — a
  1000× clinical misread on a safety-relevant value.
- **Why the gate missed it:** GATE 1 checks that the *value string* came from the source; it does
  not check that the value+unit *pair* is dimensionally consistent. The value is verbatim; the unit
  is a valid registry string; only their combination is wrong.
- **Contrast — WBC is fine:** `0.3 × 10³/µL` == `0.3 ×10⁹/L` numerically (same scale), so WBC value
  `0.3` with unit `×10⁹/L` is correct. The defect is specific to analytes whose source unit differs
  in *scale* from the registry canonical (here `/µL` plain vs `×10⁹/L`).

**Root cause and required spec change.** Rule A says "unit comes from the registry, not from
parsing" — but that rule silently assumed the source value is already expressed in the canonical
scale. When the source uses an alternate unit (`altUnits` includes `K/µL` for platelets/WBC; plain
`/µL` is a further variant), stamping the canonical unit onto an unconverted value is wrong. Two
options for the final spec, to litigate:
  1. **Convert to canonical** at extraction time (value + unit both normalized). Deterministic but
     requires a per-analyte conversion table and breaks the "value is byte-exact substring" property
     of GATE 1 (the converted value no longer appears verbatim in the source).
  2. **Keep the source value byte-exact and capture its source unit explicitly** (add a
     `sourceUnit` field), deferring canonical conversion to the renderer, which already owns unit
     handling. Preserves GATE 1; moves the conversion to one audited place. **Recommended** — it
     keeps the extractor dumb and the containment gate intact, and puts the one dimensional
     operation in the renderer where `ANALYTE_DEFS` already lives.

Either way, a new deterministic check is needed: **dimensional sanity** — the emitted value, once
interpreted in its unit, must fall inside the analyte's `sanity{min,max}` band. `18,000 ×10⁹/L`
violates platelets `sanity.max = 2000` and would have been caught. This is the gate addition the
smoke batch earned: containment is necessary but not sufficient; a sanity-bound recompute closes the
value+unit gap.

## FINDING 2 — POLICY QUESTION: post-intervention BP (spec under-specified)

- **Panel:** `case_preeclampsia_magnesium_01/toxicity_assessment`.
- **What Codex emitted:** keyed rr 10 / spo2 93; **excluded** sbp 148 / dbp 94 as
  `post_intervention`.
- **The tension:** the source's only blood pressure is `Blood pressure after labetalol: 148/94`.
  Codex applied the `post_intervention` exclusion reason literally and correctly per the spec — but
  the *consequence* is that the rendered flowsheet for a magnesium-toxicity / severe-hypertension
  patient shows **no blood pressure at all**. There is no "current" BP to key because the only BP is
  post-intervention.
- **This is not a Codex error** — it followed the rule as written. It is a **gap in the spec's
  disposition model.** `post_intervention` was defined as an exclusion category alongside prior/
  trend/serial, but a post-intervention value is unlike a prior value: it is the *most current*
  reading, not a superseded one. Excluding it discards live clinical data.
- **Recommended spec change:** split the disposition. A post-intervention value should be **keyed**
  (it is the current reading) with an optional `context: "post_intervention"` annotation on the
  panel entry, not dropped. Reserve `excludedValues` for values that are genuinely *not current*
  (prior, trend, serial). This keeps the flowsheet clinically complete while preserving the
  provenance note. Litigate whether the annotation renders (e.g. a footnote "after labetalol") or is
  audit-only.

## Cost signal (for the windows estimate)

- Junior extraction quality on the deliberately-worst 6: containment 100%, prior/trend selection
  100%, out-of-scope discipline 100%, serial detection correct. The only value-level defect was the
  unit-scale case, which is a *spec* gap, not a model-judgment failure — the model faithfully did
  what Rule A said.
- Implication: on the easy ~226 non-trap panels, junior extraction is very likely reliable *once the
  unit-scale and post-intervention gaps are closed in the spec.* The residual human-adjudication
  cost is lower than feared — it concentrates on (a) analytes with alternate source units and (b)
  post-intervention readings, both of which are detectable deterministically and can be *routed* to
  human review rather than requiring blanket review.

## Recommended next steps (for Luke's decision)

1. **Close the two spec gaps** before any full run: add the `sourceUnit`-preserving record shape
   (Finding 1, option 2) plus a dimensional-sanity gate, and re-classify `post_intervention` from an
   exclusion to a keyed-with-context disposition (Finding 2).
2. **Add the sanity-bound recompute to the gate** so value+unit dimensional errors fail
   deterministically instead of relying on senior review to catch them.
3. Re-run the same 6-panel smoke batch against the revised spec to confirm both fixes land, then
   scope the full 232-panel migration with the gate doing the heavy lifting and human review routed
   only to the two flagged categories.

## What this did not do

No bank, schema, renderer, or grading change. Read-only review of Codex output + this ledger.
