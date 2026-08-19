# Terminal-Sentence Independent Checker Salvage — Snapshot Reconciliation Addendum

Date: 2026-07-22  
Owner: Project Shrimp architect seat  
Status: ratified owner addendum for recommission  
Applies to: `TERMINAL-SENTENCE-INDEPENDENT-CHECKER-SALVAGE-SPEC-2026-07-22.md`

## 1. Owner finding

The prior Codex run correctly stopped under the literal frozen salvage spec, but its status label does not describe the actual repository history.

The mismatch between the queue-recorded GPT-bank SHA-256 and the current live GPT bank is not an unexplained concurrent mutation. It is the already authorized and verified implementation of the July 15–16 GPT construct audit:

- queue/pre-removal SHA-256: `61664a6bef854ec8d7a3a0113779a4773135724aabfdec65b970b7ac6464c5d2`;
- current/post-removal SHA-256: `2a3bb79809e1407e8c915965e6212898c58dc721ceb54de701e5e2b374e0e389`;
- 37 owner-retired items removed and archived;
- 13 owner-FIX items removed into repair quarantine;
- all 721 retained payload hashes unchanged;
- retained order unchanged.

Authoritative reconciliation evidence:

```text
audit/july16-coverage-construct-audit-2026-07-21/bank-implementation-closeout.md
audit/july16-coverage-construct-audit-2026-07-21/post-removal-verification.json
scripts/patches/2026-07-21-gpt-july16-construct-disposition-manifest.ts
```

The existing blocked run beneath:

```text
audit/terminal-sentence-independent-checker-2026-07-22/gpt-5-6-sol/
```

must remain unchanged as an honest execution of the superseded snapshot rule.

## 2. Recommission directory

Use a new model slug and directory:

```text
audit/terminal-sentence-independent-checker-2026-07-22/gpt-5-6-sol-recommission/
```

Do not overwrite, normalize, or delete the blocked run.

## 3. Authorized snapshot reconciliation

Before semantic review, prove mechanically that:

1. the current GPT-bank hash exactly equals the verified post-removal hash above;
2. the queue-to-live difference is exactly the 50 IDs in `REMOVAL_IDS`;
3. no retained question payload changed;
4. retained order is unchanged; and
5. no other bundled bank drifted from the queue snapshot.

When all five conditions hold:

- use mechanical status `NONCONFORMANT_BUT_ANALYZABLE`;
- record an `authorizedPostSnapshotRemoval` section with the exact 50 IDs and evidence paths;
- do not classify this state as concurrent bank change;
- treat the current bundled banks as the authoritative live semantic surface.

Any additional missing, changed, reordered, or newly added live identity remains a blocking mismatch.

## 4. Five selected tombstones

The frozen checker population selected five queue identities that are among the authorized 50 removals:

```text
2052 — gpt_balance2_2026_07_15_or_psychotropic_medications_10
2073 — gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13
2096 — gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18
2109 — gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13
2127 — gpt_balance6a_2026_07_16_bt_perioperative_care_13
```

Disposition:

- preserve all five in `checker-population.jsonl` and `sample-manifest.jsonl`;
- add selection/status marker `AUTHORIZED_POST_SNAPSHOT_REMOVAL`;
- do not substitute, reselect, or shrink the frozen sample silently;
- do not create semantic adjudication rows pretending that archived or quarantined payloads are live items;
- mechanically close them as tombstones using the owner disposition, archive/quarantine location, and post-removal verification;
- exclude them from the reviewed-live-PASS and deterministic-sample false-negative denominators.

This yields:

```text
frozen checker population: 610
mechanically reconciled tombstones: 5
live semantic-review population: 605
frozen deterministic sample: 265
sample tombstones: 5
live deterministic-sample denominator: 260
```

No replacement sample rows are authorized after membership has been observed.

## 5. Completion and salvage accounting

For this recommission, the expanded deterministic sample is complete when:

- all 260 live deterministic-sample rows receive direct semantic review; and
- the five selected tombstones are mechanically reconciled exactly as authorized above.

The final report must separately state:

- frozen population count;
- live semantic population count;
- tombstone count;
- live semantic rows completed;
- frozen sample count;
- live sample denominator;
- tombstone exclusions;
- false-negative rates calculated only over live reviewed Sonnet PASS rows.

The five tombstones do not count as checker misses, confirmed passes, unresolved semantic rows, or producer conflicts. They are no longer learner-visible bank content and are already governed by the completed construct-audit disposition.

All other salvage thresholds remain unchanged. In particular, every one of the 605 live population rows must be directly reviewed, including all live Sonnet findings, forcing rows, placement signals, family-expansion rows, and live rows in the nonconformant tail.

## 6. Provenance and waiver

The standard-workhorse owner waiver recorded in the blocked delivery remains in force for the recommission. It permits Codex routing only and relaxes no semantic, evidence, sampling, producer-conflict, or acceptance requirement beyond the exact snapshot reconciliation stated in this addendum.

No bank mutation, remediation implementation, commit, or push is authorized.
