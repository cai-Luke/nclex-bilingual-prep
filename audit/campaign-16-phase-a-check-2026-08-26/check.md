# Campaign 16 — Phase A Independent Checker Derivation (BLINDED)

Date: 2026-08-27  
Seat: Claude (independent checker, charter §A.8)  
Charter: `scratch/CAMPAIGN-16-QUALITY-CLOSEOUT-CHARTER-2026-08-26.md`  
Charter SHA-256 verified on read: `c3cd80bd38474794a70861119bdc42d3f977b1393c32421c052e05fb34d522f6` — matches the expected digest.

## Blinding statement

Every figure below was derived from live disk and from the frozen 2026-08-23 census artifacts.
**No file under `audit/campaign-16-phase-a-baseline-2026-08-26/` was opened, listed for content, or
read before this file and `check.json` were written and hashed.** No producer figure, method choice,
or conclusion informed anything here.

Scope derived: **A.2, A.3, A.4.1–A.4.5, A.5** — the four items named by §A.8.
Not derived: A.1 (census baseline), which §A.8 does not name.

## Tool reach

Local shell on the working tree (`grep`, `find`, `shasum`, `git`), Node v25.9.0, and `tsx`. Full
read access to the repository. **MCP repository search was not used for the A.2 absence proof** (Trap 1).
No required capability was unavailable; the derivation is complete, not partial.

## Preconditions observed

| Field | Value |
|---|---|
| Repository | `/Users/holemini/Desktop/Project Shrimp` |
| Branch | `main` |
| HEAD | `3286024bcab90c1a114811a7202d956c3e586bf4` |
| Upstream | `origin/main` |
| Ahead / behind | 0 / 0 |
| Dirty bank files | **none** |

Dirty paths at derivation time:

- `M BANK-CENSUS.md`
- `M CLAUDE.md`
- `M STAGE-REFERENCE-SEMANTIC-CENSUS-GEMINI-CALIBRATION-SPEC-2026-07-23.md`
- `M census.json`
- `?? audit/campaign-16-phase-a-baseline-2026-08-26/`

No bank file is dirty, so the §A.0 STOP condition is not triggered.

---

## A.2 — Absence proof for the 13 quarantined FIX IDs

**Method (shell only, MCP search prohibited and not used):**

1. `grep -rF -c` / `grep -rlF` for each ID across **all** files under `banks/` — including
   `banks/banks-raw/`, `banks/case_sources/`, and non-JSON files.
2. An independent Node structural walk: parse all 13 bundled banks and recurse every string value
   (144,679 scanned), matching against the 13 target IDs. This catches an ID appearing at any depth,
   not only as a top-level `question.id`.

**Positive control.** The identical grep invocation located
`gpt_case_hipaa_disclosure_breach_01_bowtie` and `gpt_format15_vasa_previa_bleeding_bowtie` inside the
6.8 MB `banks/gpt-canonical.json`, and `gpt_case_gbs_respiratory_compromise_01_bowtie` inside
`banks/hard-cases-canonical.json`. The method therefore demonstrably reads the large file, so the
negatives below are real negatives and not a silent size skip.

| # | Quarantined FIX ID | Found | grep hits | Walk hits | File | JSON path |
|---:|---|---|---:|---:|---|---|
| 1 | `gpt_balance2_2026_07_15_dc_client_advocacy_02` | NOT FOUND | 0 | 0 | — | — |
| 2 | `gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08` | NOT FOUND | 0 | 0 | — | — |
| 3 | `gpt_balance3_2026_07_16_dc_psychotropic_medications_11` | NOT FOUND | 0 | 0 | — | — |
| 4 | `gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13` | NOT FOUND | 0 | 0 | — | — |
| 5 | `gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18` | NOT FOUND | 0 | 0 | — | — |
| 6 | `gpt_balance5_2026_07_16_mx_client_advocacy_02` | NOT FOUND | 0 | 0 | — | — |
| 7 | `gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13` | NOT FOUND | 0 | 0 | — | — |
| 8 | `gpt_balance5_2026_07_16_mx_standard_precautions_hygiene_15` | NOT FOUND | 0 | 0 | — | — |
| 9 | `gpt_balance6a_2026_07_16_bt_perioperative_care_13` | NOT FOUND | 0 | 0 | — | — |
| 10 | `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05` | NOT FOUND | 0 | 0 | — | — |
| 11 | `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07` | NOT FOUND | 0 | 0 | — | — |
| 12 | `gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14` | NOT FOUND | 0 | 0 | — | — |
| 13 | `gpt_balance6b_2026_07_16_hl_standard_precautions_hygiene_17` | NOT FOUND | 0 | 0 | — | — |

