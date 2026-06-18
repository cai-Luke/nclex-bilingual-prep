# REGENERATION + OMISSIONS + REVIEW-LAYER SPEC

Closing spec for the case-completion branch. Three independent parts:
- **A.** Regenerate the below-floor cases (the R1 set), with a triage gate so duplicates/filler are retired rather than rebuilt.
- **B.** Close the P2 branch by logging the two skeleton omissions.
- **C.** Adopt Gemini as a review layer (GPT becomes the baseline generator/compiler).

Decisions already settled: forward target = **6 embedded items mapping to the 6 distinct NCJMM steps** (+ sibling bowtie when authored); retroactive tolerance = **4–6** (so the 74 tolerated cases are left as-is). Source: `audit/case-completion/layer-a.json`.

---

## A. Regeneration of the below-floor cases

The sweep found **13 R1 cases** (below the 4-floor, no usable skeleton). Generation is effectively free (Opus/GPT harnesses don't bill usage); the real cost is the promotion gate (a few Claude tokens) and the clean purge/replace. So the constraint is reviewer attention, not generation — which means a **triage gate first** so we don't spend review cycles rebuilding cases that should be retired or merged.

### A.1 Per-case flow

1. **Extract topic** — read the compiled case (title, summary, surviving items, exhibits) and draft an Opus premise capturing the clinical scenario. Light LLM task (Gemini or Claude drafts; it *describes*, edits nothing). Confirm the premise reflects the case before proceeding.
2. **Triage (the new gate)** — classify each R1 case:
   - **Regenerate** — concrete, unique, worth a full 6-step case.
   - **Consolidate** — duplicates/overlaps an existing case on the same topic; rebuild one canonical version and retire the rest.
   - **Retire** — too vague to support six distinct NCJMM steps, or redundant with stronger existing cases; purge, do not rebuild.
3. **Author** — Opus authors a fresh skeleton with **6 DPs, one per NCJMM step** (no skill repeats — the sharpened target; see §C and the architecture note from the reconciliation review). Optional bowtie if the case supports a clean 1/2/2.
4. **Compile** — GPT compiles (per §C), emitting `_compileManifest`.
5. **Review** — Gemini review layer (§C), then Claude promotion gate (schema, selfCheck, bilingual parity, answer unambiguity, faithfulness, source-check for any currency-flagged claims).
6. **Promote** — shuffle, audit, census recount, ledger update.
7. **Purge + replace** — remove the old case from its bank via the deterministic path (load → filter out old id → insert new → serialize), never a hand-edit. **Reuse the original top-level `case_id`** so any references/progress keyed to it survive; embedded `_qN` ids will be new (per-item progress on the old stub resets — acceptable, the case is being rebuilt). Regenerated cases land at current schema (**1.5**), upgrading these 1.2 legacy stubs as a side benefit, and route to the lane of whoever compiles (`gpt-`).

### A.2 Triage applied to the 13 (proposed; confirm at execution)

**Regenerate (9) — classic hard-case topics, concrete and unique:**

| case_id | bank | items | topic |
|---|---|---:|---|
| `case_burns_01` | hard-cases | 2 | severe thermal burns |
| `case_celiac_01` | hard-cases | 2 | celiac / chronic diarrhea |
| `case_cirrhosis_01` | hard-cases | 3 | cirrhosis + esophageal varices |
| `case_gbs_01` | hard-cases | 2 | Guillain-Barré |
| `case_pe_01` | hard-cases | 3 | pulmonary embolism |
| `case_pph_01` | hard-cases | 2 | postpartum hemorrhage |
| `case_stroke_01` | hard-cases | 3 | ischemic stroke |
| `cs_aki_01` | hard-cases | 3 | acute kidney injury |
| `cs_panc_01` | hard-cases | 2 | acute pancreatitis |

**Consolidate (2 → 1):**

| case_id | bank | items | note |
|---|---|---:|---|
| `hl_smoke_2026_06_14_case_postpartum_preeclampsia_03` | gpt-canonical | 2 | postpartum-preeclampsia smoke artifact (promoted) |
| `case_postpartum_preeclampsia_highlight_01` | banks-raw (smoke2) | 2 | raw smoke artifact, never promoted |

→ Rebuild **one** postpartum-preeclampsia-with-severe-features case; purge the canonical `hl_smoke_...03`, discard the raw smoke2 file. Verify the rebuild is distinct from `case_preeclampsia_magnesium_01` (tolerated, 4 items) — that one centers on magnesium therapy/toxicity; keep the rebuild on recognition/severe-features so they don't collide.

**Retire (2) — vague gemini filler, overlaps concrete post-op cases already in the bank** (`cs_hip_01`, `opus4_case_postop_sbar_01`, `opus2_case_postop_opioid_respiratory_depression_01`):

| case_id | bank | items | title |
|---|---|---:|---|
| `gen_rrp_batch1_10` | gemini-canonical | 2 | "Monitoring for Post-operative Complications" |
| `gen_rrp_batch2_10` | gemini-canonical | 2 | "Unfolding Case: Postoperative Risk Management" |

→ Purge unless a concrete, non-redundant post-op topic is wanted; if so, regenerate on that specific scenario rather than the generic stub.

Net: ~**9 regenerations + 1 consolidation rebuild + 3 purges**, not 13 rebuilds.

### A.3 Notes

- This is a canonical mutation. The purge/insert must be deterministic and each rebuilt case re-enters through the full pipeline (no hand-authoring, no hand-append).
- Ledger: mark each old case **superseded** (not merely re-reviewed) with the rebuild date; mark retired cases **retired**. Census recount after the batch.
- The 3 **P2-unconfirmed** cases (`claude_cs_jun06_cdiff_sic_01`, `cs_ngn_001_anorexia`, `gpt_case_gap_...ostomy...`) are spurious fuzzy joins — their candidate skeletons already produced their own full cases. **Reclassify as tolerated** (4–5 items, no real skeleton). No action.

---

## B. Logged-omission block (closes the P2 branch)

The two confirmed-skeleton P2 cases are **justified logged omissions**, not completions — verified against the compiled items:

- **`opus_car_t_crs_2026_06_11_case_01`** — DP5 (lab-trend / end-organ analysis) is already tested inside Q4, which has a dedicated "end-organ or coagulation dysfunction" column with the creatinine/oliguria and fibrinogen/D-dimer rows. A separate DP5 item would largely duplicate Q4. The case is well-built at 5 items with clean NCJMM coverage (recognize / generate-solutions / take-action / analyze / evaluate; the two `analyze_cues` DPs were correctly merged). **Omit; do not complete.**
- **`opus2_case_code_status_01`** — DP6 (documentation) is distributed across Q1 (documents the verbatim statement + capacity), Q2 (documents the provider conversation), and Q5's SATA (which uses "single retrospective end-of-shift note" as a distractor, testing the contemporaneous principle). A dedicated DP6 item would overlap. **Omit; do not complete.**

### B.1 Logged-omission record

These predate the compile manifest, so record retroactively in `BANK-REVIEW-LEDGER.md` against each case's review entry (one record each):

```
{ case_id, omitted_dp_index, dp_skill, reason, adjudicated_by: "Claude", date: 2026-06-15,
  disposition: "accepted-omission", emitted_item_count: 5 }
```

Reasons as above (merged-into-Q4 / distributed-across-Q1-Q2-Q5). Both cases stand at 5 items, accepted. This closes the P2 branch with no regeneration.

(Data-integrity item to close alongside: the ledger reportedly recorded `car_t_crs` at 6 items; the bank has 5. Reconcile the ledger count — same top-level-vs-embedded ambiguity flagged earlier.)

---

## C. Gemini as review layer

**Change:** GPT becomes the baseline generator/compiler (its per-item output quality is consistently higher — smoke 1/2 evidence), and Gemini is demoted from compiler/lint to a **review layer**. New role split for the case pipeline:

```
Opus (author) → GPT (clinical fact-check of the skeleton, then compile) → Gemini (review) → Claude (promotion gate)
```

### C.1 Producer≠checker — this holds, and improves on the lint config

The load-bearing independence is intact: Opus authors the medicine; **GPT (≠ Opus) clinically checks it**; **Gemini (≠ GPT) reviews GPT's compiled output**; **Claude is the independent final gate**. No model reviews its own output. This is *better* than the smoke-2 "lint" role, because Gemini now performs a genuine cross-model content review instead of mechanical lint — restoring a real pre-Claude cross-check that lint never provided. The only thing relaxed (fact-check and compile both in GPT) is the same weak property assessed before; it doesn't touch clinical safety because Opus≠GPT is preserved.

Three conditions:
- **Gemini flags, never mutates.** It may not rewrite JSON, edit skeletons, or "polish" content — that is the documented corruption vector (opus12/opus3 quote damage; the smoke-2 lint-became-editing slide). Output is a structured flag list only.
- **Gemini-review is a pre-filter, not a substitute for Claude.** It reduces what reaches Claude; it does not lower Claude's bar. Clinical adjudication stays with Claude, since Gemini is the weaker clinical model.
- **Provenance reflects GPT-compile** (`gpt-` lane / `gpt-canonical`; ledger notes GPT-compile + Gemini-review).

### C.2 Gemini review scope (where it's competent and cheap)

- **Structural:** parses, ids unique, `correct` ids resolve, embedded count and `meta.count` consistent, manifest present and internally consistent.
- **Faithfulness:** every authored DP emitted or accounted for in `_compileManifest.omittedDps`; bowtie present iff authored. (The deterministic gate enforces this; Gemini sanity-checks the omission *reasons*.)
- **Bilingual:** `zh` present, non-empty, CJK present, not English-left-in; flag obvious mistranslation or stale-`zh` (English changed, Chinese didn't) — a reasonable Gemini niche.
- **Internal consistency:** cross-stage value bleed (e.g., the smoke-2 admission creatinine 1.1 vs 1.2), unit drift, obvious answer-key duplication.
- **Out of scope for Gemini (reserved for Claude):** final clinical accuracy/currency adjudication, answer-defensibility calls, distractor-quality judgment.

Output: a per-case flag list (issue, location, severity) for GPT to fix or Claude to adjudicate — never an edited artifact.

---

## Touch-points

- **A:** topic-extraction pass (Gemini/Claude); triage confirmation (Luke/Claude); Opus authoring; GPT compile; Gemini review; Claude gate; deterministic purge/insert script; ledger + census updates.
- **B:** two ledger omission records; ledger count reconciliation for `car_t_crs`.
- **C:** update `case-skeleton-pipeline-spec.md` and both compiler prompts to the new role split; write the Gemini review-layer prompt (scope per §C.2, flag-only); record the role change in `DECISIONS.md`.

## Out of scope

- The 74 tolerated (4–5) cases — left as-is per decision; tokens go to new content instead.
- Re-running the full sweep (already complete).
- Any hand-editing of canonical banks (all mutations go through the deterministic path + pipeline).
