# DB v7 physical cleanup — independent conformance review

**Checker:** Claude Code / Claude Sonnet 5
**Producer:** Codex / Astra, `codex/db-v7-physical-cleanup-r1`
**Reviewed commits:** `768b1446396f9fab2884978a120fdb9dbd606977`, `05351ca654a3c82902e35f175623a4f4cf4c1466`
**Evidence-bearing producer HEAD:** `bc76e6bac45b399bbf3ce370c3c052735f2ba3c0`
**Accepted baseline:** `e251dada5827a3862f5de9047326a654d64a88a5` (`codex/review-vocab-omnibus-r1`)
**Governing work order:** `audit/review-vocab-omnibus-r1/DB-V7-PHYSICAL-CLEANUP-WORK-ORDER-2026-09-12.md`
**Review worktree/branch:** `/Users/holemini/Desktop/Project Shrimp DB-V7 Claude Review`, `review/db-v7-physical-cleanup-claude-2026-09-12-r1`

## Verdict: ACCEPT

## What was verified independently (not taken from producer receipts)

**Commit graph.** `e251dad` confirmed as the exact tip of `codex/review-vocab-omnibus-r1` and an ancestor of `05351ca`; `768b144` an ancestor of `05351ca`; `05351ca` an ancestor of `bc76e6b`. Full commit list `e251dad..bc76e6b` is exactly the three named commits — no extraneous history.

**Diff scope.** `git diff --stat e251dad 05351ca` touches exactly 9 files: the governing work order copy, `package.json` (two new test script entries only), three new dedicated test files (`db-v7-cleanup.mjs`, `db-v7-structure.mjs`, `db-v7-browser.mjs`), two existing test files with only version-number/key-set assertions tightened (never weakened — `review-storage.ts` now asserts absence of *every* `RETIRED_PROGRESS_KEYS` member, not just one), and the two production files `src/progressMigration.ts` and `src/storage.ts`. No bank, schema, grading, sampler, visual, or UI/CSS file appears in the diff.

**`src/progressMigration.ts` diff read in full.** Adds one exported `RETIRED_PROGRESS_KEYS` constant (`missed, correctStreak, srsDueAt, srsIntervalDays, srsEase, srsLapses`) — matches work order §2.2 exactly. `migrateProgress` logic itself is unchanged; only a comment was updated.

