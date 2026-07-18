# Vital-Sign Sanity Bounds — P3 Deterministic Survey — Architect Spec

Date: 2026-07-17
Author: Claude (architect seat)
Preliminary notes: GPT-5.6 Sol (accepted with five corrections, see §16)
Spec review: GPT-5.6 Sol (three clarifications, folded in — §17); GPT-5.6 Terra, implementing seat (no notes — §17)
Implementer: the producing seat named in §11 (GPT-5.6 Terra as of 2026-07-17)
Survey-manifest content gate: checker seat, never the producing seat (see §11)
Spec status: **RATIFIED for P3 survey implementation — Luke, 2026-07-17.** Amended 2026-07-17
(§§18–19); PR #57 is on hold pending the §19 provenance repair and independent recheck.
Bound status: **no vital-sign bound is ratified, selected, or authorized to change by this spec.**

These are two separate decisions and must not be collapsed. Ratifying the survey ratifies no number.
A fresh agent reading this file should treat the survey as authorized work and every bound in §3 as
still open under `DECISIONS.md` §7.

Governing thread: `DECISIONS.md` §7, first REVISIT entry ("Vital-sign `sanity` bounds are copied
renderer validation envelopes, not authored plausibility bounds"). Its stated next step is *"the
deterministic inventory across all seven vitals (enumerate, convert, distinguish renderer-envelope
vs. tripwire vs. population-normal-range)."* This spec is that inventory and nothing else.

Change class: new read-only script + committed dated artifact + focused regressions. No change to
`src/measurementAllowlist.ts`, `src/measurementUnitPolicy.ts`, any renderer, any bank, or
`DECISIONS.md`. Verification floor is set in §13.

---

## 1. Scope, and the hard stop

P3 is **not** "pick six new limits." It is a contract-separation and population inventory that stops
before any number changes.

Authorized by this spec:

- one deterministic survey generator;
- one committed dated manifest;
- focused boundary/probe regressions;
- **zero** bound changes.

Explicitly **not** authorized here — each requires its own later spec, seat, and ratification:

- selecting or narrowing any `sanity` bound, on either side, for any vital;
- changing `VITAL_DEFS[key].range`;
- changing `validateVitalsTrend` or its `30–43 °C` / `86–109 °F` behavior;
- creating pediatric reference bands;
- changing MAP cross-series invariants (§8);
- changing GATE 4's WARN-versus-FAIL policy;
- changing bank content;
- changing the measurement-unit vocabulary or `acceptedSourceUnits`;
- changing lab sanity bounds (separate REVISIT thread).

## 2. Seven vitals, not six

`NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md`'s P3 heading says "six-vital." That phrasing is
the loose one; `DECISIONS.md` §7 already says **all seven**, and §7 governs. The survey covers
`hr`, `sbp`, `dbp`, `map`, `rr`, `spo2`, **and** `temp`.

Temperature is in scope for three reasons, none of which reopen its ratified ceiling:

1. it is the worked comparison case — the only vital whose sanity contract has been deliberately
   decoupled from the renderer envelope;
2. its **floor** (`30 °C`) remains inherited and explicitly unratified — `r9-temperature-sanity-decoupling-codex-spec.md`
   §7.1 and `DECISIONS.md` §7 both say so;
3. it is the only vital with multiple accepted source units and affine conversion, which is what
   makes §7's probe requirements non-uniform.

## 3. Verified current state (re-derived from live disk, 2026-07-17)

`src/visuals/kinds/vitals_trend/defs.ts` and `src/measurementAllowlist.ts`:

| Vital | Renderer `VITAL_DEFS.range` | Effective renderer authoring envelope | Current `MeasurementDef.sanity` | Sanity side authorship |
|---|---:|---|---:|---|
| `hr` | 10–300 bpm | same | 10–300 | both inherited |
| `sbp` | 40–300 mmHg | same | 40–300 | both inherited |
| `dbp` | 20–200 mmHg | same | 20–200 | both inherited |
| `map` | 30–250 mmHg | same | 30–250 | both inherited |
| `rr` | 2–80 /min | same | 2–80 | both inherited |
| `spo2` | 50–100 % | same | 50–100 | both inherited |
| `temp` | 30–110 °C (legacy; bypassed) | `30–43 °C` / `86–109 °F`, source-unit-specific | 30–46.5 | floor inherited; **ceiling authored + ratified** |

Six of seven are exact aliases of a renderer validation envelope. Temperature is decoupled on the
ceiling only. This table is orientation; the generator re-derives all of it (§5) rather than reading
it from here.

## 4. The evidence base is not empty — carry the prior record

The survey must not be authored as though the question is fresh. Two live records go into the
manifest as **prior findings**, source-cited, before any new row is generated:

1. **`DECISIONS.md` §8, the withdrawal entry.** The claim "vitals `sanity` passes every real
   transcribed value" was withdrawn as unprovable of a copied renderer envelope, and *contradicted by
   evidence*: documented SBP to ~370, RR at the `80` ceiling with no margin, displayable SpO₂ below
   50. Those three counterexamples are the reason this thread exists. They are prior findings, not
   rediscoveries.
2. **The 2026-07-11 survey and pre-move sweep.** Current `DECISIONS.md` §7 preserves only the compact
   summary: "Survey and pre-move sweep are complete (2026-07-11: zero flips in the promoted corpus
   under either tested probe)." The fuller contemporaneous record was located in Git history at
   `DECISIONS.md` in commit `a67476cee75e365dd72c22a589d8e76c6e3ddc6d`, which is an ancestor of
   `main`. That record says the report-only survey tabulated each `VITAL_DEFS` key; identifies the
   tested temperature probes as the `30–43 °C` validator and exploratory `10–50 °C` interval; records
   zero flips; and records promoted canonical temperature as `36.7–40.11 °C` and refreshed extraction
   artifacts as `35.8–40.11 °C`.

