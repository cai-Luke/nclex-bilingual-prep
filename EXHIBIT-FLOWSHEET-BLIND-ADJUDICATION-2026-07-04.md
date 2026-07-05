# Exhibit Flowsheet — Blind-Batch Adjudication

Date: 2026-07-04
Adjudicator: Claude (architect seat). Scope: semantic scoring of the blind extraction against the
held-back answer key — the layer the deterministic gate structurally cannot check.
Inputs: `EXHIBIT-FLOWSHEET-BLIND-EXTRACTION-2026-07-04.json` (extractor output),
`EXHIBIT-FLOWSHEET-BLIND-ANSWERKEY-2026-07-04.json` (held-back ground truth),
`EXHIBIT-FLOWSHEET-BLIND-CASES-2026-07-04.json` (source prose).
Companion to Codex's `EXHIBIT-FLOWSHEET-CODEX-TO-CLAUDE-2026-07-04.md` (gate ran clean: 12 records,
0 FAIL, 0 WARN on the blind set; 6 records, 0 FAIL, 0 WARN on smoke v2).

## Method

The gate already proved the structural layer: containment, sourceUnit recognition, serial shape,
dimensional sanity. It cannot check *selection* — whether the extractor keyed the current value vs a
prior one, stayed silent on out-of-scope analytes, tagged post-intervention rather than excluded, and
chose the serial lane when it should. That is what this adjudication scores.

Scoring is done by a committed, reproducible script — `scripts/exhibit-flowsheet-blind-score.ts`
(`npm run flowsheet-blind-score`) — which reads the on-disk extraction, answer key, and cases files
and exits non-zero on any discrepancy. It reuses the gate's `buildBlindIndex` so out-of-scope
presence checks run against the same NFC-normalized source the gate sees. It checks each record for:
keyed label+value set equality, keyed sourceUnit equality, excluded label+value+reason set equality,
post-intervention context tag set equality, serial-lane selection, and out-of-scope silence (each OOS
value must appear verbatim in the source prose **and** be absent from both panel and excluded — i.e.
the extractor stayed silent on a *present* value, not an absent one). The scorer was validated with a
negative control: four injected defects (a dropped exclusion, a wrong platelet sourceUnit, a
serial-lane flip, and an OOS leak) were all caught, so the clean pass is a real signal rather than a
vacuous one.

(Provenance note: the first pass of this scoring was run as a local throwaway comparison during
adjudication; it has since been committed as the script above so the go/iterate signal rests on disk
truth and is re-runnable, not on a transcript reconstruction. This closed a reproducibility gap Codex
correctly flagged.)

## Result: 12 / 12 exact match

| Exhibit | Bucket | Verdict |
|---|---|---|
| blind_01/triage-note | clean_woven | match |
| blind_02/postop-check | clean_woven | match |
| blind_03/clinic-recheck | clean_woven | match |
| blind_04/dehydration-update | prior_trend | match |
| blind_05/anemia-observation | prior_trend | match |
| blind_06/cellulitis-reassessment | unit_scale | match |
| blind_07/oncology-phone | unit_scale | match |
| blind_08/contrast-observation | serial | match |
| blind_09/viral-reassessment | serial | match |
| blind_10/postpartum-reassessment | post_intervention | match |
| blind_11/renal-lab-review | out_of_scope | match |
| blind_12/pneumonia-admission | mixed | match |

Every bucket the answer key was designed to exercise resolved correctly:

- **Prior/trend selection (blind_04, 05, 12):** current values keyed, superseded values routed to
  `excludedValues` with `reason: "prior"`. blind_04 correctly excluded the yesterday BP (118/72), the
  pre-vomiting HR (82), and last month's creatinine (0.8) while keying the current set. blind_05
  excluded the three-months-ago hemoglobin (11.4) and kept the current 8.9. blind_12 (mixed) excluded
  the outside-clinic BP (128/78) and last-year creatinine (0.9).
- **Unit-scale discipline (blind_06, 07, 12):** every CBC value keyed with its byte-exact source unit
  (`× 10³/µL`, `×10³/µL`, `/µL`) and a matching `unitAliases` entry. No canonical unit was stamped
  onto an unconverted value — the platelet-defect class from smoke batch 1 did not recur on unseen
  material. GATE 4 passed clean, meaning the source units were right (a wrong unit would have thrown
  the dimensional-sanity WARN).
- **Serial lane (blind_08, 09):** both correctly `skip_serial` with no arrays. blind_08 is a **non-BP**
  serial (creatinine at 0600/1400) and blind_09 a serial temp (1015/1130) — this is the case the
  generalized serial detector was built for, and the extractor selected the lane correctly on both.
- **Post-intervention (blind_10):** the post-labetalol BP (150/92) was keyed in the panel with
  `context: "post_intervention"` on both sbp and dbp, not excluded. This is the exact disposition Rule
  F was added to enforce, and it held on unseen material.
