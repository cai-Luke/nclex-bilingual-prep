# Structured Measurements Schema 2.0 — Codex Spec

Date: 2026-07-09
Author: Claude (architect seat)
Implementer: Codex
Spec-conformance gate: Claude (architect)
Content gate: Claude Code

Adds two additive fields to `structuredMeasurements` — `bound` (censored values) and `population`
(pediatric rendering safety) — and closes the enforcement gaps the Candidates 12/13 gate review
surfaced. Governing decisions: `DECISIONS.md` principle 24 and its **Amendment (2026-07-09)**,
principle 26, and the **version-token invariant** under *Other standing invariants*.

**The version is `2.0`, and it is an additive change.** The major bump is an overflow digit, not a
breaking-change signal. This supersedes the `1.10` framing in the first draft of this spec.

Nothing here authorizes a canonical bank write. All bank changes stage and gate as usual.

---

## Why `2.0` and not `1.10`

`"1.10"` sorts correctly under exactly one of the three comparison strategies a version string meets
in this repo:

| | `parseFloat` | lexicographic | `indexOf` |
|---|---|---|---|
| `"1.10"` vs `"1.7"` floor | `1.1 < 1.7` ✗ | `"1.10" < "1.7"` ✗ | ✓ |
| `"2.0"` vs `"1.7"` floor | `2.0 > 1.7` ✓ | `"2.0" > "1.7"` ✓ | ✓ |

`"2.0"` is correct under all three. That matters more than usual here because **version strings leak
out of code** — they sit in `meta.schemaVersion` of every exported bank, in `PROJECT-HISTORY.md`
prose, in `NCLEX-Question-Schema.md`, and in the context windows of four models that reason about
floors in natural language and never call a comparator. A rank helper protects the code; only the
naming rule protects everything else.

Ratified rule (`DECISIONS.md`): **the minor component never exceeds 9; at `1.9` the next version is
`2.0`.** Retroactively consistent — `1.0`–`1.9` already satisfy it, so nothing migrates.

---

## PHASE 0 — `schemaVersionRank` (first commit; no longer a correctness blocker)

Under `2.0` no existing floor breaks, so this stops gating Phase 1. **Do it first anyway.** It is
roughly thirty lines, and it converts a lucky ordering property into an enforced one.

**It also has diagnostic value that outlives the bump.** If any floor compares versions with
`parseFloat` or lexicographically, that is a latent defect *today* — it has simply never fired,
because `1.0`–`1.9` happen to parse monotonically. Choosing `2.0` keeps it dormant. Find it now,
with nine bumps of headroom, rather than at `2.10` with more canonical banks at stake.

**Audit.** Report every schema-version comparison site with `file:line` before changing anything.
Known prose references to floors: `meta.schemaVersion >= 1.7` for pacer-bearing `rhythm_strip`; the
`1.2` visual floor; the `1.3` highlight / `1.4` bowtie / `1.5` rationale-visual / `1.6` unfolding-case
floors; the `consolidate` schema-version guard; `bankImport.ts`'s `toExportEnvelope` inference ladder.
There may be more. The audit is the deliverable — do not fix along the way.

**One question the audit must answer.** Do `consolidate`'s schema guard and `toExportEnvelope` enforce
`declared >= inferred`, or `declared == inferred`? The guard exists to catch declared *below* inferred —
a bank claiming `1.2` while carrying `1.7` content. Declared *above* inferred is always safe, because
floors are minimums. One `bound` value will lift an entire bank to `2.0` while most of its records still
only require `1.9`. If either site demands equality, that is a Phase 0 finding and it changes Phase 1.
State the inequality explicitly when you fix it; "tolerate declared > inferred" reads to a future agent
as "delete the check."

**Then:** export exactly one legal primitive from `src/schema.ts`:

```ts
export const schemaVersionAtLeast = (version: SchemaVersion, floor: SchemaVersion): boolean => ...
```

The rank/index implementation stays **private**. Every floor in the codebase is a `>=` comparison, so
`atLeast` is the only operation a caller ever legitimately needs; a public rank invites arithmetic on it
(`rank(v) - rank(floor) >= 0`, or worse, treating the index as a version). Throw on an unknown version.
Rewrite every comparison site found in the audit. No site parses, splits, or lexically compares a
version string again.

