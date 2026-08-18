# Stage 2a Part C — PROVISIONAL ARCHITECT DRAFT

> **NOT THE MANIFEST.** This is not `audit/decisions-migration-2026-07-29/target-text-manifest.md`, is
> not ratified, is not owner-approved wording, and must not be used to begin Stage 2b or to edit
> `DECISIONS.md`. Every statement byte below is a candidate awaiting GPT independent review and Luke's
> exact-byte ratification.

**Manifest status (2026-08-01):** Manifest M4.39–M4.44 supersedes this draft's six `R` records, and
manifest M4.45–M4.56 supersedes its first twelve `I` records — `E038`, `E043a`, `E054`, `E055`, `E056`,
`E057`, `E058`, `E059`, `E060`, `E061`, `E062`, and `E063`. Superseded means the manifest governs those
bytes; it does **not** mean the manifest records are reviewed or cleared. M4.45–M4.50 returned
`CLEAR PROVISIONALLY`, and M4.51–M4.56 were provisionally cleared on 2026-08-01 after one bounded
repair to `E061`. Where the manifest diverges from this
draft's statement, fields, or omission register on a superseded record, the manifest governs and states
the divergence in place. The remaining 7 `I` and 3 `T` records stay preparatory until authored into the
manifest.

**Date:** 2026-07-29 · **Seat:** Architect · **Scope:** Part C only — target §5 rulings R1–R6, target
§6 standing invariants, target §7 open threads.

## Fixed inputs

- `MIGRATION_BASELINE`: `d499cc1d0916e03830489ec9cd0324cd1a203a73`
- Grammar: `DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md` §2.1 for `R`, §2.2 for `I` and `T`
- Kind / status / force / execution: frozen, copied from the live source packet
- Dates: `DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-2026-07-29.md` rows 38–65, with the single owner
  override at row 44 — E038 corrected from `2026-07-18` to `2026-07-28`
- Optional-field policy and the one-physical-line field rule: owner rulings of 2026-07-29

Part C population: 6 `R` cores + 19 `I` entries + 3 `T` entries = 28 blocks. `I` and `T` are
name-addressed and take no attachments. Running total: 18 + 19 + 28 = 65.

**Title conventions adopted.** No name-addressed title begins with a reserved `P<n> ` or `R<n> ` token
(§2.2 checker failure). No title carries an em dash. No title carries a backtick, matching fixtures
`F5` and `F6`, whose titles use bare words where their bodies use identifiers.

---

## 1. Target §5 — concrete rulings

### R1 — Standalone bowtie may be generated directly

A standalone bowtie may be generated directly rather than only harvested from a case skeleton, because
bowtie is standalone-only by construction regardless of origin. A direct generation lane runs through
the normal raw, cross-model review, promote, and ledger pipeline on equal footing with every other item
type. This relaxes neither producer-versus-checker discipline nor the case-embedded compiler's
obligations for bowties that do arise inside a skeleton.

- **Kind:** R
- **Status:** ACTIVE
- **Force:** AUTHORIZING
- **Date:** 2026-07-02
- **Authorized:** Direct standalone-bowtie generation through the normal promotion pipeline.
- **Execution:** EXECUTED

### R2 — CBC units are conventional-first with SI in parentheses

Laboratory unit policy is analyte-aware: each analyte carries its own conventional forms, keyed by
analyte and source unit in one sourced conversion table, never by unit token alone. Accepted source
units stay permissive and extraction preserves the source unit byte-exactly, while display is a separate
policy layer offering a conventional primary with an optional SI parenthetical. One sourced conversion
table serves the sanity gate, parenthetical generation, and prose normalization.

- **Kind:** R
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-05
- **Owner:** `src/measurementUnitPolicy.ts`
- **Execution:** EXECUTED

### R3 — Temperature sanity ceiling 46.5 °C

Copied renderer validation envelopes are not authored plausibility bounds. The flowsheet gate's sanity
ceiling for `temp` is decoupled from the renderer's legacy range and independently authored and ratified
at 46.5 °C. That ceiling executes through a dedicated override while the renderer envelope remains
separate and unchanged.

- **Kind:** R
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-15
- **Evidence:** `Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md`
- **Owner:** `src/measurementAllowlist.ts`
- **Execution:** EXECUTED

### R4 — Promoted visual parity is a committed per-kind baseline

