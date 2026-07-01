# Claude Dark Mode Handoff - 2026-06-27

## Context

Luke asked Codex to audit Project Shrimp / NCLEX Bilingual Prep for a possible dark mode toggle before implementation. The goal was to determine what would break and produce an audit report only, not to implement.

Original audit ask:

> You are auditing Project Shrimp / NCLEX Bilingual Prep for a possible dark mode toggle.
>
> Goal: determine how much would break, not to implement yet.
>
> Start by reading AGENTS.md, PROJECT-HISTORY.md, src/styles.css, src/App.tsx, src/storage.ts, and all visual renderer files under src/visuals/. Treat the repo as source of truth.
>
> Please produce an audit report only. Do not modify files unless you find a trivial typo in comments; otherwise no code changes.
>
> Questions to answer:
>
> 1. Current theme structure
> 2. Visual-stimulus risk
> 3. Recommended design
> 4. Implementation sketch
> 5. Regression checklist
> 6. Verification commands

Codex completed the audit without implementation changes. This handoff exists so Claude can review the plan and raise concerns before the first implementation pass.

## Current Findings

### Theme Structure

- Styling is centralized enough in `src/styles.css` to support a CSS custom-property pass.
- The app currently uses plain CSS, no Tailwind.
- React components in `src/App.tsx` mostly use class names rather than inline styles, which keeps theme work reasonably contained.
- `src/storage.ts` already persists `Settings` to localStorage, so theme persistence can reuse the existing settings path and remain compatible with the static/offline/file:// production build.
- Current app colors are hard-coded throughout `src/styles.css`: app background, card surfaces, buttons, borders, selected states, answer states, warning/error panels, pills, rationale panels, dashboard elements, mobile sticky bars, and dev console panels.
- Semantic state classes exist, but their colors are not tokenized yet. Important classes/selectors include `active`, `selected`, `correct`, `incorrect`, `flagged`, `missed`, `warning-band`, `error-panel`, disabled controls, and hover/focus states.

### Visual Renderer Structure

- `src/visuals/VisualStimulus.tsx` provides a shared wrapper:
  - `.rhythm-strip`
  - `.rhythm-strip-svg`
  - `.vis-{kind}`
- This wrapper is the best place to light-lock visual stimulus panels.
- Visual renderers return deterministic SVG strings with hard-coded fills/strokes. This is good for clinical consistency and visual parity, but risky for a full dark-renderer conversion.
- The visual renderer files and shared primitives should not be touched in the first dark-mode implementation pass unless a specific bug appears.

## Visual Risk Summary

Recommended classification:

| Visual kind | Risk classification | Notes |
| --- | --- | --- |
| `rhythm_strip` | High risk if darkened; safe if light-locked | ECG grid/paper and waveform contrast are clinical interpretation cues. |
| `capnography` | High risk if darkened; safe if light-locked | Reuses clinical grid-paper primitive; waveform shape and EtCO2 label must stay crisp. |
| `vitals_trend` | Needs CSS isolation | Shared line chart has hard-coded axis, grid, point, legend, and series colors. |
| `lab_trend` | Needs renderer color refactor for full dark | Critical trend/reference interpretation depends on readable chart colors and labels. |
| `mar` | Safe if light-locked; medium if full dark | Document-style table with yellow flagged cells. |
| `io_record` | Safe if light-locked | Document-style table with totals and net balance. |
| `medication_label` | Safe if light-locked | Synthetic medication label should remain document/label-like. |
| `device_screen` | Needs CSS isolation, already internally dark | Device screen renderer intentionally uses a dark screen palette; do not globally invert it. |
| `fetal_monitoring` | High risk if darkened | CTG tracing uses light paper grid and dark tracings; interpretation depends on contrast conventions. |
| `burn_map` | Needs renderer color refactor for full dark | White diagram, red burn fills, slate outlines/labels. Fine in light panel. |
| `injection_site` | High risk if darkened | Anatomical layer colors, vessel/needle contrast, and labels are teaching cues. |

