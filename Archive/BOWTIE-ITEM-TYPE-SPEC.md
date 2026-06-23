# BOWTIE-ITEM-TYPE-SPEC

> Archived implementation spec. Bowtie is already implemented. For current authoring and validation rules, use `NCLEX-Question-Schema.md`, `src/types.ts`, `src/schema.ts`, and `src/grading.ts`.

**Status:** ready for implementation.
**Schema impact:** new item type → **schema bump to `1.4`** (new JSON shape, migration note required).
**Depends on:** the partial-credit scoring refactor (bowtie reuses its `0/1` summed path — no new scoring mechanism) and the `1.3` highlight bump (this builds on the same "add an item type" surface).

**Preflight (read before patching):** inspect the *live* `src/types.ts`, `src/schema.ts`, `src/grading.ts`, `lib/shuffle.ts`, `NCLEX-Question-Schema.md`, and `PROJECT-HISTORY.md`. Confirm the current `SCHEMA_VERSION` and that the highlight `1.3` machinery (item type, floor guard, `+/-` path) is present before adding `1.4` — do not trust any markdown snapshot, including this spec's claims about prior state. `PROJECT-HISTORY.md` in particular may still read `1.2` current with highlight/bowtie out of scope.

---

## 1. What this adds

The NGN **Bowtie** item: a synthesis/capstone format that tests the full NCJMM arc in one item — a central **condition**, two **actions to take**, and two **parameters to monitor**, each placed from its own token list. It is the standalone capstone of the exam, not a case-study sub-item.

