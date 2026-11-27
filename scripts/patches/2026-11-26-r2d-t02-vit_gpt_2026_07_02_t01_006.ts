// D-2 T02, unit 04. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "vit_gpt_2026_07_02_t01_006";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "按 protocol 允许范围增加 oxygen support，并重新评估 work of breathing 和 SpO2。",
    after: "在规程允许的范围内加强氧疗，并重新评估呼吸做功和外周血氧饱和度（SpO2）。",
  }),
  setValue({
    id, path: ["options", {"id":"A"}, "zh"],
    before: "即使患者没有 fever，也要提高对 sepsis progression 的警觉。",
    after: "即使患者没有发热，也要提高对脓毒症进展的警觉。",
  }),
  setValue({
    id, path: ["options", {"id":"E"}, "zh"],
    before: "因为入院时 systolic pressure 正常，所以改回常规生命体征监测。",
    after: "由于入院时收缩压正常，恢复常规频率的生命体征监测。",
  }),
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "等体温升到 100.4 °F (38.0 °C) 以上再给予 antibiotics。",
    after: "待体温超过 100.4 °F（38.0 °C）后再给予抗生素。",
  }),
  setValue({
    id, path: ["options", {"id":"F"}, "zh"],
    before: "在通知 provider 前先让患者下床活动，以帮助排痰。",
    after: "在通知诊疗人员前先让患者下床活动，以帮助排痰。",
  }),
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "通知 provider 或启动机构 escalation protocol，并报告趋势。",
    after: "通知诊疗人员或启动本机构的升级处置流程，并报告生命体征的变化趋势。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "当整体 sepsis 趋势恶化时，antibiotic timing 不能只取决于 fever。",
    after: "当整体趋势提示脓毒症正在恶化时，不能仅凭有无发热决定何时给予抗生素。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "这是正确的，因为当 perfusion 和 respiratory 趋势恶化时，没有 fever 不能排除 sepsis。",
    after: "此项正确。灌注和呼吸状况都在恶化时，即使没有发热也不能排除脓毒症。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"F"}, "zh"],
    before: "当 oxygenation 和 perfusion 恶化时，下床活动不安全，并且会延误升级处理。",
    after: "氧合和灌注都在恶化，此时让患者下床活动有危险，还会延误升级处理。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "趋势显示感染相关不稳定在恶化：HR 和 RR 上升，吸氧下 SpO2 下降，体温不是升高而是下降，MAP 低于 65 mm Hg。older adults 可能没有 fever 也会恶化，因此需要升级处理并重新评估氧疗。",
    after: "感染相关的病情不稳定正在加重：心率和呼吸频率上升，吸氧期间 SpO2 仍下降，体温不升反降，平均动脉压降至 65 mm Hg 以下。老年患者即使没有发热，病情也可能恶化，因此应升级处理并重新评估氧疗。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名来自 long-term care facility 的 older adult 因 suspected pneumonia 入院。等待 cultures 期间，患者正通过 nasal cannula 接受 oxygen 2 L/min。护士查看生命体征趋势。哪些护理措施合适？选择所有适用项。",
    after: "一名来自长期护理机构的老年患者因疑似肺炎入院。等待培养结果期间，患者经鼻导管吸氧，流量为 2 L/min。护士查看生命体征趋势后，采取哪些护理措施合适？请选择所有适用项。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "识别 sepsis 不一定要有 fever。older adult 中，体温下降同时 MAP、RR、HR 和 SpO2 恶化，可能比单纯高热更危险。",
    after: "识别脓毒症不能只看是否发热。对老年患者而言，体温下降，同时伴有平均动脉压、呼吸频率、心率和 SpO2 恶化，可能比单纯高热更危险。",
  }),
];

runPatch(ops);
