# U11 `io_trend` — §11 Proof Batch Brief V3 — PRODUCER COPY (GPT-5.6 Sol)

**Date:** 2026-07-13 (V3). **Item author:** GPT-5.6 Sol.
**This file contains no intended keys.** Everything you need for Pass 1 and Pass 2 is here. A separate architect-only file holds the intended clinical directions; you will not see it until after Pass 1 is recorded.

**Session hygiene — read this first.** This task must run in a chat with no other context: no repository browsing, no PR history, no prior conversation about this project. Everything you need is pasted below. If you have tool access that could fetch files (GitHub, web, file search), do not use it for this task — do not fetch `DECISIONS.md`, `PROJECT-HISTORY.md`, or any file with "KEY-REVEAL" or "ARCHITECT-ONLY" in its name. This document is fully self-contained.

**Governing documents (for the architect's own reference, not needed by you to complete this task):** `Archive/U11-IO-TREND-SPEC.md`, `DECISIONS.md` principles 6, 11, 12, 22, 25, `NCLEX-Question-Schema.md`. `io_trend` requires schema `1.9` minimum; author the raw envelope at `2.0`.
**Renderer status:** `io_trend` shipped and promoted to `main`. Zero `io_trend` items exist in any canonical bank as of this brief. This is content work; no code changes.

---

## 0. What this batch is for

This is **not** a content top-up. It is the executable proof that `io_trend` was necessary.

The kind exists on one claim: **an `io_trend` item is valid iff collapsing the series to a single net balance changes the answer.** That test applies **per item, individually** — each of the four frames below must, on its own, survive: does the correct choice change when the full interval-by-interval trend is replaced by only the final cumulative net number (stem, context, and options held constant)? An item whose `collapse_test` counterfactual is really just a restatement of the correct choice is not admissible, no matter how the batch as a whole looks.

Frames 2 and 4 are additionally built as a matched pair: identical context, identical options, identical time bins, identical total intake, identical final cumulative net — differing **only** in the interval-by-interval shape of output. The matched pair is **supporting evidence for the individual collapse tests, not a substitute for them.**

## 1. Two-pass protocol

**Pass 1 — blind derivation.** For each of the four datasets in §4, using only the dataset and its context line, state:
1. the single best answer to the question that dataset's frame will ultimately ask (see the framing note under each frame — you're deriving the answer to that kind of question, not authoring the item yet);
2. your confidence, and the single strongest competing answer;
3. the **counterfactual answer under collapse** — holding the stem, context, and options fixed, what would the answer be if the only information about intake/output were the single `final_cumulative_net_ml` number (no interval breakdown, no chart)?

Return Pass 1 as a plain table. Do not author items yet.

**Pass 2 — authoring.** After you submit Pass 1, the architect will share the intended directions and adjudicate any divergence with Luke. Only then do you author the four items in full, per §6.

## 2. Hard constraints