This is principle 11's single-definition discipline moved from arithmetic to ordering. One canonical
`roundTo` means two kinds cannot round the same dose differently; one canonical `schemaVersionAtLeast`
means two floors cannot disagree about whether `2.0` is newer than `1.7`. Same reason `roundTo` is not a
general math library: one definition, one legal operation.

**Regression that proves the phase was behavior-preserving:** every existing floor admits and rejects
exactly the banks it admitted and rejected before.

---

## PHASE 1 — The two fields

### 1a. `bound` — censored values

Source prose reports bounds, not numbers: `aPTT >150 seconds`, `D-dimer >50,000 ng/mL`,
`troponin <0.01 ng/mL`. v1 had no representation, and `parseMeasurementValue` silently stripped the
comparator, rendering `>150 seconds` as `150 seconds` beside intact prose reading `>150`. The strip is
gone. This phase gives the value a home.

**Type** (`src/types.ts`):

```ts
export interface StructuredMeasurementValue {
  columnId: string;
  value: string;            // numeric text only; NEVER carries a comparator
  unit: string;
  bound?: ">" | "<";        // NEW (2.0). Absent = exact.
  context?: "post_intervention";
}
```

**Validation** (`src/schema.ts`):

- `value` matching `/[<>≤≥]/` is a **hard FAIL**, with a message pointing at `bound`. Not optional, not
  a strip. (Check whether this landed in the 2026-07-09 patch pass; if so, add the fixture and move on.)
- `bound` present ⇒ the bank declares `2.0`, enforced through `schemaVersionRank`.
- `bound` is the enum or it fails. No `>=`, no `≤`, no free text.

**Sanity bounds become one-sided.** `MeasurementDef.sanity` currently checks `min <= v <= max`. For a
bounded value:

- `bound: ">"` ⇒ check `value >= sanity.min` only. Ignore `max`.
- `bound: "<"` ⇒ check `value <= sanity.max` only. Ignore `min`.

Without this, `D-dimer >50,000` fails the gate that exists to catch typos, and `aPTT >150` clears a
`max` of 200 purely by luck. A bound asserts the true value lies past the number; the gate cannot
bracket what the assay could not measure.

**Never banded.** A bounded value is never compared against `refBand`. Moot today — v1 renders no
bands — but the reference-range lane must inherit it, so encode it now.

**Rendering** (`src/structuredMeasurements.ts`):

- `formatStructuredMeasurementValue` prefixes the bound: `>150 seconds`, `<0.01 ng/mL`.
- The SI parenthetical is **suppressed** for bounded values. Converting a bound is meaningful;
  printing two of them is clutter.
- `parseMeasurementValue` stays strict and unchanged. With `bound` lifted out, `value` is clean numeric
  text, so the strict parser never sees a comparator. That is the design working, not a special case.

**The bound is transcribed, never adjusted.** Whether a facility's aPTT reportable ceiling is 150 or
200 seconds is a reference-range question owned by `lab-reference-range-verification-spec.md`. The
extractor copies what the source says.

### 1b. `population` — pediatric rendering safety

**Type** (`src/types.ts`):

```ts
export interface StructuredMeasurements {
  population?: "adult" | "peds_child" | "peds_infant";  // NEW (2.0). Wrapper-level.
  panels: StructuredMeasurementPanel[];
}
```

Wrapper-level, **not** per-panel: population is a property of the client, not of a table. A vitals
panel and a labs panel in one exhibit describe the same person.

**Validation** (`src/schema.ts`): enum or FAIL. Presence implies `2.0`. **Optional** — see below.

**Enforcement lives in the gate, not the schema.** Luke's ruling is *pediatric records require
`population` explicitly; do not mass-migrate existing adult records just to write `"adult"`.* Those two
clauses are in tension with a schema-level requirement, because a bank is one file with one
`meta.schemaVersion`: the moment a single `2.0` record lands in `gpt-canonical.json`, a
"required at 2.0" rule would demand `population` on every structured record in that bank — exactly the
mass migration Luke forbade.

So:

- **Schema:** `population` is optional; if present it must be a valid enum. Absent behaves as adult.
- **Flowsheet gate + applicator:** a record whose case or exhibit is pediatric and whose `population`
  is absent (or `"adult"`) is a **FAIL**. Never a WARN.

