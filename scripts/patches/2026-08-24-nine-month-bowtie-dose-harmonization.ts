/**
 * Follow-on family-consistency correction for the standalone nine-month
 * well-child acetaminophen bow-tie.
 *
 * The historical answerability patch remains unchanged. This patch only
 * harmonizes the standalone item's documented reference dose with the
 * independently reviewed companion case: 5 mL -> 3.75 mL. Product
 * concentration, reported exposure, IDs, keys, cardinality, scoring, and all
 * previously approved answerability logic are preserved.
 */
import { runPatch, setValue, type PatchOp } from "../patch-raw";

export const BANK_PATH = "banks/gpt-canonical.json";
export const PATCH_REASON =
  "harmonize nine-month standalone bowtie acetaminophen reference dose with independently source-corrected companion case";

const id = "gpt_case_nine_month_well_child_safety_01_bowtie";

const ops: PatchOp[] = [
  setValue({
    id,
    path: ["stem", "en"],
    before: "During Liam's nine-month well-child visit, he reaches for a cosmetics pouch containing an uncapped bottle of liquid acetaminophen. The nurse immediately moves the pouch and medication out of Liam's reach. His caregiver, Danielle, is warm and attentive and willingly describes how she gives medicines. She becomes tearful and says she has little reliable support or guidance and followed informal advice. Danielle reports giving Liam 15 mL of acetaminophen labeled 160 mg/5 mL; the clinic's weight-band dosing table in the record lists 5 mL for Liam. The record does not yet document when the 15 mL dose was last given, how often it was given, or whether Liam received another acetaminophen-containing product. Complete the bow-tie by selecting the most likely condition, two priority nursing actions, and two parameters to evaluate.",
    after: "During Liam's nine-month well-child visit, he reaches for a cosmetics pouch containing an uncapped bottle of liquid acetaminophen. The nurse immediately moves the pouch and medication out of Liam's reach. His caregiver, Danielle, is warm and attentive and willingly describes how she gives medicines. She becomes tearful and says she has little reliable support or guidance and followed informal advice. Danielle reports giving Liam 15 mL of acetaminophen labeled 160 mg/5 mL; the clinic's weight-band dosing table in the record lists 3.75 mL for Liam. The record does not yet document when the 15 mL dose was last given, how often it was given, or whether Liam received another acetaminophen-containing product. Complete the bow-tie by selecting the most likely condition, two priority nursing actions, and two parameters to evaluate.",
    note: "Harmonize the standalone English stem's documented dose while preserving concentration and exposure history.",
  }),
  setValue({
    id,
    path: ["stem", "zh"],
    before: "Liam 进行 9 个月婴儿保健访视期间，他伸手去够一个化妆包，包内有一瓶未盖好瓶盖的液体对乙酰氨基酚。护士立即将化妆包和药物移到 Liam 无法触及之处。他的照护者 Danielle 对 Liam 温暖且细心，并主动说明自己如何给药。她说着说着流下眼泪，表示自己缺少可靠的支持或指导，之前听从了非正式建议。Danielle 报告曾给 Liam 服用 15 mL、浓度为 160 mg/5 mL 的对乙酰氨基酚；诊所病历中的体重分档剂量表为 Liam 列出的剂量是 5 mL。目前病历尚未记录最近一次 15 mL 给药的时间、这种剂量给了几次，也未记录 Liam 是否还服用了其他含对乙酰氨基酚的产品。请完成弓形题：选择最可能的状况、两项优先护理措施和两项用于评价的参数。",
    after: "Liam 进行 9 个月婴儿保健访视期间，他伸手去够一个化妆包，包内有一瓶未盖好瓶盖的液体对乙酰氨基酚。护士立即将化妆包和药物移到 Liam 无法触及之处。他的照护者 Danielle 对 Liam 温暖且细心，并主动说明自己如何给药。她说着说着流下眼泪，表示自己缺少可靠的支持或指导，之前听从了非正式建议。Danielle 报告曾给 Liam 服用 15 mL、浓度为 160 mg/5 mL 的对乙酰氨基酚；诊所病历中的体重分档剂量表为 Liam 列出的剂量是 3.75 mL。目前病历尚未记录最近一次 15 mL 给药的时间、这种剂量给了几次，也未记录 Liam 是否还服用了其他含对乙酰氨基酚的产品。请完成弓形题：选择最可能的状况、两项优先护理措施和两项用于评价的参数。",
    note: "Mirror the harmonized documented dose in Simplified Chinese.",
  }),
  setValue({
    id,
    path: ["bowtie", "actions", "tokens", { id: "act_teach_apap_measurement" }, "en"],
    before: "Teach the documented 5 mL dose using an appropriate oral dosing syringe and have Danielle demonstrate the measurement",
    after: "Teach the documented 3.75 mL dose using an appropriate oral dosing syringe and have Danielle demonstrate the measurement",
    note: "Update only the numeral in the keyed English teaching action.",
  }),
  setValue({
    id,
    path: ["bowtie", "actions", "tokens", { id: "act_teach_apap_measurement" }, "zh"],
    before: "使用合适的口服给药注射器教学病历所列 5 mL 剂量，并让 Danielle 回示如何量取",
    after: "使用合适的口服给药注射器教学病历所列 3.75 mL 剂量，并让 Danielle 回示如何量取",
    note: "Mirror the keyed teaching-action numeral in Simplified Chinese.",
  }),
  setValue({
    id,
    path: ["rationale", "correct", "en"],
    before: "The findings most strongly support a caregiver medication-safety knowledge deficit: Danielle followed informal advice, reports 15 mL when the documented weight-band dose is 5 mL, left an uncapped medicine bottle within reach, and remains attentive and forthcoming. Limited support and tearfulness may indicate caregiver role strain, but they do not explain the specific dosing and storage errors as directly; the disclosed errors alone do not establish neglect. Because the complete product history, timing, frequency, and total exposure are unknown, the nurse should promptly gather the available exposure details and obtain case-specific guidance from the pediatric clinician and Poison Control. The nurse should then teach the documented 5 mL dose with an oral dosing syringe and return demonstration. Follow-up should directly verify accurate measurement and storage out of Liam's reach and sight.",
    after: "The findings most strongly support a caregiver medication-safety knowledge deficit: Danielle followed informal advice, reports 15 mL when the documented weight-band dose is 3.75 mL, left an uncapped medicine bottle within reach, and remains attentive and forthcoming. Limited support and tearfulness may indicate caregiver role strain, but they do not explain the specific dosing and storage errors as directly; the disclosed errors alone do not establish neglect. Because the complete product history, timing, frequency, and total exposure are unknown, the nurse should promptly gather the available exposure details and obtain case-specific guidance from the pediatric clinician and Poison Control. The nurse should then teach the documented 3.75 mL dose with an oral dosing syringe and return demonstration. Follow-up should directly verify accurate measurement and storage out of Liam's reach and sight.",
    note: "Harmonize both documented-dose occurrences without changing the approved English rationale logic.",
  }),
  setValue({
    id,
    path: ["rationale", "correct", "zh"],
    before: "现有发现最支持照护者用药安全知识缺乏：Danielle 听从了非正式建议，在病历所列体重分档剂量为 5 mL 时报告给了 15 mL，将未盖好瓶盖的药物留在婴儿可触及之处，同时仍然细心照护并主动坦诚说明情况。支持不足和流泪可能提示照护者角色紧张，但不像知识缺乏那样直接解释具体的给药与储存错误；仅凭这些主动披露的错误不能确定儿童忽视。由于全部产品、给药时间、频率和总暴露量信息不完整，护士应立即收集当前可获得的暴露信息，并向儿科临床医生和毒物控制中心获取针对个案的指导。随后，护士应使用口服给药注射器教学病历所列 5 mL 剂量，并让 Danielle 回示。随访应直接核实其能准确量取药物，并将药物储存在 Liam 看不见、够不到之处。",
    after: "现有发现最支持照护者用药安全知识缺乏：Danielle 听从了非正式建议，在病历所列体重分档剂量为 3.75 mL 时报告给了 15 mL，将未盖好瓶盖的药物留在婴儿可触及之处，同时仍然细心照护并主动坦诚说明情况。支持不足和流泪可能提示照护者角色紧张，但不像知识缺乏那样直接解释具体的给药与储存错误；仅凭这些主动披露的错误不能确定儿童忽视。由于全部产品、给药时间、频率和总暴露量信息不完整，护士应立即收集当前可获得的暴露信息，并向儿科临床医生和毒物控制中心获取针对个案的指导。随后，护士应使用口服给药注射器教学病历所列 3.75 mL 剂量，并让 Danielle 回示。随访应直接核实其能准确量取药物，并将药物储存在 Liam 看不见、够不到之处。",
    note: "Mirror both rationale numeral substitutions in Simplified Chinese.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "act_teach_apap_measurement" }, "en"],
    before: "Using an appropriate oral dosing syringe and observing Danielle measure the documented 5 mL dose corrects the specific administration skill gap.",
    after: "Using an appropriate oral dosing syringe and observing Danielle measure the documented 3.75 mL dose corrects the specific administration skill gap.",
    note: "Update only the documented-dose numeral in the English action rationale.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "act_teach_apap_measurement" }, "zh"],
    before: "使用合适的口服给药注射器，并观察 Danielle 量取病历所列 5 mL 剂量，可纠正具体的给药技能缺口。",
    after: "使用合适的口服给药注射器，并观察 Danielle 量取病历所列 3.75 mL 剂量，可纠正具体的给药技能缺口。",
    note: "Mirror the action-rationale numeral in Simplified Chinese.",
  }),
];

runPatch(ops);
