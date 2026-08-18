# Fresh-review narrow recommission — supplemental disposition

## Authorization and opening identities

- Immutable work order, revision 2: **12417 bytes / SHA-256 `b0b9c05072ed7c5bda86ff797c59e2f2ee08e85b9ea54cb7a09c4081085b0791`**.
- Freshly measured manifest: `audit/decisions-migration-2026-07-29/target-text-manifest.md`, **314811 bytes / SHA-256 `e99335567d157a86f8f2b6f178b7222bf86ccfe15e5f827da5a03864c1d04b31`**.
- Freshly measured `DECISIONS.md`: **76314 bytes / SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`**, byte-identical to `MIGRATION_BASELINE` `d499cc1d0916e03830489ec9cd0324cd1a203a73`.
- Branch: `codex/decisions-migration`; HEAD: `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`.
- Population: exactly `M4.25 / P23#0`, `E050 / M5.5.9`, `E052 / M5.5.11`, and `E076 / M5.5.13`.

The four units below were freshly re-derived from the baseline bytes and the live manifest. The earlier Tranche B/E language and the recommission's defect summary were used only to identify the disputed units, not as clearance.

## M4.25 / `P23#0`

### Contact with baseline and live subject

Baseline `E022`, bytes `[28613,30089)`, states:

> “The split layout (client chart left, active item right) is presentation only. A `case_study` stays one top-level session question — one `AnswerState.caseStudy`, one aggregate submit, one aggregate score.”

It separately states:

> “Moved to code/status — verify there, not here: the exact split allowlist is `STANDALONE_SPLIT_VISUAL_KINDS` in `src/examLayout.ts`; exact pixel/viewBox dimensions, proof-render sizes, and the current case-mapping coverage percentage belong to code and `PROJECT-HISTORY.md`'s current-status section, not this principle.”

The live M4.25 target statement begins:

> “Split layout is presentation only: a case study stays one top-level session question with one aggregate submit and one aggregate score”

and ends its split-eligibility rule with:

> “a kind joins the standalone split allowlist only after a measured proof render.”

### Corrected operative-limb adjudication

1. Split layout is presentation only; case identity remains one top-level question with aggregate submit/score, and grading, storage, spaced repetition, progress, flags, adaptive, and summary key on the top-level ID — **RETAINED IN M4.25 TARGET STATEMENT**.
2. Per-part submit and true unfolding reveal remain deferred because they require storage/grading redesign, and are revisited only if real-session observation identifies aggregate submit as the fidelity bottleneck — **RETAINED IN M4.25 TARGET STATEMENT**.
3. Stage visibility includes global exhibits and all stages through the active part and fails open, showing all stages on an absent or unresolved reference — **RETAINED IN M4.25 TARGET STATEMENT**.
4. Split eligibility depends on measured geometry rather than nominal item type, and allowlist admission requires a measured proof render — **RETAINED IN M4.25 TARGET STATEMENT**.

The exact allowlist symbol, code path, pixel/viewBox dimensions, proof-render sizes, and current coverage percentage are explicitly marked “verify there, not here.” They are implementation/status detail outside the operative constitutional-limb population. A code path is therefore neither an additional operative limb nor a permissible `CARRIED BY` object. No `CARRIED BY` disposition applies to M4.25.

The live fields remain semantically consistent: `Owner` is omitted because split eligibility, grading identity, and stage visibility have separate enforcement surfaces; `src/examLayout.ts` is correctly carried as `Owner` on M4.26/P23#1, where allocation is the whole subject.

**Verdict correction:** the unit remains **CLEAR**. Its verdict does not change; only the prior receipt's invalid code-path carrier language is superseded.

## E050 / M5.5.9

### Contact with baseline and live subject

Baseline `E050`, bytes `[64005,64356)`, SHA-256 `55d77725bb717a2e6d740776c3156acbc4ca82440e20511f1ba3c4a6d5657438`, states:

> “The fishbone ‘workflow-familiarity’ waiver (2026-07-06). Status: SUPERSEDED by principle 25 (§4), on stronger grounds: the fishbone qualifies because it preserves exact values (a partial H/H fishbone is value-complete), not because clinicians are used to seeing one. Vendor ubiquity is explicitly not a qualifying criterion under principle 25.”

The named later source, baseline Principle 25 (`E026`, bytes `[34428,35775)`), states:

> “A redundant element is permissible inside a necessary, value-complete artifact — one that already carries every exact value the item turns on”

and expressly says vendor ubiquity is not a qualifying criterion. The live carrier is M4.29/P25#0, whose target statement preserves the same value-complete definition and excludes inclusion “justified only by vendor ubiquity.”

The live wrapper construction at M5.5.9 identifies:

> `### Fishbone workflow-familiarity waiver (2026-07-06, superseded)`

and pins `[64005,64356)`, 351 bytes, to the same SHA-256 above.

### Corrected operative-limb adjudication

