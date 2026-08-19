# Stage 2b content-commit sequence — Codex handoff

**Date:** 2026-08-18 · **Seat:** GPT, acting on explicit owner delegation · **Branch:** `codex/decisions-migration`

---

## 1. Frozen authorized instrument

| field | value |
|---|---|
| File | `DECISIONS-MIGRATION-STAGE-2B-CONTENT-COMMIT-WORK-ORDER-DRAFT-2026-08-12.md` |
| Revision | 6 |
| Byte length | `27486` |
| SHA-256 | `734dfe10beb90dc9591e9cb4ea7033f9323e852310223f73eba8ef1d348c84da` |
| Frozen | 2026-08-18, by the owner-authorized GPT seat using Codex's direct on-disk `wc -c` / `shasum -a 256` measurement after the first launch correctly stopped on the prior bad digest; the work-order file was not changed |

The owner explicitly delegated the bounded final repair and Codex handoff to the GPT seat. Revision 6 is therefore the externally frozen instrument for this execution. Earlier revisions are superseded and must not be executed from cached or quoted copies.

**Correction to the first handoff issue.** The first handoff carried an incorrect SHA-256 reconstructed from connector-returned text. Codex's identity gate caught the error before any write, stage, or commit. The authoritative freeze identity is the direct on-disk measurement above: `27486` bytes / SHA-256 `734dfe10beb90dc9591e9cb4ea7033f9323e852310223f73eba8ef1d348c84da`. The work-order bytes were not changed; only this handoff's expected digest and provenance are corrected.

The order's retained `DRAFT — NOT OWNER-FROZEN, NOT AUTHORIZED, NOT EXECUTABLE` status line is now stale in the same external-freeze sense used elsewhere in this migration: do not edit the frozen file to repair its banner. Authority is this frozen identity plus this handoff.

---

## 2. This handoff does not restate the order

The frozen order is the sole execution authority. Read it in full before acting. If any statement in this handoff appears to conflict with the order, the order controls.

This handoff supplies only identity verification, the first execution boundary, and the launch prompt.

---

## 3. First action — verify identity

Before any other action, from the Project Shrimp repository root run:

```bash
wc -c "DECISIONS-MIGRATION-STAGE-2B-CONTENT-COMMIT-WORK-ORDER-DRAFT-2026-08-12.md"
shasum -a 256 "DECISIONS-MIGRATION-STAGE-2B-CONTENT-COMMIT-WORK-ORDER-DRAFT-2026-08-12.md"
```

Both values must match §1 exactly. On any mismatch, stop immediately, change nothing, and return both measured values.

---

## 4. Initial execution boundary — census only

After the identity matches and after reading the order in full, execute only the order's pre-Commit-1 census step. Produce the exact `git status --porcelain=v1 --untracked-files=all` item-13 enumeration required by Amendment 5 Clause A §1.2 and return that enumeration to the owner for ratification.

Do **not** stage any path and do **not** make Commit 1 until the owner ratifies the enumeration.

This handoff file itself predates that census and is a repository-root `DECISIONS-MIGRATION-` governance artifact. If it is intended to be committed under item 13, it belongs in the initial enumeration rather than a later supplement.

After the owner ratifies the census, continue under the frozen order from the point it specifies. Do not widen scope, improvise around a stop condition, push, open a PR, merge, or make Commit 4.

---

## 5. Launch prompt

```text
Read DECISIONS-MIGRATION-STAGE-2B-CONTENT-COMMIT-WORK-ORDER-DRAFT-2026-08-12.md in full from the Project Shrimp repository root and execute it exactly as written.

Before acting, verify that the file is exactly 27486 bytes with SHA-256 734dfe10beb90dc9591e9cb4ea7033f9323e852310223f73eba8ef1d348c84da. If either value differs, stop and report both measured values without changing anything.

Your first execution boundary is the Clause A §1.2 census only. Run the exact command the order requires, produce the complete enumerated item-13 population, and return it for owner ratification. Do not stage or commit anything before that ratification.

Treat the frozen order as sole authority. A stop is a successful control outcome: report the measured state and do not improvise past it.
```
