# Metadata Inconsistencies Audit Report

This report summarizes the findings of a scan of the NCLEX practice question bank files. The scan compared the topic and category metadata to the actual question content for all **992 scanned items** (including all parent case studies and their embedded sub-questions) across the five canonical JSON question banks:

1. `banks/gpt-canonical.json`
2. `banks/claude-canonical.json`
3. `banks/gemini-canonical.json`
4. `banks/hard-cases-canonical.json`
5. `banks/gap-fill-50.json`

---

## Executive Summary

| Metric | Count | Description |
| :--- | :---: | :--- |
| **Total Scanned Questions/Parts** | **992** | Every standalone question plus unfolding case-study sub-questions. |
| **Non-Canonical Topics** | **157** | Questions using topic names that do not match the 45 standardized canonical topics. |
| **Category Mismatches** | **91** | Questions where the category and topic do not align according to the NCLEX-RN blueprint. |
| **Keyword Divergences** | **302** | Questions whose content strongly suggests a different topic or category than assigned. |

---

## 1. Top Egregious Clinical Inconsistencies
The following questions have mismatched metadata that directly contradicts their clinical focus:

*   **`gpt_canonical_sata_suicide_precautions_042`** (`gpt-canonical.json`)
    *   **Clinical Content:** A client says, "I have a plan to kill myself tonight." Nursing actions for active suicide risk.
    *   **Assigned Topic:** `Transmission-Based Precautions` (Expected: `Safety and Infection Control`)
    *   **Assigned Category:** `Psychosocial Integrity`
    *   **Correction:** Change Topic to `Suicide & Crisis Intervention` (which correctly aligns with `Psychosocial Integrity`).
*   **`gemini_jun05_a_matrix_appendicitis_45`** (`gemini-canonical.json`)
    *   **Clinical Content:** Assessing for acute appendicitis using physical exam signs (Rovsing sign, McBurney sign, Obturator sign, Psoas sign).
    *   **Assigned Topic:** `PPE & Sterile Technique` (Expected: `Safety and Infection Control`)
    *   **Assigned Category:** `Reduction of Risk Potential`
    *   **Correction:** Change Topic to `Laboratory & Diagnostic Tests` (which aligns with `Reduction of Risk Potential`).
*   **`gemini_jun05_a_matrix_hip_precautions_50`** (`gemini-canonical.json`)
    *   **Clinical Content:** Post-operative day 1 care and precautions following a total hip arthroplasty using a posterior approach (abduction wedge, crossing legs, raised toilet seat).
    *   **Assigned Topic:** `Transmission-Based Precautions` (Expected: `Safety and Infection Control`)
    *   **Assigned Category:** `Basic Care and Comfort`
    *   **Correction:** Change Topic to `Mobility & Immobility` (which aligns with `Basic Care and Comfort`).
