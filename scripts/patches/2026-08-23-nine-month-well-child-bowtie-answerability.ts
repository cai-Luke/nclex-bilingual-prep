/**
 * Same-ID standalone-answerability repair for the nine-month well-child bowtie.
 *
 * The original item imported dietary, laboratory, developmental, teaching, and
 * relationship facts from its companion case. This declarative correction
 * limits every target and distractor to the medication-dosing and storage facts
 * presented in the standalone stem.
 */
import { runPatch, setValue, type PatchOp } from "../patch-raw";

export const BANK_PATH = "banks/gpt-canonical.json";
export const PATCH_REASON = "repair standalone answerability of nine-month well-child acetaminophen bowtie";

const id = "gpt_case_nine_month_well_child_safety_01_bowtie";

const lateDistractorOp = setValue({
  id,
  path: ["bowtie", "actions", "tokens", { id: "act_defer_teaching" }],
  before: {
    id: "act_defer_teaching",
    en: "Defer acetaminophen correction to the one-month follow-up to avoid overwhelming Danielle",
    zh: "为避免 Danielle 负担过重，将对乙酰氨基酚纠正推迟到 1 个月随访",
  },
  after: {
    id: "act_defer_teaching",
    en: "Defer acetaminophen correction to a follow-up visit in one month to avoid overwhelming Danielle",
    zh: "为避免 Danielle 负担过重，将对乙酰氨基酚纠正推迟到 1 个月后的随访就诊",
  },
  note: "Remove the inherited one-month follow-up presupposition identified by the first independent content review.",
});

