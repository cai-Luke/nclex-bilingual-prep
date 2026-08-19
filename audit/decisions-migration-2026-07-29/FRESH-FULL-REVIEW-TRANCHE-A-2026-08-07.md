# Fresh full constitutional review — tranche A

## Opening identity and authority

- Work order, revision 1: **12023 bytes / SHA-256 `07e8c6dbc5f792d592a7b4b88dcf154eb3f5ef70657e9b3f91758658351e5250`**.
- Fresh subject measurement: `audit/decisions-migration-2026-07-29/target-text-manifest.md`, **314811 bytes / SHA-256 `e99335567d157a86f8f2b6f178b7222bf86ccfe15e5f827da5a03864c1d04b31`**.
- Branch: `codex/decisions-migration`; HEAD: `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`.
- Population: **18 live records, M4.2–M4.19 (`P1`–`P17`, including attachments)**.
- This is a fresh source-to-target read. The prior full-review tranche output was read only as historical defect provenance; no prior tranche clearance was used.

## Method

Each entry below records the source locator, the operative limbs that survive the compression rule, the current live subject text, field-by-field treatment, date, and verdict. Narrative incidents, chronology, examples, implementation anecdotes, and rationale-only prose were not promoted to operative limbs. `Evidence` and `Owner` are checked independently under the M6 tests; rationale is never used as a carrier.

## Records

### M4.2 — `P1#0` — CLEAR

- **Source:** `E001`, source-packet line 87, bytes `[7776,8570)`; target heading `### P1 — Answer placement is owned by code`.
- **Live subject:** “A deterministic, item-ID-seeded shuffle applied at promotion owns option and answer placement; the model never places or orders an answer. This governs positional bias across every item type, not only multiple choice.” The ownership, model exclusion, and all-item-type scope are retained in the target statement.
- **Operative limbs:** placement is owned by code — **RETAINED IN M4.2 TARGET STATEMENT**; the model does not place/order answers — **RETAINED IN M4.2 TARGET STATEMENT**; the rule applies beyond MCQ — **RETAINED IN M4.2 TARGET STATEMENT**. The incident and implementation detail are explanatory/compressed, not missing limbs.
- **Fields/date:** `Kind=P; Status=ACTIVE; Force=BINDING; Date=2026-06-09; Owner=lib/shuffle.ts; Execution=EXECUTED`. `Authorized`, `Not authorized`, and `Evidence` are explicit `OMIT`; `Evidence` is archive-only, while `scripts/promote.ts` is a rejected co-candidate rather than a second owner.
- **Verdict:** **CLEAR** — singular owner and preserved population/scope.

### M4.3 — `P2#0` — CLEAR

- **Source:** `E002`, source-packet line 90, bytes `[8570,9412)`; plus E037 rule 2 at `[52533,52640)`; target heading `### P2 — Independent review is scoped to judgment`.
- **Live subject:** “Independent review is required wherever correctness depends on semantic judgment, clinical interpretation, provenance, or contract interpretation; purely mechanical work may self-certify against deterministic checks that have an independent null and do not merely confirm the author's intent. Every active generation lane declares its producer provenance and its independent-review routing.”
- **Operative limbs:** judgment-dependent work requires independent review — **RETAINED IN M4.3 TARGET STATEMENT**; mechanical work may self-certify only against a check with an independent null — **RETAINED IN M4.3 TARGET STATEMENT**; the check may not merely confirm author intent — **RETAINED IN M4.3 TARGET STATEMENT**; each active generation lane declares producer provenance and independent-review routing — **RETAINED IN M4.3 TARGET STATEMENT** (E037 rule 2). No source limb is deleted or widened.
- **Fields/date:** `Kind=P; Status=ACTIVE; Force=BINDING; Date=2026-07-18`; all five optional fields are explicit `OMIT`. `Evidence` is `NO-CANDIDATE`; `Owner` is **`DISCHARGED — NOT RE-REVIEWED`** for its already completed semantic subcheck, with the target still carrying the whole statement; `Execution` is omitted because this is a governance practice.
- **Verdict:** **CLEAR** — the repaired exclusivity condition and both E037 obligations are present.

