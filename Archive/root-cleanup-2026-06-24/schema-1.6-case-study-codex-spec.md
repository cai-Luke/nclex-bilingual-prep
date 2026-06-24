# Codex spec — Schema 1.6: unfolding-case-study field reconciliation

**Author:** Claude (spec / promotion seat)
**For:** Codex (implementation)
**Date:** 2026-06-20
**Status:** authored; awaiting architect ratification of the §6 open decisions before implementation.
**Motivating evidence:** `unknown-key-gate-report.md` (Phase 1 scan) — Classification Bucket 1.

---

## 1. Why

The Phase 1 unknown-key scan found ~110 occurrences of keys absent from `src/types.ts` that are nonetheless legitimate, systematic unfolding-case-study structure: `stageId`, `answerableAfterStageId` (on nested `caseStudy.questions[]`), `trigger`, `narrative`, `timeOffset` (on `caseStudyStage`), and `type` (on `caseStudyExhibit`). The schema trails the content. Until the types model these fields, the A1 strict-reject gate (Phase 2 of the unknown-key spec) cannot be enabled — it would reject real case content wholesale. Schema 1.6 closes that gap and is the A1 unblocker.

**Scope discipline:** 1.6 is **typing + validation only**. It makes already-present fields first-class and additive. It does **not** introduce new runtime stage-gating behavior; a code audit (§6C) confirms the app does not consume these fields today, so 1.6 is type-only and stage-gated presentation remains a separable future effort. "Type what already exists, additively" keeps 1.6 small, shippable, and immediately unblocking.

---

## 2. Fields to reconcile — shapes verified in-repo (Codex, 2026-06-20)

| Field | Object | Verified shape | Occurrences |
|---|---|---|---|
| `stageId` | nested `caseStudy.questions[]` | `string` (opaque ref — see referential note) | 81 |
| `answerableAfterStageId` | nested `caseStudy.questions[]` | `string` (opaque ref) | 6 |
| `trigger` | `caseStudyStage` | `TextPair` `{en, zh}` (bilingual) | 12 |
| `narrative` | `caseStudyStage` | `TextPair` `{en, zh}` (bilingual) | 3 |
| `timeOffset` | `caseStudyStage` | `string` (plain label, not a number) | 3 |
| `type` | `caseStudyExhibit` | `string` (only `"text"` observed — see §6E) | 7 |

112 occurrences total (the Bucket-1 subset of the 134). `trigger` and `narrative` are bilingual TextPairs — `schema.ts` must enforce bilingual parity on both.

**Referential integrity — type as opaque strings; do NOT validate stage references in 1.6.** 11 of the `stageId` / `answerableAfterStageId` values (e.g. `"adhf_triage"`, `"initial"`) do not match any declared `caseStudy.stages[].id`; they appear to name baseline/admission context rather than declared stage rows. Type both fields as plain `string`. A stage-reference integrity check is a later migration decision, not part of 1.6 — adding it now would fail those 11, and the fields are inert today (§6C) so there is no runtime cost to deferring.

---

## 3. Shape verification — DONE

Completed in-repo (Codex, 2026-06-20); results in §2. Type to those verified shapes; no further shape investigation is needed.

---

## 4. Changes

- **`src/types.ts`** — extend, all fields **optional**:
  - `CaseStudyStage`: `+ trigger?`, `+ narrative?`, `+ timeOffset?`
  - `CaseStudyExhibit`: `+ type?`
  - case sub-question shape: `+ stageId?`, `+ answerableAfterStageId?`
  - Subtlety: `caseStudy.questions` is typed `StandaloneQuestion[]`, but `stageId`/`answerableAfterStageId` are case-context fields, not standalone-question fields. Prefer `CaseSubQuestion = StandaloneQuestion & { stageId?: string; answerableAfterStageId?: string }` over polluting `StandaloneQuestion` (which is reused outside cases). Confirm the cleanest expression against the existing union.
- **`src/schema.ts`** — accept the new optional fields; add bilingual-parity validation for any field typed `TextPair` (`narrative`, possibly `trigger`). No new required-field failures.
- **`src/allowedKeys.ts`** — add the new keys to `caseStudyStage`, `caseStudyExhibit`, and the case sub-question allowed sets so the scan recognizes them. After this, Bucket 1 clears.
- **`SchemaVersion`** — add `"1.6"`.

