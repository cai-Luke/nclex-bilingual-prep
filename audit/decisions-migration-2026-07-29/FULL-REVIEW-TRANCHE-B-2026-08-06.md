# Stage 2a full constitutional review — tranche B

Read-only §5 full constitutional review deliverable. Review began only after the two pinned identities were freshly remeasured.

- Work order: DECISIONS-MIGRATION-STAGE-2A-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md — 32622 bytes; SHA-256 ba03de1bcf8058eea5062d0d67d838faa5d316038c9cd083c33b13f468ec39ac.
- Manifest: audit/decisions-migration-2026-07-29/target-text-manifest.md — 314491 bytes; SHA-256 9d3283086a93daa3e0925ff539f9d98d5914cc9955035f129f3178329804fe5a.
- Commissioned records: M4.20–M4.38 (19 live records).
- Branch: codex/decisions-migration; HEAD: 05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5.
- Review mode: source re-derivation only; no repair, no manifest edit, no resume/status/decision-file edit, and no Stage 2b tranche review.

Per-record format follows §5.8: locator/identity; source IDs and packet locator; enumerated source limbs; field-by-field disposition with separate Evidence/Owner tests; date check; verdict.

### M4.20 — P19#0 — P19 — Rationale visuals are explanation figures, not stimuli

1. Locator and permanent identity
- Manifest record M4.20; target section target §4.
- Permanent identity/title: P19#0 / P19 — Rationale visuals are explanation figures, not stimuli. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Rationale visuals are an answer-revealed teaching slot reusing existing deterministic visual kinds;
structural kind validation applies to them, but item-type placement and `selfCheck` answer-coupling do
not. The load-bearing-stimulus rules continue to apply in full to the question's own visual. Rationale
figures participate in the shared full-schema projection for schema-floor detection, export-envelope
inference, and renderer parity, but are excluded from the deliberately narrower census artifact
population by ratification; the two traversals must not be unified.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E018.
- Packet locator: packet §18; manifest M4.20 item 14; baseline E018 [23124,24133).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **19.
- L2 — carried (retained or compressed in target/rationale): Rationale visuals are explanation figures, not stimuli.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE.** `rationale.visuals` is an answer-revealed teaching slot reusing existing deterministic visual kinds, rendered after the correct rationale and before per-choice rationales.
- L4 — carried (retained or compressed in target/rationale): Structural kind validation runs on them, but item-type placement and `selfCheck` answer-coupling do not — an explanation figure may intentionally reveal a threshold, abnormality, or relationship the stem didn't require.
- L5 — carried (retained or compressed in target/rationale): The load-bearing-stimulus rules still apply in full to `question.visual`.
- L6 — carried (retained or compressed in target/rationale): Schema-floor detection and export-envelope inference traverse all six supported visual locations, including top-level and embedded rationale figures, through `src/schema.ts`'s shared full-schema projection.
- L7 — carried (retained or compressed in target/rationale): Renderer parity consumes that same projection.
- L8 — carried (retained or compressed in target/rationale): The census artifact population remains a separate, deliberately narrower four-location traversal under principle 28 and excludes rationale figures by ratification; the two populations must not be unified.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.20 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.20 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — explicit M4.20 item-10 omission; no candidate row is required..
- Owner: OMIT — M6.3 ground PARTIAL-OWNERSHIP; candidate `src/schema.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-16 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.21 — P20#0 — P20 — Pronunciation audio is pre-generated and local-first

1. Locator and permanent identity
- Manifest record M4.21; target section target §4.
- Permanent identity/title: P20#0 / P20 — Pronunciation audio is pre-generated and local-first. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
The pre-generated audio architecture — local-first bilingual distribution, field-level content-hashed
clips, and asset-presence resolution — is settled but inactive and not currently binding. It remains
subject to I: `Runtime audio carries no client-embedded secret`, which binds regardless of this
principle's status. Resumption is a lane decision rather than a re-derivation, triggered when the
current workaround stops sufficing, integrated bilingual audio becomes wanted, or scale makes a
per-user workaround unfit.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E044.
- Packet locator: packet §36; manifest M4.21 item 14; baseline E044 [56919,58058).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **20.
- L2 — carried (retained or compressed in target/rationale): Pronunciation/audio is pre-generated, local-first, resolved by asset presence.
- L3 — carried (retained or compressed in target/rationale): Status: PARKED.** The pre-generated-audio architecture itself — local-first bilingual TTS distribution, field-level content-hashed clips, asset-presence resolution — is inactive and not currently binding; it is subject to the universal runtime-audio invariant below, which stays active regardless of this principle's st…
- L4 — carried (retained or compressed in target/rationale): Deprioritized 2026-06-22 on real user feedback (a GPT-conversation workaround currently suffices for the acute trigger), not killed — the queue/cost/per-field-clip machinery is fully built (`src/audio/normalizeForTts.ts`, `scripts/audio/build-tts-queue.ts`), so a restart is a lane decision, not a re-derivation.
- L5 — carried (retained or compressed in target/rationale): **Resumption triggers:** the workaround stops sufficing, integrated bilingual audio becomes wanted, or the project reaches a scale where a workaround-per-user no longer fits.
- L6 — carried (retained or compressed in target/rationale): Clip counts, minute/storage estimates, price-per-tier projections, provider/model/codec choices, Pages limits, R2 scaling plans, and queue implementation detail: archived — none of it is active constitutional content while parked.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: PARKED — re-derived against frozen classification; PASS.
- Force: ADVISORY — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.21 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.21 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — explicit M4.21 item-10 omission; no candidate row is required..
- Owner: OMIT — M6.3 ground NO-SINGLE-OWNER; candidate `src/audio/normalizeForTts.ts`, `scripts/audio/build-tts-queue.ts`; field-specific Owner omission test passed..
- Execution: INACTIVE.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-22 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.22 — P21#0 — P21 — Repo-reading generation prompts carry the semantic floor

1. Locator and permanent identity
- Manifest record M4.22; target section target §4.
- Permanent identity/title: P21#0 / P21 — Repo-reading generation prompts carry the semantic floor. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
When the generating model can read the repository, the prompt defers all per-format shape to the
operational and schema documents and restates none of it. It inlines only the semantic floor the schema
cannot infer: no-filler distractors; rationales for keyed answers and distractors; closed-world stems;
clinical scope and monitorability; no lazy provider-notification key; unique ordered-response sequences;
bounded highlight selection; gradeable closed-vocabulary blanks; bilingual parity; and failure of the
whole item when a keyed ID does not exist. Narrow per-format shape reminders return only after a
measured recurring failure.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E019.
- Packet locator: packet §19; manifest M4.22 item 14; baseline E019 [24133,25173).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **21.
- L2 — carried (retained or compressed in target/rationale): Generation prompts for repo-reading instances carry the semantic floor, not the schema.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE (narrowed 2026-07-14).** When the generating model can read the repo, the prompt defers all per-format *shape* to `AGENTS.md`/`NCLEX-Question-Schema.md` and restates none of it.
- L4 — carried (retained or compressed in target/rationale): It inlines only the semantic-quality floor the schema cannot infer: no-filler distractors; per-choice rationale for keyed answers *and* distractors; closed-world stems; no lazy "notify provider" key; unique ordered-response sequences; bounded highlight selection; gradeable closed-vocabulary blanks; clinical scope/moni…
- L5 — carried (retained or compressed in target/rationale): Reintroduce narrow per-format shape reminders only after a measured recurring failure — the default for repo-reading instances stays minimal.
- L6 — carried (retained or compressed in target/rationale): Historical validation metrics and the June experiment narrative: archived.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.22 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.22 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-SINGLE-EVIDENCE-SOURCE; candidate `AGENTS.md`, `NCLEX-Question-Schema.md`; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-EXECUTABLE-OWNER; candidate —; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.22 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-14 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.23 — P21#1 — #P21 — Application: construction language stays off the learner surface

1. Locator and permanent identity
- Manifest record M4.23; target section target §4.
- Permanent identity/title: P21#1 / #P21 — Application: construction language stays off the learner surface. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Closed-world construction describes an authoring method, not wording to show a learner: the governing
order, protocol, threshold, or criteria must instead be stated naturally in the question. Author and
checker scaffolding is naturalized before promotion without removing the embedded rule or changing the
tested construct. A project-internal producer constraint is embodied through clinical facts, choices,
and rationale rather than appended to the stem as a disclaimer.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E020.
- Packet locator: packet §20; manifest M4.23 item 14; baseline E020 [25173,26287).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **Application — construction language stays off the learner surface (2026-07-21).** `Closed-world` describes an authoring construction, not wording to show a learner: the governing order, protocol, threshold, or criteria must instead be stated naturally in the question.
- L2 — carried (retained or compressed in target/rationale): Author/checker scaffolding such as `source-pinned`, `source-supported`, and metaphorical `lane` language is naturalized before promotion without removing the embedded rule or changing the tested construct.
- L3 — carried (retained or compressed in target/rationale): Project-internal constraints also stay off learner surfaces: a producer rule such as “do not independently prescribe” must be embodied through clinical facts, choices, and rationale rather than appended to the stem as a disclaimer.
- L4 — carried (retained or compressed in target/rationale): The finite HIGH-confidence label lexicon remains enforced by [`lib/producer-vocabulary-leakage.ts`](lib/producer-vocabulary-leakage.ts); the separate constraint-shaped survey and narrow blocker are owned by [`lib/authorial-constraint-leakage.ts`](lib/authorial-constraint-leakage.ts).
- L5 — carried (retained or compressed in target/rationale): Broader directive shapes remain review-only because legitimate clinical scope teaching uses the same vocabulary.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.23 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.23 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — explicit M4.23 item-10 omission; no candidate row is required..
- Owner: OMIT — M6.3 ground NO-SINGLE-OWNER; candidate `lib/producer-vocabulary-leakage.ts`, `lib/authorial-constraint-leakage.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-21 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.24 — P21#2 — #P21 — Application: construction language is functional, not positional

