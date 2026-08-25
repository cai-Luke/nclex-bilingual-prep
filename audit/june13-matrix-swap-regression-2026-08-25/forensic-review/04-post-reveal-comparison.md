# 04 — Post-Reveal Comparison (Phase B)

Phase B artifacts opened, in this order, after the Phase A seal (`SEAL.md`, 2026-08-25T14:40:24Z):

1. `Archive/root-cleanup-2026-08-25/gemini-p27-3.7-requalification/checker/01-blind-checker-key.md`
2. `Archive/root-cleanup-2026-08-25/gemini-p27-3.7-requalification/checker/05-historical-key-comparison.md`
3. `Archive/root-cleanup-2026-06-26/CLAUDE-ARCHITECT-GEMINI-AUDIT-QUALITY-HANDOFF-2026-06-26.md`
4. `Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-25.md`
5. `Archive/root-cleanup-2026-08-25/gemini-p27-3.7-requalification/checker/final-report.md`

Also opened as supporting context (identifies the checker's model, not itself a listed reveal file): `Archive/root-cleanup-2026-08-25/gemini-p27-3.7-requalification/checker/receipt.md` / `00-input-and-seal-receipt.md` — the P27 Module A checker seat was **Codex** (GPT-5-based Codex, `/root` primary agent).

No file in `SEAL.md`'s scope, or this file, was altered after Phase A sealing except to add this section and the two remaining Phase B files.

## §5.1 — Does the independent frozen-byte adjudication agree with Codex's Pair 40 finding?

**Yes, exactly.** Codex's blind checker key (`01-blind-checker-key.md`) states: matrix columns `c1 = Increases risk`, `c2 = Supports prevention`; frozen `correct` assigns immobility, wet linens, 25% intake, and nonblanchable redness to `c2`, and the posted turning schedule to `c1`; "its own rationale states the reverse." This is byte-for-byte the same finding as this review's Phase A §3.1 (file `01-independent-reconstruction.md`), reached independently from the same frozen package before either party's conclusion was compared. Both determinations were made from `$HOME/Desktop/gemini-p27-calibration-input-2026-08-25-v2/module-a/pairs.jsonl`; the agreement is not circular (this review sealed its own version before opening Codex's).

## §5.2 — Does the independent Git-history reconstruction explain the apparent disagreement with the June zero-contradiction outcome?

**Yes, fully.** File `02-git-and-repair-history.md` establishes the causal chain with commit-level evidence:

- The item was authored correctly on 2026-06-13 (`b3a68e8`).
- A same-day content review (`content-review-defect-log.md`, also added in `91ab960`) misdiagnosed this item (and 7 sibling GPT matrix items) as having "perfectly inverted" keys — a diagnosis this review independently falsified for all 8 named items by comparing each item's pre-swap `correct` array against its own `rationale.byChoice` text.
- `scripts/patch-matrix.py`, added and run in the same commit, applied a blind c1/c2 swap to all 8, breaking every one of them, including Pair 40's Item B q1. This is the actual origin of the defect Codex's blind checker found.
- The item has been in this broken state, unchanged, from `91ab960` (2026-06-13) through the frozen snapshot (`59664cac`, 2026-06-25) through current `main` (2026-08-25) — the frozen snapshot did not create the defect; it faithfully captured a defect that was already 12 days old.
- The June 25 Phase B coherence audit (`ADVERSARIAL-AUDIT-FINDINGS-2026-06-25.md`) reviewed this specific pair (Item A is Claude-produced, Item B is GPT-produced) under the `mixed×gpt`/Part B routing, which under producer≠checker (Claude produced Item A, so the Claude lane — 81 pairs, explicitly *excluding* claude×gpt pairs per the lane roll-up table — could not review it) sent it to the **only** available lane: Gemini. The Claude-Architect handoff (`CLAUDE-ARCHITECT-GEMINI-AUDIT-QUALITY-HANDOFF-2026-06-26.md`) and the merged findings report both document, contemporaneously, that the Gemini lane's per-pair "Reconciliation" field was templated boilerplate identical across all 46 pairs — not pair-specific evidence. `gemini.manifest.jsonl`'s row for this exact pair (`findingRef: PROVB-COH-09`) confirms: empty `evidence` field, generic templated `finding` text, no reference to the embedded q1 matrix at all.
- Separately, Layer A's deterministic routing (`layer-a-queue.jsonl`) *also* queued the embedded child item itself (`..._q1`, paired against `gemini_b9_05`) for coherence review — a routing candidate that this review's Phase A search confirms was never adjudicated in any lane's manifest. The June pilot covered a 109-item/156-pair sample against a 1,136-unique-ID routing queue baseline (`CAMPAIGN-STATUS.md`), so the specific child-level pairing that could have caught the defect directly was simply never reached.
- Where a case-level review of this pair *did* occur with real evidence (the Claude lane's coverage of sibling within-bank "pressure injury" clusters, and the Claude Phase B lane's DISMISS for the parent case-study containers), the comparison operated one container level above the defect — citing shared staging/offloading/delegation concepts, never opening `matrix.columns`/`correct`/`rationale.byChoice` for the q1 child.

