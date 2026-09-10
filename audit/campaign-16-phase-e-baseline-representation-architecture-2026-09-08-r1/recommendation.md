# Recommendation

**EXPLICIT_TYPED_BASELINE_RECOMMENDED**

**SCHEMA_VERSION_CHANGE_REQUIRED**

Exact proposed JSON in the existing embedded-part field:

```json
"answerableAfterStageId": { "kind": "baseline" }
```

Keep existing ordinary anchors as strings and keep `stageId?: string` unchanged. The primary field remains optional. Its new TypeScript value union would be `string | { kind: "baseline" }`. The only valid object is a non-null, non-array record with exactly one own JSON key, `kind`, whose value is exactly `"baseline"`. No trimming, case folding, coercion, alternate token spelling, `null`, or extra-key acceptance. Types alone do not enforce exactness; validator and runtime must share the exact-shape predicate.

Resolution requirements, expressed as an algorithm specification, not an implementation patch:

1. Retain current no-active-part/no-stages behavior.
2. Exact typed baseline resolves intentionally to zero visible declared stages, ahead of legacy fallback.
3. Otherwise a valid ordinary primary string resolves to its inclusive stage prefix.
4. Otherwise a valid legacy string resolves to its inclusive prefix.
5. Otherwise return all declared stages. Track missing, malformed and unknown input states for diagnostics; never use a lookup miss or negative index to encode baseline.

Use one small shared boundary-resolution module under `src/`, returning explicit tagged internal results (baseline, stage index/source, fail-open with reason, and no-active/no-stages as appropriate). `getVisibleCaseStages` remains the array adapter used by UI and review prompt. Reuse the exact baseline predicate and reference classification in the audit; still inspect both fields independently so a bad legacy reference is not erased by a resolved primary. Avoid a second independently maintained sentinel/shape parser. Internal tagged states need not be serialized and must not require a generalized boundary framework.

Required support components:

| Component | Required future work |
|---|---|
| `src/types.ts` | Add the primary value union and a separately approved supported schema token; leave legacy string type unchanged. |
| Shared boundary module + `src/examLayout.ts` | Exact-shape guard, ordinary/legacy/fail-open resolution, zero-stage adapter. Preserve all existing string behavior and no-active/no-stage shortcuts. |
| `src/schema.ts` | Accept exact object or existing non-empty string; reject all other shapes even in non-strict question import; detect typed baseline feature and enforce new floor in bank validation; extend supported version order using existing comparison primitive. |
| `src/allowedKeys.ts` / schema key traversal / `scripts/scan-unknown-keys.ts` | Keep existing part key; add a one-key nested baseline object allowance/check so unknown-key scans and default validators agree. Do not globally whitelist `kind` on questions. |
| `src/bankImport.ts` | Extend minimum export feature detection; retain question validation and JSON preservation. Do not infer baseline from missing/null/unknown data. |
| `scripts/audit/audit-stage-refs.ts` | Treat exact baseline as resolved primary; no unresolved/leak/missing-primary finding for it; retain malformed/unknown and legacy findings, strict/default severity and default population behavior. |
| `scripts/raw-gate.ts` | Use updated audit result; revise “stage ID” explanatory text to permit a resolved baseline boundary. Keep all finding kinds blocking. No bypass flag. |
| Promotion/normalization/consolidation, bundled loader | Generally inherit shared schema/gate changes without special boundary interpretation. Verify object preservation and new floor rejection; respect deliberate canonical-floor bump prerequisite. |
| `src/App.tsx`, `src/reviewPrompt.ts` | Consume helper unchanged if tests confirm all active-mode paths handle `[]`; verify global data retained and Updates absent. Existing developer text currently renders the raw anchor directly; adapt it to a safe descriptive label because a plain object is not a React child. Do not leak authoring metadata into learner UI. |
| Authoring/schema docs and subsequent work order | Document exact typed state, malformed fallback, future floor, and reviewed selection requirement. No governance edit is included in this investigation. Any policy change beyond this resolved-state extension needs its own owner decision. |
| `scripts/single-row-lab-panels-survey.ts` | Widen the evidence DTO and cast to the actual primary value union plus absent null; add a fixture proving the object survives without confusion with omission. Preserve existing string outputs. |
| Tests | Listed below. Existing patch engine needs no new mutation primitive. |

