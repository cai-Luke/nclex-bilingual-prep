# Exhibit Flowsheet Extraction — Deterministic Contract (Rules A–F)

Date: 2026-07-03. Status: the values-only structured-measurement migration this contract was
authored for **closed 2026-07-13** with no open holds. This document is **not** re-derived code
documentation — it is an authority map plus the one enduring semantic rule (Rule F) that the
deterministic gate cannot check for itself. For every mechanical claim (allowlist keys, unit
conversion, staged/canonical record shape, gate pass/fail behavior), the executable source below is
authoritative; if this prose and the code ever disagree, the code wins and this file is stale.

Historical provenance — the original smoke batch, the batch-by-batch migration run, and the earlier
draft/amendment history of this contract — lives in
`Archive/exhibit-flowsheet-migration-2026-07-13/` and `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md`.
Do not treat this file as a second copy of that history.

## Authority map

| Concern | Owning source |
| --- | --- |
| Measurement allowlist (keys, canonical unit, accepted source units, sanity bounds) | `src/measurementAllowlist.ts` |
| Unit conversion / display policy | `src/measurementUnitPolicy.ts` |
| Staged extraction record shape, gate mechanics, GATE 1–4, Rule A–E checks, G1–G8 column checks | `scripts/exhibit-flowsheet-gate.ts` (see its own header comment, which is kept current) |
| Staged → canonical promotion, `--proof` / `--refs` promotion flow | `scripts/apply-structured-measurements.ts` |
| Canonical bank shape (`StructuredMeasurements`, `StructuredMeasurementPanel`, `StructuredMeasurementColumn`, `StructuredMeasurementValue`) | `src/types.ts` |
| Schema-level validation of the canonical shape | `src/schema.ts` |
| Batch-by-batch migration record | `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md` |

The allowlist is not limited to the vitals/lab-analyte registries it was originally derived from —
`src/measurementAllowlist.ts` also carries structured-measurement-only entries (currently
`troponin_i`, `sao2`, `uric_acid`) that have no `vitals_trend`/`lab_trend` renderer key. Read the
file directly rather than trusting any key list written in prose, including this one.

## Gate mechanics, in one paragraph each

**GATE 1 — verbatim containment.** Every `value` (and `sourceSpan`, and unit-alias/excluded value)
must be a byte-exact substring of the source `content.en` after one NFC normalization pass. A value
that does not round-trip is a hard FAIL.

**GATE 2 — exclusion accounting.** ADVISORY. The gate validates that every *supplied* exclusion is
well-formed (allowlisted label, verbatim value, reason in the closed enum), and runs a best-effort
source sweep that WARNs — never FAILs — when an allowlisted-looking label appears in source but is
neither keyed, excluded, nor aliased. Authoritative completeness is a human/senior-review
responsibility, not a gate guarantee.

**GATE 3 — narrative preservation.** Enforced by construction: the gate has no write path and never
mutates a bank; the applicator only adds the additive `structuredMeasurements` field.

**GATE 4 — dimensional sanity.** Each keyed value, converted from its `sourceUnit` to canonical, must
fall inside the analyte's `sanity{min,max}` band. **This is a WARN, not a FAIL, by default** — it
can also fire on a genuinely extreme real value, so it routes to human review rather than
auto-rejecting. Pass `--strict` to promote GATE 4 (and any other WARN) to a hard FAIL for a
promotion-gate run; the default `main()` exit code is non-zero only when a FAIL-level finding exists
or `--strict` is set and a WARN exists.

**Rules A, B, C, D (mechanical parts), E** are enforced directly in `gateRecord()` — allowlist
membership, out-of-allowlist tokens never being accountable, `sourceUnit` presence/recognition,
duplicate-current-label hard FAIL plus the generalized serial re-derivation (`serialParams`, any
allowlisted parameter, not just BP), and required-verbatim `sourceSpan`. Read the function directly
for exact conditions; it is short and current.

**Explicit multi-column staging (G1–G8).** A staged record may declare `columns[]` (`id`,
`panelKind`, bilingual `label`, source-verbatim `evidence`) and reference them from `panel[]` via
`columnId`. The gate enforces unique column ids per panel kind, every `columnId` resolving to a
declared column, every column being referenced, no duplicate `(label, columnId)` cell, and
verbatim-evidenced columns; legacy records with no `columns`/`columnId` are unaffected and promote
through the applicator's implicit single `"current"` column. See `scripts/exhibit-flowsheet-gate.ts`
and `scripts/apply-structured-measurements.ts` for the exact rules; both were exercised end-to-end by
the first real multi-column promotion (`gpt_case_refeeding_syndrome_tpn_01/baseline_record`).

