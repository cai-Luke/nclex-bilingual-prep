# Project Shrimp — Sweep Manifest Validator Spec

**Status:** Highest-priority implementer task. Needs enum/schema refresh before implementation.

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

A mechanical, un-foolable gate that runs on a sweep's `manifest.jsonl` + `summary.json` **before any human reads a row**. It exists because the sweep's own `gate_results` lie: in the v2 run, `cluster_integrity` self-reported `true` while grouping schizophrenia, DKA, AKI, GBS, and a chest-tube case as "near-duplicate." A model can talk itself out of a self-assessed gate; it cannot talk a `grep` out of finding a banned string or a parser out of rejecting a missing field.

**Core principle: the validator ignores everything the manifest says about itself.** It does not read `gate_results` or `global_gate_results` as truth — it recomputes every checkable property independently and reports where the manifest's self-report diverges from reality. The manifest is the artifact under test, not a source of verdicts.

The validator is the required gate before any sweep manifest is imported into the review console or used for human triage. The validator must treat the sweep manifest as untrusted model output. It must not rely on `gate_results`, `global_gate_results`, or any self-reported model verdict.

This is the first thing to build next week. It's small, has no dependency on U0 or the console, and turns "is this run usable" from a judgment call into an exit code.

## Stack & invocation

Implementation should be TypeScript/Node in the existing project style, zero new runtime dependencies unless Codex explicitly justifies one. Add to `package.json` scripts:

```sh
npm run validate-sweep -- manifest.jsonl summary.json
npm run validate-sweep -- manifest.jsonl summary.json --bank banks/*.json
npm run validate-sweep -- manifest.jsonl summary.json --strict
```

Exit codes: `0` = usable (no hard failures), `1` = rejected (≥1 hard failure), and under `--strict`, `1` if any warning fires. Designed to drop into CI as a required check before a manifest is allowed into the review console.

## Allowed enums (single source of truth)

```
flag_type:          visual_replace_candidate | visual_parallel_candidate | human_review | redundancy_candidate
priority:           high | medium | low
visual_value:       essential | helpful | none
item_type:          multiple_choice | select_all | ordered_response | fill_in_blank | matrix | dropdown_cloze | case_study | case_study_part
target_renderer:
  rhythm_strip
  capnography
  vitals_trend
  lab_trend
  mar
  io_record
  medication_label
  device_screen
  fetal_monitoring
  burn_map
  null
answer_key_trust:   high | medium | low | not_assessed
ambiguity_risk:     low | medium | high
recommended_action: replace_text_item_with_visual | add_parallel_visual_item | human_review_before_action | possible_duplicate_review | leave_after_review
evidence.location:  stem | option | row | column | dropdown | blank | exhibit | rationale.correct | rationale.byChoice
risk_tier:          low | medium | high
content_lane_status: open | blocked | unknown
source_spec_version: string
```

Manifest rules:
* `content_lane_status == blocked` must not pair with `recommended_action == replace_text_item_with_visual`.
* `burn_map` with pediatric content must be `blocked` unless a later source-verification spec explicitly opens it.
* `fetal_monitoring`, `medication_label`, and `device_screen` should default to `risk_tier: high`.
* `io_record`, `mar`, `burn_map`, and `rhythm_strip` should default to at least `medium` unless the row justifies `low`.
* `capnography`, `vitals_trend`, and `lab_trend` may be `low` when they are straightforward trend-recognition candidates.

## Hard failures (any → status `rejected`, exit 1)

| ID | Check |
|---|---|
| F1 | **Parse.** Every non-empty line of `manifest.jsonl` parses as a JSON object. |
| F2 | **Required fields present & non-null:** `qid, item_type, category, flag_type, priority, visual_value, quoted_evidence, answer_key_trust, ambiguity_risk, recommended_action, action_rationale, needs_human_review`. Conditionally required: `renderer_justification` when `target_renderer != null`; `parent_qid` when `item_type == case_study_part`; `the_tell` when `flag_type == visual_replace_candidate`; `possible_duplicate_qids` **and** `duplicate_claim` when `flag_type == redundancy_candidate`. |
| F3 | **Enum validity.** Every enum-typed field holds an allowed value (table above). |
| F4 | **Review flag.** `needs_human_review === true` on every row. |
| F5 | **Evidence presence.** `quoted_evidence` is a non-empty array; each entry has a valid `location` and a `quote` whose trimmed length > 0. |
| F6 | **Banned-phrase scan.** Case-insensitive, trimmed substring match of the §"banned phrases" list against the model's **prose fields only** — `action_rationale, renderer_justification, trust_evidence, ambiguity_evidence, duplicate_claim`. **Never scan `quoted_evidence[].quote` or `the_tell`** — those are verbatim from the source item and may legitimately contain any text. |
| F7 | **Cross-field consistency.** See table below. |
| F8 | **Counts reconcile.** Recompute `rows_emitted`, `counts_by_flag_type`, `counts_by_renderer` directly from the manifest; each must equal the value reported in `summary.json`. On mismatch the manifest wins and the run is rejected (the summary is derived, the manifest is source of truth). |
| F9 | **Visual necessity claim.** For `visual_replace_candidate` and `visual_parallel_candidate`, require a non-empty `renderer_justification` that explains why the visual is load-bearing. Reject generic claims such as “would be helpful,” “adds visual interest,” “supports learning,” or “could be shown visually.” |

### F7 cross-field rules

