# Exhibit Flowsheet — Codex Note: serial detector misses relative-hour timestamps

Date: 2026-07-05. From: Claude (batch-4 adjudication). For: Codex (gate/code seat).

## Finding

`serialParams`/`looksSerial` in `scripts/exhibit-flowsheet-gate.ts` require ≥2 distinct matches of
`TIMESTAMP` (`HH:MM`, `HH:MM AM/PM`, `H AM/PM`, or 4-digit military time) before it will even check
for repeated allowlisted parameters. Confirmed gap in batch 4
(`EXHIBIT-FLOWSHEET-MIGRATION-BATCH-04-prose_embedded-2026-07-05.json`):

- `gpt_case_gbs_respiratory_compromise_01/stage1_0_12h_update` is staged `skip_serial` — correctly,
  the source repeats FVC, MIP, RR, and SpO2 across "At hour 4," "At hour 8," and "At hour 12." But
  `TIMESTAMP` doesn't match "hour 4" / "hour 8" / "hour 12," so `distinctTimes.size < 2` and
  `serialParams` returns `[]` before it ever gets to the label-repetition check. The gate emits
  "lane=skip_serial but serial detector did not re-confirm ≥2 timepoints; verify" even though the
  extractor's disposition is right.

## Why it matters

This is advisory (WARN, not FAIL) so it isn't blocking anything today, but it means the independent
mechanical re-check for Rule D silently degrades to a no-op on any exhibit that narrates elapsed time
as "hour N" / "N hours later" / "day N" rather than clock or military time — which is exactly the
phrasing ICU deterioration narratives use (this GBS case has three more stages doing the same thing:
`stage2_12_24h_update` uses "At hour 16" / "At hour 20"; `stage3_icu_days2_5_update` uses "ICU day 3"
/ "ICU day 4" / "ICU day 5"). A future extractor that mis-tags one of these as `extract` instead of
`skip_serial` would get no pushback from the detector, because the detector can't see the timepoints
at all.

## Fix (not urgent, no throughput block)

Extend `TIMESTAMP` (or add a second pattern ORed into the same check) to recognize relative-time
markers: `\bhour\s+\d+\b`, `\bday\s+\d+\b`, `\b\d+\s*(?:hr|hours?)\s+(?:later|after)\b`. Keep it
additive — the existing clock/military patterns stay, this just stops the detector from going silent
on elapsed-time narration.

## Do not over-correct

Don't treat every "day N" as a timepoint marker on sight — e.g. a case background sentence like "she
completed cycle 4 nine days ago" (single mention, not a repeated series) shouldn't flip anything by
itself; the existing ≥2-distinct-timepoints-AND-≥2-repeated-label threshold already guards against
that, so widening the timepoint pattern set is enough.

## Note for the loop owner

Not a selection error and does not invalidate batch 4. The `skip_serial` disposition for
`stage1_0_12h_update` is correct on independent read of the source; only the detector's
re-confirmation is blind here. No re-adjudication needed once this lands — it only changes whether
the WARN fires going forward.
