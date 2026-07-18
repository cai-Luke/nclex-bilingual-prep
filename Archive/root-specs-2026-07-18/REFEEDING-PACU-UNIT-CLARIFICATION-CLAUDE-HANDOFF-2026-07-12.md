# Refeeding PACU Unit Clarification — Independent Claude/Sonnet Handoff

Date: 2026-07-12
Status: canonical prose patched; independent review required
Scope: PR B only

## Review target

- Bank: `banks/gpt-canonical.json`
- Case: `gpt_case_refeeding_syndrome_tpn_01`
- Exhibit: `baseline_record`
- Fields: `caseStudy.exhibits[baseline_record].content.en` and `.zh`

The edit was applied through
`scripts/patches/2026-07-12-refeeding-pacu-units.ts` using canonical
`patch-raw --allow-canonical` mode with strict bilingual parity. Do not infer correctness from the
producer-seat patch declaration; compare both resulting sequences directly against the owner
adjudication.

## Evidence to inspect

`REFEEDING-PACU-UNIT-CLARIFICATION-MANIFEST-2026-07-12.json` contains the bank path, case and exhibit
IDs, full exact before/after strings for each locale, and all 18 approved analyte-value-unit mappings
per locale.

The deterministic object comparison between the pre-patch bank and patched bank found exactly two
changed JSON paths:

- `$.questions.307.caseStudy.exhibits.0.content.en`
- `$.questions.307.caseStudy.exhibits.0.content.zh`

Everything else compares structurally equal, including values, analyte order, questions, stems,
answers, rationales, stage structure, `structuredMeasurements`, and unrelated prose. The case index
is comparison evidence only; review should locate the case and exhibit by ID.

## Required independent checks

1. Confirm all 18 EN analyte-value-unit sequences and all 18 ZH sequences against the adjudication.
2. Confirm the EN/ZH analyte ordering is identical and the translated labels pair directly.
3. Confirm live wording remains `calcium`/`钙`, not “total calcium,” and `Hgb` remains `Hgb` in both locales.
4. Confirm no analyte or value was renamed, reordered, added, or removed.
5. Confirm the structural two-path diff and absence of any `structuredMeasurements` mutation.
6. Return PASS or BLOCK with a concrete mismatch. Do not review or promote the deferred multi-column staging case in this pass.

## Producer-seat verification

- Canonical patch engine: post-write validation PASS; 558 questions before and after; parity warnings none.
- `npm run validate-bank -- banks/gpt-canonical.json`: PASS, 558 questions.
- `npm run census`: regenerated `census.json` and `BANK-CENSUS.md` with unchanged content counts.
- `npm run census:check`: PASS.
- Required canonical-edit record added to `BANK-REVIEW-LEDGER.md`; status remains pending independent review.
