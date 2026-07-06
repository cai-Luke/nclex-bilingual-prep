# Exhibit Flowsheet — Codex Note: serial detector blind to closely-spaced confirmatory readings

Date: 2026-07-05. From: Claude (architect seat, batch-10 escalation resolution). For: Codex (gate/code seat).
Sibling to `EXHIBIT-FLOWSHEET-CODEX-NOTE-serial-timestamp-gap-2026-07-05.md`. Governing rule change:
`EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` → **Rule D (amended 2026-07-05)**.

## Finding

Rule D was clarified: an exhibit is serial (→ `skip_serial`, stays prose) when an allowlisted parameter
carries **>=2 current readings for the same client** in one exhibit — this now explicitly reaches the
**closely-spaced confirmatory repeat**, not just the multi-timepoint trend. The live instance:

- `case_preeclampsia_magnesium_01/admission`:
  `Blood pressure readings: 166/112 and 164/110 mm Hg 20 minutes apart. HR 92/min, RR 18/min.`
  Two current BP readings, neither marked historical. Correct disposition is `skip_serial`
  (already flipped in `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-10-scattered-2026-07-05.json` by the ruling).

The mechanical serial re-check (`serialParams`/`looksSerial` in `scripts/exhibit-flowsheet-gate.ts`)
does **not** fire here, and structurally cannot as written, because the confirmatory shape defeats
both halves of its trigger:

1. **Timepoint half:** `TIMESTAMP` needs >=2 distinct timepoint tokens. `20 minutes apart` is a single
   relative-gap token, not two timepoints. Widening `TIMESTAMP` to add `N minutes apart` does **not**
   fix this — one gap phrase is still one token, so `distinctTimes.size` stays `< 2`. This is a
   deeper gap than the batch-4 `hour N` fix (that added real repeated timepoint tokens; this shape has
   none).
2. **Label half:** `labelHitCount` counts label-pattern occurrences. `Blood pressure readings: 166/112
   and 164/110` carries the label **once** with two values, so `labelHitCount("bp") === 1 < 2`.

So the timepoint-based detector can neither re-confirm the correct `skip_serial` nor flag the exhibit
if a producer mislabels it `extract`. Two complementary guards are needed.

Implementation status: Guard 1 is implemented in `scripts/exhibit-flowsheet-gate.ts` as a hard FAIL
for duplicate `panel[]` labels in `extract` records, with regression coverage. Guard 2 remains queued
as a source-prose WARN heuristic.

## Guard 1 (structural, recommend FAIL) — duplicate current label in an `extract` record

This is **not** a prose heuristic and has zero false-positive risk. It is the clarified Rule D
invariant ("at most one current value per parameter per exhibit") made mechanical on the staged record.

- **Scope:** `lane === "extract"` records only.
- **Check:** within `panel[]`, no two entries may share the same `label`. `sbp` and `dbp` are distinct
  labels, so one `sbp` + one `dbp` is fine; **two `sbp`** (as in the live instance: `sbp` 166 and `sbp`
  164) is the violation.
- **`context` does not exempt:** two current `panel[]` entries with the same label are a violation
  regardless of any `context` tag. A genuine pre/post-intervention pair keys the post value as current
  and excludes the pre value with reason `prior` (one `panel[]` entry, one `excludedValues` entry) —
  it never produces two `panel[]` entries. Unit conversions live in `unitAliases[]`, not `panel[]`, so
  they never trip this.
- **Recommended level: FAIL** (blocks the batch, returns to producer). Rationale: a duplicate current
  label is a hard structural contradiction of the one-value invariant, not a candidate for human
  judgment — the exhibit is either serial (→ `skip_serial`) or the producer double-keyed; either way
  the `extract` record is malformed. This guard alone would have hard-caught the live instance at the
  gate instead of relying on adjudication. If you prefer a softer landing during rollout, WARN is
  acceptable, but the target state is FAIL. Call this out separately from Guard 2 in the gate output.

## Guard 2 (source heuristic, WARN) — >=2 current readings of one parameter in the source

Complements Guard 1. Guard 1 catches a producer that **keyed both** readings; Guard 2 catches a
producer that **kept one and silently dropped the other** (record passes Guard 1 with a single `sbp`
entry, but the source still shows two current BP readings and the exhibit should have been
`skip_serial`). Both are needed.

