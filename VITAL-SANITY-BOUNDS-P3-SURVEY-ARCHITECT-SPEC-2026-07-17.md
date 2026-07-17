# Vital-Sign Sanity Bounds — P3 Deterministic Survey — Architect Spec

Date: 2026-07-17
Author: Claude (architect seat)
Preliminary notes: GPT-5.6 Sol (accepted with five corrections, see §16)
Implementer: Codex
Survey-manifest content gate: checker seat (not the producer of the generator; see §11)
Ratification: not applicable — **this spec ratifies no bound and authorizes no bound change.**

Status: **draft — pending implementer review.** Luke has approved authoring this spec to disk and
wants the implementer's read before anything proceeds.

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
manifest as **prior findings**, verbatim-cited, before any new row is generated:

1. **`DECISIONS.md` §8, the withdrawal entry.** The claim "vitals `sanity` passes every real
   transcribed value" was withdrawn as unprovable of a copied renderer envelope, and *contradicted by
   evidence*: documented SBP to ~370, RR at the `80` ceiling with no margin, displayable SpO₂ below
   50. Those three counterexamples are the reason this thread exists. They are prior findings, not
   rediscoveries.
2. **`DECISIONS.md` §7's completed sweep.** "Survey and pre-move sweep are complete (2026-07-11: zero
   flips in the promoted corpus under either tested probe)."

**Blocking requirement:** the survey PR must locate the 2026-07-11 artifact and state, explicitly, one
of: *supersedes* (and why — corpus moved, probes differ, population wider), or *extends* (and what it
adds). A silent re-survey that neither cites nor reconciles it is a rejected PR. If the artifact
cannot be located on disk or in Git history, say so in the manifest as an explicit finding; do not
paper over it.

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
- all 13 canonical `banks/*.json`;
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
- counts by surface, population, bank, and location;
- exact live min and max (canonical units);
- sorted records at or near each current boundary;
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

- **Generator:** mechanical, deterministic, with an independent null → may self-certify under
  `DECISIONS.md` principle 2 (narrowed 2026-07-14).
- **Manifest classification fields** — `inherited` vs. `independently_authored`, GATE 4
  classification, the §4 reconciliation verdict — are **contract interpretation**. Principle 2 keeps
  those under strict independent review. They go to the checker seat.
- **Producer≠checker:** GPT-5.6 Sol authored the preliminary notes this spec adjudicates. Sol may
  produce the generator. Sol does **not** gate the manifest.
- Codex does not merge, does not push to `main`, and does not write `DECISIONS.md`.

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

Read-only survey plus new script and regressions:

```sh
npm run test:measurement-allowlist
npm run test:flowsheet-gate
npm run test:structured-measurements
npm run test-visuals
npm run validate-bank -- banks/*.json
npm run audit
npx tsc -b --pretty false
npm run census && npm run census:check
npm run build
git diff --check
```

The PR body records: the §4 reconciliation verdict against the 2026-07-11 sweep; the manifest path;
the §10 mechanism-gap statement; confirmation that no bank content, no bound, and no renderer changed.
Census should remain byte-identical.

## 14. Exit condition

- Manifest committed as deterministic evidence, covering all seven vitals.
- The four concepts are separated per vital, per side.
- The §4 prior findings are carried and the 2026-07-11 sweep is explicitly superseded or extended.
- The §7.2 prose limitation is stated in the artifact.
- The §10 mechanism gap is stated per candidate side.
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
