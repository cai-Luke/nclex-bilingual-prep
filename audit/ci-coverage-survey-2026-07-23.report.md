# P5 CI Coverage Measurement Survey

## 1. Provenance

- Measurement date: 2026-07-23.
- Frozen input commit: `1dbd3779bc42417ce9a6c48433c4c8625201dd9d`.
- Frozen worktree: `/Users/holemini/Desktop/Project-Shrimp-p5-ci-measure-2026-07-23`.
- Measurement root kind: throwaway detached Git worktree.
- Generator commit: `d6e6e97a2ce30e472685baec17e875508a1a9977`.
- Host: Apple Mac16,10, Apple M4, 10 logical CPUs, 16 GB RAM, arm64, macOS 26.5.2.
- Local runtime: Node `v25.9.0`, npm `11.12.1`. Both workflows pin Node 22, so the local Node version does not match the workflow runtime (`.github/workflows/promotion-gate.yml:14`, `.github/workflows/pages.yml:24`).
- Starting implementation branch: `agent/p5-ci-coverage-survey`, created from local `main` at `db1f444fbb96f317c995b055c1331a1511ea426c`, with local `main` byte-equal to `origin/main`.
- Starting live-worktree changed paths were the untracked commission spec and the unrelated `audit/vital-sanity-bounds-p3-stage-3-source-packet-2026-07-23.md`. The unrelated file was never staged or modified. The commission spec alone was committed before `MEASURED_HEAD` was captured.
- `dist/` and every `*.tsbuildinfo` are ignored (`.gitignore:2`, `.gitignore:5`). Cold measurements removed only `dist/`, `tsconfig.app.tsbuildinfo`, and `tsconfig.node.tsbuildinfo` inside the throwaway worktree.

The manifest was generated twice against the same frozen worktree. The exact stability command was:

```sh
diff -u <(jq 'del(.generatedAt)' /tmp/ci-coverage-survey-run-1.json) \
  <(jq 'del(.generatedAt)' /tmp/ci-coverage-survey-run-2.json)
```

It exited 0 with no output. `inputGitSha` stayed fixed; only `generatedAt` changed.

## 2. Per-workflow coverage summary

The unit is an npm script. Direct raw commands such as `npm ci` and `npx tsc` are workflow steps but are not npm-script reachability records.

| Workflow | Trigger | Reachable npm scripts | Names |
|---|---|---:|---|
| Pull request | PR to `main` (`.github/workflows/promotion-gate.yml:3`) | 10 | `audit`, `census:check`, `test-visuals`, `test:coverage-report`, `test:flowsheet-gate`, `test:non-mcq-bias`, `test:schema-bank`, `test:structured-measurements`, `test:structured-measurements-applicator`, `test:validate-sweep` |
| Main push | push to `main` or manual dispatch (`.github/workflows/pages.yml:3`) | 3 | `build`, `validate-bank`, `validate:build-info` |
| Main-push only | difference from the two sets above | 3 | `build`, `validate-bank`, `validate:build-info` |

There are 97 pre-existing npm scripts at the frozen commit and 84 npm-script names unreachable from either workflow. No pooled "covered by CI" count is used: the workflow distinction is the finding. The PR workflow's direct invocations are visible at `.github/workflows/promotion-gate.yml:19`; the main-push invocations are at `.github/workflows/pages.yml:30`.

## 3. Redundancy analysis

### 3.1 Two validators

For the promoted top-level `banks/*.json` population, the validators are equivalent in both population and strictness:

- `pages.yml` supplies the shell-expanded top-level glob to `scripts/validate-bank.ts` (`.github/workflows/pages.yml:36`, `package.json:76`). The aggregate validator reads the top-level `banks` directory and selects its `.json` entries (`scripts/audit/validate-bank.ts:27`).
- Both parse with `parseBankText` and call `validateBankObject` with `rejectUnknownKeys: true` and `requireMeta: true` for promoted files (`scripts/validate-bank.ts:18`, `scripts/validate-bank.ts:32`, `scripts/audit/validate-bank.ts:37`, `scripts/audit/validate-bank.ts:39`).
- The standalone validator has extra raw-bank behavior: it checks and strips case compile manifests and relaxes `requireMeta` for a path under `banks-raw` (`scripts/validate-bank.ts:20`). That divergence does not apply to the promoted `banks/*.json` population.
- The aggregate supports a default sweep and explicit `--file` selection, while the standalone CLI requires positional paths (`scripts/audit/validate-bank.ts:93`, `scripts/validate-bank.ts:7`). That interface difference also does not change the compared promoted population in the two live workflows.

