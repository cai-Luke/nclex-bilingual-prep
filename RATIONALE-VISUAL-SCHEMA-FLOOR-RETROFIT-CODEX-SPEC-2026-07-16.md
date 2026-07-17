# Codex Spec — `rationale.visuals` Schema-Floor Traversal Retrofit

Date: 2026-07-16
Author: Claude (architect seat)
Status: **IMPLEMENTED**
Implements: P0 of [`NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md`](NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md)
Closes on merge: the DECISIONS.md REVISIT thread *"Schema-floor traversal omits `rationale.visuals` in two independent copies."*

> **Implementation note:** descriptions of the walkers below preserve the pre-implementation
> baseline. The retrofit is complete on this branch; `PROJECT-HISTORY.md` and `DECISIONS.md`
> record the resulting durable architecture.

## What this spec supersedes

This spec supersedes two points in the handoff's P0 section:

1. The handoff frames the bank-impact survey as **pending**. It is **complete**. See
   [`audit/rationale-visual-floor-survey-2026-07-16/survey-manifest.json`](audit/rationale-visual-floor-survey-2026-07-16/survey-manifest.json).
   Do not re-run it as a gating step; regenerate it only as described under *Corpus invariant* below.
2. The handoff says to *"decide whether"* `scripts/tests/visual-parity.ts` should consume the shared
   projection. That is now decided: **it must.** Rationale under *Why all three must converge*.

The work is therefore no longer "survey and retrofit." It is a **zero-impact retrofit**.

## Survey result (do not re-derive)

| Fact | Value |
|---|---|
| Banks surveyed | 13 (`banks/*-canonical.json`) |
| Raw draft / promoted staging lanes | **empty** — both `banks/banks-raw/` and `banks/_promoted/` were enumerated |
| Top-level records | 1,869 after the Batch 7 promotion refresh |
| Total visual artifacts | **199** — exact match to the PR #52 recursive census |
| Pacer-bearing `rhythm_strip` | **3**, all at `question.visual`, all in `visual-canonical.json`, bank declares `2.0` (floor is `1.7`) |
| Visuals in **any** `rationale.visuals` slot | **0** |
| Bundled validation flips | **0** |
| Raw/staging flips | **0** (no lane) |
| Export-envelope version changes | **0** |

The zero was confirmed three independent ways: structural traversal; a parser-independent raw grep
showing the literal string `"visuals"` occurs in no canonical bank; and agreement of the 199 total
with the separately-generated census.

**Consequence.** The defect is real in code but **unreachable from any current content**. No record
under-declares its floor today. This is why the retrofit is authorized as zero-impact — and why it
should land now rather than later. The handoff's stated hazard ("do not silently bump canonical
metadata to make the test pass") is presently *unreachable*, because there is no canonical metadata
that would need bumping. That stops being true the moment content authors its first explanation
figure.

**No canonical metadata migration is authorized or expected by this spec.** If the implementation
appears to require one, stop and escalate — that means the survey is wrong, not that a bump is due.

## The defect

Four visual walkers exist. **Three are in scope and omit `rationale.visuals`. The fourth is correct
as-is and must not be touched** — see *The fourth walker* below before writing any code.

| File | Symbol | Omits | Consumed by |
|---|---|---|---|
| `src/schema.ts` | `hasPacerRhythmStrip` | top-level + embedded `rationale.visuals` | the 1.7 validation floor |
| `src/bankImport.ts` | `hasPacerRhythmStrip` | top-level + embedded `rationale.visuals` | `toExportEnvelope` version inference |
| `scripts/tests/visual-parity.ts` | `collectVisuals` | top-level + embedded `rationale.visuals` | SVG-hash parity snapshot |

`src/schema.ts` already exports `collectAllVisuals(question)`, which correctly traverses all six
locations. Both `src/schema.ts` and `src/bankImport.ts` **already import and use it** for the
`io_trend` floor — and then hand-roll the pacer walk directly beside it. The enabling architecture is
present and proven; the pacer floor was never moved onto it.

## Why all three must converge

