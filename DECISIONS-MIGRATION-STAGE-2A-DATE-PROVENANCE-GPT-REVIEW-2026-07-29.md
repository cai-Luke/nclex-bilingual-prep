# DECISIONS migration Stage 2a — GPT review of live-entry date provenance

**Date:** 2026-07-29  
**Seat:** GPT independent review  
**Status:** Review note only. The Codex provenance report remains non-authoritative.

## Result

The Codex report is structurally complete: 65 rows are present exactly once in the ratified order, and the P2/P5 fixture tension was handled rather than silently ignored.

Provisionally accept 63 rows. Correct two rows before manifest authorship.

## Accepted merge-date treatment

### P2#0 and P5#0 — accept `2026-07-18`

Codex correctly distinguished the mechanical `MERGE_INTO` action from the substantive E037 rule being merged.

- The July 24 merge classification does not reset either date.
- E037 rule 2 became an explicit lane-independent obligation in the July 18 lapse disposition.
- The assembled P2 and P5 blocks therefore take the later of their July 14 narrowed core and the July 18 substantive contribution: `2026-07-18`.

F10 remains a valid control for the pre-E037 P2 core and is not contradicted.

## Required corrections

### P8#0 — change `2026-07-28` to `2026-07-24`

The governing owner ruling is explicitly introduced under:

> **Owner rulings binding on this pass. Settled by Luke 2026-07-24.**

That ruling de-conditionalizes and retains P8 under number 8. Amendment 6 on July 28 leaves the P8 ruling unchanged; it resolves other classifications and narrows the separate P31 ruling. July 28 is therefore later closure/classification activity, not P8's effective date.

Use:

- `Date: 2026-07-24`
- provenance class: `RATIFIED_RECORD`
- confidence: `FIXED` or `HIGH`

### E038 — change `2026-07-18` to `2026-07-28`

The target E038 block is not the dated July 18 producer assignment. Amendment 6 creates the durable replacement rule:

> Current producer assignments are operational state and must be verified against `PROJECT-HISTORY.md`; changing the named producer does not alter permanent IDs, provenance classification, or independent-review obligations.

That target rule is owner-ratified on July 28. The July 18 assignment prose is displaced historical evidence and must not supply the target entry's date.

Use:

- `Date: 2026-07-28`
- provenance class: `RATIFIED_RECORD`
- confidence: `FIXED` or `HIGH`

## Consequence

No 65-row rerun is required. The architect may use the Codex table with these two explicit overrides, while independently checking selected evidence during exact manifest authorship.
