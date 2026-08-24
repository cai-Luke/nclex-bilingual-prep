# Verification receipt — nine-month standalone bow-tie dose harmonization

Baseline: `a237d18f1b6aea277681cf3522239b793cad859c`

Target: `gpt_case_nine_month_well_child_safety_01_bowtie`

## Diff and invariant proof

- GPT top-level count: 760 before / 760 after; ID sequence unchanged.
- Changed top-level IDs: exactly `gpt_case_nine_month_well_child_safety_01_bowtie`.
- Changed primitive leaves: exactly the eight authorized EN/ZH leaves.
- Every changed leaf is numeral-only: post-patch `3.75 mL` → `5 mL` reconstructs baseline exactly.
- Companion SHA-256 before/live:
  `290aab010b64873560377f84aa5001a0b8d14b1d2d01cfaedec96f5dc23a6f0f`.
- All 759 non-target payloads aggregate SHA-256 before/live:
  `81b12d3038dd3f4f406302fa1c7efb87b46793d194154eb55778a05c8ba30e4f`.
- Historical answerability patch SHA-256 before/live:
  `55ce5856f16612207a85015bfd427973a22a9167dc953bdc424ba8d6b574eb95`.
- Condition/action/parameter keys, all token IDs, 3/4/4 cardinality, 11 rationale references,
  metadata, strategy, and glossary: unchanged.
- Production grading function with the retained key: 5 earned / 5 possible; fully correct.
- Strict patch parity: no warnings.
- Stale standalone reference-dose scan: zero. Valid concentration occurrences: 2. Reported 15 mL
  history occurrences: 6.

Hash method: SHA-256 of `JSON.stringify(payload)`. The unrelated aggregate preserves bank order and
hashes `questions.filter(q => q.id !== target)`.

## Patch proof

- Exact-token preflight: PASS; 8 expected leaves / 10 occurrences / 0 missing / 0 extra.
- Raw-scoped dry run: PASS; 760→760; schema validation PASS; strict parity warnings none.
- Dry-run diff proof: PASS; one target payload / eight authorized primitive leaves.
- Canonical exact-guard application: PASS; 760→760; schema validation PASS; strict parity warnings
  none.
- Canonical reason matches the handoff.
- Temporary raw dry-run output removed; no raw candidate was retained.

## Narrow verification floor

- `npm run validate-bank -- banks/gpt-canonical.json`: PASS; 760 questions.
- Live `npm run audit:references`: PASS; no stale references or positional hazards.
- Live `npm run audit:ids`: PASS; all 2,661 bundled IDs globally unique.
- `npm run test:bowtie`: PASS.
- `npm run test:grading`: PASS.
- `npm run test:schema-bank`: PASS.
- `npm run test:audit-validate-bank`: PASS.
- `npm run test:audit-references`: PASS.
- `npm run test:audit-ids`: PASS.
- `npx tsc -b --pretty false`: PASS.
- `npm run census:check`: PASS; no population or generated-artifact movement.
- `git diff --check`: PASS at final freeze.

Independent non-GPT Claude review returned `APPROVE_FOR_APPLY`. The checker independently diffed the
live bow-tie against `a237d18`, re-derived all five keyed targets before opening the stored key,
confirmed the 3/4/4 pools and five-point scoring construct remain valid, reconfirmed the 3.75 mL family
dose, and verified EN/ZH parity. The checker also independently confirmed that the companion case, all
759 non-target GPT payloads, and the historical answerability patch remain unchanged. No content-review
blocker remains.

No push was performed, and `PROJECT-HISTORY.md` was not changed by this bounded harmonization.
