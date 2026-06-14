# Gemini Review Spec: 13 Remaining Hard-Case Currency Records

## Objective

Perform a source-backed semantic currency audit of the 13 unresolved Layer A
records listed below. Review the canonical content but do not edit it.

This is an advisory review for Luke's human adjudication. Historical bank-level
records say the original hard-case seed was `Codex/source-checked + Gemini
reviewed`, but they do not identify the generator or final reviewer for these
specific items. Therefore:

- do not claim that this pass independently satisfies `producer != checker`;
- do not treat a prior Gemini verdict as evidence;
- Luke will read and adjudicate every returned finding;
- canonical banks, ledger, census, and source files are read-only.

## Read First

1. `AGENTS.md`
2. `NCLEX_Audit_Spec.md`
3. `early-bank-semantic-audit-spec.md`
4. `NCLEX-Question-Schema.md`
5. `BANK-REVIEW-LEDGER.md`
6. `audit/early-bank-semantic/CAMPAIGN-STATUS.md`
7. `audit/early-bank-semantic/currency/09-mixed-provenance-map.jsonl`
8. `banks/hard-cases-canonical.json`

The deterministic queue is routing evidence only. A queue hit is not a
clinical finding.

## Exact Scope

Audit exactly these 13 records from `banks/hard-cases-canonical.json`:

| ID | Canonical path | Role |
|---|---|---|
| `cs_hip_01_q5` | `questions[6].caseStudy.questions[4]` | Enoxaparin dose calculation |
| `case_dka_01` | `questions[7]` | DKA parent container and shared exhibits |
| `case_dka_01_q1` | `questions[7].caseStudy.questions[0]` | DKA finding classification |
| `case_dka_01_q2` | `questions[7].caseStudy.questions[1]` | DKA priority intervention |
| `case_dka_01_q3` | `questions[7].caseStudy.questions[2]` | Initial DKA resuscitation fluid |
| `case_dka_01_q4` | `questions[7].caseStudy.questions[3]` | Care during insulin infusion |
| `case_dka_01_q5` | `questions[7].caseStudy.questions[4]` | Insulin bolus calculation |
| `case_sepsis_pneumonia_01` | `questions[0]` | Sepsis parent container and shared exhibits |
| `sepsis_pneumonia_cues_matrix` | `questions[0].caseStudy.questions[0]` | Sepsis cue interpretation |
| `sepsis_pneumonia_actions_order` | `questions[0].caseStudy.questions[1]` | Initial sepsis action sequence |
| `sepsis_pneumonia_fluid_calc` | `questions[0].caseStudy.questions[2]` | 30 mL/kg crystalloid calculation |
| `sepsis_pneumonia_outcomes_cloze` | `questions[0].caseStudy.questions[3]` | Response-to-treatment evaluation |
| `sa_parkland_01` | `questions[17]` | Parkland fluid calculation |

The two parent containers are counted because their exhibits, timelines, and
stage visibility can make an embedded answer correct or incorrect. Do not file
duplicate findings against both a parent and its part for the same defect.

Do not audit other questions encountered while reading the parent cases.

## Active Categories

Primary category:

- `OG` — outdated or source-inconsistent clinical guidance

Ride-along categories:

- `RI` — rationale contradicts the key or case data
- `AK` — keyed answer is not supported by the supplied data
- `BD` — English and Chinese materially diverge
- arithmetic/dose integrity — units, timing, rounding, formula application,
  and answer tolerance

Do not perform a broad redundancy audit or architecture/schema redesign.

## Required Method

For every record:

1. Retrieve the exact question and, for embedded parts, the complete parent
   case: exhibits, stages, timeline, stem, options, key, rationales, strategy,
   and Chinese text.
2. Recalculate every dose or fluid answer independently, including units and
   timing.
3. Identify every clinical claim necessary to resolve the key.
4. Verify volatile claims with current authoritative primary guidance.
5. Compare the source with the exact bank wording, not a paraphrase.
6. Test the strongest reasonable reconciliation before filing a finding.
7. Check whether later case-stage information is improperly visible or
   required too early.
8. Check English and Chinese independently.
9. Return no finding when the item is supportable. Do not manufacture output
   to fill the batch.

Every `OG` action requires a live authoritative source URL, issuing body, year,
and a concise statement of the current rule. Without that evidence, use
`REVIEW`, never `FIX`.

## Focus Checks

### Hip / Enoxaparin

- Recalculate `30 mg` from a `40 mg/0.4 mL` supply.
- Verify the prescribed prophylaxis regimen is clinically plausible in the
  case context and that renal function, timing, route, and available
  concentration do not create a hidden contradiction.
- Preferred source: current FDA Lovenox prescribing information.

### DKA Case

Audit the whole treatment chain, not each part in isolation:

- diagnostic classification and competing conditions;
- initial crystalloid choice and wording;
- potassium assessment/replacement before insulin;
- current potassium threshold for delaying insulin;
- glucose threshold and purpose for adding dextrose;
- insulin infusion monitoring and transition logic;
- whether an IV insulin bolus is current, optional, unnecessary, or
  context-dependent when a continuous infusion is started;
- arithmetic and units in the weight-based insulin item;
- whether exhibits reveal enough information at the stage where each answer
  is requested.

Preferred source: the 2024 international consensus report on hyperglycemic
crises in adults, supplemented by current ADA guidance when necessary.

### Sepsis From Pneumonia Case

Audit the full timeline and treatment sequence:

- whether the findings support infection, sepsis, septic shock, or merely
  hypoperfusion;
