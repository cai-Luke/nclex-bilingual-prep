# DECISIONS Migration — Stage 2b Phase 2 Handoff

**Date:** 2026-08-08
**Seat:** Codex / shell-capable implementation producer
**Status:** Authorized. Phase 2 only. No later Stage 2b phase is authorized by this handoff.

This handoff is closed-world. Read the named repository files; do not rely on chat history.

## Authorized instrument

`DECISIONS-MIGRATION-STAGE-2B-PHASE-2-PRESERVATION-SNAPSHOT-WORK-ORDER-2026-08-08.md`

**Authorized identity — revision 2, `15047` bytes / SHA-256 `7cef5c4955b8ff1577d38a8bfe0aa869d59df69403d6e9b8e78b7a7799e2f9ee`.** Owner-measured externally on 2026-08-08 after the final revision-2 write; the architect seat independently re-confirmed the live byte length at `15047` before issuing this handoff. This is the sole authorization basis. Before doing any work, read the order from disk and independently confirm its byte length and SHA-256 against the identity above. Stop and report rather than proceeding if either does not match — the order may have been edited after authorization, which its own §0 forbids.

The order is complete and self-sufficient. This handoff does not restate its execution contract, only points to it and records the surrounding authority.

## Authority chain

Stage 2a closed 2026-08-08 by owner exact-byte ratification (`DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md`). Stage 2b Phase 1 closed on architect `ACCEPT` at `DECISIONS-MIGRATION-STAGE-2B-PHASE-1-CLOSEOUT-2026-08-08.md`. The order above commissions Stage 2b Phase 2 only — commission §5.4, the byte-identical preservation snapshot.

The accepted Phase 1 source modifications in `lib/decisions-format.ts` and `scripts/tests/decisions-format.ts` remain uncommitted in the working tree by design and are preserved exactly under the Phase 2 order. Their presence is not drift.

## What this handoff does not authorize

- Anything the order's own §8 excludes.
- Any Stage 2b phase beyond Phase 2.
- Any edit to the ratified manifest.
- Any edit to `DECISIONS.md`.
- Any normalized-archive work under §5.5.
- Any commit, push, branch operation, cleanup, reset, stash, or alteration of Phase 1's accepted source files.
- Treating a clean Phase 2 result as authorization to begin Phase 3. Phase 3 is commissioned separately, only after architect adjudication of this phase's receipt.

## Final response

Follow the order's own §9 deliverable specification exactly. Return the deliverable's disposition (`PASS`, `STOPPED`, or `FAIL`) in the response along with the deliverable's path. Do not summarize around it — the deliverable is the receipt.
