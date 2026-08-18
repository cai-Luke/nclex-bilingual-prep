# Stage 2a full constitutional review — tranche A

Read-only §5 full constitutional review deliverable. Review began only after the two pinned identities were freshly remeasured.

- Work order: DECISIONS-MIGRATION-STAGE-2A-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md — 32622 bytes; SHA-256 ba03de1bcf8058eea5062d0d67d838faa5d316038c9cd083c33b13f468ec39ac.
- Manifest: audit/decisions-migration-2026-07-29/target-text-manifest.md — 314491 bytes; SHA-256 9d3283086a93daa3e0925ff539f9d98d5914cc9955035f129f3178329804fe5a.
- Commissioned records: M4.2–M4.19 (18 live records).
- Branch: codex/decisions-migration; HEAD: 05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5.
- Review mode: source re-derivation only; no repair, no manifest edit, no resume/status/decision-file edit, and no Stage 2b tranche review.

Per-record format follows §5.8: locator/identity; source IDs and packet locator; enumerated source limbs; field-by-field disposition with separate Evidence/Owner tests; date check; verdict.

### M4.2 — P1#0 — P1 — Answer placement is owned by code

1. Locator and permanent identity
- Manifest record M4.2; target section target §4.
- Permanent identity/title: P1#0 / P1 — Answer placement is owned by code. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
A deterministic, item-ID-seeded shuffle applied at promotion owns option and answer placement; the
model never places or orders an answer. This governs positional bias across every item type, not only
multiple choice.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E001.
- Packet locator: packet §01; manifest M4.2 item 14; baseline E001 [7776,8570).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **1.
- L2 — carried (retained or compressed in target/rationale): Answer placement is owned by code, not the model.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE.** A deterministic, item-ID-seeded shuffle applied at the promotion step owns option/answer placement; the model never places or orders an answer.
- L4 — carried (retained or compressed in target/rationale): Forcing incident (the regression case any future positional-integrity tooling should still detect): an audit found the correct MCQ option landed in position D only ~3% of the time against a uniform 25% — LLMs are biased samplers that write the correct answer first and confabulate distractors around it, clustering corr…
- L5 — carried (retained or compressed in target/rationale): The same clustering affects select-all correct-option ordering, so this governs positional bias across every item type, not just MCQ.
- L6 — carried (retained or compressed in target/rationale): Owner: `lib/shuffle.ts` (FNV-1a seed + Fisher-Yates), applied by `scripts/promote.ts`.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.2 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.2 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground ARCHIVE-ONLY; candidate —; field-specific Evidence omission test passed..
- Owner: `lib/shuffle.ts` — Owner test PASS: tracked path; field-specific test applied..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-09 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.3 — P2#0 — P2 — Independent review is scoped to judgment

1. Locator and permanent identity
- Manifest record M4.3; target section target §4.
- Permanent identity/title: P2#0 / P2 — Independent review is scoped to judgment. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Independent review is required wherever correctness depends on semantic judgment, clinical
interpretation, provenance, or contract interpretation; purely mechanical work may self-certify against
deterministic checks that have an independent null. Every active generation lane declares its producer
provenance and its independent-review routing.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E002, E037.
- Packet locator: packet §02; manifest M4.3 item 14; baseline E002 [8570,9412).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **2.
- L2 — carried (retained or compressed in target/rationale): Independent review is scoped to judgment, mechanical work may self-certify.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE (narrowed 2026-07-14).** Independent review is required when correctness depends on semantic judgment, clinical interpretation, provenance, or contract interpretation.
- L4 — carried (retained or compressed in target/rationale): Purely mechanical work may be certified by deterministic checks and targeted smoke tests in the same implementation session, when those checks have an independent null and do not merely confirm the author's intent.
- L5 — carried (retained or compressed in target/rationale): Strict independent review stays required for: clinical judgments and answer keys; canonical generated content; migrations and dispositions; schema/data-contract interpretations; source-dependent claims.
- L6 — carried (retained or compressed in target/rationale): Not required for: exact file moves; generated censuses; deterministic formatting; one-line render ordering; and similarly mechanical, fully testable changes.
- L7 — carried E037 merge contribution: Every active generation lane declares producer provenance and independent-review routing (principle 2).
- Deleted source limb (finding): deterministic checks must not merely confirm the author's intent.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.3 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.3 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-CANDIDATE; candidate —; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-SINGLE-OWNER; candidate —; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.3 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-18 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **FINDING** — FINDING: E002's condition that deterministic checks must not merely confirm the author's intent is absent from the live subject. The omission widens the self-certification exception; no repair is authorized.

