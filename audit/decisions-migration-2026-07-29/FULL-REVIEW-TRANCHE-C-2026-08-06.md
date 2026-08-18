# Stage 2a full constitutional review — tranche C

Read-only §5 full constitutional review deliverable. Review began only after the two pinned identities were freshly remeasured.

- Work order: DECISIONS-MIGRATION-STAGE-2A-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md — 32622 bytes; SHA-256 ba03de1bcf8058eea5062d0d67d838faa5d316038c9cd083c33b13f468ec39ac.
- Manifest: audit/decisions-migration-2026-07-29/target-text-manifest.md — 314491 bytes; SHA-256 9d3283086a93daa3e0925ff539f9d98d5914cc9955035f129f3178329804fe5a.
- Commissioned records: M4.39–M4.56 (18 live records).
- Branch: codex/decisions-migration; HEAD: 05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5.
- Review mode: source re-derivation only; no repair, no manifest edit, no resume/status/decision-file edit, and no Stage 2b tranche review.

Per-record format follows §5.8: locator/identity; source IDs and packet locator; enumerated source limbs; field-by-field disposition with separate Evidence/Owner tests; date check; verdict.

### M4.39 — R1#0 — R1 — Standalone bowtie may be generated directly

1. Locator and permanent identity
- Manifest record M4.39; target section target §5.
- Permanent identity/title: R1#0 / R1 — Standalone bowtie may be generated directly. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
A standalone bowtie may be generated directly rather than only harvested from a case skeleton, because
bowtie is standalone-only by construction regardless of origin. A direct generation lane runs through
the normal raw, cross-model review, promote, and ledger pipeline on equal footing with every other item
type, under the same semantic floor as the case-embedded synthesis zones. This relaxes neither
producer-versus-checker discipline nor the case-embedded compiler's obligations for bowties that do
arise inside a skeleton.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E070.
- Packet locator: packet §41; manifest M4.39 item 14; baseline E070 [71397,72065).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - **Standalone bowtie may be generated directly, not only harvested from a case skeleton (2026-07-02).** The case-origination requirement was mis-scoped: it protected the compiler from inventing the differential/irrelevant-parameter pools, but bowtie is standalone-only by construction regardless of origin.
- L2 — carried (retained or compressed in target/rationale): A direct standalone-bowtie generation lane runs through the normal raw→cross-model review→promote→ledger pipeline on equal footing with every other item type, under the same semantic floor as the case-embedded synthesis zones.
- L3 — carried (retained or compressed in target/rationale): This does not relax producer≠checker or the case-embedded compiler's discipline for bowties that do arise inside a skeleton.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: R — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: AUTHORIZING — re-derived against frozen classification; PASS.
- Authorized: Direct standalone-bowtie generation through the normal promotion pipeline..
- Not authorized: OMIT — explicit M4.39 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE, ARCHIVE-ONLY; candidate —; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-SINGLE-OWNER; candidate —; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-02 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.40 — R2#0 — R2 — CBC units are conventional-first with SI in parentheses

