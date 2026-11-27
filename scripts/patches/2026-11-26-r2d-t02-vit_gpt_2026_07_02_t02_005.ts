// D-2 T02, unit 09. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "vit_gpt_2026_07_02_t02_005";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "按医嘱给予或调整 oxygen，并继续密切监测 SpO2。",
    after: "按医嘱开始或调整氧疗，并继续密切监测 SpO2。",
  }),
  setValue({
    id, path: ["options", {"id":"A"}, "zh"],
    before: "通知 provider 或 rapid response team，因为趋势提示 shock 正在恶化。",
    after: "由于趋势提示休克正在恶化，通知诊疗人员或快速反应团队。",
  }),
  setValue({
    id, path: ["options", {"id":"E"}, "zh"],
    before: "评估 perfusion、lung sounds 和 urine output，同时准备执行医嘱的 cardiac support therapies。",
    after: "评估灌注情况、肺部呼吸音和尿量，同时为按医嘱实施心脏支持治疗做好准备。",
  }),
  setValue({
    id, path: ["options", {"id":"F"}, "zh"],
    before: "鼓励口服液体以改善血压，因为 oxygen level 只是轻度偏低。",
    after: "由于血氧水平仅略低，鼓励患者口服补液以改善血压。",
  }),
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "快速给予 1 L isotonic fluid bolus，因为所有 shock 状态都应先大量补液。",
    after: "快速静脉输注 1 L 等渗液体，因为所有类型的休克都应首先大量补液。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "这个趋势不能仅常规观察，因为 perfusion 和 oxygenation 都在恶化。",
    after: "灌注和氧合均在恶化，仅按常规观察并不安全。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"E"}, "zh"],
    before: "这是正确的，因为 cardiogenic shock 需要密切评估 perfusion 和 respiratory status，同时准备 definitive therapies。",
    after: "此项正确。心源性休克患者在准备针对病因的治疗期间，需要密切评估灌注和呼吸状况。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "大量补液并非自动合适；acute MI 背景下 crackles 和 SpO2 下降提示 cardiogenic pulmonary congestion 风险。",
    after: "不能对所有患者一律大量补液。急性心肌梗死患者出现湿啰音并伴 SpO2 下降，需警惕心源性肺淤血。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "这是正确的，因为连续读数显示 hemodynamic 和 respiratory 状况都在恶化。",
    after: "此项正确。连续测量结果表明，血流动力学和呼吸状况均在恶化。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"F"}, "zh"],
    before: "口服液体不能处理正在恶化的 oxygenation；有 crackles 提示 pulmonary congestion 时还可能不安全。",
    after: "口服补液不能纠正正在恶化的氧合；当湿啰音提示肺淤血时，口服补液还可能有危险。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "在 acute MI 且出现新 crackles 的背景下，MAP/SBP 下降、HR/RR 上升、SpO2 下降的趋势提示 cardiogenic shock 或 acute heart failure 恶化。护士应升级处理、支持 oxygenation，并评估 perfusion，同时准备执行医嘱的 cardiac therapies。",
    after: "急性心肌梗死患者新出现湿啰音，同时平均动脉压和收缩压下降、心率和呼吸频率上升、SpO2 下降，提示可能发生心源性休克或急性心力衰竭加重。护士应升级处理、支持氧合、评估灌注，并做好按医嘱实施心脏治疗的准备。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名因 acute myocardial infarction 入院的成人患者报告 shortness of breath 加重。护士听到双肺底新出现 crackles，并查看生命体征趋势。哪些措施合适？选择所有适用项。",
    after: "一名因急性心肌梗死入院的成人患者诉气促加重。护士听诊发现双肺底新出现湿啰音，并查看了生命体征趋势。哪些措施合适？请选择所有适用项。",
  }),
];

runPatch(ops);
