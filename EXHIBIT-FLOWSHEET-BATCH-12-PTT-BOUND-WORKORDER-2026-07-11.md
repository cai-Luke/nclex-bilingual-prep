# Work Order — Batch-12 aPTT censored value → `bound` disposition

Date: 2026-07-11
Author: Claude (architect seat). Implementer: Codex. Merge gate: Luke.
Status: **READY FOR IMPLEMENTATION.** Codex pre-implementer review cleared; Luke's
architectural litigation closed. Final send is Luke's. Paired change on send: the
`lab-reference-range-verification-spec.md` ptt-ceiling update.

Revisions:
- r2 (2026-07-11) — scope expanded 2→3 files after Codex verified the batch JSON is
  generator-emitted; mechanism ruled to bounded edits, not full regeneration.
- r3 (2026-07-11) — AC4 given a defined non-destructive verification method (isolated-cwd
  generator run); carried ptt-ceiling prerequisite reworded to separate the transcription
  tripwire from critical/reportable thresholds.

## Provenance

Spun off from the R17 vital-sign sanity survey return, which surfaced a comparator/
censored value distinct from the temperature-tripwire disposition. Target record:
`gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_deterioration`
(source: "Stat labs: hemoglobin 9.8 g/dL, platelet count 96,000/mm3, aPTT >200 seconds.").

## Verified against live disk (audit trail)

- `scripts/exhibit-flowsheet-gate.ts` — extraction gate: `/[<>≤≥]/.test(value)` → FAIL
  "store the comparator in bound"; `PanelEntry.bound?: ">" | "<"`; sourceSpan comparator must
  match `bound`; GATE 4 one-sided under a bound (`>` checks only `canonVal < min`).
- `src/schema.ts` — canonical validator: same comparator-in-value rejection; `bound` validated;
  `hasStructuredMeasurementBound` gates a bounded value behind `meta.schemaVersion ≥ 2.0`.
- `src/types.ts` — `StructuredMeasurementValue.bound?: ">" | "<"`.
- `src/allowedKeys.ts` — `structuredMeasurementValue: [columnId, value, unit, bound, context]`.
- `src/structuredMeasurements.ts` — renderer prepends the bound (`>200 seconds`); values-only,
  no `CRITICAL`/flag badge (flags forbidden in v1).
- `src/visuals/kinds/lab_trend/defs.ts` — `ptt`: canonicalUnit `seconds`, altUnits `["sec"]`,
  sanity `{min:10, max:200}` (PLACEHOLDER).
- `scripts/exhibit-flowsheet-stage-scattered-batch.ts` — generator: hardcodes `batch12Records`
  inline (anticoag `{ label:"ptt", value:">200", … }`); emits via
  `writeFileSync(<relative path>, JSON.stringify(records, null, 2) + "\n")`; **one run writes eight
  files** (`BATCH-10`…`BATCH-17` scattered) to the current working directory; imports only `node:fs`
  (self-contained). Local `PanelEntry` has **no `bound`**; local `ExcludedEntry.reason` is
  `"prior" | "trend" | "serial"`.

## Disposition (ruled)

Keep `ptt` as a **keyed bounded value**, not excluded. A critically prolonged aPTT is the most
diagnostic lab in this exhibit; `bound` retains it faithfully and is promotable. `>` preserves the
facility report as strictly greater than 150. Supersedes the earlier 12B exclude.

## Edits — three files, one logical change

Target staged panel entry for `ptt` (extraction shape), identical everywhere it appears:

```json
{ "label": "ptt", "value": "200", "bound": ">", "sourceUnit": "seconds",
  "sourceSpan": "Stat labs: hemoglobin 9.8 g/dL, platelet count 96,000/mm3, aPTT >200 seconds." }
```

1. **Generator — `scripts/exhibit-flowsheet-stage-scattered-batch.ts`** (source of truth):
   - Add `bound?: ">" | "<"` to the local `PanelEntry` type (required or `tsc` fails).
   - In `batch12Records`, the `anticoag_deterioration` record's `ptt` entry: `value` `">200"` → `"200"`,
     add `bound: ">"`. Leave `sourceUnit`, `sourceSpan` unchanged.
2. **`EXHIBIT-FLOWSHEET-MIGRATION-BATCH-12-scattered-2026-07-05.json`** — same change in place;
   `excludedValues` stays `[]`.
