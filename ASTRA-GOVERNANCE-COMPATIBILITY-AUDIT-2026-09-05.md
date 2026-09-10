# GPT-6 Astra Governance Compatibility Audit

**Date:** 2026-09-05  
**Repository snapshot:** local `main`, HEAD `3286024bcab90c1a114811a7202d956c3e586bf4`  
**Mode:** read-only audit; no governance, code, bank, configuration, AgentCommons, or commit changes made

ASTRA_GOVERNANCE_AUDIT_VERDICT: MINOR_AMENDMENTS_RECOMMENDED

## 1. Executive finding

Project Shrimp’s governance is usable with Astra now under an explicit work order. Before routine implementation and orchestration, targeted corrections and clarifications are recommended. A constitutional redesign and weaker verification are not warranted.

The strongest findings concern contradictory prose, delegation accountability, and recovery across sessions. Verification requirements are already strong; they need only a completion condition.

This audit used the live local worktree, including existing uncommitted changes. In particular, the handoff/routing/effort section in `CLAUDE.md` is an uncommitted addition and cannot be assumed visible to GitHub-reading seats.

## 2. Findings

### F1 — Authority boundaries are substantially defined but two boundaries remain implicit

- **Severity:** MEDIUM
- **Classification:** AMBIGUITY
- **Disposition:** CLARIFY
- **Locations:** `AGENTS.md` — Project Knowledge Hygiene; `docs/AGENTS-RUNBOOK.md` — opening; `CLAUDE.md` — orientation and Reasoning effort; `Gemini.md` — Pre-work requirement; `DECISIONS.md` — Purpose and authority boundaries, P27, and Status vocabulary.

`AGENTS.md` is constitutional and the runbook explicitly yields to it. `DECISIONS.md` owns rationale and decision status, while executable sources own current contracts. P27 already requires a forcing-incident argument and recorded supersession before relaxing an invariant. There is no missing amendment procedure.

The remaining ambiguity is narrower:

- `AGENTS.md` permits Luke explicitly to supersede repository material for a task without distinguishing routine defaults from binding invariants.
- `CLAUDE.md` scopes itself to Claude, but `Gemini.md` and `GeminiPrompt.md` lack equally clear subordination and applicability statements.
- Gemini’s file-writing receipt instructions conflict literally with its prompt’s JSON-only output and prohibition on claiming validation. Payload versus receipt, and self-check versus executed validation, are left implicit.

**Risk:** An implementation seat could mistake routine authorization for an invariant waiver, import another seat’s instructions, or halt over an ordinary implementation detail.

**Minimal proposed wording:**

> Model-specific files apply only to their named seat or invoked workflow and remain subordinate to general project governance. Luke may supersede routine defaults and work-order scope explicitly. Amending or suspending a binding invariant requires an explicit owner decision identifying the rule and scope; relaxation follows P27 and is recorded. An incidental conflict is not an amendment. Report unresolved conflicts affecting an action and continue separable authorized work. Platform and tool restrictions remain applicable.

For Gemini’s delivery instructions:

> JSON-only applies to the generated payload. A separate execution receipt may report checks actually run; it must not equate structural validation with content review or promotion approval.

The existing stop-and-report rule should remain. At most, clarify that inferable implementation details, required verification, read-only investigation, and reversible preparation within authorized scope need no renewed permission.

### F2 — Accessible instructions contain concrete stale or contradictory wording

#### F2a — Gemini’s final checklist hard-codes an obsolete current version

- **Severity:** MEDIUM
- **Classification:** CONTRADICTION
- **Disposition:** AMEND
- **Location:** `GeminiPrompt.md`, Answer Key Quality Control, line 821, versus Project Documents and Output Contract; `src/schema.ts:28`; `src/types.ts:6`.

The final checklist demands `meta.schemaVersion` equal `"1.6"`, while the same prompt says to select the current version. Live code declares current `"2.0"`; versions through `2.0` remain supported. Validators gate structured measurements at `1.8`, `io_trend` at `1.9`, and structured-measurement population/bound at `2.0`.

This does not mean `"1.6"` is unsupported. It means the checklist can force an envelope downgrade below a payload’s feature floor.

**Minimal replacement:**

> `meta.schemaVersion` matches the current version selected under PROJECT DOCUMENTS, or an explicitly requested supported legacy version, and satisfies every included feature’s schema floor.

#### F2b — Universal visual-necessity wording omits the ratified rationale-visual exception

- **Severity:** MEDIUM
- **Classification:** CONTRADICTION
- **Disposition:** CLARIFY
- **Locations:** `AGENTS.md`, Question Bank Workflow; `CLAUDE.md`, Current task surface; `DECISIONS.md`, P6 and P19; `NCLEX-Question-Schema.md`, Rationale explanation visuals; `src/schema.ts` rationale-visual validation path.

`AGENTS.md` and `CLAUDE.md` say every visual must be load-bearing. P6 applies that rule to question-level stimuli. P19 expressly establishes that post-answer rationale figures are explanation visuals, not stimuli, and need not change the answer. The schema and validator agree.