1. Locator and permanent identity
- Manifest record M4.24; target section target §4.
- Permanent identity/title: P21#2 / #P21 — Application: construction language is functional, not positional. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Construction language is any learner-facing prose whose function is to explain, justify, or defend how
the item was built, and it is identified by function, never by phrase and never by position. Terminal
position is a review heuristic only, because producers tend to append constraints, defenses, and
apologies after an otherwise complete item. A clean terminal-sentence sweep is therefore not evidence
that a corpus is free of construct defense.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E021.
- Packet locator: packet §21; manifest M4.24 item 14; baseline E021 [26287,28613).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **Application — construction language is functional, not positional (2026-07-22).** Construction language under this principle is any learner-facing prose whose *function* is to explain, justify, or defend how the item was built — a scope caveat, a sourcing note, a construct defense, an apology for an omission.
- L2 — carried (retained or compressed in target/rationale): It is identified by function, never by phrase and never by position.
- L3 — carried (retained or compressed in target/rationale): Terminal position is a **review heuristic only**: producers tend to append constraints, defenses, sourcing notes, and apologies after an otherwise complete item, which makes the final sentence the highest-yield place to look first.
- L4 — carried (retained or compressed in target/rationale): It does not define the defect, and a mid-stem construct defense is the same defect in a less convenient place.
- L5 — carried (retained or compressed in target/rationale): *Forcing incident (compact).* Luke identified a PEP `ordered_response` stem whose closing sentence correctly distinguished source-patient testing, exposed-worker testing, and non-delay of PEP — clinically accurate, but reading as an adjudication note defending the authored sequence rather than as clinical instruction.
- L6 — carried (retained or compressed in target/rationale): A later RSBI item stated "This item asks only for documentation of the index; RSBI alone is not required to determine spontaneous-breathing-trial readiness," showing post-hoc construct defense as a general producer pattern rather than a single lapse.
- L7 — carried (retained or compressed in target/rationale): `gap_50_mc_03` then proved the family was not confined to prose: its stem rendered raw `{{1}}` / `{{2}}` placeholders to the learner (`The nurse should first {{1}} and then {{2}}.`) and duplicated the response demand already carried by `clozeStem`, so the same behavior also produced response-surface placement defects.
- L8 — carried (retained or compressed in target/rationale): Adjacent construct audits found the identical behavior expressed structurally — ordered responses forcing concurrent actions into a total order, fill-ins reducing interpretation to labels or arithmetic, dependent dropdown blanks, and decorative bowtie expansion.
- L9 — carried (retained or compressed in target/rationale): The common cause is a producer completing an item and then defending it; the defense surfaces as prose, as a placeholder, or as a distorted construct.
- L10 — carried (retained or compressed in target/rationale): *Consequence for review design.* A positional filter is a sampling strategy, never a definition, and a clean terminal-sentence sweep is therefore not evidence that a corpus is free of construct defense.
- L11 — carried (retained or compressed in target/rationale): Remediation lane and evidence: `audit/terminal-sentence-remediation-2026-07-22/`.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.24 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.24 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NOT-A-PATH; candidate `audit/terminal-sentence-remediation-2026-07-22/`; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-EXECUTABLE-OWNER; candidate —; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.24 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-22 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.25 — P23#0 — P23 — Exam-like presentation is a renderer concern

