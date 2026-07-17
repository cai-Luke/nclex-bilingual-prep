# Claude Documentation Cleanup Handoff — 2026-07-13

## Purpose and boundary

This is a bounded **documentation-only** cleanup for the repository's active reading surface. Work
from current `main` after PR #45 lands. PR #45 fixes the only implementation item in this cleanup
cycle by moving the case-part GPT rescue action below its part rationale in the shared
`CaseActivePart` component; do not repeat or broaden that UI change here.

Do not change banks, staging JSON, schema/runtime behavior, migration scripts, tests, census data,
or clinical content. If resolving a documentation reference appears to require a source-code or
data-contract change, stop and split that work from this pass.

Read before editing:

1. `AGENTS.md`
2. `PROJECT-HISTORY.md`
3. `DECISIONS.md`
4. `NCLEX-Question-Schema.md`
5. `docs/AGENTS-RUNBOOK.md` as needed for repository mechanics

Treat live code and schema as authority for every version, field-shape, validator, renderer, or
workflow claim. This handoff records the cleanup target; it does not supersede those authorities.

## 1. Repair `PROJECT-HISTORY.md` first

The current-status section contradicts itself:

- lines near 40–45 still describe Batch 20 as merely staged and say, “No canonical write has
  occurred”;
- the later current-status paragraphs and dated history correctly record that Batch 20 was
  promoted, R9 week/day handling landed, the structured-measurement migration closed with no open
  holds, and the artifacts were archived;
- the current-status list still calls the case-part GPT rescue order open. PR #45 closes that item.

Collapse the duplicated closed-flowsheet narrative in **Current status** to one authoritative
paragraph. Recommended substance:

> Schema 2.0 is current. The structured-measurement flowsheet migration, including the
> authoritative Batch 20 serial redo and R9 age-marker fixes, is closed. Historical artifacts live
> under the dated archive; the executable gate and applicator own current behavior.

Keep the detailed chronology in the dated history and migration ledger rather than restating it in
Current status. Remove or close the stale GPT-rescue bullet after verifying PR #45 on `main`.

Acceptance checks for this section:

- no active-status sentence says Batch 20 is only staged;
- no active-status sentence says no canonical write occurred;
- no active-status sentence lists 12G, the refeeding baseline, R9, or case-part rescue ordering as
  open;
- the failed Batch 19 pass remains clearly retained only as failure provenance, with Batch 20 the
  authoritative serial redo.

## 2. Archive completed root-level work orders

Move these completed specifications into
`Archive/exhibit-flowsheet-migration-2026-07-13/` and repair active references:

- `r9-age-marker-day-unit-codex-spec.md` — implemented and merged in PR #42;
- `r9-age-marker-week-unit-codex-spec.md` — also implemented; its opening “ready to implement”
  status is stale;
- `exhibit-flowsheet-migration-batch-protocol-codex-spec.md` — completed and retained only for
  reproducibility;
- `EXHIBIT-FLOWSHEET-MULTI-COLUMN-STAGING-CONTRACT-2026-07-12.md` — implemented and exercised by
  promoted content.

Update `Archive/exhibit-flowsheet-migration-2026-07-13/README.md` so it distinguishes durable live
authority from completed historical specifications. Repair active root links and status prose.
Historical documents inside `Archive/` may preserve their original narrative, but links that are
intended to resolve should point to the archived location.

The migration ledger may remain at root if it is intentionally the reusable ledger for future
structured-measurement expansion. If it remains, reconcile its introductory/current-language
claims so its historical “staged” rows cannot be mistaken for present work. If it has no intended
future operational role, archive it in the same dated directory and leave a short active pointer.
Do not delete it.

## 3. Turn the extraction “proposal” into an honest current contract

`EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` remains normative because `DECISIONS.md` and
the gate point to its Rules A–F, especially Rule F, but its title and smoke-batch framing still say
“proposal.”

For this docs-only pass, prefer the least disruptive resolution:

- retain the existing filename so the source-code comment and historical references do not require
  a code diff;
- retitle and trim the root document into the active extraction contract;
- keep the durable Rules A–F and gate semantics;
- move proposal/smoke-batch chronology to the dated archive or replace it with a short historical
  pointer;
- add an explicit status statement that the migration is closed while the contract remains the
  governing extraction policy for any future structured-measurement work.

Do not restate executable enums, field shapes, or accepted units from memory. Link to or verify them
against `src/types.ts`, `src/schema.ts`, `src/measurementAllowlist.ts`,
`scripts/exhibit-flowsheet-gate.ts`, and `scripts/apply-structured-measurements.ts` as applicable.

## 4. Retire the completed visual implementation roadmap

`VISUAL-STIMULI-ROADMAP.md` correctly says U0–U9 and U10 are complete, but it still carries obsolete
premises such as “Only 3 items currently use the visual artifact” and describes the renderer
registry as a future decision even though the registry is live.

Preserve the implementation chronology under `Archive/`, then replace the active root document
with a short policy/backlog surface (keeping the existing path is acceptable and minimizes broken
links). The active version should contain only:

- the current deterministic, data-derived, load-bearing visual policy;
- current lane status verified against the live visual registry and schema;
- rejected visual classes and why they remain rejected;
- the criteria and verification floor for considering a future visual kind;
- links to the archived U0–U10 chronology and current schema/renderer authorities.

Do not carry forward old item counts or architecture-to-be-decided language. Verify the registered
kinds from `src/visuals/` and the current schema rather than copying a count from another document.

## 5. Add a real decision-status index

Do not split or rewrite the decisions themselves. Add a concise top-level index near the existing
status conventions in `DECISIONS.md` with four buckets:

1. **REVISIT now**
2. **Parked until trigger**
3. **Active principles**
4. **Superseded history**

Link to the existing entries and state the trigger where one is already recorded. At minimum,
reconcile the genuine deferred items already present on disk:

- translation-friction scoring remains parked until real dogfooding data shows useful,
  miss-predictive concentration;
- `test` and `adaptive` remain half-exam placeholders pending a choose-real-exam-simulator-or-remove
  decision;
- visual parity coverage, vital-sign sanity bounds, single-row labs, governance-markdown encoding,
  and schema-floor traversal are explicitly tagged `REVISIT` and must be indexed without silently
  promoting them to active implementation work;
- the superseded CBC-unit ruling must route readers to its later active amendment.

The index is a navigation/status aid, not a new ruling. Do not invent owners, dates, or triggers and
do not mechanically label an old entry without reading its later amendments.

## Verification and handoff

Before opening the PR:

- inspect the full diff and confirm it is documentation-only;
- run `git diff --check`;
- verify every changed Markdown link/path, including links from the archive README and active root
  documents;
- use `rg` to confirm the four archived root filenames no longer survive as unresolved active paths;
- use `rg` to confirm the stale Batch 20/no-canonical-write/open-rescue claims are gone from current
  status (historical chronology may retain dated facts where accurate);
- directly verify every surviving schema version, field shape, validator, renderer, and gate claim
  against its owning TypeScript source as required by `AGENTS.md`;
- confirm no bank, staging artifact, census, ledger record content, or source code changed, except
  for an explicitly justified ledger relocation/reconciliation within this docs-only scope.

Open one narrow draft PR for independent review. The PR description should enumerate each moved
file and its repaired references, name any historical links intentionally left as historical text,
and state whether the migration ledger remains active or was archived. Do not fold unrelated
cleanup into this pass.
