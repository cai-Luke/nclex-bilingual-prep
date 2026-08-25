# Final Memo — Pair 40 Historical Audit Defect

**Reviewer:** Claude, analysis-only forensic seat
**Date:** 2026-08-25
**No repository files were changed. No bank was edited. No commit or push was made.**

## Frozen-state finding

At snapshot `59664cacfe4cfbd43d212f84c5d164a09557c958`, Item B q1 (`gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q1`) is internally self-contradictory: the keyed `correct` array maps the four risk-increasing findings (immobility, incontinence/moisture, poor intake, nonblanchable redness) to column `c2` ("Supports prevention") and the prevention-supporting finding (posted turning schedule) to column `c1` ("Increases risk") — the exact inverse of what the item's own EN/ZH `rationale.byChoice` text states for every row. Item A (`claude_cs_jun06_pressure_injury_bcc_01`) teaches a different sub-skill (staging, not risk/prevention classification) and does not directly conflict with Item B; the defect is internal to Item B q1, not a cross-item contradiction with Item A.

## Current-state finding

Current `main` (HEAD `3c33c03a`) carries the identical, unrepaired item at `banks/gpt-canonical.json`. A field-level JSON-value comparison against the frozen snapshot shows zero differences. The defect is live in the shipped canonical bank today.

## Git repair chronology

- **2026-06-13, `b3a68e890988ca7155dcc8113881b3a36ddf6826`:** item introduced, correctly keyed (matches rationale).
- **2026-06-13 (same day), `91ab9606269d4e5a82b4bf613234c06db5830276`:** a same-commit content-review defect log (`content-review-defect-log.md`) misdiagnosed this item and 7 sibling GPT matrix items as having "perfectly inverted" answer keys. A new script, `scripts/patch-matrix.py`, was added and run in this same commit, blindly swapping `c1`↔`c2` in `correct[].columnIds` for all 8 named GPT items. This review independently re-derived all 8 items' pre-swap state and confirmed **all 8 were already correct** before the swap — the diagnosis was wrong, and the "repair" broke 8 previously-correct matrix items, including Pair 40's Item B q1.
- **No commit since `91ab960` has touched this item's `correct`, `rationale`, or `matrix` fields.** Only cosmetic `topic` vocabulary migrations occurred later (`34be054`→`5cdeb5f` rollback→`76b8838`), none of which touched the defect.
- The frozen P27 snapshot (`59664cac`, 2026-06-25) captured the already-12-days-broken state; it did not introduce it.

## `patch-matrix.py` disposition

