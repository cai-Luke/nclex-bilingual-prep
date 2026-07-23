# Queue 162 Pre-authoring Source Test

Date: 2026-07-22

Queue: 162

Stable id: `claude_moc_deleg_matrix_08`

Bank: `banks/claude-canonical.json`

Disposition: **RETIRE**

## Governing test

The implementation specification requires retirement unless one source-backed explicit policy supports a genuinely unique six-row assignment matrix without inventing a uniform “common U.S.” scope.

## Source findings

1. The NCSBN Scope of Practice Decision-Making Framework says scope is controlled by each jurisdiction's nurse practice act and rules, and also by employer policies and procedures. It is an educational decision tool, not a nationwide task-allocation standard:
   - https://www.ncsbn.org/nursing-regulation/practice/decision-making-framework.page
2. NCSBN's delegation resource likewise states that delegation rules differ among jurisdictions and directs nurses to know the law and rules where they practice:
   - https://www.ncsbn.org/delegation
3. The NCSBN/ANA National Guidelines for Nursing Delegation distinguish assignment from delegation and provide general delegation principles, but do not establish the item's exact nationwide UAP/LPN/RN task matrix:
   - https://www.ncsbn.org/public-files/NGND-PosPaper_06.pdf
4. Texas Board of Nursing materials support RN responsibility for comprehensive assessment and nursing-care planning, but make LVN performance of IV therapy activities dependent on education, competency, and facility policy. That does not uniquely establish the item's row 6 as “RN only” under one explicit statewide rule:
   - https://www.bon.texas.gov/practice_bon_position_statements_content.asp
   - https://www.bon.texas.gov/faq_nursing_practice.asp
5. Other official jurisdictional materials reviewed (New York, Massachusetts, and Pennsylvania) similarly describe role boundaries while retaining jurisdiction-, activity-, competency-, or policy-specific qualifications; none uniquely supports all six keyed rows as one complete matrix:
   - https://www.op.nysed.gov/professions/licensed-practical-nurses/laws-rules-regulations/article-139
   - https://www.mass.gov/doc/ar-25-01-rn-and-lpn-scope-of-practice-pdf/download
   - https://www.pa.gov/content/dam/copapwp-pagov/en/dos/department-and-offices/bpoa/nursing/FAQs%20for%20IV%20Therapy.pdf

## Determination

No single explicit policy was found that uniquely supports all six keyed assignments. The current stem and rationale obtain uniqueness by positing a “common U.S.” acute-care scope while simultaneously conceding state and facility variation. A source-backed policy rebuild would require choosing and fully encoding a particular jurisdiction and policy context; the present nationwide construct cannot be retained as written.

The specification's pre-authoring retirement condition therefore fires. No replacement prose was authored. The exact payload is preserved in `Archive/terminal-sentence-remediation-2026-07-22/queue-162-retired-item.json`.