**The pediatric predicate is authored, then cross-checked.** The producer declares `population` on the
staging record. The gate independently detects pediatric context from source prose and case metadata —
age in months, age under 18 years, markers such as `toddler`, `infant`, `neonate`, `well-child`,
`pediatric`, `peds`, weight-based dosing — and FAILs on disagreement. Author is the source of truth;
the detector exists only to fail the author. Same producer≠checker shape as the calcium identity WARN,
escalated to FAIL because the failure mode is worse: a mis-declared adult population renders a normal
toddler as abnormal, and the error stays invisible until the reference-range lane lands.

**The detector ships with the rule.** The FAIL condition is Phase 1; the prose detector that makes it
enforceable is gate code and lives in `scripts/` alongside Phase 2's work. Land them together. A FAIL
condition with no detector is a comment.

**A field with no v1 consumer, deliberately.** Principle 24 rejected `displayUnit` and GPT's proposed
`sourceUnitText` on exactly the grounds that no v1 consumer reads them. `population` is admitted anyway,
and the distinction is load-bearing enough to state so a future agent does not "clean it up":

> Reject fields that are **derived** — a stored copy of something the renderer can recompute invites the
> drift a single `roundTo` exists to prevent. Admit fields that are **irrecoverable context** —
> information the applicator holds and the record cannot reconstruct. Adding `population` later is a
> content migration over canonical exhibits; adding `displayUnit` later is one line in the formatter.

Concretely: `opus23_nat_toddler_01`'s creatinine 0.3 / Hgb 11.4 / HR 152 and
`nine_month_well_child_safety_01`'s Hgb 10.8 are all normal for their ages and all outside the adult
bands in `ANALYTE_DEFS`. Nothing reads those bands today. Everything will.

---

## PHASE 2 — Gate rules from the amendment (no schema change)

Each is independently testable; none touches `types.ts`.

1. **`prior_no_current`.** `excludedValues` entries with `reason: "prior"` require a same-key current
   value in the same record. When absent, the record routes to a `prior_no_current` review/FAIL path.
   Origin: `gpt_case_refeeding_syndrome_tpn_01/baseline_record` excluded a sixteen-analyte PACU panel as
   `prior` with no current sibling for any key, leaving the baseline flowsheet with vitals and one
   point-of-care glucose. Where the earlier value *is* the exhibit's only reading, it keys as the current
   column and the column label carries the source's marker (`PACU (6 h prior)`).

2. **GATE 2 blindness is the general defect (principle 26).** The completeness advisory fires on *named
   but neither keyed nor excluded*, so any exclusion silences it. Add: **exclusion count is a positive
   sampling signal.** The checker-seat queue must always sample records in the top decile of
   `excludedValues.length`, alongside the existing `skip_serial` / `post_intervention` / unit-alias triggers.

3. **`post_intervention` is a reassessment marker, not a co-location marker.** Tag only when the value is
   explicitly presented as a reassessment after an intervention directed at that measurement, or after a
   clearly framed treatment bundle. Encode in the extraction prompt and in the adjudication checklist.
   Forcing case: refeeding `stage_2_update` (TPN initiation is the *cause*, untagged) vs `stage_3_update`
   ("After interventions, repeat labs", tagged).

4. **GATE 2 unitless subclass.** New advisory, distinct from *named but unkeyed*: an allowlist-named
   analyte carrying a **number with no adjacent unit token**. The check that should have caught
   `Hour 18 labs: WBC 19,200/mcL, Hct 38%, BUN 18, Cr 0.8, …`.

5. **`Cr` label pattern.** The gallstone GATE 2 advisory count is 12 against 13 allowlist-named unkeyed
   tokens by hand-count; the likely miss is the `Cr` abbreviation. Verify. If the creatinine label pattern
   does not match `Cr`, a future exhibit writing `Cr 2.4 mg/dL` keys nothing *and* raises no advisory —
   silent omission, the class Batch 13 caught with PaO2. Regression: `Cr 2.4 mg/dL` must key.

---

## PHASE 3 — Display defects (code only, no canonical change)

All three predate Candidates 12/13 and affect already-promoted rows. Every fix lives in the formatter.

1. **`trimNumber` destroys significant zeros.** It round-trips through `Number`, so `creatinine 1.0`
   renders `1 mg/dL` and `INR 1.0` renders `1`. On the `inputIsPrimary` path, emit `entry.value` verbatim
   (thousands separators stripped) instead of parse → round → stringify.
