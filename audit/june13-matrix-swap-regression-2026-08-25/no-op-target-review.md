# Same-Script No-Op Target Review

Oracle: `91ab960^` = `b3a68e890988ca7155dcc8113881b3a36ddf6826`.

## Commit-level execution finding

Both targets are top-level `matrix` questions in the oracle and current trees. The checked-in `scripts/patch-matrix.py` traversal would enter its non-case-study branch, match each exact ID, and swap four `c1`/`c2` values. It therefore would not logically take the “target not found or no changes needed” path against the committed parent tree.

Nevertheless, `git diff 91ab960^ 91ab960` shows only removal of the terminal newline in each of `banks/gemini-canonical.json` and `banks/io-canonical.json`; both target mappings are JSON-value-identical across the commit. The script writes a bank only when `total_swapped > 0`, and `json.dump` accounts for the newline-only serialization signature. Git records no intermediate working-tree state, so it cannot distinguish an uncommitted pre-script inversion restored by the script from a subsequent targeted reversal or other same-commit sequencing. The exact runtime sequence is not recoverable from committed objects. The evidence supports the bounded conclusion that these are **net tree-level no-op targets**, not that the checked-in traversal could not find them.

## `fhr_gemini_smoke_2026_06_13_06`

- Current location: `banks/gemini-canonical.json`, `questions[774]`.
- Oracle location: `banks/gemini-canonical.json`, `questions[776]`.
- Shape: top-level `matrix`, `single_per_row`; columns `c1 = True / 正确`, `c2 = False / 错误`.
- Key in both trees: `r1→c1`, `r2→c2`, `r3→c2`, `r4→c1`.
- Rationale comparison: absent variability is true; a baseline near 95 bpm is not normal; absent variability with bradycardia is not predictive of normal acid-base status; the Category III pattern requires immediate intrauterine resuscitation. EN and ZH rationales give the same direction for all four rows.
- Current-vs-oracle construct: matrix, stem, correct, and rationale are identical; only a later topic migration differs.
- Classification: `NO_OP_TARGET_CORRECT`.
- New repair work order: not recommended for this target on current evidence.

## `io_matrix_prerenal_aki_recheck_04`

- Current location: `banks/io-canonical.json`, `questions[3]`.
- Oracle location: `banks/io-canonical.json`, `questions[3]`.
- Shape: top-level `matrix`, `single_per_row`; columns `c1 = Appropriate interpretation / 适当解释`, `c2 = Inappropriate interpretation / 不适当解释`.
- Key in both trees: `r1→c1`, `r2→c1`, `r3→c2`, `r4→c1`.
- Rationale comparison: urine output below the stated goal warrants notification; intake exceeded output; the balance is positive rather than negative; continued lung-sound monitoring is appropriate while more fluid is considered. EN and ZH rationales give the same direction for all four rows.
- Current-vs-oracle construct: matrix, stem, correct, and rationale are identical; later category/topic and test-taking-strategy edits do not change the scoring construct.
- Classification: `NO_OP_TARGET_CORRECT`.
- New repair work order: not recommended for this target on current evidence.

Neither target was modified by this repair task.
