// D-2 T01, unit 06. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "cap_gpt_2026_07_02_t01_006";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["matrix", "rows", {"id":"r1"}, "zh"],
    before: "呼叫帮助，开放气道，并开始使用氧气进行 bag-mask ventilation。",
    after: "呼叫支援，开放气道，并开始用球囊面罩给氧通气。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r2"}, "zh"],
    before: "按 protocol 或医嘱准备 naloxone。",
    after: "根据规程或医嘱准备纳洛酮。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r3"}, "zh"],
    before: "假定 esophageal intubation，并要求立即移除气管管。",
    after: "假定导管已误入食管，并要求立即拔管。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r4"}, "zh"],
    before: "更换 anesthesia circuit 中的 CO2 absorbent。",
    after: "更换麻醉呼吸回路中的二氧化碳吸收剂。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r5"}, "zh"],
    before: "因为 pulse 可触及，所以继续给予 opioid。",
    after: "因仍可触及脉搏，继续给予阿片类药物。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r1"}, "zh"],
    before: "适用。无呼吸努力加 flat waveform 需要立即开放气道并辅助通气。",
    after: "适用。患者无自主呼吸动作，波形又呈平直线，需要立即开放气道并辅助通气。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r2"}, "zh"],
    before: "适用。opioid 暴露和 apnea 使 naloxone 准备成为合适措施，同时要支持通气。",
    after: "适用。患者使用阿片类药物后出现呼吸暂停，应在支持通气的同时准备纳洛酮。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r3"}, "zh"],
    before: "不适用。题干未说明患者已插管；题干把 flat waveform 的原因限定为 apnea，而不是 esophageal placement。",
    after: "不适用。题干未提及患者接受气管插管；结合患者的表现，平直波形提示呼吸暂停，而非导管误入食管。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r4"}, "zh"],
    before: "不适用。CO2 absorbent 问题会导致 rebreathing 和非零 baseline，而不是 opioid apnea 中的波形消失。",
    after: "不适用。二氧化碳吸收剂失效可导致重复吸入二氧化碳，基线不回到零。本例则是阿片类药物引起呼吸暂停时所见的波形消失。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r5"}, "zh"],
    before: "不适用。当通气停止时，即使 pulse 可触及，也不能继续给予 opioid。",
    after: "不适用。通气已经停止，即使仍可触及脉搏，继续给予阿片类药物也不安全。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "flat capnogram 证实这名 IV opioid 后无呼吸努力的患者没有呼出 CO2 信号。由于 pulse 仍存在，优先是支持 airway 和 ventilation，并按医嘱或 protocol 准备 naloxone。",
    after: "患者静脉使用阿片类药物后无自主呼吸动作，平直的波形证实未检测到呼出的 CO2 信号。由于仍有脉搏，应优先开放气道、支持通气，并按医嘱或规程准备纳洛酮。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名因 wound debridement 正在接受 IV hydromorphone 的患者变得嗜睡，对声音无反应。患者没有呼吸努力，pulse 为 88/min 且可触及，氧气管路仍连接。如下为 capnogram。请判断每项处理现在是否适用。",
    after: "一名患者因伤口清创经静脉给予氢吗啡酮后变得嗜睡，呼之不应。患者无自主呼吸动作，可触及脉搏，脉率为 88 次/分，供氧管路仍连接。呼气末二氧化碳波形图如下。请逐项判断现在是否应采取下列措施。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "flat waveform 本身不是单一诊断。要用题干限定线索：opioid 暴露、无呼吸努力、氧气管路连接、pulse 可触及，指向有灌注心律下的 apnea。",
    after: "单凭平直波形无法确定病因。结合其他线索：患者使用了阿片类药物，无自主呼吸动作，供氧管路仍连接，且可触及脉搏。这些表现提示呼吸暂停，但心律仍能产生灌注。",
  }),
];

runPatch(ops);
