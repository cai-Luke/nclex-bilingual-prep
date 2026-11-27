// D-2 T02, unit 16. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "vit_gpt_2026_07_02_t03_006";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "安慰患者敷料干燥已经排除 significant bleeding。",
    after: "安慰患者，说明敷料干燥已排除明显出血。",
  }),
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "让患者保持 bed rest，并立即通知 provider 或 rapid response team。",
    after: "让患者卧床休息，并立即通知诊疗人员或快速反应团队。",
  }),
  setValue({
    id, path: ["options", {"id":"A"}, "zh"],
    before: "即使敷料干燥，也应怀疑 occult internal bleeding，例如 retroperitoneal hematoma。",
    after: "尽管敷料干燥，仍应怀疑有隐匿性内出血，如腹膜后血肿。",
  }),
  setValue({
    id, path: ["options", {"id":"E"}, "zh"],
    before: "只给予医嘱 analgesic，并在常规查房时复查。",
    after: "仅按医嘱给予镇痛药，待常规巡视时再评估。",
  }),
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "按医嘱准备 IV fluid 或 blood replacement，同时继续 neurovascular 和穿刺部位评估。",
    after: "按医嘱准备静脉补液或输血，同时继续评估神经血管状况和穿刺部位。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "保持 bed rest 并紧急升级处理是适当的，因为连续生命体征提示 perfusion 不稳定。",
    after: "连续测得的生命体征提示灌注不稳定，因此让患者卧床休息并紧急升级处理是合适的。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "femoral access 后敷料干燥并不能排除 retroperitoneal bleeding。",
    after: "经股动脉穿刺后，即使敷料干燥，也不能排除腹膜后出血。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "当 hemodynamic trend 提示 significant bleeding 时，可能需要 fluid 或 blood replacement。",
    after: "当血流动力学变化提示失血量较大时，可能需要补液或输血。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "趋势显示 femoral-access procedure 后 HR 和 RR 上升，SBP、MAP 下降，pulse pressure 变窄。出现新的 back 或 flank pain，即使腹股沟敷料干燥，也可能提示 occult retroperitoneal bleeding，需要紧急升级处理并准备补容量。",
    after: "经股动脉穿刺操作后，心率和呼吸频率上升，收缩压和平均动脉压下降，脉压缩小。即使腹股沟敷料干燥，新出现的背部或侧腹部疼痛仍可能提示隐匿性腹膜后出血，需要紧急升级处理，并准备补充血容量。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名成人患者 transfemoral cardiac catheterization 后 3 小时。腹股沟敷料干燥，但患者报告新的 lower back 和 flank pain。护士查看生命体征趋势。哪些判断或措施是适当的？选择所有适用项。",
    after: "一名成人患者经股动脉心导管检查后 3 小时，腹股沟敷料干燥，但患者诉新出现下背部和侧腹部疼痛。护士查看生命体征趋势后，哪些判断或措施合适？请选择所有适用项。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "如果操作部位看起来干净，但趋势显示 shock，要想到 hidden bleeding。femoral access 后新的 flank 或 back pain 是关键限制线索。",
    after: "若穿刺部位外观正常，但生命体征趋势提示休克，应想到隐匿性出血。经股动脉穿刺后新发的侧腹部或背部疼痛，是帮助判断原因的重要线索。",
  }),
];

runPatch(ops);
