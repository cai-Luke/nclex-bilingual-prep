# Claude Jun05 Gap-Fill MoC/Pharm Audit

Source file: `banks/banks-raw/claude-2026-06-05-gapfill-moc-pharm.json`
Review date: 2026-06-06

## Summary

| Source file | Pass | Fix | Discard | Human review |
|---|---:|---:|---:|---:|
| `banks/banks-raw/claude-2026-06-05-gapfill-moc-pharm.json` | 5 | 0 | 1 | 0 |

The batch is schema-valid. Five questions pass content review. One question is clinically correct but should not be promoted because the bundled bank already covers the same NPH/regular insulin mixing sequence in `gemini_d2_insulin_01`.

## Verdicts

| Question ID | Verdict | Notes |
|---|---|---|
| `claude_jun05_moc_case_mgmt_01` | pass | Correctly keys proactive coordination of home health, home infusion, and PT before discharge. Consistent with AHRQ/CMS transition-of-care guidance emphasizing safe discharge planning, post-acute referrals, follow-up arrangements, and necessary information transfer. |
| `claude_jun05_moc_referral_slp_02` | pass | Correctly keys speech-language pathologist for post-stroke dysphagia/swallowing evaluation and aspiration-risk management. |
| `claude_jun05_moc_quality_improvement_03` | pass | Correctly keys collecting/analyzing practice data against evidence-based CAUTI guidance before choosing an intervention. Distractors are punitive or premature fixes. |
| `claude_jun05_pharm_pca_opioid_safety_04` | pass | Correctly keys naloxone for morphine/PCA-associated respiratory depression after stopping opioid delivery and supporting oxygenation. |
| `claude_jun05_pharm_clozapine_teaching_05` | pass | Correctly keys infection reporting, continued ANC monitoring, constipation reporting, and orthostatic-hypotension precautions. The item reflects the 2025 FDA REMS change accurately enough: REMS participation is eliminated, but ANC monitoring remains recommended per prescribing information. |
| `claude_jun05_pharm_insulin_mixing_06` | discard | Clinically correct, but redundant with bundled `gemini_d2_insulin_01`. Both test the same complete insulin-mixing order: air into NPH/cloudy, air into regular/clear, draw regular/clear, draw NPH/cloudy. |

## Source Checks

- AHRQ transition-of-care and IDEAL discharge planning guidance supports safe, coordinated transitions and written follow-up arrangements before discharge: https://www.ahrq.gov/topics/transitions-care.html and https://www.ahrq.gov/patient-safety/patients-families/engagingfamilies/strategy4/index.html
- CMS discharge planning rule supports referral/transfer to appropriate post-acute service providers and outpatient follow-up providers at discharge: https://www.cms.gov/newsroom/fact-sheets/cms-discharge-planning-rule-supports-interoperability-and-patient-preferences
- ASHA identifies SLPs as preferred dysphagia providers and describes swallowing assessment for aspiration risk and safe consistencies: https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/
- CDC CAUTI recommendations include QI programs based on facility risk assessment and evidence-based catheter use, insertion, and maintenance guidance: https://www.cdc.gov/infection-control/hcp/cauti/summary-of-recommendations.html
- IHI and AHRQ QI guidance support aims/measures/data collection before testing changes: https://www.ihi.org/index.php/library/model-for-improvement and https://www.ahrq.gov/cahps/improvement-guide/improvement-models/plan-do-study-act.html
- FDA and NCBI sources support naloxone as opioid reversal for overdose/respiratory depression, including morphine: https://www.fda.gov/consumers/consumer-updates/access-naloxone-can-save-life-during-opioid-overdose and https://www.ncbi.nlm.nih.gov/books/NBK470415/
- FDA and DailyMed clozapine sources support severe neutropenia/ANC monitoring, infection-symptom reporting, orthostatic hypotension, serious constipation/GI hypomotility, and 2025 REMS elimination with continued ANC-monitoring recommendation: https://www.fda.gov/drugs/postmarket-drug-safety-information-patients-and-providers/information-clozapine and https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d5c8a456-6f3c-4963-b321-4ed746f690e4
- HealthLink BC supports the clinically correct mixed-insulin sequence, but this item is discarded for redundancy rather than clinical error: https://dmz2.www.healthlinkbc.ca/healthwise/how-prepare-mixed-dose-insulin
