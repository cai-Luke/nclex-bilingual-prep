# Codex Spec — Oncology Case Reclassification

Give the existing-but-scattered oncology cases their oncology identity. Two operations, both
**proposal-only / dry-run**, applied via the category+topic writer only after Luke approves. Standing guards:
non-Gemini, no direct canonical writes, exact-diff (category/topic only), license-validate every proposal.

## Out of scope (already handled — do NOT emit rows for these)

The oncology-recognition **children** of AGVHD, ICI myocarditis, CAR-T, and TLS are already classified to
`Oncology & Immunotherapy Complications` (CAR-T via S01; AGVHD/ICI/TLS via the consolidated residual-rerun
write). Their non-recognition children correctly carry construct topics (Prioritization, Cardiovascular,
Sepsis, Electrolyte, Dosage Calc, Labs). This spec must **assert it emits no rows for those children** — it
only does parent labels (Operation A) and SCC's children (Operation B).

## Identified oncology case parents

| Parent id | Current parent category | Note |
|---|---|---|
| `opus_agvd_case_agvhd_01` | Physiological Adaptation | licenses Oncology → topic_only |
| `opus_car_t_crs_2026_06_11_case_01` | Reduction of Risk Potential | licenses Oncology → topic_only |
| `opus_scc_case_01` | Physiological Adaptation | topic_only + Operation B |
| `opus_tpn_case_mucositis_01` | Physiological Adaptation | **verify oncology framing first** |
| `opus_icit_case_01` | Pharmacological and Parenteral Therapies | **license conflict — see A** |
| `gpt_case_gap_2026_06_11_case_tls_01` | resolve from bank | apply A by license rule |

## Operation A — parent/case-level oncology label (proposal-only)

For each parent, propose topic = `Oncology & Immunotherapy Complications` as the case filter-topic. This
topic is **the case's clinical subject, not the modal child construct** — assign it because the case is an
oncologic/immunotherapy condition (named in the legacy parent topic), **not** by deriving from children.

Licensing: `Oncology & Immunotherapy Complications` is shared under **Physiological Adaptation + Reduction
of Risk Potential** only.
- Parent category already licenses it (PhysAdapt or RRP) → **topic_only**.
- Parent category does **not** (the `opus_icit_case_01` parent is Pharmacological) → **category_and_topic**:
  propose moving the parent to **Physiological Adaptation** (immune-checkpoint myocarditis is a
  physiological complication). Never write an unlicensed topic; if the category move seems wrong, emit it as
  a flag for Luke instead.
- `opus_tpn_case_mucositis_01`: confirm from the parent stem that this is chemo/radiation-associated
  mucositis in an oncology patient before labeling Oncology. If it's generic TPN/line-infection content,
  **leave the parent as-is and flag** — do not force it.

## Operation B — SCC children per-child adjudication (proposal-only)

`opus_scc_case_01` never entered the residual rerun; all six children are currently
`Endocrine & Neurological Disorders` / Physiological Adaptation. Run them through the **same residual-rerun
engine**: hydrate scoped context, candidate set from current category, propose
`topic_only` / `category_and_topic` / `abstain`, non-Gemini, `oldTopic` withheld, hard-validated.

Expectation — let the tested construct decide **per child**, do not bulk-move: the recognition/synthesis
child(ren) (e.g. the bowtie or the "recognize this emergency" item) → `Oncology & Immunotherapy
Complications`; pure neuro-deficit assessment children may legitimately **stay** Endocrine & Neurological
Disorders. A case being oncologic does not make every child an oncology-construct item.

## Output & guards

- One dry-run manifest + report (residual-rerun shape): Operation A parent rows + Operation B SCC child
  rows, with exact before/after diffs (category/topic only) and a stop gate. No canonical writes.
- Non-Gemini classifier; `oldTopic` withheld for B; every proposed topic license-validated against its
  proposed category; vocabulary gaps flagged, never applied.
- **Reconcile against the pending 90-parent pass:** these six parents are a subset of the broader 90. Mark
  them handled here so the general parent pass skips them and they aren't double-labeled.
