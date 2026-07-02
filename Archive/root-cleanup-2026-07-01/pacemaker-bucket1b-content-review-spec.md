# Pacemaker / Bucket 1B Content Review — Gemini Task + Claude Code Meta-Assessment Spec

Date: 2026-07-01

Author: Claude (planning/spec seat), per Luke's request in-session.

Source work under review: `rhythm-strip-pacemaker-overlay-codex-spec.md` (Spec E), Phases 0-3 + Bucket 1B addendum, landed 2026-07-01.


## Scope and assumption

Luke asked to scope "the refactored questions from this" as a Gemini task, with Claude Code doing the final content assessment plus a meta-assessment of Gemini's review quality (per the standing Gemini-audit-lane restriction in `DECISIONS.md`).

**Assumption (stated, not confirmed with Luke): scope is all 7 items whose learner-facing content was authored or rewritten in today's pass** — not just the 3 pacer backfill items in `CLAUDE-CONTENT-REVIEW-HANDOFF.md`. If Luke only meant the 3 pacer items, drop the Bucket 1B rows below; the review structure is unaffected either way.

| # | ID | Bank | What changed |
|---|---|---|---|
| 1 | `ekg_pacer_failure_to_capture_2026_07_01` | `visual-canonical.json` | New item, retires `ekg_b5_mc_04` |
| 2 | `ekg_pacer_failure_to_sense_2026_07_01` | `visual-canonical.json` | New item, retires `ekg_b5_mc_05` |
| 3 | `ekg_pacer_failure_to_pace_2026_07_01` | `visual-canonical.json` | New item, retires `ekg_b5_matrix_10` |
| 4 | `opus26_case_refeeding_syndrome_01_q3` (embedded leaf) | `claude-canonical.json` | Stem trimmed, PVC rhythm strip added |
| 5 | `opus26_case_refeeding_syndrome_01_q5` (embedded leaf) | `claude-canonical.json` | Stem trimmed, follow-up sinus strip added |
| 6 | `cs_adhf_pulm_edema_01` exhibit `ed_assessment` | `hard-cases-canonical.json` | Exhibit prose trimmed, AFib strip added |
| 7 | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01` exhibit `baseline_assessment` | `hard-cases-canonical.json` | Exhibit prose trimmed, AFib strip added |

**Snapshot provenance:** all JSON below was pulled live via the `fsmcp` connector on 2026-07-01, from `census.json`'s recorded git SHA `7567c79123c18c49386217df9a70870729ba8d2e`. Treat it as a point-in-time snapshot for Gemini's benefit (Gemini has no live filesystem access in this pipeline) — **Claude Code must re-pull live data before finalizing anything**, per the standing "in-context snapshots go stale" rule; do not trust this file as authoritative if the repo has moved since this SHA.

---

## Three candidate defects I already found while pulling this data

I was not asked to do content review, but these surfaced during structural verification and are exactly the class of small-diff correctness issue worth flagging rather than sitting on. Both Gemini and Claude Code should treat these as **required, not optional**, checks — everything else in the checklist below is the general sweep.

### Flag 1 — `gpt_stroke_..._01_q1`, row `r5`: the narrated finding may not have actually moved

Bucket 1B's whole premise (per the Content Rewrite Rule) is that removing prose narration and replacing it with a visual is only valid if the visual becomes load-bearing for *something*. The `baseline_assessment` exhibit's prose was trimmed (the "irregularly irregular" cue removed, replaced by an `afib` rhythm strip). But embedded question `q1` is a **matrix** item with a row that still reads:

> r5 (EN): "Irregularly irregular heart rhythm with atrial fibrillation history"
> r5 rationale (EN): "Atrial fibrillation is a major risk factor for cardioembolic stroke and supports the mechanism, even though it is not a focal neurologic deficit."

This row is **keyed** (`r5 -> c1`, graded). The learner classifies it from the row text alone — they are never asked to read the rhythm off the strip to answer q1. If no other embedded question in this case requires reading the strip either (see the full case below), the new `baseline_assessment` visual may be **decorative** per principle 6 ("a visual whose removal leaves the answer unchanged is decorative and invalid") for this case, and/or the row itself is now a residual "shape narration" that should have been rewritten alongside the exhibit per the addendum's own rule.

**Required check:** does *any* embedded question (q1-q6) in this case require the strip to answer? If not, this conversion needs a second pass (either rewrite row r5, or the exhibit visual isn't actually earning its place here).

### Flag 2 — `gpt_stroke_..._01_q6`, option D: consistency check

> option D (EN): "Serial troponin levels because the initial rhythm was atrial fibrillation" (distractor, not selected)

This treats "the initial rhythm was atrial fibrillation" as an established premise in option text (fine — post-stem option text isn't the same as a pre-answer leak). Confirm: (a) this is consistent with the visual (`rhythm: "afib"`), and (b) the reason D is wrong is genuinely "troponin isn't the priority parameter regardless of initial rhythm" and not something that quietly depends on knowing the rhythm was AFib specifically — if it's the latter, that's a second point of contact with Flag 1's necessity question.

### Flag 3 — `cs_adhf_pulm_edema_01`, exhibit `ed_assessment`: history vs. current finding

The case summary already states the client has a *history* of atrial fibrillation (chronic condition, pre-existing). The case's own `part_1` (select_all) includes "History of atrial fibrillation" as an explicit **distractor** (not selected — the rationale explains it's "part of the client's history, not a direct physical sign of pulmonary edema"). None of `part_1`-`part_4` reference the *current* rhythm. So the new exhibit visual (showing the *current* ED presentation as AFib) doesn't appear to be load-bearing for any graded item in this case either — it's clinically consistent (a chronic-AFib patient would plausibly still be in AFib acutely) but may be decorative under the same reading as Flag 1.

**Required check:** same as Flag 1 — confirm whether any embedded question's answer changes if this visual is removed.

---

## Part A — Gemini review task (self-contained; paste this whole section, including the embedded item JSON, into Gemini)

**You are a flag-only reviewer, not the final decision-maker.** Per this project's standing policy (`DECISIONS.md`), your output is provisional: Claude Code will independently re-review the same items and will reject any finding of yours that is templated/boilerplate rather than item-specific, or that doesn't quote the actual keyed clinical rule from the item text (English **and** Chinese). Generic reconciliations ("all clinically sound, no fixes required" repeated verbatim across items) will be treated as a review-quality failure, not a clean pass — the prior Phase B audit found exactly this pattern and it is why your role here is explicitly gated.

### What to review

For **each** of the 7 items/exhibits below, answer:

1. **Clinical accuracy** — is the stated pacemaker finding / cardiac rhythm / clinical reasoning correct and current?
2. **Fairness / inferability** — does the stem leak the finding before the learner reasons about it (per the Content Rewrite Rule, the visual must carry the finding, not the stem)? Is the finding fairly inferable from stem + visual + options together?
3. **Bilingual parity** — do the `en`/`zh` pairs say the same clinical thing? Flag any mistranslation, omission, or leaked English inside a `zh` field.
4. **Visual necessity (principle 6)** — for the 3 pacer items: does the answer change if the `pacer` data is removed from the visual? For the 4 Bucket 1B items: does **any** embedded question's answer change if the exhibit/leaf visual is removed? Address Flags 1-3 above explicitly for the two exhibit-based items and for `q1`.

### Required output format

For each item, a structured block:

```
id: <item id>
verdict: PASS | FLAG | NEEDS-HUMAN
evidence_en: "<verbatim quote from the item's own en text supporting your verdict>"
evidence_zh: "<verbatim quote from the item's own zh text supporting your verdict>"
reasoning: <2-4 sentences, specific to this item — no boilerplate reused across items>
```

A verdict with no verbatim quote, or whose `reasoning` is interchangeable with another item's, will be auto-rejected by the meta-assessment pass regardless of whether the verdict itself was correct.

### Item data


#### 1. ekg_pacer_failure_to_capture_2026_07_01

```json
{
  "id": "ekg_pacer_failure_to_capture_2026_07_01",
  "itemType": "multiple_choice",
  "category": "Physiological Adaptation",
  "difficulty": "hard",
  "ngnSkill": "recognize_cues",
  "topic": "Electrolyte Imbalances",
  "visual": {
    "kind": "rhythm_strip",
    "rhythm": "asystole",
    "rateBpm": 0,
    "durationSec": 6,
    "seed": 201,
    "calibrationPulse": true,
    "qrsSec": 0.16,
    "caption": {
      "en": "Lead II telemetry rhythm strip, paper speed 25 mm/s",
      "zh": "II导联遥测心律条，走纸速度25毫米/秒"
    },
    "pacer": {
      "mode": "ventricular",
      "setRateBpm": 60,
      "captureLatencySec": 0.08,
      "spikeTimesSec": [
        1,
        2,
        3,
        4,
        5
      ],
      "capturedSpikeTimesSec": [
        1,
        3,
        5
      ],
      "finding": "failure_to_capture"
    }
  },
  "stem": {
    "en": "The nurse reviews the telemetry strip from a client with a permanent ventricular pacemaker who reports dizziness. Which pacemaker problem is shown?",
    "zh": "护士查看一名装有永久性心室起搏器且主诉头晕的患者遥测心律条。图中显示哪一种起搏器问题？"
  },
  "options": [
    {
      "id": "B",
      "en": "Failure to sense",
      "zh": "未感知（感知失效）"
    },
    {
      "id": "D",
      "en": "Failure to capture",
      "zh": "未夺获（夺获失效）"
    },
    {
      "id": "A",
      "en": "Oversensing",
      "zh": "感知过度"
    },
    {
      "id": "C",
      "en": "Failure to pace",
      "zh": "未起搏（起搏失效）"
    }
  ],
  "correct": [
    "D"
  ],
  "rationale": {
    "correct": {
      "en": "Failure to capture occurs when a pacemaker stimulus is delivered but does not depolarize the myocardium. In the strip, some pacing spikes are not followed by a paced QRS complex, so the device is firing but the ventricle is not consistently responding. This can cause symptomatic bradycardia and may occur with lead displacement, battery/output problems, or metabolic disturbances such as hyperkalemia or acidosis.",
      "zh": "未夺获（夺获失效）是指起搏器刺激已经发放，但未能使心肌除极。图中心律条有些起搏尖峰波后没有出现起搏性QRS波群，说明起搏器正在发放脉冲，但心室没有持续响应。这可导致有症状的心动过缓，可能与导线移位、电池或输出问题，或高钾血症、酸中毒等代谢异常有关。"
    },
    "byChoice": [
      {
        "refId": "A",
        "en": "Oversensing inhibits pacing because the device misreads noncardiac or inappropriate signals as intrinsic activity; the key ECG clue is too few or absent spikes, not spikes without ventricular response.",
        "zh": "感知过度会因设备将非心脏信号或不恰当信号误认为固有活动而抑制起搏；关键心电图线索是尖峰波过少或缺失，而不是尖峰波后心室无反应。"
      },
      {
        "refId": "D",
        "en": "Correct. The pacer spikes are present, but some are not followed by ventricular depolarization, which defines failure to capture.",
        "zh": "正确。起搏尖峰波存在，但其中一些后面没有心室除极，符合夺获失效。"
      },
      {
        "refId": "C",
        "en": "Failure to pace means the expected pacing spike is absent when the client needs pacing.",
        "zh": "未起搏是指患者需要起搏时，预期的起搏尖峰波没有出现。"
      },
      {
        "refId": "B",
        "en": "Failure to sense produces inappropriately timed spikes despite intrinsic beats, such as spikes falling on or near QRS/T complexes.",
        "zh": "未感知会在存在固有心搏时仍出现时机不当的尖峰波，例如尖峰波落在QRS/T波群附近。"
      }
    ]
  },
  "testTakingStrategy": {
    "en": "Separate the two pacemaker tasks: pacing means the device fires a spike; capture means the myocardium responds with a QRS. Spikes without QRS complexes point to a capture problem.",
    "zh": "把起搏器的两个任务分开：起搏表示设备发放尖峰波；夺获表示心肌以QRS波群作出反应。有尖峰波但无QRS波群，提示夺获问题。"
  },
  "glossary": [
    {
      "termEn": "failure to capture",
      "termZh": "夺获失效",
      "defZh": "起搏刺激未能引起心肌除极，心电图表现为起搏尖峰波后没有相应的QRS或P波"
    },
    {
      "termEn": "pacing spike",
      "termZh": "起搏尖峰波",
      "defZh": "心电图上代表起搏器电脉冲的短暂垂直标记"
    }
  ],
  "meta": {
    "visual_justification": "The answer depends on recognizing which pacer spikes do not produce a QRS complex in the rendered strip.",
    "expected": {
      "pacerFinding": "failure_to_capture"
    },
    "source": "Retires and replaces ekg_b5_mc_04; clinical target preserved from reviewed canonical item with visual cue moved into rhythm_strip."
  }
}
```

#### 2. ekg_pacer_failure_to_sense_2026_07_01

```json
{
  "id": "ekg_pacer_failure_to_sense_2026_07_01",
  "itemType": "multiple_choice",
  "category": "Physiological Adaptation",
  "difficulty": "hard",
  "ngnSkill": "recognize_cues",
  "topic": "Cardiovascular Disorders",
  "visual": {
    "kind": "rhythm_strip",
    "rhythm": "sinus",
    "rateBpm": 75,
    "durationSec": 6,
    "seed": 7,
    "calibrationPulse": true,
    "prSec": 0.16,
    "qrsSec": 0.08,
    "qtSec": 0.36,
    "caption": {
      "en": "Lead II telemetry rhythm strip, paper speed 25 mm/s",
      "zh": "II导联遥测心律条，走纸速度25毫米/秒"
    },
    "pacer": {
      "mode": "ventricular",
      "setRateBpm": 60,
      "captureLatencySec": 0.08,
      "spikeTimesSec": [
        1.02,
        2.8,
        4.6
      ],
      "capturedSpikeTimesSec": [
        2.8,
        4.6
      ],
      "finding": "failure_to_sense"
    }
  },
  "stem": {
    "en": "The nurse reviews the telemetry strip for a client with a temporary ventricular pacemaker. Which pacemaker malfunction should the nurse identify, and which dangerous rhythm can it precipitate?",
    "zh": "护士查看一名装有临时心室起搏器患者的遥测心律条。护士应识别出哪种起搏器故障，以及它可能诱发哪种危险心律？"
  },
  "options": [
    {
      "id": "C",
      "en": "Failure to pace, causing bradycardia and cardiogenic shock",
      "zh": "未起搏（起搏失效），导致心动过缓和心源性休克"
    },
    {
      "id": "A",
      "en": "Failure to sense, causing R-on-T phenomenon and ventricular fibrillation",
      "zh": "未感知（感知失效），导致R-on-T现象和心室颤动"
    },
    {
      "id": "B",
      "en": "Oversensing, causing rapid supraventricular tachycardia",
      "zh": "感知过度，导致快速室上性心动过速"
    },
    {
      "id": "D",
      "en": "Failure to capture, causing severe asystole",
      "zh": "未夺获（夺获失效），导致严重心室停搏"
    }
  ],
  "correct": [
    "A"
  ],
  "rationale": {
    "correct": {
      "en": "Failure to sense, or undersensing, occurs when the pacemaker does not recognize the client's intrinsic cardiac activity. The strip shows pacer spikes occurring despite intrinsic complexes, including an inappropriately timed spike during repolarization. A stimulus that falls on the vulnerable T-wave period can produce an R-on-T phenomenon and trigger ventricular tachycardia or ventricular fibrillation.",
      "zh": "未感知（感知失效，也称感知不足）是指起搏器未识别患者自身的心脏电活动。图中在已有固有波群时仍出现起搏尖峰波，其中包括在复极期不合时宜出现的尖峰波。刺激落在脆弱的T波时期可产生R-on-T现象，并诱发室性心动过速或心室颤动。"
    },
    "byChoice": [
      {
        "refId": "B",
        "en": "Oversensing usually inhibits pacing because the device misinterprets signals as cardiac activity; it does not produce extra spikes on intrinsic T waves.",
        "zh": "感知过度通常会因设备误把信号当作心脏活动而抑制起搏；它不会在固有T波上产生额外尖峰波。"
      },
      {
        "refId": "C",
        "en": "Failure to pace is the absence of expected spikes when the client's rate falls below the programmed limit.",
        "zh": "未起搏是指患者心率低于设定下限时没有出现预期的尖峰波。"
      },
      {
        "refId": "A",
        "en": "Correct. Inappropriately timed spikes during intrinsic activity indicate failure to sense and can trigger R-on-T ventricular dysrhythmias.",
        "zh": "正确。在固有心脏活动期间出现时机不当的尖峰波，提示未感知，并可能触发R-on-T相关室性心律失常。"
      },
      {
        "refId": "D",
        "en": "Failure to capture has spikes that are not followed by depolarization; the key concern in this strip is inappropriate timing relative to intrinsic beats.",
        "zh": "夺获失效表现为尖峰波后没有除极；本图的关键问题是尖峰波相对于固有心搏的时机不当。"
      }
    ]
  },
  "testTakingStrategy": {
    "en": "Look for whether the pacemaker respects intrinsic beats. Spikes that occur during the client's own QRS/T cycle mean the device is not sensing native activity, and a spike on the T wave raises concern for R-on-T deterioration.",
    "zh": "观察起搏器是否避开固有心搏。如果尖峰波出现在患者自身QRS/T周期内，说明设备未感知固有活动；尖峰波落在T波上时，应担心R-on-T导致恶化。"
  },
  "glossary": [
    {
      "termEn": "failure to sense",
      "termZh": "感知失效",
      "defZh": "起搏器未能识别心脏自身电活动，导致在不恰当时间发放起搏刺激"
    },
    {
      "termEn": "R-on-T phenomenon",
      "termZh": "R-on-T现象",
      "defZh": "电刺激或期前搏动落在前一心搏T波的脆弱期，可诱发室性心律失常"
    }
  ],
  "meta": {
    "visual_justification": "The answer depends on identifying pacer spikes occurring during intrinsic ventricular activity in the rendered strip.",
    "expected": {
      "pacerFinding": "failure_to_sense"
    },
    "source": "Retires and replaces ekg_b5_mc_05; clinical target preserved from reviewed canonical item with visual cue moved into rhythm_strip."
  }
}
```

#### 3. ekg_pacer_failure_to_pace_2026_07_01

```json
{
  "id": "ekg_pacer_failure_to_pace_2026_07_01",
  "itemType": "multiple_choice",
  "category": "Physiological Adaptation",
  "difficulty": "hard",
  "ngnSkill": "recognize_cues",
  "topic": "Cardiovascular Disorders",
  "visual": {
    "kind": "rhythm_strip",
    "rhythm": "asystole",
    "rateBpm": 0,
    "durationSec": 6,
    "seed": 203,
    "calibrationPulse": true,
    "qrsSec": 0.16,
    "caption": {
      "en": "Lead II telemetry rhythm strip, paper speed 25 mm/s",
      "zh": "II导联遥测心律条，走纸速度25毫米/秒"
    },
    "pacer": {
      "mode": "ventricular",
      "setRateBpm": 60,
      "captureLatencySec": 0.08,
      "spikeTimesSec": [
        1,
        2,
        5
      ],
      "capturedSpikeTimesSec": [
        1,
        2,
        5
      ],
      "finding": "failure_to_pace"
    }
  },
  "stem": {
    "en": "A client with a ventricular pacemaker set to maintain a minimum rate of 60/min reports lightheadedness. The nurse reviews the telemetry strip. Which pacemaker problem is shown?",
    "zh": "一名装有心室起搏器的患者设定最低频率为60次/分，现主诉头晕。护士查看遥测心律条。图中显示哪一种起搏器问题？"
  },
  "options": [
    {
      "id": "A",
      "en": "Failure to capture",
      "zh": "未夺获（夺获失效）"
    },
    {
      "id": "C",
      "en": "Failure to pace",
      "zh": "未起搏（起搏失效）"
    },
    {
      "id": "D",
      "en": "Normal ventricular capture",
      "zh": "正常心室夺获"
    },
    {
      "id": "B",
      "en": "Failure to sense",
      "zh": "未感知（感知失效）"
    }
  ],
  "correct": [
    "C"
  ],
  "rationale": {
    "correct": {
      "en": "Failure to pace means the pacemaker does not generate a stimulus when pacing is expected, so the ECG shows absent pacing spikes during a pause or a rate below the programmed lower limit. In this strip, the pacer captures when it fires, but there is a prolonged interval without pacing spikes despite the 60/min setting.",
      "zh": "未起搏（起搏失效）是指在预期需要起搏时，起搏器没有产生刺激，因此心电图可见长间歇或心率低于设定下限时缺乏起搏尖峰波。图中起搏器发放时能够夺获，但在设定为60次/分的情况下出现长时间没有尖峰波的间歇。"
    },
    "byChoice": [
      {
        "refId": "A",
        "en": "Failure to capture requires a pacer spike that is not followed by myocardial depolarization. The displayed captured beats do have QRS complexes after their spikes.",
        "zh": "夺获失效要求尖峰波后没有心肌除极。图中已出现的起搏搏动在尖峰波后有QRS波群。"
      },
      {
        "refId": "D",
        "en": "Normal ventricular capture would show each expected pacer spike followed by a paced QRS at the set rate, without the prolonged pause.",
        "zh": "正常心室夺获应显示每个预期尖峰波后都有起搏性QRS，并按设定频率出现，而不会有这种长间歇。"
      },
      {
        "refId": "B",
        "en": "Failure to sense produces spikes at inappropriate times during intrinsic cardiac activity. This strip instead shows a long interval without expected pacing spikes.",
        "zh": "未感知会在固有心脏活动期间出现时机不当的尖峰波。本图显示的是预期应起搏时长时间没有尖峰波。"
      },
      {
        "refId": "C",
        "en": "Correct. The pacemaker should fire at the programmed lower rate, but the strip contains a prolonged spike-free pause.",
        "zh": "正确。起搏器应按设定下限频率发放脉冲，但图中存在长时间无尖峰波的间歇。"
      }
    ]
  },
  "testTakingStrategy": {
    "en": "First ask whether a spike appears when one is expected. A long pause without spikes at a rate below the pacemaker limit points to failure to pace; spikes without QRS would be failure to capture.",
    "zh": "先判断在预期需要起搏时是否出现尖峰波。心率低于起搏器下限时出现长时间无尖峰波，提示未起搏；若有尖峰波但无QRS，则是夺获失效。"
  },
  "glossary": [
    {
      "termEn": "failure to pace",
      "termZh": "起搏失效",
      "defZh": "起搏器在应发放刺激时未发放起搏脉冲，心电图可见应有尖峰波缺失或长间歇"
    },
    {
      "termEn": "lower rate limit",
      "termZh": "最低起搏频率",
      "defZh": "起搏器设定的最低心率，低于该频率时设备应发放起搏刺激"
    }
  ],
  "meta": {
    "visual_justification": "The answer depends on recognizing the prolonged interval where no pacer spike occurs despite the programmed lower-rate setting.",
    "expected": {
      "pacerFinding": "failure_to_pace"
    },
    "source": "Retires and replaces ekg_b5_matrix_10; narrows the former three-row matching item to the previously unrenderable failure-to-pace cue."
  }
}
```

#### 4-5. opus26_case_refeeding_syndrome_01 — case context + leaves q3/q5

Case title: Refeeding syndrome risk in severe anorexia nervosa

Case summary (EN): A 22-year-old woman with severe anorexia nervosa is admitted after syncope and several weeks of intake under 400 kcal/day. Admission BMI is 14.8 kg/m². Refeeding begins with telemetry, strict intake and output, daily weights, electrolyte monitoring, thiamine, multivitamin supplementation, meal supervision, and restricted activity.

Stages (for context only, not reproduced in full — pull live if needed): stage_18h, stage_36h, stage_60h

Other leaves in this case, condensed (q3/q5 are the only ones with new visuals; q1/q2/q4/q6 unchanged today, included so Gemini can see the whole case before judging necessity):

- **`opus26_case_refeeding_syndrome_01_q1`** (select_all) — EN stem: "At Stage 1, which nursing actions are required based on the 12-hour laboratory results and the admission refeeding protocol? Select all that apply."
  - options: A=Hold any planned caloric advancement.; F=Start IV potassium phosphate because the phosphorus is below 2.5 mg/dL.; E=Independently increase the meal plan because the glucose has improved.; C=Initiate oral sodium phosphate per the pharmacy protocol.; B=Notify the provider immediately about the phosphorus and potassium threshold crossings.; D=Wait for the next scheduled 12-hour laboratory draw before acting.
  - correct: `['A', 'B', 'C']`

- **`opus26_case_refeeding_syndrome_01_q2`** (multiple_choice) — EN stem: "At Stage 1, the client reports bloating, mild nausea, and abdominal cramping after meals and asks the nurse to reduce her portions. Which response by the nurse is most appropriate?"
  - options: A=Acknowledge the discomfort, offer comfort measures, document the symptoms, and communicate them to the provider and dietitian while maintaining the prescribed meal plan.; D=Tell the client that the symptoms prove she is not medically ready for oral nutrition.; B=Allow the client to skip the next snack because nausea means the calories are being advanced too quickly.; C=Reduce each meal portion by half until the abdominal cramping resolves.
  - correct: `['A']`

- **`opus26_case_refeeding_syndrome_01_q4`** (select_all) — EN stem: "At Stage 2, the client is tearful, says the food is making her sick, asks to stop eating, and is observed hiding food in a napkin. Which nursing actions are appropriate? Select all that apply."
  - options: F=State that the food is not the cause of harm, while acknowledging that her symptoms and fears are real.; B=Explain calmly that the team is monitoring her closely and that the nutrition plan is medically necessary.; C=Document the food-hiding behavior objectively and communicate it to the treatment team.; D=Agree to stop meals until she feels that eating is safe.; A=Validate that the situation feels frightening and uncomfortable for her.; E=Tell her that if she keeps hiding food, a feeding tube will be placed as punishment.
  - correct: `['A', 'B', 'C', 'F']`

- **`opus26_case_refeeding_syndrome_01_q6`** (dropdown_cloze) — EN stem: "At Stage 3, the provider is considering advancing calories from 1,200 to 1,400 kcal/day beginning tomorrow if electrolytes remain stable on the next draw. Complete the nursing judgment statement."
  - clozeStem: The client's current electrolyte values are {{1}}, so the nurse should {{2}} before caloric advancement.
    - dropdown 1: o1=above the stated hold thresholds but not enough alone to prove ongoing stability; o3=irrelevant once the PVCs have resolved; o2=below the stated hold thresholds and require stopping all oral intake (correct: o1)
    - dropdown 2: o2=advance the diet immediately because the 60-hour labs improved; o3=request a diuretic first to remove the ankle edema; o1=communicate that the next electrolyte draw must confirm stability (correct: o1)

Full leaf q3 (new visual):

```json
{
  "id": "opus26_case_refeeding_syndrome_01_q3",
  "itemType": "multiple_choice",
  "category": "Physiological Adaptation",
  "topic": "Electrolyte Imbalances",
  "difficulty": "hard",
  "ngnSkill": "prioritize_hypotheses",
  "stem": {
    "en": "At Stage 2, the telemetry strip is shown. The monitor reports QTc 480 ms, and labs show potassium 3.1 mEq/L, phosphorus 1.9 mg/dL, and magnesium 1.4 mg/dL. What is the nurse's priority action?",
    "zh": "在阶段2，心律条如图所示。监护仪报告QTc 480 ms，实验室显示钾3.1 mEq/L、磷1.9 mg/dL、镁1.4 mg/dL。护士的优先措施是什么？"
  },
  "rationale": {
    "correct": {
      "en": "New ventricular ectopy and QTc prolongation in the setting of worsening hypokalemia, hypophosphatemia, and hypomagnesemia indicate clinically significant instability. The priority is to notify the provider immediately with the complete rhythm-and-electrolyte picture and anticipate stat IV replacement orders, including IV potassium phosphate per the stated protocol for phosphorus below 2.0 mg/dL.",
      "zh": "在低钾、低磷、低镁继续恶化的背景下，新出现室性异位搏动和QTc延长提示临床不稳定。优先措施是立即将完整的心律和电解质情况通知医护提供者，并预期获得立即静脉补充电解质的医嘱，包括因磷低于2.0 mg/dL而按既定方案给予静脉磷酸钾。"
    },
    "byChoice": [
      {
        "refId": "A",
        "en": "This addresses the unstable rhythm cues and the full pattern of electrolyte depletion; the phosphorus level now meets the protocol trigger for IV potassium phosphate.",
        "zh": "这一措施处理了不稳定心律线索和完整的电解质耗竭模式；当前磷值已达到方案中静脉磷酸钾的触发条件。"
      },
      {
        "refId": "B",
        "en": "Continuing the same plan delays escalation despite new dysrhythmia cues and worsening electrolyte values.",
        "zh": "在新发心律失常线索和电解质继续恶化的情况下继续原方案，会延误升级处理。"
      },
      {
        "refId": "C",
        "en": "Potassium alone is incomplete because phosphorus and magnesium are also low, and magnesium depletion can make potassium correction ineffective.",
        "zh": "只补钾并不完整，因为磷和镁也偏低，低镁会使补钾效果不佳。"
      },
      {
        "refId": "D",
        "en": "Increasing intake during active electrolyte instability can worsen intracellular shifts and does not safely treat the rhythm change.",
        "zh": "在电解质不稳定时增加摄入可能加重细胞内转移，也不能安全处理心律变化。"
      }
    ]
  },
  "testTakingStrategy": {
    "en": "In priority questions, an acute change in cardiac rhythm plus worsening electrolytes outranks comfort, routine documentation, or isolated replacement of one electrolyte.",
    "zh": "在优先级题中，急性心律改变合并电解质恶化，优先级高于舒适护理、常规记录或只补充某一种电解质。"
  },
  "glossary": [
    {
      "termEn": "PVC",
      "termZh": "室性早搏",
      "defZh": "源自心室的过早搏动；在电解质异常时可能提示更高的心律失常风险。"
    },
    {
      "termEn": "Hypomagnesemia",
      "termZh": "低镁血症",
      "defZh": "血镁偏低，可加重或使低钾更难纠正，并增加心律异常风险。"
    },
    {
      "termEn": "QTc",
      "termZh": "校正QT间期",
      "defZh": "按心率校正后的QT间期，用于评估复极延迟和心律失常风险。"
    }
  ],
  "options": [
    {
      "id": "B",
      "en": "Document the rhythm change and continue the current oral phosphorus replacement until the next scheduled laboratory draw.",
      "zh": "记录心律变化，并继续当前口服补磷，等到下一次计划实验室复查。"
    },
    {
      "id": "D",
      "en": "Encourage the client to eat more of the next meal to correct the electrolyte levels naturally.",
      "zh": "鼓励患者下一餐多吃一些，以自然纠正电解质水平。"
    },
    {
      "id": "C",
      "en": "Administer potassium chloride only, because the dysrhythmia is caused by hypokalemia.",
      "zh": "仅给予氯化钾，因为心律失常是由低钾引起的。"
    },
    {
      "id": "A",
      "en": "Notify the provider immediately of the new PVCs, QTc prolongation, and worsening potassium, phosphorus, and magnesium; anticipate stat IV electrolyte replacement orders.",
      "zh": "立即将新出现的PVCs、QTc延长以及钾、磷、镁继续恶化通知医护提供者；预期立即静脉补充电解质医嘱。"
    }
  ],
  "correct": [
    "A"
  ],
  "visual": {
    "kind": "rhythm_strip",
    "rhythm": "pvc",
    "rateBpm": 64,
    "durationSec": 6,
    "seed": 401,
    "calibrationPulse": true,
    "prSec": 0.16,
    "qrsSec": 0.08,
    "qtSec": 0.48,
    "caption": {
      "en": "Lead II telemetry strip at Stage 2",
      "zh": "阶段2 II导联心律条"
    }
  },
  "meta": {
    "visual_justification": "The strip supplies the rhythm cue; the stem supplies the measured QTc and electrolyte values."
  }
}
```

Full leaf q5 (new visual):

```json
{
  "id": "opus26_case_refeeding_syndrome_01_q5",
  "itemType": "multiple_choice",
  "category": "Physiological Adaptation",
  "topic": "Electrolyte Imbalances",
  "difficulty": "medium",
  "ngnSkill": "evaluate_outcomes",
  "stem": {
    "en": "At Stage 3, electrolytes have improved and the follow-up telemetry strip is shown. The nurse notes new mild 1+ bilateral ankle edema with clear lungs and a cumulative weight gain of 1.1 kg over 60 hours. Which interpretation and action are most appropriate?",
    "zh": "在阶段3，电解质改善，复查心律条如图所示。护士发现新出现的双踝轻度1+水肿，双肺清，60小时累计体重增加1.1 kg。最合适的判断和措施是什么？"
  },
  "rationale": {
    "correct": {
      "en": "Mild peripheral edema and modest weight gain can occur during early refeeding because of sodium and water retention. With clear lungs and stable respiratory status, the nurse should continue assessment, document and report the finding, and avoid diuretics because they can worsen electrolyte instability.",
      "zh": "早期再喂养可因钠水潴留出现轻度外周水肿和适度体重增加。在双肺清且呼吸状态稳定的情况下，护士应继续评估，记录并报告该发现，避免使用利尿剂，因为利尿剂可能加重电解质不稳定。"
    },
    "byChoice": [
      {
        "refId": "A",
        "en": "This recognizes the likely expected refeeding edema while still monitoring for respiratory compromise and keeping the provider informed.",
        "zh": "这能识别可能的预期再喂养水肿，同时继续监测呼吸受累并让医护提供者知情。"
      },
      {
        "refId": "B",
        "en": "Diuretics can worsen electrolyte instability and are not indicated by mild ankle edema with clear lungs.",
        "zh": "利尿剂可能加重电解质不稳定；仅有轻度踝部水肿且双肺清时并无此指征。"
      },
      {
        "refId": "D",
        "en": "This is over-absolute and bypasses provider evaluation; ankle edema in this context is not always from excessive oral intake.",
        "zh": "这一说法过于绝对且绕过医护提供者评估；此情境下踝部水肿并不总是由口服摄入过多造成。"
      },
      {
        "refId": "C",
        "en": "The objective trend shows electrolyte and rhythm improvement; mild edema alone does not justify stopping nutrition.",
        "zh": "客观趋势显示电解质和心律改善；仅有轻度水肿不足以停止营养治疗。"
      }
    ]
  },
  "testTakingStrategy": {
    "en": "Before treating edema, decide whether the client has objective signs of pulmonary fluid overload or whether the edema fits the expected clinical context.",
    "zh": "处理水肿前，先判断患者是否有肺部液体过多的客观表现，还是该水肿符合当前临床背景下的预期现象。"
  },
  "glossary": [
    {
      "termEn": "Peripheral edema",
      "termZh": "外周水肿",
      "defZh": "液体在肢体组织间隙积聚，常见于踝部或足部。"
    },
    {
      "termEn": "Diuretic",
      "termZh": "利尿剂",
      "defZh": "促进排尿的药物；在电解质不稳定时可能带来风险。"
    },
    {
      "termEn": "Pitting edema",
      "termZh": "凹陷性水肿",
      "defZh": "按压后皮肤暂时留下凹陷的水肿表现。"
    }
  ],
  "options": [
    {
      "id": "B",
      "en": "Request a diuretic immediately because the weight gain confirms fluid overload.",
      "zh": "立即请求利尿剂，因为体重增加证实液体过多。"
    },
    {
      "id": "D",
      "en": "Restrict all oral fluids without notifying the provider because ankle edema is always caused by excessive intake.",
      "zh": "不通知医护提供者而限制所有口服液体，因为踝部水肿总是由摄入过多导致。"
    },
    {
      "id": "A",
      "en": "Recognize likely mild refeeding edema, assess respiratory status and lung sounds, document and report the finding, and avoid diuretics unless specifically ordered after evaluation.",
      "zh": "识别为可能的轻度再喂养水肿，评估呼吸状态和肺音，记录并报告该发现，除非评估后有明确医嘱，否则避免利尿剂。"
    },
    {
      "id": "C",
      "en": "Hold all meals because edema means refeeding syndrome is worsening despite normalized electrolytes.",
      "zh": "暂停所有进餐，因为水肿说明尽管电解质恢复正常，再喂养综合征仍在恶化。"
    }
  ],
  "correct": [
    "A"
  ],
  "visual": {
    "kind": "rhythm_strip",
    "rhythm": "sinus",
    "rateBpm": 68,
    "durationSec": 6,
    "seed": 402,
    "calibrationPulse": true,
    "prSec": 0.16,
    "qrsSec": 0.08,
    "qtSec": 0.44,
    "caption": {
      "en": "Lead II follow-up telemetry strip at Stage 3",
      "zh": "阶段3复查II导联心律条"
    }
  },
  "meta": {
    "visual_justification": "The strip supplies the follow-up rhythm cue while the stem supplies edema, lung, weight, and electrolyte context."
  }
}
```

#### 6. cs_adhf_pulm_edema_01 — full case (exhibit `ed_assessment` has the new visual)

Case title: Unfolding Case: Acute Respiratory Distress

Case summary (EN): A 74-year-old male with a history of chronic heart failure (ejection fraction 30%), hypertension, and atrial fibrillation presents to the emergency department with severe shortness of breath that started two hours ago. He states, "I feel like I'm drowning." He reports having to sleep in his recliner for the past two nights. His wife notes that he has not been taking his furosemide for the past three days because he "felt dehydrated."

Exhibit with new visual:

```json
{
  "id": "ed_assessment",
  "title": {
    "en": "Emergency Department Assessment - 0900",
    "zh": "急诊科评估 - 0900"
  },
  "content": {
    "en": "Vital Signs:\n- Temperature: 36.8°C (98.2°F)\n- Heart Rate: 128 beats/minute; telemetry strip shown below\n- Respiratory Rate: 34 breaths/minute, labored\n- Blood Pressure: 188/102 mmHg\n- SpO2: 85% on room air\n\nAssessment:\n- General: Anxious, sitting upright in tripod position, using accessory muscles.\n- Respiratory: Diffuse bilateral crackles halfway up the lung fields.\n- Cardiovascular: S3 gallop present. 2+ pitting edema in bilateral lower extremities.\n- Skin: Pale and diaphoretic.",
    "zh": "生命体征：\n- 体温：36.8°C (98.2°F)\n- 心率：128次/分钟；见下方遥测心律条\n- 呼吸频率：34次/分钟，费力\n- 血压：188/102 mmHg\n- 血氧饱和度：室内空气下为85%\n\n评估：\n- 一般情况：焦虑，呈三脚架体位坐立，使用辅助呼吸肌。\n- 呼吸系统：双肺野弥漫性湿啰音，高达肺野中部。\n- 心血管系统：可闻及S3奔马律。双下肢2+凹陷性水肿。\n- 皮肤：苍白、大汗。"
  },
  "visual": {
    "kind": "rhythm_strip",
    "rhythm": "afib",
    "rateBpm": 128,
    "durationSec": 6,
    "seed": 403,
    "calibrationPulse": true,
    "qrsSec": 0.08,
    "caption": {
      "en": "Lead II ED telemetry strip",
      "zh": "急诊II导联遥测心律条"
    }
  }
}
```

Embedded leaves (condensed — full text live in `hard-cases-canonical.json` if Gemini needs it):

- **`cs_adhf_pulm_edema_01_part_1`** (select_all) — EN stem: "Which findings from the initial assessment are most indicative of acute decompensated heart failure with pulmonary edema? Select all that apply."
  - options: F=Tripod positioning; A=SpO2 of 85% on room air; E=S3 gallop; B=Bilateral crackles; C=Blood pressure of 188/102 mmHg; D=History of atrial fibrillation
  - correct: `['A', 'B', 'E', 'F']`

- **`cs_adhf_pulm_edema_01_part_2`** (ordered_response) — EN stem: "The nurse needs to take immediate action to stabilize the client. Place the following nursing interventions in the correct order of priority."
  - options: B=Place the client in a high-Fowler's position.; C=Apply supplemental oxygen via a non-rebreather mask.; A=Administer intravenous furosemide.; D=Establish intravenous access.
  - correct: `['B', 'C', 'D', 'A']`

- **`cs_adhf_pulm_edema_01_part_3`** (dropdown_cloze) — EN stem: "The nurse is formulating a clinical hypothesis. Complete the following sentence by choosing from the dropdown options."
  - clozeStem: The client is most likely experiencing {{1}} as a result of {{2}}.
    - dropdown 1: o3=a pulmonary embolism; o1=cardiogenic pulmonary edema; o2=an acute asthma exacerbation (correct: o1)
    - dropdown 2: o3=an allergic reaction; o1=medication non-adherence; o2=a primary respiratory infection (correct: o1)

- **`cs_adhf_pulm_edema_01_part_4`** (multiple_choice) — EN stem: "After administering 80 mg of intravenous furosemide, which assessment finding would be the most reliable indicator that the medication has been effective?"
  - options: D=The client's heart rate decreases to 110 beats/minute.; C=The client has a urine output of 400 mL in the first hour.; A=The client's blood pressure decreases to 150/88 mmHg.; B=The client reports a decrease in anxiety.
  - correct: `['C']`

Full text of `part_1` (Flag 3 concerns this item — includes the AFib-history distractor):

```json
{
  "id": "cs_adhf_pulm_edema_01_part_1",
  "itemType": "select_all",
  "category": "Physiological Adaptation",
  "topic": "Cardiovascular Disorders",
  "difficulty": "hard",
  "ngnSkill": "recognize_cues",
  "stem": {
    "en": "Which findings from the initial assessment are most indicative of acute decompensated heart failure with pulmonary edema? Select all that apply.",
    "zh": "初步评估中的哪些发现最能表明患有急性失代偿性心力衰竭伴肺水肿？请选择所有适用项。"
  },
  "options": [
    {
      "id": "F",
      "en": "Tripod positioning",
      "zh": "三脚架体位"
    },
    {
      "id": "A",
      "en": "SpO2 of 85% on room air",
      "zh": "室内空气下血氧饱和度为85%"
    },
    {
      "id": "E",
      "en": "S3 gallop",
      "zh": "S3奔马律"
    },
    {
      "id": "B",
      "en": "Bilateral crackles",
      "zh": "双侧湿啰音"
    },
    {
      "id": "C",
      "en": "Blood pressure of 188/102 mmHg",
      "zh": "血压188/102 mmHg"
    },
    {
      "id": "D",
      "en": "History of atrial fibrillation",
      "zh": "心房颤动病史"
    }
  ],
  "correct": [
    "A",
    "B",
    "E",
    "F"
  ],
  "rationale": {
    "correct": {
      "en": "The classic signs of acute pulmonary edema, a life-threatening manifestation of ADHF, include severe dyspnea (leading to tripod positioning), hypoxemia (low SpO2), and diffuse crackles on auscultation due to fluid in the alveoli. An S3 gallop is a hallmark sign of fluid volume overload and failing left ventricular function. While hypertension is a common precipitating factor and atrial fibrillation is a common comorbidity, they are not as specific to the acute fluid shift into the lungs as the other findings.",
      "zh": "急性肺水肿是ADHF危及生命的表现，其典型体征包括严重呼吸困难（导致三脚架体位）、低氧血症（低SpO2）以及因肺泡积液而在听诊时闻及的弥漫性湿啰音。 S3奔马律是液体容量超负荷和左心室功能衰竭的标志性体征。虽然高血压是常见的诱发因素，心房颤动是常见的合并症，但它们不像其他发现那样对肺部急性液体转移具有特异性。"
    },
    "byChoice": [
      {
        "refId": "C",
        "en": "Severe hypertension can be a cause of ADHF (hypertensive emergency leading to increased afterload), but it is not a direct sign of fluid in the lungs itself. Some patients may present with hypotension.",
        "zh": "严重高血压可能是ADHF的原因（高血压急症导致后负荷增加），但它不是肺部积液本身的直接迹象。一些患者可能表现为低血压。"
      },
      {
        "refId": "F",
        "en": "The tripod position is an attempt by the client to maximize lung expansion and decrease the work of breathing in the setting of severe respiratory distress, which is characteristic of acute pulmonary edema.",
        "zh": "三脚架体位是客户在严重呼吸窘迫的情况下，为最大限度地扩大肺部并减少呼吸功而采取的姿势，这是急性肺水肿的特征。"
      },
      {
        "refId": "D",
        "en": "Atrial fibrillation is a risk factor and can precipitate an exacerbation by reducing diastolic filling time, but it is part of the client's history, not a direct physical sign of pulmonary edema.",
        "zh": "心房颤动是一个风险因素，可通过减少舒张期充盈时间而诱发病情加重，但它属于客户的病史，而不是肺水肿的直接体征。"
      },
      {
        "refId": "E",
        "en": "An S3 heart sound in an adult is an early diastolic sound indicating a large volume of blood flowing into a compliant ventricle, a classic sign of volume overload in heart failure.",
        "zh": "成年人中的S3心音是舒张早期的声音，表明大量血液流入顺应性好的心室，是心力衰竭中容量超负荷的典型体征。"
      },
      {
        "refId": "B",
        "en": "Crackles are adventitious breath sounds caused by the opening of small airways and alveoli collapsed by fluid, which is the defining feature of pulmonary edema.",
        "zh": "湿啰音是由于被液体压闭的小气道和肺泡重新张开而产生的附加呼吸音，这是肺水肿的决定性特征。"
      },
      {
        "refId": "A",
        "en": "Severe hypoxemia reflects impaired gas exchange at the alveolar-capillary membrane due to fluid accumulation, a direct consequence of pulmonary edema.",
        "zh": "严重低氧血症反映了由于液体积聚导致的肺泡-毛细血管膜气体交换受损，这是肺水肿的直接后果。"
      }
    ]
  },
  "testTakingStrategy": {
    "en": "Focus on the most specific signs of the condition named in the question (pulmonary edema). Ask, 'Which of these findings directly points to fluid in the lungs or the heart's inability to handle volume?' A history item or a potential cause is less specific than a direct physical assessment finding.",
    "zh": "关注问题中提到的病症（肺水肿）的最具体体征。问问自己，“这些发现中，哪一个直接指向肺部积液或心脏无法处理容量？”病史项目或潜在原因不如直接的体格检查发现具体。"
  },
  "glossary": [
    {
      "termEn": "Pulmonary Edema",
      "termZh": "肺水肿",
      "defZh": "由于肺血管内压力增高导致液体渗出到肺间质和肺泡内，引起严重的呼吸困难和气体交换障碍。"
    },
    {
      "termEn": "S3 Gallop",
      "termZh": "S3奔马律",
      "defZh": "在心动周期舒张早期出现的额外心音，通常与心室快速充盈和容量超负荷有关。"
    }
  ]
}
```

#### 7. gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01 — full case (exhibit `baseline_assessment` has the new visual)

Case title: Acute ischemic stroke with tPA eligibility evaluation in a patient on warfarin

Exhibit with new visual:

```json
{
  "id": "baseline_assessment",
  "title": {
    "en": "Initial assessment and diagnostics",
    "zh": "初始评估与诊断资料"
  },
  "content": {
    "en": "Vital signs: T 36.8 °C, HR 88/min, BP 188/104 mmHg; repeat manual BP 186/102 mmHg, RR 16/min, SpO2 98% on room air. Weight 92 kg.\n\nNeurologic examination: forced left gaze preference, expressive aphasia, right lower facial droop, right arm no movement against gravity, right leg trace hip movement with drift to bed within 5 seconds, diminished light touch on the right arm and leg, right Babinski sign. Left arm and leg have full strength. Pupils equal, round, reactive to light at 3 mm. NIHSS 14.\n\nOther assessment: cardiac rhythm shown on telemetry strip; lungs clear; abdomen soft and nontender; skin warm and dry without bruising or petechiae; peripheral pulses symmetric; no signs of head trauma.\n\nStat results: INR 1.8, PT 21.4 seconds, aPTT 34 seconds, platelets 188,000/µL, glucose 142 mg/dL, creatinine 1.0 mg/dL, hemoglobin 14.1 g/dL, troponin I <0.01 ng/mL.\n\nNon-contrast CT head: no intracranial hemorrhage, no early ischemic changes, no midline shift.",
    "zh": "生命体征：T 36.8 °C，HR 88 次/分，BP 188/104 mmHg；手动复测 BP 186/102 mmHg，RR 16 次/分，室内空气 SpO2 98%。体重 92 kg。\n\n神经系统检查：强迫性向左凝视偏斜，表达性失语，右下脸下垂，右臂不能抗重力活动，右腿髋部仅有轻微活动并在 5 秒内下垂至床面，右臂和右腿轻触觉减退，右侧 Babinski 征阳性。左臂和左腿肌力正常。双瞳孔等大等圆，对光反应存在，直径 3 mm。NIHSS 14。\n\n其他评估：心律见遥测心律条；双肺清；腹部软、无压痛；皮肤温暖干燥，无瘀斑或瘀点；外周脉搏对称；无头部外伤迹象。\n\n急查结果：INR 1.8，PT 21.4 秒，aPTT 34 秒，血小板 188,000/µL，血糖 142 mg/dL，肌酐 1.0 mg/dL，血红蛋白 14.1 g/dL，troponin I <0.01 ng/mL。\n\n头颅非增强 CT：无颅内出血，无早期缺血改变，无中线移位。"
  },
  "visual": {
    "kind": "rhythm_strip",
    "rhythm": "afib",
    "rateBpm": 88,
    "durationSec": 6,
    "seed": 404,
    "calibrationPulse": true,
    "qrsSec": 0.08,
    "caption": {
      "en": "Lead II baseline telemetry strip",
      "zh": "基线II导联遥测心律条"
    }
  }
}
```

Other exhibit for context (`initial_ed_record`, unchanged today):

```json
{
  "id": "initial_ed_record",
  "title": {
    "en": "ED arrival record",
    "zh": "急诊到达记录"
  },
  "content": {
    "en": "History: 68-year-old man with hypertension and atrial fibrillation. Home medications include amlodipine 10 mg daily, metoprolol 50 mg twice daily, and warfarin for stroke prevention. Anticoagulation clinic INR five days ago was 2.3. Wife witnessed sudden onset; EMS documented last known well 45 minutes before ED arrival. No prior stroke, recent surgery, known bleeding disorder, or prior intracranial hemorrhage.\n\nPresentation: awake and attentive, looking to the left. Produces only single words or short effortful phrases with paraphasic errors; cannot reliably repeat sentences. Follows simple commands with the left side but does not move the right arm or right leg to command. Wife reports he dropped a coffee cup with the right hand and could not form words.",
    "zh": "病史：68 岁男性，有高血压和房颤。家庭用药包括 amlodipine 10 mg 每日一次、metoprolol 50 mg 每日两次，以及用于预防卒中的 warfarin。抗凝门诊 5 天前 INR 为 2.3。妻子目击症状突发；EMS 记录最后正常时间为到达急诊前 45 分钟。无既往卒中、近期手术、已知出血性疾病或既往颅内出血。\n\n表现：清醒且能注意周围，但眼睛看向左侧。只能说单个词或短促费力的短语，并有语义错用；不能可靠复述句子。能用左侧肢体完成简单指令，但不能按指令移动右臂或右腿。妻子报告他右手掉落咖啡杯，且无法组织语言。"
  }
}
```

Embedded leaves, condensed except q1 and q6 (Flags 1 and 2 concern these two):

- **`gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_q2`** (dropdown_cloze) — EN stem: "At Stage 1, the CT shows no hemorrhage, last known well was about 75 minutes ago, BP is 186/102 mmHg, and the stat INR is 1.8. Use the institution's alteplase protocol stated in the chart."
  - clozeStem: The nurse should recognize that IV alteplase is {{1}} because the decisive contraindication is {{2}}. The nurse should promptly {{3}}.
    - dropdown 1: o1=contraindicated at this time; o3=delayed until the clinic INR from five days ago is repeated; o2=indicated because the CT is negative (correct: o1)
    - dropdown 2: o2=the blood pressure is above 180 systolic; o1=the current INR of 1.8 exceeds the institutional threshold; o3=the client took warfarin this morning regardless of the INR (correct: o1)
    - dropdown 3: o1=communicate the stat INR and support the pivot to CTA/thrombectomy evaluation; o3=give aspirin immediately for secondary prevention; o2=prepare alteplase while waiting for the historical clinic INR (correct: o1)

- **`gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_q3`** (multiple_choice) — EN stem: "At Stage 1, which hypothesis best explains the client's presentation and guides the next diagnostic step?"
  - options: B=Primary hypertensive encephalopathy; delay vascular imaging until BP is normal; D=Hemorrhagic stroke; prepare anticoagulation reversal before further imaging; A=Acute ischemic stroke from a likely cardioembolic left MCA occlusion; proceed with CTA for thrombectomy evaluation; C=Lacunar stroke from chronic hypertension; no large-vessel imaging is needed
  - correct: `['A']`

- **`gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_q4`** (select_all) — EN stem: "At Stage 2, the client is a thrombectomy candidate with BP 186/102 mmHg. Which nursing actions are appropriate before transfer to the neurointerventional suite? Select all that apply."
  - options: B=Maintain strict NPO status until a trained dysphagia screen is completed; A=Start the prescribed IV nicardipine infusion and titrate per protocol toward the pre-thrombectomy BP threshold; F=Request IV nitroprusside as the preferred first-line agent for rapid BP reduction; C=Ensure two patent IV lines and continuous cardiac monitoring; D=Verify that proxy consent has been obtained because the client cannot provide informed consent due to aphasia; E=Administer oral antihypertensive medication with sips of water to lower the BP gradually
  - correct: `['A', 'B', 'C', 'D']`

- **`gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_q5`** (select_all) — EN stem: "At Stage 3, 45 minutes after neuro-ICU arrival, the client becomes drowsy, stops following commands, has no verbal output, and develops a new sluggish left pupil. Which actions should the nurse take immediately? Select all that apply."
  - options: D=Perform and document a rapid focused neurologic assessment compared with the post-procedure baseline; F=Let the client rest until the next scheduled neurologic check because fatigue is expected after the procedure; E=Continue close BP monitoring while emergency treatment is initiated; B=Prepare for emergent non-contrast CT head; C=Maintain airway patency and prepare for possible intubation; A=Notify the neurointerventionalist and neurology team stat
  - correct: `['A', 'B', 'C', 'D', 'E']`

Full text of `q1` (Flag 1 — the matrix row r5 concern):

```json
{
  "id": "gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_q1",
  "itemType": "matrix",
  "category": "Reduction of Risk Potential",
  "topic": "Laboratory & Diagnostic Tests",
  "difficulty": "hard",
  "ngnSkill": "recognize_cues",
  "stem": {
    "en": "At Stage 1, classify each assessment finding as consistent with the suspected left MCA stroke syndrome or normal/unrelated to that syndrome.",
    "zh": "在阶段 1，将每项评估发现分类为符合疑似左侧 MCA 卒中综合征，或属于正常/与该综合征无关。"
  },
  "matrix": {
    "rows": [
      {
        "id": "r1",
        "en": "Right arm and right leg weakness, with the arm more affected",
        "zh": "右臂和右腿无力，且右臂受累更重"
      },
      {
        "id": "r2",
        "en": "Expressive aphasia with impaired repetition",
        "zh": "表达性失语并伴复述受损"
      },
      {
        "id": "r3",
        "en": "Right lower facial droop",
        "zh": "右下脸下垂"
      },
      {
        "id": "r4",
        "en": "Forced leftward gaze preference",
        "zh": "强迫性向左凝视偏斜"
      },
      {
        "id": "r5",
        "en": "Irregularly irregular heart rhythm with atrial fibrillation history",
        "zh": "心律绝对不规则且有房颤病史"
      },
      {
        "id": "r6",
        "en": "Full strength in the left arm and left leg",
        "zh": "左臂和左腿肌力正常"
      },
      {
        "id": "r7",
        "en": "Equal, reactive 3-mm pupils on arrival",
        "zh": "到达时双侧 3 mm 瞳孔等大且对光反应存在"
      },
      {
        "id": "r8",
        "en": "Clear lung sounds and normal troponin",
        "zh": "肺音清且肌钙蛋白正常"
      }
    ],
    "columns": [
      {
        "id": "c2",
        "en": "Normal or unrelated to this stroke syndrome",
        "zh": "正常或与该卒中综合征无关"
      },
      {
        "id": "c1",
        "en": "Consistent with left MCA stroke/cardioembolic mechanism",
        "zh": "符合左侧 MCA 卒中/心源性栓塞机制"
      }
    ],
    "selectionMode": "single_per_row"
  },
  "correct": [
    {
      "rowId": "r1",
      "columnIds": [
        "c1"
      ]
    },
    {
      "rowId": "r2",
      "columnIds": [
        "c1"
      ]
    },
    {
      "rowId": "r3",
      "columnIds": [
        "c1"
      ]
    },
    {
      "rowId": "r4",
      "columnIds": [
        "c1"
      ]
    },
    {
      "rowId": "r5",
      "columnIds": [
        "c1"
      ]
    },
    {
      "rowId": "r6",
      "columnIds": [
        "c2"
      ]
    },
    {
      "rowId": "r7",
      "columnIds": [
        "c2"
      ]
    },
    {
      "rowId": "r8",
      "columnIds": [
        "c2"
      ]
    }
  ],
  "rationale": {
    "correct": {
      "en": "Right hemiplegia, expressive aphasia, right lower facial droop, and left gaze preference localize to a dominant left MCA cortical stroke. Atrial fibrillation and sudden onset support a cardioembolic mechanism. Intact left-sided strength, initially equal reactive pupils, clear lungs, and a normal troponin do not explain the focal left MCA syndrome.",
      "zh": "右侧偏瘫、表达性失语、右下脸下垂和向左凝视偏斜定位于优势半球左侧 MCA 皮质性卒中。房颤和突发起病支持心源性栓塞机制。左侧肌力完整、初始瞳孔等大且有反应、肺音清和肌钙蛋白正常，不能解释这个局灶性左侧 MCA 综合征。"
    },
    "byChoice": [
      {
        "refId": "r1",
        "en": "Contralateral motor weakness, especially arm-predominant weakness, fits MCA motor-cortex involvement.",
        "zh": "对侧运动无力，尤其上肢更重，符合 MCA 运动皮质受累。"
      },
      {
        "refId": "r2",
        "en": "Expressive aphasia with impaired repetition is a dominant-hemisphere cortical sign.",
        "zh": "表达性失语伴复述受损是优势半球皮质受累表现。"
      },
      {
        "refId": "r3",
        "en": "Right lower facial droop fits a left cortical motor lesion affecting the contralateral lower face.",
        "zh": "右下脸下垂符合左侧皮质运动区病灶影响对侧下脸。"
      },
      {
        "refId": "r4",
        "en": "Acute gaze preference toward the left fits involvement of the left frontal eye field.",
        "zh": "急性向左凝视偏斜符合左侧额眼区受累。"
      },
      {
        "refId": "r5",
        "en": "Atrial fibrillation is a major risk factor for cardioembolic stroke and supports the mechanism, even though it is not a focal neurologic deficit.",
        "zh": "房颤是心源性栓塞性卒中的重要危险因素，支持该机制；但它本身不是局灶神经缺损。"
      },
      {
        "refId": "r6",
        "en": "Normal strength on the left is expected because the left MCA lesion produces right-sided motor findings.",
        "zh": "左侧肌力正常是预期的，因为左侧 MCA 病灶产生右侧运动表现。"
      },
      {
        "refId": "r7",
        "en": "Equal reactive pupils on arrival are not part of the initial MCA ischemic syndrome; later pupil asymmetry would be a deterioration cue.",
        "zh": "到达时瞳孔等大且有反应不是初始 MCA 缺血综合征的一部分；之后出现瞳孔不对称才是恶化线索。"
      },
      {
        "refId": "r8",
        "en": "Clear lungs and a normal troponin are useful baseline findings, but they are not findings of the left MCA stroke syndrome.",
        "zh": "肺音清和肌钙蛋白正常是有用的基线资料，但不是左侧 MCA 卒中综合征的表现。"
      }
    ]
  },
  "testTakingStrategy": {
    "en": "Localize neurologic findings first. Cortical signs such as aphasia and gaze preference help distinguish a large-territory stroke from unrelated normal assessment data.",
    "zh": "先定位神经系统发现。失语和凝视偏斜等皮质体征有助于把大血管供血区卒中与无关的正常评估资料区分开。"
  },
  "glossary": [
    {
      "termEn": "MCA",
      "termZh": "大脑中动脉",
      "defZh": "供应外侧大脑半球的重要动脉，受累时常出现对侧脸臂无力和语言障碍。"
    },
    {
      "termEn": "Expressive aphasia",
      "termZh": "表达性失语",
      "defZh": "理解相对保留但说话费力、词语错误或无法流利表达的语言障碍。"
    },
    {
      "termEn": "Gaze preference",
      "termZh": "凝视偏斜",
      "defZh": "眼睛偏向一侧，急性大脑半球卒中时常偏向病灶侧。"
    }
  ]
}
```

Full text of `q6` (Flag 2 — the option D consistency concern):

```json
{
  "id": "gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_q6",
  "itemType": "select_all",
  "category": "Reduction of Risk Potential",
  "topic": "Laboratory & Diagnostic Tests",
  "difficulty": "hard",
  "ngnSkill": "evaluate_outcomes",
  "stem": {
    "en": "At Stage 4, the CT confirms intracerebral hemorrhage with midline shift. The client is intubated, reversal is ordered, and nicardipine is being titrated to the provider's stat BP target. Which parameters are the priority bedside indicators of stabilization or continued deterioration? Select all that apply.",
    "zh": "在阶段 4，CT 确认脑实质内出血并有中线移位。患者已插管，已医嘱逆转抗凝，nicardipine 正在滴定至医师紧急血压目标。哪些参数是床旁判断稳定或继续恶化的优先指标？选择所有适用项。"
  },
  "options": [
    {
      "id": "B",
      "en": "Systolic BP trend and response to the nicardipine infusion",
      "zh": "收缩压趋势及对 nicardipine 输注的反应"
    },
    {
      "id": "E",
      "en": "Appearance of the right groin dressing as the main marker of intracranial hemorrhage stability",
      "zh": "以右腹股沟敷料外观作为颅内出血稳定性的主要指标"
    },
    {
      "id": "D",
      "en": "Serial troponin levels because the initial rhythm was atrial fibrillation",
      "zh": "因初始心律为房颤而连续监测肌钙蛋白"
    },
    {
      "id": "C",
      "en": "NIHSS score as the primary tool while the client is intubated and nonverbal",
      "zh": "患者已插管且不能说话时，以 NIHSS 作为主要工具"
    },
    {
      "id": "A",
      "en": "Serial neurologic examination: GCS, pupil size/reactivity, and motor response",
      "zh": "连续神经检查：GCS、瞳孔大小/反应和运动反应"
    }
  ],
  "correct": [
    "A",
    "B"
  ],
  "rationale": {
    "correct": {
      "en": "In acute intracerebral hemorrhage with mass effect, the most actionable bedside indicators are serial neurologic status and BP response. Worsening GCS, fixed or enlarging pupil, or worsening motor response suggests expanding hematoma or rising ICP. Uncontrolled systolic BP can drive hematoma expansion, so response to the nicardipine target must be tracked. NIHSS is less useful in an intubated nonverbal client; troponin and the clean groin site do not evaluate the intracranial hemorrhage.",
      "zh": "急性脑实质内出血伴占位效应时，最有行动价值的床旁指标是连续神经状态和血压反应。GCS 恶化、瞳孔固定或扩大、运动反应恶化提示血肿扩大或 ICP 升高。收缩压控制不佳会推动血肿扩大，因此必须追踪对 nicardipine 目标的反应。NIHSS 对已插管、不能说话的患者用处较小；肌钙蛋白和清洁的腹股沟穿刺部位不能评估颅内出血。"
    },
    "byChoice": [
      {
        "refId": "D",
        "en": "Troponin may be relevant if acute coronary syndrome is suspected, but it does not indicate whether the intracranial hemorrhage is stabilizing.",
        "zh": "若怀疑急性冠脉综合征，肌钙蛋白可能相关，但它不能判断颅内出血是否稳定。"
      },
      {
        "refId": "B",
        "en": "The ordered BP goal is a modifiable factor; failure to achieve it requires escalation.",
        "zh": "医嘱血压目标是可干预因素；达不到目标需要升级处理。"
      },
      {
        "refId": "E",
        "en": "Groin checks remain part of post-procedure care, but dressing appearance is not the main marker of intracranial hematoma stability.",
        "zh": "腹股沟检查仍是术后护理的一部分，但敷料外观不是颅内血肿稳定性的主要标志。"
      },
      {
        "refId": "C",
        "en": "NIHSS was useful during the ischemic-stroke phase, but intubation and absent speech make it less reliable than GCS, pupils, and motor response for this ICH emergency.",
        "zh": "NIHSS 在缺血性卒中阶段有用，但插管和无语言使其在此 ICH 急症中不如 GCS、瞳孔和运动反应可靠。"
      },
      {
        "refId": "A",
        "en": "This is the most sensitive bedside trend for increasing ICP, hematoma expansion, and neurologic decline.",
        "zh": "这是床旁发现 ICP 升高、血肿扩大和神经恶化最敏感的趋势指标。"
      }
    ]
  },
  "testTakingStrategy": {
    "en": "For evaluation questions, choose parameters that change management in real time. In ICH, bedside neuro trends and BP control are more actionable than unrelated labs or earlier stroke scales.",
    "zh": "做评估结果题时，选择能实时改变处理的参数。ICH 中，床旁神经趋势和血压控制比无关化验或较早阶段使用的卒中量表更有行动价值。"
  },
  "glossary": [
    {
      "termEn": "Hematoma expansion",
      "termZh": "血肿扩大",
      "defZh": "出血范围继续增加，可导致神经状态恶化和颅内压升高。"
    },
    {
      "termEn": "Midline shift",
      "termZh": "中线移位",
      "defZh": "脑组织因出血或水肿受压而偏离正常中线位置。"
    },
    {
      "termEn": "ICP",
      "termZh": "颅内压",
      "defZh": "颅腔内压力，升高时可导致意识下降、瞳孔改变和脑疝风险。"
    }
  ]
}
```


---

## Part B — Claude Code meta-assessment task (run after Gemini's output is returned)

This is a handoff for a **separate Claude Code session**, run once Luke has Gemini's output in hand. Do not skip straight to grading Gemini's work — form an independent view first, then cross-check.

### Step 1 — Independent review (form this before reading Gemini's output)

Re-pull all 7 items live via `fsmcp` (do not reuse the JSON snapshot in Part A — it may be stale). Run the same four-point checklist from Part A yourself: clinical accuracy, fairness/inferability, bilingual parity, visual necessity. Explicitly resolve Flags 1-3 above with your own reasoning and your own verbatim EN+ZH quotes before looking at Gemini's answer for the same item.

### Step 2 — Gate Gemini's output against the standing quality bar

Per `DECISIONS.md`'s Gemini-demotion note, a Gemini finding is **auto-rejected to human review regardless of its stated verdict** if any of:

- `reasoning` is interchangeable with another item's `reasoning` in the same batch (the Phase B failure mode — templated boilerplate).
- `evidence_en` / `evidence_zh` are missing, paraphrased instead of verbatim, or don't actually appear in the live item text when you check.
- The reconciliation doesn't engage with the specific clinical rule at stake for that item (e.g., a pacer item's finding, or the necessity question for the two exhibit conversions).

Items that fail this gate go to `needs-human-clinical-review` in your Step 3 output **even if you happen to independently agree with Gemini's verdict** — the point is Gemini's reasoning has to hold up on its own, not just land on the right answer.

### Step 3 — Reconcile per item

For each of the 7 items, produce:

| id | your verdict | Gemini verdict | Gemini gate-passed? | final disposition |
|---|---|---|---|---|

`final disposition` is one of: `content-reviewed` (you and gate-passed Gemini agree, no changes needed), `fixed-and-validated` (agree, minor fix applied — state the fix), or `needs-human-clinical-review` (disagreement, gate failure, or genuine ambiguity — route to Luke, do not close out).

### Step 4 — Lane-quality meta-assessment (this is the actual ask)

Produce a short verdict on Gemini's performance as a reviewer on this batch, in the same spirit as the Phase B architect handoff (`Archive/root-cleanup-2026-06-26/CLAUDE-ARCHITECT-GEMINI-AUDIT-QUALITY-HANDOFF-2026-06-26.md`): did Gemini's reconciliations hold up as self-verifying and item-specific, or repeat the templated pattern? This is a **data point for Luke**, not a policy change — do not revise `DECISIONS.md`'s standing "inherent mistrust of Gemini for any audit role" position yourself. State the finding plainly (n=7 is small; say so) and let Luke decide whether it updates anything.

### Step 5 — Deliverables

- A written report, `GEMINI-PACEMAKER-BUCKET1B-META-ASSESSMENT-<date>.md`, in the repo root, containing Steps 1-4.
- **Do not edit any canonical bank file directly from this pass.** If a fix is warranted (e.g., a bilingual typo, or rewriting `r5` if Flag 1 confirms it's a residual narration leak), stage it as a proposed patch in the report for Luke to approve, the same way the Phase A coherence-polish patch was proposed before being applied — this is content correctness, which stays outside the same-model-fixes-its-own-flag loop.
- Update `BANK-REVIEW-LEDGER.md` only for items with `final disposition` of `content-reviewed` or `fixed-and-validated`; leave `needs-human-clinical-review` items out of the ledger's reviewed-status claim until Luke closes them out.
