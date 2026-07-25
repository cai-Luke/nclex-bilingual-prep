# DECISIONS.md Cleanup — Phase 1 (Correction Pass) — Findings

Conflicts, duplications, the LAPSED review queue, the count delta against pass 2 (causes attributed),
the `MISSING`-class reconciliation, and the verification record. **Nothing here edits `DECISIONS.md`.**

`CORRECTION_HEAD = 547fdea695ed55df5afbf2260bb6a4502258ccba` (the commit carrying only the amended
survey spec and the correction work order).
`generatorGitSha = 04800f4dadd95ce0f16008111eb50141f56df55f` (the corrected-generator commit).
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
| Valid historical / correct citation | 143 | reads correctly as-is; no action |
| Stale present-tense authority claim | 0 | none found (see inspection below) |
| Restoration-dependent | 1 | correctness depends on the phase-2 restoration itself |
| Segregated: governance self-reference | (59, included in the 143) | this cleanup's own governance text discussing the lapse |
| **Total** | **151** (67 `Archive/` + 59 governance-self + 25 other-live-doc, all individually inspected for the 25; `Archive/` sampled) | |

**"Valid historical / correct citation" (143 of 151):**

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
  own explanation; correct by definition. Line 387 (E074) is **not** filed here — see "restoration-
  dependent" below and the flag in §F.
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

**`other` is a finding, not a remainder — named per the work order's requirement.** All 129 were
inspected by class of cause; none is a single anomaly worth listing individually at full precision
(precision-over-volume, taxonomy §2/principle 7), but by shape: dangling principle-number references
that don't exist (the fixture's own deliberate test case, not present in this real-corpus run), dangling
same-file section numbers with no decimal/CFR shape and no line-wrap signature (genuine, isolated
citation gaps — a phase-2/human-review candidate list, not reproduced here in full to avoid a
32,000-token dump of 129 near-identical-looking rows), and a handful of dangling Markdown-link anchors.
**Proposed refinement, not implemented here (§3.5 — targeting changes come from the architect seat):**
a distinct `dangling-anchor` class would let `other` shrink to genuinely unclassified residue only.

**Plausibility-gate side effect, disclosed (not one of the four named defects, §3.5):** the structural
path-token recognition required by §3.2/3.3 initially matched thousands of decimal numbers and short
abbreviations as pseudo-paths (a real corpus measurement, not a fixture artifact — see the generator's
second commit message for the exact before/after counts). A two-rule plausibility gate (extension ≥ 2
characters; stem not a bare integer) removes that specific noise without reintroducing an enumerated
extension list. It does not — and structurally cannot — remove residual noise from code-identifier
chains (`question.id`, `series.length`), which is real and reported honestly in `unqualified-basename`
above rather than filtered further. This is a design judgment beyond the four listed defects; flagged
here per §3.5's instruction rather than silently applied without comment.

---

## I. Governance-file expected-vs-actual contribution (spec §6, Amendment 5)

| source | principle records (expected / actual) | distinct principles (expected / actual) | bare `§n` (expected / actual) | LAPSED records (expected / actual) |
|---|---|---|---|---|
| Survey spec | ≥45 / **49** | 2,3,5,8,9,12,18,20,**22**,27 / **2,3,5,8,9,12,18,22,27** (no "20" found — grepped, absent) | ≥1 / **1** | ≥36 / **41** |
| Correction work order | 22 / **22** | 2,5,6,8,9,12,18,22,25 / **2,5,6,8,9,12,18,22,25** (exact) | 1 / **1** | 18 / **18** |
| **Combined LAPSED contribution** | ≥54 / **59** | | | |

The work order's self-prediction is exact on every figure. The survey spec's is close but not exact:
"20" appears in its expected distinct-principle list but the file never actually cites principle 20 (I
grepped for it directly — absent). This is not a resolver defect; it is the spec's own advance estimate
being imprecise on one entry, exactly as its own text anticipates ("these figures... exist to be
reconciled against, never adopted").

---

## J. Verification record (correction work order §6; spec §10 as amended)

See the end-of-turn handoff report for the full executed results: `tsc -b`, the two-run diff against the
frozen worktree, the extended negative-control fixture (items 6 and 8) and its deletion, the
`$CORRECTION_HEAD..HEAD` diffs for the five protected files and for `package.json`, the six-path
`--name-only` allowlist check, and the full PR-gate step list including `npm ci`.

---

## K. Non-goals honored (spec §9; correction work order §7)

No edit/move/reorder/retitle/renumber/compress/delete in `DECISIONS.md`; no edit to `CLAUDE.md`,
`AGENTS.md`, `PROJECT-HISTORY.md`, `NCLEX-Question-Schema.md`, or anything under `Archive/`; no status
tag changed and no stale claim corrected in place (E074 flagged only, §F.3); no archive file created and
no content moved toward one; `package.json` unchanged across the whole `$CORRECTION_HEAD..HEAD` range;
no `.github/workflows/`, bank, schema, renderer, or runtime file touched; no phase-2 spec, no proposed
compressed wording; no second pull request opened; no merge.
