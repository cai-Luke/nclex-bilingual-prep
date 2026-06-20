# Case Seeds — 2026-06-19 (gap-targeted batch)

Seeds for the **institutional Opus skeleton pipeline**. Each seed is a premise + NGN spine; feed it through the existing `opus-case-skeleton-prompt.md` to expand into a full bilingual fact pattern → GPT compile/fact-check → cross-model flag review → Claude promotion gate.

## Why these (evidence, `npm run coverage-report` @ 1333 q)

Targets the three under-target categories; deliberately **avoids** the over-target ones (Physiological Adaptation +60, Basic Care +32, Psychosocial +24 — do **not** seed clinical-deterioration cases that land there).

| Category | Gap | Seed targets (starved topic → count) | Avoid (saturated) |
|---|---|---|---|
| Management of Care | **−89** | Conflict Resolution (3), Client Advocacy (5), Confidentiality & HIPAA (9) | Prioritization & Delegation (50), Legal & Ethical (46) |
| Pharmacological & Parenteral | −38 | Nutritional & Fluid Support (3), Psychotropic Medications (7) | Med Safety & Admin (51), Dosage Calc (47) |
| Safety and Infection Control | −25 | Disaster & Emergency Preparedness (4) | Patient/Environment Safety (41), Transmission Precautions (39) |

Each case also pays down starved **item types** (targets ~148 each): `highlight: 2` ← worst in bank, `bowtie: 17`, `case_study: 119`. Every seed = 1 unfolding `case_study` (6 DPs across the NCJMM arc) + 1 standalone `bowtie`. The flagged `highlight`/`matrix`/`ordered_response` DPs are intentional — they attack type starvation in the same batch.

## Authoring constraints (carry into the skeleton prompt)

Reminder for review: check whether Author Opus got vague on concrete clinical numbers because of the “don’t let the number be the answer” constraint. We still want exact orders/rates/labs/policies as triggers; we just don’t want the keyed reasoning to become a number-recall item.

---

## PRIMARY — Management of Care (−89)

### Seed 1 — Conflict Resolution: lateral incivility between staff nurses
- **Category:** Management of Care · **Topic:** Conflict Resolution · **Difficulty:** hard
- **Premise:** On a busy med-surg unit a charge nurse observes escalating open conflict between a senior RN and a newly-licensed RN — dismissive remarks, withheld report detail, an eye-roll during handoff that left a same-day antihypertensive change uncommunicated. The gap reaches a client (held dose not relayed → BP spike at next assessment). The charge nurse must intervene.
- **NCJMM arc:**
  - recognize_cues *(highlight)* — highlight the statements/behaviors in the handoff narrative that constitute lateral incivility / horizontal violence.
  - analyze_cues *(matrix)* — classify each behavior as incivility vs. assertive professional communication.
  - prioritize_hypotheses *(MC)* — the priority problem is the **client-safety communication breakdown**, not the interpersonal friction itself.
  - generate_solutions *(select_all)* — appropriate charge-nurse mediation (private setting, focus on behavior + impact, reset expectations, document per civility policy, ensure the missed dose is addressed) vs. inappropriate (public reprimand, taking sides, ignoring).
  - take_action *(MC)* — the immediate first action (close the active care gap, then address conduct).
  - evaluate_outcomes *(MC)* — findings that show resolution worked (complete handoffs, no further omissions).
- **Bowtie:** condition = communication breakdown from unresolved lateral conflict; actions = mediate via structured process + secure a safe handoff; parameters = no further care omissions + civility expectations documented.
- **Teaching point:** structured conflict resolution; horizontal violence; client safety is the anchor, not "keeping the peace."
- **Do NOT let this become:** generic anti-bullying / HR-policy trivia. The keyed reasoning is protecting client safety through structured conflict resolution, not naming a civility statute.

