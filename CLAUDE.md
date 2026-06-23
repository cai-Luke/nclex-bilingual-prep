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

**You are the last step before promotion.** When Luke brings raw bank files to you, assume they have already been generated and that your job is the final content review + promotion. Do not ask him to paste content or re-describe what the files contain — pull them directly and work through the promotion checklist: schema validation, selfCheck, content review (clinical accuracy, bilingual parity, answer unambiguity, visual necessity for visual items), `npm run promote`, `npm run audit`, ledger update.

### When a raw bank won't parse — curly-quote recovery

A `validate-bank` JSON parse error on a `banks/banks-raw/*.json` file is almost always quote corruption left by a prior hand-edit — smart quotes (`"` `"` / U+201C–U+201D) used as JSON delimiters, or in-string Chinese speech marks downgraded to bare ASCII `"`. Do not hand-diagnose or hand-roll a state machine. Run:

```
tsx scripts/fix-bank-quotes.ts banks/banks-raw/<file>.json
```

It normalizes structural curly quotes to ASCII `"`, escapes stray in-string ASCII quotes, keeps legitimate in-string Chinese quotes, and writes `<file>.fixed.json` only if the result parses. A file that already parses is left untouched. If it reports "could NOT auto-resolve," it prints the exact line/col/codepoint to fix by hand (its one refusal case: a Chinese close-quote `"` immediately followed by an ASCII `:`, `,`, `}`, `]`). Add `--in-place` to overwrite once you trust the diff.

Work spec-first: plan and specify here, hand implementation to Codex or Claude Code, PR to GitHub. Prefer small, well-scoped changes that match existing patterns; do not rewrite app architecture during feature work.

## House style for your work

- **Deterministic core, LLM only for the irreducible semantic residual — and cap it.** Counting, distributions, and permutation checks are scripts, never model calls. See `DECISIONS.md` for why.
- **Precision over volume.** A short, fully-evidenced output beats a long speculative one — this is the explicit grading standard in the adversarial audit spec.
- **Bilingual is an invariant.** Every rule, check, and renderer that touches text covers English *and* Simplified Chinese, or it is incomplete.

## JSON authoring: curly-quote hazard

LLMs and rich-text editors frequently substitute typographic ("smart") quotes for ASCII quotes. This is a recurring failure mode when editing bank files. Rules:

- **All JSON structural delimiters must be ASCII U+0022 `"`** — for both property names and string values. Never use U+201C `"` (left double quotation) or U+201D `"` (right double quotation) as JSON delimiters.
- **Chinese speech marks inside zh content are U+201C/U+201D and are valid JSON content** — they are regular Unicode characters within a string and do not need escaping. Do not touch them.
- **ASCII `"` inside a JSON string value must be escaped as `\"`** — e.g., `"She said \"hello\"."`. Unescaped ASCII double-quotes inside a string are a parse error.
- When an Edit operation produces a JSON parse error, check for curly-quote delimiters first: `python3 -c "data=open('file.json').read(); print(hex(ord(data[N])))"` at the error position will show `0x201c` or `0x201d` if that's the problem.
- The safe repair path: replace U+201C with ASCII `"` always; replace U+201D with ASCII `"` only when the next non-whitespace character is `:`, `,`, `}`, or `]` (structural context) — otherwise it is Chinese speech-mark content and must be preserved.

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
