# Next Architect Handoff — Deterministic Revisit Queue

Date: 2026-07-16  
Status: **planning handoff; no implementation authorized by this file**  
Starting point: merged PR #52, merge commit
`33a04339662c26979ab6c4d8793708234afa701e`

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
| P0 | **Zero-impact retrofit** of schema-floor traversal for `rationale.visuals` — survey **complete**, implementation **authorized** by [`RATIONALE-VISUAL-SCHEMA-FLOOR-RETROFIT-CODEX-SPEC-2026-07-16.md`](RATIONALE-VISUAL-SCHEMA-FLOOR-RETROFIT-CODEX-SPEC-2026-07-16.md) | Bounded deterministic correction; survey returned zero live-bank impact | The defect is real but **latent**: zero visuals occupy any `rationale.visuals` slot, so nothing under-declares today. Land it while the blast radius is provably zero. |
| P1 | Add an active-governance Markdown U+FFFD gate — preflight **clean**, gate-only branch, implementation **authorized** by [`GOVERNANCE-MARKDOWN-ENCODING-GATE-CODEX-SPEC-2026-07-16.md`](GOVERNANCE-MARKDOWN-ENCODING-GATE-CODEX-SPEC-2026-07-16.md) | Small deterministic hardening; no remediation needed | Bank JSON already rejects the replacement character; governance files have no equivalent check. |
| P2 | Expand promoted visual parity beyond three pinned SVGs | Larger deterministic regression project | High-value renderer protection, but baseline ownership and review policy need a deliberate design. |
| P3 | Produce the six-vital deterministic inventory for sanity-bound ratification | Deterministic evidence, followed by clinical judgment | The inventory is bounded; selecting new clinical tripwires is not mechanical and must remain separately ratified. |
| P4 | Inventory single-row lab panels, then obtain an architecture ruling | Deterministic survey followed by product decision | No implementation rule exists yet; a two-row floor must not be inferred. |
| P5 | Consider CI coverage hardening | Engineering policy | The PR gate omits several locally required commands; useful, but not a reason to mix unrelated suites into P0. |

P0 is the best next implementation candidate. P1 is the best small follow-up. Do not combine P2–P4
into the same PR: their evidence, review seats, and reversal costs differ.

## P0 — `rationale.visuals` schema-floor retrofit

> **STATUS UPDATE 2026-07-16 — superseded in part.** The survey below is **complete**; its evidence is
> `audit/rationale-visual-floor-survey-2026-07-16/survey-manifest.json`. Implementation is authorized
> by [`RATIONALE-VISUAL-SCHEMA-FLOOR-RETROFIT-CODEX-SPEC-2026-07-16.md`](RATIONALE-VISUAL-SCHEMA-FLOOR-RETROFIT-CODEX-SPEC-2026-07-16.md),
> which governs where it differs from this section. Three changes:
>
> 1. **Survey complete, zero live-bank impact.** 199 artifacts / 1,852 records / 13 banks; raw lane
>    empty. Three pacer strips, all at `question.visual`, all in a bank declaring `2.0`. **Zero**
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

## P1 — active-governance encoding gate

> **STATUS UPDATE 2026-07-16 — superseded in part.** Preflight ran (Luke; Codex, independently) and is
> **clean**: no U+FFFD in any repository Markdown including untracked files, no mojibake signatures in
> active Markdown, all Markdown valid UTF-8. The **gate-only** branch is confirmed — no remediation
> inventory. Implementation is authorized by
> [`GOVERNANCE-MARKDOWN-ENCODING-GATE-CODEX-SPEC-2026-07-16.md`](GOVERNANCE-MARKDOWN-ENCODING-GATE-CODEX-SPEC-2026-07-16.md),
> which governs where it differs from this section. Two rulings settle open questions below:
>
> 1. **Scope is derived, not allowlisted:** every tracked Markdown file outside `Archive/`, via
>    `git ls-files`. An allowlist would decay exactly the way the CLAUDE.md connector paragraph just
>    did — silently, with nothing announcing the gap.
> 2. **Active producer prompts are in scope** — the explicit decision this section asks for. They fall
>    in automatically under the derived rule, and that is intended.

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

This remains an architecture question: should a labs panel require at least two keyed rows? No live
harm is recorded and no minimum has been ratified.

First inventory every single-row `lab_trend` and structured-measurement labs panel, its question ID,
location, whether the row is load-bearing, whether intact prose duplicates it, and what would fail
under a two-row floor. Then present alternatives:

- allow one row;
- require two rows only for a named visual/panel type; or
- prohibit one row universally.

Do not implement a floor until the architect chooses among them.

## P5 — CI hardening candidate

The PR promotion gate currently runs the broad audit, schema invariants, denominator regression, and
census drift, but the local verification matrix is wider. A future CI-design pass may consider adding:

- TypeScript compilation;
- the topic population/license/vocabulary regressions;
- `test-visuals` or a risk-tiered visual subset;
- production build; and
- checksum verification for workflows that commit generated receipts.

Measure runtime and redundancy first. `pages.yml` already typechecks, validates banks, and builds on
`main`; duplicating every job on pull requests may be worth the earlier feedback, but it is a policy
choice rather than an unambiguous bug fix.

## Handoff summary

Start with the P0 survey. If it reports zero bundled flips, the retrofit is likely a small, high-value
schema/import correction. Follow with P1 as a quiet hardening PR. Keep parity expansion, clinical
vital-bound ratification, and the single-row lab decision in separate workstreams.
