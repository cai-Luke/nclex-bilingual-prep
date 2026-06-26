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
- Visual-stimuli unit specs and superseded drafts in `Archive/` (the `U*-*-SPEC.md` per-kind specs).

If a file isn't where you expect, list the directory rather than guessing.

## Your role here

The division of labor (per `PROJECT-HISTORY.md`):

- **Claude → planning, specs, judgment, cross-model review.** This is your seat. Author specs precise enough to hand off, adjudicate findings, and decide when consensus is reached.
- **Codex → code implementation.** Architecture ownership sits with the implementation agent, not with content models.
- **Content generation / review → multiple models, one rule: the model that generated a batch never reviews it.** Cross-model review precedes promotion.
- **The content-generating models read the repo, not the disk.** The parallel GPT generation instances have GitHub (read) access to the markdown contracts — `NCLEX-Question-Schema.md`, `AGENTS.md` — but no live filesystem like yours. So generation prompts can defer schema *shape* to those docs by section reference and stay light, carrying inline only the semantic floor the docs leave to review (no-filler distractors, per-choice clinical reasoning, closed-world stems, bilingual parity). The catch: an instance may read a **stale snapshot** in a long session, so single-shot blocks plus a clean/pushed worktree (Luke's responsibility) are what keep it current. Do not assume those instances are blind to the repo — that was a stale assumption from an earlier prompt that said "no repo access."

**You are the last step before promotion.** When Luke brings raw bank files to you, assume they have already been generated and that your job is the final content review + promotion. Do not ask him to paste content or re-describe what the files contain — pull them directly and work through the promotion checklist: schema validation, selfCheck, content review (clinical accuracy, bilingual parity, answer unambiguity, visual necessity for visual items), `npm run promote`, `npm run audit`, ledger update.

### When a raw bank won't parse — curly-quote recovery

A `validate-bank` JSON parse error on a `banks/banks-raw/*.json` file is almost always smart-quote corruption from a prior hand-edit. Don't hand-diagnose — run `tsx scripts/fix-bank-quotes.ts banks/banks-raw/<file>.json` (add `--in-place` once you trust the diff). The full quote-safety rules and recovery semantics live in `AGENTS.md` → *Editing raw bank JSON (quote safety)*; the rationale is `DECISIONS.md`'s JSON-quote-hygiene invariant.

Work spec-first: plan and specify here, hand implementation to Codex or Claude Code, PR to GitHub. Prefer small, well-scoped changes that match existing patterns; do not rewrite app architecture during feature work.

## House style for your work

- **Deterministic core, LLM only for the irreducible semantic residual — and cap it.** Counting, distributions, and permutation checks are scripts, never model calls. See `DECISIONS.md` for why.
- **Precision over volume.** A short, fully-evidenced output beats a long speculative one — this is the explicit grading standard in the adversarial audit spec.
- **Bilingual is an invariant.** Every rule, check, and renderer that touches text covers English *and* Simplified Chinese, or it is incomplete.

## JSON authoring: curly-quote hazard

Editing bank JSON risks smart-quote corruption — structural delimiters upgraded to curly quotes, or in-string Chinese speech marks downgraded to bare ASCII `"`. The full rules (ASCII `"` for all structure; Chinese quotation marks valid only inside `zh` values; escape a literal in-string `"` as `\"`) and the migrate-via-serializer discipline live in `AGENTS.md` → *Editing raw bank JSON (quote safety)*, with the why in `DECISIONS.md`'s JSON-quote-hygiene invariant. Don't retype JSON shape by hand — load → mutate → re-serialize, or use `scripts/patch-raw.ts`.

## Current task surface: visual taxonomy open; most lanes are content work

The visual system is a kind registry under `src/visuals/` (the U0 refactor). The original ten roadmap kinds have landed, and U10 adds `injection_site` as kind eleven. Reusable primitives in place: `lineChart` (charts), `table.ts`'s `renderDocTable` (documentation tables) and `renderFieldPanel` / `measureFieldPanel` (key→value label/screen panels, landed in U6). The shared numeric helpers `fmt` / `fmtNum` / `roundTo` have a **single definition** in `primitives/graphPaper.ts` — every arithmetic kind imports them and none redefines (a correctness invariant, `DECISIONS.md` principle 11). Schema `1.6` is current: it includes Highlight: Text (`1.3`), standalone `bowtie` (`1.4`), answer-revealed `rationale.visuals` explanation figures (`1.5`), and inert unfolding-case metadata (`1.6`). Highlight: Table remains out of scope.

Most active work is content: the per-kind generation lanes (disjoint ID prefixes `cap_*`, `vit_*`, `lab_*`, `mar_*`, `io_*`, `medlbl_*`, `dev_*`, `burn_*`, `fhr_*`, `inj_*`) run through the existing raw→review→promote→ledger pipeline. Check `PROJECT-HISTORY.md`, `BANK-CENSUS.md`, and `npm run coverage-report` for current per-kind counts and open targets before generating.

Before promoting raw JSON, run deterministic cleanup for mechanical drift when needed:

```
npm run normalize-raw-bank -- banks/banks-raw/<file>.json
```

Review the report, then add `--write` if the changes are the expected enum/glossary/count/empty-array cleanup. Clinical fixes still require content review.

If a new kind is ever proposed (the renderer surface is complete, so this is now the exception, not the workflow) — or when opening a content lane:

- Consult the "add a kind" checklist in `NCLEX-Question-Schema.md` and the per-kind visual specs in `Archive/` (`U*-*-SPEC.md`).
- Honor the five-stage visual promotion gate in `AGENTS.md` and the non-negotiables: deterministic, locally rendered, inspectable from structured data, and **educationally necessary** — a visual whose removal leaves the answer unchanged is decorative and therefore invalid — and never an AI-generated medical image.
- Every kind ships with `selfCheck` assertions and passes registry conformance + determinism + parity tests (`npm run test-visuals`).
