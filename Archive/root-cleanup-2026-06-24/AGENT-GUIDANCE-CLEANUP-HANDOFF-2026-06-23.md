# Agent Guidance Cleanup Handoff — 2026-06-23

Use this as orientation for GPT/Claude review or follow-up work on the Project Shrimp agent-facing guidance cleanup. No NCLEX items were generated or edited in this pass.

## What Changed

The repo now has a clearer single contract for schema and generation guidance:

- `NCLEX-Question-Schema.md` is explicitly the current schema contract.
- Runtime sources remain the implementation authority: `src/types.ts`, `src/schema.ts`, `src/grading.ts`, and registered visual modules under `src/visuals/`.
- Archived item-type and visual specs under `Archive/` are marked as historical implementation records, not current authoring contracts.
- `AGENTS.md` now separates deterministic mechanical cleanup from semantic content-review guidance.

## Mechanical Cleanup Added

New raw-bank normalizer:

- `lib/raw-bank-normalization.ts`
- `scripts/normalize-raw-bank.ts`
- `scripts/tests/raw-bank-normalization.ts`
- `package.json` scripts:
  - `npm run normalize-raw-bank -- banks/banks-raw/<file>.json`
  - `npm run test:raw-bank-normalization`

Current normalizations:

- `ngnSkill` display/camel/spaced casing to exact enum values.
- Legacy glossary objects to `{ termEn, termZh, defZh }` only when all three values are present.
- Empty optional `rationale.visuals` removal.
- Stale `meta.count` correction.

Important boundary: the normalizer does not invent missing bilingual glossary content. If a raw glossary has only English term/definition or no Chinese definition, it remains a content-review fix.

## Guidance Updates

Updated active docs:

- `AGENTS.md`
  - Adds mechanical normalizer workflow.
  - Lists all 11 current visual lanes.
  - Points archived specs to schema/runtime sources on conflict.
- `NCLEX-Question-Schema.md`
  - Adds authority/enforcement split.
  - Notes validator/audit ownership of deterministic checks.
  - Adds ordered-response semantic warning for branch-dependent workflows.
  - Points visual generation to current per-kind sections, not archived lane specs.
- `BANK-REVIEW-LEDGER.md`
  - Adds normalize-before-validate step.
  - Updates canonical visual bank list.
  - Clarifies older ledger row counts are historical.
- `PROJECT-HISTORY.md`
  - Updates current counts to match `BANK-CENSUS.md`.
  - Marks archived specs as historical for schema purposes.
- `CLAUDE.md`
  - Updates current schema from `1.5` to `1.6`.
  - Removes stale injection-site closed-lane warning.
  - Adds raw normalizer workflow.
- `NCLEX-Bank-Generation-Prompt.md`
  - Updates compact prompt from schema `1.2` framing to schema `1.6`.
  - Adds `highlight` and `bowtie`.
  - Makes visual placement per-kind and defers full details to `NCLEX-Question-Schema.md`.

Archived docs with explicit historical banners:

- `Archive/BOWTIE-ITEM-TYPE-SPEC.md`
- `Archive/HIGHLIGHT-ITEM-TYPE-SPEC.md`
- `Archive/PARTIAL-CREDIT-SCORING-SPEC.md`
- `Archive/visual-content-lanes-spec.md`

## Validation Results

Passed:

- `npx tsc -b --pretty false`
- `npm run test:raw-bank-normalization`
- `npm run test:schema-bank`
- `npm run validate-bank -- banks/*.json`
- `npm run build`

Notes:

- `npm run validate-sweep` is available but requires manifest/summary arguments; there is no no-arg repo-wide sweep.
- The normalizer is a mechanical pre-validation aid, not a substitute for content review. It validates the normalized result and reports when remaining defects require real review.

## What GPT/Claude Should Do Next

For content review:

1. Start from `AGENTS.md`, `PROJECT-HISTORY.md`, `NCLEX-Question-Schema.md`, `BANK-CENSUS.md`, and `BANK-REVIEW-LEDGER.md`.
2. Treat `NCLEX-Question-Schema.md` plus runtime sources as authoritative over archived specs and old prompts.
3. Run `npm run normalize-raw-bank -- <raw-file>` before asking a model to repeat mechanical schema guardrails.
4. Keep human/model review focused on semantic quality:
   - clinical ambiguity
   - unsafe ordered-response sequencing
   - stale guideline risk
   - weak distractors
   - bilingual clinical parity
   - topic saturation
   - visual necessity/load-bearing status