## Reference/flag columns remain out of this contract's scope

This extraction lane emits values + units only. Epic-style H/L flags or reference-range columns
depend on the `lab_trend`/`vitals_trend` registry bands and are a separate, later decision — not
addressed by this document.

## Rule F — normative (the one rule the gate cannot check for itself)

Everything above is mechanically enforced. Rule F is not: whether a measurement should carry
`context: "post_intervention"` is an irreducibly semantic call about *why* a value was taken, and the
gate only validates that a supplied `context` is in the closed tag set (`CONTEXT_TAGS` in the gate
script). This is the one place adjudication judgment, not code, is the enforcement mechanism.

**A post-intervention reading is the current value: keyed with `context`, never excluded.** A value
framed as the effect of an intervention (`Blood pressure after labetalol: 148/94`) is the *most
current* reading, not a superseded one. It is keyed in `panel[]` with an optional
`context: "post_intervention"` annotation; `post_intervention` is not a member of the
`excludedValues` reason enum (`{prior, trend, serial}`, plus legacy-only `comparator`).

**Operative test — when `context: "post_intervention"` applies (2026-07-11, Luke ruling,
architect-ratified).** Keying a post-intervention reading is not the same as *tagging* it.
`context: "post_intervention"` applies to a keyed current measurement only when the source
establishes that the measurement occurred **after an intervention directed at that measurement or
measurement domain.** Temporal linkage may be explicit language ("after," "following," "while
receiving," "on [active device/infusion]") or unambiguous narrative/exhibit sequencing; **mere
co-location in the same exhibit, panel, or timestamp is insufficient**, and neither is an earlier
record's attribution carrying forward to a later record whose own text is bare — each record's tag
is judged against its own sourceSpan. A background cause of the whole panel (TPN initiation, an
evolving disease process) is not a directed intervention and tags nothing.

Worked example (`gpt_case_refeeding_syndrome_tpn_01`, stages 2–3). Stage 2 prose: "the nurse
administered KCl … sodium phosphate … magnesium sulfate … per protocol … Sliding-scale regular
insulin was added … Repeat labs now: potassium 2.9, phosphorus 1.3, magnesium 1.3, glucose 226,
creatinine 0.9." **Potassium, phosphate, magnesium** (electrolyte-repletion domain) and **glucose**
(insulin) are directed reassessments → tagged. **Creatinine** (no directed intervention) and **all
six vitals** (no directed agent) are current values → **not** tagged. The rule closes two symmetric
errors this record surfaced: (a) TPN initiation — the true cause of the falling electrolytes —
occurs in an earlier, already-`skip_serial` stage, so "untag because TPN is the cause" misattributes
that earlier stage's causation forward; (b) uniformly tagging the whole panel over-applies the tag to
creatinine and vitals. The directed-measurement test, applied per-record rather than per-case, yields
the correct split where both blanket dispositions fail.

## Adjudication rubric (reusable for any future extraction work under this contract)

For each staged panel, mark:
- **Containment:** did every keyed value round-trip verbatim? (deterministic — the gate answers this)
- **Selection correctness:** is every keyed value the *current* reading, not a prior/trend value? (human)
- **Exclusion correctness:** was every non-keyed measurement correctly excluded with the right reason? (human)
- **Context correctness:** does `post_intervention` disposition follow Rule F's operative test, judged
  per-record? (human — always-sampled 100%, never a deterministic heuristic)
- **Residual integrity:** if this panel were rendered as a flowsheet alongside the untouched prose,
  does the combination read cleanly? (human — the product-design call, resolved toward supplement:
  prose stays intact, the structured panel is additive)

## Status

The full values-only structured-measurement migration closed 2026-07-13 with no open holds or
flagged tag disputes. This contract (GATE 1–4, Rules A–F, the authority map above) remains the
governing extraction policy for any future structured-measurement work; it is not scoped to the
closed migration alone. Detailed batch/candidate chronology, the original worst-case smoke batch, and
superseded record-shape drafts are archived in `Archive/exhibit-flowsheet-migration-2026-07-13/`.
