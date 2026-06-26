# Phase B Coherence Handoff — 2026-06-25 (rev. 2: dispatch model)

**Correction to rev. 1.** Rev. 1 carried an acceptance oracle of
`claude 89 / gpt-5 7 / gemini 2 / needs-provenance 15` and told agents to halt on
mismatch. That oracle was wrong — it counted pairs by `concept_clusters` keyword
membership, but `build-audit-batch` correctly seeds from `routing_reasons`
(`"concept cluster: X"`, i.e. pairs that actually *formed* a similarity-gated
concept pair). My count over-included 9 topic-similarity pairs where only one end
was a concept-seed. The agents halted correctly against a bad gate. **The tool is
authoritative.** The real, on-disk slice is the source of truth:

`audit/early-bank-semantic/coherence/2026-06-25-phaseB.slice.json` —
**104 pairs / 93 items**, `reviewer_split` = **claude 81 / gpt-5 6 / gemini 2 /
needs-provenance 15**.

The Step-1 `reviewerFor` three-way fix is already applied in the repo and the
slice is already generated. There is **no external oracle to match** — the slice
defines the work. Verification is *internal consistency only* (below).

## Dispatch model (Claude Code owns distribution + its own lane + the merge)

Claude Code runs first to dispatch, audits its own lane, and runs last to merge.

### Step 1 — Claude Code: validate the slice and write the lane files

Read `2026-06-25-phaseB.slice.json`. Confirm **internal consistency** (not an
external count):

- every `pairs[]` entry has exactly one `reviewer` in
  {`claude`,`gpt-5`,`gemini`,`needs-provenance`};
- `reviewer_split` sums to `candidate_pair_count` (104);
- no `needs-provenance` pair carries a model reviewer, and for every pair the
  assigned model reviewer is **not** the producer of either end (the clean-
  reviewer invariant);
- report the actual split. It should read 81 / 6 / 2 / 15 against the current
  queue; if it differs, the queue changed — report the delta, don't halt.

Then write the per-lane assignment files (deterministic routing only — no clinical
judgment, so this is content-neutral and raises no producer≠checker concern):

- `lanes/codex.phaseB.assignments.jsonl` — the 6 `reviewer == "gpt-5"` pairs.
- `lanes/claude.phaseB.assignments.jsonl` — the 81 `reviewer == "claude"` pairs
  (Claude Code's own lane; emit it for traceability).

Each row carries both items' `id`/`bank`/`path`/`producer`/`itemType`, the
`clusters`, and the `reviewer`, copied verbatim from the slice.

**Gemini is not dispatched a new file** — its work is already fully specced in
`GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md`. Instead, *reconcile and report*:
confirm the slice's 2 `gemini` pairs are the two `hipaa_disclosure` cross-product
pairs in that spec's **Part A**, and the 15 `needs-provenance` pairs are exactly
its **Part B**. Flag any pair that doesn't reconcile; do not create a competing
Gemini list.

### Step 2 — Codex: audit the 6 gpt-5 pairs

Producer basis: GPT-5 produced neither end (`claude_*` × gemini-lane). Consume
`lanes/codex.phaseB.assignments.jsonl`. Output to
`lanes/codex.phaseB.findings.md` + `.manifest.jsonl`.

### Step 3 — Claude Code: audit the 81 claude pairs

Producer basis: Claude produced neither end (gemini×gemini / gpt×gpt /
gemini×gpt). Work as harm-ranked per-cluster sub-batches (pilot pattern). Most of
the volume is **same-case embedded-leaf pairs** (e.g. the
`gpt_case_gap_2026_06_11_pressure_ltc_*` and `gpt_pph_2026_06_16_case_01_*`
families) and within-bank format-twins — expect heavy `NULL-COHERENCE`. The
genuine cross-bank signal is in the gemini×gpt pairs (transfusion-reaction
ordering, chest-tube disconnection, post-cath, dysphagia/stroke teaching,
pressure-injury staging). Spend the evidence budget there. Output to
`lanes/claude.phaseB.findings.md` + `.manifest.jsonl`.

### Step 4 — Gemini: 46 pairs under Luke's adjudication

Per `GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md` (Part A 31 cross-product incl. the 2
hipaa pairs; Part B 15 provenance-ambiguous). Luke runs and adjudicates; reports
last.

### Step 5 — Claude Code: merge

After Codex and Gemini report, merge all lanes into the Phase B findings report +
manifest (the pilot pattern), session headers intact.

## Shared method (all review lanes)

Audit unit = the **pair**; the question is whether the two items teach **mutually
contradictory** rules/keys for the same clinical decision.

**Read first:** `AGENTS.md` → `Archive/root-specs-2026-06-18/NCLEX_Audit_Spec.md`
(Finding §6 / Concern §7, evidentiary §4, hallucination §5) →
`Archive/early-bank-semantic-audit-spec.md` → `adversarial-audit-phase-a-pilot-spec.md`
(severity §3, citation §4, **manifest §5**) → `NCLEX-Question-Schema.md` → banks.

Three outcomes, only the first is a finding: **DC contradiction** (state both
keyed rules verbatim EN+ZH and why they cannot both hold); **reconcilable
DISMISS** (different acuity/level/stage/route/order/jurisdiction); **no shared
decision** (`NULL-COHERENCE`, one line). Test the strongest reconciliation
*before* filing. A `DC` defaults to `verdict: REVIEW` + `needsHumanReview: true`
(which side is wrong is Luke's call) unless a dated authoritative source proves
one side wrong; **NY-RN** jurisdiction divergence → `source_check`, not `DC`.
Severity is an independent harm-if-real axis. Flag-only — no model mutates
canonical content. Manifest = pilot §5 17-field schema, two rows per pair
cross-referenced by `pairId`, every line parsing.

## Findings-only

No canonical writes anywhere. Ledger / census / history / status updates are the
post-pass human step, as in Phase A. Gemini's lane reports last under Luke's
manual adjudication.
