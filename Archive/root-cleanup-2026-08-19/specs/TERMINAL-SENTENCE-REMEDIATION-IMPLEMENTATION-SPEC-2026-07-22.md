# Terminal-Sentence Remediation — Implementation Spec

Date: 2026-07-22
Authoring seat: Claude, remediation architect
Target seat: implementer (Codex / Claude Code)
Status: **authorized for implementation** under `TERMINAL-SENTENCE-REMEDIATION-OWNER-IMPLEMENTATION-AUTHORIZATION-2026-07-22.md`, subject to the gates below

Controlling chain:
- `TERMINAL-SENTENCE-REMEDIATION-OWNER-DISPOSITION-2026-07-22.md` (finding-level acceptance, 35 rows)
- `TERMINAL-SENTENCE-REMEDIATION-WORK-ORDER-2026-07-22.md` (schema facts, operation classes, prohibitions)
- `TERMINAL-SENTENCE-REMEDIATION-OWNER-RATIFICATION-PACKET-2026-07-22.md` (decided classes, D1–D7 forks; pre-ratification packet)
- `TERMINAL-SENTENCE-REMEDIATION-OWNER-IMPLEMENTATION-AUTHORIZATION-2026-07-22.md` (controlling owner ratification and execution authorization)

This spec is closed-world. Every path, constraint, and decision needed to execute it is restated inline. Do not appeal to chat context or model memory.

---

## 1. Scope

35 accepted findings. Queue `2235` (`gpt_format11c_home_peak_flow_technique`) is **retained, out of scope, and must not be touched, re-flagged, or re-adjudicated.**

The broader Codex census remains formally rejected (`CHECKER_REJECT_REQUIRE_NEW_CENSUS`). The corpus is uncleared. Completing this spec clears nothing beyond these 35 rows, and no artifact produced here may state otherwise.

### 1.1 Authorization boundary

Authorized: bank mutation on the 35 in-scope items, retirement where ruled, a post-remediation validator lane (D7, §4), PR authorship.

**Not authorized:** merge to main, `DECISIONS.md` writes, adding or removing findings, changing an answer key or item type beyond the rulings in §4, retiring anything not authorized in §4, or touching queue 2235.

---

## 2. Non-negotiable gates

### G-1 — Field-scoped mutation (owner-ratified hard gate)

**Never mutate a serialized record by string replacement.** Every edit targets an explicit field path — `stem.en`, `stem.zh`, `rationale.correct.zh`, etc.

This is not stylistic. On seven rows the flagged anchor occurs **twice in the record**, the second occurrence being `clozeStem`:

| Row | EN occurrences in record | ZH occurrences in record |
|---|---:|---:|
| 890 | 2 | 2 |
| 892 | 2 | 2 |
| 904 | 1 | **2** |
| 921 | 2 | 2 |
| 931 | 2 | 2 |
| 1103 | 2 | 2 |
| 1108 | 2 | 2 |

Row 904 is asymmetric: its English anchor is unique because `clozeStem.en` differs by one article ("wash **the** feet daily"), while its Chinese anchor collides because `clozeStem.zh` is identical to the stem terminal. No uniform record-level rule is safe.

A record-scoped replace on any of these rows silently destroys the functional response surface.

### G-2 — Abort on stale

Every operation declares `before` and `after` for the exact field. At apply time the live value must equal `before` (apply) or `after` (already applied, zero writes). Anything else is `BLOCKED_PATCH_PRECONDITION` — a hard stop for that patch. Do not fuzzy-match, normalize whitespace, or repair.

### G-3 — Anchors come from live disk, never from the rejected checker

The rejected checker's `quotedEvidence` is not an anchor source. One of its Chinese quotes (queue 2413) is a reconstruction that does not exist on disk.

Anchor source of truth: `audit/terminal-sentence-remediation-2026-07-22/reopen-evidence.jsonl`, which carries live verbatim `stem_en` / `stem_zh` / `clozeStem_*` / `blanks[]` per row. Even so, re-read each `before` value from the live bank when constructing the patch — a prior work unit in this same lane can change a record.

### G-4 — Bilingual parity — review is mandatory, paired mutation is not

Every learner-facing change is **reviewed** in both languages. That is not the same as requiring both languages to be **mutated**, and conflating the two will abort approved work.