Therefore adding the main-push `validate-bank -- banks/*.json` command to the PR gate would add no promoted-bank validation strictness beyond aggregate Tier 0. Its only differences are CLI/report shape and raw-bank support outside this population.

### 3.2 Aggregate composition

`npm run audit` is one process (`package.json:93`). It runs:

| Component | Tier | Gate effect |
|---|---|---|
| `validate:bank` | Tier 0 | Blocking; a FAIL short-circuits all later audits (`scripts/audit.ts:49`, `scripts/audit.ts:52`). |
| references | Tier 1 | Blocking |
| positions | Tier 1 | Blocking |
| integrity | Tier 1 | Blocking |
| globally unique IDs | Tier 1 | Blocking |
| producer-vocabulary leakage | Tier 1 | Blocking |
| authorial-constraint leakage | Tier 1 | Blocking |
| stage references | Tier 2 | Advisory |
| topic license | Tier 2 | Advisory |
| non-MCQ mechanical axis | Tier 2 display, but blocking by default unless `BIAS_GATE_ENFORCE_MECHANICAL=0` (`scripts/audit.ts:88`, `scripts/audit/audit-verdict.ts:9`) |
| non-MCQ distributional axis | Tier 2 | Advisory; FAIL records become WARN (`scripts/audit/audit-non-mcq-bias.ts:117`) |
| non-MCQ manual axis, when present | Tier 2 | Advisory WARN (`scripts/audit/audit-non-mcq-bias.ts:129`) |

The nine Tier-1/Tier-2 computations are launched together with `Promise.all` (`scripts/audit.ts:62`), so one Tier-1 failure does not mask the other results. Only Tier 0 intentionally short-circuits. The final verdict receives the six standing Tier-1 results plus the mechanical bias result when enforcement is enabled (`scripts/audit.ts:74`, `scripts/audit.ts:88`). Stage references, topic license, and distribution/manual bias remain visible but do not block. A topic-license warning in CI is therefore not gating coverage.

### 3.3 `test-visuals` composition and masking

`test-visuals` is a 21-command `&&` chain (`package.json:58`), in this order:

1. rhythm strip
2. capnography
3. vitals trend
4. lab-trend reference bands
5. lab trend
6. I/O record
7. diverging bars
8. I/O trend
9. medication label
10. device screen
11. burn map
12. fetal monitoring
13. injection site
14. MAR
15. visuals conformance
16. registry mechanics
17. legacy visual parity
18. promoted visual parity
19. promoted-visual-parity survey
20. session sampler
21. rationale-visual schema floor

The first failure stops and masks every later command in that chain. The structured-measurement workflow step has the same property because its three shell lines run under the failing shell step (`.github/workflows/promotion-gate.yml:37`). The job itself also stops later steps after any failed step. `npm run build` is another `&&` chain, but it exists only in the main-push workflow today (`package.json:6`). The aggregate audit is the notable counterexample: after Tier 0, its audits collect failures rather than mask them (`scripts/audit.ts:6`).

### 3.4 Committed generated artifacts

Inventory method: tracked-file enumeration; generated-marker search; dated/name-pattern review; every non-test `writeFile`/`writeFileSync` literal under `scripts/` and generator files under `audit/`; npm-script-to-generator mapping; and searches for tests that read committed outputs. This can identify deterministic writers and executable readers, but prose produced by external agents or ad hoc commands may not carry a discoverable generator. The catch-all `UNCLEAR_REQUIRES_OWNER` row prevents such files from being silently promoted to a standing invariant.

