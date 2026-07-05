# Exhibit Flowsheet — Blind-Batch Generation Spec

Date: 2026-07-04
Status: generation spec for a held-out test set. Companion to
`EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` (the extraction contract, amended after
smoke batch 1) and `scripts/exhibit-flowsheet-gate.ts` (the deterministic checker).

## Why a blind batch

Smoke batches 1 and 2 use the six worst-case exhibits that the extraction spec was *written
against*. They confirm the spec is internally coherent and that a junior model can execute it, but
they cannot tell us whether the spec **generalizes** — the rules were tuned to those exact panels,
so passing them risks overfitting. This batch produces **unseen** exhibits with a controlled,
known-in-advance distribution of the trap types, so we can predict what the gate should output and
measure the extractor + gate on material neither was tuned to.

The point is falsification: we want exhibits that could break Rule C (unit scale), Rule D (serial),
Rule F (post-intervention), the prior/trend selection call, and the out-of-scope discipline — mixed
with clean cases — and then check that the extractor's output and the gate's verdict match the
ground truth we designed in.

## Producer≠checker (hard constraint)

Per `DECISIONS.md`, the model that generates a batch never reviews it, and here the constraint
extends one step further: **the model that generates these blind exhibits must not be the model that
later extracts flowsheets from them.** Assign generation to a different model/instance than the
extraction lane. Rationale: if the same model writes the prose and then extracts from it, it may
"remember" its own intended structure and extract correctly for reasons the spec doesn't guarantee —
which would again overfit. Suggested split: Gemini generates the blind prose; GPT/Codex extracts;
`exhibit-flowsheet-gate.ts` + Claude adjudicate. Any assignment works so long as generator ≠
extractor.

## What to generate

**12 fictional case-study exhibits**, each a standalone `content.en` + `content.zh` prose block in
the same register as existing case exhibits (a shift-assessment note, an ED triage note, a
post-op update, a clinic reassessment, etc.). These are **throwaway test fixtures**, not bank
content — they are never promoted, never given IDs in the `CANONICAL_PREFIXES` space, and live only
in the blind-batch file. Use obviously-synthetic patient framing so they cannot be confused with
real bank items.

Each exhibit must be **clinically plausible and internally consistent** (a nurse educator should not
wince), bilingual (EN + Simplified Chinese, parity required), and 80–250 words of EN prose.

### Required trap distribution (this is the ground truth)

Generate exactly this mix, and record which bucket each exhibit belongs to in a separate answer key
(see "Deliverables"). Do **not** reveal the bucket inside the prose.

| # | Bucket | What it must contain | Expected gate/extractor behavior |
|---|--------|----------------------|----------------------------------|
| 1–3 | **Clean woven** | 4–8 allowlisted vitals/labs embedded in narrative, all current, standard units | keyed panel, empty excludedValues, GATE 1–4 pass |
| 4–5 | **Prior/trend trap** | ≥2 allowlisted values where one is explicitly a prior/baseline/earlier reading (`was X`, `down from X`, `baseline X`) | current keyed, prior→excludedValues reason=prior/trend |
| 6–7 | **Unit-scale trap** | a CBC value in a non-canonical unit: platelets or WBC written as `NN,NNN/µL` or `NN.N ×10³/µL` | keyed with `sourceUnit` = the source unit; GATE 4 passes only if sourceUnit is right; if a wrong canonical unit is stamped, GATE 4 must WARN |
| 8–9 | **Serial** | ≥1 non-BP parameter (e.g. serial creatinine, HR, or temp) reported at ≥2 explicit clock timepoints; Panel 8 should be a **non-BP** serial specifically, to exercise the generalized serial detector (not just BP) | lane=`skip_serial`, no arrays; gate's serial re-derivation must fire on the non-BP parameter |
| 10 | **Post-intervention** | the only reading of a parameter is framed as `after <drug/intervention>` | keyed in panel with `context: "post_intervention"`, not excluded |
| 11 | **Out-of-scope heavy** | several clinically important values that are NOT allowlist analytes (lithium, eGFR, albumin, CRP, osmolality, alk phos, weight) alongside 3+ allowlisted ones | allowlisted keyed; off-allowlist neither keyed nor excluded |
| 12 | **Mixed adversarial** | combine a prior-value trap + a unit-scale CBC + at least one out-of-scope value in one exhibit | all three behaviors at once |

