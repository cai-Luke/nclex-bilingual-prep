# ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md

# Gemini-Flagged / Luke-Adjudicated Coherence Review

This section documents the adversarial semantic audit of the two delegation scope NGN-format pairs re-routed to Gemini as a clean, non-producer auditor.

```
AUDIT SESSION HEADER
====================
Session ID         : 2026-06-24-Gemini-Adjudication
Questions Audited  : claude_moc_deleg_matrix_08, gpt_canonical_matrix_scope_assignment_050, claude_moc_lpn_deleg_hl_b01, gpt_hl_moc_lpn_scope_05
Total in Scope     : 4 (2 candidate pairs)
Audit Categories   : DC (Direct Contradiction), AK (Answer Key Conflict)
Total Findings     : 2 (both dismissed)
  HIGH confidence  : 0
  MEDIUM confidence: 0
  LOW confidence   : 2 (both lean DISMISS due to perfect clinical reconciliation)
Null Ranges        : None
```

---

## Findings

### FINDING #1
**Category:** DC (Direct Contradiction) / AK (Answer Key Conflict)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVIDENCE A
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Question ID**    : `claude_moc_deleg_matrix_08`  
**Full Stem**      : 
*   **EN**: "For each task, select the lowest-level team member to whom the registered nurse can appropriately assign it on a medical-surgical unit. Assume a common U.S. med-surg scope where the state Nurse Practice Act and facility policy permit."
*   **ZH**: "对于每项任务，请选择在内外科病区护士可恰当委派的最低层级团队成员。假设是在相关州《护理执业法》和机构政策允许的常见美国内外科执业范围内。"

**Correct Answer** : 
*   `r1` (Bathing and feeding a stable client / 为病情稳定的患者洗澡和喂食) -> `c_uap` (UAP)
*   `r2` (Administering a scheduled oral medication to a stable client / 为病情稳定的患者给予一次定时口服药) -> `c_lpn` (LPN/LVN)
*   `r3` (Reinforcing previously taught discharge instructions / 强化先前已教过的出院指导) -> `c_lpn` (LPN/LVN)
*   `r4` (Performing the initial assessment of a newly admitted client / 为新入院患者进行首次评估) -> `c_rn` (RN only)
*   `r5` (Developing and revising the nursing care plan / 制定和修订护理计划) -> `c_rn` (RN only)
*   `r6` (Administering IV push medication and titrating a vasoactive drip / 静脉推注药物并滴定血管活性药物) -> `c_rn` (RN only)

**Distractors**    : N/A (Matrix type)  
**Rationale**      : 
*   **EN**: "Assign at the lowest level whose scope safely covers the task. UAP perform standardized ADL care for stable clients (bathing/feeding). LPN/LVN may administer most routine oral/IM/SubQ medications and reinforce teaching the RN already provided. The RN retains the activities requiring independent nursing judgment: the initial/admission assessment, creating and revising the care plan, and high-risk medication administration such as IV push drugs and titration of vasoactive infusions. (Scope varies by state Nurse Practice Act and facility policy; this reflects common U.S. acute-care delegation rules and the NCSBN/ANA delegation guidelines.)"
*   **ZH**: "在能安全覆盖任务的最低层级进行委派。UAP 为病情稳定的患者提供标准化的日常生活照护（洗澡/喂食）。LPN/LVN 可给予多数常规口服/肌注/皮下药物，并强化护士已提供的教学。护士保留需要独立护理判断的活动：首次/入院评估、制定和修订护理计划，以及高风险给药如静脉推注和血管活性药物滴定。（执业范围因各州《护理执业法》和机构政策而异；此处反映美国急症护理常见的委派规则及 NCSBN/ANA 委派指南。）"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVIDENCE B
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Question ID**    : `gpt_canonical_matrix_scope_assignment_050`  
**Full Stem**      : 
*   **EN**: "The charge nurse is assigning tasks. Select the appropriate team member for each task."
*   **ZH**: "责任护士正在分配任务。为每项任务选择合适的团队成员。"

**Correct Answer** : 
*   `r1` (Initial assessment of a newly admitted client with chest pain. / 对新入院胸痛患者进行初始评估。) -> `c1` (RN)
*   `r2` (Administer oral antibiotics to a stable client. / 为病情稳定的患者给予口服抗生素。) -> `c2` (LPN/VN)
*   `r3` (Ambulate a stable postoperative client who has already been assessed. / 协助已评估且病情稳定的术后患者下床行走。) -> `c3` (UAP)
*   `r4` (Teach a client how to self-administer insulin before discharge. / 出院前教患者如何自行注射胰岛素。) -> `c1` (RN)

**Distractors**    : N/A (Matrix type)  
**Rationale**      : 
*   **EN**: "RNs handle assessment, teaching, and unstable or new conditions. LPN/VNs can give routine medications to stable clients. UAP can perform delegated basic tasks for stable clients."
*   **ZH**: "注册护士负责评估、教学和不稳定或新情况。执业护士/职业护士可为稳定患者给予常规药物。无执照辅助人员可为稳定患者执行被委派的基础任务。"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFLICT CLAIM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**What lesson does Question A teach?**  
Question A teaches that an RN is responsible for initial assessments, nursing care plans, and high-risk medication administration, while LPNs can administer routine oral medications and reinforce teaching, and UAPs can perform standardized basic care for stable clients.

**What lesson does Question B teach?**  
Question B teaches that an RN is responsible for initial assessments of clients with chest pain and discharge insulin teaching, while LPNs can administer oral antibiotics to stable clients, and UAPs can assist with ambulating stable, assessed postoperative clients.

**Why are these lessons mutually exclusive?**  
These lessons are not mutually exclusive. They are perfectly compatible and teach identical delegation boundaries and scopes of practice for the RN, LPN, and UAP.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALTERNATIVE INTERPRETATION (Reconciliation)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Both questions are correct and teach fully aligned delegation principles. Question A focuses on a broad set of standard med-surg tasks (care plans, IV push, reinforcing teaching), while Question B focuses on specific client scenarios (chest pain assessment, discharge insulin education, post-op ambulation). There is no conflict or contradiction between the two items.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFIDENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] HIGH   — Conflict holds even under the best-faith reconciliation.
[ ] MEDIUM — Conflict is probable but a plausible reconciliation exists.
[x] LOW    — Conflict is possible but reconciliation is stronger than the claim.

