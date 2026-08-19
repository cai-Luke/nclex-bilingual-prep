# Stage 2b Instrument B — Codex handoff

**Date:** 2026-08-18 · **Seat:** GPT, recording the owner's explicit freeze act · **Branch:** `codex/decisions-migration`

---

## 1. Frozen authorized instrument

| field | value |
|---|---|
| File | `DECISIONS-MIGRATION-STAGE-2B-INDEPENDENT-CONTENT-REVIEW-WORK-ORDER-2026-08-18.md` |
| Revision | 1 |
| Byte length | `10210` |
| SHA-256 | `8414ea2507c1e9002ee725e64c863278e22d88c0f855274c0548d6302b9d89cd` |
| Frozen by | Owner, 2026-08-18, from direct on-disk `wc -c` / `shasum -a 256` measurement |

The owner supplied the direct on-disk measurement above as the freeze identity. Revision 1 is therefore the externally frozen Instrument B instrument.

The work-order file itself retains its `DRAFT — NOT OWNER-FROZEN, NOT AUTHORIZED, NOT EXECUTABLE` banner. Do not edit the frozen file to repair that now-stale banner; authority is the externally frozen identity above plus this handoff, subject to the activation gate in §2.

---

## 2. Entry conditions and activation gate

Instrument A Revision 2 returned with its §7.1 item 11 **PASS**: manifest/output exact equality passed in both directions for all 65 live blocks, against the ratified manifest identity `332579` bytes / SHA-256 `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2`.

That satisfies Instrument B §2's explicit item-11 entry condition.

Instrument B also requires the sequence Instrument A → architect `ACCEPT` → Instrument B. The Claude architect seat must record that Instrument A disposition. **This handoff does not manufacture, substitute for, or infer that architect disposition.** Until the architect seat has recorded Instrument A `ACCEPT`, this handoff records the frozen identity but does not activate execution.

Once that architect `ACCEPT` is recorded, Instrument B is activated without any edit to this frozen handoff or to the frozen work order.

The architect seat's separate commission §8.1 manifest-conformance review is not performed by Codex under Instrument B and is not supplied or fabricated by this handoff.

---

## 3. This handoff does not restate the order

The frozen Instrument B work order is the sole execution authority. Read it in full before acting. If any statement in this handoff appears to conflict with the order, the order controls.

This handoff supplies only identity verification, the already-measured Instrument A §7.1 item 11 PASS condition, the activation boundary above, and the launch prompt. It creates no additional review criterion, exception, waiver, disposition, overwrite permission, or stop condition.

This handoff is itself a repository-root `DECISIONS-MIGRATION-` governance artifact and is therefore part of the later supplementary census. Instrument B does not stage, move, edit, or remove it.

---

## 4. First action — verify identity

After the architect `ACCEPT` activation gate in §2 has been satisfied, before any other Instrument B action, from the Project Shrimp repository root run:

```bash
wc -c "DECISIONS-MIGRATION-STAGE-2B-INDEPENDENT-CONTENT-REVIEW-WORK-ORDER-2026-08-18.md"
shasum -a 256 "DECISIONS-MIGRATION-STAGE-2B-INDEPENDENT-CONTENT-REVIEW-WORK-ORDER-2026-08-18.md"
```

Both values must match §1 exactly. On any mismatch, stop immediately, change nothing, and return both measured values.

Then read the frozen Instrument B order in full and execute it exactly as written. Do not perform commission §8.1, do not stage or commit anything, and do not create any repository output other than the single report path authorized by Instrument B §7.

---

## 5. Launch prompt

```text
First confirm that the Claude architect seat has recorded Instrument A Revision 2 ACCEPT. If that disposition has not been recorded, do not execute Instrument B; return that the activation gate is unsatisfied and change nothing.

Once Instrument A architect ACCEPT is recorded, read DECISIONS-MIGRATION-STAGE-2B-INDEPENDENT-CONTENT-REVIEW-WORK-ORDER-2026-08-18.md in full from the Project Shrimp repository root and execute it exactly as written.

Before acting, verify that the file is exactly 10210 bytes with SHA-256 8414ea2507c1e9002ee725e64c863278e22d88c0f855274c0548d6302b9d89cd. If either value differs, stop and report both measured values without changing anything.

Instrument A §7.1 item 11 returned PASS and satisfies Instrument B's explicit manifest/output-equality entry condition. Treat the frozen Instrument B work order as sole execution authority. Re-derive every required content-review unit from the sources named by the order; inherit no prior review disposition. Do not perform §8.1, do not author replacement constitutional wording, do not stage or commit anything, and do not improvise past a stop condition.
```

---

## 6. Return

Return the execution record required by the frozen Instrument B order. The retained report path is exactly the one authorized by Instrument B §7. On any stop, return the measured state and the stop condition that fired; do not create a substitute report or widen the output surface.