1. Locator and permanent identity
- Manifest record M4.25; target section target §4.
- Permanent identity/title: P23#0 / P23 — Exam-like presentation is a renderer concern. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Split layout is presentation only: a case study stays one top-level session question with one
aggregate submit and one aggregate score, and grading, storage, spaced repetition, progress, flags,
adaptive, and summary all key on the top-level question id; per-part submit and true unfolding reveal
remain deferred because they require a storage-and-grading redesign, and are revisited only if
real-session observation shows aggregate submit is the fidelity bottleneck. Stage visibility always
includes global exhibits and all stages through the active part and is fail-open, so an absent or
unresolved stage reference shows all stages, never fewer. Split eligibility is determined by measured
visual geometry rather than nominal item type, and a kind joins the standalone split allowlist only
after a measured proof render.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E022.
- Packet locator: packet §22; manifest M4.25 item 14; baseline E022 [28613,30089).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **23.
- L2 — carried (retained or compressed in target/rationale): Exam-like presentation is a renderer concern; case identity and grading are not.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE.** The split layout (client chart left, active item right) is presentation only.
- L4 — carried (retained or compressed in target/rationale): A `case_study` stays one top-level session question — one `AnswerState.caseStudy`, one aggregate submit, one aggregate score; grading, storage, SRS, progress, flags, adaptive, and summary all key on the top-level `question.id`.
- L5 — carried (retained or compressed in target/rationale): Per-part submit / true unfolding reveal is deferred: it needs a storage-and-grading redesign (per-part result/completeness state, synthetic ids) and is revisited only if real-session observation shows aggregate submit is the fidelity bottleneck.
- L6 — carried (retained or compressed in target/rationale): Stage visibility is cumulative and fail-open: both `stageId` and `answerableAfterStageId` show global exhibits plus all stages through the active part's stage; an absent or unresolved reference shows **all** stages, never fewer.
- L7 — carried (retained or compressed in target/rationale): Split eligibility is determined by measured visual geometry, not nominal item type — calibrated wide tracings stay full-width; squarish/vertical/compacted-table kinds join the standalone split allowlist only after a measured proof render, never a predicted one.
- L8 — carried (retained or compressed in target/rationale): Moved to code/status — verify there, not here: the exact split allowlist is `STANDALONE_SPLIT_VISUAL_KINDS` in `src/examLayout.ts`; exact pixel/viewBox dimensions, proof-render sizes, and the current case-mapping coverage percentage belong to code and `PROJECT-HISTORY.md`'s current-status section, not this principle.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.25 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.25 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — explicit M4.25 item-10 omission; no candidate row is required..
- Owner: OMIT — M6.3 ground CARRIED-ELSEWHERE, NO-SINGLE-OWNER; candidate `src/examLayout.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-14 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.26 — P23#1 — #P23 — Application: sparse shape-aware allocation

1. Locator and permanent identity
- Manifest record M4.26; target section target §4.
- Permanent identity/title: P23#1 / #P23 — Application: sparse shape-aware allocation. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
A kind-level split allowlist may be refined by payload geometry after the same measured proof this
principle requires. The measured one-series `lab_trend` takes the full-width route while the two-series
shape remains split; structured measurements independently use a whole-payload density predicate, so
only a sole one-panel, one-row, one-column payload receives a compact figure while mixed-panel and
denser payloads remain full-width. These are presentation allocations, not new content-validity floors.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E023.
- Packet locator: packet §23; manifest M4.26 item 14; baseline E023 [30089,30817).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **Application — sparse shape-aware allocation (2026-07-19).** A kind-level split allowlist may be refined by payload geometry after the same measured proof this principle requires.
- L2 — carried (retained or compressed in target/rationale): The measured one-series `lab_trend` shape now takes the full-width route while the two-series shape remains in the split.
- L3 — carried (retained or compressed in target/rationale): Structured measurements use an independent whole-payload density predicate: only a sole one-panel × one-row × one-column payload receives a natural compact figure, while mixed-panel and denser payloads retain the established full-width behavior.
- L4 — carried (retained or compressed in target/rationale): These are presentation allocations, not new content-validity floors; principle 29's sparse-cardinality ruling and principle 24's prose- supplement contract remain unchanged.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.26 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.26 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate —; field-specific Evidence omission test passed..
- Owner: `src/examLayout.ts` — Owner test PASS: tracked path; field-specific test applied..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-19 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.27 — P23#2 — #P23 — Application: an embedded leaf is a planning unit, not a retirement unit

1. Locator and permanent identity
- Manifest record M4.27; target section target §4.
- Permanent identity/title: P23#2 / #P23 — Application: an embedded leaf is a planning unit, not a retirement unit. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
An embedded case leaf is an individual content-planning unit but not an ordinary unit of removal,
because the case is authored, navigated, submitted, and graded as one keyed identity. Schema legality
is never the test: default to rewriting or replacing a leaf in place, and retire the whole case only
when no coherent replacement is feasible. No embedded-leaf retirement mechanism is authorized.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E024.
- Packet locator: packet §24; manifest M4.27 item 14; baseline E024 [30817,32618).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **Application — an embedded leaf is a planning unit, not a retirement unit (2026-07-22).** Principle 28 makes each embedded case leaf an individual *content-planning* unit carrying its own category, topic, item type, and difficulty.
- L2 — carried (retained or compressed in target/rationale): That does not make it an ordinary unit of removal.
- L3 — carried (retained or compressed in target/rationale): This principle keeps the `case_study` one top-level session question — one aggregate submit, one aggregate score, one keyed identity — so a case is authored, navigated, submitted, and graded as a single unit, and deleting one leaf is a case-level structural revision rather than a content edit.
- L4 — carried (retained or compressed in target/rationale): Schema legality is not the test.
- L5 — carried (retained or compressed in target/rationale): `caseStudy.questions` requiring only two members means a five-part case still validates after losing one; validation says nothing about whether the surviving narrative, stage references, part cadence, and aggregate scoring still cohere.
- L6 — carried (retained or compressed in target/rationale): **Default to rewriting or replacing the leaf in place.** Where a leaf's construct is unsalvageable — for example an `ordered_response` whose corrected content would force genuinely concurrent actions into a total order — replace it with an appropriate non-serial format after source-backed construct and key re-derivati…
- L7 — carried (retained or compressed in target/rationale): Retire the **whole case** when no coherent replacement is feasible.
- L8 — carried (retained or compressed in target/rationale): No embedded-leaf retirement mechanism is authorized; schema legality is never the argument for minting one.
- L9 — carried (retained or compressed in target/rationale): *Forcing incident.* The terminal-sentence remediation initially authorized retiring a single embedded `ordered_response` leaf on schema-legality grounds.
- L10 — carried (retained or compressed in target/rationale): Luke withdrew that authorization on 2026-07-22 as too harsh and structurally unprecedented, routing the row to whole-case rewrite instead.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.27 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.27 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground ARCHIVE-ONLY; candidate —; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-EXECUTABLE-OWNER; candidate —; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.27 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-22 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.28 — P24#0 — P24 — Structured measurements are values-only exhibit presentation

1. Locator and permanent identity
- Manifest record M4.28; target section target §4.
- Permanent identity/title: P24#0 / P24 — Structured measurements are values-only exhibit presentation. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Structured measurements supplement source prose and never replace it, except for a pure key-value
exhibit reduced to a pointer. Clinical identity — which analyte and which population — resolves
before display and before unit conversion and is never inferred from magnitude alone, because the
same source unit converts differently per registry key. Source values and typed bounds are stored
with canonical and display forms derived at the rendering edge rather than redundantly persisted,
censored values remain typed rather than coerced into a bare number, and non-rendering migration
dispositions — serial skips, empty extracts, excluded values, and unit aliases — stay ledger and
staging only, never entering canonical banks.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E025.
- Packet locator: packet §25; manifest M4.28 item 14; baseline E025 [32618,34428).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **24.
- L2 — carried (retained or compressed in target/rationale): Structured measurements are values-only exhibit presentation; identity/display resolve at the edges.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE (narrowed 2026-07-14).** Structured measurements supplement source prose — they never replace it except for pure key-value exhibits reduced to a pointer.
- L4 — carried (retained or compressed in target/rationale): Clinical identity (which analyte, which population) is resolved before display, never inferred from magnitude alone: total and ionized calcium are distinct registry keys (not unit variants of one value) routed by explicit source label, because a bare "calcium 1.2 mmol/L" is a normal *ionized* value but a critically-lo…
- L5 — carried (retained or compressed in target/rationale): Source values and typed bounds (`bound: ">" | "<"`) are stored; canonical and display forms are derived at the rendering edge rather than redundantly persisted, so there is one place — not several — that can drift.
- L6 — carried (retained or compressed in target/rationale): Censored values remain typed, never coerced into a bare number.
- L7 — carried (retained or compressed in target/rationale): Non-rendering migration dispositions (`skip_serial`, empty extracts, `excludedValues`, `unitAliases`) are ledger/staging-only and never enter canonical banks.
- L8 — carried (retained or compressed in target/rationale): Rule F (the `post_intervention` operative test) is owned by `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` — do not restate its test here.
- L9 — carried (retained or compressed in target/rationale): Moved to code/schema — verify there, not here: exact fields, enums, columns, validation behavior, and allowlist contents live in `src/types.ts`, `src/schema.ts`, `src/measurementAllowlist.ts`, and `src/measurementUnitPolicy.ts`.
- L10 — carried (retained or compressed in target/rationale): Proof-batch composition, Batch 19/20 handling, fast-follow fishbone sequencing, and applicator procedure narrative are migration detail, now redundant with the closed migration's archive and the extraction contract's authority map — archived, not restated here.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.28 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.28 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground CLAUSE-SCOPED; candidate `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md`; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-SINGLE-OWNER; candidate `src/types.ts`, `src/schema.ts`, `src/measurementAllowlist.ts`, `src/measurementUnitPolicy.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-14 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.29 — P25#0 — P25 — Necessity is a property of the artifact

