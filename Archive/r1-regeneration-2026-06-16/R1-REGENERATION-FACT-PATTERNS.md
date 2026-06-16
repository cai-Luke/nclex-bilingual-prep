# R1 Regeneration Fact Patterns

Source: triage confirmation from Phase 1, 2026-06-15.
10 cases total: 9 regenerations (hard-cases-canonical) + 1 consolidation rebuild (replaces gpt-canonical smoke stub).

Pipeline for each: **Opus (author skeleton) → GPT (clinical fact-check + compile) → Gemini (flags only) → Claude (promotion gate)**.
Reuse the listed `case_id` for each rebuild. Exception noted for the consolidation rebuild — use `case_postpartum_preeclampsia_severe_01` (not the smoke artifact ID).

---

## 1. case_burns_01 — Severe Thermal Burns

**Scenario premise:** A 35-year-old male arrives in the ED by ambulance after a residential house fire. He sustained deep partial-thickness burns to his anterior trunk, bilateral anterior arms, and entire face. Singed nasal hairs, facial erythema, and a hoarse voice are noted. Estimated weight 80 kg. Initial vitals: BP 90/60, HR 125, RR 28, SpO2 93% on room air. Foley placed: 20 mL dark amber urine output.

**NCJMM arc (one DP per step):**
1. **Recognize cues** — identify inhalation injury risk (singed nasal hairs + hoarseness + facial burns + SpO2 93%) and classify burn extent using Rule of Nines (anterior trunk 18%, bilateral anterior arms 9%, face ~4.5% → ~31.5% TBSA)
2. **Analyze cues** — interpret initial hemodynamics (distributive/hypovolemic shock from fluid shift) and dark urine (myoglobinuria risk vs. inadequate resuscitation)
3. **Prioritize hypotheses** — differentiate inhalation injury requiring intubation from upper-airway edema manageable with NRB; recognize Parkland resuscitation math as the next calculation
4. **Generate solutions** — Parkland formula (4 mL × 80 kg × 31.5% TBSA = 10,080 mL LR over 24h; half in first 8h from time of burn, not from arrival)
5. **Take action** — immediate intubation decision, 100% O2 pre-intubation, two large-bore IVs, Foley for hourly urine output target (0.5–1 mL/kg/hr = 40–80 mL/hr for this patient)
6. **Evaluate outcomes** — urine output trending toward target, BP improving, reassess TBSA calculation, escharotomy need for circumferential burns

**Key facts to embed in exhibits:** Rule of Nines calculation, Parkland formula with time-of-burn anchor, urine output target, intubation vs. NRB decision threshold (hoarse voice = impending obstruction = intubate early).

**Distinguish from:** no other burns case in bank.

---

## 2. case_celiac_01 — Celiac Disease / Chronic Diarrhea

**Scenario premise:** A 28-year-old female presents to the outpatient GI clinic with a 6-month history of frequent foul-smelling, pale, bulky stools; abdominal bloating; and 10-pound unintentional weight loss. She also reports a pruritic blistering rash on her elbows and knees present for 3 months. Serology is ordered at visit. Follow-up visit 2 weeks later: tTG-IgA markedly elevated; EGD with duodenal biopsy shows villous atrophy.

**NCJMM arc (one DP per step):**
1. **Recognize cues** — identify fat-malabsorption pattern (steatorrhea, weight loss) + dermatitis herpetiformis (highly suggestive/classic rash on extensor surfaces — confirm with perilesional skin biopsy, not gut biopsy) as celiac-specific cluster
2. **Analyze cues** — interpret tTG-IgA + biopsy findings as confirming diagnosis; recognize malabsorption-driven deficiencies likely present (iron, folate, B12, calcium, vitamin D)
3. **Prioritize hypotheses** — distinguish celiac from IBD/IBS based on serologic/histologic evidence; recognize DH rash as celiac manifestation rather than contact dermatitis
4. **Generate solutions** — strict lifelong gluten-free diet as sole definitive treatment; order iron, folate, B12, calcium, vitamin D levels; dapsone for symptomatic DH rash
5. **Take action** — patient education: label-reading, cross-contamination risks, hidden gluten sources (medications, sauces, oats); correct nutritional deficiencies
6. **Evaluate outcomes** — assess dietary adherence and symptom resolution at follow-up; tTG-IgA trending down (should normalize 6–12 months on GFD); bone density scan referral if prolonged deficiency

