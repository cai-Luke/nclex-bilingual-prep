# Campaign 16 Phase B — Stage 1 Producer Report

Terminal result: `CAMPAIGN16_PHASE_B_CANDIDATES_COMPLETE`.

Stage 1 produced 13 return candidates, 0 retirement recommendations, and 0 held rows. This report is candidate-authoring evidence only. Nothing was promoted, no canonical bank was modified, and no Stage 2, §10 iteration/adjudication, §10.7 publication freeze, or Stage 3 work was performed.

## Governing input and repository snapshot

- Frozen work order: `scratch/CAMPAIGN-16-PHASE-B-QUARANTINED-FIX-RECOVERY-WORK-ORDER-2026-08-27.md`
- Required and computed raw file-byte SHA-256: `756ba6c10206bc2a197bb9cd577f1a2789829e3e73127145254858a7649b8b51` — exact match.
- Repository: `/Users/holemini/Desktop/Project Shrimp`
- Branch: `main`
- `HEAD`: `3286024bcab90c1a114811a7202d956c3e586bf4`
- Upstream: `origin/main`
- Ahead / behind: `0 / 0`

Complete dirty-path list at §6.1 entry:

```text
 M BANK-CENSUS.md
 M CLAUDE.md
 M STAGE-REFERENCE-SEMANTIC-CENSUS-GEMINI-CALIBRATION-SPEC-2026-07-23.md
 M census.json
?? audit/campaign-16-phase-a-baseline-2026-08-26/baseline.json
?? audit/campaign-16-phase-a-baseline-2026-08-26/baseline.md
?? audit/campaign-16-phase-a-baseline-2026-08-26/execution-plan.md
?? audit/campaign-16-phase-a-check-2026-08-26/check.json
?? audit/campaign-16-phase-a-check-2026-08-26/check.md
?? audit/campaign-16-phase-a-check-2026-08-26/comparison.md
```

No path under the bundled `banks/*.json` set was dirty. Every pre-existing path above was preserved.

## §1.5 entry identity

Hash convention: raw file bytes, `sha256(file bytes)`. These values are not payload hashes.

| Bundled bank | Campaign 16 baseline | Stage 1 entry | Result |
|---|---|---|---|
| `banks/burn-canonical.json` | `5244b8d37daa49adbd1fbed7991f4ede52ded8ce710e26821841ef5e2ce3719f` | same | PASS |
| `banks/capnography-canonical.json` | `36d72a89405fe4400f27b3b8969cdbe1c51f3217151f8b2592b7f877d636f20c` | same | PASS |
| `banks/claude-canonical.json` | `25f53ded1ac21da4ca9d211040c3f6110ebee38d72ba41d0fc64fe358ba73b71` | same | PASS |
| `banks/device-canonical.json` | `83d5a6ac7219524f4c528265291cbee2ed5b2f17c13fbeb3649342bae2e4aac5` | same | PASS |
| `banks/gemini-canonical.json` | `3dc416a4652f5f5712219dde7de87b92f0697fac953750b8abb8fc0dbb976bb6` | same | PASS |
| `banks/gpt-canonical.json` | `be83c943bbe6e50297de94d25b596069767b8fee876426ec798dc66ca8d5a76d` | same | PASS |
| `banks/hard-cases-canonical.json` | `8068c6917e53257a31c7299454c213f61bea62e61d7cf185cb1a09386f4e4862` | same | PASS |
| `banks/io-canonical.json` | `2ce6488e65049ba00cd9dccf889a042e0a624f224387382d564d282e147b2645` | same | PASS |
| `banks/lab-canonical.json` | `1038cb68f6b91f6a2c981562d97ad9e16179db9b1332c75725fd538595c44b05` | same | PASS |
| `banks/mar-canonical.json` | `f12c03a28ff5b52411843f84bc942b4ca5667e989194357ed2d60a394f17641e` | same | PASS |
| `banks/medlabel-canonical.json` | `cc3bd0053516fc7ea4b23e814e46f186e6d2dbf40888fa713a862c07ea2b3993` | same | PASS |
| `banks/visual-canonical.json` | `e42e2a3fa6aa349a61279e6988e250e65c2b752a6f36d33806a2671e0af0f9e4` | same | PASS |
| `banks/vitals-canonical.json` | `5154e25492bced8e4a49d763f04e25e154389c31e085bf37669651e13d411b9d` | same | PASS |

