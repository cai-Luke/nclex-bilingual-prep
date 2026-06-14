# CLAUDE-RETURN-INDEX.md
## Early-Bank Semantic Currency Audit — Claude Return Package

**Reviewer:** Claude Sonnet 4.6 (`claude-sonnet-4-6`)
**Review date:** 2026-06-13
**Phase:** A (GPT-generated items, Sessions 07–08) + Phase B (hard-cases provenance map)
**Campaign:** Early-Bank Semantic Currency Audit

---

## 1. Layer A Baseline Used

| Field | Value |
|---|---|
| Inventory records | 1,645 |
| Queue rows | 1,301 |
| Unique queued IDs | 1,127 |
| Generated from | Pre-session bank snapshot |

**Baseline drift warning (⚠):** The current bank count is approximately 1,652 — 7 records above the Layer A baseline. Commits `ec1c008` ("Add study skips and refresh reviewed banks") and `b3a68e8` ("Consolidate banks") added items to `gpt-canonical.json` and `hard-cases-canonical.json` concurrently with this audit. These 7 items were not included in the Layer A queue and were not audited. **Before applying any manifest, the recipient (Codex/Luke) should regenerate the Layer A baseline (`npm run audit:early-bank-semantic`) to capture the new items and determine whether any fall into currency or coherence queues.**

---

## 2. Session Table

| Session | Bank | Cluster scope | Audited | FIX | REVIEW | CUT | No-finding | Report | Manifest |
|---|---|---|---:|---:|---:|---:|---:|---|---|
| 07 | gpt-canonical.json | immunization_screening (11), isolation_precautions (12) | 23 | 0 | 2 | 0 | 21 | `currency/07-medium-gpt-screening-isolation.report.md` | `currency/07-medium-gpt-screening-isolation.manifest.jsonl` |
| 08 | gpt-canonical.json | anticoagulation (5), dka_insulin (2), sepsis (1), stroke (4), burn_parkland (3) | 15 | 0 | 0 | 0 | 15 | `currency/08-medium-gpt-medication-resuscitation.report.md` | `currency/08-medium-gpt-medication-resuscitation.manifest.jsonl` |
| **Phase A total** | | | **38** | **0** | **2** | **0** | **36** | | |

---

## 3. Total Unique IDs Audited

**Phase A:** 38 unique IDs (Sessions 07 + 08, all from `gpt-canonical.json`)
**Phase B:** 0 IDs audited — all 30 mapped items were blocked (see §5)

---

## 4. Provenance Map

**File:** `currency/09-mixed-provenance-map.jsonl`
**Items mapped:** 30 (all from `hard-cases-canonical.json`, drawn from Layer A currency queue)
**claude_eligible = true:** 0
**claude_eligible = false:** 30

| Generator | Final reviewer | Count | Block type |
|---|---|---:|---|
| Claude (Opus 4.6) | Claude | 5 | BLOCKED_PRODUCER_CONFLICT |
| Gemini | Claude | 6 | BLOCKED_PRODUCER_CONFLICT |
| unknown (unknown-gen, Claude review at merge) | Claude | 4 | BLOCKED_PRODUCER_CONFLICT |
| unknown | unknown (pre-ledger) | 13 | BLOCKED_PROVENANCE_UNKNOWN |
| unknown | unknown (pre-ledger, embedded) | 2 | BLOCKED_PROVENANCE_UNKNOWN |

*Note: "unknown (pre-ledger)" refers to items that predate the BANK-REVIEW-LEDGER.md tracking epoch (before 2026-06-05); the bank-level description "Codex/source-checked + Gemini/Claude reviewed" does not identify per-item generator or per-question final reviewer.*

---

## 5. Blocked IDs

### BLOCKED_PRODUCER_CONFLICT (17)

Items where Claude generated or performed final clinical review — ineligible for Claude audit per producer-conflict rule.