| Artifact family | Generator | Lifecycle | Standing stale guard |
|---|---|---|---|
| `census.json`, `BANK-CENSUS.md` | `npm run census`; both writes are explicit at `scripts/census.ts:635` | `LIVE_DERIVED_STATE` | `npm run census:check`, blocking in the PR workflow (`.github/workflows/promotion-gate.yml:46`). |
| `docs/topic-vocabulary.md` | `npm run export-topic-vocab` (`package.json:54`, `scripts/export-topic-vocab.ts:5`) | `LIVE_DERIVED_STATE`; the file says not to hand-edit and names its source (`docs/topic-vocabulary.md:5`) | None. This is the only newly eligible D family. |
| `scripts/tests/__snapshots__/visual-parity-promoted/*.json` | reviewed `npm run parity:rebaseline` (`package.json:61`, `scripts/visual-parity-baseline.ts:591`) | `ACTIVE_BASELINE` | `test-visuals` runs promoted parity; it regenerates live state and verifies 199 committed records (`scripts/tests/visual-parity-promoted.ts:338`). Already PR-blocking. |
| `scripts/tests/__snapshots__/visual-parity.json`, `lab-trend-dual-series.json`, `vitals-trend-epic.json` | reviewed renderer migrations/manual rebaseline; no single general generator for all three | `ACTIVE_BASELINE` | Their owning visual tests read and compare them; those tests are in `test-visuals` (`scripts/tests/visual-parity.ts:10`, `scripts/tests/lab-trend.ts:198`, `scripts/tests/vitals-trend.ts:574`). Already PR-blocking. |
| `audit/promoted-visual-parity-survey-2026-07-16/survey-manifest.json` | `npm run survey:promoted-visual-parity` (`package.json:100`, `scripts/promoted-visual-parity-survey.ts:501`) | `ACTIVE_BASELINE` despite the dated path, because current byte equality is executable | The survey test compares a fresh build with the committed manifest (`scripts/tests/promoted-visual-parity-survey.ts:254`) and is directly in `test-visuals`. Already PR-blocking. |
| `audit/vital-sanity-bounds-survey-2026-07-17/survey-manifest.json`; `audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json` | their `survey:*` commands (`package.json:96`, `package.json:98`) | `DATED_HISTORICAL_EVIDENCE`; both record bounded architecture surveys, not continuously current product state | Focused tests can compare them, but those npm scripts are not workflow-reachable. No standing guard is recommended because current equality is not the lifecycle contract. |
| `audit/visual-parity-rebaseline-*/receipt.json`; `audit/PR-52-CLOSEOUT-GENERATION-RECEIPT-2026-07-16.md`; migration receipts and before/after hash receipts under dated remediation directories | `parity:rebaseline`, `closeout:receipt`, and their dated migration/remediation generators | `ONE_TIME_RECEIPT` | Internal checksums/provenance where supplied; no continuous drift guard. The PR-52 receipt binds named outputs to a specific input SHA (`audit/PR-52-CLOSEOUT-GENERATION-RECEIPT-2026-07-16.md:3`). |
| `audit/coverage-report-current-head.md`, `audit/topic-vocabulary-migration-2026-06-16.current-head.report.md`, `audit/unresolved_{gemini,gpt_claude}.current-head.json`, `audit/topic-license.current-head.report.md` | commands and hashes recorded by the PR-52 receipt (`audit/PR-52-CLOSEOUT-GENERATION-RECEIPT-2026-07-16.md:16`) | `ONE_TIME_RECEIPT` payloads bound to PR-52's input SHA, not evergreen "current" outputs | Receipt hashes only; no standing current-equality guard recommended. |
| Top-level `audit/non-mcq-bias-*`; `audit/case-completion/**`; rhythm audit outputs; topic migration/residual outputs; and all dated campaign directories under `audit/` (authorial/producer leakage, content demand, July-16 construct, scored-format construct, stage-reference census, temperature, terminal-sentence, WBC/platelet, and similar dated surveys/reviews) | named `audit:*`, survey, migration, and directory-local generators where present; some include model/human results with no deterministic sole generator | `DATED_HISTORICAL_EVIDENCE` or `ONE_TIME_RECEIPT`, according to whether the family records analysis or an applied operation | No continuous drift guard. The repository explicitly calls shared non-MCQ reports historical and possibly stale (`audit/content-demand-2026-07-14/BANK-DEMAND-DISTRIBUTION-INVENTORY-SPEC.md:175`). |
| Any remaining tracked output-looking file under `audit/` without a dated scope, receipt binding, generated marker, or reproducible writer | Not reliably discoverable | `UNCLEAR_REQUIRES_OWNER` | No automatic regeneration or guard recommendation until the owner identifies its lifecycle. |