`checkParity` in `scripts/patch-raw.ts` flags any op whose final path segment is `en` or `zh` when no sibling op targets the mirror path, and `--strict-parity` promotes every such warning to a hard abort with nothing written. Several approved repairs are deliberately single-locale and would abort under that flag:

| Row | Locale mutated | Sibling |
|---|---|---|
| 57 | `en` only | `stem.zh` verified clean |
| 226 | `zh` only | `stem.en` undefective |
| 656 | `zh` only | `stem.en` undefective |
| 702 | `zh` only | `stem.en` undefective |
| 799 | `zh` only | `stem.en` undefective |
| 735 | mixed — some fields `zh` only | per field |

Rules:

- **Paired EN/ZH rewrites** run with `--strict-parity`. This covers `OP-C`, `OP-D`, `OP-F1`, D1, D2's stem replacement, and most of WU-2.
- **Intentional single-locale repairs** omit `--strict-parity`, carry the disposition token `INTENTIONAL_SINGLE_LOCALE_REPAIR` in the op `note`, and **prove the untouched sibling byte-identical before and after** in the patch report.
- **Never author a no-op sibling edit to silence the warning.** Beyond falsifying the record, a no-op op has `before === after`, which makes `opStates()` unable to distinguish `"before"` from `"after"` — it returns `"before"` permanently, so the patch never registers as idempotent and re-applies on every run.
- Queue 147's `caseStudy.summary` deletion targets `["caseStudy", "summary"]`, whose final segment is neither `en` nor `zh`. It raises no parity warning and needs no sibling.

### G-5 — No hand-editing canonical JSON

Load → mutate → re-serialize, via the `scripts/patch-raw.ts` helpers. Never retype JSON structure. Chinese quotation marks are valid only inside `zh` string values; all structural delimiters stay ASCII `"`. See `docs/AGENTS-RUNBOOK.md` → *Editing raw bank JSON (quote safety)*.

---

## 3. House idiom — follow it exactly

The established pattern is `scripts/patches/2026-07-21-authorial-constraint-naturalization.ts`. Read it before writing anything. It already implements G-1 and G-2:

```ts
import { setValue, runPatch, type PatchOp } from "../patch-raw";

const ops: PatchOp[] = [
  setValue({ id, path: ["stem", "en"], before: beforeEn, after: afterEn, note: "..." }),
  setValue({ id, path: ["stem", "zh"], before: beforeZh, after: afterZh, note: "..." }),
];
```

`path` is an explicit field array — that **is** the G-1 gate. The precedent's local `opStates()` helper returns `"before" | "after" | "stale"` per op and throws `BLOCKED_PATCH_PRECONDITION` on stale — that **is** the G-2 gate.

`opStates()` lives in the **patch file**, not in the engine. `scripts/patch-raw.ts` checks preconditions per op but has no idempotency machinery of its own, so every patch file in this lane must implement its own.

Required behaviours, all present in the precedent:

- **Dry-run by default.** Copy the bank to a temp dir and patch the copy; `--write` applies to the real bank.
- **Idempotent.** All ops in `"after"` state → log and perform zero writes.
- **Flags carried through:** `--allow-canonical` and `--reason` always; `--strict-parity` **only where G-4 permits**.
- **Identity assertion:** the id must match exactly one record; `matches.length !== 1` throws.

Note the precedent also edits `testTakingStrategy` alongside `stem`. That is the model for §5's adjacent-field repairs.

Patch files are dated and live in `scripts/patches/`. Use the naming convention `2026-07-22-terminal-sentence-<unit>.ts`.

### 3.1 Mutation mechanics — specified, not left to invent

**Embedded records.** `patch-raw.ts` resolves `op.id` against **top-level questions only** — `findQuestion` matches `q.id` within the root `questions` array. An embedded case leaf is unreachable as an `op.id`. Address it with the parent case id plus an ID-selector path segment. `PathSegment` supports `{ id: string }` and `{ refId: string }`, and a selector must match exactly one array element or the op throws:

```ts
setValue({
  id: "gpt_case_clozapine_toxicity_01",
  path: ["caseStudy", "questions", { id: "gpt_case_clozapine_toxicity_01_q5" }, "stem", "en"],
  before: beforeEn,
  after: afterEn,
});
```

