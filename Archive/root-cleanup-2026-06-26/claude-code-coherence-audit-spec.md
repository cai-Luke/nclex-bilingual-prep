# claude-code-coherence-audit-spec.md

Execution spec for **Claude Code** to run the Claude lane of the Phase A
adversarial semantic audit pilot, then perform final lane aggregation because
Claude Code is expected to run last. Findings-only — **no canonical writes.**
This is clinical review work; produce findings/manifest artifacts and merge the
completed lanes, but do not patch banks.

Governing rules (read first, in order): `AGENTS.md` ›
`Archive/root-specs-2026-06-18/NCLEX_Audit_Spec.md` (parent — Finding/Concern
format §6/§7, evidentiary standards §4, hallucination guards §5, output budget
§9) › `Archive/early-bank-semantic-audit-spec.md` (campaign — tracks, verdict
vocab) › `adversarial-audit-phase-a-pilot-spec.md` (pilot — north star,
severity axis §3, citation rules §4, manifest schema §5). DECISIONS principles
2, 7, 9, 22 apply.

> North star: passing schema/build/promotion proves only structural validity;
> this audit asks whether a structurally valid item could still mislead,
> misprioritize, mistranslate, overcue, contradict another item, or teach
> stale/unsafe nursing judgment.

## Inputs

- **Slice:** `audit/early-bank-semantic/coherence/2026-06-24.slice.json`. Use the
  pairs with `reviewer === "claude"` (149 pairs across 109 items, but **two of
  the seven `reviewer === "gpt-5"` pairs were re-routed to Gemini** — that does
  not affect your `claude` set). Each pair carries `a`/`b`, `clusters`,
  `a_path`/`b_path`, `a_bank`/`b_bank`. Read the actual items from the named
  bank at the named path.
- **Banks (read-only):** `banks/gemini-canonical.json`, `banks/gpt-canonical.json`,
  `banks/hard-cases-canonical.json`, `banks/claude-canonical.json`.
- **Opus currency sub-task:** `CLAUDE-OPUS-CURRENCY-HANDOFF-2026-06-24.md` (5
  rows, OG track, paths already corrected to live indices).
- **Completed Gemini adjudication:** Luke accepted the Gemini recommendations
  already recorded in `ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md` and
  `audit/early-bank-semantic/coherence/ADVERSARIAL-AUDIT-2026-06-24.manifest.jsonl`.
  Those two pairs are DISMISS/keep and should be preserved, not re-audited.
- **Codex lane outputs:** if present, merge
  `audit/early-bank-semantic/coherence/lanes/codex.findings.md` and
  `audit/early-bank-semantic/coherence/lanes/codex.manifest.jsonl` during final
  cleanup. If absent, record that Codex has not landed yet and do not fabricate
  its findings.

## Producer ≠ checker (why this lane is clean)

Every `claude` pair has both ends produced by Gemini or GPT — Claude is
non-producer for both, so no conflict. The lane includes Opus items
(`opus*`), which are GPT-provenance per principle 22 and therefore
Claude-auditable; two of them (`opus3_…_q3/q5`) additionally carry a prior
Claude *promotion* review, which is acceptable here because coherence is a
**relational** cross-item judgment (does A contradict B), not the single-item
re-review that blocked them for currency. State this in the session header.

## Task — coherence track (DC/AK lead; RI/SC/BD ride along)

Run as **harm-ordered sub-sessions**, each ≤50 items / ≤3,000 words (parent §9;
exceeding the budget is the signal that evidentiary standards slipped):

1. `delegation_scope` (largest)
2. `isolation_mode`
3. `potassium_replacement` + `insulin_hypoglycemia`

For each pair, judge **DC** (direct contradiction — two items teach
incompatible rules) and **AK** (answer-key conflict — same scenario, divergent
keyed answer). On any item already in the slice, also flag **RI** (internal
inconsistency), **SC** (stem cueing/answer leakage), **BD** (bilingual
divergence that changes clinical meaning — EN vs ZH; style-only divergence is
not a finding, per AGENTS check 13). Where a redundancy cluster of ≥3 near-
duplicates surfaces, note it.

Hard rules (parent §4–§5):
- **Quotation rule:** verbatim text or no finding. Every DC/AK cites the exact
  spans from *both* IDs.
- **Two-question rule:** DC/AK require two real IDs.
- **Alternative Interpretation:** mandatory on every finding — the strongest
  reconciliation a defender would give.
- **Hedge rule:** LOW confidence + a plausible reconciliation → `DISMISS`.
- **No UWorld overfitting:** bilingual scaffolding / non-UWorld style is not a
  defect absent ambiguity or misteaching.
- **Citation only where it matters:** internal defects (DC/AK/RI/BD/redundancy)
  need only the bank quotes; a dated authoritative source is required only when
  adjudication depends on a guideline (med/dose, lab threshold, infection
  control, procedure timing, FHR, delegation scope, CPR, dialysis, oncology
  emergency, screening/vaccine). No source → `recommendedAction = source_check`,
  `needsHumanReview = true`; never assert from model knowledge.