const ops: PatchOp[] = [
  setValue({
    id,
    path: ["stem"],
    before: {
      en: "At Stage 2 of a nine-month well-child visit, the nurse has identified multiple infant safety hazards. Liam is reaching for a cosmetics pouch containing uncapped acetaminophen. Danielle is warm and engaged but tearful, lacks support, relies on informal advice, and reports giving 15 mL of 160 mg/5 mL acetaminophen when the clinic/package table in the record lists 5 mL for Liam's weight band. Complete the bow-tie by selecting the most likely condition, two priority nursing actions, and two parameters to monitor.",
      zh: "在一名 9 个月婴儿保健访视的第 2 阶段，护士发现多项婴儿安全危险。Liam 正伸手够一个化妆包，里面有未盖好瓶盖的对乙酰氨基酚。Danielle 温暖且愿意参与，但情绪难过、缺乏支持、依赖非正式建议，并报告在病历中的诊所/包装剂量表列明 Liam 体重范围为 5 mL 的情况下，曾给 15 mL 的 160 mg/5 mL 对乙酰氨基酚。请完成弓形题：选择最可能的状况、两项优先护理措施和两项需要监测的参数。",
    },
    after: {
      en: "During Liam's nine-month well-child visit, he reaches for a cosmetics pouch containing an uncapped bottle of liquid acetaminophen. The nurse immediately moves the pouch and medication out of Liam's reach. His caregiver, Danielle, is warm and attentive and willingly describes how she gives medicines. She becomes tearful and says she has little reliable support or guidance and followed informal advice. Danielle reports giving Liam 15 mL of acetaminophen labeled 160 mg/5 mL; the clinic's weight-band dosing table in the record lists 5 mL for Liam. The record does not yet document when the 15 mL dose was last given, how often it was given, or whether Liam received another acetaminophen-containing product. Complete the bow-tie by selecting the most likely condition, two priority nursing actions, and two parameters to evaluate.",
      zh: "Liam 进行 9 个月婴儿保健访视期间，他伸手去够一个化妆包，包内有一瓶未盖好瓶盖的液体对乙酰氨基酚。护士立即将化妆包和药物移到 Liam 无法触及之处。他的照护者 Danielle 对 Liam 温暖且细心，并主动说明自己如何给药。她说着说着流下眼泪，表示自己缺少可靠的支持或指导，之前听从了非正式建议。Danielle 报告曾给 Liam 服用 15 mL、浓度为 160 mg/5 mL 的对乙酰氨基酚；诊所病历中的体重分档剂量表为 Liam 列出的剂量是 5 mL。目前病历尚未记录最近一次 15 mL 给药的时间、这种剂量给了几次，也未记录 Liam 是否还服用了其他含对乙酰氨基酚的产品。请完成弓形题：选择最可能的状况、两项优先护理措施和两项用于评价的参数。",
    },
    note: "Present the medication event, close the immediate reach hazard, and expose the missing exposure-history facts without relying on the companion case.",
  }),
  setValue({
    id,
    path: ["bowtie", "condition", "tokens", { id: "cond_ipv" }],
    before: {
      id: "cond_ipv",
      en: "Intimate partner violence or coercive control as the proven driver",
      zh: "亲密伴侣暴力或控制行为已被证实是驱动因素",
    },
    after: {
      id: "cond_caregiver_role_strain",
      en: "Caregiver role strain as the primary explanation for the medication errors",
      zh: "照护者角色紧张是用药错误的主要原因",
    },
    note: "Replace the unsupported relationship-context distractor with a competing hypothesis supported by tearfulness and limited support.",
  }),
  setValue({
    id,
    path: ["bowtie", "condition", "tokens", { id: "cond_knowledge_deficit" }],
    before: {
      id: "cond_knowledge_deficit",
      en: "Caregiver knowledge deficit with multiple home hazards and acetaminophen dosing error",
      zh: "照护者知识缺乏，伴多项居家危险和对乙酰氨基酚给药错误",
    },
    after: {
      id: "cond_knowledge_deficit",
      en: "Caregiver medication-safety knowledge deficit causing dosing and storage errors",
      zh: "照护者用药安全知识缺乏，导致给药和储存错误",
    },
    note: "Name the focused construct supported by the standalone dosing and storage evidence.",
  }),
  setValue({
    id,
    path: ["bowtie", "actions", "tokens", { id: "act_teach_apap_remove_hazards" }],
    before: {
      id: "act_teach_apap_remove_hazards",
      en: "Teach the stated syringe dose with return demonstration and remove immediate choking/poisoning hazards from Liam's reach",
      zh: "用回示范教学病例所列注射器剂量，并移除 Liam 够得到的即时窒息/中毒危险",
    },
    after: {
      id: "act_teach_apap_measurement",
      en: "Teach the documented 5 mL dose using an appropriate oral dosing syringe and have Danielle demonstrate the measurement",
      zh: "使用合适的口服给药注射器教学病历所列 5 mL 剂量，并让 Danielle 回示如何量取",
    },
    note: "Make the keyed teaching action single-purpose after the stem closes the immediate reach hazard.",
  }),
  setValue({
    id,
    path: ["bowtie", "actions", "tokens", { id: "act_assess_apap" }],
    before: {
      id: "act_assess_apap",
      en: "Assess acetaminophen frequency, recency, and total exposure; escalate to provider/Poison Control if recent or repeated overdosing is reported",
      zh: "评估对乙酰氨基酚给药频率、最后一次时间和总暴露量；若近期或反复过量则升级给医护提供者/Poison Control",
    },
    after: {
      id: "act_assess_apap",
      en: "Promptly determine the product, timing, frequency, and total acetaminophen exposure and obtain case-specific guidance from the pediatric clinician and Poison Control based on the available assessment",
      zh: "立即查明具体产品、给药时间、频率和对乙酰氨基酚总暴露量，并根据当前掌握的评估信息向儿科临床医生和毒物控制中心获取个案化指导",
    },
    note: "Require the exposure facts needed for case-specific toxicology guidance without declaring that the reported dose proves poisoning.",
  }),
  lateDistractorOp,
  setValue({
    id,
    path: ["bowtie", "actions", "correct"],
    before: ["act_assess_apap", "act_teach_apap_remove_hazards"],
    after: ["act_assess_apap", "act_teach_apap_measurement"],
    note: "Resolve the renamed single-purpose teaching action.",
  }),
  setValue({
    id,
    path: ["bowtie", "parameters", "tokens", { id: "param_growth_hgb" }],
    before: {
      id: "param_growth_hgb",
      en: "Liam's growth trajectory and hemoglobin after dietary correction",
      zh: "饮食纠正后 Liam 的生长趋势和血红蛋白",
    },
    after: {
      id: "param_safe_storage",
      en: "Danielle's demonstrated or confirmed storage of medicines out of Liam's reach and sight after each use",
      zh: "确认或展示 Danielle 每次使用后都将药物储存在 Liam 看不见、够不到之处",
    },
    note: "Replace the hidden dietary/anemia endpoint with direct evaluation of medication storage.",
  }),
  setValue({
    id,
    path: ["bowtie", "parameters", "tokens", { id: "param_teachback" }],
    before: {
      id: "param_teachback",
      en: "Danielle's follow-up teach-back of dosing, safe food preparation, safe sleep, and car-seat use",
      zh: "Danielle 随访时对剂量、安全食物处理、安全睡眠和安全座椅使用的回授",
    },
    after: {
      id: "param_apap_return_demo",
      en: "Danielle's accurate follow-up return demonstration of measuring the documented acetaminophen dose",
      zh: "Danielle 随访时准确回示如何量取病历所列的对乙酰氨基酚剂量",
    },
    note: "Limit the teach-back endpoint to the medication skill actually taught in this scenario.",
  }),
  setValue({
    id,
    path: ["bowtie", "parameters", "tokens", { id: "param_lead" }],
    before: {
      id: "param_lead",
      en: "Lead level trend as the main evaluation of this safety plan",
      zh: "将血铅趋势作为该安全计划的主要评价指标",
    },
    after: {
      id: "param_confidence_only",
      en: "Danielle's stated confidence alone, without observing dose measurement or medication storage",
      zh: "只听 Danielle 表示有信心，而不观察其量取剂量或储存药物",
    },
    note: "Replace the hidden lead-testing dependency with a scenario-grounded but insufficient evaluation method.",
  }),
  setValue({
    id,
    path: ["bowtie", "parameters", "tokens", { id: "param_asq" }],
    before: {
      id: "param_asq",
      en: "ASQ-3 developmental score as the main evaluation of hazard correction",
      zh: "将 ASQ-3 发育评分作为危险纠正的主要评价指标",
    },
    after: {
      id: "param_developmental_score",
      en: "Liam's routine developmental-screen score as the main measure of medication-safety teaching",
      zh: "将 Liam 的常规发育筛查评分作为用药安全教学的主要评价指标",
    },
    note: "Remove the hidden ASQ-3 baseline while retaining a comprehensible but nonaligned distractor.",
  }),
  setValue({
    id,
    path: ["bowtie", "parameters", "correct"],
    before: ["param_teachback", "param_growth_hgb"],
    after: ["param_apap_return_demo", "param_safe_storage"],
    note: "Key only evaluation parameters that derive from the standalone medication scenario.",
  }),
  setValue({
    id,
    path: ["rationale", "correct"],
    before: {
      en: "The best synthesis is caregiver knowledge deficit with multiple hazards and an active medication-safety error. Danielle's warmth, voluntary disclosure, engagement, lack of prior guidance, and absence of injury support education and resource connection rather than an automatic neglect label. Priority actions focus on assessing acetaminophen exposure/escalating if needed and correcting the dose while removing immediate hazards. Follow-up evaluation should monitor retained safety teaching and nutritional/growth effects of the prior feeding pattern.",
      zh: "最佳综合判断是照护者知识缺乏，伴多项危险和当前用药安全错误。Danielle 的温暖互动、主动披露、参与度、缺乏既往指导以及无伤害表现，支持教育和资源连接，而不是自动贴上忽视标签。优先措施是评估对乙酰氨基酚暴露并在需要时升级处理，同时纠正剂量并移除即时危险。随访评价应监测安全教学是否保留，以及既往喂养模式对营养/生长的影响。",
    },
    after: {
      en: "The findings most strongly support a caregiver medication-safety knowledge deficit: Danielle followed informal advice, reports 15 mL when the documented weight-band dose is 5 mL, left an uncapped medicine bottle within reach, and remains attentive and forthcoming. Limited support and tearfulness may indicate caregiver role strain, but they do not explain the specific dosing and storage errors as directly; the disclosed errors alone do not establish neglect. Because the complete product history, timing, frequency, and total exposure are unknown, the nurse should promptly gather the available exposure details and obtain case-specific guidance from the pediatric clinician and Poison Control. The nurse should then teach the documented 5 mL dose with an oral dosing syringe and return demonstration. Follow-up should directly verify accurate measurement and storage out of Liam's reach and sight.",
      zh: "现有发现最支持照护者用药安全知识缺乏：Danielle 听从了非正式建议，在病历所列体重分档剂量为 5 mL 时报告给了 15 mL，将未盖好瓶盖的药物留在婴儿可触及之处，同时仍然细心照护并主动坦诚说明情况。支持不足和流泪可能提示照护者角色紧张，但不像知识缺乏那样直接解释具体的给药与储存错误；仅凭这些主动披露的错误不能确定儿童忽视。由于全部产品、给药时间、频率和总暴露量信息不完整，护士应立即收集当前可获得的暴露信息，并向儿科临床医生和毒物控制中心获取针对个案的指导。随后，护士应使用口服给药注射器教学病历所列 5 mL 剂量，并让 Danielle 回示。随访应直接核实其能准确量取药物，并将药物储存在 Liam 看不见、够不到之处。",
    },
    note: "Explain the complete repaired five-target logic using only presented medication facts.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "cond_knowledge_deficit" }],
    before: {
      refId: "cond_knowledge_deficit",
      en: "This condition integrates the misinformation pattern, Danielle's engagement, and the active medication-safety problem.",
      zh: "这一状况整合了错误信息模式、Danielle 的参与度以及当前用药安全问题。",
    },
    after: {
      refId: "cond_knowledge_deficit",
      en: "The specific dose discrepancy, accessible uncapped medicine, reliance on informal advice, and willingness to learn directly support a medication-safety knowledge deficit.",
      zh: "具体的剂量差异、可触及且未盖好瓶盖的药物、依赖非正式建议以及愿意学习，都直接支持用药安全知识缺乏。",
    },
    note: "Ground the keyed condition in four facts visible in the repaired stem.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "cond_neglect" }],
    before: {
      refId: "cond_neglect",
      en: "Neglect is less supported by current facts because Danielle is affectionate, voluntarily seeking care, discloses practices, and is willing to learn.",
      zh: "当前事实较不支持忽视，因为 Danielle 有爱、主动就医、坦诚披露并愿意学习。",
    },
    after: {
      refId: "cond_neglect",
      en: "The medication errors require exposure assessment and correction, but Danielle's attentiveness and voluntary disclosure do not establish neglect as the primary explanation.",
      zh: "这些用药错误需要评估暴露并予以纠正，但 Danielle 的细心照护和主动披露不足以确定儿童忽视是主要解释。",
    },
    note: "Avoid importing absent injury or care-seeking facts while distinguishing the presented error from proven neglect.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "cond_ipv" }],
    before: {
      refId: "cond_ipv",
      en: "The partner's behavior should be explored privately, but the vignette does not prove IPV or coercive control as the driver.",
      zh: "伴侣行为应私下进一步评估，但题干没有证明亲密伴侣暴力或控制行为是驱动因素。",
    },
    after: {
      refId: "cond_caregiver_role_strain",
      en: "Tearfulness and limited support make caregiver role strain plausible, but knowledge deficit more directly explains the stated dosing and storage errors.",
      zh: "流泪和支持不足使照护者角色紧张成为合理的备选解释，但知识缺乏更直接地解释了题干中的给药和储存错误。",
    },
    note: "Explain the new supported competing hypothesis without relying on absent partner behavior.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "act_assess_apap" }],
    before: {
      refId: "act_assess_apap",
      en: "The nurse needs timing and frequency to determine whether toxic exposure evaluation is needed and to involve appropriate experts.",
      zh: "护士需要了解时间和频率，以判断是否需要中毒暴露评估并让适当专家参与。",
    },
    after: {
      refId: "act_assess_apap",
      en: "Case-specific poison guidance depends on the product, amount, timing, age or weight, symptoms, and repeated or overlapping doses. The nurse should gather the available details promptly; missing information should not delay consultation.",
      zh: "个案化毒物处理建议取决于具体产品、用量、时间、年龄或体重、症状以及是否反复给药或与其他产品重叠。护士应立即收集当前可获得的信息；不应因信息尚不完整而延迟咨询。",
    },
    note: "State the exposure-assessment inputs that drive individualized toxicology guidance.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "act_teach_apap_remove_hazards" }],
    before: {
      refId: "act_teach_apap_remove_hazards",
      en: "This action corrects the ongoing dosing error and removes the immediate reach hazards before the family leaves.",
      zh: "这一措施纠正持续存在的剂量错误，并在家属离开前移除眼前可触及的危险。",
    },
    after: {
      refId: "act_teach_apap_measurement",
      en: "Using an appropriate oral dosing syringe and observing Danielle measure the documented 5 mL dose corrects the specific administration skill gap.",
      zh: "使用合适的口服给药注射器，并观察 Danielle 量取病历所列 5 mL 剂量，可纠正具体的给药技能缺口。",
    },
    note: "Explain only the renamed single-purpose teaching action.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "act_cps_now" }],
    before: {
      refId: "act_cps_now",
      en: "A report based only on the unsafe practices is not the priority when the current evidence points to knowledge deficit and teachability rather than refusal or injury.",
      zh: "当前证据指向知识缺乏和可教育性，而非拒绝或伤害；仅因不安全做法就报告不是优先措施。",
    },
    after: {
      refId: "act_cps_now",
      en: "The disclosed dosing and storage errors alone do not establish neglect; the immediate priorities are exposure assessment and correction of the demonstrated medication-safety gaps.",
      zh: "仅凭主动披露的给药和储存错误不能确定儿童忽视；当前优先事项是评估暴露并纠正已表现出的用药安全缺口。",
    },
    note: "Remove absent refusal and injury facts from the distractor rationale.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "act_defer_teaching" }],
    before: {
      refId: "act_defer_teaching",
      en: "Deferring medication correction leaves a potentially dangerous dosing error active at home.",
      zh: "推迟纠正用药会让家中继续存在可能危险的剂量错误。",
    },
    after: {
      refId: "act_defer_teaching",
      en: "Deferring teaching leaves the documented dosing and measurement error uncorrected.",
      zh: "推迟教学会让病历中已明确的给药和量取错误得不到纠正。",
    },
    note: "Tie the rationale to the presented documented error without asserting a toxicity outcome.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "param_teachback" }],
    before: {
      refId: "param_teachback",
      en: "Teach-back at follow-up directly evaluates whether the safety teaching was retained and can be applied.",
      zh: "随访回授可直接评价安全教学是否被记住并能应用。",
    },
    after: {
      refId: "param_apap_return_demo",
      en: "Accurately measuring the documented dose at follow-up directly demonstrates whether Danielle retained and can apply the taught skill.",
      zh: "随访时准确量取病历所列剂量，可直接展示 Danielle 是否记住并能应用所学技能。",
    },
    note: "Make the evaluation target observable and limited to acetaminophen measurement.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "param_growth_hgb" }],
    before: {
      refId: "param_growth_hgb",
      en: "Growth and hemoglobin help evaluate whether dietary correction after premature cow's milk use is effective.",
      zh: "生长和血红蛋白有助于评价过早使用牛奶后的饮食纠正是否有效。",
    },
    after: {
      refId: "param_safe_storage",
      en: "Demonstrated or confirmed storage out of Liam's reach and sight directly evaluates correction of the access hazard shown in the stem.",
      zh: "展示或确认药物储存在 Liam 看不见、够不到之处，可直接评价题干所示可触及危险是否已得到纠正。",
    },
    note: "Replace the hidden cow's-milk/anemia rationale with direct storage evaluation.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "param_lead" }],
    before: {
      refId: "param_lead",
      en: "The lead level is below the reference value and does not measure correction of the identified hazards.",
      zh: "血铅低于参考值，并不能衡量已识别危险是否被纠正。",
    },
    after: {
      refId: "param_confidence_only",
      en: "Reported confidence is subjective and, by itself, does not show that Danielle can accurately measure the dose or store medicines safely.",
      zh: "自述有信心属于主观信息，单凭这一点不能证明 Danielle 能准确量取剂量或安全储存药物。",
    },
    note: "Remove the hidden lead result and explain why confidence alone is insufficient evaluation.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "param_asq" }],
    before: {
      refId: "param_asq",
      en: "ASQ-3 is normal and does not evaluate whether home hazards or medication dosing have been corrected.",
      zh: "ASQ-3 正常，不能评价居家危险或药物剂量是否已纠正。",
    },
    after: {
      refId: "param_developmental_score",
      en: "A routine developmental-screen score does not directly evaluate medication measurement or storage behavior.",
      zh: "常规发育筛查评分不能直接评价药物量取或储存行为。",
    },
    note: "Remove the hidden normal baseline and retain only the construct-alignment explanation.",
  }),
  setValue({
    id,
    path: ["testTakingStrategy"],
    before: {
      en: "For bow-tie items, align the center condition with the whole pattern, not the scariest distractor. Then choose actions that address the active danger and parameters that evaluate whether the teaching changed behavior.",
      zh: "做弓形题时，中心状况要与整体模式一致，而不是选择最吓人的干扰项。之后选择能处理当前危险的措施，以及能评价教学是否改变行为的监测参数。",
    },
    after: {
      en: "Use the findings presented to identify the explanation that best fits both the dosing and storage errors. Treat the moved medication as a hazard already controlled; choose next actions and follow-up measures that directly assess exposure and demonstrate safer behavior.",
      zh: "根据题干中的发现，选择最能同时解释给药和储存错误的状况。药物已经被移走，因此该即时危险已得到控制；接下来应选择能直接评估暴露并展示更安全行为的措施和随访指标。",
    },
    note: "Help the learner distinguish the already-controlled reach hazard from the next assessment, teaching, and evaluation steps.",
  }),
];

const patchOps = process.argv.includes("--late-fix-only")
  ? [lateDistractorOp]
  : process.argv.includes("--base-repair-only")
    ? ops.filter((op) => op !== lateDistractorOp)
    : ops;

runPatch(patchOps);
