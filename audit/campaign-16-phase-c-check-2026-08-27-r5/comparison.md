# Campaign 16 Phase C Revision 5 — Post-unblinding comparison (pass 2)

**Role:** independent Claude checker, pass 2 (post-unblinding comparison against the frozen pass-1 derivation).
**Date:** 2026-08-28.
**Repository HEAD:** `3286024bcab90c1a114811a7202d956c3e586bf4` (branch `main`, `origin/main`, ahead 0 / behind 0).
**Frozen pass-1 status:** the pass-1 derivation, its JSON, and the blinding-provenance file were not modified, replaced, renamed, or reinterpreted in this pass; they remain as written on 2026-08-28 with 19/19 PASS_STANDALONE.

## Inputs opened for pass 2

Producer artifacts (audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/): `execution-plan.md`, `preflight-result.json`, `population.jsonl`, `population-summary.md`, `deterministic-gates.json`, `opening-bank-snapshot.json`, `opening-preservation.json`, `control-manifest.jsonl`, `generated-control-files.json`, `blocked-evidence.json`, `scale-up-bank-recheck.json`, `semantic-contexts.jsonl`, `blind-packets/` (40 files), `blind-reviews/` (40 files), `phase-e-packets/` (19), `phase-e/` (19), `phase-f-packets/` (19), `phase-f/` (19), `locks/` (76), `adjudication.jsonl`, `report.md`, `verification.md`, `closeout-preservation.json`, `status.log`, `run.ts`, `test.ts`. Frozen pass-1 files: `independent-derivation.json`, `independent-derivation.md`, `blinding-provenance.json` (re-read only, not altered).

## Mechanical comparison

| Gate | Pass-1 (independent) | Producer (report.md / verification.md / closeout-preservation.json) | Result |
|---|---|---|---|
| Work-order SHA-256 | `74fb97e70ca5820a4e95acc62e2b0f3f54790d0eea766d2be58e8a427f924248` | `74fb97e70ca5820a4e95acc62e2b0f3f54790d0eea766d2be58e8a427f924248` | MATCH |
| Repository HEAD | `3286024bcab90c1a114811a7202d956c3e586bf4` | same | MATCH |
| §3.2 bank identity (13/13) | 13/13 MATCH (12 non-GPT vs. Phase A baseline; GPT vs. Phase B closing `e4955f7b…7b3b`) | 13/13 MATCH, identical hashes on each row | MATCH |
| §4.1 population | 50 suffix / 31 paired (30 exact + 1 ordinal) / 19 unpaired; 0 add, 0 remove | 50 / 31 (30 + 1) / 19; 0 / 0 | MATCH |
| §4.2 unpaired payload drift | 19/19 payload SHA-256 identical to Phase A `bowtie.unpaired[].currentHash`; drift 0 | 19/19 MATCH per report §"Unpaired payload preservation" | MATCH — full row-by-row identity of the 19 payload digests |
| §4.3 `_bt_` falsification | both `_r2` IDs present in bank; both absent from `_bowtie` roster; both pre-repair IDs absent as live IDs | same | MATCH |
| §4.4 structural precondition | 19/19 at 3/4/4 tokens and 1/2/2 canonical keys | 19/19 PASS | MATCH |
| §4.5 sibling-absence probe | 0 hits (exact / ordinal-like / substring) across 145 `case_study` IDs | 0 hits | MATCH |
| §4.6 paired-disposition preservation | 31/31 MATCH against frozen 2026-08-23 `candidatePayloadSha256` | 31/31 MATCH | MATCH |

Confirmed by re-hash in this pass: `shasum -a 256 banks/*.json` returns exactly the 13 digests above, and `sha256sum scratch/CAMPAIGN-16-PHASE-C-UNPAIRED-BOWTIE-ANSWERABILITY-WORK-ORDER-2026-08-27.md` returns the frozen digest. Both records agree with live disk.

