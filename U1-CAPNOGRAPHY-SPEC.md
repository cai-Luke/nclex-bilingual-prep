# U1 · Capnography renderer — implementation spec

**Unit:** U1 (Phase 1). **Type:** renderer (code) + later content lane.
**Depends on:** U0 (done). **Concurrent-safe with:** U2.
**Kind:** `capnography`. **Content ID prefix:** `cap_*`.

Read `AGENTS.md`, `PROJECT-HISTORY.md`, `NCLEX-Question-Schema.md`, and `VISUAL-STIMULI-ROADMAP.md` first; they win on any conflict. **Mirror the `rhythm_strip` module** (`src/visuals/kinds/rhythm_strip/…`) as the reference implementation for file layout, the registry contract, the grid/sampling/scaling approach, and the determinism tests. This spec describes *what* differs from rhythm_strip, not a new architecture.

---

## 1. Scope & gating-rule check

Build a renderer for the analytic EtCO2 capnogram. A capnogram is load-bearing when the **shape of the waveform** is the cue the answer turns on (e.g., distinguishing bronchospasm from a non-obstructive cause). It is *not* load-bearing — and the renderer must not be applied — when the only cue is the EtCO2 number, which a text stem carries fine.

**Committed pattern set (5).** Each is a distinct morphology with a verified physiologic basis (see §6):

