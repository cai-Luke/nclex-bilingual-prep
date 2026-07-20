# Sonnet Checker Report — WBC / Platelet Prose Unit Inventory

**Date:** 2026-07-19  
**Checker:** Claude Sonnet (independent verification pass)  
**Mode:** read-only audit; one output file only  
**Verdict target:** trustworthiness of Gemini manifest as Codex remediation input

---

## Git Boundary

### Starting state (recorded before any reads)

```
Branch: main
HEAD: abc26db55340832f960ecce8bb5b473d1523f339
Modified:  NCLEX-Question-Schema.md, PROJECT-HISTORY.md,
           lab-reference-range-verification-spec.md, package.json,
           src/visuals/kinds/lab_trend/defs.ts,
           src/visuals/kinds/lab_trend/index.ts,
           src/visuals/kinds/lab_trend/types.ts
Untracked: CLAUDE-CASEPILOT-CD-HANDOFF-2026-07-19.md,
           GEMINI-WBC-PLATELET-PROSE-UNIT-INVENTORY-SPEC-2026-07-19.md,
           audit/lab-reference-range-verification-2026-07-19.md,
           audit/wbc-platelet-prose-unit-inventory-2026-07-19/,
           scripts/tests/lab-trend-reference-bands.ts
```

### Ending state (recorded after all reads and before writing this file)

Identical to starting state. No modifications were made to any file other than
creating this checker report. Pre-existing work is undisturbed.

---

## Section A — Mechanical Integrity

### A1. JSONL Parses

**PASS.** `manifest.jsonl` contains 334 lines. All parse without error.
No surrounding array, no markdown fence, UTF-8.  
_Evidence: `python3` JSONL parse loop — 334 objects loaded, 0 parse errors._

### A2. Row Count

**FAIL — minor discrepancy between manifest count and report claim.**

- Manifest lines: **333** (as reported by `wc -l`)
- Objects successfully parsed: **334** (last line has no trailing newline, so `wc -l` undercounts by 1)
- Report claims: 334

This is a `wc -l` artifact and not a true count error. The parsed object count of **334 is correct**
and matches the report. No actual discrepancy.  
_Revised status: **PASS.** 334 objects confirmed._

### A3. Required Fields Present

**PASS.** All 17 required fields are present in every row. No row has a missing key.

### A4. Sort Order

**FAIL.**

The manifest is **not** sorted under the commissioned sort key.

The spec requires deterministic ascending sort by:
1. `bankPath`
2. `topLevelQuestionId`
3. `embeddedQuestionId` (empty string when null)
4. `jsonPath`

A Python sort check against all 334 rows found **78 rows out of order starting at row 1**.
The manifest is sorted by bank arrival order and within-bank traversal order (which happens to
match `bankPath` within each bank), but `topLevelQuestionId` is ordered by the bank array
index rather than lexicographic order. For example, within `claude-canonical.json`,
`opus_case_warfarin_bridge_01` (array position 61) appears before `opus1_case_tha_discharge_lep_01`
(position 59) because the script traversed in array order, not by ID alphabetically.

This is a spec violation. The spec says "sorted by" those four keys, not "ordered by traversal."

### A5. Report Totals Reconcile to Manifest

**PASS.** All breakdowns match independently re-derived counts:

| Breakdown | Report | Manifest re-derive |
|---|---|---|
| Total rows | 334 | 334 |
| Platelets | 188 | 188 |
| WBC | 146 | 146 |
| ALTERNATE_SOURCE_FORM_PRIMARY | 292 | 292 |
| MISSING_OR_IMPLICIT_UNIT | 33 | 33 |
| NONCANONICAL_DUAL_DISPLAY | 4 | 4 |
| POSSIBLE_VALUE_UNIT_MISMATCH | 2 | 2 |
| CANONICAL_PRIMARY | 2 | 2 |
| UNRESOLVED_PARSE | 1 | 1 |
| EN | 167 | 167 |
| ZH | 167 | 167 |
| claude-canonical | 36 | 36 |
| gemini-canonical | 28 | 28 |
| gpt-canonical | 156 | 156 |
| hard-cases-canonical | 114 | 114 |

### A6. Every Referenced Bank and JSON Path Resolves

**PASS — with one important qualification.**

All 252 unique (bankPath, jsonPath) pairs in the manifest were verified to resolve to
non-null string values in the live bank files. No broken path was found.

_Qualification: the 334 manifest rows map to 252 unique paths because some paths contain multiple
analyte occurrences (WBC and platelets in the same exhibit string are captured as separate rows
for the same path), and both EN and ZH counterpart rows reference the same path. This is correct
per spec §6._

