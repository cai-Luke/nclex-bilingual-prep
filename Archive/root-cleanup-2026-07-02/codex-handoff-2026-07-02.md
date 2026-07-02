# Codex Handoff — 2026-07-02

Two independent tasks. Separate commits, separate `PROJECT-HISTORY.md` entries. No dependency between them, but do Task 1's discovery step before writing any join logic.

---

## Task 1 — Implement Translation Telemetry V1.2b (dev)

- Spec: `translation-telemetry-v1-2-correctness-join-audit-candidates-spec.md` (repo root). Full spec already written — implement it as written, do not re-derive scope.
- Precondition already satisfied: V1.2a (sessionId/mode threading + case-part correctness persistence) is merged and its acceptance criteria are confirmed met — see `PROJECT-HISTORY.md`, "Translation Telemetry V1.2a Attempt History (Jul 1)".
- Start at spec §2 Discovery Phase — blocking prerequisite. Inspect `src/storage.ts`, `src/types.ts`, `src/grading.ts`, and the session summary/history write path in `src/App.tsx` before writing any join logic. Confirm: the join key V1.2a actually persisted, the `LanguageMode` literal for on-demand reveal (working assumption `"on-tap"`), and that the `partId` convention matches between `CaseAnswerPartEvent` and `TranslationRevealEvent`.
- **If discovery surfaces anything the spec doesn't anticipate — unstable join key, missing field, literal mismatch — stop and report back rather than improvising.** This is analytic-layer only: no sampler changes, no learner-facing UI, no new instrumentation beyond V1.1/V1.2a. If the diff would touch any bank file, `sessionSampler.ts`, `scoreTargetedReviewCandidate`, or any learner-facing screen, stop — that's out of scope.
- Acceptance criteria are spec §10, verbatim checklist. `summarizeTranslationFriction` is a pure function — unit-test it standalone against fixtures, no live bank/session store dependency.
- Verification: your new fixture test suite, plus `npx tsc -b --pretty false` and `npm run build`.
- On completion, add a milestone to `PROJECT-HISTORY.md` in the same format as the V1.2a entry immediately above it in the file.

---

## Task 2 — Root housekeeping: archive implemented specs, close the bow_12 thread

Move these files, all implemented and no longer active, into a new folder `Archive/root-cleanup-2026-07-02/` (same convention as `Archive/root-cleanup-2026-06-26/`, `Archive/root-cleanup-2026-06-27/`):

- `gpt-rescue-prompt-codex-spec.md`
- `summary-gpt-handoff-codex-spec.md` (superseded by the rescue prompt; keep for history, don't delete)
- `targeted-review-v1-codex-spec.md`
- `translation-telemetry-v1-1-codex-spec.md`
- `translation-telemetry-v1-2a-persisted-attempt-history-spec.md`
- `rhythm-strip-item-type-placement-widening-codex-spec.md`
- `rhythm-strip-pacemaker-overlay-codex-spec.md`
- `stabilization-verification-pass-2026-06-30-codex-spec.md`
- `STABILIZATION-VERIFICATION-HANDOFF-2026-06-30.md`
- `RHYTHM-STRIP-CANDIDATE-LITIGATION-gpt_deepen_2026_06_22_bow_12-2026-07-01.md`

Do **not** move `translation-telemetry-v1-2-correctness-join-audit-candidates-spec.md` — that's Task 1's active spec, stays at root until implemented.

Then add one milestone to `PROJECT-HISTORY.md`, dated Jul 2, titled "Bucket 1B Rhythm-Strip Closeout":

> `gpt_deepen_2026_06_22_bow_12` adjudicated by Claude: stem narrates "frequent premature ventricular contractions," but both dropdown answers resolve without it — `action` (a1: notify provider, prepare K+ replacement) follows from symptomatic hypokalemia (K 2.9, cramps, weakness) alone, and `parameter` (p1: serum potassium + cardiac rhythm) is justified in the rationale by hypokalemia's general dysrhythmia risk, not the observed PVCs specifically. Converting to a `rhythm_strip` visual with a trimmed stem would leave both blanks unchanged — decorative under Principle 6. Confirmed keep-as-text, same disposition as `gemini_backfill_or_cardio_01` and `gemini_c10_07`. Closes the three-item deferral opened in "Rhythm Strip Bucket 1B Conversions (Jul 1)." No canonical bank content changed.

This is a docs-only task — no bank JSON, no schema, no `DECISIONS.md` change. `npm run build`/`validate-bank` are not required since no bank or source file changes, but confirm `git status` shows only the file moves plus the two `PROJECT-HISTORY.md` edits (this task's milestone entry; Task 1's entry lands separately in its own commit).
