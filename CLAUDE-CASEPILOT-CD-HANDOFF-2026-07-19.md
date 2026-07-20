# Handoff: Direct-Case Pilot C/D — repaired and promoted, not pending

Status update to the "C/D Repair-Gate Approved" disposition entry in `PROJECT-HISTORY.md`: that
repair is done. Both cases are now live in `banks/gpt-canonical.json` (769→771), pushed to
`origin/main` at commit `cd33a4a`.

## What changed since the disposition note

- Codex's checker findings on both cases were independently re-derived from the raw JSON and the
  producer contract (not taken on faith), then repaired via `scripts/patch-raw` one-off scripts —
  no hand-edited JSON.
- Case C: fixed the reverse leakage into Part 4 (10:30 narrative + Part 5 option D) and the
  baseline-terminology drift between the 10:09/10:30 CTG exhibits.
- Case D: fixed the untitrated 97% SpO₂ against GINA's 95% adult ceiling — the checker's report had
  cited 96%, corrected on independent lookup — and closed Part 5's source-scope gap with an
  additional exact citation rather than a redesign.
- Post-consolidation, `audit:topic-license` caught one finding neither the checker nor the initial
  repair pass had flagged: Case D's Part 4 (medication-safety item) carried a topic licensed only
  under a different category. Retopicked in the canonical file, not recategorized.
- Full gate passed: `validate-bank`, `promote`, `audit` (2,673 unique IDs, both cases' 5/5
  `answerableAfterStageId` anchors resolving, topic-license clean), `consolidate`, census/build.
  Only the pre-existing, unrelated EKG select_all distributional advisory remains.
- Raw drafts deleted after the `BANK-REVIEW-LEDGER.md` entry (2026-07-19) was recorded.
- `DECISIONS.md` and `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md` updated: the direct-GPT case
  pathway is now a viable episodic route (not a one-off pilot), still bounded by the normal
  independent promotion gate — not a standing bulk-generation lane.

## Nothing left open on C/D

A and B remain archived controls under `Archive/direct-case-pilot-controls-2026-07-19/` with no
repair/promotion path.

Details: `BANK-REVIEW-LEDGER.md` → "2026-07-19 — GPT Direct-Case Pilot C/D promotion";
`PROJECT-HISTORY.md` → "Direct GPT Case Pilot C/D Repaired and Promoted (Jul 19)"; commit `cd33a4a`.

Patch scripts (for provenance, not re-run): `scripts/patches/2026-07-19-gpt-casepilot-case-c-final-review.ts`,
`scripts/patches/2026-07-19-gpt-casepilot-case-d-final-review.ts`,
`scripts/patches/2026-07-19-case-d-part4-topic-license.ts`.
