# Gemini Notes & Reminders

**PRE-WORK REQUIREMENT**
Before starting any work on JSON conversions, you MUST read the following files:
- `GeminiPrompt.md`
- `gemini-case-compiler-prompt.md`
- `NCLEX-Question-Schema.md` (Crucial for understanding exact JSON structures, especially for complex types like `case_study` and `matrix`)

**CRITICAL REMINDER: LARGE JSON OUTPUTS**

Whenever a prompt asks to generate a large bilingual JSON case file (like Opus to JSON conversions), **DO NOT STREAM THE JSON INTO THE CHAT.** The output length often exceeds chat limits, causing the JSON to get truncated.

**Action Plan:**
1. Directly use the `write_to_file` tool to save the compiled JSON payload to the requested destination path (e.g., `banks/banks-raw/opus-[topic]-[date].json`).
2. Run `npm run validate-bank -- <path-to-generated-json>` locally using the `run_command` tool to catch and correct any schema compliance issues (e.g. missing required fields in `case_study` or `options` formatting) before proceeding.
3. Respond in the chat summarizing the completion of the file write and confirming that the JSON parsing/count checks and `validate-bank` checks have passed.

This ensures the user gets a full, complete, uninterrupted JSON file ready for processing.
