# Campaign 16 Phase D — Checker Retry (R2-retry-1) — Review

Seat: Claude (independent content-gate checker/orchestrator), work-order §7.3, executed under the
owner's 2026-08-29 retry ruling.
Checker root: `audit/campaign-16-phase-d-check-2026-08-29-r2-retry-1/`
Frozen work order: `scratch/CAMPAIGN-16-PHASE-D-BOWTIE-REPAIR-WORK-ORDER-2026-08-29.md` — SHA-256
`6a0154f7dd3cb0c663ed5bed9c6346058e1e38a16c333ae04f0c328fe0230bba` (independently reconfirmed).

## Terminal

`CAMPAIGN16_PHASE_D_CONTENT_READY`

All 12 candidates are retained and `PASS_STANDALONE`. This is content authorization for the
frozen after-payload bytes recorded in `review.json` only — it is **not** permission to change
those bytes during Stage-3 application, and it is **not** Stage-3 apply itself. No canonical bank
was mutated by this commission.

## Why the frozen R2 checker root stopped and how this retry differs

`audit/campaign-16-phase-d-check-2026-08-29-r2/` recorded `CAMPAIGN16_PHASE_D_BLOCKED`: the prior
session could not produce a machine-readable dispatch/tool-permission receipt proving a semantic
subcontext was created without repository/filesystem tools, and separately flagged that its own
orchestrator had read candidate 12's Phase C adjudication content earlier in that same
conversation. That root is preserved unmodified and was not read for semantic content by this
retry.

This retry resolves the environment-capability gap by dispatching each candidate's full semantic
turn sequence to a genuinely separate OS process — a nested `claude -p` invocation launched with
`--tools "" --disallowedTools "*" --strict-mcp-config`, run from a unique neutral
non-repository working directory, never inside the Agent/Task subagent mechanism. Every turn's
`system/init` event was captured verbatim and mechanically checked for `"tools":[]` and
`"mcp_servers":[]` before that turn's output was trusted for anything. This retry also runs in a
freshly started session that had not read candidate 12's adjudication content before this
commission began.

## Independent verification performed before any semantic dispatch

1. **Frozen work order hash** — recomputed, exact match.
2. **Producer handoff hashes** (`repair-candidates.jsonl`, `repair-manifest.json`,
   `adapter-fidelity.json`, `verification-preapply.json`, patch program) — all 5 recomputed, all
   exact match.
3. **48/48 adapter fidelity** — independently re-derived using a checker-authored adapter
   (`checker-adapter.ts` / `verify-fidelity.ts`), not the producer's `adapter.ts`, spot-checked
   against the actual frozen historical files on disk. `checker-adapter-fidelity.json`: `PASS`,
   48/48 exact-byte matches.
4. **Candidate-freeze roster reconciliation** (`freeze.ts` → `candidate-freeze.json`) — all 12
   candidates independently resolved by stable ID against the frozen §2.1 table, correct bank,
   after-payload SHA-256 recomputed from the embedded payload and cross-checked against both
   `repair-candidates.jsonl` and `repair-manifest.json`. All 11 paired companion payloads
   independently re-hashed and confirmed `match: true` against the frozen `c2ff546` identity.
   Fresh surrogate IDs `PDRT1-01`…`PDRT1-12` assigned, disjoint from historical `CAND-XX` IDs and
   never exposed to any semantic subcontext.

## Semantic dispatch

- Model: `claude-opus-4-7` (resolved from `--model opus`), reasoning effort `high`.
- 12 candidates, 12 unique session IDs (`agentContextId`), zero context reuse, zero forked prior
  context, zero repository access — all independently confirmed from raw receipts, not asserted.
- 48 total locked turns (Stage 1, Stage 2, standalone unblinding, paired-provenance/unpaired-final
  ×12) plus a small number of same-session formatting retries (never a semantic redo — the same
  isolated zero-tool context, asked to reissue as pure JSON). Every turn's receipt shows
  `tools: []`, `mcp_servers: []`.
- Full evidence: `semantic-contexts.jsonl`, `receipts/<surrogateId>/*.jsonl` (raw stream-json),
  `blind-packets/`, `standalone-packets/`, `sibling-packets/`, `blind-reviews/`, `phase-f/`,
  `locks/`.
- Total API cost: **$11.78** across the smoke-test candidate and the full 11-candidate batch.

## Result: 12/12 `PASS_STANDALONE`