Promoted visual parity is a committed per-kind baseline pinning every promoted identity across all
registered visual kinds and all full-schema visual locations. An intentional renderer change rebaselines
only through the declared-scope rebaseline command, with a per-delta cause and a committed receipt.
Added or removed identities carrying no corresponding bank change fail as identity drift, and the
one-time bootstrap is permanently unavailable.

- **Kind:** R
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-17
- **Evidence:** `Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md`
- **Execution:** EXECUTED

### R5 — Vital sanity ratifications for SBP, RR, and SpO2

Three per-side vital sanity bounds are ratified: an SBP ceiling of 400 mmHg, an RR ceiling of 150 per
minute, and an `spo2` floor of 0%. The governed population is bedside and charted flowsheet values,
which is what selects 400 over the higher instrumented-measurement candidate. Implementation is pending
and must leave renderer envelopes unchanged, may not remove or make optional the sanity minimum, and
requires a fresh corpus-impact survey.

- **Kind:** R
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-24
- **Execution:** PENDING

### R6 — Pull-request and post-merge CI coverage are distinct

Pull-request and post-merge coverage are distinct: a check running only after merge may protect the
deploy but does not prevent the bad merge, and existing post-merge coverage is not by itself a finding
of redundancy. A gate addition therefore requires measured evidence of incremental pre-merge value. Any
further pull-request gate expansion needs its own measured evidence and owner ratification.

- **Kind:** R
- **Status:** ACTIVE
- **Force:** AUTHORIZING
- **Date:** 2026-07-24
- **Authorized:** The build check, topic-population, topic-license as detector-regression coverage only, topic-vocabulary, and an exact-byte drift check for the topic-vocabulary document.
- **Not authorized:** A separate standalone type-check step, fatal live topic-license enforcement, a duplicate promoted-bank validator, and generalized regeneration or drift-checking of historical audit artifacts.
- **Execution:** PENDING

---

## 2. Target §6 — standing invariants

### Producer assignments are operational state, not constitutional text

Current producer assignments are operational state and must be verified against the project history
record rather than assumed timeless from this document. Changing the named producer does not alter
permanent identifiers, provenance classification, or independent-review obligations.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** ADVISORY
- **Date:** 2026-07-28
- **Owner:** `PROJECT-HISTORY.md`

### Deterministic review routing for promoted opus-prefixed case IDs

Already-promoted case identifiers matching the opus prefix pattern route as producer `gpt` at low tier,
equivalent to directly commissioned GPT case items. This routing does not extend to `claude_*` items
Claude authored directly, which remain Claude-produced and route to a non-Claude reviewer. The rule
remains applicable to existing promoted identifiers even though the forward skeleton lane has lapsed.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-18
- **Owner:** `scripts/audit/early-bank-semantic-layer-a.ts`
- **Execution:** EXECUTED

### Runtime audio carries no client-embedded secret

Runtime audio must not require a client-embedded secret or a live API call, and an absent pre-generated
asset must fail safely to the supported speech-synthesis fallback. This binds regardless of the parked
audio principle's status, because the static deploy inlines build-time variables as plaintext into the
published bundle.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-22
- **Execution:** EXECUTED

### Bilingual English and Simplified Chinese parity on all displayed text

All displayed text carries bilingual English and Simplified Chinese parity.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-09
- **Execution:** EXECUTED

### Topic labels are English-only

A question's topic is English-only, a navigational label rather than study content. Chinese characters
in a topic fail loudly at validation and are never silently stripped.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-10
- **Owner:** `src/schema.ts`
- **Execution:** EXECUTED

### JSON quote hygiene is a parse-time gate

Structural JSON tokens are ASCII double quotes only, and Chinese quotation marks are valid only inside
Chinese-language values. JSON shape is edited programmatically and never retyped, because the dominant
corruption source is editing rather than generation.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-13
- **Evidence:** `docs/AGENTS-RUNBOOK.md`
- **Execution:** EXECUTED

### Question IDs are globally unique across bundled banks

Question identifiers are globally unique across bundled banks, including embedded case-study leaves.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-14
- **Owner:** `scripts/audit/audit-ids.ts`
- **Execution:** EXECUTED

### Raw-draft filename prefix routes to its canonical bank

