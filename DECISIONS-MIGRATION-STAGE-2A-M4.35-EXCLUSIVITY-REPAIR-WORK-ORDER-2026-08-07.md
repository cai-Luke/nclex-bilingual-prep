# Stage 2a — `M4.35` generation-prompt-parameters exclusivity repair work order

**Date:** 2026-08-07 · **Authoring seat:** Architect · **Revision:** 1

**Class: bounded manifest defect repair, not yet executed.** This order authorizes exactly one further
manifest edit: restoring E033's explicit exclusivity word to the generation-prompt-parameters limb of
`M4.35 / P28#0`'s statement. It is independent of the whitespace-repair loop, which is closed and not
reopened here. It is written, read back, and its identity is returned for hashing, per instruction to
stop before editing the manifest.

---

## 0. Origin and what this seat independently verified

**Whitespace-repair loop — closed, not reopened.** This seat read
`audit/decisions-migration-2026-07-29/M4.4-ADJACENT-WHITESPACE-REPAIR-VERIFICATION-2026-08-06.md` on
disk and confirms it records `PASS`: closing repair-order identity `13872` bytes / SHA-256
`c2372377414ed0a2bb2a29c8e3ab618030ced7d603bd6340e3bda124f1c50be9`, matching its opening identity;
corrected manifest `314806` bytes / SHA-256 `0ea0a4c209580fd996813f612ab415f253c4d62a3aad1ed231f01021de76864b`;
the four-substantive-repair reversal reproducing the pinned pre-repair witness (`314491` bytes / SHA-256
`9d3283086a93daa3e0925ff539f9d98d5914cc9955035f129f3178329804fe5a`), byte-identical to Git blob
`a2685a3518aa609902b151dec4e51bf353d66e2e`; and `M4.38`, M6, `DECISIONS.md`, branch, HEAD, encoding, and
cursor invariants all `PASS`. It also confirms `FOUR-FINDING-REPAIR-VERIFICATION-2026-08-06.md` — the
earlier FAIL receipt — remains intact and unaltered. This seat independently re-measured the live
manifest at `314806` bytes via `MCP:get_file_info` before drafting this order, matching the verification
receipt's own figure. **This order does not reopen `M4.4` formatting, the whitespace correction, or
either whitespace-repair-order revision.**

**Semantic confirming-read disposition — accepted, not independently re-verified as a process.** A
semantic confirming read over the four substantive repairs was reported in chat only; this seat found no
corresponding artifact on disk (`repository_status` shows no new confirming-read file for this round) and
did not itself run that read. The reported results — `M4.3`/E002 PASS, `M4.4`/E003 Owner PASS, `M4.5`/E004
PASS, `M4.35`/E033 REVISE — are accepted as a disposition on the person's authority, not confirmed as a
process by this seat. What this seat did independently confirm is the substantive claim the `M4.35`
finding rests on: see below.

**The `M4.35` finding, independently re-verified against live disk:**

- Live `M4.35 / P28#0` item 8, read in full from `target-text-manifest.md` (head to line 2290), contains
  exactly: `Generation prompt parameters draw from this same scored-leaf population.` — confirmed
  present, matching the quoted "before" text exactly.
- Source `E033`, read at three independent locations that agree byte-for-byte —
  `DECISIONS-MIGRATION-STAGE-2A-CANDIDATE-REGIONS-2026-07-29.md` line 66,
  `DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md` line 693, and `DECISIONS.md` line
  221 — contains exactly: `Category and topic distributions, difficulty and item-type distributions,
  target gaps, and generation prompt parameters therefore use only this scored-leaf population.` —
  confirmed present, matching the quoted source text exactly.
- The prior full-review finding (`FULL-REVIEW-TRANCHE-B-2026-08-06.md` L5) correctly identified
  generation prompt parameters as a separate operative limb bound to the scored-leaf population; the
  first repair (executed under `FOUR-FINDING-REPAIR-WORK-ORDER-2026-08-06.md` revision 1) restored the
  population identity but used `draw from`, not the source's `use only`. `draw from` states that the
  parameters come from that population; it does not state that they come from *only* that population.
  The source's exclusivity word is absent from the live statement.

**Disposition accepted:**

```text
Generation prompt parameters draw from this same scored-leaf population.
```

→

```text
Generation prompt parameters draw only from this same scored-leaf population.
```

**Arithmetic, independently computed.** The insertion is the five bytes `only ` (o-n-l-y-space, all
single-byte ASCII) between `draw` and `from`. Net delta: **+5 bytes**. `314806 + 5 = 314811`, matching the
expected post-repair length. No owner ruling is required: this restores an explicit operative word already
present in the ratified source and already governed by the general compression-fidelity rule at target
§1 and by the standing carrying-clause discipline this manifest applies throughout M4; it is not a new
policy choice.

---

## 1. Scope

### 1.1 Open

- Exactly one further manifest substring: the generation-prompt-parameters sentence inside `M4.35 / P28#0`
  item 8, per §2.
- This order's own authorization identity, measured and recorded externally per §3, on the same mechanism
  as the `M4.4` whitespace-repair order.
- The eventual repair report and Codex verification receipt, per §3 and §4 (not written or run by this
  order).

### 1.2 Closed — unchanged by this order

- `M4.3 / P2#0`, in full — semantic confirming-read `PASS` accepted; not reopened.
- `M4.4 / P2#1`, in full, **including both its `Owner` wording and its adjacent `Execution`-clause
  whitespace** — semantic confirming-read `PASS` accepted, whitespace-repair `PASS` accepted; neither
  reopened.