- diagnostic language versus Sepsis-3 organ-dysfunction criteria;
- cultures, antibiotics, fluids, lactate reassessment, vasopressors, oxygen,
  and escalation order;
- crystalloid type and whether `30 mL/kg` is presented as a universal mandate,
  a suggested initial amount, or an explicit prescription to calculate;
- timing measured from recognition and whether actions would delay
  antibiotics;
- MAP, urine output, lactate, mental status, and other outcome interpretations;
- exact `68 kg × 30 mL/kg` arithmetic and units;
- consistency between the 1000 update, key, and rationale.

Preferred sources: current Surviving Sepsis Campaign guidance, Sepsis-3
definitions, and current drug or oxygen guidance only where directly needed.

### Parkland Item

- Recalculate the formula and distinguish the 24-hour total from the amount
  given during the first 8 hours from burn time.
- Confirm that partial-thickness burns count toward TBSA and that timing is
  measured from injury, not admission.
- Preserve Project Shrimp's established rule: when a stem explicitly directs
  the learner to use the traditional `4 mL/kg/%TBSA` Parkland formula, do not
  flag the item merely because newer ABA guidance may begin adult
  resuscitation at a lower volume. Flag only incorrect application, timing,
  units, ambiguity, or unsupported teaching beyond the named formula.
- Preferred source: current American Burn Association guidance.

## Verdicts

| Verdict | Use |
|---|---|
| `FIX` | A concrete, source-supported defect has a complete bilingual cure. |
| `REVIEW` | Evidence is incomplete, contested, context-dependent, or needs human clinical judgment. |
| `CUT` | The item is clinically unsalvageable; use rarely and explain why repair is inferior. |
| `DISMISS` | A suspected issue does not survive reconciliation. Include in the report only, not the action manifest. |

Do not use `FIX` merely to improve style. A fix must change a material clinical,
keying, arithmetic, staging, or bilingual defect.

## Report Format

Return a report titled:

`Gemini Advisory Review — 13 Remaining Hard-Case Currency Records`

Start with:

```text
AUDIT SESSION HEADER
====================
Session ID         : 2026-06-13-Gemini-Hard-Cases-13
Reviewing Model    : [exact Gemini model]
Questions Audited  : [all 13 IDs]
Total in Scope     : 13 records
Audit Categories   : OG, RI, AK, BD, arithmetic/dose integrity
Total Findings     : [N]
  HIGH confidence  : [N]
  MEDIUM confidence: [N]
  LOW confidence   : [N]
No-Finding IDs     : [exact IDs]
```

For every actioned item include:

1. Exact ID, bank, and canonical path.
2. Exact verbatim English and Chinese evidence.
3. Exact key and relevant distractors.
4. Parent-case evidence required to resolve the item.
5. The specific clinical/arithmetic conflict.
6. Current authoritative source, year, URL, and current value.
7. Strongest Alternative Interpretation.
8. Confidence and verdict.
9. A concise bilingual cure when verdict is `FIX`.

Group findings HIGH, MEDIUM, LOW, then dismissed concerns. Explicitly list all
no-finding IDs. A zero-finding report is valid.

Keep the report under approximately 3,000 words.

## Action Manifest

After the report, return JSONL with one row per `FIX`, `REVIEW`, or `CUT`.
Do not include no-finding or dismissed items.

```json
{
  "id": "question_id",
  "bank": "hard-cases-canonical.json",
  "path": "questions[n]...",
  "category_code": "OG|RI|AK|BD",
  "verdict": "FIX|REVIEW|CUT",
  "confidence": "HIGH|MEDIUM|LOW",
  "source": [
    {
      "body": "Authoritative body",
      "year": 2026,
      "url": "https://...",
      "current_value": "Current rule and how it differs from the bank."
    }
  ],
  "fix": [
    {
      "field": "exact.selector.en",
      "before": "Exact canonical English value",
      "after": "Proposed English value"
    },
    {
      "field": "exact.selector.zh",
      "before": "Exact canonical Chinese value",
      "after": "Proposed Chinese value"
    }
  ]
}
```

Rules:

- Every `before` value must exactly match canonical JSON.
- Every English content edit must have its Chinese partner.
- Include all answer-key, rationale, strategy, option, exhibit, or stage edits
  required to make the item internally coherent.
- `REVIEW` rows may use an empty `fix` array.
- `CUT` rows must replace `fix` with `"cut_reason"`.
- Return an empty JSONL block if there are no actioned items.

## Prohibited Actions

- Do not edit any file.
- Do not apply patches or cuts.
- Do not update the ledger, census, history, or campaign status.
- Do not broaden scope beyond the 13 records.
- Do not cite another question bank, review report, model output, blog, or
  NCLEX-prep site as clinical authority.
- Do not infer facts absent from the case.
- Do not call an item reviewed merely because it previously appeared in a
  canonical bank.

## Final Self-Check

Before returning:

- [ ] Exactly 13 scoped records were considered.
- [ ] Parent exhibits and stage timing were read for every embedded part.
- [ ] Every calculation was independently reproduced.
- [ ] Every action has exact canonical evidence.
- [ ] Every `OG` action has a current authoritative source.
- [ ] Every finding has an Alternative Interpretation.
- [ ] Every English fix has its Chinese pair.
- [ ] No canonical or project files were edited.
- [ ] No-finding IDs plus actioned IDs reconcile to all 13 scope records.
- [ ] The response clearly says it is advisory for Luke's human adjudication.