## Luke Decisions After Audit

- Use a binary manual toggle only: `light` and `dark`.
- Do not include an automatic system-preference mode.
- Dark mode should apply to the developer review console too, but that surface is low priority and does not need perfection on the first pass.
- Visual stimulus panels should remain light-locked.
- Preserve exact visual-renderer behavior and avoid renderer palette changes in the first pass.
- Test mode should also keep visual stimuli light.

## Recommended Implementation Plan

Lowest-risk design: dark app chrome plus light-locked visual stimulus panels, controlled by a manual local toggle.

Proposed implementation shape:

1. Extend `Settings` in `src/types.ts`.
   - Add `themeMode: "light" | "dark"`.

2. Extend defaults and persistence in `src/storage.ts`.
   - Add `themeMode: "light"` to `defaultSettings`.
   - Existing `loadSettings` merge should tolerate older saved settings.
   - Existing `saveSettings` should continue to write the full settings object to localStorage.

3. Apply theme state from `src/App.tsx`.
   - Add `data-theme={settings.themeMode}` to the app root or set it on `document.documentElement`.
   - Prefer a root/data attribute over adding many conditional classes.
   - Add a binary theme control in `SettingsView`.
   - Keep copy simple: "Theme" with options "Light" and "Dark".

4. Tokenize `src/styles.css`.
   - Introduce CSS custom properties for:
     - app background
     - panel/card surfaces
     - muted surfaces
     - primary text
     - muted text
     - borders
     - shadows
     - buttons
     - button hover
     - primary action
     - selected/active
     - correct
     - incorrect
     - missed/warning/error
     - flagged
     - focus ring
     - rationale/dual-copy panels
     - Chinese scaffold text
   - Convert broad app UI selectors to variables.
   - Keep first pass scoped; do not chase every possible dev-console polish detail if the main learner surfaces are correct.

5. Light-lock visual panels.
   - On `.rhythm-strip-svg`, set `color-scheme: light`.
   - Keep explicit light background/border values or light-specific variables.
   - Ensure the outer figure/caption remains readable in dark mode while the SVG panel itself stays light.
   - Do not change SVG renderer output in `src/visuals/kinds/*` or `src/visuals/primitives/*`.

6. Preserve architecture constraints.
   - No server/API dependency.
   - No bank JSON changes.
   - Preserve Vite static/offline/file:// compatibility.
   - No app architecture rewrite.

## Files Likely Touched

- `src/types.ts`
- `src/storage.ts`
- `src/App.tsx`
- `src/styles.css`

## Files That Should Not Be Touched In First Pass

- `banks/*.json`
- `src/schema.ts`
- `src/grading.ts`
- `src/banks.ts`
- `src/bankImport.ts`
- `src/visuals/kinds/*`
- `src/visuals/primitives/*`
- visual snapshot/parity fixtures unless a non-visual implementation change unexpectedly affects them

## Regression Checklist

Manual UI states to check:

- Home/test launcher
- Session builder
- Study session before answering
- Submitted answer states: correct, incorrect, partial credit
- Rationale expanded
- Chinese display: off, on-tap, always
- Case studies, stages, exhibits, and focused embedded parts
- Every NGN item type:
  - multiple choice
  - select all
  - ordered response
  - fill in blank
  - matrix
  - dropdown cloze
  - highlight
  - bowtie
  - case study
- Every visual kind:
  - rhythm strip
  - capnography
  - vitals trend
  - lab trend
  - MAR
  - I/O record
  - medication label
  - device screen
  - fetal monitoring
  - burn map
  - injection site
- Library filtering and flagged/due/missed pills
- Dashboard/progress/trend bars
- Flashcards
- Import screen
- Settings screen
- Developer review console
- Mobile viewport, especially sticky session topbar/bottom actions

## Verification Baseline From Audit

Commands run during the audit:

```sh
npm run test-visuals
npm run build
npm run validate-bank -- banks/*.json
```

Results:

- `npm run test-visuals` passed. It reported all 11 registered visual kinds green, visual conformance passed, registry mechanics passed, visual parity passed, and session sampler tests passed.
- `npm run build` passed. Existing Vite chunk-size warning remains unchanged.
- `npm run validate-bank -- banks/*.json` passed for all canonical banks.

## Claude Review Request

Please sanity-check the proposed implementation plan before Codex implements.

Specific things worth looking for:

- Any reason not to store theme in the existing `Settings` object.
- Any concern with `data-theme` on the root/app shell rather than `document.documentElement`.
- Any hidden visual-stimulus risk that requires more than wrapper-level light isolation.
- Any semantic state that should be tokenized specially because it carries learning meaning.
- Any first-pass file that should be added to or removed from the touched-file list.

Codex's default implementation stance after Claude review: proceed with binary light/dark app chrome, persisted locally, with visual stimulus panels locked to light and no visual renderer refactor.

## Claude Follow-Up And Luke Decisions

Claude reviewed the handoff and agreed with the direction. He supplied concrete implementation guidance for the first dark-mode pass plus a separate text-size spec to run after dark mode.

Luke accepted the dark-mode guidance with these clarifications:

- Binary theme only: `light` and `dark`.
- No system preference mode.
- Dev console should be themed too, but it remains lower priority than learner surfaces.
- Visual panels stay light-locked.
- Do not implement tap-to-enlarge visuals now; the target user has not shown that need yet.
- Text-size work should run after the dark-mode implementation, not as part of the same pass.

## Dark Mode Implementation Details From Claude

### CSS Token Layer

Use `:root` as the light source of truth, so untagged/default remains current light mode. Dark overrides should live under `:root[data-theme="dark"]`.

Recommended token shape:

```css
:root {
  color-scheme: light;

  --app-bg: #f6f7f2;
  --surface: #ffffff;
  --surface-muted: #f8fafb;
  --surface-accent: #f1faf6;
  --border-accent: #bfe4d6;
  --header-bg: rgba(255, 255, 255, 0.94);
  --sticky-bg: rgba(255, 255, 255, 0.96);
  --card-shadow: 0 18px 48px rgba(40, 55, 70, 0.08);
  --popover-shadow: 0 14px 36px rgba(40, 55, 70, 0.16);

  --text: #17212b;
  --text-muted: #596b78;

  --border: #d7dde2;
  --border-strong: #c8d0d7;

  --control-bg: #ffffff;
  --control-hover-bg: #f3fbf7;
  --control-hover-border: #3e6b5b;

  --accent: #17634e;
  --accent-hover: #0e4d3d;
  --accent-on: #ffffff;
  --accent-text: #1f6f5b;
  --accent-surface: #dcf5ea;

  --badge-bg: #31505f;
  --badge-on: #ffffff;

  --state-correct-surface: #e6f7ef;
  --state-correct-text: #0f513f;
  --state-correct-border: #1f7d63;
  --state-incorrect-surface: #fff0eb;
  --state-incorrect-text: #7f2a1f;
  --state-incorrect-border: #c6543b;
  --state-selected-surface: #fff8e8;
  --state-selected-border: #c38c1f;
  --state-missed-surface: #fff0b8;
  --state-missed-text: #6b4a00;
  --state-missed-outline: #b7791f;
  --state-flagged-surface: #fff0cf;
  --state-flagged-text: #8a4b00;
  --state-flagged-border: #a96713;
  --panel-warn-surface: #fff3ef;
  --panel-warn-text: #73291f;
  --panel-warn-border: #f0b8a8;
}

:root[data-theme="dark"] {
  color-scheme: dark;

  --app-bg: #11161c;
  --surface: #1a212a;
  --surface-muted: #222c37;
  --surface-accent: #173b30;
  --border-accent: #2f6f5a;
  --header-bg: rgba(20, 26, 32, 0.92);
  --sticky-bg: rgba(20, 26, 32, 0.94);
  --card-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  --popover-shadow: 0 14px 36px rgba(0, 0, 0, 0.55);

  --text: #e6edf3;
  --text-muted: #9aa7b2;

  --border: #2c3742;
  --border-strong: #3a4754;

  --control-bg: #222c37;
  --control-hover-bg: #26333f;
  --control-hover-border: #4f8f78;

  --accent: #1f8f6f;
  --accent-hover: #17795f;
  --accent-on: #ffffff;
  --accent-text: #5cc6a6;
  --accent-surface: #173b30;

  --badge-bg: #3f6276;
  --badge-on: #ffffff;

  --state-correct-surface: #16352a;
  --state-correct-text: #7fe0bc;
  --state-correct-border: #2f8f6f;
  --state-incorrect-surface: #3a2019;
  --state-incorrect-text: #f3a896;
  --state-incorrect-border: #b3563f;
  --state-selected-surface: #3a2f12;
  --state-selected-border: #c79a3a;
  --state-missed-surface: #3a3414;
  --state-missed-text: #e8cf7a;
  --state-missed-outline: #b7901f;
  --state-flagged-surface: #3a2f12;
  --state-flagged-text: #e8cf7a;
  --state-flagged-border: #c79a3a;
  --panel-warn-surface: #3a2019;
  --panel-warn-text: #f3a896;
  --panel-warn-border: #7a3a2a;
}
```

