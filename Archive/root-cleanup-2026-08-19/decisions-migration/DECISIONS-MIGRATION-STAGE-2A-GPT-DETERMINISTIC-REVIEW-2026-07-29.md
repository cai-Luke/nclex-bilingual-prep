# DECISIONS Migration — GPT Review of Deterministic Stage 2a Preparation

**Date:** 2026-07-29  
**Seat:** GPT independent structural/semantic reviewer  
**Status:** Deterministic preparation accepted for architect use, with the cautions below. This is not Stage 2a manifest acceptance and does not authorize Stage 2b.

## 1. Scope and limitation

Reviewed against the live repository:

- `DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-RECEIPT-2026-07-29.md`
- `DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md`
- `DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md`
- `DECISIONS-MIGRATION-STAGE-2A-MANIFEST-SCAFFOLD-2026-07-29.md`
- the ratified taxonomy, format specification, Amendment 4, migration commission, frozen migration table, and frozen outline.

The Desktop repository connector cannot execute arbitrary shell commands. I therefore checked the internal consistency, copied identities, source classifications, population accounting, and semantic ownership, but did **not** independently recompute SHA-256 values from `git show`. The commission's later independent Stage 2a reviewer still must reproduce all thirteen baseline slices and hashes directly.

No tracked or governed file was edited.

## 2. Accepted deterministic results

The preparation is suitable as input to the architect pass:

- baseline identity is consistently pinned as `d499cc1d0916e03830489ec9cd0324cd1a203a73`;
- baseline metadata is consistently reported as 76,314 bytes, valid UTF-8, trailing newline, SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`;
- all thirteen approved archive spans, lengths, newline dispositions, and hashes are copied identically from the hash packet into the scaffold;
- archive lengths sum to 8,628 bytes;
- the live population is exactly 65 records with 37 `P`, 6 `R`, 19 `I`, and 3 `T`;
- the scaffold accounts for 65 live + 13 wrappers + E053 structural + E037 `MERGE_INTO` = 80;
- the four retiring wrappers are exactly E040/P9, E041/P12, E042/P18, and E043b/P22;
- E053 is represented only as structural target-§8 prose;
- E037 has no independent target block or wrapper and names E039a, E002, and E006 as its fixed targets.

The scaffold correctly leaves all constitutional bytes and optional-field decisions as `ARCHITECT_REQUIRED`.

## 3. Caution — scaffold order is not a ratified output order

Codex populated the 65 stubs in the row order of the outline's **authoritative destination-membership table**. That table expressly defines membership, not final body order.

Consequently the scaffold currently places:

- P8, P20, and P31 after P30;
- the rulings in the sequence R3, R5, R2, R1, R4, R6.

The format contract requires the entry index and body to agree in document order, but does not independently mandate numeric sorting. The section-specific outline tables present principles in P-number order and rulings in R1–R6 order, but the architect manifest must make the final choice explicitly.

**Required architect action:** pin one exact body/index order. Do not treat scaffold stub order as ratified merely because it is mechanically complete. Numeric permanent-ID order is the clearest candidate for `P` and `R`, but this review does not ratify it.

## 4. Resolution of the five `ARCHITECT REVIEW` source markers

These markers concern semantic source ownership for compressed live statements, not archive-byte extraction.

### 4.1 E039a / P8

The source split is sufficiently established for authorship:

- live core: heading and body from byte 53,204 through the sentence ending `A decision point too underspecified to yield an unambiguous item is dropped, not guessed.`;
- E039b begins at byte 53,661 with `Extensions (condensed; full narrative archived):`;
- E037 rule 1 must be visibly carried by P8: clinical truth and answer logic have an explicit upstream owner, and downstream transformations may read but never silently invent or change them.

The target statement should be lane-independent. It must not preserve `currently Opus` or `currently GPT` as permanent constitutional assignments.

### 4.2 E043a / standing `opus*` routing invariant

The source packet intentionally supplies broad context. Not all of L300's live tail belongs in E043a.

**E043a must carry:**

1. already-promoted IDs matching `/^opus\d*_/` route as producer `gpt`, tier `low`, equivalent to `gpt_case_` items;
2. this routing does not extend to directly Claude-authored `claude_*` items, which remain Claude-produced and require a non-Claude reviewer;
3. the rule remains applicable to existing promoted IDs even though the forward skeleton lane lapsed.

**E043a must not absorb as its own rule:**

- the direct-GPT producer contract or topic-specific commission mechanism;
- the C/D rerun evaluation;
- the advice to use case form for a topic or load-bearing visual;
- the prohibition on treating the pathway as a standing bulk-generation lane;
- general P5 / independent-review obligations.

Those are replacement-pathway context. The ratified E037 merge and existing P2/P5 ownership carry the provenance and independent-review obligations. The C/D rerun sentence is evidence/soft guidance recoverable from the preservation snapshot, not a missing constitutional destination.

### 4.3 E047c / R3 — executed temperature-sanity closure

Carry the closed finding and implemented ruling:

- copied renderer envelopes are not themselves authored plausibility bounds;
- the `temp` sanity ceiling was independently authored and ratified at 46.5 °C;
- that ceiling is executed through the dedicated override while the renderer range remains separate.

Do not pull the still-open `temp` floor into R3. Detailed case citations, survey chronology, and proof metrics belong in the linked evidence, not the 1–3 sentence statement.

### 4.4 E047a / R5 — pending SBP/RR/SpO₂ implementation

Carry the three ratified per-side values and implementation boundary:

- SBP ceiling 400 mmHg;
- RR ceiling 150/min;
- `spo2` floor 0%;
- governed population is bedside/charted flowsheet values;
- implementation is pending, must preserve renderer envelopes, and requires a fresh corpus-impact survey.

Do not include DBP, MAP, `temp` floor, or laboratory `sao2` as decided values.

### 4.5 E047b / open vital-sanity thread

Carry only unresolved questions and their next action:

- source DBP and MAP ceilings through a bounded sourcing pass, with no value selected;
- the `temp` floor remains inherited and unratified;
- laboratory `sao2` remains separately provisional because pulse-oximeter evidence does not govern it;
- other unratified sides remain provisional.

Do not restate the executed temperature ceiling or the three R5 values as open work.

## 5. Other high-risk live compressions

### 5.1 E002 / P2 and E006 / P5

E037 rule 2 must be visibly carried in **both** targets: every active generation lane declares producer provenance and independent-review routing.

- P2 should retain the general rule that independent review is required for judgment-bearing work and that every active lane declares its producer/reviewer routing.
- P5 should retain the promotion consequence: generated learner-facing content is not reviewed material, and its producing lane cannot certify it for canonical promotion.

Do not let one target merely point to the other; the commission requires the E037 contribution to be shown in both manifest records.

### 5.2 E027 and E028 / P25

The scaffold's source classification phrase `ACTIVE (vitals_trend clause superseded by E028)` is review notation, not a legal target `Status` value. E027's target field remains `ACTIVE`.

Its compressed application must preserve the general chart-plus-derived-table rule while excluding the superseded 2026-07-18 multi-panel `vitals_trend` geometry. E028 owns the current unified-chart amendment and retained flowsheet. The two attachments must not leave contradictory current geometry in the target.

### 5.3 E029 / P25

E029 is a `P25` application with `Execution: PENDING`, not an unnumbered ruling and not an open thread. Its statement should carry the ratified instruction to reinstate the visible flowsheet beneath the Epic chart; pending implementation does not weaken its binding force.

### 5.4 E038 / current-producer callout

Do not constitutionalize `GPT-5.6 Sol` as a permanent producer assignment. E038 should become a stable advisory invariant about **where** the current-producer assignment is maintained and how substitutions are recorded: verify the current assignment against `PROJECT-HISTORY.md`; changing producer updates the callout/owner without changing permanent principle identities or their review obligations.

### 5.5 E074 / P31 Gemini restrictions

The source paragraph cites P8, P18, and P22 through the retired forward-lane topology. P18 and P22 retire in this migration, so P31 must not preserve those references as current authority.

Ground the final binding statement in the still-current restrictions:

- raw-volume generation only;
- never direct canonical edits under P5;
- no content-judgment audit role under the producer-versus-checker rules;
- if an irreducible producer-clean residual ever creates a Gemini audit lane, non-pair-specific reconciliation or failure to quote the keyed EN+ZH rule routes the row to re-review rather than acceptance.

Do not carry the lapsed flag-only forward-case-lane role as a current obligation.

## 6. Archive-wrapper metadata still requiring architect judgment

The verified spans and addressing modes are ready. The scaffold appropriately does not yet pin the wrapper field bytes.

The architect must distinguish target classification from historical metadata:

- every wrapper's live wrapper fields are `Kind: X`, `Status: SUPERSEDED`, `Force: HISTORICAL`;
- `Original Kind` must be one of `P`, `R`, `I`, or `T`, never `X`;
- `Original Status` must be one valid historical status, not scaffold shorthand such as `CONDITIONAL→lapsed`;
- name-addressed wrappers receive no `Retired ID` or retired-register row.

Already ratified or strongly fixed:

- E032 and E039b are historical units of still-live principles and use name addressing with `Original Kind: P`;
- E040, E041, E042, and E043b are ID-addressed `P` retirements;
- E048, E050, E051, and E052 are name-addressed historical rulings with `Original Kind: R`;
- E075 and E076 remain architect decisions for truthful `Original Kind` / `Original Status` based on their appendix role;
- E036 remains an architect decision for truthful original-kind/status metadata because it is a section-level lapse note rather than an ordinary numbered block.

No wrapper title may begin with reserved `P<n> ` or `R<n> ` unless it is the corresponding ID-addressed retirement.

### 6.1 Inter-wrapper separators for bodies without a final newline

E036 and E043b end mid-line by design and their pinned body bytes contain no trailing `0x0a`. The next wrapper still must begin at a Markdown line boundary.

The authoritative manifest must therefore distinguish:

- the exact preserved body slice, whose hash and final-newline state cannot change; from
- migration-authored separator bytes inserted **after** that body and before the next `###` wrapper heading.

