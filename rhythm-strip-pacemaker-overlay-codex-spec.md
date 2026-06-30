# Codex Spec — Rhythm-Strip Pacemaker Overlay (Architecture Phase 0–1)

Date: 2026-06-30
Status: **Parked / backlog, low priority by Luke's explicit instruction.** This spec exists so the work is implementation-ready when it is next in line — it is not a request to build now. Do not start without a separate go-ahead.

Source: `CLAUDE-HANDOFF-RHYTHM-STRIP-DEBT-2026-06-30.md` (Luke's prior investigation, handed off after running out of token budget mid-session — the original audit doc `visual-upgrade-candidates-cardiac-rhythm-2026-06-27.md` it references does not exist on disk and could not be recovered; treat the handoff's audit snapshot as the best available record for the three Bucket 3 items below). Live-verified by Claude on 2026-06-30 against current repo state (see *Drift Check* below) before this spec was written.

## Why

A prior cardiac/rhythm audit (2026-06-27) found three pacemaker-malfunction items that are valid as text but would be pedagogically stronger as rendered strips, and currently can't be, because the `rhythm_strip` renderer has no pacing-spike concept at all. This is not a content-validity defect (0 `VISUAL_REQUIRED_MISSING`) and not a request for a broader EKG campaign — `rhythm_strip` is already the largest visual kind in the bank (44 items) while bowtie/highlight/case_study/fill_in_blank are the actual under-served item types per `BANK-CENSUS.md`. This is narrowly scoped debt backfill for three specific items.

## Drift Check (done — Phase 0 satisfied for this scope)

Live-verified 2026-06-30 by reading `banks/visual-canonical.json` and `src/visuals/kinds/rhythmStrip.ts` directly:

- `ekg_b5_mc_04`, `ekg_b5_mc_05`, `ekg_b5_matrix_10` all still exist in `banks/visual-canonical.json`, all still have no `visual` field at all (confirmed via direct field check, not inference).
- `ekg_b5_mc_04`'s stem still states "several spikes are not followed by a QRS complex" verbatim — confirms the handoff's own content-rewrite rule applies (see *Content Rewrite Rule* below); converting this item without rewriting the stem would ship a text-tell visual.
- `RhythmClass` (in `rhythmStrip.ts`) has zero pacemaker-related variants; `RhythmStripVisual` has no `pacer` field; `rhythmStripModule`'s exported object has no `selfCheck` at all today (only `validate`, `renderSvg`, `fixtures`).

Candidate list has not drifted. A full bank-wide re-audit of Buckets 1/2/4 from the original handoff is **out of scope for this spec** — this spec covers Bucket 3 only (the three IDs above).

## Decision Points — Resolved

The original handoff posed five open questions for adjudication before implementation. Resolved below after reading the live renderer (`src/visuals/kinds/rhythmStrip.ts`) and the closest existing precedent (`src/visuals/kinds/injection_site/index.ts`, the vessel-relation `selfCheck`).

