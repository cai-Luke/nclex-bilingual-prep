# Study-Session Sampler Constant Calibration — Codex Spec

**Date:** 2026-06-26 (rev. 2 — incorporates Codex implementation review)
**Author:** Claude (planning seat)
**Implementer:** Codex
**Status:** Ready for implementation. Rev. 2 replaces the rejected top-K-by-count floor cap with an explicit threshold-gated priority allowlist (Codex's correction).
**Scope:** `src/sessionSampler.ts` (one new param + ~4 lines), `scripts/tests/session-sampler.ts` (two tests). No schema, no app-flow, no bank changes.
**Resolves:** `DECISIONS.md` open thread *"Sampler floor/penalty constants — placeholders."*

---

## 1. Finding

The two sampler placeholders were calibrated against the live within-category concentration the sampler actually sees (top-level case studies excluded, per `buildWeightedSession`'s pool filter). Result: **the diversity penalty is fine; the floor-set derivation is mis-calibrated and is the only thing that needs to change.**

### 1a. Diversity penalty `alpha = beta = 1` — retain (evidenced)

The headline concern (`DECISIONS.md`: "the rhythm-strip share of its home category is the number to watch") does not show a pathology the soft penalty fails to control. Concentrations are measured against the **case-study-excluded** Physiological Adaptation pool (n≈231, the live sampler denominator — *not* the census graded-item denominator of 268, which counts case studies the sampler removes):

- **rhythm_strip in Physiological Adaptation:** ~32/231 ≈ 13.9%. At N=50 that category draws ~7 seats; with the floor guaranteeing one rhythm strip, `sameKindCount` starts at 1 and the next rhythm candidate is weighted `1/(1+1) = 0.5` against a fresh kind's `1.0` — halved per candidate, compounding. Runaway EKG-glut within a session is not reachable at a ~14% pool share under that penalty.
- **Cardiovascular Disorders (largest topic concentration), same category:** ~72/231 ≈ 31.2%. With `alpha = 1` the 2nd candidate is weighted 0.5, 3rd 0.33 — progressive suppression keeps it near 1–2 per draw, correct for a ~31% topic.

No category exhibits a concentration that `alpha = beta = 1` under-suppresses. Close the placeholder the same way `max_cell_deviation_pp = 8` was closed: checked against the live baseline, retained.

### 1b. Floor-set derivation — mis-calibrated by content growth

The floor set is derived at runtime as *"visual kinds whose count in the case-study-excluded pool ≥ `floorThreshold` (10),"* taking **all** kinds above the line. The spec (`Archive/study-session-weighting-spec.md` §4.2) and `DECISIONS.md` both assume this yields three kinds — `{ rhythm_strip, lab_trend, vitals_trend }` — and the spec explicitly argues a guaranteed MAR read should *not* happen because "a dedicated … MAR read is rare on a real exam."

Content growth has invalidated that assumption. Standalone (case-study-excluded) visual counts now over the threshold of 10:

| kind | standalone count | ≥10? |
|------|---:|:--:|
| rhythm_strip | 44 | yes |
| lab_trend | 20 | yes |
| medication_label | 13 | yes |
| device_screen | 12 | yes |
| burn_map | 11 | yes |
| io_record | 11 | yes |
| mar | 11 | yes |
| vitals_trend | 10 | yes |
| injection_site | 8 | no |
| capnography | 7 | no |
| fetal_monitoring | 6 | no |

The floor set has silently grown from **3 → 8 kinds**. Consequences at the N=50 default:

1. **Visuals are over-represented and the category draw is displaced.** Each floored kind reserves one seat *charged within the category distribution* (`remainingByCategory` is decremented). 8 reserved visual seats ≈ 16% of a 50-question session pinned to "must contain ≥1 of this kind," each displacing a category-representative item. A minimum-length NCLEX does not deterministically contain one of each of eight visual kinds.
2. **It now guarantees exactly the reads the spec said should be rare** — `mar` (11) crossing the line forces a MAR read every session ≥40, contradicting documented design intent.

**Root cause (the part rev. 1 got wrong):** a count-based selector — whether "all ≥ threshold" *or* "top-K by count" — measures *how many of this kind we generated*, a content-production artifact, not *how exam-frequent the kind is*. Rev. 1 proposed `maxFloorKinds = 3` (top-3 by count) and claimed it reproduces `{ rhythm_strip, lab_trend, vitals_trend }`. **It does not:** top-3 by count is `{ rhythm_strip (44), lab_trend (20), medication_label (13) }` — `vitals_trend` (10) loses to `medication_label` and `device_screen`. A count cap therefore preserves the root cause; it only bounds the symptom.

---

## 2. Decision

The floor set is a **product decision about which visual literacies to guarantee practice on** (waveform / trend reading), not something derivable from generation counts. Encode it explicitly:

- **Add `floorKindPriority: string[]`, default `["rhythm_strip", "lab_trend", "vitals_trend"]`** — an explicit, ordered allowlist of the kinds worth guaranteeing.
- The runtime floor set = the allowlist filtered to kinds whose **case-study-excluded standalone count ≥ `floorThreshold`**. The threshold is now a *viability gate* (don't reserve a seat for a kind that has been pruned below a usable pool), not a selector.
- Keep `floorThreshold = 10`, `floorMinCount = 40`, `alpha = 1`, `beta = 1`.

This bounds the floor to exactly the intended three kinds today (~6% of an N=50 session), and — critically — the set no longer drifts as more `medication_label` / `device_screen` / `mar` content lands, because those kinds are simply not on the allowlist. The only auto-correction retained is the *downward* one that is actually sound: if a listed kind's pool ever drops below `floorThreshold`, it falls out of the floor automatically.

Trade-off named: this abandons the original "auto-derive the floor set from the bank" intent. That intent was the bug — there is no on-disk signal for exam-frequency, so deriving from counts tracked production volume instead. An explicit curated list is the honest representation of a product decision. Adding a genuinely exam-frequent new kind to the floor (e.g. if `fetal_monitoring` literacy becomes a goal) is then a deliberate one-line allowlist edit, which is correct — flooring should be chosen, not inferred.

**Reservation order (Luke's call, 2026-06-26):** the allowlist is reserved in **list order** (`rhythm_strip` first), not alphabetically as the prior implementation happened to reserve. Deliberate priority choice — rhythm-strip literacy is the highest-frequency real-exam visual read and the largest pool, so if floor/category contention ever forces a drop (rare at N=50, effectively never per the weighting spec's donor analysis) the highest-priority literacy is retained. Behaviorally near-inert at the N=50 default; documented as intent rather than left implicit.

---

## 3. Code change (`src/sessionSampler.ts`)

**3a. Declare the default allowlist as a named, testable module-level constant** (not an inline literal), so tests can reference it:

```ts
// Curated product decision: the visual literacies worth guaranteeing practice on.
// List order is reservation priority (§2 note). NOT derived from generation counts.
export const DEFAULT_FLOOR_KIND_PRIORITY = ["rhythm_strip", "lab_trend", "vitals_trend"];
```

**3b. Add the param to `SamplerParams`:**

```ts
export type SamplerParams = {
  alpha?: number;
  beta?: number;
  floorThreshold?: number;
  floorMinCount?: number;
  floorKindPriority?: string[];   // NEW — explicit allowlist, threshold-gated
  now?: Date;
};
```

**3c. Read it alongside the other defaults in `buildWeightedSession`, with an order-preserving dedupe** so a caller-supplied list carrying a repeated kind (e.g. `["rhythm_strip","rhythm_strip"]`) cannot reserve the same kind twice — the prior map-based derivation guaranteed at-most-one per kind, and this preserves that invariant:

```ts
const floorThreshold = Math.max(1, Math.floor(params.floorThreshold ?? 10));
const floorMinCount = Math.max(1, Math.floor(params.floorMinCount ?? 40));
const floorKindPriority = [...new Set(params.floorKindPriority ?? DEFAULT_FLOOR_KIND_PRIORITY)];   // NEW
```

**3d. Replace the floor-set derivation** (inside the `if (targetCount >= floorMinCount)` block). Current:

```ts
const floorKinds = [...visualCounts.entries()]
  .filter(([, visualCount]) => visualCount >= floorThreshold)
  .map(([kind]) => kind)
  .sort();
```

New — walk the deduped priority allowlist in list order, keep only kinds present at viable count. `visualCounts` is the existing `Map<string, number>` already computed over `eligible` (case-study-excluded), so the count basis is unchanged; only the *selection* changes from "all ≥ threshold" to "listed AND ≥ threshold":

```ts
const floorKinds = floorKindPriority.filter(
  (kind) => (visualCounts.get(kind) ?? 0) >= floorThreshold,
);
```

The `.sort()` is dropped: reservation now proceeds in **list (priority) order**, not alphabetical — see the §2 order note. An empty `floorKindPriority` cleanly disables floors. No other code changes; purity, determinism, RNG injection, and the `file://`/offline invariants are untouched.

---

## 4. Tests (`scripts/tests/session-sampler.ts`)

"Not floor-reserved" is **not** directly observable from a final session — a non-listed visual kind can still arrive via the ordinary weighted draw, and absence-by-luck proves nothing. Design each pool so a floor reservation is the *only* way the kind under test could appear, then assert presence/absence (Codex's correction). Extend the existing fixed-seed suite:

1. **Allowlist excludes high-count non-listed kinds (the rev.1-bug regression).** Build an eligible pool where the `medication_label` records (×13, highest count, non-listed) are all marked **already-seen (progress tier 2)**, their categories also hold ample **unseen non-visual** records, and `rhythm_strip×12` / `lab_trend×11` / `vitals_trend×10` are unseen. Both selection paths prefer the best (unseen) tier, so the ordinary fill passes over the seen `medication_label`; the *only* mechanism that could surface a seen `medication_label` is a floor reservation (which picks the best available tier within its kind). At N=50 default params over several seeds, assert `rhythm_strip` / `lab_trend` / `vitals_trend` each appear ≥1 and `medication_label` appears **0 times** — proving count does not drive floor selection.
2. **Viability gate.** With `vitals_trend×6` (below `floorThreshold`) under the same seen/unseen design, assert the floored set is `{ rhythm_strip, lab_trend }` and `vitals_trend` is not reserved.
3. **Floors disabled via empty allowlist.** With `floorKindPriority: []` and *all* visual-kind records marked seen against ample unseen non-visual records, assert the draw contains **zero** visual items — no forced floor leaked. (Absence is meaningful only because every visual is seen and would otherwise be deprioritized.)
4. **Dedupe.** `floorKindPriority: ["rhythm_strip","rhythm_strip"]` reserves `rhythm_strip` at most once: with exactly one `rhythm_strip` record unseen and all other visuals seen, assert exactly one rhythm strip in the draw.

Keep all prior sampler tests green (distribution, sums-to-N, floor-disabled-at-small-N, case-study exclusion, diversity, determinism).

---

## 5. Follow-up (next markdown pass — not this change)

Fold into the pending markdown-lint pass:

- `DECISIONS.md` "Sampler floor/penalty constants — placeholders" thread → rewrite as resolved: `alpha=beta=1` retained (evidenced against the case-study-excluded concentration, ~14% rhythm in Physiological Adaptation); floor set is now an explicit threshold-gated allowlist `["rhythm_strip","lab_trend","vitals_trend"]`; note the count-derived approach had drifted to 8 kinds and that a top-K-by-count cap was rejected because it tracks generation volume, not exam-frequency.
- `Archive/study-session-weighting-spec.md` §4.2 → note the allowlist replaces the runtime count-derivation (archived spec; light touch only).

No census or bank regeneration required — runtime-sampler change, no on-disk content effect.

---

## 6. Acceptance checklist

- [ ] `DEFAULT_FLOOR_KIND_PRIORITY` declared as a named module-level constant; `floorKindPriority` added to `SamplerParams` defaulting to it.
- [ ] Caller-supplied `floorKindPriority` is order-preserving-deduped (no double-reservation).
- [ ] Floor set = deduped allowlist filtered to kinds with case-study-excluded count ≥ `floorThreshold`, reserved in list (priority) order.
- [ ] `alpha`, `beta`, `floorThreshold`, `floorMinCount` defaults unchanged.
- [ ] Allowlist-exclusion regression test (medication_label×13 not floored) + viability/override test added; full sampler suite green.
- [ ] No schema/app-flow/bank change; determinism and offline invariants preserved.