**Result: all 13 absent from `banks/`.** No material finding under §A.2; the §A.2 STOP condition
(any ID present) is not triggered.

---

## A.3 — Stage-reference population

### Trap 4 mitigation used

**Both** named mitigations were applied, and the reported figures come from the fail-loud path.

- **(a) `validate-bank` across all 13 bundled banks** — 13/13 `OK`, process exit `0`.
- **(b) Explicit-file path** — the audit was invoked with `--file` once per bundled bank (26 argv
  tokens), routing to `runExplicitFiles`, which returns `FAIL` with a load-failure detail rather than
  silently skipping a bad bank.

### Banks actually analyzed, established independently

A separate script replicating `loadBank` semantics (`parseBankText` + `validateBankObject` with
`rejectUnknownKeys: true`) over `readdir("banks")` `.json` entries reported **13 entries, 13 loaded
and schema-valid, 0 failures**. This is established independently of the audit's own reported file
count, which per Trap 4 proves nothing on its own.

**Banks established valid/analyzable: 13 of 13.**

### Runs, emitted status, and process exit code

| Command | Mode | Emitted status | Process exit |
|---|---|---|---:|
| `npx tsx scripts/audit/audit-stage-refs.ts` | canonical sweep, non-strict | `WARN` | 0 |
| `npx tsx scripts/audit/audit-stage-refs.ts --strict` | canonical sweep, strict | `FAIL` | 1 |
| `npx tsx scripts/audit/audit-stage-refs.ts --file <each of 13>` | explicit files, non-strict | `WARN` | 0 |
| `npx tsx scripts/audit/audit-stage-refs.ts --file <each of 13> --strict` | explicit files, strict | `FAIL` | 1 |

Per Trap 3, the strict `FAIL` / exit `1` is the **expected** result given `revealsAllStages > 0`, not a
Phase A failure. Output was captured to file first and the exit status inspected afterwards; no
`set -e` abort occurred. The canonical sweep and the explicit-file path produced **identical figures**.

### Independently derived figures

| Metric | Value |
|---|---:|
| `revealsAllStages` | **451** |
| distinct parent cases with ≥1 `revealsAllStages` | **93** |
| `unresolved` | **0** |
| `missingRequiredAnchor` (strict only) | **75** |
| total findings, non-strict | 451 |
| total findings, strict | 526 |
| banks analyzed (independently established) | **13** |

### Per-file breakdown

| Bank file | `revealsAllStages` | distinct parent cases | `unresolved` | `missingRequiredAnchor` (strict) |
|---|---:|---:|---:|---:|
| `claude-canonical.json` | 58 | 10 | 0 | 6 |
| `gemini-canonical.json` | 46 | 11 | 0 | 0 |
| `gpt-canonical.json` | 243 | 52 | 0 | 34 |
| `hard-cases-canonical.json` | 104 | 20 | 0 | 35 |
| **total** | **451** | **93** | **0** | **75** |

The nine bundled banks not listed contribute zero findings of every kind.

### On the number 451

The rederived `revealsAllStages` total is 451 and the distinct parent-case count is 93. These equal
the 2026-07-19 sweep figures restated on 2026-07-23. Per §A.3 this is recorded as a **coincidence of
measurement, not confirmation** of the historical population. Nothing was reconciled to 451; 451 was
what the live measurement returned. 451 is the current population because it was measured today, not
because it was 451 before.

---

## A.4 — Bowtie population rederivation and drift

### A.4.2 — Hash convention (stated first, because everything below depends on it)

All payload hashes here use **`sha256(stableJson(q, 0))`** and no other serialization, where
`stableJson` recursively sorts object keys, serializes with `JSON.stringify(value, null, 0)`, and
appends a trailing newline. `stableJson` and `sha256` were imported directly from the frozen
instrument. **`generateArtifacts()`, `openingIdentity()`, `assertFrozenBanks()`, and
`finalize-and-verify` were not invoked** (Trap 5); banks were loaded independently by this checker.

