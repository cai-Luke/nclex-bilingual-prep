# Project Shrimp — Review/Vocabulary Omnibus R1.1

## Purpose

Resolve the single sampler concern raised during the interrupted independent review of the Review/Vocabulary omnibus.

This is a **narrow owner clarification and semantic cleanup**, not a reopening of the omnibus implementation.

Do not modify unrelated Review/Vocabulary behavior. Do not address reviewer nits outside this commission. Do not perform DB v7 cleanup.

---

## Repository target

Worktree:

`/Users/holemini/Desktop/Project Shrimp Review Vocab R1`

Branch:

`codex/review-vocab-omnibus-r1`

Current reviewed producer HEAD:

`4405114`

Start by reading live disk, including `AGENTS.md`, the runbook as needed, and:

* `src/sessionSampler.ts`
* `scripts/tests/session-sampler.ts`
* `audit/review-vocab-omnibus-r1/PROJECT-SHRIMP-REVIEW-VOCAB-OMNIBUS-BRIEF-2026-09-12.md`
* `audit/review-vocab-omnibus-r1/authorization.txt`
* `audit/review-vocab-omnibus-r1/implementation-receipt.md`

Confirm the worktree is clean and still at the expected branch/commit before editing.

Do not push or merge.

---

# Background

The interrupted independent review cleared the sampler's major behavioral structure:

* the amended reservation formula is implemented;
* reservation precedes the ordinary tier loop;
* global category borrowing is implemented;
* visual floors retain minimum-tier preference;
* a reserved visual can satisfy a floor;
* deduplication works;
* toggle-off exclusion works;
* ordinary tier-1 backfill may exceed the reserved remediation amount;
* explicit populations do not backfill.

The reviewer raised one concern:

`reviewReservation` receives the originally requested count rather than the sampler's actual deliverable target.

In the weighted path, live source already computes:

`targetCount = min(floor(requested count), eligible.length)`

but later calls:

`reviewReservation(count, ...)`

The unweighted path similarly computes the review reservation from requested `count` before its final slice.

The reviewer illustrated this with a request for 50 questions against only 12 eligible questions.

---

# Owner clarification

The reserved Needs-review slice is conceptually defined against the number of questions the sampler can actually attempt to deliver in that session after eligibility filtering.

Define:

`N_effective = min(normalized requested count, eligible ordinary-study pool size)`

Then:

* toggle off → `R = 0`
* empty review pool → `R = 0`
* `N_effective < 5` → `R = 0`
* otherwise:

`R = min(reviewPoolSize, max(1, floor(N_effective / 5)))`

For weighted Study, use the existing `targetCount`.

For unweighted Study, compute the analogous effective target after deduplication and ordinary-study exclusion.

This supersedes the earlier interpretation of `N` as the raw requested count for purposes of the **reservation calculation only**.

---

# Important semantic distinction

Do **not** turn the one-in-five reservation into a hard cap on Needs-review questions.

`R` remains a guaranteed reserved floor only.

Ordinary tier filling/backfill may still cause more Needs-review questions to appear after unseen material is exhausted.

This matters to the reviewer's example.

If the learner requests 50 but only 12 questions are eligible, and 10 of those 12 need review:

* the guaranteed reserved slice should be calculated from 12, so `R = 2`;
* nevertheless, the completed 12-question set may still contain all 10 Needs-review questions because ordinary backfill is allowed and all 12 eligible questions must ultimately be used.

Therefore do **not** claim that this patch changes that example from a 10/12 review set into a 2/12 review set.

The correction is to the semantics and accounting of the **reserved slice**, not to establish a 20% maximum on final review composition.

This distinction should be explicit in tests and in the receipt.

---

# Required implementation

## Weighted sampler

In `buildWeightedSession`, the existing `targetCount` is already calculated after:

* deduplication;
* case-study exclusion;
* `Revisit missed questions` exclusion when disabled.

Use that `targetCount` when calculating the reserved review slice.

