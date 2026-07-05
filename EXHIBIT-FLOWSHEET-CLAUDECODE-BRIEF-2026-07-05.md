# Exhibit Flowsheet — Claude Code Migration Loop Brief (2026-07-05)

Purpose: hand the ongoing exhibit-flowsheet migration **adjudication loop** to Claude Code (Sonnet
tier is fine). The architecture, contract, gate, scorer, and unit/calcium policy are settled and on
disk; what remains is executing the per-batch loop against them. This brief is the entry point, not
the contract — the on-disk docs govern.

## First: read live, in order

Pull and read from disk before doing anything. Do not reconstruct repo state or rules from this brief
or from memory — memory drifts; the on-disk markdowns are the single contract.
1. `CLAUDE.md` → `AGENTS.md` → `PROJECT-HISTORY.md` → `DECISIONS.md` → `NCLEX-Question-Schema.md`
   (the standing read-order).
2. In `DECISIONS.md`, the three **2026-07-05** entries are load-bearing here: the conventional-first /
   analyte-aware **unit policy amendment**, the **prose-normalization lane** (bounded exception to
   prose immutability), and the **calcium total-vs-ionized identity** rule. (The older "never SI" CBC
   entry above them is marked SUPERSEDED — do not follow it.)
3. Contract + protocol: `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` (Rules A–F, GATES 1–4,
   record shape), `exhibit-flowsheet-migration-batch-protocol-codex-spec.md` (the loop, ramp, stop
   rule), `EXHIBIT-FLOWSHEET-BLIND-ADJUDICATION-2026-07-04.md` (what a clean adjudication looks like).

Repo access: the `fsmcp` connector (MCP tools), scoped to `/Users/holemini`; repo at
`/Users/holemini/Desktop/Project Shrimp`. An "access denied" almost always means the wrong connector,
not a missing file.

## Your seat: checker, not producer

You run the **gate + adjudication + ledger** end. Per producer≠checker (DECISIONS), the entity that
forms a batch's extraction/selection decisions must **not** be the entity that adjudicates them.
Extraction comes from a junior producer (Codex/GPT); you check it. Tier-switching to Sonnet is fine —
producer≠checker is about model *identity*, not capability tier. Do not extract and adjudicate the
same batch in the same seat.

## The per-batch loop

For each 20-panel batch, in manifest order:
1. **Gate (deterministic):** `npm run flowsheet-gate -- <batch>.json`. Any FAIL blocks the batch —
   return it to the producer; do not hand-patch past the gate. GATE 4 / calcium-identity / serial
   WARNs route to adjudication.
2. **Adjudicate the sample (your selection check):** for each sampled panel, independently determine
   the correct disposition from `content.en` — current vs prior/trend/serial exclusion, out-of-scope
   silence, post-intervention context, total/ionized calcium identity — and compare to the extractor.
   This is the check the gate structurally cannot do. Read the staged values yourself; do not
   rubber-stamp the producer's self-report.
3. **Ledger:** record batch, sample rate, sample size, selection errors, disposition in
   `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md`.

### Sampling ramp
- First **2 batches of each bucket: 100%** adjudication (real-bank extended validation — the blind
  set that earned the GO was synthetic).
- Taper to **25% random + always-sampled categories** only after two consecutive fully-adjudicated
  batches in that bucket with **zero** selection errors.
- Always-sampled (100%, every batch, on top of the random draw): every GATE 4 WARN; every
  `skip_serial`; every non-canonical CBC `sourceUnit`; every `post_intervention` context; every record
  with an `excludedValues` entry; every calcium-identity WARN.

### Stop rule
Any selection error (wrong current-vs-prior key, out-of-scope leak, mis-tagged post-intervention,
wrong serial lane, total/ionized calcium mislabel) **halts** the run. Understand the cause;
re-extract; widen the always-sampled set if the class isn't covered. A halt is a signal, not a
failure.

## Current state (2026-07-05)
- Manifest `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`: 337 panels — `clean_kv` 2, `prose_embedded`
  145, `scattered` 160, `serial` 30 (serial excluded from extraction). Note this is more than the
  original ~232 estimate; the manifest is just more complete.
- Bucket order: `clean_kv` (done) → `prose_embedded` (in progress) → `scattered` (last, hardest).
- Batch 1 (`clean_kv`): gate-clean.
- Batch 2 (`prose_embedded` #1): selection **clean** on independent Opus adjudication — the **first**
  of the two required 100% batches. One more clean 100% `prose_embedded` batch is needed before
  tapering to 25%.

## Blocker before batch 3
A gate fix for **sourceUnit laundering** is queued for Codex
(`EXHIBIT-FLOWSHEET-CODEX-NOTE-unit-laundering-2026-07-05.md`): the extractor silently substitutes
canonical units for conflicting source units on vitals (`RR 24 bpm` → `/min`), which hides prose the
normalization lane needs to see. Confirm that fix has landed before running batch 3. If it hasn't,
flag the same laundering pattern in your adjudication (it is not a selection error, but note it). It
does **not** invalidate batch 2's selection result.

## Escalate to Opus when…
The tell: **it is not a disposition call against the rubric, it is a question about whether the rubric
or the gate is right.** Concretely —
- A prose pattern the spec didn't anticipate that implies a gate/policy/code change. This keeps
  happening: batch 1 surfaced calcium identity; batch 2 surfaced ASCII `/mm3` and the unit-laundering
  pattern. When you hit one, escalate rather than invent handling.
- Scattered-bucket panels where current-vs-prior or total/ionized identity is genuinely ambiguous.
- Any calcium-identity or GATE 4 WARN you can't resolve cleanly against the source.
- The stop-rule judgment: is a selection error a one-off or systematic?
- The schema-1.8 `structuredMeasurements` product pass
  (`structured-measurements-schema-1.8-codex-spec.md`) — architecture + product decisions, not loop
  work. Do not start it.

## Do not
- Mutate bank prose. This is **values-only** extraction; prose normalization is a separate reviewed
  lane, not part of this loop.
- Write canonical banks or render anything. Staged artifacts only; the supplement-vs-replace product
  pass is deferred and gated on Luke's decisions.
- Taper sampling early, or promote a batch past a FAIL or an unresolved selection error.
- Let the extractor adjudicate its own batch.

## File map
- Contract: `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md`
- Protocol: `exhibit-flowsheet-migration-batch-protocol-codex-spec.md`
- Gate / scorer: `scripts/exhibit-flowsheet-gate.ts`, `scripts/exhibit-flowsheet-blind-score.ts`
- Manifest: `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`
- Ledger: `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md`
- Latest batch: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-02-prose_embedded-2026-07-05.json` +
  `-ADJUDICATION-2026-07-05.md`
- Standing policy: `DECISIONS.md` (2026-07-05 entries)
- Codex fix queue: `EXHIBIT-FLOWSHEET-CODEX-NOTE-unit-laundering-2026-07-05.md`
