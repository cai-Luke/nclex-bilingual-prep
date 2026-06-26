# Non-MCQ Bias Promotion Gate — Codex Spec

**Date:** 2026-06-26 (rev. 2 — incorporates Codex implementation review)
**Author:** Claude (planning seat)
**Implementer:** Codex
**Status:** Ready for implementation. The §7 prereqs (promote-time normalization fold; the `gpt-gap-jun12-rrp-bcc` canary) are both already resolved, so Phase 1 can land immediately and the mechanical axis can flip to BLOCK once Phase 1 confirms a zero baseline.
**Decision recorded in:** `DECISIONS.md` open thread *"Non-MCQ bias audit — advisory now, gate deferred"* (this spec is the resolution of sub-decision 1, "Audit placement").

---

## 1. Problem

The non-MCQ bias audit (`scripts/audit-non-mcq-bias.ts`, lib `scripts/audit/non-mcq-bias-lib.ts`) is **advisory** — run on demand against explicit paths, never wired into `npm run audit` or `.github/workflows/promotion-gate.yml`. The open thread asks whether it earns gate status now that the positional baseline is clean.

The answer is **not a single yes/no**: the audit produces structurally different finding classes (`DECISIONS.md` principle 16), and the per-record `fix_class` field already encodes the fork:

- **`SHUFFLE_AT_PROMOTION`** — *positional / mechanical* tells (SATA correct-position, dropdown index, matrix column/row, ordered-response scramble depth, bowtie token position, all-rows-same-column). Owned by code: a deterministic, ID-seeded permutation removes them (principle 1). Post the 2026-06-12 rebaseline these pass at zero globally. **A new one appearing means a draft bypassed normalization — a real regression.**
- **`REGENERATE`** — *distributional* tells (`correct_count_distribution` for SATA, `template_repetition` for ordered-response). Properties of the content itself; unreachable by shuffling. Existing canonical FAILs are **dilution debt** that shrinks as constrained new content lands; they must **never** block an unrelated promotion.

A gate that hard-fails on both would either be impossible to pass (canonical distributional debt) or block nothing useful. The gate must therefore **split on `fix_class`**.

## 2. Decision

The lib's `BiasFixClass` enum has **five** values — `SHUFFLE_AT_PROMOTION`, `REGENERATE`, `RATIONALE_REPAIR`, `MANUAL_REVIEW`, `NONE`. Wire the bias audit into the gate as results routed by `fix_class`, with an **exhaustive** disposition (no class silently dropped):

| `fix_class` | Disposition | Gate severity | Why |
|-------------|-------------|---------------|-----|
| `SHUFFLE_AT_PROMOTION` | Mechanical axis | **BLOCK** (FAIL, exit 1) when enforced | positional tells; `promote.ts` normalization keeps these at zero, so a nonzero is a real bypass |
| `REGENERATE` | Distributional axis | **WARN** (never blocks) | content concentration; canonical debt dilutes over time |
| `RATIONALE_REPAIR` | Excluded (owned elsewhere) | not emitted by this adapter | the lib's `rationaleRecord` calls `checkQuestionReferences` — identical to the Tier-1 `audit:references` gate, which already blocks on it; double-gating here would duplicate that check |
| `MANUAL_REVIEW` | Manual axis | **WARN** + explicit "needs disposition" detail | not currently produced by the lib, but in the enum; must never be silently dropped |
| `NONE` | ignored | — | only set on non-FAIL records |

Any FAIL record whose `fix_class` is not handled above (a future addition) must surface as a loud error/`INSUFFICIENT` from the adapter, never be dropped — make the switch exhaustive over `BiasFixClass`. This is principle 16's `fix_class` fork made operational, and principle 3 (deterministic core): the gate routes off a field the lib already computes; it adds no new judgment.

**Observed baseline (2026-06-26, Codex):** over canonical `banks/*.json` — **0** `SHUFFLE_AT_PROMOTION` FAILs, **12** `REGENERATE` FAILs, **0** `RATIONALE_REPAIR`/`MANUAL_REVIEW` FAILs. The mechanical axis already reads zero (safe to enforce); only the WARN axis is non-empty, exactly as the policy expects.

## 3. Invocation contexts and targets

Two callers reuse the same lib with different targets and severities:

**A. Standing gate — `npm run audit` (CI / PR, runs over canonical `banks/*.json`).**
- Mechanical axis = **BLOCK when `BIAS_GATE_ENFORCE_MECHANICAL=1`** (observe-only in Phase 1). Canonical baseline is zero; any nonzero is a normalization bypass.
- Distributional axis = **WARN / informational** only. Reports the current canonical concentration so the dilution trend is visible, but never blocks — the canonical debt is known and being diluted, not edited.

