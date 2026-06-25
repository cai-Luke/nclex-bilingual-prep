# 13 — Opus Currency Exception (Claude reviewer) — 2026-06-24

Findings-only currency/OG audit of the five Opus rows split out of the GPT-5
package per `CLAUDE-OPUS-CURRENCY-HANDOFF-2026-06-24.md`. No canonical writes.

```
AUDIT SESSION HEADER
====================
Session ID         : 2026-06-24-Claude-Currency-Opus-Exception
Reviewing model    : Claude (Opus)
Track              : currency / OG (single-item: is the guidance current?)
Scope              : five Opus rows (2 anticoagulation/med-rec, 3 IV-potassium)
Banks              : hard-cases-canonical.json (read-only)
Conflict note      : DECISIONS principle 22 makes Opus skeleton cases
                     GPT-provenance, and the older Phase-B map records a prior
                     Claude FINAL REVIEW on these same Opus cases (2026-06-13),
                     which originally blocked them for Claude. Luke explicitly
                     OVERRODE that producer/final-review block for this bounded
                     five-row exception. The override is accepted: a currency
                     check asks whether external guidance has moved, which is a
                     forward-looking question independent of who first reviewed
                     the item, and Luke owns the override. No silent rerouting.
Canonical writes   : none
Total Findings     : 0 OG findings — all five rows judged CURRENT (DISMISS/keep).
  HIGH confidence  : 0
  MEDIUM confidence: 0
  LOW confidence   : 0
needsHumanReview   : false on all five (current content, dated sources confirmed,
                     no keyed-answer flip).
Sources consulted  :
  - ISMP High-Alert Medications — concentrated electrolytes / potassium chloride
    (ISMP, 2022 high-alert handout): KCl is high-alert; never given undiluted by
    IV push; admixtures only; infusion-pump controlled; continuous ECG for severe
    depletion.
  - IMSN/IV Potassium Best-Practice Guideline (2020): peripheral concentrations
    ≥30 mmol/L risk phlebitis; continuous infusions preferentially central;
    severe depletion (K < 2.5) ≤10 mEq/hr with continuous ECG; independent
    verification.
  - CHEST Perioperative Management of Antithrombotic Therapy (CHEST/ACCP, 2022):
    recommends AGAINST routine heparin bridging for AF patients on a VKA who
    interrupt for elective surgery; bridging reserved for highest
    thromboembolic risk.
  - The Joint Commission medication-reconciliation standard (NPSG.03.06.01):
    reconcile medications across transitions; corrections are prescriber actions.
```

## OG Result — all five rows CURRENT

### Group A — anticoagulation / discharge med-rec (`opus1_*`)

`opus1_case_discharge_med_rec_anticoag_01_q3` (`questions[42].caseStudy.questions[2]`)
and `_q5` (`...questions[4]`).

- **q3 (SATA)** keys the reconciliation-scope actions — hold the discharge
  prescriptions, route changes through the **prescriber**, involve the
  **clinical pharmacist**, and re-verify the final list — and rejects the nurse
  *independently* deleting enoxaparin ("D") or teaching the family to continue
  **both** anticoagulants until the INR is therapeutic ("F"). Verbatim keyed
  rationale: *"Medication discontinuations or dose corrections require prescriber
  action; the nurse can identify and escalate but not independently rewrite the
  orders."* This is current med-reconciliation practice (Joint Commission
  NPSG.03.06.01) and is unchanged.
- **q5 (cloze)** teaches that enoxaparin was *temporary inpatient bridging while
  warfarin was held and restarted*, that the family should follow the
  **corrected** discharge list, and that bleeding symptoms on warfarin require
  prompt reporting. Current and safe.

**Currency note (bridging context, not an OG defect):** CHEST 2022 now
recommends *against* routine perioperative bridging for AF patients on a VKA. The
case does **not** teach that bridging is guideline-recommended — it presents
LMWH as a factual inpatient measure (which, post-TKA, also doubles as VTE
prophylaxis while the INR is subtherapeutic) and then **correctly flags the
discharge-list duplicate** (prophylactic enoxaparin continued at home on top of
therapeutic warfarin) as the error to reconcile away. So the keyed teaching
aligns with the *minimize-unnecessary-anticoagulant* direction of current
guidance, not against it. No stale recommendation flips a keyed answer →
DISMISS/keep. (Optional, non-actioned: a one-line stem note that routine AF
bridging is now discouraged could pre-empt a learner over-generalizing, but the
keyed answers are current as written.)

**Alternative Interpretation:** a defender notes the case is explicitly a
*reconciliation* exercise, not a bridging-indication exercise; every keyed action
is current scope-of-practice and patient-safety teaching. Reconciliation is
stronger than any staleness claim. **DISMISS/keep.**

### Group B — IV potassium safety (`opus3_*`)

`opus3_iv_potassium_safety_case_01` (parent `questions[44]`), `_q4`
(`...questions[3]`), `_q5` (`...questions[4]`).

The keyed teaching across all three: severe hypokalemia with ECG changes needs
prompt, **monitored** replacement, but IV potassium is **high-alert** and must
be given only under a safe, clarified order —

- **never IV push** (`_q5` "D" rejected: *"More PVCs would require assessment and
  escalation, not IV push potassium"*; parent rationale: *"The nurse should not
  give potassium chloride by IV push…"*);
- **hold the unsafe original peripheral order, clarify route/rate/concentration
  with provider + pharmacist, use pharmacy-prepared diluted infusion + infusion
  pump, independent double-check, continuous telemetry, assess the IV site,
  correct magnesium, monitor renal function / repeat labs** (`_q4` ordered
  response; `_q5` SATA).

Every element matches current ISMP high-alert practice and the IMSN 2020 IV-KCl
best-practice guideline (admixtures only / never undiluted push; pump-controlled;
ECG monitoring for severe depletion; peripheral phlebitis risk at higher
concentrations; independent verification of a high-alert product). Correcting
**hypomagnesemia** to enable potassium repletion is also current (refractory
hypokalemia with low magnesium). Nothing here is stale.

**Alternative Interpretation:** none of the safety rules (no IV push, dilute,
pump, telemetry, double-check, central preference for higher concentration) have
moved; if anything, the case is *more* conservative than the minimum standard.
**DISMISS/keep.**

## Remediation Queue (Opus currency exception)

- **discard / retire:** none.
- **patch:** none.
- **source_check:** none — currency was confirmed against dated sources above.
- **hold:** none.
- **minor polish:** optional, non-actioned — a one-line "routine AF bridging is
  now discouraged (CHEST 2022)" note on the `opus1` stem; not a defect, keyed
  answers are current.
- **housekeeping:** none.

## Disposition

All five Opus rows are **current** and keep as-is. The Luke override is recorded;
no canonical edits; `BANK-REVIEW-LEDGER.md` is not updated (deferred to a later
approved pass per the handoff non-goals).
