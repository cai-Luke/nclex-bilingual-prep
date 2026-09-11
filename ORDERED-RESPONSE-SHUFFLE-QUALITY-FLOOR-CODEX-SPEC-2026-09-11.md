# Project Shrimp — Ordered-Response Shuffle Quality Floor

**Date:** 2026-09-11  
**Revision:** R3 — post-Claude and Gemini independent spec review  
**Status:** QUEUED — SPEC FROZEN; IMPLEMENT AS A SEPARATE PIPELINE-HARDENING COMMISSION FROM A CLEAN POST-UX BASELINE  
**Implementation seat:** Codex / coding agent  
**Conformance seat:** GPT-5.6 Sol architect seat that authored this spec  
**Change class:** deterministic promotion/presentation tooling + mechanical canonical presentation migration; no schema, grading, clinical-content, answer-logic, storage, renderer, or runtime-network change authorized

## 0. Purpose

Prevent an `ordered_response` item from reaching the learner in a presentation that is mechanically too close to the correct final sequence.

The forcing observation is not a clinical-content defect. The independently reviewed Question Forge item `gpt_2026_08_30_1642_t1_03_oxytocin_tachysystole_sequence` was correctly authored and promoted, but deterministic presentation normalization produced `B,A,C,D,E` against the correct sequence `A,B,C,D,E`, leaving 3 of 5 tokens already in their final positions and only one inversion out of ten possible pairs.

The independent review also surfaced a small legacy tail of weak ordered-response presentations. R1 addressed only fixed positions. R2 closed that design gap by requiring **both** a fixed-position floor and a minimum item-level inversion depth. R3 retains that exact item-level predicate and corrects a separate forecast-policy bug found by a second independent review: per-file `template_repetition` findings are authoring-hygiene advisories under P16 and must not self-block this migration when the learner-visible global distribution remains healthy.

This commission makes the defined presentation defect mechanically impossible at promotion time and repairs only existing canonical ordered-response presentations that violate the R2 item floor; R3 changes forecast/stop policy, not the item predicate or retry algorithm.

This is **not** authorization to rewrite any ordered-response stem, option text, correct sequence, rationale, clinical claim, source, bilingual content, scoring rule, question ID, stage boundary, or item type.

## 1. Source freeze and authority

R1 was prepared after:

- Campaign 16 R4 closure;
- independent promotion of the six-item quarantined Question Forge batch;
- commit `d895d85` queuing UX-0A / UX-0B / UX-0C.

R2 was reviewed while the local checkout was on `codex/ux-0c-finite-vocab-pass`; unrelated UX work was active in that worktree. A second independent Gemini review of R2 then reproduced the live corpus and found that the pinned retry seed would cause `hard-cases-canonical.json` to cross the per-file `template_repetition` advisory threshold while the global corpus remained healthy. R3 resolves that governance mismatch without changing the seed. **Do not implement this commission in a dirty UX worktree.** At implementation time, cut or use a clean baseline after the accepted UX work intended to precede this commission.

Before implementation:

1. Read `AGENTS.md` first.
2. Read this work order in full.
3. Re-open current `PROJECT-HISTORY.md`, relevant `DECISIONS.md` P1/P2/P3/P4/P15/P16/P26, `docs/AGENTS-RUNBOOK.md`, `lib/shuffle.ts`, `lib/presentation-normalization.ts`, `lib/raw-promotion-preview.ts`, `scripts/audit/non-mcq-bias-lib.ts`, `scripts/audit/audit-non-mcq-bias.ts`, `scripts/normalize-presentations.ts`, `scripts/raw-gate.ts`, and the focused tests named below.
4. Inspect the current branch/worktree and preserve unrelated changes.
5. Re-derive the live ordered-response population and current presentation state from disk. Do not use prior review counts as an acceptance oracle.

The repository remains authoritative for **current mechanical state**. This work order is authoritative for **authorized scope, the R2 item-quality floor, and the R3 forecast/stop policy below**.

If any named transformation owner, schema bound, or gate has materially drifted by implementation time, report `ORDERED_RESPONSE_SHUFFLE_SOURCE_DRIFT`, stop the affected slice, and continue only separable work whose premises still hold.

