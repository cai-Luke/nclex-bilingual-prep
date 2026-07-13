# Multi-Column Structured-Measurement Staging Contract (PR A)

Date: 2026-07-12
Status: architect-ratified, implemented, and exercised by the promoted refeeding baseline
Author: Claude (architect seat)
Originally governed queue item 3 in the archived `EXHIBIT-FLOWSHEET-NEXT-WORK-HANDOFF-2026-07-12.md`

## Scope boundary — item #9 closed

**No canonical schema change, no `schemaVersion` bump, no renderer change.** Verified directly against live code before this contract was written:

- `src/types.ts` — `StructuredMeasurementPanel.columns` is already `StructuredMeasurementColumn[]`, and `StructuredMeasurementValue.columnId` already references an arbitrary column by id. The type has been N-column-shaped since it landed; nothing has ever constrained it to one.
- `src/structuredMeasurements.ts` — `panelToTable` builds one output table column per entry in `panel.columns`, and maps `row.values[]` into `cells[entry.columnId]`, both fully generic over column count. No single-column assumption exists anywhere in this file.
- `src/visuals/primitives/table.ts` — `renderDocTable`'s row loop is `if (rawCell === undefined) return;` per cell: a row missing a value for a given column already renders as a blank cell, not a crash or a forced placeholder. Sparse rows are already safe.

Everything this PR needs is upstream of canonical: the **staging/extraction format**, the **flowsheet gate** (pre-promotion staging validator, distinct from `src/schema.ts`), the **applicator**, tests, and documentation. If implementation surfaces a genuine need to touch `src/types.ts`, `src/schema.ts`, or a renderer, stop and return to the architect seat — that would mean this contract's premise was wrong, not that the contract authorized it.

## Principle 24 boundary

This work stays inside principle 24's values-only frame: structured measurements are a presentation layer over prose, not a second copy of clinical truth, and identity/display resolve at the edges. Multi-column authoring creates **no new prose-mutation path**. The only prose-touching operation in this queue is PR B, which is governed by `DECISIONS.md`'s 2026-07-12 unit-insertion amendment and is not part of this contract.

---

## 1. Staging-only column representation

Add one new optional top-level array to the staging record, sibling to the existing `panel`, `excludedValues`, and `unitAliases`:

```jsonc
{
  "exhibitRef": "gpt_case_refeeding_syndrome_tpn_01/baseline_record",
  "lane": "extract",
  "columns": [
    {
      "id": "pacu_6h_prior",
      "panelKind": "labs",
      "label": { "en": "PACU (6 h prior)", "zh": "麻醉恢复室（6小时前）" },
      "evidence": "PACU labs 6 hours earlier: Na 138, K 3.5, Cl 102, bicarbonate 24, BUN 18, creatinine 0.8, glucose 156, calcium 8.4, phosphorus 2.8, magnesium 1.8, albumin 2.1, prealbumin 8, WBC 9,200, Hgb 11.0, platelets 210,000."
    },
    {
      "id": "current",
      "panelKind": "labs",
      "label": { "en": "Current", "zh": "当前" },
      "evidence": "Point-of-care glucose 142 mg/dL."
    }
  ],
  "panel": [
    { "label": "phosphate", "value": "2.8", "sourceUnit": "mg/dL", "sourceSpan": "...", "columnId": "pacu_6h_prior" },
    { "label": "glucose", "value": "142", "sourceUnit": "mg/dL", "sourceSpan": "Point-of-care glucose 142 mg/dL.", "columnId": "current" },
    { "label": "hr", "value": "92", "sourceUnit": "bpm", "sourceSpan": "Vital signs: ..." }
  ],
  "excludedValues": [...],
  "unitAliases": [...]
}
```

- `columns` is absent by default. Its absence is what makes every existing staged record, hold artifact, and promoted bank legacy-valid with zero migration (see §6).
- Each declared column carries `id` (string), `panelKind` (`"labs" | "vitals"`), `label` (bilingual, **required**, not optional — see §3), and `evidence` (string, **required**, staging-only — see §2).
- Each `panel[]` entry gains one new optional field, `columnId` (string), which is the *only* new per-entry field. An entry without `columnId` takes the pre-existing single-implicit-column path, unchanged.
- `columns` and `columnId` are staging-only staging-format additions. At promotion, `id`+`label` map 1:1 onto canonical `StructuredMeasurementColumn`, and each entry's `columnId` maps 1:1 onto canonical `StructuredMeasurementValue.columnId`. `panelKind` and `evidence` are dropped at promotion — they never appear in canonical output.