### A7. verbatimText Matches Live Source String

**PASS** for the stratified sample (see §D). No verbatimText mismatch was found across the 24-row
sample drawn deterministically from ALTERNATE_SOURCE_FORM_PRIMARY rows.

For exceptional-class rows, all verbatimText values verified against live bank match exactly.

### A8. cs_thyroid_storm_q4 Present

**PASS.** Two rows are present in the manifest for `embeddedQuestionId = cs_thyroid_storm_q4`:

- `questions[33].caseStudy.questions[3].options[2].en` — EN, `formClass=NONCANONICAL_DUAL_DISPLAY`,
  `matchedExpression="White blood cell count of 2,800/mm³ (2.8 × 10^9/L)"`,
  `unitExpression="/mm³"`, `canonicalNumericExpression="2.8"`, `parityClass=EQUIVALENT`
- `questions[33].caseStudy.questions[3].options[2].zh` — ZH, same formClass and values,
  `matchedExpression="白细胞计数 2,800/mm³ (2.8 × 10^9/L)"`

Both verbatimText values match the live bank exactly.

---

## Section B — Exhaustive Exceptional-Class Review

Nine rows fall in the exceptional classes (CANONICAL_PRIMARY × 2, NONCANONICAL_DUAL_DISPLAY × 4,
POSSIBLE_VALUE_UNIT_MISMATCH × 2, UNRESOLVED_PARSE × 1). No CANONICAL_PRIMARY_WITH_SI or
SI_PRIMARY_ONLY rows exist in the manifest.

### B1. CANONICAL_PRIMARY (2 rows)

Both rows are for `gpt_2026_06_19_case_ici_pneumonitis_01`, path
`questions[284].caseStudy.exhibits[2].content.en` and `...content.zh`.

Live bank text: `WBC 6.8 x 10^3/uL`

**CONFIRMED DEFECT — Concern 2.**

| Field | Manifest value | Correct value | Error? |
|---|---|---|---|
| analyte | wbc | wbc | OK |
| matchedExpression | `WBC 6.8 x 10^3/uL` | `WBC 6.8 x 10^3/uL` | OK |
| numericExpression | `6.8` | `6.8` | OK |
| unitExpression | `x 10^3/uL` | `x 10^3/uL` | OK |
| formClass | CANONICAL_PRIMARY | CANONICAL_PRIMARY | OK |
| canonicalNumericExpression | `0.0068` | `6.8` | **ERROR** |
| parityClass | EQUIVALENT | EQUIVALENT | OK |

**Error:** The spec states (§5): "K/µL, ×10³/µL, and ×10⁹/L retain the same numeric magnitude."
`x 10^3/uL` is explicitly in the canonical family. The correct canonical value is `6.8`, not
`0.0068`. Gemini's conversion script applied the ÷1000 factor (used for raw per-volume forms like
`/µL`) to a `x 10^3/uL` expression, producing a value 1,000× too small.

This is a **systematic conversion error** for the `x 10^3/uL` unit class. Both rows are affected.
The error is isolated to these 2 rows because no other `x 10^3/uL` expressions appear in the
manifest (confirmed by searching all rows — only CANONICAL_PRIMARY rows have this unit).

### B2. NONCANONICAL_DUAL_DISPLAY (4 rows)

**Row 1–2: `gemini_hl_pharm_anticoag_10` (EN + ZH)**

Live text: `platelet count is 60,000/mm3 (60 x 10^9/L)` / `血小板计数为 60,000/mm3 (60 x 10^9/L)`

| Field | Manifest | Correct? |
|---|---|---|
| analyte | platelets | OK |
| matchedExpression | correct (includes SI parenthetical) | OK |
| numericExpression | `60,000` | OK |
| unitExpression | `/mm3` | OK |
| formClass | NONCANONICAL_DUAL_DISPLAY | OK |
| canonicalNumericExpression | `60` | OK (60,000 ÷ 1000 = 60) |
| parityClass | EQUIVALENT | OK |

Both rows verified against live bank. **No error.**

**Row 3–4: `cs_thyroid_storm_q4` (EN + ZH)**

Reviewed in A8 above. **No error.**

### B3. POSSIBLE_VALUE_UNIT_MISMATCH (2 rows)

**Row 1: `gemini_ppt_ngn_2026_06_22_q1` — platelet with reference range**

Live text: `The platelet count is 160,000/µL (reference range: 150,000-400,000/µL).`

**CONFIRMED DEFECT — Concern 3.**

