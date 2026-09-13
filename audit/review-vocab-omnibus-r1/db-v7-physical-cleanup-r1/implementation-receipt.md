# DB v7 physical cleanup — producer receipt

Producer verification is complete. Independent Claude/Opus conformance review remains pending. No push, merge, deployment, bank promotion, or delegation occurred.

## Snapshot and scope

- Accepted application baseline: `e251dada5827a3862f5de9047326a654d64a88a5`, live branch `codex/review-vocab-omnibus-r1`. At preflight its only uncommitted file was the governing work order.
- Implementation worktree: `/Users/holemini/Desktop/Project Shrimp DB V7 R1`; branch `codex/db-v7-physical-cleanup-r1`.
- Implementation commits: `768b1446396f9fab2884978a120fdb9dbd606977` (migration, regression/browser harnesses, governing copy) and `05351ca654a3c82902e35f175623a4f4cf4c1466` (incomplete-v6-schema guard). The subsequent evidence-only commit contains this packet.
- The [governing work order](../DB-V7-PHYSICAL-CLEANUP-WORK-ORDER-2026-09-12.md) was copied byte-for-byte before production edits; SHA-256 `f988bf548d4ae4711aba4f6200f055bb0d32f0ffa30dc0965fe0ab00736bac26`.
- Production changes: `src/storage.ts` and `src/progressMigration.ts` only. Tests: new `scripts/tests/db-v7-cleanup.mjs`, `db-v7-structure.mjs`, and `db-v7-browser.mjs`; existing `review-storage.ts` and `review-migration-failure.ts` replace only deferred-cleanup/version assertions and reporting. `package.json` adds two explicit test commands. The existing v6 behavioral assertions remain.

[Source and artifact hashes](source-manifest.json) bind the final build/browser evidence to implementation commit `05351ca`. The default checkout was read only as the historical v5 writer at `1a95af44baf46ad7ccac5b5e3902faff5fa22ef0`; it was never the application baseline. This producer did not edit either source worktree's production files. Concurrent work moved the default checkout: the final browser report observed `d895d851`, and packet verification observed `1586f7b6`. Git comparisons prove the v5 storage writer and both runtime helpers are byte-identical across those snapshots and the initial `1a95af44`; the accepted R1 worktree stayed at `e251dad`. This movement is recorded in the manifest and did not change fixture inputs. PROJECT-HISTORY publication is deferred to the post-review publishing/merge seat.

## Physical contract

DB_VERSION is 7. The only dropped stores are `flashcardProgress`, `languageMisses`, `translationRevealEvents`, and `caseAnswerPartEvents`, when present. Their records are discarded without reinterpretation.

The single exported `RETIRED_PROGRESS_KEYS` constant in `src/progressMigration.ts` is exactly `missed`, `correctStreak`, `srsDueAt`, `srsIntervalDays`, `srsEase`, and `srsLapses`. Production cleanup and every new structural verifier consume it. Cleanup uses property deletion on the existing row, never reconstruction from retained keys.

The upgrade validates the historical store set and complete progress-key union before deleting data. Unknown stores/properties abort intact; an incomplete v6 store set also aborts instead of opportunistically repairing it. Fresh databases create only the six current stores. Pre-v6 upgrades retain the accepted semantic migration and completedSets creation, then delete the physical allowlist. V6 upgrades never infer Needs review or read answer events for that purpose. Reopening v7 performs no migration or writes.

All upgrade work is inside the open request's versionchange transaction. Its only awaits are IDB requests for progress getAll/openCursor/update/continue and, for pre-v6, answerEvents getAll. The enclosing catch explicitly aborts synchronous and asynchronous failures; transaction rejection is handled. No timer, network, foreign promise, or external I/O is awaited in production upgrade code. The accepted writer's metadata-preserving spread, blocking policy, fallback policy, and submission/completion logic remain intact.

## Historical and structural evidence

[Actual v5 writer output](genuine-v5-writer.json) contains meaningful progress, uploads, flags (Saved and note-only), answer events, active work, and records in all four retired stores. Observed progress-key union:

`correct`, `correctStreak`, `incorrect`, `lastSeenAt`, `missed`, `questionId`, `seen`, `srsDueAt`, `srsEase`, `srsIntervalDays`, `srsLapses`.

This is within the authorized union. No unexpected historical property or store was discovered. A separately disclosed [diagnostic supplement](supplemental-diagnostic-v5.json) removes one actual writer row's streak and matching top-level event, providing an ambiguous row without replacing the genuine writer path.

The accepted v6 implementation then performs real submissions/completion. In [v6 before](genuine-v6-before.json), one row has current `needsReview: true` with an inert positive streak; another has current `needsReview: false` with stale `missed: true` and zero streak. The diagnostic survives, Last set contains a submitted result, and another set retains an attempt, draft, skip phase, fingerprints, return intent, and adaptive metadata. The v6 key union adds only `needsReview` and `migrationDiagnostic` to the observed v5 union.

[Native v7 after](genuine-v7-after.json) equals v6 before minus exactly four stores and six properties. Every progress row, other retained store's keys/values and schema metadata, and localStorage entry is preserved. Progress for a question absent from current banks survives. The independent/native connections used for these comparisons never invoke application loaders.

