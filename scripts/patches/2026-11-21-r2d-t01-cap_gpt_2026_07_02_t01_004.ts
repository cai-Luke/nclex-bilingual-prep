// D-2 T01, unit 04. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "cap_gpt_2026_07_02_t01_004";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["matrix", "rows", {"id":"r1"}, "zh"],
    before: "circle breathing system 中 CO2 absorbent 耗尽",
    after: "循环呼吸系统中的二氧化碳吸收剂耗尽",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r2"}, "zh"],
    before: "inspiratory 或 expiratory unidirectional valve 故障",
    after: "吸气或呼气单向阀故障",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r3"}, "zh"],
    before: "acute bronchospasm 导致呼气延长",
    after: "急性支气管痉挛导致呼气延长",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r4"}, "zh"],
    before: "opioid-induced apnea",
    after: "阿片类药物引起的呼吸暂停",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r5"}, "zh"],
    before: "minute ventilation 过高导致 hypocapnia",
    after: "每分钟通气量过高导致低碳酸血症",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r1"}, "zh"],
    before: "一致。吸收剂耗尽会使 CO2 被重新吸入，使 inspiratory baseline 升高。",
    after: "一致。吸收剂耗尽后，患者可再次吸入呼出的 CO2，使吸气基线升高。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r3"}, "zh"],
    before: "不一致。bronchospasm 通常造成倾斜的 shark-fin morphology，而不是持续升高的 inspiratory baseline。",
    after: "不一致。支气管痉挛通常表现为倾斜的鲨鱼鳍样波形，而非吸气基线持续升高。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r4"}, "zh"],
    before: "不一致。apnea 会造成波形消失或严重减少，而不是重复波形且 baseline 不为零。",
    after: "不一致。呼吸暂停时，波形会消失或明显减少，而图中反复出现波形，且基线不为零。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r5"}, "zh"],
    before: "不一致。minute ventilation 过高通常使 EtCO2 降低，也不能解释吸气 baseline 高于零。",
    after: "不一致。每分钟通气量过高通常会使 EtCO2 降低，无法解释吸气基线高于零。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "关键视觉特征是吸气期 baseline 没有回到零，结合 anesthesia circuit 情境，提示 rebreathing。CO2 absorbent 耗尽和 valve 故障都是一致原因。",
    after: "波形的关键特征是吸气基线未回到零。结合患者使用麻醉呼吸回路的情况，这提示重复吸入二氧化碳。二氧化碳吸收剂耗尽和单向阀故障均可导致这种表现。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "在手术室中，一名接受 general anesthesia 的机械通气患者 EtCO2 逐渐升高。tidal volume 和 peak airway pressure 没有变化。如下为 capnogram。请判断每个发现或设备问题是否与该视觉波形一致。",
    after: "手术室内，一名全身麻醉下接受机械通气的患者 EtCO2 逐渐升高，潮气量和气道峰压均无变化。呼气末二氧化碳波形图如下。请逐项判断下列情况或设备问题是否符合图中波形。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "判断 rebreathing 时，先不要只看峰值数字，要看 baseline。如果吸气期波形从不回到零，要想到 circuit 或 absorbent 问题。",
    after: "判断是否重复吸入二氧化碳时，先看基线，暂不看峰值。如果吸气期间波形始终没有回到零，要考虑呼吸回路或吸收装置的问题。",
  }),
];

runPatch(ops);
