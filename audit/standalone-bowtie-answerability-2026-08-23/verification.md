# Mechanical verification receipt

Target: `gpt_case_nine_month_well_child_safety_01_bowtie`

## Exact-diff proof against HEAD

- Target matches: 1 before / 1 after.
- `gpt-canonical.json` top-level questions: 760 before / 760 after.
- Top-level ID sequence: unchanged.
- All 759 unrelated question payloads: byte-equivalent after JSON parsing; SHA-256 before and after
  `ac7103fb57c6bad9450703abc86d55b44b4ce926c3040fcfeefd16899c48d5ca`.
- Immutable target fields unchanged: `id`, `itemType`, `category`, `topic`, `difficulty`, `ngnSkill`, and
  `glossary`.
- Token cardinality: 3 conditions / 4 actions / 4 parameters.
- All 5 keys resolve, all 11 token IDs are unique, and rationale coverage is exactly 11 of 11.
- Actual bank diff: 61 inserted lines / 61 deleted lines, confined to the one target payload.
- The incremental review correction changes exactly two learner-facing leaves: the English and Chinese
  text of `bowtie.actions.tokens[id=act_defer_teaching]`; its ID and every scoring reference remain
  unchanged.
- Reconstructed base-repair output (full patch with the late correction excluded) versus the live bank:
  changed leaves are exactly `bowtie.actions.tokens[1].en` and
  `bowtie.actions.tokens[1].zh`; the action, condition, and parameter keys, target ID, companion-case
  payload, and all 759 unrelated question payloads are unchanged.

The declarative patch names the exact before/after value for each authorized path:

- `stem`
- `bowtie.condition.tokens[id=cond_ipv]`
- `bowtie.condition.tokens[id=cond_knowledge_deficit]`
- `bowtie.actions.tokens[id=act_teach_apap_remove_hazards]`
- `bowtie.actions.tokens[id=act_assess_apap]`
- `bowtie.actions.tokens[id=act_defer_teaching]`
- `bowtie.actions.correct`
- `bowtie.parameters.tokens[id=param_growth_hgb]`
- `bowtie.parameters.tokens[id=param_teachback]`
- `bowtie.parameters.tokens[id=param_lead]`
- `bowtie.parameters.tokens[id=param_asq]`
- `bowtie.parameters.correct`
- `rationale.correct`
- `rationale.byChoice[refId=cond_knowledge_deficit]`
- `rationale.byChoice[refId=cond_neglect]`
- `rationale.byChoice[refId=cond_ipv]`
- `rationale.byChoice[refId=act_assess_apap]`
- `rationale.byChoice[refId=act_teach_apap_remove_hazards]`
- `rationale.byChoice[refId=act_cps_now]`
- `rationale.byChoice[refId=act_defer_teaching]`
- `rationale.byChoice[refId=param_teachback]`
- `rationale.byChoice[refId=param_growth_hgb]`
- `rationale.byChoice[refId=param_lead]`
- `rationale.byChoice[refId=param_asq]`
- `testTakingStrategy`

## Gate results

- Canonical patch dry-run: PASS; 760→760; in-process validation PASS; parity warnings none.
- Full canonical patch representation (run against HEAD): PASS; 760→760; in-process validation PASS;
  parity warnings none.
- Incremental `--late-fix-only` canonical P15 apply with exact reason: PASS; 760→760; in-process
  validation PASS; parity warnings none.
- Base-repair reconstruction proof: PASS; only the two requested distractor-text leaves differ from the
  live bank, and all prior accepted keys remain equal.
- `npm run validate-bank -- banks/*.json`: PASS, all 13 banks.
- `npm run audit`: exit 0. Structural, references, positions, IDs, producer-vocabulary, and authorial-
  constraint gates pass. Existing repository-wide notices remain: no raw drafts for integrity comparison
  and 451 stage-reference advisories; neither is caused by this standalone bow-tie correction.
- `npm run test:bowtie`: PASS.
- `npm run test:grading`: PASS.
- `npm run test:schema-bank`: PASS.
- `npm run test:audit-validate-bank`: PASS.
- `npm run test:audit-references`: PASS.
- `npm run test:audit-ids`: PASS.
- `npm run coverage-report`: PASS; 1,930 session units / 2,516 scored leaves / 199 visual artifacts.
- `npx tsc -b --pretty false`: PASS.
- `npm run build`: PASS, including Vite production build, file build, and build-identity validation; only
  the existing chunk-size advisory was emitted.
- `npm run census:check`: PASS.
- Requested `npm run census`: reproduced 1,930 / 2,516 / 199 and changed only timestamp/input-SHA
  metadata. The generated files were restored to their pre-run bytes under the repo's no-movement
  procedure, then `census:check` passed again.
- `git diff --check`: PASS.

## Independent-review disposition

The first independent non-GPT Claude content review returned `NEEDS_FIX` for exactly one finding:
`bowtie.actions.tokens[id=act_defer_teaching].en` and `.zh` inherited the companion-case phrasing
“the one-month follow-up” / “1 个月随访,” which presupposed a follow-up context not established by
the standalone stem. The accepted correction changes that distractor to “a follow-up visit in one
month” / “1 个月后的随访就诊.” No other content, key, rationale, ID, cardinality, companion-case,
dosage, or question was changed in response to that review.

The same Claude seat then re-ran the complete eight-point checklist and returned **`APPROVE_FOR_APPLY`**.
It independently re-confirmed all five keyed targets from the standalone stem, closed the prior
`act_defer_teaching` finding, verified EN/ZH parity, rechecked 3/4/4 cardinality, 11 unique token IDs,
11/11 `rationale.byChoice` coverage, all five key references, and the five-point grading construct, and
independently reran `validate-bank`, `test:bowtie`, and `test:grading` successfully. The separately
reported companion-case 5 mL versus 8.9 kg inconsistency does not invalidate the standalone item and
remains outside this repair commission.

Independent content review is complete. No push was performed. `PROJECT-HISTORY.md` was not updated;
this bounded repair and its final producer/checker chain are recorded in the bank review ledger.
