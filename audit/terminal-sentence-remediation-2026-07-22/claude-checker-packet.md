# Independent Claude Checker Packet

Commission: terminal-sentence remediation, content-gated stage

Producer: Codex (`gpt-5.6-sol`)

Required checker family: Claude

Status: **READY_FOR_INDEPENDENT_CHECK**

## Checker contract

Review every row independently against live bank context, the controlling owner authorization, the implementation specification, and the cited source lane. Return exactly one disposition per queue:

- `APPROVE_FOR_APPLY`
- `REVISE`
- `RETURN_TO_OWNER`

`REVISE` returns only that row. `RETURN_TO_OWNER` stops only that row unless safe bank-level separation is impossible. Do not approve a row merely because its patch dry-runs. Judge bilingual meaning, clinical/source sufficiency, key uniqueness, construct integrity, learner-facing naturalness, and all stated invariants.

The normative exact before/after values and paths are the typed constants and `setValue` operations in these machine-dry-run annexes:

- `scripts/patches/2026-07-22-terminal-sentence-content-gated-claude.ts`
- `scripts/patches/2026-07-22-terminal-sentence-content-gated-gemini.ts`
- `scripts/patches/2026-07-22-terminal-sentence-content-gated-gpt.ts`
- Harness: `scripts/patches/terminal-sentence-content-gated-runner.ts`

All three annexes pass an isolated-copy dry run and structural validation. They have **not** been applied to the live banks.

## Live-disk discrepancy requiring checker awareness

The controlling documents call `gpt_case_clozapine_toxicity_01` a five-part case. Live disk contains six embedded parts, `q1` through `q6`. The proposed patch preserves all six, changes only the Stage-2 exhibit state and `q5` stem, and neither adds nor removes a part. Treat “preserve the five-part case” as a count error and apply the preservation rule to all six live parts. If that interpretation is unacceptable, return queue 1731 as `RETURN_TO_OWNER`; do not approve removal of any part.

## Row manifest

| Queue | Stable id | Proposed operation | Exact patch paths | Required invariance |
|---:|---|---|---|---|
| 147 | `opus_case_lithium_toxicity_01` | Neutral presenting stem; remove optional mechanism-revealing summary | `stem`; `caseStudy.summary` → absent | Title, exhibits, stages, all six embedded questions, keys, and rationales unchanged |
| 922 | `gap_50_sic_09` | Replace placeholder-bearing ordinary stem with neutral post-injection disposal setup | `stem` | `clozeStem`, dropdowns/options/correct, rationale unchanged |
| 1103 | `gemini_hpm_ngn_2026_06_22_q3` | Replace ordinary stem with neutral 18-month car-seat review setup | `stem` | `clozeStem`, dropdown bindings/options/correct, rationale unchanged |
| 1108 | `gemini_hpm_ngn_2026_06_22_q8` | Replace ordinary stem with neutral infant safe-sleep setup | `stem` | `clozeStem`, dropdown bindings/options/correct, rationale unchanged |
| 1486 | `gpt_gap_jun11_fib_scabies_precautions_03` | Remove raw blank tokens from ordinary stem while preserving precaution type and post-treatment interval demands | `stem` | `blanks[]`, acceptable answers, numeric binding, key/rationale unchanged |
| 1492 | `gpt_gap_jun11_fib_lung_cancer_screening_03` | Remove raw blank tokens from ordinary stem while preserving pack-year and upper-age demands | `stem` | `blanks[]`, acceptable answers, numeric bindings, key/rationale unchanged |
| 2176 | `gpt_format10b_free_water_deficit` | Delete authorial scope sentence | `stem` | Formula, values, blank/key, rationale/source unchanged |
| 2178 | `gpt_format10b_rapid_shallow_breathing_index` | Delete authorial scope sentence; clinical caution remains in rationale | `stem` | Formula, values, blank/key, rationale/source unchanged |
| 2185 | `gpt_format8a_haloperidol_qtcf` | Delete authorial scope sentence; medication-decision caution remains in rationale | `stem` | Formula, values, blank/key, rationale/source unchanged |
| 2190 | `gpt_format8a_pf_ratio` | Delete authorial scope sentence; ARDS diagnostic caution remains in rationale | `stem` | Formula, values, blank/key, rationale/source unchanged |
| 2219 | `gpt_format9c_pn_peripheral_central_access` | Naturalize stem and move context-specific 900 mOsm/L caution into rationale | `stem`; `rationale.correct` | `clozeStem`, dropdowns/options/correct, remaining rationale/source unchanged |
| 2231 | `gpt_format11b_pediatric_oxygenation_index` | Naturalize stem and move non-standalone interpretation caution into rationale | `stem`; `rationale.correct` | Formula, values, blank/key, remaining rationale/source unchanged |
| 2238 | `gpt_format11c_water_deprivation_desmopressin_interpretation` | Delete authorial exclusion sentence | `stem` | Data, `clozeStem`, dropdowns/options/correct, rationale/source unchanged |
| 735 | `trad_batchC_25` | Normalize the Chinese identity to `《健康人民 2030》（Healthy People 2030）`; remove translator commentary | `stem.zh`; `rationale.correct.zh` | English fields, options, key, glossary, strategy, all other content unchanged |
| 1731 | `gpt_case_clozapine_toxicity_01` / `_q5` | Mark neutropenic precautions as already initiated in Stage 2; ask only for remaining serial actions | `caseStudy.stages[id=stage_2].exhibits[id=day18_assessment].content.{en,zh}`; `caseStudy.questions[id=..._q5].stem` | All six live parts retained; `q5` remains ordered response; options and `A,B,C,D,E` key unchanged; all other case content unchanged |
| 2123 | `gpt_balance6a_2026_07_16_mx_discharge_planning_handoff_09` | Remove bedside-tube-verification construct commentary | `stem` | All eight rows remain transition-readiness elements; matrix columns/key/rationale/source unchanged |
| 2228 | `gpt_format11b_retinal_detachment_emergency_cues` | Remove construction commentary and rewrite record segments into atomic clinical statements | `stem`; `highlight.segments[id=s0..s7].{en,zh}` | Highlight key remains exactly `s1,s2,s3,s4,s5`; item type, rationale, source unchanged |

