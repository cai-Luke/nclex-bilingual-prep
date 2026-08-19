# Stage 2b Phase 6 — Codex handoff

**Date:** 2026-08-12 · **Seat:** Architect · **Branch:** `codex/decisions-migration`

---

## 1. The authorized instrument

| field | value |
|---|---|
| File | `DECISIONS-MIGRATION-STAGE-2B-PHASE-6-CONFORMANCE-WIRING-WORK-ORDER-2026-08-12.md` |
| Revision | 7 |
| Byte length | `25296` |
| SHA-256 | `a550d3c7a3eb26ad6f7c1f85c4beb6e9b1b04a8cc52c74e9f78f3230beebf4c7` |
| Frozen by | Owner, 2026-08-12 |

That file is the sole authority for Phase 6. Revisions 1 through 6 are superseded and must not be executed
from any cached or quoted copy.

---

## 2. This handoff does not restate the order

Deliberately. A handoff that paraphrases its own work order becomes a second source of truth, and the two
drift. Every requirement, constraint, stop condition, predicted result, and receipt obligation lives in the
frozen file. Read it in full before acting, and resolve any apparent conflict between this handoff and the
order in favour of the order.

The only content below is identity verification, the launch prompt, and what to return.

---

## 3. First action, before anything else

Verify the instrument's identity against the table in §1:

```
wc -c "DECISIONS-MIGRATION-STAGE-2B-PHASE-6-CONFORMANCE-WIRING-WORK-ORDER-2026-08-12.md"
shasum -a 256 "DECISIONS-MIGRATION-STAGE-2B-PHASE-6-CONFORMANCE-WIRING-WORK-ORDER-2026-08-12.md"
```

Both must match exactly. A mismatch means the file on disk is not the instrument the owner authorized: stop
immediately, report both measured values, and change nothing.

---

## 4. Launch prompt

```
Read DECISIONS-MIGRATION-STAGE-2B-PHASE-6-CONFORMANCE-WIRING-WORK-ORDER-2026-08-12.md in the Project Shrimp
repository root and execute it exactly as written.

Before acting, verify the file is 25296 bytes with SHA-256
a550d3c7a3eb26ad6f7c1f85c4beb6e9b1b04a8cc52c74e9f78f3230beebf4c7. If either differs, stop and report both
measured values without changing anything.

The order is self-contained and immutable. Do not substitute your own judgment for its text, do not widen its
write allowlist, and do not proceed past any stop condition it defines. A stop is a successful outcome:
capture the measured state and return it.
```

---

## 5. What to return

On the success path, the receipt required by §11 of the order, at the path the order specifies, written only
after the closing measurement per §10 step 13.

On any stop, **no receipt**. Return the measured state at the moment the stop fired, naming which stop
condition it was.

In either case, report nothing as verified that the order did not require and you did not perform.

---

## 6. Adjudication

The architect seat adjudicates the returned artifact cold from live disk, not from its narrative. A
non-producer seat then independently reproduces the executions named in §14 of the order. Phase 6 closes on
architect `ACCEPT` only after both.

Phase 6 closure does not authorize the Stage 2b content commit, does not accept repository conformance, and
does not close the Amendment 1 rebinding window.