[Genuine direct-v5 before](direct-v5-before.json) and [direct-v7 after](direct-v7-after.json) prove the distinct formula **before − four retired stores + completedSets**, with accepted one-correct clearing and zero-streak miss preservation. V6 uses **before − four retired stores**. Both produce six current stores.

## Rollback and deterministic checks

All thirteen [focused scenario groups](deterministic-results.json) pass, including all/some/no retired stores, all/some/no retired row fields, missing optional retained fields, fresh and repeated opens, malformed-schema protection, normal writes, and lifecycle regressions.

| Fault | Mutation completed before fault | Result |
|---|---|---|
| V6 cleanup update | First cursor update succeeded; next update throws | Whole original v6 database restored; retry succeeds |
| V6 store deletion | Two progress updates and first retired-store deletion succeeded; next deletion throws | Whole original v6 database restored; retry succeeds |
| Pre-v6 semantic/physical pass | First cursor update succeeded; next update throws | Whole original v5 database restored; retry succeeds |

The `deterministic-rollback-*-rollback.json` and corresponding `*-retry.json` artifacts retain raw before/aborted/retried states and mutation counts. Equality covers database version, every store, retired contents, legacy columns, active work, and a populated Last set. Faults are confined to native API instrumentation in the harness.

The [transaction-lifetime negative control](deterministic-negative-control-rejected-partial.json) deliberately yields to a timer after one store deletion. Its broken test-only migration commits partial v7, then receives InvalidStateError; the shared structural verifier rejects the committed state. No second production migration framework was introduced.

Normal post-v7 writes preserve diagnostics and never restore retired columns. Both the deterministic test and the [actual resumed browser submission](file-post-submit.json) independently verify exactly `questionId`, `seen`, `correct`, `incorrect`, `needsReview`, `migrationDiagnostic`, and `lastSeenAt` on the diagnostic row. A row without optional diagnostic metadata remains within the retained-key set without inventing that field. Concurrent/repeated submissions produce one durable event. Completion rollback preserves the old archive and active work together; retry archives and clears the matching active record. Remediation cannot overwrite Last set, and Saved remains independent of Needs review.

## Chrome and file evidence

All nine [browser scenario groups](browser-results.json) pass in system Chrome 152.0.7977.83 using isolated persistent test profiles, at 1280 × 900, with normal browser security. Profiles and temporary server/artifact directories were removed afterward.

- Actual populated v6→v7 and direct v5→v7 upgrades pass native structural comparisons. Existing Last set reopens read-only. A supplementary correct-answer/zero-stored-points control renders the stored zero outcome, proving that the viewer does not regrade history.
- The [blocked trace](blocked-trace.json) records request 0 blocked; request 1 queued; holder released; request 0 upgraded, succeeded, and closed; request 1 subsequently succeeded. The holder's entire native v6 state was unchanged while blocked. The blocked warning remained honest until reload; reload plus a durable retry recovered. No immediate reload hid the original late connection, and no stale handle prevented further use.
- The actual accepted v6 build, opened against the same committed v7 database identity, received VersionError and displayed its existing visit-only fallback. Raw v7 state stayed intact, and reopening v7 recovered it. No downgrade support was added.
- Both actual production builds used one fixed `file://…/live/index.html` location and one profile. The [preflight](file-v6-visible-before-artifact-swap.json) proves populated v6 was visible in the accepted built app before the v7 artifact replaced it. The [committed migration](file-v7-after.json) is exact subtraction. A complete Chrome close/relaunch retained [Last set, active work and progress](file-after-browser-restart.json). The resumed draft submitted through the v7 UI; three synchronous clicks produced one event. Completion and later remediation also passed.

**Evidence timing:** accepted startup refreshes `activeSession.updatedAt`. Initial timing-control artifacts document why snapshots after full hydration cannot establish exact migration subtraction. The final harness holds only delivery of the already-committed open-success event to the app, independently snapshots the database, then resumes hydration. It introduces no yield inside the upgrade. Subsequent hydration/restart comparisons explicitly allow only the existing timestamp refresh; all other durable values remain exact. The blocked follow-on startup request can likewise refresh that timestamp after the original blocked request closes. Production behavior was not changed to accommodate the harness.

There were no page/runtime exceptions. Chrome emitted the existing file-protocol webmanifest CORS/resource console messages in both accepted v6 and v7; IndexedDB, built application loading, and durable restart all passed without relaxing security. No required check was replaced by a manual witness or synthetic browser evidence, and no tooling limitation remains.

## Gates and boundary

[Project gate results](project-gates.json) and logs record PASS for review-memory, session-navigation, session-start-guard, session-sampler, grading, storage-category-migration, all-bank validation, aggregate audit, TypeScript, census:check, production build including file-build/identity validation, and diff checks. The dedicated deterministic and browser commands also pass. Audit retains its existing advisory stage-reference/distribution warnings and insufficient raw/promoted integrity population; the aggregate gate passes. Build retains the existing chunk-size advisory. Census is current and was not regenerated.

No learner behavior/copy, sampler, Last-set semantics, Saved semantics, bilingual/reveal/glossary behavior, active-session model, fingerprints, bank content, grading, schema/types/validator, visual code, or localStorage contract changed. There are no scope deviations or unresolved producer findings. All evidence here is producer evidence; independent acceptance is exclusively for the next Claude/Opus seat.

DB_V7_PHYSICAL_CLEANUP_READY_FOR_INDEPENDENT_REVIEW
