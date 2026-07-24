# Vital-Sanity Bounds P3 — Stage 3 Source Packet

**Date:** 2026-07-23  
**Status:** Source packet revised after architect citation/contract review; independent clinical/device checker and Luke's per-side ratification pending  
**Scope:** SBP ceiling, RR ceiling, and SpO₂ floor only  
**Implementation authority:** None

## Executive recommendation

| Vital side | Current warning-only sanity bound | Stage-3 result | Recommendation strength | Owner action requested |
|---|---:|---:|---|---|
| SBP ceiling | 300 mmHg | **300 is falsified; choose 400 or 500 by contract** | High that 300 is too low; policy-dependent for the replacement | Select the governed population, then ratify or reject its candidate |
| RR ceiling | 80/min | **150/min recommended** | High that 80 is too low; moderate-high for 150 | Ratify, reject, or select another sourced ceiling |
| SpO₂ floor (`spo2` only) | 50% | **0% recommended, with `sao2` explicitly excluded** | High for pulse-oximeter display/reportability | Ratify only with an explicit `sao2` disposition, or defer |

These are typo/unit-error tripwires after canonical-unit conversion. They are **not** normal ranges, critical thresholds, treatment thresholds, device accuracy claims, renderer envelopes, or assertions that values outside the interval are physiologically impossible.

Stage 3 resolves the evidence more strongly than it resolves every policy choice:

- SBP `300` cannot survive either a chart-vital population (`370/200`) or an all-direct-human-measurement population (`>480/350`). The source packet cannot choose between those two governed populations on evidence alone.
- RR `150/min` preserves a published spontaneous RR of `120/min`, adds headroom, and matches the upper reporting range of a current hospital monitor's capnography channel.
- SpO₂ `0%` follows the numeric display floor explicitly published by multiple **pulse-oximeter** manufacturers. It does not claim reliable accuracy throughout `0–69%`, and it does not source the separate arterial co-oximetry key `sao2`.

No unauthorized candidate is selected for another vital side. Two adjacent contradictions discovered during sourcing—DBP directly above its current ceiling, and a derived MAP tension—are recorded in §7 without being sourced or adjudicated here.

## 1. Governing contract

Stage 2 was ratified on 2026-07-18 in
`VITAL-SANITY-BOUNDS-P3-SURVEY-ARCHITECT-SPEC-2026-07-17.md` §20. It authorizes Stage 3 sourcing for exactly three sides:

1. SBP ceiling — extreme-value evidence;
2. RR ceiling — extreme-value evidence; and
3. SpO₂ floor — device/reporting-limit evidence.

The current inherited values remain:

- SBP: `40–300 mmHg`;
- RR: `2–80/min`; and
- SpO₂: `50–100%`.

`MeasurementDef.sanity` is a warning-only flowsheet tripwire. A source showing a critical threshold, ordinary reference range, or device alarm default does not by itself answer this task. The evidence must instead show that a real, transcribable numeric value can exceed the current ceiling or fall below the current floor.

The deterministic survey is non-dispositive: absence of such values from the current machine-readable corpus does not establish that the inherited renderer envelope is a suitable sanity tripwire.

### 1.1 Identity boundary: `spo2` is not `sao2`

The live allowlist contains two separate keys:

- `spo2`: a `VitalKey`, classified as `kind: "vital"`, currently inheriting `VITAL_DEFS.spo2.range = 50–100%`;
- `sao2`: a structured-only `kind: "lab"` ABG/co-oximetry key with its own hardcoded `sanity: 50–100%`.

The project deliberately de-conflated these identities during the structured-measurement migration. FDA pulse-oximeter guidance describes the modality as a **non-invasive** estimate reported as SpO₂, while the FDA-recognized pulse-oximeter equipment standard explicitly excludes oximeters that require a patient blood sample. The Stage-2 authorization names **SpO₂**, and the Stage-3 device sources are pulse-oximeter display specifications. They therefore support `spo2` only. They do not silently support arterial blood-gas/co-oximetry `sao2`, even though both use percent saturation.

