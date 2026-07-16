# Source Record — NCSBN 2026 NCLEX-RN® Test Plan

Status: **active authority** for NCLEX Client Needs category adjudication.
Created 2026-07-16 (architect seat). First consumer: Burn Management topic audit.

## Citation

> National Council of State Boards of Nursing. (2026). *2026 NCLEX-RN® Test Plan*. Chicago: Author.

(Suggested citation as printed on p. ii of the document itself.)

## Retrieval

| Field | Value |
|---|---|
| Official URL | https://www.nclex.com/files/2026_RN_Test%20Plan_English-F.pdf |
| Publisher hub | https://www.ncsbn.org/publications/2026-nclex-rn-test-plan |
| Effective date | **April 1, 2026**; supersedes the 2023 NCLEX-RN Test Plan |
| Retrieved | 2026-07-16 |
| SHA-256 | `e64ae95732a5be03d31bc29ccad20461a171085883b88760a21ee6bd4cc1edf3` |
| Size / pages | 758,491 bytes / 56 pages |
| Basis | 2024 RN Practice Analysis (NCSBN, 2025); ~24,000 newly licensed RNs |

**If the SHA-256 no longer matches on re-download, this record is stale — re-verify every page
pointer below before relying on them.** NCSBN reissues files at the same URL without notice.

## Provenance and reproduction

The PDF is **linked, not vendored**. This is a repository-hygiene decision, not a legal one: the
document's own terms (p. ii) grant nonprofit education programs permission to reproduce all or parts
for educational purposes and prohibit commercial/for-profit use. Vendoring a 758 KB binary into a
markdown-contract repo, where it would silently drift from NCSBN's live file, is the worse
engineering choice regardless of permission.

**This record is a pointer, not a transcription.** It deliberately does not reproduce the activity
statements. Anyone adjudicating a category opens the linked PDF at the page cited below and reads the
statement themselves. A paraphrase in this file would become the thing future rulings argue from,
which is precisely the failure this record exists to end.

## Project use — narrow scope

This source governs **NCLEX Client Needs category adjudication only** — i.e. the eight-value
`category` enum and which category a given keyed nursing activity belongs to.

It does **not** govern:

- `topic` naming, vocabulary, or the STRICT/SHARED license mechanism. Topics are a Project Shrimp
  dashboard/library rollup construct (see `TOPIC-VOCABULARY-DECISIONS.md` and the hygiene keystone);
  NCSBN has no topic concept. Test-plan sub-headings are **not** canonical topics and must not be
  imported as such without a separate vocabulary ruling.
- Schema, renderer, or data-contract behavior (`NCLEX-Question-Schema.md` owns those).
- Clinical correctness of any item's keyed answer. This is a classification authority, not a
  clinical reference. Clinical claims still need clinical sources.

## Structural pointers (verified against the retrieved file, 2026-07-16)

The document lists each category twice: a brief **Overview of Content** (pp. 7–14) and the detailed
**Appendix A — Sample Content** (pp. 19–49). **Appendix A is the adjudication surface** — it is the
only place carrying the sub-headings that distinguish constructs within a category.

| Category | Overview | **Appendix A (use this)** |
|---|---|---|
| Management of Care | p. 7 | p. 19 |
| Safety and Infection Prevention and Control | p. 8 | p. 24 |
| Health Promotion and Maintenance | p. 9 | p. 27 |
| Psychosocial Integrity | p. 10 | p. 30 |
| Basic Care and Comfort | p. 11 | p. 35 |
| **Pharmacological and Parenteral Therapies** | p. 12 | **pp. 38–40** |
| **Reduction of Risk Potential** | p. 13 | **pp. 42–44** |
| **Physiological Adaptation** | p. 14 | **pp. 46–49** |

Category definitions (one line each) appear at the head of both listings. **The definitions establish
scope — and they overlap; the exact keyed activity resolves the overlap** — see "Adjudication note"
below. Do not classify from the activity verb alone.

### Sub-headings that matter for fluid/calculation adjudication

Under **Pharmacological and Parenteral Therapies** (Appendix A):

- **Dosage Calculations** — p. 39. Scoped to calculations for *medication administration*.
- **Parenteral/Intravenous Therapies** — p. 40. Covers applying mathematics/nursing procedures when
  caring for a client receiving *intravenous therapy*. **This, not Dosage Calculations, is the home
  for non-medication IV fluid volume/rate computation.**
- Also present: Adverse Effects/Contraindications (p. 38), Blood and Blood Products (p. 39), Central
  Venous Access Devices (p. 39), Expected Actions/Outcomes (p. 39), Medication Administration
  (pp. 39–40), Pharmacological Pain Management (p. 40), Total Parenteral Nutrition (p. 40).

