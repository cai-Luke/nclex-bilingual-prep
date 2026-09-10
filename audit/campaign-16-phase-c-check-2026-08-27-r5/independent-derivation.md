# Campaign 16 Phase C Revision 5 — Independent Claude Derivation (pass 1)

**Role:** independent Claude checker, pass 1 (cold derivation under strict blinding).
**Date:** 2026-08-28.
**Repository HEAD:** `3286024bcab90c1a114811a7202d956c3e586bf4` (branch `main`, tracks `origin/main`, ahead 0 / behind 0).
**Bank read path:** working tree via the filesystem (Trap 6 respected — no git-object read of `banks/*.json`).

## Authority anchors

| Document | Expected SHA-256 | Observed SHA-256 | Match |
|---|---|---|---|
| `scratch/CAMPAIGN-16-PHASE-C-UNPAIRED-BOWTIE-ANSWERABILITY-WORK-ORDER-2026-08-27.md` | `74fb97e70ca5820a4e95acc62e2b0f3f54790d0eea766d2be58e8a427f924248` | `74fb97e70ca5820a4e95acc62e2b0f3f54790d0eea766d2be58e8a427f924248` | ✔ |
| `scratch/CAMPAIGN-16-QUALITY-CLOSEOUT-CHARTER-2026-08-26.md` | `c3cd80bd38474794a70861119bdc42d3f977b1393c32421c052e05fb34d522f6` | `c3cd80bd38474794a70861119bdc42d3f977b1393c32421c052e05fb34d522f6` | ✔ |

Frozen instrument: `STANDALONE-BOWTIE-ANSWERABILITY-AUDIT-SPEC-2026-08-23.md` §§4, 6–20 read in full.

## Blinding declaration

- I did **not** open, read, list, grep, hash, stat, or otherwise inspect any path under `audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/` (producer output for R5).
- I did not read any pre-existing content under `audit/campaign-16-phase-c-check-2026-08-27-r5/`; the three files created in this pass are the first content in that directory.
- I did not inspect any producer chat, transcript, or the failed R4 tree at `audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27/`.
- Working-tree bank bytes, the Phase A baseline, the frozen Aug-23 adjudication, and governing sources are the only inputs.

## Hash conventions

- **File-byte hash:** SHA-256 of raw file bytes.
- **Payload hash (§3.4):** `sha256(stableJson(q, 0))` — recursive sorted-key `JSON.stringify(v, null, 0)` plus trailing newline. Any other serialization is not comparable.

## §3.2 — bank identity gate

Computed via `shasum -a 256 banks/*.json` on the working tree.

**12 non-GPT banks vs. Phase A baseline (`audit/campaign-16-phase-a-baseline-2026-08-26/baseline.json → campaignBaselineFileByteSha256`): MATCH ×12.**

**GPT bank vs. named Phase B closing identity:** expected `e4955f7b8c54e4880bd9ddb0f2f7c35881169f53051b5ed3ce21757f86287b3b`; observed `e4955f7b8c54e4880bd9ddb0f2f7c35881169f53051b5ed3ce21757f86287b3b`. **MATCH.**

The frozen §2 clean-bank precondition is inverted per work order §3.1: a dirty `banks/gpt-canonical.json` is expected in Phase C and is not a blocker.

Result: **§3.2 identity gate PASS.**

## §4.1 — population rederivation

`derivePopulation` (pure helper from `audit/standalone-bowtie-answerability-census-2026-08-23/run.ts`) executed against the §3.2 snapshot; banks loaded independently, no `generateArtifacts`/`openingIdentity`/`assertFrozenBanks`/`finalize-and-verify` invoked (Trap 5).

| Metric | Live | Phase A reconciliation target |
|---|---|---|
| `_bowtie` suffix roster | 50 | 50 |
| Paired | 31 | 31 |
| `EXACT` | 30 | 30 |
| `ORDINAL_SUFFIX` | 1 | 1 |
| Unpaired `NO_ELIGIBLE_SIBLING_CASE` | 19 | 19 |
| Additions by ID | 0 | — |
| Removals by ID | 0 | — |

