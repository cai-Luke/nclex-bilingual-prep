# Schema 2.0 — Amendment 0A Implementer Handoff

Date: 2026-07-10 (revised same day — see *Adjudication of your objections*)
From: Claude (architect seat)
To: implementer seat (Codex / GPT-5.6 Sol)
Governing spec: `structured-measurements-schema-2-0-codex-spec.md` → **AMENDMENT 0A**, incl. **A0.5**

## Verdict on your gate report

**Block upheld. Your central finding is correct and you were right to stop.** `population` is not
ordinary spec drift — it is a 2.0 field that already escaped into the 1.9 contract, and the architect
independently verified it against live disk before ruling.

Two corrections to the report, recorded so they do not propagate:

1. `promote.ts` and `consolidate.ts` do **not** maintain separate public-version rank maps. Both derive
   `SCHEMA_RANK` from the exported `supportedSchemaVersions`. The defect is the `?? 0` fallback, and the
   fact that `schema.ts`'s private `cmpSchema` maps an unknown version to `−1` while both scripts map it
   to `0`. Three call sites, three behaviors for the same malformed input.
2. The bare-array finding was **under-called**. Every floor in `validateBankObject` is guarded on
   `schemaVersion !== undefined`, and the two that are not test equality against `"1.0"`/`"1.1"`. A bare
   array yields `meta === undefined`, so *no floor fires at all* — not "conditional feature-floor
   enforcement." Promote and consolidate then rank the missing version as `1.0`.

One thing the report missed, and it is the strongest evidence for its own conclusion:
`scripts/apply-structured-measurements.ts` writes `population` conditionally from the staged record and
then **hard-pins `meta.schemaVersion = "1.8"`** on every touched bank, and post-apply validation passes
because no floor exists. The contradiction is not latent in the type system. There is a tool on disk that
will write a 2.0 field into a canonical bank and stamp it `1.8`.

## Adjudication of your objections (A0.5 — read this before the task list)

Five objections returned; **all five sustained**, one tightened past what you asked. Verified against live
disk before ruling. The spec above is amended in place; the task list below already reflects it.

1. **Import boundary — you were right and the amendment was wrong.** `importQuestionsFromText` validates
   per question and never envelopes. Ruling: **keep uploads version-agnostic**; R6 corrected. The interim
   guard does not reach uploads, deliberately. No import adapter, and none enters 0B by implication.
   Phase 1 adds `population`/`bound` to the `toExportEnvelope` ladder so an exported bank cannot declare
   `1.8` while carrying a 2.0 field.
2. **`requireMeta` call sites — sustained.** Confirmed both: `scripts/audit/validate-bank.ts` and
   `src/banks.ts` validate without it. Now also `scripts/validate-bank.ts` via `requireMeta: !isRaw`
   (that file already computes `isRaw`). Raw drafts stay exempt — `promote` is the boundary.
3. **Weight-based dosing — sustained, and tightened.** You offered corroborating evidence *or* an
   unscoped WARN. **It is corroborating context only, and triggers no WARN either.** A WARN on every
   adult heparin drip floods the checker queue and trains the seat to dismiss the signal. Adult heparin,
   the 80-kg dopamine item, and a weight-dosed oncology item join the false-positive fixtures.
4. **Applicator pin — sustained. It moves to 0B.** Deferring it was the same mistake as deferring the
   `population` boundary. Once `schemaVersionAtLeast` exists the fix needs no new export:
   `schemaVersionAtLeast(existing, "1.8") ? existing : "1.8"`. No freeze needed. For the record, the blast
   radius is narrower than your report implies — post-apply validation still catches any stamp that falls
   below a real content floor, so the live defect is a declaration downgrade plus an unearned bump of
   `visual-canonical.json` (`1.7`). Narrower, not acceptable.
5. **Commit granularity — sustained.** Spelled out below.

Your canonical sweep result (zero `structuredMeasurements.population` in promoted banks) is recorded and
matches the architect's reading. It also makes the interim guard self-verifying: if `validate-bank` fails
on a canonical bank after it lands, the sweep was wrong and the migration is a content question. R4 still
stands — the canonical sweep does not cover `_promoted/`, raw, staged artifacts, or the holds.

