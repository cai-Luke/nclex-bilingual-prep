# VISUAL-STIMULI-ROADMAP.md

Revised future-work roadmap for deterministic, data-derived clinical visuals. Supersedes the earlier draft of the same name. Read `AGENTS.md`, `PROJECT-HISTORY.md`, and `NCLEX-Question-Schema.md` first; those win on any conflict.

## Guiding principle

Adopt the original draft's core rule — *if clinical info can be structured data, render it deterministically instead of sourcing an asset* — with one sharpening filter applied to every candidate:

> **Does the clinical reasoning depend on something a deterministic render can faithfully carry?**

- **Yes, and it's an analytic curve** → waveform renderer (rhythm-strip family).
- **Yes, and it's plotted/tabulated values** → chart/table/label renderer. Low render-risk, but the rendered artifact and the keyed answer must be **arithmetically consistent** (totals, concentrations, derived values computed, not asserted).
- **No — the cue is tissue depth, tone, color, or appearance** → *not* on this track. A synthetic SVG can only carry a cartoon convention we invented; "reading" it teaches our icon set, not the real finding. Use text scenarios or curated licensed photos through a separate pipeline.

**Gating rule (applies to every candidate kind):** build a renderer only for cues that are *both* load-bearing *and* faithfully carriable. A render is load-bearing when removing it makes the question unanswerable or changes its difficulty. If a kind can be used decoratively, that is a reason **against** building it, not a neutral — the generation bots treat any available tool as an invitation and will apply it to questions that don't need it, adding visual noise and implying the image carries information it doesn't. On an already-polished product, a decorative-capable renderer is a net negative.

## What changed from the draft

- **Reordered:** chart/table/label family pulled ahead of fetal monitoring. It's the highest ROI (pharm + labs are huge tested areas), lowest render-risk, and two reusable primitives (a chart, a table/form) de-risk several kinds at once.
- **Fetal monitoring reclassified** from "almost direct" to a real multi-window project. The diagnostic content is the temporal phase relationship between two synchronized channels (early decel mirrors the contraction; late decel is offset after the peak; variable is abrupt/uncoupled) plus variability categories. That's the subtlest waveform here, not a quick win.
- **Pressure-injury staging: cut** from the deterministic track. Staging is a tissue-depth/appearance judgment; a synthetic wound can't carry it. Keep as text scenarios or licensed photos.
- **Fundal assessment: cut** (was deferred). The only renderable cue (displacement) is conveyed fine in text, while tone — the actual diagnostic cue — can't be rendered; the kind is decorative and would attract misuse under the gating rule above.
- **Device/equipment tier (from GPT) split, not adopted wholesale:** accepted as *device settings screens* (PCA / infusion / enteral pump settings — the numbers are the cue, arithmetic-checkable, reuses the table/form primitive); chest-tube collection systems flagged borderline (static cues only, motion/temporal cues forbidden); pictorial device drawings (O2 devices, trach, IV tubing, enteral setups) cut as appearance/component recognition.
- **Added a foundational refactor** (shared renderer registry) as the unblock-everything first job.
- **Dropped the "estimated content potential" numbers** — they were invented. `coverage-report` drives what gets generated.

## Architecture decision to lock in first

Only 3 items currently use the visual artifact, in a segregated JSON, so the artifact shape is **effectively free to change right now**. Do not preserve the current shape for backward-compatibility's sake; reshape it to the registry model below and migrate the 3 items in the same pass.