**Live unpaired roster (19):**

```
gpt_2026_07_03_2114_t1_01_co_exposure_bowtie
gpt_2026_07_03_2114_t2_01_cdiff_spores_bowtie
gpt_2026_07_03_2114_t2_02_imminent_suicide_bowtie
gpt_format13_last_bowtie
gpt_format13_mh_bowtie
gpt_format13_pd_peritonitis_bowtie
gpt_format14_hcm_bowtie
gpt_format15_acquired_methemoglobinemia_bowtie
gpt_format15_cardiac_tamponade_bowtie
gpt_format15_ect_prolonged_seizure_bowtie
gpt_format15_meningococcemia_bowtie
gpt_format15_palliative_malignant_bowel_obstruction_bowtie
gpt_format15_severe_asthma_bowtie
gpt_format15_sickle_acute_chest_bowtie
gpt_format15_splenic_sequestration_bowtie
gpt_format15_transfusion_anaphylaxis_bowtie
gpt_format15_vasa_previa_bleeding_bowtie
gpt_format7c_exercise_hypoglycemia_bowtie
gpt_format7c_heart_failure_action_plan_bowtie
```

Result: **§4.1 IDENTITY.**

## §4.2 — unpaired payload drift

Payload hashes under §3.4 for each of the 19 unpaired candidates, compared to `baseline.json → bowtie.unpaired[].currentHash`. **All 19 MATCH; drift = 0.** Full per-ID table in `independent-derivation.json`.

Result: **§4.2 PASS (no drift; consolidation was append-only for this set).**

## §4.3 — `_bt_` falsification (corrected R5)

Shell-tool Node walk over parsed banks; MCP file search prohibited (Trap 1).

- Live `_r2` IDs: `gpt_balance6a_2026_07_16_bt_perioperative_care_13_r2` present, not in `_bowtie` roster. `gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14_r2` present, not in `_bowtie` roster.
- Historical pre-repair IDs: both absent as live `question.id` values.

Result: **§4.3 PASS.**

## §4.4 — structural precondition

Every one of the 19 unpaired candidates has token counts `3/4/4` and canonical key cardinality `1/2/2`. Zero deviations.

## §4.5 — sibling-absence probe

Deterministic ID probe over all top-level `case_study` IDs in the 13 bundled banks.

- (a) `caseId === baseId`: 0 hits across the 19.
- (b) `/^baseId_\d{2}$/`: 0 hits.
- (c) substring containment either direction: 0 hits.

Zero hits total. **`CAMPAIGN16_PHASE_C_BLOCKED` conditions not triggered.**

## §4.6 — paired-disposition preservation

Frozen source: `audit/standalone-bowtie-answerability-census-2026-08-23/adjudication.jsonl → candidatePayloadSha256`. 31 paired candidates resolved by ID against the working tree; current payload hash computed under §3.4 and compared row-by-row.

**Result: 31 / 31 MATCH.** No paired-row drift; frozen instrument's paired verdicts remain applicable to live content.

This gate returning 31/31 is the explicit warrant for any combined 50-item disposition. Full row-by-row table in `independent-derivation.json`.

## §5.1 schema adaptation (recorded)

For every unpaired row the manifest carries `companionCaseId: null`, `companionBankPath: null`, `companionJsonPath: null`, `companionTopLevelIndex: null`, `companionTopLevelOrdinal: null`, `pairingRule: null`, and adds `unpairedReason: "NO_ELIGIBLE_SIBLING_CASE"`.

## §5.2 / §5.3 — verdict taxonomy and bounded provenance