**Convention validated, not assumed:** all 11 independently computed A.4.3 candidate hashes reproduce
the frozen `candidatePayloadSha256` values byte-for-byte. That is a positive control on the
serialization itself, which in turn is what makes the A.4.4 and A.4.5 comparisons — where no frozen
hash exists to compare against — trustworthy.

### A.4.1 — Live roster and pairing split

`derivePopulation` was run against independently loaded current `banks/`.

| Metric | Live | Frozen 2026-08-23 | Drift |
|---|---:|---:|---|
| `_bowtie`-suffix items total | **50** | 50 | none |
| paired | **31** | 31 | none |
| `EXACT` | **30** | 30 | none |
| `ORDINAL_SUFFIX` | **1** | 1 | none |
| unpaired `NO_ELIGIBLE_SIBLING_CASE` | **19** | 19 | none |

Exclusion reasons present: `NO_ELIGIBLE_SIBLING_CASE` (only).

Drift by ID against the frozen artifacts (`adjudication.jsonl`, `exclusions.jsonl`):

| Drift class | IDs |
|---|---|
| paired only in live | *(none)* |
| paired only in frozen | *(none)* |
| unpaired only in live | *(none)* |
| unpaired only in frozen | *(none)* |
| pairing-rule changes | *(none)* |
| companion changes | *(none)* |
| candidate JSON-path changes (paired) | *(none)* |
| JSON-path changes (unpaired) | *(none)* |

**The 31 + 19 split was rederived, not assumed.** It happens to still describe the corpus, with no
membership, pairing-rule, companion, or index drift.

The full live paired roster (31) and unpaired roster (19) with bank paths, JSON paths, companions,
and pairing rules are enumerated in `check.json` under `a4.a4_1.pairedRoster` and
`a4.a4_1.unpairedRoster`.

### A.4.3 — The 11 paired failing candidates, resolved by ID

The failing set was rederived independently from `adjudication.jsonl` by filtering
`phaseF.primaryVerdict` for `FAIL*` — yielding 7 `FAIL_HIDDEN_CASE_DEPENDENCY` + 4
`FAIL_UNSUPPORTED_TOKEN_PREMISE`, matching the charter §5 Phase D roster exactly. Each was then
resolved **by ID** across all loaded banks, never by recorded index.

