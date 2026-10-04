# Project Shrimp — Deferred Audit Archaeology R1 Report

**Date**: 2026-09-12  
**Deliverable Directory**: `audit/deferred-audit-archaeology-2026-09-12-flash-r1/`  
**Status**: COMPLETE (Advisory Research Backlog)  
**Authority**: Governed by `AGENTS.md`, `docs/AGENTS-RUNBOOK.md`, `DECISIONS.md`, and live repository state.

---

## 1. Executive Summary

This archaeology examined the historical audit backlog across the entire lifecycle of Project Shrimp (July–September 2026) to identify substantive audits, censuses, checker passes, or semantic reviews that were deferred, abandoned, sampled, narrowed, or stopped primarily due to compute, context, token, cost, tooling, or execution-feasibility constraints.

The central governing principle of this investigation is that **feasibility does not equal decision value**. Cheap or abundant compute does not justify reopening a historical task whose decision value has evaporated because of subsequent structural repairs, architectural shifts, or owner policy closures.

### Key Headline Findings

1. **28 Candidate Families Identified and Adjudicated**:
   - Every candidate family was cataloged in `candidate-census.jsonl` and systematically classified against current repository state in `adjudication.jsonl`.
   - **14 tasks were already completed elsewhere** in later sprints or pull requests.
   - **3 tasks were stale negative controls** that are already fully active in production (`scripts/bank-provenance.ts` and Preview Lab Newest filter, R5 vital sanity ceilings, and R6 pull-request CI gate expansion).
   - **2 tasks have zero remaining decision value** (Campaign 16 Phase E Residual-192, and the Early-Bank 1,039-pair keyword co-occurrence coherence track).
   - **1 task is an active live successor** already undergoing active implementation review (`audit/ux-0abc-architect-review-2026-09-11/`).
   - **2 tasks require owner product-shape decisions** before any engineering is viable (Fishbone lab presentation and Lund-Browder pediatric burn map).
   - **1 task was deliberately parked** pending learner dogfooding, not resource-deferred (Translation-friction scoring and CAT simulation).
   - **5 tasks remain genuinely unresolved and are recommended for revival**:
     - **Rank 1**: `CAND-01-SCORED-FORMAT-CONSTRUCT` (104 items in `banks/gpt-canonical.json` with 31 owner-approved retirements and 14 repairs blocked by a historical `/tmp` procedural violation; all 104 items remain live today).
     - **Rank 2**: `CAND-02-C16-BOUNDARY-EXCEPTIONS` (66 case parts across all 4 canonical banks that fail open in runtime with `revealsAllStages`; live disk confirms 66/66 remain open).
     - **Rank 3**: `CAND-07-BROWSER-AUTOMATION-BASELINE` (Playwright headless browser testing baseline for CI, open in `AGENTS.md` and `PROJECT-HISTORY.md`).
     - **Rank 4**: `CAND-03-C16-LEGACY-PRIMARY-ANCHORS` (75 case parts requiring mechanical migration of `stageId` into `answerableAfterStageId` to enable strict stage validation in CI).
     - **Rank 5**: `CAND-08-UNRESOLVED-VITALS-SANITY` (Diastolic BP ceiling, MAP ceiling, core temp floor, and SaO2 floor explicitly parked as `Status: REVISIT` in `DECISIONS.md` P26).

2. **Zero In-Place Mutation**:
   - In accordance with the commission mandate, no banks were modified, no production code was touched, no governance was amended, and no pull requests were opened.

---

## 2. Methodology

The archaeology followed a disciplined two-stage investigation model designed to avoid conflating historical claims with current repository reality:

### Stage A: Mechanical Discovery & Census
- Comprehensive text and glob scans were conducted across `audit/`, `scratch/`, `Archive/`, `BANK-REVIEW-LEDGER.md`, `PROJECT-HISTORY.md`, `DECISIONS.md`, and git log history.
- Search markers included resource-exhaustion tokens (`defer`, `abandon`, `token limit`, `context capacity`, `tapered`, `sampling`, `spot-check`, `budget`, `residual`, `blocked`).
- Lineages were deduplicated so repeated historical iterations (e.g. Campaign 16 Phase A through Phase E) were consolidated into stable candidate families.
- The resulting inventory was emitted to `candidate-census.jsonl` containing historical artifacts, date ranges, original scopes, and stop reasons.