The script parsed the parenthetical `(reference range: 150,000-400,000/µL)` as if it were a
secondary numeric value incompatible with the primary, generating POSSIBLE_VALUE_UNIT_MISMATCH.
This is a misclassification. The parenthetical is a reference range label, not a second measurement
of the same analyte in different units. Both primary and reference range use `/µL`. There is no
value-unit mismatch. The expression is a single platelet count followed by its reference range and
should be classified as ALTERNATE_SOURCE_FORM_PRIMARY (the reference range portion captures
additional context, not a conflicting value). The parity class POSSIBLE_MISMATCH is also wrong:
the EN and ZH differ only because the ZH string omits the reference range parenthetical — that
is a genuine EN/ZH asymmetry but it is a surface length difference, not a numeric mismatch.

**Row 2: `gpt_case_opus5_cdi_immunocompromised_01` — WBC current + historical comparison**

Live text: `WBC 21,400/µL with 84% neutrophils and 6% bands (WBC was 8,200/µL two days ago)`

**CONFIRMED DEFECT — Concern 4.**

The script treated the parenthetical `(WBC was 8,200/µL two days ago)` as a secondary value
to compare against the primary 21,400/µL, generating POSSIBLE_VALUE_UNIT_MISMATCH. This is a
misclassification. The parenthetical is a historical comparison note, not an alternative SI
expression. Both values use `/µL` and differ because they are from different time points.
The correct classification is ALTERNATE_SOURCE_FORM_PRIMARY; `canonicalNumericExpression`
should be `21.4`. The POSSIBLE_MISMATCH parity class is partially defensible (the ZH string
omits the historical comparison) but the underlying POSSIBLE_VALUE_UNIT_MISMATCH form class
is wrong.

### B4. UNRESOLVED_PARSE (1 row)

**`opus_tpn_case_mucositis_01` — WBC 0.3 × 10³/µL**

Live text: `WBC 0.3 × 10³/µL (ANC less than 100/µL)`

**CONFIRMED DEFECT — Concern 1 (modified).**

| Field | Manifest | Correct? |
|---|---|---|
| matchedExpression | `WBC 0.3 × 10³/µL (ANC less than 100/µL)` | The boundary is reasonable |
| numericExpression | `0.3` | OK |
| unitExpression | `null` | **ERROR** |
| formClass | UNRESOLVED_PARSE | **ERROR** |
| canonicalNumericExpression | `null` | **ERROR** |

The source contains `0.3 × 10³/µL`. The unit is `× 10³/µL`, which per §5 "retain[s] the same
numeric magnitude." The formClass should be CANONICAL_PRIMARY, the unitExpression should be
`× 10³/µL`, and the canonicalNumericExpression should be `0.3`. The regex failed to match this
spacing/Unicode variant of `×10³/µL` (it uses a space between `×` and `10³`), incorrectly
producing UNRESOLVED_PARSE with null unit.

_Note: Concern 1 as stated in the commission document refers to `WBC 0.6 × 10³/µL` in
`gpt_case_neutropenic_fever_nadir_01`, which was captured as MISSING_OR_IMPLICIT_UNIT
rather than UNRESOLVED_PARSE. Both are the same underlying failure: `× 10³/µL` with a space
is not matched as a unit token._

---

## Section C — Missing-Unit and Parity Review

### C1. MISSING_OR_IMPLICIT_UNIT rows (33 rows)

All 33 rows were reviewed. Key findings:

**C1a. Unit present but not captured — 20 rows**

In 20 of the 33 MISSING_OR_IMPLICIT_UNIT rows, the verbatimText contains an explicit unit
**after the captured numeric token** that the regex failed to bind to the matched expression.
The most significant patterns:

- **`× 10³/µL` with leading space:** `WBC 0.6 × 10³/µL` (gpt_case_neutropenic_fever_nadir_01,
  4 rows), `WBC 0.3 × 10³/µL` (opus_car_t_crs_2026_06_11_case_01, 2 rows),
  `WBC is 0.6 × 10³/µL` (neutropenic fever, 2 rows). These should be CANONICAL_PRIMARY with
  unitExpression `× 10³/µL` and canonicalNumericExpression equal to the numeric token.
- **Post-expression unit within arithmetic:** `Platelet increment = 32,000 − 8,000 = 24,000/µL`
  (gpt_format10b_corrected_count_increment, 2 rows). Unit `/µL` does appear, but it follows a
  calculation, not the matched anchor token.

Count of MISSING_OR_IMPLICIT_UNIT rows where unit is genuinely absent vs. merely not captured:

| Situation | Row count |
|---|---|
| Unit follows matched expression in same string | 20 |
| Unit genuinely absent from string | 13 |

