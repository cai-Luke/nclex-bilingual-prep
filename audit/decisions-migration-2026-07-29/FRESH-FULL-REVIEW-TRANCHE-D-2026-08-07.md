# Fresh full constitutional review — tranche D

## Opening identity and authority

- Work order, revision 1: **12023 bytes / SHA-256 `07e8c6dbc5f792d592a7b4b88dcf154eb3f5ef70657e9b3f91758658351e5250`**.
- Fresh subject measurement: `audit/decisions-migration-2026-07-29/target-text-manifest.md`, **314811 bytes / SHA-256 `e99335567d157a86f8f2b6f178b7222bf86ccfe15e5f827da5a03864c1d04b31`**.
- Branch: `codex/decisions-migration`; HEAD: `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`.
- Population: **10 live records, M4.57–M4.66 (the final seven `I` entries and three `T` entries)**.
- This is a fresh source-to-target read. The prior full-review tranche output was read only as historical defect provenance; no prior tranche clearance was used.

## Records

### M4.57 — `Shared visual numeric helpers have a single definition` — CLEAR

- **Source:** `E064`, source-packet line 376, bytes `[69478,69635)`; target exact title.
- **Live subject:** “The shared visual numeric helpers `fmt`, `fmtNum`, and `roundTo` have a single definition, and no visual kind redefines them.”
- **Operative limbs:** the three named helpers are shared — **RETAINED IN M4.57 TARGET STATEMENT**; each has one definition — **RETAINED IN M4.57 TARGET STATEMENT**; visual kinds may not redefine them — **RETAINED IN M4.57 TARGET STATEMENT**.
- **Fields/date:** `Kind=I; Status=ACTIVE; Force=BINDING; Date=2026-06-12; Owner=src/visuals/primitives/graphPaper.ts; Execution=EXECUTED`; `Authorized`, `Not authorized`, and `Evidence` are explicit `OMIT`. Owner path is tracked; Evidence has no compressed substance.
- **Verdict:** **CLEAR**.

### M4.58 — `Case-study exhibit IDs share one namespace` — CLEAR

- **Source:** `E065`, source-packet line 377, bytes `[69635,69844)`; target exact title.
- **Live subject:** “Case-study exhibit identifiers share one namespace across the whole case, spanning the top-level `caseStudy.exhibits` array and every stage.” The target retains collision prevention across the full case.
- **Operative limbs:** exhibit IDs have one case-wide namespace — **RETAINED IN M4.58 TARGET STATEMENT**; top-level and staged exhibits are included — **RETAINED IN M4.58 TARGET STATEMENT**; duplicate IDs are invalid — **RETAINED IN M4.58 TARGET STATEMENT**.
- **Fields/date:** `Kind=I; Status=ACTIVE; Force=BINDING; Date=2026-07-13; Owner=src/schema.ts; Execution=EXECUTED`; `Authorized`, `Not authorized`, and `Evidence` are explicit `OMIT`. Owner path is tracked; Evidence has no compressed substance.
- **Verdict:** **CLEAR**.

### M4.59 — `Category targets are the current test-plan weights` — CLEAR

- **Source:** `E066`, source-packet line 378, bytes `[69844,70144)`; target exact title.
- **Live subject:** “Category targets are the current test-plan weights project-wide rather than uniform, and they are held in the single `NCLEX_CATEGORY_WEIGHTS` map.” The target retains project-wide scope, the named map, and the distinction from an invariant release balance.
- **Operative limbs:** weights are test-plan targets — **RETAINED IN M4.59 TARGET STATEMENT**; targets are project-wide — **RETAINED IN M4.59 TARGET STATEMENT**; weights are held in the named map — **RETAINED IN M4.59 TARGET STATEMENT**; no uniform/balance interpretation is added — **RETAINED IN M4.59 TARGET STATEMENT**.
- **Fields/date:** `Kind=I; Status=ACTIVE; Force=BINDING; Date=2026-06-12; Execution=EXECUTED`; `Authorized`, `Not authorized`, `Evidence`, and `Owner` are explicit `OMIT`. Evidence has no compressed substance; schema, sampler, and coverage surfaces jointly enforce the statement, so Owner is no single path.
- **Verdict:** **CLEAR**.

