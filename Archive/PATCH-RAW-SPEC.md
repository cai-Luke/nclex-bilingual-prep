# Spec: `patch-raw.ts` — Deterministic, Raw-Scoped Bank Patch Convention

**Status:** ready for Claude Code. **Owner seat:** implementation (Codex/Claude Code). **Reviewer:** Claude (planning), Luke (final).

## 1. Purpose

Apply review fixes to generated NCLEX bank JSON without editing large JSON files directly in agent context. Fixes are encoded as small TypeScript patch scripts that read a raw bank, assert preconditions, apply ID/path-targeted changes, recompute metadata, validate in-process, and write a patched review copy atomically.

This replaces in-context `Edit`/`str_replace` mutation of multi-thousand-line bank files, which is the costliest and highest-risk step of a promotion session (a bad nested match can partially apply or silently corrupt). The patch script becomes the audit artifact: the fix logic is readable, committed code rather than a diff buried in chat history.

## 2. Core invariants (non-negotiable)

These are the design's reason for existing. An implementation that relaxes any of them is wrong, not merely incomplete.

1. **Raw-scoped by default.** The runner writes only under `banks/banks-raw/`. It physically refuses to write anywhere else unless an explicit, higher-friction canonical-correction mode is invoked (§9). Canonical banks remain read-only; consolidation into canonical is `jq`'s job, not this tool's.
2. **Declarative only.** Every operation declares the value it expects to find (`before`) and the value it will write (`after`), so every change is precondition-checked and faithfully representable in the report. No arbitrary `mutate(question)` callback (§6.1).
3. **Mechanical only.** This tool is for mechanical fixes (placeholder removal, enum/route correction, topic normalization, a surgical in-string wording fix, dropping a duplicate). Clinical/semantic changes — rewording a rationale's reasoning, changing a keyed answer — are review judgment and do not belong in a patch script. The declarative-only rule enforces this by construction: if a fix can't be expressed as a scoped `before`→`after`, that is the signal it is semantic.
4. **Bilingual-parity aware.** Editing one half of an `{ en, zh }` pair without addressing the other silently breaks parity (a standing house invariant) while still passing schema validation. The runner surfaces single-language edits (§10).
5. **Inputs are never mutated.** The runner reads `--in` and writes a separate `--out`; provenance is preserved.

## 3. Non-goals

- Does not replace clinical/content review, and does not make generated content trusted by default.
- Does not let a generation model edit canonical banks.
- Does not add a runtime dependency or change app behavior.
- Does not insert net-new question content (inserting content is a generation act → generate + review, not patch; see §6.1).

## 4. File layout

```text
scripts/patch-raw.ts                              # reusable engine: primitives + runner (this spec)
scripts/patches/<YYYY-MM-DD>-<batch-slug>.ts      # one-off, committed; declares ops only, imports the engine
```

One-off patch files are **committed** — they are the audit trail for what was changed and why. The engine owns all I/O, argument parsing, guards, validation, and reporting; a one-off file contains only its `ops` array and a single call into the engine.

## 5. Command shape

The engine reads `--in`, `--out`, and the optional canonical-mode flags from `process.argv`; the one-off supplies `ops`. Minimal one-off:

```ts
// scripts/patches/2026-06-10-gpt-case-premium.ts
import { runPatch, replaceText, setValue, removeQuestion, removeArrayItem } from "../patch-raw";

runPatch([
  replaceText({
    id: "gpt_case_01",
    path: ["caseStudy", "questions", { id: "part_1" }, "stem", "en"],
    before: "administer O2",
    after: "apply supplemental oxygen",
    note: "clarified oxygen-delivery wording",
  }),
  setValue({
    id: "gpt_case_03",
    path: ["caseStudy", "questions", { id: "part_2" }, "options", { id: "B" }, "en"],
    before: "Give furosemide IM",
    after: "Give furosemide IV",
    note: "corrected route enum: IM → IV",
  }),
  removeQuestion({ id: "gpt_case_07", reason: "duplicate of canonical sepsis case case_sepsis_04" }),
]);
```

```bash
npx tsx scripts/patches/2026-06-10-gpt-case-premium.ts \
  --in  banks/banks-raw/gpt-case-premium-2026-06-10.json \
  --out banks/banks-raw/gpt-case-premium-2026-06-10.reviewed.json
```

If `--out` is omitted, default to the `--in` filename with a `.reviewed.json` suffix in the same directory. The runner never overwrites `--in`.

## 6. Patch primitives

All primitives select the **top-level question** by exact `question.id`, then resolve `path` **relative to that question object**. The `id` must exist exactly once across top-level questions (the runner asserts this).

### 6.1 The supported set (and the one deliberately excluded)

