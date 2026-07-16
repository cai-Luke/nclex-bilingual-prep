# Producer Commission — Management of Care / Safety & Infection Control Coverage Batch

**Producer:** GPT-5.6 Sol (`gpt_` lane). **Type:** standalone items only (no `case_study`, no visuals).
**Size:** 18 items. **Trigger:** `npm run coverage-report` (2026-07-15) shows Management of Care as
the single largest category deficit (204 actual vs. 314 requested-target weight... category count
266 vs target 314, gap **-48**) and Safety and Infection Control also short (gap **-15**), while
`bowtie` (119) and `highlight` (121) are the two most underrepresented item types bank-wide against
a ~194 per-type parity target.

## Why this scope, specifically

Chosen to structurally avoid the topic-governance conflict from the 2026-07-14 format-gap batch: all
six topics below are **STRICT, single-category** in `src/topics.ts` — no SHARED license, no judgment
call about which category they belong to. Use the table verbatim; do not paraphrase the topic string.

**Root-cause note carried forward from the last batch's post-mortem** (see
`TOPIC-VOCABULARY-DECISIONS.md` § "GPT-5.6 Sol format-gap batch review"): the clinical focus of an
item and the literal string that goes in `question.topic` are two different things. The table below
gives both, in separate columns. Copy the **Canonical topic** column exactly into `question.topic`;
use the **Category** column exactly into `question.category`. Do not invent a more specific or more
descriptive topic string — if the scenario doesn't fit one of these six, drop it rather than
freelance a new topic.

## Target mix (18 items, exact assignment)

