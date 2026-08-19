# Stage 2b Instrument A — Codex handoff

**Date:** 2026-08-18 · **Seat:** GPT, recording the owner's explicit freeze act · **Branch:** `codex/decisions-migration`

---

## 1. Frozen authorized instrument

| field | value |
|---|---|
| File | `DECISIONS-MIGRATION-STAGE-2B-FINAL-VERIFICATION-WORK-ORDER-2026-08-18.md` |
| Revision | 1 |
| Byte length | `14929` |
| SHA-256 | `04f983bd18c8b5b4f2d8564dc292df25e3c14b4b47b5e230acb3c457d7a67f7a` |
| Frozen by | Owner, 2026-08-18, from Codex's direct on-disk `wc -c` / `shasum -a 256` measurement |

The owner supplied the direct on-disk measurement above as the freeze identity. Revision 1 is therefore the externally frozen Instrument A for this execution. The work-order file itself is not edited to change its retained `DRAFT — NOT OWNER-FROZEN, NOT AUTHORIZED, NOT EXECUTABLE` banner; authority is the frozen identity above plus this handoff.

---

## 2. This handoff does not restate the order

The frozen work order is the sole execution authority. Read it in full before acting. If any statement in this handoff appears to conflict with the order, the order controls.

This handoff supplies only identity verification, execution activation, and the launch prompt. It creates no additional requirement, exception, waiver, or stop condition.

This handoff is itself a repository-root `DECISIONS-MIGRATION-` governance artifact. Instrument A §3 classifies such post-initial-census governance artifacts as class (b); measure and report it exactly as the order requires. Do not stage, move, edit, or remove it under Instrument A.

---

## 3. First action — verify identity

Before any other action, from the Project Shrimp repository root run:

```bash
wc -c "DECISIONS-MIGRATION-STAGE-2B-FINAL-VERIFICATION-WORK-ORDER-2026-08-18.md"
shasum -a 256 "DECISIONS-MIGRATION-STAGE-2B-FINAL-VERIFICATION-WORK-ORDER-2026-08-18.md"
```

Both values must match §1 exactly. On any mismatch, stop immediately, change nothing, and return both measured values.

After the identity matches, read the frozen order in full and execute it exactly as written. Instrument B does not run concurrently; the order itself governs that boundary.

---

## 4. Launch prompt

```text
Read DECISIONS-MIGRATION-STAGE-2B-FINAL-VERIFICATION-WORK-ORDER-2026-08-18.md in full from the Project Shrimp repository root and execute it exactly as written.

Before acting, verify that the file is exactly 14929 bytes with SHA-256 04f983bd18c8b5b4f2d8564dc292df25e3c14b4b47b5e230acb3c457d7a67f7a. If either value differs, stop and report both measured values without changing anything.

Treat the frozen work order as the sole execution authority. Do not widen its write allowlist, do not stage or commit anything, and do not improvise past a stop condition. A stop is a successful control outcome: return the measured state at the point it fires.
```

---

## 5. Return

Return exactly the execution record Instrument A §13 requires. On any stop, return the measured state and the stop condition that fired; do not create a substitute closeout or receipt.

The architect seat adjudicates the return cold against live disk. Instrument B is not authorized by this handoff and begins only after Instrument A receives architect `ACCEPT` and its own separately frozen handoff is issued.
