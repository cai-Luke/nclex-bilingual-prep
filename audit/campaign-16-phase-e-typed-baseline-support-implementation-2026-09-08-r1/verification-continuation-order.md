# CAMPAIGN 16 — TYPED BASELINE SUPPORT VERIFICATION CONTINUATION ORDER

**Date:** 2026-09-08
**Governing work order:** `scratch/CAMPAIGN-16-PHASE-E-TYPED-BASELINE-SUPPORT-IMPLEMENTATION-WORK-ORDER-2026-09-08-R2.md`
**Disposition:** **CONTINUE VERIFICATION ONLY — NO R2 AMENDMENT — NOT YET ACCEPTED**

## 1. Architect disposition on the stop

The producer's stop was correct.

The browser policy refusal prevented the producing seat from performing a mandatory `file://` compatibility observation through that specific browser tool. It did **not** establish a product failure, implementation defect, or architectural defect.

The frozen R2 requirement remains unchanged:

> the final built production artifact must receive an actual `file://` compatibility smoke.

R2 does **not** require that the producer's own browser tool be the witness.

Therefore:

* do not retry the prohibited browser route;
* do not attempt a workaround, alternate automation surface, raw browser control, or policy circumvention;
* do not substitute HTTP preview, SSR, Vite serving, or synthetic fixture rendering for the production `file://` smoke;
* do not weaken or waive the smoke requirement.

A separate permitted witness may perform the required observation against the exact final production artifact.

This is verification routing under the existing frozen contract, not an amendment to R2 and not an acceptance exception.

---

## 2. Producer continuation authority

The existing Codex/Astra producing seat is authorized to resume the stopped commission for the **remaining verification and any strictly in-scope correction required by a failing mandatory check**.

All original R2 scope, mutation limits, stop conditions, preservation requirements, and independent-review requirements remain binding.

The original:

`opening-state.json`

remains the preservation baseline.

Do **not**:

* establish a new opening baseline from the stopped state;
* compare preservation against HEAD instead of opening worktree bytes;
* discard or rewrite the original opening manifest;
* commit;
* push;
* merge;
* stash;
* reset;
* clean;
* switch branches;
* switch worktrees;
* regenerate census;
* modify any live bank;
* perform semantic assignments among the frozen 451 rows.

Before resuming, confirm that the current implementation source/test/document hashes still match the stopped implementation manifest. If unexplained implementation drift has occurred since the handoff, stop and report it.

---

## 3. Complete the remaining mandatory test sequence

Run the entire remaining §O sequence against the live final implementation inputs.

At minimum:

```bash
npm run test:schema-bank
TMPDIR=/tmp/ npm run test:audit-stage-refs
npm run test:raw-gate
npm run test:exam-layout
npm run test:review-prompt
npm run test:single-row-lab-panels
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

Then rerun the dedicated commission suites:

```bash
TYPED_BASELINE_RECEIPTS=audit/campaign-16-phase-e-typed-baseline-support-implementation-2026-09-08-r1 \
  npx tsx scripts/tests/typed-baseline.ts

