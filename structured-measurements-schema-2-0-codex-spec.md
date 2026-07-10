# Structured Measurements Schema 2.0 — Codex Spec

Date: 2026-07-09
Author: Claude (architect seat)
Implementer: Codex
Spec-conformance gate: Claude (architect)
Content gate: Claude Code

Adds two additive fields to `structuredMeasurements` — `bound` (censored values) and `population`
(pediatric rendering safety) — and closes the enforcement gaps the Candidates 12/13 gate review
surfaced. Governing decisions: `DECISIONS.md` principle 24 and its **Amendment (2026-07-09)**,
principle 26, and the **version-token invariant** under *Other standing invariants*.

**The version is `2.0`, and it is an additive change.** The major bump is an overflow digit, not a
breaking-change signal. This supersedes the `1.10` framing in the first draft of this spec.

Nothing here authorizes a canonical bank write. All bank changes stage and gate as usual.

---

# AMENDMENT 0A — 2026-07-10 (governing)

Author: Claude (architect seat). Status: **ratified by Luke, 2026-07-10.**
Trigger: Codex's read-only pre-implementation gate report, plus a non-binding architect-seat review by
GPT-5.6 Sol. **Where this amendment conflicts with the body below, the amendment governs.**

The block Codex placed on implementation is **upheld**. Its central finding is correct and is not
ordinary spec drift: **one 2.0 field has already escaped into the 1.9 contract.**

## A0.1 Verified disk state (architect read live, 2026-07-10)

- `src/types.ts` — `SchemaVersion` stops at `"1.9"`. `StructuredMeasurementPopulation` and
  `StructuredMeasurements.population?` exist. `StructuredMeasurementValue` has no `bound`.
- `src/allowedKeys.ts` — `structuredMeasurements: ["population", "panels"]`. No `bound`.
- `src/schema.ts` — `SCHEMA_VERSION = "1.9"`; `supportedSchemaVersions` ends at `1.9`; the floor ladder in
  `validateBankObject` runs 1.1 → 1.9 with **no `population` floor**.
- `scripts/apply-structured-measurements.ts` — writes `population` conditionally from the staged record
  (`...(record.population ? { population: record.population } : {})`) and then **hard-pins**
  `meta.schemaVersion = "1.8"` on every touched bank, then runs post-apply `validateBankObject`, which
  passes because no floor exists.
- `PROJECT-HISTORY.md` — already declares `1.9` (line 32) and already carries the `io_trend` milestone
  (line 52). **The body of this spec is wrong about that.**
- `CLAUDE.md` — genuinely stale at `1.7`.

The fourth bullet is the point. `population` is not an inert type declaration awaiting a feature. There
is a tool on disk today that will write a 2.0 field into a canonical bank, stamp that bank `1.8`, and
pass every gate.

## A0.2 Rulings

**R1 — Forward-reconcile `population`; do not remove it.** The shape is right. Rollback is churn that
restores no safety. What is missing is the version boundary and the promised enforcement.

**R2 — The boundary is mechanical *now*, not on delivery of 2.0.** "Do not promote `population` content
until 2.0 lands" is a promise enforced by nothing, which is the same half-state this spec exists to
prevent. Land an interim guard in 0A: `validateBankObject` **FAILs on the presence of
`structuredMeasurements.population`**, with a message naming schema 2.0 as the gate. One condition, one
fixture, fail-loud (principle 3). Phase 1 deletes it and replaces it with the 2.0 presence floor in the
same commit. Under this guard the applicator's post-apply validation fails loudly the moment a staged
record carries `population` — which is the behavior we wanted all along.

**R3 — The applicator's pinned `"1.8"` is a defect independent of the sweep result, and it is fixed in
0B.** It stamps a literal, not a floor: it downgrades a bank declared above `1.8` and bumps a bank
(`visual-canonical.json`, `1.7`) that has no `1.8` content. Post-apply `validateBankObject` catches the
case where the stamped literal falls below an actual content floor — so this cannot produce a bank whose
declaration is beneath its content — but a *declaration* downgrade passes silently, because `declared >
inferred` is legal. **Amended (A0.5): do not leave this live between 0B and Phase 1.** Once
`schemaVersionAtLeast` exists, the pin becomes one line and needs no new export:

```ts
meta.schemaVersion = schemaVersionAtLeast(existing, "1.8") ? existing : "1.8";
```

Phase 1 replaces the `"1.8"` literal with the floor inferred from what was actually applied.

**R4 — Sweep before Phase 1. Report only, no writes.** Inventory every existing occurrence of
`structuredMeasurements.population` **and** of `record.population` across: `banks/*.json`;
`banks/_promoted/`; `banks/banks-raw/`; the staged extraction artifacts (both `clean_kv` and
`supplement` buckets); the held artifacts `12G` / `12T` / `13H`; fixtures and tests. Deliverable is a
table of file, ref, field, current declared version. Then: any bank or staged artifact carrying the
field is declared `2.0` when 2.0 lands; artifacts that cannot migrate have `population` removed or stay
held; **banks with no 2.0 feature are never bumped merely because 2.0 exists.**