The same 13 values were recomputed after candidate authoring and remained identical.

## Archive reconciliation and hash conventions

Archive reconciliation passed: wrapper count 13, actual archive rows 13, manifest count 13, manifest payload rows 13, 13 unique IDs, no archive-only or manifest-only row, and 13/13 payloads equal both declarations.

- **Archive convention:** `sha256(JSON.stringify(question, null, 2))`, original key insertion order, indent 2, no trailing newline. Used only for reconciliation with the archive wrapper and its sibling manifest.
- **Campaign convention:** `sha256(stableJson(question, 0))`, recursively sorted keys, JSON indent 0, with trailing newline. Used for every candidate payload hash emitted by Stage 1.
- **Raw file-byte convention:** SHA-256 over the file's bytes. Used for work-order identity, bank identity, and artifact file hashes. It is not compared with either payload convention.

## Fresh rederivation and dispositions

Every row was re-derived from the archived payload and reconciled as agreement with the owner-accepted class. The five checker-addition rows were treated with the same authority as the eight primary-recommendation rows. No derivation disagreed, no row was `NO_DEFECT_REDERIVED`, and no repair required a key or construct change.

| Original ID | Governing class | Owner-decision source | Stage 1 disposition | Smallest repair |
|---|---|---|---|---|
| `gpt_balance2_2026_07_15_dc_client_advocacy_02` | `MECHANICAL_CLOZE_DEPENDENCY` | `CHECKER_ADDITION_ACCEPTED` | `RETURN_CANDIDATE` | Replace two absurd rights distractors and align their rationale. |
| `gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08` | `MECHANICAL_CLOZE_DEPENDENCY` | `CHECKER_ADDITION_ACCEPTED` | `RETURN_CANDIDATE` | Replace four crude or irrelevant handoff distractors. |
| `gpt_balance3_2026_07_16_dc_psychotropic_medications_11` | `MECHANICAL_CLOZE_DEPENDENCY` | `CHECKER_ADDITION_ACCEPTED` | `RETURN_CANDIDATE` | Replace six unrelated distractors with medication-relevant competitors. |
| `gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13` | `ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION` | `PRIMARY_RECOMMENDATION_ACCEPTED` | `RETURN_CANDIDATE` | Delete the answer-bearing downtime-plan enumeration. |
| `gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18` | `ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION` | `PRIMARY_RECOMMENDATION_ACCEPTED` | `RETURN_CANDIDATE` | Replace the verbatim before/after answer recital with scenario cues. |
| `gpt_balance5_2026_07_16_mx_client_advocacy_02` | `ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION` | `PRIMARY_RECOMMENDATION_ACCEPTED` | `RETURN_CANDIDATE` | Delete the complete ADA rule recital. |
| `gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13` | `ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION` | `PRIMARY_RECOMMENDATION_ACCEPTED` | `RETURN_CANDIDATE` | Delete the four-answer plan recital while retaining the domains. |
| `gpt_balance5_2026_07_16_mx_standard_precautions_hygiene_15` | `ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION` | `PRIMARY_RECOMMENDATION_ACCEPTED` | `RETURN_CANDIDATE` | Delete the answer-bearing cleanup sequence. |
| `gpt_balance6a_2026_07_16_bt_perioperative_care_13` | `ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION` | `PRIMARY_RECOMMENDATION_ACCEPTED` | `RETURN_CANDIDATE` | Delete the LAST protocol/action recital. |
| `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05` | `WEAK_OR_NONCOMPETING_DIFFERENTIAL` | `CHECKER_ADDITION_ACCEPTED` | `RETURN_CANDIDATE` | Replace two administrative distractors with realistic HIPAA TPO purposes. |
| `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07` | `WEAK_OR_NONCOMPETING_DIFFERENTIAL` | `CHECKER_ADDITION_ACCEPTED` | `RETURN_CANDIDATE` | Replace the fictional one-page rule and align its rationale. |
| `gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14` | `ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION` | `PRIMARY_RECOMMENDATION_ACCEPTED` | `RETURN_CANDIDATE` | Delete the condition/action/follow-up program recital. |
| `gpt_balance6b_2026_07_16_hl_standard_precautions_hygiene_17` | `ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION` | `PRIMARY_RECOMMENDATION_ACCEPTED` | `RETURN_CANDIDATE` | Delete the exact artificial-nail rule and length recital. |

