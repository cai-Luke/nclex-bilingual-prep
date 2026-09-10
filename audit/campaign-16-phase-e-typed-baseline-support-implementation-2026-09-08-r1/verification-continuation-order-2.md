# CAMPAIGN 16 — TYPED BASELINE SUPPORT VERIFICATION CONTINUATION ORDER 2

**Date:** 2026-09-08
**Governing order:** `scratch/CAMPAIGN-16-PHASE-E-TYPED-BASELINE-SUPPORT-IMPLEMENTATION-WORK-ORDER-2026-09-08-R2.md`
**Prior continuation:** production `file://` verification-routing continuation
**Disposition:** **PRE-EXISTING SURVEY DRIFT ADMITTED FOR THIS COMMISSION — CONTINUE VERIFICATION — NOT YET ACCEPTED**

## 1. Owner/architect disposition

The failure of:

```bash
npm run test:single-row-lab-panels
```

at the existing saved-manifest equality assertion is adjudicated as a **pre-existing repository baseline defect unrelated to the typed-baseline implementation**.

This conclusion is supported by the producer's read-only reconstruction evidence:

* opening implementation generated survey SHA-256:
  `6e4a5cc93a4f943f75d91fc1707bad44abf5ebd376e843ee5dc21d9072f398dc`
* current typed-baseline implementation generated survey SHA-256:
  `6e4a5cc93a4f943f75d91fc1707bad44abf5ebd376e843ee5dc21d9072f398dc`
* protected saved survey manifest SHA-256:
  `f042bd39094e543ab30d6a6dd87081b1ebdead6d7182fa07711ebb53d0552942`

The reconstruction used original generator/schema/allowed-key source bytes whose hashes were verified against the commission's original opening manifest and unchanged opening bank bytes.

Therefore:

```text
OPENING_GENERATED == CURRENT_GENERATED
OPENING_GENERATED != SAVED_MANIFEST
```

The failing equality assertion does not distinguish opening state from the typed-baseline implementation and cannot be attributed to this commission.

The documented 40 field differences are existing corpus/saved-artifact drift. This commission makes no adjudication about whether those content changes or the saved survey artifact should ultimately prevail.

---

## 2. What this disposition does not authorize

Do **not**:

* refresh `audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json`;
* edit that historical survey artifact;
* change any live bank;
* regenerate census;
* weaken, delete, skip, conditionalize, or change the meaning of the saved-manifest equality assertion;
* alter the survey generator merely to reproduce the stale saved artifact;
* call `npm run test:single-row-lab-panels` a passing suite;
* conceal its exit code;
* broaden this exception to any other failing command.

The protected July survey manifest remains byte-identical to the original opening worktree.

Its maintenance, if desired, belongs to a separate explicitly authorized commission.

---

## 3. Narrow verification exception

For **this typed-baseline support commission only**, the known failure of the existing saved-manifest equality assertion is admitted as a baseline exception because opening/current equivalence has been proven.

Record the command truthfully as:

```text
test:single-row-lab-panels
RESULT: PREEXISTING_BASELINE_FAILURE_ADMITTED
EXIT: 1
FAILURE SITE: existing saved-manifest equality assertion
TYPED-BASELINE REGRESSION: disproven by opening/current generated-survey identity
```

Do not record `PASS`.

This exception applies only to that exact failure signature and exact opening/current equivalence.

If a rerun:

* fails earlier;
* fails differently;
* produces a current generated-survey hash different from the proven opening generated hash;
* reaches an additional unrelated failure;

stop again and report it.

---

## 4. The new typed-baseline survey requirement remains mandatory

R2 N.7 still requires executable proof that the single-row survey preserves:

```json
{ "kind": "baseline" }
```

as an object rather than coercing it to string/null.

The new assertion currently appears after the pre-existing equality assertion and therefore was not reached by the mandatory suite.

That coverage must be obtained separately.

Preferred minimal route:

* move **only the newly added typed-baseline synthetic assertion block** to a point before the pre-existing saved-manifest equality assertion; or
* place that same new synthetic assertion in a dedicated directly relevant `scripts/tests/**` typed-baseline survey fixture.

Either route is already inside R2's authorized `scripts/tests/**` mutation surface.

Do not move, alter, suppress, or weaken the pre-existing equality assertion itself.

The dedicated proof must establish that evidence emitted for the embedded synthetic part contains exactly:

```json
"answerableAfterStageId": { "kind": "baseline" }
```

after the survey collection path.

Record the dedicated proof separately.

If the existing `typed-baseline.ts` suite is extended to cover this exact survey path, that is acceptable. Do not merely infer survey preservation from generic JSON round-trip tests.

---

## 5. Preserve the baseline-drift proof

Retain at least:

* `opening-survey-drift-proof.json`
* `survey-drift-diagnostic.json`

as commission evidence.

The final verification report must state that:

1. the historical survey equality gate remains red;
2. the failure existed in the opening state;
3. the typed-baseline implementation did not change the generated survey on opening/live bank inputs;
4. no historical artifact or bank was modified to force the gate green;
5. the new typed-baseline survey-object behavior was tested independently.

This is preferable to manufacturing a green suite by rewriting unrelated historical state.

---

## 6. Resume remaining mandatory verification

After obtaining the dedicated typed-baseline survey-object proof, continue from the command immediately following the stopped survey suite:

```bash
npm run test:promote
npm run test:consolidate
npx tsx scripts/tests/registry-mechanics.ts
npm run test:shuffle
npm run test:raw-bank-normalization
npm run test:presentation-normalization
npm run test:storage-category-migration
npm run test:audit-validate-bank
npm run test:validate-sweep
npm run test:rationale-visual-schema-floor
```

Then rerun all dedicated typed-baseline suites, including the survey-specific proof:

```bash
npx tsx scripts/tests/typed-baseline.ts
npx tsx scripts/tests/typed-baseline-ui.ts
npx tsx scripts/tests/typed-baseline-scanner.ts
```

Use the exact invocation/binding required by the live tests if an existing receipt-root environment argument is required.

Then run:

```bash
npm run validate-bank -- banks/*.json
npm run audit
npm run census:check
npx tsc -b --pretty false
npm run build
git diff --check
```

The production `file://` smoke routing from the prior continuation order remains fully in force.

Do not request the external witness until the final production build exists and all preceding verification other than this admitted baseline failure is resolved.

---

## 7. Recheck the survey baseline after final code state

Once implementation code is final, regenerate the survey **in memory/read-only** without writing the protected saved artifact.

Confirm again:

```text
FINAL_CURRENT_GENERATED_SHA256
==
6e4a5cc93a4f943f75d91fc1707bad44abf5ebd376e843ee5dc21d9072f398dc
```

provided the underlying opening/live bank inputs remain unchanged.

If it differs, the baseline exception is invalidated and the producer must stop.

The saved manifest must remain:

```text
f042bd39094e543ab30d6a6dd87081b1ebdead6d7182fa07711ebb53d0552942
```

unless external unrelated owner activity occurs, in which case report the drift rather than overwriting it.

---

## 8. Final acceptance accounting

The final producer packet may become ready for independent check with exactly one non-green mandatory command only if that command is this explicitly admitted pre-existing survey-manifest failure and every condition in this disposition remains satisfied.

The final matrix should distinguish:

```text
PASS
PREEXISTING_BASELINE_FAILURE_ADMITTED
FAIL
NOT_RUN
```

Do not collapse the admitted baseline failure into PASS.

All other mandatory R2 checks must pass unless a later explicit owner disposition independently adjudicates another pre-existing blocker.

The readiness terminal remains:

`CAMPAIGN16_TYPED_BASELINE_SUPPORT_READY_FOR_INDEPENDENT_CHECK`

Its meaning is unchanged: producer verification is complete enough for independent conformance review, subject to the explicitly documented survey-baseline exception.

The independent checker must independently inspect the opening/current survey-equivalence proof and decide whether this exception is supported. Producer assertion alone is not proof.

---

## 9. Preservation and independence remain unchanged

All prior preservation rules remain binding.

In particular:

* original `opening-state.json` remains the baseline;
* all `banks/**` remain byte-identical to opening;
* historical survey artifact remains untouched;
* frozen Campaign 16 evidence remains untouched;
* no census regeneration;
* no commit, push, merge, reset, stash, clean, checkout, or worktree switch;
* no frozen-451 semantic assignments.

The production `file://` witness does not satisfy P2.

The final implementation-conformance checker must still be genuinely independent of the Astra/Codex producing seat and its delegation tree.

No merge, deployment, bank publication, or owner closure is authorized by this disposition.
