# SPEC: Deterministic Data-Derived Rhythm-Strip Visuals + Concurrent Question Generation

Status: proposed / implementation starting. Read `AGENTS.md`, `PROJECT-HISTORY.md`, and `NCLEX-Question-Schema.md` before acting. `NCLEX-Question-Schema.md` is the schema source of truth; this spec proposes an addition to it and must not contradict it. If anything here conflicts with those files, those files win and the conflict should be surfaced rather than worked around.

## 1. Goal

Add visual-dependent practice items to the bank using **deterministic, data-derived SVG visuals rendered from inspectable parameters** — starting with single-lead ECG rhythm strips. The visual is generated from data stored in the question or exhibit itself; there are no raster image assets and no AI-generated imagery, satisfying the AGENTS.md rule: *"Do not AI-generate medical images. If image-dependent items are ever added, use curated licensed real images or deterministic data-derived visuals with human verification."*

The review framing matters: these are not "generated images" that become evidence. They are inspectable clinical visual data. Reviewers must check the input parameters, the rendered strip, and the keyed clinical reasoning before any item is treated as reviewed study material.

This unlocks the highest-yield NCLEX visual content (dysrhythmia recognition, priority action, and findings-matrix items keyed to a strip) without sourcing or licensing photographs.

## 2. Key architecture decisions (review these first)

These are the load-bearing calls. Confirm them before implementation.

1. **Visual as an optional stimulus on existing item types — not a new item type.** Add an optional `visual` field to the question schema that renders *above* the stem. A rhythm-strip question stays a normal `multiple_choice`, `select_all`, or `matrix` item with a strip attached. This deliberately avoids `highlight`/`bowtie`, which `PROJECT-HISTORY.md` lists as out of scope until a future schema bump, and keeps the change small and reversible per AGENTS.md working style.
2. **The visual is data, not a file.** The question JSON stores a typed `visual` spec (rhythm class, rate, intervals, etc.). A pure, deterministic renderer draws the SVG at runtime. No files in `public/`, no bundle bloat, `file://`-safe, and human-verifiable because the parameters are right there in the JSON.
3. **Determinism is mandatory.** The same `visual` spec must always render the identical SVG. Any "natural" variation (baseline wander, beat-to-beat R-R jitter for irregular rhythms) must be derived from an explicit integer `seed` in the spec, never from `Math.random()` or wall-clock time. This is what makes review and regression testing possible.
4. **Synthetic-idealized first; real-waveform import is a later, optional lane.** v1 generates clean idealized morphology from parameters. A future extension may render digitized real waveforms (e.g., PhysioNet PTB-XL / MIT-BIH samples) as polylines; the same renderer interface should accept a raw `samples` array so that path is non-breaking. Do not build the real-waveform importer in this pass.
5. **This is a schema `1.2` bump.** The current schema documentation says shape changes require a version bump. Existing schema `1.0` and `1.1` banks remain supported; new bundled banks with visuals should declare `meta.schemaVersion: "1.2"`.
6. **Case-study exhibits remain text-first.** Exhibits keep their required `title` and `content`; `visual` is an optional addition to an exhibit, not a replacement for chart text. This avoids a larger exhibit-shape migration.

## 3. Scope

### In scope (this spec)
- One-time infra (Phase 0): schema `visual` field, the rhythm-strip renderer, validation, coverage counting, a few example items.
- Repeatable content work (Phase 1+): concurrent generation lanes producing reviewed rhythm-strip question batches.

### Out of scope
- `highlight` / `bowtie` item types and any image-hotspot interaction.
- Raster/photographic images of any kind (wounds, rashes, radiographs). Those are a separate, curated-licensed-image effort if ever pursued.
- Real-waveform (PhysioNet) ingestion.
- Any runtime API/model call. The runtime stays static and offline.
- App architecture changes, new build steps that break `file://`, or new CSS frameworks (plain CSS in `src/styles.css` only).

## 4. Phase 0 — infra (serial, coding agent only)

This must land and pass verification **before** any concurrent content generation begins, because the content lanes depend on the schema and renderer existing.

### 4.1 Schema addition

Read `NCLEX-Question-Schema.md` and propose the canonical wording there. The intended shape: an optional `visual` field available on `multiple_choice`, `select_all`, and `matrix` items, and on `case_study` exhibits. Model it as a discriminated union keyed by `kind` so future visual types (12-lead, capnography, fetal monitoring, real-waveform) extend it cleanly.

