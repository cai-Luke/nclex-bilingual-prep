# Campaign 16 Phase B — Stage 2 Independent Content Review

Seat: Claude Opus 5 (Stage 2 content checker). Performed no repair.
Authority: per-row disposition only. No content edit was made and none is authorized by this document.
Governing work order: `scratch/CAMPAIGN-16-PHASE-B-QUARANTINED-FIX-RECOVERY-WORK-ORDER-2026-08-27.md`
Date: 2026-08-27

**STATUS.** The substantive per-row review below is complete for all 13 rows. §9.2 items 1 and 2 are
discharged by owner computation (see §4). §9.2 item 3 — the digests of this file and `review.json` —
is discharged by the owner immediately after this write; those two digests live in the session
transcript and the owner's hands, not in these files. **Neither file may be modified after that
point.** This is still not a Stage 3 authority: Stage 3's authority is the §10.7 publication freeze,
which does not yet exist.

---

## 1. Result

| Metric | Count |
|---|---:|
| Rows submitted by Stage 1 | 13 |
| Reviewed by Stage 2 | 13 |
| `AFFIRM` | 4 |
| `BLOCK` | 9 |
| `OWNER_ADJUDICATION_REQUIRED` | 0 |

No row raised a §4.1 construct proposal and no row turned on superseding an owner-accepted
`ownerClass` or `ownerDisposition`, so no row routes to owner adjudication on §9.1 grounds. Every
`BLOCK` below is a checker finding that the submitted candidate does not meet §9, not a challenge to
the July 2026 owner acceptance.

Stage 1's own `derivationReconciliation` of `AGREEMENT` on all 13 is not disputed. The defect
derivations were sound. The blocks concern what the repairs did, not what they diagnosed.

## 2. The dominant failure mode

Eight of the nine blocks share one root cause.

Stage 1's `ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION` repairs deleted answer-bearing text from
`stem.en` / `stem.zh`. Those deletions were correct in target and correctly mirrored bilingually. But
in most rows other fields of the same payload still referred to the deleted text — rationales asserting
"the stem supplies", "stated in the case", "the plan explicitly requires"; `testTakingStrategy`
instructing the learner to use controls "named in the activated plan"; `stem_disambiguators` still
listing phrases no longer present; and, in three rows, *scored* content (a matrix row, a keyed bowtie
action token, a keyed dropdown option) referring to an antecedent the stem no longer introduces.

Deleting a sentence is not a self-contained edit when other fields depend on it. The smallest
construct-preserving repair for these rows was never stem-only.

**Why the §8 gates and the §4.5 non-mutation proof did not catch it.** Both did exactly what they
claim. §8 verifies structural validity, ID uniqueness and namespace shape, absence proofs, routing,
envelope shape, bilingual edit pairing, and topic language. §4.5 proves no unauthorized field mutated.
Neither asks whether every surviving field still refers to something that exists in the payload. The
non-mutation proof actively rewards the failure: leaving the dependent fields untouched is precisely
what scores `unauthorizedChangedLeafPaths: 0`. The narrower the authorized mutation set, the cleaner
the proof and the more orphaned references survive.

This is an omission in the work order I authored as architect seat, not a Codex execution failure.
Stage 1 executed the mechanism it was given, correctly. Per §10.4 the work order is immutable and is
not amended; the blocker reasons in §3 become the repair requirements for the iteration.

**Two rows show the repair concept was sound.** `hygiene_15_r2` and `hipaa_07_r2` are clean. Where the
deleted recital genuinely was self-contained, the stem-only edit worked. This argues for selective
iteration on the blocked subset under §10.4, not for discarding Stage 1.

## 3. Per-row dispositions

### AFFIRM

**`gpt_balance2_2026_07_15_dc_client_advocacy_02_r2`** — AFFIRM.
The `MECHANICAL_CLOZE_DEPENDENCY` defect is removed. The `right` dropdown's two replaced distractors
(`p3` informed consent, `p2` refusal of the examination) are real patient-rights concepts that compete
without becoming defensible: the stem's client objects to an observer, not to the examination, and
consent is not at issue. Key `p1` remains uniquely correct. Bilingual parity holds on all four edits.
The 42 CFR 482.13 citation supports the added concepts. Construct unchanged; non-mutation proof holds.

