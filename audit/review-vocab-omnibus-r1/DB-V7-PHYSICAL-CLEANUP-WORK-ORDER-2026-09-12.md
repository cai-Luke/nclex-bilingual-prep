# Project Shrimp — DB v7 physical cleanup

**Implementation work order**

Date: 2026-09-12
Owner disposition: authorized for implementation after independent acceptance of the Review/Vocabulary omnibus R1 + R1.1
Producer target: Codex / Astra
Independent checker target: Claude/Opus after producer completion

This is a **bounded storage-maintenance commission**. It is not a Review/Vocabulary redesign, learner-UX change, sampler change, schema change, content change, grading change, or refactor commission.

The purpose is to finish the deliberately deferred physical database cleanup that the accepted Review/Vocabulary omnibus left inert at DB v6.

---

## 0. Repository target and recovery discipline

Canonical implementation source:

- worktree: `./Project Shrimp Review Vocab R1`
- accepted branch: `codex/review-vocab-omnibus-r1`
- accepted application HEAD: `e251dad`
- accepted omnibus sentinel supplied by the independent review: `REVIEW_VOCAB_OMNIBUS_R1_INDEPENDENTLY_ACCEPTED`

Before editing, read live disk rather than relying on this work order's restatements. At minimum read:

- `AGENTS.md`
- `docs/AGENTS-RUNBOOK.md` as needed for exact commands/browser evidence procedure
- `DECISIONS.md` P2/P5 and repository-state hygiene
- `src/storage.ts`
- `src/types.ts`
- `src/progressMigration.ts`
- `scripts/tests/review-storage.ts`
- `scripts/tests/review-migration-failure.ts`
- `scripts/tests/completed-memory.ts`
- `scripts/tests/review-vocab-lifecycle-browser.mjs`
- `audit/review-vocab-omnibus-r1/PROJECT-SHRIMP-REVIEW-VOCAB-OMNIBUS-BRIEF-2026-09-12.md`
- `audit/review-vocab-omnibus-r1/authorization.txt`
- `audit/review-vocab-omnibus-r1/implementation-receipt.md`
- `audit/review-vocab-omnibus-r1/r1-1/receipt.md`

Also inspect the default `./Project Shrimp` checkout only as historical v5 writer/evidence. It is **not** the application source baseline for this commission.

This work order may initially be the only uncommitted file in the accepted R1 worktree. If creating an isolated implementation worktree/branch from `e251dad`, copy this work order into that worktree byte-for-byte before production edits and retain it as the governing on-disk commission.

Create an isolated implementation branch/worktree for v7. Do not push, merge, or deploy unless separately authorized. Preserve unrelated work.

If the accepted source is not reconstructable at `e251dad`, if the worktree contains unrelated production edits, or if a source-of-truth conflict changes the deletion allowlist below, stop and report rather than silently broadening scope.

---

## 1. Accepted precondition

The Review/Vocabulary omnibus intentionally stopped at IndexedDB v6 so the following could survive independent review before destructive cleanup:

- `needsReview` migration;
- submission identity/idempotency;
- active-session durability;
- Last-set persistence and completion ordering;
- blocked/failure behavior.

That independent acceptance has now occurred. The deferred v7 cleanup is therefore authorized.

Do **not** reopen the accepted omnibus architecture. DB v7 is subtraction only.

---

## 2. Exact destructive allowlist

### 2.1 Delete exactly four obsolete object stores

Delete these stores if present:

| Store | Historical key path | v7 disposition |
|---|---|---|
| `flashcardProgress` | `termId` | delete store and all records |
| `languageMisses` | `questionId` | delete store and all records |
| `translationRevealEvents` | `id` | delete store and all records |
| `caseAnswerPartEvents` | `id` | delete store and all records |

They are dropped without migration. Do not reinterpret their contents as Saved, Needs review, glossary state, vocabulary state, completed history, answer events, analytics, or anything else.

Do not delete an unexpected object store merely because it is absent from the current `PrepDb` TypeScript interface. An unexpected store is a stop-and-escalate condition for destructive cleanup.

