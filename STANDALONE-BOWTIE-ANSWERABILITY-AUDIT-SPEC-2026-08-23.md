# Standalone Bow-Tie Answerability Audit — Architect Spec

**Date:** 2026-08-23  
**Revision:** 2.3  
**Status:** READY FOR FINAL INDEPENDENT SPEC RE-REVIEW — EXECUTION BLOCKED ONLY ON SPEC ACCEPTANCE  
**Commission type:** read-only semantic census / adjudication  
**Primary reviewer model:** GPT-5.6 Sol, high effort, one isolated review context per candidate  
**Repository:** Project Shrimp / NCLEX Bilingual Prep

## 1. Purpose

Audit the complete live population of case-derived standalone `bowtie` capstones for a specific construct defect: a supposedly standalone item may have been authored as a companion to an unfolding `case_study` and may therefore depend on facts that exist only in the sibling case, its exhibits/stages, its rationale, or other case-family material.

The forcing incident was `gpt_case_nine_month_well_child_safety_01_bowtie`. Before its 2026-08-23 repair, its keyed monitoring/evaluation targets and distractor logic imported dietary, hemoglobin, developmental-screening, broad safety-teaching, and relationship-context facts that were not present in its standalone stem. The item could render and grade correctly while still failing as a standalone assessment object.

That one item has now completed its bounded same-ID answerability repair, independent non-GPT review, companion-dose correction, and final family-dose harmonization. The accepted content chain is landed through `c2ff546` and the family now consistently uses the source-verified 3.75 mL reference dose. This commission is **not** authorization to repair any other item. It is an exhaustive inventory and semantic adjudication of the live case-derived standalone-bowtie population against the frozen post-repair bank snapshot.

## 2. Governing sources, execution precondition, and session start

Before doing any audit work:

1. Read `AGENTS.md` from live disk.
2. Read the current bowtie contract in `NCLEX-Question-Schema.md` and, when needed, verify runtime shape against `src/types.ts`, `src/schema.ts`, and `src/grading.ts`.
3. Read `PROJECT-HISTORY.md` only as a status map, not as authority over live bank bytes.
4. Generate the candidate population before consulting `BANK-REVIEW-LEDGER.md`; provenance/status context must not influence population inclusion.
5. Record branch, HEAD, upstream relation, and worktree status.
6. Preserve all unrelated worktree changes. Governance commit `24be545` has already landed the previously dirty `DECISIONS.md` work; `DECISIONS.md` is outside this commission and must not be edited, staged, restored, or incorporated by the audit.

### Hard execution precondition

**Do not start Phase A until this Revision 2.3 spec is independently accepted.** The content-side precondition is now satisfied:

- `ca7f5e0` landed the independently approved standalone answerability repair;
- `a237d18` landed the independently approved companion acetaminophen dose correction;
- `c2ff546` landed the independently approved standalone family-dose harmonization;
- `banks/*.json` must have no uncommitted changes at audit start;
- `c2ff546` is the required repair-resolution bank baseline unless a later owner-authorized bank-content commit intentionally supersedes it before audit execution;
- the starting SHA-256 set for every bundled `banks/*.json` must be recorded in the audit `verification.md` before semantic dispatch;
- all 31 live reviews and the current-live pilot must use exactly those frozen live bank bytes.

The earlier Revision-2 dirty-state notes are superseded: the former `DECISIONS.md` modification landed separately in governance commit `24be545`, and the bank repairs are settled. Any new dirty bank path at audit start is a fresh blocker, not part of the accepted baseline.

The repository and frozen canonical bank bytes are the source of truth. Prior chats, model memory, and old audit reports are orientation aids only.

## 3. Hard scope boundary

### In scope

- Deterministic discovery of the live case-derived standalone `bowtie` population.
- Generation of two-stage blind review packets with opaque identities.
- One isolated GPT-5.6 Sol/high semantic review per live candidate.
- A separate historical positive-control calibration probe, excluded from live population counts.
- Post-blind comparison with the canonical key.
- Delayed inspection of the sibling case to classify hidden dependencies and provenance.
- A complete 31/31 live census if the widened deterministic pairing rule yields the expected population.
- Recording collateral clinical, bilingual, or logic concerns as findings when they are encountered.

### Explicitly out of scope

- No canonical bank edits.
- No same-ID repairs.
- No retirements or replacements.
- No raw-bank generation or promotion.
- No changes to answer keys, rationales, token text, stems, metadata, schema, grading, runtime, or UI.
- No ledger status upgrade or downgrade for any candidate.
- No `PROJECT-HISTORY.md` status entry.
- No `DECISIONS.md` edit.
- No census regeneration.
- No aggregate-audit fatality-policy change.
- No commit or push unless a later owner instruction separately authorizes repository publication of the audit artifacts.