**B. Promotion-time batch check — over the staged incoming batch (after `npm run promote` normalizes, before `npm run consolidate`).**
- Mechanical axis = **BLOCK**: a `SHUFFLE_AT_PROMOTION` finding in freshly-promoted output proves the shuffle/normalization did not apply — abort the promotion (see §4.5 for the in-memory ordering that avoids partial staged output).
- Distributional axis = **WARN with a per-batch budget**: flag when the *new batch* worsens count/template concentration beyond the budget, so regeneration is caught while it is still cheap.

## 4. Required code changes

1. **Add a non-blocking status, and fix the existing verdict bug.** In `scripts/audit/types.ts` add `WARN` to `CheckStatus` (`"PASS" | "FAIL" | "INSUFFICIENT" | "WARN"`). In `scripts/audit.ts`, give `WARN` a distinct icon (e.g. `!`) and print it. **While here, fix the pre-existing final-verdict bug:** `allInsufficient = tier1Results.every((r) => r.status !== "FAIL")` is true whenever nothing failed, so a fully clean run misreports as "some checks INSUFFICIENT" and never reaches the clean-pass branch. Replace the verdict block with: `anyFailed = blocking.some(r => r.status === "FAIL")` → GATE FAILED (exit 1); else compute `someInsufficient = all.some(r => r.status === "INSUFFICIENT")` and `someWarn = all.some(r => r.status === "WARN")` and print "GATE PASSED (warnings present)" / "GATE PASSED (some checks INSUFFICIENT)" as applicable, else "GATE PASSED — clean." `WARN` and `INSUFFICIENT` never set a nonzero exit.

2. **New adapter `scripts/audit/audit-non-mcq-bias.ts`** exporting `runAuditNonMcqBias(opts?: { paths?: string[] }): Promise<AuditResult[]>`. It calls `auditNonMcqBias(banks)` from `non-mcq-bias-lib` **directly** (see item 4), then partitions `report.records` (both per-bank and the `global` rows), considering only `verdict === "FAIL"` records, **exhaustively by `fix_class`**:
   - `SHUFFLE_AT_PROMOTION` → `name: "audit:non-mcq-bias:mechanical"`. `status` = `FAIL` if any such record exists, else `INSUFFICIENT` if every mechanical check came back `INSUFFICIENT` (small-n), else `PASS`. `failures` = deduped failing record item IDs.
   - `REGENERATE` → `name: "audit:non-mcq-bias:distributional"`. `status` = `WARN` if any such record exists, else `PASS`/`INSUFFICIENT`. **Never `FAIL`.**
   - `RATIONALE_REPAIR` → **excluded by design.** Identical to the Tier-1 `audit:references` gate (`rationaleRecord` → `checkQuestionReferences`); re-emitting would double-gate. Document this in the adapter and assert (test) that `audit:references` is in the aggregate so coverage isn't actually dropped.
   - `MANUAL_REVIEW` → `name: "audit:non-mcq-bias:manual"`, `status` = `WARN` with an explicit "needs human disposition" detail. Not currently produced, but in the enum — surface, never drop.
   - Any other / unknown `fix_class` on a FAIL record → throw (make the `switch` exhaustive over `BiasFixClass`) so a future class can't be silently ignored.
   Source the class names from the lib's `BiasFixClass` type; do not hardcode check-name strings.

3. **Wire into `audit.ts` with an explicit blocking filter (resolves the Phase-1 inconsistency).** Run `runAuditNonMcqBias()` alongside the Tier-1 `Promise.all`. The adapter always reports the **true** status — mechanical = `FAIL` when a `SHUFFLE_AT_PROMOTION` FAIL exists; it never lies via a downgraded status. Enforcement is decided in `audit.ts` by which results go into the **blocking set**: references/positions/integrity/ids are always blocking; the mechanical result joins the blocking set **only when `BIAS_GATE_ENFORCE_MECHANICAL=1`**. In Phase 1 (flag unset/`0`) the mechanical line still prints its real `FAIL`/`PASS` but is excluded from `anyFailed` — observe-only without misrepresenting status. Distributional/manual (`WARN`) and `INSUFFICIENT` are never in the blocking set. Print the advisory lines under a labeled "Tier 2: non-MCQ bias (advisory)" section.

4. **Adapter calls the lib directly — no CLI shell-out, no artifact writes.** `runAuditNonMcqBias` imports and calls `auditNonMcqBias` (loading/validating banks as the standalone does). It must **not** spawn `npm run audit:non-mcq-bias` and must **not** write `audit/non-mcq-bias-report.{json,md}` or the layer-B files. Only the standalone `scripts/audit-non-mcq-bias.ts` writes those four artifacts and exits nonzero on distributional FAILs — leave it as-is for on-demand/merge use. Factor the bank-load and the record→AuditResult mapping into shared helpers so the standalone and the gate agree without the gate inheriting the artifact side effects.

