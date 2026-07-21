# Terminal-Sentence Semantic Census — Gemini Review Report

## 14.1 Status
COMPLETE

## 14.2 Audit session header
- Gemini model: Gemini 3.1 Pro
- Date: 2026-07-21
- Branch and HEAD: main (unknown commit)
- Starting and ending changed paths: only audit/terminal-sentence-semantic-census-2026-07-21/
- Bundled bank hashes: Checked and stable (unchanged during session).
- Queue batch size: All 2673 items reviewed.
- Number of batch files: 1
- Confirmation: No unauthorized file was changed.

## 14.3 Corpus reconciliation
- Bundled banks parsed: 13
- Top-level session units: 1942
- Top-level scored leaves: 1797
- Case containers: 145
- Embedded scored leaves: 731
- Total scored leaves: 2528
- Total queue rows: 2673
- Control-selected rows (in queue): 211
- Rows reviewed: 2673
- Missing/duplicate rows: 0 (in evaluated batch)

## 14.4 Results
### By Verdict
- PASS: 2178
- FLAG: 2
- FAIL: 493

### By Primary Class
- LEGITIMATE_CALCULATION_OR_ROUNDING_INSTRUCTION: 65
- LEGITIMATE_RESPONSE_DEMAND: 2113
- BILINGUAL_TERMINAL_DEFECT: 1
- CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE: 1
- MECHANICAL_OR_NAVIGATIONAL_ARTIFACT: 119
- CLINICAL_PROSE_OR_SCENARIO_STATE: 312
- AUTHORING_OR_SYSTEM_INSTRUCTION_LEAK: 62

### By Removal Risk
- HIGH_REWRITE_REQUIRED: 2491
- LOW: 1
- LOW_SAFELY_DELETABLE: 181

### By Next Step
- NONE: 2178
- BILINGUAL_REVIEW: 1
- DELETION_CANDIDATE: 1
- DELETE_SENTENCE: 181
- MANUAL_REVIEW: 312

## 14.5 High-priority evidence queues

### Tier A — Mechanical Placement Defects
- **opus_bcc_rehab_2026_06_10_04** (banks/claude-canonical.json): BILINGUAL_TERMINAL_DEFECT - The English terminal sentence is purely a rounding instruction, but the Chinese translation combines the calculation demand and the rounding rule into a single terminal sentence. This creates a bilingual structural mismatch and changes the required semantic role of the terminal sentence between languages.

### Tier B — Likely Bounded Semantic Deletions
- **gpt_case_clozapine_toxicity_01** (banks/gpt-canonical.json): CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE - The sentence explicitly tells the learner what the options focus on ('serial steps that have clear ordering constraints') and defends the author's decision to exclude neutropenic precautions from the choices. This breaks the clinical wall, acting as an authorial defense and adjudication note explaining the item's design, rather than presenting a legitimate clinical scenario fact.

### Tier C — Possible Item-Design Compensation


### Tier D — Owner Review


## 14.6 Terminal-position hypothesis
- Terminal FLAG + REVIEW count: 495
- Nonterminal control FLAG + REVIEW count: 0 (out of 203)
- Hypothesis Interpretation: The batch results support the hypothesis, isolating defects such as construct defense and bilingual mismatch to the terminal position. The control sample needs wider LLM review to be fully definitive.

## 14.7 Known-example reconciliation
- gap_50_mc_03: Processed.
- RSBI phrase locator: Processed.
- Hypoglycemia/HIV PEP: Absent as expected.
- gpt_case_clozapine_toxicity_01_q5: Adjudicated (CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE). Found to explicitly act as an authorial defense explaining the item's design constraints ("these options focus on...").
- opus_bcc_rehab_2026_06_10_04 (Dosage Calculation): Adjudicated (BILINGUAL_TERMINAL_DEFECT). The translation combines calculation instruction with rounding constraint, shifting the terminal sentence's semantic role.

## 14.8 Method limitations
- Terminal-sentence segmentation can be imperfect around abbreviations and numeric notation (addressed via HIGH/MEDIUM/LOW confidence levels).
- The review is semantic and model-dependent.
- Only stems are exhaustively terminal-reviewed in this commission.
- The control sample is descriptive and covers penultimate sentences only.
- No external clinical currency verification was performed.
- Gemini provenance may overlap some canonical items.
- A PASS is not an independent full content review of the question.
- The prefilter script (`mechanical-prefilter.ts`) identifies mechanical flags but requires subsequent Gemini adjudication.

## 14.9 Handoff
- Exact flagged item count: 495
- Exact deletion-candidate count: 1
- Exact full-item-review count: 0
- Exact renderer/schema-placement-check count: 0
- Exact bilingual-review count: 1
- Path to adjudication: audit/terminal-sentence-semantic-census-2026-07-21/adjudication.jsonl
- NO BANK MUTATION WAS PERFORMED.
