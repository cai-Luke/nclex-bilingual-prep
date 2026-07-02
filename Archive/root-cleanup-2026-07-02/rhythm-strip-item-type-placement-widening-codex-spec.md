# Codex Spec — Rhythm Strip Item-Type Placement Widening

Date: 2026-07-01
Status: Implementation-ready. Luke approved (previous chat turn): widen placement, do not convert any content in this pass.

## Why

`rhythmStripModule` currently has no `allowedItemTypes` override, so it inherits the shared registry default (`VISUAL_ITEM_TYPES` in `src/visuals/registry.ts`: `multiple_choice`, `select_all`, `matrix`). This blocks 3 of the 7 Bucket 1B narration-debt candidates identified in `rhythm-strip-pacemaker-overlay-codex-spec.md`'s addendum (`gemini_backfill_or_cardio_01` — `ordered_response`; `gpt_deepen_2026_06_22_bow_12` and `gemini_c10_07` — both `dropdown_cloze`), which is exactly the "placement-policy decision" that spec deferred to Luke.

This is **not** a novel precedent. `lab_trend` already overrides `allowedItemTypes` to `["multiple_choice", "select_all", "matrix", "ordered_response", "dropdown_cloze", "fill_in_blank"]` (`src/visuals/kinds/lab_trend/index.ts`). Widening `rhythm_strip` to add `ordered_response` and `dropdown_cloze` extends an already-adopted pattern to one more kind — it does not touch the shared global default, does not affect any other kind, and does not itself convert or generate any content.

**Explicitly out of scope for this pass:** converting `gemini_backfill_or_cardio_01`, `gpt_deepen_2026_06_22_bow_12`, or `gemini_c10_07` to visual items. That remains a separate, per-item content decision — Claude's read is `gemini_backfill_or_cardio_01` and `gemini_c10_07` are decorative regardless of placement (do not convert), and `gpt_deepen_2026_06_22_bow_12` is a genuinely open content question routed elsewhere for review, not a placement question. **Do not touch any canonical bank file in this pass.**

## Change 1 — `src/visuals/kinds/rhythmStrip.ts`

Current (near end of file, right before `registerVisual`):

```ts
export const rhythmStripModule: VisualKindModule<RhythmStripVisual> = {
  kind: "rhythm_strip",
  validate: validateRhythmStrip,
  selfCheck: selfCheckRhythmStrip,
  renderSvg: renderRhythmStripSvg,
  fixtures,
};

// `allowedItemTypes` / `requiredSchemaVersion` omitted → registry defaults
// (multiple_choice, select_all, matrix; schema "1.2"), matching current behavior.
registerVisual(rhythmStripModule as VisualKindModule);
```

Change to:

```ts
export const rhythmStripModule: VisualKindModule<RhythmStripVisual> = {
  kind: "rhythm_strip",
  allowedItemTypes: ["multiple_choice", "select_all", "matrix", "ordered_response", "dropdown_cloze"],
  validate: validateRhythmStrip,
  selfCheck: selfCheckRhythmStrip,
  renderSvg: renderRhythmStripSvg,
  fixtures,
};

// `requiredSchemaVersion` omitted → registry default ("1.2"), matching current behavior
// for non-pacer strips (pacer-bearing strips still separately require 1.7 via
// `hasPacerRhythmStrip` in schema.ts, unaffected by this change).
// `allowedItemTypes` widened 2026-07-01 to add ordered_response/dropdown_cloze, matching
// the existing lab_trend precedent (src/visuals/kinds/lab_trend/index.ts). Placement
// permission only — does not convert any existing item. See
// rhythm-strip-pacemaker-overlay-codex-spec.md's addendum for the deferred-decision history.
registerVisual(rhythmStripModule as VisualKindModule);
```

Do not add `fill_in_blank` — no current or planned rhythm_strip candidate needs it, and the pacemaker spec's own "Coverage bloat" risk note argues for minimal footprint over blanket parity with `lab_trend`. Easy one-line addition later if a candidate ever needs it.

## Change 2 — `NCLEX-Question-Schema.md`

Two separate fixes in the same pass, since both are visible from the same "Default supported locations" section:

**2a. Document rhythm_strip's new placement.** In the `### Kind: \`rhythm_strip\`` subsection, add a sentence in the same style already used by `io_record`/`medication_label`/`device_screen`/`burn_map`, e.g. directly after the rhythm/vocab intro paragraph: *"Unlike the global visual default, `rhythm_strip` is also allowed on `ordered_response` and `dropdown_cloze` (as of 2026-07-01)."* Also update the "Default supported locations" block itself — the "Unsupported unless a kind explicitly opts in" list currently reads `ordered_response`, `fill_in_blank`, `dropdown_cloze`, and `case_study` as blanket-unsupported; rhythm_strip needs to join the "opts into" list alongside the arithmetic kinds already named there.

**2b. Pre-existing gap, unrelated to this task but in the same section: `lab_trend` already overrides `allowedItemTypes` to include `ordered_response`/`dropdown_cloze`/`fill_in_blank` in code (confirmed by direct read of `src/visuals/kinds/lab_trend/index.ts`) but the schema doc's `### Kind: \`lab_trend\`` subsection and the "Default supported locations" block never say so** — a reader would assume lab_trend is MC/select_all/matrix-only. Fix this in the same pass since it's the same section and the same class of doc-drift the project already treats as a gate item (cf. Phase 1's `NCLEX-Question-Schema.md` selfCheck correction). Add the equivalent "Unlike the global visual default, `lab_trend` is also allowed on..." sentence to its subsection, matching what its actual `allowedItemTypes` array declares.

## Verification

```
npx tsc -b --pretty false
npm run test-visuals
npm run validate-bank -- banks/*.json
npm run build
```

`npm run validate-bank` must remain green with **identical** results — this is a pure widening, so nothing previously valid can become invalid. If `test-visuals`' registry/conformance harness asserts placement fixtures per kind, confirm it picks up the new `allowedItemTypes` generically rather than needing a hand-written new fixture; only add one if the harness genuinely requires kind-specific placement fixtures to exercise the new types.

## PROJECT-HISTORY.md

Add a short milestone entry on completion: code-only placement widening, no canonical content changed, references this spec and the resolved addendum question in `rhythm-strip-pacemaker-overlay-codex-spec.md`.

## Non-goals

- Do not convert `gemini_backfill_or_cardio_01`, `gpt_deepen_2026_06_22_bow_12`, or `gemini_c10_07`.
- Do not touch any `banks/*.json` file.
- Do not widen any other kind's `allowedItemTypes`.
- Do not add `fill_in_blank` to `rhythm_strip`.