### M4.4 — `P2#1` — CLEAR

- **Source:** `E003`, source-packet line 95, bytes `[9412,10344)`; target heading `#### P2 — Application: spec conformance and content review stay split`.
- **Live subject:** “When one seat authors a remediation spec and another implements it, the authoring seat cannot certify the implementation and a seat blind to the spec cannot certify it either.” The gate-seat content review and architect-owned spec-conformance verification are retained in the following sentence.
- **Operative limbs:** authoring seat cannot certify implementation — **RETAINED IN M4.4 TARGET STATEMENT**; seat blind to the spec cannot certify — **RETAINED IN M4.4 TARGET STATEMENT**; content review is re-derived by the gate seat — **RETAINED IN M4.4 TARGET STATEMENT**; spec-conformance verification stays with the architect — **RETAINED IN M4.4 TARGET STATEMENT**. The forcing incident and narrowing history remain archive material, not operative carriers.
- **Fields/date:** `Kind=P; Status=ACTIVE; Force=BINDING; Date=2026-07-09`; `Authorized`, `Not authorized`, `Evidence`, `Owner`, and `Execution` are all explicit `OMIT`. `Evidence` is archive-only; the final `Owner` reason is self-contained: no single live tracked path owns the whole split, so the whole-statement Owner test is satisfied.
- **Verdict:** **CLEAR** — the live final Owner wording and adjacent repaired whitespace are present and independently adjudicated; this record was not reserved.

### M4.5 — `P3#0` — CLEAR

- **Source:** `E004`, source-packet line 97, bytes `[10344,11231)`; target heading `### P3 — Deterministic core, capped semantic residual`.
- **Live subject:** “Counting, distributions, permutation integrity, and template repetition have known nulls and belong in scripts that return identical verdicts every run.” The target also retains the flagged-only semantic residual, capped batch, offline handoff, JSON validation, merge, and Layer A non-mutation boundary.
- **Operative limbs:** deterministic checks own known-null work — **RETAINED IN M4.5 TARGET STATEMENT**; semantic judgment is limited to the residual — **RETAINED IN M4.5 TARGET STATEMENT**; the residual is flagged and capped — **RETAINED IN M4.5 TARGET STATEMENT**; the handoff is offline and validated — **RETAINED IN M4.5 TARGET STATEMENT**; semantic findings merge without modifying Layer A — **RETAINED IN M4.5 TARGET STATEMENT**. The API-key/live-call prohibition is retained; implementation filenames are compressed.
- **Fields/date:** `Kind=P; Status=ACTIVE; Force=BINDING; Date=2026-06-12`; all optional fields are explicit `OMIT`. `Evidence` candidates are implementation paths and fail the Evidence authority test; `Owner` is omitted because queue emission, validation, and merge are distinct enforcement surfaces; `Execution` carries no state.
- **Verdict:** **CLEAR** — the repaired non-mutation safeguard and residual boundary are present.

### M4.6 — `P4#0` — CLEAR

- **Source:** `E005`, source-packet line 100, bytes `[11231,11639)`; target heading `### P4 — Rationales are position-agnostic and bilingual`.
- **Live subject:** “A rationale references option content, never a letter or an ordinal or spatial position.” The target preserves the English and Simplified Chinese examples as the scope illustration, not as a new population.
- **Operative limbs:** rationale names content, not position — **RETAINED IN M4.6 TARGET STATEMENT**; the prohibition applies in both languages — **RETAINED IN M4.6 TARGET STATEMENT**; the position-free form prevents stale post-shuffle references — **RETAINED IN M4.6 TARGET STATEMENT**. Examples are not independently operative.
- **Fields/date:** `Kind=P; Status=ACTIVE; Force=BINDING; Date=2026-06-09`; all optional fields are explicit `OMIT`. `Evidence` is `NO-CANDIDATE`; `Owner` is `NO-EXECUTABLE-OWNER`; `Execution` is omitted with the frozen classification.
- **Verdict:** **CLEAR**.

