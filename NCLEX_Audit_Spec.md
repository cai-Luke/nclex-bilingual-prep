# NCLEX Question Bank — Adversarial Audit Specification

**Version**: 1.0  
**Project**: NCLEX Bilingual Prep  
**Purpose**: Governs all AI-agent adversarial audits of the question bank. Hand this document verbatim to any audit agent as its task specification. Do not summarize or paraphrase it.

---

## 1. Mandate

You are performing an adversarial audit of a subset of a bilingual NCLEX question bank. Your job is to find **genuine, evidence-supported problems** — not to generate a large number of findings.

A report with **5 confirmed findings is better than a report with 30 probable ones.** You will be graded on evidence quality, not finding count.

---

## 2. Scope Declaration (Required Before Any Finding)

Before producing any findings, you must produce a **Session Header**:

```
AUDIT SESSION HEADER
====================
Session ID         : [YYYY-MM-DD-Batch-N]
Questions Audited  : [Comma-separated IDs or range, e.g. Q0001–Q0050]
Total in Scope     : [N]
Audit Categories   : [List which categories below are active for this session]
Total Findings     : [N]
  HIGH confidence  : [N]
  MEDIUM confidence: [N]
  LOW confidence   : [N]
Null Ranges        : [Any sub-ranges where no findings were produced, e.g. "Q0020–Q0031: no findings"]
```

A session that audits more than **100 questions** is out of scope. Stop and report the overage.

---

## 3. Audit Categories

Limit each session to a declared subset of categories. Auditing all categories simultaneously degrades quality.

| Code | Category | Description |
|------|----------|-------------|
| `DC` | Direct Contradiction | Two questions teach mutually exclusive clinical facts |
| `AK` | Answer Key Conflict | Two questions about equivalent clinical scenarios require different correct responses |
| `RI` | Rationale Inconsistency | A question's rationale contradicts its own stated correct answer |
| `SC` | Scope Conflation | A question assigns physician-scope actions to the nurse without appropriate delegation framing |
| `BD` | Bilingual Divergence | The Chinese stem or rationale teaches something materially different from the English |
| `OG` | Outdated Guidance | A question reflects practice guidelines superseded by current NCLEX-era standards |

---

## 4. Evidentiary Standards

These are **hard rules**. Violating any one of them requires you to downgrade or dismiss a finding.

### 4.1 The Quotation Rule
You may only report a conflict if you can quote **exact, verbatim text** from the question bank — stems, answers, rationales, and distractors as they appear. Paraphrase and summary are not permitted as evidence. If the exact text cannot be retrieved, report `INSUFFICIENT EVIDENCE` and do not file a finding.

### 4.2 The Two-Question Rule
A contradiction finding requires **two specific question IDs**. A concern about a single question is filed as a Single-Question Concern (Section 7), not a Finding.

### 4.3 The Articulation Rule
You must be able to complete the Conflict Claim section (Section 6.4) in plain declarative sentences. If you cannot clearly state what each question teaches and why those lessons are mutually exclusive, you do not have a finding — you have a suspicion. Suspicions are not reportable under this specification.

### 4.4 The Independence Rule
Each finding must stand on its own evidence. Do not report a finding because you found similar findings elsewhere ("pattern extrapolation"). Do not lower your evidentiary standard as the session progresses.

### 4.5 The Hedge Rule
There are no "possible," "probable," or "likely" contradictions. A finding either meets the evidentiary standard or it does not. If confidence is LOW and the alternative interpretation is plausible, the recommendation must be `DISMISS`.

---

## 5. Hallucination Guards

These are explicit failure modes to watch for in yourself:

1. **Memory degradation**: You may remember a question as "roughly X" rather than its exact wording. "Rough X" vs "Rough Y" is not a contradiction. Quote the text or do not file the finding.

2. **Pattern extrapolation**: Finding 3 contradictions does not mean there are 10. Each finding is independently evidenced.

3. **Authority inflation**: Do not escalate confidence as you accumulate findings. The 10th finding should be held to the same evidentiary standard as the 1st.

4. **Reconciliation suppression**: Do not skip the Alternative Interpretation section because you are confident. A strong conflict claim survives an honest reconciliation attempt; a weak one does not.

---

## 6. Finding Format

Use this format for every finding, in full, without abbreviation.

