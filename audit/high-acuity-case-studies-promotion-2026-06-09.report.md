# High-Acuity Case Studies Promotion Audit — 2026-06-09

**Reviewer:** Claude (cross-model review)  
**Source files:** `banks/banks-raw/gem-merged.json`, `banks/banks-raw/high-acuity-case-studies-raw.json`  
**Destination:** `banks/hard-cases-canonical.json`  
**Schema:** v1.1 → **v1.2** (bumped due to `vitals_trend` visual in thyroid storm case)  
**Final count:** 42 → **46**

---

## Promoted Cases (4)

### 1. `cs_thyroid_storm_main` — Thyroid Storm
**Source:** `banks/banks-raw/gem-merged.json`  
**Embedded parts:** `cs_thyroid_storm_q1` – `cs_thyroid_storm_q4`  
**Item types:** matrix, ordered_response, select_all, multiple_choice  
**Visual:** `vitals_trend` (HR + Temp trend from 0800 to 1200)

**Clinical content check (passed):**
- Pharmacology sequence (propranolol → PTU → Lugol's iodine → hydrocortisone) is correct per current endocrine crisis management. The critical teaching point — iodine must be given 1–2 hours *after* PTU to prevent using iodine as substrate for new hormone synthesis — is accurately and prominently stated.
- Aspirin contraindication in thyroid storm (salicylates displace thyroid hormone from binding proteins) is correctly identified and explained.
- PTU-induced agranulocytosis watchpoint: WBC 2,800/mm³ correctly keyed as the critical lab finding.
- Free T4 remaining elevated despite PTU correctly labeled as an expected finding at this time point (days required for circulating levels to fall).

**Promotion fixes applied:**
- `timepointsHr: [0, 1, 2, 4]` → `time: {unit: "hr", values: [0, 1, 2, 4]}` (deprecated field replaced per schema v1.2 standard).
- All `topic` fields Title-Cased: "thyroid storm" → "Thyroid Storm", etc.

**Bilingual check:** All stems, options, rationales, testTakingStrategy, and glossary entries carry both `en` and `zh` fields. Chinese translations verified fluent and medically accurate.

---

### 2. `cs_adhf_pulm_edema_01` — Acute Decompensated Heart Failure with Pulmonary Edema
**Source:** `banks/banks-raw/high-acuity-case-studies-raw.json`  
**Embedded parts:** `cs_adhf_pulm_edema_01_part_1` – `cs_adhf_pulm_edema_01_part_4`  
**Item types:** select_all, ordered_response, dropdown_cloze, multiple_choice

**Clinical content check (passed):**
- Classic ADHF/pulmonary edema cue recognition (SpO2 85%, bilateral crackles, S3 gallop, tripod position) is correctly keyed. Hypertension and atrial fibrillation correctly excluded as non-specific to alveolar fluid accumulation.
- Intervention sequence (upright positioning → O2 via NRB → IV access → IV furosemide) is correct: positioning is the fastest non-invasive preload reducer; oxygen addresses critical hypoxemia; IV access precedes medications.
- Clinical hypothesis (cardiogenic pulmonary edema from medication non-adherence) is correctly reasoned against available case data.
- Furosemide effectiveness keyed to urine output (direct pharmacological mechanism), not BP or HR (secondary effects). Clinically sound.

**Promotion fixes applied:** None required beyond confirming topic Title-Case (already Title-Cased in source).

**Bilingual check:** Passes. All bilingual fields present and medically accurate.

---

### 3. `cs_stemi_vfib_04` — Acute Myocardial Infarction and Ventricular Fibrillation
**Source:** `banks/banks-raw/high-acuity-case-studies-raw.json`  
**Embedded parts:** `cs_stemi_vfib_04_part_1` – `cs_stemi_vfib_04_part_4`  
**Item types:** select_all, ordered_response, matrix, multiple_choice

**AHA ACLS / cardiac-arrest source check (passed):**
- Part 1: Anterior STEMI localization to V1–V4 / LAD territory is correct. Diaphoresis and tachycardia keyed as sympathetic activation signs; SpO2 92% correctly excluded as non-specific to sympathetic activation. ✓
- Part 2 (ACLS arrest sequence): Call for help + defibrillator → CPR → unsynchronized defibrillation → epinephrine. Matches 2020 AHA BLS/ACLS chain of survival for witnessed VF. Critically correct: defibrillation is unsynchronized (not synchronized cardioversion) for VF/pulseless VT. ✓
- Part 3 (pharmacology matrix): Amiodarone = antiarrhythmic, Epinephrine = vasopressor, Aspirin = antiplatelet, Nitroglycerin = vasodilator. All correct per ACLS pharmacology. ✓
- Part 4 (ROSC indicator): PETCO2 spike to 40 mmHg correctly identified as earliest, most reliable non-invasive ROSC indicator. Organized rhythm without pulse correctly described as PEA (not ROSC). ✓

**Promotion fixes applied:** None required. AHA sourced content confirmed correct.

**Bilingual check:** Passes. Chinese glossary terms (心室颤动, 除颤, STEMI定义) accurate.

---

### 4. `cs_sepsis_shock_01` — Septic Shock from Urosepsis
**Source:** `banks/banks-raw/high-acuity-case-studies-raw.json`  
**Embedded parts:** `cs_sepsis_shock_01_part_1` – `cs_sepsis_shock_01_part_4`  
**Item types:** matrix, ordered_response, select_all, multiple_choice

**Clinical content check (passed):**
- Part 2 (sepsis bundle sequence): fluid resuscitation (30 mL/kg) → cultures → antibiotics → vasopressors. Matches Surviving Sepsis Campaign 1-hour bundle. Cultures before antibiotics correct (to preserve microorganism identification); both within 1-hour window. ✓
- Part 3 (improvement indicators): MAP ≥65, UO ≥0.5 mL/kg/hr, improved mental status, decreasing lactate — all established sepsis resuscitation endpoints. Cool/clammy skin correctly identified as worsening. ✓
- Part 4 (vasopressin rationale): Catecholamine-sparing effect of vasopressin (V1 receptor, different mechanism from NE alpha-agonism) correctly explained. ✓

**Promotion fixes applied (SIRS framing softened):**
- Part 1 stem: "systemic inflammatory response syndrome (SIRS)" → "classic SIRS criteria (a foundational infection-response framework still tested on the NCLEX-RN)" to acknowledge the framework's historical basis.
- Part 1 column c1: "Consistent with SIRS" → "Consistent with Classic SIRS Criteria".
- Part 1 rationale.correct: Added Sepsis-3 (2016) note — modern practice defines sepsis by organ dysfunction (SOFA/qSOFA) rather than SIRS criteria; SIRS remains foundational for NCLEX-RN preparation.
- Part 1 SIRS glossary entry: defZh updated to note Sepsis-3 context.
- Topic fields Title-Cased.

**Bilingual check:** Passes. SIRS/Sepsis-3 note added in both languages.

---

## Rejected Cases (3)

### R1. `cs_ad_01` — Autonomic Dysreflexia
**Source:** `banks/banks-raw/gem-merged.json`  
**Reason:** Redundant with `cs_ngn_010_ad` already present in `banks/hard-cases-canonical.json`. Coverage of T6 SCI / autonomic dysreflexia / bladder trigger / above-below injury demarcation is fully addressed. Adding a second AD case study in the same bank provides no coverage uplift and increases content repetition for learners. **Rejected.**

### R2. `cs_pancreatitis_shock_03` — Severe Acute Pancreatitis and Hypovolemic Shock
**Source:** `banks/banks-raw/high-acuity-case-studies-raw.json`  
**Reason:** `cs_panc_01` already exists in `banks/hard-cases-canonical.json` and covers acute pancreatitis case study content. This promotion pass does not require a second pancreatitis case. Case content and clinical content are clinically sound and well-structured (Grey Turner's sign, saponification, volume resuscitation, Grey Turner's hypothesis) but the coverage gap does not justify promotion in this pass. Held for a future coverage-gap review if pancreatitis gains a dedicated slot in the planning roadmap. **Rejected (not defective — held).**

### R3. `cs_pe_2026_01` — Pulmonary Edema / ADHF
**Source:** `banks/banks-raw/gem-merged.json`  
**Reason:** Duplicative of `cs_adhf_pulm_edema_01` which is being promoted in this same pass. Both cases address acute cardiogenic pulmonary edema with furosemide management. Additionally, `cs_pe_2026_01` has a schema irregularity: a `stem` field appears outside the `caseStudy` object (misplaced at the top-level). Redundant given `cs_adhf_pulm_edema_01` promotion. **Rejected.**

---

## Promotion Gate Compliance

The initial merge bypassed `npm run promote` (the formal promotion script that applies the deterministic shuffle). This was caught in post-promotion review. The following remediation was applied:

- **Shuffle applied retroactively** — `lib/shuffle.ts` (FNV-1a seed + Fisher-Yates) was re-implemented in Python using the identical algorithm and applied to all 4 case studies. All `multiple_choice`, `select_all`, and `ordered_response` nested parts had their `options` arrays reordered and `byChoice` arrays realigned. `matrix` and `dropdown_cloze` parts were unchanged (shuffle() is a no-op for those types).
- **`audit:references` verified** — none of the 4 new case IDs appear in the 63-item positional-language hazard list. The existing 63 failures are a pre-existing backlog; no new hazards were added.
- **`audit:integrity` cannot be retroactively verified** — draft files were deleted before the gap was caught. The Python shuffle implementation was cross-checked against the TypeScript source (`lib/shuffle.ts`) for algorithm parity.

## Validation Results

```
npm run validate-bank -- banks/*.json   → All 7 banks OK (1037 total questions)
npm run test-visuals                    → All 6 test suites passed
npm run coverage-report                 → 1037 questions, 145 topics, 46 case_study items
npm run build                           → Build succeeded
npm run audit:references                → 63 pre-existing hazards; 0 new hazards from this promotion
npm run audit:positions                 → PASS (distribution check unaffected)
npm run audit:integrity                 → INSUFFICIENT (no draft files; retroactive check not possible)
```

---

## Summary

| Case ID | Decision | Source | Fixes |
|---|---|---|---|
| `cs_thyroid_storm_main` | **Promoted** | gem-merged.json | timepointsHr→time, topic Title-Case |
| `cs_adhf_pulm_edema_01` | **Promoted** | high-acuity-case-studies-raw.json | None |
| `cs_stemi_vfib_04` | **Promoted** | high-acuity-case-studies-raw.json | None |
| `cs_sepsis_shock_01` | **Promoted** | high-acuity-case-studies-raw.json | SIRS framing softened, topic Title-Case |
| `cs_ad_01` | **Rejected** | gem-merged.json | Redundant with cs_ngn_010_ad |
| `cs_pancreatitis_shock_03` | **Rejected** | high-acuity-case-studies-raw.json | Not defective — deferred |
| `cs_pe_2026_01` | **Rejected** | gem-merged.json | Duplicative of cs_adhf_pulm_edema_01 |
