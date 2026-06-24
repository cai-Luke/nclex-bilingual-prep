# consolidate-command-id-gate-codex-spec

**Owner:** Codex · **Reviewer:** Claude → human gate · **Size:** medium (new command + new standing audit)
**Findings addressed:** #2 (manual canonical merge outside the gate) + #4 (transient intermediates written into bundled `banks/` root) + #5 (cross-bank / nested-leaf ID collision is advisory only)
**Lands:** after `integrity-audit-manifest-fix-codex-spec.md`. This spec is the deliberate design piece — do not fold it into the integrity hotfix.

---

## Background (verified)

- The canonical merge is currently manual. `AGENTS.md`: *"Until a consolidate command exists this merge is manual: read-modify-write the target canonical, fail loud on any ID collision, bump `meta.count`, then delete the raw stub."* Each step is a silent-failure opportunity (forgotten count bump, wrong canonical, reformat diff, leaked manifest).
- `scripts/promote.ts` writes promoted output to `PROMOTED_DIR = "banks"` — beside the canonicals. `src/banks.ts` bundles via `import.meta.glob("../banks/*.json")` (**non-recursive** — a `banks/_promoted/` subdir is *not* matched, confirmed), so a stray un-deleted intermediate in `banks/` root gets bundled and ships duplicate IDs into the app.
- `scripts/census.ts` already flattens top-level + embedded case-study leaf IDs into `idToFiles` and reports cross-bank duplicates — but only as `console.warn`. `scripts/audit.ts` never calls census; the gate (validate-bank, references, positions, integrity) has **no** cross-bank ID check. `src/schema.ts` enforces uniqueness only *within* a single bank object, and only top-level-vs-top-level / leaf-vs-leaf — a top-level id colliding with an embedded leaf id is unchecked even within one bank. IDs key progress/flags/sessions/history, so a duplicate is a correctness hazard.
- Prior art: `scripts/consolidate-new-questions.cjs` and `consolidate-ekg-batches.cjs` are throwaway one-offs (the former points at a stale `banks-raw` root path). This command supersedes them.

Routing source of truth already exists: `CANONICAL_PREFIXES` in `promote.ts` (currently used only for the schema-version guard).

---

## Part A — shared pipeline paths + staging move (#4)

Create `lib/pipeline-paths.ts`:

```ts
export const DRAFT_DIR = "banks/banks-raw";
export const STAGING_DIR = "banks/_promoted"; // NOT bundled (banks.ts glob is banks/*.json, non-recursive)
export const CANONICAL_DIR = "banks";
```

- `scripts/promote.ts`: **do not mechanically swap every `PROMOTED_DIR` usage.** That constant currently serves two distinct purposes and they must diverge:
  - **transient output path** — `const promotedPath = join(PROMOTED_DIR, filename)` → change to `join(STAGING_DIR, filename)`. Promote now writes `banks/_promoted/<filename>`.
  - **schema-version guard lookup** — `const comparisonPath = join(PROMOTED_DIR, canonicalName ?? filename)` → change to `join(CANONICAL_DIR, canonicalName ?? filename)`. The guard compares the draft's declared `schemaVersion` against the **routed canonical**, which lives in `banks/`, not in staging. If this is pointed at `STAGING_DIR` the canonical is never found, the existing `try/catch` swallows the miss, and the guard silently becomes a no-op — the exact deliberate check the spec wants preserved. (For an unrouted draft the fallback then resolves to `banks/<filename>`, which will usually be absent and skip silently; acceptable, since there is no canonical to compare against.)
  - No other promote logic changes.
- `scripts/audit/audit-integrity.ts`: replace its local `PROMOTED_DIR = "banks"` with the imported `STAGING_DIR`. This is the only change to that file in this spec; it is a one-line, non-conflicting follow-on to the integrity hotfix.
- Add `banks/_promoted/` to `.gitignore`.

