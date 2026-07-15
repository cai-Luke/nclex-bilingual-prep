# Claude Adjudication Handoff — Non-MCQ Distribution Remediation Evidence Review

Authored by Claude (architect seat), 2026-07-15. Written before the Codex inventory run.

**Purpose.** Adjudicate the evidence artifacts Codex produces under `audit/content-demand-2026-07-14/`
against `BANK-DEMAND-DISTRIBUTION-INVENTORY-SPEC.md`. Codex produces evidence; Claude adjudicates it.
That sequence is load-bearing (DECISIONS.md principle 2, producer != checker) — this session does not
re-run, re-author, or "fix up" the inventory. If the artifacts are inadequate, the ruling is that they
are inadequate, and the remedy is a corrected Codex pass.

**Why this file is now at repo root.** It was authored under `audit/content-demand-2026-07-14/` while
the Codex run was pending so the spec's clean-start condition remained satisfiable. After Codex
completed and committed the scoped audit artifacts, this handoff was moved to the normal root-level
handoff location as a separate mechanical step.

---

## Read order (pull live; do not reconstruct from memory)

1. `CLAUDE.md`
2. `AGENTS.md`
3. `PROJECT-HISTORY.md`
4. `DECISIONS.md`
5. `NCLEX-Question-Schema.md`

Then, under `audit/content-demand-2026-07-14/`:

6. `BANK-DEMAND-DISTRIBUTION-INVENTORY-SPEC.md` — the executable contract (read the **live** file; see
   "Spec amendment status" below)
7. `CONTENT-DEMAND-HANDOFF.md` — Codex's own handoff
8. `distribution-inventory.md`
9. `distribution-inventory.json`
10. `content-commission-manifest.json`
11. `generate-content-demand.ts`

Connector note: only the `MCP:` / `fsmcp` tools reach this repo. The `Filesystem:` tools are scoped to
the microscopy projects and cannot see Project Shrimp; an "access denied" means wrong connector, not a
missing file.

---

## Session lineage

- **2026-07-15, architect pass 1.** Claude ruled on the two standing distributional findings
  (`select_all / correct_count_distribution`, `ordered_response / template_repetition`). Verdict:
  STOP-and-rule, not a production manifest. Both findings were adjudicated as audit-rule, partition,
  and low-n artifacts rather than genuine learner-facing bias. Stop-conditions (a) "clearing the
  warning would require clinically unnatural items" and (b) "the warning exists only because of an
  invalid low-n or file-boundary assumption" were both triggered. No SATA retire-and-replace and no
  ordered-response regeneration were commissioned.
- **2026-07-15, architect pass 2 (this pass).** Claude reviewed
  `BANK-DEMAND-DISTRIBUTION-INVENTORY-SPEC.md` as an executable analysis contract. Verdict: AMEND, 5
  blocking defects (B1–B5) plus non-blocking simplifications. Luke applied all of them plus his own
  step 8b. One residual (R1) and one minor cross-reference were raised afterward and routed to Luke.
