# PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16

Author: Claude (architect seat). Status: **ARCHITECTURE RATIFIED — READY FOR CODEX, SURVEY-FIRST**. Implements P2 of `NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md`. Closes on merge: the `DECISIONS.md` §7 REVISIT thread *"Visual parity coverage is 3 of ~196 promoted items."*

Luke rulings, 2026-07-16:

1. `io_trend` is a load-bearing arithmetic / trend hybrid and receives numeric-preservation coverage.
2. Exact-arithmetic records without keyed assertions fail and require content backfill; pattern-only `io_trend` records may instead be protected by a checked trend or crossover assertion.
3. Calibrated-tracing visual smoke may be certified by any independent gate seat; Luke-only certification is not required.
4. The survey and baseline implementation use one draft PR with an explicit survey-adjudication stop before hashes are authorized.

## 0. Two live defects this PR must fix

Found while reading `scripts/tests/visual-parity.ts` at `d80105d`; both are load-bearing for any expansion:

1. `if (!result.ok) continue;` — a bank that fails validation is **silently skipped**, and parity passes with its records absent. Must throw.
2. `byId.set(parityId(ref), ref.visual)` — a duplicate identity **silently overwrites**. Cross-bank ID collisions are caught by `audit:ids`/census, not by `validateBankObject`, so parity currently has no collision null. Must throw on repeat insert.

## 1. Population

**Parity population = all six `VisualLocation` values from `collectVisualRefs` over `banks/*.json`.** Currently 199 (`question` 195, `caseExhibit` 1, `caseStageExhibit` 1, `caseQuestion` 2, both rationale locations 0).

- **= schema-floor population.** Deliberate: parity protects the *renderer*, and a rationale figure renders through the same registry module. Any location the floor sees, parity sees.
- **≠ census artifact population (199 today, coincidentally equal).** The census excludes rationale figures by PR #52 ratification and equals parity only because both rationale locations are empty. **They will diverge the moment a rationale figure is authored, and that divergence is correct.** Do not reconcile the two totals; do not import `collectVisualArtifacts` here.
- **Bank selection:** `banks/*.json`, matching the existing parity loop — not `*-canonical.json`. Rationale: parity asks "what renders in the shipped bundle," and `src/banks.ts` bundles top-level `banks/*.json`.
- **Raw / promoted-staging: never in the committed baseline.** A pre-merge check may render `banks/banks-raw/` and `banks/_promoted/` for determinism + `selfCheck` only, emitting no committed hashes. Baselining unreviewed content would let raw drafts mint production identities.

## 2. Stable identity

Keep `parityId` **exactly as written** — it already reproduces the U0 scheme and is byte-compatible with the three pinned ids (all `question` location → bare `parentQuestionId`).

| Location | Identity |
|---|---|
| `question` | `parentQuestionId` |
| `questionRationale` | `${parentQuestionId}#rat${locationIndex}` |
| `caseExhibit` | `${parentQuestionId}#ex${locationIndex}` |
| `caseStageExhibit` | `${parentQuestionId}#st${stageIndex}ex${locationIndex}` |
| `caseQuestion` | `ownerId` |
| `caseQuestionRationale` | `${ownerId}#rat${locationIndex}` |

Covers: multiple rationale visuals (`#rat` index), multiple exhibits (`#ex` index), staged exhibits (`#st..ex`), embedded question ids (`ownerId`), duplicate/regenerated ids (collision throw, §0.2).

For `caseQuestion`, `ownerId` is the embedded leaf's own question id and is therefore a complete identity for its single direct visual slot. It is not the parent case/container id. Parent/container ownership alone is insufficient for locations that may carry multiple visuals, which is why rationale, exhibit, and staged-exhibit identities retain explicit indexes. Every computed `parityId`, including a bare embedded-leaf `ownerId`, must still pass the repeat-insert collision null.

`scripts/census.ts` builds `idsByKind` as `[...new Set(ownerIds)]`; that census field is an owner inventory, not the parity identity contract. `opus26_case_refeeding_syndrome_01` carries two `caseQuestion` strips on distinct embedded leaves, and their distinct leaf ids separate them.