npx tsx scripts/tests/typed-baseline-ui.ts
npx tsx scripts/tests/typed-baseline-scanner.ts
```

Record exact commands, exit codes, and concise results.

The earlier failed `typed-baseline.ts` invocation caused by the fixture's incorrect importer argument shape remains part of the historical receipt. Do not erase it; the successful corrected rerun is the resolution.

If any mandatory check fails:

* diagnose it;
* correct it only if the correction lies inside R2's authorized mutation surface and does not cross a stop condition;
* rerun all verification whose inputs or conclusions were affected.

If correction requires out-of-scope mutation, governance change, bank change, census regeneration, semantic assignment, or another §S stop condition, stop and report rather than widening scope.

---

## 4. Run the final schema/data-contract path

After the focused and existing suites are green, run:

```bash
npm run validate-bank -- banks/*.json
npm run audit
npm run census:check
npx tsc -b --pretty false
npm run build
git diff --check
```

`npm run census` remains forbidden.

### Generated build output

The mandatory `npm run build` is expressly required by R2 and AGENTS.

Therefore creation or replacement of:

```text
dist/**
```

by the repository's normal build command is authorized as **verification output**.

This does not authorize direct editing of `dist/**`, adding handcrafted production files there, or treating generated output as a new source mutation surface.

---

## 5. Freeze the production artifact identity

Immediately after the final successful `npm run build`, and before the external `file://` witness is accepted, create a production-build identity receipt under the existing commission output root.

Suggested name:

```text
production-file-smoke-build-identity.json
```

It must contain at least:

1. branch;
2. HEAD;
3. statement that the worktree remains uncommitted;
4. exact successful build command and exit code;
5. SHA-256 of `dist/index.html`;
6. a deterministic SHA-256 manifest of the complete final `dist/**` tree, keyed by sorted relative path;
7. a digest or hash manifest of every final authorized changed/new source, test, and schema-document file that produced that build;
8. a stable aggregate build-identity digest derived from the recorded production tree manifest;
9. timestamp of capture.

Hashing only `dist/index.html` is insufficient because the page depends on its generated JS/CSS/assets. The complete production tree must be bound.

No source, test, or application code may change between this build-identity capture and the accepted smoke without invalidating that smoke.

Receipt-only edits under the commission output root do not invalidate the production artifact if they do not alter build inputs.

---

## 6. Route the actual production `file://` smoke

The required smoke may be performed by either:

* **Luke manually on the Mac mini**, or
* another local/disk-capable verification seat whose permitted browser environment can open `file://` URLs.

Do not ask the blocked producer browser tool to bypass its policy.

The witness must open the actual built production file:

```text
/Users/holemini/Desktop/Project Shrimp/dist/index.html
```

directly as a local file, producing a `file://.../dist/index.html` navigation.

Do not use:

* `npm run dev`;
* `npm run preview`;
* localhost;
* an HTTP server;
* the synthetic `typed-ui.html` fixture

as substitutes for this check.

### Minimum smoke observations

The witness must establish all of the following:

1. the page opens from the actual local `file://` URL;
2. the application shell renders rather than remaining blank or fatally failing;
3. bundled application data/question content loads;
4. at least one ordinary interactive/navigation action works, sufficient to establish that the generated JS and application assets executed under `file://`;
5. there is no observed path/module/asset loading failure that prevents normal use of the built app.

This smoke verifies **production file compatibility**, not typed-baseline clinical semantics. No live bank contains a typed-baseline repair under this commission.

A screenshot may accompany the receipt, but a screenshot alone is not sufficient evidence.

---

## 7. Required external smoke receipt

Record the external witness result under the commission output root, suggested:

```text
production-file-smoke-receipt.json
```

The receipt must identify:

* witness: Luke or named verification seat;
* date/time;
* exact absolute local path opened;
* resulting `file://` URL if available;
* browser/application used and version if readily available;
* PASS or FAIL;
* concise observations for each required smoke criterion;
* the exact aggregate production build-identity digest from `production-file-smoke-build-identity.json`;
* SHA-256 of `dist/index.html`;
* statement that the observed artifact was the build identified by that receipt.

If the witness cannot confirm that the inspected artifact matches the recorded final build identity, the smoke is not admissible.

If any build input changes after a passing smoke:

1. rerun affected tests;
2. rerun `npm run build`;
3. generate a new build identity;
4. repeat the production `file://` smoke.

---

## 8. Witness role is not the P2 checker role

The production-file witness supplies one required verification observation.

That role does **not** by itself:

* accept the implementation;
* perform implementation conformance review;
* satisfy P2;
* authorize merge or deployment.

Likewise, serving as the file-smoke witness does not automatically disqualify an otherwise independent checker. Independence remains governed by §U/P2.

The producer, its delegation tree, or a fresh producer context still cannot satisfy the independent implementation-check requirement.

---

## 9. Final producer verification after the smoke

After all code/tests are final and the production smoke has passed, refresh the commission's closing evidence.

At minimum:

1. recapture the aggregate stage-reference audit against the final implementation;
2. prove exact equality to the original opening population and details:

   * expected finding count: **451**;
   * no live-bank interpretation drift;
3. rerun bank-tree preservation against the **original opening-worktree hashes**;
4. rerun protected/unrelated-path preservation against the original opening manifest;
5. confirm zero unauthorized untracked paths outside the authorized commission/source/test/build surfaces;
6. confirm branch and HEAD remain unchanged;
7. update final implementation hashes;
8. update:

   * `implementation-manifest.json`;
   * `test-results.json`;
   * `bank-preservation.json`;
   * `preservation.json`;
   * `verification.md`;
   * `closeout.md`;
   * production build/smoke receipts.

The stopped-state evidence remains historical evidence and should not be deleted or rewritten to imply that the stop never occurred.

---

## 10. Readiness terminal

Only when all of the following are true:

* every mandatory existing suite passes;
* every dedicated typed-baseline suite passes;
* final bank validation passes;
* aggregate audit passes;
* census check passes without regeneration;
* TypeScript compilation passes;
* production build passes;
* `git diff --check` passes;
* the actual final production artifact passes the bound `file://` smoke;
* final stage-reference population/details equal opening;
* all R2 preservation gates pass;
* no unresolved in-scope conformance failure remains;

may the producer change the commission status to ready and emit exactly:

`CAMPAIGN16_TYPED_BASELINE_SUPPORT_READY_FOR_INDEPENDENT_CHECK`

This terminal means only that the producer packet is ready for external conformance review.

It does not mean owner acceptance, merge approval, deployment approval, bank publication, or completion of the 451-row repair.

---

## 11. Independent implementation-conformance review

After the readiness terminal, route the final live implementation to a genuinely independent seat under R2 §U / P2.

Because the implementation remains uncommitted, prefer a **disk-reading checker** capable of inspecting:

* frozen R2 directly;
* the final live source diff;
* new source/test files;
* commission receipts;
* original opening-state preservation evidence;
* final build/smoke binding.

A GitHub-only checker cannot establish conformance to uncommitted local implementation merely from producer summaries.

The independent checker must derive conformance itself and may use producer receipts only as evidence, not proof.

Claude is an eligible implementation-conformance seat under the existing frozen routing so long as it is operating independently of the producing seat and not in its delegation tree.

No commit, push, merge, deployment, or bank publication is authorized by this continuation order.