A ratified `spo2.min = 0` may legitimately coexist temporarily with provisional `sao2.min = 50`, but only if the owner records that divergence explicitly. The alternatives are to defer the SpO₂ ruling until a separately authorized SaO₂ reporting-limit pass, or to open that new side through a scope amendment. This packet does not source or recommend a SaO₂ floor.

## 2. Evidence-selection rules

### Included

- primary human studies with direct measurement;
- primary clinical case reports or cohorts that record the relevant extreme value;
- manufacturer operator manuals and official specification pages for numeric display/reporting limits; and
- device range evidence used as corroboration when selecting engineering headroom.

### Excluded from decision weight

- adult or pediatric normal-range tables;
- hypertensive-crisis, tachypnea, or hypoxemia treatment thresholds;
- alarm-limit configuration ranges unless they also establish the numeric display/reporting range;
- unsourced claims about the "highest ever" value;
- secondary articles when the underlying primary source was available; and
- a current corpus maximum treated as a clinical upper or lower bound.

## 3. SBP ceiling

### 3.1 Source evidence

#### SBP-1 — direct intra-arterial resistance-exercise study

MacDougall et al. directly recorded brachial arterial pressure through an indwelling catheter in five experienced bodybuilders during heavy resistance exercise. During double-leg press, the group mean peak was `320/250 mmHg`; one subject exceeded `480/350 mmHg`.

This is unusually strong extreme-value evidence because the value was directly measured rather than inferred from a cuff, copied from a secondary source, or presented as a guideline threshold. It proves that a global warning at SBP `>300` can flag a real human arterial-pressure value.

It does **not** establish a physiologic maximum. The paper's wording is "exceeding 480/350," so the exact peak above 480 is not supplied by the abstract.

#### SBP-2 — emergency-department case report

Hussain and Fadel reported a 61-year-old woman whose hospital vital signs included blood pressure `370/200 mmHg`. The value was recorded as a patient vital in an emergency-department case, not as an exercise-laboratory waveform.

This source is weaker than SBP-1 because it is a single case report and the initial prehospital device reportedly could not obtain a value. It is nevertheless useful corroboration for the Stage-2 carried `~370` counterexample and independently demonstrates a transcribable clinical SBP above the current `300` ceiling.

### 3.2 Candidate analysis

| Candidate | Disposition | Reason |
|---:|---|---|
| 300 | Reject | Directly contradicted by both the `370` clinical case and the `>480` direct intra-arterial study. |
| 370 | Reject | Sits on one reported case value with no margin. |
| **400** | **Recommend if the contract is bedside/charted flowsheet values** | Preserves the `370/200` emergency-department vital with 30 mmHg headroom and retains stronger typo detection above 400. It deliberately excludes a resistance-exercise catheter peak outside the ordinary bedside-chart population. |
| 480 | Reject | The primary source says the pressure **exceeded** 480; an inclusive 480 ceiling is not enough. |
| **500** | **Recommend if the contract is all directly measured human values** | Round, close to the strongest primary evidence, and provides nominal headroom above 480. It weakens typo detection across 401–500 to preserve an unusual exercise-laboratory value class. |
| 550–600 | Do not prefer absent additional evidence | Would provide more unknown headroom, but weakens typo detection without a sourced value requiring it. |

### 3.3 Recommendation — owner contract fork

**The evidence supports rejection of `300`; it does not uniquely choose the replacement.**

Two coherent policies remain:

1. **`400 mmHg` — bedside/charted flowsheet contract.** The tripwire serves the values the NCLEX exhibit-flowsheet surface is expected to transcribe. This preserves the sourced `370/200` chart vital with margin while treating the resistance-exercise catheter peak as outside the governed authoring population.
2. **`500 mmHg` — all directly measured human values contract.** The tripwire promises not to warn on a directly measured human arterial-pressure value merely because its clinical context is unusual. This preserves the MacDougall observation but costs typo detection across the 401–500 interval.

