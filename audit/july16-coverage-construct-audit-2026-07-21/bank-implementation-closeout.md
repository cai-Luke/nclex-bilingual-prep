# GPT July 15–16 Construct-Disposition Bank Closeout

Date: 2026-07-21
Status: **IMPLEMENTED_AND_VERIFIED**

The owner-accepted 108-item outer-ring disposition was applied to `banks/gpt-canonical.json`:

- 58 KEEP items remain in delivery;
- 37 RETIRE items were removed and archived;
- 13 FIX items were removed from delivery and preserved in repair quarantine; and
- the canonical GPT bank changed from 771 to 721 questions.

The pre-removal bank SHA-256 was
`61664a6bef854ec8d7a3a0113779a4773135724aabfdec65b970b7ac6464c5d2`; the post-removal SHA-256 is
`2a3bb79809e1407e8c915965e6212898c58dc721ceb54de701e5e2b374e0e389`.
`post-removal-verification.json` proves that all 50 disposition IDs are absent, all 721 retained
payload hashes are unchanged, and retained order is unchanged.

## Recovery and repair

- Retired payloads: `Archive/gpt-july16-construct-dispositions-2026-07-21/retired-items.json`
- Repair quarantine: `Archive/gpt-july16-construct-dispositions-2026-07-21/quarantined-fix-items.json`
- Archive manifest: `Archive/gpt-july16-construct-dispositions-2026-07-21/manifest.json`

The quarantine is deliberately outside the top-level bundled-bank path. Repair requires a separate
producer/checker adjudication and the normal promotion pipeline before any quarantined item may return
to delivery.

## Replacement decision

`coverage-impact.json` and `coverage-impact.md` simulate the exact 50-item removal. Fourteen
category-topic pairs and six item types decline, but no affected category-topic pair falls to zero.
The resulting 13-bank population has 1,892 session units and 2,478 scored leaves; every delivery
category retains capacity above its requested share of a 50-question session. The accepted decision
for all 32 replacement-conditional retirements is therefore
`NO_IMMEDIATE_REPLACEMENT_GENERATION`.

This does not erase ordinary forward-looking content priorities in the generated coverage report.
It means only that the audit did not create a justified one-for-one replacement obligation.

## Verification

- all 13 bundled banks passed `validate-bank`;
- aggregate audit gates passed, with the expected no-raw-draft integrity notice and pre-existing
  stage-reference advisory only;
- grading, highlight, bowtie, schema-bank, topic-vocabulary, and topic-license regressions passed;
- TypeScript passed;
- coverage report and census regenerated at 1,892 session units / 2,478 scored leaves / 199 visual
  artifacts;
- `census:check` and the production build passed; and
- `git diff --check` passed.
