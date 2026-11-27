// D-2 T02, unit 13. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "vit_gpt_2026_07_02_t03_003";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"A"}, "zh"],
    before: "由于 gastrointestinal blood loss，compensated hypovolemic shock 正在向 decompensation 进展。",
    after: "胃肠道失血所致的低血容量性休克正在由代偿期向失代偿期发展。",
  }),
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "opioid-induced respiratory depression 是优先解释。",
    after: "应首先考虑阿片类药物引起的呼吸抑制。",
  }),
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "该趋势最符合疼痛相关 anxiety，因为 oxygen saturation 仍可接受。",
    after: "由于血氧饱和度仍在可接受范围内，这一趋势最符合疼痛引起的焦虑。",
  }),
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "患者正在好转，因为 systolic blood pressure 到最后一次之前都保持在 90 mm Hg 以上。",
    after: "患者正在好转，因为除最后一次读数外，收缩压始终高于 90 mm Hg。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "opioid-induced respiratory depression 更可能出现 RR 降低，而不是 RR 上升并伴随低血容量线索。",
    after: "阿片类药物引起的呼吸抑制更常表现为呼吸频率降低，本例则是呼吸频率上升并伴有低血容量的表现。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "anxiety 可以使 HR 上升，但不能解释 SBP 和 MAP 持续下降以及 pulse pressure 变窄。",
    after: "焦虑可使心率升高，但不能解释收缩压和平均动脉压持续下降、脉压逐渐缩小。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "这符合出血背景以及 perfusion 变差、pulse pressure 变窄的趋势。",
    after: "这一判断符合患者的出血表现，也与灌注恶化和脉压缩小的趋势一致。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "这题必须比较连续读数：患者有 melena 和站立 dizziness，同时 HR 上升、SBP 和 MAP 下降、RR 上升、pulse pressure 变窄。最符合 gastrointestinal bleeding 导致的 hypovolemia 进展。",
    after: "患者有黑便和体位性症状。比较连续测得的生命体征可见，心率和呼吸频率上升，收缩压和平均动脉压下降，脉压缩小。这最符合胃肠道出血引起的低血容量正在加重。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名成人患者因 black, tarry stools 和站立时 dizziness 入院。患者否认静息时 chest pain 或 shortness of breath。护士查看生命体征趋势。哪项解释最符合该趋势？",
    after: "一名成人患者因排黑色柏油样便、站立时头晕入院，否认静息时有胸痛或气促。护士查看生命体征趋势后，哪项判断最符合这些变化？",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "shock 可在出现明显低血压前开始。要追踪代偿：HR 和 RR 上升、pulse pressure 变窄，比早期某一次 SBP 还可以更重要。",
    after: "在测得一次明显偏低的血压之前，休克就可能已经发生。应追踪代偿表现：心率和呼吸频率上升并伴脉压缩小，比早期一次尚可的收缩压读数更有意义。",
  }),
];

runPatch(ops);
