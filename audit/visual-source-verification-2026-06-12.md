# Visual Content Source-Verification Report
**Project Shrimp — Clinical Research & Validation**

## Project decisions
- **Adult `burn_map`:** Content lane is OPEN. Adult Rule of Nines is verified.
- **Pediatric `burn_map`:** Content lane is BLOCKED pending age-banded Lund-Browder support.
- **Parkland formula:** Traditional Parkland wording required (items must explicitly state to use 4 mL/kg/%TBSA or provide the constant in the stem).
- **`fetal_monitoring` constants:** Verified against NICHD 2008 nomenclature.
- **`fetal_monitoring` oxygen:** Restricted. Routine oxygen administration is NOT recommended for normoxic patients and should not be keyed as a correct intervention unless maternal hypoxia is explicitly stated.

---

## Executive Summary
This report verifies clinical constants, formulas, and definitions for `burn_map` and `fetal_monitoring` visual item generation. Findings are based on authoritative, standard-of-care clinical guidelines (StatPearls, ATLS 10th Ed, NICHD 2008, ACOG, AWHONN). 
- **burn_map**: Adult "Rule of Nines" is verified for use. Pediatric estimation using a single modified Rule of Nines is contraindicated in favor of the age-banded Lund-Browder chart; pediatric items should remain blocked until this logic is supported.
- **fetal_monitoring**: NICHD 2008 nomenclature is confirmed for baseline, variability, accelerations, and decelerations. A significant nursing management update regarding the routine administration of oxygen for intrauterine resuscitation is noted and flagged for NCLEX-safety wording.

---

## Task A — burn_map Source Verification