Under **Reduction of Risk Potential** (Appendix A): Changes/Abnormalities in Vital Signs (p. 42),
Diagnostic Tests (pp. 42–43), Laboratory Values (p. 43), Potential for Alterations in Body Systems
(p. 43), Potential for Complications of Diagnostic Tests/Treatments/Procedures (pp. 43–44), Potential
for Complications from Surgical Procedures and Health Alterations (p. 44), System-Specific
Assessments (p. 44), Therapeutic Procedures (p. 44).

Under **Physiological Adaptation** (Appendix A): Alterations in Body Systems (pp. 46–47), Fluid and
Electrolyte Imbalances (p. 47), Hemodynamics (p. 48), and further sub-headings through p. 49.

## Adjudication note — definitions establish scope; the keyed activity resolves overlap

A recognition-vs-management verb test **does not** separate RRP from PA. Both categories contain
"recognize … and intervene" activity statements (RRP p. 42; PA p. 46), and their definitions
**overlap by design**:

- **Reduction of Risk Potential** — reducing the likelihood that clients will develop complications or
  health problems related to *existing conditions, treatments or procedures* (pp. 13, 42). The scope
  includes complications of an **existing condition** — not only treatment- and procedure-related
  risk. Narrowing it to the latter is a misreading, and one that will pull recognition items toward
  PA that do not belong there.
- **Physiological Adaptation** — managing and providing care for clients with *acute, chronic or
  life-threatening physical health conditions* (pp. 14, 46).

A complication of a life-threatening burn injury therefore sits **inside both definitions**. The
definitions establish **scope**; they do not resolve the overlap. **The exact keyed nursing activity
resolves it:**

- Assessment, focused assessment, or recognition of a **potential** complication, **without keyed
  management** → tends **RRP**.
- Emergency treatment, or active management of the acute or life-threatening condition → tends **PA**.

"Tends," not "is." **Do not classify from the verb alone.** A stem verb ("recognize", "highlight",
"manage") is not the keyed activity — read what the key actually scores. An item may recognize cues
in service of a keyed management discrimination, or key an action inside a recognition frame. And the
severity of the underlying condition does **not** by itself pull an item to PA: a focused assessment
remains a focused assessment when the condition is life-threatening.

## Distribution of content (pp. 5, target percentages; ±3% tolerance per exam)

| Category | Range | Target |
|---|---|---|
| Management of Care | 15–21% | 18% |
| Safety and Infection Prevention and Control | 10–16% | 13% |
| Health Promotion and Maintenance | 6–12% | 9% |
| Psychosocial Integrity | 6–12% | 9% |
| Basic Care and Comfort | 6–12% | 9% |
| Pharmacological and Parenteral Therapies | 13–19% | 16% |
| Reduction of Risk Potential | 9–15% | 12% |
| Physiological Adaptation | 11–17% | 14% |

Ranges are unchanged from the 2023 plan. Clinical judgment is measured additionally by 18 case-study
items (three sets of six) plus ~10% stand-alone items, counted independently of category quotas.

## Findings on first use

1. **Category rename — project-wide.** The 2026 plan renames the subcategory
   `Safety and Infection Control` → **`Safety and Infection Prevention and Control`** (pp. 3, 8, 24).
   Project Shrimp migrated the enum and exact category fields on 2026-07-16. This is a rename of an
   existing subcategory, not a new category; item-level category *semantics* are unaffected.
2. **`Dosage Calculations` is medication-scoped at source** (p. 39), but the repo's topic of the same
   name currently holds non-medication IV fluid math. That is a `Parenteral/Intravenous Therapies`
   construct (p. 40). The architect ratified the STRICT `IV Fluid Calculations` topic and its
   nine-item migration on 2026-07-16.
3. **`Substance abuse` → `substance misuse`** terminology update appears throughout Psychosocial
   Integrity (pp. 10, 31) and Safety (pp. 8, 24). The two identified live English strings were
   folded into the 2026-07-16 cleanup.

## Re-verification

```
curl -sL -o /tmp/testplan.pdf "https://www.nclex.com/files/2026_RN_Test%20Plan_English-F.pdf"
sha256sum /tmp/testplan.pdf   # expect e64ae95732a5be03d31bc29ccad20461a171085883b88760a21ee6bd4cc1edf3
```

NCSBN reviews and approves the test plan on a three-year cycle (p. 1). No expiration date is asserted
here — re-check this record whenever the hash drifts or NCSBN announces a revision.
