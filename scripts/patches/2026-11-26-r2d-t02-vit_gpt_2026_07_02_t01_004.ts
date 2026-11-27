// D-2 T02, unit 02. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "vit_gpt_2026_07_02_t01_004";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "因为 15 分钟时 respiratory rate 高于 18/min，所以 bolus 导致 fluid overload。",
    after: "15 分钟时呼吸频率高于 18 次/分，说明快速输注导致了液体过负荷。",
  }),
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "根据趋势，患者正在恶化为 shock，需要立即升级处理。",
    after: "生命体征趋势提示患者正恶化为休克，需要立即升级处理。",
  }),
  setValue({
    id, path: ["options", {"id":"A"}, "zh"],
    before: "患者 fluid replacement 后 perfusion 改善；继续监测并重新评估尿量。",
    after: "补液后患者灌注改善，应继续监测并重新评估尿量。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "15 分钟 RR 为 24 不足以诊断 overload，尤其整体趋势改善且 oxygenation 稳定。",
    after: "15 分钟时呼吸频率为 24 次/分，但整体趋势改善，氧合稳定，单凭这次读数不足以诊断液体过负荷。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "这是正确的，因为连续趋势显示 fluid replacement 后 perfusion 改善。",
    after: "此项正确。连续测量结果提示补液后灌注改善。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "若 HR、RR 和 MAP 恶化才支持 shock 升级处理，但此趋势随时间改善。",
    after: "若心率、呼吸频率和平均动脉压的变化提示病情恶化，则应按休克升级处理。本例的生命体征随时间推移而改善。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "趋势显示 isotonic bolus 后 HR 和 RR 下降，SBP 和 MAP 上升。这支持 intravascular volume 和 perfusion 改善，应继续监测，而不是自动升级或重复 bolus。",
    after: "快速输注等渗液体后，心率和呼吸频率下降，收缩压和平均动脉压上升。这些变化提示血管内容量和灌注改善，应继续监测，无需一律升级处理或再次快速输液。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名成人患者因 gastroenteritis 导致 dehydration，按医嘱接受 1 liter 0.9% sodium chloride bolus。护士查看 bolus 后的生命体征趋势。护士应如何解读该反应？",
    after: "一名成人患者因胃肠炎脱水，按医嘱快速静脉输注 1 升 0.9% 氯化钠溶液。护士查看快速输注后的生命体征趋势，应如何判断患者的反应？",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "遇到 intervention 题，要判断趋势是朝正常 perfusion 方向走，还是远离正常。不要只看干预后的第一个时间点。",
    after: "判断干预效果时，应观察灌注是在逐渐恢复正常，还是进一步偏离正常。避免仅根据干预后的第一个测量值作判断。",
  }),
];

runPatch(ops);
