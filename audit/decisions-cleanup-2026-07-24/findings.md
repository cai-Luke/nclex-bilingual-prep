# DECISIONS.md Cleanup — Phase 1 (Correction Pass) — Findings

Conflicts, duplications, the LAPSED review queue, the count delta against pass 2 (causes attributed),
the `MISSING`-class reconciliation, and the verification record. **Nothing here edits `DECISIONS.md`.**

`CORRECTION_HEAD = 547fdea695ed55df5afbf2260bb6a4502258ccba` (the commit carrying only the amended
survey spec and the correction work order).
`generatorGitSha = 5c77b153855b308761d2b5da1e99d33ad6da99a9` (the final corrected-generator commit —
`69a8034` and `04800f4` were superseded by the tracked-index-precedence fix, §H above, before this
graph's final regeneration; confirmed to match `reference-graph.json`'s own `generatorGitSha` field).
`SURVEY_HEAD = f68210ceb62e42d7f028157629a770faf02eab42` (pass 2's baseline — historical, not reused;
retained below only to attribute count deltas).

---

## A. Corrections to pass 2's own defects (not owner ratifications)

Architect review refused pass 2 on six defects (Amendment 5). Three were the spec's own (now fixed by
Amendment 5 itself — frozen-input purity, the `MERGE_INTO` destination, the extension-allowlist
authorization gap). Three were producer defects, corrected this pass:

1. **Generator: Oxford-comma principle lists dropped their final integer.** Fixed (correction work
   order §3.1) — see the commit history on `scripts/decisions-reference-graph.ts` for the exact
   grammar change. Verified: the corpus-wide recovery is **exactly +10 principle records**, of which
   **+5 target principle 22** — matching the work order's own count of "ten in-scope occurrences...
   five of them dropping principle 22" precisely (§G below).
2. **Generator: `.tsx` paths truncated to `.ts`; untracked-extension paths (`.css`) never extracted;
   unqualified basenames and glob fragments mis-extracted.** Fixed by removing the extension allowlist
   in favor of structural recognition against the tracked-path index, plus a plausibility gate that
   excludes decimal numbers and short abbreviations from being treated as path candidates at all (§3.2–
   3.4; the plausibility gate is a refinement beyond the four named defects, flagged as a proposed
   amendment in §H below since it wasn't itself one of the four).
3. **`E047c` breached the ratified taxonomy** (`X | REVISIT`, and `REVISIT` is `T`-only). Repaired:
   status `REVISIT`→`ACTIVE`. Full reasoning: `inventory.md` §4.1.
4. **`E029` was an unnumbered `R`** (taxonomy §7 permits this only when routed to
   `UNCLEAR_REQUIRES_OWNER`). Repaired: reclassified kind `P`, sharing permanent ID `P25` as an
   application (precedented by `E013`/`E015`), no `R` number minted. Full reasoning, and the recorded
   alternative reading, both R-numbered: `inventory.md` §4.2.

**Net result: zero force-change escalations survive into this pass's migration table** (unchanged from
pass 2) — every force-before equals its force-after once force is read from the entry's own wording.

---

## B. E037 — `MERGE_INTO` (Amendment 5's new destination, first application)

Full four-condition verification: `inventory.md` §4.3. Summary: `E037`'s first rule returns to
principle 8's restored core (**E039a**); its second rule — producer provenance and independent-review
routing — is an application of principles 2 and 5 and attaches to **both E002 and E006**, now shown
explicitly on those rows rather than only asserted in a note on `E037`'s own row (the work order's
explicit instruction). No permanent ID is proposed; the ruling that refuses one is named in the
migration table's own cell.

---

## C. The LAPSED review queue — two axes (correction work order §5.2)

Pass 2 presented 116 lapsed references as a three-category sort plus a 77-item "open owner question"
bucket — 66 + 0 + 39 + 77 = 182 against a population of 116, because its categories overlapped rather
than partitioned (every principle-8 citation was *simultaneously* category 3 **and**, in the majority of
cases, also counted toward the `Archive/`-sourced category 1 bucket). The correction work order requires
two **separate, genuinely partitioning** axes instead. Recomputed from the regenerated graph, whose
total is **151**, not 116 (§G explains why it grew and that the growth is not a defect).

### Axis 1 — citation-context disposition (how the citing text itself reads)

| disposition | count | what it means |
|---|---|---|
| Valid historical / correct citation | **150** | reads correctly as-is; no action |
| Stale present-tense authority claim | 0 | none found among the 151 citations themselves (see the E074 note below for a related but distinct flag) |
| Restoration-dependent | 1 | correctness depends on the phase-2 restoration itself |
| Segregated: governance self-reference | (59, included in the 150) | this cleanup's own governance text discussing the lapse |
| **Total** | **151** — 67 `Archive/` + 59 governance-self + 16 within `DECISIONS.md` itself + 3 `PRODUCER-VOCABULARY-LEAKAGE...` + 5 `PROJECT-HISTORY.md` = 150 valid-historical, + 1 restoration-dependent (`DECISIONS-TAXONOMY-2026-07-24.md:241`) = **151**, a genuine partition (each of the 151 records appears in exactly one row above) | |

**Correcting an arithmetic error from this pass's first draft:** the "valid historical" row previously
read 143, which was a transcription slip against the five-bucket breakdown below it (67+59+16+3+5=150);
143+0+1=144 ≠ 151, which an external review caught. The breakdown below was always 150/1/151-consistent;
only the summary-row number was wrong, now fixed.