Pin the complete archive-construction bytes or a literal separator rule. A clear deterministic convention is: after each body, add enough LF bytes outside the body to leave exactly one blank line before the next wrapper (`\n\n` after a non-newline body; `\n` after a body already ending in `\n`). The architect may choose another parse-valid exact convention, but implementation must not silently decide it or treat the separator LF as part of the hashed historical body.

## 7. E032 title requirement

The verified E032 body carries two historical components:

1. the 2026-07-12 risk-tiered-verification application;
2. the alternatives that the pass rejected and that continue to stand as rejection history.

Its architect-authored archive title and index summary should identify both, rather than describing the body as only the verification-matrix application.

## 8. Evidence and owner cleanup still needed

The frozen migration table includes many labels that are not legal single-path field values: commands, symbols, abbreviated pseudo-paths, multiple paths, directories, or prose references. The scaffold correctly makes all `Evidence` and `Owner` decisions architect work.

For each live block the architect must either:

- resolve the field to exactly one tracked repository path; or
- pin `OMIT` and record the candidate/disposition in the manifest omission register.

Do not copy migration-table shorthand such as `per-kind selfCheck`, `Tier 0`, `audit:ids`, `NCLEX_CATEGORY_WEIGHTS`, `floorThreshold`, `GitHub Pages`, combined `AGENTS.md/NCLEX-Question-Schema.md`, or ellipsized filenames into governed field lines.

## 9. Resume order for the architect

1. Choose and pin exact live body/index order.
2. Resolve the five source markers using §4 above.
3. Author the 65 exact headings, statements, fields, omissions, and index rows.
4. Author the 13 wrapper labels, historical metadata, index lines, and six required boundary rationales.
5. Author E053 structural prose and the six-row retired register.
6. Resolve every `Evidence` / `Owner` candidate to one tracked path or explicit omission.
7. Return a complete candidate `audit/decisions-migration-2026-07-29/target-text-manifest.md` for full independent review.

Do not begin Stage 2b or edit `DECISIONS.md`, parser code, archive files, fixtures, package scripts, workflows, or frozen artifacts.

## 10. Review disposition

**DETERMINISTIC PREP: ACCEPT FOR ARCHITECT USE.**

This accepts Codex's source packet and non-authoritative scaffold as preparation material. It does not accept any target constitutional wording, does not satisfy the commission's independent hash-reproduction requirement, and does not authorize migration implementation.
