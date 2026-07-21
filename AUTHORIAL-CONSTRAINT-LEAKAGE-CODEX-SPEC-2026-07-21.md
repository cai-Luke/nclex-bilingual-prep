# Codex Work Order — Learner-Facing Authorial Constraint Leakage Audit and Remediation

Date: 2026-07-21
Owner: Codex implementation seat
Status: ready to execute
Mode: deterministic structural survey → bounded semantic adjudication → declarative repair → prospective producer hardening → narrow regression gate → independent content review

## 1. Purpose

Find and remove authoring, checker, or scope-control instructions that have been copied into learner-facing question text as though they were part of the NCLEX task.

The forcing example is the final sentence of this promoted bowtie stem:

> Do not independently prescribe an insulin dose.

The sentence is not ordinary clinical context. It is an internal nursing-scope guardrail transformed into a learner instruction. It likely derives from the current producer rule in `GeminiPrompt.md`:

> Do not imply that a nurse independently prescribes, diagnoses, performs surgery, inserts invasive provider-level devices, or changes medication orders without protocol/order support.

The producer correctly recognized the scope constraint but enforced it on the wrong surface. Scope should be carried by the clinical facts, the wording of the choices, and the rationale—not by an appended authorial disclaimer that tells the learner how the item was constrained.

This task treats that defect as a potentially systemic class rather than a one-line correction.

The governing rule is:

> **Authoring constraints are not learner instructions. Encode the clinical boundary in the scenario and response choices; explain it in the rationale. Do not append producer/checker guardrails to the stem.**

## 2. Relationship to the completed producer-vocabulary remediation

This is a companion task to, not a reopening of:

- `PRODUCER-VOCABULARY-LEAKAGE-REMEDIATION-CODEX-SPEC-2026-07-21.md`;
- `lib/producer-vocabulary-leakage.ts`;
- `scripts/audit/audit-producer-vocabulary.ts`.

The completed task catches explicit internal labels such as `closed-world`, `source-pinned`, `source-supported`, and metaphorical `lane` language. This task addresses a different failure shape:

- the words may be ordinary English;
- the sentence may be clinically true;
- the defect is its **speech act and placement**—an authoring constraint is addressed directly to the learner instead of being embodied by the item.

Do not weaken, rename, or broaden the existing vocabulary audit to absorb this work. A generic denylist for `do not`, `independently`, `scope`, `prescribe`, or `provider` would create unacceptable false positives in legitimate client teaching, Management of Care content, options, and rationales.

Implement a separate survey and audit owner for this class.

## 3. Ratified decisions

These decisions are closed for this commission:

1. The forcing sentence is defective learner-facing producer leakage and must be removed or naturally absorbed into the item.
2. The clinical rule remains valid: a nurse does not independently prescribe or improvise an insulin dose outside an order, protocol, or authorized plan.
3. Removing the leaked sentence must not silently authorize an independently chosen dose. The choices and rationale must carry the scope boundary clearly.
4. The forcing item remains a bowtie about exercise-associated hypoglycemia unless live inspection shows that removal exposes a separate answerability defect.
5. No broad regex on `do not`, `independently`, `scope`, `prescribe`, `diagnose`, `adjust`, or `provider` is authorized.
6. Stem/task-instruction leakage is the primary risk. Options and rationales may legitimately teach or test scope and therefore require different treatment.
7. The task begins with a structural survey and measured adjudication. Only confirmed, low-false-positive signatures may become blocking audit rules.
8. English and Simplified-Chinese learner surfaces are both in scope. A Chinese counterpart may contain the same defect even when it is not a literal translation.
9. Canonical JSON is never free-hand edited. Canonical correction uses a declarative, exact-precondition patch through `scripts/patch-raw.ts --allow-canonical --reason` and receives a ledger entry.
10. Codex may implement deterministic mechanics and owner-ratified exact rewrites. It does not independently certify its own semantic dispositions. Final status remains pending a non-GPT content checker.
11. No commit or push is authorized by this work order.

