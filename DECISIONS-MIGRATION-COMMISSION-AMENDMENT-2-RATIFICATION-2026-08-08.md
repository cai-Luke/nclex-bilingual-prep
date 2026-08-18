# Stage 2b Commission Amendment 2 — Owner Ratification

**Date:** 2026-08-08 · **Act:** Owner exact-byte ratification, in the same form as
`DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md`.

**Ratified instrument:** `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-STRUCTURAL-SURFACES-2026-08-08.md`,
**Revision 3**, **exactly `24202` bytes**, **SHA-256 `4cb16995cf8810bcf3ee65ffb07dc32a14a4fb5b0c4adc8ba5bbb2a2a535e9f4`**.

This record exists as a separate file, rather than as a banner edited into the amendment itself, for the
same reason the Stage 2a manifest was ratified by a separate record rather than by self-editing: writing a
ratification banner into the ratified document would change its bytes and the ratified identity would no
longer describe what is on disk. The amendment file is not edited by this act and remains frozen at the
identity above.

## What is in force

Per the owner's ratification statement, in force according to the amendment's own terms:

1. The ratified Stage 2a manifest (`332579` bytes / SHA-256
   `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2`) is unchanged and remains sole
   authority everywhere it already speaks.
2. Amendment 2 is additional construction authority, co-equal with the manifest, for exactly the eight
   target-document surfaces it names at its §2: the target §3 introduction; the target §3 table header and
   separator rows; the declared-total line; and the four §§4–7 section headings and transition paragraphs.
3. Commission §2.2's outside-manifest hard stop no longer fires for those eight surfaces (Amendment 2 §4.1).
4. Commission §5.6 now reads as amended (Amendment 2 §4.3): target `DECISIONS.md` is constructed from the
   ratified manifest **and** ratified Amendment 2.
5. Commission §4.8, §9, and §10 are amended as stated at Amendment 2 §4.4–§4.6. Commission §5.2 is
   clarified, not amended, per Amendment 2 §4.4's reasoning.
6. Stage 2b Phases 1–3 remain closed exactly as previously recorded. None consumed any surface this
   amendment pins.
7. Stage 2b Phase 4 (commission §5.6, as amended) may be commissioned.

## Architect-side confirmation at time of ratification

Independently reconfirmed against live disk immediately before recording this act: `get_file_info` on the
ratified path reports `24202` bytes, matching the ratified length exactly, and the file's modification
timestamp is unchanged since this seat's last edit — the bytes ratified are the bytes this seat last wrote
and read back, with no intervening edit.

**One capability gap, disclosed rather than papered over.** This seat's SHA-256 primitive from earlier in
this session (copying the live file to this seat's own sandbox, then hashing it there) is unavailable this
turn — the connector that bridged the two filesystems dropped mid-session, leaving only a connector with
read/write/edit access to the Desktop scope and no bridge to a hashing environment. This seat can confirm
the byte length independently but not the SHA-256 this turn. The owner's own shell measurement is, as
throughout this project, the authoritative measurement act; this gap does not weaken the ratification, and
is recorded here so a later seat does not mistake architect silence on the hash for architect agreement it
never actually reproduced.
