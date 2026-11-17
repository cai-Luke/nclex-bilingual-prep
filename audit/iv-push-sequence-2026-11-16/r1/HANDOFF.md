# IV push ordered-response correction — producer candidate and handoff

**Producer seat:** Claude Code / bounded clinical-content repair producer
**Model:** Claude Opus 5.5 (default effort)
**Work order:** `scratch/IV-PUSH-SEQUENCE-CLAUDE-CODE-WORK-ORDER-2026-11-16.md`
**Date:** 2026-11-16
**Status:** CANDIDATE — not independently reviewed. Stopped at the §3 gate. No canonical write, ledger entry, regeneration, staging, commit, push, or deployment was performed.
**Pending:** (1) GPT-6 Astra — non-Claude clinical/content checker (P2/P5); (2) authoring GPT seat — spec-conformance check (P2 Application), including rulings on the deviations in §5.

No delegated contributions: one `web-fetch` sub-agent was used only to retrieve the two source URLs. It returned the ISMP PDF bytes; the Open RN page returned HTTP 403. All text extraction and judgment were done in this seat.

---

## 1. Snapshot and state reconstruction

- Branch `codex/publication-reconciliation-2026-10-02`, HEAD `65756ab`; the main checkout was used, with no worktree.
- The six untracked root `*.md` files were untouched. `git diff --stat` is empty before and after this work.
- `banks/banks-raw/` held only `.DS_Store` before and after. `banks/_promoted/` was empty before and after.
- Live `banks/claude-canonical.json` SHA-256 was `949f8245698958b5bcab2ea3d095f22de316503aff5263f74e2151dba72ee553` before and after (unchanged).

## 2. Governance routing review

I found no routing conflict that needs a governance change.

- **Provenance.** `claude_a_or_iv_push_safety_14` is in `claude-canonical.json`, and `banks-provenance.json` records firstSeenOrdinal 0 and firstSeenDate 2026-06-05T20:38:06-04:00. It is Claude-produced. Under the standing invariant *Deterministic review routing for promoted opus-prefixed case IDs*, a `claude_*` item routes to a non-Claude reviewer. This producer is Claude, so it cannot be the sole or final content checker (P5).
- **Checker.** GPT-6 Astra is non-Claude and was owner-named. It satisfies independence only if it runs outside this producer's delegation tree (AGENTS.md *Delegation and Review Independence*). Nothing in this pass spawned or briefed Astra. CLAUDE.md routes Astra as a *provisional implementation* lane, but naming the content checker is an owner routing decision under the work order. That row does not govern it, so there is no conflict.
- **Spec authorship split (P2 Application).** The GPT authoring seat wrote candidate stem text, so it is correctly excluded from the content check and keeps spec conformance. The §5 amendment, by the Claude architect seat, also shaped the option-wording rules. That is spec authorship, not content clearance. Content clearance still rests with Astra.
- **P15 / P5 distinction.** This is a same-ID, in-place correction of an already-canonical item. `promote` and `consolidate` cannot carry it, because the collision gate correctly refuses an existing ID, and the established precedent is P15 `--allow-canonical` (ledger entries 2026-06-25, 2026-08-29 `reviewed-canonical-correction`, and 2026-09-13). P5's substantive floor still applies in full: changed learner-facing clinical text needs independent content review before it becomes canonical. AGENTS.md says "No reduced tier exists" for bank content. The stage-by-stage mapping is:

| Pipeline stage | This correction |
|---|---|
| normalize | `normalize-raw-bank` dry-run on the candidate: **0 structural changes**, validation passed |
| promote (shuffle) | N/A. Option IDs and display order are preserved unchanged; no new item |
| audit | Run in isolation and on a full disposable repo copy (§7) |
| producer≠checker review | **Pending** (Astra) |
| consolidate | Replaced by P15 in-place `--allow-canonical` with identical `--in`/`--out` |
| ledger entry | At integration, contemporaneous (draft in §9) |
| census | `census:check` passes with the candidate in place; no movement expected or observed |

## 3. Clinical disposition (producer derivation — checker must rederive)

The key **C → A → B → E → D** is retained for an explicitly stated away-from-bedside preparation workflow. I do not claim one universal IV push order.