If the audit finds a defect, record it. Do **not** fix it during this commission.

## 4. Deterministic population definition

Derive the population from current bundled top-level canonical banks; do not use a hand-maintained candidate list as the authority.

A top-level question is in the audit population when all of the following are true:

1. `itemType === "bowtie"`.
2. Its ID ends exactly in `_bowtie`.
3. Removing that terminal `_bowtie` yields `baseId`.
4. Exactly one top-level bundled `case_study` matches by one of the following pairing rules:
   - `EXACT`: case ID equals `baseId`; or
   - `ORDINAL_SUFFIX`: case ID matches `baseId + /_\d{2}$/`.
5. The resolved sibling is a top-level `itemType === "case_study"`.

Prefer no rule silently. Resolve all eligible matches first, then fail loud if more than one case matches a bowtie under the combined rule. The paired case and bowtie may be in the same canonical bank or different canonical banks; search the entire bundled canonical corpus before deciding a pair is absent.

The `ORDINAL_SUFFIX` rule exists because the live Opus lithium family uses `opus_case_lithium_toxicity_bowtie` with sibling `opus_case_lithium_toxicity_01`, while the dominant GPT cohorts suffix both members consistently.

Record and fail loud on:

- duplicate top-level IDs,
- more than one sibling case matching a bowtie under the combined rule,
- an exact or ordinal-suffix match that resolves to a non-case item,
- population records that do not satisfy the current bowtie structural contract.

### Expected population

The verified Revision-2 checkpoint is **31** live paired standalone bowties: the 30 candidates found by the original exact rule plus `opus_case_lithium_toxicity_bowtie` recovered by `ORDINAL_SUFFIX` pairing. Treat 31 as a checkpoint that must be reproduced from live bytes, not as permission to force the result.

The inventory artifact must state:

- actual live count,
- expected count (`31`),
- exact candidate IDs,
- exact companion case IDs,
- bank/path for both objects,
- pairing rule (`EXACT` or `ORDINAL_SUFFIX`).

If the deterministic live count is not 31, do not trim, pad, or infer missing rows. Produce the inventory and a population-delta note, then stop before semantic review dispatch for architect review.

Every population member must also have exactly 3 condition tokens, 4 action tokens, 4 parameter tokens, and canonical key cardinality 1/2/2. Fail loud and stop before packet generation on any deviation. The fixed `C1..C3` / `A1..A4` / `P1..P4` semantic-label contract in this commission is intentionally defined only for the verified 3/4/4 population. If a deterministically paired population member has another contract-valid cardinality, **do not exclude it to preserve the count**; record the deviation and stop for a spec revision that generalizes the harness.

## 5. Live pilot and historical positive-control calibration

### Seven-item live pilot

Run the first semantic pass on seven current live candidates. The original six recovered June cases are retained, and the Opus lithium pair is added to exercise the second producer/naming convention and the widened pairing rule.

Live pilot IDs:

1. `gpt_case_caregiver_role_strain_dementia_01_bowtie`
2. `gpt_case_infection_control_clustered_care_01_bowtie`
3. `gpt_case_nine_month_well_child_safety_01_bowtie`
4. `gpt_case_opioid_recovery_relapse_risk_01_bowtie`
5. `gpt_case_overdue_preventive_screening_01_bowtie`
6. `gpt_case_pressure_injury_prevention_mobility_01_bowtie`
7. `opus_case_lithium_toxicity_bowtie`

Audit the **frozen current live payloads**. The nine-month item is not labeled as a known defect, repair, or control inside any blind material and has no predetermined live verdict.

### Historical positive-control calibration probe

Before scaling beyond the seven live pilot rows, run one **out-of-population calibration probe** through the identical two-stage blind-review path using the pre-repair nine-month payload from the immutable Git object:

`0179fb2223c3329fab182fd84685fb3657ab2613:banks/gpt-canonical.json`

Extract `gpt_case_nine_month_well_child_safety_01_bowtie` from that historical object. Do not reconstruct it from memory and do not substitute the working-tree repair patch when the Git object is available.

The calibration probe:

- lives under a separate `calibration/` artifact lane;
- is associated with its own control-manifest row, but no candidate/surrogate identity is exposed to the semantic reviewer;
- is excluded from the 31/31 population count, verdict totals, repair-priority totals, and live report denominator;
- exists only to prove that the method can surface the forcing defect.