### Stage B: Full-File Current-State Adjudication
- Bounded repository search tools were deliberately avoided for large-file presence/absence verification. Direct Python scripts inspected all 100% of rows across canonical banks (`banks/claude-canonical.json`, `banks/gemini-canonical.json`, `banks/gpt-canonical.json`, `banks/hard-cases-canonical.json`).
- Hash domains were explicitly checked: raw file bytes, git tree commits, canonical question IDs, and field payloads were distinguished to avoid false declarations of drift.
- Each candidate was assigned one of the 10 constitutional classifications, recording surviving surface, live population, evidence paths, and concrete decision value.

---

## 3. Exact Candidate Counts by Classification

| Classification | Count | Candidate IDs |
|---|:---:|---|
| **`REVIVE_HIGH_VALUE`** | 3 | `CAND-01-SCORED-FORMAT-CONSTRUCT`, `CAND-02-C16-BOUNDARY-EXCEPTIONS`, `CAND-07-BROWSER-AUTOMATION-BASELINE` |
| **`REVIVE_POSSIBLE`** | 2 | `CAND-03-C16-LEGACY-PRIMARY-ANCHORS`, `CAND-08-UNRESOLVED-VITALS-SANITY` |
| **`COMPLETED_ELSEWHERE`** | 14 | `CAND-06`, `CAND-13`, `CAND-14`, `CAND-15`, `CAND-16`, `CAND-17`, `CAND-18`, `CAND-19`, `CAND-20`, `CAND-21`, `CAND-22`, `CAND-23`, `CAND-24`, `CAND-27` |
| **`STALE_ALREADY_IMPLEMENTED`** | 3 | `CAND-10`, `CAND-11`, `CAND-12` (Negative controls verified active in live code) |
| **`DECISION_VALUE_GONE`** | 2 | `CAND-04-C16-PHASE-E-RESIDUAL-192`, `CAND-05-EARLY-BANK-COHERENCE` |
| **`OWNER_DECISION_REQUIRED`** | 2 | `CAND-09-FISHBONE-LAB-PRESENTATION`, `CAND-25-PEDIATRIC-BURN-MAP` |
| **`CURRENT_SUCCESSOR_ALREADY_EXISTS`** | 1 | `CAND-28-UX-0A-0B-0C-SPECS` |
| **`NOT_RESOURCE_DEFERRED`** | 1 | `CAND-26-PARKED-PRODUCT-THREADS` |
| **`SUPERSEDED_BY_PRODUCT_OR_ARCHITECTURE`**| 0 | — |
| **`INSUFFICIENT_EVIDENCE`** | 0 | — |
| **Total** | **28** | **100% cataloged and verified** |

---

## 4. Ranked Revival Candidates

### Rank 1: `CAND-01-SCORED-FORMAT-CONSTRUCT` (GPT Scored-Format Construct Quality Audit)
- **Classification**: `REVIVE_HIGH_VALUE`
- **Surviving Surface**: `banks/gpt-canonical.json` (all 104 items identified in population-first survive live)
- **Live Population**: 104 questions (31 confirmed flawed items recommended for retirement; 14 items requiring surgical repair).
- **Historical Blocker**: In July 2026, an exhaustive audit evaluated 104 complex scored-format items. The audit identified 31 items that violate NCLEX constructs—specifically asking for non-nursing medical specialist calculations (e.g. SOFA score, RSBI, corrected sodium for hyperglycemia), requiring arbitrary 4-letter abbreviation recall, or containing unsolvable stems. The project owner explicitly reviewed and approved retiring these 31 items. However, the execution seat committed a procedural violation by writing intermediate artifacts to `/tmp/population-first.jsonl`, triggering an immediate `BLOCKED_OUTPUT_CONTAMINATION` halt. The mutation never landed, and the task was abandoned during the transition to Campaign 15.
- **Current Live Status**: Direct Python inspection of `banks/gpt-canonical.json` confirms that **all 104 items, including all 31 RETIRE items, are still live in canonical banks today**.
- **Decision Value**: Direct and immediate. Executing these retirements removes 31 clinically invalid questions from learner practice.
- **Prioritization Details**:
  - *Workload*: Small (findings are already documented in `audit/scored-format-construct-audit-2026-07-21/ADJUDICATIONS.md`).
  - *Method*: Mixed pipeline. Validate IDs against live bank, prepare mutation patch, run independent content checker, and obtain owner sign-off.

