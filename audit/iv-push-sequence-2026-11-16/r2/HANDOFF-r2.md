# IV push correction — r2 producer repair candidate

**Producer seat:** Claude Code / Claude Opus 5.5 (default effort). This is the original producer, answering `../ASTRA-PRODUCER-REPAIR-REQUEST.md`.
**Date:** 2026-11-16
**Status:** CANDIDATE r2 — not independently reviewed. There was no canonical write, ledger entry, staging, commit, push, or deploy.
**Supersedes:** r1 candidate `99000aa3…` (BLOCKED). The r1 artifacts and all of Astra's artifacts in `..` are preserved unchanged as provenance, and their hashes have been re-verified.
**Pending:** (1) independent non-Claude content review (Astra or another separately commissioned checker), which is required because r2 changes learner text; (2) an authoring-seat spec-conformance ruling on the stem premise in §2, if the architect considers it necessary.

No delegated contributions: one `web-fetch` sub-agent retrieved the source pages only. I extracted the Taylor PDF text myself.

## 1. Snapshot

- Branch `codex/publication-reconciliation-2026-10-02`, HEAD `65756ab`. The tracked diff is empty. The six unrelated untracked root documents were untouched.
- `banks/banks-raw/` held `.DS_Store` only, and `banks/_promoted/` was empty, both before and after.
- Live canonical = baseline: `949f8245698958b5bcab2ea3d095f22de316503aff5263f74e2151dba72ee553`, unchanged.

## 2. Repair of finding 1 — the vial check must be the initial check

**Accepted.** Taylor Skill 5-4 (publisher PDF, text extracted by me) has two steps relevant here. Step 7 reads the MAR to select the medication, and step 8 says "Compare the label with the eMAR/MAR" before withdrawal. Step 18 says "Depending on facility policy, the third check of the label may occur at this point … many facilities require the third check to occur at the bedside." So a vial/MAR comparison is not inherently the pre-withdrawal check, and r1's location and object scoping did not settle which occurrence C was.

**Repair.** I made the initial-check dependency a fact stated in the stem. I did not change option C or add sequence words to any option, so the option-level prohibition still holds.

- EN stem: "A nurse in a designated medication preparation area has taken a vial of an ordered IV push medication from the medication supply but has not yet checked its label against the medication administration record. The nurse must draw up the dose before going to the client's bedside for administration. Place the following selected steps in the correct order."
- ZH stem: "护士在指定的药物准备区，已从药品供应处取出一瓶医嘱规定的静脉推注药物，但尚未将药瓶标签与给药记录核对。护士需要先抽取药物，再前往患者床旁给药。请将下列选定的给药步骤按正确顺序排列。"

**Why A,C,B,E,D is now excluded without assuming that earlier unlisted verification was omitted.** The stem says the initial check has not happened, so nothing is assumed. C is the only listed vial check. If it came after A, the nurse would have drawn up from a vial the stem says is unchecked, which is exactly the act that Taylor steps 7–8 place verification before. No post-answer rationale is needed to establish this.

**Repeat checks not treated as unsafe.** `rationale.correct` and `byChoice C` now say that rechecking the vial and syringe after preparation is "also good practice", and that none of the preparation checks replaces the bedside final check.

**Assessment-quality note for the checker and architect.** The stem premise echoes option C's wording, which tells the learner that a vial check is still to come. Locating that check relative to drawing up (C<A) is still the tested judgment, along with the preparation-room/bedside, identity-before-administration, and give-before-flush relations. I judged this cue acceptable because it is the clinical context the request asked for, and the alternative (adding sequence words to C) is prohibited. If the architect wants a less verbatim premise (for example "has not yet verified the medication against the client's order"), only `stem.{en,zh}` changes.

## 3. Repair of finding 2 — conditional flush hazard

**Accepted.** DailyMed adenosine injection (set ID d28ff4f3…, "Updated October 22, 2026"; insert "Revised: February 2023"), Dosage and Administration: "should be given as a rapid bolus … if given into an IV line, … followed by a rapid saline flush." r1's "a rapid flush pushes … too quickly" was a categorical claim and was wrong as one.