### Seed 2 — Conflict Resolution: nurse–provider disagreement over a questionable order
- **Category:** Management of Care · **Topic:** Conflict Resolution · **Difficulty:** hard
- **Premise:** A covering resident orders an IV potassium replacement at a rate above safe limits for a client with borderline renal function. The bedside RN raises the concern; the resident is irritated and insists "just run it." The RN must navigate the disagreement professionally without either blindly complying or simply refusing.
- **NCJMM arc:**
  - recognize_cues *(highlight)* — highlight the elements of the order + client data that make it unsafe and the components of the RN's pushback that are assertive vs. aggressive.
  - analyze_cues *(MC)* — what is driving the conflict (a real safety issue, not a personality clash).
  - prioritize_hypotheses *(MC)* — client safety over hierarchy comfort.
  - generate_solutions *(select_all)* — assertive-communication + chain-of-command steps (CUS / "I'm **C**oncerned, **U**ncomfortable, this is a **S**afety issue," request rationale, escalate to charge/supervisor, document) vs. wrong (administer as ordered, refuse and walk away, go around the resident punitively first).
  - take_action *(MC)* — first action.
  - evaluate_outcomes *(MC)* — resolution achieved safely and collaboratively.
- **Bowtie:** condition = unsafe order + interprofessional conflict; actions = assertive safety communication + escalate per chain of command; parameters = order corrected/clarified + collaborative relationship preserved.
- **Teaching point:** respectful disagreement, CUS/graded assertiveness, chain of command without abandoning collaboration.
- **Do NOT let this become:** a medication-safety / KCl-limit calculation item. Do not ask the learner to calculate or identify the exact infusion ceiling; the unsafe order is **only the conflict trigger**, and the keyed reasoning is assertive safety communication + chain of command.
- **⚠ Review flag:** keep the clinical fact accurate (peripheral KCl ceiling ~10 mEq/hr, never IV push) but the **keyed point is the conflict process**, not the number — Opus should not let a dosage detail become the answer.

### Seed 3 — Client Advocacy: upholding a capacitated older adult's refusal against family pressure
- **Category:** Management of Care · **Topic:** Client Advocacy · **Difficulty:** hard
- **Premise:** A cognitively intact 82-year-old with advanced heart failure consistently declines a recommended PEG tube and further aggressive intervention, stating a clear wish for comfort-focused care. The adult children pressure the team to "do everything" and push the nurse to talk the parent into it; the provider is ambivalent.
- **NCJMM arc:**
  - recognize_cues *(highlight)* — highlight the documentation establishing decisional capacity and the client's consistent stated wishes.
  - analyze_cues *(MC)* — capacity is present → client autonomy governs; surrogate/family preference does **not** override.
  - prioritize_hypotheses *(MC)* — the priority is advocating for the client's autonomous choice.
  - generate_solutions *(select_all)* — facilitate a family meeting, involve palliative care / ethics, confirm the decision is informed and voluntary, document — **not** coercing the client or deferring to family.
  - take_action *(MC)* — first advocacy action.
  - evaluate_outcomes *(MC)* — client's wishes honored, comfort-focused plan in place.
- **Bowtie:** condition = capacitated client's autonomous refusal vs. family pressure; actions = uphold autonomy + convene interdisciplinary/ethics support; parameters = decision documented as informed/voluntary + comfort plan enacted.
- **Teaching point:** advocacy = amplifying the client's voice; capacity vs. surrogate decision-making; surrogate authority does not apply to a capacitated client. (Distinct from informed-consent mechanics.)
- **Do NOT let this become:** informed-consent mechanics (who signs, witnessing, form completion). The keyed reasoning is upholding a **capacitated** client's autonomy against surrogate/family pressure.

### Seed 4 — Client Advocacy: advocating against an unsafe premature discharge
- **Category:** Management of Care · **Topic:** Client Advocacy · **Difficulty:** hard
- **Premise:** A client recovering from a heart-failure exacerbation is slated for discharge, but the nurse identifies an unsafe picture: teach-back fails, can't afford the new diuretic, lives alone with stairs and no home scale, still dyspneic on minimal exertion. Throughput pressure pushes the discharge through.
- **NCJMM arc:**
  - recognize_cues *(highlight)* — highlight the red flags across the assessment + social history that signal discharge un-readiness.
  - analyze_cues *(matrix)* — classify each finding as a discharge barrier vs. resolved/not-a-barrier.
  - prioritize_hypotheses *(MC)* — advocate to delay/modify discharge for safety.
  - generate_solutions *(select_all)* — engage case management / social work, pharmacy assistance program, home-health referral, escalate to provider, document; not "discharge as ordered to free the bed."
  - take_action *(MC)* — first action.
  - evaluate_outcomes *(MC)* — safe-discharge criteria now met.