The complete re-derived defect wording, archive hash, primary-source support for every added clinical concept, ordered patch operations, and field-level proof appear per row in `manifest.json`.

## Declarative construction and non-mutation proof

The preserved patch program is `scripts/patches/2026-08-27-campaign16-phase-b-recovery.ts`. Its materialization mode:

1. reads `items[].question` directly from the archive;
2. requires the archive wrapper and manifest counts to equal 13;
3. recomputes every question under the archive convention and requires equality with both declared hashes;
4. copies current `banks/gpt-canonical.json` bank metadata programmatically and sets `meta.count` to 13;
5. refuses to overwrite an existing input; and
6. passes the materialized envelope to `patch-raw` for semantic mutation.

The program contains 63 exact preconditioned operations: 61 `setValue`, 2 `replaceText`. For every row, the final operation is `setValue` on `path: ["id"]`, minting `<original>_r2`; no later operation addresses that row.

The manifest independently replays every ordered operation against the archived payload and compares the replay with the candidate. It also performs a recursive leaf diff. For all 13 rows:

- independent replay equals the candidate payload;
- observed changed leaf paths equal the authorized operation paths;
- unauthorized changed leaf paths: 0;
- authorized paths missing from the actual diff: 0; and
- every field outside the authorized paths is unchanged.

## Candidate hashes — campaign convention

| Minted ID | Campaign payload SHA-256 |
|---|---|
| `gpt_balance2_2026_07_15_dc_client_advocacy_02_r2` | `0e211d6eee964f939d8ad72da8332ddfca66f59019a445f8d86a7a6551f0976e` |
| `gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08_r2` | `9bbe67218947b1108d99ecbdb004e722ee8782f2b9252ab6f030e564dbbe9301` |
| `gpt_balance3_2026_07_16_dc_psychotropic_medications_11_r2` | `1cb1b4bc7aca712bf5aab8f252b32cdf538fdff2a7ef27d8a6afcc662741a5aa` |
| `gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13_r2` | `73abbcf2d7e2cfb443ceb27922a5c5c9a11de804057cb91260e0c027fcd7efd4` |
| `gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18_r2` | `e62e88406b257090f8afa67f897a71045d04f2a981a9c7eff73e9a27f7967bf9` |
| `gpt_balance5_2026_07_16_mx_client_advocacy_02_r2` | `34fbecfe2a2f14238544e67400dfcff0a39546987bb34a9eb2ab567c133af018` |
| `gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13_r2` | `5ba15a5e22cc996a8d0103ca794bcd087d944c64ab5f3be50cbbe0896216cd8e` |
| `gpt_balance5_2026_07_16_mx_standard_precautions_hygiene_15_r2` | `df213b7da5eb41a37d83caa199e4f9edc027f9d8afaf3dc493447bd82829a8b7` |
| `gpt_balance6a_2026_07_16_bt_perioperative_care_13_r2` | `1837a316611d1488e0b1c0b2a2fba0c4067d51a47c81e2a84a57d797e1342738` |
| `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05_r2` | `54ffbaed80defb0a68d78cfd8ab2b1a004ff752dccdcbd188d7aa3c035f63604` |
| `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07_r2` | `476755b6be798b4b8164dc72e9a6ec91e6bd1ef508f55613c3797784ed1a7c95` |
| `gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14_r2` | `710dc5976f92f17e9982ddfe2dfb5f3b38afcf1099acc6da51f94c5161f6716b` |
| `gpt_balance6b_2026_07_16_hl_standard_precautions_hygiene_17_r2` | `9d5bda8db1e614ab7b8b1505401f745431ad1b0980cfc5efbd06ea9a803edbb5` |