| # | Category | Canonical topic | itemType | Difficulty | Rationale (per-topic gap, from live bank count) |
|---|---|---|---|---|---|
| 1 | Management of Care | Client Advocacy | bowtie | medium | topic has 23 items, only 1 existing bowtie |
| 2 | Management of Care | Client Advocacy | select_all | easy | only 1 existing select_all |
| 3 | Management of Care | Client Advocacy | matrix | medium | only 1 existing matrix |
| 4 | Management of Care | Conflict Resolution | fill_in_blank | medium | **zero** existing fill_in_blank |
| 5 | Management of Care | Conflict Resolution | bowtie | hard | only 2 existing bowtie |
| 6 | Management of Care | Conflict Resolution | highlight | easy | only 3 existing highlight |
| 7 | Management of Care | Confidentiality & HIPAA | bowtie | hard | only 1 existing bowtie |
| 8 | Management of Care | Confidentiality & HIPAA | ordered_response | medium | only 1 existing ordered_response |
| 9 | Management of Care | Confidentiality & HIPAA | fill_in_blank | easy | only 1 existing fill_in_blank |
| 10 | Safety and Infection Control | PPE & Sterile Technique | fill_in_blank | medium | only 1 existing (and that one is a mistagged appendicitis item, not really PPE — flag, don't fix, out of scope here) |
| 11 | Safety and Infection Control | PPE & Sterile Technique | dropdown_cloze | medium | only 1 existing dropdown_cloze |
| 12 | Safety and Infection Control | PPE & Sterile Technique | select_all | easy | only 1 existing select_all; **do not** add another ordered_response — topic already has 11 |
| 13 | Safety and Infection Control | Standard Precautions & Hygiene | bowtie | hard | only 1 existing bowtie |
| 14 | Safety and Infection Control | Standard Precautions & Hygiene | matrix | medium | only 2 existing matrix |
| 15 | Safety and Infection Control | Standard Precautions & Hygiene | highlight | medium | only 4 existing highlight, format still bank-wide scarce |
| 16 | Safety and Infection Control | Disaster & Emergency Preparedness | highlight | hard | only 1 existing highlight |
| 17 | Safety and Infection Control | Disaster & Emergency Preparedness | fill_in_blank | medium | only 1 existing fill_in_blank |
| 18 | Safety and Infection Control | Disaster & Emergency Preparedness | dropdown_cloze | easy | only 1 existing dropdown_cloze |

Totals: bowtie 4, highlight 3, fill_in_blank 4, dropdown_cloze 3, select_all 2, matrix 2,
ordered_response 1 — zero `multiple_choice` (already 455 vs ~194 target, do not add more) and zero
`case_study` (separate compiler-owned lane, not this spec). Difficulty: 5 easy / 9 medium / 4 hard —
skewed easier than the last batch deliberately, since bank-wide `easy` (226) is the smallest
difficulty bucket.

## Do not repeat these premises

Each topic already has 23–30 live items. Do not reuse or lightly reskin any of the following
scenario premises — write new ones:

- **Client Advocacy:** DPOAHC family override of a documented refusal; interpreter/language-access
  refusal of teaching; blood-transfusion refusal; PEG-placement refusal bowtie; colleague
  falsifying controlled-substance documentation; surgical-consent understanding check.
- **Conflict Resolution:** potassium-order dosing disagreement with a covering resident; a
  charge-nurse BP/med-omission escalation case; workload-distribution disagreement; public
  preceptor criticism of a new nurse; disagreement over who calls a family with an update;
  discharge-readiness disagreement after new orders.
- **Confidentiality & HIPAA:** coworker viewing a record without a care role; visitor asking about a
  neighbor's diagnosis; caller claiming to be family/employer requesting diagnosis; photographing a
  wound on a personal device; unattended unlocked EHR workstation; misdelivered discharge packet.
- **PPE & Sterile Technique:** sterile field contamination during a dressing change or central-line
  care; doffing-sequence-after-splash-risk items; contact/droplet/airborne room-exit doffing order
  (already covered from multiple angles — if using this construct, pick a distinct exposure type
  than what's already there).
- **Standard Precautions & Hygiene:** needlestick-injury response sequence; C. diff / norovirus
  outbreak; latex-allergy cross-sensitivity; CVC dressing-change precautions; hand-hygiene duration
  fill-in-blank.
- **Disaster & Emergency Preparedness:** industrial-explosion MCI with START triage; dirty-bomb
  radiation exposure; anthrax/smallpox bioterrorism triage; chemical-spill decon; bus-crash mass
  arrival. Pick a different hazard/incident type entirely (e.g., structural fire evacuation,
  active-shooter lockdown-then-triage, flood/hurricane facility evacuation, pediatric MCI).

## Schema and quality bar

Defer field shape to `NCLEX-Question-Schema.md` (bowtie §, highlight §, fill_in_blank §,
dropdown_cloze §, select_all §, matrix §, ordered_response §) and `AGENTS.md` — do not restate shape
here. Hold to the same bar the last batch cleared on review: closed-world stems (state the governing
policy/threshold inline rather than assuming external-guideline currency), no-filler distractors
(every wrong option is a plausible misconception, not obviously wrong), per-choice clinical
rationale (`rationale.byChoice`, one entry per token/option), full bilingual `en`/`zh` parity on
every text field including `glossary` and `testTakingStrategy`, and a cited `meta.source` per item
(a real, checkable guideline or reference — ANA Code of Ethics, HIPAA Privacy Rule / 45 CFR 164, CDC
guidance, START/SALT triage protocol, facility-policy closed-world framing, etc.).

## ID convention

`gpt_mocsic_<generation-date:YYYY_MM_DD>_<itemtype-abbrev>_<topic-slug>_<2-digit-seq>` — e.g.
`gpt_mocsic_2026_07_15_bt_client_advocacy_01`. Confirmed unused prefix (`gpt_mocsic`) against all 13
canonical banks as of this spec's writing; producer must not reuse an existing gpt-lane prefix.

## Promotion path

Standard: `banks/banks-raw/<file>.json` → `validate-bank` → `normalize-raw-bank` → Claude content
review → `promote` → `audit` → `consolidate` (routes to `gpt-canonical.json` by `gpt_` prefix) →
`census` → `build` → `BANK-REVIEW-LEDGER.md` entry. No topic-vocabulary work anticipated this round
— all six topics are pre-existing STRICT canonical entries.