## 2. Existing contracts that must remain intact

### 2.1 P1 / P16 ownership

`DECISIONS.md` places answer presentation under deterministic code ownership:

- P1: answer placement is owned by code;
- P16: positional tells are repaired mechanically by deterministic ID-seeded presentation.

This commission implements that existing architecture more completely. It does **not** require a new constitutional decision or a new `DECISIONS.md` entry unless implementation discovers an actual conflict with the live constitution.

### 2.2 Current promotion path

At R2 review, `prepareRawPromotionPreview`:

1. validates the raw candidate;
2. calls `shuffle()`;
3. runs `normalizeBankPresentations()`;
4. revalidates and serializes the exact prepared output consumed by `npm run promote`.

`runRawGate()` audits that final prepared bank after both transformations. Do **not** describe the current raw gate as auditing an intermediate post-`shuffle()` state; older ledger prose predates the present raw-preview orchestration.

The final learner-facing promotion presentation is not owned solely by the first `shuffle()` call. `lib/presentation-normalization.ts` canonicalizes presentation from ID-sorted arrays using its own stable seed. The R2 ordered-response quality rule must be shared by both transformation paths so neither direct use of the P1 shuffle owner nor later presentation normalization can emit a presentation that fails the invariant.

### 2.3 Current audit remains population-level as well

At R2 review, `scripts/audit/non-mcq-bias-lib.ts` checks ordered-response `scramble_depth` using **mean normalized Kendall distance**, with:

- `ordered_min_mean_kendall: 0.35`;
- `scramble_min_n: 8`.

That remains a population-level check. The R2 item floor reuses the same normalized-Kendall adequacy constant at item level but does not replace, remove, or retune the population mean check. Template repetition also remains independently active.

Under P16's binding amendment, however, the two population checks do not have identical authority. `scramble_depth` is currently classified on the mechanical axis and a per-bank failure can inherit into the global mechanical result. `template_repetition` is a distributional check: a canonical file is an authoring-provenance boundary rather than a learner-visible population, so per-file template verdicts are advisory authoring-hygiene findings only and the **global** template verdict stands on its own statistic. R3's forecast and stop conditions must preserve that distinction.

## 3. Ratified R2 item-level floor

### 3.1 Supported option counts are explicit

The live schema at R2 review requires `ordered_response` to contain **3 through 6 options**. The shared quality helper must therefore accept only `N ∈ {3,4,5,6}` after first proving that option IDs and `correct` IDs are the same unique set.

Any other `N`, duplicate option ID, duplicate correct ID, or set mismatch is a structural error. Fail closed; do not extrapolate the floor to unsupported sizes.

### 3.2 Limb A — fixed positions

For an `ordered_response` item with `N` options, define:

- `fixedPositions` = number of displayed positions `i` where `options[i].id === correct[i]`;
- `maxFixedPositions(N) = floor((N - 1) / 2)`.

Limb A passes only when:

`fixedPositions <= maxFixedPositions(N)`

Equivalently: a strict majority of tokens must be displaced from their final correct positions.

### 3.3 Limb B — item-level normalized Kendall depth

Define normalized Kendall distance exactly as the existing audit does: map the presented option IDs into their ranks in `correct`, count inversions, and divide by `N * (N - 1) / 2`.

Export one shared constant from the presentation owner:

`ORDERED_RESPONSE_MIN_NORMALIZED_KENDALL = 0.35`

The existing audit config field `ordered_min_mean_kendall` must source its value from that shared constant while retaining its existing public/config key and population-mean semantics.

Limb B passes only when:

`normalizedKendall >= ORDERED_RESPONSE_MIN_NORMALIZED_KENDALL`

Do **not** add a second Kendall tuning constant.

### 3.4 R2 floor is the conjunction

An item passes only when **both Limb A and Limb B pass**.

For the currently supported sizes, the discrete consequences are:

| N | max fixed | minimum inversions implied by Kendall ≥ 0.35 | lowest passing Kendall | admissible permutations under both limbs |
|---:|---:|---:|---:|---:|
| 3 | 1 | 2 of 3 | 0.667 | 3 of 6 |
| 4 | 1 | 3 of 6 | 0.500 | 12 of 24 |
| 5 | 2 | 4 of 10 | 0.400 | 88 of 120 |
| 6 | 2 | 6 of 15 | 0.400 | 528 of 720 |

The exhaustive permutation test in §11 must independently reproduce these counts rather than trusting this table.

Consequences:

- fully pre-sorted always fails;
- the forcing `B,A,C,D,E` / `A,B,C,D,E` fails both limbs (`fixed=3`, Kendall `0.1`);
- `B,A,D,C,E` fails Limb B despite only one fixed position (Kendall `0.2`);
- a derangement is not required;
- no schema or grading rule changes.

### 3.5 Deliberate boundary of this commission

R2 does **not** introduce a third metric for longest increasing subsequence, pure rotations, run length, or arbitrary notions of visual entropy. For example, `E,A,B,C,D` against `A,B,C,D,E` has zero fixed positions and normalized Kendall `0.4`, so it passes R2 despite retaining a long relative-order subsequence.

That is deliberate. The project already has a ratified Kendall definition for scramble depth; R2 adds a per-item use of that definition plus the fixed-position guard exposed by the forcing incident. If later learner evidence shows long monotone subsequences or rotations are independently exploitable, that is a separate forcing incident and policy decision, not an unbounded expansion of this commission.

## 4. Shared deterministic implementation

### 4.1 One definition in the P1 presentation owner

`lib/shuffle.ts` is the P1 owner and must expose pure reusable ordered-response helpers sufficient for direct shuffling, presentation normalization, and audit use. Exact function names are implementation detail, but there must be one definition for:

- supported-N validation;
- fixed-position counting;
- maximum allowed fixed positions;
- normalized Kendall distance;
- the shared `0.35` minimum-Kendall constant;
- R2 quality evaluation;
- constrained deterministic ordered-response shuffling.

Do not duplicate either the fixed-position formula or Kendall calculation in `presentation-normalization.ts` or the audit library.

### 4.2 Preserve the existing permutation as attempt 0

For a supplied ordered-response question identity, option array, correct-ID sequence, and base seed:

1. Validate the structural premise and supported `N`.
2. **Attempt 0** must be exactly the permutation produced by the existing `deterministicShuffle(options, baseSeed)` algorithm.
3. If attempt 0 passes both R2 limbs, return it unchanged.
4. Only if it fails, generate deterministic retry candidates using this exact structurally unambiguous seed encoding:

   `JSON.stringify(["ordered-response-quality-v2", baseSeed, attempt])`

   where `attempt` is the positive integer retry number beginning at `1`.
5. Return the first retry that passes both limbs.
6. Allow at most **128 retries after attempt 0**.
7. If no passing permutation is found, throw/fail closed.

Do not search all permutations and choose a subjective best-looking one. First passing deterministic candidate is sufficient; the existing population audits continue to detect broader distribution effects.

A retry-cap exception must be diagnosable. The error must name at least:

- question ID;
- option count `N`;
- base seed;
- retry ceiling / attempts performed;
- attempt-0 fixed-position count and Kendall value;
- final attempted candidate's fixed-position count and Kendall value.

Never silently return the weak permutation and never use nondeterministic randomness.

### 4.3 Direct `shuffle()` behavior is still load-bearing

Split `ordered_response` out of the generic MC/SATA branch so its option presentation uses the shared constrained helper.

For direct `shuffle()`:

- attempt 0 preserves the current base seed behavior (`q.id`);
- `correct` remains byte/logically unchanged;
- option objects travel intact with IDs;
- the existing `rationale.byChoice` reordering behavior is **mandatory and must remain byte/behaviorally identical for an already-compliant attempt-0 item**; for a retried item, apply the same existing refId-based remap to the final constrained option order;
- no rationale text or reference identity changes;
- MC and SATA shuffling remain byte/behaviorally unchanged.

