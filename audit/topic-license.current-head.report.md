# Topic-License Hygiene Report

Status: report-only advisory generated from the current canonical banks.
Input Git SHA: f6c0b4f37650417867fef361fe4bc1feff1b41d3

This gate validates exact canonical topic vocabulary membership and declared topic/category licenses. It cannot enforce the clinical boundary among categories licensed for a SHARED topic; that remains semantic-review work.

## Population

- Top-level records: 1942
- Case-study containers: 145
- Standalone top-level scored leaves: 1797
- Embedded scored leaves: 731
- Scored leaves: 2528

Case-study containers are inspected as records but are not counted as scored leaves.

## Findings

- Top-level findings: 0 (0 case containers + 0 standalone)
- Scored-leaf findings: 1 (0 standalone + 1 embedded)
- Unique record findings: 1

The two finding lanes overlap at standalone top-level scored leaves; they are not summed. Case containers appear only in the top-level lane, never in the scored-leaf lane.

| ID | File | Path | Record kind | Parent | Category | Topic | Issue | Licensed categories |
|---|---|---|---|---|---|---|---|---|
| `gpt_casepilot_2026_07_19_d_part_4_order_safety` | gpt-canonical.json | `questions.770.caseStudy.questions.3` | embedded_scored_leaf | gpt_casepilot_2026_07_19_d_case | Pharmacological and Parenteral Therapies | Respiratory & Infectious Disorders | license_mismatch | Physiological Adaptation |