- **Signal:** for an allowlisted parameter, >=2 current readings **with different values** present in
  the source, none disambiguated by a history marker (`down from`, `was`, `baseline`, `earlier`,
  `prior`, `up from`, `previously`). Repeated *identical* values (same number restated by a
  corroborating modality — a vitals HR and an ECG rate both `118`) are **one reading**, keyed once per
  Rule C, and must **not** fire Guard 2. Guard 1 still catches the case where a producer keys the
  identical value twice (duplicate label → FAIL, key once).
- **Firing:** on an `extract` record, WARN — `source shows >=2 current readings of <key>; should this
  be skip_serial? (Rule D)`. Route to always-sampled human adjudication. **Never a FAIL** and **never
  an auto-flip of lane** — serial-vs-not-serial authority stays with the checker seat (producer≠checker).
- Implement as a branch parallel to the existing timepoint path, not by widening `TIMESTAMP` (a value
  count is not a timepoint).

## Boundary cases the guards must satisfy

Must **WARN / FAIL** (these are serial confirmatory repeats):
- `Blood pressure readings: 166/112 and 164/110 mm Hg 20 minutes apart` — Guard 1 FAILs if both keyed;
  Guard 2 WARNs if only one keyed. Neither reading is marked historical.

Must **NOT WARN / FAIL** (these are legitimate `extract` shapes):
- `BP 96/58, down from 118/72 earlier` — prior-value trap: one current reading (`96/58`) keyed, one
  historical (`118/72`, marked `down from ... earlier`) excluded reason `prior`. The history marker is
  the disambiguator; Guard 2 must not fire.
- `Blood pressure 128/82, average of 2 readings` — a single pre-averaged value. Count actual numeric
  readings (`\d+/\d+`), **not** the literal word `readings` or the count `2`. One reading present → no fire.
- Dual-unit temperature `101.2 F (38.4 C)` — one reading in two units (Rule C same-measurement
  conversion), not two readings. The parenthetical conversion must not count as a second reading.
- **Same-value dual-modality:** `HR 118 at rest ... ECG: sinus tachycardia at 118 bpm` (batch-12
  clozapine `day18_assessment`) — one HR reading corroborated by two instruments, not two readings.
  Count distinct *values*, not label occurrences; identical value → no fire. Correct disposition is
  `extract`, HR keyed once.
- **Fetal vs maternal heart rate:** `Fetal heart rate baseline 140/min ... HR 92/min` — `heart rate`
  matches the `hr` label pattern, so a naive count sees two `hr` readings. Exclude fetal contexts
  (`fetal`, `\bFHR\b`, `胎心`) from the `hr` count via negative lookaround, mirroring the existing
  ionized/total calcium lookbehind. FHR is not in the vitals registry and is never keyed as `hr`;
  it must never contribute to an `hr` serial/completeness signal.
- **Multi-victim disaster triage:** several patients' RR/HR in one exhibit (batch 10 `#17`
  `disaster_triage`) is multi-**subject**, not multi-reading-of-one-subject. Correct disposition is
  `extract` with an **empty `panel[]`**, never `skip_serial` (Rule D same-subject guard). The detector
  must never auto-flip this to `skip_serial`; best-effort, suppress the Guard 2 WARN when >=2 distinct
  subject markers are present (`Victim`, `Patient B/C/D`, triage-tag colors). A residual spurious WARN
  here is low-harm (the scene is already 100%-sampled and correctly ruled empty-panel), but an
  auto-flip would be a real error.

## Do not over-correct

Same caution as the sibling note: a single mention of a parameter, or a genuine prior/trend
single-current-plus-history construction, must not trip either guard. The invariant is **>=2 *current*
readings of one parameter for the *same client***; historical values and cross-subject values do not count.

## Note for the loop owner

No re-adjudication of prior batches is required. The one live instance (`case_preeclampsia_magnesium_01/admission`)
is already flipped to `skip_serial` by the architect ruling. These guards only change gate behavior
going forward: Guard 1 now makes a double-keyed `extract` record a hard stop; Guard 2 will route
single-keyed serial candidates to the always-sampled human check once implemented. Landing Guard 2
before batch 11 is preferred but not a throughput block — the checker seat now has the clarified Rule
D and the always-sampled net (`skip_serial`, `excludedValues`, GATE 4, calcium-identity) covering this
class in the interim.
