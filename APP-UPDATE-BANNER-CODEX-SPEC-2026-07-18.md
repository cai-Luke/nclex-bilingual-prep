# App Update Banner + Build Identity — Codex Implementation Spec

**Date:** 2026-07-18
**Status:** Proposed implementation packet; Claude architecture review may challenge it before Codex executes
**Implementation owner:** Codex
**Scope class:** UI/build tooling only; no question-bank, schema, grading, storage, or clinical-content changes

## 1. Problem

Project Shrimp is a static application that can continue working without a live backend, but the learner can keep an already-loaded browser tab open across many deployments. In that state she may continue using an older JavaScript bundle and older bundled question banks until she manually refreshes.

The product currently gives no indication that the loaded app has become stale. This makes dogfood observations ambiguous: an apparent current-product defect may actually be behavior from an older deployed build.

The offline/static construction is a runtime benefit, not a promise that an already-loaded page silently receives later deployments. The app should detect when a newer deployed artifact exists and offer a clear, user-controlled refresh.

## 2. Current repo facts and authority

Read current disk before implementation. The load-bearing files are:

- `AGENTS.md` — preserve the static/offline architecture and the production `file://` path.
- `PROJECT-HISTORY.md` — current implementation status; update only after the feature lands and is verified.
- `vite.config.ts` — currently uses `base: "./"`, which preserves relative GitHub Pages and `file://` assets.
- `package.json` — `npm run build` currently runs TypeScript, Vite, then `scripts/make-file-build.ts`.
- `scripts/make-file-build.ts` — rewrites the built module script for `file://` compatibility.
- `.github/workflows/pages.yml` — GitHub Pages deploys the complete `dist/` artifact.
- `index.html` / `src/main.tsx` / `src/App.tsx` / `src/styles.css` — current application shell.

At spec time, the repo has a web-app manifest but no service-worker registration or service-worker source. Do not introduce one for this feature.

## 3. Product decision

Implement a passive **new-version-available banner** backed by a tiny same-origin build marker.

Each build must carry one build identity in two places:

1. embedded in the built `index.html`, so the running app knows which build it is executing; and
2. emitted as `dist/build-info.json`, so an already-running build can compare itself with the currently deployed artifact.

The app checks only when running as a production HTTP(S) page. A changed build ID means a newer/different deployment exists. The app then shows a non-modal banner and lets the learner decide when to refresh.

This is **not** a service-worker update flow, remote bank sync, runtime API dependency, or automatic reload.

## 4. Build identity contract

### 4.1 Data shape

Use one small contract:

```ts
type AppBuildInfo = {
  buildId: string;
  builtAt: string;
};
```

Requirements:

- `buildId` is a nonempty opaque string used only for equality comparison.
- `builtAt` is an ISO-8601 timestamp used only for human-readable diagnostics.
- Do not call either field a schema version, bank version, or content version.
- Do not compare timestamps to decide which build is newer. Any unequal valid `buildId` means the loaded artifact differs from the deployed artifact.

### 4.2 Build-ID source

Compute the build-info object **once per Vite process**, then reuse that exact object for both the HTML metadata and `build-info.json`.

Preferred ID source:

1. use `GITHUB_SHA` when present in GitHub Actions;
2. otherwise use the current Git commit plus a local-build discriminator such as the build timestamp;
3. if Git metadata is unavailable, fall back to a timestamp-based local ID.

The fallback must not make a local dirty-tree rebuild indistinguishable from an earlier local build of the same commit.

Do not add a manually maintained version constant that developers must remember to increment.

### 4.3 Vite output

Implement the build identity in `vite.config.ts` or a small colocated helper/plugin. The preferred low-drift implementation is:

- inject two metadata tags into transformed `index.html`, for example:

```html
<meta name="app-build-id" content="..." />
<meta name="app-built-at" content="..." />
```

- emit this exact JSON object at the distribution root as `build-info.json`.

The exact mechanism may differ if Codex finds a cleaner existing Vite pattern, but these invariants are mandatory:

- one computation owns both surfaces;
- the output marker is `dist/build-info.json` beside `dist/index.html`;
- all paths remain relative-compatible;
- the metadata survives `scripts/make-file-build.ts` unchanged;
- the generated marker is not committed under `public/` and is never maintained by hand.

### 4.4 Distribution validation

Add a small deterministic post-build validator that reads the final `dist/index.html` **after** `make-file-build.ts` and compares its embedded metadata with `dist/build-info.json`.

It must fail when:

- either artifact is missing;
- the JSON is malformed;
- required values are empty;
- `builtAt` is not a valid timestamp;
- the HTML and JSON IDs differ;
- the HTML and JSON timestamps differ.

Wire this validator into the end of `npm run build`. The normal production build must therefore prove that the file-compatibility rewrite did not drop or alter build identity.