3. **`EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12B-2026-07-09.json`** — move `ptt` from
   `excludedValues` into `panel` as the entry above; set that record's `excludedValues` to `[]`.

## Method

- Edit the generator **source** only; the correction is dormant until the next intentional
  regeneration. **Do not run the generator's batch-write in the workspace** — one run rewrites
  `BATCH-10`…`BATCH-17`, and 13A/13B/12T are in flight.
- Files 2 and 3: load → mutate the one record → re-serialize the whole file (`scripts/patch-raw.ts`
  or a tsx snippet). Re-read from disk to confirm the write landed — a returned diff is not proof.
  ASCII-only; no smart-quote risk.

## Acceptance criteria

1. `npm run flowsheet-gate --` on **both** JSON files: the anticoag record returns **no FAIL**.
   Expected green — `"200"` verbatim in source, comparator rule clears, sourceSpan `>` beside `200`
   matches `bound`, one-sided GATE 4 (`200 < 10` false) passes.
2. `npx tsc -b --pretty false` clean (covers the generator `PanelEntry` type change).
3. Full gate output reported for both files, including pre-existing WARNs. Touch no other record;
   any new FAIL on another record → **stop and report**, no hand-patching.
4. **Generator-output verification (non-destructive).** Run the real generator with its outputs
   isolated to a temporary working directory (relative `writeFileSync` paths land there; no workspace
   file is written or modified). Then assert:
   - the temp `BATCH-12` `anticoag_deterioration` record is **deep-equal after canonical serialization**
     to the workspace `BATCH-12` record and to 12B's panel entry; and
   - the workspace `BATCH-12` and 12B anticoag records are deep-equal to each other.
   Report the temp `BATCH-10/11/13–17` outputs as expected byte-identical to their workspace
   counterparts; any mismatch is a **separate finding to report, not patch here** (it would indicate
   pre-existing generator↔JSON drift in a sibling batch). If an isolated generator run is infeasible in
   the environment, the permitted weaker fallback is: deep-equality between the two workspace JSON
   records plus a static check that the generator's `ptt` literal exactly matches the target entry —
   and the handback must state the weaker check was used.
5. No sibling batch file (`BATCH-10/11/13/14/15/16/17`) in the workspace is modified.

## Non-goals / authority

No promotion, no canonical bank writes, no schema bump, no generator batch-write in the workspace.
Codex implements; Claude re-verifies against live disk; Luke is the merge gate. No push to
`origin/main`.

## Carried prerequisites (not part of this order)

- **Promotion is 2.0-gated.** The bounded `ptt` requires the target bank at `meta.schemaVersion 2.0`
  (`hasStructuredMeasurementBound`). Track under the schema-2.0 migration arc.
- **12B re-gate.** Editing 12B re-enters it into its content-gate cycle; 12A/12B re-gate together.
- **ptt sanity ceiling — a transcription tripwire only.** The `{10,200}` sanity review asks a single
  question: is an exact transcribed value so implausible that it likely represents a typo or unit
  error? It does **not** encode when aPTT becomes clinically critical, nor a facility reportable
  ceiling. Three distinct concepts must stay separate in the reference-range lane:
  (a) `>200 seconds` — this case's facility *reporting ceiling* (a censored report, carried here as a
  `bound`); (b) a *critical/high threshold* — facility/clinical interpretation; (c) `{10,200}` *sanity*
  — the implausibility tripwire. Only (c) is the sanity question; (a) and (b) are separate authored
  reference-range metadata. Route the ceiling review to `lab-reference-range-verification-spec.md`.
  Does **not** affect this order — the `>` bound makes GATE 4 one-sided, so the sanity edge is not
  consulted for the censored value.

## Governance note (separate cleanup)

`reason ∈ {prior, trend, serial}` is stale in three places — the batch-protocol spec, the gate's
GATE 2 header comment, and the generator's local `ExcludedEntry` type — while the live gate
`EXCLUSION_REASONS` includes `comparator`. One reconciliation pass, independent of this order.

## Out of scope, flagged for Luke

An uncommitted `DECISIONS.md` modification is present in the working tree (surfaced by Codex; not made
in this session). It and this untracked work order stay outside the implementation. Worth a look given
the standing branch-protection / clean-worktree concern.
