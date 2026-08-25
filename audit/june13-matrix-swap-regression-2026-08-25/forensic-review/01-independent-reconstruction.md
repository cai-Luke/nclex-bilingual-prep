# 01 — Independent Reconstruction (Phase A, pre-reveal)

Answers §3.1 (frozen historical state) and §3.2 (current canonical state) from repo bytes only. No downstream/held audit conclusion was read before this section was written.

## §3.1 Frozen historical state (snapshot `59664cacfe4cfbd43d212f84c5d164a09557c958`)

Source: `$HOME/Desktop/gemini-p27-calibration-input-2026-08-25-v2/module-a/pairs.jsonl`, `pairNumber == 40`.

**Item A:** `claude_cs_jun06_pressure_injury_bcc_01` (case study, "Unfolding case: immobile older adult with skin breakdown"). Its embedded `part_1` matrix teaches **pressure-injury staging classification** (matching skin findings to Stage 1/2/3/4 categories) — a different clinical decision than Item B q1.

**Item B q1:** `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q1`, itemType `matrix`, stem: "Using Stage 1 assessment data, classify each finding as increasing pressure-injury risk or supporting prevention."

1. **Column definitions** (`matrix.columns`, id-first order as authored):
   - `c2` — "Supports prevention" / 支持预防
   - `c1` — "Increases risk" / 增加风险
   - `selectionMode: single_per_row`

2. **Keyed `correct` mapping** (frozen bytes):
   - r1 ("Requires two staff to turn in bed") → **c2** (Supports prevention)
   - r2 ("Urinary incontinence with damp linens twice this shift") → **c2**
   - r3 ("Ate 25% of meals for two days") → **c2**
   - r4 ("Sacrum has nonblanchable redness") → **c2**
   - r5 ("Turning schedule posted at bedside") → **c1** (Increases risk)

3. **EN/ZH rationale (`rationale.byChoice`)**, verbatim:
   - r1: "Immobility increases sustained pressure over bony prominences." / 不能移动会增加骨突处持续受压。
   - r2: "Moisture from incontinence increases skin breakdown risk." / 失禁造成潮湿会增加皮肤破损风险。
   - r3: "Protein-calorie deficit impairs tissue tolerance and healing." / 蛋白热量不足会降低组织耐受性并影响愈合。
   - r4: "Nonblanchable redness is early pressure injury evidence." / 不可褪色红斑是早期压力性损伤证据。
   - r5: "A turning schedule reduces duration of pressure and supports prevention." / 翻身计划可减少受压时间并支持预防。
   - `rationale.correct` summary: "Immobility, moisture, poor intake, low albumin, and bony prominence redness increase risk. A written turning schedule supports prevention."

4. **Key vs. rationale agreement:** They **disagree, exactly and uniformly**. The rationale text unambiguously states r1–r4 *increase risk* and r5 *supports prevention*. The keyed `correct` array maps r1–r4 to column `c2` ("Supports prevention") and r5 to column `c1` ("Increases risk") — the precise inverse. Every row is flipped; there is no row where key and rationale agree.

5. **Comparison to Item A's staging rules:** Item A part_1 teaches stage classification (Stage 2 vs Stage 3 vs Deep Tissue Injury, etc.), not risk-factor-vs-prevention-action classification. The two items do not share a decision surface — Item B q1's defect is **internal**, not a cross-item conflict with Item A. No direct contradiction was found between Item A's staging content and Item B q1's (broken) risk/prevention content; they simply teach different sub-skills within the same clinical topic.

6. **Classification:** Under the frozen bytes as they actually existed, Item B q1 is **internally self-contradictory** — the rationale and the scored key teach opposite conclusions for every row. Relative to Item A, the pair is **no shared decision** (different sub-skill, so not a cross-item contradiction). The defect is wholly internal to Item B q1.

## §3.2 Current canonical state (current `main`, HEAD `3c33c03a`)

- Item A located at `banks/hard-cases-canonical.json` by id `claude_cs_jun06_pressure_injury_bcc_01`.
- Item B located at `banks/gpt-canonical.json`; child q1 at id `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q1`.

1–2. Current `matrix.columns`, `correct`, EN rationale, and ZH rationale for Item B q1 were extracted and are **byte-identical in JSON value terms** to the frozen snapshot (verified by parsing both into Python objects and comparing with `==`: `EQUAL: True`). No field differs.

3. **Internal coherence:** Not coherent — same defect as the frozen state. The keyed `correct` array is still the exact inverse of `rationale.byChoice`.

4–5. **Diff vs. frozen:** None. Zero fields differ between the frozen snapshot (2026-06-25) and current `main` (2026-08-25) for this item. The defect present at freeze time is still present today, unrepaired.

## Interim finding

Item B q1 is currently, and was at freeze time, an internally self-contradictory matrix item: the scored answer key is the exact column-inverse of what its own rationale teaches. This is a real content defect in the live canonical bank, independent of any comparison to Item A.