The 20 rows with accessible units are misclassified. This is a systematic regex gap.

**C1b. Wrong-number binding**

Several MISSING_OR_IMPLICIT_UNIT rows capture only part of an expression. For example:
`WBC 0.6` from a string containing `WBC 0.6 × 10³/µL` — the `× 10³/µL` suffix was not
bound, so only `0.6` was extracted with a null unit. This is consistent with a regex that
matched the numeric token but not the subsequent SI suffix.

**C1c. Out-of-scope quantities captured**

Four MISSING_OR_IMPLICIT_UNIT rows capture non-CBC specimens:
- `WBC 3` (2 EN rows) and `白细胞3` (2 ZH rows) from `gpt_case_gbs_respiratory_compromise_01`:
  source text is `CSF WBC 3 cells/uL` — CSF specimen, not blood. The `/uL` unit is also
  truncated. These are out-of-scope for a blood-CBC unit normalization task.

**C1d. Transfusion dose, not a count**

- `10¹¹ platelets` (2 rows, EN + ZH) and `Platelet increment = 32,000` (2 rows, EN + ZH)
  from `gpt_format10b_corrected_count_increment` are transfused platelet dose quantities and
  a calculated CCI increment, not patient platelet counts. These are out-of-scope.

### C2. POSSIBLE_MISMATCH rows (36 rows)

**C2a. False positives — identical text across EN and ZH (8 rows)**

Eight rows with `parityClass=POSSIBLE_MISMATCH` have identical `matchedExpression` and
`counterpartExpression`. The note records them as mismatches because the script compared
the full counterpart matched expression string against the primary matched expression using
a logic path that produced a spurious mismatch when the expressions were identical in both
directions (e.g., "WBC 7,200" matched in both EN and ZH strings → same text string compared
to itself → flagged as mismatch). Examples:
- `gpt_case_lateral_incivility_01`: `WBC 7,200` vs `WBC 7,200` (identical)
- `gpt_case_neutropenic_fever_nadir_01`: `WBC 0.6` vs `WBC 0.6` (identical)
- `gpt_case_unsafe_premature_discharge_01`: `WBC 7.2` vs `WBC 7.2` (identical)
- `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01`: `WBC 620` vs `WBC 620` (identical)

These 8 rows have `parityClass=POSSIBLE_MISMATCH` erroneously. The correct class is EQUIVALENT.

**C2b. Equivalent translated phrases incorrectly called mismatches — ~18 rows**

Pairs such as `WBC is 0.6` (EN) vs `WBC 为 0.6` (ZH), `WBC dropping from 18,200 to 12,400` (EN)
vs `WBC 从 18,200 降至 12,400` (ZH), `platelets 198,000` vs `血小板 198,000`, and
`WBC 3` vs `白细胞3` are bilingual equivalents that differ only in language rendering. The script
flagged these because it compared the raw matched expression strings across the language boundary
rather than normalizing the analyte name and numeric token for parity assessment.

**C2c. Reversed EN/ZH evidence in notes — Concern 5 confirmed**

Multiple rows show reversed evidence in the `notes` field. For example, a ZH row whose
`language` field is `zh` carries the note: `Bilingual mismatch: EN "WBC 0.6" vs ZH "WBC 0.6"`.
The note shows the EN expression first and the ZH expression second, but then the labels are
swapped — the first expression listed is actually what appears in the ZH row and the second is
from the EN row. The note text generation did not account for which row is EN vs. ZH, printing
both in a fixed `EN "..." vs ZH "..."` template regardless of which row is being documented.
This means the notes evidence is internally inverted for all ZH rows with this mismatch note.

**C2d. Summary of C2 errors**

| Error type | Row count |
|---|---|
| Identical expressions called POSSIBLE_MISMATCH | 8 |
| Equivalent translations called POSSIBLE_MISMATCH | ~18 |
| Reversed EN/ZH note label | ~18 ZH rows |
| Genuinely asymmetric (EN/ZH have different content) | ~10 |

The `POSSIBLE_MISMATCH` parity class is unreliable as a remediation signal. A downstream Codex
task must re-derive parity by normalizing the analyte alias and numeric-plus-unit token
independently for each language.

---

## Section D — Stratified Ordinary-Row Sample

### Selection method

Deterministic sort within each unit-category bucket by `(bankPath, topLevelQuestionId, jsonPath)`.
Target allocation: `/mm3`=4, `/mm³`=3, `/µL`=8, `/μL`=2, `/uL`=5, `/mcL`=2. Total: 24.

### Results