All three walkers are currently wrong *in the same way*, which is why nothing is broken. Consolidate
two and leave the third and the repo trades three consistent-but-incomplete walkers for **two sources
of truth that disagree silently and asymmetrically** — a strictly worse drift posture, and in direct
tension with the handoff's own exit condition ("no new traversal is added").

Convergence is therefore required, not optional. Broader parity *coverage* expansion (the 199-item
snapshot denominator question) stays out of scope — that is P2 and has its own review policy. This
spec closes traversal **completeness** only.

## Required implementation

### 1. One traversal owner

`src/schema.ts` owns the single traversal. Promote it to a location-aware projection richer than a
flat `QuestionVisual[]`, because the parity consumer needs stable identities, not just visuals:

```ts
export type VisualLocation =
  | "question"
  | "questionRationale"
  | "caseExhibit"
  | "caseStageExhibit"
  | "caseQuestion"
  | "caseQuestionRationale";

export type VisualRef = {
  visual: NonNullable<Question["visual"]>;
  location: VisualLocation;
  parentQuestionId: string;  // the top-level record
  ownerId: string;           // the carrier: top-level id, or embedded leaf id
  locationIndex?: number;    // index within its slot
  stageIndex?: number;       // caseStageExhibit only
};

export const collectVisualRefs = (question: Question): VisualRef[] => { /* the one walk */ };
```

The exact shape is Codex's implementation choice; the constraint is that **there is exactly one
walk**, and every consumer derives from it.

Keep `collectAllVisuals` as a thin derived helper (`collectVisualRefs(q).map(r => r.visual)`) so the
existing `io_trend` call sites do not churn. Retaining it is not "a new traversal" — it must not
contain a second walk.

### 2. Replace both pacer walkers

Delete `hasPacerRhythmStrip` in `src/schema.ts` and `src/bankImport.ts`; express each as a predicate
over the shared projection.

**Keep feature detection explicit at the call site.** Do not make schema-floor rules implicit or
data-driven as a ride-along. The 1.7 floor stays a named, readable check.

### 3. Converge `scripts/tests/visual-parity.ts`

Map `VisualRef` to the parity snapshot identity. **Hard invariant: existing snapshot identities must
be byte-stable.** The current scheme is `q.id` / `${q.id}#ex${i}` / `${q.id}#st${si}ex${ei}` /
`cq.id`; the mapping must reproduce those exactly.

**`scripts/tests/__snapshots__/visual-parity.json` MUST NOT change in this PR.** If it does, the
identity mapping is wrong. Since the corpus has zero rationale visuals, no new identity can appear —
an unchanged snapshot is the correct and expected outcome, and is itself a check on the retrofit.

### 4. The fourth walker — `lib/question-population.ts` stays separate

`lib/question-population.ts` exports `collectVisualArtifacts`, a fourth traversal with exactly four
sources (`question`, `case_exhibit`, `case_stage_exhibit`, `embedded_leaf`). **It omits rationale
figures deliberately** — that is the PR #52 architect-ratified `visualArtifacts` census basis, not a
bug. It is **out of scope and must not be merged, deleted, or widened.**

This is the main foot-gun in this task. `VisualArtifactRecord` (`{ visual, ownerId,
parentSessionUnitId, source }`) and the proposed `VisualRef` (`{ visual, ownerId, parentQuestionId,
location, ... }`) are near-identical in shape and will look to a future reader like duplication
begging to be consolidated. They are not. They answer different questions:

| | `collectVisualArtifacts` | `collectVisualRefs` |
|---|---|---|
| Question answered | "what is the ratified artifact inventory?" | "what must the schema floor and parity see?" |
| Rationale figures | **excluded, by ratification** | **included, by requirement** |
| Locations | 4 | 6 |

Merging them would silently pull explanation figures into the census denominator — exactly the
ride-along this spec forbids. **Required:** add a short comment at *both* definitions stating that the
other exists, that the divergence is intentional, and pointing here. A future seat must hit that
comment before "helpfully" unifying them.

### 5. Do not touch

