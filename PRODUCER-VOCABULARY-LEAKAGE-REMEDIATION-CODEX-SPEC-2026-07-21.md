# Codex Work Order — Learner-Facing Producer Vocabulary Remediation

Date: 2026-07-21  
Owner: Codex implementation seat  
Status: ready to execute  
Mode: deterministic inventory reconciliation → bounded bilingual content naturalization → declarative canonical patch → blocking regression gate → independent content review

## 1. Purpose

Remove project-internal producer/checker vocabulary that leaked into learner-facing question content, preserve the embedded clinical rules that make the items closed-world, and prevent recurrence with a narrow deterministic audit.

This work also closes a related presentation-policy gap exposed by the forcing item: learner-facing prose temperatures should use US-conventional Fahrenheit first with Celsius in parentheses. The immune-checkpoint-inhibitor colitis item currently shows only `38.3 °C`; this pass must render that temperature as `100.9 °F (38.3 °C)` in both language surfaces.

The forcing defect is not that a protocol or threshold is stated in the stem. Active `DECISIONS.md` principle 21 requires closed-world stems when the answer depends on a protocol, threshold, or facility rule. The defect is that internal labels used to describe the authoring technique — `source-pinned`, `closed-world`, `source-supported`, and metaphorical `lane` language — reached the learner surface.

The governing repair rule is:

> **Naturalize the surface; preserve the embedded rule and tested construct.**

Do not turn protocol-application items into uncued guideline-recall items merely to remove awkward wording.

## 2. Ratified rulings

These decisions are closed for this task:

1. `DECISIONS.md` principle 12 is lapsed with the retired skeleton-generation lane and is not the authority for this repair.
2. Active principle 21 is the governing authority: closed-world construction remains part of the generation semantic floor.
3. The uploaded architect manifest establishes a baseline of **30 distinct HIGH-confidence items** across 1,942 canonical items:
   - 5 items with stem leakage;
   - 3 additional items with `testTakingStrategy` leakage;
   - 22 additional rationale-only items.
4. The same manifest carries a **15-row bare-`lane` review annex**. Bare `lane` is not suitable for the blocking gate, but every annex row is inside this remediation review.
5. The five stem items all retain the protocol-application construct. No item is authorized for the alternative “strip the rule and convert to clinical-recognition” disposition.
6. Rationale-only repairs are proportionate: use bounded substitution/naturalization rules rather than inventing 22 new clinical explanations.
7. English and Simplified-Chinese learner surfaces are both in scope. The observed Chinese leak `来源限定` must be removed.
8. Canonical JSON is never free-hand edited. Use a declarative, precondition-checked canonical patch under `scripts/patch-raw.ts --allow-canonical --reason`, with a ledger entry.
9. Codex implements and verifies mechanics. It does not independently clear the clinical or bilingual quality of its own rewrites. Final disposition is `READY_FOR_INDEPENDENT_CONTENT_REVIEW` until the non-GPT checker reviews the changed learner-facing fields.

## 3. Read first

Read current disk in this order:

1. `AGENTS.md`
2. `docs/AGENTS-RUNBOOK.md`
3. `DECISIONS.md`
   - principle 2: independent review for judgment-dependent work;
   - principle 5: generated learner-facing content is not self-reviewed;
   - principle 7: precision over volume;
   - principle 15: declarative canonical corrections;
   - principle 21: active semantic floor, including closed-world stems.
4. `PROJECT-HISTORY.md` for current status only; do not absorb unrelated edits.
5. `NCLEX-Question-Schema.md` and live types/validators for field traversal.
6. `scripts/audit.ts`
7. `scripts/audit/audit-references.ts` as the closest standing Tier-1 text-audit pattern.
8. `lib/question-population.ts`
9. `scripts/patch-raw.ts`
10. `producer-vocabulary-leakage-manifest.json`
11. The five stem items, three strategy items, 22 rationale-only items, and 15 annex paths on live disk.