Sources I verified (ISMP text extracted from the PDF myself):
- **ISMP Safe Practice Guidelines for Adult IV Push Medications (2015)**, printed p. 12 (§4) and p. 13 (§5):
  - 4.1: label all clinician-prepared syringes "unless the medication or solution is prepared at the patient's bedside and is immediately administered … without any break in the process."
  - 4.1b: "if a practitioner prepares one or more medications or solutions away from the patient's bedside, immediately label each syringe, one at a time."
  - 4.1c: "Bring only one patient's labeled syringe(s) to the bedside."
  - 4.4: "Never pre-label empty syringes"; "label each syringe immediately after being prepared."
  - 5.1: assess the patient and vascular access site before and after administration, including "aspirate for positive blood return and encounter no resistance when manually flushing." Also confirm "patient, drug, dose/strength, route, and timing by comparing the drug label against the order or MAR."
  - 5.2: barcode/similar technology "immediately prior to the administration … to confirm patient identification and the correct medication."
  - 5.3: "Administer IV push medications and any subsequent IV flush at the rate recommended by the manufacturer … or … approved institutional guidelines. Use an appropriate volume of the subsequent IV flush." Also: "The medication left in any dead space … will be flushed into the vascular system at the same rate that the flush … is being administered."
- **Open RN, Nursing Advanced Skills §2.5**: NOT verified by me. The page returned HTTP 403. Nothing in the candidate depends on it alone.
- **IHI, Five Rights**: not retrieved. It is used only for the general point that the five rights are objectives, not a procedure.

Producer reading:
- Checking the stock medication against the order before withdrawing it is verify-before-prepare.
- Labeling immediately follows preparation away from the bedside (4.1b, 4.4).
- Patient identity and the final drug check happen at the bedside, immediately before administration (5.1, 5.2).
- Site and patency assessment precede injection (5.1).
- The subsequent flush follows the drug, at a recommended rate and adequate volume (5.3).
- Identifying the patient before preparation is safe in a bedside-preparation workflow (4.1, 4.1a), so the old byChoice-B claim "not before preparation" was false as a universal statement and has been removed.
- The candidate states no universal flush rate, volume, dose, or line-specific protocol.

## 4. Unique-key reasoning

`uniqueness-proof.mjs` enumerates all 120 permutations against six precedence premises. Each premise is semantic and its justification is quoted from the candidate text:

| Premise | Basis in candidate text |
|---|---|
| C < A | C compares the **vial** label with the MAR, i.e. the stock container before withdrawal (verify-before-prepare) |
| A < B | The stem says "must draw up … before going to the client's bedside"; B is "At the bedside" |
| C < B | C is "In the medication preparation area"; B is "At the bedside" |
| B < E | Identity is confirmed before administration (ISMP 5.2) |
| A < E | A dose cannot be given before it is drawn up |
| E < D | D flushes "the medication remaining in the IV line", which presupposes the drug has been given (ISMP 5.3) |

Result: **exactly 1 admissible order, C,A,B,E,D** (`uniqueness-proof-output.txt`). The load-bearing premises are C<A, A<B, B<E, and E<D. With E<D removed, 5 orders are admissible. That is the quantitative basis for deviation D-1 below.

Residual for the checker: C<A depends on reading the vial-label comparison as the pre-withdrawal check. A learner taught a strict "three checks" model (on retrieval, on preparation, at the bedside) could argue the vial check also recurs after drawing up. I judge C<A to be the stable, conventional answer once C is anchored to the vial and the preparation area. Please rule on it.

## 5. Deviations from the work-order wording (for spec-conformance ruling)

The work order invites an explained alternative where its literal wording creates an assessment-quality concern (§2, "explain it and submit an alternative for review"). None of these deviations adds a sequence word.

- **D-1 — Option D object scope (assessment-quality concern).**
  - Spec-literal removal of "after administration" gives EN "Flush the IV line with a compatible solution." / ZH "用相容溶液冲洗静脉管路。"
  - That wording reads equally well as the **pre-administration patency flush** ISMP 5.1 describes, and the candidate rationale itself (per spec) tells the learner to assess patency before injecting. A learner who places D before E would have a defensible argument, and E<D would be unanchored (5 admissible orders).
  - **Candidate:** EN "Flush the medication remaining in the IV line with a compatible solution." / ZH "用相容溶液冲净静脉管路中残留的药物。" This scopes the flush by object (the residual drug), keeps the flush action and compatible-solution content, and contains no relative-sequence word.
  - **Alternative if the architect rejects D-1:** the spec-literal text above. That changes the two `options[id=D]` ops only. Re-run the patch and proofs afterwards; the uniqueness proof will then report 5 orders.
