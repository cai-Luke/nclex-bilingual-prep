# Exhibit Flowsheet — Escalation: does Rule D cover closely-spaced confirmatory readings?

Date: 2026-07-05. From: Claude Code (batch-10 adjudication, `scattered` bucket). For: Opus/Luke.

## Why this is an escalation, not a selection error

Per the loop brief, the tell for escalating rather than adjudicating is: "it is not a disposition call
against the rubric, it is a question about whether the rubric or the gate is right." This is that case.
The extractor's disposition is defensible and not clearly wrong against the current rules — but the
rules themselves don't clearly cover this pattern, and the mechanical serial detector structurally
cannot ever catch it (explained below), so it can't be waved through as "the detector will catch it
next time."

## The panel

`case_preeclampsia_magnesium_01/admission` (`EXHIBIT-FLOWSHEET-MIGRATION-BATCH-10-scattered-2026-07-05.json`):

> Blood pressure readings: 166/112 and 164/110 mm Hg 20 minutes apart. HR 92/min, RR 18/min.

Staged: both BP readings keyed in one `panel[]` (`sbp` 166 and 164, `dbp` 112 and 110), plus `hr` 92
and `rr` 18. Gate result: OK (no FAIL, no serial WARN).

## The tension

**Rule D** (`EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md`): "If any single allowlisted
parameter appears >=2 times with distinct timepoints in one exhibit... the exhibit is deterministically
flagged serial and excluded from flowsheet extraction entirely... a static single-column flowsheet
cannot represent a time series without either dropping timepoints or misrepresenting one reading as
'the' value."

By that wording, this exhibit qualifies: `sbp`/`dbp` each appear twice, with an explicit temporal
separation ("20 minutes apart"). The mechanical detector doesn't fire — not because the pattern isn't
serial, but because its `TIMESTAMP` regex only recognizes absolute clock/military time or now
relative-hour/day phrasing (`hour N`, `day N`, `N hr later`), none of which "20 minutes apart" matches.
This is a **new subclass** of the same detector gap already found twice (batch 4's "hour N" narration,
batch 6's log-style glucose list): relative, non-clock temporal framing that the detector can't see
regardless of how the pattern is phrased. Widening the regex further to catch "N minutes apart" is
possible but will always be chasing the next phrasing — the deeper question is whether this pattern
should be serial at all.

## Why I didn't just apply Rule D and call it a selection error

Clinically, "two BP readings confirming severe range, minutes apart" is not the same shape as the
cases Rule D was written for (a BP flowsheet over 90 minutes, a multi-hour respiratory-parameter
trend, a week of glucose logs) — those are genuine evolving time series where showing only one point
would misrepresent the trend. Here, the two readings together are the diagnostic confirmation
pattern for severe-range hypertension/preeclampsia (ACOG-style: severe-range BP confirmed on a repeat
reading within a short window) — both numbers describe the same clinical moment ("severe and
persistent, not a fluke"), not a value changing over time. Rule D's own rationale ("misrepresenting
one reading as 'the' value") arguably cuts the other way here: dropping *both* would discard the
confirmatory pattern entirely, and Rule D is exhibit-level all-or-nothing (confirmed in batch 6's
`#82`), so applying it here would also silently discard the HR and RR in the same exhibit — the
extractor's most clinically load-bearing exhibit in this case (this is the severe-preeclampsia
diagnosis moment) would render with nothing at all.

## What I'm asking

Is Rule D meant to reach this pattern, or does it need a carve-out for closely-spaced repeat readings
that jointly confirm one clinical state rather than trace a trend? If a carve-out is warranted, what's
the deterministic test (e.g., time gap below some threshold, or an explicit "N minutes/readings apart"
phrasing distinct from a genuine multi-point series)? If no carve-out is warranted, this exhibit (and
any future one with the same shape) should be `skip_serial` and the current disposition is wrong.

## Status

Not blocking batch 10 — no FAIL, and the values themselves are accurate and safely distinguished from
the fetal heart rate mentioned in the same sentence (140/min, correctly never keyed as `hr`, since
`fhr` is not in the vitals registry — a real clinical-safety distinction the extractor got right).
Batch 10 is otherwise clean; see `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-10-ADJUDICATION-2026-07-05.md`.