## §8 proofs

### Gate 1 — normalization and validation

- `normalize-raw-bank`: PASS, `0 structural change(s); already normalized; validation passed`, exit 0.
- `validate-bank`: PASS, `OK (13 questions)`, exit 0.

### Gate 2 — `derivePopulation` in scratch

Scratch post-return bank set:
`/var/folders/xg/4dvh83z944d7xxvff879ywgr0000gn/T/campaign16-phase-b-post-return-M8Gjjo`

The proof copied all 13 bundled banks to that non-`banks/` location, appended the 13 candidates to the scratch `gpt-canonical.json`, serialized it, then independently reloaded all 13 scratch files before calling `derivePopulation`. Only `derivePopulation`, `stableJson`, and `sha256` were imported from the standalone census module.

- Did not throw: yes.
- Suffix bowties: 50.
- Paired: 31 = 30 `EXACT` + 1 `ORDINAL_SUFFIX`.
- Unpaired: 19, all `NO_ELIGIBLE_SIBLING_CASE`.
- Result: PASS, exit 0.

### Gate 3 — uniqueness and namespace shape

The Node proof parsed the 13 top-level bundled bank files plus the candidate, enumerating 2,674 top-level and embedded question IDs. Duplicate IDs: 0. Each of the 13 minted IDs occurs exactly once. No minted ID ends in `_bowtie` or `_NN` where `NN` is exactly two digits.

Result: PASS, exit 0.

### Gate 4 — original-ID absence with controls

The bank scan actually enumerated exactly these files:

```text
banks/burn-canonical.json
banks/capnography-canonical.json
banks/claude-canonical.json
banks/device-canonical.json
banks/gemini-canonical.json
banks/gpt-canonical.json
banks/hard-cases-canonical.json
banks/io-canonical.json
banks/lab-canonical.json
banks/mar-canonical.json
banks/medlabel-canonical.json
banks/visual-canonical.json
banks/vitals-canonical.json
```

Required positive control, using the same parsed `question.id` search function: `gpt_case_hipaa_disclosure_breach_01_bowtie` found exactly once at `banks/gpt-canonical.json` `$.questions[293].id`.

| Original ID | Bundled banks | Candidate `question.id` |
|---|---|---|
| `gpt_balance2_2026_07_15_dc_client_advocacy_02` | NOT FOUND | NOT FOUND |
| `gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08` | NOT FOUND | NOT FOUND |
| `gpt_balance3_2026_07_16_dc_psychotropic_medications_11` | NOT FOUND | NOT FOUND |
| `gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13` | NOT FOUND | NOT FOUND |
| `gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18` | NOT FOUND | NOT FOUND |
| `gpt_balance5_2026_07_16_mx_client_advocacy_02` | NOT FOUND | NOT FOUND |
| `gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13` | NOT FOUND | NOT FOUND |
| `gpt_balance5_2026_07_16_mx_standard_precautions_hygiene_15` | NOT FOUND | NOT FOUND |
| `gpt_balance6a_2026_07_16_bt_perioperative_care_13` | NOT FOUND | NOT FOUND |
| `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05` | NOT FOUND | NOT FOUND |
| `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07` | NOT FOUND | NOT FOUND |
| `gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14` | NOT FOUND | NOT FOUND |
| `gpt_balance6b_2026_07_16_hl_standard_precautions_hygiene_17` | NOT FOUND | NOT FOUND |

