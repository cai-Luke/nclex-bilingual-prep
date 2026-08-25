# 02 — Git Provenance and Repair History (Phase A, pre-reveal)

Uses git object history (`git show <commit>:<path>`), never file mtimes. All commit hashes below are Project Shrimp repo commits, verified present via `git show -s`.

## §3.3 Git provenance of Item B q1

1. **First introduced:** commit `b3a68e890988ca7155dcc8113881b3a36ddf6826`, "Consolidate banks, fix promote pipeline, add curly-quote recovery tooling", author Luke Cai, 2026-06-13 09:28:35 -0400. Confirmed by `git log -S` on the item's distinctive row text ("Requires two staff to turn in bed") restricted to `banks/gpt-canonical.json`: exactly one hit, `b3a68e8`. This commit's message describes merging "gpt-gap-a/b (24q)" drafts into `gpt-canonical.json` (242→267).

2. **Initial state at introduction (`b3a68e8`):**
   - `matrix.columns`: same as current (`c2`=Supports prevention, `c1`=Increases risk).
   - `correct`: r1→**c1**, r2→**c1**, r3→**c1**, r4→**c1**, r5→**c2**.
   - This is the **opposite** of the current/frozen mapping, and it **matches the rationale** (r1–r4 increase risk = c1; r5 supports prevention = c2). At introduction, the item was internally coherent and clinically correct.

3. **Did a later commit swap c1/c2 or rewrite the matrix?** Yes. Walking every commit between `b3a68e8` and the frozen snapshot `59664cac` that touched `banks/gpt-canonical.json` (20 commits, extracted and diffed programmatically), the `correct` array changes exactly once, at commit **`91ab9606269d4e5a82b4bf613234c06db5830276`**, "Add study skips and refresh reviewed banks (#10)", author cai-Luke, 2026-06-13 16:17:06 -0400 (same day as introduction, ~7 hours later). A field-level diff of the item object between `b3a68e8` and `91ab960` shows **only** the five `correct[].columnIds` values changed (c1↔c2 swapped on every row); rows, columns, rationale, stem, glossary, testTakingStrategy are byte-identical before and after.

4. **First commit that made the item internally coherent:** None exists after `91ab960`. The item was coherent at introduction (`b3a68e8`) and has been incoherent ever since `91ab960`, through the frozen snapshot and through current `main`. No repair commit was ever made.

5. **Before or after the June 25/26 coherence audit?** The breaking swap (`91ab960`, 2026-06-13) is **eleven days before** the "Close Phase A adversarial audit" commit (`59664cac`, 2026-06-25) that produced the frozen snapshot, and well before the Phase B coherence work referenced in `Archive/root-cleanup-2026-06-26/*` (2026-06-26). The item entered the June audit period already broken.

6. **Was the frozen snapshot selected before or after the break?** After. `59664cac` is dated 2026-06-25, twelve days after the `91ab960` break on 2026-06-13. The frozen snapshot faithfully captured the already-broken state; it did not introduce or discover new corruption.

7. **Later non-content migrations:** Yes. The `topic` field on this item changed twice after the break with no effect on `correct`/rationale: `34be054` ("Apply canonical topic vocabulary migration") set it to "Prioritization & Delegation", `5cdeb5f` ("Rollback failed topic migration") reverted it to "pressure injury risk assessment", and `76b8838` ("Apply bulk-approved residual topic proposals") set it to the still-current "Mobility & Immobility". None of these touched `matrix.columns`, `matrix.rows`, `correct`, or `rationale`. A commit-by-commit walk of all 22 relevant commits between introduction and the frozen snapshot (plus onward to current `main`, already shown byte-identical in file 01) confirms `correct` never changed again after `91ab960`.

## §3.4 `scripts/patch-matrix.py`

1. **Entry date:** Same commit as the break, `91ab9606269d4e5a82b4bf613234c06db5830276` (2026-06-13 16:17:06 -0400) — added as a new 64-line file in that commit's diff (`scripts/patch-matrix.py | 64 ++`).

2. **Was it executed, and against which commit(s):** Yes — the commit that added the script is the same commit whose `banks/gpt-canonical.json` diff shows exactly the c1/c2 swap the script implements (`swap_c1_c2()`), for exactly the 8 GPT item IDs hardcoded in the script's `gpt_items` list. This is not merely circumstantial: diffing each of the 8 named GPT items individually between `b3a68e8` and `91ab960` shows **all 8** changed in exactly the pattern `swap_c1_c2()` produces (every `c1`→`c2` and `c2`→`c1` in `correct[].columnIds`, nothing else touched). Executed once, resulting commit: `91ab960`. The script was never run again (its own git history has exactly one commit, and a byte diff of the script at `91ab960` vs. current `main` is empty — `IDENTICAL`).

   The script also names one Gemini target (`fhr_gemini_smoke_2026_06_13_06`, in `banks/gemini-canonical.json`) and one IO target (`io_matrix_prerenal_aki_recheck_04`, in `banks/io-canonical.json`). Both items existed at `91ab960^` (script's parent commit) with non-uniform `correct` arrays. Comparing their `correct` arrays immediately before and after `91ab960`: **unchanged, for both.** The script silently no-op'd on these two targets despite the same-commit `content-review-defect-log.md` (below) claiming both needed the swap. `patch_bank()`'s traversal only walks `data["questions"]` and, for `itemType == "case_study"`, `caseStudy.questions`; if these two items are standalone non-case-study questions whose container shape differs from what the loop expects (or whose `itemType` isn't `matrix`), they would silently fail to match. This was not investigated further as it is outside the Pair 40 scope, but it is recorded as a correctness gap in the same repair pass.

