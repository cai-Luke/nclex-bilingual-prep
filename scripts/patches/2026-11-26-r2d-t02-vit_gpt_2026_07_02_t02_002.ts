// D-2 T02, unit 06. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "vit_gpt_2026_07_02_t02_002";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"F"}, "zh"],
    before: "协助患者在走廊 ambulate，以降低 atelectasis 风险。",
    after: "协助患者在走廊行走，以降低肺不张的风险。",
  }),
  setValue({
    id, path: ["options", {"id":"A"}, "zh"],
    before: "启动机构 sepsis escalation process，或立即通知 provider。",
    after: "启动本机构的脓毒症升级处置流程，或立即通知诊疗人员。",
  }),
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "给予 acetaminophen 并等待 4 小时后再评估，因为 fever 可以解释这个趋势。",
    after: "给予对乙酰氨基酚，等 4 小时后再评估，因为发热足以解释这些变化。",
  }),
  setValue({
    id, path: ["options", {"id":"E"}, "zh"],
    before: "开始医嘱的 isotonic IV fluid bolus，并重新评估 perfusion 指标。",
    after: "按医嘱开始快速静脉输注等渗液体，并重新评估灌注指标。",
  }),
  setValue({
    id, path: ["options", {"id":"D"}, "zh"],
    before: "等最终 urine culture 报告出来后再给予 broad-spectrum antibiotic。",
    after: "待最终尿培养报告出具后再给予广谱抗生素。",
  }),
  setValue({
    id, path: ["options", {"id":"C"}, "zh"],
    before: "及时取得医嘱的 lactate 和 blood cultures，但不要因此延误 antibiotic administration。",
    after: "按医嘱及时采血测定血乳酸并送血培养，同时避免延误抗生素给药。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"F"}, "zh"],
    before: "当 perfusion 正在恶化时，ambulation 不是优先事项，也可能不安全。",
    after: "灌注恶化时，下床行走并非当前的优先事项，还可能有危险。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"B"}, "zh"],
    before: "Fever 可能导致 tachycardia，但不能安全解释 MAP 下降和 RR 上升，因此不能等待。",
    after: "发热可使心率加快，但仅用发热解释平均动脉压下降和呼吸频率上升，便推迟处理，并不安全。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"E"}, "zh"],
    before: "这是正确的，因为 MAP 下降支持需要按医嘱进行 isotonic fluid resuscitation 并复评。",
    after: "此项正确。平均动脉压下降提示需要按医嘱使用等渗液体进行复苏，随后重新评估。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "这是正确的，因为 lactate 和 cultures 有助于评估 sepsis，但不应不必要地延误 antibiotics。",
    after: "此项正确。血乳酸和培养结果有助于评估脓毒症，但不应因此无谓地延误抗生素治疗。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"D"}, "zh"],
    before: "当趋势提示可能的 septic shock 进展时，等待最终 culture 报告是不安全的。",
    after: "当趋势提示病情可能正向脓毒性休克发展时，等待最终培养报告并不安全。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "这是正确的，因为趋势提示疑似感染患者的 perfusion 正在恶化。",
    after: "此项正确。这名疑似感染患者的生命体征趋势提示灌注正在恶化。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "趋势显示感染相关恶化：HR 和 RR 上升，同时 MAP 下降到 64 mm Hg。这种模式需要 sepsis 升级处理、按医嘱及时抽取 cultures 和 lactate、迅速给予 antibiotics，并进行 fluid resuscitation，而不是延迟复评。",
    after: "生命体征趋势提示感染相关的病情恶化：心率和呼吸频率上升，平均动脉压降至 64 mm Hg。此时应按脓毒症升级处理，按医嘱及时采血送培养并测定乳酸，尽快给予抗生素并进行液体复苏，不能推迟复评。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名留置 urinary catheter 的成人患者疑似 catheter-associated urinary tract infection。已有 blood cultures、serum lactate、broad-spectrum antibiotics 和 isotonic IV fluids 的医嘱。护士查看生命体征趋势。护士应采取哪些措施？选择所有适用项。",
    after: "一名留置导尿管的成人患者疑似发生导尿管相关尿路感染。现有医嘱包括血培养、血乳酸检测、使用广谱抗生素和静脉输注等渗液体。护士查看生命体征趋势后应采取哪些措施？请选择所有适用项。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "遇到疑似感染，要看“组合”而不是单个数字：HR 上升、RR 上升、fever 和 MAP 下降一起出现，指向 sepsis 进展。",
    after: "判断疑似感染时，应综合观察各项指标。心率上升、呼吸频率上升、发热和平均动脉压下降同时出现，提示脓毒症可能正在进展。",
  }),
];

runPatch(ops);