**Repair.** I restated the hazard as the mechanism in ISMP 5.3 (the residual drug enters the bloodstream at the flush's rate), made the harm conditional on exceeding the drug's recommended rate, and kept the drug-/institution-appropriate rate and volume. There are no drug names, doses, numbers, or added procedure.

- `rationale.correct.en` (closing): "…a compatible flush follows at the rate and volume appropriate for the drug and institutional guidelines. The medication left in the line enters the bloodstream at the speed of the flush, so a flush faster than the drug's recommended rate can deliver that residual dose too quickly."
- `rationale.correct.zh` (closing): "……随后以符合该药物及机构指南的速率和容量使用相容溶液冲管。管路中残留的药物会以冲管的速度进入血液，因此若冲管速度超过该药物推荐的给药速率，残留药物可能过快进入血液。"
- `byChoice D` (EN/ZH): the same conditional structure; full text is in `BEFORE-AFTER-r2.md`.

I considered `byChoice E` ("injecting too quickly can cause adverse effects") and left it unchanged. "Too quickly" is relative to the prescribed rate, so it is not categorical, and the request scoped finding 2 to `rationale.correct` and `byChoice D`.

## 4. Scope

- Same 20-path allowlist as r1, with the same baseline preconditions. Options, `byChoice B/E`, and `testTakingStrategy` are identical to r1.
- **r1→r2 delta** (`r1-r2-delta-proof-output.txt`, PASS): exactly 8 leaves differ, namely `stem.{en,zh}`, `rationale.correct.{en,zh}`, and `byChoice[refId=C|D].{en,zh}`. All other records and paths are identical. The overbroad phrase is absent and the conditional phrase is present in both fields and both languages. The negative control detects the overbroad phrase in r1. The stem premise and the repeat-check wording are present in both languages, and the option sequence-cue prohibition is still met.
- **Baseline→r2 scope proof** (r1's `../scope-proof.mjs` re-run unmodified, `scope-proof-output.txt`): PASS, 29/29 checks, with both negative controls firing.
- **Uniqueness** (`uniqueness-proof-r2-output.txt`): with only the undisputed premises there are 2 orders, A,C,B,E,D and C,A,B,E,D, which reproduces Astra's enumeration. Adding the stem-carried C<A leaves 1 order, C,A,B,E,D. The enumeration only combines premises; the clinical premise itself is stated in the stem text (§2).

## 5. Hashes (SHA-256)

| Artifact | Hash |
|---|---|
| Baseline (= live canonical) | `949f8245698958b5bcab2ea3d095f22de316503aff5263f74e2151dba72ee553` |
| r2 candidate `claude-canonical.candidate-r2.json` | `60b2812e1136c2dc3a068e56ba4ae0b59adcbe3589a77355f586a8b141d87e69` |
| r2 patch `2026-11-16-iv-push-sequence-correction-r2.ts` | `234248aa55b38edbf09843391aafe59aa26a5a74a75d011ac01941b0ac64653b` |
| r1 candidate / r1 patch (preserved, re-verified) | `99000aa3…6a56` / `64515e28…440d` |

## 6. Validation (actual outputs saved)

- **Patch run** (`patch-run-output.txt`): isolated non-discovered subdirectory `banks/banks-raw/_iv-push-isolation-r2-2026-11-16/`, raw-scoped output, `--strict-parity`. Results: 20 FIX, no parity warnings, post-write validation PASS. The subdirectory was removed immediately afterwards.
- **Isolated, on r2** (`isolated-validation-output.txt`). Every check below PASSed with exit 0:
  - `validate-bank`: OK, 96
  - normalize dry-run: 0 changes
  - `validate:bank --file`
  - `audit-references --file`
  - `audit-producer-vocabulary --file`
  - `audit-authorial-constraint-leakage --file`: 0 advisory, so the new stem premise was not flagged as construction language
  - `audit-stage-refs --file`
  - `audit-topic-license --file`
  - `audit-ids --candidate --comparison`: 12 other canonicals
- **Disposable full-repo copy with r2 swapped in** (`aggregate-copy-output.txt`; the copy has since been deleted):
  - `validate-bank -- banks/*.json`: 13/13 OK
  - `npm run audit`: GATE PASSED (warnings present). The only WARN is the same pre-existing `visual-canonical` select_all advisory (`ekg_b1_sata_03`, `ekg_b1_sata_07`, `ekg_b2_sata_06`), and `audit:integrity` reports INSUFFICIENT, as expected with no raw drafts.
  - `census:check`: up to date
  - `tsc`: exit 0. `build`: built.
  - `test:schema-bank`, `test:grading`, `test:shuffle`, `test:audit-references`, `test:session-sampler`, `test:topic-population`: all passed

## 7. Unchanged from r1 / Astra

These carry forward unchanged:
- The deferred `audit:references` false negative (ASCII parentheses, A–D only), with its exact witness.
- P20 parked/inactive, with the queue refresh deferred.
- The integration procedure in `../HANDOFF.md` §9, now using the r2 patch and hashes: copy to `scripts/patches/` with the import changed to `"../patch-raw"`, run in-place with identical `--in`/`--out`, `--allow-canonical --reason --strict-parity`, confirm the result hashes to `60b2812e…`, then write a contemporaneous ledger entry recording the r1 block and the r2 review.
- No history, grading, storage, or learner-state change.

## 8. Artifacts (`r2/`)

`2026-11-16-iv-push-sequence-correction-r2.ts`, `claude-canonical.baseline.json`, `claude-canonical.candidate-r2.json`, `BEFORE-AFTER-r2.md` (rendered from the files), `r1-r2-delta-proof.mjs` with output, `uniqueness-proof-r2.mjs` with output, `scope-proof-output.txt`, `patch-run-output.txt`, `isolated-validation-output.txt`, `aggregate-copy-output.txt`, `hashes.txt`, `hash-live-canonical-before.txt`, `render-before-after.mjs`.