After this, the promote → audit:integrity → consolidate flow is: promote writes staging; `audit:integrity` compares `banks-raw/<f>` vs `banks/_promoted/<f>` (staging still present); consolidate then consumes staging. Integrity verification happens *before* consolidate, unchanged in meaning.

---

## Part B — `scripts/consolidate.ts` (`npm run consolidate`)

Move `CANONICAL_PREFIXES` out of `promote.ts` into `lib/canonical-routing.ts` and export it; import it from both `promote.ts` and `consolidate.ts` (single source of truth). Add a pure router:

```ts
export const routeCanonical = (filename: string): string | null =>
  CANONICAL_PREFIXES.find(([pfx]) => filename.startsWith(pfx))?.[1] ?? null;
```

Structure it as a pure core plus a thin CLI wrapper (same pattern as the integrity refactor in spec 1): `consolidate.ts` exposes a core function that accepts explicit directory overrides — `consolidateInto({ stagingDir, canonicalDir }, filename)` (or equivalent) — and the CLI entry point calls it with the `lib/pipeline-paths.ts` constants. This keeps the tests on temp dirs without cwd tricks.

`consolidate.ts` behavior, per staging file in `stagingDir`:

1. **Route.** `routeCanonical(filename)`. **Unknown route → FAIL loud**, name the file, do not touch anything.
2. **Load + validate both sides.** Read the staging file and its target canonical (if the canonical does not exist yet, treat as empty `questions: []` with the staging file's `meta`). Validate each with `validateBankObject` (staging is post-promote, already stripped). Any validation failure → FAIL.
3. **Schema-version guard.** If staging `meta.schemaVersion` > canonical `meta.schemaVersion` (compare via the rank table) → **FAIL** with a message instructing an explicit, deliberate canonical bump. Do **not** silently bump (schema changes stay rare and deliberate per `DECISIONS.md`).
4. **Collision gate (this is the merge-time half of #5).** Build the combined ID set of `canonical ∪ staging` using the shared `collectQuestionIds` (Part C). FAIL on any duplicate across: top-level↔top-level, leaf↔leaf, **and** top-level↔leaf, within and across the two files. Report every colliding id with its file + path.
5. **Merge.** Append staging `questions` to canonical `questions`. Recompute `meta.count = questions.length`. Preserve canonical `meta` otherwise.
6. **Validate merged result** with `validateBankObject`; FAIL if not ok (defense against a merge that produced an invalid aggregate).
7. **Serialize + write** via `serializeBank` (`lib/presentation-normalization.ts` — `JSON.stringify(bank, null, 2) + "\n"`), matching the existing canonical byte format. This is the deterministic replacement for the manual "match serializeBank formatting + byte-diff" step Claude did by hand.
8. **Remove the consumed staging file** (`banks/_promoted/<filename>`). Do **not** delete the `banks-raw/<filename>` draft — raw deletion stays a deliberate post-audit/ledger step (`audit:integrity` still needs the raw present until the architect confirms the merge).

Flags: `--dry-run` (report routing, collisions, and resulting `meta.count` per canonical; write nothing) should be the default-recommended first pass, mirroring the project's dry-run-first discipline. Plain run performs the writes.

Register `"consolidate": "tsx scripts/consolidate.ts"`.

---

## Part C — standing cross-bank ID gate (#5, the durable fix)

A consolidate-only check protects merges that go through consolidate. The durable guarantee must live in the gate so a future manual edit, import script, one-off migration, or stray bundled file cannot reintroduce a duplicate.

Create `lib/id-index.ts`:

```ts
import type { BankEnvelope, Question } from "../src/types";

export type IdLocation = { id: string; file: string; path: string };

/** Flattens top-level question ids + embedded case-study leaf ids. */
export const collectQuestionIds = (bank: BankEnvelope, file: string): IdLocation[] => {
  const out: IdLocation[] = [];
  for (const q of bank.questions) {
    out.push({ id: q.id, file, path: "top-level" });
    if (q.itemType === "case_study") {
      for (const leaf of q.caseStudy.questions) {
        out.push({ id: leaf.id, file, path: `case ${q.id} › ${leaf.id}` });
      }
    }
  }
  return out;
};
```

Create `scripts/audit/audit-ids.ts` exporting `runAuditIds(): Promise<AuditResult>`:

- Read every `banks/*.json` (the bundled set; reuse `CANONICAL_DIR`).
- `collectQuestionIds` across all of them into one list; group by `id`.
- Any `id` appearing more than once → FAIL. `failures` = the colliding ids; `detail` lists each id with every `{file, path}` it appears in.
- All unique → PASS with a one-line count.
- Make it unit-testable the same way as the integrity refactor: a pure `findIdCollisions(banks: Array<{ bank: BankEnvelope; file: string }>): IdLocation[][]` that `runAuditIds` wraps with disk reads.

Wire into `scripts/audit.ts` Tier 1 (the `Promise.all([...])` block) alongside references/positions/integrity, and register `"audit:ids": "tsx scripts/audit/audit-ids.ts"`.

> Optional follow-up (not required here): have `census.ts` import `collectQuestionIds` so its `idUniqueness` block and the gate share one definition. Deferred because it regenerates `census.json` and trips `census:check`; do it as its own small change with the regen committed.

---

## Tests

**`scripts/tests/consolidate.ts`** (`test:consolidate`) — write fixtures into `node:os` tmpdir paths and pass them to the consolidate **core** via its `{ stagingDir, canonicalDir }` overrides (never mutate the real `banks/`):

- routes `gemini-*.json` → `gemini-canonical.json`, `lab-*.json` → `lab-canonical.json` (sample the table).
- **unknown route** (`zzz-foo.json`) → FAIL.
- **top-level↔top-level** collision across staging/canonical → FAIL naming the id.
- **leaf↔leaf** collision → FAIL.
- **top-level↔leaf** collision → FAIL (the gap schema misses).
- `meta.count` equals `questions.length` after merge.
- new-canonical case (target absent) succeeds and creates it.
- staging schemaVersion > canonical → FAIL (no silent bump).
- after a successful run, **no file is left in `CANONICAL_DIR` root other than the canonical** (asserts #4: the staging file was consumed from `banks/_promoted/`, and nothing transient was written to `banks/`).

**`scripts/tests/audit-ids.ts`** (`test:audit-ids`) — pure `findIdCollisions` over in-memory banks:

- two banks sharing a top-level id → reported.
- a nested leaf id duplicated across banks → reported.
- a top-level id equal to an embedded leaf id in another bank → reported.
- all-unique set → empty.

End each with the `… tests passed` convention. Register both `test:` scripts.

---

## Docs to update on landing

- **`AGENTS.md`**: remove the "Until a `consolidate` command exists this merge is manual" paragraph; document `npm run consolidate` (route → collision-gate → recount → serialize → remove staging) as the canonical merge path, and `npm run audit:ids` as a Tier-1 gate. Update the promotion command block so promoted output lives in `banks/_promoted/` and the manual byte-diff workaround is retired (consolidate's deterministic serialize replaces it).
- **`DECISIONS.md`**: record two standing invariants — (a) global question-id uniqueness across bundled banks (top-level + embedded leaf) is gate-enforced via `audit:ids`; (b) the canonical merge is deterministic and gated via `consolidate`; canonicals are never hand-merged.
- **`PROJECT-HISTORY.md`** / **`BANK-REVIEW-LEDGER.md`**: note the pipeline change when it lands.

## Acceptance

- `npm run test:consolidate` and `npm run test:audit-ids` pass.
- `npm run audit` runs `audit:ids` as part of Tier 1 and FAILs on any cross-bank or nested-leaf duplicate.
- A full promote → audit → consolidate cycle leaves `banks/` root containing only canonical files; no transient intermediate is ever bundled.
- `CANONICAL_PREFIXES` has one definition, imported by both `promote.ts` and `consolidate.ts`.