## 2. Column evidence — staging-only, never in `StructuredMeasurementColumn`

`evidence` is the verbatim source substring that establishes the column's timepoint/context — the same role `sourceSpan` already plays for individual values. It is:

- **Required** on every declared column.
- **Never written to canonical.** `StructuredMeasurementColumn` stays `{ id, label? }`, exactly as it is today. Do not add an `evidence` field to `src/types.ts` under any circumstance — that would be the canonical-schema change this contract exists to avoid.
- **Gate-checked for containment** (§7, invariant G6): the evidence string must occur verbatim in the associated exhibit's source prose. This is the column-level equivalent of whatever containment discipline already governs per-value `sourceSpan` — align with that existing mechanism rather than inventing a second one.

## 3. Column labels — required, no inference for explicit multi-column records

- Staged column `label` is **required**, bilingual, non-empty in both `en` and `zh`. Unlike canonical's optional `label`, staging does not allow an unlabeled explicit column.
- **The applicator must never call `inferColumnLabel` (or any inferred-label path) for a column that appears in a record's `columns[]` array.** It copies `id` and `label` verbatim.
- The pre-existing implicit single-column path — including `inferColumnLabel` itself — is **completely unchanged** and remains the only path taken for any record that declares no `columns` array. This contract adds a second, fully explicit path; it does not modify the first one.
- Bright line, enforced by gate invariant G3 (§7): a record may not mix implicit and explicit columns within the same `(exhibitRef, panelKind)`. The moment any entry mapping to a given panel kind carries `columnId`, every entry mapping to that panel kind in that record must carry one.

## 4. Per-panel column selection

Columns are scoped by `(exhibitRef, panelKind)`, not globally per exhibit. The refeeding-baseline shape is the forcing case: labs needs two columns (`pacu_6h_prior`, `current`); vitals needs none (stays fully legacy/implicit, since the case has no historical vitals dataset). A single staged record may therefore declare `columns` for `labs` while leaving `vitals` untouched — no vitals entry gains a `columnId`, no vitals columns are declared, and the vitals panel takes the ordinary single-column path exactly as it does today. Do not require a record to declare columns for every panel kind it contains; do not manufacture a matching column set for a panel that doesn't need one.

## 5. Sparse-row behavior

A row is not required to carry a value for every column declared in its panel. Phosphorus, magnesium, and potassium in the refeeding baseline exist only in the `pacu_6h_prior` column and have no `current` entry — that is valid, not an error. The renderer already handles this correctly (verified, §Scope boundary); no row-completeness requirement is added anywhere in this contract. The only completeness requirement runs the other direction: every *declared column* must have at least one row that uses it (G4, §7) — an authored column with zero referencing entries is a manufactured empty column and is forbidden.

## 6. Legacy compatibility

Additive-only, by construction:

- Every currently-staged file, held artifact (`12G`, the current refeeding-baseline hold), and promoted canonical record has no `columns` array and no `columnId` on any entry. None of them are touched, re-validated under new rules, or require migration.
- The flowsheet gate's new invariants (§7) apply only when `columns` is present on a record. Their absence is not itself a finding.
- Canonical `structuredMeasurements` types are unchanged, so nothing downstream (schema validation, census, existing tests) needs to change to keep passing on existing content.

## 7. Deterministic gate invariants (flowsheet gate, staging-level)

All of the following are new checks in the pre-promotion flowsheet gate. They fire only on a record that declares `columns`; they do not apply to legacy single-column records (G8).

- **G1 — Column ID uniqueness.** No two declared columns share the same `id` within the same `(exhibitRef, panelKind)`. Duplicate → hard FAIL.
- **G2 — Entry-to-column resolution.** Every `columnId` referenced by a panel entry must resolve to a declared column of the matching `panelKind` for that `exhibitRef`. Unresolved reference → hard FAIL.
- **G3 — All-or-nothing per panel kind.** If any entry mapping to a given `(exhibitRef, panelKind)` carries `columnId`, every entry mapping to that same `(exhibitRef, panelKind)` must carry one. A mixed record → hard FAIL, never silently defaulted to implicit.
- **G4 — No manufactured empty columns.** Every declared column must be referenced by at least one panel entry's `columnId`. An unused declared column → hard FAIL.
- **G5 — No duplicate column per row.** No two panel entries share both the same `label` (measurement key) and the same `columnId` within one `exhibitRef` — an ambiguous double-reading for one column → hard FAIL.
- **G6 — Evidence containment.** A declared column's `evidence` string must be a literal substring of the exhibit's source prose. Mismatch or absence → hard FAIL.
- **G7 — Required staging fields.** Every declared column must carry non-empty `id`, `panelKind` ∈ `{"labs","vitals"}`, non-empty `label.en`, non-empty `label.zh`, and non-empty `evidence`. Any missing field → hard FAIL.
- **G8 — Legacy records are out of scope for G1–G7.** Absence of `columns` is valid and takes the pre-existing path; G1–G7 must not be retrofitted onto a record that never opted into explicit columns.