## 4. Read first

Read current disk in this order:

1. `AGENTS.md`
2. `docs/AGENTS-RUNBOOK.md`
3. `DECISIONS.md`
   - principle 2: independent review for judgment-dependent work;
   - principle 5: generated learner-facing content is not self-reviewed;
   - principle 7: precision over volume;
   - principle 15: declarative canonical corrections;
   - principle 21 and its 2026-07-21 construction-language application.
4. `PROJECT-HISTORY.md` for current lane status and active producer prompts.
5. `NCLEX-Question-Schema.md`, `src/types.ts`, and `src/schema.ts` for current supported surfaces.
6. `BANK-REVIEW-LEDGER.md`.
7. `lib/producer-vocabulary-leakage.ts` for the existing learner-facing traversal and the boundary this task must preserve.
8. `scripts/audit/audit-producer-vocabulary.ts` and `scripts/tests/producer-vocabulary-leakage.ts` for Tier-1 audit precedent.
9. Current producer-facing instructions, at minimum:
   - `GeminiPrompt.md`;
   - `gpt-evergreen-generation-prompt.md`;
   - `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md`;
   - `NCLEX-Bank-Generation-Prompt.md`;
   - any newer active producer contract named by `PROJECT-HISTORY.md`.
10. The forcing item and every paired EN/ZH learner-facing field on live disk.

The repository is authoritative. The user-reported stem is a forcing locator, not authority for the item ID, bank path, Chinese text, options, or current live wording.

## 5. Starting-worktree isolation

Before writing:

- record branch, HEAD, upstream, ahead/behind state, staged paths, unstaged paths, and untracked paths;
- preserve every unrelated change;
- do not stash, reset, clean, reformat, or absorb another task;
- do not mutate a canonical bank while another agent is writing any canonical bank.

If any `banks/*.json` file is already modified at task start, stop before applying a canonical patch and report `BLOCKED_CANONICAL_OVERLAP`. The read-only survey may still run if the snapshot is stable and the starting hashes are recorded.

## 6. Definitions

### 6.1 Confirmed authorial-constraint leakage

A learner-visible sentence or clause is a confirmed leak when all of the following hold:

1. It states or enforces a rule directed at the item writer, compiler, checker, or reviewer.
2. It is presented to the learner as an instruction, disclaimer, or explanation of how the item was authored.
3. Removing or naturalizing it does not remove necessary clinical facts, a governing protocol, or the actual response demand.
4. Its intended safety boundary can be carried by ordinary clinical wording, option construction, or rationale teaching.

Examples include:

- `Do not independently prescribe an insulin dose.`
- `Select only actions within nursing scope.`
- `Do not assume a provider order that is not stated.`
- `Do not change the medication dose independently.`
- `For purposes of this question, do not diagnose the condition.`

These are examples of the defect class, not an approved blocking lexicon.

### 6.2 Legitimate clinical scope teaching

The same vocabulary may be valid when the learner is being tested on scope or taught why an action is unsafe, for example:

- an option that says the nurse independently increases an insulin dose;
- a rationale explaining why that option exceeds scope;
- a client-teaching statement not to change insulin without the prescribed plan;
- a Management of Care item asking which task requires an RN or provider order.

Do not “naturalize” legitimate clinical teaching merely because it contains `independently`, `prescribe`, `scope`, or `provider`.

### 6.3 Legitimate task instruction

Ordinary response-demand wording is not leakage:

- `Select the 2 priority actions.`
- `Highlight the findings that require follow-up.`
- `Use the protocol stated in the stem.`
- `Round to the nearest whole number.`

The distinction is whether the instruction tells the learner what operation to perform or instead exposes a behind-the-scenes authoring constraint.

## 7. Scope

### In scope

