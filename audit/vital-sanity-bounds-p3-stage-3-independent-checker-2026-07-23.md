# Vital-Sanity Bounds P3 — Stage 3 Independent Checker Report

**Date:** 2026-07-23
**Seat:** Independent checker (evidence review only; no implementation authority).
**Commission:** Independent Checker Handoff — P5 CI Coverage and P3 Vital-Sanity Stage 3 (2026-07-23), PR 2.
**Producer packet under review:** `audit/vital-sanity-bounds-p3-stage-3-source-packet-2026-07-23.md` (SHA-256 `4be7e911869480dc3ed5e0324dafd28631a9282ba2dabb10038e52cd99e0c562`, preserved unchanged in the first commit of this branch).
**Governing authority:** `VITAL-SANITY-BOUNDS-P3-SURVEY-ARCHITECT-SPEC-2026-07-17.md` §20 (Stage-2 ratification authorizing Stage-3 sourcing for exactly SBP ceiling, RR ceiling, SpO₂ floor).
**Base:** clean `main` at `db1f444fbb96f317c995b055c1331a1511ea426c`.

Verdict vocabulary: `SUPPORTED` / `SUPPORTED WITH CORRECTION` / `NOT SUPPORTED` / `UNRESOLVED — OWNER CONTRACT REQUIRED`.

This report authorizes **no** implementation. It selects no number, changes no bank/renderer/schema/allowlist/mechanism, and expands no scope. Producer claim, checker finding, and owner decision are labeled distinctly. Per §12 of the commission, a mixed verdict is expected; one weak source is not allowed to hold the others hostage.

---

## 0. Method — what the checker actually re-derived

Primary sources were read, not merely resolved. Device PDFs were inspected page-by-page.

**External primary sources (re-derived verbatim):**

| Ref | Source | What the checker independently confirmed |
|---|---|---|
| SBP-1 | MacDougall et al., *J Appl Physiol* 1985;58(3):785–790 (PMID 3980383) | "Blood pressure was directly recorded by means of a capacitance transducer connected to a catheter in the brachial artery." Five experienced body builders. "The greatest peak pressures occurred during the double-leg press where the mean value for the group was **320/250 mmHg**." "with pressures in one subject **exceeding 480/350 mmHg**." No exact maximum above 480 is stated (wording is "exceeding"). |
| SBP-2 | Hussain & Fadel, *Cureus* 2020;12(8):e10109 (PMID 33005527) | Patient a 61-year-old female with "a blood pressure of **370/200 mmHg**." (Prehospital-device-failure detail: see correction note below.) |
| RR-1 | Usen et al., *BMJ* 1999;318:86–91 (PMID 9880280) | "1072 of 42 848 children, aged **2 to 33 months**"; "a respiratory rate **≥90 breaths/min** formed the best predictors of hypoxaemia (sensitivity 70%, specificity 79%)." |
| RR-2 | Mirza et al., *Ochsner J* 2022;22(2):196–198 | ~3-week infant; "a respiratory rate of **88/min**" at initial presentation; "readmitted 1 week later because of persistent tachypnea (respiratory rate of **≥90/min**)." |
| RR-3 | Miller et al., *J Clin Microbiol* 2002;40(4):1555–1557 (PMID 11923396) | 4.5-week infant with Pneumocystis pneumonia; "a respiratory rate of **120/min**"; "oxygen saturations in air of **87%**." |
| RR-4 / OX-1 | Masimo Rad-97 Operator's Manual, Chapter 14 (PDF `lab-9275k_master.pdf`, inspected pp. 161–163, 171–174) | **p.161:** SpO₂ (Functional Oxygen Saturation) Display Range **0% to 100%**, resolution 1%; RRa **0–120 rpm**; RRp **0–120 rpm**. **pp.162–163:** SpO₂ accuracy (ARMS) specified only for **60–80% (no motion)** and **70–100%** — narrower than the display range. **p.172:** NomoLine Capnography Respiratory Rate Display Range **0 bpm to 150 bpm**. **p.173:** RR accuracy "0 to 150 breaths per minute (bpm) ±1 bpm." |
| OX-2 | Nonin Model 9843 specifications | "Oxygen Saturation Display Range: **0% to 100% SpO2**." |
| OX-3 | Nonin Model 9847 (9840 series) specifications | "**0% to 100% SpO2**." |