The reason to constrain direct `shuffle()` is **not** an intermediate raw-gate audit: the live raw gate audits after presentation normalization. The reason is that `lib/shuffle.ts` is the P1 presentation owner and a direct caller must not be able to obtain an ordered-response presentation the owner itself defines as invalid; both transformation paths therefore share the invariant.

### 4.4 Presentation-normalization behavior

`lib/presentation-normalization.ts` remains the canonical/input-order-independent presentation normalizer.

For `ordered_response` only:

1. continue sorting option objects by ID before deterministic presentation;
2. continue using the existing base seed:

   `[question.id, question.itemType, "options"].join("\u001f")`

3. pass the sorted source array, `question.correct`, question ID, and existing base seed through the shared constrained helper;
4. leave MC, SATA, dropdown-cloze, and matrix normalization behavior unchanged.

Every ordered-response item whose existing normalized attempt-0 presentation already passes R2 must retain exactly its prior normalized option order.

## 5. Prospective audit hardening

Extend `orderedRecords()` in `scripts/audit/non-mcq-bias-lib.ts` with one new mechanical record:

`ordered_response / item_scramble_floor`

Required semantics:

- zero eligible ordered-response items → `INSUFFICIENT`;
- one or more eligible items → `PASS` only when every item satisfies **both** R2 limbs;
- any violation → `FAIL`;
- severity on failure: `major`;
- fix class on failure: `SHUFFLE_AT_PROMOTION`;
- no minimum sample size.

The audit must import the shared quality calculation from `lib/shuffle.ts`; it must not reimplement either limb.

Metrics for every violating item must include:

- item ID;
- option count;
- presented option-ID order;
- correct option-ID order;
- fixed-position count;
- maximum allowed fixed positions;
- fixed-position fraction;
- inversion count;
- normalized Kendall distance;
- minimum required Kendall distance;
- failed limb(s).

`example_item_ids` may retain the framework's display cap, but the underlying metrics/evidence used for migration must enumerate the complete violating set.

Bump `audit_version` from `2.1.0` to **`2.2.0`** because the emitted check set changes.

Do **not** add a config key for the fixed-position formula merely to force `NON_MCQ_BIAS_CONFIG_HASH` to move. The fixed formula is a hardcoded presentation invariant owned by `lib/shuffle.ts`. The existing config object retains `ordered_min_mean_kendall`, now sourcing the same numeric value from the shared constant. The config hash changes because `audit_version` is itself already part of the hashed config object.

Do not change:

- `ordered_min_mean_kendall`'s numeric value;
- `scramble_min_n`;
- `template_repeat_max_share`;
- distributional-vs-mechanical fatality policy;
- any other item-type threshold.

The new record is mechanical and participates in the existing mechanical-bias blocking path used by raw gating/promotion.

## 6. Phase A — pre-change clean-state proof

This phase runs **before any source edit for this commission**.

### 6.1 Pin the exact canonical file set

At R2 review the bundled canonical population is exactly these 13 top-level files:

- `banks/burn-canonical.json`
- `banks/capnography-canonical.json`
- `banks/claude-canonical.json`
- `banks/device-canonical.json`
- `banks/gemini-canonical.json`
- `banks/gpt-canonical.json`
- `banks/hard-cases-canonical.json`
- `banks/io-canonical.json`
- `banks/lab-canonical.json`
- `banks/mar-canonical.json`
- `banks/medlabel-canonical.json`
- `banks/visual-canonical.json`
- `banks/vitals-canonical.json`

Before implementation, reconcile this list against the live top-level `banks/*.json` population. Any added/removed canonical file is source drift requiring an updated explicit list before this commission proceeds.

Nested `banks/banks-raw/`, `banks/_promoted/`, `banks/case_sources/`, archives, audit copies, and scratch copies are **not migration targets**.

### 6.2 Prove canonical banks are clean and pre-existing normalization is clean

Before edits:

- require no staged or unstaged diff in the exact 13 canonical files;
- record the opening HEAD and SHA-256 of each canonical file;
- prove each target bank byte matches its `HEAD:<path>` blob;
- run the existing pre-R2 normalizer in dry-run mode against the exact 13 paths.

Expected normalizer result: **zero presentation components would change** under the pre-existing contract.

