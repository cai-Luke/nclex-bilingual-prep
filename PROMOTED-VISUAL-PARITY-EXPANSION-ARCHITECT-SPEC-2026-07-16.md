# PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16

Author: Claude (architect seat). Status: **ARCHITECTURE RATIFIED — READY FOR CODEX, SURVEY-FIRST**. Implements P2 of `NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md`. Closes on merge: the `DECISIONS.md` §7 REVISIT thread *"Visual parity coverage is 3 of ~196 promoted items."*

Luke rulings, 2026-07-16:

1. `io_trend` is a load-bearing arithmetic / trend hybrid and receives numeric-preservation coverage.
2. Exact-arithmetic records without keyed assertions fail and require content backfill; pattern-only `io_trend` records may instead be protected by a checked trend or crossover assertion.
3. Calibrated-tracing visual smoke may be certified by any independent gate seat; Luke-only certification is not required.
4. The survey and baseline implementation use one draft PR with an explicit survey-adjudication stop before hashes are authorized.

Luke rulings, 2026-07-16 (second pass — raised by Codex pre-implementation review, verified by the architect against live disk):

5. `device_screen` is a keyed-settings / arithmetic hybrid proof kind (§6).
6. `--scope` enforcement covers `changed`, `added`, and `removed` (§4).
7. **U0 migration:** the three legacy rhythm-strip SVG hashes migrate into the promoted baseline; `visual-parity.json` retains its 11 `validationReasons` cases only (§7). This reverses the first-pass "byte-frozen" decision — the freeze created a permanent contradiction with any ratified rhythm-strip rebaseline, and two files owning one fact violates single-definition discipline.
8. Rebaseline takes `--before-ref <git-ref>`, defaulting to the PR merge base (§4, §5).
9. Snapshot regeneration — not the receipt — is the byte-idempotent surface (§9).
10. Carrier-question routing is explicit (§3).