The same parent-plus-selector form applies to queue 2413 — `id: "cs_sepsis_shock_01"`, selector `{ id: "cs_sepsis_shock_01_part_1" }`. Confirm the concrete container key against live disk before writing the path.

Parity is unaffected by nesting: `checkParity` keys on `op.id` plus the serialized path, so mirrored `en`/`zh` ops under the same selector satisfy it normally.

**Property removal — queue 147's `caseStudy.summary`.** There is no property-removal primitive; the engine exports `replaceText`, `setValue`, `removeQuestion`, and `removeArrayItem` only. Use `setValue` with `after: undefined`:

```ts
setValue({
  id: "opus_case_lithium_toxicity_01",
  path: ["caseStudy", "summary"],
  before: { en: "…", zh: "…" },
  after: undefined,
});
```

This is sound end to end, stated explicitly so no one second-guesses it mid-implementation:

- `JSON.stringify` omits properties whose value is `undefined`, so the serialized bank simply lacks `summary`.
- `validateBankObject` guards with `if (question.caseStudy.summary !== undefined)`, so an absent summary passes both the in-process and disk round-trip validations.
- `resolvePath` throws only on missing **non-final** segments, so a re-run resolves `["caseStudy", "summary"]` and reads `undefined` rather than erroring.

**Idempotency for object-valued ops — the trap.** The precedent's `opStates()` compares with `===`. That is correct for strings and **wrong for objects**: `before` is parsed fresh from disk on every run and can never be reference-equal to a const literal, so an object-valued op would report `"stale"` on the very first run and hard-block under G-2. Any op whose `before` or `after` is an object or `undefined` must compare by JSON-stringify deep equality, matching the engine's own internal `deepEqual`. An absent property then deep-equals `after: undefined` → `"after"` → zero writes.

---

## 4. Ratified dispositions

### D1 — Queue 2413, boundary B2

`hard-cases-canonical.json`, embedded `cs_sepsis_shock_01_part_1`. Remove **only** the exam-process clause; retain the clinical SIRS gloss.

- `stem.en`: `(a foundational infection-response framework still tested on the NCLEX-RN)` → `(a foundational infection-response framework)`
- `stem.zh`: derive from the live string `（一个在NCLEX-RN中仍会考核的基础性感染反应框架）`, retaining the gloss and dropping the exam-process clause.

The checker's Chinese quote for this row is a reconstruction and must never anchor this edit.

### D2 — Queue 147, LIT-1 folded in

`claude-canonical.json`, `opus_case_lithium_toxicity_01`.

- Replace the container `stem` (`en` and `zh`) — the flagged span is the entire field in both languages, so deletion is impossible under the schema.
- **Delete** `caseStudy.summary` entirely. It is optional under `src/schema.ts:1108` and restates the precipitating mechanism the first embedded question asks the learner to identify.

Both operations land together. Repairing `stem` alone records a closure that is not true.

### D3 — `OP-C` replacement text authorized: 147, 922, 1103, 1108

Content-lane bilingual replacement prose. Retain the item if clean neutral setup prose can be produced. Exact wording does **not** require another owner round trip unless a constraint below cannot be met.

Binding constraints on every replacement:

1. `stem.en` and `stem.zh` both non-empty (`src/schema.ts:105/108/693`, unconditional for every item type).
2. Zero `{{…}}` tokens in `stem`.
3. Must not duplicate `clozeStem` in either language.
4. Must not change the key, the option set, or the dropdown bindings.
5. Must not name or telegraph the answer.
6. For 147: neutral presenting framing that does not name the precipitant. `caseStudy.title` already carries navigation, so the stem carries no navigational load.

1103 and 1108 are the heaviest: `stem` is byte-identical to `clozeStem`, so there is no existing scenario text to trim toward and genuinely new setup prose is required.

**If any constraint cannot be met on a given row, stop and return to the owner.** Do not improvise a retirement.

### D4 — G3 fork resolved as F1: 1486, 1492

`gpt-canonical.json`, both `fill_in_blank`. Rewrite the ordinary `stem.en` / `stem.zh` so each reads correctly with **no** `{{bN}}` tokens, relying on the existing `blanks[].prompt` pairs to carry the response demand.

**No schema or renderer extension.** Do not add fields, do not touch `src/types.ts`, `src/schema.ts`, or `src/allowedKeys.ts` for this work unit.