- Frozen §12 taxonomy inherited verbatim (six primary verdicts, fixed precedence).
- `FAIL_HIDDEN_CASE_DEPENDENCY` retained but unreachable by construction under §4.5 zero-hit result; asserting it would trigger the §5.2 stop.
- Bounded provenance surfaces per §5.3: only the candidate's own `stem` / tokens / `rationale` / `rationale.byChoice` / `testTakingStrategy` / `glossary` / Chinese counterpart / explicitly linked `meta.source` were inspected. No corpus-wide search. `SIBLING_CASE_IMPORTED` unreachable here.
- Since my independent derivation found no MISSING_CLIENT_FACT (keyed or non-keyed with MATERIAL rankability impact) in any of the 19 candidates, §5.3 provenance classification was not exercised for any row.

## Independent primary dispositions (19 / 19)

Independent source re-derivation per charter §3 standing constraint 1 and work-order §12 exit gate item 4. Each row lists my primary verdict from the frozen §12 taxonomy plus a one-line evidence pointer sufficient for later comparison.

| # | Candidate ID | Primary verdict | Secondary flags | Evidence one-liner |
|---|---|---|---|---|
| 1 | `gpt_2026_07_03_2114_t1_01_co_exposure_bowtie` | PASS_STANDALONE | — | Closed room + CO alarm + gas equipment + shared HA/nausea/dizziness/confusion + SpO₂ 99% → C (CO exposure) / A (fresh air, high-flow O₂) / P (COHb, neuro) all stem-explicit. |
| 2 | `gpt_2026_07_03_2114_t2_01_cdiff_spores_bowtie` | PASS_STANDALONE | — | 10-d clindamycin + 8 watery stools/12 h + T 100.6 °F + cramping + positive C. difficile toxin + weak → C (Cdiff w/ spore risk) / A (contact + sporicidal) / P (stool, hydration) stem-supported. |
| 3 | `gpt_2026_07_03_2114_t2_02_imminent_suicide_bowtie` | PASS_STANDALONE | — | Explicit plan+means+timing+secrecy request → C (imminent suicide) / A (stay, activate protocol/remove means) / P (means, intent) stem-supported. |
| 4 | `gpt_format13_last_bowtie` | PASS_STANDALONE | — | LA infusion → metallic taste + tinnitus → seizure → V-ectopy + BP 78/42 → C (LAST) / A (stop + activate LAST kit, 20% lipid) / P (neuro/seizure, cardiac rhythm/BP) stem-supported. |
| 5 | `gpt_format13_mh_bowtie` | PASS_STANDALONE | — | Volatile anesthetic + rapid ETCO₂ 38→72 despite ↑ventilation + HR 142 + rigidity + T 98.6→101.7 °F in 20 min → C (MH) / A (stop triggers + hyperventilate 100% O₂, IV dantrolene) / P (ETCO₂, core temp) stem-supported. |
| 6 | `gpt_format13_pd_peritonitis_bowtie` | PASS_STANDALONE | — | Maintenance PD + new abd pain + cloudy effluent + no specimen/AB yet → C (PD peritonitis) / A (collect effluent first, then center empiric) / P (effluent appearance/WCC, abd pain/systemic) stem-supported. |
| 7 | `gpt_format14_hcm_bowtie` | PASS_STANDALONE | — | Active lung Ca + Ca 15.2 mg/dL + symptoms + dehydration + no HF + protocol and orders available → C (severe HCM) / A (ordered isotonic hydration, ordered calcitonin + antiresorptive) / P (serial Ca, volume/renal) stem-supported. |
| 8 | `gpt_format15_acquired_methemoglobinemia_bowtie` | PASS_STANDALONE | — | Benzocaine + cyanosis + SpO₂ 84% vs PaO₂ 118 + MetHb 28% + normal G6PD + RRT/prescriber at bedside → C (acquired methemoglobinemia) / A (stop oxidant + continue O₂, IV methylene blue) / P (co-ox MetHb, hemolysis + arterial O₂) stem-supported. |
| 9 | `gpt_format15_cardiac_tamponade_bowtie` | PASS_STANDALONE | — | Rapidly enlarging PE + BP 78/50 + HR 128 + ↑JVP + echo RA/RV diastolic collapse + drainage team available → C (unstable tamponade) / A (immediate image-guided drainage, cautious temporary IV fluid) / P (BP/HR/pulsus/perfusion, echo + drain output) stem-supported. |
| 10 | `gpt_format15_ect_prolonged_seizure_bowtie` | PASS_STANDALONE | — | ECT under GA + 185 s continued motor + EEG ictal + anesthesia/ECT MD at bedside + active protocol orders → C (prolonged ECT-induced seizure) / A (protocol pharm termination, airway + assisted ventilation) / P (motor/EEG cessation + recurrence, cardiorespiratory) stem-supported. |
| 11 | `gpt_format15_meningococcemia_bowtie` | PASS_STANDALONE | — | T 103.1 °F + BP 82/48 + HR 128 + new confusion + rapidly spreading nonblanching purpura + cultures drawn + ceftriaxone order available → C (meningococcemia) / A (prompt ordered ceftriaxone, Standard + Droplet) / P (BP/UO/mental, rash progression) stem-supported. |
| 12 | `gpt_format15_palliative_malignant_bowel_obstruction_bowtie` | PASS_STANDALONE | — | Last days of life + intra-abd cancer + colic + distention + feculent vomiting + no stool/flatus 3 d + confirmed obstruction + comfort goals + orders available → C (MBO) / A (reversibility review + nonpharm comfort, hyoscine butylbromide + antiemetic) / P (vomiting/distention/colic, comfort/sedation/mouth dryness/hydration burden) stem-supported. |
| 13 | `gpt_format15_severe_asthma_bowtie` | PASS_STANDALONE | — | 1–2 word speech + accessory muscles + RR 34 + SpO₂ 88% RA + PEF 42% + no anaphylaxis features + protocol/transfer available → C (severe exacerbation) / A (immediate transfer, protocol SABA + ipratropium + O₂ + ordered corticosteroid) / P (SpO₂/RR/accessory/mental, PEF/symptoms at ≤1 h) stem-supported. |
| 14 | `gpt_format15_sickle_acute_chest_bowtie` | PASS_STANDALONE | — | SCD + new cough/dyspnea/tachypnea + right crackles + SpO₂ 91% RA + new RLL infiltrate + orders available → C (acute chest syndrome) / A (ordered cephalosporin + macrolide + O₂, incentive spirometry + pulmonary hygiene) / P (SpO₂/RR/WOB/bronchospasm, Hb + imaging progression) stem-supported. |
| 15 | `gpt_format15_splenic_sequestration_bowtie` | PASS_STANDALONE | — | 6-yr SCD + sudden splenomegaly + Hb 8.6→6.2 g/dL + ↑retic + HR 142 + BP 78/42 + cap refill 5 s + no bleeding source + specialist directing + orders available → C (acute splenic sequestration) / A (ordered IV fluid, expert-directed transfusion without over-transfusion) / P (serial spleen size, Hb/BP/mental/cap refill) stem-supported. |
| 16 | `gpt_format15_transfusion_anaphylaxis_bowtie` | PASS_STANDALONE | — | 5 min into plasma component: hives + angioedema + stridor + wheeze + HR 132 + BP 76/40 + no hemolysis/volume-overload cues + protocol/orders available → C (anaphylactic transfusion reaction) / A (stop + activate response, ordered epinephrine + airway/O₂) / P (airway/WOB/SpO₂, BP/mental/perfusion) stem-supported. |
| 17 | `gpt_format15_vasa_previa_bleeding_bowtie` | PASS_STANDALONE | — | 34 wk + antenatal vasa previa + membrane rupture → immediate painless bleeding + sinusoidal → sustained bradycardia 70/min + stable maternal + operative/neonatal teams present → C (ruptured vasa previa w/ fetal hemorrhage) / A (immediate cesarean, alert neonatal team + O-negative blood) / P (continuous FHR until delivery, newborn Hb/HR/color/perfusion) stem-supported. |
| 18 | `gpt_format7c_exercise_hypoglycemia_bowtie` | PASS_STANDALONE | — | T1DM + new 45-min cycling + 3 days CGM 58–64 during/within 1 h + noncycling 95–140 + no illness/ketones + unchanged meal/insulin plan → C (activity-associated hypoglycemia) / A (prescriber/DSMES individualized plan, rapid carb + existing hypoglycemia plan) / P (peri-exercise glucose, timing/recurrence) stem-supported. |
| 19 | `gpt_format7c_heart_failure_action_plan_bowtie` | PASS_STANDALONE | — | Individualized yellow-zone plan defined in stem (≥ 2 lb + swelling/dyspnea → call same day + follow limits + take prescribed one-time extra diuretic only after team confirmation) + 3-wk stable + today +3 lb + new bilateral edema + exertional dyspnea + no red-zone symptoms → C (fluid retention crossing threshold) / A (call HF team today, take already-prescribed extra diuretic after confirmation) / P (morning weight, dyspnea + edema + urine response) stem-supported. |

