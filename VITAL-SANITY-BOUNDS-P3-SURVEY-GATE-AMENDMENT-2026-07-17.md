# Vital-Sign Sanity Bounds P3 Survey — Gate Amendment

Date: 2026-07-17
Amends: `VITAL-SANITY-BOUNDS-P3-SURVEY-ARCHITECT-SPEC-2026-07-17.md` §§4 and 18
Trigger: independent checker-seat review of PR #57, checker item 3
Status: **RATIFIED REPAIR DIRECTION — implementation remains with Terra; independent recheck remains with the checker seat.**

This amendment is controlling where it conflicts with the original architect spec. It authorizes only the provenance/reconciliation repair below. It does not authorize any vital-sign bound, bank, renderer, measurement-unit-policy, GATE 4 policy, or population-contract change.

## 1. Accepted gate finding

Checker item 3 fails. The committed manifest currently states that the 2026-07-11 artifact was located and attributes all of the following to its cited record:

- a `30–43 °C` renderer probe;
- an exploratory `10–50 °C` probe;
- a promoted temperature span of `36.7–40.111... °C`;
- a refreshed extraction span of `35.8–40.111... °C`.

Those claims do not survive source verification:

- `DECISIONS.md` §7 supports only the narrow historical summary that the 2026-07-11 survey and pre-move sweep found zero flips in the promoted corpus under “either tested probe.” It does not name the probes or state a temperature span.
- `Archive/DECISIONS-ARCHIVE-2026-07-14.md` contains no temperature record supporting the claimed probes or spans.
- `r9-temperature-sanity-decoupling-codex-spec.md` §6.1 is a separate, dated 2026-07-15 re-derivation. It supports 104 temperature values, a canonical-Celsius span of `35.8–40.111111111111114`, and zero flips at the ratified `T = 46.5 °C`; it does not establish the missing 2026-07-11 probe labels or the `36.7` minimum.
- The `36.7` figure is not verified by a repository source and conflicts with treating the current P3 corpus range as historical evidence.

The original spec already required an explicit “not located” finding when the underlying artifact could not be found. The implementation instead reconstructed a more specific history than the sources permit. The checker’s hold is correct.

## 2. Required Terra repair

Unless Terra locates an actual 2026-07-11 artifact or Git-history record that contains the exact probe labels and historical figures, `priorFindings.sweep20260711` must be regenerated from the following contract:

```ts
sweep20260711: {
  located: false,
  sources: [
    "DECISIONS.md §7 (2026-07-11 constitutional summary; underlying artifact, exact probes, and contemporaneous span not located)",
    "r9-temperature-sanity-decoupling-codex-spec.md §6.1 (separate 2026-07-15 independent re-derivation)",
  ],
  priorResult:
    "DECISIONS.md §7 records that a 2026-07-11 survey and pre-move sweep found zero flips in the promoted corpus under two tested probes. The underlying artifact, exact probe intervals, and contemporaneous temperature span were not located on disk or in Git history. Separately, the 2026-07-15 r9 §6.1 survey found 104 temperature values spanning 35.8-40.111111111111114 C and zero flips at the ratified T = 46.5 C.",
  reconciliation: "EXTENDS",
  adds: [
    // retain the existing truthful P3 additions
  ],
}
```

`EXTENDS` remains the required reconciliation because P3 adds seven-vital coverage, both machine-readable surfaces, all six visual locations, population reporting, unit/conversion evidence, side authorship, mechanism cost, boundary-neighbor records, and reusable candidate-interval accounting beyond the limited zero-flip summary preserved in `DECISIONS.md` §7. It must not be presented as proof that the missing July 11 artifact or its exact probes were located.

If Terra does locate the actual artifact before applying this repair, `located: true` is permissible only when the manifest cites the exact repository path and commit and every retained probe/range statement is directly present in that artifact. Secondary summaries and later re-derivations are not substitutes.

## 3. Files that must move together

Terra must update all of the following in one repair commit:

1. `scripts/vital-sanity-bounds-survey.ts`
   - remove the unsupported archive citation;
   - remove `36.7`, `30-43 C`, and `10-50 C` as asserted July 11 evidence;
   - emit the corrected `located`, `sources`, and `priorResult` fields above.
2. `audit/vital-sanity-bounds-survey-2026-07-17/survey-manifest.json`
   - regenerate from the corrected generator; do not hand-edit the byte-locked artifact.
3. `PROJECT-HISTORY.md`
   - replace the claim that the prior sweep “was located in the archived decisions record.”
   - required substance: the limited 2026-07-11 zero-flip summary is carried from `DECISIONS.md` §7 and reconciled as extended; its underlying artifact, exact probe intervals, and contemporaneous span were not located; the 2026-07-15 re-derivation remains separately identified.
4. `scripts/tests/vital-sanity-bounds.ts`
   - retain the `EXTENDS` assertion;
   - add a regression that `sweep20260711.located === false` unless an exact artifact is introduced and cited;
   - add negative assertions preventing `36.7`, `10-50`, and the archived-decisions temperature attribution from re-entering the generated manifest without an exact source-backed spec amendment.

Do not modify `DECISIONS.md` merely to manufacture support for the rejected manifest wording. The historical summary there is deliberately narrower than the unsupported generated claim.

## 4. Verification and seat routing

After the repair, Terra must run:

- `npm run survey:vital-sanity-bounds`
- `npm run test:vital-sanity-bounds`
- the complete PR #57 validation list
- `git diff --check`

The same independent checker seat should perform a narrow recheck of checker item 3 against the corrected generator, manifest, history entry, regression, and cited sources. The other five checker items remain accepted unless Terra’s repair touches their semantics.

No merge is authorized by this amendment. PR #57 remains on hold until the checker clears the repaired item 3.