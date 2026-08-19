# Stage 2b Commission Amendment 3 — Owner Ratification

**Date:** 2026-08-08 · **Act:** Owner exact-byte ratification, in the same form as
`DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md` and
`DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-RATIFICATION-2026-08-08.md`.

**Ratified instrument:** `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-ASSEMBLY-JOINS-2026-08-08.md`,
**Revision 4**, **exactly `26963` bytes**, **SHA-256
`9a1a3a898bf847d8dbe760c7aba702f3a3c3c3381c760bba989ffa5b8542944e`**.

This record exists as a separate file, rather than as a banner edited into the amendment itself, for the
same reason Amendment 2 and the Stage 2a manifest were each ratified by a separate record: writing a
ratification banner into the ratified document would change its bytes, and the ratified identity would no
longer describe what is on disk. The amendment file is not edited by this act and remains frozen at the
identity above.

## What is in force

Per the owner's ratification statement, in force according to the amendment's own terms:

1. The ratified Stage 2a manifest (`332579` bytes / SHA-256
   `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2`) and ratified Commission Amendment 2
   (Revision 3, `24202` bytes / SHA-256 `4cb16995cf8810bcf3ee65ffb07dc32a14a4fb5b0c4adc8ba5bbb2a2a535e9f4`)
   are unchanged and remain authoritative for their existing, disjoint byte populations.
2. Amendment 3 is additional construction authority, co-equal with the manifest and Amendment 2, for
   exactly the join-byte population its own §2.1 defines: every inter-fragment boundary byte in Stage 2b
   Phase 4's assembly sequence, plus the single end-of-document byte.
3. Commission §2.2's outside-manifest hard stop no longer fires for that join-byte population (Amendment 3
   §4.1), on top of the exception Amendment 2 §4.1 already carved out for its own eight surfaces.
4. Manifest M1's sole-authority statement, and Amendment 2 §4.2's "without exception" clause, are narrowly
   superseded for the join-byte population only (Amendment 3 §4.2) — neither the manifest nor Amendment 2
   is edited; both statements continue to govern every byte outside the two populations now carved out.
5. Commission §5.6 now reads as amended a second time (Amendment 3 §4.3): target `DECISIONS.md` is
   constructed from the ratified manifest, ratified Amendment 2, **and** ratified Amendment 3 together.
6. Commission §4.8, §9, and §10 are further amended as stated at Amendment 3 §4.4–§4.6. Commission §5.7,
   §7.1, §8, and §12 are not amended, for the reasons Amendment 3 §0 and §3 state.
7. Stage 2b Phases 1–3 remain closed exactly as previously recorded. None consumed any surface or join
   this amendment pins.
8. Stage 2b Phase 4 may proceed under commission §5.6 as twice-amended — **after** the Phase 4 work order
   itself is externally hash-frozen. Ratifying this amendment does not itself hash-freeze or issue Phase 4;
   that remains a separate, subsequent act.

## Architect-side confirmation at time of ratification

Independently reconfirmed against live disk immediately before recording this act, using the Filesystem
sandbox bridge (available again this turn after being unavailable earlier in the session): a fresh copy of
the ratified file hashes to exactly `26963` bytes / SHA-256
`9a1a3a898bf847d8dbe760c7aba702f3a3c3c3381c760bba989ffa5b8542944e` — an exact, independently-reproduced
match to the owner's stated identity, not merely a byte-count check this time. The file's modification
timestamp is also unchanged since this seat's last edit, confirming no intervening write occurred between
that edit and this ratification.