**1. New `rhythmClass` values, a `pacer` overlay, or both → overlay only, no new `rhythmClass` values.**
The renderer builds its waveform by summing Gaussian bumps (`gaussian(t, center, sigma, amp)`) for P/QRS/T components into a per-sample `mv(t)` signal (see `beatMvAt`, `rhythmBaselineMv`, `atrialPWaveMv` inside `renderRhythmStripSvg`'s sampling loop). A pacing spike is the same primitive — a tall, narrow Gaussian bump — so it composes as one more term in that same sum, with `spec.rhythm` continuing to describe the *underlying* intrinsic rhythm (`asystole` for a fully pacer-dependent baseline, `sinus_brady` for failure-to-pace-during-bradycardia, `sinus`/`avb_3`/`avb_1` for failure-to-sense scenarios that need visible intrinsic activity for spikes to land on). This reuses the existing waveform machinery instead of forking per pacing scenario, and mirrors the injection-site precedent: a per-item behavioral distinction (capture vs. not, sense vs. not) is a data-contract field, not enum growth.

**2. Preserve IDs vs. retire + reissue → retire, reissue new IDs.**
Progress, flags, SRS, and answer history all key on `question.id` (`AGENTS.md`). Swapping a text item for a visual one under the same ID would silently carry her seen/missed/mastery state onto a materially different cognitive task. Retire the three old IDs from `visual-canonical.json`, ship new visual items with new IDs, record the replacement mapping (old ID → new ID, reason) in `BANK-REVIEW-LEDGER.md`.

**3. Stop at the 3 pacemaker candidates, or also pull in the 4 Bucket-2 candidates → stop at 3.**
Bucket 2 needs no architecture work, but `rhythm_strip` is already the largest visual kind (44 of 154 total visuals) while bowtie/highlight/case_study/fill_in_blank are the under-served item types. Treat Bucket 2 as a separate, explicitly-decided content lane later — not bundled into the architecture pass.

**4. Does the renderer have enough headroom for paced beats / QT visuals → yes, confirmed by direct read.**
`qtSec` already exists on `RhythmStripVisual` and already drives T-wave timing (`tSec: rSec + qtSec * 0.58` and similar), so the Bucket-2 QT-prolongation candidate (`ekg_b5_mc_03`) needs no renderer change — out of scope for this pass regardless, per #3. For paced beats: the existing `Beat` shape (`rSec`, `qrsSec`, `wide`, `rAmpMv`) already renders a visually distinct wide QRS — exactly what `pvc`/`vtach` use today — so a paced ventricular beat is "one more `Beat` pushed into the array with `wide: true`," not a new geometry primitive.

**5. Where smoke fixtures live → `audit/rhythm-strip-pacemaker-smoke-<date>/`.**
Matches the established convention (`audit/burn-map-smoke-2026-06-28-jaw-shoulders/`, `audit/burn-map-smoke-2026-06-27/`, etc.). Outside `banks/banks-raw/` and outside canonical — not treated as reviewed content per the handoff's "Phase 2 — Smoke Items Only."

## Architecture

### Data contract addition (`src/visuals/kinds/rhythmStrip.ts`)

```ts
export type PacerFinding = "capture" | "failure_to_capture" | "failure_to_sense" | "failure_to_pace";

pacer?: {
  mode: "ventricular" | "atrial" | "dual_chamber";
  setRateBpm: number;                 // programmed pacing rate — defines expected spike cadence
  spikeTimesSec: number[];            // every spike actually rendered
  capturedSpikeTimesSec: number[];    // subset of spikeTimesSec that produces a paced QRS
  finding: PacerFinding;              // declared scenario — selfCheck asserts the data backs this up
};
```

`finding` is declarative (same role as injection site's `vessel`), not derived — it states what the item is teaching, and `selfCheck` proves the numeric data actually demonstrates it. Mirror the injection-site pattern: add `meta.expected.pacerFinding` on the question and cross-check it against `pacer.finding` for redundant audit-readability, same as `meta.expected.route`.

### Renderer integration points (exact, in `rhythmStrip.ts`)

- **`buildBeats(spec, rng)`** — after computing the base intrinsic beats for `spec.rhythm`, if `spec.pacer` is present, append one synthesized `Beat` per entry in `capturedSpikeTimesSec` (`rSec = spikeTime + captureLatencySec`, `wide: true` for `mode: "ventricular"`). Uncaptured spikes (in `spikeTimesSec` but not `capturedSpikeTimesSec`) get no `Beat` — the spike renders with nothing following it, which *is* the failure-to-capture finding.
- **Per-sample composition loop in `renderRhythmStripSvg`** — add a `pacerSpikeMv(timeSec, spec)` term to the existing `rhythmBaselineMv + atrialPWaveMv + Σ beatMvAt` sum. Implement as the same `gaussian()` helper already in the file, with a very small sigma and tall amplitude, one bump per entry in `spec.pacer.spikeTimesSec`.
- **`validateRhythmStrip`** — extend with bounds checks for the new fields using the existing `bounded()` helper pattern (e.g. each `spikeTimesSec` entry within `[0, durationSec]`, `captureLatencySec` within a clinically plausible window).
- **`rhythmStripModule` export** — currently has no `selfCheck` at all; this is a genuinely new addition, not a modification. Model it directly on `selfCheckInjectionSite` in `src/visuals/kinds/injection_site/index.ts`: read `question.meta.expected.pacerFinding`, cross-check against `spec.pacer.finding`, and assert the numeric data is internally consistent with the declared finding (see *Self-Check Assertions* below).

**Shared-derivation requirement:** whatever function computes "where are this rhythm's intrinsic beats" for `failure_to_sense` / `failure_to_pace` checking must be the *same* function `buildBeats` already uses to render them — never a second parallel derivation in `selfCheck` that could drift from what's actually drawn. Export the relevant internal helper from `buildBeats` rather than reimplementing intrinsic-beat timing inside the self-check. This is principle 2/11 (producer ≠ checker only via a shared deterministic transform; single definition, never redefined) applied to this kind.

### Self-Check Assertions

- `finding: "capture"` → `capturedSpikeTimesSec.length === spikeTimesSec.length` (every spike captured).
- `finding: "failure_to_capture"` → `capturedSpikeTimesSec.length < spikeTimesSec.length` (at least one uncaptured spike). This is the handoff's own suggested test: a declared failure-to-capture with all spikes captured must fail.
- `finding: "failure_to_pace"` → requires the base rhythm's intrinsic-beat gaps (from the shared derivation above) to contain at least one interval longer than `60 / setRateBpm` with no spike inside it.
- `finding: "failure_to_sense"` → requires at least one entry in `spikeTimesSec` to land within a small epsilon window of an intrinsic beat's QRS/T window from the base rhythm.
- `meta.expected.pacerFinding`, when present, must equal `spec.pacer.finding`.

The last two assertions depend on exporting intrinsic-beat timing from `buildBeats` (see *Shared-derivation requirement* above) — treat getting that export right as the core Phase 1 technical risk, not the spike-drawing itself.

### Content Rewrite Rule (carried from the original handoff, unchanged)

The visual must carry the finding; the stem must not state it. `ekg_b5_mc_04`'s current stem ("several spikes are not followed by a QRS complex") is exactly the bad pattern and must be rewritten before becoming a visual item — e.g. "The nurse reviews the telemetry strip from a client with a ventricular pacemaker. Which pacemaker problem is shown?" Rationale may state the finding after grading. Chinese text must maintain parity and must not leak the answer the English doesn't.

## Phases

**Phase 0 — done (this spec).** Live drift check confirmed above; no further re-audit needed for this scope.

**Phase 1 — renderer spike.** Add the `pacer` field, the spike-drawing term, `Beat` synthesis for captured spikes, validation bounds, and the new `selfCheck` export with the shared intrinsic-beat-timing derivation. Add fixtures to `rhythmStripModule`'s `fixtures.valid` / `fixtures.invalid` covering at minimum: a clean `capture` case, a `failure_to_capture` case, and one invalid case where `finding` doesn't match the data. Confirm all 14 existing non-pacer rhythm fixtures still render and validate unchanged.

**Phase 2 — smoke items only.** Tiny raw/staged batch (not canonical) of the four scenarios in the original handoff: normal paced, failure to capture, failure to sense, failure to pace. Render and inspect; do not promote.

**Phase 3 — backfill the 3 candidates.** After smoke validation, rewrite and convert `ekg_b5_mc_04`, `ekg_b5_mc_05`, `ekg_b5_matrix_10` per the *Content Rewrite Rule*. Retire the old IDs, issue new ones, update `BANK-REVIEW-LEDGER.md`.

**Phase 4 — explicitly out of scope for this spec.** Bucket 2 (Mobitz II / QT / VF clones), oversensing (the handoff already calls this stretch-only), and anything in Bucket 4 (12-lead morphology). Do not fold these in opportunistically because the renderer is already open.

## Acceptance Gates

- `npm run test-visuals` (covers `scripts/tests/rhythm-strip.ts` plus registry/conformance/parity)
- `npm run validate-bank -- banks/*.json`
- `npm run audit`
- `npx tsc -b --pretty false`
- `npm run build`
- New pacer-specific fixtures pass in both directions (valid renders, invalid trips the right `expectCode`)
- Self-check catches the mismatch case from the *Self-Check Assertions* list above
- Visual audit confirms each rendered strip matches its structured data
- Human content review confirms clinical fairness and bilingual parity, and that no stem/exhibit/pre-answer rationale states the finding
- Any bank change goes through promote → audit → consolidate, never a hand-merge
- `BANK-REVIEW-LEDGER.md`, `BANK-CENSUS.md`, `census.json`, and `PROJECT-HISTORY.md` updated if/when Phase 3 lands

## Risks (carried from the original handoff)

- **Visual subtlety** — failure-to-sense and oversensing can be too subtle to read at a glance; do not ship if a novice can't see the cue.
- **Schema creep** — keep this to the four pacer fields above; do not generalize into an ECG-description language.
- **Coverage bloat** — this pays down debt (3 backfilled items, 3 retired), it does not net-add EKG content; watch that Phase 4 temptation doesn't creep in.
- **Legacy progress IDs** — resolved above (retire + reissue), but double-check no other surface (flags, custom session filters) references the old IDs by literal string before retiring them.