*Justification:* The two questions are completely consistent in their delegation rules and clinical principles, resulting in a perfect reconciliation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] FIX    — Contradiction confirmed; one question must be corrected or removed.
[ ] REVIEW — Human expert review required before any action.
[x] DISMISS — Insufficient evidence or reconciliation is stronger than the claim.

*Action notes:* Keep both items as-is. They provide excellent, non-overlapping practice on delegation rules for med-surg nursing.

---

### FINDING #2
**Category:** DC (Direct Contradiction) / AK (Answer Key Conflict)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVIDENCE A
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Question ID**    : `claude_moc_lpn_deleg_hl_b01`  
**Full Stem**      : 
*   **EN**: "A registered nurse is delegating to a licensed practical/vocational nurse (LPN/LVN) on a medical-surgical unit. Highlight the tasks that are appropriate to delegate to the LPN/LVN."
*   **ZH**: "在内外科病区，护士正在向实用/职业护士（LPN/LVN）委派任务。请标出适合委派给 LPN/LVN 的任务。"

**Correct Answer** : 
*   `s1`: "Administer scheduled oral and subcutaneous medications to a stable client." / "为病情稳定的患者给予定时的口服和皮下药物。"
*   `s2`: "Perform a sterile dressing change on a chronic, stable wound." / "为慢性、稳定的伤口进行无菌换药。"
*   `s3`: "Reinforce diet teaching the RN already provided." / "强化护士已经提供的饮食教学。"
*   `s4`: "Monitor and record findings on a stable client and report changes to the RN." / "监测并记录病情稳定患者的发现，并将变化报告给护士。"

**Distractors**    : (Unselected segments)
*   `s5`: "Perform the initial admission assessment of a new client." / "为新患者进行入院首次评估。"
*   `s6`: "Develop the nursing care plan for a newly admitted client." / "为新入院患者制定护理计划。"
*   `s7`: "Provide the first teaching about a new diabetes diagnosis." / "首次为新诊断的糖尿病进行教学。"
*   `s8`: "Administer the first dose of IV chemotherapy." / "给予首剂静脉化疗。"

**Rationale**      : 
*   **EN**: "The LPN/LVN scope covers routine, stable care: administering most scheduled oral/SubQ/IM medications, performing sterile dressing changes on stable wounds, reinforcing teaching the RN initiated, and monitoring stable clients and reporting to the RN. The RN retains the activities requiring independent nursing judgment: the initial admission assessment, developing the care plan, providing the initial teaching for a new diagnosis, and high-risk care such as the first dose of IV chemotherapy. This reflects the NCSBN/ANA delegation guidelines; exact scope varies by state Nurse Practice Act and facility policy."
*   **ZH**: "LPN/LVN 的执业范围涵盖常规、稳定的护理：给予多数定时的口服/皮下/肌注药物、为稳定伤口进行无菌换药、强化护士发起的教学，以及监测稳定患者并向护士报告。护士保留需要独立护理判断的活动：入院首次评估、制定护理计划、为新诊断进行首次教学，以及如首剂静脉化疗等高风险护理。此处依据 NCSBN/ANA 委派指南；具体范围因各州《护理执业法》和机构政策而异。"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVIDENCE B
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Question ID**    : `gpt_hl_moc_lpn_scope_05`  
**Full Stem**      : 
*   **EN**: "Highlight the assignment that the charge nurse must change because it is outside the licensed practical/vocational nurse (LPN/LVN) role."
*   **ZH**: "标出带班护士必须更改的分工，因为该任务超出执业护士（LPN/LVN）的职责范围。"

**Correct Answer** : 
*   `s4`: "The LPN will titrate an IV heparin infusion according to the aPTT protocol." / "LPN 将根据 aPTT 方案调整静脉肝素输注速度。"

**Distractors**    : (Unselected segments)
*   `s2`: "The LPN will reinforce coughing and deep-breathing exercises for a stable postoperative client." / "LPN 将为一名稳定术后患者强化咳嗽 and 深呼吸练习。"
*   `s3`: "The LPN will administer a scheduled oral antihypertensive medication." / "LPN 将给予定时口服降压药。"
*   `s5`: "The LPN will change a simple dry dressing on a stable client's surgical incision." / "LPN 将为稳定患者的手术切口更换简单干敷料。"

**Rationale**      : 
*   **EN**: "Titrating an IV heparin infusion requires ongoing assessment, interpretation of laboratory data, and clinical judgment. This responsibility belongs to the RN and is not an appropriate LPN/LVN assignment in NCLEX delegation logic."
*   **ZH**: "调整静脉肝素输注需要持续评估、解释实验室数据和临床判断。按照 NCLEX 委派逻辑，这属于 RN 职责，不适合分配给 LPN/LVN。"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFLICT CLAIM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**What lesson does Question A teach?**  
Question A teaches that LPNs can administer oral/subcutaneous meds to stable clients, perform dressing changes, reinforce teaching, and monitor stable clients, but cannot perform initial assessments, care planning, initial teaching, or administer high-risk IV chemotherapy.

**What lesson does Question B teach?**  
Question B teaches that LPNs can reinforce deep-breathing exercises, administer oral meds, and change simple dressings, but cannot titrate high-alert IV infusions like heparin.

**Why are these lessons mutually exclusive?**  
These lessons are not mutually exclusive. They are completely congruent and teach identical delegation boundaries and scopes of practice for the LPN/LVN.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALTERNATIVE INTERPRETATION (Reconciliation)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Both questions are correct and teach fully aligned delegation principles. Question A tests LPN scope by identifying multiple appropriate tasks from a list, while Question B tests LPN scope by identifying a single inappropriate task (titrating a high-alert IV infusion) within a nursing assignment scenario. There is no conflict or contradiction between the two items.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFIDENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] HIGH   — Conflict holds even under the best-faith reconciliation.
[ ] MEDIUM — Conflict is probable but a plausible reconciliation exists.
[x] LOW    — Conflict is possible but reconciliation is stronger than the claim.

*Justification:* The two questions are completely consistent in their delegation rules and clinical principles, resulting in a perfect reconciliation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] FIX    — Contradiction confirmed; one question must be corrected or removed.
[ ] REVIEW — Human expert review required before any action.
[x] DISMISS — Insufficient evidence or reconciliation is stronger than the claim.

*Action notes:* Keep both items as-is. They provide excellent, non-overlapping practice on delegation rules for LPNs using different highlight formats.

---