**Ordering:** snapshot records sorted by `parityId` lexicographic, ascending. Traversal order is not stable under unrelated bank additions; `parityId` sort is.

## 3. Assertion strategy by kind

**Decision: exact serialized SVG sha256 for all 12 kinds. The differentiation is in the review tier on change, not in the hash algorithm.**

Justification, since an undifferentiated hash wall needs one: a byte difference *is* meaningful here because every renderer is pure, XML-escaped, and formats numbers through the single `fmt`/`fmtNum`/`roundTo` definition in `primitives/graphPaper.ts` (principle 11). There is no incidental byte churn to normalize away. A normalizer would be new untested code whose whole purpose is hiding formatting drift — exactly the drift a `fmt` change produces. Rejected. Semantic summaries are likewise rejected as the *primary* assertion: they would need authoring per kind and would silently permit geometry changes that preserve the summary.

What differs is what a changed hash **obligates**. Tiers may overlap; counts are not additive.

| Tier | Kinds | Count | On hash change |
|---|---|---|---|
| **Calibrated tracing** | `rhythm_strip`, `capnography`, `fetal_monitoring` | 81 | Hash + **human visual smoke** (§5). Geometry is calibrated to grid units (`pxPerSec`, `pxPerMmHg`, `CTG_PX_PER_SEC`); a byte change is a geometry change and cannot be reviewed by reading a diff. |
| **Load-bearing arithmetic** | `io_record`, `medication_label`, `device_screen`, `burn_map`, `io_trend` | 50 | Hash + **arithmetic / semantic proof** (§6). `io_trend` is an arithmetic / trend hybrid. |
| **Chart / trend** | `vitals_trend`, `lab_trend`, `io_trend` | 53 | Hash; `io_trend` additionally inherits the arithmetic / semantic proof tier. |
| **Spatial / anatomical** | `injection_site`, `burn_map` | 18 | Hash only (`burn_map` inherits arithmetic tier). `injection_site` carries vessel-intersection `selfCheck`; assert empty. |

Update the `AGENTS.md` renderer verification row so its explicit load-bearing-arithmetic list includes `io_trend`. Principle 11 already states the governing functional rule; this is an operational-list correction, not a new principle.

**All 12 registered kinds define `selfCheck`.** So: **assert `selfCheck(spec, carrierQuestion) === []` for every promoted record, every kind.** This is new coverage — `visuals-conformance.ts` calls `selfCheck` on *fixtures* and discards the result. Cheap, universal, and it is the tripwire that makes §6 work.

**Nondeterminism:** none proven. `capnography` accumulates floats across ~3,750 sample steps and `rhythm_strip`/`fetal_monitoring` use seeded RNG — all IEEE-754 deterministic. The §8 survey must prove it per record rather than assume it (double-render equality), and report any record that fails as a blocker.

## 4. Intentional rebaseline

One command: `npm run parity:rebaseline -- --reason "<text>" --scope <kind>[,<kind>...]`.

It writes snapshots **and** a receipt at `audit/visual-parity-rebaseline-<ISO-date>/receipt.json`, committed with the PR:

```
{ reason, scope: [kinds], generatedAt, inputGitSha,
  changed: [{ parityId, kind, location, before: sha, after: sha }],
  added: [...], removed: [...],
  totals: { changed, added, removed, unchangedTotal } }
```

**The rule that makes "regenerate and accept everything" insufficient:** the PR declares `--scope` up front, and rebaseline **fails** if any `changed` record's kind is outside the declared scope. Unrelated hash churn is therefore detected mechanically, not by a reviewer noticing 199 lines moved. A bulk rebaseline is acceptable only when (a) every changed record's kind is in scope, (b) the receipt's `changed` count is consistent with the renderer diff's blast radius, (c) tracing changes carry §5 artifacts, (d) arithmetic changes carry §6 proof. Reviewer: the gate seat, not the renderer's author.

## 5. Human visual review (tracing kinds)