**`src/storage.ts` diff read in full and traced against the work order clause by clause:**
- `DB_VERSION` 6 → 7.
- Unexpected-object-store check runs before any store is created or deleted, over the *complete* pre-upgrade store set, throwing on anything outside `currentStores ∪ retiredStores` (work order §2.1 stop-and-escalate).
- Missing-current-store handling: created only when `oldVersion < 6` (fresh/pre-v6); throws `Missing current object store` when `oldVersion >= 6` (the second commit's guard, matching its title "Keep incomplete v6 schemas intact rather than repairing during cleanup" — confirmed by isolating `git diff 768b144 05351ca -- src/storage.ts`).
- Unexpected-progress-key check runs over the full `getAll()` result *before* any row is mutated or any store dropped, throwing on any key outside `retainedKeys ∪ RETIRED_PROGRESS_KEYS` (work order §2.4).
- Property deletion is literal `delete row[key]` — physical absence, not sentinel values (work order §2.2/§2.2's "physical deletion" clause).
- Pre-v6 branch runs `migrateProgress` (preserving the accepted semantic migration) and *then* strips any retired keys the migration's `...row` spread carried forward — satisfies both the v5→v7 formula and the six-property cleanup on the same rows.
- v6-only branch does not call `migrateProgress`, does not touch `answerEvents`, and skips `cursor.update` entirely when a row has no retired keys — no gratuitous writes.
- Retired-store deletion happens last, only for stores actually present.
- Every `await` inside the upgrade resolves from the active versionchange transaction's own requests (`progressStore.getAll/openCursor/continue`, `cursor.update`, and conditionally `answerEvents.getAll`) — no timer, network, or foreign promise. This matches the hard "no non-IDB awaits" constraint in work order §5.
- A single `catch` wraps the entire upgrade body and calls `tx.abort()` — covers both synchronous throws (unexpected store/key) and awaited-request rejections.
- `commitSubmission`'s `put({ ...existing, ...progress })` is byte-identical to the accepted baseline; only its comment changed (work order §6's non-negotiable).

**Deterministic suite — ran myself, not read from receipt:** `npm run test:db-v7` → all 13 scenario groups pass (all/some/no retired stores; all/some/none retired fields; missing-current-store/unknown-store/unknown-property abort; transaction-lifetime negative control; fresh/repeated-open; three independent rollback-fault-location scenarios; normal post-migration write). Output matches the producer's `deterministic-results.json` claims exactly.

**Regression suites — ran myself:** `test:review-memory`, `test:session-navigation`, `test:session-start-guard`, `test:session-sampler`, `test:grading`, `test:storage-category-migration` all pass, confirming Saved/Needs-review independence, Last-set read-only reopen, active-session/completion ordering, and grading are unchanged.

**Project gates — ran myself:** `validate-bank -- banks/*.json` (all 13 banks OK, `gpt-canonical.json` unchanged at 779 — confirming DB-v7 touched no bank content), `npm run audit` (GATE PASSED, same pre-existing warnings as the accepted baseline — the 66 residual-exception advisories and one unrelated `visual-canonical` distributional finding, nothing attributable to this change), `npx tsc -b --pretty false` (exit 0), `npm run census:check` (up to date — no movement, as expected for a storage-only change), `npm run build` (succeeds, same pre-existing chunk-size advisory), `git diff --check e251dad 05351ca` (clean).

**Real-browser verification — ran myself, in system Chrome via Playwright's `channel: 'chrome'`:** all 9 scenario groups in `scripts/tests/db-v7-browser.mjs` pass: genuine v5-writer characterization; populated v6→v7 exact subtraction with full native structural comparison; Last-set read-only reopen without regrading; old-v6-build-against-committed-v7 receiving `VersionError` and falling back safely without downgrading v7; genuine direct v5→v7 formula; real `blocked` event with honest status, release, and durable retry; built `file://` migration with full browser restart durability; resumed submission producing exactly one durable event with the correct 7-key retained set; post-migration completion/remediation/Saved/Needs-review independence.

## A process correction made during this review

My own default checkout (`/Users/holemini/Desktop/Project Shrimp`) is a load-bearing fixture reference: `scripts/tests/db-v7-browser.mjs` reads `../Project Shrimp/src/storage.ts` from whatever is checked out there as the "genuine historical v5 writer," asserting `DB_VERSION = 5`. I initially checked the DB-v7 review branch out directly into that directory, which put `DB_VERSION = 7` where the browser test expected `5`, and the first browser-suite run failed on that assertion (not on any producer defect). I restored the default checkout to `main` (confirmed genuine `DB_VERSION = 5`, since neither the Review/Vocabulary omnibus nor DB-v7 has been merged to mainline yet) and moved my actual review checkout to a new sibling worktree, `Project Shrimp DB-V7 Claude Review`, mirroring the producer's own isolation pattern. No content was lost — commits are shared across worktrees — but this is recorded here rather than silently corrected, per this project's disclosure norms.

## Explicit confirmations

- No learner semantics, bank content, grading behavior, Saved/Needs-review semantics, Last-set semantics, bilingual behavior, sampler behavior, or any storage contract outside the six-property/four-store allowlist changed.
- No forbidden foreign await exists in production upgrade work (traced by hand, confirmed by the transaction-lifetime negative control).
- No unexpected historical store or property was silently deleted; both are stop-and-escalate conditions, verified by dedicated deterministic tests (`missing-current-store`, `unknown-store`, `unknown-property`).
- Final diff remains inside the commissioned scope (storage migration + directly necessary test/evidence wiring only).
- This review did not self-certify; it independently re-derived every claim in the producer's `implementation-receipt.md` against live disk, git history, and freshly executed commands.

`DB_V7_PHYSICAL_CLEANUP_INDEPENDENTLY_ACCEPTED`
