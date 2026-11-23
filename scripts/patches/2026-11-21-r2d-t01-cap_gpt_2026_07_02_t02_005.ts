// D-2 T01, unit 11. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "cap_gpt_2026_07_02_t02_005";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"F"}, "zh"],
    before: "因为 baseline 回到零点，所以记录患者为 apneic。",
    after: "因基线回到零，记录患者出现呼吸暂停。",
  }),
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "准备医嘱的 inhaled bronchodilator therapy。",
    after: "按医嘱准备吸入用支气管扩张剂（bronchodilator）。",
  }),
  setValue({
    id, path: ["options", {"id":"E"}, "zh"],
    before: "因为 EtCO2 waveform 证明通气充足，所以暂停 respiratory treatment。",
    after: "因呼气末二氧化碳波形证明通气充分，暂缓呼吸治疗。",
  }),
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "因为波形有清晰 plateau，假设主要问题是 pulmonary embolism。",
    after: "因波形有清晰的平台，判断患者的主要问题是肺栓塞（pulmonary embolism）。",
  }),
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "如果 shark-fin slope 更明显，应监测 obstruction 是否恶化。",
    after: "如果鲨鱼鳍样波形的倾斜更明显，监测气道阻塞是否加重。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"F"}, "zh"],
    before: "baseline 回零并不代表 apnea；apnea 会没有重复呼出 CO2 波形。",
    after: "基线回到零不等于呼吸暂停。呼吸暂停时，不会反复出现呼出 CO2 的波形。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "图像没有清晰 plateau；它显示 shark-fin pattern。pulmonary embolism 不是该形态和题干的最佳解释。",
    after: "图中所见是鲨鱼鳍样波形，没有清晰的平台。结合波形和患者表现，肺栓塞并非最合理的解释。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"E"}, "zh"],
    before: "有波形不代表通气充足；本题形态和 EtCO2 都提示 obstructive retention。",
    after: "仅有波形不能证明通气充分。本例的波形形态和 EtCO2 提示呼气受阻，导致 CO2 潴留。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "更明显的 shark-fin slope 表示呼气 obstruction 更严重。",
    after: "鲨鱼鳍样波形的倾斜越明显，表示呼气受阻越严重。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "在 COPD 和 wheezing 情境下，obstructive capnogram 支持准备 bronchodilator therapy。",
    after: "患者有慢性阻塞性肺疾病并可闻及哮鸣音，提示呼气受阻的二氧化碳波形支持准备支气管扩张剂治疗。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "上升段变斜且缺少平坦 plateau，是典型 obstructive 特征。",
    after: "上升段倾斜、平坦的平台消失，是呼气受阻的典型波形特征。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "shark-fin morphology 加上 COPD、wheezing、accessory muscle use 和 EtCO2 升高，支持 obstructive exhalation 并应准备 bronchodilator。斜率更明显提示 obstruction 可能恶化。",
    after: "鲨鱼鳍样波形，加上慢性阻塞性肺疾病病史、哮鸣音、动用辅助呼吸肌和 EtCO2 升高，均支持阻塞性呼气，应准备支气管扩张剂。波形倾斜更明显提示阻塞可能加重。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名 COPD 患者因 dyspnea 加重来到急诊。患者端坐、使用 accessory muscles，并有弥漫性 expiratory wheezes。鼻导管 2 L/min 吸氧时 SpO2 为 91%。如下为 capnogram。哪些发现或措施得到题干和图像支持？选择所有适用项。",
    after: "一名慢性阻塞性肺疾病（COPD）患者因呼吸困难加重到急诊科就诊。患者端坐，呼吸时动用辅助呼吸肌，可闻及弥漫性呼气性哮鸣音。经鼻导管以 2 L/min 吸氧时，SpO2 为 91%。呼气末二氧化碳波形图如下。根据上述表现和波形，下列哪些判断或措施有依据？请选择所有适用项。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "先把波形形状对应到生理问题，再套疾病标签。shark-fin 意味着 obstruction；COPD 和 wheeze 细节让 bronchodilator therapy 成为相关措施。",
    after: "先判断波形反映的生理变化，再考虑疾病名称。鲨鱼鳍样波形提示阻塞，结合慢性阻塞性肺疾病和哮鸣音，再考虑支气管扩张剂治疗。",
  }),
];

runPatch(ops);
