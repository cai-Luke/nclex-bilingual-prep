# Chat Handoff — Residual Re-Run Adjudication

## Baseline

- Repo: `https://github.com/cai-Luke/nclex-bilingual-prep.git`
- Working baseline commit before this handoff: `ac940fe Prepare post-S01 residual rerun baseline`
- Handoff prep commit: `c13f7aa Prepare residual rerun chat handoff`
- Current task: finish the consolidated residual topic rerun from `residual-rerun-codex-spec.md`.
- Runtime/product constraints unchanged: static/offline app; no canonical bank writes without Luke approving an exact dry-run.

## What Is Ready

- Harness: `scripts/residual-rerun.ts`
- Focused test: `npm run test:residual-rerun`
- Model-facing input: `audit/residual-rerun-2026-06-18.input.json`
- Decisions: `audit/residual-rerun-2026-06-18.decisions.json`
- Dry-run manifest: `audit/residual-rerun-2026-06-18.manifest.json`
- Dry-run report: `audit/residual-rerun-2026-06-18.dry-run.md`
- Input row count: 237
- Input intentionally withholds `oldTopic` and prior proposals.
- Candidate sets are recomputed live from current `src/topics.ts`.

Scope counts in the emitted input:

- original unresolved source rows: 75
- original blocked source rows: 41
- reclaim unresolved source rows: 23
- reclaim blocked source rows: 4
- reclaim proposed source rows: 109
- excluded settled rows: 15
- unique run rows: 237

## Settled Decisions

- In-harness GPT-5 adjudication is approved for this proposal-only pass.
- Classifier must remain non-Gemini.
- Vocabulary gaps are flags only; do not edit `topics.ts` from the tool.
- `category_and_topic` proposals are allowed broadly in the dry-run, but category changes get their own review block.
- Parents remain out of scope until child rows settle.
- Wound rule: recategorize a wound row to BCC only if BCC is genuinely correct. If rows are moved to BCC solely to reach `Skin & Wound Care`, use that count as the signal to consider sharing `Skin & Wound Care` across BCC + RRP + Safety.

## Dry-Run Result

The approved in-harness GPT-5 adjudication has been run. The deterministic dry-run produced:

- proposed rows: 170
- carried-forward rows: 65
- vocabulary-gap flags: 0
- unresolved rows: 1
- `topic_only` decisions: 170
- `category_and_topic` decisions: 66
- `vocabulary_gap` decisions: 0
- `abstain` decisions: 1

After review, Luke approved sharing `Skin & Wound Care` across BCC/RRP/Safety and adding shared `Transfusion & Blood Products` across Safety/Pharm/RRP/PhysAdapt. The wound vocabulary-gap rows now resolve to `Skin & Wound Care`, transfusion/blood-product rows resolve to the new topic, the two acute preeclampsia pharmacology rows no longer move to HPM, the RN-scope postpartum row stays in Management of Care, the enteral-pump duration row resolves to Pharm / Dosage Calculations, and `q9_2` resolves to Pharm / Medication Safety & Admin.

Unresolved rows:

- `gpt_case_premium_next_case_occupational_exposure_vaccine_04_fib_supplies`

## Next Action

Review and approve/reject the exact dry-run report:

```sh
audit/residual-rerun-2026-06-18.dry-run.md
```

Pay special attention to:

- the 66 `category_and_topic` rows
- the new `Skin & Wound Care` and `Transfusion & Blood Products` topic vocabulary/licensing
- the 1 deliberately unresolved row
- the exact diff preview

Do not run any writer and do not edit canonical banks unless Luke approves this exact dry-run.

## Reproduction Commands

The input was already classified into:

```sh
audit/residual-rerun-2026-06-18.decisions.json
```

To reproduce the dry-run artifacts:

```sh
npx tsx scripts/residual-rerun.ts dry-run \
  --decisions audit/residual-rerun-2026-06-18.decisions.json \
  --date 2026-06-18
```

Expected outputs:

```sh
audit/residual-rerun-2026-06-18.manifest.json
audit/residual-rerun-2026-06-18.dry-run.md
```

Decision artifact shape:

```json
{
  "meta": {
    "provider": "openai",
    "model": "gpt-5",
    "temperature": 0,
    "promptHash": "<sha256 of the adjudication prompt/instructions>"
  },
  "records": [
    {
      "id": "row id",
      "decisionType": "topic_only | category_and_topic | vocabulary_gap | abstain",
      "proposedCategory": "only for category_and_topic, or current category for topic_only if desired",
      "proposedTopic": "canonical topic for topic_only/category_and_topic",
      "reason": "one concise sentence",
      "vocabularyChange": "only for vocabulary_gap"
    }
  ]
}
```

## Verification Already Run

Before the baseline commit:

```sh
npm run validate-bank -- banks/*.json
npm run test:residual-rerun
npx tsc -b --pretty false
npm run build
```

After adding `emit-input`:

```sh
npx tsc -b --pretty false
npm run test:residual-rerun
npx tsx scripts/residual-rerun.ts emit-input --date 2026-06-18
```

After generating the dry-run:

```sh
npm run test:residual-rerun
npx tsc -b --pretty false
```

## Review Focus After Dry Run

- `category_and_topic` rows: blueprint/category weight changes.
- Wound-licensing watch count.
- `vocabulary_gap` rows: Luke decision only, no automatic writes.
- Overmatch guard: unresolved must not be zero.
- Exact diff preview: only `category` and/or `topic` fields may change.