The later `r9-temperature-sanity-decoupling-codex-spec.md` §6.1 remains a **separate 2026-07-15
re-derivation**. It supports 104 temperature values, a canonical-Celsius span of
`35.8–40.111111111111114`, and zero flips at the ratified `T = 46.5 °C`. It corroborates the later
corpus state but is not the source for the July 11 probe labels or historical spans. The current
`Archive/DECISIONS-ARCHIVE-2026-07-14.md` does not contain the historical temperature record and must
not be cited as though it does.

The manifest's `priorFindings.sweep20260711` must use this contract:

```ts
sweep20260711: {
  located: true,
  sources: [
    "DECISIONS.md at commit a67476cee75e365dd72c22a589d8e76c6e3ddc6d (2026-07-11 historical survey and pre-move sweep record)",
    "DECISIONS.md §7 (current constitutional summary)",
    "r9-temperature-sanity-decoupling-codex-spec.md §6.1 (separate 2026-07-15 independent re-derivation)",
  ],
  priorResult:
    "Git history at a67476cee75e365dd72c22a589d8e76c6e3ddc6d records the 2026-07-11 report-only survey and pre-move sweep: zero flips under the 30-43 C validator and exploratory 10-50 C probes, promoted canonical temperature 36.7-40.11 C, and refreshed extraction artifacts 35.8-40.11 C. Current DECISIONS.md §7 preserves the compact zero-flip summary. Separately, the 2026-07-15 r9 §6.1 survey found 104 temperature values spanning 35.8-40.111111111111114 C and zero flips at the ratified T = 46.5 C.",
  reconciliation: "EXTENDS",
  adds: [
    "all seven vital keys, deterministically enumerated",
    // retain the remaining truthful P3 additions emitted by the generator
  ],
}
```

`EXTENDS` remains correct because P3 adds seven-vital coverage, both machine-readable surfaces, all
six visual locations, population reporting, unit/conversion evidence, side authorship, mechanism
cost, boundary-neighbor records, and reusable candidate-interval accounting beyond the Git-backed
July 11 record. Here `EXTENDS` means P3 extends that record's limited survey/sweep scope; it does not
mean that any probe, span, population, or conclusion beyond the exact cited historical text was
verified.

## 5. The four separated concepts

For every one of the seven vitals, the manifest displays these as **four distinct fields**. They are
different contracts and the whole point of P3 is that they stop being conflated.

1. **Renderer authoring envelope** — what an author may place in a `vitals_trend` visual. Owned by
   `VITAL_DEFS[key].range`, except `temp`, whose active validator bypasses the registry range and
   applies source-unit-specific bounds.
2. **Adult normal/reference band** — `VITAL_DEFS[key].normal()`. Clearly labelled **non-governing**.
   It is a display band. It is not a tripwire input.
3. **Canonical-unit warning tripwire** — `MEASUREMENT_ALLOWLIST[key].sanity`, applied by
   `scripts/exhibit-flowsheet-gate.ts` GATE 4 **after** conversion to canonical unit, at WARN level.
4. **Accepted source units and conversion policy** — `acceptedSourceUnits` plus the conversion mode
   (identity / linear / affine).

> **Standing prohibition, restated in the manifest header:** do not derive a global typo/unit-error
> tripwire from an adult normal range, and do not create pediatric normal ranges as a P3 ride-along.