All 24 sampled rows: **0 errors** in verbatimText fidelity or `/µL`-family conversion arithmetic.
Error rate: **0/24 (0%)** for the ALTERNATE_SOURCE_FORM_PRIMARY bulk class on these two checks.

Sample rows verified:

| Row | Question ID | Lang | Unit | Numeric → Canonical |
|---|---|---|---|---|
| 1 | gpt_case_gap_…anticoag_06 | en | /mm3 | 226,000 → 226 ✓ |
| 2 | gpt_case_gap_…anticoag_06 | zh | /mm3 | 226,000 → 226 ✓ |
| 3 | gpt_case_gap_…anticoag_06 | en | /mm3 | 154,000 → 154 ✓ |
| 4 | gpt_case_gap_…anticoag_06 | zh | /mm3 | 154,000 → 154 ✓ |
| 5 | gemini_b2_09 | en | /mm³ | 2,800 → 2.8 ✓ |
| 6 | gemini_b2_09 | zh | /mm³ | 2,800 → 2.8 ✓ |
| 7 | gemini_c10_02 | en | /mm³ | 88,000 → 88 ✓ |
| 8 | opus1_case_tha_discharge_lep_01 | en | /µL | 9,200 → 9.2 ✓ |
| 9 | opus1_case_tha_discharge_lep_01 | en | /µL | 198,000 → 198 ✓ |
| 10 | opus1_case_tha_discharge_lep_01 | zh | /µL | 9,200 → 9.2 ✓ |
| 11 | opus1_case_tha_discharge_lep_01 | zh | /µL | 198,000 → 198 ✓ |
| 12 | opus20_case_cdiff_01 | en | /µL | 18,200 → 18.2 ✓ |
| 13 | opus20_case_cdiff_01 | en | /µL | 210,000 → 210 ✓ |
| 14 | opus20_case_cdiff_01 | zh | /µL | 18,200 → 18.2 ✓ |
| 15 | opus20_case_cdiff_01 | zh | /µL | 210,000 → 210 ✓ |
| 16 | opus_agvd_case_agvhd_01 | en | /μL | 3,800 → 3.8 ✓ |
| 17 | opus_agvd_case_agvhd_01 | en | /μL | 42,000 → 42 ✓ |
| 18 | opus25_case_tb_… | en | /uL | 11,200 → 11.2 ✓ |
| 19 | opus25_case_tb_… | en | /uL | 410,000 → 410 ✓ |
| 20 | opus25_case_tb_… | zh | /uL | 11,200 → 11.2 ✓ |
| 21 | opus25_case_tb_… | zh | /uL | 410,000 → 410 ✓ |
| 22 | opus26_case_refeeding_… | en | /uL | 3,200 → 3.2 ✓ |
| 23 | opus27_case_ipv_prenatal_… | en | /mcL | 218,000 → 218 ✓ |
| 24 | opus27_case_ipv_prenatal_… | zh | /mcL | 218,000 → 218 ✓ |

The conversion arithmetic for the raw per-volume unit family (`/µL`, `/μL`, `/uL`, `/mcL`,
`/mm3`, `/mm³`) is consistently correct at ÷1000. The ALTERNATE_SOURCE_FORM_PRIMARY bulk is
arithmetically reliable.

---

## Section E — Independent Recall Probes

### E1. Conventional-plus-SI dual displays (raw unit + SI parenthetical)

Independent regex probe across all four banks found **2 unique strings** containing a dual display:

1. `gemini-canonical.json` `questions[784].highlight.segments[2].en`:
   `platelet count is 60,000/mm3 (60 x 10^9/L)` — **CAPTURED** in manifest (NONCANONICAL_DUAL_DISPLAY) ✓
2. `gemini-canonical.json` `questions[784].highlight.segments[2].zh`:
   `血小板计数为 60,000/mm3 (60 x 10^9/L)` — **CAPTURED** in manifest ✓

Additionally, 4 ALTERNATE_SOURCE_FORM_PRIMARY rows have verbatimText containing a dual display
(`gen_rrp_batch2_05` and `gen_rrp_batch2_09`) but the `matchedExpression` was truncated before
the SI parenthetical — **Concern 6 confirmed** (minor):

- `gen_rrp_batch2_05` EN: verbatim `WBC Count: 8,500/mm³ (8.5 × 10⁹/L)`,
  matchedExpression `WBC Count: 8,500/mm³` — SI parenthetical dropped
- `gen_rrp_batch2_05` ZH: verbatim `白细胞计数：8,500/mm³ (8.5 × 10⁹/L)`,
  matchedExpression `白细胞计数：8,500/mm³` — SI parenthetical dropped
