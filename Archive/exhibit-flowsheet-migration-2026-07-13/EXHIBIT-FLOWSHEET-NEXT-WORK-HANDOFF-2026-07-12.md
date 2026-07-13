# Exhibit Flowsheet — Next Work Queue and Architect Handoff

Date: 2026-07-12
Status: owner-ratified work queue; PR A staging contract authored and ratified
Audience: Claude/Sonnet architect and independent checker seats; Codex implementation seat

## Purpose

Preserve the agreed sequencing and boundaries for closing the remaining 12G and refeeding-baseline
holds before continuing the structured-measurements promotion sweep through Batches 14–18 and 20.

This document is a work-order handoff. It does not itself change the schema, staging format, gate,
applicator, canonical banks, or clinical content.

## Governing corrections

- Failed Batch 19 remains excluded from every promotion input. Batch 20 is the authoritative serial
  redo.
- Schema 2.0 runtime semantics govern: typed `bound`, wrapper-level `population`,
  `prior_no_current`, analyte identity, unitless-subclass advisories, and the current Rule F test.
- Historical gate totals are not promotion evidence. Every candidate is gated again against current
  source banks and current code.
- No calcium-unit clarification PR is authorized for 12G by default. The standing owner ruling is
  that total calcium and ionized calcium have no inferred unit. Unitless occurrences remain visible
  in intact prose, unkeyed and outside `excludedValues`, with their gate WARNs preserved for review.

## Ratified queue

1. Create and review the 12G successor artifact.
2. PR B — deterministic bilingual PACU unit clarification.
3. Architect authors the narrow PR A multi-column staging contract.
4. PR A — implement the accepted staging contract, gate invariants, and applicator support.
5. Create and review the refeeding-baseline successor using PR B source prose and PR A machinery.
6. Resume remaining Batch 14 promotion slices, then Batches 15–18 and authoritative Batch 20.

PR B stays separate from PR A and precedes PR A's real-case application. PR A implementation must
follow the authoritative contract in
`EXHIBIT-FLOWSHEET-MULTI-COLUMN-STAGING-CONTRACT-2026-07-12.md`. The competing draft
`structured-measurements-multi-column-staging-codex-spec.md` was removed during consolidation and
must not be used.

## Immediate task — 12G successor

### Source and disposition

Create a new successor artifact for:

- `gpt_case_gallstone_pancreatitis_01/stage_2_update`
- `gpt_case_gallstone_pancreatitis_01/stage_3_update`

Re-derive both records from current canonical source prose and current gate semantics. The existing
12G artifact may be used for provenance and comparison, but it is not copied forward as authority.

Required calcium treatment in both records:

- Keep unitless total-calcium and ionized-calcium values in learner-facing prose.
- Do not key either value into `panel[]`.
- Do not place either value in `excludedValues`.
- Do not add or infer a unit.
- Preserve and enumerate the unitless-subclass WARNs.

Re-derive `context: "post_intervention"` measurement by measurement under Rule F. Stage 3 requires
special scrutiny because the superseded artifact applied the tag broadly. A measurement earns the
tag only when source chronology establishes a reassessment after an intervention directed at that
measurement or measurement domain; co-location in the same stage, sentence cluster, or timestamp is
insufficient.

### Required outputs and checks

- New successor JSON with a distinct filename and explicit lineage back to the current 12G hold and
  its Batch 12 source.
- Deterministic comparison showing every field-level change from the superseded 12G artifact.
- Current scoped flowsheet gate with every WARN enumerated by ref and rule.
- Explicit Rule F disposition table covering every keyed Stage 2 and Stage 3 measurement.
- Applicator `--refs` dry-run with no `--write`.
- No canonical bank, census, or canonical-promotion ledger write.
- Independent Sonnet review that re-derives the extraction and every Rule F tag from source prose.

Any residual FAIL, unresolved analyte identity, source-value ambiguity, or disputed Rule F tag blocks
the successor from promotion. Expected WARNs do not block when individually source-adjudicated.

## PR B — deterministic bilingual PACU unit clarification

### Boundary

PR B is a canonical learner-facing exhibit-prose edit for the refeeding baseline. It is not a schema
or applicator change and must not include the multi-column implementation.

Apply the approved unit additions through a deterministic parse → targeted mutation → serializer
workflow, or the repository's declarative patch machinery where applicable. Do not manually retype
the surrounding JSON object.

### Required mutation properties

- Preserve every existing laboratory value.
- Preserve all surrounding clinical meaning and ordering.
- Add only the owner-approved conventional unit tokens.
- Update English and Simplified Chinese with equivalent analyte-value-unit pairings.
- Do not change stems, answers, rationales, case stages, exhibit IDs/titles, unrelated exhibit text,
  or any other bank content.

### Exact-diff manifest

The committed manifest must record, for each changed prose field:

- case ID;
- exhibit ID;
- locale (`en` or `zh`);
- exact before string;
- exact after string; and
- the approved analyte-unit additions.

The mutation script or declarative patch must fail if an exact before string is absent, duplicated,
or already changed. After serialization, verify that the manifest's after strings occur exactly at
the intended fields.

### Verification and independent review

- Parse and strictly validate the touched canonical bank after mutation.
- Produce a structural diff proving no non-target field changed.
- Compare EN and ZH analyte-value-unit sequences directly and record the pairing result.
- Do not accept “both locales changed” as parity evidence.
- Run the bank-content verification floor appropriate to a canonical clinical-content edit,
  including census regeneration/check if the repository reports a content-derived change.
