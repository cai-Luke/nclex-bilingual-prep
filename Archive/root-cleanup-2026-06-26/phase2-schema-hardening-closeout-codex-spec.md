# Codex spec — Phase 2 schema-hardening closeout (2026-06-23)

**Author:** Claude (spec / promotion seat)
**For:** Codex (implementation)
**Re:** the content-pause stabilization sprint. Two independent deterministic closeouts, ordered. **Step A ships on its own; Step B is gated on a clean re-scan.** Do A first, stop, and hand back before starting B.

## Resolved deltas (2026-06-23, post-Codex live read — these override the step bodies below where they conflict)

1. **Step A is already implemented.** `scripts/promote.ts` already calls `normalizeBankPresentations(shuffled)` (from `lib/presentation-normalization.ts`) after `shuffle`, covering MC/SATA/ordered options, dropdown options, matrix columns, and embedded case leaves. Step A is therefore a **verify-and-test closeout**, not fresh implementation. (DECISIONS' "promote-time normalization extension open / leaning yes" thread is stale — mark it implemented.)
2. **A0 diagnostic outcome.** `normalize-presentations` reports no drift on `gpt-gap-jun12-rrp-bcc` (the recorded scramble-depth FAIL was small-n Kendall noise / already resolved). The one live canonical drift is `gemini-canonical.json` → `gap_50_sic_04` → `matrix.columns`.
3. **Sanctioned path for the one-time presentation rebaseline:** `npm run normalize-presentations -- --write banks/gemini-canonical.json` (review the dry-run diff first, then validate/audit/census/build). This is **distinct from `patch-raw`** and is *not* a content change — it preserves keys, IDs, text, and counts. "Step A makes no content changes" still holds.
4. **Step B residual is 16, not 15.** Live scan adds `gpt_fresh_2026_06_22_vis_07` carrying `meta.custom: {}` — strip.
5. **Bank-`$.meta` strip mechanism:** do **not** extend `patch-raw` (it is question-ID scoped and unsuited to presentation/meta ops) and do **not** write a one-off. Use the **A2 strip-to-schema pass** as the single one-time canonical cleanup for all pure-deletion residuals together — `io-canonical` `$.meta` provenance (`generatedAt`/`bankIdPrefix`/`lane`), `meta.custom`, the `opus_tpn` glossary stray `en`, and the six `cs_copd_01_q1` duplicate `id`s (the scanner already walks bank-envelope `$.meta`). Reviewed dry-run → write. Two residuals stay out of that pass: `gpt_case_unsafe_assignment_01` (confirm question-level required fields present; strip nested copies only if pure duplicates, else structural move) and `overview`→`summary` (rename, targeted edit).
6. **A1 scope = pipeline only, via a strict-mode flag.** `src/bankImport.ts` runs every uploaded question through the shared `validateQuestion` and skips failures, so an unconditional reject would make learner imports silently drop questions with extra keys. Thread a `rejectUnknownKeys` option from `validateBankObject` down: ON for promote/consolidate/validate-bank/audit, OFF for `bankImport` (imports stay forgiving, unchanged). Not strict everywhere.
7. **Audit wiring:** with A1 in `validateBankObject` (strict path), Tier 0 covers it automatically. Do **not** separately wire `scan-unknown-keys` into `npm run audit`; keep it as an on-demand diagnostic.

## Codex execution checklist (authoritative — follow top to bottom; the Step A / Step B sections below are reference detail, not separate instructions)

Verified against live source 2026-06-23. Re-confirm anything that looks stale before acting.

**Step A — presentation normalization (verify + one rebaseline; no re-implementation).**
1. Confirm `scripts/promote.ts` already calls `normalizeBankPresentations(shuffled)` after `shuffle` (it does, via `lib/presentation-normalization.ts`, covering MC/SATA/ordered options, dropdown options, matrix columns, embedded case leaves). Do **not** re-fold it.
2. Add/extend promote-path tests for the dropdown/matrix/ordered axes and embedded case leaves (key/ID/ref/bilingual/count preservation).
3. `npm run normalize-presentations` (dry-run) over canonical. The only live drift is `banks/gemini-canonical.json` → `gap_50_sic_04` → `matrix.columns`; `gpt-gap-jun12-rrp-bcc` is clean. Review the diff, then `npm run normalize-presentations -- --write banks/gemini-canonical.json`. This is presentation-order only (keys/IDs/text/counts preserved) — not a semantic content change and not a `patch-raw` job.
4. `npm run validate-bank -- banks/*.json` · `npm run audit` · `npm run census` · `npm run build`. Hand back. Do **not** start Step B in the same pass unless authorized.

**Step B — unknown-key strict reject (gated on a clean re-scan).**
5. `npm run scan-unknown-keys`; use the **live** residual list (the live scan adds a 16th finding, `gpt_fresh_2026_06_22_vis_07` → `meta.custom: {}`).
6. Clean every **pure-deletion** residual in one reviewed **strip-to-schema cleanup pass** (the gate's documented strip mechanism; the scanner already walks bank-envelope `$.meta`), **not** `patch-raw` and **not** a one-off: `io-canonical.json` `$.meta` provenance (`generatedAt`/`bankIdPrefix`/`lane`) [strip], `meta.custom` [strip], the `opus_tpn` glossary stray `en`, and the six `cs_copd_01_q1` duplicate `id`s. Reviewed dry-run → write.
7. Two residuals are **not** deletions: `overview` → `summary` (targeted rename), and `gpt_case_unsafe_assignment_01` (inspect first — strip the nested `rationale`/`glossary`/`testTakingStrategy` only if they are true duplicates of present question-level fields; otherwise structurally move the preserved content up).
8. Re-scan until zero.
9. Implement strict reject in `src/schema.ts` as a `rejectUnknownKeys` option that **defaults OFF**. Pipeline call sites pass it **explicitly ON** — `validateBankObject` for promote / consolidate / validate-bank / audit. `bankImport` (learner uploads) leaves it OFF, so imports stay forgiving / skip-invalid as today. Do not make strictness a global default.
10. Confirm `npm run audit` now fails unknown keys through its existing Tier 0 `validate-bank` path. Do **not** invoke `scan-unknown-keys` from audit; keep the scanner on-demand.
11. Tests: per-type reject fixture; clean-object pass; `termDef` regression reject; determinism + bilingual-parity green. `npm run census`; commit `census.json` + `BANK-CENSUS.md`.
12. Update `PROJECT-HISTORY.md` (this is a standing-gate change) and `BANK-REVIEW-LEDGER.md` (the canonical cleanups).

Producer ≠ checker: Claude reviews the scan/diagnostic outcomes, the residual classification, the strip diffs, and the A1 gate before the architect acts.

## Source of truth — read live before encoding anything

Pull and read each file; do not reconstruct from memory or git history. Anchors drift — confirm against the live file and `dryRun: true` before any edit.

- `scripts/promote.ts` — applies the `lib/shuffle.ts` option-order shuffle to every draft; `stripCompileManifests` (from `lib/case-completeness.ts`) runs before validation here.
- `scripts/normalize-presentations.ts` + `npm run normalize-presentations` — the standalone, dry-run-default, ID-seeded, key-preserving display-order normalizer over dropdown options, matrix columns, ordered-response pools, and MC/SATA option pools (covers embedded `caseStudy.questions`). The 2026-06-12 rebaseline vehicle.
- `scripts/audit-non-mcq-bias.ts` + `lib/non-mcq-bias-lib.ts` — the advisory structural-bias audit and its template-keying normalization.
- `scripts/audit.ts` — the Tier 0/1 gate (`validate-bank` + `audit:references`/`positions`/`integrity`/`ids`).
- `src/allowedKeys.ts` — the single allowed-key manifest (Phase 1 of the unknown-key gate). `scripts/scan-unknown-keys.ts` + `npm run scan-unknown-keys` consume it.
- `src/schema.ts` — validators; the A1 gate lives here alongside the existing required-key/id checks.
- `scripts/patch-raw.ts` — the only sanctioned canonical-mutation path (`--allow-canonical --reason`, forces a `BANK-REVIEW-LEDGER.md` entry). Per DECISIONS principle 15, canonical JSON is never free-hand-edited.

Treat the repo as source of truth; if it conflicts with this spec, prefer the repo and flag the conflict.

---

## Step A — Non-MCQ promote-time normalization (ship first; verify/test only — no *semantic* content changes; a presentation-order-only canonical rebaseline is permitted) — *reference; see checklist above*

Per the DECISIONS open thread "Non-MCQ bias audit — advisory now; promote-time normalization extension open." Today `promote.ts` normalizes only **option order** (via `lib/shuffle.ts`). The extended structural axes (dropdown options, matrix columns, ordered-response pools) are normalized only by the standalone `normalize-presentations.ts` pass, so a draft promoted without that pass can carry an un-normalized axis into canonical.

**A0 — resolve the recorded diagnostic first.** The open thread names `gpt-gap-jun12-rrp-bcc` as still showing `ordered_response / scramble_depth` FAIL (`fix_class: SHUFFLE_AT_PROMOTION`, n=3): either it bypassed the normalizer or it is small-n Kendall noise, and "if it bypassed, that is direct evidence the promote path does not yet apply extended normalization." Run `npm run normalize-presentations` (dry-run) over the canonical banks. If it reports changes to `gpt-gap-jun12-rrp-bcc` (or any bank's dropdown/matrix/ordered axes), that confirms the bypass and that a one-time canonical normalize pass is needed alongside the fold. If it reports no changes there, the n=3 FAIL is mean-Kendall noise — record that and move on. State the outcome in the handback.

**Already satisfied — do not re-implement.** `promote.ts` already applies `normalizeBankPresentations(shuffled)` after `shuffle`, across all structural axes (not just option order), preserving keys, IDs, rationale refs, bilingual text, counts, and embedded `caseStudy.questions`. Verify it is present and reused (single-transform discipline, DECISIONS principle 2); do not re-fold it.

**Audit stays advisory (not a gate).** Do **not** wire `audit-non-mcq-bias.ts` into `npm run audit` as a blocking gate. Rationale, to record in the handback: the integrity-class findings (answer-reference mismatch, missing rationale reference, invalid keyed answer, orphaned dropdown/row/blank ref, ID collision) are **already** hard-failed by Tier 0 `validate-bank` + Tier 1 `audit:references`/`integrity`/`ids`; the audit's only net-new findings are *distributional* (SATA correct-count concentration, ordered-response template repetition), which DECISIONS principle 16 routes to content authoring + dilution, not a gate — and blocking on them is moot while content generation is paused. Leave the audit as the advisory on-demand check it is.

**A — integrity-audit coupling.** `audit:integrity` compares retained raw drafts against the normalized promotion output. After the fold, confirm the in-promote normalization produces output **identical** to the standalone `normalize-presentations` pass, so the integrity comparison still holds; update the integrity comparison only if the fold deliberately changes what "normalized output" means.

**A — tests / verify.**
- Extend `scripts/tests/` promote coverage: a draft with an un-normalized dropdown/matrix/ordered axis is normalized in-path by `promote`; keys/IDs/refs/bilingual text/counts preserved; embedded case leaves normalized.
- `normalize-presentations` idempotency + byte-stability suites stay green.
- `npm run validate-bank -- banks/*.json` · `npm run audit` · `npm run build`.

---

## Step B — A1 unknown-key strict-reject (gated on a clean re-scan)

Per `Archive/root-cleanup-2026-06-24/unknown-key-gate-closeout.md`: Phase 1 (scan + `src/allowedKeys.ts` manifest) is done; A1 (Phase 2 strict-reject) was blocked behind Schema 1.6, **which has now landed and cleared the ~110 unfolding-case occurrences (Bucket 1)**. Re-activate A1 only after a re-run scan is clean. A2 (silent strip-to-schema) is the documented lighter-weight fallback if A1 proves too brittle.

**B0 — re-run the scan; do not hardcode the old residual list.** `npm run scan-unknown-keys` against current canonical (post-1.6, post-Jun-22 promotions). Use its live output as the authoritative residual list; the Jun-20 enumeration below is the *expected* shape, not the spec of record.

**B1 — resolve residuals via the right deterministic tool per type** (none is a free hand-edit; DECISIONS principle 15). **Pure-deletion** residuals → the reviewed **strip-to-schema cleanup pass** (the gate's documented strip mechanism; it walks bank-envelope `$.meta` too), **not** `patch-raw`. The `overview`→`summary` rename and any structural move → a targeted declarative edit. `patch-raw --allow-canonical` is for semantic before→after content patches, which none of these are. Expected residuals from the closeout:
- **Benign strays — strip.** `cs_copd_01_q1` `byChoice[].id` duplicating `refId` (6 entries; grading keys off `refId`, confirmed benign). One stray glossary `en` on `opus_tpn_case_mucositis_01_q3`.
- **`gpt_case_unsafe_assignment_01` — confirm then strip.** `rationale` / `glossary` / `testTakingStrategy` appear misnested inside the `caseStudy` object. Verify the question-level required fields are present and intact **before** stripping the nested copies.
- **`io-canonical.json` `$.meta` provenance (`generatedAt` / `bankIdPrefix` / `lane`) — decided: strip** (Luke, 2026-06-23), via the strip-to-schema cleanup pass — not a typed provenance block.
- **`overview` on `opus12_case_inpatient_suicide_risk_01` — rename.** A `TextPair` reading as a legacy alias for `summary`. Rename to `summary` rather than adding a one-off typed alias (schema changes stay rare).

**B2 — implement A1.** In `src/schema.ts`, per object type (question top-level, `options`, `rationale`, glossary terms, matrix rows, dropdowns, exhibits, …), fail validation with a precise per-type reason when a key is absent from the `src/allowedKeys.ts` whitelist (`glossary[${i}] has unknown key '${k}'`, etc.). The gate runs **after** `stripCompileManifests` in the promote path; anything still off-schema by then is drift by definition. Import the whitelist from the single `src/allowedKeys.ts` source — do not re-declare key lists.

**B3 — name A2 as the fallback** in the handback (silent strip-to-schema), so the architect can swap deliberately if A1 is too brittle for iteration.

**B — tests / verify.**
- Fixture: object with an unknown key → fails with the exact per-type reason. Clean object → passes. Regression: a glossary entry carrying `termDef` → rejected.
- Determinism + bilingual-parity suites green.
- After residuals are clean: `npm run scan-unknown-keys` exits zero · `npm run validate-bank -- banks/*.json` · `npm run audit` · `npm run build`. Confirm `npm run audit` fails unknown keys through its existing Tier 0 `validate-bank` path (strict mode ON there); do **not** invoke `scan-unknown-keys` from audit.
- Regenerate `census.json` + `BANK-CENSUS.md` after any canonical edit (`npm run census`); commit both (`census:check`).

---

## Boundary

Codex implements; it does not self-certify content correctness. Claude reviews the A0 diagnostic outcome, the residual classification, the patches, and the A1 gate before the architect acts (producer ≠ checker). No semantic clinical rewrites in this work. Do not hand-edit bank JSON: off-schema-key deletions go through the strip-to-schema cleanup pass, display-order through `normalize-presentations`, and semantic before→after through `patch-raw --allow-canonical`. Update `PROJECT-HISTORY.md` when the pass lands (standing-gate change) and `BANK-REVIEW-LEDGER.md` for the canonical cleanups. Leave unrelated worktree edits alone. The producer-side glossary-prompt fix (closing the glossary key-set at generation) remains a separate, still-open complement and is **out of scope** here.