### Source Table
| Topic | Source | Date/Edition | URL/Reference |
| :--- | :--- | :--- | :--- |
| **Rule of Nines** | StatPearls / NCBI | 2023 | [NCBI: Rule of Nines](https://www.ncbi.nlm.nih.gov/books/NBK513287/) |
| **Pediatric Estimation** | StatPearls / NCBI | 2023 | [NCBI: Lund-Browder Chart](https://www.ncbi.nlm.nih.gov/books/NBK513287/) |
| **Parkland Formula** | ATLS 10th Ed / ABA | 2018/2023 | [ATLS Guidelines / StatPearls](https://www.ncbi.nlm.nih.gov/books/NBK537233/) |

### Verified Constants & Definitions

#### 1. Adult Rule of Nines
The body is divided as follows, totaling 100% Total Body Surface Area (TBSA):
- **Head & Neck**: 9% (4.5% anterior, 4.5% posterior)
- **Trunk**: 36% (18% anterior, 18% posterior)
- **Each Arm**: 9% (4.5% anterior, 4.5% posterior) — *Total 18% for both*
- **Each Leg**: 18% (9% anterior, 9% posterior) — *Total 36% for both*
- **Genitalia/Perineum**: 1%

#### 2. Pediatric Burn Surface Estimation
- **Verification Result**: A single modified pediatric Rule of Nines table is **not acceptable** as a high-fidelity standard. Children's body proportions change rapidly (larger heads, smaller lower extremities). 
- **Gold Standard**: The **Lund-Browder chart** is the required standard, which uses age-specific bands (e.g., birth–1 year, 1–4 years, 5–9 years, 10–14 years, and adult).
- **Decision**: Pediatric `burn_map` content should remain **blocked** unless age-specific Lund-Browder logic is implemented.

#### 3. Parkland Formula
- **Calculation**: Volume = `4 mL × body weight (kg) × %TBSA burned`.
- **Timing**: Half of the calculated volume is administered in the **first 8 hours**, and the remaining half is given over the **next 16 hours**.
- **Timing Origin**: Timing strictly starts from the **time of the burn injury**, not the time of arrival at the hospital.
- **TBSA Rules**: %TBSA includes *only* partial-thickness (2nd degree) and full-thickness (3rd/4th degree) burns. Superficial (1st degree) burns are excluded.

### 🚩 Red Flags & Disagreements (Parkland Formula)
- **Modern Shift**: While the traditional Parkland formula uses 4 mL/kg/%TBSA, the ATLS 10th Edition and modern ABA guidelines favor starting at **2 mL/kg/%TBSA** (often called the modified Brooke formula) for adults to prevent complications of fluid over-resuscitation ("fluid creep"). 
- **Suggested Wording Cautions**: NCLEX items are often slightly behind cutting-edge shifts. To be perfectly NCLEX-safe, stems should explicitly state either "Using the traditional Parkland formula (4 mL/kg/%TBSA)..." or rely on providing the formula constant in the stem/exhibit to avoid ambiguity.

### Content-Lane Constraints
- The stem **must not** state the %TBSA if the map is used.
- The visual **must not** print %TBSA or Parkland totals.
- Adult `burn_map` items may proceed.
- Pediatric `burn_map` items are **blocked** until Lund-Browder tables are implemented.

---

## Task B — fetal_monitoring Source Verification

### Source Table
| Topic | Source | Date/Edition | URL/Reference |
| :--- | :--- | :--- | :--- |
| **Nomenclature/Definitions** | NICHD Workshop | 2008 | [NICHD 2008 Guidelines](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2533152/) |
| **Tracing Interpretation** | ACOG Practice Bull. | 2009/2010 | ACOG Practice Bulletin No. 106 |
| **Nursing Management** | AWHONN / ACOG | Recent | [AWHONN Intrauterine Resuscitation](https://www.awhonn.org/) |

### Verified Constants & Definitions

#### 1. FHR Baseline
- **Normal Baseline**: 110–160 bpm.
- **Tachycardia**: Baseline > 160 bpm for ≥ 10 minutes.
- **Bradycardia**: Baseline < 110 bpm for ≥ 10 minutes.

#### 2. Variability (Amplitude Range)
- **Absent**: Amplitude range is visually undetectable.
- **Minimal**: Amplitude range is detectable but ≤ 5 bpm.
- **Moderate**: Amplitude range is 6–25 bpm.
- **Marked**: Amplitude range is > 25 bpm.

#### 3. Accelerations (Term Gestation ≥ 32 weeks)
- **Criteria**: An abrupt increase (onset to peak < 30 seconds). 
- **Amplitude/Duration**: Peak must be **≥ 15 bpm** above baseline, lasting **≥ 15 seconds** from onset to return to baseline (but < 2 minutes).
- **Gestational Age Caveat**: For preterm fetuses (< 32 weeks), the threshold is 10 bpm × 10 seconds. NCLEX items should explicitly specify the patient is "at term" or "at 39 weeks gestation" to lock the 15×15 criteria.

#### 4. Decelerations
- **Early**: *Gradual* onset (onset to nadir ≥ 30 seconds). The nadir mirrors the peak of the contraction.
- **Late**: *Gradual* onset (onset to nadir ≥ 30 seconds). The nadir occurs *after* the peak of the contraction.
- **Variable**: *Abrupt* onset (onset to nadir < 30 seconds). Decrease is ≥ 15 bpm, lasting ≥ 15 seconds, and duration is < 2 minutes. Not necessarily time-locked to contractions.
- **Prolonged**: Decrease is ≥ 15 bpm below baseline, lasting **≥ 2 minutes but < 10 minutes**.

#### 5. Category Interpretation
- **Category I (Normal)**: Normal baseline, moderate variability, absent late/variable decelerations. Early decels and accels may be present or absent. Reassuring.
- **Category II (Indeterminate)**: Tracings that are neither Category I nor Category III. *Example: Minimal variability with recurrent late decelerations.* Requires continued evaluation and intrauterine resuscitation.
- **Category III (Abnormal)**: Absent variability WITH recurrent late decelerations, recurrent variable decelerations, or bradycardia; or a sinusoidal pattern. Predictive of abnormal fetal acid-base status.

#### 6. Nursing Management (Intrauterine Resuscitation)
Consistent, NCLEX-safe interventions to maximize uteroplacental blood flow:
- **Maternal Repositioning**: Lateral or side-to-side position changes.
- **IV Fluid Bolus**: Administering a fluid bolus (e.g., 500 mL Lactated Ringer's) to treat maternal hypotension.
- **Uterine Activity**: Discontinue oxytocin (Pitocin) if infusing.
- **Provider Notification**: Notify the provider and prepare for expedited birth if patterns persist.

### 🚩 Red Flags & Blocked Content (Routine Oxygen)
- **Oxygen Caveat**: Historically, applying "10L O2 via nonrebreather face mask" was taught as a blanket first-line intervention. Modern AWHONN and ACOG guidance strongly state that routine administration of supplemental oxygen is **NOT recommended** for normoxic patients. 
- **Suggested Wording**: Do not use "administer oxygen" as a definitive correct answer for intrauterine resuscitation unless the item explicitly states the mother is hypoxic (e.g., O2 sat < 90%). It should be avoided as a distractor if it creates ambiguity with older textbooks.

### Content-Lane Constraints
- The stem **must not** name the deceleration type if the visual asks the learner to identify it.
- The tracing caption **must not** reveal the answer.
- The item **must** require reading the phase relationship on the strip (e.g., comparing FHR nadir to contraction peak).
- The rationale **must** be position-agnostic and not rely on option order.

---
**Open Questions Requiring Human Review:**
1. Does the project wish to hardcode the "traditional" 4 mL Parkland formula into the stem instructions, or use 2 mL/kg to reflect modern ATLS updates? (Resolved: Yes, traditional Parkland wording required)
2. Should oxygen administration be strictly banned as a correct option for Category II/III tracings unless maternal hypoxia is explicitly modeled in the stem? (Resolved: Yes, oxygen is restricted)