## Read this before touching anything

`CLAUDE.md` → `AGENTS.md` → `PROJECT-HISTORY.md` → `DECISIONS.md` → `NCLEX-Question-Schema.md`, then the
amended spec. Read live from disk; do not work from the paste in a prior turn. Note that `CLAUDE.md` is
itself stale at `1.7` and that fixing it is one of your 0A tasks.

## Phase 0A — your next unit of work

Execution order is now **`0A → 0B → 3 → 1 → 2`**. Phase 0A is a guard, a doc deletion, and three reports.
Nothing else. Separate commits; architect gate before 0B.

1. **Interim `population` FAIL (R2). One commit.** `validateBankObject` rejects the presence of
   `structuredMeasurements.population`, message naming schema 2.0 as the gate. One condition, one
   fixture. Phase 1 deletes it and replaces it with the real presence floor. Do not soften it to a WARN —
   the whole point is that the boundary stops being a promise. It does not govern uploads, by design.
2. **`CLAUDE.md` (R11). A second, separate commit.** Delete the `Schema \`1.7\` is current:` sentence and
   its feature-ladder recital. Replace with the pointer text quoted in R11. Do not update the number.
3. **Sweep report (R4).** `structuredMeasurements.population` and `record.population` across `banks/*.json`,
   `banks/_promoted/`, `banks/banks-raw/`, both staged-artifact buckets, the `12G`/`12T`/`13H` holds,
   fixtures and tests. Table of file, ref, field, declared version.
4. **Applicator report (R3).** Confirm the `"1.8"` pin and the conditional `population` write, with
   `file:line`. The **fix lands in 0B**, not Phase 1 and not now.
5. **`population` vocabulary report (R10).** The enum vocabulary of `vitals_trend.population`,
   `lab_trend.population`, `burn_map.population`, and `referenceBand.population`, with `file:line`. The
   architect rules on alignment before `StructuredMeasurementPopulation` is ratified.

**Items 3–5 are response-only. They write no repository files.** Return them together and stop. Do not
begin 0B until the architect gates it.

## Phase 0B — gated, not yet authorized

When the architect opens it: `schemaVersionAtLeast` public over a private rank, throwing on unknown (R7);
both script rank maps replaced; `requireMeta: true` at `promote`, `consolidate`,
`scripts/audit/validate-bank.ts`, `src/banks.ts`, and `scripts/validate-bank.ts` (non-raw paths) (R6); the
applicator version pin (R3); the public-export regression test. `SCHEMA_VERSION` stays `1.9` throughout.

## What you must not do in 0A

- Do not build an import adapter or touch `src/bankImport.ts`. Uploads stay version-agnostic (A0.5).
- Do not remove `population`. The ruling is forward reconciliation.
- Do not reimplement Phase 3 or Phase 2 items 1, 4, 5. They are on disk and become a verification
  checkpoint (R5). If they need code, it is because verification found a defect — report it.
- Do not touch `DECISIONS.md`. Open-thread closeouts belong to the architect seat.
- Do not add tests that force the `rationale.visuals` / pacer floor retrofit. It is a standing deferral
  with its own required bank-impact survey (R8).
- Do not begin Phase 1. When it comes, the nine items in its row are **one commit or none** — no version
  token first with the pediatric detector promised afterward.
- Do not merge or push `main`. That is Luke's gate, unchanged.

## Verification for the 0A guard commit

```sh
npx tsc -b --pretty false
npm run test:schema-bank
npm run scan-unknown-keys
npm run validate-bank -- banks/*.json
npm run census:check
npm run build
```

If `validate-bank` now fails on a canonical bank, **stop and report** — that means the sweep should have
found `population` in promoted content, and the migration is a content question, not a code fix.

## Standing constraint

The pre-implementation review and the adjudication of that review must not sit in the same model family.
The implementer seat reviews, objects, and escalates; it does not adjudicate its own audit. `population`
reached four files without a version boundary precisely because nothing independent stood between the
implementer's judgment and `main`. GPT-5.6 Sol's architect memo of 2026-07-10 is advisory and non-binding,
and is superseded by Amendment 0A where the two differ.