Candidate D does not include census or active visual baselines because they are already PR-blocking. It does not include historical surveys or receipts because equality to current source is not meaningful for those lifecycles.

### 3.5 Unreachable scripts

The 84 unreachable npm-script names are grouped as follows:

- **On-demand application and operator tools:** `dev`, `preview`, promotion/consolidation/raw-gate tools, raw-bank normalization/repair, imports and cleanup tools, TTS queue generation, flowsheet scoring/manifest tools, one-off category/case tools, and explicit report/audit commands. These are appropriately invoked by a human workflow.
- **Surveys, rebaselines, receipts, migrations, and dry-runs:** every `survey:*`, `parity:rebaseline`, `closeout:receipt`, `topic-vocabulary:dry-run`, `gemini-52:dry-run`, census generation, vocabulary export, and similar write-producing command. These should not be gated merely because they exist.
- **Npm wrappers whose underlying module is already exercised:** standalone `audit:*` wrappers composed in-process by `npm run audit`, plus visual regression wrappers whose `tsx scripts/tests/...` entrypoint appears directly inside `test-visuals`. Their npm-script names are unreachable under the census unit, but their logic has partial or complete module-level coverage.
- **Plausibly gate-worthy focused regressions:** application behavior tests (grading, storage/session/navigation, update, translation, highlight/bowtie/shuffle); promotion/audit maintenance regressions (raw gate, promote, consolidate, audit scoping and modules); topic regressions; and survey/tool regression tests. These require owner selection rather than a flat 84-script expansion. Candidate C isolates three cheap topic contracts from this group.

This grouping follows the npm-script census. It does not misstate direct entrypoint execution as npm-script reachability.

### 3.6 Typecheck/build overlap

Candidate B begins with the same `tsc -b` compiler pass as candidate A (`package.json:6`). Therefore B fully subsumes A's TypeScript diagnostic coverage. B uniquely adds:

- Vite resolution, transform, and production bundling;
- the `scripts/make-file-build.ts` file-openable build conversion; and
- `validate:build-info`.

Those later phases are ordered `&&` commands (`package.json:6`). If B is present, A adds only an earlier/faster compiler failure boundary; it is not independent coverage. The interaction timings confirm the duplicated pass: B alone cold had a 5.002 s median, while A then B had a 7.889 s median total and B still cost 4.882 s after A.

### 3.7 Topic regression versus live enforcement

The exact candidate-C list is derived from the architect's topic population/license/vocabulary wording and the live scripts at `package.json:44`, `package.json:48`, and `package.json:52`.

| Script | Fixture/library regression | Live canonical corpus | Blocking effect on live findings |
|---|---|---|---|
| `test:topic-population` | Yes. It checks recursive exact-topic inclusion and reviewed semantic residual behavior (`scripts/tests/audit-topic-population.ts:45`). | No | None |
| `test:topic-license` | Yes. It checks detector metrics, finding types, explicit-file failures, and WARN semantics (`scripts/tests/audit-topic-license.ts:61`, `scripts/tests/audit-topic-license.ts:85`). | It invokes temporary selected fixtures, not the live canonical corpus. | None. The aggregate's live topic-license result remains advisory (`scripts/audit.ts:80`). |
| `test:topic-vocabulary` | Yes. It checks canonical-key uniqueness, self aliases, alias targets, and strict/shared licensing structure (`scripts/tests/topic-vocabulary.ts:17`). | It imports the live topic library, but does not scan canonical banks. | It can block a library regression, not a new live-bank topic finding. |

Adding the three scripts makes their tested contracts blocking. It does **not** make live topic-license findings blocking. A separate command would have to run the live corpus and convert WARN findings to a nonzero exit; no such proposal was measured here.