Do not otherwise alter:

* eligible-pool construction;
* category apportionment;
* global borrowing;
* least-recently-attempted ordering;
* visual-floor logic;
* minimum-tier preference;
* diversity weighting;
* ordinary tier ordering;
* final shuffle.

## Unweighted sampler

Establish the equivalent effective target after the existing pool has been deduplicated and filtered for the `revisitMissed` setting.

Use that effective target for `reviewReservation`.

The final returned set must remain bounded to that same effective target.

For valid ordinary integer set sizes, this should preserve existing output behavior except for the corrected reservation accounting in under-capacity cases.

Do not redesign unweighted ordering.

---

# Required regression coverage

Extend the focused sampler tests rather than replacing existing omnibus acceptance tests.

Preserve all current assertions for:

* N = 2 → 0
* N = 4 → 0
* N = 5 → 1
* N = 10 → 2
* N = 25 → 5
* N = 50 → 10
* concentrated backlog borrowing;
* toggle-off exclusion;
* tier-1 backfill;
* visual-floor interaction;
* explicit populations.

Add an explicit under-capacity regression demonstrating the clarified definition.

At minimum cover the conceptual case:

* requested = 50;
* effective eligible target = 12;
* review pool = 10;
* reserved amount = 2.

Also cover the equivalent unweighted path.

The test must distinguish between:

**reserved review count**

and

**total review questions eventually delivered after ordinary backfill**.

It is acceptable — and expected in a fully exhausted 12-item pool — for the final delivered set to contain more than two Needs-review questions.

Add a regression ensuring the patch does not accidentally impose a hard 20% review cap.

If the cleanest test requires a tiny pure helper or explicit target calculation, keep it narrowly scoped. Do not introduce a new sampler abstraction merely to make the test convenient.

---

# Reviewer nits are out of scope

The interrupted reviewer also mentioned:

1. the `existing!` assertion after finding a prior submission event;
2. `memorySessionOnly = true` after an `"Unobserved active set"` abort.

Do **not** modify either in this pass.

They were not established as learner-visible defects, and changing storage/lifecycle behavior would unnecessarily invalidate much more of the independent review.

Likewise, do not touch:

* submission idempotency;
* completion idempotency;
* Last-set storage;
* fingerprinting;
* migration;
* launch-intent tagging;
* bilingual behavior;
* glossary behavior;
* UI/CSS;
* banks;
* schema;
* grading;
* visuals.

---

# Governance/evidence

Preserve the original `4405114` implementation receipt as historical producer evidence.

Add a small R1.1 audit artifact under the existing omnibus audit area documenting:

* the interrupted review finding;
* this owner clarification;
* the exact code change;
* focused regression results;
* confirmation that `R` remains a floor rather than a final-composition cap;
* confirmation that no other independent-review finding was acted upon.

Do not rewrite history to imply the original implementation was independently rejected. It was not.

The independent review was interrupted before a sentinel was issued.

---

# Verification

At minimum run:

`npm run test:session-sampler`

`npx tsc -b --pretty false`

`npm run build`

Also run any directly implicated sampler/session check that live repository conventions require.

No bank, schema, grading, or visual source is authorized to change. If the diff unexpectedly enters one of those risk classes, stop and report rather than broadening the commission.

Inspect the final diff and confirm it is limited to the sampler, its focused tests, and R1.1 audit evidence.

---

# Commit / handoff

Commit the completed narrow pass on the existing:

`codex/review-vocab-omnibus-r1`

branch.

Do not push or merge.

Report:

* starting HEAD;
* ending HEAD;
* changed files;
* exact effective-target rule;
* weighted/unweighted regression evidence;
* verification results;
* confirmation that tier-1 review backfill remains uncapped;
* confirmation that no other omnibus behavior was changed;
* confirmation that DB v7 remains deferred.

Finish with:

`REVIEW_VOCAB_OMNIBUS_R1_1_READY_FOR_REPEAT_INDEPENDENT_REVIEW`