## 5. Runtime update checker

### 5.1 Placement

Keep update logic outside the large rendering body where practical. A small module such as `src/appUpdate.ts` may own:

- build-info parsing;
- current-build metadata reading;
- eligibility checks;
- remote marker URL construction;
- build comparison;
- the update-check lifecycle or a small React hook.

Do not add update state to IndexedDB, local storage, session snapshots, question progress, or bank data.

### 5.2 Eligibility

A remote check may run only when all are true:

- the bundle is a production build;
- `window.location.protocol` is `http:` or `https:`;
- current embedded build metadata is valid.

Required exclusions:

- `file:` — no fetch attempt, no banner, and no console error;
- Vite development mode — no update polling against a nonexistent production marker;
- unsupported or opaque protocols — silently skip.

The Settings diagnostic described below may still display embedded build metadata under `file:`; only the network check is disabled.

### 5.3 Marker request

Resolve the marker relative to the current document, not from a root-absolute path. The GitHub Pages project subpath must work.

Equivalent intent:

```ts
const url = new URL("./build-info.json", document.baseURI);
url.searchParams.set("check", String(Date.now()));
```

Fetch requirements:

- same-origin relative URL only;
- `cache: "no-store"`;
- a changing query value so intermediary/browser caches cannot indefinitely hide a new marker;
- no credentials, headers, API keys, external endpoint, or telemetry;
- non-OK responses, malformed data, offline failures, and aborted requests are silently treated as “no update information.”

Do not show an error banner merely because the learner is offline.

### 5.4 Check cadence

Check:

1. once after the application mounts;
2. when the window regains focus; and
3. when `document.visibilityState` returns to `visible`.

Throttle repeated focus/visibility checks so rapid duplicate browser events do not cause request spam. A minimum interval of 60 seconds is sufficient.

Additional requirements:

- avoid overlapping requests;
- remove event listeners on cleanup;
- once a differing valid build is found, retain that update state and stop further checks for the life of the loaded page;
- no recurring background timer is required in this pass.

## 6. Learner-facing banner

### 6.1 Location and behavior

Render one global banner below the existing sticky app header and before the active view content. It must be visible from Home, live sessions, Settings, Summary, and developer surfaces without duplicating per-view markup.

The banner:

- appears only after a valid remote build with a different `buildId` is observed;
- is non-modal and does not steal focus;
- never auto-refreshes;
- remains visible until the page loads the new build;
- does not require a dismiss control in this first pass;
- lets the learner continue the current screen until she chooses to refresh.

Do not clear storage, reset progress, end the session, or mutate answer state.

### 6.2 Copy

Use bilingual copy consistent with the learner-facing product:

**Heading**

> New version available
> 有新版本

**Body**

> Refresh to load new questions and app improvements.
> 刷新后可获取新题目和应用改进。

**Action**

> Refresh now
> 立即刷新

Minor punctuation/layout changes are acceptable; the meaning is not.

Do not say that content updates automatically, that the learner is currently offline, or that the old build is unsafe.

### 6.3 Refresh action

The action must perform a real same-page refresh without opening a new tab and without adding a useless history entry.

A normal `window.location.reload()` is acceptable if browser smoke proves it loads the replacement artifact reliably. If the smoke environment serves the same stale `index.html` after a normal reload, use a cache-busted same-URL replacement that preserves existing meaningful query parameters and hash, rather than adding a service worker or clearing browser caches.

Acceptance is behavioral: after clicking the action in the two-build smoke, the newly deployed build identity is shown and the update banner is gone.

### 6.4 Accessibility and styling

- Use `role="status"` and polite live-region behavior; do not use an alert dialog.
- Keep a clear button label and normal keyboard focus.
- Reuse existing CSS variables so light and dark themes both work.
- The banner must wrap cleanly on a narrow mobile viewport.
- Avoid a fixed overlay that obscures the stem, answer controls, or case-study navigation.
- Do not alter visual-stimulus rendering or light-lock behavior.

## 7. Installed-build diagnostic

Add one low-prominence read-only row near the bottom of Settings:

> App build / 应用版本: Jul 18, 2026 · abc1234

Requirements:

- derive it from the embedded current-build metadata, not the remote marker;
- format `builtAt` for the learner’s locale;
- show a short, noninteractive build-ID prefix suitable for dogfood diagnosis;
- label it **App build**, not **Content updated**, because a deployment may contain only code or styling changes;
- if embedded metadata is somehow absent or invalid, show `Unknown / 未知` rather than throwing.

This diagnostic is part of the first pass because it lets Luke immediately identify stale-client reports without opening developer tools.

## 8. Explicit non-goals

Do not add any of the following:

- a service worker;
- Workbox or a PWA caching library;
- runtime bank downloading or hot-swapping;
- release notes or a changelog UI;
- semantic versioning machinery;
- automatic reload while a learner is answering;
- forced cache clearing;
- a backend, API route, secret, analytics event, or external network request;
- an update preference stored in Settings;
- bank/schema/grading/import/storage migrations;
- changes to `manifest.webmanifest` unless a concrete implementation necessity is demonstrated.

## 9. Expected touch surface

Codex should confirm the exact files from live disk, but the intended touch surface is approximately:

- `vite.config.ts` — single build-info object, HTML injection, emitted JSON;
- `package.json` — focused test/validator command and build wiring;
- `scripts/validate-build-info.ts` or equivalent — final-distribution consistency gate;
- `src/appUpdate.ts` or equivalent — pure parsing/comparison plus lifecycle helper;
- `src/App.tsx` — one global banner and Settings diagnostic integration;
- `src/styles.css` — banner and diagnostic styling;
- `scripts/tests/app-update.ts` or equivalent — focused runtime-contract regressions;
- `PROJECT-HISTORY.md` — implementation and verification record after the pass is complete.

Avoid unrelated refactors of `App.tsx`, the app shell, navigation, settings persistence, or build pipeline.

## 10. Focused automated regressions

Add `npm run test:app-update` or an equivalently named focused test. At minimum, prove:

1. equal valid build IDs do not produce update availability;
2. unequal valid build IDs do;
3. malformed/empty JSON is rejected without throwing;
4. invalid timestamps are rejected;
5. `file:` and non-production contexts are ineligible for a remote check;
6. `http:` and `https:` production contexts are eligible;
7. the marker URL resolves beneath a GitHub Pages-style project subpath rather than at the domain root;
8. the request URL receives a cache-busting query value;
9. rapid duplicate triggers are throttled or deduplicated;
10. once update availability is latched, later checks cannot clear it back to false.

The post-build distribution validator separately owns exact HTML ↔ JSON consistency.

## 11. Manual/browser smoke

Perform the smoke against production builds over local HTTP, not only Vite development mode.

### 11.1 Same-build control

- Build and serve artifact A.
- Load the app.
- Confirm no banner appears when A fetches A’s marker.
- Confirm Settings displays A’s build date and ID prefix.

### 11.2 Two-build update proof

- Keep the artifact-A page open.
- Produce artifact B with a different build ID and replace the files served at the same URL.
- Refocus the existing A page or hide/show the tab.
- Confirm the banner appears without reloading automatically.
- Confirm current answer/session UI remains usable while the banner is present.
- Click **Refresh now / 立即刷新**.
- Confirm artifact B loads, Settings shows B’s build identity, and the banner is absent.

### 11.3 Failure/offline proof

- Make `build-info.json` unavailable or take the page offline.
- Confirm the app continues normally with no learner-facing error and no uncaught console error.

### 11.4 File-build proof

- Run the normal production build.
- Open `dist/index.html` through the existing `file://` compatibility path.
- Confirm the app loads, Settings shows embedded build identity, no marker fetch is attempted, and no update banner appears.

### 11.5 Presentation proof

Inspect at representative desktop and narrow/mobile widths in both light and dark themes. Confirm the banner does not cover the sticky header, stems, split layouts, case controls, or session navigation.

## 12. Required verification

Minimum completion path:

```sh
npm run test:app-update
npx tsc -b --pretty false
npm run build
```

Then complete the browser smoke in §11.

Because this is UI/build tooling and does not touch bank or schema paths, a full bank-content promotion pipeline is not required. `npm run build` already typechecks and the Pages workflow separately validates bundled banks. If implementation unexpectedly touches loading, storage, schema, or bank files, stop and escalate to the corresponding `AGENTS.md` verification tier.

Run `git diff --check` before handoff.

## 13. Completion state

The pass is complete only when:

- every production artifact has self-consistent embedded and remote build identity;
- an old HTTP(S) page detects a replacement deployment after refocus/visibility return;
- the learner receives a bilingual, non-modal refresh affordance;
- ordinary offline/network failure remains silent;
- `file://` behavior remains intact and performs no update fetch;
- Settings exposes the installed build for dogfood diagnosis;
- tests, typecheck, build, post-build validation, and browser smoke pass;
- `PROJECT-HISTORY.md` records the implementation and exact verification performed.

## 14. Claude review focus

Claude’s review should challenge this packet only on architectural or UX grounds, especially:

- whether any live disk path contradicts the “no service worker” premise;
- whether the one-object HTML + JSON build identity can drift under the current Vite/post-build sequence;
- whether global, persistent, non-modal placement is appropriate during live sessions;
- whether the refresh action reliably crosses browser caching without broad cache-clearing machinery;
- whether any proposed implementation accidentally weakens `file://` compatibility.

Absent a concrete issue in those areas, this should remain a narrow Codex implementation rather than expanding into a general PWA/update architecture project.