3. **Why this Item B child is in the target list:** The same commit added `content-review-defect-log.md`, dated 2026-06-13, "Review Phase: Priority 2 (GPT Case Studies & NGN Standalones)". It states: *"During the review of the 25 GPT Priority 2 items, a systematic defect was discovered in almost all of the generated `matrix` questions. The `columnIds` in the `Correct` answer arrays are perfectly inverted, meaning the correct answers map exactly opposite to their intended columns according to the provided rationales and clinical safety standards."* It lists all 8 GPT IDs later hardcoded into `patch-matrix.py`'s `gpt_items`, including `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q1` as item 2. The log also separately flags the Gemini FHR item and the IO item as independently discovered inversions. `patch-matrix.py` is the direct remediation tool for this defect log's "Required Remediation" instruction ("all `c1` references... need to be changed to `c2`, and vice versa").

4. **Was the script a one-time repair, migration helper, abandoned tool, or something else:** One-time targeted repair script, written and run once in direct response to a same-day content-review finding, never reused or generalized, left in the repo afterward as an inert historical artifact.

5. **Would the script's behavior produce the current Item B state from the frozen state?** N/A in that direction (the script already ran, before the freeze — see §3.3.6). In the forward direction it is trivially true that the script produced the current+frozen state from the pre-`91ab960` state: this was verified directly above by diffing `b3a68e8`→`91ab960`.

   **Critical finding, established independently of any downstream audit conclusion:** the defect log's premise — that these 8 GPT matrix items had keys "perfectly inverted" relative to their rationales — was checked against the actual pre-swap bytes for **all 8** named GPT items (not just Pair 40's). For every one of the 8, the pre-swap `correct` mapping **already agreed** with `rationale.byChoice`, row for row (verified by reading each item's rows, columns, byChoice text, and pre-swap `correct` array and checking clinical/semantic direction against the column labels — e.g. `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q2`: r1–r4 urgent findings correctly keyed to "Escalate promptly" (`c1`) pre-swap, matching rationale; `gpt_2026_06_13_case_delirium_uti_01_q1`, `..._q4`, `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q1`, `..._b_case_interpreter_consent_02_q2`, `..._b_matrix_contact_diarrhea_09`, `..._b_matrix_stroke_rehab_10` all show the identical pattern). The defect log's diagnosis of "perfectly inverted" was **factually wrong for all 8 items it named**, and applying `patch-matrix.py`'s blanket swap **broke 8 previously-correct matrix items**, including Pair 40's Item B q1. This is not a downstream conclusion borrowed from held material — it is a direct, independently reproduced comparison of pre-swap bytes against pre-swap rationale text for every named target.

## §3.5 Adjacent blast-radius

The `91ab960` swap is a **known, identifiable, systematic repair-attempt event**, not an isolated one-off: it targeted 10 named items (8 GPT + 1 Gemini + 1 IO) in a single commit, driven by a single same-commit defect log. Of the 10:

- **8 GPT items were actually modified** by the swap, and (per §3.4.5) all 8 appear to have been *broken* by it rather than fixed, since all 8 were already correct pre-swap.
- **2 items (Gemini, IO) were named as targets but the script silently made no change** to either — so whatever inversion (real or misdiagnosed) the defect log claimed for those two was never actually acted on by this commit. Their current state was not further audited here (out of Pair 40 scope) beyond confirming the no-op.

**Classification for §3.5: this is a known systematic repair-attempt event**, not an isolated single-item defect and not merely "unresolved from available evidence" — the commit, script, and target list are fully identified. Target IDs and the single commit responsible:

- `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q2`
- `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q1` (Pair 40's Item B q1)
- `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q1`
- `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q2`
- `gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_contact_diarrhea_09`
- `gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_stroke_rehab_10`
- `gpt_2026_06_13_case_delirium_uti_01_q1`
- `gpt_2026_06_13_case_delirium_uti_01_q4`
- (no-op) `fhr_gemini_smoke_2026_06_13_06`
- (no-op) `io_matrix_prerenal_aki_recheck_04`

Commit: `91ab9606269d4e5a82b4bf613234c06db5830276`.

This review clinically re-adjudicated all 8 modified GPT targets (not just Pair 40's) because that was the minimum evidence needed to establish whether the repair class was "fix" or "regression" — per §3.5's instruction to re-adjudicate only as far as necessary to establish the repair class. The two no-op items (Gemini/IO) were not clinically re-adjudicated; their pre-swap correctness is unknown from this review.
