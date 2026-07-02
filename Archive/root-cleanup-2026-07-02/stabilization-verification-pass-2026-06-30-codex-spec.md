# Codex Spec — Stabilization Verification Pass (No New Scope)

Date: 2026-06-30
Status: Verification only. No code, schema, bank, or architecture changes in this pass.
Author: Claude (planning/review gate)

## Why

Three feature passes landed today, in sequence, on the same branch state:

1. Exam Shell Width and Split Density
2. Translation Reveal Default and Telemetry Foundation
3. Settings Preview Lab

Each shipped with its own per-feature verification, but nothing has verified the three together as the live combined state. Before scoping Targeted Review V1 (the next real feature, separately specced), confirm the combined state is actually stable. This pass adds zero behavior. If anything fails, stop and report — do not patch in scope to make the suite pass; a failure here becomes its own follow-up spec.

## Automated Checks

Run in order. Report exact pass/fail per command, with raw output captured on any failure.

```sh
npx tsc -b --pretty false
npm run test:exam-layout
npm run test:session-navigation
npm run test:grading
npm run test:highlight
npm run test:bowtie
npm run test:case-completeness
npm run test-visuals
npm run validate-bank -- banks/*.json
npm run audit
npm run census:check
npm run build
```

All of these are existing `package.json` scripts — confirmed live on 2026-06-30, none need to be authored.

## Manual / Browser Smoke

State plainly, at the top of your report, whether this run has any rendering/browser capability. If yes, run the checklist below directly and report findings per item. If no, list the checklist as outstanding for Luke and stop there — do not skip it silently or mark it N/A.

Each target ties to a specific Jun 30 milestone, so a regression here is traceable to a specific change:

1. **Live Study split layout.** Open a standalone-visual question (`lab_trend` or `medication_label`) and a case study at desktop width. Confirm the 1400px shell, the case-study chart-over-work layout with an independently scrollable chart pane, `mar` staying full-width, and `io_record` splitting with its compacted 420-unit-viewBox table.
2. **Summary / Developer Review layout.** Confirm both render full-width stacked (not split) for at least one case study and one standalone visual item — this is the `standaloneVisualLayout` prop's job.
3. **Preview Lab.** Confirm it opens from Settings without starting a session or writing progress (compare progress/IndexedDB state before and after a Preview Lab visit), and that both desktop and mobile-stacked preview modes render.
4. **Mobile stacked layout.** Narrow below the split breakpoint; confirm case studies and standalone visuals both fall back to stacked, full-width.
5. **On-tap Chinese reveal inside answer controls.** Confirm a reveal-button tap inside a bowtie token and inside a `HighlightControl`/`DropdownClozeControl` answer choice does not also select/deselect that choice, and that the reveal button disappears after one tap.
6. **One case-study part-switch flow.** Switch active parts in a multi-part case; confirm the work pane scroll resets, the sticky toolbar stays clear of content, and `Submit all parts` / the completion count stay correct through the switch.

## Stop Condition

Any automated command failing, or any smoke target showing a regression, ends this pass. Report the specific failure with reproduction steps. Do not attempt a fix inside this spec — that is new, separately scoped work, and gets its own handoff.

## Done When

All automated commands pass, all smoke targets are confirmed (or explicitly and individually deferred to Luke with a precise list — not a blanket "manual testing needed"), and nothing in the app changed as a result of running this pass.