Before dispatching the calibration probe, write an immutable calibration-sensitivity checklist in the control lane with exactly these three pre-registered premise families, each initialized `found: false`:

1. dietary/hemoglobin follow-up;
2. developmental-screening evaluation;
3. broad safety-teaching content.

After the blind calibration review is locked, score each checklist row `found: true|false` only from explicit `MISSING_CLIENT_FACT` evidence in the mandatory token-premise table and record the supporting opaque token label(s). Do not add, remove, merge, or reinterpret checklist families after seeing the calibration result.

The method is **not accepted for scale-up** unless all three pre-registered families are surfaced and scored `found: true`. A mere mismatch or match against the historical canonical key is insufficient.

After all seven live pilot reviews and the calibration probe are complete, validate packet shape, reviewer-output shape, adjudication logic, no-leak proofs, and calibration sensitivity. If the method needs revision, stop, revise the commission, regenerate the entire pilot/calibration set from scratch, and do not reuse contaminated semantic reviews.

## 6. Phase A — deterministic inventory, opaque mapping, and snapshot

Create a read-only audit implementation under an audit/maintenance lane. The exact implementation filename may follow current repo conventions, but it must not alter an established aggregate gate.

For every live candidate, record at minimum in the non-blind population manifest:

- `surrogateId` — opaque `CAND-01`…`CAND-31`, assigned deterministically by ascending real candidate ID;
- `candidateId`;
- `candidateBankPath`;
- deterministic JSON path / top-level ordinal;
- `companionCaseId`;
- `companionBankPath`;
- companion path / ordinal;
- `pairingRule` — `EXACT` or `ORDINAL_SUFFIX`;
- bank schema version;
- category;
- topic;
- difficulty;
- `ngnSkill` when present;
- token counts for condition/actions/parameters;
- current canonical key cardinality;
- SHA-256 of the complete candidate payload;
- SHA-256 of Stage-1 blind input;
- SHA-256 of Stage-2 blind input;
- `pilot: true|false`.

The surrogate-to-real-ID mapping exists only in non-blind audit control artifacts. The semantic reviewer does not need any question identity at all: real ID, surrogate ID, bank/path, ordinal, producer, topic/category, difficulty, `ngnSkill`, hashes, pairing rule, pilot membership, and provenance remain orchestration-only metadata and must never appear in a semantic-review prompt before unblinding.

For each candidate, also construct a deterministic opaque token map retained outside the blind packets:

- real condition token IDs → `C1`, `C2`, `C3` in live token order;
- real action token IDs → `A1`…`A4` in live token order;
- real parameter token IDs → `P1`…`P4` in live token order.

The semantic reviewer must never see internal token IDs before unblinding.

Recommended artifact root:

`audit/standalone-bowtie-answerability-census-2026-08-23/`

Recommended files:

- `population.jsonl`
- `population-summary.md`
- `blind-packets/CAND-XX-stage1.json`
- `blind-packets/CAND-XX-stage2.json`
- `blind-reviews/CAND-XX-stage1.json`
- `blind-reviews/CAND-XX-stage2.json`
- `adjudication.jsonl`
- `calibration/`
- `report.md`
- `verification.md`

Do not put real candidate IDs in blind filenames. Surrogate-bearing filenames are control-layer storage only and must not be shown or quoted to the semantic reviewer; the harness passes parsed blind content, not a repository path or filename. Do not reuse the existing one-item repair directory `audit/standalone-bowtie-answerability-2026-08-23/` as the broad-census output directory.

## 7. Phase B — two-stage blind packet contract

The blind review asks two different questions:

1. **Stage 1 — stem sufficiency without pools:** what condition, two priority actions, and two evaluation/monitoring parameters does the standalone stem itself lead a competent reviewer to generate?
2. **Stage 2 — pool-constrained answerability:** after seeing the learner-facing token text, can the reviewer rank the pools without relying on hidden patient facts?

### Stage-1 blind input

Expose only:

- exact English standalone stem;
- a generic instruction to free-generate one most likely condition, two priority nursing actions, and two monitoring/evaluation parameters.

Do **not** expose any question identity or metadata: no real candidate ID, surrogate ID, filename/path, bank, ordinal, producer, category, topic, difficulty, `ngnSkill`, pilot/control status, token pools, token IDs, key, rationale, Chinese text, sibling information, provenance, hashes, or prior verdicts.

### Stage-2 blind input

After the Stage-1 response is serialized and hashed, reveal only:

- exact English standalone stem;
- learner-facing condition/action/parameter prompts when those prompts exist in the item;
- exact English token text in live order, labeled only with neutral positional labels `C1..C3`, `A1..A4`, `P1..P4` so the reviewer can return selections without seeing internal token IDs.