- Every bundled top-level `banks/*.json` file.
- Standalone questions and embedded case-study leaves.
- All learner-visible English and Simplified-Chinese prose surfaces.
- The forcing item’s stem, options/tokens, rationale, strategy, and bilingual counterpart.
- Current active producer prompts and contracts that can regenerate the same defect.
- A deterministic candidate inventory.
- Bounded semantic adjudication.
- Exact declarative repairs for confirmed leaks.
- A narrow prospective Tier-1 check for signatures proved safe by the inventory.
- Focused tests, governance wording, ledger entry, and remediation report.

### Out of scope

- Broad copyediting or making every stem sound more “NCLEX-like.”
- Re-reviewing every clinical scope statement in the bank.
- Changing answer keys, scoring, item types, categories, topics, difficulty, or `ngnSkill` merely because an item contains scope language.
- A generic AI-writing-style detector.
- An LLM call inside the repository or runtime.
- Statistical authorship detection.
- Treating every second-person imperative as a defect.
- Treating every sentence shared with a prompt as a defect; active prompts necessarily contain ordinary clinical vocabulary.
- Adding a new schema field or learner-visible warning.
- Updating retired or archived producer prompts except when needed as provenance evidence.

## 8. Phase A — locate and freeze the forcing item

Search structurally, not by manually opening the multi-megabyte bank files.

Use the exact English sentence and enough preceding stem text to identify the item:

> A client with type 1 diabetes began a new 45-minute cycling routine after work.

and

> Do not independently prescribe an insulin dose.

Search in this order:

1. bundled `banks/*.json`;
2. `banks/banks-raw/*.json`;
3. `banks/_promoted/*.json`;
4. retained audit or patch artifacts only to explain provenance, never as the live repair target.

Record:

- canonical/raw/staged file;
- top-level question ID;
- embedded question ID if applicable;
- item type;
- exact JSON path;
- complete English and Chinese stem strings;
- all bowtie token text and keys;
- complete rationale and strategy;
- `meta.source`;
- exact current file hash.

Expected outcome is one live learner-visible item. If there are zero exact live matches, perform a normalized search over the full reported stem and report `FORCING_ITEM_NOT_FOUND` with the searched populations. If there are multiple live matches, stop mutation and report `FORCING_ITEM_COLLISION`; do not guess which copy the learner saw.

Before proposing the one-line removal, verify whether the two keyed action choices are independently defensible without the leaked warning. At minimum, determine whether they are framed as:

- treatment of the current hypoglycemic episode;
- use of the client’s prescribed exercise/hypoglycemia plan;
- consultation or collaboration for a future exercise-day insulin/carbohydrate plan;
- or an impermissible independently selected insulin dose.

If removing the sentence leaves two plausible action sets, or if a keyed token itself directs the nurse to prescribe/choose a dose, classify the item `BLOCKED_ITEM_REWRITE` rather than applying a one-line patch.

## 9. Phase B — build the deterministic candidate survey

Recommended files:

- `lib/authorial-constraint-leakage.ts`
- `scripts/authorial-constraint-leakage-survey.ts`
- `scripts/tests/authorial-constraint-leakage.ts`
- `audit/authorial-constraint-leakage-2026-07-21/baseline.jsonl`
- `audit/authorial-constraint-leakage-2026-07-21/candidate-summary.md`

Reuse `collectLearnerFacingFields()` from `lib/producer-vocabulary-leakage.ts` unless live inspection proves that traversal misses a rendered field. Do not fork a second recursive learner-surface definition merely for convenience.

### 9.1 Surface classes

Classify each learner-facing path into at least:

- `TASK_STEM_OR_INSTRUCTION` — question stem, cloze instruction, highlight selection instruction, bowtie instruction, and equivalent embedded task wording;
- `TEST_TAKING_STRATEGY`;
- `OPTION_OR_RESPONSE_TOKEN`;
- `RATIONALE`;
- `CASE_OR_EXHIBIT_PROSE`;
- `TITLE_LABEL_OR_GLOSSARY`;
- `OTHER_VISIBLE`.

Surface class is load-bearing. A direct imperative in a stem is not equivalent to a rationale explaining scope.

### 9.2 Candidate families

Use finite, reviewable signatures grouped by intent. Candidate detection is allowed to be broader than the eventual blocker.