- **Bowtie:** condition = unsafe premature discharge; actions = advocate to hold/modify + mobilize interdisciplinary resources; parameters = discharge-readiness criteria met + follow-up resources secured.
- **Teaching point:** discharge readiness assessment; advocacy through the interdisciplinary team. (Advocacy lens, distinct from routine discharge-handoff items.)
- **Do NOT let this become:** routine heart-failure discharge teaching (daily weights, sodium, med reconciliation). The keyed reasoning is recognizing discharge **un-readiness** and advocating to halt/modify the discharge.

### Seed 5 — Confidentiality & HIPAA: multi-disclosure shift with a breach response
- **Category:** Management of Care · **Topic:** Confidentiality & HIPAA · **Difficulty:** hard
- **Premise:** Across one shift the nurse faces a cascade: a phone caller claiming to be the spouse asks for results; a coworker **not** assigned to the client opens the chart "to help"; the client's employer faxes a records request; a nursing student photographs a wound for class **including the wristband**; a family member overhears shift report in the hallway.
- **NCJMM arc:**
  - recognize_cues *(highlight)* — highlight which events in the narrative are HIPAA violations / risks (ideal highlight item).
  - analyze_cues *(matrix)* — classify each disclosure as permissible / impermissible / requires authorization.
  - prioritize_hypotheses *(MC)* — the active reportable breach to address first (the unauthorized coworker access).
  - generate_solutions *(select_all)* — verify caller identity, apply minimum-necessary, require written authorization for the employer, secure/delete the identifiable photo, report the breach per policy.
  - take_action *(MC)* — first action.
  - evaluate_outcomes *(MC)* — breach contained, reported, and recurrence controls in place.
- **Bowtie:** condition = unauthorized PHI access / breach; actions = mitigate + report per policy; parameters = breach documented + minimum-necessary upheld.
- **Teaching point:** minimum necessary, authorization vs. incidental vs. impermissible disclosure, mandatory breach reporting; do **not** chart in the medical record that a breach/incident report was filed (privilege — ties to the q6 teaching in the float-nurse case).
- **Do NOT let this become:** legalistic HIPAA trivia (statute citations, penalty amounts, definitions) without nursing action. The keyed reasoning is identifying the breach and the nurse's mitigation + reporting steps.
- **High value:** carries both a `highlight` and a `matrix` DP → directly attacks the two thinnest item types.

## SECONDARY — other deficit categories

### Seed 6 — Pharmacological & Parenteral: Psychotropic Medications — clozapine initiation / ANC monitoring
- **Category:** Pharmacological and Parenteral Therapies · **Topic:** Psychotropic Medications · **Difficulty:** hard
- **Premise:** A client with treatment-resistant schizophrenia is started on clozapine. The case unfolds around REMS/ANC monitoring (agranulocytosis), recognizing severe neutropenia (fever, sore throat), and clozapine's other serious effects — myocarditis (new chest pain/tachycardia/dyspnea early in therapy), seizures, severe constipation/ileus, orthostatic hypotension, metabolic effects, sialorrhea.
- **NCJMM arc:** recognize_cues (fever/sore throat with a dropping ANC, *or* early chest pain = myocarditis); analyze_cues; prioritize_hypotheses (hold drug + obtain ANC — agranulocytosis is the emergency); generate_solutions; take_action (per REMS ANC thresholds); evaluate_outcomes.
- **Optional visual:** an ANC `lab_trend` DP (also under target) if it stays educationally necessary.
- **Bowtie:** condition = clozapine-induced agranulocytosis (or myocarditis); actions = hold clozapine + ANC/cardiac workup per REMS; parameters = ANC recovery + symptom resolution.
- **Teaching point:** clozapine REMS/ANC thresholds, myocarditis window, ileus risk. Distinct from the existing lithium-toxicity case.
- **Do NOT let this become:** a generic antipsychotic side-effect MC quiz (EPS, weight gain). The keyed reasoning is recognizing the **agranulocytosis (or myocarditis) emergency** and acting per REMS/ANC monitoring. Thresholds must be source-verified at fact-check, not invented.