Do **not** expose:

- real candidate ID or surrogate ID;
- filename/path, bank, ordinal, producer, pilot/control status, hashes, or pairing rule;
- real token IDs;
- category, topic, difficulty, or `ngnSkill`;
- `condition.correct`, `actions.correct`, or `parameters.correct`;
- any rationale or `rationale.byChoice`;
- `testTakingStrategy`;
- glossary;
- Chinese text;
- companion case ID or material;
- source/provenance notes;
- ledger status;
- prior audit verdicts;
- forcing-incident or repair labels.

The packet is a projection of exact learner-facing English strings. Do not paraphrase stem or token text.

### Leakage regression

Focused tests must prove that each semantic-review payload:

- contains only the permitted learner-facing schema for that stage;
- contains no real candidate ID, surrogate ID, companion case ID, filename/path, bank/ordinal, producer, category/topic/difficulty/`ngnSkill`, pilot/control label, hash, pairing rule, or provenance field;
- contains none of the real token IDs;
- contains no key/rationale/strategy/glossary fields;
- uses neutral positional token labels only in Stage 2;
- is passed to the reviewer as parsed content rather than by repository path, so storage filenames cannot become side-channel identity hints.

Do not rely on broad regexes alone; compare against the exact control-manifest values for candidate ID, surrogate ID, companion ID, metadata, and all 11 real token IDs.

## 8. Phase C — one isolated Sol/high review per candidate

Use **GPT-5.6 Sol at high effort for every live candidate and the calibration probe**. Do not downgrade individual rows for cost. Use one isolated semantic-review context per candidate so earlier verdicts, known defects, real IDs, sibling-case facts, or calibration findings cannot prime later reviews.

The semantic reviewer receives only the current stage's blind input and the review rubric. The orchestration layer binds the returned record to the correct control-manifest row after the call; identity is not a reviewer output field and need not be echoed by the model.

### Stage-1 required output

Return structured output containing at least:

- free-generated `condition`;
- exactly two free-generated `priorityActions`;
- exactly two free-generated `evaluationParameters`;
- `stemEvidence[]` linking each generated target to exact or precisely identified stem facts;
- `missingInformation[]` needed to make those free-generated targets more specific or unique;
- `stage1Confidence` — `high`, `medium`, or `low`;
- concise reasoning.

Stage 1 must be serialized and hashed before Stage 2 is revealed.

### Stage-2 required output

Return structured output containing at least:

- selected `conditionLabel` — exactly one of `C1..C3`;
- selected `actionLabels` — exactly two of `A1..A4`;
- selected `parameterLabels` — exactly two of `P1..P4`;
- `selectionEvidence[]` — for each of the five selected opaque labels, quote or precisely identify the standalone stem fact(s) supporting the selection;
- `ambiguousAlternatives[]` — competing opaque labels that remain reasonably selectable from the standalone information;
- `missingInformation[]` — facts needed to choose uniquely but absent from the standalone stem;
- `poolAnswerability` — `ANSWERABLE`, `UNDERDETERMINED`, or `NOT_ANSWERABLE`;
- `stage2Confidence` — `high`, `medium`, or `low`;
- concise reasoning;
- a mandatory token-premise table containing **exactly one row for every token in all three pools**.

### Mandatory token-premise table

Every `C*`, `A*`, and `P*` token gets a row. No open-list omission is allowed.

Each row must contain:

- `opaqueTokenLabel`;
- `premiseStatus` — one of:
  - `SUPPORTED_EXPLICIT` — the needed client-specific premise appears in the standalone stem;
  - `SUPPORTED_GENERAL_KNOWLEDGE` — the token follows from explicit stem facts plus ordinary clinical knowledge and requires no missing client-specific fact;
  - `MISSING_CLIENT_FACT` — understanding or judging the token requires a client-specific fact absent from the stem;
  - `CONTRADICTED` — explicit stem facts conflict with the token;
  - `NO_CLIENT_PREMISE` — generic distractor/statement that introduces no hidden patient-specific premise;
- `supportingStemText` — quote or precise pointer when supported;
- `missingPremise` — exact absent patient/caregiver/history/order/exhibit/intervention/evaluation fact when status is `MISSING_CLIENT_FACT`;
- `rankabilityImpact` — `NONE`, `LOW`, or `MATERIAL`, with one-sentence justification.