Minimum artifact: rendered SVG + PNG **before/after pairs** for every changed tracing record, plus a stacked contact sheet, under the rebaseline receipt directory — the established pattern (`audit/rhythm-strip-pacemaker-backfill-2026-07-01/rendered/contact-sheet.png`). Bounded: if changed tracing records exceed 12, render the first 12 by `parityId` sort plus every colocated fixture, and record the sampling in the receipt.

**Certifier:** any independent gate seat that did not produce the renderer diff. With Codex implementing, the gate seat may certify; Luke may review additionally and retains merge authority, but Luke-only visual certification is not required.

## 6. Arithmetic preservation

**No new module API is required.** `meta.derived_values_keyed` is *content*, owned by the bank and not by the renderer; `selfCheck` asserts declared == computed. Therefore:

> (declared keyed map byte-unchanged) ∧ (`selfCheck` returns `[]` after) ⇒ computed values unchanged.

Snapshot each arithmetic record's `declaredKeyed` alongside its hash when keyed values are present; §3's universal `selfCheck`-empty assertion supplies the other half. Output format, per changed arithmetic record, in the receipt:

```
{ parityId, kind, declaredKeyed: {before, after}, selfCheckErrors: {before: [], after: []} }
```

The proof requirement is kind-sensitive:

- `io_record`, `medication_label`, `device_screen`, and `burn_map` must declare at least one recognized keyed arithmetic value. A promoted record with no such value is a survey blocker and requires content backfill before baseline authorization.
- `io_trend` is an arithmetic / trend hybrid. It must expose at least one checked proof surface: a recognized `derived_values_keyed` array/scalar, a non-empty supported `expected_trend`, or a supported `crossover`. A pattern-only record may therefore omit exact keyed totals when its load-bearing trend/crossover assertion is present and passes `selfCheck`. An `io_trend` record with none of those proof surfaces is a survey blocker.
- When an `io_trend` record does carry keyed arithmetic, the same before/after keyed-map equality rule applies.

`selfCheckIoRecord` does not literally return early merely because `question.meta` is absent; it computes totals but has no keyed declaration to compare and can therefore return no error. When metadata exists with no recognized keyed values it already emits `self_check_no_keyed_values`. The promoted-parity survey must detect both forms of missing protection rather than relying only on returned errors.

**Failure behavior:** any non-empty `selfCheckErrors.after`, any prohibited missing proof surface, or any `declaredKeyed` delta **fails the run** — not a warning. Overridable only when the PR's stated subject *is* the numeric behavior, which requires the corresponding bank edit to appear in the same diff under content review.

## 7. Baseline architecture

- **Location:** `scripts/tests/__snapshots__/visual-parity-promoted/<kind>.json`, one file per kind. Split, not monolithic: diffs localize, and receipts name kinds.
- **`scripts/tests/__snapshots__/visual-parity.json` is untouched.** It is the U0 pre-refactor baseline plus 11 validation-reason cases; it stays byte-frozen and `visual-parity.ts` keeps consuming it. Zero compatibility risk.
- **Generator:** `scripts/visual-parity-baseline.ts`, `npm run parity:rebaseline`. Test: `scripts/tests/visual-parity-promoted.ts`, `npm run test:visual-parity-promoted`, appended to `test-visuals`.
- **Record:** `{ parityId, kind, location, bank, parentQuestionId, ownerId, svgHash, declaredKeyed? }`. Hash covers `renderSvg` output only — which already embeds viewBox, dimensions, captions, and the EN `aria-label`. No separate metadata hashing.
- **Stale/missing both fail:** snapshot record with no live visual → FAIL (removed/renamed); live visual with no snapshot record → FAIL naming the new `parityId` and the regen command. Newly promoted visuals are thus surfaced by the gate, not discovered later.
- **Cost:** 199 records × ~140 B ≈ 28 KB across 12 files; runtime is 199 `renderSvg` calls + 199 `selfCheck` calls, well under a second — the whole corpus already renders inside `census`/`validate-bank`.

## 8. Impact survey — Codex-run, architect-adjudicated, **precedes baseline authorization**

Precedent: the P0 manifest's own `authoredBy` is *"Claude (architect seat); deterministic generator implemented by Codex."* Same shape here.

