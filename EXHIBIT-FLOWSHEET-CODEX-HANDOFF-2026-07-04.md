# Exhibit Flowsheet — Codex Handoff (both ends)

Date: 2026-07-04
Owner after this doc: Codex (implementation), then the extractor model, then Claude + gate (adjudication).
Reads: `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` (contract),
`EXHIBIT-FLOWSHEET-BLIND-BATCH-SPEC-2026-07-04.md` (blind test set),
`scripts/exhibit-flowsheet-gate.ts` (the gate, already on disk).

This ties both ends together: Codex runs the **extraction** end (produce structured panels from
prose) and the **gate** end (deterministic check), so the loop is self-contained and Claude only
adjudicates the semantic residual the gate cannot see.

## Task list for Codex

### 1. Wire up the gate as an npm script

Add to `package.json` scripts (alphabetical-ish, near the other non-audit tools):
```
"flowsheet-gate": "tsx scripts/exhibit-flowsheet-gate.ts",
"test:flowsheet-gate": "tsx scripts/tests/exhibit-flowsheet-gate.ts",
```
Then confirm `npx tsc -b --pretty false` is clean and `npm run flowsheet-gate` prints the usage
string with no args (exit 2).

### 2. `--blind` input mode — ALREADY IMPLEMENTED (verify only)

The gate now has a `--blind <cases.json>` mode (added 2026-07-04 while addressing the pre-run
flags). It reads a flat array of `{ exhibitRef, content:{en,zh} }` fixtures and resolves
`exhibitRef → content.en` directly via `buildBlindIndex`, bypassing the bank/question walk; `--bank`
is unchanged for the canonical smoke batches. **Do not re-implement.** Just verify: running with
`--blind EXHIBIT-FLOWSHEET-BLIND-CASES-2026-07-04.json` resolves the blind refs and does not fall
through to the default bank scan.

Also already done in the same pass (verify, do not redo): the serial detector is generalized to any
allowlisted parameter (not just BP) via `serialParams`; `sourceSpan` is now REQUIRED (missing → FAIL)
on both `panel[]` and `excludedValues[]`; GATE 2 is implemented as an **advisory** source sweep
(WARN-only) with the docstring corrected to stop overclaiming it; and the module is import-safe (see
task 3).

### 3. Write the gate's own test (`scripts/tests/exhibit-flowsheet-gate.ts`)

Match the house test style (plain `.ts`, local `assert` that throws, executable sections). The test
must **not** depend on live banks — it constructs a tiny in-memory source string and asserts the
gate's verdict on hand-built records. The gate is **already import-safe**: `main()` is guarded on the
`resolve(process.argv[1]) === fileURLToPath(import.meta.url)` idiom (matching `scripts/census.ts`),
and it exports `gateRecord`, `toCanonical`, `serialParams`, `looksSerial`, `buildBlindIndex`, `ALLOW`,
`ALLOW_KEYS`, and the record types. Import those directly — no refactor needed. Cover, at minimum,
one passing and one failing case per gate:
- GATE 1: a value not present in source → FAIL; present → no GATE 1 finding.
- GATE 4: platelets `18,000` with `sourceUnit "/µL"` → passes (18 ×10⁹/L in band); same value with
  `sourceUnit "×10⁹/L"` → WARN (18,000 out of band). This is the regression lock for the smoke-batch
  defect — it must be an explicit assertion.
- Rule C: missing `sourceUnit` → FAIL; unrecognized `sourceUnit` for the analyte → FAIL.
- Rule E: missing `sourceSpan` → FAIL on both panel and excluded entries; non-verbatim span → FAIL.
- Rule F: `post_intervention` as an `excludedValues.reason` → FAIL; as a `panel.context` → passes.
- Rule D: a `skip_serial` record with a stray `panel` key → FAIL; a well-formed one → no finding.
  Also assert `serialParams` fires on a **non-BP** serial (e.g. a source with creatinine at two clock
  times) — the generalized-detector regression for flag 1.
- Temp: `102.0` with `sourceUnit "°F"` → GATE 4 passes (38.9 °C in band).

### 4. Run the extraction end (smoke batch 2 + blind batch)

Two extraction passes, both in the **amended** record shape (with `sourceUnit`, optional `context`,
exclusion enum `{prior, trend, serial}`):
- **Smoke batch 2:** the six worst-case panels in `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md`.
  Emit `EXHIBIT-FLOWSHEET-SMOKE-EXTRACTION-V2-2026-07-04.json`. This is a confirmation run — Panel 1
  (platelets) and Panel 6 (post-labetalol BP) are the targeted regressions.
- **Blind batch:** first, the **generator** model (≠ the extractor; see the blind-batch spec's
  producer≠checker constraint) produces `EXHIBIT-FLOWSHEET-BLIND-CASES-2026-07-04.json` and the held-
  back `EXHIBIT-FLOWSHEET-BLIND-ANSWERKEY-2026-07-04.json`. Then the extractor produces
  `EXHIBIT-FLOWSHEET-BLIND-EXTRACTION-2026-07-04.json` from the cases file (content only — do not show
  the extractor the answer key).

### 5. Run the gate end

```
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-SMOKE-EXTRACTION-V2-2026-07-04.json
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-BLIND-EXTRACTION-2026-07-04.json --blind EXHIBIT-FLOWSHEET-BLIND-CASES-2026-07-04.json
```
Capture both outputs verbatim (FAIL/WARN lines + the summary line) into the handoff back to Claude.

## Pre-push gate (per repo convention)

Before handing back:
- `npx tsc -b --pretty false` clean.
- `npm run test:flowsheet-gate` passes (the new test).
- `npm run test-visuals` still green (the gate imports nothing from the visual runtime, but the
  allowlist table mirrors `VITAL_DEFS`/`ANALYTE_DEFS`; if you instead export a shared allowlist
  module per the proposal's Rule A implementation note, run the visual tests to confirm no renderer
  regressed).

## What Codex must NOT do

- Do not promote anything. The blind cases and both extractions are disposable test artifacts at repo
  root; none touch `banks/`.
- Do not edit canonical banks. The gate is read-only by construction (GATE 3); keep it that way.
- Do not let the extractor see the blind answer key, and do not let the blind-case generator also run
  the extraction (producer≠checker, extended — see the blind-batch spec).
- Do not "fix" a GATE 4 WARN by widening the sanity bounds. A WARN is a signal for Claude to
  adjudicate, not a bug in the gate.

## Hand back to Claude

Return: the two gate outputs (verbatim), the blind answer key, the blind extraction, and a one-line
note on junior-model effort for the cost signal. Claude adjudicates selection-level correctness
(current-vs-prior, out-of-scope silence, post-intervention tagging) against the answer key — the
layer the gate cannot see — and makes the go / iterate call on the full 232-panel migration.