## Row-by-row primary verdict comparison

Verdicts compared under §12 verdict taxonomy on the 19 unpaired candidates. Exact agreement means identical primary verdict string.

| # | Surrogate | Candidate ID | Pass-1 verdict (independent) | Producer verdict | Exact agreement |
|---|---|---|---|---|:---:|
| 1  | CAND-01 | `gpt_2026_07_03_2114_t1_01_co_exposure_bowtie` | PASS_STANDALONE | PASS_STANDALONE | ✔ |
| 2  | CAND-02 | `gpt_2026_07_03_2114_t2_01_cdiff_spores_bowtie` | PASS_STANDALONE | PASS_STANDALONE | ✔ |
| 3  | CAND-03 | `gpt_2026_07_03_2114_t2_02_imminent_suicide_bowtie` | PASS_STANDALONE | PASS_STANDALONE | ✔ |
| 4  | CAND-04 | `gpt_format13_last_bowtie` | PASS_STANDALONE | PASS_STANDALONE | ✔ |
| 5  | CAND-05 | `gpt_format13_mh_bowtie` | PASS_STANDALONE | PASS_STANDALONE | ✔ |
| 6  | CAND-06 | `gpt_format13_pd_peritonitis_bowtie` | PASS_STANDALONE | PASS_STANDALONE | ✔ |
| 7  | CAND-07 | `gpt_format14_hcm_bowtie` | PASS_STANDALONE | PASS_STANDALONE | ✔ |
| 8  | CAND-08 | `gpt_format15_acquired_methemoglobinemia_bowtie` | PASS_STANDALONE | PASS_STANDALONE | ✔ |
| 9  | CAND-09 | `gpt_format15_cardiac_tamponade_bowtie` | PASS_STANDALONE | PASS_STANDALONE | ✔ |
| 10 | CAND-10 | `gpt_format15_ect_prolonged_seizure_bowtie` | PASS_STANDALONE | PASS_STANDALONE | ✔ |
| 11 | CAND-11 | `gpt_format15_meningococcemia_bowtie` | PASS_STANDALONE | PASS_STANDALONE | ✔ |
| 12 | CAND-12 | `gpt_format15_palliative_malignant_bowel_obstruction_bowtie` | PASS_STANDALONE | PASS_STANDALONE (`DISTRACTOR_PATIENT_FACT_INVENTION` / P2) | ✔ (primary verdict identical; producer records a non-fatal secondary flag on the non-keyed A4 octreotide premise, permitted by §12 and treated as advisory only) |
| 13 | CAND-13 | `gpt_format15_severe_asthma_bowtie` | PASS_STANDALONE | PASS_STANDALONE | ✔ |
| 14 | CAND-14 | `gpt_format15_sickle_acute_chest_bowtie` | PASS_STANDALONE | PASS_STANDALONE | ✔ |
| 15 | CAND-15 | `gpt_format15_splenic_sequestration_bowtie` | PASS_STANDALONE | PASS_STANDALONE | ✔ |
| 16 | CAND-16 | `gpt_format15_transfusion_anaphylaxis_bowtie` | PASS_STANDALONE | PASS_STANDALONE | ✔ |
| 17 | CAND-17 | `gpt_format15_vasa_previa_bleeding_bowtie` | PASS_STANDALONE | PASS_STANDALONE | ✔ |
| 18 | **CAND-18** | **`gpt_format7c_exercise_hypoglycemia_bowtie`** | **PASS_STANDALONE** | **FAIL_UNSUPPORTED_TOKEN_PREMISE** (`RATIONALE_ADDS_MISSING_FACT`, P1) | ✘ |
| 19 | CAND-19 | `gpt_format7c_heart_failure_action_plan_bowtie` | PASS_STANDALONE | PASS_STANDALONE | ✔ |

**Exact verdict agreement: 18 / 19.** The single row of divergence is CAND-18.