**Live-disk source facts (re-derived at `db1f444`):**

- `src/visuals/kinds/vitals_trend/defs.ts:14-18`: `sbp` range `40–300`, `dbp` `20–200`, `map` `30–250`, `rr` `2–80`, `spo2` `50–100`.
- `src/measurementAllowlist.ts:57-71`: each vital's `sanity` inherits `VITAL_DEFS[key].range` unless a `VITAL_SANITY_MAX_OVERRIDES` entry supplies a **max**. `VITAL_SANITY_MAX_OVERRIDES` (lines 52-55) contains only `temp: 46.5`. The override is applied as `{ min: def.range.min, max: maxOverride }` (line 67) — **ceiling-only**; there is no floor-override path.
- `src/measurementAllowlist.ts:93-99`: `sao2` is a **structured-only** `kind:"lab"` entry with hardcoded `sanity: { min: 50, max: 100 }`, independent of `spo2`.
- Therefore `spo2` (a `VitalKey`, sanity `50–100` via `VITAL_DEFS`) and `sao2` (lab, sanity `50–100` hardcoded) are two separate identities with two separate current 50% floors. Confirmed.
- Because `VITAL_DEFS.spo2.range` feeds **both** the `vitals_trend` renderer envelope and (via `measurementAllowlist`) the sanity tripwire, changing `.range.min` would move both at once.

**Commands not executable as written:** the Cureus full text returned HTTP 403 to this seat; the 370/200 value and patient demographics were confirmed from the accessible abstract, but the prehospital-device-failure detail could not be confirmed from the reachable text (see SBP correction).

---

## 1. Per-side verdicts

### SBP source evidence → **SUPPORTED** (with one immaterial citation caveat)