### M4.4 — P2#1 — #P2 — Application: spec conformance and content review stay split

1. Locator and permanent identity
- Manifest record M4.4; target section target §4.
- Permanent identity/title: P2#1 / #P2 — Application: spec conformance and content review stay split. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
When one seat authors a remediation spec and another implements it, the authoring seat cannot certify
the implementation and a seat blind to the spec cannot certify it either. Content review therefore goes
to the gate seat, which re-derives each disposition from source and standing rules, while
spec-conformance verification stays with the architect who wrote the spec.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E003.
- Packet locator: packet §03; manifest M4.4 item 14; baseline E003 [9412,10344).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): Kept — the spec-conformance/content-review split (2026-07-09 extension): when Claude authors a remediation spec and Codex implements it, Claude cannot certify the implementation (matching the spec is not evidence of being correct), but a seat blind to the spec cannot certify it either (it has no null to fail against).
- L2 — carried (retained or compressed in target/rationale): The two checks stay split — content review goes to the gate seat, which re-derives each disposition from source and standing rules; spec-conformance verification stays with the architect who wrote the spec.
- L3 — carried (retained or compressed in target/rationale): Forcing incident (kept, compact): a `>150 seconds` aPTT in a staged candidate passed schema validation, the flowsheet gate, the applicator dry-run, and a 100% checker-seat content adjudication, because the defect lived in `parseMeasurementValue`'s comparator-strip *code* — the artifact-checking seat had no reason to r…
- L4 — carried (retained or compressed in target/rationale): Full narrowing rationale and the original absolute wording: archive.
- Source semantic limbs retained; the finding is confined to the M6.3 Owner-field adjudication.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.4 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.4 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground ARCHIVE-ONLY; candidate —; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground ARCHIVE-ONLY; candidate —; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.4 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-09 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **FINDING** — FINDING: the reserved M4.4 item-10 Owner note uses “same reason” to inherit the ARCHIVE-ONLY Evidence ground, but Owner is governed independently by M6.1/M6.3 and the whole-statement ownership test. The live Owner disposition is OMIT, yet the independent Owner ground is not stated; this is a defect, not a reservation.

M4.4/P2#1 required special adjudication
- Live item-10 Evidence disposition (verbatim):
~~~text
Evidence — OMIT; the narrowing rationale and the forcing incident are archived and no single tracked file carries them.
~~~
- Live item-10 Owner disposition (verbatim):
~~~text
Owner — OMIT; same reason.
~~~
- Actual Owner anaphor antecedent: “the narrowing rationale and the forcing incident are archived and no single tracked file carries them.” Under M6.1/M6.3 the antecedent is ARCHIVE-ONLY, ground both, not Evidence-only or Owner-only.
- Independent Owner adjudication: no single tracked path owns the whole governance/review-routing statement under M6.3's whole-statement test; correct Owner result is OMIT, but the live note does not state that independent Owner ground. DEFECT/FINDING; never still reserved.

### M4.5 — P3#0 — P3 — Deterministic core, capped semantic residual

1. Locator and permanent identity
- Manifest record M4.5; target section target §4.
- Permanent identity/title: P3#0 / P3 — Deterministic core, capped semantic residual. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Counting, distributions, permutation integrity, and template repetition have known nulls and belong in
scripts that return identical verdicts every run. Model judgment is reserved for the irreducible
semantic residual, run only on items the deterministic layer flags and capped per batch. No API key or
live model call belongs in the repository; semantic findings enter through an offline validated handoff.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E004.
- Packet locator: packet §04; manifest M4.5 item 14; baseline E004 [10344,11231).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **3.
- L2 — carried (retained or compressed in target/rationale): Deterministic core; LLM only for the capped semantic residual.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE.** Counting, distributions, permutation integrity, and template repetition all have known nulls and belong in scripts that return identical verdicts every run.
- L4 — carried (retained or compressed in target/rationale): Reserve model judgment for what genuinely needs semantics (clinical inferability, distractor plausibility), run it only on items the deterministic layer flags, and cap the batch — this keeps verdicts reproducible and token spend bounded.
- L5 — carried (retained or compressed in target/rationale): Applied: the non-MCQ bias audit is an offline handoff, not a live integration — the repo emits a deterministic queue/prompt, validates returned JSONL, and merges semantic findings without letting them modify Layer A; no API key or live model call belongs in the repository.
- L6 — carried (retained or compressed in target/rationale): A completed one-time proposal-only in-harness adjudication exception and the topic-licensing rulings it produced are archived.
- Deleted source limb (finding): the offline handoff merges findings without letting them modify Layer A.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.5 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.5 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NOT-AN-AUTHORITY; candidate `scripts/audit/audit-non-mcq-bias.ts`, `scripts/audit/non-mcq-bias-layer-b.ts`; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-SINGLE-OWNER; candidate `scripts/audit/audit-non-mcq-bias.ts`, `scripts/audit/non-mcq-bias-layer-b.ts`; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.5 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-12 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **FINDING** — FINDING: E004's explicit prohibition that the offline semantic handoff must not modify Layer A is absent from the live subject. The target retains the offline/no-live-call boundary but drops a core non-mutation safeguard; no repair is authorized.