- Independent review must verify values, analyte identities, unit pairings, and exact diff scope.

PR B lands before the refeeding baseline is authored through PR A.

## PR A — multi-column eligibility and staging contract

The architect-authored contract is complete and authoritative:
`EXHIBIT-FLOWSHEET-MULTI-COLUMN-STAGING-CONTRACT-2026-07-12.md`. The requirements below preserve
the owner-ratified eligibility boundary and summarize why the contract exists; on field-shape or
gate details, the authoritative contract controls.

### Eligibility boundary

Multi-column structured measurements apply only when source prose explicitly presents two or more
distinct datasets at identifiable timepoints or named contexts. A labeled prior panel such as
“PACU labs 6 hours earlier” alongside current measurements qualifies.

Do not create a second column for an incidental historical comparison embedded in otherwise current
prose, including a single prior creatinine, discharge hemoglobin, or parenthetical baseline value:

- If a same-key current value exists, retain the established single-column current value plus
  `excludedValues: { reason: "prior" }` treatment.
- If the exhibit contains only one historical dataset and no current measurements, represent it as
  one column labeled from the explicit source context, such as `PACU (6 h prior)`; do not manufacture
  an empty current column.

The refeeding baseline qualifies because the source presents a coherent named PACU laboratory
dataset at a specific earlier timepoint alongside current vital signs and current point-of-care
glucose. The historical electrolyte panel is clinically necessary for interpreting the unfolding
case.

### Architect contract required before implementation

The architect-authored contract must define all of the following without leaving shape decisions to
the implementer:

1. **Explicit staged representation** — the exact JSON shape for authored columns and entry
   `columnId` linkage.
2. **Column evidence** — how a staged column records or proves the verbatim source context/timepoint
   supporting its existence.
3. **Column labels** — the allowed bilingual label shape and the deterministic relationship between
   source evidence and the learner-facing label.
4. **Per-panel column selection** — labs and vitals may require different column sets in one exhibit;
   define whether columns are authored independently per panel and how shared contexts are expressed.
5. **Sparse-row behavior** — define valid missing cells, row/value requirements, renderer output for
   absent intersections, and whether completely unused panel columns are forbidden.
6. **Legacy compatibility** — existing single-column staged records and already-promoted
   `structuredMeasurements` must remain valid and behavior-stable.
7. **Deterministic gate invariants** — unique column IDs, entry-to-column resolution, evidence and
   containment checks, duplicate-key rules by column, prohibited empty manufactured columns, and
   hard failure conditions.
8. **Applicator behavior** — explicit multi-column records must never use `inferColumnLabel` or any
   other inferred label path. The applicator must preserve authored columns deterministically.
9. **Schema/version impact** — state whether the existing canonical schema already expresses the
   result or whether a new staging-only/canonical version floor is required.
10. **Test matrix** — at minimum: qualifying named prior+current dataset, incidental prior comparison,
    historical-only dataset, mixed labs/vitals column sets, sparse rows, duplicate/unknown column IDs,
    evidence mismatch, and legacy single-column regression.

### Implementation boundary

After contract approval, PR A implements only the contract plus focused tests and documentation. It
does not promote the refeeding baseline or write canonical measurements. The refeeding case is the
first real-case dry-run/application after PR A lands and after PR B has finalized its source prose.

## Refeeding-baseline successor after PR A and PR B

The successor must be freshly authored from the PR B source, not mechanically copied from the old
hold. Expected shape, subject to the architect contract:

- labs panel with explicit source-supported prior and current columns;
- historical PACU laboratory values attached to the PACU column;
- current point-of-care glucose attached to the current labs column;
- current vital signs represented in the vitals panel without a fabricated PACU vitals column; and
- no `prior` exclusion used merely to suppress an entire clinically necessary PACU dataset.

Run the current gate, all new multi-column invariants, applicator dry-run, sparse-row render check,
and independent Sonnet source review before any canonical write.

## Promotion sweep after hold closure

For remaining Batch 14 and Batches 15–18 and 20:

- form small bounded candidates;
- scan canonical JSON first to exclude already-promoted refs;
- exclude `skip_serial`, empty/non-rendered dispositions, superseded artifacts, and unresolved holds;
- gate against current code and current canonical sources;
- enumerate every WARN by ref and rule;
- always sample every `post_intervention`, exclusion-bearing, alternate-unit, bounded, pediatric, or
  inferred-unit record;
- reject timestamp-ambiguous records unless the applicator's final authored column label is directly
  source-supported; and
- run applicator dry-run before independent review and before any write.

Batch 19 is never used. Batch 20 alone supplies the serial-redo lineage.

## Architect/checker review request

Before implementation begins, Claude/Sonnet should review:

1. whether the PR A contract checklist is complete and narrow enough to author without reopening the
   canonical structured-measurements architecture;
2. whether PR B's exact-diff and EN/ZH parity evidence are sufficient for a learner-facing clinical
   prose mutation;
3. whether the 12G successor instructions correctly implement the standing no-inference ruling for
   total and ionized calcium; and
4. whether any queue dependency above is missing or reversed.

Escalate only a concrete source ambiguity, contradictory current authority, missing staging-shape
decision, or residual hard gate finding.
