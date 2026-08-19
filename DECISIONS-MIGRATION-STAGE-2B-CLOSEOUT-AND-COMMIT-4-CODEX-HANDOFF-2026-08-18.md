# Stage 2b Instrument C Revision 2 — Codex handoff

**Date:** 2026-08-18 · **Seat:** GPT, recording the owner's explicit freeze act · **Branch:** `codex/decisions-migration`

---

## 1. Frozen authorized instrument

| field | value |
|---|---|
| File | `DECISIONS-MIGRATION-STAGE-2B-CLOSEOUT-AND-COMMIT-4-WORK-ORDER-2026-08-18.md` |
| Revision | 2 |
| Byte length | `25076` |
| SHA-256 | `6b4d2d7783a9f53478e1775812d0570f0439ab54f4524c7eaddb28b22fa52791` |
| Frozen by | Owner, 2026-08-18, from direct on-disk `wc -c` / `shasum -a 256` measurement |

The owner supplied the direct on-disk measurement above as the freeze identity. Revision 2 is therefore the externally frozen Instrument C for this execution.

The work-order file itself retains its `DRAFT — NOT OWNER-FROZEN, NOT AUTHORIZED, NOT EXECUTABLE` banner. Do not edit the frozen file to repair that now-stale banner; authority is the externally frozen identity above plus this handoff.

---

## 2. Entry gates are satisfied

The frozen Instrument C §1 entry conditions are satisfied:

1. **Instrument A Revision 2:** returned successfully and was adjudicated `ACCEPT` by the Claude architect seat on 2026-08-18, cold against live disk.
2. **Instrument B:** entered only after that A `ACCEPT` and on a recorded Instrument A §7.1 item 11 PASS; it returned `ACCEPT`, and the Claude architect seat adjudicated Instrument B `ACCEPT` cold against live disk on 2026-08-18.
3. **Commission §8.1 manifest-conformance review:** the Claude architect seat recorded `ACCEPT — commission §8.1 only` on 2026-08-18. Its exact disposition is already pinned verbatim as Instrument C §3 Block 5.

Instrument C Revision 2 §3 is fully populated before freeze. Blocks 2 and 4 carry the owner's preserved execution text verbatim; Block 5 carries the architect disposition verbatim; Blocks 1 and 3 use the Revision-2 faithful-reconstruction rule. Do not replace those rules with transcript archaeology or infer different historical text.

---

## 3. This handoff does not restate the order

The frozen Revision-2 Instrument C work order is the sole execution authority. Read it in full before acting. If any statement in this handoff appears to conflict with the order, the order controls.

This handoff supplies only frozen identity, activation, the already-satisfied entry conditions, and the launch prompt. It creates no additional write permission, census membership, receipt requirement, staging permission, acceptance act, exception, waiver, or stop condition.

This handoff is itself a repository-root `DECISIONS-MIGRATION-` governance artifact and therefore belongs to the supplementary item-13 population required by Instrument C. It must exist before the supplementary census and must be enumerated there. Do not stage it before that census is owner-ratified.

---

## 4. First action — verify identity

Before any Instrument C action, from the Project Shrimp repository root run:

```bash
wc -c "DECISIONS-MIGRATION-STAGE-2B-CLOSEOUT-AND-COMMIT-4-WORK-ORDER-2026-08-18.md"
shasum -a 256 "DECISIONS-MIGRATION-STAGE-2B-CLOSEOUT-AND-COMMIT-4-WORK-ORDER-2026-08-18.md"
```

Both values must match §1 exactly. On any mismatch, stop immediately, change nothing, and return both measured values.

Then read the frozen Revision-2 Instrument C order in full and execute it exactly as written.

---

## 5. Required mid-execution owner act

Instrument C §8 requires an exact supplementary item-13 census followed by **owner ratification as a separate act** before staging.

When you reach that point:

1. run the exact census command required by §8;
2. return the exact item-13 enumeration to the owner without staging anything from the supplementary population;
3. stop for the owner ratification;
4. after the owner ratifies that exact enumeration, resume the same frozen Instrument C execution from §9, append the census and ratification to the already-created receipt, and continue exactly as ordered.

That owner-ratification pause is expected workflow, not a failed execution or a work-order defect. Do not create a substitute census artifact or widen the population while waiting for the owner act.

---

## 6. Launch prompt

```text
Read DECISIONS-MIGRATION-STAGE-2B-CLOSEOUT-AND-COMMIT-4-CODEX-HANDOFF-2026-08-18.md and DECISIONS-MIGRATION-STAGE-2B-CLOSEOUT-AND-COMMIT-4-WORK-ORDER-2026-08-18.md in full from the Project Shrimp repository root.

Before acting, verify that the frozen work order is exactly 25076 bytes with SHA-256 6b4d2d7783a9f53478e1775812d0570f0439ab54f4524c7eaddb28b22fa52791. If either value differs, stop and report both measured values without changing anything.

Instrument A Revision 2 has architect ACCEPT. Instrument B has architect ACCEPT. Commission §8.1 has architect ACCEPT. Instrument C Revision 2 is therefore activated.

Execute the frozen Instrument C Revision 2 exactly as written. Treat its §3 Block 1 Git-derived reconstruction rule and Block 3 faithful reconstruction as authoritative; do not attempt to recover unavailable chat bytes. Preserve Blocks 2, 4, and 5 exactly as pinned.

When §8 produces the supplementary item-13 census, return the exact enumeration to the owner and stop before staging pending the required owner ratification. After that ratification is supplied, resume from §9 under the same frozen instrument. Do not push, open a pull request, or merge; Instrument C stops after Commit 4 verification and returns the full execution record to the owner.
```

---

## 7. Return boundary

Before owner ratification of the supplementary census, return exactly that census and the measured state required by §8, with no premature staging.

After ratification and completion, return the full Instrument C execution record through §12, including Commit 4 identity, post-commit cleanliness, the Commit-3 author-date recheck, and the intact four-commit sequence. No push, PR, or merge is authorized by this handoff.