A raw-draft filename prefix routes to its canonical bank through a fixed table that is the executable
source of truth, and no prose copy of that table is hand-maintained. The original per-kind canonicals
are complete frozen content sets rather than active generation targets, and a visual kind added after
the original roadmap does not mint a new per-kind canonical.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-09
- **Owner:** `lib/canonical-routing.ts`
- **Execution:** EXECUTED

### Canonical merges are deterministic and gated

Canonical merges are deterministic and gated through the consolidation script, and canonicals are never
hand-merged.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-19
- **Owner:** `scripts/consolidate.ts`
- **Execution:** EXECUTED

### Runtime stays static, offline, and file-protocol compatible

The runtime stays static, offline, and compatible with direct file-protocol loading. No server call and
no live model call occurs after build.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-09

### Schema versions are an ordered token, not semver

Schema versions are an ordered token rather than semantic versions, and the minor component never
exceeds nine, so every version string sorts correctly under naive numeric, lexicographic, and index
comparison. A single indexed comparison primitive is the only legal comparator. The supported version
set is verified against code, never against any prose restatement of it.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-09
- **Execution:** EXECUTED

### Schema changes are rare and deliberate

Schema changes are rare and deliberate.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** ADVISORY
- **Date:** 2026-06-09

### Shared visual numeric helpers have a single definition

The shared visual numeric formatting and rounding helpers have a single definition, and no visual kind
redefines them.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-12
- **Owner:** `src/visuals/primitives/graphPaper.ts`
- **Execution:** EXECUTED

### Case-study exhibit IDs share one namespace

Case-study exhibit identifiers share one namespace across the whole case, spanning top-level exhibits
and every stage. A case's top-level exhibit set may be empty when its opening content is meant to be
entirely stage-gated.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-13
- **Owner:** `src/schema.ts`
- **Execution:** EXECUTED

### Category targets are the current test-plan weights

Category targets are the current test-plan weights project-wide rather than uniform, for both the
weighted study draw and the generation coverage backlog, and they are held in a single map. Item-type
balance stays uniform by design, because the test plan weights client-needs categories rather than item
formats.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-12
- **Owner:** `src/schema.ts`
- **Execution:** EXECUTED

### Bank composition is a floor problem, not a balance problem

Bank composition is a floor problem rather than a balance problem: no release gate enforces balance, and
the rule is that no format falls below the depth its sampling path requires. Above that floor, topic fit
and item quality override census arithmetic, and no weak item is authored merely to close a census gap.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-10
- **Owner:** `src/sessionSampler.ts`
- **Execution:** EXECUTED

### Repository-state hygiene is mechanism-specific

Repository-state hygiene is mechanism-specific: agents reading through the forge see only committed and
pushed inputs, while disk-reading agents operate against an explicit local branch or worktree snapshot
and must preserve unrelated changes. No agent may assume local and remote state are identical.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-23
- **Owner:** `AGENTS.md`

### Some topics are deliberately shared across categories

Some topics are deliberately shared across NCLEX categories rather than misclassified. An item's
category is not corrected to match a topic's single most obvious category, because the topic is
intentionally cross-category.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-18
- **Owner:** `src/topics.ts`
- **Execution:** EXECUTED

### Highlight's structural bias gate is schema-level

Every highlight item must include at least one selectable distractor segment, enforced at schema
validation rather than at audit, so an all-selectable item cannot enter a bank. Segment order is
clinically meaningful passage order and is never shuffled, which leaves semantic cue quality as
content-review work.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-14
- **Owner:** `src/schema.ts`
- **Execution:** EXECUTED

---

## 3. Target §7 — open threads

### Translation-friction scoring

Whether reveal-tap friction folds into the targeted-review sampler is unresolved, and stays open until
dogfooding shows reveal concentration that is genuinely topic-specific or category-specific and
miss-predictive beyond the existing missed-topic signal. The instrument already ships; only the scoring
decision is parked.

- **Kind:** T
- **Status:** PARKED
- **Force:** ADVISORY
- **Date:** 2026-07-01

### Exam-condition test and adaptive modes

Whether the non-default half-exam placeholder modes become real exam simulators, with deferred feedback
and strict language mode, or are removed instead, is unresolved. A deferred sub-question is whether a
strict exam environment should ever permit a post-submit full translation reveal.

- **Kind:** T
- **Status:** PARKED
- **Force:** ADVISORY
- **Date:** 2026-07-09