Important tokenization rules:

- Replace app literals mechanically where appropriate: `#ffffff` to `--surface` on panels and to `--control-bg` on controls; `#d7dde2` to `--border`; muted copy colors to `--text-muted`.
- Keep `.rhythm-strip-svg` visual-panel background/border literals as light values. Claude specifically called out leaving its `background: #fff8fa` and `border: #d7b4bb` as literals because the pink ECG-paper surface is light-locked and shared by every visual kind.
- Add `.rhythm-strip-svg { color-scheme: light; }`.
- Use `--header-bg` for the translucent app header and `--sticky-bg` for the mobile bottom action bar. Otherwise they will remain bright white over dark content.
- Use `--card-shadow` and `--popover-shadow` so shadows are not washed out or awkward in dark mode.
- `color-scheme: dark` on `:root[data-theme="dark"]` is valuable for native checkboxes, scrollbars, select popups, and browser chrome. The visual wrapper reasserts `color-scheme: light`.

### Semantic State Tokenization

Do semantic state groups as foreground/background/border triplets where needed. Do not tokenize only the background, or dark text can land on dark surfaces.

State grouping guidance:

- `correct`: use `--state-correct-surface`, `--state-correct-text`, and `--state-correct-border`.
- `incorrect`: use `--state-incorrect-surface`, `--state-incorrect-text`, and `--state-incorrect-border`.
- answer-picked `selected`: use amber `--state-selected-surface` and `--state-selected-border`.
- navigation/filter active states: use mint `--accent-surface`, not amber selected-answer tokens.
- `missed`: use `--state-missed-*`.
- `flagged`: use `--state-flagged-*`.
- warning/error/dev untrusted panels: use `--panel-warn-*`.

Important distinction: there are two selected semantics:

- Amber selected = answer choice/token/cell the learner picked.
- Mint active = nav tab, segmented control, builder mode, topic chip, and other app-mode selections.

Do not collapse topic-chip or nav active into the amber answer-selected tokens.

Claude also called out:

- `difficulty-dot` base text should use `var(--text)`.
- `difficulty-dot.easy` can use `--accent-surface`.
- `difficulty-dot.medium` can use `--state-selected-surface`.
- `difficulty-dot.hard` can remain white-on-maroon.
- `trend-strip .correct/.incorrect` can stay solid saturated bars or be lightly brightened; low priority.

### TypeScript And JSX Details

Use `document.documentElement`, not only `.app-shell`, because the base background lives outside the React shell and can show during body/html overscroll, especially on mobile.

`src/types.ts`:

```ts
export type ThemeMode = "light" | "dark";

export type Settings = {
  languageMode: LanguageMode;
  defaultMode: StudyMode;
  voiceEnabled: boolean;
  themeMode: ThemeMode;
};
```

