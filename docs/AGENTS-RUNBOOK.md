# Project Shrimp — Operational Runbook

Companion to [`AGENTS.md`](../AGENTS.md), which is constitutional: principles, roles, and binding invariants. This file contains operational detail: exact commands, quote-safety forensics, normalization mechanics, promotion routing, ledger timing, and troubleshooting. If this file and `AGENTS.md` ever disagree, `AGENTS.md` wins.

## Commands

**Promotion pipeline** — moving content from `banks/banks-raw/` into a canonical bank:

```sh
npm run fix-bank-quotes -- banks/banks-raw/<file>.json    # repair curly-quote corruption; writes <file>.fixed.json unless --in-place
npm run normalize-raw-bank -- banks/banks-raw/<file>.json # dry-run schema-shape cleanup; add --write after review
npm run promote                                           # deterministic shuffle → banks/_promoted/<same-filename>
npm run audit                                             # Tier 0 validation + Tier 1 references/positions/integrity/ids
npm run consolidate -- --dry-run                          # preview route, collision gate, and merged count
npm run consolidate                                       # merge into canonical and remove staged promoted file
```

The shuffled output in `banks/_promoted/<same-filename>` merges into the canonical bank selected by filename prefix. Resolve the destination by reading `CANONICAL_PREFIXES` in `lib/canonical-routing.ts` — that array is the executable source of truth for prefix-to-canonical routing; `DECISIONS.md` records why the routing, and the frozen-set/live-target split, exist. Do not hand-maintain a prose copy of the table here.

`npm run consolidate` is the canonical merge path: route, validate, schema-version guard, global top-level/embedded ID collision gate, append, recount `meta.count`, deterministic serialize, and remove the consumed staged file. Do not hand-merge canonicals.

If a raw draft fails `validate-bank` with a JSON parse error, recover the quotes deterministically before review:

```sh
tsx scripts/fix-bank-quotes.ts banks/banks-raw/<file>.json
```

The command writes `<file>.fixed.json` when recovery succeeds; add `--in-place` only after reviewing the result. If recovery cannot parse the file, the script pinpoints the remaining failure. Do not hand-fix parse corruption.

`audit:integrity` requires the draft to remain in `banks/banks-raw/` and the promoted file to remain in `banks/_promoted/`. Delete a draft only after the promoted output has been consolidated, the audit passes, and the ledger is updated. `audit:ids` fails any duplicate bundled question ID across top-level questions and embedded case-study leaves.

Run before calling a code or content pass complete when relevant:

```sh
npm run validate-bank -- banks/*.json
npm run coverage-report
npm run census
npm run build
```

After regenerating the census, commit both `census.json` and `BANK-CENSUS.md` with the bank change. `npm run census:check` fails CI when either is stale.

Development:

```sh
npm run dev
npm run preview
```

## Editing Raw Bank JSON (Quote Safety)

Raw banks are JSON; do not let a model retype their structure. Two corruption modes have reached the promotion gate, both from free-form rewrites of `case_study` stage sections:

- **Structural curly quotes:** replacement text used `“ ”` (U+201C/U+201D) as key or value delimiters, such as `“id”` and `“content”`. The JSON cannot parse.
- **Downgraded content quotes:** Chinese speech marks inside a `zh` value came back as bare, unescaped ASCII `"`, terminating the string early. The JSON cannot parse.

Rules:

- Migrate JSON shape with a programmatic transform, never a free-form edit. Load → mutate the object → re-serialize with `JSON.stringify` or `json.dumps(..., ensure_ascii=False)`. Prefer `scripts/patch-raw.ts` and its declarative before→after form over an ad hoc rewrite (`DECISIONS.md` principle 15).
- When a targeted text edit is unavoidable, keep structural quotes as ASCII `"`, use Chinese quotation marks only inside string values, escape every literal ASCII quote inside a string as `\"`, and run `npm run validate-bank -- <file>` immediately after that edit.
- Do not batch multiple targeted JSON edits before validation.

## Mechanical Normalization vs. Generation Prose

Keep deterministic shape repair in code instead of repeating long prompt guardrails:

- `npm run normalize-raw-bank -- banks/banks-raw/<file>.json` dry-runs structural normalization and validates the normalized result.
- Add `--write` only after reviewing the reported changes.
- Current normalizations cover `ngnSkill` display/camel/spaced casing to exact enum values; legacy glossary objects to schema `1.6` `{ termEn, termZh, defZh }` when all three values exist; empty optional `rationale.visuals` removal; and stale `meta.count` correction.
- Validators and audits own schema floors, exact enums, topic English-only, ID/reference integrity, visual placement, visual `selfCheck`, and position-dependent rationale scans. Normalization does not duplicate them.

Semantic review still owns clinical ambiguity, unsafe sequences, weak distractors, bilingual clinical parity, stale guideline risk, topic saturation strategy, and whether a visual is genuinely load-bearing.

## Ledger Procedure

- `BANK-REVIEW-LEDGER.md` tracks per-bank content-review status.
- Update it at promotion time: after a raw or staged file is merged into a canonical bank and the audit passes, before the raw file is deleted. Do not pre-approve a draft or defer ledgering to a later cleanup pass.
- Record the deleted source filename in the same ledger entry as the promotion.
- `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md` is the separate ledger of record for structured-measurement flowsheet migration batches.

## Troubleshooting

**A raw bank will not parse:** run `tsx scripts/fix-bank-quotes.ts banks/banks-raw/<file>.json`, review the generated fixed file, and add `--in-place` only when appropriate. Do not hand-diagnose smart-quote corruption.

**`audit:integrity` reports `INSUFFICIENT`:** this is expected when no raw draft files are present in `banks/banks-raw/`; the gate is reporting that it has nothing to compare.

**A documentation version-floor claim looks wrong:** check the `SchemaVersion` union in `src/types.ts` and the corresponding validator in `src/schema.ts` directly. Do not resolve one document's claim using another document's restatement.