### M4.60 — `Bank composition is a floor problem, not a balance problem` — CLEAR

- **Source:** `E067`, source-packet line 379, bytes `[70144,70497)`; target exact title.
- **Live subject:** “Bank composition is a floor problem rather than a balance problem: no release gate enforces balance, and the rule is that no format falls below the declared floor.”
- **Operative limbs:** no balance release gate — **RETAINED IN M4.60 TARGET STATEMENT**; composition is a floor problem — **RETAINED IN M4.60 TARGET STATEMENT**; declared format floors may not be breached — **RETAINED IN M4.60 TARGET STATEMENT**; composition is interpreted against the current census — **RETAINED IN M4.60 TARGET STATEMENT**.
- **Fields/date:** `Kind=I; Status=ACTIVE; Force=BINDING; Date=2026-07-10; Owner=src/sessionSampler.ts; Execution=EXECUTED`; `Authorized`, `Not authorized`, and `Evidence` are explicit `OMIT`. Owner is the named sampling path for the retained floor mechanism; Evidence has no compressed substance.
- **Verdict:** **CLEAR**.

### M4.61 — `Repository-state hygiene is mechanism-specific` — CLEAR

- **Source:** `E068`, source-packet line 380, bytes `[70497,70847)`; target exact title.
- **Live subject:** “Repository-state hygiene is mechanism-specific: a GitHub-reading agent sees only committed and pushed inputs, while a disk-reading agent works from an explicit local branch/worktree snapshot.” The target retains the no-assumption rule and uncommitted-input boundary.
- **Operative limbs:** access mechanism determines visible state — **RETAINED IN M4.61 TARGET STATEMENT**; remote/GitHub reader sees committed/pushed inputs — **RETAINED IN M4.61 TARGET STATEMENT**; disk reader uses explicit local snapshot — **RETAINED IN M4.61 TARGET STATEMENT**; local/remote identity is not assumed — **RETAINED IN M4.61 TARGET STATEMENT**.
- **Fields/date:** `Kind=I; Status=ACTIVE; Force=BINDING; Date=2026-07-23; Owner=AGENTS.md`; `Authorized`, `Not authorized`, `Evidence`, and `Execution` are explicit `OMIT`. The Owner path is tracked and is the constitutional source; no execution state is claimed.
- **Verdict:** **CLEAR**.

### M4.62 — `Some topics are deliberately shared across categories` — CLEAR

- **Source:** `E069`, source-packet line 381, bytes `[70847,71397)`; target exact title.
- **Live subject:** “Some topics are deliberately shared across NCLEX categories rather than misclassified, and the shared set with each topic's categories is held in the single `src/topics.ts` map.”
- **Operative limbs:** shared topics are deliberate — **RETAINED IN M4.62 TARGET STATEMENT**; sharing is not misclassification — **RETAINED IN M4.62 TARGET STATEMENT**; topic-to-category set is centralized — **RETAINED IN M4.62 TARGET STATEMENT**.
- **Fields/date:** `Kind=I; Status=ACTIVE; Force=BINDING; Date=2026-06-18; Owner=src/topics.ts; Execution=EXECUTED`; `Authorized`, `Not authorized`, and `Evidence` are explicit `OMIT`. Owner path is tracked; Evidence has no compressed substance.
- **Verdict:** **CLEAR**.

### M4.63 — `Highlight's structural bias gate is schema-level` — CLEAR

