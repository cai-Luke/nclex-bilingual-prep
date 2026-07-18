# P4 Single-Row Laboratory Presentation Survey

Status: **mechanical inventory complete; independent semantic adjudication pending**.

This is a report-only architecture packet. It authorizes no schema floor, renderer change, bank edit,
reference-band change, or runtime change. The deterministic source of detailed evidence is
[`audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json`](audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json).

## Two independent surfaces

- `lab_trend`: a candidate has exactly one `series` entry. The current validator deliberately permits
  one or two series and requires at least three timepoints. One analyte is not one observation.
- `structured_labs_panel`: a candidate is one individual `structuredMeasurements.panels[]` entry with
  `kind: "labs"` and exactly one row. Panels, not exhibits, are counted. The current schema requires
  nonempty rows and does not impose a two-row minimum.

The generator reuses `collectVisualRefs` for the six full-schema visual locations and the established
top-level/staged exhibit paths for structured measurements. It scans canonical, raw, and promoted
lanes separately. Missing optional staging directories are an empty population; other filesystem or
bank-validation failures are errors.

## Mechanical result

The canonical corpus contains 24 candidates across five banks:

- 11 of 20 `lab_trend` visuals have one series; the other nine have two series.
- 13 of 126 structured labs panels have one row; the other 113 have multiple rows.
- The 13 structured candidates comprise five top-level case exhibits and eight staged exhibits.
- Raw and promoted staging contain no P4 candidate in this isolated P4 branch. The manifest records
  every discovered file path and count. An absent optional lane serializes like a present lane with no
  JSON files; a noncandidate P4 surface still changes the lane's observation counts.
- All 24 candidates pass their current validation surface. All 11 candidate question visuals pass the
  applicable answer-coupled `lab_trend` self-check. The 13 structured panels correctly report
  `NOT_APPLICABLE_BY_CURRENT_CONTRACT` because structured panels have no renderer `selfCheck`.
- Absent structured-measurement population remains `unspecified` for both declared and effective
  population; no executable adult default is inferred. A missing bank schema declaration is `null`,
  never invented as schema `1.0`.

The manifest includes each candidate's exact path, schema version, population, values, label, unit,
metadata paths, stem, item-specific answer material and key, surrounding case/stage/exhibit prose,
and rationale passages. For case-level panels it carries every embedded tested decision rather than
mistaking the parent case stem for the answerable item.

## Policy calculations

The producer may calculate only the mechanical policies before independent review:

| Policy | Current result |
|---|---|
| L1 — preserve one or two series | 0 newly failing records |
| L2 — require two series universally | 11 newly failing records |
| L3 — conditional one-series exception | Pending independent load-bearing and exact-duplication classifications |
| S1 — preserve nonempty rows | 0 newly failing panels |
| S2 — require two rows universally | 13 newly failing panels |
| S3 — conditional one-row exception | Pending independent load-bearing and exact-duplication classifications |
| S4 — floor for a named context class | Pending candidate review and an architecture-seat definition of that class |

L2 and S2 have no metadata-only repair. Whether either would force clinically unnecessary filler, or
whether removing a surface preserves answerability, remains a semantic review question. L3 and S3
become deterministic after the checker fills the classifications. S4 additionally requires an
architecture ruling; the producer has inventoried context dimensions but has not named a class.

Every policy also reports subsystem-specific consequences. Preserving either contract changes
nothing. A universal floor changes validation policy but does not inherently require a renderer
change: both current renderers already support the larger shape. Export-envelope effects occur only
if an architecture ruling introduces a new feature floor. `lab_trend` snapshot hashes change only
when payload or renderer bytes change; structured panels are not registered `QuestionVisual`
artifacts in the current promoted-visual baseline and therefore have no current visual-parity effect.

## Independent review instructions

For every manifest record, a producer-independent checker must classify:

1. whether the presentation is load-bearing;
2. whether intact prose exactly duplicates every value, unit, time relationship, and clinically
   relevant trend;
3. whether prose only partially duplicates isolated values;
4. whether a clinically meaningful second analyte or row belongs, rather than filler added for a floor;
5. whether the best fit is a one-analyte trend, one-row structured panel, ordinary prose, or another
   existing surface.

The first-pass manifest deliberately leaves these fields null. A reviewer may use the supplied
location, column, stage, exhibit, analyte, and prose facts, but must not invent the named S4 class.

## Alternatives for Luke

- Preserve each current surface contract (L1 and S1).
- Adopt a universal floor for only one surface (L2 or S2), accepting the exact listed migration scope.
- Adopt a semantic exception for only one surface (L3 or S3) after independent adjudication.
- For structured panels only, define a narrow evidence-supported context class and calculate S4 in a
  deterministic second pass.
- Make no floor change if the review shows that single-analyte trends and single-row panels are valid
  surface-specific uses.

No universal rule is recommended before the independent classifications. Similar laboratory subject
matter is not evidence that the visual and structured-panel contracts should be collapsed.

## Commands

```sh
npm run survey:single-row-lab-panels
npm run test:single-row-lab-panels
```

The regression pins the current one-or-two-series `lab_trend` contract directly, all six visual
locations, panel-level counting, self-check applicability, optional-directory behavior, byte-identical
regeneration, structured population semantics, undeclared schema handling, and real temporary-bank
candidate addition/removal drift across records, summaries, observations, and policy impacts.