- **D-2 — Option C location + object scope.**
  - The spec permits keeping C's text or scoping it by object. The existing "Compare the medication label to the medication administration record" is ambiguous twice over. It can be read as the **bedside final check** (ISMP 5.1/5.2), which gives A,B,C,E,D. It can also be read as checking the syringe label that option A creates, which gives A before C.
  - **Candidate:** EN "In the medication preparation area, compare the medication vial label with the medication administration record." / ZH "在药物准备区，将药瓶标签与给药记录进行核对。" This uses both permitted scopes, location and object.
  - The checker should confirm that "vial" fits an IV push draw-up context; an ampule is the edge case.
- **D-3 — ZH stem parity.** The spec ZH stem omits EN "selected". The candidate inserts 选定的: "请将下列选定的给药步骤按正确顺序排列。" Everything else is the spec ZH verbatim.
- **D-4 — "Selected-step exercise" not stated in the rationale (P21).** The spec asks the rationale to explain that this is a selected-step exercise, not a complete procedure. Saying so literally would be construction language (P21 Application, *construction language is functional, not positional*). The candidate conveys the point clinically instead. It names the bedside final medication check, the site/patency assessment, and the allergy/compatibility checks that "also" occur before injecting, and says "the earlier check does not replace this final check." The stem's "selected steps" is retained per spec. The checker may judge whether that word is itself construction language, but I judged it a natural learner instruction.

## 6. Changed-field allowlist, hashes, scope proof

- **Allowlist (20 leaf paths):**
  - `stem.{en,zh}`
  - `options[id=B|C|D].{en,zh}`
  - `rationale.correct.{en,zh}`
  - `rationale.byChoice[refId=B|C|D|E].{en,zh}`
  - `testTakingStrategy.{en,zh}`
- **Hashes (SHA-256):**
  - Baseline (= live canonical): `949f8245698958b5bcab2ea3d095f22de316503aff5263f74e2151dba72ee553`
  - Candidate: `99000aa3459be4c710985386ca160f64720a3ad1da6619600af5956066ff6a56`
  - The owner waived SHA freezing; these are provided for traceability only.
- **`scope-proof.mjs` — SCOPE PROOF: PASS (29/29 checks).** Its allowlist is written from the work order, not imported from the patch. It proves:
  - bank keys and `meta` are identical, and the count stays 96;
  - all 95 other records are deep-equal and in their original order, with an identical ID sequence;
  - the target's leaf-path set is identical (no added or removed keys);
  - every changed path is on the allowlist, and every allowlisted path changed (20/20);
  - id, itemType, category, topic, difficulty, ngnSkill, `correct` [C,A,B,E,D], option order [A,B,E,C,D], option A/E text, byChoice A, byChoice refId order, and glossary are all unchanged;
  - both files are exact `JSON.stringify(_,null,2)+LF`, and the textual diff is exactly 20 changed lines with none added or removed;
  - the rationale and strategy contain no option letter or ordinal reference;
  - no option contains a relative-sequence cue in either language;
  - every field is bilingual, and there are no curly quotes outside string literals.
- **Negative controls:** the same scanners flag the baseline's `rationale.correct.{en,zh}` letters and the baseline option D's sequence cue, so the PASS results on the candidate are meaningful.

## 7. Validation (actual outputs saved alongside)

**Isolated, on the candidate file** (`isolated-validation-output.txt`). Every check below PASSed with exit 0:
- `validate-bank`: OK, 96
- `validate:bank --file`
- `audit-references --file`
- `audit-producer-vocabulary --file`
- `audit-authorial-constraint-leakage --file`: 0 advisory
- `audit-stage-refs --file`
- `audit-topic-license --file`
- `audit-ids --candidate <candidate> --comparison <12 other canonicals>`: 2698 IDs, no collisions

**Patch engine** (`patch-run-output.txt`): ran with raw-scoped output in a non-discovered subdirectory `banks/banks-raw/_iv-push-isolation-2026-11-16/` (`promote`, `gate:raw`, and `audit:integrity` all use a non-recursive top-level `readdir`). Results: 20 FIX, `--strict-parity`, parity warnings none, post-write `validateBankObject` PASS. Both files were moved to scratch immediately afterwards and the subdirectory was removed.