The packet's producer preference remains **500 only if the global contract is explicitly the second one**. Absent that owner ruling, the SBP side is source-complete but not number-ready. No source in this packet proves that either 400 or 500 is a physiologic upper limit.

## 4. RR ceiling

### 4.1 Source evidence

#### RR-1 — prospective pediatric cohort

Usen et al. prospectively studied 1,072 children aged 2–33 months admitted with acute lower respiratory tract infection. A respiratory rate `≥90/min`, combined with other simple signs, formed part of the best predictor set for hypoxemia.

This does not identify the cohort maximum, but it establishes that `90/min` was a clinically occupied and analytically useful stratum—not merely a theoretical cutoff.

#### RR-2 — term-infant case report

A 3-week-old term infant was initially documented at `88/min` and, on readmission, had persistent tachypnea at `≥90/min`. This independently places real manually transcribed infant respiratory rates above the current ceiling of `80/min`.

#### RR-3 — infant pneumonia case with RR 120/min

Miller et al. reported a 4.5-week-old infant with Pneumocystis pneumonia whose physical examination recorded a respiratory rate of `120/min`, with room-air oxygen saturation of 87%.

This is the strongest clinical extreme-value anchor in the packet. It directly defeats candidate ceilings of 80, 90, or 100 and shows that even `120` is an occupied value rather than merely a monitor capability.

#### RR-4 — manufacturer reporting ranges

The Masimo Rad-97 operator manual specifies:

- RRa display range: `0–120 rpm`;
- RRp display range: `0–120 rpm`; and
- NomoLine capnography respiratory-rate display/accuracy range: `0–150 breaths/min`.

This device evidence is corroborative rather than the primary basis for the RR decision, because Stage 2 requested extreme-value evidence. It is useful for selecting margin above the published `120/min` clinical observation: a value up to `150/min` remains within a current hospital monitor's numeric reporting contract.

### 4.2 Candidate analysis

| Candidate | Disposition | Reason |
|---:|---|---|
| 80 | Reject | Published clinical values exceed it. |
| 90 | Reject | Real cases reach at least 120. |
| 100 | Reject | Real case at 120. |
| 120 | Do not prefer | Preserves the strongest located case exactly but recreates the Stage-2 "at the ceiling with no margin" defect. |
| **150** | **Recommend** | Adds 30/min headroom above the clinical anchor and aligns with a current capnography reporting range. |
| 200 | Do not prefer absent additional evidence | No located clinical extreme or device range forces the extra looseness. |

### 4.3 Recommendation

**Recommend ratifying an RR sanity ceiling of `150/min`.**

This is a global cross-population tripwire, and the pediatric/infant lane supplies the forcing evidence. The recommendation does not assert that spontaneous RR `150/min` is ordinary or reliably countable at bedside. It says that a warning-only typo guard should not reject a published `120/min` value and should retain some margin above it.

The main cost is reduced sensitivity to an HR/RR field swap in the `121–150` range. That tradeoff is real. A ceiling of `120` would catch more such swaps, but it would sit directly on a published legitimate value and repeat the no-margin architecture that triggered this sourcing pass.

## 5. SpO₂ floor

### 5.1 Source evidence

#### OX-1 — Masimo Rad-97 operator manual

The Rad-97 specifications publish a functional SpO₂ **display range of `0–100%`** in 1% increments. The same manual separately limits stated accuracy claims to specified ranges—principally `70–100%`, with a no-motion specification also shown for `60–80%`.

The distinction is decisive for this task:

- display/reporting range answers what numeric value the device can present;
- accuracy range answers how performance was validated;
- neither is a normal or treatment range.

A sanity tripwire designed to catch transcription/unit errors should not silently turn the accuracy-validation range into the numeric reporting floor.

#### OX-2 — Nonin Model 9843 official specifications

