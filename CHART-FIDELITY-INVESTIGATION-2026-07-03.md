# Chart-Fidelity Investigation — Vitals/Labs Presentation

Date: 2026-07-03
Scope: measurement and feasibility only. No schema, bank, grading, storage, renderer, or UI
changes were made. This note quantifies how much vitals/labs data currently lives as prose in
case-study exhibits, to ground a propose-or-defer decision on a flowsheet-style presentation
layer. Read alongside `SPLIT-SCREEN-LAYOUT-INVESTIGATION-2026-06-28.md`.

## Luke's steer (2026-07-03, pre-litigation)

Direction given before detailed litigation: **where the fact-pattern details fit cleanly in a
chart within the space on the page, presenting labs/vitals as a cleaner, more consistent chart is
an improvement worth making.** This points at Option A (structured-exhibit presentation), gated on
a *fits-cleanly* test rather than applied blanket — i.e. render a flowsheet only when the exhibit's
measurement data is cleanly separable, and leave genuinely prose-woven exhibits as prose. The
options section below is preserved as the decision surface; the details are to be litigated next
turn. The load-bearing open question this steer creates: **what is the deterministic `fits-cleanly`
predicate**, given that only ~9% of panels are `clean_kv` today (see Finding 2).

## Motivating question

Luke wants the vitals / other clinical presentation to read closer to what a nurse sees logging
into Epic. Epic's dominant idiom is the **tabular flowsheet** (time-stamped columns, one row per
parameter, H/L flags, reference ranges) — the trend graph is a secondary drill-in view. Shrimp
today renders vitals/labs only as line charts (`vitals_trend`, `lab_trend`), and those are
correctly reserved for items whose answer turns on reading a trajectory (Principle 6, load-bearing).
The far more common case — vitals/labs as **context** inside a case study — lives as free text in
`caseStudy.exhibits[].content`. The schema explicitly allows this: *"Use concise chart-like
content; newline-separated vitals/labs are allowed."* The question is whether a flowsheet-grid
presentation of that exhibit data is worth building, and if so, in what form.

## Method

Scanned all four case-bearing canonical banks on disk (`hard-cases`, `claude`, `gpt`, `gemini`)
via the `MCP:` connector. Walked every `case_study` top-level exhibit **and** stage exhibit,
classifying `content.en` for vitals/labs presence and, for the panels found, for transform
difficulty. Counts below are from live disk at Git SHA `8a6aabb` (census 2026-07-03: 143 case
studies, 721 embedded parts).

A **convertible panel** is defined conservatively: an exhibit whose content carries ≥3 distinct
labeled vital signs (BP/HR/RR/SpO2/Temp/MAP) **or** ≥3 distinct labeled analytes, each with
numeric value + units. This excludes incidental single-value mentions and drug-dose paragraphs
that merely contain `mg`.

## Findings

### 1. There is a large vitals/labs footprint in case-study prose

| Metric | Count |
|---|---:|
| Case studies scanned | 143 |
| Total case-study exhibits (incl. stage exhibits) | 512 |
| Exhibits that are a convertible vitals **or** lab panel | 242 |
| — vitals panels (≥3 distinct vitals + units) | 194 |
| — lab panels (≥3 distinct analytes + units) | 139 |
| — exhibits that are both | 88 |
| Case studies with ≥1 convertible panel | 82 of 143 |

Per bank (union of convertible panels): gpt 106, hard-cases 93, claude 35, gemini 8.

So the demand is real: **57% of case studies** carry at least one exhibit that is, in substance, a
vitals or lab panel currently presented as text. This is not a fringe concern.

### 2. But only ~9% of those panels are cleanly convertible today

Splitting the 242 convertible panels by transform difficulty:

| Shape | Count | Transform |
|---|---:|---|
| `clean_kv` — newline `Label: value` block | 20 | Lossless, deterministic |
| `compact_clause` — short dedicated "Vital signs: …" clause, <45 words | 2 | Clean extract |
| `prose_embedded` — panel clause buried in a longer narrative paragraph | 105 | Requires prose parsing |
| `scattered` — measurements strewn through prose, no delimited clause | 115 | Requires prose parsing |

Only **22 of 242 (9%)** panels sit in a form a deterministic transform can lift into a grid without
parsing natural language. The other **220 (91%)** weld the vitals/labs into narrative that also
carries diagnosis, allergies, line/access status, skin findings, neuro status, orders, and clinical
course. This is the number Luke's `fits-cleanly` steer has to contend with: a blanket flowsheet is
not on the table, because 91% of exhibits do not currently fit cleanly.

Representative `clean_kv` (lossless): `cs_ckd_01/labs_pre`
```
BUN: 82 mg/dL
Creatinine: 7.4 mg/dL
Potassium: 6.2 mEq/L
Calcium: 8.1 mg/dL
Phosphorus: 5.8 mg/dL
Hgb: 9.1 g/dL
```

Representative `prose_embedded` (not lossless): `case_sepsis_pneumonia_01/triage`
```
Reports 3 days of productive cough and fever. Daughter states the client is usually oriented
but is now confused.
Vital signs: T 39.2 C, HR 118/min, RR 30/min, BP 92/54 mm Hg, SpO2 90% on room air.
Skin cool and mottled at knees. Capillary refill 5 seconds.
```
Here the vitals line is grid-able, but the surrounding sentences are clinically load-bearing prose
that must remain. A flowsheet transform would have to split one exhibit into (narrative prose) +
(extracted grid), which is prose surgery, not a mechanical lift.

