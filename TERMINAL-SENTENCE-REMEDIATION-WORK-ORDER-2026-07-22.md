# Terminal-Sentence Remediation — Work Order and Reopen Commission

Date: 2026-07-22
Authoring seat: Claude, remediation architect
Status: planning artifact; **not self-authorizing for implementation**
Controlling input: `TERMINAL-SENTENCE-REMEDIATION-OWNER-DISPOSITION-2026-07-22.md`

---

## 1. What this document is

A remediation plan for the 35 findings accepted by the owner disposition dated 2026-07-22, plus a **reopen commission assigned to Claude Code** for the 31 rows this architect seat could not reach on live disk.

This document is closed-world. Every path, decision, and constraint needed to execute it is restated inline. Do not appeal to prior session history, chat context, or model memory.

### 1.1 What this document is not

- It does **not** authorize bank mutation, implementation, commit, or push. The owner disposition withholds that authorization and this work order cannot grant it.
- It does **not** accept the rejected Codex census.
- It does **not** add or remove findings. Two adjacent defects surfaced during reopening are recorded in §9 as owner-litigation candidates only.
- It does **not** claim independent checker status over the Sonnet run.

### 1.2 Census status (restated, binding)

The Codex recommission under `audit/terminal-sentence-independent-checker-2026-07-22/gpt-5-6-sol-recommission/` remains formally rejected:

```text
CHECKER_REJECT_REQUIRE_NEW_CENSUS
```

The broader corpus is **uncleared**. The 304 tail PASS rows and the 260-row deterministic sample establish nothing for remediation purposes. Nothing in this work order may be read as corpus-wide clearance.

### 1.3 Queue 2235 — retained, out of scope

Queue `2235`, `gpt_format11c_home_peak_flow_technique`, bank `banks/gpt-canonical.json`, is **retained**. Owner disposition: `PASS — LEGITIMATE_RESPONSE_DEMAND`. It is not in the 35-row manifest, carries no operation, and must not be mutated, re-flagged, or re-adjudicated by any downstream seat. The repeated Codex/Flash flag on this row is recorded as a model tendency to overclassify restrictive learner guidance as construct defense.

---

## 2. Repository state at planning time

- Repository: `/Users/holemini/Desktop/Project Shrimp`
- Branch: `main`, tracking `origin/main`
- Working tree: clean apart from untracked audit artifacts and untracked `TERMINAL-SENTENCE-*` planning markdown at repo root
- Bank files: unmodified

Banks in scope:

| Bank | Size | Rows in manifest |
|---|---:|---:|
| `banks/claude-canonical.json` | 1,178,703 B | 3 |
| `banks/gemini-canonical.json` | 3,770,431 B | 19 |
| `banks/gpt-canonical.json` | 6,483,293 B | 12 |
| `banks/hard-cases-canonical.json` | 2,087,261 B | 1 |

---

## 3. Verified environment facts

These were read directly from live source this session. They are load-bearing and they **reclassify several rows away from the operation class implied by the rejected checker artifact.**

### 3.1 `stem` can never be emptied — all item types, both languages

`src/schema.ts`:

```ts
// line 105
const isTextPair = (value: unknown): value is TextPair =>
  isRecord(value) && nonEmptyString(value.en) && nonEmptyString(value.zh);

// line 108
const addTextPairError = (value: unknown, path: string, reasons: string[]) => {
  if (!isTextPair(value)) {
    reasons.push(`${path}.en and ${path}.zh are required`);
  }
};

// line 693 — unconditional, every question, every item type
addTextPairError(raw.stem, "stem", reasons);
```

`src/allowedKeys.ts` places `stem` in `questionCommon`, and `src/types.ts` places `stem: TextPair` on `CommonQuestion`, from which every item type including `dropdown_cloze`, `fill_in_blank`, and `case_study` derives.

**Consequence:** any row whose flagged terminal span constitutes the *entire* `stem.en` or `stem.zh` value cannot be remediated by deletion. Deletion produces a schema violation. Such rows require field **replacement** with owner-ratified text. This directly contradicts the `DELETION_CANDIDATE` / `removalRisk: LOW` classification carried by the rejected checker artifact on at least one row (queue 147, verified below), and is expected to apply to several rows in the `dropdown_cloze` group.

### 3.2 Placeholder validation covers `clozeStem` only, never `stem`

`src/schema.ts` — the only three call sites of `extractPlaceholders`:

```text
line 148  const extractPlaceholders = (value: string) => { ... }
line 909  const enPlaceholders = extractPlaceholders(question.clozeStem.en);
line 910  const zhPlaceholders = extractPlaceholders(question.clozeStem.zh);
```

**Consequence:** raw `{{...}}` tokens in `stem` are entirely unvalidated. This is the structural reason the raw-template leak class survived promotion into canonical banks. It is a tripwire gap, not a content accident. A guard for it is a follow-up candidate (§9, LIT-2) and is **not** authorized here.