### 5.1 Reporting limit and critical threshold — relocated, not dropped

The handoff named five distinctions; the four above are only four. **Reporting limit** and **critical
threshold** are *not* dropped. Neither has a repo surface to inventory, so they cannot be manifest
fields. They relocate to the **stage-3 sourcing vocabulary** (§15), which is where they actually bite —
the SpO₂ floor is the obvious case, and is unlikely to be answerable from anything but device /
reporting-limit evidence. The spec states this explicitly so the handoff's obligation is discharged on
the record rather than lost by omission.

## 6. Population is a trap — report it, do not solve it

`vitals_trend` accepts `population` of `adult | peds_child | peds_infant`
(`src/population.ts`). Reference bands are **adult-only** and enforced:
`validateVitalsTrend` emits `reference_band_population_unsupported` when a non-adult population sets
`showReferenceBand: true`, and `renderVitalsTrendSvg` bands only when `population === "adult"`.
Structured-measurement panels carry `population` at schema 2.0.

The `sanity` tripwire is **global** — one band per key, no population dimension, at either surface.

The manifest reports population per record and reports this asymmetry as a finding. It does not
propose a population-aware tripwire and does not author pediatric bands.

## 7. Population to inventory — deterministic, machine-readable surfaces only

### 7.1 Included

- every `vitals_trend` series value, at **all six full-schema visual locations**, via
  `src/schema.ts`'s shared full-schema projection (`collectAllVisuals`) — do **not** add a new
  traversal (P0 closed that; `DECISIONS.md` principle 19);
- every structured-measurement `vitals`-panel row whose `key` is one of the seven, across
  `caseStudy.exhibits[].structuredMeasurements` and `caseStudy.stages[].exhibits[].structuredMeasurements`;
- all deterministically discovered top-level canonical `banks/*.json` — record the observed file list
  and count in the manifest rather than asserting a fixed number;
- `banks/banks-raw/` and promoted-staging, **where those directories exist**.

**Two collectors, not one loose value walker.** `vitals_trend` values are `number` with unit implied
by the vital (and `tempUnit` declared at the visual-spec level, not per value).
Structured-measurement values are `string` with a required per-value `unit` and an optional typed
`bound`. These do not share a shape; do not force them through one walker.

**Absent staging directories are an empty population**, not an error — reuse the P0 survey's
handling exactly (`audit/rationale-visual-floor-survey-2026-07-16/`), which treats absent optional
raw/promoted directories as empty in clean Git checkouts *while preserving every other filesystem
failure*. Do not invent new handling.

### 7.2 Excluded — free prose, with the limitation stated

The first P3 pass does **not** parse free prose. Rationale: prose tokenization would inject a
heuristic completeness claim into an otherwise deterministic inventory, and neither the renderer
envelope nor `sanity` governs prose — machine-readable values are the population these contracts
actually reach.

**But scoping it out silently is not the same as scoping it out.** The manifest must carry an explicit
stated limitation naming the excluded population and the boundary, on the precedent of the recursive
topic-license report, which explicitly limits itself to vocabulary membership and declared licenses
and says so in its own output. Silence is a rejected manifest.

## 8. Adjacent invariants — report, do not redesign

MAP carries two protections today, both verified live in `src/visuals/kinds/vitals_trend/index.ts`:

- `validateVitalsTrend` emits `map_bounds_violation` when MAP falls outside `[DBP, SBP]` at any
  timepoint where all three series are present and length-matched;
- `selfCheckVitalsTrend` recomputes `Math.round(dbp + (sbp - dbp) / 3)` and emits
  `self_check_map_failed` on mismatch.

These are cross-series consistency checks, not sanity-bound selection. The manifest reports their
existence and any live violations. It does not redesign them.

## 9. Manifest shape

One committed dated artifact under `audit/vital-sanity-bounds-survey-2026-07-17/`, JSON, byte-sorted,
deterministic across runs. Per vital:

- renderer `VITAL_DEFS.range`;
- effective renderer authoring envelope (source-unit-specific where applicable);
- current `sanity` range;
- **per side**: `inherited` or `independently_authored`, with the authoring citation where authored;
- adult normal band, labelled `governing: false`;
- `acceptedSourceUnits`;
- conversion mode: `identity | linear | affine`;
- counts by surface, population, bank, and location — carrying **`populationDeclared` and
  `populationEffective` as separate per-record fields.** These do not share a rule across surfaces and
  must not be normalized to one. For `vitals_trend`, an absent `population` has effective value
  `adult`: `renderVitalsTrendSvg` applies that default explicitly, and `validateVitalsTrend`'s
  reference-band restriction only fires when `population` is present and non-adult. For structured
  measurements, an absent `population` stays `unspecified` — verified 2026-07-17 that no executable
  default exists; the type merely makes the field optional, and neither `formatStructuredMeasurementValue`
  nor `renderStructuredMeasurementsSvg` reads it;
