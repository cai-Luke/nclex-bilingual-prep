# early-bank-semantic-batch-draw-codex-spec.md

Codex spec. Two parts: (A) correct the opus-prefix provenance tagging in Layer A
per DECISIONS principle 22, and (B) add a reusable, deterministic
`build-audit-batch` script that draws an audit batch (the Phase A pilot first,
Phase B batches later) off the Layer A queue and emits a static slice artifact.
Read-only re: canonical banks. Do **not** run the adversarial pilot.

Edit/create:
- `scripts/audit/early-bank-semantic-layer-a.ts` (Part A)
- `scripts/tests/early-bank-semantic-layer-a.ts` (Part A test)
- `scripts/audit/build-audit-batch.ts` (Part B, new)
- `scripts/tests/build-audit-batch.ts` (Part B test, new)
- `package.json` (one script entry)

## Part A — opus-prefix provenance fix

Per principle 22, Opus skeleton cases are GPT-provenance for routing: GPT owns
the clinical fact pattern + schema; Opus contributes prose only. The current
matchers key on the literal prefix `opus_`, so `opus1_` / `opus3_` / `opus24_`
fall through to producer `mixed` / tier `medium`. 59 of 115 opus-family items in
the queue are currently mis-tagged.

Two edits, both keyed on the matcher `/^opus\d*_/`:

1. **`producerFor`** — an `opus*` id is GPT-provenance, not Claude:
   ```
   if (/^opus\d*_/.test(id)) return "gpt";
   if (id.startsWith("gpt_") || bank.startsWith("gpt-")) return "gpt";
   if (bank.startsWith("claude-")) return "claude";   // genuine Claude-authored
   ...
   ```
   Order matters: test the opus pattern **before** the `bank.startsWith("claude-")`
   check, so an `opus*` item sitting in `claude-canonical.json` still resolves to
   `gpt`. Genuine `claude_*` items in `claude-canonical.json` (e.g.
   `claude_moc_*`) keep producer `claude`.

2. **`provenanceTierFor`** — an `opus*` id is low tier (same as `gpt_case_`):
   replace the literal `"opus_"` entry in `LOW_PREFIXES` handling with the
   pattern test, e.g. keep `LOW_PREFIXES = ["gpt_case_", "claude_cs_"]` and add
   `if (/^opus\d*_/.test(id)) return "low";` ahead of the prefix loop.

No other Layer A logic changes. This shifts only `producer` and
`provenance_tier` (and therefore the `provenanceBonus` term of `harm_rank` for
the 59 items, by −10 each). Concept/currency tagging, pairing, redundancy, row
counts, and `rows_by_track` are unaffected because none depend on
producer/tier. Expected summary delta: `inventory_by_provenance` shifts
`medium −59 → 906`, `low +59 → 531`, `high 819` unchanged; everything else in
the summary is byte-identical.

**Test additions** (`early-bank-semantic-layer-a.ts` test):
```
assert.equal(provenanceTierFor("opus3_iv_potassium_safety_case_01_q3"), "low");
assert.equal(provenanceTierFor("opus24_case_elder_neglect_01_q4"), "low");
// producerFor is not currently exported — export it, then:
assert.equal(producerFor("hard-cases-canonical.json", "opus3_iv_potassium_safety_case_01_q3"), "gpt");
assert.equal(producerFor("claude-canonical.json", "opus5_case_consent_interpreter_01_q1"), "gpt");
assert.equal(producerFor("claude-canonical.json", "claude_moc_deleg_uap_hl_01"), "claude");
```
Export `producerFor` for the test. Update the `recordedBaseline` snapshot only
if any pinned count moves (it should not). Re-run
`npm run audit:early-bank-semantic` so the regenerated queue/summary carry the
corrected tags.

## Part B — `build-audit-batch.ts` (reusable batch draw)

A deterministic reader of `audit/early-bank-semantic/layer-a-queue.jsonl` that
selects an audit batch by concept cluster and emits a static slice artifact.
This replaces the one-off hand draw and is reused for every Phase B batch.

**No bank access** — it reads only the queue JSONL. Pure, deterministic, sorted
output.

**Inputs** (CLI flags, with defaults for the pilot):
- `--clusters` comma list of concept clusters (default the pilot four:
  `delegation_scope,isolation_mode,potassium_replacement,insulin_hypoglycemia`)
