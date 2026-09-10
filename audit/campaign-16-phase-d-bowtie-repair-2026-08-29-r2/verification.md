# Campaign 16 Phase D — Stage 3 Final Verification

Date: 2026-08-29  
Status: **PASS — executor closeout requirements satisfied**

## Authority and frozen inputs

- Frozen work order: `scratch/CAMPAIGN-16-PHASE-D-BOWTIE-REPAIR-WORK-ORDER-2026-08-29.md`
- Work-order SHA-256: `6a0154f7dd3cb0c663ed5bed9c6346058e1e38a16c333ae04f0c328fe0230bba` — exact live match.
- Frozen patch: `scripts/patches/2026-08-29-campaign16-phase-d-bowtie-repair.ts`
- Patch SHA-256: `cd265d54b18ec88421f5507c06faf5a2625b47c54bc38a036a29ff24e6acd12d` — exact live match.
- Operative checker: `audit/campaign-16-phase-d-check-2026-08-29-r2-retry-1/`.
- Checker terminal: exactly `CAMPAIGN16_PHASE_D_CONTENT_READY`.
- Checker disposition: 12/12 retained and `PASS_STANDALONE`; 12/12 key/construct preservation true.
- The original failed-environment checker root and the operative retry root remained read-only. Their closing inventories were respectively 1 file / aggregate SHA-256 `b9822b72a4e0c48922f73f0bced53bfb5a63081bf33763242c48bdd292664faa` and 211 files / aggregate SHA-256 `4cc52c3e950e6771fdc989207944a961e7df617e50373d5f23edd037802f495c`.

## Pre-apply gate and deterministic apply

- Stage 0 live-worktree baseline reconciled: 296/296 opening dirty paths accounted for; all tracked opening index blobs unchanged.
- Pre-existing staged `banks/gpt-canonical.json` index blob remained `044cf5cdcebbd1c02519ff724fde5167c06a00a7`.
- Current target payloads matched all 12 Stage 0 before hashes.
- Patch field preconditions: 225/225 `before`, 0 `stale`.
- Exact scope: 12 targets / 225 operations; 201 operations in `banks/gpt-canonical.json`, 24 in `banks/hard-cases-canonical.json`.
- Dry run: exit 0; `Mode: DRY RUN`; `Targets: 12`; `Operations: 225`; both expected banks; no stale precondition.
- Canonical bytes remained unchanged across the dry run.
- Live apply: exit 0; `Mode: APPLY`; exact frozen reason and exact two-bank scope.
- Idempotency rerun: exit 0; exactly `Mode: IDEMPOTENCY CHECK` and `Pending paths: 0; zero writes`.

## Canonical bank byte hashes

| Bank | Before SHA-256 | After SHA-256 |
|---|---|---|
| `banks/gpt-canonical.json` | `e4955f7b8c54e4880bd9ddb0f2f7c35881169f53051b5ed3ce21757f86287b3b` | `d7d228afc282bd15bc730be4ca5b3d2c7c14c017bbc14f3d12a7cbccbfef0f20` |
| `banks/hard-cases-canonical.json` | `8068c6917e53257a31c7299454c213f61bea62e61d7cf185cb1a09386f4e4862` | `5d47b79a1e63fe5f852eab7b4ab9b8db6ca7e9ec924037d5e81de8a8bb3ee3d1` |

## Target payload hash bridge

All observed after hashes exactly equal the successful checker's frozen `reviewedAfterPayloadSha256` values.

