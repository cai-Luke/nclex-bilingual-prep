# Terminal-Sentence Remediation Delivery

Status: **COMPLETE**

## Outcome

- In-scope rows: 35
- Repaired and retained: 34
- Retired: 1 — queue 162, `claude_moc_deleg_matrix_08`
- Content-gated rows independently checked: 17
- Claude dispositions: 17 `APPROVE_FOR_APPLY`, 0 `REVISE`, 0 `RETURN_TO_OWNER`
- Banks changed: `claude-canonical.json`, `gemini-canonical.json`, `gpt-canonical.json`, `hard-cases-canonical.json`
- Queue 2235: present, retained, untouched
- `DECISIONS.md`: untouched
- Merge, commit, and push: not performed

Queue 162 retired because the pre-authoring source test found no single explicit policy that
uniquely supports all six keyed UAP/LPN/RN assignments without inventing a uniform “common U.S.”
scope. The NCSBN framework expressly leaves scope to jurisdiction and employer policy, and the
reviewed jurisdictional sources did not cure the complete matrix. The exact payload is archived at
`Archive/terminal-sentence-remediation-2026-07-22/queue-162-retired-item.json`.

No D5 disclaimer-dependent retirement fired. All seven naturalization rows remained uniquely
scorable after removal or relocation of authorial framing. Queues 2123 and 2228 were retained after
rewrite-first review.

## Independent checker

Claude Opus 4.7 reviewed the complete content packet after all proposed prose was frozen. Its signed
row dispositions are in `claude-checker-dispositions.jsonl`. All 17 rows were approved before live
application.

For queue 1731, live disk contains six embedded parts despite the controlling documents saying
five. Claude agreed that the preservation-safe interpretation is to retain all six. The patch
changes only the Stage-2 exhibit state and `_q5` stem; it preserves the ordered-response type,
options, `A,B,C,D,E` key, and every other case field.

## Coverage impact

Queue 162 was one standalone, medium-difficulty `matrix` item in Management of Care /
Prioritization & Delegation. Deterministic delta:

- Session units: 1,892 → 1,891
- Standalone supply: 1,747 → 1,746
- Scored leaves: 2,478 → 2,477
- Management of Care session units: 284 → 283
- Management of Care scored leaves: 375 → 374
- Matrix session units: 199 → 198
- Matrix scored leaves: 341 → 340
- Medium difficulty session units: 984 → 983
- Medium difficulty scored leaves: 1,228 → 1,227

No category delivery shortfall was created.

## Verification

Passed:

- `npm run validate-bank -- banks/*.json`
- `npm run scan-unknown-keys`
- `npm run audit` — 0 blocking authorial-leakage findings; existing 451 stage-reference advisories
- `npx tsc -b --pretty false`
- `npm run test:grading`
- `npm run test:case-completeness`
- `npm run test:audit-stage-refs`
- `npm run test:audit-ids`
- `npm run test:highlight`
- `npm run census && npm run census:check`
- `npm run build`
- `npm run validate-sweep -- Archive/Fixtures/validate-sweep/good_min.jsonl Archive/Fixtures/validate-sweep/good_min.summary.json --strict`
- `npm run test:validate-sweep`
- `npm run test:schema-bank`
- `npm run coverage-report`
- `fix-bank-quotes` on temporary copies of all four Chinese-edited banks — all already parsed

The implementation spec's bare `npm run validate-sweep` command is not executable because the
script requires a manifest and summary. The clean strict fixture invocation and the complete
validator regression suite were run instead.
