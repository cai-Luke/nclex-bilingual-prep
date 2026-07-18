# P4 Single-Row Laboratory Presentation Survey

Status: **Closed (ratified 2026-07-18 via Principle 29; L1/S1 ratified, L2/L3/S2/S3 rejected, S4 closed without naming a class).**

This is a report-only architecture packet. It authorizes no schema floor, renderer change, bank edit,
reference-band change, or runtime change. The deterministic source of detailed evidence is
[`audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json`](audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json).

The generated manifest records the producer-pass mechanical state and intentionally retains its original pending semantic-review fields. Those fields are historical evidence of the seat split, not the current architecture status. The completed independent adjudication is recorded below, and the owner disposition is Principle 29.

## Two independent surfaces

- `lab_trend`: a candidate has exactly one `series` entry. The current validator deliberately permits
  one or two series and requires at least three timepoints. One analyte is not one observation.
- `structured_labs_panel`: a candidate is one individual `structuredMeasurements.panels[]` entry with
  `kind: "labs"` and exactly one row. Panels, not exhibits, are counted. The current schema requires
  nonempty rows and does not impose a two-row minimum.

The generator reuses `collectVisualRefs` for the six full-schema visual locations and the established
top-level/staged exhibit paths for structured measurements. It scans canonical, raw, and promoted
lanes separately. Missing optional staging directories are an empty population; other filesystem or
bank-validation failures are errors.

## Mechanical result

The canonical corpus contains 24 candidates across five banks:

- 11 of 20 `lab_trend` visuals have one series; the other nine have two series.
- 13 of 126 structured labs panels have one row; the other 113 have multiple rows.
- The 13 structured candidates comprise five top-level case exhibits and eight staged exhibits.
- Raw and promoted staging contain no P4 candidate in this isolated P4 branch. The manifest records
  every discovered file path and count. An absent optional lane serializes like a present lane with no
  JSON files; a noncandidate P4 surface still changes the lane's observation counts.
- All 24 candidates pass their current validation surface. All 11 candidate question visuals pass the
  applicable answer-coupled `lab_trend` self-check. The 13 structured panels correctly report
  `NOT_APPLICABLE_BY_CURRENT_CONTRACT` because structured panels have no renderer `selfCheck`.
- Absent structured-measurement population remains `unspecified` for both declared and effective
  population; no executable adult default is inferred. A missing bank schema declaration is `null`,
  never invented as schema `1.0`.

The manifest includes each candidate's exact path, schema version, population, values, label, unit,
metadata paths, stem, item-specific answer material and key, surrounding case/stage/exhibit prose,
and rationale passages. For case-level panels it carries every embedded tested decision rather than
mistaking the parent case stem for the answerable item.

## Policy calculations

The producer may calculate only the mechanical policies before independent review:

| Policy | Current result |
|---|---|
| L1 — preserve one or two series | 0 newly failing records |
| L2 — require two series universally | 11 newly failing records |
| L3 — conditional one-series exception | 0 newly failing records; all 11 are load-bearing and not exactly duplicated |
| S1 — preserve nonempty rows | 0 newly failing panels |
| S2 — require two rows universally | 13 newly failing panels |
| S3 — conditional one-row exception | 13 newly failing panels; all 13 are exactly duplicated by prose |
| S4 — floor for a named context class | Pending candidate review and an architecture-seat definition of that class |

L2 and S2 have no metadata-only repair. The checker classifications below make L3 and S3
deterministic for the current corpus: L1/L3 are equivalent, and S2/S3 are equivalent. S4 still
requires an architecture ruling; the producer inventoried context dimensions but did not name a
class.

Every policy also reports subsystem-specific consequences. Preserving either contract changes
nothing. A universal floor changes validation policy but does not inherently require a renderer
change: both current renderers already support the larger shape. Export-envelope effects occur only
if an architecture ruling introduces a new feature floor. `lab_trend` snapshot hashes change only
when payload or renderer bytes change; structured panels are not registered `QuestionVisual`
artifacts in the current promoted-visual baseline and therefore have no current visual-parity effect.

## Independent review instructions

For every manifest record, a producer-independent checker must classify:

1. whether the presentation is load-bearing;
2. whether intact prose exactly duplicates every value, unit, time relationship, and clinically
   relevant trend;
3. whether prose only partially duplicates isolated values;
4. whether a clinically meaningful second analyte or row belongs, rather than filler added for a floor;
5. whether the best fit is a one-analyte trend, one-row structured panel, ordinary prose, or another
   existing surface.

The first-pass manifest deliberately leaves these fields null. A reviewer may use the supplied
location, column, stage, exhibit, analyte, and prose facts, but must not invent the named S4 class.

## Alternatives for Luke

- Preserve each current surface contract (L1 and S1).
- Adopt a universal floor for only one surface (L2 or S2), accepting the exact listed migration scope.
- Adopt a semantic exception for only one surface (L3 or S3), using the completed independent
  adjudication below.
- For structured panels only, define a narrow evidence-supported context class and calculate S4 in a
  deterministic second pass.
- Make no floor change if the review shows that single-analyte trends and single-row panels are valid
  surface-specific uses.

