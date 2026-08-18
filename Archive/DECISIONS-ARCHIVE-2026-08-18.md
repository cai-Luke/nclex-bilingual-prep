# DECISIONS archive — 2026-08-18 cleanup migration

Material condensed out of `DECISIONS.md` during the 2026-08-18 target-grammar migration. Each
wrapper below carries a migration-authored metadata header followed by a historical body preserved
byte-for-byte from `DECISIONS.md` at `MIGRATION_BASELINE`. Nothing in this file is current authority.
`Archive/DECISIONS-ARCHIVE-2026-07-14.md` remains the record of the earlier 2026-07-14
architectural-constitution pass and is not superseded by this file.

## Preserved displaced prose

This section carries prose condensed out of an entry that remains live under the same identity. It is not
an archive wrapper: it carries no metadata fields, produces no retired-register row, is reachable from no
archive-index line, and is pointed at only by the `Evidence` field of the live entry named below.

**Current producer assignment callout, displaced from the live standing invariant "Producer assignments
are operational state, not constitutional text" (`DECISIONS.md` §5 at `MIGRATION_BASELINE`).** The
paragraph below is preserved verbatim, including its self-reference: "this file" in it means
`DECISIONS.md` as it stood at the baseline, not this archive.

**Current producer assignment (verify against `PROJECT-HISTORY.md`, not assumed timeless from this file):** as of 2026-07-18, GPT-5.6 Sol is the current producer for every `gpt_`-prefixed lane (evergreen standalone items, episodic direct case-study commissions, and new visual-kind content), replacing the prior GPT producer outright. The retired case-skeleton compiler is not an active lane. GPT-5.6 Sol remains "GPT" for review-routing purposes. A future producer substitution updates only this callout, never the principle numbers or their obligations below.

## Archived entries
### Most recent application of P27 and its rejected alternatives (2026-07-12 pass)

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-08-18
- **Original Kind:** P
- **Original Status:** ACTIVE
- **Origin:** `DECISIONS.md` §4 at `MIGRATION_BASELINE`