If canonical bank bytes are already dirty or existing unrelated normalization drift is present, stop with:

`ORDERED_RESPONSE_SHUFFLE_BLOCKED_PREEXISTING_PRESENTATION_DRIFT`

Do not absorb unrelated presentation debt into this commission.

## 7. Phase B — code first, then freeze the unchanged-bank R2 census

Sections 4–5 and focused tests may now be implemented, but **canonical bank files remain read-only throughout this phase**.

### 7.1 Freeze a complete ordered-response inventory

Create a read-only inventory under:

`audit/ordered-response-shuffle-quality-floor-2026-09-11-r3/`

The inventory must recursively cover every bundled top-level ordered-response item and every ordered-response embedded case-study part. Existing `flattenQuestions` architecture may be reused where appropriate; do not invent a second population definition.

Record at least:

- bank path;
- parent case ID when applicable;
- question/part ID;
- option count;
- current presented option-ID order;
- correct option-ID order;
- fixed-position count/fraction;
- allowed maximum;
- inversion count;
- normalized Kendall distance;
- each R2 limb PASS/FAIL;
- combined floor PASS/FAIL;
- opening canonical-bank hashes from Phase A.

The inventory must verify all 13 banks still equal their Phase-A hashes before it freezes the authorized set.

### 7.2 Freeze the exact authorized migration set

The authorized canonical migration set is **exactly the items that fail either R2 limb in the unchanged live inventory**.

No additional ordered-response item may have its canonical option order changed merely to improve aesthetics, entropy, Kendall distance beyond the floor, or template diversity.

### 7.3 Transitional audit proof

Run the new mechanical audit against the still-unmigrated canonical banks. It must fail exactly for the frozen R2 violation set: no extra violation, no omitted violation.

If reconciliation fails, stop with:

`ORDERED_RESPONSE_SHUFFLE_BLOCKED_AUDIT_INVENTORY_DISAGREEMENT`

This expected transitional failure is evidence that the new gate detects the frozen defect set; it is not a final acceptance result.

### 7.4 Pre-write whole-corpus forecast and N=3/template pressure proof

Before writing banks, apply the new normalizer **in memory/read-only** to the exact canonical population and run the existing ordered-response `scramble_depth` and `template_repetition` analyses on the forecast result.

The receipt must report:

- live ordered-response population by `N=3/4/5/6`;
- exhaustive admissible-permutation counts from §3.4;
- opening vs forecast global mean Kendall;
- opening vs forecast global top-template share;
- opening vs forecast per-bank `scramble_depth` and `template_repetition` verdicts.

Apply the existing governance distinction exactly:

- **`scramble_depth` remains mechanical.** If any per-bank or global `scramble_depth` verdict worsens from non-FAIL to FAIL, stop with:

  `ORDERED_RESPONSE_SHUFFLE_BLOCKED_SCRAMBLE_PRESSURE`

- **`template_repetition` remains distributional.** Record every per-bank opening→forecast verdict and share, but a per-bank PASS→FAIL transition is an advisory authoring-hygiene finding under P16 and does **not** block this migration. If the **global** `template_repetition` verdict worsens from non-FAIL to FAIL, stop with:

  `ORDERED_RESPONSE_SHUFFLE_BLOCKED_GLOBAL_TEMPLATE_PRESSURE`

The second independent pre-dispatch review observed the expected advisory case in `hard-cases-canonical.json` under the pinned retry seed while the global template population remained PASS. Treat those reported counts as orientation only; the implementation seat must re-derive them from the clean launch baseline.

Do not retune `0.35`, `0.15`, or any other threshold inside this commission to make the forecast pass. Do **not** change the retry seed prefix merely to fit today's corpus or suppress a per-file template advisory: that would overfit deterministic presentation to current bank composition and would contradict the P16 distinction this forecast is meant to preserve.

## 8. Phase C — one-time canonical presentation migration

After Phase A and Phase B succeed, this work order authorizes one deterministic canonical presentation migration.

### 8.1 Post-code dry run

Run `normalize-presentations` in dry-run mode against the exact 13 canonical paths.

The proposed change set must be exactly the frozen R2 violation set and only `ordered_response.options` array order may move.

