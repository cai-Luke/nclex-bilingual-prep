# Campaign 16 typed-baseline support — architect handoff

**Disposition requested: verification routing for a stopped, uncommitted implementation. This is not a readiness or acceptance packet.**

## 1. Governing scope and live snapshot

Read `AGENTS.md`, then the frozen governing order:

`scratch/CAMPAIGN-16-PHASE-E-TYPED-BASELINE-SUPPORT-IMPLEMENTATION-WORK-ORDER-2026-09-08-R2.md`

Repository: `/Users/holemini/Desktop/Project Shrimp`.

- Disk-reading producer: Codex primary seat; no subagents or delegated implementation/review.
- Branch: `main`; upstream: `origin/main`.
- HEAD: `3286024bcab90c1a114811a7202d956c3e586bf4`.
- The worktree was heavily dirty before the commission. Opening worktree bytes, not HEAD, remain the preservation reference.
- These implementation edits are local and uncommitted. A GitHub-only seat cannot inspect them; supply the local artifacts/diff through an owner-approved handoff or use a disk-reading seat. This packet does not authorize committing or pushing.

The handoff preparation rechecked live hashes: no implementation drift since the stopped manifest, and no protected opening-path drift. No implementation was resumed while preparing this handoff.

## 2. Exact reason for the stop

After focused tests passed, the producer attempted to open the isolated synthetic PreviewLab fixture at:

`file:///Users/holemini/Desktop/Project%20Shrimp/audit/campaign-16-phase-e-typed-baseline-support-implementation-2026-09-08-r1/typed-ui.html`

The computer-use tool rejected navigation under its browser URL security policy. The returned instruction explicitly prohibited workarounds, indirect execution, raw browser control, alternate browser surfaces, or policy circumvention.

This was **not** a browser-concurrency problem caused by Luke using Chrome. It was also **not** an observed application rendering failure: the page was blocked before it could be inspected.

Precision matters: the rejected page was the synthetic UI fixture, not a newly built production artifact. `npm run build` had not yet been run during this commission, and the required production `dist/index.html` file smoke was not attempted or completed. The producer treated the unavailable mandatory smoke as a stop and halted further implementation/verification, then recorded preservation receipts.

The architect should adjudicate the verification routing and the scope of that stop. Browser-tool restrictions cannot be overridden by a repository work order. An HTTP preview or React server render must not be relabeled as a production `file://` compatibility pass.

## 3. Implementation present on disk

The implementation manifest lists exact changed paths and hashes. The work currently includes:

- New React-free `src/caseVisibilityBoundary.ts`: exact baseline predicate, independent primary/legacy classification, effective resolution, feature detector, and diagnostic formatter.
- `src/examLayout.ts` delegates stage selection to that shared resolver. Typed baseline yields no declared stages; ordinary strings retain declared-stage matching, legacy fallback, and P23 fail-open behavior.
- `src/types.ts` and `src/schema.ts` support 2.1 and the typed union. Core validation rejects malformed objects; the bank floor is 2.1. `SCHEMA_VERSION` remains 2.0.
- `src/bankImport.ts` infers 2.1 before older export floors when a case contains typed baseline.
- `src/App.tsx` formats the primary boundary safely in Developer Preview. Existing split, controlled stacked, and show-all paths needed no layout rewrite.
- Stage-reference audit recognizes baseline while independently reporting bad legacy references. Raw-gate fatality remains unchanged; its success wording now refers to visibility boundaries.
- The single-row survey carries the union. The unknown-key scanner has a narrow nested `kind` key surface; core validation remains authoritative.
- Schema documentation and the four unsupported-version fixture sites were updated. Unsupported-version fixtures now use 2.2 where appropriate.
- New focused synthetic tests cover the support contract. No library preservation edit was necessary: existing shuffle/normalization/preview/consolidation behavior preserved the typed object in focused tests.

`src/reviewPrompt.ts` was unchanged: it already consumes the visibility adapter, and the focused test verifies baseline title/summary/global content without staged exhibits.

No live bank, canonical floor, census artifact, ledger, governance file, GeminiPrompt.md, parked repair order, or frozen evidence was changed. No row in the frozen 451 population received a semantic assignment. The optional P15 fixture was not exercised.