The completed classifications do not themselves select a policy. Similar laboratory subject matter
is not evidence that the visual and structured-panel contracts should be collapsed.

## Commands

```sh
npm run survey:single-row-lab-panels
npm run test:single-row-lab-panels
```

The regression pins the current one-or-two-series `lab_trend` contract directly, all six visual
locations, panel-level counting, self-check applicability, optional-directory behavior, byte-identical
regeneration, structured population semantics, undeclared schema handling, and real temporary-bank
candidate addition/removal drift across records, summaries, observations, and policy impacts.

## Independent checker adjudication — 2026-07-18

Reviewed by Claude (the producer-independent checker seat named in this survey's `authority.seatSplit`
and in `CLAUDE.md`). This section authorizes **nothing**. It classifies the 24 manifest records against
the five fields the "Independent review instructions" section requires, so that L3/S3 become
calculable and the alternatives can be weighed with evidence. It selects no policy (L1–L3, S1–S4), names
no S4 context class, and changes no schema, renderer, bank, reference-band, or runtime behavior. Policy
selection and any S4 naming remain Luke's/architecture's ruling, not this section's.

### Reviewed artifact

At review time, the artifact was branch `codex/p4-single-row-labs`, worktree `Project-Shrimp-P4`,
commit `673755d` (message: "audit: add P4 single-row lab survey"); that branch was local and unpushed.
The survey and adjudication commits were subsequently consolidated into PR #58 with the related
July 18 maintenance work.

### Mechanical verification

Run from the worktree, independent of the producer's own claims:

- `npm run test:single-row-lab-panels` passes (traversal, six-location routing, panel counting,
  self-check applicability, population semantics, and fixture-based drift assertions all hold).
- `npm run survey:single-row-lab-panels` regenerates `survey-manifest.json` **byte-identical** to the
  committed file — zero drift.
- `npm run test-visuals` (the full CI-authorized visual suite, 18 scripts) passes with this branch
  checked out — no regression in any other kind.
- Manifest summary counts (24 candidates: 11 `lab_trend`, 13 `structured_labs_panel`; by-location
  breakdown 11 top-level question visual / 5 case exhibit / 8 staged case exhibit) match both the
  regenerated manifest and this document's prose exactly.

Two implementation claims were checked against source, not taken on the producer's word:

- `lab_trend`'s implicit `population ?? "adult"` default is real: `src/visuals/kinds/lab_trend/types.ts`
  documents "Default 'adult'" and `src/visuals/kinds/lab_trend/index.ts` applies `spec.population ??
  "adult"` in both the self-check and renderer paths. The manifest's `populationEffective` field for
  `lab_trend` records is therefore derived from actual runtime behavior, not invented.
- Structured-measurement panels have no equivalent default anywhere in `src/types.ts` or the table
  primitives. "Unspecified, no adult default inferred" for `structured_labs_panel` records is accurate.

### Method — read exact answer-key/rationale text, not a keyword scan

Load-bearing classification was derived by reading each candidate's `reviewPacket.testedDecisionEvidence`
(stem, task material, answer key, rationale) directly and checking whether the panel's specific value is
the value a correct answer actually depends on — not by checking whether the analyte name or unit
appears anywhere in the record. A first-pass keyword match against `analyteOrRowKey`/value produced
several false positives that a full read caught: cases where the case tests a *different* value for the
same analyte at another stage (e.g., a cloze answer keyed to an earlier or later reading than the one
this panel shows), or where the correct answer is driven by an unrelated finding (e.g., an IV-site
complaint) while the panel's lab value is scene-setting only. The classifications below reflect the
full-text read, not the keyword pass.

### `lab_trend` — 11/11 load-bearing, 0/11 exactly duplicated

All 11 candidates are top-level `question.visual` entries in `banks/lab-canonical.json`. In every case
the stem says only that the nurse reviews "the trend in the visual" — no stem restates the series
values, so none is exactly duplicated by prose. Each `meta.visual_justification` and rationale ties the
trend's direction/magnitude to the correct answer (rate of sodium correction, aPTT rise past a safety
threshold, potassium crossing into a treat-now range, etc.).

| questionId | analyte |
|---|---|
| gpt_u3_labtrend_2026_06_09_mc_potassium_furosemide_01 | potassium |
| gpt_u3_labtrend_2026_06_09_b_mc_platelets_heparin_01 | platelets |
| gpt_u3_labtrend_2026_06_09_b_mc_ptt_heparin_infusion_02 | ptt |
| gpt_u3_labtrend_2026_06_09_b_matrix_neutropenia_wbc_05 | wbc |
| gpt_u3_labtrend_2026_06_09_b_or_hypercalcemia_progression_07 | calcium |
| gpt_u3_labtrend_2026_06_09_b_cloze_sodium_overcorrection_08 | sodium |
| gpt_u3_labtrend_2026_06_09_b_cloze_inr_amiodarone_09 | inr |
| gpt_u3_labtrend_2026_06_09_mc_sodium_decline_02 | sodium |
| gpt_u3_labtrend_2026_06_09_or_hyperkalemia_progression_06 | potassium |
| gpt_u3_labtrend_2026_06_09_cloze_magnesium_decline_08 | magnesium |
| gpt_u3_labtrend_2026_06_09_cloze_calcium_thyroidectomy_09 | calcium |