### 3.3 `fill_in_blank` has no inline-binding mechanism

`src/types.ts`:

```ts
export type FillInBlankQuestion = CommonQuestion & {
  itemType: "fill_in_blank";
  blanks: Array<{
    id: string;
    prompt: TextPair;
    acceptable?: string[];
    numeric?: { value: number; tolerance: number; unit?: string };
  }>;
};
```

`src/allowedKeys.ts`: `blank: ["id", "prompt", "acceptable", "numeric"]`.

There is no field binding a stem placeholder to a blank. Blanks render as separately labelled inputs driven by `blanks[].prompt`.

**Consequence:** queues 1486 and 1492 cannot be remediated by "binding the placeholders." The fork is (a) rewrite the stem so it reads correctly with no `{{bN}}` tokens while `blanks[].prompt` carries the response demand, or (b) extend schema + renderer to support inline blank rendering. This is an owner decision, not an implementation detail. No bank mutation until it lands.

### 3.4 Both `stem` and the item-type body render

`src/App.tsx` renders `question.stem` generically (`pair={question.stem}` at line 3265, `SpeakButton text={question.stem.en}` at line 3272) and renders `question.clozeStem` in the `dropdown_cloze` body (lines 4049, 4066, 4081). Combined with §3.1, a `dropdown_cloze` item necessarily presents both surfaces to the learner.

**Confidence note:** the two render sites were located by search, not by reading the enclosing component bodies end to end (`src/App.tsx` is 199,359 B and the connector offers no line-ranged read). Claude Code must confirm the generic stem block is not item-type gated before any row in the `dropdown_cloze` group is treated as a duplication defect. See §8, task R4.

### 3.5 `caseStudy.summary` is optional; `caseStudy.title` is required

`src/schema.ts` lines 1107–1108:

```ts
addTextPairError(question.caseStudy.title, "caseStudy.title", reasons);
if (question.caseStudy.summary !== undefined) addTextPairError(question.caseStudy.summary, "caseStudy.summary", reasons);
```

**Consequence:** unlike `stem`, `caseStudy.summary` may be deleted outright without schema violation. Relevant to LIT-1 (§9).

---

## 4. Anchor discipline — binding on every downstream seat

**The quoted evidence in the rejected checker artifact must never be used as a mutation anchor.**

This is not a precaution. It is a measured defect. Of the four rows this seat could reopen on live disk, one carries a non-verbatim Chinese quote:

| Row | Checker `quotedEvidence` (`stem.zh`) | Live disk |
|---|---|---|
| 2413 | `NCLEX-RN 考试中仍会考查的基础感染反应框架` | `一个在NCLEX-RN中仍会考核的基础性感染反应框架` |

The two differ in four places (`考试中` absent live, `考查`→`考核`, `基础`→`基础性`, leading `一个在` present live). The English quote on the same row is verbatim. A 1-in-4 zh provenance defect rate across the only rows that could be independently checked is sufficient to treat **all** checker-supplied Chinese strings as reconstructions until re-derived.

### 4.1 Binding rules

1. Every `oldText` anchor must be read from live disk immediately before the operation that consumes it.
2. Any anchor mismatch — text absent, text present more than once, or text differing by a single character — is a **hard abort** for that row. Do not fuzzy-match, do not normalize whitespace, do not repair.
3. Line numbers cited anywhere in this document are advisory only and were true at read time. They drift on any insertion. Match on text, never on line number.
4. Canonical bank content is never hand-edited. All mutations, when eventually authorized, go through a deterministic load → mutate → re-serialize path (`scripts/patch-raw.ts` pattern). Retyping JSON structure is prohibited; see the curly-quote hygiene rules in `docs/AGENTS-RUNBOOK.md` → *Editing raw bank JSON (quote safety)*.
5. Every edit touching learner-facing text is bilingual or it is incomplete. An `en` edit without its `zh` counterpart, or the reverse, is a defect.

---

## 5. Operation classes

| Class | Meaning | Requires owner content ratification |
|---|---|---|
| `OP-A` | Bounded text repair. Replace an exact substring; field stays non-empty; meaning of the response demand unchanged. | No — mechanical |
| `OP-B` | Bounded span deletion. Delete a terminal sentence or parenthetical; **requires proof the field retains non-empty content in both `en` and `zh`**. | No — mechanical, gated on the non-empty proof |
| `OP-C` | Field replacement. The flagged span is the entire field value; deletion is impossible under §3.1. New text required. | **Yes** |
| `OP-D` | Naturalization rewrite. The content is clinically valid but is framed as author-facing construct defense. Must be re-expressed as clinical context, or moved to `rationale`, per the `AGENTS.md` invariant that authoring and checker constraints must not appear as learner-facing disclaimers. | **Yes** |
| `OP-E` | Bilingual correction. `zh`-only defect; `en` preserved untouched. | Bilingual review |
| `OP-F` | Renderer or schema investigation. No bank mutation until the placement decision lands. | **Yes** |
| `OP-G` | Full item review. Answer validity, key dependence, or option-set completeness at stake. No mechanical operation is defined until review completes. | **Yes** |