## 8. Applicator behavior

- Legacy path (no `columns` on the record): **completely unchanged.** Whatever the applicator does today — including its current default/implicit column id and its current `inferColumnLabel` behavior — continues exactly as-is.
- Explicit path (`columns` present): the applicator copies `id`+`label` verbatim into canonical `StructuredMeasurementColumn[]` per panel, and copies each entry's `columnId` verbatim into canonical `StructuredMeasurementValue.columnId`. It must not call `inferColumnLabel` for any column in this path. `evidence` and `panelKind` are read for gate purposes only and are never written to canonical output.
- The existing `--refs` dry-run / no-`--write` contract is unchanged in kind — it must render the exact canonical `columns[]` and per-value `columnId` mapping it would produce, so review can verify the mapping before any write, exactly as the existing dry-run already does for single-column records.

## 9. Schema/version impact

Closed. See "Scope boundary" above. No entry required here beyond that closure.

## 10. Test matrix

1. **Qualifying multi-column record** (named prior + current dataset, e.g., the refeeding baseline shape) — promotes with correct canonical `columns[]`/`columnId` mapping.
2. **Incidental single prior value with a same-key current value present** — regression proving this contract does not change the existing `excludedValues: {reason: "prior"}` single-column path; no `columns` authored.
3. **Historical-only dataset, no current measurements** — single column labeled from source context (e.g., `"PACU (6 h prior)"` alone); no fabricated empty "current" column.
4. **Mixed labs/vitals column sets in one exhibit** — labs multi-column, vitals single/legacy, same record (the refeeding-baseline case itself).
5. **Sparse rows** — a declared column with at least one row lacking a value for it; canonical validation and rendered output both tolerate the gap without error.
6. **Duplicate declared column ID** (G1) and **unresolved `columnId` reference** (G2) — each hard-FAILs with a distinguishable message.
7. **Mixed explicit/implicit entries within one `(exhibitRef, panelKind)`** — hard FAILs under G3.
8. **Manufactured empty column** — declared column with zero referencing entries — hard FAILs under G4.
9. **Duplicate column per row** — two entries, same `label`, same `columnId` — hard FAILs under G5.
10. **Evidence mismatch** — a column's `evidence` string absent from source prose — hard FAILs under G6.
11. **Legacy single-column regression** — every currently-promoted `structuredMeasurements` record and every currently-staged single-column hold/candidate file re-gates and re-applies with byte-identical output.
12. **Applicator dry-run parity** — for a qualifying multi-column staged record, `--refs` dry-run output exactly matches the intended canonical mapping, with `evidence`/`panelKind` absent from the preview.

---

## Pre-implementation confirmations — closed 2026-07-12

Codex verified the two implementation-time facts against current source during contract
consolidation:

- The implicit single-column applicator path authors column id `"current"` and obtains its bilingual
  label through `inferColumnLabel`. PR A leaves that path unchanged.
- `validateStructuredMeasurements` in `src/schema.ts` already rejects duplicate canonical column
  ids and rejects a value whose `columnId` does not resolve within the same panel. It contains no
  single-column assumption. It does not separately reject two values in one row that repeat the same
  resolved `columnId`; staging invariant G5 remains the PR A protection for that shape, and any
  canonical-layer hardening is out of scope.
- `panelToTable` is generic over authored columns, and `renderDocTable` skips undefined cells, so a
  sparse row renders a blank intersection rather than crashing or printing `undefined`.

Everything in this contract is now a closed decision. Implementation should not need to return to
the architect seat for a shape question; it should return only for a genuine source ambiguity in the
refeeding-baseline or 12G re-derivation itself, which is checker-seat and Rule F territory, not this
contract's.