**R5 — Phase 3 and Phase 2 items 1, 4, 5 are already on disk. They become a verification checkpoint.**
They are backward-compatible formatting and auditing fixes. They change no accepted bank-data contract
and take no schema floor. **Do not reimplement them.** Run the Phase 3 and Phase 2 tests listed below;
commit code only if verification reveals a defect. Verification results route to the architect seat,
which owns the corresponding `DECISIONS.md` open-thread closeouts — Codex does not edit `DECISIONS.md`.

**R6 — Bare arrays bypass the entire floor ladder, and the fix belongs in one place.** Every floor in
`validateBankObject` is guarded on `schemaVersion !== undefined`; the two that are not (case-study 1.1,
visual 1.2) test equality against `"1.0"`/`"1.1"`. A bare array yields `meta === undefined`, so **no
floor fires at all** — this is broader than "conditional feature-floor enforcement." Ruling:

- **The learner import boundary is version-agnostic and stays that way.** *(Corrected by A0.5 — the
  original wording claimed bare arrays are "enveloped with an inferred schema version" at import. They
  are not.)* `importQuestionsFromText` calls `validateQuestion` per question and never constructs or
  validates an envelope, so no version is inferred and no floor is consulted. That is correct and
  deliberate: `validateQuestion` is version-free by design, uploaded questions are learner-local, and
  they never promote, consolidate, or become repository material. Version inference exists only on the
  **export** side, in `toExportEnvelope`. **Consequence, stated plainly so it is not later read as an
  oversight:** the interim `population` guard does not govern uploads. It is not supposed to.
- **`validateBankObject` gains a `requireMeta` option, and it is on wherever content is repository
  material.** *(Expanded by A0.5.)* Call sites passing `requireMeta: true`: `scripts/promote.ts`,
  `scripts/consolidate.ts`, `scripts/audit/validate-bank.ts` (Tier 0, globs `banks/`), `src/banks.ts`
  (bundled load), and `scripts/validate-bank.ts` for every non-raw path — that file already computes an
  `isRaw` discriminator, so the change is `requireMeta: !isRaw`. Raw drafts under `banks/banks-raw/`
  stay exempt: they are pre-repository, and `promote` is the boundary. Missing metadata **never** ranks
  as `1.0` anywhere content becomes repository material.

**R7 — Unknown and missing versions must throw, not rank zero.** Today there are three behaviors for the
same malformed input: `schema.ts`'s private `cmpSchema` uses `indexOf`, so an unknown version ranks
**−1**; `promote.ts` and `consolidate.ts` each build a rank map and fall back to **0**. That divergence,
not the duplication, is the argument for Phase 0B. Note this is **implementation of a ratified rule, not
a new decision**: `DECISIONS.md`'s version-token invariant already mandates `schemaVersionAtLeast` over a
**private** index, throwing on unknown, with no exported rank. Nothing to adjudicate; build it.

**R8 — Traversal work in 2.0 is scope-fenced to 2.0 features.** `structuredMeasurements` exists only on
`CaseStudyExhibit` (`src/types.ts`), so its traversal surface is case exhibits and stage exhibits — not
"every visual location." Phase 1 ships inference/floor tests for `population` and `bound` across those
surfaces and nothing else. The `hasPacerRhythmStrip` double-copy, the third copy in
`scripts/tests/visual-parity.ts`, and the `rationale.visuals` omission are a **separate, standing
deferral** in `DECISIONS.md`: tightening a floor can newly reject an existing bank, so the retrofit
requires its own bank-impact survey, its own gate, and its own review. **Do not add a test to the 2.0
pass that would force that retrofit.** A private shared feature-inference helper is welcome; only
`schemaVersionAtLeast` becomes public.

**R9 — The pediatric detector is deterministic, bilingual, subject-scoped, and marker-triggered.**

- **Bilingual or it does not exist.** Every rule that touches text covers EN and zh-CN. A detector that
  reads `18-month-old` but not `18月龄`, or `infant` but not `婴儿`, is incomplete. Cover at minimum:
  `岁`, `个月`/`月龄`, `新生儿`, `婴儿`, `幼儿`, `儿童`, `学龄前`.
- **Weight-based dosing is not a marker.** *(Corrected by A0.5 — the original bullet listed it, and that
  was unsafe.)* Adult heparin (`units/kg/hr`), dopamine and other vasopressors (`mcg/kg/min`),
  enoxaparin, chemotherapy, and CAR-T protocols are all weight-dosed; the live bank already carries an
  adult 80-kg dopamine calculation. Weight-based dosing is **corroborating context only** — it may raise
  confidence in a marker already present, and it independently triggers neither FAIL nor WARN. A WARN
  that fires on every adult heparin drip trains the checker seat to dismiss it, which is worse than no
  WARN at all.
- **Subject-scoped.** The marker must attach to the client (`9-month-old presents…`, `该患儿…`), not to
  any occurrence anywhere in prose. A postpartum adult case that mentions her infant is the forcing
  counterexample: an unscoped detector FAILs it, and the author cannot escape by declaring `"adult"`.
- **FAIL condition:** subject-scoped pediatric marker present **and** `population` absent or `"adult"`.
- **WARN condition:** an unscoped pediatric **age or noun** marker anywhere in the record. Routes to the
  checker-seat sampling queue alongside the existing triggers. Never a FAIL, never an auto-pass.
