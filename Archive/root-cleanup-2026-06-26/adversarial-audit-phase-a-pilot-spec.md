# adversarial-audit-phase-a-pilot-spec.md

Phase A of the scaled adversarial semantic audit. A calibration batch that runs
the **coherence track** for the first time, validates the new severity axis and
concept-cluster seeds, and decides whether the full ~1,000-row coherence sweep
(Phase B) is worth running. Findings-only: **no canonical edits.**

> Passing schema, build, and promotion gates proves only that an item is
> structurally valid; this audit is explicitly about whether a structurally
> valid item could still mislead, misprioritize, mistranslate, overcue,
> contradict another item, or teach stale/unsafe nursing judgment.

Governing docs (authority on conflict, high→low): `AGENTS.md` ›
`Archive/root-specs-2026-06-18/NCLEX_Audit_Spec.md` (parent — Finding format,
evidentiary standards, hallucination guards) › `Archive/early-bank-semantic-audit-spec.md`
(campaign — tracks, verdict vocab, producer≠checker) › this file. Prereq:
`early-bank-semantic-layer-a-enhancement-codex-spec.md` has landed and Layer A
has been regenerated.

## 0. What this pilot is and isn't

- It **is** the first `DC`/`AK` + `RI`/`SC`/`BD` + redundancy pass over the text
  banks, run on the freshly regenerated, concept-seeded Layer A queue.
- It is **not** a greenfield taxonomy proof — Sessions 01–12 already validated
  the campaign apparatus on 32 applied fixes. The new things under test are the
  **severity axis** (§3) and the **concept-cluster seeds** (do they surface real
  cross-topic contradictions?).
- It is **not** a schema audit (structure is the deterministic layer's job,
  campaign §0; unknown-key strict-reject is the separate Phase-2 closeout track
  and is **not** invoked here) and **not** a visual-necessity audit (that is a
  separate named follow-on, §8 — different bank set, different method; the four
  text banks carry no load-bearing stimuli).
- It does **not** edit banks. Output is a findings report + a JSONL manifest of
  proposals. Repairs are separate, smaller patch specs (`patch-raw
  --allow-canonical --reason`), executed by Luke after review.

## 1. Scope

- **Universe:** the four text banks only — `gemini-canonical.json`,
  `gpt-canonical.json`, `claude-canonical.json`, `hard-cases-canonical.json`,
  including embedded case-study parts. Visual-kind canonicals and
  `banks/banks-raw/` are out of scope.
- **Batch size:** 100–150 unique item IDs (parent §10 calibration band; never
  the full surface in one session).
- **Slice:** drawn from the regenerated coherence queue, highest-harm concept
  clusters first. Target clusters for the pilot: `delegation_scope`,
  `isolation_mode`, `potassium_replacement` (+ `anticoagulation` currency
  overlap), `insulin_hypoglycemia`. These are the highest-harm, highest-density
  clusters and the best test of the concept-pairing change.
- **Tracks active this session:** coherence (`DC`/`AK` lead; `RI`/`SC`/`BD`
  ride along on any item already in the slice; redundancy where a cluster of
  ≥3 surfaces). Currency `OG` is **not** the focus here — currency is closed
  except the carve-out in §2 — but if a coherence pair exposes a stale guideline
  it is filed as `OG` with a source (§4).

## 2. Producer ≠ checker — reviewer assignment

Per DECISIONS principle 2 / campaign §6, the auditing model must not have
generated or final-reviewed the item under review. A coherence pair links two
IDs that can have different producers; a pair is auditable by a model only if it
is non-producer for **both** sides.

- **Claude audits:** any pair / redundancy cluster whose every member is
  `gemini`- or `gpt`-produced (gemini×gemini, gpt×gpt, gemini×gpt). This is the
  large majority of the slice.
- **GPT-5 audits:** any pair / cluster that touches a `claude`/`opus`-provenance
  item (the low-tier `opus_*` / `claude_*` / `claude_cs_*` families and
  Claude-final-reviewed hard cases). Same reviewer also takes the **17 open
  Phase B currency rows** (`BLOCKED_PRODUCER_CONFLICT`, listed in
  `audit/early-bank-semantic/CLAUDE-RETURN-INDEX.md` §5) as a separate sub-batch
  under the campaign's currency rules — that closes the last currency remainder
  in the same pass.
- A cross-producer pair where the only clean reviewer is a *third* model is
  rare here (gemini/gpt are both covered by Claude). If one appears, route to
  GPT-5 and note it.

Each session/sub-batch states its reviewing model in the Session Header and the
producer-mismatch basis.

## 3. Severity — harm-if-real, orthogonal to confidence, verdict, and evidence-state

The campaign tracks **confidence** (is the finding real?) and **verdict**
(FIX/CUT/REVIEW/DISMISS). It has no measure of **harm if real**. Severity is
that axis and that axis only — it answers "if this finding is true, how bad is
it for the learner," nothing else. Whether a claim still needs source
verification is **not** a severity; it is carried by `recommendedAction =
source_check` and `needsHumanReview = true` (§5).

