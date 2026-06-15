# Case Completion Reconciliation — Architecture Handoff

**Date:** 2026-06-15  
**Status:** Layer A complete; Gemini Layer B complete; Claude adjudication pending  
**Scope:** Detection and classification only. No case, bank, source skeleton, or ledger content was changed.

## Executive conclusion

The reconciliation found a small, bounded legacy under-generation problem:

- 27 recoverable Opus prose skeletons were compared with 116 compiled cases.
- 22 Opus-origin cases are full at six embedded items.
- 3 legacy cases are faithful five-item compilations and remain within the accepted 4–6 tolerance.
- 2 cases have six authored decision points but only five embedded items.
- No P1 cases, no below-floor R1 cases, no parse failures, and no authored bowties were dropped.

Gemini confirmed both candidate joins. Direct inspection agrees that both are **structural one-to-one coverage failures**, but it does not support describing all affected source content as absent:

1. The CAR-T case merged two authored decision points into one matrix item.
2. The code-status case distributed part of its documentation decision point across existing items and exhibits but emitted no dedicated item for that DP.

Both remain P2 Mode A candidates. Neither should be patched in canonical JSON directly.

## Final worklist

| Case | Source | Finding | Recommended completion |
|---|---|---|---|
| `opus_car_t_crs_2026_06_11_case_01` | `Archive/case_sources/OpusCarT.md` | DP4 (ICANS) and DP5 (CRS end-organ/lab trends) were combined in Q4. The case has five items for six DPs, but DP5 content is present inside Q4. | If strict one-item-per-DP fidelity is desired, compile a dedicated DP5 `analyze_cues` item from the existing lab-trend source. Claude should first decide whether splitting Q4 creates useful independent discrimination rather than duplication. |
| `opus2_case_code_status_01` | `Archive/case_sources/Opus2.md` | No dedicated DP6 item tests contemporaneous documentation across the full escalation timeline. Q1 and Q2 already test initial documentation and provider-response documentation, so the theme is partially represented. | Compile a dedicated DP6 `generate_solutions` item only if it tests the full documentation record without duplicating Q1/Q2. Claude should review jurisdiction- and policy-sensitive wording before promotion. |

Both joins are confirmed by exact title/case structure signals. Neither skeleton contains a bowtie synthesis.

## Important architecture distinction

These legacy skeletons contain six numbered DPs, but they do not cleanly map to six unique NCJMM labels.

- CAR-T source labels include two `analyze_cues` DPs; its intervention-sequencing DP is described as `prioritizing_hypotheses`, while the compiled item is reasonably labeled `take_action`.
- Code-status source content similarly yields repeated action-oriented coverage; adding DP6 would improve source fidelity but would not by itself create one item for every unique NCJMM step.

Therefore:

- **Mode A completion** means faithful recovery of an authored DP.
- **Six-step NCJMM normalization** would require source-level re-authoring and is not the same cheap task.

The architecture should choose explicitly between those goals. The current recommendation is source-faithful Mode A only, with no taxonomy rewrite during this reconciliation.

## GPT completion contract

For a case Claude approves:

1. Use only the confirmed skeleton and the named DP.
2. Produce a raw completion fragment, not a canonical-bank edit.
3. Preserve the existing case facts, stages, terminology, and bilingual style.
4. Do not invent new clinical claims to force novelty.
5. Emit `_compileManifest` accounting for all six DPs and any omission.
6. Keep embedded IDs globally safe and pass the normal raw validation/promotion path.

If a sixth item cannot add independent educational value without duplicating an existing item, record a justified omission instead of padding the case.

## Claude review contract

Claude should make the final per-case decision:

- **approve completion** when the proposed sixth item independently tests the authored DP;
- **accept logged omission** when the DP is already adequately merged and separation would be redundant;
- **reject/re-author** only if the desired outcome is six unique NCJMM steps rather than faithful compilation.

For any approved fragment, Claude should review clinical accuracy, answer uniqueness, bilingual fidelity, source faithfulness, and overlap with existing items before promotion.

## Forward prevention

The raw-only compile manifest and deterministic gate are now implemented:

- every authored DP must be emitted or omitted with a reason;
- authored bowtie presence must be accounted for;
- unexplained shortfalls fail validation/promotion;
- `_compileManifest` is stripped before canonical output and rejected if it leaks into bundled or imported content.

This closes the silent-drop failure mode for future compilations. The capped Layer B design also worked as intended: only two cases required semantic alignment.

## Evidence

- `audit/case-completion/LAYER-A-REPORT.md`
- `audit/case-completion/layer-a.json`
- `audit/case-completion/gemini-layer-b-queue.jsonl`
- `audit/case-completion/gemini-layer-b-results.jsonl`
- `audit/case-completion/GEMINI-LAYER-B-PROMPT.md`

## Architecture decision requested

Approve one of these dispositions for each P2 case:

1. **Mode A completion:** generate and review one dedicated sixth item.
2. **Logged legacy omission:** retain five items because the source DP is already adequately merged.
3. **Re-author:** only if six unique NCJMM-step labels are required; this is outside cheap completion scope.

No promotion or canonical mutation should occur until Claude records that disposition.
