# CLAUDE.md

Orientation for Claude working on **Project Shrimp / NCLEX Bilingual Prep**. This file does not repeat `AGENTS.md` or `PROJECT-HISTORY.md` — read those first. It covers what is specific to working *as Claude* here: your role, your filesystem access, and where the reasoning behind the rules lives.

## Read order

1. **`AGENTS.md`** — operational rules, constraints, commands, the question-bank and visual workflows. Source of truth for *how* to work in the repo.
2. **`PROJECT-HISTORY.md`** — the living status map. Source of truth for *what currently exists*. Implementation facts there override older prose anywhere, including this file.
3. **`DECISIONS.md`** — the *why* behind the architecture and the open threads. Read before proposing changes to generation, promotion, or auditing.
4. **`NCLEX-Question-Schema.md`** — schema source of truth (mirrored by `src/types.ts`, validated by `src/schema.ts`).

## You have filesystem access — use it

You can reach the repo working tree directly through the configured filesystem MCP (`fsmcp.lukecai.com`). When you need a file — the schema, a source module, `BANK-REVIEW-LEDGER.md`, a bank JSON, an existing spec — **pull it and read it.** Do not ask Luke to paste it, and do not reconstruct its contents from memory; repo status drifts and recollection goes stale. High-value files to pull on demand:

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

Work spec-first: plan and specify here, hand implementation to Codex or Claude Code, PR to GitHub. Prefer small, well-scoped changes that match existing patterns; do not rewrite app architecture during feature work.

## House style for your work

- **Deterministic core, LLM only for the irreducible semantic residual — and cap it.** Counting, distributions, and permutation checks are scripts, never model calls. See `DECISIONS.md` for why.
- **Precision over volume.** A short, fully-evidenced output beats a long speculative one — this is the explicit grading standard in the adversarial audit spec.
- **Bilingual is an invariant.** Every rule, check, and renderer that touches text covers English *and* Simplified Chinese, or it is incomplete.

## Current task surface: the visual stimuli roadmap

The visual system is a kind registry under `src/visuals/` (the U0 refactor). Committed kinds: `rhythm_strip`, `capnography` (U1), `vitals_trend` (U2). The `lineChart` primitive is staged for the next kind (`lab_trend`, U3). Roughly nine kinds are planned; `highlight` and `bowtie` are out of scope until a schema bump. Before specifying a new kind:

- Read the current `shrimp-visual-sweep-spec-v3.md` and the "add a kind" checklist in `NCLEX-Question-Schema.md`.
- Honor the five-stage visual promotion gate in `AGENTS.md` and the non-negotiables: deterministic, locally rendered, inspectable from structured data, and **educationally necessary** — a visual whose removal leaves the answer unchanged is decorative and therefore invalid — and never an AI-generated medical image.
- Every kind ships with `selfCheck` assertions and passes registry conformance + determinism + parity tests (`npm run test-visuals`).
