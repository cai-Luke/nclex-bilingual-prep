// D-2 T01, unit 14. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "cap_gpt_2026_07_02_t03_002";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "评估 tracheostomy tube 的位置和通畅性",
    after: "评估气管造口管的位置和通畅性（patency）",
  }),
  setValue({
    id, path: ["options", {"id":"E"}, "zh"],
    before: "记录 capnogram，15 分钟后再评估",
    after: "记录呼气末二氧化碳波形，15 分钟后再评估",
  }),
  setValue({
    id, path: ["options", {"id":"F"}, "zh"],
    before: "增加 humidification 设置以稀释分泌物",
    after: "调高湿化（humidification）水平，使分泌物更易松动",
  }),
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "不评估 tube position，直接把松脱的 ties 贴紧",
    after: "不评估导管位置，直接用胶带将松动的固定带贴紧",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "flat waveform 和无气流需要立即评估是否 displacement 或 obstruction。",
    after: "波形平直且管口无气流，需要立即评估导管是否移位或阻塞。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "新置 tracheostomy 的 airway emergency 可能迅速恶化，因此需要立即呼叫协助。",
    after: "新建气管造口发生气道急症时，患者的情况可能迅速恶化，因此需要立即呼叫支援。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "不检查 tube position 就收紧 ties，可能把移位的管子固定住并延误通气。",
    after: "未检查导管位置便收紧固定带，可能会把已经移位的导管固定在错误位置，延误通气。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "处理 airway 问题时，维持 oxygenation 和 ventilation 是优先事项。",
    after: "在处理气道问题的同时，应优先维持患者的氧合和通气。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"F"}, "zh"],
    before: "分泌物可造成 obstruction，但面对突然 flat waveform 和无气流，调整 humidification 不是立即处理。",
    after: "分泌物可能造成阻塞，但在波形突然变平且管口无气流时，调整湿化水平并非首要措施。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "新置 tracheostomy 患者突然出现 flat capnogram 且从管口感觉不到气流，提示有效通气丧失，包括可能 tube displacement。护士应呼叫协助、评估管子，并按 emergency protocol 提供氧合和通气。",
    after: "气管造口术后不久，二氧化碳波形突然变平且管口无气流，提示有效通气中断，原因可能是气管造口管移位。护士应呼叫支援，评估导管，并按气管造口急救流程给氧和通气。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名新置 tracheostomy 的患者正在翻身。患者突然烦躁，tracheostomy ties 看起来松脱，从 tracheostomy tube 感觉不到气流，capnogram 变化如下。护士应采取哪些措施？选择所有适用项。",
    after: "一名刚接受气管造口术的患者在变换体位时突然烦躁不安。气管造口管的固定带看起来松了，管口感觉不到气流，呼气末二氧化碳波形的变化如图所示。护士应采取哪些措施？请选择所有适用项。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "flat capnogram 是 no-ventilation 线索。新置 tracheostomy 时，先处理 airway help、tube assessment 和 oxygenation，再考虑舒适措施。",
    after: "平直的二氧化碳波形提示可能已无有效通气。对于刚接受气管造口术的患者，应先呼叫支援处理气道、评估导管并维持氧合，再考虑舒适护理。",
  }),
];

runPatch(ops);
