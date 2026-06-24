# CLAUDE-OPUS-CURRENCY-HANDOFF-2026-06-24.md

Handoff for the five Opus currency rows that were split out of the GPT-5
package after DECISIONS principle 22.

## User decision

Luke decided Claude should pick up these five rows despite the earlier
producer/final-review conflict analysis.

Treat this as an explicit owner override for this bounded exception:

- Scope is exactly the five rows listed below.
- Findings-only audit; no canonical writes.
- State the conflict/override in the session header.
- Use dated authoritative sources for any currency or guideline-dependent claim.
- If the conflict still feels unacceptable, stop and return a concise objection
  instead of silently rerouting.

## Why these were split out

DECISIONS principle 22 makes Opus skeleton cases GPT-provenance for
review-conflict routing. That means GPT-5 should not audit these rows. The older
Phase B provenance map also records Claude final review on the same Opus cases,
which is why they were originally blocked for Claude too.

The current instruction supersedes the prior hold recommendation for these five
rows only.

## Rows

Source map:
`audit/early-bank-semantic/currency/09-mixed-provenance-map.jsonl`

Return index:
`audit/early-bank-semantic/CLAUDE-RETURN-INDEX.md` section 5,
`BLOCKED_PRODUCER_CONFLICT`.

Rows to audit:

| id | bank | path | original block reason |
|---|---|---|---|
| `opus1_case_discharge_med_rec_anticoag_01_q3` | `hard-cases-canonical.json` | `questions[51].caseStudy.questions[2]` | Opus 4.6 generation; Claude final review on 2026-06-13 |
| `opus1_case_discharge_med_rec_anticoag_01_q5` | `hard-cases-canonical.json` | `questions[51].caseStudy.questions[4]` | Same case container as above |
| `opus3_iv_potassium_safety_case_01` | `hard-cases-canonical.json` | `questions[53]` | Opus 4.6 generation; Claude final review on 2026-06-13 |
| `opus3_iv_potassium_safety_case_01_q4` | `hard-cases-canonical.json` | `questions[53].caseStudy.questions[3]` | Same case container as above |
| `opus3_iv_potassium_safety_case_01_q5` | `hard-cases-canonical.json` | `questions[53].caseStudy.questions[4]` | Same case container as above |

## Audit task

Audit these rows under the currency/OG rules from:

- `Archive/early-bank-semantic-audit-spec.md`
- `Archive/root-specs-2026-06-18/NCLEX_Audit_Spec.md`
- `adversarial-audit-phase-a-pilot-spec.md` sections 3-5 for severity/action
  fields and manifest shape

Focus:

- Anticoagulation / discharge medication reconciliation currency and safety for
  the `opus1_case_discharge_med_rec_anticoag_01_*` rows.
- IV potassium replacement / administration safety currency and safety for
  `opus3_iv_potassium_safety_case_01*`.

Output two findings-only artifacts:

- `audit/early-bank-semantic/currency/13-opus-currency-claude-exception.report.md`
- `audit/early-bank-semantic/currency/13-opus-currency-claude-exception.manifest.jsonl`

Do not include rewritten JSON in either artifact. Repairs, if any, become later
patch specs.

## Required report header

Include a session header with:

- Reviewing model: Claude
- Scope: five Opus currency rows listed in this handoff
- Conflict note: Luke explicitly overrode the prior producer/final-review block
  for this bounded exception
- Track: currency / OG
- Canonical writes: none
- Sources consulted: list dated source bodies used for any `OG` or
  guideline-dependent adjudication

## Manifest guidance

Use one row per actioned item. Required fields should follow the current pilot
manifest schema where applicable:

```json
{
  "itemId": "string",
  "parentId": "string | null",
  "bank": "hard-cases-canonical.json",
  "path": "questions[N] | questions[N].caseStudy.questions[M]",
  "itemType": "case_study | multiple_choice | select_all | ordered_response | fill_in_blank | matrix | dropdown_cloze | highlight | bowtie",
  "pairId": null,
  "categoryCode": "OG | RI | SC | BD",
  "severity": "blocker | major | minor | housekeeping",
  "confidence": "HIGH | MEDIUM | LOW",
  "verdict": "FIX | CUT | REVIEW | DISMISS",
  "recommendedAction": "keep | source_check | patch | hold | discard",
  "needsHumanReview": true,
  "finding": "one-sentence statement",
  "evidence": "verbatim quoted bank span(s)",
  "source": "body + year + specific value, or null when not guideline-dependent",
  "reviewingModel": "claude",
  "findingRef": "FINDING #N | CONCERN #N in the report"
}
```

## Non-goals

- Do not audit the GPT-5 coherence package here.
- Do not audit the other 12 currency rows assigned to GPT-5.
- Do not edit canonical banks.
- Do not update `BANK-REVIEW-LEDGER.md` until a later approved repair/cut pass
  is executed.