**Key facts to embed:** tTG-IgA is first-line serology (must check total IgA level — IgA deficiency gives false negative); DH diagnosis is perilesional skin biopsy (IgA deposits), not gut biopsy; gluten-free diet resolves both GI and skin manifestations.

**Distinguish from:** no other GI malabsorption case in bank at this level.

---

## 3. case_cirrhosis_01 — Hematemesis in Cirrhosis / Esophageal Varices

**Scenario premise:** A 55-year-old male with a known history of alcohol-induced cirrhosis (Child-Pugh B) is brought to the ED by family after vomiting approximately 500 mL of bright red blood at home. He is alert but anxious. Initial vitals: BP 88/54, HR 118, RR 20, SpO2 96% on 2L NC. Abdomen distended with shifting dullness. INR 1.9, platelets 72,000, albumin 2.4.

**NCJMM arc (one DP per step):**
1. **Recognize cues** — identify variceal bleeding pattern: cirrhotic patient + massive hematemesis + hemodynamic instability; ascites confirms portal hypertension; coagulopathy (INR 1.9) compounds hemorrhage risk
2. **Analyze cues** — interpret vitals as hemorrhagic/distributive shock; INR elevation and thrombocytopenia reflect hepatic synthetic failure; risk-stratify with Child-Pugh B classification
3. **Prioritize hypotheses** — variceal bleed vs. peptic ulcer: cirrhosis + portal hypertension makes varices primary hypothesis; coagulopathy makes correction concurrent priority, not sequential
4. **Generate solutions** — octreotide (splanchnic vasoconstriction), ceftriaxone (SBP prophylaxis — reduces re-bleeding and mortality), PPI, RBC transfusion to Hgb target 7–8; FFP/platelets only if active coagulopathy is compounding uncontrolled hemorrhage — do not delay endoscopy for coagulation correction alone; endoscopy prep (band ligation first-line)
5. **Take action** — two large-bore IVs, type and cross, transfuse to target Hgb 7–8 (avoid over-transfusion — raises portal pressure), airway protection positioning, octreotide infusion, NPO for emergent EGD
6. **Evaluate outcomes** — cessation of active bleeding confirmed on EGD; vital sign stabilization; monitor for hepatic encephalopathy emergence (asterixis, confusion — lactulose); assess for SBP if peritoneal signs develop

**Key facts to embed:** restrictive transfusion strategy in variceal bleed (Hgb target 7–8, not 10); ceftriaxone is not optional (evidence-based mortality benefit); octreotide precedes scope; Blakemore tube only if scope unavailable or temporizing.

**Distinguish from:** no other cirrhosis/variceal bleed case in bank.

---

## 4. case_gbs_01 — Guillain-Barré Syndrome

**Scenario premise:** A 32-year-old male presents to the ED with a 5-day history of progressive symmetric weakness beginning in both feet, now extending to the thighs, accompanied by tingling and pain in the lower extremities. He had a self-limited diarrheal illness (Campylobacter suspected) 3 weeks prior. He is able to walk but reports difficulty climbing stairs. DTRs are absent bilaterally.

