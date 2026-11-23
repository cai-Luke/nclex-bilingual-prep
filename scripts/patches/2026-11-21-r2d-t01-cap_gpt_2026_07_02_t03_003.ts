// D-2 T01, unit 15. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "cap_gpt_2026_07_02_t03_003";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["matrix", "rows", {"id":"r1"}, "zh"],
    before: "EtCO2 突然持续升高提示可能 ROSC。",
    after: "EtCO2 突然升高并维持在较高水平，提示可能已恢复自主循环。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r3"}, "zh"],
    before: "应报告该发现，使团队准备在下一次合适暂停时评估 pulse 和 rhythm。",
    after: "应将这一变化告知团队，以便在下一次适宜暂停按压时检查脉搏和心律。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r4"}, "zh"],
    before: "该波形证明 endotracheal tube 已进入 esophagus。",
    after: "该波形证实气管导管已移入食管。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r1"}, "zh"],
    before: "支持。波形显示 EtCO2 从按压期间的低值阶梯式升至较高且持续的数值。",
    after: "支持。图中可见按压期间 EtCO2 从低值突然跃升，并维持在明显较高的水平。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r2"}, "zh"],
    before: "不支持。该 capnogram 提示 ROSC 可能，但不应为了长时间非计划检查而中断高质量 CPR。",
    after: "不支持。波形提示可能已恢复自主循环，但不应为临时安排的长时间检查而中断高质量心肺复苏。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r3"}, "zh"],
    before: "支持。该 capnogram 是有用的团队信息，可帮助准备下一次 pulse 和 rhythm assessment。",
    after: "支持。将波形变化告知团队，有助于团队为下一次脉搏和心律评估做好准备。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r4"}, "zh"],
    before: "不支持。esophageal placement 不能解释 CPR 期间呼出 CO2 突然持续升高。",
    after: "不支持。心肺复苏期间呼出的 CO2 突然升高并保持在较高水平，这一变化并不提示导管误入食管。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "CPR 期间 EtCO2 突然持续升高是 possible ROSC 的线索。应将该发现告知团队，并在合适的 rhythm 或 pulse check 时评估，不应造成不必要的长时间按压中断。",
    after: "心肺复苏期间，EtCO2 突然升高并维持在较高水平，提示可能已恢复自主循环。应告知团队，并在适宜检查心律或脉搏时进行评估，避免不必要地长时间中断按压。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "成人 CPR 过程中，患者已 intubated，并使用 continuous waveform capnography。胸外按压正在进行，距离下一次计划暂停还有 45 秒。监护仪显示如下 capnogram。请判断每个团队陈述是否受到该波形支持。",
    after: "一名成人正在接受心肺复苏（CPR），已行气管插管并接受连续波形二氧化碳监测。胸外按压仍在进行，距下一次预定暂停按压还有 45 秒。监护仪上的呼气末二氧化碳波形如下。请逐项判断该波形是否支持团队成员的说法。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "CPR 期间 EtCO2 突然持续跳升是 ROSC 线索，但 NCLEX 仍重视尽量减少胸外按压暂停。",
    after: "心肺复苏期间，EtCO2 突然跃升并维持在较高水平，提示可能已恢复自主循环。回答 NCLEX 题目时，仍应注意尽量减少胸外按压中断。",
  }),
];

runPatch(ops);