1. Locator and permanent identity
- Manifest record M4.29; target section target §4.
- Permanent identity/title: P25#0 / P25 — Necessity is a property of the artifact. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
A redundant element is permissible inside a necessary, value-complete artifact — one that already
carries every exact value the item turns on — when it adds a meaningful reading affordance such as
pattern, direction, crossover, or divergence rather than ornament, and it never licenses information
absent elsewhere in the artifact, an artifact whose values the stem already states, or inclusion
justified only by vendor ubiquity. Two fences travel with the waiver: the artifact-level necessity
gate stays strict, so an item that any single-timepoint tally resolves belongs to the non-trend kind
rather than the waived one, and no exact-value item is authored on a waived-element kind, whose item
briefs stay pattern-only. Reversal is specific rather than a reopening of the waiver: where review
repeatedly catches an item answerable from one timepoint the collapse gate is being ignored, and
that kind closes to new content until the gate holds.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E026.
- Packet locator: packet §26; manifest M4.29 item 14; baseline E026 [34428,35775).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **25.
- L2 — carried (retained or compressed in target/rationale): Necessity is a property of the artifact, not of every element in it.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE.** A redundant element is permissible inside a necessary, value-complete artifact — one that already carries every exact value the item turns on — when it adds a meaningful reading affordance such as pattern, direction, crossover, or divergence, rather than mere ornament.
- L4 — carried (retained or compressed in target/rationale): It never licenses an ornament that carries information absent elsewhere in the artifact, and it never licenses an artifact whose values the stem already states.
- L5 — carried (retained or compressed in target/rationale): Two fences travel with this waiver and are load-bearing: the necessity gate stays unchanged and strict at the artifact level (if any single-timepoint tally resolves the item, it is the non-trend kind's item, not the waived kind's); and no exact-value item is authored on a waived-element kind (the table makes such an i…
- L6 — carried (retained or compressed in target/rationale): Vendor ubiquity (a chart because a vendor's EHR draws one) is explicitly not a qualifying criterion.
- L7 — carried (retained or compressed in target/rationale): Reversal is cheap and specific: if review repeatedly catches an item answerable from one timepoint, the waiver is not the problem — the collapse gate is being ignored, and the kind closes to new content until it holds.
- L8 — carried (retained or compressed in target/rationale): Full `io_trend`/fishbone litigation chronology: archived.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.29 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.29 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NOT-AN-AUTHORITY; candidate `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md`; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-EXECUTABLE-OWNER; candidate `src/schema.ts`; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.29 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-03 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.30 — P25#1 — #P25 — Application: composite trend artifacts

1. Locator and permanent identity
- Manifest record M4.30; target section target §4.
- Permanent identity/title: P25#1 / #P25 — Application: composite trend artifacts. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
A deterministic trend artifact may present the same typed source data through both charts and a
renderer-derived table when the views carry distinct reading affordances: charts expose direction,
divergence, crossover, and trajectory, while the table exposes exact values in a familiar flowsheet
form. The artifact-level necessity gate is unchanged, so removing the complete chart-plus-table
artifact must materially change answerability, the item must still turn on multi-timepoint or
cross-series reasoning rather than one isolated cell, and the table is never an independently
authored second source of truth. Sparse cardinality is not a validity floor for these artifacts
either, resting on `P7` and this principle's own anti-ornament fence rather than on `P29`, whose
scope stays `lab_trend` and `structured_labs_panel`.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E027.
- Packet locator: packet §27; manifest M4.30 item 14; baseline E027 [35775,36934).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **Application — composite trend artifacts.** A deterministic trend artifact may present the same typed source data through both charts and a renderer-derived table when the views provide distinct reading affordances: charts expose direction, divergence, crossover, and trajectory; the table exposes exact values in a fa…
- L2 — carried (retained or compressed in target/rationale): The artifact-level necessity gate remains unchanged — removing the complete chart-plus-table artifact must materially change answerability, and the item must still turn on multi-timepoint or cross-series reasoning, never one isolated cell.
- L3 — carried (retained or compressed in target/rationale): The table is never an independently authored second source of truth.
- L4 — carried (retained or compressed in target/rationale): Sparse cardinality is not a validity floor here by the same reasoning principle 29 applies to laboratory presentations — principle 7 plus principle 25's anti-ornament fence — not under principle 29 itself, which remains scoped to `lab_trend` and `structured_labs_panel`.
- L5 — carried (retained or compressed in target/rationale): First applied to `vitals_trend` by the 2026-07-18 composite readability repair: unit-pure scale-family panels, panel-exclusive reference bands, and a renderer-derived vital-sign flowsheet, with no schema or bank-content change.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.30 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.30 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground ARCHIVE-ONLY; candidate —; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground SUPERSEDED-SCOPE, NO-SINGLE-OWNER; candidate `src/visuals/kinds/vitals_trend/index.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-18 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.31 — P25#2 — #P25 — Amendment: unified single-axis vitals trend with retained flowsheet

1. Locator and permanent identity
- Manifest record M4.31; target section target §4.
- Permanent identity/title: P25#2 / #P25 — Amendment: unified single-axis vitals trend with retained flowsheet. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
The unit-pure multi-panel geometry is superseded as the default `vitals_trend` presentation by a
single unified chart carrying one time axis, one zero-based numeric axis, and no unit family, with
the renderer-derived flowsheet retained and visible beneath it and the superseded panel geometry
retained as the fallback arm. Per-vital resolution for low-magnitude vitals is recovered through
that retained flowsheet and the interactive per-timepoint readout rather than through separate
panels, and every fence this principle sets carries over unchanged. Reference bands are
single-series only under the unified model and a multi-series unified chart shows none, and no
schema, bank-content, or clinical-range change follows.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E028.
- Packet locator: packet §28; manifest M4.31 item 14; baseline E028 [36934,38883).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **Amendment (2026-07-19) — unified single-axis presentation supersedes the multi-panel geometry for `vitals_trend`; the flowsheet is retained.** The 2026-07-18 unit-pure multi-panel geometry above is superseded as the default `vitals_trend` presentation by an Epic-style single unified chart (one time axis, one 0-based…
- L2 — carried (retained or compressed in target/rationale): Forcing evidence per principle 27: a concluded A/B experiment in which the real user preferred the unified chart in ordinary study flow — not vendor familiarity, which principle 25 excludes as a qualifying criterion.
- L3 — carried (retained or compressed in target/rationale): Both arms shipped behind the persisted `vitalsChartStyle` setting (`epic` default; `panels` the preserved byte-identical composite, retained as the fallback) per `Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md`, the experiment's adjudicator being the user's experience as…
- L4 — carried (retained or compressed in target/rationale): What the unit-pure panels bought geometrically — per-vital resolution for low-magnitude vitals such as RR and temperature — the unified chart recovers instead through the retained flowsheet (exact values) plus the interactive readout, keeping principle 25's chart-carries-pattern / table-carries-exact-values division i…
- L5 — carried (retained or compressed in target/rationale): All principle-25 fences carry over unchanged: the artifact-level necessity gate, no exact-value item authored on the waived kind, and the table never an independently authored second source of truth.
- L6 — carried (retained or compressed in target/rationale): Reference bands, having no panels to be exclusive to, are single-series-only under the unified model; the multi-series unified chart shows none.
- L7 — carried (retained or compressed in target/rationale): No schema, bank-content, or clinical-range change.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.31 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.31 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground WRONG-AUTHORITY; candidate `Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md`; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-SINGLE-OWNER; candidate —; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-19 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.32 — P25#3 — #P25 — Application: reinstate the visible flowsheet beneath the unified chart

1. Locator and permanent identity
- Manifest record M4.32; target section target §4.
- Permanent identity/title: P25#3 / #P25 — Application: reinstate the visible flowsheet beneath the unified chart. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
The visible flowsheet beneath the unified chart is a re-add of the existing flowsheet renderer,
because the tested build shipped the hidden-table disposition instead. Shipped code is brought into
agreement with the ratified model. No further architect input is required.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E029.
- Packet locator: packet §29; manifest M4.32 item 14; baseline E029 [38883,39231).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **Implementer note (not architect-gated).** The visible flowsheet beneath the Epic chart is a low-cost re-add of the existing, known flowsheet renderer code; the tested `epic` build used the hidden-table (Route C) disposition, so reinstate the visible flowsheet so shipped code matches this ratified model.
- L2 — carried (retained or compressed in target/rationale): No further architect input is required.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.32 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.32 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NOT-A-PATH; candidate the `P25#2` cross-reference; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground PENDING; candidate —; field-specific Owner omission test passed..
- Execution: PENDING.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-19 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.33 — P26#0 — P26 — A disposition that suppresses a check must itself be checked

1. Locator and permanent identity
- Manifest record M4.33; target section target §4.
- Permanent identity/title: P26#0 / P26 — A disposition that suppresses a check must itself be checked. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
A disposition that removes material from a checked surface must have an independently enforced
precondition, and a producer may not silence its checker merely by declaring that nothing requires
review. Every disposition that removes a value from the checked surface — an exclusion, a skip, an
empty extract, an off-allowlist drop — purchases its silence by moving that value out of the
checker's view, so each needs its own precondition enforced by something other than the disposition
itself. Exclusion count is a positive signal for checker-seat sampling, not a negative one.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E030.
- Packet locator: packet §30; manifest M4.33 item 14; baseline E030 [39231,40746).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **26.
- L2 — carried (retained or compressed in target/rationale): A disposition that suppresses a check must itself be checked.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE (narrowed 2026-07-14).** A disposition that removes material from a checked surface must have an independently enforced precondition; a producer may not silence its checker merely by declaring that nothing requires review.
- L4 — carried (retained or compressed in target/rationale): Generalized past its origin: every disposition that *removes* a value from the checked surface — an exclusion, a skip, an empty extract, an off-allowlist drop — purchases its silence by moving the value out of the checker's view, so each needs its own precondition enforced by something other than the disposition itsel…
- L5 — carried (retained or compressed in target/rationale): Corollary: exclusion count is a **positive** signal for checker-seat sampling, not a negative one.
- L6 — carried (retained or compressed in target/rationale): Forcing incident (kept, compact): a staged flowsheet record's sixteen `reason: "prior"` exclusions silently deleted an entire baseline electrolyte panel and still gated clean, because excluding a value moves it out of the checker's view by construction, and the clinical judgment the record was meant to support was gra…
- L7 — carried (retained or compressed in target/rationale): The gate was silent exactly where it needed to speak.
- L8 — carried (retained or compressed in target/rationale): The full six-ruling extraction-semantics amendment this incident produced (post-intervention tagging, `prior_no_current`, censored-value typing, per-analyte unit inference, population-precedes-rendering) is flowsheet-extraction detail now owned by `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` and the migration…
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.33 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.33 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground CLAUSE-SCOPED; candidate `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md`; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground PARTIAL-OWNERSHIP; candidate `scripts/exhibit-flowsheet-gate.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-14 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.34 — P27#0 — P27 — An invariant softens only by naming its forcing incident

1. Locator and permanent identity
- Manifest record M4.34; target section target §4.
- Permanent identity/title: P27#0 / P27 — An invariant softens only by naming its forcing incident. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
To relax an invariant, name the incident it was minted from and argue that the condition which
produced it no longer holds; that the rule now feels heavy is not that argument. Every rule in this
repository was minted by a failure, and the endgame is exactly when ceremony feels most expensive
and the memory of why is thinnest, so the ratchet needs a procedure rather than a mood. A rule that
no longer earns its keep is retired on the record with its incident cited and marked `SUPERSEDED`
rather than deleted.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E031.
- Packet locator: packet §31; manifest M4.34 item 14; baseline E031 [40746,41665).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **27.
- L2 — carried (retained or compressed in target/rationale): An invariant softens only by naming the incident it was minted from and showing the generating condition is gone.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE.** Every rule in this repo was minted by a failure — positional integrity from the D-correct-at-3% finding, quote hygiene from two independent corruption incidents, the single-definition `roundTo` from two kinds resolving the same dose math differently, producer≠checker from a field reaching four files…
- L4 — carried (retained or compressed in target/rationale): The endgame is exactly when ceremony feels most expensive and the memory of *why* is thinnest, so the ratchet needs a procedure, not a mood: **to relax an invariant, name the incident it was minted from and argue that the condition which produced it no longer holds.** "This feels heavy now" is not that argument.
- L5 — carried (retained or compressed in target/rationale): A rule that no longer earns its keep is retired on the record, with its incident cited, and marked `SUPERSEDED` rather than deleted.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.34 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.34 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground ARCHIVE-ONLY; candidate —; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-EXECUTABLE-OWNER; candidate —; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.34 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-10 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.35 — P28#0 — P28 — Scored leaves govern planning, session units govern delivery

1. Locator and permanent identity
- Manifest record M4.35; target section target §4.
- Permanent identity/title: P28#0 / P28 — Scored leaves govern planning, session units govern delivery. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Content-planning reports measure what is scored: standalone top-level questions plus embedded
case-study questions, excluding case-study containers, with each embedded leaf contributing its own
category, topic, item type, and difficulty, and parent-case metadata never standing as evidence
about a leaf. Delivery and inventory reports measure what can be served, on the top-level
session-unit population, and their capacity warnings never change the content-planning denominator,
while visual inventory is a third, recursive artifact population rather than an alias for either
question denominator. A `case_study` is a delivery container and may not enter equal-average
scored-item-type targets unless a case-cadence target is separately ratified.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E033.
- Packet locator: packet §32; manifest M4.35 item 14; baseline E033 [42598,44464).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **28.
- L2 — carried (retained or compressed in target/rationale): Scored leaves govern content planning; session units govern delivery capacity and inventory.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE (ratified 2026-07-16).** Content-planning reports measure what is scored: standalone top-level questions plus embedded case-study questions, excluding case-study containers.
- L4 — carried (retained or compressed in target/rationale): Each embedded leaf contributes its own category, topic, item type, and difficulty; parent-case metadata is not evidence about the leaf.
- L5 — carried (retained or compressed in target/rationale): Category and topic distributions, difficulty and item-type distributions, target gaps, and generation prompt parameters therefore use only this scored-leaf population.
- L6 — carried (retained or compressed in target/rationale): `case_study` is a delivery container and cannot enter equal-average scored-item-type targets absent a separately ratified case-cadence target.
- L7 — carried (retained or compressed in target/rationale): Delivery and inventory reports measure what can be served: top-level session units, separated into standalone questions and case containers, with case lengths and embedded-part totals reported alongside them.
- L8 — carried (retained or compressed in target/rationale): Standalone draw capacity and weighted-session constructibility stay on that operational population and may emit clearly labelled capacity warnings; those warnings never change the content-planning denominator.
- L9 — carried (retained or compressed in target/rationale): Visual inventory is a third, recursive artifact population rather than an alias for either question denominator.
- L10 — carried (retained or compressed in target/rationale): Reason: the dual traversal introduced in PR #51 made both populations visible but did not establish which one governed planning, leaving competing target and prompt blocks that could direct generation from incompatible denominators.
- L11 — carried (retained or compressed in target/rationale): PR #52 makes the authority singular while retaining both legitimate analytical views.
- L12 — carried (retained or compressed in target/rationale): Executable owners: `lib/question-population.ts` (shared population and visual-artifact traversal), `scripts/census.ts` (canonical census shape and reconciliation), and `scripts/coverage-report.ts` (explicit call-site coverage views and the single scored-leaf planning output).
- Deleted source limb (finding): generation prompt parameters use only the scored-leaf population.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.35 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.35 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground ARCHIVE-ONLY; candidate —; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-SINGLE-OWNER; candidate `lib/question-population.ts`, `scripts/census.ts`, `scripts/coverage-report.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-16 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **FINDING** — FINDING: E033 expressly binds generation prompt parameters to the scored-leaf population. M4.35 names content-planning reports but omits that separate prompt-parameter limb; no repair is authorized.

### M4.36 — P29#0 — P29 — Sparse laboratory-presentation cardinality is not a validity floor

1. Locator and permanent identity
- Manifest record M4.36; target section target §4.
- Permanent identity/title: P29#0 / P29 — Sparse laboratory-presentation cardinality is not a validity floor. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
A one-series `lab_trend` and a one-row `structured_labs_panel` are valid when that is the clinically
appropriate amount of information. Series count and row count are not validity axes layered on top
of `P24` and `P25`, and no cardinality floor is adopted, because a universal second-series or
second-row floor would force clinically unnecessary filler. Any presentation change on this surface
requires its own measured proof-render commission under `P23`.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E034.
- Packet locator: packet §33; manifest M4.36 item 14; baseline E034 [44464,47377).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **29.
- L2 — carried (retained or compressed in target/rationale): Sparse laboratory-presentation cardinality is not a validity floor.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE (ratified 2026-07-18).** A one-series `lab_trend` and a one-row `structured_labs_panel` are valid when that is the clinically appropriate amount of information.
- L4 — carried (retained or compressed in target/rationale): Series count and row count are not validity axes layered on top of principles 24 and 25: a single-analyte trajectory still carries the pattern/direction affordance principle 25 waives redundancy for, and a single-row labs panel still supplements source prose exactly as principle 24 requires.
- L5 — carried (retained or compressed in target/rationale): A universal second-series/second-row floor would force clinically-unnecessary filler — forbidden by principle 7 (precision over volume) and the anti-ornament fence of 25 — so no cardinality floor is adopted.
- L6 — carried (retained or compressed in target/rationale): Adjudicated from the P4 single-row lab presentation survey (`Archive/root-cleanup-2026-07-19/SINGLE-ROW-LAB-PANELS-P4-SURVEY-SPEC-2026-07-18.md`; manifest `audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json`), mechanically complete and independently re-derived from the raw banks (24 object paths, popul…
- L7 — carried (retained or compressed in target/rationale): Framing on the record: the per-datum finding is **answer-referenced vs non-answer-referenced** (whether the value appears in a keyed response), not artifact-level load-bearing.
- L8 — carried (retained or compressed in target/rationale): Under the principle-25 collapse test all 13 panels are removable without changing answerability, because prose retains the value by design (principle 24); "non-answer-referenced" is therefore a legitimate, expected category on an additive surface (background, stability, anti-beacon context), not a defect.
- L9 — carried (retained or compressed in target/rationale): The nine non-answer-referenced structured rows open no remediation lane.
- L10 — carried (retained or compressed in target/rationale): Any presentation change would require its own measured proof-render commission under principle 23; none is authorized here.
- L11 — carried (retained or compressed in target/rationale): P4 is closed.
- L12 — carried (retained or compressed in target/rationale): This ruling authorizes no schema, bank-content, renderer, or runtime change.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.36 item-10 omission; no authorization/execution assertion is made..
- Not authorized: Any schema, bank-content, renderer, or runtime change on the laboratory-presentation surface..
- Evidence: `audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json` — Evidence test PASS: tracked path; field-specific test applied..
- Owner: OMIT — M6.3 ground NO-EXECUTABLE-OWNER; candidate —; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-18 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.37 — P30#0 — P30 — Lab reference bands are adult-only and pediatric bands fail closed

1. Locator and permanent identity
- Manifest record M4.37; target section target §4.
- Permanent identity/title: P30#0 / P30 — Lab reference bands are adult-only and pediatric bands fail closed. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Laboratory reference bands are source-verified adult-only, and pediatric reference bands are
intentionally absent because published pediatric intervals split by age, sex, and assay in ways the
current two-bucket population vocabulary cannot express safely. A pediatric series fails closed
rather than displaying a band, while a pediatric trajectory item stays valid with the band
disabled. Therapeutic-anticoagulation values that compute high against a healthy-population band
are intended behaviour rather than a defect to repair, and this entry closes range verification
only.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E035.
- Packet locator: packet §34; manifest M4.37 item 14; baseline E035 [47377,50753).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **30.
- L2 — carried (retained or compressed in target/rationale): Lab reference bands are source-verified adult-only; pediatric bands fail closed; the learner-visible H/L-flag feature remains unauthorized.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE (ratified 2026-07-19).** The 29-analyte × 3-population request is not safely expressible in the current peds_infant/peds_child vocabulary — published pediatric intervals split by age-in-days/weeks, by sex, and by assay, so a coarse two-bucket band would ship silent H/L errors.
- L4 — carried (retained or compressed in target/rationale): Resolved to source-verified adult teaching bands only, with pediatric reference bands intentionally absent.
- L5 — carried (retained or compressed in target/rationale): `ANALYTE_DEFS` (`src/visuals/kinds/lab_trend/defs.ts`) carries sourced adult bands plus warning-only sanity envelopes; per-analyte provenance ([S1]–[S20]) lives in `audit/lab-reference-range-verification-2026-07-19.md`.
- L6 — carried (retained or compressed in target/rationale): Pediatric fail-closed contract (validator, `src/visuals/kinds/lab_trend/index.ts`): `reference_band_unavailable` when a peds series leaves the band enabled; `self_check_flag_requires_reference_band` for peds H/L; `self_check_stable_requires_reference_band` for peds stable (its tolerance needs a band width).
- L7 — carried (retained or compressed in target/rationale): Peds up/down trajectory stays valid with `showReferenceBand:false`.
- L8 — carried (retained or compressed in target/rationale): Clinical ratifications (Luke, lab professional, final call): magnesium tightened to 1.7–2.3 mg/dL, a deliberate override of the sourced UIowa 1.5–2.9 as implausibly broad for serum Mg; glucose left at 65–139 mg/dL (random/general interval, facility-consistent — the Mayo 70–140 action-threshold framing is noted for the…
- L9 — carried (retained or compressed in target/rationale): Therapeutic-anticoagulation flagging is intended, not a defect: warfarin INR (2.0–3.0) and therapeutic aPTT/heparin sit above the healthy-population bands and correctly compute "H".
- L10 — carried (retained or compressed in target/rationale): Recorded so it is not later "repaired." Scope boundary: this closes range VERIFICATION, the documented prerequisite.
- L11 — carried (retained or compressed in target/rationale): It does NOT authorize the learner-visible H/L-flag / reference-range-column feature, which remains a separate, unauthorized decision.
- L12 — carried (retained or compressed in target/rationale): Renderer geometry moved (INR band 0.8–1.1 → 0.8–1.2, magnesium 1.5–2.9 → 1.7–2.3, and other analyte corrections), so the governed `lab_trend` promoted-visual parity baseline was rebaselined via `parity:rebaseline --scope lab_trend` (Luke-authorized 2026-07-19/20).
- L13 — carried (retained or compressed in target/rationale): Regression: `scripts/tests/lab-trend-reference-bands.ts`, wired into `test-visuals`.
- L14 — carried (retained or compressed in target/rationale): Producer≠checker: produced by GPT (connector, no shell), independently checked by the shell seat (receipt: `test:lab-reference-ranges`, `test:measurement-allowlist`, `validate-bank` ×13, `tsc`, `test-visuals` [green through every lab_trend-relevant step and the rebaselined parity survey; one unrelated pre-existing `ra…
- L15 — carried (retained or compressed in target/rationale): Architect conformance + citation spot-check (INR 0.8–1.2 confirmed verbatim at the UIowa 2023 source) 2026-07-19, magnesium override re-verified empty-diff against all 20 promoted `lab-canonical.json` items 2026-07-20.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.37 item-10 omission; no authorization/execution assertion is made..
- Not authorized: The learner-visible high-low flag and the reference-range column..
- Evidence: `audit/lab-reference-range-verification-2026-07-19.md` — Evidence test PASS: tracked path; field-specific test applied..
- Owner: OMIT — M6.3 ground NO-SINGLE-OWNER; candidate `src/visuals/kinds/lab_trend/defs.ts`, `src/visuals/kinds/lab_trend/index.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-19 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.38 — P31#0 — P31 — Gemini's standing restrictions

1. Locator and permanent identity
- Manifest record M4.38; target section target §4.
- Permanent identity/title: P31#0 / P31 — Gemini's standing restrictions. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Gemini is restricted to raw-volume generation and never makes direct canonical edits, which is
`P5`'s constitutional floor applied as named-model lane policy. It is demoted from every
content-judgment audit lane, because templated, non-pair-specific reconciliations required
independent re-research to trust where verbatim-evidenced lanes were self-verifying. If an
irreducible producer-clean residual ever forces a Gemini audit lane, any row whose reconciliation is
not pair-specific and does not quote the keyed English and Chinese rule routes to re-review rather
than being accepted as a dismissal.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E074.
- Packet locator: packet §37; manifest M4.38 item 14; baseline E074 [74491,75189).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **Gemini's standing restrictions (cross-references principles 3, 5, 8, 18, 22 above):** raw-volume generation only, never direct canonical edits (principle 5); flag-only review in the forward case lane, never compiler, never mutation (principle 8/18); demoted from every content-judgment audit lane (Jun 26 — templated,…
- L2 — carried (retained or compressed in target/rationale): If an irreducible producer-clean residual ever forces a Gemini audit lane, any row whose reconciliation is not pair-specific and does not quote the keyed rule (EN+ZH) is auto-rejected to re-review, never accepted as a dismissal.
- Deleted source limb (finding): forward-case review is flag-only, never compiler, never mutation.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.38 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.38 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NOT-A-PATH; candidate cross-references to legacy principles 3, 5, 8, 18, and 22; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-EXECUTABLE-OWNER; candidate —; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.38 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-26 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **FINDING** — FINDING: E074 expressly requires flag-only forward-case review and never compiler/never mutation. M4.38 retains raw-volume/direct-canonical and demotion language but omits those explicit restrictions; no repair is authorized.

Tranche B closure: 19 commissioned live records written and closed. Findings, if any, are recorded only; no correction was attempted.