### 3. Chart-convention markers are largely absent from the prose

Across the 339 vitals/labs-bearing exhibits (looser detector), reference ranges appear in only
~14% and explicit H/L flags in ~9%. The prose was written as narrative, so the two features that
most make a display "read like Epic" — the reference-range column and the abnormal flag — are not
present in the source data and would have to be **derived**, not extracted.

For labs this is tractable: the `lab_trend` analyte registry already holds per-analyte,
per-population reference bands and a tested H/L recompute in `selfCheck`. For vitals the
`vitals_trend` registry holds normal bands too. So a renderer *could* compute flags/ranges — but
note the standing caveat below.

## Constraints that bear on the decision

- **`lab_trend` reference ranges are still PLACEHOLDER in-code.** The file header on
  `src/visuals/kinds/lab_trend/index.ts` states every numeric band is a placeholder pending
  source-verification against authoritative references. Any feature that *renders reference ranges
  or derives H/L flags from that registry* inherits an unverified clinical contract and would make
  those placeholder numbers learner-visible. Source-verification of the analyte bands is a
  prerequisite for any range/flag-rendering flowsheet, and is itself a content-review lane. A
  presentation that only reformats author-supplied values into rows (no derived flags/ranges)
  sidesteps this; a presentation that adds the Epic-style flag/range columns does not.
- **Canonical banks are deterministic-path-only.** Principle: canonical mutations go through
  deterministic paths, never hand-edits or model prose-surgery. Converting the 220 prose-embedded
  panels into structured panels would be a regeneration/authoring pass on reviewed content — a
  large content lane, not a renderer.
- **Endgame observation gate.** Per the 2026-07-02 rescope, the observation gate stays in force for
  net-new features and direction calls, and is lifted only for census-obvious format/topic debt.
  A flowsheet presentation layer is a net-new feature. Luke's steer this session is a direction
  call that partially resolves the gate for this specific feature, but the *fits-cleanly* predicate
  and the schema/rendering contract still need litigation before implementation.

## Options (decision surface; Luke's steer leans toward A, gated on fits-cleanly)

**A. Structured-exhibit presentation layer (new schema surface).** Add an optional structured
`vitals` / `labs` block to the exhibit shape (key → {value, unit}), rendered via the existing
`renderDocTable` primitive as a flowsheet with optional derived range/flag columns. New authored
content populates it; the 20 `clean_kv` legacy panels can be migrated deterministically; the
prose-embedded majority stays prose until regenerated. Highest fidelity. It is a schema bump +
renderer + content lane; the derived range/flag columns depend on the `lab_trend` band
source-verification landing first, but a values-only flowsheet does not. **This is the direction
Luke's steer points at, applied only where content fits cleanly.**

**B. Deterministic flowsheet renderer over `clean_kv` only.** A parser that lifts *only* the
newline `Label: value` blocks (22 panels) into a grid, leaving everything else untouched. Small,
safe, mechanical — but addresses <10% of the footprint and delivers little visible change. Could be
the first increment of A rather than a standalone endpoint.

**C. Exhibit-presentation CSS/layout only (no data change).** Render exhibit `content` in a
monospace, chart-styled panel (the way `device_screen` reads) without restructuring the data.
Cheap, gives a "chart surface" feel, but does not produce true rows/columns/flags.

**D. Defer.** Log the finding; revisit after real-session observation. Consistent with the
observation-gate doctrine. (Superseded in part by Luke's 2026-07-03 steer, retained for the record.)

## Open questions to litigate next turn

1. **The `fits-cleanly` predicate.** Is it structural (author supplies a structured block, so the
   renderer never parses prose) or is it a detector over existing prose? The deterministic-core
   principle strongly favors the former — new content authors a `vitals`/`labs` structured field;
   the renderer only ever formats already-structured data and never natural-language-parses a
   canonical string.
2. **Values-only vs. derived flag/range columns.** Values-only ships without the `lab_trend` band
   verification; adding Epic-style H/L flags and range columns makes that verification a hard
   dependency. Which is the target?
3. **Schema shape and version.** A structured exhibit block is additive but is a schema bump
   (1.7 → 1.8) with a migration note; needs the "add a kind / add a field" checklist treatment.
4. **Scope of legacy migration.** Deterministically migrate only the 20 `clean_kv` panels, or open
   a regeneration lane for the prose-embedded majority? The latter is a large content pass and
   collides with the frozen-debt framing on distributional backlog.
5. **Split-layout interaction.** How a structured exhibit flowsheet renders inside the exam
   split-screen chart pane (per `DECISIONS.md` principle 23 geometry allowlist).

## What this investigation deliberately did not do

No schema change, no renderer, no bank edit, no new visual kind registration, no spec authored.
The `clean_kv` migration list (22 exhibit ids) and the per-bank panel inventory are in the analysis
harness output and can be surfaced when an option is chosen.

## Verification

- Read-only scan of live canonical banks via `MCP:` connector; no writes to any `banks/*.json`.
- Counts reconcile to the committed census (143 case studies, 721 embedded parts).
