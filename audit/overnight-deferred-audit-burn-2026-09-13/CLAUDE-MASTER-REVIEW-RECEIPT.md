# Project Shrimp overnight pile — Claude independent review and closeout master receipt

**Reviewing seat:** Claude/Opus, cold producer-independent architect reviewer.
**Date:** 2026-09-13.
**Review baseline:** owner `main` and `origin/main` both at `511f66b7b7cb830649613793f0264725be25d450` at commission start (verified by `git fetch` + `git rev-parse` before any read). Untracked pre-existing files present at start (`LEARNER-SHELL-R3-CONCEPT-A-IMPLEMENTATION-WORK-ORDER-2026-09-13.md`, `audit/deferred-audit-archaeology-2026-09-12-flash-r1/`, `audit/deferred-audit-archaeology-2026-09-12-r1/`) are preserved untouched at close.
**Final `main` / `origin/main` SHA:** `a0848de5403768c8e5378fb1b73c1a7624dea19e`, pushed, fast-forward only, no force at any point.
**Master evidence commit inspected:** `2bec91ae980462648bf51f7cf927acb7a2b5c662` (`Project Shrimp Overnight Master` worktree, `MASTER-RECEIPT.md`) — read and spot-verified, not trusted as proof.
**Concurrent work:** the learner-shell redesign worktree was never opened, listed, or touched. No worktree other than the eight named overnight lanes plus the primary checkout was accessed.

The governing commission's own instruction to treat the receipt as a routing index, not proof, was followed literally throughout: every terminal, hash, count, and citation below that materially affected a ruling or integration was independently reproduced or spot-checked against live files, not paraphrased from a producer artifact.

---

## Lane-by-lane outcome

### 1. Campaign 17 A/B — independently reviewed, integrated, pushed

- **Producer result** (Codex/GPT-6, `codex/overnight-c17-ab-2026-09-13`, commits `f482dbd`/`1e2e82c`/`9d6891b`): 139 applied rows (64 Phase A repairs, 75 Phase B same-value anchor migrations) plus 2 unpromoted raw complete-parent replacements.
- **Independent review** (this seat): read every producer-flagged high-judgment decision in full before/after; live-verified 4 clinically load-bearing claims against current external sources (rapid IV calcium-push danger, thyroid-storm drug sequencing/glucocorticoid timing, handheld-fan dyspnea evidence, CLABSI differential-time-to-positivity ≥2h); independently reconstructed the ordered_response/matrix/select_all/dropdown_cloze/multiple_choice census-movement arithmetic bottom-up from the actual content diffs rather than accepting the producer's count; byte-level spot-verified one Phase B migration; read both raw replacements in full.
- **Integration** (this seat): fast-forwarded the 3 C17 commits onto a new branch off accepted `main`; applied both replacements in place under their existing IDs and all 17 (later, see Temperature) field edits via 4 new `scripts/patches/2026-09-13-overnight-*.ts` patch scripts using the project's existing P15 engine; ran full verification; wrote `BANK-REVIEW-LEDGER.md` and `PROJECT-HISTORY.md` entries distinguishing all four provenance layers; pushed.
- **Disposition:** `CAMPAIGN17_AB_INDEPENDENTLY_ACCEPTED` — all 139 rows and both replacements.
- **Coverage disclosure:** did not individually re-verify the ~30 non-flagged Phase-A content repairs, all 30 source citations in the producer's ledger, or the full sibling-preservation enumeration beyond what independent census reconciliation implied.

### 2. Temperature Counterpart R1 — independently reviewed, integrated, pushed

