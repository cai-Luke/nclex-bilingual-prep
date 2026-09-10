# Gemini Notes & Reminders

This file applies only to the Gemini JSON generation/conversion workflow. It is subordinate to `AGENTS.md` and does not grant Gemini broader project authority than the active work order.

**PRE-WORK REQUIREMENT**
Before starting any work on JSON conversions, you MUST read the following files:
- `GeminiPrompt.md`
- `NCLEX-Question-Schema.md` (Crucial for understanding exact JSON structures, especially for complex types like `case_study` and `matrix`)

**CRITICAL REMINDER: LARGE JSON OUTPUTS**

Whenever a non-review prompt asks to generate a large bilingual JSON case file, **DO NOT STREAM THE JSON INTO THE CHAT.** The output length often exceeds chat limits, causing the JSON to get truncated.

**Action Plan:**
1. Directly use the `write_to_file` tool to save the compiled JSON payload to the requested destination path (e.g., `banks/banks-raw/[topic]-[date].json`).
2. Run `npm run validate-bank -- <path-to-generated-json>` locally using the `run_command` tool to catch and correct any schema compliance issues (e.g. missing required fields in `case_study` or `options` formatting) before proceeding.
3. After the payload is written, respond with a separate execution receipt reporting only the checks actually run and their results. The JSON-only rule in `GeminiPrompt.md` applies to the generated payload, not this receipt. Do not equate schema/structural validation with content review, safety, canonical status, or promotion approval.

This ensures the user gets a full, complete, uninterrupted JSON file ready for processing while keeping generation payload and execution receipt distinct.