## Opus currency sub-session (separate, OG track)

After the coherence sub-sessions, run the 5 Opus currency rows per
`CLAUDE-OPUS-CURRENCY-HANDOFF-2026-06-24.md`: single-item OG (is the guidance
current?) on anticoagulation/discharge-med-rec (`opus1_…`) and IV-potassium
safety (`opus3_…`), with dated sources. State the Luke override (prior
Claude-final-review) in that sub-session's header. Output to the separate files
named in that handoff (`currency/13-opus-currency-claude-exception.*`), not the
coherence report.

## Severity, verdict, manifest (pilot §3, §5)

Each finding carries an **independent** `severity` (harm-if-real:
`blocker`/`major`/`minor`/`housekeeping`), plus `confidence`
(HIGH/MEDIUM/LOW), `verdict` (FIX/CUT/REVIEW/DISMISS), and `recommendedAction`
(`keep`/`source_check`/`patch`/`hold`/`discard`). Only `blocker`/`major` route
to immediate repair.

## Lane outputs (no canonical writes, no rewritten JSON)

Write the Claude coherence lane to lane-scoped files first:

- `audit/early-bank-semantic/coherence/lanes/claude.findings.md`
- `audit/early-bank-semantic/coherence/lanes/claude.manifest.jsonl`

Keep the Opus currency exception in its separate currency files named above.
Do not write the Claude coherence lane directly over the shared final report
until the final aggregation step.

## Final aggregation / cleanup (Claude Code runs last)

After completing the Claude coherence lane and the Opus currency exception:

1. Preserve the existing Gemini-adjudicated section and manifest rows from
   `ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md` and
   `audit/early-bank-semantic/coherence/ADVERSARIAL-AUDIT-2026-06-24.manifest.jsonl`.
2. Append/merge `lanes/codex.*` if present, then append/merge `lanes/claude.*`.
   Keep session headers intact and do not renumber findings unless needed for
   duplicate `findingRef` clarity.
3. Ensure the final shared report closes with one grouped remediation queue and
   one scale-or-stop recommendation for the whole pilot, incorporating Gemini,
   Codex, and Claude lanes.
4. Validate the final JSONL manifest by parsing every line as JSON and checking
   the pilot §5 fields are present (`itemId`, `parentId`, `bank`, `path`,
   `itemType`, `pairId`, `categoryCode`, `severity`, `confidence`, `verdict`,
   `recommendedAction`, `needsHumanReview`, `finding`, `evidence`, `source`,
   `reviewingModel`, `findingRef`).
5. Leave canonical banks untouched. Repairs/cuts, if any, become later patch
   specs after Luke reviews the merged report.

## Final outputs

1. **`ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md`** — Session Header per
   sub-session/lane (reviewing model; track; clusters; provenance basis;
   producer-mismatch note); Findings in parent §6 (DC/AK) and §7
   (RI/SC/BD/OG) format; sorted HIGH → MEDIUM → LOW → DISMISSED within each
   lane; verbatim evidence; mandatory Alternative Interpretation; under the §9
   budget; zero-finding sub-sessions stated explicitly. Close with the grouped
   remediation queue (retire/patch/source_check/hold/minor/housekeeping) and a
   **scale-or-stop** recommendation for Phase B.
2. **`audit/early-bank-semantic/coherence/ADVERSARIAL-AUDIT-2026-06-24.manifest.jsonl`**
   — one row per actioned item, schema exactly per pilot §5 (`itemId`,
   `parentId`, `bank`, `path`, `itemType`, `pairId`, `categoryCode`, `severity`,
   `confidence`, `verdict`, `recommendedAction`, `needsHumanReview`, `finding`,
   `evidence`, `source`, `reviewingModel`, `findingRef`). No rewritten canonical
   JSON — repairs become separate patch specs later.

## Done criteria

- [ ] Three coherence sub-sessions + the Opus currency sub-session, each within
      the §9 budget, each with a complete Session Header.
- [ ] Claude lane first written to `lanes/claude.findings.md` and
      `lanes/claude.manifest.jsonl`; Opus currency written to the separate
      currency files.
- [ ] Existing Gemini DISMISS/keep adjudication preserved; Codex lane merged if
      present, or explicitly noted absent.
- [ ] Every DC/AK has two IDs + verbatim evidence for both; every finding has an
      Alternative Interpretation; LOW + reconciliation → DISMISS.
- [ ] Every finding has an independent `severity` and a `recommendedAction`;
      guideline-dependent adjudications carry a dated source or are
      `source_check` + `needsHumanReview`.
- [ ] Manifest rows carry `path`/`parentId`/`itemType`; embedded leaves name
      their case container.
- [ ] Final JSONL manifest parses line-by-line and every row has the pilot §5
      required fields.
- [ ] No canonical edits; no rewritten JSON; findings sorted by confidence.
- [ ] Report closes with grouped remediation queue + scale-or-stop call.