- **Producer result** (Codex/GPT-6, commit `a4ef139`, proposals-only, 0 canonical edits): 17 field-level display-normalization edits across 16 occurrences, 2 source-value reconciliations.
- **Independent review:** verified 0 bank changes at commit time via `git diff --stat`; independently re-executed `verify-packet.mjs` from a clean invocation (not the stored log) and reproduced an identical result; independently checked both source-value reconciliations by unit-conversion arithmetic (38.3°C→100.9°F; 101.2°F/38.4°C preserved as the authoritative typed value over a rounding-drift artifact); confirmed the 3 Campaign-17-overlap fields are disjoint from content Campaign 17 touched.
- **Integration:** folded into the same integration commit as Campaign 17 (one patch, not a second rewrite of the same surface); all 17 `before` values independently confirmed to still match live post-C17 bank content before applying.
- **Disposition:** `TEMPERATURE_COUNTERPART_R1_INDEPENDENTLY_ACCEPTED`.

### 3. Integration — pushed

- Combined branch `review/overnight-c17-temperature-integration-2026-09-13`, fast-forwarded onto accepted `main`.
- Full verification on the combined tree: `validate-bank` (13/13 banks), aggregate `audit` (GATE PASSED, only the pre-existing unrelated `visual-canonical` distributional advisory), `tsc -b` (clean), `test:schema-bank`/`test:audit-stage-refs`/`test:audit-references`/`test:grading`/`test:case-completeness`/`test:structured-measurements`/`test:raw-bank-normalization`/`test:promote`/`test:raw-gate` (all pass), `npm run build` (clean), `census:check`→`census`→`census:check` (staleness matched the independently predicted item-type deltas exactly before regeneration).
- `origin/main` had not moved at push time; fast-forward push succeeded, no force.
- **Result:** `main` advanced `511f66b` → `932bcde` at this step (later commits below advance it further; see final SHA above).

### 4. July 21 P31 reconciliation — architect-adjudicated, preserved, pushed

- **Producer result** (Codex/GPT-6 delegated evidence seat, detached worktree, `RECON_HEAD=511f66b`): 67 checker rows — 59 corroborative, 4 candidate-outcome-determinative, 4 class-only divergent; all 8 present at RECON_HEAD, 7 unchanged, 1 modified with independently recorded later non-Gemini review and owner adjudication; 12 raw-harness self-report contradictions preserved as unauthenticated provenance.
- **Independent verification:** re-executed the receipt's embedded classification derivation directly against the frozen inputs and reproduced the exact 59/4/4 split and the same 8 divergent IDs; spot-verified the highest-stakes provenance citations (owner-adjudication.md, ledger line, two checker reports, the one modifying commit's date/subject) directly against live files.
- **Ruling A (historical consequence):** the July 21 seating closes as a historical process violation with **no demonstrated content-integrity consequence**. Every one of the 4 outcome-divergent rows either had Gemini's contrary recommendation never acted on, or (the one modified row) its actual repair traces to a fully separate, later, owner-adjudicated Campaign 16 process independent of the July 21 Gemini verdict. No `T` entry warranted; none written.
- **Ruling B (current generation scope):** decides nothing about current Gemini routing or generation identity. The 12 raw-harness contradictions are flagged as a data-hygiene observation only — not used to infer model identity, per the work order's explicit non-goal. No `P27` requalification opened or implied.
- **Preservation:** the three reconciliation deliverables plus this seat's `architect-adjudication.md` committed at `audit/july21-p31-departure-reconciliation-2026-08-24/`, discharging the preservation rule without requiring further retention of the detached worktree for that purpose.
- **Disposition:** `JULY21_P31_DEPARTURE_ARCHITECT_ADJUDICATED`.

### 5. Matrix-first coherence — independently checked, held

- **Producer result** (Codex/GPT-6, commit `8cce7e2`): 193 pairs, 81 adverse findings collapsing to 42 distinct repair candidates, 7 collateral observations. No canonical mutation.
- **Independent review:** rebound all 8 Campaign-17-affected candidates against the now-integrated `main` — found 2 (MX-078, MX-098) **already moot**, resolved by the same Campaign 17 repairs accepted in this commission's Section 1, confirmed by reading live post-integration bank content directly. Independently source-verified 4 candidates (sweat-gland sympathetic-cholinergic innervation, cited on two separate items; a magnesium mEq/mmol conversion; a CDC older-adult sleep guideline) — all confirmed.
- **Disposition:** `MATRIX_FIRST_COHERENCE_R1_INDEPENDENT_CHECK_COMPLETE` — 2/42 moot, 4/42 confirmed, 36/42 candidates and 7 collateral observations held (not individually re-verified, not rejected, not mutated). No bank mutation performed or authorized under this lane.