| Candidate ID | Verdict | Current bank | Current JSON path | Current payload SHA-256 | Frozen SHA-256 | Drift |
|---|---|---|---|---|---|---|
| `gpt_case_acute_hemolytic_transfusion_reaction_01_bowtie` | `FAIL_HIDDEN_CASE_DEPENDENCY` | `banks/gpt-canonical.json` | `$.questions[281]` | `789d52ef3191509f938526bdd66cbfb6fc32d6ee1bbb45b4a14b2c2b33f0da65` | `789d52ef3191509f938526bdd66cbfb6fc32d6ee1bbb45b4a14b2c2b33f0da65` | none |
| `gpt_case_caregiver_role_strain_dementia_01_bowtie` | `FAIL_HIDDEN_CASE_DEPENDENCY` | `banks/gpt-canonical.json` | `$.questions[345]` | `7b2d554215d8a3c2249aaa9bd595721793b4f3a439663e74e76efabe5a3ff6e1` | `7b2d554215d8a3c2249aaa9bd595721793b4f3a439663e74e76efabe5a3ff6e1` | none |
| `gpt_case_client_advocacy_refusal_01_bowtie` | `FAIL_HIDDEN_CASE_DEPENDENCY` | `banks/gpt-canonical.json` | `$.questions[301]` | `d601c32d131bb984399cbb131b98f3c995e4fe1ef2512ddb1d30c61757172521` | `d601c32d131bb984399cbb131b98f3c995e4fe1ef2512ddb1d30c61757172521` | none |
| `gpt_case_gbs_respiratory_compromise_01_bowtie` | `FAIL_HIDDEN_CASE_DEPENDENCY` | `banks/hard-cases-canonical.json` | `$.questions[53]` | `74e4fc43567f17a8eed82ce10fd440372afe4bfde7da0878bda51fb30aa34804` | `74e4fc43567f17a8eed82ce10fd440372afe4bfde7da0878bda51fb30aa34804` | none |
| `gpt_case_hipaa_disclosure_breach_01_bowtie` | `FAIL_UNSUPPORTED_TOKEN_PREMISE` | `banks/gpt-canonical.json` | `$.questions[293]` | `9ba8faa3ec3cea8e1668c0460b2888686f1600d52186d7f5b8297dc6ae332984` | `9ba8faa3ec3cea8e1668c0460b2888686f1600d52186d7f5b8297dc6ae332984` | none |
| `gpt_case_infection_control_clustered_care_01_bowtie` | `FAIL_HIDDEN_CASE_DEPENDENCY` | `banks/gpt-canonical.json` | `$.questions[347]` | `9257f536a25485a9761d3f004f6deb2679177570b83a6937f1e65ef880d45daf` | `9257f536a25485a9761d3f004f6deb2679177570b83a6937f1e65ef880d45daf` | none |
| `gpt_case_lateral_incivility_01_bowtie` | `FAIL_HIDDEN_CASE_DEPENDENCY` | `banks/gpt-canonical.json` | `$.questions[303]` | `fea2d76c8716a73087600efe5fd026a33cb36e5b19f28dde067b940ff57e9563` | `fea2d76c8716a73087600efe5fd026a33cb36e5b19f28dde067b940ff57e9563` | none |
| `gpt_case_mass_casualty_start_triage_01_bowtie` | `FAIL_HIDDEN_CASE_DEPENDENCY` | `banks/gpt-canonical.json` | `$.questions[295]` | `7cdf149aff899a7cd171c9395ec6ab23b93b571c15cb779dc169d605e1dbd4d6` | `7cdf149aff899a7cd171c9395ec6ab23b93b571c15cb779dc169d605e1dbd4d6` | none |
| `gpt_case_neutropenic_fever_nadir_01_bowtie` | `FAIL_UNSUPPORTED_TOKEN_PREMISE` | `banks/gpt-canonical.json` | `$.questions[287]` | `f8e8ca6eddd5f48cf67ef7ea5a51d9eb5bcfea2c67def6b50eafcbf0818ac00b` | `f8e8ca6eddd5f48cf67ef7ea5a51d9eb5bcfea2c67def6b50eafcbf0818ac00b` | none |
| `gpt_case_unsafe_premature_discharge_01_bowtie` | `FAIL_UNSUPPORTED_TOKEN_PREMISE` | `banks/gpt-canonical.json` | `$.questions[297]` | `d9462741c338b5041762f5f4a4c51cffd17bd54d34d17839c381b02cbd59bf5e` | `d9462741c338b5041762f5f4a4c51cffd17bd54d34d17839c381b02cbd59bf5e` | none |
| `gpt_pph_2026_06_16_case_01_bowtie` | `FAIL_UNSUPPORTED_TOKEN_PREMISE` | `banks/hard-cases-canonical.json` | `$.questions[59]` | `efcc3588cf2750744fb89be66529904081f6953d6158505dfc694e48086fed39` | `efcc3588cf2750744fb89be66529904081f6953d6158505dfc694e48086fed39` | none |

**Payload drift: 0 of 11. JSON-path drift: 0 of 11.** Every recorded index also still resolves to the
same item, though the resolution was done by ID regardless.

### A.4.4 — Companion payload drift for the 7 relational rows

A `FAIL_HIDDEN_CASE_DEPENDENCY` verdict is relational: it asserts something about the candidate
*given* its companion. Candidate-hash identity alone does not establish that the verdict still
describes live content, so this step is derived separately and is **not** collapsed into A.4.3. Each
companion was resolved by `companionCaseId`, hashed from the current bank, and hashed again from
`git show c2ff546:<bankPath>` under the same A.4.2 convention.