### Rank 2: `CAND-02-C16-BOUNDARY-EXCEPTIONS` (Campaign 16 Surviving 66 Boundary Exceptions)
- **Classification**: `REVIVE_HIGH_VALUE`
- **Surviving Surface**: 66 case parts across 4 canonical banks:
  - `banks/claude-canonical.json`: 7 parts
  - `banks/gemini-canonical.json`: 6 parts
  - `banks/gpt-canonical.json`: 35 parts
  - `banks/hard-cases-canonical.json`: 18 parts
- **Live Population**: 66 case parts across 66 parent cases.
- **Historical Blocker**: Campaign 16 R4 successfully repaired 385 out of 451 case parts. However, 66 parts had complex or ambiguous unfolding clinical timelines and were left with `answerableAfterStageId: null` (`[revealsAllStages]`). The R4 closeout explicitly recorded these 66 as surviving exceptions to be addressed in successor work.
- **Current Live Status**: Running `npm run audit:stage-refs` on live canonical banks flags **exactly 66 `[revealsAllStages]` exceptions**. In the runtime learner shell, an item with `answerableAfterStageId: null` reveals all prior stages upfront, creating fail-open clinical clue leakage.
- **Decision Value**: Resolves the entire surviving stage-boundary leakage surface across all canonical case studies.
- **Prioritization Details**:
  - *Workload*: Small to moderate (66 parts).
  - *Method*: Whole-parent case packetization. Determine the earliest clinically valid stage at which each part can be answered based on unfolding data, assign `answerableAfterStageId`, and verify with an independent checker.

### Rank 3: `CAND-07-BROWSER-AUTOMATION-BASELINE` (Playwright Browser Test Suite)
- **Classification**: `REVIVE_HIGH_VALUE`
- **Surviving Surface**: `package.json`, `src/App.tsx`, `src/visuals/**`
- **Live Population**: 1 core application test surface.
- **Historical Blocker**: Deferred throughout the project because early focus was on Vite static build and unit testing. `AGENTS.md` notes: *"Add focused regression tests or browser automation if tooling becomes available."* `PROJECT-HISTORY.md` line 2601 lists browser automation as an unfulfilled backlog item.
- **Current Live Status**: Inspection of `package.json` confirms no Playwright or Puppeteer dependency exists. UI verification currently relies on manual smoke testing and unit-level SVG math tests (`test-visuals`).
- **Decision Value**: High engineering value. Provides an automated CI regression harness for visual stimuli (rhythm strips, burn maps, fetal monitoring, lab trend), bilingual language toggling, and offline session state persistence.
- **Prioritization Details**:
  - *Workload*: Moderate.
  - *Method*: Add `@playwright/test` to devDependencies, write a lightweight smoke suite (`scripts/test-browser.ts`) testing session startup, question rendering, and translation toggling against `vite preview`.

### Rank 4: `CAND-03-C16-LEGACY-PRIMARY-ANCHORS` (75 Strict-Only Stage-Ref Findings)
- **Classification**: `REVIVE_POSSIBLE`
- **Surviving Surface**: 75 case parts: `claude` (1), `gemini` (8), `gpt` (34), `hard-cases` (32).
- **Live Population**: 75 parts.
- **Current Live Status**: Running `npm run audit:stage-refs -- --strict` flags 75 parts with `[missingRequiredAnchor]`. In these parts, `question.stageId` is populated with a valid stage ID, but `question.caseStudyContext.answerableAfterStageId` is null or missing.
- **Decision Value**: Unlike CAND-02, these parts do not fail open if runtime falls back to `stageId`. However, they create contract bifurcation. Fixing them enables enforcing strict stage-ref validation in the PR promotion gate.
- **Prioritization Details**:
  - *Workload*: Small (purely mechanical migration script copying `stageId` to `answerableAfterStageId`).
  - *Method*: Cheap mechanical script followed by strict CI gate activation.