| Candidate | Stage 0 before SHA-256 | Live/checker after SHA-256 |
|---|---|---|
| `gpt_case_caregiver_role_strain_dementia_01_bowtie` | `7b2d554215d8a3c2249aaa9bd595721793b4f3a439663e74e76efabe5a3ff6e1` | `922adc9a7acf4b1cda695cebe7c0b5d88844e15391680a5f8b85c60a19f95aca` |
| `gpt_case_infection_control_clustered_care_01_bowtie` | `9257f536a25485a9761d3f004f6deb2679177570b83a6937f1e65ef880d45daf` | `88d06555bb372d2a363f74e1589c9de8d97685c12c41f2813ad16a996582678f` |
| `gpt_case_acute_hemolytic_transfusion_reaction_01_bowtie` | `789d52ef3191509f938526bdd66cbfb6fc32d6ee1bbb45b4a14b2c2b33f0da65` | `6913da519eccd49476f3b01edb28c906b5d8e3f6c3aefbe5c965cd1d20bea1d7` |
| `gpt_case_client_advocacy_refusal_01_bowtie` | `d601c32d131bb984399cbb131b98f3c995e4fe1ef2512ddb1d30c61757172521` | `5636b6f94099ee5ed11bd6d26f3dd60edefd5f3c060a33daf49fc20c5f9efab9` |
| `gpt_case_lateral_incivility_01_bowtie` | `fea2d76c8716a73087600efe5fd026a33cb36e5b19f28dde067b940ff57e9563` | `9c61399e8841bd49af7052b1992fc21b8235efebf6578f6df321edd2a0f14aac` |
| `gpt_case_mass_casualty_start_triage_01_bowtie` | `7cdf149aff899a7cd171c9395ec6ab23b93b571c15cb779dc169d605e1dbd4d6` | `14699e54375232b770405c3ea3fb8a46545badbad9fe2d583b75b5c1addd5779` |
| `gpt_case_gbs_respiratory_compromise_01_bowtie` | `74e4fc43567f17a8eed82ce10fd440372afe4bfde7da0878bda51fb30aa34804` | `a0a5205cbd6487a1f28de4bace689d0f84a1a9d21a73cfe3ba46dda150d211f4` |
| `gpt_case_hipaa_disclosure_breach_01_bowtie` | `9ba8faa3ec3cea8e1668c0460b2888686f1600d52186d7f5b8297dc6ae332984` | `12d06d7d3b3f114cb2dcf1f7762f22455b4c518416e2a4714b2cb22692b4be9e` |
| `gpt_case_neutropenic_fever_nadir_01_bowtie` | `f8e8ca6eddd5f48cf67ef7ea5a51d9eb5bcfea2c67def6b50eafcbf0818ac00b` | `5dbb61fdf238d2f0d87e453261e85da92e4c286cc4f24f17b2c240fc0d9d91a6` |
| `gpt_case_unsafe_premature_discharge_01_bowtie` | `d9462741c338b5041762f5f4a4c51cffd17bd54d34d17839c381b02cbd59bf5e` | `278e58ef4d14f3436a6e09a7e54441a1226dd09a507d67167891d73e23a54236` |
| `gpt_pph_2026_06_16_case_01_bowtie` | `efcc3588cf2750744fb89be66529904081f6953d6158505dfc694e48086fed39` | `09daac1927e5c17ba502b7b121148c8d06899dfd89eb821aa948d7453ac306f6` |
| `gpt_format7c_exercise_hypoglycemia_bowtie` | `df41a515bafd2325afb0a63fa1b3050ae5d6c6165213af41314d8e3e8dc8ad81` | `e81fab9bcb1ca719c4c8124959044b5137579ff6edf8d8936fcabee5234ecebb` |

Result: **12/12 exact checker after-hash agreement**.

## Preservation and direct inspection

- P26 non-authorized fields: 12/12 exact preservation by reconstructing each target from its Stage 0 live payload plus only the authorized field operations.
- Prior passing bow-ties: 38/38 unchanged from Stage 0.
- Paired companion cases: 11/11 unchanged from Stage 0; Stage 0 had already established each live payload matched its `c2ff546` identity.
- Non-target canonical records: all payload hashes and record order unchanged in both target banks.
- Structural identity: 12/12 preserve ID, category, topic, difficulty, item type, and `ngnSkill`.
- Token/key/scoring identity: 12/12 preserve token IDs and order, keyed selections, 3/4/4 response shape, and 1/2/2 scoring cardinality.
- Direct EN/ZH inspection: complete for every changed learner-facing field. All 111 bilingual operation pairs remain meaning-matched; `glossary[1].defZh` is the one schema-native Chinese-only changed field and is intact.
- JSON/smart-quote check: both target banks parse and reproduce byte-for-byte under `JSON.stringify(value, null, 2) + "\n"`; no structural smart quote or JSON corruption.
- New clinical wording: only the GBS IVIG safety qualifier, independently accepted against the FDA-approved GAMMAGARD LIQUID prescribing information recorded in `repair-manifest.json`; every other change is premise-neutral.