| Candidate ID | Companion case ID | Current path | Baseline path | Current companion SHA-256 | Baseline companion SHA-256 | Drift |
|---|---|---|---|---|---|---|
| `gpt_case_acute_hemolytic_transfusion_reaction_01_bowtie` | `gpt_case_acute_hemolytic_transfusion_reaction_01` | `$.questions[280]` | `$.questions[280]` | `bcfcc790be6233200ab06313261491e64498a34a19ea591fd9401d732ee957c8` | `bcfcc790be6233200ab06313261491e64498a34a19ea591fd9401d732ee957c8` | none |
| `gpt_case_caregiver_role_strain_dementia_01_bowtie` | `gpt_case_caregiver_role_strain_dementia_01` | `$.questions[344]` | `$.questions[344]` | `cea0cb8c7a2e680cddd6acc98d8b92b5c579c4c6f461000b68de54e132dea094` | `cea0cb8c7a2e680cddd6acc98d8b92b5c579c4c6f461000b68de54e132dea094` | none |
| `gpt_case_client_advocacy_refusal_01_bowtie` | `gpt_case_client_advocacy_refusal_01` | `$.questions[300]` | `$.questions[300]` | `c496073c994e10b31b80663f3d15c406e3614973f7fcb7701c3fed97e0ebfabd` | `c496073c994e10b31b80663f3d15c406e3614973f7fcb7701c3fed97e0ebfabd` | none |
| `gpt_case_gbs_respiratory_compromise_01_bowtie` | `gpt_case_gbs_respiratory_compromise_01` | `$.questions[52]` | `$.questions[52]` | `adb56be57dfb15252c6dd54f6046452f691634fc588b786f45236e8a140a6b86` | `adb56be57dfb15252c6dd54f6046452f691634fc588b786f45236e8a140a6b86` | none |
| `gpt_case_infection_control_clustered_care_01_bowtie` | `gpt_case_infection_control_clustered_care_01` | `$.questions[346]` | `$.questions[346]` | `e7d80f5c5f577144b24c0b077a39bb361d84a948f7cbdc74c7c63f257efe938b` | `e7d80f5c5f577144b24c0b077a39bb361d84a948f7cbdc74c7c63f257efe938b` | none |
| `gpt_case_lateral_incivility_01_bowtie` | `gpt_case_lateral_incivility_01` | `$.questions[302]` | `$.questions[302]` | `ac9ad4bd169f9065a85b1216abd4091b1eec3b0c378c5259d7548dc351f8414b` | `ac9ad4bd169f9065a85b1216abd4091b1eec3b0c378c5259d7548dc351f8414b` | none |
| `gpt_case_mass_casualty_start_triage_01_bowtie` | `gpt_case_mass_casualty_start_triage_01` | `$.questions[294]` | `$.questions[294]` | `4462fe97c8ce38a9bfa029b4df5795783b4864df2a7143dea649e6a0d8d819aa` | `4462fe97c8ce38a9bfa029b4df5795783b4864df2a7143dea649e6a0d8d819aa` | none |

**Companion payload drift: 0 of 7.** All seven relational verdicts therefore still describe live
content on both sides of the relation.

### A.4.5 — The 19 unpaired items, frozen hashes reconstructed

`exclusions.jsonl` carries no payload hashes, so the frozen side was **reconstructed**: the baseline
payload was obtained from `git show c2ff546:banks/gpt-canonical.json`, located by ID, and hashed under
the A.4.2 convention, then compared against the same computation over the current bank.