Candidate parsed-ID control: `gpt_balance2_2026_07_15_dc_client_advocacy_02_r2` found exactly once at candidate `$.questions[0].id`.

Result: PASS, exit 0.

### Gates 5–8 — route, envelope, parity, topics

- `routeCanonical("gpt-campaign16-phase-b-recovery-2026-08-27.json")` returned exactly `gpt-canonical.json`: PASS.
- Envelope: `meta` present; `meta.count` 13; question count 13; no bank-level or per-item archive-wrapper field present: PASS.
- Bilingual parity: every displayed-text mutation has the corresponding `en`/`zh` mutation; patch engine `--strict-parity` warnings 0 and independent manifest-op parity failures 0: PASS.
- Topic English-only: 0 candidate topics contain CJK: PASS.

Combined proof command exit: 0.

### Gate 9 — canonical-bank non-mutation

`git diff --quiet -- banks/*.json` returned exit 0. The cached-index counterpart also returned exit 0. The final 13 raw file-byte hashes equal the §1.5 baseline table above.

## Verification commands

| Exact invocation | Emitted status | Exit |
|---|---|---:|
| `shasum -a 256 scratch/CAMPAIGN-16-PHASE-B-QUARANTINED-FIX-RECOVERY-WORK-ORDER-2026-08-27.md` | Exact required digest | 0 |
| `pwd` | `/Users/holemini/Desktop/Project Shrimp` | 0 |
| `git branch --show-current` | `main` | 0 |
| `git rev-parse HEAD` | `3286024bcab90c1a114811a7202d956c3e586bf4` | 0 |
| `git rev-parse --abbrev-ref --symbolic-full-name @{upstream}` | `origin/main` | 0 |
| `git rev-list --left-right --count HEAD...@{upstream}` | `0 0` | 0 |
| `git status --porcelain=v1 --untracked-files=all` | Complete entry dirty-path population captured above | 0 |
| `git diff --name-only -- banks/*.json` | No path | 0 |
| `git diff --cached --name-only -- banks/*.json` | No path | 0 |
| `shasum -a 256 banks/*.json` | 13/13 equal Campaign 16 baseline | 0 |
| Archive reconciliation command reproduced exactly below | Counts 13/13/13/13; unique 13; all hashes match | 0 |
| `npx tsx scripts/patches/2026-08-27-campaign16-phase-b-recovery.ts --help` | Patch program compiled; help printed | 0 |
| `npx tsx scripts/patches/2026-08-27-campaign16-phase-b-recovery.ts --materialize-from-archive --in banks/banks-raw/gpt-campaign16-phase-b-recovery-2026-08-27.json --out banks/banks-raw/gpt-campaign16-phase-b-recovery-2026-08-27.json --strict-parity` | Materialized 13; 63 ops applied; parity none; validation PASS | 0 |
| Patch-operation audit command reproduced exactly below | 63 ops; every row's last path `["id"]`; every last value `<old>_r2` | 0 |
| `npx tsx /tmp/campaign16-stage1-build-manifest.ts` | Initial non-gate helper attempt stopped before writing: helper mistakenly applied whole-field equality to `replaceText` | 1 |
| `npx tsx /tmp/campaign16-stage1-build-manifest.ts` | Corrected helper: wrote 13 rows; 63 ops; all non-mutation proofs PASS | 0 |
| `npm run normalize-raw-bank -- banks/banks-raw/gpt-campaign16-phase-b-recovery-2026-08-27.json` | 0 structural changes; validation passed | 0 |
| `npm run validate-bank -- banks/banks-raw/gpt-campaign16-phase-b-recovery-2026-08-27.json` | OK, 13 questions | 0 |
| `npx tsx /tmp/campaign16-stage1-gates.ts` | All §8.2–§8.8 structured proofs PASS | 0 |
| `git diff --quiet -- banks/*.json` | Quiet / no canonical-bank diff | 0 |
| `git diff --cached --quiet -- banks/*.json` | Quiet / no staged canonical-bank diff | 0 |
| `shasum -a 256 banks/*.json` | Final 13/13 equal Campaign 16 baseline | 0 |

