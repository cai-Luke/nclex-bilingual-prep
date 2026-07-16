# Codex Spec — Active-Governance Markdown Encoding Gate

Date: 2026-07-16
Author: Claude (architect seat)
Status: **implementation authorized**
Implements: P1 of [`NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md`](NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md)
Closes on merge: the DECISIONS.md REVISIT thread *"Governance markdown has no encoding gate."*

## Preflight: clean — gate-only branch confirmed

The handoff branched P1 on a preflight scan. It ran, independently, twice (Luke; Codex). Result:

- no U+FFFD anywhere in repository Markdown, **including untracked files**;
- no common mojibake signatures in active, non-Archive Markdown;
- all Markdown files are valid UTF-8.

**Therefore: gate-only. No remediation inventory, no separate remediation review, no quarantine.**
This is pure forward hardening — the gate should pass on the first run against the current tree, and
if it does not, the preflight was wrong and you should stop rather than "fix" a file.

## Scope ruling

**Gate every tracked Markdown file outside `Archive/`. Do not maintain an allowlist.**

The handoff offered "an explicit allowlist or clearly documented active-file rule." I am ratifying the
derived rule, and the reason is worth stating because it repeats a failure this repo hit **today**:
the CLAUDE.md connector paragraph was an accurate hand-maintained list of facts that silently went
stale and misled a seat. Hand-maintained inventories of live state decay invisibly. An allowlist of
governance files would decay the same way — the first new governance doc would sit ungated, and
nothing would announce it. Derive scope from repository state instead.

Consequences, ratified explicitly:

| Question | Ruling |
|---|---|
| Active producer prompts (root `*-prompt.md`, batch specs)? | **In scope** — the handoff asked for an explicit decision; the derived rule includes them, and that is intended. They are active contracts read by producers. |
| `docs/AGENTS-RUNBOOK.md`, `.github/**/*.md`? | **In scope** — tracked, non-Archive. |
| `Archive/**`? | **Excluded.** Historical evidence has different remediation costs; a failure there must not block a PR. |
| Untracked files? | **Out of scope.** The gate runs on the committed tree. An untracked file is gated the moment it is committed, which is the right moment. |
| `node_modules/`, `dist/`? | Naturally excluded — untracked. Derive the list with `git ls-files`, not a filesystem walk. |

## What the gate detects

**U+FFFD (`\uFFFD`, REPLACEMENT CHARACTER) only.** Nothing else, this pass.

This matches the proven bank-JSON invariant: U+FFFD is never legitimate content — its presence always
means a decode already failed and the original byte is gone. That gives the check an unambiguous null
and a zero false-positive rate.

**Do not add broader mojibake signatures** (`Ã©`, `â€™`, Windows-1252 fragments, etc.). Codex's
preflight found none, but *absence of findings is evidence, not a false-positive policy.* Those
patterns can occur legitimately inside quoted examples — including inside a spec that documents the
gate itself. They need their own inventory and policy before they may fail a build. That is a separate
future pass; do not fold it in.

Also flag, as part of the same read: any file that is **not valid UTF-8**. A decode failure is the
upstream cause of U+FFFD and is equally unambiguous.

## Implementation shape

- One small **read-only** script. **No automatic rewriting or normalization**, ever — a mojibake
  repair is a content decision, not a mechanical one.
- Path list from `git ls-files` filtered to `*.md`, excluding the `Archive/` prefix. Sort
  deterministically so output is diffable.
- On finding, report **file, line, and column**, plus the offending line's surrounding context. A gate
  that says only "corruption found" costs the next seat a manual hunt.
- Exit non-zero on any finding. Exit zero and print the file count on clean.
- One package script (suggest `npm run audit:encoding`) and one PR-gate step.
- Keep the scanner a **pure function** over `(path, contents)` so it is testable without fixtures on
  disk.

## Regression cases

1. A seeded U+FFFD in a temporary fixture **fails**, and the reported line/column is exact.
2. A non-UTF-8 byte sequence fixture **fails**.
3. Clean ASCII and clean multi-byte UTF-8 (Simplified Chinese — this repo is bilingual, so CJK content
   in Markdown is normal and must not trip the gate) **pass**.
4. A U+FFFD seeded under `Archive/` **passes** (proves the exclusion works).
5. The gate passes against the current live tree — the preflight says it must.

## Verification floor

Docs/tooling only; no schema, bank, or app surface touched:

```bash
npm run audit:encoding
npm run audit
npx tsc -b --pretty false
git diff --check
```

`banks/**` and `src/**` must be untouched.

## Exit conditions

- [ ] Gate fails on a seeded U+FFFD and names the exact file, line, and column.
- [ ] Gate passes against every tracked non-Archive Markdown file in the current tree.
- [ ] `Archive/` is excluded and a seeded finding there does not fail the build.
- [ ] Scope is derived from `git ls-files`, not from a hand-maintained list.
- [ ] Wired to one package script and one PR-gate step.
- [ ] No file is rewritten by the gate under any condition.
- [ ] Scope owner documented in the script header: architect seat owns the scope rule; changing what
      is gated is an architect decision, not an implementation one.

## Seat routing

Mechanical and fully testable with an independent null (seeded fixture fails, clean tree passes), so
under DECISIONS.md principle 2 this **may self-certify** — it does not require the content-review
seat. Codex implements and certifies against the regression cases. Luke merges. The REVISIT entry
closes on merge, not on acceptance of this spec.
