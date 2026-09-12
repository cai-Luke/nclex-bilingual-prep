# Campaign 17 Phase A — independent review

**Seat:** Claude Opus 5, producer-independent. Neither the Campaign 17 producer nor any part of its delegation tree.
**Source:** `codex/campaign-17-residual-successor-2026-09-12` pinned at `816272456fdf7062c5c62ed9845ac3f8166938df`.
**Review branch:** `review/campaign-17-phase-a-independent-claude-opus-2026-09-12-r1`, isolated worktree.
**Terminal:** `CAMPAIGN17_PHASE_A_INDEPENDENT_REVIEW_COMPLETE`

This is adjudication only. No canonical bank, raw content, runtime code, schema, ledger, census, Campaign 16 evidence, or frozen Campaign 17 producer artifact was modified. No repair was implemented, no promotion performed, and no Campaign 17 closure is claimed.

---

## 1. Freeze and identity

| Check | Result |
|---|---|
| Pinned HEAD present on local branch and `origin` | identical, `8162724` |
| Phase-A frozen artifacts | **83/83** SHA-256 match |
| Live strict audit re-run at the pinned commit | **0 unresolved, 66 revealsAllStages, 75 missingRequiredAnchor** (exit 1, expected) |
| Row-key set vs. frozen population | exact match, no additions or omissions |
| Packet parents vs. live canonical banks | **38/38** object-hash match; all 66 rows carry the matching `sourceParentSha256` |
| Documentary grouping | 48 baseline/stage, 2 different-stage, 14 explicit semantic, 2 exact-stage/MEDIUM — reconciles |
| Phase-B population | 75 `missingRequiredAnchor` rows excluded, not reviewed |

The population was re-derived from the audit rather than accepted from the packet.

## 2. Reconciliation

**66/66 rows. 38/38 parents.** Every row carries a full machine-readable adjudication with no missing required field.

| Disposition | Reviewer | Producer proposal |
|---|---:|---:|
| CONTENT_REPAIR_REQUIRED | **47** | 40 |
| ANCHOR_ONLY_REPAIR_CANDIDATE | **17** | 20 |
| REPLACEMENT_CANDIDATE | **2** | 4 |
| REVIEW_HOLD | **0** | 2 |

Agreement: 28 agree, 26 agree-with-additions, 5 disagree, 4 agree-on-disposition/disagree-on-boundary, 1 partial disagree, 2 resolved holds. **8 disposition changes, 15 boundary changes.** Confidence is HIGH on all 66 rows.

Four rows carry a deliberate `HOLD_PENDING_*` boundary because the boundary is a *consequence* of a content decision the repair has not yet made; recording a boundary now would pre-commit the repair.

## 3. Both producer holds resolved

Neither hold was accepted presumptively; both were resolvable.

**`opus24_case_elder_neglect_med_mismanagement_01_q4`** → CONTENT_REPAIR at `stage_2_ed_initial`. Codex framed an either/or: approve stage_2 as protocol-application, or rewrite a self-contained stem. Neither works — stage_2 prescribes four of five keyed actions (pump, telemetry, magnesium, repeat labs), so approval yields retrieval; but keyed options E and F depend on the magnesium and repeat-lab *orders*, which cannot be inferred from a low magnesium value, so baseline strands them. The two constraints bind *different sentences*. Keep the boundary, keep the orders, delete the pump and telemetry prescriptions. The dilemma dissolves.

**`gpt_case_hipaa_disclosure_breach_01_q4`** → CONTENT_REPAIR at `stage_1`. The hold is well founded: keyed option D directs immediate permanent deletion including recently-deleted storage — irreversible destruction of potential breach evidence — with no institutional procedure supplied and no basis in HIPAA. Verified at 45 CFR 164.402 that the breach determination turns on a four-factor assessment in which mitigation is factor four but the nature and extent of the PHI and whether it was actually acquired are factors one and three, for which the destroyed image *is* the evidence. Recommend the confined route: contain and escalate, leaving disposition of the image to the Privacy Officer.

## 4. The 20 anchor-only rows

Treated as claims to test, not as a clean bill. **16 of 20 survived; 4 did not.**

The four failures share one mechanism, which is the producer's most actionable weakness: **retreating to `baseline` when the part's own options quote patient-specific values or therapies that only a hidden stage establishes.**

- `opus_case_lithium_toxicity_q2` — distractor D cites "the continuous normal saline infusion", ordered only in the hidden stage_1; the stem also cites "(Stage 1)".
- `opus_case_lithium_toxicity_q3` — three of four options quote stage_2 values (2.6 mEq/L, eGFR 30, 0.5 mL/kg/hr) that **contradict** the visible baseline (2.8, 28, 0.3).
- `opus_agvd_case_agvhd_01_q6` — the decisive case. Every row describes a *change*. At baseline, bilirubin 2.4 reads as a **rise** from 2.1, rash 40% as **spreading** from 30%, and two rows name drugs that do not exist yet. Hiding all stages would invert the key on three of five rows.
- `gpt_case_taco_vs_trali_01_q2` — different mechanism: two sibling **stems** name "TACO" outright, and under P23 all parts render together, so no anchor reaches the disclosure.

I built a numeric-dependency screen that detects the first mechanism mechanically across all 66 rows; the integration seat can re-run it rather than re-deriving it.

