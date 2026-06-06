# Claude Underserved Case Studies Review - 2026-06-06

Source file: `banks/banks-raw/claude-2026-06-06-underserved-case-studies.json`

Promotion target: `banks/hard-cases-canonical.json`

## Result

- Reviewed 5 top-level schema v1.1 `case_study` items with 20 embedded graded parts.
- Promoted 5 of 5 into `banks/hard-cases-canonical.json`.
- No answer keys were changed.
- Raw Claude output was deleted after merge.

## Promoted Cases

| ID | Category | Topic | Embedded parts | Decision |
|---|---|---|---:|---|
| `claude_cs_jun06_chest_tube_rrp_01` | Reduction of Risk Potential | Chest Tube Management | 4 | Promote with wording cleanup |
| `claude_cs_jun06_pressure_injury_bcc_01` | Basic Care and Comfort | Pressure Injury Staging and Prevention | 4 | Promote |
| `claude_cs_jun06_cdiff_sic_01` | Safety and Infection Control | Clostridioides difficile and Contact Precautions | 4 | Promote with wording cleanup |
| `claude_cs_jun06_adult_immunization_hpm_01` | Health Promotion and Maintenance | Adult Immunization and Preventive Screening | 4 | Promote with wording cleanup |
| `claude_cs_jun06_ipv_screening_psi_01` | Psychosocial Integrity | Intimate Partner Violence Screening and Support | 4 | Promote |

## Fixes Applied To Promoted Copy

- `claude_cs_jun06_chest_tube_rrp_01_part_1`: changed the stem from "1000 drainage system observations" to broader "chest-drainage finding" language because the row about 200 mL/hr bright red drainage was a hypothetical red-flag comparison rather than part of the 1000 exhibit.
- `claude_cs_jun06_chest_tube_rrp_01_part_1`: softened tidaling language from "confirms a patent tube" to "can indicate a patent tube" to avoid over-teaching a single finding.
- `claude_cs_jun06_cdiff_sic_01_part_2`: clarified C. difficile hand-hygiene rationale to reconcile NCLEX-safe soap-and-water teaching with current CDC nuance that glove/gown technique remains essential and ABHS is generally preferred unless hands are visibly soiled or outbreak-specific soap-and-water precautions apply.
- `claude_cs_jun06_cdiff_sic_01_part_4`: removed "exit the room" from the final PPE step and reworded the rationale around a safe doffing sequence plus final hand hygiene, reducing ambiguity about leaving the care area before hand hygiene.
- `claude_cs_jun06_adult_immunization_hpm_01_part_1`: updated pneumococcal rationale to the current adult threshold: adults age 50 years or older with no prior pneumococcal conjugate vaccine or unknown history.

## Source Checks

- Chest-tube findings and troubleshooting checked against Open RN / NCBI Bookshelf chest-tube drainage guidance: tidaling can indicate patency, gentle suction-control bubbling is expected with wet suction, continuous water-seal bubbling can indicate an air leak, and sterile water/saline can create a temporary water seal after disconnection.
- Pressure-injury staging checked against NPIAP-aligned Merck Manual staging descriptions: stage 1 non-blanchable intact skin, stage 2 partial-thickness loss, stage 3 full-thickness skin loss with visible adipose but no exposed deeper structures, and unstageable when slough/eschar obscures depth.
- C. difficile precautions checked against CDC CDI infection-prevention guidance and CDC hand-hygiene guidance: contact precautions, gown/gloves, sporicidal environmental cleaning, and soap-and-water hand hygiene as an additional/NCLEX-safe precaution for spore removal.
- Adult immunization and screening checked against CDC adult immunization notes, CDC pregnancy vaccine guidance, CDC vaccine contraindications, and USPSTF colorectal-cancer screening guidance.
- IPV screening/support checked against USPSTF 2025 IPV screening guidance: screen women of reproductive age, ask directly in private and safe settings, and provide/referral to multicomponent ongoing support for positive screens.

## Sources

- NCBI Bookshelf / Open RN, "Manage Chest Tube Drainage Systems": https://www.ncbi.nlm.nih.gov/books/NBK594490/
- CDC, "Clinical Guidance for C. diff Infection Prevention in Acute Care Facilities": https://www.cdc.gov/c-diff/hcp/clinical-guidance/index.html
- CDC, "Clinical Safety: Hand Hygiene for Healthcare Workers": https://www.cdc.gov/clean-hands/hcp/clinical-safety/index.html
- Merck Manual Professional, "Pressure Injuries": https://www.merckmanuals.com/professional/dermatologic-disorders/pressure-injury/pressure-injuries
- CDC, "Adult Immunization Schedule Notes": https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-notes.html
- CDC, "Guidelines for Vaccinating Pregnant Women": https://www.cdc.gov/vaccines-pregnancy/hcp/vaccination-guidelines/index.html
- CDC, "Contraindications and Precautions": https://www.cdc.gov/vaccines/hcp/imz-best-practices/contraindications-precautions.html
- USPSTF, "Colorectal Cancer: Screening": https://www.uspreventiveservicestaskforce.org/uspstf/index.php/recommendation/colorectal-cancer-screening
- USPSTF, "Intimate Partner Violence and Caregiver Abuse of Older or Vulnerable Adults: Screening": https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/intimate-partner-violence-and-abuse-of-elderly-and-vulnerable-adults-screening
