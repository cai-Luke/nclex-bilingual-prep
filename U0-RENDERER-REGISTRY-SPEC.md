# SPEC: U0 — Visual Renderer Registry (foundational refactor)

Status: proposed. Read `AGENTS.md`, `PROJECT-HISTORY.md`, `NCLEX-Question-Schema.md`, and `VISUAL-STIMULI-ROADMAP.md` first; those win on conflict.

## Nature of this work

This is a **behavior-preserving refactor** of the existing, working schema-1.2 visual system, not new functionality. `rhythm_strip` already renders, validates, and ships in 3 live items. U0 restructures the implementation so that adding the ~9 future visual kinds is cheap and collision-free, **without changing any on-disk shape, validation outcome, or rendered pixel for what exists today.**

Consequences of "behavior-preserving":
- **No `schemaVersion` bump.** Stays `1.2`. The `visual` object's fields, ranges, and placement rules are unchanged. This is an internal code refactor plus a documentation reorganization plus a bank relocation.
- No grading changes. Visuals are stimuli; grading keys off `itemType` and never reads `visual`. `src/grading.ts` is not touched.
- The 3 existing items must validate and render **byte-identically** before and after (proven by snapshot — see §7.1).

## The goal, stated precisely

Make these files **kind-agnostic** so they are edited once here and never again per future kind:
- `src/App.tsx` — renders visuals through one dispatcher component.
- `src/schema.ts` — validates visuals through the registry.
- `scripts/validate-bank.ts` — already reuses `schema.ts`; inherits registry validation for free.
- `scripts/coverage-report.ts` — counts visuals by iterating the registry.

After U0, adding a kind touches only: the new kind module, **one** append-only line in the union type, **one** append-only import line in the barrel, the kind's fixtures, and a doc subsection. Nothing else. If a reviewer can add a kind without editing any of the four files above, U0 succeeded.

## 1. Inspect before refactoring