**L1 and L3 both fail 0/11** — under the current corpus, the conditional exception (L3) and simple
preservation (L1) are equivalent. **The corpus provides no support for a universal L2 two-series floor**:
all 11 are single-analyte teaching points by design, and a forced second series would be fabricated,
clinically unnecessary data.

### `structured_labs_panel` — 13/13 exactly duplicated, 4/13 load-bearing

All 13 candidates' sole value is restated verbatim in the exhibit's surrounding prose (e.g.,
`opus20_case_cdiff_01`: panel shows potassium 3.1 mEq/L; exhibit text reads "Repeat potassium drawn at 6
hours is 3.1 mEq/L"). Exact duplication is uniform across all 13 and is not, by itself, a distinguishing
signal in this corpus — load-bearing status is what separates them.

| questionId | analyte / value | load-bearing | basis |
|---|---|---|---|
| gpt_case_gap_2026_06_11_case_adrenal_crisis_04 | glucose 48 mg/dL | **Yes** | Correct cloze answer text is "refractory hypotension, altered arousal, and glucose 48 mg/dL" — the exact value is the tested content. |
| gpt_case_taco_vs_trali_01 (BNP row, stage_4) | bnp 420 pg/mL | **Yes** | Correct select-all answer includes "BNP trends down from 890 pg/mL to 420 pg/mL after treatment." |
| gpt_case_nurse_provider_conflict_01 | potassium 3.4 mEq/L | **Yes** | Correct matrix row states "Repeat potassium after two doses is 3.4 mEq/L and the rhythm remains normal sinus." |
| gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01 | inr 1.8 | **Yes** | Stem/cloze directly test the institutional alteplase protocol threshold (INR > 1.7) against this exact value. |
| opus20_case_cdiff_01 | potassium 3.1 mEq/L | No | Not referenced by any of the case's 6 questions; the Stage-3 synthesis matrix classifies WBC, eGFR, urine output, and lactate but omits potassium. |
| opus22_case_postpartum_intrusive_thoughts_01 | hemoglobin 12.1 g/dL | No | Appears only in a "labs are unremarkable" background sentence; all 5 questions are psychiatric-assessment focused and never cite it. |
| gemini_gapfill_case_2026_06_10_case_wellness_03 | glucose 145 mg/dL | No | Never cited; the only lab value in any answer key is a different metric at a later visit (HbA1c 6.8% at 3 months). |
| gpt_case_gap_2026_06_11_case_aki_02 | potassium 5.3 mEq/L | No | The case's cloze answer cites a different, earlier potassium value (6.2 mEq/L with peaked T waves); the matrix tests creatinine/urine output/ibuprofen/specific gravity/nitrites, not potassium. |
| gpt_case_taco_vs_trali_01 (hemoglobin row, case exhibit) | hemoglobin 6.4 g/dL | No | Reason-for-admission background value; the correct answer citing a hemoglobin number uses a different, later reading (post-transfusion 8.1 g/dL). |
| claude_cs_jun06_cdiff_sic_01 | wbc 14,000/mm3 | No | All 4 questions concern PPE/precautions procedure; none references the WBC value. |
| opus_tpn_case_mucositis_01 | glucose 245 mg/dL | No | Not the tested value at any point: an earlier question tests 324 mg/dL, a later one tests a 180–200 mg/dL range; this panel's own reading is narrative-only. |
| opus3_iv_potassium_safety_case_01 | potassium 3.2 mEq/L | No | The Stage-3 question's correct answer ("stop the infusion, assess the IV site...") is driven by the client's IV-site burning complaint, not by the potassium value; no question cites 3.2 specifically. |
| opus5_case_consent_interpreter_01 | glucose 142 mg/dL | No | None of the case's 5 questions (consent/interpreter/VRI) reference glucose at all. |

**S2 and S3 both fail 13/13 in the current corpus.** S3's condition is "load-bearing AND not exactly
duplicated"; since every candidate is exactly duplicated, S3 offers no protection over S2 here regardless
of load-bearing status — the two policies are practically equivalent for this population. Separately from
the row-count policy question: the 9 non-load-bearing rows above are candidates whose datum is not used
by anything downstream in their case, which is worth Luke's attention independent of whatever P4 floor is
eventually chosen.

### S4 — left open

No named context class is ratified here; that is explicitly reserved for the architecture seat per this
document's own "Independent review instructions." As an **observed candidate axis only, not a proposal**:
most of the 13 structured candidates share a shape of "single-value stage-update exhibit whose reading is
already stated in the surrounding narrative prose." Whether that shape is worth naming as an S4 class,
and what it would mean to apply a floor to it, is left to Luke.

### What this section does not do

It does not select L1/L2/L3 or S1/S2/S3/S4. It does not alter the generated corpus inventory, the
manifest, any bank, renderer, or schema. It does not treat the 9-of-13 non-load-bearing finding as
grounds to remove or edit those panels — that would be a content/architecture decision downstream of this
checker pass, not this section's to make.