### 8.2 Exact write scope

Run the write form against the **same explicit 13 paths**. Do not use an unqualified default glob for the migration receipt.

The write is authorized to change only the `options` array order of ordered-response items in the frozen R2 violation set.

If the dry run or write proposes any of the following, stop with:

`ORDERED_RESPONSE_SHUFFLE_BLOCKED_MIGRATION_SCOPE_DRIFT`

Blocking drift includes:

- an MC or SATA option-order change;
- a dropdown-cloze or matrix presentation change;
- an ordered-response item outside the frozen violation set changing order;
- any learner-facing string change;
- any `correct` sequence change;
- any rationale/reference/scoring change;
- any ID, stage, anchor, visual, source, topic/category, metadata, count, or schema-version change;
- any nested raw/staged/archive/audit file write.

Do not hand-edit canonical JSON and do not write ID-specific repair patches.

### 8.3 Rollback contract

Because Phase A requires all 13 canonical files to match the recorded opening HEAD blobs, rollback is exact and narrow.

If the post-write preservation proof fails before acceptance:

1. identify only canonical files changed by this commission;
2. restore only those files from the recorded Phase-A HEAD using exact path-scoped Git restore or byte-equivalent restoration;
3. verify their SHA-256 values return to the recorded opening hashes;
4. leave all source/test/audit work and unrelated worktree changes untouched;
5. stop and report the failed proof.

Never use a broad `git checkout -- banks/` / `git restore banks/` that could destroy unrelated work.

## 9. Positive preservation proof

After migration, produce a parsed-object before/after proof independent of textual diff inspection.

For every bundled bank, prove:

- top-level question IDs/order unchanged;
- case-study parent IDs and embedded part IDs/order unchanged;
- all `correct` payloads unchanged;
- every option object unchanged by ID and only authorized ordered-response option arrays differ in sequence;
- all stems, option text, cloze text, rationales, `byChoice`, strategies, glossaries, sources, metadata, stages, exhibits, stage anchors, visuals, scoring fields, and schema versions unchanged;
- `meta.count` unchanged;
- every non-authorized question object deep-equal before/after;
- every authorized question becomes deep-equal after canonicalizing only its `options` array by ID.

The preservation checker fails on any extra changed leaf.

Record the complete authorized-ID list and per-bank before/after hashes in the audit receipt.

## 10. Post-migration acceptance conditions

After the write:

1. the complete R2 inventory reports **zero item-scramble-floor violations**;
2. `ordered_response / item_scramble_floor` PASSes in the aggregate audit;
3. existing `ordered_response / scramble_depth` and `template_repetition` remain present with the same thresholds; no per-bank/global mechanical `scramble_depth` verdict regresses to FAIL, and the global `template_repetition` verdict does not regress to FAIL; per-file template advisories are recorded but are not acceptance blockers;
4. raw promotion previews and direct `shuffle()` both use the shared constrained helper;
5. no hand-maintained list of legacy bad IDs exists in production tooling;
6. attempt 0 preserves the old normalized presentation for every item that was already R2-compliant.

## 11. Required focused regressions

### 11.1 `scripts/tests/shuffle.ts`

Extend the existing shuffle suite to cover ordered response directly.

Required cases:

- structural validation for supported `N=3,4,5,6` and fail-closed rejection outside the supported range / mismatched ID sets;
- deterministic equality for a fixed item/seed;
- input object/arrays not mutated;
- option-ID set preserved;
- each option's bilingual/content payload travels intact with its ID;
- `correct` unchanged;
- `rationale.byChoice` behavior preserved exactly for attempt-0-compatible fixtures and refId-aligned after retries;
- every result satisfies both R2 limbs;
- a fixture/seed whose legacy attempt 0 already passes yields exactly the legacy `deterministicShuffle` result;
- a fixture/seed whose legacy attempt 0 fails is deterministically retried and repaired;
- retry seed encoding is pinned to `JSON.stringify(["ordered-response-quality-v2", baseSeed, attempt])`;
- retry-cap error contains the required diagnostics;
- exhaustive enumeration of all permutations for `N=3,4,5,6` reproduces admissible counts `3,12,88,528` respectively;
- a broad deterministic synthetic-ID sweep exercises all supported option counts, finds no retry-cap exhaustion, and satisfies both limbs for every sample;
- an ordered-response embedded inside a case study is recursively protected;
- MC, SATA, bowtie, and dropdown behavior covered by existing tests remains unchanged.

