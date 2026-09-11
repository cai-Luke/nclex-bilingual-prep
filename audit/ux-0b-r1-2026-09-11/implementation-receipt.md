# UX-0B R1 completion receipt

Terminal: **UX0B_R1_STARTUP_DATA_FRESHNESS_READY_FOR_REVIEW**.

Implementation commit: `52b50e0a51e3b9cd98014629fa65feebcc77c3d7` on
`codex/ux-0b-r1-startup-freshness`, based on
`4a0e589358896cdadf7f3e0e59bcee4c52e96f8a`.
Worktree: `/Users/holemini/Desktop/Project Shrimp UX-0B-R1`.
This is an implementation receipt for review, not independent acceptance.
No push, merge, or PROJECT-HISTORY publication was performed.

## Provenance and changed files

[Preflight](preflight.md) records the clean worktree before implementation,
mandatory reads, and original caller inventory. The parent spec exists at the
repository root; the previous attempt's absent-file claim was wrong. The full
[R1 work order](work-order.md) is preserved here for future recovery/review.

Production changes are limited to `src/App.tsx` and `src/styles.css`.
`scripts/tests/session-start-browser.mjs` extends the original ignored
`scratch/ux-0b/browser.mjs` into a tracked, repeatable driver. It obtains the
same fixture questions from current banks and no longer needs the ignored
UX-0A fixture file. This directory contains evidence and the work-order copy.

The previous attempt's exact two-file patch was transferred, corrected here,
then reversed out of the original dirty checkout. The original App/CSS now
match its HEAD. The four unrelated non-MCQ audit diffs compare byte-for-byte
with their captured pre-transfer patch; unrelated untracked artifacts remain.
No delegated contribution or producer-independent review is claimed.

## Readiness and launch inventory

`requestSessionStart` itself returns before capturing records/options/focus or
requesting a guard intent when `!uploadedLoaded` (App.tsx:586). The eight
initial learner-data setters still precede `setUploadedLoaded(true)` at line
459. The new source comment requires that readiness setter to remain last.
The first ready render therefore has both hydrated progress and the combined
bundled/uploaded catalog. No mutable executor ref or new intent architecture
was introduced.

| Direct request caller | Final App.tsx line | Startup control behavior |
| --- | ---: | --- |
| Home Study all | 1002 | Disabled until learner data is ready |
| Home weighted practice | 1004 | Disabled; retains Study mode and requested count |
| Home mistakes | 1006 | Disabled, in addition to existing empty-pool rule |
| Home answered | 1007 | Disabled, in addition to existing empty-pool rule |
| Home due | 1008 | Disabled, in addition to existing empty-pool rule |
| Builder Study/Test/Adaptive | 1025 | Start disabled; navigation/filters remain available |
| Library filtered Study | 1076 | Disabled |
| Library filtered Test | 1077 | Disabled |
| Library one-question wrapper | 890 | Row aria-disabled, removed from tab order, pointer/Enter/Space ignored |
| Summary related practice | 1167 | Startup UI intentionally unchanged; unreachable before hydration |

Custom session navigation is enabled under its original empty-bank rule.
Summary remains outside the startup-disabled prop wiring and retains its
existing semantics. All actual constructors remain behind the central gate.
Every active-session save/clear still goes through the existing ordered
coordinator; no storage caller was added or changed.

The accessible startup status is inside `main` at line 975, avoiding an extra
shell grid row. Its five-second message changes presentation only: no forced
readiness, cancelled storage request, or memory fallback. The existing parent
preparing/error status behavior is preserved.

## Deterministic and browser evidence

[Browser results](browser-results.json): **19 scenario groups passed**, Chrome
152.0.7977.83, production HTTP at `http://127.0.0.1:4174/`, desktop 1440 x 1000
and mobile 390 x 844 CSS pixels. HTTP uses a fresh isolated browser context
with durable IndexedDB. Parent scenarios run against the unmodified production
bundle. R1 adds bounded read-only probes to the served bundle using uniquely
matched AST locations; neither source nor dist is instrumented on disk.
[Build identity](build-identity.json) binds production bytes and source inputs;
browser results also record original and instrumented bundle hashes.

- Native IndexedDB success delivery is held for all eight initial stores,
  then separately for uploaded records and progress. Disabled Home controls,
  all Builder modes, Library Study/Test, and row pointer/keyboard activation
  produce zero random draws, constructions, weighted calls, or active writes.
  A direct call to the actual compiled request function also returns without
  creating an intent. Saved work stays unchanged through the five-second
  message. Custom/Settings navigation works.
- The [negative control](negative-control.json) removes only the compiled
  readiness negation. The direct request then enters the guard and fails the
  intended pre-hydration assertion. The intact final candidate passes.
- Releasing hydration enables controls without reloading. A retained Builder
  flagged filter produces exactly the seeded flagged item. Library retains
  current topic/source filters and keyboard-starts the exact uploaded item.
