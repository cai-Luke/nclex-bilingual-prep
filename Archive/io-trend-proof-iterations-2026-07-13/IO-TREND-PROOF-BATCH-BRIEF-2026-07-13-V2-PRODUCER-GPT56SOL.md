# U11 `io_trend` — §11 Proof Batch Brief V2 — PRODUCER COPY (GPT-5.6 Sol)

> **Status: SUPERSEDED 2026-07-13, same day, before any use.** A second GPT review caught: (1) every frame heading leaked its shape/verdict in words ("accelerating," "tapering," "non-responsive") even though the numbers themselves were clean; (2) Frame 3 carried an explicit Pass-1 note pointing straight at the withheld distinction; (3) the Frame 2/4 matched-pair action key ("hold the dose and notify") isn't supported by the given data — IV furosemide's ~2-hour duration of action means unspecified dose timing across 4-hour bins can't license a hold/continue decision without a stated closed-world threshold, which this file never supplied despite requiring one in its own §2; (4) Frame 3's "hold boluses, notify" key has the same problem — output shape alone doesn't establish a failed challenge without hemodynamic reassessment data (BP, perfusion) that isn't in the stem, per standard fluid-resuscitation reassessment practice; Frame 1's "notify" was also stronger than the evidence supports. Superseded by `IO-TREND-PROOF-BATCH-BRIEF-2026-07-13-V3-PRODUCER-GPT56SOL.md` and `IO-TREND-PROOF-BATCH-KEY-REVEAL-2026-07-13-V3-ARCHITECT-ONLY.md`. Do not run this file.