- **The detector never infers, never auto-assigns, and never overrides the author.** Disagreement
  escalates to the architect seat. Same shape as the bare-calcium identity WARN, escalated where the
  failure mode is worse.
- Regression fixtures must include adult false positives: `18-year-old`, `pediatric ICU nurse`,
  `the patient's infant`, `infant formula`, `儿科`, and — per A0.5 — adult weight-based-dosing items:
  heparin `units/kg/hr`, the existing 80-kg dopamine `mcg/kg/min` calculation, and a weight-dosed
  oncology item.

**R10 — Reconcile the `population` vocabulary before Phase 1 ratifies it.** `population` already appears
four other places in the schema: `vitals_trend`, `lab_trend`, `burn_map`, and `referenceBand`
(`src/allowedKeys.ts`). A fifth definition of "population" in one schema is the shape of a future
correctness bug — the argument that gives us a single `roundTo`. **0A deliverable (report only):** the
enum vocabulary of each, with `file:line`. The architect rules on alignment-versus-deliberate-divergence
before `StructuredMeasurementPopulation` is ratified. Separately: pediatric `burn_map` content is under
a standing content block; the detector must not be wired to interact with it.

**R10 amendment (2026-07-10, implementer objection sustained — runtime, not types).** "Import one
exported union" is insufficient: **TypeScript unions erase at runtime**, which is exactly why
`vitals_trend` accepts arbitrary JSON `population` strings today while its type says otherwise. The
Phase 1 obligation is therefore:

1. One exported **runtime** vocabulary — `export const POPULATIONS = ["adult", "peds_child",
   "peds_infant"] as const;`
2. The type **derived from it** — `export type Population = typeof POPULATIONS[number];`
3. `vitals_trend`, `lab_trend`, and the structured-measurement validator all consume that one runtime
   vocabulary, and each **FAILs on a value outside it**. An unknown population is invalid, not adult.