- **Source:** `E071`, source-packet line 383, bytes `[72065,72488)`; target exact title.
- **Live subject:** “Every `highlight` item must include at least one selectable distractor segment, enforced at schema validation rather than at audit.” The target retains all-selectable rejection and schema-level enforcement.
- **Operative limbs:** highlight requires a selectable distractor — **RETAINED IN M4.63 TARGET STATEMENT**; schema validation is the gate — **RETAINED IN M4.63 TARGET STATEMENT**; audit is not the first/only enforcement point — **RETAINED IN M4.63 TARGET STATEMENT**; all-selectable items fail — **RETAINED IN M4.63 TARGET STATEMENT**.
- **Fields/date:** `Kind=I; Status=ACTIVE; Force=BINDING; Date=2026-06-14; Execution=EXECUTED`; `Authorized`, `Not authorized`, `Evidence`, and `Owner` are explicit `OMIT`. Evidence has no compressed substance; schema/audit paths jointly cover definition and review, so no single Owner.
- **Verdict:** **CLEAR**.

### M4.64 — `Translation-friction scoring` — CLEAR

- **Source:** `E045`, source-packet line 331, bytes `[58058,58439)`; target exact title.
- **Live subject:** “Whether reveal-tap friction folds into the targeted-review sampler is unresolved, and it stays open until real dogfooding sessions show reveal concentration.” The target preserves the open question and no-premature instrument decision.
- **Operative limbs:** reveal-tap friction may affect targeted review — **RETAINED IN M4.64 TARGET STATEMENT**; current integration is unresolved — **RETAINED IN M4.64 TARGET STATEMENT**; real dogfooding evidence is required before closure — **RETAINED IN M4.64 TARGET STATEMENT**.
- **Fields/date:** `Kind=T; Status=PARKED; Force=ADVISORY; Date=2026-07-01`; all optional fields are explicit `OMIT`. `Evidence` and `Owner` are `UNRESOLVED-SUBJECT`; `Execution` is omitted.
- **Verdict:** **CLEAR** — unresolved subject is preserved as unresolved, not silently resolved or promoted.

### M4.65 — `Exam-condition test and adaptive modes` — CLEAR

- **Source:** `E046`, source-packet line 333, bytes `[58439,58952)`; target exact title.
- **Live subject:** “Whether the non-default `test` and `adaptive` half-exam placeholder modes are specified as real exam simulators … remains unresolved.” The target retains deferred-feedback/translation and learner-facing scope as open design questions.
- **Operative limbs:** test/adaptive modes are non-default placeholders — **RETAINED IN M4.65 TARGET STATEMENT**; real simulator status is unresolved — **RETAINED IN M4.65 TARGET STATEMENT**; feedback/translation behavior is not prematurely ratified — **RETAINED IN M4.65 TARGET STATEMENT**.
- **Fields/date:** `Kind=T; Status=PARKED; Force=ADVISORY; Date=2026-07-09`; all optional fields are explicit `OMIT`. `Evidence`, `Owner`, and `Execution` are omitted on `UNRESOLVED-SUBJECT`/no-state grounds.
- **Verdict:** **CLEAR**.

### M4.66 — `Unresolved vital sanity bounds` — CLEAR

- **Source:** `E047b`, shared source-packet line 339, bytes `[59048,62233)`; target exact title.
- **Live subject:** “DBP and MAP ceilings are authorized for a separate bounded sourcing pass, with no number selected here. The `temp` floor remains inherited and unratified.” The target preserves the unresolved boundaries and avoids selecting a number.
- **Operative limbs:** DBP/MAP ceilings are open for bounded sourcing — **RETAINED IN M4.66 TARGET STATEMENT**; no numerical ceiling is selected — **RETAINED IN M4.66 TARGET STATEMENT**; temperature floor remains inherited/unratified — **RETAINED IN M4.66 TARGET STATEMENT**; the two coequal P3 stage-3 packets remain unresolved evidence context — **RETAINED IN M4.66 TARGET STATEMENT**.
- **Fields/date:** `Kind=T; Status=REVISIT; Force=ADVISORY; Date=2026-07-24`; all optional fields are explicit `OMIT`. Evidence is `NO-SINGLE-EVIDENCE-SOURCE` plus unresolved subject; Owner is pending/unresolved; Execution is omitted.
- **Verdict:** **CLEAR** — the record is correctly a revisit and makes no unauthorized clinical selection.

## Tranche D result

**PASS — 10/10 records CLEAR; 0 FINDING; 0 QUESTION.** No repair, interpretation change, or mutation is authorized by this receipt.
