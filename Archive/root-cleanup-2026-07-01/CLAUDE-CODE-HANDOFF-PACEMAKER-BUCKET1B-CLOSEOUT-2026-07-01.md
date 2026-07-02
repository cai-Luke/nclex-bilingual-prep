# Claude Code Handoff — Pacemaker/Bucket 1B Closeout

Date: 2026-07-01
Status: Luke approved both dispositions below, following the review chain in `pacemaker-bucket1b-content-review-spec.md` → `GEMINI-PACEMAKER-BUCKET1B-META-ASSESSMENT-2026-07-01.md`. This handoff closes out the two `needs-human-clinical-review` items from that report. Nothing else is in scope.

Both fixes land in `banks/hard-cases-canonical.json` only. Do not touch `claude-canonical.json` or `visual-canonical.json` — the 5 items already marked `content-reviewed` in the meta-assessment are done; do not reopen them.

---

## Fix 1 — Stroke case: rewrite `q1` row `r5` (residual narration leak)

**Target:** `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01` → `caseStudy.questions[]` → `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_q1` (matrix) → `matrix.rows[]` → row id `r5`.

**Current:**
- `en`: "Irregularly irregular heart rhythm with atrial fibrillation history"
- `zh`: "心律绝对不规则且有房颤病史"

**Change to:**
- `en`: "Cardiac rhythm pattern on the baseline telemetry strip"
- `zh`: suggested "基线遥测心律条上显示的心律模式" — confirm/polish natural phrasing yourself, this is a suggestion not a mandate.

**Do not change:** the row's `id`, its `correct` mapping (`r5 → c1` stays), or its `rationale.byChoice` entry for `r5` — that rationale ("Atrial fibrillation is a major risk factor for cardioembolic stroke...") is post-answer content and remains accurate once the learner has read the strip and identified AFib themselves.

**Scope guard:** the string "irregularly irregular" also appears once more in this same case, in a later Stage 3 exhibit ("On neuro-ICU arrival: ... HR 82/min irregularly irregular..."). That's unrelated, independently-authored text describing a different timepoint with no visual attached — **leave it alone**, it's out of scope for this fix.

---

## Fix 2 — ADHF case: revert the exhibit visual conversion

**Target:** `cs_adhf_pulm_edema_01` → `caseStudy.exhibits[]` → exhibit id `ed_assessment`.

**Action:** remove the `visual` field (the `rhythm_strip`, `rhythm: "afib"`, no-pacer visual added by the Bucket 1B pass) and restore `content.en` / `content.zh` to describe the rhythm as text again. Confirmed necessity gap: none of the case's 4 embedded questions (`part_1`–`part_4`) require reading the strip — see the meta-assessment report for the full per-question audit. The visual is decorative under principle 6; reverting is the agreed disposition (over adding a new graded item, which would cut against the standing content-generation pause and further overweight `rhythm_strip`, already the largest visual kind at 51/161).

**Recover the exact original wording before rewriting anything.** This exhibit's content was `content-reviewed` prior to the Bucket 1B patch — that's previously-reviewed text, not something to re-author from memory. Use `git log -p -- banks/hard-cases-canonical.json` (or `git show`/`git blame` against the Bucket 1B commit that touched this exhibit) to find the diff that trimmed the "Heart Rate: 128 beats/minute..." line and restore it verbatim, in both `en` and `zh`.

If git history turns out to be squashed or otherwise unrecoverable: do not fabricate exact original wording. Write a minimal restoration instead (e.g. append ", irregularly irregular" back onto the existing heart-rate line, drop the "; telemetry strip shown below" clause) and say explicitly in the ledger note that this is a reconstructed approximation, not a verbatim git revert, so Luke knows to spot-check it.

**Nothing else to clean up here** — case-study exhibits carry no `meta` block in this schema, so there's no orphaned `meta.expected`/`meta.visual_justification` to remove alongside the visual.

---

## Verification (run once, after both fixes)

```
npm run validate-bank -- banks/hard-cases-canonical.json
npm run test-visuals
npm run audit
npm run census
npm run build
```

Expect `census.json`/`BANK-CENSUS.md` to show `rhythm_strip` visuals dropping by one (51→50) and total visuals 161→160. Top-level/embedded question counts should be unchanged (this is a content edit, not an add/remove of questions).

## Ledger and history

- `BANK-REVIEW-LEDGER.md`: update the 2026-07-01 pacemaker/Bucket 1B entry so both items move out of `needs-human-clinical-review` — record what changed (r5 rewrite; ADHF exhibit visual removed + content restored, note whether via verbatim git revert or reconstructed approximation), that Luke approved both dispositions, and reference this handoff file.
- `PROJECT-HISTORY.md`: short milestone entry closing out the pacemaker/Bucket 1B arc end-to-end (Spec E landed → content review → 2 flags → resolved).
- Don't touch `Merged Source Batches` rows for the original Bucket 1B conversion — this is a follow-up correction to that entry, not a new merge.

## Explicit non-goals

- Do not reopen review of the 5 already-`content-reviewed` items.
- Do not widen scope to Bucket 2, Phase 4, or any other pacemaker-overlay work.
- Do not touch the Stage 3 "irregularly irregular" exhibit text noted above.