### 2.2 Delete exactly six obsolete properties from `progress` rows

Define **one exported constant** in production storage/migration code for the exact six physical legacy keys:

```text
missed
correctStreak
srsDueAt
srsIntervalDays
srsEase
srsLapses
```

The v7 migration and every v7 structural test/post-condition must consume that same exported constant. Do not duplicate the deletion list in test code.

Physical deletion means property absence. Do not retain these keys with `undefined`, `null`, zero, or sentinel values.

### 2.3 Preserve the current progress contract

The accepted progress keys are:

```text
questionId
seen
correct
incorrect
needsReview
migrationDiagnostic   // optional
lastSeenAt             // optional
```

Preserve every pre-existing retained key and value exactly. `migrationDiagnostic` is accepted state, not debris.

For a diagnostic-bearing migrated row after a later normal submission, the durable row should still contain exactly the seven retained names above and none of the six retired names. For rows where optional fields were absent before, do not invent them merely to satisfy a fixed property count.

### 2.4 Do not reconstruct progress from a whitelist

The destructive cleanup is an allowlisted deletion, not row reconstruction.

Before destructive migration of a genuine historical fixture, compute the union of observed `progress` property names and assert that it is a subset of:

```text
{ seven retained names } ∪ { six authorized deleted names }
```

If an unexpected historical progress property is observed:

- do not delete it;
- do not silently preserve it and continue as though the migration is fully characterized;
- stop and escalate the finding for owner disposition.

This guard exists so the six-property cleanup remains evidence-bound to shipped state.

---

## 3. Retained database state

DB v7 must retain these six current stores:

```text
uploadedQuestions
progress
activeSession
flags
answerEvents
completedSets
```

Do not transform rows in the five non-`progress` retained stores.

Preserve, among other things:

- uploaded question records and IDs;
- Saved/flag boolean, note, and timestamp;
- ordinary answer-event identity and chronology;
- active-session ID, membership, drafts, attempts, results, scores, skip phase, launch intent, return view, fingerprints, and adaptive metadata;
- the existing Last-set `completedSets` record and stored outcomes.

Do not clean localStorage in this commission. Preserve settings and unrelated localStorage keys.

Do not prune progress for questions missing from the current bundled banks.

Do not change `CompletedSet.version`, bank schema versions, question schema, or any learner-facing data contract.

---

## 4. Version behavior

Set IndexedDB `DB_VERSION` from 6 to 7.

The version paths must have these semantics.

### Fresh database / oldVersion = 0

Create only the six current stores. Never create a retired store merely to delete it later.

### Existing v6 database

Perform **only physical cleanup**:

- delete the four retired stores if present;
- remove the six retired progress properties if present;
- do not rerun semantic `needsReview` inference;
- do not reinterpret old answer events;
- do not recalculate counters or timestamps.

### Existing pre-v6 database

Preserve the accepted semantic migration for users who skip directly to the v7 build.

The final result must be equivalent to:

1. accepted pre-v6 → v6 `needsReview` migration and `completedSets` creation;
2. then the v7 physical deletion allowlist;
3. all in the same versionchange transaction.

The implementer may fuse progress passes if that is safer/cleaner. Loop count is not contractual. Final state and transaction atomicity are contractual.

For a genuine v5 fixture, the post-upgrade store-set formula is:

```text
v5 stores − four retired stores + completedSets
```

For a genuine v6 fixture, the post-upgrade store-set formula is:

```text
v6 stores − four retired stores
```

Both yield the six current stores for the known historical schema.

### Existing v7 database

Open without further mutation. Repeated opens are idempotent.

### Old v6 application opened against committed v7

Do not invent downgrade support. The old build may fail to open the higher-version database and fall back according to its existing persistence behavior, but it must not delete, recreate, downgrade, or otherwise destroy the committed v7 database.

---

## 5. Upgrade transaction safety

All destructive v7 work must occur inside the single IndexedDB **versionchange transaction** created by the v7 open request.

