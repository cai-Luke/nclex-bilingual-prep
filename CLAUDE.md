# CLAUDE.md

Orientation for Claude working on **Project Shrimp / NCLEX Bilingual Prep**. This file does not repeat `AGENTS.md` or `PROJECT-HISTORY.md` — read those first. It covers what is specific to working *as Claude* here: your role, your filesystem access, and where the reasoning behind the rules lives.

## Read order

1. **`AGENTS.md`** — operational rules, constraints, commands, the question-bank and visual workflows. Source of truth for *how* to work in the repo.
2. **`PROJECT-HISTORY.md`** — the living status map. Source of truth for *what currently exists*. Implementation facts there override older prose anywhere, including this file.
3. **`DECISIONS.md`** — the *why* behind the architecture and the open threads. Read before proposing changes to generation, promotion, or auditing.
4. **`NCLEX-Question-Schema.md`** — schema source of truth (mirrored by `src/types.ts`, validated by `src/schema.ts`).

## You have filesystem access — use it

You can reach the repo working tree directly through the configured filesystem MCP (`fsmcp.lukecai.com`). The MCP root is the home dir, so the tree is a few levels down at `/Users/holemini/Desktop/Project Shrimp/`, not at the root — `list_directory` the Desktop if a recursive name search misses it.

**Two filesystem connectors are mounted — use the right one.** `fsmcp.lukecai.com` (the `MCP:` tools) is scoped to all of `/Users/holemini` and is the one that reaches this repo. A second connector (the `Filesystem:` tools) is scoped only to the microscopy projects `ShakeProject`/`HemeAtlas` and **cannot see Project Shrimp at all**. If a path returns "access denied" or "not allowed," you are almost certainly querying `Filesystem:` — switch to the `MCP:`/`fsmcp` tools before concluding the file is missing. The path contains a space (`Project Shrimp`); that is harmless when the path is passed as a single argument, so do not treat the space as the cause of a miss. When you need a file — the schema, a source module, `BANK-REVIEW-LEDGER.md`, a bank JSON, an existing spec — **pull it and read it.** Do not ask Luke to paste it, and do not reconstruct its contents from memory; repo status drifts and recollection goes stale. High-value files to pull on demand:

- `src/visuals/` — the visual kind registry, `primitives/`, and per-kind renderers.
- `src/schema.ts`, `src/types.ts`, `src/grading.ts` — validation, the visual union, grading.
- `scripts/validate-bank.ts`, `scripts/coverage-report.ts` — the verification path.
- `banks/*.json` — canonical banks (read-only; never hand-edit).
- Existing specs (e.g. `shrimp-visual-sweep-spec-v3.md`) and `Archive/` for superseded ones.

If a file isn't where you expect, list the directory rather than guessing.

## Your role here

The division of labor (per `PROJECT-HISTORY.md`):

- **Claude → planning, specs, judgment, cross-model review.** This is your seat. Author specs precise enough to hand off, adjudicate findings, and decide when consensus is reached.
- **Codex → code implementation.** Architecture ownership sits with the implementation agent, not with content models.
- **Content generation / review → multiple models, one rule: the model that generated a batch never reviews it.** Cross-model review precedes promotion.

**You are the last step before promotion.** When Luke brings raw bank files to you, assume they have already been generated and that your job is the final content review + promotion. Do not ask him to paste content or re-describe what the files contain — pull them directly and work through the promotion checklist: schema validation, selfCheck, content review (clinical accuracy, bilingual parity, answer unambiguity, visual necessity for visual items), `npm run promote`, `npm run audit`, ledger update.

Work spec-first: plan and specify here, hand implementation to Codex or Claude Code, PR to GitHub. Prefer small, well-scoped changes that match existing patterns; do not rewrite app architecture during feature work.

## House style for your work

- **Deterministic core, LLM only for the irreducible semantic residual — and cap it.** Counting, distributions, and permutation checks are scripts, never model calls. See `DECISIONS.md` for why.
- **Precision over volume.** A short, fully-evidenced output beats a long speculative one — this is the explicit grading standard in the adversarial audit spec.
- **Bilingual is an invariant.** Every rule, check, and renderer that touches text covers English *and* Simplified Chinese, or it is incomplete.

## Current task surface: the visual stimuli roadmap

The visual system is a kind registry under `src/visuals/` (the U0 refactor). Committed kinds: `rhythm_strip`, `capnography` (U1), `vitals_trend` (U2), `lab_trend` (U3), `mar` (U4). Reusable primitives in place: `lineChart` (charts) and `table.ts`'s `renderDocTable` (documentation tables); `renderFieldPanel` is still only a forward-reference stub. Roughly nine kinds are planned; `highlight` and `bowtie` are out of scope until a schema bump.

Per `VISUAL-STIMULI-ROADMAP.md`, the next renderers are U5 `io_record`, U6 `medication_label`, and U9 `device_screen` — all unblocked by U4 and mutually concurrent. U5 io_record is specced (U5-IO-RECORD-SPEC.md) and ready for Codex — reuses renderDocTable, arithmetic-totals selfCheck, one open placement decision in §11. U6 and U9 still require implementing renderFieldPanel first. Standing gap to weigh against building more renderers: `lab_trend` and `mar` shipped with **zero content** (coverage shows 0 items each), so their content lanes are independent of — and arguably ahead of — the next renderer.

Before specifying a new kind:

- Read the current `shrimp-visual-sweep-spec-v3.md` and the "add a kind" checklist in `NCLEX-Question-Schema.md`.
- Honor the five-stage visual promotion gate in `AGENTS.md` and the non-negotiables: deterministic, locally rendered, inspectable from structured data, and **educationally necessary** — a visual whose removal leaves the answer unchanged is decorative and therefore invalid — and never an AI-generated medical image.
- Every kind ships with `selfCheck` assertions and passes registry conformance + determinism + parity tests (`npm run test-visuals`).