- **`itemType` ∈ `multiple_choice` | `select_all` | `matrix`.** `fill_in_blank` is excluded from the registry for this kind.
- **Pattern-only items.** Direction, divergence, crossover, response-to-intervention, or trend interpretation. **No exact-value items.** "What was the net balance at 1200?" is an `io_record` item.
- **The stem must not state the trend.** The stem supplies clinical context; the visual supplies the pattern.
- **Closed-world stems.** If an item's correct answer requires a stated threshold or protocol rule that isn't given to you in §4, do not invent one — flag it back rather than authoring a plausible-sounding rule from general knowledge. (This is why Frames 2–4 below are framed as *trend interpretation* rather than *management action*: interpreting what a chart shows doesn't need an external threshold the way "hold this dose" or "stop this bolus" would.)
- **No answer leakage in `caption`, `periodLabel`, or `binLabels`.**
- **No outcome or shape words in context lines beyond exactly what §4 gives you.** Do not add adjectives characterizing the trend ("improving," "accelerating," "failing to respond," etc.) anywhere in the stem you write.
- **Bilingual parity** (en + zh) on every learner-facing field.
- **Deterministic core, no invented clinical content.** Every volume below is fixed.

## 3. Required `meta` on every item

```jsonc
"meta": {
  "visual_justification": "REQUIRED. What the learner must read off the trend that the stem does not state.",
  "collapse_test": "REQUIRED. The counterfactual answer under collapse — what a learner would answer if shown ONLY the final cumulative net, stem/context/options otherwise unchanged. It MUST differ from the keyed answer.",
  "tier": "standard",
  "source": "<attributable source>",
  "skill_signature": "io_trend:<frame>/<what-is-tested>",
  "stem_disambiguators": ["intake and output", "trend"],
  "derived_values_keyed": { "net_by_interval_ml": [...], "cumulative_net_ml": [...], "final_cumulative_net_ml": N },
  "expected_trend": [ { "series": "output", "direction": "up", "window": [4, 16] } ],
  "crossover": { "series": "cumulative_net", "index": 2, "from": "positive", "to": "negative" }
}
```

## 4. The four datasets — fixed, do not modify

All four: `kind: "io_trend"`, `showCumulativeNet: true`, four intervals. Derived values are computed by the renderer, not spec fields — given here so you can populate `derived_values_keyed` exactly.

### Frame 1
`time: { unit: "hr", values: [4, 8, 12, 16] }`
| bin | intakeMl | outputMl | net | cumulative |
|---|---|---|---|---|
| 4 hr | 300 | 280 | +20 | +20 |
| 8 hr | 300 | 260 | +40 | +60 |
| 12 hr | 300 | 180 | +120 | +180 |
| 16 hr | 300 | 80 | +220 | +400 |

Totals: intake 1200, output 800, final cumulative **+400**.
Context (verbatim): "An adult client with heart failure and chronic kidney disease is receiving scheduled maintenance IV fluids."
**Framing:** an independent-nursing-action item — what should the nurse do in response to this trend, within scope that doesn't require a stated escalation threshold (i.e., an assessment-level action, not a provider-notification or order-change action).

### Frame 2 *(matched pair, half A)*
`time: { unit: "hr", values: [4, 8, 12, 16] }`
| bin | intakeMl | outputMl | net | cumulative |
|---|---|---|---|---|
| 4 hr | 300 | 500 | −200 | −200 |
| 8 hr | 250 | 400 | −150 | −350 |
| 12 hr | 200 | 250 | −50 | −400 |
| 16 hr | 200 | 100 | +100 | **−300** |

Totals: intake 950, output 1250, final cumulative **−300**.
Context (verbatim, identical to Frame 4): "An adult client is receiving scheduled IV furosemide doses for volume overload management."
**Framing:** a trend-interpretation item — which statement about the shape of this client's fluid balance over the period is best supported by the data (not a medication-management action; the data given cannot support a hold/continue decision without dose timing this brief deliberately does not supply).

### Frame 3
`time: { unit: "hr", values: [4, 8, 12, 16] }`
| bin | intakeMl | outputMl | net | cumulative |
|---|---|---|---|---|
| 4 hr | 400 | 150 | +250 | +250 |
| 8 hr | 600 | 140 | +460 | +710 |
| 12 hr | 700 | 130 | +570 | +1280 |
| 16 hr | 700 | 120 | +580 | **+1860** |

Totals: intake 2400, output 540, final cumulative **+1860**.
Context (verbatim): "An adult with hypotension and rising creatinine is receiving a fluid challenge per protocol, with urine output reassessed at each interval."
**Framing:** a trend-interpretation item — which statement about the relationship between the escalating intake and the output series is best supported by the data (not a management action; the stem deliberately supplies no hemodynamic reassessment data, so no action requiring that data is answerable here).

### Frame 4 *(matched pair, half B)*
`time: { unit: "hr", values: [4, 8, 12, 16] }`
| bin | intakeMl | outputMl | net | cumulative |
|---|---|---|---|---|
| 4 hr | 300 | 150 | +150 | +150 |
| 8 hr | 250 | 220 | +30 | +180 |
| 12 hr | 200 | 400 | −200 | −20 |
| 16 hr | 200 | 480 | −280 | **−300** |

Totals: intake 950, output 1250, final cumulative **−300**.
Crossover: `cumulative_net`, index 2, positive → negative.
Context (verbatim, identical to Frame 2): "An adult client is receiving scheduled IV furosemide doses for volume overload management."
**Framing:** same as Frame 2 — trend interpretation, not medication management.

**Frames 2 and 4 share identical context, intake schedule, and final net.** The only difference anywhere in the data is the shape of the output series. If your Pass 1 derivation reaches for anything other than that shape to distinguish them, say so explicitly.

## 5. Intended keys

Not in this file. Revealed after you submit Pass 1.

## 6. Item construction (for Pass 2, after keys are revealed)

- **Frames 2 and 4 must be `multiple_choice` with an identical option set — verbatim, in both languages — differing only in which option is correct.**
- Frame 1: `select_all`, independent-assessment-scope action item. Frame 3: `matrix`, trend-interpretation.
- Distractors clinically plausible, within scope, no straw men.
- `id` prefix **`iot_*`**.
- `visual_justification` and `collapse_test` on all four. `derived_values_keyed` on all four. `crossover` on Frame 4. `expected_trend` on all four.
- **Declare `meta.schemaVersion: "2.0"`** on the raw draft envelope.

## 7. Review routing — producer ≠ checker

- **GPT-5.6 Sol authors; it cannot check this batch.**
- **Claude gates mechanics**: schema `2.0` conformance, `selfCheck` green, fences honored, bilingual parity, identical-option-set requirement, and — new this pass — that no stem, option, or rationale asserts a management action the given data doesn't support (the closed-world check extends to the authored item, not just the brief).
- **Claude does NOT certify the clinical keys.** That's Luke's, with Pass 1 as the independent signal.
- **Gemini is not routed here.**

## 8. Promotion path

- Draft to `banks/banks-raw/` as `visual-iotrend-2026-07-XX.json`. Routes via `visual-` prefix to `banks/visual-canonical.json`. Do not create a per-kind canonical.
- `visual-canonical.json` currently declares `1.7`; merging bumps it to `2.0`.
- Flow: generate → raw → cross-model review (never the producing model) → source-check → visual audit → human review → promote → audit → merge → ledger → delete raw.
- Codex does not merge or push `main`.

## 9. Acceptance

```sh
npm run validate-bank -- banks/*.json
npm run audit
npm run census && npm run census:check
npm run build
```

All green, `selfCheck` clean, and — the primary bar — every item individually survives its own `collapse_test` under human review. The matched pair keying opposite answers off an identical final net is strong supporting evidence when it holds, not a substitute for each item's own test.
