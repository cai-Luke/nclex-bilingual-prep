# P5 CI Coverage Measurement Survey — Independent Checker Report

**Date:** 2026-07-23
**Seat:** Independent checker (evidence review only; no implementation authority).
**Commission:** Independent Checker Handoff — P5 CI Coverage and P3 Vital-Sanity Stage 3 (2026-07-23), PR 1.
**Producer work under review:** PR #85, branch `agent/p5-ci-coverage-survey`, head `0390ffbb2f4d24cdcd60957c98ee4baae5459ebe`.
**Frozen measured input:** `1dbd3779bc42417ce9a6c48433c4c8625201dd9d`.
**Generator commit:** `d6e6e97a2ce30e472685baec17e875508a1a9977`.
**This report is a stacked checker artifact.** It targets `agent/p5-ci-coverage-survey`, not `main`. It edits no workflow file, no runtime code, and no existing test behavior. It authorizes nothing; it records evidence and recommended owner dispositions only.

Verdict vocabulary: `PASS` / `PASS WITH CORRECTION` / `HOLD` / `NOT SUPPORTED`.

Provenance discipline: **producer claim**, **checker finding**, and **owner decision** are labeled distinctly throughout. Line/`path:line` citations resolve at the frozen input SHA `1dbd377` unless another SHA is named.

---

## 0. What the checker actually re-ran

Independent re-derivation, not prose matching:

1. **Manifest reproduced from scratch.** Created a fresh detached worktree at `1dbd377`, ran the committed generator (`scripts/ci-coverage-survey.ts`, byte-identical to `d6e6e97`) against it **twice** with `--root` at the frozen worktree.
   - Two-run determinism: `diff` of `jq 'del(.generatedAt)'` between the two runs was **empty**. Determinism claim holds.
   - Reproduction vs committed manifest: `diff` of `jq 'del(.generatedAt,.generatorGitSha)'` between my run and `audit/ci-coverage-survey-2026-07-23.manifest.json` was **empty**. Every non-volatile field — `inputGitSha`, `generatorSha256`, `inputs[].sha256`, `npmScripts`, `workflows`, and all four reachability sets — reproduced byte-for-byte.
   - `generatorSha256` reproduced identically (`4dc5798941efeeae3646246baf948fde3f9e19e469bdaf21d23027d840e26498`), independently proving the executed generator is byte-identical to the committed `d6e6e97` copy. `generatorGitSha` legitimately differed (my copy lives at a different commit that contains the same file), which is exactly the `inputGitSha != generatorGitSha` design the spec §5.4 documents.
2. **Frozen surface re-counted.** `git show 1dbd377:package.json | jq '.scripts | length'` = **97**; `.scripts["survey:ci-coverage"]` = **absent**. The task-owned script is not in the measured denominator. It is present at producer head `0390ffb`.
3. **Workflow parser checked against real YAML** at `1dbd377` (both files read in full).
4. **Aggregate tiering read at source** in `scripts/audit.ts`.
5. **Two validators read at source** (`scripts/validate-bank.ts`, `scripts/audit/validate-bank.ts`).
6. **B forcing-defect mechanism checked** via `src/vite-env.d.ts` and `src/main.tsx`.
7. **`package-lock.json` tracking and report presence checked.**
8. **Spec provenance checked** across all refs, reflog, and working tree.

Commands not executable as written by this seat: none required re-running that could not be run, **except** absolute GitHub Actions wall-clock, which this seat cannot read (same residual the producer discloses; see §Methodology).

---

## 1. Lane verdicts

### A — standalone TypeScript compilation → **PASS**