| Surrogate | Candidate | Frozen verdict | Checker verdict (post-repair) | Advisory |
|---|---|---|---|---|
| PDRT1-01 | `gpt_case_caregiver_role_strain_dementia_01_bowtie` | FAIL_HIDDEN_CASE_DEPENDENCY | **PASS_STANDALONE** | P3 |
| PDRT1-02 | `gpt_case_infection_control_clustered_care_01_bowtie` | FAIL_HIDDEN_CASE_DEPENDENCY | **PASS_STANDALONE** | P2 |
| PDRT1-03 | `gpt_case_acute_hemolytic_transfusion_reaction_01_bowtie` | FAIL_HIDDEN_CASE_DEPENDENCY | **PASS_STANDALONE** | P3 |
| PDRT1-04 | `gpt_case_client_advocacy_refusal_01_bowtie` | FAIL_HIDDEN_CASE_DEPENDENCY | **PASS_STANDALONE** | P2 |
| PDRT1-05 | `gpt_case_lateral_incivility_01_bowtie` | FAIL_HIDDEN_CASE_DEPENDENCY | **PASS_STANDALONE** | P2 |
| PDRT1-06 | `gpt_case_mass_casualty_start_triage_01_bowtie` | FAIL_HIDDEN_CASE_DEPENDENCY | **PASS_STANDALONE** | P2 |
| PDRT1-07 | `gpt_case_gbs_respiratory_compromise_01_bowtie` | FAIL_HIDDEN_CASE_DEPENDENCY | **PASS_STANDALONE** | P3 |
| PDRT1-08 | `gpt_case_hipaa_disclosure_breach_01_bowtie` | FAIL_UNSUPPORTED_TOKEN_PREMISE | **PASS_STANDALONE** | P3 |
| PDRT1-09 | `gpt_case_neutropenic_fever_nadir_01_bowtie` | FAIL_UNSUPPORTED_TOKEN_PREMISE | **PASS_STANDALONE** | P3 |
| PDRT1-10 | `gpt_case_unsafe_premature_discharge_01_bowtie` | FAIL_UNSUPPORTED_TOKEN_PREMISE | **PASS_STANDALONE** | P3 |
| PDRT1-11 | `gpt_pph_2026_06_16_case_01_bowtie` | FAIL_UNSUPPORTED_TOKEN_PREMISE | **PASS_STANDALONE** | P3 |
| PDRT1-12 | `gpt_format7c_exercise_hypoglycemia_bowtie` | FAIL_UNSUPPORTED_TOKEN_PREMISE | **PASS_STANDALONE** | P3 |

No candidate returned `RETIRE_RECOMMENDED`, `FAIL_UNDERDETERMINED`,
`FAIL_CANONICAL_KEY_OR_LOGIC`, or `HOLD_REVIEWER_DISAGREEMENT`. No candidate's post-lock collateral
review surfaced a HIGH or MATERIAL-severity bilingual/clinical/scope issue in the standalone item
itself; all advisory items are P2/P3 and explicitly assessed as `rankabilityImpact: NONE`.

## Post-lock tool-enabled orchestration review (§7.3 item 6)

Performed only after all 48 turns were locked, per the required order.

- **Preservation, independently recomputed (not trusted from `repair-manifest.json`'s
  self-report):** for all 12 candidates, `id`, `category`, `topic`, `difficulty`, `itemType`,
  `ngnSkill`, token IDs and their order in all three zones, the keyed `correct` selections, and the
  3/4/4 token-count shape were diffed between the live pre-repair bank content and the
  `repair-candidates.jsonl` after-payload. **0 divergences across all 12.**
- **New clinical assertions:** only `gpt_case_gbs_respiratory_compromise_01_bowtie` introduces one
  — the repaired `act_continue_ivig` token/rationale conditions IVIG continuation on an infusion
  safety evaluation rather than presupposing it is already tolerated. Sourced to FDA-approved
  GAMMAGARD LIQUID prescribing information (DailyMed). Reviewed and accepted as standard,
  generically-supported infusion-safety guidance, not an invented dose/threshold/lab-range claim.
- **Authorial-constraint non-reversal (§6 item 12):** the repaired
  `gpt_format7c_exercise_hypoglycemia_bowtie` payload was independently grepped for the previously
  flagged "existing hypoglycemia [plan]" phrase and for any reintroduced author-facing
  prescription disclaimer. Clean on both. `testTakingStrategy` remains naturalized clinical
  language, not exam-construction or producer-facing text.
- **Bilingual review:** performed substantively by the isolated semantic reviewer as part of each
  locked final turn (`bilingualCollateral`), not merely asserted. Several genuine sibling-only
  translation/clinical-accuracy findings were surfaced (e.g., a mistranslation of "hypertensive
  urgency" as 高血压急症, which conventionally denotes hypertensive *emergency*, in PDRT1-05's
  companion case) — these are outside Phase D's 12-row scope (they live in a paired companion
  case, not the repaired bow-tie itself) and are recorded here for a future corpus-wide pass, not
  actioned by this commission.

## What is preserved / not touched

- No canonical bank was mutated. No `git add`, commit, push, stash, restore, or clean was
  performed.
- The frozen `audit/campaign-16-phase-d-check-2026-08-29-r2/` root was not modified and was not
  read for semantic candidate content.
- `BANK-REVIEW-LEDGER.md`, `PROJECT-HISTORY.md`, `DECISIONS.md`, and census artifacts were not
  touched — those remain Stage-3/post-apply and later-seat responsibilities per §9.

## What Stage 3 still requires

This terminal authorizes Stage-3 application of the exact reviewed after-payload bytes recorded in
`review.json` (`reviewedAfterPayloadSha256` per candidate), subject to every §7.4 precondition
(live pre-repair hash match, opening index blob unchanged, etc.) being re-verified immediately
before apply. It does not itself apply anything.