### Seed 7 — Pharmacological & Parenteral: Nutritional & Fluid Support — parenteral nutrition complications
- **Category:** Pharmacological and Parenteral Therapies · **Topic:** Nutritional & Fluid Support · **Difficulty:** hard
- **Premise:** A malnourished post-op client (NOT oncology — distinct from the archived TPN case) is started on peripheral→central parenteral nutrition. The case unfolds around refeeding syndrome (falling phosphate/potassium/magnesium), PN-associated hyperglycemia, the hypoglycemia risk of abrupt PN discontinuation, and central-line infection (CLABSI) signs.
- **NCJMM arc:** recognize_cues *(highlight or lab_trend)* — falling phosphate/K/Mg = refeeding; analyze_cues; prioritize_hypotheses (refeeding electrolyte derangement vs. line infection vs. hyperglycemia); generate_solutions (slow the rate, replace electrolytes per protocol, never stop PN abruptly, glucose monitoring); take_action; evaluate_outcomes.
- **Bowtie:** condition = refeeding syndrome on initiating PN; actions = reduce rate + replete electrolytes per order; parameters = electrolytes normalizing + no abrupt PN cessation.
- **Teaching point:** parenteral nutrition safety — refeeding, glucose, taper-don't-stop, CLABSI.
- **Do NOT let this become:** generic central-line/CLABSI, hyperglycemia, or "don't stop TPN abruptly" content. The **refeeding-syndrome electrolyte spine (falling phosphate / K / Mg)** must stay dominant throughout.
- **⚠ Review flag:** keep distinct from the existing oncology TPN/mucositis case; frame around post-op malnutrition + refeeding, not chemotherapy.

### Seed 8 — Safety and Infection Control: Disaster & Emergency Preparedness — mass-casualty triage
- **Category:** Safety and Infection Control · **Topic:** Disaster & Emergency Preparedness · **Difficulty:** hard
- **Premise:** A multi-casualty incident brings several victims to the ED at once. The nurse must apply **disaster (START) triage**, which differs from day-to-day "sickest-first" ED triage; resources are finite; one casualty arrives contaminated (decontamination needed before treatment).
- **NCJMM arc:**
  - recognize_cues *(matrix)* — assign START tags (red/immediate, yellow/delayed, green/minor, black/expectant) to each casualty vignette.
  - analyze_cues *(MC)* — why disaster triage reorders priorities (greatest good for the greatest number; expectant category).
  - prioritize_hypotheses *(MC)* — who is treated first under disaster rules (salvageable-sickest, not absolute-sickest).
  - generate_solutions *(select_all)* — appropriate disaster actions vs. conventional-care reflexes that waste scarce resources.
  - take_action *(ordered_response)* — sequence the decontamination / triage-to-treatment steps.
  - evaluate_outcomes *(MC)* — triage effectiveness measure.
- **Bowtie:** condition = mass-casualty event exceeding resources; actions = apply START triage + decontaminate before treatment; parameters = casualties correctly categorized + scarce resources allocated to salvageable.
- **Teaching point:** START categories, disaster vs. conventional triage, decontamination sequence, scope. Fills Safety D&E (4) and adjacent MoC D&E (2); carries the under-target `matrix` and `ordered_response` types.
- **Do NOT let this become:** conventional ED "sickest-first" triage. The keyed reasoning is **disaster** logic — greatest good for the greatest number, salvageable-sickest first, the expectant (black) category — under scarce resources.

---

## Suggested batch shape & review cadence
All 8 contribute. **Review 3 cases per session** — the gate hardening made the merge/route/collision steps order-free and cheap, but content review (≈30–40 adjudication points per case) is the irreducible step and does not get cheaper; 3 cases ≈ a full careful session, 8 would overload review precision exactly where these cases are subtle.

Run order (by review-cost, not topic):
1. **Batch 1 — Seeds 4, 5, 8.** Spans MoC + Safety/IC and all four starved item types (highlight, matrix, ordered_response, bowtie); lowest content-review risk. Best first test of whether the gate handles less-physiology NCLEX judgment content. *(Optional lever: swap 4→3 for wider reasoning-domain spread, but 3 is the highest review-risk seed — better as batch-2 lead.)*
2. **Batch 2 — Seeds 1, 2, 3.** The remaining MoC cases. Seed 2 needs the KCl-as-trigger steering; Seed 3 needs the autonomy-not-consent steering.
3. **Batch 3 — Seeds 6, 7.** Defer until the GPT fact-check / source-verification layer is explicitly confirmed: Seed 6 (clozapine REMS/ANC thresholds) and Seed 7 (refeeding electrolyte protocol) carry currency burden that must be verified, not generated.

**Within a session, case order does not matter** — disjoint ID prefixes, no cross-references, per-item shuffle, and `consolidate` routes/collision-checks/recounts regardless of order. Each seed = one `case_study` + `bowtie` pair (≈ 6 top-level + embedded items per pair).
