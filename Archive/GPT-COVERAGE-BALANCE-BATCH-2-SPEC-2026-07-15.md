# Producer Commission — Coverage Balance Batch 2

**Producer:** GPT-5.6 Sol (`gpt_` lane). **Type:** standalone items only (no `case_study`, no
visuals). **Size:** 18 items.

## Planning basis

Treat `banks/banks-raw/gpt_mocsic_coverage_batch_2026_07_15.json` as fully promoted for this
commission's coverage arithmetic. Running
`npm run coverage-report -- banks/banks-raw/gpt_mocsic_coverage_batch_2026_07_15.json` produces a
projected 1,763-question bank with these remaining category gaps:

- Management of Care: 275 actual vs. 317 target, gap **-42**
- Pharmacological and Parenteral Therapies: 268 actual vs. 282 target, gap **-14**
- Safety and Infection Control: 221 actual vs. 229 target, gap **-8**
- Reduction of Risk Potential: 204 actual vs. 212 target, gap **-8**

The same projection leaves `bowtie` (123) and `highlight` (124) furthest below the 195.9 per-type
parity mark, followed by `case_study` (143), `dropdown_cloze` (167), `ordered_response` (168), and
`fill_in_blank` (170). This commission remains in the standalone lane, so it targets the five scarce
standalone formats and leaves case studies to their separate compiler-owned workflow.

The 8 / 4 / 3 / 3 category allocation below is deliberate. After all 18 items, projected total is
1,781; every currently under-target category improves against its new target despite denominator
growth. Management of Care remains the largest deficit and receives the largest share.

## Topic governance

Every topic below is an existing STRICT topic in `src/topics.ts`. The clinical premise and the
literal canonical topic string are separate decisions. Copy the **Canonical topic** and **Category**
columns exactly into each question. Do not invent, narrow, pluralize, or otherwise paraphrase a
topic. If a proposed premise does not fit the assigned pair, replace the premise rather than the
metadata.

Counts in the rationale column are exact canonical-string counts after overlaying the assumed-
promoted first coverage batch. They are planning evidence, not fields to copy into the JSON.

## Target mix (18 items, exact assignment)

| # | Category | Canonical topic | itemType | Difficulty | Rationale |
|---|---|---|---|---|---|
| 1 | Management of Care | Client Advocacy | bowtie | hard | projected topic count 20; only 2 bowties |
| 2 | Management of Care | Client Advocacy | dropdown_cloze | easy | only 1 dropdown cloze |
| 3 | Management of Care | Confidentiality & HIPAA | bowtie | medium | projected topic count 25; only 2 bowties |
| 4 | Management of Care | Confidentiality & HIPAA | ordered_response | medium | only 2 ordered responses |
| 5 | Management of Care | Conflict Resolution | fill_in_blank | easy | projected topic count 15; only 1 fill-in-the-blank |
| 6 | Management of Care | Conflict Resolution | highlight | easy | only 3 highlights |
| 7 | Management of Care | Discharge Planning & Handoff | bowtie | medium | projected topic count 35; only 2 bowties |
| 8 | Management of Care | Discharge Planning & Handoff | fill_in_blank | easy | only 3 fill-in-the-blank items |
| 9 | Pharmacological and Parenteral Therapies | Psychotropic Medications | highlight | easy | topic count 15; zero highlights |
| 10 | Pharmacological and Parenteral Therapies | Psychotropic Medications | ordered_response | hard | zero ordered responses |
| 11 | Pharmacological and Parenteral Therapies | Parenteral Nutrition | highlight | easy | topic count 10; zero highlights |
| 12 | Pharmacological and Parenteral Therapies | Cardiovascular & Endocrine Medications | bowtie | medium | topic count 32; only 3 bowties |
| 13 | Safety and Infection Control | Disaster & Emergency Preparedness | bowtie | medium | projected topic count 11; only 1 bowtie |
| 14 | Safety and Infection Control | PPE & Sterile Technique | highlight | easy | projected topic count 27; only 3 highlights |
| 15 | Safety and Infection Control | Standard Precautions & Hygiene | dropdown_cloze | easy | projected topic count 28; only 3 dropdown cloze items |
| 16 | Reduction of Risk Potential | Intrapartum Fetal Monitoring | ordered_response | medium | topic count 9; zero ordered responses |
| 17 | Reduction of Risk Potential | Intrapartum Fetal Monitoring | fill_in_blank | medium | zero fill-in-the-blank items |
| 18 | Reduction of Risk Potential | ABG & Acid-Base Interpretation | bowtie | medium | only 4 items in its licensed category; zero bowties |

Totals: bowtie 6, highlight 4, fill_in_blank 3, ordered_response 3, dropdown_cloze 2. Zero
`multiple_choice`, `select_all`, `matrix`, and `case_study`. Difficulty: 8 easy / 8 medium / 2 hard.

## Do not repeat these premises

This is a negative collision list, not a menu of required replacement scenarios. Do not reuse or
lightly reskin these live or assumed-promoted premises:

- **Client Advocacy:** family suppression of a terminal diagnosis; uncertainty or withdrawal around
  surgical consent; DPOAHC/family override of a capable client's refusal; refusal of antibiotics,
  transfusion, PEG placement, rehab, or catheterization; family used instead of a certified
  interpreter; controlled-substance documentation falsification; partner coercion around consent;
  inaccessible exam-table accommodation; rights of a hospitalized client in custody.