- `--max` optional integer cap on unique item IDs (default none → take all)
- `--label` output label (default `2026-06-24`)
- `--out` output path (default
  `audit/early-bank-semantic/coherence/<label>.slice.json`)
- `--queue` queue path (default the standard location)

**Selection logic** (deterministic; sort everything by stable keys):
1. Parse queue rows; keep `track === "coherence"`.
2. A row's pilot clusters = its `routing_reasons` entries of the form
   `concept cluster: <name>` whose `<name>` is in `--clusters`.
3. **Seeds** = rows with ≥1 pilot cluster.
4. **Within-cluster pairs**: for each seed `a` and each pilot cluster `c` it
   carries, for each `peer ∈ a.pair_with` that is also a seed carrying `c`, add
   the unordered pair `{a,b}` tagged with `c` (a pair may carry several
   clusters). Dedup.
5. **Reviewer per pair**: `gpt-5` if either endpoint has `producer ∈ {claude,
   mixed}` (genuine Claude-authored or unknown-origin → conservative), else
   `claude`. (After Part A, `opus*` items are `gpt`, so only real `claude_*`
   items force `gpt-5`.)
6. **`--max` cap** (when given): order seeds by `harm_rank` desc, then `id`
   asc; keep the top `--max` unique ids; restrict pairs to those with both
   endpoints kept. (Document that this can split a cluster — acceptable for
   batch sizing. The pilot leaves `--max` unset.)

**Output artifact** (pretty JSON, deterministic):
```
{
  "generated": "<label>",
  "source_queue": "<queue path>",
  "clusters": [...],
  "unique_item_count": N,
  "candidate_pair_count": M,
  "reviewer_split": { "claude_pairs": ..., "gpt5_pairs": ... },
  "gpt5_carveout_ids": [ ...genuine-claude ids that force gpt-5... ],
  "items": [ { id, bank, path, producer, provenance_tier, harm_rank,
               pilot_clusters: [...], within_cluster_peers: [...] } ],
  "pairs": [ { a, b, clusters: [...], reviewer, a_producer, b_producer,
               a_bank, b_bank, a_path, b_path } ]
}
```
`items` sorted by `id`; `pairs` sorted by `(reviewer, clusters.join, a, b)`.
Print a one-line summary to stdout (`unique_item_count`,
`candidate_pair_count`, `reviewer_split`).

**`package.json`**: add `"audit:build-batch": "tsx scripts/audit/build-audit-batch.ts"`
(match the runner used by the existing `audit:early-bank-semantic` script).

**Test** (`scripts/tests/build-audit-batch.ts`): run the builder on the default
pilot clusters against the regenerated queue and pin the pilot self-check
(these are the verified expected values after Part A):
```
assert.equal(artifact.unique_item_count, 109);
assert.equal(artifact.candidate_pair_count, 156);
assert.equal(artifact.reviewer_split.claude_pairs, 149);
assert.equal(artifact.reviewer_split.gpt5_pairs, 7);
// the genuine-Claude carve-out is exactly the five claude_moc delegation items
assert.deepEqual(artifact.gpt5_carveout_ids.sort(), [
  "claude_moc_assignment_mc_14",
  "claude_moc_deleg_matrix_08",
  "claude_moc_deleg_uap_hl_01",
  "claude_moc_lpn_deleg_hl_b01",
  "claude_moc_supervision_hl_b04",
]);
// determinism: second run is byte-identical
```
If any pinned number comes back different, **stop and report** — it means Part A
or the queue changed the split, and I need to re-gate before the pilot draws.

## Run

```
npm run audit:early-bank-semantic     # regen queue/summary with corrected tags (Part A)
npm run test:early-bank-semantic      # Layer A invariants + opus assertions
npm run audit:build-batch             # emits audit/early-bank-semantic/coherence/2026-06-24.slice.json
npm run test:build-batch              # pilot self-check (109/156/149/7)
```

Report: the Part A `inventory_by_provenance` delta, confirmation the other
summary fields are unchanged, and the emitted slice artifact's
`unique_item_count` / `candidate_pair_count` / `reviewer_split` /
`gpt5_carveout_ids`. Do not commit; Claude gates the diff and the artifact
before the pilot runs.