## Required commands

| Command | Exit/result |
|---|---|
| `npm run validate-bank -- banks/*.json` | 0; all 13 explicit bank files parsed and validated |
| `npm run scan-unknown-keys` | 0; 13 banks, 0 off-schema occurrences |
| `npm run audit` | 0; structural and standing gates passed; expected no-draft `INSUFFICIENT` and pre-existing stage-reference advisory retained |
| `npm run test:bowtie` | 0; passed |
| `npm run test:grading` | 0; passed |
| `npm run test:schema-bank` | 0; passed |
| `npm run test:authorial-constraint-leakage` | 0; passed |
| `npm run test:producer-vocabulary-leakage` | 0; passed |
| `npm run validate-sweep` | 0; current no-argument behavior printed usage only; no manifest-sweep claim is made |
| `npx tsc -b --pretty false` | 0; passed |
| `npm run census:check` | 0; `census.json is up to date.` |
| `npm run build` | 0; production and file-protocol build passed; build identity validated |
| `git diff --check` | 0 before and after ledger append |

## Mandatory trap dispositions

1. **2 MiB MCP search skip — ACTIVE/HANDLED.** All bank-wide live byte, target, control, companion, duplicate, and non-target proofs used Node/direct parsing or shell. MCP search was not used as authority.
2. **Census is not byte-stable — ACTIVE/HANDLED.** All 12 candidates were retained, so no census movement was expected. `npm run census:check` passed. Neither `census.json` nor `BANK-CENSUS.md` was regenerated or changed by Phase D.
3. **`audit:stage-refs --strict` exit semantics — N/A.** The strict command was not invoked; no failure was invented from its special exit behavior.
4. **Canonical-sweep file count — HANDLED.** Explicit `npm run validate-bank -- banks/*.json` successfully parsed and validated every one of the 13 bundled bank files. The usage-only `validate-sweep` invocation is not treated as parse proof.
5. **Frozen 2026-08-23 bow-tie generator — ACTIVE/HANDLED.** No prohibited generator, finalizer, stateful, `ingest`, `lock`, or frozen-lineage write route ran.

## Ledger and repository-state proof

- Ledger before SHA-256: `22e2ce90440506abc4f0863006ed06f3e4e26dd0564bb04450471ca7dd890ea5`.
- Ledger after SHA-256: `84bf1af9f805b3debc4623ecc6e053618e09bb9c37d7d53efe5fca1b282f8278`.
- Append-only proof: all 261,868 prior bytes remained an exact prefix; 2,875 bytes were appended.
- Exact inserted range: lines 1569–1611 inclusive; entry content lines 1570–1611.
- Ledger index blob remained the Stage 0 blob `c4259ad0ad914e6844d9f1c2f2e8428cc66440cc`; no index mutation occurred.
- All 296 opening paths remained byte-identical except the exact authorized Phase D working-tree changes to `banks/gpt-canonical.json` and `BANK-REVIEW-LEDGER.md`; the formerly clean `banks/hard-cases-canonical.json` carries only the authorized Phase D patch.
- All opening tracked index blobs remained unchanged. No staging, commit, push, merge, reset, restore, stash, checkout, clean, or other index mutation occurred. HEAD remained `3286024bcab90c1a114811a7202d956c3e586bf4`.
- No unexpected Git paths were introduced outside the authorized producer/checker/patch additions and canonical/ledger mutation surface.
- Protected hashes remained unchanged: `PROJECT-HISTORY.md` `393ce5572fab8e3c2991cc90a91d3ee936a1adeeb6a6189155757959e6a51551`; `DECISIONS.md` `ec80e287a726ad4114a198b67e89d3647e3c23dc82f153984e81e346067e21df`; `census.json` `0a596c1dca3527599133ea905881ce9044e6998adab46f1f15fee5a722e676ed`; `BANK-CENSUS.md` `2ce7646b53f8828ed9750bacc4e8a1436d6bc42120335d97fbe7ea1fb2345026`.

Phase E remains closed. This is an executor verification claim only and does not owner-close Phase D.