| Pattern key | Morphology | Clinical meaning the answer may key on |
|---|---|---|
| `normal` | Rectangular: sharp Phase II upstroke, flat Phase III plateau, quick return to baseline. Sharp alpha angle (~90°). | Adequate ventilation/perfusion. EtCO2 35–45 mmHg. |
| `shark_fin` | Sloped/prolonged Phase II upstroke merging into an up-sloping Phase III with **no flat plateau**; loss of the alpha angle. Severity-scalable. | Obstructive/reactive airway (asthma, COPD, bronchospasm). Steeper slope = more severe. |
| `flat` | No waveform (baseline only, EtCO2 ≈ 0 / absent). | Apnea, esophageal intubation, or circuit disconnection. **Not** cardiac arrest with compressions (that is `rosc`'s precursor — a low attenuated trace, not truly flat). |
| `rosc` | A run of low-amplitude waveforms that **steps up** to higher amplitude part-way through the strip. | Return of spontaneous circulation during CPR — abrupt EtCO2 rise. |
| `rebreathing` | Rectangular morphology but the **inspiratory baseline fails to return to zero** (elevated baseline / raised beta angle). | CO2 rebreathing — exhausted soda lime, faulty inspiratory/expiratory valve. |

**Deferred — do not build as morphologies (decorative trap):** `hypoventilation` and `hyperventilation`. Their cue is the EtCO2 number plus amplitude, with a rectangular ("crisp") waveform — the morphology is not the diagnostic point. If a question needs them, it is a `vitals_trend`/number cue or a text stem, not a capnogram. Record this decision; do not let the content lane request them.

---

## 2. Spec shape

Append **one single line** to the union in `src/visuals/types.ts` (this is the only shared touch-point; keep it append-only so U1/U2 stay parallel-safe):

```ts
// src/visuals/types.ts  (append only)
export type VisualSpec =
  | RhythmStripSpec
  | CapnographySpec        // ← U1 adds exactly this line
  /* | … future kinds, one line each */ ;
```

Define the spec in the kind module (not inline in the union file):

```ts
// src/visuals/kinds/capnography/types.ts
export interface CapnographySpec {
  kind: 'capnography';
  pattern: 'normal' | 'shark_fin' | 'flat' | 'rosc' | 'rebreathing';
  /** Plateau EtCO2 in mmHg. The number rendered on the strip. */
  etco2: number;
  /** Breaths per minute; sets cycle period along the time axis. */
  respiratoryRate: number;
  /** Seconds of trace to render (sets x-axis span). Default 15. */
  durationSec?: number;
  /**
   * shark_fin only: 0..1 obstruction severity.
   * Controls Phase II slope and Phase III up-slope (loss of plateau).
   */
  severity?: number;
  /**
   * rebreathing only: inspiratory baseline offset in mmHg (> 0).
   * The baseline the waveform returns to instead of 0.
   */
  baselineEtco2?: number;
  /**
   * rosc only: { lowEtco2, highEtco2, stepAtSec } — amplitude before/after
   * the step-up and where along the strip the rise occurs.
   */
  rosc?: { lowEtco2: number; highEtco2: number; stepAtSec: number };
}
```

Rationale for richer params than the draft's single `pattern` field: morphology alone is ambiguous (a shark-fin with EtCO2 30 vs 55 reads differently; a `rosc` strip needs the before/after levels and the step time; `rebreathing` needs the baseline offset that *is* the finding). Keep optional sub-objects scoped per pattern so `validate` can reject cross-pattern misuse.

---

## 3. `validate(spec)`

Reject (don't clamp) anything that could render a clinically misleading strip:

- `etco2` finite, `0 ≤ etco2 ≤ 150`. For `pattern: 'flat'`, require `etco2 === 0`.
- `respiratoryRate` finite, `4 ≤ rr ≤ 60`.
- `durationSec` (if present) `5 ≤ d ≤ 60`.
- `severity` present **iff** `pattern === 'shark_fin'`; range `0.15 ≤ severity ≤ 1`. The floor guarantees a visibly sloped fin; a `severity` below it would render near-normal and defeat the morphology. (Borderline-but-valid severities are still the audit's call per §5.)
- `baselineEtco2` present **iff** `pattern === 'rebreathing'`; `0 < baselineEtco2 < etco2`.
- `rosc` object present **iff** `pattern === 'rosc'`; `0 < lowEtco2 < highEtco2 ≤ 150`, `0 < stepAtSec < durationSec`.
- No pattern-specific field set for the wrong pattern (this is the main misuse vector). Surface a clear reason string per the existing `validate-bank` convention.

---

## 4. `renderSvg(spec)`

Deterministic, pure function of the spec — **byte-identical** output for identical input, same as rhythm_strip. Reuse rhythm_strip's grid primitive and time-axis sampling; capnography is a single analytic channel on the same mm grid.

Model one breath cycle as a piecewise function over normalized cycle time `u ∈ [0,1)`, period `= 60 / respiratoryRate` seconds, sampled at the same rate rhythm_strip uses:

- **`normal`** — Phase I baseline at 0; Phase II near-vertical upstroke to `etco2`; Phase III flat at `etco2` (a faint physiologic up-slope of ~1–2 mmHg is acceptable and more realistic, but keep it deterministic); Phase 0 near-vertical drop to 0. Sharp alpha angle.
- **`shark_fin`** — Phase II upstroke sloped (not vertical), Phase III continues sloping upward to `etco2` with **no flat segment**; alpha angle opened up. `severity` maps monotonically to upstroke shallowness / loss of plateau. Higher severity → more triangular.
- **`flat`** — straight line at 0 across the whole strip.
- **`rosc`** — render `lowEtco2`-amplitude `normal`-ish cycles for `t < stepAtSec`, then `highEtco2`-amplitude cycles after. The step is the cue; make it visible.
- **`rebreathing`** — `normal` morphology but every cycle returns to `baselineEtco2`, not 0 (raised beta angle / elevated baseline).

Render the EtCO2 numeric value as a label on the strip (consistent with how rhythm_strip labels rate), and the gridlines/time axis so RR is countable from the trace. Use the shared color/theme tokens; no new palette.

---

## 5. `selfCheck(spec, question)` — render-vs-label fidelity **and morphology fidelity**

Waveforms usually skip `selfCheck`, but capnography earns one because two things must hold mechanically: the *number* must match the *shape*, and **the shape must actually be the pattern it claims to be**. Morphology fidelity is geometrically computable, so it belongs here as a machine gate — not in a per-item eyeball pass. Sample the rendered series and assert:

**Number↔shape (level/amplitude):**
- The plateau height sampled at end-expiration equals `spec.etco2` within sampling tolerance — for `flat`, the series is identically 0.
- `rosc`: post-step plateau equals `highEtco2`, pre-step equals `lowEtco2`.
- `rebreathing`: inspiratory minimum equals `baselineEtco2`, not 0.

**Morphology discriminators (each pattern has a geometric signature; assert the keyed pattern's and assert the *absence* of the others' where they'd conflict):**
- `normal`: a contiguous **flat plateau run** at ≈`etco2` of at least a defined fraction of expiration (e.g., ≥40% of the cycle's expiratory phase, within tolerance) **and** a sharp Phase II upstroke (rise to plateau within a short upstroke window). Sharp alpha angle.
- `shark_fin`: **no** flat plateau run meeting the `normal` threshold — Phase II/III is a continuous up-slope to `etco2` — **and** a sloped (non-vertical) upstroke. This is the discriminator that fails a degraded "half-shark-fin": a strip that has *both* a sloped upstroke and a flat plateau satisfies neither pattern and is a build failure.
- `flat`: series ≡ 0 (already covered above).
- `rosc`: a single amplitude step is present at `stepAtSec` (pre/post amplitudes differ as keyed).
- `rebreathing`: every inspiratory trough sits at `baselineEtco2` > 0.

A degraded renderer (drift toward an intermediate shape) now fails `selfCheck` at build time across the whole bank at once, rather than relying on a reviewer to eyeball each strip. What `selfCheck` still cannot judge is whether the *params chosen* instantiate the pattern unambiguously (e.g., a `shark_fin` with `severity: 0.02` passes the "no flat plateau" test yet renders near-normal); that narrow residual is the only morphology concern left to the audit (see audit spec, cap-battery). Morphology→**meaning** (clinical truth) remains a human-review + fixture responsibility (§6).

---

## 6. Accuracy watch-item (the real risk)

The morphology→clinical-meaning mapping is what keys answers, and a subtly wrong shape teaches the wrong thing. Verified against authoritative sources (EMS1/Masimo quick-reference, LITFL, NUEM, Don't Forget the Bubbles, Medtronic via Med Alliance):

- Normal capnogram is rectangular: sharp upstroke, flat alveolar plateau, quick return to baseline; EtCO2 35–45 mmHg.
- Shark-fin = sloped/prolonged Phase II with loss of the flat plateau and opened alpha angle, caused by obstruction (asthma/COPD/bronchospasm); the steeper the slope the worse the obstruction. A crisp upright waveform means *no* bronchospasm — the respiratory problem is something else. Use this as a distractor-design anchor.
- Flat trace = no CO2: apnea, esophageal placement, or disconnection. Cardiac arrest with compressions yields a *low attenuated* trace, not a flat line — keep that out of `flat` and inside the `rosc` precursor.
- ROSC during CPR shows an abrupt EtCO2 rise — the `rosc` step-up.
- Rebreathing raises the *baseline* (waveform fails to return to zero), classically exhausted soda lime or a faulty valve.

**Gate before any pattern keys an answer:** the content lane must cite the morphology→meaning claim, and the renderer's fixture tests must lock each pattern's shape. Do not let a `shark_fin` strip be reused decoratively on a non-obstructive question.

---

## 7. Tests

- Add `capnography` to the **generic conformance harness** U0 built (it should pick the kind up from the registry automatically once registered).
- **Determinism:** byte-identical SVG for a fixed spec across runs (mirror rhythm_strip's determinism test).
- **Scaling:** EtCO2 and RR changes move the rendered plateau/period as expected.
- **Per-pattern fixtures:** one locked fixture per pattern asserting the diagnostic feature (e.g., `shark_fin` has no flat Phase III segment; `rebreathing` baseline > 0; `flat` series ≡ 0; `rosc` pre/post-step amplitudes). Fixtures lock the *canonical* shape; `selfCheck`'s discriminators (§5) guard every *instance*, so a drifted renderer fails build-wide, not just on the fixtures.
- **`validate` rejection cases:** wrong pattern-specific field set, `flat` with nonzero etco2, out-of-range RR/etco2.
- `selfCheck` pass/fail cases.
- `validate-bank`, `coverage-report` (must now break out a `capnography` count), `build`, `test-visuals` all green.

---

## 8. Registration & wiring (follow U0's barrel pattern)

1. Create `src/visuals/kinds/capnography/` with `index.ts` (the module exposing `{ validate, renderSvg, selfCheck }`), `types.ts`, render helpers.
2. Register the kind in `src/visuals/kinds/index.ts` (the registration barrel).
3. Append the **one** union line in `src/visuals/types.ts`.
4. Confirm `VisualStimulus.tsx` routes `kind: 'capnography'` through the registry with no special-casing.
5. Update `NCLEX-Question-Schema.md` "Adding a new visual kind" checklist entry and `PROJECT-HISTORY.md`; mark U1's renderer sub-job done in the ledger.

---

## 9. Content lane (separate job, after the renderer lands)

- ID prefix `cap_*`, disjoint from all other lanes (collision-proof, same scheme as rhythm-strip lanes).
- Strictest-tier review still applies (airway/respiratory judgment). Each item routes through raw → review → promote → ledger.
- High-yield item targets: bronchospasm recognition (shark-fin vs crisp), esophageal vs tracheal placement (`flat` immediately after intubation), ROSC recognition during a code, rebreathing troubleshooting.
- Do **not** generate items whose only cue is the EtCO2 number — those belong in text or `vitals_trend`.
