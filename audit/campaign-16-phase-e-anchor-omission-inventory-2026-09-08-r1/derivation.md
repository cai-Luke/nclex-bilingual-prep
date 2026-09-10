# Frozen pre-repair anchor-omission inventory — derivation and attestation limits

Date: 2026-09-08
Authoring seat: Claude (architect seat), degraded single-filesystem-connector session
Commissioning memo: `scratch/CAMPAIGN-16-PHASE-E-RESIDUAL-192-OWNER-CLOSEOUT-DISPOSITION-2026-09-08.md`
Consumer: `scratch/CAMPAIGN-16-PHASE-E-451-ANCHOR-OMISSION-REPAIR-WORK-ORDER-2026-09-08.md`

This directory holds a forensic inventory of the pre-repair 451-row anchor-omission population. It carries no semantic verdict and authorizes no bank mutation.

## Files

| File | Role |
|---|---|
| `build-inventory.ts` | deterministic builder; pure function of the frozen Phase E Stage-0 population |
| `frozen-inventory.jsonl` | the 451-row inventory, produced by the builder |
| `inventory-summary.json` | aggregate facts, verified properties, packet manifest, pinned digest |
| `preflight-verify.ts` | mandatory pre-repair preflight, and the post-repair closure check (revision R2) |
| `derivation.md` | this file |

## preflight-verify.ts revision R3 (2026-09-08)

Second owner-review correction pass. R3 preserves R2's major PRE/POST and structural fixes and adds three precision corrections: an explicit `exceptions.jsonl` artifact is now required in the commission root even when empty; "structurally proven repaired" counting occurs only after all row assertions pass; and this document no longer overstates the verifier as proving full-object non-mutation for exception rows. Full-object non-mutation remains the separate §E.9 before/after deep-equality obligation.

## preflight-verify.ts revision R2 (2026-09-08)

R2 introduced four substantive changes, all carried forward into R3:

- **All 13 bundled banks are pinned**, not only the four affected. The nine unaffected banks are the control surface proving the repair stayed inside its authorized files.
- **PRE and POST hash semantics are distinct.** R1 compared the four affected banks to their pre-repair digests in both modes, so a successful repair could never pass post-repair verification. PREFLIGHT now requires all 13 to match; POST-REPAIR requires the nine unaffected to match and records the four affected post-repair digests as evidence.
- **The exception queue lives only in the repair commission root.** POST-REPAIR requires `--commission-root` and fails closed on a malformed, out-of-tree, wrongly named, or absent root, on duplicate rowKeys, on rowKeys unknown to the frozen inventory, and on any `exceptions.jsonl` appearing inside this inventory directory.
- **INVARIANT R is proven structurally.** R1 inferred repair from a finding's disappearance, which a deleted part, deleted case, or truncated stage list would satisfy falsely. POST-REPAIR now resolves every frozen identity in live data exactly once, checks the declared-stage list against the frozen value, and asserts the anchor field state directly. For exception rows, this verifier proves the frozen identity still resolves, the declared-stage list is unchanged, both anchors remain absent, and the row still fails open. Full-object byte/structural non-mutation for exception rows is discharged separately by the work order's before/after deep-equality proof (§E.9); this verifier does not claim it.

A `--self-test` mode exercises the pure argument, pattern, and queue-validation logic without reading a bank.

## No monotonic sibling-anchor rule exists

The inventory records which parents have correctly anchored siblings, and that signal is real evidence about authoring intent. It is **not** a machine proof. No live authoritative contract establishes that embedded-question order implies a monotonic nondecreasing stage-anchor progression: `src/types.ts` and `src/schema.ts` treat both anchors as optional opaque strings with no cross-part relation; `getVisibleCaseStages` resolves each part independently; `DECISIONS.md` P23 governs visibility within a part, not order across parts; and `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md` §6 requires a resolving anchor on every staged part but states no monotonicity rule and is scoped to commissions that explicitly incorporate it. Sibling-bounded rows therefore belong to the semantic tier.

