# Campaign 16 Phase B — Stage 2 Iteration 1 Review

Date: 2026-08-27
Seat: Claude Opus 5 (independent content checker)
Scope: §10.5 iteration review of the nine rows carrying `BLOCK` in the frozen `review.json`
Result: **9 AFFIRM, 0 BLOCK, 0 OWNER_ADJUDICATION_REQUIRED**
§10.7 publication freeze: **not written** — see §7

This is append-only §10.5 evidence. It amends no prior manifest, report, or review. No content was
edited. The four frozen `AFFIRM` rows were not substantively re-reviewed.

---

## 1. What this seat verified for itself

The instruction was explicit that a producer coherence PASS is not checker evidence, and it was not
treated as one. Every finding below comes from reading the current raw draft and the cited sources
directly.

- The full work order, the frozen `review.json`, and the entire current 88,948-byte raw draft were
  read from live disk this session. The nine rows were judged against their actual payloads, not
  against `manifest-iteration-1.json`'s description of them.
- **Start-state binding.** The nine reviewed-start campaign hashes in `report-iteration-1.md` agree
  exactly with the nine `BLOCK`-row hashes in the frozen `review.json`. The iteration began from the
  draft state this seat reviewed. This is cross-artifact agreement read through one connector, not
  recomputation, and it says nothing about the resulting payloads.
- **Four-AFFIRM non-mutation, at content level.** Each of the four affirmed rows was re-read and
  checked against the specific distinguishing details recorded in the first-pass advisories: the
  `personal privacy` glossary giveaway, the `waist circumference` d3 close call, `q15_r5`'s
  contact-time wording, and `q07_d02_o02`. All four are field-for-field as affirmed.
- **Construct preservation.** No keyed option id, matrix key, highlight correct-set, or bowtie token
  key changed identity or count anywhere in the nine. All nine retain `_r2`; no `_r3` exists; no §4.1
  construct proposal was made.
- **Bilingual parity.** Every repaired field was compared `en` against `zh` for semantic equivalence,
  not merely for presence of both.

## 2. The dominant failure mode is discharged

The first pass blocked eight of nine rows on `ORPHANED_INTERNAL_REFERENCE_AFTER_STEM_DELETION`:
answer-bearing text correctly deleted from the stem while dependent fields went on referring to it.
The review was therefore not confined to the field Codex changed. For each row this seat re-read the
stem, all scored content, `rationale.correct`, every `rationale.byChoice` entry,
`testTakingStrategy`, the glossary, `meta.source`, and `meta.stem_disambiguators`, and traced every
surviving definite-article reference to stem, case, plan, protocol, programme, or "stated"/"supplied"
content back to an actual antecedent.

No orphaned or affirmatively false reference survives in any of the nine.

Three repairs deserve specific note because they discharge the *recorded* defect rather than merely
tidying the wording:

- **`hipaa_05_r2`** was the one row where the original `WEAK_OR_NONCOMPETING_DIFFERENTIAL` defect had
  survived a locally plausible edit. It is now fixed at the root: the two distractors are the two
  listed regulatory exceptions themselves, so each is eliminated *because it is an exception*, which
  holds regardless of who is asking. The key is unchanged.
- **`hygiene_17_r2`** had a relocated rather than removed telegraph, with the 1/4-inch figure sitting
  inside a keyed segment. The figure is now out of scored content entirely and lives only in
  post-answer rationale, correctly attributed to CDC guidance.
- **`disaster_18_r2`** had an affirmatively false `meta.source`. The keyed sequence is now genuinely
  resourced to CISA and the source field is true.

## 3. Source verification

Performed independently against the live cited sources.

| Row | Claim | Result |
|---|---|---|
| `disaster_18_r2` | Render first aid when safe; follow law-enforcement/first-responder instructions | **VERIFIED** — CISA *Active Shooter Preparedness Action Guide* (June 2025) carries both verbatim, plus "hide in a secure area where access or entryways can be locked" |
| `client_advocacy_02_r2` | The two ADA-permitted questions; no documentation; no demonstration; handler responsible; out-of-control removal | **VERIFIED** — DOJ Service Animals FAQ Q7 and the removal rule |
| `hipaa_05_r2` | Written authorization required; originator treatment use and supervised training programme are listed exceptions | **VERIFIED** — 45 CFR 164.508(a)(2)(i)(A) and (B) confirmed verbatim at eCFR |
| `hygiene_17_r2` | No artificial nails in high-risk direct contact; natural tips under 1/4 inch; no universal intact-polish ban | **VERIFIED** — CDC Hand Hygiene Guideline Recommendations 6.A and 6.B |

Two citation-hygiene advisories, neither blocking:

1. The same `disaster_18_r2` `meta.source` also carries the legacy 2019 CISA hospitals action-guide
   URL (`/publications/19_0515_cisa_action-guide-hospitals-and-healthcare.pdf`), which did not
   surface in search; CISA has republished that resource under a new title. The citation is
   pre-existing and every keyed proposition in the row is independently carried by the verified 2025
   guide.
2. `client_advocacy_02_r2` cites DOJ FAQ Q7, Q9, Q14–Q15, Q17, Q25, Q28. Q7 is confirmed. The
   remaining Q-number mapping was not individually confirmed, though every substantive proposition
   was confirmed present in that FAQ. Citation precision, not factual accuracy.

## 4. Per-row dispositions

All nine `AFFIRM`. Full findings, prior blocker reasons, and per-row new-defect scans are in
`review-iteration-1.json`.

