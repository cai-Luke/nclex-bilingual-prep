# CLAUDE.md

Orientation for Claude working on **Project Shrimp / NCLEX Bilingual Prep**. This file does not repeat `AGENTS.md` or `PROJECT-HISTORY.md` — read those first. It covers what is specific to working *as Claude* here: your role, your filesystem access, and where the reasoning behind the rules lives.

## Read order

1. **`AGENTS.md`** — operational rules, constraints, commands, the question-bank and visual workflows. Source of truth for *how* to work in the repo.
2. **`PROJECT-HISTORY.md`** — the living status map. Source of truth for *what currently exists*. Implementation facts there override older prose anywhere, including this file.
3. **`DECISIONS.md`** — the *why* behind the architecture and the open threads. Read before proposing changes to generation, promotion, or auditing. Its entry format is machine-checked by `npm run test:decisions-format` and `npm run conform:decisions`; name both in any work order that edits it.
4. **`NCLEX-Question-Schema.md`** — schema source of truth (mirrored by `src/types.ts`, validated by `src/schema.ts`).

## Re-anchoring after lossy context

`AGENTS.md` → *Context Compaction Recovery* binds this seat as well as Codex's; it is not restated here. What follows is only the part that differs for Claude.

**Your lossy channel is not only in-conversation compaction.** Cross-session memory arrives at the start of a session as an already-compressed summary of past conversations, with no compaction event to notice. The `AGENTS.md` trigger keys on context being compacted *during* an active task; a fresh session that opens already "knowing" about an in-flight work order has skipped that trigger while inheriting the identical defect. So: **any belief about Project Shrimp state that did not come from a read in this session is a claim to verify, not a fact** — which branch is current, whether a spec is executed, what phase a multi-stage job is in, what a bank contains, what a principle now says.

**Durable state here is not only git.** `scratch/` is gitignored, so active work orders and specs living there appear in no `git status` or diff and are invisible to a GitHub-reading seat — absence from a diff is not evidence a work order does not exist; `list_directory` it. `banks/banks-raw/` is the mirror hazard: it is ephemeral, so presence there proves nothing durable either. The reconstruction surface for this seat is `current_branch`, `repository_status`, `recent_commits`, `ahead_behind`, `untracked_files`; the anchor document's own status/receipt/walkthrough files; dated artifacts under `audit/`; the newest resumption note for multi-phase governance work; and `PROJECT-HISTORY.md` / `DECISIONS.md` status only where the anchor cites them.

**Codex's headline risk is redoing work; yours is ruling on it.** This seat adjudicates findings, gates diffs, and drafts governance wording. An adjudication issued from recall is worse than a redone implementation, because it hardens into the record. No acceptance, no rejection, no completion claim, and no `DECISIONS.md` wording from memory — read the live artifact first. The converse holds equally: do not reopen a closed principle, an executed work order, or an adjudicated departure because a summary rendered it as unfinished.

**Narrow recovery governs resuming a task, not starting one.** It is not licence to skip the read order above when opening new work.

## You have filesystem access — use it

You can reach the repo working tree directly through a filesystem MCP connector. **Discover scope at runtime; never hard-code it.** At session start, call `list_allowed_directories` on every mounted filesystem connector and use whichever one's allowed root contains the repository. Do not assume a root, a relative path, or a tool prefix, because mounts change. If a path misses or is denied, re-check every connector's allowed directories and list the parent directory before concluding a file is absent. The path contains a space (`Project Shrimp`); that is harmless when passed as a single argument.

**Suspect the reader before the repo.** U+FFFD, mojibake, or garbled glyphs in a read are a connector-read artifact until a byte-level check shows otherwise: re-read before reporting anything, and do not open a repair or remediation lane on a lossy read. A CI gate for this was considered and withdrawn (`DECISIONS.md` §8); do not re-propose it.

**Verifying your own writes** follows `AGENTS.md` → *Risk-tiered Minimum Verification* and its completion rule; there is no additional Claude-specific re-verification step. Ask Luke for a shell-level check only when a readback or encoding ambiguity remains unresolved after a re-read.