### Hard constraint: no non-IDB awaits inside the upgrade

The installed `idb` package invokes the `upgrade(...)` callback without awaiting its returned promise. Therefore:

- every `await` used inside upgrade work must resolve from requests belonging to the active versionchange transaction;
- no timers;
- no `requestAnimationFrame`;
- no fetch/network;
- no filesystem work;
- no unrelated promises;
- no out-of-transaction database reads;
- no macrotask yield between destructive operations.

A foreign await can allow the versionchange transaction to auto-commit before cleanup finishes, producing a committed v7 with partial deletion and no normal retry path.

### Error boundary

Any failure during:

- pre-v6 semantic progress migration;
- v7 progress cleanup;
- retired-store deletion;

must abort the versionchange transaction.

Do not rely on an uncaught asynchronous exception from an `async upgrade()` callback to abort the transaction. Catch failures inside the upgrade execution path and explicitly abort when needed, while avoiding unhandled rejection noise.

After abort, the original old-version database must remain intact.

---

## 6. Do not refactor accepted storage behavior

This commission does not authorize opportunistic cleanup around the migration.

In particular:

- preserve blocked/opening/late-connection policy unless a v7-specific test proves a defect;
- preserve memory fallback semantics;
- preserve submission identity and atomic commit behavior;
- preserve active-session replacement protection;
- preserve completion transaction ordering;
- preserve Last-set archive eligibility;
- preserve `put({ ...existing, ...progress })` or behaviorally equivalent preservation of non-target row metadata;
- update comments that specifically say v7 cleanup is still deferred, but do not use that as an excuse to redesign the writer.

The previously discussed `existing!` assertion and `memorySessionOnly` lifecycle nit remain out of scope absent new v7-specific evidence.

---

## 7. Historical fixture requirements

Do not establish the destructive allowlist only from hand-authored synthetic rows.

### 7.1 Genuine v5 writer

Use the actual historical v5 application/storage implementation from the default `./Project Shrimp` checkout to create the historical database state used for at least one migration path.

The purpose is to observe what the shipped writer actually places on disk rather than trusting only a TypeScript declaration.

Populate meaningful data, including where feasible:

- progress with miss/correct history and SRS columns;
- flags, including Saved and note-only rows;
- answer events;
- active session;
- uploaded questions;
- data in all four retired stores.

Before allowing destructive migration, inspect the observed `progress` key union against §2.4.

### 7.2 Genuine v6 starting state

Run the accepted v6 implementation against historical state and then exercise real v6 behavior so the v7 fixture contains **current learner state plus stale legacy physical columns**.

At minimum construct two v6 progress states where stale legacy fields disagree with the current truth:

- current `needsReview: true` after a v6 miss while a legacy positive `correctStreak` remains inert;
- current `needsReview: false` after a v6 full-marks attempt while stale legacy `missed`/streak values remain inert.

Also retain a `migrationDiagnostic`-bearing row so later writes can prove that accepted metadata survives v7 and post-v7 submissions.

Populate a durable Last set and resumable active work before the v7 upgrade.

Synthetic fixtures may supplement these cases, but they do not replace the genuine historical writer path.

---

## 8. Required deterministic verification

Add focused v7 regression coverage. Preserve existing v6 behavioral tests; replace only assertions whose purpose was to prove that physical cleanup remained deferred.

### A. Populated v6 → v7 exact subtraction

Capture raw durable pre-upgrade state through an independent/native IndexedDB connection.

After migration assert:

- version = 7;
- store set = prior v6 store set minus exactly the four retired stores;
- every progress row still exists;
- each progress row differs only by absence of authorized retired properties;
- every retained key/value is unchanged;
- all other retained stores have identical keys and values;
- localStorage is unchanged.

Do not prove preservation only through app loaders, because they can fall back to memory.

### B. Partial legacy presence

Upgrade databases containing:

- all four retired stores;
- some retired stores;
- none of the retired stores;
- progress rows with all six retired fields;
- progress rows with only some retired fields;
- progress rows with none of them.