```ts
// First, and for now only, variant:
interface RhythmStripVisual {
  kind: "rhythm_strip";
  rhythm: RhythmClass;        // see §4.3 enum
  rateBpm: number;            // ventricular rate; see notes per rhythm
  durationSec?: number;       // default 6
  seed?: number;              // default 0; required if any stochastic feature is on
  calibrationPulse?: boolean; // default true; draws a 1 mV reference pulse
  atrialRateBpm?: number;     // optional for atrial flutter / AV dissociation visual tuning
  conductionRatio?: number;   // optional fixed atrial-to-ventricular ratio for flutter-like strips
  // Optional fine controls (all default to the rhythm's canonical value):
  prSec?: number;
  qrsSec?: number;
  qtSec?: number;
  caption?: { en: string; zh?: string }; // optional label, NOT the answer
}

type QuestionVisual = RhythmStripVisual; // union grows later
```

Rules:
- `visual` is optional and additive. Existing banks and schema v1.x items without it must validate and render unchanged.
- Bump the current schema to `1.2` while continuing to accept `1.0` and `1.1` banks. Keep schema changes "rare and deliberate" — one field, one renderer.
- The `caption` must never encode the answer (e.g., do not caption a strip "Atrial Fibrillation" on a "name this rhythm" item). Validation should not try to enforce this, but the generation prompt (§5.3) and review must.

Update `src/types.ts`, `src/schema.ts`, and `scripts/validate-bank.ts` to validate the new field. Validation should check: `kind` is known, `rhythm` is in the enum, `rateBpm` is within a sane range (20–300), `durationSec` in 3–12, intervals (if present) are positive and physiologically bounded, and `seed` is an integer.

### 4.2 Renderer

Create `src/visuals/rhythmStrip.ts` (pure, no React, no DOM) and a thin React wrapper `src/visuals/RhythmStrip.tsx`.

`renderRhythmStripSvg(spec: RhythmStripVisual): string` returns a self-contained SVG string (also usable from Node for tests). Requirements:

**ECG paper scaling (get this exactly right — it is the clinical correctness anchor):**
- Paper speed 25 mm/s, gain 10 mm/mV.
- Small box = 1 mm = 0.04 s (horizontal), 0.1 mV (vertical).
- Large box = 5 mm = 0.2 s (horizontal), 0.5 mV (vertical).
- Pick `pxPerMm` (suggest 6) and derive everything: `pxPerSec = pxPerMm * 25`, `pxPerMv = pxPerMm * 10`. A "PR = 0.20 s" parameter must therefore render as exactly one large box wide. Add a self-check in tests that measures rendered offsets back to seconds and asserts they match the spec within one small box.
- Draw the standard pink grid (minor lines every small box, bold lines every large box) and optionally a 1 mV calibration pulse at the left.

**Beat composition (idealized morphology):**
- Build the trace as a sequence of beats over `durationSec`, each beat composed of P wave, QRS complex, and T wave placed at time offsets computed from the rhythm parameters, then sampled to an SVG polyline at fixed sample spacing (e.g., 2 ms).
- Model P and T as smooth bumps (Gaussian or raised-cosine) and QRS as a sharp composite (small Q dip, tall R spike, S dip) scaled in mV. Expose width/amplitude per component so each rhythm class can set its own morphology.
- R-R interval seconds = `60 / rateBpm`. For irregular rhythms, draw each R-R from a seeded deterministic generator around the mean (see §4.3).
- No randomness without `seed`. Use a small seeded PRNG (e.g., mulberry32) seeded by `spec.seed ?? 0`.

**Theming/output:**
- SVG only, no external fonts or images, colors inline or via the existing CSS-variable approach used elsewhere; must render identically under `file://`.
- Deterministic output: identical spec → byte-identical SVG (modulo float formatting you control). A snapshot test should pin this.

`RhythmStrip.tsx` renders the SVG and is dropped into the question view above the stem wherever `question.visual?.kind === "rhythm_strip"`. Wire it into `src/App.tsx` rendering for the three supported item types and into `case_study` exhibit rendering. Keep styling in `src/styles.css`.

### 4.3 Rhythm class scaffold — VERIFY BEFORE USE

