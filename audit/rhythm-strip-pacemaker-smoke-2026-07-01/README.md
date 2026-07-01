# Rhythm Strip Pacemaker Smoke Audit - 2026-07-01

Purpose: audit-only smoke coverage for the ventricular pacemaker overlay added to `rhythm_strip` visuals. These questions are not promoted study content and are not bundled by the app.

## Fixtures

- `smoke_pacer_capture_2026_07_01` - paced asystole with every pacer spike followed by captured QRS complexes.
- `smoke_pacer_failure_to_capture_2026_07_01` - paced asystole with intermittent uncaptured pacer spikes.
- `smoke_pacer_failure_to_sense_2026_07_01` - sinus rhythm with pacer spikes landing despite intrinsic ventricular activity.
- `smoke_pacer_failure_to_pace_2026_07_01` - asystole with paced beats separated by a prolonged spike-free pause.

## Render Evidence

Rendered SVG and PNG artifacts are in `rendered/`.

- `rendered/contact-sheet.png` stacks all four strips for quick visual inspection.
- Individual SVG/PNG pairs are named by question ID.

Visual inspection result: spike markers and paced complexes are visible for capture, intermittent missing captures are visible for failure to capture, intrinsic activity plus inappropriate spikes is visible for failure to sense, and the prolonged underpaced gap is visible for failure to pace.

## Verification

- `npm run validate-bank -- audit/rhythm-strip-pacemaker-smoke-2026-07-01/smoke-bank.json` passed.
- `npx tsx scripts/tests/rhythm-strip.ts` passed.