1. Locator and permanent identity
- Manifest record M4.40; target section target §5.
- Permanent identity/title: R2#0 / R2 — CBC units are conventional-first with SI in parentheses. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Laboratory unit policy is analyte-aware: each analyte carries its own conventional forms, keyed by
analyte and source unit in one sourced conversion table, never by unit token alone. Accepted source
units stay permissive and extraction preserves the source unit byte-exactly, while display is a
separate policy layer offering a conventional primary with an optional SI parenthetical, consumed by
both the laboratory-trend and structured-measurement surfaces. One sourced conversion table serves the
sanity gate, parenthetical generation, and prose normalization.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E049.
- Packet locator: packet §40; manifest M4.40 item 14; baseline E049 [62908,64005).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): *Amendment (2026-07-05) — refined to conventional-first + SI-in-parentheses, analyte-aware.* Dogfooding showed "never SI" was too rigid in two ways: conventional reporting is itself multi-form (magnesium/calcium legitimately carry `mEq/L`, not just `mg/dL`, as a real US form — not SI), and some SI-looking units (lacta…
- L2 — carried (retained or compressed in target/rationale): The governing rule is **analyte-aware**: each analyte has its own conventional form(s), keyed by (analyte, sourceUnit) in one sourced conversion table, never by unit token alone.
- L3 — carried (retained or compressed in target/rationale): Consequences: accepted *source* units became permissive again (extraction preserves byte-exact `sourceUnit`, including SI `×10⁹/L` where source states it, per Rule C in the extraction contract); display became a separate policy layer (conventional-primary, optional SI-paren) consumed by both `lab_trend` and `structure…
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: R — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.40 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.40 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground CLAUSE-SCOPED; candidate `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md`; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground PARTIAL-OWNERSHIP; candidate `src/measurementUnitPolicy.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-05 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.41 — R3#0 — R3 — Temperature sanity ceiling 46.5 °C

1. Locator and permanent identity
- Manifest record M4.41; target section target §5.
- Permanent identity/title: R3#0 / R3 — Temperature sanity ceiling 46.5 °C. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Vital `sanity` bounds are inherited renderer validation envelopes, not authored
physiologic-plausibility tripwires. For `temp` that inheritance is repaired: the flowsheet gate's
canonical-unit sanity ceiling is decoupled from the renderer's legacy registry range and independently
sourced and ratified at 46.5 °C. The ratified ceiling executes through a dedicated canonical-unit
override rather than through the inherited range.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E047c.
- Packet locator: manifest archive/source-span record; manifest M4.41 item 14; baseline E047c [59048,62233).

3. Enumerated source-limb disposition
- L1 — source entry E047c is recorded by the manifest source-span review; its source prose is carried into the reviewed surface.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: R — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.41 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.41 item-10 omission; no authorization/execution assertion is made..
- Evidence: `Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md` — Evidence test PASS: tracked path; field-specific test applied..
- Owner: `src/measurementAllowlist.ts` — Owner test PASS: tracked path; field-specific test applied..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-15 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.42 — R4#0 — R4 — Promoted visual parity is a committed per-kind baseline

1. Locator and permanent identity
- Manifest record M4.42; target section target §5.
- Permanent identity/title: R4#0 / R4 — Promoted visual parity is a committed per-kind baseline. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Promoted visual parity is a committed per-kind baseline pinning every promoted visual identity across
every full-schema visual location, and no permanent cross-file equality assertion between the parity
artifacts remains. An intentional renderer change rebaselines only through the rebaseline command with
a declared scope covering changed, added, and removed identities, a Git-derived per-delta cause, and a
committed receipt. Added or removed identities with no corresponding bank change fail as identity
drift, and the one-time bootstrap is permanently unavailable.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E072.
- Packet locator: packet §42; manifest M4.42 item 14; baseline E072 [72488,73454).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - **Promoted visual parity is a committed per-kind baseline over every full-schema visual location (closed 2026-07-17, PR #55).** `scripts/tests/__snapshots__/visual-parity-promoted/<kind>.json` pins all 199 promoted identities across the 12 registered kinds and all six locations; `visual-parity.json` owns only its 11…
- L2 — carried (retained or compressed in target/rationale): An intentional renderer change rebaselines only through `npm run parity:rebaseline` with a declared `--scope` covering `changed`/`added`/`removed`, a Git-derived per-delta cause, and a committed receipt; added or removed identities with no corresponding `banks/**` change fail as identity drift.
- L3 — carried (retained or compressed in target/rationale): The one-time bootstrap is permanently unavailable.
- L4 — carried (retained or compressed in target/rationale): Review tiers, proof surfaces, and rebaseline procedure: `Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md` — do not restate them here.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: R — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.42 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.42 item-10 omission; no authorization/execution assertion is made..
- Evidence: `Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md` — Evidence test PASS: tracked path; field-specific test applied..
- Owner: OMIT — M6.3 ground NO-SINGLE-OWNER; candidate `scripts/promoted-visual-parity.ts`, `scripts/promoted-visual-parity-survey.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-17 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.43 — R5#0 — R5 — Vital sanity ratifications for SBP, RR, and SpO2

1. Locator and permanent identity
- Manifest record M4.43; target section target §5.
- Permanent identity/title: R5#0 / R5 — Vital sanity ratifications for SBP, RR, and SpO2. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Three per-side vital `sanity` bounds are ratified: an SBP ceiling of 400 mmHg, an RR ceiling of 150 per
minute, and an `spo2` floor of 0%. The governed population is bedside and charted flowsheet values,
which is what selects 400 over the higher instrumented-measurement candidate. Implementation is
pending: a later commission may add the two ceiling overrides and a per-side mechanism for the floor,
must leave renderer envelopes unchanged, may not remove or make the sanity minimum optional, and
requires a fresh corpus-impact survey.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E047a.
- Packet locator: manifest archive/source-span record; manifest M4.43 item 14; baseline E047a [59048,62233).

3. Enumerated source-limb disposition
- L1 — source entry E047a is recorded by the manifest source-span review; its source prose is carried into the reviewed surface.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: R — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.43 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.43 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-SINGLE-EVIDENCE-SOURCE; candidate `audit/vital-sanity-bounds-p3-stage-3-source-packet-2026-07-23.md`, `audit/vital-sanity-bounds-p3-stage-3-independent-checker-2026-07-23.md`; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground PENDING; candidate `src/measurementAllowlist.ts`; field-specific Owner omission test passed..
- Execution: PENDING.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-24 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.44 — R6#0 — R6 — Pull-request and post-merge CI coverage are distinct

1. Locator and permanent identity
- Manifest record M4.44; target section target §5.
- Permanent identity/title: R6#0 / R6 — Pull-request and post-merge CI coverage are distinct. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Pull-request and post-merge coverage are distinct: a check running only after merge may protect the
deploy but does not prevent the bad merge, and existing post-merge coverage is not by itself a finding
of redundancy. A gate addition therefore requires measured evidence of incremental pre-merge value.
Any further pull-request gate expansion needs its own measured evidence and owner ratification.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E073.
- Packet locator: packet §43; manifest M4.44 item 14; baseline E073 [73454,74491).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - **Pull-request and post-merge CI coverage are distinct; a gate addition requires measured evidence of incremental pre-merge value (ratified 2026-07-24).** A check running only after merge may protect the deploy but does not prevent the bad merge; equally, "already covered post-merge" is not by itself a finding of re…
- L2 — carried (retained or compressed in target/rationale): Ratified for a later implementation commission and authorizing nothing else: `npm run build`; `test:topic-population`; `test:topic-license` as detector-regression coverage only; `test:topic-vocabulary`; and an exact-byte drift check for `docs/topic-vocabulary.md`.
- L3 — carried (retained or compressed in target/rationale): Rejected or deferred: a separate `tsc -b` step (`npm run build` already runs it); fatal live topic-license enforcement; a duplicate promoted-bank validator; and generalized regeneration or drift-checking of historical audit artifacts.
- L4 — carried (retained or compressed in target/rationale): Any further PR-gate expansion needs its own measured evidence and owner ratification.
- L5 — carried (retained or compressed in target/rationale): Evidence: `audit/ci-coverage-survey-2026-07-23.report.md`, `audit/ci-coverage-survey-2026-07-23.independent-checker.md`.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: R — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: AUTHORIZING — re-derived against frozen classification; PASS.
- Authorized: The build check, topic-population, topic-license as detector-regression coverage only, topic-vocabulary, and an exact-byte drift check for the topic-vocabulary document..
- Not authorized: A separate standalone type-check step, fatal live topic-license enforcement, a duplicate promoted-bank validator, and generalized regeneration or drift-checking of historical audit artifacts..
- Evidence: OMIT — M6.3 ground NO-SINGLE-EVIDENCE-SOURCE; candidate `audit/ci-coverage-survey-2026-07-23.report.md`, `audit/ci-coverage-survey-2026-07-23.independent-checker.md`; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground PENDING; candidate —; field-specific Owner omission test passed..
- Execution: PENDING.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-24 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.45 — Producer assignments are operational state, not constitutional text — Producer assignments are operational state, not constitutional text

1. Locator and permanent identity
- Manifest record M4.45; target section target §6.
- Permanent identity/title: Producer assignments are operational state, not constitutional text / Producer assignments are operational state, not constitutional text. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Current producer assignments are operational state and must be verified against `PROJECT-HISTORY.md`
rather than assumed timeless from this document. Changing the named producer does not alter permanent
identifiers, provenance classification, or independent-review obligations.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E038.
- Packet locator: packet §44; manifest M4.45 item 14; baseline E038 [52641,53204).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): **Current producer assignment (verify against `PROJECT-HISTORY.md`, not assumed timeless from this file):** as of 2026-07-18, GPT-5.6 Sol is the current producer for every `gpt_`-prefixed lane (evergreen standalone items, episodic direct case-study commissions, and new visual-kind content), replacing the prior GPT pro…
- L2 — carried (retained or compressed in target/rationale): The retired case-skeleton compiler is not an active lane.
- L3 — carried (retained or compressed in target/rationale): GPT-5.6 Sol remains "GPT" for review-routing purposes.
- L4 — carried (retained or compressed in target/rationale): A future producer substitution updates only this callout, never the principle numbers or their obligations below.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: ADVISORY — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.45 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.45 item-10 omission; no authorization/execution assertion is made..
- Evidence: `Archive/DECISIONS-ARCHIVE-2026-08-18.md` — Evidence test PASS: exact normalized archive filename exception under Amendment 1 Clause A; semantic field test passed..
- Owner: OMIT — M6.3 ground NOT-AN-AUTHORITY; candidate `PROJECT-HISTORY.md`; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.45 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-28 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.46 — Deterministic review routing for promoted opus-prefixed case IDs — Deterministic review routing for promoted opus-prefixed case IDs

1. Locator and permanent identity
- Manifest record M4.46; target section target §6.
- Permanent identity/title: Deterministic review routing for promoted opus-prefixed case IDs / Deterministic review routing for promoted opus-prefixed case IDs. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
An already-promoted case identifier carrying the `opus*` prefix routes as producer `gpt` at low tier,
identically to a `gpt_case_` item, which is effectively what it is. This does not extend to `claude_*`
items Claude authored directly, which remain Claude-produced and route to a non-Claude reviewer. The
rule survives the retirement of the forward skeleton lane because it routes already-promoted items
rather than new production.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E043a, E036, E043b.
- Packet locator: manifest archive/source-span record; manifest M4.46 item 14; baseline E043a [56543,56891).

3. Enumerated source-limb disposition
- L1 — source entry E043a is recorded by the manifest source-span review; its source prose is carried into the reviewed surface.
- L2 — source entry E036 is recorded by the manifest source-span review; its source prose is carried into the reviewed surface.
- L3 — source entry E043b is recorded by the manifest source-span review; its source prose is carried into the reviewed surface.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.46 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.46 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate —; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground PARTIAL-OWNERSHIP; candidate `scripts/audit/early-bank-semantic-layer-a.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-18 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.47 — Runtime audio carries no client-embedded secret — Runtime audio carries no client-embedded secret

1. Locator and permanent identity
- Manifest record M4.47; target section target §6.
- Permanent identity/title: Runtime audio carries no client-embedded secret / Runtime audio carries no client-embedded secret. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Runtime audio must not require a client-embedded secret or a live API call, and an absent pre-generated
asset must fail safely to the supported `speechSynthesis` fallback. This binds regardless of the parked
status of `P20`, because the bundler inlines `VITE_`-prefixed variables as plaintext into the published
bundle and any client-embedded key would therefore be world-readable on the deploy.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E054.
- Packet locator: packet §46; manifest M4.47 item 14; baseline E054 [67121,67556).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - **Runtime audio must not require a client-embedded secret or a live API call; an absent pre-generated asset must fail safely to the supported fallback (`speechSynthesis`).** This binds regardless of principle 20's parked status below — it is categorical under GitHub Pages, not prudential: Vite inlines `VITE_`-prefix…
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.47 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.47 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate —; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-SINGLE-OWNER; candidate `src/App.tsx`, `src/audio/normalizeForTts.ts`, `AGENTS.md`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-22 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.48 — Bilingual English and Simplified Chinese parity on all displayed text — Bilingual English and Simplified Chinese parity on all displayed text

1. Locator and permanent identity
- Manifest record M4.48; target section target §6.
- Permanent identity/title: Bilingual English and Simplified Chinese parity on all displayed text / Bilingual English and Simplified Chinese parity on all displayed text. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
All displayed text carries bilingual English and Simplified Chinese parity.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E055.
- Packet locator: packet §47; manifest M4.48 item 14; baseline E055 [67556,67609).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - Bilingual EN / zh-CN parity on all displayed text.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.48 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.48 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate —; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground PARTIAL-OWNERSHIP; candidate `src/schema.ts`, `src/App.tsx`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-09 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.49 — Topic labels are English-only — Topic labels are English-only

1. Locator and permanent identity
- Manifest record M4.49; target section target §6.
- Permanent identity/title: Topic labels are English-only / Topic labels are English-only. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
A question's topic is English-only, a navigational label rather than study content. CJK characters in a
topic fail loudly at validation and are never silently stripped.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E056.
- Packet locator: packet §48; manifest M4.49 item 14; baseline E056 [67609,67792).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - `question.topic` is English-only — a navigational label, not study content.
- L2 — carried (retained or compressed in target/rationale): Enforced in `validateBankObject` (Tier 0): CJK in `topic` fails loudly and is never silently stripped.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.49 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.49 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate —; field-specific Evidence omission test passed..
- Owner: `src/schema.ts` — Owner test PASS: tracked path; field-specific test applied..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-10 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.50 — JSON quote hygiene is a parse-time gate — JSON quote hygiene is a parse-time gate

1. Locator and permanent identity
- Manifest record M4.50; target section target §6.
- Permanent identity/title: JSON quote hygiene is a parse-time gate / JSON quote hygiene is a parse-time gate. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
JSON quote hygiene is enforced at parse time: structural tokens are ASCII double quotes only, and
Chinese quotation marks are valid only inside `zh` values. JSON shape is edited programmatically and
never retyped, because the dominant corruption source is editing rather than generation.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E057.
- Packet locator: packet §49; manifest M4.50 item 14; baseline E057 [67792,68108).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - **JSON quote hygiene is a parse-time gate, and JSON shape is edited programmatically, never retyped.** Structural tokens are ASCII `"` only; Chinese quotation marks are valid only inside `zh` values.
- L2 — carried (retained or compressed in target/rationale): The dominant corruption source is editing, not generation.
- L3 — carried (retained or compressed in target/rationale): Full quote-safety mechanics: `docs/AGENTS-RUNBOOK.md`.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.50 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.50 item-10 omission; no authorization/execution assertion is made..
- Evidence: `docs/AGENTS-RUNBOOK.md` — Evidence test PASS: tracked path; field-specific test applied..
- Owner: OMIT — M6.3 ground PARTIAL-OWNERSHIP; candidate `scripts/fix-bank-quotes.ts`, `scripts/patch-raw.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-13 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.51 — Question IDs are globally unique across bundled banks — Question IDs are globally unique across bundled banks

1. Locator and permanent identity
- Manifest record M4.51; target section target §6.
- Permanent identity/title: Question IDs are globally unique across bundled banks / Question IDs are globally unique across bundled banks. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Question identifiers are globally unique across bundled banks, including embedded case-study leaf
questions. Uniqueness is gate-enforced rather than conventional.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E058.
- Packet locator: packet §50; manifest M4.51 item 14; baseline E058 [68108,68236).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - Question IDs are globally unique across bundled banks, including embedded case-study leaves — gate-enforced by `audit:ids`.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.51 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.51 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate —; field-specific Evidence omission test passed..
- Owner: `scripts/audit/audit-ids.ts` — Owner test PASS: tracked path; field-specific test applied..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-14 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.52 — Raw-draft filename prefix routes to its canonical bank — Raw-draft filename prefix routes to its canonical bank

1. Locator and permanent identity
- Manifest record M4.52; target section target §6.
- Permanent identity/title: Raw-draft filename prefix routes to its canonical bank / Raw-draft filename prefix routes to its canonical bank. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
A raw-draft filename prefix routes to its canonical bank through a fixed table that is the executable
source of truth, and no prose copy of that table is hand-maintained. The original per-kind canonicals
are complete frozen content sets rather than active generation targets; `visual-canonical.json` is the
only live visual generation target. A visual kind added after the original roadmap does not mint a new
per-kind canonical.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E059.
- Packet locator: packet §51; manifest M4.52 item 14; baseline E059 [68236,68713).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - **Raw-draft filename prefix routes to its canonical bank by a fixed table**, `CANONICAL_PREFIXES` in `lib/canonical-routing.ts` — the executable source of truth; do not hand-maintain a prose copy of the table.
- L2 — carried (retained or compressed in target/rationale): The eight original per-kind canonicals are complete, frozen content sets, not active generation targets; `visual-canonical.json` is the only live visual generation target, and a visual kind added after the original roadmap does not mint a new per-kind canonical.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.52 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.52 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground ARCHIVE-ONLY; candidate —; field-specific Evidence omission test passed..
- Owner: `lib/canonical-routing.ts` — Owner test PASS: tracked path; field-specific test applied..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-09 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.53 — Canonical merges are deterministic and gated — Canonical merges are deterministic and gated

1. Locator and permanent identity
- Manifest record M4.53; target section target §6.
- Permanent identity/title: Canonical merges are deterministic and gated / Canonical merges are deterministic and gated. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Canonical merges are deterministic and gated through the consolidation script, and canonicals are never
hand-merged.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E060.
- Packet locator: packet §52; manifest M4.53 item 14; baseline E060 [68713,68821).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - Canonical merges are deterministic and gated via `npm run consolidate`; canonicals are never hand-merged.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.53 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.53 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate —; field-specific Evidence omission test passed..
- Owner: `scripts/consolidate.ts` — Owner test PASS: tracked path; field-specific test applied..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-19 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.54 — Runtime stays static, offline, and file-protocol compatible — Runtime stays static, offline, and file-protocol compatible

1. Locator and permanent identity
- Manifest record M4.54; target section target §6.
- Permanent identity/title: Runtime stays static, offline, and file-protocol compatible / Runtime stays static, offline, and file-protocol compatible. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
The runtime stays static, offline, and compatible with direct `file://` loading. Neither a server call
nor a live model call occurs after build.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E061.
- Packet locator: packet §53; manifest M4.54 item 14; baseline E061 [68821,68922).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - Runtime stays static, offline, and `file://`-compatible.
- L2 — carried (retained or compressed in target/rationale): No server or live model call after build.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.54 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.54 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate —; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-SINGLE-OWNER; candidate —; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.54 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-09 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.55 — Schema versions are an ordered token, not semver — Schema versions are an ordered token, not semver

1. Locator and permanent identity
- Manifest record M4.55; target section target §6.
- Permanent identity/title: Schema versions are an ordered token, not semver / Schema versions are an ordered token, not semver. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Schema versions are an ordered token rather than semantic versions, and the minor component never
exceeds nine, so every version string sorts correctly under naive numeric, lexicographic, and index
comparison. The exported `schemaVersionAtLeast`, operating over a private index, is the single legal
comparison primitive. The supported version set is verified against the `SchemaVersion` union in code,
never against any prose restatement of it, including the schema document's own.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E062.
- Packet locator: packet §54; manifest M4.55 item 14; baseline E062 [68922,69436).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - **Schema versions are an ordered token, not semver — the minor component never exceeds 9.** Every version string must sort correctly under naive numeric, lexicographic, and index comparison; `schemaVersionAtLeast` (over a private index) is the single legal comparison primitive.
- L2 — carried (retained or compressed in target/rationale): Current supported set: verify against the `SchemaVersion` union in `src/types.ts`, not against any version list restated in prose (including `NCLEX-Question-Schema.md`'s own restatement, which must itself be checked against code).
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: BINDING — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.55 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.55 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate —; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-SINGLE-OWNER; candidate `src/types.ts`, `src/schema.ts`; field-specific Owner omission test passed..
- Execution: EXECUTED.
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-07-09 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

### M4.56 — Schema changes are rare and deliberate — Schema changes are rare and deliberate

1. Locator and permanent identity
- Manifest record M4.56; target section target §6.
- Permanent identity/title: Schema changes are rare and deliberate / Schema changes are rare and deliberate. Addressing, heading level, and attachment placement were re-derived; no title or ordinal was changed.
- Live subject (verbatim):
~~~text
Schema changes are rare and deliberate.
~~~

2. Source IDs and packet locator
- Source entry ID(s): E063.
- Packet locator: packet §55; manifest M4.56 item 14; baseline E063 [69436,69478).

3. Enumerated source-limb disposition
- L1 — carried (retained or compressed in target/rationale): - Schema changes are rare and deliberate.
- Superseded source limbs: none; review records compression explicitly and performs no repair.

4. Field-by-field disposition and separate E/O tests
- Kind: I — re-derived against frozen classification; PASS.
- Status: ACTIVE — re-derived against frozen classification; PASS.
- Force: ADVISORY — re-derived against frozen classification; PASS.
- Authorized: OMIT — explicit M4.56 item-10 omission; no authorization/execution assertion is made..
- Not authorized: OMIT — explicit M4.56 item-10 omission; no authorization/execution assertion is made..
- Evidence: OMIT — M6.3 ground NO-COMPRESSED-SUBSTANCE; candidate —; field-specific Evidence omission test passed..
- Owner: OMIT — M6.3 ground NO-EXECUTABLE-OWNER; candidate —; field-specific Owner omission test passed..
- Execution: OMIT — explicit M4.56 item-10 omission; no authorization/execution assertion is made..
- Field conclusion: every present path was checked against git ls-files; Evidence and Owner were not conflated.

5. Date check
- PASS — 2026-06-09 matches the effective-date surface pinned for this source record; date-bearing path literals were checked separately.

6. Verdict
- **CLEAR** — All source limbs, target fields, dates, addressing, and field-specific omission tests discharged; no repair was made.

Tranche C closure: 18 commissioned live records written and closed. Findings, if any, are recorded only; no correction was attempted.
