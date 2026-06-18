# Chat Handoff — Residual Re-Run Adjudication

## Baseline

- Repo: `https://github.com/cai-Luke/nclex-bilingual-prep.git`
- Working baseline commit before this handoff: `479902f Prepare post-S01 residual rerun baseline`
- Current task: finish the consolidated residual topic rerun from `residual-rerun-codex-spec.md`.
- Runtime/product constraints unchanged: static/offline app; no canonical bank writes without Luke approving an exact dry-run.

## What Is Ready

- Harness: `scripts/residual-rerun.ts`
- Focused test: `npm run test:residual-rerun`
- Model-facing input: `audit/residual-rerun-2026-06-18.input.json`
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

## Next Action

Classify every record in:

```sh
audit/residual-rerun-2026-06-18.input.json
```

Write decisions to:

```sh
audit/residual-rerun-2026-06-18.decisions.json
```

Expected decisions artifact shape:

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

Then run:

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

Do not run any writer and do not edit canonical banks for this handoff.

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

## Review Focus After Dry Run

- `category_and_topic` rows: blueprint/category weight changes.
- Wound-licensing watch count.
- `vocabulary_gap` rows: Luke decision only, no automatic writes.
- Overmatch guard: unresolved must not be zero.
- Exact diff preview: only `category` and/or `topic` fields may change.
