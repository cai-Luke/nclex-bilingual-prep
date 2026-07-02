# Litigation Packet — `gpt_deepen_2026_06_22_bow_12` Rhythm-Strip Conversion

Date: 2026-07-01
Purpose: standalone, self-contained context for adjudicating one open content question. Written so it does not depend on live repo access — treat every fact below as the live snapshot as of this date; do not assume a GitHub mirror is current.

**Routing note (read first):** this item's ID prefix (`gpt_`) means it was produced by a GPT-lane generation pass — see `DECISIONS.md` principle 21, which documents "GPT deepen round 3" as the batch this item's naming pattern matches. Per `DECISIONS.md` principle 2 ("the producer is never the checker"), **do not route this adjudication to a GPT session** — that would be the producer reviewing its own output. This is not the same situation as the Opus-skeleton carve-out (principle 22): that exception applies only because Opus's contribution is stripped to prose before GPT does the actual clinical compilation, making GPT the sole real producer. Here GPT is unambiguously both author and compiler of this exact item, so no such carve-out applies. Route this to Claude or a human reviewer instead.

## The question

Should `gpt_deepen_2026_06_22_bow_12` be converted from a text-only `dropdown_cloze` item to one carrying a `rhythm_strip` visual (rhythm: `pvc`), per the Bucket 1B narration-debt conversion pattern already used on 4 other items in this repo? Placement is no longer the blocker (a separate, already-approved spec widens `rhythm_strip`'s allowed item types to include `dropdown_cloze`). The only open question is whether the conversion would satisfy the project's necessity rule, or whether it would be a decorative visual attached to already-fully-determined content.

## Governing rules (verbatim from the live repo)

**Principle 6, `DECISIONS.md`:** *"Every visual renders locally from inspectable structured data... A visual whose removal leaves the answer unchanged is decorative and therefore invalid."*

**Common Visual Rules, `NCLEX-Question-Schema.md`:** *"Determinacy (Load-bearing): A visual item is only valid if the answer is only resolvable through the combination of stem + visual + answer choices. If removing the visual leaves the answer unchanged, the visual is decorative and the item is invalid."*

**Content Rewrite Rule, `rhythm-strip-pacemaker-overlay-codex-spec.md`:** *"The visual must carry the finding; the stem must not state it... Rationale may state the finding after grading."* Applied to the Bucket 1B addendum: *"Principle 6 stays intact only if every conversion includes a stem rewrite that removes the narrated finding. Adding a strip next to an unchanged stem would be genuinely decorative."*

**The shape/label line, same addendum:** *"A bare diagnosis name... has nothing to mentally construct — converting it would mean inventing rate/morphology detail not present in the original item, which is fabrication, not backfill. A narrated shape — irregularity, a rate tied to an event, wide/bizarre complexes, absent P waves, frequency of an ectopic beat — is the actual 'I have to visualize this' trigger and is what qualifies."* `gpt_deepen_2026_06_22_bow_12` was originally flagged as a shape-narration candidate specifically because "frequent" (a frequency descriptor on the PVCs) is present, not just the bare label "PVCs."

## The live item, in full

```json
{
  "id": "gpt_deepen_2026_06_22_bow_12",
  "itemType": "dropdown_cloze",
  "category": "Pharmacological and Parenteral Therapies",
  "topic": "Cardiovascular & Endocrine Medications",
  "difficulty": "medium",
  "ngnSkill": "analyze_cues",
  "stem": {
    "en": "A client with heart failure takes furosemide daily. The client reports muscle cramps and weakness. The cardiac monitor shows frequent premature ventricular contractions. Laboratory results show potassium 2.9 mEq/L.",
    "zh": "一名心力衰竭患者每天服用呋塞米。患者报告肌肉痉挛和乏力。心电监护显示频发室性早搏。实验室结果显示钾 2.9 mEq/L。"
  },
  "rationale": {
    "correct": {
      "en": "Furosemide can contribute to hypokalemia, which increases dysrhythmia risk. The nurse should notify the provider and prepare to administer prescribed potassium replacement, while monitoring potassium and cardiac rhythm.",
      "zh": "呋塞米可导致低钾，增加心律失常风险。护士应通知医嘱提供者，并准备按医嘱给予补钾，同时监测钾水平和心律。"
    },
    "byChoice": [
      { "refId": "action.a1", "en": "Notifying the provider and preparing prescribed potassium replacement addresses symptomatic hypokalemia with dysrhythmia risk.", "zh": "通知医嘱提供者并准备按医嘱补钾，可处理伴心律失常风险的症状性低钾。" },
      { "refId": "action.a2", "en": "Giving an extra dose of furosemide may worsen potassium loss.", "zh": "额外给予呋塞米可能加重钾丢失。" },
      { "refId": "action.a3", "en": "Restricting potassium-rich foods does not address the low potassium and may worsen the deficit.", "zh": "限制富含钾的食物不能处理低钾，可能加重缺乏。" },
      { "refId": "parameter.p1", "en": "Serum potassium and cardiac rhythm directly track the complication and its risk.", "zh": "血清钾和心律直接追踪该并发症及其风险。" },
      { "refId": "parameter.p2", "en": "ANC and temperature monitor infection risk, not loop-diuretic-related hypokalemia.", "zh": "ANC 和体温监测感染风险，而不是袢利尿剂相关低钾。" },
      { "refId": "parameter.p3", "en": "Serum phosphate and respiratory effort are more central to refeeding shifts than this furosemide-related potassium deficit.", "zh": "血清磷和呼吸用力更侧重再喂养转移，而不是此处呋塞米相关钾缺乏。" }
    ]
  },
  "testTakingStrategy": {
    "en": "Loop diuretics can waste potassium. When low potassium appears with ventricular ectopy, connect the lab to the rhythm change and choose escalation plus prescribed replacement.",
    "zh": "袢利尿剂会导致钾丢失。低钾伴室性异位搏动时，要把实验室结果和心律变化联系起来，选择升级处理并按医嘱补充。"
  },
  "glossary": [
    { "termEn": "Furosemide", "termZh": "呋塞米", "defZh": "一种袢利尿剂，可增加尿钾丢失。" },
    { "termEn": "Premature ventricular contraction", "termZh": "室性早搏", "defZh": "提前出现的室性搏动，在存在电解质异常时更值得关注。" }
  ],
  "clozeStem": {
    "en": "The nurse should {{action}} and monitor {{parameter}}.",
    "zh": "护士应{{action}}，并监测{{parameter}}。"
  },
  "dropdowns": [
    {
      "id": "action",
      "options": [
        { "id": "a1", "en": "notify the provider and prepare prescribed potassium replacement", "zh": "通知医嘱提供者，并准备按医嘱补钾" },
        { "id": "a2", "en": "give an extra dose of furosemide", "zh": "额外给予一剂呋塞米" },
        { "id": "a3", "en": "teach the client to restrict potassium-rich foods", "zh": "指导患者限制富含钾的食物" }
      ],
      "correct": "a1"
    },
    {
      "id": "parameter",
      "options": [
        { "id": "p2", "en": "absolute neutrophil count and temperature", "zh": "绝对中性粒细胞计数和体温" },
        { "id": "p3", "en": "serum phosphate and respiratory effort", "zh": "血清磷和呼吸用力" },
        { "id": "p1", "en": "serum potassium and cardiac rhythm", "zh": "血清钾和心律" }
      ],
      "correct": "p1"
    }
  ]
}
```

## Claude's read (a position to stress-test, not a settled verdict)

Both dropdown answers look justifiable from the hypokalemia + symptoms alone, without needing to know PVCs are specifically present:

- **`action` = a1** (notify provider, prepare K+ replacement) follows from symptomatic hypokalemia (cramps, weakness, K 2.9 on a loop diuretic) on its own. Nothing about a2 (extra furosemide, wrong direction) or a3 (restrict K+ foods, wrong direction and wrong urgency) depends on knowing about ectopy.
- **`parameter` = p1** (serum potassium + cardiac rhythm) is justified in the rationale by general dysrhythmia *risk* from hypokalemia ("Furosemide can contribute to hypokalemia, which increases dysrhythmia risk"), not by the already-observed PVCs specifically. p2 (infection markers) and p3 (refeeding-related, a mismatched template distractor) are wrong regardless of whether PVCs are mentioned at all.

If that's correct, converting this item and trimming "frequent premature ventricular contractions" from the stem per the Content Rewrite Rule would leave both blanks answerable unchanged — the visual would be decorative, failing principle 6 as currently constructed. Making it genuinely load-bearing would likely require touching the distractor set itself (e.g., a parameter option that's only wrong once you know ectopy is already present, or an action option that's only wrong given confirmed PVCs specifically) — which is content editing, not a presentation conversion, and would need to go through the normal author → review → promote pipeline rather than landing as a mechanical stem-trim like the other 4 Bucket 1B conversions.

## What's being asked of the reviewer

1. Confirm or refute the necessity read above, with your own reasoning against the actual item text — not a general take on PVCs and hypokalemia.
2. If you conclude it's genuinely load-bearing as-is (i.e. Claude's read above is wrong), say specifically which distractor's wrongness actually depends on the PVC finding, quoting the relevant `byChoice` text.
3. If you conclude it's decorative as currently written, say whether a minimal, specific distractor edit would fix it (propose the edit) or whether this item should just stay text like `gemini_backfill_or_cardio_01` and `gemini_c10_07`.
4. This is adjudication only. Do not edit any canonical bank file. If a content fix is proposed, it still needs to go through the standard pipeline (author → compile/fact-check → review → Claude's final promotion gate per `DECISIONS.md` principle 8/18) before it can land.