1. **Evidence independently verified.** `git show 1dbd377:package.json` gives `build = "tsc -b && vite build && tsx scripts/make-file-build.ts && npm run validate:build-info"`. Candidate B therefore begins with the exact `tsc -b` pass Candidate A proposes; B fully subsumes A's TypeScript diagnostic coverage. Candidate A's command (`npx tsc -b`) is additionally already run post-merge by `pages.yml:34` (Typecheck step). The A-cold vs A-then-B interaction timings in the report (B still costs ~4.88 s after A's warm compiler) are consistent with a duplicated compiler pass.
2. **Discrepancy.** None. The producer does not claim standalone A adds unique PR-stage coverage when B is present; it characterizes A as an earlier/faster failure boundary only.
3. **Materiality.** N/A — claim is accurate.
4. **Recommended owner disposition.** *(owner decision)* Reject a standalone A step **if B is accepted**; A adds no coverage B lacks. Retain A only if the owner explicitly wants an earlier compiler failure boundary ahead of the full build. This matches the commission's provisional leaning.
5. **Later implementation authorized by this evidence?** No. Evidence supports the owner's choice but authorizes no workflow edit.

### B — production build → **PASS**

1. **Evidence independently verified.** `build` composition (above) confirms B uniquely adds, beyond `tsc -b`: Vite resolution/transform/bundling, `scripts/make-file-build.ts` file-openable conversion, and `npm run validate:build-info`. The forcing counterexample's mechanism is sound: `src/vite-env.d.ts:1` is `/// <reference types="vite/client" />`, which ambiently declares `*.css` modules, so `import "./p5-missing.css"` **typechecks** (module ambiently typed) but **fails Vite** at build because the file does not resolve. `src/main.tsx:4` already imports `./styles.css`, so the injected line is a realistic edit. B is real PR-stage coverage today absent at PR time — it exists only post-merge (`pages.yml:39`).
2. **Discrepancy.** None.
3. **Materiality.** N/A.
4. **Recommended owner disposition.** *(owner decision)* Accept B. If accepted, a separate standalone A step is redundant.
5. **Later implementation authorized?** No — owner ratification precedes any `promotion-gate.yml` edit.

### C1 — `test:topic-population` regression → **PASS**

1. **Verified.** Body is `tsx scripts/tests/audit-topic-population.ts` — a fixture regression, not a live-corpus scan. Not reachable from either workflow (present in `unreachableFromAnyWorkflow`). The forcing counterexample (filtering out `embedded_scored_leaf` so an expected `["leaf"]` becomes `[]`) is a plausible detector regression the current gate would not catch.
2. **Discrepancy.** None.
3. **Materiality.** N/A.
4. **Owner disposition.** *(owner decision)* Accept as fixture-regression coverage.
5. **Later implementation authorized?** No.

### C2 — `test:topic-license` detector regression → **PASS**

1. **Verified.** Body is `tsx scripts/tests/audit-topic-license.ts` (fixture/detector regression). Decisive live-enforcement fact confirmed at source: in `scripts/audit.ts`, `topicLicense` is computed in the `Promise.all` but is **excluded from `blockingResults`** (only the six `tier1Results` — references, positions, integrity, ids, producer-vocabulary, authorial-constraint — plus optional mechanical bias block). It is printed under "Tier 2: advisory audits." So the aggregate's live topic-license result does not block, and this fixture test does not change that.
2. **Discrepancy.** None. The producer explicitly states C2 does not enforce live findings.
3. **Materiality.** N/A.
4. **Owner disposition.** *(owner decision)* Accept as detector-regression coverage, with the producer's explicit caveat that it does not enforce live findings.
5. **Later implementation authorized?** No.

### C3 — `test:topic-vocabulary` regression → **PASS**

1. **Verified.** Body is `tsx scripts/tests/topic-vocabulary.ts` — it imports the live topic library and checks canonical-key uniqueness / self-aliases / alias targets / licensing structure, but does **not** scan the canonical banks. The collision forcing counterexample (duplicating `TOPICS.ABG_ACID_BASE` to force a normalized-key collision) is valid. It can block a library regression, not a new live-bank topic finding — correctly stated.
2. **Discrepancy.** None.
3. **Materiality.** N/A.
4. **Owner disposition.** *(owner decision)* Accept as library-invariant coverage.
5. **Later implementation authorized?** No.

### C4 — live topic-license enforcement → **PASS** (as a correctly reported *absence*)

1. **Verified.** No forcing counterexample exists in which merely adding the three C scripts converts a new live-corpus topic-license finding into a nonzero exit, because none of the three performs a blocking live-corpus scan and the aggregate's live topic-license result is advisory (verified in `scripts/audit.ts`, above). Fixture-regression coverage is **not** equated with live-corpus enforcement — the packet keeps these distinct, and so does this checker.
2. **Discrepancy.** None. This is an explicit, honest absence, which the commission and the spec (§7.1) treat as a real finding.
3. **Materiality.** Material to the owner's mental model: accepting C1–C3 must not be read as making live clinical topic-license findings fatal.
4. **Owner disposition.** *(owner decision)* **Defer.** Live enforcement would require a separately designed command that runs the live corpus and converts WARN findings to a nonzero exit; no such command was measured and none is authorized here.
5. **Later implementation authorized?** No.

### D1 — already-guarded active artifacts → **PASS**

1. **Verified.** `census.json`/`BANK-CENSUS.md` drift is already PR-blocking via `census:check` (`promotion-gate.yml:47`). Active visual/survey baselines (`visual-parity-promoted/*`, `visual-parity.json`, `lab-trend-dual-series.json`, `vitals-trend-epic.json`, and the promoted-visual-parity survey manifest) are already exercised inside the PR-blocking `test-visuals` chain. No candidate-D command can satisfy "current PR passes, candidate catches" for these; they add no PR-stage coverage.
2. **Discrepancy.** None.
3. **Materiality.** N/A.
4. **Owner disposition.** *(owner decision)* Take no new action.
5. **Later implementation authorized?** No.

### D2 — generated topic-vocabulary drift → **PASS**

1. **Verified.** `docs/topic-vocabulary.md` is generated by `npm run export-topic-vocab` (`scripts/export-topic-vocab.ts`) and has **no** current drift guard — the only newly-eligible `LIVE_DERIVED_STATE` family. `scripts/export-topic-vocab.ts` contains no `Date`/timestamp/`now()` (grep empty), so a generate-to-temp + `cmp` byte comparison is deterministic with no volatile field. The forcing counterexample (a stale hand-inserted line making `cmp` exit 1 while the current PR gate exits 0) is valid.
2. **Discrepancy.** None.
3. **Materiality.** N/A.
4. **Owner disposition.** *(owner decision)* Accept a **narrowly scoped** temp-generation byte guard for this one family. Per §3.6 of the commission and this checker: making `docs/topic-vocabulary.md` drift PR-blocking is an **owner policy escalation** (it blocks PRs on generated-doc staleness) and it does **not** make live clinical topic-license findings fatal — that is C4, deferred. Do not auto-extend the guard to historical evidence or one-time receipts.
5. **Later implementation authorized?** No.

### Artifact-inventory completeness → **PASS WITH CORRECTION**

1. **Evidence independently verified.** The §3.4 lifecycle classification method and every family used to support a recommendation are sound: `census.json`/`BANK-CENSUS.md` and `docs/topic-vocabulary.md` as `LIVE_DERIVED_STATE`; the visual/survey baselines as `ACTIVE_BASELINE`; the dated survey manifests as `DATED_HISTORICAL_EVIDENCE`; receipts and one-time payloads as `ONE_TIME_RECEIPT`; the catch-all `UNCLEAR_REQUIRES_OWNER`. No historical evidence or one-time receipt is recommended for continuous regeneration.
2. **Discrepancy (checker finding).** `package-lock.json` is a tracked, generated dependency artifact (`git ls-files package-lock.json` → present) and appears **0 times** in the producer report. The §3.4 inventory (spec question 6.2(4): "every generated artifact that is committed") therefore has a completeness gap.
3. **Materiality.** **Low, and it does not change any Candidate D conclusion.** `package-lock.json` is `LIVE_DERIVED_STATE`, but it is **already guarded**: `npm ci` runs in *both* workflows (`promotion-gate.yml:20`, `pages.yml:31`) and fails when the lock is out of sync with `package.json`. It therefore belongs in the D1 "already-guarded, no new guard needed" class alongside census and the active baselines — not as a new D2-style candidate. Recording it strengthens inventory completeness but adds no guard recommendation.
4. **Recommended owner disposition.** *(owner decision)* Note `package-lock.json` as `LIVE_DERIVED_STATE` already guarded by `npm ci`; take no new candidate-D action for it.
5. **Later implementation authorized?** No.

### Survey methodology and provenance → **PASS**

1. **Evidence independently verified.**
   - Manifest analyzes the frozen pre-survey surface; `survey:ci-coverage` is absent at `1dbd377` and not counted. **Confirmed.**
   - `inputGitSha` (`1dbd377`), `generatorGitSha` (`d6e6e97`, distinct by design), `generatorSha256` (reproduced identically), and `inputs[].sha256` for `package.json` + both workflows all identify the correct artifacts. **Confirmed by byte-for-byte reproduction.**
   - Workflow parser accurately captures structure: the PR set's 10 scripts include the three `run: |` block-scalar lines (`promotion-gate.yml:38-41`); the main-push set's `build` closure correctly pulls in `validate:build-info`; `npx tsc -b` is correctly excluded as a raw command (not an npm script) yet noted in prose. **Confirmed.**
   - Reachability reported separately per workflow with no pooled number: 10 (PR) / 3 (main-push) / 3 (main-push-only) / 84 (unreachable); 10 + 3 + 84 = 97. **Confirmed.**
   - Two-run determinism valid; reproducible from the frozen commit. **Confirmed by empty diffs.**
   - Local Node 25.9.0 vs CI Node 22 disclosed (report §1, §6); the claims that depend on it are relative-local ordering only, and no CI-minute/billing extrapolation is made. **Confirmed.**
   - Two-validator equivalence (§3.1): for `banks/*.json`, standalone `validate-bank.ts:32-34` and aggregate `audit/validate-bank.ts:39` both call `validateBankObject(..., {rejectUnknownKeys:true, requireMeta:true})`; the standalone's extra raw-bank handling does not touch the promoted population. **Confirmed.**
2. **Discrepancy.** Two immaterial citation imprecisions (checker findings, not corrections applied): report §2 cites `promotion-gate.yml:19` for "direct invocations" (line 19 is the install step *name*; the invocations span lines 22–47), and report §1 cites `pages.yml:24` for Node pinning (line 24 is the Setup-Node step name; the `node-version: 22` value is at line 27). Both point at the correct step, off by the name-vs-value line only.
3. **Materiality.** Negligible; no numeric or reachability claim depends on them.
4. **Owner disposition.** None required.
5. **Later implementation authorized?** No.

---

## 2. Work-order provenance (commission §3.5) — checker finding

- **Single frozen spec, no post-commit mutation.** `P5-CI-COVERAGE-MEASUREMENT-SURVEY-CODEX-SPEC-2026-07-23.md` has exactly one commit touching it across all refs (`1dbd377`). Its working-tree copy and the committed blob share sha256 `5a6372ee3e0ca02cdade9c7e364be66d46094cebccfcbd5f96d3630e42583ee8`. No earlier version exists in any ref, reflog, or stash. The "**Immutable during execution**" status therefore holds on-disk: the measured surface (`MEASURED_HEAD` = the commit that carries the spec) was frozen before the generator existed, and the spec was not edited afterward.
- **Generator-provenance requirement is technically sound and self-disclosed.** Spec §5.4 requires `generatorGitSha` and `generatorSha256` recorded *separately* from `inputGitSha`, and explicitly explains that `inputGitSha != generatorGitSha` "by design" because the analyzed root is frozen and does not contain the generator, and that the generator is deliberately kept out of the `inputs` array with `generatorSha256` preserving its identity. This is the correct fix for "a generator analyzing a commit that does not contain that generator," and the reproduction confirms it works (my run recorded a different `generatorGitSha` but an identical `generatorSha256`).
- **On a "narrow amendment record."** From repository state I can confirm only that no amendment occurred *after* the frozen commit. Whether an earlier architect-reviewed *draft* (pre-commit, out-of-band) lacked §5.4 and was amended before committing is **not determinable from Git**. If such a pre-commit amendment happened, it occurred before the immutability window opened (commit = start of the frozen measurement) and needs no in-repo amendment record; but this checker cannot independently confirm the out-of-band review history and defers that narrow point to owner/architect knowledge.
- **Verdict.** Sound pre-execution provenance design, sufficiently disclosed within the spec itself. Do not reject the evidence over it; nothing is silently erased.

---

## 3. Topic-vocabulary drift policy (commission §3.6) — checker finding

- The proposed exact-byte guard (generate to temp with `export-topic-vocab`, then `cmp -s` against the committed doc) is **deterministic** (generator carries no timestamp) and **catches the seeded stale document** (the forcing counterexample exits 1 while the current gate exits 0).
- **Explicit statement (as required):** making `docs/topic-vocabulary.md` drift PR-blocking is an **owner policy escalation** — it newly blocks pull requests on generated-documentation staleness. It does **not** make live clinical topic-license findings fatal. Those are separate: the live-clinical enforcement question is lane C4, which this checker defers.

---

## 4. What this report does not do

- It does not edit `.github/workflows/`, `package.json`, `scripts/**`, any test, any bank, or any governance/history/decision file.
- It does not modify the producer's `audit/ci-coverage-survey-2026-07-23.report.md`. The single reporting correction that matters (the `package-lock.json` inventory omission) and the two negligible citation imprecisions are recorded here, as checker-originated findings, preserving the producer artifact intact for provenance. The checker PR adds exactly one file: this report.
- It authorizes no candidate. Owner ratifies A / B / C1 / C2 / C3 / C4 / D1 / D2 independently; only after ratification may a separate implementation commission edit `promotion-gate.yml`.

---

## 5. Summary table

| Lane | Verdict | One-line disposition |
|---|---|---|
| A — standalone TS compilation | PASS | Subsumed by B; reject standalone A if B accepted (owner). |
| B — production build | PASS | Real PR-stage coverage (Vite/make-file-build/build-info); accept (owner). |
| C1 — topic-population regression | PASS | Valid fixture regression; accept (owner). |
| C2 — topic-license detector regression | PASS | Valid detector regression; does not enforce live findings; accept (owner). |
| C3 — topic-vocabulary regression | PASS | Valid library-invariant regression; accept (owner). |
| C4 — live topic-license enforcement | PASS (as absence) | Correctly reported absence; defer (owner). |
| D1 — already-guarded active artifacts | PASS | Already PR-blocking; no new action (owner). |
| D2 — generated topic-vocabulary drift | PASS | Deterministic byte guard; accept narrowly; policy escalation, not live-clinical enforcement (owner). |
| Artifact-inventory completeness | PASS WITH CORRECTION | `package-lock.json` omitted; it is `LIVE_DERIVED_STATE` already guarded by `npm ci`; no Candidate-D change. |
| Survey methodology & provenance | PASS | Manifest reproduced byte-for-byte; determinism, per-workflow reachability, and provenance fields all verified. |

**Owner decisions still required:** ratify A/B/C1/C2/C3/C4/D1/D2 independently; decide whether B retires a standalone A step; decide whether to accept the D2 policy escalation; note `package-lock.json` as already-guarded state.

**No implementation was performed.** No workflow, script, test, bank, schema, or governance file was changed by this checker.