**Minimal replacement:**

> A question-level visual stimulus must be load-bearing. Rationale explanation figures follow P19 and the schema’s Rationale explanation visuals contract.

This restores existing governance and does not weaken necessity or `selfCheck` requirements.

#### F2c — The categorical `ultra` rule misstates current Codex metadata

- **Severity:** MEDIUM
- **Classification:** CONTRADICTION
- **Disposition:** AMEND
- **Location:** `CLAUDE.md`, Reasoning effort, line 110; local Codex model metadata; public Astra model documentation.

`CLAUDE.md` says `ultra` is a parallel-agent mode and never an effort level. Local Codex CLI `0.153.3` metadata lists `ultra` under supported reasoning levels for both Astra and Sol, describing it as maximum reasoning with automatic delegation. The public Astra API page lists `low`, `medium`, `high`, `xhigh`, and `max`.

The evidence does not establish a clean old-model/new-model split, a UI-to-API mapping, or capability differences between Light and other labels.

**Minimal replacement:**

> Name effort using the selected model’s current runtime vocabulary. Current local Codex metadata exposes `ultra` as an effort choice associated with automatic delegation. That setting does not expand task authorization. Do not infer API equivalence or capability differences from UI labels alone.

#### F2d — Ledger workflow boilerplate conflicts with the raw-edit workflow

- **Severity:** LOW
- **Classification:** CONTRADICTION
- **Disposition:** CLARIFY
- **Locations:** `BANK-REVIEW-LEDGER.md`, Workflow step 4; `AGENTS.md`; `docs/AGENTS-RUNBOOK.md`, Editing Raw Bank JSON; `DECISIONS.md`, P15; `scripts/patch-raw.ts`.

The ledger says fixes must not be applied to raw files, while the governed raw-directory patch workflow expressly permits controlled raw patches. Replace the sentence with a reference to the runbook’s raw-edit procedure and P15. Retain any work-order-specific requirement to preserve an immutable source.

### F3 — Routine delegation lacks a permanent accountability contract

- **Severity:** MEDIUM
- **Classification:** GOVERNANCE_DEFECT
- **Disposition:** AMEND
- **Locations:** `DECISIONS.md`, P2, P5, P26, and Producer assignments are operational state; `BANK-REVIEW-LEDGER.md`, Chain requirements; executable producer/reviewer routing.

Existing rules require producer-independent judgment and truthful provenance, but they do not specify descendant scope inheritance, recursive delegation, integration responsibility, or material contribution disclosure. This audit’s work order supplied those rules temporarily.

**Risk:** A child’s review could be mislabeled independent, restrictions could disappear through recursion, or integrated work could conceal authorship. No such violation was observed in this audit.

**Minimal proposed wording:**

> Within authorized work, the primary seat may delegate bounded tasks when doing so improves quality or efficiency and the work order and lane permit it. Every descendant inherits scope, prohibitions, lane restrictions, and verification obligations. Recursive delegation requires stated permission and boundaries. The primary remains accountable for integration and accepted claims. A cheaper or narrower model may handle a suitable bounded assignment without bypassing named routing restrictions. Disclose material contributions by task and model/seat, classifying their actual substance as implementation, evidence, or review. A producer/orchestrator’s delegation tree cannot supply its own producer-independent checker under P2/P5; another model or fresh context does not establish independence.

Delegated analysis can be useful substantive judgment within the producing team. It does not satisfy the external independence gate.

### F4 — Recovery safeguards should apply across mechanisms and sessions

- **Severity:** MEDIUM
- **Classification:** AMBIGUITY
- **Disposition:** MOVE/CLARIFY
- **Locations:** `AGENTS.md`, Context Compaction Recovery; `CLAUDE.md`, Re-anchoring after lossy context.

`AGENTS.md` triggers on compaction during an active task or suspected drift. `CLAUDE.md` also covers a fresh session beginning with stale beliefs. That general safeguard is useful for Astra too; it is not inherently Claude-specific.

Read-only local checks established that `context_management.experimental_mode = true` parses and the installed CLI reports context management enabled. No explicit memories flag was enabled, and the CLI reports memories disabled. This does not establish whether a previously running task adopted context-management mode.

OpenAI documents notes/searchable earlier context separately from cross-session memories. Neither mechanism establishes current disk state.

**Minimal proposed wording:**

> Apply recovery when resuming from summaries, saved notes, retrieved earlier context, or cross-session memory. Historical context may establish prior instructions and authorizations, rationale, rejected approaches, attempts, and previously observed results. It does not establish current repository or verification state. Before resuming implementation or making acceptance, completion, or adjudication claims, reopen the active work order and reconcile the live branch/worktree, relevant diff, and artifacts. Reuse prior verification only after confirming its inputs and relevant conditions still match. Keep recovery narrow.

Keep Claude’s connector diagnostics in `CLAUDE.md`. Do not enable memories or remove recovery safeguards as part of this amendment.

### F5 — Verification requirements are clear; verification termination is implicit