### M4.6 — P4#0 — P4 — Rationales are position-agnostic and bilingual

1. Locator and permanent identity
- Manifest record M4.6; target section target §4.
- Permanent identity/title: P4#0 / P4 — Rationales are position-agnostic and bilingual. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
A rationale references option content, never a letter or an ordinal or spatial position. A rationale
that names no position cannot carry a stale answer-key reference after a shuffle, in either English or
Simplified Chinese.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E005.
- Packet locator: packet §05; manifest M4.6 item 14; baseline E005 [11231,11639).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **4.
- L2 — carried (retained or compressed in target/rationale): Rationales are position-agnostic — bilingual.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE.** A rationale references option *content* ("furosemide is contraindicated because…"), never a letter or ordinal/spatial position ("Option D", "the first choice").
- L4 — carried (retained or compressed in target/rationale): A rationale that never names a position cannot carry a stale answer-key reference after a shuffle, in either English or Simplified Chinese (选项A, 第一个, 以上 …).
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.6 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.6 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — explicit M4.6 item-10 omission; no candidate row is required..
- Owner: OMIT — M6.3 ground NO-EXECUTABLE-OWNER; candidate —; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.6 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-09 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.7 — P5#0 — P5 — Generated is not reviewed

1. Locator and permanent identity
- Manifest record M4.7; target section target §4.
- Permanent identity/title: P5#0 / P5 — Generated is not reviewed. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
No model-generated learner-facing clinical content becomes canonical without independent content review
and the promotion pipeline. The generating lane never reviews its own batch and cannot certify its own
output for canonical promotion; every active generation lane declares its producer provenance and its
independent-review routing.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E006, E037.
- Packet locator: packet §06; manifest M4.7 item 14; baseline E006 [11639,12062).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **5.
- L2 — carried (retained or compressed in target/rationale): Generated ≠ reviewed.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE (narrowed 2026-07-14).** No model-generated learner-facing clinical content becomes canonical without independent content review and the promotion pipeline.
- L4 — carried (retained or compressed in target/rationale): Raw model output stages in `banks/banks-raw/`, passes validation + audit + source-check, then promotes to a canonical `banks/*.json` with a `BANK-REVIEW-LEDGER.md` entry; the generating model never reviews its own batch.
- L5 — carried E037 merge contribution: Every active generation lane declares producer provenance and independent-review routing (principle 2).
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.7 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.7 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NOT-AN-AUTHORITY; candidate `BANK-REVIEW-LEDGER.md`; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NOT-AN-AUTHORITY, PARTIAL-OWNERSHIP; candidate `BANK-REVIEW-LEDGER.md`; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.7 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-18 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.8 — P5#1 — #P5 — Narrowing: named-model restrictions are lane policy

1. Locator and permanent identity
- Manifest record M4.8; target section target §4.
- Permanent identity/title: P5#1 / #P5 — Narrowing: named-model restrictions are lane policy. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Named-model restrictions are current lane policy, not the universal definition of
generated-versus-reviewed content. This attachment states the constitutional floor beneath them; the
standing named-model restrictions themselves are carried by P31.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E007.
- Packet locator: packet §07; manifest M4.8 item 14; baseline E007 [12062,12410).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): Narrowing note: named-model restrictions (Gemini is raw-volume only, small batches, never direct canonical edits, and is demoted from any audit/judgment role — see §8) are current lane policy, not the universal definition of generated-vs-reviewed.
- L2 — carried (retained or compressed in target/rationale): They remain active as lane policy; this principle states the constitutional floor beneath them.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: AUTHORIZING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.8 item-10 omission; no authorization/execution assertion is made..
- Not authorized: Treating named-model lane policy as the universal definition of generated versus reviewed content..
- Evidence: OMIT — M6.3 ground NOT-A-PATH; candidate the `P31` cross-reference; field-specific Evidence omission test passed..
- Owner: OMIT — explicit M4.8 item-10 omission; no candidate row is required..
- Execution: OMIT — explicit M4.8 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-26 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.9 — P6#0 — P6 — Visuals are deterministic, curated imagery has a separate lane