`RhythmClass` enum and the canonical parameter defaults below are a **starting scaffold of well-established textbook characteristics, not verified study content.** Per AGENTS.md, be especially strict with clinical material: before any rhythm is used to key an answer, verify its defining criteria against authoritative sources (current AHA/ACLS materials, an established ECG reference) and record the check in the audit report. The renderer is allowed to draw these by default; the *clinical correctness of the resulting questions* is gated by human review.

| RhythmClass | Defining features to render | Rate (bpm) | P waves | PR | QRS | Regularity |
|---|---|---|---|---|---|---|
| `sinus` | upright P before every QRS | 60–100 | present, 1:1 | 0.12–0.20 | <0.12 | regular |
| `sinus_brady` | as sinus | <60 | present, 1:1 | 0.12–0.20 | <0.12 | regular |
| `sinus_tach` | as sinus | 100–150 | present, 1:1 | 0.12–0.20 | <0.12 | regular |
| `afib` | no organized P, fibrillatory baseline | variable | absent | n/a | <0.12 | irregularly irregular |
| `aflutter` | sawtooth F waves | atrial ~250–350; vent. per ratio | flutter waves | n/a | <0.12 | often regular (fixed ratio) |
| `svt` | narrow-complex, P often hidden | 150–250 | usually not visible | n/a | <0.12 | regular |
| `avb_1` | constant prolonged PR, every P conducts | 60–100 | present, 1:1 | >0.20 constant | <0.12 | regular |
| `avb_2_mobitz1` | progressive PR lengthening then a dropped QRS | atrial > vent. | present, some not conducted | progressively lengthening | <0.12 | irregular (grouped) |
| `avb_2_mobitz2` | constant PR with intermittent dropped QRS | atrial > vent. | present, some not conducted | constant | usually <0.12 | regular P-P, irregular R-R |
| `avb_3` | AV dissociation; independent P and QRS | atrial > vent. escape | present, unrelated to QRS | none consistent | escape-dependent | regular P-P and R-R, dissociated |
| `pvc` | wide bizarre premature QRS, no preceding P | underlying + ectopy | absent before ectopic | n/a | wide ectopic | irregular at ectopy |
| `vtach` | wide-complex, no visible P | 100–250 | not visible | n/a | wide | regular |
| `vfib` | chaotic, no organized complexes | n/a | none | n/a | none | chaotic |
| `asystole` | flat line / no organized activity | ~0 | none | n/a | none | flat |

For `vfib`/`asystole`, `rateBpm` is nominal; the renderer should ignore it and draw the characteristic tracing. Document each rhythm's exact rendered morphology choices in code comments so a reviewer can map render → criteria.

### 4.4 Coverage + verification

- Extend `scripts/coverage-report.ts` to count items carrying a `visual`, broken down by `rhythm` class, so generation lanes can target gaps.
- Add a renderer unit/snapshot test (Node, no browser) asserting: scaling correctness (rendered interval → seconds within one small box), determinism (same spec → identical SVG), and that each `RhythmClass` produces output without throwing. Playwright is not installed (per `PROJECT-HISTORY.md`), so do not depend on browser automation. The existing `tsx` runtime is enough for a focused test script.
- Defer reviewed example items unless the pass explicitly includes source-checking. If examples are added, add 2–3 fully reviewed items (one `multiple_choice` "identify the rhythm", one `select_all` "appropriate immediate actions", one `matrix`) into a normal canonical bank as worked references, ledgered like any other content.

### 4.5 Phase 0 done criteria
- `npm run validate-bank -- banks/*.json` passes (existing banks unchanged, new field validated).
- `npm run coverage-report` runs and reports visual counts.
- `npm run build` succeeds. If example visual items have been added, manually double-click-check the built `file://` app.
- Renderer tests pass.
- `NCLEX-Question-Schema.md` and `PROJECT-HISTORY.md` updated. `BANK-REVIEW-LEDGER.md` is updated only if reviewed content is promoted. Schema doc and the portable generation prompt describe the `visual` field before content lanes begin.

## 5. Phase 1+ — concurrent question generation

Once Phase 0 is merged, content generation parallelizes cleanly because each lane only emits JSON (the renderer and schema already exist). The single serialization point is human review at promotion — which is intended.

### 5.1 Lane partitioning

