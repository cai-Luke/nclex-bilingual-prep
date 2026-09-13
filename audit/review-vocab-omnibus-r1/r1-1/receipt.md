# Review/Vocabulary omnibus R1.1 — effective-target reservation

The single sampler clarification in the [owner work order](work-order.md) is implemented and ready for repeat independent review. The preceding independent review was interrupted before issuing a sentinel; this receipt does not characterize the original implementation as independently rejected or certify conformance.

- Disk snapshot: `/Users/holemini/Desktop/Project Shrimp Review Vocab R1`, branch `codex/review-vocab-omnibus-r1`, clean starting HEAD `440511469eec80da5ea64a5bca73a23c32b0c98d`.
- Changes are limited to `src/sessionSampler.ts`, additions to `scripts/tests/session-sampler.ts`, and this `r1-1/` evidence directory. The original [R1 implementation receipt](../implementation-receipt.md) and all other R1 evidence remain unchanged.
- No push, merge, or delegation was performed. PROJECT-HISTORY publication remains deferred to the post-review publishing seat.

The interrupted review identified both reservation calls using the raw requested count. The owner clarified that reservation accounting uses `N_effective = min(max(0, floor(requestedCount)), eligiblePoolSize)`, after deduplication and ordinary-study exclusions. Weighted eligibility continues to exclude cases. With the inclusion toggle off, an empty review pool, or `N_effective < 5`, `R = 0`; otherwise `R = min(reviewPoolSize, max(1, floor(N_effective / 5)))`.

The exact production change is small: weighted selection now passes its existing `targetCount` to `reviewReservation`; unweighted selection computes the analogous `targetCount` after its existing deduplication/filter, passes it to the reservation function, and uses it for the final slice. A comment clarifies the helper's effective-target input. No new sampler abstraction was introduced. Category apportionment, borrowing, recency ordering, visual floors and their minimum-tier preference, diversity weighting, ordinary tier ordering, and the final shuffle algorithms are unchanged.

The focused tests retain every original omnibus assertion and add the owner's exhausted-pool example to both paths. Across five seeds per path, requesting 50 from 12 unique eligible questions with 10 needing review reserves **2**, then delivers all **12**, including **10 review questions**. The other **8 review questions** come through ordinary backfill. Duplicate input rows, weighted case exclusion, and toggle-off reduction to the two unseen questions are also checked. A request for 50 must produce the same seeded ordered draw as a request for 12 against that same pool; checking membership alone could not detect the reservation error.

The regression failed on the original weighted call ([negative control](negative-control-weighted.log)). After only that call was corrected, weighted passed and the still-original unweighted call failed ([negative control](negative-control-unweighted.log)). Both pass after the final correction. These are producer test controls, not independent-review verdicts.

All [recorded verification commands](verification.json) passed: `npm run test:session-sampler`, `npm run test:session-navigation`, `npm run test:session-start-guard`, `npx tsc -b --pretty false`, `npm run build` (including file-build generation and build identity validation), `npm run census:check`, and `git diff --check`. The build reports the existing large-chunk advisory; census remains current without regeneration. [Scope verification](scope.json) confirms that the original receipt and all other tracked files outside the authorized sampler/test paths are unchanged.

**R remains a guaranteed reserved floor, not a final-composition cap.** Ordinary tier-1 review backfill remains uncapped. No other omnibus behavior or independent-review finding was acted upon, including the two specifically excluded storage/lifecycle nits. No UI, storage, migration, fingerprint, launch-intent, bilingual, glossary, bank, schema, grading, or visual source changed. DB v7 physical cleanup remains deferred under the owner work order.

`REVIEW_VOCAB_OMNIBUS_R1_1_READY_FOR_REPEAT_INDEPENDENT_REVIEW`
