# RHYTHM-STRIP-AUDIT-SPEC.md

A curation audit of the 44 `rhythm_strip` items in `banks/visual-canonical.json`, promoted under the looser U0/U1-era gate. This is a **specialization** of `NCLEX_Audit_Spec.md` — that document's evidentiary standards (§4), hallucination guards (§5), Single-Question Concern format (§7), output constraints (§9), and batch discipline (§10) are **inherited verbatim**. This file overrides only the *categories*, the *verdict vocabulary*, and the *two-layer structure*, and supplies thresholds calibrated against a real Layer A run on 2026-06-13 (Appendix A).

Authority on conflict: `AGENTS.md` › `NCLEX_Audit_Spec.md` › this file.

Two facts shape everything below. First, this is overwhelmingly a **subtraction** job: the bank is structurally clean (bilingual parity 0 gaps, no pre-shuffle positional signature, no textual duplicates) but conceptually over-supplied (44 items vs a ~18–20 concept ceiling) and necessity-suspect (half the stems name the rhythm). Second, the policy is **cut over cure** — do not produce a pile of small patches.

---

## 1. Scope

- **In scope:** the 44 `rhythm_strip` items in `banks/visual-canonical.json` (44 < the 100-item session ceiling, so this runs as one session).
- **Out of scope:** the other 9 items in that bank, all other banks, and any schema/renderer change.
- **Goal state:** ≈18–20 reviewed items, ≥1 per can't-miss subtype, every retained item necessity-clean and free of positional-language hazards, with cuts weighted to relieve the over-served *Physiological Adaptation* category.

---

## 2. Two layers (deterministic core, capped semantic residual)

Per DECISIONS principle 3, the deterministic work carries no model tokens and the model pass is reserved for the irreducible semantic residual and capped.

### Layer A — deterministic (Codex; no model tokens)

Productionize the 2026-06-13 prototype (Appendix B is the script). It emits a per-item JSONL queue with these signals; calibrated meanings from the run in Appendix A:

| Signal | Definition | Use |
|---|---|---|
| `necessity_leak` | `stem.en` contains a telltale term for the item's subtype (regex map in Appendix B) | Flags the **necessity** Layer-B queue. **22/44** flagged. |
| `redundancy_group` | group size by `(subtype, itemType)`; ≥2 is a concept-repeat candidate | Flags the **redundancy** Layer-B queue. Text-similarity (Jaccard) is **not** used — it returned 0 because vignettes are reworded; group size is the correct proxy. |
| `positional_language` | `audit:references` zh+en regex over rationale/`byChoice`/strategy | **7/44** flagged, all Chinese (`以上`, `选项B/D`, `后者`). Mechanical **cure** candidates (or cut if also flagged elsewhere). |
| `mc_answer_position` | index of the correct option among MC options | **Informational only.** Run gave 9/5/12/5 — dispersed, no D-at-3% signature. **No shuffle finding; this check is excluded from the audit.** Recorded here so it is not re-litigated. |
| `parity` | every displayed field has non-empty `en` and `zh` | **0 gaps.** Pass; excluded. |

Layer A output is a deterministic JSONL manifest (one row per item: `id`, `subtype`, `itemType`, `category`, `flags[]`) plus a standalone **positional-language cure list**. No verdicts are assigned in Layer A.

### Layer B — capped semantic (one model; producer ≠ checker)

The reviewing model **must not** be a model that generated the rhythm batch (the `ekg_b*` items) — DECISIONS principle 2. It adjudicates **only the Layer-A-flagged items** (the ~30 union of the necessity and redundancy queues), one capped pass, under the inherited §4/§5 discipline (verbatim quotes, mandatory Alternative Interpretation, confidence justified in one sentence, no pattern extrapolation, no hedge findings).