A row may carry a primary and a secondary class. `OP-G` always dominates: if a row is `OP-G`, no other class may be executed first.

---

## 6. Verification provenance

| Token | Meaning |
|---|---|
| `ARCHITECT_VERIFIED` | This seat read the live bank at HEAD and confirmed identity and evidence text. |
| `PENDING_REOPEN` | Not reachable this session. Operation class is **provisional**, derived from the rejected artifact's structural description, and must be confirmed or refuted by Claude Code under §8 before it is actionable. |

### 6.1 Why 31 rows are `PENDING_REOPEN`

The filesystem connector's `search_repository_files` silently skips files larger than 2 MiB, and offers no line-ranged read (`head`/`tail` only). `hard-cases-canonical.json` (2,087,261 B) and `claude-canonical.json` (1,178,703 B) fall under the ceiling and were searched successfully. `gemini-canonical.json` (3,770,431 B) and `gpt-canonical.json` (6,483,293 B) return zero matches for strings guaranteed present — a bare `gemini_` query across `banks/` returns nothing. This is a reader limit, not a repository fact, and no claim about the contents of those two banks may be inferred from it.

---

## 7. The 35-row manifest

Queue order. `2235` is absent by owner disposition (§1.3).

| # | Queue | Bank | Question ID | Item type | Op class | Provenance | Owner gate |
|---:|---:|---|---|---|---|---|---|
| 1 | 57 | claude | `claude_a_mc_breastfeeding_latch_47` | multiple_choice | `OP-A` | `ARCHITECT_VERIFIED` | no |
| 2 | 147 | claude | `opus_case_lithium_toxicity_01` | case_study | `OP-C` | `ARCHITECT_VERIFIED` | **yes** |
| 3 | 162 | claude | `claude_moc_deleg_matrix_08` | matrix | `OP-G` + `OP-D` | `ARCHITECT_VERIFIED` | **yes** |
| 4 | 226 | gemini | `gemini_jun05_a_mc_lithium_toxicity_36` | multiple_choice | `OP-E` | `PENDING_REOPEN` | bilingual |
| 5 | 656 | gemini | `gemini_d9_02` | select_all | `OP-E` | `PENDING_REOPEN` | bilingual |
| 6 | 702 | gemini | `trad_batchB_14` | multiple_choice | `OP-E` | `PENDING_REOPEN` | bilingual |
| 7 | 735 | gemini | `trad_batchC_25` | multiple_choice | `OP-G` + `OP-E` | `PENDING_REOPEN` | **yes** |
| 8 | 799 | gemini | `gen_rrp_batch2_02` | select_all | `OP-E` | `PENDING_REOPEN` | bilingual |
| 9 | 888 | gemini | `gap_50_mc_01` | dropdown_cloze | `OP-B?` | `PENDING_REOPEN` | gated |
| 10 | 890 | gemini | `gap_50_mc_03` | dropdown_cloze | `OP-C?` | `PENDING_REOPEN` | **yes** |
| 11 | 892 | gemini | `gap_50_mc_05` | dropdown_cloze | `OP-C?` | `PENDING_REOPEN` | **yes** |
| 12 | 902 | gemini | `gap_50_bcc_02` | dropdown_cloze | `OP-B?` | `PENDING_REOPEN` | gated |
| 13 | 904 | gemini | `gap_50_bcc_04` | dropdown_cloze | `OP-B?` | `PENDING_REOPEN` | gated |
| 14 | 905 | gemini | `gap_50_bcc_05` | dropdown_cloze | `OP-B?` | `PENDING_REOPEN` | gated |
| 15 | 920 | gemini | `gap_50_sic_07` | dropdown_cloze | `OP-B?` | `PENDING_REOPEN` | gated |
| 16 | 921 | gemini | `gap_50_sic_08` | dropdown_cloze | `OP-C?` | `PENDING_REOPEN` | **yes** |
| 17 | 922 | gemini | `gap_50_sic_09` | dropdown_cloze | `OP-B?` | `PENDING_REOPEN` | gated |
| 18 | 931 | gemini | `gap_50_ppt_06` | dropdown_cloze | `OP-C?` | `PENDING_REOPEN` | **yes** |
| 19 | 932 | gemini | `gap_50_ppt_07` | dropdown_cloze | `OP-B?` | `PENDING_REOPEN` | gated |
| 20 | 933 | gemini | `gap_50_ppt_08` | dropdown_cloze | `OP-B?` | `PENDING_REOPEN` | gated |
| 21 | 1103 | gemini | `gemini_hpm_ngn_2026_06_22_q3` | dropdown_cloze | `OP-C?` | `PENDING_REOPEN` | **yes** |
| 22 | 1108 | gemini | `gemini_hpm_ngn_2026_06_22_q8` | dropdown_cloze | `OP-C?` | `PENDING_REOPEN` | **yes** |
| 23 | 1486 | gpt | `gpt_gap_jun11_fib_scabies_precautions_03` | fill_in_blank | `OP-F` | `PENDING_REOPEN` | **yes** |
| 24 | 1492 | gpt | `gpt_gap_jun11_fib_lung_cancer_screening_03` | fill_in_blank | `OP-F` | `PENDING_REOPEN` | **yes** |
| 25 | 1731 | gpt | `gpt_case_clozapine_toxicity_01` → `_q5` | ordered_response | `OP-G` | `PENDING_REOPEN` | **yes** |
| 26 | 2123 | gpt | `gpt_balance6a_2026_07_16_mx_discharge_planning_handoff_09` | matrix | `OP-D` + `OP-G` | `PENDING_REOPEN` | **yes** |
| 27 | 2176 | gpt | `gpt_format10b_free_water_deficit` | fill_in_blank | `OP-D` | `PENDING_REOPEN` | **yes** |
| 28 | 2178 | gpt | `gpt_format10b_rapid_shallow_breathing_index` | fill_in_blank | `OP-D` | `PENDING_REOPEN` | **yes** |
| 29 | 2185 | gpt | `gpt_format8a_haloperidol_qtcf` | fill_in_blank | `OP-D` | `PENDING_REOPEN` | **yes** |
| 30 | 2190 | gpt | `gpt_format8a_pf_ratio` | fill_in_blank | `OP-D` | `PENDING_REOPEN` | **yes** |
| 31 | 2219 | gpt | `gpt_format9c_pn_peripheral_central_access` | dropdown_cloze | `OP-D` | `PENDING_REOPEN` | **yes** |
| 32 | 2228 | gpt | `gpt_format11b_retinal_detachment_emergency_cues` | highlight | `OP-G` + `OP-D` | `PENDING_REOPEN` | **yes** |
| 33 | 2231 | gpt | `gpt_format11b_pediatric_oxygenation_index` | fill_in_blank | `OP-D` | `PENDING_REOPEN` | **yes** |
| 34 | 2238 | gpt | `gpt_format11c_water_deprivation_desmopressin_interpretation` | dropdown_cloze | `OP-D` | `PENDING_REOPEN` | **yes** |
| 35 | 2413 | hard-cases | `cs_sepsis_shock_01` → `_part_1` | matrix | `OP-B` | `ARCHITECT_VERIFIED` | boundary ruling |