Nonin's official support page and operator manual publish an oxygen-saturation display range of **`0–100% SpO₂`**.

#### OX-3 — Nonin Model 9847 official specifications

Nonin's official support page and operator manual independently publish the same **`0–100% SpO₂`** display range.

The agreement across two manufacturers and multiple models makes the current inherited `spo2` floor of `50%` indefensible as a **pulse-oximeter device-reportability** boundary. It says nothing yet about the separate `sao2` co-oximetry reporting contract.

### 5.2 Candidate analysis

| Candidate | Disposition | Reason |
|---:|---|---|
| 50 | Reject | Official devices publish numeric display below 50. |
| 40 / 30 / 20 / 10 | Reject | Arbitrary intermediate floors; none matches the sourced reporting contract. |
| 1 | Do not prefer | Some devices may use 1 as a measurement floor, but the sourced Masimo and Nonin specifications explicitly include 0. |
| **0** | **Recommend** | Matches multiple official display ranges and the physical percentage floor; negative values remain invalid. |

### 5.3 Recommendation

**Recommend ratifying a `spo2` sanity floor of `0%`, not a generic oxygen-saturation floor.**

This recommendation does **not** claim that a displayed `0%` is necessarily an accurate physiologic measurement. It may represent profound desaturation, poor signal, sensor state, or another context requiring interpretation. Those are content-validity questions, not unit/value-mismatch questions. The tripwire's role is narrower: a nonnegative SpO₂ percentage within an official pulse-oximeter numeric display range is not a unit-conversion impossibility.

The warning-only `spo2` sanity interval would therefore become `0–100%`. Negative values would remain outside contract, while low numeric values would require question-level clinical/source review rather than being mechanically rejected by an inherited renderer floor.

`MEASUREMENT_ALLOWLIST.sao2.sanity` remains `50–100%` and provisional in this packet. That is an explicit scope disposition, not an assertion that 50 is clinically or analytically suitable for SaO₂.

## 6. Owner decision packet

Pending independent checking, two sides have one recommended number and one side has a policy fork:

```text
SBP ceiling: reject 300; choose 400 (bedside/chart contract) or 500 (all-direct-human-measurement contract)
RR ceiling: recommend 150/min
SpO₂ floor: recommend spo2 = 0%; explicitly retain sao2 = 50% provisionally or defer pending a new SaO2 scope
```

### Owner decision slots

- **SBP governed population:** [ ] bedside/charted flowsheet → candidate 400  [ ] all directly measured human values → candidate 500  [ ] reject both: ______
- **SBP ceiling after population selection:** [ ] ratify selected candidate  [ ] defer/reject
- **RR ceiling:** [ ] ratify 150  [ ] reject  [ ] select another sourced value: ______
- **SpO₂ identity disposition:** [ ] `spo2` only; leave `sao2` provisional at 50  [ ] defer and authorize separate SaO₂ sourcing  [ ] other: ______
- **`spo2` floor after identity disposition:** [ ] ratify 0  [ ] reject  [ ] select another sourced value: ______

Until Luke records a per-side ruling, all candidates remain recommendations and the current runtime contract remains unchanged.

## 7. Adjacent findings discovered during authorized sourcing

These findings are recorded so the narrow Stage-3 scope does not erase contradictions exposed by its own sources. They are **not** candidate recommendations and do not silently widen the commission.

### 7.1 DBP ceiling directly contradicted

MacDougall reports one subject's pressure **exceeding `480/350 mmHg`**. The current inherited DBP ceiling is `200 mmHg`. The same primary source used for SBP therefore directly supplies a forcing incident for the previously provisional DBP ceiling.

Stage 2 did not authorize DBP sourcing. This packet performs no DBP literature search and selects no DBP candidate. The owner should decide whether to amend the Stage-2 scope for a later DBP-ceiling pass.

### 7.2 MAP ceiling tension is derived, not directly sourced

