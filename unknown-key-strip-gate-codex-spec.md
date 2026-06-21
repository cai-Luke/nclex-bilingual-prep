# Codex spec — unknown-key strip gate (scan + A1 reject)

**Author:** Claude (spec / promotion seat)
**For:** Codex (implementation)
**Date:** 2026-06-20
**Produces:** code (a scan script + a validator gate) **and** an architect-facing report, `unknown-key-gate-report.md`.

---

## Why this exists

The pipeline validates that required fields are *present* but never *projects to* the schema, so any key a generation model invents rides through `promote` → `consolidate` into the bundled canonical bank silently. A Gemini batch emitted `termDef` (an English glossary definition) on 26 entries across 4 of 6 files; it was caught by eye, not by the gate. This work converts that silent drift vector into a deterministic, build-time error.

This is the topic-vocabulary cure one level down — keys instead of topic values:

1. one source of truth for the allowed key set (co-located with the types)
2. a canonical gate that rejects anything outside it (this spec — "A1")
3. a scan over existing canonical to size the blast radius (Phase 1 below)
4. closing the set at generation (producer-side glossary-prompt fix — **out of scope here**, specced separately as the complement)

Two phases, ordered. **Phase 1 is a non-mutating scan** that reports every off-schema key currently in canonical. **Phase 2 is the strict-reject gate.** Phase 2's first run asserts the corpus is clean, so Phase 1 must run (and any findings be resolved under review) before Phase 2 can go green.

---

## Source of truth — read live before encoding anything

Derive everything from the live repo. The line numbers below come from the originating handoff and **drift** — confirm every anchor against the live file, and `dryRun: true` before any edit.

- `src/types.ts` — the bank object types. The allowed key set for **every** object (question top-level, `options`, `rationale`, glossary terms, and the visual / structured objects: matrix rows, dropdowns, exhibits, …) is whatever these types declare. Derive the whitelists from here; the types are the single source.
- `src/schema.ts` — validators. Glossary required-key check ~247–249; the `raw as ... Question` casts that retain unknown keys ~210 and ~255. The new gate lives here, alongside the existing required-key checks.
- `scripts/promote.ts` — calls `stripCompileManifests` before validation; the gate runs **after** that call.
- `lib/case-completeness.ts` — existing `stripCompileManifests`. This is the established home/pattern for "remove non-bank fields." **Leave it as-is** — `_compileManifest` is a legitimate compile-only field, not bank data.
- `banks/*-canonical.json` — the 13 canonical banks (read-only; Phase 1 scan target).

Do not reconstruct any of the above from memory or git history; pull and read each file.

---

## Single source of truth for allowed keys

Add **one** runtime constant — allowed keys per object type — co-located with the schema/types, mirroring how `src/topics.ts` is the single source for topic vocabulary. Both the scan (Phase 1) and the gate (Phase 2) import this one constant. Derive its contents from `src/types.ts` so it stays in sync with the types it guards, and keep the key lists defined once (not duplicated between scan and validator).

---

## Phase 1 — unknown-key scan (non-mutating; primary architect deliverable)

`scripts/scan-unknown-keys.ts`:

- Load all 13 `banks/*-canonical.json`.
- Walk every object against the per-type whitelist.
- Emit a **full** manifest, no truncation: `bank file → object id / json path → object type → unknown key → occurrence count`.
- Print a summary banner: total off-schema keys, the distinct key names, the affected banks.
- Exit non-zero when any are found (so it can stand alone as a CI check), but mutate nothing.

This manifest is what the architect uses to decide whether canonical needs a cleanup pass before Phase 2 can pass.

---

## Phase 2 — strict-reject gate (A1)

In `src/schema.ts`, for each object type, fail validation with a precise reason when a key is not in the whitelist:

```
glossary[${i}] has unknown key '${k}'
options[${i}] has unknown key '${k}'
```

…and so on per type. This is symmetric with the existing id/collision gates.

**Ordering invariant:** the gate runs **after** `stripCompileManifests` in the promote path. Strip known compile-only fields first; reject anything still off-schema. By that point, anything left is drift by definition.

**Gating dependency:** A1 turns "no unknown keys anywhere" into a standing assertion that must hold over current canonical. If Phase 1 found keys, they are cleaned **under human/architect review first** — this gate reports and rejects; it does not auto-strip canonical. (Silent strip-to-schema is option **A2**, the documented lighter-weight alternative if reject-on-unknown proves too brittle for iteration. Implement A1; name A2 in the report so the architect can swap deliberately.)

---

## Tests

- Fixture: an object carrying an unknown key → fails with the exact per-type reason.
- Fixture: a clean object → passes.
- Regression fixture: a glossary entry carrying `termDef` → rejected.
- Determinism and bilingual-parity suites remain green (`npm run test-visuals`, validate path).

---

## Architect-facing deliverable (Codex writes this)

`unknown-key-gate-report.md`, written for a reader with **no repo access** (the architect is in claude.ai) — every claim quoted with `file:line`:

- **Phase 1 manifest summary:** counts, the distinct off-schema keys found, per bank. State plainly whether canonical is currently clean.
- **Phase 2 patch summary:** what changed, and where the gate sits relative to `stripCompileManifests`.
- **The residual decision** surfaced for the architect: ratify A1 vs swap to A2, and whether any canonical cleanup is required before the gate goes green.

---

## Boundary

Codex implements; it does not self-certify content correctness. Claude reviews the scan output, the patch, and the report before the architect acts (producer ≠ checker). The producer-side glossary-prompt fix — closing the glossary key-set at generation — is the complement to this gate and is specced separately.
