# Campaign 16 Phase E Residual-192 R2 — blocked calibration closeout

Terminal: **CAMPAIGN16_PHASE_E_RESIDUAL_192_BLOCKED_ADMISSION_EXHAUSTED**

- Frozen work-order SHA-256: `a957e1c95a72458d11154f780228723704ee64f5355fb9b017df1495e57a5da5`
- Final `r2-cal-a-superseding-2` semantic return passed every Phase T gate and Phase R assertion, with zero duplicate, missing/foreign-key, or filler-basis rows.
- All three positive controls and their loci passed. The negative control was returned `LEAK`, producing one `NEGATIVE_FALSE_POSITIVE` and voiding the packet.
- This was semantic redispatch cycle 2, the final permitted cycle for the same 9 live rows. Their exact identities and attempt histories are frozen in `admitted/unresolved-roster.jsonl`.
- Conservative dispatch accounting: `D_cal = 6`, including one zero-inference authentication receipt; inference-bearing dispatches: 5; `D_main = 0`; total cost: `$19.714722`.
- `calibration-report.json` and the calibration-ready terminal were not emitted. No main-pass packet was created or dispatched.
