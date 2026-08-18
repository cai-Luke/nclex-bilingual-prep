# Stage 2a full constitutional review — tranche D

Read-only §5 full constitutional review deliverable. Review began only after the two pinned identities were freshly remeasured.

- Work order: DECISIONS-MIGRATION-STAGE-2A-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md — 32622 bytes; SHA-256 ba03de1bcf8058eea5062d0d67d838faa5d316038c9cd083c33b13f468ec39ac.
- Manifest: audit/decisions-migration-2026-07-29/target-text-manifest.md — 314491 bytes; SHA-256 9d3283086a93daa3e0925ff539f9d98d5914cc9955035f129f3178329804fe5a.
- Commissioned records: M4.57–M4.66 (10 live records).
- Branch: codex/decisions-migration; HEAD: 05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5.
- Review mode: source re-derivation only; no repair, no manifest edit, no resume/status/decision-file edit, and no Stage 2b tranche review.

Per-record format follows §5.8: locator/identity; source IDs and packet locator; enumerated source limbs; field-by-field disposition with separate Evidence/Owner tests; date check; verdict.

### M4.57 — Shared visual numeric helpers have a single definition — Shared visual numeric helpers have a single definition

1. Locator and permanent identity
- Manifest record M4.57; target section target §6.
- Permanent identity/title: Shared visual numeric helpers have a single definition / Shared visual numeric helpers have a single definition. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
The shared visual numeric helpers `fmt`, `fmtNum`, and `roundTo` have a single definition, and no visual
kind redefines them.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E064.
- Packet locator: packet §56; manifest M4.57 item 14; baseline E064 [69478,69635).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - Shared visual numeric helpers have a single definition: `fmt`, `fmtNum`, `roundTo` live in `src/visuals/primitives/graphPaper.ts`; no kind redefines them.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.57 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.57 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate —; field-specific Evidence omission test passed..
- Owner: `src/visuals/primitives/graphPaper.ts` — Owner test PASS: tracked path; field-specific test applied..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-12 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.58 — Case-study exhibit IDs share one namespace — Case-study exhibit IDs share one namespace

1. Locator and permanent identity
- Manifest record M4.58; target section target §6.
- Permanent identity/title: Case-study exhibit IDs share one namespace / Case-study exhibit IDs share one namespace. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Case-study exhibit identifiers share one namespace across the whole case, spanning the top-level
`caseStudy.exhibits` array and every stage. That array may be empty when the case's opening content is
meant to be entirely stage-gated.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E065.
- Packet locator: packet §57; manifest M4.58 item 14; baseline E065 [69635,69844).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - Case-study exhibit ids share one namespace across the whole case (top-level `exhibits` plus every stage); `caseStudy.exhibits` may be empty if the case's opening content is meant to be entirely stage-gated.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.58 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.58 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate —; field-specific Evidence omission test passed..
- Owner: `src/schema.ts` — Owner test PASS: tracked path; field-specific test applied..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-13 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.59 — Category targets are the current test-plan weights — Category targets are the current test-plan weights

