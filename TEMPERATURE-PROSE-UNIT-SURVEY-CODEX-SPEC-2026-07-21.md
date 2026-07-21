# Codex Work Order — Learner-Facing Temperature Prose Unit Survey

Date: 2026-07-21
Owner: Codex implementation seat
Status: **QUEUED — DO NOT START until Luke returns after the producer-vocabulary cleanup is finished**
Mode: deterministic read-only corpus survey → safe mechanical subset → bounded residual report
Mutation authority: **none**

## 1. Purpose

Measure every learner-facing temperature expression in the bundled canonical question banks under the already-made product decision that authored prose should present temperatures in US-conventional Fahrenheit first with Celsius in parentheses.

This task is the temperature analogue of the earlier WBC/platelet prose-unit inventory:

- find the full structural population rather than trust grep;
- distinguish already-canonical displays from safe mechanical normalization candidates;
- distinguish absolute temperatures from temperature changes/deltas;
- preserve bilingual pairing and source precision;
- return a closed, reproducible migration input;
- make **no canonical bank changes** in this pass.

The product is already usable. This is a maintenance survey, not a release blocker, architecture investigation, or reason to parallelize with the current vocabulary repair.

## 2. Start condition and sequencing

Do not begin this task while another agent is still implementing or reviewing:

- `PRODUCER-VOCABULARY-LEAKAGE-REMEDIATION-CODEX-SPEC-2026-07-21.md`;
- its canonical patch;
- its independent content review;
- or any follow-up fixes from that review.

Luke will explicitly return and start this work after that task is complete enough to provide a stable live-bank snapshot.

At start:

1. record branch, HEAD, upstream state, staged paths, unstaged paths, and untracked paths;
2. confirm no other agent is actively writing the bank or audit files this survey will read;
3. preserve every unrelated change;
4. treat the live canonical banks at that moment as the survey population.

A dirty worktree is not itself a blocker for this read-only survey. Active concurrent writes are. If canonical banks are modified but stable and Luke has explicitly started the survey, record the exact snapshot and continue without mutating them.

## 3. Governing decision and live authority

The decision is not open in this task:

> In learner-facing prose, present absolute temperatures in US-conventional Fahrenheit first with Celsius in parentheses, preserving the authored source precision.

Read current disk before implementing:

1. `AGENTS.md`
2. `docs/AGENTS-RUNBOOK.md`
3. `DECISIONS.md`
4. `PROJECT-HISTORY.md`
5. `NCLEX-Question-Schema.md`
6. `src/measurementUnitPolicy.ts`
7. `src/structuredMeasurements.ts`
8. `scripts/tests/structured-measurements.ts`
9. `lib/question-population.ts`
10. `CODEX-WBC-PLATELET-PROSE-UNIT-REMEDIATION-HANDOFF-2026-07-20.md` for inventory/disposition precedent only
11. the completed producer-vocabulary remediation report and exact diff, especially `gpt_format8c_ici_colitis_escalation`

Live executable policy wins over prose restatements. At the expected starting snapshot:

- `MEASUREMENT_DISPLAY_POLICIES.temp.primaryUnit` is `°F`;
- `secondaryUnit` is `°C`;
- structured measurements render Fahrenheit first and Celsius in parentheses;
- `toMeasurementDisplayValue` owns absolute °F↔°C conversion.

If that executable policy has changed, stop with `BLOCKED_POLICY_DRIFT`. Do not invent a replacement policy.

If the prospective prose rule has not yet landed in `AGENTS.md`, record `POLICY_DOC_DRIFT` but continue the read-only survey: Luke’s 2026-07-21 commission above is sufficient authority to measure the corpus. Do not edit governance in this task.

## 4. Hard scope boundary

### In scope

Every learner-visible string in every bundled top-level `banks/*.json` file, including:

- standalone and embedded question stems;
- highlight passages and segments;
- answer options;
- matrix rows and columns;
- bowtie choices;
- cloze text and dropdown labels;
- ordered-response options;
- case-study titles;
- case exhibits and staged-exhibit `title` and `content` prose;
- `rationale.correct`;
- every per-choice rationale;
- `testTakingStrategy`;
- displayed glossary and teaching text;
- other validated bilingual prose fields that the learner can see.

Survey all physical temperatures represented in learner-facing prose, not only body temperature. Patient, environmental, storage, bath, device-setting, incubator, and similar absolute temperatures use the same unit-presentation decision. Preserve context in the manifest so later review can separate them if needed.

### Excluded from the prose survey

Exclude structurally, not by incidental token matching:

