# Project Shrimp Dev Feature Spec — Question ID Lookup & Review Console (v2)

**Status:** Still useful. Implement after or alongside `validate-sweep`. Must use the post-roadmap manifest schema and current renderer registry.

## Current repo assumptions
* Project Shrimp is now schemaVersion `1.2`.
* The visual renderer registry has landed.
* Supported visual kinds are exactly:
  * `rhythm_strip`
  * `capnography`
  * `vitals_trend`
  * `lab_trend`
  * `mar`
  * `io_record`
  * `medication_label`
  * `device_screen`
  * `fetal_monitoring`
  * `burn_map`
  * `null`
* Do not use legacy renderer names: `ecg_rhythm_strip`, `fetal_monitor_tracing`, `chest_tube_drainage`, `wound_stage_diagram`, `lab_panel`, `intake_output_chart`
* `highlight` and `bowtie` remain out of scope unless a future schema bump adds them.
* Codex owns implementation. Gemini may run read-only sweeps or do text cleanup, but Gemini must not edit canonical banks or make final clinical-review decisions.

## Purpose

A developer-only way to open specific question IDs from the app UI so sweep/audit outputs can be reviewed by a human without reading raw JSONL. Review/debugging only. Must not change the learner study flow, grading, production bank schema, or canonical content.

Example target IDs: `gemini_b9_10`, `gemini_b2_08`, `gemini_c10_07`.

## Changes from the prior draft

This revision reconciles the console to the **v3 sweep manifest schema**. The earlier draft's manifest-paste helper (§6) filtered on fields that the v3 sweep no longer emits — `disposition`, `base_item_trust`, `disposition_rationale`, `ambiguity_note`, `trust_note`. Feeding a v3 manifest to the old console would silently produce dead filters. The field map below is now authoritative. Two additions: the console must surface the v3 `quoted_evidence` array next to the live question (the whole point of the review pass), and build order is now explicitly phased so the visual-preview path doesn't get built against a renderer registry that U0 is about to refactor.

## v2→v3 field reconciliation (authoritative)

| Old console assumed (v2) | v3 manifest field | Notes |
|---|---|---|
| `disposition` | `flag_type` + `recommended_action` | `flag_type` is the coarse bucket; `recommended_action` is the granular call. Filter on both. |
| `base_item_trust` | `answer_key_trust` | now `high \| medium \| low \| not_assessed` |
| `trust_note` | `trust_evidence` | must be specific, not generic |
| `ambiguity_note` | `ambiguity_evidence` | |
| `disposition_rationale` | `action_rationale` | |
| `visual_value` | `visual_value` | unchanged (`essential \| helpful \| none`) |
| `target_renderer` | `target_renderer` | unchanged |
| `needs_human_review` | `needs_human_review` | always `true` in v3, so it's a non-discriminating filter — drop it as a filter, keep it as a displayed field |
| — (new) | `quoted_evidence[]` | array of `{location, quote}`; **surface prominently** |
| — (new) | `priority` | `high \| medium \| low`; primary sort key |
| — (new) | `possible_duplicate_qids[]`, `duplicate_claim` | for redundancy rows |
| — (new) | `parent_qid`, `item_type` | for case-study handling |

## Non-goals

No canonical content edits. No new question schema fields. No grading changes. Not a prominent learner feature. No server/API dependencies. No importing sweep findings into bundled banks.

## Build phasing

**Phase 1 MVP**

* Dev entry point.
* Single and batch question ID lookup.
* Read-only question preview.
* Production visual preview using the existing visual renderer registry.
* Direct URL support for `?dev=1&qid=...` and `?dev=1&qids=...`.
* Must not write progress, answer history, missed status, or active session state.

**Phase 2**

* Paste validated sweep manifest.
* Reject or warn on manifests that do not pass `validate-sweep`.
* Display `quoted_evidence[]` prominently beside the rendered question.
* Local review notes and export.
* Duplicate/redundancy navigation.

## 1. Developer entry point

Dev-only entry via any of: URL flag `?dev=1`; `localStorage.shrimpDevTools === "true"`; a "Developer" link visible only in dev mode. Preferred: `?dev=1` sets the localStorage flag so it persists through the session. Learner default UI unchanged when dev mode is off.

## 2. Question ID lookup

A "Review Console" screen with: a multiline input accepting IDs separated by commas/spaces/newlines; an "Open IDs" button; a results list in entry order. Per result show found/not-found, source bank label, qid, item type, category, topic, difficulty, has-visual flag, and case-study parent/part status.

## 3. Direct URL support

`?dev=1&qid=<id>` and `?dev=1&qids=<id>,<id>,<id>`. If the app uses hash-state, follow the existing navigation style — do not add a router dependency.

## 4. Question preview (read-only)

Render the question using existing session components. Show: stem; options/rows/dropdowns/blanks; case-study exhibits and embedded parts; correct answer; rationale; per-choice rationale; test-taking strategy; glossary; EN/zh-CN toggle consistent with the app. Default to review mode (answer + rationale shown immediately).

**The preview must never alter learner progress, answer history, missed status, or active sessions.**