Preserve the clinical framing each stem carries: 1486 the transmission-based precaution type and the post-treatment interval; 1492 the pack-year threshold and the upper age through which screening may continue. `blanks[]` — including `acceptable` and `numeric` bindings — must be byte-identical before and after.

### D5 — Aggressive naturalization: 2176, 2178, 2185, 2190, 2219, 2231, 2238

Remove **all** self-referential item/test language from learner-facing stems — "This item asks only for…", "This question asks only for…", "This item tests…", "Apply only the criteria stated here", and equivalents in both languages.

Preserve the valid clinical caution by relocating it into natural clinical context or into `rationale`. Per `AGENTS.md`, `rationale` is the sanctioned home for scope, protocol, and role boundaries. The clinical content is sound in every one of these rows — a P/F ratio alone does not diagnose ARDS, RSBI alone does not establish SBT readiness, a QTcF value alone does not drive a medication decision. Do not delete the substance; delete the framing.

**Retirement trigger:** if an item remains uniquely scorable *only* because the disclaimer stays in the stem, retire it rather than defending the construct in prose. This retirement is **pre-authorized — do not stop and escalate for it.** Report each firing prominently in the delivery note and the closeout, naming the row and why the construct could not survive naturalization. Return to the owner only if the trigger itself is disputed, or if a different retirement basis appears.

Clinical claims here fall under the `AGENTS.md` escalation trigger: verify thresholds and formulas against the sourced reference lane, never author them from conversation.

### D6 — Per-row rulings

| Row | Ruling |
|---|---|
| **162** | `claude-canonical.json`, `claude_moc_deleg_matrix_08`. **Retire unless** a source-backed explicit policy supports a genuinely unique matrix without inventing a "common U.S." scope. A substantial policy-based rebuild counts as replacement work. Lever: this item's own `rationale.correct.zh` already carries a compliant scope statement, so the information is not lost by removing the stem sentence. |
| **735** | `gemini-canonical.json`, `trad_batchC_25`. **Retain and normalize.** The Chinese stem substitutes 《健康中国 2030》 (Healthy China 2030 — a distinct national programme) for Healthy People 2030, while the item's own `rationale.correct.zh` uses 《健康人民 2030》. Normalize the Healthy People 2030 identity consistently across **all** English and Chinese fields: `stem`, `rationale`, `options`, `glossary`, `testTakingStrategy`. Remove the translator-facing mapping commentary. |
| **1731** | `gpt-canonical.json`, embedded leaf `gpt_case_clozapine_toxicity_01_q5`. **Authorization to retire the leaf in isolation is withdrawn** (owner amendment, 2026-07-22). Route to a full case-level rewrite preserving all five parts — see §6.2. Do not force a concurrent neutropenic-precautions action into a total order. |
| **2123** | `gpt-canonical.json`, `gpt_balance6a_2026_07_16_mx_discharge_planning_handoff_09`. **Retain after full review only if every matrix row is genuinely about transition readiness.** Remove the construct disclaimer; rewrite any row that mixes in bedside tube-placement verification. **Retire if the constructs cannot be separated cleanly.** |
| **2228** | `gpt-canonical.json`, `gpt_format11b_retinal_detachment_emergency_cues`. Remove the near-miss construction commentary. **Rewrite the record segments first**, then retain only if the highlight key remains unambiguous. **Retire if ambiguity persists.** |

### D7 — Post-remediation validator lane (separate)

Authorized as its own lane **after** remediation lands. Prohibit raw `{{…}}` placeholders in ordinary `stem` fields unless a supported renderer explicitly binds them there.

Current state: `extractPlaceholders` (`src/schema.ts:148`) is called only on `clozeStem` (lines 909, 910) and never on `stem`. That gap is why this defect class reached canonical banks.

**Run the bank-impact survey before tightening the validator.** Do not bundle this into the remediation PRs — it is a schema-tier change and must be written against an already-clean corpus.

---

## 5. Adjacent-field recurrence check — 226, 656, 702, 799

Before mutating any of these four rows, inspect `rationale` (including `byChoice`), `options`, `glossary`, and `testTakingStrategy` for recurrence of the same defect.

