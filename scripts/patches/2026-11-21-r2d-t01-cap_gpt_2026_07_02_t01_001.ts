// D-2 T01, unit 01. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "cap_gpt_2026_07_02_t01_001";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "因为 capnography 仍显示重复呼吸波形，所以记录通气充足。",
    after: "呼气末二氧化碳监测仍可见连续多次呼吸的波形，据此记录患者通气充分。",
  }),
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "给予 naloxone 处理 opioid 引起的 respiratory depression。",
    after: "给予纳洛酮（naloxone），处理阿片类药物引起的呼吸抑制。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "即使仍有重复呼吸波形，只要形态显示呼气阻塞且 EtCO2 升高，就不能说明通气充足。",
    after: "即使每次呼吸仍有波形，若波形提示呼气受阻且 EtCO2 升高，也不能据此判断通气充分。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "这项措施同时处理了波形和 asthma 背景：bronchospasm 需要及时临床处理并准备 bronchodilator。",
    after: "这项措施兼顾了波形和患者的哮喘病史。出现支气管痉挛时，需要及时处理并准备支气管扩张剂。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "opioid respiratory depression 更可能造成呼吸变慢或无呼吸，而不是 shark-fin 的阻塞性形态。",
    after: "阿片类药物引起的呼吸抑制更可能表现为呼吸减慢或停止，而非提示呼气受阻的鲨鱼鳍样波形。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "放慢呼吸可能有助于焦虑，但不能处理图中显示的 obstructive waveform pattern。",
    after: "放慢呼吸可能有助于缓解焦虑，但不能纠正波形所提示的呼气受阻。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "这个倾斜的 shark-fin waveform 是关键线索，提示 obstructive/reactive airway physiology。对于有 asthma、胸闷和呼吸音减弱的患者，优先措施是暂停刺激性操作、通知医护人员，并准备 bronchodilator 治疗。",
    after: "图中倾斜的鲨鱼鳍样波形是识别气道阻塞或气道高反应性的关键线索。这名哮喘患者出现胸闷、呼吸音减弱，应优先暂停引起刺激的操作，通知诊疗人员，并准备给予支气管扩张剂。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名有 asthma 病史的患者正在接受 moderate sedation 以进行闭合复位。患者变得焦虑并说：“我的胸口很紧。”使用鼻导管 3 L/min 吸氧时 SpO2 为 93%，双侧呼吸音减弱。如下为 capnogram。护士首先应采取哪项措施？",
    after: "一名有哮喘病史的患者在中度镇静下接受闭合复位。患者开始焦虑，说：“我觉得胸口发紧。”经鼻导管以 3 L/min 吸氧时，SpO2 为 93%，双侧呼吸音减弱。呼气末二氧化碳波形图如下。护士首先应采取哪项措施？",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "不要只看 EtCO2 数字。先读波形形状：shark-fin capnogram 指向 obstruction，再结合 asthma 情境选择处理措施。",
    after: "不要只看 EtCO2 数值。先辨认波形：鲨鱼鳍样波形提示气道阻塞，再结合患者的哮喘病史选择措施。",
  }),
];

runPatch(ops);
