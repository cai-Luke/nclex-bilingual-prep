# NCLEX Bank Audit — Task Spec (for Codex / Content Reviewers)

**Status:** Draft v2 — model roles settled, generator trust is conditional
**Runs:** as a standalone review pass over `banks-raw/` (often Gemini-generated raw volume). Decoupled from generation — the generator and reviewer are deliberately different models (§7).
**Recommended reviewers:** **Codex or another model different from the generator** — prior review passes found Codex and Claude Code both useful for high-catch-rate content review. Escalate deep clinical verification to a strong reasoning tier or a qualified human reviewer; see §7.
**Companion docs:** `NCLEX-Question-Schema.md` (v1.1 current data contract; v1.0 standalone banks still supported) and `NCLEX-Prep-SPEC.md` (app).

---

## 1. Purpose & non-goal

**Purpose:** raise the clinical reliability of the question banks and prevent wrong/unsafe questions from ever reaching the learner. This is **content/clinical** auditing — structural schema validity is already enforced by the validator and is assumed.

**Non-goal / hard truth to encode:** this audit is a filter, **not a clinical authority**. An LLM cannot certify medical ground truth. The job is to *verify against sources and discard what can't be verified* — not to vouch from its own knowledge. When in doubt, **flag or discard; never pass on assumption.** These are licensure-exam prep materials; a missing question is free, a plausibly-wrong one is harmful.

---

## 2. Pipeline & file flow

```
banks-raw/<source>-<date>[-<suffix>].json   # immutable raw model output (NOT bundled)
        │  (audit)
        ▼
banks/<source>-<date>[-<suffix>].json        # vetted: PASS + applied FIXes (this is what the build bundles)
audit/<source>-<date>[-<suffix>].report.json # machine-readable verdicts (§5)
audit/<source>-<date>[-<suffix>].report.md   # human-readable summary + flagged items
```

- **`banks-raw/` is immutable** — preserve the original for provenance and re-audit. Never edit it.
- Only **PASS** and successfully **FIX**ed questions are written to `banks/`. **DISCARD** and **needs-human-review** items are excluded from `banks/` and recorded in the report.
- Re-running the audit is idempotent: regenerate `banks/` + reports from `banks-raw/` each time.

---

## 3. Per-question checks

For every question, evaluate all that apply to its item type. For `case_study`, audit both the case-level scenario/exhibits and every embedded item.

1. **Keyed answer is correct.** Is the `correct` answer actually right per current nursing standards? Verify against a source (§4), don't assert from memory.
2. **No second correct answer.** Adversarially try to prove a distractor is *also* defensible — the #1 NCLEX-item failure, especially in `select_all` and priority/"best action" stems. If two options are defensible, the item is broken.
3. **Distractors are genuinely incorrect** and plausible (not absurd, not trick-by-typo).
4. **No generator placeholders.** Reject or fix any item with filler such as "Additional distractor", "Distractor analysis", "placeholder", "TBD", repeated boilerplate rationales, or answer choices that are not meaningful clinical options. This is a known Gemini failure mode.
5. **Rationale ↔ key consistency.** Does `rationale.correct` actually justify the keyed answer? Does any `byChoice` entry contradict the key? (Cheap check, catches a lot.)
6. **Math.** Recompute every `fill_in_blank` numeric answer independently (dosage, IV rate, unit conversion). Confirm `numeric.value`, `unit`, and `acceptable[]` all agree with the recomputation.
7. **Clinical currency.** Flag anything resting on outdated guidance (e.g., resuscitation, sepsis, BP/glycemic targets, first-line drugs). NCLEX follows current standards.
8. **Scope of practice & delegation.** Is the keyed nursing action within RN scope? Are delegation/assignment items (RN vs LPN/UAP) correct? Common theme, common error.
9. **Framework alignment.** Priority/assessment items should respect ABCs, Maslow, nursing process (assess before intervene), and safety-first — and the keyed answer should win under the stated framework.
10. **Lab values / units / drug names** are standard and correctly stated.
11. **Topic-label quality.** Question-level `topic` should be a specific reusable clinical label, not a broad category/dashboard bucket. Repair obvious bad labels; otherwise flag for cleanup so coverage reports remain useful.
12. **Therapeutic communication / ethics / legal** items match accepted NCLEX conventions (the "most therapeutic" answer).
13. **Translation clinical fidelity.** Flag any `zh` that alters clinical meaning vs the `en` (negation flips, wrong drug/term, dose mistranslation). Minor stylistic differences are fine; meaning changes are not.
14. **Ambiguity / NGN integrity.** Unambiguous stem; `select_all` answer count is defensible; `matrix`/`ordered_response`/`dropdown_cloze` internal logic holds.

---

## 4. Verification methodology