`npm run survey:promoted-visual-parity` → `audit/promoted-visual-parity-survey-2026-07-16/survey-manifest.json`, per record: `parityId`, kind, location, bank, renderer module, proposed tier, `renderDeterministic` (double-render equality), `selfCheckErrors`, `declaredKeyedPresent`, and the recognized proof surface for arithmetic / trend kinds. Plus rollups: counts by kind × location; **identity collisions**; **`selfCheck` failures**; **non-deterministic renders**; **exact-arithmetic records with no keyed values**; and **`io_trend` records with no keyed, trend, or crossover assertion**.

**This is evidence, not permission.** The work uses one draft PR in two phases:

1. **Survey phase:** fix the two existing parity defects, add the deterministic survey generator and its regressions, commit the generated manifest, and stop. Do not commit the promoted baseline hashes yet.
2. **Architect adjudication stop:** Claude reviews the manifest against this spec. Any collision, `selfCheck` failure, non-deterministic render, or prohibited missing proof surface blocks baseline authorization and routes to a narrow repair/content-backfill decision.
3. **Baseline phase after PASS:** continue in the same draft PR with the baseline generator, snapshots, rebaseline receipt machinery, focused regressions, and CI hook. If the survey exposes a repair with materially different ownership or reversal cost, split that repair into its own PR and keep the baseline PR blocked.

Baselining a broken record pins the breakage; a generated manifest is never self-authorizing.

## 9. Regression floor

Focused cases: (1) each of the six locations yields a snapshot record — synthetic fixture, since four locations have ≤2 corpus records and two have zero; (2) identity stability across a synthetic unrelated bank addition; (3) missing record fails; (4) extra record fails; (5) mutated hash fails; (6) duplicate `parityId` throws (§0.2); (7) invalid bank throws (§0.1); (8) regeneration is idempotent — run twice, byte-identical; (9) out-of-scope change fails rebaseline; (10) `declaredKeyed` delta fails; (11) missing required arithmetic/trend proof surfaces fail; (12) `census.json` `visualArtifacts.total` **unchanged** by this PR — the separate-denominator tripwire.

Full path (`AGENTS.md` *Renderers* row): `npm run test-visuals`; `npm run test:visual-parity-promoted`; `selfCheck` regressions; visual smoke; `npm run validate-bank -- banks/*.json`; `npm run build`. Plus `npx tsc -b --pretty false`; `npm run census && npm run census:check`; `git diff --check`. Confirm `git diff` shows **no change** to `banks/**`, `census.json`, or `visual-parity.json`, except that a separately adjudicated content-backfill repair must be isolated and reviewed under the bank-content path rather than hidden inside baseline generation.

## 10. Scope and seats

Out: P3 vitals bounds, P4 single-row labs, P5 CI redesign.

**Minimal CI hook:** `promotion-gate.yml` runs neither `test-visuals` nor `test:rationale-visual-floor` today — P2 lands unenforced without it. Add **one step**, `npm run test-visuals`, which picks up both the new suite and P0's orphaned regression. That is the whole CI ask; the broader matrix stays P5.

Seats: **producer** Claude (this spec + §8 survey design and adjudication) → **implementation** Codex → **automated check** `test-visuals` in CI → **visual review** an independent gate seat → **merge** Luke. Claude cannot be the sole implementation certifier; architect spec-conformance verification remains a separate check from the gate seat's independent content/visual review.

---

## P2 READY FOR CODEX — SURVEY-FIRST

Architecture is settled. Codex is authorized to implement the survey phase in one draft PR, including the two existing parity-defect fixes and the focused survey regressions. The promoted hash baseline is **not** authorized until Claude records a survey-adjudication PASS in that PR.

Ratified implementation rules:

1. `io_trend` is an arithmetic / trend hybrid and is added to the operational numeric-preservation list in `AGENTS.md`.
2. Exact-arithmetic records without recognized keyed assertions fail; pattern-only `io_trend` may satisfy the gate through a checked trend or crossover assertion.
3. Any independent non-producer gate seat may certify calibrated-tracing visual smoke.
4. Survey and baseline remain in one draft PR with a mandatory adjudication stop between phases.