**NCJMM arc (one DP per step):**
1. **Recognize cues** — ascending symmetric weakness + areflexia + post-infectious trigger = GBS pattern; prior Campylobacter is the most common GBS trigger; rate of ascent determines urgency
2. **Analyze cues** — interpret lumbar puncture result (albuminocytologic dissociation: elevated protein, normal WBC) as confirmatory; EMG/NCS shows demyelinating pattern; FVC and NIF are the critical monitoring parameters, not limb strength
3. **Prioritize hypotheses** — distinguish GBS from spinal cord compression (no sensory level, no bowel/bladder involvement), transverse myelitis, and myasthenia gravis (fatigable vs. fixed weakness, no areflexia in MG)
4. **Generate solutions** — IVIG (0.4 g/kg/day × 5 days) or plasmapheresis — equally effective, choose based on availability and patient factors; NOT corticosteroids (worsen outcomes in GBS); intubation threshold: FVC <20 mL/kg or MIP weaker than −30 cmH2O (i.e., MIP above −30, e.g., −20 cmH2O — a less negative value indicates weaker inspiratory effort)
5. **Take action** — initiate serial FVC/NIF q4–8h; establish IV access for IVIG; DVT prophylaxis (immobility risk); pain management (neuropathic — gabapentin/opioids); cardiac monitor (autonomic instability: labile BP, arrhythmias); Foley if urinary retention
6. **Evaluate outcomes** — FVC trending toward intubation threshold? Plateau of weakness reached? Autonomic instability under control? Pain managed? — escalate to ICU if FVC declining regardless of subjective report

**Key facts to embed:** 20-30% of GBS patients require ventilation; FVC and MIP are the respiratory monitoring tools (not pulse ox alone — hypoxia is a late sign); intubation threshold is FVC <20 mL/kg or MIP above −30 cmH2O (weaker = less negative); steroids are contraindicated; autonomic involvement is a mortality driver.

**Distinguish from:** no other peripheral nervous system demyelinating case in bank.

---

## 5. case_pe_01 — Pulmonary Embolism (Post-TKA)

**Scenario premise:** A 68-year-old male is on the med-surg unit, post-operative day 2 from an elective right total knee arthroplasty. He suddenly reports sharp right-sided pleuritic chest pain and severe dyspnea. He is diaphoretic. Vitals: BP 100/70, HR 122, RR 28, SpO2 87% on room air. Right calf is warm and swollen. He was on sequential compression devices but refused them overnight and has been minimally mobile.

**NCJMM arc (one DP per step):**
1. **Recognize cues** — classic PE presentation: post-surgical immobility + DVT risk (unilateral calf swelling) + sudden pleuritic chest pain + hypoxia + tachycardia; Wells score is high-probability
2. **Analyze cues** — interpret SpO2 87% + RR 28 as massive hemodynamic insult; tachycardia + borderline hypotension raises concern for massive vs. submassive PE; identify RV strain pattern on ECG (S1Q3T3, sinus tach) and expected CT-PA findings (filling defect, RV dilation)
3. **Prioritize hypotheses** — rule out aortic dissection (acute chest pain + hypotension) and STEMI (ECG); confirm PE as primary hypothesis; classify severity (massive = sustained hypotension; submassive = elevated troponin/BNP + RV strain, but normotensive)
4. **Generate solutions** — anticoagulation: unfractionated heparin for post-surgical patient (reversible); assess thrombolysis eligibility (massive PE = consider; contraindication list includes recent surgery within 10 days — flag this tension); supplemental O2 ± NIV
5. **Take action** — stat CT-PA (if hemodynamically stable enough), O2 titrated to SpO2 ≥94%, IV UFH bolus + infusion, notify surgical team and rapid response, position (semi-recumbent, avoid supine in RV failure)
6. **Evaluate outcomes** — SpO2 improving on O2; HR trending down with anticoagulation; monitor for deterioration requiring code-level intervention (thrombolysis or ECMO); assess anticoagulation transition plan for discharge

