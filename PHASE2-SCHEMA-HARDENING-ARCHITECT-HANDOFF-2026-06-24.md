# Phase 2 schema-hardening closeout — architect handoff (2026-06-24)

## What landed

Step A and Step B of the schema-hardening closeout are implemented.

Step A:
- Confirmed `scripts/promote.ts` already applies `normalizeBankPresentations(shuffled)` after deterministic shuffle.
- Added promote-path regression coverage via `scripts/tests/audit-integrity.ts` for embedded ordered-response, dropdown-cloze, and matrix axes.
- Re-normalized the one live canonical display-order drift: `banks/gemini-canonical.json` item `gap_50_sic_04` matrix columns moved from `c2,c1,c3` to `c3,c1,c2`.
- Confirmed the old `gpt-gap-jun12-rrp-bcc` diagnostic is clean.
- Left `audit-non-mcq-bias` advisory-only.

Step B:
- Added `scripts/cleanup-unknown-key-residuals.ts` and `npm run cleanup-unknown-keys`, dry-run by default.
- Cleaned all 16 live unknown-key residuals from canonical banks.
- Implemented strict unknown-key rejection in `src/schema.ts` via `rejectUnknownKeys`, sourced from `src/allowedKeys.ts`.
- Pipeline/audit paths opt into strict mode explicitly: promote, consolidate, validate-bank, and aggregate audit.
- Learner imports remain forgiving because `validateQuestion` / `validateBankObject` default `rejectUnknownKeys` to false.
- `npm run scan-unknown-keys` remains an on-demand diagnostic, not part of `npm run audit`.

## Canonical cleanup details

Removed or normalized the following non-semantic schema drift:
- `gpt_case_unsafe_assignment_01.caseStudy.{rationale,testTakingStrategy,glossary}` after confirming each was a duplicate of the question-level field.
- `gpt_fresh_2026_06_22_vis_07.meta.custom`, an empty object.
- Six duplicate `cs_copd_01_q1.rationale.byChoice[].id` keys that duplicated `refId`.
- `opus_tpn_case_mucositis_01_q3.glossary[0].en`, a stray English definition in a schema `{ termEn, termZh, defZh }` object.
- `gpt_pph_2026_06_16_case_01_q5.matrix.correct`, a legacy object-form duplicate; the schema-level `correct[]` remained intact.
- `opus12_case_inpatient_suicide_risk_01.caseStudy.overview`, renamed to schema `summary`.
- `io-canonical.json` bank `meta.generatedAt`, `meta.lane`, and `meta.bankIdPrefix`.

## Verification

Passed:
- `npm run cleanup-unknown-keys`
- `npm run cleanup-unknown-keys -- --write`
- `npm run scan-unknown-keys` → 0 findings
- `npm run test:schema-bank`
- `npm run test:consolidate`
- `npm run test:audit-ids`
- `npm run test:raw-bank-normalization`
- `npm run test:audit-integrity`
- `npm run test:presentation-normalization`
- `npx tsc -b --pretty false`
- `npm run validate-bank -- banks/*.json`
- `npm run audit`
- `npm run census:check`
- `npm run build`

Expected caveat:
- `audit:integrity` reports `INSUFFICIENT` only because `banks/banks-raw/` is empty; this is the current clean staging state, not a failure.
- `npm run build` still emits the existing Vite large-chunk warning.

## Architect review prompts

No implementation blocker remains. Recommended review focus:
- Confirm strict-mode scope is correct: pipeline/audit strict, learner upload/import forgiving.
- Confirm `scan-unknown-keys` should stay diagnostic-only now that Tier 0 strict validation is live.
- Confirm the deterministic residual cleanup script should remain in repo as a reusable one-time/repair utility.
- Confirm no desire to type bank-level provenance metadata; current decision strips it.

## Files of interest

- `src/schema.ts`
- `src/allowedKeys.ts`
- `scripts/cleanup-unknown-key-residuals.ts`
- `scripts/tests/schema-bank.ts`
- `scripts/tests/audit-integrity.ts`
- `PROJECT-HISTORY.md`
- `BANK-REVIEW-LEDGER.md`