All characterized cases must converge safely to the same v7 contract.

### C. Direct pre-v6 → v7

Prove the accepted `needsReview` semantic migration still occurs before/with cleanup for skip-version users.

Assert the correct direct-upgrade store formula:

```text
before − four retired + completedSets
```

Do not assert the v6-only `before − four` formula on a v5 fixture.

### D. Fresh v7 and repeated open

A fresh database contains only the six current stores. Reopening v7 repeatedly causes no data mutation and no second migration.

### E. Rollback after destructive progress has begun

Failure injection must prove atomic rollback after real migration mutation, not only failure before the first write.

Cover enough locations to demonstrate at least:

- a progress cleanup/update has succeeded before a later injected failure; and
- a retired-store deletion or another destructive schema operation has occurred before a later injected failure.

After abort, independently inspect and assert:

- old database version remains unchanged;
- all old stores are restored/present as before;
- retired-store contents are intact;
- progress rows are intact, including retired columns;
- active work is intact;
- Last set is intact.

Then remove the injected failure and prove a retry succeeds.

### F. Transaction-lifetime detector negative control

Add one focused test-harness negative control that deliberately introduces a forbidden foreign/macrotask yield into a test-only broken migration path and demonstrates that the structural post-condition verifier detects the invalid partial/incorrect outcome.

This negative control validates the verifier. It does **not** authorize a second production migration framework and does not make the exact artificial mechanism part of application architecture.

Keep it small and isolated from production code.

### G. Post-migration normal write

After successful v7 migration, submit normally against a migrated row.

For a diagnostic-bearing fixture row, independently inspect the durable `progress` object and assert it contains exactly:

```text
questionId
seen
correct
incorrect
needsReview
migrationDiagnostic
lastSeenAt
```

and none of the six retired keys.

For rows without optional fields, assert the durable key set is a subset of the seven retained names, preserves all previously present retained metadata, and contains none of the six retired names.

This closes the possibility that a stale in-memory/runtime write path reintroduces physical legacy fields.

### H. Accepted lifecycle regression

After v7 migration prove, at minimum:

- resumable active work survives and can continue;
- existing Last set reopens with stored historical outcomes rather than regrading;
- a new submission remains idempotent;
- completion preserves accepted archive/active ordering;
- remediation still cannot overwrite Last set;
- Saved and `needsReview` remain independent.

Do not reopen unrelated UX acceptance merely because the database version changed.

---

## 9. Required real-browser verification

Use current system Chrome/Chromium under an isolated project-test profile. Browser producer evidence remains producer evidence; the later Claude check is separate.

### 9.1 Real populated migration

Exercise a genuine populated v6 database through v7 in Chrome and independently inspect durable IndexedDB before and after.

### 9.2 Real blocked upgrade

Hold an older database connection open in another tab/context so the actual browser emits `blocked` for v7.

Verify:

- the new app reports blocked/memory persistence honestly rather than false readiness;
- the holder can be released;
- the previously queued open request's late completion/closure behavior is observed rather than hidden by an immediate reload;
- subsequent retry/reload recovers;
- no stale cached DB handle or zombie connection prevents future use;
- durable learner data is unchanged through the block.

Preserve the accepted blocking policy unless this test establishes a concrete v7 defect.

### 9.3 Old v6 app against committed v7

After a successful v7 commit, open the accepted v6 build against that same database identity.

Confirm:

- it does not downgrade or delete v7;
- it fails/falls back safely according to its existing behavior;
- reopening with v7 finds the database and learner data intact.

This is a compatibility observation, not a promise of downgrade support.

### 9.4 Built `file://`

Exercise the actual built production `file://` artifact, not an HTTP substitute.

Maintain the same effective browser storage identity across the migration fixture. Explicitly prove the pre-existing v6 database is visible before opening the v7 artifact so the test cannot accidentally pass as a fresh install.

After successful migration and browser restart, prove durable Last set and active/progress state survive.

