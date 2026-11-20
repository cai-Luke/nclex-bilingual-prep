# Project Shrimp — Claude.ai Calculator R3 Final Closure Handoff

**Audience:** Claude.ai specification reviewer  
**Date:** 2026-09-16  
**Task:** confirm one final logic amendment only.  
**Not requested:** fresh specification review, implementation, browser execution, learner-shell review, P27 inspection, or optional polish.

## Already accepted and not reopened

Your prior closure return accepted:

- `CLOZE_R2: ACCEPT`
- `SERIAL_ROUTING: ACCEPT`

Those dispositions stand. Do not rereview the cloze order or serial routing.

## Remaining calculator defect you identified

You found that R2 treated an entire wrapping answer row as the geometric target while the normal-portrait Large contract guaranteed only `band > 0`, making acceptance impossible when a row exceeded the available band.

You proposed two linked clarifications:

1. For answer controls, measure/hit-test the actual activation element rather than an entire wrapping row.
2. If normal portrait at Large text has a positive band smaller than that activation element, allow the same minimize → answer → reopen fallback for answer controls only.

The owner accepts that reading.

## Revised input

Read only:

`MOBILE-CALCULATOR-ACTION-CLEARANCE-CODEX-WORK-ORDER-2026-09-16-R3.md`

R3 makes the following bounded changes:

- §3 records the owner decision that the Large-text fallback applies to answer controls only when the positive band is shorter than their activation element. Study action and top-bar controls still must remain uncovered.
- §4A defines the answer-control geometry target as its actual activation element: input, button, select, or clickable label/container where that is the real hit target. §5 geometry/hit sampling applies to that activation element rather than a larger wrapping row.
- §4B keeps the 6rem Default threshold and `band > 0` Large threshold. At Default, answer activation elements remain reachable with the sheet open. At Large, they remain open-sheet reachable when they fit; otherwise answer controls alone may use minimize → answer → reopen with calculator-state preservation.

Nothing else was intentionally reopened.

## Requested return

Return only one of:

`CALCULATOR_R3: ACCEPT`

or

`CALCULATOR_R3: <one concrete remaining transcription/logic defect>`

If R3 faithfully implements the defect and owner decision above, say ACCEPT and stop. Do not generate another optional-improvement round.
