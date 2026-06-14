# Currency Audit — Session 10
## Claude Return Adjudication

**Session ID:** 2026-06-13-Currency-10
**Track:** currency / OG adjudication
**Reviewing model:** OpenAI GPT-5
**Date:** 2026-06-13
**Scope:** Two Session 07 `REVIEW` findings and the 13 Phase B provenance-unknown rows
**Canonical banks edited:** No

## Session Header

| Field | Value |
|---|---|
| REVIEW findings adjudicated | 2 |
| Promoted to FIX | 1 |
| Dismissed / retain as-is | 1 |
| CUT | 0 |
| Provenance-unknown rows resolved | 13 remain blocked |

## 1. `gpt_canonical_cloze_neutropenia_038` — FIX

**Bank evidence**

- Correct first dropdown: `"a private room with protective precautions"`
- Correct second dropdown: `"fresh flowers and raw produce"`
- Rationale: `"Severe neutropenia requires infection-prevention measures that reduce exposure to organisms. Fresh flowers, plants, and raw foods can carry microbes."`

**Finding**

The original item overgeneralizes two practices. CDC reserves its formal
Protective Environment recommendation for allogeneic hematopoietic stem-cell
transplant patients and has no recommendation to use that environment for
other medical conditions solely because they increase fungal-infection risk.
An ANC of 400/mm3 establishes severe neutropenia, but not that environmental
indication.

NCI guidance emphasizes hand hygiene, avoiding sick contacts, and food safety.
It permits raw fruits and vegetables when they can be peeled or are washed very
well; it does not support a universal raw-produce prohibition.

**Adjudication**

Promote to `FIX`. Preserve the infection-prevention learning objective while
keying Standard Precautions with strict hand hygiene and avoidance of sick
visitors and unwashed produce. The manifest updates all affected English and
Chinese teaching surfaces.

**Alternative interpretation**

An institution may use a private room, restrict flowers, or impose a
neutropenic diet under local policy or for another clinical indication. The
stem supplies only chemotherapy and ANC 400/mm3, so those local or additional
indications cannot be assumed.

**Sources**

- CDC, Protective Environment recommendations:
  https://www.cdc.gov/infection-control/hcp/isolation-precautions/summary-recommendations.html
- CDC, Components of a Protective Environment:
  https://www.cdc.gov/infection-control/hcp/isolation-precautions/appendix-a-table-5.html
- NCI, Infection and Neutropenia during Cancer Treatment:
  https://www.cancer.gov/about-cancer/treatment/side-effects/infection

## 2. `gpt_canonical_or_ppe_doffing_104` — Dismissed

**Bank evidence**

- Key: Gloves -> Goggles -> Gown -> Mask -> Hand hygiene
- Rationale identifies that sequence as the CDC standard sequence.

**Finding review**

Claude compared the item with a context-specific workflow that removes gloves
and gown together, performs hand hygiene, exits, and then removes eye and
respiratory protection. CDC's general Isolation Precautions figure, however,
lists the exact sequence used by this item: gloves, goggles or face shield,
gown, mask or respirator, then immediate hand hygiene after all PPE.

**Adjudication**

Dismiss the `REVIEW` finding and retain the item as-is. The item asks a general
contact-precautions question and matches the applicable CDC general sequence.
No patch or cut is warranted.

**Alternative interpretation**

Facilities and pathogen-specific protocols may require different removal
locations or additional hand-hygiene moments. A question testing such a
workflow would need to name that protocol or clinical context explicitly.

**Source**

- CDC, Example of Safe Donning and Removal of PPE:
  https://www.cdc.gov/infection-control/hcp/isolation-precautions/appendix-a-figure.html

## Phase B Provenance Disposition

The 13 `BLOCKED_PROVENANCE_UNKNOWN` rows remain blocked. Git history shows that
all four affected source groups existed only in the initial
`hard-cases-canonical.json` commit:

- `cs_hip_01_q5`
- `case_dka_01` and its five embedded parts
- `case_sepsis_pneumonia_01` and its four embedded parts
- `sa_parkland_01`

The contemporaneous ledger labels the original hard-case bank
`Codex/source-checked + Gemini reviewed`, but no raw producer artifact or
per-item review chain survives. Because the current adjudicator is also
OpenAI/Codex, treating these as independently reviewed would violate the
producer/checker rule. They require a non-OpenAI reviewer with no prior role in
the seed bank.

## Mechanical Summary

- Action manifest rows: 1
- Exact proposed field edits: 17
- English/Chinese pairing failures: 0
- Before-state mismatches: 0
- Review Console: actioned ID resolved; bilingual stem, selected answers,
  rationales, strategy, glossary, and answer reveal rendered
- Layer A regression: passed
- Bank validation: all bundled banks passed
- Production build: passed
- Canonical edits: none