- **Out-of-scope silence (blind_11, 12):** all seven off-allowlist values in blind_11 (lithium, eGFR,
  albumin, CRP, osmolality, alkaline phosphatase, weight) and both in blind_12 (albumin, eGFR) appear
  verbatim in the source prose and were correctly omitted from both panel and excluded. The extractor
  stayed silent on present, clinically-salient values — the hardest discipline to hold, because the
  temptation is to capture everything that looks like a lab.

## Interpretation

This is the signal the blind batch existed to produce. The six smoke panels only proved the spec was
coherent on the material it was written against; a clean pass there was consistent with overfitting.
The blind set was generated by a different instance than the extractor (producer≠checker, extended),
with a designed trap distribution the extractor never saw. A 12/12 exact match on that material says
the extraction contract **generalizes** — the rules encode the actual decision boundaries, not the
idiosyncrasies of the smoke panels.

Combined with the gate running clean (0 FAIL, 0 WARN) and the negative-control confirmation that both
the gate and this scorer catch injected defects, the evidence supports proceeding.

## Recommendation: GO for staged migration artifacts (not straight to canonical/render)

The scope of this GO is deliberately bounded. It authorizes producing **staged migration artifacts** —
structured flowsheet extractions, gated and sample-adjudicated, held as their own files — for the 232
mechanically-recoverable panels. It does **not** authorize writing those flowsheets into canonical
banks or wiring them into the rendered UI. The supplement-vs-replace decision (does the flowsheet
sit alongside the prose exhibit as an additive structured view, or replace/augment the rendered
exhibit, and under what schema shape) is a separate product pass that must clear its own gate before
any canonical or render work. Staged artifacts are cheap to discard; canonical writes and render
changes are not.

Proceed to produce staged extraction artifacts with these conditions carried forward:

1. **The gate is a required promotion step, not an advisory one.** Every migrated batch runs through
   `exhibit-flowsheet-gate.ts`; any FAIL blocks the artifact. GATE 4 WARNs route to human
   adjudication (they can be a real extreme value or a unit mismatch — the gate cannot tell, by
   design).
2. **Producer≠checker holds at scale, with a concrete sample policy.** The model that extracts a
   batch never gates or scores its own output. Concretely, for the staged run:
   - **Batch size:** 20 panels per batch (≈12 batches across the 232). Small enough that a
     systematic defect surfaces within one batch and is caught before it propagates; large enough to
     keep the gate/adjudication loop economical.
   - **Random adjudication rate:** 25% of the extract-lane panels in each batch (≈5 of 20), drawn by
     a seeded random pick recorded in the batch's adjudication note, scored against a per-batch
     answer key authored by the generator (not the extractor).
   - **Always-sampled categories (100%, on top of the random draw):** every GATE 4 WARN; every
     `skip_serial` record; every panel whose keyed `sourceUnit` is a non-canonical alt unit (the CBC
     `/µL`, `×10³/µL`, `K/µL` cases — the platelet-defect class); every `post_intervention` context
     tag; and every record carrying an `excludedValues` entry (the prior/trend selection call). These
     are the buckets where a miss is both most likely and most costly, so they are never left to the
     random draw alone.
   - **Stop rule:** any batch whose adjudicated sample shows a selection error (wrong current-vs-prior
     key, an OOS leak, a mis-tagged post-intervention, or a wrong serial-lane call) halts the run;
     the batch is re-extracted after the cause is understood, and the always-sampled set is widened
     if the error class isn't already covered.
3. **GATE 2 stays advisory.** Its source sweep is heuristic (free-prose tokenizing), so completeness
   remains a human-owned check on the adjudication sample, not a gate guarantee. Do not promote GATE 2
   to FAIL on the strength of this result.
4. **The shared allowlist module lands before the real migration, or very early.** The gate currently
   hand-mirrors `VITAL_DEFS`/`ANALYTE_DEFS`; at 232-panel scale the drift risk between the gate's
   table and the registries is real (a registry edit that doesn't reach the gate would silently
   change what passes). Extract `measurementAllowlist.ts` as the single source both the renderers and
   the gate import (proposal Rule A follow-on), with a drift-guard test asserting equality. This is
   the first build item, ahead of the staged run — speced separately for Codex.

One caveat on scope of the claim: this validates the *deterministic extraction + gate* path on the
mechanically-recoverable panels (232/242 ≈ 96%). The ~10 panels the containment probe could not
mechanically recover are out of scope here and remain a separate, smaller manual-adjudication lane —
they were never expected to flow through this pipeline.

## Status

- Smoke batch 1: adjudicated (`EXHIBIT-FLOWSHEET-SMOKE-ADJUDICATION-2026-07-04.md`), 2 defects folded
  into the contract (sourceUnit + GATE 4; Rule F).
- Smoke batch 2: gate clean, both targeted regressions (platelet sourceUnit, post-intervention BP)
  confirmed fixed.
- Blind batch: 12/12 exact match against held-back key, scored by the committed
  `scripts/exhibit-flowsheet-blind-score.ts`. **GO for staged artifacts** (not canonical/render).
- Next, in order: (1) shared `measurementAllowlist.ts` module + drift-guard test; (2) a small
  real-bank migration batch (20 panels) through the same gate + sample-adjudication loop; (3) the
  supplement-vs-replace product pass before any canonical/render work.
