# Codex Task: Narrow the Non-MCQ Distributional Bias Checks (audit 2.0.0 → 2.1.0)

Authored by Claude (architect seat), 2026-07-15. Ratified by Luke, 2026-07-15.

## Objective

Implement the ratified A2/A3 audit-policy change in `scripts/audit/non-mcq-bias-lib.ts`:

1. add a minimum-n `INSUFFICIENT` gate to `select_all / correct_count_distribution`;
2. add a minimum-n `INSUFFICIENT` gate to `ordered_response / template_repetition`, derived from the
   existing share limit rather than stored as a duplicate constant;
3. remove the `sata_missing_count_fails` rule entirely;
4. narrow global inheritance so the two distributional checks no longer inherit canonical-bank
   failures, while every other check continues to inherit;
5. bump `audit_version`, repair the Layer B queue's hard-coded version, and regenerate the shared audit
   artifacts.

This is an audit-code change. **No bank content changes.** No item is authored, retired, replaced, or
regenerated in this PR.

### Why (do not re-litigate; see the evidence base)

The evidence is `audit/content-demand-2026-07-14/` (PR #48), adjudicated PASS. It established that the
current FAILs are overwhelmingly artifacts, not learner-facing bias: `lab-canonical` ordered response
carries four items with four *distinct* templates and fails only because the smallest achievable top
share at n=4 is 0.25 against a 0.15 limit; the global ordered record passes natively and fails only by
inheritance from that one frozen bank; and the small SATA banks fail on a missing-bin rule that failed
every non-empty SATA bank in the live corpus, because every bank lacked at least one demanded bin —
including banks with no meaningful concentration. **Do not read, modify, or regenerate anything under
`audit/content-demand-2026-07-14/`.** It is a frozen evidence snapshot, and its numbers are pinned to a
prior HEAD.

## Read order (pull live from disk; do not reconstruct from memory)

1. `AGENTS.md`
2. `DECISIONS.md` — principle 16 governs this change; principle 27 governs the fact that it is a
   narrowing on the record rather than a quiet relaxation
3. `PROJECT-HISTORY.md`
4. `scripts/audit/non-mcq-bias-lib.ts` — the only file whose behavior changes
5. `scripts/tests/non-mcq-bias.ts` — the test surface to extend
6. `scripts/audit-non-mcq-bias.ts` — the standalone command that writes the shared artifacts
7. `scripts/audit/non-mcq-bias-layer-b.ts` — consumes the report; see "Expected drift"
8. `scripts/audit.ts` and `scripts/promote.ts` — verify, do not change

## Ratified constants

| constant | value | note |
|---|---|---|
| `audit_version` | `"2.1.0"` | config hash changes as a consequence; that is expected |
| `sata_count_min_n` | `8` | **new** independent constant |
| `sata_count_degeneracy` | `0.70` | unchanged |
| `template_repeat_max_share` | `0.15` | unchanged |
| ordered template minimum n | `ceil(1 / 0.15) = 7` | **derived, not stored** |
| `sata_missing_count_fails` | *removed* | delete the key and every read of it |
| `scramble_min_n` | `8` | unchanged, and **not** reused for SATA |

Two explicit rulings on constant hygiene:

- **Do not reuse `scramble_min_n` as the SATA minimum merely because both values are currently 8.**
  They are independent policy knobs that happen to coincide; collapsing them would couple two rules
  that must be separately adjustable.
- **Derive the ordered minimum from `template_repeat_max_share`.** An independently adjustable
  duplicate constant could drift out of agreement with the share limit it exists to serve. Define it
  outside the hashed config object so the hash covers policy inputs, not values derivable from them:

```ts
export const ORDERED_TEMPLATE_MIN_N = Math.ceil(1 / NON_MCQ_BIAS_CONFIG.template_repeat_max_share);
```

Export it so the tests can assert `ORDERED_TEMPLATE_MIN_N === 7` rather than hard-coding 7 in a
fixture.

## Change 1 — config

In `NON_MCQ_BIAS_CONFIG`: set `audit_version` to `"2.1.0"`, delete `sata_missing_count_fails`, add
`sata_count_min_n: 8` adjacent to `sata_count_degeneracy`. Leave every other key untouched, including
`scramble_min_n`.

`CONFIG_TEXT` / `NON_MCQ_BIAS_CONFIG_HASH` need no edit — the hash recomputes from the object.

## Change 2 — `sataRecords`, `correct_count_distribution`

Replace the `countFail` / `hasMissing` verdict computation with a three-way gate:

```ts
const countVerdict: BiasVerdict =
  questions.length === 0
    ? "INSUFFICIENT"
    : questions.length < NON_MCQ_BIAS_CONFIG.sata_count_min_n
      ? "INSUFFICIENT"
      : topShare > NON_MCQ_BIAS_CONFIG.sata_count_degeneracy
        ? "FAIL"
        : "PASS";
```

Delete the now-unused `countFail` and `hasMissing` bindings.

**Keep `missingByOptionCount` and keep emitting it as `metrics.missing_by_option_count`.** Only the
*rule* is removed, not the diagnostic. A missing correct-count bin remains real, reportable
information; it simply no longer fails a *bias* check, because bin coverage is a coverage question and
this check measures concentration. Conflating the two was the defect.

Leave `statistic`, `example_item_ids`, `severity`, `fix_class`, and the rest of `metrics` on their
existing logic. In particular do not change the existing `questions.length > 0` guard on `statistic`:
a low-n cohort should still report its observed `top_share` alongside its `INSUFFICIENT` verdict.

## Change 3 — `orderedRecords`, `template_repetition`

```ts
const templateVerdict: BiasVerdict =
  questions.length === 0
    ? "INSUFFICIENT"
    : questions.length < ORDERED_TEMPLATE_MIN_N
      ? "INSUFFICIENT"
      : topTemplateShare > NON_MCQ_BIAS_CONFIG.template_repeat_max_share
        ? "FAIL"
        : "PASS";
```

**Do not touch the sibling `scramble_depth` record in the same function.** It keeps its
`scramble_min_n` gate at 8 and is deliberately *not* derived from anything.

## Change 4 — narrow global inheritance in `auditNonMcqBias`

The `global` mapping currently converts a natively-passing global record to FAIL whenever any per-bank
record for the same `item_type` + `check` failed. Narrow that to exclude the two distributional checks:

```ts
const DISTRIBUTIONAL_CHECKS = new Set<string>([
  "select_all:correct_count_distribution",
  "ordered_response:template_repetition",
]);
```

In the map callback, return the native record unchanged when
`DISTRIBUTIONAL_CHECKS.has(`${record.item_type}:${record.check}`)`. Every other check keeps the
existing inheritance behavior byte-for-byte.

Consequence to preserve deliberately: `metrics.inherited_per_bank_failures` must **not** appear on a
distributional global record after this change. Its absence is the observable proof the narrowing
applied.

Rationale, for the record: a canonical file is an authoring-provenance boundary, not a learner-visible
population. A learner never draws from "lab-canonical"; they draw from the bundled bank. A global
statistic that passes on its own 220 observations is not made false by a 4-item file's arithmetic
floor. Positional and mechanical checks keep inheriting because a positional tell in any bank is a real
tell in the bundled corpus regardless of which file carries it.

## Explicitly out of scope — do not "helpfully" unify

- `matrix / all_rows_same_column` — uses `scramble_min_n` for its floor and `template_repeat_max_share`
  for its threshold. Leave it exactly as is. Do **not** point it at `ORDERED_TEMPLATE_MIN_N`.
- `ordered_response / scramble_depth` — leave as is.
- All positional / `uniformRecord` checks and their inheritance.
- `scripts/promote.ts` mechanical-gate enforcement (`BIAS_GATE_ENFORCE_MECHANICAL`). Distributional
  results never block promotion and must not start.
- `scripts/audit.ts` tiering: distributional stays Tier 2 advisory `WARN`, never blocking.
- Any bank file. Any governance markdown. `DECISIONS.md` is architect-only and is being amended
  separately.
- `audit/content-demand-2026-07-14/**`.

## Change 5 — repair the Layer B queue's hard-coded audit version

`scripts/audit/non-mcq-bias-layer-b.ts` hard-codes `audit_version: "2.0.0"` in `queueRow`. Verified on
live disk 2026-07-15. Left alone, a 2.1.0 report would regenerate queue rows falsely labeled 2.0.0 — a
provenance lie in an artifact whose entire job is to carry provenance to an external reviewer.

Smallest repair, and no larger:

- `buildLayerBQueue(inputs, report)` already receives the report. Thread `report.audit_version` through
  to `queueRow` as a parameter.
- **Do not import `NON_MCQ_BIAS_CONFIG` into this file, and do not otherwise resolve the version
  independently.** The queue's version must be the version of the report it was built *from*, not a
  separately-resolved constant that could later disagree with it. That is the same duplicate-constant
  failure mode this spec forbids for the ordered minimum.
- Change nothing else in the file. `mergeLayerBResults` already reads `artifact.audit_version` and is
  already correct.

## Change 6 — regenerate shared artifacts

Run `npm run audit:non-mcq-bias` and commit what it rewrites:

- `audit/non-mcq-bias-report.md`
- `audit/non-mcq-bias-report.json`
- `audit/non-mcq-bias-layer-b-queue.jsonl`
- `audit/non-mcq-bias-layer-b-prompt.md`

These are currently content-stale (they predate ~14 SATA items and 3 ordered items); regenerating them
is part of this task, and the `n` values will move. The new header must carry
`Non-MCQ Structural Bias Audit v2.1.0` and the new config sha256.

### Two expected outcomes that are not defects

1. **`npm run audit:non-mcq-bias` will exit 1.** The script sets `process.exitCode = 1` whenever any
   record is FAIL, and `visual-canonical / select_all / correct_count_distribution` is *expected* to
   remain FAIL (n=11, top share 0.909 — a real, non-forced concentration). Do not suppress it, do not
   change the exit-code logic, and do not touch `visual-canonical`. The aggregate `npm run audit` must
   still report GATE PASSED with distributional warnings present.
2. **The Layer B queue will shrink.** `buildLayerBQueue` keys off the report, so removing FAILs removes
   queue rows. Report the row-count delta in the PR description; do not treat it as a regression. Every
   regenerated row must carry `audit_version: "2.1.0"` per Change 5.

## Required tests — extend `scripts/tests/non-mcq-bias.ts`

Every case below is ratified and must be present as its own named fixture. Synthetic banks; no
canonical bank may be read by a test.

**SATA:**

- n=7 → `INSUFFICIENT`, *regardless of concentration*. Construct it with a degenerate top share (e.g.
  all 7 at the same correct count, share 1.0) so the test proves the floor gates ahead of the
  threshold rather than coinciding with it.
- n=8 with top share > 0.70 → `FAIL`.
- n=8 with top share ≤ 0.70 → `PASS`, **even when correct-count bins are missing.** This is the
  regression that pins the `sata_missing_count_fails` removal; assert `metrics.missing_by_option_count`
  is still populated and non-empty in this same case, proving the diagnostic survived the rule.

**Ordered response:**

- n=6 → `INSUFFICIENT`.
- n=7, seven unique templates → `PASS` (top share 1/7 ≈ 0.1428 ≤ 0.15).
- n=7, one repeated template → `FAIL` (top share 2/7 ≈ 0.2857 > 0.15).
- Assert `ORDERED_TEMPLATE_MIN_N === 7` and that it is derived — e.g. assert it equals
  `Math.ceil(1 / NON_MCQ_BIAS_CONFIG.template_repeat_max_share)`.

**Inheritance:**

- A global distributional record that passes natively stays `PASS` despite a failing canonical bank in
  the same run. Also assert `metrics.inherited_per_bank_failures` is **absent** on that record.
- A *mechanical* global record still inherits a canonical-bank failure, proving inheritance was
  narrowed rather than deleted wholesale. Assert `inherited_per_bank_failures` is present and names the
  failing bank.

**Config:**

- `sata_missing_count_fails` is absent from `NON_MCQ_BIAS_CONFIG`.
- `audit_version === "2.1.0"`.
- `scramble_min_n === 8` and `sata_count_min_n === 8` are distinct keys (guards against the collapse
  this spec forbids).

**Layer B version threading:**

- Every row returned by `buildLayerBQueue` satisfies `row.audit_version === report.audit_version`.
  Assert it against the report object, **not** against the literal `"2.1.0"` — a test that hard-codes
  the version reintroduces the same defect one layer up and would pass forever while drifting.

## Expected live result after the change

State these in the PR description as observed output, not as predictions restated from this spec:

| scope | check | expected |
|---|---|---|
| burn, device, io, mar | SATA `correct_count_distribution` | `INSUFFICIENT` |
| visual-canonical | SATA `correct_count_distribution` | `FAIL` (n=11, ~0.909) |
| claude, gemini, gpt, hard-cases, global | SATA `correct_count_distribution` | `PASS` |
| lab-canonical | ordered `template_repetition` | `INSUFFICIENT` |
| global | ordered `template_repetition` | `PASS` |

Net: SATA distributional FAILs go 10 → 1; ordered distributional FAILs go 2 → 0.

**If the observed result disagrees with this table, stop and report.** Do not adjust a constant, a
threshold, or a fixture to make the table come true. The table is a prediction derived from adjudicated
evidence; a disagreement means either the evidence or the prediction is wrong, and both outcomes are
architect business.

## Gates

Per `AGENTS.md`'s risk-tiered matrix this is a data-contract change (it moves an audit config hash and
the verdicts downstream consumers read), so it takes the full path minus the bank-specific steps:

