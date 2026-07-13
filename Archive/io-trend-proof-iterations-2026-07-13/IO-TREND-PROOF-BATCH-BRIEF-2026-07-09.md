# U11 `io_trend` — §11 Proof Batch Brief (GPT authoring lane)

**Date:** 2026-07-09
**Architect / constraint author:** Claude. **Item author:** GPT (chat lane). **Checker:** see §7 — *not GPT, and not Claude alone*.
**Renderer status:** `io_trend` shipped and promoted to `main` (`eec6b7a`), schema `1.9`. This is content work; no code changes.
**Governing documents:** `Archive/U11-IO-TREND-SPEC.md` (§1.1 collapse gate, §11 proof batch), `DECISIONS.md` principles 6, 11, 12, 22, 25, `NCLEX-Question-Schema.md` (schema `1.9`).

---

## 0. What this batch is for

This is **not** a content top-up. It is the executable proof that `io_trend` was necessary.

The kind exists on one claim (spec §1.1, `DECISIONS.md` principle 25 fence 1):

> An `io_trend` item is valid iff collapsing the series to a single net balance changes the answer.

Frames 2 and 4 are built to share an **identical final cumulative net of −300 mL** while keying **opposite nursing actions**. If a single net balance could resolve an `io_trend` item, those two items would key the same answer. If they end up keying the same answer, **the kind is not necessary and the batch has failed** — which is a valid, informative outcome, not a defect to be authored around.

Nothing below is worth doing if that pair is fudged into agreement.

---

## 1. Two-pass protocol — the key is blinded in Pass 1

Claude chose the clinical frames and the intended keyed directions. Claude therefore **cannot be the independent check** on whether those directions are right. So the key is withheld.

**Pass 1 — blind derivation. Do this before reading §5.**
For each of the four datasets in §4, and using only the dataset plus the clinical context line, GPT states:
1. the correct nursing action, in one sentence;
2. its confidence, and the single strongest competing action;
3. the **counterfactual answer under collapse** — what a learner would answer if shown *only* the final cumulative net (`final_cumulative_net_ml`), and nothing else.

Return Pass 1 as a plain table. Do not author items yet. Do not read §5 until Pass 1 is submitted.

**Pass 2 — authoring.** Claude reveals its intended keys, adjudicates any divergence with Luke, and only then does GPT author the four items in full.

The point of Pass 1 is frames 2 and 4. Both end at −300 mL. If GPT independently keys them the same, say so plainly — that result kills or reshapes the kind, and burying it would be the single worst outcome available here.

---

## 2. Hard constraints (the registry enforces most of these)

- **`itemType` ∈ `multiple_choice` | `select_all` | `matrix`.** `fill_in_blank` is *excluded from the registry* for this kind. Do not attempt a numeric `matrix` as a workaround — that is the fence, not an oversight.
- **Pattern-only items.** Direction, divergence, crossover, response-to-intervention. **No exact-value items.** "What was the net balance at 1200?" is an `io_record` item; authoring it here would prove `io_trend` redundant.
- **The stem must not state the trend.** "Urine output has been declining" hands over the visual's job and makes the chart decorative (principle 6). The stem supplies clinical context; the visual supplies the pattern.
- **Closed-world stems (principle 12).** If the answer turns on a threshold — a urine-output target, a hold parameter, a call-provider criterion — state the governing order or unit protocol *inside the stem*. Never rely on an external guideline the learner is assumed to know.
- **No answer leakage in `caption`, `periodLabel`, or `binLabels`.** Do not caption a chart "Fluid volume overload" or label a bin "diuresis begins."
- **Bilingual parity** (en + zh) on `stem`, `options`, `rationale.correct`, every `rationale.byChoice`, `testTakingStrategy`, `caption`, `periodLabel`, and every `binLabels[i]`. Simplified Chinese. Clinical meaning must match, not merely gloss.
- **Deterministic core, no invented clinical content.** Every volume below is fixed. Do not adjust a single number to make an item easier to write.

---

## 3. Required `meta` on every item