The repository is authoritative. The uploaded manifest is a seat-neutral locator and expected-count artifact, not a substitute for reading the live strings.

## 4. Starting-worktree isolation

Record branch, HEAD, staged paths, unstaged paths, and untracked paths before beginning. The worktree changed while this work order was being authored, so do not rely on any earlier chat-era dirty-path list.

Do not stash, reset, clean, reformat, overwrite, or absorb unrelated work. Preserve every pre-existing changed or untracked path that is not explicitly authorized by this work order.

Do not modify `package.json` in this task. Invoke the focused new scripts directly with `tsx`; the standing `npm run audit` wiring belongs in `scripts/audit.ts` and does not require a new package script.

If any `banks/*.json` file is already modified when Codex begins, stop before creating or applying a canonical patch and report `BLOCKED_CANONICAL_OVERLAP`.

Preserve `producer-vocabulary-leakage-manifest.json` byte-for-byte. It was produced by the Claude architect seat from a deterministic live-disk sweep; do not silently rewrite it into a Codex-authored artifact.

## 5. Scope

### In scope

- Every HIGH-confidence row represented by the 30-item architect baseline.
- Every one of the 15 bare-`lane` annex rows.
- All English and Simplified-Chinese counterpart fields needed to preserve bilingual parity.
- The forcing ICI-colitis item’s stool-frequency clarity and temperature presentation, without changing its answer key or clinical threshold.
- A shared executable HIGH-confidence lexicon.
- A deterministic learner-facing field traversal.
- A read-only baseline/post-remediation manifest generator.
- A Tier-1 blocking audit wired into `scripts/audit.ts`.
- Focused tests.
- A declarative canonical patch and `BANK-REVIEW-LEDGER.md` entry.
- Compact governance wording in `DECISIONS.md` and `AGENTS.md` as specified below.

### Out of scope

- Broad stylistic rewriting unrelated to the identified vocabulary.
- Removing answer-bearing rules or thresholds from stems.
- Changing categories, topics, item types, difficulty, `ngnSkill`, sources, answer keys, option/segment IDs, scoring, visuals, structured measurements, exhibits, or stage identity.
- Re-sourcing or changing the clinical thresholds in this pass.
- A corpus-wide temperature-unit remediation or temperature CI gate. This task fixes the touched forcing item and codifies the prospective learner-facing prose convention; a broader prose-temperature inventory requires its own measured commission.
- Treating highlight density as a mechanical failure. The ICI item’s ratio of selected to distractor segments remains an independent content-quality judgment.
- Adding bare `lane` to the blocking lexicon.
- Editing `PROJECT-HISTORY.md`; the ledger, governance amendment, and remediation report are sufficient for this bounded pass.
- Commit or push unless Luke separately instructs it.

## 6. Phase A — reproduce and reconcile the architect baseline

Implement a deterministic read-only structural sweep over every bundled top-level `banks/*.json` file.

Recommended files:

- `lib/producer-vocabulary-leakage.ts`
- `scripts/producer-vocabulary-leakage-manifest.ts`
- `scripts/tests/producer-vocabulary-leakage.ts`

The executable lexicon must live once in `lib/producer-vocabulary-leakage.ts` and be imported by both the manifest generator and blocking audit. Do not retype regexes in two scripts.

### 6.1 HIGH-confidence English patterns

Use exact finite patterns, not descriptive placeholders:

- `source-pinned` and `source pinned`;
- `source-supported` and `source supported`;
- `closed-world` and `closed world`;
- `cross the lane`, `crosses the lane`, and grammatical variants only when `cross*` directly governs `lane`;
- the observed internal compounds:
  - `evaluation/escalation lane`;
  - `escalation lane`;
  - `resolution lane`;
  - `acidosis-resolution lane`;
  - `teaching lane`.

Do **not** use a generic `<any qualifier> lane` regex. Do **not** fail on `the lane` or bare `lane` independently. Those broad formulations are descriptive labels in the architect JSON, not safe executable gate rules.