### M4.7 — `P5#0` — CLEAR

- **Source:** `E006`, source-packet line 103, bytes `[11639,12062)`; plus E037 rule 2 at `[52533,52640)`; target heading `### P5 — Generated is not reviewed`.
- **Live subject:** “No model-generated learner-facing clinical content becomes canonical without independent content review and the promotion pipeline.” The raw staging, validation/audit/source-check, canonical promotion, ledger entry, and generating-model exclusion are all retained.
- **Operative limbs:** generated content needs independent review — **RETAINED IN M4.7 TARGET STATEMENT**; promotion pipeline is required — **RETAINED IN M4.7 TARGET STATEMENT**; raw output stages before canonical promotion — **RETAINED IN M4.7 TARGET STATEMENT**; generator cannot review its own batch — **RETAINED IN M4.7 TARGET STATEMENT**; active lanes declare provenance/routing — **RETAINED IN M4.7 TARGET STATEMENT** (E037 rule 2). The historical forcing incident is compressed/archive-only.
- **Fields/date:** `Kind=P; Status=ACTIVE; Force=BINDING; Date=2026-07-18`; all optional fields are explicit `OMIT`. `Evidence` candidate `BANK-REVIEW-LEDGER.md` is not an authority for the whole rule; `Owner` is **`DISCHARGED — NOT RE-REVIEWED`**; `Execution` is omitted.
- **Verdict:** **CLEAR** — pipeline, independent-review, and E037 limbs are preserved.

### M4.8 — `P5#1` — CLEAR

- **Source:** `E007`, source-packet line 106, bytes `[12062,12410)`; target heading `#### P5 — Narrowing: named-model restrictions are lane policy`.
- **Live subject:** “Named-model restrictions are current lane policy, not the universal definition of generated-versus-reviewed content.” The current target retains the Gemini raw-volume, small-batch, no-direct-canonical-edit, and no-audit/judgment-role lane policy.
- **Operative limbs:** named-model limits are lane-specific — **RETAINED IN M4.8 TARGET STATEMENT**; the constitutional P5 floor remains broader — **RETAINED IN M4.8 TARGET STATEMENT**; Gemini is not a canonical editor or audit/judgment seat — **RETAINED IN M4.8 TARGET STATEMENT**. The `P31` identity is an entry reference, not Evidence.
- **Fields/date:** `Kind=P; Status=ACTIVE; Force=AUTHORIZING; Date=2026-06-26; Not authorized=...` present as the target’s explicit non-relaxation; `Authorized`, `Evidence`, `Owner`, and `Execution` are explicit `OMIT`. Evidence candidate `P31` is `NOT-A-PATH`; Owner is `NO-EXECUTABLE-OWNER`.
- **Verdict:** **CLEAR**.

### M4.9 — `P6#0` — CLEAR

- **Source:** `E008`, source-packet line 108, bytes `[12410,13512)`; target heading `### P6 — Visuals are deterministic, curated imagery has a separate lane`.
- **Live subject:** “Deterministic, data-derived visuals are the default for diagrammatic and numeric clinical cues; AI-generated medical imagery is prohibited.” The load-bearing requirement, `selfCheck`, and curated licensed-image boundary are retained.
- **Operative limbs:** deterministic data-derived visuals are default — **RETAINED IN M4.9 TARGET STATEMENT**; AI-generated medical images are prohibited — **RETAINED IN M4.9 TARGET STATEMENT**; visuals must be load-bearing and self-checked — **RETAINED IN M4.9 TARGET STATEMENT**; curated imagery is a separate permitted lane — **RETAINED IN M4.9 TARGET STATEMENT**.
- **Fields/date:** `Kind=P; Status=ACTIVE; Force=BINDING; Date=2026-07-14`; all optional fields are explicit `OMIT`. `Evidence` has no compressed substance; `Owner` candidate `selfCheck` is not a path; `Execution` is omitted.
- **Verdict:** **CLEAR**.