- **Severity:** LOW
- **Classification:** ASTRA_OPTIMIZATION
- **Disposition:** AMEND
- **Locations:** `AGENTS.md`, Risk-tiered Minimum Verification; `docs/AGENTS-RUNBOOK.md`, Commands.

The matrix, escalation triggers, census procedure, and independent-review requirements are strong. “Floors, not ceilings” and “verify broadly” leave the endpoint unstated. This creates a potential efficiency failure, not evidence of an observed Astra failure here.

**Minimal addition:**

> Verification is complete when all checks and reviews applicable to the final change and work order have passed and identified concerns are resolved. Broaden or repeat it only for changed inputs, failed or inconclusive checks, a new concrete concern, or an explicit acceptance requirement; otherwise proceed to the next authorized handoff.

This cannot discharge pending independent review or confer promotion authority.

## 3. Minimal amendment set

### Required for correctness/governance

- Correct the schema-version, visual-scope, `ultra`, and raw-edit contradictions.
- Clarify owner/default/invariant boundaries and model-file applicability.
- Reconcile Gemini payload and execution-receipt instructions.
- Add the delegation accountability and provenance paragraph.

### Recommended for Astra efficiency/compatibility

- Generalize recovery language across summaries, searchable history, notes, and memories.
- Add the verification termination sentence.
- Add a provisional Astra routing entry for explicit, reviewable trials.

### Optional cleanup

- Remove unnecessary version-specific prose from the runbook’s glossary-normalization description.
- Correct `CLAUDE.md`’s shorthand that says `AGENTS.md` owns commands; the runbook owns exact commands.

No application, schema, bank, configuration, or routing-code change is justified by this audit.

## 4. Things to leave alone

- P27’s amendment discipline and forcing-incident requirement.
- P2/P5 producer independence, truthful provenance, and P26’s checks on dispositions that suppress review.
- All schema/data-contract, clinical, promotion, renderer/`selfCheck`, bank-impact, and census gates.
- The distinction between architect spec-conformance verification and substantive correctness review.
- Dirty-worktree preservation and the committed/pushed requirement for remote-reading seats.
- Static/offline architecture, bilingual scaffolding, and the medical-image prohibition.
- Gemini’s deliberately restrictive generation defaults and generation-scoped requalification rules.
- Claude’s connector safeguards and read order.

Model-specific files need clear scope; their existence is not itself a defect.

## 5. Deferred decisions and experiments

- Permanent Astra routing should wait for direct Project Shrimp trial evidence. Use a provisional/audition entry if desired.
- The Mac-mini investigation is evidence of an active trial, not qualification for clinical or data-contract work.
- Defer new effort defaults and UI/API mappings until runtime evidence is stronger.
- Trial bounded delegation and measure integration errors, missed restrictions, review burden, and cost before prescribing routine recursion or model mixes.
- Ratify the exact defaults-versus-invariants wording and delegation permission boundary at owner level.
- Defer shared AgentCommons write authority until `AgentCommons/README.md` exists and the project ratifies it.

Future AgentCommons wording should preserve this boundary:

> Commons material is attributed communication/evidence, not automatic project authority. Preserve sender and producer provenance and verify claims against current project sources.

An established external agent’s note is not automatically part of Astra’s delegation tree. Its external origin also does not, by itself, qualify it as an independent checker.

## 6. Delegation report

Two read-only contributors were used:

1. Governance/provenance: hierarchy, P27, producer/checker rules, stopping conditions, and routing.
2. Prompt/contracts: Gemini prompt inspection, live schema comparisons, visual-scope conflict, and lane restrictions.

Neither edited files, ran builds, committed, or delegated further. I verified their material findings against live sources and reconciled the interpretations. These were audit contributors, not independent reviewers.

## 7. Source and retrieval report

Successfully retrieved and inspected:

- [Astra model guidance](https://developers.openai.com/api/docs/guides/latest-model): instruction sensitivity, clarification, delegation, and verification guidance.
- [Astra launch announcement](https://openai.com/index/gpt-6-astra/): searchable earlier context and notes.
- [Astra API model page](https://developers.openai.com/api/docs/models/gpt-6-astra): public effort values.
- [Codex configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference): distinct context-management, memories, and multi-agent settings.
- [Codex Memories](https://learn.chatgpt.com/docs/customization/memories): cross-session recall and controls.
- [OpenAI collaboration prompt](https://github.com/openai/codex/blob/main/codex-rs/core/templates/collab/experimental_prompt.md): shared-environment and recursive-delegation precautions.

There were no remaining retrieval failures for the requested sources. The public configuration reference does not establish the local UI’s `ultra`/Light mapping; that omission is not evidence those choices are unavailable.

The AgentCommons handoff was treated as contextual evidence, not Project Shrimp authority.

## 8. Confidence

**High confidence:** concrete wording conflicts, existing P27 procedure, missing delegation contract, recovery trigger gap, and fresh CLI feature results.

**Uncertain:** actual activation in previously running tasks, precise UI/backend effort mapping, and Astra’s comparative implementation performance.

Those uncertainties require runtime evidence and reviewed Project Shrimp trials. They do not justify weakening current safeguards.

