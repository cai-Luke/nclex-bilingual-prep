# Next Architect Handoff — Deterministic Revisit Queue

Date: 2026-07-16; status refreshed 2026-07-17
Status: **planning handoff; no implementation authorized by this file**  
Starting point: merged PR #55, merge commit
`7792caf3743c45740ad37d7c4c61adda5b17a236`

## Closed context — do not reopen

The census-denominator/topic-license arc is closed.

- PR #52 merged with its two-commit generation chain preserved.
- The clean generation input remains
  `43a1087d48e1f622922abdd271d6d82f5f4a2b62`; generated reports are in `f28123f`.
- The local-only hygiene check requested in the final architecture review passed before and after
  merge: the worktree was clean and root-level
  `CENSUS-DENOMINATOR-DESIGN-QUESTION.md` does not exist. The resolved copy is under `Archive/`.
- Scored leaves govern content planning; session units govern inventory and delivery capacity;
  recursive visual artifacts remain a third population.
- Topic vocabulary and category-license residuals are zero. SHARED-topic clinical boundaries remain
  semantic-review work.
- Burn Management remains closed. Do not re-adjudicate its retained population.

The scored-leaf report has no under- or over-served category finding and no 50-question standalone
capacity shortfall. The active Batch 7 producer commission is format-targeted, not category rescue:
`GPT-SCORED-FORMAT-BATCH-7-SPEC-2026-07-16.md`.

## Recommended order