## Remediation Queue Triaging

All audited items in this session are clinically accurate, compliant with the New York Nurse Practice Act, and mutually coherent. No modifications are needed.

### Keep (DISMISS, minor/housekeeping or fully correct)
- `claude_moc_deleg_matrix_08` (questions[76] in `claude-canonical.json`): Keep as-is.
- `gpt_canonical_matrix_scope_assignment_050` (questions[49] in `gpt-canonical.json`): Keep as-is.
- `claude_moc_lpn_deleg_hl_b01` (questions[83] in `claude-canonical.json`): Keep as-is.
- `gpt_hl_moc_lpn_scope_05` (questions[313] in `gpt-canonical.json`): Keep as-is.

---

## Scale-or-Stop Recommendation

The coherence audit of these two delegation-scope pairs demonstrates **perfect alignment** across the Claude-authored and GPT-generated banks. The concept-cluster seeds successfully paired highly related items (e.g. LPN medication administration, wound care, teaching reinforcement), but rather than exposing contradictions, the audit confirmed high clinical accuracy and pedagogical consistency. 

Given the structural and clinical hygiene demonstrated here, we recommend **scaling** the coherence sweep (Phase B) to cover the remaining concept-pairing queue, as the infrastructure is robust and the questions are of high quality.

---

# ════════════ MERGED LANES — pilot aggregation (Claude Code runs last) ════════════

The Gemini-adjudicated section above is **preserved unchanged**. The Codex and
Claude coherence lanes are merged below with their session headers intact;
findings are not renumbered. The Opus currency exception (5 rows) is reported
separately in
`audit/early-bank-semantic/currency/13-opus-currency-claude-exception.{report.md,manifest.jsonl}`
and summarized in the pilot close.

---

## Codex Lane - Adversarial Semantic Audit Findings - 2026-06-24

AUDIT SESSION HEADER
====================
Session ID         : 2026-06-24-Codex-Coherence
Questions Audited  : claude_moc_assignment_mc_14, gemini_p8_08, claude_moc_deleg_uap_hl_01, claude_moc_lpn_deleg_hl_b01, claude_moc_supervision_hl_b04, gemini_hl_moc_delegation_02, gemini_hl_sic_precautions_06
Total in Scope     : 7 unique items; 5 candidate pairs
Audit Categories   : DC, AK, RI, SC, BD
Total Findings     : 0
  HIGH confidence  : 0
  MEDIUM confidence: 0
  LOW confidence   : 0
Null Ranges        : All five Codex coherence pairs: no findings meeting evidentiary standard

Reviewing model: GPT-5 / Codex
Producer basis: all five pairs touch Claude-authored `claude_moc_*` content and never touch GPT-authored content. The two Claude x GPT pairs were already re-routed to Gemini and Luke accepted DISMISS/keep.
Canonical writes: none

## Coherence Null Result

No DC/AK finding met the parent evidentiary standard. The delegation/scope pairs teach compatible rules:

- `claude_moc_assignment_mc_14` and `gemini_p8_08` both key the stable, predictable LPN assignment and reserve new assessment, new teaching, unstable titration, and first-dose chemotherapy-type risk for the RN.
- `claude_moc_deleg_uap_hl_01` and `claude_moc_lpn_deleg_hl_b01` test different personnel levels. They are not contradictory: UAP performs standardized ADL/vitals/I&O tasks; LPN/LVN performs routine stable licensed-nurse care and reinforcing teaching.
- `claude_moc_deleg_uap_hl_01` and `claude_moc_supervision_hl_b04` are aligned: UAP may ambulate stable clients and record I&O/vitals, but the nurse intervenes for order overrides, unsafe restraint placement, lab interpretation, assessment, teaching, evaluation, and IV medication management.
- `claude_moc_deleg_uap_hl_01` and `gemini_hl_moc_delegation_02` are aligned: bathing, repositioning, and I&O are delegable to UAP; evaluating swallowing after stroke is an RN assessment/evaluation task.
- `claude_moc_supervision_hl_b04` and `gemini_hl_sic_precautions_06` are not comparable enough for DC/AK. One tests UAP role/safety supervision; the other tests C. difficile hand hygiene breach. No cross-item answer-key conflict is present.

Alternative Interpretation: A defender can reconcile every pair by task, acuity, personnel level, and tested construct. Because reconciliation is stronger than any conflict claim, the correct disposition is DISMISS/keep.

No RI, SC, or BD concern met the evidentiary standard in the Codex coherence slice.

AUDIT SESSION HEADER
====================
Session ID         : 2026-06-24-Codex-Currency
Questions Audited  : cs_sepsis_shock_01, cs_sepsis_shock_01_part_1, cs_sepsis_shock_01_part_2, cs_sepsis_shock_01_part_3, cs_stemi_vfib_04, cs_stemi_vfib_04_part_2, cs_stemi_vfib_04_part_3
Total in Scope     : 7 rows
Audit Categories   : OG, RI, BD
Total Findings     : 0
  HIGH confidence  : 0
  MEDIUM confidence: 0
  LOW confidence   : 0
Null Ranges        : All seven Codex currency rows: no findings meeting evidentiary standard

Reviewing model: GPT-5 / Codex
Producer basis: these surviving hard-case currency rows are GPT-5-auditable under `GPT5-AUDIT-HANDOFF-2026-06-24.md`; the five Opus rows are excluded and assigned to Claude by Luke override.
Canonical writes: none
Sources consulted: Surviving Sepsis Campaign 2021; American Heart Association 2025 adult cardiac arrest algorithms; 2025 ACC/AHA/ACEP/NAEMSP/SCAI acute coronary syndromes guideline hub / guideline text.

## Currency Null Result

No OG finding met the parent evidentiary standard.

`cs_sepsis_shock_01` and leaves remain current enough for NCLEX-style practice. The case explicitly distinguishes classic SIRS from Sepsis-3 organ-dysfunction framing. Current SSC guidance still treats sepsis/septic shock as an emergency, supports immediate treatment/resuscitation, at least 30 mL/kg crystalloid within the first 3 hours for sepsis-induced hypoperfusion or septic shock, lactate-guided resuscitation when lactate is elevated, and an initial MAP target of 65 mm Hg for adults with septic shock on vasopressors. The item's cultures-before-antibiotics language is acceptable because it also says cultures should not significantly delay antibiotics, and its antibiotic timing stays within the first hour.