| Candidate ID | Bank | Current path | Baseline path | Current SHA-256 | Baseline SHA-256 | Drift |
|---|---|---|---|---|---|---|
| `gpt_2026_07_03_2114_t1_01_co_exposure_bowtie` | `gpt-canonical.json` | `$.questions[539]` | `$.questions[539]` | `d52f20663ce537cee595d9e46dee04c69b4de4a78f63ab885679101f797b5bd3` | `d52f20663ce537cee595d9e46dee04c69b4de4a78f63ab885679101f797b5bd3` | none |
| `gpt_2026_07_03_2114_t2_01_cdiff_spores_bowtie` | `gpt-canonical.json` | `$.questions[545]` | `$.questions[545]` | `156c37fb872d72e4dcc1c03422222699e844d6c07c46c28c3a3646e612575949` | `156c37fb872d72e4dcc1c03422222699e844d6c07c46c28c3a3646e612575949` | none |
| `gpt_2026_07_03_2114_t2_02_imminent_suicide_bowtie` | `gpt-canonical.json` | `$.questions[546]` | `$.questions[546]` | `db0f561af76d4e1cb5de422662fad579f58e81a0ef068d8d68500fa29668e4cb` | `db0f561af76d4e1cb5de422662fad579f58e81a0ef068d8d68500fa29668e4cb` | none |
| `gpt_format13_last_bowtie` | `gpt-canonical.json` | `$.questions[721]` | `$.questions[721]` | `ab06ae7bf9bae8cf39c3ab315030d14b88c077c149343fe1c0b9f590262924fc` | `ab06ae7bf9bae8cf39c3ab315030d14b88c077c149343fe1c0b9f590262924fc` | none |
| `gpt_format13_mh_bowtie` | `gpt-canonical.json` | `$.questions[722]` | `$.questions[722]` | `b84e2dfc09ca8a6b46501e792bae2261fab64c1f46ffabc559a1ba0aa126bccb` | `b84e2dfc09ca8a6b46501e792bae2261fab64c1f46ffabc559a1ba0aa126bccb` | none |
| `gpt_format13_pd_peritonitis_bowtie` | `gpt-canonical.json` | `$.questions[723]` | `$.questions[723]` | `1917fc5c2d0bf9e47dc370fe0c3e761f68ac155fde9c4ae290b87096e46a6095` | `1917fc5c2d0bf9e47dc370fe0c3e761f68ac155fde9c4ae290b87096e46a6095` | none |
| `gpt_format14_hcm_bowtie` | `gpt-canonical.json` | `$.questions[731]` | `$.questions[731]` | `b88ed0482d9d7f6d8d39b143b457657ad9243bc138f2b9e7d4622c2dfa07d75f` | `b88ed0482d9d7f6d8d39b143b457657ad9243bc138f2b9e7d4622c2dfa07d75f` | none |
| `gpt_format15_acquired_methemoglobinemia_bowtie` | `gpt-canonical.json` | `$.questions[748]` | `$.questions[748]` | `48f90bfa36cb3f7e0b65f637a8ae9de80c35257eac4f812b3373018d4a727777` | `48f90bfa36cb3f7e0b65f637a8ae9de80c35257eac4f812b3373018d4a727777` | none |
| `gpt_format15_cardiac_tamponade_bowtie` | `gpt-canonical.json` | `$.questions[750]` | `$.questions[750]` | `14b942965319b128382b879025356dbac3d13561d392c5ece80ef5e21244fb14` | `14b942965319b128382b879025356dbac3d13561d392c5ece80ef5e21244fb14` | none |
| `gpt_format15_ect_prolonged_seizure_bowtie` | `gpt-canonical.json` | `$.questions[736]` | `$.questions[736]` | `c0d8638519d80fc1b6bd8a23ae0ec2a5cd5ec094611d15c83d26632f9306367a` | `c0d8638519d80fc1b6bd8a23ae0ec2a5cd5ec094611d15c83d26632f9306367a` | none |
| `gpt_format15_meningococcemia_bowtie` | `gpt-canonical.json` | `$.questions[737]` | `$.questions[737]` | `6ecd999b61f1b17d953b1e54820b3047afabd1e88392e09fb4e8d4163e65cd2b` | `6ecd999b61f1b17d953b1e54820b3047afabd1e88392e09fb4e8d4163e65cd2b` | none |
| `gpt_format15_palliative_malignant_bowel_obstruction_bowtie` | `gpt-canonical.json` | `$.questions[743]` | `$.questions[743]` | `238dd73803862f44c357109bde8cced485f0479c27667466b24b5e9c336e036d` | `238dd73803862f44c357109bde8cced485f0479c27667466b24b5e9c336e036d` | none |
| `gpt_format15_severe_asthma_bowtie` | `gpt-canonical.json` | `$.questions[756]` | `$.questions[756]` | `b5000b34fcdead37f242f2294f6c95246011d7635b757bb03e0c0618c627159d` | `b5000b34fcdead37f242f2294f6c95246011d7635b757bb03e0c0618c627159d` | none |
| `gpt_format15_sickle_acute_chest_bowtie` | `gpt-canonical.json` | `$.questions[754]` | `$.questions[754]` | `124a53eb198eb035ac98b83ef256ad7e2bd8c72424af90e8a783f951229af698` | `124a53eb198eb035ac98b83ef256ad7e2bd8c72424af90e8a783f951229af698` | none |
| `gpt_format15_splenic_sequestration_bowtie` | `gpt-canonical.json` | `$.questions[755]` | `$.questions[755]` | `cad98e7f2d181e8141bee5db89a7142dc8f2ddfbb09f6937ee53312b44779423` | `cad98e7f2d181e8141bee5db89a7142dc8f2ddfbb09f6937ee53312b44779423` | none |
| `gpt_format15_transfusion_anaphylaxis_bowtie` | `gpt-canonical.json` | `$.questions[742]` | `$.questions[742]` | `1157de9021406a663da1d8649f6654de20f4e6322fa73f7c8ad4354a46a6188b` | `1157de9021406a663da1d8649f6654de20f4e6322fa73f7c8ad4354a46a6188b` | none |
| `gpt_format15_vasa_previa_bleeding_bowtie` | `gpt-canonical.json` | `$.questions[749]` | `$.questions[749]` | `1f9dbd06dd65e1c2f010b94372f32d6a23420264b5651663d770ac55edd77920` | `1f9dbd06dd65e1c2f010b94372f32d6a23420264b5651663d770ac55edd77920` | none |
| `gpt_format7c_exercise_hypoglycemia_bowtie` | `gpt-canonical.json` | `$.questions[642]` | `$.questions[642]` | `df41a515bafd2325afb0a63fa1b3050ae5d6c6165213af41314d8e3e8dc8ad81` | `df41a515bafd2325afb0a63fa1b3050ae5d6c6165213af41314d8e3e8dc8ad81` | none |
| `gpt_format7c_heart_failure_action_plan_bowtie` | `gpt-canonical.json` | `$.questions[643]` | `$.questions[643]` | `20cdfd9a06862487c399ca4e36c2de9e76ebf1d16d5267721e47fb4df8db877f` | `20cdfd9a06862487c399ca4e36c2de9e76ebf1d16d5267721e47fb4df8db877f` | none |

