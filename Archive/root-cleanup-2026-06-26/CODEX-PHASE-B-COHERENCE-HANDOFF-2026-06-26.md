# Codex Phase B Coherence Handoff — 2026-06-26 (Step 2: the 6 gpt-5 pairs)

This dispatches **Step 2** of the Phase B coherence audit
(`PHASE-B-COHERENCE-HANDOFF-2026-06-25.md`, rev. 2). Claude Code has completed
Step 1 (slice validation + lane dispatch) and Step 3 (its own 81-pair lane, 0
contradictions). Your lane is the **6 `reviewer == "gpt-5"` pairs**.

## Why you (producer basis)

Every pair in your lane is `claude × gemini` — **GPT-5 produced neither end**, so
producer≠checker (principle 2) is satisfied at the model level. This is **flag-only**
advisory output for Luke's adjudication; you never mutate canonical content.

## Input — your assignment file (consume this, don't re-derive)

`audit/early-bank-semantic/coherence/lanes/codex.phaseB.assignments.jsonl` — 6 rows,
one per pair. Each row carries both items' `id` / `bank` / `path` / `producer` /
`itemType` / `harm_rank`, the `clusters`, and the `pairId`. The slice these were
drawn from (`2026-06-25-phaseB.slice.json`) is authoritative and already validated;
do not regenerate it.

## The 6 pairs (audit unit = the pair)

| # | A (claude-produced) | B (gemini-produced) | cluster | note |
|---|---|---|---|---|
| 1 | `claude_a_sata_tracheostomy_09` (select_all) | `trad_batchD_08` (select_all, early-shock signs) | dialysis_complications | likely NULL-COHERENCE (trach care vs shock assessment) |
| 2 | `claude_a_sata_tracheostomy_09` | `trad_batchD_10` (select_all, CVC/CRBSI bundle) | dialysis_complications | likely NULL-COHERENCE |
| 3 | `claude_a_sata_tracheostomy_09` | `trad_batchD_20` (select_all, fluid-volume excess) | dialysis_complications | likely NULL-COHERENCE |
| 4 | `claude_a_mc_postpartum_fundus_41` (multiple_choice) | `gemini_jun05_a_mc_pph_priority_32` (multiple_choice) | fetal_heart_rate | **genuine shared decision** — boggy postpartum fundus: spend evidence budget here |
| 5 | `claude_moc_hipaa_breach_hl_b03` (highlight) | `gemini_gap_hl_hipaa_03` (highlight) | hipaa_disclosure | **shared decision** — what constitutes a confidentiality breach |
| 6 | `claude_moc_hipaa_breach_hl_b03` | `gemini_hl_moc_hipaa_03` (highlight) | hipaa_disclosure | **shared decision** — HIPAA breach identification |

`claude_moc_hipaa_breach_hl_b03` recurs in #5 and #6 — read it once, judge each
pair independently. The `fetal_heart_rate` label on #4 is a routing tag; the items
are postpartum-hemorrhage / fundal-massage MCQs.

The highest-signal pair is **#4**: both items present a boggy/displaced postpartum
fundus and ask the priority action. Verify the keyed priority (the expected answer
is **massage the fundus first**; "notify provider" / "empty bladder" / "document"
are the standard distractors) is consistent across both items, and that neither
keys a rule the other negates. The HIPAA highlight pairs (#5/#6) anchor on **NY-RN**
jurisdiction — a divergence that is merely NY-vs-other-state is `source_check`,
not `DC`.

## Method (per pair) — same as all Phase B lanes

1. Retrieve both items in full (stem, options, key, rationale EN + ZH; for any case
   leaf, the parent exhibits/stage). For highlights, the keyed spans are the answer.
2. Identify the shared clinical decision, if any. None → `findingRef: NULL-COHERENCE`,
   one line.
3. State each item's keyed rule + the rationale sentence carrying it.
4. Test the strongest reconciliation (acuity / level / stage / route / closed-world
   order / jurisdiction) **before** filing.
5. File `DC` only if a genuine contradiction survives — same decision, mutually
   exclusive keys. State both keyed rules verbatim (EN + ZH) and why they cannot
   both hold. Provide the Strongest Alternative Interpretation.
6. A `DC` defaults to `verdict: REVIEW` + `needsHumanReview: true` (which side is
   wrong is Luke's call) unless a **dated authoritative source** (body + year + value
   + URL) proves one side wrong → then `FIX`. NY-RN jurisdictional divergence →
   `source_check`. Otherwise `DISMISS` / `keep`.
7. Check EN and ZH independently. Return no finding when the pair is coherent —
   do not manufacture output (precision over volume).

**Read first (in order):** `AGENTS.md` →
`Archive/root-specs-2026-06-18/NCLEX_Audit_Spec.md` (Finding §6 / Concern §7,
evidentiary §4, hallucination §5) → `Archive/early-bank-semantic-audit-spec.md` →
`adversarial-audit-phase-a-pilot-spec.md` (severity §3, citation §4, **manifest §5**)
→ `NCLEX-Question-Schema.md` → the banks.

## Output — two lane-scoped files (write only these)

**1. Report:** `audit/early-bank-semantic/coherence/lanes/codex.phaseB.findings.md`

Start with the standard session header:

```text
AUDIT SESSION HEADER
====================
Session ID        : 2026-06-26-phaseB-Codex-Coherence
Reviewing Model   : [exact model + version]
Producer basis    : GPT-5/Codex produced neither end of all 6 pairs (claude × gemini); producer≠checker satisfied. Advisory for Luke's adjudication.
Pairs in scope    : 6 (the reviewer == "gpt-5" pairs of 2026-06-25-phaseB.slice.json)
Categories        : DC primary; RI/AK/BD/arith only where they block the coherence call
Total findings    : [N]  (HIGH [n] / MEDIUM [n] / LOW [n])
No-finding pairs   : [list]
```

For each filed finding: both IDs + banks + paths; verbatim EN+ZH keyed rules; the
specific incompatibility; dated source if claiming one side wrong; Strongest
Alternative Interpretation; severity + confidence + verdict. Then the explicit
no-finding / NULL-COHERENCE pair list.

**2. Manifest:** `audit/early-bank-semantic/coherence/lanes/codex.phaseB.manifest.jsonl`

One row **per item per pair** (so 6 pairs = **12 rows**), pilot §5 schema exactly —
all 17 fields on every row, every line parsing:

```json
{"itemId":"","parentId":null,"bank":"","path":"","itemType":"","pairId":"","categoryCode":"DC","severity":"none","confidence":"HIGH","verdict":"DISMISS","recommendedAction":"keep","needsHumanReview":false,"finding":"","evidence":"","source":null,"reviewingModel":"<model>","findingRef":"NULL-COHERENCE"}
```

- `pairId` = the partner item's id. `parentId` = case-container id for leaves, else `null`.
- `findingRef` = `NULL-COHERENCE` for no-shared-decision; `DC-01`-style tying the
  two rows of a filed contradiction.
- Emit a row for **every** item in **every** pair, including dismissals.

## Prohibited / scope

- Do not edit any file beyond your two lane outputs; no ledger / census / history /
  status / canonical writes. Findings-only, as Phase A.
- Do not broaden beyond the 6 pairs; do not re-audit other lanes.
- Do not cite another question bank, prep site, or model output as clinical authority.

When you finish, Claude Code runs **Step 5** (merge) once the Gemini lane (already
complete) and your lane are both on disk.
