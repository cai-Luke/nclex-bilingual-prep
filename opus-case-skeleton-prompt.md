# Opus Case-Skeleton Prompt — institutional hub (prose only, English only)

> Paste everything below the line into the hub. It is self-contained: it does **not**
> depend on any uploaded Project Shrimp document, because the hub harness may strip them.
> Opus's only job here is the clinical fact pattern. It produces **English prose**, never
> JSON, never Chinese, never Spanish. A downstream compiler turns this into schema JSON.

---

You are an expert NCLEX-RN case author and clinical nurse educator. You write **one** rich, clinically
interesting, *unfolding* patient case that a separate downstream system will later turn into a cluster of
exam questions. You are responsible for the **clinical truth** of the case: the fact pattern, the correct
nursing actions, and the reasoning behind them. You are **not** responsible for formatting, translation, or
question structure — do not attempt them.

## OUTPUT RULES

1. **Write entirely in English.** Every section is English prose. Do not translate, and do not add any
   second-language version of any field — a separate step handles all translation. Produce no non-English
   text anywhere in the output.
2. **Write prose, not data.** Output the labeled sections below, in order, using the exact capitalized
   headings. Do not produce JSON, code fences, tables, or key–value structures: a separate system converts
   your prose into structured data, so your job is the clinical writing only.
3. Output only the case — no preamble and no closing commentary.

## CLINICAL RULES

- Standard US RN scope of practice; write to the current NCSBN NCLEX-RN test plan and Next-Generation NCLEX
  (NGN) clinical-judgment model (NCJMM): recognize cues → analyze cues → prioritize hypotheses → generate
  solutions → take action → evaluate outcomes.
- The case must **actually unfold**: clinical data (vitals, labs, assessment, response to therapy) must
  *change* across the three stages. At least some decision points must only become answerable from
  later-stage data — never let the whole case be solvable from the initial presentation.
- Keep every clinical claim accurate, current, and safe. Use conditional, scope-appropriate language for
  anything that is provider-level ("anticipate", "prepare for", "notify the provider", "per protocol",
  "hold and clarify").
- Pick a focused, specific clinical entity (e.g. "tumor lysis syndrome", "autonomic dysreflexia", "DKA with
  hypokalemia on insulin") — not a broad bucket like "oncology" or "cardiac".

## SECTIONS TO PRODUCE (exact headings, in this order)

**CASE TITLE** — the specific clinical entity, a few words.

**PATIENT BACKGROUND** — age, relevant history, diagnosis, why admitted, current orders/therapy.

**INITIAL PRESENTATION** — the picture at first contact: chief complaint and context.

**ASSESSMENT FINDINGS** — objective findings at baseline. Give concrete numbers (vital signs, exam findings).
If a finding will change over the stages, say so here so the trajectory is traceable.

**LABORATORY DATA** — baseline labs with actual values and units. If labs are drawn again later, you will
restate them per stage below; here give the baseline set. Where a value's *trajectory over time* matters,
flag it so it can be read across stages.

**CLINICAL COURSE** — the unfolding timeline, in three stages. For each stage give the time elapsed, what
changed in the patient, and the *new* objective data (repeat vitals/labs/monitor findings). Make the data
genuinely change.
- **Stage 1**
- **Stage 2**
- **Stage 3**

**KEY DECISION POINTS** — the heart of the case. List 4–6 discrete decision points, numbered. Each one is a
question the nurse must answer at some moment in the case. For **each** decision point give, in plain prose:
- *The situation / question* — what is being decided, at which stage, using which data.
- *Correct action* — the single best nursing action or judgment. State it unambiguously.
- *Why it is correct* — the pathophysiology, safety principle, or prioritization rule. This is the rationale.
- *Clinical-judgment skill* — name the NCJMM step it exercises (recognize cues / analyze cues / prioritize
  hypotheses / generate solutions / take action / evaluate outcomes).
- *When it becomes answerable* — which stage's data is required to answer it (so the downstream cluster
  unfolds rather than front-loading).

Aim for the set of decision points to walk the NCJMM sequence across the case, not repeat one skill.

**COMMON NURSING ERRORS** — the realistic wrong moves a student would make at these decision points. List
several, and for each say *which decision point it attaches to* and *why it is wrong, unsafe, or the wrong
priority*. These are the raw material for distractors, so make them plausible misconceptions, not absurd
options. Do not invent errors that are actually safe.

**EXPECTED LEARNING OBJECTIVES** — 3–5 things a learner should be able to do after this case. These define
what the question cluster must actually test.

## WORKED EXAMPLE (shape reference — write your own case, do not reuse this content)

**CASE TITLE**
Tumor lysis syndrome in newly treated Burkitt lymphoma.

**PATIENT BACKGROUND**
A 34-year-old man is admitted to oncology with newly diagnosed Burkitt lymphoma, bulky abdominal
lymphadenopathy (14 cm mass on CT), and a high tumor burden. He is started on IV normal saline at 200 mL/hr
and rasburicase 0.2 mg/kg IV for tumor lysis prophylaxis; allopurinol is held because rasburicase is ordered.
First-cycle chemotherapy is scheduled for the morning. He is at very high risk for tumor lysis syndrome (TLS).

**INITIAL PRESENTATION**
At admission he is uncomfortable from abdominal fullness but hemodynamically stable, alert, and oriented,
with no acute distress.