5. **Promotion path — check in memory before writing staged files (no partial `_promoted` output).** Run the mechanical check on the shuffled-and-normalized batch **in memory, before** any file is written to `banks/_promoted/`. On a mechanical `FAIL`, abort before writing anything — never leave a partially-refreshed `_promoted/` set. (If `promote.ts` currently writes per-file as it goes, move the bias check ahead of all writes, or stage to a temp location and promote atomically.) Abort message: "staged batch has positional tells post-shuffle — normalization did not apply; not staging." Distributional over-budget prints a WARN only. Gate the abort behind the same `BIAS_GATE_ENFORCE_MECHANICAL` flag so it ships observe-only first.

6. **CI.** `.github/workflows/promotion-gate.yml` already runs `npm run audit`; no workflow change is needed once the adapter is wired — the mechanical line rides the existing aggregate. Confirm the run logs show the Tier-2 lines.

## 5. Parameters (the lib's `NON_MCQ_BIAS_CONFIG`)

All thresholds already live in one exported, content-hashed object: `NON_MCQ_BIAS_CONFIG` in `non-mcq-bias-lib.ts` (`audit_version 2.0.0`; `NON_MCQ_BIAS_CONFIG_HASH` is a sha256 of it, stamped into every record). Current values: `min_expected_count 5`, `chi2_alpha 0.01`, `max_cell_deviation_pp 8`, `sata_count_degeneracy 0.70`, `sata_missing_count_fails true`, `ordered_min_mean_kendall 0.35`, `template_repeat_max_share 0.15`, `example_cap 3`. **Adding a key changes the config hash** — expected; update any fixture that pins the hash.

- `max_cell_deviation_pp = 8`, `chi2_alpha = 0.01`, `min_expected_count = 5` — positional checks (`uniformRecord`) already gate small-n: a check is `INSUFFICIENT` when `expected = n / categories < 5`. **Keep.**
- `correct_count_distribution` — FAIL when one count > **70%** (`sata_count_degeneracy`) of SATA items, or a plausible count absent (`sata_missing_count_fails`). `REGENERATE` → WARN. **Keep** (deterministic degeneracy rule; no fabricated reference distribution).
- **`scramble_depth` needs a real min-n (Codex concern 3).** `orderedRecords` currently FAILs whenever `n > 0 && mean_normalized_kendall < ordered_min_mean_kendall (0.35)` with **no n guard** — exactly how the stale `n=3` artifact produced a FAIL. Add `scramble_min_n` to the config (start at **8**, in the spirit of `min_expected_count`) and make `scramble_depth` return `INSUFFICIENT` when `n < scramble_min_n`. Because this is a `SHUFFLE_AT_PROMOTION` (blocking) check, the guard is load-bearing before Phase 2.
- **`all_rows_same_column`** is also `SHUFFLE_AT_PROMOTION` and currently only guards on `eligible === 0`; apply the same min-n floor (reuse `scramble_min_n` or a sibling) so a handful of single-per-row items can't block.
- `template_repetition` — `REGENERATE` → WARN. **Metric key confirmed (resolves the prior open thread):** a "template" is `permutationTemplate(question)` = `question.options.map(o => correctRank.get(o.id) ?? -1).join(",")` — the option-order→correct-rank signature; FAIL when the top template group's share > `template_repeat_max_share` (0.15). Because it is WARN-only, no batch budget is required to ship; if one is later wanted, define it against that same `permutationTemplate` share.

## 6. Tests (extend `scripts/tests/non-mcq-bias.ts`, and add an `audit.ts` verdict test)

- **Verdict-bug regression:** an all-PASS result set prints "GATE PASSED — clean" (not the INSUFFICIENT message); an INSUFFICIENT-but-no-FAIL set prints the INSUFFICIENT message; a WARN-but-no-FAIL set exits 0.
- **Env enforcement:** a planted `SHUFFLE_AT_PROMOTION` FAIL → mechanical `AuditResult` = FAIL always; with `BIAS_GATE_ENFORCE_MECHANICAL=0`, `audit.ts` exits 0 (line still prints FAIL); with `=1` it exits 1.
- **Distributional:** a `REGENERATE` FAIL → distributional `AuditResult` = WARN, exit 0 regardless of the flag.
- **scramble_depth min-n:** an ordered-response pool of `n=3` with low mean-Kendall → `INSUFFICIENT` (not FAIL); a pool of `n ≥ scramble_min_n` with low mean-Kendall → FAIL. (Directly pins the stale-artifact fix.)
- **fix_class exhaustiveness:** `RATIONALE_REPAIR` FAILs are not emitted by the adapter, and `audit:references` is asserted present in the aggregate; a synthetic `MANUAL_REVIEW` FAIL → `manual` WARN; an unknown `fix_class` → the adapter throws.
- **Batch-scope guard:** a canonical bank carrying existing `REGENERATE` dilution debt does not block; mechanical stays PASS.
- **Determinism:** identical input → byte-identical `AuditResult[]` across two runs (principle 3).
- **Promotion abort:** a staged batch with a post-shuffle positional tell aborts **before** any `banks/_promoted/` file is written (assert the directory is unchanged).

