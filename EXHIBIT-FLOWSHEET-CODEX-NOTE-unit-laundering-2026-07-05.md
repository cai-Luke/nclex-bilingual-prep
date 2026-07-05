# Exhibit Flowsheet — Codex Note: sourceUnit laundering (fix before batch 3)

Date: 2026-07-05. From: Claude (batch-2 adjudication). For: Codex (gate/code seat).

## Finding

The extractor is silently replacing the verbatim source unit with the analyte's canonical unit on
vitals, and the gate's implicit-unit path lets it through without a flag. Confirmed in batch 2
(`EXHIBIT-FLOWSHEET-MIGRATION-BATCH-02-prose_embedded-2026-07-05.json`):

- `case_ami_01/ex_vitals_new`: source sentence `RR: 24 bpm` → staged `rr` with `sourceUnit: "/min"`.
- `case_sepsis_pneumonia_01/triage`: source `HR 118/min` → staged `hr` with `sourceUnit: "bpm"`.

In both the value and dimension are correct (per-minute either way), so this is **not** a selection
error and batch 2 still passes. But `sourceUnit` is defined as the byte-exact source expression
(Rule C), and here it is the canonical substitute. The gate allowed it because
`isImplicitUnitAllowed(key, sourceUnit)` short-circuits the `sourceContainsUnit` check. That path
exists for *no-unit* cases (`HR 88` → implicit bpm); it is also masking *conflicting-unit* cases
(`RR 24 bpm`, `HR 118/min`).

## Why it matters (beyond tidiness)

The prose-normalization lane (DECISIONS 2026-07-05) decides whether prose needs cleaning by looking
at whether the *source notation* is nonstandard. If extraction has already laundered `sourceUnit` to
`/min`, the record looks clean and the lane cannot see that the prose says `bpm`. So the laundering
does not just bend Rule C cosmetically — it hides exactly the cases the normalization lane exists to
catch. Harmless for vitals (per-minute), but the same path on an analyte where the wrong unit changes
magnitude would be a silent numeric error, and the scattered bucket is where that risk lives.

## Fix (before batch 3)

In `scripts/exhibit-flowsheet-gate.ts`, the Rule C block currently reads (paraphrase):
```
if (!sourceContainsUnit(unitSource, e.sourceUnit) && !isImplicitUnitAllowed(e.label, e.sourceUnit)) { FAIL }
```
The `isImplicitUnitAllowed` escape should fire **only when no unit token is adjacent to the value**
in the sourceSpan. When the sourceSpan carries an explicit unit token that conflicts with the staged
`sourceUnit` (`bpm` present but staged `/min`; `/min` present but staged `bpm`), do not silently
accept — emit a WARN:
`source carries nonstandard/conflicting unit for <key>; staged as canonical; prose-normalization candidate`.
Keep accepting the value (do not block migration throughput on a cosmetic prose defect), but make the
substitution **visible** and tag it for the normalization lane so it stops being silent.

Extractor side: prefer recording the verbatim source unit; when it is nonstandard-but-dimensionally-
safe (RR `bpm`), the WARN is the signal, not a silent rewrite.

Stricter alternative, if Luke prefers: treat a conflicting explicit unit as a Rule C FAIL, blocking
the panel until the prose-normalization lane fixes the notation. Cleaner, but blocks panels on prose
defects. Recommend the WARN route for throughput.

## Do not over-correct

The genuine no-unit implicit cases must still pass silently: `HR 88`, `RR 20`, `BP 120/80` with no
unit token adjacent are the reason the implicit path exists. Only a *conflicting explicit* unit token
should trip the new WARN. IMPLICIT_SOURCE_UNITS (hr/rr/sbp/dbp/map) is the set this applies to.

## Verify

Re-run the archived smoke + blind gates and batches 1–2. The laundered vitals (`RR 24 bpm`,
`HR 118/min`) should now surface the WARN; nothing that currently passes on a genuinely no-unit vital
(`HR 88`) should start WARNing. `npm run flowsheet-blind-score` unchanged (12/12), `test:flowsheet-gate`
green, `tsc -b` clean.

## Note for the loop owner

This fix is orthogonal to batch 2's **selection** result — batch 2's dispositions are correct and it
still counts as the first clean 100% `prose_embedded` batch. Landing this fix does not require
re-adjudicating batch 2; it only changes whether its two laundered vitals carry a WARN going forward.