I also moved one row the other way. `cs_stemi_vfib_04_part_2` was proposed for replacement as a non-unique total order. I mounted the strongest challenge — in a monitored arrest with a defibrillator at hand, shock-first outranks compressions — and it **fails**, because option A is worded "call for the resuscitation team *and a defibrillator*", which establishes the device is not yet present and forces CPR before shock. Codex also asked for a pulse assessment to be added; stage_1415 already states "no palpable carotid pulse". Replacing this item would discard a sound one.

## 5. Cross-cutting findings

**Diagnostic titles and summaries are a defect class, not isolated incidents.** Eight parents have a globally-rendered title or summary that names the answer to one of their own parts: parents 17, 19, 25, 26, 28, 30, 32, 37. A title is visible at every boundary, so **no anchor can reach it**.

More consequentially, in four of those parents a rename is **necessary but not sufficient**, because the diagnosis is also stated in sibling *stems*, which render pre-submit under P23's simultaneous part rendering (parents 17, 25, 26, 32). Only parents 19 and 37 are safely rename-only — and I established that by surveying siblings rather than assuming it. **Recommend the integration seat run a whole-parent diagnosis-mention survey on every parent containing a diagnostic-identification item, covering titles, summaries and sibling stems.**

**Ordered-response keys are systematically over-constrained.** Of five ordered-response items examined, **four have non-unique keys** — thyroid storm q2, TPN-mucositis q3, opioid-safety q3, ICI q3. In three cases the item's own rationale concedes the concurrency that defeats its total order. Recommend a systematic review of the item type rather than four isolated repairs.

**Two bilingual defects, both from a term of art rendered literally.** Neither would be caught by a numeric screen — I built one and confirmed it misses both.
- `opus_case_lithium_toxicity_q4`: English "over one hour" becomes "超过一小时" (*more than* one hour) in **both** the stem and the stage exhibit, weakening the rate-safety premise the keyed answer depends on. The Chinese reader is shown a materially safer order.
- `opus_icit_case_01_q3`: "telemetry step-down" becomes "心电监护降级病房" (*downgraded* ward) inside a sentence directing transfer to "更高重症级别" (higher acuity) — self-contradictory in Chinese.

The other 64 rows are bilingually parallel across 907 checked field-pairs.

**Fourteen rows have a terminal boundary, so the anchor hides nothing.** Their `revealsAllStages` finding is *nominal*: the fail-open renderer already shows exactly what the correct boundary would show. Setting the anchor clears the audit finding without changing one rendered byte. Two of these were proposed as anchor-only (`gpt_case_pressure_injury_prevention_mobility_01_q5`, `opus3_iv_potassium_safety_case_01_q6`); both are closable **only because their content is sound at full visibility**, which is why I reviewed the content rather than relying on the anchor. These must be recorded as resolver corrections, not as remediated leaks.

**Other recurring defects:** keyed or distractor options resting on facts the chart never establishes (invented "neighbour and online videos", "ordered ice" and "hearing aids" inside a *keyed* option, a healthcare proxy that no instrument created, current vomiting that no stage records); matrices forcing single-choice over non-exclusive columns, in one case against the case's own staging thresholds; one select-all with **all six options keyed correct** (rare — 4 of 379 select_all items bank-wide).

**The two findings I would least want promoted unrepaired** are both ethical rather than boundary artifacts: the stroke parent's keyed option equating expressive aphasia with absence of decision-making capacity — contradicted by the chart's own record that the client follows commands, and by literature stating communication impairment must not be equated with impaired capacity — and the HIPAA parent's irreversible-deletion instruction.

## 6. Detection blind spot (outside the 66)

`opus3_iv_potassium_safety_case_01` has **no global exhibits**, yet all five non-residual siblings carry a *resolving* `baseline` anchor while their stems reference Stage 1 findings and orders. If honoured literally those accepted items render almost no chart. Because their anchors resolve, the stage-reference audit does not flag them — it detects absent or unresolved anchors, not anchors that resolve to the *wrong* stage. The 66-row population cannot surface this class by construction. I make no finding on non-residual rows; this is flagged for the integration seat.

## 7. Method

Every row was derived from the current parent **before** reading the producer proposal or either Campaign 16 judgment: what each part asks, the proposition required, which facts are established where, the earliest defensible boundary, and whether that prefix discloses the answer. Only then were the historical judgments and the new proposal opened. No verdict was reached by voting among the three prior seats.

Clinical and legal premises were checked against primary or authoritative sources whenever a verdict depended on them; source-registry summaries were treated as pointers only. 85 source-check entries are recorded, including the fetch failures and the sources discarded because the fetched page proved unrelated — so no verdict rests on a source that was not actually read. Where blocked (HHS, eCFR, CDC, NIA), primary text was obtained elsewhere and the substitution recorded.

## 8. What the integration seat must not infer

- No repair here is approved for implementation. Content and replacement rows need exact reviewed bilingual patches and must return to a producer seat, then to independent re-review.
- Shared-surface repairs are flagged per row with sequencing constraints. Three parents require **one** coordinated edit serving multiple residual rows (parents 22, 25, and the stage_2 edits in 32); making them row-wise risks duplicate or conflicting edits.
- Several repairs would reach **accepted non-residual siblings**. Those are changes to accepted content and need their own review; they are not authorised by this packet.
- Campaign 16's historical acceptance is not reopened.