## 4. Evidence completed

All four required preflight commands passed before implementation:

```bash
npm run validate-bank -- banks/*.json
npm run audit
npm run census:check
TMPDIR=/tmp/ npm run test:audit-stage-refs
```

Post-edit focused evidence:

- `npx tsc -b --pretty false` passed.
- `scripts/tests/typed-baseline.ts` passed resolver, malformed-value, schema-floor, import/export, review-prompt, audit, shuffle/normalization, raw policy, promotion CLI, consolidation, and 2.0/2.1 compatibility fixtures.
- `scripts/tests/typed-baseline-ui.ts` passed server rendering of the actual private CaseStudyControl and PreviewLab components: baseline context, no Updates, safe diagnostics, controlled stacked, show-all override, and unscoped overview. Its isolated Vite bank glob stub is documented; this is not browser or production-build evidence.
- `scripts/tests/typed-baseline-scanner.ts` passed an explicit isolated invocation of the scanner CLI, including nested-extra and misplaced-kind negatives.
- The stopped stage-reference capture exactly equals the opening capture: **451 findings**, with the same full finding objects and aggregate result/detail.
- Preservation checks passed against opening bytes: all 16 files in the bank tree and protected/unrelated opening paths were unchanged; no unauthorized untracked paths were detected.

The initial dedicated-test run used the wrong importer argument shape and failed in the fixture. The test invocation was corrected and rerun successfully; no production behavior was changed to accommodate it.

## 5. What remains unverified

The full post-change §O suite was not run. Passing focused tests or preflight does not replace it. The added single-row survey assertion and new schema-bank default-version assertions have not yet been executed through their required existing suites.

After an authorized resumption, run the entire required §O sequence against the final live inputs:

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

npx tsx scripts/tests/typed-baseline.ts
npx tsx scripts/tests/typed-baseline-ui.ts
npx tsx scripts/tests/typed-baseline-scanner.ts

npm run validate-bank -- banks/*.json
npm run audit
npm run census:check
npx tsc -b --pretty false
npm run build
git diff --check
```

Then obtain the required actual production `file://` smoke through a permitted verification arrangement. Bind that evidence to the built artifact and exact final source snapshot. Refresh the stage-reference comparison and opening-byte preservation checks after all work. Update the commission receipts with command, exit code, result, and any applicable evidence limitations.

Do not run census regeneration. Do not commit, push, merge, stash, reset, clean, or switch branches/worktrees. Do not restart preservation from HEAD or discard the original opening manifest.

## 6. Requested architect disposition

Please determine a narrowly scoped continuation that:

1. Allows the producer to complete the remaining non-browser verification while preserving all R2 scope and stop conditions.
2. Specifies how Luke or a separately permitted verification seat can provide the required production file smoke, without directing this blocked browser tool to bypass its policy. Specify the evidence and artifact identity needed to accept that receipt. If this changes the frozen acceptance process, obtain the required owner disposition rather than silently weakening it.
3. Keeps the implementation unaccepted until all required checks pass and any remaining conformance issues are resolved within the authorized surface.
4. Routes subsequent independent conformance review to a genuinely independent seat under §U/P2. This handoff, the producing seat, and any fresh producer context do not satisfy that gate.

The implementation has not been proven complete. No readiness token was emitted. No owner closure, merge, deployment, or bank publication is claimed.

## 7. Receipt entry points

All paths below are within this commission output directory:

- `opening-state.json` — original branch/HEAD/status, untracked inventory, opening hashes.
- `implementation-manifest.json` — stopped implementation paths/hashes and intended scope.
- `boundary-truth-table.json` — executed synthetic resolver cases.
- `version-fixture-sweep.json` — exact unsupported-token fixture edits.
- `test-results.json` — recorded command outcomes and browser-policy blocker.
- `opening-stage-reference-audit.json` and `stopped-stage-reference-audit.json` — exact comparison population and details.
- `bank-preservation.json` and `preservation.json` — opening-byte preservation checks.
- `verification.md` and `closeout.md` — stopped status and incomplete verification.