| Row | Defect | Recurrence to search for |
|---|---|---|
| 226 | 地高辛 (digoxin) wrongly inserted into a lithium-carbonate item | any 地高辛 anywhere in the record |
| 656 | 择所有适用项 missing the leading 选 | the malformed token not preceded by 选 |
| 702 | *C. difficile* rendered 艰难克罗替尼 instead of 艰难梭菌 | 艰难克罗替尼 anywhere in the record |
| 799 | same as 656 | same as 656 |

**Any recurrence is corrected as part of the same item-level bilingual repair.** Leaving a corrected stem beside an uncorrected rationale produces an internally inconsistent item, which is worse than the original defect.

This is a scoped repair of an already-accepted finding, not a new finding. Do not expand beyond the four records named here.

---

## 6. Work units

Bank routing is fixed by the manifest: `claude-canonical.json` (57, 147, 162), `gemini-canonical.json` (226, 656, 702, 735, 799, 888, 890, 892, 902, 904, 905, 920, 921, 922, 931, 932, 933, 1103, 1108), `gpt-canonical.json` (1486, 1492, 1731, 2123, 2176, 2178, 2185, 2190, 2219, 2228, 2231, 2238), `hard-cases-canonical.json` (2413).

### WU-1 — Mechanical, no content dependency

| Row | Op | Operation |
|---|---|---|
| 57 | `OP-A` | `stem.en`: `indicates D correct latch` → `indicates a correct latch`. `stem.zh` untouched (verified clean). **Precondition:** assert `correct` is not `["D"]` at apply time — machine-checked, not asserted from this document. |
| 2413 | `OP-B` | D1/B2 as specified above, both languages. |

### WU-2 — `OP-B` bounded deletion, `dropdown_cloze` (11 rows)

888, 890, 892, 902, 904, 905, 920, 921, 931, 932, 933 — all `gemini-canonical.json`.

Delete the flagged terminal span from `stem.en` and `stem.zh`. Each leaves a non-empty remainder carrying a distinct clinical scenario absent from `clozeStem` — verified per row in the reopen evidence.

Assertions, per row, all required:

1. Post-mutation `stem.en` and `stem.zh` are non-empty.
2. Post-mutation `stem.en` and `stem.zh` contain **zero** `{{…}}` tokens. *(Independently verified as achievable on all 11 rows — every remainder is placeholder-free.)*
3. `clozeStem.en` and `clozeStem.zh` byte-identical before and after. **Load-bearing on 890, 892, 904(zh), 921, 931 per G-1.**
4. `dropdowns[]` — ids, options, and `correct` — byte-identical before and after.
5. Trailing/leading whitespace normalized cleanly; no double spaces or orphaned punctuation at the join.
6. The existing validator rule at `src/schema.ts:940–941` (a dropdown must not leak its correct answer in `clozeStem`) still passes.

### WU-3 — `OP-E` bilingual correction (4 rows)

226, 656, 702, 799 — all `gemini-canonical.json`. Includes the §5 recurrence check and any resulting adjacent-field repair.

226 is a clinical-terminology correction. Its exact live-disk repair (`地高辛锂中毒` → `锂中毒`) is expressly signed off in §4 of `TERMINAL-SENTENCE-REMEDIATION-OWNER-IMPLEMENTATION-AUTHORIZATION-2026-07-22.md`; no further sign-off is required for that bounded correction. 656, 702, 799 are bounded terminology/orthography repairs. Queue 702's paired `stem.zh` and `glossary[1].termZh` correction is likewise expressly authorized there.

For 702 note the anchor: the reopen evidence records the whole-stem sentence as the anchor, but the *operation* is the narrow term replacement 艰难克罗替尼 → 艰难梭菌. Anchor on the narrow term and assert its occurrence count in the target field.

`options`, `correct`, and all non-repaired fields byte-identical.

### WU-4 — `OP-C` replacement (4 rows), content-gated

147, 922, 1103, 1108. Blocked until content-lane text passes producer ≠ checker review. Constraints in D3 are assertions, not guidance — encode them as checks.

147 additionally deletes `caseStudy.summary` per D2.

### WU-5 — `OP-F1` stem rewrite (2 rows), content-gated

1486, 1492. `blanks[]` byte-identical; zero `{{…}}` in `stem` after.

### WU-6 — `OP-D` naturalization (7 rows), content-gated

