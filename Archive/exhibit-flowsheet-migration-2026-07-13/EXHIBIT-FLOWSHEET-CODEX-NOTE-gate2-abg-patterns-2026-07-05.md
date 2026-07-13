# Exhibit Flowsheet — Codex Note: GATE 2 has no completeness patterns for ABG keys

Date: 2026-07-05. From: Claude (batch-13 adjudication). For: Codex (gate/code seat).
Status: Resolved 2026-07-06 by adding GATE 2 patterns for `ph`, `paco2`, `pao2`, and `hco3_abg`
plus regression coverage.

## Finding

`scripts/exhibit-flowsheet-gate.ts`'s `LABEL_PATTERNS` table (the GATE 2 advisory completeness sweep)
has no entries for `pao2`, `paco2`, or `hco3_abg`, even though all three are registry keys
(`src/visuals/kinds/lab_trend/defs.ts`). Confirmed in batch 13: `gpt_case_major_burn_inhalation_fluid_
creep_01/baseline_labs` omitted `PaO2 68 mmHg` from an ABG panel ("pH 7.32, PaCO2 32 mmHg, **PaO2 68
mmHg**, HCO3 20 mEq/L, lactate 4.2 mmol/L") — a real, explicit-unit, in-scope value, missed on
extraction. Because there's no `pao2` pattern, GATE 2 raised no "source mentions 'pao2' but it is
neither keyed nor excluded" advisory the way it did for the batch-12 WBC/Hct case, so there was no
mechanical signal to prompt a second look.

## Fix

Add label patterns for ABG keys. Codex also found that `ph` did not actually have a GATE 2 pattern
yet, despite the assumption in this note, so the implemented patch should include it too:

```
{ key: "ph",       re: /\bpH\b/g },
{ key: "paco2",    re: /\bPaCO2\b|\bPaCO₂\b/gi },
{ key: "pao2",     re: /\bPaO2\b|\bPaO₂\b/gi },
{ key: "hco3_abg", re: /\bHCO3\b|\bHCO₃\b/gi },
```

Note `hco3_abg` and `bicarbonate` (BMP) share the same textual token (`HCO3`/`bicarbonate` is a
separate serum-chemistry pattern already in the table) — this is fine, since GATE 2 only checks
whether *some* accounting exists for a hit, and ABG panels and BMP panels don't typically appear in
the same sourceSpan; if they ever do, the existing `hco3`/`bicarbonate` ambiguity is no worse than
today's calcium/ionized-calcium overlap, which the gate already handles via the qualifier lookaround
rather than the label-pattern layer.

## Priority

Low — advisory only, and this specific instance is already flagged for re-extraction independently
(see `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-13-ADJUDICATION-2026-07-05.md`). Worth landing opportunistically
since it strengthens the mechanical net against the same class of miss recurring in the `scattered`
bucket's remaining ABG-bearing panels, but not a throughput blocker.