### M4.10 — `P7#0` — CLEAR

- **Source:** `E009`, source-packet line 113, bytes `[13512,13744)`; target heading `### P7 — Precision over volume`.
- **Live subject:** “In any audit, five fully-evidenced findings beat thirty probable ones.” The confidence, reconciliation, and no-volume-forcing obligations are retained.
- **Operative limbs:** evidence-backed findings outrank probable volume — **RETAINED IN M4.10 TARGET STATEMENT**; confidence and reconciliation must be explicit — **RETAINED IN M4.10 TARGET STATEMENT**; volume is not a reason to promote a weak finding — **RETAINED IN M4.10 TARGET STATEMENT**.
- **Fields/date:** `Kind=P; Status=ACTIVE; Force=ADVISORY; Date=2026-06-09`; all optional fields are explicit `OMIT`. `Evidence` is `NO-CANDIDATE`; `Owner` is `NO-EXECUTABLE-OWNER`; `Execution` is omitted.
- **Verdict:** **CLEAR**.

### M4.11 — `P8#0` — CLEAR

- **Source:** `E039a`, source-packet lines 309–310, mechanically isolated core bytes `[53204,53661)`; plus E037 rule 1 at `[52533,52640)`; target heading `### P8 — Clinical truth is authored upstream and read-only downstream`.
- **Live subject:** “Clinical truth and answer logic have an explicit upstream owner, and every downstream transformation may read them but never silently invent or alter them.” The target retains the upstream ownership, read-only downstream, and auditability boundary.
- **Operative limbs:** truth/answer logic has an upstream owner — **RETAINED IN M4.11 TARGET STATEMENT**; downstream transformations may read but not invent/alter — **RETAINED IN M4.11 TARGET STATEMENT**; every active lane declares provenance/routing — **RETAINED IN M4.11 TARGET STATEMENT** (E037 rule 1). The historical lane extension is archive-only.
- **Fields/date:** `Kind=P; Status=ACTIVE; Force=BINDING; Date=2026-07-24`; all optional fields are explicit `OMIT`. `Evidence` is archive-only; `Owner` is **`DISCHARGED — NOT RE-REVIEWED`**; `Execution` is omitted.
- **Verdict:** **CLEAR**.

### M4.12 — `P10#0` — CLEAR

- **Source:** `E010`, source-packet line 116, bytes `[13744,14789)`; target heading `### P10 — Study sessions mirror the exam distribution`.
- **Live subject:** “Default Study sampling follows NCLEX category weighting and guards against narrow-topic clustering, while strict exam simulation is a separate product mode.” The target preserves weighting, anti-clustering, and mode separation.
- **Operative limbs:** default sampling follows category weights — **RETAINED IN M4.12 TARGET STATEMENT**; narrow-topic clustering is guarded — **RETAINED IN M4.12 TARGET STATEMENT**; exam simulation is separate — **RETAINED IN M4.12 TARGET STATEMENT**. Implementation details are compressed.
- **Fields/date:** `Kind=P; Status=ACTIVE; Force=BINDING; Date=2026-07-14; Execution=EXECUTED`; `Authorized`, `Not authorized`, `Evidence`, and `Owner` are explicit `OMIT`. Evidence candidates `src/schema.ts`/`src/sessionSampler.ts` are not authorities for the constitutional statement; Owner is no single path.
- **Verdict:** **CLEAR**.

### M4.13 — `P11#0` — CLEAR

