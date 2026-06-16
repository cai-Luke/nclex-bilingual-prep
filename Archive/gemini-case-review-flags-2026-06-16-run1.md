# Gemini Case Review Flags

**Date:** 2026-06-16
**Scope:** 10 raw case files in `banks/banks-raw/`

## 1. Pervasive Structural Errors (Compilation Failure)

Almost all GPT-compiled files failed schema validation (`npm run validate-bank`) due to consistent structural hallucinations. The compiler failed to wrap the case study items correctly.

**Root `case_study` missing required fields:**
- `stem`, `rationale`, `testTakingStrategy`, and `glossary` are required on the parent `case_study` object (index 0), but the model omitted them entirely.

**Bowtie Item Malformation & Misplacement:**
- The final `bowtie` item was incorrectly placed at the root `questions` array (as `questions[1]`) instead of being embedded inside `caseStudy.questions`.
- The `bowtie` structure itself is invalid: the compiler placed `condition`, `actions`, and `parameters` at the root of the question object rather than nesting them securely under a `bowtie: {}` key as required by `itemType: "bowtie"`.

**Impacted Files:**
- `gpt-case-burns-fluid-creep-2026-06-15.json`
- `gpt-case-gallstone-pancreatitis-2026-06-16.json`
- `gpt-case-gbs-respiratory-compromise-2026-06-16.json`
- `gpt-case-pe-2026-06-16.json`
- `gpt-case-postpartum-preeclampsia-severe-2026-06-16.json`
- `gpt-case-variceal-hemorrhage-cirrhosis-2026-06-16.json`
- `gpt-r1-regen-celiac-2026-06-16.json`
- `gpt_case_aki_2026_06_16.json`

## 2. File-Specific Structural & Schema Errors

**`gpt-pph-2026-06-16.json`**
- **Difficulty Error:** Uses `difficulty: "high"` instead of the allowed vocabulary `"hard"`.
- **Glossary Error:** Missing required keys `termEn`, `termZh`, and `defZh` for several glossary items.
- **Rationale Error:** Multiple `rationale.byChoice` entries are missing `refId`, `en`, and `zh`.

**`gpt-stroke-acute-ischemic-stroke-warfarin-2026-06-16.json`**
- **Option Count Error:** `caseStudy.questions[4]` is a `select_all` item that generated 7 options (A through G). Schema restricts `select_all` to a maximum of 6 options.

## 3. Medical Accuracy Note

A preliminary review of the files indicates the clinical trajectories and rationales generally align with standard NCLEX reasoning. However, deep clinical verification should proceed **only after** the JSON structural failures are corrected, as the files cannot currently be validated, rendered, or promoted into the standard item viewers.

## Recommendations for Next Steps

1. **Update the Compiler Prompt/Script:** Adjust the GPT compilation workflow to ensure the `case_study` parent object receives a dummy or synthesized `stem`, `rationale`, `testTakingStrategy`, and `glossary`, and ensure the bowtie synthesis is pushed into `caseStudy.questions` and wrapped in `bowtie: {}`.
2. **Patch Existing Files:** Use a programmatic transform (e.g. `scripts/patch-raw.ts` or a new targeted script) to migrate the shape of these 10 files rather than manual free-form edits, adhering to the "No JSON Mutation in Gemini Review" rule.
3. **Stroke Case Fix:** Remove one distractor from the 7-option `select_all` item.
4. **Re-Validate:** Re-run `npm run validate-bank -- banks/banks-raw/*.json` after structural repairs to clear the schema gate before continuing human medical review.