This fully explains the disagreement: the June zero-contradiction outcome for Pair 40 was never actually tested against the embedded child's own key-vs-rationale bytes, by any lane, at any point.

## §5.3 — Was the June audit wrong, incomplete, using a different state, or operating at a different outcome surface?

Not "using a different state" — Phase A confirmed current == frozen == the state the June audit worked from bit-for-bit for this item. It is **both incomplete and wrong on its stated bottom line**: incomplete because the specific child-level pairing that would have surfaced the defect was routed but never reviewed, and because the case-level reviews that did occur never opened the child; wrong because the June report's explicit, unqualified claim — "0 contradictions across all 104 pairs... Phase B coherence audit is closed with zero contradictions" — is a factual assertion about this pair that the frozen bytes contradict. This is not a difference of outcome surface (e.g., "case-level coherent" vs "child-level defect" being two compatible truths under different scopes) — the June report's own scope explicitly includes this exact pair and asserts DISMISS/no-contradiction for it, not merely for the case containers in isolation.

## §5.4 — Should the historical adjudication be formally corrected or annotated?

Yes. The June 25 "0 contradictions across all 104 pairs" / "closed with zero contradictions" bottom line is factually incorrect for Pair 40 specifically, established independently twice now (this review and Codex's blind checker) from the same frozen bytes the June audit itself worked from. See §7 recommendations for the narrowest durable mechanism.

## §5.5 — Is there a current canonical content defect left to repair?

Yes. Per Phase A §3.2, the live item at `banks/gpt-canonical.json` → `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q1` is unrepaired and currently teaches the reverse of its own rationale to learners today.

## §5.6 — Does this reveal a broader audit-methodology gap warranting a deterministic checker or governance/runbook change?

Yes, and it is broader than Pair 40. Three distinct, independently-evidenced gaps:

1. **Producer≠checker routing can force content-judgment work onto a lane whose output quality is contemporaneously known to be unreliable**, with no gate requiring pair-specific evidence before accepting a dismissal. This was already flagged by the June 26 architect handoff itself (Options 1–4), but per Phase A's git history, no architecture change was made ("Status: Advisory. No architecture change made") and this exact unresolved risk materialized on this exact pair two months later.
2. **Deterministically-routed candidate pairs are not guaranteed to be reviewed.** Layer A queued the child-level pairing that would have caught this; the sampled pilot never reached it. There is no accounting artifact that reconciles "routed" vs "actually adjudicated" counts per item, so this kind of silent drop is not visible without forensic reconstruction like this review.
3. **No deterministic (non-LLM) check cross-validates a matrix item's `correct` key against the semantic direction of its own `rationale.byChoice` text**, even though this is a narrower, more tractable problem than general cross-item coherence (it is single-item, and the failure mode here — a uniform per-row inversion — has a recognizable structural signature).

## §5 required conclusions (verbatim, per commission §5)

1. Agreement with Codex's Pair 40 finding: **agree**, independently and exactly.
2. Git-history reconstruction explains the June disagreement: **yes**, fully (§5.2 above).
3. June audit disposition: **incomplete and wrong on its stated bottom line for this pair**, not a different-state or different-surface artifact.
4. Historical adjudication should be corrected/annotated: **yes**.
5. Current canonical defect remains: **yes**.
6. Broader audit-methodology gap: **yes**, three distinct confirmed gaps (above).