Notes for the generator:
- Vary surface wording so the extractor cannot pattern-match a fixed template: sometimes `HR`,
  sometimes `heart rate`, sometimes `pulse`; sometimes `T`, sometimes `Temperature`; label BP as
  `BP` or `blood pressure`. The synonym map in the extraction proposal (Rule A) lists the accepted
  variants — stay within them but rotate.
- Keep every allowlisted value inside its analyte's clinically real range (the gate's GATE 4 sanity
  bounds are wide, but a real nurse-plausible value is the bar). The **only** deliberately-extreme
  numbers allowed are the unit-scale CBC values, whose extremeness is an artifact of the unit, not
  the physiology.
- The allowlist keys are enumerated in the extraction proposal (Rule A). Off-allowlist values in
  buckets 11–12 must be things with **no** allowlist key, so the correct behavior is silence.
- Bilingual parity: the ZH prose must carry the same numeric values and the same clinical meaning.
  Numbers are language-neutral; the gate operates on `content.en`, but the fixture is only valid if
  ZH matches (this mirrors the bilingual invariant and lets a later renderer test use either side).

## Deliverables (two files)

1. **`EXHIBIT-FLOWSHEET-BLIND-CASES-2026-07-04.json`** — an array of 12 objects, each:
   ```json
   {
     "exhibitRef": "blind_01/assessment",
     "title": { "en": "...", "zh": "..." },
     "content": { "en": "...", "zh": "..." }
   }
   ```
   `exhibitRef` uses a `blind_NN/<slug>` convention so it never collides with a canonical ID. This
   file is what the **extractor** receives (title + content only — no bucket labels).

2. **`EXHIBIT-FLOWSHEET-BLIND-ANSWERKEY-2026-07-04.json`** — the ground truth, held back from the
   extractor, an array of 12 objects:
   ```json
   {
     "exhibitRef": "blind_01/assessment",
     "bucket": "clean_woven | prior_trend | unit_scale | serial | post_intervention | out_of_scope | mixed",
     "expectedKeyed": [ { "label": "hr", "value": "88" } ],
     "expectedExcluded": [ { "label": "creatinine", "value": "1.1", "reason": "prior" } ],
     "expectedContext": [ { "label": "sbp", "context": "post_intervention" } ],
     "expectedSkipSerial": false,
     "expectedOutOfScope": [ "lithium 1.4", "eGFR 38" ]
   }
   ```
   The answer key is authored by the **generator** (it knows what it embedded) and is used only at
   adjudication time.

## How the blind batch is run (the test protocol)

1. **Generate** (generator model): produce both files above. The blind cases are **not** in the
   canonical banks, so the gate reads them through its `--blind <cases.json>` mode, which resolves
   `exhibitRef → content.en` directly from the flat cases array (no bank envelope, no adapter). Use
   `--blind`, never `--bank`, for the blind set.
2. **Extract** (extractor model, ≠ generator): receive `BLIND-CASES` (content only), emit
   `EXHIBIT-FLOWSHEET-BLIND-EXTRACTION-2026-07-04.json` in the amended record shape.
3. **Gate** (deterministic): run `exhibit-flowsheet-gate.ts` over the extraction against the
   blind-cases source. Record FAIL/WARN counts.
4. **Adjudicate** (Claude + answer key): compare the extraction to `BLIND-ANSWERKEY`. The gate
   catches containment/unit/shape errors; the answer key catches *selection* errors the gate can't
   see (did it key the current value vs the prior one; did it correctly stay silent on out-of-scope;
   did it tag post-intervention rather than exclude). Report a confusion count per bucket.

## Success criteria

- **Gate-level:** zero FAIL on the clean and correctly-handled buckets; the unit-scale bucket must
  produce a GATE 4 WARN **iff** the extractor stamped a wrong unit (a correct `sourceUnit` should
  pass clean — that is the whole point of the Rule C fix).
- **Selection-level (answer key):** ≥ the bar we set for the real migration on prior/trend selection
  and out-of-scope silence. Since these are unseen, this is the number that actually predicts the
  232-panel migration's reliability. A high score here is the go signal; a low score says the spec
  overfit the six worst-case panels and needs another iteration before any migration windows.

## What this spec does not do

No canonical bank content is created. The blind cases are disposable fixtures. No schema change, no
renderer, no promotion. The blind files live at repo root with the dated names above and can be
deleted after the test is adjudicated.