**Key facts to embed:** Post-surgical anticoagulation tension (recent surgery is relative contraindication to thrombolytics); SpO2 87% is not manageable with NC alone; UFH may be selected over LMWH in this recent post-surgical patient given its rapid titratability and reversibility with protamine — 2026 AHA/ACC guidance otherwise favors LMWH for initial parenteral anticoagulation in PE; Wells criteria for probability stratification.

**Note:** Do not reuse the 68yo/post-TKA profile for any other case — this scenario is now owned by case_pe_01. The generic post-op stub (gen_rrp_batch2_10) was retired precisely because it duplicates this profile.

---

## 6. case_pph_01 — Postpartum Hemorrhage

**Scenario premise:** A 32-year-old client, G5P5, delivered a 4.2 kg (9.2 lb) infant vaginally 1 hour ago after a prolonged labor (second stage 3 hours). She has a history of pregnancy-induced hypertension this pregnancy. The nurse assesses fundal tone at the 1-hour mark and finds a boggy, displaced uterus. Current EBL 600 mL and increasing. Vitals: BP 90/62 (was 148/94 antepartum), HR 118.

**NCJMM arc (one DP per step):**
1. **Recognize cues** — identify PPH risk factors (grand multipara G5P5 — five or more prior births, macrosomia 4.2 kg, prolonged labor → uterine fatigue → atony); boggy uterus = uterine atony = most common cause of PPH; EBL >500 mL vaginal = hemorrhage threshold crossed
2. **Analyze cues** — interpret hemodynamic change (BP dropping from hypertensive baseline; 90/62 is relatively more severe given antepartum HTN); tachycardia developing; rising EBL; uterine atony confirmed by fundal assessment
3. **Prioritize hypotheses** — rule out laceration/hematoma (uterus firm but bleeding continues), retained placenta (inspect), and uterine inversion (fundus not palpable in expected position); atony most likely given boggy uterus
4. **Generate solutions** — uterotonic selection: methylergonovine (Methergine) is CONTRAINDICATED given history of PIH/hypertension (causes vasoconstriction and severe BP spike); oxytocin (IV infusion) is first-line; misoprostol (rectal/sublingual) if oxytocin insufficient; tranexamic acid ≤3h from birth onset; blood product readiness (MTP if EBL >1500 mL)
5. **Take action** — sustained fundal massage, oxytocin 20–40 units in 1L NS IV, position, Foley to monitor output, two large-bore IVs, type and crossmatch, call for backup (charge nurse, OB), bimanual compression if uterotonic response inadequate
6. **Evaluate outcomes** — uterine tone restored (firm fundus at umbilicus), EBL controlled, hemodynamic stabilization; if not responding: escalate to balloon tamponade, B-Lynch suture, or hysterectomy; lab monitoring (CBC, coagulation — DIC screen if EBL severe)

**Key facts to embed:** Methylergonovine contraindicated in HTN history — this is the pharmacology trap; oxytocin causes transient hypotension if given IV push (must be infusion); uterine atony accounts for ~80% of PPH; MTP threshold.

**Distinguish from:** case_postpartum_preeclampsia_severe_01 (hemorrhage vs. hypertensive emergency — different pathophysiology and management).

---

## 7. case_stroke_01 — Acute Ischemic Stroke

**Scenario premise:** A 68-year-old male is brought to the ED by EMS with sudden-onset right-sided arm and leg weakness and expressive aphasia. Last known well: 45 minutes ago. PMH: hypertension, atrial fibrillation (on warfarin). Current vitals: BP 188/104, HR 88 irregularly irregular, RR 16, SpO2 98%. Non-contrast CT head: no hemorrhage. NIHSS score 14 on arrival. Stat INR returns: 1.8.

