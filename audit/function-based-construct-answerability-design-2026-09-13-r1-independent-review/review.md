# Combined construct/answerability instrument — independent design review

**Reviewing seat:** Claude/Opus, cold, independent of the Codex/GPT-6 design seat.
**Producer:** `codex/overnight-instrument-2026-09-13`, commit `6f1ae02`, baseline `511f66b`.
**Scope:** Specification review only. No execution authorized by this review, consistent with the design's own explicit non-authorization.

## Method

I read `SPEC.md` in full (188 lines, 10 sections) and cross-checked it directly against the two prior lanes I had already reviewed in depth this session (Matrix-first coherence, N-01 calibration), since the design explicitly claims to synthesize their lessons rather than merely cite them.

## Does it correctly replace, not repeat, the named stale methods?

- **Terminal-sentence census** — replaced. Authorial-language judgment (§5.F, class 7 `AUTHORIAL_COMPENSATION`) is explicitly function-based per P21 ("wording is judged by function, not a blacklist"), not positional.
- **Stale Layer-B ablation** — replaced. §1 explicitly states the design "does not rerun that ablation or convert its PASS/FAIL labels," substituting whole-parent/rendered-task inspection.
- **Construct-ring logic (July inner/outer)** — correctly scoped as historical mechanism controls, not reopened work; P31's reconciliation is bound as provenance only, consistent with my own Section 4 ruling that P31 decides no current routing question.
- **Bowtie answerability** — §5.C's token support/competition requirement matches the bowtie census's own finding (exact key agreement ≠ proof of support) precisely, not just by name.
- **Producer-vocabulary/authorial leakage** — folded in with an explicit warning against treating a green mechanical gate as a semantic census, matching what the standing gates actually guarantee (structural, not exhaustive).
- **Visible-context answerability (N-01)** — this is the strongest test of whether the design actually learned something. I independently verified in Section 6 that N-01's three real instrument conflicts were I1 (established input vs. disclosure), I2 (quoted proposition vs. verified fact), I3 (pre-labeled summary vs. legitimate context). This design's §5.B (premise-role taxonomy: `SCENARIO_GIVEN` / `CANDIDATE_PROPOSITION` / `CONDITIONAL_RULE` / etc., with "a proposed report cannot certify that its patient event happened" stated explicitly) and §5.E (the reproducible remove-the-conclusion-and-check-if-still-derivable test) are not restatements of N-01's ambiguous V1 wording — they are the same concrete fixes N-01's own V2 proposal already converged on, integrated correctly, not just gestured at. §6's precedence table explicitly guards against the same conflation (class 1 "missing patient premises use classes 3–5"; class 3 "mere corroboration is a secondary note, not this class").

## Coverage of the 11 requested mechanisms

All 11 are present with specific, testable operational definitions rather than bare labels: authorial compensation (class 7), answer disclosure (class 6, tied to the step-E removal test), unsupported premises (class 5), noncompeting alternatives (§5.F + class 8), arbitrary serialization (§5.C's partial-order/topological-order test + class 8), mechanical cloze dependency (§5.C + class 8), meaningless calculation (class 8), overly specialist constructs (class 8, requires sourced justification for a "beyond entry-level nursing" claim), hidden case dependency (class 3, verbatim match to bowtie-census terminology), visible-context insufficiency (classes 3–5, the full N-01 apparatus), and bilingual proposition divergence (class 2, explicitly excluding "cosmetic translation preference" to avoid false positives — the same false-positive risk I saw the temperature lane handle correctly in Section 2).

## Concerns

1. **Complexity-to-reliability risk, unaddressed.** This instrument is substantially larger than N-01's V1 (10 primary classes, ~15 secondary mechanisms, a 3-stage blind/reveal/reconcile packetization protocol per leaf, an explicit exposure log). N-01's much simpler V1 produced an 11/41 (27%) instrument-conflict rate on its own calibration. A denser instrument is not automatically less reliable — more precise definitions can reduce disputes — but the design does not itself require *quantifying* inter-pass or producer/checker agreement; §7's admission conditions ask only for a qualitative "no unresolved dispute," a binary bar rather than a measured rate the owner can compare across future calibration rounds.
2. **Execution cost is out of scope here but worth flagging for whoever authorizes a tranche.** Whole-parent packetization plus a 3-stage reveal protocol per leaf is expensive at the 2,553-leaf scale eventually implied. The design correctly declines to size or authorize that; I am only noting it so a future sizing decision isn't surprised by it.

Neither concern is a design defect that invalidates the instrument — both are refinements to how its own admission gate reports results, not to the taxonomy or procedure itself.

## Ruling

**`ACCEPT_WITH_AMENDMENTS`**

Amendment 1 (required before any calibration execution): the §7 admission conditions should report a *quantified* agreement rate between the two producer passes, and between producer and checker, per calibration parent and in aggregate — not only a pass/fail "no unresolved dispute" statement. This costs nothing extra to compute (the two passes and the checker pass already exist under the current design) and gives the owner a comparable signal across calibration rounds, including whether a future V2-of-this-instrument is converging or regressing.

Amendment 2 (advisory, not blocking): when a future commission sizes an execution tranche, it should budget explicitly for the packetization/reveal cost per leaf rather than assuming N-01/Matrix-lane throughput, since this instrument's per-leaf protocol is heavier than either precursor's.

With those two amendments, this design is ready to govern the N-01 recalibration I already ruled for in Section 6 (same 8 frozen parents, bounded ≤4-parent/≤12-leaf contrast set) and any subsequent tranche a future commission authorizes. No execution is authorized by this review.

`FUNCTION_BASED_CONSTRUCT_ANSWERABILITY_AUDIT_SPEC_REVIEW_COMPLETE`