1. **Exact primary-source support.** MacDougall SBP-1 is confirmed verbatim on all four load-bearing points: direct intra-arterial brachial catheter; group mean double-leg-press peak `320/250`; one subject `>480/350`; and no exact maximum above 480. This is the strongest possible extreme-value class (directly measured, not cuff-inferred or guideline-derived). Hussain & Fadel SBP-2 confirmed at `370/200`, 61-year-old female.
2. **Source/interpretation defect.** One caveat: the packet §3.1 states "the initial prehospital device reportedly could not obtain a value." The Cureus full text 403'd to this seat; I confirmed `370/200` and demographics from the abstract but could not confirm the prehospital-device detail from reachable text.
3. **Does the defect change the candidate?** No. The prehospital detail only *weakens* SBP-2 (already the packet's secondary, corroborating source); it cannot inflate the evidence. The primary anchor (MacDougall) is fully verified and independently sufficient to reject 300.
4. **Remaining owner decision.** None for source validity.
5. **Implementation prohibited?** Yes.

### Rejection of SBP 300 → **SUPPORTED**

1. **Support.** Two independent transcribable human SBP values exceed the current `300` ceiling: the `370/200` charted ED vital and the `>480/350` directly measured arterial pressure. Live current ceiling is `300` (`defs.ts:14`).
2. **Defect.** None.
3. **Change candidate?** N/A — 300 is falsified under either governed population.
4. **Owner decision.** Rejection of 300 is not itself in doubt; the replacement is (next lane).
5. **Implementation prohibited?** Yes.

### SBP 400 / 500 contract fork → **UNRESOLVED — OWNER CONTRACT REQUIRED**

1. **Support.** `400` and `500` answer **genuinely different governed populations**, verified against the evidence: `400` = bedside/charted flowsheet contract (preserves the `370/200` chart vital with ~30 mmHg headroom, treats the resistance-exercise catheter peak as outside the authoring population, retains stronger typo detection above 400); `500` = all-directly-measured-human contract (preserves the `>480/350` MacDougall observation with nominal headroom, at the cost of typo detection across 401–500). `480` is correctly rejected because the source says "exceeding 480," so an inclusive 480 is insufficient.
2. **Defect.** None. Critically, **neither candidate is misrepresented as a physiologic maximum** — the packet states plainly "No source in this packet proves that either 400 or 500 is a physiologic upper limit." That is accurate.
3. **Change candidate?** No candidate is selected; the fork is the honest state.
4. **Remaining owner decision.** The owner must select the governed population (bedside/chart → 400, or all-direct-human → 500), or reject both. The evidence alone cannot choose.
5. **Implementation prohibited?** Yes.

### RR source evidence → **SUPPORTED**

1. **Support.** All four RR sources confirmed verbatim (table §0). The forcing clinical anchor is Miller's `120/min` in a 4.5-week infant — a real, manually transcribable value that directly defeats ceilings of 80/90/100. Usen (`≥90/min` predictor) and Mirza (`88→≥90/min`) independently place real infant RRs above the current `80/min` ceiling. Masimo device ranges (RRa/RRp `0–120`; NomoLine capnography `0–150`) confirmed by direct page inspection.
2. **Defect.** None.
3. **Change candidate?** No.
4. **Owner decision.** None for source validity.
5. **Implementation prohibited?** Yes.

### RR 150 recommendation → **SUPPORTED**

1. **Support.** `80` is rejected (published values exceed it); `120` preserves the strongest anchor exactly but recreates the Stage-2 no-margin defect; `150` adds ~30/min headroom above the `120/min` clinical anchor **and** sits within a current hospital monitor's numeric reporting contract (NomoLine capnography RR display/accuracy `0–150`, verified on Masimo pp.172–173).
2. **Defect / limitation.** `150/min` is correctly described as an **engineering margin supported by device reportability, not an observed clinical maximum**. No clinical source in the packet reports a spontaneous RR of `150/min` — confirmed; the highest verified clinical value is `120/min`. The RRa/RRp channels themselves top out at `120`; the `150` reportability comes specifically from the capnography channel. The packet does not overstate this.
3. **Change candidate?** No. The disclosed cost — reduced HR/RR field-swap detection across `121–150` — is real and correctly surfaced; a `120` ceiling would catch more swaps but sit on a legitimate published value.
4. **Owner decision.** Ratify `150`, reject, or select another sourced value.
5. **Implementation prohibited?** Yes.

### SpO₂ device evidence → **SUPPORTED**

1. **Support.** Three official pulse-oximeter display ranges of `0–100%` confirmed across two manufacturers and three models (Masimo Rad-97 p.161; Nonin 9843; Nonin 9847). The accuracy-vs-display distinction is real and verified: Masimo validates accuracy only across `60–80%` (no motion) and `70–100%`, materially narrower than the `0–100%` display range.
2. **Defect.** None. The packet consistently preserves the display/accuracy distinction (§5.1, §5.3) and never rewrites the display range as an accuracy guarantee.
3. **Change candidate?** No.
4. **Owner decision.** None for device-source validity.
5. **Implementation prohibited?** Yes.

### `spo2` vs `sao2` identity boundary → **SUPPORTED**

1. **Support.** Live disk confirms two independent keys, each with its own current 50% floor: `spo2` (`kind:"vital"`, sanity `50–100` inherited from `VITAL_DEFS`) and `sao2` (`kind:"lab"`, hardcoded sanity `50–100`, `measurementAllowlist.ts:93-99`). The Stage-3 device sources are **pulse-oximeter** display specifications; FDA guidance frames pulse oximetry as a non-invasive SpO₂ estimate and the recognized pulse-oximeter equipment standard (ISO 80601-2-61) excludes oximeters requiring a blood sample. The evidence therefore supports `spo2` and does **not** silently support arterial co-oximetry `sao2`.
2. **Defect.** None. The packet no longer conflates the two identities.
3. **Change candidate?** No.
4. **Remaining owner decision.** See the SaO₂ disposition below.
5. **Implementation prohibited?** Yes.

### `spo2 = 0` recommendation → **SUPPORTED**

1. **Support.** `0%` matches multiple official pulse-oximeter numeric display floors and the physical percentage floor; negative values remain out of contract. The recommendation explicitly does **not** claim reliable accuracy across `0–69%` — it distinguishes reportability (a nonnegative percentage within an official display range is not a unit/value impossibility) from clinical validity (a low displayed value still needs question-level review). This is the correct, narrow tripwire framing.
2. **Defect.** None.
3. **Change candidate?** No.
4. **Owner decision.** Ratify `spo2` floor `0`, reject, or select another sourced value — *contingent on the SaO₂ disposition below*.
5. **Implementation prohibited?** Yes.

### SaO₂ owner disposition → **UNRESOLVED — OWNER CONTRACT REQUIRED**

1. **Support.** `sao2.sanity` remains `{min:50, max:100}` on live disk and is untouched by any Stage-3 pulse-oximeter source. The packet does not source or recommend a SaO₂ floor.
2. **Defect.** None — this is a deliberate scope boundary, not an omission.
3. **Change candidate?** N/A.
4. **Remaining owner decision.** The owner must **explicitly** choose one of: (a) ratify `spo2=0` while retaining `sao2=50` provisionally (recording the divergence); (b) defer the SpO₂ ruling pending a separately authorized SaO₂ reporting-limit pass; or (c) open a SaO₂ side by scope amendment. A `spo2=0`/`sao2=50` divergence is legitimate only if recorded explicitly.
5. **Implementation prohibited?** Yes.

### DBP adjacent finding → **SUPPORTED** (recorded, not adjudicated)

1. **Support.** MacDougall's `>480/350` supplies a diastolic value `>350 mmHg`, directly above the current inherited DBP ceiling of `200` (`defs.ts:15`). The same primary source used for SBP thus contradicts the DBP ceiling.
2. **Defect.** None.
3. **Change candidate?** Correctly, **none**. Stage 2 (§20) did not authorize DBP sourcing; the packet performs no DBP search and selects no DBP candidate.
4. **Remaining owner decision.** Whether to amend the Stage-2 scope for a later DBP-ceiling pass.
5. **Implementation prohibited?** Yes — and no candidate may be introduced here.

### MAP adjacent finding → **SUPPORTED** (application-derived, not directly reported)

1. **Support.** The paper does not report MAP. Under the app's deterministic approximation `DBP + (SBP − DBP)/3`, the `480/350` pair yields `350 + (480−350)/3 = 350 + 43.3 ≈ 393 mmHg`, above the inherited MAP ceiling of `250` (`defs.ts:16`). Arithmetic re-derived and confirmed.
2. **Defect.** None. The packet correctly labels this **application-derived**, not a verbatim clinical observation, and warns it must not be represented as the paper directly falsifying MAP.
3. **Change candidate?** No candidate; correct.
4. **Remaining owner decision.** MAP remains outside this commission pending an explicit scope decision.
5. **Implementation prohibited?** Yes.

### Contingent floor-override mechanism → **SUPPORTED** (no Stage-3 implementation)

1. **Support.** Live disk confirms `VITAL_SANITY_MAX_OVERRIDES` is **ceiling-only** (`measurementAllowlist.ts:52-67`): the override object supplies only a `max`; the `min` always inherits `def.range.min`. A ratified `spo2` floor below the inherited value therefore has **no** current mechanism and would require a new floor-side or general per-side override object.
2. **Defect.** None. The packet's §9 correctly rejects the two shortcuts: changing `VITAL_DEFS.spo2.range.min` (would move the renderer envelope + GATE 4, verified because that field feeds both) and removing/optionalizing `sanity.min` (broader data-contract redesign). It prefers a floor-side/per-side override that touches only the warning tripwire.
3. **Change candidate?** N/A.
4. **Remaining owner decision.** Mechanism shape is Stage-5 architecture, contingent on the `spo2` floor being ratified. If the floor is rejected, no floor mechanism is built.
5. **Implementation prohibited?** Yes — explicitly, in Stage 3.

### Overall scope compliance → **SUPPORTED**

1. **Support.** The packet sources exactly the three authorized sides (SBP ceiling, RR ceiling, SpO₂ floor). It selects no other vital side, no bank/renderer/schema/GATE-4/population-tripwire/pediatric-range change, no SaO₂ floor, and no DBP/MAP candidate. The two adjacent contradictions (DBP, MAP) are recorded in §7 without being sourced or adjudicated.
2. **Defect.** None.
3. **Change candidate?** N/A.
4. **Owner decision.** None for scope.
5. **Implementation prohibited?** Yes.

---

## 2. On corrections to the producer packet

Per §12, minor citation/wording corrections may be made in this second commit; a substantive candidate change must instead be reported as a hold/owner decision. There is no substantive candidate change to make — every candidate is source-supported or correctly left to the owner. The single citation caveat (the unverified prehospital-device-failure detail in SBP-2) only weakens an already-secondary source and does not alter any candidate; I record it here rather than mutating the preserved packet, keeping the producer artifact byte-intact for provenance. This checker's second commit therefore adds exactly one file: this report.

---

## 3. Summary table

| Lane | Verdict | One-line disposition |
|---|---|---|
| SBP source evidence | SUPPORTED | MacDougall verified verbatim (direct arterial 320/250, one subject >480/350, no exact max); 370/200 confirmed; prehospital detail unverifiable but immaterial. |
| Rejection of SBP 300 | SUPPORTED | Both 370 and >480 exceed the current 300 ceiling. |
| SBP 400/500 contract fork | UNRESOLVED — OWNER CONTRACT REQUIRED | Two genuinely different governed populations; evidence cannot choose; neither is a physiologic maximum. |
| RR source evidence | SUPPORTED | Usen ≥90, Mirza 88→≥90, Miller 120, Masimo 0–120/capnography 0–150 all verified. |
| RR 150 recommendation | SUPPORTED | Engineering margin from device reportability + 120 anchor + 30 headroom; not an observed max; swap-detection cost disclosed. |
| SpO₂ device evidence | SUPPORTED | Three device display ranges 0–100% confirmed; accuracy (70–100%/60–80%) correctly kept narrower. |
| `spo2` vs `sao2` identity boundary | SUPPORTED | Two separate live keys, two 50% floors; pulse-oximeter evidence supports `spo2` only. |
| `spo2 = 0` recommendation | SUPPORTED | Matches official display floors + physical floor; no accuracy claim across 0–69%. |
| SaO₂ owner disposition | UNRESOLVED — OWNER CONTRACT REQUIRED | Owner must explicitly retain sao2=50 provisionally, defer, or authorize a SaO₂ scope. |
| DBP adjacent finding | SUPPORTED | MacDougall >350 contradicts the 200 ceiling; correctly recorded, no candidate. |
| MAP adjacent finding | SUPPORTED | ~393 is application-derived, not directly reported; correctly labeled, no candidate. |
| Contingent floor-override mechanism | SUPPORTED | Override is ceiling-only on disk; floor needs a new per-side mechanism; deferred to Stage 5. |
| Overall scope compliance | SUPPORTED | Only the three authorized sides sourced; adjacent findings flagged, not adjudicated. |

**Owner decisions still required:** (1) select the SBP governed population → 400 or 500 (or reject both); (2) ratify / reject / re-select the RR ceiling of 150; (3) record the SaO₂ disposition, then ratify / reject `spo2=0`; (4) decide whether to amend Stage-2 scope for later DBP and/or MAP passes.

**No implementation was performed.** No bank, renderer, schema, allowlist, `VITAL_DEFS`, override mechanism, workflow, or governance file was changed by this checker. The producer packet is preserved byte-for-byte in this branch's first commit.