If local browser tooling cannot honestly preserve one `file://` storage identity across versions, report that limitation and use the strongest permitted local route rather than faking the condition.

---

## 10. Required project gates

At minimum run the focused storage/lifecycle checks plus the repository's current risk-appropriate full path for a storage/data-contract version change.

Expected commands include:

```text
npm run test:review-memory
npm run test:session-navigation
npm run test:session-start-guard
npm run test:session-sampler
npm run test:grading
npm run test:storage-category-migration
npm run validate-bank -- banks/*.json
npm run audit
npx tsc -b --pretty false
npm run census:check
npm run build
git diff --check
```

Add a dedicated v7 test command or wire the new tests into `test:review-memory` so the verification route is obvious.

No census movement is expected. Do not regenerate census artifacts merely because `census:check` fails; investigate the failure.

No bank, schema-validator, grading, sampler, visual, bilingual, UI/CSS, or canonical content source is authorized to change. If a required fix unexpectedly enters one of those areas, stop and report rather than broadening scope.

---

## 11. Scope checks and forbidden opportunism

The final production diff should be limited to storage migration code and directly necessary test/evidence wiring.

A small helper module is acceptable only if it makes the deletion contract safer or easier to test. Do not introduce a storage abstraction rewrite.

Explicitly forbidden without a new owner disposition:

- learner UX/copy changes;
- session-selection changes;
- Needs-review reservation changes;
- Last-set semantic changes;
- Saved semantic changes;
- bilingual/reveal/glossary changes;
- question fingerprint changes;
- active-session model changes;
- submission/completion redesign;
- bank/schema/grading/visual changes;
- database compaction unrelated to the six progress keys/four stores;
- removal of unknown keys/stores;
- localStorage cleanup;
- compatibility layers for retired Vocabulary/Review concepts;
- downgrade/reverse-migration machinery;
- opportunistic fixes to previously deferred storage nits.

---

## 12. Evidence packet

Create:

`audit/review-vocab-omnibus-r1/db-v7-physical-cleanup-r1/`

Include a concise implementation receipt and machine-readable results where useful.

The receipt must state:

- starting accepted HEAD and implementation branch/worktree;
- commits and changed production/test files;
- exact four-store deletion list;
- exact six-property exported constant;
- observed historical progress key union from the genuine fixture;
- pre-v6 direct-upgrade result;
- genuine v6→v7 before/after structural comparison;
- rollback fault locations and intact-v6 proof;
- verifier negative-control result;
- post-migration submission durable key-set result;
- blocked-upgrade result, including late queued request behavior;
- old-v6-build-against-v7 result;
- browser restart and `file://` durability result;
- project gate results;
- explicit confirmation that no learner behavior, sampler, Last-set semantics, Saved semantics, bilingual behavior, banks, grading, schema, or visuals changed;
- any deviation, limitation, or unexpected historical property/store discovered.

Do not self-certify independent acceptance.

---

## 13. Producer completion boundary

The producer may claim readiness only when all of the following are true:

1. DB version is 7.
2. Exactly four authorized retired stores are physically gone when present.
3. Exactly six authorized legacy progress properties are physically gone when present.
4. No unexpected progress property/store was destructively removed.
5. Genuine v6 learner state is otherwise preserved exactly.
6. Direct pre-v6 users still receive the accepted semantic migration plus `completedSets` creation.
7. Failed migration after destructive progress rolls back to intact old-version state and retry succeeds.
8. No forbidden foreign await exists in production upgrade work.
9. Normal post-v7 writes do not reintroduce retired properties or drop accepted metadata.
10. Real blocked upgrade, safe old-build access, browser restart, and built `file://` evidence pass or an explicit tooling limitation is reported without substituting fake evidence.
11. Required project gates pass.
12. Final diff remains inside this commission.

Finish the producer receipt/report with exactly:

`DB_V7_PHYSICAL_CLEANUP_READY_FOR_INDEPENDENT_REVIEW`

The next seat is an independent Claude/Opus conformance review. The producer must not issue an independent-acceptance sentinel.
