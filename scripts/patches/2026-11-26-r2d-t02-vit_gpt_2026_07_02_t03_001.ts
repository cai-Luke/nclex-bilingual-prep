// D-2 T02, unit 11. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "vit_gpt_2026_07_02_t03_001";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["matrix", "rows", {"id":"r1"}, "zh"],
    before: "同一时间段内 heart rate 和 respiratory rate 持续上升。",
    after: "同一时段内，心率和呼吸频率均上升。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r2"}, "zh"],
    before: "使用 acetaminophen 后 temperature 接近正常。",
    after: "给予对乙酰氨基酚后，体温接近正常。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r1"}, "zh"],
    before: "感染治疗后 tachycardia 和 tachypnea 同时加重，是令人担忧的变化。",
    after: "接受抗感染治疗后，心动过速与呼吸过快仍同时加重，值得警惕。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r2"}, "zh"],
    before: "使用 acetaminophen 后体温下降，并不能证明 sepsis 好转，尤其当 perfusion 和 respiratory trend 变差时。",
    after: "给予对乙酰氨基酚后体温下降，并不能证明脓毒症好转，尤其是在灌注和呼吸状况都在恶化时。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r3"}, "zh"],
    before: "MAP 随时间下降，提示 perfusion 正在恶化，即使尚未出现严重 hypotension。",
    after: "平均动脉压持续下降，提示灌注正在恶化，即使此时尚未出现严重低血压。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "虽然 fever 降低，但完整趋势显示 HR 和 RR 上升、MAP 下降，并且氧合略有下降。对于 pneumonia 患者，这种模式更像 sepsis progression，而不是感染正在好转。",
    after: "虽然体温有所下降，但整体趋势显示心率和呼吸频率上升，平均动脉压下降，氧合略有恶化。对肺炎患者而言，与感染好转相比，这一变化更应引起对脓毒症进展的警觉。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名成人 pneumonia 患者 4 小时前已给予 IV antibiotics 和 acetaminophen。患者现在说：\"我觉得更虚弱。\" 护士查看生命体征趋势。针对每个发现，选择它是 escalation cue，还是不足以让护士放心。",
    after: "一名成人肺炎患者于 4 小时前接受了静脉抗生素治疗，并使用了对乙酰氨基酚。患者现在说：“我觉得比刚才更没力气了。”请根据生命体征趋势判断：下列各项是提示需要升级处理的线索，还是看似好转却不足以让人放心的表现？",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "不要只盯着体温改善。感染题要比较完整趋势：即使 fever 暂时下降，HR、RR、MAP 和氧合也可能显示病情恶化。",
    after: "不要只看体温是否下降。评估感染患者时应比较整体趋势：即使发热暂时缓解，心率、呼吸频率、平均动脉压和氧合的变化仍可能提示病情恶化。",
  }),
];

runPatch(ops);
