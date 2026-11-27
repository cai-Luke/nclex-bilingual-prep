// D-2 T02, unit 01. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "vit_gpt_2026_07_02_t01_003";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["matrix", "rows", {"id":"r1"}, "zh"],
    before: "建立或维持 large-bore IV access，并按医嘱准备 isotonic fluid replacement。",
    after: "建立或维持大口径静脉通路，并按医嘱准备使用等渗液体补液。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r2"}, "zh"],
    before: "在重新评估 perfusion 时，让患者卧床并采取 fall precautions。",
    after: "重新评估灌注情况期间，让患者卧床并采取防跌倒措施。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r3"}, "zh"],
    before: "因为前 4 小时 systolic pressure 高于 100 mm Hg，延后通知 provider。",
    after: "由于前 4 小时的收缩压高于 100 mm Hg，暂缓通知诊疗人员。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r4"}, "zh"],
    before: "因为 heart rate 上升，请求 antihypertensive。",
    after: "由于心率上升，请求开具降压药。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r1"}, "zh"],
    before: "合适。趋势支持 volume depletion 恶化，因此 IV access 和 isotonic fluids 是预期优先事项。",
    after: "合适。趋势提示血容量不足正在加重，应优先确保静脉通路并给予等渗液体。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r2"}, "zh"],
    before: "合适。压力下降、脉搏上升会增加 dizziness、syncope 和 falls 风险。",
    after: "合适。血压下降、脉搏加快会增加头晕、晕厥和跌倒的风险。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r3"}, "zh"],
    before: "不合适。早期 systolic 数值不能抵消后续下降趋势和 pulse pressure 变窄。",
    after: "不合适。即使早期收缩压较高，也不能忽视随后血压下降、脉压差缩小的趋势。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r4"}, "zh"],
    before: "不合适。tachycardia 是代偿反应；在处理 perfusion 前只压低数字不安全。",
    after: "不合适。心动过速是代偿反应。在处理灌注不足之前，仅针对心率升高给予治疗并不安全。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "趋势显示脱水患者 HR 和 RR 上升，同时 SBP/MAP 下降、pulse pressure 变窄。这提示 compensated hypovolemic shock 正在向 decompensation 发展，因此需要容量支持、安全措施和升级沟通。",
    after: "脱水患者的心率和呼吸频率上升，收缩压和平均动脉压下降，脉压差缩小。这提示低血容量性休克正从代偿期向失代偿期发展，宜补充血容量、采取安全措施并及时上报以升级处理。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名成人患者 vomiting 和 diarrhea 已持续数小时，口腔黏膜干燥。尚未开始 IV fluids。请根据生命体征趋势判断每项护理措施。",
    after: "一名成人患者已呕吐、腹泻数小时，黏膜干燥，尚未开始静脉补液。请根据生命体征趋势判断各项护理措施是否合适。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "先看代偿：HR 往往在 blood pressure 明显下降前上升。pulse pressure 变窄让这个趋势比单个血压值更令人担心。",
    after: "先看代偿表现：心率可在血压明显下降之前升高。与单看一次血压读数相比，连续测量显示脉压差缩小更值得警惕。",
  }),
];

runPatch(ops);