Most recent application (2026-07-12 pass, kept as the standing precedent this current pass follows): risk-tiered verification replaced an undifferentiated ritual (`AGENTS.md`'s change-class matrix — docs-only is *not* the safe tier, since stale version prose has repeatedly misrouted reasoning about schema floors); `AGENTS.md` became constitutional with a runbook carrying the operational load; this file's entries gained the explicit status tag now formalized further in §2 above; and single-definition discipline was applied to prose the same way it applies to code (a duplicated routing table was cut in favor of one owner plus a link). The alternatives that pass rejected — fresh-context review counting as independence, shortening the read order, demoting `PROJECT-HISTORY.md`'s override authority, compressing the quote-safety two-mode summary to one line — still stand; full reasoning for each rejection is archived.

### Forward case-generation lane lapse note (2026-07-18)

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-08-18
- **Original Kind:** R
- **Original Status:** ACTIVE
- **Origin:** `DECISIONS.md` §5 at `MIGRATION_BASELINE`

**Lapse note (2026-07-18; pathway disposition 2026-07-19):** Luke retired the Opus-skeleton → GPT compile/fact-check → Gemini flag-review → Claude gate pipeline in favor of wholesale case_study production in the current GPT model. Per §2, CONDITIONAL principles lapse with their governing lane and need no separate repeal, so principles 8, 9, 12, 18, and 22 below no longer bind. They are retained verbatim for historical reference — do not apply them to any new lane without re-ratifying.

### Lane-specific detail of P8 (forward case-generation pipeline)

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-08-18
- **Original Kind:** P
- **Original Status:** CONDITIONAL
- **Origin:** `DECISIONS.md` §5 at `MIGRATION_BASELINE`

Extensions (condensed; full narrative archived): an optional author-supplied bowtie-synthesis zone lets the compiler assemble a standalone `bowtie` alongside the case without inventing the differential or irrelevant-parameter pools itself; case completion is accounted via a `_compileManifest`, never assumed — a genuinely underspecified decision point may be omitted only with a specific manifest entry, and promotion fails if authored points disappear unaccounted; Gemini is a flag-only review layer over the compiler's output, never a compiler itself, and never mutates JSON, prose, ids, answer keys, or Chinese translation.

### P9 — The case skeleton is English-only

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-07-28
- **Original Kind:** P
- **Original Status:** CONDITIONAL
- **Retired ID:** P9
- **Origin:** `DECISIONS.md` §5 at `MIGRATION_BASELINE`

**9. CONDITIONAL — the case skeleton is English-only; bilingual generation concentrates in the compiler.**
The authoring harness drifts to Spanish and mangles schema under bilingual load, so the authored skeleton is English prose only; all `zh` is generated downstream by the compiler, making compiler zh-fidelity the single point of failure. Gated by a deterministic CJK-presence check on every must-be-bilingual field: a missing `zh`, or English left in a `zh` field, fails loud before review.

### P12 — Author-side currency via closed-world construction and routed flags

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-07-28
- **Original Kind:** P
- **Original Status:** CONDITIONAL
- **Retired ID:** P12
- **Origin:** `DECISIONS.md` §5 at `MIGRATION_BASELINE`

**12. CONDITIONAL — author-side currency via closed-world construction + routed flags, never a changelog.**
The author model is frozen at its training cutoff and has no tools, so currency belongs to the downstream fact-checker and Claude's final review, never the author. Two mechanisms, neither of which tries to update the author: closed-world construction states the governing protocol/threshold *inside* the case as an order or clinic rule, so the keyed answer survives external guideline drift; and an optional sentinel-delimited currency-flag block lets the author name only the specific claims it doubts, stripped before compile. Deliberately not fed: a "what changed since cutoff" changelog — always partial, costly to maintain, and redundant with the independent currency pass.

### P18 — Fact-check and flag-only review are chain steps

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-07-28
- **Original Kind:** P
- **Original Status:** CONDITIONAL
- **Retired ID:** P18
- **Origin:** `DECISIONS.md` §5 at `MIGRATION_BASELINE`

**18. CONDITIONAL — fact-check/currency and flag-only review are chain steps, not optional asides.**
Every forward skeleton-derived case passes through clinical fact-check/currency plus compilation, then flag-only review, then Claude's final clinical and promotion gate. Record this topology explicitly in every `Chain:` line; an annotation that omits fact-check or the flag-review step understates the independent checks, and one implying the flag-review layer edited content reopens the corruption vector this split exists to close.

### P22 — Opus skeleton cases are GPT-provenance for review-conflict purposes

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-07-28
- **Original Kind:** P
- **Original Status:** CONDITIONAL
- **Retired ID:** P22
- **Origin:** `DECISIONS.md` §5 at `MIGRATION_BASELINE`

**22. CONDITIONAL — Opus skeleton cases are GPT-provenance for review-conflict purposes.**
The producer principle 2 protects against self-review is the compiler (currently GPT), not the prose author (currently Opus) — an `opus*` case is checker-conflicted for the compiler and for the flag-review layer, but **not** for Claude, since the clinical substance an audit evaluates is the compiler's, not the prose author's.

### CBC American-conventional unit ruling (superseded 2026-07-05)

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-08-18
- **Original Kind:** R
- **Original Status:** SUPERSEDED
- **Origin:** `DECISIONS.md` §8 at `MIGRATION_BASELINE`

**CBC lab units are American conventional, not SI (2026-07-04). Status: SUPERSEDED** by the Amendment (2026-07-05) below. Do not follow this entry's "never SI" / "`×10⁹/L` dropped" claims.

*Original ruling.* For WBC/platelet counts the app used conventional US units only, grounded in Luke's bench experience as a laboratory technologist — US labs report these conventionally (`×10³/µL`/`K/µL`/raw `/µL`), not SI `×10⁹/L`. `lab_trend`'s canonical unit for `wbc`/`platelets` moved to the conventional form (numerically identical, only the label changes), dropping `×10⁹/L` as an accepted unit.

### Fishbone workflow-familiarity waiver (2026-07-06, superseded)

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-08-18
- **Original Kind:** R
- **Original Status:** SUPERSEDED
- **Origin:** `DECISIONS.md` §8 at `MIGRATION_BASELINE`

**The fishbone "workflow-familiarity" waiver (2026-07-06). Status: SUPERSEDED** by principle 25 (§4), on stronger grounds: the fishbone qualifies because it *preserves exact values* (a partial H/H fishbone is value-complete), not because clinicians are used to seeing one. Vendor ubiquity is explicitly not a qualifying criterion under principle 25.

### Withdrawn claim that vital sanity bounds pass every real value

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-08-18
- **Original Kind:** R
- **Original Status:** SUPERSEDED
- **Origin:** `DECISIONS.md` §8 at `MIGRATION_BASELINE`

**"Vitals `sanity` passes every real transcribed value." Status: SUPERSEDED / withdrawn.** An earlier characterization that the six non-`temp` vital `sanity` bounds were clinically ratified and admit every real reading is withdrawn as unprovable of a copied renderer envelope, and contradicted by evidence (documented SBP to ~370, RR at the `80` ceiling with no margin, displayable SpO₂ below 50). They are retained provisionally, not ratified — see the REVISIT entry in §7.

### Withdrawn governance-markdown encoding gate (2026-07-09)

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-08-18
- **Original Kind:** R
- **Original Status:** SUPERSEDED
- **Origin:** `DECISIONS.md` §8 at `MIGRATION_BASELINE`

**Governance markdown needs an encoding gate (2026-07-09). Status: SUPERSEDED / withdrawn 2026-07-16.** Luke's ruling, after three independent clean scans (2026-07-09; 2026-07-16 × 2 — the latter covering untracked files and confirming all repository Markdown is valid UTF-8, with no U+FFFD and no mojibake signatures). Every mojibake alarm this project has raised has been a **connector-read artifact**: the corruption is in the path Claude reads through, never on disk. A repo-side CI gate is the wrong instrument — it would scan clean files indefinitely, never fire, and falsely imply the read path had been validated.

*The reasoning error, named so it is not repeated.* The original entry correctly identified the 2026-07-09 alarm as a connector artifact and then concluded that "the underlying gap stands" by analogy to `banks/*.json`. **The analogy does not transfer.** `scanForReplacementChar` guards bank JSON because bank JSON is *machine-consumed* — a U+FFFD there ships silently to a learner. Governance markdown is *read by humans and models*, so a corrupted glyph is visible at the point of use, and has in fact been caught by the reader every time. Different consequence class, different control. **Do not re-open this by citing "banks are gated but markdown isn't."**

*Replacement control*, aimed at the actual failure surface: `CLAUDE.md` (§ *You have filesystem access*) now directs the reading seat to suspect its own connector before the repo and to confirm with a second method before raising an alarm. The residual write-path risk — Claude authoring governance text *through* the suspect connector — is covered by a one-time plain `grep` of the final tree at commit time by a non-connector tool, not by a standing gate.

### Study-session distribution pointer to code

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-08-18
- **Original Kind:** P
- **Original Status:** ACTIVE
- **Origin:** `DECISIONS.md` Reference appendices at `MIGRATION_BASELINE`

**Study-session distribution:** the category weight table and sampler-rule detail this section used to restate in prose now live only in code (`NCLEX_CATEGORY_WEIGHTS` in `src/schema.ts`; `src/sessionSampler.ts`) per principle 10 above. Full original table and calibration narrative: archived.

### Session artifacts implemented-spec pointer list

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-08-18
- **Original Kind:** R
- **Original Status:** ACTIVE
- **Origin:** `DECISIONS.md` Reference appendices at `MIGRATION_BASELINE`

**Session artifacts (implemented spec pointers, not open work):** `Archive/Fixtures/promotion-gate-spec.md` (principles 1–4, operationalized); presentation normalization (implemented 2026-06-12, the rebaseline vehicle for principle 16 — no standalone spec file survives; see `lib/presentation-normalization.ts` and `scripts/tests/presentation-normalization.ts`); `Archive/root-specs-2026-06-18/census-spec.md`; `Archive/study-session-weighting-spec.md`; `Archive/root-cleanup-2026-06-24/tts-queue-builder-codex-spec.md` and `Archive/root-cleanup-2026-06-24/tts-cost-report-codex-spec.md` (principle 20, parked); `Archive/root-cleanup-2026-06-30/exam-layout-extraction-and-tests-codex-spec.md`; `Archive/root-cleanup-2026-06-30/standalone-visual-review-layout-codex-spec.md`; `Archive/Fixtures/shrimp-visual-sweep-spec-v3.md`.