`cs_stemi_vfib_04` and leaves remain current enough for NCLEX-style practice. The AHA 2025 adult cardiac arrest algorithm starts CPR, attaches monitor/defibrillator, shocks VF/pVT, gives epinephrine 1 mg every 3-5 minutes, and uses amiodarone or lidocaine for refractory VF/pVT. The pharmacology matrix classifications are not stale: amiodarone is an antiarrhythmic, epinephrine is being tested as a vasopressor, aspirin is an antiplatelet agent in ACS care, and nitroglycerin is a vasodilator for ischemic chest pain relief when clinically appropriate.

No RI or BD concern met the evidentiary standard in the Codex currency slice.

## Remediation Queue

- discard / retire: none
- patch: none
- source_check: none
- hold: none
- minor polish: none
- housekeeping: none

## Scale-or-Stop Recommendation

Scale. The Codex lane found no actionable defects, but the concept-seeded slice was clinically plausible and easy to adjudicate. Combined with the already accepted Gemini DISMISS/keep result, the pilot supports continuing Phase B in bounded, lane-scoped batches, with source checks reserved for guideline-dependent findings.

---

## Claude Lane — Adversarial Semantic Audit Findings — 2026-06-24

Lane-scoped findings for the Claude coherence track (per
`claude-code-coherence-audit-spec.md`). Findings-only; no canonical writes.
Sub-sessions are appended here in harm order; this file is merged into the
shared `ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md` at final aggregation.

---

## Sub-session 1 — `delegation_scope`

```
AUDIT SESSION HEADER
====================
Session ID         : 2026-06-24-Claude-Coherence-delegation_scope
Reviewing model    : Claude (Opus)
Track              : coherence (DC/AK lead; RI/SC/BD ride-along; redundancy note)
Cluster            : delegation_scope
Total in Scope     : 42 unique items across 66 candidate pairs
Banks              : gemini-canonical.json, gpt-canonical.json (read-only)
Producer basis     : every pair is gemini×gemini, gpt×gpt, or gemini×gpt; Claude
                     is a non-producer for both ends of all 66 pairs (clean lane).
Canonical writes   : none
Audit Categories   : DC, AK, RI, SC, BD, redundancy
Total Findings     : 2 (both minor, single-item RI/BD; both FIX/patch)
  HIGH confidence  : 2
  MEDIUM confidence: 0
  LOW confidence   : 0
DC/AK result       : NULL — no cross-item contradiction met the evidentiary
                     standard across all 66 pairs.
Redundancy         : 2 near-duplicate clusters noted, both DISMISS/keep (varied
                     scenarios = legitimate spaced practice, not strictly dominated).
```

### Scope composition (why the cluster is heterogeneous)

The `delegation_scope` concept seed pulled in five adjacent sub-topics that all
turn on "who may do what": (a) UAP delegation MC/SATA, (b) LPN/LVN scope MC/SATA,
(c) team-member assignment matrices, (d) prioritization / "assess-first" items,
and (e) disaster START/triage and transmission-based isolation matrices (pulled
in through `gap_50_sic_03`). DC/AK was judged within and across these sub-topics;
RI/SC/BD was judged on every item.

### DC / AK — null result (verbatim basis)

No two items teach incompatible delegation, triage, or isolation rules. The
scope boundaries are stated consistently across all 42 items:

- **UAP** ← standardized, predictable tasks for *stable* clients: ambulation of
  an assessed/stable client (`easy_prioritization_02`, `gemini_c9_08`,
  `gpt_u6_matrix_cloze_2026_06_09_matrix_delegation_scope_04` r1), routine vitals
  on a stable client (`mc_delegation_uap_vitals_001` "A", `gemini_c9_08` "A",
  `gemini_moc_ngn_2026_06_22_q8` "D"), I&O recording (`gemini_moc_ngn_2026_06_22_q8`
  "A"), clean-catch specimen (`gemini_p8_02` "D", `gemini_c9_08` "F"), emptying/
  measuring drainage (`gemini_jun05_a_mc_delegation_21` "B"), bed bath/hygiene
  (`trad_batchB_01` "C"), repositioning per a posted plan
  (`gpt_case_gap_2026_06_11_pressure_ltc_part_3_mc_delegate` "A"). Every item
  **excludes** assessment, teaching, medication administration, and feeding a
  high-aspiration-risk client from UAP (`trad_batchB_01` "B",
  `gemini_c9_08` "E").
- **LPN/LVN** ← routine care for *stable, predictable* clients: scheduled oral/
  SubQ/IM meds (`easy_prioritization_04` "A", `gemini_b10_02` "A",
  `gemini_c3_01` "A", `trad_batchB_02` "A"), sterile dressing change on a stable
  wound (`gemini_b10_02` "B", `gemini_c3_01` "B", `trad_batchB_02` "B"),
  suctioning an *established* tracheostomy (`gemini_c3_01` "D", `trad_batchB_02`
  "D"), reinforcing RN-initiated teaching, and monitoring/data collection on
  stable clients. Every item **reserves for the RN** the initial assessment, care
  planning, initial/complex teaching, and high-risk delivery — and the two items
  that test IV push agree it is outside LPN scope: `gemini_b10_02` excludes "a
  bolus dose of intravenous morphine" ("IV push medications, especially opioids,
  are typically reserved for RNs") and `trad_batchB_02` excludes "an intravenous
  (IV) push medication for pain" ("IV push medications are generally outside the
  standard NCLEX scope for LPNs"). Titration is uniformly RN (`gemini_c3_07` "A"
  oxygen titration excluded; `gemini_p8_08` "C" vasopressor titration excluded).
- **Disaster triage (START/ESI)** is internally consistent: a client who is
  apneic after airway repositioning is expectant/black, never immediate
  (`gpt_canonical_sata_disaster_triage_037` "D",
  `gemini_c9_01` "B", `gemini_jun05_a_matrix_disaster_triage_27` r2,
  `gpt_case_mass_casualty_start_triage_01_q1` casualty_a/g); RR > 30, poor
  perfusion, or altered mental status is red. No two triage items key the same
  physiology differently.
- **Transmission-based isolation** (`gap_50_sic_03`, `gemini_sic_ngn_2026_06_21_q8`,
  `gpt_u6_matrix_cloze_2026_06_09_matrix_infection_precautions_02`) agree: TB =
  Airborne; influenza/pertussis = Droplet; MRSA/C. difficile = Contact;
  disseminated VZV = Airborne + Contact; localized covered zoster in an
  immunocompetent host = Standard; severe neutropenia = Protective. The three
  matrices use **local** column IDs, so there is no cross-item answer-key collision.

