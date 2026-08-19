# DECISIONS migration Stage 2a — GPT review of Part C architect draft

**Date:** 2026-07-29  
**Status:** Independent provisional review. Not manifest ratification and not Stage 2b authorization.

## Result

Part C's population, order, kind/status/force assignments, dates, E043a boundary, E047 split, and E038 durable wording are accepted. Two optional-field corrections remain before assembly. The title and permission-field calls below are accepted.

## Accepted calls

1. **E047b title:** ratify `Unresolved vital sanity bounds` as the name-addressed citation identity. The thread carries DBP and MAP ceilings, the inherited temperature floor, laboratory `sao2`, and residual unratified sides; fixture F6's narrower demonstration title would misdescribe the target entry.
2. **R1 and R6 permission fields:** retain the `Authorized` and `Not authorized` fields. Both entries are `AUTHORIZING`, and taxonomy §6 expressly provides these fields where an entry grants or withholds permission. Keep every field on one physical line.
3. **Runtime-audio Owner:** keep omitted. No one path owns both the no-secret prohibition and the runtime fallback limb; F5 is an illustrative grammar fixture, not a ratified field set.
4. **No backticks in name-addressed titles:** accepted. Identifiers remain in statement text where needed.

## Required corrections

### 1. R2#0 — omit `Owner`

`src/measurementUnitPolicy.ts` owns the analyte-aware conversion table and display policy, but not the statement's byte-exact extraction-preservation clause. Under the ratified complete-statement/singular-owner policy, one governing limb outside the candidate path is enough to require omission. Add the candidate and reason to the omission register.

### 2. E038 — replace `Owner` with the required archive `Evidence` pointer during Part D

Remove `Owner: PROJECT-HISTORY.md`. `PROJECT-HISTORY.md` is the current operational-state record named in the durable statement, not the singular executable owner of the whole invariant.

The phase-1 closure ruling specifically requires the displaced dated producer-assignment prose to be preserved verbatim in the phase-2 archive and pointed at from E038's `Evidence` field. Part D must therefore:

- define the exact preservation location for the displaced E038 prose inside the normalized migration archive without creating a fourteenth X wrapper or a §8 archive-index line;
- pin the exact normalized archive filename in the manifest header;
- set E038's `Evidence` to that single tracked archive path;
- keep the statement's reference to `PROJECT-HISTORY.md` as the current operational source of assignment state;
- record `Owner: OMIT` in the omission register.

The preservation snapshot alone does not discharge the explicit archive-evidence-pointer ruling unless the architect demonstrates that the governing phrase "preserved verbatim in the archive" was intended to include it. Prefer the normalized migration archive as the literal implementation of the recorded ruling.

## Part D entry conditions

Part D begins from:

- 65 live blocks authored across Parts A–C;
- exact kind totals `37 P / 6 R / 19 I / 3 T`;
- E047b title fixed as `Unresolved vital sanity bounds`;
- R2 Owner omitted;
- E038 Owner omitted and Evidence pending the Part D archive-preservation design;
- R1/R6 permission fields accepted;
- runtime-audio Owner omitted;
- no Stage 2b work authorized.