**Where E074's citations land, made explicit (they were not obviously accounted for before):** `E074`
(`DECISIONS.md:387`) contributes 5 of the 16 within-`DECISIONS.md` LAPSED records (3 from "principles
3, 5, 8, 18, 22" — of which 8, 18, 22 are lapsed — plus 2 from "principle 8/18"). All 5 are correctly
filed under **valid historical / correct citation** here, because the graph's classification of *the
citation* is accurate (principle 8/18 genuinely are `LAPSED` at `CORRECTION_HEAD`, and E074 is not
claiming otherwise). The separate concern — that `E074`'s *own prose* leans on a retired lane's framing
to justify a still-`ACTIVE` rule — is a defect in `E074`'s wording, not in how its citations classify on
this axis, and is flagged as its own item (§F.3), not double-counted here.

**"Valid historical / correct citation" (150 of 151):**

- **67 `Archive/`-sourced.** Every one sits in a spec that either predates the 2026-07-18 lapse
  (describing the then-active pipeline) or **is** the retirement spec itself
  (`Archive/root-specs-2026-07-18/OPUS-SKELETON-RETIREMENT-CODEX-SPEC-2026-07-18.md`, 5 citations).
  Largest single source: `Archive/opus-skeleton-retrofit-spec.md` (18). Spot-checked two at random
  (`Archive/DECISIONS-ARCHIVE-2026-07-14.md:363`, `Archive/PROJECT-HISTORY-ARCHIVE.md:341`) — both
  confirmed past-tense chronology, no anomaly. A full per-file sweep (26 distinct files) found none
  dated or worded as if the lane were still active.
- **59 governance self-reference** (`DECISIONS-CLEANUP-PHASE-1-SURVEY-CODEX-SPEC-2026-07-24.md`: 41;
  `DECISIONS-CLEANUP-PHASE-1-CORRECTION-WORK-ORDER-2026-07-24.md`: 18) — this cleanup's own governance
  text discussing the lapse it is measuring. Structurally category-1-correct by construction (the spec's
  own words: "structurally category 1: self-aware, correct, requiring no action"), but segregated here
  as its own line because a review queue whose majority is the commission discussing itself would
  otherwise obscure the 25 records that are actually worth individual attention.
- **16 within `DECISIONS.md` itself** (lines 300, 302, 387 — the §5 lapse note, the E037 dedup
  paragraph, and the E074 Gemini cross-reference). The first two are the lapse announcement and its
  own explanation; correct by definition. Line 387 (E074) contributes **5 of these 16** and **is**
  filed here — its citations of principle 8/18 are accurate (both genuinely `LAPSED`), even though
  `E074`'s own wording is separately flagged in §F.3 for leaning on the retired lane's framing to
  justify a still-`ACTIVE` rule. That is a defect in `E074`'s prose, not in this classification.
- **3 in `PRODUCER-VOCABULARY-LEAKAGE-REMEDIATION-CODEX-SPEC-2026-07-21.md`** (principle 12, ×3) — a
  model of correct handling, not a defect: *"principle 12 is lapsed with the retired skeleton-generation
  lane and is not the authority for this repair"* and *"without reintroducing lapsed principle 12."* It
  cites the lapsed principle by name precisely to disclaim its authority.
- **5 in `PROJECT-HISTORY.md:1545`** (principles 8, 9, 12, 18, 22) — a 2026-07-14 documentation-pass
  chronology entry recording that these five principles were *then* grouped as one conditional-lane
  section, dated **before** the 2026-07-18 lapse even happened. Past-tense record, not a current claim.

**"Restoration-dependent" (1 of 151):** `DECISIONS-TAXONOMY-2026-07-24.md:241`, *"Principle 8 is
de-conditionalized and retained under its own number"* — this sentence's correctness is contingent on
the phase-2 restoration it announces; it is not simply describing the past, and it is not (yet) simply
describing the present either, since at `CORRECTION_HEAD` principle 8 is still mechanically `LAPSED` on
disk (spec §6's own instruction: the ruling authorizes a restoration, it does not edit the frozen input).

**"Stale present-tense authority claim" (0 of 151, but see the flag in §F):** none of the 151 LAPSED
*records themselves* read as a stale claim under close inspection — but `E074` (Gemini's standing
restrictions, `DECISIONS.md:387`) is a live, `ACTIVE`/`BINDING` entry that **justifies** itself in part
by citing lapsed principles 8/18 in the present tense ("flag-only review in the forward case lane...")
even though the forward case lane it describes is the one that lapsed. This is not a citation *of* a
lapsed principle claiming to be currently authoritative (which would be counted here); it is a
still-authoritative entry whose own supporting text leans on a retired lane's framing. Flagged in §F as
a phase-2 wording question, not counted in this axis because the citation target (principle 8/18) is
correctly marked `LAPSED` by the graph either way — the staleness, if any, is in `E074`'s prose, not in
the reference graph's classification of the citation.

### Axis 2 — target-level owner question (a property of the principle number, not of any one citation)

| principle | disposition | records citing it |
|---|---|---|
| 8 | **RESTORE** — surviving universal core ratified (owner ruling, spec §8) | 47 |
| 9 | **OPEN OWNER QUESTION** — not ruled on | 23 |
| 12 | **OPEN OWNER QUESTION** — not ruled on | 24 |
| 18 | **OPEN OWNER QUESTION** — not ruled on | 23 |
| 22 | **OPEN OWNER QUESTION** — not ruled on | 34 |

**Deviation from the work order's stated binary, recorded rather than silently resolved:** §5.2 asks for
axis 2 to read "restore a surviving universal core, or archive completely." Only principle 8 has either
outcome actually decided (restore). Principles 9, 12, 18, 22 have **neither** outcome ratified — the
spec is explicit that they are "not ruled on" and forbids deciding by analogy to principle 8. Forcing
them into "archive completely" would assert a decision nobody has made. I report a third, honest value
(`OPEN OWNER QUESTION`) for those four rather than picking the tidier binary. A quick read of each
suggests candidates worth asking about specifically: principle 9's CJK-presence gate and principle 18's
"fact-check/currency and flag-review are chain steps, not optional asides" both read as generalizable
beyond the retired lane; principle 12's closed-world-construction mechanism and principle 22's `opus*`-
routing rule are more lane-specific — and 22's routing fragment is *already* independently preserved
live as `E043a` regardless of what happens to principle 22 itself (§D below).

**Two axes partition the same 151 differently and independently** (axis 1 asks "is this citation worded
correctly," axis 2 asks "does this citation's target have a settled fate") — this is the genuine
partition the work order requires, replacing pass 2's overlapping single sort.

---

## D. Force-preservation hazard (unchanged): E043a

`E043b` (principle 22's CONDITIONAL body) is bound for the archive as lapsed conditional material, but
`E036` (the §5 lapse note) states the `opus*` case-ID routing in `scripts/audit/early-bank-semantic-
layer-a.ts` *"is unaffected and stays in force."* The split holds: **E043a** (routing, `I`/`ACTIVE`/
`BINDING`, `EXECUTED`) stays independently of whatever the open owner question above decides about
principle 22 itself. If phase 2 archives P22 as a single unit without preserving E043a as its own live
invariant, a binding rule is silently downgraded.

---

## E. Duplications (compression-rule candidates — taxonomy §2)

- **Category-weighting told three times:** P10 (E010), the "Category targets" invariant (E066), and the
  "Study-session distribution" pointer (E075) — all three point at `NCLEX_CATEGORY_WEIGHTS`/
  `src/sessionSampler.ts`.
- **Vitals-`sanity` told across §3/§7/§8:** the §3 decision-index REVISIT bullet paraphrases E047a/b/c;
  §8 carries E051, a withdrawn characterization of the same subject. Phase 2 regenerates §3 as a
  one-line-per-entry index rather than porting these paraphrases.
- **High reproduced-evidence entries (evidence-fraction ≥ 55%, from `inventory.md`'s re-derived
  per-entry table — compression headroom for phase 2):** E035 (3374 B, ~75%), E047c (1787 B, ~70%),
  E015 (2644 B, ~65%), E021 (2324 B, ~70%), E034 (2911 B, ~65%), E013 (1886 B, ~55%), E052 (1754 B,
  ~60%), E032 (931 B, ~70%), E076 (829 B, ~70%), E073 (1035 B, ~45%, borderline).

---

## F. Open owner questions (complete list)

1. **Do principles 9, 12, 18, or 22 have a surviving universal core?** (§C above.) Not decided; not
   analogized from principle 8's restoration.
2. **Should E074 mint a new principle number?** No bootstrap mechanism exists for minting a *new*
   principle number during this migration (taxonomy §7's bootstrap is explicitly for existing rulings).
3. **E074's own wording** justifies a still-`ACTIVE`/`BINDING` rule partly by citing lapsed principles
   8/18 in present tense ("flag-only review in the forward case lane..."). Flagged, not corrected
   (non-goal §J) — a phase-2 wording question for the owner: should E074 be reworded to cite `E039a`
   (the restored core) instead of the retired lane framing?
4. **E038 (current-producer callout)** — near-`UNCLEAR_REQUIRES_OWNER`: its natural owner is
   `PROJECT-HISTORY.md`, which taxonomy §9 forbids as a destination for this work. `STAY`-as-pointer is
   the least-wrong legal option, not a clean answer.
5. **Should `E029` or `E047c` instead take an `R` number?** Both repairs (`inventory.md` §4.1, §4.2)
   record the alternative R-numbered reading and the exact R-series renumbering it would cause
   (`E029` at 2026-07-19 would insert after `E072`/before `E047a`; `E047c` at 2026-07-15 would insert
   before `E072`). Neither is decided here; both are owner calls.
6. **The `unqualified-basename` MISSING class carries real signal, not just noise** (§H): it contains
   genuine bare-basename citations (`gpt-canonical.json` ×224, `App.tsx` ×61, `schema.ts` ×35, etc.)
   mixed with unavoidable code-identifier-chain noise (`question.id`, `series.length`) that no purely
   structural rule can separate from a real relative path. Not this pass's to fix (§3.5 forbids
   unilateral targeting-rule changes); flagged as a possible phase-2 refinement.

---

## G. Reference graph — count deltas against pass 2, causes attributed

Pass 2 (old generator, `SURVEY_HEAD`): 8,326 references, 3,023 `MISSING`, 116 `LAPSED`. This pass:
11,439 references, 5,829 `MISSING`, 151 `LAPSED` — a large jump that is **not evidence of a regression**;
it decomposes cleanly into two independent, separately-measured causes. A throwaway control run
(the corrected generator against `SURVEY_HEAD`'s own frozen corpus, `f68210c` — generated, diffed,
and its worktree removed, exactly as for the real deliverable) isolates the generator-fix contribution
from the corpus-growth contribution:

| | pass 2 (old gen, `f68210c`) | control (new gen, `f68210c`) | this pass (new gen, `CORRECTION_HEAD`) |
|---|---|---|---|
| references | 8,326 | 11,339 | 11,439 |
| resolved | 5,286 | 5,512 | 5,593 |
| live | 5,170 | 5,391 | 5,442 |
| lapsed | 116 | 121 | 151 |
| missing | 3,023 | 5,810 | 5,829 |
| `path` | 6,633 | 9,636 | 9,699 |
| `principle` | 569 | 579 | 615 |
| `section` | 982 | 982 | 983 |

**Generator-fix-only delta (col 1→2, same corpus):**

- `principle` **+10** — exactly the Oxford-comma fix's expected recovery (work order §3.1: "ten
  in-scope occurrences" of the dropped-final-integer bug).
- `lapsed` **+5** — exactly the subset of those ten that target principle 22 (work order §3.1: "five
  of the dropped integers are principle 22"). Both figures reproduce the work order's own count
  precisely, which is independent confirmation the grammar fix is correct, not merely plausible.
- `section` **+0** — confirms the bare-`§n` resolution logic itself is unchanged; only the new
  `class` field was added for `MISSING` records of this kind.
- `path` **+3,003**, `missing` **+2,787** — dominated by removing the extension allowlist: `.css` and
  full (untruncated) `.tsx` paths are now extracted at all, and previously-invisible bare basenames and
  glob fragments are now extracted, correctly fail resolution, and are classified rather than silently
  never appearing as references in the first place.

**Corpus-growth-only delta (col 2→3, same corrected generator):**

- `principle` **+36**, `lapsed` **+30**, `section` **+1** — attributable to the two governance files
  (§I below gives their exact measured contribution; the delta here is smaller than their full
  contribution because the survey spec file already existed, pre-Amendment-5, in pass 2's own corpus —
  only its *incremental* Amendment-5 text plus the entirely-new work order file contribute to this
  column's delta).
- `path` **+63**, `missing` **+19** — the two files' own bare-path and basename mentions (e.g. the
  work order's own quoted extraction-defect examples).

Both decompositions are internally consistent with the work order's own predicted figures and with each
other; nothing in either column is an unattributed jump.

---

## H. `MISSING`-class reconciliation (correction work order, spec §10 item 9)

Every `MISSING` record carries exactly one generator-assigned class. Totals at `CORRECTION_HEAD`:

| class | count | what it is |
|---|---|---|
| `absent-tracked-path` | 443 | a real, directory-qualified path that isn't tracked — genuine broken/moved-file citations |
| `unqualified-basename` | 5,206 | a bare filename cited without its directory (real basenames like `gpt-canonical.json` mixed with code-identifier-chain noise — §F.6) |
| `glob-or-pattern` | 33 | a glob token (`banks/*-canonical.json`) — not a literal tracked path by construction |
| `external-law-section` | 4 | a `§n` reading as an external statute citation (`45 CFR § 46.116(b)(8)`), not a local numbered section |
| `decimal-subsection` | 10 | a `§n.m` decimal citation the integer-only bare-`§n` rule captures as just `n` |
| `line-wrap-grammar` | 4 | a `§n` reference whose disambiguating context sits across a hard paragraph wrap the per-line extractor can't see |
| `other` | 129 | a genuine dangling reference with none of the above shape — the actual human-review candidate list |
| **Total** | **5,829** | |

**`other` is a finding, not a remainder — every record named, per the work order's explicit
requirement** ("name every record in it" — an earlier draft of this file instead grouped them by shape
and declined to reproduce the list; external review correctly identified that as not satisfying the
requirement, and this is the fix). All 129 are dangling same-file bare-`§n` citations (128 of kind
`section`, 1 of kind `path-section`) with none of the decimal-subsection/external-law-section/
line-wrap-grammar shape — genuine citation gaps in specs whose own numbered-section structure doesn't
reach the cited number (frequently because the citing spec's section numbering was later renumbered or
the spec itself never had that many top-level sections). This is a real, if low-severity, human-review
candidate list, not extraction noise:

| source | line | raw | target |
|---|---|---|---|
| `Archive/case-skeleton-pipeline-spec.md` | 34 | `§3` | `Archive/case-skeleton-pipeline-spec.md#section-3` |
| `Archive/case-skeleton-pipeline-spec.md` | 44 | `§2` | `Archive/case-skeleton-pipeline-spec.md#section-2` |
| `Archive/case-skeleton-pipeline-spec.md` | 44 | `§5` | `Archive/case-skeleton-pipeline-spec.md#section-5` |
| `Archive/early-bank-semantic-audit-spec.md` | 3 | `§10` | `Archive/early-bank-semantic-audit-spec.md#section-10` |
| `Archive/early-bank-semantic-audit-spec.md` | 22 | `§10` | `Archive/early-bank-semantic-audit-spec.md#section-10` |
| `Archive/io-trend-proof-iterations-2026-07-13/IO-TREND-PROOF-BATCH-BRIEF-2026-07-09.md` | 1 | `§11` | `Archive/io-trend-proof-iterations-2026-07-13/IO-TREND-PROOF-BATCH-BRIEF-2026-07-09.md#section-11` |
| `Archive/io-trend-proof-iterations-2026-07-13/IO-TREND-PROOF-BATCH-BRIEF-2026-07-09.md` | 6 | `§11` | `Archive/io-trend-proof-iterations-2026-07-13/IO-TREND-PROOF-BATCH-BRIEF-2026-07-09.md#section-11` |
| `Archive/io-trend-proof-iterations-2026-07-13/IO-TREND-PROOF-BATCH-BRIEF-2026-07-13-REISSUE-GPT56SOL.md` | 1 | `§11` | `Archive/io-trend-proof-iterations-2026-07-13/IO-TREND-PROOF-BATCH-BRIEF-2026-07-13-REISSUE-GPT56SOL.md#section-11` |
| `Archive/io-trend-proof-iterations-2026-07-13/IO-TREND-PROOF-BATCH-BRIEF-2026-07-13-REISSUE-GPT56SOL.md` | 8 | `§11` | `Archive/io-trend-proof-iterations-2026-07-13/IO-TREND-PROOF-BATCH-BRIEF-2026-07-13-REISSUE-GPT56SOL.md#section-11` |
| `Archive/io-trend-proof-iterations-2026-07-13/IO-TREND-PROOF-BATCH-BRIEF-2026-07-13-V2-PRODUCER-GPT56SOL.md` | 1 | `§11` | `Archive/io-trend-proof-iterations-2026-07-13/IO-TREND-PROOF-BATCH-BRIEF-2026-07-13-V2-PRODUCER-GPT56SOL.md#section-11` |
| `Archive/io-trend-proof-iterations-2026-07-13/IO-TREND-PROOF-BATCH-BRIEF-2026-07-13-V2-PRODUCER-GPT56SOL.md` | 7 | `§11` | `Archive/io-trend-proof-iterations-2026-07-13/IO-TREND-PROOF-BATCH-BRIEF-2026-07-13-V2-PRODUCER-GPT56SOL.md#section-11` |
| `Archive/io-trend-proof-iterations-2026-07-13/IO-TREND-PROOF-BATCH-KEY-REVEAL-2026-07-13-ARCHITECT-ONLY.md` | 1 | `§11` | `Archive/io-trend-proof-iterations-2026-07-13/IO-TREND-PROOF-BATCH-KEY-REVEAL-2026-07-13-ARCHITECT-ONLY.md#section-11` |
| `Archive/io-trend-proof-iterations-2026-07-13/IO-TREND-PROOF-BATCH-KEY-REVEAL-2026-07-13-ARCHITECT-ONLY.md` | 25 | `§0` | `Archive/io-trend-proof-iterations-2026-07-13/IO-TREND-PROOF-BATCH-KEY-REVEAL-2026-07-13-ARCHITECT-ONLY.md#section-0` |
| `Archive/io-trend-proof-iterations-2026-07-13/IO-TREND-PROOF-BATCH-KEY-REVEAL-2026-07-13-ARCHITECT-ONLY.md` | 25 | `§9` | `Archive/io-trend-proof-iterations-2026-07-13/IO-TREND-PROOF-BATCH-KEY-REVEAL-2026-07-13-ARCHITECT-ONLY.md#section-9` |
| `Archive/NCLEX-Bank-Audit-TASK.md` | 127 | `§11` | `Archive/NCLEX-Bank-Audit-TASK.md#section-11` |
| `Archive/rationale-visual-floor-retirement-2026-07-20/WORK-ORDER.md` | 115 | `DECISIONS.md §30` | `DECISIONS.md#section-30` |
| `Archive/rhythm-strip-audit-spec.md` | 3 | `§7` | `Archive/rhythm-strip-audit-spec.md#section-7` |
| `Archive/rhythm-strip-audit-spec.md` | 3 | `§9` | `Archive/rhythm-strip-audit-spec.md#section-9` |
| `Archive/rhythm-strip-audit-spec.md` | 3 | `§10` | `Archive/rhythm-strip-audit-spec.md#section-10` |
| `Archive/rhythm-strip-audit-spec.md` | 45 | `§7` | `Archive/rhythm-strip-audit-spec.md#section-7` |
| `Archive/rhythm-strip-audit-spec.md` | 47 | `§7` | `Archive/rhythm-strip-audit-spec.md#section-7` |
| `Archive/rhythm-strip-audit-spec.md` | 81 | `§7` | `Archive/rhythm-strip-audit-spec.md#section-7` |
| `Archive/root-cleanup-2026-06-26/adversarial-audit-phase-a-patch-codex-spec.md` | 7 | `§8` | `Archive/root-cleanup-2026-06-26/adversarial-audit-phase-a-patch-codex-spec.md#section-8` |
| `Archive/root-cleanup-2026-06-26/adversarial-audit-phase-a-patch-codex-spec.md` | 11 | `§8` | `Archive/root-cleanup-2026-06-26/adversarial-audit-phase-a-patch-codex-spec.md#section-8` |
| `Archive/root-cleanup-2026-06-26/adversarial-audit-phase-a-patch-codex-spec.md` | 156 | `§8` | `Archive/root-cleanup-2026-06-26/adversarial-audit-phase-a-patch-codex-spec.md#section-8` |
| `Archive/root-cleanup-2026-06-26/adversarial-audit-phase-a-pilot-spec.md` | 43 | `§10` | `Archive/root-cleanup-2026-06-26/adversarial-audit-phase-a-pilot-spec.md#section-10` |
| `Archive/root-cleanup-2026-06-26/adversarial-audit-phase-a-pilot-spec.md` | 145 | `§9` | `Archive/root-cleanup-2026-06-26/adversarial-audit-phase-a-pilot-spec.md#section-9` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 11 | `§6` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-6` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 11 | `§7` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-7` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 11 | `§4` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-4` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 11 | `§5` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-5` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 14 | `§3` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-3` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 14 | `§4` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-4` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 14 | `§5` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-5` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 56 | `§9` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-9` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 71 | `§4` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-4` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 71 | `§5` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-5` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 97 | `§3` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-3` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 97 | `§5` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-5` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 130 | `§5` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-5` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 141 | `§6` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-6` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 141 | `§7` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-7` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 143 | `§9` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-9` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 148 | `§5` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-5` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 157 | `§9` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-9` |
| `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md` | 170 | `§5` | `Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md#section-5` |
| `Archive/root-cleanup-2026-06-26/CODEX-PHASE-B-COHERENCE-HANDOFF-2026-06-26.md` | 65 | `§6` | `Archive/root-cleanup-2026-06-26/CODEX-PHASE-B-COHERENCE-HANDOFF-2026-06-26.md#section-6` |
| `Archive/root-cleanup-2026-06-26/CODEX-PHASE-B-COHERENCE-HANDOFF-2026-06-26.md` | 65 | `§7` | `Archive/root-cleanup-2026-06-26/CODEX-PHASE-B-COHERENCE-HANDOFF-2026-06-26.md#section-7` |
| `Archive/root-cleanup-2026-06-26/CODEX-PHASE-B-COHERENCE-HANDOFF-2026-06-26.md` | 66 | `§4` | `Archive/root-cleanup-2026-06-26/CODEX-PHASE-B-COHERENCE-HANDOFF-2026-06-26.md#section-4` |
| `Archive/root-cleanup-2026-06-26/CODEX-PHASE-B-COHERENCE-HANDOFF-2026-06-26.md` | 66 | `§5` | `Archive/root-cleanup-2026-06-26/CODEX-PHASE-B-COHERENCE-HANDOFF-2026-06-26.md#section-5` |
| `Archive/root-cleanup-2026-06-26/CODEX-PHASE-B-COHERENCE-HANDOFF-2026-06-26.md` | 67 | `§3` | `Archive/root-cleanup-2026-06-26/CODEX-PHASE-B-COHERENCE-HANDOFF-2026-06-26.md#section-3` |
| `Archive/root-cleanup-2026-06-26/CODEX-PHASE-B-COHERENCE-HANDOFF-2026-06-26.md` | 67 | `§4` | `Archive/root-cleanup-2026-06-26/CODEX-PHASE-B-COHERENCE-HANDOFF-2026-06-26.md#section-4` |
| `Archive/root-cleanup-2026-06-26/CODEX-PHASE-B-COHERENCE-HANDOFF-2026-06-26.md` | 67 | `§5` | `Archive/root-cleanup-2026-06-26/CODEX-PHASE-B-COHERENCE-HANDOFF-2026-06-26.md#section-5` |
| `Archive/root-cleanup-2026-06-26/CODEX-PHASE-B-COHERENCE-HANDOFF-2026-06-26.md` | 95 | `§5` | `Archive/root-cleanup-2026-06-26/CODEX-PHASE-B-COHERENCE-HANDOFF-2026-06-26.md#section-5` |
| `Archive/root-cleanup-2026-06-26/early-bank-semantic-layer-a-enhancement-codex-spec.md` | 6 | `§4` | `Archive/root-cleanup-2026-06-26/early-bank-semantic-layer-a-enhancement-codex-spec.md#section-4` |
| `Archive/root-cleanup-2026-06-26/early-bank-semantic-layer-a-enhancement-codex-spec.md` | 34 | `§2` | `Archive/root-cleanup-2026-06-26/early-bank-semantic-layer-a-enhancement-codex-spec.md#section-2` |
| `Archive/root-cleanup-2026-06-26/early-bank-semantic-layer-a-enhancement-codex-spec.md` | 34 | `§3` | `Archive/root-cleanup-2026-06-26/early-bank-semantic-layer-a-enhancement-codex-spec.md#section-3` |
| `Archive/root-cleanup-2026-06-26/early-bank-semantic-layer-a-enhancement-codex-spec.md` | 53 | `§2` | `Archive/root-cleanup-2026-06-26/early-bank-semantic-layer-a-enhancement-codex-spec.md#section-2` |
| `Archive/root-cleanup-2026-06-26/GEMINI-AUDIT-HANDOFF-2026-06-24.md` | 35 | `§7` | `Archive/root-cleanup-2026-06-26/GEMINI-AUDIT-HANDOFF-2026-06-24.md#section-7` |
| `Archive/root-cleanup-2026-06-26/GEMINI-AUDIT-HANDOFF-2026-06-24.md` | 105 | `§5` | `Archive/root-cleanup-2026-06-26/GEMINI-AUDIT-HANDOFF-2026-06-24.md#section-5` |
| `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md` | 40 | `§6` | `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md#section-6` |
| `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md` | 40 | `§7` | `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md#section-7` |
| `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md` | 40 | `§4` | `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md#section-4` |
| `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md` | 41 | `§5` | `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md#section-5` |
| `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md` | 43 | `§3` | `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md#section-3` |
| `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md` | 44 | `§4` | `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md#section-4` |
| `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md` | 44 | `§5` | `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md#section-5` |
| `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md` | 152 | `§3` | `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md#section-3` |
| `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md` | 191 | `§5` | `Archive/root-cleanup-2026-06-26/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md#section-5` |
| `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md` | 57 | `§6` | `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md#section-6` |
| `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md` | 58 | `§7` | `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md#section-7` |
| `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md` | 58 | `§4` | `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md#section-4` |
| `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md` | 59 | `§5` | `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md#section-5` |
| `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md` | 61 | `§3` | `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md#section-3` |
| `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md` | 62 | `§4` | `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md#section-4` |
| `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md` | 62 | `§5` | `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md#section-5` |
| `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md` | 78 | `§6` | `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md#section-6` |
| `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md` | 78 | `§7` | `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md#section-7` |
| `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md` | 79 | `§5` | `Archive/root-cleanup-2026-06-26/GPT5-AUDIT-HANDOFF-2026-06-24.md#section-5` |
| `Archive/root-cleanup-2026-06-26/PHASE-B-COHERENCE-HANDOFF-2026-06-25.md` | 90 | `§6` | `Archive/root-cleanup-2026-06-26/PHASE-B-COHERENCE-HANDOFF-2026-06-25.md#section-6` |
| `Archive/root-cleanup-2026-06-26/PHASE-B-COHERENCE-HANDOFF-2026-06-25.md` | 90 | `§7` | `Archive/root-cleanup-2026-06-26/PHASE-B-COHERENCE-HANDOFF-2026-06-25.md#section-7` |
| `Archive/root-cleanup-2026-06-26/PHASE-B-COHERENCE-HANDOFF-2026-06-25.md` | 90 | `§4` | `Archive/root-cleanup-2026-06-26/PHASE-B-COHERENCE-HANDOFF-2026-06-25.md#section-4` |
| `Archive/root-cleanup-2026-06-26/PHASE-B-COHERENCE-HANDOFF-2026-06-25.md` | 90 | `§5` | `Archive/root-cleanup-2026-06-26/PHASE-B-COHERENCE-HANDOFF-2026-06-25.md#section-5` |
| `Archive/root-cleanup-2026-06-26/PHASE-B-COHERENCE-HANDOFF-2026-06-25.md` | 92 | `§3` | `Archive/root-cleanup-2026-06-26/PHASE-B-COHERENCE-HANDOFF-2026-06-25.md#section-3` |
| `Archive/root-cleanup-2026-06-26/PHASE-B-COHERENCE-HANDOFF-2026-06-25.md` | 92 | `§4` | `Archive/root-cleanup-2026-06-26/PHASE-B-COHERENCE-HANDOFF-2026-06-25.md#section-4` |
| `Archive/root-cleanup-2026-06-26/PHASE-B-COHERENCE-HANDOFF-2026-06-25.md` | 92 | `§5` | `Archive/root-cleanup-2026-06-26/PHASE-B-COHERENCE-HANDOFF-2026-06-25.md#section-5` |
| `Archive/root-cleanup-2026-06-26/PHASE-B-COHERENCE-HANDOFF-2026-06-25.md` | 102 | `§5` | `Archive/root-cleanup-2026-06-26/PHASE-B-COHERENCE-HANDOFF-2026-06-25.md#section-5` |
| `Archive/root-cleanup-2026-07-02/codex-handoff-2026-07-02.md` | 11 | `§2` | `Archive/root-cleanup-2026-07-02/codex-handoff-2026-07-02.md#section-2` |
| `Archive/root-cleanup-2026-07-02/codex-handoff-2026-07-02.md` | 13 | `§10` | `Archive/root-cleanup-2026-07-02/codex-handoff-2026-07-02.md#section-10` |
| `Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md` | 435 | `§4` | `Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md#section-4` |
| `Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md` | 464 | `§4` | `Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md#section-4` |
| `Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md` | 634 | `§4` | `Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md#section-4` |
| `Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md` | 740 | `§4` | `Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md#section-4` |
| `Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md` | 764 | `§5` | `Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md#section-5` |
| `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md` | 6 | `§1` | `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md#section-1` |
| `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md` | 26 | `§10` | `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md#section-10` |
| `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md` | 34 | `§7` | `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md#section-7` |
| `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md` | 41 | `§4` | `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md#section-4` |
| `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md` | 41 | `§5` | `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md#section-5` |
| `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md` | 41 | `§6` | `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md#section-6` |
| `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md` | 41 | `§8` | `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md#section-8` |
| `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md` | 49 | `§2` | `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md#section-2` |
| `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md` | 76 | `§10` | `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md#section-10` |
| `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md` | 78 | `§15` | `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md#section-15` |
| `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md` | 80 | `§11` | `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md#section-11` |
| `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md` | 118 | `§12` | `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md#section-12` |
| `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md` | 120 | `§4` | `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md#section-4` |
| `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md` | 149 | `§11` | `Archive/root-specs-2026-07-18/IO-TREND-CODEX-HANDOFF-2026-07-09.md#section-11` |
| `Archive/root-specs-2026-07-18/IO-TREND-PROOF-BATCH-BRIEF-2026-07-13-V3-PRODUCER-GPT56SOL.md` | 1 | `§11` | `Archive/root-specs-2026-07-18/IO-TREND-PROOF-BATCH-BRIEF-2026-07-13-V3-PRODUCER-GPT56SOL.md#section-11` |
| `Archive/root-specs-2026-07-18/IO-TREND-PROOF-BATCH-KEY-REVEAL-2026-07-13-V3-ARCHITECT-ONLY.md` | 1 | `§11` | `Archive/root-specs-2026-07-18/IO-TREND-PROOF-BATCH-KEY-REVEAL-2026-07-13-V3-ARCHITECT-ONLY.md#section-11` |
| `Archive/root-specs-2026-07-18/OPUS-SKELETON-RETIREMENT-CODEX-SPEC-2026-07-18.md` | 5 | `§5` | `Archive/root-specs-2026-07-18/OPUS-SKELETON-RETIREMENT-CODEX-SPEC-2026-07-18.md#section-5` |
| `Archive/root-specs-2026-07-18/OPUS-SKELETON-RETIREMENT-CODEX-SPEC-2026-07-18.md` | 78 | `§3` | `Archive/root-specs-2026-07-18/OPUS-SKELETON-RETIREMENT-CODEX-SPEC-2026-07-18.md#section-3` |
| `Archive/root-specs-2026-07-18/OPUS-SKELETON-RETIREMENT-CODEX-SPEC-2026-07-18.md` | 78 | `§5` | `Archive/root-specs-2026-07-18/OPUS-SKELETON-RETIREMENT-CODEX-SPEC-2026-07-18.md#section-5` |
| `Archive/root-specs-2026-07-18/p4_handoff.md` | 34 | `§19` | `Archive/root-specs-2026-07-18/p4_handoff.md#section-19` |
| `Archive/root-specs-2026-07-18/p4_handoff.md` | 34 | `§19` | `Archive/root-specs-2026-07-18/p4_handoff.md#section-19` |
| `Archive/root-specs-2026-07-18/p4_handoff.md` | 34 | `§1` | `Archive/root-specs-2026-07-18/p4_handoff.md#section-1` |
| `Archive/root-specs-2026-07-18/p4_handoff.md` | 35 | `§20` | `Archive/root-specs-2026-07-18/p4_handoff.md#section-20` |
| `Archive/root-specs-2026-07-18/translate-all-reveal-codex-spec.md` | 64 | `§2` | `Archive/root-specs-2026-07-18/translate-all-reveal-codex-spec.md#section-2` |
| `BANK-REVIEW-LEDGER.md` | 1109 | `§11` | `BANK-REVIEW-LEDGER.md#section-11` |
| `BANK-REVIEW-LEDGER.md` | 1113 | `§4` | `BANK-REVIEW-LEDGER.md#section-4` |
| `BANK-REVIEW-LEDGER.md` | 1288 | `§6` | `BANK-REVIEW-LEDGER.md#section-6` |
| `BANK-REVIEW-LEDGER.md` | 1305 | `§8` | `BANK-REVIEW-LEDGER.md#section-8` |
| `BANK-REVIEW-LEDGER.md` | 1337 | `§12` | `BANK-REVIEW-LEDGER.md#section-12` |
| `NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md` | 35 | `§20` | `NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md#section-20` |
| `NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md` | 237 | `§20` | `NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md#section-20` |
| `PROJECT-HISTORY.md` | 920 | `§20` | `PROJECT-HISTORY.md#section-20` |
| `PROJECT-HISTORY.md` | 969 | `§10` | `PROJECT-HISTORY.md#section-10` |
| `TERMINAL-SENTENCE-REMEDIATION-OWNER-RATIFICATION-PACKET-2026-07-22.md` | 12 | `§8` | `TERMINAL-SENTENCE-REMEDIATION-OWNER-RATIFICATION-PACKET-2026-07-22.md#section-8` |
| `TERMINAL-SENTENCE-REMEDIATION-OWNER-RATIFICATION-PACKET-2026-07-22.md` | 147 | `§10` | `TERMINAL-SENTENCE-REMEDIATION-OWNER-RATIFICATION-PACKET-2026-07-22.md#section-10` |

**Proposed refinement, not implemented here (§3.5 — targeting changes come from the architect seat):**
a distinct `dangling-anchor` class would let `other` shrink to genuinely unclassified residue only —
this list contains no dangling anchors at all (that MISSING sub-case doesn't currently occur in the
real corpus), so the class name is future-proofing, not a gap in this table.

**Plausibility-gate side effect, disclosed (not one of the four named defects, §3.5):** the structural
path-token recognition required by §3.2/3.3 initially matched thousands of decimal numbers and short
abbreviations as pseudo-paths (a real corpus measurement, not a fixture artifact — see the generator's
second commit message for the exact before/after counts). A two-rule plausibility gate (extension ≥ 2
characters; stem not a bare integer) removes that specific noise without reintroducing an enumerated
extension list. It does not — and structurally cannot — remove residual noise from code-identifier
chains (`question.id`, `series.length`), which is real and reported honestly in `unqualified-basename`
above rather than filtered further. This is a design judgment beyond the four listed defects; flagged
here per §3.5's instruction rather than silently applied without comment.

**Owner-level generator question, raised by external review and resolved in a third commit:** the
plausibility gate as first written was a genuine second authority — a real tracked file with a
single-character extension or a numeric-only stem (e.g. `1.json`, `x.c`) would have failed the
heuristic and never been recognized as a path reference at all, contradicting the module comment's
claim that the tracked index is the sole authority. Fixed (`5c77b15`) by making tracked-set membership
override the plausibility check at both call sites: a token that fails the heuristic is still accepted
if it is literally tracked. Re-verified against a throwaway fixture (built and deleted) carrying a
tracked `1.json` and a tracked `src/x.c` — both now resolve `LIVE`. Regenerating the real corpus after
this fix produced **identical counts** to the prior run (11,439 references, 5,829 `MISSING`, 151
`LAPSED`, same `missingByClass` breakdown) — this repo has no genuinely-tracked file the earlier gate
was wrongly excluding; the fix closes a real authority gap without changing any reported number.

---

## I. Governance-file expected-vs-actual contribution (spec §6, Amendment 5)

| source | principle records (expected / actual) | distinct principles (expected / actual) | bare `§n` (expected / actual) | LAPSED records (expected / actual) |
|---|---|---|---|---|
| Survey spec | 50 / **49** | 2,3,5,8,9,12,18,20,22,27 / **2,3,5,8,9,12,18,22,27** (principle 20 missed — see below) | ≥1 / **1** | ≥36 / **41** |
| Correction work order | 22 / **22** | 2,5,6,8,9,12,18,22,25 / **2,5,6,8,9,12,18,22,25** (exact) | 1 / **1** | 18 / **18** |
| **Combined LAPSED contribution** | ≥54 / **59** | | | |

**Correcting an earlier misreading of this discrepancy:** an earlier draft of this file said the survey
spec "never actually cites principle 20," based on a single-line grep (`principle 20\|principle20\|
principles.*20\b`) that came back empty. That grep was the wrong test. The spec's own text (lines
603–604) reads *"...the retention of principle\n20, and the substantive reading..."* — a genuine
citation of principle 20, hard-wrapped across a line break, with "principle" ending one physical line
and "20" beginning the next. The generator's targeting rule (spec §6) operates line-by-line: it matches
`\bprinciples?\s+(\d+...)` against a single line's text, and a citation whose number sits on the
*following* line is invisible to it — not merely unresolved, but never extracted as a reference at all,
which is exactly why the expected/actual gap here is one *fewer* extracted record (50 expected, 49
actual) rather than a `MISSING` record with a class. This reconciles the count precisely: the survey
spec genuinely cites 50 principle instances across 10 distinct numbers, and the corrected generator
recovers 49 of them, missing only the one split by this hard wrap.

This is a real, verified gap in the targeting grammar — a citation spanning a physical line break is
invisible to a per-line extractor — but it is **not corrected in this pass**. Per correction work order
§3.5 ("do not fix anything else in extraction without an amendment... targeting changes come from the
architect seat"), extending the principle-citation grammar to look across line boundaries is a targeting
rule change, not a classification refinement, and is out of scope here. **Recorded as a proposed
follow-up for a future, architect-authorized commission:** multiline principle-reference extraction
(joining a `principle`/`principles` token with a wrapped number on the next physical line, bounded so it
does not risk false-positive merges across unrelated adjacent sentences — the same risk this file
already flagged for the `§n of <path>` reversed form in an earlier pass). Not implemented, not
authorized here, and not a defect this correction pass silently worked around.

Aside from this one hard-wrapped miss, the work order's self-prediction is exact on every figure, and
the survey spec's is otherwise exact once the true expected principle-record count (50, not the
originally-stated "≥45" floor) is reconciled against what the corrected generator can actually see
across a line break.

---

## J. Verification record (correction work order §6; spec §10 as amended)

**Committed here, not left in an ephemeral terminal transcript** — an earlier draft of this file pointed
to the "end-of-turn handoff report" for this evidence, which external review correctly flagged as not
satisfying the spec's requirement to report the fixture, its records, and its deletion in the survey's
own artifacts.

**Item 6/8 — extended negative-control fixture.** A throwaway git repository (built outside the corpus,
committed once, deleted after) carrying: `DECISIONS.md` with principles 8 (SUPERSEDED), 9 (ACTIVE), 12
(ACTIVE), 18 (SUPERSEDED); `top.md`, `docs/note.md` (with a `## 3. Detail` heading), `src/App.tsx`,
`src/styles.css`, `src/Same.ts` + `src/Same.tsx`, `sub/widget.json`, `banks/real-canonical.json`; and a
`notes.md` exercising every required case. Results (all as expected):

| case | raw text | expected | actual |
|---|---|---|---|
| Oxford-comma list | `principles 8, 9, 12, 18, and 22` | 5 records (8,9,12,18,22) | 5 records ✓ |
| dangling principle | `principle 77` | `MISSING`/`other` | `MISSING`/`other` ✓ |
| dangling section | `§42` | `MISSING`/`other` | `MISSING`/`other` ✓ |
| dangling anchor | `top.md#does-not-exist` | `MISSING`/`other` | `MISSING`/`other` ✓ |
| LAPSED, resolves:true | `principle 8` (standalone) | `resolves:true, LAPSED` | `resolves:true, LAPSED` ✓ |
| `.tsx` path | `` `src/App.tsx` `` | `LIVE`, full extension | `LIVE`, `src/App.tsx` (not truncated) ✓ |
| tracked `.css` path | `` `src/styles.css` `` | `LIVE` | `LIVE` ✓ |
| same-stem `.ts`/`.tsx` | `` `src/Same.tsx` `` | resolves to `.tsx`, not `.ts` | `LIVE`, target `src/Same.tsx` exactly ✓ |
| unqualified basename | `` `widget.json` `` (real file at `sub/widget.json`) | `MISSING`/`unqualified-basename` | `MISSING`/`unqualified-basename` ✓ |
| glob | `` `banks/*-canonical.json` `` | `MISSING`/`glob-or-pattern`, whole token | `MISSING`/`glob-or-pattern` ✓ |
| relative path (via link) | `[back](../top.md)` from `docs/note.md` | `LIVE` | `LIVE`, target `top.md` ✓ |
| `<path> §n` | `` `docs/note.md` §3 `` | `LIVE` | `LIVE` ✓ |
| decimal-subsection | `§6.1` (own line, no CFR) | `MISSING`/`decimal-subsection` | `MISSING`/`decimal-subsection` ✓ |
| external-law-section | `45 CFR` / `§ 46.116(b)(8)` (hard-wrapped across two lines) | `MISSING`/`external-law-section` | `MISSING`/`external-law-section` ✓ |
| line-wrap-grammar | `§99` at line start, prior line no terminal punctuation | `MISSING`/`line-wrap-grammar` | `MISSING`/`line-wrap-grammar` ✓ |

Two-run determinism on this fixture: diff empty except `generatedAt`. Fixture deleted
(`rm -rf` the throwaway repo) immediately after capture; it never touched the live tree or corpus.

**Second fixture — tracked-index-precedence regression check** (added after external review, §H
above): a second throwaway repository with a tracked `1.json` (numeric stem) and a tracked `src/x.c`
(single-character extension), plus an abbreviation/decimal noise line. Both odd-named tracked files
resolved `LIVE`; the noise line produced no spurious records. Deleted after capture.

**Item 2 — two-run diff against the frozen `CORRECTION_HEAD` worktree:** empty except `generatedAt`,
confirmed twice (once before, once after the third generator commit).

**Items 3, 4, 7 — commit-range checks**, run against the final commit range
`547fdea..d19fca4` (deliverables) and re-confirmed after the follow-up generator commit
(`547fdea..HEAD`):
- `git diff --stat $CORRECTION_HEAD..HEAD -- DECISIONS.md CLAUDE.md AGENTS.md PROJECT-HISTORY.md NCLEX-Question-Schema.md` — empty.
- `git diff --numstat $CORRECTION_HEAD..HEAD -- package.json` — empty (no change).
- `git diff --name-only $CORRECTION_HEAD..HEAD` — exactly `scripts/decisions-reference-graph.ts` and the five deliverables under `audit/decisions-cleanup-2026-07-24/`.
- `git status --porcelain` — empty after each commit.

**Item 1 — `npx tsc -b --pretty false`:** exit 0, run after every generator change (four times total).

**Item 5 — full PR gate, including `npm ci`: run, in the live branch checkout, after the review-fix
commits above.** Every step in `.github/workflows/promotion-gate.yml` (the workflow that runs
`on: pull_request`) plus `npx tsc -b`:

| step | result |
|---|---|
| `npm ci` | pass |
| `npx tsc -b --pretty false` | pass (exit 0) |
| `npm run test-visuals` | **transient failure on first run** — `scripts/tests/visual-parity-promoted.ts` snapshots `git worktree list` before/after its own temporary-worktree cycle and asserts they're identical. Two unrelated, already-`prunable` worktrees left behind by *other* sessions on this machine were present in this repo's worktree registry **before this pass began** (visible in the preflight `git worktree list` output at the start of this task) — that precondition predates this pass and is not something it created. More precisely than "not caused by this pass": this pass's own worktree operations (the detached `CORRECTION_HEAD` measurement worktrees, created and removed several times over the course of the correction and its review fixes) plausibly triggered git's own prune housekeeping, which swept those two already-stale entries during one of those cycles — so the *removal* of the contaminating entries is plausibly attributable to this pass's activity, even though the contamination itself was pre-existing and not introduced by it. Either way, the assertion depends on machine-global worktree-registry state the test does not own or control, not on repo content — no file under `src/visuals` or `scripts/tests/` was touched by this pass. **Passed clean on immediate retry** (199 snapshots, all kind suites, session sampler, rationale-visual-schema-floor). **Flagged as a separate hardening item, not fixed here:** `scripts/tests/visual-parity-promoted.ts` should not assert byte-identical `git worktree list` output across a test run if it does not itself own every entry in that list — a later CI-tooling task should scope the assertion to only the worktree(s) the test itself creates, so ambient state on a shared machine can't fail it. |
| `npm run audit` | **GATE PASSED** (one pre-existing advisory-only distributional warning, `visual-canonical`/`select_all`/`correct_count_distribution` n=11 — the same one `PROJECT-HISTORY.md` already records, unrelated to this work) |
| `npm run test:validate-sweep` | pass |
| `npm run test:non-mcq-bias` | pass |
| `npm run test:schema-bank` | pass |
| `npm run test:flowsheet-gate` | pass |
| `npm run test:structured-measurements` | pass |
| `npm run test:structured-measurements-applicator` | pass |
| `npm run test:coverage-report` | pass |
| `npm run census:check` | up to date |

`git status --porcelain` was empty before and after the full run — no file was modified by any test.

---

## K. Non-goals honored (spec §9; correction work order §7)

No edit/move/reorder/retitle/renumber/compress/delete in `DECISIONS.md`; no edit to `CLAUDE.md`,
`AGENTS.md`, `PROJECT-HISTORY.md`, `NCLEX-Question-Schema.md`, or anything under `Archive/`; no status
tag changed and no stale claim corrected in place (E074 flagged only, §F.3); no archive file created and
no content moved toward one; `package.json` unchanged across the whole `$CORRECTION_HEAD..HEAD` range;
no `.github/workflows/`, bank, schema, renderer, or runtime file touched; no phase-2 spec, no proposed
compressed wording; no second pull request opened; no merge.