## CAND-18 detailed analysis

Candidate: `gpt_format7c_exercise_hypoglycemia_bowtie`. Producer's primary verdict FAIL_UNSUPPORTED_TOKEN_PREMISE with secondary flag `RATIONALE_ADDS_MISSING_FACT` and advisory priority P1. Pass-1 independent verdict PASS_STANDALONE.

### Producer evidence chain (verified against seals)

Producer Phase-E lock (`locks/CAND-18-phase-e.json` / `phase-e/CAND-18.json`, seal SHA-256 `57af275beb9b4bdafb73775c73d26ebd31a032f471acb9314f8fac30f548879e`):

- Canonical selection under opaque tokens: C3 (condition), A2 + A3 (actions), P2 + P1 (parameters).
- Per-target support for A3 = `MISSING_CLIENT_FACT`, missing fact "Confirmation that the client already has an established hypoglycemia plan and access to rapid carbohydrate."
- Other four canonical tokens supported (C3 DIRECT, P1 DIRECT, A2/P2 GENERAL_KNOWLEDGE_LINK).
- `canonicalSetUniquelyDefensible: false`; `anyCanonicalTargetDependsOnAbsentFact: true`; `unstatedClientFactMateriallyChangesRankability: true`.
- `blindExactMatch: true`; `stage1Alignment: PARTIAL`.
- Distractor findings for A1, A4, C1, C2, P3, P4: all `materiallyAffectsRankability: false`; these do not change the primary verdict logic.

Producer Phase-F lock (`locks/CAND-18-phase-f.json` / `phase-f/CAND-18.json`, seal SHA-256 `021112323879082c0a8f0308fba6b3b9a4f732be32a2c7401b3a6deb1e75fded`):

- Provenance for the A3 missing fact: `RATIONALE_ONLY`, with `sourceEvidence: "rationale.byChoice[A3], rationale.correct, and testTakingStrategy introduce an existing hypoglycemia plan that the standalone stem never establishes."`
- `primaryVerdict: FAIL_UNSUPPORTED_TOKEN_PREMISE`; secondary flag `RATIONALE_ADDS_MISSING_FACT`; advisory priority `P1`.
- Reasoning: "Under the fixed precedence, FAIL_UNSUPPORTED_TOKEN_PREMISE governs because one keyed target requires a client-specific existing-plan premise absent from the stem. The rationale-only repetition cannot rescue standalone answerability. No sibling material exists or was inspected."

Producer adjudication line 18 (`adjudication.jsonl`) records the same phaseESha256 / phaseFSha256 digests and reproduces the classification with `anyCanonicalTargetDependsOnAbsentFact: true` and `canonicalSetUniquelyDefensible: false`.

### Live-content check (this pass)

I re-parsed `banks/gpt-canonical.json` in-session and read the candidate `gpt_format7c_exercise_hypoglycemia_bowtie` directly. The relevant surfaces are:

- Stem (en): "…continued the preexisting meal and insulin plan without an exercise-day adjustment."
  - Establishes a preexisting **meal and insulin** plan; does **not** state an existing hypoglycemia-treatment (rule-of-15) plan and does **not** state that rapid-acting carbohydrate is on hand or already prescribed.
- `rationale.correct.en`: "…use the existing hypoglycemia safety plan with rapid carbohydrate readily available."
- `rationale.byChoice` entry `act_hypo_safety` (the referent for A3): "…immediate safety requires ready access to rapid carbohydrate and prompt use of the existing low-glucose plan."
- `testTakingStrategy.en`: "Choose actions that use the existing hypoglycemia plan for immediate safety…"

The Simplified-Chinese counterparts of these three surfaces (`原有饮食和胰岛素方案` / `已有低血糖安全方案` / `已有低血糖方案`) mirror the English exactly: the preexisting plan asserted in the stem is meal-and-insulin, whereas the rationale/strategy assert an "existing hypoglycemia plan." Bilingual parity therefore replicates rather than repairs the omission.