2. **Placeholder units leak to the learner.** `displayPolicyFor` falls back to `def.canonicalUnit`, so pH
   renders `7.32 (unitless)` and INR renders `1 (ratio)`. Map both to an empty display unit.
3. **CBC SI parenthetical is a numeric no-op.** `wbc`/`platelets` carry `primaryUnit ×10³/µL` against
   `secondaryUnit ×10⁹/L` at a conversion factor of exactly 1, so every promoted CBC row renders
   `19.2 ×10³/µL (19.2 ×10⁹/L)`. Suppress the parenthetical when the factor is 1.

---

## Surfaces to update

**Code**
- `src/types.ts` — `bound`, `population`, `SchemaVersion` gains `"2.0"`.
- `src/schema.ts` — `SCHEMA_VERSION`, `supportedSchemaVersions`, `schemaVersionAtLeast` (public) over a
  private rank, comparator FAIL, one-sided sanity, enum checks; strict-unknown-key recursion covers both
  new fields.
- `src/allowedKeys.ts` — both new keys, or `scan-unknown-keys` reports them off-schema.
- `src/bankImport.ts` — `toExportEnvelope` infers `2.0` when any `bound` or `population` is present.
- `src/measurementUnitPolicy.ts` — `parseMeasurementValue` unchanged (already strict); suppress the SI
  paren for bounded values.
- `src/structuredMeasurements.ts` — bound-aware `formatStructuredMeasurementValue`,
  `serializeStructuredMeasurements`, `renderStructuredMeasurementsSvg`; Phase 3 fixes.
- `scripts/` — flowsheet gate (`prior_no_current`, pediatric FAIL, unitless subclass, `Cr` pattern,
  exclusion-count sampling), applicator, `consolidate` schema guard.

**Docs — schema source of truth first**
- `NCLEX-Question-Schema.md` — **authoritative.** Both fields, `2.0`, the one-sided sanity rule, the
  never-banded rule, the pediatric FAIL, the derived-vs-irrecoverable field test, and the version-token
  invariant (minor never exceeds 9; major is an overflow digit).
- `PROJECT-HISTORY.md` — currently claims schema `1.8` is current while `src/schema.ts` reads `1.9` with
  `io_trend` landed. **Fix the 1.9 drift before adding 2.0.** Do not stack a new version onto a stale
  statement. When adding `2.0`, state in the same line that the major bump is additive.
- `CLAUDE.md` — claims schema `1.7` is current. Same fix.
- `AGENTS.md` — the normalize-raw-bank section still references schema `1.6` glossary migration; check
  whether it wants version-agnostic phrasing.
- `DECISIONS.md` — **already written.** Principle 26, the 2026-07-09 amendment, and the version-token
  invariant are on disk. Do not re-litigate or re-word them; if implementation forces a change to a
  ratified rule, stop and escalate to the architect seat rather than editing the principle.

Three files currently claim three different current schema versions. That is the drift that sends every
fresh agent down the read-order into a contradiction. One commit to fix, and it is a precondition.

---

## Tests

`schemaVersionAtLeast` (Phase 0)
- `atLeast("2.0", "1.9")` and `atLeast("2.0", "1.2")` are true; `atLeast("1.2", "1.7")` is false.
- Every existing floor (1.2 / 1.3 / 1.4 / 1.5 / 1.6 / 1.7) admits and rejects exactly the banks it did
  before. **The regression that proves Phase 0 was behavior-preserving.**
- Unknown version throws.
- Guard test: no version string in `supportedSchemaVersions` has a minor component above 9.
- No public export exposes a version index or rank.

`bound`
- Comparator in `value` (`">150"`) → FAIL, message names `bound`.
- `bound: ">"`, `value: "150"`, `unit: "seconds"` → PASS.
- `bound: ">"`, `value: "50000"`, `unit: "ng/mL"` on a key whose `sanity.max` is below 50000 → PASS
  (one-sided). Same value **without** `bound` → FAIL.
- `bound: "<"`, `value: "0.01"` below `sanity.min` → PASS. Without `bound` → FAIL.
- `bound` present on a bank declaring `1.9` → FAIL.
- Render: `>150 seconds`, no SI parenthetical.

