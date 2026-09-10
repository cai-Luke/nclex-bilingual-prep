# Campaign 16 Phase B — Stage 1 Iteration 1 Report

Date: 2026-08-27  
Seat: Codex / GPT-5.6 Sol / high  
Terminal status: **CAMPAIGN16_PHASE_B_CANDIDATES_COMPLETE**

This is append-only §10.4 Stage 1 iteration evidence. It does not amend the original Stage 1
artifacts or frozen Stage 2 review, and it does not certify any revised row. Only the nine revised
rows return to Claude Opus 5 for numbered Stage 2 iteration review.

## 1. Frozen-authority gate

Both authorities matched before use:

| Frozen authority | Expected file-byte SHA-256 | Observed | Result |
|---|---|---|---|
| `scratch/CAMPAIGN-16-PHASE-B-QUARANTINED-FIX-RECOVERY-WORK-ORDER-2026-08-27.md` | `756ba6c10206bc2a197bb9cd577f1a2789829e3e73127145254858a7649b8b51` | same | PASS |
| `audit/campaign-16-phase-b-recovery-2026-08-27/review.json` | `f94fe88950d1aa8550609065cbfbb44f14db527693d05ba3319a84abb614576d` | same | PASS |

The raw draft also exactly matched the frozen reviewed state before iteration:
`64a8333d37e17d6daf06e1b8a3553b394ea9892fcf83ec1e5beb21f0991800fd`.

## 2. Opening identity and entry gates

- Repository: `/Users/holemini/Desktop/Project Shrimp`
- Branch: `main`
- HEAD: `3286024bcab90c1a114811a7202d956c3e586bf4`
- Upstream: `origin/main`
- Ahead/behind: `0/0`
- Staged paths: none
- Dirty bundled `banks/*.json`: none
- Complete pre-existing unstaged/untracked population: recorded in
  `execution-plan-iteration-1.md`; no path was stashed, reverted, cleaned, deleted, or normalized.
- All 13 bundled-bank raw file-byte hashes matched the Campaign 16 §A.5 baseline before iteration.
- All four `AFFIRM` payload hashes matched frozen `review.json` before iteration.

## 3. Authorized nine-row iteration

Every row was patched in place under its existing unpublished `_r2` ID. No row was rematerialized,
no ID was minted, no `_r3` was created, and every key and keyed-element identity/count remained
unchanged.

Campaign-convention hashes are `sha256(stableJson(question, 0))`.

| Current `_r2` ID | Repair summary | Ops | Reviewed start hash | Result hash | Mutation proof |
|---|---|---:|---|---|---|
| `gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08_r2` | Replaced redundant last-injection date distractor with a distinct plausible receiving-program date. | 2 | `9bbe67218947b1108d99ecbdb004e722ee8782f2b9252ab6f030e564dbbe9301` | `0616cc2ecc7abc4e8e00691fedd5786b623e6d8f772fa654183b31780e4e3d98` | PASS |
| `gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13_r2` | Removed false “stated in case” claim and replaced select-everything strategy with discriminating criteria. | 4 | `73abbcf2d7e2cfb443ceb27922a5c5c9a11de804057cb91260e0c027fcd7efd4` | `4b72ddec9b12e58016ffc94ed822f713b8bd8ce1d8f96743af1d835bf1192f2a` | PASS |
| `gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18_r2` | Removed unsupported designated-safe-area triage sequence; grounded post-threat behavior in current CISA guidance and corrected `meta.source`. | 13 | `e62e88406b257090f8afa67f897a71045d04f2a981a9c7eff73e9a27f7967bf9` | `37593d97ef8dd7f747851b26f01ff5e8aa1b1072e23554e12aff1ef02bfaca48` | PASS |
| `gpt_balance5_2026_07_16_mx_client_advocacy_02_r2` | Named both ADA-permitted questions inside scored row `q02_r2`; reconciled stem disambiguators. | 3 | `34fbecfe2a2f14238544e67400dfcff0a39546987bb34a9eb2ab567c133af018` | `81f0d590379a9f46e1289444feab0561a745cc9975fe29d592e892827d08d94c` | PASS |
| `gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13_r2` | Removed unsupplied plan assertions from rationale/strategy and aligned disambiguators to current stem cues. | 13 | `5ba15a5e22cc996a8d0103ca794bcd087d944c64ab5f3be50cbbe0896216cd8e` | `5c70caa385a7923f2814835bf80fbb00ecf98b1c06010b8036e52eec150f8fa1` | PASS |
| `gpt_balance6a_2026_07_16_bt_perioperative_care_13_r2` | Removed “per the supplied protocol” from keyed LAST action without adding a dose/rate. | 2 | `1837a316611d1488e0b1c0b2a2fba0c4067d51a47c81e2a84a57d797e1342738` | `cf18ca30ea70a47e5d4de874569b668936b77dc2aeadee2abe525fa2e008ecea` | PASS |
| `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05_r2` | Made `q05_d02` turn on the psychotherapy-note exception rule using two regulatory exceptions as distractors. | 13 | `54ffbaed80defb0a68d78cfd8ab2b1a004ff752dccdcbd188d7aa3c035f63604` | `c511e99c0eccafc8706655789f824b933a89d1c2a77dc2193374d13aa1e8ec4e` | PASS |
| `gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14_r2` | Removed all unsupplied program-pathway dependencies; retained source-grounded immediate PD-team direction and follow-up. | 23 | `710dc5976f92f17e9982ddfe2dfb5f3b38afcf1099acc6da51f94c5161f6716b` | `9d5cf90af1aa9dea490b6e6fd3d4e850d148f344bf9112a0955a6ae13eba579b` | PASS |
| `gpt_balance6b_2026_07_16_hl_standard_precautions_hygiene_17_r2` | Removed orphaned stated-limit wording and numeric precision cue from scored text; retained sourced threshold only in post-answer rationale. | 9 | `9d5bda8db1e614ab7b8b1505401f745431ad1b0980cfc5efbd06ea9a803edbb5` | `dbdedbe42565307c506fd19f27829e1c1694863af42638c54ff2a3e2eeaadf4a` | PASS |