### Assessment under frozen spec §§10–12 and work-order §5.3

Under §10, `MISSING_CLIENT_FACT` is the correct support classification only where "choosing, interpreting, or justifying the token requires a client-specific fact absent from the stem." The producer's argument is that the definite phrasing "the existing hypoglycemia treatment plan" and "when symptoms or a low reading occurs" makes A3 conditional on the client already possessing that plan and access, which the stem does not confer — the stem's only established preexisting plan is the meal/insulin plan.

Under §11, `RATIONALE_ONLY` is defined as "the standalone rationale adds a fact the stem does not." Producer identifies three surfaces (`rationale.correct`, `rationale.byChoice[act_hypo_safety]`, `testTakingStrategy`) that carry the assertion, which the stem alone does not carry. Live re-read confirms all three assertions exist as claimed and are traceable to the exact strings quoted in the phase-F seal.

Under §12, when the missing fact belongs to a **keyed** target and provenance is anything other than `SIBLING_CASE_IMPORTED`, `FAIL_UNSUPPORTED_TOKEN_PREMISE` governs by precedence. Because sibling material is unavailable by construction (`NO_ELIGIBLE_SIBLING_CASE` and §4.5 zero-hit probe), the `RATIONALE_ONLY` provenance cannot upgrade to `SIBLING_CASE_IMPORTED`, so the producer's precedence application is internally correct given its Phase-E classification of A3.

Work-order §5.3 requires that provenance be classified only from the bounded surfaces (candidate stem in EN and ZH, `rationale.correct`, `rationale.byChoice`, `testTakingStrategy`, `glossary`, explicitly linked historical sources; no corpus-wide search). The producer's Phase-F record enumerates exactly those surfaces and no others. The provenance record is procedurally in scope.

The producer evidence is therefore internally coherent under §§10–12 and §5.3 and correctly applied the §12 fixed precedence given the Phase-E classification. The point on which pass 1 differs is upstream of provenance: pass 1 treated the "keep rapid carbohydrate and follow the existing hypoglycemia plan" element as `GENERAL_KNOWLEDGE_LINK` — a normative expectation of routine T1DM self-management education (established diagnosis, symptomatic hypoglycemia below 70 mg/dL is a standard trigger to treat by the rule of 15 with rapid-acting carbohydrate; instructing the client to carry rapid carbohydrate is universal T1DM DSMES content) — rather than as a client-specific fact absent from the stem. Under that reading, no keyed target depends on a missing client-specific fact and PASS_STANDALONE governs.

Both readings are defensible under the spec text. §10 does not fully resolve where "GENERAL_KNOWLEDGE_LINK" ends and "MISSING_CLIENT_FACT" begins for a keyed target whose action phrasing uses a definite article ("the existing hypoglycemia treatment plan") — the same wording can be parsed either as "invoke the client-specific document that already exists" (MISSING_CLIENT_FACT if that document is not asserted in the stem) or as "the standard-of-care plan a T1DM client is universally expected to have and to have been educated on" (GENERAL_KNOWLEDGE_LINK). This is the exact spec residual that motivates work-order §5.3's bounded provenance step, and Phase F disposed of it strictly under the more conservative reading.

Per pass-2 instructions, **this checker does not revise pass 1**. The independent verdict remains PASS_STANDALONE and the frozen `independent-derivation.*` files are unchanged. The disagreement is recorded here for the architect.

## Producer internal consistency

