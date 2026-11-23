// D-2 T01, unit 09. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "cap_gpt_2026_07_02_t02_003";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["matrix", "rows", {"id":"r1"}, "zh"],
    before: "“报告可能出现 ROSC，并准备在下一次计划暂停时检查 pulse 和 rhythm。”",
    after: "“报告可能已恢复自主循环，并准备在下一次预定暂停按压时检查脉搏和心律。”",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r2"}, "zh"],
    before: "“因为 EtCO2 突然升高，立即停止 chest compressions。”",
    after: "“EtCO2 突然升高了，立即停止胸外按压。”",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r3"}, "zh"],
    before: "“在 rhythm/pulse check 前继续 chest compressions，同时团队准备 post-ROSC care。”",
    after: "“继续胸外按压，直到检查心律和脉搏时再暂停；同时做好自主循环恢复后救护的准备。”",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r4"}, "zh"],
    before: "“忽略该波形，因为 CPR 期间 capnography 不能提供有用信息。”",
    after: "“不用看这个波形，心肺复苏期间的二氧化碳波形监测无法提供有用信息。”",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r1"}, "zh"],
    before: "适当。图中 EtCO2 从低值突然阶梯式升高到较高值，是 possible ROSC 的线索。",
    after: "适当。图中 EtCO2 从低值突然跃升至明显更高的水平，提示可能已恢复自主循环。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r2"}, "zh"],
    before: "不适当。升高提示准备评估，但不应在有组织的 rhythm/pulse check 之外停止按压。",
    after: "不适当。EtCO2 升高提示应准备评估，但在预定检查心律和脉搏的时机之外，不应中断按压。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r3"}, "zh"],
    before: "适当。这样既保持 CPR 质量，又能预期 capnogram 的临床意义。",
    after: "适当。这既能维持心肺复苏质量，又能针对波形提示的可能变化提前做好准备。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r4"}, "zh"],
    before: "不适当。quantitative waveform capnography 在 CPR 中可用于监测通气、按压质量以及 possible ROSC。",
    after: "不适当。心肺复苏期间，定量波形二氧化碳监测有助于监测通气、评估按压质量，并识别可能的自主循环恢复。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "CPR 期间 EtCO2 突然且持续升高可提示 return of spontaneous circulation。团队应在下一次有组织暂停时评估 ROSC，但在检查前继续按压。",
    after: "心肺复苏期间，EtCO2 突然升高并维持在较高水平，可能提示自主循环恢复。团队应准备在下一次按计划暂停按压时评估自主循环是否恢复，在检查前持续按压。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名 cardiac arrest 患者正在接受 high-quality CPR，并通过 advanced airway 通气。EtCO2 已持续数分钟为 10-12 mmHg。如下为当前 capnogram。请判断每个团队说法是 appropriate 还是 not appropriate。",
    after: "一名心搏骤停患者正在接受高质量心肺复苏（CPR），并通过高级气道通气。此前数分钟，EtCO2 一直在 10-12 mmHg。当前的呼气末二氧化碳波形图如下。请逐项判断团队成员的说法是否适当。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "不要把 CPR 期间低 EtCO2 和 flat line 混淆。本题关键是突然阶梯式升高，它改变了团队下一步评估重点。",
    after: "应区分心肺复苏时 EtCO2 偏低与波形呈平直线。本题的关键是 EtCO2 突然呈阶梯式升高，这一变化改变了团队下一步评估的重点。",
  }),
];

runPatch(ops);