```ts
replaceText({ id, path, before, after, note }):
  // path must resolve to a string.
  // `before` must occur EXACTLY ONCE as a substring of that string (fail on 0 or >1).
  // Replace that single occurrence with `after`.
  // Use for surgical in-field wording fixes without restating a long field.

setValue({ id, path, before, after, note }):
  // path resolves to any JSON value.
  // current value must DEEP-EQUAL `before`; set to `after`.
  // Use for enums, numbers, route/status strings, or whole-field swaps.

removeQuestion({ id, reason }):
  // remove a top-level question. id must exist exactly once.

removeArrayItem({ id, path, match, before, reason }):
  // path resolves to an array (e.g. an embedded case-study question, an option, a row).
  // `match` selects ONE element: { id: string } | { index: number }.
  // selected element must DEEP-EQUAL `before`; remove it.
  // Use for nested drops (a bad option, a duplicate embedded part).
```

**No `updateQuestion({ mutate })`.** An arbitrary mutate callback asserts nothing (no `before`), cannot be checked against the document's actual state, and cannot be represented as a faithful diff in the report — it defeats invariants 2 and the report contract, and is exactly the vehicle for slipping semantic edits past review. If a needed change cannot be expressed with the four primitives above, stop and route it through review; do not add an escape hatch.

**No `insertArrayItem` / `addQuestion`.** Adding content is generation, not a mechanical fix (non-goal §3).

### 6.2 `JsonPath` resolution

```ts
type PathSegment = string | number | { id: string };
type JsonPath = PathSegment[];
```

- `string` → object key.
- `number` → array index.
- `{ id }` → the single array element whose `.id === id`; **error on 0 or >1 matches**.

Resolution is rooted at the selected top-level question object. Correct path to an embedded case-study part field (the embedded questions live under `caseStudy.questions`, **not** a `parts` key):

```ts
["caseStudy", "questions", { id: "part_2" }, "rationale", "correct", "en"]
```

A path that cannot be fully resolved is a fail-before-write error (§8).

## 7. Execution pipeline

1. Parse args; resolve `--in`/`--out` to absolute paths.
2. **Scope guard** (§9): reject the run before reading if `--out` is outside `banks/banks-raw/` and canonical mode is not authorized.
3. Read `--in`; parse via `parseBankText` (from `src/bankImport`, same entry point `promote.ts`/`validate-bank.ts` use — tolerates fences/preamble).
4. Resolve top-level questions via `getRawQuestions`; assert no duplicate top-level ids.
5. Apply ops in declared order. Each op runs its precondition checks; the **first failure aborts the whole run with nothing written** (atomic batch — never partially applied).
6. Recompute metadata (§11).
7. Run the **parity check** (§10); collect warnings (non-fatal by default).
8. **Validate in-process**: run `validateBankObject` (from `src/schema`) on the patched object as a gate. If `!ok`, abort and print `reasons`.
9. **Atomic write**: serialize the patched object with `JSON.stringify(patched, null, 2) + "\n"`; write to `<out>.tmp`; read `<out>.tmp` back and re-validate; `rename` to `<out>`.
10. Print the report (§12). Exit non-zero on any failure.

Write the **patched object itself**, not `validateBankObject`'s returned `.value` — the written file must equal the input plus exactly the declared ops plus the recomputed `meta.count`, and nothing else, so the diff is auditable and free of incidental normalization.

## 8. Fail-fast rules

The run aborts **before writing** if any hold:

- Input does not parse, or top-level `questions` is missing / not an array.
- A target top-level `id` is missing, or appears more than once.
- A `JsonPath` segment cannot be resolved, or an `{ id }` selector matches 0 or >1 elements.
- `replaceText.before` occurs 0 times or more than once in the resolved string.
- `setValue` / `removeArrayItem` current value does not deep-equal the declared `before`.
- A `removeQuestion` / `removeArrayItem` target is missing.
- `--out` resolves outside `banks/banks-raw/` without authorized canonical mode (§9).
- Post-patch `validateBankObject` returns `!ok`.

> `meta.count` is **recomputed, never a precondition** — it is set to match `questions.length` (§11), so a stale incoming `count` is corrected silently rather than failing the run.

## 9. Scope guard and the canonical-correction exception

Default: the resolved `--out` must be inside `banks/banks-raw/`; otherwise abort with a clear message naming the offending path.

A canonical bank may occasionally need a correction to an already-promoted item. This is intentionally **not** a symmetric convenience mode. To write a path under `banks/` (outside `banks-raw/`), the run must supply **both**:

- `--allow-canonical`, and
- `--reason "<non-empty text>"`.

In canonical mode the runner additionally: (a) requires `--in` and `--out` to be the same path (in-place correction only, still via atomic temp replacement) — `--out` must be supplied explicitly; the `--in`-derived default (§5) is suppressed and a missing `--out` in this mode is an error; (b) prints a prominent banner identifying the canonical file, the reason, and every applied op; and (c) prints a `LEDGER ENTRY REQUIRED` notice echoing the reason, so the correction cannot quietly skip `BANK-REVIEW-LEDGER.md`. Absent either flag, canonical writes fail closed.

## 10. Bilingual parity check