`SUPPORTED_GENERAL_KNOWLEDGE` may not be used to smuggle in an absent patient value, prior intervention, clinician order, history, test result, follow-up plan, caregiver behavior, or treatment response. Ordinary nursing inference is allowed only when all client-specific premises needed for the inference are already in the stem.

The reviewer must not search the repository for the candidate, inspect sibling case material, infer identity from filenames or IDs, or ask another model for the canonical answer. General nursing knowledge is allowed. If a time-sensitive clinical claim must be checked, current authoritative external references may be consulted, but external research may not be used to invent client-specific facts absent from the packet.

## 9. Phase D — lock both blind stages before unblinding

For each candidate:

1. Run Stage 1 in an isolated context.
2. Serialize Stage-1 output canonically and record its SHA-256.
3. Reveal Stage-2 input only after the Stage-1 hash is fixed.
4. Serialize Stage-2 output canonically and record its SHA-256.
5. Treat both blind records as immutable thereafter.

No reviewer may revise Stage 1 after seeing token pools, or revise Stage 2 after seeing real token IDs, canonical keys, rationales, sibling cases, or provenance. Later adjudication may explain disagreement but must not rewrite blind records.

## 10. Phase E — canonical comparison, still before sibling inspection

After both blind stages are locked, expose the current canonical bowtie keys and complete standalone item to the adjudication seat.

Record:

- exact five-target canonical set;
- `blindExactMatch` — whether Stage-2 1/2/2 selection matches all five canonical targets after opaque-label mapping;
- `stage1Alignment` — qualitative `FULL`, `PARTIAL`, or `NONE` alignment of free-generated targets with the canonical construct, with explanation;
- per-target support classification for each canonical target;
- whether any canonical target depends on a fact absent from the standalone stem;
- whether any distractor contains an absent client-specific premise and whether that absence materially affects rankability;
- whether the canonical set is uniquely defensible from standalone material.

Use these adjudication support classifications:

- `DIRECT` — explicit stem fact(s) support the token.
- `GENERAL_KNOWLEDGE_LINK` — the token follows from explicit stem facts plus ordinary clinical knowledge; no missing client-specific fact is needed.
- `MISSING_CLIENT_FACT` — choosing, interpreting, or justifying the token requires a client-specific fact absent from the stem.
- `CONTRADICTED` — presented stem facts conflict with the token.
- `NOT_APPLICABLE` — generic unselected distractor whose evaluation does not require a hidden patient-specific premise.

A blind mismatch is evidence, not automatically proof that the canonical item is defective. A blind exact match is also **not evidence by itself that the item is standalone-answerable**. Pool elimination can reproduce a key even when the keyed targets import hidden facts. The token-premise table and Stage-1 free generation are the primary detection surfaces.

Before any sibling-case material is opened, serialize the complete Phase E standalone-adjudication record canonically and record its SHA-256. Treat that Phase E record as immutable. Phase F may add provenance classifications, final primary-verdict resolution, and secondary flags, but it may not revise any Phase E support classification, rankability judgment, `stage1Alignment`, or `blindExactMatch` diagnostic.

## 11. Phase F — delayed sibling-case inspection

Only after the Phase E standalone-adjudication record is serialized, hashed, and locked may the auditor inspect the companion `case_study`, exhibits/stages, embedded questions, and historical source material.

This phase answers provenance and explanatory questions; it must not rescue a standalone defect.

For every `MISSING_CLIENT_FACT`, classify the source as:

- `SIBLING_CASE_IMPORTED` — the absent fact is present in the paired case/exhibits/stages;
- `RATIONALE_ONLY` — the standalone rationale adds a fact the stem does not;
- `UNSUPPORTED_ANYWHERE_CHECKED` — the premise is not found in the standalone stem or sibling material examined;
- `OTHER_PROVENANCE` — exact source recorded.

Also ask for every canonical target, including generically phrased targets:

- Does the sibling case contain an exhibit value, prior intervention, order, history element, response, or follow-up endpoint that maps unusually closely to this token but is absent from the standalone stem?
- If yes, is that sibling fact **necessary** to justify/rank the token, or does it merely **corroborate** a token already justified by explicit standalone facts plus ordinary clinical knowledge?

Record `SIBLING_CORROBORATION_ONLY` when sibling material overlaps but is not necessary for standalone reasoning. Do not fail an item merely because the sibling contains richer evidence for a token that is independently justified from the standalone stem.

Sibling inspection must never retroactively upgrade a standalone verdict. If the learner needed the sibling fact, the standalone item failed even if the missing fact exists elsewhere in the repo.

## 12. Verdict taxonomy

Each live candidate receives exactly one primary verdict plus zero or more secondary flags. A `PASS_STANDALONE` row may carry non-fatal secondary flags.

