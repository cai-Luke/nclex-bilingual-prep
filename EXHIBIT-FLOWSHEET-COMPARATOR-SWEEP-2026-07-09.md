# Structured Measurements Comparator Sweep

Date: 2026-07-09

Scope: canonical `structuredMeasurements` written before the Candidate 12 patch, covering the already-promoted Candidate 02A through Candidate 11B lineage in the current bundled banks.

Check: every `structuredMeasurements.panels[].rows[].values[].value` in `banks/*.json` was scanned for comparator/censored-value symbols `<`, `>`, `<=`, `>=`, `≤`, or `≥`.

Result: **0 hits**.

Notes:

- No canonical repair was performed.
- Candidate 12B's staged `ptt` value `>150` was not canonical at the time of this sweep and is now moved to `excludedValues` with `reason: "comparator"` in the patched Candidate 12B artifact.