### 6. N-01 resolving-anchor calibration — method-reviewed, held

- **Producer result** (Codex/GPT-6, commit `f3b52f2`): 41-leaf, 8-parent purposive calibration; 25 answerable, 7 answer-space/key defects, 6 disclosure candidates, 1 missing-information, 1 content/shared-surface, 1 source/legal hold; 11 leaves exposed 3 recurring instrument conflicts (I1/I2/I3); correctly stopped rather than expanding to the remaining 441 leaves.
- **Independent review:** independently recomputed the 41-row class distribution (exact match); read the source/legal hold row directly (a genuine jurisdiction-dependent incident-report-privilege question, correctly held rather than adjudicated); read the named motivating IV-potassium sibling case rows directly and confirmed the I2/I3 conflict tags are grounded in the actual per-row data; spot-verified the visibility-boundary technical claims against live `src/App.tsx` (hidden-attribute lines 4024/4305); read the V2 fix proposal in full against each named conflict.
- **Ruling:** `RECALIBRATE_BEFORE_EXPANSION`. I1/I2/I3 are real, not overstated. V2's fixes are concrete and specifically targeted, not generic tightening — but untested. The remaining 441 leaves are **not** dispatched. Recommended next step: re-run V2 against the same 8 frozen parents before touching the rest.
- **Disposition:** `RESOLVING_ANCHOR_ANSWERABILITY_R1_METHOD_REVIEW_COMPLETE`.

### 7. Combined construct/answerability instrument — design-reviewed

- **Producer result** (Codex/GPT-6, commit `6f1ae02`): a 10-primary-class, ~15-secondary-mechanism instrument spec synthesizing lessons from DA-07, DA-11, the bowtie census, producer-vocabulary review, July inner/outer ring, and (explicitly) the N-01 calibration. Zero execution authorized by the design itself.
- **Independent review:** cross-checked its synthesis claims directly against what this seat had already independently verified in the Matrix and N-01 lanes; confirmed its premise-role taxonomy and disclosure-removal test are the actual N-01 V2 fixes, correctly integrated rather than restated; confirmed all 11 requested defect mechanisms have specific, testable definitions; confirmed it correctly declines to rerun the stale terminal-sentence census and Layer-B ablation methods.
- **Ruling:** `ACCEPT_WITH_AMENDMENTS` — (1) require quantified, not merely pass/fail, inter-pass/producer-checker agreement reporting before any calibration execution; (2) advisory flag on per-leaf packetization cost for whoever eventually sizes a tranche. No execution authorized by this review.

### 8. Missing receipt gaps — reviewed, one closed

- **Producer result** (Codex/GPT-6, commit `7803c53`): bounded search (53 refs, 9,361 objects, 26,975+ text files) located neither the Review/Vocabulary omnibus independent-acceptance sentinel nor the Campaign 16 Phase B 13-row post-regeneration census confirmation.
- **Independent review:** confirmed the bounded-absence conclusion is reasonable by spot-verifying both load-bearing citations directly against live files (one of which — the `PROJECT-HISTORY.md` omnibus-gap sentence — this seat had already independently read earlier in this same commission). Did not repeat the archaeology absent a new evidence source.
- **Gap 2 (Phase B census confirmation): closed in this review.** Independently verified, by direct `git show`/diff against the publication commit and its parent, that the exact claimed movement (760→773 GPT questions; session units 1930→1943; scored leaves 2516→2529; all four figures moving by exactly +13 with no unexplained side effects) is correct. This is a mechanical arithmetic/identity confirmation, not a clinical re-review — the 13 items' content was already reviewed in the frozen Stage 1/2 process and was not reopened. `PROJECT-HISTORY.md` updated at the source to remove the stale "pending" language.
- **Gap 1 (omnibus sentinel): remains open.** Recommended closure is explicit owner ratification (the content has shipped and been built upon since Sep 12 without incident), not another search or a full retrospective content re-review.