One-time targeted repair script, added and executed exactly once (`91ab960`), never modified or re-run since (byte-identical to current `main`). It correctly executed its intended logic; the defect is in its *premise* (the content-review defect log's misdiagnosis), not in the script's mechanics. It also silently no-op'd on its two other named targets (a Gemini FHR item and an IO item) — neither was actually modified despite being listed — a separate, unexplored correctness gap in the same repair pass, out of Pair 40's scope.

## June audit explanation

The June 25 Phase B coherence audit reviewed this exact pair, but under producer≠checker routing (Item A is Claude-produced, so the Claude lane explicitly excluded claude×gpt pairs) it was sent to the only available lane — Gemini — whose per-pair reconciliation text is documented, contemporaneously and by name in `CLAUDE-ARCHITECT-GEMINI-AUDIT-QUALITY-HANDOFF-2026-06-26.md`, as templated boilerplate with no pair-specific evidence. The manifest row for this exact pair (`gemini.manifest.jsonl`, `findingRef: PROVB-COH-09`) has an empty `evidence` field and generic templated `finding` text. Separately, Layer A's deterministic routing queue independently flagged the embedded q1 child itself for coherence review against `gemini_b9_05`, but that specific child-level pairing was never adjudicated in any lane's manifest — the June pilot sampled 109 items / 156 pairs against a 1,136-unique-ID routing baseline and never reached it. Where case-level review did occur with real evidence, it compared parent-case staging/offloading/delegation content, never opening the embedded matrix's own key/rationale fields. The June report's bottom line ("0 contradictions across all 104 pairs... closed with zero contradictions") is therefore factually incorrect for this pair, not merely operating at a different, compatible outcome surface.

## Adjacent blast-radius conclusion

Confirmed systematic repair-attempt event, not an isolated single-item defect: 8 GPT matrix items were modified by the same `91ab960` swap on the same false premise, and this review clinically re-adjudicated all 8 — every one was correct pre-swap and broken post-swap. Two additional named targets (Gemini FHR, IO) were listed but not actually modified by the script; their correctness was not further assessed (out of scope). Affected IDs are listed in `02-git-and-repair-history.md` §3.5.

## Process-gap conclusion

Confirmed, with three distinct mechanisms: (1) producer≠checker routing can force content-judgment work onto a lane whose unreliability was already known at the time, with no evidence gate before accepting its dismissal; (2) deterministically-routed candidate pairs are not guaranteed to actually be reviewed, and nothing reconciles "routed" against "adjudicated" counts; (3) no deterministic, non-LLM check exists to cross-validate a matrix item's scored key against its own rationale's semantic direction, despite this being a narrower and more tractable problem than general cross-item coherence.

## Exact recommended next steps (ordered; not implemented here)

1. **Current-bank repair.** File: `banks/gpt-canonical.json`, item `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q1`, field `correct[].columnIds` (5 rows) — restore to the pre-`91ab960` mapping (r1–r4 → `c1`, r5 → `c2`), which matches the item's own rationale. This is a **clinical claim / data-contract change to bank content** and must go through the full promotion pipeline per `AGENTS.md`'s risk-tiered table (Bank content row): normalize → promote → audit → producer≠checker review → consolidate → ledger entry → census. Do not hand-edit the JSON; load → mutate → re-serialize per the JSON-authoring house style. Recommend also re-checking the other 7 items broken by the same `91ab960` swap (listed in `02-git-and-repair-history.md`) in the same pass, since this review already established all 8 need the identical fix.
2. **Historical audit correction — addendum, not rewrite.** Add a dated addendum artifact (new file, e.g. alongside `ADVERSARIAL-AUDIT-FINDINGS-2026-06-25.md` in its Archive location, or a new `PROJECT-HISTORY.md`/`DECISIONS.md`-referenced correction record) stating: Pair 40 (`claude_cs_jun06_pressure_injury_bcc_01` × `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03`) was incorrectly dismissed; the embedded Item B q1 child carried an unreviewed key/rationale contradiction; corrected by [repair commit, once made]. Do not edit `ADVERSARIAL-AUDIT-FINDINGS-2026-06-25.md` in place — it is a closed historical record; prefer a new addendum that cross-references it.
3. **Bounded survey of the other `patch-matrix.py` targets.** Confirm (already done here for the 8 GPT items) and separately check whether the 2 no-op targets (`fhr_gemini_smoke_2026_06_13_06`, `io_matrix_prerenal_aki_recheck_04`) still carry whatever defect the same-day content-review log originally claimed for them, since the script never actually touched them.
4. **Narrow deterministic matrix consistency checker.** Consider a scoped, non-LLM lint (e.g. in `scripts/audit/` or `scripts/validate-bank.ts`) that flags matrix items where every row's `correct` mapping is a uniform column permutation relative to some simple heuristic (not a full semantic check, but a structural smell detector for "did this look suspiciously like a global swap") — evaluate feasibility and false-positive rate before committing to this; may not be tractable as a general rule.
5. **Governance/runbook clarification.** The 2026-06-26 architect handoff's own recommendation ("Option 1 + Option 2: design the producer≠checker residual toward zero, and gate any Gemini pair on pair-specific evidence") was never implemented ("Status: Advisory. No architecture change made") and this exact gap is what let Pair 40 through. Recommend the planning seat revisit that handoff now that it has a concrete, materialized failure instance to point to, and consider whether Layer A's routed-but-never-adjudicated gap needs its own tracking (a reconciliation count between routing-queue size and lane-manifest coverage per audit pass).

## Explicit statement

No files were changed, no bank was edited, no governance or historical audit artifact was modified, and no commit or push was performed during this commission. All work is contained in `$HOME/Desktop/pair40-historical-audit-defect-claude-review-2026-08-25/`, outside the repository.

## Final classification

**A. Historical content state:** `FROZEN_ITEM_DEFECT_CONFIRMED`
Both this review's independent Phase A byte-level reconstruction and Codex's independently-sealed blind checker key reach the identical finding from the same frozen bytes: the `correct` key is the exact inverse of the item's own rationale for all 5 rows.

**B. Current canonical state:** `CURRENT_ITEM_DEFECT_PRESENT`
Verified byte-identical to the frozen (defective) state; unrepaired as of `main` HEAD `3c33c03a`.

**C. June audit disposition:** `JUNE_AUDIT_CORRECTION_REQUIRED`
The June 25 report's explicit, in-scope bottom line ("0 contradictions across all 104 pairs... closed with zero contradictions") is a factual claim about this pair that the frozen bytes contradict, independently confirmed twice. Per the recommendation above, the correction mechanism should be a durable addendum, not an edit to the closed historical record itself.

**Audit-process implications:** `PROCESS_GAP_CONFIRMED`
Three distinct, evidenced mechanisms (producer≠checker routing forcing content judgment onto a known-unreliable lane with no evidence gate; deterministically-routed pairs not guaranteed to be reviewed; no deterministic key-vs-rationale consistency check) combined to let this specific, structurally simple defect survive two audit passes and 73 days.
