# DECISIONS migration Stage 2a — P7 date correction

**Date:** 2026-07-29  
**Seat:** GPT independent review  
**Status:** Owner-facing correction to the non-authoritative date-provenance report.

## Finding

`DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-2026-07-29.md` assigns P7#0 the fixture-controlled date `2026-06-18`, but its own Git evidence catalog states that commit:

- `e8716a796e434ae706ad948207d333ed42e0a422`
- local date `2026-06-09`
- `feat(banks): promote 4 high-acuity case studies to hard-cases-canonical`

introduced the initial `DECISIONS.md` constitution and substantively introduced P7.

The fixture date therefore conflicts with the report's independently derived Git provenance. A parser fixture is not a substantive effective-date authority and must not override the introduction evidence.

## Correction

- **P7#0 / E009 Date:** `2026-06-09`
- **Provenance class:** `GIT_INTRODUCTION`
- **Confidence:** `HIGH`
- **Supporting source:** G01 from the Codex report.

The later adversarial-audit specifications apply and restate the precision-over-volume rule; they do not establish its first effective date.

## P25 distinction

P25#0 remains `2026-07-03`. Although the work order improperly treated the fixture as provenance, that date is independently supported by the July 3 extraction proposal and the existing GPT review. Its provenance label should be corrected when the manifest rationale is assembled, but its date byte does not change.

## Scope

This correction does not reopen the other 64 date rows and does not require a Codex rerun. The architect may proceed with Part A using P7#0 = `2026-06-09`.