Scoring is `0/1` across **five targets, maximum 5 points** (NCSBN: one point per correctly placed token, no deduction). This is the *same* `0/1` family the scoring refactor already built for `matrix` single-per-row and `dropdown_cloze` — bowtie needs **no new scoring mechanism**. Rationale/dyad scoring is *not* used here (that's only for explicit linked "X as evidenced by Y" items, which bowtie is not).

Two structural differences from highlight worth stating up front, because they invert highlight's choices:

- **Bowtie is standalone-only.** Highlight nests in `case_study.questions`; bowtie must not (the real exam never embeds it). Enforced by validation (§4) — so its schema floor needs no recursive case-study walk (§6).
- **Bowtie shuffles.** Highlight's segments are fixed passage order (shuffle no-op). Bowtie's token lists are unordered choice pools, so their presentation order **must** be shuffled like options, with keys preserved by id (§9).

---

## 2. Data model — three zones, per-zone token lists

NCSBN draws tokens from *respective lists* per target region. Model it as three zones, each with its own bilingual token pool (carrying distractors) and its correct key(s). Parity is structural — `en`/`zh` ride each token object, like `options`.

```jsonc
{
  "id": "bt_dka_01",
  "itemType": "bowtie",
  "category": "Physiological Adaptation",
  "topic": "diabetic ketoacidosis",          // English-only (Tier-0 invariant)
  "difficulty": "hard",
  "ngnSkill": "take_action",                  // bowtie spans the arc; tag the dominant skill
  "stem": {                                    // the scenario / lead-in
    "en": "The client is a 19-year-old admitted with the findings below. Complete the diagram.",
    "zh": "..."
  },
  "bowtie": {
    "condition": {                             // CENTER — exactly 1 target
      "prompt": { "en": "Condition the client is most likely experiencing", "zh": "..." },
      "tokens": [
        { "id": "c1", "en": "Diabetic ketoacidosis", "zh": "糖尿病酮症酸中毒" },   // keyed
        { "id": "c2", "en": "Hyperosmolar hyperglycemic state", "zh": "..." },     // distractor
        { "id": "c3", "en": "Lactic acidosis", "zh": "..." }                        // distractor
      ],
      "correct": "c1"
    },
    "actions": {                               // LEFT — exactly 2 targets
      "prompt": { "en": "Actions to take", "zh": "..." },
      "tokens": [
        { "id": "a1", "en": "Begin isotonic IV fluids", "zh": "..." },             // keyed
        { "id": "a2", "en": "Start a regular insulin infusion", "zh": "..." },     // keyed
        { "id": "a3", "en": "Administer IV sodium bicarbonate", "zh": "..." },     // distractor (nursing error)
        { "id": "a4", "en": "Give a rapid potassium bolus", "zh": "..." }          // distractor
      ],
      "correct": ["a1", "a2"]
    },
    "parameters": {                            // RIGHT — exactly 2 targets
      "prompt": { "en": "Parameters to monitor", "zh": "..." },
      "tokens": [
        { "id": "p1", "en": "Serum potassium", "zh": "..." },                      // keyed
        { "id": "p2", "en": "Anion gap / blood gas", "zh": "..." },                // keyed
        { "id": "p3", "en": "Serum lipase", "zh": "..." },                          // distractor
        { "id": "p4", "en": "INR", "zh": "..." }                                    // distractor
      ],
      "correct": ["p1", "p2"]
    }
  },
  "rationale": {
    "correct": { "en": "...", "zh": "..." },
    "byChoice": [ { "refId": "c1", "en": "...", "zh": "..." }, ... ]   // optional; refId = any token id
  },
  "testTakingStrategy": { "en": "...", "zh": "..." },
  "glossary": []
}
```

- Target counts are **fixed at 1 / 2 / 2** (= 5 targets, max 5 points). Configurable counts are out of scope (§10).
- Token `id`s are **globally unique across all three zones** (so a placed token resolves to one zone unambiguously).
- Each zone carries **at least one distractor** (`tokens.length > correct.length` per zone).

---

## 3. `src/types.ts`

```ts
export type StandaloneItemType =
  | "multiple_choice" | "select_all" | "ordered_response"
  | "fill_in_blank" | "matrix" | "dropdown_cloze"
  | "highlight"
  | "bowtie";                                       // new

export type SchemaVersion = "1.0" | "1.1" | "1.2" | "1.3" | "1.4"; // new

export type BowtieToken = { id: string; en: string; zh: string };

export type BowtieZone<C> = {
  prompt?: { en: string; zh: string };
  tokens: BowtieToken[];
  correct: C;
};

export type BowtieQuestion = CommonQuestion & {
  itemType: "bowtie";
  bowtie: {
    condition: BowtieZone<string>;       // exactly 1 correct id
    actions: BowtieZone<string[]>;       // exactly 2 correct ids
    parameters: BowtieZone<string[]>;    // exactly 2 correct ids
  };
};

export type StandaloneQuestion =
  | MultipleChoiceQuestion | SelectAllQuestion | OrderedResponseQuestion
  | FillInBlankQuestion | MatrixQuestion | DropdownClozeQuestion
  | HighlightQuestion
  | BowtieQuestion;                                 // new
```

`AnswerState` (in `grading.ts`) gains the placements:

```ts
bowtie?: {
  condition?: string[];    // placed token ids (≤ 1)
  actions?: string[];      // placed token ids (≤ 2)
  parameters?: string[];   // placed token ids (≤ 2)
};
```

Placements are **sets per zone** — targets within a zone are unordered, so placing the two correct actions in either slot is full credit.

---

## 4. Validation (`src/schema.ts` — `validateBowtie`)

Add `"bowtie"` to `standaloneItemTypes`; bump version constants (§6); wire a `validateBowtie` branch into `validateQuestion`. Rules:

- `bowtie` is an object with `condition`, `actions`, `parameters` zones.
- Each zone: `tokens` is a non-empty array; each token has a non-empty `id`, `en`, `zh`.
- **Global id uniqueness** across all three zones' tokens.
- **Within-zone display-text uniqueness:** no two tokens in the same zone may share identical `en` (or identical `zh`) text. Two same-text tokens with different ids are indistinguishable to the user and ambiguous to place — fail it.
- `condition.correct` is a single string id present in `condition.tokens`.
- `actions.correct` and `parameters.correct` are each arrays of **exactly 2** ids, no duplicates, all present in that zone's `tokens`.
- **Distractor gate:** each zone has `tokens.length > (correct count)` — at least one unkeyed token per zone. (Same content-quality intent as highlight's non-degenerate gate.)
- Bilingual parity is structural (en/zh on each token); no extra check beyond per-token non-empty.
- **Standalone-only:** `validateCaseStudy` must reject a `bowtie` sub-question — `caseStudy.questions[i]: bowtie may not be embedded in a case study (standalone item type)`. This is the one place bowtie's placement rule diverges from highlight.
- `rationale.byChoice` optional; if present, each `refId` resolves to some token id, no duplicate `refId`s (same rule shape as highlight).

Add the matching invalidation lines to the schema doc's **Validation rules** section.

---

## 5. Grading (`src/grading.ts`)

Pure `0/1` sum — reuse the per-unit counting pattern, no `plusMinus`:

```ts
// inside scoreStandaloneQuestion
if (q.itemType === "bowtie") {
  const z = q.bowtie;
  const a = ans.bowtie ?? {};
  const hit = (placed: string[] | undefined, key: string[]) => {
    const placedSet = new Set(placed ?? []);          // de-dupe placed ids
    return key.filter((id) => placedSet.has(id)).length; // count each key id at most once
  };
  const earned =
    hit(a.condition, [z.condition.correct]) +
    hit(a.actions, z.actions.correct) +
    hit(a.parameters, z.parameters.correct);
  return { earned, possible: 5 };
}
```

`possible` is `5` (1 + 2 + 2). No penalty for a wrong placement — a wrong token simply isn't in the zone's correct set, so it earns nothing (0/1 family). Retention falls out of `isFullyCorrect`: full marks = all five targets correct.

Answer-state plumbing:

```ts
// getInitialAnswer(bowtie) → { bowtie: { condition: [], actions: [], parameters: [] } }
// getCorrectAnswer(bowtie) → { bowtie: { condition: [z.condition.correct], actions: [...], parameters: [...] } }
// getAnswerCompleteness(bowtie) → a zone is "filled" when the count of UNIQUE placed ids
//   that exist in THAT zone's token pool equals its target count (condition 1, actions 2,
//   parameters 2); all three zones filled → complete, else "incomplete"
```

**Answer-state robustness (grading must not trust UI cleanliness).** The app persists and restores answer state, so grading and completeness must tolerate dirty input:

- Treat each zone placement as a set even though it serializes as an array; de-duplicate placed ids before scoring (the `hit` above does this).
- Completeness counts only unique ids that exist in that zone's token pool — a corrupted/imported placement like `["garbage", "garbage2"]` or a duplicate `["a1", "a1"]` is **not** complete.
- Invalid, duplicate, or cross-zone ids never earn credit and never make a zone complete (each zone scores against its own `correct` only, so a condition id sitting in `actions` scores 0 and isn't in the actions pool).
- The UI prevents duplicate/invalid placement (§7), but grading does not rely on that.

---

## 6. Schema-version floor (`src/schema.ts`)

- `SCHEMA_VERSION = "1.4"`; `supportedSchemaVersions` += `"1.4"`; `schemaOrder` += `"1.4"`.
- **`promote.ts` dividend:** if the `SCHEMA_RANK` single-source derivation from `supportedSchemaVersions` landed (recommended fix), `promote.ts` needs **no change** — the rank tracks `1.4` automatically. If only the one-line `"1.3": 3` patch was applied, add `"1.4": 4` there too.
- Floor guard in `validateBankObject`: a `bowtie` item in a `1.0`–`1.3` bank fails with `questions[i]: bowtie requires meta.schemaVersion 1.4`. **Top-level only** — no recursive case-study walk is needed here, because §4 already forbids embedded bowtie, so an embedded one is caught earlier as a structural error. (Contrast highlight, whose floor *is* recursive precisely because highlight is allowed to nest.)

---

## 7. UI contract (`src/App.tsx`)

The renderer draws the bowtie: a center **condition** node (1 slot), a left **actions** column (2 slots), a right **parameters** column (2 slots), with each zone's token pool shown beside it.

- **Tap/click placement is the required interaction — not drag-and-drop.** The app is mobile-first and touch DnD is error-prone. The exact presentation is the implementer's call: each zone's token pool may be always visible beside the diagram (often better on tablet/desktop) or opened from a tapped slot. The invariants are: placement by tap/click, **zone-scoped** pools (the condition pool only fills the condition slot, etc.), clear-on-tap of a placed token, full keyboard operability, and **no reliance on drag-and-drop**. (Optional desktop drag is an enhancement layered on top, never the only path.)
- **A token may be placed at most once within its zone.** Once placed, it is disabled/hidden from that zone's available pool until cleared. This keeps the UI aligned with the set-per-zone scoring model — but per §5, grading still de-dupes and does not rely on the UI enforcing this.
- Respect `languageMode` exactly like other bilingual text; each token carries `en`/`zh`.
- **Accessibility:** target slots and tokens are real `<button type="button">` (or equivalent), keyboard-operable, with `aria-pressed`/`aria-label` reflecting slot state and contents.
- Post-submit: reveal each slot's placed token vs. the key (correct / incorrect placement), show `earned / 5`, and the `byChoice` rationale. The item is marked for review unless all five are correct (scoring refactor's retention rule).

---

## 8. `NCLEX-Question-Schema.md` edits

- Add `bowtie` to the `itemType` enum row in **Common fields**.
- New per-type subsection **"9. `bowtie` — bow-tie synthesis (standalone)"**: the §2 data model, the §4 rules (including standalone-only), and the `0/1`×5 grading note.
- Bank-envelope versioning note: add "`bowtie` requires `1.4`."
- **Grading** section: add the `bowtie` line — `0/1` per target, `possible = 5`, no deduction.
- **Notes**: move `bowtie` out of "intentionally not in" — with highlight (`1.3`) and bowtie (`1.4`) landed, the full NGN item-type set is in; record that rationale/dyad scoring and any explicit linked "X as evidenced by Y" item type remain out of scope (no current type needs them).

---

## 8a. Generation & content-review quality rules (not schema)

These are promotion-gate / authoring rules, deliberately separate from §4 schema validation. Schema stays permissive; the generator and reviewer are stricter — same split the repo already uses for distractor quality and the easy-band.

- **`byChoice` coverage.** Schema keeps `rationale.byChoice` optional (resolve-if-present, §4). For *reviewed* bowtie content, `byChoice` should cover **every** token unless explicitly waived. Bowtie distractors are where the teaching lives — why this action is unsafe, why this parameter is irrelevant, why this competing condition is less likely — so a bowtie without per-token rationale is low-value even when schema-valid.
- **Nursing-scope actions.** Bowtie `actions` must be nursing actions or interventions clearly framed as prescribed/protocol-directed (monitor, notify the provider, prepare, initiate the protocol/standing order, implement safety precautions, reassess). Do **not** key unframed provider-scope actions — independently ordering diagnostics, prescribing medications, or diagnosing — as the tested action. (The `condition` token *is* a diagnosis; that's recognition/analysis within nursing judgment and is fine. The scope constraint is on `actions`, and on `parameters` staying nursing-monitorable.)
- **Distractor density.** Keep schema permissive (`tokens.length > correct count`), but generated content should run richer: at least **3 condition tokens** and at least **4 action / 4 parameter tokens** (≈2 distractors per zone), matching a real bowtie's column depth. Distractors should be common nursing errors, plausible competing conditions, or tempting-but-irrelevant monitoring parameters — not filler.

---

## 9. Touch-point checklist ("add an item type")

1. `src/types.ts` — `StandaloneItemType` += `"bowtie"`; `BowtieToken`/`BowtieZone`/`BowtieQuestion`; `StandaloneQuestion` union; `SchemaVersion` += `"1.4"`.
2. `src/grading.ts` — `AnswerState.bowtie`; `bowtie` branch in `scoreStandaloneQuestion` (§5); `getInitialAnswer`/`getCorrectAnswer`/`getAnswerCompleteness` branches.
3. `src/schema.ts` — `standaloneItemTypes` += `"bowtie"`; version constants (§6); `validateBowtie` + branch wiring; the `validateCaseStudy` standalone-only exclusion; top-level bank-floor guard.
4. `lib/shuffle.ts` — **add a bowtie case**: shuffle each zone's `tokens` presentation order independently, preserving `correct` by id (tokens are unordered choice pools, like options). This is the opposite of highlight's shuffle no-op; verify with the same `audit:references` / `audit:positions` checks that catch positional hazards.
5. `src/App.tsx` — bowtie render + tap-to-place (§7).
6. `NCLEX-Question-Schema.md` — per §8.
7. Audit / census — `bowtie` enters the item-type enumeration (uniform item-type balance target includes it); the **dormant `bowtie` audit checks** in the non-MCQ bias / adversarial specs activate — review what they key on before treating their silence as a pass.
8. Generation lane — standalone `bt_*` items (no dedicated canonical; rides the existing `gemini-`/`gpt-` lanes, per the highlight-lane decision). **Author-side synthesis section (erratum — replaces the original "no author-prompt change" mapping below):** the original mapping (condition ← primary-problem DP; actions ← take-action/generate-solutions DPs; parameters ← evaluate-outcomes DP; distractor pools ← COMMON NURSING ERRORS) is incomplete on two of three zones: COMMON NURSING ERRORS are wrong *actions*, not wrong *diagnoses* (the condition differential is absent from the skeleton), and the skeleton carries no irrelevant-parameter pool. Letting the compiler invent those pools is clinical adjudication, which principle 8 forbids. The implemented approach adds a **BOW-TIE SYNTHESIS** section to `opus-case-skeleton-prompt.md`/`.txt` as the 10th author section (see `Archive/opus-skeleton-retrofit-spec.md` §3.2 for the full analysis). The author supplies in English prose: the most-likely condition + two competing conditions, two priority actions + two wrong actions, two monitoring parameters + two irrelevant parameters. The compiler assembles, never decides. Authoring constraints: exactly 1/2/2 correct, ≥1 distractor per zone, bilingual per token, standalone (top-level) item; the BOW-TIE SYNTHESIS section is optional — omit entirely if the case does not yield a clean 1/2/2 synthesis.
9. `PROJECT-HISTORY.md` — after landing, flip the schema-current entry to `1.4`, mark `bowtie` implemented, and record the NGN item-type set as complete. Read the live file first; it is the status map and may have drifted.
10. Tests — validation fixtures (valid; invalid: wrong correct counts, `correct` id not in its zone, cross-zone id collision, a zone with no distractor, duplicate display text within a zone, **a bowtie embedded in a `case_study` rejected**, empty `zh`, `byChoice` `refId` unresolved); grading (full → `{5,5}`; partial per-zone; wrong placement earns 0 for that target; **duplicate placed id `["a1","a1"]` scores 1, not 2**; cross-zone/garbage id scores 0 and is incomplete); schema-floor (a `bowtie` item in a `1.3` bank fails); shuffle regression (after shuffle, each zone's `correct` array is byte-for-byte unchanged and only `tokens` presentation order differs; determinism for a fixed seed).

---

## 10. Out of scope

- Rationale/dyad scoring (bowtie is `0/1`; no linked-pair scoring needed).
- Configurable target counts (fixed 1/2/2; max 5 points).
- Embedded-in-case bowtie (forbidden by §4 — standalone only).
- Drag-and-drop as the *required* interaction (tap-to-place is the contract; DnD is an optional desktop enhancement).
- A single shared token bank across zones (we use per-zone pools, matching the NCSBN "respective lists" layout).
