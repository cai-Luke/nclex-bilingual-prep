// D-2 T01, unit 08. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "cap_gpt_2026_07_02_t02_002";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "协助检查 inspiratory 和 expiratory one-way valves。",
    after: "协助检查吸气单向阀和呼气单向阀（one-way valves）。",
  }),
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "将该波形当作单纯 opioid oversedation 处理。",
    after: "将该波形视为单纯由阿片类药物引起的过度镇静（oversedation），并据此处理。",
  }),
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "报告 inspiratory baseline 没有回到零点。",
    after: "报告吸气基线未回到零。",
  }),
  setValue({
    id, path: ["options", {"id":"E"}, "zh"],
    before: "因为 SpO2 仍为 98%，记录 ventilation 正常。",
    after: "因 SpO2 仍为 98%，记录患者通气正常。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "circle system 中的 unidirectional valves 故障可造成 rebreathing 和 inspiratory baseline 升高。",
    after: "循环呼吸系统中的单向阀发生故障，可导致患者重复吸入二氧化碳，使吸气基线升高。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "opioid oversedation 可导致 respiratory rate 或 ventilation 下降，但不能解释此回路情境下 inspiratory baseline 持续高于零。",
    after: "阿片类药物引起的过度镇静可使呼吸频率减慢或通气量下降，但无法解释使用此回路时吸气基线持续高于零的现象。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "absorber 耗尽可导致吸入 CO2，使 baseline 不能回到零点。",
    after: "二氧化碳吸收罐内的吸收剂耗尽后，患者可能吸入 CO2，导致基线不能回到零。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "升高的 inspiratory baseline 是判断 rebreathing 的关键线索。在 circle anesthesia system 中，常见原因包括 CO2 absorbent 耗尽或 one-way valve 故障；护士应报告 baseline 异常，并协助麻醉团队处理。",
    after: "吸气基线升高是判断患者重复吸入二氧化碳的关键线索。在循环式麻醉呼吸系统中，可能的原因包括二氧化碳吸收剂耗尽或单向阀故障。护士应报告基线异常，并协助麻醉团队处理。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名患者在 general anesthesia 下已 intubated，并使用 circle breathing system。SpO2 为 98%，但 EtCO2 在数分钟内逐渐升高。如下为 capnogram。围手术期护士应预期或协助哪些措施？选择所有适用项。",
    after: "一名患者在全身麻醉下接受气管插管，使用循环呼吸系统。SpO2 为 98%，但过去几分钟内 EtCO2 持续升高。呼气末二氧化碳波形图如下。围手术期护士应预期或协助采取哪些措施？请选择所有适用项。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "遇到 anesthesia circuit 题时先看 baseline。baseline 高于零代表吸入 CO2 和 rebreathing，不是单纯看氧合。",
    after: "遇到有关麻醉呼吸回路的问题，先看基线。基线高于零提示吸入气中含有 CO2，需考虑重复吸入二氧化碳，不能仅凭氧合情况作判断。",
  }),
];

runPatch(ops);