Why versioning is required: an object currently fails both question shape validation and bank validation. Accepting it changes the serialized accepted-value contract; the existing feature-floor detector would otherwise export it as old unfolding metadata. This is not a TypeScript-only widening and must not be passed off as inert metadata. Add a new feature floor through the project's ordered-token process; do not reuse any currently supported version as the new baseline capability, and do not choose its literal number here. A version floor advertises required decoder capability; it does not perform semantic review or runtime fallback.

Compatibility and migration: ship accepted support before authoring any baseline objects. Existing ordinary strings, unknown labels, missing fields, stage IDs and stage order need no migration. New code must read every existing valid bank identically. Older validators reject the object; an older bundled loader may reject the entire changed bank, while old per-question import may skip a case. An old runtime that receives the object without validation falls through to legacy/all stages. Thus new-data-to-old-app compatibility is not claimed, and rollout must explicitly pair updated app and later bank publication. The app remains static/offline; no runtime server or model dependency is needed.

Only banks later receiving typed baseline require an appropriate metadata floor bump, with no guessed list of affected banks or rows. Export inference must choose the highest required feature. Consolidation already demands a deliberate canonical bump when staged version is higher. P15 later repair remains one exact existing part-field operation per approved row, plus separately authorized bank metadata changes; `before: undefined` can check omission, and the engine accepts object `after` values. Ledger and independent review are still required. Frozen 451 identities remain a scope maximum, not a mandate to fill every row. The correct per-row boundary remains semantic work. Existing census by-schema metrics will move when bank metadata changes; support alone does not move bank inputs. Use the AGENTS census drift procedure later, with documented expected movement and review, never silent regeneration.

Tests required before any bank repair:

- Unit truth table: absent, empty, whitespace, null, booleans, numbers, arrays, malformed/wrong/extra-key objects, exact object, all ordinary strings, stale IDs, and legacy fallback. Ordinary IDs named `baseline` and `@@case-baseline`, including deletion, must remain ordinary/unknown strings and never become baseline. Assert tagged resolution as well as visible arrays.
- Schema/allowlist tests: exact object accepted only at approved new bank floor; lower floors rejected; string-only old banks retain their old floor and acceptance; standalone/part nesting stays strict. Import without envelope must reject malformed objects. Export/re-import must preserve the exact shape and highest feature floor.
- Audit and raw gate: resolved baseline emits no leakage finding, wrong object rejected, bad legacy reference still reported, ordinary and unanchored defaults unchanged. Prove no-argument finding identities/counts/status/output unchanged on untouched banks; test explicit-file load failures, strict/default severity, and all raw finding kinds blocking.
- Normalization, shuffle, promotion-preview and consolidation round trips preserve typed values; old-floor candidates fail rather than downgrade. Higher staged floor still requires deliberate canonical metadata change. P15 object set/precondition test on isolated fixture only; no canonical repair needed to test engine capability. Maintenance survey and unknown-key scanner fixtures must preserve/inspect the typed object rather than silently treating it as a string.
- UI smoke: active split and controlled stacked baseline show globals/title/summary and no Updates; switching baseline ↔ ordinary prefix; global-empty fixture; show-all and unscoped stacked overview preserved. Review context includes globals and zero staged exhibits. Developer diagnostic must render without React object-child error. Existing grading/session/id behavior stays unchanged.
- On eventual implementation, apply full schema/data-contract verification from AGENTS: all-bank validation, aggregate audit, relevant schema/layout/import/review/raw/promotion regressions, TypeScript, `census:check` first with no support-only drift expected, build and `file://` compatibility. Complete a bank-impact survey before any floor tightens. Failed/inconclusive checks must be resolved before acceptance.

Strongest alternative: the reserved string is shorter on disk, but collision-safe history/import behavior expands its true cost. The object adds just one primary variant and a feature floor without reserving stage names, changing all ordinary encodings, adding another field's precedence, or rewriting timeline content. `null` has the same schema cost with weaker explicit intent. This recommendation is contract judgment awaiting independent review under P2; this producing architecture seat does not certify it independently.

Unresolved risks: the future version token and rollout policy require owner/independent architectural disposition; the implementation and new behavior have not been tested; old-app rejection must be accepted or otherwise addressed; per-row semantic adequacy of global material remains unassessed. No population prevalence claim is made. The narrowed next task is independent architecture review of this exact object contract, failure table, version/rollout tradeoff and R3 supersession recommendation. Only after that should a separately chartered support-only implementation run; bank repair remains a later commission.