**Date:** 2026-07-13 (V2, supersedes the same-day REISSUE). **Item author:** GPT-5.6 Sol.
**This file contains no intended keys.** It is the entire producer-facing brief — everything you need for both Pass 1 and Pass 2. A separate architect-only file holds the intended clinical directions; you will never see it, and the architect reveals only what Pass 2 needs after Pass 1 is recorded.
**Governing documents:** `Archive/U11-IO-TREND-SPEC.md` (§1.1 collapse gate, §11 proof batch), `DECISIONS.md` principles 6, 11, 12, 22, 25, `NCLEX-Question-Schema.md` (`io_trend` requires schema `1.9` minimum; author the raw envelope at `2.0`, the document's declared current version).
**Renderer status:** `io_trend` shipped and promoted to `main` (`eec6b7a`). Zero `io_trend` items exist in any canonical bank as of this brief. This is content work; no code changes.

---

## 0. What this batch is for

This is **not** a content top-up. It is the executable proof that `io_trend` was necessary.

The kind exists on one claim (`DECISIONS.md` principle 25 fence 1):

> An `io_trend` item is valid iff collapsing the series to a single net balance changes the answer.

That test applies **per item, individually** — each of the four frames below must, on its own, survive: does the keyed answer change when the full interval-by-interval trend is replaced by only the final cumulative net number (stem, context, and options held constant)? An item whose `collapse_test` counterfactual is really just a restatement of the keyed answer is not admissible, no matter how the batch as a whole looks.

Frames 2 and 4 are additionally built as a matched pair: identical context, identical options, identical time bins, identical total intake, identical final cumulative net (−300 mL) — differing **only** in the interval-by-interval shape of output. If the trend genuinely matters, the shape alone should be able to point to different correct actions even with everything else held fixed. The matched pair is **supporting evidence for the individual collapse tests, not a substitute for them** — an instructive illustration, not the sole acceptance bar. If Frames 2 and 4 converge on the same keyed action despite the shape difference, that is a real, informative failure signal, not something to author around.

## 1. Two-pass protocol

**Pass 1 — blind derivation.** For each of the four datasets in §4, using only the dataset and its context line, state:
1. the correct nursing action, in one sentence;
2. your confidence, and the single strongest competing action;
3. the **counterfactual answer under collapse** — holding the stem, context, and options fixed, what would the correct action be if the only information about intake/output were the single `final_cumulative_net_ml` number (no interval breakdown, no chart)?

Return Pass 1 as a plain table. Do not author items yet.

**Pass 2 — authoring.** After you submit Pass 1, the architect will share the intended clinical directions and adjudicate any divergence with Luke. Only then do you author the four items in full, per §6.

## 2. Hard constraints (the registry enforces most of these)

- **`itemType` ∈ `multiple_choice` | `select_all` | `matrix`.** `fill_in_blank` is *excluded from the registry* for this kind. Do not attempt a numeric `matrix` as a workaround — that is the fence, not an oversight.
- **Pattern-only items.** Direction, divergence, crossover, response-to-intervention. **No exact-value items.** "What was the net balance at 1200?" is an `io_record` item; authoring it here would prove `io_trend` redundant.
- **The stem must not state the trend.** "Urine output has been declining" hands over the visual's job and makes the chart decorative. The stem supplies clinical context; the visual supplies the pattern.
- **Closed-world stems.** If the answer turns on a threshold — a urine-output target, a hold parameter, a call-provider criterion — state the governing order or unit protocol *inside the stem*. Never rely on an external guideline the learner is assumed to know.
- **No answer leakage in `caption`, `periodLabel`, or `binLabels`.** Do not caption a chart "Fluid volume overload" or label a bin "diuresis begins."
- **No outcome words in the context line beyond what §4 gives you.** The datasets below are deliberately written without adjectives like "stable," "improving," "poorly tolerated," or "ongoing" — do not add clinical color when you expand the context into a full stem. Anything that narrates the trajectory in words defeats the point of a chart that's supposed to show it.
- **Bilingual parity** (en + zh) on `stem`, `options`, `rationale.correct`, every `rationale.byChoice`, `testTakingStrategy`, `caption`, `periodLabel`, and every `binLabels[i]`. Simplified Chinese, meaning-faithful.
- **Deterministic core, no invented clinical content.** Every volume below is fixed. Do not adjust a single number to make an item easier to write.

## 3. Required `meta` on every item

```jsonc
"meta": {
  "visual_justification": "REQUIRED. What the learner must read off the trend that the stem does not state.",
  "collapse_test": "REQUIRED. The counterfactual answer under collapse — i.e. what a learner keys when shown ONLY the final cumulative net, with stem/context/options otherwise unchanged. It MUST differ from the keyed answer, and it must be written as an answer, not as a restatement of the justification.",
  "tier": "standard",
  "source": "<attributable source>",
  "skill_signature": "io_trend:<frame>/<what-is-tested>",
  "stem_disambiguators": ["intake and output", "trend"],

  // Optional but strongly encouraged — selfCheck recomputes and asserts exact equality.
  "derived_values_keyed": { "net_by_interval_ml": [...], "cumulative_net_ml": [...], "final_cumulative_net_ml": N },
  "expected_trend": [ { "series": "output", "direction": "up", "window": [4, 16] } ],
  "crossover": { "series": "cumulative_net", "index": 2, "from": "positive", "to": "negative" }
}
```

`series` ∈ `intake` | `output` | `net` | `cumulative_net`. `window` endpoints must be values that appear in `time.values`. Zero is neither positive nor negative and **fails** a crossover assertion.

`selfCheck` machine-checks the arithmetic, the trend directions, and the crossover. It **cannot** check whether `collapse_test` is honest — that is human review's job (§7). Neither can it check whether the context line accidentally leaks the answer — read your own context sentence back with fresh eyes before finalizing each item, specifically asking "would this sentence alone, without any I/O numbers, already tell a test-taker the right action?" If yes, strip it back to the bare fact pattern in §4 and let the visual do the work.

## 4. The four datasets — fixed, do not modify

All four: `kind: "io_trend"`, `showCumulativeNet: true`, four intervals. Derived values are computed by the renderer and must not be added as spec fields — they're given here so you can populate `derived_values_keyed` exactly.

### Frame 1 — HF/CKD, accelerating retention
`time: { unit: "hr", values: [4, 8, 12, 16] }`
| bin | intakeMl | outputMl | net | cumulative |
|---|---|---|---|---|
| 4 hr | 300 | 280 | +20 | +20 |
| 8 hr | 300 | 260 | +40 | +60 |
| 12 hr | 300 | 180 | +120 | +180 |
| 16 hr | 300 | 80 | +220 | +400 |

Totals: intake 1200, output 800, final cumulative **+400**.
Context (use verbatim, do not embellish): "An adult client with heart failure and chronic kidney disease is receiving scheduled maintenance IV fluids."

### Frame 2 — furosemide dosing, tapering output *(matched pair, half A)*
`time: { unit: "hr", values: [4, 8, 12, 16] }`
| bin | intakeMl | outputMl | net | cumulative |
|---|---|---|---|---|
| 4 hr | 300 | 500 | −200 | −200 |
| 8 hr | 250 | 400 | −150 | −350 |
| 12 hr | 200 | 250 | −50 | −400 |
| 16 hr | 200 | 100 | +100 | **−300** |

Totals: intake 950, output 1250, final cumulative **−300**.
Context (use verbatim, identical to Frame 4 below except the drug/order framing is the same class): "An adult client is receiving scheduled IV furosemide doses for volume overload management."

### Frame 3 — hypotension, non-responsive fluid challenge
`time: { unit: "hr", values: [4, 8, 12, 16] }`
| bin | intakeMl | outputMl | net | cumulative |
|---|---|---|---|---|
| 4 hr | 400 | 150 | +250 | +250 |
| 8 hr | 600 | 140 | +460 | +710 |
| 12 hr | 700 | 130 | +570 | +1280 |
| 16 hr | 700 | 120 | +580 | **+1860** |

Totals: intake 2400, output 540, final cumulative **+1860**.
Context (use verbatim): "An adult with hypotension and rising creatinine is receiving a fluid challenge per protocol, with urine output reassessed at each interval."

> Note for your own Pass-1 reasoning: a large positive net during a directed fluid challenge is not itself unusual — early oliguria during volume resuscitation is expected. What the interval breakdown shows that the final number cannot is *whether output is rising at all* as the challenge escalates. Consider that carefully when you derive the collapse counterfactual.

### Frame 4 — furosemide dosing, accelerating output *(matched pair, half B)*
`time: { unit: "hr", values: [4, 8, 12, 16] }`
| bin | intakeMl | outputMl | net | cumulative |
|---|---|---|---|---|
| 4 hr | 300 | 150 | +150 | +150 |
| 8 hr | 250 | 220 | +30 | +180 |
| 12 hr | 200 | 400 | −200 | −20 |
| 16 hr | 200 | 480 | −280 | **−300** |

Totals: intake 950, output 1250, final cumulative **−300**.
Crossover: `cumulative_net`, index 2, positive → negative.
Context (use verbatim, identical to Frame 2 above): "An adult client is receiving scheduled IV furosemide doses for volume overload management."

**Frames 2 and 4 share identical context, identical intake schedule, and identical final net.** The only difference between them anywhere in the data is the shape of the output series — front-loaded-and-tapering (Frame 2) versus back-loaded-and-accelerating (Frame 4). If your Pass 1 derivation reaches for anything other than the shape of the output trend to tell these two apart, say so explicitly — that is exactly the failure mode this batch is designed to catch.

## 5. Intended keys

Not in this file. See §1 — they're revealed after you submit Pass 1.

## 6. Item construction (for Pass 2, after keys are revealed)

- **Frames 2 and 4 must be `multiple_choice` with an identical option set — verbatim, in both languages — differing only in which option is keyed correct.** Any difference in wording between the two option sets weakens the proof and will be sent back.
- Frame 1: `select_all`. Frame 3: `matrix`. (Format spread; both remain pattern-only.)
- Distractors must be clinically plausible actions within nursing scope. No "call a code," no straw men.
- `id` prefix **`iot_*`**, disjoint from `io_*` (that is U5's `io_record`).
- `visual_justification` and `collapse_test` on all four. `derived_values_keyed` on all four (the arithmetic gate is free — use it). `crossover` on Frame 4. `expected_trend` on all four.
- **Declare `meta.schemaVersion: "2.0"` on the raw draft envelope**, not `"1.9"` — `1.9` is `io_trend`'s minimum floor, not the authoring target.

## 7. Review routing — producer ≠ checker

- **GPT-5.6 Sol authors.** It therefore **cannot check** this batch.
- **Claude gates mechanics**: schema `2.0` conformance, `selfCheck` green, fences honored (no `fill_in_blank`, no exact-value items, no stem/context leakage), bilingual parity, the identical-option-set requirement on the matched pair.
- **Claude does NOT certify the clinical keys**, having chosen the frames and directions. That check is **Luke's**, with the Pass 1 blind derivation as the independent signal.
- **Gemini is not routed here.** Flag-only, never a content-judgment audit lane.

Human review concentrates on the three things no gate can see:
1. Does each item survive its own collapse test — is `collapse_test`'s counterfactual genuinely a *different* answer, or a restatement?
2. Is the trend clinically real — plausible charted volumes for the stated frame, and is the keyed interpretation right?
3. Does the stem or context leak the pattern?

## 8. Promotion path

- Draft to `banks/banks-raw/` as **`visual-iotrend-2026-07-XX.json`**. The `visual-` prefix routes it to `banks/visual-canonical.json`, the live visual bank. **Do not create an `iotrend-canonical.json`.**
- `visual-canonical.json` currently declares `1.7`; merging these items bumps it straight to `2.0`. Expect it; it is not a workaround.
- Flow: generate → `banks/banks-raw/` → cross-model review (**never the producing model**) → source-check → visual audit → human content review → `npm run promote` → `npm run audit` → merge into `visual-canonical.json` → ledger entry → delete raw.
- Codex does not merge or push `main`. The architect gate is explicit.

## 9. Acceptance

```sh
npm run validate-bank -- banks/*.json
npm run audit
npm run census && npm run census:check
npm run build
```

All green, `selfCheck` clean on all four items, and — **the primary bar** — every item individually survives its own `collapse_test` under human review. The Frame 2/4 matched pair keying opposite answers off an identical final cumulative net is strong supporting evidence when it holds, but a batch does not pass on the matched pair alone if any individual frame's collapse test reads as a restatement.
