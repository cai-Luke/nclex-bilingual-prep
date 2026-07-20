# Archived Root Specifications — 2026-07-19

This directory contains 17 completed or superseded root-level implementation specs, work orders,
closed survey/adjudication packets, and finished pilot-case commissions, moved from the repository
root during a routine staleness sweep. Each was cross-checked against `PROJECT-HISTORY.md` (and, for
the two vitals-trend files, `DECISIONS.md`) to confirm the work it orders or reports is actually done
before moving it — a file's own static "Status:" header was not trusted on its own, since several here
say "ready for generation" or "Open — scoped, not yet commissioned" despite the corresponding
milestone already being implemented and merged.

The move is organizational only. Durable current state remains owned by live code, tests,
`PROJECT-HISTORY.md`, `DECISIONS.md`, the schema, and the review ledger. Cross-references outside this
directory were updated to the archived paths, including the one live (if now-unreachable) code
constant in `scripts/visual-parity-baseline.ts` that names the promoted-visual-parity spec's path.

Preserved files, by arc:

- **GPT Scored-Format Batches 8–11** — `GPT-SCORED-FORMAT-BATCH-{8,9,10,11}-SPEC-2026-07-18.md`. All
  four batches (53 + 18 items) independently reviewed, promoted, and ledgered; see
  `BANK-REVIEW-LEDGER.md` and the "GPT Scored-Format Batches 8/9/10" and "Batch 11" promotion entries.
- **Direct-case pilot C/D** — `GPT-DIRECT-CASE-PILOT-CASE-{C,D}-SPEC-2026-07-19.md`. Both cases
  repaired against independent checker findings and promoted into `gpt-canonical.json`; see "Direct GPT
  Case Pilot C/D Repaired and Promoted." Cases A and B are a separate, unrelated disposition (archived
  learning-experience controls, not completions) and remain at
  `Archive/direct-case-pilot-controls-2026-07-19/`.
- **App update banner** — `APP-UPDATE-BANNER-CODEX-SPEC-2026-07-18.md`. Implemented and deployed.
- **Mobile graph fit-to-width** — `MOBILE-GRAPH-FIT-TO-WIDTH-CODEX-SPEC-2026-07-19.md`. Implemented.
- **Promoted visual parity P2** — `PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md`.
  Implemented and merged in PR #55; closed deterministic regression project.
- **Shape-aware sparse visual layout** — `SHAPE-AWARE-VISUAL-LAYOUT-P4-FOLLOWUP-SPEC-2026-07-18.md`.
  Implemented as a presentation-only follow-up.
- **Single-row lab panels P4** — `SINGLE-ROW-LAB-PANELS-P4-SURVEY-SPEC-2026-07-18.md`. Closed by
  Principle 29; no remediation or implementation authorized, no forward-pointing open thread.
- **Vitals-trend composite readability** —
  `VITALS-TREND-COMPOSITE-READABILITY-{ARCHITECT-SPEC,PRIORITY-HANDOFF}-2026-07-18.md`. Repair
  implemented.
- **Vitals-trend Epic-style unified chart** —
  `VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-{CODEX-SPEC,PROPOSAL}-2026-07-19.md`. A/B experiment concluded
  and ratified as the new default presentation (`DECISIONS.md` amendment, 2026-07-19).
- **Standalone I/O trend fix** — `io_trend_fix.md`. Implemented.
- **R9 temperature sanity decoupling** — `r9-temperature-sanity-decoupling-codex-spec.md`. Ratified and
  closed 2026-07-15; `VITAL_SANITY_MAX_OVERRIDES.temp` in `src/measurementAllowlist.ts` carries the
  ratified value forward in code.

Explicitly excluded from this sweep (still open or still living reference material, not stale):

- `VITAL-SANITY-BOUNDS-P3-SURVEY-ARCHITECT-SPEC-2026-07-17.md` — P3's inventory and stage-2 adjudication
  are ratified, but stage-3 clinical sourcing for three advanced sides is the current open step.
- `NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md` — P5 (CI-hardening policy) remains an open,
  undecided item; this is the file tracking it.
- `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` — self-describes as a living authority map, not
  historical spec prose; the migration it was authored for is closed, but the document's routing table
  is still the current one.
- `lab-reference-range-verification-spec.md` — active, unfinished; `ANALYTE_DEFS` in
  `src/visuals/kinds/lab_trend/defs.ts` still carries its placeholder-range warning.
- `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md` — living contract for the now-standing episodic
  direct-case pathway, not a one-off pilot spec.
- Active generation prompts (`gpt-evergreen-generation-prompt.md`, `NCLEX-Bank-Generation-Prompt.md`,
  `GeminiPrompt.md`, `Gemini.md`), living ledgers/worksheets (`TOPIC-VOCABULARY-DECISIONS.md`,
  `VISUAL-STIMULI-ROADMAP.md`), and current operational architecture docs.
