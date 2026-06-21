# Unknown-key strip gate — closeout & Phase 2 disposition

**Author:** Claude
**For:** Codex
**Date:** 2026-06-20
**Re:** `unknown-key-strip-gate-codex-spec.md` (the original two-phase spec)

---

## Status

- **Phase 1 (scan + allowed-key manifest): done.** `src/allowedKeys.ts`, `scripts/scan-unknown-keys.ts`, `npm run scan-unknown-keys`, and `unknown-key-gate-report.md` landed. Output was reviewed against `src/types.ts` and reclassified — the report and `PROJECT-HISTORY.md` are amended to reflect it.
- **Phase 2 (A1 strict-reject gate): deferred, do not implement now.** The scan showed ~110 of 134 flagged occurrences are legitimate unfolding-case structure the types don't yet model, not drift. Enabling A1 now would reject real case content. **A1 is blocked behind Schema 1.6** (`schema-1.6-case-study-codex-spec.md`), which types those fields. Re-activate Phase 2 only after 1.6 lands and a re-run scan is clean.

---

## Completed immediate whitelist change

`pattern_keyed` was added to `allowedKeySets.questionMeta` in `src/allowedKeys.ts`. It is an audit-only keyed field, sibling of `keyed_cells` / `expected_pattern` already in that set — a whitelist omission, not bank data. The rerun cleared the 7 capnography false positives.

Schema 1.6 has since typed the legitimate unfolding-case metadata and cleared Bucket 1. Everything below remains a cleanup/provenance decision, not part of the 1.6 implementation.

---

## Deferred — architect decisions, not Codex actions yet

- **Genuine strays (report Bucket 3).** `id` duplicating `refId` on the six `cs_copd_01_q1` `byChoice` entries (confirmed benign — grading keys off `refId`); one stray `en` on a glossary term (`opus_tpn_case_mucositis_01_q3`). Strip when those banks are next touched; not urgent.
- **Bank-meta provenance (report Bucket 4).** `generatedAt` / `bankIdPrefix` / `lane` on `io-canonical.json` `$.meta`. Keep (type a provenance block in `bankMeta`) or strip (like `_compileManifest`). Present on this one bank only.
- **`gpt_case_unsafe_assignment_01`.** `rationale` / `glossary` / `testTakingStrategy` appear misnested inside the `caseStudy` object rather than at question level. Confirm the question-level required fields are intact before stripping the nested copies. (Jun-19 float-nurse case, promoted through the hardened gate — evidence for the original Finding A. An in-repo read reattributed the previously-listed `overview` away from this item — see next bullet.)
- **`overview` (1 occurrence).** A `TextPair` on `opus12_case_inpatient_suicide_risk_01` (hard-cases), reading as a legacy alias for `summary`. Out of Schema 1.6 scope; resolve as a `summary`-alias cleanup or an explicit schema decision.

---

## Not pursued here

The original spec's **producer-side complement** — closing the glossary key-set at generation to lower `termDef`-style emission — remains a separate, still-open item, independent of this gate and of Schema 1.6.
