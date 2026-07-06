# Exhibit Flowsheet — Escalation: does Rule D reach a same-value HR reported via vitals AND ECG?

Date: 2026-07-05. From: Claude Code (batch-12 adjudication, `scattered` bucket). For: Opus/Luke.

## Why this is an escalation, not a selection error

Same test as the batch-10 escalation: this is a question about whether the amended Rule D's trigger
condition is being read correctly, not a disposition call the checker seat can resolve unilaterally
against settled rules.

## The panel

`gpt_case_clozapine_toxicity_01/day18_assessment` (`EXHIBIT-FLOWSHEET-MIGRATION-BATCH-12-scattered-2026-07-05.json`),
staged `skip_serial`:

> Vital signs and exam: T 38.7 °C, HR 118 at rest, BP 110/70 sitting, RR 22, SpO2 95% on room air...
>
> Stat labs: ... Troponin I 0.48 ng/mL, CRP 68 mg/L, BNP 420 pg/mL... ECG: sinus tachycardia at 118 bpm,
> nonspecific ST-T wave changes, QTc 448 ms.

The adjudication queue's review note frames this as: "Current HR appears in vitals and ECG-rate prose"
— i.e., `hr` textually appears twice, so the amended Rule D's ">=2 current readings of one parameter,
same client" trigger fires, and the exhibit (including T/BP/RR/SpO2, none of which repeat) goes
`skip_serial`.

## Why I didn't wave this through as correctly resolved

Every worked example of the amended Rule D — the ACOG BP pair "20 minutes apart," the clozapine
orthostatic sitting/standing pairs earlier in this same case (`baseline_record`, `day10_update`), the
agitation-vs-calming vitals in batch 11 — involves **two different numeric values** from an explicit
repeat-measurement protocol (a deliberate second reading, or a named physiological state change). Here
both mentions are the **identical number**, 118, with no "X minutes apart," no named second protocol —
just the same acute assessment's heart rate stated once in the vitals line and confirmed once via the
concurrent ECG's rate readout. A vitals HR and an ECG-derived rate over the same acute window are not
independent samples of a changing value; they are two **instruments corroborating one state**, which
reads as the same shape Rule C already resolves for same-measurement dual-unit mentions (`101.2 F
(38.4 C)`) and the batch-8 duplicate-fingerstick-glucose case (keyed once, not treated as serial) — not
the shape Rule D exists to guard against (flattening two *different* readings into one ambiguous cell).

If Rule D is meant to reach this, the cost is real: `day18_assessment` is the exhibit where the client
develops fever, tachycardia, chest pressure, S3 gallop, crackles, and troponin rise — the trigger for
holding clozapine and starting the myocarditis workup. Discarding its T/BP/RR/SpO2 along with the
(arguably non-serial) HR is a heavier loss than the batch-10/11 cases, where the discarded exhibit's
other vitals were incidental to the confirmatory reading itself.

## What I'm asking

Is a parameter mentioned twice with the **same value**, via two corroborating observation modalities in
one assessment window (not a repeat-measurement protocol, no distinct timepoint framing), a Rule D
trigger? Or does it belong with Rule C's same-measurement handling — keyed once (first or more
clinically primary mention), no `skip_serial`? The Codex note's boundary-case list
(`EXHIBIT-FLOWSHEET-CODEX-NOTE-serial-confirmatory-readings-2026-07-05.md`) doesn't cover this shape;
if a carve-out is warranted here, Guard 2's design should exclude equal-value repeats the same way it's
asked to exclude fetal-vs-maternal HR and multi-victim scenes.

## Status

Not blocking batch 12's other 19 records — see
`EXHIBIT-FLOWSHEET-MIGRATION-BATCH-12-ADJUDICATION-2026-07-05.md`. This batch also contains a separate,
unambiguous selection error (WBC/Hct omission in the gallstone pancreatitis case) that already breaks
its clean-batch eligibility regardless of how this question resolves.

## Resolution (2026-07-05, architect seat)

**RESOLVED. Not Rule D. Flip `skip_serial` → `extract`; key HR once.** Same value (118) via two
corroborating modalities in one window is one reading (Rule C), not the differing-value ambiguity Rule
D prevents. Verified at source: BP appears once ("110/70 sitting"), no orthostatic pair, so no
independent trigger. Rule D trigger tightened to ">=2 current readings **with differing values**"; Rule
C extended to same-value cross-modality restatement; Guard 2 boundary case added. Full day18 panel
re-extraction spec'd in the batch-12 adjudication update. Producer re-extracts; gate + checker verify.
