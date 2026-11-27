// D-2 T02, unit 10. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "vit_gpt_2026_07_02_t02_006";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["matrix", "rows", {"id":"r1"}, "zh"],
    before: "将该趋势解释为 replacement therapy 后 hemodynamic response 改善。",
    after: "判断输血和补液后患者的血流动力学状况正在改善。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r3"}, "zh"],
    before: "继续密切 monitoring，并复评 perfusion 指标，例如 mentation 和 urine output。",
    after: "继续密切监测，并重新评估精神状态、尿量等灌注指标。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r5"}, "zh"],
    before: "协助患者走到厕所，因为趋势已经完全 normal。",
    after: "由于生命体征已完全恢复正常，协助患者步行去卫生间。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r2"}, "zh"],
    before: "不合适。趋势没有显示 fever、hypotension 恶化或 respiratory decline，不能支持 transfusion reaction。",
    after: "不合适。生命体征趋势未显示发热、低血压加重或呼吸状况恶化等支持输血反应的表现。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r3"}, "zh"],
    before: "合适。改善需要通过持续 perfusion assessments 来确认，而不能只看一次较好的生命体征。",
    after: "合适。应持续评估灌注以确认病情改善，不能仅凭一组好转的生命体征作判断。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r5"}, "zh"],
    before: "不合适。趋势正在改善，但近期 GI bleed 和 replacement therapy 仍需要 fall precautions 和持续 monitoring。",
    after: "不合适。尽管趋势有所改善，但患者近期发生过胃肠道出血，正在接受输血和补液，仍需采取防跌倒措施并持续监测。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "replacement therapy 后趋势显示改善：MAP 和 SBP 上升，HR 和 RR 下降，SpO2 稳定，体温没有明显上升。患者仍需密切 monitoring，因为 hemorrhage 可能复发，改善并不等于完全 normal。",
    after: "输血和补液后，平均动脉压和收缩压上升，心率和呼吸频率下降，SpO2 稳定，体温未出现令人担忧的升高。病情虽有改善，但尚不能据此认定各项指标均已恢复正常。出血仍可能复发，需继续密切监测。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名 gastrointestinal bleed 成人患者已接受 rapid response evaluation，正在按医嘱输注 packed red blood cells 和 isotonic IV fluids。护士查看生命体征趋势。对每个护理判断或措施，选择它是否基于趋势合适。",
    after: "一名成人胃肠道出血患者已经过快速反应团队评估，目前正按医嘱输注浓缩红细胞和等渗静脉液体。请根据生命体征趋势，判断下列各项护理判断或措施是否合适。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "“改善”不等于“正常”。hemorrhage response 题要找 MAP 上升、HR 下降，然后选择继续 monitoring，而不是不安全的活动。",
    after: "病情改善并不等于完全恢复正常。评估出血治疗效果时，应观察平均动脉压是否上升、心率是否下降，并选择继续监测，避免不安全的活动。",
  }),
];

runPatch(ops);
