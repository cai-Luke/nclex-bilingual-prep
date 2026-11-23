// D-2 T01, unit 13. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "cap_gpt_2026_07_02_t03_001";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "pulmonary embolism 导致突然 dead-space ventilation 增加",
    after: "肺栓塞导致无效腔通气骤增",
  }),
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "opioid-induced hypoventilation",
    after: "阿片类药物引起的通气不足",
  }),
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "esophageal intubation",
    after: "气管导管误入食管",
  }),
  setValue({
    id, path: ["options", {"id":"A"}, "zh"],
    before: "allergic reaction 引起的 bronchospasm",
    after: "过敏反应引起的支气管痉挛",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "esophageal intubation 预期会出现 CO2 波形缺失或迅速消失，而不是重复出现 obstructive waveform。",
    after: "导管误入食管时，通常检测不到 CO2 波形，或波形很快消失，而非反复出现提示气道阻塞的波形。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "opioid hypoventilation 更常见 respiratory rate 变慢、波形较清晰且幅度较大，而不是呼气上升段倾斜。",
    after: "阿片类药物引起通气不足时，更常见的是呼吸频率减慢、波形振幅较大且轮廓清晰，而非呼气上升段倾斜。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "pulmonary embolism 可能因肺灌注减少而降低 EtCO2，但通常不会造成 obstructive shark-fin morphology。",
    after: "肺栓塞可能使肺灌注减少，从而使 EtCO2 降低，但通常不会形成提示气道阻塞的鲨鱼鳍样波形。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "该选项同时符合波形提示的 obstruction，以及题干中的 allergic reaction 与 wheezing 线索。",
    after: "这一选项既符合波形所示的气道阻塞，也符合题干中过敏反应伴哮鸣音的表现。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "倾斜的 shark-fin capnogram 提示 obstructive airway physiology。结合 hives、wheezing 和刚使用 IV antibiotic，最符合 allergic reaction 引起的 bronchospasm。",
    after: "倾斜的鲨鱼鳍样二氧化碳波形提示气道阻塞。结合患者刚静脉使用抗生素、出现荨麻疹和哮鸣音，过敏反应引起的支气管痉挛最能解释该波形。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名患者 procedural sedation 后恢复期间，刚接受 IV antibiotic 后出现面部潮红、散在 hives、呼气性 wheezing 和呼吸做功增加。使用 supplemental oxygen 时 oxygen saturation 为 91%。如下为 capnogram。哪一种并发症最能解释该波形？",
    after: "一名患者在诊疗操作镇静后的恢复期接受了静脉抗生素治疗，随即出现面部潮红、散在荨麻疹、呼气性哮鸣音，呼吸做功增加。吸氧时血氧饱和度为 91%。呼气末二氧化碳波形图如下。哪种并发症最能解释这一波形？",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "先看 morphology，不要只看数字：shark-fin shape 代表 airflow obstruction。再结合题干判断最可能原因。",
    after: "先看波形形态，再看数值：鲨鱼鳍样波形提示气流受阻。然后结合题干判断最可能的原因。",
  }),
];

runPatch(ops);
