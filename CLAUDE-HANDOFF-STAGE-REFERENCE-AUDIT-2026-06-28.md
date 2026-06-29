# Claude Handoff — Case-Study Stage Reference Audit

Date: 2026-06-28  
Branch: `codex/stage-reference-audit`

## Scope

This is the PR 1.1 follow-up after the exam-like case-study split layout.

The goal was to make unresolved embedded case-study stage metadata visible before it can surprise the split-pane chart filtering. The UI still has the conservative runtime fallback from PR #1: if a part has no valid mapping, the chart shows all stages rather than hiding clinically necessary data.

## What Changed

- Added `scripts/audit/audit-stage-refs.ts`.
- Added `npm run audit:stage-refs`.
- Added `npm run test:audit-stage-refs`.
- Wired `audit:stage-refs` into aggregate `npm run audit` as a Tier 2 advisory check.
- Kept the result non-blocking: unresolved references report as `WARN`, while the overall gate still exits 0 unless a blocking Tier 1 or enforced mechanical-bias check fails.
- Added fixture coverage for:
  - valid `stageId`
  - valid `answerableAfterStageId`
  - unresolved `stageId`
  - unresolved `answerableAfterStageId`
  - a referenced stage on a case with no declared stages

## Bank Repairs

The new audit initially reproduced the 11 unresolved references you flagged.

Applied with a serializer-backed Node transform:

- `banks/gpt-canonical.json`
  - Removed six invalid first-part `stageId` values:
    - `adhf_triage`
    - `aki_initial`
    - `panc_initial`
    - `adrenal_initial`
    - `sepsis_initial`
    - `anticoag_initial`
  - Rationale: these cases only declare Stage 2 and Stage 3 objects. Mapping initial/admission metadata to Stage 2 would hide earlier/global chart data and change the pre-existing fallback behavior. Removing the invalid refs keeps the split UI on the safe all-stages fallback for those first parts.

- `banks/hard-cases-canonical.json`
  - Mapped obvious first-stage aliases:
    - `gpt_case_gallstone_pancreatitis_01_q1`: `stageId "admission"` → `stage_1`
    - `gpt_case_gbs_respiratory_compromise_01_q1/q2/q3`: `answerableAfterStageId "initial"` → `stage1_0_12h`
    - `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01_q1`: `stageId "initial"` → `stage1`

## Verification

Passed:

- `npm run test:audit-stage-refs`
- `npm run audit:stage-refs`
- `npm run validate-bank -- banks/*.json`
- `npm run audit`
- `npm run census`
- `npm run census:check`
- `npm run build`

Notes:

- `npm run audit` still has the pre-existing advisory non-MCQ distribution WARN and the expected `audit:integrity` INSUFFICIENT state because no raw draft files are present.
- `npm run build` still has the existing Vite chunk-size warning.

## Review Requests

1. Confirm the advisory severity is right for now. I kept it non-blocking because it is metadata hygiene, and the runtime fallback still protects learners from hidden chart data.
2. Confirm the mixed repair strategy:
   - remove impossible initial refs where no initial stage exists
   - map aliases where a clear declared first stage exists
3. Decide later whether stage refs should graduate to a blocking Tier 1 gate once the historical bank has stayed clean for a while.
