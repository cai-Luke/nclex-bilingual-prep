# Migration Commission Amendment 6 — Owner Ratification

**Date:** 2026-08-18 · **Act:** Owner ratification of Migration Commission Amendment 6, Revision 4.

## Instrument ratified

`DECISIONS-MIGRATION-COMMISSION-AMENDMENT-6-CLOSEOUT-EVIDENCE-REPAIR-2026-08-18.md`, drafting Revision 4.

Amendment 6 Clause A amends commission §9 and §10 to authorize one bounded closeout-evidence repair commit
after Commit 4 and before merge. Clause B amends Amendment 5 Clause B §2.2 to relocate the §7.3 cleanliness
endpoint from Commit 4 to the terminal pre-merge commit of the §9 sequence.

Per the amendment's own §3, this is the single owner act the amendment requires. The amendment is not
self-executing and did not take effect by being written.

## Owner ratification, verbatim

~~~text
OWNER RATIFICATION: Migration Commission Amendment 6 Revision 4 is RATIFIED.
~~~

## Pre-ratification correction record

Amendment 6 reached Revision 4 through three owner/reviewer corrections, each made before ratification and
each recorded in the amendment's own §4 drafting history:

1. **Revision 1 → 2, owner correction.** Clause A §1.2's prohibition on re-running, regenerating, or
   re-measuring "anything" was overbroad and would have barred the repair instrument's own required
   current-state measurements, making it unexecutable as written. Narrowed to the historical Instrument A
   evidence being transcribed, with an express carve-out for current-execution-state measurement.
2. **Revision 2 → 3, reviewing-seat correction.** Clause A §1.1 asserted that in each case the missing
   evidence sits in the Instrument A Revision 2 execution return. That is false of Commit 4's identity,
   which postdates that return. §1.1 now distinguishes the two sources.
3. **Revision 3 → 4, reviewing-seat correction.** The preamble sentence "Nothing is relocated, renamed,
   amended, rebased, or edited" was overbroad, since the instrument amends the commission and Amendment 5
   Clause B by its own terms. Narrowed to the migration-content authorities, pinned identities, and
   Commits 1–4 it was written to protect.

No correction changed any authorization, commit population, acceptance condition, gate result, or
implementation surface.

## What this ratification does and does not do

**Does:** authorize a single closeout-evidence repair commit (Commit 5) on the terms Clause A fixes;
relocate the cleanliness endpoint per Clause B; unblock the drafting and freezing of the closeout-evidence
repair instrument.

**Does not:** ratify, accept, or adopt the findings of `MIGRATION-RECEIPT.md`; accept repository
conformance, which under Amendment 5 Clause C remains fixed at merge; reopen the migration, Stage 2a, the
65 statements, the manifest, or the dispositions of Instruments A, B, or C; bind or rebind
`MIGRATION_DATE`, which remains `2026-08-18` under Amendment 1 Clause B; authorize any push, pull request,
merge, or any commit beyond Commit 5.

**OWNER RATIFICATION: RATIFIED.**
