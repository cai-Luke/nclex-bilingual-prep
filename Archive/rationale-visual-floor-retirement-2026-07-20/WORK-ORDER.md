# RATIONALE-VISUAL-FLOOR SURVEY RETIREMENT — WORK ORDER 2026-07-20

**Owner direction:** Luke, 2026-07-20 — retire the dated snapshot, preserve the live
synthetic invariant.
**Work-order status:** Implemented and verified 2026-07-20.
**Preconditions pre-checked:** P1→Path A and P2 (sole importer is the test) independently
confirmed by GPT and by architect grep; implementer still re-runs the P2 gate below.

## 1. Background (closed-world — do not rely on chat history)

`rationale-visual-floor` is a dated at-migration survey from the 2026-07-16
rationale-embedded-visual migration. Its generator hard-codes
`SURVEY_DATE = "2026-07-16"` and writes a frozen census manifest at
`audit/rationale-visual-floor-survey-2026-07-16/survey-manifest.json`.

`scripts/tests/rationale-visual-floor.ts` currently runs as the LAST step of the
`test-visuals` chain and is RED: it regenerates the survey from live content and
asserts byte-equality against that frozen manifest. The corpus has since grown
(≈1940 → 1942 top-level records — legitimate content growth, not a defect), so
the byte-compare fails. There is no reason to hold live content to a pre-migration
census; that assertion is being retired, not re-baselined.

The test file bolts together two independent things:

- **KEEP (live, corpus-independent invariant).** Proof that a pacer `rhythm_strip`
  visual forces `meta.schemaVersion 1.7` across all six visual locations, and that
  `collectVisualRefs` traverses all six locations in order. This specifically
  exercises the two rationale slots (`questionRationale`, `caseQuestionRationale`)
  the migration added; it stays true regardless of corpus size. Imports only from
  `src/` (`bankImport`, `schema`, `types`) — NOT from the generator module.
- **ARCHIVE (the dated snapshot + its helper tests).** Everything importing from
  `../rationale-visual-floor-survey`: the `buildRationaleVisualFloorSurvey()`
  byte-equality, the fixed-count corpus assertions
  (`pacerBearingRecords.length === 3`, `locationCounts.*Rationale === 0`,
  `population.*`), the `listRawStagingJsonFiles` lane-fixture block, and the
  `surveyHasZeroImpact` unit block. These test generator-internal helpers and
  retire with it.

## 2. Preconditions — run BOTH before editing; if either trips, STOP and report

- **P1 Redundancy check.** Grep/read `scripts/tests/rhythm-strip.ts`,
  `scripts/tests/visuals-conformance.ts`, `scripts/tests/registry-mechanics.ts`.
  Determine whether the KEEP invariants — pacer→schema-1.7 gating AND
  `collectVisualRefs` traversal, *specifically for the `questionRationale` and
  `caseQuestionRationale` locations* — are already fully covered there.
  - Expected result: NOT fully covered (this test was added to cover exactly those
    two new locations) → take **Path A**.
  - If fully covered → take **Path B**.
- **P2 Importer check.** `grep -rn "rationale-visual-floor-survey" --include=*.ts .`
  Confirm the only importer of the generator module is the test being split. If any
  other source file imports it, STOP and report — do not archive the module.

State in your report which path P1 selected and the P2 result.

## 3A. Path A — keep the invariant, rename off "survey" (expected path)

1. `git mv scripts/tests/rationale-visual-floor.ts scripts/tests/rationale-visual-schema-floor.ts`
2. In the renamed file, delete the ARCHIVE half:
   - Prepend this survivor header to the renamed file:
     ```ts
     // Durable synthetic regression from the completed P0 rationale-visual schema-floor retrofit.
     // Proves six-location collectVisualRefs traversal and pacer schema-1.7 floor behavior.
     // NOT a live-corpus survey or census baseline — do not reintroduce a manifest byte-compare here.
     ```
   - Remove the entire import block from `../rationale-visual-floor-survey`.
   - Remove everything from the comment
     `// Corpus proof: the generated dated assertion must match the committed artifact.`
     through end of file — this deletes the byte-equality + corpus-count assertions,
     the `laneFixtureRoot` block, and the `surveyHasZeroImpact` block.
   - Remove now-unused imports (`mkdir, mkdtemp, readFile, rm, writeFile` from
     `node:fs/promises`; `tmpdir` from `node:os`; `join` from `node:path`). Keep
     `assert`.
   - Replace the final `console.log(...)` with a synthetic-only message, e.g.
     `console.log("rationale-visual-schema-floor tests passed (synthetic traversal + schema floor)");`
   The KEEP half (fixtures `pacerVisual`/`nonPacerVisual`/`baseQuestion`, the
   top-level/embedded/non-pacer schema-floor assertions, the `everyLocationRefs`
   traversal assertions, and the `floorCandidateFor` six-location loop) stays intact.