- bank/question `meta`, including `meta.source` and URLs;
- IDs, ref IDs, answer-key IDs, schema tokens, category/topic/difficulty/item-type values;
- `_compileManifest`, audit, provenance, source, and review-note branches;
- `structuredMeasurements` values and units;
- `question.visual`, `rationale.visuals`, case-exhibit `.visual`, and staged-exhibit `.visual` payloads;
- typed `vitals_trend` temperatures and `tempUnit`;
- source-code, archive, raw-bank, audit-report, and fixture text outside bundled canonical banks.

Typed displays already have renderer/unit contracts and are not prose-migration candidates. However, **prose beside a typed temperature remains in scope**. Record `coexistsWithTypedTemperature: true` when an exhibit or question contains both authored temperature prose and an excluded typed temperature payload.

### Explicitly out of scope

- canonical mutation;
- a temperature CI gate;
- `package.json` changes;
- renderer, schema, grading, source, answer-key, or question-content changes;
- deciding whether every unitless temperature should gain a unit;
- resolving ambiguous clinical prose;
- correcting source values or thresholds;
- updating the ledger, census, or project history;
- commit or push.

## 5. Required implementation shape

Recommended files:

- `scripts/audit/temperature-prose-unit-survey.ts`
- `scripts/tests/temperature-prose-unit-survey.ts`
- `audit/temperature-prose-unit-survey-2026-07-21/manifest.jsonl`
- `audit/temperature-prose-unit-survey-2026-07-21/safe-mechanical-subset.jsonl`
- `audit/temperature-prose-unit-survey-2026-07-21/review-residuals.jsonl`
- `audit/temperature-prose-unit-survey-2026-07-21/report.md`

Do not add a package script. Invoke the survey and focused test directly with `tsx`.

The survey is read-only with respect to banks. It may create or replace only its own code/test and audit-output files.

## 6. Structural traversal

Parse and validate every bundled top-level bank. Traverse learner-facing fields structurally rather than recursively accepting every string.

For every candidate occurrence, retain:

- canonical bank path;
- top-level session-unit ID;
- embedded question ID, if applicable;
- exact JSON path;
- surface class;
- language;
- full verbatim field text;
- deterministic occurrence index and character offsets;
- exact matched expression;
- nearby semantic context;
- EN/ZH counterpart path;
- whether the same owner contains an excluded typed temperature payload.

Do not collapse repeated temperatures in one string or the same value repeated at different timepoints. One row represents one semantically distinct occurrence.

The traversal test must prove that a temperature in `meta.source`, `structuredMeasurements`, or a visual payload is excluded while the same literal text in a learner-visible rationale or exhibit content is included.

## 7. Detection vocabulary

Support common explicit unit forms conservatively.

### Celsius

- `°C`, `ºC`, `℃`;
- tightly or loosely spaced `C` only when directly attached to a numeric temperature expression or supported by explicit nearby temperature language;
- `degrees C`, `degrees Celsius`, `Celsius`;
- `摄氏度`, `摄氏` when attached to a numeric expression.

### Fahrenheit

- `°F`, `ºF`, `℉`;
- tightly or loosely spaced `F` only when directly attached to a numeric temperature expression or supported by explicit nearby temperature language;
- `degrees F`, `degrees Fahrenheit`, `Fahrenheit`;
- `华氏度`, `华氏` when attached to a numeric expression.

### Unit-missing candidates

Report, but do not infer a unit for, a numeric expression in strong temperature context such as:

- `temperature 38.3`;
- `T 38.3`;
- `体温 38.3`;
- a fever/temperature threshold with an adjacent number but no explicit unit.

Keep this detector conservative. Do not treat vitamin C, hepatitis C, C-section, option C, grade C, stage C, room number, item IDs, or isolated letters as temperature units.

## 8. Two-axis semantic classification

Every occurrence receives both a quantity classification and a presentation classification.

### 8.1 `quantityKind`

- `ABSOLUTE_TEMPERATURE` — a physical temperature reading, setting, threshold, or range;
- `TEMPERATURE_DELTA` — a rise, fall, increase, decrease, change, difference, or interval expressed in degrees;
- `AMBIGUOUS_QUANTITY` — the text does not safely establish whether the number is absolute or a delta;
- `NON_TEMPERATURE_FALSE_POSITIVE` — retained only in diagnostic output/tests, not the final migration population.

This distinction is load-bearing:

- absolute: `38 °C = 100.4 °F`;
- delta: a rise of `1 °C = 1.8 °F`, **not** `33.8 °F`.