| Row | Prior blocker, in brief | Disposition |
|---|---|---|
| `discharge_planning_handoff_08_r2` | d2/o2 duplicated the d1 key, eliminating itself by structure | AFFIRM |
| `hl_disaster_..._13_r2` (balance3) | False "stated in the case"; strategy instructed selecting the whole passage | AFFIRM |
| `disaster_18_r2` (mocsic) | Unsupplied plan and safe area; `meta.source` affirmatively false | AFFIRM |
| `mx_client_advocacy_02_r2` | Scored matrix row pointed at deleted ADA recital | AFFIRM |
| `hl_disaster_..._13_r2` (balance5) | Strategy named absent functions; disambiguators asserted a deleted closed world | AFFIRM |
| `bt_perioperative_care_13_r2` | Keyed action depended on an unsupplied LAST protocol | AFFIRM |
| `dc_confidentiality_hipaa_05_r2` | Recorded differential defect not actually removed | AFFIRM |
| `bt_procedural_complications_dialysis_14_r2` | Two keyed tokens plus four dependants referenced an absent programme plan | AFFIRM |
| `hl_standard_precautions_hygiene_17_r2` | False "stem supplies the limit"; telegraph relocated into a keyed segment | AFFIRM |

Advisories worth carrying forward, none in bounded scope: the missing `defEn` pattern does real work
in two rows (`hl_disaster_..._13_r2` balance5, and `dialysis_14_r2`); `q17_s08` remains detectable on
absolute-language heuristics; `disaster_18_r2` infers "the authenticated instructions" from the
stem's "authenticated all-clear" rather than stating it; and the `482.43(b)(1)` and `164.308(a)(7)`
citations on two untouched rows would repay a future sourcing pass.

## 5. §9.1 vocabulary

Every row ends in exactly one of `AFFIRM`, `BLOCK`, `OWNER_ADJUDICATION_REQUIRED`. Nine rows, nine
`AFFIRM`, no other value used.

## 6. §9.2 — what this seat could and could not discharge

**This seat computed no digest, and asserts none as checker-derived.**

Only one filesystem connector presented tools this session, which is itself a degraded state for this
seat, and it exposes UTF-8 text reads and writes rather than byte access or a hashing primitive. The
bash sandbox is a separate container with no route to the repository; the raw draft is gitignored and
these audit artifacts are untracked, so the GitHub connector cannot serve their bytes either.
Retyping 88,948 bytes of mixed-script JSON into the sandbox would be a reconstruction rather than a
recomputation, and a mismatch would be uninterpretable — indistinguishable from my own transcription
error. So the honest answer is the one §9.2 invites: this environment genuinely cannot compute byte
hashes, and nothing here is silently substituted for one.

Every SHA-256 in `review-iteration-1.json` is labelled `PRODUCER_REPORTED` with
`hashVerifiedByChecker: false`.

This is the same substitution recorded on the first pass, with one material difference that should
not be glossed. On that pass the **owner** independently recomputed the payload hashes, which is what
actually discharged the anti-self-report purpose of §9.2 item 1. On this pass every hash handed to
this seat is producer-reported. That purpose is currently undischarged.

§9.2 item 3 is likewise owner-performed: the owner runs `shasum -a 256` on `review-iteration-1.md`
and `review-iteration-1.json` immediately after this write and carries those two digests. Neither
file is modified thereafter.

## 7. §10.7 — freeze withheld, and why

On content, §10.6 holds: all 13 rows have reached a final state, four `RETURN_CANDIDATE + AFFIRM`
from the frozen review and nine from this iteration, with no retirements, holds, or blocks.

The freeze is nevertheless **not written**, and this is a deliberate stop rather than an omission.

§10.7 requires Stage 2 to recompute every current publishable payload hash and require equality with
the latest governing `AFFIRM`. §11.1 then makes `publication-freeze.json` Stage 3's *sole* publication
authority and has Stage 3 verify the current draft against it. If this seat wrote the freeze now, all
thirteen payload digests and the raw file-byte digest would be transcriptions of the producer's own
report. Stage 3 would then check the draft against numbers derived from that same draft by that same
seat. The comparison would agree by construction and would detect nothing — a check that cannot fail
is not a check.

That is exactly the self-certification §0.5 forecloses when it says the producer's own post-edit
self-checks discharge nothing, and it would bake a capability gap into an immutable artifact as a
false attestation. Withholding the freeze is the smaller cost: the nine `AFFIRM`s are content
dispositions and stand on their own, and the freeze is a separate artifact with a precondition this
seat cannot meet.

**Unblock path.** The owner recomputes from the current raw draft, using the repository's own
`stableJson` and `sha256` under the campaign convention:

- the nine revised payload hashes;
- the four `AFFIRM` payload hashes;
- the raw draft's file-byte SHA-256.

If those agree with the producer-reported values recorded in `review-iteration-1.json`, §9.2 item 1's
anti-self-report purpose is discharged and this seat can write the §10.7 freeze on owner-computed
values in the same Stage 2 seat. If any disagree, the disagreement is itself the finding and the
affected rows return to §10.

## 8. Scope close-out

No content edited. No canonical bank modified. No promotion, consolidation, census run, ledger or
status-map write, `DECISIONS.md` write, commit, or push. No publication freeze written. Stage 3 not
entered, and it remains owner-launched taking its sole authority from a §10.7 artifact that does not
yet exist.