When you need a file — the schema, a source module, `BANK-REVIEW-LEDGER.md`, a bank JSON, an existing spec — **pull it and read it.** Do not ask Luke to paste it, and do not reconstruct its contents from memory; repo status drifts and recollection goes stale. High-value files to pull on demand:

- `src/visuals/` — the visual kind registry, `primitives/`, and per-kind renderers.
- `src/schema.ts`, `src/types.ts`, `src/grading.ts` — validation, the visual union, grading.
- `scripts/validate-bank.ts`, `scripts/coverage-report.ts` — the verification path.
- `docs/AGENTS-RUNBOOK.md` — commands, quote-repair mechanics, promotion routing, and ledger timing; `AGENTS.md` states the rule, this file gives the exact invocation.
- `banks/*.json` — canonical banks (read-only; never hand-edit).
- Visual-stimuli unit specs and superseded drafts in `Archive/` (the `U*-*-SPEC.md` per-kind specs).

If a file isn't where you expect, list the directory rather than guessing.

## Your role here

The division of labor (per `PROJECT-HISTORY.md`):

- **Claude → planning, specs, judgment, cross-model review.** This is your seat. Author specs precise enough to hand off, adjudicate findings, and decide when consensus is reached.
- **Codex → code implementation.** Architecture ownership sits with the implementation agent, not with content models.
- **Content generation / review → multiple models, one rule: the model that generated a batch never reviews it.** Cross-model review precedes promotion.
- **The content-generating models read the repo, not the disk.** The parallel GPT generation instances have GitHub (read) access to the markdown contracts — `NCLEX-Question-Schema.md`, `AGENTS.md` — but no live filesystem like yours. So generation prompts can defer schema *shape* to those docs by section reference and stay light, carrying inline only the semantic floor the docs leave to review (no-filler distractors, per-choice clinical reasoning, closed-world stems, bilingual parity). The catch: an instance may read a **stale snapshot** in a long session, so single-shot blocks plus a clean/pushed worktree (Luke's responsibility) are what keep it current.

**Promotion gate, scoped by provenance.** When Luke brings raw bank files, assume they have already been generated; pull them directly rather than asking him to paste or describe them. You may act as the final promotion gate (schema validation, selfCheck, content review for clinical accuracy, bilingual parity, answer unambiguity, and visual necessity, then `npm run promote`, `npm run audit`, ledger update) only where the live provenance and independence rules permit it for that batch. Those rules are owned by `DECISIONS.md` (P2, P5, and *Deterministic review routing for promoted opus-prefixed case IDs*) and enforced by the current audit tooling; this file does not restate their implementation paths. Running the promotion mechanics never gives you sole semantic clearance over content on which Claude is conflicted as producer.

### When a raw bank won't parse — curly-quote recovery

A `validate-bank` JSON parse error on a `banks/banks-raw/*.json` file is almost always smart-quote corruption from a prior hand-edit. Don't hand-diagnose — run `tsx scripts/fix-bank-quotes.ts banks/banks-raw/<file>.json` (add `--in-place` once you trust the diff). The full quote-safety rules and recovery semantics live in `docs/AGENTS-RUNBOOK.md` → *Editing raw bank JSON (quote safety)*; the rationale is `DECISIONS.md`'s JSON-quote-hygiene invariant.

Work spec-first: plan and specify here, hand implementation to Codex or Claude Code, PR to GitHub. Prefer small, well-scoped changes that match existing patterns; do not rewrite app architecture during feature work.

## Handoff: naming the seat

Every work order names exactly who executes it. A header that says only "Codex" is incomplete — Codex is a harness, not a model, and both the model and the reasoning effort change what comes back.

Required header, before section 0:

```
**Implementation seat:** <Codex | Claude Code> / <role>
**Model:** <exact current model>
**Reasoning effort:** <level>   [Codex required; Claude Code when non-default]
**Independent review:** <seat / rule, when required>
**Date:** <YYYY-MM-DD>
**Mode:** <...>
```

Close the work order with a one-line trailer so the launch is unambiguous:

```
SEND TO: Codex — GPT-5.6 Sol — high
```

Applies to work orders authored from 2026-08-27 forward; earlier ones are not retrofitted. The launch block stays inline in conversation — do not write a separate `scratch/*-LAUNCH-PROMPT.txt`, since the work order on disk is the artifact.

### Independent review

`Independent review:` names a seat or a rule, never a blanket disqualification. Per `DECISIONS.md` P2 — Application: the seat that produced the artifact under review is not its sole substantive checker, while spec-conformance verification stays with the architect who wrote the spec. Claude Code implementing a Claude-authored work order is therefore ordinary and needs no separate ratification.

The one carve-out is content, not code. Learner-facing clinical material keeps its existing provenance routing under P5 and the standing invariant on promoted `opus*`-prefixed case IDs, under which Claude-authored items route to a non-Claude reviewer. That governs the content surface only and says nothing about who may implement a spec.

### Current routing — reviewed 2026-09-05

Operational state, not a project invariant. Update it when the roster changes or when observed model behavior changes. This table is expected to go stale and is maintained rather than abstracted.

| Seat / model | Route here when |
|---|---|
| Codex / GPT-5.6 Luna | Tightly bounded mechanical implementation: enumerated edits with quoted anchors, mechanical refactors, scaffolding against a fixed matrix. |
| Codex / GPT-5.6 Sol | Residual judgment: an anchor that may have drifted, a decision the spec deliberately leaves open, multi-file coherence, or a step whose correct action depends on what the implementer finds in source. |
| Codex / GPT-6 Astra | **Provisional high-judgment/orchestration lane.** Use for explicit trials where difficult multi-file reasoning, long-horizon recovery, or bounded delegation may help. Do not displace the established Luna/Sol/Claude Code routes by default until reviewed Project Shrimp implementation evidence supports permanent rerouting. Delegation remains governed by `AGENTS.md`; selecting Astra or a high-effort mode does not create checker independence or expand task authority. |
| Claude Code / Claude Sonnet 5 | Default Claude Code lane. Looser spec, implementer expected to fill gaps sensibly; work where reading the surrounding code matters more than recognizing the problem shape. |
| Claude Code / Claude Opus 5 | Judgment-heavy or coherence-critical work where a passing build does not guarantee correct logic — schema, grading, promotion routing, anything touching a data contract. |

Deliberately unrouted, so a future reader knows the gaps are choices:

- **GPT-5.6 Terra** — bounded work goes to Luna and judgment work to Sol; nothing currently sits between them. A routing call, not an assessment of the model.
- **Claude Haiku 4.5** — not routed to at any tier. Version bumps do not reopen this lane.
- **Claude Fable 5** — closed by access rather than by judgment. Safeguards routing intercepts biology-adjacent requests, which covers effectively this whole project's content surface, so the lane has never been usable here in practice. Revisit if that changes.

If a work order **intended to be mechanical** cannot be assigned to Luna without adding judgment calls, that is a signal it is under-specified — tighten it, or route to Sol deliberately rather than by default. A work order that was never meant to be bounded simply goes to Sol.

### Reasoning effort

A separate dial from model choice; set both deliberately. Name effort using the selected model's current runtime vocabulary rather than assuming one fixed label set. Current local Codex metadata (reviewed 2026-09-05) exposes `ultra` as an effort choice associated with automatic delegation for both Sol and Astra, while public API documentation uses different effort names. That setting does not expand task authorization. Do not infer API equivalence or capability differences from UI/runtime labels alone.

Set effort by the task's dominant failure mode. **high** is the default for anything carrying a source-verification gate or reconstructing behavior from source. Drop to **medium** when the work order is fully enumerated and the dominant risk is doing more than asked. Reserve the selected runtime's highest effort levels for exceptionally difficult reasoning that is nonetheless fully in scope; difficulty is the trigger, not ambiguity. Where a work order does not confer authority to decide, the correct behavior is stop-and-report at any effort level, and raising effort never substitutes for the missing authorization.

More effort is not free of behavioral risk — on a tightly fenced task it raises the chance of scope drift, not the chance of a correct edit. For Claude Code, use the model's default and name a level in the header only when departing from it.

## House style for your work

- **Deterministic core, LLM only for the irreducible semantic residual — and cap it.** Counting, distributions, and permutation checks are scripts, never model calls. See `DECISIONS.md` for why.
- **Precision over volume.** A short, fully-evidenced output beats a long speculative one — this is the explicit grading standard in the adversarial audit spec.
- **Bilingual is an invariant.** Every rule, check, and renderer that touches text covers English *and* Simplified Chinese, or it is incomplete.

## JSON authoring: curly-quote hazard

Editing bank JSON risks smart-quote corruption — structural delimiters upgraded to curly quotes, or in-string Chinese speech marks downgraded to bare ASCII `"`. The full rules (ASCII `"` for all structure; Chinese quotation marks valid only inside `zh` values; escape a literal in-string `"` as `\"`) and the migrate-via-serializer discipline live in `docs/AGENTS-RUNBOOK.md` → *Editing raw bank JSON (quote safety)*, with the why in `DECISIONS.md`'s JSON-quote-hygiene invariant. Don't retype JSON shape by hand — load → mutate → re-serialize, or use `scripts/patch-raw.ts`.

## Current task surface: visual taxonomy open; most lanes are content work

The visual system is a kind registry under `src/visuals/` (the U0 refactor). The original ten roadmap kinds have landed, and U10 adds `injection_site` as kind eleven. Reusable primitives in place: `lineChart` (charts), `table.ts`'s `renderDocTable` (documentation tables) and `renderFieldPanel` / `measureFieldPanel` (key→value label/screen panels, landed in U6). The shared numeric helpers `fmt` / `fmtNum` / `roundTo` have a **single definition** in `primitives/graphPaper.ts` — every arithmetic kind imports them and none redefines (a correctness invariant, `DECISIONS.md` principle 11). The current schema version and its feature ladder are declared in `PROJECT-HISTORY.md` and `NCLEX-Question-Schema.md`. This file does not restate them. Highlight: Table remains out of scope.

Most active work is content: the per-kind generation lanes (disjoint ID prefixes `cap_*`, `vit_*`, `lab_*`, `mar_*`, `io_*`, `medlbl_*`, `dev_*`, `burn_*`, `fhr_*`, `inj_*`) run through the existing raw→review→promote→ledger pipeline. Check `PROJECT-HISTORY.md`, `BANK-CENSUS.md`, and `npm run coverage-report` for current per-kind counts and open targets before generating.

Before promoting raw JSON, run deterministic cleanup for mechanical drift when needed:

```
npm run normalize-raw-bank -- banks/banks-raw/<file>.json
```

Review the report, then add `--write` if the changes are the expected enum/glossary/count/empty-array cleanup. Clinical fixes still require content review.

If a new kind is ever proposed (the renderer surface is complete, so this is now the exception, not the workflow) — or when opening a content lane:

- Consult the "add a kind" checklist in `NCLEX-Question-Schema.md` and the per-kind visual specs in `Archive/` (`U*-*-SPEC.md`).
- Honor the five-stage visual promotion gate in `AGENTS.md` and the non-negotiables for question-level visual stimuli: deterministic, locally rendered, inspectable from structured data, and **educationally necessary** — a stimulus whose removal leaves the answer unchanged is decorative and therefore invalid — and never an AI-generated medical image. Rationale explanation figures are governed separately by `DECISIONS.md` P19 and the schema's rationale-visual contract.
- Every kind ships with `selfCheck` assertions and passes registry conformance + determinism + parity tests (`npm run test-visuals`).
