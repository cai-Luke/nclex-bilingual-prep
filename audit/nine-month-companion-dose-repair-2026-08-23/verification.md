# Mechanical verification receipt — nine-month companion acetaminophen dose

Target: `gpt_case_nine_month_well_child_safety_01`

Baseline: `ca7f5e0dc5983a6a7e4b633a5198272f76172041`

## Exact-diff proof against HEAD

- `banks/gpt-canonical.json`: 760 top-level questions before / 760 after.
- Top-level ID sequence: unchanged.
- Only changed top-level payload: `gpt_case_nine_month_well_child_safety_01`.
- Exact changed primitive leaves: 8, consisting of the four EN/ZH path pairs listed in the handoff.
- All 759 other top-level GPT payloads, including the frozen bow-tie, are byte-equivalent after JSON
  parsing.
- Unrelated aggregate SHA-256 before: `61fbc77022f07fd2cc1ac82b7a0df0650f6b2a3dde80c2f29eae721d0e57bbbb`.
- Unrelated aggregate SHA-256 after: `61fbc77022f07fd2cc1ac82b7a0df0650f6b2a3dde80c2f29eae721d0e57bbbb`.
- Frozen bow-tie SHA-256 before: `0a177ed9bb767bdf2304a86cd16ae6dd98d18fc020e703dd0cb0b2ea69b3eb0e`.
- Frozen bow-tie SHA-256 after: `0a177ed9bb767bdf2304a86cd16ae6dd98d18fc020e703dd0cb0b2ea69b3eb0e`.
- Bank `meta` SHA-256 before and after:
  `c4361783c1e6e4d5bb251c80b2d196ba294963c8820fb74bb25e02ad53699e28`.
- Parent ID, item type, and six embedded-question IDs: unchanged.
- Embedded q5 key: unchanged.
- Embedded q6 key: unchanged.
- Actual bank diff: 8 inserted lines / 8 deleted lines.

Hash method: SHA-256 of `JSON.stringify(payload)`. The unrelated aggregate preserves bank order and is
`JSON.stringify(questions.filter(q => q.id !== target))`.

## Declarative patch proof

- Raw-scoped dry run from the live canonical input to a temporary raw output: PASS.
- Dry run: 760→760; post-write schema validation PASS; strict parity warnings none.
- Dry-run comparison: exactly one changed top-level ID and exactly eight changed primitive leaves.
- Canonical P15 application used exact `setValue` before/after guards for all eight leaves.
- Canonical reason: `correct nine-month companion case acetaminophen weight-band dose teaching`.
- Canonical application: 760→760; post-write schema validation PASS; strict parity warnings none.
- The temporary dry-run output was removed after comparison and is not a retained raw candidate.

## Verification floor

- `npm run validate-bank -- banks/*.json`: PASS; all 13 banks, including GPT 760.
- `npm run audit`: exit 0. Structural, references, positions, IDs, producer-vocabulary, and authorial-
  constraint gates pass. Existing notices remain: no raw drafts for integrity comparison and 451
  repository-wide stage-reference advisories; neither is caused by this repair.
- `npm run test:case-completeness`: PASS.
- `npm run test:grading`: PASS.
- `npm run test:schema-bank`: PASS.
- `npm run test:bowtie`: PASS.
- `npm run test:audit-validate-bank`: PASS.
- `npm run test:audit-references`: PASS.
- `npm run test:audit-ids`: PASS.
- `npm run coverage-report`: PASS; 1,930 session units / 2,516 scored leaves / 199 visual artifacts.
- `npx tsc -b --pretty false`: PASS.
- `npm run census:check`: PASS; no census movement.
- `npm run build`: PASS, including TypeScript, Vite production build, file build, and build-identity
  validation; only the existing chunk-size advisory was emitted.
- `git diff --check`: PASS for the bank and patch before the review artifacts were added; rerun at final
  freeze is required.

## Independent-review closeout

Independent Claude review returned `APPROVE_FOR_APPLY`. The checker independently reopened the current AAP page and linked chart, verified 8.9 kg/about 19.6 lb → 18–23 lb (8–10 kg) → 3.75 mL at 160 mg/5 mL, re-derived the complete q5 and q6 keys from the corrected live case, confirmed all eight EN/ZH substitutions, and reproduced the preservation proofs for the frozen bow-tie and all 759 unrelated GPT payloads.

The checker also adjudicated the stale internal token `acetaminophen_5ml` as acceptable to retain because it is non-learner-facing and all row/key/rationale references remain internally consistent. The ledger records this as an intentional historical identifier and maintenance note. No content-review blocker remains.

No push was performed. `PROJECT-HISTORY.md` was not changed by this bounded correction.