1. Locator and permanent identity
- Manifest record M4.59; target section target §6.
- Permanent identity/title: Category targets are the current test-plan weights / Category targets are the current test-plan weights. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Category targets are the current test-plan weights project-wide rather than uniform, and they are held
in the single `NCLEX_CATEGORY_WEIGHTS` map that both the weighted study draw and the generation coverage
backlog read. Item-type balance stays uniform by design, because the test plan weights Client Needs
categories rather than item formats.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E066.
- Packet locator: packet §58; manifest M4.59 item 14; baseline E066 [69844,70144).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - Category targets are the current test-plan weights project-wide, not uniform, for both the weighted study draw and the generation coverage backlog (`NCLEX_CATEGORY_WEIGHTS`, single map).
- L2 — carried (retained or compressed in target/rationale): Item-type balance stays uniform by design — the test plan weights Client Needs categories, not item formats.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.59 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.59 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate —; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-SINGLE-OWNER; candidate `src/schema.ts`, `src/sessionSampler.ts`, `scripts/coverage-report.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-12 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.60 — Bank composition is a floor problem, not a balance problem — Bank composition is a floor problem, not a balance problem

1. Locator and permanent identity
- Manifest record M4.60; target section target §6.
- Permanent identity/title: Bank composition is a floor problem, not a balance problem / Bank composition is a floor problem, not a balance problem. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Bank composition is a floor problem rather than a balance problem: no release gate enforces balance, and
the rule is that no format falls below the depth its sampling path requires, which is the
`floorThreshold` viability gate. Above that floor, topic fit and item quality override census
arithmetic, and no weak item is authored merely to close a census gap.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E067.
- Packet locator: packet §59; manifest M4.60 item 14; baseline E067 [70144,70497).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - **Bank composition is a floor problem, not a balance problem.** No release gate enforces balance; the rule is that no format may fall below the depth its sampling path requires (the `floorThreshold` viability gate), and above that floor, topic fit and item quality override census arithmetic — no weak item is authore…
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.60 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.60 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate —; field-specific Evidence omission test passed..
- Owner: `src/sessionSampler.ts` — Owner test PASS: tracked path; field-specific test applied..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-10 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.61 — Repository-state hygiene is mechanism-specific — Repository-state hygiene is mechanism-specific

1. Locator and permanent identity
- Manifest record M4.61; target section target §6.
- Permanent identity/title: Repository-state hygiene is mechanism-specific / Repository-state hygiene is mechanism-specific. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Repository-state hygiene is mechanism-specific: a GitHub-reading agent sees only committed and pushed
inputs, while a disk-reading agent works from an explicit local branch or worktree snapshot and must
preserve unrelated changes. No agent may assume local and remote state are identical.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E068.
- Packet locator: packet §60; manifest M4.61 item 14; baseline E068 [70497,70847).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - **Repository-state hygiene is mechanism-specific.** GitHub-reading agents can see only committed and pushed inputs; disk-reading agents operate against an explicit local branch/worktree snapshot and must preserve unrelated changes.
- L2 — carried (retained or compressed in target/rationale): No agent may assume local and remote state are identical.
- L3 — carried (retained or compressed in target/rationale): The binding operational requirements live in `AGENTS.md`.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.61 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.61 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate —; field-specific Evidence omission test passed..
- Owner: `AGENTS.md` — Owner test PASS: tracked path; field-specific test applied..
- Execution: OMIT — explicit M4.61 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-23 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.62 — Some topics are deliberately shared across categories — Some topics are deliberately shared across categories

1. Locator and permanent identity
- Manifest record M4.62; target section target §6.
- Permanent identity/title: Some topics are deliberately shared across categories / Some topics are deliberately shared across categories. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Some topics are deliberately shared across NCLEX categories rather than misclassified, and the shared
set with each topic's categories is held in the `SHARED_TOPIC_CATEGORY` map. An item's category is never
corrected to match a topic's single most obvious category, because the topic is intentionally
cross-category.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E069.
- Packet locator: packet §61; manifest M4.62 item 14; baseline E069 [70847,71397).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - **Some topics are deliberately shared across NCLEX categories, not misclassified.** `Skin & Wound Care` spans Basic Care and Comfort, Reduction of Risk Potential, and Safety and Infection Prevention and Control; `Transfusion & Blood Products` spans Safety and Infection Prevention and Control, Pharmacological and Par…
- L2 — carried (retained or compressed in target/rationale): Do not "fix" an item's category to make it match a topic's single most-obvious category — the topic is intentionally cross-category.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.62 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.62 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate —; field-specific Evidence omission test passed..
- Owner: `src/topics.ts` — Owner test PASS: tracked path; field-specific test applied..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-18 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.63 — Highlight's structural bias gate is schema-level — Highlight's structural bias gate is schema-level

1. Locator and permanent identity
- Manifest record M4.63; target section target §6.
- Permanent identity/title: Highlight's structural bias gate is schema-level / Highlight's structural bias gate is schema-level. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Every `highlight` item must include at least one selectable distractor segment, enforced at schema
validation rather than at audit, so an all-selectable item cannot enter a bank. Segment order is
clinically meaningful passage order and is never shuffled, so the non-MCQ positional audit has no
applicable position null for highlight and semantic cue quality stays content-review work.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E071.
- Packet locator: packet §62; manifest M4.63 item 14; baseline E071 [72065,72488).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - **Highlight's structural bias gate is schema-level, not audit-level.** Every `highlight` item must include at least one selectable distractor segment (Tier 0 validation) — "highlight everything" cannot enter a bank.
- L2 — carried (retained or compressed in target/rationale): Segment order is clinically meaningful passage order and is never shuffled; the non-MCQ positional audit has no applicable position null for highlight, so semantic cue quality stays content-review work.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.63 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.63 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate —; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-SINGLE-OWNER; candidate `src/schema.ts`, `scripts/audit/non-mcq-bias-lib.ts`, `scripts/audit/non-mcq-bias-layer-b.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-14 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.64 — Translation-friction scoring — Translation-friction scoring