- `M4.5 / P3#0`, in full — semantic confirming-read `PASS` accepted; not reopened.
- `M4.38 / P31#0`, in full — untouched by every prior order in this workstream; remains so.
- All of M6.
- `DECISIONS.md`.
- Every prior work order in this workstream: `FOUR-FINDING-REPAIR-WORK-ORDER-2026-08-06.md` revision 1,
  `FOUR-FINDING-REPAIR-COMPLETION-WORK-ORDER-2026-08-06.md` revision 2, and
  `M4.4-ADJACENT-WHITESPACE-REPAIR-WORK-ORDER-2026-08-06.md` revision 2 — none amended, none reopened.
- Every prior repair report: `FOUR-FINDING-REPAIR-REPORT-2026-08-06.md` and
  `M4.4-ADJACENT-WHITESPACE-REPAIR-REPORT-2026-08-06.md` — preserved as historical records, not amended.
- Every prior verification receipt: `FOUR-FINDING-REPAIR-VERIFICATION-2026-08-06.md` (the FAIL receipt)
  and `M4.4-ADJACENT-WHITESPACE-REPAIR-VERIFICATION-2026-08-06.md` (the PASS receipt) — both preserved as
  historical records, neither amended nor superseded.

**Only `M4.35 / P28#0` item 8's one sentence is open under this order.** Nothing else in the manifest is
touched.

---

## 2. The `M4.35` correction

**Open substring** (unique repository-wide inside the manifest; the only other occurrence anywhere is a
quotation inside the historical `FOUR-FINDING-REPAIR-REPORT-2026-08-06.md`, which is not touched):

```text
Generation prompt parameters draw from this same scored-leaf population.
```

**Replacement:**

```text
Generation prompt parameters draw only from this same scored-leaf population.
```

Net byte delta: **+5**. Expected post-repair manifest byte length: **`314811`**.

**Not touched:** the sentence immediately before it (ending `...never standing as evidence about a
leaf.`) and the sentence immediately after it (beginning `Delivery and inventory reports measure...`),
both of which are unchanged in both spans, and every other word of the opened sentence itself, which
changes only by the five-byte insertion.

**Execution condition, when this order proceeds to execution (not now):** fresh live re-read of the exact
open substring immediately before the call; dry-run first; apply live only on an exact-one match; read
back afterward via targeted search for the replacement text.

---

## 3. Authorization identity — same clean mechanism as the `M4.4` whitespace-repair order

1. This order is written and read back in full.
2. A hashing-capable seat returns its byte length and SHA-256.
3. The architect seat acknowledges that returned identity before executing §2.
4. This order is not edited again after that measurement is taken.
5. The eventual repair report records that externally returned identity and the architect's
   acknowledgment as provenance, wherever in the sequence the report happens to be written. This order
   does not require the repair report to exist, or to carry that identity, before execution.
6. Codex independently remeasures this order (byte length and SHA-256) after execution. The step-2 and
   step-6 measurements must match exactly; inequality is a BLOCKER.

---

## 4. Post-repair Codex verification (not run by this order)

After this order is hash-locked (§3 steps 1–3) and the correction lands, Codex verifies, and writes a
**new** verification receipt — it does not alter or supersede either
`FOUR-FINDING-REPAIR-VERIFICATION-2026-08-06.md` (FAIL) or
`M4.4-ADJACENT-WHITESPACE-REPAIR-VERIFICATION-2026-08-06.md` (PASS), both of which stand as accurate
historical records:

1. Live manifest byte length is exactly `314811`.
2. The insertion of `only ` at the open substring of §2 is the **only** new difference from the current
   verified `314806` / SHA-256 `0ea0a4c209580fd996813f612ab415f253c4d62a3aad1ed231f01021de76864b` state.
3. Corrected-manifest SHA-256, freshly measured.
4. Reversing this new correction plus the prior four substantive repairs (per the established reversal
   method: `M4.3`, final `M4.4` `Owner` reversed directly to `` `Owner` — `OMIT`; same reason. ``, `M4.5`,
   and this now-corrected `M4.35`) still reconstructs the exact pinned pre-repair witness: `314491` bytes,
   SHA-256 `9d3283086a93daa3e0925ff539f9d98d5914cc9955035f129f3178329804fe5a`, byte-identical to Git blob
   `a2685a3518aa609902b151dec4e51bf353d66e2e`.
5. `M4.3`, `M4.4` (both `Owner` wording and `Execution` whitespace), `M4.5`, `M4.38` / `P31#0`, and all of
   M6 remain byte-identical to their currently-verified state.
6. `DECISIONS.md`, branch, HEAD, encoding, and terminal-cursor invariants remain unchanged.
7. This order's own opening and closing identities (§3 steps 2 and 6) are equal.

---

## 5. Blockers

Execution of §2 stops and returns to the person on any of: this order's opening identity not returned and
acknowledged before the edit; a live re-read of the open substring at §2 that does not match exactly;
more than one match, or zero matches, for that substring anywhere in the manifest; any attempted edit to
`M4.3`, `M4.4` (`Owner` wording or `Execution` whitespace), `M4.5`, `M4.38`, any M6 byte, `DECISIONS.md`,
or any prior work order, report, or verification receipt; a post-edit byte length other than `314811`; or
an opening/closing identity mismatch on this order once both are measured.

**Not yet done under this order:** the correction itself, any repair report, Codex verification, the new
verification receipt, the confirming read, and the resume-note update. All remain contingent on §3 steps
1–3 being completed. Per instruction, this order stops here: it is not executed, and only its byte length
is returned for hashing.