**Payload drift: 0 of 19.** All 19 are present in the baseline and at unchanged indices.

### A.4 summary

**No item in the bowtie population — paired candidate, companion case, or unpaired candidate — has a
changed payload since the 2026-08-23 freeze.** Zero items require the flag that §A.4 mandates for
changed payloads. Every recorded verdict still describes the live payload it was issued against.

---

## A.5 — Campaign 16 baseline freeze

Raw **file-byte** SHA-256 of all 13 bundled bank files. These are file hashes and are **distinct from
the A.4.2 stable-payload convention**; the two are not comparable. Cross-checked: the Node `crypto`
digests equal `shasum -a 256 banks/*.json` for all 13.

| # | Bank file | SHA-256 (raw file bytes) |
|---:|---|---|
| 1 | `banks/burn-canonical.json` | `5244b8d37daa49adbd1fbed7991f4ede52ded8ce710e26821841ef5e2ce3719f` |
| 2 | `banks/capnography-canonical.json` | `36d72a89405fe4400f27b3b8969cdbe1c51f3217151f8b2592b7f877d636f20c` |
| 3 | `banks/claude-canonical.json` | `25f53ded1ac21da4ca9d211040c3f6110ebee38d72ba41d0fc64fe358ba73b71` |
| 4 | `banks/device-canonical.json` | `83d5a6ac7219524f4c528265291cbee2ed5b2f17c13fbeb3649342bae2e4aac5` |
| 5 | `banks/gemini-canonical.json` | `3dc416a4652f5f5712219dde7de87b92f0697fac953750b8abb8fc0dbb976bb6` |
| 6 | `banks/gpt-canonical.json` | `be83c943bbe6e50297de94d25b596069767b8fee876426ec798dc66ca8d5a76d` |
| 7 | `banks/hard-cases-canonical.json` | `8068c6917e53257a31c7299454c213f61bea62e61d7cf185cb1a09386f4e4862` |
| 8 | `banks/io-canonical.json` | `2ce6488e65049ba00cd9dccf889a042e0a624f224387382d564d282e147b2645` |
| 9 | `banks/lab-canonical.json` | `1038cb68f6b91f6a2c981562d97ad9e16179db9b1332c75725fd538595c44b05` |
| 10 | `banks/mar-canonical.json` | `f12c03a28ff5b52411843f84bc942b4ca5667e989194357ed2d60a394f17641e` |
| 11 | `banks/medlabel-canonical.json` | `cc3bd0053516fc7ea4b23e814e46f186e6d2dbf40888fa713a862c07ea2b3993` |
| 12 | `banks/visual-canonical.json` | `e42e2a3fa6aa349a61279e6988e250e65c2b752a6f36d33806a2671e0af0f9e4` |
| 13 | `banks/vitals-canonical.json` | `5154e25492bced8e4a49d763f04e25e154389c31e085bf37669651e13d411b9d` |