Total declarative operations: **82**. Every exact before-value and after-value is carried in
`manifest-iteration-1.json` and the preserved sibling patch program.

The complete before/after payload comparison found zero changed leaves outside declared operation
paths. All nine construct/key signatures matched. The current raw draft file-byte SHA-256 is:

```text
4e515f2adb7043d4e99e8210e4958c30728ce68c419844c3b562ad3255b3e192
```

## 4. Added-fact and source accounting

Only three repairs introduced learner-facing facts not already stated in the reviewed text:

1. Active-shooter post-threat behavior: official CISA *Active Shooter Preparedness Action Guide*
   (June 2025), `https://www.cisa.gov/sites/default/files/2025-06/Active-Shooter-Preparedness-Action-Guide_508_20250611.pdf`.
2. The two ADA-permitted service-dog questions: U.S. Department of Justice ADA FAQ Q7,
   `https://www.ada.gov/resources/service-animals-faqs/`.
3. Psychotherapy-note exception competitors: 45 CFR § 164.508(a)(2),
   `https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E/section-164.508`,
   with non-originator treatment confirmation in HHS OCR FAQ 558.

No dose, rate, threshold, antimicrobial regimen, or other unsupported clinical/operational fact was
invented. The LAST, PD, MCI, downtime, and fingernail repairs retain or narrow facts already bound to
their existing authoritative sources.

## 5. Four-AFFIRM preservation proof

| Current ID | Frozen reviewed hash | Pre-iteration | Post-iteration | Result |
|---|---|---|---|---|
| `gpt_balance2_2026_07_15_dc_client_advocacy_02_r2` | `0e211d6eee964f939d8ad72da8332ddfca66f59019a445f8d86a7a6551f0976e` | same | same | PASS |
| `gpt_balance3_2026_07_16_dc_psychotropic_medications_11_r2` | `1cb1b4bc7aca712bf5aab8f252b32cdf538fdff2a7ef27d8a6afcc662741a5aa` | same | same | PASS |
| `gpt_balance5_2026_07_16_mx_standard_precautions_hygiene_15_r2` | `df213b7da5eb41a37d83caa199e4f9edc027f9d8afaf3dc493447bd82829a8b7` | same | same | PASS |
| `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07_r2` | `476755b6be798b4b8164dc72e9a6ec91e6bd1ef508f55613c3797784ed1a7c95` | same | same | PASS |

No iteration operation addressed any affirmed ID.

## 6. Mandatory intra-item referential-coherence proof

All nine rows passed. The machine-readable manifest explicitly enumerates, per row:

- `rationale.correct`;
- every `rationale.byChoice` refId;
- `testTakingStrategy`;
- `meta.source`;
- every `meta.stem_disambiguators` entry, or explicit absence;
- every scored dropdown option, matrix row, highlight segment, or bowtie token;
- every surviving reference to stem/case/plan/protocol/program/stated/supplied/described/named or
  equivalent wording;
- the premise, exact current antecedent, and PASS result;
- explicit `NO_STEM_SUPPLIED_DEPENDENCY` treatment for inspected fields without such a dependency.

Per-row results:

| Revised row | Coherence result | Orphaned/false references |
|---|---|---:|
| discharge handoff `_08_r2` | PASS | 0 |
| downtime highlight `_13_r2` | PASS | 0 |
| active-shooter `_18_r2` | PASS | 0 |
| service-dog matrix `_02_r2` | PASS | 0 |
| MCI communication highlight `_13_r2` | PASS | 0 |
| LAST bowtie `_13_r2` | PASS | 0 |
| psychotherapy-notes cloze `_05_r2` | PASS | 0 |
| PD contamination bowtie `_14_r2` | PASS | 0 |
| fingernail highlight `_17_r2` | PASS | 0 |

The first complete scan caught one residual “program follow-up” phrase in the PD appetite rationale.
That bilingual field pair was added to the same declarative iteration program and patched with exact
preconditions. The final targeted search found no occurrence of any previously orphaned phrase.

## 7. Mechanical verification

### §8.1 validation and normalization

- `validate-bank`: `gpt-campaign16-phase-b-recovery-2026-08-27.json OK (13 questions)`, exit 0.
- `normalize-raw-bank`: `0 structural change(s); already normalized; validation passed`, exit 0.

### §8.2 isolated population proof

Scratch set outside `banks/`:
`/tmp/campaign16-phase-b-iteration1.ikufpy/post-return-bank-set`

The 13 canonical banks were parsed, copied to scratch, the 13 current candidates were appended only
to the scratch `gpt-canonical.json`, and all scratch banks were independently reloaded. Only
`derivePopulation`, `stableJson`, and `sha256` were imported from the frozen census implementation.
No prohibited audit entry point was invoked.

- `derivePopulation` threw: no
- independently loaded banks: 13
- located top-level questions: 1,943
- suffix bowties: 50
- paired: 31 = 30 `EXACT` + 1 `ORDINAL_SUFFIX`
- exclusions: 19, all `NO_ELIGIBLE_SIBLING_CASE`
- result: PASS, exit 0

### §8.3–§8.8 structured gates

- Global uniqueness over 13 canonical banks plus raw candidates: 1,943 top-level IDs; 0 duplicates.
- Nine revised `_r2` IDs: each appears exactly once in the raw draft.
- `_r3`: 0.
- Original 13 IDs: all absent as exact `question.id` across the enumerated 13 canonical banks and
  raw draft.
- Same-shape positive control: `gpt_case_hipaa_disclosure_breach_01_bowtie` found exactly once at
  `banks/gpt-canonical.json#questions[293]`.
- Route: `routeCanonical("gpt-campaign16-phase-b-recovery-2026-08-27.json")` returned
  `gpt-canonical.json`.
- Envelope: exact copy of current `banks/gpt-canonical.json` metadata with count set to 13; actual
  question count 13; archive-wrapper fields 0.
- Bilingual patch parity: 76 learner-facing language operations; 0 unpaired.
- Topic English-only: 0 CJK topics.
- Combined parser/route gate: PASS, exit 0.

### Canonical-bank non-mutation

- `git diff --quiet -- banks/*.json`: exit 0.
- `git diff --cached --quiet -- banks/*.json`: exit 0.
- Final `shasum -a 256 banks/*.json`: all 13 exactly equal the Phase A §A.5 baseline, exit 0.

## 8. Verification command record