- exact live min and max (canonical units);
- **records at or near each current boundary**, defined deterministically as: every exact boundary
  hit, plus the five nearest numeric records on each side, ranked by absolute canonical-unit distance
  from the bound, with bank path, then record path, then value as tie-breakers. Censored and
  typed-bound records have no canonical value and are excluded from this ranking — they surface under
  the typed-bound finding instead;
- unrecognized / unconvertible units — explicit findings, never silently skipped;
- censored values and typed `bound` entries — reported separately from numeric values;
- current GATE 4 classification;
- the §4 prior findings;
- the §7.2 stated limitation.

Deliberately **absent** from this pass: flip counts. There are no candidate intervals yet. The
generator takes candidate intervals as an *input parameter* so the later sourcing pass (§15, stage 3)
can produce flip counts against a fresh corpus without a second generator being written.

### 9.1 Unit acceptance and conversion are separate results

Do not collapse them. `toCanonicalMeasurementValue`'s temperature path (verified live in
`src/measurementUnitPolicy.ts`) converts `°f`/`f` and otherwise **returns the raw number unchanged** —
it does not verify that the source unit is accepted. A survey that assumes a non-Fahrenheit unit is
Celsius will silently launder an unrecognized unit into a valid-looking canonical value. Normalize the
raw unit against `MEASUREMENT_ALLOWLIST[key].acceptedSourceUnits` **first**, report
`normalizedUnitAccepted` as its own field, and only then convert. Do not duplicate a literal-spelling
filter; use `normalizeUnit`.

Note also that `parseMeasurementValue` returns `null` for any value containing `< > ≤ ≥`, so censored
values are unconvertible by construction. That is correct behavior and must surface as a typed-bound
finding, not as a conversion failure.

## 10. Implementation cost of a per-side verdict — the mechanism gap

This is the correction that most changes the shape of the later work, and the preliminary notes miss
it.

`src/measurementAllowlist.ts` implements **`VITAL_SANITY_MAX_OVERRIDES` — a ceiling-only mechanism.**
`vitalEntries` constructs `sanity` as `{ min: def.range.min, max: maxOverride }`. There is **no floor
override at all.** Consequences the survey must state plainly:

- ratifying *any* floor — SpO₂, RR, or temperature's own unratified `30` — requires **extending the
  override mechanism**, not merely supplying a number;
- `scripts/tests/measurement-allowlist.ts` hardcodes the temperature branch deliberately, so that a
  second override **fails the non-temperature drift guard** until its own contract and regression land
  (per `r9-temperature-sanity-decoupling-codex-spec.md` §7.2). This is by design and correct;
- therefore "narrow only one side" is **asymmetric in cost**, and a mixed per-vital/per-side verdict is
  not free. The survey reports the mechanism cost per candidate side so the later ratification is
  priced honestly.

Note the design intent this preserves: authoring the *same numeric bound* under the sanity contract is
a legitimate outcome. It converts inheritance into authorship, which is exactly what the REVISIT
thread is about. It is still a data-contract change requiring the full path.

## 11. Seats

Stated by **role**. The named assignments are current as of 2026-07-17 and change without amending
the rule; do not read a model name here as part of the contract.

- **Generator:** mechanical, deterministic, with an independent null → may self-certify under
  `DECISIONS.md` principle 2 (narrowed 2026-07-14).
- **Manifest classification fields** — `inherited` vs. `independently_authored`, GATE 4
  classification, the §4 reconciliation verdict — are **contract interpretation**. Principle 2 keeps
  those under strict independent review. They go to the checker seat.
- **Producer≠checker binds whichever model actually produces the generator and manifest**, not a
  specific named model. That seat does not gate its own output.