`src/storage.ts`:

```ts
export const defaultSettings: Settings = {
  languageMode: "always",
  defaultMode: "study",
  voiceEnabled: false,
  themeMode: "light",
};
```

`src/App.tsx`, near settings state:

```tsx
useEffect(() => {
  document.documentElement.dataset.theme = settings.themeMode;
}, [settings.themeMode]);
```

`SettingsView`, add a simple control:

```tsx
<label>
  <span>Theme</span>
  <select
    value={settings.themeMode}
    onChange={(event) => updateSettings({ ...settings, themeMode: event.target.value as ThemeMode })}
  >
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
</label>
```

### Optional Anti-Flash Script

Claude recommended an optional first-paint anti-flash script in `index.html`, before the stylesheet. It should be plain non-module/non-defer so it remains eager after `make-file-build` and works under `file://`.

```html
<script>
  try {
    var s = JSON.parse(localStorage.getItem('nclex-settings') || '{}');
    if (s.themeMode === 'dark') document.documentElement.dataset.theme = 'dark';
  } catch (e) {}
</script>
```

Tradeoff: this duplicates the `nclex-settings` storage key from `src/storage.ts`. If implemented, keep the coupling obvious and small.

## Post-Dark-Mode Text Size Spec

This is not part of the first dark-mode implementation. Run it as a follow-up after the theme pass is verified.

Goal: add a persisted Light/Default/Large reading-text control without resizing visual panels or changing layout density.

Recommended approach:

- Do not scale root `font-size`. Root scaling would also scale rem-based layout and visual caps, including the rhythm strip `min-width: 36rem`, worsening mobile scroll.
- Add a `--font-scale` multiplier and apply it only to reading-text font sizes via `calc()`.
- Keep layout, tap-target rems, nav/header chrome, structural padding/min-height, and visual wrapper sizing unchanged.
- Unitless line-height on affected rules will track automatically.

Settings shape:

```ts
export type FontScale = "s" | "m" | "l";

export type Settings = {
  languageMode: LanguageMode;
  defaultMode: StudyMode;
  voiceEnabled: boolean;
  themeMode: ThemeMode;
  fontScale: FontScale;
};
```

Default:

```ts
fontScale: "m"
```

Root sync:

```tsx
useEffect(() => {
  document.documentElement.dataset.fontScale = settings.fontScale;
}, [settings.fontScale]);
```

CSS token:

```css
:root { --font-scale: 1; }
:root[data-font-scale="s"] { --font-scale: 0.94; }
:root[data-font-scale="l"] { --font-scale: 1.12; }
```

Keep the scale modest. If large feels too weak after testing, consider `1.18` before going higher.

Apply `calc(<current> * var(--font-scale))` to reading text only:

- `.stem`
- `.case-question-stem`
- option/token reading text, likely through `.bilingual-text`
- `.cloze-line`
- `.highlight-line`
- `.dual-copy p`
- `.choice-rationales` copy
- `.case-exhibit-content`
- `.flashcard-face strong`
- `.flashcard-face span`
- `.flashcard-face small`
- `.glossary-strip span`

Leave `.chinese-line` as `0.96em`; it inherits the scaled parent and remains secondary.

Do not scale:

- anything under `.rhythm-strip-svg` / `.vis-*`
- visual width caps
- nav/header chrome
- `.type-pill` / `.missed-pill`
- structural padding/min-height

Control recommendation:

- Use a segmented S/M/L control in `SettingsView`, matching the existing `.segmented` pattern.
- Labels can be `A-`, `A`, `A+` or `Small`, `Default`, `Large`.

Text-size verification:

- At every setting, verify stem/options/rationale/on-tap Chinese/case-study text changes size.
- Verify a rhythm strip, document table, and chart do not visibly resize.
- Verify mobile sticky topbar and bottom actions still fit at large.
- Run `npm run build` and `npm run test-visuals`.