Primary verdicts are evaluated in this fixed precedence order:

1. `FAIL_HIDDEN_CASE_DEPENDENCY`
2. `FAIL_UNSUPPORTED_TOKEN_PREMISE`
3. `FAIL_UNDERDETERMINED`
4. `FAIL_CANONICAL_KEY_OR_LOGIC`
5. `HOLD_REVIEWER_DISAGREEMENT`
6. `PASS_STANDALONE`

The first definition satisfied is the sole primary verdict. If lower-precedence definitions are also satisfied by the same immutable Phase E evidence plus Phase F provenance classifications, record them only as diagnostic secondary flags using `ALSO_SATISFIES_<VERDICT_NAME>`; they never compete for primary status. This precedence is fixed before the pilot and may not be tuned from observed outcomes.

### `PASS_STANDALONE`

All of the following must hold:

- every canonical keyed target is supported by the standalone stem directly or through ordinary clinical knowledge that requires no missing client-specific premise;
- the 1/2/2 canonical set is uniquely defensible over the distractors;
- no keyed target requires a missing client-specific fact;
- any non-keyed token with an absent client-specific premise remains comprehensible and rejectable without that premise, so the absence does not materially affect rankability;
- the response demand is coherent as a standalone five-target synthesis.

A PASS may carry `DISTRACTOR_PATIENT_FACT_INVENTION` / advisory `P2` when a non-keyed token contains an unnecessary absent patient-specific premise but remains clearly rankable without it.

### `FAIL_HIDDEN_CASE_DEPENDENCY`

At least one **keyed** target needs a client-specific fact absent from the standalone stem and that fact is found in the sibling case or case-derived material.

A non-keyed hidden case fact also triggers this primary failure when the missing premise has `MATERIAL` rankability impact and sibling inspection confirms that the needed fact is imported from the sibling case.

### `FAIL_UNSUPPORTED_TOKEN_PREMISE`

Use when:

- a keyed target requires a missing client-specific premise not found in the sibling material checked; or
- a non-keyed token requires an absent client-specific premise with `MATERIAL` rankability impact, regardless of whether the premise is later found in non-sibling material. When Phase F classifies the needed premise as `SIBLING_CASE_IMPORTED`, `FAIL_HIDDEN_CASE_DEPENDENCY` governs instead.

Do **not** use this primary verdict merely because a rejectable distractor contains an unnecessary invented detail. That case remains PASS-eligible with `DISTRACTOR_PATIENT_FACT_INVENTION` and advisory `P2`.

### `FAIL_UNDERDETERMINED`

The standalone information permits more than one reasonably defensible 1/2/2 answer set, or the stem lacks information required to distinguish canonical targets from competing tokens.

### `FAIL_CANONICAL_KEY_OR_LOGIC`

The standalone stem supports a clear answer set, but the current canonical key materially disagrees with that set, or a canonical action/parameter is clinically/logically incoherent from the presented state without merely being a hidden-case omission.

### `HOLD_REVIEWER_DISAGREEMENT`

Use only when the blind review and canonical comparison conflict but the evidence is insufficient for a defensible primary pass/fail classification. These rows require independent adjudication; do not force them into PASS.

### Secondary flags

Use secondary flags when applicable, including:

- `SIBLING_CASE_IMPORTED`
- `SIBLING_CORROBORATION_ONLY`
- `RATIONALE_ADDS_MISSING_FACT`
- `UNSUPPORTED_ANYWHERE_CHECKED`
- `COMPOUND_ACTION`
- `PARAMETER_NOT_LINKED_TO_INTERVENTION`
- `DISTRACTOR_PATIENT_FACT_INVENTION`
- `CLINICAL_CURRENCY_CONCERN`
- `BILINGUAL_PARITY_CONCERN`
- `NURSING_SCOPE_CONCERN`

## 13. Bilingual and clinical collateral pass

The blind answerability pass is English-only by design. After the standalone verdict is locked, inspect the full English/Simplified-Chinese candidate for a narrow collateral check:

- Are the response demands and all token meanings materially equivalent across EN/ZH?
- Does Chinese add or omit a client-specific fact that could alter answerability?
- Does any action exceed nursing scope or require prescribed/protocol framing under the current bowtie contract?
- Does any time-sensitive clinical claim appear to need current-source verification?

Record findings only. Do not turn this commission into a full clinical re-review of every bowtie unless a concrete concern is triggered.

## 14. Pilot acceptance gate

The seven-item live pilot plus one historical calibration probe are acceptable for scale-up only if all of the following are demonstrated:

1. Population discovery deterministically yields the expected live population or stops before dispatch.
2. All seven named live pilot pairs are found exactly once, including the lithium `ORDINAL_SUFFIX` pair.
3. Stage-1 semantic payloads expose only the exact stem plus the generic free-generation instruction; no real or surrogate candidate identity is present.
4. Stage-2 semantic payloads expose only the exact learner-facing English stem/prompts/token text with opaque token labels; no real or surrogate candidate identity is present.
5. Exact real-ID/token-ID/key/rationale/companion leakage regressions pass.
6. Each live candidate and the calibration probe receives an isolated Sol/high review context.
7. Stage-1 output is serialized and hashed before Stage 2 is revealed; Stage-2 output is hashed before unblinding.
8. The mandatory token-premise table contains exactly 11 rows for every candidate; the §4 fail-loud cardinality precondition prevents any non-3/4/4 candidate from reaching packet generation.
9. Sibling case material is not inspected until the Phase E standalone-adjudication record is serialized, hashed, and locked.
10. Re-running deterministic inventory/packet generation on unchanged bank bytes is byte-identical.
11. The historical pre-repair calibration probe scores `found: true` for all three pre-registered sensitivity-checklist families — dietary/hemoglobin follow-up, developmental-screening evaluation, and broad safety-teaching — from explicit token-premise-table evidence. Key agreement alone does not satisfy this gate.
12. The adjudication schema can represent clean PASS, PASS-with-nonfatal distractor flag, hidden dependency, unsupported premise, ambiguity, key/logic defect, and reviewer disagreement without changing criteria midstream.

If accepted, execute the remaining live population with **the identical rubric and artifact schema**. Do not tune verdict criteria based on pilot outcomes.

## 15. Scale-up order

After the seven live pilot rows and calibration gate pass, review every remaining live candidate exactly once using an isolated Sol/high context.

Before dispatching the first scale-up candidate, recompute the SHA-256 of every bundled `banks/*.json` file and require an exact match to the frozen audit-start SHA set recorded in `verification.md`. Any mismatch is a hard stop: do not dispatch remaining semantic reviews until the snapshot change is owner-adjudicated and the commission is either restarted or explicitly re-baselined by a later revision.

Use deterministic ascending real `candidateId` order for orchestration. `CAND-XX` remains a control-layer storage/mapping identifier only and must not be exposed to semantic reviewers. The seven live pilot rows remain first in the final report and retain their immutable blind review records. The calibration probe remains outside live accounting.

Do not batch multiple candidates into one semantic reviewer prompt merely to reduce usage. This commission deliberately spends the stronger reviewer on every candidate and avoids cross-item priming.

## 16. Final report requirements

`report.md` must contain:

- live snapshot and frozen bank SHA set;
- actual population count and expected 31 checkpoint;
- exact 31/31 completion accounting when reproduced;
- a roster of every `_bowtie` item excluded from the paired population because no eligible sibling case resolved, with exact ID and exclusion reason; this exclusion roster is completeness evidence and is not part of the 31-row denominator;
- seven-item live pilot versus scale-up accounting;
- separate calibration outcome explicitly excluded from live denominator;
- verdict totals;
- table of every live candidate with real candidate ID, companion case ID, pairing rule, primary verdict, secondary flags, Stage-1 alignment, and Stage-2 blind exact-match diagnostic;
- a dedicated defect table for every non-PASS candidate naming the exact missing/unsupported fact and affected token(s);
- provenance classification for every missing client fact after sibling inspection;
- any collateral clinical/bilingual/scope concerns;
- explicit statement that no canonical bank, key, ledger status, schema, runtime, `DECISIONS.md`, `PROJECT-HISTORY.md`, or census artifact was changed;
- repair-priority recommendations **without performing repairs**.

The report must explicitly distinguish:

- selection agreement from standalone support — `blindExactMatch` is diagnostic only;
- Stage-1 free-generation alignment from Stage-2 pool-constrained selection;
- reviewer disagreement from proven item defect;
- hidden-case dependency from ordinary clinical inference;
- sibling corroboration from sibling necessity;
- missing patient facts from merely weak or self-marking distractors.

## 17. Repair-priority output — advisory only

For findings, assign one advisory priority:

- `P0` — canonical key cannot be justified standalone or may teach unsafe/incoherent action.
- `P1` — one or more keyed targets require hidden case facts, likely needing same-ID repair or replacement.
- `P2` — non-keyed token imports/invents a patient-specific premise or otherwise weakens rankability without requiring a key change; may coexist with `PASS_STANDALONE` when rankability impact is non-material.
- `P3` — collateral bilingual/currency/style issue not shown to change standalone answerability.

