# Stage 2a — four-finding repair report

**Date:** 2026-08-06/07 · **Authoring seat:** Architect

This report is the mutable identity record for
`DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-COMPLETION-WORK-ORDER-2026-08-06.md` revision 2, per
that order's §5. It distinguishes four things: the final four-record manifest diff; the missing
pre-execution identity that revision 1 of the four-finding repair work order carried; the properly
frozen revision-2 completion order that superseded it; and the one bounded `M4.4` correction the
completion order authorized. Revision 1 is not claimed to have satisfied the two-hash rule anywhere in
this report.

---

## 1. Completion-order authorization identity (revision 2)

Measured externally by a hashing-capable seat and returned to the architect seat in the chat-based
execution record, which acknowledged it there, before executing the `M4.4` correction:

| item | value |
|---|---|
| File | `DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-COMPLETION-WORK-ORDER-2026-08-06.md`, revision 2 |
| Byte length | `15192` |
| SHA-256 | `a7e755dcc32b0649d006781037c1abfb31db762233abdcf662a9bba6bf806383` |
| Branch | `codex/decisions-migration` |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| Files modified (report of the measuring seat) | none |
| Acknowledged by architect seat | yes, before the `M4.4` `edit_file` call |

This value matches the architect seat's own byte-length read of the same file at the moment it was
written (`15192`), and the branch/HEAD match the identity pinned at the start of this workstream. The
architect seat has no hashing primitive and did not compute the SHA-256 above; it is transcribed from the
returned measurement.

**Process note — sequence, not substance.** The opening identity above really was independently returned
and acknowledged by the architect seat before the `M4.4` edit executed. But completion-order §5 steps
2–3 specified that this identity and that acknowledgment would already live in the repair report's
authorization section at that moment — i.e., that this file would exist and carry them before §4
executed. Live timestamps show that did not happen: the `M4.4` edit landed at `2026-08-07T01:32:38Z`;
this report was first created at `2026-08-07T01:34:00Z`, roughly ninety seconds later. The
acknowledgment's contemporaneous record therefore lived in the external chat-based execution record at
the time of the edit, not inside this file, which did not yet exist. This is a documentation-location and
sequencing defect — steps 4 and 5 effectively preceded the file-writing half of steps 2–3 — and it is not
being described here as compliance with completion-order §5 steps 2–3 as written. It is distinct from
completion-order §7's actual execution blocker, which is the *absence* of a returned and acknowledged
opening identity before the edit: that blocker did not fire, because the identity was in fact returned
and acknowledged before the edit, just not yet written into this report at that moment. No manifest byte,
work-order byte, or authorization identity value is changed to conceal or retroactively repair this
sequencing fact; the table above states the same identity that was acknowledged in chat, transcribed
after the fact into its intended home.

**Closing measurement — pending.** Per completion-order §5 step 6, a hashing-capable seat independently
remeasures this same completion-order file (byte length and SHA-256) after this repair report is written.
That value is not yet available and is recorded here once returned:

| item | value |
|---|---|
| Byte length, closing | not yet measured |
| SHA-256, closing | not yet measured |
| Equal to opening | not yet determined |

---

## 2. The missing pre-execution identity — revision 1 of the four-finding repair work order

Revision 1 of `DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-WORK-ORDER-2026-08-06.md` was written and
used as live execution authority for four manifest edits (`M4.3`, an intermediate `M4.4` formulation,
`M4.5`, `M4.35`) without an independent byte-length-and-SHA-256 measurement of that order having been
taken first. That gap is not satisfied retroactively by anything in this report. It is recorded, and the
process is corrected going forward by the two-part mechanism at §1 and at the completion order's §5:
identity measured externally, acknowledged before the authorized edit, and independently remeasured after.

Revision 1 is not amended and stands, superseded, as the contemporaneous execution specification carrying
that defect, per the completion order's §0 and §1.

---

## 3. The four-record final manifest diff

The live manifest carries exactly four spans differing from the pre-repair null (`314491` bytes,
SHA-256 `9d3283086a93daa3e0925ff539f9d98d5914cc9955035f129f3178329804fe5a`). `M4.4` reached its final span
through two edit operations; only the second's result is present in the final manifest.

### 3.1 `M4.3` / `P2#0`

- Before: `...purely mechanical work may self-certify against deterministic checks that have an
  independent null. Every active generation lane declares its producer provenance...`
- After (final, unchanged from revision 1): `...purely mechanical work may self-certify against
  deterministic checks that have an independent null and do not merely confirm the author's intent.
  Every active generation lane declares its producer provenance...`

### 3.2 `M4.4` / `P2#1` — reached in two operations; only the final form is live

- Pre-repair (original): `` `Owner` — `OMIT`; same reason. ``
- Intermediate (landed under revision 1, superseded, present nowhere in the final manifest):
  `` `Owner` — `OMIT`; the material that would establish a single tracked owner for the
  spec-conformance/content-review split — the narrowing history and its forcing incident — survives only
  in archived material, and no live tracked path carries it. ``
- **Final (live, landed under completion-order revision 2 §4):**
  `` `Owner` — `OMIT`; no single live tracked path owns the whole spec-conformance/content-review split,
  whose narrowing history and forcing incident survive only in archived material. ``

Codex's reversal at verification targets the *pre-repair* form directly from the *final* form; the
intermediate form is chronicled above only and is not itself a reversal target.

### 3.3 `M4.5` / `P3#0`

- Before: `...No API key or live model call belongs in the repository; semantic findings enter through
  an offline validated handoff.`
- After (final, unchanged from revision 1): `...semantic findings enter through an offline validated
  handoff that merges them without modifying Layer A.`

### 3.4 `M4.35` / `P28#0`

- Before: `...and parent-case metadata never standing as evidence about a leaf. Delivery and inventory
  reports measure what can be served...`
- After (final, unchanged from revision 1): `...and parent-case metadata never standing as evidence
  about a leaf. Generation prompt parameters draw from this same scored-leaf population. Delivery and
  inventory reports measure what can be served...`

---

## 4. Scope confirmation

- `M4.38` / `P31#0`: not opened, not edited, at any point across either work order or either revision of
  the completion order.
- All of M6: not opened, not edited.
- `DECISIONS.md`: not opened, not edited.
- The `Owner`/`Evidence` reasoning at `M4.3`, `M4.7`, `M4.11` beyond the `M4.3` item 8 statement at §3.1:
  not reopened; the three discharged Owner reasons from the 2026-08-05 repair remain as landed there.
- Zero `` `same reason` `` occurrences remain in `target-text-manifest.md` (confirmed by search; the only
  remaining occurrences of that phrase repository-wide are inside review/report files quoting the old
  text, not in the manifest itself).

---

## 5. Post-edit manifest identity, as measured by this seat

| item | value |
|---|---|
| Byte length | `314810` |
| SHA-256 | not available — this seat has no hashing primitive |
| Measured | 2026-08-07T01:32:38Z, via `MCP:get_file_info`, immediately after the `M4.4` edit landed |

Full whole-file SHA-256 confirmation, the reconstructed-null reversal proof, and the remaining checks
(`M4.38` byte-identity, M6 byte-identity, encoding/cursor checks, `DECISIONS.md` and branch/HEAD checks,
and the completion order's closing identity) are Codex's, per completion-order §6, not yet run.

---

## 6. Outstanding

- Codex verification per completion-order §6 (reversal method, four final spans).
- Completion order's closing identity measurement (§1 above).
- Confirming read, routed away from the architect seat per producer≠checker.
- Resume-note update — deferred until both of the above clear.