- **Source:** `E011`, source-packet line 121, bytes `[14789,15922)`; target heading `### P11 — Visual arithmetic is a machine-checked gate carrying no engine`.
- **Live subject:** “For every visual kind whose answer turns on a computed value, the load-bearing numbers are typed on the visual spec and `selfCheck` recomputes the answer.” The target keeps the no-engine/data-derived arithmetic boundary and fail-closed requirement.
- **Operative limbs:** computed values are typed — **RETAINED IN M4.13 TARGET STATEMENT**; `selfCheck` independently recomputes — **RETAINED IN M4.13 TARGET STATEMENT**; the visual gate carries no answer engine — **RETAINED IN M4.13 TARGET STATEMENT**; failures are not silently accepted — **RETAINED IN M4.13 TARGET STATEMENT**.
- **Fields/date:** `Kind=P; Status=ACTIVE; Force=BINDING; Date=2026-06-12; Execution=EXECUTED`; `Authorized`, `Not authorized`, `Evidence`, and `Owner` are explicit `OMIT`. Evidence has no candidate; Owner `selfCheck` is not a singular path.
- **Verdict:** **CLEAR**.

### M4.14 — `P15#0` — CLEAR

- **Source:** `E012`, source-packet line 124, bytes `[15922,16386)`; target heading `### P15 — Bank patches are raw-scoped and declarative`.
- **Live subject:** “Bank patches write only under the raw bank directory, and canonical files are read-only except through an explicit in-place mode that forces a ledger entry.” The target retains raw scope, explicit mutation mode, declaration, and ledger discipline.
- **Operative limbs:** patches are raw-scoped — **RETAINED IN M4.14 TARGET STATEMENT**; canonical mutation requires explicit mode — **RETAINED IN M4.14 TARGET STATEMENT**; mutation is declarative and ledgered — **RETAINED IN M4.14 TARGET STATEMENT**. The path-level implementation detail is not a missing constitutional limb.
- **Fields/date:** `Kind=P; Status=ACTIVE; Force=BINDING; Date=2026-06-10; Owner=scripts/patch-raw.ts; Execution=EXECUTED`; `Authorized`, `Not authorized`, and `Evidence` are explicit `OMIT`. Owner names the mutation owner; Evidence has no compressed substance.
- **Verdict:** **CLEAR**.

### M4.15 — `P15#1` — CLEAR

- **Source:** `E013`, source-packet line 127, bytes `[16386,18274)`; target heading `#### P15 — Application: a declarative op names a field path, not a record`.
- **Live subject:** “A declarative operation identifies the exact field path it mutates together with the before and after values for that path.” The target retains field-path specificity, before/after proof, record scoping, and raw-only enforcement.
- **Operative limbs:** operation names field path — **RETAINED IN M4.15 TARGET STATEMENT**; before/after values are required — **RETAINED IN M4.15 TARGET STATEMENT**; record-scoped strings do not replace path precision — **RETAINED IN M4.15 TARGET STATEMENT**; raw-only boundary and validation are retained — **RETAINED IN M4.15 TARGET STATEMENT**.
- **Fields/date:** `Kind=P; Status=ACTIVE; Force=BINDING; Date=2026-07-22; Execution=EXECUTED`; `Authorized`, `Not authorized`, `Evidence`, and `Owner` are explicit `OMIT`. The candidate `scripts/patch-raw.ts` is partial: it owns mutation mechanics but not the whole retained proof/contract, so it cannot be Owner.
- **Verdict:** **CLEAR**.

### M4.16 — `P16#0` — CLEAR

- **Source:** `E014`, source-packet line 133, bytes `[18274,19722)`; target heading `### P16 — Answer-pattern bias is presentation-first`.
- **Live subject:** “Positional tells carry no clinical meaning and are repaired mechanically by a deterministic, ID-seeded permutation.” The target also retains the distinction between positional and distributional signal.
- **Operative limbs:** positional placement is semantically inert — **RETAINED IN M4.16 TARGET STATEMENT**; deterministic permutation repairs it — **RETAINED IN M4.16 TARGET STATEMENT**; distributional signal is analyzed separately — **RETAINED IN M4.16 TARGET STATEMENT**.
- **Fields/date:** `Kind=P; Status=ACTIVE; Force=BINDING; Date=2026-07-14; Execution=EXECUTED`; `Authorized`, `Not authorized`, `Evidence`, and `Owner` are explicit `OMIT`. Evidence is `NO-CANDIDATE`; the former candidate is carried elsewhere for Owner and does not become a second carrier.
- **Verdict:** **CLEAR**.