**This is the Campaign 16 baseline. Every later phase reports drift against this set.**

### Drift of this set against the frozen census baseline `c2ff546`

| Bank file | Differs from `c2ff546` |
|---|---|
| `banks/burn-canonical.json` | no |
| `banks/capnography-canonical.json` | no |
| `banks/claude-canonical.json` | no |
| `banks/device-canonical.json` | no |
| `banks/gemini-canonical.json` | no |
| `banks/gpt-canonical.json` | **yes** |
| `banks/hard-cases-canonical.json` | no |
| `banks/io-canonical.json` | no |
| `banks/lab-canonical.json` | no |
| `banks/mar-canonical.json` | no |
| `banks/medlabel-canonical.json` | no |
| `banks/visual-canonical.json` | no |
| `banks/vitals-canonical.json` | no |

Exactly one bundled bank differs from the census baseline: `banks/gpt-canonical.json`.

### Corroboration — why one drifted bank is consistent with zero bowtie drift

This pairing invites an obvious objection: A.5 says a bank changed, A.4 says nothing in it changed.
Both are true, and the drift was decomposed rather than asserted away.

Comparing every question payload in `banks/gpt-canonical.json` against `c2ff546` under the A.4.2
convention:

- question count unchanged: **760 → 760**; 0 added, 0 removed; `meta` unchanged
- **exactly 7 payloads differ**, all of them:
  - `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02` — `case_study`
  - `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03` — `case_study`
  - `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04` — `case_study`
  - `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02` — `case_study`
  - `gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_contact_diarrhea_09` — `matrix`
  - `gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_stroke_rehab_10` — `matrix`
  - `gpt_2026_06_13_case_delirium_uti_01` — `case_study`
- **0 of the 7 carry the `_bowtie` suffix**, and none is a companion of any of the 7 relational rows.

This is the June 13 matrix answer-mapping restoration (`e23962e`, 2026-08-25). It fully accounts for
the single A.5 drift and independently explains the zero-drift A.4 result.

---

## Checker limitations, stated plainly

- A.1 was not rederived. §A.8 names only A.2, A.3, A.4, and A.5, so this is scope, not a gap. Note
  for the record that `BANK-CENSUS.md` and `census.json` are dirty in the worktree, consistent with a
  census having been regenerated; this checker did not run `census` or `census:check` and takes no
  position on A.1.
- No capability required by the fenced method was unavailable. Nothing here is a partial or frozen-
  blocked derivation.
- Per §A.7 and the checker scope fence, no bank was edited, nothing was repaired or promoted, no
  ledger or `DECISIONS.md` change was made, no Phase B–F work was begun, no push occurred, and no
  producer artifact was altered. Per §A.7 this derivation offers **no opinion on whether any item
  should be repaired or retired**.

## Independently derived bottom line

| Item | Result |
|---|---|
| A.2 | All 13 quarantined FIX IDs **absent** from `banks/`. No material finding. |
| A.3 | `revealsAllStages` **451**; parent cases **93**; `unresolved` **0**; strict `missingRequiredAnchor` **75**; banks analyzed **13/13**. |
| A.4.1 | `_bowtie` total **50** = **31 paired** (30 `EXACT` + 1 `ORDINAL_SUFFIX`) + **19 unpaired**. No roster drift. |
| A.4.3 | 11 failing candidates resolved by ID; **0 payload drift**. |
| A.4.4 | 7 companions resolved and hashed both sides; **0 companion drift**. |
| A.4.5 | 19 unpaired reconstructed from `c2ff546`; **0 payload drift**. |
| A.5 | 13 raw file-byte hashes emitted; **1 bank** (`gpt-canonical.json`) differs from `c2ff546`, decomposed to 7 non-bowtie payloads. |

*This file is frozen. It was written and hashed before any producer artifact was opened, and is not
revised after unblinding. The post-unblinding comparison and the §A.8 disposition are written
separately to `comparison.md`.*