The paper does not report MAP. Under the app's existing deterministic approximation, `DBP + (SBP - DBP) / 3`, the reported `480/350` pair implies approximately `393 mmHg`, above the inherited MAP ceiling of `250 mmHg`.

That is an application-derived consistency finding, not a verbatim clinical observation from MacDougall. It should not be represented as the paper directly falsifying MAP. It nevertheless shows that the present SBP/DBP/MAP envelopes cannot jointly accommodate the sourced pair when a corresponding MAP series is authored. MAP remains outside this sourcing commission pending an explicit scope decision.

## 8. Independent-checker assignment

The checker must not merely confirm that the URLs resolve. Re-derive:

1. **Contract:** the task is a warning-only canonical-unit sanity tripwire, not a reference/critical/accuracy range.
2. **SBP:** MacDougall et al. used direct brachial arterial catheter measurement; group mean was `320/250`; one subject exceeded `480/350`; the source does not identify an exact upper value above 480.
3. **SBP policy fork:** verify that `400` and `500` answer different governed-population contracts; sourcing alone does not select between them.
4. **SBP corroboration:** the emergency case actually reports `370/200`, while noting the prehospital device error and the limitations of a single case report.
5. **RR:** the prospective cohort used `≥90/min`; the infant case records `120/min`; no source in the packet establishes a spontaneous clinical RR of 150.
6. **RR engineering step:** `150` is a margin-bearing policy selection supported by monitor reportability, not a directly observed maximum.
7. **SpO₂:** the Masimo and Nonin sources say **display range** `0–100%`; do not rewrite that as an accuracy guarantee below the validated range.
8. **Identity boundary:** pulse-oximeter evidence supports `spo2`, not structured-only laboratory `sao2`; verify the live allowlist has two independent 50% floors and that the packet no longer silently conflates them.
9. **Adjacent sides:** DBP is directly contradicted by the same source, while MAP is only application-derived; neither receives a candidate here.
10. **Mechanism:** a floor override does not currently exist; no code work belongs in Stage 3.
11. **Scope:** no unauthorized side is sourced or ratified by this packet.

Any disagreement should be recorded per side. One weak source must not hold the other two sides hostage.

## 9. Downstream mechanism note — not authorized here

`VITAL_SANITY_MAX_OVERRIDES` is currently ceiling-only. If Luke ratifies the `spo2` floor, Stage 5 must preserve the separation between the renderer envelope and the warning tripwire.

Three implementation shapes should be distinguished before Stage 5:

1. **Change `VITAL_DEFS.spo2.range.min` to 0 — reject as a shortcut.** This would change the `vitals_trend` renderer authoring envelope as well as GATE 4. It recreates the exact contract conflation P3 is repairing and would require renderer/bank impact review for a change the clinical ruling did not authorize.
2. **Remove or make `sanity.min` optional — do not prefer.** The live `MeasurementDef` and GATE 4 contract require an explicit `{ min, max }`. Removing the floor is a broader data-contract redesign and would either admit negative values or require a separate non-negativity rule. A sourced physical/reporting floor of 0 is clearer than “no floor.”
3. **Add a floor-side override or general per-side override object — preferred contingent mechanism.** This changes only the warning tripwire, keeps negative SpO₂ outside contract, preserves the renderer range, and can carry the deliberate `spo2`/`sao2` distinction explicitly.

The exact code shape remains Stage 5 architecture. This note records why the apparently cheap alternatives are not equivalent; it authorizes no implementation. If the `spo2` floor is rejected, no floor mechanism is built.

Any eventual implementation remains a data-contract/clinical-claim change and must use the full verification path required by `AGENTS.md`, including a bank-impact survey and producer≠checker review.

## 10. Sources

### SBP