1. Workflow familiarity or vendor ubiquity qualifies a fishbone waiver — **SUPERSEDED BY Principle 25 (`E026`; live M4.29/P25#0)**, which permits the fishbone only on the stronger exact-value/value-completeness ground and explicitly excludes vendor ubiquity.
2. The surviving fishbone qualification is value-completeness—its partial H/H form preserves every exact value the item turns on—not clinician familiarity — **SUPERSEDED BY Principle 25 (`E026`; live M4.29/P25#0)** as the replacement rule and ground.

No source limb is deleted. M5.5.9 correctly preserves the exact superseded source body, labels it `X / SUPERSEDED / HISTORICAL`, and creates no retired identifier.

**Verdict correction:** the unit remains **CLEAR**. Its verdict does not change; the vague “current review-routing and workflow requirements” phrase is superseded by the exact Principle 25 source and exact-value/value-completeness ground above.

## E052 / M5.5.11

### Contact with baseline and live subject

Baseline `E052`, bytes `[64838,66593)`, SHA-256 `d9e68b9dd5b29f17da155e2021b9b72da91172c677ce8cf445de48da676a4d76`, opens:

> “Governance markdown needs an encoding gate (2026-07-09). Status: SUPERSEDED / withdrawn 2026-07-16.”

It rejects the bank-JSON analogy:

> “The analogy does not transfer. `scanForReplacementChar` guards bank JSON because bank JSON is machine-consumed … Governance markdown is read by humans and models, so a corrupted glyph is visible at the point of use.”

Its named replacement control is:

> “`CLAUDE.md` (§ You have filesystem access) now directs the reading seat to suspect its own connector before the repo and to confirm with a second method before raising an alarm. The residual write-path risk … is covered by a one-time plain `grep` of the final tree at commit time by a non-connector tool, not by a standing gate.”

The current tracked `CLAUDE.md` section `## You have filesystem access — use it` carries that same directive: connector encoding is treated as a connector-read artifact until independently confirmed, and governance text authored through the connector receives a plain final-tree `grep` before commit.

The live wrapper construction at M5.5.11 identifies:

> `### Withdrawn governance-markdown encoding gate (2026-07-09)`

and pins `[64838,66593)`, 1755 bytes, to the same SHA-256 above, including both the named reasoning error and replacement control.

### Corrected operative-limb adjudication

1. Governance Markdown requires a standing repository-side encoding CI gate — **SUPERSEDED BY `CLAUDE.md` § `You have filesystem access — use it`**, specifically its connector-distrust-and-second-method directive, together with its one-time non-connector plain `grep` of the final tree before connector-authored governance text is committed.
2. A connector-reported U+FFFD/mojibake alarm may be treated as on-disk corruption without independent confirmation — **SUPERSEDED BY the same named `CLAUDE.md` directive**, which requires suspecting the reader first and confirming by a second method.

M4.50/JSON quote hygiene is not a carrier and is not the superseding authority: baseline E052 expressly identifies the bank-gate analogy as the reasoning error and forbids reopening the governance gate on that ground. No source limb is deleted. M5.5.11 correctly preserves the withdrawn block and its replacement-control history as `X / SUPERSEDED / HISTORICAL`.

**Verdict correction:** the unit remains **CLEAR**. Its verdict does not change; the prior M4.50/schema-gate supersession language is replaced by the exact `CLAUDE.md` control and one-time non-connector grep named by the baseline source.

## E076 / M5.5.13

### Contact with baseline and live subject

Baseline `E076`, bytes `[75484,76314)`, SHA-256 `3b4454aa392a128b3e074d570c7df0e50fe95927b01329936eabf0194b294039`, identifies itself as:

> “Session artifacts (implemented spec pointers, not open work)”

and lists historical implementation references including `Archive/Fixtures/promotion-gate-spec.md`, `lib/presentation-normalization.ts`, `scripts/tests/presentation-normalization.ts`, the census and study-session specifications, the parked audio specifications, the exam-layout specifications, and the visual-sweep specification.

The live wrapper construction at M5.5.13 identifies:

> `### Session artifacts implemented-spec pointer list`

with `Original Kind: R`, `Original Status: ACTIVE`, source offsets `[75484,76314)`, byte length 830, the same SHA-256 above, and no external separator because the preserved body's final LF is the archive's final byte.

### Corrected operative-limb adjudication

The source unit has **no operative constitutional limb** under the parent order's method. It expressly consists of implemented-spec pointers “not open work”: reference/status metadata and implementation-history detail, not a live obligation. The operative-limb population is therefore empty, so no `SUPERSEDED BY`, `CARRIED BY`, `RETAINED IN ... TARGET STATEMENT`, or `DELETED — FINDING` disposition is manufactured for it.

The complete historical pointer list is nevertheless preserved byte-for-byte by M5.5.13. That preservation is an archive-construction fact, not a claim that an unspecified later source superseded the list.

**Verdict correction:** the unit remains **CLEAR**. Its verdict does not change; the prior unnamed “current operational/source paths” supersession phrase is superseded by the zero-operative-limb adjudication above.

## Corrected four-unit composite disposition

**ACCEPT**

All four recommissioned units are freshly **CLEAR** under the corrected operative-limb dispositions above. This corrected composite result supersedes the original receipt language on these four units only.

`FRESH-FULL-REVIEW-TRANCHE-B-2026-08-07.md`, `FRESH-FULL-REVIEW-TRANCHE-E-2026-08-07.md`, and `FRESH-FULL-REVIEW-DISPOSITION-2026-08-07.md` are superseded by this supplemental record only for M4.25/P23#0, E050/M5.5.9, E052/M5.5.11, and E076/M5.5.13. They stand as originally written everywhere else. The other 74 reviewed units and all Tranche F/M5/M6/F1–F9 results are not reopened.

No manifest repair, receipt edit, source mutation, Task 2, Task 3, date-occurrence report, Stage 2b work, owner ratification, staging, commit, or Git-state change is authorized or performed by this supplemental disposition.