- **Spec-conformance and content review stay split** (principle 2's 2026-07-09 extension). The
  architect seat authored this spec and so verifies conformance to it but cannot content-review the
  manifest; the checker seat re-derives the classification fields from live source and standing rules
  rather than from this document.
- The producing seat does not merge, does not push to `main`, and does not write `DECISIONS.md`.

**Current assignment (2026-07-17).** GPT-5.6 Sol is at capacity in the Codex harness, so **GPT-5.6
Terra is the implementing producer** — the producer prohibition above attaches to Terra, not to Sol.
Sol authored the preliminary notes and reviewed this spec; both are design-source roles, so Sol is
conflicted for the manifest content gate as well. Neither Sol nor Terra both produces and gates.
Terra is a different capability tier than Sol; per `DECISIONS.md` principle 2 that changes nothing
about the seat rule, and per the standing re-verify-on-the-merits rule it licenses no assumption
either way about Terra's output quality.

## 12. Probes and regressions

Boundary probes are **synthetic regressions, not survey rows.** They never enter the manifest's corpus
counts.

- Define `ε` explicitly, per vital, in canonical units. It is not currently defined anywhere and must
  not be left to the implementer's discretion.
- Probe at `min−ε`, `min`, `min+ε`, `max−ε`, `max`, `max+ε` against the **current** bounds. These pin
  present behavior; they are not candidate tests.
- **Temperature additionally probes in source units.** Affine conversion means a canonical boundary has
  no single source magnitude, and the mis-stage defect class lives entirely on the source side. A
  canonical-only probe set does not cover it.

## 13. Verification path

### 13.1 Manifest-drift gate

Register two commands, matching the survey/drift pair already established in `package.json`
(`survey:rationale-visual-floor` + `test:rationale-visual-floor`; `survey:promoted-visual-parity` +
`test:promoted-visual-parity-survey`):

```sh
npm run survey:vital-sanity-bounds
npm run test:vital-sanity-bounds
```

`test:vital-sanity-bounds` **regenerates the manifest and byte-compares it against the committed
artifact, failing on any drift.** It must also exercise the candidate-interval parameter (§9) even
though P3 supplies no candidates — an unexercised parameter is an unproven one, and stage 3 depends on
it working without a second generator being written.

Do **not** wire either command into `npm run test-visuals` or the Promotion Gate. Broader CI scope is
P5 policy and is unratified; PR #55 added the single authorized `test-visuals` step and nothing here
extends it.

### 13.2 Full path

Read-only survey plus new script and regressions:

```sh
npm run test:measurement-allowlist
npm run test:flowsheet-gate
npm run test:structured-measurements
npm run test-visuals
npm run validate-bank -- banks/*.json
npm run audit
npx tsc -b --pretty false
npm run census:check
npm run build
git diff --check
```

**Do not run `npm run census` as part of P3.** P3 changes no bank content, so there is nothing to
regenerate. `census:check` computes a fresh census in memory and compares it to the committed one; it
never needs the write. Running the generator only rewrites `census.json` and `BANK-CENSUS.md` with a
new `generatedAt` and `inputGitSha` and produces metadata-only churn in the diff.

The census requirement is **stable-payload identity, not literal file identity**: no counts,
distributions, per-file inventory, bank inventory, visual inventory, duplicate-ID findings, or
documentation-drift findings may change. `generatedAt` and `inputGitSha` are volatile metadata and are
excluded by `stripVolatile` before comparison. `npm run census:check` is authoritative **for
`census.json`** — note that `checkDrift` reads only that file and never compares `BANK-CENSUS.md`,
whose freshness rests on the "do not hand-edit" convention rather than on a gate.

The PR body records: the §4 reconciliation verdict against the 2026-07-11 sweep; the manifest path;
the observed bank file list and count (§7.1); the §10 mechanism-gap statement; confirmation that no
bank content, no bound, and no renderer changed; and that `census:check` passes with `census.json` and
`BANK-CENSUS.md` untouched.

## 14. Exit condition

- Manifest committed as deterministic evidence, covering all seven vitals.
- The four concepts are separated per vital, per side.
- The §4 prior findings are carried and the 2026-07-11 sweep is explicitly superseded or extended.
- The §7.2 prose limitation is stated in the artifact.
- The §10 mechanism gap is stated per candidate side.
- `npm run test:vital-sanity-bounds` fails on seeded manifest drift and passes on the committed
  artifact.
- **Zero bound changes.**
- A **mixed verdict is an acceptable and expected outcome** — e.g. "SBP ceiling ready for sourcing;
  SpO₂ floor requires device/reporting-limit evidence; HR remains provisional." Do not manufacture one
  coordinated seven-vital answer. P3 does not require any bound to change in order to succeed.

## 15. Sequence after this survey merges

1. **P3 survey PR** — generator, committed manifest, boundary regressions, zero bound changes. *(This spec.)*
2. **Architect adjudication** — which vital sides have enough evidence to proceed.
3. **Clinical sourcing pass** — candidate tripwires supported by extreme-value / reporting-limit /
   device-limit evidence. **Not** ordinary normal-range tables. Reporting limit and critical threshold
   enter here (§5.1). Route to producer≠checker review.
4. **Luke ratification** — per vital, per side.
5. **Implementation PR** — only ratified overrides, any required floor-mechanism extension, a fresh
   corpus-flip survey, and the full schema/data-contract verification path.

Do not author the bounds from model memory at any stage.

## 16. Adjudication record — GPT-5.6 Sol's preliminary notes

Accepted as the basis for this spec. All factual claims independently re-derived against live disk
(2026-07-17) and confirmed: the seven-row range table, the six exact aliases, temperature's decoupled
ceiling, adult-only reference bands with enforcement, the MAP bounds/recompute pair, the
`toCanonicalMeasurementValue` temperature laundering path, and the structured-measurement
string/unit/typed-bound shape.

Five corrections, incorporated above:

| # | Correction | Where |
|---|---|---|
| C1 | "Seven, not six" is already ratified in `DECISIONS.md` §7, not a new proposal; the handoff's header is the stale phrasing | §2 |
| C2 | The evidence base is not empty — §8's three counterexamples and §7's 2026-07-11 sweep must be carried and reconciled | §4 |
| C3 | The override mechanism is ceiling-only; any floor ratification extends the mechanism, and the drift guard fails a second override by design | §10 |
| C4 | Reporting limit and critical threshold are relocated to stage-3 sourcing, not dropped | §5.1 |
| C5 | Prose exclusion is accepted but requires an explicit stated limitation in the artifact | §7.2 |

Minor, also incorporated: `ε` defined per vital and temperature probed in source units (§12); probes
are regressions, not survey rows (§12); absent staging directories reuse the P0 empty-population
handling (§7.1); seat split between generator and manifest classification (§11).

Nothing in the preliminary notes was rejected.

## 17. Ratification pass — 2026-07-17

GPT-5.6 Sol reviewed this spec and returned three clarifications and two cleanup notes, all folded in
before Luke's ratification. Each disk-dependent claim was independently re-derived rather than
accepted on its face:

| Sol's note | Verification | Disposition |
|---|---|---|
| Split spec status from bound status | n/a — drafting | Accepted — header |
| Define "at or near each current boundary" | n/a — drafting | Accepted — §9, with censored/typed-bound records excluded from the ranking since they have no canonical value |
| Record declared *and* effective population | **Verified.** `renderVitalsTrendSvg` applies `population === undefined ? "adult"` explicitly; `validateVitalsTrend`'s band restriction fires only when population is present and non-adult. For structured measurements, checked for an executable default rather than assuming one: `StructuredMeasurements.population?` is optional and neither `formatStructuredMeasurementValue` nor `renderStructuredMeasurementsSvg` reads it. No default exists. | Accepted — §9 |
| Name an explicit manifest-drift gate; "P0 already uses exactly that pattern" | **Verified** against `package.json`: `survey:rationale-visual-floor` + `test:rationale-visual-floor`, and `survey:promoted-visual-parity` + `test:promoted-visual-parity-survey`. The pattern is real. | Accepted — §13.1, with the added fence that neither command enters `test-visuals` or the Promotion Gate (P5 policy, unratified) |
| Do not structurally hardcode 13 banks | Consistent with `PROJECT-HISTORY.md`'s rule that per-file counts are generated, not hand-maintained | Accepted — §7.1 |
| Producer prohibition attaches to the actual producer, not a named model | n/a — drafting | Accepted — §11 rewritten role-first |

**PR-body premise — corrected 2026-07-17.** An earlier draft of this section recorded Sol's reference
to a PR body as an unverified premise, reasoning that no PR was visible on disk. **That framing was
wrong and is withdrawn.** `CLAUDE.md` already documents that the GPT chat instances read the **repo**,
not the disk; Luke pushed this spec, so Sol was reading a real PR through its documented access path.
Disk absence was never evidence of anything about a GitHub artifact, and the architect seat had read
that rule in the same session. The error was the architect seat's, not a defect in Sol's review. The
specific "implementer-reviewed" wording remains unverified *by this seat* only because no GitHub
connector was reachable to it — a limitation of the seat, not a finding about the artifact.

**Implementer review.** GPT-5.6 Terra reviewed this spec before ratification and returned no notes.
That discharges the implementer-feasibility check: the producing seat has read the spec and can
implement it as written. It is **not** a spec-correctness certification and moves nothing in §11 — a
review by the seat that will adopt the spec has no independent null to fail against, so the manifest
classification gate stays with the checker seat regardless.

The zero-note review also did not hold up: Terra found a genuine spec defect during implementation
(§18). Recorded as evidence that a null spec review buys less than it appears to.

## 18. Amendment — census verification defect, 2026-07-17

Raised by GPT-5.6 Terra during implementation, analyzed by GPT-5.6 Sol, adjudicated here against live
`scripts/census.ts`. **The defect was the architect seat's, not the implementation's.**

**What was wrong.** §13.2 required `npm run census && npm run census:check` and then asserted "census
should remain byte-identical." Those cannot both hold. `computeCensus` stamps
`generatedAt: new Date().toISOString()` and `inputGitSha: getGitSha()` on every run, so the generator
cannot produce a byte-identical file. The deeper error was requiring the regeneration **write** at
all: P3 changes no bank content, so there is nothing to regenerate, and the spec ordered a rewrite and
then demanded byte-identity of the rewritten file.

**What the executable contract actually is.** `stripVolatile` destructures out exactly `generatedAt`
and `inputGitSha`; `checkDrift` compares the stripped committed payload against a stripped fresh one.
The contract is stable-payload identity. §13.2 now says so, and drops the `census` write.

**Disposition of the implementation.** Terra's report is accepted. The refreshed `census.json` and
`BANK-CENSUS.md` are metadata-only churn and are to be **reverted from the diff**; `census:check` still
passes with them untouched, because it ignores exactly the two fields that changed. Sol's observation
that `inputGitSha` is weak provenance is correct — committing a regenerated census immediately
invalidates the SHA it recorded, which is why the tool ignores it.

**Two findings neither reviewer raised** (the second is corrected below — it did not survive contact
with the artifact):

1. `checkDrift` reads **only `census.json`**. `BANK-CENSUS.md` is never drift-checked, though
   `renderCensus` stamps `Generated:` and `Input Git SHA:` into it. "`census:check` is authoritative"
   is true for `census.json` only; the md file's freshness rests on its "do not hand-edit" header
   convention, not on a gate. Reverting it is safe here because nothing substantive changed. **Flagged
   to the checker seat as a standing observation; not P3's to fix.**
2. **The reported null is partly structural and must not be pooled.** The two collectors answer to
   *different* contracts: GATE 4's `sanity` governs structured-measurement rows, while `vitals_trend`
   series are governed by the renderer envelope. For the six aliased vitals, a `vitals_trend` value
   outside `VITAL_DEFS.range` could never have been authored — `validateVitalsTrend` would have
   rejected it at authoring time. A zero result on that surface is **structurally guaranteed, not
   evidential.** It is informative only for structured-measurement rows (which bypass the renderer
   validator) and for `temp` (decoupled).

   **Correction, same day — this finding was raised against the wrong artifact.** It was written from
   the producer's *chat summary*, which reported "1,317 governed vital records; zero unit/conversion
   failures, GATE 4 warnings, or MAP violations" as one pooled figure. The committed manifest does not
   pool: `counts.bySurface` splits 766 structured-measurement rows from 551 `vitals_trend` values, and
   the `PROJECT-HISTORY.md` entry states in terms that the structured rows are the live GATE 4
   population while the `vitals_trend` clean validation and MAP null are "structural, not evidence
   that the `sanity` tripwires are clinically suitable." The artifact was already correct. The
   architect seat made a finding about a manifest it had not read, on the strength of a producer's
   summary — the same error class this spec exists to prevent. Recorded rather than deleted, because
   the pattern is the point: **a producer's prose summary is not the artifact, and neither is a
   reviewer's reading of that summary.** The checker item below stands as a verification obligation,
   not as an allegation.

**The survey result remains non-dispositive**, as §4 and §14 already require. A clean corpus under the
current contracts does not establish that the current bounds are clinically suitable — the §4
counterexamples (SBP ~370, RR at `80` with no margin, displayable SpO₂ below 50) bear on values the
live corpus may simply not contain. Zero warnings is consistent with bounds that are too wide, and the
REVISIT thread does not close on this evidence.

**Checker-seat scope (narrow).** The mechanical outputs are covered by the deterministic generator and
the drift regression; the checker does not recount records. Re-derive only:

1. `inherited` vs. `independently_authored`, per vital and per side;
2. the GATE 4 contract classification;
3. the §4 provenance contract: `sweep20260711.located === true`, the exact historical
   `a67476cee75e365dd72c22a589d8e76c6e3ddc6d:DECISIONS.md` record, current constitutional summary,
   and separate r9 re-derivation are cited without conflation, and the prior record is correctly
   reconciled as *extended* under §4's narrowed definition;
4. the mechanism-cost statements for candidate floors and ceilings (§10);
5. that the manifest does not convert zero corpus warnings into a suitability verdict;
6. that the manifest does not pool the two surfaces' nulls, per finding 2 above — the structurally
   guaranteed result and the evidential one must be reported separately.

The architect seat performs spec-conformance review only and is not the manifest-classification
checker, having authored the spec (§11).

## 19. Amendment — checker item 3 provenance defect, 2026-07-17

Raised by the independent checker seat during review of PR #57. The checker correctly established
that the **cited current files** did not support the generated attribution, but its seat was
filesystem-only and did not search Git history. The first folded amendment overreached in the
opposite direction by converting that bounded finding into `located: false`. The producing seat then
performed the missing history search before any regression could byte-lock the negative.

**History search performed at branch head `2e358c7`.** The exact commands were:

```sh
git log --all --full-history -S '36.7' --format='%H %ad %s' --date=iso-strict --name-only
git log --all --full-history -S '10-50' --format='%H %ad %s' --date=iso-strict --name-only
git log --all --full-history -S '10–50' --format='%H %ad %s' --date=iso-strict --name-only
git log --all --full-history -G '30[-–]43.*probe|probe.*30[-–]43' --format='%H %ad %s' --date=iso-strict --name-only
git log --all --full-history -G 'temperature-only flip probes|exploratory.*10[-–]50|10[-–]50.*probe' --format='%H %ad %s' --date=iso-strict --name-only
```

The searches locate the contemporaneous record at
`a67476cee75e365dd72c22a589d8e76c6e3ddc6d:DECISIONS.md`, an ancestor of `main`. Its vital-sanity
entry explicitly records the per-`VITAL_DEFS` report-only survey, the `30–43 °C` validator and
exploratory `10–50 °C` probes, zero flips, promoted canonical temperature `36.7–40.11 °C`, and
refreshed extraction artifacts `35.8–40.11 °C`. The search also confirms that the phrase
"temperature-only flip probes" first appears in the P3 implementation, not in the historical record.

**Revised finding.** The manifest's `located: true` and its probe/span substance survive the required
history search. Its source attribution does not: the current
`Archive/DECISIONS-ARCHIVE-2026-07-14.md` contains no supporting temperature record, while the exact
Git commit that does support the statements is omitted. The current `adds[0]` also overstates the
historical source by calling it "temperature-only flip probes." Checker item 3 therefore remains a
valid hold, narrowed to source attribution and reconciliation wording rather than the underlying
survey figures. This is a reporting-contract defect, not a defect in the survey population or count.

`EXTENDS` now means that P3 extends the limited survey/sweep scope recorded in the exact Git-backed
July 11 entry. It does **not** mean that any probe, historical span, population, or conclusion beyond
that cited text was verified.

**Required repair — these files move together in one commit:**

1. `scripts/vital-sanity-bounds-survey.ts`
   - remove the unsupported archive citation;
   - cite the exact historical commit and keep the current constitutional summary and July 15 r9
     re-derivation distinct;
   - retain `located: true` and only the probe/span claims directly supported by the historical text;
   - replace `adds[0]` with `"all seven vital keys, deterministically enumerated"`;
   - emit the corrected `sources`, `priorResult`, `adds`, and `EXTENDS` meaning in §4.
2. `audit/vital-sanity-bounds-survey-2026-07-17/survey-manifest.json`
   - regenerate it from the corrected generator; do not hand-edit the byte-locked artifact.
3. `PROJECT-HISTORY.md`
   - replace the claim that the prior sweep "was located in the archived decisions record";
   - cite the exact Git-backed July 11 record, retain `EXTENDS` under the narrowed definition above,
     and identify the current constitutional summary and July 15 r9 re-derivation separately.
4. `scripts/tests/vital-sanity-bounds.ts`
   - retain the `EXTENDS` assertion;
   - assert `sweep20260711.located === true` and that its sources include the exact historical commit;
   - reject the unsupported archived-decisions attribution and the phrase
     `"temperature-only flip probes"`;
   - assert the corrected first addition string so reconciliation wording cannot drift back.

Do not modify `DECISIONS.md` merely to simplify the generator's citation. Current §7 is deliberately
compact; Git history owns the detailed contemporaneous record. The PR body and generated manifest
must record the history-search commands and the exact commit they located. No vital-sign bound, bank,
renderer, measurement-unit-policy, GATE 4 policy, or population contract is authorized to change.

**Verification and routing.** After the repair, regenerate the manifest, run
`npm run test:vital-sanity-bounds`, run the complete §13.2 validation path, and run
`git diff --check`. The same independent checker seat then performs a narrow recheck of checker item
3 against the corrected generator, manifest, history entry, regression, and cited sources. The other
five checker items remain accepted unless the repair changes their semantics. PR #57 remains on hold;
this amendment authorizes no merge.
