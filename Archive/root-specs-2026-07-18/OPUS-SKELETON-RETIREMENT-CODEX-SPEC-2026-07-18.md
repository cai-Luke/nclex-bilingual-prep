# Opus-Skeleton Pipeline Retirement — Codex Cleanup Spec (2026-07-18)

## Context (self-contained — no chat history required)

Project Shrimp previously ran forward `case_study` generation through a pipeline: an Opus chat session authored an English "case skeleton" from a paste-in prompt, GPT compiled/fact-checked it into schema JSON, Gemini ran a flag-only review, and Claude gated promotion. Luke has retired this pipeline as of 2026-07-18 in favor of wholesale `case_study` production directly in the current GPT model. `DECISIONS.md` §3 and §5 have already been amended by the architect seat to mark principles 8, 9, 12, 18, and 22 as LAPSED — **do not touch `DECISIONS.md`, it is architect-seat-only and is already up to date.**

This spec covers only the now-dead prompt/notes markdown files that implemented or documented that pipeline. It is a cleanup task: relocate retired prompt files into `Archive/` with a dated suffix, and make small in-place text edits to a few files that reference the pipeline in passing but remain otherwise active. No code, script, or schema changes are in scope. No PR merge — Luke holds merge authority; open a PR as usual.

## Part A — Move to Archive (retire, do not delete)

Project convention is to preserve retired material in `Archive/` rather than delete it (see `DECISIONS.md` §1: material is "preserved verbatim... rather than deleted"). Move these four files from repo root into `Archive/`, appending `-RETIRED-2026-07-18` before the extension. Do not overwrite anything — `Archive/opus-case-skeleton-prompt.md` already exists as a **different, older** file (an earlier draft, 11.4KB vs. the current 36.9KB root file); the suffix avoids collision with it. Leave that existing Archive file untouched.

1. `opus-case-skeleton-prompt.md` → `Archive/opus-case-skeleton-prompt-RETIRED-2026-07-18.md`
2. `opus-case-skeleton-prompt.txt` → `Archive/opus-case-skeleton-prompt-RETIRED-2026-07-18.txt`
3. `gpt-case-skeleton-compiler-prompt.md` → `Archive/gpt-case-skeleton-compiler-prompt-RETIRED-2026-07-18.md`
4. `gemini-case-compiler-prompt.md` → `Archive/gemini-case-compiler-prompt-RETIRED-2026-07-18.md`

Use a straight file move (preserve content byte-for-byte); this is a relocation, not an edit.

## Part B — Edit in place (small, targeted text changes)

For each file below, the **old text** is quoted verbatim from the live file as of 2026-07-18; match it exactly.

### B1. `Gemini.md` (repo root)

This file's "flag-only review" role and its pointer to `gemini-case-compiler-prompt.md` (moved in Part A) are retired. Its "large JSON output" guidance is general-purpose and stays, with the example path genericized.

Replace the entire file content with:

```
# Gemini Notes & Reminders

**PRE-WORK REQUIREMENT**
Before starting any work on JSON conversions, you MUST read the following files:
- `GeminiPrompt.md`
- `NCLEX-Question-Schema.md` (Crucial for understanding exact JSON structures, especially for complex types like `case_study` and `matrix`)

**CRITICAL REMINDER: LARGE JSON OUTPUTS**

Whenever a non-review prompt asks to generate a large bilingual JSON case file, **DO NOT STREAM THE JSON INTO THE CHAT.** The output length often exceeds chat limits, causing the JSON to get truncated.

**Action Plan:**
1. Directly use the `write_to_file` tool to save the compiled JSON payload to the requested destination path (e.g., `banks/banks-raw/[topic]-[date].json`).
2. Run `npm run validate-bank -- <path-to-generated-json>` locally using the `run_command` tool to catch and correct any schema compliance issues (e.g. missing required fields in `case_study` or `options` formatting) before proceeding.
3. Respond in the chat summarizing the completion of the file write and confirming that the JSON parsing/count checks and `validate-bank` checks have passed.

This ensures the user gets a full, complete, uninterrupted JSON file ready for processing.
```