`frozen-inventory.jsonl` is **materialized by running the builder**, not transcribed:

```
npx tsx audit/campaign-16-phase-e-anchor-omission-inventory-2026-09-08-r1/build-inventory.ts
```

Expected output: 451 rows, 248,421 bytes, SHA-256 `9f66750caaeead9d374742588856e2630a7fce09415bb7c2c662669a2af93e8e`.

## Why the inventory is generated rather than written out

`AGENTS.md` requires bank-shaped JSON to be edited programmatically and never retyped, because retyping is the dominant corruption source. Transcribing 451 structured rows through a model is that same failure mode wearing a different hat. A deterministic builder plus a pinned digest is the tamper-evident form: the source is frozen governing evidence already on disk, the transformation is a pure function, and `preflight-verify.ts` re-checks the digest before any repair proceeds. Two runs must be byte-identical.

The pinned digest was computed by the authoring seat over the generated bytes.

## Provenance class

The inventory **reproduces the frozen governing Phase E Stage-0 population artifact** at
`audit/campaign-16-phase-e-stage-reference-census-2026-08-29-r1/population.jsonl`.

It is **not** an independent re-derivation from current live bank bytes. That re-derivation is the mandatory pre-repair preflight and is implemented in `preflight-verify.ts`, which runs `findStageReferenceFindings` against live banks and fails closed on any drift.

The Stage-0 artifact is a sound base: it was built by the Phase E deterministic builder, proven byte-identical on a second independent build under §7.6 of the census work order, reconciled to Phase A's independently checked 451/93 measurement with zero additions and zero removals, and re-verified by R3's opening pass on 2026-09-05.

## What this seat verified mechanically

Computed over the complete frozen source, all passing: 451 rows; 451 unique `bankPath|parentCaseId|partId` tuples; 451 unique `partId` values; `queueIndex` unique and contiguous over 1–451; 93 distinct parent cases; exactly one frozen bank SHA-256 per bank; `partOrdinal` never exceeding `casePartCount`; every row declaring at least one stage; 451 unique `rowKey` values and 93 unique `caseKey` values; all 451 rows carrying both anchors absent with zero present-but-unresolved anchors; `rendererVisibleStageIds` equal to `declaredStageIds` on every row.

Packet partition: 27 packets, every one bank-pure, no parent case split across packets, row counts 6 to 20.

## Attestation limits — read before relying on this

**Bank digests were recorded, not recomputed.** This seat's filesystem connector refuses text reads above 2 MiB and truncates above 300,000 characters. `banks/gpt-canonical.json` (6,904,978 B) and `banks/gemini-canonical.json` (3,767,625 B) were unreadable, and no hashing tool was reachable. The per-bank SHA-256 values in `inventory-summary.json` are inherited from the Phase E Stage-0 freeze and from R3's 2026-09-05 preservation verification. Owner-supplied filesystem metadata from a second connector corroborates that the relevant banks appear unchanged since the freeze; that is corroboration, not a cryptographic substitute, and it is not a claim that the working tree is clean relative to `HEAD` — pre-existing bank modifications from earlier Campaign 16 phases remain in `git status`.

**Per-row Stage-2 coverage is not stamped.** `checker-adjudication.jsonl` is 427,937 bytes and exceeds this seat's read ceiling, so no row carries a CHECKED / RESIDUAL flag. Coverage was left unstamped rather than partially inferred from a truncated read. The residual relationship is reconciled at the summary level by arithmetic that closes three independent ways, and per-row coverage is not required by the repair invariant, which applies uniformly to all 451 rows regardless of adjudication status.

**Session was degraded.** Only one filesystem connector presented tools. The intended two-path redundancy was unavailable throughout.

## Boundaries

Membership in this inventory is a mechanical fail-open condition under a ratified renderer behaviour (`DECISIONS.md` P23). It is not evidence that any row leaks an answer. No prior semantic label was read, altered, or reinterpreted in building this artifact, and no anchor value is proposed anywhere in it.