```
FINDING #[N]
Category: [Code from Section 3]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVIDENCE A
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question ID    : [Exact ID]
Full Stem      : [Exact verbatim text]
Correct Answer : [Exact verbatim text]
Distractors    : [Exact text of any distractors relevant to the claim]
Rationale      : [Exact verbatim text]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVIDENCE B
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question ID    : [Exact ID]
Full Stem      : [Exact verbatim text]
Correct Answer : [Exact verbatim text]
Distractors    : [Exact text of any distractors relevant to the claim]
Rationale      : [Exact verbatim text]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFLICT CLAIM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
What lesson does Question A teach?
[Single declarative sentence. "Question A teaches that..."]

What lesson does Question B teach?
[Single declarative sentence. "Question B teaches that..."]

Why are these lessons mutually exclusive?
[Explicit argument. Not a restatement of the above. Explain why a student
cannot hold both beliefs simultaneously and answer correctly on both questions.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALTERNATIVE INTERPRETATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Could both questions be correct in different contexts?
[Make the strongest possible case for reconciliation. Example:
"Question A may be testing ferromagnetic safety protocol; Question B may be
testing non-ferromagnetic implant triage. If so, they are testing different
decision trees and do not conflict."]

If a plausible reconciliation exists, Confidence must be MEDIUM or LOW.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFIDENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] HIGH   — Conflict holds even under the best-faith reconciliation.
[ ] MEDIUM — Conflict is probable but a plausible reconciliation exists.
[ ] LOW    — Conflict is possible but reconciliation is stronger than the claim.

Justification: [One sentence explaining the confidence level]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] FIX    — Contradiction confirmed; one question must be corrected or removed.
[ ] REVIEW — Human expert review required before any action.
[ ] DISMISS — Insufficient evidence or reconciliation is stronger than the claim.

Action notes: [Optional: which question to fix, or what a reviewer should look at]
```

Findings must be sorted in the output in **descending confidence order** (HIGH first, then MEDIUM, then LOW, then DISMISSED).

---

## 7. Single-Question Concern Format

Use this format when an issue is internal to a single question (e.g., the rationale contradicts the answer key, or the stem contains a factual error with no comparison question needed).

```
SINGLE-QUESTION CONCERN #[N]
Category: [RI / SC / OG / BD — whichever applies]

Question ID    : [Exact ID]
Full Stem      : [Exact verbatim text]
Correct Answer : [Exact verbatim text]
Rationale      : [Exact verbatim text]

Concern:
[Describe precisely what is internally inconsistent or erroneous, citing
the specific span of text that is problematic.]

Confidence    : HIGH / MEDIUM / LOW
Justification : [One sentence]

Recommendation: FIX / REVIEW / DISMISS
Action notes  : [Optional]
```

---

## 8. Bilingual Divergence Notes

For `BD` findings, Evidence A and Evidence B represent the **English version** and **Chinese version** of the same question, not two separate questions. The Finding format applies identically:

- Evidence A = English stem + answer + rationale (verbatim)
- Evidence B = Chinese stem + answer + rationale (verbatim, with English translation in brackets)
- Conflict Claim = what the English version teaches vs. what the Chinese version teaches
- A translation imperfection that does not change clinical meaning is **not** a BD finding.

---

## 9. Output Constraints

- **No editorializing** beyond the required fields.
- **No summaries** of the question bank as a whole.
- **Do not estimate** how many more findings might exist in questions you did not audit.
- If the word count of findings exceeds approximately **3,000 words per 50-question batch**, treat this as a signal that evidentiary standards degraded during the session. Review and cull before submitting.
- A session that produces **zero findings** is a valid and acceptable output. Provide the Session Header and state: "No findings meeting the evidentiary standard were identified in this batch."

---

## 10. Recommended Batch Sizes

| Use Case | Max Questions Per Session |
|----------|--------------------------|
| Calibration / first audit | 25–50 |
| Steady-state audits | 50–100 |
| Full-bank pass | Split into multiple sessions; never run as a single call |

Do not attempt to audit the full bank in a single agent call. Batch size violations reliably produce low-quality findings.

---

## 11. Quick Reference Checklist

Before submitting your report, verify:

- [ ] Session Header is complete
- [ ] All findings include verbatim quoted text for both Evidence A and B
- [ ] Every Conflict Claim is written as explicit declarative sentences
- [ ] Every finding has a completed Alternative Interpretation section
- [ ] Confidence is justified in one sentence
- [ ] Findings are sorted HIGH → MEDIUM → LOW → DISMISSED
- [ ] No finding is based on a paraphrase or summary of a question
- [ ] No finding extrapolates from other findings
- [ ] LOW confidence + strong reconciliation → Recommendation is DISMISS
