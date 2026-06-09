# Non-MCQ Structural Bias Audit — Specification v2

**Project:** Shrimp (bilingual NCLEX-RN question bank)
**Status:** Implementer-ready. Supersedes the lightweight v1 draft.
**Design principle:** Precision over volume. Deterministic where the question is statistical; LLM only where the question is semantic.

---

## 0. Architecture (read first)

The audit is split into two layers. Do not merge them.

**Layer A — Deterministic statistical core (NO LLM).**
A script. Handles every check whose null distribution is known: positional/index distributions, count distributions, permutation depth, template repetition, spatial distribution. Same input → byte-identical output. This is checks 1–5, 7, 8-structural, plus the cross-cutting rationale scan.

**Layer B — LLM judgment layer (Gemini), narrow.**
Runs **only on items Layer A flags** plus the inherently-semantic check (#6, case-study inferability) and distractor *plausibility*. Never asked to count, distribute, or detect repetition — those are Layer A's job. This keeps token spend bounded and keeps the statistical verdicts reproducible.

**Determinism requirements (both layers):**
- All thresholds live in a pinned `CONFIG` block (below). No magic numbers in code.
- Any sampling uses a fixed seed. Iteration order is sorted by item ID.
- Output carries an `audit_version` string and a hash of `CONFIG`.
- Re-running on an unchanged bank must reproduce identical verdicts.

---

## 1. Scope and units of analysis

- Compute every check **per canonical bank**, then **globally**.
- A type's global verdict = **FAIL if ANY bank fails** for that type. A global PASS must not mask a per-bank FAIL.
- **Underpowered cells return `INSUFFICIENT`, never `PASS`.** A cell is underpowered if expected count per category < `min_expected_count`. Silence is not evidence of fairness.

---

## 2. CONFIG (pinned thresholds)

```yaml
audit_version: "2.0.0"
min_expected_count: 5          # per category, for any chi-square cell
chi2_alpha: 0.01               # significance floor
max_cell_deviation_pp: 8       # effect-size floor, percentage points from expected
                               # FAIL requires BOTH chi2 p < alpha AND max deviation > this
sata_count_degeneracy: 0.70    # FAIL if one count value covers > 70% of SATA items
sata_missing_count_fails: true # FAIL if any plausible count (1..n-1, n) never appears
ordered_min_mean_kendall: 0.35 # FAIL if mean normalized Kendall-tau (presented vs correct) below this
template_repeat_max_share: 0.15 # FAIL if top structural template covers > 15% of items (ordered/bowtie)
hotspot_grid: [3, 3]           # normalized grid for spatial chi-square
example_cap: 3                 # worst-N example item IDs per finding
```

---

## 3. Per-type checks, nulls, and metrics

For each, the **null** is stated explicitly. Layer A computes the metric; the verdict rule is uniform across positional checks (see §4).

### 3.1 SATA (select-all-that-apply)
- **Count distribution.** Null is NOT uniform. Defect = degeneracy. FAIL if any single count value covers > `sata_count_degeneracy` of items, OR (if `sata_missing_count_fails`) a plausible count never appears. Report the full count histogram.
- **Top-clustering (positional).** For each item, record the rank-positions of correct options. Aggregate the distribution of correct-option positions across all SATA items. Null = uniform over positions. Verdict per §4.
- **Fix class:** count degeneracy → `REGENERATE`; top-clustering → `SHUFFLE_AT_PROMOTION`.

### 3.2 Ordered response
- **Scramble depth.** For each item compute normalized Kendall-tau distance between *presented* order and *correct* order. FAIL if mean < `ordered_min_mean_kendall` (answers too inferable from presented order). Report the full distance histogram, not just the mean.
- **Template repetition.** Hash the canonical correct sequence (normalized to step identities, not surface text). FAIL if top template share > `template_repeat_max_share`.
- **Fix class:** low scramble → `SHUFFLE_AT_PROMOTION` (re-randomize presented order, enforce a minimum distance); template repetition → `REGENERATE`.

### 3.3 Dropdown / cloze
- **Per-blank correct-index distribution.** Each blank evaluated separately (blanks may have different option counts). Null = uniform over that blank's option count. Pool blanks of equal length for power; report per-length. Verdict per §4.
- **Fix class:** `SHUFFLE_AT_PROMOTION` (per-blank option shuffle).

### 3.4 Matrix / grid
- **Cell distribution.** Distribution of correct cells across columns and across rows, computed separately. Also check the per-row pattern: FAIL-flag if the correct column is identical across a suspicious share of rows. Null = uniform. Verdict per §4.
- **Fix class:** `SHUFFLE_AT_PROMOTION` (column order shuffle per row).

### 3.5 Case study / unfolding  *(Layer B — semantic)*
- **Inferability.** Operationalize "inferable from first/last row only": for each flagged item, Gemini receives the stem with all-but-one data row redacted and must state whether the correct answer is still determinable. Run with first-row-only and last-row-only redactions. Item FAILs if answer is determinable from a single row in ≥ 1 of the redaction conditions.
- **Distractor plausibility.** Gemini rates whether distractors are clinically plausible to a competent test-taker (implausible distractors leak the answer). Only on Layer-A-flagged or sampled items.
- **Fix class:** `MANUAL_REVIEW` or targeted `REGENERATE`. Do not auto-fix.

### 3.6 Visual / hotspot  *(Layer A)*
- **Spatial distribution.** Normalize each correct region's centroid to [0,1]², bin into `hotspot_grid`, chi-square vs uniform over occupied bins. Flag center / top-left concentration explicitly.
- **Label-correlation flag.** Flag (for Layer B confirmation) items where the correct region coincides with the single most visually salient or first-listed label.
- **Fix class:** spatial bias → `REGENERATE` (target generation toward underused regions; hotspots usually can't be shuffled); label correlation → `MANUAL_REVIEW`.

### 3.7 Bowtie / NGN
- **Slot template repetition.** Hash the structural template (slot types and arity, normalized of surface content). FAIL if top template share > `template_repeat_max_share`.
- **Per-slot positional distribution.** For each slot, correct-option position distribution, null = uniform, verdict per §4.
- **Fix class:** template repetition → `REGENERATE`; per-slot positional → `SHUFFLE_AT_PROMOTION`.

### 3.8 Cross-cutting — rationale shuffle hazard *(Layer A, applies to ALL shufflable types)*
- Scan rationales/explanations for position references: option letters (`Option A/B/C/D`), ordinal language (`the first choice`, `the last option`), spatial words (`above`, `top`, `the option below`).
- Any positional reference makes the item **unsafe to shuffle** until repaired.
- **Fix class:** `RATIONALE_REPAIR` — must run *together with* any shuffle. Repair = resolve the reference to the option's content (position-agnostic phrasing) so reshuffling cannot invalidate the rationale.

---

## 4. Verdict rule for positional / uniform checks

For any check whose null is uniform:
1. Require expected count per category ≥ `min_expected_count`, else `INSUFFICIENT`.
2. Compute chi-square goodness-of-fit p-value and the maximum absolute deviation (in percentage points) of any category from its expected proportion.
3. **FAIL** iff `p < chi2_alpha` **AND** `max_deviation > max_cell_deviation_pp`. (The effect-size floor prevents large N from trivially failing on negligible deviations.)
4. Otherwise **PASS**.

---

## 5. Output schema (deterministic)

One machine-readable record per `(bank, item_type, check)`:

```json
{
  "audit_version": "2.0.0",
  "config_hash": "<sha256 of CONFIG>",
  "bank": "<bank_id>",
  "item_type": "SATA|ordered|cloze|matrix|case_study|hotspot|bowtie",
  "check": "<check_name>",
  "layer": "A|B",
  "n": 0,
  "n_usable": 0,
  "statistic": null,
  "p_value": null,
  "max_deviation_pp": null,
  "verdict": "PASS|FAIL|INSUFFICIENT",
  "severity": "none|minor|major|critical",
  "fix_class": "SHUFFLE_AT_PROMOTION|REGENERATE|RATIONALE_REPAIR|MANUAL_REVIEW|NONE",
  "example_item_ids": []
}
```

Plus a human-readable rollup: bias table by item type, global vs per-bank findings, the worst `example_cap` items per FAIL, and the recommended fix per finding grouped by `fix_class`.

---

## 6. Fix taxonomy (the actionable output)

Every finding resolves to exactly one class:

- **`SHUFFLE_AT_PROMOTION`** — positional bias. Deterministic shuffle keyed by item ID, applied at the promotion step (not generation). After shuffling, **re-run Layer A as a post-condition assertion**; the shuffled bank must PASS the positional checks or the promotion fails.
- **`RATIONALE_REPAIR`** — must accompany any shuffle on items with position-referencing rationales. Blocks shuffle until repaired.
- **`REGENERATE`** — structural/count/content defects (SATA count degeneracy, low scramble depth, template repetition, spatial concentration, implausible distractors). Shuffling cannot fix these; route to generation-prompt revision or post-generation variation.
- **`MANUAL_REVIEW`** — semantic leakage (single-row inferability, salient-label hotspots). No auto-fix.

---

## 7. Acceptance criteria for the implementer

- Layer A is a standalone deterministic script; same bank → identical JSON.
- Layer B is invoked only on Layer-A-flagged items plus check #6; its prompts and item IDs are logged.
- Every record carries a `fix_class`; no finding is left unclassified.
- `INSUFFICIENT` is reported wherever power is lacking; it never silently becomes `PASS`.
- The promotion-step shuffle is re-audited as a post-condition.