Partition by **rhythm class (or a small group of classes)** so lanes do not produce overlapping content. Suggested initial lanes:
- Lane A: sinus family + AV blocks (`sinus`, `sinus_brady`, `sinus_tach`, `avb_1`, `avb_2_mobitz1`, `avb_2_mobitz2`, `avb_3`)
- Lane B: atrial/supraventricular (`afib`, `aflutter`, `svt`)
- Lane C: ventricular + arrest (`pvc`, `vtach`, `vfib`, `asystole`)

Each lane may run in its own agent session concurrently.

### 5.2 ID and file conventions (collision-proof by construction)

`PROJECT-HISTORY.md` requires globally unique `question.id` across bundled top-level banks. To guarantee no cross-lane collision without coordination:
- Each lane writes to its **own** raw file under `banks/banks-raw/`, never a shared file. Name: `banks-raw/rhythm-<lane>-<YYYY-MM-DD>.json` (e.g., `rhythm-ventricular-2026-06-10.json`).
- Each item id is prefixed per rhythm class: `rhy_<rhythmclass>_<nnn>` (e.g., `rhy_afib_001`, `rhy_vtach_004`). Disjoint prefixes mean lanes cannot collide even if run simultaneously.
- Do not write generated content directly into bundled top-level `banks/*.json`. Raw is untrusted by default (AGENTS.md).

### 5.3 Generation constraints (put in the portable prompt)

- Every item carries a valid `visual.kind === "rhythm_strip"` spec matching the schema; the `rhythm` must be drawn from the lane's assigned classes.
- The strip parameters must be **consistent with the keyed answer.** If the answer is "atrial fibrillation," `rhythm` must be `afib`. If the item asks for a priority action, the rhythm + rate must clinically justify the keyed action.
- `caption` must not reveal the answer.
- Vary `rateBpm` and `seed` across items so strips are not visually identical; keep variation inside the physiologic band for the class.
- Provide bilingual fields (English primary, Chinese scaffold) per existing item conventions.
- Cite the authoritative basis for each clinical claim in the item's rationale/source field, especially for priority/intervention items (AGENTS.md strictness on prioritization and delegation applies).
- Stay within the three supported item types (`multiple_choice`, `select_all`, `matrix`). No `highlight`/`bowtie`.

### 5.4 Review → promote (unchanged pipeline, per lane)

For each raw lane file:
1. Validate: `npm run validate-bank -- banks/banks-raw/<file>.json`.
2. Content review: verify each rhythm's morphology against the rendered strip and against authoritative criteria; verify answer keys, rationales, and bilingual accuracy. Eyeball the rendered SVG (params → picture) for every item.
3. Write an audit report under `audit/<file>.report.md` (mirroring existing audit reports, e.g. the Jun-06 case-study report).
4. Promote reviewed items into the appropriate canonical top-level bank (existing or a new `banks/rhythm-canonical.json` if it warrants its own file), keeping ids globally unique.
5. Delete the raw lane file after merge and record the deleted source in `BANK-REVIEW-LEDGER.md`.
6. Re-run `npm run validate-bank -- banks/*.json`, `npm run coverage-report`, `npm run build`.
7. Update `PROJECT-HISTORY.md` with the pass.

## 6. Acceptance criteria (whole effort)

- Existing banks and behavior unchanged; `visual` is purely additive and optional.
- A `rhythm_strip` visual renders deterministically, is `file://`-safe, uses no raster assets and no runtime API, and is measurably to-scale (interval params map to ECG-paper boxes).
- Validation, coverage, and build commands all pass; renderer has determinism + scaling tests.
- Generated rhythm items flow through raw → validate → human review → promote → ledger, with audit reports, exactly like existing content.
- No AI-generated raster imagery anywhere; no `highlight`/`bowtie`; no architecture rewrite; no Tailwind.

## 7. Suggested commit sequence

1. Schema + types + validation for `visual` (no renderer yet) — banks still validate.
2. `rhythmStrip.ts` renderer + tests (scaling, determinism, all classes draw).
3. `RhythmStrip.tsx` + App/case-study wiring + CSS.
4. `coverage-report.ts` visual counts.
5. 2–3 reviewed example items + schema doc + generation-prompt update + history/ledger.
6. (Phase 1+) per-lane raw generation, review, promotion — iterative.
