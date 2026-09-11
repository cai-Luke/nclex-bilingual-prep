# Checker launch instruction — verbatim record

Recorded by the independent content checker before any semantic work, and bound
into `checker-freeze.json`. This is the exact instruction under which Stage 2 was
executed.

- Recorded at: 2026-09-10
- Seat: Claude Code / Claude Opus 5 — independent content checker
- Access mechanism: LIVE_LOCAL_DISK (direct POSIX filesystem read/write of the
  working tree at `/Users/holemini/Desktop/Project Shrimp`, via shell tooling).

---

```
Implementation seat: Claude Code / independent content checker
Model: Claude Opus 5
Mode: Campaign 16 R4 blind full reconstruction, through checker freeze only

Work from the live local repository:
~/Desktop/Project Shrimp/

This is Stage 2 of an ALREADY OPEN commission. Continue in:
audit/campaign-16-anchor-boundary-repair-2026-09-09-r1/

Do not create r2, reopen the commission, regenerate opening artifacts,
or modify the existing producer freeze.

READ FIRST

Read AGENTS.md, then:
audit/campaign-16-anchor-boundary-repair-2026-09-09-r1/external-checker-handoff.md

Read the governing work order:
scratch/CAMPAIGN-16-PHASE-E-451-BOUNDARY-REPAIR-WORK-ORDER-2026-09-09-R4.md

Follow its required governance and accepted-contract reads, subject to
the handoff's explicit pre-freeze exclusions.

The pinned work-order SHA-256 is:
8cd476c23f2b6cadb07ae8115fd675fbbfc3f60acb46d7a521d5d1da30b2558b

The pinned producer-freeze.json SHA-256 is:
151c1327a5d9fa4decf9897200f2d336e55cea31d0f978317a7653c5c4193e4a

Verify the actual local branch/HEAD, allowlisted source identities and
hashes, the 13 bank fingerprints, inventory, and whole-parent source
snapshots before semantic work. Verify existing frozen artifacts;
do not regenerate them.

These artifacts are local and uncommitted. GitHub-only access is
insufficient. Report your actual access mechanism and limitations.
The existence of the documented commission files is expected, not
evidence that the commission must restart.

BLINDNESS

Use a fresh context without producer judgments, previous review
conversations, or summaries derived from them.

Every content search must name explicit allowlisted files, or be
restricted to the commission's source-packets/ directory.

No repository-root or commission-root recursive content search.
No broad audit/ searches. Do not follow governance/history links into
excluded semantic evidence.

Until ALL checker packets and the complete checker freeze are finalized,
do not read:
- producer/;
- producer-support/;
- producer conversations, transcripts, summaries, proposed boundaries,
  exception lists, or disposition distributions;
- prior Phase E semantic verdicts or parent-calibration adjudications;
- other non-allowlisted material that could expose producer judgments.

Do not run or import producer helpers, including freeze_producer.py:
they can read excluded artifacts. Use checker-owned mechanical tooling.

Reading allowed producer-freeze metadata is permitted. Opening producer
packets to recompute their hashes is not permitted during this blind pass.

If excluded judgments enter the context, stop and report the exposure.
Preserve completed artifacts. Do not claim that ignoring exposed material
restores blindness.

SCOPE AND REPRESENTATION

Independently review all 451 frozen rows across all 93 parents, keeping
the original 27 bank-pure, parent-whole packets. This is not sampling.

Read complete parents and both learner-facing languages. Preserve the
frozen packet membership and identity fields.

Use commission-manifest.json -> representation as the implementation
pin authorized by R4 SD:
- BASELINE: proposedBoundary is exactly {"kind":"baseline"}.
- STAGE: proposedBoundary is the exact declared stage-id string.
- EXCEPTION: proposedBoundary is null, with an explicit reason.
- Never emit orStage or another competing boundary field.

Reconcile by rowKey and cross-check bankPath, parentCaseId, and partId.
Copy stage0QueueIndex exactly from the frozen inventory; do not use the
illustrative zero, renumber it, or discard it.

Provide all R4-required row evidence, bilingualRelation, confidence,
and exceptionReason.

SEMANTIC INTERPRETATION

Apply R4's earliest legitimate learner-visible answerability rule.
Do not infer boundaries mechanically from stage titles, timestamps,
part order, sibling anchors, or first/final-stage defaults.

A legitimate STAGE supplies information needed to answer the actual
question. A later statement that merely supplies or confirms the answer
is not a substitute for missing decision evidence.

The word "outcome" and a stage's position are not classification rules.
A question genuinely evaluating an outcome may require observations
from an outcome stage. Explain the information dependency.

PARALLEL does not require literal translation identity. It requires the
same earliest defensible boundary for the same task in both languages,
without a material bilingual conflict affecting answerability or
answer correctness. Material mismatch or uncertainty remains subject
to R4's EXCEPTION rules.

Do not invent facts, change answer logic, fix translations, or alter
other content to obtain a repairable boundary. Do not treat rationale
or answer-key knowledge as learner-visible evidence.

Record confidence honestly. A non-HIGH result cannot pass the later
acceptance gate. Neither repair count nor exception count is a target.

These clarifications do not replace R4 SE.1 or authorize reinterpretation
of frozen producer decisions. Unresolved row-level ambiguity is an
explicit exception, not permission to change the rubric.

WRITES AND FREEZE

Write only new checker-owned artifacts:
- checker/<repairPacketId>.json;
- narrowly necessary checker-support/ files and mechanical tooling;
- checker-freeze.json and its separate hash receipt.

Record this launch instruction in checker-support/ before semantic work
and bind it into the checker freeze. Do not edit the frozen work order,
commission manifest, source packets, producer artifacts, or shared tools.

Checkpoint and freeze each completed packet without overwriting an
existing freeze. Hash exact file bytes as written using SHA-256 and
record byte length. Do not hash a normalized or reserialized substitute.

The complete checker-freeze.json must reconcile all 451 unique rows,
93 parents, and 27 packets; record packet paths, byte lengths, hashes,
source bindings, checker provenance, and any access/independence
limitations. Hash its final bytes separately after writing it.

Keep producer and checker artifacts frozen. Their file hashes establish
integrity; semantic agreement is a later field-level comparison.

STOP

Stop at complete checker freeze.

Do not unblind, compare outputs, create accepted mappings, adjudicate
disagreements, patch banks, change schema versions, regenerate census,
update ledger/history, perform Git mutations, or claim final acceptance.

Report completed coverage, the checker-freeze identity, preservation
checks, and unresolved limitations. Incomplete work must be reported
as incomplete rather than represented as a full check.
```

---

## Checker-recorded deviations / disclosures at launch

1. **Directory-listing metadata exposure (non-semantic).** During initial
   commission-structure orientation the checker ran a directory listing that
   included `producer/` and `producer-support/`. Only filenames, byte sizes and
   modification timestamps were returned; no file content from either directory
   was opened or read. Two `producer-support/` filenames contain topical words.
   This is disclosed rather than suppressed. No producer disposition, boundary,
   reasoning, exception list or distribution was exposed. The checker did not
   read `producer-freeze.json` contents beyond confirming its SHA-256.
2. No producer helper (`tools/freeze_producer.py`, `tools/producer_io.py`) was
   imported or executed. All checker tooling is checker-authored and reads only
   allowlisted inputs.
