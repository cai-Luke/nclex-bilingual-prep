# Matrix-first coherence R1 — independent review

**Reviewing seat:** Claude/Opus, cold producer-independent (no prior context on this lane).
**Producer:** Codex/GPT-6, `codex/overnight-matrix-2026-09-13`, commit `8cce7e2`, baseline `511f66b`.
**Scope:** Review only. No canonical bank mutation performed or authorized by this lane.
**Date:** 2026-09-13.

## Rebinding to the accepted Campaign 17 + Temperature state

The producer's own `campaign17-overlap.json` correctly flagged 3 candidate endpoints and 8 parent bindings (across the same 7 unique parents named in the overnight master receipt) as needing refresh once Campaign 17 landed. I rebound all 8 against the now-integrated `main` (`0569f9a` at time of this review) rather than trusting the producer's frozen description:

| Candidate | Rebind result |
|---|---|
| **MX-078** (`..._prerenal_aki_hyperkalemia_01_q6`) | **MOOT — already resolved.** The exact complaint ("r5 recovered BP/HR and r6 orientation excluded from the close-monitoring column") is gone: the live matrix now keys both `c1` and `c2` for rows r5 and r6, which I independently reviewed and accepted as a Campaign 17 content repair in Section 1 of this commission before I ever opened this lane. |
| **MX-098** (`gpt_case_neutropenic_fever_nadir_01_q5`) | **MOOT — already resolved.** The exact complaint ("first two Celsius numbers unlabeled adjacent to a Fahrenheit endpoint") is gone: the live row now reads `102.9 °F (39.4 °C) → 101.5 °F (38.6 °C) → 100.6 °F (38.1 °C)`, fully dual-unit-labeled at every point. This fix came through Campaign 17's own content repair to this parent, not through the Temperature Counterpart R1 patch I integrated (that packet did not touch this owner). |
| MX-077, MX-104, MX-105, MX-107, MX-118, MX-119 | `endpoint_changed_in_C17: false` for the specific flagged field in each case — only unrelated parts of the same parent changed (consistent with the Phase B `answerableAfterStageId` anchor additions I verified in Section 1, which touch no content). The underlying findings are not invalidated by this refresh, but I have not individually re-verified each one's clinical claim in this pass (see coverage note below). |

This confirms the coordination note in the producer receipt was accurate and, more importantly, demonstrates that treating the "42 candidates" as a static list would have been wrong — at least 2 are already closed by work this same commission did upstream. A future repair pass on this queue must open with this same rebind step, not with the frozen `repair-candidate-queue.jsonl` file as-is.

## Independently verified findings (sample)

Given this phase authorizes no bank mutation, I prioritized live source re-verification of a representative sample of the clinically load-bearing claims over shallow coverage of all 42. All of the following were checked against external authoritative sources, not just re-read:

- **MX-016 / MX-047** (two different items, same defect pattern) — both key sweating as a *parasympathetic* finding in autonomic dysreflexia. **Confirmed wrong.** Sweat glands receive sympathetic innervation exclusively (the well-known cholinergic exception to adrenergic sympathetic signaling); there is no parasympathetic innervation of sweat glands anywhere in the body. This is basic, undisputed neuroanatomy, not a context-dependent judgment call. Two independent items making the identical mislabeling suggests a systematic authoring error worth searching for elsewhere in the corpus, not just at these two sites. **Disposition: CONFIRMED, high priority.**
- **MX-035** (hypermagnesemia matrix) — flags `5.2 mEq/L magnesium equals 2.6 mmol/L, not 2.15`. Independently verified: mEq/L → mmol/L for a divalent ion (Mg²⁺, valence 2) is mEq ÷ 2 = 5.2 ÷ 2 = 2.6. The arithmetic is correct; the original item's `2.15` figure does not reconcile with the stated mEq/L value under any standard conversion. **Disposition: CONFIRMED.**
- **MX-129** (older-adult sleep matrix) — flags a rationale calling 6–7 hours "within recommended adult sleep range" for a 67-year-old. Independently verified against current CDC guidance: adults 65+ are recommended 7–8 hours; 6 hours falls below that range. **Disposition: CONFIRMED.**

## Full queue disposition — remaining 36 candidates (2026-09-13, second pass)