3. Archive the generator + manifest, preserving history:
   - `git mv scripts/rationale-visual-floor-survey.ts <ARCHIVE_DIR>/`
   - `git mv audit/rationale-visual-floor-survey-2026-07-16 <ARCHIVE_DIR>/rationale-visual-floor-survey-2026-07-16`
   where `<ARCHIVE_DIR>` matches the repo's existing dated archive convention
   (e.g. `Archive/rationale-visual-floor-retirement-2026-07-20`).
4. `package.json`:
   - DELETE line: `"survey:rationale-visual-floor": "tsx scripts/rationale-visual-floor-survey.ts",`
   - RENAME line
     `"test:rationale-visual-floor": "tsx scripts/tests/rationale-visual-floor.ts",`
     → `"test:rationale-visual-schema-floor": "tsx scripts/tests/rationale-visual-schema-floor.ts",`
   - In `"test-visuals"`, change the trailing
     `&& tsx scripts/tests/rationale-visual-floor.ts`
     → `&& tsx scripts/tests/rationale-visual-schema-floor.ts`

## 3B. Path B — only if P1 shows full redundancy

1. `git rm scripts/tests/rationale-visual-floor.ts`
2. Archive generator + manifest as in 3A.3.
3. `package.json`: DELETE the `survey:rationale-visual-floor` and
   `test:rationale-visual-floor` lines; in `"test-visuals"` remove the trailing
   `&& tsx scripts/tests/rationale-visual-floor.ts` segment entirely.

## 3.5. Inbound-reference repairs (same commit)

Repair ONLY these live pointers; classification is disk-verified, do not broaden it.

1. NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md (~line 49): update the survey-manifest
   path to the new archive location. Do not archive this doc — P3 stage 3 is still open in it.
2. VITAL-SANITY-BOUNDS-P3-SURVEY-ARCHITECT-SPEC-2026-07-17.md: at the citation referencing
   `audit/rationale-visual-floor-survey-2026-07-16/` (~line 197), repoint the path to the new
   archive location and append verbatim:
   "[Retired 2026-07-20: the P0 rationale-visual-floor survey was a completed at-migration
   snapshot, not a standing gate. The manifest-drift-gate PATTERN this spec adopts remains
   valid and live in `survey:promoted-visual-parity` + `test:promoted-visual-parity-survey`.]"
   Do NOT alter the script-pair reference (~341) or the "Verified against package.json …
   Accepted — §13.1" row (~454): those are authoring-time receipts.

Leave unchanged (historical receipts): BANK-REVIEW-LEDGER.md, DECISIONS.md §30 line, both
archived specs, and all PROJECT-HISTORY.md narrative entries. Touch a PROJECT-HISTORY line only
if it is an unambiguous standing present-tense claim about current test-visuals composition.

## 4. Recording

- `PROJECT-HISTORY.md`: one entry — the 2026-07-16 rationale-visual-floor survey
  is retired as a completed at-migration snapshot; live pacer-schema-floor /
  six-location traversal invariant preserved as
  `rationale-visual-schema-floor` (Path A) or subsumed by existing conformance
  tests (Path B); `test-visuals` no longer byte-compares live content to a frozen
  census.
- A short `NOTE.md` (or header note) at `<ARCHIVE_DIR>` stating the same, so a
  future reader isn't puzzled by an archived generator with no live test.
- NO `DECISIONS.md` principle — this is a closeout, not a new invariant.

## 5. Verification receipt (all must pass; paste results)

```
grep -rn "rationale-visual-floor-survey" --include=*.ts .   # only archived paths; survivor references none
git grep "survey:rationale-visual-floor" package.json       # absent (expect no output)
git grep "test:rationale-visual-schema-floor" package.json  # present
npx tsc -b --pretty false                                   # clean (catches broken/unused imports)
npm run test:rationale-visual-schema-floor                  # passes (Path A only)
npm run test-visuals                                        # GREEN end-to-end — the objective
npm run build                                               # clean
npm run census:check                                        # still clean (no content touched)
git diff --check                                            # expect no output
git diff --name-only -- banks src                           # expect no output
```

## 6. Constraints / out of scope

- Test/tooling retirement ONLY. Do NOT modify any `banks/**`, `src/**` runtime,
  clinical values, reference bands, or schema.
- Do NOT regenerate the manifest — retirement, not re-baseline.
- Preserve git history via `git mv` (Path A).
- Out of scope: the lab reference-range lane and WBC/platelet normalization
  (both already committed in `018f7b0`); everything else.