### 6.2 HIGH-confidence Chinese patterns

Seed conservatively with the observed learner-facing string:

- `来源限定`

Do not mechanically translate the full English denylist into broad Chinese regexes. Add another Chinese phrase only if a live changed field demonstrates the same producer-label leak and the focused test pins the exact phrase.

### 6.3 Bare-`lane` annex detector

The manifest generator may separately report English `\blane\b` occurrences not already explained by a HIGH match. This detector is advisory and must never affect the Tier-1 audit verdict.

### 6.4 Learner-facing traversal

Walk validated question objects structurally, including standalone and embedded case-study content. Include every rendered bilingual prose surface, including:

- stems and instructions;
- highlight passages/segments;
- options, matrix rows/columns, bowtie choices, cloze text and dropdown labels;
- case exhibits and staged exhibit prose;
- rationales, including `rationale.correct` and every per-choice rationale;
- `testTakingStrategy`;
- displayed glossary/teaching text;
- learner-visible labels nested in supported question structures.

Exclude by path/contract:

- bank/question `meta`, including `meta.source`;
- `_compileManifest` and audit/provenance blocks;
- IDs, ref IDs, answer-key identifiers, schema/version tokens, category/topic/difficulty/item-type enum values;
- non-rendered internal configuration strings.

The test must prove that a forbidden phrase in `meta.source` does not fail while the same phrase in a learner-visible rationale does fail.

### 6.5 Baseline artifacts

Write:

- `audit/producer-vocabulary-leakage-2026-07-21/codex-baseline.json`

At the starting snapshot, reconcile against the architect artifact:

- canonical items scanned: 1,942;
- HIGH distinct items: 30;
- tier split: 5 stem / 3 strategy-only / 22 rationale-only;
- bare-`lane` annex rows: 15.

The Codex artifact must record bank, top-level question ID, embedded question ID if applicable, exact JSON path, language, exact matched phrase, full current field text, tier, and whether the path also appears in the annex.

If counts differ, do not massage regexes merely to force the expected total. Reconcile each delta against live disk and the architect manifest. Stop only for a material unexplained mismatch; harmless corpus drift may be recorded explicitly if the live item set changed after the architect snapshot.

## 7. Phase B — content dispositions

Aggregate occurrence rows into one patch disposition per unique `(bank, stable item identity, JSON path)`. Multiple forbidden phrases in one field produce one full-string before/after operation.

Expected distinct item scope after annex-only items are included: **32 items** — the 30 HIGH items plus `burn_mc_resuscitation_threshold_02` and `gpt_format11c_microcytic_anemia_localization`, which occur only in the bare-`lane` annex.

### 7.1 Five stem items — hand-naturalized, construct preserved

#### A. `gpt_format8c_ici_colitis_escalation`

This is the forcing item and receives the most explicit repair.

The English instruction must communicate, in ordinary clinical language:

> An oncology nurse reviews a telephone follow-up note for a client receiving an immune checkpoint inhibitor. The oncology service recommends further evaluation for at least 4 stools per day above baseline, blood or mucus in the stool, abdominal pain, fever, signs of dehydration, or peritoneal irritation. One isolated loose stool without other gastrointestinal symptoms does not meet these criteria. Highlight the findings that require further evaluation for possible immune-mediated colitis.

Do not retain `source-pinned`, `lane`, `cross the lane`, or `evaluation/escalation lane`.

Move the non-highlightable infection caveat out of the task instruction and retain it naturally in the rationale, for example:

> Infectious causes must also be evaluated before immune-mediated colitis is confirmed.

Clarify the stool arithmetic without changing the clinical condition:

- baseline: one formed stool daily;
- current day: six watery stools total;
- therefore: five stools above baseline.

Preserve the existing correct segment identity. Do not replace segment IDs or change the keyed set.

Render the temperature as:

- English: `100.9 °F (38.3 °C)`
- Chinese: the same numeric/unit order using normal Chinese punctuation around the parenthetical.

The rest of the note retains the same facts: visible blood and mucus, new lower-abdominal cramping, orthostatic dizziness/dry mouth, unchanged mild fatigue, and a soft abdomen without guarding or rebound.

Write a natural Simplified-Chinese counterpart. Replace `来源限定` with ordinary wording such as `采用以下评估标准` or a semantically equivalent clinical formulation.

#### B. `gpt_format8c_dka_resolution_transition`

Preserve every stated biochemical resolution and transition criterion. Replace `Use this source-pinned lane` with ordinary language such as:

> Use the following treatment criteria to determine whether DKA has resolved and whether transition is safe.

Replace `resolution lane` / `acidosis-resolution lane` in the instruction and rationales with `resolution criteria`, `criteria stated in the stem`, or the named biochemical criteria. Remove `来源限定` from the Chinese stem and preserve exact bilingual clinical meaning.

Do not alter any values, thresholds, timing, answer segments, or key.

#### C. `gpt_format9c_pn_peripheral_central_access`

Preserve the exact supplied ASPEN-based duration/osmolarity/access rule as the governing rule. Replace `closed-world ASPEN teaching lane` with a natural introduction such as:

> The nutrition-support service uses the following criteria for peripheral and central parenteral nutrition.

Replace every stem, rationale, and strategy use of `lane` with `criteria`, `plan`, `route-selection criteria`, or the exact clinical factor being applied. Do not universalize the local/supplied threshold.

#### D. `gpt_format10c_parenteral_nutrition_discontinuation_plan`

Replace `The team writes this closed-world discontinuation plan` with a natural formulation such as:

> The team documents the following parenteral-nutrition discontinuation plan.

Preserve every stated step and time exactly. Do not alter the ordered-response options or key.

#### E. `gpt_format8b_toddler_unknown_ingestion`

Replace `Place the closed-world Poison Control pathway in order` with natural task language, for example:

> Place the Poison Control actions described in the scenario in the order the nurse should take them.

Preserve the closed-world sequence supplied by the scenario and all option/key identities.

### 7.2 Three `testTakingStrategy` items — exact intent

- `gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13`: replace “use the activated plan as a closed world” with “use the activated plan as the governing protocol” or equivalent ordinary coaching language.
- `gpt_format7b_inpatient_alcohol_withdrawal_pathway`: replace “follow the closed-world pathway” with “follow the pathway stated in the stem.”
- `io_matrix_prerenal_aki_recheck_04`: replace “use closed-world thresholds” with “use the thresholds stated in the stem.”

Do not add new strategy claims or alter the tested decision.

### 7.3 Rationale-only HIGH tier — bounded substitution rules

For the remaining HIGH paths:

- `closed-world rule/policy/pathway/plan/order` → `the rule/policy/pathway/plan/order stated in the stem/case`;
- `closed-world pattern` → name the actual clinical pattern;
- `source-supported reason/measure/context` → state the reason, measure, or context itself rather than commenting on its sourcing;
- `resolution/escalation/acidosis-resolution lane` → `criteria stated in the stem`, `resolution criteria`, `findings requiring escalation`, or the named clinical criteria.

Preserve all clinical facts, values, relationships, sequencing, and conclusions. Do not make the rationale longer merely to disguise the substitution.

Every changed English rationale must have its paired Chinese field checked for semantic parity. Change Chinese only when needed to remove the same leakage or keep the explanation equivalent.

### 7.4 Bare-`lane` annex — review all 15 rows, gate none

Review and naturalize every annex row. The expected dispositions are:

- `burn_mc_resuscitation_threshold_02`: “this lane uses adult Rule-of-Nines values” → “this item uses adult Rule-of-Nines values” or equivalent.
- ICI-colitis per-choice rationales: replace `cross the supplied lane`, `GI lane`, and similar language with `meets/does not meet the stated criteria`.
- PN peripheral/central item: replace every remaining `lane` use with the actual route-selection criteria, plan, or clinical factor.
- `gpt_format11c_microcytic_anemia_localization`: replace `confirmation lane`, `next lane`, `appropriate lane`, and `different lane` with `next diagnostic step`, `hemoglobinopathy evaluation`, or the named diagnostic pathway.
- DKA stem occurrence is already handled above.

Bare `lane` remains absent from the blocking regex even if every current annex row is repaired.

## 8. Phase C — bilingual and temperature presentation rules

### 8.1 Bilingual parity

For every changed learner-facing field:

- compare EN and ZH facts after the edit;
- preserve the same thresholds, values, timing, actions, and selected/unselected meaning;
- remove observed internal labels in either language;
- do not translate `closed-world` or `source-pinned` into a different Chinese meta-label;
- do not change answer/reference IDs to simplify translation.

A Chinese counterpart that was already natural does not require cosmetic rewriting merely because the English field changed. It does require explicit parity verification.

### 8.2 Prospective learner-facing temperature convention

Add a compact authoring rule to `AGENTS.md` under the question-bank/content workflow:

> In learner-facing prose, present temperatures in US-conventional Fahrenheit first with Celsius in parentheses, preserving source precision (for example, `100.9 °F (38.3 °C)`). Typed visual and structured-measurement payloads continue to follow their renderer/unit contracts.

This closes the gap between the existing structured-measurement dual-unit policy and arbitrary authored prose. It does not authorize conversion of every historical temperature in this task.

## 9. Phase D — governance record

Add a compact application under active `DECISIONS.md` principle 21. Preserve the existing principle and add the following substance without reintroducing lapsed principle 12:

- `closed-world` is an authoring/checker term describing a required construction, not learner-facing vocabulary;
- the actual order, protocol, threshold, or criteria must be stated naturally;
- `source-pinned`, `source-supported`, and metaphorical `lane` scaffolding are naturalized before promotion;
- the HIGH-confidence learner-surface lexicon is enforced mechanically;
- bare `lane` remains a human-review signal rather than a universal failure.

Do not restate regexes in `DECISIONS.md`; link to the executable owner in `lib/producer-vocabulary-leakage.ts`.

Do not edit `PROJECT-HISTORY.md` in this task.

## 10. Phase E — declarative canonical patch

Create:

- `scripts/patches/2026-07-21-producer-vocabulary-naturalization.ts`

Requirements:

- use declarative `before` → `after` operations through `scripts/patch-raw.ts`;
- locate targets by canonical bank and stable top-level/embedded item identity, not array position alone;
- one exact full-string operation per changed JSON path;
- combine multiple substitutions in one string into one operation;
- fail closed on stale preconditions, missing IDs, duplicate target paths, or unmatched `before` values;
- preserve all non-target text byte-for-byte except the explicitly authorized ICI stool-count clarification and dual-unit temperature display;
- dry-run by default;
- print affected banks, distinct items, path counts by tier/language, HIGH vs annex counts, and any blocked path.

Authorized canonical invocation:

```sh
npx tsx scripts/patches/2026-07-21-producer-vocabulary-naturalization.ts \
  --allow-canonical \
  --reason "naturalize learner-facing producer vocabulary and repair the ICI-colitis dual-unit temperature display"
```

Do not apply a path that requires clinical interpretation beyond this work order. Mark it `BLOCKED_REWRITE` in the report and leave it unchanged; independently safe paths may still proceed.

## 11. Phase F — blocking audit

Create:

- `scripts/audit/audit-producer-vocabulary.ts`

The audit imports the shared lexicon/traversal from `lib/producer-vocabulary-leakage.ts` and returns an `AuditResult`.

Behavior:

- HIGH learner-facing hit count 0 → `PASS`;
- any HIGH learner-facing hit → `FAIL`, with unique item IDs and exact field-path/match detail;
- bare-`lane` annex results may be printed by the standalone manifest tool but never affect this audit verdict.