### Unresolved vital sanity bounds

DBP and MAP ceilings are authorized for a bounded sourcing pass with no value selected. The temperature
floor remains inherited and unratified, and the laboratory oxygen-saturation key stays separately
provisional because pulse-oximeter evidence does not govern it. All other unratified sides remain
provisional, and no bound is authored from model memory at any stage.

- **Kind:** T
- **Status:** REVISIT
- **Force:** ADVISORY
- **Date:** 2026-07-24

---

## 4. Candidate entry-index rows (Part C fragment of target §3)

| ID | kind | status | force | summary |
|---|---|---|---|---|
| R1 | R | ACTIVE | AUTHORIZING | Standalone bowtie may be generated directly |
| R2 | R | ACTIVE | BINDING | CBC units are conventional-first with SI in parentheses |
| R3 | R | ACTIVE | BINDING | Temperature sanity ceiling 46.5 °C |
| R4 | R | ACTIVE | BINDING | Promoted visual parity is a committed per-kind baseline |
| R5 | R | ACTIVE | BINDING | Vital sanity ratifications for SBP, RR, and SpO2 |
| R6 | R | ACTIVE | AUTHORIZING | Pull-request and post-merge CI coverage are distinct |
| — | I | ACTIVE | ADVISORY | Producer assignments are operational state, not constitutional text |
| — | I | ACTIVE | BINDING | Deterministic review routing for promoted opus-prefixed case IDs |
| — | I | ACTIVE | BINDING | Runtime audio carries no client-embedded secret |
| — | I | ACTIVE | BINDING | Bilingual English and Simplified Chinese parity on all displayed text |
| — | I | ACTIVE | BINDING | Topic labels are English-only |
| — | I | ACTIVE | BINDING | JSON quote hygiene is a parse-time gate |
| — | I | ACTIVE | BINDING | Question IDs are globally unique across bundled banks |
| — | I | ACTIVE | BINDING | Raw-draft filename prefix routes to its canonical bank |
| — | I | ACTIVE | BINDING | Canonical merges are deterministic and gated |
| — | I | ACTIVE | BINDING | Runtime stays static, offline, and file-protocol compatible |
| — | I | ACTIVE | BINDING | Schema versions are an ordered token, not semver |
| — | I | ACTIVE | ADVISORY | Schema changes are rare and deliberate |
| — | I | ACTIVE | BINDING | Shared visual numeric helpers have a single definition |
| — | I | ACTIVE | BINDING | Case-study exhibit IDs share one namespace |
| — | I | ACTIVE | BINDING | Category targets are the current test-plan weights |
| — | I | ACTIVE | BINDING | Bank composition is a floor problem, not a balance problem |
| — | I | ACTIVE | BINDING | Repository-state hygiene is mechanism-specific |
| — | I | ACTIVE | BINDING | Some topics are deliberately shared across categories |
| — | I | ACTIVE | BINDING | Highlight's structural bias gate is schema-level |
| — | T | PARKED | ADVISORY | Translation-friction scoring |
| — | T | PARKED | ADVISORY | Exam-condition test and adaptive modes |
| — | T | REVISIT | ADVISORY | Unresolved vital sanity bounds |

Every name-addressed summary equals its heading title byte-for-byte, as §3's join rule requires.

---

## 5. Block-key and order verification