*Advisory, not blocking:* the unchanged `glossary` entry for "personal privacy" (`defZh`) defines it as
the right against unnecessary exposure or observation during examination, which is close to a giveaway
for the key. This is pre-existing, was not the recorded defect, and repairing it would exceed the
bounded scope. Flagged for a future pass, not for this one.

**`gpt_balance3_2026_07_16_dc_psychotropic_medications_11_r2`** — AFFIRM.
Six distractors replaced across three dropdowns; all six are medication-relevant competitors and none
is defensibly correct. `d3` was the close call: `waist circumference` is a standard antipsychotic
metabolic-monitoring parameter in general practice. It clears because the stem scopes the task to the
prescribing information ("Complete the monitoring statement using the medication's prescribing
information"), and the olanzapine label names fasting glucose, lipids, and weight gain — not waist
circumference. Verified against the FDA label rather than accepted from the manifest. This is the
narrowest margin in the batch; if a future pass loosens the stem's scoping to the PI, `d3` breaks.

**`gpt_balance5_2026_07_16_mx_standard_precautions_hygiene_15_r2`** — AFFIRM.
The deleted cleanup-sequence recital was genuinely self-contained. No surviving field references it.
Every matrix row stands on its own; `q15_r5`'s "the product's stated contact time" refers to the
disinfectant label, not to deleted stem text, and remains valid. OSHA CPL 2-2.44D and the CDC core
practices citation support the keyed rows. This row is the model of a correct recital deletion.

**`gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07_r2`** — AFFIRM.
The fictional one-page rule was correctly replaced. `q07_d02_o02` ("applies unless the client signs a
separate authorization") is plausible and clearly wrong: the minimum-necessary standard does not apply
to provider-to-provider treatment disclosures, and no authorization toggles that. The rationale was
correctly realigned in both languages. HHS FAQ 208 and the TPO FAQs support the change. Key unchanged.

### BLOCK

**`gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08_r2`** — BLOCK.
*Reason:* the repair reintroduces the defect class it was meant to remove. New `d2/o2` is "the date of
the last injection," but the `d1` key already reads "the exact last product, dose, route, **and
administration date**." A learner who resolves `d1` can eliminate `d2/o2` as redundant by structure
rather than by handoff judgment. That is a cross-blank mechanical elimination path, which is the
recorded `MECHANICAL_CLOZE_DEPENDENCY` class.
*Repair requirement:* replace `d2/o2` with a date that is plausible for the receiving program and not
already carried by the `d1` key. `d1/o2` and `d1/o3` are sound and should be left alone.

**`gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13_r2`** — BLOCK.
*Reason:* two orphaned references, one of them actively harmful. `rationale.correct` still says the
safe response follows the downtime plan "stated in the case" (`zh`: 题干给出的停机计划) — the plan is
no longer stated. Worse, `testTakingStrategy` still reads "Use every operational control explicitly
named in the activated plan." With the stem enumeration deleted, the only remaining enumeration is the
highlight passage itself, so that strategy now instructs the learner to select all seven selectable
segments — including distractors `s7` and `s8`. This is misleading guidance, not merely stale text.
*Repair requirement:* rewrite `testTakingStrategy` (both languages) so it discriminates rather than
instructs selecting the whole passage, and remove the "stated in the case" claim from
`rationale.correct`.

**`gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18_r2`** — BLOCK.
*Reason:* the most serious of the set, because it is a sourcing failure and not only a coherence one.
`byChoice` refIds `1` and `2` still assert what "the plan" explicitly requires and directs; no plan is
described. The `d2` key, "begin triage in **the designated safe area**," references an entity the stem
never introduces. And `meta.source` still closes with "the authenticated all-clear and post-event
sequence are supplied by the facility plan in the item." That sentence was the item's stated basis for
the keyed post-event sequence. Deleting the plan removed that basis while the source field continues to
assert it, leaving a keyed operational claim unsourced and the source field affirmatively false.
*Repair requirement:* either restore a minimal non-telegraphing plan premise sufficient to introduce
the designated safe area, or resource the keyed sequence to the cited CISA guidance and correct
`meta.source`. Both `byChoice` entries need rewriting in both languages. This row is the one I would
route back first.

**`gpt_balance5_2026_07_16_mx_client_advocacy_02_r2`** — BLOCK.
*Reason:* orphaned reference in *scored* content. Matrix row `q02_r2` reads "If the task is not
obvious, ask the two permitted questions **described in the stem**" (`zh`: 题干中说明的两个允许问题).
The ADA recital was deleted and the stem no longer describes them. The learner is asked to classify a
row that points at text which does not exist. The row is unanswerable as written by anyone who does not
already know the ADA's two permitted questions from outside the item.
*Repair requirement:* `q02_r2` must name the two permitted questions or the stem must reintroduce them
without reciting the classifications. `stem_disambiguators` entries "two permitted questions" and
"specific exclusion reason" also no longer correspond to stem content.

**`gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13_r2`** — BLOCK.
*Reason:* the weakest block in the set. `testTakingStrategy` directs routing
information through "**the named** tracking, family, and media functions," which are no longer named
anywhere. `stem_disambiguators` still asserts "temporary unique identifiers" and "activated
closed-world plan"; the closed world was deleted, so the item now silently requires outside MCI
knowledge while its metadata claims self-containment. The segments themselves remain answerable, which
is why this is weaker than the rows above.
*Repair requirement:* correct `testTakingStrategy` in both languages and reconcile
`stem_disambiguators` with the actual stem.

**`gpt_balance6a_2026_07_16_bt_perioperative_care_13_r2`** — BLOCK.
*Reason:* orphaned reference inside a keyed token. Action token `q13_a_support` — one of the two
correct actions — reads "begin 20% lipid emulsion **per the supplied protocol**" (`zh`: 按既定流程).
The LAST protocol recital was deleted from the stem; no protocol is supplied. The clinical content is
otherwise sound and correctly sourced to the ASRA checklist, and the item remains answerable from the
LAST prodrome, so this is a narrower defect than `client_advocacy_02_r2` — but it sits in scored text.
*Repair requirement:* reword `q13_a_support` in both languages so the keyed action does not depend on
an unsupplied protocol, without introducing a lipid-emulsion dose or rate not carried by the ASRA
citation.

**`gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05_r2`** — BLOCK, narrow.
*Reason:* the recorded `WEAK_OR_NONCOMPETING_DIFFERENTIAL` defect is not removed for `q05_d02`. The two
replacement purposes (payment review by the health plan; the hospital's quality-assessment operations)
are the conceptually right TPO competitor set, but the stem fixes the requester as a consulting
psychiatrist, so both are eliminated by narrative fit rather than by the psychotherapy-notes rule the
item tests. `q05_d02` remains close to free. `q05_d01` is fine and carries the construct.
*Repair requirement:* make `q05_d02` turn on the rule rather than on who is asking, without changing
the key.

**`gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14_r2`** — BLOCK.
*Reason:* orphaned references, including two keyed tokens. `byChoice` `q14_c01` still says the event
meets "**the stem's definition** of wet contamination" and `testTakingStrategy` still says to use "the
stated open-versus-closed pathway definition"; neither is stated anymore. Keyed tokens `q14_a02` and
`q14_p02` reference "the program's prescribed prophylaxis pathway" and "the PD program's transfer-set,
prophylaxis, and follow-up plan" — an entity the stem no longer introduces. `byChoice` `q14_a05` and
`q14_p05` compound it by explaining that the item "defers drug selection, dose, and duration to the
prescribed program pathway."
*Note:* the `glossary` does define wet contamination, but only in `defZh`; there is no `defEn`. An
English-reading learner has neither the stem definition nor a glossary definition, while the rationale
tells them the stem supplied one. The missing `defEn` is a pre-existing schema pattern and is not
itself in scope.
*Repair requirement:* the stem must reintroduce the program pathway as a premise without reciting the
keyed actions, or the keyed tokens and their rationales must be reworded to stand without it.

**`gpt_balance6b_2026_07_16_hl_standard_precautions_hygiene_17_r2`** — BLOCK.
*Reason:* orphaned reference plus incomplete removal of the recorded defect. Keyed segment `q17_s04`
reads "Maintain natural nail tips at or below **the stated** 1/4-inch limit" and its `byChoice` asserts
"**The stem supplies** the accepted natural-nail length limit that should be followed." The stem no
longer supplies it, so the rationale is affirmatively false. Separately, the 1/4-inch figure now
appears *only* inside a keyed segment, so the telegraph was relocated rather than removed — the
`ANSWER_TELEGRAPHING` defect is not discharged. `testTakingStrategy` ("the exact population and rule in
the stem") and `stem_disambiguators` ("natural nail limit supplied") are also orphaned, and
`rationale.correct` and `byChoice` `q17_s08` both reference "the cited rule" that was the deleted
facility policy.
*Repair requirement:* this row needs the most work of the nine. Either the stem reintroduces the policy
scope without the length figure, or `q17_s04` and four dependent fields are reworked together.

## 4. §9.2 — DISCHARGED BY OWNER COMPUTATION

§9.2 requires Stage 2 to record, for every `RETURN_CANDIDATE` reviewed, its payload hash under the
campaign convention **and confirmation that this equals the value in the Stage 1 `manifest.json`**;
plus the raw draft's file-byte SHA-256 as reviewed; and then to hash `review.md` and `review.json`,
print both digests to its transcript, and not modify them thereafter.

**This seat computed none of the values below.** Only one filesystem connector presented tools in this
session and it exposes UTF-8 text reads, not byte-level access or a hashing primitive. Every digest in
this section was computed by the owner (Luke) on 2026-08-27 and transcribed here unaltered. Per the
standing rule that this seat never claims digests, nothing here is asserted as checker-derived.

The owner's item-1 run recomputed each candidate payload hash from the current raw draft using the
repository's own `stableJson` and `sha256` and compared each to Stage 1's `manifest.json`. All 13
returned PASS. This is the substantive anti-self-report check: an independent recomputation reaching
the producer's declared digests, rather than a restatement of them.

**Item 2 — raw draft file-byte SHA-256, as reviewed** (owner-computed):

```
64a8333d37e17d6daf06e1b8a3553b394ea9892fcf83ec1e5beb21f0991800fd
  banks/banks-raw/gpt-campaign16-phase-b-recovery-2026-08-27.json
```

**Item 1 — campaign-convention payload hashes, all confirmed equal to Stage 1 `manifest.json`**
(owner-computed; convention: `sha256(stableJson(q, 0))`, recursively sorted keys, indent 0, trailing
newline):

| Minted ID | Campaign payload SHA-256 | vs manifest |
|---|---|---|
| `gpt_balance2_2026_07_15_dc_client_advocacy_02_r2` | `0e211d6eee964f939d8ad72da8332ddfca66f59019a445f8d86a7a6551f0976e` | PASS |
| `gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08_r2` | `9bbe67218947b1108d99ecbdb004e722ee8782f2b9252ab6f030e564dbbe9301` | PASS |
| `gpt_balance3_2026_07_16_dc_psychotropic_medications_11_r2` | `1cb1b4bc7aca712bf5aab8f252b32cdf538fdff2a7ef27d8a6afcc662741a5aa` | PASS |
| `gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13_r2` | `73abbcf2d7e2cfb443ceb27922a5c5c9a11de804057cb91260e0c027fcd7efd4` | PASS |
| `gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18_r2` | `e62e88406b257090f8afa67f897a71045d04f2a981a9c7eff73e9a27f7967bf9` | PASS |
| `gpt_balance5_2026_07_16_mx_client_advocacy_02_r2` | `34fbecfe2a2f14238544e67400dfcff0a39546987bb34a9eb2ab567c133af018` | PASS |
| `gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13_r2` | `5ba15a5e22cc996a8d0103ca794bcd087d944c64ab5f3be50cbbe0896216cd8e` | PASS |
| `gpt_balance5_2026_07_16_mx_standard_precautions_hygiene_15_r2` | `df213b7da5eb41a37d83caa199e4f9edc027f9d8afaf3dc493447bd82829a8b7` | PASS |
| `gpt_balance6a_2026_07_16_bt_perioperative_care_13_r2` | `1837a316611d1488e0b1c0b2a2fba0c4067d51a47c81e2a84a57d797e1342738` | PASS |
| `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05_r2` | `54ffbaed80defb0a68d78cfd8ab2b1a004ff752dccdcbd188d7aa3c035f63604` | PASS |
| `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07_r2` | `476755b6be798b4b8164dc72e9a6ec91e6bd1ef508f55613c3797784ed1a7c95` | PASS |
| `gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14_r2` | `710dc5976f92f17e9982ddfe2dfb5f3b38afcf1099acc6da51f94c5161f6716b` | PASS |
| `gpt_balance6b_2026_07_16_hl_standard_precautions_hygiene_17_r2` | `9d5bda8db1e614ab7b8b1505401f745431ad1b0980cfc5efbd06ea9a803edbb5` | PASS |

**Item 3 — artifact digests.** The owner computes `shasum -a 256` on this file and on `review.json`
immediately after this write. Those two digests cannot be recorded inside the files they describe, so
they live in the session transcript and the owner carries them forward. From that moment neither file
may be modified.

**The substitution being made, stated plainly.** §9.2 assigns the hashing to Stage 2. Here the owner
performed it. This satisfies §9.2's purpose — binding this review pass to the exact draft state it
reviewed, and freezing the artifacts — but not its literal text. It is the same owner-performed pattern
used for the work-order SHA-256 freeze. It is recorded as a substitution rather than glossed as
compliance, and it is the owner's call, made on the record, not the checker's.

**Why this had to close before the §10.4 relaunch.** §10.4 requires the iteration program to prove
every non-relaunched row unchanged from the immediately preceding reviewed draft state. The 13 payload
hashes above are that baseline. `banks/banks-raw/` is gitignored, so once the nine blocked rows are
patched there is no recoverable prior state; without these values the four affirmed rows would become
unverifiable. The relaunch may proceed now.

## 5. What this does and does not authorize

- Per §10.1, none of the nine blocks authorizes anyone to edit anything. The repair requirements in §3
  are inputs to a relaunch, not permission to patch.
- Per §10.3, no owner instruction alone makes a blocked row publishable; a directed repair re-enters
  Stage 1 and returns through Stage 2.
- Per §10.4, an owner relaunch on the blocked subset runs under this same immutable work order and
  writes `manifest-iteration-1.json`, `report-iteration-1.md`, and a correspondingly named sibling
  patch program. Stage 1's existing evidence is append-only and is not amended.
- All nine blocked rows are already present in the raw draft under their `_r2` IDs, so §10.4's
  second bullet governs: they are patched **in place under `_r2`** with exact preconditions and are
  **not reminted**. `_r3` is reserved for a repair after `_r2` has actually been published.
- The four affirmed rows are not yet publishable. §10.6 requires all 13 to reach a final state before
  the §10.7 freeze may be written, and Stage 3 takes its roster only from that freeze.

## 6. Scope closeout

- No content was edited. No canonical bank was read for modification or modified.
- No promotion, consolidation, census, ledger, status-map, or `DECISIONS.md` write was performed.
- No commit and no push.
- No §10.7 publication freeze was written; §10.6 does not hold.
- Stage 3 was not entered and is not authorized by this document.

Stage 2 substantive review: COMPLETE for 13 of 13 rows.
Stage 2 §9.2 items 1 and 2: DISCHARGED by owner computation, transcribed in §4.
Stage 2 §9.2 item 3: discharged by owner hashing of this file and `review.json` immediately after this
write; digests held in the session transcript. No modification is authorized thereafter.
Stage 2 status: CLOSED on completion of item 3.
Next: owner relaunch of Stage 1 under §10.4 on the nine BLOCK rows.