| ID | Basis |
|---|---|
| `opus1_case_discharge_med_rec_anticoag_01_q3` | Opus 4.6 generated; Claude final review (BANK-REVIEW-LEDGER.md 2026-06-13) |
| `opus1_case_discharge_med_rec_anticoag_01_q5` | Same case container as above |
| `opus3_iv_potassium_safety_case_01` | Opus 4.6 generated; Claude final review (BANK-REVIEW-LEDGER.md 2026-06-13) |
| `opus3_iv_potassium_safety_case_01_q4` | Same case container as above |
| `opus3_iv_potassium_safety_case_01_q5` | Same case container as above |
| `cs_sepsis_shock_01` | Gemini generated; Claude final review (high-acuity promotion report 2026-06-09) |
| `cs_sepsis_shock_01_part_1` | Same case container as above |
| `cs_sepsis_shock_01_part_2` | Same case container as above |
| `cs_sepsis_shock_01_part_3` | Same case container as above |
| `cs_stemi_vfib_04` | Gemini generated; Claude final review (high-acuity promotion report 2026-06-09) |
| `cs_stemi_vfib_04_part_2` | Same case container as above |
| `cs_stemi_vfib_04_part_3` | Same case container as above |
| `case_stroke_01` | Unknown generator; Claude final review at merge (BANK-REVIEW-LEDGER.md 2026-06-06) |
| `case_stroke_01_q1` | Same case container as above |
| `case_stroke_01_q2` | Same case container as above |
| `case_stroke_01_q3` | Same case container as above |
| `case_burns_01_part_2` | Unknown generator; Claude final review at merge with arithmetic fix (BANK-REVIEW-LEDGER.md 2026-06-06) |

### BLOCKED_PROVENANCE_UNKNOWN (13)

Items where generator and/or final reviewer cannot be determined from available records. Unknown provenance → ineligible per handoff constraint.

| ID | Basis |
|---|---|
| `cs_hip_01_q5` | Pre-ledger hard-cases item; no merger entry; generator and reviewer undetermined |
| `case_dka_01` | Pre-ledger item (original 19 seed items); no individual provenance record |
| `case_dka_01_q1` | Embedded part of case_dka_01; inherits unknown status |
| `case_dka_01_q2` | Embedded part of case_dka_01; inherits unknown status |
| `case_dka_01_q3` | Embedded part of case_dka_01; inherits unknown status |
| `case_dka_01_q4` | Embedded part of case_dka_01; inherits unknown status |
| `case_dka_01_q5` | Embedded part of case_dka_01; inherits unknown status |
| `case_sepsis_pneumonia_01` | Pre-ledger seed bank; bank-level note only ("Gemini/Claude reviewed" — per-item unknown) |
| `sepsis_pneumonia_cues_matrix` | Embedded part of case_sepsis_pneumonia_01; inherits unknown status |
| `sepsis_pneumonia_actions_order` | Embedded part of case_sepsis_pneumonia_01; inherits unknown status |
| `sepsis_pneumonia_fluid_calc` | Embedded part of case_sepsis_pneumonia_01; inherits unknown status |
| `sepsis_pneumonia_outcomes_cloze` | Embedded part of case_sepsis_pneumonia_01; inherits unknown status |
| `sa_parkland_01` | Pre-ledger item; not named in any merger or promotion entry; generator and reviewer undetermined |

---

## 6. Actioned IDs (Phase A — REVIEW verdicts)

Both actioned items carry **REVIEW** verdict. No FIX was proposed for either because a FIX requires a concrete bilingual correction supported by a single authoritative current source, and the evidence for both items was insufficient to support a unambiguous corrective rewrite within the existing option or cloze structure.

### `gpt_canonical_cloze_neutropenia_038` — REVIEW / MEDIUM
**Bank:** `gpt-canonical.json` (index 37)
**Issue:** Cloze teaches that neutropenic precautions include avoiding "fresh flowers and raw produce." Fresh-produce restriction is no longer categorically evidence-based for neutropenic patients; ONS 2023 guidelines note insufficient evidence for universal raw-produce prohibition, while CDC 2019 retains the fresh-flower/plant restriction for Protective Environment rooms (Aspergillus risk) but does not mandate raw-produce restriction at the Isolation Precautions level.
**Authority:** ONS Infection Prevention and Control Clinical Practice Guidelines (2023); CDC 2019 Guidelines for Isolation Precautions (Appendix A).
**Why REVIEW not FIX:** The cloze option structure cannot be revised without rewriting all three options simultaneously; institution-specific policies vary; the evidence gap does not yield a single authoritative replacement phrase.