### M4.17 — `P16#1` — CLEAR

- **Source:** `E015`, source-packet line 138, bytes `[19722,22368)`; target heading `#### P16 — Amendment: a canonical file is not a learner-visible population`.
- **Live subject:** “Distributional checks measure concentration in the population a learner actually draws from, so a canonical bank file is an authoring-provenance boundary rather than automatically the measured population.” The target preserves the population distinction and measurement rule.
- **Operative limbs:** measure learner-visible draw population — **RETAINED IN M4.17 TARGET STATEMENT**; canonical-file membership alone is not the population — **RETAINED IN M4.17 TARGET STATEMENT**; producer/provenance boundaries remain relevant — **RETAINED IN M4.17 TARGET STATEMENT**.
- **Fields/date:** `Kind=P; Status=ACTIVE; Force=BINDING; Date=2026-07-15; Owner=scripts/audit/non-mcq-bias-lib.ts; Execution=EXECUTED`; `Authorized`, `Not authorized`, and `Evidence` are explicit `OMIT`. The Owner path is the whole retained measurement library surface; Evidence is archive-only.
- **Verdict:** **CLEAR**.

### M4.18 — `P16#2` — CLEAR

- **Source:** `E016`, source-packet line 145, bytes `[22368,22670)`; target heading `#### P16 — Standing authoring note on surviving distributional signal`.
- **Live subject:** “The surviving `visual-canonical` SATA distributional signal is addressed by varying correct counts where clinical truth naturally permits.” The target retains the bounded authoring note and does not promote it to a universal validity rule.
- **Operative limbs:** the signal is specific to the named population — **RETAINED IN M4.18 TARGET STATEMENT**; variation is used only where clinical truth permits — **RETAINED IN M4.18 TARGET STATEMENT**; this does not alter positional shuffle or clinical correctness — **RETAINED IN M4.18 TARGET STATEMENT**.
- **Fields/date:** `Kind=P; Status=ADVISORY; Force=BINDING; Date=2026-07-15`; all optional fields are explicit `OMIT`. Evidence and Owner candidates are the visual-canonical data file and fail the authority/path tests; `Execution` is omitted.
- **Verdict:** **CLEAR**.

### M4.19 — `P17#0` — CLEAR

- **Source:** `E017`, source-packet line 147, bytes `[22670,23124)`; target heading `### P17 — Scoring is polytomous, retention is full-marks`.
- **Live subject:** “Grading returns an earned-and-possible score per NGN family. Partial credit feeds the session score and per-item feedback only, and spaced repetition requires full credit.” The target preserves the distinction between scoring and retention.
- **Operative limbs:** scores are earned/possible per family — **RETAINED IN M4.19 TARGET STATEMENT**; partial credit affects score/feedback only — **RETAINED IN M4.19 TARGET STATEMENT**; retention requires full marks — **RETAINED IN M4.19 TARGET STATEMENT**.
- **Fields/date:** `Kind=P; Status=ACTIVE; Force=BINDING; Date=2026-06-14; Execution=EXECUTED`; `Authorized`, `Not authorized`, `Evidence`, and `Owner` are explicit `OMIT`. Evidence is `NO-CANDIDATE`; `src/grading.ts` is partial ownership and does not own the full retention policy.
- **Verdict:** **CLEAR**.

## Tranche A result

**PASS — 18/18 records CLEAR; 0 FINDING; 0 QUESTION.** No repair, interpretation change, or mutation is authorized by this receipt.