**Alternative Interpretation (DC/AK):** Every pair reconciles cleanly by
personnel level, client acuity/stability, and the tested construct (delegate vs.
assess-first vs. triage-tag vs. isolation-category). Because reconciliation is
stronger than any conflict claim on every pair, the DC/AK disposition is
DISMISS/keep — consistent with the already-accepted Gemini adjudication and the
Codex lane.

### CONCERN #1 — RI — `gemini_c9_01` (gemini-canonical.json `questions[365]`)

**Category:** RI (internal inconsistency). **Severity:** minor. **Confidence:** HIGH.

The summary `rationale.correct` names the wrong option letter while correctly
describing the keyed answer's content.

- **Keyed answer:** `correct: ["A"]` — option A is "A client with an open
  pneumothorax and a respiratory rate of 34 breaths/minute."
- **Summary rationale (verbatim):** "**B** is assigned a 'Red' tag because an
  open pneumothorax is a life-threatening respiratory emergency that requires
  immediate intervention (e.g., occlusive dressing) but is survivable with prompt
  care." — but option **B** is "a client with a severe head injury, no
  spontaneous respirations, and a GCS score of 3."
- **Per-choice rationale (verbatim, both correct):** `byChoice[A]`: "Red tag
  (Immediate): Open pneumothorax compromises breathing and requires immediate
  attention." `byChoice[B]`: "Black tag (Expectant): A client with no spontaneous
  respirations and a severe head injury is unlikely to survive…"

**Conflict claim:** The summary sentence's leading letter ("B") contradicts the
keyed answer (A) and the per-choice rationale (A = Red, B = Black). A learner who
anchors on the summary letter could mis-map "Red" to the head-injury client.

**Alternative Interpretation (Reconciliation):** This is a transposed option
letter, not a clinical error. The clinical reasoning, the key, and both
per-choice rationales are correct and mutually consistent; only the one summary
letter is wrong. The keyed answer does **not** change.

**Disposition:** FIX / patch (EN summary letter "B" → "A"). `needsHumanReview =
false` (key unchanged). Minor severity because the per-choice rationale already
disambiguates.

### CONCERN #2 — BD — `gap_50_sic_03` (gemini-canonical.json `questions[725]`)

**Category:** BD (bilingual — ZH lexical error). **Severity:** minor. **Confidence:** HIGH.

The Chinese rationale renders "Influenza" as a non-word.

- **EN (verbatim):** "Influenza requires Droplet precautions."
- **ZH (verbatim):** "流液需要飞沫传播预防措施。" — "流液" is not a disease term;
  the intended word is "流感" (influenza). The droplet-precaution mapping
  ("飞沫传播预防措施") is correct.

**Conflict claim:** A Chinese-reading learner sees a garbled disease name in the
summary rationale.

**Alternative Interpretation (Reconciliation):** Per AGENTS check 13 / pilot §4,
a BD finding requires a *clinical meaning change* (who/what/timing/route/value).
Here the precaution category is unchanged and correct, and the matrix row mapping
(influenza → droplet) is intact, so this is a single-character ZH typo, not a
clinical divergence — minor polish, not `major`/`blocker`.

**Disposition:** FIX / patch (ZH "流液" → "流感"). `needsHumanReview = false`.

### SC — null result

No stem cueing or answer leakage was found. The prioritization and triage stems
describe scenarios without telegraphing the keyed option.

### Redundancy — noted, DISMISS/keep

Two near-duplicate clusters of ≥3 surfaced; neither is strictly dominated, so
both are kept:

1. **"Assess-first" prioritization** — `easy_prioritization_01`, `gemini_p8_01`,
   `gemini_p8_06`, `trad_batchB_03` (plus `easy_prioritization_03`): same
   ABC/priority construct, but each uses distinct clinical scenarios. Legitimate
   spaced practice.
2. **START red-tag identification** — `gemini_c9_01`, `gemini_p8_05`,
   `gemini_gap_case_disaster_triage_05_q1`, and the START matrices
   (`gemini_jun05_a_matrix_disaster_triage_27`,
   `gpt_case_mass_casualty_start_triage_01_q1`): same algorithm, different
   incidents (train derailment / explosion / mass casualty) and item formats.
   Varied practice, not redundant in the harmful sense.

No `discard` is recommended for either cluster (pilot §4 "No UWorld overfitting"
+ §6 — only strictly-dominated duplicates retire).

### Sub-session 1 remediation queue (delegation_scope)

- **discard / retire (CUT):** none.
- **patch (FIX, minor):** CONCERN #1 (`gemini_c9_01`, ZH/EN: EN summary letter
  "B"→"A"); CONCERN #2 (`gap_50_sic_03`, ZH "流液"→"流感"). Both are text-only,
  key-preserving, batchable polish — not blocker/major, so no urgent repair spec.
- **source_check:** none (all dispositions are internal; no guideline-dependent
  adjudication required — the delegation/triage/isolation rules cited are
  standard NCSBN/ANA scope and CDC transmission categories, used only to confirm
  *consistency*, not to break a contradiction).
- **hold:** none.
- **minor polish:** the two patch items above.
- **housekeeping:** none.

*Scale-or-stop is deferred to the final aggregation step (after isolation_mode
and potassium/insulin sub-sessions and the Opus currency exception land).*

---

## Sub-session 2 — `isolation_mode`

```
AUDIT SESSION HEADER
====================
Session ID         : 2026-06-24-Claude-Coherence-isolation_mode
Reviewing model    : Claude (Opus)
Track              : coherence (DC/AK lead; RI/SC/BD ride-along; redundancy note)
Cluster            : isolation_mode
Total in Scope     : 26 unique items across 55 candidate pairs
Banks              : gemini-canonical.json, gpt-canonical.json (read-only)
Producer basis     : every pair is gemini×gemini, gpt×gpt, or gemini×gpt; Claude
                     is a non-producer for both ends of all 55 pairs (clean lane).
Canonical writes   : none
Audit Categories   : DC, AK, RI, SC, BD, redundancy
Total Findings     : 0 actioned (zero-finding sub-session)
  HIGH confidence  : 0
  MEDIUM confidence: 0
  LOW confidence   : 0
DC/AK result       : NULL — no cross-item contradiction met the evidentiary standard.
RI/SC/BD result    : NULL — no actionable single-item defect.
Redundancy         : high topical density (transmission categories + PPE
                     sequencing) but each item is a distinct scenario/format; no
                     strictly-dominated duplicate. DISMISS/keep.
```

