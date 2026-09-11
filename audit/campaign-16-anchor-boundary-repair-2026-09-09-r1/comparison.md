# R4 frozen producer/checker comparison

Literal E.1 comparison only. No semantic tie-break or reinterpretation.

451 = 369 + 16 + 66

| Bank | Accepted baseline | Accepted stage | Final exception |
|---|---:|---:|---:|
| banks/claude-canonical.json | 46 | 5 | 7 |
| banks/gemini-canonical.json | 38 | 2 | 6 |
| banks/gpt-canonical.json | 201 | 7 | 35 |
| banks/hard-cases-canonical.json | 84 | 2 | 18 |

All three checker MEDIUM rows and the explicit checker EXCEPTION remain final exceptions. Full field-level decisions are in comparison.json; frozen reasoning is retained exclusively as evidence, without adjudication.

Disjoint exception reason combinations:

- PRODUCER_EXCEPTION; BOUNDARY_DISPOSITION_DISAGREEMENT: 6
- CHECKER_EXCEPTION; BOUNDARY_DISPOSITION_DISAGREEMENT: 1
- BOUNDARY_DISPOSITION_DISAGREEMENT: 48
- CHECKER_NON_HIGH: 2
- STAGE_ID_DISAGREEMENT: 1
- PRODUCER_EXCEPTION; PRODUCER_BILINGUAL_UNCERTAIN; BOUNDARY_DISPOSITION_DISAGREEMENT: 1
- PRODUCER_EXCEPTION; PRODUCER_NON_HIGH; BOUNDARY_DISPOSITION_DISAGREEMENT: 6
- CHECKER_NON_HIGH; STAGE_ID_DISAGREEMENT: 1
