# Exam shell widen, IO split reinstatement, and case-study horizontal split

Status: drafted by Claude from live source + Luke's Preview Lab dogfooding + a GPT design pass. Three independent, separately-landable changes. Presentation-only throughout — no grading, storage, schema, or bank changes.

## Origin and adjudication

Luke used the Settings → Preview Lab surface (shipped 2026-06-30) to inspect live layout on the actual target device (M1 MacBook Air 13.3", Safari fullscreen) and observed: (1) the question surface doesn't use the full window, (2) IO's split pane looked compressible without losing information, (3) MAR's split pane did not, (4) the case-study split pane is hard to read because both panes are simultaneously too wide for comfortable line length while being narrow as data panes. GPT then proposed a per-content-family routing policy. Adjudication against live source (`src/styles.css`, `src/examLayout.ts`, `src/visuals/kinds/io_record/`, `src/visuals/kinds/mar/`, `DECISIONS.md` principle 23):

| GPT point | Verdict | Why |
|---|---|---|
| 1. Widen Study/Test shell, scoped (not global `main`) | **Accept** | `main` is `width: min(1120px, calc(100% - 2rem))` site-wide today; confirms Luke's "doesn't span the window" read. GPT correctly scopes the fix to the session surface rather than every view. |
| 2. IO compacts and rejoins the split allowlist | **Accept the conclusion, reject the mechanism** | `io_record` renders as a fixed-viewBox SVG (`renderIoRecordSvg` → `renderDocTable`, viewBox `width: 600`), not an HTML `<table>`. GPT's `.io-table th/td { padding: 4px 6px }` CSS targets markup that doesn't exist here and would be a no-op. The actual density lever is the SVG's own geometry constants (viewBox width, row height) — see Phase B. |
| 3. MAR does not default to side-by-side | **Accept** | `mar`'s renderer grids one column per `timeGrid` entry (4–8+ scheduled times) plus name/dose/route/frequency — inherently wider than IO's two-column (item, volume) shape. This is already the standing call in `DECISIONS.md` principle 23 and `examLayout.ts`; no change needed. |
| 4. Case studies go horizontal (top/bottom), not vertical (left/right) | **Accept** | Matches Luke's own Preview Lab read. `.exam-split-layout` is reused as-is for both case-study and standalone-visual split today; case-study needs its own override — see Phase C. |
| GPT's routing function (`getStudyLayoutMode`) | **Reject as written, keep the intent** | The codebase already has this router — `STANDALONE_SPLIT_VISUAL_KINDS` in `src/examLayout.ts` plus the `case_study` branch in `App.tsx`. Phase B/C edit the existing router and CSS rather than introducing a parallel one. |

Net: ship all three. Phase A first (it's a pure win and the other two read better once it's in); B and C are independent of each other and of A, and can land as separate PRs.

## Codex pre-implementation review (Jun 30)

Codex source-reviewed this spec before implementation and flagged three things. Adjudicated against live source (`src/App.tsx`, `scripts/tests/io-record.ts`, `package.json`):

1. **Phase C scroll reset breaks — accept, real bug.** Case-part switching calls `workPaneRef.current.scrollTo({ top: 0 })` on desktop, which relies on the work pane being its own scroll container. Phase C removes that (`overflow-y: visible`), so the call silently no-ops post-change and the learner can land mid-page on the new part instead of at its top. Fixed in Phase C below — this is a JS change, not CSS-only, and it must land in the same commit as the CSS grid change (reverting one without the other regresses the scroll-reset behavior either pre- or post-Phase-C).
2. **Preview Lab bucket lists are a stale parallel classification — accept, real bug.** `previewSplitKinds` / `previewFullWidthKinds` in `App.tsx` (~line 1820) hand-duplicate the split allowlist instead of importing `STANDALONE_SPLIT_VISUAL_KINDS`. Rendering would stay correct (Preview Lab reuses `usesStandaloneVisualSplit` for the actual layout), but `io_record` would render split while still being filed under the "full-width/excluded" bucket label — exactly the kind of routing-vs-label drift this tool exists to catch. Fixed in Phase B below.
3. **"Verification should not mention lint" — not applicable.** Checked: this spec never listed a lint step, and `package.json` has no `lint` script. No change needed; noting it so the point isn't silently dropped.

Independently verified, not just taken on Codex's word: re-derived the IO pane-width/font-size math by hand from `.standalone-visual-layout`'s `minmax(24rem, 0.46fr)` against a Phase-A-widened `main` — pane lands at ~384px (1280px viewport, floor-clamped) to ~422px (1440px viewport), rendering the 420-unit viewBox at roughly 11–12px effective text. Matches Codex's 388–436px / 11–12.5px figures closely enough to validate the Phase B viewBox choice; real confirmation is still the Safari/M1 smoke pass both call for. Also checked `scripts/tests/io-record.ts` directly: it asserts on computed totals as SVG substrings (`>1580<`, determinism, placement) and never pins `width`/`rowHeight`/viewBox coordinates, so the Phase B geometry change needs no test-visuals update — only `scripts/tests/exam-layout.ts` needs edits (below).

---

## Phase A — Widen the session and Preview Lab shell

**Files:** `src/App.tsx` (~line 697), `src/styles.css` (~line 234, the `main { ... }` rule).

Today:
```tsx
<div className={`app-shell ${view === "session" ? "session-active" : ""}`}>
```
```css
main {
  width: min(1120px, calc(100% - 2rem));
  min-width: 0;
  margin: 0 auto;
  padding: clamp(1rem, 4vw, 2rem) 0;
}
```

Change: add a `wide-main` class for the two desktop-power-user views — live sessions and Preview Lab (the latter exists specifically so "desktop previews match the real user environment," per the Preview Lab milestone; it should track whatever width sessions get, or its measurements stop being representative).

```tsx
const isWidePage = view === "session" || view === "previewLab";
// ...
<div className={`app-shell ${view === "session" ? "session-active" : ""} ${isWidePage ? "wide-main" : ""}`}>
```

```css
.app-shell.wide-main main {
  width: min(1400px, calc(100% - 2rem));
}
```

Place this rule immediately after the base `main { ... }` rule (source order matters: the existing `@media (max-width: 780px)` block later in the file already sets `.app-shell.session-active main { width: 100%; ... }`, and because that media-query rule comes later in the cascade at equal specificity it must keep winning at narrow widths — don't reorder). `previewLab` doesn't carry `session-active`, so it never picks up that block's header-hiding/sticky-action mobile behavior — it only gets the new width rule, which is harmless at any viewport because of the `min()`.

No other view's `main` width changes. 1400px is a hard cap via `min()`, so this is safe on any external monitor too.

**Verify:** `npx tsc -b --pretty false`; browser smoke at a ~1280–1440px viewport on Home (unchanged width), a live Study session (now wider), and Preview Lab (now wider, matches session width).

---

## Phase B — Reinstate `io_record` to the standalone split allowlist, with compacted geometry

**Files:** `src/examLayout.ts`, `src/App.tsx` (Preview Lab buckets, B1b), `src/visuals/kinds/io_record/index.ts`, `scripts/tests/exam-layout.ts`, `src/styles.css` (the `@media (max-width: 1100px)` standalone-visual-pane overflow list), `DECISIONS.md` principle 23.

### B1 — Router

`src/examLayout.ts` today excludes `io_record` by name in both the comment and the set. Move it in:

```ts
// Excluded by design: rhythm_strip, capnography, fetal_monitoring, and mar —
// their geometry or density does not fit the narrow pane. io_record rejoined
// 2026-06-30 after compacting its SVG geometry (see io_record/index.ts).
export const STANDALONE_SPLIT_VISUAL_KINDS: ReadonlySet<QuestionVisual["kind"]> = new Set([
  "vitals_trend",
  "lab_trend",
  "medication_label",
  "device_screen",
  "burn_map",
  "injection_site",
  "io_record",
]);
```

`scripts/tests/exam-layout.ts` has a fixture asserting the six-kind allowlist (per `AGENTS.md`'s "six-kind standalone split allowlist" test coverage note) — two exact one-line edits, confirmed against the live file:
```ts
// was: assert.equal(usesStandaloneVisualSplit(mc("io_record")), false, "io_record excluded");
assert.equal(usesStandaloneVisualSplit(mc("io_record")), true, "io_record splits");

// was: assert.equal(STANDALONE_SPLIT_VISUAL_KINDS.size, 6, "exactly six standalone split kinds");
assert.equal(STANDALONE_SPLIT_VISUAL_KINDS.size, 7, "exactly seven standalone split kinds");
```
The `mar` assertion (`usesStandaloneVisualSplit(mc("mar")) === false`) is unchanged.

### B1b — Preview Lab buckets must derive from the same set, not a parallel copy

`App.tsx` (~line 1820) hard-codes `previewSplitKinds` and `previewFullWidthKinds` as separate literal arrays feeding the Preview Lab's bucket labels. Left as-is, `io_record` would render correctly (Preview Lab reuses `usesStandaloneVisualSplit` for actual layout) but stay mislabeled under "full-width/excluded." Fix: import `STANDALONE_SPLIT_VISUAL_KINDS` alongside the existing `examLayout` imports and derive the split bucket from it instead of hand-duplicating:
```tsx
import { STANDALONE_SPLIT_VISUAL_KINDS, getVisibleCaseStages, usesStandaloneVisualSplit } from "./examLayout";
// ...
const previewSplitKinds: QuestionVisual["kind"][] = Array.from(STANDALONE_SPLIT_VISUAL_KINDS);

const previewFullWidthKinds: QuestionVisual["kind"][] = [
  "rhythm_strip",
  "capnography",
  "fetal_monitoring",
  "mar",
];
```
`previewFullWidthKinds` stays a small hand-maintained literal (the excluded set is short and stable) — what this closes is the split side ever drifting out of sync with the router again.

### B2 — Why CSS-only compaction won't work, and what will

`VisualStimulus.tsx` calls `mod.renderSvg(visual)` with no layout context — every kind renders identically regardless of which pane it lands in. The wrapper only controls a CSS `max-width` cap (`.rhythm-strip-svg.vis-io_record svg { max-width: 37.5rem }`); the SVG itself stretches to fill via `width: 100%`, and because the viewBox has a fixed internal width (600 units) and a fixed font-size (12 units), the *rendered* text size is `container_px / viewbox_width × 12`. At the ~384px floor the standalone pane currently measures, that's ≈8px-equivalent text — this is the actual mechanism behind "dense tables are unreadable," not excess padding.

The fix is tightening the SVG's own geometry, not wrapper CSS. In `renderIoRecordSvg` (`src/visuals/kinds/io_record/index.ts`), the call into `renderDocTable` currently passes `width: 600`. Change the call site only — do **not** touch `table.ts`'s shared constants (`CELL_PAD`, font sizes), since `renderDocTable` is also used by `mar` and changing those globally would affect a kind this spec isn't touching:

```ts
const table = renderDocTable({
  title,
  columns: [
    { key: "item", label: "", widthFr: 3, align: "left" },
    { key: "vol", label: "Volume (mL)", widthFr: 1.4, align: "right" },
  ],
  rows,
  width: 420,        // was 600
  rowHeight: 24,      // was 28
  headerHeight: 28,   // was 32
});
```
And update `rowHeight`/`headerHeight`/`titleHeight` locals used for `totalHeight` accordingly (`titleHeight` stays 32 — that's `table.ts`'s fixed `TITLE_HEIGHT`, not a param).

At a post-Phase-A standalone pane (`minmax(24rem, 0.46fr)` against a wider `main`), this gets the rendered pane close to the SVG's native 420-unit width, i.e. close to 1:1 scale instead of the current 0.64x squeeze — legible without changing `table.ts`.

**Known side effect, intentional but worth a deliberate look:** this also changes how `io_record` renders full-width (the 8 existing canonical items, plus any case-study-embedded uses), since the same `max-width: 37.5rem` cap now scales a narrower viewBox up rather than down — text renders larger, not smaller. That's very likely a strict improvement (less dead space either way) but isn't proven by this spec; call it out explicitly in browser smoke rather than letting it land as a silent side effect.

### B3 — Mobile fallback wiring

`@media (max-width: 1100px)` already lists which standalone-visual-pane SVGs get `overflow-x: auto` when the layout collapses to stacked:
```css
.standalone-visual-pane .rhythm-strip-svg.vis-vitals_trend,
.standalone-visual-pane .rhythm-strip-svg.vis-lab_trend,
.standalone-visual-pane .rhythm-strip-svg.vis-medication_label,
.standalone-visual-pane .rhythm-strip-svg.vis-device_screen,
.standalone-visual-pane .rhythm-strip-svg.vis-burn_map,
.standalone-visual-pane .rhythm-strip-svg.vis-injection_site {
  overflow-x: auto;
}
```
Add `.standalone-visual-pane .rhythm-strip-svg.vis-io_record` to this list — it's currently absent because `io_record` was never in the allowlist this rule serves.

### B4 — Docs

Once this lands, `DECISIONS.md` principle 23's sentence *"`mar`/`io_record` were measured out — the desktop visual pane is ~384px and dense tables are unreadable there — pending a wider first-column mode"* is half-stale. Update it to record that `io_record` rejoined after geometry compaction (Phase A widening + Phase B SVG tightening), `mar` remains excluded for the column-count reason in the table above, and add a `PROJECT-HISTORY.md` milestone entry per the usual pattern (completed bullets + verification commands run).

**Verify:** `npm run validate-bank -- banks/*.json`; `npm run test-visuals` (io_record fixtures still pass selfCheck/geometry conformance); `npm run test:exam-layout` (updated allowlist count); `npm run build`; browser smoke on an `io-canonical` item both full-width and in the standalone split pane at the Phase-A-widened desktop width, plus the `<1100px` stacked fallback.

---

## Phase C — Case-study split: horizontal segments instead of side-by-side

**Files:** `src/styles.css` (`.split-case-card .exam-split-layout` and its two pane rules, ~line 670–685, plus `scroll-margin-top` on `.exam-split-work-pane`), `src/App.tsx` (`CaseStudySplitLayout`'s part-switch scroll-reset effect, ~line 3758 — see the required JS change below). No `examLayout.ts` change — `split-case-card` is exclusively the case-study split wrapper class (standalone-visual items get `standalone-visual-card` instead, never `split-case-card`), so the CSS selectors can be edited in place without a new modifier class or risk of touching the standalone path.

Today:
```css
.split-case-card .exam-split-layout {
  align-items: stretch;
  height: clamp(32rem, calc(100vh - 13rem), 48rem);
  overflow: hidden;
}

.split-case-card .exam-split-chart-pane,
.split-case-card .exam-split-work-pane {
  min-height: 0;
  max-height: 100%;
  overflow-y: auto;
  padding-right: 0.15rem;
}
```

Change to a capped-height top pane (the case chart/exhibits) over a normal-flow bottom pane (the question), per Luke's read and GPT's framing:

```css
.split-case-card .exam-split-layout {
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto auto;
  align-items: start;
  height: auto;
  overflow: visible;
}

.split-case-card .exam-split-chart-pane {
  max-height: 40vh;
  overflow-y: auto;
  padding-right: 0.15rem;
}

.split-case-card .exam-split-work-pane {
  max-height: none;
  overflow-y: visible;
  padding-right: 0;
}
```

**Required correctness check — sticky toolbar offset.** `.case-work-toolbar` is `position: sticky; top: 0` today, which worked because `.exam-split-work-pane` was its own scrolling container (sticky's containing block). Under this change the work pane is normal document flow, so the toolbar's containing block becomes the page, and `top: 0` will stick it directly under the viewport edge — colliding with `.app-header` (`position: sticky; top: 0; z-index: 5`), which will render on top and partially cover the part-nav chips and the case submit button. Give it a top offset clearing the header, the same way `.dev-review-sidebar` already does (`top: 5.25rem`) — measure the actual header height in browser and match it; don't ship `top: 0` unchanged. This is a real regression if skipped, not a cosmetic nit.

**Required JS change — case-part scroll reset (flagged by Codex review, confirmed against live source).** `CaseStudySplitLayout`'s part-switch effect (`src/App.tsx` ~line 3758) currently does:
```tsx
useEffect(() => {
  if (previousActivePartId.current === effectiveActivePartId) return;
  previousActivePartId.current = effectiveActivePartId;
  const workPane = workPaneRef.current;
  if (!workPane) return;
  workPane.scrollTo({ top: 0, behavior: "auto" });
  if (window.matchMedia("(max-width: 820px)").matches) {
    workPane.scrollIntoView({ block: "start", behavior: "auto" });
  }
}, [effectiveActivePartId]);
```
`scrollTo` resets the work pane's *own* scroll offset — correct only while the pane is a scroll container. Once Phase C makes it normal flow at every width, `scrollTo` becomes a silent no-op and the learner stays wherever the page happened to be scrolled when they switch parts. The `<820px` branch already does the right thing for normal-flow content (`scrollIntoView`) — Phase C just needs that to apply at all widths, not only below 820px:
```tsx
useEffect(() => {
  if (previousActivePartId.current === effectiveActivePartId) return;
  previousActivePartId.current = effectiveActivePartId;
  const workPane = workPaneRef.current;
  if (!workPane) return;
  workPane.scrollIntoView({ block: "start", behavior: "auto" });
}, [effectiveActivePartId]);
```
For the header-safe offset `scrollIntoView({ block: "start" })` needs (so the new part's top doesn't land tucked under the sticky header + now-sticky toolbar), use `scroll-margin-top` rather than a second hand-tuned magic number:
```css
.exam-split-work-pane {
  scroll-margin-top: 5.25rem; /* match whatever top offset .case-work-toolbar lands on, above */
}
```
**This JS change is part of Phase C, not a standalone fix — land it in the same commit as the CSS grid change above.** Before Phase C lands, the work pane is still its own scroll container on desktop and the current `scrollTo` branch is still correct there; removing it early would regress the existing desktop scroll-reset behavior.

The existing `@media (max-width: 820px)` block's `.split-case-card .exam-split-layout { height: auto; overflow: visible; }` and pane `overflow: visible; padding-right: 0;` rules become redundant with the new desktop default (harmless to leave, fine to delete) — but its `.case-work-toolbar { position: static; padding-bottom: 0; }` override stays load-bearing and must still apply below 820px regardless of this change.

**Optional follow-up, not required by this spec:** `.exam-split-chart-pane .case-exhibits { grid-template-columns: 1fr; }` forces single-column exhibits, which made sense when the chart pane was squeezed to `minmax(20rem, 0.46fr)`. Now that the chart pane spans the full (Phase-A-widened) shell width, a multi-column exhibit grid (e.g. `repeat(auto-fit, minmax(16rem, 1fr))`) may look better than one long single column — worth a look in review, not a blocking change here.

**Verify:** `npx tsc -b --pretty false`; `npm run validate-bank -- banks/*.json`; `npm run build`; browser smoke on a multi-part case with exhibits + stages (e.g. `cs_thyroid_storm_main` or `opus_vanco_case_01`, both used in prior case-split smoke passes) covering: chart pane caps at ~40vh and scrolls independently, work pane scrolls with the page, toolbar (part chips + submit) stays visible and fully unobscured by the header when scrolled, mobile collapse (<820px) still falls back to the existing stacked behavior, dark mode, and glossary popover placement (`anchor.closest(".exam-split-chart-pane, .exam-split-work-pane, ...")` bounds logic is layout-agnostic and shouldn't need a code change, but confirm the popover still clamps inside the now-differently-shaped panes).

---

## Sequencing

Independent PRs are fine; Phase A first is recommended since B and C both read better against the widened shell, but neither functionally depends on it. None of the three touch grading, storage, schema, or bank content — `case_study` stays a single top-level session question per `DECISIONS.md` principle 23, which this spec only extends, not revises.