Luke rulings, 2026-07-16 (third pass — survey adjudication of PR #55 @ `b09b508`):

11. `mar` is a **structured-document / table** tier: exact SVG hash + universal `selfCheck`-empty, ordinary gate-seat diff review on a hash change; no arithmetic-equality proof and no calibrated-tracing visual smoke (§3). The survey must additionally recognize `mar`'s **semantic** proof surface independently (§6, §8).
12. Added / removed delta evidence is one-sided by construction; added or removed records with no corresponding `banks/**` change are identity drift and **fail** (§4, §5, §6).
13. No `AGENTS.md` governance rule is added for Codex's §4 spec edit. It mechanically applied an explicit ratified ruling and received independent architect verification — that is the existing separation working. Provenance is recorded in §10. Revisit only if implementers repeatedly originate unratified architecture.

Luke ruling, 2026-07-17 (baseline bootstrap clarification):

14. The first creation of the 12 promoted snapshot files is an **initial-baseline bootstrap**, not 199 `added` deltas. Bootstrap is available only with no active promoted baseline, the committed survey-adjudication PASS, exact live/survey reconciliation, all 12 registered kinds, and the lossless U0 readiness null. The initial receipt records `initialBaseline` plus the ordered `u0Migration`; once any active baseline exists, bootstrap is unavailable permanently and ordinary record-local delta mechanics apply. Causes are derived from the Git diff, an added/removed identity requires its own current/prior bank file to have changed, renderer+content ambiguity fails, and temporary before-ref worktrees resolve an exact SHA, use the old source tree without dependency installation, and unregister in `finally` on success or failure.

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
| **Load-bearing arithmetic** | `io_record`, `medication_label`, `device_screen`, `burn_map`, `io_trend` | 50 | Hash + **arithmetic / semantic proof** (§6). `io_trend` is an arithmetic / trend hybrid; `device_screen` is a keyed-settings / arithmetic hybrid. |
| **Chart / trend** | `vitals_trend`, `lab_trend`, `io_trend` | 53 | Hash; `io_trend` additionally inherits the arithmetic / semantic proof tier. |
| **Spatial / anatomical** | `injection_site`, `burn_map` | 18 | Hash only (`burn_map` inherits arithmetic tier). `injection_site` carries vessel-intersection `selfCheck`; assert empty. |
| **Structured document / table** | `mar` | 11 | Hash + universal `selfCheck`-empty; **ordinary gate-seat diff review** on a hash change. No arithmetic proof, no visual smoke. `mar` fails every other tier's defining property: no calibrated unit contract (`renderMarSvg` maps statuses to glyphs through `renderDocTable`, and `fmt` appears only for layout height, so a byte change is a layout change and is diff-reviewable), no renderer arithmetic, no plotted series. |

Update the `AGENTS.md` renderer verification row so its explicit load-bearing-arithmetic list includes `io_trend`. Principle 11 already states the governing functional rule; this is an operational-list correction, not a new principle.

**Carrier routing (ruling 10).** `VisualRef` carries ids, not the carrier object. The carrier passed to `selfCheck` resolves by location:

| Location | Carrier question |
|---|---|
| `question`, `questionRationale` | the top-level question |
| `caseQuestion`, `caseQuestionRationale` | the embedded leaf |
| `caseExhibit`, `caseStageExhibit` | the parent case container |

This is load-bearing: `selfCheck` reads `question.meta`, so a mis-routed carrier yields a silent empty-meta pass. No live record is masked today — both exhibit-location visuals are non-arithmetic (`rhythm_strip`, `vitals_trend`) — but the first arithmetic exhibit would be.

**All 12 registered kinds define `selfCheck`.** So: **assert `selfCheck(spec, carrierQuestion) === []` for every promoted record, every kind.** This is new coverage — `visuals-conformance.ts` calls `selfCheck` on *fixtures* and discards the result. Cheap, universal, and it is the tripwire that makes §6 work.

**Nondeterminism:** none proven. `capnography` accumulates floats across ~3,750 sample steps and `rhythm_strip`/`fetal_monitoring` use seeded RNG — all IEEE-754 deterministic. The §8 survey must prove it per record rather than assume it (double-render equality), and report any record that fails as a blocker.

## 4. Intentional rebaseline

One command: `npm run parity:rebaseline -- --reason "<text>" --scope <kind>[,<kind>...] [--before-ref <git-ref>]`.

`--before-ref` (ruling 8) defaults to the PR merge base and names the ref the *before* evidence is rendered from. The snapshot stores hashes only, so old output can only come from old code: render it from a temporary clean `git worktree` checkout at that ref, and remove the worktree afterward. Record the resolved ref in the receipt.

It writes snapshots **and** a receipt at `audit/visual-parity-rebaseline-<ISO-date>/receipt.json`, committed with the PR:

```
{ reason, scope: [kinds], generatedAt, inputGitSha, beforeRef,
  changed: [{ parityId, kind, location, before: sha, after: sha, cause }],
  added:   [{ parityId, kind, location, after: sha, cause }],
  removed: [{ parityId, kind, location, before: sha, cause, priorProofSurface, removalReason }],
  totals: { changed, added, removed, unchangedTotal },
  u0Migration?: { migrated: [{ parityId, oldHash, newHash, equal: true }], allEqual: true } }
```

`beforeRef` is the resolved `--before-ref`. `u0Migration` appears **only** in the initial baseline-phase receipt (§7) and is absent thereafter.

**Initial-baseline bootstrap (ruling 14).** When — and only when — `visual-parity-promoted/` has no active snapshot, the command creates an `initialBaseline` receipt section instead of fabricating 199 `added` deltas or causes. It must first reconcile the live bank filenames, all 199 identities, kind/location counts, proof-surface nulls, and determinism results byte-for-byte with the committed passed survey; require all 12 registered kinds; and re-prove U0 structural/hash equality. Once an active snapshot exists, bootstrap mode is permanently unavailable and every later run uses the ordinary delta model.

**Delta causes and the identity-drift null (ruling 12).** Every delta record declares `cause`: `renderer` or `content`. There is no `identity` cause — identity movement is a failure, not a category. `parityId` is a pure function of ids, locations, and indexes, so **added or removed records with no corresponding `banks/**` change in the same diff are identity drift and fail the run**: the traversal or the identity scheme moved under a stable corpus, which is exactly what the scheme exists to prevent and would otherwise present as an innocuous pair of added/removed lines. This null is **not** symmetric with `changed`: a content promotion that edits an existing visual legitimately produces `changed` records with no renderer diff, so only added/removed are identity-bearing.

Causes are derived, never supplied: `content` requires that record's own destination bank (`added`/`changed`) or prior bank (`removed`) in the Git diff; `renderer` requires the applicable kind renderer or shared visual primitive in the diff. An unrelated `banks/**` edit never satisfies identity drift. If both apply to one delta, the cause is ambiguous and the command fails pending a split or explicit architect adjudication.

**The rule that makes "regenerate and accept everything" insufficient:** the PR declares `--scope` up front, and rebaseline **fails** if any `changed`, `added`, or `removed` record's kind is outside the declared scope (ruling 6). All three delta classes are enforced: scoping only `changed` would let a renderer PR silently absorb a promotion or a retirement. Unrelated hash churn is therefore detected mechanically, not by a reviewer noticing 199 lines moved. A bulk rebaseline is acceptable only when (a) every `changed`, `added`, or `removed` record's kind is in scope, (b) the receipt's delta count is consistent with the renderer diff's blast radius, (c) tracing changes carry §5 artifacts, (d) arithmetic changes carry §6 proof. Reviewer: the gate seat, not the renderer's author.

## 5. Human visual review (tracing kinds)

Minimum artifact, by delta class (ruling 12) — the asymmetry is structural, since an added record has no *before* and a removed one has no *after*:

| Delta | Tracing evidence |
|---|---|
| `changed` | rendered SVG + PNG **before/after pair** |
| `added` | **after-only** render |
| `removed` | **before-only** render, from the `--before-ref` worktree |

Plus a stacked contact sheet under the rebaseline receipt directory — the established pattern (`audit/rhythm-strip-pacemaker-backfill-2026-07-01/rendered/contact-sheet.png`). Bounded: sample from the **union** of changed + added + removed tracing records, byte-sort by `parityId`, cap the sample at the first 12, and record the sampling rule in the receipt. A controlled renderer-fixture visual suite may be specified separately when a tracing renderer actually changes; P2 does not invent undefined fixture-to-`beforeRef` mapping or evidence-side rules without a live delta.

Before creating the tracing receipt directory or writing any evidence, preflight both external commands used by this local-only artifact path: `rsvg-convert` and `magick`. If either is unavailable, fail with the missing command name and explain that the tool is required only for tracing rebaseline artifacts. Do not add either binary to npm or CI in P2.

**Certifier:** any independent gate seat that did not produce the renderer diff. With Codex implementing, the gate seat may certify; Luke may review additionally and retains merge authority, but Luke-only visual certification is not required.

## 6. Arithmetic preservation

**No new module API is required.** `meta.derived_values_keyed` is *content*, owned by the bank and not by the renderer; `selfCheck` asserts declared == computed. Therefore:

> (declared keyed map byte-unchanged) ∧ (`selfCheck` returns `[]` after) ⇒ computed values unchanged.

Snapshot each arithmetic record's `declaredKeyed` alongside its hash when keyed values are present; §3's universal `selfCheck`-empty assertion supplies the other half. Output format, per changed arithmetic record, in the receipt:

```
{ parityId, kind, declaredKeyed: {before, after}, selfCheckErrors: {before: [], after: []} }
```

The proof requirement is kind-sensitive:

- `io_record`, `medication_label`, and `burn_map` must declare at least one recognized keyed arithmetic value. A promoted record with no such value is a survey blocker and requires content backfill before baseline authorization.
- `device_screen` is a **keyed-settings / arithmetic hybrid** (ruling 5). Its `selfCheck` accepts `meta.keyed_settings` **or** `meta.derived_values_keyed`, erroring (`self_check_no_keyed_cue`) only when both are absent; `keyed_settings` is independently checked, since `self_check_keyed_setting_absent` requires every entry to resolve to a setting present on the screen. It is therefore a genuine checked proof surface. Require **either** ≥1 recognized `keyed_settings` entry **or** ≥1 recognized `derived_values_keyed` derivation; neither present is a survey blocker. Apply numeric before/after equality **only** when `derived_values_keyed` is present. Rationale: `dev_pca_basal_opioid_naive_01` is pure pump-setting recognition and `dev_high_alert_kcl_pump_mismatch_01` is protected today by keyed settings; demanding arithmetic of them would manufacture numbers to satisfy a spec, which is the failure mode principle 11 exists to prevent — `selfCheck` recomputes *the answer*, and a recognition item has no answer to recompute.
- `io_trend` is an arithmetic / trend hybrid. It must expose at least one checked proof surface: a recognized `derived_values_keyed` array/scalar, a non-empty supported `expected_trend`, or a supported `crossover`. A pattern-only record may therefore omit exact keyed totals when its load-bearing trend/crossover assertion is present and passes `selfCheck`. An `io_trend` record with none of those proof surfaces is a survey blocker.
- When an `io_trend` record does carry keyed arithmetic, the same before/after keyed-map equality rule applies.
- `mar` carries a **semantic** proof surface, not an arithmetic one (ruling 11). No numeric equality applies. The survey must nonetheless recognize the surface **independently**: a nonempty supported `keyed_relationship`, **or** at least one *structurally valid* `keyed_cells` entry that resolves to a real (medication, time) administration. Neither present is a survey blocker.

**Why an empty `selfCheckErrors` array is not proof of coverage.** `selfCheckMar` gates its necessity check on `meta !== null`, so a record with no metadata returns an empty array — indistinguishable, within that array, from a record that passed. Its presence test is also `keyed_cells.length > 0`, evaluated before entry validation, while the resolution loop skips non-object entries and entries whose `medication` / `time` are not strings; `keyed_cells: [null]` therefore satisfies presence and validates nothing. An empty error array is evidence that nothing was *detected*, not that the property *holds*. This is the same reason §8 detects absent proof for `io_record`, `device_screen`, and `io_trend` independently rather than reading `selfCheckErrors`, and the rule now extends to `mar` for the same reason. The live count is expected to be zero; a measured null and an inferred null are different objects, and only the measured one authorizes a baseline.

**Delta-class proof requirements (ruling 12):**

| Delta | Arithmetic / hybrid evidence |
|---|---|
| `changed` | `declaredKeyed` before/after equality |
| `added` | `declaredKeyed` after + `selfCheck` empty |
| `removed` | **no** numeric comparison; the receipt must record `priorProofSurface` (the surface type the record carried) and `removalReason`, established by the normal successful render / `selfCheck` at `beforeRef`. Without this, a removal silently erases the record of what was previously protected. |

`selfCheckIoRecord` does not literally return early merely because `question.meta` is absent; it computes totals but has no keyed declaration to compare and can therefore return no error. When metadata exists with no recognized keyed values it already emits `self_check_no_keyed_values`. The promoted-parity survey must detect both forms of missing protection rather than relying only on returned errors.

**Failure behavior:** any non-empty `selfCheckErrors.after`, any prohibited missing proof surface, or any `declaredKeyed` delta **fails the run** — not a warning. Overridable only when the PR's stated subject *is* the numeric behavior, which requires the corresponding bank edit to appear in the same diff under content review.

## 7. Baseline architecture

- **Location:** `scripts/tests/__snapshots__/visual-parity-promoted/<kind>.json`, one file per kind. Split, not monolithic: diffs localize, and receipts name kinds.
- **Bootstrap ordering:** generate all 12 deterministic, byte-sorted snapshot files while the legacy U0 hashes still exist; verify the three rhythm ids, kinds, locations, and byte hashes; write successful `initialBaseline` and `u0Migration` receipt sections; only then remove the legacy owner in a separate commit. Snapshot keyed objects use deterministic recursive key ordering, and a repeated generation is byte-identical.
- **U0 migration (ruling 7).** The three legacy rhythm-strip SVG hashes (`rhy_sinus_brady_001`, `rhy_vtach_001`, `rhy_afib_001`) migrate into `visual-parity-promoted/rhythm_strip.json`; the `svgHashes` array is then removed from `scripts/tests/__snapshots__/visual-parity.json`, which remains the owner of its 11 `validationReasons` cases only. All three are `question`-location records the promoted baseline hashes identically through the same registry path, so the freeze created a permanent contradiction: a ratified rhythm-strip rebaseline would pass the scoped command and still fail the frozen test. The migration must be **mechanically lossless**, in this order: (a) all three ids appear in the new promoted rhythm snapshot; (b) their hashes equal the current U0 hashes **byte-for-byte** — deletion of the old array is not permitted until this passes; (c) the initial receipt carries a dedicated `u0Migration` section recording each id's old hash, new hash, and equality result; (d) U0 provenance is preserved in the legacy snapshot's `note` field, in `PROJECT-HISTORY.md`, and in git history. **Do not retain a permanent cross-file equality test after migration** — that would recreate two active owners for one fact, which is exactly what this ruling removes.
- **Generator:** `scripts/visual-parity-baseline.ts`, `npm run parity:rebaseline`. Test: `scripts/tests/visual-parity-promoted.ts`, `npm run test:visual-parity-promoted`, appended to `test-visuals`.
- **Record:** `{ parityId, kind, location, bank, parentQuestionId, ownerId, svgHash, declaredKeyed? }`. Hash covers `renderSvg` output only — which already embeds viewBox, dimensions, captions, and the EN `aria-label`. No separate metadata hashing.
- **Stale/missing both fail:** snapshot record with no live visual → FAIL (removed/renamed); live visual with no snapshot record → FAIL naming the new `parityId` and the regen command. Newly promoted visuals are thus surfaced by the gate, not discovered later.
- **Cost:** 199 records × ~140 B ≈ 28 KB across 12 files; runtime is 199 `renderSvg` calls + 199 `selfCheck` calls, well under a second — the whole corpus already renders inside `census`/`validate-bank`.

## 8. Impact survey — Codex-run, architect-adjudicated, **precedes baseline authorization**

Precedent: the P0 manifest's own `authoredBy` is *"Claude (architect seat); deterministic generator implemented by Codex."* Same shape here.

`npm run survey:promoted-visual-parity` → `audit/promoted-visual-parity-survey-2026-07-16/survey-manifest.json`, per record: `parityId`, kind, location, bank, renderer module, proposed tier, resolved carrier-question id and its routing rule, `renderDeterministic` (double-render equality), `selfCheckErrors`, `declaredKeyedPresent`, and the **named recognized proof surface** for hybrid / arithmetic / trend / structured-document kinds (`derived_values_keyed`, `keyed_settings`, `expected_trend`, `crossover`, `keyed_relationship`, or `keyed_cells`). Plus rollups: counts by kind × location; counts by tier, including `structured-document`; **identity collisions**; **`selfCheck` failures**; **non-deterministic renders**; **exact-arithmetic records with no keyed values**; **`device_screen` records with neither keyed settings nor arithmetic**; **`io_trend` records with no keyed, trend, or crossover assertion**; and **`mar` records with neither a nonempty `keyed_relationship` nor a structurally valid resolving `keyed_cells` entry**. `unclassifiedKinds` must be empty once the `mar` tier lands.

**Live-population note the manifest must record:** all four current `io_trend` records carry **both** keyed arithmetic and trend assertions. The pattern-only allowance of ruling 2 therefore has **no live population** and is forward-looking only. State this explicitly so a future seat does not read the allowance as covering something it currently protects.

**This is evidence, not permission.** The work uses one draft PR in two phases:

1. **Survey phase:** fix the two existing parity defects, add the deterministic survey generator and its regressions, commit the generated manifest, and stop. Do not commit the promoted baseline hashes yet.
2. **Architect adjudication stop:** Claude reviews the manifest against this spec. Any collision, `selfCheck` failure, non-deterministic render, or prohibited missing proof surface blocks baseline authorization and routes to a narrow repair/content-backfill decision.
3. **Baseline phase after PASS:** continue in the same draft PR with the baseline generator, snapshots, rebaseline receipt machinery, focused regressions, and CI hook. If the survey exposes a repair with materially different ownership or reversal cost, split that repair into its own PR and keep the baseline PR blocked.

Baselining a broken record pins the breakage; a generated manifest is never self-authorizing.

## 9. Regression floor

Focused cases: (1) each of the six locations yields a snapshot record — synthetic fixture, since four locations have ≤2 corpus records and two have zero; (2) identity stability across a synthetic unrelated bank addition; (3) missing record fails; (4) extra record fails; (5) mutated hash fails; (6) duplicate `parityId` throws (§0.2); (7) invalid bank throws (§0.1); (8) **snapshot** regeneration is idempotent — run twice, byte-identical (ruling 9). The idempotent surface is the snapshot files only; the receipt is a dated artifact whose volatile `generatedAt` / `inputGitSha` are excluded from comparison, following `scripts/census.ts`'s existing `stripVolatile` pattern; (9) out-of-scope `changed`, `added`, **and** `removed` records each fail rebaseline; (10) `declaredKeyed` delta fails; (11) missing required arithmetic/trend proof surfaces fail, and a `device_screen` record with keyed settings but no arithmetic **passes**; a `mar` record with `keyed_cells: [null]`, or with no `meta`, **fails** the proof-surface check despite an empty `selfCheckErrors`; (11a) added/removed records with no `banks/**` change fail as identity drift, while a `changed` record with no renderer diff **passes** as content; (11b) a removed record with no `priorProofSurface` or `removalReason` fails; (12) carrier routing resolves the right question per location, proven on a synthetic case fixture; (13) the U0 migration is lossless — the three migrated hashes equal the pre-migration values, and `visual-parity.json` still validates with its 11 reason cases and no `svgHashes` key; (14) `census.json` `visualArtifacts.total` **unchanged** by this PR — the separate-denominator tripwire.

Full path (`AGENTS.md` *Renderers* row): `npm run test-visuals`; `npm run test:visual-parity-promoted`; `selfCheck` regressions; visual smoke; `npm run validate-bank -- banks/*.json`; `npm run build`. Plus `npx tsc -b --pretty false`; `npm run census && npm run census:check`; `git diff --check`. Confirm `git diff` shows **no change** to `banks/**` or `census.json`, except that a separately adjudicated content-backfill repair must be isolated and reviewed under the bank-content path rather than hidden inside baseline generation. `visual-parity.json` changes exactly once, in the baseline phase, and only to remove its `svgHashes` array under the lossless U0 migration check.

## 10. Scope and seats

Out: P3 vitals bounds, P4 single-row labs, P5 CI redesign.

**Minimal CI hook:** before this PR, `promotion-gate.yml` ran neither the visual suite nor P0's rationale-visual-floor regression. Add **one workflow step**, `npm run test-visuals`, and append `tsx scripts/tests/rationale-visual-floor.ts` to that package command so the one authorized step genuinely covers both P2 and P0's six-location schema-floor regression. That is the whole CI ask; the broader matrix stays P5.

Seats: **producer** Claude (this spec + §8 survey design and adjudication) → **implementation** Codex → **automated check** `test-visuals` in CI → **visual review** an independent gate seat → **merge** Luke. Claude cannot be the sole implementation certifier; architect spec-conformance verification remains a separate check from the gate seat's independent content/visual review.

**Provenance note (ruling 13).** During the survey phase Codex edited §4's acceptance bullets to cover all three delta classes. The edit was a mechanical application of ratified ruling 6 — it corrected an inconsistency the architect left when rewriting the rule sentence but not the bullets — and the architect verified it against the ruling before accepting. Recorded here rather than escalated to `AGENTS.md`: the existing authority and independent-review rules already cover it, and a constitutional rule from a benign, verified, conforming edit would mostly duplicate them. Revisit only on a pattern of implementers originating unratified semantic change.

---

## P2 READY FOR CODEX — SURVEY-FIRST

Architecture is settled. Codex is authorized to implement the survey phase in one draft PR, including the two existing parity-defect fixes and the focused survey regressions. The promoted hash baseline is **not** authorized until Claude records a survey-adjudication PASS in that PR.

Ratified implementation rules:

1. `io_trend` is an arithmetic / trend hybrid and is added to the operational numeric-preservation list in `AGENTS.md`.
2. Exact-arithmetic records without recognized keyed assertions fail; pattern-only `io_trend` may satisfy the gate through a checked trend or crossover assertion.
3. Any independent non-producer gate seat may certify calibrated-tracing visual smoke.
4. Survey and baseline remain in one draft PR with a mandatory adjudication stop between phases.
5. `device_screen` is a keyed-settings / arithmetic hybrid; numeric equality applies only where arithmetic is keyed.
6. `--scope` enforcement covers `changed`, `added`, and `removed`.
7. The three U0 rhythm-strip hashes migrate into the promoted baseline under a lossless-migration check; `visual-parity.json` keeps its `validationReasons` only, and no permanent cross-file equality test survives.
8. `--before-ref` defaults to the PR merge base; before artifacts render from a temporary clean worktree at that ref.
9. Snapshots are the byte-idempotent surface; receipts exclude `generatedAt` / `inputGitSha` from comparison.
10. Carrier-question routing is explicit per location.
11. `mar` is a structured-document / table tier: hash + universal `selfCheck`, ordinary diff review; no arithmetic proof, no visual smoke. The survey measures its semantic proof surface independently.
12. Added/removed evidence is one-sided; added/removed with no `banks/**` change is identity drift and fails. Removed arithmetic/hybrid records record `priorProofSurface` and `removalReason`, with no numeric comparison.
13. No `AGENTS.md` rule for Codex's conforming §4 edit; provenance recorded in §10.
14. Initial baseline creation is a one-time bootstrap with exact passed-survey/U0 reconciliation, not 199 `added` deltas; after any active baseline exists, record-local Git-derived causes and ordinary delta mechanics are mandatory.

The architect's survey-adjudication PASS now additionally requires the lossless U0 migration check to hold.

---

## Survey adjudication — PR #55 @ `b09b508`, 2026-07-16

Architect verification against live disk: counts reconcile (199; tiers 81 + 50 + 53 + 18 = 202 less `burn_map` 10 and `io_trend` 4 double-counted = 188, + `mar` 11 = 199, so `mar` was provably the only unclassified kind); U0 hashes in `visual-parity.json` match the manifest's `oldHash`/`newHash` byte-for-byte; both §0 defects are eliminated by construction in `scripts/promoted-visual-parity.ts` rather than patched, and `visual-parity.ts` inherits the nulls through `loadPromotedVisualRecords`; carrier routing matches §3 and throws rather than degrading on an unresolvable leaf; the phase boundary is machine-enforced (no record may carry `svgHash`).

Findings: zero identity collisions, zero `selfCheck` failures, zero non-deterministic renders, zero missing arithmetic/hybrid proof surfaces, U0 lossless check green.

**Status: `SURVEY-ADJUDICATION: PASS`. The baseline phase is authorized.**

The `mar` proof-surface amendment (ruling 11) landed and the manifest regenerated clean: `byTier.structured-document` 11, `unclassifiedKinds` empty, `architectQuestions` empty, `blockers` empty, `marRecordsWithoutProof` empty. `marPopulation` reconciles independently — 7 `keyed_relationship` + 7 resolving `keyed_cells` − 3 carrying both = 11 = total, with `withoutRecognizedProof` 0.

Both `selfCheckMar` escape hatches are closed in `extractRecognizedProof`, and closed independently of `selfCheck` rather than by reading its errors: `questionMeta` returns `{}` for an absent `meta` instead of gating on it, so a no-`meta` record recognizes zero surfaces; and `recognizedMarProof` admits a `keyed_cells` entry only after it resolves through `isRecord` → nonempty `medication` / `time` → `time` in `timeGrid` → medication found by name → a matching administration, so `keyed_cells: [null]` recognizes nothing. Presence now requires resolution, which is strictly stronger than `selfCheckMar` §2. The regressions assert both halves on the same input — recognizer rejects **and** `selfCheckMar` returns `[]` — pinning the escape hatch as a proven live property rather than a spec assertion.

The PASS therefore rests on a **measured** null, not one inferred from an empty error array. That was the point of the amendment; the count landing at zero was expected and is not what made it valid.

**On the manifest's `status` field.** The generator hardcodes `AWAITING ARCHITECT ADJUDICATION` and must keep doing so. An earlier architect note listed a status flip to `PASS` as expected churn; that was wrong. A generator that writes its own verdict is precisely the self-authorization the two-phase structure exists to prevent. The producer's artifact records what it measured; the architect's artifact records the verdict. Two owners, two facts.

**Baseline phase (§8 phase 3) is open.** Codex may proceed in the same draft PR with: the baseline generator and per-kind snapshots (§7); the lossless U0 migration and the `svgHashes` removal (ruling 7); the rebaseline command with `--scope`, `--before-ref`, receipts, and delta-cause enforcement (§4, ruling 12); the §9 regression floor; and the single `npm run test-visuals` CI hook (§10). Architect spec-conformance verification and the independent gate seat's review both remain outstanding before merge.

---

## Baseline closeout — PR #55, 2026-07-17

Claude's baseline spec-conformance verdict is **`CONFORMS`**, accepted by Luke. Before independent gate-seat routing, the accepted closeout amendments wire P0's rationale-floor regression into `test-visuals`, retire the undefined colocated-fixture phrase without adding fixture machinery, and preflight the two local tracing-artifact commands before any evidence directory is created. Architect verification is closed; the draft PR proceeds next to the independent gate seat and remains unmerged.