---

## 5. Additive invariant

Additions only. Do not modify, reorder, or remove any existing field, type, or validator. Existing 1.0–1.5 banks must validate exactly as before — including the clean older case studies (`case_sepsis_pneumonia_01`, `case_preeclampsia_magnesium_01`, `cs_copd_01`) that carry **none** of these fields. Diff review rejects any non-additive change.

---

## 6. Decisions

**A. Optional, not required — CONFIRMED (code).** All six fields optional. `App.tsx` already treats `caseStudy.stages?` as optional, and the clean cases (`case_sepsis_pneumonia_01`, `case_preeclampsia_magnesium_01`, `cs_copd_01`) carry none of these fields; required-typing would break them at validation.

**B. Bank `meta.schemaVersion` labeling — RESOLVED (Luke, 2026-06-20): retroactive bump.** Bump the affected banks' `meta.schemaVersion` to `"1.6"` as a small additive migration, so the version field honestly reflects the unfolding-case fields they carry. Codex: include the bump for each affected bank in the 1.6 pass; additive only, no other meta changes.

**C. Consumption — RESOLVED: type-only (code audit, 2026-06-20).** All six fields are inert; nothing in the app reads them:
- `grading.ts` — `scoreCaseStudy` iterates `caseStudy.questions` keyed by sub-question `id`; never touches stages, exhibits, `stageId`, or `answerableAfterStageId`.
- `sessionSampler.ts` — excludes `case_study` items entirely.
- `sessionNavigation.ts` / `reviewSchedule.ts` — index / SRS only.
- `App.tsx` `CaseStudyControl` — renders `caseStudy.title`/`summary`, exhibits (`title`/`visual`/`content`, **not** `exhibit.type`), and `stages` (only `stage.id` as key + `stage.title` + `stage.exhibits`, **not** `narrative`/`timeOffset`/`trigger`). Sub-questions render all-at-once in array order with index-based "Part N"; **no** gating on `stageId`/`answerableAfterStageId`.
Therefore 1.6 is validation/typing only — no runtime behavior is coupled, and scope stays as defined in §1. Note: the data to drive stage-gated unfolding is already generated but unconsumed; that presentation is a separable future feature, explicitly out of 1.6 scope. Still type learner-facing fields (`narrative`, and `trigger` if it proves to be display text) as `TextPair` for forward-safety even though nothing renders them yet.

**D. `overview` on `caseStudy` — do not type in 1.6.** In-repo read (2026-06-20) corrects the earlier attribution: `overview` is **not** on `gpt_case_unsafe_assignment_01`. It is a single `TextPair` on `opus12_case_inpatient_suicide_risk_01` (`hard-cases`) and reads as a legacy alias for `summary`. One occurrence, ambiguous intent — out of 1.6 scope; resolve separately as a `summary`-alias cleanup or an explicit schema decision. (The `gpt_case_unsafe_assignment_01` misnesting of `rationale`/`glossary`/`testTakingStrategy` is unrelated and stays in the unknown-key closeout tail.)

**E. `type` domain — RESOLVED: `string` (not a single-value union).** Only `"text"` appears today, but typing `type?: "text"` would reject the next exhibit kind generated (lab / imaging / vitals / etc.) — and the field exists precisely to discriminate kinds, so a one-member union defeats its purpose while guaranteeing a future break. Because `type` is inert (§6C), the tight union also buys no validation value to offset that risk. Type `type?: string` for 1.6; revisit a closed union only when a real multi-value set exists to close over.

---

## 7. After 1.6 lands

Re-run `npm run scan-unknown-keys`. Expected: Bucket 1 (~110) clears; only the genuine strays (Buckets 3/4 of the report) remain. Clean those individually, then the A1 strict-reject gate (Phase 2 of the unknown-key spec) becomes enable-able over a clean corpus.

---

## 8. Boundary

Codex implements after the §3 in-repo shape verification and architect ratification of §6. Claude reviews the observed-shape report and the diff before promotion. Producer ≠ checker.