- The PR #52 `visualArtifacts` census definition or `collectVisualArtifacts` (above).
- Any canonical bank content or metadata.
- Parity *coverage* (P2), vital bounds (P3), single-row labs (P4).

## Regression cases

Label these two populations distinctly in the test file. They prove different claims.

### Corpus proof — what is true today

- `C1` The shared traversal finds **199** artifacts across the 13 canonical banks.
- `C2` `questionRationale` and `caseQuestionRationale` populations are **0**.
- `C3` The three pacer records resolve at `question.visual` and satisfy their `1.7` floor.

### Synthetic proof — what will be true tomorrow

There is **no corpus record and no committed browser fixture** for any rationale visual. PROJECT-HISTORY's
Visual Focus Dialog entry independently records this same gap. Every case below is therefore a
constructed fixture, and passing proves the **walker**, not corpus coverage. Say so in the test file.

- `S1` top-level `rationale.visuals` pacer strip: schema `1.6` fails, `1.7` passes.
- `S2` embedded-leaf `rationale.visuals` pacer strip: schema `1.6` fails, `1.7` passes.
- `S3` non-pacer rationale rhythm strip does **not** require `1.7`.
- `S4` `toExportEnvelope` selects `1.7` for both top-level and embedded rationale pacer strips.
- `S5` existing question / exhibit / stage / embedded visual floor cases unchanged.
- `S6` IO-trend floor tests remain green.
- `S7` **Location-coverage fixture:** a synthetic question carrying one visual in *each* of the six
  `VisualLocation` values yields six refs, one per location. This fails if any location is ever
  dropped from the shared walk. This is the test that makes the single-owner claim enforceable.

## Corpus invariant — deliberately a dated assertion

Add `npm run survey:rationale-visual-floor` regenerating the committed manifest, and a test asserting
the live corpus against it.

**Do not pin 199 as a permanent constant.** It will legitimately change the moment any visual content
is promoted — `io_trend` generation is queued and will move it. A hard constant would fire on the next
legitimate promotion and train the next seat to rubber-stamp regeneration, which destroys the signal.

So: `C1`'s count is a **dated** assertion carrying an explicit regeneration command. The durable
tripwires that must not drift silently are `C2` and `C3` — if either rationale population becomes
non-zero, the pacer floor has gone live and the evidence must be re-derived before it is trusted.

## Verification floor

Schema and import behavior, so the full path:

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

Add a focused `toExportEnvelope` regression if `test:schema-bank` does not already exercise it
directly. Confirm `git diff` shows **no change** to `banks/**` or to
`scripts/tests/__snapshots__/visual-parity.json`.

## Exit conditions

- [x] Exactly one **full-schema** visual traversal exists, shared by validation, export inference, and
      parity; the three in-scope walkers are deleted. This is *not* a claim that only one traversal
      exists in the codebase: `lib/question-population.ts`'s `collectVisualArtifacts` remains a
      separate, deliberately narrower traversal and must be untouched.
- [x] Both traversal definitions carry the cross-reference comment required by §4.
- [x] Validator and exporter agree on the `1.7` floor for all six locations.
- [x] `visual-parity.ts` consumes the shared projection; its snapshot is unchanged.
- [x] Zero bank flips; `banks/**` untouched.
- [x] Corpus and synthetic proofs are present and labelled distinctly.
- [x] `S7` fails if a location is dropped.
- [x] Survey manifest committed as deterministic evidence, and the generator reproduces it. On
      landing, rename its `plannedRegenerationCommand` field to `regenerationCommand` and delete
      `plannedRegenerationCommandStatus` — the manifest currently and correctly declares that the
      script does not yet exist.

## Seat routing

Claude authored this spec and the survey, so Claude cannot certify the implementation (matching the
spec is not evidence of being correct — DECISIONS.md principle 2). Codex implements; the content/gate
seat reviews the diff against the standing rules; spec-conformance verification returns to the
architect. Luke merges. The DECISIONS.md REVISIT entry closes **only after the implementation lands**,
not on acceptance of this spec.