### DC / AK — null result (verbatim basis)

This cluster has the highest topical density in the slice (transmission-based
precautions + PPE don/doff order), so it is the strongest test for an answer-key
collision. The keyed transmission categories are identical across every item:

- **Airborne** = pulmonary TB (negative-pressure AIIR, fit-tested N95, door
  closed, client surgical mask for transport): `easy_resp_infect_02` ("D"),
  `trad_batchD_14` ("A","B","C"), `gemini_d10_05`, `gen_sic_batch2_2`,
  `mc_airborne_tb_precautions_004` ("A"), `gemini_jun05_a_sata_airborne_precautions_03`,
  `gpt_gap_jun11_sata_tb_airborne_precautions_01`, `gpt_hl_sic_airborne_tb_08`,
  `gemini_sic_ngn_2026_06_21_q6`, `gemini_sic_ngn_2026_06_21_q15` ("B" excluded
  from droplet). Every TB item rejects a surgical mask for staff and keeps the
  door closed — no item keys TB as droplet.
- **Droplet** = meningococcal meningitis / pertussis / Hib / Mycoplasma
  (surgical mask on entry, private room, continue ≥24 h after effective
  antimicrobials): `gemini_b4_01` ("D"), `gemini_b4_08` ("B"), `trad_batchB_16`
  ("C"), `gpt_canonical_matrix_meningitis_precautions_105`,
  `gpt_gap_jun11_sata_meningococcal_droplet_03` ("A","B","C","E"),
  `gemini_sic_ngn_2026_06_21_q15` ("A","C","D","F"). The "≥24 h after effective
  antibiotics" stop-rule is stated identically in
  `gpt_gap_jun11_sata_meningococcal_droplet_03` "C" and
  `gemini_sic_ngn_2026_06_21_q15` byChoice[A].
- **Contact** = MRSA wound (gown + gloves, surgical mask is *not* the main
  measure): `gemini_b9_06`, `gpt_case_infection_control_clustered_care_01_q3`
  ("q3_f" surgical-mask-as-main rejected).
- **Airborne + Contact** = varicella (negative-pressure room + N95 for
  susceptible staff + gown/gloves): `gpt_gap_jun11_sata_varicella_precautions_02`
  ("F" droplet-alone rejected), consistent with `gemini_sic_ngn_2026_06_21_q15`
  byChoice[E].

