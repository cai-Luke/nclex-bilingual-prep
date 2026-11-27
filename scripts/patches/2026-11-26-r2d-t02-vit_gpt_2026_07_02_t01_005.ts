// D-2 T02, unit 03. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "vit_gpt_2026_07_02_t01_005";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["matrix", "rows", {"id":"r1"}, "zh"],
    before: "按 protocol 或医嘱通过合适通路开始 vasopressor，例如 norepinephrine。",
    after: "按规程或医嘱，通过合适的静脉通路开始使用升压药，如去甲肾上腺素。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r2"}, "zh"],
    before: "继续频繁评估 mentation、skin perfusion、blood pressure 和 urine output。",
    after: "继续频繁评估意识状态、皮肤灌注、血压和尿量。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r4"}, "zh"],
    before: "因为 heart rate 仍高，先给予 beta-blocker。",
    after: "由于心率持续升高，先给予 β 受体阻滞剂。",
  }),
  setValue({
    id, path: ["matrix", "rows", {"id":"r5"}, "zh"],
    before: "因为 fluid resuscitation 已完成，停止频繁 blood pressure 监测。",
    after: "由于液体复苏已经完成，停止频繁监测血压。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r1"}, "zh"],
    before: "适合。septic shock 中 fluids 后 MAP 持续低于 65，符合预期 vasopressor 支持。",
    after: "合适。脓毒性休克患者补液后平均动脉压仍持续低于 65，应预期需要升压药支持。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r2"}, "zh"],
    before: "适合。MAP 下降和尿量低需要密切重新评估 perfusion。",
    after: "合适。平均动脉压下降且尿量偏低，需要密切复评灌注情况。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r3"}, "zh"],
    before: "不适合。体温略降不能抵消 hemodynamics 和 perfusion 恶化。",
    after: "不合适。不能因体温略有下降而忽视血流动力学和灌注状况的恶化。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r4"}, "zh"],
    before: "不适合。tachycardia 很可能是代偿；支持 perfusion 才是优先。",
    after: "不合适。心动过速很可能是代偿反应，应优先维持灌注。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"r5"}, "zh"],
    before: "不适合。补液完成并不代表 shock 已解除。",
    after: "不合适。已完成补液并不表示休克已经纠正。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "尽管已进行初始 fluid resuscitation，趋势仍持续恶化：HR 和 RR 上升，MAP 低于 65 mm Hg 且继续下降，尿量也低。这提示 fluids 后 perfusion 仍不足，需要预期 vasopressor 支持并密切监测。",
    after: "尽管已接受初始液体复苏，患者的病情仍在恶化：心率和呼吸频率上升，平均动脉压持续低于 65 mm Hg 且继续下降，尿量也偏低。这提示补液后灌注仍不足，应预期需要升压药支持，并密切监测。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名成人患者因 pneumonia-related sepsis 已接受医嘱的初始 IV fluid resuscitation。目前尿量为 15 mL/hr。护士查看生命体征趋势。对于每项可能的 provider order 或护理措施，选择是否适合预期。",
    after: "一名因肺炎发生脓毒症的成人患者已按医嘱接受初始静脉液体复苏，目前尿量为 15 mL/hr。请根据生命体征趋势，判断护士是否应预期下列各项医嘱或护理措施。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "sepsis 题里，治疗后 fever 下降可能是干扰项。优先看 perfusion 趋势：MAP、尿量、意识、皮肤、HR 和 RR。",
    after: "判断脓毒症患者的病情时，治疗后体温有所下降容易分散注意力。应优先结合平均动脉压、尿量、意识状态、皮肤表现、心率和呼吸频率，判断灌注的变化趋势。",
  }),
];

runPatch(ops);