| Exact invocation | Emitted result | Exit |
|---|---|---:|
| `shasum -a 256 scratch/CAMPAIGN-16-PHASE-B-QUARANTINED-FIX-RECOVERY-WORK-ORDER-2026-08-27.md audit/campaign-16-phase-b-recovery-2026-08-27/review.json` | Both frozen digests exact | 0 |
| `git branch --show-current` | `main` | 0 |
| `git rev-parse HEAD` | `3286024bcab90c1a114811a7202d956c3e586bf4` | 0 |
| `git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}'` | `origin/main` | 0 |
| `git rev-list --left-right --count HEAD...'@{upstream}'` | `0 0` | 0 |
| `git status --porcelain=v2 --branch --untracked-files=all` | Complete opening dirty population captured | 0 |
| read-only inline `npx --no-install tsx /dev/stdin` §1.5 verifier | 13/13 bank hashes, reviewed raw bytes, 4/4 AFFIRM hashes PASS | 0 |
| `npx --no-install tsx scripts/patches/2026-08-27-campaign16-phase-b-recovery-iteration-1.ts --print-ops-json` with final `jq -e` audit | 82 ops; 9 IDs; no ID op; no `_r3` | 0 |
| `npx --no-install tsx scripts/patches/2026-08-27-campaign16-phase-b-recovery-iteration-1.ts --in banks/banks-raw/gpt-campaign16-phase-b-recovery-2026-08-27.json --out banks/banks-raw/gpt-campaign16-phase-b-recovery-2026-08-27.json --strict-parity` | Initial 80 exact ops; parity none; validation PASS | 0 |
| same patch program with `--apply-coherence-followup-only` and the same `--in`, `--out`, `--strict-parity` | Final 2 exact PD coherence ops; parity none; validation PASS | 0 |
| final inline full-tree mutation verifier against preserved reviewed before-image | 9 mutation proofs PASS; 4 AFFIRM preservation proofs PASS; IDs/constructs PASS | 0 |
| `rg -n -i 'stated in the case|stated in the stem|stem.s definition|stem supplies|supplied protocol|supplied by the facility plan|program pathway supplied|program.s prescribed|program follow-up|designated safe area|plan explicitly requires|plan directs|plan creates|plan assigns|named tracking|activated closed-world plan|natural nail limit supplied|two permitted questions described in the stem|specific exclusion reason' banks/banks-raw/gpt-campaign16-phase-b-recovery-2026-08-27.json` | No match; expected absence | 1 |
| `npm run validate-bank -- banks/banks-raw/gpt-campaign16-phase-b-recovery-2026-08-27.json` | OK, 13 questions | 0 |
| `npm run normalize-raw-bank -- banks/banks-raw/gpt-campaign16-phase-b-recovery-2026-08-27.json` | 0 structural changes; validation passed | 0 |
| inline parsed-ID/envelope/parity/topic/route gate over the 13 enumerated canonical files plus raw draft | All gates PASS; positive control 1; original IDs 0 | 0 |
| `git diff --quiet -- banks/*.json` | Quiet | 0 |
| `git diff --cached --quiet -- banks/*.json` | Quiet | 0 |
| `shasum -a 256 banks/*.json` | 13/13 exact Phase A baseline | 0 |
| isolated scratch `derivePopulation` invocation via `npx --no-install tsx /dev/stdin` | 31 paired; 30 exact; 1 ordinal; 19 exclusions | 0 |
| exact envelope-meta identity inline Node check | Raw meta equals canonical meta with count 13 | 0 |
| manifest generator via `npx --no-install tsx /dev/stdin` | 9 rows; 82 ops; 4 AFFIRM; 9 coherence PASS | 0 |
| `jq -e` manifest integrity predicate | `true` | 0 |

Non-gate diagnostics: one initial stdin TypeScript scanner failed before reading the bank (syntax
error), and one initial final-op `jq` expression had a bracket typo (exit 3/EPIPE). Both were
read-only, changed no state, and were superseded by the successful scans/audit above.

## 9. Iteration artifacts

1. `audit/campaign-16-phase-b-recovery-2026-08-27/execution-plan-iteration-1.md`
2. `audit/campaign-16-phase-b-recovery-2026-08-27/status-iteration-1.log`
3. `audit/campaign-16-phase-b-recovery-2026-08-27/manifest-iteration-1.json`
4. `audit/campaign-16-phase-b-recovery-2026-08-27/report-iteration-1.md`
5. `scripts/patches/2026-08-27-campaign16-phase-b-recovery-iteration-1.ts`
6. `banks/banks-raw/gpt-campaign16-phase-b-recovery-2026-08-27.json`

No row remains blocked within the authorized Stage 1 bounded-repair scope. This means only that all
nine revised candidates are ready for independent Stage 2 iteration review; it is not an `AFFIRM` or
publication authorization.

No promotion, consolidation, Stage 3 action, publication freeze, ledger/history/census update,
commit, or push occurred.

**CAMPAIGN16_PHASE_B_CANDIDATES_COMPLETE**