- Deterministic gates report (`deterministic-gates.json`): §3.2 identity 13/13, §4.1 identity 50/31/19, §4.2 drift 0, §4.3 falsification pass, §4.4 structure 19/19, §4.5 probe 0 hits, §4.6 preservation 31/31. Consistent with pass-1 findings.
- Locks: 76 lock files present (19 candidates × 4 stages). CAND-18 seals resolve to the digests recorded inline in `adjudication.jsonl` line 18 (`phaseESha256` `57af275b…8879e`, `phaseFSha256` `021112…5fded`). No lock is missing, duplicated, or crossed.
- Blind semantic completion: producer reports 19 unique Sol/high context IDs × 2 sequential stages = 38 sealed turns. `semantic-contexts.jsonl` has one row per candidate; `blind-packets/` and `blind-reviews/` each contain 40 files (2 per candidate, plus expected instrument packets) consistent with that count.
- Combined 50-item accounting (report §"Verdict totals and combined current accounting"): 18 + 20 = 38 PASS, 0 + 7 = 7 hidden-case, 1 + 4 = 5 unsupported premise. Arithmetic correct against the frozen 2026-08-23 paired totals (20 / 7 / 4 = 31), and the unpaired half sums with the producer's own 18/0/1/19.
- Charter traps: producer's verification.md addresses Trap 1 (Node walk, not MCP file search), Trap 5 (only pure helpers imported — no `generateArtifacts` / `openingIdentity` / `assertFrozenBanks` / `finalize-and-verify`), Trap 6 (working-tree filesystem reads, no `git show HEAD:<bank>`). All consistent with the harness structure inspected in `run.ts`.

Producer artifacts are internally consistent.

## Preservation comparison

- `closeout-preservation.json` records `revision4TreeOpening` and `revision4TreeClosing` as 8-file arrays for `audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27/` (the failed R4 tree). Every opening SHA-256 equals its closing SHA-256; re-hashing all 8 R4 files in-session against the closing record returns identical digests — the failed R4 tree is byte-preserved end-to-end.
- Bank preservation: `bankRows` records 13 rows with `unchanged: true` and `openingSha256 == closingSha256` on every row. Re-hashing `banks/*.json` in-session (`shasum -a 256`) returns exactly the same 13 digests recorded in the pass-1 identity gate.
- Repository preservation: HEAD `3286024b…` and `origin/main` at ahead 0 / behind 0 both here and in the producer record. `finalDirtyPaths` enumerates the same pre-existing dirty state that pass-1 recorded (BANK-CENSUS.md, BANK-REVIEW-LEDGER.md, CLAUDE.md, PROJECT-HISTORY.md, STAGE-REFERENCE-…-2026-07-23.md, `banks/gpt-canonical.json`, `census.json`, plus the untracked audit directories and the two Phase-B patch scripts). No new dirtiness introduced by R5.
- Pass 1 wrote three files under `audit/campaign-16-phase-c-check-2026-08-27-r5/`; pass 2 adds three more files under the same directory. No producer artifact, banks/*.json, ledger, governance, schema, runtime, or R4 tree file was written or modified by pass 2.

Preservation records agree. No unauthorized side effect detected.

## Summary

- Mechanical gates §§3.2 / 4.1–4.6: **19 rows of pass-1 mechanical claims match producer output row-for-row, and both match live disk.**
- Verdict comparison: **18 / 19 exact agreement**; the sole disagreement is CAND-18 (`gpt_format7c_exercise_hypoglycemia_bowtie`) — producer FAIL_UNSUPPORTED_TOKEN_PREMISE, pass-1 PASS_STANDALONE.
- Producer's evidence chain, seals, and precedence application on CAND-18 are internally coherent under frozen §§10–12 and work-order §5.3. Pass 1 is not revised.
- Producer artifacts are internally consistent.
- Preservation is intact: R4 tree unchanged, 13 banks unchanged, HEAD unchanged, no unrelated dirty path touched.
- Exit-gate requirement of "19/19 exact verdict agreement between the independent Claude and the producer" is **not satisfied** at 18/19; the failed gate is the work-order §12 exit-gate item **"exact verdict agreement on all 19 primary dispositions"** (equivalently, spec §14/§15 scale-up disposition acceptance projected onto Claude-checker adjudication).