### `gpt_canonical_or_ppe_doffing_104` — REVIEW / MEDIUM
**Bank:** `gpt-canonical.json` (index 103)
**Issue:** Item teaches PPE doffing sequence as Gloves → Goggles → Gown → Mask → Hand hygiene (single, at end). CDC 2019 recommended sequence is Gloves → Gown → Hand hygiene → Face shield/goggles → Mask/respirator → Hand hygiene. The item omits the intermediate hand hygiene step after gown removal and inverts the goggles/gown order.
**Authority:** CDC 2019 Guidelines for Isolation Precautions (Appendix A, Table 4: Sequence for Putting On and Removing PPE).
**Why REVIEW not FIX:** The correct[] array, ordering labels, rationale (EN+ZH), and testTakingStrategy (EN+ZH) would all need to change simultaneously; multiple institutional and NCLEX-prep sources vary on intermediate steps, making the authoritative single-source bar difficult to meet for a FIX.

---

## 7. Mechanical Validation

| Check | Result |
|---|---|
| Session 07 manifest rows | 2 (both REVIEW) |
| Session 08 manifest rows | 0 |
| Phase B provenance map rows | 30 |
| Exact edits to question content | 0 |
| EN/ZH parity failures introduced | 0 |
| before-state mismatches | N/A (no edits proposed) |
| Review Console run | Not run — proposal-only session; no patches or cuts to apply |
| Regression check | N/A — canonical banks unmodified |
| Bank validation (`npm run validate-bank`) | Not run — no files modified |

*This is a proposal-only audit. Manifests contain only REVIEW verdicts (no FIX or CUT rows). No execution is required until the campaign review team decides to act on the REVIEW findings.*

---

## 8. Integrity Confirmation

- **Canonical banks were not edited.** `gpt-canonical.json`, `claude-canonical.json`, `gemini-canonical.json`, `hard-cases-canonical.json` — read-only throughout this session.
- **BANK-REVIEW-LEDGER.md was not edited.** Used as a read-only provenance source.
- **Census artifacts were not edited.** No Layer A or Layer B artifacts were modified.
- **No patches or cuts were executed.** All manifest contents are proposals only.
- **No `npm run promote` or `npm run audit` commands were run.** Proposal-only constraint honored.

---

## 9. Output File Index

| File | Purpose |
|---|---|
| `currency/07-medium-gpt-screening-isolation.report.md` | Session 07 full per-item audit (23 items) |
| `currency/07-medium-gpt-screening-isolation.manifest.jsonl` | Session 07 manifest — 2 REVIEW rows |
| `currency/08-medium-gpt-medication-resuscitation.report.md` | Session 08 full per-item audit (15 items) |
| `currency/08-medium-gpt-medication-resuscitation.manifest.jsonl` | Session 08 manifest — 0 rows (empty) |
| `currency/09-mixed-provenance-map.jsonl` | Phase B provenance map — 30 rows, all blocked |
| `CLAUDE-RETURN-INDEX.md` | This file |

---

## 10. Recommendations for Next Turn

1. **Regenerate Layer A baseline before applying manifests.** The +7-item drift means the current queue is stale. Run `npm run audit:early-bank-semantic` after the concurrently-added items have been validated and confirmed canonical.

2. **The two REVIEW items require a human decision.** Neither `gpt_canonical_cloze_neutropenia_038` nor `gpt_canonical_or_ppe_doffing_104` has a ready FIX — they need either (a) a content author to draft a bilingual rewrite and a second model to produce a FIX manifest, or (b) acceptance as-is with a rationale note, or (c) CUT if the item cannot be made accurate within its current structure.

3. **Phase B items remain un-audited.** All 30 hard-cases currency-queue items were blocked (Claude conflict or unknown provenance). An independent auditor (e.g., GPT, Gemini) could be assigned the BLOCKED_PROVENANCE_UNKNOWN subset if the campaign wishes to proceed. The BLOCKED_PRODUCER_CONFLICT items require a model that neither generated nor reviewed the specific case.

4. **Update CAMPAIGN-STATUS.md** to reflect Sessions 07–08 complete and Phase B provenance map filed. This index is the authoritative return record.