### Rank 5: `CAND-08-UNRESOLVED-VITALS-SANITY` (Unresolved Vital Sanity Bounds)
- **Classification**: `REVIVE_POSSIBLE`
- **Surviving Surface**: `src/audit/measurementAllowlist.ts`, `scripts/audit/measurements.ts`
- **Live Population**: 4 physiological measurement checks.
- **Historical Blocker**: Decision P26 enacted production sanity bounds for SBP (400 mmHg), RR (150 /min), and SpO2 (0-100%). However, P26 explicitly recorded `Status: REVISIT` for: (1) DBP ceiling, (2) MAP ceiling, (3) minimum core body temperature floor, and (4) lab SaO2 vs pulse oximetry SpO2 floor.
- **Current Live Status**: Still parked in `DECISIONS.md`.
- **Decision Value**: Prevents unphysiological blood pressure or temperature values from entering banks through raw imports.
- **Prioritization Details**:
  - *Workload*: Small. Survey live bank distributions for DBP/MAP/temp, establish clinical thresholds, update `measurementAllowlist.ts`.

---

## 5. High-Value New Audit Ideas Suggested by Recurring Historical Defect Families

Archaeological analysis of past audits revealed recurring systemic failure patterns that suggest **better-scoped, corpus-wide audits** rather than merely rerunning narrow historical scripts:

### 1. Whole-Corpus Non-Nursing Specialist Construct Purge
- *Observed Defect Pattern*: In `CAND-01`, 31 items in `gpt-canonical.json` were found asking for physician-level or intensive-care specialist formulas (SOFA scoring, rapid shallow breathing index [RSBI], formulaic corrected sodium, pulmonary vascular resistance). LLMs prompted to generate "hard NCLEX questions" routinely confuse high-acuity nursing prioritization with specialist medical math.
- *Proposed New Audit*: An exhaustive, corpus-wide regex and semantic sweep across all 4 canonical banks (~3,100 questions) targeting non-nursing diagnostic and calculation terms:
  - Hemodynamic calculations: SVR, PVR, oxygen content ($CaO_2$), alveolar-arterial gradient.
  - Specialized medical risk scores: APACHE, SOFA, MELD, TIMI.
  - Arbitrary acronym recall: fill-in-the-blank items requiring specific 4-letter abbreviations.
- *Expected Decision Value*: High. Purges remaining out-of-scope specialist questions across Claude, Gemini, and Hard Cases banks.

### 2. Standalone Closed-World Answerability Sweep
- *Observed Defect Pattern*: In `CAND-14` (bowtie answerability) and multiple matrix audits, items originally authored as case-study parts were stripped into standalone questions during batch conversions. These orphaned items frequently referenced client data that existed only in the lost parent case.
- *Proposed New Audit*: A deterministic heuristic sweep identifying standalone questions (MCQ, SATA, Bowtie) that contain referential pronouns ("the client's previous labs", "the morning assessment", "the medication administered earlier") without providing the underlying assessment in the stem or stimulus.

### 3. Strict Case-Stage CI Gate Promotion
- *Observed Defect Pattern*: Recurring regressions in case study stage references occurred because `audit:stage-refs` was maintained as an advisory script rather than a blocking CI gate.
- *Proposed Action*: Once `CAND-02` (66 exceptions) and `CAND-03` (75 legacy anchors) are resolved, update `.github/workflows/promotion-gate.yml` to run `npm run audit:stage-refs:strict`, permanently preventing stage-boundary drift.

---

## 6. Explicit Do-Not-Revive List

The following tasks must **NOT** be reopened, despite historical records describing them as incomplete:

### 1. Campaign 16 Phase E Residual-192 Semantic Census (`CAND-04`)
- **Reason**: The owner closeout on 2026-09-08 explicitly distinguished between an inability to complete the census and proof of infeasibility. In R4, 385 of the 451 candidate rows were repaired structurally, completely eliminating the fail-open vulnerability. The owner explicitly prohibited reopening the 451-row semantic review because structural repairs made subjective semantic reading redundant.
- **Verdict**: `DECISION_VALUE_GONE`. Zero engineering or content value.

### 2. Early-Bank Keyword Co-occurrence Coherence Track (`CAND-05`)
- **Reason**: The historical attempt to find clinical contradictions by pairing items sharing high-frequency keywords generated 1,039 candidate pairs. Spot-checking 100 pairs revealed a **98% false-alarm rate**. Subsequent clinical reviews, bowtie audits, and ledgered passes addressed genuine clinical contradictions.
- **Verdict**: `DECISION_VALUE_GONE`. Keyword pairing is an unviable heuristic that wastes hundreds of human/agent review hours.

---

## 7. Stale/Completed Work Caught by Current-State Verification

A critical risk in audit archaeology is resurrecting work that was already completed in later unlinked commits. The following candidates were proven by live disk inspection to be already implemented or completed:

1. **Bank Provenance & Preview Lab Newest Additions (`CAND-10`)**: Negative control. Fully implemented in `scripts/bank-provenance.ts`, tested in `scripts/tests/bank-provenance.ts`, and active in `src/App.tsx` (commit `a233214`).
2. **R5 Vital Sanity Production Implementation (`CAND-11`)**: Negative control. Production bounds for SBP (400), RR (150), and SpO2 (0-100%) are active in `src/audit/measurementAllowlist.ts` and `scripts/audit/measurements.ts`.
3. **R6 Pull-Request CI Gate Expansion (`CAND-12`)**: Negative control. Active in `.github/workflows/promotion-gate.yml`.
4. **Terminal-Sentence Semantic Census (`CAND-13`)**: Completed in PR #78 (commit `6bc81eb`).
5. **Standalone Bowtie Answerability (`CAND-14`)**: Completed in Campaign 15 Phase D (commit `cea79bd`).
6. **July 16 Outer Ring Construct Dispositions (`CAND-15`)**: Completed in commit `0784c98` (37 retired, 13 quarantined, 58 approved).
7. **Temperature Prose Unit Normalization (`CAND-16`)**: Completed in commit `a10d29e` (483 units converted to Fahrenheit first with Celsius in parentheses).
8. **WBC & Platelet Prose Normalization (`CAND-17`)**: Completed in commit `018f7b0`.
9. **Authorial & Producer Vocabulary Leakage (`CAND-18`)**: Eradicated in commits `1b64425` and `408a470`.
10. **June 13 Matrix Swap Regression (`CAND-19`)**: Forensically investigated and repaired in commit `e23962e7` (8 corrupted leaves restored).
11. **Topic Vocabulary & License Migration (`CAND-20`)**: Completed; 0 unregistered topics exist at current HEAD.
12. **Single-Row Lab Panels Survey (`CAND-21`)**: Codified in Decision P29.
13. **Lab Reference-Range Verification (`CAND-22`)**: Adult teaching bands codified in `src/visuals/kinds/lab_trend/defs.ts`.
14. **Non-MCQ Positional Bias Audit (`CAND-23`)**: Adjudicated in PR #48 (commit `b4fcd48`) and Decision P16.
15. **Case Completion Reconciliation (`CAND-24`)**: Codified via 4-6 item schema tolerance.
16. **Question Forge Raw Intake (`CAND-27`)**: Promoted and ledgered in commit `890f2a7`.

---

## 8. Tooling and Hash Pitfalls Encountered

During the archaeological discovery and verification phases, two major tooling/verification pitfalls were documented:

1. **Hash Domain Mismatches**:
   - Historical records frequently quote SHA-256 hashes without specifying the domain.
   - For example, raw file-byte SHA-256 changes on every whitespace reformatting; git blob SHA-1 changes on any line edit; while question payload SHA-256 remains invariant under key reordering.
   - *Discipline Applied*: Never declare drift solely based on hash mismatches. Live verification compared stable question IDs and exact payload fields directly against current canonical JSON files.

2. **Bounded Search Interfaces vs Full-File Inspections**:
   - Canonical bank files (`banks/gpt-canonical.json` at 1.7MB, `banks/gemini-canonical.json` at 1.5MB) exceed typical search-tool line and buffer limits.
   - Bounded search tools can falsely report that a question ID or pattern is absent.
   - *Discipline Applied*: All live population verifications were executed using standalone Node/TypeScript and Python scripts reading 100% of bytes and parsing complete JSON structures.

---

## 9. Recommended Next 1–5 Commissions in Order

Based on decision value, engineering tractability, and clinical safety, the recommended successor commissions are:

### Commission 1: GPT Scored-Format Construct Retirement & Repair (`CAND-01`)
- **Objective**: Execute the 31 question retirements and 14 surgical repairs in `banks/gpt-canonical.json` documented in `audit/scored-format-construct-audit-2026-07-21/ADJUDICATIONS.md`.
- **Target File**: `banks/gpt-canonical.json`.
- **Deliverables**: Mutation PR, `npm run audit`, `npm run census`, and `BANK-REVIEW-LEDGER.md` update.
- **Estimated Effort**: Small (findings already established).

### Commission 2: Campaign 16 Surviving 66 Boundary Exceptions (`CAND-02`)
- **Objective**: Eliminate all fail-open stage leakage in case studies by assigning valid `answerableAfterStageId` anchors to the 66 surviving exception parts.
- **Target Files**: `banks/claude-canonical.json`, `banks/gemini-canonical.json`, `banks/gpt-canonical.json`, `banks/hard-cases-canonical.json`.
- **Method**: Whole-case clinical review to establish earliest answerable stage.
- **Estimated Effort**: Small to moderate (66 items).

### Commission 3: Mechanical Migration of 75 Strict-Only Case-Stage Anchors (`CAND-03`)
- **Objective**: Copy legacy `stageId` to `caseStudyContext.answerableAfterStageId` for the 75 parts flagged by `npm run audit:stage-refs -- --strict`.
- **Outcome**: Resolves schema bifurcation and enables adding `--strict` to `.github/workflows/promotion-gate.yml`.
- **Estimated Effort**: Small (purely deterministic script).

### Commission 4: Automated Headless Browser Baseline (`CAND-07`)
- **Objective**: Add Playwright test suite to `package.json` and CI covering study session startup, visual question rendering, and bilingual language toggles.
- **Target Files**: `package.json`, `scripts/test-browser.ts`, `.github/workflows/promotion-gate.yml`.
- **Estimated Effort**: Moderate.

### Commission 5: Corpus-Wide Non-Nursing Specialist Formula Purge (New Audit)
- **Objective**: Scan all 4 canonical banks (~3,100 questions) for out-of-scope physician/specialist formulas (hemodynamic math, ICU scoring systems, abbreviation guessing) following the pattern exposed in CAND-01.
- **Target Files**: All files in `banks/*.json`.
- **Estimated Effort**: Moderate.

---

## 10. Execution Metrics and Limitations

- **Candidate Families Discovered**: 28 distinct historical lineages.
- **Candidate Families Current-State Checked**: 28 (100%).
- **Live Bank Rows Inspected**: 100% of items across all canonical banks (over 3,100 questions and cases parsed in `banks/*.json`).
- **Tooling Limitations**: Successfully bypassed bounded search limits by utilizing full-file Python/Node streaming scripts.
- **Context Management**: Clean execution under compaction using structured scratchpads and state recovery.
- **Incomplete Candidates**: 0. Every candidate was fully adjudicated.
- **Runtime / Wall Clock**: Total archaeological execution completed in approximately 18 minutes.
- **Limitations**: This report constitutes an advisory research backlog. It does not authorize content mutations, code changes, or ledger promotions without explicit owner authorization and independent review.
