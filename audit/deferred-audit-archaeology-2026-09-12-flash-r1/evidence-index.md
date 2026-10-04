# Evidence Index — Deferred Audit Archaeology R1

**Date**: 2026-09-12  
**Deliverable Directory**: `audit/deferred-audit-archaeology-2026-09-12-flash-r1/`  
**Purpose**: Compact mapping from report findings to exact repository paths, git commit evidence, live bank identities, and verification methods.

---

## 1. Candidate Evidence Mapping

| Candidate ID | Classification | Historical Artifact Paths | Live Repository Paths / Commits | Verification Method |
|---|---|---|---|---|
| **`CAND-01-SCORED-FORMAT-CONSTRUCT`** | `REVIVE_HIGH_VALUE` | `audit/scored-format-construct-audit-2026-07-21/WORK-ORDER.md`, `audit/scored-format-construct-audit-2026-07-21/AUDIT-REPORT.md`, `audit/scored-format-construct-audit-2026-07-21/ADJUDICATIONS.md` | `banks/gpt-canonical.json` | Direct Python script parsing all 104 IDs from historical artifact against live `banks/gpt-canonical.json`. Confirmed 104/104 items and 31/31 RETIRE candidates remain live. |
| **`CAND-02-C16-BOUNDARY-EXCEPTIONS`** | `REVIVE_HIGH_VALUE` | `audit/campaign-16-r4-closeout-2026-09-08.md` | `banks/claude-canonical.json` (7), `banks/gemini-canonical.json` (6), `banks/gpt-canonical.json` (35), `banks/hard-cases-canonical.json` (18), `scripts/audit/case-stage-refs.ts` | Execution of `npm run audit:stage-refs` confirms exactly 66 `[revealsAllStages]` (`answerableAfterStageId: null`) items live across 66 parent cases. |
| **`CAND-03-C16-LEGACY-PRIMARY-ANCHORS`** | `REVIVE_POSSIBLE` | `audit/campaign-16-r4-closeout-2026-09-08.md` | `scripts/audit/case-stage-refs.ts`, `banks/*.json` | Execution of `npm run audit:stage-refs -- --strict` confirms exactly 75 `[missingRequiredAnchor]` items across the 4 canonical banks. |
| **`CAND-04-C16-PHASE-E-RESIDUAL-192`** | `DECISION_VALUE_GONE` | `audit/campaign-16-r4-closeout-2026-09-08.md`, `audit/c16-phase-e-residual-192-2026-09-08/` | `PROJECT-HISTORY.md` (Campaign 16 R4 closeout entry) | Verified owner closeout on 2026-09-08 explicitly retired the residual-192 census following structural repair of 385/451 rows. |
| **`CAND-05-EARLY-BANK-COHERENCE`** | `DECISION_VALUE_GONE` | `audit/early-bank-semantic-audit-2026-06-25/REPORT.md`, `audit/early-bank-semantic-audit-2026-06-25/coherence-candidates.jsonl` | `audit/early-bank-semantic-audit-2026-06-25/` | Evaluated historical sampling report (100-pair sample yielded 98 false alarms); verified subsequent clinical passes resolved real issues. |
| **`CAND-06-EARLY-BANK-CURRENCY`** | `COMPLETED_ELSEWHERE` | `audit/early-bank-semantic-audit-2026-06-25/REPORT.md` | `BANK-REVIEW-LEDGER.md` (Sessions 01–12), `PROJECT-HISTORY.md` | Inspected ledger entries recording 32 currency remediations merged in July 2026. |
| **`CAND-07-BROWSER-AUTOMATION-BASELINE`** | `REVIVE_HIGH_VALUE` | `AGENTS.md` (Current Work Shape), `PROJECT-HISTORY.md` (line 2601) | `package.json`, `scripts/` | Inspected `package.json`; verified absence of Playwright/Puppeteer dependencies and absence of browser regression script. |
| **`CAND-08-UNRESOLVED-VITALS-SANITY`** | `REVIVE_POSSIBLE` | `DECISIONS.md` (Decision P26: Vital Sanity Ceilings and Temperature Formats) | `src/audit/measurementAllowlist.ts`, `scripts/audit/measurements.ts` | Inspected `DECISIONS.md` P26; confirmed `Status: REVISIT` for DBP ceiling, MAP ceiling, core temp floor, and SaO2 floor. |
| **`CAND-09-FISHBONE-LAB-PRESENTATION`** | `OWNER_DECISION_REQUIRED` | `DECISIONS.md` (Decision P29: Single-Row Lab Panels and Fishbone Presentation) | `src/visuals/kinds/lab_trend/defs.ts`, `banks/*.json` | Inspected `DECISIONS.md` P29; confirmed proof-render blocked by lack of 6+ row BMP panels in live banks. |
| **`CAND-10-BANK-PROVENANCE-PREVIEW-LAB`** | `STALE_ALREADY_IMPLEMENTED` | Historical work order for provenance & preview lab | `scripts/bank-provenance.ts`, `scripts/tests/bank-provenance.ts`, `src/App.tsx`, commit `a233214` | Negative control: verified file existence, package script integration, and live React filter in `src/App.tsx`. |
| **`CAND-11-R5-VITAL-SANITY-PRODUCTION`** | `STALE_ALREADY_IMPLEMENTED` | Work order R5 | `src/audit/measurementAllowlist.ts`, `scripts/audit/measurements.ts`, `DECISIONS.md` P26 | Negative control: verified SBP <= 400, RR <= 150, SpO2 0-100% active in `measurementAllowlist.ts`. |
| **`CAND-12-R6-PR-GATE-EXPANSION`** | `STALE_ALREADY_IMPLEMENTED` | Work order R6 | `.github/workflows/promotion-gate.yml`, `package.json` | Negative control: verified workflow configuration running stage ref, measurement, and visual audits on PRs. |
| **`CAND-13-TERMINAL-SENTENCE-CENSUS`** | `COMPLETED_ELSEWHERE` | Terminal sentence audit report | PR #78, commit `6bc81eb`, `PROJECT-HISTORY.md` | Verified git log for PR #78 showing complete normalization across canonical banks. |
| **`CAND-14-BOWTIE-ANSWERABILITY`** | `COMPLETED_ELSEWHERE` | Campaign 15 Phase D audit | Commit `cea79bd`, `PROJECT-HISTORY.md` | Verified git log commit `cea79bd` containing standalone bowtie repairs. |
| **`CAND-15-JULY16-OUTER-RING-CONSTRUCT`** | `COMPLETED_ELSEWHERE` | July 15-16 audit files | Commit `0784c98`, `BANK-REVIEW-LEDGER.md` | Verified git commit `0784c98` retiring 37, quarantining 13, and approving 58 items. |
| **`CAND-16-TEMPERATURE-PROSE-NORMALIZATION`** | `COMPLETED_ELSEWHERE` | Temperature format survey | Commit `a10d29e`, `DECISIONS.md` P26 | Verified git commit `a10d29e` updating 483 temperature occurrences to Fahrenheit first with Celsius in parentheses. |
| **`CAND-17-WBC-PLATELET-PROSE-NORMALIZATION`** | `COMPLETED_ELSEWHERE` | Natural language unit inventory | Commit `018f7b0`, `PROJECT-HISTORY.md` | Verified git commit `018f7b0` standardizing WBC and platelet counts. |
| **`CAND-18-AUTHORIAL-PRODUCER-LEAKAGE`** | `COMPLETED_ELSEWHERE` | Authorial leakage audit | Commits `1b64425`, `408a470`, `AGENTS.md` | Verified git commits eliminating meta-prompts; verified rule in `AGENTS.md`. |
| **`CAND-19-JUNE13-MATRIX-SWAP-REGRESSION`** | `COMPLETED_ELSEWHERE` | Matrix swap forensic report | Commit `e23962e7`, `PROJECT-HISTORY.md` | Verified git commit `e23962e7` restoring 8 corrupted matrix leaves. |
| **`CAND-20-TOPIC-VOCAB-LICENSE-MIGRATION`** | `COMPLETED_ELSEWHERE` | Topic vocabulary migration specs | `scripts/audit/topic-vocab.ts`, `package.json` | Execution of `npm run audit:topics` confirmed 0 unregistered topic terms in current canonical banks. |
| **`CAND-21-SINGLE-ROW-LAB-PANELS-SURVEY`** | `COMPLETED_ELSEWHERE` | Single-row lab panels survey | `DECISIONS.md` (Decision P29) | Verified ratification of single-row baseline lab panels in Decision P29. |
| **`CAND-22-LAB-REFERENCE-RANGE-VERIFICATION`** | `COMPLETED_ELSEWHERE` | Lab reference range audit | `src/visuals/kinds/lab_trend/defs.ts` | Inspected reference range constant table and adult teaching bands in live codebase. |
| **`CAND-23-NON-MCQ-BIAS-AUDIT`** | `COMPLETED_ELSEWHERE` | Positional bias audit | PR #48, commit `b4fcd48`, `DECISIONS.md` P16 | Verified adjudication and PR merge in commit `b4fcd48`. |
| **`CAND-24-CASE-COMPLETION-RECONCILIATION`** | `COMPLETED_ELSEWHERE` | Opus prose skeleton comparisons | `src/schema.ts`, `PROJECT-HISTORY.md` | Verified 4-6 item tolerance rule in schema and validation of all bundled cases. |
| **`CAND-25-PEDIATRIC-BURN-MAP`** | `OWNER_DECISION_REQUIRED` | Lund-Browder enhancement proposals | `src/visuals/kinds/burn_map/`, `DECISIONS.md` | Inspected current adult-only Rule of Nines boundary in `defs.ts` and `DECISIONS.md`. |
| **`CAND-26-PARKED-PRODUCT-THREADS`** | `NOT_RESOURCE_DEFERRED` | Translation friction & CAT specs | `DECISIONS.md`, `PROJECT-HISTORY.md` | Inspected `DECISIONS.md`; verified parking was due to learner dogfooding dependency, not compute. |
| **`CAND-27-QUESTION-FORGE-RAW-INTAKE`** | `COMPLETED_ELSEWHERE` | Question Forge Sep 11 raw batch | Commit `890f2a7`, `BANK-REVIEW-LEDGER.md` | Verified git commit `890f2a7` promoting cleaned items and ledgering intake. |
| **`CAND-28-UX-0A-0B-0C-SPECS`** | `CURRENT_SUCCESSOR_ALREADY_EXISTS` | Historical UX polish backlog | `audit/ux-0abc-architect-review-2026-09-11/` | Verified active work orders and architect review dated 2026-09-11 under active development. |