This priority is a queue recommendation, not authority to patch.

## 18. Deterministic tooling verification

Because this commission may add new audit/maintenance tooling but must not change established gates, the minimum verification is:

- focused tests for population discovery across `EXACT` and `ORDINAL_SUFFIX` pairing;
- ambiguous-pair fail-loud regression;
- deterministic surrogate assignment;
- deterministic opaque token mapping;
- Stage-1 and Stage-2 blind projection;
- exact real candidate/companion/token-ID forbidden-field leakage checks;
- Stage-1-before-Stage-2 serialization/hash locking;
- Phase E standalone-adjudication serialization/hash proof before any Phase F sibling access;
- token-premise table cardinality validation;
- deterministic repeatability;
- calibration-sensitivity checklist schema and proof that its three families are fixed before calibration output exists;
- frozen-bank SHA-set re-verification immediately before scale-up dispatch;
- `npx tsc -b --pretty false`;
- direct execution of the new audit inventory/packet generator against the frozen live corpus;
- exact-byte repeat generation or equivalent deterministic hash proof;
- `git diff --check`.

If an established aggregate command or shared audit library is modified despite the intended design, escalate to the current `AGENTS.md` audit/maintenance-tooling floor and prove default/no-argument behavior and output are unchanged. Avoid that expansion unless genuinely required.

No `npm run census`, production build, bank regeneration, or full bank-content pipeline is required merely to create read-only audit artifacts. If execution accidentally changes a bank or application-imported path, stop: that is a scope violation, not a reason to broaden verification after the fact.

## 19. Worktree and preservation proof

At closeout, show:

- starting branch and HEAD;
- starting dirty paths;
- repair-resolution commit/state used as the audit baseline;
- frozen starting SHA-256 for all bundled `banks/*.json`;
- final dirty paths;
- audit-created paths;
- SHA-256 or parsed-object proof that all `banks/*.json` are unchanged from the audit-start snapshot;
- confirmation that every pre-existing unrelated dirty file was left byte-untouched by this commission; `DECISIONS.md` must remain untouched regardless of whether it is clean or dirty at audit start.

Do not stage, commit, restore, or clean unrelated work.

## 20. Required execution receipt

Return a concise receipt with:

- `STANDALONE_BOWTIE_ANSWERABILITY_AUDIT_COMPLETE` or a precise BLOCKED status;
- repair-resolution baseline commit/state;
- actual live population count and expected-count comparison;
- seven-item live pilot verdicts;
- historical calibration result and whether sensitivity gate passed;
- final live verdict totals;
- all non-PASS candidate IDs and one-line defect summaries;
- PASS rows carrying `P2` distractor flags when applicable;
- artifact paths;
- deterministic verification results;
- no-bank-change proof;
- worktree preservation statement;
- explicit statement that repairs remain unperformed and require separate commissions.

## 21. Revision-2.3 review closure questions

A final independent spec reviewer should confirm the following before execution:

1. Does the combined `EXACT` + unambiguous two-digit `ORDINAL_SUFFIX` rule reproduce the intended 31-case-derived population without pulling directly generated standalone bowties into scope?
2. Do opaque candidate surrogates **and opaque token labels**, plus omission of category/topic/difficulty/`ngnSkill`, remove non-learner-facing semantic leakage from both blind stages?
3. Does Stage 1 stem-only free generation plus Stage 2 mandatory per-token premise enumeration make hidden patient-fact dependence observable even when pool elimination reproduces the canonical key?
4. Are the rankability rules and fixed primary-verdict precedence jointly deterministic, including the sibling-vs-non-sibling split between `FAIL_HIDDEN_CASE_DEPENDENCY` and `FAIL_UNSUPPORTED_TOKEN_PREMISE`?
5. Is delayed sibling inspection correctly ordered and mechanically enforced by the immutable Phase E hash, with `SIBLING_CORROBORATION_ONLY` preventing provenance overlap from being mistaken for necessary hidden dependence?
6. Does the seven-item live pilot adequately exercise the June GPT cohort plus the lone Opus ordinal-suffix pair?
7. Does the pre-registered three-family historical calibration checklist provide a sufficient positive-control sensitivity gate without contaminating live 31/31 accounting or permitting post-hoc grading?
8. Is the execution precondition strong enough that all semantic reviews run against one frozen, settled bank snapshot, including the required full-bank SHA recheck immediately before scale-up?

Execution must not begin until Revision 2.3 is independently accepted or its amendments are incorporated into a later revision.