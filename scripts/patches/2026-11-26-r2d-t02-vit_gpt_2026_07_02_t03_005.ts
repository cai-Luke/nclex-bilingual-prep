// D-2 T02, unit 15. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "vit_gpt_2026_07_02_t03_005";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["matrix", "rows", {"id":"r1"}, "zh"],
    before: "将 MAP、HR 和 RR 趋势识别为 hemodynamic response 改善。",
    after: "根据平均动脉压、心率和呼吸频率的变化，判断血流动力学状况已有改善。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r2"}, "zh"],
    before: "按 protocol 继续 titrate norepinephrine，并监测 perfusion。",
    after: "继续按规程调整去甲肾上腺素的剂量，同时监测灌注。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r3"}, "zh"],
    before: "因为血压改善，停止 antimicrobial therapy。",
    after: "由于血压已改善，停止抗微生物治疗。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r4"}, "zh"],
    before: "因为 temperature 略有下降，就认定 source control 已完成。",
    after: "由于体温略有下降，认定感染源控制已经完成。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r1"}, "zh"],
    before: "这是适当的，因为完整趋势显示 perfusion pressure 改善，同时代偿性 tachycardia 和 tachypnea 减轻。",
    after: "适当。整体趋势显示灌注压改善，代偿性心动过速和呼吸过快均有所缓解。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r2"}, "zh"],
    before: "出现 vasopressor response 后，继续按 protocol 调整并监测 perfusion 是适当的。",
    after: "升压药起效后，应继续按规程调整剂量并监测灌注。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r3"}, "zh"],
    before: "血压改善并没有治疗感染源，不能作为停止 antimicrobials 的理由。",
    after: "血压改善并未消除感染源，不能据此停用抗微生物药物。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r4"}, "zh"],
    before: "temperature 略降并不能证明 perforated appendicitis 的感染源已被控制。",
    after: "体温略有下降并不能证明阑尾炎穿孔所致的感染源已得到控制。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "开始 norepinephrine 后，趋势显示 MAP 从低于 65 升至高于 65，HR 和 RR 下降，支持 hemodynamics 改善。但生命体征改善并不代表感染治疗或 source control 已完成。",
    after: "开始使用去甲肾上腺素后，平均动脉压从低于 65 升至高于 65，心率和呼吸频率下降，提示血流动力学状况改善。但生命体征改善并不能说明感染治疗或感染源控制已经完成。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名 47 岁成人因 perforated appendicitis 发生 septic shock，已接受初始 crystalloid bolus。time 0 时开始 norepinephrine。护士查看生命体征趋势。针对每项解释或措施，选择 appropriate 或 unsafe/unsupported。",
    after: "一名 47 岁成人患者因阑尾炎穿孔发生脓毒性休克，已接受初始晶体液快速补液，在时间点 0 开始使用去甲肾上腺素。请根据生命体征趋势，判断下列各项解释或措施是适当，还是不安全或证据不足。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "要区分 perfusion response 和 infection control。使用 vasopressor 后 MAP 与 HR 可以改善，但患者仍需要 antibiotics、source control 和密切监测。",
    after: "应分别判断灌注和感染控制情况。使用升压药后，平均动脉压和心率可以改善，但患者仍需抗生素治疗、感染源控制和密切监测。",
  }),
];

runPatch(ops);