`?` marks a provisional class whose `OP-B` vs `OP-C` assignment is decided by the §8 R2 test, not by this table.

---

## 7A. Detail — architect-verified rows

### Queue 57 — `OP-A`, mechanical

Bank `banks/claude-canonical.json`. Record id at line 4038.

Live `stem.en` (line 4045):

```text
A postpartum nurse is observing a new mother breastfeed for the first time. Which finding indicates D correct latch?
```

Live `stem.zh` (line 4046) — intact, no defect, do not touch:

```text
一位产后护士正在观察一位新妈妈第一次哺乳。哪项发现表明含接正确？
```

Operation: within `stem.en`, replace `indicates D correct latch` with `indicates a correct latch`.

Mutation preconditions, all must hold:
1. `stem.en` contains `indicates D correct latch` exactly once.
2. `question.correct` is not `["D"]` — machine-checked at apply time, not asserted from this document. This is the telegraphing guard: a stray `D` adjacent to the response demand must not coincide with key `D`.
3. `stem.zh` is byte-identical before and after.

Dependencies: none. This is the only row in the manifest with no owner gate.

### Queue 147 — `OP-C`, reclassified

Bank `banks/claude-canonical.json`. Record id at line 17771.

Live `stem.en` (line 17777) — **this is the entire field value**:

```text
Lithium toxicity precipitated by thiazide diuretic initiation and volume depletion in a patient with bipolar disorder.
```

Live `stem.zh` (line 17778) — **entire field value**:

```text
由开始使用噻嗪类利尿剂和容量消耗诱发的一名双相情感障碍患者的锂中毒。
```

**Reclassification.** The rejected artifact records `finalNextStep: DELETION_CANDIDATE`, `finalRemovalRisk: LOW`, `repairEligibility: EXACT_MECHANICAL_REPAIR`, and the owner disposition routed this row to planning group 4.1 (narrow mechanical or bounded text). All of these rest on the premise that the flagged sentence can be removed. It cannot: the flagged sentence *is* the whole stem in both languages, and §3.1 forbids an empty `stem`. The finding itself is sound — the container stem states diagnosis and precipitating mechanism before the case evidence, and the first embedded question asks for exactly that mechanism. Only the operation class changes: `OP-C`, replacement, owner-ratified text required.

The replacement must present the case neutrally without naming the precipitant. `caseStudy.title` already identifies the case for navigation, so the stem carries no navigational load.