- `npm run test:non-mcq-bias` — with every new fixture above
- `npx tsc -b --pretty false`
- `npm run audit` — must be GATE PASSED (warnings present)
- `npm run audit:non-mcq-bias` — expected exit 1, artifacts regenerated
- `npm run test:promote` and `npm run test:audit-integrity` — the promote path calls the in-memory gate;
  prove it is unaffected
- `npm run census:check` — as a no-escape / stale-state check, not because the census should move. No
  bank content changes here, so it must pass unchanged. A failure means either something escaped scope
  or the tree was already stale; both are stop conditions.
- `npm run build`
- `git diff --check`

**Do not run `npm run census`.** `census:check` is diagnostic here; regenerating the census in this PR
would mask exactly the escape it exists to detect.

## Stop conditions

Stop and report rather than proceeding when:

- clearing a check would require touching a bank file;
- the live result disagrees with the expected-result table above;
- `npm run audit` stops being GATE PASSED;
- a promote-path test moves;
- any changed path falls outside this permitted set:
  - `scripts/audit/non-mcq-bias-lib.ts`
  - `scripts/audit/non-mcq-bias-layer-b.ts` (Change 5 only)
  - `scripts/tests/non-mcq-bias.ts`
  - the four regenerated `audit/non-mcq-bias-*` artifacts;
- the change appears to require reusing `scramble_min_n` for SATA or storing the ordered minimum as an
  independent constant.

## Handoff

Codex implements; Claude gates the diff; Luke merges. Codex does not merge or push to `main`, and does
not write to `DECISIONS.md` — the corresponding constitutional amendment is architect-only and is being
drafted separately for Luke's exact-wording sign-off.
