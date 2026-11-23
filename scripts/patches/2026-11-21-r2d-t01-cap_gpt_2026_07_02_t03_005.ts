// D-2 T01, unit 17. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "cap_gpt_2026_07_02_t03_005";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["matrix", "columns", {"id":"does_not_support"}, "zh"],
    before: "不支持 routine monitoring",
    after: "不支持常规监测",
  }),
  setValue({
    id, path: ["matrix", "columns", {"id":"supports"}, "zh"],
    before: "支持 routine monitoring",
    after: "支持常规监测",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r1"}, "zh"],
    before: "矩形波形且回到 baseline",
    after: "波形呈矩形，并回到基线",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r2"}, "zh"],
    before: "EtCO2 在成人预期范围内",
    after: "呼气末二氧化碳（EtCO2）在成人预期范围内",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r3"}, "zh"],
    before: "只靠 oxygen saturation 就能确认 ventilation 充足",
    after: "仅凭血氧饱和度即可确认通气充分",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r4"}, "zh"],
    before: "存在持续 shark-fin morphology",
    after: "波形持续呈鲨鱼鳍样",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r1"}, "zh"],
    before: "支持。清晰矩形波形并回到 baseline，符合有效通气。",
    after: "支持。轮廓清晰的矩形波形能回到基线，符合有效通气的表现。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r2"}, "zh"],
    before: "支持。EtCO2 38 mmHg 结合正常 morphology，处于成人常见预期范围。",
    after: "支持。EtCO2 为 38 mmHg，处于成人常见的预期范围，且波形形态正常。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r3"}, "zh"],
    before: "不支持。使用 supplemental oxygen 时，即使 hypoventilation，oxygen saturation 也可能暂时正常，因此仍需 capnography。",
    after: "不支持。吸氧时，即使通气不足，血氧饱和度也可能保持正常，因此仍需监测呼气末二氧化碳波形。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r4"}, "zh"],
    before: "不支持。显示的波形不是 shark-fin；若持续 shark-fin morphology，提示 obstruction，不应只进行 routine recovery。",
    after: "不支持。图中未见鲨鱼鳍样波形。若持续出现这种形态，则提示气道阻塞，不宜仅进行常规恢复期监测。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "波形显示 normal rectangular waveform，能回到 baseline，EtCO2 38 mmHg、respiratory rate 16/min，在此情境支持 adequate ventilation。但只看 oxygen saturation 不够，因为 supplemental oxygen 可能掩盖 hypoventilation。",
    after: "图中为正常的矩形波形，能回到基线，EtCO2 为 38 mmHg，呼吸频率为 16 次/分。结合本例，这些表现支持患者通气充分。单凭血氧饱和度还不够，因为吸氧可能掩盖通气不足。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名患者因 closed reduction 接受 moderate sedation。护士在患者离开 procedure room 前评估 ventilation。患者使用 nasal cannula 2 L/min 时 oxygen saturation 为 98%，可对声音作出反应，capnogram 如下。请判断每个发现是否支持继续 routine recovery monitoring。",
    after: "一名患者在中度镇静下接受了闭合复位。转出操作室前，护士评估其通气情况。患者经鼻导管以 2 L/min 吸氧，血氧饱和度为 98%，对呼唤有反应。呼气末二氧化碳波形图如下。请逐项判断下列表现或说法能否支持患者继续接受常规恢复期监测。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "不要被正常 SpO2 分散注意力。capnography 评估 ventilation；pulse oximetry 评估 oxygenation。",
    after: "不要只看正常的 SpO2。呼气末二氧化碳波形监测用于评估通气，脉搏血氧监测用于评估氧合。",
  }),
];

runPatch(ops);
