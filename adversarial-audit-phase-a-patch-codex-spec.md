# adversarial-audit-phase-a-patch-codex-spec.md

Repair pass for the two `FIX` findings produced by the Phase A adversarial
semantic audit (`ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md`, CONCERN #1 / #2).
Both are **minor, key-preserving** text defects. This spec executes them as a
single deterministic `patch-raw` canonical correction — EN **and** ZH together
(principle 9, campaign §5, pilot §8). No clinical substance, no answer key, no
option id, no `meta.count` changes.

Governing: `DECISIONS.md` principles 9, 15; `adversarial-audit-phase-a-pilot-spec.md`
§6/§8; `scripts/patch-raw.ts` (the engine — read its `replaceText` semantics and
canonical-mode scope guard before running).

## 0. Both items live in `banks/gemini-canonical.json`

`gemini_c9_01` (top-level `questions[365]`) and `gap_50_sic_03` (top-level
`questions[725]`). One patch file, one canonical in-place invocation covers both.
Neither is an embedded case leaf, so `findQuestion` (top-level id match) resolves
each directly.

## 1. The two findings (verified against live JSON 2026-06-25)

### CONCERN #1 — `gemini_c9_01` — RI, transposed option letter (EN **and** ZH)

`itemType: multiple_choice`, `correct: ["A"]`. Option A = "A client with an open
pneumothorax and a respiratory rate of 34 breaths/minute." The summary
`rationale.correct` opens with the wrong option letter while correctly describing
option A's content:

- **EN (verbatim):** `B is assigned a 'Red' tag because an open pneumothorax is a life-threatening respiratory emergency …`
- **ZH (verbatim):** `B 被标记为“红色”标签，因为开放性气胸是一种危及生命的呼吸急症 …`

**The pilot finding scoped this EN-only; the ZH summary carries the identical
transposed letter and must be fixed in the same pass.** Both `byChoice` rationales
(A = Red/Immediate, B = Black/Expectant) and the key (A) are already correct, so
the fix is the leading letter only. Key unchanged → `needsHumanReview = false`.

Gate note: `audit:references` does **not** flag `"A is assigned a 'Red' tag"`
(its hazard set is `Option X`, `(X)`, `X is correct/right/best`, ordinals,
spatial — not the bare "X is assigned" form), so the corrected text stays PASS.
Confirmed by reading `scripts/audit/audit-references.ts`.

### CONCERN #2 — `gap_50_sic_03` — BD, ZH lexical error

Matrix item; transmission-precaution mapping is correct in both languages. The ZH
summary renders "Influenza" as the non-word **流液**:

- **EN (verbatim, correct):** `Influenza requires Droplet precautions.`
- **ZH (verbatim):** `… 流液需要飞沫传播预防措施。`  → should be **流感**.

Droplet mapping (`r3 → c2`) is intact; this is a single-word ZH typo, not a
clinical-meaning change → `minor`, key unchanged, EN untouched (already correct).

## 2. Patch script (create exactly this file)

`scripts/patches/2026-06-25-phase-a-coherence-polish.ts`

```ts
/**
 * Phase A adversarial-audit coherence polish.
 * Two minor, key-preserving text fixes in gemini-canonical.json:
 *   - gemini_c9_01 (RI): summary rationale names option B while describing the
 *     keyed answer A (open pneumothorax). Fix leading letter in EN and ZH.
 *   - gap_50_sic_03 (BD): zh renders Influenza as the non-word 流液 → 流感.
 * Findings: ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md CONCERN #1, #2.
 */
import { runPatch, replaceText } from "../patch-raw";

runPatch([
  replaceText({
    id: "gemini_c9_01",
    path: ["rationale", "correct", "en"],
    before: "B is assigned a 'Red' tag",
    after: "A is assigned a 'Red' tag",
    note: "RI: transposed option letter; keyed answer is A (open pneumothorax).",
  }),
  replaceText({
    id: "gemini_c9_01",
    path: ["rationale", "correct", "zh"],
    before: "B 被标记",
    after: "A 被标记",
    note: "RI (ZH parity): same transposed letter in zh summary.",
  }),
  replaceText({
    id: "gap_50_sic_03",
    path: ["rationale", "correct", "zh"],
    before: "流液",
    after: "流感",
    note: "BD: zh lexical fix 流液→流感 (influenza); droplet mapping already correct.",
  }),
]);
```

`path` is resolved relative to the matched question object (the engine calls
`findQuestion(id)` then `resolvePath(question, path)`). Each `before` was verified
to occur **exactly once** in its field and each `after` to occur **zero** times,
so the engine's exactly-once precondition passes and there is no collision. If any
`before` is not found exactly once, the engine aborts and writes nothing — do not
loosen the anchors to force a match; re-read the live field and report the
mismatch instead.

## 3. Invocation (canonical in-place mode)

```bash
npx tsx scripts/patches/2026-06-25-phase-a-coherence-polish.ts \
  --in  banks/gemini-canonical.json \
  --out banks/gemini-canonical.json \
  --allow-canonical \
  --reason "Phase A adversarial-audit coherence polish: gemini_c9_01 RI transposed option letter (EN+ZH); gap_50_sic_03 BD zh lexical 流液→流感. Key-preserving, no clinical change."
```

- Canonical mode requires `--allow-canonical` + non-empty `--reason`, with
  `--in` === `--out` (in-place) and `--out` explicit. The engine prints a
  CANONICAL banner, applies in declaration order, recomputes `meta.count`
  (no change here), validates in-process, writes a temp file, re-validates from
  disk, then atomically renames.
- **Do not pass `--strict-parity`.** `gemini_c9_01` edits both `en` and `zh`
  (no parity warning), but `gap_50_sic_03` is a deliberate ZH-only edit (EN is
  already correct), which emits an informational parity warning. `--strict-parity`
  would abort on that expected warning.

## 4. Authoritative execution checklist (the contract)

- [ ] 1. Worktree clean / on the intended branch; `banks/gemini-canonical.json`
      unmodified going in.
- [ ] 2. Create `scripts/patches/2026-06-25-phase-a-coherence-polish.ts` with the
      §2 contents verbatim.
- [ ] 3. Dry sanity: confirm the three `before` anchors still occur exactly once
      in the live fields of `questions[365]` / `questions[725]` (the engine
      enforces this, but verify first to avoid a wasted abort).
- [ ] 4. Run the §3 invocation. Confirm the report shows **3 FIX applied**,
      `Questions before == after`, post-write validation PASS, and the disk
      round-trip PASS.
- [ ] 5. Re-read the two fields from disk and confirm: EN `"A is assigned a 'Red'
      tag …"`, ZH `"A 被标记 …"`, and ZH `"… 流感需要飞沫传播预防措施。"`. Confirm
      `correct` for both items is **unchanged** (`["A"]`; matrix mapping intact).
- [ ] 6. `npm run audit` — Tier 0 PASS and all Tier 1 PASS, in particular
      `audit:references` still **PASS** (no new stale-key or hazard).
- [ ] 7. `npm run census && npm run census:check` — counts unchanged; committed
      census stays consistent (CI invariant).
- [ ] 8. Verify visually in the Review Console: `?dev=1&qids=gemini_c9_01,gap_50_sic_03`
      — both summaries read correctly in EN and ZH.
- [ ] 9. **Ledger (Luke):** add a `BANK-REVIEW-LEDGER.md` entry recording the
      two key-preserving corrections, the `--reason`, the date, and the finding
      refs (CONCERN #1 / #2). The engine reminds but does not write the ledger.

## 5. Out of scope / deferred

- **Optional de-lettering (principle 4, not in this patch).** The clean
  position-agnostic form would drop the leading option letter entirely from the
  `gemini_c9_01` summary (reference the client/condition, not "A"/"B"). That is a
  *semantic + bilingual* rewrite, so by principle 15 it belongs in review, not in
  a mechanical `patch-raw` pass. The letter-correction here is gate-compliant and
  sufficient; raise de-lettering as a separate minor-polish item only if you want
  every summary to model the position-agnostic rule.
- **Campaign closeout (Luke, §8 — separate from this patch, now unblocked by it):**
  update `audit/early-bank-semantic/CAMPAIGN-STATUS.md` (coherence track opened +
  pilot result), `PROJECT-HISTORY.md` (coherence track now open), and the ledger
  entry above. Per the handoff, the ledger is touched only with this executed
  repair pass — which step 9 satisfies.
- No other findings are actionable: the pilot's whole-slice queue is `0
  blocker/major`, `0 source_check`, `0 hold`, `0 discard`.