**NCJMM arc (one DP per step):**
1. **Recognize cues** — identify classic left MCA territory: right-sided hemiplegia + expressive aphasia + sudden onset + FAST criteria met; time-of-onset anchors the tPA window; NIHSS 14 = moderate-severe stroke
2. **Analyze cues** — interpret non-contrast CT (no hemorrhage = tPA not contraindicated on imaging); current INR 1.8 exceeds the tPA eligibility cutoff (INR must be ≤1.7 at time of administration); A-fib on anticoagulation = cardioembolic etiology most likely
3. **Prioritize hypotheses** — confirm ischemic vs. hemorrhagic (CT done); tPA eligibility checklist: within 3-4.5h of last known well (45 min = yes), no hemorrhage (yes), BP <185/110 before tPA (188/104 = needs treatment first), current INR ≤1.7 (stat INR 1.8 = contraindicated — communicate finding to provider)
4. **Generate solutions** — antihypertensive to bring BP to <185/110 before tPA (IV labetalol or nicardipine — NOT nitroprusside); INR 1.8 is a tPA contraindication — pivot to mechanical thrombectomy evaluation (CTA head/neck for large vessel occlusion); discuss with neurology
5. **Take action** — administer IV alteplase once BP controlled and eligibility confirmed (0.9 mg/kg, max 90 mg; 10% IV bolus over 1 min, remainder over 60 min); no heparin/antiplatelet ×24h post-tPA; strict BP monitoring every 15 min during infusion; NPO pending dysphagia screen
6. **Evaluate outcomes** — monitor for alteplase complication: sudden severe headache + somnolence + new neurologic deterioration = intracranial hemorrhage → stop infusion immediately, emergent repeat CT; track NIHSS trajectory; dysphagia screen before any oral intake

**Key facts to embed:** BP threshold for tPA is <185/110 (treat first, then give); current INR >1.7 is a contraindication — use the stat result, not a historical INR; when tPA is contraindicated, thrombectomy is the pivot; dysphagia screen mandatory before oral intake; ICH complication = stop infusion and emergent CT; lytic window is 3–4.5h from last known well (not from symptom discovery).

**Distinguish from:** no other stroke case in bank.

---

## 8. cs_aki_01 — Acute Kidney Injury

**Scenario premise:** A 65-year-old male is admitted from a skilled nursing facility with a 3-day history of vomiting and diarrhea (norovirus outbreak at facility). He is confused and producing minimal urine. PMH: type 2 diabetes (on metformin and lisinopril), stage 2 CKD at baseline. Admission labs: BUN 68, Cr 4.2 (baseline Cr 1.4), BUN:Cr ratio 24:1, urine Na 8 mEq/L, urine specific gravity 1.030, K 6.1. BP 88/54 on admission.

**NCJMM arc (one DP per step):**
1. **Recognize cues** — identify prerenal AKI pattern: volume depletion from GI losses + BUN:Cr >20:1 + concentrated urine (SG 1.030, UNa <20) + BP 88/54; CKD baseline makes acute-on-chronic distinction critical
2. **Analyze cues** — interpret K 6.1 as dangerous hyperkalemia requiring treatment before full volume assessment; Cr 4.2 vs. baseline 1.4 = acute-on-chronic; metformin must be held (lactic acidosis risk in AKI); lisinopril must be held (worsens renal perfusion in prerenal state)
3. **Prioritize hypotheses** — confirm prerenal vs. intrinsic AKI (respond to fluids? → prerenal; no response + casts on UA → ATN); distinguish from obstructive (bladder scan for retention; no post-renal sign here)
4. **Generate solutions** — isotonic fluid resuscitation (NS or LR bolus, then titrate to urine output); hold nephrotoxins (metformin, lisinopril, NSAIDs if any); emergent hyperkalemia management: calcium gluconate (cardiac membrane stabilization) → insulin + dextrose + kayexalate/patiromer → monitor ECG
5. **Take action** — IV access, fluid challenge with close monitoring, Foley for hourly urine output, cardiac monitor (hyperkalemia ECG changes: peaked T waves → PR prolongation → wide QRS), restrict dietary K, nephrology consult if no response to fluids
6. **Evaluate outcomes** — urine output responding (>0.5 mL/kg/hr)? Cr trending down? K normalizing? If no response to 2L: suspect ATN, reassess fluid balance to avoid overload; anticipate renal replacement therapy discussion if oliguria persists

