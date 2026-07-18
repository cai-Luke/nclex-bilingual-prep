# Project Shrimp — P4 Single-Row Lab Presentation Handoff

Start from the **live local worktree**, not GitHub or conversation memory.

PR #57 is merged. Claude subsequently made four uncommitted local Markdown edits closing P3 and recording the ratified stage-2 disposition. Content generation is running independently and is not part of this workstream.

## Step 0 — Review and close the local P3 documentation edits

Read `AGENTS.md`, then inspect:

* `PROJECT-HISTORY.md`
* `DECISIONS.md`
* `NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md`
* `VITAL-SANITY-BOUNDS-P3-SURVEY-ARCHITECT-SPEC-2026-07-17.md`

Use the local filesystem and Git diff, not a connector rendering, as the authority.

Verify:

1. The four files are the only intended P3 closeout modifications.
2. `audit/vital-sanity-bounds-survey-2026-07-17/survey-manifest.json` is unchanged.
3. The files decode as valid UTF-8 and contain no U+FFFD or obvious mojibake. Perform this with a plain local command outside Claude’s connector path.
4. `git diff --check` passes.
5. The final stage-2 scope is exactly:

   * SBP ceiling → extreme-value sourcing.
   * RR ceiling → extreme-value sourcing.
   * SpO₂ floor → device/reporting-limit sourcing.
   * A floor-override mechanism and drift-guard extension is a contingent implementation prerequisite only if a SpO₂ floor later survives sourcing and ratification.
   * The other ten open sides remain provisional or structural.
   * No candidate values are selected.
6. Temperature floor appears among the thirteen adjudicated open sides.
7. The grouped provisional row accounts for eight sides: HR ×2, DBP ×2, MAP ×2, SBP floor, and SpO₂ ceiling. With the five individually listed sides, the total is thirteen.
8. Resolve from the actual diff whether §19 was modified. Claude’s summary simultaneously claimed a §19 closeout note and that §§1–19 were untouched; do not preserve both claims if they conflict.
9. The new §20 contains no garbled row labels or editing artifacts.
10. The living documents no longer say the deterministic inventory or independent classification review is pending.

Patch only genuine defects. Do not reopen the ratified P3 matrix. If clean, commit the P3 closeout as a separate docs-only commit before starting P4.

---

# P4 Commission — Deterministic Single-Row Lab Presentation Survey

## Status and authority

This is an **evidence-first, report-only architecture pass**.

Survey tooling, a committed manifest, and focused regression coverage are authorized. No schema floor, renderer behavior, bank content, reference-band policy, or runtime behavior may change.

Do not infer or implement a two-row minimum. Stop after producing the deterministic evidence and architecture decision packet.

## Governing question

Determine whether any current single-row or single-analyte laboratory presentation is redundant, decorative, or too weak to justify its structured/visual surface—and whether a future minimum should apply to either surface.

There are two separate contracts. Do not collapse them:

### Surface A — `lab_trend`

A candidate is a `lab_trend` visual with exactly one `series` entry.

This means **one analyte**, not one observation. A valid `lab_trend` still has at least three timepoints. The current type and validator intentionally allow one or two analytes and describe the plotted series as the load-bearing analyte or analytes.

Any proposal to require two series would therefore change an explicit visual contract, not merely tighten an accidental omission.

### Surface B — structured-measurement labs panels

A candidate is an individual `structuredMeasurements.panels[]` entry where:

* `kind === "labs"`; and
* `rows.length === 1`.

Count panels, not exhibits. An exhibit containing multiple panels can contribute zero, one, or multiple candidates.

The current schema requires rows to be nonempty but imposes no two-row minimum.

## Read before implementation

At minimum, inspect live versions of:

* `AGENTS.md`
* `PROJECT-HISTORY.md`
* `DECISIONS.md`, especially the single-row labs REVISIT entry
* `NCLEX-Question-Schema.md`
* `src/types.ts`
* `src/schema.ts`
* `src/allowedKeys.ts`
* `src/visuals/kinds/lab_trend/types.ts`
* `src/visuals/kinds/lab_trend/index.ts`
* the structured-measurements renderer and existing structured-measurement traversal/gate code
* the shared location-aware full-schema visual projection landed in P0
* current canonical banks and any optional raw/promoted staging directories that exist locally
* relevant visual and structured-measurement regressions

Do not create another generic recursive question or visual traversal when a current owner already exists.

## Population

Report separately:

1. bundled top-level canonical banks;
2. raw drafts, if the optional raw directory exists;
3. promoted staging, if the optional promoted directory exists.

Absent optional directories are an empty population, not an error. Other filesystem failures remain failures.

For `lab_trend`, traverse every current full-schema visual location using the existing location-aware projection:

* top-level question visual;
* top-level rationale visual;
* case exhibit;
* staged case exhibit;
* embedded-question visual;
* embedded rationale visual.

For structured measurements, enumerate every applicable top-level and staged case exhibit carrying `structuredMeasurements`, and inspect each labs panel independently.