### 11.2 `scripts/tests/presentation-normalization.ts`

Add assertions that:

- ordered-response normalization is input-order independent;
- normalization is idempotent;
- normalized ordered-response presentation satisfies both R2 limbs;
- `correct` and semantic projection remain unchanged;
- an already-good attempt-0 fixture preserves its pre-change normalized order exactly;
- a bad attempt-0 fixture moves only the option array order needed to clear R2;
- MC/SATA/dropdown/matrix output is byte/behaviorally unchanged by this commission.

### 11.3 `scripts/tests/non-mcq-bias.ts`

Add focused audit cases proving:

- a single over-fixed ordered-response item fails `item_scramble_floor` even when mean-Kendall `scramble_depth` is `INSUFFICIENT` at n=1;
- a single low-Kendall item with acceptable fixed-position count also fails;
- a compliant single item passes;
- complete violation metrics and failed-limb labels are correct;
- embedded ordered-response parts participate through the existing population traversal;
- per-bank/global inheritance continues under existing audit architecture;
- existing mean-Kendall and template-repetition thresholds/verdict mechanics are unchanged;
- audit version is `2.2.0` and no new fixed-position config knob was added.

### 11.4 Raw-gate/promotion regressions

Extend existing raw-gate/promote tests so deliberately weak raw ordered-response candidates:

- one failing fixed positions;
- one failing only item-level Kendall;

are transformed into R2-compliant exact promotion previews while preserving clinical/answer semantics and requiring no hand edit merely to repair presentation.

Use the existing package scripts:

- `npm run test:shuffle`
- `npm run test:presentation-normalization`
- `npm run test:non-mcq-bias`
- `npm run test:raw-gate`
- `npm run test:promote`
- `npm run test:consolidate`

## 12. Full verification floor

Because this commission changes promotion eligibility and canonical learner-facing presentation order, final verification is broader than an ordinary audit-tool edit.

Required final checks after migration:

1. all focused tests in §11;
2. `npm run test:grading`;
3. `npm run test:schema-bank`;
4. `npm run validate-bank -- banks/*.json`;
5. `npm run audit` — final exit 0 subject only to already-admitted unrelated advisory/insufficient findings; the new R2 floor itself must PASS;
6. `npx tsc -b --pretty false`;
7. `npm run census:check`;
8. `npm run build`;
9. `git diff --check`;
10. positive preservation proof from §9;
11. final complete ordered-response re-inventory proving zero R2 violations;
12. final existing scramble/template verdicts reconciled against the Phase-B forecast.

### Census rule

This migration changes only presentation order. It must not change population, schema composition, IDs, categories, item types, visual counts, or any other census-owned substantive content.

Therefore:

- run `npm run census:check` only;
- if it passes, do not run `npm run census`;
- if it fails, stop and investigate. A stale census is not permission to refresh provenance as part of this commission.

## 13. Ledger and history handling

Because canonical learner-facing presentation arrays change, append a narrowly scoped `BANK-REVIEW-LEDGER.md` maintenance entry recording:

- deterministic presentation normalization under P1/P16;
- exact number/IDs of ordered-response items whose option order changed;
- both R2 quality limbs used;
- no clinical content, bilingual content, key, rationale, scoring, or review status changed;
- preservation proof and verification receipt location.

Do not describe the migration as a new content review or fresh promotion.

Do not publish a `PROJECT-HISTORY.md` completion milestone from an unaccepted implementation branch. The post-review publishing/merge seat records accepted implementation after conformance review.

## 14. Independence / review boundary

No new semantic content judgment is required to decide option permutations. This is deterministic presentation mechanics with a machine-checkable null under P2/P3.

However, P2's spec-conformance rule still applies:

- Codex may implement and mechanically verify the commission;
- Codex may not certify conformance to this architect-authored spec;
- the GPT-5.6 Sol architect seat that authored this work order performs final spec-conformance review from the live diff/evidence package.

If implementation unexpectedly requires semantic/content judgment, source reinterpretation, or a change to a correct sequence, stop and route that item outside this commission.

## 15. Explicit non-goals

Do **not**:

- change `correct` arrays;
- change ordered-response partial-credit policy or grading;
- alter stems/options/rationales/translations/sources;
- increase or reduce ordered-response option-count schema limits;
- change MC/SATA/dropdown/matrix/bowtie presentation rules;
- add runtime reshuffling on every session or page load;
- make presentation nondeterministic per learner/session;
- introduce an API/model call;
- regenerate questions merely to improve displayed order;
- repair template-repetition/content-distribution findings by shuffling beyond the exact R2 item floor;
- tune or cycle retry-seed prefixes against the current corpus merely to suppress a per-file distributional advisory;
- alter the existing `0.35` population mean-Kendall value;
- add a new config knob for the fixed-position formula;
- add a third LIS/rotation/run-length quality metric in this commission;
- hand-patch the forcing Question Forge item or legacy weak items by ID;
- manufacture clinical/bilingual re-review findings from this purely mechanical migration;
- mix UX or burn-map implementation into this commit.

The learner should still see a stable promoted presentation for a given item until a future explicitly versioned presentation policy changes it.

## 16. Escalation / stop conditions

Stop the affected work and report before proceeding if:

- the current ordered-response schema no longer uses 3–6 options with a complete `correct` permutation;
- promotion no longer passes through both `shuffle()` and `normalizeBankPresentations()` as described;
- the exact canonical file list has drifted and is not first reconciled;
- canonical bank files are dirty before the commission write;
- preflight discovers unrelated presentation-normalization drift;
- the new audit's violation set disagrees with the frozen unchanged-bank inventory;
- deterministic retries cannot satisfy R2 within the finite ceiling;
- forecast creates a new per-bank or global mechanical `scramble_depth` FAIL;
- forecast creates a new **global** `template_repetition` FAIL;
- implementation treats a per-file `template_repetition` advisory as a migration blocker contrary to P16;
- migration proposes changes outside the frozen violation set or exact file scope;
- preservation proof finds any semantic/scoring/bilingual/non-presentation leaf change;
- census moves;
- a required repair would need clinical/source judgment;
- implementation would require schema, grading, storage, renderer, or runtime-network changes.

Do not broaden scope because an adjacent shuffle or bias issue is convenient to repair.

## 17. Completion receipt

Return a concise receipt containing:

- source HEAD/worktree used;
- files changed;
- exact R2 predicate and shared-constant ownership;
- exact retry-seed encoding;
- pre-change canonical-clean proof and existing-normalizer dry-run result;
- pre-mutation ordered-response population count and counts by N;
- complete R2 violation count and inventory path;
- exhaustive admissible-permutation counts for N=3–6;
- opening/forecast/final Kendall and template verdict summary, separating per-bank mechanical `scramble_depth`, per-bank advisory `template_repetition`, and the standalone global template verdict;
- confirmation that attempt 0 preserved prior normalized order for every already-compliant item;
- exact number of canonical ordered-response option arrays migrated, by bank;
- before/after hashes for every changed bank;
- positive preservation-proof result;
- final zero-violation inventory result;
- non-MCQ audit version `2.2.0` and final floor verdict;
- all verification commands/results;
- census-check result and confirmation that census regeneration was not performed;
- ledger-entry path/section;
- confirmation that unrelated UX/burn-map/worktree state was untouched;
- any source drift, unexpected finding, rollback, or blocked item.

Do not claim content re-review, clinical re-certification, or a corpus-quality improvement beyond the exact R2 ordered-response presentation invariant proved here. R3's additional claim is only that forecast blocking now matches the existing P16 mechanical-versus-distributional authority boundary.

**Implementation-ready terminal after all required checks:**

`ORDERED_RESPONSE_SHUFFLE_QUALITY_READY_FOR_ARCHITECT_CONFORMANCE`
