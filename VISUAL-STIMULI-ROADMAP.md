# VISUAL-STIMULI-ROADMAP.md

Policy and backlog surface for deterministic, data-derived clinical visuals. Read `AGENTS.md`,
`PROJECT-HISTORY.md`, and `NCLEX-Question-Schema.md` first; those win on any conflict, and this file
does not restate schema shape, per-kind validation rules, or per-kind STRICTEST-TIER source-
verification watch-items — `NCLEX-Question-Schema.md`'s per-kind sections own those.

## Status

The renderer registry is complete at twelve kinds (`rhythm_strip`, `capnography`, `vitals_trend`,
`lab_trend`, `mar`, `io_record`, `io_trend`, `medication_label`, `device_screen`,
`fetal_monitoring`, `burn_map`, `injection_site` — see `NCLEX-Question-Schema.md`'s visual kind
taxonomy table for the current, authoritative list). U0's registry refactor and the U1–U10 renderer
build-out are done; `io_trend` landed later under the same registry discipline and the principle 25
necessity waiver (`DECISIONS.md`). The taxonomy is closed to new kinds by default — see *Adding a
new kind* below — not because the roadmap ran out, but because the gating rule this file states
already screens most candidates out before a renderer is worth building.

Per-kind content-generation volume is tracked live in `BANK-CENSUS.md` and `npm run
coverage-report`, not here — a count restated in this file goes stale the next time content lands.
The one durable, non-arithmetic content-lane gate: **pediatric `burn_map` content remains BLOCKED.**
A single modified pediatric Rule-of-Nines table was rejected for generated content; pediatric burns
require age-banded Lund-Browder support or a future deliberate scope decision (`AGENTS.md`,
`NCLEX-Question-Schema.md`'s `burn_map` section).

## Guiding principle

*If clinical info can be structured data, render it deterministically instead of sourcing an asset*,
with one sharpening filter applied to every candidate:

> **Does the clinical reasoning depend on something a deterministic render can faithfully carry?**

- **Yes, and it's an analytic curve** → waveform renderer (the rhythm-strip/capnography/fetal-
  monitoring family).
- **Yes, and it's plotted/tabulated values** → chart/table/label renderer. Low render-risk, but the
  rendered artifact and the keyed answer must be **arithmetically consistent** (totals,
  concentrations, derived values computed, never asserted) — principle 11 in `DECISIONS.md`.
- **No — the cue is tissue depth, tone, color, or appearance** → *not* on this track. A synthetic
  SVG can only carry a cartoon convention we invented; "reading" it teaches our icon set, not the
  real finding. Use text scenarios or curated licensed photos through a separate pipeline.

**Gating rule (applies to every candidate kind).** Build a renderer only for cues that are *both*
load-bearing *and* faithfully carriable. A render is load-bearing when removing it makes the
question unanswerable or changes its difficulty (principle 6, `DECISIONS.md`). If a kind can be used
decoratively, that is a reason **against** building it, not a neutral — generation prompts treat any
available tool as an invitation and will apply it to questions that don't need it. On an
already-polished product, a decorative-capable renderer is a net negative.

## Rejected visual classes (do not build; standing rejections)

- **Pressure-injury staging.** Tissue-depth/appearance judgment; a synthetic wound can't carry it.
  Text scenarios or curated licensed photos via a separate acquisition/review pipeline.
- **Fundal assessment.** The only renderable cue (displacement) is conveyed fine in text; tone — the
  actual diagnostic cue — can't be rendered, so the kind is decorative under the gating rule.
- **Pictorial device/equipment drawings** — oxygen delivery devices, trach setups, IV tubing setups,
  enteral feeding setups. These are appearance/component recognition; the testable content is a fact
  about the *named* device the stem already states. Device *settings screens* are different and are
  covered by `device_screen`.
- **Chest-tube collection systems (borderline, never committed).** Fluid level, chamber
  identification, and suction-column height are static and load-bearing, but the highest-yield cues
  — tidaling, continuous-vs-intermittent bubbling, air leak — are motion/temporal and cannot be
  carried honestly by a static SVG. Not ruled out permanently, but not built: any future attempt must
  scope hard to the static cues and explicitly forbid keying answers to tidaling or air leak.
- All original non-goals stand: no AI-generated medical photos, radiology, dermatology, wound
  photos, stock scenarios, or anything needing licensing (`AGENTS.md`).

## Adding a new kind

The taxonomy is append-only in principle, not closed by fiat — but the bar is the same gating rule
above, applied by a human before any code is written, not discovered after. Before proposing a new
kind:

1. Confirm the cue is load-bearing (removing it changes the answer) and faithfully carriable
   (a deterministic render, not an invented icon convention, actually carries the clinical signal).
2. Walk the *Adding a new visual kind (checklist)* in `NCLEX-Question-Schema.md` — that is the
   current, executable process (module contract, registry barrel, `selfCheck`, fixtures, tests).
3. Honor the five-stage visual promotion gate in `AGENTS.md`: `validate-bank`, `selfCheck`, visual
   audit against source data, human content review, promotion plus ledger update.
4. Never AI-generate the visual itself; it must be deterministic, data-derived, and locally rendered
   from structured data, with no raster assets or external files.

## Archived chronology

The completed U0 (registry refactor) through U10 (`injection_site`) implementation record —
per-unit scope, dependencies, and window estimates — is archived at
`Archive/root-cleanup-2026-07-13/VISUAL-STIMULI-ROADMAP-U0-U10-CHRONOLOGY-2026-06-14.md`. The later
`io_trend` (U11) spec is archived at `Archive/U11-IO-TREND-SPEC.md`. Current renderer behavior is
owned by `src/visuals/` and validated by `NCLEX-Question-Schema.md`, not by either archived
document.
