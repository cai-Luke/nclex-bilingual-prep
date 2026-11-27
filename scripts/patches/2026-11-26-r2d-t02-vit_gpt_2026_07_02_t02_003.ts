// D-2 T02, unit 07. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "vit_gpt_2026_07_02_t02_003";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["matrix", "rows", {"id":"r2"}, "zh"],
    before: "尽管给予 fluid bolus，hypotension 仍在恶化。",
    after: "尽管已快速补液，低血压仍在加重。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r4"}, "zh"],
    before: "仅根据这个趋势，患者已经稳定到可以 discharge。",
    after: "仅凭这一趋势，即可判断患者病情已稳定，可以出院。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r5"}, "zh"],
    before: "respiratory rate 正在向成人预期范围靠近。",
    after: "呼吸频率正在接近成人的预期范围。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r4"}, "zh"],
    before: "趋势不支持。bolus 后改善是好迹象，但 acute pancreatitis 仍需要继续临床评估，不能仅凭趋势决定 discharge。",
    after: "趋势不支持。快速补液后病情改善是好迹象，但对于急性胰腺炎，除观察生命体征趋势外，还需持续进行临床评估。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "fluid bolus 后，MAP 上升、SBP 上升、HR 下降、RR 下降。这支持患者对 volume replacement 反应改善，但仅凭这个趋势不能说明可以出院。",
    after: "快速补液后，平均动脉压和收缩压上升，心率和呼吸频率下降，提示补充血容量后病情改善。但单凭这一趋势尚不能判断患者可以出院。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名成人患者有 acute pancreatitis 和反复 vomiting，按医嘱接受 isotonic IV fluid bolus。护士查看补液后的生命体征趋势。对每个陈述，选择它是否得到趋势支持。",
    after: "一名成人急性胰腺炎患者反复呕吐，按医嘱接受等渗液体快速静脉补液。请根据补液后的生命体征趋势，判断下列各项陈述是否有依据。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "遇到 response-to-intervention 题，要比较 intervention 前后的同一组指标。真正改善通常是多个相关数值一起好转，而不是单一读数。",
    after: "判断干预效果时，应比较干预前后相同指标的变化。病情改善通常体现在多个相关指标上，不能仅凭一次孤立的读数判断。",
  }),
];

runPatch(ops);
