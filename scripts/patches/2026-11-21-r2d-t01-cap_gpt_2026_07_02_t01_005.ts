// D-2 T01, unit 05. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "cap_gpt_2026_07_02_t01_005";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "因为 esophageal intubation 时氧饱和度可能暂时正常，所以移除气管管。",
    after: "拔除导管，因为即使导管误入食管（esophageal intubation），血氧饱和度也可能暂时正常。",
  }),
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "根据 capnogram morphology 使用 albuterol 治疗 bronchospasm。",
    after: "根据图中的二氧化碳波形，给予沙丁胺醇（albuterol）治疗支气管痉挛。",
  }),
  setValue({
    id, path: ["options", {"id":"E"}, "zh"],
    before: "因为 inspiratory baseline 升高，所以排查 rebreathing。",
    after: "因吸气基线升高，排查患者是否重复吸入二氧化碳。",
  }),
  setValue({
    id, path: ["options", {"id":"A"}, "zh"],
    before: "记录 artificial airway 通气的持续证据，并继续监测。",
    after: "记录患者经人工气道持续通气的证据，并继续监测。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "错误。bronchospasm 会由 shark-fin waveform 提示，而不是图中清晰的矩形波形。",
    after: "错误。提示支气管痉挛的是鲨鱼鳍样波形，图中所见则是轮廓清晰的矩形波形。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"E"}, "zh"],
    before: "错误。rebreathing 会显示吸气期 baseline 不能回到零；本波形回到了 baseline。",
    after: "错误。重复吸入二氧化碳时，吸气基线不能回到零，而图中波形已回到基线。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "错误。esophageal intubation 的担忧通常来自 CO2 波形消失或逐渐消失，并伴随不良临床体征，而不是本图。",
    after: "错误。如果没有 CO2 波形或波形逐渐消失，并伴有不良临床体征，应怀疑导管误入食管。图中未见这种波形表现。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "该 capnogram 为重复的矩形波形，EtCO2 在预期范围内，并回到 baseline。结合情境，它支持 tracheal tube 的持续通气；chest radiograph 可确认管深，但不能替代 continuous capnography。",
    after: "图中反复出现矩形波形，每次均回到基线，EtCO2 在预期范围内。结合患者的体征，这支持患者正经气管导管持续通气。胸部 X 光片可用于确认导管深度，但不能替代连续波形二氧化碳监测。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名已插管患者从急诊转入 ICU 后，护士连接 continuous waveform capnography。SpO2 为 97%，可见双侧胸廓起伏，听诊双侧呼吸音相等。如下为 capnogram。哪些判断或措施是合适的？请选择所有适用项。",
    after: "一名已行气管插管的患者从急诊科转入 ICU 后，护士为其接上连续波形二氧化碳监测装置。SpO2 为 97%，可见双侧胸廓起伏，双侧呼吸音相等。呼气末二氧化碳波形图如下。下列哪些判断或措施合适？请选择所有适用项。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "把管子位置和管子深度分开看。正常重复的 capnogram 支持气道通气；胸片仍可用于检查深度。",
    after: "要区分两个问题：导管是否位于气管内，以及置入深度是否合适。反复出现的正常二氧化碳波形支持患者正经人工气道通气，仍可用胸部 X 光片检查导管深度。",
  }),
];

runPatch(ops);