## Required deterministic record fields

For every candidate, record at least:

* lane and bank path;
* top-level question or case ID;
* embedded leaf ID when applicable;
* exact object path;
* normalized location label;
* declared schema version;
* surface: `lab_trend` or `structured_labs_panel`;
* item type, category, topic, and difficulty;
* analyte key or structured row key;
* displayed label;
* unit;
* population declaration/effective population when applicable;
* number of timepoints for `lab_trend`;
* number of columns and values for structured panels;
* presence and exact path of keyed visual metadata such as expected trends or expected flags;
* whether the candidate passes current validation and current applicable self-checks;
* the hypothetical result under each candidate policy described below.

Keep mechanical facts separate from semantic judgments.

## Human-review packet

For each candidate, provide the exact surrounding material needed to adjudicate:

* stem and tested decision;
* relevant answer key;
* the visual or panel values;
* exhibit prose or narrative immediately surrounding it;
* rationale passage that explains the tested cue;
* any declared visual justification or keyed trend/flag metadata.

The reviewing seat must classify:

1. **Load-bearing:** Would removing the visual/panel materially change answerability or the intended reasoning?
2. **Exact prose duplication:** Does intact prose reproduce every value, unit, time relationship, and clinically relevant trend shown by the presentation?
3. **Partial duplication:** Does prose repeat isolated values but not the relationship or trend being tested?
4. **Second-row merit:** Is there a clinically meaningful second analyte/row that belongs here, or would adding one be filler introduced only to satisfy a floor?
5. **Surface fit:** Is the presentation appropriate as a one-analyte trend, a one-row structured panel, ordinary prose, or some other existing surface?

Do not let the producing survey generator self-certify these semantic fields. Route them to an independent review seat.

## Candidate policies to model

Model impact separately for:

### `lab_trend`

* **L1 — Preserve current contract:** one or two series remain valid.
* **L2 — Require two series universally.**
* **L3 — Permit one series only when independently reviewed as load-bearing and not exactly duplicated by prose.**

### Structured labs panels

* **S1 — Preserve current contract:** one or more rows remain valid.
* **S2 — Require two rows for every structured labs panel.**
* **S3 — Permit one row only when independently reviewed as load-bearing and not exactly duplicated by prose.**
* **S4 — Restrict any two-row floor to a named panel/context class identified by the evidence.**

For every policy, report:

* candidate count affected;
* records that would newly fail;
* affected banks and locations;
* whether a metadata-only repair is possible;
* whether compliance would require adding clinically unnecessary data;
* whether removing the structured/visual surface would preserve answerability;
* schema, renderer, export-envelope, parity, or bank-migration consequences.

Do not recommend one universal rule merely because both surfaces happen to contain laboratory data.

## Suggested artifacts

Use existing naming conventions, with a shape similar to:

* `SINGLE-ROW-LAB-PANELS-P4-SURVEY-SPEC-2026-07-18.md`
* `scripts/single-row-lab-panels-survey.ts`
* `audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json`
* `scripts/tests/single-row-lab-panels.ts`
* package commands for deterministic regeneration and byte-drift testing

The generator should produce only mechanical evidence. Semantic review may be a separate dated adjudication document or manifest layer owned by the checker seat.

## Required regressions

At minimum prove:

1. one-series `lab_trend` is detected as a P4 candidate but remains valid under the current contract;
2. two-series `lab_trend` is not a candidate;
3. timepoint count is not confused with series count;
4. one-row labs panel is detected;
5. one-row vitals panel is excluded;
6. two-row labs panel is excluded;
7. separate one-row panels in the same exhibit are counted separately;
8. all relevant top-level, staged, and embedded visual locations are traversed;
9. optional absent staging directories produce zero records;
10. manifest regeneration is byte-identical;
11. seeded candidate additions/removals cause the drift test to fail;
12. no bank or runtime behavior changes.

## Verification

Because this pass adds report tooling and tests but changes no bank or runtime contract, run at least:

* the new survey command;
* the new manifest-drift regression;
* relevant structured-measurement tests;
* relevant visual tests, including `lab_trend`;
* `npm run validate-bank -- banks/*.json`;
* `npm run audit`;
* `npx tsc -b --pretty false`;
* `npm run census:check`;
* `npm run build`;
* `git diff --check`.

Do not run a write-producing census regeneration unless a substantive bank change unexpectedly occurs; none is authorized.

## Stop and exit conditions

Stop for architecture adjudication after the evidence packet is complete.

The exit state must contain:

* a deterministic inventory of both surfaces;
* separate mechanical and semantic claims;
* exact hypothetical impact for L1–L3 and S1–S4;
* no inferred two-row floor;
* no bank changes;
* no schema, renderer, reference-band, or runtime change;
* a clear recommendation packet presenting the viable surface-specific alternatives to Luke.

P4 must remain separate from P3 clinical sourcing, P5 CI policy, and parallel content generation.
