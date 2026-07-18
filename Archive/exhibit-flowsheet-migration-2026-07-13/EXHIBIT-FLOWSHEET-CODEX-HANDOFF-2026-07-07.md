# Exhibit Flowsheet — Codex Handoff (post-proof, next batch)

Date: 2026-07-07
Audience: Codex
Authoritative contract: `Archive/root-specs-2026-07-18/structured-measurements-schema-1.8-codex-spec.md` (Frozen decisions +
Implementation constraints) and `DECISIONS.md` principle 24. On conflict, principle 24 wins.

## Where things stand

The 7-exhibit proof batch was promoted at commit `959a5f0` and **architect-gate-verified clean this
session** (values verbatim vs source spans, correct keys/panel-kinds/units, exclusions withheld, prose
preserved as supplement, no flags/ranges). `sao2.kind → "lab"` and the `temp` `°F/F/C` source-unit
acceptance both landed correctly. The foundation and the proof stand.

## Action items before the next promotion batch

1. **Amend the migration ledger (do this first).**
   `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md` still opens with "these artifacts … do not add
   `structuredMeasurements`, and do not render." That is now false. Correct the header and add a
   promotion row recording the 7 proof refs, commit `959a5f0`, and the 2026-07-07 architect gate
   verdict (clean, promotion stands). The 7 refs are the hardcoded `PROOF_REFS` in
   `scripts/apply-structured-measurements.ts`.

2. **Temp display policy — fix before wide promotion (US-conventional).**
   The proof surfaced this: `case_dka_01/ex_vitals_0800` stores temp `99.1 °F` correctly but renders
   `37.3 °C`, because `temp` has no entry in `MEASUREMENT_DISPLAY_POLICIES` and falls back to canonical
   °C. On a US exam app that is backwards. Add a `temp` policy in `src/measurementUnitPolicy.ts`:
   `{ primaryUnit: "°F", secondaryUnit: "°C", secondaryMode: "paren" }`. This is display-only — stored
   source units are already correct. Verify the DKA proof case then renders `99.1 °F (37.3 °C)`, and add
   a formatter test. (A °C source, e.g. the sepsis triage case, should still render °F-primary via the
   conversion, matching US practice — confirm the direction reads correctly for both °F- and °C-sourced
   temps.)

3. **Staged artifacts predate the SaO2 / troponin-I split — re-extract those refs before promoting them.**
   The staged batch files were extracted before `sao2`/`troponin_i` existed. Evidence: the Batch-02
   artifact still keys `cs_copd_01/labs` "SaO2: 85%" as `spo2`, and Batch 20 row 14 keys "troponin I" as
   `troponin_t`. Any ref whose source carries SaO2 or troponin I must be re-derived to `sao2` /
   `troponin_i` (and, for troponin I µg/L, note the missing conversion factor below) before it promotes.
   Do **not** promote the stale keying. The proof 7 are unaffected (none carry SaO2/troponin-I).

4. **`troponin_i` + `µg/L` has no conversion factor (add when troponin-I refs come up).**
   `LINEAR_UNIT_FACTORS` in `src/measurementUnitPolicy.ts` has `troponin_t|µg/L → 1` but not
   `troponin_i|µg/L`, though `troponin_i` accepts `µg/L`. Add `[factorKey("troponin_i", "µg/L")]: 1`
   (1 µg/L = 1 ng/mL). Without it, a µg/L-sourced troponin I skips GATE 4 sanity with a "could not
   convert" WARN and the formatter falls back to raw. Safe but incomplete.

5. **Source-unit laundering (already tracked — no action in this lane).**
   `case_ami_01` prose says "RR: 24 bpm" and `case_sepsis_pneumonia_01` says "HR 118/min"; the structured
   values are correct (`24 /min`, `118 bpm`). The awkward prose units belong to the separate
   prose-normalization lane, not structured-measurement promotion. Leave them.

## Process — the promotion gate is Claude Code's, not yours

The proof promotion was committed to `main` without the architect gate that was agreed for that step.
Going forward, for every structured-measurements batch:

- Stage + run `scripts/apply-structured-measurements.ts` in **dry-run** (no `--write`).
- Run the mechanical gates (`flowsheet-gate`, `validate-bank`, `scan-unknown-keys`,
  `test:structured-measurements`, `census`).
- Hand the dry-run diff + gate output to **Claude Code** for the promotion review and the write/commit
  decision (see `EXHIBIT-FLOWSHEET-CLAUDECODE-GATE-HANDOFF-2026-07-07.md`).
- Do **not** `--write` to canonical banks or commit a promotion to `main` yourself. Promotion is the
  gate seat (producer≠checker; `DECISIONS.md` principle 2, principle 24).

## Reference

- Applicator: `scripts/apply-structured-measurements.ts` (`npm run structured-measurements:apply`).
  Guards are correct (rejects Batch 19, refuses globbing, one-match-per-ref, refuses double-application,
  re-validates post-apply). `REPLACE_REFS` stays empty until a record is verified to have every
  learner-facing fact captured by v1 structured fields — the elder-neglect precedent (non-allowlisted
  albumin/prealbumin/eGFR) is why clean-KV records still supplement rather than replace.
- Fishbone renderer remains the fast-follow (net-new build) after the flat-primitive render is validated;
  it is not a promotion blocker.