1. Locator and permanent identity
- Manifest record M4.9; target section target §4.
- Permanent identity/title: P6#0 / P6 — Visuals are deterministic, curated imagery has a separate lane. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Deterministic, data-derived visuals are the default for diagrammatic and numeric clinical cues;
AI-generated medical imagery is prohibited, and each renderer ships `selfCheck` cross-consistency
assertions and registry conformance tests. Curated licensed clinical imagery may enter only through a
separate provenance, licensing, accessibility, and clinical-review lane. Every question-level stimulus
remains load-bearing: a visual whose removal leaves the answer unchanged is decorative and invalid.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E008.
- Packet locator: packet §08; manifest M4.9 item 14; baseline E008 [12410,13512).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **6.
- L2 — carried (retained or compressed in target/rationale): Visuals are deterministic and data-derived; curated licensed imagery has a separate lane.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE (narrowed 2026-07-14 — resolves a direct conflict with `AGENTS.md`).** Deterministic, data-derived visuals are the default for diagrammatic and numeric clinical cues.
- L4 — carried (retained or compressed in target/rationale): AI-generated medical imagery is prohibited.
- L5 — carried (retained or compressed in target/rationale): Curated licensed clinical imagery may enter only through a separate provenance, licensing, accessibility, and clinical-review lane.
- L6 — carried (retained or compressed in target/rationale): Every question-level stimulus remains load-bearing: a visual whose removal leaves the answer unchanged is decorative and therefore invalid.
- L7 — carried (retained or compressed in target/rationale): Each renderer ships `selfCheck` cross-consistency assertions and registry conformance tests.
- L8 — carried (retained or compressed in target/rationale): The prior wording ("no raster assets, no external images... ever") directly conflicted with `AGENTS.md`'s existing "a visual must be deterministic data-derived **or a curated licensed image**" allowance.
- L9 — carried (retained or compressed in target/rationale): No curated-image lane exists in code today — the `QuestionVisual` kind union is entirely deterministic renderers — so this principle states the permitted policy, not a claim that the lane is implemented.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.9 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.9 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate `AGENTS.md`; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NOT-A-PATH; candidate per-kind `selfCheck`; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.9 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-14 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.10 — P7#0 — P7 — Precision over volume

1. Locator and permanent identity
- Manifest record M4.10; target section target §4.
- Permanent identity/title: P7#0 / P7 — Precision over volume. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
In any audit, five fully-evidenced findings beat thirty probable ones. Verbatim evidence, an honest
reconciliation attempt, and explicit confidence and dismissal discipline are the standard.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E009.
- Packet locator: packet §09; manifest M4.10 item 14; baseline E009 [13512,13744).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **7.
- L2 — carried (retained or compressed in target/rationale): Precision over volume.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE.** In any audit, five fully-evidenced findings beat thirty probable ones.
- L4 — carried (retained or compressed in target/rationale): Verbatim evidence, an honest reconciliation attempt, and explicit confidence/dismiss discipline are the standard.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: ADVISORY — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.10 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.10 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — explicit M4.10 item-10 omission; no candidate row is required..
- Owner: OMIT — M6.3 ground NO-EXECUTABLE-OWNER; candidate —; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.10 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-09 is the corrected P7 effective date from the ratified P7 date-correction file.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.11 — P8#0 — P8 — Clinical truth is authored upstream and read-only downstream

1. Locator and permanent identity
- Manifest record M4.11; target section target §4.
- Permanent identity/title: P8#0 / P8 — Clinical truth is authored upstream and read-only downstream. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Clinical truth and answer logic have an explicit upstream owner, and every downstream transformation
may read them but never silently invent or alter them. A downstream stage translates and shapes content
into schema without deciding which action is correct and without introducing clinical claims absent
from the authored source. A decision point too underspecified to yield an unambiguous item is dropped,
not guessed.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E039a, E037.
- Packet locator: manifest archive/source-span record; manifest M4.11 item 14; baseline E039a [53204,53661).