**Key facts to embed:** BUN:Cr >20:1 = prerenal signature; UNa <20 = avid sodium reabsorption = kidneys are working (prerenal); hyperkalemia is the life-threatening complication that must be treated while resuscitating volume; metformin and lisinopril held in AKI.

**Distinguish from:** no other AKI case in bank.

---

## 9. cs_panc_01 — Acute Pancreatitis

**Scenario premise:** A 45-year-old female presents to the ED with sudden severe epigastric pain (9/10) radiating to the back, accompanied by nausea and vomiting, onset 6 hours ago after a large fatty meal. PMH: gallstones (ERCP declined by patient previously), BMI 34. Admission labs: lipase 1,840 U/L (>3× ULN), AST 210, ALT 280, total bilirubin 3.2, WBC 14.5, Hct 48%, BUN 22, Ca 7.6 mg/dL, glucose 180.

**NCJMM arc (one DP per step):**
1. **Recognize cues** — identify gallstone pancreatitis pattern: elevated transaminases + bilirubin + gallstone history + post-fatty-meal onset; lipase >3× ULN confirms pancreatitis; BISAP score: BUN >25? No. Impaired mental status? No. SIRS? (WBC 14.5, HR/RR to check) → early severity stratification
2. **Analyze cues** — interpret Ca 7.6 as hypocalcemia (fat saponification sequestering calcium — assess for Chvostek's and Trousseau's signs); Hct 48% = hemoconcentration from fluid shifts (intravascular depletion despite normal BP); elevated LFTs support biliary etiology → ERCP candidate if cholangitis develops
3. **Prioritize hypotheses** — mild vs. moderate-severe vs. severe pancreatitis (BISAP, Ranson's); hypocalcemia is an independent severity marker; necrotizing pancreatitis if no improvement at 48–72h (CT with contrast)
4. **Generate solutions** — aggressive IV fluid resuscitation (LR preferred over NS — less acidosis); NPO while actively vomiting, then early oral or enteral feeding as tolerated (nasojejunal if oral not tolerated) — early enteral nutrition is preferred over prolonged NPO; IV calcium gluconate for symptomatic hypocalcemia; pain management (IV opioids); ERCP within 24–48h if cholangitis or worsening obstruction
5. **Take action** — LR at 250–500 mL/hr initial bolus then titrate; assess Chvostek's (tap facial nerve) and Trousseau's (BP cuff inflation) for tetany; IV calcium gluconate 1–2g over 10–20 min for symptomatic hypocalcemia; antiemetics; maintain NPO while vomiting is active; strict I&O; analgesics (IV morphine or hydromorphone — the old "morphine causes sphincter of Oddi spasm" myth is outdated and not a contraindication)
6. **Evaluate outcomes** — pain improving? Lipase trending? Ca normalizing? Advancing to clear liquids when pain resolves and patient requests oral intake (not lipase level alone); watch for SIRS/sepsis if fever develops and WBC rises → CT to assess necrosis

**Key facts to embed:** LR is preferred fluid (not NS); early enteral nutrition is better than prolonged NPO; hypocalcemia mechanism (fat saponification); morphine is not contraindicated in pancreatitis; necrotizing pancreatitis requires contrast CT; ERCP timing for gallstone pancreatitis with obstruction.

**Distinguish from:** no other pancreatitis case in bank.

---

## 10. case_postpartum_preeclampsia_severe_01 — Postpartum Preeclampsia with Severe Features (Consolidation Rebuild)

**New case_id:** `case_postpartum_preeclampsia_severe_01` (replaces smoke artifact `hl_smoke_2026_06_14_case_postpartum_preeclampsia_03`; raw smoke2 file discarded)

**Scenario premise:** A 29-year-old primipara calls the postpartum triage line 4 days after an uncomplicated vaginal delivery. She reports a severe frontal headache (8/10), visual changes described as "seeing spots," and significant facial swelling that began this morning. She denies chest pain. BP on home cuff: 162/108. She was normotensive throughout pregnancy and was discharged on postpartum day 1 with BP 118/74.

**NCJMM arc (one DP per step):**
1. **Recognize cues** — identify postpartum preeclampsia-with-severe-features cluster: severe headache + visual disturbance (scotomata) + facial edema + BP 162/108 (≥160/110 = severe-range) developing after normotensive delivery; late postpartum preeclampsia (after 48h) is underrecognized — patient and family may dismiss as "normal postpartum"
2. **Analyze cues** — interpret BP 162/108 as severe-range (≥160 systolic or ≥110 diastolic meets severe threshold); headache + visual changes are CNS warning signs of impending eclampsia; late onset (day 4) does not reduce severity — majority of postpartum eclampsia occurs after discharge
3. **Prioritize hypotheses** — severe preeclampsia vs. postpartum hypertension without severe features vs. HELLP syndrome (need labs: platelets, LFTs, Cr); rule out posterior reversible encephalopathy syndrome (PRES) if neurologic signs progress; primary hypertension unlikely given normotensive pregnancy and acute onset
4. **Generate solutions** — instruct patient to go to ED immediately (do not drive herself); antihypertensive treatment (IV labetalol or hydralazine; immediate-release oral nifedipine 10 mg when IV access is not yet established — not XL formulation); magnesium sulfate for seizure prophylaxis (not treatment of hypertension — common student confusion); order HELLP panel (CBC, CMP, LFTs, uric acid)
5. **Take action** — in ED: IV access, continuous BP monitoring, Foley, fetal heart rate not applicable (postpartum) — focus on maternal monitoring; magnesium sulfate 4–6g IV loading dose over 15–20 min then 1–2g/hr maintenance; antihypertensive to bring BP below 160/110 within 30–60 min; seizure precautions (dim lights, calm environment, pad rails)
6. **Evaluate outcomes** — BP responding to antihypertensives (target <160/110 acutely, then <150/100 for sustained control); no seizure (magnesium effective); if seizure occurs: magnesium bolus; monitor for magnesium toxicity (respiratory rate, DTRs, urine output) — but full toxicity management arc is in case_preeclampsia_magnesium_01

**Key facts to embed:** Postpartum preeclampsia most common in first week after delivery; BP ≥160/110 = severe-range requiring acute treatment within 30–60 min; magnesium is for seizure prophylaxis, not antihypertensive; acute antihypertensives are IV labetalol, IV hydralazine, or immediate-release oral nifedipine 10 mg (not XL); HELLP can present postpartum. End this case at magnesium initiation and acute BP control — do not cross into toxicity monitoring (that belongs to case_preeclampsia_magnesium_01).

**Distinguish from:** `case_preeclampsia_magnesium_01` (tolerated, 4 items) — that case centers on magnesium toxicity monitoring and antidote (calcium gluconate); this case ends where that one begins.

**Highlight item note:** The existing smoke stub was a Highlight: Text item. The rebuild should use standard NCJMM item types per the pipeline. If a Highlight question is warranted for recognizing severe-feature cues (step 1), it is acceptable but not required.

---

## Authoring notes (apply to all 10)

- Target: **6 embedded items, one per NCJMM step** (recognize → analyze → prioritize → generate → take action → evaluate). No skill repeats.
- Optional bowtie sibling if the case supports a clean 1/2/2 structure.
- Item types: vary across the 6 items; avoid all-MCQ. Use matrix, dropdown-cloze, SATA, ordered-response, highlight as appropriate.
- Schema: 1.4.
- All text bilingual (en + zh); exhibits bilingual.
- `_compileManifest` required in GPT compile output.
- Gemini reviews flags only — does not edit.
