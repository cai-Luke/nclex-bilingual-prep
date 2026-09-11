# UX-0A implementation receipt — 2026-09-11

Terminal: **UX0A_READY_FOR_REVIEW**. Implementation and required verification are complete; acceptance and history publication are deferred. UX-0B and UX-0C have not started. UX-0B's work order requires accepted UX-0A before implementation.

## Snapshot and scope

Disk-reading Codex seat; clean local `main` at `d895d851ae5c7b4c29aab74534bf4d4ad44f42e0` was the input. Work is on `codex/ux-0a-learner-truthfulness`. The Campaign 16 closeout is recorded in `PROJECT-HISTORY.md`. No local/remote identity assumption was made and nothing was pushed or merged. No delegation was used.

All eight forcing findings in the [frozen work order](../../UX-0A-LEARNER-SURFACE-TRUTHFULNESS-CODEX-SPEC-2026-09-11.md) still held. No `UX0A_SOURCE_DRIFT` or escalation occurred.

## Implementation slices

| Slice | Commit | Files | Result |
|---|---|---|---|
| 1 — truthfulness / visibility | `9ad6287` | `src/App.tsx`, comment only in `src/types.ts` | Default mode control removed; persisted field retained and explained. Preview Lab launcher uses existing developer gate. GPT rescue labels describe copying. Export says `Export questions / 导出题目`. Summary says `Fully correct` with Chinese parity and retains only the existing flagged review scope. Weak-topic actions open Library with the exact topic and other filters reset to All. |
| 2 — submitted matrix | `31629ab` | `src/App.tsx`, `src/styles.css` | Submitted buttons use `aria-disabled`, retain focus and `aria-pressed`, keep the existing activation guard and correctness colors, and use a default cursor with no hover color/border change. Native `disabled` was not added. |
| 3 — mobile navigation | `0067e5f` | `src/App.tsx`, `src/styles.css` | Mobile global nav grid/button/span rules target `.app-primary-nav`. Text uses the existing visually-hidden technique instead of `display:none`; case navigation keeps its own layout and visible identity. |

## Verification

| Command / check | Result |
|---|---|
| `npx tsc -b --pretty false` | PASS against the final implementation |
| `npm run test:review-prompt` | PASS; prompt owner unchanged |
| `npm run test:exam-layout` | PASS; layout owner unchanged |
| `npm run build` | PASS, including direct-file rewrite and build-identity validation; existing large-chunk advisory only |
| `git diff --check` | PASS |
| Scope diff against `d895d851` | Only the three implementation files and this evidence directory changed |

Chrome **152.0.7977.83**, fresh isolated browser contexts, production build served locally at `http://localhost:4173/`, with **1440 × 1000** and **390 × 844 CSS px** viewports. Tests seeded browser-only learner state from existing bundled questions; no bank file was changed. Results are in [browser-results.json](browser-results.json). The local smoke driver and fixture builder are retained in ignored `scratch/ux-0a/`.

Browser smoke actually performed:

- Ordinary Settings: both controls absent; a persisted legacy `defaultMode: test` survives theme updates. [Desktop](desktop-settings.png), [mobile](mobile-settings.png).
- Import: explicit question-export wording. [Screenshot](desktop-export.png).
- Dashboard: `Burn Management` opens all **33** exact-topic Library results across **three categories** with category/difficulty/source at All; filtered Study/Test controls remain. [Dashboard](desktop-dashboard.png), [Library](desktop-exact-topic.png).
- Matrix: filled all rows through the UI, submitted a partly correct answer, verified correct/incorrect cell colors, focusability, `aria-disabled`, `aria-pressed`, unchanged selection after Space/Enter, Tab progression, and stable hover colors/borders/default cursor. [Screenshot](desktop-matrix-submitted.png).
- Missed standalone and missed case part: real clipboard success and forced clipboard-denial fallback. Copied content matches the unchanged prompt builder apart from its generation timestamp; each fallback exactly matches that view's copied string, including timestamp. [Case screenshot](desktop-case-copy.png).
- Summary: full-correct terminology and exactly one flagged scope; a seeded flagged answered item remains in that scope. [Screenshot](desktop-summary.png).
- Mobile: seven global destinations have accessible text-derived names; labels are visually hidden without `display:none`; Home, Settings, and the multi-part case have no page-level horizontal overflow. Case part labels/status and Previous/Next remain visible; Next moves to part 2, and the case's own one-column grid is preserved. [Home](mobile-home.png), [case](mobile-case.png).
- Developer query `?dev=1` and persisted `shrimpDevTools` gate: Developer Review, Telemetry, and Preview Lab remain reachable. [Screenshot](desktop-preview-lab.png).
- Real `file://` production load in a separate context: app rendered, Settings and Library navigation worked, and all **1,949** bundled questions loaded with no page runtime errors. [Screenshot](file-library.png). [Build identity](build-identity.json) records the tested production files.

Screenshots of affected surfaces were visually inspected. Browser page-error collections were empty. Initial smoke-driver assertions were corrected for existing select accessible names, the prompt's dynamic timestamp, and the case navigator's legitimate grid layout; those were harness assumptions, and the final run passed without application changes.

## Preservation and excluded follow-ups

Campaign 16 evidence, all banks, census artifacts, ledger, storage implementation and persisted shapes, schema, grading, samplers, renderers, rescue prompt construction, and export/import serialization are unchanged. The only `src/types.ts` change is the requested compatibility comment. No clinical claim was authored or altered. No runtime dependency was added.

The absent full learner-state backup remains the work order's recorded follow-up. Dashboard's broader `Mastery and coverage` heading remains outside this Summary-specific wording change. No other adjacent feature was added. `PROJECT-HISTORY.md` has no unaccepted completion entry.