2176, 2178, 2185, 2190, 2219, 2231, 2238. Follow `scripts/patches/2026-07-21-authorial-constraint-naturalization.ts` closely — it is the same operation class on the same bank. Where the caution moves to `rationale`, patch `rationale.correct.{en,zh}` in the same op set.

### WU-7 — Full review and conditional retirement

162, 735, 1731, 2123, 2228 per D6. 735 is retain-and-normalize. **1731 is a whole-case rewrite preserving all five parts (§6.2) — content-gated, not a retirement.** 162 resolves to retain-with-rebuild or retire on a sourcing question answerable before authoring.

**2123 and 2228 are rewrite-first.** Their retirement tests are explicitly *post*-rewrite: 2123 retires only if the constructs cannot be separated cleanly after review, and 2228 only if the highlight key remains ambiguous after the record segments have been rewritten. Neither decision can be reached before content authoring, and neither may be retired on the strength of its pre-rewrite state.

### 6.1 Retirement lane — established path

Follow the July-16 construct audit precedent:

- Manifest module exporting the id lists, modelled on `scripts/patches/2026-07-21-gpt-july16-construct-disposition-manifest.ts` (which exports `RETIRE_IDS` and `QUARANTINE_FIX_IDS`).
- Removal plus archive of the retired payloads.
- A post-removal verification artifact proving: bank SHA-256 before and after, exactly the intended ids removed, **every retained payload hash unchanged**, and **retained order unchanged**. Precedent: `audit/july16-coverage-construct-audit-2026-07-21/post-removal-verification.json`.
- Closeout note. Precedent: `.../bank-implementation-closeout.md`.

Write this lane's artifacts under `audit/terminal-sentence-remediation-2026-07-22/`.

### 6.2 Queue 1731 — whole-case rewrite, not embedded-leaf retirement

**Owner amendment, 2026-07-22: the authorization to retire `_q5` in isolation is withdrawn.**

Schema legality was assessed and found **insufficient** as a basis. `src/schema.ts:1180` requires `caseStudy.questions.length >= 2`, and `gpt_case_clozapine_toxicity_01` has five parts, so isolated removal would validate. That is not the governing consideration. Embedded leaves are scored individually for planning purposes, but the case is **authored, navigated, submitted, and graded as one top-level unit**. Deleting a single leaf would be an unprecedented case-level structural mutation, and this remediation is not the place to establish that precedent.

**Do not build an embedded-leaf retirement mechanism.** No such path exists in this repository and none is authorized here or by any document in this chain.

Required approach, in order:

1. **Preserve the five-part case.** Rewrite `_q5` in place.
2. **First assess incorporation.** Determine whether neutropenic precautions can be folded into the case state as *already initiated*, leaving only genuinely serial actions in the ordered response. This is the preferred resolution: it removes the compensating prose by repairing the underlying construct rather than by defending it.
3. **If that would create an artificial timeline**, replace `_q5` with an appropriate nonserial format after source-backed construct and key re-derivation. An item-type change is authorized for this row specifically and does not require a further owner round trip.
4. **Whole-case producer ≠ checker review** covering progression, stages, exhibits, leakage, part cadence, aggregate scoring, and narrative closure. Part-level review is insufficient — the unit of review is the case.
5. **If no coherent replacement is feasible, stop and return to the owner** for authorization to retire the **entire case**. Do not retire the leaf as a fallback.

Mechanical checks after any change to this case: `npm run test:case-completeness`, `npm run test:audit-stage-refs`, `npm run test:audit-ids`, and `npm run test:grading` for aggregate case scoring.

Any authorized **top-level** retirement (162, 2123, 2228 per D6) drops topic coverage. Run `npm run coverage-report` and record the delta in the closeout.

---

## 7. Sequencing

1. WU-1 (mechanical, unblocks nothing but is cheap and proves the harness).
2. WU-2 (mechanical, largest single group).
3. WU-3 (§5 check first, then repair; the exact 226 and 702 repairs are owner-signed in the controlling implementation authorization).
4. WU-7 rows whose retain/retire decision is answerable **before** authoring — **162 only.** Its test is whether a source-backed explicit policy exists; settle that first so a retired row never receives authored text. If it resolves to retain, the policy-based rebuild moves to step 5 as replacement work.
5. WU-4, WU-5, WU-6, and the **rewrite-first** WU-7 rows — 735, 1731, 2123, 2228 — as content lands, per bank. 2123 and 2228 retire only if the rewritten item fails independent review. 1731's whole-case rewrite is the largest single content item in this lane and should start earliest within this step.
6. Census, ledger, closeout.
7. D7 validator lane, separately, after all of the above.