- **SBP-1:** MacDougall JD, Tuxen D, Sale DG, Moroz JR, Sutton JR. *Arterial blood pressure response to heavy resistance exercise.* Journal of Applied Physiology. 1985;58(3):785–790. PMID 3980383. DOI: 10.1152/jappl.1985.58.3.785.  
  PubMed: https://pubmed.ncbi.nlm.nih.gov/3980383/  
  Publisher: https://journals.physiology.org/doi/abs/10.1152/jappl.1985.58.3.785
- **SBP-2:** Hussain H, Fadel A. *Malignant Hypertension Without End-Organ Damage Secondary to Stressful Condition in a Female.* Cureus. 2020;12(8):e10109. PMID 33005527. DOI: 10.7759/cureus.10109.  
  https://www.cureus.com/articles/39949

### RR

- **RR-1:** Usen S, Weber M, Mulholland K, et al. *Clinical predictors of hypoxaemia in Gambian children with acute lower respiratory tract infection: prospective cohort study.* BMJ. 1999;318(7176):86–91. PMID 9880280. DOI: 10.1136/bmj.318.7176.86.  
  https://pubmed.ncbi.nlm.nih.gov/9880280/
- **RR-2:** Mirza A, Martinez M, Kilaikode S. *Unusual Cause of Respiratory Distress in a Term Neonate.* Ochsner Journal. 2022;22(2):196–198. PMID 35756586. DOI: 10.31486/toj.21.0101.  
  https://pmc.ncbi.nlm.nih.gov/articles/PMC9196966/
- **RR-3:** Miller RF, Ambrose HE, Novelli V, Wakefield AE. *Probable Mother-to-Infant Transmission of Pneumocystis carinii f. sp. hominis Infection.* Journal of Clinical Microbiology. 2002;40(4):1555–1557. PMID 11923396. DOI: 10.1128/JCM.40.4.1555-1557.2002.  
  https://pmc.ncbi.nlm.nih.gov/articles/PMC140394/
- **RR-4:** Masimo. *Rad-97 Operator's Manual*, Chapter 14 specifications; pulse CO-oximetry display ranges on manual p. 161 and NomoLine capnography specifications on pp. 172–174.  
  https://techdocs.masimo.com/globalassets/techdocs/pdf/lab-9275k_master.pdf

### SpO₂

- **OX-1:** Masimo. *Rad-97 Operator's Manual*, Chapter 14 specifications, manual pp. 161–163.  
  https://techdocs.masimo.com/globalassets/techdocs/pdf/lab-9275k_master.pdf
- **OX-2:** Nonin Medical. *Model 9843 Specifications* and operator manual.  
  https://www.nonin.com/support/9843/  
  https://www.nonin.com/wp-content/uploads/2018/09/Operators-Manual-9843.pdf
- **OX-3:** Nonin Medical. *9840 Series / Model 9847 Specifications* and operator manual.  
  https://www.nonin.com/support/9840/  
  https://www.nonin.com/wp-content/uploads/Operators-Manual-9847.pdf
- **OX-4:** U.S. Food and Drug Administration. *Pulse Oximeters — Premarket Notification Submissions [510(k)s]: Guidance for Industry and FDA Staff.* Defines pulse oximetry as non-invasive SpO₂ measurement.  
  https://www.fda.gov/regulatory-information/search-fda-guidance-documents/pulse-oximeters-premarket-notification-submissions-510ks-guidance-industry-and-food-drug
- **OX-5:** U.S. Food and Drug Administration. Recognition record for ISO 80601-2-61:2017. The pulse-oximeter equipment standard excludes oximeters requiring a patient blood sample.  
  https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfStandards/detail.cfm?standard__identification_no=37508

## 11. Closeout state

Stage 3 has produced a bounded source packet and per-side recommendation. It has not:

- ratified a number;
- changed a source file, bank, renderer, schema, or runtime mechanism;
- sourced or selected candidates for the newly exposed DBP/MAP adjacent findings;
- changed the separate `sao2` floor;
- run an implementation impact survey; or
- discharged the independent-checker requirement.

The next step is independent source/logic review, followed by Luke's three separate owner rulings.