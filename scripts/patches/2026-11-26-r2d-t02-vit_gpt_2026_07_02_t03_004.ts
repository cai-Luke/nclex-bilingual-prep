// D-2 T02, unit 14. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "vit_gpt_2026_07_02_t03_004";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "现在可以按原剂量恢复 opioid，因为 oxygen saturation 已恢复正常。",
    after: "由于血氧饱和度已恢复正常，现在可以按原剂量恢复使用阿片类药物。",
  }),
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "患者对 naloxone 无反应，因为 heart rate 略有上升。",
    after: "由于心率略有上升，判断患者对纳洛酮无反应。",
  }),
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "患者需要立即 chest compressions，因为最初 respiratory rate 为 6/min。",
    after: "由于最初呼吸频率为 6 次/分，患者现在需要立即接受胸外按压。",
  }),
  setValue({
    id, path: ["options", {"id":"A"}, "zh"],
    before: "患者 ventilation 和 oxygenation 改善，但仍需继续监测是否出现 recurrent respiratory depression。",
    after: "患者的通气和氧合已有改善，但仍需继续监测呼吸抑制是否复发。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "HR 小幅上升不能否定 ventilation 和 oxygen saturation 改善。",
    after: "心率略有上升并不能否定通气和血氧饱和度的改善。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "初始 RR 很危险，但治疗后的连续趋势显示改善，而不是 cardiac arrest。",
    after: "最初的呼吸频率低至危险水平，但治疗后的连续变化提示病情改善，并不提示心搏骤停。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "逆转后 SpO2 正常，并不意味着无需重新评估和监测就可恢复原 opioid 剂量。",
    after: "逆转阿片类药物作用后，即使 SpO2 正常，也不能在未经重新评估和监测的情况下安全地恢复原剂量。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "给予 naloxone 后，RR 从严重偏低升至成人范围，SpO2 从 84% 改善到 96%。趋势支持有效反应，但 naloxone 的作用时间可能短于某些 opioids，因此仍需继续观察。",
    after: "给予纳洛酮后，呼吸频率从严重偏低升至成人正常范围，SpO2 从 84% 升至 96%，提示治疗有效。但纳洛酮的作用可能比某些阿片类药物更早消退，因此仍需持续监测。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名成人术后患者接受 IV morphine 后变得难以唤醒。time 0 时给予 naloxone。护士查看生命体征趋势。哪项评价最合适？",
    after: "一名成人术后患者静脉使用吗啡后变得难以唤醒，在时间点 0 给予纳洛酮。护士查看生命体征趋势后，应如何评价治疗效果？",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "response-to-intervention 题要比较治疗前后。改善不等于风险消失；要想到药物作用时间和复发。",
    after: "评价干预效果时，应比较治疗前后的变化。病情改善并不一定表示风险已经解除，还需考虑药物作用持续时间以及症状复发的可能性。",
  }),
];

runPatch(ops);