Exact archive reconciliation invocation:

```sh
node -e 'const fs=require("fs"),crypto=require("crypto"); const d="Archive/gpt-july16-construct-dispositions-2026-07-21"; const a=JSON.parse(fs.readFileSync(`${d}/quarantined-fix-items.json`,"utf8")); const m=JSON.parse(fs.readFileSync(`${d}/manifest.json`,"utf8")); const mm=new Map(m.quarantinedPayloads.map(x=>[x.id,x.payloadSha256])); const rows=a.items.map(x=>{const computed=crypto.createHash("sha256").update(JSON.stringify(x.question,null,2)).digest("hex"); return {id:x.id,archiveDeclared:x.payloadSha256,manifestDeclared:mm.get(x.id)??null,computedArchiveConvention:computed,wrapperMatch:computed===x.payloadSha256,manifestMatch:computed===mm.get(x.id)};}); const ids=a.items.map(x=>x.id); const result={wrapperCount:a.count,actualCount:a.items.length,manifestCount:m.quarantinedFixCount,manifestRows:m.quarantinedPayloads.length,uniqueIds:new Set(ids).size,manifestOnly:[...mm.keys()].filter(id=>!ids.includes(id)),archiveOnly:ids.filter(id=>!mm.has(id)),allMatch:rows.every(x=>x.wrapperMatch&&x.manifestMatch),rows}; console.log(JSON.stringify(result,null,2)); process.exit(result.wrapperCount===13&&result.actualCount===13&&result.manifestCount===13&&result.manifestRows===13&&result.uniqueIds===13&&result.manifestOnly.length===0&&result.archiveOnly.length===0&&result.allMatch?0:1)'
```

Exact patch-operation audit invocation:

```sh
npx tsx scripts/patches/2026-08-27-campaign16-phase-b-recovery.ts --print-ops-json | jq '{count:length, kinds:(group_by(.kind)|map({kind:.[0].kind,count:length})), ids:(group_by(.id)|map({id:.[0].id,count:length,lastKind:.[-1].kind,lastPath:.[-1].path,lastAfter:.[-1].after}))}'
```

The first manifest-helper attempt was not an acceptance gate and wrote no artifact. Its own error identified a mismatch between the helper's replay implementation and the documented `replaceText` semantics. The helper was corrected to require exactly one substring occurrence, matching `scripts/patch-raw.ts`, and the full proof then passed. No candidate or patch operation was changed to accommodate the helper.

## Stage 1 artifact identities

Hash convention in this subsection: raw file bytes.

| Artifact | SHA-256 |
|---|---|
| `banks/banks-raw/gpt-campaign16-phase-b-recovery-2026-08-27.json` | `64a8333d37e17d6daf06e1b8a3553b394ea9892fcf83ec1e5beb21f0991800fd` |
| `audit/campaign-16-phase-b-recovery-2026-08-27/manifest.json` | `6b7283fc6c887b410291ba24292295ffcc31599a1412286af87a89c37c2b2016` |
| `scripts/patches/2026-08-27-campaign16-phase-b-recovery.ts` | `e0238552f78de0ce3529ba9eac1d2c7025a486a3f92a3ad2de8adcb22e3049a0` |

These are Stage 1 producer artifacts, not a Stage 2 review signature and not a publication freeze.

## Scope closeout

- Canonical banks under `banks/*.json`: unmodified.
- Promotion / consolidation: not run.
- Census generation: not run.
- `BANK-REVIEW-LEDGER.md`, `PROJECT-HISTORY.md`, and `DECISIONS.md`: unmodified.
- Stage 2: not performed.
- §10 iteration/adjudication: not performed.
- §10.7 publication freeze: not performed.
- Stage 3: not performed.
- Commit / push: not performed.

`CAMPAIGN16_PHASE_B_CANDIDATES_COMPLETE`
