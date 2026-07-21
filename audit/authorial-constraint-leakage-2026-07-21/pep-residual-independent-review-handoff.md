# PEP Ordered-Response Post-Survey Residual — Independent Review Handoff

Status: `READY_FOR_INDEPENDENT_CONTENT_REVIEW`.

## Residual and construct defect

The original deterministic survey missed `gpt_format10c_occupational_sharps_hiv_pep_sequence`.
Its stem ended with producer-style supplied-set language and an adjudication note:

> Place the supplied actions in order. Source-patient testing and exposed-worker testing are separate processes; do not delay indicated PEP for a source result.

The clinical timing rule is correct, but the sentence explained how the producer tried to reconcile
parallel processes inside an ordered-response item. Live option B bundled exposed-worker baseline
testing and source-patient testing; option C initiated PEP. The note both exposed that construction
problem and supplied answer-bearing timing guidance. Architect disposition was
`BLOCKED_ITEM_REWRITE`, not deletion-only naturalization.

## Source verification

The 2025 U.S. Public Health Service guideline directly states:

- initiate PEP as soon as possible, up to 72 hours after occupational exposure;
- determine the source patient's HIV status whenever possible;
- do not delay PEP while waiting for source-status information;
- perform exposed-HCP baseline laboratory tests as soon as possible.

The source-testing/concurrent-PEP characterization is an inference from those jointly applicable
recommendations, not a quoted source phrase. Source: CDC Stacks document `cdc/183609`, summary
recommendations 2, 5, and 6 and “Laboratory testing of exposed HCP” recommendation 1.

## Implemented repair

The exact 14-path declarative patch is
`scripts/patches/2026-07-21-pep-authorial-constraint-residual.ts`.

- Stem EN/ZH now asks only for the exposed nurse's postexposure-care sequence; “supplied actions” and
  the adjudication-note sentence are gone.
- Option B EN/ZH is only immediate reporting and entry into occupational-health evaluation.
- Option C EN/ZH combines exposed-worker baseline collection and indicated PEP initiation as one
  urgent initial-evaluation step, avoiding a false serial order between them.
- Correct and B/C rationales EN/ZH teach that source-patient testing proceeds concurrently and must
  not delay PEP.
- Strategy EN/ZH now uses genuine time horizons rather than construction commentary.
- The key remains `A → B → C → D → E`; IDs, item type, category, topic, difficulty, `ngnSkill`,
  source, scoring, option/ref IDs, and counts are unchanged.

The patch passed strict bilingual parity, post-write bank validation, and an idempotency rerun with
zero pending writes.

Codex's complete verification rerun passed the new PEP residual regression, the existing
authorial-constraint and producer-vocabulary suites, grading and schema-bank regressions, a
zero-candidate/zero-blocker post-repair survey, 13/13 bank validation, aggregate audit, coverage,
census regeneration/check, TypeScript, production
build, build-identity validation, and `git diff --check`. A parsed diff against merged `origin/main`
contained exactly the 14 declared paths; populations remain 1,942 session units / 2,528 scored leaves
/ 199 visuals.

## Required independent checks

1. Re-derive whether the repaired A→B→C→D→E sequence is uniquely defensible.
2. Confirm that combining baseline collection and PEP initiation in C accurately represents urgent
   initial-evaluation care without implying that either may delay the other.
3. Confirm source-client testing is absent from the ordered actions but correctly retained as a
   concurrent rationale fact and later result-dependent follow-up consideration.
4. Review all 14 EN/ZH changed fields for clinical and bilingual parity.
5. Confirm the configured blocker remains narrow and the three exact observed residual signatures
   are advisory only.
6. Confirm amended report/ledger/history language no longer claims exhaustive recall or zero semantic
   residuals for the defect class.
7. Re-run the full bank-content verification floor before clearing the ledger entry.