Wire `runAuditProducerVocabulary()` into Tier 1 of `scripts/audit.ts`. Do not add a package script.

### Required focused tests

`scripts/tests/producer-vocabulary-leakage.ts` must prove at least:

1. hyphenated and spaced `closed-world` forms fail;
2. `source-pinned` and `source-supported` fail;
3. direct `cross* ... lane` forms fail;
4. each finite observed compound-lane phrase fails;
5. `来源限定` fails in a visible Chinese field;
6. the same tokens in `meta.source` do not fail;
7. a bare ordinary `lane` occurrence is annex-only and does not fail;
8. nested case-study questions and case exhibit prose are traversed;
9. `rationale.correct`, per-choice rationale, and `testTakingStrategy` are traversed;
10. duplicate phrase hits in one item produce one failing item ID but retain path-level evidence;
11. manifest generator and audit consume the same exported lexicon object;
12. post-remediation live banks produce zero HIGH hits.

## 12. Exact-diff and semantic-preservation gate

Capture parsed canonical bank objects before and after the patch. Assert:

1. changed bank/path set equals the approved path-level dispositions exactly;
2. no unplanned canonical bank changes;
3. no top-level or embedded question ID changes;
4. no answer key, option/segment/ref ID, scoring, category, topic, difficulty, item type, `ngnSkill`, source, visual, structured measurement, exhibit, or stage change;
5. no array reordering;
6. no serialization churn outside changed strings and expected bank serialization behavior;
7. all non-target surrounding text remains byte-identical;
8. ICI stool arithmetic remains clinically equivalent: baseline 1, current total 6, increase 5;
9. `38.3 °C` converts exactly to `100.94 °F` and is displayed at preserved one-decimal precision as `100.9 °F (38.3 °C)`;
10. ICI highlight segment identities and keyed selection are unchanged;
11. all changed EN/ZH pairs remain factually equivalent;
12. question counts and census populations are unchanged.

A green build is not evidence for these prose/content invariants.

## 13. Post-write residuals and idempotency

After applying the patch:

- regenerate the manifest to `audit/producer-vocabulary-leakage-2026-07-21/codex-post-remediation.json`;
- HIGH distinct item count must be 0;
- every one of the original 15 annex rows must be dispositioned and rechecked;
- expected bare-`lane` annex count after this bounded repair is 0 unless a row is explicitly blocked and independently reported;
- a second patch dry-run must produce zero writes;
- `npm run audit` must pass the new Tier-1 check.

Do not weaken or remove a pattern merely to make the post-remediation gate green.

## 14. Ledger and reports

A canonical correction requires a `BANK-REVIEW-LEDGER.md` entry recording:

- forcing defect and construction-vs-label distinction;
- architect manifest provenance and baseline counts;
- affected canonical banks and distinct item/path counts;
- five stem / three strategy / rationale / annex dispositions;
- ICI stool-count clarity change and exact temperature conversion;
- confirmation that answer keys, IDs, clinical thresholds, sources, scoring, and counts did not change;
- English/Chinese parity review status;
- patch reason and script path;
- shared lexicon/audit paths;
- verification commands and results;
- explicit status `AWAITING_INDEPENDENT_CONTENT_REVIEW` until that review lands.

Write:

- `audit/producer-vocabulary-leakage-2026-07-21/codex-remediation-report.md`

Include:

1. branch, HEAD, and starting/ending dirty paths;
2. authority files read;
3. architect-manifest provenance and byte-preservation confirmation;
4. baseline reconciliation, including every delta if counts changed;
5. executable lexicon and traversal exclusions;
6. path-level dispositions and blocked rows;
7. changed counts by bank, item, tier, field surface, language, and HIGH/annex source;
8. exact-diff proof;
9. ICI clinical-equivalence and temperature-conversion proof;
10. bilingual parity proof;
11. post-remediation HIGH and annex counts;
12. idempotency proof;
13. full verification command results;
14. final implementation verdict: `READY_FOR_INDEPENDENT_CONTENT_REVIEW`, `READY_WITH_BLOCKED_REWRITES`, or `BLOCKED`.

