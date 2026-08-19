# DECISIONS Migration — Stage 2b Phase 5 Location-Binding Repair Handoff

**Date:** 2026-08-11
**Seat:** Codex / shell-capable implementation producer
**Status:** Authorized. Phase 5 location-binding repair only. No later Stage 2b phase, and no part of Phase 5 beyond this repair, is authorized by this handoff.

This handoff is closed-world. Read the named repository files; do not rely on chat history.

## Authorized instrument

`DECISIONS-MIGRATION-STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-WORK-ORDER-2026-08-11.md`

**Authorized identity — revision 1, `31308` bytes / SHA-256
`fd252a87340e0dc44c71d35a4342bd7cd47a4547e31714f8c75a604b246e34f4`.** Owner-measured on 2026-08-11;
byte length independently confirmed against live disk by the architect seat. Before doing any work, read
the order from disk and confirm its byte length and SHA-256 against the identity above. Stop and report
rather than proceeding if either does not match.

**An earlier `29545`-byte candidate existed on disk and was never authorized.** It carried a malformed
41-character HEAD value and did not carry the established-gate default-output proof. It is superseded and
exists in no authorized form; if any document or summary cites that byte length, it is stale. Only the
`31308`-byte state governs.

**Issuer.** The architect seat authored the operative draft and issues this instrument. The GPT disk seat
assembled the candidate on live disk at owner direction and folded in bounded pre-freeze corrections; that
assembly does not transfer the issuer role, and the architect accepted the exact frozen identity above
before this handoff was written.

The order is complete and self-sufficient. This handoff does not restate its content, only points to it
and states the surrounding authority.

## Why this repair exists

Stage 2b Phase 5 executed under
`DECISIONS-MIGRATION-STAGE-2B-PHASE-5-RECONCILIATION-CHECKER-WORK-ORDER-2026-08-11.md` revision 2
(`33073` bytes / SHA-256 `75cc6db647afd6f8e6e0950ac885ba5c7b225489bb73b03236d81f3eca66ceac`) and returned
`PASS`. Independent non-producer review returned `REVISE`. The architect seat adjudicated both findings
cold against live disk, confirmed both, and returned `REVISE`.

**Phase 5 is not closed.** Its checker, its `package.json` wiring, and its receipt all remain in place;
this repair modifies the checker only. The original receipt at
`audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-TARGET-RECONCILE-REPORT-2026-08-11.md` (`14247`
bytes) is the contemporaneous record of the defective implementation, is evidence for why this repair
exists, and is **never edited, annotated, superseded, or withdrawn**. It is also the source of the
preserved zero-argument transcript the order's Step 5 requires you to compare against.

## Authority chain

The four instruments that governed Phase 5 govern this repair unchanged, each over a disjoint population.
This repair amends none of them, ratifies nothing, and pins no new target byte.

1. **Ratified Stage 2a manifest** — `332579` bytes / SHA-256
   `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2`. Governs the M5.4 and M5.6 payloads
   this repair binds to their target locations, alongside everything it already pinned.
2. **Ratified Commission Amendment 2** — Revision 3, `24202` bytes / SHA-256
   `4cb16995cf8810bcf3ee65ffb07dc32a14a4fb5b0c4adc8ba5bbb2a2a535e9f4`. Pins the eight structural surfaces.
3. **Ratified Commission Amendment 3** — Revision 4, `26963` bytes / SHA-256
   `9a1a3a898bf847d8dbe760c7aba702f3a3c3c3381c760bba989ffa5b8542944e`. Pins the join-byte population,
   which remains outside this checker's byte-verification scope. The order's Step 3.4 preserves that scope
   statement unchanged.
4. **Ratified Amendment 4** — `DECISIONS-ARCHIVE-PRESERVATION-AND-WRAPPER-ADDRESSING-AMENDMENT-2026-07-29.md`,
   `22665` bytes. Its §6 governs the source classification, not any target byte.

`AGENTS.md`'s risk-tiered minimum verification applies as a floor in addition to these: this is
audit/maintenance tooling, and the order's Step 5 states which commands that floor requires and which it
conditionally excludes.

**No overlap between these authorities exists to resolve.** If execution appears to find a gap none of them
names, or an apparent conflict between them, that is a stop under the order's §7.

## Ordering note

The order's Step 1 census is captured **after** both the order and this handoff exist on disk. Both are new
untracked paths and are expected members of your opening baseline. Do not treat either as an unexplained
addition, and do not attempt to reconcile against the `71`-path orientation figure recorded in the order's
§3 — it predates both files and is explicitly non-operative.

## Three failure modes this repair is specifically exposed to

All three are spelled out in the order; they are flagged here because each produces a clean-looking result
that proves nothing.

**Reintroducing the defect while appearing to repair it.** The whole point is that a governed surface must
never be found by searching the target for the payload that surface is supposed to contain. The tempting
implementation of the §3 table header and separator is to search for their expected literals — that is the
original defect wearing a different name. Derive them from `parsed.index.rows[0].line` instead. The order's
§1.1 and Step 3.3 are binding on every assertion you add.

**A compensated-relocation control that fails for the wrong reason.** Controls 6 and 7 must not create a
second structural section heading, which is why the relocated pristine payload is written behind a
non-newline sentinel prefix — the M5.4 payload opens `## 8` and would otherwise duplicate §8 and trip the
uniqueness precondition, producing a failure that proves nothing about location binding. Control 8 must not
disturb the label, block key, or pointer line. In each, the required evidence is the pair: global
uniqueness `PASS` alongside location-bound `FAIL`. A control where both fail, or where the failure comes
from a perturbed precondition, has not proved the repaired predicate. Fix the fixture, not the expectation.

**Changing the established gate's default output.** The repaired checker adds stronger internal predicates
and must still emit byte-identical zero-argument success output. Any divergence from the preserved
transcript is a stop under §7 item 7 — never normalized, whitelisted, or silently accepted.

## What this handoff does not authorize

- Anything the order's own §6 excludes.
- Any edit to `package.json`, which Phase 5 already wired correctly, or to the original Phase 5 receipt.
- Any edit to `lib/decisions-format.ts`. `sectionByLine()` is private by design; exporting it is outside
  the order's §4 allowlist and is a stop, not a shortcut.
- Reopening Phase 4 target bytes, the pinned nulls, raw-`Buffer` baseline slicing, wrapper-to-wrapper
  binding, snapshot equality, Amendment 4 arithmetic, or any already-accepted Phase 5 predicate the order
  does not name.
- Any part of commission §5.8, §6, §7.1, or §8.
- Any staging, commit, push, branch operation, or pull-request action.
- Treating a clean repair result as Phase 5 closure. Phase 5 closes only on architect acceptance of this
  repair **and** acceptance of a separate non-producer independent execution, per the order's §9. Your
  reruns cannot satisfy that second requirement — you produced the checker.

## Final response

Follow the order's own §8 deliverable specification exactly. Return the deliverable's disposition
(`PASS`, `STOPPED`, or `FAIL`) in the response along with the deliverable's path. Do not summarize around
it — the deliverable is the receipt.