### 3.8 Workflow hygiene observations

- Action versions are skewed: PR uses checkout/setup-node v4 (`.github/workflows/promotion-gate.yml:12`), while Pages uses checkout v7 and setup-node v6 (`.github/workflows/pages.yml:21`).
- Pages declares `permissions` and `concurrency` (`.github/workflows/pages.yml:8`); the PR workflow declares neither.
- Neither workflow has path filters; each filters only its branch trigger (`.github/workflows/promotion-gate.yml:3`, `.github/workflows/pages.yml:3`).
- Both pin Node 22 consistently (`.github/workflows/promotion-gate.yml:16`, `.github/workflows/pages.yml:27`).

These are observations only and are not P5 candidate verdicts.

## 4. Runtime measurements

All values are local wall-clock seconds on the hardware in section 1. Raw milliseconds are preserved in brackets. Each measured command exited 0 on the clean snapshot.

`npm ci` is shared existing cost, measured once: **2.817 s** (`[2817.051]`). It is not attributed to a candidate.

### Current PR baseline

| Current step | Raw ms | Min / median / max s |
|---|---|---|
| `test-visuals` | `[7181.579, 5769.530, 5632.413]` | 5.632 / 5.770 / 7.182 |
| `audit` | `[6254.441, 5861.786, 5877.026]` | 5.862 / 5.877 / 6.254 |
| `test:validate-sweep` | `[306.430, 249.279, 252.208]` | 0.249 / 0.252 / 0.306 |
| `test:non-mcq-bias` | `[285.045, 264.446, 261.882]` | 0.262 / 0.264 / 0.285 |
| `test:schema-bank` | `[277.317, 250.737, 250.565]` | 0.251 / 0.251 / 0.277 |
| Three-command structured-measurement step | `[3705.014, 3442.652, 3421.943]` | 3.422 / 3.443 / 3.705 |
| `test:coverage-report` | `[284.719, 255.298, 254.303]` | 0.254 / 0.255 / 0.285 |
| `census:check` | `[903.431, 876.332, 888.720]` | 0.876 / 0.889 / 0.903 |

### Candidates and interaction

| Candidate/sequence | Raw ms | Min / median / max s |
|---|---|---|
| A cold | `[3345.804, 2988.311, 2910.842]` | 2.911 / 2.988 / 3.346 |
| A warm | `[3000.740, 3010.023, 2982.406]` | 2.982 / 3.001 / 3.010 |
| B cold | `[5742.695, 5001.838, 4989.792]` | 4.990 / 5.002 / 5.743 |
| B warm | `[4876.755, 4900.435, 4843.995]` | 4.844 / 4.877 / 4.900 |
| A part of A-then-B | `[3065.295, 3016.379, 2977.434]` | 2.977 / 3.016 / 3.065 |
| B after A | `[4823.367, 4882.420, 4897.485]` | 4.823 / 4.882 / 4.897 |
| A-then-B total | `[7888.758, 7898.899, 7875.026]` | 7.875 / 7.889 / 7.899 |
| C population | `[268.578, 248.202, 242.375]` | 0.242 / 0.248 / 0.269 |
| C license | `[281.210, 260.591, 255.682]` | 0.256 / 0.261 / 0.281 |
| C vocabulary | `[250.920, 222.989, 223.622]` | 0.223 / 0.224 / 0.251 |
| D topic-vocabulary drift prototype | `[283.239, 233.046, 233.561]` | 0.233 / 0.234 / 0.283 |

The A warm result was not materially faster on this host; it is reported rather than normalized away. Cold B is the CI-relevant local comparison. Local wall-clock is not GitHub Actions wall-clock. These numbers establish relative local cost only; they are not a CI-minute, billing, or projected-gate-duration estimate. Absolute CI timing remains an open residual requiring GitHub Actions run logs, which this seat could not read.

## 5. Candidate evidence blocks

### A. TypeScript compilation

