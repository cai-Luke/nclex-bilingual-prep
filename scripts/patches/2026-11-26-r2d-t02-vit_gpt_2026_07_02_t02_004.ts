// D-2 T02, unit 08. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "vit_gpt_2026_07_02_t02_004";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "患者正在恶化，因为 15 分钟时 heart rate 仍超过 100；准备 atropine。",
    after: "15 分钟时心率仍超过 100 次/分，说明病情正在恶化，应准备阿托品。",
  }),
  setValue({
    id, path: ["options", {"id":"A"}, "zh"],
    before: "患者正在对治疗产生反应；继续密切 monitoring，并准备在 airway、breathing 或 circulation 问题复发时重复给予 epinephrine。",
    after: "治疗已见效，应继续密切监测，并做好准备，若再次出现气道、呼吸或循环问题，则再次给予肾上腺素。",
  }),
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "这个趋势最强烈提示 septic shock，而不是 allergic reaction。",
    after: "这一趋势更符合脓毒性休克，而非过敏反应。",
  }),
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "患者已完全稳定；停止 pulse oximetry 和 blood pressure monitoring。",
    after: "患者病情已完全稳定，可以停止脉搏血氧饱和度和血压监测。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "这是正确的，因为 epinephrine 后生命体征朝预期方向改善，同时患者仍需要 observation。",
    after: "此项正确。使用肾上腺素后，生命体征朝预期方向改善，但仍需继续观察。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "题干说明患者在 IV antibiotic 后立即出现 hives 和 wheezing，且 epinephrine 后趋势改善，支持 anaphylaxis 的治疗反应。",
    after: "患者在静脉输注抗生素后迅速出现荨麻疹和喘鸣音，给予肾上腺素后生命体征改善，符合过敏性休克治疗见效的表现。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "anaphylaxis 后不应停止 monitoring，因为可能出现复发或 biphasic symptoms。",
    after: "过敏性休克后可能出现症状复发或双相症状，因此仍需继续监测。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "15 分钟时 HR 略高于 100 不如整体趋势重要；BP、MAP、oxygenation、RR 和 HR 都在改善。",
    after: "虽然 15 分钟时心率仍略高于 100 次/分，但更重要的是血压、平均动脉压、氧合、呼吸频率和心率整体都在改善。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "epinephrine 后的趋势显示 circulation 和 oxygenation 改善：SBP 和 MAP 上升、SpO2 上升、RR 下降、HR 下降。这支持治疗反应良好，但 anaphylaxis 仍需密切 monitoring，因为症状可能复发。",
    after: "给予肾上腺素后，收缩压、平均动脉压和 SpO2 上升，呼吸频率和心率下降，提示循环与氧合均有改善。患者对治疗反应良好，但过敏性休克的症状可能复发，仍需密切监测。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名成人患者接受 IV antibiotic 后不久出现 hives、wheezing 和 hypotension。输液已停止，并已给予 IM epinephrine 和 oxygen。护士查看生命体征趋势。哪项解释最恰当？",
    after: "一名成人患者在静脉输注抗生素后不久出现荨麻疹、喘鸣音和低血压。已停止输注，并给予肌肉注射肾上腺素和吸氧。护士查看生命体征趋势后，作出哪项判断最恰当？",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "当题干已经给出 intervention，要判断多个相关数值是否朝正确方向变化。anaphylaxis 中，epinephrine 后 BP、SpO2、RR 和 HR 改善支持治疗有效，但不等于可以停止 monitoring。",
    after: "如果已经实施干预，应查看多个相关指标是否朝预期方向变化。过敏性休克患者使用肾上腺素后，血压、SpO2、呼吸频率和心率改善，说明治疗有效，但仍需继续监测。",
  }),
];

runPatch(ops);
