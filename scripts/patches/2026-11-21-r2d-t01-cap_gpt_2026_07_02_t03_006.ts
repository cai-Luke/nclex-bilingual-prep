// D-2 T01, unit 18. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "cap_gpt_2026_07_02_t03_006";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "该 pattern 符合持续 bronchospasm。",
    after: "该波形符合持续性支气管痉挛。",
  }),
  setValue({
    id, path: ["options", {"id":"A"}, "zh"],
    before: "该 capnogram 支持严重 lower-airway obstruction。",
    after: "该二氧化碳波形提示下气道严重阻塞。",
  }),
  setValue({
    id, path: ["options", {"id":"F"}, "zh"],
    before: "目前存在正常矩形波形，因此 ventilation 已完全纠正。",
    after: "图中可见正常矩形波形，表明通气已完全恢复正常。",
  }),
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "护士应预期使用缓解 obstruction 的治疗，例如医嘱 bronchodilator treatment。",
    after: "护士应预期患者需接受缓解气道阻塞的治疗，例如按医嘱使用支气管扩张药。",
  }),
  setValue({
    id, path: ["options", {"id":"E"}, "zh"],
    before: "双侧 breath sounds 和重复 CO2 波形使 right mainstem intubation 成为最佳解释。",
    after: "双侧均可闻及呼吸音，且反复出现 CO2 波形，这些表现最符合导管进入右主支气管。",
  }),
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "endotracheal tube 最可能在 esophagus。",
    after: "气管导管最可能位于食管内。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"E"}, "zh"],
    before: "right mainstem intubation 支持较少，因为题干有双侧 breath sounds，且视觉显示 obstructive morphology，而不是 tube-depth problem。",
    after: "现有线索不太支持导管进入右主支气管：患者双侧均可闻及呼吸音，图中波形也提示气道阻塞，而非导管深度问题。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "status asthmaticus 加上 shark-fin capnogram 支持 ongoing bronchospasm。",
    after: "哮喘持续状态伴鲨鱼鳍样二氧化碳波形，提示支气管痉挛仍在持续。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "shark-fin morphology 是 obstructive lower-airway physiology 的视觉线索。",
    after: "鲨鱼鳍样波形是识别下气道阻塞的视觉线索。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "esophageal intubation 通常不会出现重复呼出 CO2 波形并伴双侧 breath sounds。",
    after: "导管误入食管时，通常不会反复检测到呼出 CO2 的波形，同时又能在双侧听到呼吸音。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "当 bronchospasm 受到支持时，预期采取针对 airway obstruction 的治疗是合适的。",
    after: "现有表现提示支气管痉挛，因此可以预期患者需要接受缓解气道阻塞的治疗。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"F"}, "zh"],
    before: "波形不是矩形；倾斜形状显示 ventilation 尚未完全纠正。",
    after: "图中波形并非矩形，其倾斜的形态提示通气尚未完全恢复正常。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "严重 shark-fin waveform、呼气延长、双侧 breath sounds 减弱和 peak pressures 升高，支持 intubation 后仍有 obstructive physiology。护士应预期使用医嘱 bronchodilator 或其他缓解 obstruction 的治疗。",
    after: "明显的鲨鱼鳍样波形、呼气延长、双侧呼吸音减弱和气道峰压升高，均提示插管后气道仍然受阻。护士应预期患者需按医嘱使用支气管扩张药或接受其他缓解阻塞的治疗。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名 severe status asthmaticus 患者完成 intubation。双侧可闻及 breath sounds，但声音减弱且呼气延长，peak airway pressures 正在升高，capnogram 如下。哪些判断受到题干和 capnogram 支持？选择所有适用项。",
    after: "一名患者在严重哮喘持续状态后接受气管插管。双侧均可闻及呼吸音，但呼吸音减弱，呼气延长，气道峰压正在升高。呼气末二氧化碳波形图如下。结合患者表现和波形，下列哪些判断有依据？请选择所有适用项。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "intubation 后不要自动归咎于 tube placement。若双侧 breath sounds 存在且波形是 shark-fin，要想到 obstruction。",
    after: "插管后出现异常，不要直接归因于导管位置。若双侧均可闻及呼吸音，且波形呈鲨鱼鳍样，应考虑气道阻塞。",
  }),
];

runPatch(ops);