**Disposable full-repo copy** (scratchpad, `.git` excluded, `node_modules` symlinked, candidate swapped into `banks/claude-canonical.json`; since deleted). Saved in `aggregate-copy-*.txt`:
- `validate-bank -- banks/*.json`: 13/13 OK
- `npm run audit`: **GATE PASSED (warnings present)**. The single WARN (`visual-canonical` select_all correct-count distribution, three `ekg_*` IDs) is identical on the live, unmodified tree, so it predates this work. `audit:integrity` reports INSUFFICIENT, which is expected because no raw drafts exist.
- `census:check`: up to date. The stderr line `fatal: not a git repository` comes from the copy's missing `.git`. `scripts/census.ts` uses git only for a SHA metadata field, with an `"unknown"` fallback, so it does not affect the comparison.
- `npx tsc -b --pretty false`: exit 0. `npm run build`: built, and build identity validated.
- `test:schema-bank`, `test:grading`, `test:shuffle`, `test:audit-references`, `test:session-sampler`, `test:topic-population`: all passed.

`gate:raw` / `promote` / `consolidate` were deliberately not run: a same-ID existing item is not a promotion candidate (§2).

## 8. Finding outside scope (reported, not fixed)

**`audit:references` does not detect this item's P4 violation.** The baseline `rationale.correct.en` contains "(E)", which is outside the `\([A-D]\)` class. The baseline `rationale.correct.zh` uses full-width `（C）…（D）`, which the ASCII `\(` pattern does not match. The audit PASSes the unmodified baseline (control run in `isolated-validation-output.txt`).

This is a P26-shaped gap: ordered_response and select_all items can have five or six options (letters E/F), and the ZH content uses full-width punctuation. The gap may hide other letter references corpus-wide. No audit change was made; that would be a separate audit/maintenance-tooling work order.

## 9. Integration requirements (not authorized in this pass)

After Astra content clearance and the architect's spec-conformance ruling (including D-1 to D-4):
1. Copy the patch to `scripts/patches/2026-11-16-iv-push-sequence-correction.ts` and change the import to `"../patch-raw"`. If any deviation is reversed, edit the ops and re-run §6/§7.
2. Confirm the live canonical still hashes to the baseline above. If it has drifted, the `setValue` preconditions fail closed; re-derive rather than force.
3. Run `npx tsx scripts/patches/2026-11-16-iv-push-sequence-correction.ts --in banks/claude-canonical.json --out banks/claude-canonical.json --allow-canonical --reason "<PATCH_REASON>" --strict-parity`, and confirm the result hashes to the candidate.
4. Write a contemporaneous `BANK-REVIEW-LEDGER.md` entry, status `reviewed-canonical-correction`, naming producer = Claude Code / Claude Opus 5.5, content checker = GPT-6 Astra (with its verdict artifact), spec-conformance = the authoring GPT seat, and gate/integration seat = actual. Record that no raw/staging file was involved and that `meta.count` remained 96.
5. Run final `validate-bank -- banks/*.json`, `npm run audit`, `census:check` (no movement expected; investigate any drift, do not regenerate), the relevant tests, `tsc`, and `build`. Then update `PROJECT-HISTORY.md` status per AGENTS.md.
6. **Audio note (P20):** the gitignored local TTS queue (`audio/manifest.queue.json`, generated 2026-06-22) has 64 keys for this item, including the changed stem, option, and rationale text. If pronunciation audio is maintained for this item, those clips are stale until the out-of-band TTS lane regenerates them. Regeneration was out of scope here.
7. No learner-history, storage, grading, or runtime change. The reported attempt (administration before checking/drawing up) stays incorrect under either text.

## 10. Artifacts in this directory

| File | Purpose |
|---|---|
| `2026-11-16-iv-push-sequence-correction.ts` | P15 patch candidate (20 exact `setValue` ops) |
| `claude-canonical.baseline.json` / `.candidate.json` | Baseline copy / patched candidate |
| `BEFORE-AFTER.md` | Full bilingual before/after, rendered from the two files |
| `scope-proof.mjs` / `-output.txt` | Deterministic scope proof |
| `uniqueness-proof.mjs` / `-output.txt` | Permutation uniqueness and sensitivity |
| `render-before-after.mjs` | Generator for `BEFORE-AFTER.md` |
| `patch-run-output.txt`, `isolated-validation-output.txt`, `aggregate-copy-validation-output.txt`, `aggregate-copy-build-test-output.txt` | Actual command outputs |
| `hash-live-canonical-before.txt`, `hashes.txt` | Hashes |