## 7. Dependencies and sequencing

This gate is only safe to **enforce** after the mechanical baseline is provably zero. Status of the prerequisites:

1. **DONE — extended normalization is already folded into `promote.ts`.** Per the Phase 2 Schema-Hardening Step A closeout (2026-06-24), `promote.ts` already calls `normalizeBankPresentations(shuffled)`, normalizing MC/SATA/ordered option pools, dropdown options, matrix columns, and embedded case-study leaves after the deterministic shuffle, and `audit:integrity` regression coverage was extended to those axes. Every promotion already normalizes all structural axes, so the mechanical baseline is maintained at the gate and the earlier "promote-time normalization" open sub-decision is closed. No work remains here.
2. **Canary — RESOLVED 2026-06-26 (stale artifact, not a live bug).** The `ordered_response / scramble_depth` FAIL attributed to `gpt-gap-jun12-rrp-bcc` was a stale pre-fold audit-report row, not a live bypass. That standalone bank no longer exists — it was folded into `gpt-canonical.json`; the old FAIL came from a report over only 3 ordered-response items (n=3 mean-Kendall noise). Codex re-checked the live canonical (2026-06-26): `normalize-presentations -- banks/gpt-canonical.json` → 0 components to normalize, invariants passed; `validate-bank` OK (498); `audit:non-mcq-bias -- --bank banks/gpt-canonical.json` → `ordered_response / scramble_depth` **PASS** at n=106. No code or bank JSON changed. The permanent fix for the artifact class is the `scramble_min_n` guard in §5 (item) and its §6 test.
3. **Template metric key — confirmed (§5):** a template is the `permutationTemplate` option-order→correct-rank signature. Since `template_repetition` is WARN-only, no batch budget is required to ship; this is no longer a blocker.

**Rollout:**
- **Phase 1 (ship now):** land the `WARN` status + the `audit.ts` verdict-bug fix + the adapter + the `scramble_min_n` guard; wire the mechanical result with `BIAS_GATE_ENFORCE_MECHANICAL=0` (observe-only — prints its real status but does not block). Observe over real PRs/promotions that the mechanical line reads zero on canonical.
- **Phase 2 (flip):** prereqs 1–3 are already resolved, so once Phase 1 has confirmed the canonical mechanical baseline reads zero over a PR or two, set `BIAS_GATE_ENFORCE_MECHANICAL=1` so the mechanical axis blocks. Distributional stays WARN indefinitely (revisit only if a sourced NGN reference distribution is ever adopted — a separate decision).

## 8. Out of scope

- Editing existing canonical distributional FAILs (dilution only, never mass edits — principle 16).
- A sourced NGN reference distribution for SATA counts (keep the deterministic degeneracy rule).
- Highlight / bowtie positional nulls beyond what the lib already emits (highlight order is clinically meaningful and never shuffled).
- Any change to learner-upload validation (gate is canonical/promotion-only; uploads stay forgiving).

## 9. Acceptance criteria

- `npm run audit` prints `audit:non-mcq-bias:mechanical`, `:distributional`, and (if ever triggered) `:manual` lines under a Tier-2 advisory header.
- The `audit.ts` final verdict is correct: an all-PASS run prints "GATE PASSED — clean" (verdict bug fixed).
- With `BIAS_GATE_ENFORCE_MECHANICAL=1` a mechanical FAIL exits 1; with `0` it prints the FAIL but exits 0. Distributional/manual WARN never change the exit code.
- The adapter calls the lib directly: no `npm run audit:non-mcq-bias` shell-out and no `audit/non-mcq-bias-report.*` / layer-B writes from the gate path.
- The `fix_class` switch is exhaustive over `BiasFixClass`; `RATIONALE_REPAIR` is excluded with `audit:references` asserted present; an unknown class throws.
- `scramble_depth` (and `all_rows_same_column`) return `INSUFFICIENT` below `scramble_min_n`; the `n=3` case can no longer FAIL.
- `promote`/`consolidate` aborts on a post-shuffle mechanical tell **before** writing staged files.
- Existing `references` / `positions` / `integrity` / `ids` behavior unchanged; all §6 tests pass; determinism holds.
- `DECISIONS.md` open thread updated: sub-decision 1 (audit placement) resolved by this spec; sub-decisions 2 (promote-time normalization) and 3 (loose thread / template key) resolved per §7.
