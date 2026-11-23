// D-2 T01, unit 16. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "cap_gpt_2026_07_02_t03_004";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "急性 bronchospasm 造成 expiratory obstruction",
    after: "急性支气管痉挛（bronchospasm）导致呼气受阻",
  }),
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "endotracheal tube cuff leak",
    after: "气管导管套囊漏气（cuff leak）",
  }),
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "过度镇静导致 sudden apnea",
    after: "过度镇静导致突然出现呼吸暂停（apnea）",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "bronchospasm 会产生倾斜的 shark-fin expiratory waveform，而不是主要表现为 inspiratory baseline 升高。",
    after: "支气管痉挛主要表现为倾斜的鲨鱼鳍样呼气波形，而非吸气基线升高。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "absorbent 耗尽可使 CO2 被重复吸入，使 inspiratory baseline 高于零。",
    after: "二氧化碳吸收剂耗尽可使患者重复吸入二氧化碳，使吸气基线高于零。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "cuff leak 可能降低通气量或波形高度，但不能特异解释 circle system 中 inspired CO2 baseline 升高。",
    after: "套囊漏气可能使实际送入的通气量减少或波形幅度降低，但不能具体解释环路呼吸系统中吸气 CO2 基线升高的现象。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "apnea 会导致重复 CO2 波形消失，而不是有重复波形且 baseline 升高。",
    after: "呼吸暂停时，不会再反复出现呼出 CO2 的波形，而图中仍反复出现波形，只是基线升高。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "capnogram 的 baseline 在吸气期没有回到零，表示吸入了 CO2，提示 rebreathing。在 circle system 中，CO2 absorbent 耗尽是典型设备原因。",
    after: "二氧化碳波形的基线在吸气期未回到零，表明吸入气中含有 CO2，提示重复吸入二氧化碳。在环路呼吸系统中，二氧化碳吸收剂耗尽是典型的设备原因。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名患者正在接受 monitored anesthesia care，并使用 circle breathing system。患者已镇静但仍 spontaneous breathing。anesthesia professional 请护士查看 capnogram，因为 inspired baseline 不再回到零点。哪一种设备问题最符合该波形？",
    after: "一名患者正在接受监测下麻醉管理，使用环路呼吸系统。患者虽已镇静，仍有自主呼吸。麻醉专业人员发现吸气基线不再回到零，请护士查看呼气末二氧化碳波形图。哪种设备问题最符合该波形？",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "rebreathing 题要看 baseline。吸气期不回到零点，与 shark-fin obstruction 或 flat apnea tracing 不同。",
    after: "判断是否重复吸入二氧化碳时，要看基线。吸气期基线未回到零，不同于呼气受阻时的鲨鱼鳍样波形，也不同于呼吸暂停时的平直波形。",
  }),
];

runPatch(ops);