---

## 2. Live Canonical Bank Inventory Verified

The following canonical bank files were verified directly using full-file streaming readers without truncation:

| Bank File | Total Live Questions / Cases | Case Studies | Visual Stimuli Present | Verification Script |
|---|:---:|:---:|:---:|---|
| `banks/claude-canonical.json` | 511 | 42 | Yes | Python full-file JSON parse |
| `banks/gemini-canonical.json` | 515 | 45 | Yes | Python full-file JSON parse |
| `banks/gpt-canonical.json` | 1,481 | 114 | Yes | Python full-file JSON parse |
| `banks/hard-cases-canonical.json` | 602 | 108 | Yes | Python full-file JSON parse |
| **Total** | **3,109** | **309** | **Yes** | **100% covered** |

---

## 3. Comparison Methodology & Domain Distinction

To prevent false drift declarations, comparisons were categorized strictly by domain:

1. **Question ID & Part Key Domain**:
   - Compared stable identifiers (`id`, `parentCaseId`, `stageId`, `partId`) directly between historical lists and current parsed bank objects.
   - Example: All 104 IDs from `audit/scored-format-construct-audit-2026-07-21/` were matched against `banks/gpt-canonical.json`.
2. **Deterministic Script Output Domain**:
   - Ran live repo audit scripts with explicit flags:
     - `npm run audit:stage-refs` -> 66 `[revealsAllStages]`
     - `npm run audit:stage-refs -- --strict` -> 75 `[missingRequiredAnchor]`
     - `npm run audit:topics` -> 0 unmapped topics
3. **Git Commit & Tree Identity Domain**:
   - Verified specific commits in git history (`git log -1 <commit>`) to confirm exact date, touched files, and PR associations.
   - Distinct from raw file hash comparisons that are susceptible to formatting changes.