Do not assume the current implementation's shape. First read the actual code:
- How `visual` is typed today (likely a `rhythm_strip`-specific interface in `src/types.ts`).
- Where `schema.ts` validates `visual` (the inline `kind === "rhythm_strip"` checks that implement the doc's "Validation rules → visual" list).
- How `App.tsx` renders the strip today (the inline `visual?.kind === "rhythm_strip"` branch), in both standalone questions and `case_study` exhibits / stage exhibits.
- The rhythm-strip renderer module and its existing determinism/scaling tests.
- The test runner in `package.json`.
- Which file the 3 live visual items currently sit in (the "segregated JSON").

The refactor **relocates** this logic; it does not rewrite the ECG math, the scaling, or the validation thresholds. Preserve them verbatim.

## 2. Target module layout

```
src/visuals/
  index.ts            // barrel: side-effect imports of each kind + re-exports. The app/scripts import THIS.
  registry.ts         // the contract + register/get/list functions
  types.ts            // QuestionVisual union, assembled here (append-only). Shared base + error types.
  VisualStimulus.tsx  // single React dispatcher; replaces the inline branch in App.tsx
  primitives/
    prng.ts           // seeded mulberry32, extracted from rhythm_strip
    graphPaper.ts     // mm/s + mm/mV scaling, grid drawing, fixed-decimal formatter — extracted
    // chart.ts, table.ts arrive in U2 / U4
  kinds/
    rhythmStrip.ts    // RhythmStripVisual interface + module; calls registerVisual() at module load
    // capnography.ts, vitalsTrend.ts, ... arrive in later units
```

## 3. The registry contract

```ts
// src/visuals/registry.ts
import type { Question, ItemType } from "../types";

export interface VisualError { path: string; code: string; message: string; }

export interface VisualKindModule<S extends { kind: string } = { kind: string }> {
  kind: S["kind"];
  /** Minimum bank schemaVersion that may carry this kind. Default "1.2". */
  requiredSchemaVersion?: string;
  /** Item types this kind may attach to. Default: the global visual-supporting set. */
  allowedItemTypes?: ItemType[];
  /** Structural + range validation of the spec ALONE. Maps to the schema doc's validation rules. */
  validate(spec: S): VisualError[];
  /** Optional cross-consistency check of render-vs-answer. Arithmetic gates live here. */
  selfCheck?(spec: S, question: Question): VisualError[];
  /** Pure, deterministic, XML-escaped SVG string. No DOM, no Date, no Math.random, no fetch. */
  renderSvg(spec: S): string;
  /** Colocated fixtures the conformance harness runs automatically. */
  fixtures: {
    valid: S[];
    invalid: Array<{ spec: unknown; expectCode: string }>;
  };
}

const registry = new Map<string, VisualKindModule>();

export function registerVisual(m: VisualKindModule): void {
  if (registry.has(m.kind)) throw new Error(`duplicate visual kind: ${m.kind}`);
  registry.set(m.kind, m);
}
export function getVisual(kind: string): VisualKindModule | undefined { return registry.get(kind); }
export function listVisualKinds(): string[] { return [...registry.keys()]; }
export function allVisualModules(): VisualKindModule[] { return [...registry.values()]; }

/** The global default placement set, mirroring the current schema doc. */
export const VISUAL_ITEM_TYPES: ItemType[] = ["multiple_choice", "select_all", "matrix"];
```

Design notes:
- **`validate` vs `selfCheck` are deliberately separate.** `validate(spec)` needs only the spec and is what the schema doc's "Validation rules" enumerate. `selfCheck(spec, question)` needs the answer key and is where arithmetic kinds (I&O totals, label dose, Parkland volume) assert render-vs-answer consistency. `rhythm_strip` has no `selfCheck`.
- **`fixtures` colocated with the kind** is what makes the conformance harness generic (§7.2). Every kind ships its own valid + invalid examples; the harness needs no per-kind code.
- The `requiredSchemaVersion` / `allowedItemTypes` defaults reproduce today's behavior; future kinds override only if they differ.

## 4. Type union (the single shared compile-time touch-point)

```ts
// src/visuals/types.ts
import type { RhythmStripVisual } from "./kinds/rhythmStrip";

// Append-only: add ` | CapnographyVisual` etc. as kinds land. This is the ONLY shared type edit.
export type QuestionVisual = RhythmStripVisual;

export interface VisualBase { kind: string; caption?: { en: string; zh?: string }; }
```

`src/types.ts` changes `visual?: RhythmStripVisual` (or whatever it is now) to `visual?: QuestionVisual`, imported from `src/visuals/types`. Each kind module declares and exports its own spec interface, so the interface definition is never a shared edit — only the union line is.

## 5. Barrel + self-registration (file:// safe)

```ts
// src/visuals/index.ts
import "./kinds/rhythmStrip";   // self-registers at module load
// import "./kinds/capnography"; ← append-only as kinds land
export * from "./registry";
export type { QuestionVisual } from "./types";
export { VisualStimulus } from "./VisualStimulus";
```

Each kind module ends with `registerVisual(rhythmStripModule)`. **Use static imports only — no dynamic `import()`** (it can break under `file://` and undermines determinism). The barrel's side-effect imports guarantee every kind is registered before the app or any script runs, as long as the entrypoint imports the barrel.

## 6. Integration points

### 6.1 React dispatcher (replaces the inline branch in App.tsx)

```tsx
// src/visuals/VisualStimulus.tsx
import { getVisual } from "./registry";
import type { QuestionVisual } from "./types";

export function VisualStimulus({ visual }: { visual?: QuestionVisual }) {
  if (!visual) return null;
  const mod = getVisual(visual.kind);
  if (!mod) return null;               // graceful no-op on unknown kind
  const svg = mod.renderSvg(visual);    // our own deterministic SVG, not user HTML
  return (
    <div
      className="visual-stimulus"
      role="img"
      aria-label={visual.caption?.en ?? "clinical visual"}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
```

In `App.tsx`, replace every inline `visual?.kind === "rhythm_strip"` render path with `<VisualStimulus visual={question.visual} />`, in standalone `multiple_choice`/`select_all`/`matrix` rendering **and** in `case_study` exhibit and stage-exhibit rendering. After this, `App.tsx` is kind-agnostic.

`dangerouslySetInnerHTML` is acceptable here because the SVG is produced by our own renderer from validated numeric params — but see the escaping rule in §6.3 for the one free-text field.

### 6.2 Validation (in schema.ts, reused by validate-bank)

Replace the inline rhythm-strip checks with one registry-driven function, keeping the existing skip-and-report behavior and report wording:

```ts
function validateVisual(
  visual: unknown, itemType: ItemType, schemaVersion: string, question: Question
): VisualError[] {
  if (!visual) return [];
  const v = visual as { kind?: string };
  const mod = v.kind ? getVisual(v.kind) : undefined;
  if (!mod) return [{ path: "visual.kind", code: "unknown_visual_kind", message: `unknown visual kind: ${v.kind}` }];
  const errs: VisualError[] = [];
  if (cmpSchema(schemaVersion, mod.requiredSchemaVersion ?? "1.2") < 0)
    errs.push({ path: "visual", code: "visual_schema_too_low", message: `visual requires schema ${mod.requiredSchemaVersion ?? "1.2"}` });
  const allowed = mod.allowedItemTypes ?? VISUAL_ITEM_TYPES;
  if (!allowed.includes(itemType))
    errs.push({ path: "visual", code: "visual_bad_placement", message: `visual not allowed on ${itemType}` });
  errs.push(...mod.validate(visual as any));
  if (mod.selfCheck) errs.push(...mod.selfCheck(visual as any, question));
  return errs;
}
```

`rhythmStrip.validate` must reproduce the existing rules verbatim (kind, rate 20–300 / 0–300 for vfib+asystole, duration 3–12, seed ≥0 int, calibrationPulse bool, atrialRateBpm 20–400, conductionRatio int 1–8, intervals in their ranges, caption.en required if caption present, caption.zh non-empty if present). The aggregated `VisualError[]` flattens into the current `"skipped K (reasons...)"` report string exactly as before. **Validation outcomes for all existing fixtures must be unchanged** (§7.3).

### 6.3 Determinism, purity, escaping contract

Every `renderSvg` must:
- Be a pure function of its spec: no `Math.random` (seed `prng.ts` from `spec.seed ?? 0`), no `Date`/`performance`, no DOM, no network, no module-level mutable state.
- Produce **byte-identical** output for identical input across platforms. Route all coordinate numbers through the fixed-decimal formatter in `graphPaper.ts` (e.g. round to 2 places) so float formatting can't drift.
- **XML-escape any free-text embedded in the SVG.** The only such field today is `caption` (`< > & " '`). Numeric params are not a concern. Provide an `escapeXml()` in `primitives/` and require its use for text nodes.

### 6.4 Coverage report

`coverage-report.ts` counts visual-bearing items and breaks them down by `kind` by iterating `listVisualKinds()`, so new kinds appear automatically with zero edits. Add a "Visual stimuli" section to the snapshot output (total + per-kind counts), and keep the existing counts intact.

## 7. Testing

### 7.1 Snapshot-before-refactor (the parity guarantee)
Before touching anything, render the 3 live items' SVGs (and capture their validation results) and commit them as snapshots. After the refactor, assert the new registry path reproduces them byte-for-byte and reason-for-reason. This is the proof that "behavior-preserving" held.

### 7.2 Conformance harness (generic, the reusable asset)
One test iterates `allVisualModules()` and, for each, asserts:
- every `fixtures.valid[]` spec passes `validate` with zero errors,
- every `fixtures.invalid[]` spec produces an error whose `code` matches `expectCode`,
- `renderSvg` of each valid fixture returns a string starting with `<svg` and is well-formed enough to parse,
- determinism: `renderSvg(spec) === renderSvg(spec)` and a second pass after re-seeding matches,
- `selfCheck`, if present, runs without throwing on the valid fixtures.

When U1 adds capnography, it adds fixtures and is covered automatically — no new test code.

### 7.3 Validation parity
Keep/port the existing rhythm-strip determinism + scaling tests. Add a test that the known out-of-range rhythm specs (e.g. rate 9999, duration 99, conductionRatio 0) still produce the same skip reasons as before.

### 7.4 Registry mechanics (test-only kind)
Register a throwaway `__test_only` kind **inside the test file** (never in the production barrel) to exercise: unknown-kind rejection, `selfCheck` invocation and error propagation, placement rejection, and schema-version gating — without polluting production kinds. Playwright is not available; keep all of this at the Node test level.

## 8. "Add a new visual kind" checklist (the payoff)

This goes into the schema doc and the roadmap so every future unit follows it:

1. Create `src/visuals/kinds/<kind>.ts`: declare `interface <Kind>Visual { kind: "<kind>"; ... }`, implement `validate` / `renderSvg` / optional `selfCheck`, define `fixtures`, and call `registerVisual(<kind>Module)`.
2. Reuse `primitives/` (prng, graphPaper, and later chart/table) — do not re-implement scaling or PRNG.
3. Add `| <Kind>Visual` to the union in `src/visuals/types.ts` (append-only).
4. Add `import "./kinds/<kind>";` to `src/visuals/index.ts` (append-only).
5. Add a per-kind subsection to `NCLEX-Question-Schema.md` (params, vocab, validation rules, caption rule).
6. Run conformance + `npm run validate-bank -- banks/*.json` + `npm run coverage-report` + `npm run build`.
7. (Then, separately) generate questions via the kind's content lane → review → promote → ledger.

If a step requires editing `App.tsx`, `schema.ts`, `validate-bank.ts`, or `coverage-report.ts`, something in U0 was under-generalized — fix the framework, not the kind.

## 9. Migration: the visual-canonical bank

- Create `banks/visual-canonical.json` as the dedicated home for visual-bearing items (decision confirmed). Confirm it is a top-level `banks/*.json` so `src/banks.ts` glob-bundles it.
- Move the 3 existing visual items into it, preserving their `id`s (already globally unique; relocation is label-only and app state keys by id). Remove them from the old segregated file and delete that file if now empty.
- Update `BANK-REVIEW-LEDGER.md` (note the relocation; review status carries over — content is unchanged) and `PROJECT-HISTORY.md`.

## 10. Non-goals / guardrails

- No new visual kinds in U0. No `schemaVersion` bump. No on-disk shape change. No grading changes.
- No new runtime dependencies (no validation library; keep the hand-rolled validator style). No Tailwind. No dynamic `import()`. Preserve the `file://` build path.
- Do not rewrite the ECG math or thresholds — relocate them. Do not "improve" the rendered strip; byte-parity is required.
- Leave unrelated worktree edits alone.

## 11. Acceptance criteria

- The four kind-agnostic files route through the registry; a documented dry-run of "add a kind" touches none of them.
- 3 live items: byte-identical SVG and identical validation results, proven by snapshots.
- Conformance harness, parity tests, and registry-mechanics test all pass.
- `npm run validate-bank -- banks/*.json`, `npm run coverage-report`, `npm run build` all green; coverage output shows a per-kind visual breakdown.
- `banks/visual-canonical.json` is the bundled home of the 3 items; old segregated file gone; ledger + history updated.
- Schema doc reorganized into a generic visual-framework section + per-kind subsection for `rhythm_strip`, with the §8 checklist included, and **no version bump**.

## 12. Commit sequence

1. Snapshot the 3 items' SVG + validation results (no refactor yet).
2. Extract `primitives/prng.ts` + `primitives/graphPaper.ts` + `escapeXml`; rhythm-strip uses them; tests still green.
3. Add `registry.ts` + `types.ts` union + `kinds/rhythmStrip.ts` module (validate/renderSvg/fixtures) self-registering; `index.ts` barrel.
4. Route `schema.ts` visual validation through the registry; verify parity tests + validate-bank.
5. Add `VisualStimulus.tsx`; replace inline branches in `App.tsx` (standalone + exhibits + stages).
6. Registry-aware `coverage-report.ts`.
7. Conformance harness + registry-mechanics test.
8. Create/migrate `banks/visual-canonical.json`; update ledger + history; restructure schema doc; final green run of all three commands.
