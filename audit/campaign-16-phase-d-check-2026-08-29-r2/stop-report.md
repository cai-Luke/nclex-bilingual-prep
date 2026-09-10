# Campaign 16 Phase D — Checker Stop Report

Seat: Claude (independent content-gate checker/orchestrator), work-order §7.3.
Date: 2026-08-29
Checker root: `audit/campaign-16-phase-d-check-2026-08-29-r2/`

## Terminal

`CAMPAIGN16_PHASE_D_BLOCKED`

**Gate:** §7.1.1 / §7.3 semantic-isolation precondition — no enforceable tool-permission manifest or
dispatch receipt is available in this environment to prove a semantic subcontext was created without
repository/filesystem tools. Per §7.1.1 ("If the checker environment cannot expose an enforceable
tool-permission manifest or dispatch receipt ... stop rather than replace isolation with an
honor-system assertion") and the launch instruction's identical directive, this commission stops
before any semantic dispatch, packet generation, blind review, or lock.

**No `CAMPAIGN16_PHASE_D_CONTENT_READY` is issued.** No candidate was reviewed. No packet was
generated for any of the 12 candidates. No canonical bank, ledger, census, or producer artifact was
read for semantic content or touched.

## What was completed before the stop (orchestration-seat-legitimate, hash-only)

1. Read live `AGENTS.md` (already current from this session) and the frozen work order in full.
2. Independently re-hashed the frozen work order:
   `scratch/CAMPAIGN-16-PHASE-D-BOWTIE-REPAIR-WORK-ORDER-2026-08-29.md` →
   `6a0154f7dd3cb0c663ed5bed9c6346058e1e38a16c333ae04f0c328fe0230bba` — **matches** the required
   digest exactly.
3. Asserted `audit/campaign-16-phase-d-check-2026-08-29-r2/` was absent before creating it —
   confirmed via `ls` (`No such file or directory`) — then created the root.
4. Independently re-hashed all five producer handoff files. All five **match exactly**:

   | File | Independently computed SHA-256 | Matches required value |
   |---|---|---|
   | `repair-candidates.jsonl` | `0ec3853f2ff0a863e458316098b3976791b39ac040b4cfff942a978a0462a7ca` | yes |
   | `repair-manifest.json` | `c8cd68a0932092e633cfbde9ea3ec0bae875f384bf777e0ff03f3b27f9b593eb` | yes |
   | `adapter-fidelity.json` | `1bdad0d7a2323027a1307c05d0bf879e3ce3b8efa64200c3bf062f911f208d26` | yes |
   | `verification-preapply.json` | `8651659eda1c0b204d3322ec1ff4f0e63cad3bc28f847417b73e778e58d715e2` | yes |
   | `scripts/patches/2026-08-29-campaign16-phase-d-bowtie-repair.ts` | `cd265d54b18ec88421f5507c06faf5a2625b47c54bc38a036a29ff24e6acd12d` | yes |

5. Confirmed the producer package `audit/campaign-16-phase-d-bowtie-repair-2026-08-29-r2/` exists
   with the expected Stage-0/Stage-1 file set (`execution-plan.md`, `opening-state.json`,
   `repair-manifest.json`, `repair-candidates.jsonl`, `producer-report.md`,
   `verification-preapply.md`/`.json`, `adapter-fidelity.json`, plus supporting `stage0-*` and
   `preapply.ts`/`adapter.ts`/`repair-spec.ts`/`build-candidates.ts` program files).

**No content within `repair-candidates.jsonl`, `repair-manifest.json`, or any candidate payload was
opened or read.** Only whole-file SHA-256 digests were computed.

## Why this stops the commission

### 1. No available agent type provides a genuine zero-tool semantic context

The work order requires, for each of 12 candidates: a fresh semantic context with
`repositoryAccessPermitted: false`, no filesystem tools, and a machine-readable dispatch/tool-permission
receipt proving that absence — checked mechanically by the orchestrator before any semantic lock is
accepted (§7.3, `semantic-contexts.jsonl` schema).

Every subagent type actually available to this session (`claude`, `claude-code-guide`, `Explore`,
`general-purpose`, `Plan`, `statusline-setup`) is provisioned with `Read` and, for most, `Bash` —
i.e., repository/filesystem access is present in every dispatchable context. Neither the Agent tool
nor the Workflow tool exposes a parameter to strip tool access from a spawned context, and neither
tool emits any inspectable tool-permission manifest or dispatch receipt as an artifact. There is
therefore no mechanism in this environment to produce the receipt §7.1.1 and §7.3 require.

The only way to proceed without that receipt would be to dispatch a tool-capable agent and instruct
it not to use its tools — exactly the "honor-system assertion" both §7.1.1 and the launch instruction
explicitly forbid substituting for the receipt. This checker declines to do that.

### 2. Independent contamination specific to candidate 12

`gpt_format7c_exercise_hypoglycemia_bowtie` is candidate 12 of the roster. In the immediately
preceding task in this same conversation (the Phase C closeout independent check,
`audit/campaign-16-phase-c-closeout-check-2026-08-28-r6/`), this orchestration seat read the full
`adjudication.jsonl` row for this candidate (surrogate `CAND-18`) directly from
`audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/adjudication.jsonl` — including its
`defectSummary`, `missingFactProvenance` (with `sourceEvidence` text quoting the rationale), keyed
action A3 detail, `secondaryFlags`, and `primaryVerdict`. That is retained context this session
cannot discard.

Even if the tooling gap in (1) were solved, this seat could not honestly claim a blind fresh context
for candidate 12 specifically, because it already possesses semantic detail about that exact
candidate's frozen finding. A truthful `semantic-contexts.jsonl` row for candidate 12 could not set
`isolatedPerCandidate: true` with `repositoryAccessPermitted: false` and mean it, regardless of which
agent type dispatched it, because the *orchestrator itself* — the seat responsible for asserting
isolation — is contaminated for this one candidate.

### 3. No workaround attempted

Per the launch instruction ("If your current environment cannot actually provide that isolation
receipt, STOP. Do not substitute an instruction telling a tool-enabled context not to look at the
repo.") and §7.1.1's identical directive, no workaround was attempted: no packets were generated, no
subagent was dispatched with an unverifiable "don't look" instruction, and no candidate was reviewed
under a same-context approximation of blindness.

## What is preserved / not touched

- No canonical bank was read for content beyond whole-file hashing already performed in the prior
  Phase C task (unrelated to this commission) and no bank was mutated.
- No ledger, census, `PROJECT-HISTORY.md`, or `DECISIONS.md` entry was made.
- The producer package `audit/campaign-16-phase-d-bowtie-repair-2026-08-29-r2/` was not modified.
- Neither frozen historical answerability tree
  (`audit/standalone-bowtie-answerability-census-2026-08-23/`,
  `audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/`) was written to.
- No `git add`, commit, push, stash, restore, or clean was performed.

## What would resolve this blocker

This is an environment-capability gap, not a content or evidence defect. Resolving it requires one
of:

1. A dispatch mechanism in this environment that can spawn a context with verifiably zero
   repository/filesystem tool grants and that exposes a machine-readable receipt of that grant state
   (e.g., a tool-restricted agent profile plus an inspectable permission manifest) — not currently
   available to this session.
2. An explicit owner ruling relaxing the isolation-receipt requirement for this commission (a
   governance decision this checker seat is not authorized to make on its own, per §7.1.1's own
   framing that this is a stop condition, not a discretion point).
3. Routing candidate 12 specifically to a genuinely fresh, uncontaminated seat/session regardless of
   how (1) is resolved, since this orchestrator cannot self-certify blindness for that one candidate.

No further Phase D checker action was taken pending owner direction.