| Severity | Meaning |
|---|---|
| `blocker` | Unsafe clinical teaching: wrong answer key, false rationale, dangerous delegation/priority/order, or stale medication/lab guidance that flips the keyed answer. |
| `major` | Item nonfunctional or misleading: genuinely ambiguous (second defensible answer), distractors that break the item, bilingual divergence that changes clinical meaning, or a cross-item contradiction a learner cannot reconcile. |
| `minor` | Teaches but imperfectly: awkward (not wrong) Chinese, a rationale that could teach better, slight redundancy, cosmetic polish. |
| `housekeeping` | Metadata only, no teaching impact: junk/oversized topic label, census/ledger/source-provenance drift. Routes to the deterministic normalization/metadata lane, never a clinical patch. |

Severity is **independent** of confidence: a finding can be HIGH-confidence /
`minor` (definitely awkward Chinese) or MEDIUM-confidence / `blocker` (probably a
wrong key, but a reconciliation exists). Both are recorded as-is.

**Action gating:** `blocker` and `major` trigger immediate repair specs.
`minor` → polish queue (batched, low priority). `housekeeping` → normalization /
metadata lane (not this audit's repair path). Source-verification need
(`recommendedAction = source_check`) cuts across all four — a `blocker` can be
"confirmed wrong, patch now" or "probably wrong, verify first," and the action
field, not the severity, says which.

## 4. Evidence & citation rules (inherited + concretized)

All parent §4 hard rules apply unchanged: Quotation Rule (verbatim text or no
finding), Two-Question Rule (`DC`/`AK` need two IDs), Articulation Rule, Hedge
Rule (LOW confidence + plausible reconciliation → `DISMISS`), and the parent §5
hallucination guards. Plus:

- **Citation only where it matters** (GPT review point). Internal defects —
  `DC`/`AK`/`RI`/`BD` and redundancy — need only the verbatim bank quotes; no
  external source. A dated source (body + year + the specific value) is
  **required** when the finding is `OG`, or when adjudicating *which side of a
  contradiction is correct* depends on a guideline. High-risk claim classes that
  require a source: medication and **dosage**, lab thresholds, infection
  control, procedure timing/complications, **obstetric / fetal monitoring**,
  delegation / scope-of-practice, CPR / emergency, dialysis, **oncology
  emergencies**, and **guideline-sensitive screening / vaccine** content. No
  source for one of these → `recommendedAction = source_check`,
  `needsHumanReview = true`; never assert from model knowledge.
- **Translation parity is judged clinically, not stylistically** (campaign §1,
  AGENTS check 13). A `BD` finding requires a meaning change: who does what,
  timing, negation, severity, escalation/priority, drug name/route, lab
  value/unit, client quote/consent, delegation-role boundary. Hold→give,
  before→after, can→cannot delegate, or lost urgency is `major`/`blocker`.
  Awkward-but-faithful Chinese is `minor` at most.
- **No UWorld overfitting** (GPT review point). Do not flag bilingual
  scaffolding, originality, or non-UWorld style as a defect unless it creates
  ambiguity or misteaching. The app teaches safely; it does not impersonate a
  commercial bank.

## 5. Output

Two artifacts, no canonical writes:

1. **`ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md`** — the findings report in the
   parent's format: Session Header (parent §2) per session/sub-batch; Findings
   in the §6 Finding format (`DC`/`AK`) and §7 Single-Question Concern format
   (`RI`/`SC`/`BD`/`OG`); sorted HIGH → MEDIUM → LOW → DISMISSED; verbatim
   evidence; a mandatory Alternative Interpretation on every finding; ≤3,000
   words per 50 audited items (parent §9 — exceeding it is the signal that
   evidentiary standards slipped). A zero-finding batch is a valid result. Full
   rationale (Conflict Claim, Alternative Interpretation) lives here.
2. **`audit/early-bank-semantic/coherence/ADVERSARIAL-AUDIT-2026-06-24.manifest.jsonl`**
   — a triage index, one row per actioned item, keyed back to the report by
   `findingRef`. It does **not** duplicate the report's prose or carry rewritten
   JSON:

```json
{
  "itemId": "string",
  "parentId": "string | null",
  "bank": "gemini-canonical.json | gpt-canonical.json | claude-canonical.json | hard-cases-canonical.json",
  "path": "questions[N] | questions[N].caseStudy.questions[M]",
  "itemType": "multiple_choice | select_all | ordered_response | fill_in_blank | matrix | dropdown_cloze | highlight | bowtie | case_study",
  "pairId": "string | null",
  "categoryCode": "DC | AK | RI | SC | BD | OG",
  "severity": "blocker | major | minor | housekeeping",
  "confidence": "HIGH | MEDIUM | LOW",
  "verdict": "FIX | CUT | REVIEW | DISMISS",
  "recommendedAction": "keep | source_check | patch | hold | discard",
  "needsHumanReview": true,
  "finding": "one-sentence statement of the defect",
  "evidence": "verbatim quoted span(s) from the bank",
  "source": "body + year + superseded/correct value — required for OG and guideline-dependent adjudications, else null",
  "reviewingModel": "claude-... | gpt-5...",
  "findingRef": "FINDING #N | CONCERN #N in the report"
}
```

- **`parentId`** is the case-study container ID for an embedded leaf
  (`null` for a top-level item); **`path`** is Layer A's exact locator. Both
  exist so the later patch pass can address the precise leaf without
  re-resolving it. `itemType` is copied from Layer A.
- **`recommendedAction` → campaign verdict mapping** (`verdict` stays the
  authoritative campaign field): `patch`=FIX, `discard`=CUT, `keep`=DISMISS,
  `source_check`=REVIEW (real but unverified — blocks on a source),
  `hold`=REVIEW (real, verified, but parked: a contested call or a
  non-urgent rewrite that needs a human decision, not a source).
- **`needsHumanReview`** is `true` when `verdict = REVIEW`, when a
  `blocker`/`major` would change a keyed answer, or when an `OG`/guideline
  adjudication lacks a confirmed source. It is the explicit "do not auto-apply"
  flag the parent task-spec report schema carried.
- No rewritten JSON in either artifact — repairs are separate patch specs so no
  model retypes canonical JSON in the audit pass (AGENTS quote safety;
  principle 15).

## 6. Remediation queue (grouped, for the report tail)

End the report with the proposals grouped so Luke can triage:

- **discard / retire (CUT):** strictly-dominated redundant duplicates;
  unsalvageable items.
- **patch (FIX, blocker/major):** the immediate-repair queue — each becomes a
  small `patch-raw` spec, EN+ZH together.
- **source_check (REVIEW + needsHumanReview):** real finding, needs a dated
  source before any action.
- **hold (REVIEW):** contested or non-urgent; awaits a human decision.
- **minor polish (minor):** batched, deferrable.
- **housekeeping:** routed to the deterministic normalization / metadata lane,
  not a clinical patch.

## 7. Done criteria

- [ ] Layer A regenerated (enhancement spec landed) before the slice is drawn.
- [ ] Session Header complete per session/sub-batch; reviewing model is a
      non-producer for every item in scope; track + clusters + provenance
      filter declared.
- [ ] Slice is 100–150 unique IDs from the coherence queue's highest-harm
      concept clusters; Claude-reviewable vs GPT-5 carve-out applied per §2.
- [ ] Every `DC`/`AK` finding has two IDs and verbatim evidence for both; every
      finding has an Alternative Interpretation; LOW + reconciliation → DISMISS.
- [ ] Every finding carries an independent `severity` (harm-only) and a
      `recommendedAction`; only `blocker`/`major` route to immediate repair.
- [ ] Every manifest row carries `itemType`, `path`, and `parentId`
      (`null` for top-level); embedded-leaf findings name their case container.
- [ ] `OG` and guideline-dependent adjudications carry a dated source, else
      `recommendedAction = source_check` + `needsHumanReview = true`.
- [ ] Findings sorted by confidence; under the word budget; zero-finding batches
      stated explicitly.
- [ ] Manifest emitted; no canonical edits; no rewritten JSON in the audit
      artifacts.
- [ ] Report closes with the grouped remediation queue and an explicit
      **scale-or-stop** recommendation: did the concept seeds and severity axis
      surface enough real, high-severity findings to justify the full coherence
      sweep (Phase B), or should the approach be tuned first?

## 8. After the pilot

- If scale is justified: Phase B runs the rest of the coherence queue in
  ≤100-item harm-sorted batches, same apparatus, Claude/GPT-5 split by
  provenance.
- The `blocker`/`major` repair specs are written and executed (Luke) via
  `patch-raw --allow-canonical --reason`, each updating EN **and** ZH together
  (principle 9 / campaign §5), with ledger + `npm run census && census:check` at
  execution time, verified in the Review Console (`?dev=1&qids=`).
- **Record closeout:** update `audit/early-bank-semantic/CAMPAIGN-STATUS.md`
  (coherence track opened, pilot result), `BANK-REVIEW-LEDGER.md` (any executed
  cure/cut), and `PROJECT-HISTORY.md` (active-scope change: the coherence track
  is now open) — per AGENTS.md, history and ledger are the current status/review
  records and update when scope or review status moves.
- **Named follow-on — visual-necessity audit (separate spec, not this one).**
  The principle-6 necessity test ("what cue is available *only* from the visual;
  if the answer is unchanged with the visual removed, it is decorative and
  invalid") applies to the visual-kind canonicals (the committed visual lanes
  in `AGENTS.md`), which Layer A does not
  route and whose method differs from text coherence. Spec it separately if/when
  the visual lane is prioritized; do not fold it into this text-bank pilot.
