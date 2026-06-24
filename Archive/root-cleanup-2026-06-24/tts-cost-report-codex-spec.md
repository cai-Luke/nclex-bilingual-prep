# TTS Cost-by-Tier Report — Codex Spec

Deterministic, no-API. Reads `audio/manifest.queue.json` and projects generation cost per content tier, cumulative in priority order, so the scope/budget lane can be chosen by eye against a budget line. Companion to the queue builder; answers the "what does $30 actually buy" question behind DECISIONS principle 20's drip-feed path. This report only *informs* the lane choice — it generates nothing.

## Placement / invocation

- Script: `scripts/audio/tts-cost-report.ts`; npm alias `"tts-cost"` (same runner as the other `scripts/*.ts`).
- Input: `audio/manifest.queue.json`. If absent, fail loud: "run `npm run tts-queue` first."
- Optional flags:
  - `--budget <usd>` (default `30`) — mark the priority-order row where cumulative cost first crosses it.
  - `--rate <std31|batch31|std25|batch25>` (default `std31`) — pricing lane for the main table.

## Shared constants (no drift)

- Extract `CHARS_PER_SECOND_EN` / `CHARS_PER_SECOND_ZH` out of `build-tts-queue.ts` into a shared `src/audio/ttsEstimation.ts`; import them in both the queue builder and this report. Single definition (principle 11 doctrine). The report's per-tier seconds MUST use the same constants the manifest projection used, or the reconciliation check below can't hold.
- Pricing constants declared in `ttsEstimation.ts`, commented "verified 2026-06, projection-only":
  - audio token rate = **25 tokens / second** of audio.
  - `$/1M output audio tokens`: `std31` = 20, `batch31` = 10 (Batch API, 50% off), `std25` = 10 (Gemini 2.5 Flash TTS), `batch25` = 5.
  - input text ≈ $1/1M — a rounding error; compute it (Σ clip.chars / 4 × $1/1M) and show it as one separate line, never folded into the headline tier costs.

## Tier model

`tierOf(fieldPath): Tier`. Default tiers in default priority order (value-descending — **this ordering is the one knob to turn when picking a lane**):

1. `terms` — `term.*`
2. `correct_rationale` — `rat.correct`
3. `stems` — `stem`, `cloze.stem`
4. `answer_content` — `opt.*`, `blank.*`, `matrix.*`, `dd.*`, `hl.*`, `bowtie.*`
5. `strategy` — `strategy`
6. `byChoice_rationales` — `rat.byChoice.*`
7. `case_prose` — `case.*`

Declare `TIER_PRIORITY: Tier[]` once. Any `fieldPath` that maps to no tier → **throw** (keeps the map total as new field kinds appear, same fail-loud discipline as the queue builder).

## Attribution (cost basis = deduped clips, each counted once)

Cost is *generation* cost, so attribute distinct **clips**, not key occurrences:

- For each distinct clip (`contentHash`), collect the tiers of every key referencing it and assign the clip to the **highest-priority** tier among them. Generating that tier pays for the clip; lower-priority tiers that reuse the same string get it free — which is exactly how a priority-ordered run behaves, so cumulative cost comes out accurate rather than double-counted.
- Per tier: `clips`, `seconds` (Σ clip.chars / CHARS_PER_SECOND[clip.lang]), `cost` (seconds × 25 × rate / 1e6).
- Also report `keyOccurrences` and `sharedSavings` (= keysTotal − distinctClips) once, for transparency on how much dedup is doing.

## Output

Console table, rows in `TIER_PRIORITY` order, with a cumulative column and the budget marker:

```
tier                  clips    minutes    cost(std31)    cumulative
terms                  ...      ...        $...           $...
correct_rationale      ...      ...        $...           $...
stems                  ...      ...        $...           $...
                                                          ── $30 budget falls here ──
...
case_prose             ...      ...        $...           $...  (cumulative = full run)
```

Below the table, one line per rate lane showing full-run cost: `std31 $… · batch31 $… · std25 $… · batch25 $…`, so the lever effect is visible at a glance. Mark the row where cumulative first exceeds `--budget`. Writing `audio/cost-report.json` with the structured rows is optional; the console table is the deliverable.

## Acceptance criteria

- No network / key / model usage.
- Σ `tier.seconds` == manifest `summary.estSecondsTotal` (highest-priority attribution partitions all distinct clips exactly once — built-in reconciliation; fail loud on mismatch).
- Σ `tier.clips` == `summary.distinctClips`.
- Cumulative is monotonic; final cumulative == full-run cost at the chosen rate.
- Every `fieldPath` in the live manifest maps to a tier (no throw).
- `npm run tts-cost` exits 0 and prints the table.

## Out of scope

- Any generation, transcode, or write under `audio/*.opus`.
- The generation pass's actual budget-cap / priority enforcement — separate spec. This report shares the `TIER_PRIORITY` constant that pass will later import, so the order you settle on here is the order generation will honor.
