// D-2 T02, unit 05. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "vit_gpt_2026_07_02_t02_001";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "协助患者坐到椅子上，以预防术后 atelectasis。",
    after: "协助患者离床坐到椅子上，以预防术后肺不张。",
  }),
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "给予医嘱的 opioid analgesic，并在疼痛改善后重新评估切口。",
    after: "按医嘱给予阿片类镇痛药，待疼痛缓解后重新评估切口。",
  }),
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "通知 surgeon 或启动机构 escalation process，并准备进行 fluid 或 blood replacement。",
    after: "通知外科医生或启动本机构的升级处置流程，并做好补液或输血准备。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "疼痛可能使 heart rate 上升，但同时出现血压下降和 pulse pressure 变窄，使 hemorrhage 成为优先问题。",
    after: "疼痛可使心率上升，但同时出现血压下降和脉压缩小，应优先考虑出血。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "单纯加固敷料只处理了可见渗血，却忽略了正在恶化的 hemodynamic trend。",
    after: "仅加固敷料只能处理看得见的渗血，忽略了血流动力学持续恶化的趋势。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "这是正确的，因为术后背景加上 tachycardia、血压下降和 pulse pressure 变窄，提示可能存在 hemorrhage。",
    after: "此项正确。患者术后出现心动过速、血压下降和脉压缩小，提示可能存在出血。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "术后肺部护理很重要，但当趋势提示 perfusion 不稳定时，下床或坐椅子并不安全。",
    after: "术后肺部护理很重要，但当生命体征趋势提示灌注不稳定时，让患者下床行走或离床坐椅都有危险。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "趋势显示术后 heart rate 上升、systolic pressure 下降，并且 pulse pressure 逐渐变窄。虽然可见引流量描述为少量，但连续生命体征提示 postoperative hemorrhage 正在进展，需要紧急升级处理并准备补充容量。",
    after: "术后心率逐渐上升，收缩压下降，脉压缩小。虽然敷料上仅见少量渗血，但连续测得的生命体征提示术后出血正在进展，需要紧急升级处理，并准备补充血容量。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "不要被敷料描述里的“少量”分散注意。术后患者要连续比较 HR、SBP 和 pulse pressure；tachycardia 加 pulse pressure 变窄是出血警讯。",
    after: "不要因敷料上只有“少量”渗血而忽视其他表现。应比较术后连续测得的心率、收缩压和脉压；脉压缩小并伴心动过速是出血的警讯。",
  }),
];

runPatch(ops);