After ops apply, for every `replaceText`/`setValue` whose `path` ends in `"en"` or `"zh"`:

- Compute the sibling path (swap the final segment `en`↔`zh`).
- If the sibling exists in the bank **and** no op in this batch targeted that sibling path on the same question, emit a `PARITY` warning naming the question id and field.

Default behavior is **warn, not block** — single-language fixes are sometimes legitimate (e.g. a `zh`-only typo). A `--strict-parity` flag promotes parity warnings to fail-fast errors for batches where balanced edits are expected. Parity warnings always appear in the report so review can adjudicate.

## 11. Metadata behavior

- If `meta.count` exists, set `meta.count = questions.length` (top-level count) after all ops. Removing an *embedded* item via `removeArrayItem` does not change top-level count; removing a top-level item via `removeQuestion` does.
- Preserve `meta.schemaVersion` unless a patch op explicitly targets it. **Never auto-upgrade schema versions.**
- Preserve all question ids unless an op explicitly removes one.

## 12. Report format

```text
Patch report
Input:  banks/banks-raw/gpt-case-premium-2026-06-10.json
Output: banks/banks-raw/gpt-case-premium-2026-06-10.reviewed.json
Questions before: 10
Questions after:  9

Applied:
- FIX  gpt_case_01  caseStudy.questions[part_1].stem.en   clarified oxygen-delivery wording
- FIX  gpt_case_03  caseStudy.questions[part_2].options[B].en   corrected route enum: IM → IV
- DROP gpt_case_07  duplicate of canonical sepsis case case_sepsis_04

Parity warnings:
- gpt_case_01 caseStudy.questions[part_1].stem: en edited, zh untouched — confirm in review

Validation:
- validateBankObject (post-write): PASS (9 questions)
```

Render `{ id }` selectors compactly as `field[id]` in the path column. With no parity warnings, print `Parity warnings: none`.

## 13. Validation reuse

Reuse existing entry points; do not reimplement parsing or validation:

- `parseBankText` — `src/bankImport.ts`
- `getRawQuestions` — `src/bankImport.ts`
- `validateBankObject` — `src/schema.ts`

In-process validation (above) is the per-patch gate. The broader session checks remain a **separate, human-run** promotion step and are not the runner's responsibility:

```bash
npm run validate-bank -- banks/*.json
npm run coverage-report
npm run audit
npm run build
```

## 14. Promotion workflow (integration)

1. Save model output unchanged under `banks/banks-raw/`.
2. `npm run validate-bank -- banks/banks-raw/<file>` on the raw candidate.
3. Review content clinically and structurally (cross-model: the generator never reviews its own batch).
4. Encode accepted mechanical fixes/drops in `scripts/patches/<date>-<slug>.ts`.
5. Run the patch → produces `<file>.reviewed.json`, validated.
6. Merge/promote reviewed valid questions into the appropriate canonical bank (`jq` consolidation, then `npm run promote`).
7. `npm run validate-bank -- banks/*.json`, `npm run coverage-report`, `npm run audit`, `npm run build`.
8. **Archive** the raw/staging source and the reviewed copy to `Archive/` rather than deleting — raw is the provenance and the re-derive path. Delete only on explicit intent.
9. Update `BANK-REVIEW-LEDGER.md`. Commit the one-off patch file alongside.

## 15. DECISIONS.md addendum (add as part of this work)

So the invariants survive across sessions rather than living only in this spec, add a short entry to `DECISIONS.md`:

> **Bank patches are raw-scoped and declarative.** `scripts/patch-raw.ts` writes only under `banks/banks-raw/`. Canonical files are read-only except via the explicit `--allow-canonical --reason` in-place mode, which forces a ledger entry. Patch ops are declarative (`before`→`after`, precondition-checked); there is deliberately no arbitrary-mutate primitive, because mechanical fixes belong in patches and semantic fixes belong in review.

## 16. Acceptance criteria

Complete when:

- A one-off patch script reads a raw bank, applies id/path-targeted `replaceText`/`setValue`/`removeQuestion`/`removeArrayItem` changes, and writes a validated `.reviewed.json`, leaving `--in` untouched.
- The run fails fast — writing nothing — on a missing id, duplicate id, unresolved path, `{ id }` selector matching ≠ 1, `before` mismatch, `replaceText.before` not occurring exactly once, or post-patch validation failure.
- `meta.count` is recomputed after drops; `schemaVersion` and ids are never silently changed.
- Writing outside `banks/banks-raw/` is refused unless `--allow-canonical --reason` is supplied (in-place only), which prints the `LEDGER ENTRY REQUIRED` notice.
- Single-language edits to `{ en, zh }` pairs are surfaced as parity warnings (and become errors under `--strict-parity`).
- Validation reuses `parseBankText` + `validateBankObject`; writes are atomic (tmp → read-back validate → rename).
- The `DECISIONS.md` entry (§15) is added.
- No arbitrary-mutate or insert primitive exists.