The **gown/gloves-for-airborne distinction is keyed consistently**, not
contradictorily: TB-airborne-only items do *not* require routine gown/gloves
(`gemini_jun05_a_sata_airborne_precautions_03` "D" rejected — "regardless of body
fluid exposure"), whereas varicella (airborne **+ contact**) *does*
(`gpt_gap_jun11_sata_varicella_precautions_02` "D" keyed). Different organisms,
correct different keys — coherent, not conflicting.

**PPE sequence consistency (positive coherence):** All three donning items key
*gown → mask → goggles → gloves* (`gap_50_sic_01`, `gemini_b10_05`,
`gemini_jun05_a_or_ppe_donning_56`, the last prefixing hand hygiene); all four
doffing items key *gloves → goggles → gown → mask*
(`gap_50_sic_02`, `gemini_p1_03`, `gen_sic_batch2_3`, and `gemini_sic_ngn_2026_06_21_q1`
in its combined-step airborne variant). No item keys an opposing order.

**Alternative Interpretation (DC/AK):** Every pair reconciles by organism and PPE
step; the cluster is internally and mutually consistent. DISMISS/keep, in line
with the Gemini and Codex lanes.

### Two near-conflicts examined and dismissed

1. **Doffing variant — `gemini_sic_ngn_2026_06_21_q1` vs the other doffing items.**
   q1 removes "gloves **and gown** inside the room" as one step, then goggles,
   then the N95 outside; the others remove gloves first and the gown third (after
   goggles). Both are CDC-published doffing sequences (the "gown + gloves
   together" variant vs "gloves first"); neither item is the same question with an
   opposite key. Reconciliation strong → DISMISS (Hedge Rule). Worth a future
   style note only if the bank wants a single canonical doffing order.
2. **`trad_batchD_14` "ensure available" vs `gemini_jun05_a_sata_airborne_precautions_03`
   "wear for all interactions."** `trad_batchD_14` keys gown/gloves as PPE to
   *ensure available* for an airborne client; `gemini_jun05` rejects wearing
   gown/gloves *for every interaction regardless of fluid exposure*. These answer
   different questions (stocking vs universal donning) and are reconcilable;
   `trad_batchD_14` byChoice[B] ("Gloves are part of standard precautions for all
   client contact") is a mild imprecision, not a misteaching. LOW / minor →
   DISMISS.

### Redundancy — noted, DISMISS/keep

The cluster is topically dense (≥3 TB-airborne items; ≥3 meningococcal-droplet
items; ≥3 PPE-sequence items), but each is a distinct scenario or item format
(MC / SATA / matrix / ordered_response / dropdown_cloze / highlight). None is
strictly dominated; varied practice across formats is pedagogically valuable. No
`discard`.

### Sub-session 2 remediation queue (isolation_mode)

- **discard / retire:** none.
- **patch:** none.
- **source_check:** none (transmission categories and the 24-hour droplet
  stop-rule are standard CDC content, cited only to confirm consistency).
- **hold:** none.
- **minor polish:** none actioned (the two near-conflicts above are DISMISS;
  a single canonical doffing order is an optional future style choice, not a
  defect).
- **housekeeping:** none.

---

## Sub-session 3 — `potassium_replacement` + `insulin_hypoglycemia`

```
AUDIT SESSION HEADER
====================
Session ID         : 2026-06-24-Claude-Coherence-potassium+insulin
Reviewing model    : Claude (Opus)
Track              : coherence (DC/AK lead; RI/SC/BD ride-along; redundancy note)
Clusters           : potassium_replacement, insulin_hypoglycemia (combined)
Total in Scope     : 33 unique items across 28 candidate pairs
Banks              : gemini-canonical.json, gpt-canonical.json, hard-cases-canonical.json,
                     claude-canonical.json (read-only)
Producer basis     : all pairs are gemini/gpt-provenance for both ends. The
                     opus_* / opus3_* / opus24_* items are Opus-skeleton cases,
                     GPT-provenance per DECISIONS principle 22, so Claude is a
                     non-producer. Two opus3 leaves (q3/q5) additionally carry a
                     prior Claude *promotion* review; auditing them here is in
                     scope because coherence is a RELATIONAL cross-item judgment
                     (does A contradict B), not the single-item re-review that
                     blocked them for currency (per the lane spec). Their
                     single-item currency is handled separately in the Opus
                     currency exception.
Canonical writes   : none
Audit Categories   : DC, AK, RI, SC, BD, OG, redundancy
Total Findings     : 0 actioned. 1 near-conflict documented and DISMISSED.
  HIGH confidence  : 0
  MEDIUM confidence: 0
  LOW confidence   : 1 (DISMISS)
DC/AK result       : NULL — no actionable contradiction. Highest-stakes cluster
                     (IV potassium, hyperkalemia treatment, insulin, refeeding,
                     digoxin) and internally consistent.
Source posture     : guideline-sensitive content, but every disposition is
                     DISMISS/keep — no FIX adjudicated against a guideline — so no
                     dated source is required (pilot §4). The peripheral-KCl
                     thresholds below are cited only to confirm internal
                     consistency.
```

### DC / AK — null result (verbatim basis)

The pharmacology/electrolyte teaching is consistent across all 33 items:

- **Hyperkalemia management sequence** is identical everywhere: stabilize the
  myocardium with **calcium first**, then **insulin + dextrose** to shift,
  then **removal** (SPS / dialysis), with continuous ECG and post-insulin
  glucose monitoring — `gemini_c1_01` ("D" calcium gluconate first),
  `gemini_b9_10`, `gpt_case_aki_…_q4`, `gpt_case_aki_…_q5`,
  `gpt_case_gap_2026_06_11_aki_or_03`, `gpt_case_gap_2026_06_11_case_tls_01_q3`,
  `gpt_deepen_2026_06_23_bow_06`. No item gives potassium for hyperkalemia
  (`gpt_deepen_2026_06_23_bow_06` "q06_a_potassium" rejected).
- **Hyperkalemia ECG**: tall peaked T waves as the earliest change
  (`gemini_p4_06` "B", `trad_pa_05` "D"), with U waves / ST depression assigned
  to *hypo*kalemia in both — consistent.
- **IV-potassium safety** (high-alert): pump-controlled, telemetry, IV-site
  assessment, full verification, **never IV push** —
  `opus3_iv_potassium_safety_case_01_q5` ("D" IV-push rejected),
  `opus24_case_elder_neglect_med_mismanagement_01_q4` ("D" IV-push rejected),
  `opus_case_lithium_toxicity_q4` ("C" gravity-drip rejected). The peripheral
  **limit is keyed consistently from both sides**: 10 mEq/100 mL over 1 h is
  taught as safe (`opus24_…_q4`), while 20 mEq/100 mL over 1 h
  (`opus_case_lithium_toxicity_q4`) and 40 mEq over 2 h = 20 mEq/h
  (`opus3_…_q3`) are taught as exceeding usual peripheral limits and requiring
  clarification.
- **DKA / insulin**: regular insulin IV for DKA (`easy_dka_01` "B", with a
  correct caveat that aspart may also be given IV); replace potassium **before**
  insulin when K is already low because insulin shifts K intracellularly
  (`gemini_d10_03`); fluids-first priority (`gemini_p5_10`, `gemini_p7_06` for
  HHS). This is consistent with — not contradicted by — the hyperkalemia items'
  use of insulin to *lower* K: different potassium states, same mechanism.
- **Insulin mixing**: air→NPH, air→Regular, draw Regular, draw NPH ("clear
  before cloudy") in both `gap_50_ppt_05` and `gemini_d2_insulin_01` ("D").
- **Insulin hypoglycemia**: awake + able to swallow → 15 g fast carbohydrate →
  recheck in 15 min → do not give more insulin / do not leave alone / do not
  ambulate — `gpt_deepen_2026_06_22_b_pharm_05`, `…_bow_05`,
  `gpt_deepen_2026_06_23_bow_09`, and both
  `gpt_pharm_easy_medium_2026_06_21_*_bowtie_insulin_hypoglycemia_05/06`.
- **Refeeding syndrome** (low phos/K/Mg after restarting calories → slow/hold
  calories, replace electrolytes, monitor; do not advance, do not bolus insulin):
  `gpt_deepen_2026_06_22_bow_07`, `gpt_deepen_2026_06_23_bcc_01`,
  `gpt_fresh_2026_06_22_pharm_06` — consistent.
- **Digoxin toxicity** (hold for HR < 60 or K < 3.5; hypokalemia potentiates
  toxicity; yellow halos / nausea / bradycardia): `gpt_deepen_2026_06_22_b_pharm_03`,
  `gpt_fresh_2026_06_22_pharm_07` — consistent.

**Alternative Interpretation (DC/AK):** Every pair reconciles by the clinical
state (hyper- vs hypo-kalemia, DKA vs hypoglycemia) and the shared, correctly
keyed mechanisms. DISMISS/keep.

### Near-conflict examined and DISMISSED (LOW) — KCl 20 mEq/100 mL

`gpt_pharm_easy_medium_2026_06_21_a_fib_kcl_rate_04` (gpt-canonical
`questions[324]`) presents "potassium chloride 20 mEq diluted in 100 mL normal
saline … over 2 hours by pump" as a routine rate calculation (answer 50 mL/h =
10 mEq/h) with **no route stated and no safety claim about the concentration**.
`opus_case_lithium_toxicity_q4` (claude-canonical `questions[67].caseStudy.questions[3]`)
keys the same **20 mEq/100 mL** concentration as one that "exceed[s] the unit's
usual peripheral limit (typically 10 mEq/100 mL)" and must be held/clarified.

**Conflict claim:** a learner could read 20 mEq/100 mL as both "routine" and
"exceeds the peripheral limit."

**Alternative Interpretation (Reconciliation):** the calc item makes **no
peripheral claim** — it explicitly says "the potassium amount is important for
safety verification, but the pump rate comes from volume divided by time," and
its **rate (10 mEq/h) is within** the peripheral limit. 20 mEq/100 mL is a real
premixed concentration that is appropriate centrally and within some facility
peripheral ranges; the lithium case's "10 mEq/100 mL" is explicitly the *usual*
facility limit. The two items answer different questions (arithmetic vs
peripheral-safety judgment), so reconciliation is stronger than the conflict.
**LOW confidence → DISMISS** (Hedge Rule). No dated source needed because nothing
is adjudicated against a guideline.

**Optional polish (not actioned):** if the bank wants every KCl item to model
the conservative peripheral concentration, the calc item could specify "via
central line" or use 10 mEq/100 mL. This is a style-consistency choice, not a
defect — `recommendedAction = keep`.

### RI / SC / BD / OG — null

No internal inconsistency, stem cueing, bilingual divergence, or stale-guideline
finding met the evidentiary standard. The ZH renderings are faithful, the
dosage-calculation answers are arithmetically correct (`…a_fib_kcl_rate_04`:
100 mL ÷ 2 h = 50 mL/h; `opus3_…_q3`: 40 mEq ÷ 2 h = 20 mEq/h), and the keyed
guideline content (calcium-first, peripheral-KCl limits, 15 g/15-min
hypoglycemia rule, digoxin hold parameters) is current standard nursing
practice.

### Redundancy — noted, DISMISS/keep

Two dense bowtie families (≥3 each): insulin-hypoglycemia (`…_bow_05`,
`…_bow_09`, `…_bowtie_05`, `…_bowtie_06`) and refeeding syndrome (`…_bow_07`,
`…_bcc_01`, `…_pharm_06`). Each uses distinct stems, tokens, and decoy
parameters; none is strictly dominated. Varied NGN-format practice — keep.

### Sub-session 3 remediation queue (potassium + insulin)

- **discard / retire:** none.
- **patch:** none.
- **source_check:** none — guideline-sensitive content, but all DISMISS/keep, so
  no source-gated action (pilot §4).
- **hold:** none.
- **minor polish:** the optional KCl-concentration consistency note above
  (DISMISS / keep — surfaced for Luke's awareness, not queued as a defect).
- **housekeeping:** none.

---

---

# ════════════ PILOT-WIDE CLOSE (all lanes) ════════════

## Coverage

| Lane | Reviewer | Items | Pairs/rows | Actioned |
|---|---|---|---|---|
| Gemini adjudication (re-routed) | gemini + human | 4 | 2 pairs | 0 (2 DISMISS/keep) |
| Codex coherence | gpt-5/codex | 7 | 5 pairs | 0 |
| Codex currency (surviving hard-cases) | gpt-5/codex | 7 | 7 rows | 0 |
| Claude coherence (delegation/isolation/potassium/insulin) | claude-opus | 101 | 149 pairs | **2 (minor)** |
| Claude Opus currency exception | claude-opus | 5 | 5 rows | 0 |

Slice scope: **109 unique items / 156 candidate pairs** (reviewer split:
149 Claude-reviewable, 7 GPT-5/Codex). Producer≠checker held on every lane.
Merged coherence manifest: **119 rows**, all parse, all pilot §5 fields present;
**117 DISMISS / 2 FIX**.

## Grouped remediation queue (whole pilot)

- **discard / retire (CUT):** none.
- **patch (FIX — both minor, key-preserving, batchable):**
  1. `gemini_c9_01` (gemini-canonical `questions[365]`) — RI: the summary
     `rationale.correct` opens "B is assigned a Red tag because an open
     pneumothorax…" while the open pneumothorax is option **A**; key (A) and
     per-choice rationale are correct. Fix EN and ZH summary letter B → A.
  2. `gap_50_sic_03` (gemini-canonical `questions[725]`) — BD: ZH rationale
     renders "Influenza" as the non-word **流液**; fix to **流感** (droplet
     mapping already correct).
  Neither changes a keyed answer; both belong in a single small `patch-raw`
  EN+ZH polish spec, not an urgent repair.
- **source_check (REVIEW + needsHumanReview):** none. Guideline-sensitive
  clusters (potassium/insulin pharmacology, IV-KCl safety, perioperative
  anticoagulation) were all DISMISS/keep; currency was confirmed against dated
  sources (ISMP 2022 high-alert; IMSN 2020 IV-KCl; CHEST/ACCP 2022 perioperative
  antithrombotic; Joint Commission med-rec). Nothing is source-gated.
- **hold (REVIEW):** none.
- **minor polish (optional, all DISMISS — surfaced for awareness, not queued):**
  single canonical PPE doffing order; a route/concentration caveat on the KCl
  calc item (`gpt_pharm_easy_medium_2026_06_21_a_fib_kcl_rate_04`); a
  "routine AF bridging now discouraged (CHEST 2022)" stem note on the
  `opus1` anticoagulation case.
- **housekeeping:** none.

## Scale-or-stop — **SCALE**

Across 109 unique items and 156 pairs, three non-producer lanes plus a five-row
Opus currency exception surfaced **zero blocker/major findings, zero answer-key
contradictions, and only two minor key-preserving text defects** (one transposed
option letter, one ZH typo).

The pilot validated the two things under test:

1. **Concept-cluster seeds work.** They paired highly-related cross-bank items
   and produced *real* cross-item tensions worth adjudicating — KCl 20 mEq/100 mL
   appearing as both routine and over-limit; two valid CDC doffing variants;
   gown/gloves required for varicella but not TB-airborne; the DKA "replace K
   before insulin" rule against the hyperkalemia "insulin shifts K" items. Every
   one reconciled, but the method demonstrably *finds and tests* the seams rather
   than rubber-stamping. A bank that contradicted itself would not have survived
   this slice.
2. **The severity axis discriminates.** It cleanly separated the two minor text
   fixes from the DISMISS reconciliations and is structured to route a
   blocker/major to immediate repair had one existed. Confidence and severity
   stayed orthogonal (the two FIXes are HIGH-confidence / minor-severity).

The low defect yield is a **positive signal about bank quality**, not a weakness
of the apparatus. Recommend proceeding to **Phase B**: the remaining coherence
queue in ≤100-item harm-sorted batches, same apparatus, Claude/GPT-5 split by
provenance, with two tuning notes — (a) the `delegation_scope` seed pulled in
topical neighbors (prioritization, disaster triage, isolation); either tighten
cluster boundaries or accept the overlap as useful cross-topic coverage; and
(b) batch the minor text-polish findings into periodic `patch-raw` spec rather
than spinning a spec per item.

*No canonical banks were edited in this pilot. Repairs become separate patch
specs after Luke reviews this merged report.*