*   **`gemini_jun05_b_cloze_dysphagia_19`** (`gemini-canonical.json`)
    *   **Clinical Content:** Positioning and technique for feeding a client with post-CVA dysphagia (90-degree high Fowler's, chin-tuck position).
    *   **Assigned Topic:** `Transmission-Based Precautions` (Expected: `Safety and Infection Control`)
    *   **Assigned Category:** `Basic Care and Comfort`
    *   **Correction:** Change Topic to `Nutritional & Fluid Support` or `Mobility & Immobility`.
*   **`claude_a_mc_cauti_prevention_27`** (`claude-canonical.json`)
    *   **Clinical Content:** Prevention of Catheter-Associated Urinary Tract Infections (CAUTI) (sterile insertion technique, maintaining closed drainage, keeping bag below bladder level).
    *   **Assigned Topic:** `Elimination & Comfort` (Expected: `Basic Care and Comfort`)
    *   **Assigned Category:** `Safety and Infection Control`
    *   **Correction:** Change Topic to `Standard Precautions & Hygiene` or `PPE & Sterile Technique` (aligning with `Safety and Infection Control`).
*   **`sa_parkland_01`** (`hard-cases-canonical.json` sub-question)
    *   **Clinical Content:** Fluid resuscitation calculation for a major burn client using the Parkland formula.
    *   **Assigned Topic:** `Dosage Calculations` (Expected: `Pharmacological and Parenteral Therapies`)
    *   **Assigned Category:** `Physiological Adaptation`
    *   **Correction:** Change Topic to `Burn Management` (aligning with `Physiological Adaptation`).

---

## 2. Category Mismatches (91 Questions)
These questions use a standardized topic name but assign it to a category that does not match the NCLEX-RN client-needs blueprint definition. This causes inconsistent filtering in the study session builder.

### Key Category-to-Topic Mismatch Breakdown:

1.  **Pharmacological Topics in Disease Categories:**
    *   *Example:* `gemini_p4_09` is about cardiovascular medications under `Pharmacological and Parenteral Therapies`, but its topic is set to the disease-level `Cardiovascular Disorders` (expected category: `Physiological Adaptation`).
    *   *Correction:* Change topic to `Cardiovascular & Endocrine Medications`.
2.  **Basic Care Topics in Procedural Categories:**
    *   *Example:* `gemini_b5_01`, `gemini_b5_04`, `gemini_b5_07` (all dosage calculation items) are categorized under `Basic Care and Comfort` with the topic `Dosage Calculations`.
    *   *Expected Category:* `Pharmacological and Parenteral Therapies`.
3.  **Maternal/Pediatric Topics in Physiological Categories:**
    *   *Example:* `gpt_canonical_or_cord_prolapse_078` and `gpt_canonical_cloze_postpartum_hemorrhage_044` are categorized under `Reduction of Risk Potential` but use the topic `Maternal-Newborn Care & Teaching` (which belongs under `Health Promotion and Maintenance`).
    *   *Correction:* If a question deals with high-acuity complications (like cord prolapse or postpartum hemorrhage), its category should be `Physiological Adaptation` (or `Reduction of Risk Potential` for complications of procedures), and its topic should be matched accordingly.

---

## 3. Invalid & Non-Canonical Topics (157 Questions)
These questions use topic names that are entirely outside the 45 standardized canonical topics defined in the system.

### A. The `gap-fill-50.json` Bank
This bank contains **33 questions** that use descriptive lowercase topic strings instead of the system's exact canonical strings. This prevents them from being correctly aggregated in the app's coverage reports.

| ID | Assigned Topic | Recommended Canonical Topic |
| :--- | :--- | :--- |
| `gap_50_mc_01` | `informed consent` | `Legal & Ethical Principles` |
| `gap_50_mc_02` | `advance directives` | `Legal & Ethical Principles` |
| `gap_50_mc_03` | `client advocacy` | `Client Advocacy` |
| `gap_50_mc_04` | `hipaa and confidentiality` | `Confidentiality & HIPAA` |
| `gap_50_mc_06` / `07` | `delegation to uap / lpn` | `Prioritization & Delegation` |
| `gap_50_mc_08` | `discharge planning` | `Discharge Planning & Handoff` |
| `gap_50_bcc_01` / `02` | `crutch walking / cane use` | `Mobility & Immobility` |
| `gap_50_bcc_04` | `diabetic foot care` | `Elimination & Comfort` |
| `gap_50_bcc_09` | `enteral nutrition` | `Nutritional & Fluid Support` |
| `gap_50_sic_04` / `05` | `droplet / contact precautions` | `Transmission-Based Precautions` |

### B. The `gemini-canonical.json` Bank
This bank contains **50 questions** that use broad, non-standardized keywords generated during traditional batch loads.

*   **Examples of Non-Standard Topics:**
    *   `Assistive Devices` $\rightarrow$ should be **`Mobility & Immobility`**
    *   `Personal Hygiene` $\rightarrow$ should be **`Elimination & Comfort`** or **`Standard Precautions & Hygiene`**
    *   `Fluid Balance` $\rightarrow$ should be **`Nutritional & Fluid Support`**
    *   `fall prevention` / `fire safety` $\rightarrow$ should be **`Patient & Environment Safety`**
    *   `Hand Hygiene` $\rightarrow$ should be **`Standard Precautions & Hygiene`**
    *   `C. Difficile Care` $\rightarrow$ should be **`Transmission-Based Precautions`**

### C. The `hard-cases-canonical.json` Bank (NGN Case Studies)
Case studies in this bank contain **74 sub-questions** with custom diagnostic and clinical topics (e.g. `Refeeding Syndrome Risk`, `Chemical Decontamination Priority`, `Autonomic Dysreflexia Triggers`).
> [!NOTE]
> *Product Decision Needed:* While these specific sub-topics are highly detailed and help explain unfolding NGN case studies, they break the 45-topic coverage reporting. They can either remain as-is (with a parser exception for case studies) or be consolidated into their parent canonical topics (e.g., `Mental Health Disorders`, `Disaster & Emergency Preparedness`, `Endocrine & Neurological Disorders`).

---

## 4. Recommended Action Plan
To resolve these issues and ensure clean reports and study session filters:

1.  **Run a Script-Based Consolidation:**
    Apply standardizations to the JSON banks directly using mapping overrides (e.g. mapping `informed consent` to `Legal & Ethical Principles`).
2.  **Fix Mismatched Categories:**
    Align categories and topics to match the canonical 8-category mapping. If the topic is `Maternal-Newborn Care & Teaching` but the item tests a high-risk crisis like postpartum hemorrhage, the topic should be `Maternal-Newborn Care & Teaching` and the category should be updated to `Health Promotion and Maintenance` (or the topic changed to `Renal & Gastrointestinal Disorders` / `Cardiovascular Disorders` if appropriate).
3.  **Standardize Case Study Sub-Question Topics:**
    Roll up case study sub-questions to standard canonical topics to preserve clean coverage dashboard reporting.