- **Recompute, don't trust.** All arithmetic is redone from scratch.
- **Internal consistency first** (rationale vs key, byChoice vs key) — cheap, no network, high yield.
- **Adversarial distractor analysis** — actively argue *for* each distractor; if the argument holds, flag.
- **Web verification with citations** for clinical claims. Prefer authoritative sources (professional-society guidelines, established drug/clinical references, government health agencies). **Explicitly distrust nursing quiz-mill / cram sites** — they are low-quality and SEO-heavy, and are part of what produced bad questions in the first place. Record source URLs in the report.
- **Currency check** — note the guideline/standard the determination rests on.
- **Unverifiable → not PASS.** If a clinical claim can't be confirmed against a credible source, the verdict is FLAG/DISCARD, with the reason.

---

## 5. Verdict & report schema

One record per question in `audit/<file>.report.json`:

```json
{
  "questionId": "string (the stored question.id; use the source-prefixed id present in the bank)",
  "sourceFile": "banks-raw/gemini-2026-06-05.json",
  "verdict": "pass | fix | discard",
  "severity": "none | minor | major | critical",
  "confidence": "high | medium | low",
  "needsHumanReview": false,
  "issues": [
    {
      "type": "wrong_key | second_correct_answer | weak_distractor | rationale_key_mismatch | math_error | outdated_guideline | scope_of_practice | framework_violation | lab_or_drug_error | translation_meaning | ambiguous | other",
      "detail": "what's wrong, specifically",
      "sources": ["https://authoritative-source"]
    }
  ],
  "proposedFix": null
}
```

- `verdict: "fix"` → include `proposedFix` as a complete, schema-valid corrected question; apply it in `banks/`. **Only auto-fix mechanical/unambiguous errors** (math, a rationale typo, a clearly mis-keyed single-best-answer with a sourced correction). Anything requiring judgment → `verdict: "discard"` or `needsHumanReview: true`, not a silent rewrite.
- `needsHumanReview: true` → excluded from `banks/`, listed prominently in the `.md` report.
- The `.md` report leads with a **summary table: counts of pass / fix / discard / human-review per source file** — this is your at-a-glance signal for which models to keep trusting.

---

## 6. Guardrails

- **Never PASS on assumption.** Unverified clinical claim = flag/discard.
- **Prefer DISCARD over salvage** for low-confidence items; a rewrite can inject a new error.
- **Don't fabricate citations or corrections.** If you can't source it, say so.
- **Self-audit is low-signal.** A model auditing its *own* output shares its blind spots. The settled roles (Gemini often generates, Codex or another model reviews — §7) make every audit cross-model by default when possible; keep it that way and don't let a clean self-audit create false confidence.
- **`banks-raw/` stays immutable.**

---

## 7. Model roles (settled — based on observed economy)

The division of labor, as it shook out in practice:

- **Generation → model-agnostic raw drafts; Gemini only with guard rails.** Gemini has been useful for speed and token efficiency, but recent hard-case output showed brittle failure modes: placeholder distractors, generic per-choice rationales, broad/wrong topic labels, and occasional noncanonical shapes when prompted loosely. Treat Gemini as a raw draft generator, not a trusted item writer. Use small batches, the tightened generation prompt, immutable `banks-raw/` provenance, and strict cross-model review before any promotion. Other models can generate too; compare their audit failure rates rather than assuming Gemini is best.
- **Review → Codex or another non-generator reviewer.** Prior passes found both Codex and Claude Code efficient and high-catch-rate as content reviewers. *Why it fits:* review is bounded (the questions exist; the output is compact verdicts), so the same thoroughness that costs tokens in generation becomes an asset here.
- **Generator ≠ reviewer, always.** A model reviewing its own output shares its blind spots and is low-signal (see §6). If Gemini generates, Codex/Claude/human review; if another model generates, use a different reviewer.
- **Optional differential audit.** Run *both* reviewers over the same `banks-raw/` batch and compare: items they agree on are low-information, items they *disagree* on (one cures/discards, the other passes) are the genuinely ambiguous questions — the short list worth a human glance and the best signal on true catch-rate.

### Tiering within review (token economy)
Still worth a cheap-then-escalate split regardless of which reviewer runs it:
- **Cheap pass** handles §3 checks 2, 4, 5, 6, 11, 13–14 (placeholder scan / internal-consistency / math / topic labels / ambiguity — little or no external knowledge) and flags anything suspicious.
- **Escalate** flagged items + all checks needing clinical verification (1, 3, 7–10, 12) to a strong reasoning tier with web research or a qualified human.
- Since most items are good, only a small slice reaches the expensive tier.

---

## 8. Human backstop (outside this task)

LLM auditing reduces risk; it doesn't remove it. Recommend, outside the automated task:
- A nursing-knowledgeable human spot-checks, prioritizing **DISCARD-heavy sources** and **any FIX that changed a keyed answer**.
- Keep the AI-generated-content caveat handled outside the study UI, consistent with `PROJECT-HISTORY.md` and spec §11.
- If any source ever starts failing audit at a high rate, reconsider keeping it — auditing junk can cost more than generating quality. Gemini should remain conditional on observed pass/fix/discard rates, not treated as the default if it needs heavy cleanup.