- **Confidentiality & HIPAA:** unverified family/employer/visitor disclosure requests; proxy-status
  verification; an unattended EHR; personal-device wound photography; coworker chart snooping;
  printed results or a discharge packet reaching the wrong person; voicemail/disclosure-log errors;
  an overheard bedside report; a missing managed device; minimum-necessary disclosure to quality
  improvement.
- **Conflict Resolution:** workload allocation or emergency-cart duty; public preceptor criticism;
  disagreement about who calls a family; discharge-teaching readiness or timing; the potassium-order
  and missed-antihypertensive escalation cases; float-nurse competency with vasoactive infusions;
  scripted constructive statements about shared equipment; the formal two-challenge escalation blank.
- **Discharge Planning & Handoff:** generic SBAR/ISBAR ordering; missing drain details in a transfer
  note; interpreter, hearing, or literacy accommodation omissions; new ostomy or wound-vac skill
  validation; heart-failure teach-back/access barriers; stroke transportation or therapy referral;
  food, medication, transportation, or aging-service referrals; unsafe premature discharge after
  decompensated heart failure.
- **Psychotropic Medications:** clozapine neutropenia, myocarditis, or infection; lithium toxicity,
  dehydration, thiazide/NSAID interaction, or serum-level classification; haloperidol/chlorpromazine
  EPS or neuroleptic malignant syndrome; MAOI food/drug interaction teaching.
- **Parenteral Nutrition:** refeeding syndrome; hyperglycemia/polyuria during continuous PN; central-
  line administration basics; an interrupted PN infusion with scheduled insulin; pump-time-remaining
  arithmetic.
- **Cardiovascular & Endocrine Medications:** ACE-inhibitor cough, angioedema, or routine teaching;
  digoxin toxicity/hold rules; rapid-acting-insulin hypoglycemia; abrupt prednisone withdrawal;
  metformin with iodinated contrast; levothyroxine with food/iron; furosemide hypokalemia; combined
  potassium-retaining medications with hyperkalemia; AV-nodal blocker holds.
- **Disaster & Emergency Preparedness:** START/SALT triage after an industrial explosion; dirty-bomb,
  anthrax, smallpox, chemical-spill, or bus-crash events; structural-fire horizontal evacuation;
  flood-driven vertical evacuation; active-shooter secure-in-place/all-clear response.
- **PPE & Sterile Technique:** sterile-field contamination during wound, catheter, or central-line
  care; routine room-exit doffing sequences; N95 user seal checks; splash PPE for deep-wound
  irrigation; sterile open-tracheal suctioning.
- **Standard Precautions & Hygiene:** needlestick response; C. difficile/norovirus outbreak control;
  latex cross-sensitivity; central-line dressing precautions; hand-hygiene duration; used-syringe
  reentry into a multidose vial; respiratory hygiene at facility entry; contaminated medication-
  preparation surfaces, phones, or uncapped sharps.
- **Intrapartum Fetal Monitoring:** Category I routine monitoring; early decelerations; recurrent late
  decelerations during oxytocin; variable decelerations immediately after membrane rupture; prolonged
  deceleration after epidural-associated hypotension; baseline bradycardia with absent variability;
  tachysystole with late decelerations.
- **ABG & Acid-Base Interpretation:** anion-gap calculation in salicylate toxicity; CKD metabolic
  acidosis; chronic COPD respiratory acidosis/compensation; COPD plus prolonged vomiting; generic
  matrix classification of several ABG sets.

A downstream semantic-similarity and human collision sweep is still required; this list protects
against known premise clusters, not every possible semantic collision in the bank.

## Schema and quality bar

Use the current `2.0` authoring contract in `NCLEX-Question-Schema.md` and the project rules in
`AGENTS.md`; do not infer field shape from this commission. Return exactly one JSON bank object with
18 questions and no Markdown fence or commentary.

Hold to these semantic requirements:

- Make every item closed-world. State any governing facility sequence, classification rule,
  threshold, reference interval, or calculation convention needed to resolve the item in the stem.
- Use plausible misconception-based distractors. Avoid filler, joke, category-error, or visibly
  unsafe distractors that make the item answerable without nursing judgment.
- Provide full bilingual English/Simplified-Chinese parity for every learner-facing text field,
  including `testTakingStrategy`, glossary entries, tokens, segments, blanks, and dropdown content.
- Provide `rationale.byChoice` coverage for every resolvable choice reference: every bowtie token,
  every selectable highlight segment, every dropdown, every blank, and every ordered-response option.
- `meta.source` must support the item's load-bearing rule; a topic-level homepage is insufficient.
  Cite the specific regulation, guideline section, official drug labeling section, or similarly
  precise authoritative source. If a facility policy makes an exact sequence closed-world, the
  external source must still support the general clinical or safety premise.
- Do not use AI-generated medical images. This commission requests no visuals of any kind, including
  `rationale.visuals`.

## ID convention

`gpt_balance2_<generation-date:YYYY_MM_DD>_<itemtype-abbrev>_<topic-slug>_<2-digit-seq>` — for
example, `gpt_balance2_2026_07_15_bt_client_advocacy_01`. The `gpt_balance2` prefix is unused across
the 13 canonical banks and the assumed-promoted raw batch as of this commission. Use one globally
unique top-level ID per item and unique local reference IDs within it.

## Promotion path

Standard raw-content path only: save as `banks/banks-raw/gpt_balance2_coverage_batch_2026_07_15.json`,
then follow `docs/AGENTS-RUNBOOK.md` for normalization, validation, independent checker clinical and
source review, promotion, audit, consolidation, ledgering, census regeneration, and build. The raw
artifact is unreviewed staging content until those gates are complete.