No row classified as `TEMPERATURE_DELTA` or `AMBIGUOUS_QUANTITY` may enter the safe mechanical migration subset.

### 8.2 `numericShape`

- `SCALAR`;
- `COMPARATOR` (`>`, `<`, `≥`, `≤`, “above,” “below,” etc.);
- `RANGE`;
- `SERIES_OR_MULTIPLE`;
- `COMPOUND_MIXED`;
- `UNPARSEABLE`.

### 8.3 `presentationClass`

- `DUAL_F_FIRST`;
- `DUAL_C_FIRST`;
- `FAHRENHEIT_ONLY`;
- `CELSIUS_ONLY`;
- `UNIT_MISSING`;
- `MALFORMED_OR_MISMATCHED_DUAL`;
- `AMBIGUOUS_PRESENTATION`.

A dual display is classified by semantic pairing, not merely by seeing both letters somewhere in the field. Multiple unrelated temperatures in one string must remain separate occurrences.

## 9. Arithmetic reconciliation

For every explicit absolute-temperature occurrence:

1. parse the source value or endpoints;
2. convert using the live `temp` policy and `toMeasurementDisplayValue` where applicable;
3. retain the exact unrounded converted value in the manifest;
4. compare existing dual values against the conversion;
5. record rounding precision and arithmetic residual.

For an existing dual display, treat the pair as reconciling when the secondary value lies within the half-unit implied by its displayed last decimal place. Examples:

- one decimal place → tolerance `0.05` in that unit;
- whole number → tolerance `0.5`;
- two decimal places → tolerance `0.005`.

Do not silently repair a non-reconciling pair. Classify it `MALFORMED_OR_MISMATCHED_DUAL` and route it to review with verbatim evidence.

## 10. Proposed display policy

This survey proposes normalized expressions but does not apply them.

For absolute temperatures:

```text
<Fahrenheit> °F (<Celsius> °C)
```

Rules:

1. Preserve the exact authored numeric token and meaningful trailing zeros on the side corresponding to the original source unit.
2. Calculate the missing counterpart from the live conversion policy.
3. Format the converted counterpart with the same numeric behavior already demonstrated by structured-temperature display: clinically ordinary converted values use a practical compact form, normally one decimal unless the conversion is exact at a coarser precision.
4. Do not invent extra source precision.
5. Preserve comparators and range relationships.
6. Normalize symbols and spacing only in the proposed expression, never in the live bank.
7. For an already-reconciling dual display, prefer reordering the existing authored values rather than recomputing and changing them unnecessarily.

Examples:

- `38.3 °C` → `100.9 °F (38.3 °C)`;
- `40°C` → `104 °F (40 °C)`;
- `102.4 °F` → `102.4 °F (39.1 °C)`;
- `36°C (96.8°F)` → `96.8 °F (36 °C)`;
- `38.0–38.5 °C` → `100.4–101.3 °F (38.0–38.5 °C)`;
- `above 38 °C` → proposed `above 100.4 °F (38 °C)`;
- `temperature increased by 1 °C` → **not safe subset**; record exact delta equivalence `1.8 °F` for review only.

For scalar conversion canaries, compare the proposal against `formatStructuredMeasurementValue("temp", ...)`. For ranges and comparators, record endpoint conversions and the composed proposed expression separately so later migration review can inspect them.

## 11. Dispositions

Every occurrence receives exactly one disposition:

- `ALREADY_CANONICAL` — correct Fahrenheit-first dual display;
- `SAFE_ADD_CELSIUS` — absolute Fahrenheit-only expression with exact parse/conversion;
- `SAFE_ADD_FAHRENHEIT_AND_REORDER` — absolute Celsius-only expression with exact parse/conversion;
- `SAFE_REORDER_EXISTING_DUAL` — reconciling Celsius-first dual display;
- `SAFE_NORMALIZE_DUAL_TOKENS` — Fahrenheit-first dual values reconcile, but unit symbol/spacing differs from the target typography;
- `REVIEW_TEMPERATURE_DELTA`;
- `REVIEW_DUAL_VALUE_MISMATCH`;
- `REVIEW_COMPLEX_MULTIPLE`;
- `REVIEW_AMBIGUOUS_CONTEXT`;
- `PRESERVE_UNIT_MISSING`;
- `EXCLUDE_NON_LEARNER_FACING`;
- `EXCLUDE_TYPED_RENDERER_CONTRACT`;
- `FALSE_POSITIVE`.

Only the four `SAFE_*` dispositions enter `safe-mechanical-subset.jsonl`.

