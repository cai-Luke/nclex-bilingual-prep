// D-2 T01, unit 10. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "cap_gpt_2026_07_02_t02_004";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "“EtCO2 正常，但波形形状提示 rebreathing。”",
    after: "“EtCO2 正常，但波形提示患者重复吸入二氧化碳。”",
  }),
  setValue({
    id, path: ["options", {"id":"A"}, "zh"],
    before: "“重复出现呼出 CO2 的矩形波形支持 tracheal placement；固定 tube 并继续监测。”",
    after: "“每次呼气均检测到 CO2，并呈矩形波形，这支持导管位于气管内（tracheal placement）。应固定导管并继续监测。”",
  }),
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "“该波形提示 esophageal placement；现在拔除 tube。”",
    after: "“波形提示导管误入食管（esophageal placement），应立即拔除导管。”",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "breath sounds 有帮助，但确认 tube 位置时不如 continuous waveform capnography 可靠。",
    after: "听诊呼吸音有助于判断导管位置，但其可靠性不及连续波形二氧化碳监测。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "rebreathing 需要 inspiratory baseline 持续高于零；此波形回到 baseline。",
    after: "重复吸入二氧化碳时，吸气基线应持续高于零，而图中波形回到了基线。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "这项回应利用关键的 waveform morphology 和重复 CO2 检测来支持 tracheal placement。",
    after: "这项回应结合了两条关键线索：波形的形态和反复检测到的呼出 CO2。两者均支持导管位于气管内。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "在此情境下，持续重复的矩形 capnogram 显示呼出 CO2，是 tracheal ventilation 的有力证据。确认后应固定 tube 并继续监测。",
    after: "在本例中，持续出现的矩形波形表明反复检测到呼出的 CO2，是患者经气管通气的有力证据。确认位置后，应固定导管并继续监测。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名患者 seizure 后在急诊被 intubated。双侧呼吸音相等，使用 bag-valve ventilation 时 SpO2 为 95%。团队询问护士 tube 是否可能位于 trachea。如下为 capnogram。哪项回应最合适？",
    after: "一名患者在一次癫痫发作后于急诊科接受气管插管。双侧呼吸音相等，使用球囊通气时 SpO2 为 95%。团队询问护士，导管是否很可能位于气管内。呼气末二氧化碳波形图如下。护士怎样回答最合适？",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "确认 tube placement 时，持续 waveform capnography 比单靠 breath sounds 更有价值。要同时看波形形状和呼出 CO2 是否持续存在。",
    after: "确认导管位置时，持续的波形二氧化碳监测比单凭呼吸音更可靠。既要看波形形态，也要看是否持续检测到呼出的 CO2。",
  }),
];

runPatch(ops);
