# Handoff to the Claude Architect — Gemini as an Audit Lane: Quality Finding

**Date:** 2026-06-26
**From:** Claude Code (Phase B coherence merge) + Luke (adjudication)
**Re:** Reliability of routing adversarial-audit work to Gemini in the multi-model
review design
**Status:** Advisory. No architecture change made; this is a recommendation for the
planning seat.

## TL;DR

In the Phase B coherence audit, all three lanes (Claude 81 pairs, Codex 6, Gemini
46) converged on **0 contradictions / all DISMISS**, and Luke concurs with every
dismissal. But **convergence on the outcome hid a large quality gap.** The Gemini
lane reached the right answer via a low-rigor sweep whose written reasoning could
not be trusted on its face — Luke had to independently re-research the flagged
items to verify them. The Claude and Codex lanes produced pair-specific,
verbatim-evidenced reconciliations that stood on their own. **Recommendation:
stop treating Gemini as a peer audit lane; keep it (if at all) only for the
irreducible producer-clean residual, and gate its output on pair-specific
evidence.**

## What the outcome was vs. what the work was

- **Outcome (trustworthy):** 0 contradictions across all 104 slice pairs. Verified
  three ways — Gemini's verdicts, Claude's independent lane (which re-examines
  several of the same items, e.g. `trad_batchD_08/10/20/24`, `gemini_d8_10`, the
  `claude_moc_hipaa_breach_hl_b03` items, and reaches the same call), and Luke's
  manual re-research.
- **Gemini's work product (not trustworthy on its face):** the lane reached the
  verdict without demonstrating the reasoning that justifies it.

## Evidence — the specific failure mode

The Gemini findings file (`lanes/gemini.findings.md`) has a three-part per-pair
structure: *Item A teaches* / *Item B teaches* / *Reconciliation* → *Verdict*.

1. **The "Reconciliation" field is templated boilerplate, identical across all 46
   pairs.** Part A pairs all read verbatim: *"Both items are highly consistent and
   clinically accurate. There is no overlap in clinical decision-making that leads
   to a contradiction. They either address different aspects of a clinical scenario
   or teach complementary, standard NCLEX principles."* — pasted into a dose-calc
   pair, a HIPAA pair, and a wound-staging pair alike.

2. **Part B is worse: the boilerplate references *other pairs' content* inside
   every pair.** All 15 Part B reconciliations contain the same block citing
   *"pressure injury staging and prevention (Pairs 9–15)"* and *"MI management
   (Pair 8)"* — even in Pair 2 (`cs_ckd_01_q3` AV-fistula care × `trad_batchD_08`
   early-shock signs), which has nothing to do with pressure injury or MI. The
   reconciliation text was not generated per pair; it was stamped.

3. **The "teaches" lines are real, but the coherence *judgment* is the boilerplate
   step.** The per-item summaries are accurate. But the audit's actual deliverable
   — *did these two items contradict, and what reconciliation was tested?* — is
   exactly the field that was templated. So the lane provides no evidence that
   pair-specific contradiction-testing occurred.

4. **Contrast — Codex lane** (`lanes/codex.phaseB.findings.md`): pair-specific,
   quotes the keyed rule and the EN **and** ZH rationale verbatim, names why the
   shared cluster label is a routing artifact vs. a real shared decision. **Claude
   lane** (`lanes/claude.phaseB.findings.md`): per-cluster reconciliations naming
   the specific aligned rule (e.g. "stop transfusion first, NS via new tubing";
   "lithium toxic >1.5, fluid-restriction keyed as distractor"). Both are
   self-verifying; Gemini's is not.

## Why this matters to the architecture

The house design leans on **cross-model review with producer≠checker** (principle
2): the model that generated a batch never reviews it. That rule sometimes forces a
*third* model when both Claude and GPT are conflicted on a pair. In Phase B, that
residual was tiny — of 104 pairs, only **2** genuinely required a third reviewer
(the Part A `hipaa_disclosure` pairs where the Claude end and the GPT end are both
producer-conflicted); the other 15 Gemini-routed pairs were `needs-provenance`
advisory pairs that Luke adjudicates **regardless** of the model verdict.

So Gemini's *irreducible* structural value here was ~2 pairs, and even those got
re-researched by hand. The cost — a sweep that reads as rigorous but isn't, and
forces human re-verification — outweighs the benefit. Luke's standing position:
**inherent mistrust of Gemini for any audit role.** Treat that as a design
constraint, not a one-off reaction.

## Options for the architect (pick / refine)

1. **Demote Gemini from peer auditor.** Do not route content-judgment audit lanes
   to Gemini. Prefer reshaping the producer-clean problem so Claude or Codex can
   cover it — e.g. lean on the Opus prose-only carve-out (principle 22) and the
   gpt5/Codex carve-out so the third-model residual approaches zero.

2. **If Gemini must cover an irreducible residual, gate its output.** Reject any
   Gemini audit row whose `finding`/reconciliation is not pair-specific and does
   not quote the keyed rule (EN+ZH). A templated reconciliation = automatic
   re-review, not a dismiss. Cheaper to enforce as a lint than to re-research by
   hand.

3. **Keep Gemini only for deterministic / null-heavy routing, never for the
   contradiction call.** It can enumerate candidate pairs; the coherence verdict
   should come from a model whose output is self-verifying.

4. **Always pair a Gemini lane with a mandatory human re-research budget** and
   record that cost, so the "it agreed" signal is never mistaken for "it was
   rigorous."

Recommended default: **Option 1 + Option 2 as the fallback** — design the residual
toward zero, and if a Gemini pair is unavoidable, gate it on pair-specific
evidence.

## Artifacts

- Merged report: `ADVERSARIAL-AUDIT-FINDINGS-2026-06-25.md`
- Merged manifest: `audit/early-bank-semantic/coherence/ADVERSARIAL-AUDIT-2026-06-25.manifest.jsonl` (266 rows, all DISMISS, `needsHumanReview` 0)
- Lane files: `lanes/{claude,codex,gemini}.phaseB.*` (Gemini's are `lanes/gemini.{findings.md,manifest.jsonl}`)
- Slice: `audit/early-bank-semantic/coherence/2026-06-25-phaseB.slice.json`