#### Family A — direct second-person scope prohibitions

Examples of candidate grammar:

- `Do not independently <provider-level verb>`;
- `Do not <provider-level verb> independently`;
- `Without independently <provider-level gerund>`;
- `Do not independently change/adjust/titrate ... dose/order/medication/treatment`.

Seed provider-level verbs from the observed active prompt rule, not an unbounded thesaurus:

- prescribe;
- diagnose;
- order;
- change;
- adjust;
- titrate;
- insert;
- perform.

The detector may support close grammatical variants. It must print the exact matched sentence and verb.

#### Family B — explicit scope-as-test-construction instructions

Candidate exact or near-exact formulations include:

- `Select only actions within nursing scope`;
- `Choose only actions the nurse may perform independently`;
- `Do not select provider-only actions`;
- `Do not assume an order/protocol that is not stated`;
- `Assume no standing order/protocol` when used as an authoring disclaimer rather than case fact.

Do not make the broad token `scope` a candidate by itself.

#### Family C — prompt-role or checker directives

Curate high-information fragments from active producer prompts, such as:

- `do not expose the private blueprint`;
- `do not claim validation`;
- `do not invent schema fields`;
- `do not change the answer key`;
- `for the purposes of this question` followed by an authoring restriction;
- `the learner should not be expected to...` when it comments on construction rather than clinical reasoning.

Only fragments that would be anomalous on a learner surface belong in this family. Do not import ordinary clinical phrases from producer prompts.

#### Family D — Chinese counterparts

Begin with exact Chinese phrases observed in live candidate fields. Do not machine-translate every English signature into a broad denylist.

For each confirmed English leak, inspect the paired Chinese field semantically. Record the exact Chinese wording even when it lacks a literal equivalent of `independently` or `prescribe`.

A Chinese signature becomes mechanically enforceable only after:

- a live confirmed example;
- an exact finite phrase or safely bounded pattern;
- a focused negative test against legitimate clinical scope teaching.

### 9.3 Active-prompt provenance map

Create a small, explicit provenance table in code or survey configuration for every candidate signature:

- signature ID;
- source prompt path;
- exact source clause;
- whether the source prompt is active, portable, or historical;
- intended authoring rule;
- candidate-only or eligible-for-blocking status.

This is not a generic n-gram miner. It is a finite map connecting observed learner language to actual producer instructions. A signature with no prompt provenance may still be a leak, but it must be reported as `UNATTRIBUTED_CONSTRAINT_SHAPE` rather than falsely assigned to a producer prompt.

### 9.4 Candidate output

Each JSONL row must contain at least:

```json
{
  "bankPath": "banks/gpt-canonical.json",
  "topLevelQuestionId": "...",
  "embeddedQuestionId": null,
  "itemType": "bowtie",
  "jsonPath": "stem.en",
  "surfaceClass": "TASK_STEM_OR_INSTRUCTION",
  "language": "en",
  "fullFieldText": "...",
  "sentenceText": "Do not independently prescribe an insulin dose.",
  "matchStart": 0,
  "matchEnd": 48,
  "signatureId": "imperative-do-not-independently-provider-verb",
  "matchedVerb": "prescribe",
  "promptSourcePath": "GeminiPrompt.md",
  "promptSourceClause": "Do not imply that a nurse independently prescribes...",
  "candidateStrength": "HIGH",
  "pairedPath": "stem.zh",
  "notes": "candidate only until adjudicated"
}
```

Sort deterministically by bank, top-level ID, embedded ID, path, sentence offset, and signature ID. A second run from the same snapshot must be byte-identical.

## 10. Phase C — adjudication

Write:

- `audit/authorial-constraint-leakage-2026-07-21/adjudication.jsonl`

Every candidate occurrence receives exactly one disposition:

- `CONFIRMED_AUTHORIAL_CONSTRAINT_LEAK`;
- `LEGITIMATE_CLINICAL_SCOPE_TEACHING`;
- `LEGITIMATE_TASK_INSTRUCTION`;
- `LEGITIMATE_CLIENT_TEACHING`;
- `LEGITIMATE_QUOTED_POLICY_OR_ORDER`;
- `DUPLICATE_OCCURRENCE_SAME_FIELD`;
- `AMBIGUOUS_REQUIRES_OWNER_REVIEW`;
- `FALSE_POSITIVE`.

For every confirmed leak, record:

- why the sentence addresses the author/checker rather than the learner’s clinical task;
- which clinical fact or boundary must be preserved;
- whether deletion alone is sufficient;
- the exact proposed EN and ZH replacement or deletion;
- whether options, key, or rationale require a separate semantic rewrite;
- whether the signature is safe enough for a prospective blocker.

For every dismissal, quote enough local context to establish why the wording is legitimate. Do not issue templated dismissals such as “clinical context.”

No ambiguous candidate is silently accepted or patched. Preserve it in the report and continue with independently safe rows.

## 11. Phase D — forcing-item repair

### 11.1 Default authorized repair

If the bowtie remains unambiguous after live inspection, remove the producer-facing final sentence from both language surfaces and make no other stem change:

English should end with:

> Complete the bowtie by selecting the most likely condition, the 2 priority actions, and the 2 parameters to monitor.

Use the natural equivalent already present in Chinese, without an added scope disclaimer.

Do not insert a replacement sentence such as:

- `Follow nursing scope of practice.`
- `Consult the provider before changing insulin.`
- `Use only provider-approved actions.`

Those formulations retain the same defect in more polished language.

### 11.2 Scope preservation check

The item must still teach the boundary after the stem repair. The preferred shape is:

- permissible action token: treat the current low glucose using the prescribed hypoglycemia plan and stop/pause exercise as appropriate;
- permissible planning token: collaborate with the diabetes clinician/educator to create or revise an individualized exercise-day carbohydrate/insulin plan;
- impermissible distractor: independently select or prescribe a new insulin dose;
- rationale: explicitly explains why medication-dose changes require the existing prescribed plan, protocol, or clinician collaboration.

These are construct requirements, not authorization to overwrite live tokens with the example wording. Preserve existing choices when they already satisfy the rule.

If the tokens or rationale do not satisfy it, stop the one-line repair and route the entire item as `BLOCKED_ITEM_REWRITE`. Provide an exact proposed full-item rewrite for owner/checker review, but do not change the answer key from the Codex seat.

### 11.3 Other confirmed rows

Naturalize each confirmed row according to its own context. Preferred repair order:

1. delete a redundant authorial disclaimer;
2. state the real clinical protocol/order/fact naturally when the sentence contains needed information;
3. move scope teaching to the rationale when it is explanatory rather than answer-bearing;
4. rewrite an option only when the option itself is the leaked instruction and its clinical role can be preserved exactly.

Do not turn a closed-world protocol item into uncued external-guideline recall. Do not remove a threshold, timing rule, order, or facility protocol merely because it was introduced awkwardly.

## 12. Phase E — prompt and governance hardening

### 12.1 Shared governance rule

Add a compact rule to `AGENTS.md` under `Question Bank Workflow`:

> Authoring and checker constraints must not appear as learner-facing disclaimers. Encode scope, protocol, and role boundaries in the clinical context and response choices, and explain them in the rationale; do not append instructions such as “Do not independently prescribe or change a dose” to a stem.

Use semantically equivalent wording if needed to fit the surrounding prose. Do not restate the detector regexes in `AGENTS.md`.

### 12.2 `DECISIONS.md` principle 21 application

Extend the existing 2026-07-21 construction-language application with the distinction established by this incident:

- project-internal **labels** such as `closed-world` stay off learner surfaces;
- project-internal **constraints** such as “do not independently prescribe” also stay off learner surfaces;
- the item must embody the boundary through clinical facts, choices, and rationale;
- a finite high-confidence signature set may block recurrence, while broader directive-shaped candidates remain review-only because legitimate clinical scope teaching uses the same vocabulary.