- Study all includes all 1,949 bundled questions plus one validated uploaded
  fixture. Held and ordinary startup each produce 1,950 unique IDs, include
  the upload, and place the seeded seen question at index 1,949 after every
  unseen item. Their unseen/seen treatment matches under controlled randomness.
- The [weighted sampler input](weighted-sampler-input.json) contains the actual
  335-entry hydrated progress map and 1,950-record combined pool. Both delayed
  and ordinary startup select the seeded sole due item ahead of other seen,
  not-due items in its category, using existing rules. Math.random and Date
  (including Date.now and new Date) are controlled before activation. The
  assertion uses actual sampler inputs and due-item behavior, not equality of
  randomly drawn question order across browser contexts. Quick practice stays
  Study mode with the requested ten items.
- After learner readiness, a separately held active-session read accepts one
  pending intent without drawing. Release to empty/untouched state constructs
  exactly once; release to protected work prompts once. Escape consumes no
  draw, preserves the hydrated snapshot, and restores initiating focus.
- Parent coverage passes for standalone/case-part drafts, submitted adaptive
  work, skipped review, Keep/Escape, re-request, retained Builder selections,
  Library/Home return context, all launch families, completed Summary related
  practice, and rapid duplicate request/confirmation.
- An earlier active save's native put-success delivery is deliberately held,
  keeping its save promise unresolved while replacement is confirmed. The
  new set remains invisible and cannot enqueue a storage write ahead of it.
  Release yields old ID, new ID, then the same new ID's ordinary autosave.
  No old ID follows replacement. One new session is constructed, and immediate
  reload resumes that new identity with durable IndexedDB.
- Ordinary production file:// launch, replacement, and within-runtime Resume
  pass. A second file context with IndexedDB deliberately unavailable passes
  the same operations through existing memory fallback. Neither file test
  claims reload durability. All page-error assertions pass.

The browser fixture was corrected during test development so the uploaded
copy was also seen in the weighted-priority comparison. Cancellation compares
the exact hydrated snapshot, accounting for the existing serializer adding
optional undefined fields when comparing against an initial fixture. These
were harness corrections; neither required another production-code change.

## Layout and focus

Visually inspected [mobile startup](mobile-startup-loading.png),
[mobile delayed status](mobile-startup-delayed.png),
[mobile dialog](mobile-replacement-dialog.png),
[desktop delayed status](desktop-startup-delayed.png),
[desktop dialog](desktop-replacement-dialog.png), and
[file fallback dialog](file-fallback-dialog.png).
The mobile startup measurement is: main/header gap 0 px, content/status gap
16 px, horizontal overflow 0 px. The bilingual status and dialog fit.

The parent safe initial focus and Keep/Escape restoration remain intact.
Future shell work must keep the initiating control mounted while a request is
pending or deliberately provide an equivalent focus-restoration target;
relocation/remounting cannot be assumed harmless.

## Verification

[Command results](verification-results.json) retain outputs. All required
R1 section 10 commands passed against these source inputs:

| Command | Result |
| --- | --- |
| npm run test:session-start-guard | PASS |
| npm run test:session-navigation | PASS |
| npx tsx scripts/tests/session-sampler.ts | PASS |
| npm run test:storage-category-migration | PASS |
| npm run test:flashcard-pass | PASS |
| npx tsc -b --pretty false | PASS |
| npm run census:check | PASS, no drift; no regeneration |
| npm run build | PASS, including direct-file rewrite and build-identity validation |
| git diff --check | PASS |

The build reports the existing large-chunk advisory. Source hashes bind the
tested build to the implementation commit; creating the commit and this
evidence packet did not change the tested application inputs.

Repeat the browser proof after building and running production preview with:

```sh
npm run preview -- --host 127.0.0.1 --port 4174 --strictPort
PLAYWRIGHT_MODULE=/tmp/shrimp-ux-browser/node_modules/playwright/index.mjs node --import tsx scripts/tests/session-start-browser.mjs
```

PLAYWRIGHT_MODULE may point to another installed Playwright module; otherwise
the driver imports playwright normally. UX0B_BASE_URL and UX0B_EVIDENCE_DIR
override the preview URL and evidence directory. UX0B_NEGATIVE_CONTROL=1 runs
the expected-failure readiness mutation; give it a separate evidence directory.

## Preserved scope and follow-ups

Storage internals, persisted shapes, banks, schema, grading, sampler rules,
renderers, census, Vocab/SRS behavior, file architecture, and unrelated work
are unchanged. No source drift or storage escalation was required.

Separate follow-up: the existing IndexedDB open path has no blocked/blocking
handlers. An older open connection can delay a future upgrade indefinitely.
R1 preserves that persistence behavior and supplies only the delayed message.

Before shell integration, Luke's informative target-phone cold-start timing
check remains outstanding. This browser run does not represent the learner's
phone or her current uploaded-bank/progress volume. Per the work order, that
owner timing observation is not a Codex implementation acceptance blocker.
