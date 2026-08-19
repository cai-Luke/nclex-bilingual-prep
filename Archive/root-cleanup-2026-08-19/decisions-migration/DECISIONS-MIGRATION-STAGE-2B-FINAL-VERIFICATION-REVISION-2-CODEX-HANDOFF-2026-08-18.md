# Stage 2b Instrument A Revision 2 — Codex handoff

**Date:** 2026-08-18 · **Seat:** GPT, recording the owner's explicit freeze act · **Branch:** `codex/decisions-migration`

---

## 1. Frozen authorized instrument

| field | value |
|---|---|
| File | `DECISIONS-MIGRATION-STAGE-2B-FINAL-VERIFICATION-WORK-ORDER-REVISION-2-2026-08-18.md` |
| Revision | 2 |
| Byte length | `23172` |
| SHA-256 | `7d179a82a4dd346d3b0a46a0eb606edfcf5b66fea7ea2fcca536a990b89e4f05` |
| Frozen by | Owner, 2026-08-18, from Codex's direct on-disk `wc -c` / `shasum -a 256` measurement |

The owner supplied the direct on-disk measurement above as the freeze identity. Revision 2 is therefore the externally frozen Instrument A for this execution.

Revision 2 supersedes Revision 1 as an executable instrument. Revision 1 and its original handoff remain untouched as evidence of the clean `OUTPUT_OUTSIDE_GENERATOR_CHECKOUT` stop and must not be edited, moved, removed, or reused as execution authority.

The Revision-2 work-order file itself retains its `DRAFT — NOT OWNER-FROZEN, NOT AUTHORIZED, NOT EXECUTABLE` banner. Do not edit the frozen file to repair that now-stale banner; authority is the externally frozen identity above plus this handoff.

---

## 2. This handoff does not restate the order

The frozen Revision-2 work order is the sole execution authority. Read it in full before acting. If any statement in this handoff appears to conflict with the order, the order controls.

This handoff supplies only identity verification, execution activation, and the launch prompt. It creates no additional requirement, exception, waiver, overwrite permission, or stop condition.

This handoff is itself a repository-root `DECISIONS-MIGRATION-` governance artifact. Revision 2 §3 classifies such post-initial-census governance artifacts as class (b). Measure and report it exactly as the order requires. Do not stage, move, edit, or remove it under Instrument A.

---

## 3. First action — verify identity

Before any other action, from the Project Shrimp repository root run:

```bash
wc -c "DECISIONS-MIGRATION-STAGE-2B-FINAL-VERIFICATION-WORK-ORDER-REVISION-2-2026-08-18.md"
shasum -a 256 "DECISIONS-MIGRATION-STAGE-2B-FINAL-VERIFICATION-WORK-ORDER-REVISION-2-2026-08-18.md"
```

Both values must match §1 exactly. On any mismatch, stop immediately, change nothing, and return both measured values.

After identity matches, read the frozen Revision-2 order in full and execute it exactly as written. Instrument B does not run concurrently and is not authorized by this handoff.

---

## 4. Launch prompt

```text
Read DECISIONS-MIGRATION-STAGE-2B-FINAL-VERIFICATION-WORK-ORDER-REVISION-2-2026-08-18.md in full from the Project Shrimp repository root and execute it exactly as written.

Before acting, verify that the file is exactly 23172 bytes with SHA-256 7d179a82a4dd346d3b0a46a0eb606edfcf5b66fea7ea2fcca536a990b89e4f05. If either value differs, stop and report both measured values without changing anything.

Revision 2 is the sole executable Instrument A. Revision 1 and its original handoff are preserved evidence only and must not be executed from, edited, moved, or removed.

Treat the frozen Revision-2 work order as sole authority. Do not widen its write allowlist, do not stage or commit anything, and do not improvise past a stop condition. A stop is a successful control outcome: return the measured state at the point it fires.
```

---

## 5. Return

Return exactly the execution record Revision 2 §13 requires. On any stop, return the measured state and the stop condition that fired; do not create a substitute closeout or receipt.

The architect seat adjudicates the return cold against live disk. Instrument B begins only after Instrument A receives architect `ACCEPT` and B's own separately frozen handoff is issued.