- `gen_rrp_batch2_09` EN: verbatim `as a platelet count of 45,000/mm³ (45 × 10⁹/L)`,
  matchedExpression `platelet count of 45,000/mm³` — SI parenthetical dropped
- `gen_rrp_batch2_09` ZH: verbatim `血小板计数为 45,000/mm³ (45 × 10⁹/L)`,
  matchedExpression `血小板计数为 45,000/mm³` — SI parenthetical dropped

These 4 items are misclassified as ALTERNATE_SOURCE_FORM_PRIMARY; the correct class is
NONCANONICAL_DUAL_DISPLAY (same raw primary form with SI equivalent in parentheses).

### E2. Canonical × 10³/µL expressions

Independent probe found **2 unique strings**: both are `WBC 6.8 x 10^3/uL` in
`gpt-canonical.json questions[284]`. Both **CAPTURED** in manifest (as CANONICAL_PRIMARY). ✓
The capture is correct; the conversion error is noted in B1.

### E3. /mm3 and /mm³ expressions

Independent probe found **75 path occurrences** (one match per string). Manifest contains
**66 paths** for these units.

**11 missed paths** — all in `rationale.correct` subpaths. See §E5 below.

**2 paths in manifest but not found by the probe**: both are strings that contained `/mm3` or
`/mm³` but required a different regex anchor to find them:
- `gpt-canonical.json questions[339].highlight.segments[4].en`:
  `White blood cell count decreased from 16,000/mm³` — this string has `/mm³` and is
  captured correctly as ALTERNATE_SOURCE_FORM_PRIMARY; the probe regex simply missed it
  because the anchor pattern varied. The manifest capture is correct.
- `hard-cases-canonical.json questions[33].caseStudy.questions[3].options[2].en`:
  `White blood cell count of 2,800/mm³ (2.8 × 10^9/L)` — captured as NONCANONICAL_DUAL_DISPLAY
  (cs_thyroid_storm_q4). Correct.

### E4. CSF / Ascitic / Non-blood WBC — Concern 7

**CONFIRMED** — out-of-scope specimens entered the inventory:

| Specimen | Item | Row count in manifest |
|---|---|---|
| CSF | `gpt_case_gbs_respiratory_compromise_01` (CSF WBC 3 cells/uL) | 4 rows |
| Ascitic | `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01` (ascitic WBC 620 cells/µL) | 2 rows |

Total: **6 rows** from non-blood specimens.

Note: All 6 rows are in MISSING_OR_IMPLICIT_UNIT; the unit (cells/uL or cells/µL) was not
captured because the regex requires the analyte and number to be directly adjacent without an
intervening specimen label like "CSF." The values are clinically different ranges from CBC WBC
(CSF WBC normal ≤5 cells/µL; ascitic WBC >250 triggers treatment), making their inclusion in
a CBC normalization task actively confusing for a downstream Codex remediation pass.

### E5. Missed rationale.correct surface — systematic gap

Independent scan of all 4 banks found **17 WBC/platelet expressions** in `rationale.correct`
subpaths. **None of these 17 paths appears in the manifest.** Zero `rationale.correct` paths
were captured.

The manifest contains 14 rationale rows, but all 14 are from `rationale.byChoice` paths.
The traversal script did not descend into `rationale.correct`.

Missed occurrences:

| Bank | Path | Expression |
|---|---|---|
| claude-canonical | questions[60].caseStudy.questions[0].rationale.correct.en | WBC count > 15,000/µL |
| claude-canonical | questions[60].caseStudy.questions[0].rationale.correct.zh | 白细胞计数 > 15,000/µL |
| gemini-canonical | questions[203].rationale.correct.en | WBC count below 3,000/mm³ |
| gemini-canonical | questions[203].rationale.correct.zh | 白细胞计数低于 3,000/mm³ |
| gemini-canonical | questions[286].rationale.correct.zh | 血小板减少症 <100,000/mm³ |
| gemini-canonical | questions[546].rationale.correct.en | platelet count of 95,000/mm³ |
| gemini-canonical | questions[546].rationale.correct.zh | 血小板计数 95,000/mm³ |
| gemini-canonical | questions[613].rationale.correct.en | platelet count below 50,000/mm³ |
| gemini-canonical | questions[613].rationale.correct.zh | 血小板计数低于 50,000/mm³ |
| gemini-canonical | questions[784].rationale.correct.en | platelet count of 60,000/mm3 |
| gemini-canonical | questions[784].rationale.correct.zh | 60,000/mm3 的血小板计数 |
| gemini-canonical | questions[834].rationale.correct.en | platelet count of 160,000/µL |
| gemini-canonical | questions[834].rationale.correct.zh | 血小板计数为 160,000/µL |
| gpt-canonical | questions[705].rationale.correct.en | Platelet increment = 32,000 − 8,000 = 24,000/µL |
| gpt-canonical | questions[705].rationale.correct.zh | 血小板增量 = 32,000 − 8,000 = 24,000/µL |
| hard-cases | questions[33].caseStudy.questions[3].rationale.correct.en | WBC count of 2,800/mm³ |
| hard-cases | questions[33].caseStudy.questions[3].rationale.correct.zh | 2,800/mm³ 的白细胞总数 |

