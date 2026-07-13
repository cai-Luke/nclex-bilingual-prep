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

## Resolution (2026-07-05, architect seat)

**RESOLVED. Verdict: serial → `skip_serial`. No carve-out. The `extract` disposition was wrong under
the clarified rule.**

The key observation is the staged record, not the prose: it keyed four panel entries — `sbp` 166,
`dbp` 112, `sbp` 164, `dbp` 110 — i.e. **two current values per parameter, one `sourceSpan`, no
timepoint axis**. That is exactly the shape a single-column flowsheet cannot hold: it flattens two
confirmatory readings into an ambiguous two-value cell (reads as a mini-trend, misrepresenting a
confirmation as a change) or silently drops one. So the intuition in this note inverts — `extract`
**mangles** the confirmatory pattern; `skip_serial` **preserves** it, because the untouched prose
("166/112 and 164/110 mm Hg 20 minutes apart") states the ACOG severe-range confirmation better than
any flowsheet cell could (GATE 3 keeps it intact). Dropping the whole exhibit's HR/RR too is correct,
not collateral damage: a flowsheet showing HR/RR but conspicuously missing BP on a hypertensive
emergency reads as if BP weren't taken (same logic as Rule F — a BP-less flowsheet is worse than
none). Nothing is lost; it stays prose.

**No deterministic carve-out** because confirmation-vs-trend has no deterministic separator (both are
low-delta, same-parameter, multi-reading shapes; a time-gap threshold misfires — the Panel 5 trend is
30 min apart, ACOG confirmation can be up to 4 h). A carve-out would reintroduce model judgment on
lane membership, which Rule D forbids. Instead Rule D's *statement* was tightened to match its own
rationale: the invariant is **one current reading per parameter per exhibit, for the same client**;
this case was always on the wrong side of it. This is a rubric clarification, so the extractor's
disposition was **not** a stop-rule selection error — escalating rather than adjudicating was correct.

Actions taken (all on disk):
- Rule D amended in `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` (adds the ≥-2-current-readings
  trigger, the confirmatory shape, the **same-client / same-flowsheet-subject** guard so multi-victim
  scenes stay `extract` empty-panel, and the no-carve-out rationale).
- `case_preeclampsia_magnesium_01/admission` flipped `extract` → `skip_serial` in
  `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-10-scattered-2026-07-05.json`.
- Detector work queued: `EXHIBIT-FLOWSHEET-CODEX-NOTE-serial-confirmatory-readings-2026-07-05.md`
  (Guard 1: duplicate-current-label record check, recommended FAIL; Guard 2: source >=2-current-readings
  WARN; full must-WARN / must-not-WARN boundary set including FHR-vs-maternal-HR and multi-victim).
- Batch 10 does **not** count as a clean ramp batch; `scattered` two-consecutive-clean-100% counter
  reset to 0 (ledger updated).

Contributing review: Codex added the same-client guard (multi-victim over-capture) and the separate
duplicate-panel structural guard; both folded in.