1. **Incremental catch:** Type errors in application/build-only modules not imported by current `tsx` tests or audits.
2. **Present consequence:** Pages already typechecks after merge (`.github/workflows/pages.yml:33`), so such a merge turns `main` red and blocks deployment rather than being rejected at PR time.
3. **Runtime:** cold median 2.988 s locally.
4. **Failure modes:** deterministic, no network after install, low false-positive surface; sensitive to all TS project files and to Node/TypeScript environment skew.
5. **Forcing counterexample:** the current PR sequence, including `npm ci`, all visual/audit/focused steps, and census drift, exited 0. Candidate A exited 2:

```diff
--- a/src/App.tsx
+++ b/src/App.tsx
@@
+const p5TypecheckDefect: string = 1;
```

```text
src/App.tsx(143,7): error TS2322: Type 'number' is not assignable to type 'string'.
```

6. **Producer-seat recommendation (non-dispositive):** accept A only if the owner values an explicit earlier compiler boundary; if B is accepted, A adds no unique coverage.

### B. Production build

1. **Incremental catch:** all A diagnostics plus Vite resolution/transform/bundle failures, file-openable build conversion failures, and build-info validation failures.
2. **Present consequence:** B exists only after merge (`.github/workflows/pages.yml:39`); a failure leaves `main` red and prevents Pages deployment.
3. **Runtime:** cold median 5.002 s locally; A then B costs 7.889 s total.
4. **Failure modes:** deterministic and network-independent after install; broader sensitivity to frontend imports, bundler configuration, output conversion, and build metadata. The current large-chunk message is a warning, not a failure.
5. **Forcing counterexample:** the current PR sequence exited 0 and standalone A also exited 0. Candidate B exited 1:

```diff
--- a/src/main.tsx
+++ b/src/main.tsx
@@
 import "./styles.css";
+import "./p5-missing.css";
```

```text
Build failed
Could not resolve "./p5-missing.css" from "src/main.tsx"
```

6. **Producer-seat recommendation (non-dispositive):** accept B. If accepted, omit separate A unless the owner explicitly wants the earlier compiler boundary.

### C1. `test:topic-population`

1. **Incremental catch:** regression in exact-topic population construction, including embedded leaves and semantic residual reconciliation.
2. **Present consequence:** neither workflow currently runs this regression, so detection is not merely post-merge; it is absent until a human runs the test.
3. **Runtime:** median 0.248 s locally.
4. **Failure modes:** deterministic fixture test, no network; intentional population-contract changes require a coordinated test update.
5. **Forcing counterexample:** current PR sequence exited 0; candidate exited 1:

```diff
-  const exact = records.filter((record) => record.topic === topic);
+  const exact = records.filter((record) => record.topic === topic && record.kind !== "embedded_scored_leaf");
```

The assertion expected `["leaf"]` and received `[]`.
6. **Producer-seat recommendation (non-dispositive):** accept.

### C2. `test:topic-license`

1. **Incremental catch:** detector metric, record-kind, explicit-file, and WARN-semantics regressions.
2. **Present consequence:** the live detector does run at PR time, but as advisory; detector regressions not exposed by the current live corpus can merge, and live findings themselves do not block. Pages has no topic-license step.
3. **Runtime:** median 0.261 s locally.
4. **Failure modes:** deterministic fixtures, no network; intentional metric/semantics changes require updating assertions.
5. **Forcing counterexample:** current PR sequence exited 0; candidate exited 1 on the metrics deep-equality assertion:

```diff
-      topLevelRecords: caseContainers + standaloneTopLevel,
+      topLevelRecords: caseContainers + standaloneTopLevel + 1,
```

6. **Producer-seat recommendation (non-dispositive):** accept as detector regression coverage, with an explicit statement that it does not enforce live findings.

### C3. `test:topic-vocabulary`

1. **Incremental catch:** canonical-key collisions, missing self aliases, bad alias targets, and invalid strict/shared licensing structure.
2. **Present consequence:** neither workflow runs these invariants. A bad library edit can merge; topic-license may only warn and Pages does not run it.
3. **Runtime:** median 0.224 s locally.
4. **Failure modes:** deterministic and no network; broad sensitivity is limited to the topic vocabulary contract.
5. **Forcing counterexample:** current PR sequence exited 0; candidate exited 1:

```diff
 "Management of Care": [
+  TOPICS.ABG_ACID_BASE,
   TOPICS.PRIORITIZATION_DELEGATION,
```

```text
Error: canonical topic key collision: "ABG & Acid-Base Interpretation" and
"ABG & Acid-Base Interpretation" both normalize to "abg & acid-base interpretation"
```

6. **Producer-seat recommendation (non-dispositive):** accept.

### C4. Separate live-enforcement lane

The evaluated candidate scripts do not turn live-corpus topic-license findings into a failing exit. No forcing counterexample exists in which merely adding these three scripts catches a new live-only topic finding, because none of them performs a blocking live-corpus scan. This is an explicit absence, not inferred coverage. A live-enforcement proposal would be a separate policy/command design and was not authorized by this commission.

### D1. Census and active visual baselines

These eligible lifecycle classes need no added D command: census drift and active visual/survey baseline equality are already blocking in the PR workflow. No forcing counterexample can satisfy "current PR passes, candidate catches" for those existing guards. They add no pull-request-stage coverage.

### D2. Generated topic vocabulary

1. **Incremental catch:** byte drift between `src/topics.ts`-derived output and committed `docs/topic-vocabulary.md`.
2. **Present consequence:** neither workflow currently checks this file. Stale documentation can merge and remain stale; there is no guaranteed post-merge detection.
3. **Runtime:** median 0.234 s locally for generate-to-temp plus `cmp`.
4. **Failure modes:** deterministic, no network, exact-byte comparison. It is intentionally sensitive to any topic-source or generated-doc edit. The generator has no timestamp, so there is no volatile field.
5. **Prototype command:**

```sh
tmp=$(mktemp /tmp/topic-vocabulary.XXXXXX.md)
npm run export-topic-vocab -- "$tmp" >/dev/null &&
  cmp -s "$tmp" docs/topic-vocabulary.md
```

The current PR sequence exited 0 after this defect; the prototype exited 1:

```diff
 # Topic Vocabulary
 
+P5 stale generated-document defect.
+
 Status: canonical vocabulary; reviewed live-bank migration completed 2026-07-16.
```

6. **Producer-seat recommendation (non-dispositive):** accept a temp-generation byte check for this family only. Do not extend it automatically to historical evidence or receipts.

## 6. Open residuals and execution deviations

### Verification receipt

- `npx tsc -b --pretty false`: exit 0.
- The required survey command was run twice against the still-present frozen worktree; both runs exited 0, `inputGitSha` remained `1dbd3779bc42417ce9a6c48433c4c8625201dd9d`, and the `jq 'del(.generatedAt)'` diff shown in section 1 was empty.
- The complete unmodified PR run sequence (`npm ci`, `test-visuals`, `audit`, every focused test line, and `census:check`) ran on the implementation tree; every command exited 0.
- `git diff --stat -- .github/workflows` was empty.
- Relative to `MEASURED_HEAD`, `git diff --numstat -- package.json` reported `1 0 package.json`; the only added line is the exact `survey:ci-coverage` script.
- The frozen worktree remained clean and detached at `MEASURED_HEAD` after all measurements and restored defect constructions.

- Absolute GitHub Actions timings could not be measured because this seat could not read Actions run logs. Local timings must not be extrapolated.
- Local Node was v25.9.0 rather than the workflows' Node 22. The mismatch is recorded; no environment mutation was made to conceal it.
- The original live `main` worktree was not clean because it contained the untracked commission spec and an unrelated untracked audit source packet. To preserve the unrelated file, execution used a separate clean implementation worktree/branch, committed only the spec, and then created the required frozen measurement worktree from that commit. This is the one prerequisite that could not be performed literally in the original live directory.
- Generated-artifact completeness is limited by repository evidence: files without markers, named writers, receipts, or clear dated scope are classified `UNCLEAR_REQUIRES_OWNER`, not silently treated as current derived state.
- Candidate-C live enforcement was not executable as a successful forcing lane because the three specified regressions do not implement it. That absence is the finding.
- No workflow file, CI step, existing script behavior, test aggregate, schema, bank, governance file, history file, decision file, or ledger was changed.