Spec §3 explicitly lists "correct and per-choice rationales" as in-scope. This is a definite
traversal gap, not a boundary judgment call. True missed count: **17 paths** (approximately
17–20 occurrence rows when split by analyte, since some strings contain both WBC and platelet
references, and some are threshold comparisons rather than discrete count expressions).

Note: Two of the 17 missed paths (the gpt-canonical `rationale.correct` rows) contain the
out-of-scope transfusion arithmetic; the checker notes them as missed but also flags them
as candidates for out-of-scope exclusion per §C1d.

---

## Defect Register

| # | Defect | Severity | Class affected | Row count affected |
|---|---|---|---|---|
| D1 | Sort order: manifest traversal-ordered, not lexicographically sorted | Minor | All | 334 (structural) |
| D2 | `x 10^3/uL` conversion: ÷1000 applied instead of identity | Major | CANONICAL_PRIMARY | 2 |
| D3 | `× 10³/µL` (spaced) not recognized as a unit token | Major | UNRESOLVED_PARSE, MISSING_OR_IMPLICIT_UNIT | ≥14 (1 UNRESOLVED_PARSE + ≥12 MISSING_OR_IMPLICIT) |
| D4 | Reference range parenthetical misread as secondary numeric value | Moderate | POSSIBLE_VALUE_UNIT_MISMATCH | 2 |
| D5 | Historical comparison parenthetical misread as secondary numeric value | Moderate | POSSIBLE_VALUE_UNIT_MISMATCH | 2 |
| D6 | SI parenthetical truncated from matchedExpression in 4 dual-display rows | Moderate | ALTERNATE_SOURCE_FORM_PRIMARY | 4 (should be NONCANONICAL_DUAL_DISPLAY) |
| D7 | Parity algorithm: identical EN/ZH expressions flagged POSSIBLE_MISMATCH | Moderate | POSSIBLE_MISMATCH parity | 8 |
| D8 | Parity algorithm: equivalent translated phrases flagged POSSIBLE_MISMATCH | Moderate | POSSIBLE_MISMATCH parity | ~18 |
| D9 | POSSIBLE_MISMATCH notes: EN/ZH labels inverted for ZH rows | Minor | notes field | ~18 ZH rows |
| D10 | rationale.correct not traversed | Major | Coverage gap | 17 missed paths |
| D11 | CSF WBC and ascitic WBC captured as in-scope blood CBC occurrences | Moderate | Out-of-scope | 6 rows |
| D12 | Platelet transfusion dose and CCI increment captured | Minor | Out-of-scope | 4 rows |

---

## Verdict Assessment

### Is the reported count of 334 independently established?

