# Shuffle & Rationale-Repair Verification — Spec for Claude Code (Sonnet)

**Project:** Shrimp (bilingual NCLEX-RN bank)
**Goal:** Verify that Gemini's MCQ answer randomization and rationale repair are correct, at minimal token cost.

---

## 0. Your job (read first)

Do **not** read or reason about questions one at a time. Your job is to **write a single deterministic Python verifier, run it, and report its output.** All per-item decisions are made by the script. The only LLM reasoning permitted is a small, capped escalation pass at the very end (§5), and only on items the script cannot resolve.

This keeps the verification reproducible and the token cost to roughly: read this spec → write ~250 LOC → run → summarize failures.

**Data-model note:** join options across versions by a **content hash** (normalized text: trim, collapse whitespace, casefold) so the verifier works whether or not options carry stable IDs.

---

## 1. Inputs

- `AFTER`: the current (post-shuffle) bank.
- `BEFORE` (preferred): the pre-shuffle bank. Get it from git — check out the commit immediately prior to Gemini's shuffle commit, or `git show <sha>:path/to/bank.json`. If Gemini squashed shuffle + repair into one commit, use the parent of that commit.
- If `BEFORE` is genuinely unavailable, run in **fallback mode**: skip §2 checks C1–C3 and rely on §3 and §4, noting the reduced assurance in the report.

Match items between `BEFORE` and `AFTER` by stable item ID. Report any items present in one but not the other.

---

## 2. Permutation invariants (requires BEFORE — strongest checks, no LLM)

For each item matched across versions:

- **C1 — Option-set integrity.** The multiset of option content-hashes in `BEFORE` must equal that in `AFTER`. FAIL if any option was added, dropped, altered, or duplicated. (Catches Gemini paraphrasing options while "shuffling.")
- **C2 — Key-content stability.** The content-hash of the correct option in `BEFORE` must equal the content-hash of the correct option in `AFTER`. The key must still point at the *same actual answer*, regardless of its new letter. FAIL otherwise. (This is the core correctness check.)
- **C3 — Movement sanity.** Report the share of items whose option order actually changed. A "shuffle" leaving most items in place is suspicious; flag if the changed share is implausibly low (e.g. < 50%).

---

## 3. Distribution post-condition (no BEFORE needed — confirms the cure)

- **C4 — Correct-position uniformity.** Over `AFTER`, compute the distribution of the correct answer's position (A/B/C/D). Chi-square goodness-of-fit vs uniform.
  - Require expected count per position ≥ 5, else report `INSUFFICIENT`.
  - **FAIL** iff chi-square `p < 0.01` AND max position deviation from 25% > 8 percentage points.
  - This is the original disease (D = 3%). Confirm it is cured. Report the full A/B/C/D histogram.

---

## 4. Stale-rationale detection (mostly deterministic, no BEFORE needed)

For each item, scan the rationale/explanation text (handle **both** English and Simplified Chinese; include CJK ordinal/positional terms):

- **C5 — Letter-claim consistency.** Extract explicit "Option X is correct / X is the answer" assertions (and the CJK equivalents). Cross-check the named letter against the live key. **FAIL** if a rationale asserts a letter that is not the current correct position. (Directly catches stale keys after shuffle.)
- **C6 — Positional-reference inventory.** Flag every rationale containing position/ordinal/spatial language — option letters, "first/second/last option," "above/below/the option preceding," and CJK equivalents (选项A/B/C/D, 第一个/最后一个, 上述/以上). These are **shuffle hazards** even when currently consistent; they should be rewritten to reference option content instead. Report the count and item IDs; do not auto-fix.
- **C7 — Content-reference consistency.** Where a rationale names option *content* and ascribes correct/incorrect to it (e.g. "furosemide is wrong because…"), attempt a deterministic substring/content match against the current options and check the claim is consistent with the live key. Resolve what you can deterministically; emit only the genuinely ambiguous ones to §5.

---

## 5. Escalation (the only per-item LLM cost — capped)

Collect items that (a) fail C7 ambiguously, or (b) carry positional references (C6) that cannot be auto-resolved. Cap this list at **20 items** (worst/most-ambiguous first). Run **one batched** judgment pass over just these. Do not run an LLM over any item the script already decided. Log the item IDs sent.

---

## 6. Output

Print a compact report — no per-item narration:

```
MODE: primary | fallback
items: matched=N  only_before=N  only_after=N
C1 option-set integrity:   PASS/FAIL  (fails: [ids…, capped 10])
C2 key-content stability:  PASS/FAIL  (fails: [ids…])
C3 movement:               changed=NN%  (flag: y/n)
C4 position uniformity:    PASS/FAIL/INSUFFICIENT  hist={A,B,C,D}  p=…  maxdev=…pp
C5 letter-claim stale:     PASS/FAIL  (fails: [ids…])
C6 positional refs (hazard): count=N  (ids…, capped 10)
C7 content-ref inconsistent: count=N  escalated=N
ESCALATION verdicts: [id: verdict …]
OVERALL: PASS / FAIL
```

`OVERALL = FAIL` if any of C1, C2, C4, C5 fails, or escalation surfaces a real inconsistency. C3 and C6 are warnings, not fails (but C6 count > 0 means the bank is fragile under future shuffles and should be repaired).

---

## 7. Acceptance

- The verifier is deterministic: same inputs → identical report (fixed seed, sorted iteration).
- Zero per-item LLM calls except the capped §5 batch.
- Bilingual: C5/C6 patterns cover English and Simplified Chinese.
- The report names actual failing item IDs so repair is targeted, not blind.