Link to the executable owner in `lib/authorial-constraint-leakage.ts`. Do not copy the signature table into governance prose.

### 12.3 Active producer prompts

Update only prompts confirmed active or portable by current repo status. At minimum inspect the four named in §4.

Add a concise producer self-audit rule, preferably under each semantic/content floor:

> **Keep authoring constraints off the learner surface.** Enforce nursing scope through the scenario, options, and rationale. Never append a producer instruction such as “Do not independently prescribe/diagnose/change a dose” to a stem. Before delivery, scan every learner-facing field for prompt language copied as an instruction.

Do not copy this sentence into retired archived prompts. Do not expand prompts with the full survey taxonomy.

For `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md`, place the rule where the producer audits learner-facing leakage; do not confuse it with the contract’s separate reverse-leakage concept between case parts.

## 13. Phase F — declarative mutation

Recommended canonical patch:

- `scripts/patches/2026-07-21-authorial-constraint-naturalization.ts`

Requirements:

- use declarative exact `before` → `after` operations through `scripts/patch-raw.ts`;
- target stable bank and top-level/embedded item identity plus exact JSON path;
- one full-string operation per changed path;
- fail closed on missing IDs, duplicate targets, stale `before` text, or unmatched EN/ZH pairing;
- dry-run by default;
- print affected banks, items, paths, languages, dispositions, and blocked rewrites;
- preserve every non-target value and array order.

Authorized canonical reason:

```text
remove learner-facing authorial constraint leakage while preserving nursing-scope logic in choices and rationales
```

If the forcing item is still in raw or staged content rather than canonical content, repair the raw source programmatically and use the ordinary promotion pipeline. Do not invoke canonical mode merely because the work order anticipated it.

## 14. Phase G — prospective audit

Recommended file:

- `scripts/audit/audit-authorial-constraint-leakage.ts`

Wire it into Tier 1 of `scripts/audit.ts` only after the baseline has been adjudicated and the blocking set is shown to have no legitimate live-bank matches.

### 14.1 Blocking set

The blocker may include only:

- exact confirmed full clauses; or
- tightly bounded imperative signatures that reproduce confirmed leaks and pass all required negative tests.

The likely initial English signature is a `TASK_STEM_OR_INSTRUCTION` or `TEST_TAKING_STRATEGY` sentence matching the equivalent of:

```text
Do not independently <provider-level verb>
```

with the finite verb set in §9.2.

This is an orientation, not permission to ship that regex unchanged. Test punctuation, quoting, negation, sentence boundaries, and legitimate option/rationale contexts first.

### 14.2 Advisory set

Broader signatures remain advisory and are emitted by the standalone survey, not by Tier-1 failure. Advisory examples:

- `do not assume`;
- `for purposes of this question`;
- `within nursing scope`;
- `provider-only action`;
- `independently change` outside a blocking surface;
- prompt-derived clauses in options or rationales.

### 14.3 Audit behavior

- zero blocking hits → `PASS`;
- any blocking hit → `FAIL` with bank, stable item identity, exact path, exact sentence, signature ID, and prompt provenance;
- advisory candidates never change the audit verdict;
- `meta.source`, IDs, audit/provenance blocks, schema tokens, and non-rendered configuration remain excluded through the shared learner-facing traversal.

Do not weaken the signature set merely to obtain a green post-remediation audit.

## 15. Focused tests

`scripts/tests/authorial-constraint-leakage.ts` must prove at least:

1. The exact forcing sentence is detected in a stem.
2. Close imperative variants with `prescribe`, `diagnose`, `change`, `adjust`, `titrate`, `order`, `insert`, and `perform` enter the candidate set.
3. A confirmed blocking signature fails only on an authorized blocking surface.
4. `Select only actions within nursing scope` enters the candidate set but does not automatically become blocking unless adjudicated.
5. The same words in `meta.source` are excluded.
6. A rationale explaining that the nurse cannot independently prescribe insulin is classified as visible but is not a mechanical failure.
7. An incorrect option proposing an independent dose change is not a mechanical failure.
8. A client-teaching option saying not to change insulin without the prescribed plan is not a mechanical failure.
9. A legitimate Management of Care stem asking which action is outside nursing scope is not a mechanical failure.
10. Ordinary response instructions such as `Select the 2 priority actions` do not enter the candidate set.
11. Nested case-study questions and stage/exhibit prose are traversed.
12. `testTakingStrategy` is traversed.
13. EN and ZH counterpart paths resolve when structurally paired.
14. An observed Chinese confirmed phrase fails only after it is explicitly added to the finite blocker.
15. Prompt provenance points to the exact configured source clause and does not invent a source for an unattributed candidate.
16. Duplicate signature matches in one sentence retain evidence without duplicating the patch disposition.
17. Survey output is deterministically sorted and byte-identical on repeat run.
18. Post-remediation live banks contain zero blocking hits.
19. The existing producer-vocabulary audit remains green and behaviorally unchanged.

## 16. Exact-diff and semantic-preservation gate

Capture parsed objects and exact target strings before mutation. After mutation prove:

1. changed bank/path set equals the approved `CONFIRMED_AUTHORIAL_CONSTRAINT_LEAK` dispositions;
2. no unplanned canonical bank changed;
3. no question or embedded ID changed;
4. no item type, category, topic, difficulty, `ngnSkill`, source, answer key, option/token/ref ID, scoring, visual, structured measurement, exhibit identity, or stage identity changed;
5. no array reordered;
6. no serialization churn outside expected full-string replacements;
7. the forcing item still has exactly one keyed condition, two keyed actions, and two keyed parameters;
8. removing the final sentence does not change the set of defensible keyed actions;
9. the scope boundary remains explicit in the choices and/or rationale;
10. EN/ZH facts and response demand remain equivalent;
11. question counts, scored-leaf counts, and visual counts are unchanged.

If any answer-bearing option or key must change, the bounded naturalization task is not sufficient. Mark the item `BLOCKED_ITEM_REWRITE` and require independent clinical review before mutation.

## 17. Reports and ledger

Write:

- `audit/authorial-constraint-leakage-2026-07-21/remediation-report.md`

Include:

1. branch, HEAD, upstream, and starting/ending dirty paths;
2. canonical bank and scored-leaf populations scanned;
3. forcing-item locator result and full stable identity;
4. active prompt files inspected and provenance clauses extracted;
5. traversal inclusion/exclusion contract;
6. candidate counts by signature family, bank, producer prefix, surface class, and language;
7. every adjudication and its evidence;
8. confirmed-leak count and distinct-item count;
9. forcing-item answerability/scope-preservation analysis;
10. exact changed paths and before/after strings;
11. blocked item rewrites or ambiguous residuals;
12. prompt/governance changes;
13. blocking vs advisory signature disposition;
14. exact-diff proof;
15. bilingual parity proof;
16. post-remediation blocking and advisory counts;
17. patch idempotency;
18. all verification commands and results;
19. final implementation verdict: `READY_FOR_INDEPENDENT_CONTENT_REVIEW`, `READY_WITH_BLOCKED_ITEM_REWRITES`, or `BLOCKED`.

Add a `BANK-REVIEW-LEDGER.md` entry for any canonical content correction. Record:

- the learner-reported forcing sentence;
- the prompt-rule provenance;
- confirmed item/path count;
- whether the forcing repair was deletion-only or required an item rewrite;
- confirmation that keys, IDs, clinical facts, sources, scoring, and counts did not change;
- EN/ZH parity status;
- patch script/reason;
- audit/test paths;
- independent-review status.

Do not mark the content `REVIEWED` until the independent checker closes it.

Update `PROJECT-HISTORY.md` only if this pass changes active audit coverage or active producer contracts materially. If updated, record only what actually landed; do not duplicate the report’s item-by-item detail.

## 18. Verification floor

Run, at minimum:

```sh
npx tsx scripts/tests/authorial-constraint-leakage.ts
npx tsx scripts/authorial-constraint-leakage-survey.ts
npx tsx scripts/tests/producer-vocabulary-leakage.ts
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
- apply only after exact dispositions are fixed;
- rerun the patch and prove zero writes;
- rerun the survey and preserve advisory residuals rather than forcing them to zero;
- prove the post-remediation blocking count is zero;
- inspect every changed EN/ZH field directly;
- prove no question population changed.

A green build or schema validation does not prove that an authorial disclaimer was removed safely.

## 19. Independent review handoff

The non-GPT checker receives:

- baseline and post-remediation survey artifacts;
- adjudication JSONL;
- active-prompt provenance map;
- exact canonical/raw patch;
- exact bank diff;
- remediation report;
- audit and focused tests.

The checker must independently review:

1. every confirmed leak and every changed learner-facing field;
2. the forcing bowtie’s condition, actions, and parameters after sentence removal;
3. whether any retained candidate is actually another leak;
4. every EN/ZH paired change;
5. every signature promoted from advisory to blocking;
6. negative-test coverage for legitimate scope teaching;
7. prompt hardening for clarity and non-duplication;
8. preservation of the clinical scope rule without answer telegraphing.

The checker may clear the ledger to `REVIEWED` only after these checks pass.

## 20. Stop conditions

Stop canonical mutation and report the applicable code if:

- `BLOCKED_CANONICAL_OVERLAP` — a canonical bank is already modified at task start;
- `FORCING_ITEM_NOT_FOUND` — the reported item cannot be located on the stable live snapshot;
- `FORCING_ITEM_COLLISION` — multiple live copies match and identity cannot be resolved;
- `BLOCKED_ITEM_REWRITE` — deletion changes answerability or exposes an unsafe/ambiguous action set;
- `BLOCKED_TRAVERSAL_GAP` — learner-facing fields cannot be structurally distinguished from metadata/configuration;
- `BLOCKED_FALSE_POSITIVE_FLOOR` — no useful blocking signature can distinguish the leak from legitimate scope teaching;
- `BLOCKED_BILINGUAL_PARITY` — the paired Chinese meaning cannot be repaired safely;
- `BLOCKED_PATCH_PRECONDITION` — exact before text, stable identity, or path does not match;
- `BLOCKED_CONCURRENT_BANK_WRITE` — the scanned bank changes during survey or patching.

Failure to justify a broad blocker does **not** block completion of the survey and forcing-item repair. In that case, ship the candidate survey as advisory-only and report `NO_SAFE_BLOCKING_SIGNATURE` rather than installing a noisy gate.

## 21. Exit checklist

- [ ] Starting branch/HEAD/worktree recorded
- [ ] Existing producer-vocabulary audit left behaviorally unchanged
- [ ] Forcing item uniquely located by stable identity
- [ ] Complete EN/ZH bowtie fields inspected
- [ ] Removal tested against action/key ambiguity
- [ ] All bundled learner-facing fields structurally surveyed
- [ ] Active producer constraints mapped to finite provenance clauses
- [ ] Every candidate receives an evidence-based disposition
- [ ] Confirmed leaks naturalized without removing clinical rules
- [ ] Legitimate scope teaching remains untouched
- [ ] Forcing sentence removed from both language surfaces
- [ ] Scope boundary remains in choices and/or rationale
- [ ] Active producer prompts carry the prospective rule
- [ ] `AGENTS.md` and principle 21 record the constraint-vs-surface rule
- [ ] Canonical mutation, if needed, is declarative and precondition-checked
- [ ] Exact-diff and bilingual-parity gates pass
- [ ] Blocking set is narrow, measured, and negative-tested—or explicitly withheld
- [ ] Advisory residuals remain visible in the report
- [ ] Post-remediation blocking count is zero
- [ ] Patch is idempotent
- [ ] Validation, audit, census, TypeScript, build, and diff checks pass
- [ ] Ledger/report written
- [ ] Final status awaits independent non-GPT content review
- [ ] No commit or push