| When | Require |
|---|---|
| `flag_type == visual_replace_candidate` | `visual_value == essential` ∧ `recommended_action == replace_text_item_with_visual` ∧ `target_renderer != null` ∧ `the_tell != null` ∧ `answer_key_trust == high` |
| `flag_type == visual_parallel_candidate` | `recommended_action == add_parallel_visual_item` ∧ `target_renderer != null` |
| `flag_type == redundancy_candidate` | `possible_duplicate_qids` length ≥ 1 ∧ `duplicate_claim` non-null |
| `target_renderer != null` | `renderer_justification` present and not banned/generic |
| `the_tell != null` | `the_tell` appears as a case-insensitive substring of at least one `quoted_evidence[].quote` (the tell must be grounded in an actual quote) |

The `replace ⇒ answer_key_trust == high` rule is the mechanical encoding of "never rewrite a low-trust item in place." It's the single check that protects the most expensive downstream action.

## Warnings (status `usable_with_warnings`; surfaced, non-blocking unless `--strict`)

| ID | Check | Why |
|---|---|---|
| W1 | **Templating smell.** Any of `{item_type, answer_key_trust, ambiguity_risk, priority}` has a single distinct value across the manifest, or ≥95% concentrated in one value. | This is the check that would have caught v2's constant `base_item_trust: high`. It's a heuristic (a genuinely uniform batch is possible), so it warns rather than fails. |
| W2 | **`not_assessed` overuse.** `answer_key_trust == "not_assessed"` on > 25% of rows. | Defeats the purpose of trust scoring. |
| W3 | **Thin quote.** Any `quoted_evidence[].quote` under ~8 chars. | A fragment too short to establish context. |
| W4 | **Near-boilerplate claim.** `duplicate_claim` or any prose field contains heuristic tells ("text similarity", "stem logic", "characteristics mentioned") without tripping an exact F6 string. | Catches paraphrased templating. |
| W5 | **Dangling qid.** A `qid` or any `possible_duplicate_qids` entry not found in the bank. Only runs with `--bank`. | Detects hallucinated or stale IDs. |
| W6 | **Self-report divergence.** Any `gate_results`/`global_gate_results` boolean in the summary disagrees with the validator's independent computation. | Reported as informational; the validator's result stands. Repeated divergence is a sign the sweep model is rubber-stamping its own gates. |
| W7 | **Decorative-risk language.** | Warn when `renderer_justification` contains language suggesting the visual is optional, illustrative, decorative, or merely helpful. |

## Output

Human-readable summary to stdout (status line, failure/warning counts), plus a machine artifact `validator_report.json`:

```json
{
  "status": "usable | usable_with_warnings | rejected",
  "manifest": "manifest.jsonl",
  "rows_total": 0,
  "rows_failed": 0,
  "hard_failures": [
    { "line": 0, "qid": "string", "check": "F7", "detail": "visual_replace_candidate with answer_key_trust=medium" }
  ],
  "warnings": [
    { "check": "W1", "detail": "answer_key_trust constant: 100% 'high'" }
  ],
  "recomputed_counts": {
    "rows_emitted": 0,
    "by_flag_type": {},
    "by_renderer": {}
  },
  "summary_divergences": [
    { "field": "global_gate_results.no_text_similarity_only_clusters", "reported": true, "computed": false }
  ]
}
```

## Regression fixtures (the durability move)

Encode the past failures as fixtures so the sweep can never quietly regress to them. Build the validator against:

- `fixtures/v1_manifest.jsonl` — the v1 output. **Must be rejected** (templated disposition, constant trust, renderer-keyed clusters).
- `fixtures/v2_manifest.jsonl` — the v2 output. **Must be rejected or flagged** — at minimum W1 (constant trust) and the `cluster_sim_6` integrity issue should surface; the "Random sample for review" flags trip F6.
- `fixtures/good_min.jsonl` — a hand-built minimal valid manifest (≈5 rows, one per `flag_type`). **Must pass clean.**
- `fixtures/edge/*` — one fixture per hard-failure ID (a row missing a quote, a bad enum, a `replace` with `answer_key_trust: medium`, a `the_tell` absent from its quotes, counts that don't reconcile), each asserting the specific check fires. Add fixtures for: legacy renderer enum rejected, blocked content lane with replace action rejected, decorative renderer justification rejected, `the_tell` not found in `quoted_evidence` rejected, summary count mismatch rejected, dangling qid warning when `--bank` is supplied, clean minimal post-roadmap manifest passing.

A test runner asserts the expected status for each fixture. This is what makes "we fixed that in v3" stay fixed.

## What the validator does NOT do

It cannot judge whether an `essential` call is *clinically* correct, whether a `duplicate_claim` is *true*, or whether a quote actually gives away the answer. Those are semantic and stay with the human reviewer and the console. The validator's job is narrow and absolute: guarantee that what reaches the reviewer is structurally sound, evidence-backed, internally consistent, and free of the specific templating patterns we've already seen — so the reviewer spends judgment on questions, not on cleaning up the sweep.

## Acceptance criteria

1. `validate-sweep` runs with zero external dependencies and exits `0`/`1` correctly.
2. All fixture groups assert their expected status.
3. A clean post-roadmap run from Gemini passes (or its failures are real and actionable).
4. `validator_report.json` lists every hard failure with line + qid + check ID + detail.
5. The validator never reads summary gate booleans as authoritative; `summary_divergences` is populated independently.
6. Wired as a required CI check ahead of any console manifest import.