### B2. `GeminiPrompt.md` (repo root, ~line 126)

Old text:
```
Generate highlight only when the requested mix includes it. Highlight items must use ordered bilingual segments, include at least one selectable distractor, never key every selectable segment, and use `stem` for the selection criterion. Bowtie is a live standalone item type (schema 1.4+), but it is normally authored through the GPT/Opus case-skeleton pipeline; in this raw-volume Gemini lane, generate bowtie only if the user explicitly requests it and provides current schema/skeleton context.
```

New text:
```
Generate highlight only when the requested mix includes it. Highlight items must use ordered bilingual segments, include at least one selectable distractor, never key every selectable segment, and use `stem` for the selection criterion. Bowtie is a live standalone item type (schema 1.4+) that may be generated directly as a standalone item (DECISIONS.md, 2026-07-02 addendum); in this raw-volume Gemini lane, generate bowtie only if the user explicitly requests it and provides current schema context.
```

### B3. `gpt-evergreen-generation-prompt.md` (repo root, ~line 10)

Old text:
```
- **Out of scope for this prompt:** visuals (all visual-kind canonicals are complete sets), `case_study` (forward skeleton pipeline only), pediatric burn content (blocked), anything touching schema or source.
```

New text:
```
- **Out of scope for this prompt:** visuals (all visual-kind canonicals are complete sets), `case_study` (no active generation lane as of 2026-07-18 — the prior Opus-skeleton forward pipeline was retired; a direct-GPT case_study lane has not yet been spec'd), pediatric burn content (blocked), anything touching schema or source.
```

## Part C — Explicit do-not-touch list

These reference "opus" or "skeleton" but are **out of scope** — do not edit, move, or delete them:

- `DECISIONS.md` — already amended by the architect seat (§3, §5). Architect-seat-only file.
- `PROJECT-HISTORY.md`, `BANK-CENSUS.md` — chronological/factual records of already-produced content (existing `opus_*`-id cases remain in the canonical banks permanently regardless of pipeline retirement). Editing these would falsify history.
- `AGENTS.md` — its one "Opus" mention (line ~27) is a generic model-name reference in a conflict-precedence rule, unrelated to this pipeline.
- `scripts/audit/early-bank-semantic-layer-a.ts` and any other code implementing the `/^opus\d*_/` case-ID routing matcher — this routes already-promoted cases by their existing ID prefix and has nothing to do with the retired authoring pipeline. It stays exactly as-is.
- Everything already under `Archive/` (including the older `Archive/opus-case-skeleton-prompt.md`, `Archive/opus-skeleton-retrofit-spec.md`, `Archive/case-skeleton-pipeline-spec.md`, `Archive/Opus-Harness-Bank-Prompt.md`, `Archive/OpusTopics.md`, `Archive/opus-agvd-raw.json`, `Archive/opusraw.json`) — already-archived historical record, not live pathway docs.
- `NCLEX-Question-Schema.md`, `CLAUDE.md`, `TOPIC-VOCABULARY-DECISIONS.md`, `VISUAL-STIMULI-ROADMAP.md`, `docs/AGENTS-RUNBOOK.md`, `NCLEX-Bank-Generation-Prompt.md` — surveyed, no "opus"/"skeleton" references found; no action needed.

## Part D — Verification

After Parts A and B, re-search the repo root and `docs/` (excluding `Archive/`, `node_modules/`, `PROJECT-HISTORY.md`, `BANK-CENSUS.md`) for case-insensitive `opus` and `skeleton`. Any hit not accounted for above should be reported back rather than resolved unilaterally — do not guess at disposition for anything not explicitly listed in Parts A–C.

## Part E — PR

Open a PR with these changes. Do not merge — Luke holds merge authority. Summarize in the PR description: 4 files archived (Part A), 3 files edited in place (Part B), and confirm the Part D verification sweep came back clean (or list what it found).
