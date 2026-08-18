# DECISIONS migration Stage 2a — date-provenance addendum

**Status:** Owner clarification to the in-flight date-provenance handoff. Read with `DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-CODEX-HANDOFF-2026-07-29.md`.

## E037 distinction

The mechanical act of `MERGE_INTO E039a, E002, E006` is consolidation bookkeeping and does not itself reset a target block's effective date.

The substantive rules carried by E037 are separate decision inputs and must be dated independently:

1. E037 rule 1 is the surviving universal core restored to P8. P8's de-conditionalization and retention under P8 were owner-ratified on `2026-07-24`; therefore P8's final target date is fixed at `2026-07-24`. Amendment 3 on `2026-07-28` concerns identifier allocation and narrowing of the earlier P31 ruling; it does not advance P8's date.
2. E037 rule 2 — every active generation lane declares producer provenance and independent-review routing — is a substantive application carried by both P2 and P5. Determine the recorded effective date on which that rule itself became governing from the source/history record. Do not use the later merge-classification date merely because the rule is relocated during migration.
3. P2 and P5 use the later of their pre-existing core effective date and E037 rule 2's own substantive effective date.

## Fixture-control clarification

F10's `2026-07-14` date pins the narrowed pre-E037 P2 rule and remains a valid base-date control. It does not prohibit the final assembled P2 block from advancing if E037 rule 2 is proven to have a later substantive effective date.

Do not stop merely because the assembled P2 date is later than `2026-07-14`. Instead report:

- P2 base decision: `2026-07-14`;
- E037 rule 2 effective date and provenance;
- the resulting max-date calculation.

Apply the same calculation to P5, whose baseline narrowing is also dated `2026-07-14` in the source entry.

If E037 rule 2's own effective date cannot be established without judgment, mark P2 and P5 `OWNER_REQUIRED`; do not silently choose `2026-07-14`, `2026-07-24`, or the merge date.

## Archive metadata confirmation outside the live-date task

For later Part D authorship, E048, E050, E051, and E052 carry `Original Status: SUPERSEDED`. This does not alter the live-date provenance output requested by the primary handoff.
