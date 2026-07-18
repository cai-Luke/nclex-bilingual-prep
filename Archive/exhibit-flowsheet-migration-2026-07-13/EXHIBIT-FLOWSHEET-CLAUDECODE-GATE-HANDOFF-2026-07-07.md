# Exhibit Flowsheet — Claude Code Promotion-Gate Handoff (first review)

Date: 2026-07-07
Audience: Claude Code (promotion-gate seat for structured measurements)
Authoritative contract: `Archive/root-specs-2026-07-18/structured-measurements-schema-1.8-codex-spec.md` and `DECISIONS.md`
principle 24.

## Your role

You are the promotion gate for structured-measurements batches. Codex stages, runs the applicator in
dry-run, and runs the mechanical gates, then hands you the dry-run diff + gate output. You do the
content review and make the write/commit decision. Producer≠checker: Codex does not self-promote to
`main`; that step is yours (`DECISIONS.md` principles 2 and 24).

The 7-exhibit proof batch (commit `959a5f0`) was already architect-verified clean this session — do
**not** re-litigate it. Your first review is the next staged batch.

## The one check the architect could not run (do this first)

Re-run the flowsheet gate against the **current** canonical banks:

```sh
npm run flowsheet-gate -- <staged-artifact.json> --bank banks/<routed-bank>.json
```

The schema validator checks key/unit/columnId/kind and rejects flags/ranges, but it does **not** check
that a staged value is still verbatim in the current exhibit prose. Only the gate does. Banks are
co-edited between sessions, so a staged span from 07-05/06 can drift. Require **0 FAIL**; adjudicate
every WARN (GATE-4 out-of-band, source-unit-laundering, GATE-2 advisory) rather than waving it through.

## Content review of the dry-run diff

For each exhibit the applicator would touch:

- **Values verbatim** in the source `content.en` (the gate covers this; spot-confirm on the diff).
- **Correct allowlist key** — e.g. serum `CO2` → `bicarbonate`, not `hco3_abg` (no ABG context);
  ABG `HCO3` → `hco3_abg`.
- **Correct panel kind** — `labs` panel rows must be `def.kind === "lab"`, `vitals` rows `"vital"`.
  With the split, `sao2` is a **lab** (ABG panel) and `spo2` is a **vital**.
- **Accepted unit** for the key; the stored `unit` is an accepted input unit, not the raw prose token.
- **Not present in canonical:** `excludedValues`, `unitAliases`, `skip_serial`, empty extracts. The
  applicator only reads `record.panel`, so these should never appear — confirm.
- **Prose preserved (supplement)** unless the ref is in `REPLACE_REFS` — and it should only be there
  when *every* learner-facing fact is captured by structured fields. Precedent: the elder-neglect
  clean-KV record kept its prose because albumin/prealbumin/eGFR are non-allowlisted; a pointer would
  have hidden them. When in doubt, supplement.
- **No flags/ranges** (schema rejects them; confirm the diff carries none).

## SaO2 / troponin-I split guard

The staged artifacts predate the `sao2`/`troponin_i` split. Reject or return any staged ref that keys
SaO2 as `spo2` or troponin I as `troponin_t` (e.g. `cs_copd_01/labs` "SaO2: 85%" → `spo2`; Batch 20
row 14 troponin I → `troponin_t`). These must be re-extracted by Codex before they promote.

## Mechanical suite (all green before `--write`)

```sh
npm run validate-bank -- banks/*.json
npm run scan-unknown-keys
npm run test:structured-measurements
npm run census && npm run census:check
npm run build
```

## Then, and only then

- `npm run structured-measurements:apply -- --proof <artifacts> --write` (or the wide equivalent).
- Commit.
- **Amend the migration ledger** (`EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-*.md`) with the promoted refs and
  your gate verdict. Codex is also correcting the stale header for the proof batch; keep the ledger the
  single source of what has actually promoted.

## Sequencing / taper

- Prefer landing the **temp display policy fix** (Codex item 2) before wide promotion so temp-bearing
  cases render °F-primary immediately; it is display-only, not a data blocker.
- The proof (7) is done; wide promotion is a batch-adjudication loop. Sample per the established taper —
  25% seeded-random **plus** always-sample the risk surfaces: unit aliases, `prior`/excluded values,
  `post_intervention` context, any mixed labs+vitals exhibit, and any SaO2/troponin ref.
- Escalate genuine ambiguities (not mechanical WARNs) to the architect seat; do not bulk-approve.

## Reference

- Proof verdict + applicator/allowlist/gate/validator verification: this session's architect review.
- Applicator: `scripts/apply-structured-measurements.ts`. Gate: `scripts/exhibit-flowsheet-gate.ts`.
- Codex follow-ups: `EXHIBIT-FLOWSHEET-CODEX-HANDOFF-2026-07-07.md`.