Categories (replacing the parent spec's DC/AK/RI/SC/BD/OG set):

| Code | Category | Format |
|---|---|---|
| `NEC` | **Necessity** — with the rhythm named or derivable from the stem, does the item still require reading the strip? | Single-Question Concern (§7) |
| `RED` | **Redundancy** — within a `(subtype, itemType)` group, do these test the same concept? | Two-Question Finding (§6): Evidence A vs B |
| `OG` | **Outdated guidance** — a management item keyed to superseded ACLS/cardiac practice | Single-Question Concern (§7); requires a live-source check |

`NEC` is the headline. For each necessity-flagged item, the model decides among exactly three outcomes:
1. The strip carries a load-bearing finding *beyond* the named rhythm (rate, regularity, a morphology the answer hinges on) → **necessity holds → KEEP**.
2. The strip is redundant with the named rhythm and the answer is recall of management → **decorative → CUT**.
3. The item is otherwise strong, not a concept-duplicate, and a **single** stem-line edit removing the rhythm name restores necessity → **CURE** (the only sanctioned stem edit).

---

## 3. Verdict vocabulary (replaces FIX / REVIEW / DISMISS)

| Verdict | Meaning |
|---|---|
| `CUT` | Remove the item. The **default** verdict for any flagged item. |
| `CURE` | Keep with **at most one** mechanical fix: a single stem-line necessity edit *or* a zh positional-language reword. Never both, never more. |
| `KEEP` | Retain unchanged (necessity holds, not a concept-duplicate, no hazards). |
| `REVIEW` | Human expert judgment required before action (e.g. a contested clinical-currency call). |

**Cut-over-cure rule (hand to the implementing agent verbatim):** Default to `CUT`. An item earns `CURE` or `KEEP` only if *all three* hold — (a) the strip is load-bearing, or becomes so with one stem-line edit; (b) it is not a concept-duplicate of a stronger item in its subtype group; (c) its only remaining defect is at most one mechanical fix. Anything requiring more than that one fix is `CUT`, not patched.

**Tie-break when two items test the same concept** — keep the one that is, in order: necessity-clean → already source-reviewed (`rhy_*` smoke items outrank `ekg_b*` batch items) → *not* in *Physiological Adaptation*. Cut the rest.

**Can't-miss subtype protection.** Guarantee ≥1 retained item for each lethal/immediately-actionable rhythm — `vfib`, `vtach`, `asystole`, `avb_3` (complete heart block), `avb_2_mobitz2`, `svt`, `afib`. Trim hardest on the benign/common, over-supplied subtypes — `sinus`, `sinus_brady`, `sinus_tach`, `pvc` — where the run shows the worst concentration (e.g. five sinus-brady MCs).

---

## 4. Output (a proposal, not a canonical edit)

These items live in a **canonical** bank, which the agent does **not** hand-edit (canonical read-only; principle 15). Layer B emits a **cut/cure/keep manifest** — JSONL, one row per audited item:

```jsonc
{ "id": "ekg_b1_mc_04", "subtype": "sinus_brady", "verdict": "CUT",
  "category_code": "RED", "confidence": "HIGH",
  "reason": "concept-duplicate of rhy_sinus_brady_001 (recognize sinus brady → atropine); reworded vignette only",
  "evidence": "<verbatim stem/answer spans per §6/§7>" }
{ "id": "ekg_b2_mc_02", "subtype": "afib", "verdict": "CURE",
  "category_code": "NEC", "confidence": "HIGH",
  "reason": "stem names 'atrial fibrillation'; strip otherwise load-bearing for the irregularly irregular finding",
  "cure": { "field": "stem.en", "before": "...client in atrial fibrillation...", "after": "...client whose rhythm strip is shown..." } }
```

The reviewer loads the manifest IDs in the developer Review Console (`?dev=1`, `qids=`) to verify each verdict against the rendered item before acting. **Luke executes** the canonical deletions, the ≤1-per-item cures, the `BANK-REVIEW-LEDGER.md` entry, and `npm run census && npm run census:check` — the agent stops at the reviewed proposal. Deletion is safe on IDs: progress/flags/sessions key by `question.id` and simply drop removed keys (no dangling references).

A `CURE` manifest row that proposes more than one edit, or both a stem edit and a zh reword, is a spec violation — downgrade the row to `CUT`.

---

## 5. Whole-bank companion (cheap; do alongside)

Layer A confirmed `visual-canonical.json` was never in the Jun-09 positional-language sweep (it carries 7 uncleared zh hazards). Extend `audit:references` to include `visual-canonical.json` so the zero-tolerance gate covers it going forward — independent of this audit's cuts, and a one-line scope change. This is the narrow, deterministic slice of the broader "everything promoted before the current gate should pass the current gate" invariant.

---

## 6. Done criteria

- [ ] Layer A manifest + positional-language cure list generated deterministically and committed.
- [ ] Layer B reviewed only flagged items, by a non-producer model, under §4/§5 discipline; output sorted HIGH→MEDIUM→LOW per the parent spec.
- [ ] Every verdict is `CUT`/`CURE`/`KEEP`/`REVIEW`; no `CURE` carries >1 edit.
- [ ] Retained set ≈18–20, ≥1 per can't-miss subtype, necessity-clean, zero zh positional hazards; cuts relieve Physiological Adaptation.
- [ ] Manifest verified in the Review Console; Luke executes canonical deletions/cures + ledger + census.
- [ ] `audit:references` extended to `visual-canonical.json`; passes at zero.

---

## Appendix A — calibrated Layer A results (2026-06-13, 44 items)

- Subtypes: sinus_brady 6, afib 5, vtach 4, sinus_tach 4, svt 4, avb_1 3, avb_3 3, vfib 3, sinus 2, aflutter 2, avb_2_mobitz1 2, avb_2_mobitz2 2, pvc 2, asystole 2.
- Item types: MC 31, SATA 8, matrix 5. Difficulty: medium 28, hard 10, easy 6.
- Category: **Physiological Adaptation 32**, Pharmacological 10, Reduction of Risk Potential 2.
- Necessity-leak (stem names rhythm): **22** — `ekg_b1_mc_01, ekg_b1_sata_03, ekg_b1_mc_04, ekg_b1_mc_06, ekg_b1_sata_07, ekg_b1_matrix_09, ekg_b2_mc_02, ekg_b2_mc_04, ekg_b2_mc_05, ekg_b2_sata_06, ekg_b2_mc_08, ekg_b2_sata_09, ekg_b3_mc_04, ekg_b3_mc_06, ekg_b3_sata_08, ekg_b3_mc_09, ekg_b4_mc_02, ekg_b4_mc_04, ekg_b4_mc_05, ekg_b4_sata_07, ekg_b4_sata_09, ekg_b5_mc_02`.
- Redundancy groups (≥2, MC): sinus_brady 5 (`rhy_sinus_brady_001, ekg_b1_mc_02, ekg_b1_mc_04, ekg_b1_mc_05, ekg_b5_mc_02`), sinus_tach 3, afib 3, svt 3, vtach 3; avb_1/avb_2_mobitz1/avb_2_mobitz2/avb_3/pvc 2 each.
- Positional-language (all zh): **7** — `ekg_b2_mc_03` (以上), `ekg_b3_mc_04` (选项B), `ekg_b3_mc_07` (选项B), `ekg_b4_mc_03` (以上), `ekg_b4_mc_05` (以上), `ekg_b4_sata_07` (选项D), `ekg_b4_mc_08` (后者).
- MC answer position: 9/5/12/5 (dispersed; no shuffle finding). Bilingual parity: 0 gaps.

## Appendix B — Layer A signal definitions

The deterministic script run on 2026-06-13 (subtype counter; the per-subtype necessity-leak regex map; `(subtype,itemType)` grouping for redundancy; the `audit:references` zh/en positional regex; MC-position tally; parity check). Codex should reimplement these as a committed script that reuses `coverage-report.ts`'s counters and the existing `audit:references` regex, emitting the JSONL manifest in §4. The necessity-leak regex map and grouping logic are the only audit-specific additions; everything else already exists in the repo.