Codex must not issue a final `COMPLETE` content verdict.

## 15. Verification floor

Run, at minimum:

```sh
npx tsx scripts/tests/producer-vocabulary-leakage.ts
npx tsx scripts/producer-vocabulary-leakage-manifest.ts
npm run test:highlight
npm run validate-bank -- banks/*.json
npm run audit
npm run coverage-report
npm run census
npm run census:check
npx tsc -b --pretty false
npm run build
git diff --check
```

Also:

- run the canonical patch in dry-run mode before applying;
- run it again after applying and prove zero writes;
- inspect the exact diff for every changed bank and governance file;
- confirm `census.json` / `BANK-CENSUS.md` report no question-population change.

If an unrelated pre-existing failure occurs, prove it exists on the starting snapshot and keep it separate from this work. Do not use unrelated failure as permission to skip the new focused test, bank validation, or post-remediation sweep.

## 16. Independent review handoff

The independent non-GPT checker receives:

- `producer-vocabulary-leakage-manifest.json`;
- Codex baseline and post-remediation manifests;
- path-level dispositions;
- canonical patch script and exact bank diff;
- remediation report;
- focused test and audit implementation.

The checker must review every changed learner-facing field, with special attention to:

- the five stem items;
- all three strategies;
- the ICI threshold/stool arithmetic/infection-caveat placement/temperature display;
- every Chinese stem or rationale changed;
- preservation of protocol-application constructs;
- rationale substitutions that may have become vague or clinically weaker;
- all 15 bare-`lane` annex rows.

The checker, not Codex, clears the ledger status to reviewed.

## 17. Stop conditions

Stop without canonical mutation if:

- a canonical bank is already modified at task start;
- the live manifest cannot be reconciled to the architect input and the difference is material;
- the shared traversal cannot establish learner-facing coverage;
- a proposed rewrite changes a clinical threshold, answer key, option/segment identity, or tested construct;
- EN/ZH facts cannot be reconciled safely;
- the canonical patch cannot express the changes declaratively;
- exact before/after preconditions fail;
- the new gate requires a broad generic `lane` rule to reproduce the baseline.

Do not stop merely because one or more individual fields are ambiguous. Mark those paths `BLOCKED_REWRITE`, leave them unchanged, and complete independently safe paths, but the Tier-1 gate cannot be declared ready while any HIGH hit remains.

## 18. Exit checklist

- [ ] Architect manifest preserved byte-for-byte
- [ ] Shared executable lexicon has one owner
- [ ] Baseline reconciles to 30 HIGH items and 15 annex rows, or every delta is proved
- [ ] All five stem items preserve their embedded rule and construct
- [ ] All three strategy leaks are naturalized
- [ ] Rationale substitutions preserve clinical meaning
- [ ] All 15 bare-`lane` annex rows are reviewed
- [ ] `来源限定` is removed from learner-facing Chinese
- [ ] ICI stool count is unambiguous
- [ ] ICI temperature displays `100.9 °F (38.3 °C)` in EN and ZH
- [ ] `AGENTS.md` carries the prospective learner-facing temperature convention
- [ ] `DECISIONS.md` principle 21 records construction-vs-label naturalization without citing lapsed principle 12
- [ ] Canonical mutation uses declarative `patch-raw --allow-canonical --reason`
- [ ] Exact-diff gate passes
- [ ] Post-remediation HIGH count is zero
- [ ] Patch is idempotent
- [ ] New Tier-1 audit is wired and tested
- [ ] Full bank validation/audit/census/build path passes
- [ ] Ledger and remediation report are written
- [ ] Unrelated dirty work remains untouched
- [ ] Final status awaits independent content review
- [ ] No commit or push without separate instruction