4. **Two existing fixtures must flip in the same commit, not be deleted.** `scripts/tests/schema-bank.ts`
   currently asserts that a `peds_child` `structuredMeasurements` fixture FAILs the interim 2.0 gate; at
   2.0 it must PASS, and FAIL against the 2.0 floor when declared `1.9`. And the `vitals_trend` module's
   `population: null` **valid** fixture (added 2026-07-10, correct under today's unvalidated field) becomes
   **invalid** once `POPULATIONS` is enforced. Whoever lands `POPULATIONS` will meet a red "valid" fixture,
   and the path of least resistance is to admit `null` to the vocabulary. Do not. Flip the fixture. A
   deleted gate that takes its fixture with it leaves the floor untested; a widened vocabulary that
   accommodates a stale fixture loosens the ratchet by accident (principle 27).

Home it in a **leaf module with no imports** (`src/population.ts`), consumed by `src/types.ts`,
`src/schema.ts`, and the two kind modules. A leaf placement is not fastidiousness: `src/types.ts`
re-exports from `src/visuals/types.ts`, so a runtime constant homed there risks an import cycle that a
type-only re-export currently hides. Same single-definition discipline as `roundTo` in
`primitives/graphPaper.ts` (principle 11), applied to a vocabulary rather than to arithmetic.

`burn_map`'s `adult | pediatric` keeps its own vocabulary — the geometry has two region tables, not
three — and the divergence is documented as deliberate so no later cleanup pass "harmonizes" it into a
`peds_infant` Rule-of-Nines table that does not exist and that the standing content block forbids
authoring. `referenceBand.population` is dormant: admitted by the strict-key manifest, no type, no
validation, no consumer. Do not type it in 2.0; reserve it for the reference-range lane.

**R11 — `CLAUDE.md` is fixed now, by deletion, not by updating the number.** It went stale because it
restates a fact that `PROJECT-HISTORY.md` owns. Single definition applied to documentation. Replace the
sentence beginning `Schema \`1.7\` is current:` and its feature-ladder recital with:

> The current schema version and its feature ladder are declared in `PROJECT-HISTORY.md` and
> `NCLEX-Question-Schema.md`. This file does not restate them.

This is the one documentation change that does not wait for 2.0: `CLAUDE.md` is the session-start entry
point, and four models reason about floors from prose without ever calling a comparator.

**R12 — Corrections to the body of this spec.** The Step 0 premise is false; `PROJECT-HISTORY.md` is
already at `1.9` with the milestone in place. "Three files claim three different versions" is wrong —
`CLAUDE.md` is stale, and `NCLEX-Question-Schema.md` describes `population` as current 1.9 behavior,
which the 2.0 pass corrects. The `AGENTS.md` `1.6` glossary-migration reference still wants checking.

## A0.3 Revised phase order

| Phase | Contents | Code? |
|---|---|---|
| **0A** | This amendment. Interim `population` FAIL + fixture (R2), one commit. `CLAUDE.md` deletion (R11), one commit. Sweep report (R4), applicator report (R3), `population`-vocabulary report (R10) — **response-only, no repo files.** | Guard + doc only |
| **0B** | `schemaVersionAtLeast` public, rank private, throw on unknown (R7). Replace both script rank maps. `requireMeta` at every repository-material call site (R6). Applicator version pin fixed (R3). Public-export regression test. Lands while `SCHEMA_VERSION` stays `1.9`. | Yes |
| **3** | Verification checkpoint (R5). Code only on a verified defect. | Probably none |
| **1** | **Atomic.** `2.0` token; `population` ratified with its presence floor; `bound` with its presence floor; one-sided sanity; comparator message names `bound`; pediatric detector + FAIL (R9); applicator pin replaced (R3); affected artifacts migrated or held (R4); traversal tests scope-fenced (R8). | Yes |
| **2** | Only the Phase 2 items genuinely absent (2, 3). Preserve and test 1, 4, 5. | Yes |
| **Docs** | One pass, after 2.0 is green: `NCLEX-Question-Schema.md`, `PROJECT-HISTORY.md` 2.0 milestone, `AGENTS.md`, and the architect's `DECISIONS.md` closeouts. | Docs |

**Phase 1 does not land the version token first and promise the detector afterward.** The nine items in
its row are one commit or none.

0A and 0B are separate commits with an architect gate between them. Each later phase stays separable.

## A0.4 Governance

Codex's audit was correct to stop and correct in substance; two imprecisions are recorded so the next
reader does not inherit them. `promote.ts` and `consolidate.ts` do not maintain "separate public-version
rank maps" — both derive from the exported `supportedSchemaVersions`. And the bare-array finding was
under-called, per R6.

GPT-5.6 Sol's architect memo is **advisory and non-binding**, and is retained for reference only. It
reached the right classification (premature `population` versus benign formatter fixes) without reading
the repository — it wrote that the implementation shape is *"apparently"* already there. **Producer ≠
checker is load-bearing here:** `population` reached `types.ts`, `allowedKeys.ts`, the applicator, and
the schema document without a version boundary precisely because nothing independent stood between the
implementer's judgment and `main`. Seating the implementer's own model family in the architect chair to
rule on that implementer's audit reproduces the same topology one level up. The implementer seat may
review, object, and escalate. **Adjudication stays in the architect seat, and `main` stays behind
Luke's gate.**

## A0.5 Adjudication of implementer objections (2026-07-10)

The implementer seat returned five objections against Amendment 0A. **Four are sustained and one is
sustained with a tightening.** All five were verified against live disk before ruling; none is a style
note, and the first is a factual correction the architect owed.

**1. Import boundary — SUSTAINED. The amendment was wrong.** `src/bankImport.ts` calls `validateQuestion`
per question and never envelopes. Ruling: **keep uploads version-agnostic.** `validateQuestion` is
version-free by construction, uploads are learner-local, and an import adapter that infers a version is
exactly the redesign that must not enter 0B by implication. R6 is corrected above. The interim guard does
not reach uploads, deliberately — and Phase 1 must add `population`/`bound` to the `toExportEnvelope`
inference ladder, so an uploaded population-bearing question that is later exported produces an envelope
that fails `validate-bank` loudly rather than one that declares `1.8` and lies.

**2. `requireMeta` call sites — SUSTAINED.** Two sites confirmed on disk: `scripts/audit/validate-bank.ts`
globs `banks/` with no `requireMeta`, and `src/banks.ts` validates every bundled canonical without it.
Without them the invariant is a slogan. R6 is expanded above. `scripts/validate-bank.ts` already computes
`isRaw`, so it costs one expression; raw drafts stay exempt because `promote` is the boundary.

**3. Weight-based dosing — SUSTAINED, and tightened past what was asked.** The objection is correct and
the clinical examples are correct. The implementer proposed demoting it to corroborating evidence *or* an
unscoped WARN. **Rejected in part: it is corroborating context only, and triggers no WARN either.**
Weight-based dosing appears across a large fraction of pharmacology items; a WARN that fires on every
adult heparin drip floods the checker-seat queue and trains the seat to dismiss the signal — the failure
mode principle 3 exists to prevent, arriving through noise rather than silence. Fixtures extended.

**4. Applicator pin — SUSTAINED.** Deferring a known version-downgrade path to Phase 1 was the same
mistake as deferring the `population` boundary: a defect kept alive by a promise. It moves to 0B, where
the primitive that fixes it is already being built. Note for the record that the blast radius is narrower
than "hard-downgrades every touched bank": post-apply `validateBankObject` still catches any stamp that
falls below a real content floor, so the live defect is a *declaration* downgrade and an unearned bump of
`visual-canonical.json`. Narrower, not acceptable. Freezing the applicator is unnecessary once the one-
line fix lands in 0B.

**5. Commit granularity — SUSTAINED.** The 0A guard is one commit; the `CLAUDE.md` deletion is a second.
The three reports are **response-only and write no repository files.** The phase table above says so now.

**Recorded finding.** The implementer reports that a sweep of promoted canonical found zero
`structuredMeasurements.population`. That is consistent with the architect's reading and means the interim
guard breaks no canonical validation. It also means the guard is self-verifying: if `validate-bank` fails
on a canonical bank after R2 lands, the sweep was wrong and the migration is a content question. R4 still
stands for `_promoted/`, raw, staged artifacts, and the holds — the canonical sweep does not cover them.

This is what the implementer seat is for. Objections of this quality are the reason adjudication and
implementation sit in different chairs, and the reason the architect reads disk before ruling on either.

---

## Why `2.0` and not `1.10`

`"1.10"` sorts correctly under exactly one of the three comparison strategies a version string meets
in this repo:

| | `parseFloat` | lexicographic | `indexOf` |
|---|---|---|---|
| `"1.10"` vs `"1.7"` floor | `1.1 < 1.7` ✗ | `"1.10" < "1.7"` ✗ | ✓ |
| `"2.0"` vs `"1.7"` floor | `2.0 > 1.7` ✓ | `"2.0" > "1.7"` ✓ | ✓ |

`"2.0"` is correct under all three. That matters more than usual here because **version strings leak
out of code** — they sit in `meta.schemaVersion` of every exported bank, in `PROJECT-HISTORY.md`
prose, in `NCLEX-Question-Schema.md`, and in the context windows of four models that reason about
floors in natural language and never call a comparator. A rank helper protects the code; only the
naming rule protects everything else.

Ratified rule (`DECISIONS.md`): **the minor component never exceeds 9; at `1.9` the next version is
`2.0`.** Retroactively consistent — `1.0`–`1.9` already satisfy it, so nothing migrates.

---

## PHASE 0 — `schemaVersionRank` (first commit; no longer a correctness blocker)

Under `2.0` no existing floor breaks, so this stops gating Phase 1. **Do it first anyway.** It is
roughly thirty lines, and it converts a lucky ordering property into an enforced one.

**It also has diagnostic value that outlives the bump.** If any floor compares versions with
`parseFloat` or lexicographically, that is a latent defect *today* — it has simply never fired,
because `1.0`–`1.9` happen to parse monotonically. Choosing `2.0` keeps it dormant. Find it now,
with nine bumps of headroom, rather than at `2.10` with more canonical banks at stake.

**Audit.** Report every schema-version comparison site with `file:line` before changing anything.
Known prose references to floors: `meta.schemaVersion >= 1.7` for pacer-bearing `rhythm_strip`; the
`1.2` visual floor; the `1.3` highlight / `1.4` bowtie / `1.5` rationale-visual / `1.6` unfolding-case
floors; the `consolidate` schema-version guard; `bankImport.ts`'s `toExportEnvelope` inference ladder.
There may be more. The audit is the deliverable — do not fix along the way.

**One question the audit must answer.** Do `consolidate`'s schema guard and `toExportEnvelope` enforce
`declared >= inferred`, or `declared == inferred`? The guard exists to catch declared *below* inferred —
a bank claiming `1.2` while carrying `1.7` content. Declared *above* inferred is always safe, because
floors are minimums. One `bound` value will lift an entire bank to `2.0` while most of its records still
only require `1.9`. If either site demands equality, that is a Phase 0 finding and it changes Phase 1.
State the inequality explicitly when you fix it; "tolerate declared > inferred" reads to a future agent
as "delete the check."

**Then:** export exactly one legal primitive from `src/schema.ts`:

```ts
export const schemaVersionAtLeast = (version: SchemaVersion, floor: SchemaVersion): boolean => ...
```

The rank/index implementation stays **private**. Every floor in the codebase is a `>=` comparison, so
`atLeast` is the only operation a caller ever legitimately needs; a public rank invites arithmetic on it
(`rank(v) - rank(floor) >= 0`, or worse, treating the index as a version). Throw on an unknown version.
Rewrite every comparison site found in the audit. No site parses, splits, or lexically compares a
version string again.

This is principle 11's single-definition discipline moved from arithmetic to ordering. One canonical
`roundTo` means two kinds cannot round the same dose differently; one canonical `schemaVersionAtLeast`
means two floors cannot disagree about whether `2.0` is newer than `1.7`. Same reason `roundTo` is not a
general math library: one definition, one legal operation.

**Regression that proves the phase was behavior-preserving:** every existing floor admits and rejects
exactly the banks it admitted and rejected before.

---

## PHASE 1 — The two fields

### 1a. `bound` — censored values

Source prose reports bounds, not numbers: `aPTT >150 seconds`, `D-dimer >50,000 ng/mL`,
`troponin <0.01 ng/mL`. v1 had no representation, and `parseMeasurementValue` silently stripped the
comparator, rendering `>150 seconds` as `150 seconds` beside intact prose reading `>150`. The strip is
gone. This phase gives the value a home.

**Type** (`src/types.ts`):

```ts
export interface StructuredMeasurementValue {
  columnId: string;
  value: string;            // numeric text only; NEVER carries a comparator
  unit: string;
  bound?: ">" | "<";        // NEW (2.0). Absent = exact.
  context?: "post_intervention";
}
```

**Validation** (`src/schema.ts`):

- `value` matching `/[<>≤≥]/` is a **hard FAIL**, with a message pointing at `bound`. Not optional, not
  a strip. (Check whether this landed in the 2026-07-09 patch pass; if so, add the fixture and move on.)
- `bound` present ⇒ the bank declares `2.0`, enforced through `schemaVersionRank`.
- `bound` is the enum or it fails. No `>=`, no `≤`, no free text.

**Sanity bounds become one-sided.** `MeasurementDef.sanity` currently checks `min <= v <= max`. For a
bounded value:

- `bound: ">"` ⇒ check `value >= sanity.min` only. Ignore `max`.
- `bound: "<"` ⇒ check `value <= sanity.max` only. Ignore `min`.

Without this, `D-dimer >50,000` fails the gate that exists to catch typos, and `aPTT >150` clears a
`max` of 200 purely by luck. A bound asserts the true value lies past the number; the gate cannot
bracket what the assay could not measure.

**Never banded.** A bounded value is never compared against `refBand`. Moot today — v1 renders no
bands — but the reference-range lane must inherit it, so encode it now.

**Rendering** (`src/structuredMeasurements.ts`):

- `formatStructuredMeasurementValue` prefixes the bound: `>150 seconds`, `<0.01 ng/mL`.
- The SI parenthetical is **suppressed** for bounded values. Converting a bound is meaningful;
  printing two of them is clutter.
- `parseMeasurementValue` stays strict and unchanged. With `bound` lifted out, `value` is clean numeric
  text, so the strict parser never sees a comparator. That is the design working, not a special case.

**The bound is transcribed, never adjusted.** Whether a facility's aPTT reportable ceiling is 150 or
200 seconds is a reference-range question owned by `lab-reference-range-verification-spec.md`. The
extractor copies what the source says.

### 1b. `population` — pediatric rendering safety

**Type** (`src/types.ts`):

```ts
export interface StructuredMeasurements {
  population?: "adult" | "peds_child" | "peds_infant";  // NEW (2.0). Wrapper-level.
  panels: StructuredMeasurementPanel[];
}
```

Wrapper-level, **not** per-panel: population is a property of the client, not of a table. A vitals
panel and a labs panel in one exhibit describe the same person.

**Validation** (`src/schema.ts`): enum or FAIL. Presence implies `2.0`. **Optional** — see below.

**Enforcement lives in the gate, not the schema.** Luke's ruling is *pediatric records require
`population` explicitly; do not mass-migrate existing adult records just to write `"adult"`.* Those two
clauses are in tension with a schema-level requirement, because a bank is one file with one
`meta.schemaVersion`: the moment a single `2.0` record lands in `gpt-canonical.json`, a
"required at 2.0" rule would demand `population` on every structured record in that bank — exactly the
mass migration Luke forbade.

So:

- **Schema:** `population` is optional; if present it must be a valid enum. Absent behaves as adult.
- **Flowsheet gate + applicator:** a record whose case or exhibit is pediatric and whose `population`
  is absent (or `"adult"`) is a **FAIL**. Never a WARN.

**The pediatric predicate is authored, then cross-checked.** The producer declares `population` on the
staging record. The gate independently detects pediatric context from source prose and case metadata —
age in months, age under 18 years, markers such as `toddler`, `infant`, `neonate`, `well-child`,
`pediatric`, `peds`, weight-based dosing — and FAILs on disagreement. Author is the source of truth;
the detector exists only to fail the author. Same producer≠checker shape as the calcium identity WARN,
escalated to FAIL because the failure mode is worse: a mis-declared adult population renders a normal
toddler as abnormal, and the error stays invisible until the reference-range lane lands.

**The detector ships with the rule.** The FAIL condition is Phase 1; the prose detector that makes it
enforceable is gate code and lives in `scripts/` alongside Phase 2's work. Land them together. A FAIL
condition with no detector is a comment.

**A field with no v1 consumer, deliberately.** Principle 24 rejected `displayUnit` and GPT's proposed
`sourceUnitText` on exactly the grounds that no v1 consumer reads them. `population` is admitted anyway,
and the distinction is load-bearing enough to state so a future agent does not "clean it up":

> Reject fields that are **derived** — a stored copy of something the renderer can recompute invites the
> drift a single `roundTo` exists to prevent. Admit fields that are **irrecoverable context** —
> information the applicator holds and the record cannot reconstruct. Adding `population` later is a
> content migration over canonical exhibits; adding `displayUnit` later is one line in the formatter.

Concretely: `opus23_nat_toddler_01`'s creatinine 0.3 / Hgb 11.4 / HR 152 and
`nine_month_well_child_safety_01`'s Hgb 10.8 are all normal for their ages and all outside the adult
bands in `ANALYTE_DEFS`. Nothing reads those bands today. Everything will.

---

## PHASE 2 — Gate rules from the amendment (no schema change)

Each is independently testable; none touches `types.ts`.

1. **`prior_no_current`.** `excludedValues` entries with `reason: "prior"` require a same-key current
   value in the same record. When absent, the record routes to a `prior_no_current` review/FAIL path.
   Origin: `gpt_case_refeeding_syndrome_tpn_01/baseline_record` excluded a sixteen-analyte PACU panel as
   `prior` with no current sibling for any key, leaving the baseline flowsheet with vitals and one
   point-of-care glucose. Where the earlier value *is* the exhibit's only reading, it keys as the current
   column and the column label carries the source's marker (`PACU (6 h prior)`).

2. **GATE 2 blindness is the general defect (principle 26).** The completeness advisory fires on *named
   but neither keyed nor excluded*, so any exclusion silences it. Add: **exclusion count is a positive
   sampling signal.** The checker-seat queue must always sample records in the top decile of
   `excludedValues.length`, alongside the existing `skip_serial` / `post_intervention` / unit-alias triggers.

3. **`post_intervention` is a reassessment marker, not a co-location marker.** Tag only when the value is
   explicitly presented as a reassessment after an intervention directed at that measurement, or after a
   clearly framed treatment bundle. Encode in the extraction prompt and in the adjudication checklist.
   Forcing case: refeeding `stage_2_update` (TPN initiation is the *cause*, untagged) vs `stage_3_update`
   ("After interventions, repeat labs", tagged).

4. **GATE 2 unitless subclass.** New advisory, distinct from *named but unkeyed*: an allowlist-named
   analyte carrying a **number with no adjacent unit token**. The check that should have caught
   `Hour 18 labs: WBC 19,200/mcL, Hct 38%, BUN 18, Cr 0.8, …`.

5. **`Cr` label pattern.** The gallstone GATE 2 advisory count is 12 against 13 allowlist-named unkeyed
   tokens by hand-count; the likely miss is the `Cr` abbreviation. Verify. If the creatinine label pattern
   does not match `Cr`, a future exhibit writing `Cr 2.4 mg/dL` keys nothing *and* raises no advisory —
   silent omission, the class Batch 13 caught with PaO2. Regression: `Cr 2.4 mg/dL` must key.

---

## PHASE 3 — Display defects (code only, no canonical change)

All three predate Candidates 12/13 and affect already-promoted rows. Every fix lives in the formatter.

1. **`trimNumber` destroys significant zeros.** It round-trips through `Number`, so `creatinine 1.0`
   renders `1 mg/dL` and `INR 1.0` renders `1`. On the `inputIsPrimary` path, emit `entry.value` verbatim
   (thousands separators stripped) instead of parse → round → stringify.
2. **Placeholder units leak to the learner.** `displayPolicyFor` falls back to `def.canonicalUnit`, so pH
   renders `7.32 (unitless)` and INR renders `1 (ratio)`. Map both to an empty display unit.
3. **CBC SI parenthetical is a numeric no-op.** `wbc`/`platelets` carry `primaryUnit ×10³/µL` against
   `secondaryUnit ×10⁹/L` at a conversion factor of exactly 1, so every promoted CBC row renders
   `19.2 ×10³/µL (19.2 ×10⁹/L)`. Suppress the parenthetical when the factor is 1.

---

## Surfaces to update

**Code**
- `src/types.ts` — `bound`, `population`, `SchemaVersion` gains `"2.0"`.
- `src/schema.ts` — `SCHEMA_VERSION`, `supportedSchemaVersions`, `schemaVersionAtLeast` (public) over a
  private rank, comparator FAIL, one-sided sanity, enum checks; strict-unknown-key recursion covers both
  new fields.
- `src/allowedKeys.ts` — both new keys, or `scan-unknown-keys` reports them off-schema.
- `src/bankImport.ts` — `toExportEnvelope` infers `2.0` when any `bound` or `population` is present.
- `src/measurementUnitPolicy.ts` — `parseMeasurementValue` unchanged (already strict); suppress the SI
  paren for bounded values.
- `src/structuredMeasurements.ts` — bound-aware `formatStructuredMeasurementValue`,
  `serializeStructuredMeasurements`, `renderStructuredMeasurementsSvg`; Phase 3 fixes.
- `scripts/` — flowsheet gate (`prior_no_current`, pediatric FAIL, unitless subclass, `Cr` pattern,
  exclusion-count sampling), applicator, `consolidate` schema guard.

**Docs — schema source of truth first**
- `NCLEX-Question-Schema.md` — **authoritative.** Both fields, `2.0`, the one-sided sanity rule, the
  never-banded rule, the pediatric FAIL, the derived-vs-irrecoverable field test, and the version-token
  invariant (minor never exceeds 9; major is an overflow digit).
- `PROJECT-HISTORY.md` — **corrected by Amendment 0A (R12):** already declares `1.9` and already carries
  the `io_trend` milestone. Nothing to fix before 2.0. Add the 2.0 milestone in the post-2.0
  documentation pass, stating in the same line that the major bump is additive.
- `CLAUDE.md` — claims schema `1.7` is current. **Amendment 0A (R11): delete the claim rather than update
  the number**, and do it in 0A rather than in the post-2.0 pass.
- `AGENTS.md` — the normalize-raw-bank section still references schema `1.6` glossary migration; check
  whether it wants version-agnostic phrasing.
- `DECISIONS.md` — **already written.** Principle 26, the 2026-07-09 amendment, and the version-token
  invariant are on disk. Do not re-litigate or re-word them; if implementation forces a change to a
  ratified rule, stop and escalate to the architect seat rather than editing the principle.

Two documents misstate the schema state, in different directions: `CLAUDE.md` is stale at `1.7`, and
`NCLEX-Question-Schema.md` documents `population` as current `1.9` behavior when the ratified ladder puts
it at `2.0`. That is the drift that sends every fresh agent down the read-order into a contradiction.
Amendment 0A splits the fix: `CLAUDE.md` now (R11), the schema contract with the 2.0 pass (R12).

---

## Tests

`schemaVersionAtLeast` (Phase 0)
- `atLeast("2.0", "1.9")` and `atLeast("2.0", "1.2")` are true; `atLeast("1.2", "1.7")` is false.
- Every existing floor (1.2 / 1.3 / 1.4 / 1.5 / 1.6 / 1.7) admits and rejects exactly the banks it did
  before. **The regression that proves Phase 0 was behavior-preserving.**
- Unknown version throws.
- Guard test: no version string in `supportedSchemaVersions` has a minor component above 9.
- No public export exposes a version index or rank.

`bound`
- Comparator in `value` (`">150"`) → FAIL, message names `bound`.
- `bound: ">"`, `value: "150"`, `unit: "seconds"` → PASS.
- `bound: ">"`, `value: "50000"`, `unit: "ng/mL"` on a key whose `sanity.max` is below 50000 → PASS
  (one-sided). Same value **without** `bound` → FAIL.
- `bound: "<"`, `value: "0.01"` below `sanity.min` → PASS. Without `bound` → FAIL.
- `bound` present on a bank declaring `1.9` → FAIL.
- Render: `>150 seconds`, no SI parenthetical.

`population`
- Invalid enum → FAIL.
- Present on a bank declaring `1.9` → FAIL.
- Absent on an adult record → PASS, behaves as adult.
- Absent on a record whose case prose carries a pediatric marker → **gate FAIL**.
- Declared `"adult"` on a pediatric-detected record → **gate FAIL**.
- Declared `"peds_infant"` on `nine_month_well_child_safety_01` → PASS.

Phase 2
- `prior` exclusion with no same-key current → `prior_no_current` FAIL.
- `prior` exclusion with a same-key current → PASS.
- Allowlist-named analyte, bare number, no unit → new advisory.
- `Cr 2.4 mg/dL` keys `creatinine`.

Phase 3
- `creatinine` `"1.0"` `mg/dL` renders `1.0 mg/dL`, not `1 mg/dL`.
- `ph` `"7.32"` renders `7.32`, no `(unitless)`.
- `wbc` `"14,200"` `/uL` renders `14.2 ×10³/µL`, no parenthetical.

Full suite before calling the pass complete:

```sh
npx tsc -b --pretty false
npm run test:schema-bank
npm run test:structured-measurements
npm run test:measurement-allowlist
npm run test:flowsheet-gate
npm run scan-unknown-keys
npm run validate-bank -- banks/*.json
npm run test-visuals
npm run census:check
npm run build
```

---

## Sequencing and gates

**Execution order is `0A → 0B → 3 → 1 → 2`** (Amendment 0A supersedes the original `0 → 3 → 1 → 2`; the
reasoning below for hoisting Phase 3 ahead of Phase 1 stands, but Phase 3 is now a verification
checkpoint, not a code phase). The phase *numbering* below is unchanged; only
the order in which they land is. Phase 3 is hoisted ahead of Phase 1 for two reasons. Both Phase 3 and
Phase 1b's bound-aware rendering live inside `formatStructuredMeasurementValue`, so running Phase 1
first means editing the same function twice, the second time on top of known-wrong output. And
Candidates `07B`/`08A` promoted ABG surfaces, so `pH 7.32 (unitless)` is very likely rendering in the
live bank right now, alongside every `creatinine 1.0` reading `1 mg/dL`. Phase 3 is three formatter
fixes with zero dependencies and it is the only work in this plan the learner can see.

Phase 0 lands as its own commit with its own regression, before any field exists — not because `2.0`
requires it, but because the audit finding is worth having and it makes the `2.0` tests mean something.
The audit (report-only) and the `schemaVersionAtLeast` implementation are **separate commits with an
architect gate between them**. Keep every later phase a separable commit too.

Phase 2's `prior_no_current` and `post_intervention` rules unblock the `13H` hold artifact; nothing in
`13H` re-stages until Phases 1 and 2 are both green.

**Before `13H` re-stages, sweep the staged and held artifacts for comparators.** The 0-hit sweep covered
promoted canonical only. Batches 01–20, `skip_serial` records, empty extracts, and the `12G` / `12T` /
`13H` holds have never been checked, and `<0.01` is the most common censored value in real lab prose.
With `bound` landed this is no longer a defect — it is a data question: report which held records need
the field, before re-staging rather than after.

Per `DECISIONS.md` principle 2 extension: **Codex does not merge or push `main`.** Spec-conformance is
verified by the architect seat, which authored this document. Content review of any re-staged artifact
goes to Claude Code, which has not read this spec — deliberately, and that is the reason the two checks
are separate.

Before implementing, Codex performs its pre-implementation review and returns objections. The architect
adjudicates. Phase 0's audit findings are an expected source of objections and should be reported before
the rank function is written.

## Deferred, deliberately

- **Reference bands.** Every `refBand` in `lab_trend/defs.ts` is an unverified placeholder. `population`
  is stored, not consumed. `lab-reference-range-verification-spec.md` owns the consumption and must
  inherit two rules from this spec: bounded values are never banded, and `glucose` is never banded
  without a fasting qualifier.
- **Single-row labs panels.** `gpt_case_overdue_preventive_screening_01` renders a labs panel of exactly
  one row. A two-row floor is proposed, not ruled.
- **Fishbone renderer.** Still a fast-follow. Nothing here changes that.
- **Gallstone / TLS holds (12G, 12T).** TLS unblocks on `uric_acid`, already landed. Gallstone unblocks
  on the Phase 2 unitless subclass plus `inferredUnit`, both of which change what it extracts. Re-stage
  after, not during.