| Priority | Work | Nature | Why now |
|---|---|---|---|
| ~~P0~~ | **IMPLEMENTED AND MERGED IN PR #54** — shared six-location schema/export/parity traversal, generated survey, and regressions. See [`Archive/root-specs-2026-07-18/RATIONALE-VISUAL-SCHEMA-FLOOR-RETROFIT-CODEX-SPEC-2026-07-16.md`](Archive/root-specs-2026-07-18/RATIONALE-VISUAL-SCHEMA-FLOOR-RETROFIT-CODEX-SPEC-2026-07-16.md). | Closed deterministic correction; zero live-bank impact | The full-schema and census-artifact traversals remain intentionally separate. |
| ~~P1~~ | ~~Active-governance Markdown U+FFFD gate~~ — **DROPPED 2026-07-16 (Luke's ruling).** Every mojibake alarm has been a connector-read artifact, not disk corruption; a repo gate guards the wrong surface. See `DECISIONS.md` §8. | — | — |
| ~~P2~~ | **IMPLEMENTED AND MERGED IN PR #55** — promoted visual parity survey, 12-kind baseline, rebaseline mechanics, U0 migration, and visual CI command | Closed deterministic regression project | The accepted architecture and evidence are preserved in [`PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md`](PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md). |
| ~~P3 inventory~~ | **INVENTORY IMPLEMENTED AND MERGED; STAGE-2 ADJUDICATION RATIFIED (Jul 17–18).** The all-seven-vital deterministic inventory shipped and its independent classification review closed (provenance repair `9bf33b2`). Architect stage-2 adjudication is ratified as §20 of [`VITAL-SANITY-BOUNDS-P3-SURVEY-ARCHITECT-SPEC-2026-07-17.md`](VITAL-SANITY-BOUNDS-P3-SURVEY-ARCHITECT-SPEC-2026-07-17.md). **P3 stage 3** (clinical sourcing for the three advanced sides) is the current open step. | Clinical judgment, separately ratified | Selecting new clinical tripwires is not mechanical; three sides advanced, ten remain provisional/structural. |
| P4 adjudication | **MECHANICAL INVENTORY COMPLETE; independent semantic adjudication pending.** No floor is selected or implemented. | Product/architecture decision from deterministic evidence | The producer manifest leaves all semantic classifications null. |
| P5 | Consider remaining CI coverage hardening | Engineering policy | PR #55 added the single authorized `npm run test-visuals` step; broader typecheck/build/checksum policy remains unratified. |

P0 and P2 are implemented and merged. **P1 is dropped** (see below). **P3's deterministic inventory is
now also merged and its stage-2 adjudication ratified — P3 has moved from evidence-gathering into
clinical sourcing (stage 3).** P4's deterministic phase is complete; its producer-independent
candidate adjudication is the current step. Its evidence, review seats, and reversal costs differ
from P3's. P5 is only partially addressed and
remains a separate policy decision.

## P0 — `rationale.visuals` schema-floor retrofit

> **STATUS UPDATE 2026-07-16 — IMPLEMENTED.** The survey evidence is
> `audit/rationale-visual-floor-survey-2026-07-16/survey-manifest.json`; the completed implementation
> is governed by [`Archive/root-specs-2026-07-18/RATIONALE-VISUAL-SCHEMA-FLOOR-RETROFIT-CODEX-SPEC-2026-07-16.md`](Archive/root-specs-2026-07-18/RATIONALE-VISUAL-SCHEMA-FLOOR-RETROFIT-CODEX-SPEC-2026-07-16.md).
> The pre-implementation defect and order remain below as provenance. Three resolved points:
>
> 1. **Survey complete, zero live-bank impact.** 199 artifacts / 1,869 records / 13 banks; raw-draft
>    and promoted-staging lanes empty. Three pacer strips, all at `question.visual`, all in a bank declaring `2.0`. **Zero**
>    visuals in any `rationale.visuals` slot. Zero flips, zero envelope changes. The work is a
>    zero-impact retrofit; **no canonical metadata migration is authorized**.
> 2. **All three walkers must converge** — `schema.ts`, `bankImport.ts`, *and* `visual-parity.ts`. The
>    "decide whether" below is decided. Consolidating two of three would replace three
>    consistent-but-incomplete walkers with two silently disagreeing sources of truth. Traversal
>    *completeness* closes in P0; parity *coverage* expansion remains P2.
> 3. **All rationale-location regressions are synthetic.** The corpus contains none, so they prove the
>    walker, not coverage. Corpus proof and synthetic proof are separate claims.

### Defect

`src/schema.ts` and `src/bankImport.ts` each define a hand-written `hasPacerRhythmStrip` traversal.
Both inspect question visuals, case exhibits, staged exhibits, and embedded question visuals, but omit
top-level and embedded `rationale.visuals`. A pacer-bearing `rhythm_strip` in an explanation figure can
therefore evade the schema 1.7 floor during validation and export-envelope inference.

`src/schema.ts` already exports `collectAllVisuals(question)`, which traverses:

- top-level question visuals;
- top-level rationale visuals;
- case exhibits;
- staged exhibits;
- embedded-leaf visuals; and
- embedded rationale visuals.

The IO-trend schema floor already uses this shared traversal. The enabling architecture is present;
the pacer floor has not been moved onto it.

### Required pre-move survey

Before tightening either floor:

1. Enumerate every bundled and raw bank record with a `rhythm_strip` carrying `pacer`.
2. Record its file, question ID, exact location (question, rationale, exhibit, stage, embedded leaf, or
   embedded rationale), declared schema version, and whether current versus proposed logic changes
   the required floor.
3. Report separately:
   - bundled-bank validation flips;
   - raw/staging flips;
   - export-envelope version changes; and
   - zero-impact populations.
4. Stop for architecture review if any bundled bank newly fails or an exported envelope changes in a
   way that affects a supported import path. Do not silently bump canonical metadata to make the test
   pass.

### Likely implementation if the survey is acceptable

- Replace both pacer-specific recursive walkers with a predicate over `collectAllVisuals`.
- Keep feature detection explicit at the call site; do not make every schema-floor rule implicit.
- Do not change the PR #52 `visualArtifacts` census definition as a ride-along. That report's
  architect-ratified artifact basis did not include explanation figures.
- Decide whether `scripts/tests/visual-parity.ts` should consume a new owner/location-aware shared
  projection. Its current third hand-written walk also omits rationale visuals, but snapshot identity
  needs stable location labels, not just a flat visual array.

### Required regression cases

At minimum:

1. top-level `rationale.visuals` pacer strip: schema 1.6 fails, 1.7 passes;
2. embedded-leaf `rationale.visuals` pacer strip: schema 1.6 fails, 1.7 passes;
3. non-pacer rationale rhythm strip does not require 1.7;
4. `toExportEnvelope` selects 1.7 for top-level and embedded rationale pacer strips;
5. existing question/exhibit/stage/embedded visual floor cases remain unchanged;
6. IO-trend floor tests remain green; and
7. the survey fixture fails if any visual location is dropped from the shared full-visual traversal.

### Verification floor

This touches schema and import behavior, so use the full path from `AGENTS.md`, including the
bank-impact survey before the floor tightens:

```bash
npm run validate-bank -- banks/*.json
npm run audit
npm run test:schema-bank
npm run test:coverage-report
npm run test-visuals
npx tsc -b --pretty false
npm run census && npm run census:check
npm run build
git diff --check
```

Add a focused export-envelope regression if the existing schema-bank suite does not exercise
`toExportEnvelope` directly.

### Exit condition

- Survey committed or preserved as deterministic evidence.
- Zero unexplained bank flips.
- Validator and exporter agree on the 1.7 floor for every visual location.
- No new traversal is added.
- DECISIONS revisit entry is closed or narrowed to any explicitly deferred parity work.

## P1 — active-governance encoding gate — **DROPPED, DO NOT IMPLEMENT**

> **RULING 2026-07-16 (Luke). This entire section is withdrawn. Nothing below is authorized.**
>
> Preflight ran three times and came back clean every time (2026-07-09; 2026-07-16 × 2, the latter
> covering untracked files and confirming all repository Markdown is valid UTF-8). The reason it is
> always clean: **every mojibake alarm this project has raised has been a connector-read artifact.**
> The corruption is in the path Claude reads through, never on disk.
>
> A repo-side gate is therefore the wrong instrument — it would scan clean files indefinitely, never
> fire, and falsely imply the read path had been validated. The `banks/*.json` analogy that motivated
> this item does not transfer: bank JSON is machine-consumed and a U+FFFD there ships silently to a
> learner, whereas governance Markdown is read by humans and models, so corruption is visible at the
> point of use and has been caught by the reader every time.
>
> Replacement control: the `CLAUDE.md` connector rule now tells the reading seat to suspect its own
> connector before the repo. Write-path residual is covered by a one-time `grep` at commit time by a
> non-connector tool.
>
> Full reasoning and the closed REVISIT thread: `DECISIONS.md` §8. **Do not re-open this by citing
> "banks are gated but markdown isn't."** The original section is retained below only as the record of
> what was considered.

### Narrow first pass

Add a deterministic U+FFFD replacement-character scan for active governance Markdown. Start with an
explicit allowlist or clearly documented active-file rule that covers at least:

- `AGENTS.md`;
- `DECISIONS.md`;
- `PROJECT-HISTORY.md`;
- `NCLEX-Question-Schema.md`;
- `BANK-REVIEW-LEDGER.md`;
- `TOPIC-VOCABULARY-DECISIONS.md`; and
- `docs/AGENTS-RUNBOOK.md`.

Also decide explicitly whether active producer prompts belong in the same gate. Do not recurse over
all of `Archive/` by accident; historical evidence has different remediation costs.

The first gate should match the proven JSON invariant: U+FFFD is never legitimate content. Broader
mojibake signatures such as common UTF-8/Windows-1252 fragments need an inventory and false-positive
policy before they become failures.

### Implementation shape

- One small read-only script with deterministic sorted paths and line/column evidence.
- A focused regression using temporary fixtures or pure scanner functions.
- One package script and one PR-gate step.
- No automatic rewriting or normalization.

### Exit condition

The gate fails on a seeded U+FFFD, passes every active file, identifies the exact location, and has a
documented scope owner.

## P2 — promoted visual parity expansion

> **STATUS UPDATE 2026-07-17 — IMPLEMENTED AND MERGED IN PR #55.** The survey, adjudication,
> initial-baseline bootstrap, U0 ownership migration, steady-state rebaseline mechanics, promoted
> parity regression, and the authorized `test-visuals` CI hook are complete. The ratified design and
> provenance remain in
> [`PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md`](PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md).
> The pre-implementation framing below is retained as historical context, not an open work order.

Current `scripts/tests/visual-parity.ts` pins three rhythm-strip SVG hashes plus validation-reason
cases. It does not protect the broader promoted visual surface. The latest recursive census reports
199 visual artifacts, but that is an inventory number, not automatically the correct snapshot
denominator.

The architect should first ratify:

1. which visual locations enter parity (question, exhibit, staged exhibit, embedded leaf, rationale);
2. whether every promoted artifact gets a byte hash or whether deterministic semantic summaries are
   preferable for some kinds;
3. the reviewed rebaseline procedure when an intentional renderer change lands;
4. how calibrated tracing kinds receive visual smoke review in addition to hash changes; and
5. how load-bearing arithmetic kinds preserve before/after `selfCheck` numeric equality.

This should be its own PR. A generated wall of hashes without a review/rebaseline policy is not a
regression architecture.

## P3 — remaining vital-sign sanity bounds

> **STATUS UPDATE 2026-07-18 — INVENTORY MERGED; STAGE 2 RATIFIED; NOW IN STAGE-3 SOURCING.** The
> deterministic inventory shipped as the P3 survey generator, dated manifest
> (`audit/vital-sanity-bounds-survey-2026-07-17/survey-manifest.json`), and citation-locking
> regression. Its independent classification review closed and the item-3 provenance repair merged as
> `9bf33b2`. Architect stage-2 adjudication is ratified as §20 of
> [`VITAL-SANITY-BOUNDS-P3-SURVEY-ARCHITECT-SPEC-2026-07-17.md`](VITAL-SANITY-BOUNDS-P3-SURVEY-ARCHITECT-SPEC-2026-07-17.md).
> The pre-inventory framing below is retained as provenance, not an open work order.
>
> **Ratified stage-2 disposition (all thirteen open sides, `temp` floor included).** Read from the
> merged manifest's boundary-neighbour and mechanism-cost fields, not a prose summary:
> - **SBP ceiling — proceed to extreme-value sourcing.** Forcing evidence is the carried ~370
>   counterexample, which is off-surface prose (P3 covers machine-readable values only), so it is
>   sourced rather than treated as manifest-confirmed.
> - **RR ceiling — proceed to extreme-value sourcing.** Carried RR-at-`80`-with-no-margin finding.
> - **SpO₂ floor — proceed to device/reporting-limit sourcing.** Carried displayable-below-50 finding.
>   The floor override mechanism does not exist, so if this floor is sourced and ratified, extending
>   `VITAL_SANITY_MAX_OVERRIDES` to floors plus its drift guard is a **contingent implementation
>   prerequisite**, carried into the stage-5 implementation PR — not a stage-3 deliverable.
> - **All ten other sides remain provisional or structural**, including the RR floor (a real value at
>   `6` near floor `2` is a tightening-caution signal, not a demonstrated defect) and the `temp` floor
>   (inherited, unratified, no named forcing incident). SpO₂ `100` is a physical ceiling.
>
> No candidate numbers are selected. Stage 3 sources clinical/device/reporting-limit evidence for the
> three advanced sides only, routes it producer≠checker, and returns to Luke for per-vital/per-side
> ratification before any implementation PR.

Only the temperature ceiling has been independently sourced and ratified. The remaining six vital
tripwires (`hr`, `sbp`, `dbp`, `map`, `rr`, `spo2`) still inherit renderer envelopes.

The next deterministic deliverable is an inventory, not new numbers:

- enumerate the seven renderer ranges, current measurement-allowlist sanity bounds, units, and all
  bundled/raw authored values;
- distinguish renderer display envelope, adult normal/reference range, reporting limit, critical
  threshold, and typo/unit-error sanity tripwire;
- include exact boundary and unit-conversion probes;
- identify current values that would flip under candidate intervals without recommending an interval;
  and
- route sourced clinical proposals to producer≠checker review and Luke's ratification.

Do not author the six bounds from model memory. The deterministic inventory can land separately from
the later clinical decision.

## P4 — single-row lab panels

> **STATUS UPDATE 2026-07-18 — MECHANICAL INVENTORY COMPLETE.** The dated manifest and review packet
> inventory 11 one-series `lab_trend` visuals and 13 one-row structured labs panels. Independent
> semantic adjudication is pending; no floor is selected or implemented.

This remains an architecture question: should either laboratory surface receive a larger minimum?
No live harm is recorded and no minimum has been ratified. The two surfaces remain separate.

The completed inventory supplies every candidate's question ID, location, values, surrounding prose,
answer material, current proof surface, and mechanical policy impact. The independent checker now
classifies whether each presentation is load-bearing, whether prose duplicates it, and whether a
meaningful second analyte/row exists. Then present alternatives:

- allow one row;
- require two rows only for a named visual/panel type; or
- prohibit one row universally.

Do not implement a floor until the architect chooses among them.

## P5 — CI hardening candidate

PR #55 added the one authorized `npm run test-visuals` promotion-gate step; that command includes
P0's six-location schema-floor regression. The local verification matrix remains wider. A future
CI-design pass may consider adding:

- TypeScript compilation;
- the topic population/license/vocabulary regressions;
- production build; and
- checksum verification for workflows that commit generated receipts.

Measure runtime and redundancy first. `pages.yml` already typechecks, validates banks, and builds on
`main`; duplicating every job on pull requests may be worth the earlier feedback, but it is a policy
choice rather than an unambiguous bug fix.

## Handoff summary

P0 and P2 are implemented and merged; P1 is dropped. **P3's deterministic inventory is merged and its
stage-2 adjudication ratified; P3 is now in stage-3 clinical sourcing for three advanced sides (SBP
ceiling, RR ceiling, SpO₂ floor), with the SpO₂-floor mechanism extension a contingent implementation
prerequisite.** Keep the remaining clinical vital-bound sourcing/ratification, the single-row lab
decision (P4), and any remaining CI policy (P5) in separate workstreams. P4 is the best next
self-contained deterministic-then-ruling session.
