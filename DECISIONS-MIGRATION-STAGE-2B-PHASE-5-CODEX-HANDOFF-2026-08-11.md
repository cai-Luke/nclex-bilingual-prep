# DECISIONS Migration — Stage 2b Phase 5 Handoff

**Date:** 2026-08-11
**Seat:** Codex / shell-capable implementation producer
**Status:** Authorized. Phase 5 only. No later Stage 2b phase is authorized by this handoff.

This handoff is closed-world. Read the named repository files; do not rely on chat history.

## Authorized instrument

`DECISIONS-MIGRATION-STAGE-2B-PHASE-5-RECONCILIATION-CHECKER-WORK-ORDER-2026-08-11.md`

**Authorized identity — revision 2, `33073` bytes / SHA-256
`75cc6db647afd6f8e6e0950ac885ba5c7b225489bb73b03236d81f3eca66ceac`.** Independently architect-reproduced
against a fresh copy of live disk — not transcribed from the owner's own report. Before doing any work,
read the order from disk and confirm its byte length and SHA-256 against the identity above. Stop and
report rather than proceeding if either does not match.

**Revision 1 (`24134` bytes) was never issued and is superseded.** It exists in no authorized form; if any
document or summary cites that identity, it is stale. Only revision 2 governs.

The order is complete and self-sufficient. This handoff does not restate its content, only points to it
and states the surrounding authority.

## Authority chain

Stage 2b Phase 4 closed architect `ACCEPT` on 2026-08-11
(`DECISIONS-MIGRATION-STAGE-2B-PHASE-4-CLOSEOUT-2026-08-08.md` — the filename carries the instrument date,
the document itself is dated 2026-08-11; cite it by path). That closure is the precondition commission
§5.7 requires before this phase could be commissioned. Phases 1–3 closed `ACCEPT` at their respective
closeouts. The order above commissions Stage 2b Phase 5 only — commission §5.7, the target reconciliation
checker.

**Commission §5.7 was deliberately never amended, and the order's §1.1 is the operative reading of what
that means. Read it before writing any assertion.** In summary, and not as a substitute for §1.1: §5.7 was
written when the ratified manifest was the only construction authority for target `DECISIONS.md`.
Amendments 2 and 3 each expressly declined to rewrite §5.7 because it governed a phase not yet live, and
Amendment 2 §4.6's ratified forward note instructs this order to read "the ratified manifest" as the
combined authority. Four instruments therefore bear on this phase, each over a disjoint population:

1. **Ratified Stage 2a manifest** — `332579` bytes / SHA-256
   `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2`. Pins all 65 live entry blocks and
   their index rows, target §1 and §2, and target §8's structural introduction, archive-index lines, and
   retired register.
2. **Ratified Commission Amendment 2** — Revision 3, `24202` bytes / SHA-256
   `4cb16995cf8810bcf3ee65ffb07dc32a14a4fb5b0c4adc8ba5bbb2a2a535e9f4`, recorded at
   `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-RATIFICATION-2026-08-08.md`. Pins eight structural surfaces.
3. **Ratified Commission Amendment 3** — Revision 4, `26963` bytes / SHA-256
   `9a1a3a898bf847d8dbe760c7aba702f3a3c3c3381c760bba989ffa5b8542944e`, recorded at
   `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-RATIFICATION-2026-08-08.md`. Pins the join-byte population.
4. **Ratified Amendment 4** — `DECISIONS-ARCHIVE-PRESERVATION-AND-WRAPPER-ADDRESSING-AMENDMENT-2026-07-29.md`,
   `22665` bytes. Its §6 is the E053 correction commission §5.7 names as a checker input. It pins no target
   byte; it governs the *source classification* the checker reconciles against.

**No overlap between these authorities exists to resolve.** Each pins a disjoint population. If execution
ever appears to find a gap none of them names, or an apparent conflict between them, that is a stop
condition under the order's §7 — return to the architect seat rather than inferring which authority governs.

## Two failure modes this phase is specifically exposed to

Both are spelled out in the order; they are flagged here because each is a way to produce a clean-looking
result that proves nothing.

**A false failure.** Reports 7 and 8 are block-scoped. Reading "no target block absent from the manifest"
as "no target *byte* absent from the manifest" would flag Amendment 2's surfaces and Amendment 3's join
bytes as unaccounted and fail the target this checker exists to certify. The order forbids emitting any
such finding.

**A vacuous pass.** Block-scoping is not text-weakening. Within each block the manifest owns exact text as
well as identity (commission §5.7's own closing sentence), and an identity-only bijection would accept a
block with the right ID and an altered statement. Step 5's negative controls exist to prove the checker
actually asserts what it claims to; control 2 is the one that distinguishes a real text check from an
identity-only one, and a passing run there means the checker is defective, not the fixture.

## What this handoff does not authorize

- Anything the order's own §6 excludes.
- Any Stage 2b phase beyond Phase 5. In particular, wiring either reconciliation command into
  `.github/workflows/promotion-gate.yml` is commission §5.8 and is **not** authorized here.
- Any edit to `DECISIONS.md`, either archive file, the ratified manifest, any ratified amendment, the
  frozen phase-1 artifacts, or the existing `scripts/decisions-migration-reconcile.ts`, under any
  circumstance.
- Any change to `package.json` beyond the single added script key.
- Any commit or push. This phase leaves its work in the working tree for architect adjudication.
- Weakening, widening, or re-deriving any pinned null to obtain a passing run. If a checker's finding
  contradicts already-accepted work, that is a stop and returns to the architect seat — it is never
  repaired here.
- Treating a clean Phase 5 result as authorization to begin Phase 6.

## Final response

Follow the order's own §8 deliverable specification exactly. Return the deliverable's disposition
(`PASS`, `STOPPED`, or `FAIL`) in the response along with the deliverable's path. Do not summarize around
it — the deliverable is the receipt.