- **Next (this handoff's session).** Adjudicate Codex's evidence.

---

## Ratified 2026-07-15 — do not re-litigate

Luke ratified these. The Codex inventory is the *evidence base* for the implementing spec, not a
re-opening of them.

- **A1 — governing population.** The bundled bank (`global`), with option-count / sequence-length
  cohorts as the meaningful sub-population. Per-canonical-file distributional verdicts are
  authoring-hygiene advisories only and do not, on their own, drive content remediation. Canonical
  source-file boundaries are not learner-visible populations.
- **A2 — SATA `correct_count_distribution`.** Remove the `sata_missing_count_fails` sub-rule from the
  bias audit (it conflates coverage with bias and fails 100% of non-empty SATA banks). Keep
  `sata_count_degeneracy = 0.70`. Add an `INSUFFICIENT` gate below a minimum n.
- **A3 — ordered `template_repetition`.** Add a minimum-n `INSUFFICIENT` gate, matching the sibling
  `scramble_depth` check that already carries one. Keep `template_repeat_max_share = 0.15`. Stop the
  `global` scope inheriting per-file distributional FAILs; global verdicts stand on their own
  statistic.

These imply a `DECISIONS.md` amendment (a principle-16 clarification plus two principle-27
rule-narrowings). That amendment is architect-only and needs Luke's exact-wording sign-off. It has not
been written.

---

## Reserved to this session — do not pre-decide, and do not let Codex have decided them

The spec deliberately withholds these from Codex. Codex flags them via `requiresClaudeRuling` and
`requiresContentJudgment`; it does not settle them:

- the SATA ruling (including whether any missing correct-count bin implies content is owed);
- the low-N ruling;
- the inheritance ruling;
- the frozen-bank ruling;
- any retirement ruling;
- any content commission.

**Check for leakage.** If any artifact asserts one of these rather than flagging it, that is itself a
finding: Codex exceeded its seat. Watch particularly for a manifest row that reads as a decided
retirement, or an inventory sentence that converts "audit_policy_review" into implied content debt.

---

## Known input conditions (verified live 2026-07-15)

- **`BANK-CENSUS.md` is fresh.** All 13 live banks were compared against it; every count matches. The
  spec's step-4 census hard stop should not fire. If Codex reports it firing, something changed after
  2026-07-15 — investigate before proceeding.
- **`audit/non-mcq-bias-report.md` is stale**, and `npm run audit` does not rewrite it (the gate
  adapter calls the lib directly and writes nothing). The spec forbids regenerating it. The inventory
  is therefore *expected* to disagree with it. Confirmed drift as of 2026-07-15: gpt SATA n 93 -> 105,
  visual SATA n 10 -> 11, global SATA n 361 -> 374, global ordered n 217 -> 220. Treat disagreement as
  expected input drift; treat *agreement* with the stale report as suspicious.
- **Audit config is current.** `NON_MCQ_BIAS_CONFIG` sha256
  `0de1f0b1467dfe03d0ade981ef5feb09c3b91e89bdce861f109e0138e97ce2af` matches the committed report's
  header, so the report is config-current but content-stale.

---

## Independent cross-check numbers — read the caveat first

**Caveat, and it matters.** The numbers below were derived by Claude on 2026-07-15 by
*re-implementing* the deterministic core in Python against the live bank JSONs. That is precisely the
method the spec's step 8a forbids for the artifact, and for the right reason: a re-implementation can
drift from the lib it purports to measure. Codex's API-derived numbers are **authoritative**; these are
**the suspect party**. Their only role is as a tripwire — a large divergence means investigate, not
overrule. A small divergence probably means my re-implementation is wrong.

Derived at census SHA `6cdd0df238743a39cd30a329eb84ee07eb3773be`.

**SATA `correct_count_distribution`** (population = flattened graded leaves):

- global n=374, topShare 0.5749, histogram `{2:5, 3:111, 4:215, 5:42, 6:1}`
- global 5-option: `{2:5, 3:76, 4:83, 5:3}`, missing `[1]`
- global 6-option: `{3:35, 4:132, 5:39, 6:1}`, missing `[1, 2]`
- per bank: burn 1 (1.0) | claude 30 (0.633) | device 1 (1.0) | gemini 168 (0.518) | gpt 105 (0.581) |
  hard-cases 55 (0.636) | io 2 (1.0) | mar 1 (1.0) | visual 11 (0.909)
- globally absent counts are 1-of-5, 1-of-6, 2-of-6.

**Ordered `template_repetition`:**

- global n=220, top_share 0.0318 (native PASS), sequence lengths `{3:1, 4:93, 5:119, 6:7}`
- `lab-canonical` n=4, top_share 0.25, and all four promoted templates are **distinct**:
  `1,2,0,4,3` / `1,3,0,2` / `2,0,1,3` / `3,2,1,0`
- the four lab items are clinically distinct (hyperkalemia, prerenal AKI, GI bleed, hypercalcemia);
  three share an assess -> notify -> intervene -> prepare nursing-process skeleton, which is correct
  clinical prioritization rather than a repeated authoring template.

**Populations:**

- top-level 1729, case parents 143, embedded parts 721
- `graded_leaves` = 2307 = `commissionable_standalone` 1586 + `embedded_case_parts` 721
- census `gradedTotal` = 2450 counts case parents as graded. **2307 and 2450 must not be reconciled**;
  the spec's population-definitions section says so explicitly.

---

## Gates for the artifacts

Structural / contract:

- [ ] reconciliation invariant `graded_leaves = commissionable_standalone + embedded_case_parts` proved,
      per-bank and in total
- [ ] every `nativeVerdict` obtained via step 8a; every per-item template / Kendall via step 8b; **no
      re-implementation** of `analyzeOneBank`, `permutationTemplate`, or `normalizedKendall` anywhere in
      `generate-content-demand.ts` (read the generator; do not take the handoff's word for it)
- [ ] `analyzeOneBank` was not exported and `scripts/**` outside this directory is untouched
- [ ] byte-identical regeneration confirmed, including the HEAD-derived `generatedAt`
- [ ] every changed path under `audit/content-demand-2026-07-14/`; no bank, audit code, census, ledger,
      or governance file changed
- [ ] provenance `commands` populated from real captured exit codes, not hand-entered

Analytic:

- [ ] `metrics.failureCauses` populated on every native FAIL, and the disposition mapping is **total**
      over live scopes — no scope left without a disposition. Watch the n=1 banks (burn, device, mar):
      forced concentration at n=1 was the R1 gap. Also confirm `io` (n=2) is handled.
- [ ] `nativeVerdict` vs `effectiveVerdict` cleanly separated; no inherited global failure described as
      native global concentration; `inheritedFrom` populated from
      `metrics.inherited_per_bank_failures`
- [ ] the eight "conclusions to test, not assume" each confirmed or refuted **from live disk**, with
      evidence, not restated from the spec
- [ ] routing simulations use real `routeCanonical` on filenames (not `visual.kind`), and the four lab
      simulations are present and separate
- [ ] `topicNormalized` produced by the imported `normalizeTopic`, not a re-implementation; census
      raw-topic divergence recorded rather than reconciled
- [ ] exactly 15 `bank_expansion` units, conditional content-judgment rows clearly separated from any
      production-ready subset
- [ ] no `ConditionalTemplateProjection` claims a final template pre-promotion

---

## Spec amendment status — verify against live disk

Claude's review raised B1–B5 (blocking) plus non-blocking items; Luke applied all of them, and added
step 8b himself (correctly — `permutationTemplate` and `normalizedKendall` are private, so B1 as
originally written would have forced re-implementation through the back door).

**Two items were raised after that pass and routed to Luke for insertion. Do not assume they are
present — read the live spec:**

- **R1 (residual, same class as B4).** Rule 3a diverts any failure whose causes include `concentration`
  to rule 4, but rule 4 requires *non-low-n* concentration. At n=1 `topShare` is mechanically forced to
  1.0, so burn / device / mar fall through the mapping with no disposition. Minimum achievable
  `topShare` is `ceil(n / k) / n`, so forced concentration exists only at n=1 against the 0.70
  threshold; `io` at n=2 has a genuine 1.0 and is caught by rule 6 as frozen. Fix: treat a forced
  concentration as `low_n_impossible` rather than `concentration`, so rule 3a does not divert it.
- **Minor.** The Deterministic-promotion-shuffle section says compute `promotedTemplate` "directly from
  the stored canonical options and correct arrays," which can read as license to hand-roll the template
  now that 8b exists. A one-line cross-reference to 8b closes it.

If either is absent from the live spec and the Codex run already happened, check whether the gap
actually bit — an absent R1 most likely shows up as burn / device / mar carrying an invented or missing
disposition.

---

## After adjudication

Sequenced, not parallel:

1. Rule on the reserved questions using the Codex evidence, honoring A1–A3.
2. Author the Codex spec for the A2/A3 audit-code change: min-n `INSUFFICIENT` gates on both
   distributional checks, remove `sata_missing_count_fails`, stop global inheritance for distributional
   checks, bump `NON_MCQ_BIAS_CONFIG.audit_version` (the config hash changes), regenerate
   `audit/non-mcq-bias-report.md` from live disk. Gates per the AGENTS.md schema/audit tier:
   `npm run test:non-mcq-bias` with new fixtures (n<min-n -> INSUFFICIENT; missing-count no longer
   FAILs a healthy bank; global no longer inherits), `npx tsc -b --pretty false`, `npm run audit`,
   `npm run build`.
3. Draft the `DECISIONS.md` amendment for Luke's exact-wording sign-off. Architect-only; Codex does not
   write to it.

**Projected before/after under A1–A3** (from architect pass 1; re-derive against Codex evidence rather
than trusting this table):

| check | before (live) | after |
|---|---|---|
| SATA `correct_count_distribution` FAIL | burn, claude, device, gemini, gpt, hard-cases, io, mar, visual, global (10) | burn/device/io/mar -> INSUFFICIENT; claude/gemini/gpt/hard-cases/global -> PASS; visual -> FAIL (n=11, 0.909) |
| ordered `template_repetition` FAIL | lab, global (2) | lab -> INSUFFICIENT; global -> PASS (0) |

The single honest residual signal is expected to be `visual-canonical` SATA (10 of 11 at 4-correct).
Architect pass 1 dispositioned that as a standing note to the `visual-canonical` authoring lane — vary
SATA correct-counts where clinical truth naturally allows — explicitly **not** retire-and-replace, since
retiring necessity-gated visual items to move a histogram would violate principles 6 and 25. Codex's
evidence may sharpen or overturn that; it is not pre-decided.

---

## Open threads elsewhere (context only, not this session's work)

- R9 vital-sign bounds thread awaits Luke's floor/ceiling input (DECISIONS.md revisit queue).
- A stale `PROJECT-HISTORY.md` entry was flagged for the checker seat, not fixed by Claude.
