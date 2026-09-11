# Quarantined Question Forge raw intake receipt

- **Recovered at:** 2026-09-11T05:42:44Z
- **Status:** `RAW_UNREVIEWED`
- **Explicit disposition:** **NOT PROMOTED / NOT YET REVIEWED STUDY MATERIAL**
- **Producer route:** external Forge candidate → fresh independent non-GPT review → normal raw-bank intake/promotion pipeline

## Source and destination

- **External source:** `/Users/holemini/Desktop/Desktop-Archive/desktop-cleanup-2026-09-08/incinerator-hold/Project Shrimp Question Forge 2026-08-30/gpt-2026-08-30-1642-t1.json`
- **Source size:** 29,934 bytes
- **Source SHA-256:** `9f0ec549e35ef9c50244298a3a77bd016d1e78d7706533e37747ad16bd1daa0c`
- **Raw destination:** `banks/banks-raw/gpt-2026-08-30-1642-t1.json`
- **Destination size:** 29,934 bytes
- **Destination SHA-256:** `9f0ec549e35ef9c50244298a3a77bd016d1e78d7706533e37747ad16bd1daa0c`
- **Copy proof:** `cmp` passed; the external source was left untouched.

## Candidate and provenance

- **Schema metadata:** `2.0`; `meta.count = 6`; parsed question count = 6.
- **IDs:** `gpt_2026_08_30_1642_t1_01_two_challenge`, `gpt_2026_08_30_1642_t1_02_caregiver_willingness`, `gpt_2026_08_30_1642_t1_03_oxytocin_tachysystole_sequence`, `gpt_2026_08_30_1642_t1_04_abg_specimen_integrity`, `gpt_2026_08_30_1642_t1_05_cu_iud_ec_window`, `gpt_2026_08_30_1642_t1_06_opioid_constipation_prevention`.
- **Producer packet:** `/Users/holemini/Desktop/Desktop-Archive/desktop-cleanup-2026-09-08/incinerator-hold/Project Shrimp Question Forge Producer Packet 2026-08-30/`
- **Producer packet `ARTIFACT-SHA256.txt` SHA-256:** `a12f8c214220a786145e2a8478b6fc1d44be78ed092a57bcb459bc3a75fa6f2d`
- **Producer-recorded validation-mirror manifest SHA-256:** `1a82b14aacb42545d39958c75aead08559b892535aa9dba6ffc1dcf03523b468`
- The seven packet regular-file hashes (PLAN, SOURCE-REPO-BASELINE, SOURCE-MAP, DUPLICATE-SURVEY, PRODUCER-SELF-CHECK, VERIFICATION, INTAKE-NOTE) matched their packet manifest. The candidate hash matched independently.

## Surveys and gates

- **Duplicate/overlap survey:** no copy or candidate-ID occurrence was found under the repository's `banks`, `audit`, or `Archive` trees before intake; no candidate IDs overlapped 1,943 bundled IDs or any other raw IDs. The producer packet's duplicate survey remains provenance only, not independent semantic approval.
- **Raw validation:** `npm run validate-bank -- banks/banks-raw/gpt-2026-08-30-1642-t1.json` — PASS (6 questions).
- **Raw gate:** `npm run gate:raw -- --file banks/banks-raw/gpt-2026-08-30-1642-t1.json` — RAW GATE PASSED. Promotion eligibility, structural validation, references, producer-vocabulary, authorial-constraint leakage, raw stage policy, raw topic policy, and candidate-ID survey passed; position and non-MCQ bias checks were `INSUFFICIENT` because the batch has no multiple-choice items and is small.
- **Bundling boundary:** the candidate is nested under `banks/banks-raw/`; top-level `banks/*.json` enumeration excludes it. No canonical bank, ledger, census, or history content was changed for this intake.

Fresh independent non-GPT semantic and source review is still required before any normalization, promotion, consolidation, ledger update, or canonical use.
