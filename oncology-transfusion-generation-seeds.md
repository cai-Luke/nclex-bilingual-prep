# Oncology + Transfusion — Generation Seeds (true gaps only)

Supersedes the six-seed draft. After the library census, TLS, CAR-T, GVHD, SCC, and ICI-myocarditis already
exist and are being **reclassified**, not generated; hypercalcemia stays electrolyte/supplement-driven. What
remains to *generate* is below. Each seed → one English clinical case skeleton through the normal pipeline
(compile → fact-check → review → promote).

**Lane conventions (paste into every prompt):**
- Oncology seeds → topic `Oncology & Immunotherapy Complications` (licensed shared: Physiological Adaptation
  + Reduction of Risk Potential); transfusion seed → topic `Transfusion & Blood Products` (licensed under
  Pharmacological and Parenteral Therapies). Keep each item's category aligned with where its topic is
  licensed.
- Prefix `onc_*` for oncology, `txn_*` for transfusion. Disjoint from existing lanes.
- **NCLEX-RN generalist level only** — what a newly-licensed RN must recognize and act on. No regimen
  names/doses, no staging or blood-banking minutiae, no lab cutoffs a bedside RN wouldn't act on. Luke is the
  SME backstop; every cue and correct action must be defensible against a current generalist source.
- Bilingual handled downstream (English at skeleton stage). Don't invent vitals/labs you can't ground — flag
  any value for the fact-check step. Distractors plausible and non-cueing; correct answer unambiguous to a
  competent RN; tested construct = recognition/intervention/evaluation, not generic priority-setting.

---

## 1. Neutropenic fever / sepsis — the true oncology gap (case study, 4–5 children)

> Author an NGN case-study skeleton. An adult on cytotoxic chemotherapy develops a new fever during the
> expected count nadir. Test, in sequence: recognizing neutropenic fever as an emergency (cues, why it's
> time-critical), first nursing priorities (cultures-before-antibiotics sequencing, protective environment,
> avoiding rectal/invasive routes), evaluating deterioration toward sepsis, and one teaching/evaluation child
> on when a neutropenic patient at home must seek care. Category: Physiological Adaptation; route the
> priority-sequencing child to Management of Care / Prioritization & Delegation if that's what it genuinely
> tests. No specific antibiotics or ANC cutoffs beyond "severe neutropenia."

## 2. SVC syndrome — second oncologic emergency (bowtie) [optional breadth]

> Author a bowtie skeleton for superior vena cava syndrome from a mediastinal malignancy. Condition node =
> the emergency; action tokens = time-critical nursing/collaborative responses (positioning, airway/breathing
> monitoring, escalation); parameter tokens = what the RN monitors (facial/upper-body edema, dyspnea, stridor
> cues). Category: Physiological Adaptation. Teaching point = early recognition, since delay risks airway
> compromise. No imaging or oncology-treatment specifics beyond generalist recognition.

## 3. Checkpoint-inhibitor colitis or pneumonitis — irAE breadth (case study, 3–4 children) [optional]

> Author a case-study skeleton on an immune-related adverse event in a patient on checkpoint-inhibitor
> therapy (choose colitis OR pneumonitis — the existing irAE case is myocarditis, so don't repeat it). Test:
> distinguishing the irAE from a benign alternative, recognizing severity escalation, the nursing priority
> (hold therapy, escalate, monitor), and a teaching/evaluation child on what symptoms the patient must report.
> Category: Physiological Adaptation; the "what to report" child may sit in RRP. Keep cues current and
> generalist; no immunology-mechanism depth.

## 4. Acute transfusion reaction — Transfusion & Blood Products (case study, 4–6 children)

> Author an NGN case-study skeleton centered on the RN's role across the transfusion safety chain, where
> attentiveness changes outcomes. Build the arc around: (a) **pre-transfusion verification** — the two-RN
> identity/clerical/ABO-unit check that prevents catastrophic mismatch (the single highest-stakes step);
> (b) **early reaction recognition** — differentiating the major reaction types from their cue clusters:
> acute hemolytic (fever, chills, flank/back pain, hypotension, dark urine), febrile non-hemolytic (most
> common — fever/chills alone), allergic/urticarial vs anaphylactic, and the **TACO vs TRALI** distinction
> (both respiratory but opposite mechanisms and management — a high-yield nurse-attentiveness point);
> (c) **the universal first action** — stop the transfusion, keep the line open with normal saline, assess,
> then notify; (d) **hemovigilance follow-through** — return the unit/tubing and a sample to the blood bank,
> clerical recheck, documentation/reporting. Category: Pharmacological and Parenteral Therapies; the
> reaction-recognition child may route to Physiological Adaptation only if `Transfusion & Blood Products`
> is licensed there — otherwise keep it Pharmacological. **Generalist scope:** no antibody-panel, crossmatch,
> or blood-banking mechanics beyond the clerical ABO check; the tested construct is bedside recognition,
> the stop-assess-report sequence, and verification discipline — not laboratory science.

---

**Not generated (reclassified or left as-is):** tumor lysis syndrome, CAR-T CRS/ICANS, acute GVHD, malignant
spinal cord compression, ICI myocarditis (all exist → reclassification spec); hypercalcemia stays
electrolyte/supplement-driven; the existing neutropenia WBC-trend and supplement-hypercalcemia items stay
where they are.
