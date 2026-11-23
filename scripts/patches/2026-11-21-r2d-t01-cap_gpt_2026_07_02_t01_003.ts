// D-2 T01, unit 03. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "cap_gpt_2026_07_02_t01_003";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "要求给予 sodium bicarbonate，因为 EtCO2 上升表示 metabolic acidosis 恶化。",
    after: "请求给予碳酸氢钠，因为 EtCO2 升高表明代谢性酸中毒加重。",
  }),
  setValue({
    id, path: ["options", {"id":"A"}, "zh"],
    before: "立即停止胸外按压，因为 capnogram 已证明 return of spontaneous circulation。",
    after: "立即停止胸外按压，因为呼气末二氧化碳波形已证实自主循环恢复。",
  }),
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "报告可能出现 ROSC，并准备在计划暂停时评估 pulse 和 blood pressure。",
    after: "向团队报告可能已恢复自主循环，并准备在预定暂停按压时检查脉搏和血压。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "错误。这个视觉变化是 perfusion cue，不是单独使用 sodium bicarbonate 的适应证。",
    after: "错误。这种波形变化反映灌注情况，单凭这一变化不足以判断需要使用碳酸氢钠。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "错误。capnography 提示可能 ROSC，但不应在合适的 rhythm 或 pulse check 之外停止按压。",
    after: "错误。呼气末二氧化碳波形提示可能已恢复自主循环。除非到了适宜检查心律或脉搏的时机，否则不应停止按压。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "错误。CPR 中过度通气会降低 venous return；优先是识别可能 ROSC，而不是强行降低 EtCO2。",
    after: "错误。心肺复苏期间过度通气可能减少静脉回流。此时应优先识别可能的自主循环恢复，无需刻意压低 EtCO2。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "CPR 过程中 EtCO2 突然持续上升，是可能出现 ROSC 的线索。应提示团队准备在下一次合适暂停时评估 pulse 和 blood pressure，而不是提前停止按压。",
    after: "心肺复苏期间，EtCO2 突然升高并维持在较高水平，提示可能已恢复自主循环。团队应准备在下一次适宜暂停按压时检查脉搏和血压，避免过早中断按压。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "患者因 pulseless ventricular tachycardia 正在接受 CPR，胸外按压持续进行，并已放置 advanced airway。患者已接受 defibrillation 和 epinephrine。下一次 rhythm check 还有 30 秒。capnogram 出现如下变化。护士最合适的行动是什么？",
    after: "一名患者因无脉性室性心动过速正在接受心肺复苏（CPR）。胸外按压仍在进行，已建立高级气道。患者已接受除颤并使用了肾上腺素，距下次心律检查还有 30 秒。呼气末二氧化碳波形的变化如图所示。护士采取哪项措施最合适？",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "CPR 中 EtCO2 突然跳升是 trend cue。选择“预期 ROSC 但不造成不必要按压暂停”的选项。",
    after: "心肺复苏期间，EtCO2 突然跃升是趋势变化的线索。选择既考虑到可能已恢复自主循环，又能避免不必要地中断胸外按压的措施。",
  }),
];

runPatch(ops);
