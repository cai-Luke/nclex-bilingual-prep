// D-2 T01, unit 20. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "vit_gpt_2026_07_02_t01_002";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "给予医嘱 opioid，并记录疼痛最可能导致脉搏变化。",
    after: "按医嘱给予阿片类镇痛药，并记录疼痛是脉搏变化最可能的原因。",
  }),
  setValue({
    id, path: ["options", {"id":"A"}, "zh"],
    before: "评估 incision、dressing、drain output 和腹部是否有 bleeding 或 distention。",
    after: "检查切口、敷料、引流量和腹部，评估有无出血或腹胀。",
  }),
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "通知 surgeon 或 rapid response team，并报告连续生命体征变化。",
    after: "通知外科医生或快速反应团队，报告多次测量所见的生命体征变化。",
  }),
  setValue({
    id, path: ["options", {"id":"E"}, "zh"],
    before: "维持 IV access，并预期可能需要 isotonic fluids、blood work 和 type and screen 医嘱。",
    after: "保持静脉通路通畅，预期可能收到给予等渗液体、抽血化验以及进行血型和抗体筛查的医嘱。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "这是正确的，因为即使敷料渗液少，趋势仍提示 internal 或 concealed bleeding 风险。",
    after: "正确。尽管敷料上渗液很少，生命体征的变化仍提示可能存在内出血或隐匿性出血。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"F"}, "zh"],
    before: "当生命体征显示 perfusion 恶化时，渗液少并不能让人放心。",
    after: "生命体征显示灌注正在恶化时，不能仅因敷料上渗液少就认为病情平稳。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"E"}, "zh"],
    before: "这是正确的，因为疑似出血需要准备 vascular access、实验室检查，以及按医嘱补液或输血。",
    after: "正确。怀疑出血时，应做好建立血管通路、送检血样以及按医嘱补充血容量或输血的准备。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "趋势显示术后 tachycardia、tachypnea 逐渐加重，blood pressure 和 MAP 下降，pulse pressure 变窄。少量可见渗液不能排除 concealed postoperative hemorrhage，因此需要评估并紧急升级处理。",
    after: "趋势图显示，患者术后心动过速和呼吸急促逐渐加重，血压和平均动脉压下降，脉压变窄。可见的渗液很少，仍不能排除术后隐匿性出血，因此需要及时评估并紧急升级处置。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "不要只盯着敷料。术后连续 tachycardia 加上压力下降，比单次看到少量渗液更重要。",
    after: "不要只看敷料。术后多次测量均见心动过速且血压下降，这一趋势比一次检查仅见少量渗液更值得重视。",
  }),
];

runPatch(ops);