Decide and record in `NCLEX-Question-Schema.md`:
1. **Registry model.** Each visual `kind` is a self-contained module exposing `{ validate(spec), renderSvg(spec), selfCheck?(spec, question) }` and registering under its `kind`. `validate-bank` and `coverage-report` iterate the registry instead of special-casing each kind. The compile-time spec union is assembled in one barrel file with **append-only** single-line additions — this is the only shared touch-point, which is what keeps a ten-member union parallel-safe.
2. **`selfCheck` hook.** Optional per-kind function asserting render-vs-answer arithmetic invariants (e.g., an I&O sheet's totals, a label's concentration → computed dose). Charts/tables/labels should use it; waveforms generally won't.
3. **Where visual items live.** Recommendation: a dedicated `banks/visual-canonical.json` (or per-kind canonical banks) during active development for manageability, since IDs are global and the bank file is just a label — items can be redistributed into topical banks later at zero cost. Confirm before building.

## Parallelization & assignment map

Phase 0 is serial and must land first (it touches shared schema/validation/coverage). After that, each kind is an independent vertical slice; two slices are concurrent-safe when they touch different files (the registry barrel line is append-only, so it is not a real collision). Per kind there are two sub-jobs: **renderer build** (code; suits the implementation agent) and **content generation** (content lane; can't start until the renderer exists), each followed by human review through the existing raw→review→promote→ledger pipeline.

| Unit | Work | Depends on | Concurrent-safe with | Window estimate |
|---|---|---|---|---|
| U0 | Renderer registry refactor + migrate 3 existing items | — | (serial; run alone) | ~1 window |
| U1 | Capnography renderer | U0 | U2 | ~1 window |
| U2 | Chart primitive + `vitals_trend` renderer | U0 | U1, then U4 | ~1–1.5 windows |
| U3 | `lab_trend` renderer | U2 (chart primitive) | U4, U5 | ~0.5–1 window |
| U4 | Table/form primitive + `mar` renderer | U0 | U3, U2 | ~1–1.5 windows |
| U5 | `io_record` renderer (+ totals selfCheck) | U4 (table primitive) | U3 | ~0.5 window |
| U6 | `medication_label` renderer (+ dose selfCheck) | U4 (table primitive) | U3, U5 | ~0.5–1 window |
| U9 | `device_screen` renderer (PCA / infusion / enteral settings) | U4 (table primitive) | U3, U5, U6 | ~1 window |
| U7 | Fetal monitoring (dual-channel) | U0 | anything | **2–3 windows** |
| U8 | `burn_map` renderer (+ Parkland/Rule-of-Nines selfCheck) | U0 | anything | ~1 window |

Suggested split once U0 is in: hand U1 to one agent and U2 to the other to run in parallel; then U4 alongside U3; etc. Keep one agent on a slice end-to-end so file ownership is clean within a window. Content-generation lanes (the questions themselves) partition by `kind` with disjoint ID prefixes (`cap_*`, `vit_*`, `lab_*`, `mar_*`, `io_*`, `medlbl_*`, `fhr_*`, `burn_*`), same collision-proof scheme as the rhythm-strip lanes.

---

## Phase 0 — Foundation (serial)

### U0 · Renderer registry refactor — ✅ DONE (2026-06-07)
**Type:** refactor (code). **Depends on:** nothing. **Run alone.**

- ✅ Extracted the `rhythm_strip` renderer behind the registry contract `{ validate, renderSvg, selfCheck? }` under `src/visuals/` (`registry.ts`, `types.ts` union, `kinds/`, `primitives/`, `VisualStimulus.tsx`, `kinds/index.ts` registration barrel).
- ✅ `scripts/validate-bank.ts` (via schema) and `scripts/coverage-report.ts` iterate the registry; coverage-report breaks visual counts down by `kind`.
- ✅ Spec union assembled in one barrel (`src/visuals/types.ts`); append-only rule documented in `NCLEX-Question-Schema.md` ("Adding a new visual kind" checklist).
- ✅ Migrated the 3 existing items to `banks/visual-canonical.json` (kept the on-disk shape and `schemaVersion 1.2` — behavior-preserving; shape was *free* to change but there was no functional need); updated `NCLEX-Question-Schema.md`.
- ✅ Tests: generic conformance harness over all registered kinds, registry-mechanics test, byte-identical SVG + reason parity for the 3 live items; rhythm-strip determinism/scaling tests still pass.
- ✅ Done: `validate-bank`, `coverage-report`, `build`, `test-visuals` all green; history + schema doc + ledger updated.

---

## Phase 1 — Waveform that fits directly

### U1 · Capnography
**Type:** renderer (code) + later content lane. **Depends on:** U0. **Concurrent with:** U2.

- Analytic EtCO2 morphology, reusing rhythm-strip's grid/sampling approach.
- Named patterns: normal rectangular, shark-fin (bronchospasm), flat/absent (apnea or esophageal placement), low-then-returning (ROSC), elevated baseline (rebreathing).
- Params need more than `pattern`: baseline EtCO2 (mmHg), respiratory rate, plateau/upstroke shape. The draft's single-field param is too thin.
- **Accuracy watch-item:** the morphology→clinical-meaning mapping (e.g., shark-fin = obstructive). Verify against authoritative sources before any pattern keys an answer.

---

## Phase 2 — Charts / tables / labels (highest ROI, low render-risk)

Two reusable primitives unlock this whole tier. Build each primitive *reusably* inside its first consumer; later consumers are then small.

### U2 · Chart primitive + `vitals_trend`
**Type:** renderer (code). **Depends on:** U0. **Concurrent with:** U1.

- Reusable line/trend chart primitive (axes, gridlines, multiple series, optional reference bands).
- `vitals_trend`: HR / BP / RR / SpO2 / temp over N hours.
- Question targets: sepsis recognition, shock progression, postoperative deterioration, response to intervention.
- **Accuracy watch-item:** plotted points must equal the data array, and any trend the answer turns on (e.g., MAP trending down) must be real in the rendered series. `selfCheck` asserts series→render fidelity.

### U3 · `lab_trend`
**Type:** renderer (code). **Depends on:** U2 (chart primitive). **Concurrent with:** U4, U5.

- Reuses the chart primitive plus a small table view for serial labs.
- Targets: DKA, SIADH, AKI, electrolyte disorders, tumor lysis.
- **Accuracy watch-item:** reference ranges and units shown must be current and correct; flags (H/L) must match the values rendered.

### U4 · Table/form primitive + `mar`
**Type:** renderer (code). **Depends on:** U0. **Concurrent with:** U3, U2.

- Reusable table/form primitive (rows, columns, header, time grid) styled as nursing documentation.
- `mar`: medication, dose, route, frequency, scheduled/given times.
- Targets: unsafe orders, missed doses, adverse-effect timing, prioritization.
- **Accuracy watch-item:** strictest tier per AGENTS.md (medication/dose/prioritization). Drug, dose, route, frequency must be internally consistent and clinically valid; the unsafe element must be the one the answer flags, with nothing accidentally unsafe elsewhere.

### U5 · `io_record`
**Type:** renderer (code). **Depends on:** U4 (table primitive). **Concurrent with:** U3.

- Reuses table/form primitive.
- Targets: fluid overload, dehydration, AKI, treatment evaluation.
- **Accuracy watch-item:** `selfCheck` must compute intake/output totals and net balance and assert they equal what the answer relies on. Never hand-key a total.

### U6 · `medication_label`
**Type:** renderer (code). **Depends on:** U4 (table primitive). **Concurrent with:** U3, U5.

- Synthetic vial / IV bag / infusion labels.
- Targets: dosage and infusion calculations, verification, high-alert safety.
- **Accuracy watch-item:** `selfCheck` must verify concentration × volume / rate arithmetic resolves to the keyed answer exactly. This is a pure-math correctness gate; treat a mismatch as a build failure, not a content note.

### U9 · `device_screen`
**Type:** renderer (code). **Depends on:** U4 (table primitive). **Concurrent with:** U3, U5, U6.

- Renders a device **settings display**, not a picture of a device: PCA pumps, infusion pumps, enteral feeding pumps. Covers dose, lockout interval, basal rate, 1-/4-hour limits, attempts vs delivered, mL/hr, volume infused.
- Targets: unsafe pump settings, PCA-by-proxy / family-controlled analgesia danger, lockout/limit appropriateness, rate verification.
- Reuses the table/form primitive; layout is a settings panel rather than a chart.
- **Accuracy watch-item:** strictest tier (high-alert infusions). `selfCheck` asserts that any computed value the answer turns on (delivered dose over interval, hourly total) resolves exactly; settings shown must be internally consistent, and the unsafe element must be the one the answer flags.

### Borderline — needs decision before building: chest-tube collection systems
Partially renderable: fluid level/output, chamber identification, and suction-column height are static and load-bearing. But the highest-yield cues — tidaling with respiration, continuous-vs-intermittent bubbling, air leak — are motion/temporal and cannot be carried honestly by a static SVG; bubble glyphs would be the icon-set trap. If pursued, scope hard to the static cues and explicitly forbid keying answers to tidaling or air-leak. Not a committed unit.

---

## Phase 3 — Fetal monitoring (multi-window project)

### U7 · `fetal_monitoring` (dual-channel)
**Type:** renderer (code), large. **Depends on:** U0. **Concurrent with:** anything (own files).

- Two synchronized channels: FHR and uterine activity, drawn in correct temporal phase.
- Must convey: baseline FHR, variability category (absent / minimal / moderate / marked), accelerations, and deceleration type **by its phase relationship to the contraction** — early (mirrors), late (offset after peak), variable (abrupt, uncoupled), prolonged.
- Budget 2–3 windows. Split sensibly: window 1 = dual-channel grid + contraction curve + baseline FHR with variability rendering; window 2 = deceleration phase logic + accelerations; window 3 = polish, tests, example items.
- **Accuracy watch-item:** the phase relationship is the entire diagnostic point — a late decel rendered in the wrong phase teaches the wrong category. Test phase offsets explicitly against the contraction timing. This is the highest-yield OB content and the easiest to render subtly wrong.

---

## Phase 4 — Stylized diagram (the one survivor)

### U8 · `burn_map`
**Type:** renderer (code). **Depends on:** U0. **Concurrent with:** anything.

- Schematic body with shaded regions; fixed Rule-of-Nines percentages; Parkland arithmetic.
- Make **adult vs pediatric** proportions an explicit parameter — they differ, and getting the wrong chart silently corrupts the %TBSA.
- Targets: Rule of Nines, Parkland formula, severity classification.
- **Accuracy watch-item:** `selfCheck` computes %TBSA from shaded regions and Parkland volume from %TBSA + weight, asserting both match the keyed answer.

---

## Off the deterministic track (do not build here)

- **Pressure-injury staging.** Cut. Tissue-depth/appearance judgment; a synthetic wound can't carry it. Text scenarios or curated licensed photos via the separate acquisition/review pipeline the project reserves.
- **Fundal assessment.** Cut. Displacement is renderable but conveyed fine in text; tone is the real cue and isn't renderable, so the kind is decorative and fails the gating rule.
- **Pictorial device/equipment drawings** — oxygen delivery devices, trach setups, IV tubing setups, enteral feeding setups. Cut. These are appearance/component recognition; the testable content is a fact about the *named* device that the stem already states. (Device *settings screens* are different and are covered by U9.)
- All original non-goals stand: no AI-generated medical photos, radiology, dermatology, wound photos, stock scenarios, or anything needing licensing.

## Recommended order

U0 → (U1 ∥ U2) → (U3 ∥ U4) → (U5 ∥ U6 ∥ U9) → U8 → U7 (when a multi-window block is available).

Fetal monitoring is last not because it's low value — it's the highest-yield item here — but because it's the largest and should run when you can give it consecutive windows rather than squeezing it.