Batch patches per bank where possible to limit re-serialization churn. Re-read `before` values after any prior unit touches the same bank.

---

## 8. Verification

Bank content is the highest-risk tier under `AGENTS.md`; no reduced tier exists.

Required after every mutating unit:

```bash
npm run validate-bank -- banks/*.json
npm run scan-unknown-keys
npm run audit
npx tsc -b --pretty false
```

Required once before the closeout:

```bash
npm run census && npm run census:check
npm run build
npm run validate-sweep
npm run test:schema-bank
```

Targeted:

| Unit / rows | Additional |
|---|---|
| WU-2, WU-4, and any `dropdown_cloze` | `npm run test:grading` — dropdown scoring unchanged; explicit `clozeStem` byte-identity proof |
| 147, 1731, 2413 (case records) | `npm run test:case-completeness`, `npm run test:audit-stage-refs`, `npm run test:audit-ids` |
| 2228 (highlight) | `npm run test:highlight` |
| 162, 2123 (matrix) | `npm run test:grading` |
| Any retirement | `npm run coverage-report` with recorded delta; post-removal verification artifact |
| Any `zh` edit | Copy the bank to a temp path and run `fix-bank-quotes` against **the copy**. Its default mode is not a no-op inspection: on a file that fails to parse it writes a sibling `<name>.fixed.json`, and `--in-place` overwrites. Never point it at a canonical bank. A clean bank reports "already parses" and is left untouched. |

Process: producer ≠ checker on every authored replacement text (`OP-C`, `OP-D`, `OP-F1`, and any D6 rebuild). `BANK-REVIEW-LEDGER.md` entry before the changed items are treated as reviewed study material. Census regenerated and checked.

**Content-gated work is staged.** The implementer may draft proposed replacement text and write the patch scripts, but must not apply WU-4, WU-5, WU-6, or any WU-7 rewrite until an independent checker has signed the text. Drafting is not authorization to mutate.

**Closeout.** After implementation lands, add a concise `PROJECT-HISTORY.md` milestone recording the scope actually executed — banks touched, rows repaired, any retirements that fired, and the 1731 case outcome. This lane materially changes current content status. `DECISIONS.md` remains untouched and deferred to a separate owner-led litigation.

**Git hygiene.** Create a scoped implementation branch before any mutation. Never `git add -A` — the worktree carries a large untracked audit corpus (`audit/terminal-sentence-*`, root-level planning markdown) that must not be swept into a commit. Stage only explicitly named paths.

---

## 9. Return to the owner

Stop and escalate — do not improvise — on any of:

- A D3 constraint that cannot be met on an `OP-C` row.
- An unresolved clinical or source question, including any D5 threshold or formula not settled by the sourced reference lane. The exact queue-226 terminology repair already ratified in the controlling implementation authorization is not unresolved.
- A proposed key change or item-type change not already ruled in §4.
- A retirement not already authorized in §4, or a dispute over whether the D5 trigger genuinely fired. The D5 retirement itself is pre-authorized and **reportable, not escalable** — see D5.
- No coherent in-place replacement for 1731's `_q5` proving feasible — return for authorization to retire the **entire case** (§6.2). Never retire the leaf alone as a fallback.
- Any `BLOCKED_PATCH_PRECONDITION` that does not resolve to a prior unit in this lane.
- Any §5 recurrence that extends beyond the four named records.

---

## 10. Prohibitions

- No merge to main. No `DECISIONS.md` write.
- No record-scoped string replacement on serialized JSON (G-1).
- No hand-edited canonical JSON (G-5).
- No finding added or removed.
- Queue 2235 untouched.
- No schema or renderer change in WU-5 (D4 resolved as F1).
- No embedded-leaf retirement mechanism, for queue 1731 or any other row (§6.2).
- The D7 validator lane does not ride along with remediation PRs.
- No `git add -A`, and no unscoped staging of the untracked audit corpus.
- No content-gated mutation applied before independent checker sign-off.
- No no-op sibling edits to silence a parity warning (G-4).
- Nothing here clears the broader census.