| # | block key | source | kind |
|---:|---|---|---|
| 38 | `R1#0` | E070 | R |
| 39 | `R2#0` | E049 | R |
| 40 | `R3#0` | E047c | R |
| 41 | `R4#0` | E072 | R |
| 42 | `R5#0` | E047a | R |
| 43 | `R6#0` | E073 | R |
| 44 | `Producer assignments are operational state, not constitutional text` | E038 | I |
| 45 | `Deterministic review routing for promoted opus-prefixed case IDs` | E043a | I |
| 46 | `Runtime audio carries no client-embedded secret` | E054 | I |
| 47 | `Bilingual English and Simplified Chinese parity on all displayed text` | E055 | I |
| 48 | `Topic labels are English-only` | E056 | I |
| 49 | `JSON quote hygiene is a parse-time gate` | E057 | I |
| 50 | `Question IDs are globally unique across bundled banks` | E058 | I |
| 51 | `Raw-draft filename prefix routes to its canonical bank` | E059 | I |
| 52 | `Canonical merges are deterministic and gated` | E060 | I |
| 53 | `Runtime stays static, offline, and file-protocol compatible` | E061 | I |
| 54 | `Schema versions are an ordered token, not semver` | E062 | I |
| 55 | `Schema changes are rare and deliberate` | E063 | I |
| 56 | `Shared visual numeric helpers have a single definition` | E064 | I |
| 57 | `Case-study exhibit IDs share one namespace` | E065 | I |
| 58 | `Category targets are the current test-plan weights` | E066 | I |
| 59 | `Bank composition is a floor problem, not a balance problem` | E067 | I |
| 60 | `Repository-state hygiene is mechanism-specific` | E068 | I |
| 61 | `Some topics are deliberately shared across categories` | E069 | I |
| 62 | `Highlight's structural bias gate is schema-level` | E071 | I |
| 63 | `Translation-friction scoring` | E045 | T |
| 64 | `Exam-condition test and adaptive modes` | E046 | T |
| 65 | `Unresolved vital sanity bounds` | E047b | T |

Checks performed against the emitted body above:

- 6 `R` cores, 19 `I` entries, 3 `T` entries; 28 index rows; body and index order identical.
- Exactly one `###` core per `R` identifier, R1 through R6, contiguous with no gap.
- No `I` or `T` entry carries an identifier token, an em dash, or an attachment. No `####` block exists
  in Part C.
- All 22 name-addressed titles are distinct, so §3's title-collision check passes within Part C. Cross-
  part collision is an assembly-pass check.
- No name-addressed title begins with a reserved `P<n> ` or `R<n> ` token. E043a's source heading began
  `P22 `, so it was renamed.
- Kind/status pairs: every `R` is `ACTIVE`, permitted by §2.4; every `I` is `ACTIVE`, the only status `I`
  admits; the three `T` entries are `PARKED`, `PARKED`, and `REVISIT`, all permitted, and `REVISIT`
  appears only on a `T`.
- Every statement is one paragraph of one to three sentences with no list, fence, or nested heading.
  `R3`'s `46.5` and `R5`'s `400` and `150` create no false sentence boundary, since a period between
  digits is not a boundary and no bare digit run ends a sentence.
- Every optional field occupies exactly one physical line, including the long `Evidence` paths on `R3`
  and `R4` and the long `Authorized` and `Not authorized` lines on `R6`.
- Fifteen distinct `Evidence` / `Owner` paths, all confirmed present on live disk this session:
  `src/measurementUnitPolicy.ts`, `src/measurementAllowlist.ts`, `src/schema.ts`, `src/topics.ts`,
  `src/sessionSampler.ts`, `src/visuals/primitives/graphPaper.ts`, `lib/canonical-routing.ts`,
  `scripts/consolidate.ts`, `scripts/audit/audit-ids.ts`,
  `scripts/audit/early-bank-semantic-layer-a.ts`, `docs/AGENTS-RUNBOOK.md`, `AGENTS.md`,
  `PROJECT-HISTORY.md`, and the two `Archive/root-cleanup-2026-07-19/` specs. Trackedness under
  assertion 15 remains **unverified by this seat**.

Running total: Part A 18 + Part B 19 + Part C 28 = 65, matching the frozen live population, with kind
totals 37 `P` / 6 `R` / 19 `I` / 3 `T`.

---

## 6. Directed boundaries confirmed

- **E043a carries only two limbs.** The `opus*` deterministic-routing rule and the `claude_*` exclusion,
  plus the applicability note that survives the lane lapse. Deliberately excluded: the direct-GPT
  producer contract and topic-commission mechanism, the C/D rerun evaluation, the advice to use case form
  for a topic or load-bearing visual, the prohibition on treating the pathway as a standing bulk lane,
  and general promotion-review obligations. Those are replacement-pathway context carried by P2, P5, and
  the preservation snapshot.
- **R3 carries the finding and the executed ceiling only.** The renderer-envelope finding and the
  ratified 46.5 °C ceiling executing through a dedicated override. No temperature floor, no other vital
  side, no citation chain, no survey chronology, no proof metrics.