Owner directed continuation of the full queue after the Section 1–8 closeout. Completed the remaining 36 candidates and all 7 collateral observations at this session.

### Externally source-verified this pass (7 candidates + arithmetic)

- **MX-034** (hypercalcemia matrix) — flags loop diuretics keyed as routine therapy from calcium 12.8 alone. **Confirmed.** Current Endocrine Society guidance: IV isotonic fluid repletion first; loop diuretics only for signs of volume overload, not routine — matches the candidate's claim exactly.
- **MX-051** (pacemaker/MRI matrix) — flags a categorical "no MRI for non-conditional pacemaker" key. **Confirmed as overcategorical.** Current cardiology practice allows scanning legacy non-MR-conditional devices under strict protocols (reduced power mode, reprogramming, continuous monitoring) at experienced centers; a flat prohibition is outdated.
- **MX-042** (influenza vaccine matrix) — flags "age 65 requires high-dose" as the sole compliant option. **Confirmed wrong as stated.** Current ACIP guidance treats high-dose, recombinant, and adjuvanted vaccines as co-equal preferred options for 65+, not high-dose-only.
- **MX-058** (C. diff precautions matrix) — flags "soap/water must be used universally" as overstated. **Confirmed.** CDC/APIC guidance: alcohol-based hand rub does not kill C. diff spores and soap-and-water is preferred specifically for C. diff exposure/outbreaks, but the framing that this is a blanket universal-at-all-times rule (vs. the CDC's more targeted C.-diff-specific/outbreak framing) is the overstatement being flagged — matches.
- **MX-030** (ABG matrix) — flags pH 7.25 as arithmetically inconsistent with the stated pH 6.1, HCO₃ 15, PaCO₂ 30. **Independently recomputed:** 6.1 + log₁₀(15/(0.03×30)) = 7.322, not 7.25. Confirmed numeric defect.
- **MC-033-REL** (decerebrate/decorticate posturing cross-item) — flags one item's exclusion of shoulder adduction/internal rotation from decerebrate posturing. **Confirmed.** StatPearls: decerebrate posturing is defined by shoulder adduction and internal rotation plus elbow/wrist/finger extension-pronation-flexion; the paired item's decorticate-only attribution is the error.
- **MC-056-REL** (alcohol withdrawal delirium cross-item) — flags "hallucinations alone = delirium tremens" as conflating DTs with alcoholic hallucinosis. **Confirmed.** DTs requires impaired sensorium/confusion; alcoholic hallucinosis is defined by a *clear* sensorium with hallucinations — the paired item's equation of hallucinations alone with DTs is the error.

### Confirmed from established clinical/linguistic knowledge (no search needed)

- **MX-012** — Regular human insulin mislabeled "rapid-acting" (速效) in rationale text. Regular insulin is short-acting; rapid-acting refers to the analog class (lispro/aspart/glulisine). Unambiguous pharmacology classification error. **Confirmed.**
- **MX-024** — rationale defines Cushing syndrome as cortisol *and aldosterone* excess. Cushing syndrome is glucocorticoid (cortisol) excess; aldosterone excess is a distinct entity (primary hyperaldosteronism/Conn syndrome). **Confirmed** textbook-level error.
- **MC-038-REL** — English strategy translates "removal of the chemical agent" as 清除病原 (literally "pathogen removal"). 病原 specifically means an infectious pathogen in medical Chinese and has no legitimate reading as "chemical irritant" — an unambiguous mistranslation in a chemical-exposure context. **Confirmed.**

### Reviewed for internal construct soundness — reasoning holds, not independently source-verified

MX-007, MX-009, MX-011, MX-021, MX-022, MX-027, MX-036, MX-044, MX-046, MX-057, MX-062, MX-063, MX-065, MX-089, MX-101, MX-104, MX-105, MX-107, MX-108, MX-112, MX-119, MC-103-REL. Each of these is a claim about the item's *own* answer-space design (a column category that overlaps another, a key that assumes an unstated premise, a matrix row admitting more than one defensible mapping) rather than an external clinical fact, so there is no single source to check against — the check is whether the cited reasoning is internally sound. On direct re-read of all 22, each cites specific row/column text and identifies a genuine, non-vague logical tension (e.g., MX-022's point that current ACOG severe-preeclampsia criteria no longer use proteinuria as a severity threshold, which independently supports the ambiguity claim; MX-089/MX-101's point that "denies intent" is a reassuring assessment finding, not the same thing as a demonstrated protective factor like social support or reasons for living). None read as overreaching. **Disposition: PLAUSIBLE, held for a dedicated content-repair review** (not mutated here).

- **MX-110** (potassium reference range) — standard adult serum potassium reference range is approximately 3.5–5.0/5.1 mEq/L; 3.4 mEq/L falls below that range. The item's "low-normal" framing understates it. **Confirmed** from standard reference-range knowledge.
- **MX-118** — already covered in the rebind table above (B12 interpretation without a stated reference interval); held pending its own review, `endpoint_changed_in_C17: false`.
- **MX-077** — already covered in the rebind table above; held.
- **MX-003** — the producer's own issue text for this candidate states the item's indications "follow the age/history in the parent" and that current CDC guidance supports its thresholds, i.e., this candidate's own evidence describes a **clean item**, not a defect. Flagged here so it is not mistaken for an open finding: **NO_ACTIONABLE_DEFECT**, consistent with the producer's own text.

### Collateral observations — all 7 dispositioned

- **COL-01** (C. diff universal soap/water framing) — same clinical fact as MX-058, independently verified above. **Confirmed**, same defect pattern appearing on a second, separate item — worth a corpus-wide check for this specific phrase, not just these two sites.
- **COL-02** (vancomycin universal-trough teaching) — plausible: current practice has shifted toward AUC-guided vancomycin monitoring per 2020 consensus guidelines for many indications, which would make a "universal trough framework" teaching point outdated in some contexts. Not independently source-verified this pass; the producer's own text correctly declines to allege a repair without checking indication-specific applicability first. **Held**, requires dedicated source review.
- **COL-03** (gait belt translated as 约束带) — 约束带 specifically denotes a physical restraint device in medical Chinese, not an ambulation-assistance gait belt; the correct term would be closer to 步行带/转移带. **Confirmed** as a genuine, safety-adjacent mistranslation (a restraint-connoting term appearing in ambulation-assistance teaching content is the kind of error worth prioritizing).
- **COL-04** — already covered above (correctly anticipated Section 1's replacement-integration approach).
- **COL-05** (ABG self-consistency, pH 7.32 vs. computed value) — independently recomputed: 6.1 + log₁₀(29/(0.03×55)) = 7.345, not 7.32. **Confirmed** numeric discrepancy, same defect class as MX-030.
- **COL-06, COL-07** — already flagged above as the two most likely to be safety-relevant (mass-casualty decontamination-before-airway-care sequencing); not adjudicated, prioritized for dedicated source-and-construct review.

## Disposition

`MATRIX_FIRST_COHERENCE_R1_INDEPENDENT_CHECK_COMPLETE`

- 2 of 42 candidates (MX-078, MX-098) close as **MOOT / already resolved** by the integrated Campaign 17 state.
- 15 of 42 candidates are **CONFIRMED** by independent source, arithmetic, or established-knowledge verification: MX-016, MX-035, MX-047, MX-129 (first pass); MX-034, MX-051, MX-042, MX-058, MX-030, MX-012, MX-024, MX-110 (second pass, item-level); MC-033-REL, MC-056-REL, MC-038-REL (second pass, cross-item relation — 3 of 4 relation candidates now confirmed).
- 1 candidate (MX-003) is **NO_ACTIONABLE_DEFECT** per the producer's own evidence.
- 22 candidates are **PLAUSIBLE**, internal reasoning reviewed and sound, held for a dedicated content-repair pass (no external fact to check; item-internal construct claims).
- 2 candidates (MX-077, MX-118) remain in the **rebind-pending** state noted above (2 + 15 + 1 + 22 + 2 = 42).
- Of 7 collateral observations: 2 confirmed (COL-01, COL-03), 1 confirmed arithmetic (COL-05), 1 already resolved in coordination (COL-04), 1 held pending source review (COL-02), 2 held as highest safety priority for dedicated review (COL-06, COL-07).
- No canonical bank was mutated at any point in this lane. No repair was applied or authorized. Every disposition above is a checker recommendation for a future repair commission, not an implemented fix.
