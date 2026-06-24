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
  campaign §0) and **not** a visual load-bearing audit (that is the separate
  visual lane; the four text banks carry no load-bearing stimuli).
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

## 3. Severity — new axis, orthogonal to confidence and verdict

The campaign tracks **confidence** (is the finding real?) and **verdict**
(FIX/CUT/REVIEW/DISMISS). It has no measure of **harm if real**. Add severity as
an independent field so a confidently-real awkward-Chinese line and a
confidently-real wrong answer key do not share a lane.

| Severity | Meaning |
|---|---|
| `blocker` | Unsafe clinical teaching: wrong answer key, false rationale, dangerous delegation/priority/order, stale medication/lab guidance that flips the keyed answer. |
| `major` | Item nonfunctional or misleading: genuinely ambiguous (second defensible answer), distractors that break the item, bilingual divergence that changes clinical meaning, a cross-item contradiction a learner cannot reconcile. |
| `minor` | Teaches but imperfectly: awkward (not wrong) Chinese, a rationale that could teach better, slight redundancy, polish. |
| `watch` | Possibly stale/wrong but needs source verification before any claim. Equivalent to verdict `REVIEW`. |

Severity is **independent** of confidence: a finding can be HIGH-confidence /
`minor` (definitely awkward Chinese) or MEDIUM-confidence / `blocker` (probably a
wrong key, reconciliation exists). Both are recorded.

**Action gating:** only `blocker` and `major` trigger immediate repair specs.
`watch` → REVIEW queue (source-check). `minor` → polish queue (batched, low
priority). This keeps remediation focused.

## 4. Evidence & citation rules (inherited + concretized)

All parent §4 hard rules apply unchanged: Quotation Rule (verbatim text or no
finding), Two-Question Rule (`DC`/`AK` need two IDs), Articulation Rule, Hedge
Rule (LOW confidence + plausible reconciliation → `DISMISS`), and the parent §5
hallucination guards. Plus:

- **Citation only where it matters** (GPT review point 4). Internal defects —
  `DC`/`AK`/`RI`/`BD` and redundancy — need only the verbatim bank quotes; no
  external source. A source (body + year + the specific value) is **required**
  when the finding is `OG`, or when adjudicating *which side of a contradiction
  is correct* depends on a guideline: medication, lab threshold, infection
  control, procedure timing, fetal monitoring, delegation/scope-of-practice,
  CPR/emergency, dialysis. No source for those → downgrade to `watch`/`REVIEW`,
  never assert.
- **Translation parity is judged clinically, not stylistically** (campaign §1,
  AGENTS check 13). A `BD` finding requires a meaning change: who does what,
  timing, negation, severity, escalation/priority, drug name/route, lab
  value/unit, client quote/consent, delegation-role boundary. Hold→give,
  before→after, can→cannot delegate, or lost urgency is `major`/`blocker`.
  Awkward-but-faithful Chinese is `minor` at most.
- **No UWorld overfitting** (GPT review point 8). Do not flag bilingual
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
   evidentiary standards slipped). A zero-finding batch is a valid result.
2. **`audit/early-bank-semantic/coherence/ADVERSARIAL-AUDIT-2026-06-24.manifest.jsonl`**
   — one row per actioned item:

```json
{
  "itemId": "string",
  "bank": "gemini-canonical.json | gpt-canonical.json | claude-canonical.json | hard-cases-canonical.json",
  "pairId": "string | null",
  "categoryCode": "DC | AK | RI | SC | BD | OG",
  "severity": "blocker | major | minor | watch",
  "confidence": "HIGH | MEDIUM | LOW",
  "verdict": "FIX | CUT | REVIEW | DISMISS",
  "finding": "one-sentence statement of the defect",
  "evidence": "verbatim quoted span(s) from the bank",
  "source": "body + year + superseded/correct value — required for OG and guideline-dependent adjudications, else null",
  "reviewingModel": "claude-... | gpt-5...",
  "recommendedAction": "retire | rewrite | source_check | minor_edit | keep"
}
```

`recommendedAction` maps to the campaign verdict vocab: `retire`=CUT,
`rewrite`/`minor_edit`=FIX, `source_check`=REVIEW, `keep`=DISMISS. A `FIX`/CUT
proposal does **not** include the rewritten JSON here — repairs are separate
patch specs so no model retypes canonical JSON in the audit pass (AGENTS quote
safety; principle 15).

## 6. Remediation queue (grouped, for the report tail)

End the report with the proposals grouped so Luke can triage:

- **retire (CUT):** strictly-dominated redundant duplicates; unsalvageable
  items.
- **rewrite (FIX, blocker/major):** the immediate-repair queue — each becomes a
  small `patch-raw` spec.
- **source-check (watch/REVIEW):** needs a dated source before action.
- **minor polish (minor):** batched, deferrable.

## 7. Done criteria

- [ ] Layer A regenerated (enhancement spec landed) before the slice is drawn.
- [ ] Session Header complete per session/sub-batch; reviewing model is a
      non-producer for every item in scope; track + clusters + provenance
      filter declared.
- [ ] Slice is 100–150 unique IDs from the coherence queue's highest-harm
      concept clusters; Claude-reviewable vs GPT-5 carve-out applied per §2.
- [ ] Every `DC`/`AK` finding has two IDs and verbatim evidence for both; every
      finding has an Alternative Interpretation; LOW + reconciliation → DISMISS.
- [ ] Every finding carries an independent `severity`; only blocker/major are
      routed to immediate repair.
- [ ] `OG` and guideline-dependent adjudications carry a dated source, else
      `watch`/REVIEW.
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
- The blocker/major repair specs are written and executed (Luke) via
  `patch-raw --allow-canonical --reason`, each updating EN **and** ZH together
  (principle 9 / campaign §5), with ledger + `npm run census && census:check` at
  execution time, verified in the Review Console (`?dev=1&qids=`).
- `audit/early-bank-semantic/CAMPAIGN-STATUS.md` is updated to record the
  coherence track opening and the pilot result.