1. Locator and permanent identity
- Manifest record M4.64; target section target §7.
- Permanent identity/title: Translation-friction scoring / Translation-friction scoring. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Whether reveal-tap friction folds into the targeted-review sampler is unresolved, and it stays open
until real dogfooding sessions show reveal concentration that is genuinely topic-specific or
category-specific and miss-predictive beyond the existing missed-topic signal. The instrument,
comprising telemetry, export, and the dev panel, already ships; only the scoring decision is parked.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E045.
- Packet locator: packet §63; manifest M4.64 item 14; baseline E045 [58058,58439).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **Translation-friction scoring.
- L2 — carried (retained or compressed in target/rationale): Status: PARKED.** Folding reveal-tap friction into the targeted-review sampler stays open until real dogfooding sessions show reveal concentration that is genuinely topic/category-specific and miss-predictive beyond the existing missed-topic signal.
- L3 — carried (retained or compressed in target/rationale): The instrument (telemetry, export, dev panel) already ships; only the scoring decision is parked.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: T — re-derived against frozen classification; PASS.
- Status: PARKED — re-derived against frozen classification; PASS.
- Force: ADVISORY — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.64 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.64 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground UNRESOLVED-SUBJECT; candidate the shipped translation-friction instrument; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground UNRESOLVED-SUBJECT; candidate —; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.64 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-01 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.65 — Exam-condition test and adaptive modes — Exam-condition test and adaptive modes

1. Locator and permanent identity
- Manifest record M4.65; target section target §7.
- Permanent identity/title: Exam-condition test and adaptive modes / Exam-condition test and adaptive modes. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Whether the non-default `test` and `adaptive` half-exam placeholder modes are specified as real exam
simulators, with deferred feedback, no translate-all, and strict language mode, or are removed instead,
is unresolved. Both force `languageMode: "off"` at session creation and still reveal the answer, the
rationale, and the per-choice breakdown immediately after each submit. A deferred sub-question is
whether a strict exam environment should ever permit a post-submit full translation reveal.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E046.
- Packet locator: packet §64; manifest M4.65 item 14; baseline E046 [58439,58952).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **`test` and `adaptive` exam-condition modes.
- L2 — carried (retained or compressed in target/rationale): Status: PARKED.** Both are non-default half-exam placeholders — they force `languageMode: "off"` at session creation and still reveal the answer, rationale, and per-choice breakdown immediately after each submit — pending a decision to spec each as a real exam simulator (deferred feedback, no translate-all, strict lan…
- L3 — carried (retained or compressed in target/rationale): Deferred sub-question: whether a strict exam environment should ever permit a post-submit full translation reveal.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: T — re-derived against frozen classification; PASS.
- Status: PARKED — re-derived against frozen classification; PASS.
- Force: ADVISORY — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.65 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.65 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground UNRESOLVED-SUBJECT; candidate —; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground UNRESOLVED-SUBJECT; candidate —; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.65 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-09 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.66 — Unresolved vital sanity bounds — Unresolved vital sanity bounds

1. Locator and permanent identity
- Manifest record M4.66; target section target §7.
- Permanent identity/title: Unresolved vital sanity bounds / Unresolved vital sanity bounds. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
DBP and MAP ceilings are authorized for a separate bounded sourcing pass, with no number selected here.
The `temp` floor remains inherited and unratified, and the laboratory `sao2` key stays provisionally at
a floor of 50%, a deliberate divergence because pulse-oximeter evidence does not govern it. All other
unratified sides remain provisional, and no bound is authored from model memory at any stage.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E047b.
- Packet locator: manifest archive/source-span record; manifest M4.66 item 14; baseline E047b [59048,62233).

3. Enumerated source-limb disposition
- L1 — source entry E047b is recorded by the manifest source-span review; its source prose is carried into the reviewed surface.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: T — re-derived against frozen classification; PASS.
- Status: REVISIT — re-derived against frozen classification; PASS.
- Force: ADVISORY — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.66 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.66 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-SINGLE-EVIDENCE-SOURCE, UNRESOLVED-SUBJECT; candidate the two P3 stage-3 records at row 74; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground PENDING, UNRESOLVED-SUBJECT; candidate `src/measurementAllowlist.ts`; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.66 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-24 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

Tranche D closure: 10 commissioned live records written and closed. Findings, if any, are recorded only; no correction was attempted.
