# ADVERSARIAL-AUDIT-FINDINGS-2026-06-25.md

# Phase B Coherence Audit — Merged Findings (3 lanes)

Relational **coherence** audit of the candidate pairs in
`audit/early-bank-semantic/coherence/2026-06-25-phaseB.slice.json`
(**104 pairs / 93 items**), dispatched across three producer-clean review lanes.
The audit unit is the **pair**; the only filing category is `DC` — two items
teaching **mutually contradictory** rules/keys for the same clinical decision.

**Bottom line: 0 contradictions across all 104 pairs.** Every pair resolves to a
coherent shared-decision `DISMISS` or a `NULL-COHERENCE` no-shared-decision
dismissal. No canonical content was mutated; all lanes are flag-only and advisory.
Luke has independently reviewed all three lanes and concurs with the dismissals.

## Lane roll-up

| Lane | Reviewer | Pairs | Rows | Findings | Verdict |
|------|----------|-------|------|----------|---------|
| Claude Code | claude-opus-4-8 | 81 (gemini×gemini 40 / gpt×gpt 30 / gemini×gpt 11) | 162 | 0 | all DISMISS |
| Codex | gpt-5-codex | 6 (claude×gemini) | 12 | 0 | all DISMISS |
| Gemini | gemini-3.5-flash | 46 (31 Part A + 15 Part B; spans the slice's 2 gemini + 15 needs-provenance) | 92 | 0 | all DISMISS |
| **Merged** | — | **104 unique** | **266** | **0** | **all DISMISS** |

Producer≠checker (principle 2) holds at the model level for every model-reviewed
pair; the 8 Part B `mixed×gemini` pairs (Gemini partial-producer) and the 2 Part A
hipaa pairs were additionally adjudicated by Luke at the human level. Merged
manifest: `audit/early-bank-semantic/coherence/ADVERSARIAL-AUDIT-2026-06-25.manifest.jsonl`
(266 rows, 17 fields each, every line parses, `needsHumanReview` = 0).

> **Process note for the architect.** Convergent dismissal does **not** imply the
> three lanes were of equal quality. The Gemini lane reached the correct outcome
> but via a low-rigor sweep that required independent human re-research to trust;
> the Claude and Codex lanes produced pair-specific, verbatim-evidenced
> reconciliations. See the dedicated handoff
> `Archive/root-cleanup-2026-06-26/CLAUDE-ARCHITECT-GEMINI-AUDIT-QUALITY-HANDOFF-2026-06-26.md`.

---

## Lane 1 — Claude Code (81 pairs)

```
AUDIT SESSION HEADER
====================
Session ID        : 2026-06-25-phaseB-Claude-Coherence
Reviewing Model   : Claude Opus 4.8 (Claude Code)
Producer basis    : Claude produced neither end of any pair (gemini×gemini 40, gpt×gpt 30, gemini×gpt 11); producer≠checker satisfied. Flag-only.
Pairs in scope    : 81 (reviewer == "claude")
Total findings    : 0  (HIGH 0 / MEDIUM 0 / LOW 0)
NULL-COHERENCE pairs : 11   Coherent shared-decision DISMISS : 70
```

The 11 gemini×gpt cross-bank pairs (the only place two independently-produced
banks meet on a shared decision) all reconcile: chest-tube disconnection (water
seal first), transfusion reaction (stop first, NS via new tubing), post-cath
assessment (expanding hematoma / perfusion deficit → intervene), pressure-injury
staging, and the HIPAA case. Within-bank clusters (digoxin, lithium, stroke-rehab,
HIPAA, dialysis, pressure injury, the mis-tagged FHR/PPH case family) key mutually
consistent rules or test different decisions entirely. Full detail and the explicit
NULL-COHERENCE list: `lanes/claude.phaseB.findings.md`.

---

## Lane 2 — Codex (6 pairs)

```
AUDIT SESSION HEADER
====================
Session ID        : 2026-06-26-phaseB-Codex-Coherence
Reviewing Model   : GPT-5 / Codex
Producer basis    : GPT-5/Codex produced neither end of all 6 pairs (claude × gemini); producer≠checker satisfied. Advisory.
Pairs in scope    : 6 (reviewer == "gpt-5")
Total findings    : 0  (HIGH 0 / MEDIUM 0 / LOW 0)
```

Three `claude_a_sata_tracheostomy_09 × trad_batchD_*` pairs are NULL-COHERENCE
(tracheostomy care vs early-shock / CVC-bundle / fluid-excess signs — shared
cluster label is a routing artifact). The boggy-fundus pair
(`claude_a_mc_postpartum_fundus_41 × gemini_jun05_a_mc_pph_priority_32`) and the
two HIPAA highlight pairs (`claude_moc_hipaa_breach_hl_b03 × gemini_*hipaa_03`)
share a genuine decision and key it consistently (fundal massage priority; breach
identification under NY-RN scope). Pair-specific evidence with verbatim EN+ZH in
`lanes/codex.phaseB.findings.md`.

---

## Lane 3 — Gemini (46 pairs — Part A 31 + Part B 15)

```
AUDIT SESSION HEADER
====================
Session ID        : 2026-06-25-Gemini-Coherence-CrossProduct
Reviewing Model   : Gemini 3.5 Flash
Producer basis    : Part A — Gemini non-producer for both ends of 31 pairs (claude_* × gpt_*); producer≠checker satisfied. Part B — advisory; 15 provenance-ambiguous pairs (8 mixed×gemini, 7 clean), adjudicated by Luke.
Pairs in scope    : 46 (covers the slice's 2 gemini routing pairs + 15 needs-provenance pairs)
Total findings    : 0  (HIGH 0 / MEDIUM 0 / LOW 0)
```

Gemini dismissed all 46 pairs. The outcome was independently confirmed — Luke
re-researched the flagged items and the overlapping items recur in the Claude lane
with the same call. **Quality caveat:** the lane's per-pair "Reconciliation" field
is templated boilerplate (identical text across all pairs, citing unrelated pairs'
content), so it does not by itself evidence pair-specific contradiction-testing.
Detail: `lanes/gemini.findings.md`; quality analysis in the architect handoff.

---

## Disposition

All 104 pairs → `recommendedAction: keep`. No canonical writes; no ledger / census
/ history mutation in this pass (the post-pass human bookkeeping step is Luke's, as
in Phase A). Phase B coherence audit is **closed with zero contradictions**.