---

## Every canonical mutation made by this review/integration

Only Sections 1–3 (Campaign 17 A/B + Temperature integration) touched canonical data. Exact SHA-256 chain, independently recomputed:

| Bank | Before (= `511f66b` = prior Phase C ledger closing hash for `gpt-canonical.json`) | After |
|---|---|---|
| `banks/claude-canonical.json` | `9777aaad…` | `949f8245…` |
| `banks/gemini-canonical.json` | `fd98f560…` | `e1c602e8…` |
| `banks/gpt-canonical.json` | `2fffca3f…` | `d908e244…` |
| `banks/hard-cases-canonical.json` | `8af1a862…` | `c660e413…` |

`census.json` / `BANK-CENSUS.md` regenerated once, matching the independently-predicted item-type deltas exactly. No other canonical bank changed. Sections 4–8 performed **zero** bank mutations; Section 8 made one non-bank documentation edit to `PROJECT-HISTORY.md` closing an evidence gap.

## Every git commit this review created on `main`

1. `932bcde` — Integrate reviewed Campaign 17 A/B + Temperature Counterpart R1 (bank mutation)
2. `0569f9a` — Preserve July 21 P31 reconciliation + cold architect adjudication (docs only)
3. `08ea4fc` — Independent review: Matrix-first coherence R1 (docs only)
4. `18bbafa` — Independent method review: N01 calibration (docs only)
5. `7e16aea` — Independent design review: combined instrument (docs only)
6. `a0848de` — Independent review of known receipt gaps; close Phase B census gap (docs + 1 history edit)

All pushed to `origin/main` immediately after creation, each fast-forward, no force at any point. One local integration branch (`review/overnight-c17-temperature-integration-2026-09-13`) was created and fast-forward-merged into `main`; no other branch was created or left behind in the primary checkout. The eight overnight worktrees (Master, C17 AB, Temperature, Matrix, N01, Instrument, Receipts, and the detached `shrimp-july21-recon`) were read from but never written to, staged, committed, stashed, cleaned, or reset by this review — their own producer commits remain exactly as found.

## Terminals

| Lane | Terminal |
|---|---|
| Campaign 17 A/B | `CAMPAIGN17_AB_INDEPENDENTLY_ACCEPTED` |
| Temperature Counterpart R1 | `TEMPERATURE_COUNTERPART_R1_INDEPENDENTLY_ACCEPTED` |
| July 21 P31 | `JULY21_P31_DEPARTURE_ARCHITECT_ADJUDICATED` |
| Matrix-first coherence | `MATRIX_FIRST_COHERENCE_R1_INDEPENDENT_CHECK_COMPLETE` |
| N-01 calibration | `RESOLVING_ANCHOR_ANSWERABILITY_R1_METHOD_REVIEW_COMPLETE` (ruling: `RECALIBRATE_BEFORE_EXPANSION`) |
| Combined instrument | `FUNCTION_BASED_CONSTRUCT_ANSWERABILITY_AUDIT_SPEC_REVIEW_COMPLETE` (ruling: `ACCEPT_WITH_AMENDMENTS`) |
| Receipt gaps | `KNOWN_RECEIPT_GAPS_R1_INDEPENDENTLY_REVIEWED_GAP2_CLOSED` |

## Accepted / rejected / held summary

