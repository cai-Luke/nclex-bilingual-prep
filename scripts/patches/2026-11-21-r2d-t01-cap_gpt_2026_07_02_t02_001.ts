// D-2 T01, unit 07. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "cap_gpt_2026_07_02_t02_001";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"A"}, "zh"],
    before: "ventilator circuit 脱开",
    after: "呼吸机的呼吸回路脱开",
  }),
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "mainstem bronchus intubation",
    after: "气管导管进入一侧主支气管",
  }),
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "焦虑相关的 hyperventilation",
    after: "焦虑引起的过度通气",
  }),
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "急性 bronchospasm 合并 air trapping",
    after: "急性支气管痉挛伴气体潴留",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "circuit 脱开可导致无呼出 CO2 波形和 low-pressure alarm，而 tube depth 可保持不变。",
    after: "呼吸回路脱开时，可能检测不到呼出的 CO2，呼吸机可发出低压报警，而导管深度仍可保持不变。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "bronchospasm 通常会出现倾斜的 shark-fin waveform，而不是突然变成 flat tracing 并伴 low-pressure alarm。",
    after: "支气管痉挛通常表现为倾斜的鲨鱼鳍样波形，而非波形突然变平并伴低压报警。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "hyperventilation 仍会有重复 CO2 波形，EtCO2 可能偏低，但不会呈现完全 absent waveform。",
    after: "过度通气时，每次呼吸仍可见 CO2 波形，EtCO2 常偏低，波形不会因此消失。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "mainstem intubation 可导致呼吸音不对称和通气问题，但通常不会造成 CO2 waveform 完全消失并伴 low-pressure alarm。",
    after: "导管进入一侧主支气管可能导致双侧呼吸音不等和通气异常，但通常不会造成 CO2 波形完全消失并伴低压报警。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "翻身后立即出现 flat capnogram，加上 ventilator low-pressure alarm 且管子深度未改变，最符合 breathing circuit 脱开。护士应迅速检查并重新连接呼吸回路，同时维持通气。",
    after: "翻身后立即出现平直二氧化碳波形，同时呼吸机发出低压报警，而导管深度未变，这组表现最符合呼吸回路脱开。护士应在维持通气的同时，迅速检查并重新连接呼吸回路。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名使用 mechanical ventilator 的患者在床上翻身后，ventilator 立即出现 low-pressure alarm。endotracheal tube 的深度标记没有变化，但因患者被单遮盖，胸廓起伏不易观察。如下为 capnogram。护士首先应怀疑哪一项问题？",
    after: "一名接受机械通气的患者在床上翻身后，呼吸机立即发出低压报警。气管导管的深度标记未变，因患者身上盖着铺单，难以看清胸廓起伏。呼气末二氧化碳波形图如下。护士首先应怀疑哪项问题？",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "看到 flat waveform 时不要直接假设单一原因。把波形和题干一起读：翻身后 low-pressure alarm 指向 disconnection，而不是 obstruction。",
    after: "平直二氧化碳波形可有多种原因。把波形与题干联系起来：翻身后出现低压报警，更提示呼吸回路脱开，而非气道阻塞。",
  }),
];

runPatch(ops);