## Source lane

Sources are for checker verification, not permission to broaden any patch:

- 147: no new clinical claim is introduced. Existing promotion provenance is recorded in `BANK-REVIEW-LEDGER.md` under the 2026-06-15 lithium-toxicity entry.
- 922: OSHA Bloodborne Pathogens and Needlestick Prevention, https://www.osha.gov/bloodborne-pathogens; CDC injection-safety/sharps guidance, https://www.cdc.gov/injection-safety/hcp/clinical-safety/
- 1103: American Academy of Pediatrics, car-seat installation guidance, https://www.healthychildren.org/English/safety-prevention/on-the-go/Pages/Car-Safety-Seats-Information-for-Families.aspx
- 1108: American Academy of Pediatrics 2022 safe-sleep policy statement, https://publications.aap.org/pediatrics/article/150/1/e2022057990/188304/
- 1486: CDC institutional scabies control guidance, https://www.cdc.gov/scabies/php/public-health-strategy/index.html
- 1492: USPSTF lung-cancer screening recommendation, https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening
- 2176: Merck Manual Professional, hypernatremia/free-water deficit, https://www.merckmanuals.com/professional/nephrology/electrolyte-disorders/hypernatremia
- 2178: AARC 2024 spontaneous-breathing-trial guideline, https://www.aarc.org/wp-content/uploads/2024/06/cpg-sbt-2024.pdf
- 2185: FDA ICH E14 QT/QTc guidance, https://www.fda.gov/media/71372/download; current DailyMed haloperidol decanoate label, https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=8ffac6fb-1702-40d6-b085-152d24673cbd
- 2190: Global ARDS definition, https://doi.org/10.1164/rccm.202303-0558WS
- 2219: ASPEN PN vascular-access/osmolarity educational source, https://nutritioncare.org/wp-content/uploads/2025/04/Back-to-Basics_Parenteral-Nutrition-101_Glanz.pdf
- 2231: PALICC-2 executive summary, https://pmc.ncbi.nlm.nih.gov/articles/PMC9848214/
- 2238: Endotext diagnostic testing for diabetes insipidus, https://www.ncbi.nlm.nih.gov/books/NBK537591/
- 735: Healthy People 2030 framework, https://health.gov/healthypeople/about/healthy-people-2030-framework
- 1731: existing case evidence and facility protocol remain controlling; no threshold, dose, key, or treatment-order claim is changed. Review the complete live six-part case and its existing promotion provenance in `BANK-REVIEW-LEDGER.md`.
- 2123: NICE CG32 home-enteral support, https://www.nice.org.uk/guidance/CG32/chapter/recommendations
- 2228: National Eye Institute retinal-detachment symptoms and urgency, https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/retinal-detachment

## Mechanical evidence

The dry-run harness proves, per bank:

1. every declared path matches its exact live `before` value;
2. the isolated patched copy reaches every exact `after` value;
3. structural bank validation passes;
4. all fields outside the declared paths remain byte-identical as JSON values;
5. WU-4 ordinary stems are non-empty, placeholder-free, and distinct from `clozeStem`;
6. WU-5 ordinary stems are placeholder-free and `blanks[]` is outside the mutation surface;
7. WU-6 stems contain no listed self-referential framing;
8. queue 1731 retains all six live parts and the `q5` key;
9. queue 2123 retains its matrix and key;
10. queue 2228 retains the exact highlight key.

Queue 735 intentionally edits Chinese only because the English identity is already correct. Its two parity warnings are expected and explicitly tagged `INTENTIONAL_SINGLE_LOCALE_REPAIR`.

## Required output

Return one JSON line per row, in the manifest order above, with:

`queue`, `id`, `checkerModel`, `disposition`, `bilingualAssessment`, `clinicalAndSourceAssessment`, `constructAndKeyAssessment`, `invarianceAssessment`, `reason`

Do not combine rows and do not apply any patch.
