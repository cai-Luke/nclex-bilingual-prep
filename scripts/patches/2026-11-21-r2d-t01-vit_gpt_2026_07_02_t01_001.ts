// D-2 T01, unit 19. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "vit_gpt_2026_07_02_t01_001";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "通知 provider 或启动机构 escalation protocol，并准备配合 sepsis resuscitation。",
    after: "通知负责诊疗的医务人员或启动本机构的病情升级处置流程，并准备配合脓毒症复苏。",
  }),
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "记录该趋势是开始 antibiotics 后预期的早期反应。",
    after: "记录该趋势为开始使用抗生素后的预期早期反应。",
  }),
  setValue({
    id, path: ["options", {"id":"A"}, "zh"],
    before: "给予医嘱的 acetaminophen，并在下一次常规测量生命体征时重新评估体温。",
    after: "按医嘱给予对乙酰氨基酚，在下一次常规测量生命体征时复查体温。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "这是正确的，因为感染背景加上 HR/RR 上升、MAP 下降，指向可能的 septic shock 进展。",
    after: "正确。患者有感染，心率和呼吸频率上升，平均动脉压下降，提示病情可能正向脓毒性休克发展。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "当趋势提示 perfusion 不稳定时，口服补液和下床活动不合适。",
    after: "生命体征趋势提示灌注不稳定，此时不宜鼓励患者口服补液或下床活动。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "Acetaminophen 可以处理发热，但不能处理趋势中显示的 perfusion 恶化。",
    after: "对乙酰氨基酚可以退热，但无法纠正生命体征趋势所提示的灌注恶化。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "开始 antibiotics 并不代表 worsening hypotension 和 tachypnea 是可预期、可安全观察的情况。",
    after: "即使已开始使用抗生素，也不能将不断加重的低血压和呼吸急促视为预期反应，或认为仅观察而不升级处置是安全的。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "趋势显示在感染背景下 heart rate 和 respiratory rate 上升，同时 MAP 下降。这提示 sepsis 正在恶化并出现 perfusion 受损，需要紧急升级处理，而不是常规复查。",
    after: "患者有感染，生命体征趋势显示心率和呼吸频率上升，同时平均动脉压下降。这提示脓毒症可能正在恶化，灌注受损，需要紧急升级处置，不能等到常规复查。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名成人患者因 pyelonephritis 住院，正在接受 IV fluids 和第一剂 antibiotics。护士查看生命体征趋势。哪项措施最优先？",
    after: "一名成人患者因肾盂肾炎住院，正在接受静脉补液和首剂抗生素治疗。护士查看了患者的生命体征趋势。应优先采取哪项措施？",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "题干有感染时，要跨时间比较 HR、RR 和 MAP。MAP 下降同时 HR/RR 上升，是 perfusion 问题，不只是 fever 问题。",
    after: "题干提示感染时，要比较各时点的心率、呼吸频率和平均动脉压。平均动脉压下降，同时心率和呼吸频率上升，提示存在灌注问题，不能仅用发热来解释。",
  }),
];

runPatch(ops);