`population`
- Invalid enum → FAIL.
- Present on a bank declaring `1.9` → FAIL.
- Absent on an adult record → PASS, behaves as adult.
- Absent on a record whose case prose carries a pediatric marker → **gate FAIL**.
- Declared `"adult"` on a pediatric-detected record → **gate FAIL**.
- Declared `"peds_infant"` on `nine_month_well_child_safety_01` → PASS.

Phase 2
- `prior` exclusion with no same-key current → `prior_no_current` FAIL.
- `prior` exclusion with a same-key current → PASS.
- Allowlist-named analyte, bare number, no unit → new advisory.
- `Cr 2.4 mg/dL` keys `creatinine`.

Phase 3
- `creatinine` `"1.0"` `mg/dL` renders `1.0 mg/dL`, not `1 mg/dL`.
- `ph` `"7.32"` renders `7.32`, no `(unitless)`.
- `wbc` `"14,200"` `/uL` renders `14.2 ×10³/µL`, no parenthetical.

Full suite before calling the pass complete:

```sh
npx tsc -b --pretty false
npm run test:schema-bank
npm run test:structured-measurements
npm run test:measurement-allowlist
npm run test:flowsheet-gate
npm run scan-unknown-keys
npm run validate-bank -- banks/*.json
npm run test-visuals
npm run census:check
npm run build
```

---

## Sequencing and gates

**Execution order is 0 → 3 → 1 → 2, not 0 → 1 → 2 → 3.** The phase *numbering* below is unchanged; only
the order in which they land is. Phase 3 is hoisted ahead of Phase 1 for two reasons. Both Phase 3 and
Phase 1b's bound-aware rendering live inside `formatStructuredMeasurementValue`, so running Phase 1
first means editing the same function twice, the second time on top of known-wrong output. And
Candidates `07B`/`08A` promoted ABG surfaces, so `pH 7.32 (unitless)` is very likely rendering in the
live bank right now, alongside every `creatinine 1.0` reading `1 mg/dL`. Phase 3 is three formatter
fixes with zero dependencies and it is the only work in this plan the learner can see.

Phase 0 lands as its own commit with its own regression, before any field exists — not because `2.0`
requires it, but because the audit finding is worth having and it makes the `2.0` tests mean something.
The audit (report-only) and the `schemaVersionAtLeast` implementation are **separate commits with an
architect gate between them**. Keep every later phase a separable commit too.

Phase 2's `prior_no_current` and `post_intervention` rules unblock the `13H` hold artifact; nothing in
`13H` re-stages until Phases 1 and 2 are both green.

**Before `13H` re-stages, sweep the staged and held artifacts for comparators.** The 0-hit sweep covered
promoted canonical only. Batches 01–20, `skip_serial` records, empty extracts, and the `12G` / `12T` /
`13H` holds have never been checked, and `<0.01` is the most common censored value in real lab prose.
With `bound` landed this is no longer a defect — it is a data question: report which held records need
the field, before re-staging rather than after.

Per `DECISIONS.md` principle 2 extension: **Codex does not merge or push `main`.** Spec-conformance is
verified by the architect seat, which authored this document. Content review of any re-staged artifact
goes to Claude Code, which has not read this spec — deliberately, and that is the reason the two checks
are separate.

Before implementing, Codex performs its pre-implementation review and returns objections. The architect
adjudicates. Phase 0's audit findings are an expected source of objections and should be reported before
the rank function is written.

## Deferred, deliberately

- **Reference bands.** Every `refBand` in `lab_trend/defs.ts` is an unverified placeholder. `population`
  is stored, not consumed. `lab-reference-range-verification-spec.md` owns the consumption and must
  inherit two rules from this spec: bounded values are never banded, and `glucose` is never banded
  without a fasting qualifier.
- **Single-row labs panels.** `gpt_case_overdue_preventive_screening_01` renders a labs panel of exactly
  one row. A two-row floor is proposed, not ruled.
- **Fishbone renderer.** Still a fast-follow. Nothing here changes that.
- **Gallstone / TLS holds (12G, 12T).** TLS unblocks on `uric_acid`, already landed. Gallstone unblocks
  on the Phase 2 unitless subclass plus `inferredUnit`, both of which change what it extracts. Re-stage
  after, not during.
