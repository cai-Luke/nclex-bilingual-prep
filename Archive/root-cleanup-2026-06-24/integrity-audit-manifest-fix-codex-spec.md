# integrity-audit-manifest-fix-codex-spec

**Owner:** Codex · **Reviewer:** Claude → human gate · **Size:** small, self-contained
**Findings addressed:** #1 (silent zero integrity coverage on manifest-bearing case drafts) + #3 (conflated skip reasons)
**Lands:** first, before the consolidate spec. Touches `scripts/audit/audit-integrity.ts` logic only — **does not** change any directory constant (the `banks/_promoted/` move is the consolidate spec's job).

---

## Problem (verified against the tree)

`src/schema.ts` `validateQuestion` rejects any question carrying `_compileManifest` ("`_compileManifest is raw-only and must be stripped before canonical/import validation`"). The promote and validate-bank paths strip it first:

- `scripts/promote.ts`: `validateBankObject(stripCompileManifests(raw))`
- `scripts/validate-bank.ts`: `validateBankObject(isRaw ? stripCompileManifests(raw) : raw)`

`scripts/audit/audit-integrity.ts` does **not**. It reads the raw draft and validates it unstripped:

```ts
const draftResult = validateBankObject(parseBankText(draftText));
const promotedResult = validateBankObject(parseBankText(promotedText));
if (!draftResult.ok || !promotedResult.ok) {
  // Structural failures are Tier 0's domain; skip here
  skipped++;
  continue;
}
```

Every compiled case-study draft in `banks/banks-raw/` carries a `_compileManifest` (the promote-time `checkCaseCompileManifests` gate expects it). So `draftResult.ok` is `false`, the whole file is `skipped`, and the Tier-1 shuffle-integrity equality check — the only thing catching manual post-promotion edits, promoter bypasses, and shuffle nondeterminism — **never runs on case studies**, the items most exposed to the manual merge step.

It is invisible: Tier 0 (`scripts/audit/validate-bank.ts`) globs only `banks/` (promoted, already stripped), so it never re-surfaces the failure. The skip is reported as a benign `(N skipped — not yet promoted)` under a green `GATE PASSED`, because:

- the skip counter is shared between "no promoted file found" (benign, expected) and "draft failed validation" (a real coverage hole), and
- the PASS summary hard-codes the string `not yet promoted` for both.

Two refinements to keep in mind while implementing:

1. The skip is **whole-file**: a raw file mixing one compiled case with standalone items loses integrity coverage for the standalones too.
2. Stripping is required for **correctness**, not just to pass validation: `expectedQuestion(draft)` must be computed from the stripped draft so the shuffle-equality matches promote's actual output (promote strips before `shuffle`). Stripping at the read boundary handles both.

---

## Changes

### 1. Strip manifests at the read boundary

Import the existing helper and apply it to **both** sides before validation. Promoted files should already be stripped; stripping again is idempotent and kept for symmetry.

In `scripts/audit/audit-integrity.ts`:

```ts
import { stripCompileManifests } from "../../lib/case-completeness";
```

`stripCompileManifests(raw: unknown): unknown` returns a shallow-cloned bank with `_compileManifest` removed from each top-level question (signature confirmed in `lib/case-completeness.ts`). Apply it to the parsed draft and promoted text before `validateBankObject`.

### 2. Refactor the per-file comparison into a pure, testable unit

The current `runAuditIntegrity()` reads from disk with no seam for a unit test. Extract the per-file logic into a pure function that takes text in and returns a tagged outcome, so a fixture can prove a manifest-bearing case is actually compared. Keep `runAuditIntegrity()` as the thin disk wrapper.

Add to `scripts/audit/audit-integrity.ts` and export:

```ts
export type IntegrityOutcome =
  | { kind: "checked"; failures: IntegrityFailure[] }
  | { kind: "missingPromoted" }
  | { kind: "draftInvalid"; reasons: string[] }
  | { kind: "promotedInvalid"; reasons: string[] };

/** Pure: parse → strip → validate → compare. No disk I/O. */
export function integrityForFile(
  draftText: string,
  promotedText: string | null,
): IntegrityOutcome {
  if (promotedText === null) return { kind: "missingPromoted" };

  const draftResult = validateBankObject(stripCompileManifests(parseBankText(draftText)));
  if (!draftResult.ok) return { kind: "draftInvalid", reasons: draftResult.reasons };

  const promotedResult = validateBankObject(stripCompileManifests(parseBankText(promotedText)));
  if (!promotedResult.ok) return { kind: "promotedInvalid", reasons: promotedResult.reasons };

  const promotedById = new Map(promotedResult.value.questions.map((q) => [q.id, q]));
  const failures: IntegrityFailure[] = [];

  for (const draftQ of draftResult.value.questions) {
    const promotedQ = promotedById.get(draftQ.id);
    if (!promotedQ) {
      failures.push({ id: draftQ.id, reason: "present in draft but missing from promoted bank" });
      continue;
    }
    failures.push(...checkQuestion(draftQ, promotedQ));
  }
  const draftById = new Map(draftResult.value.questions.map((q) => [q.id, q]));
  for (const promotedQ of promotedResult.value.questions) {
    if (!draftById.has(promotedQ.id)) {
      failures.push({ id: promotedQ.id, reason: "present in promoted bank but missing from draft — manual addition?" });
    }
  }
  return { kind: "checked", failures };
}
```

`runAuditIntegrity()` becomes the loop that reads files, calls `integrityForFile`, and tallies. `checkQuestion`, `expectedQuestion`, `deepEqual`, `IntegrityFailure` are unchanged.

### 3. Split and label the skip counters (#3)

Replace the single `skipped` with three named tallies and surface each distinctly:

```ts
let checked = 0;
let missingPromoted = 0;            // benign: draft promoted not yet run
const draftValidationFailed: string[] = [];   // file stems — real problem
const promotedValidationFailed: string[] = []; // file stems — real problem
```

Map outcomes:

- `missingPromoted` → `missingPromoted++`, push the existing `no promoted file found — run 'npm run promote'` line.
- `draftInvalid` → push the file stem into `draftValidationFailed`; push a labeled line `${filename}: draft failed validation mid-integrity (should not happen post-strip): <reasons>`.
- `promotedInvalid` → push the file stem into `promotedValidationFailed`; push a labeled line.
- `checked` → `checked++`; fold its `failures` into the existing `failures`/`lines`.

**Status rule:** a draft- or promoted-side validation failure is **not** benign. If `draftValidationFailed.length > 0 || promotedValidationFailed.length > 0 || uniqueFailures.length > 0` → `status = "FAIL"`, and include those file stems in the returned `failures` array. `missingPromoted` alone keeps `status = "PASS"`.

> Architect decision point (default = FAIL): if you would rather a *draft*-side validation failure be visible-but-non-blocking, map it to `status = "INSUFFICIENT"` with its own labeled line instead of FAIL. Promoted-side failure should stay FAIL regardless. Recommended default is FAIL for both — silently un-verifiable integrity is the bug we are closing.

**Summary string:** stop hard-coding `not yet promoted`. PASS summary reports each tally separately, e.g.:

```
Integrity verified for {checked} file(s). {missingPromoted} not yet promoted.
```

FAIL summary lists the labeled lines (draft/promoted validation failures first, then per-item integrity failures).

---

## Test — `scripts/tests/audit-integrity.ts` (new), `test:audit-integrity` in package.json

Prove the previously-skipped path is now exercised. Use the manifest-bearing case fixture style from `scripts/tests/case-completeness.ts`. No temp files needed — call `integrityForFile` directly.

Assertions:

1. **Manifest-bearing draft is compared, not skipped.** Build a `case_study` draft with a valid `_compileManifest`. Produce its promoted text the same way promote does: `serializeBank(normalizeBankPresentations({ ...bank, questions: bank.questions.map(shuffle) }).bank)` on the **stripped** bank. `integrityForFile(draftText, promotedText)` returns `{ kind: "checked", failures: [] }`. (Before this fix it would have been `draftInvalid`.)
2. **Tamper is caught.** Hand-edit the promoted text to reorder an embedded option (or mutate a non-presentation field). `integrityForFile` returns `kind: "checked"` with a non-empty `failures` naming the embedded question id.
3. **Missing promoted is benign.** `integrityForFile(draftText, null)` → `{ kind: "missingPromoted" }`.
4. **Genuinely broken draft is loud.** A draft with a real schema violation (e.g. missing `stem.zh`) → `kind: "draftInvalid"` with reasons.

End with `console.log("audit-integrity tests passed");`. Register `"test:audit-integrity": "tsx scripts/tests/audit-integrity.ts"`.

---

## Acceptance

- `npm run test:audit-integrity` passes.
- `npm run audit` on the current tree: the integrity check now reports a non-zero `checked` count that includes case-study drafts, and any `missingPromoted` is labeled as such (not as "skipped — not yet promoted" lumped with validation failures).
- No directory constants changed. No change to `promote.ts`, `validate-bank.ts`, or `schema.ts`.

## Out of scope

The `banks/_promoted/` staging move, the consolidate command, and the cross-bank ID gate — all in `consolidate-command-id-gate-codex-spec.md`. Note the ordering: that spec later changes `audit-integrity.ts`'s `PROMOTED_DIR` to the shared staging constant; it is a one-line, non-conflicting follow-on to this patch.