3. Enumerated source-limb disposition
- L1 — source entry E039a is recorded by the manifest source-span review; its source prose is carried into the reviewed surface.
- L2 — carried E037 merge contribution: Clinical truth and answer logic have an explicit upstream owner; every downstream transformation (translation, schema compilation, formatting) may read but never silently invent or change them.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.11 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.11 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground ARCHIVE-ONLY; candidate —; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-SINGLE-OWNER; candidate —; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.11 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-24 is the corrected P8 effective date from the GPT date-provenance review.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.12 — P10#0 — P10 — Study sessions mirror the exam distribution

1. Locator and permanent identity
- Manifest record M4.12; target section target §4.
- Permanent identity/title: P10#0 / P10 — Study sessions mirror the exam distribution. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Default Study sampling follows NCLEX category weighting and guards against narrow-topic clustering,
while strict exam simulation is a separate product mode. Case studies are excluded from the weighted
draw, mirroring the exam's fixed, separately counted case-study allotment. Difficulty adaptivity is a
deliberately separate, deferred axis.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E010.
- Packet locator: packet §10; manifest M4.12 item 14; baseline E010 [13744,14789).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **10.
- L2 — carried (retained or compressed in target/rationale): Study sessions mirror the exam's content distribution; difficulty is exam-sim-only.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE (narrowed 2026-07-14).** Default Study sampling follows NCLEX category weighting and guards against narrow-topic clustering.
- L4 — carried (retained or compressed in target/rationale): Strict exam simulation is a separate product mode.
- L5 — carried (retained or compressed in target/rationale): Case studies are excluded from the weighted draw, mirroring the real exam's fixed, separately-counted case-study allotment.
- L6 — carried (retained or compressed in target/rationale): Difficulty adaptivity is deliberately a separate, deferred axis — see the parked `test`/`adaptive` modes in §6.
- L7 — carried (retained or compressed in target/rationale): Moved to code — verify there, not here: the category weight table is `NCLEX_CATEGORY_WEIGHTS` in `src/schema.ts`; the exact session count, floor threshold, priority visual allowlist, and diversity-penalty constants are `src/sessionSampler.ts`'s `DEFAULT_FLOOR_KIND_PRIORITY` / `floorThreshold` / `alpha` / `beta`.
- L8 — carried (retained or compressed in target/rationale): Full prior narrative (weight table restated in prose, sampler-rule paragraph, calibration history) archived — restating it here would be exactly the duplicated-definition risk principle 27(d) warns about.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.12 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.12 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NOT-AN-AUTHORITY; candidate `src/schema.ts`, `src/sessionSampler.ts`; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-SINGLE-OWNER; candidate `src/schema.ts`, `src/sessionSampler.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-14 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.13 — P11#0 — P11 — Visual arithmetic is a machine-checked gate carrying no engine

1. Locator and permanent identity
- Manifest record M4.13; target section target §4.
- Permanent identity/title: P11#0 / P11 — Visual arithmetic is a machine-checked gate carrying no engine. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
For every visual kind whose answer turns on a computed value, the load-bearing numbers are typed on the
visual spec and `selfCheck` recomputes the answer from spec and audit metadata, asserting exact
equality after any declared rounding. A mismatch is a build failure, not a content note. Each kind
exposes an enumerated set of one-line, same-unit derivations, and no unit-conversion or dosage engine is
authorized.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E011.
- Packet locator: packet §11; manifest M4.13 item 14; baseline E011 [14789,15922).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **11.
- L2 — carried (retained or compressed in target/rationale): Visual arithmetic is a machine-checked gate, not a trusted assertion — and it carries no engine.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE.** For every visual kind whose answer turns on a computed value (`io_record` totals/balance, `medication_label` dose/volume/rate, `device_screen` pump math, `burn_map` %TBSA/Parkland), the load-bearing numbers are typed on the visual spec, the question's inputs and keyed answer live in audit-only `meta`…
- L4 — carried (retained or compressed in target/rationale): A mismatch is a *build failure*, not a content note.
- L5 — carried (retained or compressed in target/rationale): The recompute is deliberately small — each kind exposes an *enumerated* set of one-line, same-unit derivations.
- L6 — carried (retained or compressed in target/rationale): We do not parse free-text doses or build a unit-conversion/dosage engine; a derivation needing cross-unit conversion (mg↔mcg, mg/kg, mcg/kg/min, body-weight dosing) is out of scope for that kind, not a reason to grow the engine.
- L7 — carried (retained or compressed in target/rationale): This is principle 3 (deterministic core) and principle 6 (visuals necessary) made concrete for the chart/label/screen tier; human review still owns clinical validity.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.13 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.13 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — explicit M4.13 item-10 omission; no candidate row is required..
- Owner: OMIT — M6.3 ground NOT-A-PATH; candidate per-kind `selfCheck`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-12 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.14 — P15#0 — P15 — Bank patches are raw-scoped and declarative

1. Locator and permanent identity
- Manifest record M4.14; target section target §4.
- Permanent identity/title: P15#0 / P15 — Bank patches are raw-scoped and declarative. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Bank patches write only under the raw bank directory, and canonical files are read-only except through
an explicit in-place mode that forces a ledger entry. Patch operations are declarative and
precondition-checked, and no arbitrary-mutate primitive exists, because mechanical fixes belong in
patches and semantic fixes belong in review.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E012.
- Packet locator: packet §12; manifest M4.14 item 14; baseline E012 [15922,16386).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **15.
- L2 — carried (retained or compressed in target/rationale): Bank patches are raw-scoped and declarative.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE.** `scripts/patch-raw.ts` writes only under `banks/banks-raw/`.
- L4 — carried (retained or compressed in target/rationale): Canonical files are read-only except via the explicit `--allow-canonical --reason` in-place mode, which forces a ledger entry.
- L5 — carried (retained or compressed in target/rationale): Patch ops are declarative (`before`→`after`, precondition-checked) — there is deliberately no arbitrary-mutate primitive, because mechanical fixes belong in patches and semantic fixes belong in review.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.14 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.14 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate —; field-specific Evidence omission test passed..
- Owner: `scripts/patch-raw.ts` — Owner test PASS: tracked path; field-specific test applied..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-10 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.15 — P15#1 — #P15 — Application: a declarative op names a field path, not a record

1. Locator and permanent identity
- Manifest record M4.15; target section target §4.
- Permanent identity/title: P15#1 / #P15 — Application: a declarative op names a field path, not a record. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
A declarative operation identifies the exact field path it mutates together with the before and after
values for that path. A record-scoped string replacement is not declarative even when it declares a
before and an after, because it rewrites every occurrence in the record, including fields the operation
never named. Under P26 a patch must independently prove every learner-facing and scoring field outside
its authorized mutation surface unchanged.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E013.
- Packet locator: packet §13; manifest M4.15 item 14; baseline E013 [16386,18274).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **Application — a declarative op names a field path, not a record (2026-07-22).** "Declarative" means the op identifies the exact field path it mutates together with the `before`→`after` values *for that path*.
- L2 — carried (retained or compressed in target/rationale): A record-scoped string replacement is not a declarative op even when it declares a before and an after: it rewrites every occurrence in the record, including fields the op never named.
- L3 — carried (retained or compressed in target/rationale): *Forcing evidence.* Across the terminal-sentence remediation manifest, seven `dropdown_cloze` items carry the flagged stem text a second time inside `clozeStem` — the functional response surface.
- L4 — carried (retained or compressed in target/rationale): On one of them the collision is language-asymmetric: the English anchor is unique in the record because `clozeStem.en` differs by a single article, while the Chinese anchor collides because `clozeStem.zh` is identical to the stem terminal.
- L5 — carried (retained or compressed in target/rationale): No uniform record-level rule is safe, and a serialize-and-replace implementation would have destroyed the response surface on those rows while reporting success.
- L6 — carried (retained or compressed in target/rationale): Under principle 26 the preserved-surface proof is the independently enforced precondition: a patch must independently prove every learner-facing and scoring field outside its authorized mutation surface unchanged, enforced by something other than the op's own declaration.
- L7 — carried (retained or compressed in target/rationale): For the terminal-sentence dropdown repairs that preserved surface was `clozeStem`, dropdown bindings, options, and keys; the surface is named per work unit, since a different authorized repair may legitimately mutate a stem together with a related field, and most item types do not carry those particular surfaces at al…
- L8 — carried (retained or compressed in target/rationale): Moved to code — verify there, not here: the field-path mechanism is the `path` segment array in `scripts/patch-raw.ts`, including its `{ id }` / `{ refId }` selectors, which are the only means of addressing an embedded record since op identity resolves against top-level questions alone.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.15 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.15 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground ARCHIVE-ONLY; candidate —; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground PARTIAL-OWNERSHIP; candidate `scripts/patch-raw.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-22 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.16 — P16#0 — P16 — Answer-pattern bias is presentation-first