```jsonc
"meta": {
  "visual_justification": "REQUIRED. What the learner must read off the trend that the stem does not state.",
  "collapse_test": "REQUIRED. The counterfactual answer under collapse — i.e. what a learner keys when shown ONLY the final cumulative net. It MUST differ from the keyed answer, and it must be written as an answer, not as a restatement of the justification.",
  "tier": "standard",
  "source": "<attributable source>",
  "skill_signature": "io_trend:<frame>/<what-is-tested>",
  "stem_disambiguators": ["intake and output", "trend"],

  // Optional but strongly encouraged — selfCheck recomputes and asserts exact equality.
  // Any key present is gated. A mismatch is a build failure, not a content note.
  "derived_values_keyed": { "net_by_interval_ml": [...], "cumulative_net_ml": [...], "final_cumulative_net_ml": N },
  "expected_trend": [ { "series": "output", "direction": "up", "window": [4, 16] } ],
  "crossover": { "series": "cumulative_net", "index": 2, "from": "positive", "to": "negative" }
}
```

`series` ∈ `intake` | `output` | `net` | `cumulative_net`. `window` endpoints must be values that appear in `time.values`. Zero is neither positive nor negative and **fails** a crossover assertion.

`selfCheck` machine-checks the arithmetic, the trend directions, and the crossover. It **cannot** check whether `collapse_test` is honest. That is the human review's job (§7).

---

## 4. The four datasets — fixed, do not modify

All four: `kind: "io_trend"`, `showCumulativeNet: true`, four intervals. Derived values shown so you can populate `derived_values_keyed` exactly; **they are computed by the renderer and must not be added as spec fields.**

### Frame 1 — heart failure / CKD
`time: { unit: "hr", values: [4, 8, 12, 16] }`
| bin | intakeMl | outputMl | net | cumulative |
|---|---|---|---|---|
| 4 hr | 500 | 450 | +50 | +50 |
| 8 hr | 500 | 380 | +120 | +170 |
| 12 hr | 500 | 300 | +200 | +370 |
| 16 hr | 500 | 220 | +280 | +650 |

Totals: intake 2000, output 1350, final cumulative **+650**.
Context: adult admitted with decompensated heart failure and stage 3 CKD; maintenance IV fluids running per order.

### Frame 2 — post-loop-diuretic diuresis *(matched pair, half A)*
`time: { unit: "hr", values: [4, 8, 12, 16] }`
| bin | intakeMl | outputMl | net | cumulative |
|---|---|---|---|---|
| 4 hr | 300 | 150 | +150 | +150 |
| 8 hr | 250 | 220 | +30 | +180 |
| 12 hr | 200 | 400 | −200 | −20 |
| 16 hr | 200 | 480 | −280 | **−300** |

Totals: intake 950, output 1250, final cumulative **−300**.
Crossover: `cumulative_net`, index 2, positive → negative.
Context: adult treated with IV furosemide for acute pulmonary edema; vital signs stable, respiratory effort improving.

### Frame 3 — prerenal AKI fluid challenge
`time: { unit: "hr", values: [4, 8, 12, 16] }`
| bin | intakeMl | outputMl | net | cumulative |
|---|---|---|---|---|
| 4 hr | 300 | 200 | +100 | +100 |
| 8 hr | 700 | 180 | +520 | +620 |
| 12 hr | 900 | 120 | +780 | +1400 |
| 16 hr | 900 | 100 | +800 | **+2200** |

Totals: intake 2800, output 600, final cumulative **+2200**.
Context: adult with hypotension and rising creatinine; provider has ordered escalating isotonic fluid boluses as a fluid challenge.

> **Frame 3 is the weakest collapse case and needs the most care.** Its +2200 net is dramatic enough that a learner shown only that number may still reach an escalation answer, just by a different route ("overload → stop fluids / diurese"). The item is admissible *only if* the collapse answer and the keyed answer genuinely diverge. If your `collapse_test` for this frame reads as a paraphrase of the keyed answer, say so and flag the frame rather than forcing it.