Visual stimulus: Phase 1 uses the post-roadmap production renderer.

## 5. Case-study handling

Top-level case-study ID → show full case + all parts, allow jump to a selected part. Embedded part ID → show parent context/exhibits, focus the matching part, label the parent qid. If embedded parts lack global IDs, index them by their existing embedded `id` fields.

## 6. Manifest helper (Phase 2) — v3 schema

A "Paste sweep manifest" box accepting v3 `manifest.jsonl` rows. Behavior:

- Parse JSONL; tolerate and report malformed lines rather than failing the whole paste. Reject or warn on manifests that do not pass `validate-sweep`.
- **Default sort:**
  1. `priority` high → medium → low
  2. `answer_key_trust` low → medium → not_assessed → high
  3. `risk_tier` high → medium → low
  4. visual candidates below human-review/redundancy rows unless user toggles “visual work mode”
- Filter by:
  - `flag_type`
  - `recommended_action`
  - `visual_value`
  - `target_renderer`
  - `answer_key_trust`
  - `priority`
  - `risk_tier`
  - `content_lane_status`
- Clicking a row opens the matching question preview.
- Alongside the question, render the v3 evidence fields:
  - `quoted_evidence[]` — **render each `{location, quote}` prominently, labeled by location**, ideally visually anchored to where it appears in the rendered question. This is the core review affordance: the flagged phrase and what the question actually asks, side by side.
  - `the_tell`
  - `renderer_justification`
  - `ambiguity_evidence`
  - `trust_evidence`
  - `action_rationale`
  - for redundancy rows: `possible_duplicate_qids` (each clickable to open that question) and `duplicate_claim`.

Do not persist pasted manifests into any canonical bank.

## 7. Local review notes (Phase 2)

Per-question status: `unreviewed | looks_ok | needs_fix | duplicate_or_redundant | visual_candidate | reject_audit_flag`, plus free-text. Store in localStorage/IndexedDB under `shrimpDevReviewNotesByQuestionId`. "Export review notes" downloads JSON:

```json
{
  "exportedAt": "ISO timestamp",
  "notes": {
    "gemini_b9_10": { "status": "needs_fix", "note": "Check rationale/key.", "updatedAt": "ISO timestamp" }
  }
}
```

Never auto-write notes back into bank files. (These exports double as a calibration set — see §9.)

## 8. Risk ordering (review the downside first)

A wrong answer key actively teaches a learner the wrong thing; a missed visual conversion is only unrealized upside. The console must make harm-first review the path of least resistance:

- Default the manifest view to sort high-risk rows first (see Default sort in §6).
- Visual-conversion candidates are lower-stakes; they sort below review/redundancy rows by default.
- A quick toggle can re-sort to visual work when the reviewer chooses.

## 9. Calibration export (lightweight, high leverage)

The §7 export, accumulated over a few hundred hand-labeled items, is the measurement set for how often the sweeps agree with human judgment. No extra build needed beyond §7 — just don't treat the export as throwaway. A later pass can diff `reject_audit_flag` rate against sweep versions to turn "precision over volume" into a tracked number.

## Implementation guidance

Small, localized additions. Likely pieces: a question-indexing helper that walks bundled questions (top-level + embedded parts) returning a map by ID; reuse existing rendering components; a dev-only `DeveloperReviewConsole`; app state to switch into it in dev mode; compatible with the static/offline build.

```ts
type QuestionLookupResult = {
  requestedId: string;
  found: boolean;
  question?: Question;
  parentCaseStudy?: CaseStudyQuestion;
  embeddedPart?: Question;
  sourceLabel?: string;
  pathLabel?: string;
};
```

Manual/auto checks: standalone lookup; case-study parent lookup; embedded part lookup; multiple pasted IDs; missing ID; dev-off shows no learner change; preview writes no progress/session state; v3 manifest paste binds all eight filters (regression guard against the v2-field mismatch this revision fixes).

## Acceptance criteria

1. Dev mode exposes the Review Console; learner UI unchanged when off.
2. Pasting the three example IDs yields found previews or explicit not-found rows.
3. A found question is fully reviewable in-UI including key + rationale.
4. Batch paste works.
5. Case-study parent and embedded-part IDs handled.
6. No canonical bank files modified.
7. (Phase 2) A pasted **v3** manifest binds every filter in §6 and renders `quoted_evidence` next to the question.
8. Opening a question in the console never calls the answer-submission or progress-writing paths.
9. Console rendering must work for top-level questions, case-study parents, and embedded case-study parts.
10. Console must render visual stimuli when present, using the production `VisualStimulus` path.
11. Console must clearly label manifest rows as untrusted audit output until reviewed.
12. Console must not import manifest rows into any canonical bank.
13. These pass:

```sh
npm run validate-bank -- banks/*.json
npm run coverage-report
npm run build
```

Run `npm run test-visuals` only if visual-renderer code was touched.

## Project history update

On landing, add a short `PROJECT-HISTORY.md` entry: developer-only question lookup and review console added for sweep/audit triage, reconciled to the v3 manifest schema.