1. Locator and permanent identity
- Manifest record M4.16; target section target §4.
- Permanent identity/title: P16#0 / P16 — Answer-pattern bias is presentation-first. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Positional tells carry no clinical meaning and are repaired mechanically by a deterministic, ID-seeded
permutation. Distributional tells are properties of item content, cannot be shuffled away, and clear
only through deliberate authoring or a targeted regeneration pass, never by hand-editing answer logic in
reviewed canonical items. Incidental dilution from ordinary new content is acceptable but is not
remediation.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E014.
- Packet locator: packet §14; manifest M4.16 item 14; baseline E014 [18274,19722).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **16.
- L2 — carried (retained or compressed in target/rationale): Answer-pattern bias is presentation-layer first, content-layer only where shuffling can't reach.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE (narrowed 2026-07-14 — corrects a prior self-contradiction; amended 2026-07-15 — see the population amendment below).** *Positional* tells (option order, dropdown index, matrix column, ordered-response scramble depth) carry no clinical meaning and are repaired mechanically by a deterministic, ID-seeded…
- L4 — carried (retained or compressed in target/rationale): *Distributional* tells (SATA correct-count concentration, ordered-response template repetition) are properties of the item content itself and cannot be shuffled away — they are repaired only through future authoring or a deliberate targeted replacement/regeneration pass, never by hand-editing answer logic in reviewed…
- L5 — carried (retained or compressed in target/rationale): Incidental dilution from ordinary new content is acceptable but is **not** considered remediation: genuine distributional debt is frozen, not self-healing, and clears only through a deliberate targeted regeneration decision. (This sentence formerly cited "the standing global distributional FAILs" as that debt.
- L6 — carried (retained or compressed in target/rationale): They were not — see the 2026-07-15 amendment below.) The audit's `fix_class` encodes exactly this fork: `SHUFFLE_AT_PROMOTION` is mechanical and automatable; `REGENERATE` is a non-blocking content-design backlog item.
- L7 — carried (retained or compressed in target/rationale): Live constants are named once, in the amendment below; verify them against `scripts/audit/non-mcq-bias-lib.ts`, never against this file.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.16 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.16 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — explicit M4.16 item-10 omission; no candidate row is required..
- Owner: OMIT — M6.3 ground CARRIED-ELSEWHERE; candidate `scripts/audit/non-mcq-bias-lib.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-14 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.17 — P16#1 — #P16 — Amendment: a canonical file is not a learner-visible population

1. Locator and permanent identity
- Manifest record M4.17; target section target §4.
- Permanent identity/title: P16#1 / #P16 — Amendment: a canonical file is not a learner-visible population. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Distributional checks measure concentration in the population a learner actually draws from, so a
canonical bank file is an authoring-provenance boundary rather than a population. A global
distributional verdict stands on its own statistic and does not inherit a per-file failure; per-file
distributional verdicts remain authoring-hygiene advisories only, while positional and mechanical
checks continue to inherit. A distributional verdict below its
minimum-observation floor reports as insufficient rather than as a failure.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E015.
- Packet locator: packet §15; manifest M4.17 item 14; baseline E015 [19722,22368).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **Amendment to 16 (2026-07-15) — a canonical file is not a learner-visible population.** Distributional checks measure concentration in the population the learner actually draws from: the bundled bank.
- L2 — carried (retained or compressed in target/rationale): A canonical `banks/*.json` is an authoring-provenance boundary, not a population — no learner draws from `lab-canonical`.
- L3 — carried (retained or compressed in target/rationale): Two consequences, ratified against the PR #48 evidence base.
- L4 — carried (retained or compressed in target/rationale): First, a global distributional verdict stands on its own statistic and does not inherit a per-file failure; per-file distributional verdicts are retained as authoring-hygiene advisories only.
- L5 — carried (retained or compressed in target/rationale): Positional and mechanical checks continue to inherit, because a positional tell in any file is a real tell in the bundled corpus regardless of which file carries it.
- L6 — carried (retained or compressed in target/rationale): Second, a distributional verdict requires enough observations to mean anything: `sata_count_min_n` and a minimum n derived from `template_repeat_max_share` gate both checks to `INSUFFICIENT` below the floor.
- L7 — carried (retained or compressed in target/rationale): The prior `sata_missing_count_fails` rule is removed outright — it conflated bin *coverage* with *bias*, and failed every non-empty SATA bank in the live corpus because every bank lacked at least one demanded bin, including banks with no meaningful concentration.
- L8 — carried (retained or compressed in target/rationale): Bin coverage remains reported as a diagnostic and is not audit debt.
- L9 — carried (retained or compressed in target/rationale): This is a correction, not a softening under principle 27: no forcing incident is recorded in the active governance or archived audit-design materials reviewed.
- L10 — carried (retained or compressed in target/rationale): The missing-bin failure rule and absent minimum-n gates entered audit v2.0 as design-time defaults rather than recorded responses to an observed failure.
- L11 — carried (retained or compressed in target/rationale): The evidence that retired them is that they produced no true positives — every FAIL they generated was an arithmetic floor, a file boundary, or a missing bin, and the one surviving real signal (`visual-canonical` SATA, n=11 at 0.909) is found by the concentration threshold alone.
- L12 — carried (retained or compressed in target/rationale): Principle 16's core is unchanged and unrelaxed: distributional tells are still content properties, still unshufflable, still clear only through deliberate authoring or targeted regeneration, and incidental dilution is still not remediation.
- L13 — carried (retained or compressed in target/rationale): Live constants (verify against `scripts/audit/non-mcq-bias-lib.ts`, not here): `audit_version 2.1.0`, `max_cell_deviation_pp: 8`, `sata_count_degeneracy: 0.70`, `sata_count_min_n: 8`, `scramble_min_n: 8`, `template_repeat_max_share: 0.15`.
- L14 — carried (retained or compressed in target/rationale): The ordered-response template minimum is derived from the share limit, not stored.
- L15 — carried (retained or compressed in target/rationale): `scramble_min_n` and `sata_count_min_n` are independent knobs that currently coincide at 8; they are not interchangeable, and collapsing them would couple two rules that must move separately.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.17 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.17 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground ARCHIVE-ONLY; candidate —; field-specific Evidence omission test passed..
- Owner: `scripts/audit/non-mcq-bias-lib.ts` — Owner test PASS: tracked path; field-specific test applied..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-15 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.18 — P16#2 — #P16 — Standing authoring note on surviving distributional signal

1. Locator and permanent identity
- Manifest record M4.18; target section target §4.
- Permanent identity/title: P16#2 / #P16 — Standing authoring note on surviving distributional signal. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
The surviving `visual-canonical` SATA distributional signal is addressed by varying correct counts
where clinical truth naturally permits. This is not retire-and-replace: necessity-gated visual items
are not retired merely to move a histogram.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E016.
- Packet locator: packet §16; manifest M4.18 item 14; baseline E016 [22368,22670).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **Standing authoring note (non-blocking):** `visual-canonical` SATA is the sole surviving distributional signal.
- L2 — carried (retained or compressed in target/rationale): Vary correct counts where clinical truth naturally permits.
- L3 — carried (retained or compressed in target/rationale): This is not retire-and-replace — retiring necessity-gated visual items to move a histogram would violate principles 6 and 25.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: ADVISORY — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.18 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.18 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NOT-AN-AUTHORITY; candidate the `visual-canonical` bank data file; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NOT-AN-AUTHORITY; candidate the `visual-canonical` bank data file; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.18 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-15 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.19 — P17#0 — P17 — Scoring is polytomous, retention is full-marks

1. Locator and permanent identity
- Manifest record M4.19; target section target §4.
- Permanent identity/title: P17#0 / P17 — Scoring is polytomous, retention is full-marks. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Grading returns an earned-and-possible score per NGN family. Partial credit feeds the session score and
per-item feedback only, and spaced repetition resurfaces any item scored below full marks.
Threshold-based retention, graded ease from partial scores, rationale/dyad scoring, and
ordered-response partial credit are out of scope.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E017.
- Packet locator: packet §17; manifest M4.19 item 14; baseline E017 [22670,23124).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **17.
- L2 — carried (retained or compressed in target/rationale): Scoring is exam-style polytomous; retention is full-marks.
- L3 — carried (retained or compressed in target/rationale): Status: ACTIVE.** Grading returns `ItemScore { earned, possible }` per the NGN families.
- L4 — carried (retained or compressed in target/rationale): Partial credit feeds the session score and per-item feedback only; spaced repetition resurfaces any item below full marks (`earned === possible`).
- L5 — carried (retained or compressed in target/rationale): Explicitly out of scope: threshold-based retention, graded-SRS ease from partial scores, rationale/dyad scoring, and `ordered_response` partial credit.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: P — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.19 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.19 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — explicit M4.19 item-10 omission; no candidate row is required..
- Owner: OMIT — M6.3 ground PARTIAL-OWNERSHIP; candidate `src/grading.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-14 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

Tranche A closure: 18 commissioned live records written and closed. Findings, if any, are recorded only; no correction was attempted.