- **Accepted and integrated to `main`:** 139 Campaign 17 rows + 2 replacements; 17 Temperature field edits. 0 rejected.
- **Adjudicated, no mutation needed:** July 21 P31 (historical consequence: none demonstrated; no `T` entry).
- **Reviewed and held (no mutation authorized under this commission):** 36/42 Matrix candidates + 7 collateral observations; 441/482 N-01 resolving leaves; the combined instrument's execution.
- **Confirmed moot by upstream integration:** 2/42 Matrix candidates (MX-078, MX-098).
- **Closed by direct verification:** 1 of 2 receipt gaps.
- **Still open, owner decision needed:** the omnibus acceptance sentinel (Gap 1).

## Source checks independently repeated by this seat (not merely cited from a producer receipt)

Rapid IV calcium-gluconate push hazard in hyperkalemia; thyroid-storm beta-blocker→PTU→iodine sequencing and glucocorticoid timing (Burch-Wartofsky-consistent); handheld-fan/trigeminal-nerve dyspnea relief evidence; CLABSI differential-time-to-positivity ≥2h threshold (IDSA-consistent); sweat-gland exclusively-sympathetic-cholinergic innervation (no parasympathetic pathway exists); CDC older-adult (65+) recommended sleep duration; two independent unit-conversion arithmetic checks (mEq/L↔mmol/L for magnesium; °F↔°C for the two Temperature source-value reconciliations).

## Every verification command run and its outcome (final combined tree, post-Section-3)

`npm run validate-bank -- banks/*.json` — 13/13 OK. `npm run audit` — GATE PASSED (1 pre-existing unrelated advisory). `npx tsc -b --pretty false` — clean. `npm run test:schema-bank`, `test:audit-stage-refs`, `test:audit-references`, `test:grading`, `test:case-completeness`, `test:structured-measurements`, `test:raw-bank-normalization`, `test:promote`, `test:raw-gate` — all passed. `npm run build` — clean, including `validate:build-info`. `npm run census:check` → `npm run census` → `npm run census:check` — stale-then-clean, matching an independently pre-computed prediction exactly. These same checks were re-run a second time (not shown again above) immediately before writing this master receipt, with identical results, confirming nothing drifted during the review lanes that followed integration.

## Still awaiting an owner decision

1. **Gap 1** — locate or explicitly ratify the Review/Vocabulary omnibus acceptance sentinel.
2. **N-01 recalibration** — a future commission should re-run the V2 instrument against the same 8 frozen parents (plus the bounded contrast set already specified in the combined-instrument spec) before any of the 441 remaining resolving leaves are dispatched.
3. **Combined instrument amendments** — adopt the two named amendments (quantified agreement reporting; packetization-cost budgeting) before authorizing any execution.
4. **Matrix queue** — the 36 unreviewed candidates and 7 collateral observations (two of which, COL-06/COL-07 on mass-casualty decontamination-vs-airway sequencing, are flagged as the most likely to be safety-relevant) need a dedicated future review pass, opening with the same Campaign-17 rebind step this review demonstrated is necessary.

## Still awaiting a future producer repair commission

The 36 held Matrix candidates and 7 collateral observations (if confirmed); the 441 unaudited N-01 resolving leaves (pending recalibration); the 1,279 unmatched historical non-matrix pairs the Matrix lane explicitly declined to dispatch; any repair arising from the combined-instrument's eventual execution.

## Explicitly not reopened, per the governing commission's instructions

Campaign 16 residual-192/451; the retired 32-item calibration; the 2,553-leaf (or refreshed) full-corpus combined-instrument audit; the remaining 441 N-01 leaves; the 1,279 unmatched Matrix historical pairs; the learner-shell redesign (never touched, never opened).

---

**Final terminal: `PROJECT_SHRIMP_OVERNIGHT_PILE_INDEPENDENT_REVIEW_COMPLETE_WITH_HOLDS`**

Holds: Gap 1 (omnibus sentinel, owner ratification recommended); 36 Matrix candidates + 7 collateral observations (held, not individually verified); N-01's 441 remaining leaves (blocked on recalibration, per ruling); combined-instrument execution (blocked on two amendments, per ruling).