### Frame 4 — bowel prep / gastroenteritis *(matched pair, half B)*
`time: { unit: "hr", values: [8, 16, 24, 32] }`
| bin | intakeMl | outputMl | net | cumulative |
|---|---|---|---|---|
| 8 hr | 250 | 300 | −50 | −50 |
| 16 hr | 200 | 280 | −80 | −130 |
| 24 hr | 150 | 250 | −100 | −230 |
| 32 hr | 150 | 220 | −70 | **−300** |

Totals: intake 750, output 1050, final cumulative **−300**.
Context: adult with ongoing gastrointestinal losses; oral intake tolerated poorly, no IV fluids ordered.

---

## 5. Intended keys — **do not read until Pass 1 is submitted**

<details>
<summary>Claude's intended keyed directions (blinded)</summary>

- **Frame 1:** rising positive balance *with falling urine output* → fluid overload risk; act (assess for overload, notify).
- **Frame 2:** expected therapeutic response to the loop diuretic → **continue to monitor**; do not escalate.
- **Frame 3:** escalating intake with urine output that does not respond → **failed fluid challenge**; notify, hold further boluses pending evaluation.
- **Frame 4:** falling intake against ongoing losses → **dehydration; intervene** (rehydrate / notify).

Frames 2 and 4 both end at −300 mL and key **opposite actions**. That is the proof.
</details>

---

## 6. Item construction

- **Frames 2 and 4 must be `multiple_choice` with an identical option set — verbatim, in both languages — differing only in the key.** This is the sharpest available demonstration: two items, same options, same final net, opposite correct answers. Any difference in wording between the two option sets weakens the proof and will be sent back.
- Frame 1: `select_all`. Frame 3: `matrix`. (Format spread; both remain pattern-only.)
- Distractors must be clinically plausible actions within nursing scope. No "call a code," no straw men.
- `id` prefix **`iot_*`**, disjoint from `io_*` (that is U5's `io_record`).
- `visual_justification` and `collapse_test` on all four. `derived_values_keyed` on all four (the arithmetic gate is free — use it). `crossover` on frame 2. `expected_trend` on all four.

---

## 7. Review routing — producer ≠ checker (principle 22)

- **GPT authors.** GPT therefore **cannot check** this batch. Opus-skeleton work routes as GPT-provenance for review-conflict purposes; this brief is a constraint document, so the items are GPT-provenance.
- **Claude gates mechanics**: schema `1.9` conformance, `selfCheck` green, fences honored (no `fill_in_blank`, no exact-value items, no stem leakage), bilingual parity, the identical-option-set requirement on the matched pair.
- **Claude does NOT certify the clinical keys**, having chosen the frames and directions. That check is **Luke's** (stage-4 human content review), with the Pass 1 blind derivation as the independent signal.
- **Gemini is not routed here.** Flag-only, never a content-judgment audit lane.

Human review concentrates on the three things no gate can see:
1. Does each item survive the collapse test — is `collapse_test`'s counterfactual genuinely a *different answer*, or a restatement?
2. Is the trend clinically real — are these plausible charted volumes for the stated frame, and is the keyed interpretation right?
3. Does the stem leak the pattern?

---

## 8. Promotion path

- Draft to `banks/banks-raw/` as **`visual-iotrend-2026-07-XX.json`**. The `visual-` prefix routes it to `banks/visual-canonical.json`, the live visual bank. **Do not create an `iotrend-canonical.json`**; the eight per-kind canonicals are closed sets frozen at `1.2`, and every kind added after the original roadmap promotes through `visual-`.
- `visual-canonical.json` currently declares `1.7`. Merging the first `io_trend` items bumps its `meta.schemaVersion` to `1.9`. That bump is the deliberate consequence of a new kind landing — expect it; it is not a workaround.
- Flow: generate → `banks/banks-raw/` → cross-model review (**never the producing model**) → source-check → visual audit → human content review → `npm run promote` → `npm run audit` → merge into `visual-canonical.json` → ledger entry → delete raw.
- Codex does not merge or push `main`. The architect gate is explicit.

## 9. Acceptance

```sh
npm run validate-bank -- banks/*.json
npm run audit
npm run census && npm run census:check
npm run build
```

All green, `selfCheck` clean on all four items, and — the only check that actually matters — **frames 2 and 4 key opposite answers off an identical final cumulative net.**