### Verdict totals (this population)

| Verdict | Count |
|---|---|
| PASS_STANDALONE | 19 |
| FAIL_HIDDEN_CASE_DEPENDENCY | 0 |
| FAIL_UNSUPPORTED_TOKEN_PREMISE | 0 |
| FAIL_UNDERDETERMINED | 0 |
| FAIL_CANONICAL_KEY_OR_LOGIC | 0 |
| HOLD_REVIEWER_DISAGREEMENT | 0 |

### Descriptive-rate inputs (for later Phase D reasoning, no inferential statistics here)

- This population `FAIL_UNSUPPORTED_TOKEN_PREMISE`: **0 / 19**.
- Paired population (frozen 2026-08-23) `FAIL_UNSUPPORTED_TOKEN_PREMISE`: **4 / 31** (per charter §5 Phase D counts).

Both rates are recorded here as inputs to the architect's Phase D reasoning; no confidence interval or significance test computed.

## Exact commands run

- `shasum -a 256 scratch/CAMPAIGN-16-PHASE-C-UNPAIRED-BOWTIE-ANSWERABILITY-WORK-ORDER-2026-08-27.md`
- `shasum -a 256 scratch/CAMPAIGN-16-QUALITY-CLOSEOUT-CHARTER-2026-08-26.md`
- `git status --porcelain` / `git rev-parse HEAD` / `git rev-parse --abbrev-ref --symbolic-full-name @{u}` / `git rev-list --left-right --count HEAD...@{u}`
- `shasum -a 256 banks/*.json` (13 files)
- `npx --yes tsx /tmp/derive.ts` (imports pure `derivePopulation` only; banks loaded independently)
- `npx --yes tsx /tmp/drift.ts` (§4.2 payload drift for 19)
- `npx --yes tsx /tmp/bt_check.ts` (§4.3 `_bt_` falsification)
- `npx --yes tsx /tmp/sibling_probe.ts` (§4.5 sibling-absence probe over `case_study` IDs)
- `npx --yes tsx /tmp/paired_full.ts` (§4.6 preservation, 31 rows)
- `npx --yes tsx /tmp/struct_and_dump.ts` (§4.4 structural precondition + dumped candidate JSON payloads to `/tmp/candidate-dumps/*.json` for reading; nothing written into repo tree)

All commands emitted the results tabulated above. Process exit codes: 0 for every command.

## Terminal status (this pass-1 derivation only)

- §3.2 identity gate: PASS.
- §4.1 population: IDENTITY (50 / 31 / 19).
- §4.2 unpaired payload drift: 0.
- §4.3 `_bt_` falsification: PASS.
- §4.4 structural precondition: 0 deviations.
- §4.5 sibling-absence probe: 0 hits.
- §4.6 paired preservation: 31 / 31.
- Independent dispositions: 19 / 19 PASS_STANDALONE, no secondary flags.
- Bounded provenance §5.3: not invoked (no MISSING_CLIENT_FACT found).

Pass-1 written to disk; comparison with producer output is deferred to pass 2 and not attempted here. No `check.md`, `check.json`, or `comparison.md` created.
