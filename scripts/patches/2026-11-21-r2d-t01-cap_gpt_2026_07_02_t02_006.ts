// D-2 T01, unit 12. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "cap_gpt_2026_07_02_t02_006";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["matrix", "rows", {"id":"r1"}, "zh"],
    before: "怀疑 esophageal 或 displaced tube，并呼叫立即重新评估 airway。",
    after: "怀疑导管误入食管或发生移位，请团队立即重新评估气道。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r2"}, "zh"],
    before: "因为患者之前已经 intubated，所以将 tube 固定在当前位置。",
    after: "因为患者先前已接受气管插管，将导管固定在当前位置。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r3"}, "zh"],
    before: "在团队按 protocol 纠正 airway 时，使用 bag-mask 或其他 rescue method 进行通气。",
    after: "在团队按规程纠正气道问题的同时，用球囊面罩或其他抢救方法通气。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r4"}, "zh"],
    before: "把该波形当作 bronchospasm，等 bronchodilator therapy 后再重新评估位置。",
    after: "按支气管痉挛处理该波形，待给予支气管扩张剂后再重新评估导管位置。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r1"}, "zh"],
    before: "适用。图像显示没有呼出 CO2，加上 epigastric sounds 和胸廓起伏差，使 tube displacement 或 esophageal ventilation 成为首要担忧。",
    after: "适用。图中未见呼出 CO2 的波形，加上上腹部咕噜声和胸廓起伏不良，应首先考虑导管移位或气体进入食管。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r2"}, "zh"],
    before: "不适用。之前 intubated 不能推翻当前通气未到达肺部的证据。",
    after: "不适用。即使先前已完成气管插管，当前表现仍提示通气时气体未能进入肺部。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r3"}, "zh"],
    before: "适用。在纠正 misplaced 或 displaced airway 时必须维持 oxygenation 和 ventilation。",
    after: "适用。在纠正导管误置或移位时，必须维持患者的氧合和通气。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r4"}, "zh"],
    before: "不适用。bronchospasm 通常会产生 shark-fin waveform，而不是伴 epigastric gurgling 的无呼出 CO2。",
    after: "不适用。支气管痉挛通常产生鲨鱼鳍样波形，无法解释此处未检测到呼出的 CO2 且伴有上腹部咕噜声的表现。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "转运后 flat capnogram、胸廓起伏很小，以及 bagging 时 epigastric gurgling，提示 airway 可能不在 trachea 或已 displaced。优先是立即重新评估 airway，并在团队纠正位置时提供 rescue ventilation。",
    after: "转运后出现平直的二氧化碳波形，球囊通气时胸廓起伏很小，并有上腹部咕噜声，提示导管可能不在气管内或已发生移位。应立即重新评估气道，并在团队纠正导管位置时提供抢救性通气。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名已 intubated 的患者由院际转运到达。转运团队报告出发时 tube 已固定，但卸车时患者变得 restless。护士在 bagging 时听到 epigastrium 有 gurgling，胸廓起伏很小。如下为 capnogram。请判断每项可能解释或措施是 indicated 还是 contraindicated。",
    after: "一名已行气管插管的患者从另一家医疗机构转运到院。转运团队称，出发时导管固定牢靠，但患者在下车时变得烦躁不安。护士用球囊通气时听到上腹部咕噜声，胸廓起伏很小。呼气末二氧化碳波形图如下。请逐项判断下列解释或措施在此时是否适用。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "flat waveform 题必须看上下文。epigastric gurgling 和胸廓起伏差说明这是 airway placement emergency，不是单纯通气波形细节。",
    after: "要结合临床表现判断平直波形的意义。上腹部咕噜声和胸廓起伏不良提示导管位置可能有问题，需要紧急处理，不能仅关注通气波形的细微差异。",
  }),
];

runPatch(ops);
