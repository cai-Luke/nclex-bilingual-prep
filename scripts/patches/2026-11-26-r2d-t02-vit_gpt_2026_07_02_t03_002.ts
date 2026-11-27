// D-2 T02, unit 12. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "vit_gpt_2026_07_02_t03_002";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "量化 blood loss，并继续频繁评估 fundus 和 vital signs。",
    after: "量化失血量，并继续频繁评估宫底和生命体征。",
  }),
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "维持大口径 IV access，并准备医嘱的 uterotonic medication 或 fluid replacement。",
    after: "维持大口径静脉通路，并按医嘱准备促子宫收缩药或补液。",
  }),
  setValue({
    id, path: ["options", {"id":"E"}, "zh"],
    before: "通知 obstetric provider 或启动 postpartum hemorrhage escalation process。",
    after: "通知产科诊疗人员，或启动产后出血升级处置流程。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"F"}, "zh"],
    before: "等待 4 小时会忽略 uterine atony 背景下的 tachycardia、血压下降和 pulse pressure 变窄。",
    after: "产妇子宫收缩乏力，并出现心动过速、血压下降、脉压缩小。等待 4 小时会忽视这些变化。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "当趋势提示 hemodynamic instability 时，淋浴或下床活动不安全。",
    after: "生命体征趋势提示血流动力学不稳定时，让产妇淋浴或下床活动并不安全。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "量化 blood loss 并重新评估 fundus 和 vital signs，有助于追踪反应并发现 hemorrhage 加重。",
    after: "量化失血量，反复评估宫底和生命体征，有助于判断处理效果并及时发现出血加重。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "boggy fundus 提示 uterine atony，而 hemodynamic trend 使立即 fundal massage 和呼叫协助成为适当措施。",
    after: "宫底松软提示子宫收缩乏力。结合血流动力学的变化，此时应立即按摩宫底并呼叫协助。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "生命体征提示失血正在进展，因此可能需要 IV access、uterotonics 以及 fluid 或 blood replacement。",
    after: "生命体征提示失血仍在进展，因此可能需要静脉通路、促子宫收缩药以及补液或输血。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "趋势显示 HR 上升、SBP 和 MAP 下降、pulse pressure 变窄，而且患者 fundus boggy。可见 lochia 为中等量可能低估实际失血。数据支持立即按 postpartum hemorrhage 处理，包括 fundal massage、升级处理、量化失血，并准备 uterotonics 与补容量。",
    after: "产妇子宫松软，连续测量显示心率上升、收缩压和平均动脉压下降、脉压缩小。仅凭肉眼所见的中等量恶露可能低估实际失血。应立即按产后出血处理，包括按摩宫底、升级处理、量化失血量，并准备使用促子宫收缩药和补充血容量。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名成人产妇 vaginal birth 后 2 小时。fundus 位于脐部且 boggy，lochia 描述为中等量。护士查看生命体征趋势。护士应采取哪些措施？选择所有适用项。",
    after: "一名成年产妇阴道分娩后 2 小时，宫底平脐、触之松软，恶露量中等。护士查看生命体征趋势后应采取哪些措施？请选择所有适用项。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "产后出血可能被低估。fundus boggy 时，要看 HR、BP、MAP 和 pulse pressure 的趋势，不要只依赖“中等量”这个词。",
    after: "产后出血可能不易从外观察觉。宫底松软时，应观察心率、血压、平均动脉压和脉压的变化，不能仅凭“中等量”来判断失血程度。",
  }),
];

runPatch(ops);