An ambiguous row does not block completion of the survey. It must be preserved verbatim in `review-residuals.jsonl` rather than forced into a safe class.

## 12. Bilingual pairing

For each learner-facing EN or ZH occurrence, resolve the structural counterpart when one exists.

Record one of:

- `EQUIVALENT_SAME_PRESENTATION`;
- `EQUIVALENT_DIFFERENT_PRESENTATION`;
- `EQUIVALENT_DIFFERENT_PRECISION`;
- `COUNTERPART_MISSING_TEMPERATURE`;
- `VALUE_OR_UNIT_CONFLICT`;
- `NO_STRUCTURAL_COUNTERPART`.

The survey must compare temperature facts, not surrounding sentence length or literal translation.

A future mechanical migration candidate is safely paired only when:

- both language fields express the same temperature fact; or
- one field legitimately shares a common Latin-unit expression embedded in otherwise translated prose and the numeric facts reconcile.

Do not place an EN-only or ZH-only same-fact change in the safe migration subset when the paired field contains a conflicting value/unit. Route both to review.

## 13. Required output schema

At minimum, each `manifest.jsonl` row contains:

```json
{
  "bankPath": "banks/claude-canonical.json",
  "topLevelQuestionId": "...",
  "embeddedQuestionId": null,
  "jsonPath": "questions[...].stem.en",
  "surface": "stem",
  "language": "en",
  "verbatimText": "exact full string",
  "occurrenceIndex": 0,
  "startOffset": 42,
  "endOffset": 47,
  "matchedExpression": "40°C",
  "quantityKind": "ABSOLUTE_TEMPERATURE",
  "numericShape": "SCALAR",
  "presentationClass": "CELSIUS_ONLY",
  "sourceUnit": "°C",
  "sourceNumericTokens": ["40"],
  "exactConvertedValues": [104],
  "proposedExpression": "104 °F (40 °C)",
  "disposition": "SAFE_ADD_FAHRENHEIT_AND_REORDER",
  "counterpartJsonPath": "questions[...].stem.zh",
  "parityClass": "EQUIVALENT_SAME_PRESENTATION",
  "coexistsWithTypedTemperature": false,
  "notes": "mechanical survey evidence only"
}
```

Use nulls rather than omitting fields where a concept does not apply.

Sort deterministically by:

1. `bankPath`;
2. `topLevelQuestionId`;
3. `embeddedQuestionId`, null as empty string;
4. `jsonPath`;
5. `occurrenceIndex`.

## 14. Required canaries

The focused test must prove at least:

1. Celsius scalar: `38.3 °C` proposes `100.9 °F (38.3 °C)`.
2. Fahrenheit scalar: `102.4 °F` proposes `102.4 °F (39.1 °C)`.
3. Exact integer conversion: `40°C` proposes `104 °F (40 °C)`.
4. Celsius-first dual: `36°C (96.8°F)` classifies `SAFE_REORDER_EXISTING_DUAL`.
5. Fahrenheit-first dual: `99.1°F (37.3°C)` classifies `ALREADY_CANONICAL`.
6. Mismatched dual values route to `REVIEW_DUAL_VALUE_MISMATCH`.
7. Comparator values retain the comparator and convert correctly.
8. Range endpoints convert independently without collapsing the range.
9. `1 °C rise` classifies `TEMPERATURE_DELTA`, with exact delta equivalence `1.8 °F`, and never enters the safe subset.
10. `2 °F decrease` uses the delta formula, not the absolute formula.
11. Strong temperature context with no unit classifies `PRESERVE_UNIT_MISSING`.
12. Vitamin C, hepatitis C, C-section, option C, and an isolated `40 C` without temperature context do not become false temperatures.
13. `℃`, `℉`, `摄氏度`, and `华氏度` are recognized.
14. `meta.source`, typed structured measurements, and visual payloads are excluded.
15. Prose beside a typed temperature remains included and records `coexistsWithTypedTemperature`.
16. `rationale.correct`, per-choice rationale, strategy, options, case exhibits, staged exhibits, and embedded questions are traversed.
17. Multiple temperatures in one field produce separate ordered rows.
18. EN/ZH same-fact values reconcile despite surrounding-language differences.
19. Output ordering is deterministic.
20. A second survey run produces byte-identical artifacts from the same bank snapshot.

### Live-bank orientation canaries

These are locator expectations, not hardcoded counts:

- after the vocabulary repair, `gpt_format8c_ici_colitis_escalation` should ordinarily present `100.9 °F (38.3 °C)` and classify as already canonical; reconcile explicitly if it does not;
- the existing DKA case display `99.1 °F (37.3 °C)` is an already-canonical example;
- `claude-canonical.json` contains Celsius-only prose such as `40°C`;
- it also contains Celsius-first dual prose such as `36°C (96.8°F)` and `38.1 °C (100.6 °F)`;
- typed `unit: "°C"` rows in structured measurements are excluded even when adjacent exhibit prose is included.

Do not hardcode item counts or assume the current bank snapshot still contains exactly 1,942 items.

## 15. Report requirements

`report.md` must include:

1. branch, HEAD, upstream, and starting/ending worktree state;
2. exact canonical bank files and item population scanned;
3. authority files read and observed live policy;
4. traversal inclusion/exclusion contract;
5. total occurrences and distinct owning items;
6. counts by bank, producer prefix/family, surface, language, `quantityKind`, `numericShape`, `presentationClass`, and disposition;
7. counts of prose occurrences coexisting with typed temperatures;
8. exact safe mechanical subset size by conversion type;
9. every review residual grouped by reason;
10. every dual-value mismatch with arithmetic evidence;
11. EN/ZH parity counts and conflicts;
12. examples of already-canonical, safe, delta, ambiguous, and excluded rows;
13. byte-identical repeat-run proof;
14. explicit statement that no canonical bank, governance file, renderer, schema, ledger, census, or package script was modified;
15. recommended next step expressed only as measured migration scope, not an applied patch;
16. final verdict:
   - `SURVEY_COMPLETE`;
   - `SURVEY_COMPLETE_WITH_REVIEW_RESIDUALS`;
   - or `BLOCKED_POLICY_DRIFT`.

A nonzero residual population is expected and does not prevent `SURVEY_COMPLETE_WITH_REVIEW_RESIDUALS`.

## 16. Verification floor

Run, at minimum:

```sh
npx tsx scripts/tests/temperature-prose-unit-survey.ts
npx tsx scripts/audit/temperature-prose-unit-survey.ts
npm run validate-bank -- banks/*.json
npx tsc -b --pretty false
npm run census:check
git diff --check
```

Then rerun the survey and prove its generated artifacts are byte-identical.

Also prove:

```sh
git diff -- banks
```

is empty relative to the survey’s starting snapshot.

Do not run a canonical patch. Do not wire the survey into `npm run audit` or CI.

## 17. No additional architecture loop

This deterministic inventory does not require Claude review before execution. The unit-presentation decision is already made.

Codex may self-certify:

- traversal completeness against the declared structural null;
- parsing and arithmetic mechanics;
- deterministic output and counts;
- safe-subset membership under this closed disposition table.

Codex must not silently adjudicate ambiguous clinical language. Those rows belong in `review-residuals.jsonl` for Luke/GPT review during the later migration commission.

Escalate only a genuine contradiction with live policy, such as:

- executable temperature display is no longer Fahrenheit-first dual-unit;
- two authoritative current files impose incompatible prose conventions;
- the bank schema prevents a complete learner-facing traversal;
- safe and ambiguous classes cannot be separated without changing the settled product decision.

## 18. Stop conditions

Stop without claiming survey completion if:

- another agent is actively modifying the scanned banks during the run;
- live executable unit policy contradicts the commission;
- the traversal cannot distinguish learner-facing prose from typed/internal fields;
- output cannot retain exact item identity, path, and occurrence identity;
- arithmetic reconciliation is not deterministic;
- the survey accidentally mutates a canonical bank.

Do not stop merely because:

- the corpus is larger than expected;
- some expressions are deltas;
- some units are missing;
- EN/ZH fields conflict;
- a few rows require human review.

Classify and report those rows.

## 19. Exit checklist

- [ ] Started only after Luke reactivated the queued task
- [ ] Stable starting snapshot recorded
- [ ] Live Fahrenheit-first/Celsius-parenthetical policy verified
- [ ] All bundled canonical banks structurally traversed
- [ ] Learner-facing prose included; metadata/typed payloads excluded
- [ ] Absolute temperatures distinguished from deltas
- [ ] Scalars, comparators, ranges, and multiple-value fields classified
- [ ] Existing dual values arithmetically reconciled
- [ ] EN/ZH counterparts classified
- [ ] Deterministic sorted manifest written
- [ ] Safe mechanical subset written
- [ ] Review residuals written verbatim
- [ ] Summary report written
- [ ] Required canaries pass
- [ ] Repeat run is byte-identical
- [ ] Canonical banks remain unchanged
- [ ] No governance, package, schema, renderer, ledger, census, commit, or push change
- [ ] Final verdict is survey-only, not migration completion