- **R5 carries the three ratified values and the implementation boundary.** SBP 400 mmHg, RR 150 per
  minute, `spo2` floor 0%, the bedside and charted population that selects 400, unchanged renderer
  envelopes, the non-removable sanity minimum, and the fresh-survey prerequisite, at
  `Execution: PENDING`. No DBP, no MAP, no temperature floor, no laboratory `sao2`.
- **E047b carries only unresolved questions.** DBP and MAP ceilings with no value selected, the
  inherited temperature floor, the separately provisional laboratory oxygen-saturation key, and the
  residual unratified sides. The executed temperature ceiling and the three R5 values do not appear.
- **E038 states the durable rule only.** Producer assignments are operational state verified against the
  history record, and substitution changes no identifier, provenance classification, or review
  obligation. No named model appears, so no producer assignment is constitutionalized.

---

## 7. Part C omission register

| block | field | candidate(s) | reason for omission |
|---|---|---|---|
| `R1#0` | Evidence, Owner | none | Authorizing ruling about lane eligibility; no single tracked path carries it. |
| `R2#0` | Evidence | `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` | Supports the extraction Rule C limb only, not the analyte-aware display policy that is the ruling's governing claim. `Owner` carries the singular source of truth instead. |
| `R4#0` | Owner | `scripts/promoted-visual-parity.ts`, `scripts/promoted-visual-parity-survey.ts` | Baseline pinning and the rebaseline path are separate scripts; not worksheet-resolved to one owner. |
| `R5#0` | Evidence | `audit/vital-sanity-bounds-p3-stage-3-source-packet-2026-07-23.md`, `audit/vital-sanity-bounds-p3-stage-3-independent-checker-2026-07-23.md` | Two coequal records, a packet and its independent check. Selecting one would arbitrarily discard the other. |
| `R5#0` | Owner | `src/measurementAllowlist.ts` | Implementation is pending, so the current code path is not yet the owner of the ratified values. Naming it would assert execution that has not happened. |
| `R6#0` | Evidence | `audit/ci-coverage-survey-2026-07-23.report.md`, `audit/ci-coverage-survey-2026-07-23.independent-checker.md` | Two coequal records; same reasoning as `R5#0`. |
| `Runtime audio carries no client-embedded secret` | Owner | `src/App.tsx`, `src/audio/normalizeForTts.ts`, `AGENTS.md` | The runtime fallback, the pre-generated asset path, and the stated policy live in three places; no one path owns both the no-secret and the fallback limb. Fixture `F5` shows an `Owner`, but `F5` is an illustrative grammar fixture, not a ratified field set. **Flagged**, same class as `F1`. |
| `Schema versions are an ordered token, not semver` | Owner | `src/types.ts`, `src/schema.ts` | The version union and the comparison primitive live in different files and the statement fixes both. |
| `Translation-friction scoring` | Evidence, Owner | none | Unresolved question; the shipped instrument is not evidence for a decision not yet made. |
| `Exam-condition test and adaptive modes` | Evidence, Owner | none | Unresolved question with no owner. |
| `Unresolved vital sanity bounds` | Evidence | the two P3 stage-3 records | Two coequal records, and no executable owner exists for unresolved values. Fixture `F6` shows one `Evidence` line, but it is illustrative. |

---

## 8. Open items carried out of Part C

1. **`R5` and `E047b` title divergence from fixture `F6`.** `F6`'s illustrative title is
   `DBP and MAP ceiling sourcing`. The ratified thread scope is broader — DBP and MAP ceilings, the
   temperature floor, laboratory `sao2`, and residual sides — so a DBP-and-MAP-only title would
   mis-describe the entry it addresses. Authored as `Unresolved vital sanity bounds`. Owner call, and
   the title is a name-addressed citation identity, so changing it later breaks citations.
2. **`R2#0` retains `Owner: src/measurementUnitPolicy.ts`** although the statement's extraction-
   preservation clause is owned elsewhere. Kept because the analyte-aware conversion table is the
   ruling's governing claim and lives there. Flagged for consistency review against the `P19#0` removal.
3. **Three `Authorized` / `Not authorized` fields introduced** on `R1` and `R6` to carry ratified
   permission lists that would otherwise force those statements past three sentences. This is the first
   use of those fields outside `P5#1`; confirm the pattern before Part D.
4. **Statement compression is unreviewed.** Producer is this seat; no seat has checked it.
5. **Trackedness** of the selected paths belongs to the shell-capable pass.