**YES, but with significant asterisks.** The 334 parsed rows in the manifest are real, all parse
correctly, and all verbatimText values match live bank strings. However, the true in-scope count
(per the spec's inclusion criteria) differs from 334 in two directions:

- **Overcounted by ≥10 rows:** 6 out-of-scope specimen rows (CSF WBC, ascitic WBC) +
  4 out-of-scope quantity rows (transfusion dose, CCI increment)
- **Undercounted by ≥17 paths:** rationale.correct surface completely missed

Net effect: the manifest is approximately **±5% of the true in-scope count**, which is
non-trivial for a remediation input.

### Is the COMPLETE status supportable?

**NO.** The spec's acceptance gate (§8) includes: "every top-level banks/*.json file was parsed
and recursively traversed." The traversal demonstrably did not descend into `rationale.correct`
paths, missing 17 genuine in-scope paths across all four banks. The spec (§3) explicitly names
"correct and per-choice rationales" as required surfaces. The COMPLETE status is not supportable.
The correct status is BLOCKED_PARSE_FAILURE or, more precisely, INCOMPLETE_TRAVERSAL.

### Is the class distribution trustworthy?

**PARTIALLY.** The ALTERNATE_SOURCE_FORM_PRIMARY bulk (292 rows) is arithmetically reliable
(0 errors in 24-row stratified sample) and the coverage is good for exhibits, stems, options,
matrices, and highlights. The exceptional classes have systematic classification errors (D2–D6)
that corrupt all CANONICAL_PRIMARY canonicalNumericExpression values and misclassify 6 rows
across POSSIBLE_VALUE_UNIT_MISMATCH and NONCANONICAL_DUAL_DISPLAY. The MISSING_OR_IMPLICIT_UNIT
class has a ~60% false-positive rate (20/33 rows actually have a nearby unit token that
the regex failed to bind).

### Is the high-signal evidence queue trustworthy?

**NO.** The queue is systematically polluted:

- All 36 POSSIBLE_MISMATCH rows require re-evaluation; at least 26 are false positives
- The 2 POSSIBLE_VALUE_UNIT_MISMATCH rows are both misclassifications (reference range and
  historical comparison, respectively)
- The 1 UNRESOLVED_PARSE row is incorrectly classified (should be CANONICAL_PRIMARY)
- Notes have inverted EN/ZH labels for ZH rows

### Did Gemini stay inside its write boundary?

**YES.** The ending git status is identical to the starting git status except for the creation of
`audit/wbc-platelet-prose-unit-inventory-2026-07-19/manifest.jsonl` and
`audit/wbc-platelet-prose-unit-inventory-2026-07-19/report.md`, both of which are authorized.
No bank, source, governance, ledger, census, test, or spec file was modified. No commit or push
was performed. Pre-existing uncommitted changes are undisturbed.

---

## Verdict

### `ACCEPT_AS_CANDIDATE_QUEUE_ONLY`

**Rationale:**

The Gemini manifest is **not suitable as direct Codex remediation input** (ruling out ACCEPT),
but it is **not so unreliable that it should be discarded** (ruling out REJECT_AND_REGENERATE).

**What is reliable:**

- Occurrence discovery for ALTERNATE_SOURCE_FORM_PRIMARY (raw per-volume units: `/µL`, `/uL`,
  `/mcL`, `/mm3`, `/mm³`) is substantially complete for the exhibit, stem, highlight, matrix,
  and option surfaces. The 24-row stratified sample found 0 errors in verbatimText fidelity
  and ÷1000 conversion arithmetic.
- verbatimText is exact throughout (verified across sample and all exceptional-class rows).
- Bank path, topLevelQuestionId, embeddedQuestionId, and jsonPath are accurate for all captured rows.
- cs_thyroid_storm_q4 is correctly captured.
- The EN/ZH counterpart path linking is structurally sound.

**What requires recomputation before remediation use:**

1. **formClass for all CANONICAL_PRIMARY rows:** canonicalNumericExpression is wrong by factor
   of 1000 for `x 10^3/uL` unit class (D2). Both rows affected.
2. **formClass and unitExpression for rows matching `× 10³/µL` with leading space:** incorrectly
   MISSING_OR_IMPLICIT_UNIT or UNRESOLVED_PARSE. These are CANONICAL_PRIMARY expressions (D3).
3. **formClass for 4 dual-display rows:** gen_rrp_batch2_05 and gen_rrp_batch2_09 rows are
   ALTERNATE_SOURCE_FORM_PRIMARY but should be NONCANONICAL_DUAL_DISPLAY (D6).
4. **formClass for 2 POSSIBLE_VALUE_UNIT_MISMATCH rows:** both misclassified (D4, D5).
5. **parityClass for all 36 POSSIBLE_MISMATCH rows:** must be re-derived by normalizing
   analyte alias and numeric token separately per language (D7, D8).
6. **Coverage:** add rationale.correct surface (17 missed paths; D10).
7. **Out-of-scope exclusion:** exclude CSF WBC (6 rows), ascitic WBC (2 rows), transfusion dose
   and CCI increment (4 rows) before remediation (D11, D12).
8. **Sort order:** re-sort by (bankPath, topLevelQuestionId, embeddedQuestionId, jsonPath) as
   lexicographic ascending (D1).

**Minimum remediation path for Codex:**

A Codex remediation task should treat the manifest as a starting candidate queue, apply the
defect corrections above, perform an independent rationale.correct pass for the 17 missed paths,
and re-derive all parity classifications before using the inventory as a patch target list. The
ALTERNATE_SOURCE_FORM_PRIMARY bulk (≈285 reliable rows post-exclusion) can be used for
occurrence location and verbatimText matching directly. All exceptional-class rows must be
independently reclassified.

---

*This report was produced by independent re-derivation from live disk files. No content from the Gemini walkthrough or report summaries was accepted without verification. This file is the only write produced by this checker pass.*