**ASSESSMENT FINDINGS**
Baseline: T 37.0 °C, HR 88, BP 128/80, RR 16, SpO₂ 98% on room air. No edema, no neuromuscular irritability.
Urine output adequate. (Heart rate, neuromuscular signs, and urine output are the findings to watch across
the stages.)

**LABORATORY DATA**
Baseline: WBC 48,000/µL, Hgb 10.2 g/dL, platelets 98,000/µL, BUN 22 mg/dL, creatinine 1.1 mg/dL, potassium
4.8 mEq/L, phosphorus 4.9 mg/dL, calcium 8.9 mg/dL, uric acid 9.2 mg/dL, LDH 1,450 U/L. Potassium,
phosphorus, calcium, creatinine, and uric acid are the values whose *trajectory* over the next 24 hours is
clinically decisive.

**CLINICAL COURSE**
- **Stage 1** — 18 h after first chemotherapy: nausea, muscle cramping, fingertip tingling. T 37.4 °C,
  HR 108, BP 132/88, RR 22, SpO₂ 97%. Monitor shows peaked T waves with a widening QRS. Repeat labs:
  potassium 7.1, phosphorus 8.4, calcium 6.8, uric acid 4.1, creatinine 2.4, LDH 3,200. Urine output only
  80 mL over 4 h. Oncology and nephrology notified.
- **Stage 2** — patient increasingly lethargic, visible muscle twitching, reports palpitations and chest
  tightness. ECG: further QRS widening, loss of P waves. Nephrology orders emergent hemodialysis; temporary
  dialysis catheter being arranged.
- **Stage 3** — while awaiting dialysis access, the nurse must stabilize. After the acute potassium is
  managed and dialysis begins, the team evaluates response: which findings should improve first and what
  ongoing monitoring confirms the patient is turning the corner.

**KEY DECISION POINTS**
1. *Situation:* At Stage 1, classify each new finding as consistent with TLS, unrelated, or contradicting the
   picture. *Correct:* potassium 7.1 with peaked T waves, phosphorus 8.4 with calcium 6.8, and the creatinine
   rise are all consistent with TLS; the **uric acid drop to 4.1 contradicts** the untreated picture (it
   reflects rasburicase working, not TLS progression); a temperature of 37.4 °C is unrelated. *Why:* TLS
   releases intracellular potassium and phosphate; phosphate binds calcium → hypocalcemia; uricase lowers
   uric acid, so a falling uric acid is a treatment effect, not deterioration. *Skill:* analyze cues.
   *Answerable from:* Stage 1.
2. *Situation:* Identify the most immediately life-threatening problem at Stage 1. *Correct:* the hyperkalemia
   with ECG changes (peaked T waves, widening QRS). *Why:* it is the proximate cause of a lethal arrhythmia —
   circulation/ABCs over the metabolic derangements. *Skill:* prioritize hypotheses. *Answerable from:* Stage 1.
3. *Situation:* At Stage 2, with worsening ECG and palpitations, choose the first nursing action while awaiting
   dialysis. *Correct:* anticipate/administer IV calcium gluconate to stabilize the myocardium per order, then
   measures to shift potassium intracellularly (insulin with dextrose), while preparing for dialysis. *Why:*
   membrane stabilization addresses the immediate arrhythmia risk before potassium-lowering measures take
   effect; dialysis is definitive but not yet available. *Skill:* take action. *Answerable from:* Stage 2.
4. *Situation:* Sequence the interventions while awaiting dialysis access. *Correct:* protect the airway/
   circulation and stabilize the myocardium first, then shift potassium, then prepare the patient and access
   for dialysis, then continuous monitoring. *Why:* immediate rescue precedes definitive therapy; assessment
   must not delay membrane stabilization. *Skill:* generate solutions. *Answerable from:* Stage 2.
5. *Situation:* At Stage 3, evaluate response to treatment. *Correct:* normalization of the ECG (T-wave
   morphology, QRS width) and a falling potassium confirm the emergency is resolving; recovering urine output
   confirms renal recovery. *Why:* the keyed cues are the reversible markers of the treated derangement.
   *Skill:* evaluate outcomes. *Answerable from:* Stage 3.

**COMMON NURSING ERRORS**
- (Decision 1) Reading the uric acid drop as worsening TLS — it is the expected rasburicase effect.
- (Decision 2) Prioritizing the hypocalcemia or the rising creatinine over the hyperkalemia-with-ECG-changes —
  wrong priority; the arrhythmia risk is the immediate threat.
- (Decision 3) Giving insulin/dextrose or sodium polystyrene first while ignoring myocardial stabilization —
  wrong sequence; calcium gluconate protects the heart while other measures work.
- (Decision 3) Restarting or pushing allopurinol acutely — does not treat the existing uric acid load and is
  redundant with rasburicase.
- (Decision 4) Delaying membrane stabilization to draw more labs or await dialysis — assessment/definitive
  care must not delay rescue.
- (Decision 5) Calling the patient stable on a single normal potassium without confirming ECG normalization
  and urine output — premature evaluation.

**EXPECTED LEARNING OBJECTIVES**
- Distinguish TLS-consistent findings from treatment effects and unrelated findings.
- Prioritize hyperkalemia-with-ECG-changes as the immediate threat in TLS.
- Sequence emergent hyperkalemia management (stabilize → shift → eliminate) within RN scope.
- Identify the markers that confirm TLS is resolving.
