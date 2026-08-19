# Stage 2b Instrument D — Codex handoff

**Date:** 2026-08-18 · **Branch:** `codex/decisions-migration`

## Authorization

> Stage 2b Instrument D revision 1 is authorized at `13722` bytes / SHA-256 `b48fc7fa443c6685b8f5b3b7207e9c3bd3139fac060919565177b079e2cb0f1a`.

Verify that identity against `DECISIONS-MIGRATION-STAGE-2B-CLOSEOUT-EVIDENCE-REPAIR-WORK-ORDER-2026-08-18.md`
on disk before any other action. A mismatch is a stop. The file is not edited.

## Gate on entry

Both are true:

1. Migration Commission Amendment 6 is owner-ratified, and the ratification record exists on disk at
   `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-6-RATIFICATION-2026-08-18.md`.
2. Instruments A, B, and C have returned and been adjudicated; Commit 4 is
   `32388990417222891730cd24113df12fdc779b15` and HEAD.

## State you should find

Branch `codex/decisions-migration`, HEAD `3238899`, ancestry `5b4d2fd → 4511821 → 345d0d9 → 3238899`.
`git status --porcelain=v1 --untracked-files=all` shows only untracked repository-root governance paths for
this repair cycle: Amendment 6, its ratification record, the Instrument D work order, and this handoff. No
tracked modification and nothing staged.

## What this is

A bounded evidence-carriage repair. The §10 receipt landed in Commit 4 without the determinism digests, the
per-step gate results, two advisories, Commit 4's identity, and the Instrument B conditioning line. Every
missing value already exists — in the preserved Instrument A Revision 2 execution return, or, for Commit 4's
identity, in Git history.

**You are transcribing, not measuring.** Do not re-run the determinism runs, the gate, the reconciliation
checkers, the graph generator, or any migration verification. Do measure your own current execution state
where §3, §7, §9, and §10 require it. A §5 value that cannot be transcribed as written is a stop.

## Sequence

Preconditions → five receipt insertions (§5) → completeness check (§6) → census and **stop for owner
ratification** (§7) → append census and ratification to receipt (§8) → stage and Commit 5 once (§9) →
post-commit verification (§10) → stop and return (§11, §13).

## Reminders

- The receipt is already tracked and already enumerated; the census covers only the new governance paths.
  The staged population is census paths plus `MIGRATION-RECEIPT.md`.
- Ten `run` steps, thirteen commands, two CI-only action steps read and not invoked. Use the §5.2 table.
- Keep advisory provenance separate: four from Instrument A, one observation from Instrument C.
- Commit 5's own SHA goes in your return, never in the receipt.
- No push, no PR, no merge, no Commit 6. A stop is a successful outcome.
