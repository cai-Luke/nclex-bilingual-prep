# Lab Reference-Range Verification Lane (Spec)

Date: 2026-07-04
Author: Claude (architect seat). This is primarily a **clinical-content + sourcing lane**, not a code
lane — Codex's role is limited to applying verified numbers to the registry once adjudicated. The
heavy lift is sourcing and adjudication, owned by the content models + Claude + Luke.

## Why this lane exists

`src/visuals/kinds/lab_trend/index.ts` opens with an explicit warning: **all reference bands and
sanity bounds in `ANALYTE_DEFS` are placeholders** pending source-verification against authoritative
references, and the peds buckets (`peds_child` / `peds_infant`) are "coarse approximations" the
verifier must confirm or narrow. This lane closes that.

It is **independent of** the exhibit-flowsheet migration and runs in parallel. The values-only
flowsheet needs only the wide magnitude sanity bounds (adequate as-is for GATE 4's gross-error catch),
so it is **not blocked** by this lane. What this lane unblocks is the future **H/L-flag and
reference-range-column** feature: those make reference bands learner-visible, and learner-visible
placeholder bands are unacceptable. Establishing the sourced foundation now means migrated flowsheets
can later gain a flag/range column without re-touching.

## Scope

For each of the 29 analytes in `ANALYTE_DEFS`, across the 3 populations (`adult`, `peds_child`,
`peds_infant`):

1. **`refBand { low, high }`** — the clinical reference range (drives H/L flags and the range column).
2. **`sanity { min, max }`** — the magnitude limits (drive GATE 4 and `value_out_of_range`
   validation). These are *not* clinical ranges; they are the outer bounds beyond which a value is
   almost certainly a unit/typo error. Verify each is wide enough not to reject real extremes and not
   so wide it lets a 10× error through.
3. **`stableEps`** — currently a uniform `0.10` fraction of band width. Confirm defensible per analyte
   or leave uniform with a recorded rationale.

Also confirm the 7 `VITAL_DEFS` normal ranges (adult-only today) — these look reasonable but should
get the same citation treatment for consistency, and a decision on whether peds vitals need bands.

## Hard discipline (non-negotiable)

- **Authoritative sources only.** Professional-society guidelines, government health agencies,
  established laboratory-medicine texts. **No model-invented ranges.** This is the deterministic-core /
  no-invented-clinical-content principle applied to reference data. A band without a citation does not
  land.
- **US conventional units.** Consistent with the CBC ruling (DECISIONS 2026-07-04): bands are
  expressed in each analyte's conventional-canonical unit (the same unit `ANALYTE_DEFS.canonicalUnit`
  now uses — for CBC that is `×10³/µL` after the step-0 fix, not SI).
- **Producer≠checker.** The model that proposes a sourced band never approves it. Proposal carries the
  citation; a second independent pass verifies the citation actually supports the number; Claude gates
  clinical validity; Luke (lab technologist, RN-track domain) is the final call, especially on peds.
- **Record provenance.** Each band records its source. The registry comment already points at
  `meta.source` per analyte / the U3 audit report — follow that convention so the ranges are auditable
  and not a second undocumented placeholder set.

## The peds problem (call out explicitly)

The registry flags peds bands as coarse approximations, and the age-band *definitions* themselves are
fuzzy — what age range is `peds_child` vs `peds_infant`? Two sub-decisions:

1. **Define the age boundaries** for `peds_child` and `peds_infant` (and whether a neonatal band is
   needed) before sourcing, because many analytes have age-dependent ranges that don't map cleanly onto
   two coarse buckets.
2. **Decide if 3 populations is enough.** Several analytes (e.g. alkaline phosphatase, which isn't in
   scope, but also total bilirubin, phosphate, WBC differentials) vary enough with age that two peds
   buckets may be indefensible. If so, either narrow the claims (only band analytes where the coarse
   bucket is defensible; leave others adult-only with a documented gap) or expand the population model
   (a bigger schema/registry change — its own decision). Do **not** ship a peds band that a nurse
   educator would call wrong just to fill the cell. This mirrors the pediatric `burn_map` /
   Lund-Browder caution already in DECISIONS: coarse peds clinical data is rejected, not approximated.

## Feedback loop from the migration

If the exhibit-flowsheet migration (see the batch-protocol spec) produces **GATE 4 WARNs** that
adjudication finds to be legitimate extreme-but-real values, those are evidence a **sanity bound is
too tight**. Fold them into this lane: they are the empirically-surfaced cases where the placeholder
magnitude limit was wrong. This gives the sanity-bound verification real test cases rather than
armchair bounds.

## Output

- A sourced reference-range table: per analyte × population, `refBand` + citation, `sanity` + rationale.
- The age-band definition decision and the "is 3 populations enough" decision, recorded.
- Codex applies the adjudicated numbers to `ANALYTE_DEFS` (and `VITAL_DEFS` if peds vitals are added),
  replaces the placeholder warning with a provenance pointer, and runs `test-visuals` +
  `test:measurement-allowlist` (the sanity bounds feed the shared module, so the drift-guard must stay
  green — if a sanity bound changes, the module re-derives and the pin updates).

## Explicitly out of scope

- Shipping H/L flags or reference-range columns. That is the *feature* this lane unblocks; it is a
  separate product decision (and a later minor schema addition — see the schema-1.8 spec's note on the
  flag column). This lane only establishes the sourced foundation.
- Any change to how the values-only flowsheet renders. Values-only never shows a band.