Dependency — blocking: see LIT-1 (§9). Repairing `stem` alone does **not** discharge the telegraphing on this item, because `caseStudy.summary` restates the same mechanism. Executing `OP-C` on `stem` while leaving `summary` intact produces a false closure.

### Queue 162 — `OP-G` + `OP-D`

Bank `banks/claude-canonical.json`.

Live `stem.en` (line 19718):

```text
For each task, select the lowest-level team member to whom the registered nurse can appropriately assign it on a medical-surgical unit. Assume a common U.S. med-surg scope where the state Nurse Practice Act and facility policy permit.
```

Live `stem.zh` (line 19719):

```text
对于每项任务，请选择在内外科病区护士可恰当委派的最低层级团队成员。假设是在相关州《护理执业法》和机构政策允许的常见美国内外科执业范围内。
```

The flagged terminal is the second sentence in both languages. A preceding sentence exists and carries a complete response demand, so deletion is **schema-safe** (§3.1 satisfied) but **construct-unsafe**: delegation answers depend on which scope of practice governs, so bare deletion creates genuine key ambiguity. The owner disposition's full-item routing is correct.

Useful lever for the rewrite: the compliant scope statement already exists in this item's own `rationale.correct.zh` (line 19814), as the parenthetical `（执业范围因各州《护理执业法》和机构政策而异；此处反映美国急症护理常见的委派规则及 NCSBN/ANA 委派指南。）`. Per the `AGENTS.md` invariant, `rationale` is the correct home for scope and role boundaries. The information is therefore not lost by naturalizing or removing the stem sentence — the review question is whether the *stem* needs enough clinical framing to disambiguate the key without instructing the learner to assume a jurisdiction.

### Queue 2413 — `OP-B`, boundary ruling requested

Bank `banks/hard-cases-canonical.json`. Container id at line 13443; embedded record `cs_sepsis_shock_01_part_1` id at line 13583.

Live `stem.en` (line 13590):

```text
Based on the initial triage assessment at 1400, for each finding, click to specify if it is consistent with classic SIRS criteria (a foundational infection-response framework still tested on the NCLEX-RN), organ dysfunction, or neither.
```

Live `stem.zh` (line 13591):

```text
根据1400时的初步分诊评估，对于每项发现，请点击指明其是否符合经典SIRS标准（一个在NCLEX-RN中仍会考核的基础性感染反应框架）、器官功能障碍或两者皆非。
```

The defect is real: exam-blueprint commentary addressed to the learner about what the NCLEX-RN tests. The span sits inside a longer stem, so deletion is schema-safe.

**Operation boundary — owner ruling requested.** Two candidate spans:

- **B1 (checker's span):** delete the whole parenthetical. Removes the exam-process leak *and* the clinical gloss.
- **B2 (recommended):** delete only the exam-process clause, retaining the gloss. `en` → `(a foundational infection-response framework)`; `zh` → `（基础性感染反应框架）`.

B2 is the tighter operation. It excises exactly the defect — commentary about the exam — while preserving a legitimate learner-facing clinical gloss of SIRS that carries teaching value and is not author-facing. B1 removes content that was never defective. This seat recommends **B2** and requests the owner's ruling before the row is actionable.

**Anchor warning specific to this row.** The rejected artifact's `zh` quote for this row is not live text (§4). The `zh` anchor above was re-derived from disk at line 13591 and is the only one that may be used.

---

## 7B. Detail — pending-reopen row groups

Operation classes below are **provisional**. Each group states the live test that confirms or refutes it. No row in this section is actionable until §8 returns.

### G1 — Chinese terminology and instruction defects (226, 656, 702, 799) — provisional `OP-E`

Per the rejected artifact: 226 inserts 地高辛 (digoxin) into a lithium-toxicity stem; 656 and 799 drop 选 from 选择, leaving the malformed SATA instruction 择所有适用项; 702 renders *Clostridioides difficile* as 艰难克罗替尼 rather than 艰难梭菌.

Live test: confirm the exact `zh` string, confirm `en` is undefective, confirm the corrected `zh` leaves the field non-empty. 226 is a clinical-terminology correction and requires bilingual review with clinical sign-off; 656, 702, and 799 are bounded terminology or orthography repairs.

Note 656/799 share a defect signature. If the reopen finds the same malformed instruction on rows **outside** the manifest, that is a corpus observation, not a new finding — record it under §9 for owner litigation. Do not remediate it.

### G2 — `dropdown_cloze` raw-template leak and response-surface duplication (888, 890, 892, 902, 904, 905, 920, 921, 922, 931, 932, 933, 1103, 1108) — provisional `OP-B` or `OP-C`

Fourteen rows, all `banks/gemini-canonical.json`. Per §3.1 and §3.4, these items present both `stem` and `clozeStem`, and `stem` is unvalidated for placeholders (§3.2), so raw `{{...}}` tokens reach the learner outside their dropdown controls.

**The decisive test (R2 in §8), applied per row and per language:**

> Remove the flagged terminal span from `stem`. Does a non-empty remainder survive in **both** `stem.en` and `stem.zh`?
>
> - **Yes** → `OP-B`, bounded deletion. Mechanical, gated only on this proof plus placeholder-residue and parity checks.
> - **No** → `OP-C`, field replacement. The whole stem is the leak. Requires owner-ratified replacement text carrying the clinical setup without duplicating `clozeStem`.

The provisional split in §7 assigns `OP-C?` to 890, 892, 921, 931, 1103, 1108 — the rows the artifact describes as word-for-word identical to `clozeStem` or as whole-stem duplicates — and `OP-B?` to the rest, which the artifact describes as having a preceding clinical sentence. **That split is a hypothesis from a rejected source. R2 decides it.**

Additional preconditions for any row in this group:
1. After mutation, `stem.en` and `stem.zh` contain zero `{{...}}` tokens.
2. `clozeStem` is byte-identical before and after. The functional response surface is never touched by this lane.
3. `dropdowns[].correct` and `dropdowns[].options` are byte-identical before and after.
4. The existing validator rule at `src/schema.ts` line 940–941 — a dropdown must not leak its correct answer in `clozeStem` — must still pass.

### G3 — `fill_in_blank` placeholder exposure (1486, 1492) — `OP-F`

Per §3.3 there is no inline-binding mechanism. Fork for owner decision:

- **F1 — content-side:** rewrite `stem.en` / `stem.zh` so the sentence reads correctly with no `{{bN}}` tokens, relying on `blanks[].prompt` to carry the response demand. Cheapest, no schema change, but must preserve the clinical framing the artifact flags as necessary (scabies transmission-based precaution type and post-treatment interval; lung-cancer screening pack-year and upper-age criteria).
- **F2 — schema/renderer:** extend the contract to render blanks inline at placeholder positions. Larger blast radius: `src/types.ts`, `src/schema.ts`, `src/allowedKeys.ts`, `src/App.tsx`, and a bank-impact survey across every existing `fill_in_blank` item before any floor tightens, per the `AGENTS.md` escalation triggers for data contracts.

This seat does not recommend between F1 and F2 without the reopen evidence and a count of affected `fill_in_blank` items corpus-wide. That count is task R3 in §8.

### G4 — Construct-scope defense requiring naturalization (2123, 2176, 2178, 2185, 2190, 2219, 2231, 2238) — provisional `OP-D`

Eight rows, all `banks/gpt-canonical.json`. The shared signature is a stem sentence that refers to the item itself — "This item asks only for…", "This question asks only for…", "This item tests…", "Apply only the criteria stated here" — and then defends the exclusion of a plausible clinical follow-on task.

The governing rule is `AGENTS.md`:

> Authoring and checker constraints must not appear as learner-facing disclaimers. Encode scope, protocol, and role boundaries in the clinical context and response choices, and explain them in the rationale; do not append instructions such as "Do not independently prescribe or change a dose" to a stem.

In every row the *clinical* content of the caveat is valid and worth preserving — a P/F ratio alone does not diagnose ARDS; RSBI alone does not establish SBT readiness; a QTcF value alone does not drive a medication decision. `OP-D` therefore means **relocate and renaturalize, not delete**. Two acceptable destinations: naturalized clinical framing inside the stem that carries the same boundary without self-reference, or the item's `rationale`, which is the sanctioned home per the invariant above.

Deletion is rejected as an operation for this group. It would strip a valid clinical safety point and, on the calculation items, leave the learner without the boundary that keeps a computed number from being read as a treatment decision.

Per-row owner ratification of replacement text is required. These are clinical claims and fall under the `AGENTS.md` escalation trigger: verify against the sourced reference lane, never author from conversation.

### G5 — Item-design compensation and full review (735, 1731, 2228) — `OP-G`

- **735** — the `zh` stem substitutes 《健康中国 2030》 (Healthy China 2030), a distinct national programme, for Healthy People 2030, then adds translator-like commentary defending the mapping; the item's own `rationale.correct.zh` uses a *different* translation (《健康人民 2030》). This is an internal bilingual construct inconsistency, not a terminology typo. Full item review must decide the canonical rendering and apply it to every field before any bounded edit.
- **1731** — embedded `_q5` of `gpt_case_clozapine_toxicity_01`. The terminal concedes that neutropenic precautions are indicated, then defends their absence from the response set by restricting the construct to steps with clear serial ordering. Accepted by the owner as a Sonnet false negative. This is an incomplete `ordered_response` option set compensated for in prose. Review must assess whether the option set should be completed rather than the prose repaired — deleting the sentence without fixing the option set makes the item *worse*, not better, because the concession is currently the only thing preventing a defensible complaint that a correct action is missing.
- **2228** — `highlight` item; the terminal comments on how distractor segments were constructed ("Stable longstanding findings are included as near-misses"). The artifact records `POSSIBLE_AMBIGUITY` on removal. Review must confirm the highlight `correct` set remains unambiguous without the hint before any deletion.

---

## 8. Claude Code reopen commission

**Seat:** Claude Code. **Authority:** read-only evidence production. **Not authorized:** bank mutation, runtime code changes, commit, push, merge, `DECISIONS.md` writes, adding or removing findings, re-adjudicating any accepted finding, or touching queue 2235.

Claude Code has local shell access and is not subject to the 2 MiB connector ceiling described in §6.1. That is the entire reason this lane exists.

### Tasks

**R1 — Reopen the 31 `PENDING_REOPEN` rows.**

For each row in §7 marked `PENDING_REOPEN`, read the live record from the bank named in the manifest and emit:
- confirmation that the question id exists, and for 1731 and 2413-style records, that the embedded id exists under the stated container;
- the **full live** `stem.en` and `stem.zh` values, verbatim, not excerpted;
- for `dropdown_cloze` rows, the full live `clozeStem.en` and `clozeStem.zh`;
- for `fill_in_blank` rows, the full live `blanks[]` array;
- the exact flagged span as it appears on disk, with a byte-offset or unambiguous unique-substring locator;
- a boolean per language: does the flagged span constitute the entire field value?
- a `quoteProvenance` field per language: `VERBATIM` if the rejected artifact's quote matches disk exactly, `RECONSTRUCTED` otherwise, with the disk text given.

**R2 — Decide `OP-B` vs `OP-C` for every G2 row** using the test stated in §7B/G2, reported per row and per language. Report the decision, not a recommendation.

**R3 — Count corpus-wide `fill_in_blank` items whose `stem` contains `{{...}}` tokens**, across all thirteen canonical banks. This sizes the F1/F2 fork in §7B/G3. Report counts and ids only. Do not remediate rows outside the manifest; if the count exceeds the two manifest rows, that is a §9 litigation input.

**R4 — Confirm §3.4.** Read the enclosing component in `src/App.tsx` around line 3265 and confirm the generic `question.stem` render block is not gated by item type. Report the enclosing function name and the gating condition if any. This is the load-bearing premise for the entire G2 group.

**R5 — Re-derive every anchor.** For all 35 rows including the four `ARCHITECT_VERIFIED` ones, produce the exact live `oldText` anchor string that a future mutation would consume, and assert uniqueness within the record. Report any anchor that is absent or non-unique as a hard finding.

### Cross-check sources — better than the checker's quotes, still not live

Two artifacts carry terminal-sentence text that is **mechanically extracted or producer-side**, rather than hand-quoted by the rejected checker. Both are materially more reliable than the §4 evidence and both must still be confirmed against live disk.

1. `audit/terminal-sentence-semantic-census-2026-07-21/quarantine/adjudication.jsonl` — one record per queue index, carrying `terminalSentenceEn` and `terminalSentenceZh` produced by the deterministic queue build (`../build-queue.ts`). **Locate records by their explicit `queueIndex` field; physical line offsets are not stable or authoritative.** Spot-checked this session at queue 888, where the extracted text matches the checker's quote exactly.

   **Use the extracted text only.** This file sits under `quarantine/` and its `verdict`, `primaryClass`, and related judgment fields belong to a quarantined adjudication pass — queue 888 carries `verdict: "PASS"` there while the owner has accepted it as a finding. Those verdicts are not evidence and must not be surfaced, cited, or reconciled.

2. `audit/terminal-sentence-sonnet-review-2026-07-21/batches/batch-*.jsonl` — the Sonnet producer records, which are the origin of 33 of the 35 accepted findings.

Use these to cross-check R1 and R5. Any divergence between the mechanical extraction and live disk is itself a reportable finding: it means either the bank changed after the 2026-07-21 census — plausible, given the authorized 50-ID snapshot removal recorded in `TERMINAL-SENTENCE-INDEPENDENT-CHECKER-SALVAGE-SNAPSHOT-ADDENDUM-2026-07-22.md` — or the extraction is defective. Report which, per row.

Live disk remains the sole authority. A match against these files discharges nothing on its own.

### Output

Write to `audit/terminal-sentence-remediation-2026-07-22/reopen-evidence.jsonl`, one JSON object per manifest row, in queue order, plus a `reopen-report.md` summarising R2, R3, R4 and any anchor failures from R5.

Do not modify any file under `banks/`, `src/`, `lib/`, or `scripts/`. Do not modify this work order. Do not commit or push.

### Completion gate

The commission is complete when all 35 rows have live evidence, R2 has decided every G2 row, and R4 has returned. At that point this work order's provisional classes are replaced by decided ones and the result returns to the architect seat for the owner-ratification packet — not to implementation.

---

## 9. Owner-litigation candidates — recorded, not added

Neither of these is a finding. Neither is in the 35-row manifest. Both surfaced during reopening and are recorded here because silently absorbing them would be worse than stating them. Adding either to remediation scope requires explicit owner-facing litigation.

**LIT-1 — `opus_case_lithium_toxicity_01`, `caseStudy.summary` (queue 147's item).**

Live `caseStudy.summary.en` (line 17782):

```text
A case study evaluating the nursing care of a patient with severe lithium toxicity precipitated by hydrochlorothiazide and volume depletion.
```

Live `caseStudy.summary.zh` (line 17783):

```text
一项评估由氢氯噻嗪和容量消耗诱发的严重锂中毒患者护理的案例研究。
```

This restates the precipitating mechanism that the first embedded question asks the learner to identify — the same defect the accepted finding names in `stem`, in an adjacent field the terminal-sentence census could not structurally see. Under §3.5 `summary` is optional and may be deleted outright.

**This is a blocking dependency for queue 147, not merely an adjacent observation.** Executing `OP-C` on `stem` while `summary` stands would produce a repaired stem and an unrepaired item, and would record a closure that is not true.

**LIT-2 — no placeholder validation on `stem`.**

Per §3.2, `extractPlaceholders` is applied only to `clozeStem`. Raw `{{...}}` tokens in `stem` pass validation silently. This is the structural gap that let the G2 and G3 classes reach canonical banks, and it will let them recur after remediation. A validator guard is the obvious follow-up and is **not** authorized here — it is a schema-tier change requiring a bank-impact survey before any floor tightens.

**LIT-3 — possible off-manifest recurrence of the 656/799 signature.** See §7B/G1. Pending R1.

---

## 10. Regression and verification requirements

These attach to the eventual mutation phase, which **this document does not authorize**. They are specified now so the owner-ratification packet is complete.

Per the `AGENTS.md` risk-tiered table, any change to `banks/*.json` is **bank content** tier: full promotion pipeline, no reduced tier exists.

Required for any bank mutation in this lane:

```bash
npm run validate-bank -- banks/*.json
npm run scan-unknown-keys
npm run audit
npm run census && npm run census:check
npx tsc -b --pretty false
npm run build
```

Targeted regressions by row group:

| Group | Additional |
|---|---|
| All | `npm run test:schema-bank`, `npm run validate-sweep` |
| 147, 1731, 2413 (case records) | `npm run test:case-completeness`, `npm run test:audit-stage-refs`, `npm run test:audit-ids` |
| G2 `dropdown_cloze` | `npm run test:grading` — dropdown scoring must be unchanged; `clozeStem` byte-identity assertion |
| G3 if F2 is chosen | Full schema tier: bank-impact survey across all `fill_in_blank` items, `npm run test:validate-sweep`, `npm run test:promote`, `npm run test:consolidate` |
| 2228 (highlight) | `npm run test:highlight` |
| 162, 2123 (matrix) | `npm run test:grading` |
| Any `zh` edit | Bilingual parity check; `npm run fix-bank-quotes` dry run before any write to confirm no smart-quote corruption |

Process requirements: producer ≠ checker on the review of any authored replacement text (`OP-C`, `OP-D`, `OP-F/F1`); `BANK-REVIEW-LEDGER.md` entry before the changed items are treated as reviewed study material; census regenerated and checked.

---

## 11. Residuals

Stated plainly rather than smoothed over.

1. **31 of 35 rows were not reopened by the architect seat.** Their operation classes are provisional and derived from a formally rejected source. §8 exists to close this.
2. **The rejected artifact's Chinese quotes are demonstrably unreliable** — one confirmed reconstruction in a sample of four (§4). The true rate across the 31 unverified rows is unknown and could be higher. Partially mitigated: the mechanical census extraction identified in §8 supplies a better anchor candidate for every row, which R1 and R5 must reconcile against live disk. It does not remove the residual, because that extraction predates the authorized snapshot removal and is itself unconfirmed at HEAD.
3. **§3.4 is inferred from two render sites, not from reading the enclosing component.** R4 closes it. If R4 refutes it, the entire G2 group's duplication premise needs re-examination.
4. **The corpus remains uncleared.** These 35 rows are the accepted subset of a rejected census. Remediating all 35 leaves the terminal-sentence question open corpus-wide, and no downstream artifact may state otherwise.
5. **The `OP-B`/`OP-C` split in §7 is a hypothesis, not a finding.** Six rows are provisionally routed to owner ratification that R2 may return to mechanical, and eight are provisionally routed to mechanical that R2 may escalate.

---

## 12. Prohibitions, binding on every downstream seat

- No bank mutation, implementation, commit, push, or merge is authorized by this document.
- No finding may be added or removed without explicit owner-facing litigation.
- Queue 2235 is retained and outside remediation scope.
- The rejected census establishes no clearance.
- Checker-supplied quotes are never mutation anchors (§4).
- Canonical bank content is never hand-edited.
- No seat may authorize its own plan for implementation.
- `DECISIONS.md` is architect-seat-only and requires the owner's explicit wording approval; nothing in this work order has been written there.
